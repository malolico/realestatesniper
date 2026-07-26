/**
 * P-INT-04 Offline — envelope integrity helpers (Plan §14 / §16).
 */

import crypto from "node:crypto";
import fs from "node:fs";
import {
  DECISION_PACKAGE_SECTIONS,
  DECISION_PACKAGE_VERSION,
  validateDecisionPackageShape,
} from "../decisionPackageSchema.js";
import { computeCanonicalContentChecksum } from "./decisionPackageCanonicalize.js";

export const EXPORT_SCHEMA_VERSION = 1;
export const EXPORT_MODE_OFFLINE_LOCAL = "OFFLINE_LOCAL";

export const ENVELOPE_ALLOWLIST = Object.freeze([
  "exportSchemaVersion",
  "decisionPackageVersion",
  "packageId",
  "factory_key",
  "generatedAt",
  "canonicalContentChecksum",
  "exportMode",
  "boundarySummary",
  "inputSnapshotRefs",
  "payload",
]);

/**
 * @param {string|Buffer} bytes
 */
export function sha256Hex(bytes) {
  return crypto.createHash("sha256").update(bytes).digest("hex");
}

/**
 * @param {string} filePath
 */
export function fsyncFile(filePath) {
  const fd = fs.openSync(filePath, "r+");
  try {
    fs.fsyncSync(fd);
  } finally {
    fs.closeSync(fd);
  }
}

/**
 * @param {string} hashHex
 */
export function formatExportSidecar(hashHex) {
  return `${JSON.stringify(
    {
      algorithm: "sha256",
      sha256: hashHex,
    },
    null,
    2
  )}\n`;
}

/**
 * @param {string} raw
 */
export function parseExportSidecar(raw) {
  let parsed;
  try {
    parsed = JSON.parse(raw);
  } catch {
    throw new Error("[P-INT-04 Integrity] Sidecar JSON corrupt");
  }
  if (
    parsed == null ||
    typeof parsed !== "object" ||
    typeof parsed.sha256 !== "string" ||
    !/^[a-f0-9]{64}$/i.test(parsed.sha256)
  ) {
    throw new Error("[P-INT-04 Integrity] Sidecar schema invalid");
  }
  return { sha256: parsed.sha256.toLowerCase() };
}

/**
 * Reject unknown envelope keys (Plan §14 / M3).
 * @param {object} envelope
 */
export function assertEnvelopeAllowlist(envelope) {
  if (envelope == null || typeof envelope !== "object" || Array.isArray(envelope)) {
    throw new Error("[P-INT-04 Integrity] Envelope must be an object");
  }
  for (const key of Object.keys(envelope)) {
    if (!ENVELOPE_ALLOWLIST.includes(key)) {
      throw new Error(`[P-INT-04 Integrity] Unknown envelope field: ${key}`);
    }
  }
  for (const key of ENVELOPE_ALLOWLIST) {
    if (!(key in envelope)) {
      throw new Error(`[P-INT-04 Integrity] Missing envelope field: ${key}`);
    }
  }
}

/**
 * Reject unknown top-level payload sections beyond CB-16 allowlist.
 * @param {object} payload
 */
export function assertPayloadTopLevelAllowlist(payload) {
  if (payload == null || typeof payload !== "object") {
    throw new Error("[P-INT-04 Integrity] payload must be an object");
  }
  for (const key of Object.keys(payload)) {
    if (!DECISION_PACKAGE_SECTIONS.includes(key)) {
      throw new Error(`[P-INT-04 Integrity] Unknown payload field: ${key}`);
    }
  }
}

/**
 * @param {object} boundary
 */
export function buildBoundarySummary(boundary) {
  return {
    decides: boundary?.decides === false ? false : boundary?.decides,
    classifiesDeal: boundary?.classifiesDeal === false ? false : boundary?.classifiesDeal,
    classifiesPremium:
      boundary?.classifiesPremium === false ? false : boundary?.classifiesPremium,
    classifiesDiamond:
      boundary?.classifiesDiamond === false ? false : boundary?.classifiesDiamond,
    assignsAccessTier:
      boundary?.assignsAccessTier === false ? false : boundary?.assignsAccessTier,
    setsPricing: boundary?.setsPricing === false ? false : boundary?.setsPricing,
  };
}

/**
 * @param {object} envelope
 */
export function assertBoundarySummaryMatches(envelope) {
  const summary = envelope.boundarySummary;
  const b = envelope.payload?.boundary;
  if (!summary || !b) {
    throw new Error("[P-INT-04 Integrity] boundarySummary/payload.boundary required");
  }
  const keys = [
    "decides",
    "classifiesDeal",
    "classifiesPremium",
    "classifiesDiamond",
    "assignsAccessTier",
    "setsPricing",
  ];
  for (const k of keys) {
    if (summary[k] !== b[k]) {
      throw new Error(`[P-INT-04 Integrity] boundarySummary.${k} mismatch`);
    }
  }
  if (summary.decides !== false) {
    throw new Error("[P-INT-04 Integrity] boundary.decides must be false");
  }
}

/**
 * Validate envelope structure + versions + payload shape + dual identity.
 * @param {object} envelope
 */
export function validateExportEnvelope(envelope) {
  assertEnvelopeAllowlist(envelope);

  if (envelope.exportSchemaVersion !== EXPORT_SCHEMA_VERSION) {
    throw new Error(
      `[P-INT-04 Integrity] Unknown exportSchemaVersion: ${envelope.exportSchemaVersion}`
    );
  }
  if (envelope.exportMode !== EXPORT_MODE_OFFLINE_LOCAL) {
    throw new Error(`[P-INT-04 Integrity] Invalid exportMode: ${envelope.exportMode}`);
  }
  if (envelope.decisionPackageVersion !== DECISION_PACKAGE_VERSION) {
    throw new Error(
      `[P-INT-04 Integrity] Unsupported decisionPackageVersion: ${envelope.decisionPackageVersion}`
    );
  }

  assertPayloadTopLevelAllowlist(envelope.payload);
  const shape = validateDecisionPackageShape(envelope.payload);
  if (!shape.valid) {
    throw new Error(`[P-INT-04 Integrity] Invalid CB-16 payload: ${shape.errors.join("; ")}`);
  }

  assertBoundarySummaryMatches(envelope);

  const recomputed = computeCanonicalContentChecksum(envelope.payload);
  if (recomputed !== envelope.canonicalContentChecksum) {
    throw new Error("[P-INT-04 Integrity] canonicalContentChecksum mismatch (fail-closed)");
  }

  const expectedId = `dpkg-${envelope.factory_key}-${envelope.canonicalContentChecksum}`;
  if (envelope.packageId !== expectedId) {
    throw new Error("[P-INT-04 Integrity] packageId mismatch (fail-closed)");
  }

  if (envelope.payload.identity?.factory_key !== envelope.factory_key) {
    throw new Error("[P-INT-04 Integrity] factory_key mismatch");
  }
}

/**
 * Physical + logical verify for on-disk pair.
 * @param {string} envelopePath
 * @param {string} sidecarPath
 * @returns {object} envelope
 */
export function verifyExportArtifactPair(envelopePath, sidecarPath) {
  if (!fs.existsSync(envelopePath)) {
    throw new Error("[P-INT-04 Integrity] Envelope missing");
  }
  if (!fs.existsSync(sidecarPath)) {
    throw new Error("[P-INT-04 Integrity] Sidecar missing (fail-closed)");
  }

  const envelopeBytes = fs.readFileSync(envelopePath, "utf8");
  const sidecarRaw = fs.readFileSync(sidecarPath, "utf8");
  const side = parseExportSidecar(sidecarRaw);
  const fileHash = sha256Hex(envelopeBytes);
  if (fileHash !== side.sha256) {
    throw new Error("[P-INT-04 Integrity] Sidecar checksum mismatch (fail-closed)");
  }

  let envelope;
  try {
    envelope = JSON.parse(envelopeBytes);
  } catch {
    throw new Error("[P-INT-04 Integrity] Envelope JSON corrupt (fail-closed)");
  }

  validateExportEnvelope(envelope);
  return envelope;
}

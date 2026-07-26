/**
 * P-INT-04 Live — DecisionPackageLiveSinkPort contract helpers (Plan §7–§8).
 * Vendor-neutral. Does not decide. Does not classify.
 */

import { assertValidFactoryKey } from "../../cb01/factoryKey.js";
import { computeCanonicalContentChecksum } from "./decisionPackageCanonicalize.js";
import {
  ENVELOPE_ALLOWLIST,
  EXPORT_MODE_OFFLINE_LOCAL,
  EXPORT_SCHEMA_VERSION,
  sha256Hex,
} from "./decisionPackageIntegrity.js";

export const EXPORT_MODE_LIVE_VERSIONED = "LIVE_VERSIONED";

export const LIVE_PUT_META_ALLOWLIST = Object.freeze([
  "packageId",
  "factory_key",
  "canonicalContentChecksum",
  "contentSha256",
  "exportMode",
  "exportSchemaVersion",
  "remoteRef",
  "liveAttemptId",
]);

export const LIVE_EXPECTED_ALLOWLIST = Object.freeze([
  "contentSha256",
  "canonicalContentChecksum",
  "packageId",
  "factory_key",
  "exportMode",
  "exportSchemaVersion",
]);

export const DEFAULT_LIVE_MAX_BYTES = 5 * 1024 * 1024;

/**
 * @param {string} factoryKey
 * @param {string} packageId
 */
export function resolveRemoteKey(factoryKey, packageId) {
  assertValidFactoryKey(factoryKey);
  if (typeof packageId !== "string" || !packageId.startsWith("dpkg-")) {
    throw new Error("[P-INT-04 Live] Invalid packageId");
  }
  if (packageId.includes("..") || packageId.includes("/") || packageId.includes("\\")) {
    throw new Error("[P-INT-04 Live] packageId path traversal rejected");
  }
  return `live/v1/${factoryKey}/${packageId}.envelope.json`;
}

/**
 * Sole contractual locator (Plan M3 — remoteRef only).
 * @param {string} remoteKey
 */
export function buildRemoteRef(remoteKey) {
  if (typeof remoteKey !== "string" || !remoteKey.startsWith("live/v1/")) {
    throw new Error("[P-INT-04 Live] Invalid remoteKey for remoteRef");
  }
  return `live://${remoteKey}`;
}

/**
 * Build DecisionPackageConsumerLocator (contract only — not an Engine).
 * @param {object} fields
 */
export function buildDecisionPackageConsumerLocator(fields) {
  const locator = {
    packageId: fields.packageId,
    canonicalContentChecksum: fields.canonicalContentChecksum,
    remoteKey: fields.remoteKey,
    exportMode: EXPORT_MODE_LIVE_VERSIONED,
    exportSchemaVersion: fields.exportSchemaVersion,
    factory_key: fields.factory_key,
    remoteRef: fields.remoteRef,
  };
  const banned = [
    "opportunityClass",
    "accessTier",
    "pricing",
    "publicationEligibility",
    "deliveryStatus",
    "HANDOFF_EXECUTED",
  ];
  for (const k of banned) {
    if (k in fields) {
      throw new Error(`[P-INT-04 Live] Locator must not include ${k}`);
    }
  }
  return locator;
}

/**
 * Stable Live remote bytes from verified Offline envelope (Plan §6.2).
 * @param {object} offlineEnvelope
 * @returns {{ envelope: object, bytes: string, contentSha256: string }}
 */
export function buildStableLiveEnvelopeBytes(offlineEnvelope) {
  if (offlineEnvelope == null || typeof offlineEnvelope !== "object") {
    throw new Error("[P-INT-04 Live] Offline envelope required");
  }
  if (offlineEnvelope.exportMode !== EXPORT_MODE_OFFLINE_LOCAL) {
    throw new Error(
      `[P-INT-04 Live] Offline envelope exportMode must be OFFLINE_LOCAL, got ${offlineEnvelope.exportMode}`
    );
  }

  /** @type {Record<string, unknown>} */
  const live = {};
  for (const key of ENVELOPE_ALLOWLIST) {
    if (!(key in offlineEnvelope)) {
      throw new Error(`[P-INT-04 Live] Missing offline envelope field: ${key}`);
    }
    live[key] =
      key === "exportMode" ? EXPORT_MODE_LIVE_VERSIONED : offlineEnvelope[key];
  }

  for (const key of Object.keys(offlineEnvelope)) {
    if (!ENVELOPE_ALLOWLIST.includes(key)) {
      throw new Error(`[P-INT-04 Live] Unknown offline envelope field: ${key}`);
    }
  }

  const bytes = `${JSON.stringify(live)}\n`;
  return {
    envelope: live,
    bytes,
    contentSha256: sha256Hex(bytes),
  };
}

/**
 * @param {object} meta
 */
export function assertLivePutMetaAllowlist(meta) {
  if (meta == null || typeof meta !== "object" || Array.isArray(meta)) {
    throw new Error("[P-INT-04 Live] put meta must be an object");
  }
  for (const key of Object.keys(meta)) {
    if (!LIVE_PUT_META_ALLOWLIST.includes(key)) {
      throw new Error(`[P-INT-04 Live] Unknown put meta field: ${key}`);
    }
  }
  for (const key of LIVE_PUT_META_ALLOWLIST) {
    if (key === "liveAttemptId") continue;
    if (!(key in meta)) {
      throw new Error(`[P-INT-04 Live] Missing put meta field: ${key}`);
    }
  }
  if (meta.exportMode !== EXPORT_MODE_LIVE_VERSIONED) {
    throw new Error("[P-INT-04 Live] put meta exportMode must be LIVE_VERSIONED");
  }
  if (meta.exportSchemaVersion !== EXPORT_SCHEMA_VERSION) {
    throw new Error("[P-INT-04 Live] put meta exportSchemaVersion unsupported");
  }
}

/**
 * @param {object} expected
 */
export function assertLiveExpectedAllowlist(expected) {
  if (expected == null || typeof expected !== "object" || Array.isArray(expected)) {
    throw new Error("[P-INT-04 Live] expected must be an object");
  }
  for (const key of Object.keys(expected)) {
    if (!LIVE_EXPECTED_ALLOWLIST.includes(key)) {
      throw new Error(`[P-INT-04 Live] Unknown expected field: ${key}`);
    }
  }
  for (const key of LIVE_EXPECTED_ALLOWLIST) {
    if (!(key in expected)) {
      throw new Error(`[P-INT-04 Live] Missing expected field: ${key}`);
    }
  }
}

/**
 * Plan §7.1.1 verify algorithm against bytes already fetched.
 * @param {string} bytes
 * @param {object} expected
 */
export function verifyLiveEnvelopeBytes(bytes, expected) {
  assertLiveExpectedAllowlist(expected);
  if (typeof bytes !== "string") {
    throw new Error("[P-INT-04 Live] Envelope bytes missing (fail-closed)");
  }
  const sha = sha256Hex(bytes);
  if (sha !== expected.contentSha256) {
    throw new Error("[P-INT-04 Live] contentSha256 mismatch (fail-closed)");
  }

  let envelope;
  try {
    envelope = JSON.parse(bytes);
  } catch {
    throw new Error("[P-INT-04 Live] Envelope JSON corrupt (fail-closed)");
  }

  for (const key of Object.keys(envelope)) {
    if (!ENVELOPE_ALLOWLIST.includes(key)) {
      throw new Error(`[P-INT-04 Live] Unknown envelope field: ${key}`);
    }
  }
  for (const key of ENVELOPE_ALLOWLIST) {
    if (!(key in envelope)) {
      throw new Error(`[P-INT-04 Live] Missing envelope field: ${key}`);
    }
  }

  if (envelope.canonicalContentChecksum !== expected.canonicalContentChecksum) {
    throw new Error("[P-INT-04 Live] canonicalContentChecksum field mismatch");
  }
  if (envelope.packageId !== expected.packageId) {
    throw new Error("[P-INT-04 Live] packageId field mismatch");
  }
  if (envelope.factory_key !== expected.factory_key) {
    throw new Error("[P-INT-04 Live] factory_key field mismatch");
  }
  if (envelope.exportMode !== expected.exportMode) {
    throw new Error("[P-INT-04 Live] exportMode field mismatch");
  }
  if (envelope.exportSchemaVersion !== expected.exportSchemaVersion) {
    throw new Error("[P-INT-04 Live] exportSchemaVersion field mismatch");
  }
  if (expected.exportMode !== EXPORT_MODE_LIVE_VERSIONED) {
    throw new Error("[P-INT-04 Live] expected.exportMode must be LIVE_VERSIONED");
  }

  const recomputed = computeCanonicalContentChecksum(envelope.payload);
  if (recomputed !== expected.canonicalContentChecksum) {
    throw new Error("[P-INT-04 Live] canonicalContentChecksum recompute mismatch");
  }
  const expectedId = `dpkg-${expected.factory_key}-${expected.canonicalContentChecksum}`;
  if (expected.packageId !== expectedId) {
    throw new Error("[P-INT-04 Live] packageId identity mismatch");
  }

  return envelope;
}

/**
 * Duck-type documentation for DecisionPackageLiveSinkPort.
 * Concrete: InMemoryDecisionPackageLiveSink.
 */
export const DecisionPackageLiveSinkPort = Object.freeze({
  name: "DecisionPackageLiveSinkPort",
  methods: Object.freeze([
    "head",
    "putIfAbsent",
    "get",
    "verify",
    "resolveRemoteKey",
  ]),
});

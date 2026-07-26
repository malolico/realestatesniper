/**
 * CB-01 / P-INT-03 — ELR store integrity helpers (SHA-256 + sidecar).
 * Store-format metadata only — does not alter constitutional ELR schema.
 */

import crypto from "node:crypto";
import fs from "node:fs";

/** Supported AtomicFileElrStore format version (sidecar metadata). */
export const STORE_FORMAT_VERSION = 1;

/**
 * Pretty JSON + trailing newline — parity with FileElrStore.
 * @param {object} payload
 * @returns {string}
 */
export function serializeExpedienteBytes(payload) {
  return `${JSON.stringify(payload, null, 2)}\n`;
}

/**
 * @param {string|Buffer} bytes
 * @returns {string} lowercase hex
 */
export function sha256Hex(bytes) {
  return crypto.createHash("sha256").update(bytes).digest("hex");
}

/**
 * @param {number} storeFormatVersion
 * @param {string} hashHex
 * @returns {string}
 */
export function formatSidecarContent(storeFormatVersion, hashHex) {
  return `${JSON.stringify(
    {
      storeFormatVersion,
      algorithm: "sha256",
      sha256: hashHex,
    },
    null,
    2
  )}\n`;
}

/**
 * @param {string} raw
 * @returns {{ storeFormatVersion: number, sha256: string }}
 */
export function parseSidecarContent(raw) {
  let parsed;
  try {
    parsed = JSON.parse(raw);
  } catch {
    throw new Error("[ELR Integrity] Sidecar JSON corrupt");
  }
  if (
    parsed == null ||
    typeof parsed !== "object" ||
    typeof parsed.storeFormatVersion !== "number" ||
    typeof parsed.sha256 !== "string" ||
    !/^[a-f0-9]{64}$/i.test(parsed.sha256)
  ) {
    throw new Error("[ELR Integrity] Sidecar schema invalid");
  }
  return {
    storeFormatVersion: parsed.storeFormatVersion,
    sha256: parsed.sha256.toLowerCase(),
  };
}

/**
 * Verify canonical JSON + sidecar pair. Fail-closed on any defect.
 * @param {string} dataPath
 * @param {string} sidecarPath
 * @param {{ supportedVersions?: number[] }} [options]
 * @returns {{ bytes: string, hash: string, storeFormatVersion: number, record: object }}
 */
export function verifyExpedientePair(dataPath, sidecarPath, options = {}) {
  const supported = options.supportedVersions ?? [STORE_FORMAT_VERSION];

  if (!fs.existsSync(dataPath)) {
    throw new Error("[ELR Integrity] Canonical JSON missing");
  }
  if (!fs.existsSync(sidecarPath)) {
    throw new Error("[ELR Integrity] Sidecar missing (fail-closed)");
  }

  const bytes = fs.readFileSync(dataPath, "utf8");
  const sidecarRaw = fs.readFileSync(sidecarPath, "utf8");
  const meta = parseSidecarContent(sidecarRaw);

  if (!supported.includes(meta.storeFormatVersion)) {
    throw new Error(
      `[ELR Integrity] Unknown storeFormatVersion: ${meta.storeFormatVersion}`
    );
  }

  const hash = sha256Hex(bytes);
  if (hash !== meta.sha256) {
    throw new Error("[ELR Integrity] Checksum mismatch (fail-closed)");
  }

  let record;
  try {
    record = JSON.parse(bytes);
  } catch {
    throw new Error("[ELR Integrity] Canonical JSON corrupt (fail-closed)");
  }
  if (record == null || typeof record !== "object") {
    throw new Error("[ELR Integrity] Canonical JSON not an object (fail-closed)");
  }

  return { bytes, hash, storeFormatVersion: meta.storeFormatVersion, record };
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

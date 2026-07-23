/**
 * II.2 integrity: SHA-256 over JCS bytes, excluding integrity.checksum.
 */

import crypto from "node:crypto";
import { canonicalize } from "./canonicalize.js";
import {
  INTEGRITY_ALGORITHM,
  INTEGRITY_CANONICALIZATION,
} from "./constants.js";

/**
 * Clone payload with integrity.checksum removed for digest input.
 * @param {object} payload
 * @returns {object}
 */
export function payloadForChecksum(payload) {
  if (!payload || typeof payload !== "object" || Array.isArray(payload)) {
    throw new Error("Checksum input must be an object");
  }
  const clone = structuredClone(payload);
  if (clone.integrity && typeof clone.integrity === "object") {
    delete clone.integrity.checksum;
  }
  return clone;
}

/**
 * @param {object} payload
 * @returns {string} lowercase hex SHA-256
 */
export function computeChecksum(payload) {
  const input = payloadForChecksum(payload);
  const canonical = canonicalize(input);
  return crypto.createHash("sha256").update(canonical, "utf8").digest("hex");
}

/**
 * @param {object} payload
 * @param {{ verified?: boolean }} [options]
 * @returns {object} payload with integrity filled
 */
export function attachIntegrity(payload, options = {}) {
  const next = structuredClone(payload);
  next.integrity = {
    algorithm: INTEGRITY_ALGORITHM,
    canonicalization: INTEGRITY_CANONICALIZATION,
    checksum: "",
    // verified participates in the digest; set before hashing
    verified: options.verified === true,
  };
  next.integrity.checksum = computeChecksum(next);
  return next;
}

/**
 * @param {object} payload
 * @returns {{ ok: boolean, expected: string, actual: string }}
 */
export function verifyChecksum(payload) {
  const actual =
    payload?.integrity && typeof payload.integrity.checksum === "string"
      ? payload.integrity.checksum
      : "";
  const expected = computeChecksum(payload);
  return { ok: actual === expected, expected, actual };
}

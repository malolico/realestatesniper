/**
 * P-INT-04 Offline — Decision Package canonicalization (Plan §15).
 * Does not mutate CB-16 schema; produces a hash view only.
 */

import crypto from "node:crypto";

/**
 * @param {unknown} value
 * @returns {unknown}
 */
function sortKeysDeep(value) {
  if (Array.isArray(value)) {
    return value.map(sortKeysDeep);
  }
  if (value !== null && typeof value === "object") {
    /** @type {Record<string, unknown>} */
    const out = {};
    for (const key of Object.keys(value).sort()) {
      const v = /** @type {Record<string, unknown>} */ (value)[key];
      if (v === undefined) continue;
      out[key] = sortKeysDeep(v);
    }
    return out;
  }
  return value;
}

/**
 * Canonical payload view: strip meta.builtAt only, recursive key sort.
 * @param {object} payload — CB-16 Decision Package
 * @returns {object}
 */
export function buildCanonicalPayloadView(payload) {
  if (payload == null || typeof payload !== "object") {
    throw new Error("[P-INT-04 Canonicalize] payload must be an object");
  }
  const cloned = JSON.parse(JSON.stringify(payload));
  if (cloned.meta && typeof cloned.meta === "object") {
    const { builtAt: _builtAt, ...metaRest } = cloned.meta;
    cloned.meta = metaRest;
  }
  return /** @type {object} */ (sortKeysDeep(cloned));
}

/**
 * Compact JSON + trailing newline (Plan §15).
 * @param {object} payload
 * @returns {string}
 */
export function canonicalizeDecisionPackage(payload) {
  const view = buildCanonicalPayloadView(payload);
  return `${JSON.stringify(view)}\n`;
}

/**
 * @param {object} payload
 * @returns {string} lowercase hex SHA-256
 */
export function computeCanonicalContentChecksum(payload) {
  const bytes = canonicalizeDecisionPackage(payload);
  return crypto.createHash("sha256").update(bytes, "utf8").digest("hex");
}

/**
 * @param {string} factoryKey
 * @param {string} canonicalContentChecksum
 */
export function buildPackageId(factoryKey, canonicalContentChecksum) {
  if (typeof factoryKey !== "string" || !factoryKey) {
    throw new Error("[P-INT-04 Canonicalize] factory_key required");
  }
  if (!/^[a-f0-9]{64}$/.test(canonicalContentChecksum)) {
    throw new Error("[P-INT-04 Canonicalize] canonicalContentChecksum must be 64-char hex");
  }
  return `dpkg-${factoryKey}-${canonicalContentChecksum}`;
}

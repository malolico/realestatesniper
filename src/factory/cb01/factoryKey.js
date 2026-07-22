/**
 * CB-01 — factory_key resolution (provisional → definitive)
 */

import { randomUUID } from "node:crypto";
import { FACTORY_KEY_PATTERN } from "../cb00/operationalVocabulary.js";

export const PROVISIONAL_PREFIX = "prov-";

/**
 * @param {string} key
 */
export function assertValidFactoryKey(key) {
  if (typeof key !== "string" || !FACTORY_KEY_PATTERN.test(key)) {
    throw new Error(`[CB-01 Registry] Invalid factory_key: ${key}`);
  }
}

/**
 * @param {string} key
 */
export function isProvisionalFactoryKey(key) {
  return typeof key === "string" && key.startsWith(PROVISIONAL_PREFIX);
}

/**
 * @param {string} [seed]
 */
export function createProvisionalFactoryKey(seed) {
  const suffix = seed
    ? seed.replace(/[^a-z0-9._-]/gi, "").slice(0, 64)
    : randomUUID().replace(/-/g, "").slice(0, 16);
  const key = `${PROVISIONAL_PREFIX}${suffix}`;
  assertValidFactoryKey(key);
  return key;
}

/**
 * @param {string} provisionalKey
 * @param {string} definitiveKey
 */
export function buildFactoryKeyHistoryEntry(provisionalKey, definitiveKey, actor, reason) {
  assertValidFactoryKey(provisionalKey);
  assertValidFactoryKey(definitiveKey);
  return {
    from: provisionalKey,
    to: definitiveKey,
    at: new Date().toISOString(),
    actor: actor ?? "MOT-IDN-01",
    reason: reason ?? "identity_resolution",
  };
}

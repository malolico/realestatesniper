/**
 * CB-01 / P-INT-03 — ElrStorePort (duck-type contract for FactoryRegistry).
 *
 * Does not reinterpret ELR sections. Persistence only.
 */

export const ELR_STORE_REQUIRED_METHODS = Object.freeze([
  "exists",
  "read",
  "write",
  "resolvePath",
  "listFactoryKeys",
]);

/** Optional lifecycle (AtomicFileElrStore); absent on FileElrStore = no-op at call site. */
export const ELR_STORE_OPTIONAL_METHODS = Object.freeze(["removeArtifacts"]);

/**
 * @param {object} store
 * @returns {true}
 */
export function assertElrStorePort(store) {
  if (store == null || typeof store !== "object") {
    throw new Error("[ElrStorePort] store must be an object");
  }
  for (const method of ELR_STORE_REQUIRED_METHODS) {
    if (typeof store[method] !== "function") {
      throw new Error(`[ElrStorePort] missing method: ${method}`);
    }
  }
  return true;
}

/**
 * @param {object} store
 * @returns {boolean}
 */
export function hasRemoveArtifacts(store) {
  return store != null && typeof store.removeArtifacts === "function";
}

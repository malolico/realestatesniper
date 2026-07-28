/**
 * P-INT-03 Durable — Object Store backend contract (Phase 1 infrastructure).
 *
 * Mandate: P-INT-03-DURABLE-OBJECT-STORE-IMPL
 * Path: OBJECT STORE only.
 *
 * Does not reinterpret ELR. Does not touch Product / Deals / Marketplace /
 * Supabase / SQLite / Dedicated DB. No package.json dependencies.
 */

export const OBJECT_STORE_BACKEND_REQUIRED_METHODS = Object.freeze([
  "exists",
  "get",
  "put",
  "delete",
  "listKeys",
]);

/**
 * @param {object} backend
 * @returns {true}
 */
export function assertObjectStoreBackend(backend) {
  if (backend == null || typeof backend !== "object") {
    throw new Error("[ObjectStoreBackend] backend must be an object");
  }
  for (const method of OBJECT_STORE_BACKEND_REQUIRED_METHODS) {
    if (typeof backend[method] !== "function") {
      throw new Error(`[ObjectStoreBackend] missing method: ${method}`);
    }
  }
  return true;
}

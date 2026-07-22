/**
 * CB-04 — Dependency resolver (DEP-01..DEP-08)
 */

import { assertMotorInCatalog } from "./motorCatalogIndex.js";
import { resolveDependencies } from "./motorDependencies.js";

/**
 * @param {string} motorId
 * @param {import('./motorDependencies.js').ExecutionContext} ctx
 */
export function checkMotorDependencies(motorId, ctx) {
  const entry = assertMotorInCatalog(motorId);
  return resolveDependencies(motorId, entry, ctx);
}

export { resolveDependencies } from "./motorDependencies.js";

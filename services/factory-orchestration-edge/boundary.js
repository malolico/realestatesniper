/**
 * P-INT-01 Slice B1 — Boundary contracts (constants only).
 *
 * Mirrors CB-15 blocked operation names for Edge fail-closed checks.
 * Runtime (B2+) MUST still invoke CB-15 `assertFactoryBoundary` / `isBlockedFactoryOperation`.
 * This module MUST NOT import src/factory/**.
 */

export const FACTORY_ORCHESTRATION_BLOCKED_OPERATIONS = Object.freeze([
  "publish_deal",
  "assign_access_tier",
  "emit_decision_diamond",
  "marketplace_listing",
  "projection_release",
]);

export const FACTORY_ORCHESTRATION_FORBIDDEN_DOMAINS = Object.freeze([
  "Marketplace",
  "Product",
  "Supabase",
  "II.7",
  "DecisionEngine",
  "access_tier",
  "slice_a_service_edge_mutation",
]);

/**
 * Pure contract check — does not call CB-15.
 * @param {string} operation
 */
export function isContractBlockedOperation(operation) {
  return FACTORY_ORCHESTRATION_BLOCKED_OPERATIONS.includes(operation);
}

/**
 * @param {string} operation
 * @returns {{ ok: true } | { ok: false, code: string, message: string, jobState: string }}
 */
export function evaluateBoundaryRejection(operation) {
  if (isContractBlockedOperation(operation)) {
    return {
      ok: false,
      code: "BOUNDARY_REJECTED",
      message: `Operation "${operation}" is outside Factory orchestration scope`,
      jobState: "REJECTED",
    };
  }
  return { ok: true };
}

/**
 * CB-16 — Decision Package schema (Factory → Decision frontier)
 *
 * CB-16 does not decide. It defines the calibrated corpus shape
 * delivered to the future Decision Engine (FFO-06 / LFF-07).
 */

export const DECISION_PACKAGE_VERSION = "1.0.0";

export const DECISION_HANDOFF_ACTOR = "MOT-SYN-02";

export const DECISION_HANDOFF_INTERFACE_ID = "CB-16:DecisionHandoffInterface";

/** Motors whose manifests must be present in the handoff package (blueprint). */
export const REQUIRED_HANDOFF_MOTORS = Object.freeze(["MOT-DCN-01", "MOT-EXE-01"]);

/** Scores that must exist before handoff (verified, never computed as decisions). */
export const REQUIRED_SCORES = Object.freeze(["maturity_score"]);

/** ELR sections that must be present for a complete expediente export. */
export const REQUIRED_ELR_SECTIONS = Object.freeze([
  "state_transitions",
  "motor_manifests",
  "loop_ledger_refs",
  "decision_handoffs",
]);

/** Package top-level sections. */
export const DECISION_PACKAGE_SECTIONS = Object.freeze([
  "meta",
  "identity",
  "readiness",
  "motors",
  "evidence",
  "scores",
  "elrExport",
  "boundary",
]);

/** Operations CB-16 must never perform (Decision Engine territory). */
export const BLOCKED_HANDOFF_OPERATIONS = Object.freeze([
  "classify_deal",
  "classify_premium",
  "classify_diamond",
  "emit_decision_diamond",
  "assign_access_tier",
  "set_pricing",
  "marketplace_listing",
  "projection_release",
  "execute_ai",
  "execute_motor",
  "modify_foundation",
  "modify_evidence",
  "modify_runtime",
]);

export const HANDOFF_ELR_KINDS = Object.freeze({
  PACKAGE_BUILT: "DHI_DECISION_PACKAGE_BUILT",
  HANDOFF_RECORDED: "DHI_DECISION_HANDOFF",
  FREEZE: "DHI_FACTORY_FREEZE",
  DELIVERED: "DHI_PACKAGE_DELIVERED",
  COMPLETE: "DHI_HANDOFF_COMPLETE",
  /** P-INT-04 Offline local export reference — not Delivery / not II.6 */
  OFFLINE_LOCAL_EXPORT: "DHI_OFFLINE_LOCAL_EXPORT",
  /** P-INT-04 Live versioned sink reference — not Delivery / not Decision Engine */
  LIVE_VERSIONED_EXPORT: "DHI_LIVE_VERSIONED_EXPORT",
});

/**
 * @param {object} pkg
 */
export function validateDecisionPackageShape(pkg) {
  const errors = [];
  if (!pkg || typeof pkg !== "object") {
    return { valid: false, errors: ["Decision Package must be an object"] };
  }

  for (const section of DECISION_PACKAGE_SECTIONS) {
    if (pkg[section] == null) {
      errors.push(`Missing package section: ${section}`);
    }
  }

  if (pkg.meta?.version !== DECISION_PACKAGE_VERSION) {
    errors.push(`Expected package version ${DECISION_PACKAGE_VERSION}`);
  }

  if (pkg.meta?.interfaceId !== DECISION_HANDOFF_INTERFACE_ID) {
    errors.push(`Expected interfaceId ${DECISION_HANDOFF_INTERFACE_ID}`);
  }

  if (pkg.boundary?.decides !== false) {
    errors.push("boundary.decides must be false — CB-16 does not decide");
  }

  if (pkg.boundary?.classifiesDeal !== false) {
    errors.push("boundary.classifiesDeal must be false");
  }

  if (pkg.boundary?.assignsAccessTier !== false) {
    errors.push("boundary.assignsAccessTier must be false");
  }

  for (const motorId of REQUIRED_HANDOFF_MOTORS) {
    if (!pkg.motors?.[motorId]) {
      errors.push(`Missing required motor slice: ${motorId}`);
    }
  }

  for (const score of REQUIRED_SCORES) {
    if (pkg.scores?.[score] == null && pkg.scores?.[score] !== 0) {
      errors.push(`Missing required score: ${score}`);
    }
  }

  return { valid: errors.length === 0, errors };
}

/**
 * @param {string} operation
 */
export function isBlockedHandoffOperation(operation) {
  return BLOCKED_HANDOFF_OPERATIONS.includes(operation);
}

/**
 * II.5-IMPL — Handoff / Release Readiness constants.
 * Consumes II.4 Publication Unit outcomes; does not execute handoff or Delivery.
 */

export const HANDOFF_READY = "HANDOFF_READY";
export const NOT_HANDOFF_READY = "NOT_HANDOFF_READY";
export const HANDOFF_REJECTED = "HANDOFF_REJECTED";

/** Delivery is never authorized by II.5-IMPL. */
export const DELIVERY_STATUS = Object.freeze({
  NOT_AUTHORIZED: "NOT_AUTHORIZED",
});

/** Handoff execution is never authorized by II.5-IMPL. */
export const HANDOFF_EXECUTION_STATUS = Object.freeze({
  NOT_AUTHORIZED: "NOT_AUTHORIZED",
});

/**
 * Closed catalog of handoff readiness reason codes.
 */
export const HANDOFF_REASON_CODES = Object.freeze([
  "UPSTREAM_NOT_FORMED",
  "II4_EVALUATION_FAILED",
  "INCOMPLETE_EVALUATION",
  "SNAPSHOT_ID_CONTINUITY_FAILED",
  "INTEGRITY_CONTINUITY_FAILED",
  "IDENTITY_CONTINUITY_FAILED",
  "PROVENANCE_CONTINUITY_FAILED",
  "ELIGIBILITY_BINDING_INVALID",
  "ILLICIT_DELIVERY_CLAIM",
  "HANDOFF_READY",
]);

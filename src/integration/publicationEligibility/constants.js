/**
 * II.3-IMPL — Publication Eligibility constants.
 * Consumes II.2; does not modify Contract v2.
 */

export const ELIGIBLE = "ELIGIBLE";
export const NOT_ELIGIBLE = "NOT_ELIGIBLE";

/** Delivery is never authorized by II.3-IMPL. */
export const DELIVERY_STATUS = Object.freeze({
  NOT_AUTHORIZED: "NOT_AUTHORIZED",
});

/**
 * Bounded catalog of eligibility reason codes (sanitized, no secrets).
 */
export const ELIGIBILITY_REASON_CODES = Object.freeze([
  "CANDIDATE_NOT_OBJECT",
  "ATOMIC_UNIT_INVALID",
  "II2_GATE_REJECTED",
  "II2_VALIDATION_FAILED",
  "STALE_WITHOUT_SNAPSHOT_STALE",
  "OWNERSHIP_REGISTRY_INCOHERENT",
  "UNKNOWN_OR_PROHIBITED_FIELD",
  "CONTRACT_IDENTITY_INVALID",
  "INTEGRITY_OR_CHECKSUM_FAILED",
  "QUOTA_OR_DEPTH_EXCEEDED",
  "PHASE_OR_WARNING_CATALOG_FAILED",
  "UNSPECIFIED_II2_FAILURE",
]);

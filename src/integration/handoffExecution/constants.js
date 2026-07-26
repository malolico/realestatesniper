/**
 * II.6-IMPL — Publication Handoff Execution Governance constants.
 * Consumes II.5 readiness outcomes; does not perform Delivery or external effects.
 */

export const HANDOFF_EXECUTED = "HANDOFF_EXECUTED";
export const HANDOFF_NOT_EXECUTED = "HANDOFF_NOT_EXECUTED";
export const HANDOFF_EXECUTION_REJECTED = "HANDOFF_EXECUTION_REJECTED";

/** Delivery is never authorized by II.6-IMPL. */
export const DELIVERY_STATUS = Object.freeze({
  NOT_AUTHORIZED: "NOT_AUTHORIZED",
});

/** Persistence is never authorized by II.6-IMPL. */
export const PERSISTENCE_STATUS = Object.freeze({
  NOT_AUTHORIZED: "NOT_AUTHORIZED",
});

/** Transport is never authorized by II.6-IMPL. */
export const TRANSPORT_STATUS = Object.freeze({
  NOT_AUTHORIZED: "NOT_AUTHORIZED",
});

/** Authentication is never authorized by II.6-IMPL. */
export const AUTHENTICATION_STATUS = Object.freeze({
  NOT_AUTHORIZED: "NOT_AUTHORIZED",
});

/** Exposure is never authorized by II.6-IMPL. */
export const EXPOSURE_STATUS = Object.freeze({
  NOT_AUTHORIZED: "NOT_AUTHORIZED",
});

/**
 * Closed catalog of handoff execution reason codes.
 */
export const HANDOFF_EXECUTION_REASON_CODES = Object.freeze([
  "UPSTREAM_NOT_READY",
  "II5_EVALUATION_FAILED",
  "INCOMPLETE_EVALUATION",
  "SNAPSHOT_ID_CONTINUITY_FAILED",
  "INTEGRITY_CONTINUITY_FAILED",
  "IDENTITY_CONTINUITY_FAILED",
  "PROVENANCE_CONTINUITY_FAILED",
  "PUBLICATION_UNIT_BINDING_FAILED",
  "READINESS_OUTCOME_BINDING_FAILED",
  "ILLICIT_DELIVERY_CLAIM",
  "ILLICIT_PERSISTENCE_CLAIM",
  "ILLICIT_TRANSPORT_CLAIM",
  "ILLICIT_AUTHENTICATION_CLAIM",
  "ILLICIT_EXPOSURE_CLAIM",
  "HANDOFF_EXECUTED",
]);

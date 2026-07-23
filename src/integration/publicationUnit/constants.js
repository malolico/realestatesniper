/**
 * II.4-IMPL — Publication Unit governance constants.
 * Consumes II.3 eligibility; does not open Delivery.
 */

export const UNIT_FORMED = "UNIT_FORMED";
export const UNIT_NOT_FORMED = "UNIT_NOT_FORMED";
export const UNIT_REJECTED = "UNIT_REJECTED";

/** Delivery is never authorized by II.4-IMPL. */
export const DELIVERY_STATUS = Object.freeze({
  NOT_AUTHORIZED: "NOT_AUTHORIZED",
});

/**
 * Closed catalog of Publication Unit reason codes.
 */
export const PUBLICATION_UNIT_REASON_CODES = Object.freeze([
  "NOT_ELIGIBLE",
  "II3_EVALUATION_FAILED",
  "MISSING_SNAPSHOT_ID",
  "MISSING_OR_INVALID_INTEGRITY",
  "NON_ATOMIC_CANDIDATE",
  "UNIT_FORMED",
]);

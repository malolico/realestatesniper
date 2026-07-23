/**
 * II.3-IMPL / II.3-IMPL.1 — Publication Eligibility decision.
 *
 * Consumes II.2 `validateReadModelV2` without modifying Contract v2.
 * Performs no delivery, I/O, Auth, Edge, Supabase, or Factory mutation.
 * Unexpected gate exceptions are fail-closed to NOT_ELIGIBLE (no rethrow).
 */

import { validateReadModelV2 as defaultValidateReadModelV2 } from "../readModel/validator.js";
import { assertAtomicSnapshotUnit } from "./atomicity.js";
import {
  DELIVERY_STATUS,
  ELIGIBLE,
  NOT_ELIGIBLE,
} from "./constants.js";
import { buildReasonsFromIi2Errors, sanitizeReasonMessage } from "./reasons.js";

export {
  DELIVERY_STATUS,
  ELIGIBLE,
  ELIGIBILITY_REASON_CODES,
  NOT_ELIGIBLE,
} from "./constants.js";
export { assertAtomicSnapshotUnit } from "./atomicity.js";
export {
  buildReasonsFromIi2Errors,
  mapIi2ErrorToReasonCode,
  sanitizeReasonMessage,
} from "./reasons.js";

/**
 * Evaluate publication eligibility for one candidate snapshot.
 *
 * @param {unknown} candidate
 * @param {{
 *   now?: Date|number|string,
 *   validateReadModelV2?: Function,
 * }} [options] `now` forwarded to II.2 freshness; `validateReadModelV2` is a
 *   test-only injection seam (does not alter II.2 semantics).
 * @returns {{
 *   decision: "ELIGIBLE" | "NOT_ELIGIBLE",
 *   delivery: "NOT_AUTHORIZED",
 *   reasons: { code: string, message: string }[],
 *   ii2: { ok: boolean, code?: string, errorCount: number },
 *   freshness?: string,
 *   sideEffects: readonly [],
 * }}
 */
export function evaluatePublicationEligibility(candidate, options = {}) {
  const sideEffects = Object.freeze([]);

  const atomic = assertAtomicSnapshotUnit(candidate);
  if (!atomic.ok) {
    return freezeDecision({
      decision: NOT_ELIGIBLE,
      delivery: DELIVERY_STATUS.NOT_AUTHORIZED,
      reasons: [
        {
          code: atomic.code,
          message: sanitizeReasonMessage(atomic.message),
        },
      ],
      ii2: { ok: false, errorCount: 0 },
      sideEffects,
    });
  }

  // Sole contract oracle — do not reimplement or weaken II.2 rules.
  // II.3-IMPL.1: any unexpected throw → NOT_ELIGIBLE (fail-closed).
  const validate =
    typeof options.validateReadModelV2 === "function"
      ? options.validateReadModelV2
      : defaultValidateReadModelV2;

  let ii2;
  try {
    ii2 = validate(candidate, { now: options.now });
  } catch (err) {
    return freezeDecision({
      decision: NOT_ELIGIBLE,
      delivery: DELIVERY_STATUS.NOT_AUTHORIZED,
      reasons: [
        {
          code: "II2_VALIDATION_FAILED",
          message: sanitizeReasonMessage(
            err && typeof err.message === "string" && err.message
              ? `II.2 gate threw: ${err.message}`
              : "II.2 gate threw unexpected error"
          ),
        },
      ],
      ii2: { ok: false, code: "II2_VALIDATION_FAILED", errorCount: 0 },
      sideEffects,
    });
  }

  if (!ii2 || typeof ii2 !== "object" || ii2.ok !== true) {
    return freezeDecision({
      decision: NOT_ELIGIBLE,
      delivery: DELIVERY_STATUS.NOT_AUTHORIZED,
      reasons: buildReasonsFromIi2Errors(
        ii2 && Array.isArray(ii2.errors) ? ii2.errors : []
      ),
      ii2: {
        ok: false,
        code: ii2 && ii2.code,
        errorCount:
          ii2 && Array.isArray(ii2.errors) ? ii2.errors.length : 0,
      },
      sideEffects,
    });
  }

  // II.2 PASS ⇒ publication-eligible. Delivery remains unauthorized.
  return freezeDecision({
    decision: ELIGIBLE,
    delivery: DELIVERY_STATUS.NOT_AUTHORIZED,
    reasons: [],
    ii2: { ok: true, errorCount: 0 },
    freshness: ii2.freshness,
    sideEffects,
  });
}

/**
 * Convenience boolean. Does not authorize delivery.
 * @param {unknown} candidate
 * @param {object} [options]
 */
export function isPublicationEligible(candidate, options) {
  return evaluatePublicationEligibility(candidate, options).decision === ELIGIBLE;
}

function freezeDecision(decision) {
  return Object.freeze({
    ...decision,
    reasons: Object.freeze(
      [...(decision.reasons || [])].map((r) => Object.freeze({ ...r }))
    ),
    ii2: Object.freeze({ ...decision.ii2 }),
    sideEffects: Object.freeze([]),
  });
}

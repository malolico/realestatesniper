/**
 * II.4-IMPL — Publication Unit formation governance.
 *
 * Consumes II.3 `evaluatePublicationEligibility` exclusively.
 * Does NOT open a parallel II.2 contract gate from this module.
 * Performs no delivery, filesystem/network I/O, Auth, Edge, Producer, or Factory mutation.
 */

import {
  DELIVERY_STATUS as II3_DELIVERY_STATUS,
  ELIGIBLE,
  NOT_ELIGIBLE,
  evaluatePublicationEligibility as defaultEvaluatePublicationEligibility,
} from "../publicationEligibility/index.js";
import { assertAtomicBindingCandidate } from "./atomicity.js";
import {
  DELIVERY_STATUS,
  UNIT_FORMED,
  UNIT_NOT_FORMED,
  UNIT_REJECTED,
} from "./constants.js";
import { makeReason } from "./reasons.js";

export {
  DELIVERY_STATUS,
  PUBLICATION_UNIT_REASON_CODES,
  UNIT_FORMED,
  UNIT_NOT_FORMED,
  UNIT_REJECTED,
} from "./constants.js";
export { assertAtomicBindingCandidate } from "./atomicity.js";
export { makeReason, sanitizeReasonMessage } from "./reasons.js";

/**
 * Form (or refuse) a Publication Unit for one candidate snapshot.
 *
 * State rule (Director-authorized):
 * - UNIT_NOT_FORMED — eligibility not reached, or II.3 evaluation could not complete.
 * - UNIT_REJECTED — II.3 returned ELIGIBLE, but II.4 binding governance failed
 *   (identity / integrity / atomic binding).
 * - UNIT_FORMED — II.3 ELIGIBLE and II.4 binding conditions hold.
 *
 * @param {unknown} candidate
 * @param {{
 *   now?: Date|number|string,
 *   evaluatePublicationEligibility?: Function,
 * }} [options] `evaluatePublicationEligibility` is a test-only injection seam.
 * @returns {Readonly<{
 *   status: "UNIT_FORMED" | "UNIT_NOT_FORMED" | "UNIT_REJECTED",
 *   reasons: ReadonlyArray<{ code: string, message: string }>,
 *   publicationUnit: Readonly<object> | null,
 *   eligibility: Readonly<object> | null,
 *   delivery: "NOT_AUTHORIZED",
 *   sideEffects: readonly [],
 * }>}
 */
export function formPublicationUnit(candidate, options = {}) {
  const sideEffects = Object.freeze([]);
  const delivery = DELIVERY_STATUS.NOT_AUTHORIZED;

  const evaluate =
    typeof options.evaluatePublicationEligibility === "function"
      ? options.evaluatePublicationEligibility
      : defaultEvaluatePublicationEligibility;

  let eligibility;
  try {
    eligibility = evaluate(candidate, { now: options.now });
  } catch (err) {
    return freezeOutcome({
      status: UNIT_NOT_FORMED,
      reasons: [
        makeReason(
          "II3_EVALUATION_FAILED",
          err && typeof err.message === "string" && err.message
            ? `II.3 evaluation threw: ${err.message}`
            : "II.3 evaluation threw unexpected error"
        ),
      ],
      publicationUnit: null,
      eligibility: null,
      delivery,
      sideEffects,
    });
  }

  if (!eligibility || typeof eligibility !== "object") {
    return freezeOutcome({
      status: UNIT_NOT_FORMED,
      reasons: [
        makeReason(
          "II3_EVALUATION_FAILED",
          "II.3 evaluation returned an unusable result"
        ),
      ],
      publicationUnit: null,
      eligibility: null,
      delivery,
      sideEffects,
    });
  }

  if (eligibility.decision !== ELIGIBLE) {
    return freezeOutcome({
      status: UNIT_NOT_FORMED,
      reasons: [
        makeReason(
          "NOT_ELIGIBLE",
          eligibility.decision === NOT_ELIGIBLE
            ? "II.3 decision is NOT_ELIGIBLE; Publication Unit not formed"
            : "II.3 decision is not ELIGIBLE; Publication Unit not formed"
        ),
      ],
      publicationUnit: null,
      eligibility: freezeEligibilityView(eligibility),
      delivery,
      sideEffects,
    });
  }

  // --- II.3 ELIGIBLE: apply II.4 binding governance ---

  const atomic = assertAtomicBindingCandidate(candidate);
  if (!atomic.ok) {
    return freezeOutcome({
      status: UNIT_REJECTED,
      reasons: [makeReason(atomic.code, atomic.message)],
      publicationUnit: null,
      eligibility: freezeEligibilityView(eligibility),
      delivery,
      sideEffects,
    });
  }

  const snapshotId =
    typeof candidate.snapshotId === "string" ? candidate.snapshotId.trim() : "";
  if (!snapshotId) {
    return freezeOutcome({
      status: UNIT_REJECTED,
      reasons: [
        makeReason(
          "MISSING_SNAPSHOT_ID",
          "ELIGIBLE candidate lacks usable snapshotId for Publication Unit identity"
        ),
      ],
      publicationUnit: null,
      eligibility: freezeEligibilityView(eligibility),
      delivery,
      sideEffects,
    });
  }

  const integrityBinding = bindIntegrityMetadata(candidate.integrity);
  if (!integrityBinding.ok) {
    return freezeOutcome({
      status: UNIT_REJECTED,
      reasons: [makeReason(integrityBinding.code, integrityBinding.message)],
      publicationUnit: null,
      eligibility: freezeEligibilityView(eligibility),
      delivery,
      sideEffects,
    });
  }

  const publicationUnit = Object.freeze({
    snapshotId,
    // Complete snapshot binding by reference — no partial field reconstruction.
    snapshot: candidate,
    integrity: integrityBinding.value,
    eligibilityDecision: ELIGIBLE,
  });

  return freezeOutcome({
    status: UNIT_FORMED,
    reasons: [
      makeReason("UNIT_FORMED", "Publication Unit formed under II.4 governance"),
    ],
    publicationUnit,
    eligibility: freezeEligibilityView(eligibility),
    delivery,
    sideEffects,
  });
}

/**
 * Convenience boolean. Does not authorize delivery or persistence.
 * @param {unknown} candidate
 * @param {object} [options]
 */
export function isPublicationUnitFormed(candidate, options) {
  return formPublicationUnit(candidate, options).status === UNIT_FORMED;
}

/**
 * @param {unknown} integrity
 * @returns {{ ok: true, value: Readonly<object> } | { ok: false, code: string, message: string }}
 */
function bindIntegrityMetadata(integrity) {
  if (!integrity || typeof integrity !== "object" || Array.isArray(integrity)) {
    return {
      ok: false,
      code: "MISSING_OR_INVALID_INTEGRITY",
      message: "ELIGIBLE candidate lacks integrity metadata for Publication Unit binding",
    };
  }
  const checksum =
    typeof integrity.checksum === "string" ? integrity.checksum.trim() : "";
  if (!checksum) {
    return {
      ok: false,
      code: "MISSING_OR_INVALID_INTEGRITY",
      message: "ELIGIBLE candidate integrity.checksum is missing or empty",
    };
  }
  return {
    ok: true,
    value: Object.freeze({
      algorithm: integrity.algorithm,
      canonicalization: integrity.canonicalization,
      checksum,
      verified: integrity.verified,
    }),
  };
}

function freezeEligibilityView(eligibility) {
  return Object.freeze({
    decision: eligibility.decision,
    delivery: eligibility.delivery || II3_DELIVERY_STATUS.NOT_AUTHORIZED,
    ii2: eligibility.ii2
      ? Object.freeze({ ...eligibility.ii2 })
      : Object.freeze({ ok: false, errorCount: 0 }),
    freshness: eligibility.freshness,
    reasons: Object.freeze(
      [...(eligibility.reasons || [])].map((r) =>
        Object.freeze({ code: r.code, message: r.message })
      )
    ),
  });
}

function freezeOutcome(outcome) {
  return Object.freeze({
    status: outcome.status,
    reasons: Object.freeze([...(outcome.reasons || [])]),
    publicationUnit: outcome.publicationUnit,
    eligibility: outcome.eligibility,
    delivery: DELIVERY_STATUS.NOT_AUTHORIZED,
    sideEffects: Object.freeze([]),
  });
}

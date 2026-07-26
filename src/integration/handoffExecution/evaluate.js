/**
 * II.6-IMPL — handoff execution evaluation (governance only).
 *
 * Consumes II.5 `evaluateHandoffReadiness` exclusively.
 * Does NOT open parallel II.2 / II.3 / II.4 gates.
 * Does NOT perform Delivery, persistence, transport, Auth, or exposure.
 */

import {
  HANDOFF_READY,
  evaluateHandoffReadiness as defaultEvaluateHandoffReadiness,
} from "../handoffReadiness/index.js";
import { assertReadinessOutcomeContinuity } from "./continuity.js";
import {
  AUTHENTICATION_STATUS,
  DELIVERY_STATUS,
  EXPOSURE_STATUS,
  HANDOFF_EXECUTED,
  HANDOFF_EXECUTION_REJECTED,
  HANDOFF_NOT_EXECUTED,
  PERSISTENCE_STATUS,
  TRANSPORT_STATUS,
} from "./constants.js";
import { makeReason } from "./reasons.js";

/**
 * Evaluate logical handoff execution for a candidate via II.5 only.
 *
 * @param {unknown} candidate
 * @param {{
 *   now?: Date|number|string,
 *   evaluateHandoffReadiness?: Function,
 *   readinessOutcome?: object,
 * }} [options]
 *   `evaluateHandoffReadiness` — test-only injection seam.
 *   `readinessOutcome` — optional precomputed II.5 outcome (must not be mutated).
 * @returns {Readonly<object>}
 */
export function evaluateHandoffExecution(candidate, options = {}) {
  const fences = permanentFences();

  let readinessOutcome;
  if (options.readinessOutcome !== undefined) {
    readinessOutcome = options.readinessOutcome;
  } else {
    const evaluate =
      typeof options.evaluateHandoffReadiness === "function"
        ? options.evaluateHandoffReadiness
        : defaultEvaluateHandoffReadiness;
    try {
      readinessOutcome = evaluate(candidate, { now: options.now });
    } catch (err) {
      return freezeOutcome({
        status: HANDOFF_NOT_EXECUTED,
        reasons: [
          makeReason(
            "II5_EVALUATION_FAILED",
            err && typeof err.message === "string" && err.message
              ? `II.5 evaluation threw: ${err.message}`
              : "II.5 evaluation threw unexpected error"
          ),
        ],
        publicationUnit: null,
        readinessOutcome: null,
        ...fences,
      });
    }
  }

  if (!readinessOutcome || typeof readinessOutcome !== "object") {
    return freezeOutcome({
      status: HANDOFF_NOT_EXECUTED,
      reasons: [
        makeReason(
          "INCOMPLETE_EVALUATION",
          "II.5 evaluation returned an unusable result"
        ),
      ],
      publicationUnit: null,
      readinessOutcome: null,
      ...fences,
    });
  }

  if (typeof readinessOutcome.status !== "string" || !readinessOutcome.status) {
    return freezeOutcome({
      status: HANDOFF_NOT_EXECUTED,
      reasons: [
        makeReason(
          "INCOMPLETE_EVALUATION",
          "II.5 outcome lacks a usable status"
        ),
      ],
      publicationUnit: null,
      readinessOutcome: freezeReadinessView(readinessOutcome),
      ...fences,
    });
  }

  if (readinessOutcome.status !== HANDOFF_READY) {
    return freezeOutcome({
      status: HANDOFF_NOT_EXECUTED,
      reasons: [
        makeReason(
          "UPSTREAM_NOT_READY",
          `II.5 status is ${readinessOutcome.status}; handoff execution not evaluated`
        ),
      ],
      publicationUnit: null,
      readinessOutcome: freezeReadinessView(readinessOutcome),
      ...fences,
    });
  }

  // --- HANDOFF_READY: apply II.6 continuity and execution rules ---

  const continuity = assertReadinessOutcomeContinuity(
    readinessOutcome,
    candidate
  );
  if (!continuity.ok) {
    if (continuity.code === "INCOMPLETE_EVALUATION") {
      return freezeOutcome({
        status: HANDOFF_NOT_EXECUTED,
        reasons: [makeReason(continuity.code, continuity.message)],
        publicationUnit: null,
        readinessOutcome: freezeReadinessView(readinessOutcome),
        ...fences,
      });
    }
    return freezeOutcome({
      status: HANDOFF_EXECUTION_REJECTED,
      reasons: [makeReason(continuity.code, continuity.message)],
      publicationUnit: readinessOutcome.publicationUnit,
      readinessOutcome: freezeReadinessView(readinessOutcome),
      ...fences,
    });
  }

  const illicit = detectIllicitAuthorizationClaims(readinessOutcome);
  if (illicit) {
    return freezeOutcome({
      status: HANDOFF_EXECUTION_REJECTED,
      reasons: [makeReason(illicit.code, illicit.message)],
      publicationUnit: readinessOutcome.publicationUnit,
      readinessOutcome: freezeReadinessView(readinessOutcome),
      ...fences,
    });
  }

  return freezeOutcome({
    status: HANDOFF_EXECUTED,
    reasons: [
      makeReason(
        "HANDOFF_EXECUTED",
        "HANDOFF_READY outcome satisfies II.6 logical handoff execution governance"
      ),
    ],
    publicationUnit: readinessOutcome.publicationUnit,
    readinessOutcome: freezeReadinessView(readinessOutcome),
    ...fences,
  });
}

/**
 * Detect illicit Authorization claims on a HANDOFF_READY path (specific II.6 rejects).
 * @param {object} readinessOutcome
 * @returns {{ code: string, message: string } | null}
 */
function detectIllicitAuthorizationClaims(readinessOutcome) {
  const unit = readinessOutcome.publicationUnit;
  const claims = [
    {
      value: readinessOutcome.delivery,
      code: "ILLICIT_DELIVERY_CLAIM",
      message: "Readiness outcome illicitly claims Delivery authorization",
    },
    {
      value: unit && unit.delivery,
      code: "ILLICIT_DELIVERY_CLAIM",
      message: "Publication Unit illicitly claims Delivery authorization",
    },
    {
      value: readinessOutcome.persistence,
      code: "ILLICIT_PERSISTENCE_CLAIM",
      message: "Readiness outcome illicitly claims persistence authorization",
    },
    {
      value: unit && unit.persistence,
      code: "ILLICIT_PERSISTENCE_CLAIM",
      message: "Publication Unit illicitly claims persistence authorization",
    },
    {
      value: readinessOutcome.transport,
      code: "ILLICIT_TRANSPORT_CLAIM",
      message: "Readiness outcome illicitly claims transport authorization",
    },
    {
      value: unit && unit.transport,
      code: "ILLICIT_TRANSPORT_CLAIM",
      message: "Publication Unit illicitly claims transport authorization",
    },
    {
      value: readinessOutcome.authentication,
      code: "ILLICIT_AUTHENTICATION_CLAIM",
      message: "Readiness outcome illicitly claims authentication authorization",
    },
    {
      value: unit && unit.authentication,
      code: "ILLICIT_AUTHENTICATION_CLAIM",
      message: "Publication Unit illicitly claims authentication authorization",
    },
    {
      value: readinessOutcome.exposure,
      code: "ILLICIT_EXPOSURE_CLAIM",
      message: "Readiness outcome illicitly claims exposure authorization",
    },
    {
      value: unit && unit.exposure,
      code: "ILLICIT_EXPOSURE_CLAIM",
      message: "Publication Unit illicitly claims exposure authorization",
    },
  ];

  for (const claim of claims) {
    if (claim.value === "AUTHORIZED" || claim.value === true) {
      return { code: claim.code, message: claim.message };
    }
  }

  if (
    readinessOutcome.handoffExecution === "AUTHORIZED" ||
    (unit && unit.handoffExecution === "AUTHORIZED")
  ) {
    return {
      code: "ILLICIT_DELIVERY_CLAIM",
      message:
        "Readiness/unit illicitly claims handoff execution authorization",
    };
  }

  if (unit && unit.exposed === true) {
    return {
      code: "ILLICIT_EXPOSURE_CLAIM",
      message: "Publication Unit illicitly claims exposure authorization",
    };
  }

  return null;
}

function permanentFences() {
  return {
    delivery: DELIVERY_STATUS.NOT_AUTHORIZED,
    persistence: PERSISTENCE_STATUS.NOT_AUTHORIZED,
    transport: TRANSPORT_STATUS.NOT_AUTHORIZED,
    authentication: AUTHENTICATION_STATUS.NOT_AUTHORIZED,
    exposure: EXPOSURE_STATUS.NOT_AUTHORIZED,
    sideEffects: Object.freeze([]),
  };
}

/**
 * Frozen non-mutating view of the consumed II.5 outcome (binding, not rewrite).
 * Preserves references to publicationUnit / upstream / manifest / reasons.
 * Does not freeze or mutate the original readinessOutcome object.
 * @param {object} readinessOutcome
 */
function freezeReadinessView(readinessOutcome) {
  return Object.freeze({
    status: readinessOutcome.status,
    reasons: readinessOutcome.reasons,
    publicationUnit: readinessOutcome.publicationUnit,
    upstream: readinessOutcome.upstream,
    manifest: readinessOutcome.manifest,
    delivery:
      readinessOutcome.delivery || DELIVERY_STATUS.NOT_AUTHORIZED,
    handoffExecution:
      readinessOutcome.handoffExecution || DELIVERY_STATUS.NOT_AUTHORIZED,
    sideEffects: readinessOutcome.sideEffects,
  });
}

function freezeOutcome(outcome) {
  return Object.freeze({
    status: outcome.status,
    reasons: Object.freeze([...(outcome.reasons || [])]),
    publicationUnit: outcome.publicationUnit,
    readinessOutcome: outcome.readinessOutcome,
    delivery: DELIVERY_STATUS.NOT_AUTHORIZED,
    persistence: PERSISTENCE_STATUS.NOT_AUTHORIZED,
    transport: TRANSPORT_STATUS.NOT_AUTHORIZED,
    authentication: AUTHENTICATION_STATUS.NOT_AUTHORIZED,
    exposure: EXPOSURE_STATUS.NOT_AUTHORIZED,
    sideEffects: Object.freeze([]),
  });
}

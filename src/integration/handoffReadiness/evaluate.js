/**
 * II.5-IMPL — handoff readiness evaluation (governance only).
 *
 * Consumes II.4 `formPublicationUnit` exclusively.
 * Does NOT open a parallel II.2 or II.3 readiness oracle.
 * Does NOT execute handoff, Delivery, persistence, or transport.
 */

import {
  UNIT_FORMED,
  formPublicationUnit as defaultFormPublicationUnit,
} from "../publicationUnit/index.js";
import { assertPublicationUnitContinuity } from "./continuity.js";
import {
  DELIVERY_STATUS,
  HANDOFF_EXECUTION_STATUS,
  HANDOFF_READY,
  HANDOFF_REJECTED,
  NOT_HANDOFF_READY,
} from "./constants.js";
import { buildReadinessManifestMetadata } from "./manifestMetadata.js";
import { makeReason } from "./reasons.js";

/**
 * Evaluate handoff / release readiness for a candidate via II.4 only.
 *
 * @param {unknown} candidate
 * @param {{
 *   now?: Date|number|string,
 *   formPublicationUnit?: Function,
 * }} [options] `formPublicationUnit` is a test-only injection seam.
 * @returns {Readonly<object>}
 */
export function evaluateHandoffReadiness(candidate, options = {}) {
  const delivery = DELIVERY_STATUS.NOT_AUTHORIZED;
  const handoffExecution = HANDOFF_EXECUTION_STATUS.NOT_AUTHORIZED;
  const sideEffects = Object.freeze([]);

  const form =
    typeof options.formPublicationUnit === "function"
      ? options.formPublicationUnit
      : defaultFormPublicationUnit;

  let unitOutcome;
  try {
    unitOutcome = form(candidate, { now: options.now });
  } catch (err) {
    return freezeOutcome({
      status: NOT_HANDOFF_READY,
      reasons: [
        makeReason(
          "II4_EVALUATION_FAILED",
          err && typeof err.message === "string" && err.message
            ? `II.4 evaluation threw: ${err.message}`
            : "II.4 evaluation threw unexpected error"
        ),
      ],
      publicationUnit: null,
      upstream: null,
      manifest: null,
      delivery,
      handoffExecution,
      sideEffects,
    });
  }

  if (!unitOutcome || typeof unitOutcome !== "object") {
    return freezeOutcome({
      status: NOT_HANDOFF_READY,
      reasons: [
        makeReason(
          "INCOMPLETE_EVALUATION",
          "II.4 evaluation returned an unusable result"
        ),
      ],
      publicationUnit: null,
      upstream: null,
      manifest: null,
      delivery,
      handoffExecution,
      sideEffects,
    });
  }

  if (typeof unitOutcome.status !== "string" || !unitOutcome.status) {
    return freezeOutcome({
      status: NOT_HANDOFF_READY,
      reasons: [
        makeReason(
          "INCOMPLETE_EVALUATION",
          "II.4 outcome lacks a usable status"
        ),
      ],
      publicationUnit: null,
      upstream: freezeUpstreamView(unitOutcome),
      manifest: null,
      delivery,
      handoffExecution,
      sideEffects,
    });
  }

  if (unitOutcome.status !== UNIT_FORMED) {
    return freezeOutcome({
      status: NOT_HANDOFF_READY,
      reasons: [
        makeReason(
          "UPSTREAM_NOT_FORMED",
          `II.4 status is ${unitOutcome.status}; handoff readiness not evaluated`
        ),
      ],
      publicationUnit: null,
      upstream: freezeUpstreamView(unitOutcome),
      manifest: null,
      delivery,
      handoffExecution,
      sideEffects,
    });
  }

  // --- UNIT_FORMED: apply II.5 continuity and readiness rules ---

  const publicationUnit = unitOutcome.publicationUnit;
  const continuity = assertPublicationUnitContinuity(publicationUnit, candidate);
  if (!continuity.ok) {
    // Incomplete unit on UNIT_FORMED → treat as specific reject when code is continuity;
    // INCOMPLETE_EVALUATION without a unit object stays NOT_HANDOFF_READY per fail-closed.
    if (continuity.code === "INCOMPLETE_EVALUATION") {
      return freezeOutcome({
        status: NOT_HANDOFF_READY,
        reasons: [makeReason(continuity.code, continuity.message)],
        publicationUnit: null,
        upstream: freezeUpstreamView(unitOutcome),
        manifest: null,
        delivery,
        handoffExecution,
        sideEffects,
      });
    }
    return freezeOutcome({
      status: HANDOFF_REJECTED,
      reasons: [makeReason(continuity.code, continuity.message)],
      publicationUnit,
      upstream: freezeUpstreamView(unitOutcome),
      manifest: null,
      delivery,
      handoffExecution,
      sideEffects,
    });
  }

  if (publicationUnit.eligibilityDecision !== "ELIGIBLE") {
    return freezeOutcome({
      status: HANDOFF_REJECTED,
      reasons: [
        makeReason(
          "ELIGIBILITY_BINDING_INVALID",
          "UNIT_FORMED Publication Unit lacks ELIGIBLE eligibilityDecision binding"
        ),
      ],
      publicationUnit,
      upstream: freezeUpstreamView(unitOutcome),
      manifest: null,
      delivery,
      handoffExecution,
      sideEffects,
    });
  }

  if (
    publicationUnit.delivery === "AUTHORIZED" ||
    publicationUnit.handoffExecution === "AUTHORIZED" ||
    publicationUnit.exposed === true
  ) {
    return freezeOutcome({
      status: HANDOFF_REJECTED,
      reasons: [
        makeReason(
          "ILLICIT_DELIVERY_CLAIM",
          "Publication Unit illicitly claims Delivery/handoff/exposure authorization"
        ),
      ],
      publicationUnit,
      upstream: freezeUpstreamView(unitOutcome),
      manifest: null,
      delivery,
      handoffExecution,
      sideEffects,
    });
  }

  const manifest = buildReadinessManifestMetadata(publicationUnit);

  return freezeOutcome({
    status: HANDOFF_READY,
    reasons: [
      makeReason(
        "HANDOFF_READY",
        "Publication Unit satisfies II.5 handoff readiness governance"
      ),
    ],
    publicationUnit,
    upstream: freezeUpstreamView(unitOutcome),
    manifest,
    delivery,
    handoffExecution,
    sideEffects,
  });
}

function freezeUpstreamView(unitOutcome) {
  return Object.freeze({
    status: unitOutcome.status,
    delivery: unitOutcome.delivery || DELIVERY_STATUS.NOT_AUTHORIZED,
  });
}

function freezeOutcome(outcome) {
  return Object.freeze({
    status: outcome.status,
    reasons: Object.freeze([...(outcome.reasons || [])]),
    publicationUnit: outcome.publicationUnit,
    upstream: outcome.upstream,
    manifest: outcome.manifest,
    delivery: DELIVERY_STATUS.NOT_AUTHORIZED,
    handoffExecution: HANDOFF_EXECUTION_STATUS.NOT_AUTHORIZED,
    sideEffects: Object.freeze([]),
  });
}

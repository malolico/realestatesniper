/**
 * SP07-P2 — Operation Update contract (DAG-SP07-P2-G1)
 *
 * Documentary schema: rsn.operation.update.candidate.v1 / rsn.operation.update.result.v1
 * WATCH ≠ UPDATE · sideEffects NONE · delivery NOT_AUTHORIZED
 * ≠ Product · ≠ persistence · ≠ P1 mutation
 */

import {
  DELIVERY_STATUS,
  OPERATIONAL_STATE,
  RESULT_SCHEMA_ID as WATCH_RESULT_SCHEMA_ID,
  SCHEMA_VERSION as P1_SCHEMA_VERSION,
  SIDE_EFFECTS,
  SUBJECT_CLASS,
  SUBJECT_SCHEMA_ID,
} from "../p1/operationWatchContract.js";

export {
  DELIVERY_STATUS,
  OPERATIONAL_STATE,
  SIDE_EFFECTS,
  SUBJECT_CLASS,
  SUBJECT_SCHEMA_ID,
  WATCH_RESULT_SCHEMA_ID,
};

export const CANDIDATE_SCHEMA_ID = "rsn.operation.update.candidate.v1";
export const UPDATE_RESULT_SCHEMA_ID = "rsn.operation.update.result.v1";
export const SCHEMA_VERSION = "v1";
export const RULE_VERSION = "sp07-p2-update-honesty.v1";
export const PROGRAM_SCOPE = "SP07-P2";
export const PREDECESSOR_SCHEMA_ID = WATCH_RESULT_SCHEMA_ID;
export const PREDECESSOR_VERSION = P1_SCHEMA_VERSION;

export const CANDIDATE_REQUIRED_TOP_LEVEL = Object.freeze([
  "meta",
  "subject",
  "evidence",
  "provenance",
  "honesty",
  "dependencies",
]);

export const UPDATE_DISPOSITION = Object.freeze({
  NO_MEANINGFUL_UPDATE: "NO_MEANINGFUL_UPDATE",
  BOUNDED_EVOLUTION_RECOGNIZED: "BOUNDED_EVOLUTION_RECOGNIZED",
  HONESTY_BLOCKS_EVOLUTION: "HONESTY_BLOCKS_EVOLUTION",
  FAIL_CLOSED: "FAIL_CLOSED",
});

export const CHANGE_SURFACE = Object.freeze({
  EVIDENCE_CLASS_SHIFT: "EVIDENCE_CLASS_SHIFT",
  FRESHNESS_THRESHOLD_CROSS: "FRESHNESS_THRESHOLD_CROSS",
  TRUTH_POSTURE_SHIFT: "TRUTH_POSTURE_SHIFT",
  DEPENDENCY_POSTURE_SHIFT: "DEPENDENCY_POSTURE_SHIFT",
  HONESTY_FIELD_SHIFT: "HONESTY_FIELD_SHIFT",
});

export const REASON_CODES = Object.freeze({
  STRUCTURAL_INVALID: "STRUCTURAL_INVALID",
  SCHEMA_UNSUPPORTED: "SCHEMA_UNSUPPORTED",
  SUBJECT_INVALID: "SUBJECT_INVALID",
  SUBJECT_MISMATCH: "SUBJECT_MISMATCH",
  PREDECESSOR_MISSING: "PREDECESSOR_MISSING",
  PREDECESSOR_INVALID: "PREDECESSOR_INVALID",
  CANDIDATE_INVALID: "CANDIDATE_INVALID",
  PROVENANCE_MISSING: "PROVENANCE_MISSING",
  OUT_OF_DOMAIN: "OUT_OF_DOMAIN",
  CERTAINTY_ESCALATION: "CERTAINTY_ESCALATION",
  CONFLICT_SUPPRESSION: "CONFLICT_SUPPRESSION",
  COMPLETENESS_UPGRADE: "COMPLETENESS_UPGRADE",
  NEGATIVE_EVIDENCE_DISAPPEARED: "NEGATIVE_EVIDENCE_DISAPPEARED",
  BOUNDED_CHANGE: "BOUNDED_CHANGE",
  NO_CHANGE: "NO_CHANGE",
});

export function buildUpdateInvariants() {
  return Object.freeze({
    watchIsNotUpdate: true,
    observationIsNotAction: true,
    evaluationIsNotPersistence: true,
    derivedResultIsNotRuntimeMutation: true,
    sideEffectsNone: true,
    deliveryNotAuthorized: true,
    unknownIsNotNone: true,
    unknownIsNotZero: true,
    freshnessIsNotTruth: true,
    staleIsNotFalse: true,
    absenceOfEvidenceIsNotHealthy: true,
    absenceOfFailureIsNotHealthy: true,
    noSilentCertaintyEscalation: true,
    noSilentCompletenessUpgrade: true,
    noConflictSuppressionByRecency: true,
    noP1Mutation: true,
    noPersistentMutation: true,
    noAutomatedTransition: true,
    noProductMarketplaceCoupling: true,
    noPublicationDelivery: true,
    noSupabaseAuthority: true,
    dg02ParkedOutsideCore: true,
  });
}

/**
 * @param {object} parts
 */
export function buildUpdateResult(parts) {
  const dispositions = Object.values(UPDATE_DISPOSITION);
  if (!dispositions.includes(parts.updateDisposition)) {
    throw new Error(`Unsupported updateDisposition: ${parts.updateDisposition}`);
  }
  if (
    parts.operationalState != null &&
    !Object.values(OPERATIONAL_STATE).includes(parts.operationalState)
  ) {
    throw new Error(`Unsupported operational state: ${parts.operationalState}`);
  }

  return Object.freeze({
    meta: Object.freeze({
      schemaId: UPDATE_RESULT_SCHEMA_ID,
      version: SCHEMA_VERSION,
      ruleVersion: RULE_VERSION,
    }),
    updateDisposition: parts.updateDisposition,
    predecessorRef: Object.freeze({ ...parts.predecessorRef }),
    candidateRef: Object.freeze({ ...parts.candidateRef }),
    operationalState: parts.operationalState ?? null,
    honestyContinuity: Object.freeze(parts.honestyContinuity),
    changeSurface: Object.freeze(
      parts.changeSurface.map((c) =>
        Object.freeze({ code: c.code, message: c.message })
      )
    ),
    provenance: Object.freeze({ ...parts.provenance }),
    reasons: Object.freeze(
      parts.reasons.map((r) => Object.freeze({ code: r.code, message: r.message }))
    ),
    invariants: buildUpdateInvariants(),
    sideEffects: SIDE_EFFECTS.NONE,
    delivery: DELIVERY_STATUS.NOT_AUTHORIZED,
  });
}

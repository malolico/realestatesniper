/**
 * SP07-P4 — Failure / Recovery / Dependency contract (DAG-SP07-P4-G1)
 *
 * Documentary schemas:
 *   rsn.operation.failure.evaluation.result.v1
 *   rsn.operation.retry.decision.v1
 *   rsn.operation.recovery.plan.v1
 *   rsn.operation.resumption.result.v1
 *   rsn.operation.transition.recommendation.v1
 *
 * Continuous Operation ≠ continue regardless
 * RETRY ELIGIBILITY ≠ EXECUTION · RECOVERY_ELIGIBLE ≠ RECOVERED
 * REPLAY ≠ RECOVERY · DERIVED TRANSITION ≠ APPLIED
 * sideEffects NONE · persistence NONE · automation NONE · delivery NOT_AUTHORIZED
 * DG-01/02/03/04 parked · ≠ Product · ≠ Supabase · ≠ P1/P2/P3 mutation
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
import {
  UPDATE_RESULT_SCHEMA_ID,
  SCHEMA_VERSION as P2_SCHEMA_VERSION,
} from "../p2/operationUpdateContract.js";
import {
  ARCHIVE_RECORD_SCHEMA_ID,
  ARCHIVE_SEQUENCE_SCHEMA_ID,
  ARCHIVE_REPLAY_RESULT_SCHEMA_ID,
  SCHEMA_VERSION as P3_SCHEMA_VERSION,
} from "../p3/operationArchiveContract.js";

export {
  DELIVERY_STATUS,
  OPERATIONAL_STATE,
  SIDE_EFFECTS,
  SUBJECT_CLASS,
  SUBJECT_SCHEMA_ID,
  WATCH_RESULT_SCHEMA_ID,
  UPDATE_RESULT_SCHEMA_ID,
  ARCHIVE_RECORD_SCHEMA_ID,
  ARCHIVE_SEQUENCE_SCHEMA_ID,
  ARCHIVE_REPLAY_RESULT_SCHEMA_ID,
};

export const FAILURE_EVALUATION_SCHEMA_ID = "rsn.operation.failure.evaluation.result.v1";
export const RETRY_DECISION_SCHEMA_ID = "rsn.operation.retry.decision.v1";
export const RECOVERY_PLAN_SCHEMA_ID = "rsn.operation.recovery.plan.v1";
export const RESUMPTION_RESULT_SCHEMA_ID = "rsn.operation.resumption.result.v1";
export const TRANSITION_RECOMMENDATION_SCHEMA_ID =
  "rsn.operation.transition.recommendation.v1";

export const SCHEMA_VERSION = "v1";
export const RULE_VERSION = "sp07-p4-failure-recovery-dependency.v1";
export const PROGRAM_SCOPE = "SP07-P4";

export const WATCH_RESULT_VERSION = P1_SCHEMA_VERSION;
export const UPDATE_RESULT_VERSION = P2_SCHEMA_VERSION;
export const ARCHIVE_RESULT_VERSION = P3_SCHEMA_VERSION;

export const PERSISTENCE_STATUS = Object.freeze({
  NONE: "NONE",
});

export const AUTOMATION_STATUS = Object.freeze({
  NONE: "NONE",
});

export const EVALUATION_STATUS = Object.freeze({
  ACCEPTED: "ACCEPTED",
  REFUSED: "REFUSED",
});

/** Frozen failure taxonomy distinctions (Grant §5). */
export const FAILURE_CLASS = Object.freeze({
  INVALID_MALFORMED: "INVALID_MALFORMED",
  UNKNOWN: "UNKNOWN",
  INSUFFICIENT_UNHEALTHY: "INSUFFICIENT_UNHEALTHY",
  DEPENDENCY_UNAVAILABLE: "DEPENDENCY_UNAVAILABLE",
  DEPENDENCY_DEGRADED_LIMITED: "DEPENDENCY_DEGRADED_LIMITED",
  FAIL_CLOSED_BLOCKED: "FAIL_CLOSED_BLOCKED",
  TRANSIENT: "TRANSIENT",
  PERSISTENT: "PERSISTENT",
  NONE_DETECTED: "NONE_DETECTED",
});

export const RETRY_ELIGIBILITY = Object.freeze({
  RETRYABLE: "RETRYABLE",
  NOT_RETRYABLE: "NOT_RETRYABLE",
  UNKNOWN: "UNKNOWN",
});

export const RETRY_DECISION = Object.freeze({
  RETRY_ELIGIBLE_DERIVED: "RETRY_ELIGIBLE_DERIVED",
  RETRY_NOT_ELIGIBLE: "RETRY_NOT_ELIGIBLE",
  FAIL_CLOSED: "FAIL_CLOSED",
});

export const RECOVERY_ELIGIBILITY = Object.freeze({
  RECOVERY_ELIGIBLE: "RECOVERY_ELIGIBLE",
  RECOVERY_NOT_ELIGIBLE: "RECOVERY_NOT_ELIGIBLE",
  UNKNOWN: "UNKNOWN",
  NOT_APPLICABLE: "NOT_APPLICABLE",
});

export const RECOVERY_PLAN_STATUS = Object.freeze({
  PLAN_DERIVED: "PLAN_DERIVED",
  NOT_ELIGIBLE: "NOT_ELIGIBLE",
  FAIL_CLOSED: "FAIL_CLOSED",
  NOT_APPLICABLE: "NOT_APPLICABLE",
});

export const RESUMPTION_DISPOSITION = Object.freeze({
  RESUMPTION_EVALUATED: "RESUMPTION_EVALUATED",
  RESUMPTION_NOT_ELIGIBLE: "RESUMPTION_NOT_ELIGIBLE",
  FAIL_CLOSED: "FAIL_CLOSED",
  NOT_APPLICABLE: "NOT_APPLICABLE",
});

export const TRANSITION_DISPOSITION = Object.freeze({
  RECOMMENDATION_DERIVED: "RECOMMENDATION_DERIVED",
  NO_TRANSITION: "NO_TRANSITION",
  FAIL_CLOSED: "FAIL_CLOSED",
});

export const REASON_CODES = Object.freeze({
  STRUCTURAL_INVALID: "STRUCTURAL_INVALID",
  SCHEMA_UNSUPPORTED: "SCHEMA_UNSUPPORTED",
  SUBJECT_INVALID: "SUBJECT_INVALID",
  OUT_OF_DOMAIN: "OUT_OF_DOMAIN",
  INPUT_MISSING: "INPUT_MISSING",
  INPUT_INVALID: "INPUT_INVALID",
  DEPENDENCY_UNAVAILABLE: "DEPENDENCY_UNAVAILABLE",
  AUTHORITY_UNCERTAIN: "AUTHORITY_UNCERTAIN",
  STOP_RULE_PRESSURE: "STOP_RULE_PRESSURE",
  INSUFFICIENT_EVIDENCE: "INSUFFICIENT_EVIDENCE",
  UNKNOWN_POSTURE: "UNKNOWN_POSTURE",
  FAIL_CLOSED: "FAIL_CLOSED",
  RETRY_ELIGIBLE: "RETRY_ELIGIBLE",
  RETRY_NOT_ELIGIBLE: "RETRY_NOT_ELIGIBLE",
  RECOVERY_ELIGIBLE: "RECOVERY_ELIGIBLE",
  RECOVERY_NOT_ELIGIBLE: "RECOVERY_NOT_ELIGIBLE",
  RESUMPTION_EVALUATED: "RESUMPTION_EVALUATED",
  TRANSITION_DERIVED: "TRANSITION_DERIVED",
  NO_FAILURE_DETECTED: "NO_FAILURE_DETECTED",
});

export function buildFailureRecoveryInvariants() {
  return Object.freeze({
    continuousOperationIsNotContinueRegardless: true,
    unknownIsNotFailure: true,
    unknownIsNotHealthy: true,
    unknownIsNotNone: true,
    unknownIsNotZero: true,
    freshnessIsNotTruth: true,
    staleIsNotFalse: true,
    absenceOfFailureIsNotHealthy: true,
    degradedIsNotUnavailable: true,
    retryableIsNotRecovered: true,
    recoveryEligibleIsNotRecovered: true,
    replaySuccessIsNotOperationalRecovery: true,
    retryEligibilityIsNotExecution: true,
    recoveryPlanIsNotAppliedRecovery: true,
    derivedTransitionIsNotApplied: true,
    replayIsNotRecovery: true,
    sideEffectsNone: true,
    deliveryNotAuthorized: true,
    persistenceNone: true,
    automationNone: true,
    noSilentCertaintyEscalation: true,
    noSilentCompletenessUpgrade: true,
    noSilentHealthyEscalation: true,
    noSilentDependencyHealthUpgrade: true,
    noRecoverySuccessClaim: true,
    noResumptionSuccessClaim: true,
    noP1Mutation: true,
    noP2Mutation: true,
    noP3Mutation: true,
    noPersistentMutation: true,
    noAutomatedRetry: true,
    noAutomatedRecovery: true,
    noAutomatedResumption: true,
    noAppliedTransition: true,
    noProductMarketplaceCoupling: true,
    noPublicationDelivery: true,
    noSupabaseAuthority: true,
    noOwnerContactAction: true,
    stopRulePreserved: true,
    dg01Parked: true,
    dg02Parked: true,
    dg03ParkedFailClosedDefault: true,
    dg04Parked: true,
  });
}

function freezeReasons(reasons) {
  return Object.freeze(
    (reasons ?? []).map((r) => Object.freeze({ code: r.code, message: r.message }))
  );
}

/**
 * @param {object} parts
 */
export function buildFailureEvaluationResult(parts) {
  if (!Object.values(FAILURE_CLASS).includes(parts.failureClass)) {
    throw new Error(`Unsupported failureClass: ${parts.failureClass}`);
  }
  return Object.freeze({
    meta: Object.freeze({
      schemaId: FAILURE_EVALUATION_SCHEMA_ID,
      version: SCHEMA_VERSION,
      ruleVersion: RULE_VERSION,
    }),
    evaluationStatus: parts.evaluationStatus,
    failureClass: parts.failureClass,
    subject: parts.subject ? Object.freeze({ ...parts.subject }) : null,
    predecessorRefs: Object.freeze(parts.predecessorRefs),
    honestyUnderFailure: Object.freeze(parts.honestyUnderFailure),
    dependencyPosture: Object.freeze(parts.dependencyPosture),
    failClosed: parts.failClosed === true,
    reasons: freezeReasons(parts.reasons),
    invariants: buildFailureRecoveryInvariants(),
    sideEffects: SIDE_EFFECTS.NONE,
    delivery: DELIVERY_STATUS.NOT_AUTHORIZED,
    persistence: PERSISTENCE_STATUS.NONE,
    automation: AUTOMATION_STATUS.NONE,
  });
}

/**
 * @param {object} parts
 */
export function buildRetryDecision(parts) {
  if (!Object.values(RETRY_ELIGIBILITY).includes(parts.retryEligibility)) {
    throw new Error(`Unsupported retryEligibility: ${parts.retryEligibility}`);
  }
  if (!Object.values(RETRY_DECISION).includes(parts.retryDecision)) {
    throw new Error(`Unsupported retryDecision: ${parts.retryDecision}`);
  }
  return Object.freeze({
    meta: Object.freeze({
      schemaId: RETRY_DECISION_SCHEMA_ID,
      version: SCHEMA_VERSION,
      ruleVersion: RULE_VERSION,
    }),
    evaluationStatus: parts.evaluationStatus,
    retryEligibility: parts.retryEligibility,
    retryDecision: parts.retryDecision,
    retryExecution: Object.freeze({ authorized: false, performed: false }),
    failureClassRef: parts.failureClassRef,
    reasons: freezeReasons(parts.reasons),
    invariants: buildFailureRecoveryInvariants(),
    sideEffects: SIDE_EFFECTS.NONE,
    delivery: DELIVERY_STATUS.NOT_AUTHORIZED,
    persistence: PERSISTENCE_STATUS.NONE,
    automation: AUTOMATION_STATUS.NONE,
  });
}

/**
 * @param {object} parts
 */
export function buildRecoveryPlan(parts) {
  if (!Object.values(RECOVERY_ELIGIBILITY).includes(parts.recoveryEligibility)) {
    throw new Error(`Unsupported recoveryEligibility: ${parts.recoveryEligibility}`);
  }
  if (!Object.values(RECOVERY_PLAN_STATUS).includes(parts.planStatus)) {
    throw new Error(`Unsupported planStatus: ${parts.planStatus}`);
  }
  return Object.freeze({
    meta: Object.freeze({
      schemaId: RECOVERY_PLAN_SCHEMA_ID,
      version: SCHEMA_VERSION,
      ruleVersion: RULE_VERSION,
    }),
    evaluationStatus: parts.evaluationStatus,
    recoveryEligibility: parts.recoveryEligibility,
    planStatus: parts.planStatus,
    recovered: false,
    appliedRecovery: false,
    prerequisites: Object.freeze(parts.prerequisites ?? []),
    replayConsumeOnly: parts.replayConsumeOnly === true,
    replayIsNotRecovery: true,
    reasons: freezeReasons(parts.reasons),
    invariants: buildFailureRecoveryInvariants(),
    sideEffects: SIDE_EFFECTS.NONE,
    delivery: DELIVERY_STATUS.NOT_AUTHORIZED,
    persistence: PERSISTENCE_STATUS.NONE,
    automation: AUTOMATION_STATUS.NONE,
  });
}

/**
 * @param {object} parts
 */
export function buildResumptionResult(parts) {
  if (!Object.values(RESUMPTION_DISPOSITION).includes(parts.resumptionDisposition)) {
    throw new Error(`Unsupported resumptionDisposition: ${parts.resumptionDisposition}`);
  }
  return Object.freeze({
    meta: Object.freeze({
      schemaId: RESUMPTION_RESULT_SCHEMA_ID,
      version: SCHEMA_VERSION,
      ruleVersion: RULE_VERSION,
    }),
    evaluationStatus: parts.evaluationStatus,
    resumptionDisposition: parts.resumptionDisposition,
    resumptionExecuted: false,
    checkpointRestored: false,
    persistentResumeState: false,
    reasons: freezeReasons(parts.reasons),
    invariants: buildFailureRecoveryInvariants(),
    sideEffects: SIDE_EFFECTS.NONE,
    delivery: DELIVERY_STATUS.NOT_AUTHORIZED,
    persistence: PERSISTENCE_STATUS.NONE,
    automation: AUTOMATION_STATUS.NONE,
  });
}

/**
 * @param {object} parts
 */
export function buildTransitionRecommendation(parts) {
  if (!Object.values(TRANSITION_DISPOSITION).includes(parts.transitionDisposition)) {
    throw new Error(`Unsupported transitionDisposition: ${parts.transitionDisposition}`);
  }
  if (
    parts.recommendedOperationalState != null &&
    !Object.values(OPERATIONAL_STATE).includes(parts.recommendedOperationalState)
  ) {
    throw new Error(`Unsupported recommendedOperationalState: ${parts.recommendedOperationalState}`);
  }
  return Object.freeze({
    meta: Object.freeze({
      schemaId: TRANSITION_RECOMMENDATION_SCHEMA_ID,
      version: SCHEMA_VERSION,
      ruleVersion: RULE_VERSION,
    }),
    evaluationStatus: parts.evaluationStatus,
    transitionDisposition: parts.transitionDisposition,
    currentOperationalState: parts.currentOperationalState ?? null,
    recommendedOperationalState: parts.recommendedOperationalState ?? null,
    appliedTransition: false,
    derivedOnly: true,
    reasons: freezeReasons(parts.reasons),
    invariants: buildFailureRecoveryInvariants(),
    sideEffects: SIDE_EFFECTS.NONE,
    delivery: DELIVERY_STATUS.NOT_AUTHORIZED,
    persistence: PERSISTENCE_STATUS.NONE,
    automation: AUTOMATION_STATUS.NONE,
  });
}

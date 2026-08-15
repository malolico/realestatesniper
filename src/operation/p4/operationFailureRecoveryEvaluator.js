/**
 * SP07-P4 — Failure / Recovery / Dependency evaluator (DAG-SP07-P4-G1)
 *
 * Deterministic derived-only failure/dependency · retry · recovery · resumption · transition.
 * sideEffects NONE · persistence NONE · automation NONE · no execution · no P1/P2/P3 mutation · no IO.
 */

import {
  DEPENDENCY_STATUS,
  OPERATIONAL_STATE,
  TRUTH_POSTURE,
} from "../p1/operationWatchContract.js";
import {
  ARCHIVE_REPLAY_RESULT_SCHEMA_ID,
  ARCHIVE_RESULT_VERSION,
  AUTOMATION_STATUS,
  DELIVERY_STATUS,
  EVALUATION_STATUS,
  FAILURE_CLASS,
  FAILURE_EVALUATION_SCHEMA_ID,
  PERSISTENCE_STATUS,
  PROGRAM_SCOPE,
  REASON_CODES,
  RECOVERY_ELIGIBILITY,
  RECOVERY_PLAN_SCHEMA_ID,
  RECOVERY_PLAN_STATUS,
  RESUMPTION_DISPOSITION,
  RESUMPTION_RESULT_SCHEMA_ID,
  RETRY_DECISION,
  RETRY_DECISION_SCHEMA_ID,
  RETRY_ELIGIBILITY,
  RULE_VERSION,
  SCHEMA_VERSION,
  SIDE_EFFECTS,
  SUBJECT_CLASS,
  SUBJECT_SCHEMA_ID,
  TRANSITION_DISPOSITION,
  TRANSITION_RECOMMENDATION_SCHEMA_ID,
  UPDATE_RESULT_SCHEMA_ID,
  UPDATE_RESULT_VERSION,
  WATCH_RESULT_SCHEMA_ID,
  WATCH_RESULT_VERSION,
  buildFailureEvaluationResult,
  buildFailureRecoveryInvariants,
  buildRecoveryPlan,
  buildResumptionResult,
  buildRetryDecision,
  buildTransitionRecommendation,
} from "./operationFailureRecoveryContract.js";

const FORBIDDEN_SUBJECT_MARKERS = Object.freeze([
  "Product",
  "Marketplace",
  "deal",
  "Publication",
  "ELR",
  "owner",
  "contact",
  "SP08",
]);

function deepSnapshot(value) {
  if (value === undefined) return null;
  return structuredClone(value);
}

function refuseCommon(code, errors) {
  return Object.freeze({
    evaluationStatus: EVALUATION_STATUS.REFUSED,
    reasons: Object.freeze(errors.map((message) => Object.freeze({ code, message }))),
    invariants: buildFailureRecoveryInvariants(),
    sideEffects: SIDE_EFFECTS.NONE,
    delivery: DELIVERY_STATUS.NOT_AUTHORIZED,
    persistence: PERSISTENCE_STATUS.NONE,
    automation: AUTOMATION_STATUS.NONE,
  });
}

function subjectFromWatch(watch) {
  return Object.freeze({
    subjectSchemaId: SUBJECT_SCHEMA_ID,
    subjectClass: watch.inputRef?.subjectClass ?? SUBJECT_CLASS,
  });
}

function acceptWatchResult(watch) {
  if (watch == null) {
    return { ok: false, code: REASON_CODES.INPUT_MISSING, errors: ["watchResult missing"] };
  }
  if (typeof watch !== "object" || Array.isArray(watch)) {
    return {
      ok: false,
      code: REASON_CODES.STRUCTURAL_INVALID,
      errors: ["watchResult must be a structured object"],
    };
  }
  const errors = [];
  if (watch.meta?.schemaId !== WATCH_RESULT_SCHEMA_ID) {
    errors.push(`watchResult schemaId must be ${WATCH_RESULT_SCHEMA_ID}`);
  }
  if (watch.meta?.version !== WATCH_RESULT_VERSION) {
    errors.push(`watchResult version must be ${WATCH_RESULT_VERSION}`);
  }
  if (watch.operationalState == null) errors.push("operationalState required");
  if (watch.honesty == null || typeof watch.honesty !== "object") {
    errors.push("honesty required");
  }
  if (watch.sideEffects !== "NONE") errors.push("sideEffects must be NONE");
  if (watch.delivery !== "NOT_AUTHORIZED") errors.push("delivery must be NOT_AUTHORIZED");

  const subjectClass = watch.inputRef?.subjectClass ?? watch.subject?.subjectClass;
  if (subjectClass != null && subjectClass !== SUBJECT_CLASS) {
    errors.push("subjectClass out of domain");
  }
  if (subjectClass && FORBIDDEN_SUBJECT_MARKERS.some((m) => String(subjectClass).includes(m))) {
    errors.push("out-of-domain subject");
  }

  if (errors.length > 0) {
    const code = errors.some((e) => e.includes("schemaId") || e.includes("version"))
      ? REASON_CODES.SCHEMA_UNSUPPORTED
      : errors.some((e) => e.includes("subject") || e.includes("out-of-domain"))
        ? REASON_CODES.OUT_OF_DOMAIN
        : REASON_CODES.INPUT_INVALID;
    return { ok: false, code, errors };
  }
  return { ok: true, watch };
}

function acceptOptionalUpdate(update) {
  if (update == null) return { ok: true, update: null };
  if (typeof update !== "object" || Array.isArray(update)) {
    return {
      ok: false,
      code: REASON_CODES.STRUCTURAL_INVALID,
      errors: ["updateResult must be a structured object"],
    };
  }
  const errors = [];
  if (update.meta?.schemaId !== UPDATE_RESULT_SCHEMA_ID) {
    errors.push(`updateResult schemaId must be ${UPDATE_RESULT_SCHEMA_ID}`);
  }
  if (update.meta?.version !== UPDATE_RESULT_VERSION) {
    errors.push(`updateResult version must be ${UPDATE_RESULT_VERSION}`);
  }
  if (update.sideEffects !== "NONE") errors.push("update sideEffects must be NONE");
  if (update.delivery !== "NOT_AUTHORIZED") errors.push("update delivery must be NOT_AUTHORIZED");
  if (errors.length > 0) {
    return {
      ok: false,
      code: errors.some((e) => e.includes("schemaId") || e.includes("version"))
        ? REASON_CODES.SCHEMA_UNSUPPORTED
        : REASON_CODES.INPUT_INVALID,
      errors,
    };
  }
  return { ok: true, update };
}

function acceptOptionalReplay(replay) {
  if (replay == null) return { ok: true, replay: null };
  if (typeof replay !== "object" || Array.isArray(replay)) {
    return {
      ok: false,
      code: REASON_CODES.STRUCTURAL_INVALID,
      errors: ["replayResult must be a structured object"],
    };
  }
  const errors = [];
  if (replay.meta?.schemaId !== ARCHIVE_REPLAY_RESULT_SCHEMA_ID) {
    errors.push(`replayResult schemaId must be ${ARCHIVE_REPLAY_RESULT_SCHEMA_ID}`);
  }
  if (replay.meta?.version !== ARCHIVE_RESULT_VERSION) {
    errors.push(`replayResult version must be ${ARCHIVE_RESULT_VERSION}`);
  }
  if (replay.sideEffects !== "NONE") errors.push("replay sideEffects must be NONE");
  if (replay.delivery !== "NOT_AUTHORIZED") errors.push("replay delivery must be NOT_AUTHORIZED");
  if (replay.persistence != null && replay.persistence !== "NONE") {
    errors.push("replay persistence must be NONE");
  }
  if (errors.length > 0) {
    return {
      ok: false,
      code: errors.some((e) => e.includes("schemaId") || e.includes("version"))
        ? REASON_CODES.SCHEMA_UNSUPPORTED
        : REASON_CODES.INPUT_INVALID,
      errors,
    };
  }
  return { ok: true, replay: deepSnapshot(replay) };
}

function hasRequiredUnavailable(watch) {
  const deps = watch.healthEvidence?.dependencies ?? watch.dependencies ?? [];
  if (!Array.isArray(deps)) return false;
  return deps.some(
    (d) => d?.required === true && d?.status === DEPENDENCY_STATUS.UNAVAILABLE
  );
}

function hasUnknownTruth(watch) {
  const factual = watch.healthEvidence?.factual ?? [];
  if (Array.isArray(factual) && factual.some((e) => e?.truthPosture === TRUTH_POSTURE.UNKNOWN)) {
    return true;
  }
  return watch.operationalState === OPERATIONAL_STATE.INSUFFICIENT_EVIDENCE;
}

function hasConflict(watch) {
  const factual = watch.healthEvidence?.factual ?? [];
  return (
    Array.isArray(factual) &&
    factual.some((e) => e?.truthPosture === TRUTH_POSTURE.CONFLICT)
  );
}

function hasStopRulePressure(watch, flags) {
  if (flags?.stopRulePressure === true) return true;
  const reasons = watch.reasons ?? [];
  return reasons.some((r) => r?.code === "STOP_RULE_PRESSURE");
}

function hasAuthorityUncertainty(watch, flags) {
  if (flags?.authorityUncertain === true) return true;
  if (watch.operationalState === OPERATIONAL_STATE.AUTHORITY_UNCERTAIN) return true;
  const reasons = watch.reasons ?? [];
  return reasons.some((r) => r?.code === "AUTHORITY_UNCERTAIN");
}

/**
 * Classify failure posture from CLOSED P1 watch (+ optional flags).
 * DG-03: UNAVAILABLE critical dependency → fail-closed; never invent degraded-but-operating.
 */
function classifyFailure(watch, flags) {
  const reasons = [];

  if (hasStopRulePressure(watch, flags)) {
    return {
      failureClass: FAILURE_CLASS.FAIL_CLOSED_BLOCKED,
      failClosed: true,
      reasons: [
        {
          code: REASON_CODES.STOP_RULE_PRESSURE,
          message: "Stop Rule pressure — fail-closed; Continuous Operation ≠ continue regardless",
        },
      ],
    };
  }

  if (hasAuthorityUncertainty(watch, flags)) {
    return {
      failureClass: FAILURE_CLASS.FAIL_CLOSED_BLOCKED,
      failClosed: true,
      reasons: [
        {
          code: REASON_CODES.AUTHORITY_UNCERTAIN,
          message: "authority uncertainty blocks continuation",
        },
      ],
    };
  }

  if (hasRequiredUnavailable(watch)) {
    return {
      failureClass: FAILURE_CLASS.DEPENDENCY_UNAVAILABLE,
      failClosed: true,
      reasons: [
        {
          code: REASON_CODES.DEPENDENCY_UNAVAILABLE,
          message:
            "required dependency UNAVAILABLE — fail-closed (DG-03 park: not degraded-but-operating)",
        },
      ],
    };
  }

  if (
    watch.operationalState === OPERATIONAL_STATE.FAIL_CLOSED ||
    watch.operationalState === OPERATIONAL_STATE.BLOCKED ||
    hasConflict(watch)
  ) {
    return {
      failureClass: FAILURE_CLASS.FAIL_CLOSED_BLOCKED,
      failClosed: true,
      reasons: [
        {
          code: REASON_CODES.FAIL_CLOSED,
          message: "blocked / fail-closed / conflict posture",
        },
      ],
    };
  }

  if (watch.operationalState === OPERATIONAL_STATE.UNAVAILABLE) {
    return {
      failureClass: FAILURE_CLASS.DEPENDENCY_UNAVAILABLE,
      failClosed: true,
      reasons: [
        {
          code: REASON_CODES.DEPENDENCY_UNAVAILABLE,
          message: "operationalState UNAVAILABLE — fail-closed under DG-03 park",
        },
      ],
    };
  }

  if (
    watch.operationalState === OPERATIONAL_STATE.INSUFFICIENT_EVIDENCE ||
    (hasUnknownTruth(watch) && watch.operationalState !== OPERATIONAL_STATE.HEALTHY)
  ) {
    if (
      watch.healthEvidence?.factual?.some((e) => e?.truthPosture === TRUTH_POSTURE.UNKNOWN) ||
      watch.operationalState === OPERATIONAL_STATE.INSUFFICIENT_EVIDENCE
    ) {
      const isUnknown =
        watch.healthEvidence?.factual?.some((e) => e?.truthPosture === TRUTH_POSTURE.UNKNOWN) ===
        true;
      return {
        failureClass: isUnknown ? FAILURE_CLASS.UNKNOWN : FAILURE_CLASS.INSUFFICIENT_UNHEALTHY,
        failClosed: true,
        reasons: [
          {
            code: isUnknown ? REASON_CODES.UNKNOWN_POSTURE : REASON_CODES.INSUFFICIENT_EVIDENCE,
            message: isUnknown
              ? "UNKNOWN preserved — UNKNOWN ≠ FAILURE ≠ HEALTHY"
              : "insufficient / unhealthy evidence — fail-closed",
          },
        ],
      };
    }
  }

  if (watch.operationalState === OPERATIONAL_STATE.STALE) {
    return {
      failureClass: FAILURE_CLASS.TRANSIENT,
      failClosed: false,
      reasons: [
        {
          code: REASON_CODES.INSUFFICIENT_EVIDENCE,
          message: "STALE classified transient for eligibility — freshness ≠ truth · stale ≠ false",
        },
      ],
    };
  }

  if (watch.operationalState === OPERATIONAL_STATE.DEGRADED) {
    return {
      failureClass: FAILURE_CLASS.DEPENDENCY_DEGRADED_LIMITED,
      failClosed: false,
      reasons: [
        {
          code: REASON_CODES.FAIL_CLOSED,
          message:
            "DEGRADED/LIMITED preserved — DEGRADED ≠ UNAVAILABLE; not invented degraded-but-operating for UNAVAILABLE",
        },
      ],
    };
  }

  if (watch.operationalState === OPERATIONAL_STATE.HEALTHY) {
    return {
      failureClass: FAILURE_CLASS.NONE_DETECTED,
      failClosed: false,
      reasons: [
        {
          code: REASON_CODES.NO_FAILURE_DETECTED,
          message: "no failure detected — absence of failure ≠ invented recovery",
        },
      ],
    };
  }

  // Persistent residual / unrecognized non-healthy
  reasons.push({
    code: REASON_CODES.FAIL_CLOSED,
    message: `unresolved posture ${watch.operationalState} — fail-closed`,
  });
  return {
    failureClass: FAILURE_CLASS.PERSISTENT,
    failClosed: true,
    reasons,
  };
}

function honestySnapshot(watch, classification) {
  return Object.freeze({
    unknownIsNotFailure: true,
    unknownIsNotHealthy: true,
    unknownIsNotNone: true,
    unknownIsNotZero: true,
    freshnessIsNotTruth: true,
    staleIsNotFalse: true,
    absenceOfFailureIsNotHealthy: true,
    degradedIsNotUnavailable: true,
    failureClass: classification.failureClass,
    preservedHonesty: deepSnapshot(watch.honesty),
    noSilentHealthyEscalation: classification.failureClass !== FAILURE_CLASS.NONE_DETECTED
      ? watch.operationalState !== OPERATIONAL_STATE.HEALTHY ||
        classification.failureClass === FAILURE_CLASS.NONE_DETECTED
      : true,
  });
}

function dependencyPosture(watch, classification) {
  return Object.freeze({
    dg03ParkedFailClosedDefault: true,
    unavailableCriticalForcesFailClosed: classification.failClosed === true &&
      (classification.failureClass === FAILURE_CLASS.DEPENDENCY_UNAVAILABLE ||
        watch.operationalState === OPERATIONAL_STATE.UNAVAILABLE),
    inventedDegradedButOperating: false,
    watchOperationalState: watch.operationalState,
    requiredUnavailable: hasRequiredUnavailable(watch),
  });
}

/**
 * @param {object} input
 * @param {object} [input.watchResult]
 * @param {object} [input.updateResult]
 * @param {object} [input.replayResult]
 * @param {object} [input.flags]
 */
export function evaluateFailure(input) {
  if (input == null || typeof input !== "object" || Array.isArray(input)) {
    const refused = refuseCommon(REASON_CODES.STRUCTURAL_INVALID, [
      "evaluation input must be a structured object",
    ]);
    return Object.freeze({
      ...refused,
      failureEvaluation: null,
    });
  }

  const watchAcc = acceptWatchResult(input.watchResult);
  if (!watchAcc.ok) {
    const refused = refuseCommon(watchAcc.code, watchAcc.errors);
    return Object.freeze({
      ...refused,
      failureEvaluation: buildFailureEvaluationResult({
        evaluationStatus: EVALUATION_STATUS.REFUSED,
        failureClass: FAILURE_CLASS.INVALID_MALFORMED,
        subject: null,
        predecessorRefs: Object.freeze({
          watchResult: false,
          updateResult: false,
          replayResult: false,
        }),
        honestyUnderFailure: Object.freeze({
          unknownIsNotFailure: true,
          unknownIsNotHealthy: true,
        }),
        dependencyPosture: Object.freeze({
          dg03ParkedFailClosedDefault: true,
          inventedDegradedButOperating: false,
        }),
        failClosed: true,
        reasons: refused.reasons,
      }),
    });
  }

  const updateAcc = acceptOptionalUpdate(input.updateResult);
  if (!updateAcc.ok) {
    const refused = refuseCommon(updateAcc.code, updateAcc.errors);
    return Object.freeze({
      ...refused,
      failureEvaluation: null,
    });
  }

  const replayAcc = acceptOptionalReplay(input.replayResult);
  if (!replayAcc.ok) {
    const refused = refuseCommon(replayAcc.code, replayAcc.errors);
    return Object.freeze({
      ...refused,
      failureEvaluation: null,
    });
  }

  const classification = classifyFailure(watchAcc.watch, input.flags);
  const result = buildFailureEvaluationResult({
    evaluationStatus: EVALUATION_STATUS.ACCEPTED,
    failureClass: classification.failureClass,
    subject: subjectFromWatch(watchAcc.watch),
    predecessorRefs: Object.freeze({
      watchResult: true,
      updateResult: updateAcc.update != null,
      replayResult: replayAcc.replay != null,
      watchSchemaId: WATCH_RESULT_SCHEMA_ID,
      updateSchemaId: updateAcc.update ? UPDATE_RESULT_SCHEMA_ID : null,
      replaySchemaId: replayAcc.replay ? ARCHIVE_REPLAY_RESULT_SCHEMA_ID : null,
    }),
    honestyUnderFailure: honestySnapshot(watchAcc.watch, classification),
    dependencyPosture: dependencyPosture(watchAcc.watch, classification),
    failClosed: classification.failClosed,
    reasons: classification.reasons,
  });

  return Object.freeze({
    evaluationStatus: EVALUATION_STATUS.ACCEPTED,
    failureEvaluation: result,
    reasons: result.reasons,
    invariants: buildFailureRecoveryInvariants(),
    sideEffects: SIDE_EFFECTS.NONE,
    delivery: DELIVERY_STATUS.NOT_AUTHORIZED,
    persistence: PERSISTENCE_STATUS.NONE,
    automation: AUTOMATION_STATUS.NONE,
    _context: Object.freeze({
      watch: watchAcc.watch,
      update: updateAcc.update,
      replay: replayAcc.replay,
      classification,
    }),
  });
}

function deriveRetryFromFailure(failureEval) {
  const fc = failureEval.failureClass;
  if (fc === FAILURE_CLASS.INVALID_MALFORMED || failureEval.evaluationStatus === EVALUATION_STATUS.REFUSED) {
    return {
      eligibility: RETRY_ELIGIBILITY.NOT_RETRYABLE,
      decision: RETRY_DECISION.FAIL_CLOSED,
      reasons: [
        {
          code: REASON_CODES.FAIL_CLOSED,
          message: "malformed/refused — not retryable; eligibility ≠ execution",
        },
      ],
    };
  }
  if (fc === FAILURE_CLASS.UNKNOWN) {
    return {
      eligibility: RETRY_ELIGIBILITY.UNKNOWN,
      decision: RETRY_DECISION.RETRY_NOT_ELIGIBLE,
      reasons: [
        {
          code: REASON_CODES.UNKNOWN_POSTURE,
          message: "UNKNOWN ≠ FAILURE — retry eligibility UNKNOWN; not recovered",
        },
      ],
    };
  }
  if (fc === FAILURE_CLASS.TRANSIENT) {
    return {
      eligibility: RETRY_ELIGIBILITY.RETRYABLE,
      decision: RETRY_DECISION.RETRY_ELIGIBLE_DERIVED,
      reasons: [
        {
          code: REASON_CODES.RETRY_ELIGIBLE,
          message: "transient classification — retry eligible derived; execution FORBIDDEN",
        },
      ],
    };
  }
  if (
    fc === FAILURE_CLASS.DEPENDENCY_UNAVAILABLE ||
    fc === FAILURE_CLASS.FAIL_CLOSED_BLOCKED ||
    fc === FAILURE_CLASS.PERSISTENT ||
    fc === FAILURE_CLASS.INSUFFICIENT_UNHEALTHY
  ) {
    return {
      eligibility: RETRY_ELIGIBILITY.NOT_RETRYABLE,
      decision: RETRY_DECISION.RETRY_NOT_ELIGIBLE,
      reasons: [
        {
          code: REASON_CODES.RETRY_NOT_ELIGIBLE,
          message: "fail-closed/persistent/unavailable — not retryable; no execution",
        },
      ],
    };
  }
  if (fc === FAILURE_CLASS.DEPENDENCY_DEGRADED_LIMITED) {
    return {
      eligibility: RETRY_ELIGIBILITY.NOT_RETRYABLE,
      decision: RETRY_DECISION.RETRY_NOT_ELIGIBLE,
      reasons: [
        {
          code: REASON_CODES.RETRY_NOT_ELIGIBLE,
          message: "degraded/limited — not automatic retry; eligibility ≠ execution",
        },
      ],
    };
  }
  // NONE_DETECTED
  return {
    eligibility: RETRY_ELIGIBILITY.NOT_RETRYABLE,
    decision: RETRY_DECISION.RETRY_NOT_ELIGIBLE,
    reasons: [
      {
        code: REASON_CODES.NO_FAILURE_DETECTED,
        message: "no failure — retry not applicable; RETRYABLE ≠ RECOVERED",
      },
    ],
  };
}

/**
 * @param {object} input
 */
export function decideRetry(input) {
  const failure = evaluateFailure(input);
  if (failure.evaluationStatus === EVALUATION_STATUS.REFUSED || failure.failureEvaluation == null) {
    const refused = refuseCommon(
      failure.reasons?.[0]?.code ?? REASON_CODES.FAIL_CLOSED,
      (failure.reasons ?? []).map((r) => r.message)
    );
    return Object.freeze({
      ...refused,
      retryDecision: buildRetryDecision({
        evaluationStatus: EVALUATION_STATUS.REFUSED,
        retryEligibility: RETRY_ELIGIBILITY.NOT_RETRYABLE,
        retryDecision: RETRY_DECISION.FAIL_CLOSED,
        failureClassRef: FAILURE_CLASS.INVALID_MALFORMED,
        reasons: refused.reasons,
      }),
    });
  }

  const derived = deriveRetryFromFailure(failure.failureEvaluation);
  const decision = buildRetryDecision({
    evaluationStatus: EVALUATION_STATUS.ACCEPTED,
    retryEligibility: derived.eligibility,
    retryDecision: derived.decision,
    failureClassRef: failure.failureEvaluation.failureClass,
    reasons: derived.reasons,
  });

  return Object.freeze({
    evaluationStatus: EVALUATION_STATUS.ACCEPTED,
    retryDecision: decision,
    reasons: decision.reasons,
    invariants: buildFailureRecoveryInvariants(),
    sideEffects: SIDE_EFFECTS.NONE,
    delivery: DELIVERY_STATUS.NOT_AUTHORIZED,
    persistence: PERSISTENCE_STATUS.NONE,
    automation: AUTOMATION_STATUS.NONE,
  });
}

function deriveRecoveryFromFailure(failureEval, replay) {
  const fc = failureEval.failureClass;
  if (fc === FAILURE_CLASS.INVALID_MALFORMED) {
    return {
      eligibility: RECOVERY_ELIGIBILITY.RECOVERY_NOT_ELIGIBLE,
      planStatus: RECOVERY_PLAN_STATUS.FAIL_CLOSED,
      prerequisites: [],
      reasons: [
        {
          code: REASON_CODES.FAIL_CLOSED,
          message: "malformed — recovery not eligible; plan ≠ applied",
        },
      ],
    };
  }
  if (fc === FAILURE_CLASS.NONE_DETECTED) {
    return {
      eligibility: RECOVERY_ELIGIBILITY.NOT_APPLICABLE,
      planStatus: RECOVERY_PLAN_STATUS.NOT_APPLICABLE,
      prerequisites: [],
      reasons: [
        {
          code: REASON_CODES.NO_FAILURE_DETECTED,
          message: "no recovery needed — RECOVERY_ELIGIBLE ≠ RECOVERED",
        },
      ],
    };
  }
  if (
    fc === FAILURE_CLASS.FAIL_CLOSED_BLOCKED &&
    failureEval.reasons?.some((r) => r.code === REASON_CODES.AUTHORITY_UNCERTAIN)
  ) {
    return {
      eligibility: RECOVERY_ELIGIBILITY.RECOVERY_NOT_ELIGIBLE,
      planStatus: RECOVERY_PLAN_STATUS.FAIL_CLOSED,
      prerequisites: Object.freeze(["resolve authority uncertainty before recovery plan"]),
      reasons: [
        {
          code: REASON_CODES.AUTHORITY_UNCERTAIN,
          message: "authority uncertainty — recovery not eligible; not recovered",
        },
      ],
    };
  }
  if (fc === FAILURE_CLASS.UNKNOWN) {
    return {
      eligibility: RECOVERY_ELIGIBILITY.UNKNOWN,
      planStatus: RECOVERY_PLAN_STATUS.NOT_ELIGIBLE,
      prerequisites: Object.freeze(["preserve UNKNOWN; do not escalate to known-good"]),
      reasons: [
        {
          code: REASON_CODES.UNKNOWN_POSTURE,
          message: "UNKNOWN recovery eligibility — ≠ recovered",
        },
      ],
    };
  }

  const prerequisites = [];
  if (fc === FAILURE_CLASS.DEPENDENCY_UNAVAILABLE) {
    prerequisites.push("required dependency must become REACHABLE");
    prerequisites.push("re-evaluate watch under fail-closed Stop Rule");
  } else if (fc === FAILURE_CLASS.TRANSIENT || fc === FAILURE_CLASS.DEPENDENCY_DEGRADED_LIMITED) {
    prerequisites.push("obtain CURRENT required evidence");
    prerequisites.push("re-evaluate without silent HEALTHY escalation");
  } else {
    prerequisites.push("clear blocking conflict or fail-closed cause");
    prerequisites.push("re-evaluate under Stop Rule");
  }
  if (replay != null) {
    prerequisites.push("may consume P3 replay evidence read-only (REPLAY ≠ RECOVERY)");
  }

  return {
    eligibility: RECOVERY_ELIGIBILITY.RECOVERY_ELIGIBLE,
    planStatus: RECOVERY_PLAN_STATUS.PLAN_DERIVED,
    prerequisites: Object.freeze(prerequisites),
    reasons: [
      {
        code: REASON_CODES.RECOVERY_ELIGIBLE,
        message:
          "recovery plan derived — RECOVERY_ELIGIBLE ≠ RECOVERED · RECOVERY_PLAN ≠ APPLIED_RECOVERY",
      },
    ],
  };
}

/**
 * @param {object} input
 */
export function planRecovery(input) {
  const failure = evaluateFailure(input);
  if (failure.evaluationStatus === EVALUATION_STATUS.REFUSED || failure.failureEvaluation == null) {
    const refused = refuseCommon(
      failure.reasons?.[0]?.code ?? REASON_CODES.FAIL_CLOSED,
      (failure.reasons ?? []).map((r) => r.message)
    );
    return Object.freeze({
      ...refused,
      recoveryPlan: buildRecoveryPlan({
        evaluationStatus: EVALUATION_STATUS.REFUSED,
        recoveryEligibility: RECOVERY_ELIGIBILITY.RECOVERY_NOT_ELIGIBLE,
        planStatus: RECOVERY_PLAN_STATUS.FAIL_CLOSED,
        prerequisites: [],
        replayConsumeOnly: false,
        reasons: refused.reasons,
      }),
    });
  }

  const replay = failure._context?.replay ?? null;
  const derived = deriveRecoveryFromFailure(failure.failureEvaluation, replay);
  const plan = buildRecoveryPlan({
    evaluationStatus: EVALUATION_STATUS.ACCEPTED,
    recoveryEligibility: derived.eligibility,
    planStatus: derived.planStatus,
    prerequisites: derived.prerequisites,
    replayConsumeOnly: replay != null,
    reasons: derived.reasons,
  });

  return Object.freeze({
    evaluationStatus: EVALUATION_STATUS.ACCEPTED,
    recoveryPlan: plan,
    reasons: plan.reasons,
    invariants: buildFailureRecoveryInvariants(),
    sideEffects: SIDE_EFFECTS.NONE,
    delivery: DELIVERY_STATUS.NOT_AUTHORIZED,
    persistence: PERSISTENCE_STATUS.NONE,
    automation: AUTOMATION_STATUS.NONE,
  });
}

/**
 * @param {object} input
 */
export function evaluateResumption(input) {
  const recovery = planRecovery(input);
  if (recovery.evaluationStatus === EVALUATION_STATUS.REFUSED || recovery.recoveryPlan == null) {
    const refused = refuseCommon(
      recovery.reasons?.[0]?.code ?? REASON_CODES.FAIL_CLOSED,
      (recovery.reasons ?? []).map((r) => r.message)
    );
    return Object.freeze({
      ...refused,
      resumptionResult: buildResumptionResult({
        evaluationStatus: EVALUATION_STATUS.REFUSED,
        resumptionDisposition: RESUMPTION_DISPOSITION.FAIL_CLOSED,
        reasons: refused.reasons,
      }),
    });
  }

  const plan = recovery.recoveryPlan;
  let disposition;
  let reasons;
  if (plan.recoveryEligibility === RECOVERY_ELIGIBILITY.NOT_APPLICABLE) {
    disposition = RESUMPTION_DISPOSITION.NOT_APPLICABLE;
    reasons = [
      {
        code: REASON_CODES.NO_FAILURE_DETECTED,
        message: "resumption not applicable — execution NOT AUTHORIZED",
      },
    ];
  } else if (plan.recoveryEligibility === RECOVERY_ELIGIBILITY.RECOVERY_ELIGIBLE) {
    disposition = RESUMPTION_DISPOSITION.RESUMPTION_EVALUATED;
    reasons = [
      {
        code: REASON_CODES.RESUMPTION_EVALUATED,
        message:
          "resumption evaluated from recovery plan — execution FORBIDDEN · no checkpoint restore",
      },
    ];
  } else if (plan.recoveryEligibility === RECOVERY_ELIGIBILITY.UNKNOWN) {
    disposition = RESUMPTION_DISPOSITION.RESUMPTION_NOT_ELIGIBLE;
    reasons = [
      {
        code: REASON_CODES.UNKNOWN_POSTURE,
        message: "UNKNOWN recovery eligibility — resumption not eligible; ≠ success claim",
      },
    ];
  } else {
    disposition = RESUMPTION_DISPOSITION.RESUMPTION_NOT_ELIGIBLE;
    reasons = [
      {
        code: REASON_CODES.RECOVERY_NOT_ELIGIBLE,
        message: "recovery not eligible — resumption not eligible; execution FORBIDDEN",
      },
    ];
  }

  const result = buildResumptionResult({
    evaluationStatus: EVALUATION_STATUS.ACCEPTED,
    resumptionDisposition: disposition,
    reasons,
  });

  return Object.freeze({
    evaluationStatus: EVALUATION_STATUS.ACCEPTED,
    resumptionResult: result,
    reasons: result.reasons,
    invariants: buildFailureRecoveryInvariants(),
    sideEffects: SIDE_EFFECTS.NONE,
    delivery: DELIVERY_STATUS.NOT_AUTHORIZED,
    persistence: PERSISTENCE_STATUS.NONE,
    automation: AUTOMATION_STATUS.NONE,
  });
}

/**
 * Derived transition recommendation only — never applied.
 * @param {object} input
 */
export function recommendTransition(input) {
  const failure = evaluateFailure(input);
  if (failure.evaluationStatus === EVALUATION_STATUS.REFUSED || failure.failureEvaluation == null) {
    const refused = refuseCommon(
      failure.reasons?.[0]?.code ?? REASON_CODES.FAIL_CLOSED,
      (failure.reasons ?? []).map((r) => r.message)
    );
    return Object.freeze({
      ...refused,
      transitionRecommendation: buildTransitionRecommendation({
        evaluationStatus: EVALUATION_STATUS.REFUSED,
        transitionDisposition: TRANSITION_DISPOSITION.FAIL_CLOSED,
        currentOperationalState: null,
        recommendedOperationalState: OPERATIONAL_STATE.FAIL_CLOSED,
        reasons: refused.reasons,
      }),
    });
  }

  const watch = failure._context.watch;
  const current = watch.operationalState;
  const fc = failure.failureEvaluation.failureClass;

  let recommended = current;
  let disposition = TRANSITION_DISPOSITION.NO_TRANSITION;
  const reasons = [];

  if (fc === FAILURE_CLASS.NONE_DETECTED) {
    disposition = TRANSITION_DISPOSITION.NO_TRANSITION;
    recommended = OPERATIONAL_STATE.HEALTHY;
    reasons.push({
      code: REASON_CODES.NO_FAILURE_DETECTED,
      message: "no transition recommended — derived ≠ applied",
    });
  } else if (
    fc === FAILURE_CLASS.DEPENDENCY_UNAVAILABLE ||
    fc === FAILURE_CLASS.FAIL_CLOSED_BLOCKED ||
    fc === FAILURE_CLASS.PERSISTENT
  ) {
    disposition = TRANSITION_DISPOSITION.RECOMMENDATION_DERIVED;
    recommended = OPERATIONAL_STATE.FAIL_CLOSED;
    reasons.push({
      code: REASON_CODES.TRANSITION_DERIVED,
      message: "recommend FAIL_CLOSED posture — DERIVED TRANSITION ≠ APPLIED TRANSITION",
    });
  } else if (fc === FAILURE_CLASS.UNKNOWN || fc === FAILURE_CLASS.INSUFFICIENT_UNHEALTHY) {
    disposition = TRANSITION_DISPOSITION.RECOMMENDATION_DERIVED;
    recommended = OPERATIONAL_STATE.INSUFFICIENT_EVIDENCE;
    reasons.push({
      code: REASON_CODES.TRANSITION_DERIVED,
      message: "recommend INSUFFICIENT_EVIDENCE — no silent HEALTHY escalation",
    });
  } else if (fc === FAILURE_CLASS.TRANSIENT) {
    disposition = TRANSITION_DISPOSITION.RECOMMENDATION_DERIVED;
    recommended = OPERATIONAL_STATE.STALE;
    reasons.push({
      code: REASON_CODES.TRANSITION_DERIVED,
      message: "recommend retain STALE — stale ≠ false · derived ≠ applied",
    });
  } else if (fc === FAILURE_CLASS.DEPENDENCY_DEGRADED_LIMITED) {
    disposition = TRANSITION_DISPOSITION.RECOMMENDATION_DERIVED;
    recommended = OPERATIONAL_STATE.DEGRADED;
    reasons.push({
      code: REASON_CODES.TRANSITION_DERIVED,
      message: "recommend retain DEGRADED — DEGRADED ≠ UNAVAILABLE · derived ≠ applied",
    });
  }

  const rec = buildTransitionRecommendation({
    evaluationStatus: EVALUATION_STATUS.ACCEPTED,
    transitionDisposition: disposition,
    currentOperationalState: current,
    recommendedOperationalState: recommended,
    reasons,
  });

  return Object.freeze({
    evaluationStatus: EVALUATION_STATUS.ACCEPTED,
    transitionRecommendation: rec,
    reasons: rec.reasons,
    invariants: buildFailureRecoveryInvariants(),
    sideEffects: SIDE_EFFECTS.NONE,
    delivery: DELIVERY_STATUS.NOT_AUTHORIZED,
    persistence: PERSISTENCE_STATUS.NONE,
    automation: AUTOMATION_STATUS.NONE,
  });
}

/**
 * Combined posture evaluation (derived-only bundle).
 * @param {object} input
 */
export function evaluateFailureRecoveryPosture(input) {
  const failure = evaluateFailure(input);
  if (failure.evaluationStatus === EVALUATION_STATUS.REFUSED) {
    return Object.freeze({
      evaluationStatus: EVALUATION_STATUS.REFUSED,
      failureEvaluation: failure.failureEvaluation,
      retryDecision: null,
      recoveryPlan: null,
      resumptionResult: null,
      transitionRecommendation: null,
      reasons: failure.reasons,
      invariants: buildFailureRecoveryInvariants(),
      sideEffects: SIDE_EFFECTS.NONE,
      delivery: DELIVERY_STATUS.NOT_AUTHORIZED,
      persistence: PERSISTENCE_STATUS.NONE,
      automation: AUTOMATION_STATUS.NONE,
    });
  }

  const retry = decideRetry(input);
  const recovery = planRecovery(input);
  const resumption = evaluateResumption(input);
  const transition = recommendTransition(input);

  return Object.freeze({
    evaluationStatus: EVALUATION_STATUS.ACCEPTED,
    failureEvaluation: failure.failureEvaluation,
    retryDecision: retry.retryDecision,
    recoveryPlan: recovery.recoveryPlan,
    resumptionResult: resumption.resumptionResult,
    transitionRecommendation: transition.transitionRecommendation,
    reasons: Object.freeze([
      ...failure.reasons,
      ...retry.reasons,
      ...recovery.reasons,
      ...resumption.reasons,
      ...transition.reasons,
    ]),
    invariants: buildFailureRecoveryInvariants(),
    sideEffects: SIDE_EFFECTS.NONE,
    delivery: DELIVERY_STATUS.NOT_AUTHORIZED,
    persistence: PERSISTENCE_STATUS.NONE,
    automation: AUTOMATION_STATUS.NONE,
    meta: Object.freeze({
      programScope: PROGRAM_SCOPE,
      ruleVersion: RULE_VERSION,
      schemaVersion: SCHEMA_VERSION,
      schemas: Object.freeze([
        FAILURE_EVALUATION_SCHEMA_ID,
        RETRY_DECISION_SCHEMA_ID,
        RECOVERY_PLAN_SCHEMA_ID,
        RESUMPTION_RESULT_SCHEMA_ID,
        TRANSITION_RECOMMENDATION_SCHEMA_ID,
      ]),
    }),
  });
}

/** Static wall markers for proof harness (no runtime coupling). */
export const SP07_P4_WALL_MARKERS = Object.freeze({
  sideEffects: SIDE_EFFECTS.NONE,
  delivery: DELIVERY_STATUS.NOT_AUTHORIZED,
  persistence: PERSISTENCE_STATUS.NONE,
  automation: AUTOMATION_STATUS.NONE,
  supabaseAuthority: false,
  retryExecution: false,
  recoveryExecution: false,
  resumptionExecution: false,
  appliedTransition: false,
  scheduling: false,
  externalIo: false,
  p1Mutation: false,
  p2Mutation: false,
  p3Mutation: false,
  productCoupling: false,
  marketplaceCoupling: false,
  publicationDelivery: false,
  ownerContact: false,
  p5Opened: false,
  sp08Opened: false,
  dg01Parked: true,
  dg02Parked: true,
  dg03ParkedFailClosedDefault: true,
  dg04Parked: true,
  replayIsNotRecovery: true,
  derivedTransitionIsNotApplied: true,
  stopRulePreserved: true,
});

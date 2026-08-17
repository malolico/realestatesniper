/**
 * SP09-P6 — Bounded Re-plan (CB-13)
 *
 * One current-state re-evaluation only:
 *   previous ResearchPlannerStateV1
 *   + explicit P5 feedback mapping
 *   + caller-supplied openConflicts
 *   → at most one planAdaptiveResearch
 *   → P6-local disposition CONTINUE | STOP | NO_PROGRESS | REJECTED
 *
 * Does NOT: execute P4, apply P5, loop/retry/recurse, invent WAIT/HUMAN_REVIEW,
 * extend PLANNING_DECISION_STATUS, mutate CB13 stores, or implement P7.
 */

import {
  planAdaptiveResearch,
  validateResearchPlannerStateV1,
} from "./adaptivePlanner.js";
import { PLANNING_DECISION_STATUS } from "./researchContracts.js";
import { EVIDENCE_FEEDBACK_KIND } from "./evidenceFeedback.js";

export const BOUNDED_REPLAN_PROGRAM = "SP09-P6";
export const BOUNDED_REPLAN_VERSION = "v1";

/** P6-local dispositions — not P1 PlanningDecision statuses. */
export const BOUNDED_REPLAN_DISPOSITION = Object.freeze({
  CONTINUE: "CONTINUE",
  STOP: "STOP",
  NO_PROGRESS: "NO_PROGRESS",
  REJECTED: "REJECTED",
});

export const BOUNDED_REPLAN_AUTHORITY = Object.freeze({
  evidenceAuthority: "CB-06",
  isEvidence: false,
  isFact: false,
  resultIsNotEvidence: true,
  resultIsNotFact: true,
  executionAuthorized: false,
  planningIsNotExecution: true,
  replanDoesNotAuthorizeExecution: true,
  replanDoesNotAuthorizeOpportunity: true,
  replanDoesNotPublish: true,
  replanIsNotSp10: true,
  replanIsNotGoldenPath: true,
  maxPlannerInvocations: 1,
  waitDispositionForbidden: true,
  humanReviewDispositionForbidden: true,
  hardPolicyOutranksPlanner: true,
});

const NON_EMPTY_STRING = (v) => typeof v === "string" && v.trim().length > 0;

function isPlainObject(v) {
  return v != null && typeof v === "object" && !Array.isArray(v);
}

function isNonNegativeInteger(v) {
  return typeof v === "number" && Number.isInteger(v) && v >= 0;
}

function emptyResult(overrides = {}) {
  const {
    errors: overrideErrors,
    ok: overrideOk,
    disposition: overrideDisposition,
    plannerInvocations: overrideInvocations,
    ...rest
  } = overrides;
  return Object.freeze({
    ok: overrideOk === true,
    previousState: null,
    stateUsed: null,
    stateChanged: false,
    previousAction: null,
    decision: null,
    feedbackKind: null,
    ...BOUNDED_REPLAN_AUTHORITY,
    ...rest,
    errors: Object.freeze([...(overrideErrors ?? [])]),
    plannerInvocations: overrideInvocations ?? 0,
    disposition: overrideDisposition ?? BOUNDED_REPLAN_DISPOSITION.REJECTED,
  });
}

function statesEqual(a, b) {
  return (
    a.evidenceSufficient === b.evidenceSufficient &&
    a.multiDomainGap === b.multiDomainGap &&
    a.openConflicts === b.openConflicts
  );
}

function freezeState(state) {
  return Object.freeze({
    evidenceSufficient: state.evidenceSufficient,
    multiDomainGap: state.multiDomainGap,
    openConflicts: state.openConflicts,
  });
}

function validatePreviousAction(previousAction) {
  if (previousAction == null) {
    return { ok: true, errors: [], action: null };
  }
  if (!isPlainObject(previousAction)) {
    return { ok: false, errors: ["previousAction must be null or a plain object"], action: null };
  }
  if (!NON_EMPTY_STRING(previousAction.researchActionId)) {
    return { ok: false, errors: ["previousAction.researchActionId must be a non-empty string"], action: null };
  }
  const action = {
    researchActionId: previousAction.researchActionId,
  };
  if (previousAction.capabilityNeed != null) {
    if (!NON_EMPTY_STRING(previousAction.capabilityNeed)) {
      return { ok: false, errors: ["previousAction.capabilityNeed must be a non-empty string when present"], action: null };
    }
    action.capabilityNeed = previousAction.capabilityNeed;
  }
  return { ok: true, errors: [], action: Object.freeze(action) };
}

function validateObservation(observation) {
  if (!isPlainObject(observation)) {
    return { ok: false, errors: ["STATE_OBSERVATION requires stateObservation as a plain object"] };
  }
  if (typeof observation.evidenceSufficient !== "boolean") {
    return { ok: false, errors: ["stateObservation.evidenceSufficient must be a boolean"] };
  }
  if (typeof observation.multiDomainGap !== "boolean") {
    return { ok: false, errors: ["stateObservation.multiDomainGap must be a boolean"] };
  }
  return {
    ok: true,
    errors: [],
    evidenceSufficient: observation.evidenceSufficient,
    multiDomainGap: observation.multiDomainGap,
  };
}

/**
 * @param {unknown} input
 * @returns {{ ok: boolean, errors: string[], normalized: object|null }}
 */
export function validateBoundedReplanInput(input) {
  const errors = [];
  if (!isPlainObject(input)) {
    return { ok: false, errors: ["bounded replan input must be a plain object"], normalized: null };
  }
  if (!NON_EMPTY_STRING(input.planningDecisionId)) {
    errors.push("planningDecisionId must be a non-empty string");
  }
  if (input.question == null) {
    errors.push("question is required");
  }
  if (!Array.isArray(input.candidates) || input.candidates.length < 1) {
    errors.push("candidates must be a non-empty array");
  }
  const prevStateCheck = validateResearchPlannerStateV1(input.previousState);
  if (!prevStateCheck.ok) {
    errors.push(...prevStateCheck.errors.map((e) => `previousState: ${e}`));
  }
  if (!isNonNegativeInteger(input.openConflicts)) {
    errors.push("openConflicts must be an explicit non-negative integer");
  }
  const prevActionCheck = validatePreviousAction(input.previousAction);
  if (!prevActionCheck.ok) errors.push(...prevActionCheck.errors);

  if (!isPlainObject(input.feedback)) {
    errors.push("feedback must be a P5 feedback envelope (plain object)");
  } else {
    const kind = input.feedback.feedbackKind;
    const allowed = new Set(Object.values(EVIDENCE_FEEDBACK_KIND));
    if (!allowed.has(kind)) {
      errors.push("feedback.feedbackKind is missing or unknown");
    }
    if (kind === EVIDENCE_FEEDBACK_KIND.STATE_OBSERVATION) {
      const obs = validateObservation(input.feedback.stateObservation);
      if (!obs.ok) errors.push(...obs.errors);
    }
  }

  if (errors.length) {
    return { ok: false, errors, normalized: null };
  }

  const kind = input.feedback.feedbackKind;
  let nextEvidence = input.previousState.evidenceSufficient;
  let nextMulti = input.previousState.multiDomainGap;
  if (kind === EVIDENCE_FEEDBACK_KIND.STATE_OBSERVATION) {
    const obs = validateObservation(input.feedback.stateObservation);
    nextEvidence = obs.evidenceSufficient;
    nextMulti = obs.multiDomainGap;
  }

  const nextState = freezeState({
    evidenceSufficient: nextEvidence,
    multiDomainGap: nextMulti,
    openConflicts: input.openConflicts,
  });
  const nextCheck = validateResearchPlannerStateV1(nextState);
  if (!nextCheck.ok) {
    return {
      ok: false,
      errors: nextCheck.errors.map((e) => `nextState: ${e}`),
      normalized: null,
    };
  }

  return {
    ok: true,
    errors: [],
    normalized: {
      planningDecisionId: input.planningDecisionId,
      question: input.question,
      candidates: input.candidates,
      previousState: freezeState(input.previousState),
      previousAction: prevActionCheck.action,
      feedbackKind: kind,
      nextState,
    },
  };
}

function mapDisposition(plannerResult, previousAction, stateChanged, feedbackKind) {
  if (!plannerResult?.ok || plannerResult.decision == null) {
    return BOUNDED_REPLAN_DISPOSITION.REJECTED;
  }
  const status = plannerResult.decision.status;
  if (status === PLANNING_DECISION_STATUS.REFUSED) {
    return BOUNDED_REPLAN_DISPOSITION.STOP;
  }
  if (
    status === PLANNING_DECISION_STATUS.CONFLICT ||
    status === PLANNING_DECISION_STATUS.UNKNOWN
  ) {
    return BOUNDED_REPLAN_DISPOSITION.REJECTED;
  }
  if (status !== PLANNING_DECISION_STATUS.ACCEPTED) {
    return BOUNDED_REPLAN_DISPOSITION.REJECTED;
  }
  const selectedId = plannerResult.decision.researchActionId;
  if (!NON_EMPTY_STRING(selectedId)) {
    return BOUNDED_REPLAN_DISPOSITION.REJECTED;
  }
  if (previousAction?.researchActionId === selectedId) {
    return BOUNDED_REPLAN_DISPOSITION.NO_PROGRESS;
  }
  if (
    !stateChanged &&
    (feedbackKind === EVIDENCE_FEEDBACK_KIND.NON_MATERIAL ||
      feedbackKind === EVIDENCE_FEEDBACK_KIND.REJECTED)
  ) {
    return BOUNDED_REPLAN_DISPOSITION.NO_PROGRESS;
  }
  return BOUNDED_REPLAN_DISPOSITION.CONTINUE;
}

/**
 * Apply one bounded Adaptive Planner V1 re-evaluation.
 *
 * @param {object} input
 */
export function applyBoundedReplan(input) {
  const validated = validateBoundedReplanInput(input);
  if (!validated.ok) {
    return emptyResult({
      errors: validated.errors,
      previousState: isPlainObject(input?.previousState) ? input.previousState : null,
      previousAction: input?.previousAction ?? null,
      feedbackKind: input?.feedback?.feedbackKind ?? null,
      plannerInvocations: 0,
    });
  }

  const {
    planningDecisionId,
    question,
    candidates,
    previousState,
    previousAction,
    feedbackKind,
    nextState,
  } = validated.normalized;

  const stateChanged = !statesEqual(previousState, nextState);

  const plannerResult = planAdaptiveResearch({
    planningDecisionId,
    question,
    candidates,
    state: nextState,
  });

  const disposition = mapDisposition(plannerResult, previousAction, stateChanged, feedbackKind);
  const resultOk =
    disposition === BOUNDED_REPLAN_DISPOSITION.CONTINUE ||
    disposition === BOUNDED_REPLAN_DISPOSITION.STOP ||
    disposition === BOUNDED_REPLAN_DISPOSITION.NO_PROGRESS;

  return Object.freeze({
    ok: resultOk,
    errors: Object.freeze(
      plannerResult?.ok ? [] : [...(plannerResult?.errors ?? ["planner returned non-ok"])]
    ),
    disposition,
    previousState,
    stateUsed: nextState,
    stateChanged,
    previousAction,
    decision: plannerResult?.decision ?? null,
    plannerInvocations: 1,
    feedbackKind,
    ...BOUNDED_REPLAN_AUTHORITY,
  });
}

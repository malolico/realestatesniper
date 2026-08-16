/**
 * SP09-P3 — Adaptive Planner V1 (CB-13)
 *
 * Owns WHAT should be researched next and WHY.
 * Emits exactly one P1 PlanningDecision per current-state planning operation.
 *
 * Does NOT: execute Motor/Loop/Swarm, authorize execution, accept Evidence/Fact,
 * mutate state surfaces, perform bounded repeated planning, or call LLM.
 */

import {
  PLANNING_DECISION_STATUS,
  RESEARCH_ACTION_ROLE,
  buildPlanningDecision,
  validateResearchAction,
  validateResearchQuestion,
} from "./researchContracts.js";
import {
  CAPABILITY_NEED,
  CAPABILITY_RESOLUTION_STATUS,
  resolveCapabilityNeed,
  validateCapabilityNeedInput,
} from "./capabilitySemantics.js";

export const ADAPTIVE_PLANNER_PROGRAM = "SP09-P3";
export const ADAPTIVE_PLANNER_VERSION = "v1";

/** Immutable authority locks on every planner result. */
export const ADAPTIVE_PLANNER_AUTHORITY = Object.freeze({
  executionAuthorized: false,
  matchIsNotExecution: true,
  planningIsNotExecution: true,
  acceptedIsNotExecutionAuthorization: true,
  evidenceAuthority: "CB-06",
  isEvidence: false,
  isFact: false,
  resultIsNotEvidence: true,
  resultIsNotFact: true,
  hardPolicyOutranksPlanner: true,
});

const NON_EMPTY_STRING = (v) => typeof v === "string" && v.trim().length > 0;

/**
 * @param {unknown} state
 * @returns {{ ok: boolean, errors: string[] }}
 */
export function validateResearchPlannerStateV1(state) {
  const errors = [];
  if (state == null || typeof state !== "object" || Array.isArray(state)) {
    return { ok: false, errors: ["state must be a plain object"] };
  }
  if (typeof state.evidenceSufficient !== "boolean") {
    errors.push("state.evidenceSufficient must be a boolean");
  }
  if (typeof state.multiDomainGap !== "boolean") {
    errors.push("state.multiDomainGap must be a boolean");
  }
  if (
    typeof state.openConflicts !== "number" ||
    !Number.isInteger(state.openConflicts) ||
    state.openConflicts < 0
  ) {
    errors.push("state.openConflicts must be a non-negative integer");
  }
  const allowed = new Set(["evidenceSufficient", "multiDomainGap", "openConflicts"]);
  for (const key of Object.keys(state)) {
    if (!allowed.has(key)) {
      errors.push(`state field "${key}" is not part of ResearchPlannerStateV1`);
    }
  }
  return { ok: errors.length === 0, errors };
}

/**
 * Lexicographically least researchActionId among structurally valid candidates.
 * @param {{ action: { researchActionId: string } }[]} candidates
 */
export function nonSelectionReferenceActionId(candidates) {
  const ids = candidates.map((c) => c.action.researchActionId).sort((a, b) => (a < b ? -1 : a > b ? 1 : 0));
  return ids[0];
}

function sortCandidatesByActionId(candidates) {
  return [...candidates].sort((a, b) => {
    const x = a.action.researchActionId;
    const y = b.action.researchActionId;
    return x < y ? -1 : x > y ? 1 : 0;
  });
}

function nonSelectionRationale(why) {
  return [
    "no ResearchAction was ACCEPTED",
    "researchActionId is a non-selection contractual reference required by P1 PlanningDecision",
    "Planner does not authorize execution",
    why,
  ].join("; ");
}

function acceptedRationale(why, actionId, capabilityNeed) {
  return [
    `ACCEPTED ResearchAction ${actionId} as WHAT to research next`,
    `capabilityNeed=${capabilityNeed}`,
    why,
    "Planner does not authorize execution (executionAuthorized=false)",
  ].join("; ");
}

/**
 * Validate planner input envelope (structural). Fail closed — no decision.
 * @param {unknown} input
 * @returns {{ ok: boolean, errors: string[], normalized: object|null }}
 */
export function validateAdaptivePlannerInput(input) {
  const errors = [];
  if (input == null || typeof input !== "object" || Array.isArray(input)) {
    return { ok: false, errors: ["planner input must be a plain object"], normalized: null };
  }

  if (!NON_EMPTY_STRING(input.planningDecisionId)) {
    errors.push("planningDecisionId must be a non-empty string");
  } else if (input.planningDecisionId !== input.planningDecisionId.trim()) {
    errors.push("planningDecisionId must not have leading/trailing whitespace");
  }

  const q = validateResearchQuestion(input.question);
  if (!q.ok) errors.push(...q.errors.map((e) => `question: ${e}`));

  if (!Array.isArray(input.candidates) || input.candidates.length < 1) {
    errors.push("candidates must be a non-empty array");
  }

  const stateCheck = validateResearchPlannerStateV1(input.state);
  if (!stateCheck.ok) errors.push(...stateCheck.errors);

  if (errors.length || !Array.isArray(input.candidates)) {
    return { ok: false, errors, normalized: null };
  }

  const questionId = input.question.researchQuestionId;
  const normalizedCandidates = [];

  for (let i = 0; i < input.candidates.length; i++) {
    const envelope = input.candidates[i];
    if (envelope == null || typeof envelope !== "object" || Array.isArray(envelope)) {
      errors.push(`candidates[${i}] must be a plain object`);
      continue;
    }
    const a = validateResearchAction(envelope.action);
    if (!a.ok) {
      errors.push(...a.errors.map((e) => `candidates[${i}].action: ${e}`));
      continue;
    }
    if (envelope.action.role !== RESEARCH_ACTION_ROLE.CANDIDATE) {
      errors.push(`candidates[${i}].action.role must be CANDIDATE`);
    }
    if (envelope.action.researchQuestionId !== questionId) {
      errors.push(
        `candidates[${i}].action.researchQuestionId must equal question.researchQuestionId`
      );
    }
    const need = validateCapabilityNeedInput(envelope.capabilityNeed);
    if (!need.ok) {
      errors.push(...need.errors.map((e) => `candidates[${i}].capabilityNeed: ${e}`));
    }
    if (errors.some((e) => e.startsWith(`candidates[${i}]`))) {
      continue;
    }
    normalizedCandidates.push({
      action: envelope.action,
      capabilityNeed: envelope.capabilityNeed,
    });
  }

  if (errors.length) {
    return { ok: false, errors, normalized: null };
  }

  return {
    ok: true,
    errors: [],
    normalized: {
      planningDecisionId: input.planningDecisionId,
      question: input.question,
      candidates: normalizedCandidates,
      state: {
        evidenceSufficient: input.state.evidenceSufficient,
        multiDomainGap: input.state.multiDomainGap,
        openConflicts: input.state.openConflicts,
      },
    },
  };
}

/**
 * Resolve candidates via P2; attach resolution (does not mutate actions).
 * @param {{ action: object, capabilityNeed: string }[]} candidates
 */
function resolveCandidates(candidates) {
  return candidates.map((c) => {
    const r = resolveCapabilityNeed(c.capabilityNeed);
    return {
      action: c.action,
      capabilityNeed: c.capabilityNeed,
      resolution: r.ok ? r.resolution : null,
      resolutionOk: r.ok,
      matched:
        r.ok &&
        r.resolution?.status === CAPABILITY_RESOLUTION_STATUS.MATCHED,
    };
  });
}

function emitDecision(parts) {
  const decision = buildPlanningDecision({
    planningDecisionId: parts.planningDecisionId,
    researchQuestionId: parts.researchQuestionId,
    researchActionId: parts.researchActionId,
    factoryKey: parts.factoryKey,
    status: parts.status,
    rationale: parts.rationale,
  });
  return Object.freeze({
    ...decision,
    ...ADAPTIVE_PLANNER_AUTHORITY,
    plannerProgram: ADAPTIVE_PLANNER_PROGRAM,
    plannerVersion: ADAPTIVE_PLANNER_VERSION,
  });
}

/**
 * Adaptive Planner V1 — one current-state PlanningDecision.
 * @param {object} input
 * @returns {{ ok: boolean, errors: string[], decision: object|null }}
 */
export function planAdaptiveResearch(input) {
  const validated = validateAdaptivePlannerInput(input);
  if (!validated.ok) {
    return { ok: false, errors: validated.errors, decision: null };
  }

  const { planningDecisionId, question, candidates, state } = validated.normalized;
  const resolved = resolveCandidates(candidates);
  const refId = nonSelectionReferenceActionId(candidates);
  const factoryKey = question.factoryKey;
  const researchQuestionId = question.researchQuestionId;

  // 3. CONFLICT PRECEDENCE
  if (state.openConflicts >= 1) {
    return {
      ok: true,
      errors: [],
      decision: emitDecision({
        planningDecisionId,
        researchQuestionId,
        researchActionId: refId,
        factoryKey,
        status: PLANNING_DECISION_STATUS.CONFLICT,
        rationale: nonSelectionRationale(
          `conflict blocked research-action acceptance (openConflicts=${state.openConflicts})`
        ),
      }),
    };
  }

  // 4. MULTI-DOMAIN GAP
  if (state.multiDomainGap === true) {
    const matched = sortCandidatesByActionId(
      resolved.filter(
        (c) =>
          c.matched &&
          c.capabilityNeed === CAPABILITY_NEED.MULTI_DOMAIN_SUFFICIENCY
      )
    );
    if (matched.length > 0) {
      const pick = matched[0];
      return {
        ok: true,
        errors: [],
        decision: emitDecision({
          planningDecisionId,
          researchQuestionId,
          researchActionId: pick.action.researchActionId,
          factoryKey,
          status: PLANNING_DECISION_STATUS.ACCEPTED,
          rationale: acceptedRationale(
            "multi-domain gap triggered selection of multi-domain-sufficiency",
            pick.action.researchActionId,
            pick.capabilityNeed
          ),
        }),
      };
    }
    return {
      ok: true,
      errors: [],
      decision: emitDecision({
        planningDecisionId,
        researchQuestionId,
        researchActionId: refId,
        factoryKey,
        status: PLANNING_DECISION_STATUS.REFUSED,
        rationale: nonSelectionRationale(
          "multi-domain gap triggered but no MATCHED candidate with capabilityNeed=multi-domain-sufficiency; no unrelated capability substitution"
        ),
      }),
    };
  }

  // 5. EVIDENCE GAP
  if (state.evidenceSufficient === false) {
    const matched = sortCandidatesByActionId(
      resolved.filter(
        (c) =>
          c.matched &&
          c.capabilityNeed === CAPABILITY_NEED.EVIDENCE_SUFFICIENCY_GAP
      )
    );
    if (matched.length > 0) {
      const pick = matched[0];
      return {
        ok: true,
        errors: [],
        decision: emitDecision({
          planningDecisionId,
          researchQuestionId,
          researchActionId: pick.action.researchActionId,
          factoryKey,
          status: PLANNING_DECISION_STATUS.ACCEPTED,
          rationale: acceptedRationale(
            "evidence insufficiency triggered selection of evidence-sufficiency-gap",
            pick.action.researchActionId,
            pick.capabilityNeed
          ),
        }),
      };
    }
    return {
      ok: true,
      errors: [],
      decision: emitDecision({
        planningDecisionId,
        researchQuestionId,
        researchActionId: refId,
        factoryKey,
        status: PLANNING_DECISION_STATUS.REFUSED,
        rationale: nonSelectionRationale(
          "evidence gap triggered but no MATCHED candidate with capabilityNeed=evidence-sufficiency-gap; no unrelated capability substitution"
        ),
      }),
    };
  }

  // 6. NO RESEARCH TRIGGER
  return {
    ok: true,
    errors: [],
    decision: emitDecision({
      planningDecisionId,
      researchQuestionId,
      researchActionId: refId,
      factoryKey,
      status: PLANNING_DECISION_STATUS.REFUSED,
      rationale: nonSelectionRationale(
        "minimum V1 state demonstrates no current research trigger (evidenceSufficient=true, multiDomainGap=false, openConflicts=0)"
      ),
    }),
  };
}

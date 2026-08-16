/**
 * SP09-P1 — Research Contracts (CB-13)
 *
 * Contract language only. Does NOT implement Adaptive Research behavior,
 * capability resolution, planner algorithms, execution, or Evidence acceptance.
 *
 * Flow:
 *   Existing Expediente → ResearchQuestion → PlanningDecision → ResearchTask → ResearchOutcome
 *
 * ResearchAction = candidate / selected research action (contractual, not executable).
 *
 * Invariants:
 *   ONE EXPEDIENTE · ONE LINEAGE
 *   Planner owns WHAT / WHY · CB15 owns HOW TO EXECUTE
 *   HARD POLICY > PLANNER
 *   RESULT ≠ EVIDENCE ≠ FACT · CB06 sole Evidence authority
 *   UNKNOWN remains UNKNOWN · CONFLICT remains CONFLICT (fail-closed)
 *   Capability need may be referenced · MUST NOT resolve to Motor / Loop / Swarm
 */

export const RESEARCH_CONTRACT_PROGRAM = "SP09-P1";
export const RESEARCH_CONTRACT_VERSION = "v1";

export const RESEARCH_QUESTION_SCHEMA_ID = "rsn.cb13.research.question.v1";
export const RESEARCH_ACTION_SCHEMA_ID = "rsn.cb13.research.action.v1";
export const PLANNING_DECISION_SCHEMA_ID = "rsn.cb13.research.planningDecision.v1";
export const RESEARCH_TASK_SCHEMA_ID = "rsn.cb13.research.task.v1";
export const RESEARCH_OUTCOME_SCHEMA_ID = "rsn.cb13.research.outcome.v1";

/** Question lifecycle (contractual; not planner behavior). */
export const RESEARCH_QUESTION_STATUS = Object.freeze({
  OPEN: "OPEN",
  DECIDED: "DECIDED",
  CLOSED: "CLOSED",
  UNKNOWN: "UNKNOWN",
  CONFLICT: "CONFLICT",
});

/** Action role — candidate vs selected. Not an execution binding. */
export const RESEARCH_ACTION_ROLE = Object.freeze({
  CANDIDATE: "CANDIDATE",
  SELECTED: "SELECTED",
});

/** Planning decision posture (WHAT / WHY only). */
export const PLANNING_DECISION_STATUS = Object.freeze({
  ACCEPTED: "ACCEPTED",
  REFUSED: "REFUSED",
  UNKNOWN: "UNKNOWN",
  CONFLICT: "CONFLICT",
});

/** Task lifecycle — may name a semantic capability need; never resolves runtime. */
export const RESEARCH_TASK_STATUS = Object.freeze({
  PENDING: "PENDING",
  READY: "READY",
  BLOCKED: "BLOCKED",
  UNKNOWN: "UNKNOWN",
  CONFLICT: "CONFLICT",
});

/**
 * Outcome status. RESULT only — never Evidence or Fact authority.
 * UNKNOWN / CONFLICT preserved explicitly (fail-closed).
 */
export const RESEARCH_OUTCOME_STATUS = Object.freeze({
  PENDING: "PENDING",
  COMPLETE: "COMPLETE",
  FAILED: "FAILED",
  UNKNOWN: "UNKNOWN",
  CONFLICT: "CONFLICT",
});

/** Explicit non-authority markers on every ResearchOutcome. */
export const RESEARCH_OUTCOME_AUTHORITY = Object.freeze({
  evidenceAuthority: "CB-06",
  isEvidence: false,
  isFact: false,
  isTrustedEvidence: false,
  resultIsNotEvidence: true,
  resultIsNotFact: true,
});

/** Fields that would constitute forbidden capability resolution (SP09-P2+). */
export const FORBIDDEN_CAPABILITY_RESOLUTION_KEYS = Object.freeze([
  "motorId",
  "resolvedMotorId",
  "loopId",
  "resolvedLoopId",
  "swarmId",
  "resolvedSwarmId",
  "motorRuntime",
  "resolvedRuntime",
  "executionBinding",
  "orchestrationPlan",
]);

const NON_EMPTY_STRING = (v) => typeof v === "string" && v.trim().length > 0;

function pushError(errors, message) {
  errors.push(message);
}

function requireNonEmptyString(errors, value, field) {
  if (!NON_EMPTY_STRING(value)) {
    pushError(errors, `${field} must be a non-empty string`);
  }
}

function requireEnum(errors, value, field, allowed) {
  if (!Object.values(allowed).includes(value)) {
    pushError(
      errors,
      `${field} must be one of: ${Object.values(allowed).join(", ")} (got ${JSON.stringify(value)})`
    );
  }
}

function rejectCapabilityResolution(errors, obj, label) {
  if (obj == null || typeof obj !== "object") return;
  for (const key of FORBIDDEN_CAPABILITY_RESOLUTION_KEYS) {
    if (Object.prototype.hasOwnProperty.call(obj, key) && obj[key] != null) {
      pushError(
        errors,
        `${label}: capability resolution field "${key}" is forbidden in SP09-P1 (belongs to SP09-P2)`
      );
    }
  }
}

function rejectSecondLineageSurfaces(errors, obj, label) {
  if (obj == null || typeof obj !== "object") return;
  const forbidden = [
    "secondExpediente",
    "secondElr",
    "elrStore",
    "evidenceRegistry",
    "evidenceService",
    "motorRuntime",
    "orchestrationLayer",
    "parallelExpediente",
  ];
  for (const key of forbidden) {
    if (Object.prototype.hasOwnProperty.call(obj, key) && obj[key] != null) {
      pushError(
        errors,
        `${label}: parallel surface "${key}" is forbidden (ONE EXPEDIENTE / ONE LINEAGE)`
      );
    }
  }
}

/**
 * @param {object} input
 * @returns {{ ok: boolean, errors: string[] }}
 */
export function validateResearchQuestion(input) {
  const errors = [];
  if (input == null || typeof input !== "object" || Array.isArray(input)) {
    return { ok: false, errors: ["ResearchQuestion must be a plain object"] };
  }
  requireNonEmptyString(errors, input.researchQuestionId, "researchQuestionId");
  requireNonEmptyString(errors, input.factoryKey, "factoryKey");
  requireNonEmptyString(errors, input.question, "question");
  requireEnum(errors, input.status, "status", RESEARCH_QUESTION_STATUS);
  rejectSecondLineageSurfaces(errors, input, "ResearchQuestion");
  rejectCapabilityResolution(errors, input, "ResearchQuestion");
  return { ok: errors.length === 0, errors };
}

/**
 * @param {object} input
 * @returns {{ ok: boolean, errors: string[] }}
 */
export function validateResearchAction(input) {
  const errors = [];
  if (input == null || typeof input !== "object" || Array.isArray(input)) {
    return { ok: false, errors: ["ResearchAction must be a plain object"] };
  }
  requireNonEmptyString(errors, input.researchActionId, "researchActionId");
  requireNonEmptyString(errors, input.researchQuestionId, "researchQuestionId");
  requireEnum(errors, input.role, "role", RESEARCH_ACTION_ROLE);
  if (input.description != null && !NON_EMPTY_STRING(input.description)) {
    pushError(errors, "description must be a non-empty string when present");
  }
  rejectCapabilityResolution(errors, input, "ResearchAction");
  rejectSecondLineageSurfaces(errors, input, "ResearchAction");
  return { ok: errors.length === 0, errors };
}

/**
 * @param {object} input
 * @returns {{ ok: boolean, errors: string[] }}
 */
export function validatePlanningDecision(input) {
  const errors = [];
  if (input == null || typeof input !== "object" || Array.isArray(input)) {
    return { ok: false, errors: ["PlanningDecision must be a plain object"] };
  }
  requireNonEmptyString(errors, input.planningDecisionId, "planningDecisionId");
  requireNonEmptyString(errors, input.researchQuestionId, "researchQuestionId");
  requireNonEmptyString(errors, input.researchActionId, "researchActionId");
  requireNonEmptyString(errors, input.factoryKey, "factoryKey");
  requireEnum(errors, input.status, "status", PLANNING_DECISION_STATUS);
  if (input.rationale != null && typeof input.rationale !== "string") {
    pushError(errors, "rationale must be a string when present");
  }
  rejectCapabilityResolution(errors, input, "PlanningDecision");
  rejectSecondLineageSurfaces(errors, input, "PlanningDecision");
  return { ok: errors.length === 0, errors };
}

/**
 * Semantic capabilityNeed may be present. Must not resolve Motor/Loop/Swarm.
 * @param {object} input
 * @returns {{ ok: boolean, errors: string[] }}
 */
export function validateResearchTask(input) {
  const errors = [];
  if (input == null || typeof input !== "object" || Array.isArray(input)) {
    return { ok: false, errors: ["ResearchTask must be a plain object"] };
  }
  requireNonEmptyString(errors, input.researchTaskId, "researchTaskId");
  requireNonEmptyString(errors, input.planningDecisionId, "planningDecisionId");
  requireNonEmptyString(errors, input.researchActionId, "researchActionId");
  requireNonEmptyString(errors, input.factoryKey, "factoryKey");
  requireEnum(errors, input.status, "status", RESEARCH_TASK_STATUS);
  if (input.capabilityNeed != null && !NON_EMPTY_STRING(input.capabilityNeed)) {
    pushError(errors, "capabilityNeed must be a non-empty string when present");
  }
  rejectCapabilityResolution(errors, input, "ResearchTask");
  rejectSecondLineageSurfaces(errors, input, "ResearchTask");
  return { ok: errors.length === 0, errors };
}

/**
 * ResearchOutcome is RESULT only — never Evidence / Fact / trusted authority.
 * @param {object} input
 * @returns {{ ok: boolean, errors: string[] }}
 */
export function validateResearchOutcome(input) {
  const errors = [];
  if (input == null || typeof input !== "object" || Array.isArray(input)) {
    return { ok: false, errors: ["ResearchOutcome must be a plain object"] };
  }
  requireNonEmptyString(errors, input.researchOutcomeId, "researchOutcomeId");
  requireNonEmptyString(errors, input.researchTaskId, "researchTaskId");
  requireNonEmptyString(errors, input.factoryKey, "factoryKey");
  requireEnum(errors, input.status, "status", RESEARCH_OUTCOME_STATUS);

  if (input.isEvidence === true) {
    pushError(errors, "ResearchOutcome must not claim isEvidence=true (CB-06 sole Evidence authority)");
  }
  if (input.isFact === true) {
    pushError(errors, "ResearchOutcome must not claim isFact=true (RESULT ≠ FACT)");
  }
  if (input.isTrustedEvidence === true) {
    pushError(errors, "ResearchOutcome must not claim isTrustedEvidence=true");
  }
  if (
    input.evidenceAuthority != null &&
    input.evidenceAuthority !== RESEARCH_OUTCOME_AUTHORITY.evidenceAuthority
  ) {
    pushError(
      errors,
      `evidenceAuthority must remain "${RESEARCH_OUTCOME_AUTHORITY.evidenceAuthority}" or be omitted`
    );
  }

  rejectCapabilityResolution(errors, input, "ResearchOutcome");
  rejectSecondLineageSurfaces(errors, input, "ResearchOutcome");
  return { ok: errors.length === 0, errors };
}

/**
 * Validate full contractual chain for one Expediente lineage.
 * @param {{
 *   factoryKey: string,
 *   question: object,
 *   action: object,
 *   decision: object,
 *   task: object,
 *   outcome: object,
 * }} chain
 * @returns {{ ok: boolean, errors: string[] }}
 */
export function validateResearchContractChain(chain) {
  const errors = [];
  if (chain == null || typeof chain !== "object") {
    return { ok: false, errors: ["chain must be an object"] };
  }
  requireNonEmptyString(errors, chain.factoryKey, "factoryKey");
  if (errors.length) return { ok: false, errors };

  const q = validateResearchQuestion(chain.question);
  const a = validateResearchAction(chain.action);
  const d = validatePlanningDecision(chain.decision);
  const t = validateResearchTask(chain.task);
  const o = validateResearchOutcome(chain.outcome);
  errors.push(...q.errors, ...a.errors, ...d.errors, ...t.errors, ...o.errors);
  if (errors.length) return { ok: false, errors };

  const fk = chain.factoryKey;
  if (chain.question.factoryKey !== fk) {
    errors.push("ResearchQuestion.factoryKey must match chain.factoryKey (ONE EXPEDIENTE)");
  }
  if (chain.decision.factoryKey !== fk) {
    errors.push("PlanningDecision.factoryKey must match chain.factoryKey (ONE EXPEDIENTE)");
  }
  if (chain.task.factoryKey !== fk) {
    errors.push("ResearchTask.factoryKey must match chain.factoryKey (ONE EXPEDIENTE)");
  }
  if (chain.outcome.factoryKey !== fk) {
    errors.push("ResearchOutcome.factoryKey must match chain.factoryKey (ONE EXPEDIENTE)");
  }

  if (chain.action.researchQuestionId !== chain.question.researchQuestionId) {
    errors.push("ResearchAction.researchQuestionId must reference ResearchQuestion");
  }
  if (chain.decision.researchQuestionId !== chain.question.researchQuestionId) {
    errors.push("PlanningDecision.researchQuestionId must reference ResearchQuestion");
  }
  if (chain.decision.researchActionId !== chain.action.researchActionId) {
    errors.push("PlanningDecision.researchActionId must reference ResearchAction");
  }
  if (chain.task.planningDecisionId !== chain.decision.planningDecisionId) {
    errors.push("ResearchTask.planningDecisionId must reference PlanningDecision");
  }
  if (chain.task.researchActionId !== chain.action.researchActionId) {
    errors.push("ResearchTask.researchActionId must reference ResearchAction");
  }
  if (chain.outcome.researchTaskId !== chain.task.researchTaskId) {
    errors.push("ResearchOutcome.researchTaskId must reference ResearchTask");
  }

  return { ok: errors.length === 0, errors };
}

export function assertResearchQuestion(input) {
  const r = validateResearchQuestion(input);
  if (!r.ok) throw new Error(`ResearchQuestion invalid: ${r.errors.join("; ")}`);
  return input;
}

export function assertResearchAction(input) {
  const r = validateResearchAction(input);
  if (!r.ok) throw new Error(`ResearchAction invalid: ${r.errors.join("; ")}`);
  return input;
}

export function assertPlanningDecision(input) {
  const r = validatePlanningDecision(input);
  if (!r.ok) throw new Error(`PlanningDecision invalid: ${r.errors.join("; ")}`);
  return input;
}

export function assertResearchTask(input) {
  const r = validateResearchTask(input);
  if (!r.ok) throw new Error(`ResearchTask invalid: ${r.errors.join("; ")}`);
  return input;
}

export function assertResearchOutcome(input) {
  const r = validateResearchOutcome(input);
  if (!r.ok) throw new Error(`ResearchOutcome invalid: ${r.errors.join("; ")}`);
  return input;
}

export function assertResearchContractChain(chain) {
  const r = validateResearchContractChain(chain);
  if (!r.ok) throw new Error(`Research contract chain invalid: ${r.errors.join("; ")}`);
  return chain;
}

/**
 * Build frozen minimal ResearchQuestion.
 */
export function buildResearchQuestion(parts) {
  const obj = Object.freeze({
    schemaId: RESEARCH_QUESTION_SCHEMA_ID,
    version: RESEARCH_CONTRACT_VERSION,
    program: RESEARCH_CONTRACT_PROGRAM,
    researchQuestionId: parts.researchQuestionId,
    factoryKey: parts.factoryKey,
    question: parts.question,
    status: parts.status ?? RESEARCH_QUESTION_STATUS.OPEN,
  });
  assertResearchQuestion(obj);
  return obj;
}

/**
 * Build frozen minimal ResearchAction.
 */
export function buildResearchAction(parts) {
  const obj = Object.freeze({
    schemaId: RESEARCH_ACTION_SCHEMA_ID,
    version: RESEARCH_CONTRACT_VERSION,
    program: RESEARCH_CONTRACT_PROGRAM,
    researchActionId: parts.researchActionId,
    researchQuestionId: parts.researchQuestionId,
    role: parts.role ?? RESEARCH_ACTION_ROLE.CANDIDATE,
    ...(parts.description != null ? { description: parts.description } : {}),
  });
  assertResearchAction(obj);
  return obj;
}

/**
 * Build frozen minimal PlanningDecision (WHAT / WHY).
 */
export function buildPlanningDecision(parts) {
  const obj = Object.freeze({
    schemaId: PLANNING_DECISION_SCHEMA_ID,
    version: RESEARCH_CONTRACT_VERSION,
    program: RESEARCH_CONTRACT_PROGRAM,
    planningDecisionId: parts.planningDecisionId,
    researchQuestionId: parts.researchQuestionId,
    researchActionId: parts.researchActionId,
    factoryKey: parts.factoryKey,
    status: parts.status ?? PLANNING_DECISION_STATUS.ACCEPTED,
    ...(parts.rationale != null ? { rationale: parts.rationale } : {}),
  });
  assertPlanningDecision(obj);
  return obj;
}

/**
 * Build frozen minimal ResearchTask.
 * capabilityNeed is semantic only — never resolved here.
 */
export function buildResearchTask(parts) {
  const obj = Object.freeze({
    schemaId: RESEARCH_TASK_SCHEMA_ID,
    version: RESEARCH_CONTRACT_VERSION,
    program: RESEARCH_CONTRACT_PROGRAM,
    researchTaskId: parts.researchTaskId,
    planningDecisionId: parts.planningDecisionId,
    researchActionId: parts.researchActionId,
    factoryKey: parts.factoryKey,
    status: parts.status ?? RESEARCH_TASK_STATUS.PENDING,
    ...(parts.capabilityNeed != null ? { capabilityNeed: parts.capabilityNeed } : {}),
  });
  assertResearchTask(obj);
  return obj;
}

/**
 * Build frozen minimal ResearchOutcome (RESULT ≠ Evidence ≠ Fact).
 */
export function buildResearchOutcome(parts) {
  const obj = Object.freeze({
    schemaId: RESEARCH_OUTCOME_SCHEMA_ID,
    version: RESEARCH_CONTRACT_VERSION,
    program: RESEARCH_CONTRACT_PROGRAM,
    researchOutcomeId: parts.researchOutcomeId,
    researchTaskId: parts.researchTaskId,
    factoryKey: parts.factoryKey,
    status: parts.status ?? RESEARCH_OUTCOME_STATUS.PENDING,
    ...RESEARCH_OUTCOME_AUTHORITY,
  });
  assertResearchOutcome(obj);
  return obj;
}

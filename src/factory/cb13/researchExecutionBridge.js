/**
 * SP09-P4 — Research Execution Bridge (CB-13)
 *
 * Bounded interface adaptation only:
 *   ACCEPTED PlanningDecision + ResearchAction + capabilityNeed
 *   → P1 ResearchTask → P2 resolveCapabilityNeed (MATCHED)
 *   → injected family execution API → P1 ResearchOutcome
 *
 * Does NOT: authorize execution, absorb CB04/CB11/CB12/CB15 semantics,
 * accept Evidence/Fact (CB06), re-plan (P6), or mutate CB13 state (P5).
 */

import {
  FORBIDDEN_CAPABILITY_RESOLUTION_KEYS,
  PLANNING_DECISION_STATUS,
  RESEARCH_OUTCOME_STATUS,
  RESEARCH_TASK_STATUS,
  buildResearchOutcome,
  buildResearchTask,
  validatePlanningDecision,
  validateResearchAction,
} from "./researchContracts.js";
import {
  CAPABILITY_FAMILY,
  CAPABILITY_RESOLUTION_STATUS,
  resolveCapabilityNeed,
  validateCapabilityNeedInput,
} from "./capabilitySemantics.js";

export const RESEARCH_EXECUTION_BRIDGE_PROGRAM = "SP09-P4";
export const RESEARCH_EXECUTION_BRIDGE_VERSION = "v1";

/** Immutable authority locks on every bridge result. */
export const RESEARCH_EXECUTION_BRIDGE_AUTHORITY = Object.freeze({
  matchIsNotExecution: true,
  acceptedIsNotExecutionAuthorization: true,
  bridgeDoesNotGrantExecutionAuthorization: true,
  evidenceAuthority: "CB-06",
  isEvidence: false,
  isFact: false,
  resultIsNotEvidence: true,
  resultIsNotFact: true,
  hardPolicyOutranksPlanner: true,
});

const NON_EMPTY_STRING = (v) => typeof v === "string" && v.trim().length > 0;

function isPlainObject(v) {
  return v != null && typeof v === "object" && !Array.isArray(v);
}

function emptyResult(overrides = {}) {
  const {
    errors: overrideErrors,
    ok: overrideOk,
    executed: overrideExecuted,
    ...rest
  } = overrides;
  return Object.freeze({
    ok: overrideOk === true,
    executed: overrideExecuted === true,
    family: null,
    capabilityRef: null,
    task: null,
    outcome: null,
    dispatch: null,
    runtimeResult: null,
    ...RESEARCH_EXECUTION_BRIDGE_AUTHORITY,
    ...rest,
    errors: Object.freeze([...(overrideErrors ?? [])]),
  });
}

/**
 * Corrected P4 DispatchArtifact — no executionAuthorized field.
 * @param {{
 *   researchTaskId: string,
 *   planningDecisionId: string,
 *   researchActionId: string,
 *   factoryKey: string,
 *   capabilityNeed: string,
 *   family: string,
 *   capabilityRef: string,
 *   executionRequested: boolean,
 * }} parts
 */
export function buildDispatchArtifact(parts) {
  return Object.freeze({
    researchTaskId: parts.researchTaskId,
    planningDecisionId: parts.planningDecisionId,
    researchActionId: parts.researchActionId,
    factoryKey: parts.factoryKey,
    capabilityNeed: parts.capabilityNeed,
    family: parts.family,
    capabilityRef: parts.capabilityRef,
    executionRequested: parts.executionRequested === true,
  });
}

/**
 * @param {unknown} artifact
 * @returns {{ ok: boolean, errors: string[] }}
 */
export function validateDispatchArtifact(artifact) {
  const errors = [];
  if (!isPlainObject(artifact)) {
    return { ok: false, errors: ["DispatchArtifact must be a plain object"] };
  }
  for (const field of [
    "researchTaskId",
    "planningDecisionId",
    "researchActionId",
    "factoryKey",
    "capabilityNeed",
    "family",
    "capabilityRef",
  ]) {
    if (!NON_EMPTY_STRING(artifact[field])) {
      errors.push(`${field} must be a non-empty string`);
    }
  }
  if (typeof artifact.executionRequested !== "boolean") {
    errors.push("executionRequested must be a boolean");
  }
  if (Object.prototype.hasOwnProperty.call(artifact, "executionAuthorized")) {
    errors.push("DispatchArtifact must not include executionAuthorized");
  }
  return { ok: errors.length === 0, errors };
}

/**
 * MOTOR COMPLETE only when kind === MOTOR_RUN_MANIFEST AND status === SUCCESS.
 * @returns {"COMPLETE"|"FAILED"|"UNKNOWN"}
 */
export function normalizeMotorRuntimeResult(result, threw) {
  if (threw) return RESEARCH_OUTCOME_STATUS.FAILED;
  if (result == null || typeof result !== "object" || Array.isArray(result)) {
    return RESEARCH_OUTCOME_STATUS.UNKNOWN;
  }
  if (result.kind !== "MOTOR_RUN_MANIFEST") {
    return RESEARCH_OUTCOME_STATUS.UNKNOWN;
  }
  if (result.status !== "SUCCESS") {
    return RESEARCH_OUTCOME_STATUS.UNKNOWN;
  }
  return RESEARCH_OUTCOME_STATUS.COMPLETE;
}

/**
 * LOOP COMPLETE only when identified loopId matches and blocked !== true.
 * @returns {"COMPLETE"|"FAILED"|"UNKNOWN"}
 */
export function normalizeLoopRuntimeResult(result, capabilityRef, threw) {
  if (threw) return RESEARCH_OUTCOME_STATUS.FAILED;
  if (result == null || typeof result !== "object" || Array.isArray(result)) {
    return RESEARCH_OUTCOME_STATUS.UNKNOWN;
  }
  if (!NON_EMPTY_STRING(result.loopId)) {
    return RESEARCH_OUTCOME_STATUS.UNKNOWN;
  }
  if (result.loopId !== capabilityRef) {
    return RESEARCH_OUTCOME_STATUS.UNKNOWN;
  }
  if (result.blocked === true) {
    return RESEARCH_OUTCOME_STATUS.FAILED;
  }
  return RESEARCH_OUTCOME_STATUS.COMPLETE;
}

/**
 * SWARM: accepted === true → COMPLETE; accepted === false → FAILED.
 * @returns {"COMPLETE"|"FAILED"|"UNKNOWN"}
 */
export function normalizeSwarmRuntimeResult(result, threw) {
  if (threw) return RESEARCH_OUTCOME_STATUS.FAILED;
  if (result == null || typeof result !== "object" || Array.isArray(result)) {
    return RESEARCH_OUTCOME_STATUS.UNKNOWN;
  }
  if (result.accepted === true) return RESEARCH_OUTCOME_STATUS.COMPLETE;
  if (result.accepted === false) return RESEARCH_OUTCOME_STATUS.FAILED;
  return RESEARCH_OUTCOME_STATUS.UNKNOWN;
}

/**
 * Normalize optional swarmMandate: omit/undefined → {}; null invalid; else plain object.
 * @param {unknown} swarmMandate
 * @param {boolean} mandateProvided — true when key was present on input envelope
 * @returns {{ ok: boolean, errors: string[], mandate: object|null }}
 */
export function normalizeSwarmMandate(swarmMandate, mandateProvided) {
  if (!mandateProvided || swarmMandate === undefined) {
    return { ok: true, errors: [], mandate: {} };
  }
  if (swarmMandate === null) {
    return { ok: false, errors: ["swarmMandate must not be null"], mandate: null };
  }
  if (!isPlainObject(swarmMandate)) {
    return { ok: false, errors: ["swarmMandate must be a plain object when supplied"], mandate: null };
  }
  return { ok: true, errors: [], mandate: swarmMandate };
}

/**
 * Minimum loopCtx shape for safe call of injected loopRunner (LOOP-XVR-EVD-01).
 * @param {unknown} loopCtx
 * @returns {{ ok: boolean, errors: string[] }}
 */
export function validateLoopCtx(loopCtx) {
  const errors = [];
  if (!isPlainObject(loopCtx)) {
    return { ok: false, errors: ["loopCtx must be a plain object"] };
  }
  if (!isPlainObject(loopCtx.snapshot)) {
    errors.push("loopCtx.snapshot must be a plain object");
  } else {
    if (
      loopCtx.snapshot.evidenceSufficient != null &&
      typeof loopCtx.snapshot.evidenceSufficient !== "boolean"
    ) {
      errors.push("loopCtx.snapshot.evidenceSufficient must be a boolean when present");
    }
    if (
      loopCtx.snapshot.multiDomainConflict != null &&
      typeof loopCtx.snapshot.multiDomainConflict !== "boolean"
    ) {
      errors.push("loopCtx.snapshot.multiDomainConflict must be a boolean when present");
    }
  }
  if (loopCtx.signals != null && !isPlainObject(loopCtx.signals)) {
    errors.push("loopCtx.signals must be a plain object when present");
  }
  return { ok: errors.length === 0, errors };
}

/**
 * @param {unknown} motorOptions
 * @returns {{ ok: boolean, errors: string[], options: object }}
 */
function validateMotorOptions(motorOptions) {
  if (motorOptions === undefined) {
    return { ok: true, errors: [], options: {} };
  }
  if (!isPlainObject(motorOptions)) {
    return { ok: false, errors: ["motorOptions must be a plain object when supplied"], options: {} };
  }
  const allowed = new Set(["inputs", "invoker", "useStub"]);
  for (const key of Object.keys(motorOptions)) {
    if (!allowed.has(key)) {
      return {
        ok: false,
        errors: [`motorOptions field "${key}" is not an accepted MotorRuntime option`],
        options: {},
      };
    }
  }
  if (motorOptions.inputs != null && !isPlainObject(motorOptions.inputs)) {
    return { ok: false, errors: ["motorOptions.inputs must be a plain object when present"], options: {} };
  }
  if (motorOptions.invoker != null && !NON_EMPTY_STRING(motorOptions.invoker)) {
    return { ok: false, errors: ["motorOptions.invoker must be a non-empty string when present"], options: {} };
  }
  if (motorOptions.useStub != null && typeof motorOptions.useStub !== "boolean") {
    return { ok: false, errors: ["motorOptions.useStub must be a boolean when present"], options: {} };
  }
  return { ok: true, errors: [], options: motorOptions };
}

/**
 * @param {unknown} input
 * @returns {{ ok: boolean, errors: string[] }}
 */
export function validateResearchExecutionBridgeInput(input) {
  const errors = [];
  if (!isPlainObject(input)) {
    return { ok: false, errors: ["bridge input must be a plain object"] };
  }
  if (!NON_EMPTY_STRING(input.planningDecisionId)) {
    errors.push("planningDecisionId must be a non-empty string");
  }
  if (!NON_EMPTY_STRING(input.researchTaskId)) {
    errors.push("researchTaskId must be a non-empty string");
  }
  if (!NON_EMPTY_STRING(input.researchOutcomeId)) {
    errors.push("researchOutcomeId must be a non-empty string");
  }

  const decisionCheck = validatePlanningDecision(input.decision);
  if (!decisionCheck.ok) {
    errors.push(...decisionCheck.errors.map((e) => `decision: ${e}`));
  } else if (
    NON_EMPTY_STRING(input.planningDecisionId) &&
    input.planningDecisionId !== input.decision.planningDecisionId
  ) {
    errors.push("planningDecisionId must equal decision.planningDecisionId");
  }

  const actionCheck = validateResearchAction(input.action);
  if (!actionCheck.ok) {
    errors.push(...actionCheck.errors.map((e) => `action: ${e}`));
  } else if (decisionCheck.ok) {
    if (input.action.researchActionId !== input.decision.researchActionId) {
      errors.push("action.researchActionId must equal decision.researchActionId");
    }
    if (input.action.researchQuestionId !== input.decision.researchQuestionId) {
      errors.push("action.researchQuestionId must equal decision.researchQuestionId");
    }
  }

  const needCheck = validateCapabilityNeedInput(input.capabilityNeed);
  if (!needCheck.ok) {
    errors.push(...needCheck.errors);
  }

  return { ok: errors.length === 0, errors };
}

function safeOutcome(parts) {
  try {
    return buildResearchOutcome(parts);
  } catch {
    return null;
  }
}

/**
 * Execute the P4 research execution bridge (interface adaptation only).
 *
 * @param {object} input
 * @returns {Promise<object>}
 */
export async function executeResearchBridge(input) {
  const inputCheck = validateResearchExecutionBridgeInput(input);
  if (!inputCheck.ok) {
    return emptyResult({ errors: inputCheck.errors });
  }

  const {
    planningDecisionId,
    decision,
    action,
    capabilityNeed,
    researchTaskId,
    researchOutcomeId,
  } = input;

  if (decision.status !== PLANNING_DECISION_STATUS.ACCEPTED) {
    return emptyResult({
      errors: [
        `decision.status must be ACCEPTED before dispatch (got ${JSON.stringify(decision.status)})`,
      ],
    });
  }

  // factoryKey comes only from decision — never overridden by caller envelope.
  const factoryKey = decision.factoryKey;

  let task;
  try {
    task = buildResearchTask({
      researchTaskId,
      planningDecisionId: decision.planningDecisionId,
      researchActionId: decision.researchActionId,
      factoryKey,
      capabilityNeed,
      status: RESEARCH_TASK_STATUS.READY,
    });
  } catch (e) {
    return emptyResult({
      errors: [`ResearchTask build failed: ${String(e.message ?? e)}`],
    });
  }

  // Guard: task must not carry forbidden resolution keys / capabilityRef.
  for (const key of FORBIDDEN_CAPABILITY_RESOLUTION_KEYS) {
    if (Object.prototype.hasOwnProperty.call(task, key) && task[key] != null) {
      return emptyResult({
        errors: [`ResearchTask must not contain forbidden key "${key}"`],
        task,
      });
    }
  }
  if (Object.prototype.hasOwnProperty.call(task, "capabilityRef")) {
    return emptyResult({
      errors: ["ResearchTask must not contain capabilityRef"],
      task,
    });
  }

  const resolutionResult = resolveCapabilityNeed(capabilityNeed);
  if (!resolutionResult.ok || !resolutionResult.resolution) {
    return emptyResult({
      errors: resolutionResult.errors?.length
        ? resolutionResult.errors
        : ["capabilityNeed resolution failed"],
      task,
    });
  }

  const resolution = resolutionResult.resolution;
  if (resolution.status !== CAPABILITY_RESOLUTION_STATUS.MATCHED) {
    return emptyResult({
      errors: ["capabilityNeed resolution is UNRESOLVED — fail closed, no family dispatch"],
      task,
    });
  }

  // Do not mutate P2 resolution; do not reinterpret executionAuthorized=false.
  const family = resolution.family;
  const capabilityRef = resolution.capabilityRef;
  if (!NON_EMPTY_STRING(capabilityRef)) {
    return emptyResult({
      errors: ["MATCHED resolution missing capabilityRef"],
      task,
      family,
    });
  }
  if (!Object.values(CAPABILITY_FAMILY).includes(family)) {
    return emptyResult({
      errors: [`unsupported family ${JSON.stringify(family)}`],
      task,
    });
  }

  // Family-specific dependency / context validation (pre-dispatch).
  let motorOptions = {};
  let loopCtx = null;
  let swarmMandate = {};
  const mandateProvided = isPlainObject(input) && Object.prototype.hasOwnProperty.call(input, "swarmMandate");

  if (family === CAPABILITY_FAMILY.MOTOR) {
    if (input.motorRuntime == null || typeof input.motorRuntime.execute !== "function") {
      return emptyResult({
        errors: ["motorRuntime with execute() is required for MOTOR family"],
        task,
        family,
        capabilityRef,
      });
    }
    const optCheck = validateMotorOptions(input.motorOptions);
    if (!optCheck.ok) {
      return emptyResult({
        errors: optCheck.errors,
        task,
        family,
        capabilityRef,
      });
    }
    motorOptions = optCheck.options;
  } else if (family === CAPABILITY_FAMILY.LOOP) {
    if (typeof input.loopRunner !== "function") {
      return emptyResult({
        errors: ["loopRunner is required for LOOP family"],
        task,
        family,
        capabilityRef,
      });
    }
    const ctxCheck = validateLoopCtx(input.loopCtx);
    if (!ctxCheck.ok) {
      return emptyResult({
        errors: ctxCheck.errors,
        task,
        family,
        capabilityRef,
      });
    }
    loopCtx = input.loopCtx;
  } else if (family === CAPABILITY_FAMILY.SWARM) {
    if (
      input.swarmCoordinator == null ||
      typeof input.swarmCoordinator.executeSwarmMission !== "function"
    ) {
      return emptyResult({
        errors: ["swarmCoordinator with executeSwarmMission() is required for SWARM family"],
        task,
        family,
        capabilityRef,
      });
    }
    const mandateCheck = normalizeSwarmMandate(input.swarmMandate, mandateProvided);
    if (!mandateCheck.ok) {
      return emptyResult({
        errors: mandateCheck.errors,
        task,
        family,
        capabilityRef,
      });
    }
    swarmMandate = mandateCheck.mandate;
  } else {
    return emptyResult({
      errors: [`unsupported family ${JSON.stringify(family)}`],
      task,
    });
  }

  const dispatch = buildDispatchArtifact({
    researchTaskId: task.researchTaskId,
    planningDecisionId: decision.planningDecisionId,
    researchActionId: decision.researchActionId,
    factoryKey,
    capabilityNeed,
    family,
    capabilityRef,
    executionRequested: true,
  });

  let runtimeResult = null;
  let threw = false;
  let executed = false;

  try {
    if (family === CAPABILITY_FAMILY.MOTOR) {
      executed = true;
      runtimeResult = await input.motorRuntime.execute(factoryKey, capabilityRef, motorOptions);
    } else if (family === CAPABILITY_FAMILY.LOOP) {
      executed = true;
      runtimeResult = await input.loopRunner(capabilityRef, loopCtx);
    } else if (family === CAPABILITY_FAMILY.SWARM) {
      executed = true;
      runtimeResult = await input.swarmCoordinator.executeSwarmMission(
        factoryKey,
        capabilityRef,
        swarmMandate
      );
    }
  } catch (e) {
    threw = true;
    runtimeResult = { __bridgeThrown: true, message: String(e?.message ?? e) };
  }

  let outcomeStatus;
  if (family === CAPABILITY_FAMILY.MOTOR) {
    outcomeStatus = normalizeMotorRuntimeResult(threw ? null : runtimeResult, threw);
  } else if (family === CAPABILITY_FAMILY.LOOP) {
    outcomeStatus = normalizeLoopRuntimeResult(threw ? null : runtimeResult, capabilityRef, threw);
  } else {
    outcomeStatus = normalizeSwarmRuntimeResult(threw ? null : runtimeResult, threw);
  }

  const outcome = safeOutcome({
    researchOutcomeId,
    researchTaskId: task.researchTaskId,
    factoryKey,
    status: outcomeStatus,
  });

  return Object.freeze({
    ok: outcome != null,
    errors: Object.freeze(outcome == null ? ["ResearchOutcome could not be constructed"] : []),
    executed,
    family,
    capabilityRef,
    task,
    outcome,
    dispatch,
    runtimeResult: threw ? runtimeResult : runtimeResult,
    ...RESEARCH_EXECUTION_BRIDGE_AUTHORITY,
  });
}

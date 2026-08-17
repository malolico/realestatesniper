/**
 * SP09-P5 — Evidence Feedback (CB-13)
 *
 * Bounded composition only:
 *   P4 executeResearchBridge envelope
 *   → MOTOR material + caller SourceRefs → existing MotEvd01
 *   → LOOP COMPLETE/unblocked → output-only stateObservation
 *   → SWARM → explicit non-material / no Evidence
 *
 * Does NOT: mint Evidence from Outcome, fabricate MOTOR_RUN_MANIFEST,
 * manufacture SourceRefs, mutate CB13 knowledge/ELR/ST-*, re-plan (P6),
 * or promote Fact.
 */

import { isSourceRef } from "../cb02/sourceRef.js";
import { isMaterialMotorManifest } from "../cb06/evidenceIntercept.js";
import { evaluateSufficiency } from "../cb06/sufficiencyGate.js";
import {
  RESEARCH_OUTCOME_STATUS,
  validateResearchOutcome,
} from "./researchContracts.js";
import { CAPABILITY_FAMILY } from "./capabilitySemantics.js";

export const EVIDENCE_FEEDBACK_PROGRAM = "SP09-P5";
export const EVIDENCE_FEEDBACK_VERSION = "v1";

export const EVIDENCE_FEEDBACK_KIND = Object.freeze({
  EVIDENCE_REGISTERED: "EVIDENCE_REGISTERED",
  NON_MATERIAL: "NON_MATERIAL",
  STATE_OBSERVATION: "STATE_OBSERVATION",
  REJECTED: "REJECTED",
});

/** Immutable authority locks on every P5 result. */
export const EVIDENCE_FEEDBACK_AUTHORITY = Object.freeze({
  evidenceAuthority: "CB-06",
  isEvidence: false,
  isFact: false,
  resultIsNotEvidence: true,
  resultIsNotFact: true,
  completeIsNotEvidence: true,
  failedIsNotFalseEvidence: true,
  matchIsNotExecution: true,
  acceptedIsNotExecutionAuthorization: true,
  bridgeDoesNotGrantExecutionAuthorization: true,
  feedbackIsNotReplan: true,
  feedbackIsNotPlannerStateV1: true,
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
    evidenceMinted: overrideMinted,
    feedbackKind: overrideKind,
    ...rest
  } = overrides;
  return Object.freeze({
    ok: overrideOk === true,
    evidenceMinted: overrideMinted === true,
    family: null,
    capabilityRef: null,
    outcome: null,
    registration: null,
    evidenceRefs: Object.freeze([]),
    sufficiency: null,
    stateObservation: null,
    ...EVIDENCE_FEEDBACK_AUTHORITY,
    ...rest,
    errors: Object.freeze([...(overrideErrors ?? [])]),
    feedbackKind: overrideKind ?? rest.feedbackKind ?? EVIDENCE_FEEDBACK_KIND.REJECTED,
  });
}

/**
 * @param {unknown} input
 * @returns {{ ok: boolean, errors: string[] }}
 */
export function validateEvidenceFeedbackInput(input) {
  const errors = [];
  if (!isPlainObject(input)) {
    return { ok: false, errors: ["evidence feedback input must be a plain object"] };
  }
  if (!isPlainObject(input.bridgeResult)) {
    errors.push("bridgeResult must be the P4 executeResearchBridge envelope (plain object)");
  }
  return { ok: errors.length === 0, errors };
}

function lineageFactoryKey(bridgeResult) {
  const outcomeKey = bridgeResult.outcome?.factoryKey;
  const taskKey = bridgeResult.task?.factoryKey;
  const dispatchKey = bridgeResult.dispatch?.factoryKey;
  const runtimeKey = bridgeResult.runtimeResult?.factoryKey;
  if (!NON_EMPTY_STRING(outcomeKey)) return { ok: false, factoryKey: null, errors: ["outcome.factoryKey is required"] };
  const errors = [];
  if (NON_EMPTY_STRING(taskKey) && taskKey !== outcomeKey) {
    errors.push("task.factoryKey must equal outcome.factoryKey");
  }
  if (NON_EMPTY_STRING(dispatchKey) && dispatchKey !== outcomeKey) {
    errors.push("dispatch.factoryKey must equal outcome.factoryKey");
  }
  if (runtimeKey != null && runtimeKey !== outcomeKey) {
    errors.push("runtimeResult.factoryKey must equal outcome.factoryKey");
  }
  return { ok: errors.length === 0, factoryKey: outcomeKey, errors };
}

function reject(bridgeResult, errors, extra = {}) {
  return emptyResult({
    errors,
    family: bridgeResult?.family ?? null,
    capabilityRef: bridgeResult?.capabilityRef ?? null,
    outcome: bridgeResult?.outcome ?? null,
    feedbackKind: EVIDENCE_FEEDBACK_KIND.REJECTED,
    ...extra,
  });
}

function nonMaterial(bridgeResult, errors = []) {
  return emptyResult({
    ok: true,
    errors,
    family: bridgeResult?.family ?? null,
    capabilityRef: bridgeResult?.capabilityRef ?? null,
    outcome: bridgeResult?.outcome ?? null,
    feedbackKind: EVIDENCE_FEEDBACK_KIND.NON_MATERIAL,
  });
}

function validSourceRefs(sourceRefs) {
  if (!Array.isArray(sourceRefs) || sourceRefs.length === 0) {
    return { ok: false, errors: ["sourceRefs must be a non-empty array of CB-02 SourceRefs for MOTOR Evidence registration"] };
  }
  const errors = [];
  sourceRefs.forEach((ref, i) => {
    if (!isSourceRef(ref)) {
      errors.push(`sourceRefs[${i}] is not a valid CB-02 SourceRef`);
    }
  });
  return { ok: errors.length === 0, errors };
}

function applyMotorFeedback(bridgeResult, motEvd01, sourceRefs) {
  const outcome = bridgeResult.outcome;
  const runtimeResult = bridgeResult.runtimeResult;

  if (bridgeResult.executed !== true) {
    return reject(bridgeResult, ["MOTOR Evidence registration requires executed=true"]);
  }
  if (!outcome) {
    return reject(bridgeResult, ["MOTOR Evidence registration requires a P1 ResearchOutcome"]);
  }
  const outcomeCheck = validateResearchOutcome(outcome);
  if (!outcomeCheck.ok) {
    return reject(bridgeResult, outcomeCheck.errors.map((e) => `outcome: ${e}`));
  }
  if (
    outcome.status === RESEARCH_OUTCOME_STATUS.CONFLICT ||
    outcome.status === RESEARCH_OUTCOME_STATUS.UNKNOWN
  ) {
    return reject(bridgeResult, [
      `outcome.status ${outcome.status} is fail-closed — zero Evidence mint`,
    ]);
  }
  if (outcome.status !== RESEARCH_OUTCOME_STATUS.COMPLETE) {
    return reject(bridgeResult, [
      `MOTOR Evidence registration requires COMPLETE outcome (got ${JSON.stringify(outcome.status)}); FAILED is not false Evidence`,
    ]);
  }

  if (!isPlainObject(runtimeResult) || runtimeResult.kind !== "MOTOR_RUN_MANIFEST") {
    return reject(bridgeResult, ["MOTOR runtimeResult must be a MOTOR_RUN_MANIFEST"]);
  }
  if (runtimeResult.status !== "SUCCESS") {
    return reject(bridgeResult, ["MOTOR runtimeResult.status must be SUCCESS for Evidence registration"]);
  }
  if (!NON_EMPTY_STRING(runtimeResult.runId)) {
    return reject(bridgeResult, ["MOTOR runtimeResult.runId is required to bind SourceRefs"]);
  }

  const lineage = lineageFactoryKey(bridgeResult);
  if (!lineage.ok) {
    return reject(bridgeResult, lineage.errors);
  }
  if (runtimeResult.factoryKey !== lineage.factoryKey) {
    return reject(bridgeResult, ["runtimeResult.factoryKey must equal outcome.factoryKey"]);
  }

  if (!isMaterialMotorManifest(runtimeResult)) {
    return nonMaterial(bridgeResult);
  }

  const srcCheck = validSourceRefs(sourceRefs);
  if (!srcCheck.ok) {
    return reject(bridgeResult, srcCheck.errors);
  }
  if (motEvd01 == null || typeof motEvd01.registerMaterialManifests !== "function") {
    return reject(bridgeResult, ["motEvd01 with registerMaterialManifests() is required for MOTOR Evidence registration"]);
  }

  let registration;
  try {
    const sourceRefsByManifest = {
      [runtimeResult.runId]: sourceRefs,
    };
    registration = motEvd01.registerMaterialManifests(
      lineage.factoryKey,
      [runtimeResult],
      sourceRefsByManifest
    );
  } catch (e) {
    return reject(bridgeResult, [`MotEvd01 registration threw: ${String(e?.message ?? e)}`]);
  }

  const evidenceRefs = Object.freeze([...(registration?.entries ?? [])]);
  const evidenceMinted = evidenceRefs.length > 0;
  if (!evidenceMinted) {
    return emptyResult({
      ok: true,
      errors: ["MotEvd01 returned no EvidenceRefs — zero mint"],
      family: bridgeResult.family,
      capabilityRef: bridgeResult.capabilityRef,
      outcome,
      registration: registration ?? null,
      evidenceRefs,
      feedbackKind: EVIDENCE_FEEDBACK_KIND.NON_MATERIAL,
    });
  }

  let sufficiency = null;
  if (typeof motEvd01.getRegistrySnapshot === "function") {
    try {
      sufficiency = evaluateSufficiency(motEvd01.getRegistrySnapshot(lineage.factoryKey));
    } catch {
      sufficiency = null;
    }
  }

  return Object.freeze({
    ok: true,
    errors: Object.freeze([]),
    evidenceMinted: true,
    family: bridgeResult.family,
    capabilityRef: bridgeResult.capabilityRef,
    outcome,
    registration,
    evidenceRefs,
    sufficiency,
    stateObservation: null,
    feedbackKind: EVIDENCE_FEEDBACK_KIND.EVIDENCE_REGISTERED,
    ...EVIDENCE_FEEDBACK_AUTHORITY,
  });
}

function applyLoopFeedback(bridgeResult) {
  const outcome = bridgeResult.outcome;
  const runtimeResult = bridgeResult.runtimeResult;

  if (bridgeResult.executed !== true) {
    return reject(bridgeResult, ["LOOP state observation requires executed=true"]);
  }
  if (!outcome) {
    return reject(bridgeResult, ["LOOP state observation requires a P1 ResearchOutcome"]);
  }
  const outcomeCheck = validateResearchOutcome(outcome);
  if (!outcomeCheck.ok) {
    return reject(bridgeResult, outcomeCheck.errors.map((e) => `outcome: ${e}`));
  }
  if (
    outcome.status === RESEARCH_OUTCOME_STATUS.CONFLICT ||
    outcome.status === RESEARCH_OUTCOME_STATUS.UNKNOWN
  ) {
    return reject(bridgeResult, [
      `outcome.status ${outcome.status} is fail-closed — zero Evidence mint`,
    ]);
  }
  if (outcome.status !== RESEARCH_OUTCOME_STATUS.COMPLETE) {
    return reject(bridgeResult, [
      "LOOP blocked/FAILED is not Evidence and is not a COMPLETE/unblocked observation",
    ]);
  }
  if (!isPlainObject(runtimeResult)) {
    return reject(bridgeResult, ["LOOP runtimeResult must be a plain object"]);
  }
  if (runtimeResult.blocked === true) {
    return reject(bridgeResult, ["LOOP blocked=true is not a COMPLETE/unblocked observation"]);
  }
  if (
    NON_EMPTY_STRING(bridgeResult.capabilityRef) &&
    NON_EMPTY_STRING(runtimeResult.loopId) &&
    runtimeResult.loopId !== bridgeResult.capabilityRef
  ) {
    return reject(bridgeResult, ["LOOP runtimeResult.loopId must equal capabilityRef"]);
  }

  const stateObservation = Object.freeze({
    evidenceSufficient: runtimeResult.sufficient === true,
    multiDomainGap: runtimeResult.escalatesToSwarm === true,
  });

  return Object.freeze({
    ok: true,
    errors: Object.freeze([]),
    evidenceMinted: false,
    family: bridgeResult.family,
    capabilityRef: bridgeResult.capabilityRef,
    outcome,
    registration: null,
    evidenceRefs: Object.freeze([]),
    sufficiency: null,
    stateObservation,
    feedbackKind: EVIDENCE_FEEDBACK_KIND.STATE_OBSERVATION,
    ...EVIDENCE_FEEDBACK_AUTHORITY,
  });
}

function applySwarmFeedback(bridgeResult) {
  const outcome = bridgeResult.outcome;
  if (outcome != null) {
    const outcomeCheck = validateResearchOutcome(outcome);
    if (!outcomeCheck.ok) {
      return reject(bridgeResult, outcomeCheck.errors.map((e) => `outcome: ${e}`));
    }
    if (
      outcome.status === RESEARCH_OUTCOME_STATUS.CONFLICT ||
      outcome.status === RESEARCH_OUTCOME_STATUS.UNKNOWN
    ) {
      return reject(bridgeResult, [
        `outcome.status ${outcome.status} is fail-closed — zero Evidence mint`,
      ]);
    }
  }
  return nonMaterial(bridgeResult);
}

/**
 * Apply SP09-P5 Evidence Feedback to a P4 bridge envelope.
 *
 * @param {{
 *   bridgeResult: object,
 *   motEvd01?: { registerMaterialManifests: Function, getRegistrySnapshot?: Function },
 *   sourceRefs?: object[],
 * }} input
 */
export function applyEvidenceFeedback(input) {
  const inputCheck = validateEvidenceFeedbackInput(input);
  if (!inputCheck.ok) {
    return emptyResult({ errors: inputCheck.errors });
  }

  const { bridgeResult, motEvd01, sourceRefs } = input;
  const family = bridgeResult.family;

  if (family === CAPABILITY_FAMILY.MOTOR) {
    return applyMotorFeedback(bridgeResult, motEvd01, sourceRefs);
  }
  if (family === CAPABILITY_FAMILY.LOOP) {
    return applyLoopFeedback(bridgeResult);
  }
  if (family === CAPABILITY_FAMILY.SWARM) {
    return applySwarmFeedback(bridgeResult);
  }

  return reject(bridgeResult, [
    `unsupported or missing family ${JSON.stringify(family)} — zero Evidence mint`,
  ]);
}

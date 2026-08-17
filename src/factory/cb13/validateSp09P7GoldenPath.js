/**
 * SP09-P7 — Golden Path / Acceptance Proof (T GP-01…GP-15 + regressions)
 *
 * Acceptance harness only: composes closed P1–P6 production surfaces.
 * Does NOT introduce goldenPath.js or new production behavior.
 *
 * Runnable:
 *   node src/factory/cb13/validateSp09P7GoldenPath.js
 */

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { evaluateXvrEvd01 } from "../cb11/integrationLoopStubs.js";
import {
  PLANNING_DECISION_STATUS,
  RESEARCH_ACTION_ROLE,
  RESEARCH_OUTCOME_STATUS,
  RESEARCH_QUESTION_STATUS,
  buildResearchAction,
  buildResearchQuestion,
  validatePlanningDecision,
  validateResearchOutcome,
  validateResearchTask,
} from "./researchContracts.js";
import { CAPABILITY_NEED } from "./capabilitySemantics.js";
import { planAdaptiveResearch, validateResearchPlannerStateV1 } from "./adaptivePlanner.js";
import { executeResearchBridge } from "./researchExecutionBridge.js";
import {
  EVIDENCE_FEEDBACK_KIND,
  applyEvidenceFeedback,
} from "./evidenceFeedback.js";
import {
  BOUNDED_REPLAN_DISPOSITION,
  applyBoundedReplan,
} from "./boundedReplan.js";
import { runSp09P1ResearchContractsValidation } from "./validateSp09P1ResearchContracts.js";
import { runSp09P2CapabilitySemanticsValidation } from "./validateSp09P2CapabilitySemantics.js";
import { runSp09P3AdaptivePlannerValidation } from "./validateSp09P3AdaptivePlanner.js";
import { runSp09P4ResearchExecutionBridgeValidation } from "./validateSp09P4ResearchExecutionBridge.js";
import { runSp09P5EvidenceFeedbackValidation } from "./validateSp09P5EvidenceFeedback.js";
import { runSp09P6BoundedReplanValidation } from "./validateSp09P6BoundedReplan.js";
import { runCb13Validation } from "./validateCb13.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export const SP09_P7_PROGRAM = "SP09-P7";
export const SP09_P7_VERSION = "v1";

const FACTORY_KEY = "expediente.sp09-p7.golden-001";
const QUESTION_ID = "rq-sp09-p7-001";
const ACTION_EVIDENCE = "ra-evidence-01";
const ACTION_MULTIDOMAIN = "ra-multidomain-01";
const ACTION_OWNERSHIP = "ra-ownership-01";
const CAP_REF_LOOP = "LOOP-XVR-EVD-01";

function pass(id, errors = []) {
  return { id, passed: errors.length === 0, errors };
}

function S0() {
  return Object.freeze({
    evidenceSufficient: false,
    multiDomainGap: false,
    openConflicts: 0,
  });
}

function buildQuestion() {
  return buildResearchQuestion({
    researchQuestionId: QUESTION_ID,
    factoryKey: FACTORY_KEY,
    question: "What research action should proceed next under current Living Intelligence state?",
    status: RESEARCH_QUESTION_STATUS.OPEN,
  });
}

function buildCandidate(actionId, capabilityNeed) {
  return {
    action: buildResearchAction({
      researchActionId: actionId,
      researchQuestionId: QUESTION_ID,
      role: RESEARCH_ACTION_ROLE.CANDIDATE,
      description: `candidate for ${capabilityNeed}`,
    }),
    capabilityNeed,
  };
}

/** Deterministic candidate set — P2 vocabulary only. */
function sharedCandidates() {
  return [
    buildCandidate(ACTION_EVIDENCE, CAPABILITY_NEED.EVIDENCE_SUFFICIENCY_GAP),
    buildCandidate(ACTION_MULTIDOMAIN, CAPABILITY_NEED.MULTI_DOMAIN_SUFFICIENCY),
    buildCandidate(ACTION_OWNERSHIP, CAPABILITY_NEED.OWNERSHIP_RECORD),
  ];
}

/**
 * Inject existing CB11 evaluateXvrEvd01 — do not reimplement LOOP semantics.
 * @returns {{ runner: Function, callCount: () => number }}
 */
function makeProductionLoopRunner(onCall) {
  let calls = 0;
  const runner = async (capabilityRef, loopCtx) => {
    calls += 1;
    if (typeof onCall === "function") onCall({ capabilityRef, loopCtx, calls });
    return evaluateXvrEvd01(loopCtx.snapshot);
  };
  return {
    runner,
    callCount: () => calls,
  };
}

/**
 * Nuclear Golden Path composition (one branch).
 * Ends at justified D2 — does NOT execute D2.
 */
async function runNuclearBranch(opts) {
  const {
    snapshot,
    planningDecisionIdD1,
    planningDecisionIdD2,
    researchTaskId,
    researchOutcomeId,
    loopRunnerOverride,
  } = opts;

  const question = buildQuestion();
  const candidates = sharedCandidates();
  const state0 = S0();

  const d1Plan = planAdaptiveResearch({
    planningDecisionId: planningDecisionIdD1,
    question,
    candidates,
    state: state0,
  });

  const d1 = d1Plan.decision;
  const matched = candidates.find((c) => c.action.researchActionId === d1?.researchActionId);

  let bridgeResult = null;
  let feedback = null;
  let replan = null;
  let loopCalls = 0;

  if (d1Plan.ok && d1?.status === PLANNING_DECISION_STATUS.ACCEPTED && matched) {
    const selectedAction = buildResearchAction({
      researchActionId: matched.action.researchActionId,
      researchQuestionId: QUESTION_ID,
      role: RESEARCH_ACTION_ROLE.SELECTED,
      description: matched.action.description,
    });

    const produced = makeProductionLoopRunner();
    const loopRunner = loopRunnerOverride ?? produced.runner;

    bridgeResult = await executeResearchBridge({
      planningDecisionId: planningDecisionIdD1,
      decision: d1,
      action: selectedAction,
      capabilityNeed: matched.capabilityNeed,
      researchTaskId,
      researchOutcomeId,
      loopRunner,
      loopCtx: { snapshot, signals: {} },
    });
    loopCalls = loopRunnerOverride ? -1 : produced.callCount();

    feedback = applyEvidenceFeedback({ bridgeResult });

    replan = applyBoundedReplan({
      planningDecisionId: planningDecisionIdD2,
      question,
      candidates,
      previousState: state0,
      previousAction: {
        researchActionId: d1.researchActionId,
        capabilityNeed: matched.capabilityNeed,
      },
      feedback,
      openConflicts: 0,
    });
  }

  return {
    question,
    candidates,
    state0,
    d1Plan,
    d1,
    matched,
    bridgeResult,
    feedback,
    replan,
    loopCalls,
  };
}

function semanticFingerprint(branch) {
  return JSON.stringify({
    d1Status: branch.d1?.status,
    d1Action: branch.d1?.researchActionId,
    outcomeStatus: branch.bridgeResult?.outcome?.status,
    feedbackKind: branch.feedback?.feedbackKind,
    observation: branch.feedback?.stateObservation ?? null,
    evidenceMinted: branch.feedback?.evidenceMinted,
    s1: branch.replan?.stateUsed,
    d2Status: branch.replan?.decision?.status,
    d2Action: branch.replan?.decision?.researchActionId,
    disposition: branch.replan?.disposition,
    plannerInvocations: branch.replan?.plannerInvocations,
  });
}

async function gp01() {
  const errors = [];
  const branch = await runNuclearBranch({
    snapshot: { evidenceSufficient: true },
    planningDecisionIdD1: "pd-sp09-p7-x-d1",
    planningDecisionIdD2: "pd-sp09-p7-x-d2",
    researchTaskId: "rt-sp09-p7-x-001",
    researchOutcomeId: "ro-sp09-p7-x-001",
  });

  if (!branch.d1Plan.ok) errors.push(`D1 plan failed: ${(branch.d1Plan.errors ?? []).join("; ")}`);
  if (branch.d1?.status !== PLANNING_DECISION_STATUS.ACCEPTED) {
    errors.push(`expected D1 ACCEPTED, got ${branch.d1?.status}`);
  }
  if (branch.d1?.researchActionId !== ACTION_EVIDENCE) {
    errors.push(`expected D1 ${ACTION_EVIDENCE}, got ${branch.d1?.researchActionId}`);
  }
  if (branch.matched?.capabilityNeed !== CAPABILITY_NEED.EVIDENCE_SUFFICIENCY_GAP) {
    errors.push("D1 must select evidence-sufficiency-gap candidate");
  }
  if (branch.bridgeResult?.executed !== true) errors.push("P4 must execute LOOP");
  if (branch.bridgeResult?.family !== "LOOP") errors.push("family must be LOOP");
  if (branch.bridgeResult?.capabilityRef !== CAP_REF_LOOP) {
    errors.push(`capabilityRef must be ${CAP_REF_LOOP}`);
  }
  if (branch.bridgeResult?.outcome?.status !== RESEARCH_OUTCOME_STATUS.COMPLETE) {
    errors.push(`expected COMPLETE, got ${branch.bridgeResult?.outcome?.status}`);
  }
  if (branch.feedback?.feedbackKind !== EVIDENCE_FEEDBACK_KIND.STATE_OBSERVATION) {
    errors.push(`expected STATE_OBSERVATION, got ${branch.feedback?.feedbackKind}`);
  }
  if (branch.feedback?.stateObservation?.evidenceSufficient !== true) {
    errors.push("observation.evidenceSufficient must be true");
  }
  if (branch.feedback?.stateObservation?.multiDomainGap !== false) {
    errors.push("observation.multiDomainGap must be false");
  }
  if (branch.feedback?.evidenceMinted !== false) errors.push("nuclear LOOP must not mint Evidence");

  const s1 = branch.replan?.stateUsed;
  const s1Check = validateResearchPlannerStateV1(s1);
  if (!s1Check.ok) errors.push(...s1Check.errors);
  if (s1?.evidenceSufficient !== true || s1?.multiDomainGap !== false || s1?.openConflicts !== 0) {
    errors.push("S1-X must be {true,false,0}");
  }
  if (branch.replan?.decision?.status !== PLANNING_DECISION_STATUS.REFUSED) {
    errors.push(`expected D2 REFUSED, got ${branch.replan?.decision?.status}`);
  }
  if (branch.replan?.disposition !== BOUNDED_REPLAN_DISPOSITION.STOP) {
    errors.push(`expected STOP, got ${branch.replan?.disposition}`);
  }
  if (branch.replan?.plannerInvocations !== 1) errors.push("P6 must invoke planner exactly once");
  if (branch.loopCalls !== 1) errors.push("LOOP runner must be invoked exactly once (D1 only)");

  return pass("GP-01", errors);
}

async function gp02() {
  const errors = [];
  const branch = await runNuclearBranch({
    snapshot: { multiDomainConflict: true },
    planningDecisionIdD1: "pd-sp09-p7-y-d1",
    planningDecisionIdD2: "pd-sp09-p7-y-d2",
    researchTaskId: "rt-sp09-p7-y-001",
    researchOutcomeId: "ro-sp09-p7-y-001",
  });

  if (branch.d1?.status !== PLANNING_DECISION_STATUS.ACCEPTED) {
    errors.push(`expected D1 ACCEPTED, got ${branch.d1?.status}`);
  }
  if (branch.d1?.researchActionId !== ACTION_EVIDENCE) {
    errors.push(`expected D1 ${ACTION_EVIDENCE}`);
  }
  if (branch.bridgeResult?.outcome?.status !== RESEARCH_OUTCOME_STATUS.COMPLETE) {
    errors.push("Branch Y LOOP must COMPLETE");
  }
  if (branch.feedback?.feedbackKind !== EVIDENCE_FEEDBACK_KIND.STATE_OBSERVATION) {
    errors.push("expected STATE_OBSERVATION");
  }
  if (branch.feedback?.stateObservation?.evidenceSufficient !== false) {
    errors.push("observation.evidenceSufficient must be false");
  }
  if (branch.feedback?.stateObservation?.multiDomainGap !== true) {
    errors.push("observation.multiDomainGap must be true");
  }
  if (branch.feedback?.evidenceMinted !== false) errors.push("must not mint Evidence");

  const s1 = branch.replan?.stateUsed;
  if (s1?.evidenceSufficient !== false || s1?.multiDomainGap !== true || s1?.openConflicts !== 0) {
    errors.push("S1-Y must be {false,true,0}");
  }
  if (branch.replan?.decision?.status !== PLANNING_DECISION_STATUS.ACCEPTED) {
    errors.push(`expected D2 ACCEPTED, got ${branch.replan?.decision?.status}`);
  }
  if (branch.replan?.decision?.researchActionId !== ACTION_MULTIDOMAIN) {
    errors.push(`expected D2 ${ACTION_MULTIDOMAIN}, got ${branch.replan?.decision?.researchActionId}`);
  }
  if (branch.replan?.disposition !== BOUNDED_REPLAN_DISPOSITION.CONTINUE) {
    errors.push(`expected CONTINUE, got ${branch.replan?.disposition}`);
  }
  if (branch.loopCalls !== 1) errors.push("must not execute D2 (one LOOP call only)");

  return pass("GP-02", errors);
}

async function gp03() {
  const errors = [];
  const x = await runNuclearBranch({
    snapshot: { evidenceSufficient: true },
    planningDecisionIdD1: "pd-sp09-p7-div-x-d1",
    planningDecisionIdD2: "pd-sp09-p7-div-x-d2",
    researchTaskId: "rt-sp09-p7-div-x",
    researchOutcomeId: "ro-sp09-p7-div-x",
  });
  const y = await runNuclearBranch({
    snapshot: { multiDomainConflict: true },
    planningDecisionIdD1: "pd-sp09-p7-div-y-d1",
    planningDecisionIdD2: "pd-sp09-p7-div-y-d2",
    researchTaskId: "rt-sp09-p7-div-y",
    researchOutcomeId: "ro-sp09-p7-div-y",
  });

  if (x.question.researchQuestionId !== y.question.researchQuestionId) {
    errors.push("branches must share researchQuestionId");
  }
  if (x.question.factoryKey !== y.question.factoryKey) errors.push("branches must share factoryKey");
  if (JSON.stringify(x.state0) !== JSON.stringify(y.state0)) errors.push("branches must share S0");
  if (x.d1?.researchActionId !== y.d1?.researchActionId || x.d1?.status !== y.d1?.status) {
    errors.push("branches must share deterministic D1 selection");
  }
  if (JSON.stringify(x.replan?.stateUsed) === JSON.stringify(y.replan?.stateUsed)) {
    errors.push("S1 must diverge");
  }
  if (x.replan?.disposition !== BOUNDED_REPLAN_DISPOSITION.STOP) errors.push("X must STOP");
  if (y.replan?.disposition !== BOUNDED_REPLAN_DISPOSITION.CONTINUE) errors.push("Y must CONTINUE");
  if (x.replan?.decision?.status !== PLANNING_DECISION_STATUS.REFUSED) errors.push("X D2 REFUSED");
  if (y.replan?.decision?.researchActionId !== ACTION_MULTIDOMAIN) errors.push("Y D2 multidomain");

  return pass("GP-03", errors);
}

async function gp04() {
  const errors = [];
  const d1Id = "pd-sp09-p7-lin-d1";
  const d2Id = "pd-sp09-p7-lin-d2";
  const taskId = "rt-sp09-p7-lin-001";
  const outcomeId = "ro-sp09-p7-lin-001";
  const branch = await runNuclearBranch({
    snapshot: { evidenceSufficient: true },
    planningDecisionIdD1: d1Id,
    planningDecisionIdD2: d2Id,
    researchTaskId: taskId,
    researchOutcomeId: outcomeId,
  });

  if (branch.d1?.factoryKey !== FACTORY_KEY) errors.push("D1 factoryKey lineage");
  if (branch.d1?.researchQuestionId !== QUESTION_ID) errors.push("D1 researchQuestionId lineage");
  if (branch.d1?.planningDecisionId !== d1Id) errors.push("D1 planningDecisionId");
  if (branch.d1?.researchActionId !== ACTION_EVIDENCE) errors.push("D1 researchActionId");

  const task = branch.bridgeResult?.task;
  const outcome = branch.bridgeResult?.outcome;
  const tv = validateResearchTask(task);
  const ov = validateResearchOutcome(outcome);
  if (!tv.ok) errors.push(...tv.errors);
  if (!ov.ok) errors.push(...ov.errors);
  if (task?.factoryKey !== FACTORY_KEY) errors.push("task factoryKey");
  if (task?.researchTaskId !== taskId) errors.push("researchTaskId");
  if (task?.planningDecisionId !== d1Id) errors.push("task planningDecisionId");
  if (task?.researchActionId !== ACTION_EVIDENCE) errors.push("task researchActionId");
  if (task?.capabilityNeed !== CAPABILITY_NEED.EVIDENCE_SUFFICIENCY_GAP) {
    errors.push("task capabilityNeed");
  }
  if (outcome?.factoryKey !== FACTORY_KEY) errors.push("outcome factoryKey");
  if (outcome?.researchOutcomeId !== outcomeId) errors.push("researchOutcomeId");
  if (outcome?.researchTaskId !== taskId) errors.push("outcome→task lineage");
  if (branch.bridgeResult?.capabilityRef !== CAP_REF_LOOP) errors.push("capabilityRef");
  if (branch.feedback?.outcome?.researchOutcomeId !== outcomeId) {
    errors.push("P5 must carry same outcome identity");
  }
  if (branch.replan?.decision?.planningDecisionId !== d2Id) errors.push("D2 planningDecisionId");
  if (branch.replan?.decision?.factoryKey !== FACTORY_KEY) errors.push("D2 factoryKey");
  if (branch.replan?.decision?.researchQuestionId !== QUESTION_ID) {
    errors.push("D2 researchQuestionId");
  }
  if (Array.isArray(branch.feedback?.evidenceRefs) && branch.feedback.evidenceRefs.length > 0) {
    errors.push("nuclear LOOP must not claim EvidenceRef");
  }

  return pass("GP-04", errors);
}

async function gp05() {
  const errors = [];
  const branch = await runNuclearBranch({
    snapshot: { evidenceSufficient: true },
    planningDecisionIdD1: "pd-sp09-p7-auth-d1",
    planningDecisionIdD2: "pd-sp09-p7-auth-d2",
    researchTaskId: "rt-sp09-p7-auth",
    researchOutcomeId: "ro-sp09-p7-auth",
  });

  const d1v = validatePlanningDecision(branch.d1);
  if (!d1v.ok) errors.push(...d1v.errors);
  if (branch.d1?.executionAuthorized !== false) errors.push("Planner must not authorize execution");
  if (branch.d1?.planningIsNotExecution !== true) errors.push("planningIsNotExecution");
  if (branch.d1?.isEvidence !== false || branch.d1?.isFact !== false) {
    errors.push("PlanningDecision must deny Evidence/Fact");
  }

  if (branch.bridgeResult?.isEvidence !== false || branch.bridgeResult?.isFact !== false) {
    errors.push("P4 envelope must deny Evidence/Fact");
  }
  if (Object.prototype.hasOwnProperty.call(branch.bridgeResult?.dispatch ?? {}, "executionAuthorized")) {
    errors.push("DispatchArtifact must not carry executionAuthorized");
  }
  if (branch.bridgeResult?.outcome?.isEvidence !== false) errors.push("Outcome isEvidence false");
  if (branch.bridgeResult?.outcome?.isFact !== false) errors.push("Outcome isFact false");
  if (branch.bridgeResult?.outcome?.evidenceAuthority !== "CB-06") {
    errors.push("CB06 remains sole Evidence authority marker on Outcome");
  }

  if (branch.feedback?.evidenceMinted !== false) errors.push("P5 LOOP must not mint");
  if (branch.feedback?.evidenceAuthority !== "CB-06") errors.push("P5 evidenceAuthority CB-06");
  if (branch.feedback?.feedbackIsNotPlannerStateV1 !== true) {
    errors.push("stateObservation must not be claimed as V1");
  }
  const obsAsV1 = validateResearchPlannerStateV1(branch.feedback?.stateObservation ?? {});
  if (obsAsV1.ok) errors.push("stateObservation must not validate as ResearchPlannerStateV1");

  if (branch.replan?.plannerInvocations !== 1) errors.push("P6 one evaluation only");
  if (branch.replan?.executionAuthorized !== false) errors.push("P6 must not authorize execution");
  if (branch.replan?.replanDoesNotAuthorizeOpportunity !== true) {
    errors.push("P6 must deny Opportunity");
  }
  if (branch.replan?.replanDoesNotPublish !== true) errors.push("P6 must deny publication");
  if (branch.replan?.replanIsNotSp10 !== true) errors.push("P6 must deny Discovery/SP10");
  if (branch.replan?.replanIsNotGoldenPath !== true) {
    errors.push("P6 module must deny being Golden Path production");
  }
  if (branch.replan?.isFact !== false || branch.replan?.isEvidence !== false) {
    errors.push("P6 must deny Evidence/Fact");
  }
  if (branch.loopCalls !== 1) errors.push("D2 must not be executed");

  return pass("GP-05", errors);
}

async function gp06() {
  const errors = [];
  const question = buildQuestion();
  const candidates = sharedCandidates();
  const state0 = S0();
  const d1Plan = planAdaptiveResearch({
    planningDecisionId: "pd-sp09-p7-fail-d1",
    question,
    candidates,
    state: state0,
  });
  const matched = candidates.find((c) => c.action.researchActionId === d1Plan.decision.researchActionId);
  const bridgeResult = await executeResearchBridge({
    planningDecisionId: "pd-sp09-p7-fail-d1",
    decision: d1Plan.decision,
    action: buildResearchAction({
      researchActionId: matched.action.researchActionId,
      researchQuestionId: QUESTION_ID,
      role: RESEARCH_ACTION_ROLE.SELECTED,
      description: matched.action.description,
    }),
    capabilityNeed: matched.capabilityNeed,
    researchTaskId: "rt-sp09-p7-fail",
    researchOutcomeId: "ro-sp09-p7-fail",
    loopRunner: async () => ({
      loopId: CAP_REF_LOOP,
      blocked: true,
      sufficient: false,
    }),
    loopCtx: { snapshot: { evidenceSufficient: false }, signals: {} },
  });
  if (bridgeResult.outcome?.status !== RESEARCH_OUTCOME_STATUS.FAILED) {
    errors.push(`expected FAILED, got ${bridgeResult.outcome?.status}`);
  }
  const feedback = applyEvidenceFeedback({ bridgeResult });
  if (feedback.feedbackKind !== EVIDENCE_FEEDBACK_KIND.REJECTED) {
    errors.push(`expected REJECTED feedback, got ${feedback.feedbackKind}`);
  }
  if (feedback.evidenceMinted !== false) errors.push("no Evidence on FAILED LOOP");
  const replan = applyBoundedReplan({
    planningDecisionId: "pd-sp09-p7-fail-d2",
    question,
    candidates,
    previousState: state0,
    previousAction: {
      researchActionId: ACTION_EVIDENCE,
      capabilityNeed: CAPABILITY_NEED.EVIDENCE_SUFFICIENCY_GAP,
    },
    feedback,
    openConflicts: 0,
  });
  if (replan.disposition === BOUNDED_REPLAN_DISPOSITION.CONTINUE) {
    errors.push("must not fabricate CONTINUE after FAILED/REJECTED");
  }
  if (replan.stateUsed?.evidenceSufficient !== false || replan.stateUsed?.multiDomainGap !== false) {
    errors.push("REJECTED must preserve prior evidence/multi flags");
  }

  return pass("GP-06", errors);
}

async function gp07() {
  const errors = [];
  const question = buildQuestion();
  const candidates = sharedCandidates();
  const state0 = S0();
  const d1Plan = planAdaptiveResearch({
    planningDecisionId: "pd-sp09-p7-unk-d1",
    question,
    candidates,
    state: state0,
  });
  const matched = candidates.find((c) => c.action.researchActionId === d1Plan.decision.researchActionId);
  const bridgeResult = await executeResearchBridge({
    planningDecisionId: "pd-sp09-p7-unk-d1",
    decision: d1Plan.decision,
    action: buildResearchAction({
      researchActionId: matched.action.researchActionId,
      researchQuestionId: QUESTION_ID,
      role: RESEARCH_ACTION_ROLE.SELECTED,
      description: matched.action.description,
    }),
    capabilityNeed: matched.capabilityNeed,
    researchTaskId: "rt-sp09-p7-unk",
    researchOutcomeId: "ro-sp09-p7-unk",
    loopRunner: async () => ({
      loopId: "LOOP-MISMATCHED-ID",
      sufficient: true,
    }),
    loopCtx: { snapshot: { evidenceSufficient: true }, signals: {} },
  });
  if (bridgeResult.outcome?.status !== RESEARCH_OUTCOME_STATUS.UNKNOWN) {
    errors.push(`expected UNKNOWN, got ${bridgeResult.outcome?.status}`);
  }
  const feedback = applyEvidenceFeedback({ bridgeResult });
  if (feedback.feedbackKind !== EVIDENCE_FEEDBACK_KIND.REJECTED) {
    errors.push("UNKNOWN must fail-closed at P5 (REJECTED)");
  }
  if (feedback.evidenceMinted !== false) errors.push("UNKNOWN must not mint Evidence");
  if (feedback.stateObservation != null) {
    errors.push("UNKNOWN must not invent STATE_OBSERVATION");
  }
  const replan = applyBoundedReplan({
    planningDecisionId: "pd-sp09-p7-unk-d2",
    question,
    candidates,
    previousState: state0,
    previousAction: { researchActionId: ACTION_EVIDENCE },
    feedback,
    openConflicts: 0,
  });
  if (replan.disposition === BOUNDED_REPLAN_DISPOSITION.CONTINUE && replan.stateChanged === true) {
    // REJECTED + unchanged V1 cannot CONTINUE; if CONTINUE somehow, fail
  }
  if (replan.disposition === BOUNDED_REPLAN_DISPOSITION.CONTINUE) {
    errors.push("UNKNOWN/REJECTED must not fabricate CONTINUE progress");
  }

  return pass("GP-07", errors);
}

async function gp08() {
  const errors = [];
  const question = buildQuestion();
  const candidates = sharedCandidates();
  const conflictState = {
    evidenceSufficient: false,
    multiDomainGap: false,
    openConflicts: 1,
  };
  const d1Plan = planAdaptiveResearch({
    planningDecisionId: "pd-sp09-p7-conflict-d1",
    question,
    candidates,
    state: conflictState,
  });
  if (d1Plan.decision?.status !== PLANNING_DECISION_STATUS.CONFLICT) {
    errors.push(`expected P3 CONFLICT, got ${d1Plan.decision?.status}`);
  }
  const replan = applyBoundedReplan({
    planningDecisionId: "pd-sp09-p7-conflict-d2",
    question,
    candidates,
    previousState: conflictState,
    previousAction: null,
    feedback: {
      ok: true,
      errors: [],
      evidenceMinted: false,
      feedbackKind: EVIDENCE_FEEDBACK_KIND.NON_MATERIAL,
      stateObservation: null,
    },
    openConflicts: 1,
  });
  if (replan.decision?.status !== PLANNING_DECISION_STATUS.CONFLICT) {
    errors.push(`P6 planner path expected CONFLICT, got ${replan.decision?.status}`);
  }
  if (replan.disposition !== BOUNDED_REPLAN_DISPOSITION.REJECTED) {
    errors.push(`CONFLICT must map to REJECTED, got ${replan.disposition}`);
  }
  if (replan.disposition === "WAIT" || replan.disposition === "HUMAN_REVIEW_REQUIRED") {
    errors.push("must not invent WAIT/HUMAN_REVIEW");
  }
  const values = Object.values(BOUNDED_REPLAN_DISPOSITION);
  if (values.includes("WAIT") || values.includes("HUMAN_REVIEW_REQUIRED")) {
    errors.push("disposition enum must not include WAIT/HUMAN_REVIEW");
  }

  return pass("GP-08", errors);
}

async function gp09() {
  const errors = [];
  const question = buildQuestion();
  const candidates = sharedCandidates();
  const state0 = S0();
  const d1Plan = planAdaptiveResearch({
    planningDecisionId: "pd-sp09-p7-deny-d1",
    question,
    candidates,
    state: state0,
  });
  const matched = candidates.find((c) => c.action.researchActionId === d1Plan.decision.researchActionId);
  const selected = {
    planningDecisionId: "pd-sp09-p7-deny-d1",
    decision: d1Plan.decision,
    action: buildResearchAction({
      researchActionId: matched.action.researchActionId,
      researchQuestionId: QUESTION_ID,
      role: RESEARCH_ACTION_ROLE.SELECTED,
      description: matched.action.description,
    }),
    capabilityNeed: matched.capabilityNeed,
    researchTaskId: "rt-sp09-p7-deny",
    researchOutcomeId: "ro-sp09-p7-deny",
    loopCtx: { snapshot: { evidenceSufficient: true }, signals: {} },
  };

  const missing = await executeResearchBridge(selected);
  if (missing.executed !== false) errors.push("missing loopRunner must not execute");
  if (missing.outcome?.status === RESEARCH_OUTCOME_STATUS.COMPLETE) {
    errors.push("missing loopRunner must not fake COMPLETE");
  }
  const missingFb = applyEvidenceFeedback({ bridgeResult: missing });
  if (missingFb.feedbackKind === EVIDENCE_FEEDBACK_KIND.STATE_OBSERVATION) {
    errors.push("missing runner must not yield successful STATE_OBSERVATION");
  }
  if (missingFb.evidenceMinted !== false) errors.push("missing runner must not mint");

  const threw = await executeResearchBridge({
    ...selected,
    researchTaskId: "rt-sp09-p7-throw",
    researchOutcomeId: "ro-sp09-p7-throw",
    loopRunner: async () => {
      throw new Error("deterministic runtime denial");
    },
  });
  if (threw.outcome?.status !== RESEARCH_OUTCOME_STATUS.FAILED) {
    errors.push(`throw must yield FAILED, got ${threw.outcome?.status}`);
  }
  const threwFb = applyEvidenceFeedback({ bridgeResult: threw });
  if (threwFb.evidenceMinted !== false) errors.push("throw path must not mint");
  if (threwFb.feedbackKind === EVIDENCE_FEEDBACK_KIND.STATE_OBSERVATION) {
    errors.push("throw path must not invent observation success");
  }

  return pass("GP-09", errors);
}

async function gp10() {
  const errors = [];
  const branch = await runNuclearBranch({
    snapshot: { evidenceSufficient: false },
    planningDecisionIdD1: "pd-sp09-p7-nop-d1",
    planningDecisionIdD2: "pd-sp09-p7-nop-d2",
    researchTaskId: "rt-sp09-p7-nop",
    researchOutcomeId: "ro-sp09-p7-nop",
  });
  if (branch.bridgeResult?.outcome?.status !== RESEARCH_OUTCOME_STATUS.COMPLETE) {
    errors.push("insufficient LOOP may still COMPLETE");
  }
  if (branch.feedback?.stateObservation?.evidenceSufficient !== false) {
    errors.push("observation must remain insufficient");
  }
  if (branch.replan?.stateChanged !== false) errors.push("V1 must be unchanged for NO_PROGRESS");
  if (branch.replan?.decision?.researchActionId !== ACTION_EVIDENCE) {
    errors.push("planner must re-select same evidence action");
  }
  if (branch.replan?.disposition !== BOUNDED_REPLAN_DISPOSITION.NO_PROGRESS) {
    errors.push(`expected NO_PROGRESS, got ${branch.replan?.disposition}`);
  }
  if (branch.replan?.plannerInvocations !== 1) {
    errors.push("plannerInvocations must be <= 1 (exactly 1)");
  }

  return pass("GP-10", errors);
}

function gp11() {
  const errors = [];
  const question = buildQuestion();
  const candidates = sharedCandidates();
  const state0 = S0();
  const nonMaterial = applyBoundedReplan({
    planningDecisionId: "pd-sp09-p7-nm-d2",
    question,
    candidates,
    previousState: state0,
    previousAction: null,
    feedback: {
      ok: true,
      errors: [],
      evidenceMinted: false,
      feedbackKind: EVIDENCE_FEEDBACK_KIND.NON_MATERIAL,
      stateObservation: null,
    },
    openConflicts: 0,
  });
  if (nonMaterial.stateChanged !== false) errors.push("NON_MATERIAL must leave V1 unchanged here");
  if (nonMaterial.disposition === BOUNDED_REPLAN_DISPOSITION.CONTINUE) {
    errors.push("NON_MATERIAL + unchanged V1 must not CONTINUE");
  }

  const rejected = applyBoundedReplan({
    planningDecisionId: "pd-sp09-p7-rj-d2",
    question,
    candidates,
    previousState: state0,
    previousAction: { researchActionId: ACTION_EVIDENCE },
    feedback: {
      ok: false,
      errors: ["rejected"],
      evidenceMinted: false,
      feedbackKind: EVIDENCE_FEEDBACK_KIND.REJECTED,
      stateObservation: null,
    },
    openConflicts: 0,
  });
  if (rejected.disposition === BOUNDED_REPLAN_DISPOSITION.CONTINUE) {
    errors.push("REJECTED + unchanged V1 must not CONTINUE");
  }

  return pass("GP-11", errors);
}

async function gp12() {
  const errors = [];
  const opts = {
    snapshot: { evidenceSufficient: true },
    planningDecisionIdD1: "pd-sp09-p7-det-d1",
    planningDecisionIdD2: "pd-sp09-p7-det-d2",
    researchTaskId: "rt-sp09-p7-det",
    researchOutcomeId: "ro-sp09-p7-det",
  };
  const a = await runNuclearBranch(opts);
  const b = await runNuclearBranch(opts);
  if (semanticFingerprint(a) !== semanticFingerprint(b)) {
    errors.push("identical Golden Path inputs must yield identical semantic outputs");
  }
  return pass("GP-12", errors);
}

async function gp13() {
  const errors = [];
  for (const snapshot of [{ evidenceSufficient: true }, { multiDomainConflict: true }]) {
    const branch = await runNuclearBranch({
      snapshot,
      planningDecisionIdD1: `pd-sp09-p7-evd-${snapshot.multiDomainConflict ? "y" : "x"}-d1`,
      planningDecisionIdD2: `pd-sp09-p7-evd-${snapshot.multiDomainConflict ? "y" : "x"}-d2`,
      researchTaskId: `rt-sp09-p7-evd-${snapshot.multiDomainConflict ? "y" : "x"}`,
      researchOutcomeId: `ro-sp09-p7-evd-${snapshot.multiDomainConflict ? "y" : "x"}`,
    });
    if (branch.feedback?.evidenceMinted !== false) {
      errors.push("nuclear LOOP evidenceMinted must be false");
    }
    if ((branch.feedback?.evidenceRefs ?? []).length !== 0) {
      errors.push("nuclear LOOP must not mint EvidenceRef");
    }
  }
  return pass("GP-13", errors);
}

async function gp14() {
  const errors = [];
  let runnerCalls = 0;
  const branch = await runNuclearBranch({
    snapshot: { multiDomainConflict: true },
    planningDecisionIdD1: "pd-sp09-p7-nod2-d1",
    planningDecisionIdD2: "pd-sp09-p7-nod2-d2",
    researchTaskId: "rt-sp09-p7-nod2",
    researchOutcomeId: "ro-sp09-p7-nod2",
    loopRunnerOverride: async (capabilityRef, loopCtx) => {
      runnerCalls += 1;
      return evaluateXvrEvd01(loopCtx.snapshot);
    },
  });
  if (branch.replan?.disposition !== BOUNDED_REPLAN_DISPOSITION.CONTINUE) {
    errors.push("Branch Y expected for D2 CONTINUE decision");
  }
  if (branch.replan?.decision?.researchActionId !== ACTION_MULTIDOMAIN) {
    errors.push("D2 selected multidomain — must remain unexecuted");
  }
  if (runnerCalls !== 1) {
    errors.push(`D2 must not execute (loop calls=${runnerCalls})`);
  }
  if (branch.replan?.decision?.researchActionId === ACTION_MULTIDOMAIN) {
    // Explicit: no second executeResearchBridge for D2 in this harness path.
    // Proven by single runner invocation above.
  }
  return pass("GP-14", errors);
}

function gp15() {
  const errors = [];
  const src = fs.readFileSync(path.join(__dirname, "validateSp09P7GoldenPath.js"), "utf8");
  if (/from\s+["'][^"']*goldenPath\.js["']/.test(src)) {
    errors.push("must not import goldenPath.js production module");
  }
  if (/from\s+["'][^"']*motEvd01[^"']*["']/i.test(src)) {
    errors.push("must not import MotEvd01 (nuclear LOOP path)");
  }
  if (/from\s+["'][^"']*evidenceRegistryStore[^"']*["']/i.test(src)) {
    errors.push("must not import EvidenceRegistryStore / second Evidence ledger");
  }
  for (const name of ["promoteFact", "publishOpportunity", "startDiscovery", "attemptLiveFetch"]) {
    if (new RegExp(`\\b${name}\\s*\\(`).test(src)) {
      errors.push(`forbidden authority call: ${name}`);
    }
  }
  if (!src.includes('from "./adaptivePlanner.js"')) errors.push("must use P3 adaptivePlanner");
  if (!src.includes('from "./researchExecutionBridge.js"')) errors.push("must use P4 bridge");
  if (!src.includes('from "./evidenceFeedback.js"')) errors.push("must use P5 feedback");
  if (!src.includes('from "./boundedReplan.js"')) errors.push("must use P6 replan");
  if (!src.includes("evaluateXvrEvd01")) errors.push("must use existing CB11 evaluateXvrEvd01");
  return pass("GP-15", errors);
}

function gp16() {
  const errors = [];
  const indexSrc = fs.readFileSync(path.join(__dirname, "index.js"), "utf8");
  if (!indexSrc.includes("runSp09P7GoldenPathValidation")) {
    errors.push("index.js must export runSp09P7GoldenPathValidation");
  }
  if (!indexSrc.includes('from "./validateSp09P7GoldenPath.js"')) {
    errors.push("index.js must re-export validateSp09P7GoldenPath.js");
  }
  if (SP09_P7_PROGRAM !== "SP09-P7") errors.push("program must be SP09-P7");
  return pass("GP-16", errors);
}

async function gp17() {
  const p1 = runSp09P1ResearchContractsValidation();
  return pass(
    "GP-17",
    p1.passed ? [] : [`P1 failed: ${p1.results.filter((x) => !x.passed).map((x) => x.id).join(",")}`]
  );
}

async function gp18() {
  const p2 = await runSp09P2CapabilitySemanticsValidation();
  return pass(
    "GP-18",
    p2.passed ? [] : [`P2 failed: ${p2.results.filter((x) => !x.passed).map((x) => x.id).join(",")}`]
  );
}

async function gp19() {
  const p3 = await runSp09P3AdaptivePlannerValidation();
  return pass(
    "GP-19",
    p3.passed ? [] : [`P3 failed: ${p3.results.filter((x) => !x.passed).map((x) => x.id).join(",")}`]
  );
}

async function gp20() {
  const p4 = await runSp09P4ResearchExecutionBridgeValidation();
  return pass(
    "GP-20",
    p4.passed ? [] : [`P4 failed: ${p4.results.filter((x) => !x.passed).map((x) => x.id).join(",")}`]
  );
}

async function gp21() {
  const p5 = await runSp09P5EvidenceFeedbackValidation();
  return pass(
    "GP-21",
    p5.passed ? [] : [`P5 failed: ${p5.results.filter((x) => !x.passed).map((x) => x.id).join(",")}`]
  );
}

async function gp22() {
  const p6 = await runSp09P6BoundedReplanValidation();
  return pass(
    "GP-22",
    p6.passed ? [] : [`P6 failed: ${p6.results.filter((x) => !x.passed).map((x) => x.id).join(",")}`]
  );
}

async function gp23() {
  const errors = [];
  try {
    const result = await runCb13Validation({});
    if (!result.passed) errors.push(`CB13 failed: ${(result.errors ?? []).join("; ")}`);
  } catch (e) {
    errors.push(String(e.message ?? e));
  }
  return pass("GP-23", errors);
}

export async function runSp09P7GoldenPathValidation() {
  const results = [
    await gp01(),
    await gp02(),
    await gp03(),
    await gp04(),
    await gp05(),
    await gp06(),
    await gp07(),
    await gp08(),
    await gp09(),
    await gp10(),
    gp11(),
    await gp12(),
    await gp13(),
    await gp14(),
    gp15(),
    gp16(),
    await gp17(),
    await gp18(),
    await gp19(),
    await gp20(),
    await gp21(),
    await gp22(),
    await gp23(),
  ];
  return {
    passed: results.every((r) => r.passed),
    results,
  };
}

const isMain =
  process.argv[1] &&
  (process.argv[1].endsWith("validateSp09P7GoldenPath.js") ||
    process.argv[1].includes("validateSp09P7GoldenPath"));

if (isMain) {
  const result = await runSp09P7GoldenPathValidation();
  console.log("=== SP09-P7 Golden Path / Acceptance Proof Validation ===\n");
  console.log(JSON.stringify(result, null, 2));
  if (!result.passed) {
    console.error("\n❌ SP09-P7 validation FAILED");
    process.exit(1);
  }
  console.log("\n✅ SP09-P7 validation PASSED");
}

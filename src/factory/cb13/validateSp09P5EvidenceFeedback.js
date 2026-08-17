/**
 * SP09-P5 — Evidence Feedback validation (T01–T22)
 *
 * Runnable:
 *   node src/factory/cb13/validateSp09P5EvidenceFeedback.js
 */

import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { isSourceRef, buildSourceRef } from "../cb02/sourceRef.js";
import { MotEvd01 } from "../cb06/motEvd01Core.js";
import { EvidenceRegistryStore } from "../cb06/evidenceRegistryStore.js";
import { isEvidenceRef } from "../cb06/evidenceRef.js";
import {
  PLANNING_DECISION_STATUS,
  RESEARCH_ACTION_ROLE,
  RESEARCH_OUTCOME_STATUS,
  buildPlanningDecision,
  buildResearchAction,
  buildResearchOutcome,
  buildResearchTask,
  validateResearchOutcome,
} from "./researchContracts.js";
import { CAPABILITY_FAMILY, CAPABILITY_NEED } from "./capabilitySemantics.js";
import { executeResearchBridge } from "./researchExecutionBridge.js";
import {
  EVIDENCE_FEEDBACK_KIND,
  EVIDENCE_FEEDBACK_PROGRAM,
  applyEvidenceFeedback,
} from "./evidenceFeedback.js";
import { runSp09P1ResearchContractsValidation } from "./validateSp09P1ResearchContracts.js";
import { runSp09P2CapabilitySemanticsValidation } from "./validateSp09P2CapabilitySemantics.js";
import { runSp09P3AdaptivePlannerValidation } from "./validateSp09P3AdaptivePlanner.js";
import { runSp09P4ResearchExecutionBridgeValidation } from "./validateSp09P4ResearchExecutionBridge.js";
import { runCb13Validation } from "./validateCb13.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const FACTORY_KEY = "expediente.sp09-p5.demo-001";

function pass(id, errors = []) {
  return { id, passed: errors.length === 0, errors };
}

function acceptedDecision(overrides = {}) {
  return buildPlanningDecision({
    planningDecisionId: "pd-p5-001",
    researchQuestionId: "rq-p5-001",
    researchActionId: "ra-p5-001",
    factoryKey: FACTORY_KEY,
    status: PLANNING_DECISION_STATUS.ACCEPTED,
    rationale: "accepted for P5 evidence feedback test",
    ...overrides,
  });
}

function matchingAction(overrides = {}) {
  return buildResearchAction({
    researchActionId: "ra-p5-001",
    researchQuestionId: "rq-p5-001",
    role: RESEARCH_ACTION_ROLE.SELECTED,
    description: "selected research action",
    ...overrides,
  });
}

function baseEnvelope(overrides = {}) {
  return {
    planningDecisionId: "pd-p5-001",
    decision: acceptedDecision(),
    action: matchingAction(),
    capabilityNeed: CAPABILITY_NEED.OWNERSHIP_RECORD,
    researchTaskId: "rt-p5-001",
    researchOutcomeId: "ro-p5-001",
    ...overrides,
  };
}

function materialMotorManifest(overrides = {}) {
  return Object.freeze({
    kind: "MOTOR_RUN_MANIFEST",
    status: "SUCCESS",
    runId: "RUN-P5-OWN-01",
    motorId: "MOT-OWN-01",
    factoryKey: FACTORY_KEY,
    knowledgeDelta: { domain: "08", ownerStatus: "RESOLVED" },
    ...overrides,
  });
}

function mockMotorRuntime(impl) {
  return { execute: async (...args) => impl(...args) };
}

function mockLoopRunner(impl) {
  return async (...args) => impl(...args);
}

function mockSwarmCoordinator(impl) {
  return { executeSwarmMission: (...args) => impl(...args) };
}

function validSourceRef() {
  const ref = buildSourceRef({
    organismId: "ORG-RCR-MC",
    familyId: "REGISTRAL",
    epistemicLevel: 3,
    factoryKey: FACTORY_KEY,
  });
  if (!isSourceRef(ref)) {
    throw new Error("fixture SourceRef failed isSourceRef");
  }
  return ref;
}

function makeMotEvd01() {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), "sp09-p5-evd-"));
  const inner = new MotEvd01({ store: new EvidenceRegistryStore(root) });
  const calls = [];
  return {
    root,
    calls,
    registerMaterialManifests(...args) {
      calls.push(args);
      return inner.registerMaterialManifests(...args);
    },
    getRegistrySnapshot(factoryKey) {
      return inner.getRegistrySnapshot(factoryKey);
    },
  };
}

async function motorBridge(runtimeImpl, extra = {}) {
  return executeResearchBridge(
    baseEnvelope({
      capabilityNeed: CAPABILITY_NEED.OWNERSHIP_RECORD,
      motorRuntime: mockMotorRuntime(runtimeImpl),
      ...extra,
    })
  );
}

async function loopBridge(result, extra = {}) {
  return executeResearchBridge(
    baseEnvelope({
      capabilityNeed: CAPABILITY_NEED.EVIDENCE_SUFFICIENCY_GAP,
      researchTaskId: extra.researchTaskId ?? "rt-p5-loop",
      researchOutcomeId: extra.researchOutcomeId ?? "ro-p5-loop",
      loopRunner: mockLoopRunner(async () => result),
      loopCtx: { snapshot: { evidenceSufficient: result.sufficient === true }, signals: {} },
    })
  );
}

async function swarmBridge(result, extra = {}) {
  return executeResearchBridge(
    baseEnvelope({
      capabilityNeed: CAPABILITY_NEED.MULTI_DOMAIN_SUFFICIENCY,
      researchTaskId: extra.researchTaskId ?? "rt-p5-swarm",
      researchOutcomeId: extra.researchOutcomeId ?? "ro-p5-swarm",
      swarmCoordinator: mockSwarmCoordinator(() => result),
    })
  );
}

async function t01() {
  const errors = [];
  const evd01 = makeMotEvd01();
  const bridgeResult = await motorBridge(async () => materialMotorManifest());
  const r = applyEvidenceFeedback({
    bridgeResult,
    motEvd01: evd01,
    sourceRefs: [validSourceRef()],
  });
  if (evd01.calls.length !== 1) errors.push("MotEvd01.registerMaterialManifests must be invoked once");
  if (r.evidenceMinted !== true) errors.push("evidenceMinted must be true");
  if (r.feedbackKind !== EVIDENCE_FEEDBACK_KIND.EVIDENCE_REGISTERED) {
    errors.push(`expected EVIDENCE_REGISTERED, got ${r.feedbackKind}`);
  }
  if (!Array.isArray(r.evidenceRefs) || r.evidenceRefs.length < 1) {
    errors.push("expected minted EvidenceRef(s)");
  }
  for (const ref of r.evidenceRefs ?? []) {
    if (!isEvidenceRef(ref)) errors.push("minted entry must be EvidenceRef");
  }
  if (r.outcome?.isEvidence !== false) errors.push("ResearchOutcome must remain isEvidence false");
  if (r.outcome?.isFact !== false) errors.push("ResearchOutcome must remain isFact false");
  const v = validateResearchOutcome(r.outcome);
  if (!v.ok) errors.push(...v.errors);
  return pass("T01", errors);
}

async function t02() {
  const errors = [];
  const evd01 = makeMotEvd01();
  const bridgeResult = await motorBridge(async () =>
    materialMotorManifest({ knowledgeDelta: {}, runId: "RUN-P5-EMPTY" })
  );
  const r = applyEvidenceFeedback({
    bridgeResult,
    motEvd01: evd01,
    sourceRefs: [validSourceRef()],
  });
  if (evd01.calls.length !== 0) errors.push("non-material must not invoke MotEvd01");
  if (r.evidenceMinted !== false) errors.push("evidenceMinted must be false");
  if (r.feedbackKind !== EVIDENCE_FEEDBACK_KIND.NON_MATERIAL) {
    errors.push(`expected NON_MATERIAL, got ${r.feedbackKind}`);
  }
  if ((r.evidenceRefs ?? []).length !== 0) errors.push("zero mint required");
  return pass("T02", errors);
}

async function t03() {
  const errors = [];
  const evd01 = makeMotEvd01();
  const bridgeResult = await motorBridge(async () => materialMotorManifest({ runId: "RUN-P5-NOPROV" }));

  const missing = applyEvidenceFeedback({
    bridgeResult,
    motEvd01: evd01,
    sourceRefs: [],
  });
  const invalid = applyEvidenceFeedback({
    bridgeResult,
    motEvd01: evd01,
    sourceRefs: [{ id: "not-src", organismId: "x" }],
  });
  const omitted = applyEvidenceFeedback({
    bridgeResult,
    motEvd01: evd01,
  });

  for (const r of [missing, invalid, omitted]) {
    if (r.evidenceMinted !== false) errors.push("missing/invalid SourceRef must not mint");
    if (r.ok !== false && r.feedbackKind !== EVIDENCE_FEEDBACK_KIND.REJECTED) {
      errors.push("missing/invalid SourceRef must fail closed (REJECTED)");
    }
    if (r.feedbackKind !== EVIDENCE_FEEDBACK_KIND.REJECTED) {
      errors.push(`expected REJECTED, got ${r.feedbackKind}`);
    }
  }
  if (evd01.calls.length !== 0) errors.push("MotEvd01 must not be invoked without valid SourceRefs");
  return pass("T03", errors);
}

async function t04() {
  const errors = [];
  const evd01 = makeMotEvd01();
  const bridgeResult = await motorBridge(async () => {
    throw new Error("runtime failure");
  });
  const r = applyEvidenceFeedback({
    bridgeResult,
    motEvd01: evd01,
    sourceRefs: [validSourceRef()],
  });
  if (bridgeResult.outcome?.status !== RESEARCH_OUTCOME_STATUS.FAILED) {
    errors.push("control: P4 should yield FAILED");
  }
  if (evd01.calls.length !== 0) errors.push("FAILED must not mint");
  if (r.evidenceMinted !== false) errors.push("evidenceMinted must be false");
  return pass("T04", errors);
}

async function t05() {
  const errors = [];
  const evd01 = makeMotEvd01();
  const unknown = await motorBridge(async () => ({ foo: 1 }));
  const wrongKind = await motorBridge(async () => ({
    kind: "OTHER",
    status: "SUCCESS",
    runId: "RUN-X",
    factoryKey: FACTORY_KEY,
    knowledgeDelta: { domain: "08" },
  }));
  const nonSuccess = await motorBridge(async () =>
    materialMotorManifest({ status: "FAILED", runId: "RUN-NS" })
  );

  for (const bridgeResult of [unknown, wrongKind, nonSuccess]) {
    const r = applyEvidenceFeedback({
      bridgeResult,
      motEvd01: evd01,
      sourceRefs: [validSourceRef()],
    });
    if (r.evidenceMinted !== false) errors.push("UNKNOWN/wrong kind/non-success must not mint");
  }
  if (evd01.calls.length !== 0) errors.push("MotEvd01 must not be invoked for UNKNOWN paths");
  return pass("T05", errors);
}

async function t06() {
  const errors = [];
  const evd01 = makeMotEvd01();
  const bridgeResult = await loopBridge({
    loopId: "LOOP-XVR-EVD-01",
    finalizer: "FIN-S",
    sufficient: true,
    blocked: false,
  });
  const r = applyEvidenceFeedback({ bridgeResult, motEvd01: evd01, sourceRefs: [validSourceRef()] });
  if (evd01.calls.length !== 0) errors.push("LOOP must not call MotEvd01");
  if ((r.evidenceRefs ?? []).length !== 0) errors.push("zero EvidenceRef required");
  if (r.feedbackKind !== EVIDENCE_FEEDBACK_KIND.STATE_OBSERVATION) {
    errors.push(`expected STATE_OBSERVATION, got ${r.feedbackKind}`);
  }
  if (r.stateObservation?.evidenceSufficient !== true) {
    errors.push("evidenceSufficient must be true");
  }
  if (r.stateObservation?.multiDomainGap !== false) {
    errors.push("multiDomainGap must be false when escalatesToSwarm is absent");
  }
  if (Object.prototype.hasOwnProperty.call(r.stateObservation ?? {}, "openConflicts")) {
    errors.push("stateObservation must not include openConflicts");
  }
  return pass("T06", errors);
}

async function t07() {
  const errors = [];
  const evd01 = makeMotEvd01();
  const bridgeResult = await loopBridge({
    loopId: "LOOP-XVR-EVD-01",
    finalizer: "FIN-R",
    sufficient: false,
    blocked: false,
  });
  const r = applyEvidenceFeedback({ bridgeResult, motEvd01: evd01 });
  if (evd01.calls.length !== 0) errors.push("LOOP insufficient must not mint");
  if (r.evidenceMinted !== false) errors.push("evidenceMinted must be false");
  if (r.outcome?.status !== RESEARCH_OUTCOME_STATUS.COMPLETE) {
    errors.push("insufficient LOOP remains COMPLETE RESULT, not Evidence failure");
  }
  if (r.feedbackKind !== EVIDENCE_FEEDBACK_KIND.STATE_OBSERVATION) {
    errors.push("expected STATE_OBSERVATION");
  }
  if (r.stateObservation?.evidenceSufficient !== false) {
    errors.push("observation.evidenceSufficient must be false");
  }
  if (r.outcome?.isEvidence === true) errors.push("must not treat RESULT as Evidence");
  return pass("T07", errors);
}

async function t08() {
  const errors = [];
  const evd01 = makeMotEvd01();
  const blocked = await loopBridge({
    loopId: "LOOP-XVR-EVD-01",
    blocked: true,
    sufficient: false,
  });
  const r = applyEvidenceFeedback({ bridgeResult: blocked, motEvd01: evd01 });
  if (evd01.calls.length !== 0) errors.push("blocked LOOP must not mint");
  if (r.evidenceMinted !== false) errors.push("evidenceMinted must be false");
  if (r.feedbackKind === EVIDENCE_FEEDBACK_KIND.EVIDENCE_REGISTERED) {
    errors.push("blocked LOOP must not register Evidence");
  }
  return pass("T08", errors);
}

async function t09() {
  const errors = [];
  const evd01 = makeMotEvd01();
  const bridgeResult = await swarmBridge({ accepted: true, swarmId: "swarm-ok" });
  const r = applyEvidenceFeedback({ bridgeResult, motEvd01: evd01, sourceRefs: [validSourceRef()] });
  if (evd01.calls.length !== 0) errors.push("SWARM must not call MotEvd01");
  if (r.evidenceMinted !== false) errors.push("evidenceMinted must be false");
  if (r.stateObservation != null) errors.push("stateObservation must be null");
  if (r.feedbackKind !== EVIDENCE_FEEDBACK_KIND.NON_MATERIAL) {
    errors.push(`expected NON_MATERIAL, got ${r.feedbackKind}`);
  }
  return pass("T09", errors);
}

async function t10() {
  const errors = [];
  const evd01 = makeMotEvd01();
  const bridgeResult = await swarmBridge({ accepted: false, reason: "blocked" });
  const r = applyEvidenceFeedback({ bridgeResult, motEvd01: evd01 });
  if (evd01.calls.length !== 0) errors.push("accepted:false must not mint");
  if (r.evidenceMinted !== false) errors.push("evidenceMinted must be false");
  if (r.stateObservation != null) errors.push("no state observation / mutation");
  return pass("T10", errors);
}

function t11() {
  const errors = [];
  const src = fs.readFileSync(path.join(__dirname, "evidenceFeedback.js"), "utf8");
  for (const token of ["buildSourceRef", "buildMotorManifest"]) {
    if (src.includes(token)) errors.push(`P5 must not use ${token}`);
  }
  if (/kind:\s*["']MOTOR_RUN_MANIFEST["']/.test(src)) {
    errors.push("P5 must not fabricate MOTOR_RUN_MANIFEST literals");
  }
  return pass("T11", errors);
}

function t12() {
  const errors = [];
  const src = fs.readFileSync(path.join(__dirname, "evidenceFeedback.js"), "utf8");
  for (const token of ["planAdaptiveResearch", "replan", "boundedReplan", "retryPlanning"]) {
    if (src.includes(token)) errors.push(`P6 surface forbidden: ${token}`);
  }
  return pass("T12", errors);
}

async function t13() {
  const errors = [];
  const src = fs.readFileSync(path.join(__dirname, "evidenceFeedback.js"), "utf8");
  for (const token of ["acceptEvidence", "promoteFact", "evaluateFactCompleteness"]) {
    if (src.includes(token)) errors.push(`Fact/Evidence shortcut forbidden: ${token}`);
  }
  const evd01 = makeMotEvd01();
  const bridgeResult = await motorBridge(async () => materialMotorManifest({ runId: "RUN-P5-T13" }));
  const r = applyEvidenceFeedback({
    bridgeResult,
    motEvd01: evd01,
    sourceRefs: [validSourceRef()],
  });
  if (r.isFact !== false || r.outcome?.isFact !== false) {
    errors.push("must not promote Fact");
  }
  if (r.outcome?.isEvidence !== false) errors.push("must not treat Outcome as Evidence");
  if (r.completeIsNotEvidence !== true) errors.push("must declare COMPLETE is not Evidence");
  return pass("T13", errors);
}

async function t14() {
  const errors = [];
  const evd01 = makeMotEvd01();
  const manifest = materialMotorManifest({ runId: "RUN-P5-LINEAGE" });
  const bridgeResult = await motorBridge(async () => manifest);
  const r = applyEvidenceFeedback({
    bridgeResult,
    motEvd01: evd01,
    sourceRefs: [validSourceRef()],
  });
  if (bridgeResult.task?.factoryKey !== FACTORY_KEY) errors.push("task factoryKey mismatch");
  if (bridgeResult.outcome?.factoryKey !== FACTORY_KEY) errors.push("outcome factoryKey mismatch");
  if (bridgeResult.runtimeResult?.factoryKey !== FACTORY_KEY) {
    errors.push("manifest factoryKey mismatch");
  }
  if (
    bridgeResult.task.factoryKey !== bridgeResult.outcome.factoryKey ||
    bridgeResult.outcome.factoryKey !== bridgeResult.runtimeResult.factoryKey
  ) {
    errors.push("task = outcome = material manifest factoryKey required");
  }
  if (r.evidenceMinted !== true) errors.push("lineage-valid MOTOR should mint");
  return pass("T14", errors);
}

async function t15() {
  const errors = [];
  const evd01 = makeMotEvd01();
  const task = buildResearchTask({
    researchTaskId: "rt-p5-status",
    planningDecisionId: "pd-p5-001",
    researchActionId: "ra-p5-001",
    factoryKey: FACTORY_KEY,
    capabilityNeed: CAPABILITY_NEED.OWNERSHIP_RECORD,
    status: "READY",
  });
  const manifest = materialMotorManifest({ runId: "RUN-P5-STATUS" });

  for (const status of [RESEARCH_OUTCOME_STATUS.CONFLICT, RESEARCH_OUTCOME_STATUS.UNKNOWN]) {
    const outcome = buildResearchOutcome({
      researchOutcomeId: `ro-p5-${status.toLowerCase()}`,
      researchTaskId: task.researchTaskId,
      factoryKey: FACTORY_KEY,
      status,
    });
    const r = applyEvidenceFeedback({
      bridgeResult: {
        executed: true,
        family: CAPABILITY_FAMILY.MOTOR,
        capabilityRef: "MOT-OWN-01",
        task,
        outcome,
        dispatch: { factoryKey: FACTORY_KEY },
        runtimeResult: manifest,
      },
      motEvd01: evd01,
      sourceRefs: [validSourceRef()],
    });
    if (r.evidenceMinted !== false) errors.push(`${status} must not mint`);
    if (r.feedbackKind !== EVIDENCE_FEEDBACK_KIND.REJECTED) {
      errors.push(`${status} must fail closed`);
    }
  }
  if (evd01.calls.length !== 0) errors.push("CONFLICT/UNKNOWN must not invoke MotEvd01");
  return pass("T15", errors);
}

async function t16() {
  const errors = [];
  const evd01 = makeMotEvd01();
  const bridgeResult = await motorBridge(async () => materialMotorManifest({ runId: "RUN-P5-T16" }));
  const r = applyEvidenceFeedback({
    bridgeResult,
    motEvd01: evd01,
    sourceRefs: [validSourceRef()],
  });
  if (bridgeResult.outcome?.status !== RESEARCH_OUTCOME_STATUS.COMPLETE) {
    errors.push("control: expected COMPLETE");
  }
  if (r.outcome?.isEvidence !== false) errors.push("COMPLETE ≠ Evidence");
  if (r.completeIsNotEvidence !== true) errors.push("must lock completeIsNotEvidence");
  if (r.acceptedIsNotExecutionAuthorization !== true) {
    errors.push("ACCEPTED must not grant execution authorization");
  }
  if (r.matchIsNotExecution !== true) errors.push("MATCHED must not grant execution");
  if (r.feedbackIsNotReplan !== true) errors.push("feedback must not be re-plan");
  return pass("T16", errors);
}

async function t17() {
  const errors = [];
  const p1 = runSp09P1ResearchContractsValidation();
  if (!p1.passed) {
    errors.push(`P1 failed: ${p1.results.filter((x) => !x.passed).map((x) => x.id).join(",")}`);
  }
  return pass("T17", errors);
}

async function t18() {
  const errors = [];
  const p2 = await runSp09P2CapabilitySemanticsValidation();
  if (!p2.passed) {
    errors.push(`P2 failed: ${p2.results.filter((x) => !x.passed).map((x) => x.id).join(",")}`);
  }
  return pass("T18", errors);
}

async function t19() {
  const errors = [];
  const p3 = await runSp09P3AdaptivePlannerValidation();
  if (!p3.passed) {
    errors.push(`P3 failed: ${p3.results.filter((x) => !x.passed).map((x) => x.id).join(",")}`);
  }
  return pass("T19", errors);
}

async function t20() {
  const errors = [];
  const p4 = await runSp09P4ResearchExecutionBridgeValidation();
  if (!p4.passed) {
    errors.push(`P4 failed: ${p4.results.filter((x) => !x.passed).map((x) => x.id).join(",")}`);
  }
  return pass("T20", errors);
}

async function t21() {
  const errors = [];
  try {
    const result = await runCb13Validation({});
    if (!result.passed) {
      errors.push(`CB13 regression failed: ${(result.errors ?? []).join("; ")}`);
    }
  } catch (e) {
    errors.push(String(e.message ?? e));
  }
  return pass("T21", errors);
}

function t22() {
  const errors = [];
  const indexSrc = fs.readFileSync(path.join(__dirname, "index.js"), "utf8");
  for (const token of [
    "applyEvidenceFeedback",
    "EVIDENCE_FEEDBACK_PROGRAM",
    "runSp09P5EvidenceFeedbackValidation",
  ]) {
    if (!indexSrc.includes(token)) {
      errors.push(`index.js must export/expose ${token}`);
    }
  }
  if (!indexSrc.includes('from "./evidenceFeedback.js"')) {
    errors.push("index.js must re-export evidenceFeedback.js");
  }
  if (EVIDENCE_FEEDBACK_PROGRAM !== "SP09-P5") {
    errors.push("program must be SP09-P5");
  }
  return pass("T22", errors);
}

/**
 * @returns {Promise<{ passed: boolean, results: object[] }>}
 */
export async function runSp09P5EvidenceFeedbackValidation() {
  const results = [
    await t01(),
    await t02(),
    await t03(),
    await t04(),
    await t05(),
    await t06(),
    await t07(),
    await t08(),
    await t09(),
    await t10(),
    t11(),
    t12(),
    await t13(),
    await t14(),
    await t15(),
    await t16(),
    await t17(),
    await t18(),
    await t19(),
    await t20(),
    await t21(),
    t22(),
  ];
  return {
    passed: results.every((r) => r.passed),
    results,
  };
}

const isMain =
  process.argv[1] &&
  (process.argv[1].endsWith("validateSp09P5EvidenceFeedback.js") ||
    process.argv[1].includes("validateSp09P5EvidenceFeedback"));

if (isMain) {
  const result = await runSp09P5EvidenceFeedbackValidation();
  console.log("=== SP09-P5 Evidence Feedback Validation ===\n");
  console.log(JSON.stringify(result, null, 2));
  if (!result.passed) {
    console.error("\n❌ SP09-P5 validation FAILED");
    process.exit(1);
  }
  console.log("\n✅ SP09-P5 validation PASSED");
}

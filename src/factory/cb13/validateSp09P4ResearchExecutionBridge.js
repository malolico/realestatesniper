/**
 * SP09-P4 — Research Execution Bridge validation (T01–T23)
 *
 * Runnable:
 *   node src/factory/cb13/validateSp09P4ResearchExecutionBridge.js
 */

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import {
  PLANNING_DECISION_STATUS,
  RESEARCH_ACTION_ROLE,
  RESEARCH_OUTCOME_STATUS,
  RESEARCH_QUESTION_STATUS,
  RESEARCH_TASK_STATUS,
  FORBIDDEN_CAPABILITY_RESOLUTION_KEYS,
  buildPlanningDecision,
  buildResearchAction,
  buildResearchQuestion,
  validateResearchOutcome,
  validateResearchTask,
} from "./researchContracts.js";
import {
  CAPABILITY_NEED,
  CAPABILITY_RESOLUTION_STATUS,
  resolveCapabilityNeed,
} from "./capabilitySemantics.js";
import {
  RESEARCH_EXECUTION_BRIDGE_PROGRAM,
  buildDispatchArtifact,
  executeResearchBridge,
  normalizeLoopRuntimeResult,
  normalizeMotorRuntimeResult,
  normalizeSwarmMandate,
  normalizeSwarmRuntimeResult,
  validateDispatchArtifact,
} from "./researchExecutionBridge.js";
import { runSp09P1ResearchContractsValidation } from "./validateSp09P1ResearchContracts.js";
import { runSp09P2CapabilitySemanticsValidation } from "./validateSp09P2CapabilitySemantics.js";
import { runSp09P3AdaptivePlannerValidation } from "./validateSp09P3AdaptivePlanner.js";
import { runCb13Validation } from "./validateCb13.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const FACTORY_KEY = "expediente.sp09-p4.demo-001";

function pass(id, errors = []) {
  return { id, passed: errors.length === 0, errors };
}

function acceptedDecision(overrides = {}) {
  return buildPlanningDecision({
    planningDecisionId: "pd-p4-001",
    researchQuestionId: "rq-p4-001",
    researchActionId: "ra-p4-001",
    factoryKey: FACTORY_KEY,
    status: PLANNING_DECISION_STATUS.ACCEPTED,
    rationale: "accepted for P4 bridge test",
    ...overrides,
  });
}

function matchingAction(overrides = {}) {
  return buildResearchAction({
    researchActionId: "ra-p4-001",
    researchQuestionId: "rq-p4-001",
    role: RESEARCH_ACTION_ROLE.SELECTED,
    description: "selected research action",
    ...overrides,
  });
}

function baseEnvelope(overrides = {}) {
  return {
    planningDecisionId: "pd-p4-001",
    decision: acceptedDecision(),
    action: matchingAction(),
    capabilityNeed: CAPABILITY_NEED.OWNERSHIP_RECORD,
    researchTaskId: "rt-p4-001",
    researchOutcomeId: "ro-p4-001",
    ...overrides,
  };
}

function successMotorManifest() {
  return Object.freeze({
    kind: "MOTOR_RUN_MANIFEST",
    status: "SUCCESS",
    motorId: "MOT-OWN-01",
    factoryKey: FACTORY_KEY,
  });
}

function mockMotorRuntime(impl) {
  return {
    execute: async (...args) => impl(...args),
  };
}

function mockLoopRunner(impl) {
  return async (...args) => impl(...args);
}

function mockSwarmCoordinator(impl) {
  return {
    executeSwarmMission: (...args) => impl(...args),
  };
}

async function t01() {
  const errors = [];
  let called = false;
  const motorRuntime = mockMotorRuntime(async (factoryKey, capabilityRef, options) => {
    called = true;
    if (factoryKey !== FACTORY_KEY) errors.push("factoryKey mismatch on execute");
    if (capabilityRef !== "MOT-OWN-01") errors.push("capabilityRef mismatch on execute");
    if (options == null || typeof options !== "object") errors.push("options must be object");
    return successMotorManifest();
  });
  const r = await executeResearchBridge(
    baseEnvelope({
      capabilityNeed: CAPABILITY_NEED.OWNERSHIP_RECORD,
      motorRuntime,
    })
  );
  if (!called) errors.push("Motor API not invoked");
  if (r.executed !== true) errors.push("executed must be true");
  if (!r.task || validateResearchTask(r.task).ok !== true) errors.push("invalid ResearchTask");
  if (r.task?.status !== RESEARCH_TASK_STATUS.READY) errors.push("task status must be READY");
  if (r.outcome?.status !== RESEARCH_OUTCOME_STATUS.COMPLETE) {
    errors.push(`expected COMPLETE outcome, got ${r.outcome?.status}`);
  }
  if (r.family !== "MOTOR" || r.capabilityRef !== "MOT-OWN-01") {
    errors.push("family/capabilityRef mismatch");
  }
  if (r.dispatch?.executionRequested !== true) errors.push("executionRequested must be true");
  return pass("T01", errors);
}

async function t02() {
  const errors = [];
  let called = false;
  const loopRunner = mockLoopRunner(async (capabilityRef, loopCtx) => {
    called = true;
    if (capabilityRef !== "LOOP-XVR-EVD-01") errors.push("wrong loop capabilityRef");
    if (!loopCtx?.snapshot) errors.push("missing snapshot");
    return {
      loopId: "LOOP-XVR-EVD-01",
      finalizer: "FIN-R",
      sufficient: false,
      blocked: false,
    };
  });
  const r = await executeResearchBridge(
    baseEnvelope({
      capabilityNeed: CAPABILITY_NEED.EVIDENCE_SUFFICIENCY_GAP,
      researchTaskId: "rt-loop-001",
      researchOutcomeId: "ro-loop-001",
      loopRunner,
      loopCtx: { snapshot: { evidenceSufficient: false }, signals: {} },
    })
  );
  if (!called) errors.push("loopRunner not invoked");
  if (r.executed !== true) errors.push("executed must be true");
  if (r.outcome?.status !== RESEARCH_OUTCOME_STATUS.COMPLETE) {
    errors.push("insufficient evidence FIN-R must still be COMPLETE when unblocked");
  }
  return pass("T02", errors);
}

async function t03() {
  const errors = [];
  let calledWith;
  const swarmCoordinator = mockSwarmCoordinator((factoryKey, capabilityRef, mandate) => {
    calledWith = { factoryKey, capabilityRef, mandate };
    return { accepted: true, swarmId: "swarm-test" };
  });
  const rOmit = await executeResearchBridge(
    baseEnvelope({
      capabilityNeed: CAPABILITY_NEED.MULTI_DOMAIN_SUFFICIENCY,
      researchTaskId: "rt-swarm-001",
      researchOutcomeId: "ro-swarm-001",
      swarmCoordinator,
    })
  );
  if (!calledWith) errors.push("coordinator not invoked (omitted mandate)");
  if (JSON.stringify(calledWith?.mandate) !== "{}") {
    errors.push("omitted swarmMandate must normalize to {}");
  }
  if (rOmit.executed !== true) errors.push("executed must be true");
  if (rOmit.outcome?.status !== RESEARCH_OUTCOME_STATUS.COMPLETE) {
    errors.push("expected COMPLETE for accepted:true");
  }

  calledWith = null;
  const rUndef = await executeResearchBridge(
    baseEnvelope({
      capabilityNeed: CAPABILITY_NEED.MULTI_DOMAIN_SUFFICIENCY,
      researchTaskId: "rt-swarm-002",
      researchOutcomeId: "ro-swarm-002",
      swarmCoordinator,
      swarmMandate: undefined,
    })
  );
  if (JSON.stringify(calledWith?.mandate) !== "{}") {
    errors.push("undefined swarmMandate must normalize to {}");
  }
  if (rUndef.outcome?.status !== RESEARCH_OUTCOME_STATUS.COMPLETE) {
    errors.push("undefined mandate path must COMPLETE when accepted");
  }
  return pass("T03", errors);
}

async function t04() {
  const errors = [];
  let called = false;
  const r = await executeResearchBridge(
    baseEnvelope({
      decision: acceptedDecision({ status: PLANNING_DECISION_STATUS.REFUSED }),
      motorRuntime: mockMotorRuntime(async () => {
        called = true;
        return successMotorManifest();
      }),
    })
  );
  if (called) errors.push("REFUSED must not invoke Motor");
  if (r.executed !== false) errors.push("executed must be false");
  if (r.outcome != null) errors.push("must not fabricate outcome");
  return pass("T04", errors);
}

async function t05() {
  const errors = [];
  let called = false;
  const r = await executeResearchBridge(
    baseEnvelope({
      decision: acceptedDecision({ status: PLANNING_DECISION_STATUS.CONFLICT }),
      motorRuntime: mockMotorRuntime(async () => {
        called = true;
        return successMotorManifest();
      }),
    })
  );
  if (called) errors.push("CONFLICT must not invoke Motor");
  if (r.executed !== false) errors.push("executed must be false");
  return pass("T05", errors);
}

async function t06() {
  const errors = [];
  let called = false;
  const r = await executeResearchBridge(
    baseEnvelope({
      decision: acceptedDecision({ status: PLANNING_DECISION_STATUS.UNKNOWN }),
      motorRuntime: mockMotorRuntime(async () => {
        called = true;
        return successMotorManifest();
      }),
    })
  );
  if (called) errors.push("UNKNOWN must not invoke Motor");
  if (r.executed !== false) errors.push("executed must be false");
  return pass("T06", errors);
}

async function t07() {
  const errors = [];
  let called = false;
  const r = await executeResearchBridge(
    baseEnvelope({
      capabilityNeed: "not-a-mapped-need",
      motorRuntime: mockMotorRuntime(async () => {
        called = true;
        return successMotorManifest();
      }),
    })
  );
  if (called) errors.push("UNRESOLVED must not invoke family API");
  if (r.executed !== false) errors.push("executed must be false");
  if (r.task == null) errors.push("task may still be built before UNRESOLVED gate");
  const res = resolveCapabilityNeed("not-a-mapped-need");
  if (res.resolution?.status !== CAPABILITY_RESOLUTION_STATUS.UNRESOLVED) {
    errors.push("expected UNRESOLVED resolution for control");
  }
  return pass("T07", errors);
}

async function t08() {
  const errors = [];
  let called = false;
  // MATCHED need but REFUSED decision
  const r = await executeResearchBridge(
    baseEnvelope({
      capabilityNeed: CAPABILITY_NEED.OWNERSHIP_RECORD,
      decision: acceptedDecision({ status: PLANNING_DECISION_STATUS.REFUSED }),
      motorRuntime: mockMotorRuntime(async () => {
        called = true;
        return successMotorManifest();
      }),
    })
  );
  if (called) errors.push("MATCHED without ACCEPTED must not execute");
  if (r.executed !== false) errors.push("executed must be false");
  return pass("T08", errors);
}

async function t09() {
  const errors = [];
  let called = 0;
  const motor = mockMotorRuntime(async () => {
    called += 1;
    return successMotorManifest();
  });

  const cases = [
    baseEnvelope({
      planningDecisionId: "pd-OTHER",
      motorRuntime: motor,
    }),
    baseEnvelope({
      action: matchingAction({ researchActionId: "ra-OTHER" }),
      motorRuntime: motor,
    }),
    baseEnvelope({
      action: matchingAction({ researchQuestionId: "rq-OTHER" }),
      motorRuntime: motor,
    }),
  ];
  for (const envelope of cases) {
    const r = await executeResearchBridge(envelope);
    if (r.executed !== false) errors.push("mismatch must set executed=false");
    if (r.ok !== false) errors.push("mismatch must fail closed");
  }
  if (called !== 0) errors.push("identity mismatch must not invoke Motor");
  return pass("T09", errors);
}

async function t10() {
  const errors = [];
  const r = await executeResearchBridge(
    baseEnvelope({
      motorRuntime: mockMotorRuntime(async () => successMotorManifest()),
    })
  );
  if (!r.task) {
    errors.push("expected ResearchTask");
    return pass("T10", errors);
  }
  if (r.task.capabilityNeed !== CAPABILITY_NEED.OWNERSHIP_RECORD) {
    errors.push("task must carry capabilityNeed");
  }
  for (const key of FORBIDDEN_CAPABILITY_RESOLUTION_KEYS) {
    if (Object.prototype.hasOwnProperty.call(r.task, key)) {
      errors.push(`task must not have forbidden key ${key}`);
    }
  }
  if (Object.prototype.hasOwnProperty.call(r.task, "capabilityRef")) {
    errors.push("task must not have capabilityRef");
  }
  if (Object.prototype.hasOwnProperty.call(r.task, "motorId")) {
    errors.push("task must not have motorId");
  }
  return pass("T10", errors);
}

async function t11() {
  const errors = [];
  const r = await executeResearchBridge(
    baseEnvelope({
      motorRuntime: mockMotorRuntime(async () => successMotorManifest()),
    })
  );
  const resolution = resolveCapabilityNeed(CAPABILITY_NEED.OWNERSHIP_RECORD).resolution;
  if (resolution?.executionAuthorized !== false) {
    errors.push("P2 resolution must keep executionAuthorized=false");
  }
  if (r.dispatch == null) {
    errors.push("expected DispatchArtifact");
  } else {
    if (Object.prototype.hasOwnProperty.call(r.dispatch, "executionAuthorized")) {
      errors.push("DispatchArtifact must NOT contain executionAuthorized");
    }
    const v = validateDispatchArtifact(r.dispatch);
    if (!v.ok) errors.push(...v.errors);
  }
  // Mutating resolution must not affect bridge (separate artifact)
  const frozenCheck = { ...resolution, status: "HACKED" };
  if (resolution.status !== CAPABILITY_RESOLUTION_STATUS.MATCHED) {
    errors.push("original resolution must remain MATCHED");
  }
  void frozenCheck;
  return pass("T11", errors);
}

async function t12() {
  const errors = [];
  let called = false;
  const motor = mockMotorRuntime(async () => {
    called = true;
    return successMotorManifest();
  });

  const missingMotor = await executeResearchBridge(
    baseEnvelope({ capabilityNeed: CAPABILITY_NEED.OWNERSHIP_RECORD })
  );
  if (missingMotor.executed !== false) errors.push("missing motorRuntime must not execute");

  const missingLoop = await executeResearchBridge(
    baseEnvelope({
      capabilityNeed: CAPABILITY_NEED.EVIDENCE_SUFFICIENCY_GAP,
      researchTaskId: "rt-miss-loop",
      researchOutcomeId: "ro-miss-loop",
    })
  );
  if (missingLoop.executed !== false) errors.push("missing loopRunner must not execute");

  const badLoopCtx = await executeResearchBridge(
    baseEnvelope({
      capabilityNeed: CAPABILITY_NEED.EVIDENCE_SUFFICIENCY_GAP,
      researchTaskId: "rt-bad-ctx",
      researchOutcomeId: "ro-bad-ctx",
      loopRunner: mockLoopRunner(async () => {
        called = true;
        return { loopId: "LOOP-XVR-EVD-01" };
      }),
      loopCtx: { snapshot: "nope" },
    })
  );
  if (badLoopCtx.executed !== false) errors.push("invalid loopCtx must not execute");

  const nullMandate = await executeResearchBridge(
    baseEnvelope({
      capabilityNeed: CAPABILITY_NEED.MULTI_DOMAIN_SUFFICIENCY,
      researchTaskId: "rt-null-mandate",
      researchOutcomeId: "ro-null-mandate",
      swarmCoordinator: mockSwarmCoordinator(() => {
        called = true;
        return { accepted: true };
      }),
      swarmMandate: null,
    })
  );
  if (nullMandate.executed !== false) errors.push("null swarmMandate must fail closed");

  if (called) errors.push("invalid dependency/context must not invoke family API");
  void motor;
  return pass("T12", errors);
}

async function t13() {
  const errors = [];
  const r = await executeResearchBridge(
    baseEnvelope({
      motorRuntime: mockMotorRuntime(async () => {
        throw new Error("Compliance blocked: POLICY_DENY");
      }),
    })
  );
  if (r.executed !== true) errors.push("executed must be true after API invocation");
  if (r.outcome?.status !== RESEARCH_OUTCOME_STATUS.FAILED) {
    errors.push("policy throw must yield FAILED Outcome");
  }
  if (r.outcome?.isEvidence === true) errors.push("must not claim Evidence");
  if (validateResearchOutcome(r.outcome).ok !== true) {
    errors.push("FAILED outcome must still be valid ResearchOutcome");
  }
  return pass("T13", errors);
}

async function t14() {
  const errors = [];
  const decision = acceptedDecision();
  const r = await executeResearchBridge(
    baseEnvelope({
      decision,
      motorRuntime: mockMotorRuntime(async () => successMotorManifest()),
    })
  );
  if (r.task?.planningDecisionId !== decision.planningDecisionId) {
    errors.push("task.planningDecisionId chain broken");
  }
  if (r.task?.researchActionId !== decision.researchActionId) {
    errors.push("task.researchActionId chain broken");
  }
  if (r.outcome?.researchTaskId !== r.task?.researchTaskId) {
    errors.push("outcome.researchTaskId chain broken");
  }
  if (r.outcome?.factoryKey !== decision.factoryKey) {
    errors.push("factoryKey lineage broken");
  }
  if (r.dispatch?.planningDecisionId !== decision.planningDecisionId) {
    errors.push("dispatch planningDecisionId broken");
  }
  return pass("T14", errors);
}

async function t15() {
  const errors = [];
  const r = await executeResearchBridge(
    baseEnvelope({
      motorRuntime: mockMotorRuntime(async () => successMotorManifest()),
    })
  );
  const o = r.outcome;
  if (!o) {
    errors.push("missing outcome");
    return pass("T15", errors);
  }
  if (o.isEvidence !== false || o.isFact !== false || o.isTrustedEvidence !== false) {
    errors.push("outcome must deny Evidence/Fact authority");
  }
  if (o.resultIsNotEvidence !== true || o.resultIsNotFact !== true) {
    errors.push("outcome must declare RESULT ≠ EVIDENCE ≠ FACT");
  }
  if (o.evidenceAuthority !== "CB-06") errors.push("evidenceAuthority must remain CB-06");
  const src = fs.readFileSync(path.join(__dirname, "researchExecutionBridge.js"), "utf8");
  for (const token of [
    "acceptEvidence",
    "EvidenceService",
    "ingestIntelligenceEvidence",
    "evaluateFactCompleteness",
  ]) {
    if (src.includes(token)) errors.push(`bridge must not call CB06: ${token}`);
  }
  return pass("T15", errors);
}

async function t16() {
  const errors = [];
  const src = fs.readFileSync(path.join(__dirname, "researchExecutionBridge.js"), "utf8");
  for (const token of [
    "orchestrateExpediente",
    "runOlcLoopsOnExisting",
    "new MotorRuntime",
    "FFO",
    "OrchestrationBus",
  ]) {
    if (src.includes(token)) {
      errors.push(`must not absorb CB15/full orchestration: ${token}`);
    }
  }
  return pass("T16", errors);
}

async function t17() {
  const errors = [];
  const src = fs.readFileSync(path.join(__dirname, "researchExecutionBridge.js"), "utf8");
  for (const token of [
    "buildExecutionSnapshot",
    "bootstrapLoopEngine",
    "buildSwaIn",
    "LoopEngineService",
    "resolveDependencies",
  ]) {
    if (src.includes(token)) {
      errors.push(`must not copy CB11/CB12/CB04 internals: ${token}`);
    }
  }
  return pass("T17", errors);
}

async function t18() {
  const errors = [];
  const src = fs.readFileSync(path.join(__dirname, "researchExecutionBridge.js"), "utf8");
  for (const token of [
    "stateDelta",
    "evidenceFeedback",
    "promoteFact",
    "applyResearchResult",
    "cb13State",
  ]) {
    if (src.includes(token)) errors.push(`P5 surface forbidden: ${token}`);
  }
  const r = await executeResearchBridge(
    baseEnvelope({
      motorRuntime: mockMotorRuntime(async () => successMotorManifest()),
    })
  );
  if (r.stateDelta != null || r.evidence != null || r.fact != null) {
    errors.push("result must not emit Evidence feedback / state delta");
  }
  return pass("T18", errors);
}

async function t19() {
  const errors = [];
  const src = fs.readFileSync(path.join(__dirname, "researchExecutionBridge.js"), "utf8");
  for (const token of ["planAdaptiveResearch", "replan", "boundedReplan", "retryPlanning"]) {
    if (src.includes(token)) errors.push(`P6 surface forbidden: ${token}`);
  }
  return pass("T19", errors);
}

async function t20() {
  const errors = [];
  const p1 = runSp09P1ResearchContractsValidation();
  if (!p1.passed) {
    errors.push(
      `P1 failed: ${p1.results.filter((x) => !x.passed).map((x) => x.id).join(",")}`
    );
  }
  return pass("T20", errors);
}

async function t21() {
  const errors = [];
  const p2 = await runSp09P2CapabilitySemanticsValidation();
  if (!p2.passed) {
    errors.push(
      `P2 failed: ${p2.results.filter((x) => !x.passed).map((x) => x.id).join(",")}`
    );
  }
  return pass("T21", errors);
}

async function t22() {
  const errors = [];
  const p3 = await runSp09P3AdaptivePlannerValidation();
  if (!p3.passed) {
    errors.push(
      `P3 failed: ${p3.results.filter((x) => !x.passed).map((x) => x.id).join(",")}`
    );
  }
  return pass("T22", errors);
}

async function t23() {
  const errors = [];
  try {
    const result = await runCb13Validation({});
    if (!result.passed) {
      errors.push(`CB13 regression failed: ${(result.errors ?? []).join("; ")}`);
    }
  } catch (e) {
    errors.push(String(e.message ?? e));
  }

  // Corrected normalization proofs (explicit)
  if (normalizeMotorRuntimeResult({ foo: 1 }, false) !== RESEARCH_OUTCOME_STATUS.UNKNOWN) {
    errors.push("arbitrary Motor object must be UNKNOWN");
  }
  if (
    normalizeMotorRuntimeResult({ kind: "MOTOR_RUN_MANIFEST", status: "FAILED" }, false) !==
    RESEARCH_OUTCOME_STATUS.UNKNOWN
  ) {
    errors.push("non-SUCCESS Motor manifest must be UNKNOWN");
  }
  if (
    normalizeMotorRuntimeResult({ kind: "OTHER", status: "SUCCESS" }, false) !==
    RESEARCH_OUTCOME_STATUS.UNKNOWN
  ) {
    errors.push("wrong Motor kind must be UNKNOWN");
  }
  if (
    normalizeLoopRuntimeResult(
      { loopId: "LOOP-XVR-EVD-01", blocked: true },
      "LOOP-XVR-EVD-01",
      false
    ) !== RESEARCH_OUTCOME_STATUS.FAILED
  ) {
    errors.push("Loop blocked:true must be FAILED");
  }
  if (
    normalizeLoopRuntimeResult({ blocked: false }, "LOOP-XVR-EVD-01", false) !==
    RESEARCH_OUTCOME_STATUS.UNKNOWN
  ) {
    errors.push("missing loopId must be UNKNOWN");
  }
  if (
    normalizeLoopRuntimeResult(
      { loopId: "LOOP-OTHER", blocked: false },
      "LOOP-XVR-EVD-01",
      false
    ) !== RESEARCH_OUTCOME_STATUS.UNKNOWN
  ) {
    errors.push("wrong loopId must be UNKNOWN");
  }
  if (normalizeSwarmRuntimeResult({ accepted: false }, false) !== RESEARCH_OUTCOME_STATUS.FAILED) {
    errors.push("Swarm accepted:false must be FAILED");
  }
  const m1 = normalizeSwarmMandate(undefined, false);
  const m2 = normalizeSwarmMandate(undefined, true);
  if (!m1.ok || JSON.stringify(m1.mandate) !== "{}") {
    errors.push("omitted mandate must be {}");
  }
  if (!m2.ok || JSON.stringify(m2.mandate) !== "{}") {
    errors.push("undefined mandate must be {}");
  }
  const d = buildDispatchArtifact({
    researchTaskId: "rt",
    planningDecisionId: "pd",
    researchActionId: "ra",
    factoryKey: FACTORY_KEY,
    capabilityNeed: CAPABILITY_NEED.OWNERSHIP_RECORD,
    family: "MOTOR",
    capabilityRef: "MOT-OWN-01",
    executionRequested: true,
  });
  if (Object.prototype.hasOwnProperty.call(d, "executionAuthorized")) {
    errors.push("DispatchArtifact must not contain executionAuthorized");
  }

  // Index/export smoke (source-level to avoid circular import with index.js)
  const indexSrc = fs.readFileSync(path.join(__dirname, "index.js"), "utf8");
  for (const token of [
    "executeResearchBridge",
    "RESEARCH_EXECUTION_BRIDGE_PROGRAM",
    "runSp09P4ResearchExecutionBridgeValidation",
    "buildDispatchArtifact",
  ]) {
    if (!indexSrc.includes(token)) {
      errors.push(`index.js must export/expose ${token}`);
    }
  }
  if (!indexSrc.includes('from "./researchExecutionBridge.js"')) {
    errors.push("index.js must re-export researchExecutionBridge.js");
  }
  void RESEARCH_EXECUTION_BRIDGE_PROGRAM;

  // Question builder smoke (unused path must remain available for lineage)
  void buildResearchQuestion({
    researchQuestionId: "rq-smoke",
    factoryKey: FACTORY_KEY,
    question: "smoke",
    status: RESEARCH_QUESTION_STATUS.OPEN,
  });

  return pass("T23", errors);
}

/**
 * @returns {Promise<{ passed: boolean, results: object[] }>}
 */
export async function runSp09P4ResearchExecutionBridgeValidation() {
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
    await t11(),
    await t12(),
    await t13(),
    await t14(),
    await t15(),
    await t16(),
    await t17(),
    await t18(),
    await t19(),
    await t20(),
    await t21(),
    await t22(),
    await t23(),
  ];
  return {
    passed: results.every((r) => r.passed),
    results,
  };
}

const isMain =
  process.argv[1] &&
  (process.argv[1].endsWith("validateSp09P4ResearchExecutionBridge.js") ||
    process.argv[1].includes("validateSp09P4ResearchExecutionBridge"));

if (isMain) {
  const result = await runSp09P4ResearchExecutionBridgeValidation();
  console.log("=== SP09-P4 Research Execution Bridge Validation ===\n");
  console.log(JSON.stringify(result, null, 2));
  if (!result.passed) {
    console.error("\n❌ SP09-P4 validation FAILED");
    process.exit(1);
  }
  console.log("\n✅ SP09-P4 validation PASSED");
}

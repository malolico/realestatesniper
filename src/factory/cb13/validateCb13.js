/**
 * CB-13 validation — Intelligence / Readiness acceptance tests.
 */

import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import {
  assertPhaseUnlocked,
  isPhaseApproved,
  markPhaseComplete,
} from "../cb00/constructionGovernance.js";
import { CHECKLIST_STATUS } from "../cb00/canonComplianceChecklist.js";
import { FileElrStore } from "../cb01/fileElrStore.js";
import { FactoryRegistry } from "../cb01/factoryRegistry.js";
import { ComplianceGateService } from "../cb03/complianceGateService.js";
import { ComplianceStateStore } from "../cb03/complianceStateStore.js";
import { MotorLockRegistry } from "../cb03/motorLockRegistry.js";
import { MotorExecutionLock } from "../cb04/motorExecutionLock.js";
import { MotorRuntime } from "../cb04/motorRuntime.js";
import { FoundationKnowledgeStore } from "../cb05/foundationKnowledgeStore.js";
import { FoundationLayerService } from "../cb05/foundationLayerService.js";
import { EvidenceService } from "../cb06/evidenceService.js";
import { EvidenceRegistryStore } from "../cb06/evidenceRegistryStore.js";
import { SUFFICIENCY_STATUS } from "../cb06/sufficiencyGate.js";
import { LegitimacyKnowledgeStore } from "../cb07/legitimacyKnowledgeStore.js";
import { LegitimacyLayerService } from "../cb07/legitimacyLayerService.js";
import { DistressKnowledgeStore } from "../cb08/distressKnowledgeStore.js";
import { DistressLayerService } from "../cb08/distressLayerService.js";
import { EconomyKnowledgeStore } from "../cb09/economyKnowledgeStore.js";
import { EconomyLayerService } from "../cb09/economyLayerService.js";
import { EnvironmentKnowledgeStore } from "../cb10/environmentKnowledgeStore.js";
import { EnvironmentLayerService } from "../cb10/environmentLayerService.js";
import { LoopEngineService } from "../cb11/loopEngineService.js";
import { SwarmCoordinatorService } from "../cb12/swarmCoordinatorService.js";
import {
  INTELLIGENCE_LOOPS,
  INTELLIGENCE_MOTORS,
  READINESS_GATE_COUNT,
  OMC_MOTOR_COUNT_CONSTITUTIONAL,
} from "./intelligenceCatalog.js";
import { IntelligenceKnowledgeStore } from "./intelligenceKnowledgeStore.js";
import { IntelligenceLayerService } from "./intelligenceLayerService.js";
import { evaluateAllReadinessGates } from "./readinessGates.js";
import { routeSufficiencyGap } from "./sufficiencyGapRouter.js";
import { isDecisionHandoffEnabled } from "./decisionHandoffPrep.js";

function createTempEnv() {
  const base = fs.mkdtempSync(path.join(os.tmpdir(), "cb13-validation-"));
  return {
    base,
    registryDir: path.join(base, "registry"),
    complianceDir: path.join(base, "compliance"),
    foundationDir: path.join(base, "foundation"),
    evidenceDir: path.join(base, "evidence"),
    legitimacyDir: path.join(base, "legitimacy"),
    distressDir: path.join(base, "distress"),
    economyDir: path.join(base, "economy"),
    environmentDir: path.join(base, "environment"),
    intelligenceDir: path.join(base, "intelligence"),
  };
}

function createIntelligenceStack(env) {
  const store = new FileElrStore(env.registryDir);
  const registry = new FactoryRegistry({ store });
  const compliance = new ComplianceGateService({
    registry,
    stateStore: new ComplianceStateStore(env.complianceDir),
    lockRegistry: new MotorLockRegistry(),
  });
  const foundationKnowledgeStore = new FoundationKnowledgeStore(env.foundationDir);
  const legitimacyKnowledgeStore = new LegitimacyKnowledgeStore(env.legitimacyDir);
  const distressKnowledgeStore = new DistressKnowledgeStore(env.distressDir);
  const economyKnowledgeStore = new EconomyKnowledgeStore(env.economyDir);
  const environmentKnowledgeStore = new EnvironmentKnowledgeStore(env.environmentDir);
  const intelligenceKnowledgeStore = new IntelligenceKnowledgeStore(env.intelligenceDir);
  const runtime = new MotorRuntime({
    registry,
    compliance,
    executionLock: new MotorExecutionLock(),
  });
  const evidence = new EvidenceService({
    registry,
    compliance,
    foundationKnowledgeStore,
    runtime,
    evidenceStore: new EvidenceRegistryStore(env.evidenceDir),
  });
  const foundation = new FoundationLayerService({
    registry,
    compliance,
    knowledgeStore: foundationKnowledgeStore,
    runtime,
  });
  const legitimacy = new LegitimacyLayerService({
    registry,
    compliance,
    knowledgeStore: legitimacyKnowledgeStore,
    evidenceService: evidence,
    runtime,
  });
  const distress = new DistressLayerService({
    registry,
    compliance,
    knowledgeStore: distressKnowledgeStore,
    evidenceService: evidence,
    runtime,
  });
  const economy = new EconomyLayerService({
    registry,
    compliance,
    knowledgeStore: economyKnowledgeStore,
    evidenceService: evidence,
    runtime,
  });
  const environment = new EnvironmentLayerService({
    registry,
    compliance,
    knowledgeStore: environmentKnowledgeStore,
    evidenceService: evidence,
    runtime,
  });
  const loopEngine = new LoopEngineService({
    registry,
    compliance,
    evidenceService: evidence,
    runtime,
    foundation,
    legitimacy,
    distress,
    economy,
    environment,
  });
  const swarmCoordinator = new SwarmCoordinatorService({
    registry,
    compliance,
    evidenceService: evidence,
    loopEngine,
  });
  const intelligence = new IntelligenceLayerService({
    registry,
    compliance,
    knowledgeStore: intelligenceKnowledgeStore,
    evidenceService: evidence,
    runtime,
    foundation,
    legitimacy,
    distress,
    economy,
    environment,
    swarmCoordinator,
  });
  return { registry, evidence, intelligence };
}

export function validateCb13Governance() {
  const errors = [];
  try {
    assertPhaseUnlocked("CB-13");
  } catch (err) {
    errors.push(err.message);
  }
  if (!isPhaseApproved("CB-12")) {
    errors.push("CB-12 is not APPROVED");
  }
  return { errors };
}

export function validateIntelligenceCatalog() {
  const errors = [];
  if (INTELLIGENCE_MOTORS.length !== 5) {
    errors.push(`Expected 5 INT motors, got ${INTELLIGENCE_MOTORS.length}`);
  }
  if (INTELLIGENCE_LOOPS.length !== 5) {
    errors.push(`Expected 5 INT loops, got ${INTELLIGENCE_LOOPS.length}`);
  }
  if (READINESS_GATE_COUNT !== 7) {
    errors.push(`Expected 7 readiness gates G0-G6, got ${READINESS_GATE_COUNT}`);
  }
  return { errors };
}

export async function validateReadinessGatesG0G6() {
  const errors = [];
  const env = createTempEnv();
  try {
    const { intelligence } = createIntelligenceStack(env);
    const result = await intelligence.bootstrapIntelligence("cb13-gates-test", {
      candidateRef: "cb13-gates-test",
      parcelId: "int-gates-001",
    });

    if (!result.gateEvaluation.allPass) {
      errors.push(`G0-G6 not all PASS: ${result.gateEvaluation.passCount}/7`);
    }
    if (result.gateEvaluation.gates.length !== 7) {
      errors.push("Gate evaluation should include 7 gates");
    }
    if (result.syn02ReadinessPass !== true) {
      errors.push("MOT-SYN-02 should PASS readiness");
    }

    const record = intelligence.registry.getExpediente(result.factoryKey);
    const evalEntry = (record.elr.motor_manifests ?? []).find(
      (m) => m.kind === "EVF_READINESS_GATE_EVAL"
    );
    if (!evalEntry || evalEntry.allPass !== true) {
      errors.push("EVF_READINESS_GATE_EVAL missing or incomplete");
    }
  } catch (err) {
    errors.push(err.message);
  } finally {
    fs.rmSync(env.base, { recursive: true, force: true });
  }
  return { errors };
}

export async function validateSyn01NoEElevation() {
  const errors = [];
  const env = createTempEnv();
  try {
    const { intelligence } = createIntelligenceStack(env);
    const result = await intelligence.bootstrapIntelligence("cb13-syn01-test", {
      parcelId: "int-syn01-001",
    });

    if (result.syn01ElevatedE !== true) {
      errors.push("MOT-SYN-01 should not elevate E level (EVF pipeline)");
    }

    const syn01 = result.manifests.find((m) => m.motorId === "MOT-SYN-01");
    if (syn01?.outputs?.eLevel !== "E2") {
      errors.push("MOT-SYN-01 should converge at E2 ceiling");
    }
    if (syn01?.outputs?.evidenceElevated === true) {
      errors.push("MOT-SYN-01 must not elevate evidence");
    }
  } catch (err) {
    errors.push(err.message);
  } finally {
    fs.rmSync(env.base, { recursive: true, force: true });
  }
  return { errors };
}

export async function validateDecisionHandoffPrep() {
  const errors = [];
  const env = createTempEnv();
  try {
    const { intelligence } = createIntelligenceStack(env);
    const result = await intelligence.bootstrapIntelligence("cb13-handoff-test", {
      parcelId: "int-handoff-001",
    });

    if (!result.cb16HandoffEnabled) {
      errors.push("LOOP-INT-RDY-01 FIN-S should enable CB-16 handoff prep");
    }

    const record = intelligence.registry.getExpediente(result.factoryKey);
    if (!isDecisionHandoffEnabled(record.elr)) {
      errors.push("DECISION_HANDOFF_PREP_CB16 not recorded");
    }

    const rdyLoop = (record.elr.loop_ledger_refs ?? []).find(
      (r) => r.kind === "LOOP_INT_RDY_01_RUN"
    );
    if (!rdyLoop || rdyLoop.finalizer !== "FIN-S") {
      errors.push("LOOP-INT-RDY-01 should finalize FIN-S");
    }
  } catch (err) {
    errors.push(err.message);
  } finally {
    fs.rmSync(env.base, { recursive: true, force: true });
  }
  return { errors };
}

export async function validateStConsToStRdy() {
  const errors = [];
  const env = createTempEnv();
  try {
    const { intelligence } = createIntelligenceStack(env);
    const result = await intelligence.bootstrapIntelligence("cb13-state-test", {
      parcelId: "int-state-001",
    });

    if (result.state !== "ST-RDY") {
      errors.push(`Expected ST-RDY, got ${result.state}`);
    }

    const record = intelligence.registry.getExpediente(result.factoryKey);
    const transitions = record.elr.state_transitions ?? [];
    const consToRdy = transitions.some((t) => t.from === "ST-CONS" && t.to === "ST-RDY");
    if (!consToRdy) {
      errors.push("ST-CONS → ST-RDY transition not found in ELR");
    }
  } catch (err) {
    errors.push(err.message);
  } finally {
    fs.rmSync(env.base, { recursive: true, force: true });
  }
  return { errors };
}

export function validateSufficiencyGapRouting() {
  const errors = [];
  const swarm = routeSufficiencyGap({ evidenceSufficient: false, multiDomainGap: true });
  if (swarm.action !== "DERIVE_SWARM" || !swarm.target?.includes("SWM-SUF-01")) {
    errors.push("Multi-domain sufficiency gap should derive SWM-SUF-01");
  }
  const xvr = routeSufficiencyGap({ evidenceSufficient: false, openConflicts: 0 });
  if (xvr.action !== "DERIVE_EVIDENCE" || !xvr.target?.includes("XVR-EVD")) {
    errors.push("Single-domain sufficiency gap should derive LOOP-XVR-EVD-01");
  }
  return { errors };
}

export function validateReadinessGatesReproducible() {
  const errors = [];
  const ctx = {
    clearance: "PASS",
    keyConfidence: "C2",
    blockers: [],
    blockersDocumented: true,
    sufficiencyStatus: SUFFICIENCY_STATUS.PASS,
    syn02Readiness: true,
    knownUnknowns: [{ obligation: "Obl", declared: true }],
    icPathComplete: true,
  };
  const a = evaluateAllReadinessGates(ctx);
  const b = evaluateAllReadinessGates(ctx);
  if (a.allPass !== b.allPass || a.passCount !== b.passCount) {
    errors.push("G0-G6 evaluation not reproducible");
  }
  if (!a.allPass) {
    errors.push("Synthetic gate context should produce allPass");
  }
  return { errors };
}

export function validateOmcRisksDocumented() {
  const errors = [];
  if (OMC_MOTOR_COUNT_CONSTITUTIONAL !== 52) {
    errors.push("Constitutional OMC count should remain 52");
  }
  return { errors, reconciliationDeferred: true };
}

/**
 * @param {{ markComplete?: boolean, approvedBy?: string }} [options]
 */
export async function runCb13Validation(options = {}) {
  const gov = validateCb13Governance();
  const catalog = validateIntelligenceCatalog();
  const gates = await validateReadinessGatesG0G6();
  const syn01 = await validateSyn01NoEElevation();
  const handoff = await validateDecisionHandoffPrep();
  const state = await validateStConsToStRdy();
  const gaps = validateSufficiencyGapRouting();
  const reproducible = validateReadinessGatesReproducible();
  const risks = validateOmcRisksDocumented();

  const allErrors = [
    ...gov.errors,
    ...catalog.errors,
    ...gates.errors,
    ...syn01.errors,
    ...handoff.errors,
    ...state.errors,
    ...gaps.errors,
    ...reproducible.errors,
    ...risks.errors,
  ];

  const checklist = [
    {
      id: "CB13-01",
      criterion: "MOT-SYN-02 PASS reproduce gates G0–G6",
      status: gates.errors.length === 0 ? CHECKLIST_STATUS.PASS : CHECKLIST_STATUS.PENDING,
    },
    {
      id: "CB13-02",
      criterion: "MOT-SYN-01 integra sin elevar E (EVF pipeline)",
      status: syn01.errors.length === 0 ? CHECKLIST_STATUS.PASS : CHECKLIST_STATUS.PENDING,
    },
    {
      id: "CB13-03",
      criterion: "LOOP-INT-RDY-01 FIN-S habilita handoff CB-16",
      status: handoff.errors.length === 0 ? CHECKLIST_STATUS.PASS : CHECKLIST_STATUS.PENDING,
    },
    {
      id: "CB13-04",
      criterion: "Known unknowns Obl. declarados (DKN / G5)",
      status: gates.errors.length === 0 ? CHECKLIST_STATUS.PASS : CHECKLIST_STATUS.PENDING,
    },
    {
      id: "CB13-05",
      criterion: "ST-CONS → ST-RDY transición verificada en ELR",
      status: state.errors.length === 0 ? CHECKLIST_STATUS.PASS : CHECKLIST_STATUS.PENDING,
    },
    {
      id: "CB13-06",
      criterion: "Sufficiency gaps derivan XVR-EVD / SWM-SUF-01",
      status: gaps.errors.length === 0 ? CHECKLIST_STATUS.PASS : CHECKLIST_STATUS.PENDING,
    },
  ];

  const passed = allErrors.length === 0 && checklist.every((i) => i.status === CHECKLIST_STATUS.PASS);

  let phaseRecord = null;
  if (passed && options.markComplete) {
    phaseRecord = markPhaseComplete("CB-13", {
      validationReport: "runCb13IntelligenceValidation",
      approvedBy: options.approvedBy ?? null,
      pendingDirectorApproval: !options.approvedBy,
    });
  }

  return {
    phase: "CB-13",
    passed,
    errors: allErrors,
    checklist,
    omcMotorCountRisk: {
      constitutional: OMC_MOTOR_COUNT_CONSTITUTIONAL,
      reconciliationDeferred: risks.reconciliationDeferred,
    },
    phaseRecord,
    cb14Unlocked: passed ? isPhaseApproved("CB-13") : false,
  };
}

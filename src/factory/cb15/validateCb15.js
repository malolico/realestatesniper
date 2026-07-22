/**
 * CB-15 validation — Orchestration Bus FFO acceptance tests.
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
import { IntelligenceKnowledgeStore } from "../cb13/intelligenceKnowledgeStore.js";
import { IntelligenceLayerService } from "../cb13/intelligenceLayerService.js";
import { AiaInvocationGateway } from "../cb14/aiaInvocationGateway.js";
import { AiAssistLayerService } from "../cb14/aiAssistLayerService.js";
import {
  FFO_CONSTITUTIONAL_LAWS,
  FFO_LAYER_PIPELINE,
  OMC_MOTOR_COUNT_CONSTITUTIONAL,
  ORCHESTRATION_BUS_ACTOR,
  P_CONST_PIPELINE,
} from "./ffoCatalog.js";
import { resolvePConstConflict } from "./pConstArbiter.js";
import { assertFactoryBoundary, isBlockedFactoryOperation } from "./factoryBoundaryGuard.js";
import {
  FACTORY_LIFECYCLE_PATH,
  validateSixteenStateMachine,
  validateTransitionPath,
} from "./stateOrchestrator.js";
import { calculateMaturityScore } from "./maturityScore.js";
import { OrchestrationBusService } from "./orchestrationBusService.js";

function createTempEnv() {
  const base = fs.mkdtempSync(path.join(os.tmpdir(), "cb15-validation-"));
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

function createOrchestrationStack(env) {
  const store = new FileElrStore(env.registryDir);
  const registry = new FactoryRegistry({ store });
  const compliance = new ComplianceGateService({
    registry,
    stateStore: new ComplianceStateStore(env.complianceDir),
    lockRegistry: new MotorLockRegistry(),
  });
  const foundationKnowledgeStore = new FoundationKnowledgeStore(env.foundationDir);
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
    knowledgeStore: new LegitimacyKnowledgeStore(env.legitimacyDir),
    evidenceService: evidence,
    runtime,
  });
  const distress = new DistressLayerService({
    registry,
    compliance,
    knowledgeStore: new DistressKnowledgeStore(env.distressDir),
    evidenceService: evidence,
    runtime,
  });
  const economy = new EconomyLayerService({
    registry,
    compliance,
    knowledgeStore: new EconomyKnowledgeStore(env.economyDir),
    evidenceService: evidence,
    runtime,
  });
  const environment = new EnvironmentLayerService({
    registry,
    compliance,
    knowledgeStore: new EnvironmentKnowledgeStore(env.environmentDir),
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
    knowledgeStore: new IntelligenceKnowledgeStore(env.intelligenceDir),
    evidenceService: evidence,
    runtime,
    foundation,
    legitimacy,
    distress,
    economy,
    environment,
    loopEngine,
    swarmCoordinator,
  });
  const gateway = new AiaInvocationGateway({ registry, compliance });
  const aiAssist = new AiAssistLayerService({
    registry,
    compliance,
    evidenceService: evidence,
    runtime,
    intelligence,
    gateway,
  });
  const bus = new OrchestrationBusService({
    registry,
    compliance,
    evidenceService: evidence,
    runtime,
    aiAssist,
    loopEngine,
    swarmCoordinator,
  });
  return { registry, compliance, evidence, bus };
}

export function validateCb15Governance() {
  const errors = [];
  try {
    assertPhaseUnlocked("CB-15");
  } catch (err) {
    errors.push(err.message);
  }
  if (!isPhaseApproved("CB-14")) {
    errors.push("CB-14 is not APPROVED");
  }
  return { errors };
}

export function validateFfoCatalog() {
  const errors = [];
  if (P_CONST_PIPELINE.length !== 10) {
    errors.push(`Expected 10 P-CONST phases, got ${P_CONST_PIPELINE.length}`);
  }
  if (FFO_LAYER_PIPELINE.length !== 6) {
    errors.push(`Expected 6 FFO layers A→F, got ${FFO_LAYER_PIPELINE.length}`);
  }
  if (FFO_CONSTITUTIONAL_LAWS.length !== 16) {
    errors.push(`Expected 16 FFO laws, got ${FFO_CONSTITUTIONAL_LAWS.length}`);
  }
  return { errors };
}

export function validatePConstArbiter() {
  const errors = [];
  const result = resolvePConstConflict([
    { code: "P7", resource: "readiness" },
    { code: "P0", resource: "compliance" },
  ]);
  if (result.winner?.code !== "P0") {
    errors.push("P-CONST arbiter should prioritize P0 over P7");
  }
  return { errors };
}

export function validateFactoryBoundaryGuard() {
  const errors = [];
  const blocked = ["publish_deal", "assign_access_tier", "marketplace_listing"];
  for (const op of blocked) {
    if (!isBlockedFactoryOperation(op)) {
      errors.push(`Operation ${op} should be blocked`);
    }
  }
  try {
    assertFactoryBoundary("orchestrate_expediente");
  } catch (err) {
    errors.push(`orchestrate_expediente should be allowed: ${err.message}`);
  }
  return { errors };
}

export function validateSixteenStates() {
  const errors = [];
  const machine = validateSixteenStateMachine();
  if (!machine.valid) errors.push(...machine.errors);
  const pathResult = validateTransitionPath(FACTORY_LIFECYCLE_PATH);
  if (!pathResult.valid) errors.push(...pathResult.errors);
  return { errors };
}

export function validateMaturityScoreFormula() {
  const errors = [];
  const score = calculateMaturityScore({
    mpiCoveragePercent: 0.8,
    sufficiencyStatus: "PASS",
    readinessGatesPass: true,
    identityConfidence: "C2",
    state: "ST-RDY",
  });
  if (typeof score.maturity_score !== "number" || score.maturity_score < 0 || score.maturity_score > 1) {
    errors.push("maturity_score must be a number in [0,1]");
  }
  return { errors };
}

export function validateCatalogActorOnBus() {
  const errors = [];
  const env = createTempEnv();
  try {
    const { bus } = createOrchestrationStack(env);
    const result = bus.assertCatalogActor(ORCHESTRATION_BUS_ACTOR);
    if (!result.valid) errors.push("MOT-SYN-02 should be a valid catalog actor");
    try {
      bus.assertCatalogActor("OUT-OF-CATALOG-99");
      errors.push("Out-of-catalog actor should be rejected");
    } catch {
      // expected
    }
  } catch (err) {
    errors.push(err.message);
  } finally {
    fs.rmSync(env.base, { recursive: true, force: true });
  }
  return { errors };
}

export async function validatePilotOrchestration() {
  const errors = [];
  const env = createTempEnv();
  try {
    const { bus } = createOrchestrationStack(env);
    const result = await bus.orchestrateExpediente("cb15-pilot", {
      candidateRef: "cb15-pilot",
      parcelId: "ffo-pilot-001",
      runLoopEngine: true,
      runSwarm: false,
    });

    if (!result.factoryKey) errors.push("orchestrateExpediente should return factoryKey");
    if (!result.maturity?.maturity_score && result.maturity?.maturity_score !== 0) {
      errors.push("maturity_score missing from orchestration result");
    }
    if (!result.lifecycleValid?.valid) {
      errors.push("Factory lifecycle path should be valid");
    }
    if (!result.boundary?.factoryOnly) {
      errors.push("Factory boundary should be enforced");
    }
    if (!result.aiAssist?.summary?.accepted) {
      errors.push("AI Assist layer should complete via bus");
    }
    if (!result.loopEngine?.loopCount) {
      errors.push("Loop Engine should run via bus");
    }
    if (result.pConstConflict?.winner?.code !== "P0") {
      errors.push("P-CONST conflict winner should be P0");
    }
  } catch (err) {
    errors.push(err.message);
  } finally {
    fs.rmSync(env.base, { recursive: true, force: true });
  }
  return { errors };
}

export async function validateElrFfoEvents() {
  const errors = [];
  const env = createTempEnv();
  try {
    const { bus } = createOrchestrationStack(env);
    const result = await bus.orchestrateExpediente("cb15-elr-test", {
      parcelId: "ffo-elr-001",
      runLoopEngine: false,
    });
    const lineage = bus.getOrchestrationLineage(result.factoryKey);
    const kinds = lineage.events.map((e) => e.kind);
    const required = [
      "FFO_ORCHESTRATION_EVENT",
      "FFO_ELR_AGGREGATION",
      "FFO_ANTI_DEGRADATION_SCHEDULE",
      "FFO_ORCHESTRATION_COMPLETE",
    ];
    for (const kind of required) {
      if (!kinds.includes(kind)) errors.push(`Missing ELR event kind: ${kind}`);
    }
    if (!lineage.aggregation?.sections) {
      errors.push("ELR aggregation snapshot missing");
    }
  } catch (err) {
    errors.push(err.message);
  } finally {
    fs.rmSync(env.base, { recursive: true, force: true });
  }
  return { errors };
}

export function validateOmcRisksDocumented() {
  const errors = [];
  if (OMC_MOTOR_COUNT_CONSTITUTIONAL !== 52) {
    errors.push("Constitutional OMC count should remain 52");
  }
  return {
    errors,
    reconciliationDeferred: true,
    motLienDeferred: true,
    syntheticFixturesOnly: true,
    actVStub: true,
  };
}

/**
 * @param {{ markComplete?: boolean, approvedBy?: string }} [options]
 */
export async function runCb15Validation(options = {}) {
  const gov = validateCb15Governance();
  const catalog = validateFfoCatalog();
  const pConst = validatePConstArbiter();
  const boundary = validateFactoryBoundaryGuard();
  const states = validateSixteenStates();
  const maturity = validateMaturityScoreFormula();
  const catalogActor = validateCatalogActorOnBus();
  const pilot = await validatePilotOrchestration();
  const elr = await validateElrFfoEvents();
  const risks = validateOmcRisksDocumented();

  const allErrors = [
    ...gov.errors,
    ...catalog.errors,
    ...pConst.errors,
    ...boundary.errors,
    ...states.errors,
    ...maturity.errors,
    ...catalogActor.errors,
    ...pilot.errors,
    ...elr.errors,
    ...risks.errors,
  ];

  const checklist = [
    {
      id: "CB15-01",
      criterion: "Pipeline CB-03→CB-14 ejecutable en expediente piloto",
      status: pilot.errors.length === 0 ? CHECKLIST_STATUS.PASS : CHECKLIST_STATUS.PENDING,
    },
    {
      id: "CB15-02",
      criterion: "P-CONST respetado bajo conflicto de recursos (P0 gana)",
      status: pConst.errors.length === 0 ? CHECKLIST_STATUS.PASS : CHECKLIST_STATUS.PENDING,
    },
    {
      id: "CB15-03",
      criterion: "16 ST-* transitables + lifecycle path ST-NASC→ST-RDY",
      status: states.errors.length === 0 ? CHECKLIST_STATUS.PASS : CHECKLIST_STATUS.PENDING,
    },
    {
      id: "CB15-04",
      criterion: "Factory separada — sin Decision/Projection/Marketplace",
      status: boundary.errors.length === 0 ? CHECKLIST_STATUS.PASS : CHECKLIST_STATUS.PENDING,
    },
    {
      id: "CB15-05",
      criterion: "Eventos FFO registrados en ELR (loop_ledger_refs)",
      status: elr.errors.length === 0 ? CHECKLIST_STATUS.PASS : CHECKLIST_STATUS.PENDING,
    },
    {
      id: "CB15-06",
      criterion: "maturity_score calculable por expediente (LFF-12)",
      status:
        maturity.errors.length === 0 && pilot.errors.length === 0
          ? CHECKLIST_STATUS.PASS
          : CHECKLIST_STATUS.PENDING,
    },
  ];

  const passed = allErrors.length === 0 && checklist.every((i) => i.status === CHECKLIST_STATUS.PASS);

  let phaseRecord = null;
  if (passed && options.markComplete) {
    phaseRecord = markPhaseComplete("CB-15", {
      validationReport: "runCb15OrchestrationValidation",
      approvedBy: options.approvedBy ?? null,
      pendingDirectorApproval: !options.approvedBy,
    });
  }

  return {
    phase: "CB-15",
    passed,
    errors: allErrors,
    checklist,
    busActor: ORCHESTRATION_BUS_ACTOR,
    omcMotorCountRisk: {
      constitutional: OMC_MOTOR_COUNT_CONSTITUTIONAL,
      reconciliationDeferred: risks.reconciliationDeferred,
    },
    deferredRisks: {
      motLien01: risks.motLienDeferred,
      syntheticFixtures: risks.syntheticFixturesOnly,
      actVStub: risks.actVStub,
      cb16NotStarted: true,
    },
    phaseRecord,
    cb16Unlocked: passed ? isPhaseApproved("CB-15") : false,
  };
}

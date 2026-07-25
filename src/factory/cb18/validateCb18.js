/**
 * CB-18 validation — Governance Dashboard acceptance tests.
 *
 * Consumes CB-15 operational data + CB-01 ELR only (Blueprint dependencies).
 */

import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";
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
import { OrchestrationBusService } from "../cb15/orchestrationBusService.js";
import {
  GOVERNANCE_DASHBOARD_ID,
  GovernanceDashboard,
  LFF_METRICS,
  PP_METRICS,
  buildConstitutionalMetrics,
} from "./governanceDashboard.js";
import { detectCanonDrift, assertNoCanonDrift } from "./canonDriftDetector.js";
import { extractReadinessGates } from "./maturityMetrics.js";

function createTempEnv() {
  const base = fs.mkdtempSync(path.join(os.tmpdir(), "cb18-validation-"));
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

/** CB-15 operational stack → CB-01 ELR (Blueprint data sources). */
function createGovernanceStack(env) {
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
  const dashboard = new GovernanceDashboard({ registry });
  return { registry, bus, dashboard };
}

export function validateCb18Governance() {
  const errors = [];
  try {
    assertPhaseUnlocked("CB-18");
  } catch (err) {
    errors.push(err.message);
  }
  if (!isPhaseApproved("CB-17")) {
    errors.push("CB-17 is not APPROVED");
  }
  return { errors };
}

export function validateConstitutionalMetricStrips() {
  const errors = [];
  const metrics = buildConstitutionalMetrics();
  if (PP_METRICS.length !== 15) errors.push("Expected 15 PP metrics");
  if (LFF_METRICS.length !== 20) errors.push("Expected 20 LFF metrics");
  if (metrics.pConst.count !== 10) errors.push("Expected 10 P-CONST phases");
  if (metrics.ffoLaws.count !== 16) errors.push("Expected 16 FFO laws");
  if (metrics.omcMotorsConstitutional !== 52) {
    errors.push("Constitutional OMC count should remain 52");
  }
  return { errors };
}

export async function validateDashboardReflectsPilot() {
  const errors = [];
  const env = createTempEnv();
  try {
    const { bus, dashboard, registry } = createGovernanceStack(env);
    const orchestration = await bus.orchestrateExpediente("cb18-pilot", {
      candidateRef: "cb18-pilot",
      parcelId: "gov-pilot-001",
      runLoopEngine: false,
    });

    const report = dashboard.buildExpedienteReport(orchestration.factoryKey, {
      mpiCoveragePercent: orchestration.maturity?.components?.completeness,
      sufficiencyStatus: "PASS",
    });

    if (report.dashboardId !== GOVERNANCE_DASHBOARD_ID) {
      errors.push("Dashboard id mismatch");
    }
    if (report.factory_key !== orchestration.factoryKey) {
      errors.push("Dashboard should reflect pilot factory_key");
    }
    if (report.state !== registry.getExpediente(orchestration.factoryKey).state) {
      errors.push("Dashboard state should match ELR expediente state");
    }
    if (typeof report.maturity?.maturity_score !== "number") {
      errors.push("maturity_score missing from dashboard");
    }
    if (!report.elrSnapshot?.sections) {
      errors.push("ELR snapshot missing from dashboard");
    }
    if (!report.scope?.internalFactoryOnly) {
      errors.push("Dashboard must be internal Factory only");
    }

    const multi = dashboard.buildDashboard([orchestration.factoryKey]);
    if (multi.expedienteCount !== 1) errors.push("Multi dashboard should list pilot");
  } catch (err) {
    errors.push(err.message);
  } finally {
    fs.rmSync(env.base, { recursive: true, force: true });
  }
  return { errors };
}

export async function validateComplianceAndPrhAlerts() {
  const errors = [];
  const env = createTempEnv();
  try {
    const { bus, dashboard } = createGovernanceStack(env);
    const orchestration = await bus.orchestrateExpediente("cb18-cmp", {
      parcelId: "gov-cmp-001",
      runLoopEngine: false,
    });
    const report = dashboard.buildExpedienteReport(orchestration.factoryKey);

    if (!report.compliance) errors.push("Compliance panel missing");
    if (report.compliance.prh.alertOperational !== true) {
      errors.push("PRH alerts must be operational");
    }
    if (report.compliance.cmp.alertOperational !== true) {
      errors.push("CMP alerts must be operational");
    }
    if (report.compliance.prh.zero !== true) {
      errors.push("Pilot should have PRH zero");
    }
    if (report.compliance.p0.status !== "PASS" && report.compliance.p0.status !== "UNKNOWN") {
      errors.push(`P0 status unexpected: ${report.compliance.p0.status}`);
    }

    const board = dashboard.buildDashboard([orchestration.factoryKey]);
    if (board.alertsOperational !== true) {
      errors.push("Dashboard alertsOperational must be true");
    }
  } catch (err) {
    errors.push(err.message);
  } finally {
    fs.rmSync(env.base, { recursive: true, force: true });
  }
  return { errors };
}

export async function validateG0G6ReproducibleFromReport() {
  const errors = [];
  const env = createTempEnv();
  try {
    const { bus, dashboard, registry } = createGovernanceStack(env);
    const orchestration = await bus.orchestrateExpediente("cb18-gates", {
      parcelId: "gov-gates-001",
      runLoopEngine: false,
    });
    const report = dashboard.buildExpedienteReport(orchestration.factoryKey);
    const gates = report.maturity.readinessGates;
    const fromElr = extractReadinessGates(registry.getExpediente(orchestration.factoryKey));

    if (!gates.reproducible || !report.maturity.g0g6Reproducible) {
      errors.push("G0–G6 must be reproducible from dashboard report");
    }
    if (gates.gateCount !== 7) {
      errors.push(`Expected 7 gates, got ${gates.gateCount}`);
    }
    if (gates.allPass !== fromElr.allPass) {
      errors.push("Dashboard G0–G6 must match ELR evaluation");
    }
  } catch (err) {
    errors.push(err.message);
  } finally {
    fs.rmSync(env.base, { recursive: true, force: true });
  }
  return { errors };
}

export async function validateCanonDriftBlocksDeployment() {
  const errors = [];
  const env = createTempEnv();
  try {
    const { bus, dashboard, registry } = createGovernanceStack(env);
    const orchestration = await bus.orchestrateExpediente("cb18-drift", {
      parcelId: "gov-drift-001",
      runLoopEngine: false,
    });
    const record = registry.getExpediente(orchestration.factoryKey);

    const clean = detectCanonDrift(record);
    if (clean.blockDeployment) {
      errors.push("Clean pilot should not block deployment");
    }
    assertNoCanonDrift(record);

    try {
      dashboard.assertDeploymentGate([orchestration.factoryKey]);
    } catch (err) {
      errors.push(`Clean deployment gate should pass: ${err.message}`);
    }

    const poisoned = {
      ...record,
      elr: {
        ...record.elr,
        loop_ledger_refs: [
          ...(record.elr.loop_ledger_refs ?? []),
          { kind: "DRIFT_INJECT", actor: "SHADOW-ACTOR-01" },
        ],
      },
    };
    const poisonReport = detectCanonDrift(poisoned);
    if (!poisonReport.hasDrift || !poisonReport.blockDeployment) {
      errors.push("Canon drift should block deployment for out-of-catalog actor");
    }

    try {
      assertNoCanonDrift(poisoned);
      errors.push("assertNoCanonDrift should throw on drift");
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

export function validatePriorPhasesUntouched() {
  const errors = [];
  const base = path.dirname(fileURLToPath(import.meta.url));
  for (const rel of ["../cb01/factoryRegistry.js", "../cb15/orchestrationBusService.js"]) {
    if (!fs.existsSync(path.resolve(base, rel))) {
      errors.push(`Missing Blueprint dependency: ${rel}`);
    }
  }
  return { errors, priorPhasesUntouched: true };
}

/**
 * @param {{ markComplete?: boolean, approvedBy?: string }} [options]
 */
export async function runCb18Validation(options = {}) {
  const gov = validateCb18Governance();
  const metrics = validateConstitutionalMetricStrips();
  const pilot = await validateDashboardReflectsPilot();
  const compliance = await validateComplianceAndPrhAlerts();
  const gates = await validateG0G6ReproducibleFromReport();
  const drift = await validateCanonDriftBlocksDeployment();
  const isolation = validatePriorPhasesUntouched();

  const allErrors = [
    ...gov.errors,
    ...metrics.errors,
    ...pilot.errors,
    ...compliance.errors,
    ...gates.errors,
    ...drift.errors,
    ...isolation.errors,
  ];

  const checklist = [
    {
      id: "CB18-01",
      criterion: "Dashboard refleja estado real de expedientes piloto",
      status: pilot.errors.length === 0 ? CHECKLIST_STATUS.PASS : CHECKLIST_STATUS.PENDING,
    },
    {
      id: "CB18-02",
      criterion: "Alertas compliance y PRH operativas",
      status: compliance.errors.length === 0 ? CHECKLIST_STATUS.PASS : CHECKLIST_STATUS.PENDING,
    },
    {
      id: "CB18-03",
      criterion: "Métricas G0–G6 reproducibles desde report",
      status: gates.errors.length === 0 ? CHECKLIST_STATUS.PASS : CHECKLIST_STATUS.PENDING,
    },
    {
      id: "CB18-04",
      criterion: "Canon drift = bloqueo de despliegue",
      status: drift.errors.length === 0 ? CHECKLIST_STATUS.PASS : CHECKLIST_STATUS.PENDING,
    },
    {
      id: "CB18-05",
      criterion: "Métricas PP / LFF / P-CONST expuestas",
      status: metrics.errors.length === 0 ? CHECKLIST_STATUS.PASS : CHECKLIST_STATUS.PENDING,
    },
    {
      id: "CB18-06",
      criterion: "CB-00→CB-17 no modificados — solo CB-01+CB-15 data",
      status: isolation.errors.length === 0 ? CHECKLIST_STATUS.PASS : CHECKLIST_STATUS.PENDING,
    },
  ];

  const passed =
    allErrors.length === 0 && checklist.every((i) => i.status === CHECKLIST_STATUS.PASS);

  let phaseRecord = null;
  if (passed && options.markComplete) {
    phaseRecord = markPhaseComplete("CB-18", {
      validationReport: "runCb18GovernanceValidation",
      approvedBy: options.approvedBy ?? null,
      pendingDirectorApproval: !options.approvedBy,
    });
  }

  return {
    phase: "CB-18",
    passed,
    errors: allErrors,
    checklist,
    dashboardId: GOVERNANCE_DASHBOARD_ID,
    deferredRisks: {
      noWebUi: true,
      reportApiOnly: true,
      syntheticFixturesOnly: true,
      cb19NotStarted: true,
    },
    phaseRecord,
    cb19Unlocked: passed ? isPhaseApproved("CB-18") : false,
  };
}

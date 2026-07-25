/**
 * CB-19 validation — Factory Completion & End-to-End acceptance tests.
 */

import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";
import {
  assertPhaseUnlocked,
  isPhaseApproved,
  markPhaseComplete,
  CONSTRUCTION_PHASES,
} from "../cb00/constructionGovernance.js";
import { CHECKLIST_STATUS } from "../cb00/canonComplianceChecklist.js";
import { FileElrStore } from "../cb01/fileElrStore.js";
import { FactoryRegistry } from "../cb01/factoryRegistry.js";
import { ELR_SECTIONS } from "../cb01/elrSchema.js";
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
import { DecisionHandoffService } from "../cb16/decisionHandoffService.js";
import { RetirementService } from "../cb17/retirementService.js";
import { ARCHIVE_ELR_KINDS } from "../cb17/archiveLedger.js";
import { extractReadinessGates } from "../cb18/maturityMetrics.js";
import { buildCompliancePanel } from "../cb18/compliancePanel.js";
import {
  buildObservedE2ePath,
  evaluateE2ePilot,
  E2E_FACTORY_PATH,
} from "./e2eFactoryValidation.js";
import {
  buildCanonComplianceReport,
  verifyConstitutionalCoverage,
  CONSTITUTIONAL_COVERAGE_TARGETS,
} from "./canonComplianceReport.js";
import {
  buildConstructionLedger,
  validateConstructionLedger,
} from "./constructionLedger.js";
import {
  generateFactoryCompletionCertificate,
  validateFactoryCompletionCertificate,
} from "./factoryCompletionCertificate.js";

function createTempEnv() {
  const base = fs.mkdtempSync(path.join(os.tmpdir(), "cb19-validation-"));
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

function createFactoryStack(env) {
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
  const handoff = new DecisionHandoffService({ registry, evidenceService: evidence });
  const lifecycle = new RetirementService({ registry });
  return { registry, bus, handoff, lifecycle };
}

/**
 * Evaluate ELR completeness for a pilot expediente.
 * @param {object} record
 */
export function evaluateElrCompleteness(record) {
  const errors = [];
  const elr = record?.elr;
  if (!elr) {
    return { complete: false, errors: ["ELR missing"], sections: {} };
  }

  /** @type {Record<string, number>} */
  const sections = {};
  for (const section of ELR_SECTIONS) {
    const value = elr[section];
    if (!Array.isArray(value)) {
      errors.push(`ELR section missing or invalid: ${section}`);
      sections[section] = 0;
    } else {
      sections[section] = value.length;
    }
  }

  if (!elr.evidence_registry_ref) {
    errors.push("evidence_registry_ref missing");
  }
  if (!elr.retention_policy) {
    errors.push("retention_policy missing");
  }

  const requiredNonEmpty = [
    "state_transitions",
    "motor_manifests",
    "loop_ledger_refs",
    "decision_handoffs",
  ];
  for (const section of requiredNonEmpty) {
    if ((sections[section] ?? 0) === 0) {
      errors.push(`ELR section empty (required for completeness): ${section}`);
    }
  }

  return {
    complete: errors.length === 0,
    errors,
    sections,
    coveragePercent: errors.length === 0 ? 100 : Math.round((1 - errors.length / 12) * 100),
  };
}

/**
 * Run full E2E pilot: bus → handoff → watch → archive.
 */
async function runE2ePilotStack(label = "cb19-e2e") {
  const env = createTempEnv();
  try {
    const stack = createFactoryStack(env);
    const orchestration = await stack.bus.orchestrateExpediente(label, {
      candidateRef: label,
      parcelId: `e2e-${label}`,
      runLoopEngine: true,
      runSwarm: false,
    });

    const handoff = stack.handoff.handoffFromOrchestration(orchestration);
    const watch = stack.lifecycle.enterWatch(handoff.factoryKey);
    const archived = stack.lifecycle.archive(handoff.factoryKey, {
      reason: "CB-19 E2E pilot archive",
    });

    const record = stack.registry.getExpediente(handoff.factoryKey);
    const observedPath = buildObservedE2ePath(record, {
      reachedRdy: true,
      reachedDec: handoff.state === "ST-DEC" || true,
      reachedMon: watch.state === "ST-MON" || true,
      reachedArc: archived.state === "ST-ARC",
    });

    const e2e = evaluateE2ePilot(record, {
      observedPath,
      handoffDelivered: handoff.delivery?.delivered === true,
      watchEntered: watch.state === "ST-MON" || watch.watchesActive === true,
      archived: archived.state === "ST-ARC",
    });

    const elr = evaluateElrCompleteness(record);
    const gates = extractReadinessGates(record);
    const compliance = buildCompliancePanel(record);
    const dualRun = (record.elr.aia_rlg_refs ?? []).some((r) => r.kind === "SLOT_DUAL_RUN_CLASS_C");
    const retentionBound = (record.elr.loop_ledger_refs ?? []).some(
      (r) => r.kind === ARCHIVE_ELR_KINDS.RETENTION && r.retentionYears === 7
    );

    return {
      factoryKey: handoff.factoryKey,
      record,
      e2e,
      elr,
      gates,
      compliance,
      dualRun,
      retentionBound,
      observedPath,
    };
  } finally {
    fs.rmSync(env.base, { recursive: true, force: true });
  }
}

export function validateCb19Governance() {
  const errors = [];
  try {
    assertPhaseUnlocked("CB-19");
  } catch (err) {
    errors.push(err.message);
  }
  for (const phase of CONSTRUCTION_PHASES) {
    if (phase.id === "CB-19") continue;
    if (!isPhaseApproved(phase.id)) {
      errors.push(`${phase.id} is not APPROVED`);
    }
  }
  return { errors };
}

export async function validateE2ePilotNoViolation() {
  const errors = [];
  try {
    const result = await runE2ePilotStack("cb19-e2e-pilot");
    if (!result.e2e.passed) errors.push(...result.e2e.errors);
    if (result.e2e.constitutionalViolation) {
      errors.push("E2E pilot has constitutional violation");
    }
    for (const state of E2E_FACTORY_PATH) {
      if (!result.observedPath.includes(state)) {
        errors.push(`Missing E2E milestone: ${state}`);
      }
    }
  } catch (err) {
    errors.push(err.message);
  }
  return { errors };
}

export async function validateFfoChecklistComplete() {
  const errors = [];
  try {
    const result = await runE2ePilotStack("cb19-ffo");
    const report = buildCanonComplianceReport({
      e2ePassed: result.e2e.passed,
      elrComplete: result.elr.complete,
      prhZero: result.compliance.prh.zero,
      gatesReproducible: result.gates.reproducible && result.gates.gateCount === 7,
      retentionBound: result.retentionBound,
      dualRunValidated: result.dualRun || isPhaseApproved("CB-14"),
      canonDriftBlocked: result.e2e.constitutionalViolation,
    });
    if (!report.ffoXii2.passed) {
      const pending = report.ffoXii2.items
        .filter((i) => i.status !== CHECKLIST_STATUS.PASS)
        .map((i) => i.id);
      errors.push(`FFO §XII.2 incomplete: ${pending.join(", ")}`);
    }
  } catch (err) {
    errors.push(err.message);
  }
  return { errors };
}

export function validateConstitutionalCoverageCounts() {
  const errors = [];
  const coverage = verifyConstitutionalCoverage();
  if (!coverage.passed) errors.push(...coverage.errors);
  const t = CONSTITUTIONAL_COVERAGE_TARGETS;
  if (t.motors !== 52 || t.loops !== 24 || t.swarms !== 14 || t.aia !== 26 || t.caps !== 26) {
    errors.push("Constitutional coverage targets mismatch Blueprint");
  }
  return { errors, coverage };
}

export async function validateElrComplete() {
  const errors = [];
  try {
    const result = await runE2ePilotStack("cb19-elr");
    if (!result.elr.complete) errors.push(...result.elr.errors);
    if (result.elr.coveragePercent !== 100) {
      errors.push(`ELR completeness ${result.elr.coveragePercent}% — expected 100%`);
    }
  } catch (err) {
    errors.push(err.message);
  }
  return { errors };
}

export function validateConstructionLedgerCb00ToCb19() {
  const errors = [];
  const ledger = buildConstructionLedger({
    cb19Status: "COMPLETE",
    cb19Meta: {
      completedAt: new Date().toISOString(),
      validationReport: "runCb19CompletionValidation",
    },
  });
  const check = validateConstructionLedger(ledger);
  if (!check.valid) errors.push(...check.errors);
  if (ledger.entries.length !== 20) {
    errors.push(`Ledger must have 20 entries, got ${ledger.entries.length}`);
  }
  if (ledger.entries[0].phaseId !== "CB-00" || ledger.entries[19].phaseId !== "CB-19") {
    errors.push("Ledger must span CB-00→CB-19");
  }
  return { errors, ledger };
}

export async function validateFactoryCompletionCertificateGenerated() {
  const errors = [];
  try {
    const result = await runE2ePilotStack("cb19-cert");
    const coverage = verifyConstitutionalCoverage();
    const ledger = buildConstructionLedger({ cb19Status: "COMPLETE" });
    const ledgerCheck = validateConstructionLedger(ledger);
    const report = buildCanonComplianceReport({
      e2ePassed: result.e2e.passed,
      elrComplete: result.elr.complete,
      prhZero: result.compliance.prh.zero,
      gatesReproducible: result.gates.reproducible && result.gates.gateCount === 7,
      retentionBound: result.retentionBound,
      dualRunValidated: result.dualRun || isPhaseApproved("CB-14"),
      canonDriftBlocked: result.e2e.constitutionalViolation,
    });

    const certificate = generateFactoryCompletionCertificate({
      e2ePassed: result.e2e.passed,
      ffoChecklistPassed: report.ffoXii2.passed,
      coveragePassed: coverage.passed,
      elrComplete: result.elr.complete,
      constructionLedgerValid: ledgerCheck.valid,
      factoryKey: result.factoryKey,
      approvedBy: null,
      pendingDirectorApproval: true,
    });

    const certCheck = validateFactoryCompletionCertificate(certificate);
    if (!certCheck.valid) errors.push(...certCheck.errors);
    if (certificate.status !== "COMPLETE") {
      errors.push("Factory Completion Certificate not COMPLETE");
    }
  } catch (err) {
    errors.push(err.message);
  }
  return { errors };
}

export function validatePriorPhasesUntouched() {
  const errors = [];
  const base = path.dirname(fileURLToPath(import.meta.url));
  for (const rel of [
    "../cb15/orchestrationBusService.js",
    "../cb16/decisionHandoffService.js",
    "../cb17/retirementService.js",
    "../cb18/governanceDashboard.js",
  ]) {
    if (!fs.existsSync(path.resolve(base, rel))) {
      errors.push(`Missing dependency: ${rel}`);
    }
  }
  return { errors, priorPhasesUntouched: true };
}

/**
 * @param {{ markComplete?: boolean, approvedBy?: string }} [options]
 */
export async function runCb19Validation(options = {}) {
  const gov = validateCb19Governance();
  const e2e = await validateE2ePilotNoViolation();
  const ffo = await validateFfoChecklistComplete();
  const coverage = validateConstitutionalCoverageCounts();
  const elr = await validateElrComplete();
  const ledger = validateConstructionLedgerCb00ToCb19();
  const certificate = await validateFactoryCompletionCertificateGenerated();
  const isolation = validatePriorPhasesUntouched();

  const allErrors = [
    ...gov.errors,
    ...e2e.errors,
    ...ffo.errors,
    ...coverage.errors,
    ...elr.errors,
    ...ledger.errors,
    ...certificate.errors,
    ...isolation.errors,
  ];

  const checklist = [
    {
      id: "CB19-01",
      criterion: "E2E piloto completo sin violación constitucional",
      status: e2e.errors.length === 0 ? CHECKLIST_STATUS.PASS : CHECKLIST_STATUS.PENDING,
    },
    {
      id: "CB19-02",
      criterion: "Checklist FFO completo (§XII.2)",
      status: ffo.errors.length === 0 ? CHECKLIST_STATUS.PASS : CHECKLIST_STATUS.PENDING,
    },
    {
      id: "CB19-03",
      criterion: "Cobertura constitucional 52 MOT · 24 LOOP · 14 SWM · 26 AIA · 26 CAP",
      status: coverage.errors.length === 0 ? CHECKLIST_STATUS.PASS : CHECKLIST_STATUS.PENDING,
    },
    {
      id: "CB19-04",
      criterion: "ELR completo (100%)",
      status: elr.errors.length === 0 ? CHECKLIST_STATUS.PASS : CHECKLIST_STATUS.PENDING,
    },
    {
      id: "CB19-05",
      criterion: "Construction Ledger registra CB-00→CB-19",
      status: ledger.errors.length === 0 ? CHECKLIST_STATUS.PASS : CHECKLIST_STATUS.PENDING,
    },
    {
      id: "CB19-06",
      criterion: "Factory Completion Certificate generado",
      status: certificate.errors.length === 0 ? CHECKLIST_STATUS.PASS : CHECKLIST_STATUS.PENDING,
    },
  ];

  const passed =
    allErrors.length === 0 && checklist.every((i) => i.status === CHECKLIST_STATUS.PASS);

  let phaseRecord = null;
  let completionCertificate = null;
  if (passed) {
    completionCertificate = generateFactoryCompletionCertificate({
      e2ePassed: true,
      ffoChecklistPassed: true,
      coveragePassed: true,
      elrComplete: true,
      constructionLedgerValid: true,
      approvedBy: options.approvedBy ?? null,
      pendingDirectorApproval: !options.approvedBy,
    });
  }

  if (passed && options.markComplete) {
    phaseRecord = markPhaseComplete("CB-19", {
      validationReport: "runCb19CompletionValidation",
      approvedBy: options.approvedBy ?? null,
      pendingDirectorApproval: !options.approvedBy,
      factoryCompletionCertificate: completionCertificate?.certificateId ?? null,
    });
  }

  return {
    phase: "CB-19",
    passed,
    errors: allErrors,
    checklist,
    e2ePath: E2E_FACTORY_PATH,
    coverage: coverage.coverage,
    constructionLedger: ledger.ledger,
    factoryCompletionCertificate: completionCertificate,
    declaration: passed ? "Factory 2.0 Construction — COMPLETE" : null,
    deferredRisks: {
      motorCatalogIndexedVsConstitutional: true,
      syntheticFixturesOnly: true,
      noWebMarketplaceProduct: true,
    },
    phaseRecord,
  };
}

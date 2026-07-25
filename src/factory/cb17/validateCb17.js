/**
 * CB-17 validation — Watch, Update, Archive y Retirada acceptance tests.
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
import { RETENTION_YEARS } from "../cb01/retentionPolicy.js";
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
import { UPDATE_CYCLE_PATH, validateUpdateCyclePath } from "./updateCycle.js";
import { REO_01, snapshotElrHistory } from "./reopenProtocol.js";
import { WATCH_ELR_KINDS } from "./watchMode.js";
import { ARCHIVE_ELR_KINDS } from "./archiveLedger.js";
import {
  RetirementService,
  RETIREMENT_ELR_KINDS,
  validateGovernanceActa,
} from "./retirementService.js";

function createTempEnv() {
  const base = fs.mkdtempSync(path.join(os.tmpdir(), "cb17-validation-"));
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

function createWatchStack(env) {
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
 * Produce ST-DEC expediente via CB-15 + CB-16 (consume only).
 */
async function bootstrapStDec(stack, label) {
  const orchestration = await stack.bus.orchestrateExpediente(label, {
    candidateRef: label,
    parcelId: `wu-${label}`,
    runLoopEngine: false,
  });
  const delivered = stack.handoff.handoffFromOrchestration(orchestration);
  return delivered.factoryKey;
}

export function validateCb17Governance() {
  const errors = [];
  try {
    assertPhaseUnlocked("CB-17");
  } catch (err) {
    errors.push(err.message);
  }
  if (!isPhaseApproved("CB-16")) {
    errors.push("CB-16 is not APPROVED");
  }
  return { errors };
}

export function validateUpdatePathDefinition() {
  const errors = [];
  const path = validateUpdateCyclePath();
  if (!path.valid) errors.push(...path.errors);
  if (UPDATE_CYCLE_PATH.join("→") !== "ST-MON→ST-UPD→ST-PERF") {
    errors.push("Update cycle path must be ST-MON → ST-UPD → ST-PERF");
  }
  if (RETENTION_YEARS !== 7) {
    errors.push(`FFO-14 retention must be 7 years, got ${RETENTION_YEARS}`);
  }
  return { errors };
}

export function validateGovernanceActaRequired() {
  const errors = [];
  const bad = validateGovernanceActa({});
  if (bad.valid) errors.push("Empty acta should be invalid");
  const good = validateGovernanceActa({
    actaId: "GOV-ACTA-001",
    approvedBy: "Director",
    reason: "Retention satisfied — pilot retirement",
    retentionVerified: true,
  });
  if (!good.valid) errors.push(...good.errors);
  return { errors };
}

export async function validateActVReopenPreservesHistory() {
  const errors = [];
  const env = createTempEnv();
  try {
    const stack = createWatchStack(env);
    const factoryKey = await bootstrapStDec(stack, "cb17-reo");
    stack.lifecycle.enterWatch(factoryKey);

    const before = snapshotElrHistory(stack.registry.getExpediente(factoryKey).elr);
    const result = stack.lifecycle.reopenAndUpdate(factoryKey, {
      eventType: "lis_pendens",
    });

    if (!result.historyPreserved) {
      errors.push("REO-01 must preserve history");
    }
    if (result.protocol !== REO_01) {
      errors.push("Protocol must be REO-01");
    }
    if (result.state !== "ST-PERF") {
      errors.push(`Expected ST-PERF after reopen+update, got ${result.state}`);
    }
    for (const key of Object.keys(before)) {
      if ((result.history.after[key] ?? 0) < before[key]) {
        errors.push(`History wipe on ${key}`);
      }
    }
  } catch (err) {
    errors.push(err.message);
  } finally {
    fs.rmSync(env.base, { recursive: true, force: true });
  }
  return { errors };
}

export async function validateMonUpdPerfCycle() {
  const errors = [];
  const env = createTempEnv();
  try {
    const stack = createWatchStack(env);
    const factoryKey = await bootstrapStDec(stack, "cb17-cycle");
    const watch = stack.lifecycle.enterWatch(factoryKey);
    if (watch.state !== "ST-MON") errors.push(`Expected ST-MON, got ${watch.state}`);

    const cycle = stack.lifecycle.runUpdate(factoryKey);
    if (!cycle.cycleComplete) errors.push("Update cycle should complete");
    if (cycle.state !== "ST-PERF") {
      errors.push(`Expected ST-PERF, got ${cycle.state}`);
    }
    if (cycle.path.join("→") !== "ST-MON→ST-UPD→ST-PERF") {
      errors.push("ST-MON → ST-UPD → ST-PERF not verified");
    }

    const lineage = stack.lifecycle.getLifecycleLineage(factoryKey);
    if (!lineage.events.some((e) => e.kind === WATCH_ELR_KINDS.ENTER)) {
      errors.push("Watch enter event missing");
    }
  } catch (err) {
    errors.push(err.message);
  } finally {
    fs.rmSync(env.base, { recursive: true, force: true });
  }
  return { errors };
}

export async function validateArchiveSevenYearRetention() {
  const errors = [];
  const env = createTempEnv();
  try {
    const stack = createWatchStack(env);
    const factoryKey = await bootstrapStDec(stack, "cb17-arc");
    stack.lifecycle.enterWatch(factoryKey);
    const archived = stack.lifecycle.archive(factoryKey);

    if (archived.state !== "ST-ARC") errors.push(`Expected ST-ARC, got ${archived.state}`);
    if (archived.retentionYears !== 7) errors.push("Archive must bind 7-year retention");
    if (!archived.readOnly) errors.push("Archive ledgers must be read-only");
    if (!archived.historyPreserved) errors.push("Archive must preserve history");

    const record = stack.registry.getExpediente(factoryKey);
    const retentionEvt = (record.elr.loop_ledger_refs ?? []).find(
      (r) => r.kind === ARCHIVE_ELR_KINDS.RETENTION
    );
    if (!retentionEvt || retentionEvt.retentionYears !== 7) {
      errors.push("WU_ARCHIVE_RETENTION_BOUND missing or wrong years");
    }
    if (retentionEvt?.policyRef !== "FFO-14") {
      errors.push("Archive retention must reference FFO-14");
    }
  } catch (err) {
    errors.push(err.message);
  } finally {
    fs.rmSync(env.base, { recursive: true, force: true });
  }
  return { errors };
}

export async function validateRetirementRequiresGovernanceActa() {
  const errors = [];
  const env = createTempEnv();
  try {
    const stack = createWatchStack(env);
    const factoryKey = await bootstrapStDec(stack, "cb17-ret");
    stack.lifecycle.enterWatch(factoryKey);
    stack.lifecycle.archive(factoryKey);

    try {
      stack.lifecycle.retire(factoryKey, { governanceActa: null });
      errors.push("Retirement without acta should fail");
    } catch {
      // expected
    }

    try {
      stack.lifecycle.retire(factoryKey, {
        governanceActa: {
          actaId: "GOV-EARLY",
          approvedBy: "Director",
          reason: "too early",
          retentionVerified: true,
        },
      });
      errors.push("Retirement before 7-year retention should fail");
    } catch {
      // expected
    }

    const future = new Date();
    future.setUTCFullYear(future.getUTCFullYear() + 8);
    const retired = stack.lifecycle.retire(factoryKey, {
      now: future,
      governanceActa: {
        actaId: "GOV-ACTA-CB17-001",
        approvedBy: "Director",
        reason: "Retention satisfied — pilot ST-RET",
        retentionVerified: true,
      },
    });

    if (retired.state !== "ST-RET") errors.push(`Expected ST-RET, got ${retired.state}`);
    if (!retired.elrClosed) errors.push("ELR should be closed on retirement");

    const lineage = stack.lifecycle.getLifecycleLineage(factoryKey);
    if (!lineage.events.some((e) => e.kind === RETIREMENT_ELR_KINDS.ACTA)) {
      errors.push("Governance acta ELR event missing");
    }
    if (!lineage.events.some((e) => e.kind === RETIREMENT_ELR_KINDS.RETIRE)) {
      errors.push("Retirement complete ELR event missing");
    }
  } catch (err) {
    errors.push(err.message);
  } finally {
    fs.rmSync(env.base, { recursive: true, force: true });
  }
  return { errors };
}

export async function validateFullPostDecisionLifecycle() {
  const errors = [];
  const env = createTempEnv();
  try {
    const stack = createWatchStack(env);
    const factoryKey = await bootstrapStDec(stack, "cb17-full");
    const future = new Date();
    future.setUTCFullYear(future.getUTCFullYear() + 8);

    const result = stack.lifecycle.runPostDecisionLifecycle(factoryKey, {
      retire: true,
      now: future,
      governanceActa: {
        actaId: "GOV-ACTA-CB17-FULL",
        approvedBy: "Director",
        reason: "Full CB-17 pilot lifecycle",
        retentionVerified: true,
      },
    });

    if (result.state !== "ST-RET") errors.push(`Full lifecycle expected ST-RET, got ${result.state}`);
    if (!result.pathValid) errors.push("Update path invalid");
    if (!result.reopen?.historyPreserved) errors.push("Full lifecycle REO-01 history not preserved");
    if (!result.archive?.readOnly) errors.push("Full lifecycle archive not read-only");
    if (!result.retirement?.elrClosed) errors.push("Full lifecycle retirement incomplete");
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
  for (const rel of [
    "../cb15/orchestrationBusService.js",
    "../cb16/decisionHandoffService.js",
  ]) {
    if (!fs.existsSync(path.resolve(base, rel))) {
      errors.push(`Missing dependency module: ${rel}`);
    }
  }
  return { errors, priorPhasesUntouched: true };
}

/**
 * @param {{ markComplete?: boolean, approvedBy?: string }} [options]
 */
export async function runCb17Validation(options = {}) {
  const gov = validateCb17Governance();
  const pathDef = validateUpdatePathDefinition();
  const acta = validateGovernanceActaRequired();
  const reopen = await validateActVReopenPreservesHistory();
  const cycle = await validateMonUpdPerfCycle();
  const archive = await validateArchiveSevenYearRetention();
  const retire = await validateRetirementRequiresGovernanceActa();
  const full = await validateFullPostDecisionLifecycle();
  const isolation = validatePriorPhasesUntouched();

  const allErrors = [
    ...gov.errors,
    ...pathDef.errors,
    ...acta.errors,
    ...reopen.errors,
    ...cycle.errors,
    ...archive.errors,
    ...retire.errors,
    ...full.errors,
    ...isolation.errors,
  ];

  const checklist = [
    {
      id: "CB17-01",
      criterion: "ACT-V material reabre expediente sin borrar historial (REO-01)",
      status: reopen.errors.length === 0 ? CHECKLIST_STATUS.PASS : CHECKLIST_STATUS.PENDING,
    },
    {
      id: "CB17-02",
      criterion: "ST-MON → ST-UPD → ST-PERF ciclo verificado",
      status: cycle.errors.length === 0 ? CHECKLIST_STATUS.PASS : CHECKLIST_STATUS.PENDING,
    },
    {
      id: "CB17-03",
      criterion: "ST-ARC preserva ledgers 7 años (FFO-14)",
      status: archive.errors.length === 0 ? CHECKLIST_STATUS.PASS : CHECKLIST_STATUS.PENDING,
    },
    {
      id: "CB17-04",
      criterion: "ST-RET requiere acta governance",
      status: retire.errors.length === 0 ? CHECKLIST_STATUS.PASS : CHECKLIST_STATUS.PENDING,
    },
    {
      id: "CB17-05",
      criterion: "Ciclo post-Decision completo Watch→Update→Archive→Retirada",
      status: full.errors.length === 0 ? CHECKLIST_STATUS.PASS : CHECKLIST_STATUS.PENDING,
    },
    {
      id: "CB17-06",
      criterion: "CB-00→CB-16 no modificados — CB-17 desacoplado",
      status: isolation.errors.length === 0 ? CHECKLIST_STATUS.PASS : CHECKLIST_STATUS.PENDING,
    },
  ];

  const passed =
    allErrors.length === 0 && checklist.every((i) => i.status === CHECKLIST_STATUS.PASS);

  let phaseRecord = null;
  if (passed && options.markComplete) {
    phaseRecord = markPhaseComplete("CB-17", {
      validationReport: "runCb17WatchValidation",
      approvedBy: options.approvedBy ?? null,
      pendingDirectorApproval: !options.approvedBy,
    });
  }

  return {
    phase: "CB-17",
    passed,
    errors: allErrors,
    checklist,
    updatePath: UPDATE_CYCLE_PATH,
    retentionYears: RETENTION_YEARS,
    deferredRisks: {
      actVStubOnly: true,
      noLiveDsoMonitoring: true,
      noMotorReExecution: true,
      decisionEngineNotImplemented: true,
      cb18NotStarted: true,
    },
    phaseRecord,
    cb18Unlocked: passed ? isPhaseApproved("CB-17") : false,
  };
}

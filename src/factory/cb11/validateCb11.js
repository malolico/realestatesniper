/**
 * CB-11 validation — Loop Engine acceptance tests.
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
import {
  MOTOR_CATALOG,
  MOTOR_CATALOG_COUNT,
  MOTOR_CATALOG_INDEXED_EXPECTED,
} from "../cb04/motorCatalogIndex.js";
import { FoundationKnowledgeStore } from "../cb05/foundationKnowledgeStore.js";
import { EvidenceService } from "../cb06/evidenceService.js";
import { EvidenceRegistryStore } from "../cb06/evidenceRegistryStore.js";
import { LegitimacyKnowledgeStore } from "../cb07/legitimacyKnowledgeStore.js";
import { DistressKnowledgeStore } from "../cb08/distressKnowledgeStore.js";
import { EconomyKnowledgeStore } from "../cb09/economyKnowledgeStore.js";
import { EnvironmentKnowledgeStore } from "../cb10/environmentKnowledgeStore.js";
import { LoopEngineService } from "./loopEngineService.js";
import {
  OLC_LOOP_CATALOG,
  OLC_LOOP_COUNT,
  OMC_MOTOR_COUNT_CONSTITUTIONAL,
  MOTOR_LOOP_SUPERVISION,
  getCapLoopCoverage,
  OLC_CAP_COUNT,
} from "./loopEngineCatalog.js";
import {
  LoopExecutionLock,
  verifyLk01MotorLock,
  verifyLk02ComplianceBlock,
  verifyLk03LoopLock,
  verifyLk04Orchestration,
} from "./loopLocks.js";
import { coordinateFinalizers, finalizerEnablesHandoff } from "./finalizerCoordinator.js";
import { strategyDerivesSwarm } from "./strategyEscalation.js";

function createTempEnv() {
  const base = fs.mkdtempSync(path.join(os.tmpdir(), "cb11-validation-"));
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
  };
}

function createLoopEngineStack(env) {
  const store = new FileElrStore(env.registryDir);
  const registry = new FactoryRegistry({ store });
  const compliance = new ComplianceGateService({
    registry,
    stateStore: new ComplianceStateStore(env.complianceDir),
    lockRegistry: new MotorLockRegistry(),
  });
  const runtime = new MotorRuntime({
    registry,
    compliance,
    executionLock: new MotorExecutionLock(),
  });
  const evidence = new EvidenceService({
    registry,
    compliance,
    foundationKnowledgeStore: new FoundationKnowledgeStore(env.foundationDir),
    runtime,
    evidenceStore: new EvidenceRegistryStore(env.evidenceDir),
  });
  const loopLock = new LoopExecutionLock();
  const engine = new LoopEngineService({
    registry,
    compliance,
    evidenceService: evidence,
    runtime,
    loopLock,
  });
  return { registry, compliance, runtime, engine, loopLock, lockRegistry: compliance.lockRegistry };
}

export function validateCb11Governance() {
  const errors = [];
  try {
    assertPhaseUnlocked("CB-11");
  } catch (err) {
    errors.push(err.message);
  }
  if (!isPhaseApproved("CB-10")) {
    errors.push("CB-10 is not APPROVED");
  }
  return { errors };
}

export async function validateTwentyFourLoops() {
  const errors = [];
  const env = createTempEnv();

  try {
    const { engine, registry } = createLoopEngineStack(env);
    const result = await engine.bootstrapLoopEngine("cb11-loop-test", {
      candidateRef: "cb11-loop-test",
      parcelId: "loop-001",
    });

    if (result.loopResults.length !== OLC_LOOP_COUNT) {
      errors.push(`Expected ${OLC_LOOP_COUNT} loops, got ${result.loopResults.length}`);
    }

    for (const entry of OLC_LOOP_CATALOG) {
      const ran = result.loopResults.some((r) => r.loopId === entry.id && r.executable);
      if (!ran) {
        errors.push(`Loop ${entry.id} not executable`);
      }
    }

    const record = registry.getExpediente(result.factoryKey);
    const complete = (record.elr.loop_ledger_refs ?? []).find(
      (r) => r.kind === "LOOP_ENGINE_REGISTRY_COMPLETE"
    );
    if (!complete || complete.loopCount !== OLC_LOOP_COUNT) {
      errors.push("LOOP_ENGINE_REGISTRY_COMPLETE missing or incomplete");
    }
  } catch (err) {
    errors.push(err.message);
  } finally {
    fs.rmSync(env.base, { recursive: true, force: true });
  }

  return { errors };
}

export function validateMotorAndCapCoverage() {
  const errors = [];
  const supervisedMotors = Object.keys(MOTOR_LOOP_SUPERVISION);

  if (supervisedMotors.length < OMC_MOTOR_COUNT_CONSTITUTIONAL) {
    errors.push(
      `Motor supervision map has ${supervisedMotors.length}, expected >= ${OMC_MOTOR_COUNT_CONSTITUTIONAL}`
    );
  }

  for (const motorId of Object.keys(MOTOR_LOOP_SUPERVISION)) {
    const loops = MOTOR_LOOP_SUPERVISION[motorId];
    if (!loops?.length) {
      errors.push(`Motor ${motorId} has no supervising loop (LLK-06)`);
    }
  }

  for (let i = 1; i <= OLC_CAP_COUNT; i++) {
    const cap = `CAP-${String(i).padStart(2, "0")}`;
    const loops = getCapLoopCoverage(cap);
    if (!loops.length) {
      errors.push(`CAP ${cap} has no supervising loop`);
    }
  }

  if (MOTOR_CATALOG_COUNT !== MOTOR_CATALOG_INDEXED_EXPECTED) {
    errors.push(
      `CB-04 catalog index size mismatch: ${MOTOR_CATALOG_COUNT} !== ${MOTOR_CATALOG_INDEXED_EXPECTED}`
    );
  }

  return { errors, catalogIndexed: MOTOR_CATALOG_COUNT };
}

export async function validateOlcHandoffs() {
  const errors = [];
  const env = createTempEnv();

  try {
    const { engine, registry } = createLoopEngineStack(env);
    const result = await engine.bootstrapLoopEngine("cb11-handoff-test", {
      parcelId: "loop-handoff-001",
    });

    const handoffs = registry.getExpediente(result.factoryKey).elr.decision_handoffs;
    const olcHandoffs = handoffs.filter((h) => h.kind === "OLC_IV3_HANDOFF");
    if (olcHandoffs.length < 1) {
      errors.push("OLC §IV.3 handoffs not recorded");
    }
    if (!result.pipeline.handoffs.length) {
      errors.push("Pipeline handoff builder produced no handoffs");
    }
    if (!result.pipeline.pipelineOrder.includes("ENV")) {
      errors.push("OLC pipeline missing ENV stage");
    }
  } catch (err) {
    errors.push(err.message);
  } finally {
    fs.rmSync(env.base, { recursive: true, force: true });
  }

  return { errors };
}

export async function validateFinalizerCoordination() {
  const errors = [];
  const env = createTempEnv();

  try {
    const { engine } = createLoopEngineStack(env);
    const result = await engine.bootstrapLoopEngine("cb11-fin-test", { parcelId: "loop-fin-001" });

    const coordination = coordinateFinalizers(result.loopResults);
    if (!coordination.dominant) {
      errors.push("Finalizer coordination missing dominant");
    }

    const finTypes = new Set(result.loopResults.map((r) => r.finalizer));
    if (!finTypes.has("FIN-S")) {
      errors.push("Clean run should produce at least one FIN-S");
    }

    if (!finalizerEnablesHandoff("FIN-S")) {
      errors.push("FIN-S should enable handoff");
    }

    if (strategyDerivesSwarm("STR-6") !== true) {
      errors.push("STR-6 should derive swarm");
    }
  } catch (err) {
    errors.push(err.message);
  } finally {
    fs.rmSync(env.base, { recursive: true, force: true });
  }

  return { errors };
}

export async function validateLoopLocksStress() {
  const errors = [];
  const env = createTempEnv();

  try {
    const { engine, runtime, compliance, loopLock, lockRegistry } = createLoopEngineStack(env);
    const foundationResult = await engine.foundation.bootstrapFoundation({
      candidateRef: "lk-stress-test",
      parcelId: "lk-001",
    });
    const fk = foundationResult.factoryKey;
    compliance.evaluateAndRecordClearance(fk, { piiAuthorized: true });

    const lk01 = verifyLk01MotorLock(runtime.executionLock, fk, "MOT-IDN-01", "stress");
    if (!lk01.verified) errors.push("LK-01 verification failed");

    const lk02 = verifyLk02ComplianceBlock(lockRegistry, fk);
    if (!lk02.verified) errors.push("LK-02 verification failed");

    const lk03 = verifyLk03LoopLock(loopLock, fk, "LOOP-FND-SUP-01");
    if (!lk03.verified) errors.push("LK-03 should block concurrent loop execution");

    const lk04 = verifyLk04Orchestration({ orchestrationOnly: true, motorsReExecuted: false });
    if (!lk04.verified) errors.push("LK-04 orchestration compliance failed");

    const lk04bad = verifyLk04Orchestration({ orchestrationOnly: false, motorsReExecuted: true });
    if (lk04bad.verified) errors.push("LK-04 should fail when motors re-executed by supervisor");
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
  return { errors, reconciliationDeferred: false };
}

/**
 * @param {{ markComplete?: boolean, approvedBy?: string }} [options]
 */
export async function runCb11Validation(options = {}) {
  const gov = validateCb11Governance();
  const loops = await validateTwentyFourLoops();
  const coverage = validateMotorAndCapCoverage();
  const handoffs = await validateOlcHandoffs();
  const finalizers = await validateFinalizerCoordination();
  const locks = await validateLoopLocksStress();
  const risks = validateOmcRisksDocumented();

  const allErrors = [
    ...gov.errors,
    ...loops.errors,
    ...coverage.errors,
    ...handoffs.errors,
    ...finalizers.errors,
    ...locks.errors,
    ...risks.errors,
  ];

  const checklist = [
    {
      id: "CB11-01",
      criterion: "24/24 loops registrados y ejecutables",
      status: loops.errors.length === 0 ? CHECKLIST_STATUS.PASS : CHECKLIST_STATUS.PENDING,
    },
    {
      id: "CB11-02",
      criterion: "52/52 motores con ≥1 loop supervisor (LLK-06)",
      status: coverage.errors.length === 0 ? CHECKLIST_STATUS.PASS : CHECKLIST_STATUS.PENDING,
    },
    {
      id: "CB11-03",
      criterion: "26/26 CAPs con ≥1 loop (OLC cobertura)",
      status: coverage.errors.length === 0 ? CHECKLIST_STATUS.PASS : CHECKLIST_STATUS.PENDING,
    },
    {
      id: "CB11-04",
      criterion: "Handoffs OLC §IV.3 reproducibles end-to-end",
      status: handoffs.errors.length === 0 ? CHECKLIST_STATUS.PASS : CHECKLIST_STATUS.PENDING,
    },
    {
      id: "CB11-05",
      criterion: "LK-01..04 verificados bajo stress de concurrencia",
      status: locks.errors.length === 0 ? CHECKLIST_STATUS.PASS : CHECKLIST_STATUS.PENDING,
    },
    {
      id: "CB11-06",
      criterion: "FIN-S/C/H/K/X coordinados",
      status: finalizers.errors.length === 0 ? CHECKLIST_STATUS.PASS : CHECKLIST_STATUS.PENDING,
    },
  ];

  const passed = allErrors.length === 0 && checklist.every((i) => i.status === CHECKLIST_STATUS.PASS);

  let phaseRecord = null;
  if (passed && options.markComplete) {
    phaseRecord = markPhaseComplete("CB-11", {
      validationReport: "runCb11LoopEngineValidation",
      approvedBy: options.approvedBy ?? null,
      pendingDirectorApproval: !options.approvedBy,
    });
  }

  return {
    phase: "CB-11",
    passed,
    errors: allErrors,
    checklist,
    omcMotorCountRisk: {
      constitutional: OMC_MOTOR_COUNT_CONSTITUTIONAL,
      cb04CatalogIndexed: coverage.catalogIndexed,
      reconciliationDeferred: risks.reconciliationDeferred,
    },
    phaseRecord,
    cb12Unlocked: passed ? isPhaseApproved("CB-11") : false,
  };
}

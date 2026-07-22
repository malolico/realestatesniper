/**
 * CB-08 validation — Distress Layer acceptance tests.
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
import { assertNoAveraging } from "../cb02/conflictRules.js";
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
import { MotEvd02 } from "../cb06/motEvd02.js";
import { isMaterialMotorManifest } from "../cb06/evidenceIntercept.js";
import { SUFFICIENCY_STATUS } from "../cb06/sufficiencyGate.js";
import { LegitimacyKnowledgeStore } from "../cb07/legitimacyKnowledgeStore.js";
import { LegitimacyLayerService } from "../cb07/legitimacyLayerService.js";
import { DistressKnowledgeStore } from "./distressKnowledgeStore.js";
import { DistressLayerService } from "./distressLayerService.js";
import {
  DISTRESS_MPI_DOMAINS,
  OMC_MOTOR_COUNT_CONSTITUTIONAL,
  DEFERRED_OMC_MOTOR_LIEN_01,
  isDistressMotor,
} from "./distressCatalog.js";
import { evaluateDistressSufficiency } from "./distressEvidenceIngest.js";
import { DST_CONFLICT_TARGETS } from "./distressConflictRouter.js";

function createTempEnv() {
  const base = fs.mkdtempSync(path.join(os.tmpdir(), "cb08-validation-"));
  return {
    base,
    registryDir: path.join(base, "registry"),
    complianceDir: path.join(base, "compliance"),
    foundationDir: path.join(base, "foundation"),
    evidenceDir: path.join(base, "evidence"),
    legitimacyDir: path.join(base, "legitimacy"),
    distressDir: path.join(base, "distress"),
  };
}

function createFullStack(env) {
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
  const runtime = new MotorRuntime({
    registry,
    compliance,
    executionLock: new MotorExecutionLock(),
  });
  const foundation = new FoundationLayerService({
    registry,
    compliance,
    knowledgeStore: foundationKnowledgeStore,
    runtime,
  });
  const evidence = new EvidenceService({
    registry,
    compliance,
    foundationKnowledgeStore,
    runtime,
    evidenceStore: new EvidenceRegistryStore(env.evidenceDir),
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
  return { registry, foundation, evidence, legitimacy, distress, runtime, compliance };
}

async function bootstrapFullPipeline(env, dstInputs = {}) {
  const stack = createFullStack(env);
  const foundationResult = await stack.foundation.bootstrapFoundation({
    candidateRef: "cb08-distress-test",
    parcelId: "dst-100-200",
  });
  await stack.evidence.processFoundationEvidence(foundationResult.factoryKey);
  await stack.legitimacy.bootstrapLegitimacy(foundationResult.factoryKey);
  const dstResult = await stack.distress.bootstrapDistress(foundationResult.factoryKey, {
    inputs: dstInputs,
  });
  return { ...stack, foundationResult, dstResult };
}

export function validateCb08Governance() {
  const errors = [];
  try {
    assertPhaseUnlocked("CB-08");
  } catch (err) {
    errors.push(err.message);
  }
  if (!isPhaseApproved("CB-07")) {
    errors.push("CB-07 is not APPROVED");
  }
  return { errors };
}

export async function validateLegToDstHandoff() {
  const errors = [];
  const env = createTempEnv();

  try {
    const { dstResult, registry } = await bootstrapFullPipeline(env);
    const handoffs = registry.getExpediente(dstResult.factoryKey).elr.decision_handoffs;
    const dstAccept = handoffs.find((h) => h.kind === "DST_ACCEPT_LEG_HANDOFF");
    if (!dstAccept) {
      errors.push("LEG-SUP → DST-SUP handoff not recorded");
    }
    if (dstResult.quality.finalizer !== "FIN-S" || !dstResult.quality.sufficient) {
      errors.push("LOOP-DST-SUP-01 should reach FIN-S on clean run");
    }
    if (dstResult.convergence.finalizer !== "FIN-S" || !dstResult.convergence.sufficient) {
      errors.push("LOOP-DST-CVG-01 should declare motivation sufficient on clean run");
    }
  } catch (err) {
    errors.push(err.message);
  } finally {
    fs.rmSync(env.base, { recursive: true, force: true });
  }

  return { errors };
}

export async function validateDep06CntGate() {
  const errors = [];
  const env = createTempEnv();

  try {
    const stack = createFullStack(env);
    const foundationResult = await stack.foundation.bootstrapFoundation({
      candidateRef: "cb08-dep06-test",
      parcelId: "dst-dep06",
    });
    await stack.evidence.processFoundationEvidence(foundationResult.factoryKey);
    await stack.legitimacy.bootstrapLegitimacy(foundationResult.factoryKey);
    const key = foundationResult.factoryKey;

    stack.compliance.evaluateAndRecordClearance(key, { piiAuthorized: false });

    let blocked = false;
    try {
      await stack.runtime.execute(key, "MOT-CNT-01", { useStub: false, invoker: "DEP06Test" });
    } catch (err) {
      if (String(err.message).includes("DEP-06")) blocked = true;
      else errors.push(`Unexpected CNT-01 error: ${err.message}`);
    }
    if (!blocked) {
      errors.push("MOT-CNT-01 should be blocked without MOT-CMP-01 clearance (DEP-06)");
    }

    stack.compliance.evaluateAndRecordClearance(key, { piiAuthorized: true });
    const cntManifest = await stack.runtime.execute(key, "MOT-CNT-01", {
      useStub: false,
      invoker: "DEP06Test",
    });
    if (cntManifest.outputs?.contactGated !== true) {
      errors.push("MOT-CNT-01 should run with compliance clearance");
    }
  } catch (err) {
    errors.push(err.message);
  } finally {
    fs.rmSync(env.base, { recursive: true, force: true });
  }

  return { errors };
}

export async function validateMotivationConvergencePaths() {
  const errors = [];
  const envExhausted = createTempEnv();
  const envSwarm = createTempEnv();

  try {
    const exhausted = await bootstrapFullPipeline(envExhausted, { simulateSingleSignal: true });
    if (exhausted.dstResult.convergence.finalizer !== "FIN-X") {
      errors.push("LOOP-DST-CVG-01 should declare FIN-X when motivation exhausted");
    }
    if (!exhausted.dstResult.motivationExhausted) {
      errors.push("Single signal should mark motivation exhausted");
    }
  } catch (err) {
    errors.push(err.message);
  } finally {
    fs.rmSync(envExhausted.base, { recursive: true, force: true });
  }

  try {
    const swarm = await bootstrapFullPipeline(envSwarm, { simulateMultiSignalFailure: true });
    const record = swarm.registry.getExpediente(swarm.dstResult.factoryKey);
    const swarms = record.elr.swarm_mission_refs ?? [];
    const hasStr6 = swarms.some((s) => s.route?.strategy === "STR-6");
    if (!hasStr6 && swarm.dstResult.convergence.escalatesToSwarm !== true) {
      errors.push("STR-6 should derive to Swarm Coordinator (CB-12) on multi-signal failure");
    }
    if (swarm.dstResult.convergence.conflictRoute?.target !== DST_CONFLICT_TARGETS.SWARM) {
      errors.push("Conflict route target should be CB-12:SwarmCoordinator");
    }
  } catch (err) {
    errors.push(err.message);
  } finally {
    fs.rmSync(envSwarm.base, { recursive: true, force: true });
  }

  return { errors };
}

export async function validateMpiDistressDomains() {
  const errors = [];
  const env = createTempEnv();

  try {
    const { dstResult } = await bootstrapFullPipeline(env);
    for (const domain of DISTRESS_MPI_DOMAINS) {
      const covered = dstResult.mpiCoverage.find((c) => c.domain === domain);
      if (!covered?.reachable) {
        errors.push(`MPI distress domain ${domain} should be reachable`);
      }
    }
  } catch (err) {
    errors.push(err.message);
  } finally {
    fs.rmSync(env.base, { recursive: true, force: true });
  }

  return { errors };
}

export async function validateEvidenceIngestAndConflicts() {
  const errors = [];
  const env = createTempEnv();

  try {
    const stack = createFullStack(env);
    const foundationResult = await stack.foundation.bootstrapFoundation({
      candidateRef: "cb08-evd-test",
      parcelId: "dst-evd-001",
    });
    await stack.evidence.processFoundationEvidence(foundationResult.factoryKey);
    await stack.legitimacy.bootstrapLegitimacy(foundationResult.factoryKey);
    const dstResult = await stack.distress.bootstrapDistress(foundationResult.factoryKey);

    const key = foundationResult.factoryKey;
    const record = stack.registry.getExpediente(key);
    const dstManifests = (record.elr.motor_manifests ?? []).filter(
      (m) => isMaterialMotorManifest(m) && isDistressMotor(m.motorId)
    );
    if (dstManifests.length < 15) {
      errors.push("Expected distress motor manifests in ELR");
    }
    if (dstResult.evidence.registration.coverage < 1) {
      errors.push("Distress deltas not fully registered in MOT-EVD-01");
    }
    if (record.elr.evidence_registry_ref?.layer !== "DST") {
      errors.push("evidence_registry_ref should reflect DST layer");
    }

    const snapshot = stack.evidence.evd01.getRegistrySnapshot(key);
    const suff1 = evaluateDistressSufficiency(snapshot, key, stack.distress.knowledgeStore);
    const suff2 = evaluateDistressSufficiency(snapshot, key, stack.distress.knowledgeStore);
    if (suff1.status !== suff2.status) {
      errors.push("Distress sufficiency not reproducible");
    }
    if (suff1.status !== SUFFICIENCY_STATUS.PASS) {
      errors.push(`Expected dst sufficiency PASS, got ${suff1.status}: ${suff1.reasons?.join(", ")}`);
    }

    try {
      assertNoAveraging("AVERAGE");
      errors.push("Averaging should be prohibited");
    } catch {
      // expected
    }

    const evd02 = new MotEvd02({ store: stack.evidence.evidenceStore });
    const arbitration = evd02.arbitrate({
      factoryKey: key,
      field: "distressSignal",
      sources: [
        { sourceRefId: "SRC-LST", value: "stable", eLevel: "E2" },
        { sourceRefId: "SRC-RCR", value: "pre_foreclosure", eLevel: "E4", organismId: "ORG-RCR-MC" },
      ],
    });
    if (arbitration.prevailingSourceRefId !== "SRC-RCR") {
      errors.push("Registral E4 should prevail in distress signal conflict");
    }
  } catch (err) {
    errors.push(err.message);
  } finally {
    fs.rmSync(env.base, { recursive: true, force: true });
  }

  return { errors };
}

export function validateOmcAndLienRisksDocumented() {
  const errors = [];
  if (OMC_MOTOR_COUNT_CONSTITUTIONAL !== 52) {
    errors.push("Constitutional OMC count should remain 52");
  }
  if (DEFERRED_OMC_MOTOR_LIEN_01 !== "MOT-LIEN-01") {
    errors.push("MOT-LIEN-01 deferral should be documented");
  }
  return {
    errors,
    reconciliationDeferred: true,
    motLien01Deferred: true,
  };
}

/**
 * @param {{ markComplete?: boolean, approvedBy?: string }} [options]
 */
export async function runCb08Validation(options = {}) {
  const gov = validateCb08Governance();
  const handoff = await validateLegToDstHandoff();
  const dep06 = await validateDep06CntGate();
  const convergence = await validateMotivationConvergencePaths();
  const mpi = await validateMpiDistressDomains();
  const evidence = await validateEvidenceIngestAndConflicts();
  const risks = validateOmcAndLienRisksDocumented();

  const allErrors = [
    ...gov.errors,
    ...handoff.errors,
    ...dep06.errors,
    ...convergence.errors,
    ...mpi.errors,
    ...evidence.errors,
    ...risks.errors,
  ];

  const checklist = [
    {
      id: "CB08-01",
      criterion: "Handoff LEG-SUP → DST-SUP completado",
      status: handoff.errors.length === 0 ? CHECKLIST_STATUS.PASS : CHECKLIST_STATUS.PENDING,
    },
    {
      id: "CB08-02",
      criterion: "MOT-CNT-01 solo opera con MOT-CMP-01 clearance (DEP-06)",
      status: dep06.errors.length === 0 ? CHECKLIST_STATUS.PASS : CHECKLIST_STATUS.PENDING,
    },
    {
      id: "CB08-03",
      criterion: "LOOP-DST-CVG-01 declara motivation sufficient o agotada",
      status:
        handoff.errors.length === 0 && convergence.errors.length === 0
          ? CHECKLIST_STATUS.PASS
          : CHECKLIST_STATUS.PENDING,
    },
    {
      id: "CB08-04",
      criterion: "STR-6 deriva a Swarm Coordinator (CB-12)",
      status: convergence.errors.length === 0 ? CHECKLIST_STATUS.PASS : CHECKLIST_STATUS.PENDING,
    },
    {
      id: "CB08-05",
      criterion: "Dominios MPI distress (08–12, 16–19, 26) alcanzables",
      status: mpi.errors.length === 0 ? CHECKLIST_STATUS.PASS : CHECKLIST_STATUS.PENDING,
    },
    {
      id: "CB08-06",
      criterion: "Evidencias DST registradas en EVF/ELR",
      status: evidence.errors.length === 0 ? CHECKLIST_STATUS.PASS : CHECKLIST_STATUS.PENDING,
    },
  ];

  const passed = allErrors.length === 0 && checklist.every((i) => i.status === CHECKLIST_STATUS.PASS);

  let phaseRecord = null;
  if (passed && options.markComplete) {
    phaseRecord = markPhaseComplete("CB-08", {
      validationReport: "runCb08DistressValidation",
      approvedBy: options.approvedBy ?? null,
      pendingDirectorApproval: !options.approvedBy,
    });
  }

  return {
    phase: "CB-08",
    passed,
    errors: allErrors,
    checklist,
    omcMotorCountRisk: {
      constitutional: OMC_MOTOR_COUNT_CONSTITUTIONAL,
      cb04CatalogIndexed: 56,
      reconciliationDeferred: risks.reconciliationDeferred,
    },
    motLien01Deferred: risks.motLien01Deferred,
    phaseRecord,
    cb09Unlocked: passed ? isPhaseApproved("CB-08") : false,
  };
}

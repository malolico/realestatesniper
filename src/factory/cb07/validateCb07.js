/**
 * CB-07 validation — Legitimacy Layer acceptance tests.
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
import { MOTOR_CATALOG_COUNT } from "../cb04/motorCatalogIndex.js";
import { FoundationKnowledgeStore } from "../cb05/foundationKnowledgeStore.js";
import { FoundationLayerService } from "../cb05/foundationLayerService.js";
import { EvidenceService } from "../cb06/evidenceService.js";
import { EvidenceRegistryStore } from "../cb06/evidenceRegistryStore.js";
import { MotEvd02 } from "../cb06/motEvd02.js";
import { isMaterialMotorManifest } from "../cb06/evidenceIntercept.js";
import { SUFFICIENCY_STATUS } from "../cb06/sufficiencyGate.js";
import { LegitimacyKnowledgeStore } from "./legitimacyKnowledgeStore.js";
import { LegitimacyLayerService } from "./legitimacyLayerService.js";
import { LEGITIMACY_DDI_PART_II, OMC_MOTOR_COUNT_CONSTITUTIONAL, isLegitimacyMotor } from "./legitimacyCatalog.js";
import { evaluateLegitimacySufficiency } from "./legitimacyEvidenceIngest.js";
import { LEG_CONFLICT_TARGETS } from "./legitimacyConflictRouter.js";

function createTempEnv() {
  const base = fs.mkdtempSync(path.join(os.tmpdir(), "cb07-validation-"));
  return {
    base,
    registryDir: path.join(base, "registry"),
    complianceDir: path.join(base, "compliance"),
    foundationDir: path.join(base, "foundation"),
    evidenceDir: path.join(base, "evidence"),
    legitimacyDir: path.join(base, "legitimacy"),
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
  return { registry, foundation, evidence, legitimacy, runtime };
}

async function bootstrapFullPipeline(env, legInputs = {}) {
  const stack = createFullStack(env);
  const foundationResult = await stack.foundation.bootstrapFoundation({
    candidateRef: "cb07-legitimacy-test",
    parcelId: "leg-100-200",
  });
  await stack.evidence.processFoundationEvidence(foundationResult.factoryKey);
  const legResult = await stack.legitimacy.bootstrapLegitimacy(
    foundationResult.factoryKey,
    { inputs: legInputs }
  );
  return { ...stack, foundationResult, legResult };
}

export function validateCb07Governance() {
  const errors = [];
  try {
    assertPhaseUnlocked("CB-07");
  } catch (err) {
    errors.push(err.message);
  }
  if (!isPhaseApproved("CB-06")) {
    errors.push("CB-06 is not APPROVED");
  }
  return { errors };
}

export async function validateFndToLegHandoff() {
  const errors = [];
  const env = createTempEnv();

  try {
    const { legResult, registry } = await bootstrapFullPipeline(env);
    const handoffs = registry.getExpediente(legResult.factoryKey).elr.decision_handoffs;
    const fndAccept = handoffs.find((h) => h.kind === "LEG_ACCEPT_FND_HANDOFF");
    if (!fndAccept) {
      errors.push("FND-SUP → LEG-SUP handoff not recorded");
    }
    if (legResult.quality.finalizer !== "FIN-S" || !legResult.quality.sufficient) {
      errors.push("LOOP-LEG-SUP-01 should reach FIN-S on clean run");
    }
    const legHandoff = handoffs.find((h) => h.kind === "LEG_FIN_S_HANDOFF");
    if (!legHandoff || legHandoff.toLoop !== "LOOP-DST-SUP-01") {
      errors.push("LEG FIN-S handoff to DST missing");
    }
    if (!legResult.transferReady) {
      errors.push("Transfer assessment should be complete");
    }
  } catch (err) {
    errors.push(err.message);
  } finally {
    fs.rmSync(env.base, { recursive: true, force: true });
  }

  return { errors };
}

export async function validateDdiPartIiBlockers() {
  const errors = [];
  const env = createTempEnv();

  try {
    const { legResult } = await bootstrapFullPipeline(env, {
      simulateTitleCloud: true,
      simulateOwnerMismatch: true,
    });

    const c1Blockers = legResult.blockers.filter((b) => b.severity === "C1");
    if (c1Blockers.length < 2) {
      errors.push("Expected C1 blockers for DDI Part II conflicts");
    }

    if (legResult.quality.finalizer === "FIN-S") {
      errors.push("FIN-S should not apply with active C1 blockers");
    }

    for (const domain of LEGITIMACY_DDI_PART_II.mpiDomains) {
      const covered = legResult.mpiCoverage.find((c) => c.domain === domain);
      if (!covered?.reachable && domain !== "11") {
        // domain 11 optional in pilot
        if (["07", "08", "09", "10"].includes(domain) && !covered?.reachable) {
          errors.push(`DDI Part II domain ${domain} should be reachable`);
        }
      }
    }
  } catch (err) {
    errors.push(err.message);
  } finally {
    fs.rmSync(env.base, { recursive: true, force: true });
  }

  return { errors };
}

export async function validateLegEvdSwarmEscalation() {
  const errors = [];
  const env = createTempEnv();

  try {
    const { legResult, registry } = await bootstrapFullPipeline(env, {
      simulateOwnerMismatch: true,
      simulateTitleCloud: true,
      simulateJuniorLien: true,
    });

    const record = registry.getExpediente(legResult.factoryKey);
    const swarms = record.elr.swarm_mission_refs ?? [];
    const xvr = (record.elr.loop_ledger_refs ?? []).filter(
      (r) => r.kind === "LOOP_XVR_EVD_01_ESCALATION"
    );

    const hasSwarm =
      swarms.some((s) => s.route?.target === LEG_CONFLICT_TARGETS.SWARM_EVD) ||
      legResult.evdChallenge.escalatesToSwarm === true;

    if (!hasSwarm) {
      errors.push("LOOP-LEG-EVD-01 should escalate multi-domain conflict to SWM-EVD");
    }
    if (xvr.length < 1) {
      errors.push("LOOP-XVR-EVD-01 escalation not recorded");
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
      candidateRef: "cb07-evd-test",
      parcelId: "leg-evd-001",
    });
    await stack.evidence.processFoundationEvidence(foundationResult.factoryKey);
    const legResult = await stack.legitimacy.bootstrapLegitimacy(foundationResult.factoryKey);

    const key = foundationResult.factoryKey;
    const record = stack.registry.getExpediente(key);
    const legManifests = (record.elr.motor_manifests ?? []).filter(
      (m) => isMaterialMotorManifest(m) && isLegitimacyMotor(m.motorId)
    );
    if (legManifests.length < 8) {
      errors.push("Expected legitimacy motor manifests in ELR");
    }
    if (legResult.evidence.registration.coverage < 1) {
      errors.push("Legitimacy deltas not fully registered in MOT-EVD-01");
    }
    if (record.elr.evidence_registry_ref?.layer !== "LEG") {
      errors.push("evidence_registry_ref should reflect LEG layer");
    }

    const snapshot = stack.evidence.evd01.getRegistrySnapshot(key);
    const suff1 = evaluateLegitimacySufficiency(
      snapshot,
      key,
      stack.legitimacy.knowledgeStore
    );
    const suff2 = evaluateLegitimacySufficiency(
      snapshot,
      key,
      stack.legitimacy.knowledgeStore
    );
    if (suff1.status !== suff2.status) {
      errors.push("Legitimacy sufficiency not reproducible");
    }
    if (suff1.status !== SUFFICIENCY_STATUS.PASS) {
      errors.push(`Expected leg sufficiency PASS, got ${suff1.status}`);
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
      field: "recordOwner",
      sources: [
        { sourceRefId: "SRC-TTL", value: "Jones LLC", eLevel: "E2" },
        { sourceRefId: "SRC-RCR", value: "Smith Trust", eLevel: "E4", organismId: "ORG-RCR-MC" },
      ],
    });
    if (arbitration.prevailingSourceRefId !== "SRC-RCR") {
      errors.push("Registral E4 should prevail in ownership conflict (LS-09)");
    }
  } catch (err) {
    errors.push(err.message);
  } finally {
    fs.rmSync(env.base, { recursive: true, force: true });
  }

  return { errors };
}

export function validateOmcCountRiskDocumented() {
  const errors = [];
  if (OMC_MOTOR_COUNT_CONSTITUTIONAL !== 52) {
    errors.push("Constitutional OMC count should remain 52");
  }
  return { errors, reconciliationDeferred: false };
}

/**
 * @param {{ markComplete?: boolean, approvedBy?: string }} [options]
 */
export async function runCb07Validation(options = {}) {
  const gov = validateCb07Governance();
  const handoff = await validateFndToLegHandoff();
  const blockers = await validateDdiPartIiBlockers();
  const swarm = await validateLegEvdSwarmEscalation();
  const evidence = await validateEvidenceIngestAndConflicts();
  const omcRisk = validateOmcCountRiskDocumented();

  const allErrors = [
    ...gov.errors,
    ...handoff.errors,
    ...blockers.errors,
    ...swarm.errors,
    ...evidence.errors,
    ...omcRisk.errors,
  ];

  const checklist = [
    {
      id: "CB07-01",
      criterion: "Handoff FND-SUP → LEG-SUP completado",
      status: handoff.errors.length === 0 ? CHECKLIST_STATUS.PASS : CHECKLIST_STATUS.PENDING,
    },
    {
      id: "CB07-02",
      criterion: "Blockers Obl. DDI Parte II identificados o resueltos",
      status: blockers.errors.length === 0 ? CHECKLIST_STATUS.PASS : CHECKLIST_STATUS.PENDING,
    },
    {
      id: "CB07-03",
      criterion: "LOOP-LEG-EVD-01 escala a SWM-EVD en conflicto multi-dominio",
      status: swarm.errors.length === 0 ? CHECKLIST_STATUS.PASS : CHECKLIST_STATUS.PENDING,
    },
    {
      id: "CB07-04",
      criterion: "Transfer assessment complete — habilita DST (CB-08)",
      status: handoff.errors.length === 0 ? CHECKLIST_STATUS.PASS : CHECKLIST_STATUS.PENDING,
    },
    {
      id: "CB07-05",
      criterion: "Evidencias LEG registradas en EVF/ELR",
      status: evidence.errors.length === 0 ? CHECKLIST_STATUS.PASS : CHECKLIST_STATUS.PENDING,
    },
  ];

  const passed = allErrors.length === 0 && checklist.every((i) => i.status === CHECKLIST_STATUS.PASS);

  let phaseRecord = null;
  if (passed && options.markComplete) {
    phaseRecord = markPhaseComplete("CB-07", {
      validationReport: "runCb07LegitimacyValidation",
      approvedBy: options.approvedBy ?? null,
      pendingDirectorApproval: !options.approvedBy,
    });
  }

  return {
    phase: "CB-07",
    passed,
    errors: allErrors,
    checklist,
    omcMotorCountRisk: {
      constitutional: OMC_MOTOR_COUNT_CONSTITUTIONAL,
      cb04CatalogIndexed: MOTOR_CATALOG_COUNT,
      reconciliationDeferred: omcRisk.reconciliationDeferred,
    },
    phaseRecord,
    cb08Unlocked: passed ? isPhaseApproved("CB-07") : false,
  };
}

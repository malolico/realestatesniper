/**
 * CB-10 validation — Environment Layer acceptance tests.
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
import { DistressKnowledgeStore } from "../cb08/distressKnowledgeStore.js";
import { DistressLayerService } from "../cb08/distressLayerService.js";
import { EconomyKnowledgeStore } from "../cb09/economyKnowledgeStore.js";
import { EconomyLayerService } from "../cb09/economyLayerService.js";
import { EnvironmentKnowledgeStore } from "./environmentKnowledgeStore.js";
import { EnvironmentLayerService } from "./environmentLayerService.js";
import {
  ENVIRONMENT_MPI_DOMAINS,
  OLC_PIPELINE_ORDER,
  OMC_MOTOR_COUNT_CONSTITUTIONAL,
  DEFERRED_OMC_MOTOR_FUT_02,
  DEFERRED_OMC_MOTOR_LIV_03,
  DEFERRED_OMC_MOTOR_LIEN_01,
  isEnvironmentMotor,
} from "./environmentCatalog.js";
import { evaluateEnvironmentSufficiency } from "./environmentEvidenceIngest.js";
import { ENV_CONFLICT_TARGETS } from "./environmentConflictRouter.js";

function createTempEnv() {
  const base = fs.mkdtempSync(path.join(os.tmpdir(), "cb10-validation-"));
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
  const economyKnowledgeStore = new EconomyKnowledgeStore(env.economyDir);
  const environmentKnowledgeStore = new EnvironmentKnowledgeStore(env.environmentDir);
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
  return {
    registry,
    foundation,
    evidence,
    legitimacy,
    distress,
    economy,
    environment,
    runtime,
  };
}

async function bootstrapFullPipeline(env, envInputs = {}) {
  const stack = createFullStack(env);
  const foundationResult = await stack.foundation.bootstrapFoundation({
    candidateRef: "cb10-environment-test",
    parcelId: "env-100-200",
  });
  await stack.evidence.processFoundationEvidence(foundationResult.factoryKey);
  await stack.legitimacy.bootstrapLegitimacy(foundationResult.factoryKey);
  await stack.distress.bootstrapDistress(foundationResult.factoryKey);
  await stack.economy.bootstrapEconomy(foundationResult.factoryKey);
  const envResult = await stack.environment.bootstrapEnvironment(foundationResult.factoryKey, {
    inputs: envInputs,
  });
  return { ...stack, foundationResult, envResult };
}

export function validateCb10Governance() {
  const errors = [];
  try {
    assertPhaseUnlocked("CB-10");
  } catch (err) {
    errors.push(err.message);
  }
  if (!isPhaseApproved("CB-09")) {
    errors.push("CB-09 is not APPROVED");
  }
  return { errors };
}

export async function validateEcoToEnvHandoff() {
  const errors = [];
  const env = createTempEnv();

  try {
    const { envResult, registry } = await bootstrapFullPipeline(env);
    const handoffs = registry.getExpediente(envResult.factoryKey).elr.decision_handoffs;
    const envAccept = handoffs.find((h) => h.kind === "ENV_ACCEPT_ECO_HANDOFF");
    if (!envAccept) {
      errors.push("ECO→ENV handoff not recorded");
    }
    const olcStage = handoffs.find((h) => h.kind === "OLC_PIPELINE_STAGE_ENV");
    if (!olcStage || olcStage.stage !== "ENV") {
      errors.push("ENV not integrated in OLC §IV.1 pipeline");
    }
    if (!OLC_PIPELINE_ORDER.includes("ENV") || !OLC_PIPELINE_ORDER.includes("INT")) {
      errors.push("OLC pipeline order missing ENV/INT stages");
    }
    if (envResult.quality.finalizer !== "FIN-S" || !envResult.quality.sufficient) {
      errors.push("LOOP-ENV-SUP-01 should reach FIN-S on clean run");
    }
    const envHandoff = handoffs.find((h) => h.kind === "ENV_FIN_S_HANDOFF");
    if (!envHandoff || envHandoff.toLoop !== "LOOP-INT-RDY-01") {
      errors.push("ENV→INT-RDY handoff missing");
    }
    if (!envResult.integrationReady) {
      errors.push("Integration readiness should be enabled after ENV FIN-S");
    }
  } catch (err) {
    errors.push(err.message);
  } finally {
    fs.rmSync(env.base, { recursive: true, force: true });
  }

  return { errors };
}

export async function validateMpiEnvironmentDomains() {
  const errors = [];
  const env = createTempEnv();

  try {
    const { envResult } = await bootstrapFullPipeline(env);
    for (const domain of ENVIRONMENT_MPI_DOMAINS) {
      const covered = envResult.mpiCoverage.find((c) => c.domain === domain);
      if (!covered?.reachable) {
        errors.push(`MPI environment domain ${domain} should be reachable`);
      }
    }
  } catch (err) {
    errors.push(err.message);
  } finally {
    fs.rmSync(env.base, { recursive: true, force: true });
  }

  return { errors };
}

export async function validateEnvironmentFreshnessSla() {
  const errors = [];
  const envFresh = createTempEnv();
  const envStale = createTempEnv();

  try {
    const fresh = await bootstrapFullPipeline(envFresh);
    if (!fresh.envResult.frs01.refreshed || fresh.envResult.frs01.finalizer !== "FIN-S") {
      errors.push("LOOP-ENV-FRS-01 should refresh context with current vintage (FIN-S)");
    }
  } catch (err) {
    errors.push(err.message);
  } finally {
    fs.rmSync(envFresh.base, { recursive: true, force: true });
  }

  try {
    const stale = await bootstrapFullPipeline(envStale, { simulateStaleCensus: true });
    if (stale.envResult.frs01.finalizer !== "FIN-X") {
      errors.push("LOOP-ENV-FRS-01 should declare FIN-X when census vintage stale");
    }
    if (stale.envResult.quality.sufficient) {
      errors.push("ENV-SUP should not FIN-S with stale census");
    }
  } catch (err) {
    errors.push(err.message);
  } finally {
    fs.rmSync(envStale.base, { recursive: true, force: true });
  }

  return { errors };
}

export async function validateEnvironmentConflicts() {
  const errors = [];
  const env = createTempEnv();

  try {
    const { envResult, registry } = await bootstrapFullPipeline(env, {
      simulateFairHousingRisk: true,
    });
    const record = registry.getExpediente(envResult.factoryKey);
    const conflicts = [
      ...(record.elr.conflict_resolutions ?? []),
      ...(record.elr.loop_ledger_refs ?? []),
    ].filter((c) => c.kind === "ENV_CONTEXT_CONFLICT");

    const hasRestriction = conflicts.some(
      (c) => c.route?.action === "RESTRICT_USAGE" || c.route?.strategy === "LS-17"
    );
    if (!hasRestriction) {
      errors.push("Fair Housing risk should record ENV_CONTEXT_CONFLICT with LS-17");
    }
    if (envResult.quality.sufficient) {
      errors.push("FIN-S should not apply with Fair Housing restriction active");
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
      candidateRef: "cb10-evd-test",
      parcelId: "env-evd-001",
    });
    await stack.evidence.processFoundationEvidence(foundationResult.factoryKey);
    await stack.legitimacy.bootstrapLegitimacy(foundationResult.factoryKey);
    await stack.distress.bootstrapDistress(foundationResult.factoryKey);
    await stack.economy.bootstrapEconomy(foundationResult.factoryKey);
    const envResult = await stack.environment.bootstrapEnvironment(foundationResult.factoryKey);

    const key = foundationResult.factoryKey;
    const record = stack.registry.getExpediente(key);
    const envManifests = (record.elr.motor_manifests ?? []).filter(
      (m) => isMaterialMotorManifest(m) && isEnvironmentMotor(m.motorId)
    );
    if (envManifests.length < 5) {
      errors.push("Expected environment motor manifests in ELR");
    }
    if (envResult.evidence.registration.coverage < 1) {
      errors.push("Environment deltas not fully registered in MOT-EVD-01");
    }
    if (record.elr.evidence_registry_ref?.layer !== "ENV") {
      errors.push("evidence_registry_ref should reflect ENV layer");
    }

    const snapshot = stack.evidence.evd01.getRegistrySnapshot(key);
    const suff1 = evaluateEnvironmentSufficiency(snapshot, key, stack.environment.knowledgeStore);
    const suff2 = evaluateEnvironmentSufficiency(snapshot, key, stack.environment.knowledgeStore);
    if (suff1.status !== suff2.status) {
      errors.push("Environment sufficiency not reproducible");
    }
    if (suff1.status !== SUFFICIENCY_STATUS.PASS) {
      errors.push(`Expected env sufficiency PASS, got ${suff1.status}: ${suff1.reasons?.join(", ")}`);
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
      field: "crimeTrend",
      sources: [
        { sourceRefId: "SRC-WEB", value: "rising", eLevel: "E1" },
        { sourceRefId: "SRC-PRH", value: "declining", eLevel: "E3", organismId: "ORG-PRH-SCR" },
      ],
    });
    if (arbitration.prevailingSourceRefId !== "SRC-PRH") {
      errors.push("Public records E3 should prevail in contextual conflict");
    }
  } catch (err) {
    errors.push(err.message);
  } finally {
    fs.rmSync(env.base, { recursive: true, force: true });
  }

  return { errors };
}

export function validateOmcAndDeferredRisksDocumented() {
  const errors = [];
  if (OMC_MOTOR_COUNT_CONSTITUTIONAL !== 52) {
    errors.push("Constitutional OMC count should remain 52");
  }
  if (DEFERRED_OMC_MOTOR_FUT_02 !== "MOT-FUT-02") {
    errors.push("MOT-FUT-02 deferral should be documented");
  }
  if (DEFERRED_OMC_MOTOR_LIV_03 !== "MOT-LIV-03") {
    errors.push("MOT-LIV-03 deferral should be documented");
  }
  return {
    errors,
    reconciliationDeferred: true,
    motFut02Deferred: true,
    motLiv03Deferred: true,
    motLien01Deferred: DEFERRED_OMC_MOTOR_LIEN_01 === "MOT-LIEN-01",
  };
}

/**
 * @param {{ markComplete?: boolean, approvedBy?: string }} [options]
 */
export async function runCb10Validation(options = {}) {
  const gov = validateCb10Governance();
  const handoff = await validateEcoToEnvHandoff();
  const mpi = await validateMpiEnvironmentDomains();
  const freshness = await validateEnvironmentFreshnessSla();
  const conflicts = await validateEnvironmentConflicts();
  const evidence = await validateEvidenceIngestAndConflicts();
  const risks = validateOmcAndDeferredRisksDocumented();

  const allErrors = [
    ...gov.errors,
    ...handoff.errors,
    ...mpi.errors,
    ...freshness.errors,
    ...conflicts.errors,
    ...evidence.errors,
    ...risks.errors,
  ];

  const checklist = [
    {
      id: "CB10-01",
      criterion: "Dominios MPI 33–37 cubiertos",
      status: mpi.errors.length === 0 ? CHECKLIST_STATUS.PASS : CHECKLIST_STATUS.PENDING,
    },
    {
      id: "CB10-02",
      criterion: "LOOP-ENV-FRS-01 renueva contexto según SLA DSO",
      status: freshness.errors.length === 0 ? CHECKLIST_STATUS.PASS : CHECKLIST_STATUS.PENDING,
    },
    {
      id: "CB10-03",
      criterion: "Handoff ENV integrado en pipeline OLC §IV.1",
      status: handoff.errors.length === 0 ? CHECKLIST_STATUS.PASS : CHECKLIST_STATUS.PENDING,
    },
    {
      id: "CB10-04",
      criterion: "Handoff ECO→ENV respetado",
      status: handoff.errors.length === 0 ? CHECKLIST_STATUS.PASS : CHECKLIST_STATUS.PENDING,
    },
    {
      id: "CB10-05",
      criterion: "Evidencias ENV registradas en EVF/ELR",
      status: evidence.errors.length === 0 ? CHECKLIST_STATUS.PASS : CHECKLIST_STATUS.PENDING,
    },
    {
      id: "CB10-06",
      criterion: "Conflictos entorno/contexto gobernados",
      status: conflicts.errors.length === 0 ? CHECKLIST_STATUS.PASS : CHECKLIST_STATUS.PENDING,
    },
  ];

  const passed = allErrors.length === 0 && checklist.every((i) => i.status === CHECKLIST_STATUS.PASS);

  let phaseRecord = null;
  if (passed && options.markComplete) {
    phaseRecord = markPhaseComplete("CB-10", {
      validationReport: "runCb10EnvironmentValidation",
      approvedBy: options.approvedBy ?? null,
      pendingDirectorApproval: !options.approvedBy,
    });
  }

  return {
    phase: "CB-10",
    passed,
    errors: allErrors,
    checklist,
    omcMotorCountRisk: {
      constitutional: OMC_MOTOR_COUNT_CONSTITUTIONAL,
      cb04CatalogIndexed: 56,
      reconciliationDeferred: risks.reconciliationDeferred,
    },
    motFut02Deferred: risks.motFut02Deferred,
    motLiv03Deferred: risks.motLiv03Deferred,
    motLien01Deferred: risks.motLien01Deferred,
    phaseRecord,
    cb11Unlocked: passed ? isPhaseApproved("CB-10") : false,
  };
}

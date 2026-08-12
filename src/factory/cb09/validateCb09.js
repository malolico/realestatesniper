/**
 * CB-09 validation — Economy Layer acceptance tests.
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
import { LegitimacyKnowledgeStore } from "../cb07/legitimacyKnowledgeStore.js";
import { LegitimacyLayerService } from "../cb07/legitimacyLayerService.js";
import { DistressKnowledgeStore } from "../cb08/distressKnowledgeStore.js";
import { DistressLayerService } from "../cb08/distressLayerService.js";
import { EconomyKnowledgeStore } from "./economyKnowledgeStore.js";
import { EconomyLayerService } from "./economyLayerService.js";
import {
  ECONOMY_MPI_DOMAINS,
  OMC_MOTOR_COUNT_CONSTITUTIONAL,
  DEFERRED_OMC_MOTOR_FIN_03,
  DEFERRED_OMC_MOTOR_LIEN_01,
  isEconomyMotor,
} from "./economyCatalog.js";
import { evaluateEconomySufficiency } from "./economyEvidenceIngest.js";
import { ECO_CONFLICT_TARGETS } from "./economyConflictRouter.js";

function createTempEnv() {
  const base = fs.mkdtempSync(path.join(os.tmpdir(), "cb09-validation-"));
  return {
    base,
    registryDir: path.join(base, "registry"),
    complianceDir: path.join(base, "compliance"),
    foundationDir: path.join(base, "foundation"),
    evidenceDir: path.join(base, "evidence"),
    legitimacyDir: path.join(base, "legitimacy"),
    distressDir: path.join(base, "distress"),
    economyDir: path.join(base, "economy"),
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
  return { registry, foundation, evidence, legitimacy, distress, economy, runtime };
}

async function bootstrapFullPipeline(env, ecoInputs = {}) {
  const stack = createFullStack(env);
  const foundationResult = await stack.foundation.bootstrapFoundation({
    candidateRef: "cb09-economy-test",
    parcelId: "eco-100-200",
  });
  await stack.evidence.processFoundationEvidence(foundationResult.factoryKey);
  await stack.legitimacy.bootstrapLegitimacy(foundationResult.factoryKey);
  await stack.distress.bootstrapDistress(foundationResult.factoryKey);
  const ecoResult = await stack.economy.bootstrapEconomy(foundationResult.factoryKey, {
    inputs: ecoInputs,
  });
  return { ...stack, foundationResult, ecoResult };
}

export function validateCb09Governance() {
  const errors = [];
  try {
    assertPhaseUnlocked("CB-09");
  } catch (err) {
    errors.push(err.message);
  }
  if (!isPhaseApproved("CB-08")) {
    errors.push("CB-08 is not APPROVED");
  }
  return { errors };
}

export async function validateDstToEcoHandoff() {
  const errors = [];
  const env = createTempEnv();

  try {
    const { ecoResult, registry } = await bootstrapFullPipeline(env);
    const handoffs = registry.getExpediente(ecoResult.factoryKey).elr.decision_handoffs;
    const ecoAccept = handoffs.find((h) => h.kind === "ECO_ACCEPT_DST_HANDOFF");
    if (!ecoAccept) {
      errors.push("DST→ECO handoff not recorded");
    }
    if (!ecoResult.supervisor.lk04Compliant || ecoResult.supervisor.motorsReExecuted) {
      errors.push("LOOP-ECO-SUP-01 must coordinate sub-loops only (LK-04)");
    }
    if (ecoResult.supervisor.finalizer !== "FIN-S" || !ecoResult.supervisor.sufficient) {
      errors.push("LOOP-ECO-SUP-01 should reach FIN-S on clean run");
    }
    const ecoHandoff = handoffs.find((h) => h.kind === "ECO_FIN_S_HANDOFF");
    if (!ecoHandoff || ecoHandoff.toLoop !== "LOOP-INT-RDY-01") {
      errors.push("ECO→INT-RDY handoff missing");
    }
    if (!ecoResult.integrationReady) {
      errors.push("Integration readiness handoff should be enabled");
    }
  } catch (err) {
    errors.push(err.message);
  } finally {
    fs.rmSync(env.base, { recursive: true, force: true });
  }

  return { errors };
}

export async function validateMpiEconomyDomains() {
  const errors = [];
  const env = createTempEnv();

  try {
    const { ecoResult } = await bootstrapFullPipeline(env);
    for (const domain of ECONOMY_MPI_DOMAINS) {
      const covered = ecoResult.mpiCoverage.find((c) => c.domain === domain);
      if (!covered?.reachable) {
        errors.push(`MPI economy domain ${domain} should be reachable`);
      }
    }
  } catch (err) {
    errors.push(err.message);
  } finally {
    fs.rmSync(env.base, { recursive: true, force: true });
  }

  return { errors };
}

export async function validateSwarmDerivation() {
  const errors = [];
  const envVal = createTempEnv();
  const envInv = createTempEnv();

  try {
    const val = await bootstrapFullPipeline(envVal, { simulateInsufficientComps: true });
    const record = val.registry.getExpediente(val.ecoResult.factoryKey);
    const swarms = record.elr.swarm_mission_refs ?? [];
    const hasValSwarm = swarms.some((s) => s.route?.target === ECO_CONFLICT_TARGETS.SWARM_VAL);
    if (!hasValSwarm && val.ecoResult.qlt01.escalatesToSwarm !== true) {
      errors.push("Valuation conflict should derive SWM-VAL-01 (CB-12)");
    }
  } catch (err) {
    errors.push(err.message);
  } finally {
    fs.rmSync(envVal.base, { recursive: true, force: true });
  }

  try {
    const inv = await bootstrapFullPipeline(envInv, { simulateMultiStrategy: true });
    const record = inv.registry.getExpediente(inv.ecoResult.factoryKey);
    const swarms = record.elr.swarm_mission_refs ?? [];
    const hasIvmSwarm = swarms.some((s) => s.route?.target === ECO_CONFLICT_TARGETS.SWARM_IVM);
    if (!hasIvmSwarm && inv.ecoResult.qlt02.escalatesToSwarm !== true) {
      errors.push("Multi-strategy conflict should derive SWM-IVM-01 (CB-12)");
    }
  } catch (err) {
    errors.push(err.message);
  } finally {
    fs.rmSync(envInv.base, { recursive: true, force: true });
  }

  return { errors };
}

export async function validateEvidenceIngestAndConflicts() {
  const errors = [];
  const env = createTempEnv();

  try {
    const stack = createFullStack(env);
    const foundationResult = await stack.foundation.bootstrapFoundation({
      candidateRef: "cb09-evd-test",
      parcelId: "eco-evd-001",
    });
    await stack.evidence.processFoundationEvidence(foundationResult.factoryKey);
    await stack.legitimacy.bootstrapLegitimacy(foundationResult.factoryKey);
    await stack.distress.bootstrapDistress(foundationResult.factoryKey);
    const ecoResult = await stack.economy.bootstrapEconomy(foundationResult.factoryKey);

    const key = foundationResult.factoryKey;
    const record = stack.registry.getExpediente(key);
    const ecoManifests = (record.elr.motor_manifests ?? []).filter(
      (m) => isMaterialMotorManifest(m) && isEconomyMotor(m.motorId)
    );
    if (ecoManifests.length < 9) {
      errors.push("Expected economy motor manifests in ELR");
    }
    if (ecoResult.evidence.registration.coverage < 1) {
      errors.push("Economy deltas not fully registered in MOT-EVD-01");
    }
    if (record.elr.evidence_registry_ref?.layer !== "ECO") {
      errors.push("evidence_registry_ref should reflect ECO layer");
    }

    const snapshot = stack.evidence.evd01.getRegistrySnapshot(key);
    const suff1 = evaluateEconomySufficiency(snapshot, key, stack.economy.knowledgeStore);
    const suff2 = evaluateEconomySufficiency(snapshot, key, stack.economy.knowledgeStore);
    if (suff1.status !== suff2.status) {
      errors.push("Economy sufficiency not reproducible");
    }
    if (suff1.status !== SUFFICIENCY_STATUS.PASS) {
      errors.push(`Expected eco sufficiency PASS, got ${suff1.status}: ${suff1.reasons?.join(", ")}`);
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
      field: "asIsValue",
      sources: [
        { sourceRefId: "SRC-MLS", value: 320000, eLevel: "E2" },
        { sourceRefId: "SRC-ASR", value: 335000, eLevel: "E3", organismId: "ORG-ASR-MC" },
      ],
    });
    if (arbitration.prevailingSourceRefId !== "SRC-ASR") {
      errors.push("Assessor E3 should prevail over MLS E2 in valuation conflict");
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
  if (DEFERRED_OMC_MOTOR_FIN_03 !== "MOT-FIN-03") {
    errors.push("MOT-FIN-03 deferral should be documented");
  }
  if (DEFERRED_OMC_MOTOR_LIEN_01 !== "MOT-LIEN-01") {
    errors.push("MOT-LIEN-01 deferral should be documented");
  }
  return {
    errors,
    reconciliationDeferred: false,
    motFin03Deferred: true,
    motLien01Deferred: true,
  };
}

/**
 * PS05-04 — Economy honesty + Pima RECORDED_REAL proofs (T01–T04, T07, T10, P01/P06).
 */
export async function validatePs0504RecordedRealHonestyCb09() {
  const errors = [];
  const pimaRoot = path.resolve(
    path.dirname(fileURLToPath(import.meta.url)),
    "../../../data/factory-dso-packs/pima/real-pilot-001"
  );
  const maricopaRoot = path.resolve(
    path.dirname(fileURLToPath(import.meta.url)),
    "../../../data/factory-dso-packs/maricopa/pilot-001"
  );
  const inputs = {
    recordedPackRoot: pimaRoot,
    contentClass: "RECORDED_REAL",
    recordedReal: true,
  };

  try {
    const { validateRecordedPack } = await import("../cb02/connectors/recordedPackValidator.js");
    const { loadEconomyRecordedRealEnrichment } = await import("./economyRecordedEnrichment.js");
    const { ECONOMY_MOTOR_HANDLERS } = await import("./economyMotorHandlers.js");

    const pimaPack = validateRecordedPack(pimaRoot);
    if (!pimaPack.ok || pimaPack.manifest?.contentClass !== "RECORDED_REAL") {
      errors.push("T07: Pima pack must validate as RECORDED_REAL");
    }
    if (!pimaPack.manifest?.organisms?.some((o) => o.organismId === "ORG-ASR-PC")) {
      errors.push("T07: Pima Assessor organism must be recognized in pack");
    }

    const mcPack = validateRecordedPack(maricopaRoot);
    if (!mcPack.ok) {
      errors.push("T09: Maricopa pilot-001 must continue to validate");
    }
    if (mcPack.manifest?.contentClass === "RECORDED_REAL") {
      errors.push("T09: Maricopa synthetic pilot must not be classified RECORDED_REAL");
    }
    const mcReal = loadEconomyRecordedRealEnrichment(maricopaRoot, {
      factoryKey: "t09-mc",
    });
    if (mcReal.ok === true) {
      errors.push("T09: Maricopa pilot cannot satisfy RECORDED_REAL enrichment proof");
    }

    const loaded = loadEconomyRecordedRealEnrichment(pimaRoot, {
      factoryKey: "ps05-04-eco",
    });
    if (!loaded.ok) {
      errors.push(`P01/P02 load failed: ${loaded.reason}`);
    } else {
      if (loaded.assessorOrganismId !== "ORG-ASR-PC") {
        errors.push("T07: Assessor organism must be ORG-ASR-PC");
      }
      if (loaded.gisOrganismId !== "ORG-GIS-PC") {
        errors.push("T08: GIS organism must be ORG-GIS-PC");
      }
      if (!loaded.identity?.match) {
        errors.push("T10: Pima ASR + GIS must resolve same identity");
      }
      if (loaded.economics?.fullCashValue !== 21956) {
        errors.push("T04: evidenced FCV 21956 must retain in economics envelope");
      }
      if (!loaded.economics?.provenance?.fields?.includes("valuation.fullCashValue")) {
        errors.push("T04: evidenced valuation must retain provenance fields");
      }
    }

    const fin01 = await ECONOMY_MOTOR_HANDLERS["MOT-FIN-01"]({
      factoryKey: "ps05-04-t01",
      inputs,
    });
    const fin02 = await ECONOMY_MOTOR_HANDLERS["MOT-FIN-02"]({
      factoryKey: "ps05-04-t02",
      inputs,
    });
    const inv01 = await ECONOMY_MOTOR_HANDLERS["MOT-INV-01"]({
      factoryKey: "ps05-04-t03",
      inputs,
    });
    const mkt01 = await ECONOMY_MOTOR_HANDLERS["MOT-MKT-01"]({
      factoryKey: "ps05-04-t-sub",
      inputs,
    });

    if (fin01.outputs?.equity === 125000) {
      errors.push("T01: hardcoded equity 125000 must not enter RECORDED_REAL");
    }
    if (fin01.outputs?.equity !== "UNKNOWN") {
      errors.push("T01: equity without debt evidence must be UNKNOWN");
    }
    if (fin02.outputs?.mortgageBalance !== "UNKNOWN") {
      errors.push("T02: missing debt/mortgage must be UNKNOWN");
    }
    if (inv01.outputs?.roi !== "UNKNOWN") {
      errors.push("T03: missing ROI must be UNKNOWN");
    }
    if (mkt01.outputs?.submarket === "Phoenix-NW") {
      errors.push("T01: fabricated Phoenix-NW must not enter RECORDED_REAL");
    }
    if (fin01.outputs?.contentClass !== "RECORDED_REAL" || fin01.outputs?.synthetic === true) {
      errors.push("P01: RECORDED_REAL economy outputs must be non-synthetic");
    }
    if (fin01.outputs?.fullCashValue !== 21956 || fin01.outputs?.limitedValue !== 18346) {
      errors.push("P06: evidenced FCV/Limited Value must surface on Decision-facing path");
    }

    // Freshness/provenance survive on SourceRefs
    if (!loaded.ok || loaded.assessor?.freshness?.recordedOnly !== true) {
      errors.push("T11: provenance/trust/freshness markers must survive on SourceRefs");
    }
  } catch (err) {
    errors.push(err.message);
  }

  return { errors };
}

/**
 * @param {{ markComplete?: boolean, approvedBy?: string }} [options]
 */
export async function runCb09Validation(options = {}) {
  const gov = validateCb09Governance();
  const handoff = await validateDstToEcoHandoff();
  const mpi = await validateMpiEconomyDomains();
  const swarm = await validateSwarmDerivation();
  const evidence = await validateEvidenceIngestAndConflicts();
  const risks = validateOmcAndDeferredRisksDocumented();
  const ps0504 = await validatePs0504RecordedRealHonestyCb09();

  const allErrors = [
    ...gov.errors,
    ...handoff.errors,
    ...mpi.errors,
    ...swarm.errors,
    ...evidence.errors,
    ...risks.errors,
    ...ps0504.errors,
  ];

  const checklist = [
    {
      id: "CB09-01",
      criterion: "LOOP-ECO-SUP-01 coordina sub-loops sin violar LK-04",
      status: handoff.errors.length === 0 ? CHECKLIST_STATUS.PASS : CHECKLIST_STATUS.PENDING,
    },
    {
      id: "CB09-02",
      criterion: "Handoff ECO → INT-RDY habilitado",
      status: handoff.errors.length === 0 ? CHECKLIST_STATUS.PASS : CHECKLIST_STATUS.PENDING,
    },
    {
      id: "CB09-03",
      criterion: "Dominios MPI 21–25, 27–32 cubiertos",
      status: mpi.errors.length === 0 ? CHECKLIST_STATUS.PASS : CHECKLIST_STATUS.PENDING,
    },
    {
      id: "CB09-04",
      criterion: "Derivación SWM valuation/investment operativa (CB-12)",
      status: swarm.errors.length === 0 ? CHECKLIST_STATUS.PASS : CHECKLIST_STATUS.PENDING,
    },
    {
      id: "CB09-05",
      criterion: "Evidencias ECO registradas en EVF/ELR",
      status: evidence.errors.length === 0 ? CHECKLIST_STATUS.PASS : CHECKLIST_STATUS.PENDING,
    },
    {
      id: "CB09-06",
      criterion: "Handoff DST→ECO respetado",
      status: handoff.errors.length === 0 ? CHECKLIST_STATUS.PASS : CHECKLIST_STATUS.PENDING,
    },
    {
      id: "CB09-PS05-04",
      criterion: "PS05-04 RECORDED_REAL economy honesty (evidenced/UNKNOWN)",
      status: ps0504.errors.length === 0 ? CHECKLIST_STATUS.PASS : CHECKLIST_STATUS.PENDING,
    },
  ];

  const passed = allErrors.length === 0 && checklist.every((i) => i.status === CHECKLIST_STATUS.PASS);

  let phaseRecord = null;
  if (passed && options.markComplete) {
    phaseRecord = markPhaseComplete("CB-09", {
      validationReport: "runCb09EconomyValidation",
      approvedBy: options.approvedBy ?? null,
      pendingDirectorApproval: !options.approvedBy,
    });
  }

  return {
    phase: "CB-09",
    passed,
    errors: allErrors,
    checklist,
    omcMotorCountRisk: {
      constitutional: OMC_MOTOR_COUNT_CONSTITUTIONAL,
      cb04CatalogIndexed: MOTOR_CATALOG_COUNT,
      reconciliationDeferred: risks.reconciliationDeferred,
    },
    motFin03Deferred: risks.motFin03Deferred,
    motLien01Deferred: risks.motLien01Deferred,
    phaseRecord,
    cb10Unlocked: passed ? isPhaseApproved("CB-09") : false,
  };
}

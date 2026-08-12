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
import { evaluateGateG5 } from "./readinessGates.js";
import { buildDefaultKnownUnknowns, validateKnownUnknowns } from "./knownUnknownsRegistry.js";
import { routeSufficiencyGap } from "./sufficiencyGapRouter.js";
import { isDecisionHandoffEnabled } from "./decisionHandoffPrep.js";
import {
  buildIntelligenceFixtureBundle,
  resolveIntelligenceSourceBundle,
} from "./intelligenceSourceFixtures.js";
import { INTELLIGENCE_MOTOR_HANDLERS } from "./intelligenceMotorHandlers.js";
import { PROPERTY_IDENTITY_STATUS } from "../cb05/propertyIdentityResolver.js";
import { buildIntelligenceRecordedEnrichmentBundle } from "./intelligenceRecordedEnrichmentAdapter.js";
import { applyIntelligenceRecordedEvidenceCheckpoint } from "./intelligenceRecordedEvidenceCheckpoint.js";
import { buildCanonicalPropertyFact } from "../cb02/connectors/canonicalPropertyFactAdapter.js";
import { resolvePropertyIdentity } from "../cb05/propertyIdentityResolver.js";

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
  return { errors, reconciliationDeferred: false };
}

/**
 * SP04-ENG-IMPL CEP-01 (+ residual DAG-SP04-CEP01-P1-R1-G1) — recorded enrichment / ISR honesty
 * (DEF-SP04-01 / DEF-SP04-02). Does not claim Living Intelligence Alive PROVED or Phase 1 COMPLETE.
 */
export async function validateSp04Cep01RecordedEnrichment() {
  const errors = [];
  const env = createTempEnv();
  try {
    const synthetic = buildIntelligenceFixtureBundle("cep01-synthetic");
    if (synthetic.synthetic !== true || synthetic.sourceMode !== "SYNTHETIC_FIXTURE") {
      errors.push("Synthetic INT fixture bundle must remain available");
    }

    const forced = resolveIntelligenceSourceBundle("cep01-force", { forceSynthetic: true });
    if (forced.synthetic !== true) {
      errors.push("forceSynthetic must resolve to synthetic INT fixtures");
    }

    const liveAttempt = buildIntelligenceRecordedEnrichmentBundle("cep01-live", {
      attemptLiveFetch: true,
    });
    if (liveAttempt.ok !== false) {
      errors.push("INT recorded enrichment must refuse attemptLiveFetch");
    }

    const enriched = resolveIntelligenceSourceBundle("cep01-recorded");
    if (enriched.ok === true || enriched.recordedOnly === true) {
      if (enriched.synthetic === true || enriched.liveFetch === true) {
        errors.push("Recorded INT enrichment must not be synthetic or Live");
      }
      if (enriched.sourceMode !== "RECORDED_ENRICHMENT") {
        errors.push("Recorded INT enrichment sourceMode must be RECORDED_ENRICHMENT");
      }
      if (enriched.livingIntelligenceProved === true || enriched.phase1Complete === true) {
        errors.push("CEP-01 must not claim Living IA PROVED or Phase 1 COMPLETE");
      }
      if (!enriched.payloadsByOrganism || typeof enriched.payloadsByOrganism !== "object") {
        errors.push("Recorded INT enrichment must expose payloadsByOrganism from CB-02 consume path");
      } else {
        if (!enriched.payloadsByOrganism["ORG-ASR-MC"]) {
          errors.push("Recorded INT enrichment payloadsByOrganism must include ORG-ASR-MC");
        }
        if (!enriched.payloadsByOrganism["ORG-GIS-MC"]) {
          errors.push("Recorded INT enrichment payloadsByOrganism must include ORG-GIS-MC");
        }
      }
      if (!enriched.synthesisRef || !enriched.corpusRef || !enriched.releaseRef || !enriched.execMemoRef) {
        errors.push("Recorded INT enrichment must preserve synthesis/corpus/release/execMemo SourceRefs");
      }
      if (Array.isArray(enriched.organismsPresent) && !enriched.organismsPresent.includes("ORG-ASR-MC")) {
        errors.push("Recorded INT enrichment organismsPresent must include ORG-ASR-MC");
      }
    } else if (!enriched.recordedSkippedReason && enriched.synthetic !== true) {
      errors.push("When pack unavailable, resolver must fall back to synthetic honestly");
    }

    const { intelligence } = createIntelligenceStack(env);
    const result = await intelligence.bootstrapIntelligence("cb13-cep01-enrichment", {
      parcelId: "int-cep01-001",
    });

    if (result.livingIntelligenceProved === true || result.phase1Complete === true) {
      errors.push("bootstrapIntelligence must not claim Living IA PROVED or Phase 1 COMPLETE");
    }

    const syn01 = result.manifests?.find((m) => m.motorId === "MOT-SYN-01");
    if (!syn01?.outputs) {
      errors.push("MOT-SYN-01 outputs missing after CEP-01 bootstrap");
    } else {
      if (syn01.outputs.sourceMode !== "RECORDED_ENRICHMENT") {
        errors.push('Bootstrap MOT-SYN-01 sourceMode must be "RECORDED_ENRICHMENT"');
      }
      if (syn01.outputs.recordedOnly !== true) {
        errors.push("Bootstrap MOT-SYN-01 recordedOnly must be true");
      }
      if (syn01.outputs.liveFetch !== false) {
        errors.push("Bootstrap MOT-SYN-01 liveFetch must be false");
      }
      if (syn01.outputs.fromRecordedPack !== true) {
        errors.push("Bootstrap MOT-SYN-01 fromRecordedPack must be true under RECORDED pack path");
      }
      if (!syn01.outputs.parcelId) {
        errors.push("Bootstrap MOT-SYN-01 must surface recorded parcelId from payloadsByOrganism");
      }
      if (syn01.outputs.livingIntelligenceProved !== false) {
        errors.push("Bootstrap MOT-SYN-01 livingIntelligenceProved must be false");
      }
      if (result.phase1Complete !== false) {
        errors.push("Bootstrap phase1Complete must be false");
      }
      if (result.livingIntelligenceProved !== false) {
        errors.push("Bootstrap livingIntelligenceProved must be false");
      }
    }

    const com01 = result.manifests?.find((m) => m.motorId === "MOT-COM-01");
    if (!com01?.outputs) {
      errors.push("MOT-COM-01 outputs missing after CEP-01 residual bootstrap");
    } else {
      if (com01.outputs.sourceMode !== "RECORDED_ENRICHMENT") {
        errors.push('Bootstrap MOT-COM-01 sourceMode must be "RECORDED_ENRICHMENT"');
      }
      if (com01.outputs.fromRecordedPack !== true) {
        errors.push("Bootstrap MOT-COM-01 must consume recordedPackHints (fromRecordedPack true)");
      }
      if (com01.outputs.liveFetch !== false) {
        errors.push("Bootstrap MOT-COM-01 liveFetch must be false");
      }
      if (com01.outputs.livingIntelligenceProved !== false || com01.outputs.phase1Complete !== false) {
        errors.push("Bootstrap MOT-COM-01 must not claim Living IA PROVED or Phase 1 COMPLETE");
      }
    }

    const kn = intelligence.knowledgeStore.read(result.factoryKey);
    for (const domain of ["38", "40", "41", "42"]) {
      const entry = kn.mpiDomains?.[domain];
      if (!entry || !entry.deltas?.length) {
        errors.push(`Knowledge domain ${domain} must record residual enrichment deltas`);
        continue;
      }
      const last = entry.deltas[entry.deltas.length - 1];
      if (last.fromRecordedPack !== true) {
        errors.push(`Knowledge domain ${domain} last delta must set fromRecordedPack true`);
      }
      if (domain === "41" && last.commercial !== "recorded_enrichment") {
        errors.push('MOT-COM-01 knowledge delta commercial must be "recorded_enrichment"');
      }
      if (!entry.sourceRefs?.length) {
        errors.push(`Knowledge domain ${domain} must preserve SourceRefs`);
      }
    }

    if (result.recordedOnly !== true) {
      errors.push("Bootstrap result.recordedOnly must be true under authorized recorded pack path");
    }
    if (result.sourceMode !== "RECORDED_ENRICHMENT") {
      errors.push('Bootstrap result.sourceMode must be "RECORDED_ENRICHMENT"');
    }

    if (result.recordedEvidenceCheckpoint?.ok === true) {
      if (result.recordedEvidenceCheckpoint.vitalityClaimed === true) {
        errors.push("INT recorded evidence checkpoint must not claim vitality/Live");
      }
      if (result.recordedEvidenceCheckpoint.livingIntelligenceProved === true) {
        errors.push("INT recorded evidence checkpoint must not claim Living IA PROVED");
      }
    }

    const checkpoint = applyIntelligenceRecordedEvidenceCheckpoint({
      factoryKey: result.factoryKey,
      evd01: intelligence.evidenceService.evd01,
    });
    if (checkpoint.ok === true && checkpoint.liveFetch === true) {
      errors.push("INT evidence checkpoint must keep liveFetch false");
    }
  } catch (err) {
    errors.push(err.message);
  } finally {
    fs.rmSync(env.base, { recursive: true, force: true });
  }
  return { errors };
}

/**
 * PS05-01 Truth Boundary — CB-13 targeted proofs.
 */
export async function validatePs0501TruthBoundaryCb13() {
  const errors = [];
  try {
    const missing = resolveIntelligenceSourceBundle("ps05-i-t01", {
      decisionFacing: true,
      packRoot: path.join(os.tmpdir(), "ps05-int-no-pack-" + Date.now()),
    });
    if (missing.sourceMode !== "UNAVAILABLE" || missing.synthetic === true) {
      errors.push("T01: Decision-facing INT missing pack must be UNAVAILABLE, not synthetic");
    }

    const forced = resolveIntelligenceSourceBundle("ps05-i-t03", {
      forceSynthetic: true,
      decisionFacing: true,
    });
    if (forced.synthetic !== true || forced.sourceMode !== "SYNTHETIC_FIXTURE") {
      errors.push("T03: INT forceSynthetic must remain identifiable");
    }
    if (forced.decisionTrusted === true) {
      errors.push("T03: INT synthetic must not be decisionTrusted");
    }

    const fixture = buildIntelligenceFixtureBundle("ps05-i-t03b");
    if (fixture.stubBusinessFact !== true) {
      errors.push("T03: INT fixture must mark stubBusinessFact");
    }

    const happy = resolveIntelligenceSourceBundle("ps05-i-t08", { decisionFacing: true });
    if (happy.sourceMode !== "RECORDED_ENRICHMENT" || happy.synthetic === true) {
      errors.push("T08: INT recorded enrichment happy path must remain operational");
    }

    const { INTELLIGENCE_MOTOR_HANDLERS } = await import("./intelligenceMotorHandlers.js");
    const syn = await INTELLIGENCE_MOTOR_HANDLERS["MOT-SYN-01"]({
      factoryKey: "ps05-i-t04",
      inputs: { forceSynthetic: true },
    });
    if (syn.outputs?.synthetic !== true || syn.outputs?.decisionTrusted === true) {
      errors.push("T04: INT synthetic marker must survive MOT-SYN-01 outputs as non-trusted");
    }

    const unavail = await INTELLIGENCE_MOTOR_HANDLERS["MOT-DCN-01"]({
      factoryKey: "ps05-i-t01m",
      inputs: {
        decisionFacing: true,
        recordedPackRoot: path.join(os.tmpdir(), "ps05-int-miss-" + Date.now()),
      },
    });
    if (unavail.outputs?.sourceMode !== "UNAVAILABLE") {
      errors.push("T01: Decision-facing INT motor must return UNAVAILABLE");
    }
  } catch (err) {
    errors.push(err.message);
  }
  return { errors };
}

/**
 * PS05-02 — INT Decision-facing canonical identity consume.
 */
export async function validatePs0502CanonicalIdentityCb13() {
  const errors = [];
  try {
    const syn = await INTELLIGENCE_MOTOR_HANDLERS["MOT-SYN-01"]({
      factoryKey: "ps05-02-int",
      inputs: {},
    });
    if (syn.outputs?.fromRecordedPack !== true) {
      errors.push("T08/T10: INT recorded path should remain operational");
    }
    // knowledgeDelta carries hints including jurisdiction/canonical when from recorded
    const delta = syn.knowledgeDelta ?? {};
    if (!delta.jurisdiction?.state || !delta.jurisdiction?.county) {
      errors.push("T05/T07: INT recordedPackHints must expose canonical jurisdiction");
    }
    if (delta.propertyIdentity?.status !== PROPERTY_IDENTITY_STATUS.MATCH) {
      errors.push("T01/P03: INT hints must surface MATCH property identity from pack");
    }
    if (!delta.rawIdentifiers?.assessor) {
      errors.push("T06: INT must preserve rawIdentifiers via canonical fact");
    }
    if (delta.ownerRef?.status !== "UNRESOLVED") {
      errors.push("T08: INT ownerRef from pack must remain UNRESOLVED");
    }

    const forced = await INTELLIGENCE_MOTOR_HANDLERS["MOT-SYN-01"]({
      factoryKey: "ps05-02-int-syn",
      inputs: { forceSynthetic: true },
    });
    if (forced.outputs?.synthetic !== true || forced.outputs?.decisionTrusted === true) {
      errors.push("T09: INT synthetic markers must survive PS05-02 consume path");
    }

    // Direct adapter identity isolation (no Maricopa-frozen merge)
    const fact = buildCanonicalPropertyFact({
      payloadsByOrganism: {
        "ORG-ASR-MC": { parcelId: "X", apn: "1", schemaId: "maricopa.assessor.payload.v1" },
        "ORG-GIS-MC": { parcelId: "X", schemaId: "maricopa.gis.payload.v1" },
      },
      packJurisdictionLabel: "Maricopa County, AZ",
    });
    const id = resolvePropertyIdentity({ canonicalFact: fact });
    if (id.status !== PROPERTY_IDENTITY_STATUS.MATCH) {
      errors.push("T01: canonical adapter + resolver MATCH for ASR+GIS");
    }
  } catch (err) {
    errors.push(err.message);
  }
  return { errors };
}

/**
 * PS05-03 — Dynamic unknowns / G5 honesty / INT envelope consume.
 */
export async function validatePs0503TruthAccountingCb13() {
  const errors = [];
  try {
    const computed = buildDefaultKnownUnknowns("ps05-03-dkn");
    const validation = validateKnownUnknowns(computed);
    if (!validation.evaluationComplete && !validation.honestyComplete && validation.obligationCount === 0) {
      errors.push("T03: computed unknowns must complete evaluation");
    }
    if (validation.inventedCount > 0) {
      errors.push("T03/P05: invented Obl unknowns are forbidden");
    }
    // Must not invent valuation/distress Obl defaults
    if (
      computed.some(
        (u) =>
          u.description === "Comp set vintage — minor uncertainty" ||
          u.description === "Contact authorization window pending"
      )
    ) {
      errors.push("T03: hardcoded valuation/distress Obl defaults must be removed");
    }

    const g5 = evaluateGateG5({ knownUnknowns: computed });
    if (!g5.pass) {
      errors.push("T03: G5 must PASS on computed declared unknowns/honesty marker");
    }

    const emptyG5 = evaluateGateG5({ knownUnknowns: [] });
    if (emptyG5.pass) {
      errors.push("T03: empty unevaluated unknowns must not PASS G5");
    }

    const syn = await INTELLIGENCE_MOTOR_HANDLERS["MOT-SYN-01"]({
      factoryKey: "ps05-03-int",
      inputs: {},
    });
    const delta = syn.knowledgeDelta ?? {};
    if (!delta.factCompleteness && !delta.knownUnknowns) {
      errors.push("T01: INT hints must expose factCompleteness or knownUnknowns");
    }
    if (delta.propertyIdentity?.status !== PROPERTY_IDENTITY_STATUS.MATCH) {
      errors.push("T09: PS05-02 identity must remain MATCH on INT path");
    }
  } catch (err) {
    errors.push(err.message);
  }
  return { errors };
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
  const cep01 = await validateSp04Cep01RecordedEnrichment();
  const ps0501 = await validatePs0501TruthBoundaryCb13();
  const ps0502 = await validatePs0502CanonicalIdentityCb13();
  const ps0503 = await validatePs0503TruthAccountingCb13();

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
    ...cep01.errors,
    ...ps0501.errors,
    ...ps0502.errors,
    ...ps0503.errors,
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
    {
      id: "CB13-PS05-01",
      criterion: "PS05-01 Truth Boundary — INT Decision-facing fail-closed",
      status: ps0501.errors.length === 0 ? CHECKLIST_STATUS.PASS : CHECKLIST_STATUS.PENDING,
    },
    {
      id: "CB13-PS05-02",
      criterion: "PS05-02 Canonical identity / jurisdiction on INT Decision-facing path",
      status: ps0502.errors.length === 0 ? CHECKLIST_STATUS.PASS : CHECKLIST_STATUS.PENDING,
    },
    {
      id: "CB13-PS05-03",
      criterion: "PS05-03 Dynamic unknowns / G5 honesty / INT truth accounting",
      status: ps0503.errors.length === 0 ? CHECKLIST_STATUS.PASS : CHECKLIST_STATUS.PENDING,
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

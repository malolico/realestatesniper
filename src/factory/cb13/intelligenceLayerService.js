/**
 * CB-13 — Intelligence Layer Service (P7)
 */

import { isPhaseApproved } from "../cb00/constructionGovernance.js";
import { FactoryRegistry } from "../cb01/factoryRegistry.js";
import { CLEARANCE_STATUS } from "../cb03/clearanceProtocol.js";
import { ComplianceGateService } from "../cb03/complianceGateService.js";
import { MotorExecutionLock } from "../cb04/motorExecutionLock.js";
import { MotorRuntime } from "../cb04/motorRuntime.js";
import { MOTOR_CATALOG_COUNT } from "../cb04/motorCatalogIndex.js";
import { FoundationLayerService } from "../cb05/foundationLayerService.js";
import { EvidenceService } from "../cb06/evidenceService.js";
import { SUFFICIENCY_STATUS } from "../cb06/sufficiencyGate.js";
import { LegitimacyLayerService } from "../cb07/legitimacyLayerService.js";
import { DistressLayerService } from "../cb08/distressLayerService.js";
import { EconomyLayerService } from "../cb09/economyLayerService.js";
import { EnvironmentLayerService } from "../cb10/environmentLayerService.js";
import { LoopEngineService } from "../cb11/loopEngineService.js";
import { SwarmCoordinatorService } from "../cb12/swarmCoordinatorService.js";
import {
  INTELLIGENCE_LOOPS,
  INTELLIGENCE_MOTORS,
  OMC_MOTOR_COUNT_CONSTITUTIONAL,
} from "./intelligenceCatalog.js";
import { IntelligenceKnowledgeStore } from "./intelligenceKnowledgeStore.js";
import {
  registerIntelligenceMotorHandlers,
} from "./intelligenceMotorHandlers.js";
import { runIntelligencePipeline } from "./intelligencePipeline.js";
import {
  ingestIntelligenceEvidence,
  evaluateIntelligenceSufficiency,
} from "./intelligenceEvidenceIngest.js";
import { applyIntelligenceRecordedEvidenceCheckpoint } from "./intelligenceRecordedEvidenceCheckpoint.js";
import { evaluateAllReadinessGates } from "./readinessGates.js";
import {
  recordReadinessGateEvaluation,
  recordReadinessStateTransition,
  recordKnownUnknownsDeclaration,
  recordIntelligenceLayerComplete,
} from "./readinessLedger.js";
import { buildDefaultKnownUnknowns } from "./knownUnknownsRegistry.js";
import { recordDecisionHandoffPrep, isDecisionHandoffEnabled } from "./decisionHandoffPrep.js";
import { advanceToConsolidation, transitionToReady } from "./stateProgression.js";
import {
  evaluateIntelligenceEvidenceSufficiency,
  recordLoopIntEvd01,
} from "./loopIntEvd01.js";
import {
  evaluateIntelligenceReadiness,
  recordLoopIntRdy01,
} from "./loopIntRdy01.js";
import { evaluateIntelligenceGap, recordLoopIntGap01 } from "./loopIntGap01.js";
import { evaluateIntelligenceQuality, recordLoopIntQlt01 } from "./loopIntQlt01.js";
import { evaluateIntelligenceFreshness, recordLoopIntFrs01 } from "./loopIntFrs01.js";

export class IntelligenceLayerService {
  /**
   * @param {{
   *   registry?: FactoryRegistry,
   *   compliance?: ComplianceGateService,
   *   knowledgeStore?: IntelligenceKnowledgeStore,
   *   evidenceService?: EvidenceService,
   *   runtime?: MotorRuntime,
   *   foundation?: FoundationLayerService,
   *   legitimacy?: LegitimacyLayerService,
   *   distress?: DistressLayerService,
   *   economy?: EconomyLayerService,
   *   environment?: EnvironmentLayerService,
   *   swarmCoordinator?: SwarmCoordinatorService,
   * }} [deps]
   */
  constructor(deps = {}) {
    if (!isPhaseApproved("CB-12")) {
      throw new Error("[CB-13 Intelligence] CB-12 must be APPROVED before Intelligence Layer");
    }
    this.registry = deps.registry ?? new FactoryRegistry();
    this.compliance = deps.compliance ?? new ComplianceGateService({ registry: this.registry });
    this.knowledgeStore = deps.knowledgeStore ?? new IntelligenceKnowledgeStore();
    this.evidenceService =
      deps.evidenceService ??
      new EvidenceService({ registry: this.registry, compliance: this.compliance });
    this.runtime =
      deps.runtime ??
      new MotorRuntime({
        registry: this.registry,
        compliance: this.compliance,
        executionLock: new MotorExecutionLock(),
      });
    this.foundation =
      deps.foundation ??
      new FoundationLayerService({ registry: this.registry, compliance: this.compliance, runtime: this.runtime });
    this.legitimacy =
      deps.legitimacy ??
      new LegitimacyLayerService({
        registry: this.registry,
        compliance: this.compliance,
        evidenceService: this.evidenceService,
        runtime: this.runtime,
      });
    this.distress =
      deps.distress ??
      new DistressLayerService({
        registry: this.registry,
        compliance: this.compliance,
        evidenceService: this.evidenceService,
        runtime: this.runtime,
      });
    this.economy =
      deps.economy ??
      new EconomyLayerService({
        registry: this.registry,
        compliance: this.compliance,
        evidenceService: this.evidenceService,
        runtime: this.runtime,
      });
    this.environment =
      deps.environment ??
      new EnvironmentLayerService({
        registry: this.registry,
        compliance: this.compliance,
        evidenceService: this.evidenceService,
        runtime: this.runtime,
      });

    const loopEngine =
      deps.loopEngine ??
      new LoopEngineService({
        registry: this.registry,
        compliance: this.compliance,
        evidenceService: this.evidenceService,
        runtime: this.runtime,
        foundation: this.foundation,
        legitimacy: this.legitimacy,
        distress: this.distress,
        economy: this.economy,
        environment: this.environment,
      });

    this.swarmCoordinator =
      deps.swarmCoordinator ??
      new SwarmCoordinatorService({
        registry: this.registry,
        compliance: this.compliance,
        evidenceService: this.evidenceService,
        loopEngine,
      });

    registerIntelligenceMotorHandlers(this.runtime, this.knowledgeStore);
  }

  /**
   * ENV→INT handoff — accepts environment layer FIN-S when present in ELR.
   *
   * @param {string} factoryKey
   */
  assertEnvironmentHandoff(factoryKey) {
    const record = this.registry.getExpediente(factoryKey);
    const handoffs = record?.elr?.decision_handoffs ?? [];
    const explicit = handoffs.find((h) => h.kind === "ENV_FIN_S_HANDOFF");
    if (explicit) return explicit;

    const loops = record?.elr?.loop_ledger_refs ?? [];
    const envSup = loops.find((r) => r.kind === "LOOP_ENV_SUP_01_RUN" && r.sufficient === true);
    if (!envSup) {
      throw new Error(
        "[CB-13 Intelligence] ENV→INT handoff not found — LOOP-ENV-SUP-01 FIN-S required"
      );
    }

    return { kind: "ENV_IMPLICIT_HANDOFF", fromLoop: "LOOP-ENV-SUP-01", toLoop: "LOOP-INT-RDY-01" };
  }

  /**
   * @param {string} factoryKey
   * @param {object} layers
   */
  buildGateContext(factoryKey, layers) {
    const record = this.registry.getExpediente(factoryKey);
    const complianceState = this.compliance.stateStore.read(factoryKey);
    const sufficiency =
      this.evidenceService.getSufficiency(factoryKey)?.status ??
      layers.evidenceResult?.sufficiency?.status ??
      SUFFICIENCY_STATUS.PENDING;

    const blockers = (layers.legitimacy?.blockers ?? []).map((b) => ({
      ...b,
      obligation: "Obl",
      resolved: b.resolved ?? true,
      documented: true,
    }));

    const state = this.knowledgeStore.read(factoryKey);
    const knownUnknowns = state.knownUnknowns ?? [];

    return {
      clearance: complianceState.clearance ?? CLEARANCE_STATUS.PASS,
      keyConfidence: layers.foundation?.quality?.metrics?.identity_confidence ?? "C2",
      keyStatus: record?.keyStatus ?? "provisional",
      blockers,
      blockersDocumented: true,
      sufficiencyStatus: sufficiency,
      knownUnknowns,
      syn02Readiness: false,
      icPathRequired: true,
      icPathComplete: true,
      execMemoPresent: true,
      releaseMatrixPresent: true,
    };
  }

  /**
   * @param {string} factoryKey
   * @param {{
   *   candidateRef?: string,
   *   parcelId?: string,
   *   simulateSufficiencyGap?: boolean,
   *   recordedPackRoot?: string,
   *   preferRecordedEnrichment?: boolean,
   *   forceSynthetic?: boolean,
   * }} [options]
   */
  async bootstrapIntelligence(factoryKey, options = {}) {
    const foundation = await this.foundation.bootstrapFoundation({
      candidateRef: options.candidateRef ?? "cb13-intelligence",
      parcelId: options.parcelId ?? "intelligence-001",
      recordedPackRoot: options.recordedPackRoot,
      preferRecordedEnrichment: options.preferRecordedEnrichment,
      forceSynthetic: options.forceSynthetic,
    });
    const key = foundation.factoryKey;

    await this.evidenceService.processFoundationEvidence(key);
    this.compliance.evaluateAndRecordClearance(key, { piiAuthorized: true });

    const legitimacy = await this.legitimacy.bootstrapLegitimacy(key);
    const distress = await this.distress.bootstrapDistress(key);
    const economy = await this.economy.bootstrapEconomy(key);
    const environment = await this.environment.bootstrapEnvironment(key);

    this.assertEnvironmentHandoff(key);

    this.registry.registerElrAct(
      key,
      "decision_handoffs",
      {
        kind: "INT_ACCEPT_ENV_HANDOFF",
        fromLoop: "LOOP-ENV-SUP-01",
        toLoop: "LOOP-INT-RDY-01",
        message: "Environment FIN-S accepted — intelligence layer started",
      },
      { actor: "LOOP-INT-RDY-01" }
    );

    advanceToConsolidation(this.registry, this.compliance, key);

    const unknowns = buildDefaultKnownUnknowns(key, legitimacy.blockers ?? []);
    const knState = this.knowledgeStore.read(key);
    this.knowledgeStore.write(key, { ...knState, knownUnknowns: unknowns });
    recordKnownUnknownsDeclaration(this.registry, key, unknowns);

    const evidenceResult = ingestIntelligenceEvidence({
      factoryKey: key,
      registry: this.registry,
      evd01: this.evidenceService.evd01,
      knowledgeStore: this.knowledgeStore,
    });

    const layers = { foundation, legitimacy, distress, economy, environment, evidenceResult };
    const gateCtx = this.buildGateContext(key, layers);

    const preGates = evaluateAllReadinessGates({
      ...gateCtx,
      syn02Readiness: false,
    });
    const gateEvaluation = evaluateAllReadinessGates({
      ...gateCtx,
      syn02Readiness: preGates.passCount >= 6,
    });

    this.knowledgeStore.write(key, {
      ...this.knowledgeStore.read(key),
      pendingGateEvaluation: gateEvaluation,
    });
    recordReadinessGateEvaluation(this.registry, key, gateEvaluation);

    const manifests = await runIntelligencePipeline(this.runtime, key, {
      recordedPackRoot: options.recordedPackRoot,
      preferRecordedEnrichment: options.preferRecordedEnrichment,
      forceSynthetic: options.forceSynthetic,
      gateEvaluation,
    });

    const recordedEvidenceCheckpoint = applyIntelligenceRecordedEvidenceCheckpoint({
      factoryKey: key,
      packRoot: options.recordedPackRoot,
      evd01: this.evidenceService.evd01,
      forceSynthetic: options.forceSynthetic === true,
    });

    const record = this.registry.getExpediente(key);
    const handoffs = record.elr.decision_handoffs ?? [];
    const evidenceSufficient =
      options.simulateSufficiencyGap === true
        ? false
        : evidenceResult.sufficiency.status === SUFFICIENCY_STATUS.PASS;

    const intEvd = evaluateIntelligenceEvidenceSufficiency({
      evidenceSufficient,
      multiDomainGap: options.simulateSufficiencyGap === true,
      openConflicts: options.simulateSufficiencyGap ? 2 : 0,
    });
    recordLoopIntEvd01(this.registry, key, intEvd);

    const intGap = evaluateIntelligenceGap({ docGap: false, negotiationGap: false });
    recordLoopIntGap01(this.registry, key, intGap);

    const intQlt = evaluateIntelligenceQuality({ commercialReady: true, corpusQuality: "acceptable" });
    recordLoopIntQlt01(this.registry, key, intQlt);

    const intFrs = evaluateIntelligenceFreshness({
      execSummarySynced: manifests.find((m) => m.motorId === "MOT-EXE-01")?.outputs?.execMemoSynced,
    });
    recordLoopIntFrs01(this.registry, key, intFrs);

    const intRdy = evaluateIntelligenceReadiness({
      layerHandoffs: handoffs,
      gatesPass: gateEvaluation.allPass,
      evidenceSufficient,
      intEvdSufficient: intEvd.sufficient,
    });
    recordLoopIntRdy01(this.registry, key, intRdy);

    let readinessTransition = null;
    let decisionHandoff = null;

    if (gateEvaluation.allPass && intRdy.sufficient && intEvd.sufficient) {
      const fromState = this.registry.getExpediente(key).state;
      readinessTransition = transitionToReady(this.registry, this.evidenceService, key);
      recordReadinessStateTransition(this.registry, key, {
        from: fromState,
        to: "ST-RDY",
        gateEvaluation,
      });
      decisionHandoff = recordDecisionHandoffPrep(this.registry, key, {
        readinessPass: true,
        gateEvaluation,
      });
    }

    if (!intEvd.sufficient && this.swarmCoordinator) {
      await this.swarmCoordinator.receiveStr6Escalations(key);
    }

    recordIntelligenceLayerComplete(this.registry, key);

    const syn01 = manifests.find((m) => m.motorId === "MOT-SYN-01");
    const syn02 = manifests.find((m) => m.motorId === "MOT-SYN-02");

    return {
      factoryKey: key,
      manifests,
      mpiCoverage: this.knowledgeStore.mpiCoverage(key),
      evidence: evidenceResult,
      sufficiency: evaluateIntelligenceSufficiency(evidenceResult),
      recordedEvidenceCheckpoint,
      gateEvaluation,
      loops: { intEvd, intGap, intQlt, intFrs, intRdy },
      readinessTransition,
      decisionHandoff,
      state: this.registry.getExpediente(key).state,
      syn01ElevatedE: syn01?.outputs?.evidenceElevated === false,
      syn02ReadinessPass: syn02?.outputs?.readinessPass === true,
      cb16HandoffEnabled: isDecisionHandoffEnabled(this.registry.getExpediente(key).elr),
      sourceMode: syn01?.outputs?.sourceMode ?? null,
      recordedOnly: syn01?.outputs?.recordedOnly === true,
      livingIntelligenceProved: false,
      phase1Complete: false,
      omcMotorCountNote: {
        constitutional: OMC_MOTOR_COUNT_CONSTITUTIONAL,
        cb04CatalogIndexed: MOTOR_CATALOG_COUNT,
        reconciliationDeferred: false,
      },
    };
  }

  /**
   * @param {string} factoryKey
   */
  getIntelligenceLineage(factoryKey) {
    const record = this.registry.getExpediente(factoryKey);
    return {
      factory_key: factoryKey,
      state: record?.state,
      motor_manifests: record?.elr?.motor_manifests ?? [],
      loop_ledger_refs: record?.elr?.loop_ledger_refs ?? [],
      decision_handoffs: record?.elr?.decision_handoffs ?? [],
      readinessEvals: (record?.elr?.motor_manifests ?? []).filter(
        (m) => m.kind === "EVF_READINESS_GATE_EVAL"
      ),
      mpiCoverage: this.knowledgeStore.mpiCoverage(factoryKey),
    };
  }
}

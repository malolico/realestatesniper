/**
 * CB-08 — Distress Layer Service
 */

import { isPhaseApproved } from "../cb00/constructionGovernance.js";
import { FactoryRegistry } from "../cb01/factoryRegistry.js";
import { ComplianceGateService } from "../cb03/complianceGateService.js";
import { MotorExecutionLock } from "../cb04/motorExecutionLock.js";
import { MotorRuntime } from "../cb04/motorRuntime.js";
import { EvidenceService } from "../cb06/evidenceService.js";
import { OMC_MOTOR_COUNT_CONSTITUTIONAL, DEFERRED_OMC_MOTOR_LIEN_01 } from "./distressCatalog.js";
import { DistressKnowledgeStore } from "./distressKnowledgeStore.js";
import { registerDistressMotorHandlers } from "./distressMotorHandlers.js";
import { runDistressPipeline } from "./distressPipeline.js";
import { ingestDistressEvidence } from "./distressEvidenceIngest.js";
import { evaluateDistressQuality, recordLoopDstSup01 } from "./loopDstSup01.js";
import { evaluateMotivationConvergence, recordLoopDstCvg01 } from "./loopDstCvg01.js";
import { evaluateContactLoop, recordLoopDstCnt01 } from "./loopDstCnt01.js";
import { evaluateDistressInvestigation, recordLoopDstInv01 } from "./loopDstInv01.js";
import { evaluateCrossProceedingTimeline, recordLoopXvrChr01 } from "./loopXvrChr01.js";

export class DistressLayerService {
  /**
   * @param {{
   *   registry?: FactoryRegistry,
   *   compliance?: ComplianceGateService,
   *   knowledgeStore?: DistressKnowledgeStore,
   *   evidenceService?: EvidenceService,
   *   runtime?: MotorRuntime,
   * }} [deps]
   */
  constructor(deps = {}) {
    if (!isPhaseApproved("CB-07")) {
      throw new Error("[CB-08 Distress] CB-07 must be APPROVED before Distress Layer");
    }
    this.registry = deps.registry ?? new FactoryRegistry();
    this.compliance = deps.compliance ?? new ComplianceGateService({ registry: this.registry });
    this.knowledgeStore = deps.knowledgeStore ?? new DistressKnowledgeStore();
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

    registerDistressMotorHandlers(this.runtime, this.knowledgeStore);
  }

  /**
   * @param {string} factoryKey
   */
  assertLegitimacyHandoff(factoryKey) {
    const record = this.registry.getExpediente(factoryKey);
    const handoffs = record?.elr?.decision_handoffs ?? [];
    const legHandoff = handoffs.find((h) => h.kind === "LEG_FIN_S_HANDOFF");
    if (!legHandoff || legHandoff.toLoop !== "LOOP-DST-SUP-01") {
      throw new Error(
        "[CB-08 Distress] LEG FIN-S → LOOP-DST-SUP-01 handoff not found (CB-07 required)"
      );
    }
    return legHandoff;
  }

  /**
   * @param {string} factoryKey
   * @param {{ inputs?: object }} [options]
   */
  async bootstrapDistress(factoryKey, options = {}) {
    this.assertLegitimacyHandoff(factoryKey);

    this.registry.registerElrAct(
      factoryKey,
      "decision_handoffs",
      {
        kind: "DST_ACCEPT_LEG_HANDOFF",
        fromLoop: "LOOP-LEG-SUP-01",
        toLoop: "LOOP-DST-SUP-01",
        message: "Legitimacy FIN-S accepted — distress layer started",
      },
      { actor: "LOOP-DST-SUP-01" }
    );

    const motorInputs = options.inputs ?? {};
    const manifests = await runDistressPipeline(this.runtime, factoryKey, {
      inputs: motorInputs,
    });

    const state = this.knowledgeStore.read(factoryKey);
    const mpiCoverage = this.knowledgeStore.mpiCoverage(factoryKey);

    const evidenceResult = ingestDistressEvidence({
      factoryKey,
      registry: this.registry,
      evd01: this.evidenceService.evd01,
      knowledgeStore: this.knowledgeStore,
    });

    this.evidenceService.evidenceStore.setSufficiency(factoryKey, evidenceResult.sufficiency);

    const quality = evaluateDistressQuality({
      manifests,
      mpiCoverage,
      legHandoff: true,
      motivationSufficient: state.motivationSufficient,
    });
    recordLoopDstSup01(this.registry, factoryKey, quality);

    const convergence = evaluateMotivationConvergence({
      signals: state.signals,
      motivationSufficient: state.motivationSufficient,
      motivationExhausted: state.motivationExhausted,
      simulateMultiSignalFailure: motorInputs.simulateMultiSignalFailure === true,
    });
    recordLoopDstCvg01(this.registry, factoryKey, convergence);

    const cntManifest = manifests.find((m) => m.motorId === "MOT-CNT-01");
    const cnt02 = manifests.find((m) => m.motorId === "MOT-CNT-02");
    const contact = evaluateContactLoop({
      contactGated: cntManifest?.outputs?.contactGated === true,
      ownerAuthorized: cnt02?.outputs?.ownerAuthorized,
    });
    recordLoopDstCnt01(this.registry, factoryKey, contact);

    const investigation = evaluateDistressInvestigation({
      manifests,
      signals: state.signals,
    });
    recordLoopDstInv01(this.registry, factoryKey, investigation);

    const xvr = evaluateCrossProceedingTimeline({ manifests });
    recordLoopXvrChr01(this.registry, factoryKey, xvr);

    this.evidenceService.persistEvidenceRegistryRef(factoryKey, {
      registryId: `EVREG-${factoryKey}`,
      dstEntryCount: evidenceResult.registration.registeredCount,
      sufficiency: evidenceResult.sufficiency.status,
      layer: "DST",
      omcMotorCountNote: {
        constitutional: OMC_MOTOR_COUNT_CONSTITUTIONAL,
        cb04CatalogIndexed: 56,
        reconciliationDeferred: true,
      },
      deferredMotors: {
        motLien01: DEFERRED_OMC_MOTOR_LIEN_01,
        note: "MOT-LIEN-01 deferred in CB-07 — CB-00 actor pattern",
      },
    });

    return {
      factoryKey,
      manifests,
      mpiCoverage,
      signals: state.signals,
      quality,
      convergence,
      contact,
      investigation,
      xvr,
      evidence: evidenceResult,
      motivationSufficient: state.motivationSufficient,
      motivationExhausted: state.motivationExhausted,
    };
  }

  /**
   * @param {string} factoryKey
   */
  getDistressLineage(factoryKey) {
    const record = this.registry.getExpediente(factoryKey);
    return {
      factory_key: factoryKey,
      motor_manifests: record?.elr?.motor_manifests ?? [],
      loop_ledger_refs: record?.elr?.loop_ledger_refs ?? [],
      decision_handoffs: record?.elr?.decision_handoffs ?? [],
      conflict_resolutions: record?.elr?.conflict_resolutions ?? [],
      swarm_mission_refs: record?.elr?.swarm_mission_refs ?? [],
      evidence_registry_ref: record?.elr?.evidence_registry_ref,
      mpiCoverage: this.knowledgeStore.mpiCoverage(factoryKey),
      signals: this.knowledgeStore.read(factoryKey).signals,
    };
  }
}

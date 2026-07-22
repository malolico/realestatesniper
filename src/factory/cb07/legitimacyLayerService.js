/**
 * CB-07 — Legitimacy Layer Service
 */

import { isPhaseApproved } from "../cb00/constructionGovernance.js";
import { FactoryRegistry } from "../cb01/factoryRegistry.js";
import { ComplianceGateService } from "../cb03/complianceGateService.js";
import { MotorExecutionLock } from "../cb04/motorExecutionLock.js";
import { MotorRuntime } from "../cb04/motorRuntime.js";
import { EvidenceService } from "../cb06/evidenceService.js";
import { OMC_MOTOR_COUNT_CONSTITUTIONAL } from "./legitimacyCatalog.js";
import { LegitimacyKnowledgeStore } from "./legitimacyKnowledgeStore.js";
import { registerLegitimacyMotorHandlers } from "./legitimacyMotorHandlers.js";
import { runLegitimacyPipeline } from "./legitimacyPipeline.js";
import { ingestLegitimacyEvidence } from "./legitimacyEvidenceIngest.js";
import { evaluateLegitimacyQuality, recordLoopLegSup01 } from "./loopLegSup01.js";
import { evaluateLegitimacyGaps, recordLoopLegGap01 } from "./loopLegGap01.js";
import {
  evaluateLegitimacyEvidenceChallenge,
  recordLoopLegEvd01,
} from "./loopLegEvd01.js";

export class LegitimacyLayerService {
  /**
   * @param {{
   *   registry?: FactoryRegistry,
   *   compliance?: ComplianceGateService,
   *   knowledgeStore?: LegitimacyKnowledgeStore,
   *   evidenceService?: EvidenceService,
   *   runtime?: MotorRuntime,
   * }} [deps]
   */
  constructor(deps = {}) {
    if (!isPhaseApproved("CB-06")) {
      throw new Error("[CB-07 Legitimacy] CB-06 must be APPROVED before Legitimacy Layer");
    }
    this.registry = deps.registry ?? new FactoryRegistry();
    this.compliance = deps.compliance ?? new ComplianceGateService({ registry: this.registry });
    this.knowledgeStore = deps.knowledgeStore ?? new LegitimacyKnowledgeStore();
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

    registerLegitimacyMotorHandlers(this.runtime, this.knowledgeStore);
  }

  /**
   * @param {string} factoryKey
   */
  assertFoundationHandoff(factoryKey) {
    const record = this.registry.getExpediente(factoryKey);
    const handoffs = record?.elr?.decision_handoffs ?? [];
    const fndHandoff = handoffs.find((h) => h.kind === "FND_FIN_S_HANDOFF");
    if (!fndHandoff) {
      throw new Error("[CB-07 Legitimacy] FND-SUP → LEG-SUP handoff not found (FIN-S required)");
    }
    return fndHandoff;
  }

  /**
   * @param {string} factoryKey
   * @param {{ inputs?: object }} [options]
   */
  async bootstrapLegitimacy(factoryKey, options = {}) {
    this.assertFoundationHandoff(factoryKey);

    this.registry.registerElrAct(
      factoryKey,
      "decision_handoffs",
      {
        kind: "LEG_ACCEPT_FND_HANDOFF",
        fromLoop: "LOOP-FND-SUP-01",
        toLoop: "LOOP-LEG-SUP-01",
        message: "Foundation FIN-S accepted — legitimacy layer started",
      },
      { actor: "LOOP-LEG-SUP-01" }
    );

    const motorInputs = options.inputs ?? {};
    const manifests = await runLegitimacyPipeline(this.runtime, factoryKey, {
      inputs: motorInputs,
    });

    const state = this.knowledgeStore.read(factoryKey);
    state.ownershipVerified = manifests.some(
      (m) => m.motorId === "MOT-OWN-02" && m.outputs?.verified === true
    );
    state.titleMarketable = manifests.some(
      (m) => m.motorId === "MOT-LEG-01" && m.outputs?.marketable === true
    );
    this.knowledgeStore.write(factoryKey, state);

    const mpiCoverage = this.knowledgeStore.mpiCoverage(factoryKey);
    const evidenceResult = ingestLegitimacyEvidence({
      factoryKey,
      registry: this.registry,
      evd01: this.evidenceService.evd01,
      knowledgeStore: this.knowledgeStore,
    });

    this.evidenceService.evidenceStore.setSufficiency(factoryKey, evidenceResult.sufficiency);

    const quality = evaluateLegitimacyQuality({
      manifests,
      mpiCoverage,
      blockers: state.blockers,
      foundationHandoff: true,
      ownerMismatch: motorInputs.simulateOwnerMismatch === true,
      titleCloud: motorInputs.simulateTitleCloud === true,
    });
    recordLoopLegSup01(this.registry, factoryKey, quality);

    const gaps = evaluateLegitimacyGaps({ blockers: state.blockers });
    recordLoopLegGap01(this.registry, factoryKey, gaps);

    const evdChallenge = evaluateLegitimacyEvidenceChallenge({
      ownerMismatch: motorInputs.simulateOwnerMismatch === true,
      titleCloud: motorInputs.simulateTitleCloud === true,
      multiDomain: state.blockers.length >= 2,
      domainCount: state.blockers.length,
    });
    recordLoopLegEvd01(this.registry, factoryKey, evdChallenge);

    if (quality.sufficient) {
      state.transferReady = true;
      this.knowledgeStore.write(factoryKey, state);
    }

    this.evidenceService.persistEvidenceRegistryRef(factoryKey, {
      registryId: `EVREG-${factoryKey}`,
      legEntryCount: evidenceResult.registration.registeredCount,
      sufficiency: evidenceResult.sufficiency.status,
      layer: "LEG",
      omcMotorCountNote: {
        constitutional: OMC_MOTOR_COUNT_CONSTITUTIONAL,
        cb04CatalogIndexed: 56,
        reconciliationDeferred: true,
      },
    });

    return {
      factoryKey,
      manifests,
      mpiCoverage,
      blockers: state.blockers,
      quality,
      gaps,
      evdChallenge,
      evidence: evidenceResult,
      transferReady: state.transferReady,
    };
  }

  /**
   * @param {string} factoryKey
   */
  getLegitimacyLineage(factoryKey) {
    const record = this.registry.getExpediente(factoryKey);
    return {
      factory_key: factoryKey,
      motor_manifests: record?.elr?.motor_manifests ?? [],
      loop_ledger_refs: record?.elr?.loop_ledger_refs ?? [],
      decision_handoffs: record?.elr?.decision_handoffs ?? [],
      conflict_resolutions: record?.elr?.conflict_resolutions ?? [],
      evidence_registry_ref: record?.elr?.evidence_registry_ref,
      mpiCoverage: this.knowledgeStore.mpiCoverage(factoryKey),
      blockers: this.knowledgeStore.read(factoryKey).blockers,
      transferReady: this.knowledgeStore.read(factoryKey).transferReady,
    };
  }
}

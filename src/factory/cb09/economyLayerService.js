/**
 * CB-09 — Economy Layer Service
 */

import { isPhaseApproved } from "../cb00/constructionGovernance.js";
import { FactoryRegistry } from "../cb01/factoryRegistry.js";
import { ComplianceGateService } from "../cb03/complianceGateService.js";
import { MotorExecutionLock } from "../cb04/motorExecutionLock.js";
import { MotorRuntime } from "../cb04/motorRuntime.js";
import { MOTOR_CATALOG_COUNT } from "../cb04/motorCatalogIndex.js";
import { EvidenceService } from "../cb06/evidenceService.js";
import {
  OMC_MOTOR_COUNT_CONSTITUTIONAL,
  DEFERRED_OMC_MOTOR_FIN_03,
  DEFERRED_OMC_MOTOR_LIEN_01,
} from "./economyCatalog.js";
import { EconomyKnowledgeStore } from "./economyKnowledgeStore.js";
import { registerEconomyMotorHandlers } from "./economyMotorHandlers.js";
import { runEconomyPipeline } from "./economyPipeline.js";
import { ingestEconomyEvidence } from "./economyEvidenceIngest.js";
import { evaluateEcoSupervisor, recordLoopEcoSup01 } from "./loopEcoSup01.js";
import { evaluateFinancialFreshness, recordLoopEcoFrs01 } from "./loopEcoFrs01.js";
import { evaluateValuationQuality, recordLoopEcoQlt01 } from "./loopEcoQlt01.js";
import { evaluateInvestmentSufficiency, recordLoopEcoQlt02 } from "./loopEcoQlt02.js";
import { evaluateHazardFreshness, recordLoopEcoFrs02 } from "./loopEcoFrs02.js";

export class EconomyLayerService {
  /**
   * @param {{
   *   registry?: FactoryRegistry,
   *   compliance?: ComplianceGateService,
   *   knowledgeStore?: EconomyKnowledgeStore,
   *   evidenceService?: EvidenceService,
   *   runtime?: MotorRuntime,
   * }} [deps]
   */
  constructor(deps = {}) {
    if (!isPhaseApproved("CB-08")) {
      throw new Error("[CB-09 Economy] CB-08 must be APPROVED before Economy Layer");
    }
    this.registry = deps.registry ?? new FactoryRegistry();
    this.compliance = deps.compliance ?? new ComplianceGateService({ registry: this.registry });
    this.knowledgeStore = deps.knowledgeStore ?? new EconomyKnowledgeStore();
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

    registerEconomyMotorHandlers(this.runtime, this.knowledgeStore);
  }

  /**
   * DEP-08 requires MOT-LIEN-01 — runtime deferred in CB-07 (CB-00 actor pattern).
   * Satisfy via documented stub without executing MOT-LIEN-01.
   *
   * @param {string} factoryKey
   */
  satisfyDep08LienStub(factoryKey) {
    const completed = this.runtime._completedByFactory.get(factoryKey) ?? new Set();
    if (!completed.has("MOT-LIEN-01")) {
      completed.add("MOT-LIEN-01");
      this.runtime._completedByFactory.set(factoryKey, completed);
      this.registry.registerElrAct(
        factoryKey,
        "motor_manifests",
        {
          kind: "DEFERRED_LIEN_DEP08_STUB",
          motorId: "MOT-LIEN-01",
          depRule: "DEP-08",
          note: "Lien dependency stub — MOT-LIEN-01 runtime deferred (CB-00 actor pattern)",
          constitutionalPhase: "CB-09",
        },
        { actor: "LOOP-ECO-SUP-01" }
      );
    }
  }

  /**
   * DST→ECO handoff — accepts distress layer FIN-S when present in ELR.
   *
   * @param {string} factoryKey
   */
  assertDistressHandoff(factoryKey) {
    const record = this.registry.getExpediente(factoryKey);
    const handoffs = record?.elr?.decision_handoffs ?? [];
    const explicit = handoffs.find((h) => h.kind === "DST_FIN_S_HANDOFF");
    if (explicit) {
      return explicit;
    }

    const loops = record?.elr?.loop_ledger_refs ?? [];
    const dstSup = loops.find(
      (r) => r.kind === "LOOP_DST_SUP_01_RUN" && r.sufficient === true
    );
    const dstCvg = loops.find(
      (r) => r.kind === "LOOP_DST_CVG_01_RUN" && r.sufficient === true
    );
    if (!dstSup || !dstCvg) {
      throw new Error(
        "[CB-09 Economy] DST→ECO handoff not found — LOOP-DST-SUP/CVG FIN-S required"
      );
    }

    return { kind: "DST_IMPLICIT_HANDOFF", fromLoop: "LOOP-DST-SUP-01", toLoop: "LOOP-ECO-SUP-01" };
  }

  /**
   * @param {string} factoryKey
   * @param {{ inputs?: object, requireDistressHandoff?: boolean }} [options]
   */
  async bootstrapEconomy(factoryKey, options = {}) {
    const requireDst = options.requireDistressHandoff !== false;
    if (requireDst) {
      this.assertDistressHandoff(factoryKey);
    }

    this.satisfyDep08LienStub(factoryKey);

    this.registry.registerElrAct(
      factoryKey,
      "decision_handoffs",
      {
        kind: "ECO_ACCEPT_DST_HANDOFF",
        fromLoop: "LOOP-DST-SUP-01",
        toLoop: "LOOP-ECO-SUP-01",
        message: "Distress FIN-S accepted — economy layer started",
      },
      { actor: "LOOP-ECO-SUP-01" }
    );

    const motorInputs = options.inputs ?? {};
    const manifests = await runEconomyPipeline(this.runtime, factoryKey, {
      inputs: motorInputs,
    });

    const state = this.knowledgeStore.read(factoryKey);
    const mpiCoverage = this.knowledgeStore.mpiCoverage(factoryKey);

    const evidenceResult = ingestEconomyEvidence({
      factoryKey,
      registry: this.registry,
      evd01: this.evidenceService.evd01,
      knowledgeStore: this.knowledgeStore,
    });

    this.evidenceService.evidenceStore.setSufficiency(factoryKey, evidenceResult.sufficiency);

    const frs01 = evaluateFinancialFreshness({
      manifests,
      staleFinancial: motorInputs.simulateStaleFinancial === true,
    });
    recordLoopEcoFrs01(this.registry, factoryKey, frs01);

    const qlt01 = evaluateValuationQuality({
      compCount: state.compCount,
      valuationReconciled: state.valuationReconciled,
      simulateCompConflict: motorInputs.simulateCompConflict === true,
      simulateInsufficientComps: motorInputs.simulateInsufficientComps === true,
    });
    recordLoopEcoQlt01(this.registry, factoryKey, qlt01);

    const qlt02 = evaluateInvestmentSufficiency({
      investmentStrategies: state.investmentStrategies,
      valuationSufficient: qlt01.sufficient,
      simulateMultiStrategy: motorInputs.simulateMultiStrategy === true,
      simulateCircularDependency: motorInputs.simulateCircularDependency === true,
    });
    recordLoopEcoQlt02(this.registry, factoryKey, qlt02);

    const frs02 = evaluateHazardFreshness({
      manifests,
      staleHazard: motorInputs.simulateStaleHazard === true,
    });
    recordLoopEcoFrs02(this.registry, factoryKey, frs02);

    const supervisor = evaluateEcoSupervisor({
      subLoopResults: [frs01, qlt01, qlt02, frs02],
      dstHandoff: requireDst,
    });
    recordLoopEcoSup01(this.registry, factoryKey, supervisor);

    this.evidenceService.persistEvidenceRegistryRef(factoryKey, {
      registryId: `EVREG-${factoryKey}`,
      ecoEntryCount: evidenceResult.registration.registeredCount,
      sufficiency: evidenceResult.sufficiency.status,
      layer: "ECO",
      omcMotorCountNote: {
        constitutional: OMC_MOTOR_COUNT_CONSTITUTIONAL,
        cb04CatalogIndexed: MOTOR_CATALOG_COUNT,
        reconciliationDeferred: false,
      },
      deferredMotors: {
        motFin03: DEFERRED_OMC_MOTOR_FIN_03,
        motLien01: DEFERRED_OMC_MOTOR_LIEN_01,
      },
    });

    return {
      factoryKey,
      manifests,
      mpiCoverage,
      frs01,
      qlt01,
      qlt02,
      frs02,
      supervisor,
      evidence: evidenceResult,
      integrationReady: supervisor.sufficient,
    };
  }

  /**
   * @param {string} factoryKey
   */
  getEconomyLineage(factoryKey) {
    const record = this.registry.getExpediente(factoryKey);
    return {
      factory_key: factoryKey,
      motor_manifests: record?.elr?.motor_manifests ?? [],
      loop_ledger_refs: record?.elr?.loop_ledger_refs ?? [],
      decision_handoffs: record?.elr?.decision_handoffs ?? [],
      swarm_mission_refs: record?.elr?.swarm_mission_refs ?? [],
      evidence_registry_ref: record?.elr?.evidence_registry_ref,
      mpiCoverage: this.knowledgeStore.mpiCoverage(factoryKey),
      integrationReady: (record?.elr?.decision_handoffs ?? []).some(
        (h) => h.kind === "ECO_FIN_S_HANDOFF"
      ),
    };
  }
}

/**
 * CB-10 — Environment Layer Service
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
  DEFERRED_OMC_MOTOR_FUT_02,
  DEFERRED_OMC_MOTOR_LIV_03,
  DEFERRED_OMC_MOTOR_LIEN_01,
  ENVIRONMENT_MPI_DOMAINS,
} from "./environmentCatalog.js";
import { EnvironmentKnowledgeStore } from "./environmentKnowledgeStore.js";
import { registerEnvironmentMotorHandlers } from "./environmentMotorHandlers.js";
import { runEnvironmentPipeline } from "./environmentPipeline.js";
import { ingestEnvironmentEvidence } from "./environmentEvidenceIngest.js";
import { evaluateEnvironmentQuality, recordLoopEnvSup01 } from "./loopEnvSup01.js";
import { evaluateEnvironmentFreshness, recordLoopEnvFrs01 } from "./loopEnvFrs01.js";

export class EnvironmentLayerService {
  /**
   * @param {{
   *   registry?: FactoryRegistry,
   *   compliance?: ComplianceGateService,
   *   knowledgeStore?: EnvironmentKnowledgeStore,
   *   evidenceService?: EvidenceService,
   *   runtime?: MotorRuntime,
   * }} [deps]
   */
  constructor(deps = {}) {
    if (!isPhaseApproved("CB-09")) {
      throw new Error("[CB-10 Environment] CB-09 must be APPROVED before Environment Layer");
    }
    this.registry = deps.registry ?? new FactoryRegistry();
    this.compliance = deps.compliance ?? new ComplianceGateService({ registry: this.registry });
    this.knowledgeStore = deps.knowledgeStore ?? new EnvironmentKnowledgeStore();
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

    registerEnvironmentMotorHandlers(this.runtime, this.knowledgeStore);
  }

  /**
   * ECO→ENV handoff — accepts economy layer FIN-S when present in ELR.
   *
   * @param {string} factoryKey
   */
  assertEconomyHandoff(factoryKey) {
    const record = this.registry.getExpediente(factoryKey);
    const handoffs = record?.elr?.decision_handoffs ?? [];
    const explicit = handoffs.find((h) => h.kind === "ECO_FIN_S_HANDOFF");
    if (explicit) {
      return explicit;
    }

    const loops = record?.elr?.loop_ledger_refs ?? [];
    const ecoSup = loops.find(
      (r) => r.kind === "LOOP_ECO_SUP_01_RUN" && r.sufficient === true
    );
    if (!ecoSup) {
      throw new Error(
        "[CB-10 Environment] ECO→ENV handoff not found — LOOP-ECO-SUP-01 FIN-S required"
      );
    }

    return { kind: "ECO_IMPLICIT_HANDOFF", fromLoop: "LOOP-ECO-SUP-01", toLoop: "LOOP-ENV-SUP-01" };
  }

  /**
   * CB-05 LOC dependency for territorial context.
   *
   * @param {string} factoryKey
   */
  assertFoundationLoc(factoryKey) {
    const manifests = this.registry.getExpediente(factoryKey)?.elr?.motor_manifests ?? [];
    const locRan = manifests.some((m) => m.motorId === "MOT-LOC-01");
    if (!locRan) {
      throw new Error("[CB-10 Environment] CB-05 MOT-LOC-01 required for environment context");
    }
    return true;
  }

  /**
   * @param {string} factoryKey
   * @param {{ inputs?: object, requireEcoHandoff?: boolean }} [options]
   */
  async bootstrapEnvironment(factoryKey, options = {}) {
    const requireEco = options.requireEcoHandoff !== false;
    if (requireEco) {
      this.assertEconomyHandoff(factoryKey);
    }
    this.assertFoundationLoc(factoryKey);

    this.registry.registerElrAct(
      factoryKey,
      "decision_handoffs",
      {
        kind: "ENV_ACCEPT_ECO_HANDOFF",
        fromLoop: "LOOP-ECO-SUP-01",
        toLoop: "LOOP-ENV-SUP-01",
        message: "Economy FIN-S accepted — environment layer started",
      },
      { actor: "LOOP-ENV-SUP-01" }
    );

    const motorInputs = options.inputs ?? {};
    const manifests = await runEnvironmentPipeline(this.runtime, factoryKey, {
      inputs: motorInputs,
    });

    const state = this.knowledgeStore.read(factoryKey);
    const mpiCoverage = this.knowledgeStore.mpiCoverage(factoryKey);
    const sourceRefs = ENVIRONMENT_MPI_DOMAINS.flatMap(
      (d) => state.mpiDomains[d]?.sourceRefs ?? []
    );

    const evidenceResult = ingestEnvironmentEvidence({
      factoryKey,
      registry: this.registry,
      evd01: this.evidenceService.evd01,
      knowledgeStore: this.knowledgeStore,
    });

    this.evidenceService.evidenceStore.setSufficiency(factoryKey, evidenceResult.sufficiency);

    const frs01 = evaluateEnvironmentFreshness({
      sourceRefs,
      simulateStaleCensus: motorInputs.simulateStaleCensus === true,
    });
    recordLoopEnvFrs01(this.registry, factoryKey, frs01);

    if (frs01.sufficient) {
      state.censusVintageOk = true;
      state.contextualFreshnessPct = 100;
      this.knowledgeStore.write(factoryKey, state);
    }

    const quality = evaluateEnvironmentQuality({
      mpiCoverage,
      ecoHandoff: requireEco,
      foundationLoc: true,
      livabilityComplete: state.livabilityComplete,
      freshnessSufficient: frs01.sufficient,
      simulateDemographicConflict: motorInputs.simulateDemographicConflict === true,
      simulateFairHousingRisk: motorInputs.simulateFairHousingRisk === true,
    });
    recordLoopEnvSup01(this.registry, factoryKey, quality);

    this.evidenceService.persistEvidenceRegistryRef(factoryKey, {
      registryId: `EVREG-${factoryKey}`,
      envEntryCount: evidenceResult.registration.registeredCount,
      sufficiency: evidenceResult.sufficiency.status,
      layer: "ENV",
      omcMotorCountNote: {
        constitutional: OMC_MOTOR_COUNT_CONSTITUTIONAL,
        cb04CatalogIndexed: MOTOR_CATALOG_COUNT,
        reconciliationDeferred: false,
      },
      deferredMotors: {
        motFut02: DEFERRED_OMC_MOTOR_FUT_02,
        motLiv03: DEFERRED_OMC_MOTOR_LIV_03,
        motLien01: DEFERRED_OMC_MOTOR_LIEN_01,
      },
    });

    return {
      factoryKey,
      manifests,
      mpiCoverage,
      frs01,
      quality,
      evidence: evidenceResult,
      integrationReady: quality.sufficient,
    };
  }

  /**
   * @param {string} factoryKey
   */
  getEnvironmentLineage(factoryKey) {
    const record = this.registry.getExpediente(factoryKey);
    return {
      factory_key: factoryKey,
      motor_manifests: record?.elr?.motor_manifests ?? [],
      loop_ledger_refs: record?.elr?.loop_ledger_refs ?? [],
      decision_handoffs: record?.elr?.decision_handoffs ?? [],
      conflict_resolutions: record?.elr?.conflict_resolutions ?? [],
      evidence_registry_ref: record?.elr?.evidence_registry_ref,
      mpiCoverage: this.knowledgeStore.mpiCoverage(factoryKey),
      integrationReady: (record?.elr?.decision_handoffs ?? []).some(
        (h) => h.kind === "ENV_FIN_S_HANDOFF"
      ),
    };
  }
}

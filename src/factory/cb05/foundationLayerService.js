/**
 * CB-05 — Foundation Layer Service
 * Orchestrates P1 foundation over Motor Runtime, Registry, Compliance and FND loops.
 */

import { isPhaseApproved } from "../cb00/constructionGovernance.js";
import { isProvisionalFactoryKey } from "../cb01/factoryKey.js";
import { FactoryRegistry } from "../cb01/factoryRegistry.js";
import { ComplianceGateService } from "../cb03/complianceGateService.js";
import { MotorExecutionLock } from "../cb04/motorExecutionLock.js";
import { MotorRuntime } from "../cb04/motorRuntime.js";
import { checkMotorDependencies } from "../cb04/dependencyResolver.js";
import { MOTOR_CATALOG_COUNT } from "../cb04/motorCatalogIndex.js";
import {
  FOUNDATION_MIN_CONFIDENCE,
  FOUNDATION_MPI_DOMAINS,
  FOUNDATION_STATE_PATH,
  OMC_MOTOR_COUNT_CONSTITUTIONAL,
} from "./foundationCatalog.js";
import { registerFoundationMotorHandlers } from "./foundationMotorHandlers.js";
import { FoundationKnowledgeStore } from "./foundationKnowledgeStore.js";
import { FOUNDATION_PIPELINE_SEQUENCE } from "./foundationPipeline.js";
import { evaluateFoundationQuality, recordLoopFndSup01 } from "./loopFndSup01.js";
import { evaluateFoundationFreshness, recordLoopFndFrs01 } from "./loopFndFrs01.js";

const POST_IDN_SEQUENCE = FOUNDATION_PIPELINE_SEQUENCE.filter((id) => id !== "MOT-IDN-01");

export class FoundationLayerService {
  /**
   * @param {{
   *   registry?: FactoryRegistry,
   *   compliance?: ComplianceGateService,
   *   knowledgeStore?: FoundationKnowledgeStore,
   *   runtime?: MotorRuntime,
   * }} [deps]
   */
  constructor(deps = {}) {
    if (!isPhaseApproved("CB-04")) {
      throw new Error("[CB-05 Foundation] CB-04 must be APPROVED before Foundation Layer");
    }
    this.registry = deps.registry ?? new FactoryRegistry();
    this.compliance = deps.compliance ?? new ComplianceGateService({ registry: this.registry });
    this.knowledgeStore = deps.knowledgeStore ?? new FoundationKnowledgeStore();
    this.runtime =
      deps.runtime ??
      new MotorRuntime({
        registry: this.registry,
        compliance: this.compliance,
        executionLock: new MotorExecutionLock(),
      });

    registerFoundationMotorHandlers(this.runtime, this.knowledgeStore);
  }

  /**
   * @param {string} fromKey
   * @param {string} toKey
   */
  migrateKnowledgeState(fromKey, toKey) {
    if (fromKey === toKey) return;
    const state = this.knowledgeStore.read(fromKey);
    this.knowledgeStore.write(toKey, state);
  }

  /**
   * @param {string} factoryKey
   * @param {string} motorId
   * @param {object} inputs
   */
  async runFoundationMotor(factoryKey, motorId, inputs) {
    return this.runtime.execute(factoryKey, motorId, {
      inputs,
      useStub: false,
      invoker: "FoundationLayerService",
    });
  }

  /**
   * @param {{
   *   candidateRef?: string,
   *   parcelId?: string,
   *   simulateConflict?: boolean,
   *   reconciled?: boolean,
   *   forceSynthetic?: boolean,
   *   preferRecordedEnrichment?: boolean,
   *   recordedPackRoot?: string,
   *   allowStaleRecordedEnrichment?: boolean,
   * }} [input]
   */
  async bootstrapFoundation(input = {}) {
    /** SP03-§15-ENG-IMPL Phase 2 / OBS-02 — forward source-resolution opts to handlers. */
    const motorInputs = {
      parcelId: input.parcelId,
      simulateConflict: input.simulateConflict ?? false,
      reconciled: input.reconciled ?? true,
      forceSynthetic: input.forceSynthetic === true,
      preferRecordedEnrichment: input.preferRecordedEnrichment,
      recordedPackRoot: input.recordedPackRoot,
      allowStaleRecordedEnrichment: input.allowStaleRecordedEnrichment === true,
    };

    const expediente = this.registry.createExpediente({
      candidateRef: input.candidateRef ?? "cb05-foundation-bootstrap",
      actor: "FoundationLayerService",
    });
    let factoryKey = expediente.factory_key;
    const manifests = [];

    this.compliance.evaluateAndRecordClearance(factoryKey, { piiAuthorized: true });
    this.compliance.guardedTransition(factoryKey, "ST-IDN", {
      actor: "MOT-IDN-01",
      reason: "foundation_identity_phase",
    });

    const idnManifest = await this.runFoundationMotor(factoryKey, "MOT-IDN-01", motorInputs);
    manifests.push(idnManifest);

    if (
      idnManifest.outputs?.definitiveKeyCandidate &&
      isProvisionalFactoryKey(factoryKey)
    ) {
      const provisionalKey = factoryKey;
      const resolved = this.registry.resolveFactoryKey(
        provisionalKey,
        idnManifest.outputs.definitiveKeyCandidate,
        { actor: "MOT-IDN-01", reason: "foundation_identity_resolution" }
      );
      factoryKey = resolved.factory_key;
      this.migrateKnowledgeState(provisionalKey, factoryKey);
      this.compliance.evaluateAndRecordClearance(factoryKey, { piiAuthorized: true });
      await this.runFoundationMotor(factoryKey, "MOT-IDN-01", motorInputs);
    }

    if (idnManifest.outputs?.conflict === true) {
      const idn02 = await this.runFoundationMotor(factoryKey, "MOT-IDN-02", {
        ...motorInputs,
        reconciled: motorInputs.reconciled,
      });
      manifests.push(idn02);
    } else {
      for (const motorId of POST_IDN_SEQUENCE) {
        manifests.push(await this.runFoundationMotor(factoryKey, motorId, motorInputs));
      }
    }

    const state = this.knowledgeStore.read(factoryKey);
    const idn02Manifest = manifests.find((m) => m.motorId === "MOT-IDN-02");
    state.identityConfidence = idnManifest.outputs?.confidence ?? null;
    state.identityConflict = idnManifest.outputs?.conflict === true;
    state.reconciled = idn02Manifest?.outputs?.reconciled ?? !state.identityConflict;
    this.knowledgeStore.write(factoryKey, state);

    const mpiCoverage = this.knowledgeStore.mpiCoverage(factoryKey);
    const allSourceRefs = FOUNDATION_MPI_DOMAINS.flatMap(
      (d) => state.mpiDomains[d]?.sourceRefs ?? []
    );

    const quality = evaluateFoundationQuality({
      manifests,
      mpiCoverage,
      identityConfidence: state.identityConfidence,
      conflict: state.identityConflict,
      reconciled: state.reconciled,
      idn02Attempted: Boolean(idn02Manifest),
      sourceCount: allSourceRefs.length,
    });
    recordLoopFndSup01(this.registry, factoryKey, quality);

    const freshness = evaluateFoundationFreshness({
      sourceRefs: allSourceRefs,
      supervisedManifests: manifests,
    });
    recordLoopFndFrs01(this.registry, factoryKey, freshness);

    if (quality.sufficient && freshness.fresh) {
      this.compliance.guardedTransition(factoryKey, "ST-PROD", {
        actor: "LOOP-FND-SUP-01",
        reason: "foundation_fin_s",
      });
      state.foundationComplete = true;
      this.knowledgeStore.write(factoryKey, state);
    }

    return {
      factoryKey,
      state: this.registry.getExpediente(factoryKey)?.state,
      manifests,
      mpiCoverage,
      quality,
      freshness,
      dep01Satisfied: this.isDep01Satisfied(factoryKey),
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
  isDep01Satisfied(factoryKey) {
    const ctx = this.runtime.getExecutionContext(factoryKey);
    return ctx.idnResolved || ctx.completedMotors.has("MOT-IDN-01");
  }

  /**
   * @param {string} factoryKey
   * @param {string} upperLayerMotorId
   */
  assertDep01ForUpperLayer(factoryKey, upperLayerMotorId) {
    const ctx = this.runtime.getExecutionContext(factoryKey);
    return checkMotorDependencies(upperLayerMotorId, ctx);
  }

  /**
   * @param {string} factoryKey
   */
  getFoundationLineage(factoryKey) {
    const record = this.registry.getExpediente(factoryKey);
    return {
      factory_key: factoryKey,
      state: record?.state,
      motor_manifests: record?.elr?.motor_manifests ?? [],
      loop_ledger_refs: record?.elr?.loop_ledger_refs ?? [],
      decision_handoffs: record?.elr?.decision_handoffs ?? [],
      mpiCoverage: this.knowledgeStore.mpiCoverage(factoryKey),
      foundationComplete: this.knowledgeStore.read(factoryKey).foundationComplete,
      minConfidence: FOUNDATION_MIN_CONFIDENCE,
      statePath: FOUNDATION_STATE_PATH,
    };
  }
}

/**
 * CB-06 — Evidence Service (EVF-01 orchestrator)
 */

import { isPhaseApproved } from "../cb00/constructionGovernance.js";
import { FactoryRegistry } from "../cb01/factoryRegistry.js";
import { isSourceRef } from "../cb02/sourceRef.js";
import { ComplianceGateService } from "../cb03/complianceGateService.js";
import { MotorExecutionLock } from "../cb04/motorExecutionLock.js";
import { MotorRuntime } from "../cb04/motorRuntime.js";
import { MOTOR_CATALOG_COUNT } from "../cb04/motorCatalogIndex.js";
import { FoundationKnowledgeStore } from "../cb05/foundationKnowledgeStore.js";
import { FOUNDATION_MPI_DOMAINS } from "../cb05/foundationCatalog.js";
import { MotEvd01 } from "./motEvd01Core.js";
import { MotEvd02 } from "./motEvd02.js";
import { EvidenceRegistryStore } from "./evidenceRegistryStore.js";
import { registerEvidenceMotorHandlers } from "./evidenceMotorHandlers.js";
import {
  assertEvf05SufficiencyGate,
  evaluateSufficiency,
  SUFFICIENCY_STATUS,
} from "./sufficiencyGate.js";
import { isMaterialMotorManifest } from "./evidenceIntercept.js";
import { OMC_MOTOR_COUNT_CONSTITUTIONAL } from "./evidenceVocabulary.js";

export class EvidenceService {
  /**
   * @param {{
   *   registry?: FactoryRegistry,
   *   compliance?: ComplianceGateService,
   *   evidenceStore?: EvidenceRegistryStore,
   *   foundationKnowledgeStore?: FoundationKnowledgeStore,
   *   runtime?: MotorRuntime,
   *   evd01?: MotEvd01,
   *   evd02?: MotEvd02,
   * }} [deps]
   */
  constructor(deps = {}) {
    if (!isPhaseApproved("CB-05")) {
      throw new Error("[CB-06 Evidence] CB-05 must be APPROVED before Evidence Service");
    }
    this.registry = deps.registry ?? new FactoryRegistry();
    this.compliance = deps.compliance ?? new ComplianceGateService({ registry: this.registry });
    this.evidenceStore = deps.evidenceStore ?? new EvidenceRegistryStore();
    this.foundationKnowledgeStore =
      deps.foundationKnowledgeStore ?? new FoundationKnowledgeStore();
    this.evd01 = deps.evd01 ?? new MotEvd01({ store: this.evidenceStore });
    this.evd02 = deps.evd02 ?? new MotEvd02({ store: this.evidenceStore });
    this.runtime =
      deps.runtime ??
      new MotorRuntime({
        registry: this.registry,
        compliance: this.compliance,
        executionLock: new MotorExecutionLock(),
      });

    registerEvidenceMotorHandlers(this.runtime, {
      evidenceStore: this.evidenceStore,
      evd01: this.evd01,
      evd02: this.evd02,
      registry: this.registry,
    });
  }

  /**
   * @param {string} factoryKey
   */
  collectSourceRefsByManifest(factoryKey) {
    /** @type {Record<string, object[]>} */
    const map = {};
    const foundationState = this.foundationKnowledgeStore.read(factoryKey);
    const allRefs = FOUNDATION_MPI_DOMAINS.flatMap(
      (d) => foundationState.mpiDomains[d]?.sourceRefs ?? []
    ).filter(isSourceRef);

    const record = this.registry.getExpediente(factoryKey);
    const manifests = record?.elr?.motor_manifests ?? [];

    for (const manifest of manifests) {
      if (!isMaterialMotorManifest(manifest)) continue;
      map[manifest.runId] = allRefs.length > 0 ? allRefs : [];
    }
    return map;
  }

  /**
   * @param {string} factoryKey
   */
  async processFoundationEvidence(factoryKey) {
    const record = this.registry.getExpediente(factoryKey);
    if (!record) {
      throw new Error(`[CB-06 Evidence] Expediente not found: ${factoryKey}`);
    }

    const manifests = record.elr.motor_manifests ?? [];
    const sourceRefsByManifest = this.collectSourceRefsByManifest(factoryKey);

    const evd01Manifest = await this.runtime.execute(factoryKey, "MOT-EVD-01", {
      useStub: false,
      inputs: { sourceRefsByManifest },
      invoker: "EvidenceService",
    });

    const snapshot = this.evd01.getRegistrySnapshot(factoryKey);
    const registration = {
      materialCount: snapshot.materialManifestCount,
      manifestsCovered: snapshot.manifestsCovered,
      coverage:
        snapshot.materialManifestCount > 0
          ? snapshot.manifestsCovered / snapshot.materialManifestCount
          : 1,
      registeredCount: snapshot.entries.length,
    };
    const sufficiency = evaluateSufficiency(snapshot);
    this.evidenceStore.setSufficiency(factoryKey, sufficiency);

    this.persistEvidenceRegistryRef(factoryKey, {
      registryId: `EVREG-${factoryKey}`,
      entryCount: snapshot.entries.length,
      sufficiency: sufficiency.status,
      coverage: registration.coverage,
      evf01Intercepted: registration.materialCount,
      lastEvd01RunId: evd01Manifest.runId,
      omcMotorCountNote: {
        constitutional: OMC_MOTOR_COUNT_CONSTITUTIONAL,
        cb04CatalogIndexed: MOTOR_CATALOG_COUNT,
        reconciliationDeferred: false,
      },
    });

    this.registry.registerElrAct(
      factoryKey,
      "motor_manifests",
      {
        kind: "EVIDENCE_REGISTRY_SNAPSHOT",
        entryCount: snapshot.entries.length,
        sufficiency: sufficiency.status,
        rule: "EVF-01",
      },
      { actor: "MOT-EVD-01" }
    );

    return {
      factoryKey,
      registration,
      sufficiency,
      evd01Manifest,
      snapshot,
    };
  }

  /**
   * @param {string} factoryKey
   * @param {object} snapshot
   */
  persistEvidenceRegistryRef(factoryKey, snapshot) {
    const record = this.registry.getExpediente(factoryKey);
    record.elr.evidence_registry_ref = {
      ...snapshot,
      updatedAt: new Date().toISOString(),
    };
    this.registry.store.write(record);
    return record.elr.evidence_registry_ref;
  }

  /**
   * @param {string} factoryKey
   * @param {object[]} conflicts
   */
  async resolveConflicts(factoryKey, conflicts) {
    const evd02Manifest = await this.runtime.execute(factoryKey, "MOT-EVD-02", {
      useStub: false,
      inputs: { conflicts },
      invoker: "EvidenceService",
    });

    const snapshot = this.evd01.getRegistrySnapshot(factoryKey);
    const sufficiency = evaluateSufficiency(snapshot);
    this.evidenceStore.setSufficiency(factoryKey, sufficiency);

    return {
      evd02Manifest,
      resolutions: snapshot.conflicts,
      sufficiency,
    };
  }

  /**
   * @param {string} factoryKey
   */
  getSufficiency(factoryKey) {
    return this.evidenceStore.read(factoryKey).sufficiency;
  }

  /**
   * @param {string} factoryKey
   * @param {string} toState
   */
  assertTransitionAllowed(factoryKey, toState) {
    const sufficiency = this.getSufficiency(factoryKey);
    assertEvf05SufficiencyGate(toState, sufficiency.status ?? SUFFICIENCY_STATUS.PENDING);
    return { allowed: true, sufficiency: sufficiency.status };
  }
}

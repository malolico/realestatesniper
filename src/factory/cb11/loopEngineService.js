/**
 * CB-11 — Loop Engine Service
 */

import { isPhaseApproved } from "../cb00/constructionGovernance.js";
import { FactoryRegistry } from "../cb01/factoryRegistry.js";
import { ComplianceGateService } from "../cb03/complianceGateService.js";
import { MotorExecutionLock } from "../cb04/motorExecutionLock.js";
import { MotorRuntime } from "../cb04/motorRuntime.js";
import { MOTOR_CATALOG_COUNT } from "../cb04/motorCatalogIndex.js";
import { FoundationLayerService } from "../cb05/foundationLayerService.js";
import { EvidenceService } from "../cb06/evidenceService.js";
import { LegitimacyLayerService } from "../cb07/legitimacyLayerService.js";
import { DistressLayerService } from "../cb08/distressLayerService.js";
import { EconomyLayerService } from "../cb09/economyLayerService.js";
import { EnvironmentLayerService } from "../cb10/environmentLayerService.js";
import {
  OLC_LOOP_CATALOG,
  OMC_MOTOR_COUNT_CONSTITUTIONAL,
  MOTOR_LOOP_SUPERVISION,
  getCapLoopCoverage,
} from "./loopEngineCatalog.js";
import { runAllIntegratedLoops, runIntegratedLoop } from "./integrationLoopRunners.js";
import { recordLoopLedger, recordLoopEngineRegistryComplete, recordOlcHandoff } from "./loopLedger.js";
import { coordinateFinalizers } from "./finalizerCoordinator.js";
import { buildOlcPipelineHandoffs } from "./loopEnginePipeline.js";
import { LoopExecutionLock, verifyLk04Orchestration } from "./loopLocks.js";
import { resolveStrategyEscalation } from "./strategyEscalation.js";

export class LoopEngineService {
  /**
   * @param {{
   *   registry?: FactoryRegistry,
   *   compliance?: ComplianceGateService,
   *   evidenceService?: EvidenceService,
   *   runtime?: MotorRuntime,
   *   loopLock?: LoopExecutionLock,
   *   foundation?: FoundationLayerService,
   *   legitimacy?: LegitimacyLayerService,
   *   distress?: DistressLayerService,
   *   economy?: EconomyLayerService,
   *   environment?: EnvironmentLayerService,
   * }} [deps]
   */
  constructor(deps = {}) {
    if (!isPhaseApproved("CB-10")) {
      throw new Error("[CB-11 Loop Engine] CB-10 must be APPROVED before Loop Engine");
    }
    this.registry = deps.registry ?? new FactoryRegistry();
    this.compliance = deps.compliance ?? new ComplianceGateService({ registry: this.registry });
    this.runtime =
      deps.runtime ??
      new MotorRuntime({
        registry: this.registry,
        compliance: this.compliance,
        executionLock: new MotorExecutionLock(),
      });
    this.loopLock = deps.loopLock ?? new LoopExecutionLock();
    this.foundation =
      deps.foundation ??
      new FoundationLayerService({ registry: this.registry, compliance: this.compliance, runtime: this.runtime });
    this.evidenceService = deps.evidenceService;
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
  }

  /**
   * Build execution snapshot from layer bootstrap results.
   *
   * @param {string} factoryKey
   * @param {object} bootstrap
   */
  buildExecutionSnapshot(factoryKey, bootstrap) {
    const record = this.registry.getExpediente(factoryKey);
    const handoffs = record?.elr?.decision_handoffs ?? [];

    return {
      foundation: {
        manifests: bootstrap.foundation.manifests,
        mpiCoverage: bootstrap.foundation.mpiCoverage,
        identityConfidence: bootstrap.foundation.quality?.metrics?.identity_confidence ?? "C2",
        foundationHandoff: true,
      },
      foundationFrs: {
        sourceRefs: bootstrap.foundation.freshness?.sourceRefs ?? [],
        supervisedManifests: bootstrap.foundation.manifests.filter((m) =>
          ["MOT-IDN-01", "MOT-LOC-01", "MOT-PHY-01"].includes(m.motorId)
        ),
      },
      legitimacy: {
        manifests: bootstrap.legitimacy.manifests,
        mpiCoverage: bootstrap.legitimacy.mpiCoverage,
        blockers: bootstrap.legitimacy.blockers,
        foundationHandoff: true,
      },
      legitimacyGaps: { blockers: bootstrap.legitimacy.blockers },
      legitimacyEvd: {
        ownerMismatch: false,
        titleCloud: false,
        multiDomain: false,
        domainCount: 0,
      },
      distress: {
        manifests: bootstrap.distress.manifests,
        mpiCoverage: bootstrap.distress.mpiCoverage,
        legHandoff: true,
        motivationSufficient: bootstrap.distress.motivationSufficient,
      },
      distressCvg: {
        signals: bootstrap.distress.signals,
        motivationSufficient: bootstrap.distress.motivationSufficient,
        motivationExhausted: bootstrap.distress.motivationExhausted,
      },
      distressCnt: {
        contactGated: true,
        ownerAuthorized: true,
      },
      distressInv: {
        manifests: bootstrap.distress.manifests,
        signals: bootstrap.distress.signals,
      },
      ecoSup: {
        subLoopResults: [
          bootstrap.economy.frs01,
          bootstrap.economy.qlt01,
          bootstrap.economy.qlt02,
          bootstrap.economy.frs02,
        ],
        dstHandoff: true,
      },
      ecoFrs01: { manifests: bootstrap.economy.manifests },
      ecoQlt01: {
        compCount: bootstrap.economy.manifests.find((m) => m.motorId === "MOT-MKT-02")?.outputs
          ?.compCount ?? 4,
        valuationReconciled: true,
      },
      ecoQlt02: {
        investmentStrategies: ["flip"],
        valuationSufficient: true,
      },
      ecoFrs02: { manifests: bootstrap.economy.manifests },
      envSup: {
        mpiCoverage: bootstrap.environment.mpiCoverage,
        ecoHandoff: true,
        foundationLoc: true,
        livabilityComplete: true,
        freshnessSufficient: bootstrap.environment.frs01.sufficient,
      },
      envFrs: {
        sourceRefs: bootstrap.environment.evidence?.snapshot?.entries?.map((e) => e.sourceRef).filter(Boolean) ?? [],
        simulateStaleCensus: false,
      },
      int: {
        layerHandoffs: handoffs,
        evidenceSufficient: true,
        commercialReady: true,
        execSummarySynced: true,
        docGap: false,
      },
    };
  }

  /**
   * @param {string} factoryKey
   * @param {{ candidateRef?: string, parcelId?: string }} [options]
   */
  async bootstrapLoopEngine(factoryKey, options = {}) {
    const foundation = await this.foundation.bootstrapFoundation({
      candidateRef: options.candidateRef ?? "cb11-loop-engine",
      parcelId: options.parcelId ?? "loop-engine-001",
    });
    const key = foundation.factoryKey;

    if (this.evidenceService) {
      await this.evidenceService.processFoundationEvidence(key);
    }

    const legitimacy = await this.legitimacy.bootstrapLegitimacy(key);
    const distress = await this.distress.bootstrapDistress(key);
    const economy = await this.economy.bootstrapEconomy(key);
    const environment = await this.environment.bootstrapEnvironment(key);

    const snapshot = this.buildExecutionSnapshot(key, {
      foundation,
      legitimacy,
      distress,
      economy,
      environment,
    });

    const loopResults = [];
    for (const entry of OLC_LOOP_CATALOG) {
      this.loopLock.acquire(key, entry.id, "LoopEngine");
      try {
        const result = runIntegratedLoop(entry.id, {
          snapshot,
          signals: { layerHandoff: true },
        });
        recordLoopLedger(this.registry, key, result);
        loopResults.push(result);
      } finally {
        this.loopLock.release(key, entry.id);
      }
    }

    recordLoopEngineRegistryComplete(
      this.registry,
      key,
      loopResults.map((r) => r.loopId)
    );

    const coordination = coordinateFinalizers(loopResults);
    const pipeline = buildOlcPipelineHandoffs({ loopResults });

    for (const handoff of pipeline.handoffs) {
      recordOlcHandoff(this.registry, key, handoff);
    }

    const lk04 = verifyLk04Orchestration({
      orchestrationOnly: economy.supervisor?.orchestrationOnly ?? true,
      motorsReExecuted: economy.supervisor?.motorsReExecuted ?? false,
    });

    const strategy = resolveStrategyEscalation(1);

    this.registry.registerElrAct(
      key,
      "loop_ledger_refs",
      {
        kind: "LOOP_ENGINE_CYCLE_COMPLETE",
        loopCount: loopResults.length,
        dominantFinalizer: coordination.dominant,
        strategy: strategy.level,
        lk04Compliant: lk04.verified,
        motorSupervisionCount: Object.keys(MOTOR_LOOP_SUPERVISION).length,
        capCoverageCount: 26,
        omcMotorCountNote: {
          constitutional: OMC_MOTOR_COUNT_CONSTITUTIONAL,
          cb04CatalogIndexed: MOTOR_CATALOG_COUNT,
          reconciliationDeferred: false,
        },
        constitutionalPhase: "CB-11",
      },
      { actor: "LOOP-INT-RDY-01" }
    );

    return {
      factoryKey: key,
      loopResults,
      coordination,
      pipeline,
      lk04,
      strategy,
      motorSupervision: MOTOR_LOOP_SUPERVISION,
      capCoverage: Object.fromEntries(
        Array.from({ length: 26 }, (_, i) => {
          const cap = `CAP-${String(i + 1).padStart(2, "0")}`;
          return [cap, getCapLoopCoverage(cap)];
        })
      ),
    };
  }
}

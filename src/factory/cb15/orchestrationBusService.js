/**
 * CB-15 — Orchestration Bus Service (FFO integration hub)
 */

import { isPhaseApproved } from "../cb00/constructionGovernance.js";
import { validateCatalogActor } from "../cb00/catalogActorGuard.js";
import { FactoryRegistry } from "../cb01/factoryRegistry.js";
import { ComplianceGateService } from "../cb03/complianceGateService.js";
import { CLEARANCE_STATUS } from "../cb03/clearanceProtocol.js";
import { MotorExecutionLock } from "../cb04/motorExecutionLock.js";
import { MotorRuntime } from "../cb04/motorRuntime.js";
import { MOTOR_CATALOG_COUNT } from "../cb04/motorCatalogIndex.js";
import { SUFFICIENCY_STATUS } from "../cb06/sufficiencyGate.js";
import { FoundationLayerService } from "../cb05/foundationLayerService.js";
import { EvidenceService } from "../cb06/evidenceService.js";
import { LegitimacyLayerService } from "../cb07/legitimacyLayerService.js";
import { DistressLayerService } from "../cb08/distressLayerService.js";
import { EconomyLayerService } from "../cb09/economyLayerService.js";
import { EnvironmentLayerService } from "../cb10/environmentLayerService.js";
import { LoopEngineService } from "../cb11/loopEngineService.js";
import { SwarmCoordinatorService } from "../cb12/swarmCoordinatorService.js";
import { IntelligenceLayerService } from "../cb13/intelligenceLayerService.js";
import { AiAssistLayerService } from "../cb14/aiAssistLayerService.js";
import { AiaInvocationGateway } from "../cb14/aiaInvocationGateway.js";
import {
  FFO_LAYER_PIPELINE,
  P_CONST_PIPELINE,
  ORCHESTRATION_BUS_ACTOR,
  OMC_MOTOR_COUNT_CONSTITUTIONAL,
} from "./ffoCatalog.js";
import { resolvePConstConflict } from "./pConstArbiter.js";
import { assertFactoryBoundary } from "./factoryBoundaryGuard.js";
import { FACTORY_LIFECYCLE_PATH, validateTransitionPath } from "./stateOrchestrator.js";
import { buildHandoffSummary } from "./handoffManager.js";
import { aggregateElr, recordElrAggregation } from "./elrAggregator.js";
import { calculateMaturityScore } from "./maturityScore.js";
import {
  scheduleAntiDegradationWatch,
  recordAntiDegradationSchedule,
} from "./antiDegradationScheduler.js";
import { recordBusEvent, recordOrchestrationComplete } from "./orchestrationBus.js";
import { runOlcLoopsOnExisting } from "./loopBusBridge.js";

export class OrchestrationBusService {
  /**
   * @param {{
   *   registry?: FactoryRegistry,
   *   compliance?: ComplianceGateService,
   *   evidenceService?: EvidenceService,
   *   runtime?: MotorRuntime,
   *   aiAssist?: AiAssistLayerService,
   *   loopEngine?: LoopEngineService,
   *   swarmCoordinator?: SwarmCoordinatorService,
   * }} [deps]
   */
  constructor(deps = {}) {
    if (!isPhaseApproved("CB-14")) {
      throw new Error("[CB-15 Orchestration Bus] CB-14 must be APPROVED before Orchestration Bus");
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

    if (deps.aiAssist) {
      this.aiAssist = deps.aiAssist;
      this.loopEngine = deps.loopEngine ?? null;
      this.swarmCoordinator = deps.swarmCoordinator ?? null;
      this.evidenceService = deps.evidenceService ?? null;
    } else {
      const foundation = new FoundationLayerService({
        registry: this.registry,
        compliance: this.compliance,
        runtime: this.runtime,
      });
      const evidence =
        deps.evidenceService ??
        new EvidenceService({ registry: this.registry, compliance: this.compliance, runtime: this.runtime });
      const legitimacy = new LegitimacyLayerService({
        registry: this.registry,
        compliance: this.compliance,
        evidenceService: evidence,
        runtime: this.runtime,
      });
      const distress = new DistressLayerService({
        registry: this.registry,
        compliance: this.compliance,
        evidenceService: evidence,
        runtime: this.runtime,
      });
      const economy = new EconomyLayerService({
        registry: this.registry,
        compliance: this.compliance,
        evidenceService: evidence,
        runtime: this.runtime,
      });
      const environment = new EnvironmentLayerService({
        registry: this.registry,
        compliance: this.compliance,
        evidenceService: evidence,
        runtime: this.runtime,
      });
      const loopEngine = new LoopEngineService({
        registry: this.registry,
        compliance: this.compliance,
        evidenceService: evidence,
        runtime: this.runtime,
        foundation,
        legitimacy,
        distress,
        economy,
        environment,
      });
      const swarmCoordinator = new SwarmCoordinatorService({
        registry: this.registry,
        compliance: this.compliance,
        evidenceService: evidence,
        loopEngine,
      });
      const intelligence = new IntelligenceLayerService({
        registry: this.registry,
        compliance: this.compliance,
        evidenceService: evidence,
        runtime: this.runtime,
        foundation,
        legitimacy,
        distress,
        economy,
        environment,
        loopEngine,
        swarmCoordinator,
      });
      const gateway = new AiaInvocationGateway({ registry: this.registry, compliance: this.compliance });
      this.aiAssist = new AiAssistLayerService({
        registry: this.registry,
        compliance: this.compliance,
        evidenceService: evidence,
        runtime: this.runtime,
        intelligence,
        gateway,
      });
      this.loopEngine = loopEngine;
      this.swarmCoordinator = swarmCoordinator;
      this.evidenceService = evidence;
    }
  }

  /**
   * @param {string} factoryKey
   * @param {{ candidateRef?: string, parcelId?: string, runLoopEngine?: boolean, runSwarm?: boolean }} [options]
   */
  async orchestrateExpediente(factoryKey, options = {}) {
    assertFactoryBoundary("orchestrate_expediente");

    const pConstConflict = resolvePConstConflict([
      { code: "P0", resource: "compliance" },
      { code: "P7", resource: "readiness" },
    ]);

    const aiResult = await this.aiAssist.bootstrapAiAssistLayer(factoryKey, {
      candidateRef: options.candidateRef ?? "cb15-orchestration",
      parcelId: options.parcelId ?? "ffo-bus-001",
    });
    const key = aiResult.factoryKey;

    recordBusEvent(this.registry, key, {
      busPhase: "P-CONST",
      pConst: "P0",
      subsystem: "compliance",
      status: "ARBITER",
      detail: pConstConflict,
    });

    for (const layer of FFO_LAYER_PIPELINE) {
      recordBusEvent(this.registry, key, {
        busPhase: "LAYER",
        layer: layer.layer,
        pConst: layer.phases[0],
        subsystem: layer.name,
        status: "COMPLETE",
        actor: ORCHESTRATION_BUS_ACTOR,
      });
    }

    recordBusEvent(this.registry, key, {
      busPhase: "EVIDENCE",
      subsystem: "CB-06",
      status: "INTERCEPT",
      detail: { rule: "FFO-09" },
      actor: "MOT-EVD-01",
    });

    let loopResult = null;
    if (options.runLoopEngine !== false && this.loopEngine) {
      loopResult = await runOlcLoopsOnExisting(this.loopEngine, key);
      recordBusEvent(this.registry, key, {
        busPhase: "LOOPS",
        subsystem: "CB-11",
        status: "COMPLETE",
        detail: { loopCount: loopResult.loopCount, mode: loopResult.mode },
        actor: "LOOP-INT-RDY-01",
      });
    }

    let swarmResult = null;
    if (options.runSwarm === true && this.swarmCoordinator) {
      swarmResult = await this.swarmCoordinator.bootstrapSwarmCoordinator(key, {
        exerciseAllPatterns: false,
        injectStr6Fixtures: true,
      });
      recordBusEvent(this.registry, key, {
        busPhase: "SWARM",
        subsystem: "CB-12",
        status: "COORDINATED",
        detail: { missions: swarmResult.summary?.missionsAccepted },
        actor: "SWM-SYN-01",
      });
    }

    recordBusEvent(this.registry, key, {
      busPhase: "AIA",
      subsystem: "CB-14",
      status: "ASSIST",
      detail: { accepted: aiResult.summary?.accepted },
      actor: "AIA-EXP-01",
    });

    const record = this.registry.getExpediente(key);
    const elrSnapshot = aggregateElr(record);
    recordElrAggregation(this.registry, key, elrSnapshot);

    const handoffSummary = buildHandoffSummary(record.elr);
    const complianceState = this.compliance.stateStore.read(key);
    const sufficiency = this.evidenceService?.getSufficiency(key);
    const intel = aiResult.intelligence;

    const maturity = calculateMaturityScore({
      mpiCoveragePercent: (intel?.mpiCoverage?.filter((m) => m.reachable).length ?? 0) / 5,
      sufficiencyStatus: sufficiency?.status ?? intel?.sufficiency?.status,
      readinessGatesPass: intel?.gateEvaluation?.allPass,
      identityConfidence: intel?.manifests?.find((m) => m.motorId === "MOT-IDN-01")?.outputs
        ?.confidence ?? "C2",
      state: record.state,
    });

    const watchSchedule = scheduleAntiDegradationWatch(key, {
      complianceClearance: complianceState.clearance ?? CLEARANCE_STATUS.PASS,
    });
    recordAntiDegradationSchedule(this.registry, key, watchSchedule);

    const lifecycleValid = validateTransitionPath(FACTORY_LIFECYCLE_PATH);

    recordOrchestrationComplete(this.registry, key, {
      state: record.state,
      maturity_score: maturity.maturity_score,
      handoffSummary,
      elrSections: elrSnapshot.sections,
      pConstWinner: pConstConflict.winner?.code,
      lifecyclePathValid: lifecycleValid.valid,
    });

    return {
      factoryKey: key,
      state: record.state,
      aiAssist: aiResult,
      loopEngine: loopResult,
      swarm: swarmResult,
      elrSnapshot,
      handoffSummary,
      maturity,
      watchSchedule,
      pConstConflict,
      lifecycleValid,
      boundary: { factoryOnly: true, decisionSeparated: true },
      omcMotorCountNote: {
        constitutional: OMC_MOTOR_COUNT_CONSTITUTIONAL,
        cb04CatalogIndexed: MOTOR_CATALOG_COUNT,
        reconciliationDeferred: false,
      },
    };
  }

  /**
   * @param {string} actorCode
   */
  assertCatalogActor(actorCode) {
    const result = validateCatalogActor(actorCode);
    if (!result.valid) {
      throw new Error(`[CB-15 Orchestration Bus] Actor outside catalog: ${actorCode}`);
    }
    return result;
  }

  /**
   * @param {string} factoryKey
   */
  getOrchestrationLineage(factoryKey) {
    const record = this.registry.getExpediente(factoryKey);
    const events = (record?.elr?.loop_ledger_refs ?? []).filter(
      (r) => r.kind?.startsWith("FFO_")
    );
    return {
      factory_key: factoryKey,
      state: record?.state,
      events,
      aggregation: aggregateElr(record),
      pConstPipeline: P_CONST_PIPELINE.map((p) => p.code),
    };
  }
}

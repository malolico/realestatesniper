/**
 * CB-12 — Swarm Coordinator Service
 */

import { isPhaseApproved } from "../cb00/constructionGovernance.js";
import { FactoryRegistry } from "../cb01/factoryRegistry.js";
import { ComplianceGateService } from "../cb03/complianceGateService.js";
import { CLEARANCE_STATUS } from "../cb03/clearanceProtocol.js";
import { EvidenceService } from "../cb06/evidenceService.js";
import { LoopEngineService } from "../cb11/loopEngineService.js";
import { OSC_SWM_COUNT, SWM_CATALOG, SWM_IDS } from "./swarmCatalog.js";
import {
  buildLoopReturn,
  buildSwaIn,
  buildSwaOut,
  resolveDieOutcome,
  validateSwaInMandate,
} from "./swarmLifecycle.js";
import {
  recordSwarmCoordinatorRegistryComplete,
  recordSwarmLoopReturn,
  recordSwarmMissionClose,
  recordSwarmMissionOpen,
} from "./missionLedger.js";
import {
  buildSyntheticStr6Mandate,
  resolveStr6Mandates,
} from "./str6Ingress.js";
import { assertNoUsurpation, coordinateSwarmMotors } from "./swarmCoordinationStub.js";
import { resolveSupervisedCoordinationOrStub } from "./supervisedSwarmCoordinationAdapter.js";

export class SwarmCoordinatorService {
  /**
   * @param {{
   *   registry?: FactoryRegistry,
   *   compliance?: ComplianceGateService,
   *   evidenceService?: EvidenceService,
   *   loopEngine?: LoopEngineService,
   * }} [deps]
   */
  constructor(deps = {}) {
    if (!isPhaseApproved("CB-11")) {
      throw new Error("[CB-12 Swarm Coordinator] CB-11 must be APPROVED before Swarm Coordinator");
    }
    this.registry = deps.registry ?? new FactoryRegistry();
    this.compliance = deps.compliance ?? new ComplianceGateService({ registry: this.registry });
    this.evidenceService = deps.evidenceService ?? null;
    this.loopEngine = deps.loopEngine ?? new LoopEngineService({
      registry: this.registry,
      compliance: this.compliance,
      evidenceService: this.evidenceService ?? undefined,
    });
    /** @type {Map<string, object>} — ephemeral in-memory missions; dissolved on close */
    this.activeMissions = new Map();
  }

  /**
   * Register 14/14 OSC patterns in mission ledger.
   *
   * @param {string} factoryKey
   */
  registerSwarmCatalog(factoryKey) {
    recordSwarmCoordinatorRegistryComplete(this.registry, factoryKey, [...SWM_IDS]);
    return { registered: OSC_SWM_COUNT, swmIds: SWM_IDS };
  }

  /**
   * Receive pending STR-6 derivations from ELR (post loop/motor escalation).
   *
   * @param {string} factoryKey
   */
  receiveStr6Escalations(factoryKey) {
    const record = this.registry.getExpediente(factoryKey);
    if (!record) {
      throw new Error(`[CB-12 Swarm Coordinator] Expediente not found: ${factoryKey}`);
    }
    return resolveStr6Mandates(record.elr, factoryKey);
  }

  /**
   * Execute one swarm mission lifecycle: SWA-IN → coordinate → SWA-OUT → DIE → loop return.
   *
   * @param {string} factoryKey
   * @param {string} swmId
   * @param {object} [mandate]
   */
  executeSwarmMission(factoryKey, swmId, mandate = {}) {
    const pre = this.compliance.assertPreExecution(factoryKey, {
      actor: swmId,
      operation: "swarm_swa_in",
    });
    if (!pre.valid) {
      return {
        accepted: false,
        reason: "Compliance BLOCK — SWA-IN rejected (SWA-IN-01)",
        validation: pre,
      };
    }

    const clearance = this.compliance.evaluateAndRecordClearance(factoryKey, {
      piiAuthorized: mandate.piiAuthorized ?? true,
    });
    if (clearance.state.clearance === CLEARANCE_STATUS.BLOCK) {
      return {
        accepted: false,
        reason: "Compliance BLOCK — SWA-IN rejected (SWA-IN-01)",
        clearance,
      };
    }

    const evidenceRef = this.registry.getExpediente(factoryKey)?.elr?.evidence_registry_ref;
    const swaIn = buildSwaIn(factoryKey, swmId, {
      ...mandate,
      evidenceState: mandate.evidenceState ?? evidenceRef,
    });

    const mandateCheck = validateSwaInMandate(swaIn);
    if (!mandateCheck.valid) {
      return { accepted: false, reason: mandateCheck.reason };
    }

    recordSwarmMissionOpen(this.registry, factoryKey, swaIn, { actor: swmId });
    this.activeMissions.set(swaIn.swarmId, swaIn);

    const coordinationContext = {
      evidenceRegistryRef: evidenceRef?.registryId ?? null,
      attemptLiveFetch: mandate.attemptLiveFetch === true,
      useLlm: mandate.useLlm === true,
      attemptLlm: mandate.attemptLlm === true,
      vendorInference: mandate.vendorInference === true,
      network: mandate.network === true,
      externalApi: mandate.externalApi === true,
    };

    const resolved = resolveSupervisedCoordinationOrStub(
      swmId,
      swaIn,
      coordinationContext,
      coordinateSwarmMotors
    );
    const coordination = resolved.coordination;

    const usurpation = assertNoUsurpation(coordination);
    if (!usurpation.valid) {
      this.activeMissions.delete(swaIn.swarmId);
      return { accepted: false, reason: usurpation.violations.join("; ") };
    }

    const swaOut = buildSwaOut(swaIn, coordination);
    const die = resolveDieOutcome(swaOut);
    const loopReturn = buildLoopReturn(swaOut, die.outcomeCode);

    recordSwarmMissionClose(this.registry, factoryKey, swaOut, die, { actor: swmId });
    recordSwarmLoopReturn(this.registry, factoryKey, loopReturn, { actor: swmId });

    this.activeMissions.delete(swaIn.swarmId);

    return {
      accepted: true,
      swmId,
      swarmId: swaIn.swarmId,
      phases: ["SWA-IN", "COORDINATE", "SWA-OUT", "DIE", "RETURN_LOOP"],
      swaIn,
      coordination,
      swaOut,
      die,
      loopReturn,
      dissolved: true,
      coordinationPath: resolved.coordinationPath,
      usedStubFallback: resolved.usedStubFallback === true,
      fallbackReason: resolved.fallbackReason ?? null,
    };
  }

  /**
   * Bootstrap: Loop Engine → STR-6 ingress → coordinate derivations + exercise catalog.
   *
   * @param {string} factoryKey
   * @param {{
   *   candidateRef?: string,
   *   parcelId?: string,
   *   exerciseAllPatterns?: boolean,
   *   injectStr6Fixtures?: boolean,
   *   distressInputs?: object,
   * }} [options]
   */
  async bootstrapSwarmCoordinator(factoryKey, options = {}) {
    const loopResult = await this.loopEngine.bootstrapLoopEngine(factoryKey, {
      candidateRef: options.candidateRef ?? "cb12-swarm-coordinator",
      parcelId: options.parcelId ?? "swarm-coord-001",
    });
    const key = loopResult.factoryKey;

    if (options.injectStr6Fixtures === true) {
      await this._injectStr6Fixtures(key);
    }

    const catalog = this.registerSwarmCatalog(key);
    const ingress = this.receiveStr6Escalations(key);

    const missionResults = [];
    const processedSwm = new Set();

    for (const item of ingress.mandates) {
      const result = this.executeSwarmMission(key, item.swmId, item.mandate);
      missionResults.push(result);
      if (result.accepted) processedSwm.add(item.swmId);
    }

    if (options.exerciseAllPatterns === true) {
      for (const pattern of SWM_CATALOG) {
        if (processedSwm.has(pattern.id)) continue;
        const synthetic = buildSyntheticStr6Mandate(pattern.derivingLoop, key);
        if (!synthetic) continue;
        const result = this.executeSwarmMission(key, synthetic.swmId, synthetic.mandate);
        missionResults.push(result);
        if (result.accepted) processedSwm.add(pattern.id);
      }
    }

    const record = this.registry.getExpediente(key);
    const openMissions = (record.elr.swarm_mission_refs ?? []).filter(
      (r) => r.kind === "EVF-04_SWARM_MISSION_OPEN"
    );
    const closeMissions = (record.elr.swarm_mission_refs ?? []).filter(
      (r) => r.kind === "EVF-04_SWARM_MISSION_CLOSE"
    );
    const loopReturns = (record.elr.loop_ledger_refs ?? []).filter(
      (r) => r.kind === "SWARM_LOOP_RETURN"
    );

    return {
      factoryKey: key,
      loopEngine: loopResult,
      catalog,
      ingress,
      missionResults,
      summary: {
        patternsRegistered: catalog.registered,
        str6DerivationsReceived: ingress.derivationCount,
        missionsAccepted: missionResults.filter((m) => m.accepted).length,
        missionsDissolved: missionResults.filter((m) => m.dissolved).length,
        activeMissionsRemaining: this.activeMissions.size,
        evf04Open: openMissions.length,
        evf04Close: closeMissions.length,
        loopReturns: loopReturns.length,
        uniqueSwmExecuted: processedSwm.size,
      },
    };
  }

  /**
   * Inject STR-6 derivations via read-only conflict routers (validation fixtures).
   *
   * @param {string} factoryKey
   */
  async _injectStr6Fixtures(factoryKey) {
    const { routeDistressConflict, recordDistressConflictDerivation } = await import(
      "../cb08/distressConflictRouter.js"
    );
    const { routeEconomyConflict, recordEconomyConflictDerivation } = await import(
      "../cb09/economyConflictRouter.js"
    );
    const { routeLegitimacyConflict, recordLegitimacyConflictDerivation } = await import(
      "../cb07/legitimacyConflictRouter.js"
    );
    const { routeFoundationConflict, recordConflictDerivation } = await import(
      "../cb05/foundationConflictRouter.js"
    );

    recordDistressConflictDerivation(
      this.registry,
      factoryKey,
      routeDistressConflict({ multiSignalFailure: true })
    );
    recordEconomyConflictDerivation(
      this.registry,
      factoryKey,
      routeEconomyConflict({ circularDependency: true })
    );
    recordEconomyConflictDerivation(
      this.registry,
      factoryKey,
      routeEconomyConflict({ multiStrategy: true })
    );
    recordLegitimacyConflictDerivation(
      this.registry,
      factoryKey,
      routeLegitimacyConflict({ multiDomain: true, domainCount: 2 })
    );
    recordConflictDerivation(
      this.registry,
      factoryKey,
      routeFoundationConflict({ conflict: true, sourceCount: 3, idn02Attempted: true, reconciled: false })
    );
  }
}

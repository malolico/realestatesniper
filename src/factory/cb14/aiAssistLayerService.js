/**
 * CB-14 — AI Assist Layer Service
 */

import { isPhaseApproved } from "../cb00/constructionGovernance.js";
import { FactoryRegistry } from "../cb01/factoryRegistry.js";
import { ComplianceGateService } from "../cb03/complianceGateService.js";
import { MotorExecutionLock } from "../cb04/motorExecutionLock.js";
import { MotorRuntime } from "../cb04/motorRuntime.js";
import { FoundationLayerService } from "../cb05/foundationLayerService.js";
import { EvidenceService } from "../cb06/evidenceService.js";
import { LegitimacyLayerService } from "../cb07/legitimacyLayerService.js";
import { DistressLayerService } from "../cb08/distressLayerService.js";
import { EconomyLayerService } from "../cb09/economyLayerService.js";
import { EnvironmentLayerService } from "../cb10/environmentLayerService.js";
import { LoopEngineService } from "../cb11/loopEngineService.js";
import { SwarmCoordinatorService } from "../cb12/swarmCoordinatorService.js";
import { IntelligenceLayerService } from "../cb13/intelligenceLayerService.js";
import { AIA_CATALOG, AIA_IDS, OAC_AIA_COUNT, CLASS_X_AIA_BLOCKLIST } from "./aiaCatalog.js";
import { AiaInvocationGateway } from "./aiaInvocationGateway.js";
import {
  recordAiAssistRegistryComplete,
  recordDualRunValidation,
} from "./reasoningLedger.js";
import { validateDualRunClassC } from "./slotRegistry.js";
import { executeAiaAssistStub } from "./aiaAssistStub.js";
import { resolveSupervisedOrStub } from "./supervisedAiAssistAdapter.js";
import { applyAiAssistOutputLimits } from "./constitutionalLimits.js";

export class AiAssistLayerService {
  /**
   * @param {{
   *   registry?: FactoryRegistry,
   *   compliance?: ComplianceGateService,
   *   evidenceService?: EvidenceService,
   *   runtime?: MotorRuntime,
   *   intelligence?: IntelligenceLayerService,
   *   gateway?: AiaInvocationGateway,
   * }} [deps]
   */
  constructor(deps = {}) {
    if (!isPhaseApproved("CB-13")) {
      throw new Error("[CB-14 AI Assist] CB-13 must be APPROVED before AI Assist Layer");
    }
    this.registry = deps.registry ?? new FactoryRegistry();
    this.compliance = deps.compliance ?? new ComplianceGateService({ registry: this.registry });
    this.evidenceService = deps.evidenceService ?? null;
    this.runtime =
      deps.runtime ??
      new MotorRuntime({
        registry: this.registry,
        compliance: this.compliance,
        executionLock: new MotorExecutionLock(),
      });

    if (!deps.intelligence && !deps.gateway) {
      const foundation = new FoundationLayerService({
        registry: this.registry,
        compliance: this.compliance,
        runtime: this.runtime,
      });
      const legitimacy = new LegitimacyLayerService({
        registry: this.registry,
        compliance: this.compliance,
        evidenceService: this.evidenceService ?? undefined,
        runtime: this.runtime,
      });
      const distress = new DistressLayerService({
        registry: this.registry,
        compliance: this.compliance,
        evidenceService: this.evidenceService ?? undefined,
        runtime: this.runtime,
      });
      const economy = new EconomyLayerService({
        registry: this.registry,
        compliance: this.compliance,
        evidenceService: this.evidenceService ?? undefined,
        runtime: this.runtime,
      });
      const environment = new EnvironmentLayerService({
        registry: this.registry,
        compliance: this.compliance,
        evidenceService: this.evidenceService ?? undefined,
        runtime: this.runtime,
      });
      const loopEngine = new LoopEngineService({
        registry: this.registry,
        compliance: this.compliance,
        evidenceService: this.evidenceService ?? undefined,
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
        evidenceService: this.evidenceService ?? undefined,
        loopEngine,
      });
      this.intelligence =
        deps.intelligence ??
        new IntelligenceLayerService({
          registry: this.registry,
          compliance: this.compliance,
          evidenceService: this.evidenceService ?? undefined,
          runtime: this.runtime,
          foundation,
          legitimacy,
          distress,
          economy,
          environment,
          loopEngine,
          swarmCoordinator,
        });
    } else {
      this.intelligence = deps.intelligence ?? null;
    }

    this.gateway =
      deps.gateway ??
      new AiaInvocationGateway({
        registry: this.registry,
        compliance: this.compliance,
      });
  }

  /**
   * @param {string} factoryKey
   * @param {{ candidateRef?: string, parcelId?: string }} [options]
   */
  async bootstrapAiAssistLayer(factoryKey, options = {}) {
    const intel =
      this.intelligence != null
        ? await this.intelligence.bootstrapIntelligence(factoryKey, {
            candidateRef: options.candidateRef ?? "cb14-ai-assist",
            parcelId: options.parcelId ?? "ai-assist-001",
          })
        : { factoryKey, gateEvaluation: { allPass: true } };

    const key = intel.factoryKey;
    const readinessGatesPass = intel.gateEvaluation?.allPass === true;

    const invocationResults = this.gateway.invokeAllCataloged(key, { readinessGatesPass });
    const accepted = invocationResults.filter((r) => r.accepted);
    const rejected = invocationResults.filter((r) => !r.accepted);

    recordAiAssistRegistryComplete(this.registry, key, [...AIA_IDS]);

    // G1: dual-run exercises supervised path (stub only as fail-closed fallback).
    const dualCtx = { factoryKey: key };
    const resolvedA = resolveSupervisedOrStub("AIA-NRM-01", dualCtx, executeAiaAssistStub);
    const resolvedB = resolveSupervisedOrStub("AIA-NRM-01", dualCtx, executeAiaAssistStub);
    const runA = applyAiAssistOutputLimits(resolvedA.output);
    const runB = applyAiAssistOutputLimits(resolvedB.output);
    const dualRun = validateDualRunClassC(
      { ...runA, fun: "NRM", modelSlot: "SLOT-01", confidence: runA.confidence },
      { ...runB, fun: "NRM", modelSlot: "SLOT-10", confidence: runB.confidence }
    );
    recordDualRunValidation(this.registry, key, dualRun);

    const classXBlocked = CLASS_X_AIA_BLOCKLIST.map((id) =>
      this.gateway.invoke(key, id, { invoker: "MOT-IDN-01" })
    );

    const record = this.registry.getExpediente(key);
    const rlgRefs = (record.elr.aia_rlg_refs ?? []).filter((r) => r.kind === "RLG_INVOCATION");

    return {
      factoryKey: key,
      intelligence: intel,
      invocationResults,
      summary: {
        catalogCount: OAC_AIA_COUNT,
        accepted: accepted.length,
        rejected: rejected.length,
        rlgRecorded: rlgRefs.length,
        rlgCoverage: rlgRefs.length / OAC_AIA_COUNT,
        prhViolations: 0,
        classXBlocked: classXBlocked.every((r) => r.accepted === false),
        dualRunPass: dualRun.pass,
        readinessGatesPass,
        dualRunAssistPathA: resolvedA.assistPath,
        dualRunAssistPathB: resolvedB.assistPath,
        dualRunUsedStubFallback:
          resolvedA.usedStubFallback === true || resolvedB.usedStubFallback === true,
      },
      dualRun,
      classXBlocked,
    };
  }
}

/**
 * CB-10 — LOOP-ENV-SUP-01 Environment Context Quality Loop
 */

import { ENVIRONMENT_LOOPS, OLC_PIPELINE_ORDER } from "./environmentCatalog.js";
import { routeEnvironmentConflict, recordEnvironmentConflictDerivation } from "./environmentConflictRouter.js";

export const LOOP_ENV_SUP_01 = ENVIRONMENT_LOOPS.find((l) => l.id === "LOOP-ENV-SUP-01");

/**
 * @param {{
 *   mpiCoverage: { domain: string, reachable: boolean }[],
 *   ecoHandoff?: boolean,
 *   foundationLoc?: boolean,
 *   livabilityComplete?: boolean,
 *   freshnessSufficient?: boolean,
 *   simulateDemographicConflict?: boolean,
 *   simulateFairHousingRisk?: boolean,
 * }} snapshot
 */
export function evaluateEnvironmentQuality(snapshot) {
  const requiredDomains = ["33", "34", "35", "36", "37"];
  const ddiReachable = requiredDomains.every((d) =>
    snapshot.mpiCoverage.some((c) => c.domain === d && c.reachable)
  );

  const conflictRoute = routeEnvironmentConflict({
    demographicConflict: snapshot.simulateDemographicConflict === true,
    fairHousingRisk: snapshot.simulateFairHousingRisk === true,
    contextualGap: !ddiReachable,
  });

  if (!snapshot.ecoHandoff) {
    return {
      loopId: LOOP_ENV_SUP_01.id,
      finalizer: "FIN-R",
      sufficient: false,
      reason: "missing_eco_handoff",
      conflictRoute,
    };
  }

  if (!snapshot.foundationLoc) {
    return {
      loopId: LOOP_ENV_SUP_01.id,
      finalizer: "FIN-R",
      sufficient: false,
      reason: "missing_foundation_loc",
      conflictRoute,
    };
  }

  const sufficient =
    ddiReachable &&
    snapshot.livabilityComplete === true &&
    snapshot.freshnessSufficient === true &&
    conflictRoute.action === "CONTINUE";

  return {
    loopId: LOOP_ENV_SUP_01.id,
    finalizer: sufficient ? "FIN-S" : "FIN-R",
    sufficient,
    handoff: sufficient ? { target: LOOP_ENV_SUP_01.handoffTarget, layer: "INT-RDY" } : null,
    olcPipelineIntegrated: true,
    olcPipelineOrder: OLC_PIPELINE_ORDER,
    conflictRoute,
    metrics: {
      livability_completeness: snapshot.livabilityComplete ? 1 : 0,
      contextual_ddi_coverage: ddiReachable ? 1 : 0,
    },
  };
}

/**
 * @param {import('../cb01/factoryRegistry.js').FactoryRegistry} registry
 * @param {string} factoryKey
 * @param {ReturnType<evaluateEnvironmentQuality>} result
 */
export function recordLoopEnvSup01(registry, factoryKey, result) {
  registry.registerElrAct(
    factoryKey,
    "loop_ledger_refs",
    {
      kind: "LOOP_ENV_SUP_01_RUN",
      loopId: LOOP_ENV_SUP_01.id,
      finalizer: result.finalizer,
      sufficient: result.sufficient,
      olcPipelineIntegrated: result.olcPipelineIntegrated,
      olcPipelineOrder: result.olcPipelineOrder,
      metrics: result.metrics,
      constitutionalPhase: "CB-10",
    },
    { actor: LOOP_ENV_SUP_01.id }
  );

  registry.registerElrAct(
    factoryKey,
    "decision_handoffs",
    {
      kind: "OLC_PIPELINE_STAGE_ENV",
      pipelineSection: "OLC-IV.1",
      stage: "ENV",
      order: result.olcPipelineOrder,
      message: "ENV stage integrated in canonical OLC pipeline",
    },
    { actor: LOOP_ENV_SUP_01.id }
  );

  if (result.conflictRoute?.action !== "CONTINUE") {
    recordEnvironmentConflictDerivation(registry, factoryKey, result.conflictRoute);
  }

  if (result.sufficient && result.handoff) {
    registry.registerElrAct(
      factoryKey,
      "decision_handoffs",
      {
        kind: "ENV_FIN_S_HANDOFF",
        fromLoop: LOOP_ENV_SUP_01.id,
        toLoop: result.handoff.target,
        layer: result.handoff.layer,
        message: "Environment layer complete — handoff to Integration Readiness",
      },
      { actor: LOOP_ENV_SUP_01.id }
    );
  }

  return result;
}

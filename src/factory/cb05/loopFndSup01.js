/**
 * CB-05 — LOOP-FND-SUP-01 Foundation Layer Quality Loop
 */

import { FOUNDATION_LOOPS, FOUNDATION_MIN_CONFIDENCE } from "./foundationCatalog.js";
import { routeFoundationConflict, recordConflictDerivation } from "./foundationConflictRouter.js";

export const LOOP_FND_SUP_01 = FOUNDATION_LOOPS[0];

/**
 * @param {{
 *   manifests: object[],
 *   mpiCoverage: { domain: string, reachable: boolean }[],
 *   identityConfidence?: string,
 *   conflict?: boolean,
 *   reconciled?: boolean,
 *   idn02Attempted?: boolean,
 *   sourceCount?: number,
 * }} snapshot
 */
export function evaluateFoundationQuality(snapshot) {
  const executedMotors = new Set(
    snapshot.manifests.map((m) => m.motorId).filter((id) => LOOP_FND_SUP_01.supervisedMotors.includes(id))
  );

  const mpiReachable = snapshot.mpiCoverage.every((d) => d.reachable);
  const identityOk =
    snapshot.identityConfidence === FOUNDATION_MIN_CONFIDENCE ||
    snapshot.identityConfidence === "C2";
  const conflictRoute = routeFoundationConflict({
    conflict: snapshot.conflict === true,
    reconciled: snapshot.reconciled,
    idn02Attempted: snapshot.idn02Attempted === true,
    sourceCount: snapshot.sourceCount ?? 2,
  });

  if (conflictRoute.action === "DERIVE_EVIDENCE" || conflictRoute.action === "DERIVE_SWARM") {
    return {
      loopId: LOOP_FND_SUP_01.id,
      finalizer: "FIN-X",
      sufficient: false,
      conflictRoute,
      metrics: {
        motorsExecuted: executedMotors.size,
        mpiReachable,
        identityOk,
      },
    };
  }

  const sufficient =
    mpiReachable &&
    identityOk &&
    executedMotors.has("MOT-IDN-01") &&
    executedMotors.has("MOT-LOC-01") &&
    executedMotors.has("MOT-PHY-01");

  return {
    loopId: LOOP_FND_SUP_01.id,
    finalizer: sufficient ? "FIN-S" : "FIN-R",
    sufficient,
    handoff: sufficient ? { target: LOOP_FND_SUP_01.handoffTarget, layer: "LEG" } : null,
    conflictRoute,
    metrics: {
      motorsExecuted: executedMotors.size,
      mpiReachable,
      identityOk,
      foundationCompleteness: mpiReachable ? 1 : 0,
    },
  };
}

/**
 * @param {import('../cb01/factoryRegistry.js').FactoryRegistry} registry
 * @param {string} factoryKey
 * @param {ReturnType<evaluateFoundationQuality>} result
 */
export function recordLoopFndSup01(registry, factoryKey, result) {
  const entry = registry.registerElrAct(
    factoryKey,
    "loop_ledger_refs",
    {
      kind: "LOOP_FND_SUP_01_RUN",
      loopId: LOOP_FND_SUP_01.id,
      finalizer: result.finalizer,
      sufficient: result.sufficient,
      handoff: result.handoff,
      metrics: result.metrics,
      constitutionalPhase: "CB-05",
    },
    { actor: LOOP_FND_SUP_01.id }
  );

  if (result.conflictRoute && result.conflictRoute.action !== "CONTINUE") {
    recordConflictDerivation(registry, factoryKey, result.conflictRoute);
  }

  if (result.sufficient && result.handoff) {
    registry.registerElrAct(
      factoryKey,
      "decision_handoffs",
      {
        kind: "FND_FIN_S_HANDOFF",
        fromLoop: LOOP_FND_SUP_01.id,
        toLoop: result.handoff.target,
        layer: result.handoff.layer,
        message: "Foundation sufficient — handoff to Legitimacy layer",
      },
      { actor: LOOP_FND_SUP_01.id }
    );
  }

  return entry;
}

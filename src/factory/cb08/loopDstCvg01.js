/**
 * CB-08 — LOOP-DST-CVG-01 Motivation Convergence Loop
 */

import { DISTRESS_LOOPS } from "./distressCatalog.js";
import { routeDistressConflict, recordDistressConflictDerivation } from "./distressConflictRouter.js";

export const LOOP_DST_CVG_01 = DISTRESS_LOOPS.find((l) => l.id === "LOOP-DST-CVG-01");

/**
 * @param {{
 *   signals: object[],
 *   motivationSufficient?: boolean,
 *   motivationExhausted?: boolean,
 *   simulateMultiSignalFailure?: boolean,
 * }} snapshot
 */
export function evaluateMotivationConvergence(snapshot) {
  const signals = snapshot.signals ?? [];
  const conflictSignals = signals.filter((s) => s.conflict === true);
  const conflictRoute = routeDistressConflict({
    singleSignalOnly: signals.length <= 1,
    signalConflict: conflictSignals.length > 0,
    multiSignalFailure:
      snapshot.simulateMultiSignalFailure === true || conflictSignals.length > 0,
  });

  if (conflictRoute.action === "DERIVE_SWARM") {
    return {
      loopId: LOOP_DST_CVG_01.id,
      finalizer: "FIN-R",
      sufficient: false,
      exhausted: false,
      conflictRoute,
      escalatesToSwarm: true,
    };
  }

  if (snapshot.motivationExhausted || conflictRoute.action === "MOTIVATION_EXHAUSTED") {
    return {
      loopId: LOOP_DST_CVG_01.id,
      finalizer: "FIN-X",
      sufficient: false,
      exhausted: true,
      conflictRoute,
      message: "Motivation exhausted — single signal cannot reach C1",
    };
  }

  const sufficient = snapshot.motivationSufficient === true && signals.length >= 2;

  return {
    loopId: LOOP_DST_CVG_01.id,
    finalizer: sufficient ? "FIN-S" : "FIN-R",
    sufficient,
    exhausted: false,
    conflictRoute,
    signalCount: signals.length,
  };
}

/**
 * @param {import('../cb01/factoryRegistry.js').FactoryRegistry} registry
 * @param {string} factoryKey
 * @param {ReturnType<evaluateMotivationConvergence>} result
 */
export function recordLoopDstCvg01(registry, factoryKey, result) {
  registry.registerElrAct(
    factoryKey,
    "loop_ledger_refs",
    {
      kind: "LOOP_DST_CVG_01_RUN",
      loopId: LOOP_DST_CVG_01.id,
      finalizer: result.finalizer,
      sufficient: result.sufficient,
      exhausted: result.exhausted,
      signalCount: result.signalCount,
      escalatesToSwarm: result.escalatesToSwarm ?? false,
      constitutionalPhase: "CB-08",
    },
    { actor: LOOP_DST_CVG_01.id }
  );

  if (result.conflictRoute?.action === "DERIVE_SWARM") {
    recordDistressConflictDerivation(registry, factoryKey, result.conflictRoute);
  }

  return result;
}

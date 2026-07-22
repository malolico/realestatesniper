/**
 * CB-09 — LOOP-ECO-QLT-01 Market Valuation Quality Loop
 */

import { ECONOMY_LOOPS } from "./economyCatalog.js";
import { routeEconomyConflict, recordEconomyConflictDerivation } from "./economyConflictRouter.js";

export const LOOP_ECO_QLT_01 = ECONOMY_LOOPS.find((l) => l.id === "LOOP-ECO-QLT-01");

/**
 * @param {{
 *   compCount?: number,
 *   valuationReconciled?: boolean,
 *   simulateCompConflict?: boolean,
 *   simulateInsufficientComps?: boolean,
 * }} snapshot
 */
export function evaluateValuationQuality(snapshot) {
  const conflictRoute = routeEconomyConflict({
    compConflict: snapshot.simulateCompConflict === true,
    insufficientComps:
      snapshot.simulateInsufficientComps === true || (snapshot.compCount ?? 0) < 3,
  });

  if (conflictRoute.action === "DERIVE_SWARM") {
    return {
      loopId: LOOP_ECO_QLT_01.id,
      finalizer: "FIN-R",
      sufficient: false,
      conflictRoute,
      escalatesToSwarm: true,
    };
  }

  const sufficient =
    (snapshot.compCount ?? 0) >= 3 && snapshot.valuationReconciled === true;

  return {
    loopId: LOOP_ECO_QLT_01.id,
    finalizer: sufficient ? "FIN-S" : "FIN-R",
    sufficient,
    conflictRoute,
    compCount: snapshot.compCount,
  };
}

/**
 * @param {import('../cb01/factoryRegistry.js').FactoryRegistry} registry
 * @param {string} factoryKey
 * @param {ReturnType<evaluateValuationQuality>} result
 */
export function recordLoopEcoQlt01(registry, factoryKey, result) {
  registry.registerElrAct(
    factoryKey,
    "loop_ledger_refs",
    {
      kind: "LOOP_ECO_QLT_01_RUN",
      loopId: LOOP_ECO_QLT_01.id,
      finalizer: result.finalizer,
      sufficient: result.sufficient,
      compCount: result.compCount,
      escalatesToSwarm: result.escalatesToSwarm ?? false,
      constitutionalPhase: "CB-09",
    },
    { actor: LOOP_ECO_QLT_01.id }
  );

  if (result.conflictRoute?.action === "DERIVE_SWARM") {
    recordEconomyConflictDerivation(registry, factoryKey, result.conflictRoute);
  }

  return result;
}

/**
 * CB-09 — LOOP-ECO-QLT-02 Investment Model Sufficiency Loop
 */

import { ECONOMY_LOOPS } from "./economyCatalog.js";
import { routeEconomyConflict, recordEconomyConflictDerivation } from "./economyConflictRouter.js";

export const LOOP_ECO_QLT_02 = ECONOMY_LOOPS.find((l) => l.id === "LOOP-ECO-QLT-02");

/**
 * @param {{
 *   investmentStrategies?: string[],
 *   valuationSufficient?: boolean,
 *   simulateMultiStrategy?: boolean,
 *   simulateCircularDependency?: boolean,
 * }} snapshot
 */
export function evaluateInvestmentSufficiency(snapshot) {
  const strategies = snapshot.investmentStrategies ?? [];
  const conflictRoute = routeEconomyConflict({
    multiStrategy: snapshot.simulateMultiStrategy === true && strategies.length >= 2,
    circularDependency: snapshot.simulateCircularDependency === true,
  });

  if (conflictRoute.action === "DERIVE_SWARM") {
    return {
      loopId: LOOP_ECO_QLT_02.id,
      finalizer: "FIN-R",
      sufficient: false,
      conflictRoute,
      escalatesToSwarm: true,
    };
  }

  const sufficient =
    snapshot.valuationSufficient === true && strategies.length >= 1 && !snapshot.simulateMultiStrategy;

  return {
    loopId: LOOP_ECO_QLT_02.id,
    finalizer: sufficient ? "FIN-S" : "FIN-R",
    sufficient,
    conflictRoute,
    strategyCount: strategies.length,
  };
}

/**
 * @param {import('../cb01/factoryRegistry.js').FactoryRegistry} registry
 * @param {string} factoryKey
 * @param {ReturnType<evaluateInvestmentSufficiency>} result
 */
export function recordLoopEcoQlt02(registry, factoryKey, result) {
  registry.registerElrAct(
    factoryKey,
    "loop_ledger_refs",
    {
      kind: "LOOP_ECO_QLT_02_RUN",
      loopId: LOOP_ECO_QLT_02.id,
      finalizer: result.finalizer,
      sufficient: result.sufficient,
      strategyCount: result.strategyCount,
      escalatesToSwarm: result.escalatesToSwarm ?? false,
      constitutionalPhase: "CB-09",
    },
    { actor: LOOP_ECO_QLT_02.id }
  );

  if (result.conflictRoute?.action === "DERIVE_SWARM") {
    recordEconomyConflictDerivation(registry, factoryKey, result.conflictRoute);
  }

  return result;
}

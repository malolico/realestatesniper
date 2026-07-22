/**
 * CB-10 — LOOP-ENV-FRS-01 Environment Context Freshness Loop
 */

import { evaluateFreshness } from "../cb02/freshnessPolicy.js";
import { ENVIRONMENT_LOOPS } from "./environmentCatalog.js";
import { routeEnvironmentConflict, recordEnvironmentConflictDerivation } from "./environmentConflictRouter.js";

export const LOOP_ENV_FRS_01 = ENVIRONMENT_LOOPS.find((l) => l.id === "LOOP-ENV-FRS-01");

/**
 * @param {{
 *   sourceRefs: object[],
 *   simulateStaleCensus?: boolean,
 * }} snapshot
 */
export function evaluateEnvironmentFreshness(snapshot) {
  const censusRef = snapshot.sourceRefs.find((r) => r.freshness?.profile === "CENSUS_DEMO");
  const crimeRef = snapshot.sourceRefs.find((r) => r.freshness?.profile === "CRIME_TREND");

  const censusFresh = snapshot.simulateStaleCensus
    ? { fresh: false, reason: "simulated_stale", degraded: true }
    : evaluateFreshness("CENSUS_DEMO", censusRef?.vintageAt ?? new Date().toISOString());

  const crimeFresh = evaluateFreshness(
    "CRIME_TREND",
    crimeRef?.vintageAt ?? new Date().toISOString()
  );

  const conflictRoute = routeEnvironmentConflict({
    staleCensus: !censusFresh.fresh,
  });

  const sufficient = censusFresh.fresh && crimeFresh.fresh;

  return {
    loopId: LOOP_ENV_FRS_01.id,
    finalizer: sufficient ? "FIN-S" : censusFresh.fresh ? "FIN-R" : "FIN-X",
    sufficient,
    refreshed: sufficient,
    slaProfiles: ["CENSUS_DEMO", "CRIME_TREND"],
    censusFresh,
    crimeFresh,
    conflictRoute,
  };
}

/**
 * @param {import('../cb01/factoryRegistry.js').FactoryRegistry} registry
 * @param {string} factoryKey
 * @param {ReturnType<evaluateEnvironmentFreshness>} result
 */
export function recordLoopEnvFrs01(registry, factoryKey, result) {
  registry.registerElrAct(
    factoryKey,
    "loop_ledger_refs",
    {
      kind: "LOOP_ENV_FRS_01_RUN",
      loopId: LOOP_ENV_FRS_01.id,
      finalizer: result.finalizer,
      sufficient: result.sufficient,
      refreshed: result.refreshed,
      slaProfiles: result.slaProfiles,
      constitutionalPhase: "CB-10",
    },
    { actor: LOOP_ENV_FRS_01.id }
  );

  if (result.conflictRoute?.action === "DERIVE_FRESHNESS") {
    recordEnvironmentConflictDerivation(registry, factoryKey, result.conflictRoute);
  }

  return result;
}

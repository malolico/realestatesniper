/**
 * CB-09 — LOOP-ECO-FRS-01 Financial & Fiscal Freshness Loop
 */

import { ECONOMY_LOOPS } from "./economyCatalog.js";

export const LOOP_ECO_FRS_01 = ECONOMY_LOOPS.find((l) => l.id === "LOOP-ECO-FRS-01");

/**
 * @param {{ manifests: object[], staleFinancial?: boolean }} snapshot
 */
export function evaluateFinancialFreshness(snapshot) {
  const fin01 = snapshot.manifests.find((m) => m.motorId === "MOT-FIN-01");
  const fin02 = snapshot.manifests.find((m) => m.motorId === "MOT-FIN-02");
  const fresh = !snapshot.staleFinancial && fin01 && fin02;

  return {
    loopId: LOOP_ECO_FRS_01.id,
    finalizer: fresh ? "FIN-S" : "FIN-X",
    sufficient: Boolean(fresh),
    freshnessProfile: "FISCAL_ROLL",
  };
}

/**
 * @param {import('../cb01/factoryRegistry.js').FactoryRegistry} registry
 * @param {string} factoryKey
 * @param {ReturnType<evaluateFinancialFreshness>} result
 */
export function recordLoopEcoFrs01(registry, factoryKey, result) {
  return registry.registerElrAct(
    factoryKey,
    "loop_ledger_refs",
    {
      kind: "LOOP_ECO_FRS_01_RUN",
      loopId: LOOP_ECO_FRS_01.id,
      finalizer: result.finalizer,
      sufficient: result.sufficient,
      freshnessProfile: result.freshnessProfile,
      constitutionalPhase: "CB-09",
    },
    { actor: LOOP_ECO_FRS_01.id }
  );
}

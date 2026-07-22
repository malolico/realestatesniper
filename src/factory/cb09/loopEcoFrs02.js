/**
 * CB-09 — LOOP-ECO-FRS-02 Territorial Hazard Refresh Loop
 */

import { ECONOMY_LOOPS } from "./economyCatalog.js";

export const LOOP_ECO_FRS_02 = ECONOMY_LOOPS.find((l) => l.id === "LOOP-ECO-FRS-02");

/**
 * @param {{ manifests: object[], staleHazard?: boolean }} snapshot
 */
export function evaluateHazardFreshness(snapshot) {
  const haz01 = snapshot.manifests.find((m) => m.motorId === "MOT-HAZ-01");
  const haz02 = snapshot.manifests.find((m) => m.motorId === "MOT-HAZ-02");
  const fresh = !snapshot.staleHazard && haz01 && haz02;

  return {
    loopId: LOOP_ECO_FRS_02.id,
    finalizer: fresh ? "FIN-S" : "FIN-X",
    sufficient: Boolean(fresh),
    freshnessProfile: "HAZARD_LAYER",
  };
}

/**
 * @param {import('../cb01/factoryRegistry.js').FactoryRegistry} registry
 * @param {string} factoryKey
 * @param {ReturnType<evaluateHazardFreshness>} result
 */
export function recordLoopEcoFrs02(registry, factoryKey, result) {
  return registry.registerElrAct(
    factoryKey,
    "loop_ledger_refs",
    {
      kind: "LOOP_ECO_FRS_02_RUN",
      loopId: LOOP_ECO_FRS_02.id,
      finalizer: result.finalizer,
      sufficient: result.sufficient,
      freshnessProfile: result.freshnessProfile,
      constitutionalPhase: "CB-09",
    },
    { actor: LOOP_ECO_FRS_02.id }
  );
}

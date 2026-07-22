/**
 * CB-13 — LOOP-INT-FRS-01 Executive Freshness Loop
 */

import { INTELLIGENCE_LOOPS } from "./intelligenceCatalog.js";

export const LOOP_INT_FRS_01 = INTELLIGENCE_LOOPS.find((l) => l.id === "LOOP-INT-FRS-01");

/**
 * @param {{ execSummarySynced?: boolean, execMemoStale?: boolean }} snapshot
 */
export function evaluateIntelligenceFreshness(snapshot) {
  const sufficient = snapshot.execSummarySynced !== false && snapshot.execMemoStale !== true;
  return {
    loopId: LOOP_INT_FRS_01.id,
    finalizer: sufficient ? "FIN-S" : "FIN-R",
    sufficient,
  };
}

/**
 * @param {import('../cb01/factoryRegistry.js').FactoryRegistry} registry
 * @param {string} factoryKey
 * @param {ReturnType<evaluateIntelligenceFreshness>} result
 */
export function recordLoopIntFrs01(registry, factoryKey, result) {
  return registry.registerElrAct(
    factoryKey,
    "loop_ledger_refs",
    {
      kind: "LOOP_INT_FRS_01_RUN",
      loopId: LOOP_INT_FRS_01.id,
      finalizer: result.finalizer,
      sufficient: result.sufficient,
      constitutionalPhase: "CB-13",
    },
    { actor: LOOP_INT_FRS_01.id }
  );
}

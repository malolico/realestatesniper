/**
 * CB-13 — LOOP-INT-QLT-01 Intelligence Quality Loop
 */

import { INTELLIGENCE_LOOPS } from "./intelligenceCatalog.js";

export const LOOP_INT_QLT_01 = INTELLIGENCE_LOOPS.find((l) => l.id === "LOOP-INT-QLT-01");

/**
 * @param {{ commercialReady?: boolean, corpusQuality?: string }} snapshot
 */
export function evaluateIntelligenceQuality(snapshot) {
  const sufficient =
    snapshot.commercialReady !== false && (snapshot.corpusQuality ?? "acceptable") !== "poor";
  return {
    loopId: LOOP_INT_QLT_01.id,
    finalizer: sufficient ? "FIN-S" : "FIN-R",
    sufficient,
  };
}

/**
 * @param {import('../cb01/factoryRegistry.js').FactoryRegistry} registry
 * @param {string} factoryKey
 * @param {ReturnType<evaluateIntelligenceQuality>} result
 */
export function recordLoopIntQlt01(registry, factoryKey, result) {
  return registry.registerElrAct(
    factoryKey,
    "loop_ledger_refs",
    {
      kind: "LOOP_INT_QLT_01_RUN",
      loopId: LOOP_INT_QLT_01.id,
      finalizer: result.finalizer,
      sufficient: result.sufficient,
      constitutionalPhase: "CB-13",
    },
    { actor: LOOP_INT_QLT_01.id }
  );
}

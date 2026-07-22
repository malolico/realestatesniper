/**
 * CB-13 — LOOP-INT-RDY-01 Decision Readiness Loop
 */

import { INTELLIGENCE_LOOPS } from "./intelligenceCatalog.js";

export const LOOP_INT_RDY_01 = INTELLIGENCE_LOOPS.find((l) => l.id === "LOOP-INT-RDY-01");

/**
 * @param {{
 *   layerHandoffs?: object[],
 *   gatesPass?: boolean,
 *   evidenceSufficient?: boolean,
 *   intEvdSufficient?: boolean,
 * }} snapshot
 */
export function evaluateIntelligenceReadiness(snapshot) {
  const handoffs = snapshot.layerHandoffs ?? [];
  const hasEco = handoffs.some(
    (h) => h.kind === "ECO_FIN_S_HANDOFF" || h.kind === "ENV_ACCEPT_ECO_HANDOFF"
  );
  const hasEnv = handoffs.some((h) => h.kind === "ENV_FIN_S_HANDOFF");
  const layersReady = hasEco && hasEnv;
  const gatesPass = snapshot.gatesPass === true;
  const evdOk = snapshot.intEvdSufficient !== false && snapshot.evidenceSufficient !== false;
  const sufficient = layersReady && gatesPass && evdOk;

  return {
    loopId: LOOP_INT_RDY_01.id,
    finalizer: sufficient ? "FIN-S" : "FIN-R",
    sufficient,
    layersReady,
    gatesPass,
    handoff: sufficient
      ? { target: LOOP_INT_RDY_01.handoffTarget, layer: "DECISION", phase: "CB-16" }
      : { target: "LOOP-INT-EVD-01", layer: "INT" },
  };
}

/**
 * @param {import('../cb01/factoryRegistry.js').FactoryRegistry} registry
 * @param {string} factoryKey
 * @param {ReturnType<evaluateIntelligenceReadiness>} result
 */
export function recordLoopIntRdy01(registry, factoryKey, result) {
  return registry.registerElrAct(
    factoryKey,
    "loop_ledger_refs",
    {
      kind: "LOOP_INT_RDY_01_RUN",
      loopId: LOOP_INT_RDY_01.id,
      finalizer: result.finalizer,
      sufficient: result.sufficient,
      layersReady: result.layersReady,
      gatesPass: result.gatesPass,
      enablesCb16Handoff: result.sufficient,
      constitutionalPhase: "CB-13",
    },
    { actor: LOOP_INT_RDY_01.id }
  );
}

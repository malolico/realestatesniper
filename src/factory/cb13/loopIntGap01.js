/**
 * CB-13 — LOOP-INT-GAP-01 Negotiation Gap Loop
 */

import { INTELLIGENCE_LOOPS } from "./intelligenceCatalog.js";

export const LOOP_INT_GAP_01 = INTELLIGENCE_LOOPS.find((l) => l.id === "LOOP-INT-GAP-01");

/**
 * @param {{ docGap?: boolean, negotiationGap?: boolean }} snapshot
 */
export function evaluateIntelligenceGap(snapshot) {
  const sufficient = snapshot.docGap !== true && snapshot.negotiationGap !== true;
  return {
    loopId: LOOP_INT_GAP_01.id,
    finalizer: sufficient ? "FIN-S" : "FIN-H",
    sufficient,
    handoff: sufficient ? null : { target: "LOOP-LEG-GAP-01" },
    escalatesToSwarm: !sufficient,
    swarmTarget: !sufficient ? "CB-12:SWM-NEG-01" : null,
  };
}

/**
 * @param {import('../cb01/factoryRegistry.js').FactoryRegistry} registry
 * @param {string} factoryKey
 * @param {ReturnType<evaluateIntelligenceGap>} result
 */
export function recordLoopIntGap01(registry, factoryKey, result) {
  registry.registerElrAct(
    factoryKey,
    "loop_ledger_refs",
    {
      kind: "LOOP_INT_GAP_01_RUN",
      loopId: LOOP_INT_GAP_01.id,
      finalizer: result.finalizer,
      sufficient: result.sufficient,
      constitutionalPhase: "CB-13",
    },
    { actor: LOOP_INT_GAP_01.id }
  );

  if (result.escalatesToSwarm) {
    registry.registerElrAct(
      factoryKey,
      "swarm_mission_refs",
      {
        kind: "INT_NEGOTIATION_GAP_DERIVATION",
        route: {
          action: "DERIVE_SWARM",
          strategy: "STR-6",
          target: result.swarmTarget,
        },
        constitutionalPhase: "CB-13",
      },
      { actor: LOOP_INT_GAP_01.id }
    );
  }

  return result;
}

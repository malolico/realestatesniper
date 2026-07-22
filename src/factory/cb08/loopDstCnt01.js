/**
 * CB-08 — LOOP-DST-CNT-01 Legitimate Contact & Authorization Loop
 */

import { DISTRESS_LOOPS } from "./distressCatalog.js";

export const LOOP_DST_CNT_01 = DISTRESS_LOOPS.find((l) => l.id === "LOOP-DST-CNT-01");

/**
 * @param {{
 *   contactGated?: boolean,
 *   ownerAuthorized?: boolean,
 *   dep06Blocked?: boolean,
 * }} snapshot
 */
export function evaluateContactLoop(snapshot) {
  if (snapshot.dep06Blocked) {
    return {
      loopId: LOOP_DST_CNT_01.id,
      finalizer: "FIN-K",
      sufficient: false,
      reason: "DEP-06 — MOT-CNT-01 blocked without MOT-CMP-01 clearance",
    };
  }

  const sufficient = snapshot.contactGated === true && snapshot.ownerAuthorized !== false;

  return {
    loopId: LOOP_DST_CNT_01.id,
    finalizer: sufficient ? "FIN-S" : "FIN-R",
    sufficient,
    dep06Satisfied: snapshot.contactGated === true,
  };
}

/**
 * @param {import('../cb01/factoryRegistry.js').FactoryRegistry} registry
 * @param {string} factoryKey
 * @param {ReturnType<evaluateContactLoop>} result
 */
export function recordLoopDstCnt01(registry, factoryKey, result) {
  return registry.registerElrAct(
    factoryKey,
    "loop_ledger_refs",
    {
      kind: "LOOP_DST_CNT_01_RUN",
      loopId: LOOP_DST_CNT_01.id,
      finalizer: result.finalizer,
      sufficient: result.sufficient,
      dep06Satisfied: result.dep06Satisfied,
      constitutionalPhase: "CB-08",
    },
    { actor: LOOP_DST_CNT_01.id }
  );
}

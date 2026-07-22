/**
 * CB-08 — LOOP-DST-INV-01 Distress Event Investigation Loop
 */

import { DISTRESS_LOOPS } from "./distressCatalog.js";

export const LOOP_DST_INV_01 = DISTRESS_LOOPS.find((l) => l.id === "LOOP-DST-INV-01");

/**
 * @param {{
 *   manifests: object[],
 *   signals: object[],
 * }} snapshot
 */
export function evaluateDistressInvestigation(snapshot) {
  const lifeEventMotors = ["MOT-LFE-01", "MOT-LFE-02", "MOT-LFE-03", "MOT-LFE-04"];
  const lifeEvents = snapshot.manifests.filter((m) => lifeEventMotors.includes(m.motorId));
  const judicial = snapshot.manifests.find((m) => m.motorId === "MOT-JUD-01");
  const codeEnforcement = snapshot.manifests.find((m) => m.motorId === "MOT-COD-01");

  const investigationDepth =
    lifeEvents.length + (judicial ? 1 : 0) + (codeEnforcement ? 1 : 0);
  const sufficient = investigationDepth >= 3 && (snapshot.signals?.length ?? 0) >= 1;

  return {
    loopId: LOOP_DST_INV_01.id,
    finalizer: sufficient ? "FIN-S" : "FIN-R",
    sufficient,
    investigationDepth,
  };
}

/**
 * @param {import('../cb01/factoryRegistry.js').FactoryRegistry} registry
 * @param {string} factoryKey
 * @param {ReturnType<evaluateDistressInvestigation>} result
 */
export function recordLoopDstInv01(registry, factoryKey, result) {
  return registry.registerElrAct(
    factoryKey,
    "loop_ledger_refs",
    {
      kind: "LOOP_DST_INV_01_RUN",
      loopId: LOOP_DST_INV_01.id,
      finalizer: result.finalizer,
      sufficient: result.sufficient,
      investigationDepth: result.investigationDepth,
      constitutionalPhase: "CB-08",
    },
    { actor: LOOP_DST_INV_01.id }
  );
}

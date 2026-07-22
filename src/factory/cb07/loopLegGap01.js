/**
 * CB-07 — LOOP-LEG-GAP-01 Legitimacy Gap Closure Loop
 */

import { LEGITIMACY_LOOPS, C1_BLOCKER_CODES } from "./legitimacyCatalog.js";

export const LOOP_LEG_GAP_01 = LEGITIMACY_LOOPS[1];

/**
 * @param {{ blockers: object[] }} snapshot
 */
export function evaluateLegitimacyGaps(snapshot) {
  const docGaps = (snapshot.blockers ?? []).filter(
    (b) => b.code === C1_BLOCKER_CODES.DOC_GAP_OBL
  );

  return {
    loopId: LOOP_LEG_GAP_01.id,
    finalizer: docGaps.length === 0 ? "FIN-S" : "FIN-X",
    gapsClosed: docGaps.length === 0,
    openGaps: docGaps,
    metrics: { document_checklist_completion: docGaps.length === 0 ? 1 : 0 },
  };
}

/**
 * @param {import('../cb01/factoryRegistry.js').FactoryRegistry} registry
 * @param {string} factoryKey
 * @param {ReturnType<evaluateLegitimacyGaps>} result
 */
export function recordLoopLegGap01(registry, factoryKey, result) {
  return registry.registerElrAct(
    factoryKey,
    "loop_ledger_refs",
    {
      kind: "LOOP_LEG_GAP_01_RUN",
      loopId: LOOP_LEG_GAP_01.id,
      finalizer: result.finalizer,
      gapsClosed: result.gapsClosed,
      metrics: result.metrics,
      constitutionalPhase: "CB-07",
    },
    { actor: LOOP_LEG_GAP_01.id }
  );
}

/**
 * CB-09 — LOOP-ECO-SUP-01 Economy Layer Orchestration Loop (LK-04)
 */

import { ECONOMY_LOOPS } from "./economyCatalog.js";

export const LOOP_ECO_SUP_01 = ECONOMY_LOOPS.find((l) => l.id === "LOOP-ECO-SUP-01");

/**
 * LK-04: supervisor coordinates sub-loops only — no direct motor re-execution.
 *
 * @param {{
 *   subLoopResults: { loopId: string, finalizer: string, sufficient: boolean }[],
 *   dstHandoff?: boolean,
 * }} snapshot
 */
export function evaluateEcoSupervisor(snapshot) {
  const expectedSubLoops = [
    "LOOP-ECO-FRS-01",
    "LOOP-ECO-QLT-01",
    "LOOP-ECO-QLT-02",
    "LOOP-ECO-FRS-02",
  ];

  const reportedIds = snapshot.subLoopResults.map((r) => r.loopId);
  const allReported = expectedSubLoops.every((id) => reportedIds.includes(id));
  const allSufficient = snapshot.subLoopResults.every((r) => r.sufficient);

  if (!snapshot.dstHandoff) {
    return {
      loopId: LOOP_ECO_SUP_01.id,
      finalizer: "FIN-R",
      sufficient: false,
      lk04Compliant: true,
      orchestrationOnly: true,
      reason: "missing_dst_handoff",
    };
  }

  const sufficient = allReported && allSufficient;

  return {
    loopId: LOOP_ECO_SUP_01.id,
    finalizer: sufficient ? "FIN-S" : "FIN-R",
    sufficient,
    lk04Compliant: true,
    orchestrationOnly: true,
    motorsReExecuted: false,
    handoff: sufficient ? { target: LOOP_ECO_SUP_01.handoffTarget, layer: "INT-RDY" } : null,
    subLoopsCoordinated: reportedIds,
    metrics: {
      economy_orchestration_score: sufficient ? 1 : 0,
      sub_loops_reported: reportedIds.length,
    },
  };
}

/**
 * @param {import('../cb01/factoryRegistry.js').FactoryRegistry} registry
 * @param {string} factoryKey
 * @param {ReturnType<evaluateEcoSupervisor>} result
 */
export function recordLoopEcoSup01(registry, factoryKey, result) {
  registry.registerElrAct(
    factoryKey,
    "loop_ledger_refs",
    {
      kind: "LOOP_ECO_SUP_01_RUN",
      loopId: LOOP_ECO_SUP_01.id,
      finalizer: result.finalizer,
      sufficient: result.sufficient,
      lk04Compliant: result.lk04Compliant,
      orchestrationOnly: result.orchestrationOnly,
      motorsReExecuted: result.motorsReExecuted,
      metrics: result.metrics,
      constitutionalPhase: "CB-09",
    },
    { actor: LOOP_ECO_SUP_01.id }
  );

  if (result.sufficient && result.handoff) {
    registry.registerElrAct(
      factoryKey,
      "decision_handoffs",
      {
        kind: "ECO_FIN_S_HANDOFF",
        fromLoop: LOOP_ECO_SUP_01.id,
        toLoop: result.handoff.target,
        layer: result.handoff.layer,
        message: "Economy layer complete — handoff to Integration Readiness",
      },
      { actor: LOOP_ECO_SUP_01.id }
    );
  }

  return result;
}

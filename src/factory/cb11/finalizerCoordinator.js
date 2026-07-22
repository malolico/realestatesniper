/**
 * CB-11 — FIN-S / FIN-C / FIN-H / FIN-K / FIN-X coordinator
 */

export const FINALIZER_PRIORITY = Object.freeze({
  "FIN-C": 5,
  "FIN-K": 4,
  "FIN-X": 3,
  "FIN-H": 2,
  "FIN-S": 1,
  "FIN-R": 0,
});

/**
 * @param {string} finalizer
 */
export function isTerminalFinalizer(finalizer) {
  return ["FIN-S", "FIN-C", "FIN-K", "FIN-X"].includes(finalizer);
}

/**
 * @param {string} finalizer
 */
export function finalizerEnablesHandoff(finalizer) {
  return finalizer === "FIN-S" || finalizer === "FIN-H";
}

/**
 * @param {string} finalizer
 */
export function finalizerBlocksProgress(finalizer) {
  return ["FIN-C", "FIN-K"].includes(finalizer);
}

/**
 * @param {string} finalizer
 */
export function finalizerIsExhaustion(finalizer) {
  return finalizer === "FIN-X";
}

/**
 * Coordinate multiple loop outcomes — highest-priority finalizer wins.
 *
 * @param {{ loopId: string, finalizer: string }[]} results
 */
export function coordinateFinalizers(results) {
  if (!results.length) {
    return { dominant: "FIN-R", handoffEligible: false, blocked: false, exhausted: false };
  }

  const sorted = [...results].sort(
    (a, b) => (FINALIZER_PRIORITY[b.finalizer] ?? 0) - (FINALIZER_PRIORITY[a.finalizer] ?? 0)
  );
  const dominant = sorted[0].finalizer;

  return {
    dominant,
    handoffEligible: finalizerEnablesHandoff(dominant),
    blocked: finalizerBlocksProgress(dominant),
    exhausted: finalizerIsExhaustion(dominant),
    contributors: sorted,
  };
}

/**
 * @param {string} fromFinalizer
 * @param {string} toLoop
 */
export function buildFinHandoff(fromFinalizer, toLoop) {
  if (!finalizerEnablesHandoff(fromFinalizer)) {
    return null;
  }
  return {
    kind: fromFinalizer === "FIN-H" ? "LOOP_FIN_H_HANDOFF" : "LOOP_FIN_S_HANDOFF",
    finalizer: fromFinalizer,
    toLoop,
    message: `${fromFinalizer} — handoff to ${toLoop}`,
  };
}

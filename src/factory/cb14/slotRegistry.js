/**
 * CB-14 — SLOT registry (10 neutral model slots)
 */

export const SLOT_CATALOG = Object.freeze([
  { id: "SLOT-01", funBinding: ["NRM", "MAP"], dualRunClassC: true, status: "ACTIVO" },
  { id: "SLOT-02", funBinding: ["EXT"], dualRunClassC: true, status: "ACTIVO" },
  { id: "SLOT-03", funBinding: ["MAT"], dualRunClassC: true, status: "ACTIVO" },
  { id: "SLOT-04", funBinding: ["VER"], dualRunClassC: true, status: "ACTIVO" },
  { id: "SLOT-05", funBinding: ["GAP", "RNK"], dualRunClassC: false, status: "ACTIVO" },
  { id: "SLOT-06", funBinding: ["SUM"], dualRunClassC: true, status: "ACTIVO" },
  { id: "SLOT-07", funBinding: ["ENR"], dualRunClassC: false, status: "ACTIVO" },
  { id: "SLOT-08", funBinding: ["EXP", "CRD"], dualRunClassC: false, status: "ACTIVO" },
  { id: "SLOT-09", funBinding: ["UNC"], dualRunClassC: true, status: "ACTIVO" },
  { id: "SLOT-10", funBinding: ["VER", "MAT", "EXT"], dualRunClassC: true, status: "STANDBY" },
]);

export const SLOT_COUNT = SLOT_CATALOG.length;

/**
 * @param {string} slotId
 */
export function getSlot(slotId) {
  const slot = SLOT_CATALOG.find((s) => s.id === slotId);
  if (!slot) throw new Error(`[CB-14 SLOT] Unknown slot: ${slotId}`);
  return slot;
}

/**
 * Dual-run clase C — calibration comparison for SLOT substitution.
 *
 * @param {object} runA
 * @param {object} runB
 */
export function validateDualRunClassC(runA, runB) {
  const eLevelMatch = runA.outputELevel === runB.outputELevel;
  const funMatch = runA.fun === runB.fun;
  const calibrationDelta = Math.abs((runA.confidence ?? 0) - (runB.confidence ?? 0));
  const pass = eLevelMatch && funMatch && calibrationDelta <= 0.15;

  return {
    pass,
    eLevelMatch,
    funMatch,
    calibrationDelta,
    slotA: runA.modelSlot,
    slotB: runB.modelSlot,
    rule: "LAC-17 dual-run clase C",
  };
}

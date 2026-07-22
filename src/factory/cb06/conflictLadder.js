/**
 * CB-06 — Conflict resolution ladder L1 → L4 → L5
 */

export const CONFLICT_LADDER = Object.freeze([
  { level: "L1", actor: "MOT-VER", action: "VERIFY_RETRY" },
  { level: "L4", actor: "MOT-EVD-02", action: "ARBITRATE" },
  { level: "L5", actor: "Evidence Council", action: "FIN-H" },
]);

/**
 * @param {{ resolvable?: boolean, arbitrationAttempted?: boolean }} state
 */
export function nextConflictLadderStep(state) {
  if (!state.arbitrationAttempted) {
    return { ...CONFLICT_LADDER[0], escalate: false };
  }
  if (state.resolvable === false) {
    return { ...CONFLICT_LADDER[2], escalate: true };
  }
  return { ...CONFLICT_LADDER[1], escalate: false };
}

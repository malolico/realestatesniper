/**
 * CB-02 — Source conflict rules R1-R8 (DSO §VIII) — no averaging (LS-09)
 */

export const CONFLICT_RULES = Object.freeze([
  { id: "R1", rule: "Recorded instrument > owner verbal" },
  { id: "R2", rule: "Active judicial act > commercial aggregator" },
  { id: "R3", rule: "Fresher same-level source prevails" },
  { id: "R4", rule: "Specialized primary > tertiary same topic" },
  { id: "R5", rule: "Convergence >=2 independent > single source" },
  { id: "R6", rule: "Irresolvable conflict = blocking flag" },
  { id: "R7", rule: "Do not average incompatible values" },
  { id: "R8", rule: "Document resolution before Decision-Diamond" },
]);

/**
 * @param {{ conflictDetected: boolean, resolvable?: boolean }} input
 */
export function resolveConflictPolicy(input) {
  if (!input.conflictDetected) {
    return { action: "ACCEPT", deriveToEvidence: false };
  }
  if (input.resolvable === false) {
    return { action: "BLOCK", deriveToEvidence: true, rule: "R6" };
  }
  return { action: "DERIVE_EVIDENCE", deriveToEvidence: true, rule: "R7" };
}

export function assertNoAveraging(strategy) {
  if (strategy === "AVERAGE" || strategy === "MEAN") {
    throw new Error("[CB-02 DSO] Averaging sources is prohibited (LS-09 / R7)");
  }
}

/**
 * CB-12 — Convergence State (CS) / Uncertainty State (US) — MSA §XII–XIII
 */

export const CS_LEVELS = Object.freeze({
  "CS-1": { min: 0.0, max: 0.39, label: "divergent" },
  "CS-2": { min: 0.4, max: 0.59, label: "weak" },
  "CS-3": { min: 0.6, max: 0.74, label: "partial" },
  "CS-4": { min: 0.75, max: 0.89, label: "acceptable" },
  "CS-5": { min: 0.9, max: 1.0, label: "strong" },
});

export const US_LEVELS = Object.freeze({
  "US-1": { min: 0.0, max: 0.1, label: "minimal" },
  "US-2": { min: 0.11, max: 0.4, label: "low" },
  "US-3": { min: 0.41, max: 0.6, label: "moderate" },
  "US-4": { min: 0.61, max: 0.8, label: "high" },
  "US-5": { min: 0.81, max: 1.0, label: "extreme" },
});

const CS_ORDER = ["CS-1", "CS-2", "CS-3", "CS-4", "CS-5"];
const US_ORDER = ["US-1", "US-2", "US-3", "US-4", "US-5"];

/**
 * @param {number} score 0..1
 */
export function resolveCsLevel(score) {
  const clamped = Math.max(0, Math.min(1, score));
  for (const [level, band] of Object.entries(CS_LEVELS)) {
    if (clamped >= band.min && clamped <= band.max) return level;
  }
  return "CS-1";
}

/**
 * @param {number} score 0..1
 */
export function resolveUsLevel(score) {
  const clamped = Math.max(0, Math.min(1, score));
  for (const [level, band] of Object.entries(US_LEVELS)) {
    if (clamped >= band.min && clamped <= band.max) return level;
  }
  return "US-5";
}

/**
 * @param {string} levelA
 * @param {string} levelB
 */
function compareLevel(levelA, levelB, order) {
  return order.indexOf(levelA) - order.indexOf(levelB);
}

/**
 * @param {{ csThreshold?: string, usMax?: string }} pattern
 * @param {number} consensusScore
 * @param {number} uncertaintyScore
 */
export function evaluateConvergenceState(pattern, consensusScore, uncertaintyScore) {
  const csLevel = resolveCsLevel(consensusScore);
  const usLevel = resolveUsLevel(uncertaintyScore);
  const csThreshold = pattern.csThreshold ?? "CS-4";
  const usMax = pattern.usMax ?? "US-3";

  const csMet = compareLevel(csLevel, csThreshold, CS_ORDER) >= 0;
  const usMet = compareLevel(usLevel, usMax, US_ORDER) <= 0;

  return {
    consensusScore,
    uncertaintyScore,
    csLevel,
    usLevel,
    csThreshold,
    usMax,
    converged: csMet && usMet,
    csMet,
    usMet,
  };
}

/**
 * CB-11 — STR-1..6 strategy escalation ladder
 */

export const STR_ESCALATION_LADDER = Object.freeze([
  { level: "STR-1", action: "refresh_source", derivesSwarm: false },
  { level: "STR-2", action: "alternate_source", derivesSwarm: false },
  { level: "STR-3", action: "requery_motor", derivesSwarm: false },
  { level: "STR-4", action: "widen_search", derivesSwarm: false },
  { level: "STR-5", action: "challenge_pipeline", derivesSwarm: false },
  { level: "STR-6", action: "derive_swarm", derivesSwarm: true, target: "CB-12:SwarmCoordinator" },
]);

/**
 * @param {number} attempt
 * @param {{ forceSwarm?: boolean }} [options]
 */
export function resolveStrategyEscalation(attempt, options = {}) {
  if (options.forceSwarm || attempt >= 6) {
    return STR_ESCALATION_LADDER[5];
  }
  const idx = Math.min(Math.max(attempt, 1), 6) - 1;
  return STR_ESCALATION_LADDER[idx];
}

/**
 * @param {string} strategyLevel
 */
export function strategyDerivesSwarm(strategyLevel) {
  return strategyLevel === "STR-6";
}

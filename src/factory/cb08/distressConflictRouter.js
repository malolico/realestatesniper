/**
 * CB-08 — Distress conflict routing (STR-6 → Swarm Coordinator)
 */

export const DST_CONFLICT_TARGETS = Object.freeze({
  SWARM: "CB-12:SwarmCoordinator",
  SWM_MOT: "CB-12:SWM-MOT-01",
  EVIDENCE: "CB-06:MOT-EVD-02",
});

/**
 * @param {{
 *   singleSignalOnly?: boolean,
 *   signalConflict?: boolean,
 *   multiSignalFailure?: boolean,
 * }} input
 */
export function routeDistressConflict(input) {
  if (input.multiSignalFailure || input.signalConflict) {
    return {
      action: "DERIVE_SWARM",
      strategy: "STR-6",
      target: DST_CONFLICT_TARGETS.SWARM,
      swarmMission: DST_CONFLICT_TARGETS.SWM_MOT,
      message: "STR-6 — multi-SIG convergence failure → Swarm Coordinator (CB-12)",
    };
  }

  if (input.singleSignalOnly) {
    return {
      action: "MOTIVATION_EXHAUSTED",
      strategy: "STR-1",
      target: null,
      message: "Single signal — motivation cannot reach C1",
    };
  }

  return { action: "CONTINUE", strategy: null, target: null };
}

/**
 * @param {import('../cb01/factoryRegistry.js').FactoryRegistry} registry
 * @param {string} factoryKey
 * @param {ReturnType<routeDistressConflict>} route
 */
export function recordDistressConflictDerivation(registry, factoryKey, route) {
  if (route.action === "CONTINUE" || route.action === "MOTIVATION_EXHAUSTED") {
    return null;
  }

  return registry.registerElrAct(
    factoryKey,
    "swarm_mission_refs",
    {
      kind: "DST_STR6_SWARM_DERIVATION",
      route,
      constitutionalPhase: "CB-08",
    },
    { actor: "LOOP-DST-CVG-01" }
  );
}

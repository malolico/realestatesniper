/**
 * CB-09 — Valuation / investment conflict routing (→ CB-12 Swarms)
 */

export const ECO_CONFLICT_TARGETS = Object.freeze({
  SWARM_ECO: "CB-12:SWM-ECO-01",
  SWARM_VAL: "CB-12:SWM-VAL-01",
  SWARM_IVM: "CB-12:SWM-IVM-01",
  EVIDENCE: "CB-06:MOT-EVD-02",
});

/**
 * @param {{
 *   compConflict?: boolean,
 *   insufficientComps?: boolean,
 *   multiStrategy?: boolean,
 *   circularDependency?: boolean,
 * }} input
 */
export function routeEconomyConflict(input) {
  if (input.circularDependency) {
    return {
      action: "DERIVE_SWARM",
      strategy: "STR-6",
      target: ECO_CONFLICT_TARGETS.SWARM_ECO,
      swarmMission: ECO_CONFLICT_TARGETS.SWARM_ECO,
      message: "FIN+MKT+HAZ circular dependency → SWM-ECO-01 (CB-12)",
    };
  }

  if (input.insufficientComps || input.compConflict) {
    return {
      action: "DERIVE_SWARM",
      strategy: input.insufficientComps ? "STR-4" : "STR-5",
      target: ECO_CONFLICT_TARGETS.SWARM_VAL,
      swarmMission: ECO_CONFLICT_TARGETS.SWARM_VAL,
      message: "Valuation comps conflict → SWM-VAL-01 (CB-12)",
    };
  }

  if (input.multiStrategy) {
    return {
      action: "DERIVE_SWARM",
      strategy: "STR-6",
      target: ECO_CONFLICT_TARGETS.SWARM_IVM,
      swarmMission: ECO_CONFLICT_TARGETS.SWARM_IVM,
      message: "Multi-strategy sensitivity incomplete → SWM-IVM-01 (CB-12)",
    };
  }

  return { action: "CONTINUE", strategy: null, target: null };
}

/**
 * @param {import('../cb01/factoryRegistry.js').FactoryRegistry} registry
 * @param {string} factoryKey
 * @param {ReturnType<routeEconomyConflict>} route
 */
export function recordEconomyConflictDerivation(registry, factoryKey, route) {
  if (route.action === "CONTINUE") return null;

  return registry.registerElrAct(
    factoryKey,
    "swarm_mission_refs",
    {
      kind: "ECO_VALUATION_CONFLICT_DERIVATION",
      route,
      constitutionalPhase: "CB-09",
    },
    { actor: "LOOP-ECO-QLT-01" }
  );
}

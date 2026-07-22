/**
 * CB-05 — Identity conflict routing per LOOP-FND-SUP-01 STR ladder
 * Derives to CB-06 Evidence or CB-12 Swarm without implementing those phases.
 */

export const CONFLICT_STRATEGIES = Object.freeze({
  STR_1: "STR-1",
  STR_2: "STR-2",
  STR_5: "STR-5",
  STR_7: "STR-7",
});

export const DERIVATION_TARGETS = Object.freeze({
  EVIDENCE: "CB-06:MOT-EVD-01",
  SWARM: "CB-12:SWM-IDN-01",
  MOTOR_RETRY: "MOT-IDN-02",
});

/**
 * @param {{
 *   conflict: boolean,
 *   sourceCount?: number,
 *   strategy?: string,
 *   reconciled?: boolean,
 *   idn02Attempted?: boolean,
 * }} input
 */
export function routeFoundationConflict(input) {
  if (!input.conflict) {
    return { action: "CONTINUE", target: null, strategy: null };
  }

  if (input.idn02Attempted && input.reconciled === false) {
    if ((input.sourceCount ?? 0) >= 3) {
      return {
        action: "DERIVE_SWARM",
        target: DERIVATION_TARGETS.SWARM,
        strategy: CONFLICT_STRATEGIES.STR_7,
        message: "Tri-source conflict — derive to SWM-IDN-01 (CB-12)",
      };
    }
    return {
      action: "DERIVE_EVIDENCE",
      target: DERIVATION_TARGETS.EVIDENCE,
      strategy: CONFLICT_STRATEGIES.STR_7,
      message: "Identity conflict unresolved — derive to MOT-EVD-01 (CB-06)",
    };
  }

  const strategy = input.strategy ?? CONFLICT_STRATEGIES.STR_5;

  if (strategy === CONFLICT_STRATEGIES.STR_5 && input.reconciled !== true) {
    return {
      action: "RETRY_MOTOR",
      target: DERIVATION_TARGETS.MOTOR_RETRY,
      strategy: CONFLICT_STRATEGIES.STR_5,
      message: "Identity conflict — retry MOT-IDN-02",
    };
  }

  if ((input.sourceCount ?? 0) >= 3) {
    return {
      action: "DERIVE_SWARM",
      target: DERIVATION_TARGETS.SWARM,
      strategy: CONFLICT_STRATEGIES.STR_7,
      message: "Tri-source conflict — derive to SWM-IDN-01 (CB-12)",
    };
  }

  return {
    action: "DERIVE_EVIDENCE",
    target: DERIVATION_TARGETS.EVIDENCE,
    strategy: CONFLICT_STRATEGIES.STR_7,
    message: "Identity conflict unresolved — derive to MOT-EVD-01 (CB-06)",
  };
}

/**
 * @param {import('../cb01/factoryRegistry.js').FactoryRegistry} registry
 * @param {string} factoryKey
 * @param {ReturnType<routeFoundationConflict>} route
 */
export function recordConflictDerivation(registry, factoryKey, route) {
  if (route.action === "CONTINUE") {
    return null;
  }

  const section =
    route.action === "DERIVE_SWARM" ? "swarm_mission_refs" : "conflict_resolutions";

  return registry.registerElrAct(
    factoryKey,
    section,
    {
      kind: "FND_IDENTITY_CONFLICT_DERIVATION",
      route,
      pendingPhase: route.target,
      constitutionalPhase: "CB-05",
    },
    { actor: "LOOP-FND-SUP-01" }
  );
}

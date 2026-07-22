/**
 * CB-10 — Environment / context conflict routing
 */

export const ENV_CONFLICT_TARGETS = Object.freeze({
  EVIDENCE: "CB-06:MOT-EVD-02",
  ENV_SUP: "LOOP-ENV-SUP-01",
  ENV_FRS: "LOOP-ENV-FRS-01",
});

/**
 * @param {{
 *   demographicConflict?: boolean,
 *   fairHousingRisk?: boolean,
 *   staleCensus?: boolean,
 *   contextualGap?: boolean,
 * }} input
 */
export function routeEnvironmentConflict(input) {
  if (input.fairHousingRisk) {
    return {
      action: "RESTRICT_USAGE",
      strategy: "LS-17",
      target: ENV_CONFLICT_TARGETS.ENV_SUP,
      message: "Fair Housing guard — contextual field restricted from product discrimination",
    };
  }

  if (input.staleCensus) {
    return {
      action: "DERIVE_FRESHNESS",
      strategy: "STR-1",
      target: ENV_CONFLICT_TARGETS.ENV_FRS,
      message: "Census vintage stale — LOOP-ENV-FRS-01 refresh required",
    };
  }

  if (input.demographicConflict || input.contextualGap) {
    return {
      action: "DERIVE_EVIDENCE",
      strategy: "STR-2",
      target: ENV_CONFLICT_TARGETS.EVIDENCE,
      message: "Contextual conflict — MOT-EVD-02 arbitration",
    };
  }

  return { action: "CONTINUE", strategy: null, target: null };
}

/**
 * @param {import('../cb01/factoryRegistry.js').FactoryRegistry} registry
 * @param {string} factoryKey
 * @param {ReturnType<routeEnvironmentConflict>} route
 */
export function recordEnvironmentConflictDerivation(registry, factoryKey, route) {
  if (route.action === "CONTINUE") return null;

  const section =
    route.action === "DERIVE_EVIDENCE" ? "conflict_resolutions" : "loop_ledger_refs";

  return registry.registerElrAct(
    factoryKey,
    section,
    {
      kind: "ENV_CONTEXT_CONFLICT",
      route,
      constitutionalPhase: "CB-10",
    },
    { actor: "LOOP-ENV-SUP-01" }
  );
}

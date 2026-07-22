/**
 * CB-13 — Sufficiency gap routing (INT-EVD → XVR-EVD / SWM-SUF-01)
 */

export const SUFFICIENCY_GAP_TARGETS = Object.freeze({
  XVR_EVD: "LOOP-XVR-EVD-01",
  SWARM_SUF: "CB-12:SWM-SUF-01",
  EVIDENCE: "CB-06:MOT-EVD-01",
});

/**
 * @param {{
 *   evidenceSufficient?: boolean,
 *   multiDomainGap?: boolean,
 *   openConflicts?: number,
 * }} input
 */
export function routeSufficiencyGap(input) {
  if (input.evidenceSufficient === true) {
    return { action: "CONTINUE", target: null, strategy: null };
  }

  if (input.multiDomainGap === true || (input.openConflicts ?? 0) >= 2) {
    return {
      action: "DERIVE_SWARM",
      strategy: "STR-6",
      target: SUFFICIENCY_GAP_TARGETS.SWARM_SUF,
      message: "Multi-domain sufficiency gap → SWM-SUF-01 (CB-12)",
    };
  }

  return {
    action: "DERIVE_EVIDENCE",
    strategy: "STR-5",
    target: SUFFICIENCY_GAP_TARGETS.XVR_EVD,
    message: "Sufficiency gap → LOOP-XVR-EVD-01",
  };
}

/**
 * @param {import('../cb01/factoryRegistry.js').FactoryRegistry} registry
 * @param {string} factoryKey
 * @param {ReturnType<routeSufficiencyGap>} route
 */
export function recordSufficiencyGapDerivation(registry, factoryKey, route) {
  if (route.action === "CONTINUE") return null;

  const section =
    route.action === "DERIVE_SWARM" ? "swarm_mission_refs" : "conflict_resolutions";

  return registry.registerElrAct(
    factoryKey,
    section,
    {
      kind: "INT_SUFFICIENCY_GAP_DERIVATION",
      route,
      constitutionalPhase: "CB-13",
    },
    { actor: "LOOP-INT-EVD-01" }
  );
}

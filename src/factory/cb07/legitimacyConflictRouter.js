/**
 * CB-07 — Ownership / title conflict routing
 */

export const LEG_CONFLICT_TARGETS = Object.freeze({
  EVIDENCE: "CB-06:MOT-EVD-02",
  SWARM_EVD: "CB-12:SWM-EVD-01",
  LOOP_LEG_EVD: "LOOP-LEG-EVD-01",
});

/**
 * @param {{
 *   ownerMismatch?: boolean,
 *   titleCloud?: boolean,
 *   multiDomain?: boolean,
 *   domainCount?: number,
 * }} input
 */
export function routeLegitimacyConflict(input) {
  if (!input.ownerMismatch && !input.titleCloud) {
    return { action: "CONTINUE", target: null };
  }

  if (input.multiDomain === true || (input.domainCount ?? 0) >= 2) {
    return {
      action: "DERIVE_SWARM",
      target: LEG_CONFLICT_TARGETS.SWARM_EVD,
      viaLoop: LEG_CONFLICT_TARGETS.LOOP_LEG_EVD,
      message: "Multi-domain legitimacy conflict — escalate to SWM-EVD-01",
    };
  }

  return {
    action: "DERIVE_EVIDENCE",
    target: LEG_CONFLICT_TARGETS.EVIDENCE,
    viaLoop: LEG_CONFLICT_TARGETS.LOOP_LEG_EVD,
    message: "Ownership/title conflict — MOT-EVD-02 arbitration",
  };
}

/**
 * @param {import('../cb01/factoryRegistry.js').FactoryRegistry} registry
 * @param {string} factoryKey
 * @param {ReturnType<routeLegitimacyConflict>} route
 */
export function recordLegitimacyConflictDerivation(registry, factoryKey, route) {
  if (route.action === "CONTINUE") return null;

  const section = route.action === "DERIVE_SWARM" ? "swarm_mission_refs" : "conflict_resolutions";

  return registry.registerElrAct(
    factoryKey,
    section,
    {
      kind: "LEG_OWNERSHIP_TITLE_CONFLICT",
      route,
      constitutionalPhase: "CB-07",
    },
    { actor: "LOOP-LEG-EVD-01" }
  );
}

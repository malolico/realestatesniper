/**
 * CB-13 — Decision handoff preparation (CB-16 boundary — not CB-16 itself)
 */

/**
 * @param {import('../cb01/factoryRegistry.js').FactoryRegistry} registry
 * @param {string} factoryKey
 * @param {{ readinessPass: boolean, gateEvaluation: object }} result
 */
export function recordDecisionHandoffPrep(registry, factoryKey, result) {
  if (!result.readinessPass) {
    return null;
  }

  return registry.registerElrAct(
    factoryKey,
    "decision_handoffs",
    {
      kind: "DECISION_HANDOFF_PREP_CB16",
      target: "CB-16:DecisionHandoffInterface",
      fromLoop: "LOOP-INT-RDY-01",
      finalizer: "FIN-S",
      gatesPass: result.gateEvaluation.allPass,
      passCount: result.gateEvaluation.passCount,
      pendingPhase: "CB-16",
      message: "LOOP-INT-RDY-01 FIN-S — Decision handoff enabled (CB-16 boundary)",
      constitutionalPhase: "CB-13",
    },
    { actor: "LOOP-INT-RDY-01" }
  );
}

/**
 * @param {object} elr
 */
export function isDecisionHandoffEnabled(elr) {
  return (elr?.decision_handoffs ?? []).some((h) => h.kind === "DECISION_HANDOFF_PREP_CB16");
}

/**
 * CB-13 — Readiness ledger (EVF) — ELR registration
 */

/**
 * @param {import('../cb01/factoryRegistry.js').FactoryRegistry} registry
 * @param {string} factoryKey
 * @param {object} gateEvaluation
 */
export function recordReadinessGateEvaluation(registry, factoryKey, gateEvaluation) {
  return registry.registerElrAct(
    factoryKey,
    "motor_manifests",
    {
      kind: "EVF_READINESS_GATE_EVAL",
      evf: "EVF-READINESS",
      motorId: "MOT-SYN-02",
      gates: gateEvaluation.gates,
      allPass: gateEvaluation.allPass,
      passCount: gateEvaluation.passCount,
      gateCount: gateEvaluation.gateCount,
      constitutionalPhase: "CB-13",
    },
    { actor: "MOT-SYN-02" }
  );
}

/**
 * @param {import('../cb01/factoryRegistry.js').FactoryRegistry} registry
 * @param {string} factoryKey
 * @param {{ from: string, to: string, gateEvaluation: object }} transition
 */
export function recordReadinessStateTransition(registry, factoryKey, transition) {
  return registry.registerElrAct(
    factoryKey,
    "motor_manifests",
    {
      kind: "EVF_READINESS_STATE_TRANSITION",
      evf: "EVF-READINESS",
      fromState: transition.from,
      toState: transition.to,
      gatesPass: transition.gateEvaluation.allPass,
      constitutionalPhase: "CB-13",
    },
    { actor: "MOT-SYN-02" }
  );
}

/**
 * @param {import('../cb01/factoryRegistry.js').FactoryRegistry} registry
 * @param {string} factoryKey
 * @param {object[]} knownUnknowns
 */
export function recordKnownUnknownsDeclaration(registry, factoryKey, knownUnknowns) {
  return registry.registerElrAct(
    factoryKey,
    "conflict_resolutions",
    {
      kind: "DKN_KNOWN_UNKNOWNS_DECLARED",
      unknowns: knownUnknowns,
      obligationCount: knownUnknowns.filter((u) => u.obligation === "Obl").length,
      constitutionalPhase: "CB-13",
    },
    { actor: "MOT-SYN-02" }
  );
}

/**
 * @param {import('../cb01/factoryRegistry.js').FactoryRegistry} registry
 * @param {string} factoryKey
 */
export function recordIntelligenceLayerComplete(registry, factoryKey) {
  return registry.registerElrAct(
    factoryKey,
    "loop_ledger_refs",
    {
      kind: "INTELLIGENCE_LAYER_REGISTRY_COMPLETE",
      motorCount: 5,
      loopCount: 5,
      gateCount: 7,
      constitutionalPhase: "CB-13",
    },
    { actor: "LOOP-INT-RDY-01" }
  );
}

/**
 * CB-15 — Handoff manager (OLC §IV.3 + FFO §IV)
 */

/**
 * @param {object} elr
 */
export function collectHandoffs(elr) {
  const handoffs = elr?.decision_handoffs ?? [];
  return {
    olc: handoffs.filter((h) => h.kind?.includes("HANDOFF") || h.kind?.includes("ACCEPT")),
    ffo: handoffs.filter((h) => h.kind?.startsWith("FFO_") || h.kind === "DECISION_HANDOFF_PREP_CB16"),
    layer: handoffs.filter((h) => h.kind?.includes("FIN_S") || h.kind?.includes("ACCEPT")),
    all: handoffs,
  };
}

/**
 * @param {import('../cb01/factoryRegistry.js').FactoryRegistry} registry
 * @param {string} factoryKey
 * @param {object} handoff
 */
export function recordFfoHandoff(registry, factoryKey, handoff) {
  return registry.registerElrAct(
    factoryKey,
    "decision_handoffs",
    {
      kind: "FFO_LAYER_HANDOFF",
      ...handoff,
      constitutionalPhase: "CB-15",
    },
    { actor: handoff.fromLoop ?? "LOOP-INT-RDY-01" }
  );
}

/**
 * @param {object} elr
 */
export function buildHandoffSummary(elr) {
  const grouped = collectHandoffs(elr);
  return {
    total: grouped.all.length,
    layerHandoffs: grouped.layer.length,
    cb16Prep: grouped.ffo.some((h) => h.kind === "DECISION_HANDOFF_PREP_CB16"),
    pipelineComplete: grouped.layer.length >= 3,
  };
}

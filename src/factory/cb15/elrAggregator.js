/**
 * CB-15 — ELR aggregator (FFO-05 unified expediente view)
 */

/**
 * @param {object} record — expediente record with elr
 */
export function aggregateElr(record) {
  const elr = record?.elr ?? {};
  return {
    factory_key: record?.factory_key,
    state: record?.state,
    sections: {
      state_transitions: (elr.state_transitions ?? []).length,
      motor_manifests: (elr.motor_manifests ?? []).length,
      loop_ledger_refs: (elr.loop_ledger_refs ?? []).length,
      swarm_mission_refs: (elr.swarm_mission_refs ?? []).length,
      aia_rlg_refs: (elr.aia_rlg_refs ?? []).length,
      conflict_resolutions: (elr.conflict_resolutions ?? []).length,
      decision_handoffs: (elr.decision_handoffs ?? []).length,
      factory_key_history: (elr.factory_key_history ?? []).length,
    },
    evidence_registry_ref: elr.evidence_registry_ref ?? null,
    aggregatedAt: new Date().toISOString(),
    rule: "FFO-05",
  };
}

/**
 * @param {import('../cb01/factoryRegistry.js').FactoryRegistry} registry
 * @param {string} factoryKey
 */
export function recordElrAggregation(registry, factoryKey, snapshot) {
  return registry.registerElrAct(
    factoryKey,
    "loop_ledger_refs",
    {
      kind: "FFO_ELR_AGGREGATION",
      snapshot,
      constitutionalPhase: "CB-15",
    },
    { actor: "MOT-SYN-02" }
  );
}

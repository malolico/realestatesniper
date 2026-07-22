/**
 * CB-11 — Loop Ledger ELR registration
 */

/**
 * @param {import('../cb01/factoryRegistry.js').FactoryRegistry} registry
 * @param {string} factoryKey
 * @param {{
 *   loopId: string,
 *   finalizer: string,
 *   sufficient?: boolean,
 *   activators?: string[],
 *   strategy?: string | null,
 *   attempt?: number,
 *   exhausted?: boolean,
 *   integratedPhase?: string,
 *   metadata?: object,
 * }} entry
 */
export function recordLoopLedger(registry, factoryKey, entry) {
  const kind = `LOOP_ENGINE_${entry.loopId.replace(/-/g, "_")}_RUN`;

  return registry.registerElrAct(
    factoryKey,
    "loop_ledger_refs",
    {
      kind,
      loopId: entry.loopId,
      finalizer: entry.finalizer,
      sufficient: entry.sufficient ?? entry.finalizer === "FIN-S",
      activators: entry.activators ?? [],
      strategy: entry.strategy ?? null,
      attempt: entry.attempt ?? 1,
      exhausted: entry.exhausted ?? entry.finalizer === "FIN-X",
      integratedPhase: entry.integratedPhase ?? "CB-11",
      metadata: entry.metadata ?? null,
      constitutionalPhase: "CB-11",
    },
    { actor: entry.loopId }
  );
}

/**
 * @param {import('../cb01/factoryRegistry.js').FactoryRegistry} registry
 * @param {string} factoryKey
 * @param {string[]} executedLoopIds
 */
export function recordLoopEngineRegistryComplete(registry, factoryKey, executedLoopIds) {
  return registry.registerElrAct(
    factoryKey,
    "loop_ledger_refs",
    {
      kind: "LOOP_ENGINE_REGISTRY_COMPLETE",
      loopCount: executedLoopIds.length,
      loopIds: executedLoopIds,
      constitutionalPhase: "CB-11",
    },
    { actor: "LOOP-INT-RDY-01" }
  );
}

/**
 * @param {import('../cb01/factoryRegistry.js').FactoryRegistry} registry
 * @param {string} factoryKey
 * @param {object} handoff
 */
export function recordOlcHandoff(registry, factoryKey, handoff) {
  const { kind: _ignored, ...rest } = handoff;
  return registry.registerElrAct(
    factoryKey,
    "decision_handoffs",
    {
      ...rest,
      kind: "OLC_IV3_HANDOFF",
      pipelineSection: "OLC-IV.3",
      constitutionalPhase: "CB-11",
    },
    { actor: handoff.fromLoop ?? "LOOP-INT-RDY-01" }
  );
}

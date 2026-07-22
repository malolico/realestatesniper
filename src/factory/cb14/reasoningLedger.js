/**
 * CB-14 — Reasoning Ledger (RLG) — IGA §III
 */

/**
 * @param {import('../cb01/factoryRegistry.js').FactoryRegistry} registry
 * @param {string} factoryKey
 * @param {object} invocation
 */
export function recordRlgInvocation(registry, factoryKey, invocation) {
  const invocationId =
    invocation.invocationId ?? `RLG-${factoryKey}-${invocation.aiaId}-${Date.now()}`;

  return registry.registerElrAct(
    factoryKey,
    "aia_rlg_refs",
    {
      kind: "RLG_INVOCATION",
      invocationId,
      aiaId: invocation.aiaId,
      invoker: invocation.invoker,
      modelSlot: invocation.modelSlot,
      autLevel: invocation.autLevel,
      fun: invocation.fun,
      outputELevel: invocation.outputELevel,
      confidence: invocation.confidence,
      uncertaintyScore: invocation.uncertaintyScore,
      prhPass: invocation.prhPass,
      prhViolations: invocation.prhViolations ?? [],
      reasoningSummary: invocation.reasoningSummary,
      assistiveOnly: true,
      constitutionalPhase: "CB-14",
    },
    { actor: invocation.aiaId }
  );
}

/**
 * @param {import('../cb01/factoryRegistry.js').FactoryRegistry} registry
 * @param {string} factoryKey
 * @param {string[]} registeredAiaIds
 */
export function recordAiAssistRegistryComplete(registry, factoryKey, registeredAiaIds) {
  return registry.registerElrAct(
    factoryKey,
    "aia_rlg_refs",
    {
      kind: "AI_ASSIST_REGISTRY_COMPLETE",
      aiaCount: registeredAiaIds.length,
      aiaIds: registeredAiaIds,
      slotCount: 10,
      constitutionalPhase: "CB-14",
    },
    { actor: "AIA-EXP-01" }
  );
}

/**
 * @param {import('../cb01/factoryRegistry.js').FactoryRegistry} registry
 * @param {string} factoryKey
 * @param {object} dualRun
 */
export function recordDualRunValidation(registry, factoryKey, dualRun) {
  return registry.registerElrAct(
    factoryKey,
    "aia_rlg_refs",
    {
      kind: "SLOT_DUAL_RUN_CLASS_C",
      slot: dualRun.slotA,
      challengerSlot: dualRun.slotB,
      pass: dualRun.pass,
      calibrationDelta: dualRun.calibrationDelta,
      rule: dualRun.rule,
      constitutionalPhase: "CB-14",
    },
    { actor: "AIA-UNC-01" }
  );
}

/**
 * CB-17 — Update cycle (ST-MON → ST-UPD → ST-PERF)
 *
 * Re-perfeccionamiento infrastructure. Does not execute layer motors or loops —
 * records the constitutional cycle and transitions only.
 */

export const UPDATE_CYCLE_ACTOR = "LOOP-INT-FRS-01";

export const UPDATE_ELR_KINDS = Object.freeze({
  START: "WU_UPDATE_CYCLE_START",
  PERF_REOPEN: "WU_UPDATE_PERF_REOPEN",
  COMPLETE: "WU_UPDATE_CYCLE_COMPLETE",
});

/** Constitutional update path per FFO / CB-17 termination criteria. */
export const UPDATE_CYCLE_PATH = Object.freeze(["ST-MON", "ST-UPD", "ST-PERF"]);

/**
 * @param {string[]} path
 */
export function validateUpdateCyclePath(path = UPDATE_CYCLE_PATH) {
  const expected = UPDATE_CYCLE_PATH;
  const errors = [];
  if (path.length !== expected.length) {
    errors.push(`Update cycle path length must be ${expected.length}`);
  }
  for (let i = 0; i < expected.length; i++) {
    if (path[i] !== expected[i]) {
      errors.push(`Expected ${expected[i]} at index ${i}, got ${path[i]}`);
    }
  }
  return { valid: errors.length === 0, errors, path: expected };
}

/**
 * @param {import('../cb01/factoryRegistry.js').FactoryRegistry} registry
 * @param {string} factoryKey
 * @param {{ reason?: string, relevantLoops?: string[] }} [options]
 */
export function startUpdateCycle(registry, factoryKey, options = {}) {
  const record = registry.getExpediente(factoryKey);
  if (!record) {
    throw new Error(`[CB-17 Update] Expediente not found: ${factoryKey}`);
  }
  if (record.state !== "ST-MON") {
    throw new Error(`[CB-17 Update] Expected ST-MON to start update, got ${record.state}`);
  }

  const relevantLoops = options.relevantLoops ?? [
    "LOOP-INT-FRS-01",
    "LOOP-FND-FRS-01",
    "LOOP-DST-SUP-01",
  ];

  registry.registerElrAct(
    factoryKey,
    "loop_ledger_refs",
    {
      kind: UPDATE_ELR_KINDS.START,
      fromState: "ST-MON",
      toState: "ST-UPD",
      reason: options.reason ?? "ACT-V / SLA-driven update cycle",
      relevantLoops,
      executesMotors: false,
      constitutionalPhase: "CB-17",
    },
    { actor: UPDATE_CYCLE_ACTOR }
  );

  registry.transitionState(factoryKey, "ST-UPD", {
    actor: UPDATE_CYCLE_ACTOR,
    reason: "CB-17 Update cycle — ST-MON → ST-UPD",
  });

  return {
    factoryKey,
    state: "ST-UPD",
    relevantLoops,
    pathStep: "ST-UPD",
  };
}

/**
 * ST-UPD → ST-PERF re-perfeccionamiento marker (no motor execution).
 *
 * @param {import('../cb01/factoryRegistry.js').FactoryRegistry} registry
 * @param {string} factoryKey
 * @param {{ reason?: string }} [options]
 */
export function reopenPerfection(registry, factoryKey, options = {}) {
  const record = registry.getExpediente(factoryKey);
  if (!record) {
    throw new Error(`[CB-17 Update] Expediente not found: ${factoryKey}`);
  }
  if (record.state !== "ST-UPD") {
    throw new Error(`[CB-17 Update] Expected ST-UPD before ST-PERF, got ${record.state}`);
  }

  registry.registerElrAct(
    factoryKey,
    "loop_ledger_refs",
    {
      kind: UPDATE_ELR_KINDS.PERF_REOPEN,
      fromState: "ST-UPD",
      toState: "ST-PERF",
      reason: options.reason ?? "Re-perfeccionamiento loops relevantes (infrastructure)",
      executesMotors: false,
      constitutionalPhase: "CB-17",
    },
    { actor: UPDATE_CYCLE_ACTOR }
  );

  registry.transitionState(factoryKey, "ST-PERF", {
    actor: UPDATE_CYCLE_ACTOR,
    reason: "CB-17 Update cycle — ST-UPD → ST-PERF",
  });

  registry.registerElrAct(
    factoryKey,
    "loop_ledger_refs",
    {
      kind: UPDATE_ELR_KINDS.COMPLETE,
      path: UPDATE_CYCLE_PATH,
      state: "ST-PERF",
      constitutionalPhase: "CB-17",
    },
    { actor: UPDATE_CYCLE_ACTOR }
  );

  return {
    factoryKey,
    state: "ST-PERF",
    path: UPDATE_CYCLE_PATH,
    cycleComplete: true,
  };
}

/**
 * Full ST-MON → ST-UPD → ST-PERF cycle.
 *
 * @param {import('../cb01/factoryRegistry.js').FactoryRegistry} registry
 * @param {string} factoryKey
 * @param {object} [options]
 */
export function runUpdateCycle(registry, factoryKey, options = {}) {
  const pathCheck = validateUpdateCyclePath();
  if (!pathCheck.valid) {
    throw new Error(`[CB-17 Update] Invalid path definition: ${pathCheck.errors.join("; ")}`);
  }
  const started = startUpdateCycle(registry, factoryKey, options);
  const finished = reopenPerfection(registry, factoryKey, options);
  return {
    factoryKey,
    fromState: "ST-MON",
    state: finished.state,
    path: UPDATE_CYCLE_PATH,
    started,
    finished,
    cycleComplete: true,
  };
}

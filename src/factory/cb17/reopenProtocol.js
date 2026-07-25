/**
 * CB-17 — Reopen protocol REO-01
 *
 * ACT-V material reabre expediente sin borrar historial.
 * Does not wipe ELR sections; appends REO-01 act only.
 */

export const REOPEN_ACTOR = "LOOP-DST-SUP-01";
export const REO_01 = "REO-01";

export const REOPEN_ELR_KINDS = Object.freeze({
  ACT_V: "WU_REO01_ACT_V_MATERIAL",
  REOPEN: "WU_REO01_REOPEN",
  HISTORY_PRESERVED: "WU_REO01_HISTORY_PRESERVED",
});

/**
 * Snapshot ELR section lengths — fingerprint for history preservation.
 * @param {object} elr
 */
export function snapshotElrHistory(elr) {
  return {
    state_transitions: (elr?.state_transitions ?? []).length,
    motor_manifests: (elr?.motor_manifests ?? []).length,
    loop_ledger_refs: (elr?.loop_ledger_refs ?? []).length,
    swarm_mission_refs: (elr?.swarm_mission_refs ?? []).length,
    aia_rlg_refs: (elr?.aia_rlg_refs ?? []).length,
    conflict_resolutions: (elr?.conflict_resolutions ?? []).length,
    decision_handoffs: (elr?.decision_handoffs ?? []).length,
    factory_key_history: (elr?.factory_key_history ?? []).length,
  };
}

/**
 * History is preserved when every prior section count is >= before snapshot
 * (append-only; never wiped).
 * @param {ReturnType<snapshotElrHistory>} before
 * @param {ReturnType<snapshotElrHistory>} after
 */
export function assertHistoryPreserved(before, after) {
  const errors = [];
  for (const key of Object.keys(before)) {
    if ((after[key] ?? 0) < (before[key] ?? 0)) {
      errors.push(`ELR section ${key} shrank (${before[key]} → ${after[key]}) — REO-01 violated`);
    }
  }
  return { preserved: errors.length === 0, errors, before, after };
}

/**
 * Record ACT-V material event (stub signal — no live DSO).
 *
 * @param {import('../cb01/factoryRegistry.js').FactoryRegistry} registry
 * @param {string} factoryKey
 * @param {{ eventType?: string, detail?: object }} [event]
 */
export function recordActVMaterial(registry, factoryKey, event = {}) {
  return registry.registerElrAct(
    factoryKey,
    "loop_ledger_refs",
    {
      kind: REOPEN_ELR_KINDS.ACT_V,
      protocol: REO_01,
      eventType: event.eventType ?? "material_filing",
      detail: event.detail ?? { stub: true, note: "ACT-V synthetic — no live source" },
      constitutionalPhase: "CB-17",
    },
    { actor: REOPEN_ACTOR }
  );
}

/**
 * REO-01 reopen: preserve history, record protocol, optionally drive update from ST-MON.
 *
 * @param {import('../cb01/factoryRegistry.js').FactoryRegistry} registry
 * @param {string} factoryKey
 * @param {{
 *   eventType?: string,
 *   detail?: object,
 *   driveUpdateCycle?: boolean,
 *   runUpdateCycle?: Function,
 * }} [options]
 */
export function reopenExpediente(registry, factoryKey, options = {}) {
  const record = registry.getExpediente(factoryKey);
  if (!record) {
    throw new Error(`[CB-17 REO-01] Expediente not found: ${factoryKey}`);
  }

  const before = snapshotElrHistory(record.elr);
  recordActVMaterial(registry, factoryKey, {
    eventType: options.eventType,
    detail: options.detail,
  });

  registry.registerElrAct(
    factoryKey,
    "loop_ledger_refs",
    {
      kind: REOPEN_ELR_KINDS.REOPEN,
      protocol: REO_01,
      fromState: record.state,
      message: "REO-01 reopen — historial preservado (append-only)",
      historyBefore: before,
      constitutionalPhase: "CB-17",
    },
    { actor: REOPEN_ACTOR }
  );

  let updateResult = null;
  if (options.driveUpdateCycle === true) {
    if (record.state !== "ST-MON") {
      throw new Error(
        `[CB-17 REO-01] driveUpdateCycle requires ST-MON, got ${record.state}`
      );
    }
    if (typeof options.runUpdateCycle !== "function") {
      throw new Error("[CB-17 REO-01] runUpdateCycle function required when driveUpdateCycle=true");
    }
    updateResult = options.runUpdateCycle(registry, factoryKey, {
      reason: "REO-01 ACT-V material reopen",
    });
  }

  const afterRecord = registry.getExpediente(factoryKey);
  const after = snapshotElrHistory(afterRecord.elr);
  const preservation = assertHistoryPreserved(before, after);

  if (!preservation.preserved) {
    throw new Error(
      `[CB-17 REO-01] History wipe detected: ${preservation.errors.join("; ")}`
    );
  }

  registry.registerElrAct(
    factoryKey,
    "loop_ledger_refs",
    {
      kind: REOPEN_ELR_KINDS.HISTORY_PRESERVED,
      protocol: REO_01,
      before,
      after,
      preserved: true,
      constitutionalPhase: "CB-17",
    },
    { actor: REOPEN_ACTOR }
  );

  return {
    factoryKey,
    protocol: REO_01,
    fromState: record.state,
    state: afterRecord.state,
    history: preservation,
    updateResult,
    historyPreserved: true,
  };
}

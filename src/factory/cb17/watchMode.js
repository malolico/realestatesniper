/**
 * CB-17 — Watch mode (ST-MON)
 *
 * Post-Decision Factory watch: LOOP-FRS mínimo + MOT-CHR event watch.
 * Does not execute motors, IA, Decision, Projection, or Marketplace.
 */

export const WATCH_MODE_ACTOR = "LOOP-INT-FRS-01";
export const WATCH_EVENT_ACTOR = "MOT-CHR-01";

export const WATCH_ELR_KINDS = Object.freeze({
  ENTER: "WU_WATCH_MODE_ENTER",
  FRS_SCHEDULE: "WU_WATCH_FRS_SCHEDULE",
  CHR_SCHEDULE: "WU_WATCH_CHR_SCHEDULE",
  HEARTBEAT: "WU_WATCH_HEARTBEAT",
});

/**
 * Build watch schedule for ST-MON (FRS mínimo + CHR event watch).
 * @param {string} factoryKey
 * @param {{ frsLoops?: string[], chrMotors?: string[] }} [options]
 */
export function buildWatchSchedule(factoryKey, options = {}) {
  return {
    factoryKey,
    mode: "ST-MON",
    frsMinimal: Object.freeze(
      options.frsLoops ?? ["LOOP-INT-FRS-01", "LOOP-FND-FRS-01", "LOOP-ECO-FRS-01"]
    ),
    chrEventWatch: Object.freeze(options.chrMotors ?? ["MOT-CHR-01", "MOT-CHR-02"]),
    active: true,
    executesMotors: false,
    constitutionalPhase: "CB-17",
    rule: "FFO §III.9 / CB-17 Watch",
  };
}

/**
 * @param {import('../cb01/factoryRegistry.js').FactoryRegistry} registry
 * @param {string} factoryKey
 * @param {ReturnType<buildWatchSchedule>} schedule
 */
export function recordWatchModeEnter(registry, factoryKey, schedule) {
  return registry.registerElrAct(
    factoryKey,
    "loop_ledger_refs",
    {
      kind: WATCH_ELR_KINDS.ENTER,
      mode: "ST-MON",
      frsMinimal: schedule.frsMinimal,
      chrEventWatch: schedule.chrEventWatch,
      message: "Factory entered watch mode — post-Decision monitoring",
      constitutionalPhase: "CB-17",
    },
    { actor: WATCH_MODE_ACTOR }
  );
}

/**
 * @param {import('../cb01/factoryRegistry.js').FactoryRegistry} registry
 * @param {string} factoryKey
 * @param {ReturnType<buildWatchSchedule>} schedule
 */
export function recordWatchSchedules(registry, factoryKey, schedule) {
  registry.registerElrAct(
    factoryKey,
    "loop_ledger_refs",
    {
      kind: WATCH_ELR_KINDS.FRS_SCHEDULE,
      loops: schedule.frsMinimal,
      interval: "SLA_DSO",
      constitutionalPhase: "CB-17",
    },
    { actor: WATCH_MODE_ACTOR }
  );
  return registry.registerElrAct(
    factoryKey,
    "loop_ledger_refs",
    {
      kind: WATCH_ELR_KINDS.CHR_SCHEDULE,
      motors: schedule.chrEventWatch,
      watchOnly: true,
      constitutionalPhase: "CB-17",
    },
    { actor: WATCH_EVENT_ACTOR }
  );
}

/**
 * Enter ST-MON from ST-DEC (or allowed upstream). Infrastructure only.
 *
 * @param {import('../cb01/factoryRegistry.js').FactoryRegistry} registry
 * @param {string} factoryKey
 * @param {object} [options]
 */
export function enterWatchMode(registry, factoryKey, options = {}) {
  const record = registry.getExpediente(factoryKey);
  if (!record) {
    throw new Error(`[CB-17 Watch] Expediente not found: ${factoryKey}`);
  }
  if (record.state !== "ST-DEC" && record.state !== "ST-MON") {
    throw new Error(
      `[CB-17 Watch] Expected ST-DEC (or already ST-MON), got ${record.state}`
    );
  }

  const fromState = record.state;
  if (fromState === "ST-DEC") {
    registry.transitionState(factoryKey, "ST-MON", {
      actor: WATCH_MODE_ACTOR,
      reason: "CB-17 Watch mode — post-Decision Factory monitoring",
    });
  }

  const schedule = buildWatchSchedule(factoryKey, options);
  recordWatchModeEnter(registry, factoryKey, schedule);
  recordWatchSchedules(registry, factoryKey, schedule);

  return {
    factoryKey,
    fromState,
    state: "ST-MON",
    schedule,
    watchesActive: true,
  };
}

/**
 * @param {object} elr
 */
export function isWatchModeActive(elr) {
  return (elr?.loop_ledger_refs ?? []).some((r) => r.kind === WATCH_ELR_KINDS.ENTER);
}

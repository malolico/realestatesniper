/**
 * CB-15 — Anti-degradation scheduler (FRS, compliance watch, ACT-V)
 */

/**
 * @param {string} factoryKey
 * @param {{ complianceClearance?: string, frsSufficient?: boolean }} [context]
 */
export function scheduleAntiDegradationWatch(factoryKey, context = {}) {
  return {
    factoryKey,
    tasks: [
      {
        kind: "FRS_WATCH",
        actor: "LOOP-INT-FRS-01",
        interval: "SLA_DSO",
        active: true,
      },
      {
        kind: "COMPLIANCE_WATCH",
        actor: "LOOP-XVR-CMP-01",
        clearance: context.complianceClearance ?? "PASS",
        active: true,
      },
      {
        kind: "ACT_V_MATERIAL",
        actor: "LOOP-DST-SUP-01",
        scheduled: false,
        note: "ACT-V stub — no live source monitoring",
      },
    ],
    rule: "FFO §III.8",
  };
}

/**
 * @param {import('../cb01/factoryRegistry.js').FactoryRegistry} registry
 * @param {string} factoryKey
 * @param {ReturnType<scheduleAntiDegradationWatch>} schedule
 */
export function recordAntiDegradationSchedule(registry, factoryKey, schedule) {
  return registry.registerElrAct(
    factoryKey,
    "loop_ledger_refs",
    {
      kind: "FFO_ANTI_DEGRADATION_SCHEDULE",
      tasks: schedule.tasks,
      constitutionalPhase: "CB-15",
    },
    { actor: "LOOP-XVR-CMP-01" }
  );
}

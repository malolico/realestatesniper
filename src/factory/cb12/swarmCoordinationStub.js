/**
 * CB-12 — Swarm coordination stub (no real AI / no motor re-execution)
 * Orchestration-only: references authorized motors without usurping MOT runtime.
 */

import { getSwarmPattern } from "./swarmCatalog.js";

/**
 * @param {string} swmId
 * @param {object} swaIn
 * @param {{ evidenceRegistryRef?: string|null }} [context]
 */
export function coordinateSwarmMotors(swmId, swaIn, context = {}) {
  const pattern = getSwarmPattern(swmId);
  const motors = swaIn.authorizedMotors ?? pattern.motors;

  const motorDeltas = motors.map((motorId) => ({
    motorId,
    action: "COORDINATION_REF",
    reExecuted: false,
    note: "CB-12 stub — motor referenced, not re-invoked (LK-04 / no usurpation)",
  }));

  const evidenceUpdates = pattern.id === "SWM-EVD-01" || pattern.motors.includes("MOT-EVD-01")
    ? [
        {
          motorId: "MOT-EVD-01",
          registryRef: context.evidenceRegistryRef ?? `EVREG-${swaIn.factoryKey}`,
          action: "EVIDENCE_STATE_SNAPSHOT",
        },
      ]
    : [];

  const consensusScore = pattern.mode === "MOD-I" ? 0.82 : 0.78;
  const uncertaintyScore = pattern.mode === "MOD-P" ? 0.18 : 0.25;

  return {
    phase: "COORDINATE",
    swarmId: swaIn.swarmId,
    coordinationMode: pattern.mode,
    consensusScore,
    uncertaintyScore,
    convergenceReport: {
      summary: `Stub coordination for ${swmId} — ${pattern.prb}`,
      rounds: 1,
      motorsCoordinated: motors.length,
      aiExecution: false,
    },
    motorDeltas,
    evidenceUpdates,
    residualGaps: [],
    conflictsEscalated:
      pattern.id === "SWM-EVD-01"
        ? [{ target: "CB-06:MOT-EVD-02", reason: "multi-domain conflict stub" }]
        : [],
    recommendationLoop: "STR-1",
    budgetConsumed: 0.35,
    orchestrationOnly: true,
  };
}

/**
 * Guards against SWM usurping MOT / LOOP / Decision authority.
 *
 * @param {object} coordination
 */
export function assertNoUsurpation(coordination) {
  const violations = [];

  if (coordination.motorDeltas?.some((d) => d.reExecuted === true)) {
    violations.push("SWM re-executed motors — usurps MOT runtime");
  }
  if (coordination.emitsDecision === true) {
    violations.push("SWM emitted Decision — constitutional boundary violation");
  }
  if (coordination.persistsAsActor === true) {
    violations.push("SWM persists as actor after mission close");
  }
  if (coordination.loopLockOverride === true) {
    violations.push("SWM overrode loop lock — usurps LOOP");
  }

  return {
    valid: violations.length === 0,
    violations,
  };
}

/**
 * CB-12 — Swarm lifecycle: SWA-IN / coordination / SWA-OUT / DIE-* / loop return
 */

import { evaluateConvergenceState } from "./convergenceState.js";
import { getSwarmPattern } from "./swarmCatalog.js";

/** @typedef {"DIE-S"|"DIE-X"|"DIE-B"|"DIE-C"|"DIE-T"|"DIE-E"|"DIE-K"} DieCode */
/** @typedef {"SWA-IN"|"COORDINATE"|"SWA-OUT"|"DIE"|"RETURN_LOOP"} SwarmPhase */

export const DIE_CODES = Object.freeze([
  "DIE-S",
  "DIE-X",
  "DIE-B",
  "DIE-C",
  "DIE-T",
  "DIE-E",
  "DIE-K",
]);

export const SWARM_PHASES = Object.freeze([
  "SWA-IN",
  "COORDINATE",
  "SWA-OUT",
  "DIE",
  "RETURN_LOOP",
]);

/**
 * @param {string} factoryKey
 * @param {string} swmId
 * @param {object} mandate
 */
export function buildSwaIn(factoryKey, swmId, mandate) {
  const pattern = getSwarmPattern(swmId);
  const swarmId = mandate.swarmId ?? `SWARM-${factoryKey}-${swmId}-${Date.now()}`;

  return {
    phase: "SWA-IN",
    swarmId,
    swarmPattern: swmId,
    loopParent: mandate.loopParent ?? pattern.derivingLoop,
    factoryKey,
    objectiveEpistemic: mandate.objectiveEpistemic ?? pattern.prb,
    authorizedMotors: mandate.authorizedMotors ?? pattern.motors,
    authorizedCaps: mandate.authorizedCaps ?? pattern.primaryCaps,
    budgetSwarm: mandate.budgetSwarm ?? 1.0,
    strategiesExhausted: mandate.strategiesExhausted ?? ["STR-1", "STR-2", "STR-3", "STR-4", "STR-5", "STR-6"],
    evidenceState: mandate.evidenceState ?? null,
    derivationRef: mandate.derivationRef ?? null,
    receivedAt: new Date().toISOString(),
  };
}

/**
 * @param {object} swaIn
 * @param {object} coordination
 */
export function buildSwaOut(swaIn, coordination) {
  const pattern = getSwarmPattern(swaIn.swarmPattern);
  const convergence = evaluateConvergenceState(
    pattern,
    coordination.consensusScore,
    coordination.uncertaintyScore
  );

  return {
    phase: "SWA-OUT",
    swarmId: swaIn.swarmId,
    swarmPattern: swaIn.swarmPattern,
    loopParent: swaIn.loopParent,
    factoryKey: swaIn.factoryKey,
    consensusScore: convergence.consensusScore,
    uncertaintyScore: convergence.uncertaintyScore,
    csLevel: convergence.csLevel,
    usLevel: convergence.usLevel,
    convergenceReport: coordination.convergenceReport,
    motorDeltas: coordination.motorDeltas,
    evidenceUpdates: coordination.evidenceUpdates,
    residualGaps: coordination.residualGaps ?? [],
    conflictsEscalated: coordination.conflictsEscalated ?? [],
    recommendationLoop: coordination.recommendationLoop ?? "STR-1",
    budgetConsumed: coordination.budgetConsumed ?? 0.5,
    converged: convergence.converged,
    emittedAt: new Date().toISOString(),
  };
}

/**
 * @param {object} swaOut
 * @param {{ aborted?: boolean, timeout?: boolean, permanentBlocker?: boolean }} [options]
 * @returns {{ outcomeCode: DieCode, reason: string }}
 */
export function resolveDieOutcome(swaOut, options = {}) {
  if (options.aborted) {
    return { outcomeCode: "DIE-C", reason: "Loop parent abort" };
  }
  if (options.timeout) {
    return { outcomeCode: "DIE-T", reason: "Mission SLA exceeded" };
  }
  if (options.permanentBlocker) {
    return { outcomeCode: "DIE-K", reason: "Permanent blocker declared" };
  }
  if (swaOut.converged) {
    return { outcomeCode: "DIE-S", reason: "CS/US thresholds met" };
  }
  if (swaOut.csLevel === "CS-2" || swaOut.csLevel === "CS-1") {
    return { outcomeCode: "DIE-X", reason: "Convergence exhausted" };
  }
  return { outcomeCode: "DIE-B", reason: "Partial convergence — bounded handoff" };
}

/**
 * @param {object} swaOut
 * @param {DieCode} outcomeCode
 */
export function buildLoopReturn(swaOut, outcomeCode) {
  return {
    phase: "RETURN_LOOP",
    swarmId: swaOut.swarmId,
    loopParent: swaOut.loopParent,
    factoryKey: swaOut.factoryKey,
    outcomeCode,
    consensusScore: swaOut.consensusScore,
    uncertaintyScore: swaOut.uncertaintyScore,
    recommendationLoop: swaOut.recommendationLoop,
    swarmDissolved: true,
    returnedAt: new Date().toISOString(),
  };
}

/**
 * @param {object} swaIn
 */
export function validateSwaInMandate(swaIn) {
  const required = [
    "swarmPattern",
    "loopParent",
    "factoryKey",
    "objectiveEpistemic",
    "authorizedMotors",
    "authorizedCaps",
    "budgetSwarm",
    "strategiesExhausted",
  ];
  const missing = required.filter((field) => swaIn[field] == null);
  if (missing.length) {
    return { valid: false, reason: `SWA-IN-01: missing ${missing.join(", ")}` };
  }
  if (!swaIn.authorizedMotors?.length) {
    return { valid: false, reason: "SWA-IN-01: authorized_motors empty" };
  }
  return { valid: true };
}

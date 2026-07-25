/**
 * CB-19 — E2E Factory Validation
 *
 * Pilot path: NASC → RDY → DEC handoff → MON → ARC (Blueprint).
 * Consumes CB-15 / CB-16 / CB-17 — does not modify them.
 */

import { detectCanonDrift } from "../cb18/canonDriftDetector.js";

/** Constitutional E2E state path (Factory construction closure). */
export const E2E_FACTORY_PATH = Object.freeze([
  "ST-NASC",
  "ST-RDY",
  "ST-DEC",
  "ST-MON",
  "ST-ARC",
]);

/**
 * @param {object} record — expediente after E2E run
 * @param {{
 *   observedPath?: string[],
 *   handoffDelivered?: boolean,
 *   watchEntered?: boolean,
 *   archived?: boolean,
 * }} evidence
 */
export function evaluateE2ePilot(record, evidence = {}) {
  const errors = [];
  const observed = evidence.observedPath ?? [];

  for (const state of E2E_FACTORY_PATH) {
    if (!observed.includes(state)) {
      errors.push(`E2E path missing state: ${state}`);
    }
  }

  if (record?.state !== "ST-ARC" && record?.state !== "ST-RET") {
    errors.push(`E2E terminal state expected ST-ARC (or ST-RET), got ${record?.state}`);
  }

  if (evidence.handoffDelivered !== true) {
    errors.push("CB-16 Decision handoff not delivered");
  }
  if (evidence.watchEntered !== true) {
    errors.push("CB-17 Watch mode not entered");
  }
  if (evidence.archived !== true) {
    errors.push("CB-17 Archive not completed");
  }

  const drift = detectCanonDrift(record ?? { elr: {} });
  if (drift.blockDeployment) {
    errors.push(
      `Constitutional violation — canon drift: ${drift.drifted.map((d) => d.actor).join(", ")}`
    );
  }

  const transitions = record?.elr?.state_transitions ?? [];
  if (transitions.length === 0) {
    errors.push("No state_transitions in ELR — E2E incomplete");
  }

  return {
    path: E2E_FACTORY_PATH,
    observedPath: observed,
    factory_key: record?.factory_key ?? null,
    finalState: record?.state ?? null,
    constitutionalViolation: drift.blockDeployment,
    canonDrift: drift,
    passed: errors.length === 0,
    errors,
  };
}

/**
 * Derive observed milestone path from ELR transitions + known endpoints.
 * @param {object} record
 * @param {{ reachedRdy?: boolean, reachedDec?: boolean, reachedMon?: boolean, reachedArc?: boolean }} flags
 */
export function buildObservedE2ePath(record, flags = {}) {
  const path = ["ST-NASC"];
  const transitions = record?.elr?.state_transitions ?? [];
  const seen = new Set(transitions.flatMap((t) => [t.from, t.to]));

  if (flags.reachedRdy || seen.has("ST-RDY") || record?.state === "ST-RDY") path.push("ST-RDY");
  if (flags.reachedDec || seen.has("ST-DEC") || record?.state === "ST-DEC") path.push("ST-DEC");
  if (flags.reachedMon || seen.has("ST-MON") || record?.state === "ST-MON") path.push("ST-MON");
  if (flags.reachedArc || seen.has("ST-ARC") || record?.state === "ST-ARC") path.push("ST-ARC");

  return path;
}

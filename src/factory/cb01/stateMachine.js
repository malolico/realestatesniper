/**
 * CB-01 — Constitutional expediente state machine (FFO §II.3)
 */

import { isValidExpedienteState } from "../cb00/operationalVocabulary.js";

/** @type {Readonly<Record<string, readonly string[]>>} */
export const ALLOWED_TRANSITIONS = Object.freeze({
  "ST-NASC": ["ST-IDN", "ST-ARC"],
  "ST-IDN": ["ST-PROD", "ST-ARC"],
  "ST-PROD": ["ST-EVD", "ST-ARC"],
  "ST-EVD": ["ST-PERF", "ST-ARC"],
  "ST-PERF": ["ST-CONV", "ST-CONS", "ST-ARC"],
  "ST-CONV": ["ST-PERF", "ST-CONS", "ST-ARC"],
  "ST-CONS": ["ST-RDY", "ST-ARC"],
  "ST-RDY": ["ST-DEC", "ST-ARC"],
  "ST-DEC": ["ST-MON", "ST-PRJ", "ST-ARC"],
  "ST-PRJ": ["ST-CAT", "ST-MON", "ST-ARC"],
  "ST-CAT": ["ST-MKT", "ST-MON", "ST-ARC"],
  "ST-MKT": ["ST-MON", "ST-ARC"],
  "ST-MON": ["ST-UPD", "ST-ARC"],
  "ST-UPD": ["ST-PERF", "ST-ARC"],
  "ST-ARC": ["ST-RET"],
  "ST-RET": [],
});

/**
 * @param {string} fromState
 * @param {string} toState
 */
export function canTransition(fromState, toState) {
  if (!isValidExpedienteState(fromState) || !isValidExpedienteState(toState)) {
    return false;
  }
  const allowed = ALLOWED_TRANSITIONS[fromState];
  return allowed?.includes(toState) ?? false;
}

/**
 * @param {string} fromState
 * @param {string} toState
 */
export function assertTransitionAllowed(fromState, toState) {
  if (!canTransition(fromState, toState)) {
    throw new Error(
      `[CB-01 StateMachine] Transition not allowed: ${fromState} → ${toState}`
    );
  }
}

export const INITIAL_EXPEDIENTE_STATE = "ST-NASC";

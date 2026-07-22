/**
 * CB-15 — State orchestrator (FFO §II.3 ST-* governance)
 */

import { EXPEDIENTE_STATES } from "../cb00/operationalVocabulary.js";
import {
  ALLOWED_TRANSITIONS,
  canTransition,
} from "../cb01/stateMachine.js";
import { assertFactoryBoundary } from "./factoryBoundaryGuard.js";

export const ST_STATE_COUNT = EXPEDIENTE_STATES.length;

/**
 * @param {string} fromState
 * @param {string} toState
 * @param {{ allowNonFactoryState?: boolean }} [options]
 */
export function orchestrateStateTransition(fromState, toState, options = {}) {
  assertFactoryBoundary("state_transition", {
    toState,
    allowNonFactoryState: options.allowNonFactoryState,
  });

  if (!canTransition(fromState, toState)) {
    return {
      allowed: false,
      from: fromState,
      to: toState,
      reason: `Transition not allowed: ${fromState} → ${toState}`,
    };
  }

  return { allowed: true, from: fromState, to: toState };
}

/**
 * Verify all 16 ST-* states are registered and have transition rules.
 */
export function validateSixteenStateMachine() {
  const errors = [];
  for (const state of EXPEDIENTE_STATES) {
    if (!ALLOWED_TRANSITIONS[state.code] && state.code !== "ST-RET") {
      errors.push(`Missing transitions for ${state.code}`);
    }
  }
  if (EXPEDIENTE_STATES.length !== 16) {
    errors.push(`Expected 16 ST states, got ${EXPEDIENTE_STATES.length}`);
  }
  return { valid: errors.length === 0, errors, stateCount: EXPEDIENTE_STATES.length };
}

/**
 * Factory path ST-NASC → ST-RDY (pilot expediente lifecycle).
 */
export const FACTORY_LIFECYCLE_PATH = Object.freeze([
  "ST-NASC",
  "ST-IDN",
  "ST-PROD",
  "ST-EVD",
  "ST-PERF",
  "ST-CONS",
  "ST-RDY",
]);

/**
 * @param {string[]} path
 */
export function validateTransitionPath(path) {
  const errors = [];
  for (let i = 0; i < path.length - 1; i++) {
    const result = orchestrateStateTransition(path[i], path[i + 1]);
    if (!result.allowed) errors.push(result.reason);
  }
  return { valid: errors.length === 0, errors };
}

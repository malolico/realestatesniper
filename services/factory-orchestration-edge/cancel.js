/**
 * P-INT-01 Slice B1 — Cancel contract (Plan §5.8).
 */

import { FACTORY_ORCHESTRATION_ERROR_CODES, FACTORY_ORCHESTRATION_HTTP_STATUS } from "./contract.js";
import { JOB_STATES, isJobState } from "./jobModel.js";

/**
 * Evaluate cancel against current job state (no side effects).
 * @param {string} state
 * @param {boolean} [alreadyCancelRequested]
 * @returns {{
 *   ok: boolean,
 *   httpStatus?: number,
 *   nextState?: string,
 *   setCancelRequested?: boolean,
 *   code?: string,
 *   message?: string,
 *   idempotent?: boolean
 * }}
 */
export function evaluateCancelTransition(state, alreadyCancelRequested = false) {
  if (!isJobState(state)) {
    return {
      ok: false,
      httpStatus: FACTORY_ORCHESTRATION_HTTP_STATUS.BAD_REQUEST,
      code: FACTORY_ORCHESTRATION_ERROR_CODES.VALIDATION_FAIL,
      message: "invalid job state",
    };
  }

  if (state === JOB_STATES.QUEUED) {
    return {
      ok: true,
      httpStatus: FACTORY_ORCHESTRATION_HTTP_STATUS.OK,
      nextState: JOB_STATES.CANCELLED,
      setCancelRequested: false,
      idempotent: false,
    };
  }

  if (state === JOB_STATES.RUNNING) {
    return {
      ok: true,
      httpStatus: FACTORY_ORCHESTRATION_HTTP_STATUS.OK,
      nextState: JOB_STATES.CANCELLED,
      setCancelRequested: true,
      message: "cancelRequested; worker MUST checkpoint and MUST NOT SUCCEEDED",
      idempotent: false,
    };
  }

  if (state === JOB_STATES.CANCELLED) {
    return {
      ok: true,
      httpStatus: FACTORY_ORCHESTRATION_HTTP_STATUS.OK,
      nextState: JOB_STATES.CANCELLED,
      setCancelRequested: alreadyCancelRequested,
      idempotent: true,
    };
  }

  if (
    state === JOB_STATES.SUCCEEDED ||
    state === JOB_STATES.FAILED ||
    state === JOB_STATES.REJECTED
  ) {
    return {
      ok: false,
      httpStatus: FACTORY_ORCHESTRATION_HTTP_STATUS.CONFLICT,
      code: FACTORY_ORCHESTRATION_ERROR_CODES.CONFLICT,
      message: `cannot cancel job in terminal state ${state}`,
    };
  }

  return {
    ok: false,
    httpStatus: FACTORY_ORCHESTRATION_HTTP_STATUS.INTERNAL,
    code: FACTORY_ORCHESTRATION_ERROR_CODES.INTERNAL_ERROR,
    message: "unhandled cancel state",
  };
}

export const CANCEL_CONTRACT = Object.freeze({
  pathTemplate: "/v1/factory/orchestration/jobs/{jobId}/cancel",
  capability: "factory.command.orchestrate",
  queuedOutcome: JOB_STATES.CANCELLED,
  runningSetsCancelRequested: true,
  runningFinalState: JOB_STATES.CANCELLED,
  alreadyCancelledHttpStatus: FACTORY_ORCHESTRATION_HTTP_STATUS.OK,
  terminalConflictHttpStatus: FACTORY_ORCHESTRATION_HTTP_STATUS.CONFLICT,
  forbidSilentSucceeded: true,
});

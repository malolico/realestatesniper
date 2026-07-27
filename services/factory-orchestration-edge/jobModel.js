/**
 * P-INT-01 Slice B1 — Job schema, states, and transition rules (contracts only).
 */

export const JOB_TYPE = Object.freeze({
  ORCHESTRATE_EXPEDIENTE: "ORCHESTRATE_EXPEDIENTE",
});

export const JOB_STATES = Object.freeze({
  QUEUED: "QUEUED",
  RUNNING: "RUNNING",
  SUCCEEDED: "SUCCEEDED",
  FAILED: "FAILED",
  REJECTED: "REJECTED",
  CANCELLED: "CANCELLED",
});

export const JOB_STATE_VALUES = Object.freeze(Object.values(JOB_STATES));

/** Terminal states — no further worker execution. */
export const JOB_TERMINAL_STATES = Object.freeze([
  JOB_STATES.SUCCEEDED,
  JOB_STATES.FAILED,
  JOB_STATES.REJECTED,
  JOB_STATES.CANCELLED,
]);

/**
 * Allowed state transitions for the job lifecycle (contract matrix).
 * Cancel-specific rules live in cancel.js.
 */
export const JOB_STATE_TRANSITIONS = Object.freeze({
  [JOB_STATES.QUEUED]: Object.freeze([JOB_STATES.RUNNING, JOB_STATES.CANCELLED, JOB_STATES.REJECTED]),
  [JOB_STATES.RUNNING]: Object.freeze([
    JOB_STATES.SUCCEEDED,
    JOB_STATES.FAILED,
    JOB_STATES.REJECTED,
    JOB_STATES.CANCELLED,
  ]),
  [JOB_STATES.SUCCEEDED]: Object.freeze([]),
  [JOB_STATES.FAILED]: Object.freeze([]),
  [JOB_STATES.REJECTED]: Object.freeze([]),
  [JOB_STATES.CANCELLED]: Object.freeze([]),
});

/** Required fields on a persisted job record (shape contract). */
export const JOB_REQUIRED_FIELDS = Object.freeze([
  "jobId",
  "type",
  "factoryKey",
  "state",
  "cancelRequested",
  "createdAt",
  "updatedAt",
  "idempotencyKey",
]);

/**
 * @param {string} state
 */
export function isJobState(state) {
  return JOB_STATE_VALUES.includes(state);
}

/**
 * @param {string} state
 */
export function isTerminalJobState(state) {
  return JOB_TERMINAL_STATES.includes(state);
}

/**
 * @param {string} from
 * @param {string} to
 */
export function canTransitionJobState(from, to) {
  if (!isJobState(from) || !isJobState(to)) return false;
  const allowed = JOB_STATE_TRANSITIONS[from] || [];
  return allowed.includes(to);
}

/**
 * Validate job record shape (no persistence).
 * @param {object} job
 * @returns {{ ok: true } | { ok: false, code: string, message: string }}
 */
export function validateJobRecordShape(job) {
  if (!job || typeof job !== "object" || Array.isArray(job)) {
    return { ok: false, code: "VALIDATION_FAIL", message: "job must be an object" };
  }
  for (const field of JOB_REQUIRED_FIELDS) {
    if (!(field in job)) {
      return { ok: false, code: "VALIDATION_FAIL", message: `missing field: ${field}` };
    }
  }
  if (typeof job.jobId !== "string" || job.jobId.length === 0) {
    return { ok: false, code: "VALIDATION_FAIL", message: "jobId must be non-empty string" };
  }
  if (job.type !== JOB_TYPE.ORCHESTRATE_EXPEDIENTE) {
    return { ok: false, code: "VALIDATION_FAIL", message: "invalid job type" };
  }
  if (typeof job.factoryKey !== "string" || job.factoryKey.length === 0) {
    return { ok: false, code: "VALIDATION_FAIL", message: "factoryKey must be non-empty string" };
  }
  if (!isJobState(job.state)) {
    return { ok: false, code: "VALIDATION_FAIL", message: "invalid job state" };
  }
  if (typeof job.cancelRequested !== "boolean") {
    return { ok: false, code: "VALIDATION_FAIL", message: "cancelRequested must be boolean" };
  }
  if (typeof job.createdAt !== "string" || typeof job.updatedAt !== "string") {
    return { ok: false, code: "VALIDATION_FAIL", message: "timestamps must be RFC3339 strings" };
  }
  if (typeof job.idempotencyKey !== "string" || job.idempotencyKey.length === 0) {
    return { ok: false, code: "VALIDATION_FAIL", message: "idempotencyKey must be non-empty string" };
  }
  if (job.error != null) {
    if (typeof job.error !== "object" || Array.isArray(job.error)) {
      return { ok: false, code: "VALIDATION_FAIL", message: "error must be object when present" };
    }
  }
  if (job.resultSummary != null) {
    if (typeof job.resultSummary !== "object" || Array.isArray(job.resultSummary)) {
      return { ok: false, code: "VALIDATION_FAIL", message: "resultSummary must be object when present" };
    }
  }
  return { ok: true };
}

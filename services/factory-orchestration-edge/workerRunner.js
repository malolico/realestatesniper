/**
 * P-INT-01 Slice B2 — Job Runner Core (async, off-request).
 * No HTTP. No Slice A imports. CB-15: boundary public API only (no orchestrate yet).
 */

import { FACTORY_ORCHESTRATION_COMMANDS, FACTORY_ORCHESTRATION_ERROR_CODES } from "./contract.js";
import { JOB_STATES, isTerminalJobState } from "./jobModel.js";
import { enforceFactoryBoundary } from "./boundaryAdapter.js";
import { sanitizeJobError } from "./sanitize.js";
import { sanitizeResultSummary } from "./validation.js";
import { runStubOrchestration } from "./stubExecutor.js";
import { validateOrchestrateSubmitBody } from "./validation.js";

function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export class JobRunnerCore {
  /**
   * @param {object} store InMemoryJobStore | FileJobStore
   * @param {object} [options]
   * @param {number} [options.executionTimeoutMs]
   * @param {(job: object, hooks: object) => Promise<object>} [options.executor]
   */
  constructor(store, options = {}) {
    this.store = store;
    this.executionTimeoutMs = options.executionTimeoutMs ?? 5_000;
    this.executor = options.executor || runStubOrchestration;
    /** @type {Set<string>} */
    this._inflight = new Set();
  }

  /**
   * Enqueue with B1 submit validation + at-most-once idempotency.
   * @param {{ factoryKey: string, command?: string, hints?: object, idempotencyKey?: string }} body
   * @param {string} idempotencyHeader
   * @param {string} [actorId]
   */
  enqueue(body, idempotencyHeader, actorId = "anonymous") {
    const validated = validateOrchestrateSubmitBody(body, idempotencyHeader);
    if (!validated.ok) {
      const err = new Error(validated.message);
      err.code = validated.code;
      throw err;
    }
    return this.store.enqueueOrchestrate({
      factoryKey: validated.value.factoryKey,
      idempotencyKey: validated.value.idempotencyKey,
      actorId,
    });
  }

  requestCancel(jobId) {
    return this.store.requestCancel(jobId);
  }

  read(jobId) {
    return this.store.read(jobId);
  }

  /**
   * Claim + execute one job asynchronously (caller awaits; not Web-request bound).
   */
  async processJob(jobId) {
    if (this._inflight.has(jobId)) {
      const err = new Error("job already executing");
      err.code = FACTORY_ORCHESTRATION_ERROR_CODES.CONFLICT;
      throw err;
    }

    let claimed;
    try {
      claimed = this.store.claim(jobId);
    } catch (error) {
      throw error;
    }

    this._inflight.add(jobId);
    try {
      return await this._executeClaimed(claimed);
    } finally {
      this._inflight.delete(jobId);
    }
  }

  /**
   * Process next QUEUED job if any.
   */
  async processNextQueued() {
    const ids = this.store.listJobIds();
    for (const id of ids) {
      const job = this.store.read(id);
      if (job && job.state === JOB_STATES.QUEUED) {
        return this.processJob(id);
      }
    }
    return null;
  }

  async _executeClaimed(claimed) {
    const jobId = claimed.jobId;
    const abort = { timedOut: false };

    const boundary = enforceFactoryBoundary(
      FACTORY_ORCHESTRATION_COMMANDS.ORCHESTRATE_EXPEDIENTE,
      { factoryKey: claimed.factoryKey }
    );
    if (!boundary.ok) {
      return this.store.markRejected(jobId, {
        code: boundary.code,
        message: boundary.message,
      });
    }

    if (claimed.forceBlockedOperation) {
      const blocked = enforceFactoryBoundary(claimed.forceBlockedOperation);
      if (!blocked.ok) {
        return this.store.markRejected(jobId, {
          code: blocked.code,
          message: blocked.message,
        });
      }
    }

    const runExecution = async () => {
      const hooks = {
        checkpoint: async (label) => {
          if (abort.timedOut) {
            const err = new Error("execution timeout");
            err.code = "TIMEOUT";
            throw err;
          }
          const result = this.store.checkpoint(jobId, label);
          return result;
        },
        isCancelRequested: () => {
          const current = this.store.read(jobId);
          return Boolean(current && current.cancelRequested);
        },
        sleep: async (ms) => {
          if (abort.timedOut) {
            const err = new Error("execution timeout");
            err.code = "TIMEOUT";
            throw err;
          }
          await delay(ms);
          if (abort.timedOut) {
            const err = new Error("execution timeout");
            err.code = "TIMEOUT";
            throw err;
          }
        },
      };
      return this.executor(claimed, hooks);
    };

    try {
      const outcome = await Promise.race([
        runExecution(),
        delay(this.executionTimeoutMs).then(() => {
          abort.timedOut = true;
          const err = new Error("execution timeout");
          err.code = "TIMEOUT";
          throw err;
        }),
      ]);

      const current = this.store.read(jobId);
      if (!current) {
        const err = new Error("job disappeared");
        err.code = FACTORY_ORCHESTRATION_ERROR_CODES.NOT_FOUND;
        throw err;
      }

      if (current.state === JOB_STATES.CANCELLED) {
        return current;
      }

      if (abort.timedOut) {
        return this.store.markFailed(jobId, sanitizeJobError({ code: "TIMEOUT", message: "execution timeout" }));
      }

      if (outcome && outcome.cancelled) {
        const cp = this.store.checkpoint(jobId, "cancel-finalize");
        return cp.job;
      }

      if (current.cancelRequested) {
        const cp = this.store.checkpoint(jobId, "cancel-before-success");
        return cp.job;
      }

      return this.store.markSucceeded(
        jobId,
        sanitizeResultSummary(outcome.resultSummary || {})
      );
    } catch (error) {
      const current = this.store.read(jobId);
      if (current && current.state === JOB_STATES.CANCELLED) {
        return current;
      }
      if (current && isTerminalJobState(current.state)) {
        return current;
      }
      const sanitized = sanitizeJobError(error);
      return this.store.markFailed(jobId, sanitized);
    }
  }
}

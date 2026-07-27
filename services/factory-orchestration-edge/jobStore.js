/**
 * P-INT-01 Slice B2 — Staging Job Store (memory | file-local).
 */

import fs from "node:fs";
import path from "node:path";
import { randomUUID } from "node:crypto";
import {
  FACTORY_ORCHESTRATION_COMMANDS,
  FACTORY_ORCHESTRATION_ERROR_CODES,
  FACTORY_ORCHESTRATION_HTTP_STATUS,
} from "./contract.js";
import {
  JOB_REQUIRED_FIELDS,
  JOB_STATES,
  JOB_TYPE,
  canTransitionJobState,
  isTerminalJobState,
  validateJobRecordShape,
} from "./jobModel.js";
import { buildIdempotencyIdentity, validateIdempotencyKey } from "./idempotency.js";
import { assertRfc3339, toRfc3339 } from "./rfc3339.js";
import { sanitizeResultSummary } from "./validation.js";

function cloneJob(job) {
  return structuredClone(job);
}

function assertTransition(from, to) {
  if (!canTransitionJobState(from, to)) {
    const err = new Error(`illegal transition ${from} -> ${to}`);
    err.code = FACTORY_ORCHESTRATION_ERROR_CODES.CONFLICT;
    throw err;
  }
}

function buildNewJob({ factoryKey, idempotencyKey, actorId, now }) {
  assertRfc3339(now, "createdAt");
  const job = {
    jobId: randomUUID(),
    type: JOB_TYPE.ORCHESTRATE_EXPEDIENTE,
    factoryKey,
    state: JOB_STATES.QUEUED,
    cancelRequested: false,
    createdAt: now,
    updatedAt: now,
    idempotencyKey,
    actorId: actorId || "anonymous",
    command: FACTORY_ORCHESTRATION_COMMANDS.ORCHESTRATE_EXPEDIENTE,
    error: null,
    resultSummary: null,
    claimToken: null,
  };
  const shape = validateJobRecordShape(job);
  if (!shape.ok) {
    const err = new Error(shape.message);
    err.code = shape.code;
    throw err;
  }
  return job;
}

function idempotencyRecordKey(identity) {
  return [
    identity.actorId,
    identity.factoryKey,
    identity.command,
    identity.idempotencyKey,
  ].join("\u0001");
}

export class InMemoryJobStore {
  constructor(clock = () => toRfc3339()) {
    this._clock = clock;
    /** @type {Map<string, object>} */
    this._jobs = new Map();
    /** @type {Map<string, string>} */
    this._idempotency = new Map();
  }

  create(job) {
    const shape = validateJobRecordShape(job);
    if (!shape.ok) {
      const err = new Error(shape.message);
      err.code = shape.code;
      throw err;
    }
    assertRfc3339(job.createdAt, "createdAt");
    assertRfc3339(job.updatedAt, "updatedAt");
    if (this._jobs.has(job.jobId)) {
      const err = new Error("jobId already exists");
      err.code = FACTORY_ORCHESTRATION_ERROR_CODES.CONFLICT;
      throw err;
    }
    this._jobs.set(job.jobId, cloneJob(job));
    return cloneJob(job);
  }

  read(jobId) {
    const job = this._jobs.get(jobId);
    return job ? cloneJob(job) : null;
  }

  update(jobId, mutator) {
    const current = this._jobs.get(jobId);
    if (!current) {
      const err = new Error("job not found");
      err.code = FACTORY_ORCHESTRATION_ERROR_CODES.NOT_FOUND;
      throw err;
    }
    const draft = cloneJob(current);
    const next = mutator(draft) || draft;
    assertRfc3339(next.updatedAt, "updatedAt");
    assertRfc3339(next.createdAt, "createdAt");
    const shape = validateJobRecordShape(next);
    if (!shape.ok) {
      const err = new Error(shape.message);
      err.code = shape.code;
      throw err;
    }
    this._jobs.set(jobId, cloneJob(next));
    return cloneJob(next);
  }

  findByIdempotency(identity) {
    const key = idempotencyRecordKey(identity);
    const jobId = this._idempotency.get(key);
    return jobId ? this.read(jobId) : null;
  }

  /**
   * At-most-once enqueue.
   */
  enqueueOrchestrate({ factoryKey, idempotencyKey, actorId }) {
    const idemp = validateIdempotencyKey(idempotencyKey);
    if (!idemp.ok) {
      const err = new Error(idemp.message);
      err.code = idemp.code;
      throw err;
    }
    const identity = buildIdempotencyIdentity({
      actorId: actorId || "anonymous",
      factoryKey,
      command: FACTORY_ORCHESTRATION_COMMANDS.ORCHESTRATE_EXPEDIENTE,
      idempotencyKey: idemp.key,
    });
    const existing = this.findByIdempotency(identity);
    if (existing) {
      return { job: existing, created: false };
    }
    const now = this._clock();
    const job = buildNewJob({
      factoryKey,
      idempotencyKey: idemp.key,
      actorId: identity.actorId,
      now,
    });
    this.create(job);
    this._idempotency.set(idempotencyRecordKey(identity), job.jobId);
    return { job: this.read(job.jobId), created: true };
  }

  /**
   * Atomic claim: QUEUED → RUNNING. Double claim forbidden.
   */
  claim(jobId) {
    const job = this._jobs.get(jobId);
    if (!job) {
      const err = new Error("job not found");
      err.code = FACTORY_ORCHESTRATION_ERROR_CODES.NOT_FOUND;
      throw err;
    }
    if (isTerminalJobState(job.state)) {
      const err = new Error("terminal job cannot be claimed");
      err.code = FACTORY_ORCHESTRATION_ERROR_CODES.CONFLICT;
      throw err;
    }
    if (job.state !== JOB_STATES.QUEUED) {
      const err = new Error("job is not claimable (not QUEUED)");
      err.code = FACTORY_ORCHESTRATION_ERROR_CODES.CONFLICT;
      throw err;
    }
    assertTransition(job.state, JOB_STATES.RUNNING);
    const now = this._clock();
    assertRfc3339(now, "updatedAt");
    const claimToken = randomUUID();
    job.state = JOB_STATES.RUNNING;
    job.claimToken = claimToken;
    job.updatedAt = now;
    this._jobs.set(jobId, cloneJob(job));
    return cloneJob(job);
  }

  /**
   * Cancel request — OBS-B1-01: RUNNING only sets cancelRequested.
   */
  requestCancel(jobId) {
    const job = this._jobs.get(jobId);
    if (!job) {
      return {
        ok: false,
        httpStatus: FACTORY_ORCHESTRATION_HTTP_STATUS.NOT_FOUND,
        code: FACTORY_ORCHESTRATION_ERROR_CODES.NOT_FOUND,
        message: "job not found",
      };
    }

    if (job.state === JOB_STATES.QUEUED) {
      assertTransition(job.state, JOB_STATES.CANCELLED);
      const now = this._clock();
      job.state = JOB_STATES.CANCELLED;
      job.cancelRequested = false;
      job.updatedAt = now;
      this._jobs.set(jobId, cloneJob(job));
      return {
        ok: true,
        httpStatus: FACTORY_ORCHESTRATION_HTTP_STATUS.OK,
        job: cloneJob(job),
        idempotent: false,
      };
    }

    if (job.state === JOB_STATES.RUNNING) {
      const now = this._clock();
      job.cancelRequested = true;
      // state remains RUNNING until worker checkpoint
      job.updatedAt = now;
      this._jobs.set(jobId, cloneJob(job));
      return {
        ok: true,
        httpStatus: FACTORY_ORCHESTRATION_HTTP_STATUS.OK,
        job: cloneJob(job),
        cancelRequested: true,
        pendingCheckpoint: true,
        idempotent: false,
      };
    }

    if (job.state === JOB_STATES.CANCELLED) {
      return {
        ok: true,
        httpStatus: FACTORY_ORCHESTRATION_HTTP_STATUS.OK,
        job: cloneJob(job),
        idempotent: true,
      };
    }

    return {
      ok: false,
      httpStatus: FACTORY_ORCHESTRATION_HTTP_STATUS.CONFLICT,
      code: FACTORY_ORCHESTRATION_ERROR_CODES.CONFLICT,
      message: `cannot cancel job in terminal state ${job.state}`,
      job: cloneJob(job),
    };
  }

  /**
   * Worker checkpoint: if cancelRequested on RUNNING → CANCELLED.
   */
  checkpoint(jobId, label = "checkpoint") {
    const job = this._jobs.get(jobId);
    if (!job) {
      const err = new Error("job not found");
      err.code = FACTORY_ORCHESTRATION_ERROR_CODES.NOT_FOUND;
      throw err;
    }
    if (job.state === JOB_STATES.RUNNING && job.cancelRequested === true) {
      assertTransition(job.state, JOB_STATES.CANCELLED);
      const now = this._clock();
      job.state = JOB_STATES.CANCELLED;
      job.updatedAt = now;
      job.lastCheckpoint = label;
      this._jobs.set(jobId, cloneJob(job));
      return { cancelled: true, job: cloneJob(job) };
    }
    const now = this._clock();
    job.updatedAt = now;
    job.lastCheckpoint = label;
    this._jobs.set(jobId, cloneJob(job));
    return { cancelled: false, job: cloneJob(job) };
  }

  markSucceeded(jobId, resultSummary) {
    return this.update(jobId, (job) => {
      if (job.state !== JOB_STATES.RUNNING) {
        const err = new Error("only RUNNING jobs can succeed");
        err.code = FACTORY_ORCHESTRATION_ERROR_CODES.CONFLICT;
        throw err;
      }
      if (job.cancelRequested) {
        const err = new Error("cancelRequested — MUST NOT SUCCEEDED");
        err.code = FACTORY_ORCHESTRATION_ERROR_CODES.CONFLICT;
        throw err;
      }
      assertTransition(job.state, JOB_STATES.SUCCEEDED);
      job.state = JOB_STATES.SUCCEEDED;
      job.resultSummary = sanitizeResultSummary(resultSummary || {});
      job.updatedAt = this._clock();
      job.claimToken = null;
      return job;
    });
  }

  markFailed(jobId, error) {
    return this.update(jobId, (job) => {
      if (isTerminalJobState(job.state)) {
        const err = new Error("job already terminal");
        err.code = FACTORY_ORCHESTRATION_ERROR_CODES.CONFLICT;
        throw err;
      }
      if (job.state !== JOB_STATES.RUNNING && job.state !== JOB_STATES.QUEUED) {
        const err = new Error("illegal fail transition");
        err.code = FACTORY_ORCHESTRATION_ERROR_CODES.CONFLICT;
        throw err;
      }
      assertTransition(job.state, JOB_STATES.FAILED);
      job.state = JOB_STATES.FAILED;
      job.error = error;
      job.updatedAt = this._clock();
      job.claimToken = null;
      return job;
    });
  }

  markRejected(jobId, error) {
    return this.update(jobId, (job) => {
      if (isTerminalJobState(job.state)) {
        const err = new Error("job already terminal");
        err.code = FACTORY_ORCHESTRATION_ERROR_CODES.CONFLICT;
        throw err;
      }
      assertTransition(job.state, JOB_STATES.REJECTED);
      job.state = JOB_STATES.REJECTED;
      job.error = error;
      job.updatedAt = this._clock();
      job.claimToken = null;
      return job;
    });
  }

  listJobIds() {
    return [...this._jobs.keys()];
  }
}

/**
 * File-local staging store — one JSON file per job + idempotency index.
 */
export class FileJobStore {
  /**
   * @param {string} rootDir
   * @param {() => string} [clock]
   */
  constructor(rootDir, clock = () => toRfc3339()) {
    this.rootDir = rootDir;
    this.jobsDir = path.join(rootDir, "jobs");
    this.idempotencyPath = path.join(rootDir, "idempotency.json");
    this._clock = clock;
    this._memory = new InMemoryJobStore(clock);
    fs.mkdirSync(this.jobsDir, { recursive: true });
    this._load();
  }

  _load() {
    if (fs.existsSync(this.idempotencyPath)) {
      const idx = JSON.parse(fs.readFileSync(this.idempotencyPath, "utf8"));
      for (const [k, jobId] of Object.entries(idx)) {
        this._memory._idempotency.set(k, jobId);
      }
    }
    if (!fs.existsSync(this.jobsDir)) return;
    for (const name of fs.readdirSync(this.jobsDir)) {
      if (!name.endsWith(".json")) continue;
      const raw = JSON.parse(fs.readFileSync(path.join(this.jobsDir, name), "utf8"));
      for (const field of JOB_REQUIRED_FIELDS) {
        if (!(field in raw)) {
          throw new Error(`corrupt job file ${name}: missing ${field}`);
        }
      }
      assertRfc3339(raw.createdAt, "createdAt");
      assertRfc3339(raw.updatedAt, "updatedAt");
      this._memory._jobs.set(raw.jobId, raw);
    }
  }

  _persistJob(job) {
    const file = path.join(this.jobsDir, `${job.jobId}.json`);
    fs.writeFileSync(file, `${JSON.stringify(job, null, 2)}\n`, "utf8");
  }

  _persistIdempotency() {
    const obj = Object.fromEntries(this._memory._idempotency.entries());
    fs.writeFileSync(this.idempotencyPath, `${JSON.stringify(obj, null, 2)}\n`, "utf8");
  }

  create(job) {
    const created = this._memory.create(job);
    this._persistJob(created);
    return created;
  }

  read(jobId) {
    return this._memory.read(jobId);
  }

  update(jobId, mutator) {
    const updated = this._memory.update(jobId, mutator);
    this._persistJob(updated);
    return updated;
  }

  findByIdempotency(identity) {
    return this._memory.findByIdempotency(identity);
  }

  enqueueOrchestrate(args) {
    const result = this._memory.enqueueOrchestrate(args);
    this._persistJob(result.job);
    this._persistIdempotency();
    return result;
  }

  claim(jobId) {
    const job = this._memory.claim(jobId);
    this._persistJob(job);
    return job;
  }

  requestCancel(jobId) {
    const result = this._memory.requestCancel(jobId);
    if (result.job) this._persistJob(result.job);
    return result;
  }

  checkpoint(jobId, label) {
    const result = this._memory.checkpoint(jobId, label);
    this._persistJob(result.job);
    return result;
  }

  markSucceeded(jobId, resultSummary) {
    const job = this._memory.markSucceeded(jobId, resultSummary);
    this._persistJob(job);
    return job;
  }

  markFailed(jobId, error) {
    const job = this._memory.markFailed(jobId, error);
    this._persistJob(job);
    return job;
  }

  markRejected(jobId, error) {
    const job = this._memory.markRejected(jobId, error);
    this._persistJob(job);
    return job;
  }

  listJobIds() {
    return this._memory.listJobIds();
  }
}

/**
 * P-INT-01 Slice B2 — Job Store + Job Runner Core validation.
 *
 * Usage:
 *   node src/runPInt01SliceB2Validation.js
 */

import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import {
  FACTORY_ORCHESTRATION_ERROR_CODES,
  InMemoryJobStore,
  FileJobStore,
  JobRunnerCore,
  JOB_STATES,
  isRfc3339,
  enforceFactoryBoundary,
} from "../services/factory-orchestration-edge/index.js";

const results = [];
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = path.resolve(__dirname, "..");
const EDGE_DIR = path.join(REPO_ROOT, "services", "factory-orchestration-edge");

function test(name, fn) {
  try {
    const ret = fn();
    if (ret && typeof ret.then === "function") {
      return ret
        .then(() => {
          results.push({ name, ok: true });
          console.log(`PASS  ${name}`);
        })
        .catch((error) => {
          results.push({ name, ok: false, error: error.message });
          console.error(`FAIL  ${name}`);
          console.error(`      ${error.message}`);
        });
    }
    results.push({ name, ok: true });
    console.log(`PASS  ${name}`);
    return Promise.resolve();
  } catch (error) {
    results.push({ name, ok: false, error: error.message });
    console.error(`FAIL  ${name}`);
    console.error(`      ${error.message}`);
    return Promise.resolve();
  }
}

async function run() {
  await test("01 create/read/update job store", () => {
    const store = new InMemoryJobStore();
    const { job, created } = store.enqueueOrchestrate({
      factoryKey: "fk-b2-01",
      idempotencyKey: "idem-01",
      actorId: "actor-a",
    });
    assert.equal(created, true);
    assert.equal(job.state, JOB_STATES.QUEUED);
    assert.ok(isRfc3339(job.createdAt));
    assert.ok(isRfc3339(job.updatedAt));
    const read = store.read(job.jobId);
    assert.equal(read.factoryKey, "fk-b2-01");
    const updated = store.update(job.jobId, (j) => {
      j.updatedAt = new Date().toISOString();
      return j;
    });
    assert.ok(isRfc3339(updated.updatedAt));
  });

  await test("02 idempotency dedupe same key/actor/factoryKey/command", () => {
    const store = new InMemoryJobStore();
    const a = store.enqueueOrchestrate({
      factoryKey: "fk-b2-02",
      idempotencyKey: "same-key",
      actorId: "actor-a",
    });
    const b = store.enqueueOrchestrate({
      factoryKey: "fk-b2-02",
      idempotencyKey: "same-key",
      actorId: "actor-a",
    });
    assert.equal(a.created, true);
    assert.equal(b.created, false);
    assert.equal(a.job.jobId, b.job.jobId);
  });

  await test("03 idempotency mismatch on runner enqueue fails closed", () => {
    const runner = new JobRunnerCore(new InMemoryJobStore());
    assert.throws(
      () =>
        runner.enqueue(
          {
            factoryKey: "fk",
            command: "orchestrateExpediente",
            idempotencyKey: "body-key",
          },
          "header-key"
        ),
      (err) => err.code === FACTORY_ORCHESTRATION_ERROR_CODES.VALIDATION_FAIL
    );
  });

  await test("04 claim unique and double claim rejected", () => {
    const store = new InMemoryJobStore();
    const { job } = store.enqueueOrchestrate({
      factoryKey: "fk-b2-04",
      idempotencyKey: "claim-1",
      actorId: "actor-a",
    });
    const claimed = store.claim(job.jobId);
    assert.equal(claimed.state, JOB_STATES.RUNNING);
    assert.throws(
      () => store.claim(job.jobId),
      (err) => err.code === FACTORY_ORCHESTRATION_ERROR_CODES.CONFLICT
    );
  });

  await test("05 QUEUED → RUNNING → SUCCEEDED via CB-15 Mandated executor (SP01-IB-09)", async () => {
    const runner = new JobRunnerCore(new InMemoryJobStore(), { executionTimeoutMs: 120_000 });
    const { job } = runner.enqueue(
      { factoryKey: "fk-b2-05", command: "orchestrateExpediente" },
      "idem-05",
      "actor-a"
    );
    const done = await runner.processJob(job.jobId);
    assert.equal(done.state, JOB_STATES.SUCCEEDED);
    assert.equal(done.resultSummary.elr, undefined);
    assert.equal(done.resultSummary.decisionPackage, undefined);
    assert.equal(done.resultSummary.orchestrationStatus, "CB15_OK");
    assert.equal(done.resultSummary.summaryCode, "SP01_IB09_CB15");
    assert.equal(typeof done.resultSummary.factoryKey, "string");
    assert.ok(done.resultSummary.factoryKey.length > 0);
  });

  await test("05b stub executor remains injectable (harness only; not CAP-02 proof)", async () => {
    const { runStubOrchestration } = await import(
      "../services/factory-orchestration-edge/stubExecutor.js"
    );
    const runner = new JobRunnerCore(new InMemoryJobStore(), {
      executionTimeoutMs: 2000,
      executor: runStubOrchestration,
    });
    const { job } = runner.enqueue(
      { factoryKey: "fk-b2-05b", command: "orchestrateExpediente" },
      "idem-05b",
      "actor-a"
    );
    const done = await runner.processJob(job.jobId);
    assert.equal(done.state, JOB_STATES.SUCCEEDED);
    assert.equal(done.resultSummary.summaryCode, "B2_STUB");
  });

  await test("06 cancel QUEUED → CANCELLED immediate", () => {
    const store = new InMemoryJobStore();
    const { job } = store.enqueueOrchestrate({
      factoryKey: "fk-b2-06",
      idempotencyKey: "cancel-q",
      actorId: "actor-a",
    });
    const result = store.requestCancel(job.jobId);
    assert.equal(result.ok, true);
    assert.equal(result.job.state, JOB_STATES.CANCELLED);
    assert.equal(result.job.cancelRequested, false);
  });

  await test("07 cancel RUNNING via flag + checkpoint (OBS-B1-01)", async () => {
    const store = new InMemoryJobStore();
    const runner = new JobRunnerCore(store, {
      executionTimeoutMs: 5000,
      executor: async (_job, hooks) => {
        await hooks.checkpoint("start");
        // simulate external cancel while RUNNING
        store.requestCancel(_job.jobId);
        const mid = await hooks.checkpoint("mid");
        assert.equal(mid.cancelled, true);
        return { cancelled: true };
      },
    });
    const { job } = runner.enqueue(
      { factoryKey: "fk-b2-07", command: "orchestrateExpediente" },
      "idem-07"
    );
    // claim manually to inspect cancelRequested before checkpoint completes
    const claimed = store.claim(job.jobId);
    assert.equal(claimed.state, JOB_STATES.RUNNING);
    const cancelReq = store.requestCancel(job.jobId);
    assert.equal(cancelReq.ok, true);
    assert.equal(cancelReq.pendingCheckpoint, true);
    assert.equal(cancelReq.job.state, JOB_STATES.RUNNING);
    assert.equal(cancelReq.job.cancelRequested, true);
    const cp = store.checkpoint(job.jobId, "worker-cp");
    assert.equal(cp.cancelled, true);
    assert.equal(cp.job.state, JOB_STATES.CANCELLED);
  });

  await test("08 timeout → FAILED", async () => {
    const runner = new JobRunnerCore(new InMemoryJobStore(), {
      executionTimeoutMs: 20,
      executor: async (_job, hooks) => {
        await hooks.sleep(200);
        return { cancelled: false, resultSummary: { factoryKey: "x" } };
      },
    });
    const { job } = runner.enqueue(
      { factoryKey: "fk-b2-08", command: "orchestrateExpediente" },
      "idem-08"
    );
    const done = await runner.processJob(job.jobId);
    assert.equal(done.state, JOB_STATES.FAILED);
    assert.equal(done.error.code, "TIMEOUT");
    assert.equal(/[/\\]/.test(done.error.message), false);
  });

  await test("09 terminal job not re-executable", async () => {
    const store = new InMemoryJobStore();
    const runner = new JobRunnerCore(store, { executionTimeoutMs: 2000 });
    const { job } = runner.enqueue(
      { factoryKey: "fk-b2-09", command: "orchestrateExpediente" },
      "idem-09"
    );
    await runner.processJob(job.jobId);
    assert.throws(
      () => store.claim(job.jobId),
      (err) => err.code === FACTORY_ORCHESTRATION_ERROR_CODES.CONFLICT
    );
  });

  await test("10 sanitized unexpected error", async () => {
    const runner = new JobRunnerCore(new InMemoryJobStore(), {
      executionTimeoutMs: 2000,
      executor: async () => {
        throw new Error("boom at C:\\Users\\secret\\path token=abc password=x");
      },
    });
    const { job } = runner.enqueue(
      { factoryKey: "fk-b2-10", command: "orchestrateExpediente" },
      "idem-10"
    );
    const done = await runner.processJob(job.jobId);
    assert.equal(done.state, JOB_STATES.FAILED);
    assert.equal(done.error.message.includes("C:\\Users"), false);
    assert.match(done.error.message, /sanitized error|redacted-path/);
  });

  await test("11 file store create/read + no forbidden imports in B2 sources", () => {
    const dir = fs.mkdtempSync(path.join(os.tmpdir(), "pint01-b2-"));
    const store = new FileJobStore(dir);
    const { job } = store.enqueueOrchestrate({
      factoryKey: "fk-file",
      idempotencyKey: "file-1",
      actorId: "actor-a",
    });
    const reloaded = new FileJobStore(dir);
    const read = reloaded.read(job.jobId);
    assert.equal(read.factoryKey, "fk-file");
    assert.ok(isRfc3339(read.createdAt));

    const jsFiles = fs.readdirSync(EDGE_DIR).filter((f) => f.endsWith(".js"));
    for (const name of jsFiles) {
      const src = fs.readFileSync(path.join(EDGE_DIR, name), "utf8");
      assert.equal(
        /from\s+["'][^"']*factory-service-edge/.test(src),
        false,
        `${name} imports factory-service-edge`
      );
    }
    assert.equal(fs.existsSync(path.join(EDGE_DIR, "supabaseAdapter.js")), false);
    assert.equal(fs.existsSync(path.join(EDGE_DIR, "marketplaceBridge.js")), false);
    // live boundary adapter uses public CB-15 API only
    const boundary = enforceFactoryBoundary("marketplace_listing");
    assert.equal(boundary.ok, false);
    assert.equal(boundary.jobState, JOB_STATES.REJECTED);
  });

  await test("12 regression B1 suite", () => {
    const proc = spawnSync(process.execPath, ["src/runPInt01SliceB1Validation.js"], {
      cwd: REPO_ROOT,
      encoding: "utf8",
    });
    if (proc.status !== 0) {
      throw new Error(`B1 regression failed\n${proc.stdout}\n${proc.stderr}`);
    }
    assert.match(proc.stdout, /ALL SUITES PASS/);
  });

  // ——— HQ-04 / OBS-SB-RACE hardening (deterministic interleavings) ———

  /**
   * Controllable delay: timeout arm waits on gate; executor sleep hangs forever.
   * Releases timeout only after caller invokes allowTimeout() (sync ordering).
   */
  function createControllableDelay(timeoutMs) {
    let allowTimeout;
    const timeoutGate = new Promise((resolve) => {
      allowTimeout = resolve;
    });
    const delayFn = async (ms) => {
      if (ms === timeoutMs) {
        await timeoutGate;
        return;
      }
      await new Promise(() => {});
    };
    return { delayFn, allowTimeout: () => allowTimeout() };
  }

  await test("13 HQ-04 timeout without cancelRequested → FAILED TIMEOUT", async () => {
    const store = new InMemoryJobStore();
    const timeoutMs = 10_000;
    const { delayFn, allowTimeout } = createControllableDelay(timeoutMs);
    const runner = new JobRunnerCore(store, {
      executionTimeoutMs: timeoutMs,
      delay: delayFn,
      executor: async (_job, hooks) => {
        allowTimeout();
        await hooks.sleep(1);
        return { cancelled: false, resultSummary: { summaryCode: "TOO_LATE" } };
      },
    });
    const { job } = runner.enqueue(
      { factoryKey: "fk-hq04-13", command: "orchestrateExpediente" },
      "idem-hq04-13",
      "actor-a"
    );
    const done = await runner.processJob(job.jobId);
    assert.equal(done.state, JOB_STATES.FAILED);
    assert.equal(done.error.code, "TIMEOUT");
    assert.equal(store.read(job.jobId).state, JOB_STATES.FAILED);
  });

  await test("14 HQ-04 cancelRequested before timeout while RUNNING → CANCELLED", async () => {
    const store = new InMemoryJobStore();
    const timeoutMs = 10_000;
    const { delayFn, allowTimeout } = createControllableDelay(timeoutMs);
    const runner = new JobRunnerCore(store, {
      executionTimeoutMs: timeoutMs,
      delay: delayFn,
      executor: async (job, hooks) => {
        const cancel = store.requestCancel(job.jobId);
        assert.equal(cancel.ok, true);
        assert.equal(cancel.job.cancelRequested, true);
        assert.equal(cancel.job.state, JOB_STATES.RUNNING);
        allowTimeout();
        await hooks.sleep(1);
        return { cancelled: false, resultSummary: { summaryCode: "SHOULD_NOT_SUCCEED" } };
      },
    });
    const { job } = runner.enqueue(
      { factoryKey: "fk-hq04-14", command: "orchestrateExpediente" },
      "idem-hq04-14",
      "actor-a"
    );
    const done = await runner.processJob(job.jobId);
    assert.equal(done.state, JOB_STATES.CANCELLED);
    const persisted = store.read(job.jobId);
    assert.equal(persisted.state, JOB_STATES.CANCELLED);
    assert.equal(persisted.state, done.state);
  });

  await test("15 HQ-04 timeout then cancel → single FAILED terminal preserved", async () => {
    const store = new InMemoryJobStore();
    const timeoutMs = 10_000;
    const { delayFn, allowTimeout } = createControllableDelay(timeoutMs);
    const runner = new JobRunnerCore(store, {
      executionTimeoutMs: timeoutMs,
      delay: delayFn,
      executor: async (_job, hooks) => {
        allowTimeout();
        await hooks.sleep(1);
        return { cancelled: false, resultSummary: {} };
      },
    });
    const { job } = runner.enqueue(
      { factoryKey: "fk-hq04-15", command: "orchestrateExpediente" },
      "idem-hq04-15",
      "actor-a"
    );
    const done = await runner.processJob(job.jobId);
    assert.equal(done.state, JOB_STATES.FAILED);
    const cancel = store.requestCancel(job.jobId);
    assert.equal(cancel.ok, false);
    assert.equal(cancel.code, FACTORY_ORCHESTRATION_ERROR_CODES.CONFLICT);
    assert.equal(store.read(job.jobId).state, JOB_STATES.FAILED);
  });

  await test("16 HQ-04 double cancel idempotent", () => {
    const store = new InMemoryJobStore();
    const { job } = store.enqueueOrchestrate({
      factoryKey: "fk-hq04-16",
      idempotencyKey: "idem-hq04-16",
      actorId: "actor-a",
    });
    const first = store.requestCancel(job.jobId);
    assert.equal(first.ok, true);
    assert.equal(first.job.state, JOB_STATES.CANCELLED);
    const second = store.requestCancel(job.jobId);
    assert.equal(second.ok, true);
    assert.equal(second.idempotent, true);
    assert.equal(second.job.state, JOB_STATES.CANCELLED);
    assert.equal(store.read(job.jobId).state, JOB_STATES.CANCELLED);
  });

  await test("17 HQ-04 timeout after already CANCELLED does not overwrite", async () => {
    const store = new InMemoryJobStore();
    const timeoutMs = 10_000;
    const { delayFn, allowTimeout } = createControllableDelay(timeoutMs);
    const runner = new JobRunnerCore(store, {
      executionTimeoutMs: timeoutMs,
      delay: delayFn,
      executor: async (job, hooks) => {
        store.requestCancel(job.jobId);
        const cp = store.checkpoint(job.jobId, "early-cancel");
        assert.equal(cp.cancelled, true);
        assert.equal(cp.job.state, JOB_STATES.CANCELLED);
        allowTimeout();
        await hooks.sleep(1);
        return { cancelled: false, resultSummary: {} };
      },
    });
    const { job } = runner.enqueue(
      { factoryKey: "fk-hq04-17", command: "orchestrateExpediente" },
      "idem-hq04-17",
      "actor-a"
    );
    const done = await runner.processJob(job.jobId);
    assert.equal(done.state, JOB_STATES.CANCELLED);
    assert.equal(store.read(job.jobId).state, JOB_STATES.CANCELLED);
  });

  await test("18 HQ-04 SUCCEEDED then cancel/timeout paths do not overwrite", async () => {
    const store = new InMemoryJobStore();
    const runner = new JobRunnerCore(store, { executionTimeoutMs: 2000 });
    const { job } = runner.enqueue(
      { factoryKey: "fk-hq04-18", command: "orchestrateExpediente" },
      "idem-hq04-18",
      "actor-a"
    );
    const done = await runner.processJob(job.jobId);
    assert.equal(done.state, JOB_STATES.SUCCEEDED);
    const cancel = store.requestCancel(job.jobId);
    assert.equal(cancel.ok, false);
    assert.equal(cancel.code, FACTORY_ORCHESTRATION_ERROR_CODES.CONFLICT);
    assert.throws(
      () => store.markFailed(job.jobId, { code: "TIMEOUT", message: "late" }),
      (err) => err.code === FACTORY_ORCHESTRATION_ERROR_CODES.CONFLICT
    );
    assert.equal(store.read(job.jobId).state, JOB_STATES.SUCCEEDED);
  });

  await test("19 HQ-04 FAILED then cancel does not overwrite", async () => {
    const store = new InMemoryJobStore();
    const timeoutMs = 10_000;
    const { delayFn, allowTimeout } = createControllableDelay(timeoutMs);
    const runner = new JobRunnerCore(store, {
      executionTimeoutMs: timeoutMs,
      delay: delayFn,
      executor: async (_job, hooks) => {
        allowTimeout();
        await hooks.sleep(1);
        return { cancelled: false, resultSummary: {} };
      },
    });
    const { job } = runner.enqueue(
      { factoryKey: "fk-hq04-19", command: "orchestrateExpediente" },
      "idem-hq04-19",
      "actor-a"
    );
    const done = await runner.processJob(job.jobId);
    assert.equal(done.state, JOB_STATES.FAILED);
    const cancel = store.requestCancel(job.jobId);
    assert.equal(cancel.ok, false);
    assert.equal(store.read(job.jobId).state, JOB_STATES.FAILED);
  });

  await test("20 HQ-04 markFailed with cancelRequested → CANCELLED (no RUNNING left)", () => {
    const store = new InMemoryJobStore();
    const { job } = store.enqueueOrchestrate({
      factoryKey: "fk-hq04-20",
      idempotencyKey: "idem-hq04-20",
      actorId: "actor-a",
    });
    store.claim(job.jobId);
    store.requestCancel(job.jobId);
    assert.equal(store.read(job.jobId).cancelRequested, true);
    const terminal = store.markFailed(job.jobId, {
      code: "TIMEOUT",
      message: "execution timeout",
    });
    assert.equal(terminal.state, JOB_STATES.CANCELLED);
    assert.equal(store.read(job.jobId).state, JOB_STATES.CANCELLED);
  });

  await test("21 HQ-04 unrelated executor error + cancelRequested → FAILED not CANCELLED", async () => {
    const store = new InMemoryJobStore();
    const runner = new JobRunnerCore(store, {
      executionTimeoutMs: 60_000,
      executor: async (job) => {
        store.requestCancel(job.jobId);
        assert.equal(store.read(job.jobId).cancelRequested, true);
        const err = new Error("executor boom");
        err.code = "INTERNAL_ERROR";
        throw err;
      },
    });
    const { job } = runner.enqueue(
      { factoryKey: "fk-hq04-21", command: "orchestrateExpediente" },
      "idem-hq04-21",
      "actor-a"
    );
    const done = await runner.processJob(job.jobId);
    assert.equal(done.state, JOB_STATES.FAILED);
    assert.equal(done.error.code, "INTERNAL_ERROR");
    assert.equal(store.read(job.jobId).state, JOB_STATES.FAILED);
  });

  await test("22 HQ-04 finalize TIMEOUT+cancelRequested via controlled state (no wall clock)", () => {
    const store = new InMemoryJobStore();
    const runner = new JobRunnerCore(store, { executionTimeoutMs: 60_000 });
    const { job } = store.enqueueOrchestrate({
      factoryKey: "fk-hq04-22",
      idempotencyKey: "idem-hq04-22",
      actorId: "actor-a",
    });
    store.claim(job.jobId);
    store.requestCancel(job.jobId);
    const done = runner._finalizeTimeoutOrError(
      job.jobId,
      { code: "TIMEOUT", message: "execution timeout" },
      { timedOut: true }
    );
    assert.equal(done.state, JOB_STATES.CANCELLED);
    assert.equal(store.read(job.jobId).state, done.state);
  });

  const failed = results.filter((r) => !r.ok);
  console.log("");
  console.log("========== P-INT-01 SLICE B2 SUMMARY ==========");
  console.log(
    `Total: ${results.length}  PASS: ${results.length - failed.length}  FAIL: ${failed.length}`
  );
  if (failed.length === 0) {
    console.log("ALL SUITES PASS");
    console.log("AUTHORIZED SURFACE: B2 JOB STORE + RUNNER CORE");
    console.log("NOTE: B3/B4 may coexist; B2 suite remains authoritative for store/runner");
    process.exit(0);
  }
  console.log("FAILURES:");
  for (const f of failed) {
    console.log(` - ${f.name}: ${f.error}`);
  }
  process.exit(1);
}

run();

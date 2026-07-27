/**
 * P-INT-01 Slice B4 — Staging integration + E2E + smoke + full regression.
 *
 * Usage:
 *   node src/runPInt01SliceB4Validation.js
 *
 * Does not expand contracts or HTTP surface. Uses B1+B2+B3 only.
 */

import assert from "node:assert/strict";
import http from "node:http";
import { spawnSync } from "node:child_process";
import path from "node:path";
import { fileURLToPath } from "node:url";
import {
  InMemoryJobStore,
  JobRunnerCore,
  OrchestrationCommandCore,
  StagingAuthzAdapter,
  StagingBearerAuthnAdapter,
  createDefaultStagingSessions,
  createOrchestrationCommandHandler,
  JOB_STATES,
} from "../services/factory-orchestration-edge/index.js";

const results = [];
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = path.resolve(__dirname, "..");

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

function createStack(runnerOptions = {}) {
  const store = new InMemoryJobStore();
  const runner = new JobRunnerCore(store, {
    executionTimeoutMs: 2000,
    ...runnerOptions,
  });
  const core = new OrchestrationCommandCore({
    runner,
    authn: new StagingBearerAuthnAdapter({ sessions: createDefaultStagingSessions() }),
    authz: new StagingAuthzAdapter(),
  });
  return { store, runner, core };
}

async function withServer(core, fn) {
  const handler = createOrchestrationCommandHandler(core);
  const server = http.createServer((req, res) => {
    void handler(req, res);
  });
  const sockets = new Set();
  server.on("connection", (socket) => {
    sockets.add(socket);
    socket.on("close", () => sockets.delete(socket));
  });
  await new Promise((resolve) => server.listen(0, "127.0.0.1", resolve));
  const { port } = server.address();
  try {
    await fn(port);
  } finally {
    for (const socket of sockets) {
      try {
        socket.destroy();
      } catch {
        /* ignore */
      }
    }
    if (typeof server.closeAllConnections === "function") {
      server.closeAllConnections();
    }
    await new Promise((resolve) => {
      server.close(() => resolve());
    });
  }
}

async function httpJson(port, { method, path: reqPath, token, headers = {}, body }) {
  const payload = body === undefined ? null : JSON.stringify(body);
  const res = await fetch(`http://127.0.0.1:${port}${reqPath}`, {
    method,
    headers: {
      connection: "close",
      ...(token ? { authorization: `Bearer ${token}` } : {}),
      ...(payload ? { "content-type": "application/json" } : {}),
      "x-correlation-id": headers["x-correlation-id"] || "corr-b4",
      ...headers,
    },
    body: payload,
  });
  const text = await res.text();
  let json = null;
  try {
    json = JSON.parse(text);
  } catch {
    json = { raw: text };
  }
  return { status: res.status, json, text };
}

function runRegression(scriptRel) {
  const proc = spawnSync(process.execPath, [scriptRel], {
    cwd: REPO_ROOT,
    encoding: "utf8",
  });
  if (proc.status !== 0) {
    throw new Error(`${scriptRel} failed\n${proc.stdout}\n${proc.stderr}`);
  }
  assert.match(proc.stdout, /ALL SUITES PASS/);
  return proc.stdout;
}

async function run() {
  console.log("--- B4 smoke ---");

  await test("smoke 01 Auth staging deny + allow", async () => {
    const { core } = createStack();
    await withServer(core, async (port) => {
      const denied = await httpJson(port, {
        method: "POST",
        path: "/v1/factory/orchestration/jobs",
        headers: { "Idempotency-Key": "smoke-deny" },
        body: { factoryKey: "fk", command: "orchestrateExpediente" },
      });
      assert.equal(denied.status, 401);
      const ok = await httpJson(port, {
        method: "POST",
        path: "/v1/factory/orchestration/jobs",
        token: "dev-ops-token",
        headers: { "Idempotency-Key": "smoke-ok" },
        body: { factoryKey: "fk-smoke", command: "orchestrateExpediente" },
      });
      assert.equal(ok.status, 202);
    });
  });

  console.log("--- B4 E2E ---");

  await test("01 flujo completo submit→enqueue→claim→execute→finished", async () => {
    const { runner, core } = createStack();
    await withServer(core, async (port) => {
      const submitted = await httpJson(port, {
        method: "POST",
        path: "/v1/factory/orchestration/jobs",
        token: "dev-ops-token",
        headers: { "Idempotency-Key": "b4-e2e-1" },
        body: { factoryKey: "fk-b4-e2e", command: "orchestrateExpediente" },
      });
      assert.equal(submitted.status, 202);
      const jobId = submitted.json.result.jobId;
      assert.equal(submitted.json.result.state, JOB_STATES.QUEUED);

      const finished = await runner.processJob(jobId);
      assert.equal(finished.state, JOB_STATES.SUCCEEDED);
      assert.equal(finished.resultSummary.elr, undefined);
      assert.equal(finished.resultSummary.decisionPackage, undefined);

      const status = await httpJson(port, {
        method: "GET",
        path: `/v1/factory/orchestration/jobs/${jobId}`,
        token: "dev-ops-token",
      });
      assert.equal(status.status, 200);
      assert.equal(status.json.result.job.state, JOB_STATES.SUCCEEDED);
      assert.equal(status.json.result.job.claimToken, undefined);
      assert.equal(status.json.mode, "STAGING");
    });
  });

  await test("02 cancel queued via HTTP", async () => {
    const { core } = createStack();
    await withServer(core, async (port) => {
      const submitted = await httpJson(port, {
        method: "POST",
        path: "/v1/factory/orchestration/jobs",
        token: "dev-director-token",
        headers: { "Idempotency-Key": "b4-cq" },
        body: { factoryKey: "fk-cq", command: "orchestrateExpediente" },
      });
      const cancel = await httpJson(port, {
        method: "POST",
        path: `/v1/factory/orchestration/jobs/${submitted.json.result.jobId}/cancel`,
        token: "dev-director-token",
      });
      assert.equal(cancel.status, 200);
      assert.equal(cancel.json.result.job.state, JOB_STATES.CANCELLED);
    });
  });

  await test("03 cancel running → checkpoint → CANCELLED", async () => {
    const { store, core } = createStack();
    await withServer(core, async (port) => {
      const submitted = await httpJson(port, {
        method: "POST",
        path: "/v1/factory/orchestration/jobs",
        token: "dev-ops-token",
        headers: { "Idempotency-Key": "b4-cr" },
        body: { factoryKey: "fk-cr", command: "orchestrateExpediente" },
      });
      const jobId = submitted.json.result.jobId;
      store.claim(jobId);
      const cancel = await httpJson(port, {
        method: "POST",
        path: `/v1/factory/orchestration/jobs/${jobId}/cancel`,
        token: "dev-ops-token",
      });
      assert.equal(cancel.status, 200);
      assert.equal(cancel.json.result.job.state, JOB_STATES.RUNNING);
      assert.equal(cancel.json.result.pendingCheckpoint, true);
      const cp = store.checkpoint(jobId, "b4-e2e");
      assert.equal(cp.job.state, JOB_STATES.CANCELLED);
    });
  });

  await test("04 timeout → FAILED + status sanitizado", async () => {
    const { runner, core } = createStack({
      executionTimeoutMs: 20,
      executor: async (_job, hooks) => {
        await hooks.sleep(200);
        return { cancelled: false, resultSummary: { factoryKey: "x" } };
      },
    });
    await withServer(core, async (port) => {
      const submitted = await httpJson(port, {
        method: "POST",
        path: "/v1/factory/orchestration/jobs",
        token: "dev-ops-token",
        headers: { "Idempotency-Key": "b4-to" },
        body: { factoryKey: "fk-to", command: "orchestrateExpediente" },
      });
      const done = await runner.processJob(submitted.json.result.jobId);
      assert.equal(done.state, JOB_STATES.FAILED);
      assert.equal(done.error.code, "TIMEOUT");
      const status = await httpJson(port, {
        method: "GET",
        path: `/v1/factory/orchestration/jobs/${submitted.json.result.jobId}`,
        token: "dev-ops-token",
      });
      assert.equal(status.json.result.job.error.code, "TIMEOUT");
      assert.equal(/C:\\\\Users/.test(status.text), false);
    });
  });

  await test("05 lineage allowlist + status allowlist", async () => {
    const { runner, core } = createStack();
    await withServer(core, async (port) => {
      const submitted = await httpJson(port, {
        method: "POST",
        path: "/v1/factory/orchestration/jobs",
        token: "dev-ops-token",
        headers: { "Idempotency-Key": "b4-lin" },
        body: { factoryKey: "fk-lin", command: "orchestrateExpediente" },
      });
      await runner.processJob(submitted.json.result.jobId);
      const lineage = await httpJson(port, {
        method: "GET",
        path: `/v1/factory/orchestration/jobs/${submitted.json.result.jobId}/lineage`,
        token: "dev-ops-token",
      });
      assert.equal(lineage.status, 200);
      assert.equal(lineage.json.result.lineage.elr, undefined);
      assert.equal(lineage.json.result.lineage.decisionPackage, undefined);
      assert.equal(lineage.json.result.lineage.claimToken, undefined);
      assert.ok(Object.prototype.hasOwnProperty.call(lineage.json.result.lineage, "eventCount"));
    });
  });

  await test("06 sanitización + fail-closed rutas/auth", async () => {
    const { core } = createStack();
    await withServer(core, async (port) => {
      const bad = await httpJson(port, {
        method: "POST",
        path: "/v1/factory/orchestration/jobs",
        token: "dev-ops-token",
        headers: { "Idempotency-Key": "b4-bad" },
        body: { factoryKey: "fk", command: "marketplace_listing" },
      });
      assert.equal(bad.status, 400);
      const forbidden = await httpJson(port, {
        method: "GET",
        path: "/v1/factory/orchestration/secret",
        token: "dev-ops-token",
      });
      assert.equal(forbidden.status, 404);
      const noCap = await httpJson(port, {
        method: "GET",
        path: "/v1/factory/orchestration/jobs/nope",
        token: "dev-ops-no-cap-token",
      });
      assert.equal(noCap.status, 403);
    });
  });

  await test("07 import httpAdapter no auto-listen (OBS-B3-05)", async () => {
    const mod = await import("../services/factory-orchestration-edge/httpAdapter.js");
    assert.equal(typeof mod.createOrchestrationCommandHandler, "function");
    assert.equal(typeof mod.startOrchestrationCommandHttpServer, "function");
    // constructing handler must not bind a port
    const { core } = createStack();
    const handler = mod.createOrchestrationCommandHandler(core);
    assert.equal(typeof handler, "function");
  });

  console.log("--- B4 regressions ---");

  await test("08 regression B3", () => {
    runRegression("src/runPInt01SliceB3Validation.js");
  });

  await test("09 regression B2", () => {
    runRegression("src/runPInt01SliceB2Validation.js");
  });

  await test("10 regression B1", () => {
    runRegression("src/runPInt01SliceB1Validation.js");
  });

  const failed = results.filter((r) => !r.ok);
  console.log("");
  console.log("========== P-INT-01 SLICE B4 SUMMARY ==========");
  console.log(
    `Total: ${results.length}  PASS: ${results.length - failed.length}  FAIL: ${failed.length}`
  );
  if (failed.length === 0) {
    console.log("ALL SUITES PASS");
    console.log("AUTHORIZED SURFACE: B4 STAGING INTEGRATION");
    console.log("SLICE B COMPLETE");
    process.exit(0);
  }
  console.log("FAILURES:");
  for (const f of failed) {
    console.log(` - ${f.name}: ${f.error}`);
  }
  process.exit(1);
}

run();

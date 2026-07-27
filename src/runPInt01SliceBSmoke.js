/**
 * P-INT-01 Slice B — Staging smoke tests (subset of B4 E2E).
 *
 * Usage:
 *   node src/runPInt01SliceBSmoke.js
 *
 * Uses node:http client (not fetch) for clean Windows teardown.
 */

import assert from "node:assert/strict";
import http from "node:http";
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

function httpJson(port, opts) {
  const payload = opts.body === undefined ? null : JSON.stringify(opts.body);
  const headers = {
    connection: "close",
    ...(opts.token ? { authorization: `Bearer ${opts.token}` } : {}),
    ...(payload
      ? { "content-type": "application/json", "content-length": Buffer.byteLength(payload) }
      : {}),
    ...(opts.headers || {}),
  };
  return new Promise((resolve, reject) => {
    const req = http.request(
      {
        hostname: "127.0.0.1",
        port,
        path: opts.path,
        method: opts.method,
        headers,
      },
      (res) => {
        const chunks = [];
        res.on("data", (c) => chunks.push(c));
        res.on("end", () => {
          const text = Buffer.concat(chunks).toString("utf8");
          resolve({ status: res.statusCode, json: JSON.parse(text) });
        });
      }
    );
    req.on("error", reject);
    if (payload) req.write(payload);
    req.end();
  });
}

async function withServer(core, fn) {
  const handler = createOrchestrationCommandHandler(core);
  const server = http.createServer((req, res) => {
    void handler(req, res);
  });
  await new Promise((resolve) => server.listen(0, "127.0.0.1", resolve));
  const { port } = server.address();
  try {
    await fn(port);
  } finally {
    await new Promise((resolve) => server.close(() => resolve()));
  }
}

async function run() {
  await test("smoke submit + process + status", async () => {
    const store = new InMemoryJobStore();
    const runner = new JobRunnerCore(store, { executionTimeoutMs: 2000 });
    const core = new OrchestrationCommandCore({
      runner,
      authn: new StagingBearerAuthnAdapter({ sessions: createDefaultStagingSessions() }),
      authz: new StagingAuthzAdapter(),
    });
    await withServer(core, async (port) => {
      const submitted = await httpJson(port, {
        method: "POST",
        path: "/v1/factory/orchestration/jobs",
        token: "dev-ops-token",
        headers: { "Idempotency-Key": "smoke-flow" },
        body: { factoryKey: "fk-smoke-flow", command: "orchestrateExpediente" },
      });
      assert.equal(submitted.status, 202);
      const done = await runner.processJob(submitted.json.result.jobId);
      assert.equal(done.state, JOB_STATES.SUCCEEDED);
      const status = await httpJson(port, {
        method: "GET",
        path: `/v1/factory/orchestration/jobs/${submitted.json.result.jobId}`,
        token: "dev-ops-token",
      });
      assert.equal(status.json.result.job.state, JOB_STATES.SUCCEEDED);
    });
  });

  await test("smoke cancel queued", async () => {
    const store = new InMemoryJobStore();
    const runner = new JobRunnerCore(store);
    const core = new OrchestrationCommandCore({
      runner,
      authn: new StagingBearerAuthnAdapter({ sessions: createDefaultStagingSessions() }),
      authz: new StagingAuthzAdapter(),
    });
    await withServer(core, async (port) => {
      const submitted = await httpJson(port, {
        method: "POST",
        path: "/v1/factory/orchestration/jobs",
        token: "dev-ops-token",
        headers: { "Idempotency-Key": "smoke-cancel" },
        body: { factoryKey: "fk-smoke-c", command: "orchestrateExpediente" },
      });
      const cancel = await httpJson(port, {
        method: "POST",
        path: `/v1/factory/orchestration/jobs/${submitted.json.result.jobId}/cancel`,
        token: "dev-ops-token",
      });
      assert.equal(cancel.json.result.job.state, JOB_STATES.CANCELLED);
    });
  });

  const failed = results.filter((r) => !r.ok);
  console.log("");
  console.log("========== P-INT-01 SLICE B SMOKE ==========");
  console.log(
    `Total: ${results.length}  PASS: ${results.length - failed.length}  FAIL: ${failed.length}`
  );
  if (failed.length === 0) {
    console.log("SMOKE PASS");
    process.exitCode = 0;
    return;
  }
  process.exitCode = 1;
}

run().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

/**
 * P-INT-01 Slice B3 — HTTP Command Edge validation (staging).
 *
 * Usage:
 *   node src/runPInt01SliceB3Validation.js
 */

import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import http from "node:http";
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

function createCore(store = new InMemoryJobStore()) {
  const runner = new JobRunnerCore(store, { executionTimeoutMs: 2000 });
  return {
    store,
    runner,
    core: new OrchestrationCommandCore({
      runner,
      authn: new StagingBearerAuthnAdapter({ sessions: createDefaultStagingSessions() }),
      authz: new StagingAuthzAdapter(),
    }),
  };
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
    await new Promise((resolve, reject) => server.close((err) => (err ? reject(err) : resolve())));
  }
}

async function httpJson(port, { method, path: reqPath, token, headers = {}, body }) {
  const payload = body === undefined ? null : JSON.stringify(body);
  const res = await fetch(`http://127.0.0.1:${port}${reqPath}`, {
    method,
    headers: {
      ...(token ? { authorization: `Bearer ${token}` } : {}),
      ...(payload ? { "content-type": "application/json" } : {}),
      "x-correlation-id": headers["x-correlation-id"] || "corr-b3",
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

async function run() {
  await test("01 submit válido → 202", async () => {
    const { core } = createCore();
    await withServer(core, async (port) => {
      const res = await httpJson(port, {
        method: "POST",
        path: "/v1/factory/orchestration/jobs",
        token: "dev-ops-token",
        headers: { "Idempotency-Key": "b3-sub-1" },
        body: { factoryKey: "fk-b3-01", command: "orchestrateExpediente" },
      });
      assert.equal(res.status, 202);
      assert.equal(res.json.contractId, "factory.service_edge.command");
      assert.equal(res.json.mode, "STAGING");
      assert.ok(res.json.result.jobId);
      assert.equal(res.json.result.state, JOB_STATES.QUEUED);
    });
  });

  await test("02 submit sin auth → 401", async () => {
    const { core } = createCore();
    await withServer(core, async (port) => {
      const res = await httpJson(port, {
        method: "POST",
        path: "/v1/factory/orchestration/jobs",
        headers: { "Idempotency-Key": "b3-noauth" },
        body: { factoryKey: "fk", command: "orchestrateExpediente" },
      });
      assert.equal(res.status, 401);
      assert.equal(res.json.error.code, "UNAUTHENTICATED");
    });
  });

  await test("03 submit sin capability → 403", async () => {
    const { core } = createCore();
    await withServer(core, async (port) => {
      const res = await httpJson(port, {
        method: "POST",
        path: "/v1/factory/orchestration/jobs",
        token: "dev-ops-no-cap-token",
        headers: { "Idempotency-Key": "b3-nocap" },
        body: { factoryKey: "fk", command: "orchestrateExpediente" },
      });
      assert.equal(res.status, 403);
      assert.equal(res.json.error.code, "FORBIDDEN");
    });
  });

  await test("04 submit sin Idempotency-Key → 400", async () => {
    const { core } = createCore();
    await withServer(core, async (port) => {
      const res = await httpJson(port, {
        method: "POST",
        path: "/v1/factory/orchestration/jobs",
        token: "dev-ops-token",
        body: { factoryKey: "fk", command: "orchestrateExpediente" },
      });
      assert.equal(res.status, 400);
      assert.equal(res.json.error.code, "VALIDATION_FAIL");
    });
  });

  await test("05 submit duplicado → mismo jobId", async () => {
    const { core } = createCore();
    await withServer(core, async (port) => {
      const a = await httpJson(port, {
        method: "POST",
        path: "/v1/factory/orchestration/jobs",
        token: "dev-ops-token",
        headers: { "Idempotency-Key": "b3-dup" },
        body: { factoryKey: "fk-dup", command: "orchestrateExpediente" },
      });
      const b = await httpJson(port, {
        method: "POST",
        path: "/v1/factory/orchestration/jobs",
        token: "dev-ops-token",
        headers: { "Idempotency-Key": "b3-dup" },
        body: { factoryKey: "fk-dup", command: "orchestrateExpediente" },
      });
      assert.equal(a.status, 202);
      assert.equal(b.status, 202);
      assert.equal(a.json.result.jobId, b.json.result.jobId);
      assert.equal(b.json.result.created, false);
    });
  });

  await test("06 get status", async () => {
    const { core } = createCore();
    await withServer(core, async (port) => {
      const created = await httpJson(port, {
        method: "POST",
        path: "/v1/factory/orchestration/jobs",
        token: "dev-ops-token",
        headers: { "Idempotency-Key": "b3-get" },
        body: { factoryKey: "fk-get", command: "orchestrateExpediente" },
      });
      const res = await httpJson(port, {
        method: "GET",
        path: `/v1/factory/orchestration/jobs/${created.json.result.jobId}`,
        token: "dev-ops-token",
      });
      assert.equal(res.status, 200);
      assert.equal(res.json.result.job.factoryKey, "fk-get");
      assert.equal(res.json.result.job.claimToken, undefined);
    });
  });

  await test("07 cancel queued", async () => {
    const { core } = createCore();
    await withServer(core, async (port) => {
      const created = await httpJson(port, {
        method: "POST",
        path: "/v1/factory/orchestration/jobs",
        token: "dev-ops-token",
        headers: { "Idempotency-Key": "b3-cq" },
        body: { factoryKey: "fk-cq", command: "orchestrateExpediente" },
      });
      const res = await httpJson(port, {
        method: "POST",
        path: `/v1/factory/orchestration/jobs/${created.json.result.jobId}/cancel`,
        token: "dev-ops-token",
      });
      assert.equal(res.status, 200);
      assert.equal(res.json.result.job.state, JOB_STATES.CANCELLED);
    });
  });

  await test("08 cancel running → pendingCheckpoint", async () => {
    const { store, runner, core } = createCore();
    await withServer(core, async (port) => {
      const created = await httpJson(port, {
        method: "POST",
        path: "/v1/factory/orchestration/jobs",
        token: "dev-ops-token",
        headers: { "Idempotency-Key": "b3-cr" },
        body: { factoryKey: "fk-cr", command: "orchestrateExpediente" },
      });
      const jobId = created.json.result.jobId;
      store.claim(jobId);
      const res = await httpJson(port, {
        method: "POST",
        path: `/v1/factory/orchestration/jobs/${jobId}/cancel`,
        token: "dev-ops-token",
      });
      assert.equal(res.status, 200);
      assert.equal(res.json.result.job.state, JOB_STATES.RUNNING);
      assert.equal(res.json.result.job.cancelRequested, true);
      assert.equal(res.json.result.pendingCheckpoint, true);
      const cp = store.checkpoint(jobId, "http-test");
      assert.equal(cp.job.state, JOB_STATES.CANCELLED);
      void runner;
    });
  });

  await test("09 lineage allowlist", async () => {
    const { core } = createCore();
    await withServer(core, async (port) => {
      const created = await httpJson(port, {
        method: "POST",
        path: "/v1/factory/orchestration/jobs",
        token: "dev-ops-token",
        headers: { "Idempotency-Key": "b3-lin" },
        body: { factoryKey: "fk-lin", command: "orchestrateExpediente" },
      });
      const res = await httpJson(port, {
        method: "GET",
        path: `/v1/factory/orchestration/jobs/${created.json.result.jobId}/lineage`,
        token: "dev-ops-token",
      });
      assert.equal(res.status, 200);
      const lineage = res.json.result.lineage;
      assert.equal(lineage.factoryKey, "fk-lin");
      assert.equal(lineage.elr, undefined);
      assert.equal(lineage.decisionPackage, undefined);
      assert.equal(lineage.claimToken, undefined);
      assert.equal(lineage.rawElr, undefined);
    });
  });

  await test("10 sanitize output / no secrets in errors", async () => {
    const { core } = createCore();
    await withServer(core, async (port) => {
      const res = await httpJson(port, {
        method: "POST",
        path: "/v1/factory/orchestration/jobs",
        token: "dev-ops-token",
        headers: { "Idempotency-Key": "bad key" },
        body: { factoryKey: "fk", command: "orchestrateExpediente" },
      });
      assert.equal(res.status, 400);
      assert.equal(res.text.includes("stack"), false);
      assert.equal(/C:\\\\Users/.test(res.text), false);
    });
  });

  await test("11 deny forbidden routes", async () => {
    const { core } = createCore();
    await withServer(core, async (port) => {
      const res = await httpJson(port, {
        method: "GET",
        path: "/v1/factory/orchestration/admin/export",
        token: "dev-ops-token",
      });
      assert.equal(res.status, 404);
      const marketplace = await httpJson(port, {
        method: "POST",
        path: "/v1/factory/marketplace/list",
        token: "dev-ops-token",
        body: {},
      });
      assert.equal(marketplace.status, 404);
    });
  });

  await test("12 fail closed invalid command", async () => {
    const { core } = createCore();
    await withServer(core, async (port) => {
      const res = await httpJson(port, {
        method: "POST",
        path: "/v1/factory/orchestration/jobs",
        token: "dev-ops-token",
        headers: { "Idempotency-Key": "b3-badcmd" },
        body: { factoryKey: "fk", command: "publish_deal" },
      });
      assert.equal(res.status, 400);
      assert.equal(res.json.error.code, "VALIDATION_FAIL");
    });
  });

  await test("13 regression B2", () => {
    const proc = spawnSync(process.execPath, ["src/runPInt01SliceB2Validation.js"], {
      cwd: REPO_ROOT,
      encoding: "utf8",
    });
    if (proc.status !== 0) {
      throw new Error(`B2 regression failed\n${proc.stdout}\n${proc.stderr}`);
    }
    assert.match(proc.stdout, /ALL SUITES PASS/);
  });

  await test("14 regression B1", () => {
    const proc = spawnSync(process.execPath, ["src/runPInt01SliceB1Validation.js"], {
      cwd: REPO_ROOT,
      encoding: "utf8",
    });
    if (proc.status !== 0) {
      throw new Error(`B1 regression failed\n${proc.stdout}\n${proc.stderr}`);
    }
    assert.match(proc.stdout, /ALL SUITES PASS/);
  });

  const failed = results.filter((r) => !r.ok);
  console.log("");
  console.log("========== P-INT-01 SLICE B3 SUMMARY ==========");
  console.log(
    `Total: ${results.length}  PASS: ${results.length - failed.length}  FAIL: ${failed.length}`
  );
  if (failed.length === 0) {
    console.log("ALL SUITES PASS");
    console.log("AUTHORIZED SURFACE: B3 HTTP COMMAND EDGE STAGING");
    console.log("NOTE: B4 integration suite supersedes this banner for Slice B closure");
    process.exit(0);
  }
  console.log("FAILURES:");
  for (const f of failed) {
    console.log(` - ${f.name}: ${f.error}`);
  }
  process.exit(1);
}

run();

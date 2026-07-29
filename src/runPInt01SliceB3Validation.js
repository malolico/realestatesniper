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
  FACTORY_ORCHESTRATION_MAX_BODY_BYTES,
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

const HQ05_CAPS = [
  "factory.command.orchestrate",
  "factory.command.job.read",
  "factory.command.job.lineage",
];

function createCore(store = new InMemoryJobStore(), sessions = createDefaultStagingSessions()) {
  const runner = new JobRunnerCore(store, { executionTimeoutMs: 2000 });
  return {
    store,
    runner,
    core: new OrchestrationCommandCore({
      runner,
      authn: new StagingBearerAuthnAdapter({ sessions }),
      authz: new StagingAuthzAdapter(),
    }),
  };
}

/** AuthN that always returns a fixed principal (layer exercised: OrchestrationCommandCore.handle). */
function createCoreWithFixedPrincipal(principal, store = new InMemoryJobStore()) {
  const runner = new JobRunnerCore(store, { executionTimeoutMs: 2000 });
  return {
    store,
    runner,
    core: new OrchestrationCommandCore({
      runner,
      authn: { authenticate: () => principal },
      authz: new StagingAuthzAdapter(),
    }),
  };
}

function parseCoreResponse(response) {
  const json = JSON.parse(response.body);
  return { status: response.statusCode, json, text: response.body };
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

async function httpJson(port, { method, path: reqPath, token, headers = {}, body, rawBody, setContentType }) {
  const payload =
    rawBody !== undefined ? rawBody : body === undefined ? null : JSON.stringify(body);
  const autoCt =
    setContentType !== false &&
    payload !== null &&
    headers["content-type"] === undefined &&
    headers["Content-Type"] === undefined;
  const res = await fetch(`http://127.0.0.1:${port}${reqPath}`, {
    method,
    headers: {
      ...(token ? { authorization: `Bearer ${token}` } : {}),
      ...(autoCt ? { "content-type": "application/json" } : {}),
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

function makeSubmitBodyUtf8Size(targetBytes, factoryKeyPrefix = "fk-size") {
  const suffix = '","command":"orchestrateExpediente"}';
  const prefix = `{"factoryKey":"${factoryKeyPrefix}`;
  const overhead = Buffer.byteLength(prefix, "utf8") + Buffer.byteLength(suffix, "utf8");
  assert.ok(targetBytes >= overhead + 1, "target too small");
  return `${prefix}${"a".repeat(targetBytes - overhead)}${suffix}`;
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

  // ——— HQ-05 / OBS-SB-ACL actor-scoped ownership (canonical ids, no trim equivalence) ———

  await test("15 HQ-05 GET owner OPS allowed; submit persists exact principalId", async () => {
    const { core, store } = createCore();
    await withServer(core, async (port) => {
      const created = await httpJson(port, {
        method: "POST",
        path: "/v1/factory/orchestration/jobs",
        token: "dev-ops-token",
        headers: { "Idempotency-Key": "hq05-get-owner" },
        body: { factoryKey: "fk-hq05-a", command: "orchestrateExpediente" },
      });
      assert.equal(created.status, 202);
      assert.equal(created.json.actor.principalId, "staging-ops");
      assert.equal(store.read(created.json.result.jobId).actorId, "staging-ops");
      const res = await httpJson(port, {
        method: "GET",
        path: `/v1/factory/orchestration/jobs/${created.json.result.jobId}`,
        token: "dev-ops-token",
      });
      assert.equal(res.status, 200);
      assert.equal(res.json.result.job.jobId, created.json.result.jobId);
    });
  });

  await test("16 HQ-05 GET cross-actor OPS denied", async () => {
    const { core } = createCore();
    await withServer(core, async (port) => {
      const created = await httpJson(port, {
        method: "POST",
        path: "/v1/factory/orchestration/jobs",
        token: "dev-ops-token",
        headers: { "Idempotency-Key": "hq05-get-xops" },
        body: { factoryKey: "fk-hq05-b", command: "orchestrateExpediente" },
      });
      const res = await httpJson(port, {
        method: "GET",
        path: `/v1/factory/orchestration/jobs/${created.json.result.jobId}`,
        token: "dev-ops-b-token",
      });
      assert.equal(res.status, 403);
      assert.equal(res.json.error.code, "FORBIDDEN");
      assert.equal(res.json.error.message, "authorization denied");
      assert.equal(res.json.result, undefined);
    });
  });

  await test("17 HQ-05 GET Director owner allowed; Director cross-actor denied", async () => {
    const { core } = createCore();
    await withServer(core, async (port) => {
      const created = await httpJson(port, {
        method: "POST",
        path: "/v1/factory/orchestration/jobs",
        token: "dev-director-token",
        headers: { "Idempotency-Key": "hq05-get-dir" },
        body: { factoryKey: "fk-hq05-c", command: "orchestrateExpediente" },
      });
      const own = await httpJson(port, {
        method: "GET",
        path: `/v1/factory/orchestration/jobs/${created.json.result.jobId}`,
        token: "dev-director-token",
      });
      assert.equal(own.status, 200);
      const cross = await httpJson(port, {
        method: "GET",
        path: `/v1/factory/orchestration/jobs/${created.json.result.jobId}`,
        token: "dev-ops-token",
      });
      assert.equal(cross.status, 403);
      assert.equal(cross.json.error.code, "FORBIDDEN");
    });
  });

  await test("18 HQ-05 Bearer absent remains 401 (distinct from ownership deny)", async () => {
    const { core } = createCore();
    await withServer(core, async (port) => {
      const created = await httpJson(port, {
        method: "POST",
        path: "/v1/factory/orchestration/jobs",
        token: "dev-ops-token",
        headers: { "Idempotency-Key": "hq05-get-noauth" },
        body: { factoryKey: "fk-hq05-d", command: "orchestrateExpediente" },
      });
      const res = await httpJson(port, {
        method: "GET",
        path: `/v1/factory/orchestration/jobs/${created.json.result.jobId}`,
      });
      assert.equal(res.status, 401);
      assert.equal(res.json.error.code, "UNAUTHENTICATED");
    });
  });

  await test("19 HQ-05 principal leading/trailing whitespace DENY (no trim equivalence)", async () => {
    const sessions = createDefaultStagingSessions();
    sessions["dev-lead-ws-token"] = {
      principalId: " staging-ops",
      roles: ["FACTORY_OPS"],
      capabilities: [...HQ05_CAPS],
    };
    sessions["dev-trail-ws-token"] = {
      principalId: "staging-ops ",
      roles: ["FACTORY_OPS"],
      capabilities: [...HQ05_CAPS],
    };
    const { core } = createCore(new InMemoryJobStore(), sessions);
    await withServer(core, async (port) => {
      const created = await httpJson(port, {
        method: "POST",
        path: "/v1/factory/orchestration/jobs",
        token: "dev-ops-token",
        headers: { "Idempotency-Key": "hq05-get-ws" },
        body: { factoryKey: "fk-hq05-e", command: "orchestrateExpediente" },
      });
      assert.equal(created.status, 202);
      const lead = await httpJson(port, {
        method: "GET",
        path: `/v1/factory/orchestration/jobs/${created.json.result.jobId}`,
        token: "dev-lead-ws-token",
      });
      assert.equal(lead.status, 403);
      assert.equal(lead.json.error.code, "FORBIDDEN");
      assert.equal(lead.json.error.message, "authorization denied");
      const trail = await httpJson(port, {
        method: "GET",
        path: `/v1/factory/orchestration/jobs/${created.json.result.jobId}`,
        token: "dev-trail-ws-token",
      });
      assert.equal(trail.status, 403);
      assert.equal(trail.json.error.code, "FORBIDDEN");
    });
  });

  await test("20 HQ-05 cancel owner allowed; cross-actor no mutation", async () => {
    const { core, store } = createCore();
    await withServer(core, async (port) => {
      const created = await httpJson(port, {
        method: "POST",
        path: "/v1/factory/orchestration/jobs",
        token: "dev-ops-token",
        headers: { "Idempotency-Key": "hq05-cancel" },
        body: { factoryKey: "fk-hq05-f", command: "orchestrateExpediente" },
      });
      const jobId = created.json.result.jobId;
      const before = store.read(jobId);
      const denied = await httpJson(port, {
        method: "POST",
        path: `/v1/factory/orchestration/jobs/${jobId}/cancel`,
        token: "dev-ops-b-token",
      });
      assert.equal(denied.status, 403);
      const afterDeny = store.read(jobId);
      assert.equal(afterDeny.state, before.state);
      assert.equal(afterDeny.cancelRequested, before.cancelRequested);
      assert.equal(afterDeny.updatedAt, before.updatedAt);
      const dirDeny = await httpJson(port, {
        method: "POST",
        path: `/v1/factory/orchestration/jobs/${jobId}/cancel`,
        token: "dev-director-token",
      });
      assert.equal(dirDeny.status, 403);
      assert.equal(store.read(jobId).updatedAt, before.updatedAt);
      const ok = await httpJson(port, {
        method: "POST",
        path: `/v1/factory/orchestration/jobs/${jobId}/cancel`,
        token: "dev-ops-token",
      });
      assert.equal(ok.status, 200);
      assert.equal(store.read(jobId).state, JOB_STATES.CANCELLED);
    });
  });

  await test("21 HQ-05 cancel Bearer absent 401; no mutation", async () => {
    const { core, store } = createCore();
    await withServer(core, async (port) => {
      const created = await httpJson(port, {
        method: "POST",
        path: "/v1/factory/orchestration/jobs",
        token: "dev-ops-token",
        headers: { "Idempotency-Key": "hq05-cancel-noauth" },
        body: { factoryKey: "fk-hq05-g", command: "orchestrateExpediente" },
      });
      const before = store.read(created.json.result.jobId);
      const res = await httpJson(port, {
        method: "POST",
        path: `/v1/factory/orchestration/jobs/${created.json.result.jobId}/cancel`,
      });
      assert.equal(res.status, 401);
      assert.equal(store.read(created.json.result.jobId).updatedAt, before.updatedAt);
    });
  });

  await test("22 HQ-05 lineage owner allowed; cross-actor / Director / Bearer absent denied", async () => {
    const { core } = createCore();
    await withServer(core, async (port) => {
      const created = await httpJson(port, {
        method: "POST",
        path: "/v1/factory/orchestration/jobs",
        token: "dev-ops-token",
        headers: { "Idempotency-Key": "hq05-lin" },
        body: { factoryKey: "fk-hq05-h", command: "orchestrateExpediente" },
      });
      const jobId = created.json.result.jobId;
      const own = await httpJson(port, {
        method: "GET",
        path: `/v1/factory/orchestration/jobs/${jobId}/lineage`,
        token: "dev-ops-token",
      });
      assert.equal(own.status, 200);
      assert.equal(own.json.result.lineage.factoryKey, "fk-hq05-h");
      const cross = await httpJson(port, {
        method: "GET",
        path: `/v1/factory/orchestration/jobs/${jobId}/lineage`,
        token: "dev-ops-b-token",
      });
      assert.equal(cross.status, 403);
      assert.equal(cross.json.result, undefined);
      assert.equal(cross.text.includes("fk-hq05-h"), false);
      const dir = await httpJson(port, {
        method: "GET",
        path: `/v1/factory/orchestration/jobs/${jobId}/lineage`,
        token: "dev-director-token",
      });
      assert.equal(dir.status, 403);
      assert.equal(dir.json.result, undefined);
      const absent = await httpJson(port, {
        method: "GET",
        path: `/v1/factory/orchestration/jobs/${jobId}/lineage`,
      });
      assert.equal(absent.status, 401);
    });
  });

  await test("23 HQ-05 unknown jobId still NOT_FOUND (404 vs 403 contract intact)", async () => {
    const { core } = createCore();
    await withServer(core, async (port) => {
      const res = await httpJson(port, {
        method: "GET",
        path: "/v1/factory/orchestration/jobs/00000000-0000-4000-8000-000000000099",
        token: "dev-ops-token",
      });
      assert.equal(res.status, 404);
      assert.equal(res.json.error.code, "NOT_FOUND");
    });
  });

  await test("24 HQ-05 authenticated principal without valid principalId → 403 (core.handle)", async () => {
    // Layer: OrchestrationCommandCore.handle after AuthN returns a principal (AuthZ role+cap ok).
    const cases = [
      { label: "absent", principal: { roles: ["FACTORY_OPS"], capabilities: [...HQ05_CAPS] } },
      { label: "null", principal: { principalId: null, roles: ["FACTORY_OPS"], capabilities: [...HQ05_CAPS] } },
      { label: "empty", principal: { principalId: "", roles: ["FACTORY_OPS"], capabilities: [...HQ05_CAPS] } },
      {
        label: "whitespace",
        principal: { principalId: "   ", roles: ["FACTORY_OPS"], capabilities: [...HQ05_CAPS] },
      },
      {
        label: "non-string",
        principal: { principalId: 42, roles: ["FACTORY_OPS"], capabilities: [...HQ05_CAPS] },
      },
    ];
    for (const c of cases) {
      const { core, store } = createCoreWithFixedPrincipal(c.principal);
      const { job } = store.enqueueOrchestrate({
        factoryKey: "fk-hq05-seed",
        idempotencyKey: `hq05-seed-${c.label}`,
        actorId: "staging-ops",
      });
      const before = store.read(job.jobId);
      const getRes = parseCoreResponse(
        await core.handle({
          method: "GET",
          url: `/v1/factory/orchestration/jobs/${job.jobId}`,
          headers: {},
        })
      );
      assert.equal(getRes.status, 403, c.label);
      assert.equal(getRes.json.error.code, "FORBIDDEN", c.label);
      assert.equal(getRes.json.error.message, "authorization denied", c.label);
      assert.equal(getRes.json.result, undefined, c.label);
      const cancelRes = parseCoreResponse(
        await core.handle({
          method: "POST",
          url: `/v1/factory/orchestration/jobs/${job.jobId}/cancel`,
          headers: {},
        })
      );
      assert.equal(cancelRes.status, 403, c.label);
      const after = store.read(job.jobId);
      assert.equal(after.state, before.state, c.label);
      assert.equal(after.cancelRequested, before.cancelRequested, c.label);
      assert.equal(after.updatedAt, before.updatedAt, c.label);
      const submitRes = parseCoreResponse(
        await core.handle({
          method: "POST",
          url: "/v1/factory/orchestration/jobs",
          headers: { "Idempotency-Key": `hq05-submit-bad-${c.label}` },
          bodyText: JSON.stringify({
            factoryKey: `fk-hq05-bad-${c.label}`,
            command: "orchestrateExpediente",
          }),
        })
      );
      assert.equal(submitRes.status, 403, c.label);
      assert.equal(submitRes.json.result, undefined, c.label);
    }
  });

  await test("25 HQ-05 job.actorId with peripheral whitespace → DENY fail-closed", async () => {
    const { core, store } = createCore();
    const { job } = store.enqueueOrchestrate({
      factoryKey: "fk-hq05-pad-owner",
      idempotencyKey: "hq05-pad-owner",
      actorId: " staging-ops ",
    });
    await withServer(core, async (port) => {
      const res = await httpJson(port, {
        method: "GET",
        path: `/v1/factory/orchestration/jobs/${job.jobId}`,
        token: "dev-ops-token",
      });
      assert.equal(res.status, 403);
      assert.equal(res.json.error.code, "FORBIDDEN");
      assert.equal(res.json.result, undefined);
    });
  });

  await test("26 HQ-05 submit with non-canonical principalId creates no job", async () => {
    const sessions = createDefaultStagingSessions();
    sessions["dev-noncanon-token"] = {
      principalId: " staging-ops ",
      roles: ["FACTORY_OPS"],
      capabilities: [...HQ05_CAPS],
    };
    const store = new InMemoryJobStore();
    const { core } = createCore(store, sessions);
    await withServer(core, async (port) => {
      const res = await httpJson(port, {
        method: "POST",
        path: "/v1/factory/orchestration/jobs",
        token: "dev-noncanon-token",
        headers: { "Idempotency-Key": "hq05-submit-noncanon" },
        body: { factoryKey: "fk-hq05-noncanon", command: "orchestrateExpediente" },
      });
      assert.equal(res.status, 403);
      assert.equal(res.json.error.code, "FORBIDDEN");
      assert.equal(res.json.error.message, "authorization denied");
      assert.equal(res.json.result, undefined);
      // Same idempotency key under canonical owner must create (proves prior submit did not persist).
      const probe = await httpJson(port, {
        method: "POST",
        path: "/v1/factory/orchestration/jobs",
        token: "dev-ops-token",
        headers: { "Idempotency-Key": "hq05-submit-noncanon" },
        body: { factoryKey: "fk-hq05-noncanon", command: "orchestrateExpediente" },
      });
      assert.equal(probe.status, 202);
      assert.equal(probe.json.result.created, true);
      assert.equal(store.read(probe.json.result.jobId).actorId, "staging-ops");
    });
  });

  // ——— HQ-06 / OBS-SB-BODY Content-Type + size + entity rules ———

  await test("27 HQ-06 submit missing Content-Type → 400", async () => {
    const { core, store } = createCore();
    await withServer(core, async (port) => {
      const res = await httpJson(port, {
        method: "POST",
        path: "/v1/factory/orchestration/jobs",
        token: "dev-ops-token",
        headers: { "Idempotency-Key": "hq06-no-ct" },
        body: { factoryKey: "fk-hq06-noct", command: "orchestrateExpediente" },
        setContentType: false,
      });
      assert.equal(res.status, 400);
      assert.equal(res.json.error.code, "VALIDATION_FAIL");
      assert.equal(res.json.error.message, "content-type must be application/json");
      assert.equal(res.json.result, undefined);
      const probe = await httpJson(port, {
        method: "POST",
        path: "/v1/factory/orchestration/jobs",
        token: "dev-ops-token",
        headers: { "Idempotency-Key": "hq06-no-ct" },
        body: { factoryKey: "fk-hq06-noct", command: "orchestrateExpediente" },
      });
      assert.equal(probe.status, 202);
      assert.equal(probe.json.result.created, true);
      assert.equal(store.read(probe.json.result.jobId).actorId, "staging-ops");
    });
  });

  await test("28 HQ-06 submit wrong Content-Type → 400", async () => {
    const { core } = createCore();
    await withServer(core, async (port) => {
      const res = await httpJson(port, {
        method: "POST",
        path: "/v1/factory/orchestration/jobs",
        token: "dev-ops-token",
        headers: {
          "Idempotency-Key": "hq06-bad-ct",
          "content-type": "text/plain",
        },
        body: { factoryKey: "fk-hq06-badct", command: "orchestrateExpediente" },
        setContentType: false,
      });
      assert.equal(res.status, 400);
      assert.equal(res.json.error.code, "VALIDATION_FAIL");
      assert.match(res.json.error.message, /content-type/i);
    });
  });

  await test("29 HQ-06 submit charset=utf-8 Content-Type allowed", async () => {
    const { core } = createCore();
    await withServer(core, async (port) => {
      const res = await httpJson(port, {
        method: "POST",
        path: "/v1/factory/orchestration/jobs",
        token: "dev-ops-token",
        headers: {
          "Idempotency-Key": "hq06-ct-utf8",
          "content-type": "application/json; charset=utf-8",
        },
        body: { factoryKey: "fk-hq06-utf8", command: "orchestrateExpediente" },
        setContentType: false,
      });
      assert.equal(res.status, 202);
    });
  });

  await test("30 HQ-06 empty submit body → 400; no job", async () => {
    const { core, store } = createCore();
    await withServer(core, async (port) => {
      const res = await httpJson(port, {
        method: "POST",
        path: "/v1/factory/orchestration/jobs",
        token: "dev-ops-token",
        headers: { "Idempotency-Key": "hq06-empty" },
        rawBody: "",
        setContentType: false,
      });
      assert.equal(res.status, 400);
      assert.equal(res.json.error.code, "VALIDATION_FAIL");
      assert.equal(res.json.error.message, "request body is required");
      const probe = await httpJson(port, {
        method: "POST",
        path: "/v1/factory/orchestration/jobs",
        token: "dev-ops-token",
        headers: { "Idempotency-Key": "hq06-empty" },
        body: { factoryKey: "fk-hq06-empty", command: "orchestrateExpediente" },
      });
      assert.equal(probe.status, 202);
      assert.equal(probe.json.result.created, true);
      assert.ok(store.read(probe.json.result.jobId));
    });
  });

  await test("31 HQ-06 malformed JSON / null / array / primitive → 400; no job", async () => {
    const { core, store } = createCore();
    await withServer(core, async (port) => {
      const cases = [
        { key: "hq06-mal", rawBody: "{not-json", msg: /invalid JSON/i },
        { key: "hq06-null", rawBody: "null", msg: /object/i },
        { key: "hq06-arr", rawBody: "[]", msg: /object/i },
        { key: "hq06-str", rawBody: '"x"', msg: /object/i },
        { key: "hq06-num", rawBody: "1", msg: /object/i },
        { key: "hq06-bool", rawBody: "true", msg: /object/i },
      ];
      for (const c of cases) {
        const res = await httpJson(port, {
          method: "POST",
          path: "/v1/factory/orchestration/jobs",
          token: "dev-ops-token",
          headers: { "Idempotency-Key": c.key },
          rawBody: c.rawBody,
        });
        assert.equal(res.status, 400, c.key);
        assert.equal(res.json.error.code, "VALIDATION_FAIL", c.key);
        assert.match(res.json.error.message, c.msg, c.key);
        const probe = await httpJson(port, {
          method: "POST",
          path: "/v1/factory/orchestration/jobs",
          token: "dev-ops-token",
          headers: { "Idempotency-Key": c.key },
          body: { factoryKey: `fk-${c.key}`, command: "orchestrateExpediente" },
        });
        assert.equal(probe.status, 202, c.key);
        assert.equal(probe.json.result.created, true, c.key);
        assert.equal(store.read(probe.json.result.jobId).actorId, "staging-ops", c.key);
      }
    });
  });

  await test("32 HQ-06 {} missing required fields → 400; no job", async () => {
    const { core } = createCore();
    await withServer(core, async (port) => {
      const res = await httpJson(port, {
        method: "POST",
        path: "/v1/factory/orchestration/jobs",
        token: "dev-ops-token",
        headers: { "Idempotency-Key": "hq06-empty-obj" },
        body: {},
      });
      assert.equal(res.status, 400);
      assert.equal(res.json.error.code, "VALIDATION_FAIL");
      const probe = await httpJson(port, {
        method: "POST",
        path: "/v1/factory/orchestration/jobs",
        token: "dev-ops-token",
        headers: { "Idempotency-Key": "hq06-empty-obj" },
        body: { factoryKey: "fk-hq06-obj", command: "orchestrateExpediente" },
      });
      assert.equal(probe.status, 202);
      assert.equal(probe.json.result.created, true);
    });
  });

  await test("33 HQ-06 body size 65536 accepted; 65537 → 413; no body echo", async () => {
    const { core } = createCore();
    await withServer(core, async (port) => {
      const okBody = makeSubmitBodyUtf8Size(FACTORY_ORCHESTRATION_MAX_BODY_BYTES, "fk-hq06-ok");
      assert.equal(Buffer.byteLength(okBody, "utf8"), FACTORY_ORCHESTRATION_MAX_BODY_BYTES);
      const ok = await httpJson(port, {
        method: "POST",
        path: "/v1/factory/orchestration/jobs",
        token: "dev-ops-token",
        headers: { "Idempotency-Key": "hq06-size-ok" },
        rawBody: okBody,
      });
      assert.equal(ok.status, 202);

      const overBody = makeSubmitBodyUtf8Size(FACTORY_ORCHESTRATION_MAX_BODY_BYTES + 1, "fk-hq06-ov");
      assert.equal(Buffer.byteLength(overBody, "utf8"), FACTORY_ORCHESTRATION_MAX_BODY_BYTES + 1);
      const over = await httpJson(port, {
        method: "POST",
        path: "/v1/factory/orchestration/jobs",
        token: "dev-ops-token",
        headers: { "Idempotency-Key": "hq06-size-over" },
        rawBody: overBody,
      });
      assert.equal(over.status, 413);
      assert.equal(over.json.error.code, "PAYLOAD_TOO_LARGE");
      assert.equal(over.json.error.message, "payload too large");
      assert.equal(over.text.includes("fk-hq06-ov"), false);
      assert.ok(over.text.length < 2000);
    });
  });

  await test("34 HQ-06 cancel empty body OK; non-empty body rejected without mutation", async () => {
    const { core, store } = createCore();
    await withServer(core, async (port) => {
      const created = await httpJson(port, {
        method: "POST",
        path: "/v1/factory/orchestration/jobs",
        token: "dev-ops-token",
        headers: { "Idempotency-Key": "hq06-cancel-body" },
        body: { factoryKey: "fk-hq06-cancel", command: "orchestrateExpediente" },
      });
      const jobId = created.json.result.jobId;
      const before = store.read(jobId);
      const denied = await httpJson(port, {
        method: "POST",
        path: `/v1/factory/orchestration/jobs/${jobId}/cancel`,
        token: "dev-ops-token",
        body: { reason: "nope" },
      });
      assert.equal(denied.status, 400);
      assert.equal(denied.json.error.code, "VALIDATION_FAIL");
      assert.equal(denied.json.error.message, "cancel must not include a body");
      const after = store.read(jobId);
      assert.equal(after.state, before.state);
      assert.equal(after.cancelRequested, before.cancelRequested);
      assert.equal(after.updatedAt, before.updatedAt);
      const ok = await httpJson(port, {
        method: "POST",
        path: `/v1/factory/orchestration/jobs/${jobId}/cancel`,
        token: "dev-ops-token",
      });
      assert.equal(ok.status, 200);
      assert.equal(store.read(jobId).state, JOB_STATES.CANCELLED);
    });
  });

  await test("35 HQ-06 actorId in body ignored; ownership from AuthN; HQ-05 cross-actor still denied", async () => {
    const { core, store } = createCore();
    await withServer(core, async (port) => {
      const created = await httpJson(port, {
        method: "POST",
        path: "/v1/factory/orchestration/jobs",
        token: "dev-ops-token",
        headers: { "Idempotency-Key": "hq06-actor-body" },
        body: {
          factoryKey: "fk-hq06-actor",
          command: "orchestrateExpediente",
          actorId: "attacker",
          ownerId: "attacker",
          state: "SUCCEEDED",
          roles: ["FACTORY_DIRECTOR"],
        },
      });
      assert.equal(created.status, 202);
      assert.equal(store.read(created.json.result.jobId).actorId, "staging-ops");
      const cross = await httpJson(port, {
        method: "GET",
        path: `/v1/factory/orchestration/jobs/${created.json.result.jobId}`,
        token: "dev-ops-b-token",
      });
      assert.equal(cross.status, 403);
      const own = await httpJson(port, {
        method: "GET",
        path: `/v1/factory/orchestration/jobs/${created.json.result.jobId}`,
        token: "dev-ops-token",
      });
      assert.equal(own.status, 200);
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

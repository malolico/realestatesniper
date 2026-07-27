/**
 * P-INT-01 Slice A — Factory Service Edge validation runner.
 *
 * Usage:
 *   node src/runPInt01SliceAValidation.js
 */

import assert from "node:assert/strict";
import fs from "node:fs";
import http from "node:http";
import os from "node:os";
import path from "node:path";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import { FileElrStore } from "./factory/cb01/fileElrStore.js";
import {
  FactoryServiceEdgeCore,
  FixedClock,
  InMemoryAuditAdapter,
  InMemoryAuthnAdapter,
  InMemoryAuthzAdapter,
  InMemoryRateLimitAdapter,
  ReadOnlyFactoryReadPort,
  createFactoryServiceEdgeHandler,
  startFactoryServiceEdgeHttpServer,
  FACTORY_EDGE_CAPABILITIES,
  FACTORY_EDGE_GOVERNANCE_ALLOWLISTS,
} from "../services/factory-service-edge/index.js";

const results = [];
const clock = new FixedClock("2026-07-27T06:30:00.000Z");
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = path.resolve(__dirname, "..");

function test(name, fn) {
  try {
    fn();
    results.push({ name, ok: true });
    console.log(`PASS  ${name}`);
  } catch (error) {
    results.push({ name, ok: false, error: error.message });
    console.error(`FAIL  ${name}`);
    console.error(`      ${error.message}`);
  }
}

async function testAsync(name, fn) {
  try {
    await fn();
    results.push({ name, ok: true });
    console.log(`PASS  ${name}`);
  } catch (error) {
    results.push({ name, ok: false, error: error.message });
    console.error(`FAIL  ${name}`);
    console.error(`      ${error.message}`);
  }
}

function runNode(scriptRel) {
  const proc = spawnSync(process.execPath, [scriptRel], {
    cwd: REPO_ROOT,
    encoding: "utf8",
  });
  if (proc.status !== 0) {
    throw new Error(`${scriptRel} exit ${proc.status}\n${proc.stdout}\n${proc.stderr}`);
  }
  return proc.stdout;
}

function mkTemp(prefix = "pint01-slicea-") {
  return fs.mkdtempSync(path.join(os.tmpdir(), prefix));
}

function writeFixtureRecord(registryRoot, key = "fk-pint01-001") {
  const store = new FileElrStore(registryRoot);
  const now = "2026-07-27T06:00:00.000Z";
  return store.write({
    factory_key: key,
    state: "ST-RDY",
    keyStatus: "definitive",
    createdAt: now,
    archivedAt: null,
    retiredAt: null,
    elr: {
      elrId: `ELR-${key}`,
      factory_key: key,
      evidence_registry_ref: "evd-001",
      state_transitions: [{ from: "ST-NASC", to: "ST-RDY", actor: "MOT-SYN-02", at: now }],
      motor_manifests: [
        { motorId: "MOT-IDN-01", actor: "MOT-IDN-01" },
        { motorId: "MOT-CMP-01", actor: "MOT-CMP-01", status: "READY" },
        {
          kind: "EVF_READINESS_GATE_EVAL",
          actor: "MOT-SYN-02",
          allPass: true,
          passCount: 7,
          gateCount: 7,
          gates: ["G0", "G1", "G2", "G3", "G4", "G5", "G6"],
        },
      ],
      loop_ledger_refs: [
        { kind: "FFO_ORCHESTRATION_EVENT", actor: "MOT-SYN-02", pConst: "P0" },
        {
          kind: "FFO_ORCHESTRATION_COMPLETE",
          actor: "MOT-SYN-02",
          maturity_score: 0.91,
          state: "ST-RDY",
          pConstWinner: "P0",
        },
        { kind: "FFO_ELR_AGGREGATION", actor: "MOT-SYN-02" },
        { kind: "LOOP_G0_RUN", actor: "LOOP-G0" },
      ],
      swarm_mission_refs: [{ swarmId: "SWM-01", actor: "SWM-01" }],
      aia_rlg_refs: [{ aiaId: "AIA-01", actor: "AIA-01", prhPass: true }],
      conflict_resolutions: [],
      decision_handoffs: [],
      factory_key_history: [],
    },
  });
}

function createCore(registryRoot, sessions) {
  const authn = new InMemoryAuthnAdapter({
    sessions: sessions ?? {
      "ops-token": {
        principalId: "ops-1",
        roles: ["FACTORY_OPS"],
        capabilities: [
          FACTORY_EDGE_CAPABILITIES.READINESS,
          FACTORY_EDGE_CAPABILITIES.REGISTRY,
          FACTORY_EDGE_CAPABILITIES.ELR_SUMMARY,
          FACTORY_EDGE_CAPABILITIES.GOVERNANCE,
        ],
      },
      "director-token": {
        principalId: "director-1",
        roles: ["FACTORY_DIRECTOR"],
        capabilities: [
          FACTORY_EDGE_CAPABILITIES.READINESS,
          FACTORY_EDGE_CAPABILITIES.REGISTRY,
          FACTORY_EDGE_CAPABILITIES.ELR_SUMMARY,
          FACTORY_EDGE_CAPABILITIES.GOVERNANCE,
        ],
      },
      "weak-token": {
        principalId: "weak-1",
        roles: ["FACTORY_OPS"],
        capabilities: [FACTORY_EDGE_CAPABILITIES.READINESS],
      },
      "other-role-token": {
        principalId: "viewer-1",
        roles: ["VIEWER"],
        capabilities: [FACTORY_EDGE_CAPABILITIES.GOVERNANCE],
      },
    },
  });
  const audit = new InMemoryAuditAdapter();
  return {
    audit,
    core: new FactoryServiceEdgeCore({
      clock,
      authn,
      authz: new InMemoryAuthzAdapter(),
      rateLimit: new InMemoryRateLimitAdapter({ clock }),
      audit,
      factoryReads: new ReadOnlyFactoryReadPort({ registryRoot }),
    }),
  };
}

function requestJson(server, { pathName, token, method = "GET", headers = {}, body = "" }) {
  return new Promise((resolve, reject) => {
    const address = server.address();
    const req = http.request(
      {
        host: "127.0.0.1",
        port: address.port,
        path: pathName,
        method,
        headers: {
          ...(token ? { authorization: `Bearer ${token}` } : {}),
          ...headers,
        },
      },
      (res) => {
        const chunks = [];
        res.on("data", (chunk) => chunks.push(Buffer.from(chunk)));
        res.on("end", () => {
          const text = Buffer.concat(chunks).toString("utf8");
          let json = null;
          try {
            json = JSON.parse(text);
          } catch {
            json = text;
          }
          resolve({ statusCode: res.statusCode, headers: res.headers, body: json });
        });
      }
    );
    req.on("error", reject);
    if (body) req.write(body);
    req.end();
  });
}

async function withServer(core, fn) {
  const server = startFactoryServiceEdgeHttpServer({ core });
  await new Promise((resolve) => server.listen(0, "127.0.0.1", resolve));
  try {
    await fn(server);
  } finally {
    await new Promise((resolve, reject) => server.close((err) => (err ? reject(err) : resolve())));
  }
}

test("01 governance allowlists are deeply frozen", () => {
  assert.equal(Object.isFrozen(FACTORY_EDGE_GOVERNANCE_ALLOWLISTS), true);
  assert.equal(Object.isFrozen(FACTORY_EDGE_GOVERNANCE_ALLOWLISTS.dashboard), true);
  assert.equal(
    Object.isFrozen(FACTORY_EDGE_GOVERNANCE_ALLOWLISTS.dashboard.coverageSections),
    true
  );
});

await testAsync("02 health is unauthenticated and minimal", async () => {
  const base = mkTemp();
  const { core } = createCore(path.join(base, "registry"));
  await withServer(core, async (server) => {
    const res = await requestJson(server, { pathName: "/v1/factory/health" });
    assert.equal(res.statusCode, 200);
    assert.deepEqual(res.body, { status: "ok" });
  });
  fs.rmSync(base, { recursive: true, force: true });
});

await testAsync("03 readiness requires auth and capability", async () => {
  const base = mkTemp();
  const registryRoot = path.join(base, "registry");
  const { core, audit } = createCore(registryRoot);
  await withServer(core, async (server) => {
    const noAuth = await requestJson(server, { pathName: "/v1/factory/readiness" });
    assert.equal(noAuth.statusCode, 401);

    const badRole = await requestJson(server, {
      pathName: "/v1/factory/readiness",
      token: "other-role-token",
    });
    assert.equal(badRole.statusCode, 403);

    const ok = await requestJson(server, {
      pathName: "/v1/factory/readiness",
      token: "ops-token",
    });
    assert.equal(ok.statusCode, 200);
    assert.equal(ok.body.contractId, "factory.service_edge.read");
    assert.equal(ok.body.payload.ready, true);
    assert.equal(ok.body.dataClassification, "INTERNAL_OPS");
    assert.equal(audit.events.length >= 2, true);
  });
  fs.rmSync(base, { recursive: true, force: true });
});

await testAsync("04 readiness empty-state remains ready", async () => {
  const base = mkTemp();
  const registryRoot = path.join(base, "missing-registry");
  const { core } = createCore(registryRoot);
  await withServer(core, async (server) => {
    const res = await requestJson(server, {
      pathName: "/v1/factory/readiness",
      token: "director-token",
    });
    assert.equal(res.statusCode, 200);
    assert.equal(res.body.payload.ready, true);
    assert.equal(res.body.payload.empty, true);
  });
  fs.rmSync(base, { recursive: true, force: true });
});

await testAsync("05 registry summary is sanitized and bounded", async () => {
  const base = mkTemp();
  const registryRoot = path.join(base, "registry");
  writeFixtureRecord(registryRoot);
  const { core } = createCore(registryRoot);
  await withServer(core, async (server) => {
    const res = await requestJson(server, {
      pathName: "/v1/factory/registry/summary",
      token: "ops-token",
    });
    assert.equal(res.statusCode, 200);
    assert.equal(res.body.payload.expedienteCount, 1);
    assert.equal(Array.isArray(res.body.payload.keySample), true);
    assert.equal("registryRoot" in res.body.payload, false);
    assert.equal("absolutePath" in res.body.payload, false);
  });
  fs.rmSync(base, { recursive: true, force: true });
});

await testAsync("06 elr summary omits raw ELR and decision packages", async () => {
  const base = mkTemp();
  const registryRoot = path.join(base, "registry");
  writeFixtureRecord(registryRoot);
  const { core } = createCore(registryRoot);
  await withServer(core, async (server) => {
    const res = await requestJson(server, {
      pathName: "/v1/factory/elr/summary",
      token: "ops-token",
    });
    assert.equal(res.statusCode, 200);
    assert.equal(res.body.payload.status, "OK");
    assert.equal(typeof res.body.payload.sectionCounts.loop_ledger_refs, "number");
    assert.equal("elr" in res.body.payload, false);
    assert.equal("decisionPackage" in res.body.payload, false);
  });
  fs.rmSync(base, { recursive: true, force: true });
});

await testAsync("07 governance endpoints respect allowlists", async () => {
  const base = mkTemp();
  const registryRoot = path.join(base, "registry");
  writeFixtureRecord(registryRoot);
  const { core } = createCore(registryRoot);
  await withServer(core, async (server) => {
    const dashboard = await requestJson(server, {
      pathName: "/v1/factory/governance/dashboard",
      token: "director-token",
    });
    assert.equal(dashboard.statusCode, 200);
    assert.deepEqual(Object.keys(dashboard.body.payload.maturity).sort(), [
      "bands",
      "g0g6Reproducible",
      "gates",
      "maturityScore",
      "rule",
      "source",
    ]);
    assert.equal("ids" in dashboard.body.payload.coverage, false);

    const drift = await requestJson(server, {
      pathName: "/v1/factory/governance/drift",
      token: "director-token",
    });
    assert.equal(drift.statusCode, 200);
    assert.equal(Array.isArray(drift.body.payload.findings), true);

    const compliance = await requestJson(server, {
      pathName: "/v1/factory/governance/compliance",
      token: "director-token",
    });
    assert.equal(compliance.statusCode, 200);
    assert.equal(Array.isArray(compliance.body.payload.items), true);

    const maturity = await requestJson(server, {
      pathName: "/v1/factory/governance/maturity",
      token: "director-token",
    });
    assert.equal(maturity.statusCode, 200);
    assert.equal(typeof maturity.body.payload.maturityScore, "number");
  });
  fs.rmSync(base, { recursive: true, force: true });
});

await testAsync("08 query allowlist and unknown endpoint fail closed", async () => {
  const base = mkTemp();
  const registryRoot = path.join(base, "registry");
  writeFixtureRecord(registryRoot);
  const { core } = createCore(registryRoot);
  await withServer(core, async (server) => {
    const badQuery = await requestJson(server, {
      pathName: "/v1/factory/registry/summary?raw=true",
      token: "ops-token",
    });
    assert.equal(badQuery.statusCode, 400);

    const notFound = await requestJson(server, {
      pathName: "/v1/factory/nope",
      token: "ops-token",
    });
    assert.equal(notFound.statusCode, 404);
  });
  fs.rmSync(base, { recursive: true, force: true });
});

await testAsync("09 GET body is rejected", async () => {
  const base = mkTemp();
  const { core } = createCore(path.join(base, "registry"));
  await withServer(core, async (server) => {
    const res = await requestJson(server, {
      pathName: "/v1/factory/readiness",
      token: "ops-token",
      headers: { "content-length": "2" },
      body: "{}",
    });
    assert.equal(res.statusCode, 400);
  });
  fs.rmSync(base, { recursive: true, force: true });
});

await testAsync("10 correlation id is echoed", async () => {
  const base = mkTemp();
  const { core } = createCore(path.join(base, "registry"));
  await withServer(core, async (server) => {
    const res = await requestJson(server, {
      pathName: "/v1/factory/readiness",
      token: "ops-token",
      headers: { "x-correlation-id": "123e4567-e89b-12d3-a456-426614174000" },
    });
    assert.equal(res.statusCode, 200);
    assert.equal(res.headers["x-correlation-id"], "123e4567-e89b-12d3-a456-426614174000");
    assert.equal(
      res.body.correlationId,
      "123e4567-e89b-12d3-a456-426614174000"
    );
  });
  fs.rmSync(base, { recursive: true, force: true });
});

await testAsync("11 rate limiting returns 429 and Retry-After", async () => {
  const base = mkTemp();
  const { core } = createCore(path.join(base, "registry"));
  core.rateLimit.consume = () => ({ allowed: false, retryAfterSeconds: 7 });
  await withServer(core, async (server) => {
    const res = await requestJson(server, {
      pathName: "/v1/factory/readiness",
      token: "ops-token",
    });
    assert.equal(res.statusCode, 429);
    assert.equal(res.headers["retry-after"], "7");
  });
  fs.rmSync(base, { recursive: true, force: true });
});

await testAsync("12 invalid registry data fails closed", async () => {
  const base = mkTemp();
  const registryRoot = path.join(base, "registry");
  const badDir = path.join(registryRoot, "expedientes");
  fs.mkdirSync(badDir, { recursive: true });
  fs.writeFileSync(path.join(badDir, "fk-bad-001.json"), "{ invalid json", "utf8");
  const { core } = createCore(registryRoot);
  await withServer(core, async (server) => {
    const readiness = await requestJson(server, {
      pathName: "/v1/factory/readiness",
      token: "ops-token",
    });
    assert.equal(readiness.statusCode, 503);

    const dashboard = await requestJson(server, {
      pathName: "/v1/factory/governance/dashboard",
      token: "ops-token",
    });
    assert.equal(dashboard.statusCode, 503);
  });
  fs.rmSync(base, { recursive: true, force: true });
});

await testAsync("13 audit append failure denies data plane", async () => {
  const base = mkTemp();
  const registryRoot = path.join(base, "registry");
  writeFixtureRecord(registryRoot);
  const { core, audit } = createCore(registryRoot);
  audit.failOnAppend = true;
  await withServer(core, async (server) => {
    const res = await requestJson(server, {
      pathName: "/v1/factory/governance/maturity",
      token: "ops-token",
    });
    assert.equal(res.statusCode, 503);
    assert.equal(res.body.error.code, "NOT_READY");
  });
  fs.rmSync(base, { recursive: true, force: true });
});

await testAsync("14 investor-like jwt token is rejected", async () => {
  const base = mkTemp();
  const { core } = createCore(path.join(base, "registry"));
  await withServer(core, async (server) => {
    const res = await requestJson(server, {
      pathName: "/v1/factory/readiness",
      token: "eyJ.fake.jwt",
    });
    assert.equal(res.statusCode, 401);
  });
  fs.rmSync(base, { recursive: true, force: true });
});

test("15 read-only source file avoids banned mutating paths", () => {
  const source = fs.readFileSync(
    path.resolve("services/factory-service-edge/factoryReadPort.js"),
    "utf8"
  );
  const banned = [
    "buildDashboard(",
    "listExpedientes(",
    "orchestrateExpediente(",
    "registerElrAct(",
    "transitionState(",
    "createExpediente(",
    "ensureDirs(",
    ".write(",
  ];
  for (const token of banned) {
    assert.equal(source.includes(token), false, `banned token present: ${token}`);
  }
});

test("16 node handler works without starting full server", () => {
  const registryRoot = path.join(mkTemp(), "registry");
  const { core } = createCore(registryRoot);
  const handler = createFactoryServiceEdgeHandler(core);
  assert.equal(typeof handler, "function");
});

await testAsync("17 regression II.2", async () => {
  runNode("src/integration/readModel/tests/runIi2ReadModelValidation.js");
});

await testAsync("18 regression I.1 observability", async () => {
  runNode("services/factory-observability/runFactoryObservability.js");
});

await testAsync("19 regression CB-01", async () => {
  runNode("src/runCb01RegistryValidation.js");
});

await testAsync("20 regression CB-15", async () => {
  runNode("src/runCb15OrchestrationValidation.js");
});

await testAsync("21 regression CB-18", async () => {
  runNode("src/factory/cb18/runCb18GovernanceValidation.js");
});

const failed = results.filter((item) => !item.ok);
console.log("\n========== P-INT-01 SLICE A SUMMARY ==========");
console.log(`Total: ${results.length}  PASS: ${results.length - failed.length}  FAIL: ${failed.length}`);
if (failed.length) {
  for (const item of failed) {
    console.log(`  FAIL — ${item.name}: ${item.error}`);
  }
  process.exitCode = 1;
} else {
  console.log("ALL SUITES PASS");
  console.log("AUTHORIZED SURFACE: READ_ONLY HTTP JSON v1");
  console.log("NOT AUTHORIZED: Web / Supabase / Snapshot / Slice B / Commit / Push");
}

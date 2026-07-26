/**
 * P-INT-04 Live — Decision Package Live Export validation runner.
 *
 * Usage:
 *   node src/runPInt04LiveDecisionPackageValidation.js
 *
 * InMemory sink only — not cloud, not Delivery, not Decision Engine, not Web/Supabase.
 */

import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { FileElrStore } from "./factory/cb01/fileElrStore.js";
import { FactoryRegistry } from "./factory/cb01/factoryRegistry.js";
import { ComplianceGateService } from "./factory/cb03/complianceGateService.js";
import { ComplianceStateStore } from "./factory/cb03/complianceStateStore.js";
import { MotorLockRegistry } from "./factory/cb03/motorLockRegistry.js";
import { MotorExecutionLock } from "./factory/cb04/motorExecutionLock.js";
import { MotorRuntime } from "./factory/cb04/motorRuntime.js";
import { FoundationKnowledgeStore } from "./factory/cb05/foundationKnowledgeStore.js";
import { FoundationLayerService } from "./factory/cb05/foundationLayerService.js";
import { EvidenceService } from "./factory/cb06/evidenceService.js";
import { EvidenceRegistryStore } from "./factory/cb06/evidenceRegistryStore.js";
import { LegitimacyKnowledgeStore } from "./factory/cb07/legitimacyKnowledgeStore.js";
import { LegitimacyLayerService } from "./factory/cb07/legitimacyLayerService.js";
import { DistressKnowledgeStore } from "./factory/cb08/distressKnowledgeStore.js";
import { DistressLayerService } from "./factory/cb08/distressLayerService.js";
import { EconomyKnowledgeStore } from "./factory/cb09/economyKnowledgeStore.js";
import { EconomyLayerService } from "./factory/cb09/economyLayerService.js";
import { EnvironmentKnowledgeStore } from "./factory/cb10/environmentKnowledgeStore.js";
import { EnvironmentLayerService } from "./factory/cb10/environmentLayerService.js";
import { LoopEngineService } from "./factory/cb11/loopEngineService.js";
import { SwarmCoordinatorService } from "./factory/cb12/swarmCoordinatorService.js";
import { IntelligenceKnowledgeStore } from "./factory/cb13/intelligenceKnowledgeStore.js";
import { IntelligenceLayerService } from "./factory/cb13/intelligenceLayerService.js";
import { AiaInvocationGateway } from "./factory/cb14/aiaInvocationGateway.js";
import { AiAssistLayerService } from "./factory/cb14/aiAssistLayerService.js";
import { OrchestrationBusService } from "./factory/cb15/orchestrationBusService.js";
import { HANDOFF_ELR_KINDS } from "./factory/cb16/decisionPackageSchema.js";
import { DecisionHandoffService } from "./factory/cb16/decisionHandoffService.js";
import {
  findLiveVersionedExportAct,
  findOfflineLocalExportAct,
} from "./factory/cb16/decisionLedger.js";
import { runCb16Validation } from "./factory/cb16/validateCb16.js";
import {
  EXPORT_MODE_LIVE_VERSIONED,
  InMemoryDecisionPackageLiveSink,
  LocalDecisionPackageExportStore,
  buildStableLiveEnvelopeBytes,
  detectOrphanLiveElrExports,
  exportLiveDecisionPackage,
  exportOfflineDecisionPackage,
  reconcilePendingLiveElrRef,
  resolveRemoteKey,
  sha256Hex,
} from "./factory/cb16/export/index.js";
import { runCb01Validation } from "./factory/cb01/validateCb01.js";
import { runCb02Validation } from "./factory/cb02/validateCb02.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = path.resolve(__dirname, "..");
const EXPORT_SRC = path.join(REPO_ROOT, "src", "factory", "cb16", "export");

const results = [];

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

function assertThrows(fn, re) {
  let threw = false;
  try {
    fn();
  } catch (e) {
    threw = true;
    if (re && !re.test(String(e.message))) {
      throw new Error(`Expected /${re}/, got: ${e.message}`);
    }
  }
  if (!threw) throw new Error("Expected throw");
}

function createTempEnv() {
  const base = fs.mkdtempSync(path.join(os.tmpdir(), "pint04-live-"));
  return {
    base,
    registryDir: path.join(base, "registry"),
    exportDir: path.join(base, "exports"),
    complianceDir: path.join(base, "compliance"),
    foundationDir: path.join(base, "foundation"),
    evidenceDir: path.join(base, "evidence"),
    legitimacyDir: path.join(base, "legitimacy"),
    distressDir: path.join(base, "distress"),
    economyDir: path.join(base, "economy"),
    environmentDir: path.join(base, "environment"),
    intelligenceDir: path.join(base, "intelligence"),
  };
}

function createStack(env) {
  const store = new FileElrStore(env.registryDir);
  const registry = new FactoryRegistry({ store });
  const compliance = new ComplianceGateService({
    registry,
    stateStore: new ComplianceStateStore(env.complianceDir),
    lockRegistry: new MotorLockRegistry(),
  });
  const foundationKnowledgeStore = new FoundationKnowledgeStore(env.foundationDir);
  const runtime = new MotorRuntime({
    registry,
    compliance,
    executionLock: new MotorExecutionLock(),
  });
  const evidence = new EvidenceService({
    registry,
    compliance,
    foundationKnowledgeStore,
    runtime,
    evidenceStore: new EvidenceRegistryStore(env.evidenceDir),
  });
  const foundation = new FoundationLayerService({
    registry,
    compliance,
    knowledgeStore: foundationKnowledgeStore,
    runtime,
  });
  const legitimacy = new LegitimacyLayerService({
    registry,
    compliance,
    knowledgeStore: new LegitimacyKnowledgeStore(env.legitimacyDir),
    evidenceService: evidence,
    runtime,
  });
  const distress = new DistressLayerService({
    registry,
    compliance,
    knowledgeStore: new DistressKnowledgeStore(env.distressDir),
    evidenceService: evidence,
    runtime,
  });
  const economy = new EconomyLayerService({
    registry,
    compliance,
    knowledgeStore: new EconomyKnowledgeStore(env.economyDir),
    evidenceService: evidence,
    runtime,
  });
  const environment = new EnvironmentLayerService({
    registry,
    compliance,
    knowledgeStore: new EnvironmentKnowledgeStore(env.environmentDir),
    evidenceService: evidence,
    runtime,
  });
  const loopEngine = new LoopEngineService({
    registry,
    compliance,
    evidenceService: evidence,
    runtime,
    foundation,
    legitimacy,
    distress,
    economy,
    environment,
  });
  const swarmCoordinator = new SwarmCoordinatorService({
    registry,
    compliance,
    evidenceService: evidence,
    loopEngine,
  });
  const intelligence = new IntelligenceLayerService({
    registry,
    compliance,
    knowledgeStore: new IntelligenceKnowledgeStore(env.intelligenceDir),
    evidenceService: evidence,
    runtime,
    foundation,
    legitimacy,
    distress,
    economy,
    environment,
    loopEngine,
    swarmCoordinator,
  });
  const gateway = new AiaInvocationGateway({ registry, compliance });
  const aiAssist = new AiAssistLayerService({
    registry,
    compliance,
    evidenceService: evidence,
    runtime,
    intelligence,
    gateway,
  });
  const bus = new OrchestrationBusService({
    registry,
    compliance,
    evidenceService: evidence,
    runtime,
    aiAssist,
    loopEngine,
    swarmCoordinator,
  });
  const handoff = new DecisionHandoffService({ registry, evidenceService: evidence });
  const exportStore = new LocalDecisionPackageExportStore(env.exportDir);
  const liveSink = new InMemoryDecisionPackageLiveSink();
  return { registry, bus, handoff, exportStore, liveSink, evidence };
}

async function readyOfflineExported(seed) {
  const env = createTempEnv();
  const stack = createStack(env);
  const orchestration = await stack.bus.orchestrateExpediente(seed, {
    candidateRef: seed,
    parcelId: `pint04live-${seed}`,
    runLoopEngine: false,
  });
  const factoryKey = orchestration.factoryKey;
  const hints = stack.handoff.resolveHints(factoryKey, {
    maturity: orchestration.maturity,
  });
  const offline = exportOfflineDecisionPackage({
    registry: stack.registry,
    factoryKey,
    exportStore: stack.exportStore,
    hints,
  });
  assert.equal(offline.ok, true);
  assert.ok(findOfflineLocalExportAct(stack.registry.getExpediente(factoryKey).elr, offline.canonicalContentChecksum));
  return { env, ...stack, factoryKey, hints, offline };
}

function runNode(scriptRel) {
  const script = path.join(REPO_ROOT, scriptRel);
  const proc = spawnSync(process.execPath, [script], {
    cwd: REPO_ROOT,
    encoding: "utf8",
  });
  if (proc.status !== 0) {
    throw new Error(`${scriptRel} exit ${proc.status}\n${proc.stdout}\n${proc.stderr}`);
  }
}

// ---------------------------------------------------------------------------
// Suites
// ---------------------------------------------------------------------------

await testAsync("01 port contract putIfAbsent/get/verify/head", async () => {
  const sink = new InMemoryDecisionPackageLiveSink();
  const key = "live/v1/fk/dpkg-fk-abc.envelope.json";
  // use real key pattern with valid factory key from ready path — synthetic bytes test:
  const ctx = await readyOfflineExported("live-port");
  const built = buildStableLiveEnvelopeBytes(
    ctx.exportStore.verifyIntegrity(ctx.factoryKey, ctx.offline.packageId)
  );
  const remoteKey = resolveRemoteKey(ctx.factoryKey, ctx.offline.packageId);
  assert.equal(sink.head(remoteKey).exists, false);
  const meta = {
    packageId: ctx.offline.packageId,
    factory_key: ctx.factoryKey,
    canonicalContentChecksum: ctx.offline.canonicalContentChecksum,
    contentSha256: built.contentSha256,
    exportMode: EXPORT_MODE_LIVE_VERSIONED,
    exportSchemaVersion: 1,
    remoteRef: `live://${remoteKey}`,
  };
  const put = sink.putIfAbsent(remoteKey, built.bytes, meta);
  assert.equal(put.written, true);
  assert.equal(sink.get(remoteKey), built.bytes);
  sink.verify(remoteKey, {
    contentSha256: built.contentSha256,
    canonicalContentChecksum: ctx.offline.canonicalContentChecksum,
    packageId: ctx.offline.packageId,
    factory_key: ctx.factoryKey,
    exportMode: EXPORT_MODE_LIVE_VERSIONED,
    exportSchemaVersion: 1,
  });
  const put2 = sink.putIfAbsent(remoteKey, built.bytes, meta);
  assert.equal(put2.written, false);
  fs.rmSync(ctx.env.base, { recursive: true, force: true });
});

await testAsync("02 happy path offline→live→ELR SUCCESS", async () => {
  const ctx = await readyOfflineExported("live-happy");
  const live = exportLiveDecisionPackage({
    registry: ctx.registry,
    factoryKey: ctx.factoryKey,
    packageId: ctx.offline.packageId,
    exportStore: ctx.exportStore,
    liveSink: ctx.liveSink,
    hints: ctx.hints,
  });
  assert.equal(live.ok, true);
  assert.equal(live.status, "SUCCESS");
  assert.equal(live.exportMode, EXPORT_MODE_LIVE_VERSIONED);
  assert.equal(HANDOFF_ELR_KINDS.LIVE_VERSIONED_EXPORT, "DHI_LIVE_VERSIONED_EXPORT");
  const act = findLiveVersionedExportAct(
    ctx.registry.getExpediente(ctx.factoryKey).elr,
    live.canonicalContentChecksum
  );
  assert.ok(act);
  assert.equal(act.kind, "DHI_LIVE_VERSIONED_EXPORT");
  assert.equal(act.remoteRef, live.remoteRef);
  assert.ok(!("relativeRef" in act));
  assert.ok(live.locator.remoteRef);
  assert.equal(live.locator.exportMode, EXPORT_MODE_LIVE_VERSIONED);
  fs.rmSync(ctx.env.base, { recursive: true, force: true });
});

await testAsync("03 remote verify mismatch fail-closed", async () => {
  const ctx = await readyOfflineExported("live-verify");
  const live = exportLiveDecisionPackage({
    registry: ctx.registry,
    factoryKey: ctx.factoryKey,
    packageId: ctx.offline.packageId,
    exportStore: ctx.exportStore,
    liveSink: ctx.liveSink,
    hints: ctx.hints,
  });
  assertThrows(
    () =>
      ctx.liveSink.verify(live.remoteKey, {
        contentSha256: "0".repeat(64),
        canonicalContentChecksum: live.canonicalContentChecksum,
        packageId: live.packageId,
        factory_key: ctx.factoryKey,
        exportMode: EXPORT_MODE_LIVE_VERSIONED,
        exportSchemaVersion: 1,
      }),
    /mismatch|fail-closed/i
  );
  fs.rmSync(ctx.env.base, { recursive: true, force: true });
});

await testAsync("04–05 idempotency + conflict same key", async () => {
  const ctx = await readyOfflineExported("live-idemp");
  const r1 = exportLiveDecisionPackage({
    registry: ctx.registry,
    factoryKey: ctx.factoryKey,
    packageId: ctx.offline.packageId,
    exportStore: ctx.exportStore,
    liveSink: ctx.liveSink,
    hints: ctx.hints,
  });
  const r2 = exportLiveDecisionPackage({
    registry: ctx.registry,
    factoryKey: ctx.factoryKey,
    packageId: ctx.offline.packageId,
    exportStore: ctx.exportStore,
    liveSink: ctx.liveSink,
    hints: ctx.hints,
  });
  assert.equal(r1.packageId, r2.packageId);
  assert.equal(r1.contentSha256, r2.contentSha256);
  const acts = ctx.registry
    .getExpediente(ctx.factoryKey)
    .elr.decision_handoffs.filter(
      (h) =>
        h.kind === HANDOFF_ELR_KINDS.LIVE_VERSIONED_EXPORT &&
        h.canonicalContentChecksum === r1.canonicalContentChecksum
    );
  assert.equal(acts.length, 1);

  const built = buildStableLiveEnvelopeBytes(
    ctx.exportStore.verifyIntegrity(ctx.factoryKey, ctx.offline.packageId)
  );
  const evil = built.bytes.replace("LIVE_VERSIONED", "OFFLINE_LOCAL");
  assertThrows(
    () =>
      ctx.liveSink.putIfAbsent(r1.remoteKey, evil, {
        packageId: r1.packageId,
        factory_key: ctx.factoryKey,
        canonicalContentChecksum: r1.canonicalContentChecksum,
        contentSha256: sha256Hex(evil),
        exportMode: EXPORT_MODE_LIVE_VERSIONED,
        exportSchemaVersion: 1,
        remoteRef: r1.remoteRef,
      }),
    /CONFLICT|mismatch/i
  );
  fs.rmSync(ctx.env.base, { recursive: true, force: true });
});

await testAsync("06–07 retry stable bytes + offline prerequisite", async () => {
  const ctx = await readyOfflineExported("live-retry");
  const a = buildStableLiveEnvelopeBytes(
    ctx.exportStore.verifyIntegrity(ctx.factoryKey, ctx.offline.packageId)
  );
  const b = buildStableLiveEnvelopeBytes(
    ctx.exportStore.verifyIntegrity(ctx.factoryKey, ctx.offline.packageId)
  );
  assert.equal(a.bytes, b.bytes);
  assert.equal(a.contentSha256, b.contentSha256);

  const env2 = createTempEnv();
  const stack2 = createStack(env2);
  const orch = await stack2.bus.orchestrateExpediente("live-nopre", {
    candidateRef: "live-nopre",
    parcelId: "pint04live-nopre",
    runLoopEngine: false,
  });
  const hints = stack2.handoff.resolveHints(orch.factoryKey, {
    maturity: orch.maturity,
  });
  const missing = exportLiveDecisionPackage({
    registry: stack2.registry,
    factoryKey: orch.factoryKey,
    packageId: "dpkg-missing-" + "a".repeat(64),
    exportStore: stack2.exportStore,
    liveSink: stack2.liveSink,
    hints,
  });
  assert.equal(missing.ok, false);
  assert.equal(missing.status, "OFFLINE_PREREQUISITE_MISSING");
  fs.rmSync(ctx.env.base, { recursive: true, force: true });
  fs.rmSync(env2.base, { recursive: true, force: true });
});

await testAsync("08–09 orphan remote reconcile + orphan ELR", async () => {
  const ctx = await readyOfflineExported("live-orphan");
  const pendingSink = new InMemoryDecisionPackageLiveSink();
  const orig = ctx.registry.registerElrAct.bind(ctx.registry);
  ctx.registry.registerElrAct = (...args) => {
    if (args[2]?.kind === HANDOFF_ELR_KINDS.LIVE_VERSIONED_EXPORT) {
      throw new Error("simulated ELR failure");
    }
    return orig(...args);
  };
  const pending = exportLiveDecisionPackage({
    registry: ctx.registry,
    factoryKey: ctx.factoryKey,
    packageId: ctx.offline.packageId,
    exportStore: ctx.exportStore,
    liveSink: pendingSink,
    hints: ctx.hints,
  });
  assert.equal(pending.ok, false);
  assert.equal(pending.status, "REMOTE_OK_ELR_PENDING");
  assert.ok(pendingSink.exists(pending.remoteKey));
  ctx.registry.registerElrAct = orig;
  const reconciled = reconcilePendingLiveElrRef({
    registry: ctx.registry,
    factoryKey: ctx.factoryKey,
    packageId: pending.packageId,
    liveSink: pendingSink,
  });
  assert.equal(reconciled.ok, true);

  ctx.registry.registerElrAct(
    ctx.factoryKey,
    "decision_handoffs",
    {
      kind: "DHI_LIVE_VERSIONED_EXPORT",
      packageId: "dpkg-ghost-" + "b".repeat(64),
      canonicalContentChecksum: "b".repeat(64),
      remoteKey: "live/v1/ghost/missing.json",
      exportMode: "LIVE_VERSIONED",
    },
    { actor: "MOT-SYN-02" }
  );
  const orphans = detectOrphanLiveElrExports({
    registry: ctx.registry,
    factoryKey: ctx.factoryKey,
    liveSink: pendingSink,
  });
  assert.equal(orphans.failClosed, true);
  fs.rmSync(ctx.env.base, { recursive: true, force: true });
});

test("10–13 authz + allowlist + unknown meta + no Delivery kinds", () => {
  const sink = new InMemoryDecisionPackageLiveSink({ principal: "FactoryOps" });
  assertThrows(
    () => sink.head("live/v1/x/y.json", { principal: "anonymous" }),
    /AUTHZ_FAIL|anonymous/i
  );
  assertThrows(
    () => sink.head("https://evil.example/obj"),
    /allowlist|denied|URL|Destination/i
  );
  assertThrows(
    () =>
      sink.putIfAbsent(
        "live/v1/fk/x.json",
        "{}\n",
        {
          packageId: "x",
          factory_key: "fk",
          canonicalContentChecksum: "a".repeat(64),
          contentSha256: sha256Hex("{}\n"),
          exportMode: EXPORT_MODE_LIVE_VERSIONED,
          exportSchemaVersion: 1,
          remoteRef: "live://live/v1/fk/x.json",
          evil: true,
        }
      ),
    /Unknown put meta/
  );
  assert.equal(HANDOFF_ELR_KINDS.LIVE_VERSIONED_EXPORT, "DHI_LIVE_VERSIONED_EXPORT");
  assert.notEqual(HANDOFF_ELR_KINDS.LIVE_VERSIONED_EXPORT, HANDOFF_ELR_KINDS.DELIVERED);
  assert.notEqual(
    HANDOFF_ELR_KINDS.LIVE_VERSIONED_EXPORT,
    HANDOFF_ELR_KINDS.OFFLINE_LOCAL_EXPORT
  );
});

await testAsync("14 stable generatedAt across live builds", async () => {
  const ctx = await readyOfflineExported("live-gen");
  const e0 = ctx.exportStore.verifyIntegrity(ctx.factoryKey, ctx.offline.packageId);
  const live = exportLiveDecisionPackage({
    registry: ctx.registry,
    factoryKey: ctx.factoryKey,
    packageId: ctx.offline.packageId,
    exportStore: ctx.exportStore,
    liveSink: ctx.liveSink,
    hints: ctx.hints,
  });
  const remote = JSON.parse(ctx.liveSink.get(live.remoteKey));
  assert.equal(remote.generatedAt, e0.generatedAt);
  assert.equal(remote.exportMode, EXPORT_MODE_LIVE_VERSIONED);
  assert.equal(e0.exportMode, "OFFLINE_LOCAL");
  fs.rmSync(ctx.env.base, { recursive: true, force: true });
});

test("15 static audit live modules", () => {
  const files = fs
    .readdirSync(EXPORT_SRC)
    .filter((f) => f.endsWith(".js") && /[Ll]ive/.test(f));
  const needles = [
    ["supra", "base"].join(""),
    ["sql", "ite"].join(""),
    ["better-", "sql", "ite", "3"].join(""),
    ["create", "Client"].join(""),
    "@aws-sdk",
    "amazonaws",
    "azure",
    "@google-cloud",
  ];
  for (const f of files) {
    const src = fs.readFileSync(path.join(EXPORT_SRC, f), "utf8");
    for (const line of src.split(/\r?\n/)) {
      if (/NOT AUTHORIZED|prohib|OFFLINE|fail-closed|FORBIDDEN|join\(/i.test(line)) {
        continue;
      }
      for (const n of needles) {
        if (line.toLowerCase().includes(n.toLowerCase())) {
          throw new Error(`Banned ${n} in ${f}: ${line.trim()}`);
        }
      }
    }
  }
  const pkg = JSON.parse(fs.readFileSync(path.join(REPO_ROOT, "package.json"), "utf8"));
  const deps = { ...(pkg.dependencies ?? {}), ...(pkg.devDependencies ?? {}) };
  assert.ok(!deps["@aws-sdk/client-s3"]);
});

await testAsync("16 regress CB-01", async () => {
  const r = runCb01Validation({});
  assert.equal(r.passed, true, r.errors?.join("; "));
});

await testAsync("17 regress CB-02", async () => {
  const r = runCb02Validation({});
  assert.equal(r.passed, true, r.errors?.join("; "));
});

await testAsync("18 regress CB-16", async () => {
  const r = await runCb16Validation({});
  assert.equal(r.passed, true, r.errors?.join("; "));
});

await testAsync("19 regress P-INT-04 Offline", async () => {
  runNode("src/runPInt04OfflineDecisionPackageValidation.js");
});

await testAsync("20 regress P-INT-03 Offline", async () => {
  runNode("src/runPInt03ElrPersistenceValidation.js");
});

await testAsync("21 regress II.2 Read Model", async () => {
  runNode("src/integration/readModel/tests/runIi2ReadModelValidation.js");
});

const failed = results.filter((r) => !r.ok);
console.log("\n========== P-INT-04 LIVE SUMMARY ==========");
console.log(
  `Total: ${results.length}  PASS: ${results.length - failed.length}  FAIL: ${failed.length}`
);
if (failed.length) {
  for (const f of failed) console.log(`  FAIL — ${f.name}: ${f.error}`);
  process.exitCode = 1;
} else {
  console.log("ALL SUITES PASS");
  console.log("KIND: DHI_LIVE_VERSIONED_EXPORT");
  console.log("MODE: LIVE_VERSIONED");
  console.log("SINK: InMemoryDecisionPackageLiveSink");
  console.log("DecisionEngine/Delivery/Web/Supabase/II.7/P-INT-05: NOT AUTHORIZED");
}

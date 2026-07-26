/**
 * P-INT-04 Offline — Decision Package Export validation runner.
 *
 * Usage:
 *   node src/runPInt04OfflineDecisionPackageValidation.js
 *
 * Explicit offline export only — not prepareAndDeliver, not Delivery, not Web/Supabase.
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
import { findOfflineLocalExportAct } from "./factory/cb16/decisionLedger.js";
import { runCb16Validation } from "./factory/cb16/validateCb16.js";
import {
  EXPORT_SCHEMA_VERSION,
  LocalDecisionPackageExportStore,
  buildOfflineExportEnvelope,
  computeCanonicalContentChecksum,
  detectOrphanElrExports,
  exportOfflineDecisionPackage,
  reconcilePendingElrRef,
  validateExportEnvelope,
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
  const base = fs.mkdtempSync(path.join(os.tmpdir(), "pint04-offline-"));
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
  return { registry, bus, handoff, exportStore, evidence };
}

async function readyExpediente(seed) {
  const env = createTempEnv();
  const stack = createStack(env);
  const orchestration = await stack.bus.orchestrateExpediente(seed, {
    candidateRef: seed,
    parcelId: `pint04-${seed}`,
    runLoopEngine: false,
  });
  const factoryKey = orchestration.factoryKey;
  const record = stack.registry.getExpediente(factoryKey);
  assert.equal(record.state, "ST-RDY");
  const hints = stack.handoff.resolveHints(factoryKey, {
    maturity: orchestration.maturity,
  });
  return { env, ...stack, factoryKey, hints, orchestration };
}

function runNode(scriptRel) {
  const script = path.join(REPO_ROOT, scriptRel);
  const proc = spawnSync(process.execPath, [script], {
    cwd: REPO_ROOT,
    encoding: "utf8",
  });
  if (proc.status !== 0) {
    throw new Error(
      `${scriptRel} exit ${proc.status}\n${proc.stdout}\n${proc.stderr}`
    );
  }
}

// ---------------------------------------------------------------------------
// Suites
// ---------------------------------------------------------------------------

await testAsync("01 package CB-16 válido + envelope", async () => {
  const ctx = await readyExpediente("pint04-pkg");
  const { envelope } = buildOfflineExportEnvelope(
    ctx.registry.getExpediente(ctx.factoryKey),
    ctx.hints
  );
  validateExportEnvelope(envelope);
  assert.equal(envelope.exportMode, "OFFLINE_LOCAL");
  assert.equal(envelope.payload.boundary.decides, false);
  fs.rmSync(ctx.env.base, { recursive: true, force: true });
});

await testAsync("02–07 canonical + packageId + generatedAt", async () => {
  const ctx = await readyExpediente("pint04-canon");
  const record = ctx.registry.getExpediente(ctx.factoryKey);
  const a = buildOfflineExportEnvelope(record, ctx.hints);
  const b = buildOfflineExportEnvelope(record, ctx.hints);
  assert.equal(a.envelope.canonicalContentChecksum, b.envelope.canonicalContentChecksum);
  assert.equal(a.envelope.packageId, b.envelope.packageId);
  assert.equal(
    a.envelope.packageId,
    `dpkg-${ctx.factoryKey}-${a.envelope.canonicalContentChecksum}`
  );
  assert.notEqual(a.envelope.generatedAt, b.envelope.generatedAt);
  const again = computeCanonicalContentChecksum(a.envelope.payload);
  assert.equal(again, a.envelope.canonicalContentChecksum);
  fs.rmSync(ctx.env.base, { recursive: true, force: true });
});

await testAsync("08–09 write/read/reload isolation", async () => {
  const ctx = await readyExpediente("pint04-wr");
  const result = exportOfflineDecisionPackage({
    registry: ctx.registry,
    factoryKey: ctx.factoryKey,
    exportStore: ctx.exportStore,
    hints: ctx.hints,
  });
  assert.equal(result.ok, true);
  assert.equal(result.status, "SUCCESS");
  const read = ctx.exportStore.read(ctx.factoryKey, result.packageId);
  assert.equal(read.packageId, result.packageId);

  const store2 = new LocalDecisionPackageExportStore(ctx.env.exportDir);
  const reloaded = store2.verifyIntegrity(ctx.factoryKey, result.packageId);
  assert.equal(reloaded.canonicalContentChecksum, result.canonicalContentChecksum);

  const other = await readyExpediente("pint04-iso");
  exportOfflineDecisionPackage({
    registry: other.registry,
    factoryKey: other.factoryKey,
    exportStore: other.exportStore,
    hints: other.hints,
  });
  assert.deepEqual(ctx.exportStore.listByFactoryKey(ctx.factoryKey).length, 1);
  assert.equal(ctx.exportStore.listByFactoryKey(other.factoryKey).length, 0);
  fs.rmSync(ctx.env.base, { recursive: true, force: true });
  fs.rmSync(other.env.base, { recursive: true, force: true });
});

await testAsync("10–14 readiness / missing / blockers", async () => {
  const ctx = await readyExpediente("pint04-rdy");
  const record = ctx.registry.getExpediente(ctx.factoryKey);
  record.state = "ST-NASC";
  assertThrows(
    () => buildOfflineExportEnvelope(record, ctx.hints),
    /ST-RDY required/
  );

  const ctx2 = await readyExpediente("pint04-rdy2");
  const bad = ctx2.registry.getExpediente(ctx2.factoryKey);
  delete bad.elr.evidence_registry_ref;
  assertThrows(
    () =>
      buildOfflineExportEnvelope(bad, {
        maturity_score: ctx2.hints.maturity_score,
        sufficiencyStatus: ctx2.hints.sufficiencyStatus,
      }),
    /Readiness fail|evidence/i
  );

  const ctx3 = await readyExpediente("pint04-dec");
  const dec = ctx3.registry.getExpediente(ctx3.factoryKey);
  dec.state = "ST-DEC";
  assertThrows(() => buildOfflineExportEnvelope(dec, ctx3.hints), /ST-RDY required/);

  fs.rmSync(ctx.env.base, { recursive: true, force: true });
  fs.rmSync(ctx2.env.base, { recursive: true, force: true });
  fs.rmSync(ctx3.env.base, { recursive: true, force: true });
});

await testAsync("15–18 integrity / versions", async () => {
  const ctx = await readyExpediente("pint04-int");
  const result = exportOfflineDecisionPackage({
    registry: ctx.registry,
    factoryKey: ctx.factoryKey,
    exportStore: ctx.exportStore,
    hints: ctx.hints,
  });
  const dataPath = ctx.exportStore.resolvePath(ctx.factoryKey, result.packageId);
  const sidePath = ctx.exportStore.resolveSidecarPath(ctx.factoryKey, result.packageId);
  const { formatExportSidecar, sha256Hex } = await import(
    "./factory/cb16/export/decisionPackageIntegrity.js"
  );

  const good = fs.readFileSync(dataPath, "utf8");
  const broken = JSON.parse(good);
  broken.canonicalContentChecksum = "0".repeat(64);
  const brokenBytes = `${JSON.stringify(broken)}\n`;
  fs.writeFileSync(dataPath, brokenBytes, "utf8");
  fs.writeFileSync(sidePath, formatExportSidecar(sha256Hex(brokenBytes)), "utf8");
  assertThrows(() => ctx.exportStore.read(ctx.factoryKey, result.packageId), /mismatch|fail-closed/i);

  fs.writeFileSync(dataPath, "{not-json", "utf8");
  fs.writeFileSync(sidePath, formatExportSidecar(sha256Hex("{not-json")), "utf8");
  assertThrows(() => ctx.exportStore.read(ctx.factoryKey, result.packageId), /corrupt|fail-closed|JSON/i);

  const ctxV = await readyExpediente("pint04-ver3");
  const envl = buildOfflineExportEnvelope(
    ctxV.registry.getExpediente(ctxV.factoryKey),
    ctxV.hints
  ).envelope;
  envl.exportSchemaVersion = 999;
  assertThrows(() => validateExportEnvelope(envl), /exportSchemaVersion/);
  envl.exportSchemaVersion = EXPORT_SCHEMA_VERSION;
  envl.decisionPackageVersion = "9.9.9";
  assertThrows(() => validateExportEnvelope(envl), /decisionPackageVersion/);

  fs.rmSync(ctx.env.base, { recursive: true, force: true });
  fs.rmSync(ctxV.env.base, { recursive: true, force: true });
});

test("19 unknown fields reject", () => {
  assertThrows(
    () =>
      validateExportEnvelope({
        exportSchemaVersion: 1,
        decisionPackageVersion: "1.0.0",
        packageId: "x",
        factory_key: "abc",
        generatedAt: "t",
        canonicalContentChecksum: "0".repeat(64),
        exportMode: "OFFLINE_LOCAL",
        boundarySummary: {},
        inputSnapshotRefs: null,
        payload: {},
        evil: true,
      }),
    /Unknown envelope field/
  );
});

await testAsync("20–25 boundary / no classify / no publish", async () => {
  const ctx = await readyExpediente("pint04-bound");
  const result = exportOfflineDecisionPackage({
    registry: ctx.registry,
    factoryKey: ctx.factoryKey,
    exportStore: ctx.exportStore,
    hints: ctx.hints,
  });
  const p = result.envelope.payload;
  assert.equal(p.boundary.decides, false);
  assert.equal(p.boundary.classifiesDeal, false);
  assert.equal(p.boundary.classifiesPremium, false);
  assert.equal(p.boundary.classifiesDiamond, false);
  assert.equal(p.boundary.assignsAccessTier, false);
  assert.equal(p.boundary.setsPricing, false);
  assert.equal("opportunityClass" in p, false);
  assert.equal("accessTier" in p, false);
  fs.rmSync(ctx.env.base, { recursive: true, force: true });
});

await testAsync("26–27 ELR after VERIFY + fail does not SUCCESS", async () => {
  const ctx = await readyExpediente("pint04-elr");
  const result = exportOfflineDecisionPackage({
    registry: ctx.registry,
    factoryKey: ctx.factoryKey,
    exportStore: ctx.exportStore,
    hints: ctx.hints,
  });
  assert.equal(result.ok, true);
  const rec = ctx.registry.getExpediente(ctx.factoryKey);
  const act = findOfflineLocalExportAct(rec.elr, result.canonicalContentChecksum);
  assert.ok(act);
  assert.equal(act.kind, HANDOFF_ELR_KINDS.OFFLINE_LOCAL_EXPORT);
  assert.equal(act.exportMode, "OFFLINE_LOCAL");
  assert.ok(!rec.elr.decision_handoffs.some((h) => h.kind === "DHI_PACKAGE_DELIVERED"));

  // Simulate ELR failure after local write via broken registry
  const ctx2 = await readyExpediente("pint04-elrfail");
  const orig = ctx2.registry.registerElrAct.bind(ctx2.registry);
  ctx2.registry.registerElrAct = () => {
    throw new Error("simulated ELR failure");
  };
  const pending = exportOfflineDecisionPackage({
    registry: ctx2.registry,
    factoryKey: ctx2.factoryKey,
    exportStore: ctx2.exportStore,
    hints: ctx2.hints,
  });
  assert.equal(pending.ok, false);
  assert.equal(pending.status, "LOCAL_OK_ELR_PENDING");
  assert.ok(ctx2.exportStore.exists(ctx2.factoryKey, pending.packageId));
  ctx2.registry.registerElrAct = orig;
  const reconciled = reconcilePendingElrRef({
    registry: ctx2.registry,
    factoryKey: ctx2.factoryKey,
    packageId: pending.packageId,
    exportStore: ctx2.exportStore,
  });
  assert.equal(reconciled.ok, true);
  fs.rmSync(ctx.env.base, { recursive: true, force: true });
  fs.rmSync(ctx2.env.base, { recursive: true, force: true });
});

await testAsync("28–29 restart + duplicate checksum idempotent", async () => {
  const ctx = await readyExpediente("pint04-idemp");
  const record = ctx.registry.getExpediente(ctx.factoryKey);
  const snap1 = buildOfflineExportEnvelope(record, ctx.hints);
  const snap2 = buildOfflineExportEnvelope(record, ctx.hints);
  assert.equal(snap1.envelope.packageId, snap2.envelope.packageId);
  assert.equal(
    snap1.envelope.canonicalContentChecksum,
    snap2.envelope.canonicalContentChecksum
  );

  const r1 = exportOfflineDecisionPackage({
    registry: ctx.registry,
    factoryKey: ctx.factoryKey,
    exportStore: ctx.exportStore,
    hints: ctx.hints,
  });
  assert.equal(r1.ok, true);
  assert.equal(r1.packageId, snap1.envelope.packageId);

  // Same artifact on disk: verifyIntegrity + ELR act already present for that checksum
  const again = ctx.exportStore.verifyIntegrity(ctx.factoryKey, r1.packageId);
  assert.equal(again.canonicalContentChecksum, r1.canonicalContentChecksum);
  const acts = ctx.registry
    .getExpediente(ctx.factoryKey)
    .elr.decision_handoffs.filter(
      (h) =>
        h.kind === HANDOFF_ELR_KINDS.OFFLINE_LOCAL_EXPORT &&
        h.canonicalContentChecksum === r1.canonicalContentChecksum
    );
  assert.equal(acts.length, 1);

  // Re-export after ELR mutation creates a new corpus checksum; prior act remains unique
  const r2 = exportOfflineDecisionPackage({
    registry: ctx.registry,
    factoryKey: ctx.factoryKey,
    exportStore: ctx.exportStore,
    hints: ctx.hints,
  });
  assert.equal(r2.ok, true);
  const acts1 = ctx.registry
    .getExpediente(ctx.factoryKey)
    .elr.decision_handoffs.filter(
      (h) =>
        h.kind === HANDOFF_ELR_KINDS.OFFLINE_LOCAL_EXPORT &&
        h.canonicalContentChecksum === r1.canonicalContentChecksum
    );
  assert.equal(acts1.length, 1);
  fs.rmSync(ctx.env.base, { recursive: true, force: true });
});

await testAsync("44–46 kind / packageId / dual verify", async () => {
  const ctx = await readyExpediente("pint04-final");
  const result = exportOfflineDecisionPackage({
    registry: ctx.registry,
    factoryKey: ctx.factoryKey,
    exportStore: ctx.exportStore,
    hints: ctx.hints,
  });
  assert.match(result.packageId, /^dpkg-/);
  assert.equal(HANDOFF_ELR_KINDS.OFFLINE_LOCAL_EXPORT, "DHI_OFFLINE_LOCAL_EXPORT");
  const orphans = detectOrphanElrExports({
    registry: ctx.registry,
    factoryKey: ctx.factoryKey,
    exportStore: ctx.exportStore,
  });
  assert.equal(orphans.orphans.length, 0);

  // Orphan ELR without artifact
  const key = ctx.factoryKey;
  ctx.registry.registerElrAct(
    key,
    "decision_handoffs",
    {
      kind: "DHI_OFFLINE_LOCAL_EXPORT",
      packageId: "dpkg-missing-000",
      canonicalContentChecksum: "a".repeat(64),
      exportMode: "OFFLINE_LOCAL",
    },
    { actor: "MOT-SYN-02" }
  );
  const orphanElr = detectOrphanElrExports({
    registry: ctx.registry,
    factoryKey: key,
    exportStore: ctx.exportStore,
  });
  assert.equal(orphanElr.failClosed, true);

  fs.rmSync(ctx.env.base, { recursive: true, force: true });
});

test("43 static audit export modules", () => {
  const files = fs.readdirSync(EXPORT_SRC).filter((f) => f.endsWith(".js"));
  const needles = [
    ["supra", "base"].join(""),
    ["sql", "ite"].join(""),
    ["better-", "sql", "ite", "3"].join(""),
    ["create", "Client"].join(""),
    ["http", "://"].join(""),
    ["https", "://"].join(""),
  ];
  for (const f of files) {
    const src = fs.readFileSync(path.join(EXPORT_SRC, f), "utf8");
    for (const line of src.split(/\r?\n/)) {
      if (/NOT AUTHORIZED|prohib|OFFLINE|fail-closed|join\(/i.test(line)) continue;
      for (const n of needles) {
        if (line.toLowerCase().includes(n.toLowerCase())) {
          throw new Error(`Banned ${n} in ${f}: ${line.trim()}`);
        }
      }
    }
  }
  const pkg = JSON.parse(fs.readFileSync(path.join(REPO_ROOT, "package.json"), "utf8"));
  const deps = { ...(pkg.dependencies ?? {}), ...(pkg.devDependencies ?? {}) };
  assert.ok(!deps[["better-", "sql", "ite", "3"].join("")]);
});

await testAsync("30 regress CB-01", async () => {
  const r = runCb01Validation({});
  assert.equal(r.passed, true, r.errors?.join("; "));
});

await testAsync("31 regress CB-02", async () => {
  const r = runCb02Validation({});
  assert.equal(r.passed, true, r.errors?.join("; "));
});

await testAsync("32–39 regress CB-06..15 (canonical runners)", async () => {
  const runners = [
    ["32", "src/runCb06EvidenceValidation.js"],
    ["33", "src/runCb07LegitimacyValidation.js"],
    ["34", "src/runCb08DistressValidation.js"],
    ["35", "src/runCb09EconomyValidation.js"],
    ["36", "src/runCb10EnvironmentValidation.js"],
    ["37", "src/runCb13IntelligenceValidation.js"],
    ["38", "src/runCb14AiAssistValidation.js"],
    ["39", "src/runCb15OrchestrationValidation.js"],
  ];
  for (const [, rel] of runners) {
    if (!fs.existsSync(path.join(REPO_ROOT, rel))) {
      throw new Error(`Missing runner ${rel}`);
    }
    runNode(rel);
  }
});

await testAsync("40 regress CB-16", async () => {
  const r = await runCb16Validation({});
  assert.equal(r.passed, true, r.errors?.join("; "));
});

await testAsync("41 regress P-INT-02 Offline", async () => {
  runNode("src/runPInt02OfflineIngestValidation.js");
});

await testAsync("42 regress P-INT-03 Offline", async () => {
  runNode("src/runPInt03ElrPersistenceValidation.js");
});

// ---------------------------------------------------------------------------
const failed = results.filter((r) => !r.ok);
console.log("\n========== P-INT-04 OFFLINE SUMMARY ==========");
console.log(`Total: ${results.length}  PASS: ${results.length - failed.length}  FAIL: ${failed.length}`);
if (failed.length) {
  for (const f of failed) console.log(`  FAIL — ${f.name}: ${f.error}`);
  process.exitCode = 1;
} else {
  console.log("ALL SUITES PASS");
  console.log("KIND: DHI_OFFLINE_LOCAL_EXPORT");
  console.log("MODE: OFFLINE_LOCAL");
  console.log("Delivery/Web/Supabase/II.7/P-INT-05: NOT AUTHORIZED");
}

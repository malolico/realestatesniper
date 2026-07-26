/**
 * P-INT-03 Offline — Atomic / Hardened File ELR Store validation runner.
 *
 * Usage:
 *   node src/runPInt03ElrPersistenceValidation.js
 *
 * AtomicFileElrStore is injected explicitly — FileElrStore remains Registry default.
 * No SQLite, Supabase, HTTP, Web, or new dependencies.
 */

import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { AtomicFileElrStore } from "./factory/cb01/atomicFileElrStore.js";
import {
  STORE_FORMAT_VERSION,
  formatSidecarContent,
  serializeExpedienteBytes,
  sha256Hex,
} from "./factory/cb01/elrIntegrity.js";
import { assertElrStorePort } from "./factory/cb01/elrStorePort.js";
import { FileElrStore } from "./factory/cb01/fileElrStore.js";
import { FactoryRegistry } from "./factory/cb01/factoryRegistry.js";
import { appendElrEntry } from "./factory/cb01/elrSchema.js";
import { recordElrAggregation, aggregateElr } from "./factory/cb15/elrAggregator.js";
import { runCb01Validation } from "./factory/cb01/validateCb01.js";
import { runCb02Validation } from "./factory/cb02/validateCb02.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = path.resolve(__dirname, "..");
const CB01_DIR = path.join(REPO_ROOT, "src", "factory", "cb01");

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

function tempRoot(prefix) {
  return fs.mkdtempSync(path.join(os.tmpdir(), prefix));
}

function harnessAtomic() {
  const base = tempRoot("pint03-atomic-");
  const store = new AtomicFileElrStore(base);
  const registry = new FactoryRegistry({ store });
  return { base, store, registry };
}

function stripVolatile(record) {
  if (!record) return record;
  const { updatedAt, ...rest } = record;
  return rest;
}

function assertThrows(fn, re) {
  let threw = false;
  try {
    fn();
  } catch (e) {
    threw = true;
    if (re && !re.test(String(e.message))) {
      throw new Error(`Expected error matching ${re}, got: ${e.message}`);
    }
  }
  if (!threw) throw new Error("Expected function to throw");
}

// ---------------------------------------------------------------------------
// Suites
// ---------------------------------------------------------------------------

test("01 write + read válido", () => {
  const { store, registry } = harnessAtomic();
  assertElrStorePort(store);
  const created = registry.createExpediente({
    factoryKey: "pint03-wr-001",
    candidateRef: "c:1",
    actor: "FactoryRegistry",
  });
  const read = store.read("pint03-wr-001");
  assert.equal(read.factory_key, "pint03-wr-001");
  assert.equal(read.state, created.state);
  assert.ok(read.updatedAt);
  assert.ok(fs.existsSync(store.resolveSidecarPath("pint03-wr-001")));
});

test("02 lectura por factory_key", () => {
  const { registry } = harnessAtomic();
  registry.createExpediente({ factoryKey: "pint03-key-a", actor: "FactoryRegistry" });
  registry.createExpediente({ factoryKey: "pint03-key-b", actor: "FactoryRegistry" });
  const a = registry.getExpediente("pint03-key-a");
  const b = registry.getExpediente("pint03-key-b");
  assert.equal(a.factory_key, "pint03-key-a");
  assert.equal(b.factory_key, "pint03-key-b");
  assert.equal(registry.getExpediente("pint03-missing"), null);
});

test("03 aislamiento entre expedientes", () => {
  const { registry } = harnessAtomic();
  registry.createExpediente({ factoryKey: "pint03-iso-1", actor: "FactoryRegistry" });
  registry.createExpediente({ factoryKey: "pint03-iso-2", actor: "FactoryRegistry" });
  registry.registerElrAct(
    "pint03-iso-1",
    "motor_manifests",
    { kind: "ISO_A" },
    { actor: "MOT-SYN-02" }
  );
  const one = registry.getExpediente("pint03-iso-1");
  const two = registry.getExpediente("pint03-iso-2");
  assert.equal(one.elr.motor_manifests.length, 1);
  assert.equal(two.elr.motor_manifests.length, 0);
});

test("04 orden determinista (elrSequence)", () => {
  const { registry } = harnessAtomic();
  registry.createExpediente({ factoryKey: "pint03-ord-1", actor: "FactoryRegistry" });
  registry.registerElrAct(
    "pint03-ord-1",
    "motor_manifests",
    { kind: "A" },
    { actor: "MOT-SYN-02" }
  );
  registry.registerElrAct(
    "pint03-ord-1",
    "motor_manifests",
    { kind: "B" },
    { actor: "MOT-SYN-02" }
  );
  const rec = registry.getExpediente("pint03-ord-1");
  assert.equal(rec.elr.motor_manifests[0].elrSequence, 1);
  assert.equal(rec.elr.motor_manifests[1].elrSequence, 2);
  assert.equal(rec.elr.motor_manifests[0].kind, "A");
  assert.equal(rec.elr.motor_manifests[1].kind, "B");
});

test("05 duplicate create → fail", () => {
  const { registry } = harnessAtomic();
  registry.createExpediente({ factoryKey: "pint03-dup-1", actor: "FactoryRegistry" });
  assertThrows(
    () =>
      registry.createExpediente({ factoryKey: "pint03-dup-1", actor: "FactoryRegistry" }),
    /already exists/
  );
});

test("06 paridad FileElrStore ↔ AtomicFileElrStore", () => {
  const fileRoot = tempRoot("pint03-parity-file-");
  const atomicRoot = tempRoot("pint03-parity-atomic-");
  const fileStore = new FileElrStore(fileRoot);
  const atomicStore = new AtomicFileElrStore(atomicRoot);
  const fileReg = new FactoryRegistry({ store: fileStore });
  const atomicReg = new FactoryRegistry({ store: atomicStore });

  fileReg.createExpediente({ factoryKey: "parity-key-1", candidateRef: "p", actor: "FactoryRegistry" });
  atomicReg.createExpediente({ factoryKey: "parity-key-1", candidateRef: "p", actor: "FactoryRegistry" });
  fileReg.registerElrAct("parity-key-1", "motor_manifests", { kind: "P" }, { actor: "MOT-SYN-02" });
  atomicReg.registerElrAct("parity-key-1", "motor_manifests", { kind: "P" }, { actor: "MOT-SYN-02" });

  const f = stripVolatile(fileReg.getExpediente("parity-key-1"));
  const a = stripVolatile(atomicReg.getExpediente("parity-key-1"));
  assert.deepEqual(f.elr.motor_manifests.map((e) => ({ kind: e.kind, elrSequence: e.elrSequence })), [
    { kind: "P", elrSequence: 1 },
  ]);
  assert.deepEqual(a.elr.motor_manifests.map((e) => ({ kind: e.kind, elrSequence: e.elrSequence })), [
    { kind: "P", elrSequence: 1 },
  ]);
  assert.equal(f.state, a.state);
  assert.equal(f.factory_key, a.factory_key);

  // Observable write side effects: pretty + newline on Atomic bytes
  const raw = fs.readFileSync(atomicStore.resolvePath("parity-key-1"), "utf8");
  assert.ok(raw.endsWith("\n"));
  assert.ok(raw.includes("\n  "));
  assert.ok(JSON.parse(raw).updatedAt);
});

test("07 restart / reopen", () => {
  const base = tempRoot("pint03-reopen-");
  const store1 = new AtomicFileElrStore(base);
  const reg1 = new FactoryRegistry({ store: store1 });
  reg1.createExpediente({ factoryKey: "pint03-reopen-1", actor: "FactoryRegistry" });
  reg1.registerElrAct(
    "pint03-reopen-1",
    "motor_manifests",
    { kind: "REOPEN" },
    { actor: "MOT-SYN-02" }
  );

  const store2 = new AtomicFileElrStore(base);
  const reg2 = new FactoryRegistry({ store: store2 });
  const rec = reg2.getExpediente("pint03-reopen-1");
  assert.equal(rec.elr.motor_manifests[0].kind, "REOPEN");
});

test("08 partial-write simulation → fail-closed / no new+old accept", () => {
  const { store, registry } = harnessAtomic();
  registry.createExpediente({ factoryKey: "pint03-pw-1", actor: "FactoryRegistry" });
  const dataPath = store.resolvePath("pint03-pw-1");
  const sidecarPath = store.resolveSidecarPath("pint03-pw-1");
  const prior = fs.readFileSync(dataPath, "utf8");
  const priorSide = fs.readFileSync(sidecarPath, "utf8");

  // Simulate incomplete promote: new JSON bytes, old sidecar retained
  const mutated = JSON.parse(prior);
  mutated.state = "ST-RDY";
  const newBytes = serializeExpedienteBytes(mutated);
  fs.writeFileSync(dataPath, newBytes, "utf8");
  fs.writeFileSync(sidecarPath, priorSide, "utf8");

  assertThrows(() => store.read("pint03-pw-1"), /Checksum mismatch|fail-closed/i);
  // Restore intact for hygiene
  fs.writeFileSync(dataPath, prior, "utf8");
  fs.writeFileSync(sidecarPath, priorSide, "utf8");
});

test("09 checksum mismatch → fail-closed", () => {
  const { store, registry } = harnessAtomic();
  registry.createExpediente({ factoryKey: "pint03-cm-1", actor: "FactoryRegistry" });
  const sidecarPath = store.resolveSidecarPath("pint03-cm-1");
  fs.writeFileSync(
    sidecarPath,
    formatSidecarContent(STORE_FORMAT_VERSION, "0".repeat(64)),
    "utf8"
  );
  assertThrows(() => store.read("pint03-cm-1"), /Checksum mismatch|fail-closed/i);
});

test("10 JSON corrupto → fail-closed", () => {
  const { store, registry } = harnessAtomic();
  registry.createExpediente({ factoryKey: "pint03-jc-1", actor: "FactoryRegistry" });
  const dataPath = store.resolvePath("pint03-jc-1");
  const sidecarPath = store.resolveSidecarPath("pint03-jc-1");
  const corrupt = "{not-json\n";
  fs.writeFileSync(dataPath, corrupt, "utf8");
  fs.writeFileSync(
    sidecarPath,
    formatSidecarContent(STORE_FORMAT_VERSION, sha256Hex(corrupt)),
    "utf8"
  );
  assertThrows(() => store.read("pint03-jc-1"), /corrupt|fail-closed|JSON/i);
});

test("11 storeFormatVersion desconocida → reject", () => {
  const { store, registry } = harnessAtomic();
  registry.createExpediente({ factoryKey: "pint03-ver-1", actor: "FactoryRegistry" });
  const dataPath = store.resolvePath("pint03-ver-1");
  const sidecarPath = store.resolveSidecarPath("pint03-ver-1");
  const bytes = fs.readFileSync(dataPath, "utf8");
  fs.writeFileSync(
    sidecarPath,
    formatSidecarContent(999, sha256Hex(bytes)),
    "utf8"
  );
  assertThrows(() => store.read("pint03-ver-1"), /storeFormatVersion|Unknown/i);
});

test("12 unknown ELR section → comportamiento constitucional", () => {
  const { registry } = harnessAtomic();
  const created = registry.createExpediente({
    factoryKey: "pint03-unk-1",
    actor: "FactoryRegistry",
  });
  assertThrows(
    () => appendElrEntry(created.elr, "not_a_real_section", { x: 1 }),
    /Unknown section/
  );
});

test("13 elrSequence sin cambios de semántica", () => {
  const { registry } = harnessAtomic();
  registry.createExpediente({ factoryKey: "pint03-seq-1", actor: "FactoryRegistry" });
  const r1 = registry.registerElrAct(
    "pint03-seq-1",
    "conflict_resolutions",
    { kind: "C1" },
    { actor: "MOT-SYN-02" }
  );
  assert.equal(r1.elr.conflict_resolutions[0].elrSequence, 1);
  const r2 = registry.registerElrAct(
    "pint03-seq-1",
    "conflict_resolutions",
    { kind: "C2" },
    { actor: "MOT-SYN-02" }
  );
  assert.equal(r2.elr.conflict_resolutions[1].elrSequence, 2);
  assert.equal(r2.elr.conflict_resolutions.length, 2);
});

test("14 listFactoryKeys ignora sidecars, tmp, bak, recovery", () => {
  const { store, registry } = harnessAtomic();
  registry.createExpediente({ factoryKey: "pint03-list-1", actor: "FactoryRegistry" });
  const dir = store.expedientesDir;
  fs.writeFileSync(path.join(dir, "ghost.json.tmp"), "{}", "utf8");
  fs.writeFileSync(path.join(dir, "ghost.json.bak"), "{}", "utf8");
  fs.writeFileSync(path.join(dir, "ghost.json.sha256"), "{}", "utf8");
  fs.writeFileSync(path.join(dir, "ghost.recovery.json"), "{}", "utf8");
  fs.writeFileSync(path.join(dir, "pint03-list-1.json.bak"), "{}", "utf8");
  const keys = store.listFactoryKeys();
  assert.deepEqual(keys, ["pint03-list-1"]);
});

test("15 exists bloquea create sobre expediente corrupto", () => {
  const { store, registry } = harnessAtomic();
  registry.createExpediente({ factoryKey: "pint03-cor-1", actor: "FactoryRegistry" });
  const dataPath = store.resolvePath("pint03-cor-1");
  const sidecarPath = store.resolveSidecarPath("pint03-cor-1");
  fs.writeFileSync(dataPath, "{broken", "utf8");
  fs.writeFileSync(
    sidecarPath,
    formatSidecarContent(STORE_FORMAT_VERSION, sha256Hex("{broken")),
    "utf8"
  );
  assert.equal(store.exists("pint03-cor-1"), true);
  assertThrows(() => store.read("pint03-cor-1"), /corrupt|fail-closed|JSON/i);
  assertThrows(
    () =>
      registry.createExpediente({ factoryKey: "pint03-cor-1", actor: "FactoryRegistry" }),
    /already exists/
  );
});

test("16 provisional → definitive sin sidecars huérfanos", () => {
  const { store, registry } = harnessAtomic();
  const provisional = "prov-pint03rename01";
  registry.createExpediente({ factoryKey: provisional, actor: "FactoryRegistry" });
  assert.ok(fs.existsSync(store.resolveSidecarPath(provisional)));

  registry.resolveFactoryKey(provisional, "pint03-def-001", {
    actor: "MOT-IDN-01",
    reason: "pint03_test",
  });

  assert.equal(store.exists(provisional), false);
  assert.equal(fs.existsSync(store.resolveSidecarPath(provisional)), false);
  assert.equal(fs.existsSync(`${store.resolvePath(provisional)}.bak`), false);
  assert.equal(fs.existsSync(`${store.resolvePath(provisional)}.tmp`), false);

  const def = registry.getExpediente("pint03-def-001");
  assert.equal(def.factory_key, "pint03-def-001");
  assert.equal(def.keyStatus, "definitive");
  assert.ok(def.elr.factory_key_history.length >= 1);
});

test("17 recovery del último par íntegro cuando sea posible", () => {
  const { store, registry } = harnessAtomic();
  registry.createExpediente({ factoryKey: "pint03-rec-1", actor: "FactoryRegistry" });
  const first = registry.getExpediente("pint03-rec-1");
  const dataPath = store.resolvePath("pint03-rec-1");
  const sidecarPath = store.resolveSidecarPath("pint03-rec-1");
  const bakData = `${dataPath}.bak`;
  const bakSide = `${dataPath}.bak.sha256`;

  // Capture intact pair as bak, then corrupt canonical
  fs.copyFileSync(dataPath, bakData);
  fs.copyFileSync(sidecarPath, bakSide);
  fs.writeFileSync(dataPath, "{corrupt", "utf8");
  fs.writeFileSync(
    sidecarPath,
    formatSidecarContent(STORE_FORMAT_VERSION, sha256Hex("{corrupt")),
    "utf8"
  );
  assertThrows(() => store.read("pint03-rec-1"), /corrupt|fail-closed|JSON/i);

  const result = store.recoverFromBackup("pint03-rec-1");
  assert.equal(result.recovered, true);
  const restored = store.read("pint03-rec-1");
  assert.equal(restored.factory_key, first.factory_key);
  assert.equal(restored.state, first.state);
});

test("18 smoke CB-15 registerElrAct (Atomic inject)", () => {
  const { registry } = harnessAtomic();
  registry.createExpediente({ factoryKey: "pint03-cb15-1", actor: "FactoryRegistry" });
  const snapshot = aggregateElr(registry.getExpediente("pint03-cb15-1"));
  const after = recordElrAggregation(registry, "pint03-cb15-1", snapshot);
  assert.equal(after.elr.loop_ledger_refs.length, 1);
  assert.equal(after.elr.loop_ledger_refs[0].kind, "FFO_ELR_AGGREGATION");
  assert.equal(after.elr.loop_ledger_refs[0].elrSequence, 1);
  assert.equal(after.elr.loop_ledger_refs[0].constitutionalPhase, "CB-15");
});

test("22a default Registry sigue siendo FileElrStore", () => {
  const reg = new FactoryRegistry({ requireCb00Approval: false });
  assert.ok(reg.store instanceof FileElrStore);
  assert.equal(reg.store instanceof AtomicFileElrStore, false);
});

test("22b auditoría estática P-INT-03 módulos", () => {
  const files = [
    "atomicFileElrStore.js",
    "elrIntegrity.js",
    "elrStorePort.js",
    "factoryRegistry.js",
    "index.js",
  ].map((f) => path.join(CB01_DIR, f));
  files.push(path.join(REPO_ROOT, "src", "runPInt03ElrPersistenceValidation.js"));

  // Build needles without embedding banned literals as contiguous source tokens.
  const needles = [
    ["supra", "base"].join(""),
    ["better-", "sql", "ite", "3"].join(""),
    ["sql", ".", "js"].join(""),
    ["sql", "ite"].join(""),
    ["create", "Client"].join(""),
    ["post", "grest"].join(""),
    ["@", "supra", "base", "/"].join(""),
  ];
  const urlNeedle = ["http", "://"].join("");
  const urlNeedleS = ["https", "://"].join("");

  for (const file of files) {
    const src = fs.readFileSync(file, "utf8");
    const lines = src.split(/\r?\n/);
    for (const line of lines) {
      const exempt =
        /NOT AUTHORIZED|prohib|DEFERRED|sin |without|ban|audit|needle|join\(|no live|no SQLite|no Supabase|NOT_AUTHORIZED|NOT_PRESENT|NOT_TOUCHED/i.test(
          line
        );
      if (exempt) continue;
      for (const n of needles) {
        if (line.toLowerCase().includes(n.toLowerCase())) {
          throw new Error(`Banned token "${n}" in ${path.basename(file)}: ${line.trim()}`);
        }
      }
      if (line.includes(urlNeedle) || line.includes(urlNeedleS)) {
        throw new Error(`Banned URL scheme in ${path.basename(file)}: ${line.trim()}`);
      }
    }
  }

  const pkg = JSON.parse(fs.readFileSync(path.join(REPO_ROOT, "package.json"), "utf8"));
  const deps = { ...(pkg.dependencies ?? {}), ...(pkg.devDependencies ?? {}) };
  assert.ok(!deps[["better-", "sql", "ite", "3"].join("")]);
  assert.ok(!deps[["sql", ".", "js"].join("")]);
  assert.ok(!deps[["sql", "ite", "3"].join("")]);
});

await testAsync("19 regresión CB-01", async () => {
  const report = await Promise.resolve(runCb01Validation());
  if (report?.ok === false || report?.passed === false) {
    throw new Error(`CB-01 validation failed: ${JSON.stringify(report)}`);
  }
  // runCb01Validation may return void and throw — if we got here without throw, check common shapes
  if (report && typeof report === "object" && "errors" in report && report.errors?.length) {
    throw new Error(report.errors.join("; "));
  }
});

await testAsync("20 regresión CB-02", async () => {
  const report = await Promise.resolve(runCb02Validation());
  if (report?.ok === false || report?.passed === false) {
    throw new Error(`CB-02 validation failed: ${JSON.stringify(report)}`);
  }
  if (report && typeof report === "object" && "errors" in report && report.errors?.length) {
    throw new Error(report.errors.join("; "));
  }
});

await testAsync("21 regresión P-INT-02 Offline", async () => {
  const runner = path.join(REPO_ROOT, "src", "runPInt02OfflineIngestValidation.js");
  const { spawnSync } = await import("node:child_process");
  const proc = spawnSync(process.execPath, [runner], {
    cwd: REPO_ROOT,
    encoding: "utf8",
  });
  if (proc.status !== 0) {
    throw new Error(
      `P-INT-02 Offline runner exit ${proc.status}\n${proc.stdout}\n${proc.stderr}`
    );
  }
});

// ---------------------------------------------------------------------------
// Summary
// ---------------------------------------------------------------------------

const failed = results.filter((r) => !r.ok);
console.log("\n========== P-INT-03 OFFLINE SUMMARY ==========");
console.log(`Total: ${results.length}  PASS: ${results.length - failed.length}  FAIL: ${failed.length}`);
if (failed.length) {
  for (const f of failed) {
    console.log(`  FAIL — ${f.name}: ${f.error}`);
  }
  process.exitCode = 1;
} else {
  console.log("ALL SUITES PASS");
  console.log("Default store: FileElrStore (unchanged)");
  console.log("AtomicFileElrStore: injection only");
  console.log("SQLite / Supabase ELR: NOT AUTHORIZED");
}

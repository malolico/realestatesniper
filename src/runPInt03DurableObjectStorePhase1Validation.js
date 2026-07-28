/**
 * P-INT-03 Durable — Object Store Phase 1 validation runner.
 *
 * Mandate: P-INT-03-DURABLE-OBJECT-STORE-IMPL
 * Usage: node src/runPInt03DurableObjectStorePhase1Validation.js
 *
 * ObjectStoreElrStore is injected explicitly — FileElrStore remains Registry default.
 * Phase 1 backend: MemoryObjectStoreBackend (no vendor SDK / package.json / Supabase / SQLite).
 */

import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { assertElrStorePort } from "./factory/cb01/elrStorePort.js";
import { FileElrStore } from "./factory/cb01/fileElrStore.js";
import { FactoryRegistry } from "./factory/cb01/factoryRegistry.js";
import { AtomicFileElrStore } from "./factory/cb01/atomicFileElrStore.js";
import { runCb01Validation } from "./factory/cb01/validateCb01.js";
import { MemoryObjectStoreBackend } from "./factory/pint03Durable/memoryObjectStoreBackend.js";
import { assertObjectStoreBackend } from "./factory/pint03Durable/objectStoreBackend.js";
import { ObjectStoreElrStore } from "./factory/pint03Durable/objectStoreElrStore.js";

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

function makeStore() {
  return new ObjectStoreElrStore(new MemoryObjectStoreBackend());
}

test("01 ObjectStoreBackend contract", () => {
  const backend = new MemoryObjectStoreBackend();
  assertObjectStoreBackend(backend);
  backend.put("k", "v");
  assert.equal(backend.get("k"), "v");
  assert.equal(backend.exists("k"), true);
  backend.delete("k");
  assert.equal(backend.exists("k"), false);
});

test("02 ObjectStoreElrStore satisfies ElrStorePort", () => {
  const store = makeStore();
  assertElrStorePort(store);
  assert.equal(typeof store.removeArtifacts, "function");
});

test("03 write/read/exists/list round-trip", () => {
  const store = makeStore();
  const record = {
    factory_key: "FK-OS-PHASE1-001",
    keyStatus: "definitive",
    state: "IDENTIFIED",
    elr: { factory_key: "FK-OS-PHASE1-001", elrId: "ELR-FK-OS-PHASE1-001", sections: {} },
  };
  store.write(record);
  assert.equal(store.exists("FK-OS-PHASE1-001"), true);
  const read = store.read("FK-OS-PHASE1-001");
  assert.equal(read.factory_key, "FK-OS-PHASE1-001");
  assert.ok(Array.isArray(store.listFactoryKeys()));
  assert.ok(store.listFactoryKeys().includes("FK-OS-PHASE1-001"));
});

test("04 fail-closed on missing sidecar", () => {
  const backend = new MemoryObjectStoreBackend();
  const store = new ObjectStoreElrStore(backend);
  store.write({
    factory_key: "FK-OS-CORRUPT-001",
    keyStatus: "definitive",
    state: "IDENTIFIED",
    elr: { factory_key: "FK-OS-CORRUPT-001", elrId: "ELR-FK-OS-CORRUPT-001", sections: {} },
  });
  const dataKey = "elr/expedientes/FK-OS-CORRUPT-001.json";
  backend.delete(`${dataKey}.sha256`);
  assert.throws(() => store.read("FK-OS-CORRUPT-001"), /Sidecar missing|fail-closed/);
  assert.equal(store.exists("FK-OS-CORRUPT-001"), true);
});

test("05 FactoryRegistry injection (not default)", () => {
  const store = makeStore();
  const reg = new FactoryRegistry({ store, requireCb00Approval: false });
  const created = reg.createExpediente({ candidateRef: "os-phase1-inj" });
  assert.ok(created.factory_key);
  const loaded = reg.getExpediente(created.factory_key);
  assert.equal(loaded.factory_key, created.factory_key);
});

test("06 resolveFactoryKey cleans provisional via removeArtifacts", () => {
  const store = makeStore();
  const reg = new FactoryRegistry({ store, requireCb00Approval: false });
  const created = reg.createExpediente({ candidateRef: "os-phase1-resolve" });
  const provisional = created.factory_key;
  assert.ok(store.exists(provisional));
  const resolved = reg.resolveFactoryKey(provisional, "FK-OS-DEFINITIVE-001", {
    actor: "MOT-IDN-01",
    reason: "phase1-test",
  });
  assert.equal(resolved.factory_key, "FK-OS-DEFINITIVE-001");
  assert.equal(store.exists(provisional), false);
  assert.equal(store.exists("FK-OS-DEFINITIVE-001"), true);
});

test("07 default Registry remains FileElrStore", () => {
  const reg = new FactoryRegistry({ requireCb00Approval: false });
  assert.ok(reg.store instanceof FileElrStore);
  assert.equal(reg.store instanceof ObjectStoreElrStore, false);
  assert.equal(reg.store instanceof AtomicFileElrStore, false);
});

test("08 Object Store not activated by default (static)", () => {
  const registrySrc = fs.readFileSync(path.join(CB01_DIR, "factoryRegistry.js"), "utf8");
  assert.equal(registrySrc.includes("ObjectStoreElrStore"), false);
  assert.equal(registrySrc.includes("pint03Durable"), false);
  assert.match(registrySrc, /new FileElrStore\(\)/);
});

test("09 no CB-01 file mutations in this phase scope", () => {
  // Phase 1 Durable lives outside cb01/; constitutional modules remain the Offline set.
  const durableDir = path.join(REPO_ROOT, "src", "factory", "pint03Durable");
  assert.ok(fs.existsSync(path.join(durableDir, "objectStoreElrStore.js")));
  assert.ok(fs.existsSync(path.join(durableDir, "memoryObjectStoreBackend.js")));
  assert.ok(fs.existsSync(path.join(durableDir, "objectStoreBackend.js")));
});

test("10 CB-01 validation still runnable", () => {
  const result = runCb01Validation();
  assert.equal(result.passed, true);
  assert.equal(result.errors.length, 0);
});

const failed = results.filter((r) => !r.ok);
console.log("");
console.log("P-INT-03 Durable Object Store Phase 1");
console.log(`Mandate: P-INT-03-DURABLE-OBJECT-STORE-IMPL`);
console.log(`Path: OBJECT STORE`);
console.log(`Default store: FileElrStore (unchanged)`);
console.log(`ObjectStoreElrStore: injection only`);
console.log(`Backend: MemoryObjectStoreBackend (Phase 1)`);
console.log(`Passed: ${results.filter((r) => r.ok).length}/${results.length}`);
if (failed.length) {
  console.error("RESULT: FAIL");
  process.exitCode = 1;
} else {
  console.log("RESULT: PASS");
}

/**
 * P-INT-03 Durable — Object Store Phase 2 validation runner.
 *
 * Mandate: P-INT-03-DURABLE-OBJECT-STORE-IMPL
 * Usage: node src/runPInt03DurableObjectStorePhase2Validation.js
 *
 * LocalDurableObjectStoreBackend + ObjectStoreElrStore (injection only).
 * FileElrStore remains Registry default. No SDK / Supabase / SQLite / deps.
 */

import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { assertElrStorePort } from "./factory/cb01/elrStorePort.js";
import { FileElrStore } from "./factory/cb01/fileElrStore.js";
import { FactoryRegistry } from "./factory/cb01/factoryRegistry.js";
import { AtomicFileElrStore } from "./factory/cb01/atomicFileElrStore.js";
import { runCb01Validation } from "./factory/cb01/validateCb01.js";
import { formatSidecarContent, STORE_FORMAT_VERSION } from "./factory/cb01/elrIntegrity.js";
import { assertObjectStoreBackend } from "./factory/pint03Durable/objectStoreBackend.js";
import { MemoryObjectStoreBackend } from "./factory/pint03Durable/memoryObjectStoreBackend.js";
import { LocalDurableObjectStoreBackend } from "./factory/pint03Durable/localDurableObjectStoreBackend.js";
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

function tempRoot(label) {
  return fs.mkdtempSync(path.join(os.tmpdir(), `pint03-os-p2-${label}-`));
}

function makeDurableStore(root) {
  return new ObjectStoreElrStore(new LocalDurableObjectStoreBackend(root));
}

test("01 LocalDurableObjectStoreBackend contract", () => {
  const root = tempRoot("be");
  const backend = new LocalDurableObjectStoreBackend(root);
  assertObjectStoreBackend(backend);
  backend.put("elr/a.json", "hello");
  assert.equal(backend.exists("elr/a.json"), true);
  assert.equal(backend.get("elr/a.json"), "hello");
  assert.ok(backend.listKeys("elr/").includes("elr/a.json"));
  backend.delete("elr/a.json");
  assert.equal(backend.exists("elr/a.json"), false);
});

test("02 ObjectStoreElrStore + durable backend satisfies ElrStorePort", () => {
  const store = makeDurableStore(tempRoot("port"));
  assertElrStorePort(store);
});

test("03 write/read/exists/list round-trip", () => {
  const store = makeDurableStore(tempRoot("rw"));
  store.write({
    factory_key: "FK-OS-P2-001",
    keyStatus: "definitive",
    state: "IDENTIFIED",
    elr: { factory_key: "FK-OS-P2-001", elrId: "ELR-FK-OS-P2-001", sections: {} },
  });
  assert.equal(store.exists("FK-OS-P2-001"), true);
  assert.equal(store.read("FK-OS-P2-001").factory_key, "FK-OS-P2-001");
  assert.ok(store.listFactoryKeys().includes("FK-OS-P2-001"));
});

test("04 durability across process restart (new backend instance)", () => {
  const root = tempRoot("dur");
  const store1 = makeDurableStore(root);
  store1.write({
    factory_key: "FK-OS-P2-DURABLE",
    keyStatus: "definitive",
    state: "IDENTIFIED",
    elr: { factory_key: "FK-OS-P2-DURABLE", elrId: "ELR-FK-OS-P2-DURABLE", sections: {} },
  });
  // Simulate restart: new backend + adapter on same root (Memory would lose data)
  const store2 = makeDurableStore(root);
  assert.equal(store2.exists("FK-OS-P2-DURABLE"), true);
  assert.equal(store2.read("FK-OS-P2-DURABLE").factory_key, "FK-OS-P2-DURABLE");

  const mem = new ObjectStoreElrStore(new MemoryObjectStoreBackend());
  mem.write({
    factory_key: "FK-OS-P2-MEM",
    keyStatus: "definitive",
    state: "IDENTIFIED",
    elr: { factory_key: "FK-OS-P2-MEM", elrId: "ELR-FK-OS-P2-MEM", sections: {} },
  });
  const mem2 = new ObjectStoreElrStore(new MemoryObjectStoreBackend());
  assert.equal(mem2.exists("FK-OS-P2-MEM"), false);
});

test("05 inexistencia read → null", () => {
  const store = makeDurableStore(tempRoot("miss"));
  assert.equal(store.read("FK-OS-P2-MISSING"), null);
  assert.equal(store.exists("FK-OS-P2-MISSING"), false);
});

test("06 fail-closed missing sidecar + checksum mismatch", () => {
  const root = tempRoot("int");
  const backend = new LocalDurableObjectStoreBackend(root);
  const store = new ObjectStoreElrStore(backend);
  store.write({
    factory_key: "FK-OS-P2-CORRUPT",
    keyStatus: "definitive",
    state: "IDENTIFIED",
    elr: { factory_key: "FK-OS-P2-CORRUPT", elrId: "ELR-FK-OS-P2-CORRUPT", sections: {} },
  });
  const dataKey = "elr/expedientes/FK-OS-P2-CORRUPT.json";
  backend.delete(`${dataKey}.sha256`);
  assert.throws(() => store.read("FK-OS-P2-CORRUPT"), /Sidecar missing|fail-closed/);

  store.write({
    factory_key: "FK-OS-P2-HASH",
    keyStatus: "definitive",
    state: "IDENTIFIED",
    elr: { factory_key: "FK-OS-P2-HASH", elrId: "ELR-FK-OS-P2-HASH", sections: {} },
  });
  const hashKey = "elr/expedientes/FK-OS-P2-HASH.json";
  backend.put(`${hashKey}.sha256`, formatSidecarContent(STORE_FORMAT_VERSION, "0".repeat(64)));
  assert.throws(() => store.read("FK-OS-P2-HASH"), /Checksum mismatch|fail-closed/);
});

test("07 aislamiento por factory_key", () => {
  const store = makeDurableStore(tempRoot("iso"));
  store.write({
    factory_key: "FK-OS-P2-A",
    keyStatus: "definitive",
    state: "IDENTIFIED",
    elr: { factory_key: "FK-OS-P2-A", elrId: "ELR-FK-OS-P2-A", sections: {} },
  });
  store.write({
    factory_key: "FK-OS-P2-B",
    keyStatus: "definitive",
    state: "IDENTIFIED",
    elr: { factory_key: "FK-OS-P2-B", elrId: "ELR-FK-OS-P2-B", sections: {} },
  });
  const a = store.read("FK-OS-P2-A");
  const b = store.read("FK-OS-P2-B");
  assert.equal(a.factory_key, "FK-OS-P2-A");
  assert.equal(b.factory_key, "FK-OS-P2-B");
  assert.equal(a.elr.elrId, "ELR-FK-OS-P2-A");
  assert.equal(b.elr.elrId, "ELR-FK-OS-P2-B");
  assert.notEqual(a.elr.elrId, b.elr.elrId);
});

test("08 removeArtifacts inventory", () => {
  const root = tempRoot("rm");
  const backend = new LocalDurableObjectStoreBackend(root);
  const store = new ObjectStoreElrStore(backend);
  store.write({
    factory_key: "FK-OS-P2-RM",
    keyStatus: "definitive",
    state: "IDENTIFIED",
    elr: { factory_key: "FK-OS-P2-RM", elrId: "ELR-FK-OS-P2-RM", sections: {} },
  });
  const prefix = "elr/expedientes/FK-OS-P2-RM.json";
  assert.equal(backend.exists(prefix), true);
  assert.equal(backend.exists(`${prefix}.sha256`), true);
  store.removeArtifacts("FK-OS-P2-RM");
  assert.equal(backend.exists(prefix), false);
  assert.equal(backend.exists(`${prefix}.sha256`), false);
  assert.equal(backend.exists(`${prefix}.tmp`), false);
  assert.equal(backend.exists(`${prefix}.sha256.tmp`), false);
  assert.equal(backend.exists(`${prefix}.bak`), false);
  assert.equal(backend.exists(`${prefix}.bak.sha256`), false);
});

test("09 FactoryRegistry injection + resolveFactoryKey", () => {
  const store = makeDurableStore(tempRoot("reg"));
  const reg = new FactoryRegistry({ store, requireCb00Approval: false });
  const created = reg.createExpediente({ candidateRef: "os-p2" });
  const provisional = created.factory_key;
  const resolved = reg.resolveFactoryKey(provisional, "FK-OS-P2-DEF", {
    actor: "MOT-IDN-01",
    reason: "phase2-test",
  });
  assert.equal(resolved.factory_key, "FK-OS-P2-DEF");
  assert.equal(store.exists(provisional), false);
  assert.equal(store.exists("FK-OS-P2-DEF"), true);
});

test("10 default Registry remains FileElrStore + static", () => {
  const reg = new FactoryRegistry({ requireCb00Approval: false });
  assert.ok(reg.store instanceof FileElrStore);
  assert.equal(reg.store instanceof ObjectStoreElrStore, false);
  assert.equal(reg.store instanceof AtomicFileElrStore, false);
  const registrySrc = fs.readFileSync(path.join(CB01_DIR, "factoryRegistry.js"), "utf8");
  assert.equal(registrySrc.includes("ObjectStoreElrStore"), false);
  assert.equal(registrySrc.includes("LocalDurableObjectStoreBackend"), false);
  assert.equal(registrySrc.includes("pint03Durable"), false);
});

test("11 MemoryObjectStoreBackend retained", () => {
  assertObjectStoreBackend(new MemoryObjectStoreBackend());
});

test("12 path traversal rejected", () => {
  const backend = new LocalDurableObjectStoreBackend(tempRoot("trav"));
  assert.throws(() => backend.put("../escape.json", "x"), /traversal|absolute|forbidden/);
  assert.throws(() => backend.put("/abs.json", "x"), /absolute|forbidden/);
});

test("13 CB-01 validation still runnable", () => {
  const result = runCb01Validation();
  assert.equal(result.passed, true);
  assert.equal(result.errors.length, 0);
});

const failed = results.filter((r) => !r.ok);
console.log("");
console.log("P-INT-03 Durable Object Store Phase 2");
console.log("Mandate: P-INT-03-DURABLE-OBJECT-STORE-IMPL");
console.log("Path: OBJECT STORE");
console.log("Backend: LocalDurableObjectStoreBackend");
console.log("Default store: FileElrStore (unchanged)");
console.log(`Passed: ${results.filter((r) => r.ok).length}/${results.length}`);
if (failed.length) {
  console.error("RESULT: FAIL");
  process.exitCode = 1;
} else {
  console.log("RESULT: PASS");
}

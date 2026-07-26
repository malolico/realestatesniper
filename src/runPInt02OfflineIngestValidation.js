/**
 * P-INT-02 Offline — Recorded Packs + Connector Contracts validation runner.
 *
 * Usage:
 *   node src/runPInt02OfflineIngestValidation.js
 *
 * Sole ingest path: DsoIngestionService.ingest (via offlineIngestFromPack).
 * No live APIs, HTTP, Web, Supabase, or CB-05 payload binding.
 */

import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { FileElrStore } from "./factory/cb01/fileElrStore.js";
import { FactoryRegistry } from "./factory/cb01/factoryRegistry.js";
import {
  CONTRACT_ASR_MC,
  LIVE_NOT_AUTHORIZED,
  offlineIngestFromPack,
  sha256File,
  validateRecordedPack,
  writeChecksumsAuthority,
} from "./factory/cb02/connectors/index.js";
import { DsoIngestionService } from "./factory/cb02/dsoIngestionService.js";
import { SourceIngestionLedger } from "./factory/cb02/sourceIngestionLedger.js";
import { runCb02Validation } from "./factory/cb02/validateCb02.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = path.resolve(__dirname, "..");
const PILOT_PACK = path.join(
  REPO_ROOT,
  "data",
  "factory-dso-packs",
  "maricopa",
  "pilot-001"
);

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

function createHarness() {
  const base = fs.mkdtempSync(path.join(os.tmpdir(), "pint02-offline-"));
  const registryDir = path.join(base, "registry");
  const ingestionDir = path.join(base, "ingestions");
  const store = new FileElrStore(registryDir);
  const registry = new FactoryRegistry({ store });
  const ledger = new SourceIngestionLedger(ingestionDir);
  const service = new DsoIngestionService({ registry, ledger });
  return { base, registry, ledger, service };
}

function copyPilotPack(destRoot) {
  fs.cpSync(PILOT_PACK, destRoot, { recursive: true });
}

function rewriteChecksums(packRoot) {
  writeChecksumsAuthority(packRoot, [
    "pack.manifest.json",
    "provenance.json",
    "response/ORG-ASR-MC.json",
    "response/ORG-GIS-MC.json",
    "response/ORG-RCR-MC.json",
  ]);
}

function readManifest(packRoot) {
  return JSON.parse(
    fs.readFileSync(path.join(packRoot, "pack.manifest.json"), "utf8")
  );
}

function writeManifest(packRoot, manifest) {
  fs.writeFileSync(
    path.join(packRoot, "pack.manifest.json"),
    `${JSON.stringify(manifest, null, 2)}\n`,
    "utf8"
  );
}

function ensureExpediente(registry, factoryKey) {
  if (!registry.getExpediente(factoryKey)) {
    registry.createExpediente({ factoryKey, candidateRef: "pint02-pilot" });
  }
}

// --- Suites ---

test("1 ASR pack path → ACCEPT (via full pilot pack)", () => {
  const h = createHarness();
  try {
    const pack = path.join(h.base, "pack");
    copyPilotPack(pack);
    const manifest = readManifest(pack);
    ensureExpediente(h.registry, manifest.factoryKey);
    const asrOnly = {
      ...manifest,
      organisms: manifest.organisms.filter((o) => o.organismId === "ORG-ASR-MC"),
      contractIds: ["maricopa.assessor.recorded.v1"],
    };
    writeManifest(pack, asrOnly);
    rewriteChecksums(pack);
    const out = offlineIngestFromPack(pack, { dsoIngestionService: h.service });
    assert.equal(out.ok, true);
    assert.equal(out.results.length, 1);
    assert.equal(out.results[0].organismId, "ORG-ASR-MC");
    assert.equal(out.results[0].accepted, true);
    assert.ok(out.results[0].sourceRefId);
    const hist = h.service.getIngestionHistory(manifest.factoryKey);
    assert.ok(hist.some((e) => e.accepted && e.sourceRefId));
    const elr = h.registry.getExpediente(manifest.factoryKey).elr;
    assert.ok(elr.motor_manifests.some((m) => m.kind === "DSO_SOURCE_INGEST"));
  } finally {
    fs.rmSync(h.base, { recursive: true, force: true });
  }
});

test("2 GIS pack path → ACCEPT", () => {
  const h = createHarness();
  try {
    const pack = path.join(h.base, "pack");
    copyPilotPack(pack);
    const manifest = readManifest(pack);
    ensureExpediente(h.registry, manifest.factoryKey);
    writeManifest(pack, {
      ...manifest,
      organisms: manifest.organisms.filter((o) => o.organismId === "ORG-GIS-MC"),
      contractIds: ["maricopa.gis.recorded.v1"],
    });
    rewriteChecksums(pack);
    const out = offlineIngestFromPack(pack, { dsoIngestionService: h.service });
    assert.equal(out.ok, true);
    assert.equal(out.results[0].organismId, "ORG-GIS-MC");
    assert.equal(out.results[0].accepted, true);
  } finally {
    fs.rmSync(h.base, { recursive: true, force: true });
  }
});

test("3 RCR pack path → ACCEPT (pack default vintageAt)", () => {
  const h = createHarness();
  try {
    const pack = path.join(h.base, "pack");
    copyPilotPack(pack);
    const manifest = readManifest(pack);
    ensureExpediente(h.registry, manifest.factoryKey);
    const rcr = manifest.organisms.find((o) => o.organismId === "ORG-RCR-MC");
    assert.ok(!rcr.vintageAt, "RCR uses pack-level vintageAt default");
    writeManifest(pack, {
      ...manifest,
      organisms: [rcr],
      contractIds: ["maricopa.recorder.recorded.v1"],
    });
    rewriteChecksums(pack);
    const out = offlineIngestFromPack(pack, { dsoIngestionService: h.service });
    assert.equal(out.ok, true);
    assert.equal(out.results[0].accepted, true);
  } finally {
    fs.rmSync(h.base, { recursive: true, force: true });
  }
});

test("4 Checksum alterado → REJECT", () => {
  const pack = fs.mkdtempSync(path.join(os.tmpdir(), "pint02-tamper-"));
  try {
    copyPilotPack(pack);
    const target = path.join(pack, "response", "ORG-ASR-MC.json");
    const payload = JSON.parse(fs.readFileSync(target, "utf8"));
    payload.notes = "tampered";
    fs.writeFileSync(target, `${JSON.stringify(payload, null, 2)}\n`);
    const v = validateRecordedPack(pack);
    assert.equal(v.ok, false);
    assert.match(v.reason, /checksum|contentChecksum/i);
  } finally {
    fs.rmSync(pack, { recursive: true, force: true });
  }
});

test("5 Manifest inválido → REJECT", () => {
  const pack = fs.mkdtempSync(path.join(os.tmpdir(), "pint02-badman-"));
  try {
    copyPilotPack(pack);
    const manifest = readManifest(pack);
    manifest.sourceMode = "LIVE";
    writeManifest(pack, manifest);
    rewriteChecksums(pack);
    const v = validateRecordedPack(pack);
    assert.equal(v.ok, false);
    assert.equal(v.reason, "sourceMode_not_RECORDED");
  } finally {
    fs.rmSync(pack, { recursive: true, force: true });
  }
});

test("5b Manifest self-checksum → REJECT", () => {
  const pack = fs.mkdtempSync(path.join(os.tmpdir(), "pint02-selfhash-"));
  try {
    copyPilotPack(pack);
    const manifest = readManifest(pack);
    manifest.manifestChecksum = "deadbeef";
    writeManifest(pack, manifest);
    rewriteChecksums(pack);
    const v = validateRecordedPack(pack);
    assert.equal(v.ok, false);
    assert.equal(v.reason, "manifest_self_checksum_forbidden");
  } finally {
    fs.rmSync(pack, { recursive: true, force: true });
  }
});

test("6 Schema inválido → REJECT", () => {
  const pack = fs.mkdtempSync(path.join(os.tmpdir(), "pint02-schema-"));
  try {
    copyPilotPack(pack);
    const target = path.join(pack, "response", "ORG-ASR-MC.json");
    const payload = JSON.parse(fs.readFileSync(target, "utf8"));
    delete payload.apn;
    fs.writeFileSync(target, `${JSON.stringify(payload, null, 2)}\n`);
    const manifest = readManifest(pack);
    const entry = manifest.organisms.find((o) => o.organismId === "ORG-ASR-MC");
    entry.contentChecksum = sha256File(target);
    writeManifest(pack, manifest);
    rewriteChecksums(pack);
    const v = validateRecordedPack(pack);
    assert.equal(v.ok, false);
    assert.match(v.reason, /schema_invalid/);
  } finally {
    fs.rmSync(pack, { recursive: true, force: true });
  }
});

test("7 Organismo desconocido → REJECT", () => {
  const pack = fs.mkdtempSync(path.join(os.tmpdir(), "pint02-unk-"));
  try {
    copyPilotPack(pack);
    const manifest = readManifest(pack);
    const entry = manifest.organisms[0];
    entry.organismId = "ORG-FAKE-XX";
    writeManifest(pack, manifest);
    rewriteChecksums(pack);
    const v = validateRecordedPack(pack);
    assert.equal(v.ok, false);
    assert.match(v.reason, /organism_unknown/);
  } finally {
    fs.rmSync(pack, { recursive: true, force: true });
  }
});

test("8 Organismo PROHIBITED → REJECT", () => {
  const pack = fs.mkdtempSync(path.join(os.tmpdir(), "pint02-prh-"));
  try {
    copyPilotPack(pack);
    const manifest = readManifest(pack);
    const entry = manifest.organisms[0];
    entry.organismId = "ORG-PRH-SCR";
    entry.familyId = "PROHIBITED";
    writeManifest(pack, manifest);
    rewriteChecksums(pack);
    const v = validateRecordedPack(pack);
    assert.equal(v.ok, false);
    assert.match(v.reason, /organism_prohibited/);
  } finally {
    fs.rmSync(pack, { recursive: true, force: true });
  }
});

test("9 Family mismatch → REJECT", () => {
  const pack = fs.mkdtempSync(path.join(os.tmpdir(), "pint02-fam-"));
  try {
    copyPilotPack(pack);
    const manifest = readManifest(pack);
    const entry = manifest.organisms.find((o) => o.organismId === "ORG-ASR-MC");
    entry.familyId = "GIS_OFFICIAL";
    writeManifest(pack, manifest);
    rewriteChecksums(pack);
    const v = validateRecordedPack(pack);
    assert.equal(v.ok, false);
    assert.match(v.reason, /family_mismatch/);
  } finally {
    fs.rmSync(pack, { recursive: true, force: true });
  }
});

test("10 FP flag → REJECT", () => {
  const h = createHarness();
  try {
    const pack = path.join(h.base, "pack");
    copyPilotPack(pack);
    const manifest = readManifest(pack);
    ensureExpediente(h.registry, manifest.factoryKey);
    writeManifest(pack, {
      ...manifest,
      organisms: manifest.organisms.filter((o) => o.organismId === "ORG-ASR-MC"),
      contractIds: ["maricopa.assessor.recorded.v1"],
    });
    rewriteChecksums(pack);
    const out = offlineIngestFromPack(pack, {
      dsoIngestionService: h.service,
      provenanceOverrides: { prohibitedFlags: ["FP-02"] },
    });
    assert.equal(out.ok, false);
    assert.equal(out.results[0].accepted, false);
    assert.match(String(out.results[0].rejectionReason), /prohibited_source|FP/i);
  } finally {
    fs.rmSync(h.base, { recursive: true, force: true });
  }
});

test("11 Averaging → REJECT", () => {
  const h = createHarness();
  try {
    const pack = path.join(h.base, "pack");
    copyPilotPack(pack);
    const manifest = readManifest(pack);
    ensureExpediente(h.registry, manifest.factoryKey);
    writeManifest(pack, {
      ...manifest,
      organisms: manifest.organisms.filter((o) => o.organismId === "ORG-ASR-MC"),
      contractIds: ["maricopa.assessor.recorded.v1"],
    });
    rewriteChecksums(pack);
    const out = offlineIngestFromPack(pack, {
      dsoIngestionService: h.service,
      provenanceOverrides: { conflictResolutionStrategy: "AVERAGE" },
    });
    assert.equal(out.ok, false);
    assert.equal(out.results[0].accepted, false);
    assert.ok(out.results[0].deriveToEvidence);
  } finally {
    fs.rmSync(h.base, { recursive: true, force: true });
  }
});

test("12 Conflicto irresoluble → REJECT + deriveToEvidence + ledger/ELR", () => {
  const h = createHarness();
  try {
    const pack = path.join(h.base, "pack");
    copyPilotPack(pack);
    const manifest = readManifest(pack);
    ensureExpediente(h.registry, manifest.factoryKey);
    writeManifest(pack, {
      ...manifest,
      organisms: manifest.organisms.filter((o) => o.organismId === "ORG-RCR-MC"),
      contractIds: ["maricopa.recorder.recorded.v1"],
    });
    rewriteChecksums(pack);
    const out = offlineIngestFromPack(pack, {
      dsoIngestionService: h.service,
      provenanceOverrides: {
        conflictDetected: true,
        conflictResolvable: false,
      },
    });
    assert.equal(out.ok, false);
    assert.equal(out.results[0].accepted, false);
    assert.equal(out.results[0].deriveToEvidence, true);
    assert.equal(out.results[0].rejectionReason, "unresolved_source_conflict");
    const hist = h.service.getIngestionHistory(manifest.factoryKey);
    assert.ok(hist.some((e) => e.accepted === false && e.deriveToEvidence === true));
    const elr = h.registry.getExpediente(manifest.factoryKey).elr;
    assert.ok(
      elr.conflict_resolutions.some((c) => c.kind === "DSO_INGEST_REJECTED")
    );
  } finally {
    fs.rmSync(h.base, { recursive: true, force: true });
  }
});

test("13 Expediente inexistente → fail-closed", () => {
  const h = createHarness();
  try {
    const pack = path.join(h.base, "pack");
    copyPilotPack(pack);
    // do NOT create expediente
    const out = offlineIngestFromPack(pack, { dsoIngestionService: h.service });
    assert.equal(out.ok, false);
    assert.equal(out.reason, "ingest_threw");
    assert.match(String(out.errorMessage), /Expediente not found/i);
  } finally {
    fs.rmSync(h.base, { recursive: true, force: true });
  }
});

test("14 Intento live → LIVE_NOT_AUTHORIZED", () => {
  assert.throws(() => CONTRACT_ASR_MC.fetchLive(), (err) => {
    assert.equal(err.code, LIVE_NOT_AUTHORIZED);
    return true;
  });
  const h = createHarness();
  try {
    const pack = path.join(h.base, "pack");
    copyPilotPack(pack);
    const manifest = readManifest(pack);
    ensureExpediente(h.registry, manifest.factoryKey);
    const out = offlineIngestFromPack(pack, {
      dsoIngestionService: h.service,
      attemptLiveFetch: true,
    });
    assert.equal(out.ok, false);
    assert.equal(out.code, LIVE_NOT_AUTHORIZED);
  } finally {
    fs.rmSync(h.base, { recursive: true, force: true });
  }
});

test("14b liveFetch:true in manifest → REJECT", () => {
  const pack = fs.mkdtempSync(path.join(os.tmpdir(), "pint02-liveflag-"));
  try {
    copyPilotPack(pack);
    const manifest = readManifest(pack);
    manifest.liveFetch = true;
    writeManifest(pack, manifest);
    rewriteChecksums(pack);
    const v = validateRecordedPack(pack);
    assert.equal(v.ok, false);
    assert.equal(v.reason, "liveFetch_not_false");
  } finally {
    fs.rmSync(pack, { recursive: true, force: true });
  }
});

test("15 Static audit — no fetch/http/supabase/credentials in connectors", () => {
  const dir = path.join(REPO_ROOT, "src", "factory", "cb02", "connectors");
  const files = fs.readdirSync(dir).filter((f) => f.endsWith(".js"));
  const joined = files
    .map((f) => fs.readFileSync(path.join(dir, f), "utf8"))
    .join("\n");
  // Ban global fetch( — not fetchLive() guard method
  assert.equal(/(?<![A-Za-z_.])fetch\s*\(/.test(joined), false);
  assert.equal(/from\s+["']node:(http|https|net)["']/.test(joined), false);
  assert.equal(/\bhttps?:\/\//i.test(joined), false);
  assert.equal(/supabase/i.test(joined), false);
  assert.equal(/process\.env/.test(joined), false);
  assert.equal(/sk_live_|sk_test_/.test(joined), false);
  // Ban importing/calling buildSourceRef (comments mentioning the ban are OK)
  assert.equal(
    /import\s*\{[^}]*\bbuildSourceRef\b|\bbuildSourceRef\s*\(/.test(joined),
    false
  );
});

test("smoke opcional — source_ref only (no CB-05 payload binding)", () => {
  const h = createHarness();
  try {
    const pack = path.join(h.base, "pack");
    copyPilotPack(pack);
    const manifest = readManifest(pack);
    ensureExpediente(h.registry, manifest.factoryKey);
    const out = offlineIngestFromPack(pack, { dsoIngestionService: h.service });
    assert.equal(out.ok, true);
    for (const r of out.results) {
      assert.ok(r.source_ref);
      assert.equal(r.source_ref.organismId, r.organismId);
      assert.match(r.source_ref.id, /^SRC-/);
    }
    // Explicit: payloads exist on disk result but are NOT passed to CB-05
    assert.ok(out.payloadsByOrganism["ORG-ASR-MC"]);
    assert.equal(
      Object.prototype.hasOwnProperty.call(out, "cb05Binding"),
      false
    );
  } finally {
    fs.rmSync(h.base, { recursive: true, force: true });
  }
});

test("full pilot pack ASR+GIS+RCR → ACCEPT all", () => {
  const h = createHarness();
  try {
    const pack = path.join(h.base, "pack");
    copyPilotPack(pack);
    const manifest = readManifest(pack);
    ensureExpediente(h.registry, manifest.factoryKey);
    const out = offlineIngestFromPack(pack, { dsoIngestionService: h.service });
    assert.equal(out.ok, true);
    assert.equal(out.results.length, 3);
    assert.ok(out.results.every((r) => r.accepted));
  } finally {
    fs.rmSync(h.base, { recursive: true, force: true });
  }
});

const failed = results.filter((r) => !r.ok);
console.log("");
console.log("====================================================");
console.log("P-INT-02 OFFLINE RECORDED INGEST VALIDATION");
console.log("====================================================");
console.log(
  `total=${results.length} pass=${results.length - failed.length} fail=${failed.length}`
);

console.log("");
console.log("--- CB-02 regression ---");
const cb02 = runCb02Validation({});
console.log(
  `CB-02: ${cb02.passed ? "PASS" : "FAIL"} errors=${cb02.errors.length}`
);
if (!cb02.passed) {
  for (const e of cb02.errors) console.error(`  - ${e}`);
}

if (failed.length) {
  console.log("FAILED:");
  for (const f of failed) console.log(` - ${f.name}: ${f.error}`);
  process.exitCode = 1;
} else if (!cb02.passed) {
  process.exitCode = 1;
} else {
  console.log("RESULT: ALL PASS");
  console.log("LIVE_APIS: NOT_AUTHORIZED");
  console.log("HTTP/FETCH: NOT_PRESENT");
  console.log("WEB/SUPABASE: NOT_TOUCHED");
  console.log("CB05_PAYLOAD_BINDING: NOT_IMPLEMENTED");
}

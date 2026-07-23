/**
 * II.2-IMPL validation suite — Read Model Contract v2.
 * Run: node src/integration/readModel/tests/runIi2ReadModelValidation.js
 */

import assert from "node:assert/strict";
import { canonicalize } from "../canonicalize.js";
import {
  CONTRACT_ID,
  SCHEMA_VERSION,
} from "../constants.js";
import {
  attachIntegrity,
  computeChecksum,
  verifyChecksum,
} from "../integrity.js";
import { evaluateFreshness } from "../invariants.js";
import { SCHEMA_META } from "../schema.js";
import { sanitizeToV2 } from "../sanitizer.js";
import { validateReadModelV2 } from "../validator.js";
import {
  FIXTURE_CATALOG,
  fixtureHealthy,
  fixtureStale,
  fixtureTruncationWarnings,
} from "../fixtures/index.js";

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

test("schema meta exposes contractId and schemaVersion 2.0.0", () => {
  assert.equal(SCHEMA_META.contractId, CONTRACT_ID);
  assert.equal(SCHEMA_META.schemaVersion, SCHEMA_VERSION);
  assert.ok(SCHEMA_META.rootFields.includes("expedientes"));
  assert.ok(SCHEMA_META.rootFields.includes("ownership"));
  assert.ok(!SCHEMA_META.rootFields.includes("records"));
  assert.ok(!SCHEMA_META.rootFields.includes("contractName"));
});

test("accepts healthy fixture", () => {
  const r = validateReadModelV2(fixtureHealthy(), {
    now: "2026-07-23T12:30:00.000Z",
  });
  assert.equal(r.ok, true, r.errors?.join("; "));
  assert.equal(r.value.contractId, CONTRACT_ID);
  assert.equal(r.freshness, "fresh");
});

test("accepts degraded / partial / registry-absent / zero / diamond", () => {
  for (const key of [
    "degraded",
    "partial",
    "registryAbsent",
    "zeroExpedientes",
    "diamond",
  ]) {
    const r = validateReadModelV2(FIXTURE_CATALOG[key](), {
      now: "2026-07-23T12:30:00.000Z",
    });
    assert.equal(r.ok, true, `${key} should pass: ${r.errors?.join("; ")}`);
  }
});

test("stale fixture validates but freshness=stale", () => {
  const r = validateReadModelV2(fixtureStale(), {
    now: "2026-07-23T12:00:00.000Z",
  });
  assert.equal(r.ok, true, r.errors?.join("; "));
  assert.equal(r.freshness, "stale");
});

test("evaluateFreshness helper", () => {
  assert.equal(
    evaluateFreshness(fixtureStale(), "2026-07-23T12:00:00.000Z"),
    "stale"
  );
  assert.equal(
    evaluateFreshness(fixtureHealthy(), "2026-07-23T12:30:00.000Z"),
    "fresh"
  );
});

test("truncation warnings EXPEDIENTES_TRUNCATED / DIAGNOSTICS_TRUNCATED accepted", () => {
  const r = validateReadModelV2(fixtureTruncationWarnings(), {
    now: "2026-07-23T12:30:00.000Z",
  });
  assert.equal(r.ok, true, r.errors?.join("; "));
  const codes = r.value.warnings.map((w) => w.code);
  assert.ok(codes.includes("EXPEDIENTES_TRUNCATED"));
  assert.ok(codes.includes("DIAGNOSTICS_TRUNCATED"));
});

test("rejects unknown root field", () => {
  const r = validateReadModelV2(FIXTURE_CATALOG.unknownRootField());
  assert.equal(r.ok, false);
});

test("rejects unknown nested field", () => {
  const r = validateReadModelV2(FIXTURE_CATALOG.unknownNestedField());
  assert.equal(r.ok, false);
});

test("rejects contractName (migration nomenclature)", () => {
  const r = validateReadModelV2(FIXTURE_CATALOG.contractName());
  assert.equal(r.ok, false);
  assert.ok(r.errors.some((e) => /contractName/i.test(e)));
});

test("rejects records (migration nomenclature)", () => {
  const r = validateReadModelV2(FIXTURE_CATALOG.records());
  assert.equal(r.ok, false);
  assert.ok(r.errors.some((e) => /records/i.test(e)));
});

test("rejects RECORDS_TRUNCATED", () => {
  const r = validateReadModelV2(FIXTURE_CATALOG.recordsTruncated());
  assert.equal(r.ok, false);
  assert.ok(r.errors.some((e) => /RECORDS_TRUNCATED/i.test(e)));
});

test("rejects invalid timestamp order", () => {
  const r = validateReadModelV2(FIXTURE_CATALOG.badTimestampOrder());
  assert.equal(r.ok, false);
});

test("rejects bad checksum", () => {
  const r = validateReadModelV2(FIXTURE_CATALOG.badChecksum());
  assert.equal(r.ok, false);
  assert.ok(r.errors.some((e) => /checksum/i.test(e)));
});

test("rejects invalid Diamond invariant", () => {
  const r = validateReadModelV2(FIXTURE_CATALOG.badDiamond());
  assert.equal(r.ok, false);
  assert.ok(r.errors.some((e) => /DIAMOND/i.test(e)));
});

test("rejects prohibited data (secrets/paths)", () => {
  const r = validateReadModelV2(FIXTURE_CATALOG.prohibitedData());
  assert.equal(r.ok, false);
});

test("rejects quota exceeded", () => {
  const r = validateReadModelV2(FIXTURE_CATALOG.quotaExceeded());
  assert.equal(r.ok, false);
  assert.ok(r.errors.some((e) => /MAX_WARNINGS|quota/i.test(e)));
});

test("checksum generation and verification deterministic", () => {
  const a = fixtureHealthy();
  const b = structuredClone(a);
  assert.equal(computeChecksum(a), computeChecksum(b));
  assert.equal(verifyChecksum(a).ok, true);
  assert.equal(canonicalize(a), canonicalize(b));
});

test("attachIntegrity excludes checksum from digest input", () => {
  const raw = fixtureHealthy();
  raw.integrity.checksum = "0".repeat(64);
  const attached = attachIntegrity(raw, { verified: true });
  assert.match(attached.integrity.checksum, /^[0-9a-f]{64}$/);
  assert.equal(verifyChecksum(attached).ok, true);
});

test("sanitizer allowlist emits v2 and preserves expedientes", () => {
  const s = sanitizeToV2(fixtureHealthy());
  assert.equal(s.ok, true);
  assert.equal(s.value.contractId, CONTRACT_ID);
  assert.ok(Array.isArray(s.value.expedientes));
  assert.equal("records" in s.value, false);
  assert.equal("contractName" in s.value, false);
});

test("sanitizer fail-closed on records", () => {
  const s = sanitizeToV2(FIXTURE_CATALOG.records());
  assert.equal(s.ok, false);
});

test("Registry ABSENT semantics", () => {
  const r = validateReadModelV2(FIXTURE_CATALOG.registryAbsent(), {
    now: "2026-07-23T12:30:00.000Z",
  });
  assert.equal(r.ok, true, r.errors?.join("; "));
  assert.equal(r.value.registryObservation.status, "ABSENT");
  assert.equal(r.value.registryObservation.entriesObserved, 0);
  assert.equal(r.value.registryObservation.registryVersion, null);
  assert.equal(r.value.registryObservation.lastObservedAt, null);
});

test("partial failure semantics accepted when marked PARTIAL", () => {
  const r = validateReadModelV2(FIXTURE_CATALOG.partial(), {
    now: "2026-07-23T12:30:00.000Z",
  });
  assert.equal(r.ok, true, r.errors?.join("; "));
  assert.equal(r.value.observationStatus, "PARTIAL");
});

test("exact enums enforced", () => {
  const bad = fixtureHealthy();
  bad.environment = "prod";
  bad.integrity.checksum = computeChecksum(bad);
  const r = validateReadModelV2(bad);
  assert.equal(r.ok, false);
});

test("rejects stale without SNAPSHOT_STALE", () => {
  const r = validateReadModelV2(FIXTURE_CATALOG.staleMissingWarning(), {
    now: "2026-07-23T12:00:00.000Z",
  });
  assert.equal(r.ok, false);
  assert.ok(r.errors.some((e) => /SNAPSHOT_STALE/i.test(e)));
});

test("rejects ownership/registry incoherence", () => {
  const r = validateReadModelV2(FIXTURE_CATALOG.ownershipRegistryMismatch(), {
    now: "2026-07-23T12:30:00.000Z",
  });
  assert.equal(r.ok, false);
  assert.ok(r.errors.some((e) => /ownership\.registry|registryObservation/i.test(e)));
});

test("rejects object depth exceeded", () => {
  const r = validateReadModelV2(FIXTURE_CATALOG.objectDepthExceeded());
  assert.equal(r.ok, false);
  assert.ok(r.errors.some((e) => /MAX_OBJECT_DEPTH|object depth/i.test(e)));
});

test("rejects array depth exceeded", () => {
  const r = validateReadModelV2(FIXTURE_CATALOG.arrayDepthExceeded());
  assert.equal(r.ok, false);
  assert.ok(r.errors.some((e) => /MAX_ARRAY_DEPTH|array depth/i.test(e)));
});

test("rejects unknown warning code", () => {
  const r = validateReadModelV2(FIXTURE_CATALOG.unknownWarningCode(), {
    now: "2026-07-23T12:30:00.000Z",
  });
  assert.equal(r.ok, false);
  assert.ok(r.errors.some((e) => /approved catalog|NOT_IN_CATALOG/i.test(e)));
});

test("rejects invalid phase id", () => {
  const r = validateReadModelV2(FIXTURE_CATALOG.invalidPhaseId(), {
    now: "2026-07-23T12:30:00.000Z",
  });
  assert.equal(r.ok, false);
  assert.ok(r.errors.some((e) => /phase id|CB-100/i.test(e)));
});

test("rejects missing required field", () => {
  const r = validateReadModelV2(FIXTURE_CATALOG.missingRequiredField(), {
    now: "2026-07-23T12:30:00.000Z",
  });
  assert.equal(r.ok, false);
  assert.ok(r.errors.some((e) => /ownership|required|Missing/i.test(e)));
});

test("rejects MAX_PAYLOAD_BYTES exceeded", () => {
  const r = validateReadModelV2(FIXTURE_CATALOG.payloadBytesExceeded(), {
    now: "2026-07-23T12:30:00.000Z",
  });
  assert.equal(r.ok, false);
  assert.ok(r.errors.some((e) => /MAX_PAYLOAD_BYTES/i.test(e)));
});

const failed = results.filter((r) => !r.ok);
console.log("");
console.log("====================================================");
console.log("II.2-IMPL READ MODEL CONTRACT V2 VALIDATION");
console.log("====================================================");
console.log(`total=${results.length} pass=${results.length - failed.length} fail=${failed.length}`);
if (failed.length) {
  console.log("FAILED:");
  for (const f of failed) console.log(` - ${f.name}: ${f.error}`);
  process.exitCode = 1;
} else {
  console.log("RESULT: ALL PASS");
}

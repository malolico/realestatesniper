/**
 * II.3-IMPL / II.3-IMPL.1 validation suite — Publication Eligibility.
 * Run: node src/integration/publicationEligibility/tests/runIi3PublicationEligibilityValidation.js
 *
 * No delivery, Auth, Edge, Supabase, React, or Factory Runtime side effects.
 */

import assert from "node:assert/strict";
import {
  DELIVERY_STATUS,
  ELIGIBLE,
  NOT_ELIGIBLE,
  evaluatePublicationEligibility,
  isPublicationEligible,
} from "../index.js";
import {
  buildReasonsFromIi2Errors,
  mapIi2ErrorToReasonCode,
} from "../reasons.js";
import {
  fixtureAtomicArray,
  fixtureAtomicFragment,
  fixtureAtomicNull,
  fixtureBadChecksum,
  fixtureContractName,
  fixtureHealthy,
  fixtureOwnershipRegistryMismatch,
  fixtureRecords,
  fixtureStale,
  fixtureStaleMissingWarning,
  fixtureUnknownRootField,
} from "../fixtures.js";

const results = [];
const NOW_FRESH = "2026-07-23T12:30:00.000Z";
const NOW_STALE = "2026-07-23T12:00:00.000Z";

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

function assertNoSideEffects(decision) {
  assert.ok(Array.isArray(decision.sideEffects));
  assert.equal(decision.sideEffects.length, 0);
  assert.equal(decision.delivery, DELIVERY_STATUS.NOT_AUTHORIZED);
}

test("eligible healthy snapshot → ELIGIBLE", () => {
  const d = evaluatePublicationEligibility(fixtureHealthy(), { now: NOW_FRESH });
  assert.equal(d.decision, ELIGIBLE);
  assert.equal(d.ii2.ok, true);
  assert.equal(d.reasons.length, 0);
  assertNoSideEffects(d);
  assert.equal(isPublicationEligible(fixtureHealthy(), { now: NOW_FRESH }), true);
});

test("stale with SNAPSHOT_STALE → ELIGIBLE (freshness stale, still eligible)", () => {
  const d = evaluatePublicationEligibility(fixtureStale(), { now: NOW_STALE });
  assert.equal(d.decision, ELIGIBLE);
  assert.equal(d.freshness, "stale");
  assertNoSideEffects(d);
});

test("II.2 invalid (bad checksum) → NOT_ELIGIBLE", () => {
  const d = evaluatePublicationEligibility(fixtureBadChecksum(), { now: NOW_FRESH });
  assert.equal(d.decision, NOT_ELIGIBLE);
  assert.equal(d.ii2.ok, false);
  assert.ok(d.reasons.length > 0);
  assert.ok(d.reasons.some((r) => /INTEGRITY|II2|UNSPECIFIED/i.test(r.code)));
  assertNoSideEffects(d);
});

test("stale without SNAPSHOT_STALE → NOT_ELIGIBLE", () => {
  const d = evaluatePublicationEligibility(fixtureStaleMissingWarning(), {
    now: NOW_STALE,
  });
  assert.equal(d.decision, NOT_ELIGIBLE);
  assert.ok(
    d.reasons.some(
      (r) =>
        r.code === "STALE_WITHOUT_SNAPSHOT_STALE" ||
        /SNAPSHOT_STALE/i.test(r.message)
    )
  );
  assertNoSideEffects(d);
});

test("ownership/registry incoherence → NOT_ELIGIBLE", () => {
  const d = evaluatePublicationEligibility(fixtureOwnershipRegistryMismatch(), {
    now: NOW_FRESH,
  });
  assert.equal(d.decision, NOT_ELIGIBLE);
  assert.ok(
    d.reasons.some(
      (r) =>
        r.code === "OWNERSHIP_REGISTRY_INCOHERENT" ||
        /ownership|registry/i.test(r.message)
    )
  );
  assertNoSideEffects(d);
});

test("unknown root field → NOT_ELIGIBLE", () => {
  const d = evaluatePublicationEligibility(fixtureUnknownRootField(), {
    now: NOW_FRESH,
  });
  assert.equal(d.decision, NOT_ELIGIBLE);
  assert.ok(d.reasons.some((r) => r.code === "UNKNOWN_OR_PROHIBITED_FIELD" || r.message));
  assertNoSideEffects(d);
});

test("prohibited nomenclature contractName → NOT_ELIGIBLE", () => {
  const d = evaluatePublicationEligibility(fixtureContractName(), { now: NOW_FRESH });
  assert.equal(d.decision, NOT_ELIGIBLE);
  assertNoSideEffects(d);
});

test("prohibited nomenclature records → NOT_ELIGIBLE", () => {
  const d = evaluatePublicationEligibility(fixtureRecords(), { now: NOW_FRESH });
  assert.equal(d.decision, NOT_ELIGIBLE);
  assertNoSideEffects(d);
});

test("atomic fragment → NOT_ELIGIBLE without claiming delivery", () => {
  const d = evaluatePublicationEligibility(fixtureAtomicFragment());
  assert.equal(d.decision, NOT_ELIGIBLE);
  assert.ok(d.reasons.some((r) => r.code === "ATOMIC_UNIT_INVALID"));
  assert.equal(d.ii2.errorCount, 0);
  assertNoSideEffects(d);
});

test("atomic array → NOT_ELIGIBLE", () => {
  const d = evaluatePublicationEligibility(fixtureAtomicArray());
  assert.equal(d.decision, NOT_ELIGIBLE);
  assert.ok(d.reasons.some((r) => r.code === "ATOMIC_UNIT_INVALID"));
  assertNoSideEffects(d);
});

test("atomic null → NOT_ELIGIBLE", () => {
  const d = evaluatePublicationEligibility(fixtureAtomicNull());
  assert.equal(d.decision, NOT_ELIGIBLE);
  assert.ok(
    d.reasons.some(
      (r) => r.code === "ATOMIC_UNIT_INVALID" || r.code === "CANDIDATE_NOT_OBJECT"
    )
  );
  assertNoSideEffects(d);
});

test("ELIGIBLE never authorizes delivery", () => {
  const d = evaluatePublicationEligibility(fixtureHealthy(), { now: NOW_FRESH });
  assert.equal(d.decision, ELIGIBLE);
  assert.equal(d.delivery, "NOT_AUTHORIZED");
  assert.deepEqual([...d.sideEffects], []);
});

test("decision is fail-closed: invalid never ELIGIBLE", () => {
  const invalids = [
    fixtureBadChecksum(),
    fixtureStaleMissingWarning(),
    fixtureOwnershipRegistryMismatch(),
    fixtureUnknownRootField(),
    fixtureAtomicFragment(),
  ];
  for (const c of invalids) {
    const d = evaluatePublicationEligibility(c, { now: NOW_STALE });
    assert.equal(d.decision, NOT_ELIGIBLE);
  }
});

test("II.2 gate throw → NOT_ELIGIBLE (fail-closed, no rethrow)", () => {
  const d = evaluatePublicationEligibility(fixtureHealthy(), {
    now: NOW_FRESH,
    validateReadModelV2: () => {
      const err = new Error("simulated gate failure with Bearer sk_test_abc");
      err.stack = "Error: simulated\n    at C:\\Users\\secret\\gate.js:1:1";
      throw err;
    },
  });
  assert.equal(d.decision, NOT_ELIGIBLE);
  assert.equal(d.ii2.ok, false);
  assert.ok(d.reasons.some((r) => r.code === "II2_VALIDATION_FAILED"));
  assert.ok(d.reasons.every((r) => !/sk_test_|Bearer|\\\\Users\\\\secret|stack/i.test(r.message)));
  assert.ok(!("stack" in d));
  assertNoSideEffects(d);
});

test("candidate snapshot remains immutable", () => {
  const candidate = fixtureHealthy();
  const before = JSON.stringify(candidate);
  evaluatePublicationEligibility(candidate, { now: NOW_FRESH });
  assert.equal(JSON.stringify(candidate), before);
  const invalid = fixtureBadChecksum();
  const beforeInvalid = JSON.stringify(invalid);
  evaluatePublicationEligibility(invalid, { now: NOW_FRESH });
  assert.equal(JSON.stringify(invalid), beforeInvalid);
});

test("unmappable II.2 error → UNSPECIFIED_II2_FAILURE", () => {
  assert.equal(
    mapIi2ErrorToReasonCode("totally-unmapped-xyz-no-taxonomy"),
    "UNSPECIFIED_II2_FAILURE"
  );
  const reasons = buildReasonsFromIi2Errors([
    "___no_pattern_match_for_eligibility_mapper___",
  ]);
  assert.equal(reasons.length, 1);
  assert.equal(reasons[0].code, "UNSPECIFIED_II2_FAILURE");
});

const failed = results.filter((r) => !r.ok);
console.log("");
console.log("====================================================");
console.log("II.3-IMPL PUBLICATION ELIGIBILITY VALIDATION");
console.log("====================================================");
console.log(
  `total=${results.length} pass=${results.length - failed.length} fail=${failed.length}`
);
if (failed.length) {
  console.log("FAILED:");
  for (const f of failed) console.log(` - ${f.name}: ${f.error}`);
  process.exitCode = 1;
} else {
  console.log("RESULT: ALL PASS");
  console.log("DELIVERY: NOT_AUTHORIZED (eligibility ≠ delivery)");
}

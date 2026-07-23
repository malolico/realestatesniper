/**
 * II.4-IMPL validation suite — Publication Unit Governance.
 * Run: node src/integration/publicationUnit/tests/runIi4PublicationUnitValidation.js
 *
 * No Delivery, Auth, Edge, Supabase, React, Producer, or Factory Runtime side effects.
 * Does not import validateReadModelV2 (II.2 only via II.3).
 */

import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import {
  DELIVERY_STATUS,
  UNIT_FORMED,
  UNIT_NOT_FORMED,
  UNIT_REJECTED,
  formPublicationUnit,
  isPublicationUnitFormed,
} from "../index.js";
import { ELIGIBLE } from "../../publicationEligibility/constants.js";
import {
  fixtureAtomicFragment,
  fixtureBadChecksum,
  fixtureEligibleMissingIntegrity,
  fixtureEligibleMissingSnapshotId,
  fixtureHealthy,
  fixtureOwnershipRegistryMismatch,
  fixtureStale,
  fixtureStaleMissingWarning,
} from "../fixtures.js";

const results = [];
const NOW_FRESH = "2026-07-23T12:30:00.000Z";
const NOW_STALE = "2026-07-23T12:00:00.000Z";
const __dirname = dirname(fileURLToPath(import.meta.url));

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

function assertNoDelivery(outcome) {
  assert.equal(outcome.delivery, DELIVERY_STATUS.NOT_AUTHORIZED);
  assert.ok(Array.isArray(outcome.sideEffects));
  assert.equal(outcome.sideEffects.length, 0);
  assert.ok(Object.isFrozen(outcome));
  assert.ok(Object.isFrozen(outcome.sideEffects));
}

test("ELIGIBLE healthy → UNIT_FORMED", () => {
  const candidate = fixtureHealthy();
  const o = formPublicationUnit(candidate, { now: NOW_FRESH });
  assert.equal(o.status, UNIT_FORMED);
  assert.ok(o.publicationUnit);
  assert.equal(o.eligibility.decision, ELIGIBLE);
  assert.equal(isPublicationUnitFormed(candidate, { now: NOW_FRESH }), true);
  assertNoDelivery(o);
});

test("stale with SNAPSHOT_STALE → UNIT_FORMED", () => {
  const o = formPublicationUnit(fixtureStale(), { now: NOW_STALE });
  assert.equal(o.status, UNIT_FORMED);
  assertNoDelivery(o);
});

test("NOT_ELIGIBLE (bad checksum) → UNIT_NOT_FORMED", () => {
  const o = formPublicationUnit(fixtureBadChecksum(), { now: NOW_FRESH });
  assert.equal(o.status, UNIT_NOT_FORMED);
  assert.equal(o.publicationUnit, null);
  assert.ok(o.reasons.some((r) => r.code === "NOT_ELIGIBLE"));
  assertNoDelivery(o);
});

test("NOT_ELIGIBLE (stale missing warning) → UNIT_NOT_FORMED", () => {
  const o = formPublicationUnit(fixtureStaleMissingWarning(), { now: NOW_STALE });
  assert.equal(o.status, UNIT_NOT_FORMED);
  assert.equal(o.publicationUnit, null);
  assertNoDelivery(o);
});

test("NOT_ELIGIBLE (ownership) → UNIT_NOT_FORMED", () => {
  const o = formPublicationUnit(fixtureOwnershipRegistryMismatch(), {
    now: NOW_FRESH,
  });
  assert.equal(o.status, UNIT_NOT_FORMED);
  assertNoDelivery(o);
});

test("atomic fragment → UNIT_NOT_FORMED (not ELIGIBLE)", () => {
  const o = formPublicationUnit(fixtureAtomicFragment());
  assert.equal(o.status, UNIT_NOT_FORMED);
  assert.equal(o.publicationUnit, null);
  assertNoDelivery(o);
});

test("no parallel II.2 gate in publicationUnit sources", () => {
  const root = join(__dirname, "..");
  const files = [
    "index.js",
    "constants.js",
    "reasons.js",
    "atomicity.js",
    "fixtures.js",
  ];
  for (const name of files) {
    const src = readFileSync(join(root, name), "utf8");
    assert.equal(
      /import\s*\{[^}]*validateReadModelV2|from\s+["'][^"']*readModel\/validator/.test(
        src
      ),
      false,
      `${name} must not import II.2 validator`
    );
    assert.equal(
      /from\s+["'][^"']*\/readModel\//.test(src),
      false,
      `${name} must not import readModel modules`
    );
  }
  const fixturesSrc = readFileSync(join(root, "fixtures.js"), "utf8");
  assert.match(fixturesSrc, /publicationEligibility\/fixtures/);
});

test("sole path is evaluatePublicationEligibility (injection observed)", () => {
  let calls = 0;
  const o = formPublicationUnit(fixtureHealthy(), {
    now: NOW_FRESH,
    evaluatePublicationEligibility: (candidate, opts) => {
      calls += 1;
      assert.ok(candidate);
      assert.equal(opts.now, NOW_FRESH);
      return {
        decision: ELIGIBLE,
        delivery: "NOT_AUTHORIZED",
        reasons: [],
        ii2: { ok: true, errorCount: 0 },
        sideEffects: [],
      };
    },
  });
  assert.equal(calls, 1);
  assert.equal(o.status, UNIT_FORMED);
  assertNoDelivery(o);
});

test("candidate remains immutable", () => {
  const candidate = fixtureHealthy();
  const before = JSON.stringify(candidate);
  formPublicationUnit(candidate, { now: NOW_FRESH });
  assert.equal(JSON.stringify(candidate), before);
  const invalid = fixtureBadChecksum();
  const beforeInvalid = JSON.stringify(invalid);
  formPublicationUnit(invalid, { now: NOW_FRESH });
  assert.equal(JSON.stringify(invalid), beforeInvalid);
});

test("outcome is frozen", () => {
  const o = formPublicationUnit(fixtureHealthy(), { now: NOW_FRESH });
  assert.ok(Object.isFrozen(o));
  assert.ok(Object.isFrozen(o.reasons));
  assert.throws(() => {
    o.status = "HACKED";
  }, TypeError);
});

test("publicationUnit is frozen when formed", () => {
  const o = formPublicationUnit(fixtureHealthy(), { now: NOW_FRESH });
  assert.equal(o.status, UNIT_FORMED);
  assert.ok(Object.isFrozen(o.publicationUnit));
  assert.ok(Object.isFrozen(o.publicationUnit.integrity));
  assert.throws(() => {
    o.publicationUnit.snapshotId = "tampered";
  }, TypeError);
});

test("atomic complete snapshot binding (same reference, not partial copy)", () => {
  const candidate = fixtureHealthy();
  const o = formPublicationUnit(candidate, { now: NOW_FRESH });
  assert.equal(o.publicationUnit.snapshot, candidate);
});

test("binds snapshotId from II.2 identity", () => {
  const candidate = fixtureHealthy();
  const o = formPublicationUnit(candidate, { now: NOW_FRESH });
  assert.equal(o.publicationUnit.snapshotId, candidate.snapshotId);
  assert.ok(typeof o.publicationUnit.snapshotId === "string");
  assert.ok(o.publicationUnit.snapshotId.length > 0);
});

test("binds integrity metadata", () => {
  const candidate = fixtureHealthy();
  const o = formPublicationUnit(candidate, { now: NOW_FRESH });
  assert.equal(
    o.publicationUnit.integrity.checksum,
    candidate.integrity.checksum
  );
  assert.equal(
    o.publicationUnit.integrity.algorithm,
    candidate.integrity.algorithm
  );
});

test("binds ELIGIBLE decision", () => {
  const o = formPublicationUnit(fixtureHealthy(), { now: NOW_FRESH });
  assert.equal(o.publicationUnit.eligibilityDecision, ELIGIBLE);
  assert.equal(o.eligibility.decision, ELIGIBLE);
});

test("delivery NOT_AUTHORIZED and sideEffects [] on all paths", () => {
  const cases = [
    formPublicationUnit(fixtureHealthy(), { now: NOW_FRESH }),
    formPublicationUnit(fixtureBadChecksum(), { now: NOW_FRESH }),
    formPublicationUnit(fixtureAtomicFragment()),
    formPublicationUnit(fixtureEligibleMissingSnapshotId(), {
      evaluatePublicationEligibility: () => ({
        decision: ELIGIBLE,
        delivery: "NOT_AUTHORIZED",
        reasons: [],
        ii2: { ok: true, errorCount: 0 },
        sideEffects: [],
      }),
    }),
  ];
  for (const o of cases) assertNoDelivery(o);
});

test("II.3 evaluation throw → UNIT_NOT_FORMED (fail-closed)", () => {
  const o = formPublicationUnit(fixtureHealthy(), {
    now: NOW_FRESH,
    evaluatePublicationEligibility: () => {
      throw new Error("simulated II.3 failure with Bearer sk_test_abc");
    },
  });
  assert.equal(o.status, UNIT_NOT_FORMED);
  assert.equal(o.publicationUnit, null);
  assert.ok(o.reasons.some((r) => r.code === "II3_EVALUATION_FAILED"));
  assert.ok(o.reasons.every((r) => !/sk_test_|Bearer/i.test(r.message)));
  assertNoDelivery(o);
});

test("UNIT_NOT_FORMED vs UNIT_REJECTED are distinct", () => {
  const notFormed = formPublicationUnit(fixtureBadChecksum(), { now: NOW_FRESH });
  assert.equal(notFormed.status, UNIT_NOT_FORMED);

  const rejectedId = formPublicationUnit(fixtureEligibleMissingSnapshotId(), {
    evaluatePublicationEligibility: () => ({
      decision: ELIGIBLE,
      delivery: "NOT_AUTHORIZED",
      reasons: [],
      ii2: { ok: true, errorCount: 0 },
      sideEffects: [],
    }),
  });
  assert.equal(rejectedId.status, UNIT_REJECTED);
  assert.ok(rejectedId.reasons.some((r) => r.code === "MISSING_SNAPSHOT_ID"));

  const rejectedIntegrity = formPublicationUnit(
    fixtureEligibleMissingIntegrity(),
    {
      evaluatePublicationEligibility: () => ({
        decision: ELIGIBLE,
        delivery: "NOT_AUTHORIZED",
        reasons: [],
        ii2: { ok: true, errorCount: 0 },
        sideEffects: [],
      }),
    }
  );
  assert.equal(rejectedIntegrity.status, UNIT_REJECTED);
  assert.ok(
    rejectedIntegrity.reasons.some((r) => r.code === "MISSING_OR_INVALID_INTEGRITY")
  );

  assert.notEqual(notFormed.status, rejectedId.status);
  assertNoDelivery(notFormed);
  assertNoDelivery(rejectedId);
  assertNoDelivery(rejectedIntegrity);
});

test("no I/O / persistence / transport / Producer markers in module sources", () => {
  const root = join(__dirname, "..");
  const src = ["index.js", "constants.js", "reasons.js", "atomicity.js"]
    .map((f) => readFileSync(join(root, f), "utf8"))
    .join("\n");
  assert.equal(
    /from\s+["']node:(fs|http|https|net|child_process|dns)["']|require\(["'](fs|http|https|net|child_process)["']\)|writeFileSync|createWriteStream|\bfetch\s*\(|\bsetTimeout\s*\(|\bsetInterval\s*\(/.test(
      src
    ),
    false
  );
});

const failed = results.filter((r) => !r.ok);
console.log("");
console.log("====================================================");
console.log("II.4-IMPL PUBLICATION UNIT GOVERNANCE VALIDATION");
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
  console.log("DELIVERY: NOT_AUTHORIZED (UNIT_FORMED ≠ delivered)");
}

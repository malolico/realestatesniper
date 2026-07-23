/**
 * II.5-IMPL validation suite — Handoff / Release Readiness Governance.
 * Run: node src/integration/handoffReadiness/tests/runIi5HandoffReadinessValidation.js
 *
 * Sole upstream oracle: formPublicationUnit (II.4).
 * No Delivery, handoff execution, Auth, Edge, Supabase, React, or Producer.
 */

import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import {
  DELIVERY_STATUS,
  HANDOFF_EXECUTION_STATUS,
  HANDOFF_READY,
  HANDOFF_REJECTED,
  NOT_HANDOFF_READY,
  evaluateHandoffReadiness,
  isHandoffReady,
} from "../index.js";
import {
  UNIT_FORMED,
  UNIT_NOT_FORMED,
  UNIT_REJECTED,
  formPublicationUnit,
} from "../../publicationUnit/index.js";
import {
  fixtureAtomicFragment,
  fixtureBadChecksum,
  fixtureHealthy,
  fixtureOwnershipRegistryMismatch,
  fixtureStale,
  fixtureStaleMissingWarning,
  syntheticUnitFormedOutcome,
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

function assertFences(outcome) {
  assert.equal(outcome.delivery, DELIVERY_STATUS.NOT_AUTHORIZED);
  assert.equal(outcome.handoffExecution, HANDOFF_EXECUTION_STATUS.NOT_AUTHORIZED);
  assert.ok(Array.isArray(outcome.sideEffects));
  assert.equal(outcome.sideEffects.length, 0);
  assert.ok(Object.isFrozen(outcome));
  assert.ok(Object.isFrozen(outcome.sideEffects));
}

test("UNIT_FORMED healthy → HANDOFF_READY", () => {
  const candidate = fixtureHealthy();
  const o = evaluateHandoffReadiness(candidate, { now: NOW_FRESH });
  assert.equal(o.status, HANDOFF_READY);
  assert.equal(o.upstream.status, UNIT_FORMED);
  assert.ok(o.publicationUnit);
  assert.equal(isHandoffReady(candidate, { now: NOW_FRESH }), true);
  assert.ok(o.manifest);
  assert.ok(Object.isFrozen(o.manifest));
  assertFences(o);
});

test("stale UNIT_FORMED → HANDOFF_READY", () => {
  const o = evaluateHandoffReadiness(fixtureStale(), { now: NOW_STALE });
  assert.equal(o.status, HANDOFF_READY);
  assertFences(o);
});

test("UNIT_NOT_FORMED (bad checksum) → NOT_HANDOFF_READY", () => {
  const o = evaluateHandoffReadiness(fixtureBadChecksum(), { now: NOW_FRESH });
  assert.equal(o.status, NOT_HANDOFF_READY);
  assert.equal(o.upstream.status, UNIT_NOT_FORMED);
  assert.equal(o.publicationUnit, null);
  assert.ok(o.reasons.some((r) => r.code === "UPSTREAM_NOT_FORMED"));
  assertFences(o);
});

test("UNIT_NOT_FORMED (stale missing warning) → NOT_HANDOFF_READY", () => {
  const o = evaluateHandoffReadiness(fixtureStaleMissingWarning(), {
    now: NOW_STALE,
  });
  assert.equal(o.status, NOT_HANDOFF_READY);
  assertFences(o);
});

test("UNIT_NOT_FORMED (ownership) → NOT_HANDOFF_READY", () => {
  const o = evaluateHandoffReadiness(fixtureOwnershipRegistryMismatch(), {
    now: NOW_FRESH,
  });
  assert.equal(o.status, NOT_HANDOFF_READY);
  assertFences(o);
});

test("atomic fragment → NOT_HANDOFF_READY (upstream not formed)", () => {
  const o = evaluateHandoffReadiness(fixtureAtomicFragment());
  assert.equal(o.status, NOT_HANDOFF_READY);
  assert.ok(
    o.upstream.status === UNIT_NOT_FORMED || o.upstream.status === UNIT_REJECTED
  );
  assertFences(o);
});

test("injected UNIT_REJECTED → NOT_HANDOFF_READY", () => {
  const o = evaluateHandoffReadiness(fixtureHealthy(), {
    formPublicationUnit: () =>
      Object.freeze({
        status: UNIT_REJECTED,
        reasons: Object.freeze([]),
        publicationUnit: null,
        delivery: "NOT_AUTHORIZED",
        sideEffects: Object.freeze([]),
      }),
  });
  assert.equal(o.status, NOT_HANDOFF_READY);
  assert.equal(o.upstream.status, UNIT_REJECTED);
  assertFences(o);
});

test("II.4 throw → NOT_HANDOFF_READY (fail-closed)", () => {
  const o = evaluateHandoffReadiness(fixtureHealthy(), {
    formPublicationUnit: () => {
      throw new Error("simulated II.4 failure with Bearer sk_test_abc");
    },
  });
  assert.equal(o.status, NOT_HANDOFF_READY);
  assert.ok(o.reasons.some((r) => r.code === "II4_EVALUATION_FAILED"));
  assert.ok(o.reasons.every((r) => !/sk_test_|Bearer/i.test(r.message)));
  assertFences(o);
});

test("incomplete II.4 outcome → NOT_HANDOFF_READY", () => {
  const o = evaluateHandoffReadiness(fixtureHealthy(), {
    formPublicationUnit: () => null,
  });
  assert.equal(o.status, NOT_HANDOFF_READY);
  assert.ok(o.reasons.some((r) => r.code === "INCOMPLETE_EVALUATION"));
  assertFences(o);
});

test("UNIT_FORMED without status field → NOT_HANDOFF_READY", () => {
  const o = evaluateHandoffReadiness(fixtureHealthy(), {
    formPublicationUnit: () => ({ publicationUnit: {} }),
  });
  assert.equal(o.status, NOT_HANDOFF_READY);
  assertFences(o);
});

test("HANDOFF_REJECTED: snapshotId continuity failed", () => {
  const candidate = fixtureHealthy();
  const o = evaluateHandoffReadiness(candidate, {
    formPublicationUnit: () =>
      syntheticUnitFormedOutcome(
        Object.freeze({
          snapshotId: "",
          snapshot: candidate,
          integrity: Object.freeze({
            algorithm: "SHA-256",
            canonicalization: "JCS",
            checksum: candidate.integrity.checksum,
            verified: true,
          }),
          eligibilityDecision: "ELIGIBLE",
        })
      ),
  });
  assert.equal(o.status, HANDOFF_REJECTED);
  assert.ok(o.reasons.some((r) => r.code === "SNAPSHOT_ID_CONTINUITY_FAILED"));
  assertFences(o);
});

test("HANDOFF_REJECTED: integrity continuity failed", () => {
  const candidate = fixtureHealthy();
  const o = evaluateHandoffReadiness(candidate, {
    formPublicationUnit: () =>
      syntheticUnitFormedOutcome(
        Object.freeze({
          snapshotId: candidate.snapshotId,
          snapshot: candidate,
          integrity: Object.freeze({
            algorithm: "SHA-256",
            canonicalization: "JCS",
            checksum: "",
            verified: false,
          }),
          eligibilityDecision: "ELIGIBLE",
        })
      ),
  });
  assert.equal(o.status, HANDOFF_REJECTED);
  assert.ok(o.reasons.some((r) => r.code === "INTEGRITY_CONTINUITY_FAILED"));
  assertFences(o);
});

test("HANDOFF_REJECTED: illicit Delivery claim (specific II.5 rule)", () => {
  const candidate = fixtureHealthy();
  const o = evaluateHandoffReadiness(candidate, {
    formPublicationUnit: () =>
      syntheticUnitFormedOutcome(
        Object.freeze({
          snapshotId: candidate.snapshotId,
          snapshot: candidate,
          integrity: Object.freeze({ ...candidate.integrity }),
          eligibilityDecision: "ELIGIBLE",
          delivery: "AUTHORIZED",
        })
      ),
  });
  assert.equal(o.status, HANDOFF_REJECTED);
  assert.ok(o.reasons.some((r) => r.code === "ILLICIT_DELIVERY_CLAIM"));
  assertFences(o);
});

test("preserves snapshotId exactly", () => {
  const candidate = fixtureHealthy();
  const o = evaluateHandoffReadiness(candidate, { now: NOW_FRESH });
  assert.equal(o.publicationUnit.snapshotId, candidate.snapshotId);
  assert.equal(o.manifest.snapshotId, candidate.snapshotId);
});

test("preserves integrity metadata exactly", () => {
  const candidate = fixtureHealthy();
  const formed = formPublicationUnit(candidate, { now: NOW_FRESH });
  const o = evaluateHandoffReadiness(candidate, { now: NOW_FRESH });
  assert.equal(
    o.publicationUnit.integrity.checksum,
    formed.publicationUnit.integrity.checksum
  );
  assert.equal(
    o.publicationUnit.integrity.algorithm,
    formed.publicationUnit.integrity.algorithm
  );
});

test("preserves identity / provenance on bound snapshot", () => {
  const candidate = fixtureHealthy();
  const o = evaluateHandoffReadiness(candidate, { now: NOW_FRESH });
  assert.equal(o.publicationUnit.snapshot, candidate);
  assert.equal(o.publicationUnit.snapshot.snapshotId, candidate.snapshotId);
  assert.deepEqual(
    o.publicationUnit.snapshot.sourceProvenance,
    candidate.sourceProvenance
  );
});

test("candidate remains immutable", () => {
  const candidate = fixtureHealthy();
  const before = JSON.stringify(candidate);
  evaluateHandoffReadiness(candidate, { now: NOW_FRESH });
  assert.equal(JSON.stringify(candidate), before);
});

test("Publication Unit / snapshot not mutated", () => {
  const candidate = fixtureHealthy();
  const formed = formPublicationUnit(candidate, { now: NOW_FRESH });
  const unitBefore = JSON.stringify(formed.publicationUnit);
  const snapBefore = JSON.stringify(formed.publicationUnit.snapshot);
  evaluateHandoffReadiness(candidate, {
    now: NOW_FRESH,
    formPublicationUnit: () => formed,
  });
  assert.equal(JSON.stringify(formed.publicationUnit), unitBefore);
  assert.equal(JSON.stringify(formed.publicationUnit.snapshot), snapBefore);
});

test("outcome and manifest are frozen", () => {
  const o = evaluateHandoffReadiness(fixtureHealthy(), { now: NOW_FRESH });
  assert.ok(Object.isFrozen(o));
  assert.ok(Object.isFrozen(o.reasons));
  assert.ok(Object.isFrozen(o.manifest));
  assert.throws(() => {
    o.status = "HACKED";
  }, TypeError);
  assert.throws(() => {
    o.manifest.snapshotId = "tampered";
  }, TypeError);
});

test("delivery / handoffExecution / sideEffects fences on all paths", () => {
  const cases = [
    evaluateHandoffReadiness(fixtureHealthy(), { now: NOW_FRESH }),
    evaluateHandoffReadiness(fixtureBadChecksum(), { now: NOW_FRESH }),
    evaluateHandoffReadiness(fixtureAtomicFragment()),
    evaluateHandoffReadiness(fixtureHealthy(), {
      formPublicationUnit: () => {
        throw new Error("x");
      },
    }),
  ];
  for (const o of cases) assertFences(o);
});

test("no second II.2 gate / no evaluatePublicationEligibility as readiness oracle", () => {
  const root = join(__dirname, "..");
  const files = [
    "index.js",
    "constants.js",
    "reasons.js",
    "continuity.js",
    "evaluate.js",
    "manifestMetadata.js",
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
      /import\s*\{[^}]*evaluatePublicationEligibility|from\s+["'][^"']*publicationEligibility/.test(
        src
      ),
      false,
      `${name} must not import publicationEligibility / evaluatePublicationEligibility`
    );
    assert.equal(
      /from\s+["'][^"']*\/readModel\//.test(src),
      false,
      `${name} must not import readModel`
    );
  }
  const evaluateSrc = readFileSync(join(root, "evaluate.js"), "utf8");
  assert.match(evaluateSrc, /formPublicationUnit/);
});

test("no I/O / persistence / transport markers in runtime modules", () => {
  const root = join(__dirname, "..");
  const src = [
    "index.js",
    "constants.js",
    "reasons.js",
    "continuity.js",
    "evaluate.js",
    "manifestMetadata.js",
  ]
    .map((f) => readFileSync(join(root, f), "utf8"))
    .join("\n");
  assert.equal(
    /from\s+["']node:(fs|http|https|net|child_process|dns)["']|require\(["'](fs|http|https|net|child_process)["']\)|writeFileSync|createWriteStream|\bfetch\s*\(|\bsetTimeout\s*\(|\bsetInterval\s*\(/.test(
      src
    ),
    false
  );
});

test("sole injected seam is formPublicationUnit", () => {
  let calls = 0;
  const candidate = fixtureHealthy();
  const formed = formPublicationUnit(candidate, { now: NOW_FRESH });
  const o = evaluateHandoffReadiness(candidate, {
    now: NOW_FRESH,
    formPublicationUnit: (c, opts) => {
      calls += 1;
      assert.equal(c, candidate);
      assert.equal(opts.now, NOW_FRESH);
      return formed;
    },
  });
  assert.equal(calls, 1);
  assert.equal(o.status, HANDOFF_READY);
  assertFences(o);
});

const failed = results.filter((r) => !r.ok);
console.log("");
console.log("====================================================");
console.log("II.5-IMPL HANDOFF READINESS GOVERNANCE VALIDATION");
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
  console.log("DELIVERY: NOT_AUTHORIZED");
  console.log("HANDOFF_EXECUTION: NOT_AUTHORIZED");
}

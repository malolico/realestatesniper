/**
 * II.6-IMPL validation suite — Publication Handoff Execution Governance.
 * Run: node src/integration/handoffExecution/tests/runIi6HandoffExecutionValidation.js
 *
 * Sole upstream oracle: evaluateHandoffReadiness (II.5).
 * No Delivery, persistence, transport, Auth, Edge, Supabase, React, or Producer.
 * Covers Spec §25 items 1–22 (items 23–26 = II.2–II.5 regression runners).
 */

import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import {
  AUTHENTICATION_STATUS,
  DELIVERY_STATUS,
  EXPOSURE_STATUS,
  HANDOFF_EXECUTED,
  HANDOFF_EXECUTION_REJECTED,
  HANDOFF_NOT_EXECUTED,
  PERSISTENCE_STATUS,
  TRANSPORT_STATUS,
  evaluateHandoffExecution,
  isHandoffExecuted,
} from "../index.js";
import {
  HANDOFF_READY,
  HANDOFF_REJECTED,
  NOT_HANDOFF_READY,
  evaluateHandoffReadiness,
} from "../../handoffReadiness/index.js";
import {
  fixtureAtomicFragment,
  fixtureBadChecksum,
  fixtureHealthy,
  fixtureOwnershipRegistryMismatch,
  fixtureStale,
  fixtureStaleMissingWarning,
  syntheticHandoffReadyOutcome,
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
  assert.equal(outcome.persistence, PERSISTENCE_STATUS.NOT_AUTHORIZED);
  assert.equal(outcome.transport, TRANSPORT_STATUS.NOT_AUTHORIZED);
  assert.equal(outcome.authentication, AUTHENTICATION_STATUS.NOT_AUTHORIZED);
  assert.equal(outcome.exposure, EXPOSURE_STATUS.NOT_AUTHORIZED);
  assert.ok(Array.isArray(outcome.sideEffects));
  assert.equal(outcome.sideEffects.length, 0);
  assert.ok(Object.isFrozen(outcome));
  assert.ok(Object.isFrozen(outcome.sideEffects));
  assert.ok(Object.isFrozen(outcome.reasons));
}

function healthyReadyUnit(candidate) {
  const ready = evaluateHandoffReadiness(candidate, { now: NOW_FRESH });
  assert.equal(ready.status, HANDOFF_READY);
  return ready;
}

// --- Spec §25.1 Valid HANDOFF_EXECUTED from HANDOFF_READY ---

test("§25.1 HANDOFF_READY healthy → HANDOFF_EXECUTED", () => {
  const candidate = fixtureHealthy();
  const o = evaluateHandoffExecution(candidate, { now: NOW_FRESH });
  assert.equal(o.status, HANDOFF_EXECUTED);
  assert.ok(o.publicationUnit);
  assert.equal(o.readinessOutcome.status, HANDOFF_READY);
  assert.equal(isHandoffExecuted(candidate, { now: NOW_FRESH }), true);
  assert.ok(o.reasons.some((r) => r.code === "HANDOFF_EXECUTED"));
  assertFences(o);
});

test("§25.1 stale HANDOFF_READY → HANDOFF_EXECUTED", () => {
  const o = evaluateHandoffExecution(fixtureStale(), { now: NOW_STALE });
  assert.equal(o.status, HANDOFF_EXECUTED);
  assertFences(o);
});

test("§25.1 precomputed readinessOutcome HANDOFF_READY → HANDOFF_EXECUTED", () => {
  const candidate = fixtureHealthy();
  const ready = healthyReadyUnit(candidate);
  const o = evaluateHandoffExecution(candidate, {
    now: NOW_FRESH,
    readinessOutcome: ready,
  });
  assert.equal(o.status, HANDOFF_EXECUTED);
  assert.equal(o.publicationUnit, ready.publicationUnit);
  assertFences(o);
});

// --- Spec §25.2 II.5 ≠ HANDOFF_READY → HANDOFF_NOT_EXECUTED ---

test("§25.2 NOT_HANDOFF_READY (bad checksum) → HANDOFF_NOT_EXECUTED", () => {
  const o = evaluateHandoffExecution(fixtureBadChecksum(), { now: NOW_FRESH });
  assert.equal(o.status, HANDOFF_NOT_EXECUTED);
  assert.equal(o.publicationUnit, null);
  assert.ok(o.reasons.some((r) => r.code === "UPSTREAM_NOT_READY"));
  assert.equal(o.readinessOutcome.status, NOT_HANDOFF_READY);
  assertFences(o);
});

test("§25.2 NOT_HANDOFF_READY (stale missing warning) → HANDOFF_NOT_EXECUTED", () => {
  const o = evaluateHandoffExecution(fixtureStaleMissingWarning(), {
    now: NOW_STALE,
  });
  assert.equal(o.status, HANDOFF_NOT_EXECUTED);
  assertFences(o);
});

test("§25.2 NOT_HANDOFF_READY (ownership) → HANDOFF_NOT_EXECUTED", () => {
  const o = evaluateHandoffExecution(fixtureOwnershipRegistryMismatch(), {
    now: NOW_FRESH,
  });
  assert.equal(o.status, HANDOFF_NOT_EXECUTED);
  assertFences(o);
});

test("§25.2 atomic fragment → HANDOFF_NOT_EXECUTED", () => {
  const o = evaluateHandoffExecution(fixtureAtomicFragment());
  assert.equal(o.status, HANDOFF_NOT_EXECUTED);
  assertFences(o);
});

test("§25.2 injected HANDOFF_REJECTED → HANDOFF_NOT_EXECUTED (never REJECTED)", () => {
  const o = evaluateHandoffExecution(fixtureHealthy(), {
    evaluateHandoffReadiness: () =>
      Object.freeze({
        status: HANDOFF_REJECTED,
        reasons: Object.freeze([]),
        publicationUnit: null,
        delivery: "NOT_AUTHORIZED",
        handoffExecution: "NOT_AUTHORIZED",
        sideEffects: Object.freeze([]),
      }),
  });
  assert.equal(o.status, HANDOFF_NOT_EXECUTED);
  assert.notEqual(o.status, HANDOFF_EXECUTION_REJECTED);
  assert.ok(o.reasons.some((r) => r.code === "UPSTREAM_NOT_READY"));
  assertFences(o);
});

// --- Spec §25.3 Exception → HANDOFF_NOT_EXECUTED ---

test("§25.3 II.5 throw → HANDOFF_NOT_EXECUTED (fail-closed)", () => {
  const o = evaluateHandoffExecution(fixtureHealthy(), {
    evaluateHandoffReadiness: () => {
      throw new Error("simulated II.5 failure with Bearer sk_test_abc");
    },
  });
  assert.equal(o.status, HANDOFF_NOT_EXECUTED);
  assert.ok(o.reasons.some((r) => r.code === "II5_EVALUATION_FAILED"));
  assert.ok(o.reasons.every((r) => !/sk_test_|Bearer/i.test(r.message)));
  assert.equal(o.readinessOutcome, null);
  assertFences(o);
});

// --- Spec §25.4 Incomplete evaluation → HANDOFF_NOT_EXECUTED ---

test("§25.4 incomplete II.5 outcome (null) → HANDOFF_NOT_EXECUTED", () => {
  const o = evaluateHandoffExecution(fixtureHealthy(), {
    evaluateHandoffReadiness: () => null,
  });
  assert.equal(o.status, HANDOFF_NOT_EXECUTED);
  assert.ok(o.reasons.some((r) => r.code === "INCOMPLETE_EVALUATION"));
  assertFences(o);
});

test("§25.4 incomplete II.5 outcome (missing status) → HANDOFF_NOT_EXECUTED", () => {
  const o = evaluateHandoffExecution(fixtureHealthy(), {
    evaluateHandoffReadiness: () => ({ publicationUnit: {} }),
  });
  assert.equal(o.status, HANDOFF_NOT_EXECUTED);
  assert.ok(o.reasons.some((r) => r.code === "INCOMPLETE_EVALUATION"));
  assertFences(o);
});

test("§25.4 HANDOFF_READY without usable unit → HANDOFF_EXECUTION_REJECTED (unit binding)", () => {
  const o = evaluateHandoffExecution(fixtureHealthy(), {
    readinessOutcome: syntheticHandoffReadyOutcome(null),
  });
  assert.equal(o.status, HANDOFF_EXECUTION_REJECTED);
  assert.ok(
    o.reasons.some((r) => r.code === "PUBLICATION_UNIT_BINDING_FAILED")
  );
  assertFences(o);
});

test("§25.4 incomplete evaluation (empty status string) → HANDOFF_NOT_EXECUTED", () => {
  const o = evaluateHandoffExecution(fixtureHealthy(), {
    evaluateHandoffReadiness: () =>
      Object.freeze({
        status: "",
        publicationUnit: null,
      }),
  });
  assert.equal(o.status, HANDOFF_NOT_EXECUTED);
  assert.ok(o.reasons.some((r) => r.code === "INCOMPLETE_EVALUATION"));
  assertFences(o);
});

// --- Spec §25.5 Specific II.6 violation → HANDOFF_EXECUTION_REJECTED ---

test("§25.5 HANDOFF_EXECUTION_REJECTED: snapshotId continuity failed", () => {
  const candidate = fixtureHealthy();
  const o = evaluateHandoffExecution(candidate, {
    evaluateHandoffReadiness: () =>
      syntheticHandoffReadyOutcome(
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
  assert.equal(o.status, HANDOFF_EXECUTION_REJECTED);
  assert.ok(o.reasons.some((r) => r.code === "SNAPSHOT_ID_CONTINUITY_FAILED"));
  assertFences(o);
});

test("§25.5 HANDOFF_EXECUTION_REJECTED: integrity continuity failed", () => {
  const candidate = fixtureHealthy();
  const o = evaluateHandoffExecution(candidate, {
    evaluateHandoffReadiness: () =>
      syntheticHandoffReadyOutcome(
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
  assert.equal(o.status, HANDOFF_EXECUTION_REJECTED);
  assert.ok(o.reasons.some((r) => r.code === "INTEGRITY_CONTINUITY_FAILED"));
  assertFences(o);
});

test("§25.5 HANDOFF_EXECUTION_REJECTED: identity continuity (snapshot mismatch)", () => {
  const candidate = fixtureHealthy();
  const other = fixtureHealthy();
  const o = evaluateHandoffExecution(candidate, {
    evaluateHandoffReadiness: () =>
      syntheticHandoffReadyOutcome(
        Object.freeze({
          snapshotId: candidate.snapshotId,
          snapshot: other,
          integrity: Object.freeze({ ...candidate.integrity }),
          eligibilityDecision: "ELIGIBLE",
        })
      ),
  });
  assert.equal(o.status, HANDOFF_EXECUTION_REJECTED);
  assert.ok(o.reasons.some((r) => r.code === "IDENTITY_CONTINUITY_FAILED"));
  assertFences(o);
});

test("§25.5 HANDOFF_EXECUTION_REJECTED: provenance continuity failed", () => {
  const base = fixtureHealthy();
  const broken = {
    ...base,
    sourceProvenance: null,
  };
  const o = evaluateHandoffExecution(broken, {
    evaluateHandoffReadiness: () =>
      syntheticHandoffReadyOutcome(
        Object.freeze({
          snapshotId: base.snapshotId,
          snapshot: broken,
          integrity: Object.freeze({ ...base.integrity }),
          eligibilityDecision: "ELIGIBLE",
        })
      ),
  });
  assert.equal(o.status, HANDOFF_EXECUTION_REJECTED);
  assert.ok(o.reasons.some((r) => r.code === "PROVENANCE_CONTINUITY_FAILED"));
  assertFences(o);
});

test("§25.5 HANDOFF_EXECUTION_REJECTED: illicit Delivery claim", () => {
  const candidate = fixtureHealthy();
  const unit = Object.freeze({
    snapshotId: candidate.snapshotId,
    snapshot: candidate,
    integrity: Object.freeze({ ...candidate.integrity }),
    eligibilityDecision: "ELIGIBLE",
  });
  const o = evaluateHandoffExecution(candidate, {
    readinessOutcome: syntheticHandoffReadyOutcome(unit, {
      delivery: "AUTHORIZED",
    }),
  });
  assert.equal(o.status, HANDOFF_EXECUTION_REJECTED);
  assert.ok(o.reasons.some((r) => r.code === "ILLICIT_DELIVERY_CLAIM"));
  assertFences(o);
});

test("§25.5 HANDOFF_EXECUTION_REJECTED: illicit persistence claim", () => {
  const candidate = fixtureHealthy();
  const unit = Object.freeze({
    snapshotId: candidate.snapshotId,
    snapshot: candidate,
    integrity: Object.freeze({ ...candidate.integrity }),
    eligibilityDecision: "ELIGIBLE",
  });
  const o = evaluateHandoffExecution(candidate, {
    readinessOutcome: syntheticHandoffReadyOutcome(unit, {
      persistence: "AUTHORIZED",
    }),
  });
  assert.equal(o.status, HANDOFF_EXECUTION_REJECTED);
  assert.ok(o.reasons.some((r) => r.code === "ILLICIT_PERSISTENCE_CLAIM"));
  assertFences(o);
});

test("§25.5 HANDOFF_EXECUTION_REJECTED: illicit exposure on unit", () => {
  const candidate = fixtureHealthy();
  const o = evaluateHandoffExecution(candidate, {
    evaluateHandoffReadiness: () =>
      syntheticHandoffReadyOutcome(
        Object.freeze({
          snapshotId: candidate.snapshotId,
          snapshot: candidate,
          integrity: Object.freeze({ ...candidate.integrity }),
          eligibilityDecision: "ELIGIBLE",
          exposed: true,
        })
      ),
  });
  assert.equal(o.status, HANDOFF_EXECUTION_REJECTED);
  assert.ok(o.reasons.some((r) => r.code === "ILLICIT_EXPOSURE_CLAIM"));
  assertFences(o);
});

// --- Spec §25.6–11 Binding preservation ---

test("§25.6 preserves snapshotId exactly", () => {
  const candidate = fixtureHealthy();
  const ready = healthyReadyUnit(candidate);
  const o = evaluateHandoffExecution(candidate, { now: NOW_FRESH });
  assert.equal(o.publicationUnit.snapshotId, candidate.snapshotId);
  assert.equal(o.publicationUnit.snapshotId, ready.publicationUnit.snapshotId);
});

test("§25.7 preserves identity metadata", () => {
  const candidate = fixtureHealthy();
  const o = evaluateHandoffExecution(candidate, { now: NOW_FRESH });
  assert.equal(o.publicationUnit.snapshot, candidate);
  assert.equal(o.publicationUnit.snapshot.snapshotId, candidate.snapshotId);
});

test("§25.8 preserves integrity metadata exactly", () => {
  const candidate = fixtureHealthy();
  const ready = healthyReadyUnit(candidate);
  const o = evaluateHandoffExecution(candidate, {
    now: NOW_FRESH,
    readinessOutcome: ready,
  });
  assert.equal(
    o.publicationUnit.integrity.checksum,
    ready.publicationUnit.integrity.checksum
  );
  assert.equal(
    o.publicationUnit.integrity.algorithm,
    ready.publicationUnit.integrity.algorithm
  );
  assert.equal(o.publicationUnit.integrity, ready.publicationUnit.integrity);
});

test("§25.9 preserves relevant provenance", () => {
  const candidate = fixtureHealthy();
  const o = evaluateHandoffExecution(candidate, { now: NOW_FRESH });
  assert.deepEqual(
    o.publicationUnit.snapshot.sourceProvenance,
    candidate.sourceProvenance
  );
});

test("§25.10 preserves Publication Unit binding (same reference)", () => {
  const candidate = fixtureHealthy();
  const ready = healthyReadyUnit(candidate);
  const o = evaluateHandoffExecution(candidate, {
    now: NOW_FRESH,
    readinessOutcome: ready,
  });
  assert.equal(o.publicationUnit, ready.publicationUnit);
});

test("§25.11 preserves II.5 readiness outcome binding", () => {
  const candidate = fixtureHealthy();
  const ready = healthyReadyUnit(candidate);
  const before = JSON.stringify(ready);
  const o = evaluateHandoffExecution(candidate, {
    now: NOW_FRESH,
    readinessOutcome: ready,
  });
  assert.equal(JSON.stringify(ready), before);
  assert.equal(o.readinessOutcome.status, ready.status);
  assert.equal(o.readinessOutcome.publicationUnit, ready.publicationUnit);
  assert.equal(o.readinessOutcome.manifest, ready.manifest);
  assert.equal(o.readinessOutcome.upstream, ready.upstream);
});

// --- Spec §25.12–14 Immutability ---

test("§25.12 candidate remains immutable", () => {
  const candidate = fixtureHealthy();
  const before = JSON.stringify(candidate);
  evaluateHandoffExecution(candidate, { now: NOW_FRESH });
  assert.equal(JSON.stringify(candidate), before);
});

test("§25.12 Publication Unit / readiness not mutated", () => {
  const candidate = fixtureHealthy();
  const ready = healthyReadyUnit(candidate);
  const unitBefore = JSON.stringify(ready.publicationUnit);
  const readyBefore = JSON.stringify(ready);
  evaluateHandoffExecution(candidate, {
    now: NOW_FRESH,
    readinessOutcome: ready,
  });
  assert.equal(JSON.stringify(ready.publicationUnit), unitBefore);
  assert.equal(JSON.stringify(ready), readyBefore);
});

test("§25.13 II.6 outcome immutable", () => {
  const o = evaluateHandoffExecution(fixtureHealthy(), { now: NOW_FRESH });
  assert.ok(Object.isFrozen(o));
  assert.ok(Object.isFrozen(o.reasons));
  assert.ok(Object.isFrozen(o.readinessOutcome));
  assert.throws(() => {
    o.status = "HACKED";
  }, TypeError);
  assert.throws(() => {
    o.delivery = "AUTHORIZED";
  }, TypeError);
});

test("§25.14 no executionMetadata elevation in v1", () => {
  const o = evaluateHandoffExecution(fixtureHealthy(), { now: NOW_FRESH });
  assert.equal(
    Object.prototype.hasOwnProperty.call(o, "executionMetadata"),
    false
  );
});

// --- Spec §25.15–20 Permanent fences ---

test("§25.15–20 fences on all paths", () => {
  const cases = [
    evaluateHandoffExecution(fixtureHealthy(), { now: NOW_FRESH }),
    evaluateHandoffExecution(fixtureBadChecksum(), { now: NOW_FRESH }),
    evaluateHandoffExecution(fixtureAtomicFragment()),
    evaluateHandoffExecution(fixtureHealthy(), {
      evaluateHandoffReadiness: () => {
        throw new Error("x");
      },
    }),
    evaluateHandoffExecution(fixtureHealthy(), {
      evaluateHandoffReadiness: () =>
        syntheticHandoffReadyOutcome(
          Object.freeze({
            snapshotId: "",
            snapshot: fixtureHealthy(),
            integrity: Object.freeze({ checksum: "a".repeat(64) }),
          })
        ),
    }),
  ];
  for (const o of cases) {
    assertFences(o);
    assert.equal(o.delivery, "NOT_AUTHORIZED");
    assert.equal(o.persistence, "NOT_AUTHORIZED");
    assert.equal(o.transport, "NOT_AUTHORIZED");
    assert.equal(o.authentication, "NOT_AUTHORIZED");
    assert.equal(o.exposure, "NOT_AUTHORIZED");
    assert.deepEqual([...o.sideEffects], []);
  }
});

// --- Spec §25.21 Absence of second upstream gate ---

test("§25.21 no second II.2/II.3/II.4 gate; sole oracle is evaluateHandoffReadiness", () => {
  const root = join(__dirname, "..");
  const files = [
    "index.js",
    "constants.js",
    "reasons.js",
    "continuity.js",
    "evaluate.js",
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
      `${name} must not import publicationEligibility`
    );
    assert.equal(
      /import\s*\{[^}]*formPublicationUnit|from\s+["'][^"']*publicationUnit/.test(
        src
      ),
      false,
      `${name} must not import formPublicationUnit / publicationUnit as oracle`
    );
    assert.equal(
      /from\s+["'][^"']*\/readModel\//.test(src),
      false,
      `${name} must not import readModel`
    );
    assert.equal(
      /from\s+["'][^"']*\/factory\//.test(src),
      false,
      `${name} must not import factory`
    );
  }
  const evaluateSrc = readFileSync(join(root, "evaluate.js"), "utf8");
  assert.match(evaluateSrc, /evaluateHandoffReadiness/);
  assert.match(evaluateSrc, /handoffReadiness/);
});

test("§25.21 sole injected seam is evaluateHandoffReadiness", () => {
  let calls = 0;
  const candidate = fixtureHealthy();
  const ready = healthyReadyUnit(candidate);
  const o = evaluateHandoffExecution(candidate, {
    now: NOW_FRESH,
    evaluateHandoffReadiness: (c, opts) => {
      calls += 1;
      assert.equal(c, candidate);
      assert.equal(opts.now, NOW_FRESH);
      return ready;
    },
  });
  assert.equal(calls, 1);
  assert.equal(o.status, HANDOFF_EXECUTED);
  assertFences(o);
});

// --- Spec §25.22 Absence of external effects ---

test("§25.22 no I/O / persistence / transport markers in runtime modules", () => {
  const root = join(__dirname, "..");
  const src = [
    "index.js",
    "constants.js",
    "reasons.js",
    "continuity.js",
    "evaluate.js",
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

test("§25.22 HANDOFF_EXECUTED does not imply published/delivered/persisted", () => {
  const o = evaluateHandoffExecution(fixtureHealthy(), { now: NOW_FRESH });
  assert.equal(o.status, HANDOFF_EXECUTED);
  assert.equal(o.delivery, "NOT_AUTHORIZED");
  assert.equal(o.persistence, "NOT_AUTHORIZED");
  assert.equal(o.transport, "NOT_AUTHORIZED");
  assert.equal(o.authentication, "NOT_AUTHORIZED");
  assert.equal(o.exposure, "NOT_AUTHORIZED");
  assert.equal(o.sideEffects.length, 0);
});

const failed = results.filter((r) => !r.ok);
console.log("");
console.log("====================================================");
console.log("II.6-IMPL HANDOFF EXECUTION GOVERNANCE VALIDATION");
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
  console.log("PERSISTENCE: NOT_AUTHORIZED");
  console.log("TRANSPORT: NOT_AUTHORIZED");
  console.log("AUTHENTICATION: NOT_AUTHORIZED");
  console.log("EXPOSURE: NOT_AUTHORIZED");
  console.log("SIDE_EFFECTS: []");
}

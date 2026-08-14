/**
 * SP07-P1 — Operation Watch validation / proof harness (DAG-SP07-P1-G1)
 *
 * Frozen SP07-P1-T01…T25 proof obligations.
 * Runnable:
 *   node src/operation/p1/validateOperationWatchBaseline.js
 */

import {
  EVALUATION_STATUS,
  EVIDENCE_CLASS,
  FRESHNESS,
  MEANINGFUL_CHANGE,
  OPERATIONAL_STATE,
  PROGRAM_SCOPE,
  RESULT_SCHEMA_ID,
  SCHEMA_VERSION,
  SIDE_EFFECTS,
  SNAPSHOT_SCHEMA_ID,
  SUBJECT_CLASS,
  SUBJECT_SCHEMA_ID,
  TRUTH_POSTURE,
  DEPENDENCY_STATUS,
  DELIVERY_STATUS,
  PROVENANCE_SOURCE_KIND,
} from "./operationWatchContract.js";
import {
  SP07_P1_WALL_MARKERS,
  acceptWatchSnapshot,
  detectMeaningfulChange,
  evaluateWatchBaseline,
  normalizeWatchSnapshot,
} from "./operationWatchEvaluator.js";

function pass(id, errors = []) {
  return { id, passed: errors.length === 0, errors };
}

function buildSnapshot(overrides = {}) {
  const base = {
    meta: {
      schemaId: SNAPSHOT_SCHEMA_ID,
      version: SCHEMA_VERSION,
      observedAt: "2026-08-14T10:00:00.000Z",
      subjectRef: "institutional-continuity-baseline",
    },
    subject: {
      subjectSchemaId: SUBJECT_SCHEMA_ID,
      subjectClass: SUBJECT_CLASS,
      programScope: PROGRAM_SCOPE,
      predecessorPosture: "CONSUME_ONLY",
    },
    evidence: [
      {
        evidenceId: "EV-REQUIRED-01",
        evidenceClass: EVIDENCE_CLASS.REQUIRED,
        value: { signal: "operability-baseline" },
        freshness: FRESHNESS.CURRENT,
        truthPosture: TRUTH_POSTURE.ASSERTED,
        provenance: { sourceKind: PROVENANCE_SOURCE_KIND.READ_ONLY_OBSERVATION },
      },
    ],
    provenance: {
      sourceKind: PROVENANCE_SOURCE_KIND.READ_ONLY_OBSERVATION,
      observerId: "SP07-P1-INTERNAL-OBSERVER",
      observedAt: "2026-08-14T10:00:00.000Z",
    },
    honesty: {
      unknown: { preserved: true },
      conflict: { blocking: false },
      freshness: { note: "freshnessIsNotTruth" },
      limitations: { freshnessIsNotTruth: true },
    },
    dependencies: [
      {
        depId: "DEP-FS-READONLY",
        required: true,
        status: DEPENDENCY_STATUS.REACHABLE,
      },
    ],
  };

  return deepMerge(base, overrides);
}

function deepMerge(target, source) {
  const out = { ...target };
  for (const [k, v] of Object.entries(source)) {
    if (
      v != null &&
      typeof v === "object" &&
      !Array.isArray(v) &&
      typeof target[k] === "object" &&
      target[k] != null &&
      !Array.isArray(target[k])
    ) {
      out[k] = deepMerge(target[k], v);
    } else {
      out[k] = v;
    }
  }
  return out;
}

function runSp07P1T01() {
  const errors = [];
  const snap = buildSnapshot();
  const accept = acceptWatchSnapshot(snap);
  if (!accept.ok) errors.push("canonical snapshot must accept");
  const r = evaluateWatchBaseline(snap);
  if (r.evaluationStatus !== EVALUATION_STATUS.ACCEPTED) errors.push("evaluation must accept");
  if (r.operationalState !== OPERATIONAL_STATE.HEALTHY) {
    errors.push(`expected HEALTHY got ${r.operationalState}`);
  }
  return pass("SP07-P1-T01", errors);
}

function runSp07P1T02() {
  const errors = [];
  const r1 = evaluateWatchBaseline(null);
  if (r1.evaluationStatus !== EVALUATION_STATUS.REFUSED) errors.push("null must REFUSE");
  if (r1.operationalState !== OPERATIONAL_STATE.FAIL_CLOSED) errors.push("null must FAIL_CLOSED");

  const r2 = evaluateWatchBaseline(buildSnapshot({ meta: { schemaId: "wrong", version: SCHEMA_VERSION, observedAt: "x" } }));
  if (r2.evaluationStatus !== EVALUATION_STATUS.REFUSED) errors.push("bad schema must REFUSE");

  const r3 = evaluateWatchBaseline(buildSnapshot({ evidence: [] }));
  if (r3.evaluationStatus !== EVALUATION_STATUS.REFUSED) errors.push("empty evidence must REFUSE");
  return pass("SP07-P1-T02", errors);
}

function runSp07P1T03() {
  const errors = [];
  const snap = buildSnapshot();
  const a = evaluateWatchBaseline(snap);
  const b = evaluateWatchBaseline(snap);
  if (JSON.stringify(a) !== JSON.stringify(b)) errors.push("deterministic repeat mismatch");
  return pass("SP07-P1-T03", errors);
}

function runSp07P1T04() {
  const errors = [];
  const prev = buildSnapshot();
  const cur = buildSnapshot({
    evidence: [
      {
        evidenceId: "EV-REQUIRED-01",
        evidenceClass: EVIDENCE_CLASS.REQUIRED,
        value: { signal: "operability-baseline" },
        freshness: FRESHNESS.STALE,
        truthPosture: TRUTH_POSTURE.ASSERTED,
        provenance: { sourceKind: PROVENANCE_SOURCE_KIND.READ_ONLY_OBSERVATION },
      },
    ],
  });
  const r = evaluateWatchBaseline(cur, prev);
  if (r.meaningfulChange !== MEANINGFUL_CHANGE.TRUE) errors.push("stale cross must be meaningful change");
  if (r.meaningfulChangeReasons.length === 0) errors.push("reasons required");
  return pass("SP07-P1-T04", errors);
}

function runSp07P1T05() {
  const errors = [];
  const snap = buildSnapshot();
  const r = evaluateWatchBaseline(snap, snap);
  if (r.meaningfulChange !== MEANINGFUL_CHANGE.FALSE) errors.push("identical input must be no change");
  return pass("SP07-P1-T05", errors);
}

function runSp07P1T06() {
  const errors = [];
  const snap = buildSnapshot({
    evidence: [
      {
        evidenceId: "EV-REQUIRED-01",
        evidenceClass: EVIDENCE_CLASS.REQUIRED,
        value: { signal: "stale" },
        freshness: FRESHNESS.STALE,
        truthPosture: TRUTH_POSTURE.ASSERTED,
        provenance: { sourceKind: PROVENANCE_SOURCE_KIND.READ_ONLY_OBSERVATION },
      },
    ],
  });
  const r = evaluateWatchBaseline(snap);
  if (r.operationalState === OPERATIONAL_STATE.HEALTHY) errors.push("stale must not be HEALTHY");
  if (r.operationalState !== OPERATIONAL_STATE.STALE && r.operationalState !== OPERATIONAL_STATE.DEGRADED) {
    errors.push(`expected STALE/DEGRADED got ${r.operationalState}`);
  }
  return pass("SP07-P1-T06", errors);
}

function runSp07P1T07() {
  const errors = [];
  const snap = buildSnapshot({
    evidence: [
      {
        evidenceId: "EV-REQUIRED-01",
        evidenceClass: EVIDENCE_CLASS.REQUIRED,
        value: null,
        freshness: FRESHNESS.UNKNOWN,
        truthPosture: TRUTH_POSTURE.UNKNOWN,
        provenance: { sourceKind: PROVENANCE_SOURCE_KIND.UNKNOWN },
      },
    ],
  });
  const r = evaluateWatchBaseline(snap);
  if (r.operationalState === OPERATIONAL_STATE.HEALTHY) errors.push("UNKNOWN must not become HEALTHY");
  if (r.honesty.unknown == null) errors.push("UNKNOWN honesty must preserve");
  return pass("SP07-P1-T07", errors);
}

function runSp07P1T08() {
  const errors = [];
  const snap = buildSnapshot({
    evidence: [
      {
        evidenceId: "EV-REQUIRED-01",
        evidenceClass: EVIDENCE_CLASS.REQUIRED,
        value: { signal: "conflict" },
        freshness: FRESHNESS.CURRENT,
        truthPosture: TRUTH_POSTURE.CONFLICT,
        provenance: { sourceKind: PROVENANCE_SOURCE_KIND.READ_ONLY_OBSERVATION },
      },
    ],
  });
  const r = evaluateWatchBaseline(snap);
  if (r.operationalState === OPERATIONAL_STATE.HEALTHY) errors.push("conflict must never be HEALTHY");
  if (r.operationalState !== OPERATIONAL_STATE.BLOCKED) errors.push(`expected BLOCKED got ${r.operationalState}`);
  return pass("SP07-P1-T08", errors);
}

function runSp07P1T09() {
  const errors = [];
  const snap = buildSnapshot({
    dependencies: [{ depId: "DEP-FS-READONLY", required: true, status: DEPENDENCY_STATUS.UNAVAILABLE }],
  });
  const r = evaluateWatchBaseline(snap);
  if (r.operationalState !== OPERATIONAL_STATE.UNAVAILABLE) {
    errors.push(`expected UNAVAILABLE got ${r.operationalState}`);
  }
  return pass("SP07-P1-T09", errors);
}

function runSp07P1T10() {
  const errors = [];
  const snap = buildSnapshot({
    honesty: {
      authorityUncertain: true,
      unknown: { preserved: true },
      conflict: { blocking: false },
      limitations: { freshnessIsNotTruth: true },
    },
  });
  const r = evaluateWatchBaseline(snap);
  if (r.operationalState !== OPERATIONAL_STATE.AUTHORITY_UNCERTAIN) {
    errors.push(`expected AUTHORITY_UNCERTAIN got ${r.operationalState}`);
  }
  return pass("SP07-P1-T10", errors);
}

function runSp07P1T11() {
  const errors = [];
  const snap = buildSnapshot({
    honesty: {
      limitations: { stopRulePressure: true, freshnessIsNotTruth: true },
      conflict: { blocking: false },
    },
  });
  const r = evaluateWatchBaseline(snap);
  if (r.operationalState !== OPERATIONAL_STATE.FAIL_CLOSED) {
    errors.push(`expected FAIL_CLOSED got ${r.operationalState}`);
  }
  return pass("SP07-P1-T11", errors);
}

function runSp07P1T12() {
  const errors = [];
  const snap = buildSnapshot();
  const r = evaluateWatchBaseline(snap);
  if (!Array.isArray(r.healthEvidence.factual) || r.healthEvidence.factual.length === 0) {
    errors.push("factual health evidence required");
  }
  if (typeof r.healthEvidence.derived?.sufficientForHealthy !== "boolean") {
    errors.push("derived health assembly required");
  }
  if (r.healthEvidence.limitations?.freshnessIsNotTruth !== true) {
    errors.push("freshnessIsNotTruth lock required");
  }
  return pass("SP07-P1-T12", errors);
}

function runSp07P1T13() {
  const errors = [];
  const snap = buildSnapshot({
    evidence: [
      {
        evidenceId: "EV-OPTIONAL-ONLY",
        evidenceClass: EVIDENCE_CLASS.OPTIONAL,
        value: { ok: true },
        freshness: FRESHNESS.CURRENT,
        truthPosture: TRUTH_POSTURE.ASSERTED,
        provenance: { sourceKind: PROVENANCE_SOURCE_KIND.READ_ONLY_OBSERVATION },
      },
    ],
  });
  const r = evaluateWatchBaseline(snap);
  if (r.operationalState === OPERATIONAL_STATE.HEALTHY) {
    errors.push("optional-only evidence must not infer HEALTHY");
  }
  const noFailure = buildSnapshot({
    evidence: [
      {
        evidenceId: "EV-REQUIRED-01",
        evidenceClass: EVIDENCE_CLASS.REQUIRED,
        value: null,
        freshness: FRESHNESS.UNKNOWN,
        truthPosture: TRUTH_POSTURE.UNKNOWN,
        provenance: { sourceKind: PROVENANCE_SOURCE_KIND.UNKNOWN },
      },
    ],
  });
  const r2 = evaluateWatchBaseline(noFailure);
  if (r2.operationalState === OPERATIONAL_STATE.HEALTHY) {
    errors.push("absence of failure must not infer HEALTHY");
  }
  return pass("SP07-P1-T13", errors);
}

async function runSp07P1T14() {
  const errors = [];
  const fs = await import("node:fs");
  const path = await import("node:path");
  const { fileURLToPath } = await import("node:url");
  const dir = path.dirname(fileURLToPath(import.meta.url));
  const src = ["operationWatchContract.js", "operationWatchEvaluator.js"]
    .map((f) => fs.readFileSync(path.join(dir, f), "utf8"))
    .join("\n");
  if (/from\s+["'].*\/factory\//.test(src)) errors.push("factory import forbidden");
  if (/from\s+["'].*\/publication\//.test(src)) errors.push("publication import forbidden");
  if (/from\s+["'].*\/decision\//.test(src)) errors.push("decision import forbidden");
  if (/from\s+["'].*factory-observability/.test(src)) errors.push("factory-observability import forbidden");
  if (/registerElrAct|transitionState|\.write\s*\(/.test(src)) errors.push("mutation API forbidden");
  return pass("SP07-P1-T14", errors);
}

function runSp07P1T15() {
  const errors = [];
  const r = evaluateWatchBaseline(buildSnapshot());
  if (r.sideEffects !== SIDE_EFFECTS.NONE) errors.push("sideEffects must be NONE");
  return pass("SP07-P1-T15", errors);
}

function runSp07P1T16() {
  const errors = [];
  const r = evaluateWatchBaseline(buildSnapshot());
  const payload = JSON.stringify({
    operationalState: r.operationalState,
    reasons: r.reasons,
    healthEvidence: r.healthEvidence,
    delivery: r.delivery,
  });
  if (/Premium|Diamond|access_tier|Marketplace deal|Product entitlement/i.test(payload)) {
    errors.push("Product/Marketplace leakage");
  }
  if (SP07_P1_WALL_MARKERS.productCoupling || SP07_P1_WALL_MARKERS.marketplaceCoupling) {
    errors.push("wall markers must deny product/marketplace");
  }
  return pass("SP07-P1-T16", errors);
}

function runSp07P1T17() {
  const errors = [];
  const r = evaluateWatchBaseline(buildSnapshot());
  if (r.delivery !== DELIVERY_STATUS.NOT_AUTHORIZED) errors.push("delivery must NOT_AUTHORIZED");
  const raw = JSON.stringify(r);
  if (/ELIGIBLE|FORMED|publication\.delivery/i.test(raw)) errors.push("publication delivery leakage");
  return pass("SP07-P1-T17", errors);
}

function runSp07P1T18() {
  const errors = [];
  const snap = buildSnapshot({
    evidence: [
      {
        evidenceId: "EV-REQUIRED-01",
        evidenceClass: EVIDENCE_CLASS.REQUIRED,
        value: { ownerEmail: "hidden@example.com", phone: "555" },
        freshness: FRESHNESS.CURRENT,
        truthPosture: TRUTH_POSTURE.ASSERTED,
        provenance: { sourceKind: PROVENANCE_SOURCE_KIND.READ_ONLY_OBSERVATION },
      },
    ],
  });
  const r = evaluateWatchBaseline(snap);
  const raw = JSON.stringify(r);
  if (/outreach|unlock|contact disclosure/i.test(raw)) errors.push("owner/contact action semantics");
  if (r.invariants.noProductMarketplaceCoupling !== true) errors.push("invariant wall");
  return pass("SP07-P1-T18", errors);
}

function runSp07P1T19() {
  const errors = [];
  const r = evaluateWatchBaseline(buildSnapshot());
  const payload = JSON.stringify({
    operationalState: r.operationalState,
    reasons: r.reasons,
    sideEffects: r.sideEffects,
  });
  if (/supabase|postgres|rls|edge function|storage bucket/i.test(payload)) {
    errors.push("supabase leakage in payload");
  }
  if (r.invariants.noSupabaseAuthority !== true) errors.push("noSupabaseAuthority invariant");
  return pass("SP07-P1-T19", errors);
}

function runSp07P1T20() {
  const errors = [];
  const r = evaluateWatchBaseline(
    buildSnapshot({
      honesty: { limitations: { stopRulePressure: true }, conflict: { blocking: false } },
    })
  );
  if (r.operationalState !== OPERATIONAL_STATE.FAIL_CLOSED) errors.push("Stop Rule must fail-closed");
  return pass("SP07-P1-T20", errors);
}

function runSp07P1T21() {
  const errors = [];
  const raw = JSON.stringify(SP07_P1_WALL_MARKERS);
  if (SP07_P1_WALL_MARKERS.p2Opened !== false) errors.push("P2 must remain unopened");
  if (/SP07-P2|operation\/p2/i.test(raw) && SP07_P1_WALL_MARKERS.p2Opened) errors.push("P2 opened");
  return pass("SP07-P1-T21", errors);
}

function runSp07P1T22() {
  const errors = [];
  if (SP07_P1_WALL_MARKERS.sp08Opened !== false) errors.push("SP08 must remain unopened");
  const r = evaluateWatchBaseline(
    buildSnapshot({ subject: { subjectClass: SUBJECT_CLASS, programScope: "SP08", claimsScaleOut: true } })
  );
  if (r.evaluationStatus !== EVALUATION_STATUS.REFUSED) errors.push("SP08 subject must refuse");
  return pass("SP07-P1-T22", errors);
}

function runSp07P1T23() {
  const errors = [];
  const r = evaluateWatchBaseline(buildSnapshot());
  if (r.inputRef?.subjectClass !== SUBJECT_CLASS) {
    errors.push("institutional continuity subject required");
  }
  if (r.invariants.watchIsNotUpdate !== true) errors.push("watchIsNotUpdate");
  return pass("SP07-P1-T23", errors);
}

function runSp07P1T24() {
  const errors = [];
  const r = evaluateWatchBaseline(buildSnapshot());
  if (r.invariants.observationIsNotAction !== true) errors.push("observationIsNotAction");
  if (r.sideEffects !== SIDE_EFFECTS.NONE) errors.push("no automation side effect");
  const raw = JSON.stringify(r);
  if (/webhook|notification|email|persistentWrite/i.test(raw)) errors.push("external action leakage");
  return pass("SP07-P1-T24", errors);
}

function runSp07P1T25() {
  const errors = [];
  const r = evaluateWatchBaseline(buildSnapshot());
  if (r.meta.schemaId !== RESULT_SCHEMA_ID) errors.push("result schemaId");
  if (r.meta.version !== SCHEMA_VERSION) errors.push("result version");
  if (r.sideEffects !== SIDE_EFFECTS.NONE) errors.push("sideEffects NONE");
  if (r.observabilityScope?.posture !== "INTERNAL_ONLY_OPERATOR_DEVELOPER_READ_ONLY") {
    errors.push("internal-only observability");
  }
  if (r.invariants.internalObservabilityOnly !== true) errors.push("internalObservabilityOnly invariant");
  return pass("SP07-P1-T25", errors);
}

const PROOFS = [
  runSp07P1T01,
  runSp07P1T02,
  runSp07P1T03,
  runSp07P1T04,
  runSp07P1T05,
  runSp07P1T06,
  runSp07P1T07,
  runSp07P1T08,
  runSp07P1T09,
  runSp07P1T10,
  runSp07P1T11,
  runSp07P1T12,
  runSp07P1T13,
  runSp07P1T14,
  runSp07P1T15,
  runSp07P1T16,
  runSp07P1T17,
  runSp07P1T18,
  runSp07P1T19,
  runSp07P1T20,
  runSp07P1T21,
  runSp07P1T22,
  runSp07P1T23,
  runSp07P1T24,
  runSp07P1T25,
];

/**
 * @returns {Promise<{ passed: boolean, results: object[], passCount: number, failCount: number }>}
 */
export async function runOperationWatchBaselineValidation() {
  const results = [];
  for (const fn of PROOFS) {
    results.push(await fn());
  }
  const passCount = results.filter((r) => r.passed).length;
  const failCount = results.length - passCount;
  return {
    passed: results.every((r) => r.passed),
    results,
    passCount,
    failCount,
  };
}

async function main() {
  const { passed, results, passCount, failCount } = await runOperationWatchBaselineValidation();
  for (const r of results) {
    const mark = r.passed ? "PASS" : "FAIL";
    console.log(`${mark} ${r.id}${r.errors.length ? ` — ${r.errors.join("; ")}` : ""}`);
  }
  console.log(
    passed
      ? `\nSP07-P1 OPERATION WATCH BASELINE VALIDATION: PASS (${passCount}/25)`
      : `\nSP07-P1 OPERATION WATCH BASELINE VALIDATION: FAIL (${passCount}/25, ${failCount} failed)`
  );
  process.exitCode = passed ? 0 : 1;
}

const isDirect =
  process.argv[1] &&
  (process.argv[1].endsWith("validateOperationWatchBaseline.js") ||
    process.argv[1].includes("validateOperationWatchBaseline"));

if (isDirect) {
  main();
}

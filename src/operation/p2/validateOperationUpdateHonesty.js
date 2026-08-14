/**
 * SP07-P2 — Operation Update honesty / proof harness (DAG-SP07-P2-G1)
 *
 * Frozen SP07-P2-T01…T23 proof obligations bound to production contract/evaluator.
 * Mandatory P1 regression is invoked from main() (consume-only).
 * Runnable:
 *   node src/operation/p2/validateOperationUpdateHonesty.js
 */

import {
  DEPENDENCY_STATUS,
  EVIDENCE_CLASS,
  FRESHNESS,
  OPERATIONAL_STATE as P1_OPERATIONAL_STATE,
  PROVENANCE_SOURCE_KIND,
  SCHEMA_VERSION as P1_SNAPSHOT_VERSION,
  SNAPSHOT_SCHEMA_ID,
  SUBJECT_CLASS as P1_SUBJECT_CLASS,
  SUBJECT_SCHEMA_ID as P1_SUBJECT_SCHEMA_ID,
  TRUTH_POSTURE,
} from "../p1/operationWatchContract.js";
import { evaluateWatchBaseline } from "../p1/operationWatchEvaluator.js";
import { runOperationWatchBaselineValidation } from "../p1/validateOperationWatchBaseline.js";
import {
  CANDIDATE_SCHEMA_ID,
  CHANGE_SURFACE,
  DELIVERY_STATUS,
  PROGRAM_SCOPE,
  REASON_CODES,
  SCHEMA_VERSION,
  SIDE_EFFECTS,
  SUBJECT_CLASS,
  SUBJECT_SCHEMA_ID,
  UPDATE_DISPOSITION,
  UPDATE_RESULT_SCHEMA_ID,
  WATCH_RESULT_SCHEMA_ID,
} from "./operationUpdateContract.js";
import {
  SP07_P2_WALL_MARKERS,
  acceptCandidate,
  acceptPredecessor,
  evaluateOperationUpdate,
} from "./operationUpdateEvaluator.js";

function pass(id, errors = []) {
  return { id, passed: errors.length === 0, errors };
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

function buildWatchSnapshot(overrides = {}) {
  const base = {
    meta: {
      schemaId: SNAPSHOT_SCHEMA_ID,
      version: P1_SNAPSHOT_VERSION,
      observedAt: "2026-08-14T10:00:00.000Z",
      subjectRef: "institutional-continuity-baseline",
    },
    subject: {
      subjectSchemaId: P1_SUBJECT_SCHEMA_ID,
      subjectClass: P1_SUBJECT_CLASS,
      programScope: "SP07-P1",
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

function healthyPredecessor() {
  return evaluateWatchBaseline(buildWatchSnapshot());
}

function unknownPredecessor() {
  return evaluateWatchBaseline(
    buildWatchSnapshot({
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
    })
  );
}

function conflictPredecessor() {
  return evaluateWatchBaseline(
    buildWatchSnapshot({
      evidence: [
        {
          evidenceId: "EV-REQUIRED-01",
          evidenceClass: EVIDENCE_CLASS.REQUIRED,
          value: { signal: "conflicted" },
          freshness: FRESHNESS.CURRENT,
          truthPosture: TRUTH_POSTURE.CONFLICT,
          provenance: { sourceKind: PROVENANCE_SOURCE_KIND.READ_ONLY_OBSERVATION },
        },
      ],
      honesty: { conflict: { blocking: true }, unknown: { preserved: true } },
    })
  );
}

function candidateFromPredecessor(predecessor, overrides = {}) {
  const factual = predecessor.healthEvidence?.factual ?? [];
  const base = {
    meta: {
      schemaId: CANDIDATE_SCHEMA_ID,
      version: SCHEMA_VERSION,
      observedAt: predecessor.meta?.evaluatedAt ?? "2026-08-14T10:00:00.000Z",
      subjectRef: "institutional-continuity-baseline",
    },
    subject: {
      subjectSchemaId: SUBJECT_SCHEMA_ID,
      subjectClass: SUBJECT_CLASS,
      programScope: PROGRAM_SCOPE,
      predecessorPosture: "CONSUME_ONLY",
    },
    evidence: factual.map((ev) => ({
      evidenceId: ev.evidenceId,
      evidenceClass: ev.evidenceClass,
      freshness: ev.freshness,
      truthPosture: ev.truthPosture,
      value: ev.value,
      provenance: { sourceKind: PROVENANCE_SOURCE_KIND.READ_ONLY_OBSERVATION },
    })),
    provenance: {
      sourceKind: PROVENANCE_SOURCE_KIND.READ_ONLY_OBSERVATION,
      observerId: "SP07-P2-INTERNAL-OBSERVER",
      observedAt: predecessor.meta?.evaluatedAt ?? "2026-08-14T10:00:00.000Z",
    },
    honesty: {
      unknown: predecessor.honesty?.unknown ?? { preserved: true },
      conflict: predecessor.honesty?.conflict ?? { blocking: false },
      freshness: predecessor.honesty?.freshness ?? { note: "freshnessIsNotTruth" },
      limitations: predecessor.honesty?.limitations ?? { freshnessIsNotTruth: true },
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

function reasonCodes(result) {
  return (result.reasons ?? []).map((r) => r.code);
}

function runSp07P2T01() {
  const errors = [];
  const r = evaluateOperationUpdate(healthyPredecessor(), candidateFromPredecessor(healthyPredecessor()));
  if (r.meta.schemaId !== UPDATE_RESULT_SCHEMA_ID) {
    errors.push(`expected ${UPDATE_RESULT_SCHEMA_ID} got ${r.meta.schemaId}`);
  }
  if (r.meta.version !== SCHEMA_VERSION) errors.push("result version must be v1");
  return pass("SP07-P2-T01", errors);
}

function runSp07P2T02() {
  const errors = [];
  if (SUBJECT_CLASS !== "INSTITUTIONAL_OPERATIONAL_CONTINUITY") {
    errors.push("canonical subjectClass mismatch");
  }
  if (SUBJECT_SCHEMA_ID !== "rsn.operation.watch.subject.v1") {
    errors.push("canonical subject schema mismatch");
  }
  const pred = healthyPredecessor();
  const cand = candidateFromPredecessor(pred);
  const accepted = acceptCandidate(cand);
  if (!accepted.ok) errors.push("canonical candidate subject must accept");
  if (cand.subject.subjectClass !== SUBJECT_CLASS) errors.push("candidate subjectClass");
  if (pred.inputRef?.subjectClass !== SUBJECT_CLASS) errors.push("predecessor subjectClass");
  const r = evaluateOperationUpdate(pred, cand);
  if (r.updateDisposition === UPDATE_DISPOSITION.FAIL_CLOSED) {
    errors.push("canonical subject pair must not fail-closed");
  }
  return pass("SP07-P2-T02", errors);
}

function runSp07P2T03() {
  const errors = [];
  const pred = healthyPredecessor();
  if (pred.meta.schemaId !== WATCH_RESULT_SCHEMA_ID) {
    errors.push("fixture predecessor must be watch result");
  }
  const accepted = acceptPredecessor(pred);
  if (!accepted.ok) errors.push(`valid predecessor must accept: ${accepted.errors?.join("; ")}`);
  return pass("SP07-P2-T03", errors);
}

function runSp07P2T04() {
  const errors = [];
  const cand = candidateFromPredecessor(healthyPredecessor());
  if (cand.meta.schemaId !== CANDIDATE_SCHEMA_ID) errors.push("candidate schemaId");
  const accepted = acceptCandidate(cand);
  if (!accepted.ok) errors.push(`valid candidate must accept: ${accepted.errors?.join("; ")}`);
  return pass("SP07-P2-T04", errors);
}

function runSp07P2T05() {
  const errors = [];
  const pred = healthyPredecessor();
  const cand = candidateFromPredecessor(pred);
  const a = evaluateOperationUpdate(pred, cand);
  const b = evaluateOperationUpdate(pred, cand);
  if (JSON.stringify(a) !== JSON.stringify(b)) errors.push("deterministic repeat mismatch");
  return pass("SP07-P2-T05", errors);
}

function runSp07P2T06() {
  const errors = [];
  const predA = healthyPredecessor();
  const predB = healthyPredecessor();
  const candA = candidateFromPredecessor(predA);
  const candB = JSON.parse(JSON.stringify(candA));
  const a = evaluateOperationUpdate(predA, candA);
  const b = evaluateOperationUpdate(predB, candB);
  if (JSON.stringify(a) !== JSON.stringify(b)) {
    errors.push("idempotent reconstruction mismatch");
  }
  if (a.meta.ruleVersion !== b.meta.ruleVersion) errors.push("contract version drift");
  return pass("SP07-P2-T06", errors);
}

function runSp07P2T07() {
  const errors = [];
  const pred = healthyPredecessor();
  const cand = candidateFromPredecessor(pred, {
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
  const r = evaluateOperationUpdate(pred, cand);
  if (r.updateDisposition !== UPDATE_DISPOSITION.BOUNDED_EVOLUTION_RECOGNIZED) {
    errors.push(`expected BOUNDED_EVOLUTION_RECOGNIZED got ${r.updateDisposition}`);
  }
  if (!r.changeSurface.some((c) => c.code === CHANGE_SURFACE.FRESHNESS_THRESHOLD_CROSS)) {
    errors.push("expected FRESHNESS_THRESHOLD_CROSS");
  }
  return pass("SP07-P2-T07", errors);
}

function runSp07P2T08() {
  const errors = [];
  const pred = healthyPredecessor();
  const cand = candidateFromPredecessor(pred);
  const r = evaluateOperationUpdate(pred, cand);
  if (r.updateDisposition !== UPDATE_DISPOSITION.NO_MEANINGFUL_UPDATE) {
    errors.push(`expected NO_MEANINGFUL_UPDATE got ${r.updateDisposition}`);
  }
  if (r.changeSurface.length !== 0) errors.push("no-change must have empty changeSurface");
  return pass("SP07-P2-T08", errors);
}

function runSp07P2T09() {
  const errors = [];
  const pred = healthyPredecessor();
  const r1 = evaluateOperationUpdate(pred, null);
  if (r1.updateDisposition !== UPDATE_DISPOSITION.FAIL_CLOSED) errors.push("null candidate must FAIL_CLOSED");
  const r2 = evaluateOperationUpdate(pred, candidateFromPredecessor(pred, { evidence: [] }));
  if (r2.updateDisposition !== UPDATE_DISPOSITION.FAIL_CLOSED) errors.push("empty evidence must FAIL_CLOSED");
  const r3 = evaluateOperationUpdate(pred, { notACandidate: true });
  if (r3.updateDisposition !== UPDATE_DISPOSITION.FAIL_CLOSED) errors.push("malformed candidate must FAIL_CLOSED");
  return pass("SP07-P2-T09", errors);
}

function runSp07P2T10() {
  const errors = [];
  const cand = candidateFromPredecessor(healthyPredecessor());
  const r = evaluateOperationUpdate(null, cand);
  if (r.updateDisposition !== UPDATE_DISPOSITION.FAIL_CLOSED) errors.push("missing predecessor must FAIL_CLOSED");
  if (!reasonCodes(r).includes(REASON_CODES.PREDECESSOR_MISSING)) {
    errors.push("expected PREDECESSOR_MISSING");
  }
  return pass("SP07-P2-T10", errors);
}

function runSp07P2T11() {
  const errors = [];
  const pred = healthyPredecessor();
  const r1 = evaluateOperationUpdate(
    pred,
    candidateFromPredecessor(pred, {
      subject: {
        subjectSchemaId: SUBJECT_SCHEMA_ID,
        subjectClass: "Product",
        programScope: PROGRAM_SCOPE,
      },
    })
  );
  if (r1.updateDisposition !== UPDATE_DISPOSITION.FAIL_CLOSED) {
    errors.push("Product subject must FAIL_CLOSED");
  }
  if (!reasonCodes(r1).includes(REASON_CODES.OUT_OF_DOMAIN)) {
    errors.push("Product subject must be OUT_OF_DOMAIN");
  }
  const r2 = evaluateOperationUpdate(
    pred,
    candidateFromPredecessor(pred, {
      subject: {
        subjectSchemaId: SUBJECT_SCHEMA_ID,
        subjectClass: SUBJECT_CLASS,
        programScope: "SP08",
        claimsScaleOut: true,
      },
    })
  );
  if (r2.updateDisposition !== UPDATE_DISPOSITION.FAIL_CLOSED) errors.push("SP08 subject must FAIL_CLOSED");
  return pass("SP07-P2-T11", errors);
}

function runSp07P2T12() {
  const errors = [];
  const pred = unknownPredecessor();
  const cand = candidateFromPredecessor(pred);
  const r = evaluateOperationUpdate(pred, cand);
  if (r.updateDisposition === UPDATE_DISPOSITION.FAIL_CLOSED) {
    errors.push("preserving UNKNOWN must not fail-closed");
  }
  if (r.updateDisposition === UPDATE_DISPOSITION.HONESTY_BLOCKS_EVOLUTION) {
    errors.push("preserving UNKNOWN is not an honesty block");
  }
  if (r.honestyContinuity.unknownIsNotNone !== true) errors.push("UNKNOWN ≠ NONE lock");
  if (r.operationalState === P1_OPERATIONAL_STATE.HEALTHY) {
    errors.push("UNKNOWN must not become HEALTHY");
  }
  return pass("SP07-P2-T12", errors);
}

function runSp07P2T13() {
  const errors = [];
  const pred = conflictPredecessor();
  const preserved = evaluateOperationUpdate(pred, candidateFromPredecessor(pred));
  if (preserved.updateDisposition === UPDATE_DISPOSITION.FAIL_CLOSED) {
    errors.push("preserving CONFLICT must not fail-closed");
  }
  if (preserved.updateDisposition === UPDATE_DISPOSITION.HONESTY_BLOCKS_EVOLUTION) {
    errors.push("preserving CONFLICT is not an honesty block");
  }
  const suppressed = evaluateOperationUpdate(
    pred,
    candidateFromPredecessor(pred, {
      evidence: [
        {
          evidenceId: "EV-REQUIRED-01",
          evidenceClass: EVIDENCE_CLASS.REQUIRED,
          value: { signal: "conflicted" },
          freshness: FRESHNESS.CURRENT,
          truthPosture: TRUTH_POSTURE.ASSERTED,
          provenance: { sourceKind: PROVENANCE_SOURCE_KIND.READ_ONLY_OBSERVATION },
        },
      ],
      honesty: { conflict: { blocking: false }, unknown: { preserved: true } },
    })
  );
  if (suppressed.updateDisposition !== UPDATE_DISPOSITION.HONESTY_BLOCKS_EVOLUTION) {
    errors.push("CONFLICT → ASSERTED must honesty-block");
  }
  if (!reasonCodes(suppressed).includes(REASON_CODES.CONFLICT_SUPPRESSION)) {
    errors.push("expected CONFLICT_SUPPRESSION");
  }
  return pass("SP07-P2-T13", errors);
}

function runSp07P2T14() {
  const errors = [];
  const pred = healthyPredecessor();
  const cand = candidateFromPredecessor(pred);
  const r = evaluateOperationUpdate(pred, cand);
  if (r.predecessorRef?.schemaId !== WATCH_RESULT_SCHEMA_ID) errors.push("predecessorRef schema");
  if (r.candidateRef?.schemaId !== CANDIDATE_SCHEMA_ID) errors.push("candidateRef schema");
  if (r.provenance?.candidateProvenance?.observerId !== cand.provenance.observerId) {
    errors.push("candidate provenance must propagate");
  }
  if (r.provenance?.predecessorRef?.schemaId !== WATCH_RESULT_SCHEMA_ID) {
    errors.push("evaluation provenance must cite predecessor");
  }
  return pass("SP07-P2-T14", errors);
}

function runSp07P2T15() {
  const errors = [];
  const pred = unknownPredecessor();
  const r = evaluateOperationUpdate(pred, candidateFromPredecessor(pred));
  if (r.honestyContinuity.healthEvidenceHonestyPreserved !== true) {
    errors.push("healthEvidence honesty must be preserved");
  }
  if (r.honestyContinuity.absenceOfEvidenceIsNotHealthy !== true) {
    errors.push("absence of evidence ≠ HEALTHY");
  }
  if (r.operationalState === P1_OPERATIONAL_STATE.HEALTHY) {
    errors.push("insufficient predecessor must not become HEALTHY");
  }
  if (r.operationalState !== pred.operationalState) {
    errors.push("P2 must not invent a healthier operationalState");
  }
  return pass("SP07-P2-T15", errors);
}

function runSp07P2T16() {
  const errors = [];
  const pred = unknownPredecessor();
  const r = evaluateOperationUpdate(
    pred,
    candidateFromPredecessor(pred, {
      evidence: [
        {
          evidenceId: "EV-REQUIRED-01",
          evidenceClass: EVIDENCE_CLASS.REQUIRED,
          value: { signal: "upgraded" },
          freshness: FRESHNESS.CURRENT,
          truthPosture: TRUTH_POSTURE.ASSERTED,
          provenance: { sourceKind: PROVENANCE_SOURCE_KIND.READ_ONLY_OBSERVATION },
        },
      ],
    })
  );
  if (r.updateDisposition !== UPDATE_DISPOSITION.HONESTY_BLOCKS_EVOLUTION) {
    errors.push("UNKNOWN → ASSERTED must honesty-block");
  }
  if (!reasonCodes(r).includes(REASON_CODES.CERTAINTY_ESCALATION)) {
    errors.push("expected CERTAINTY_ESCALATION");
  }
  return pass("SP07-P2-T16", errors);
}

function runSp07P2T17() {
  const errors = [];
  const pred = unknownPredecessor();
  const r = evaluateOperationUpdate(
    pred,
    candidateFromPredecessor(pred, {
      evidence: [
        {
          evidenceId: "EV-REQUIRED-01",
          evidenceClass: EVIDENCE_CLASS.REQUIRED,
          value: { signal: "complete" },
          freshness: FRESHNESS.CURRENT,
          truthPosture: TRUTH_POSTURE.ASSERTED,
          provenance: { sourceKind: PROVENANCE_SOURCE_KIND.READ_ONLY_OBSERVATION },
        },
      ],
    })
  );
  if (r.updateDisposition !== UPDATE_DISPOSITION.HONESTY_BLOCKS_EVOLUTION) {
    errors.push("silent completeness upgrade must honesty-block");
  }
  if (
    !reasonCodes(r).includes(REASON_CODES.COMPLETENESS_UPGRADE) &&
    !reasonCodes(r).includes(REASON_CODES.CERTAINTY_ESCALATION)
  ) {
    errors.push("expected COMPLETENESS_UPGRADE or CERTAINTY_ESCALATION");
  }
  if (r.operationalState === P1_OPERATIONAL_STATE.HEALTHY) {
    errors.push("completeness upgrade must not emit HEALTHY");
  }
  return pass("SP07-P2-T17", errors);
}

function runSp07P2T18() {
  const errors = [];
  const pred = healthyPredecessor();
  const before = JSON.stringify(pred);
  evaluateOperationUpdate(pred, candidateFromPredecessor(pred));
  if (JSON.stringify(pred) !== before) errors.push("predecessor object mutated");
  if (SP07_P2_WALL_MARKERS.p1Mutation !== false) errors.push("p1Mutation wall");
  return pass("SP07-P2-T18", errors);
}

async function readProductionSource() {
  const fs = await import("node:fs");
  const path = await import("node:path");
  const { fileURLToPath } = await import("node:url");
  const dir = path.dirname(fileURLToPath(import.meta.url));
  return ["operationUpdateContract.js", "operationUpdateEvaluator.js"]
    .map((f) => fs.readFileSync(path.join(dir, f), "utf8"))
    .join("\n");
}

async function runSp07P2T19() {
  const errors = [];
  const src = await readProductionSource();
  if (/from\s+["']@supabase/.test(src)) errors.push("supabase import forbidden");
  if (/createClient|writeFileSync|mkdirSync/.test(src)) errors.push("persistence API forbidden");
  if (/insert\(|upsert\(|persistentWrite/.test(src)) errors.push("write API forbidden");
  if (SP07_P2_WALL_MARKERS.persistence !== false) errors.push("persistence wall");
  const r = evaluateOperationUpdate(healthyPredecessor(), candidateFromPredecessor(healthyPredecessor()));
  if (r.invariants.noPersistentMutation !== true) errors.push("noPersistentMutation invariant");
  return pass("SP07-P2-T19", errors);
}

async function runSp07P2T20() {
  const errors = [];
  const src = await readProductionSource();
  const r = evaluateOperationUpdate(healthyPredecessor(), candidateFromPredecessor(healthyPredecessor()));
  if (r.sideEffects !== SIDE_EFFECTS.NONE) errors.push("sideEffects must be NONE");
  if (SP07_P2_WALL_MARKERS.sideEffects !== SIDE_EFFECTS.NONE) errors.push("sideEffects wall");
  if (SP07_P2_WALL_MARKERS.externalIo !== false) errors.push("externalIo wall");
  if (/fetch\(|WebSocket|setInterval|setTimeout/.test(src)) errors.push("external/async side-effect API");
  const raw = JSON.stringify(r);
  if (/webhook|notification|email|persistentWrite/i.test(raw)) errors.push("external action leakage");
  return pass("SP07-P2-T20", errors);
}

function runSp07P2T21() {
  const errors = [];
  const r = evaluateOperationUpdate(healthyPredecessor(), candidateFromPredecessor(healthyPredecessor()));
  if (r.delivery !== DELIVERY_STATUS.NOT_AUTHORIZED) errors.push("delivery must NOT_AUTHORIZED");
  if (SP07_P2_WALL_MARKERS.delivery !== DELIVERY_STATUS.NOT_AUTHORIZED) errors.push("delivery wall");
  if (SP07_P2_WALL_MARKERS.publicationDelivery !== false) errors.push("publicationDelivery wall");
  const raw = JSON.stringify(r);
  if (/ELIGIBLE|FORMED|publication\.delivery/i.test(raw)) errors.push("publication delivery leakage");
  return pass("SP07-P2-T21", errors);
}

function runSp07P2T22() {
  const errors = [];
  const r = evaluateOperationUpdate(healthyPredecessor(), candidateFromPredecessor(healthyPredecessor()));
  if (SP07_P2_WALL_MARKERS.ownerContact !== false) errors.push("ownerContact wall");
  const payload = JSON.stringify({
    updateDisposition: r.updateDisposition,
    reasons: r.reasons,
    delivery: r.delivery,
    sideEffects: r.sideEffects,
  });
  if (/owner disclosure|contact outreach|notifyOwner|mailto:/i.test(payload)) {
    errors.push("owner/contact action leakage");
  }
  return pass("SP07-P2-T22", errors);
}

function runSp07P2T23() {
  const errors = [];
  const r = evaluateOperationUpdate(healthyPredecessor(), candidateFromPredecessor(healthyPredecessor()));
  if (SP07_P2_WALL_MARKERS.productCoupling !== false) errors.push("productCoupling wall");
  if (SP07_P2_WALL_MARKERS.marketplaceCoupling !== false) errors.push("marketplaceCoupling wall");
  if (r.invariants.noProductMarketplaceCoupling !== true) {
    errors.push("noProductMarketplaceCoupling invariant");
  }
  const payload = JSON.stringify({
    updateDisposition: r.updateDisposition,
    reasons: r.reasons,
    delivery: r.delivery,
    operationalState: r.operationalState,
  });
  if (/Premium|Diamond|access_tier|Marketplace deal|Product entitlement/i.test(payload)) {
    errors.push("Product/Marketplace leakage");
  }
  return pass("SP07-P2-T23", errors);
}

const PROOFS = [
  runSp07P2T01,
  runSp07P2T02,
  runSp07P2T03,
  runSp07P2T04,
  runSp07P2T05,
  runSp07P2T06,
  runSp07P2T07,
  runSp07P2T08,
  runSp07P2T09,
  runSp07P2T10,
  runSp07P2T11,
  runSp07P2T12,
  runSp07P2T13,
  runSp07P2T14,
  runSp07P2T15,
  runSp07P2T16,
  runSp07P2T17,
  runSp07P2T18,
  runSp07P2T19,
  runSp07P2T20,
  runSp07P2T21,
  runSp07P2T22,
  runSp07P2T23,
];

/**
 * @returns {Promise<{ passed: boolean, results: object[], passCount: number, failCount: number }>}
 */
export async function runOperationUpdateHonestyValidation() {
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
  const { passed, results, passCount, failCount } = await runOperationUpdateHonestyValidation();
  for (const r of results) {
    const mark = r.passed ? "PASS" : "FAIL";
    console.log(`${mark} ${r.id}${r.errors.length ? ` — ${r.errors.join("; ")}` : ""}`);
  }
  console.log(
    passed
      ? `\nSP07-P2 OPERATION UPDATE HONESTY VALIDATION: PASS (${passCount}/23)`
      : `\nSP07-P2 OPERATION UPDATE HONESTY VALIDATION: FAIL (${passCount}/23, ${failCount} failed)`
  );

  const p1 = await runOperationWatchBaselineValidation();
  for (const r of p1.results) {
    const mark = r.passed ? "PASS" : "FAIL";
    console.log(`${mark} ${r.id}${r.errors.length ? ` — ${r.errors.join("; ")}` : ""}`);
  }
  console.log(
    p1.passed
      ? `\nSP07-P1 OPERATION WATCH BASELINE VALIDATION: PASS (${p1.passCount}/25)`
      : `\nSP07-P1 OPERATION WATCH BASELINE VALIDATION: FAIL (${p1.passCount}/25, ${p1.failCount} failed)`
  );

  process.exitCode = passed && p1.passed ? 0 : 1;
}

const isDirect =
  process.argv[1] &&
  (process.argv[1].endsWith("validateOperationUpdateHonesty.js") ||
    process.argv[1].includes("validateOperationUpdateHonesty"));

if (isDirect) {
  main();
}

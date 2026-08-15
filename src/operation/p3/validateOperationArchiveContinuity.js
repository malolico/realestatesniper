/**
 * SP07-P3 — Operation Archive continuity / proof harness (DAG-SP07-P3-G1)
 *
 * Frozen SP07-P3-T01…T29 proof obligations bound to production contract/evaluator.
 * Mandatory P1 + P2 regressions are invoked from main() (consume-only).
 * Runnable:
 *   node src/operation/p3/validateOperationArchiveContinuity.js
 */

import {
  DEPENDENCY_STATUS,
  EVIDENCE_CLASS,
  FRESHNESS,
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
  SCHEMA_VERSION as P2_SCHEMA_VERSION,
  SUBJECT_CLASS as P2_SUBJECT_CLASS,
  SUBJECT_SCHEMA_ID as P2_SUBJECT_SCHEMA_ID,
  UPDATE_RESULT_SCHEMA_ID,
  WATCH_RESULT_SCHEMA_ID,
} from "../p2/operationUpdateContract.js";
import { evaluateOperationUpdate } from "../p2/operationUpdateEvaluator.js";
import { runOperationUpdateHonestyValidation } from "../p2/validateOperationUpdateHonesty.js";
import {
  ARCHIVE_EVALUATION_STATUS,
  ARCHIVE_RECORD_SCHEMA_ID,
  ARCHIVE_REPLAY_RESULT_SCHEMA_ID,
  ARCHIVE_SEQUENCE_SCHEMA_ID,
  DELIVERY_STATUS,
  HISTORICAL_POSTURE,
  PERSISTENCE_STATUS,
  REPLAY_DISPOSITION,
  SCHEMA_VERSION,
  SIDE_EFFECTS,
  SOURCE_KIND,
  SUBJECT_CLASS,
  SUBJECT_SCHEMA_ID,
} from "./operationArchiveContract.js";
import {
  SP07_P3_WALL_MARKERS,
  formArchiveRecord,
  formArchiveSequence,
  formSupersedingArchiveRecord,
  replayArchiveSequence,
} from "./operationArchiveEvaluator.js";

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

function healthyWatchResult() {
  return evaluateWatchBaseline(buildWatchSnapshot());
}

function unknownWatchResult() {
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

function conflictWatchResult() {
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

function staleWatchResult() {
  return evaluateWatchBaseline(
    buildWatchSnapshot({
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
    })
  );
}

function candidateFromWatchResult(watchResult, overrides = {}) {
  const factual = watchResult.healthEvidence?.factual ?? [];
  const base = {
    meta: {
      schemaId: CANDIDATE_SCHEMA_ID,
      version: P2_SCHEMA_VERSION,
      observedAt: watchResult.meta?.evaluatedAt ?? "2026-08-14T10:00:00.000Z",
      subjectRef: "institutional-continuity-baseline",
    },
    subject: {
      subjectSchemaId: P2_SUBJECT_SCHEMA_ID,
      subjectClass: P2_SUBJECT_CLASS,
      programScope: "SP07-P2",
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
      observedAt: watchResult.meta?.evaluatedAt ?? "2026-08-14T10:00:00.000Z",
    },
    honesty: {
      unknown: watchResult.honesty?.unknown ?? { preserved: true },
      conflict: watchResult.honesty?.conflict ?? { blocking: false },
      freshness: watchResult.honesty?.freshness ?? { note: "freshnessIsNotTruth" },
      limitations: watchResult.honesty?.limitations ?? { freshnessIsNotTruth: true },
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

function healthyUpdateResult() {
  const pred = healthyWatchResult();
  return evaluateOperationUpdate(pred, candidateFromWatchResult(pred));
}

function acceptedRecord(source) {
  const formed = formArchiveRecord(source);
  if (formed.evaluationStatus !== ARCHIVE_EVALUATION_STATUS.ACCEPTED) {
    throw new Error(`fixture archive refused: ${JSON.stringify(formed.reasons)}`);
  }
  return formed.archiveRecord;
}

function runSp07P3T01() {
  const errors = [];
  const r = formArchiveRecord(healthyWatchResult());
  if (r.archiveRecord?.meta?.schemaId !== ARCHIVE_RECORD_SCHEMA_ID) {
    errors.push("archive schemaId");
  }
  if (r.archiveRecord?.meta?.version !== SCHEMA_VERSION) errors.push("archive version");
  return pass("SP07-P3-T01", errors);
}

function runSp07P3T02() {
  const errors = [];
  const rec = acceptedRecord(healthyWatchResult());
  const seq = formArchiveSequence([rec]);
  if (seq.archiveSequence?.meta?.schemaId !== ARCHIVE_SEQUENCE_SCHEMA_ID) {
    errors.push("sequence schemaId");
  }
  return pass("SP07-P3-T02", errors);
}

function runSp07P3T03() {
  const errors = [];
  const rec = acceptedRecord(healthyWatchResult());
  const seq = formArchiveSequence([rec]).archiveSequence;
  const replay = replayArchiveSequence(seq);
  if (replay.meta?.schemaId !== ARCHIVE_REPLAY_RESULT_SCHEMA_ID) {
    errors.push("replay schemaId");
  }
  return pass("SP07-P3-T03", errors);
}

function runSp07P3T04() {
  const errors = [];
  const watch = healthyWatchResult();
  if (watch.meta.schemaId !== WATCH_RESULT_SCHEMA_ID) errors.push("fixture not watch result");
  const r = formArchiveRecord(watch);
  if (r.evaluationStatus !== ARCHIVE_EVALUATION_STATUS.ACCEPTED) errors.push("must accept P1");
  if (r.archiveRecord?.sourceArtifact?.kind !== SOURCE_KIND.WATCH_RESULT) {
    errors.push("kind must be WATCH_RESULT");
  }
  return pass("SP07-P3-T04", errors);
}

function runSp07P3T05() {
  const errors = [];
  const update = healthyUpdateResult();
  if (update.meta.schemaId !== UPDATE_RESULT_SCHEMA_ID) errors.push("fixture not update result");
  const r = formArchiveRecord(update);
  if (r.evaluationStatus !== ARCHIVE_EVALUATION_STATUS.ACCEPTED) errors.push("must accept P2");
  if (r.archiveRecord?.sourceArtifact?.kind !== SOURCE_KIND.UPDATE_RESULT) {
    errors.push("kind must be UPDATE_RESULT");
  }
  return pass("SP07-P3-T05", errors);
}

function runSp07P3T06() {
  const errors = [];
  const r = formArchiveRecord(healthyWatchResult());
  if (r.archiveRecord?.subject?.subjectClass !== SUBJECT_CLASS) errors.push("subjectClass");
  if (r.archiveRecord?.subject?.subjectSchemaId !== SUBJECT_SCHEMA_ID) {
    errors.push("subjectSchemaId");
  }
  return pass("SP07-P3-T06", errors);
}

function runSp07P3T07() {
  const errors = [];
  const watch = healthyWatchResult();
  const r = formArchiveRecord(watch);
  if (r.archiveRecord?.sourceArtifact?.schemaId !== watch.meta.schemaId) {
    errors.push("source schemaId not preserved");
  }
  if (r.archiveRecord?.sourceArtifact?.version !== watch.meta.version) {
    errors.push("source version not preserved");
  }
  return pass("SP07-P3-T07", errors);
}

function runSp07P3T08() {
  const errors = [];
  const watch = healthyWatchResult();
  const r = formArchiveRecord(watch);
  if (JSON.stringify(r.archiveRecord.provenanceSnapshot) !== JSON.stringify(watch.provenance)) {
    errors.push("provenance not preserved");
  }
  return pass("SP07-P3-T08", errors);
}

function runSp07P3T09() {
  const errors = [];
  const unknown = unknownWatchResult();
  const r = formArchiveRecord(unknown);
  const facts = r.archiveRecord?.historicalFacts?.healthEvidence?.factual ?? [];
  const ev = facts.find((e) => e.evidenceId === "EV-REQUIRED-01");
  if (ev?.truthPosture !== TRUTH_POSTURE.UNKNOWN) errors.push("UNKNOWN truth not preserved");
  if (ev?.freshness !== FRESHNESS.UNKNOWN) errors.push("UNKNOWN freshness not preserved");
  if (r.archiveRecord?.historicalPosture !== HISTORICAL_POSTURE.HISTORICAL) {
    errors.push("must be HISTORICAL");
  }
  return pass("SP07-P3-T09", errors);
}

function runSp07P3T10() {
  const errors = [];
  const conflict = conflictWatchResult();
  const r = formArchiveRecord(conflict);
  const facts = r.archiveRecord?.historicalFacts?.healthEvidence?.factual ?? [];
  const ev = facts.find((e) => e.evidenceId === "EV-REQUIRED-01");
  if (ev?.truthPosture !== TRUTH_POSTURE.CONFLICT) errors.push("CONFLICT not preserved");
  if (r.archiveRecord?.honestySnapshot?.conflict?.blocking !== true) {
    errors.push("blocking conflict honesty not preserved");
  }
  return pass("SP07-P3-T10", errors);
}

function runSp07P3T11() {
  const errors = [];
  const conflict = conflictWatchResult();
  const r = formArchiveRecord(conflict);
  const facts = r.archiveRecord?.historicalFacts?.healthEvidence?.factual ?? [];
  if (!facts.some((e) => e.truthPosture === TRUTH_POSTURE.CONFLICT)) {
    errors.push("negative CONFLICT evidence disappeared");
  }
  const unknown = formArchiveRecord(unknownWatchResult());
  const uf = unknown.archiveRecord?.historicalFacts?.healthEvidence?.factual ?? [];
  if (!uf.some((e) => e.truthPosture === TRUTH_POSTURE.UNKNOWN)) {
    errors.push("negative UNKNOWN evidence disappeared");
  }
  return pass("SP07-P3-T11", errors);
}

function runSp07P3T12() {
  const errors = [];
  const unknown = unknownWatchResult();
  const r = formArchiveRecord(unknown);
  if (r.archiveRecord?.historicalFacts?.healthEvidence?.derived?.sufficientForHealthy === true) {
    errors.push("incompleteness must not upgrade to sufficient");
  }
  return pass("SP07-P3-T12", errors);
}

function runSp07P3T13() {
  const errors = [];
  const stale = staleWatchResult();
  const r = formArchiveRecord(stale);
  const facts = r.archiveRecord?.historicalFacts?.healthEvidence?.factual ?? [];
  const ev = facts.find((e) => e.evidenceId === "EV-REQUIRED-01");
  if (ev?.freshness !== FRESHNESS.STALE) errors.push("STALE freshness not preserved");
  if (ev?.truthPosture !== TRUTH_POSTURE.ASSERTED) {
    errors.push("stale must not become false/CONFLICT");
  }
  return pass("SP07-P3-T13", errors);
}

function runSp07P3T14() {
  const errors = [];
  const a = acceptedRecord(healthyWatchResult());
  const b = acceptedRecord(healthyUpdateResult());
  const beforeA = JSON.stringify(a);
  const seq = formArchiveSequence([b, a]);
  if (seq.evaluationStatus !== ARCHIVE_EVALUATION_STATUS.ACCEPTED) errors.push("sequence accept");
  if (seq.archiveSequence.records.length !== 2) errors.push("both records required");
  if (JSON.stringify(a) !== beforeA) errors.push("input record mutated");
  if (!seq.archiveSequence.auditContinuity?.priorRecordsRetained) {
    errors.push("priorRecordsRetained");
  }
  return pass("SP07-P3-T14", errors);
}

function runSp07P3T15() {
  const errors = [];
  const prior = acceptedRecord(unknownWatchResult());
  const priorJson = JSON.stringify(prior);
  const nextSource = healthyWatchResult();
  const formed = formSupersedingArchiveRecord(prior, nextSource);
  if (formed.evaluationStatus !== ARCHIVE_EVALUATION_STATUS.ACCEPTED) {
    errors.push("supersession must accept");
  }
  if (formed.archiveRecord?.supersession?.supersedes !== prior.meta.recordId) {
    errors.push("supersedes lineage missing");
  }
  if (JSON.stringify(formed.priorRecord) !== priorJson) errors.push("prior mutated");
  const seq = formArchiveSequence([formed.priorRecord, formed.archiveRecord]);
  if (seq.archiveSequence.records.length !== 2) errors.push("both prior and successor required");
  if (!seq.archiveSequence.records.some((r) => r.meta.recordId === prior.meta.recordId)) {
    errors.push("prior must remain in sequence");
  }
  return pass("SP07-P3-T15", errors);
}

function runSp07P3T16() {
  const errors = [];
  const watch = acceptedRecord(healthyWatchResult());
  const update = acceptedRecord(healthyUpdateResult());
  const seq = formArchiveSequence([update, watch]);
  const ids = seq.archiveSequence.records.map((r) => r.sourceArtifact.kind);
  if (ids[0] !== SOURCE_KIND.WATCH_RESULT || ids[1] !== SOURCE_KIND.UPDATE_RESULT) {
    errors.push(`expected WATCH then UPDATE got ${ids.join(",")}`);
  }
  if (seq.archiveSequence.ordering?.wallClockForbidden !== true) {
    errors.push("wallClockForbidden");
  }
  return pass("SP07-P3-T16", errors);
}

function runSp07P3T17() {
  const errors = [];
  const source = healthyWatchResult();
  const a = formArchiveRecord(source);
  const b = formArchiveRecord(source);
  if (JSON.stringify(a.archiveRecord) !== JSON.stringify(b.archiveRecord)) {
    errors.push("archive-record idempotency mismatch");
  }
  return pass("SP07-P3-T17", errors);
}

function runSp07P3T18() {
  const errors = [];
  const watch = acceptedRecord(healthyWatchResult());
  const update = acceptedRecord(healthyUpdateResult());
  const seq = formArchiveSequence([update, watch]).archiveSequence;
  const replay = replayArchiveSequence(seq);
  if (replay.replayDisposition !== REPLAY_DISPOSITION.RECONSTRUCTED) {
    errors.push("expected RECONSTRUCTED");
  }
  if (replay.reconstructedSequence?.records?.length !== 2) errors.push("reconstructed count");
  if (replay.lineageVerification?.ok !== true) errors.push("lineage verification");
  return pass("SP07-P3-T18", errors);
}

function runSp07P3T19() {
  const errors = [];
  const seq = formArchiveSequence([
    acceptedRecord(healthyWatchResult()),
    acceptedRecord(healthyUpdateResult()),
  ]).archiveSequence;
  const a = replayArchiveSequence(seq);
  const b = replayArchiveSequence(seq);
  if (JSON.stringify(a) !== JSON.stringify(b)) errors.push("replay idempotency mismatch");
  return pass("SP07-P3-T19", errors);
}

function runSp07P3T20() {
  const errors = [];
  const r1 = formArchiveRecord(null);
  if (r1.evaluationStatus !== ARCHIVE_EVALUATION_STATUS.REFUSED) errors.push("null must refuse");
  const r2 = formArchiveRecord({ notAnArtifact: true });
  if (r2.evaluationStatus !== ARCHIVE_EVALUATION_STATUS.REFUSED) {
    errors.push("malformed must refuse");
  }
  const r3 = formArchiveSequence("bad");
  if (r3.evaluationStatus !== ARCHIVE_EVALUATION_STATUS.REFUSED) {
    errors.push("bad sequence must refuse");
  }
  return pass("SP07-P3-T20", errors);
}

function runSp07P3T21() {
  const errors = [];
  const watch = healthyWatchResult();
  const poisoned = structuredClone(watch);
  poisoned.inputRef = { ...poisoned.inputRef, subjectClass: "Product" };
  const r = formArchiveRecord(poisoned);
  if (r.evaluationStatus !== ARCHIVE_EVALUATION_STATUS.REFUSED) {
    errors.push("Product subject must refuse");
  }
  return pass("SP07-P3-T21", errors);
}

function runSp07P3T22() {
  const errors = [];
  const watch = healthyWatchResult();
  const before = JSON.stringify(watch);
  formArchiveRecord(watch);
  if (JSON.stringify(watch) !== before) errors.push("P1 source mutated");
  if (SP07_P3_WALL_MARKERS.p1Mutation !== false) errors.push("p1Mutation wall");
  return pass("SP07-P3-T22", errors);
}

function runSp07P3T23() {
  const errors = [];
  const update = healthyUpdateResult();
  const before = JSON.stringify(update);
  formArchiveRecord(update);
  if (JSON.stringify(update) !== before) errors.push("P2 source mutated");
  if (SP07_P3_WALL_MARKERS.p2Mutation !== false) errors.push("p2Mutation wall");
  return pass("SP07-P3-T23", errors);
}

async function readProductionSource() {
  const fs = await import("node:fs");
  const path = await import("node:path");
  const { fileURLToPath } = await import("node:url");
  const dir = path.dirname(fileURLToPath(import.meta.url));
  return ["operationArchiveContract.js", "operationArchiveEvaluator.js"]
    .map((f) => fs.readFileSync(path.join(dir, f), "utf8"))
    .join("\n");
}

async function runSp07P3T24() {
  const errors = [];
  const src = await readProductionSource();
  if (/from\s+["']@supabase/.test(src)) errors.push("supabase import forbidden");
  if (/createClient|writeFileSync|mkdirSync/.test(src)) errors.push("persistence API forbidden");
  if (/insert\(|upsert\(|persistentWrite/.test(src)) errors.push("write API forbidden");
  if (SP07_P3_WALL_MARKERS.persistence !== PERSISTENCE_STATUS.NONE) {
    errors.push("persistence wall");
  }
  const r = formArchiveRecord(healthyWatchResult());
  if (r.persistence !== PERSISTENCE_STATUS.NONE) errors.push("result persistence");
  if (r.archiveRecord?.persistence !== PERSISTENCE_STATUS.NONE) {
    errors.push("record persistence");
  }
  return pass("SP07-P3-T24", errors);
}

async function runSp07P3T25() {
  const errors = [];
  const src = await readProductionSource();
  const r = formArchiveRecord(healthyWatchResult());
  if (r.sideEffects !== SIDE_EFFECTS.NONE) errors.push("sideEffects must be NONE");
  if (SP07_P3_WALL_MARKERS.externalIo !== false) errors.push("externalIo wall");
  if (/fetch\(|WebSocket|setInterval|setTimeout/.test(src)) {
    errors.push("external/async side-effect API");
  }
  const raw = JSON.stringify(r);
  if (/webhook|notification|email|persistentWrite/i.test(raw)) {
    errors.push("external action leakage");
  }
  return pass("SP07-P3-T25", errors);
}

function runSp07P3T26() {
  const errors = [];
  const r = formArchiveRecord(healthyWatchResult());
  if (r.delivery !== DELIVERY_STATUS.NOT_AUTHORIZED) errors.push("delivery");
  if (r.archiveRecord?.delivery !== DELIVERY_STATUS.NOT_AUTHORIZED) {
    errors.push("record delivery");
  }
  if (SP07_P3_WALL_MARKERS.publicationDelivery !== false) {
    errors.push("publicationDelivery wall");
  }
  return pass("SP07-P3-T26", errors);
}

function runSp07P3T27() {
  const errors = [];
  const r = formArchiveRecord(healthyWatchResult());
  if (SP07_P3_WALL_MARKERS.productCoupling !== false) errors.push("productCoupling");
  if (SP07_P3_WALL_MARKERS.marketplaceCoupling !== false) errors.push("marketplaceCoupling");
  const payload = JSON.stringify({
    schemaId: r.archiveRecord?.meta?.schemaId,
    subject: r.archiveRecord?.subject,
    delivery: r.delivery,
  });
  if (/Premium|Diamond|access_tier|Marketplace deal|Product entitlement/i.test(payload)) {
    errors.push("Product/Marketplace leakage");
  }
  return pass("SP07-P3-T27", errors);
}

function runSp07P3T28() {
  const errors = [];
  const r = formArchiveRecord(healthyWatchResult());
  if (SP07_P3_WALL_MARKERS.ownerContact !== false) errors.push("ownerContact wall");
  const payload = JSON.stringify({
    subject: r.archiveRecord?.subject,
    delivery: r.delivery,
    sideEffects: r.sideEffects,
  });
  if (/owner disclosure|contact outreach|notifyOwner|mailto:/i.test(payload)) {
    errors.push("owner/contact action leakage");
  }
  return pass("SP07-P3-T28", errors);
}

function runSp07P3T29() {
  const errors = [];
  if (SP07_P3_WALL_MARKERS.retryArchitecture !== false) errors.push("retryArchitecture");
  if (SP07_P3_WALL_MARKERS.recoveryGraph !== false) errors.push("recoveryGraph");
  if (SP07_P3_WALL_MARKERS.resumption !== false) errors.push("resumption");
  if (SP07_P3_WALL_MARKERS.p4Opened !== false) errors.push("p4Opened");
  const replay = replayArchiveSequence(
    formArchiveSequence([acceptedRecord(healthyWatchResult())]).archiveSequence
  );
  if (replay.auditContinuity?.noRecoverySemantics !== true) {
    errors.push("noRecoverySemantics");
  }
  if (replay.invariants?.p4WallIntact !== true) errors.push("p4WallIntact invariant");
  if (SP07_P3_WALL_MARKERS.scheduling !== false) errors.push("scheduling wall");
  return pass("SP07-P3-T29", errors);
}

const PROOFS = [
  runSp07P3T01,
  runSp07P3T02,
  runSp07P3T03,
  runSp07P3T04,
  runSp07P3T05,
  runSp07P3T06,
  runSp07P3T07,
  runSp07P3T08,
  runSp07P3T09,
  runSp07P3T10,
  runSp07P3T11,
  runSp07P3T12,
  runSp07P3T13,
  runSp07P3T14,
  runSp07P3T15,
  runSp07P3T16,
  runSp07P3T17,
  runSp07P3T18,
  runSp07P3T19,
  runSp07P3T20,
  runSp07P3T21,
  runSp07P3T22,
  runSp07P3T23,
  runSp07P3T24,
  runSp07P3T25,
  runSp07P3T26,
  runSp07P3T27,
  runSp07P3T28,
  runSp07P3T29,
];

/**
 * @returns {Promise<{ passed: boolean, results: object[], passCount: number, failCount: number }>}
 */
export async function runOperationArchiveContinuityValidation() {
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
  const { passed, results, passCount, failCount } = await runOperationArchiveContinuityValidation();
  for (const r of results) {
    const mark = r.passed ? "PASS" : "FAIL";
    console.log(`${mark} ${r.id}${r.errors.length ? ` — ${r.errors.join("; ")}` : ""}`);
  }
  console.log(
    passed
      ? `\nSP07-P3 OPERATION ARCHIVE CONTINUITY VALIDATION: PASS (${passCount}/29)`
      : `\nSP07-P3 OPERATION ARCHIVE CONTINUITY VALIDATION: FAIL (${passCount}/29, ${failCount} failed)`
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

  const p2 = await runOperationUpdateHonestyValidation();
  for (const r of p2.results) {
    const mark = r.passed ? "PASS" : "FAIL";
    console.log(`${mark} ${r.id}${r.errors.length ? ` — ${r.errors.join("; ")}` : ""}`);
  }
  console.log(
    p2.passed
      ? `\nSP07-P2 OPERATION UPDATE HONESTY VALIDATION: PASS (${p2.passCount}/23)`
      : `\nSP07-P2 OPERATION UPDATE HONESTY VALIDATION: FAIL (${p2.passCount}/23, ${p2.failCount} failed)`
  );

  process.exitCode = passed && p1.passed && p2.passed ? 0 : 1;
}

const isDirect =
  process.argv[1] &&
  (process.argv[1].endsWith("validateOperationArchiveContinuity.js") ||
    process.argv[1].includes("validateOperationArchiveContinuity"));

if (isDirect) {
  main();
}

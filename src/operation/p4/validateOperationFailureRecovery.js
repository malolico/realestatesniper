/**
 * SP07-P4 — Failure / Recovery / Dependency proof harness (DAG-SP07-P4-G1)
 *
 * Frozen SP07-P4-T01…T32 proof obligations bound to production contract/evaluator.
 * Mandatory P1 + P2 + P3 regressions are invoked from main() (consume-only).
 * Runnable:
 *   node src/operation/p4/validateOperationFailureRecovery.js
 */

import {
  DEPENDENCY_STATUS,
  EVIDENCE_CLASS,
  FRESHNESS,
  OPERATIONAL_STATE,
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
} from "../p2/operationUpdateContract.js";
import { evaluateOperationUpdate } from "../p2/operationUpdateEvaluator.js";
import { runOperationUpdateHonestyValidation } from "../p2/validateOperationUpdateHonesty.js";
import {
  ARCHIVE_REPLAY_RESULT_SCHEMA_ID,
  REPLAY_DISPOSITION,
} from "../p3/operationArchiveContract.js";
import {
  formArchiveRecord,
  formArchiveSequence,
  replayArchiveSequence,
} from "../p3/operationArchiveEvaluator.js";
import { runOperationArchiveContinuityValidation } from "../p3/validateOperationArchiveContinuity.js";
import {
  AUTOMATION_STATUS,
  DELIVERY_STATUS,
  EVALUATION_STATUS,
  FAILURE_CLASS,
  FAILURE_EVALUATION_SCHEMA_ID,
  PERSISTENCE_STATUS,
  RECOVERY_ELIGIBILITY,
  RECOVERY_PLAN_SCHEMA_ID,
  RECOVERY_PLAN_STATUS,
  RESUMPTION_DISPOSITION,
  RESUMPTION_RESULT_SCHEMA_ID,
  RETRY_DECISION,
  RETRY_DECISION_SCHEMA_ID,
  RETRY_ELIGIBILITY,
  SIDE_EFFECTS,
  TRANSITION_DISPOSITION,
  TRANSITION_RECOMMENDATION_SCHEMA_ID,
} from "./operationFailureRecoveryContract.js";
import {
  SP07_P4_WALL_MARKERS,
  decideRetry,
  evaluateFailure,
  evaluateFailureRecoveryPosture,
  evaluateResumption,
  planRecovery,
  recommendTransition,
} from "./operationFailureRecoveryEvaluator.js";

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
      observedAt: "2026-08-15T10:00:00.000Z",
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
      observedAt: "2026-08-15T10:00:00.000Z",
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

function staleWatchResult() {
  return evaluateWatchBaseline(
    buildWatchSnapshot({
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
    })
  );
}

function unavailableWatchResult() {
  return evaluateWatchBaseline(
    buildWatchSnapshot({
      dependencies: [
        {
          depId: "DEP-FS-READONLY",
          required: true,
          status: DEPENDENCY_STATUS.UNAVAILABLE,
        },
      ],
    })
  );
}

function degradedWatchResult() {
  // P1: any required STALE (but not all) → DEGRADED; DEGRADED ≠ UNAVAILABLE.
  return evaluateWatchBaseline(
    buildWatchSnapshot({
      evidence: [
        {
          evidenceId: "EV-REQUIRED-01",
          evidenceClass: EVIDENCE_CLASS.REQUIRED,
          value: { signal: "operability-baseline" },
          freshness: FRESHNESS.CURRENT,
          truthPosture: TRUTH_POSTURE.ASSERTED,
          provenance: { sourceKind: PROVENANCE_SOURCE_KIND.READ_ONLY_OBSERVATION },
        },
        {
          evidenceId: "EV-REQUIRED-02",
          evidenceClass: EVIDENCE_CLASS.REQUIRED,
          value: { signal: "partial-limitation" },
          freshness: FRESHNESS.STALE,
          truthPosture: TRUTH_POSTURE.ASSERTED,
          provenance: { sourceKind: PROVENANCE_SOURCE_KIND.READ_ONLY_OBSERVATION },
        },
      ],
    })
  );
}

function authorityWatchResult() {
  return evaluateWatchBaseline(
    buildWatchSnapshot({
      subject: {
        subjectSchemaId: P1_SUBJECT_SCHEMA_ID,
        subjectClass: P1_SUBJECT_CLASS,
        programScope: "SP07-P1",
        predecessorPosture: "CONSUME_ONLY",
        authorityUncertain: true,
      },
    })
  );
}

function healthyUpdateResult() {
  const predecessor = healthyWatchResult();
  const candidate = {
    meta: {
      schemaId: CANDIDATE_SCHEMA_ID,
      version: P2_SCHEMA_VERSION,
      observedAt: "2026-08-15T10:05:00.000Z",
      subjectRef: "institutional-continuity-baseline",
    },
    subject: {
      subjectSchemaId: P2_SUBJECT_SCHEMA_ID,
      subjectClass: P2_SUBJECT_CLASS,
      programScope: "SP07-P2",
    },
    evidence: [
      {
        evidenceId: "EV-REQUIRED-01",
        evidenceClass: EVIDENCE_CLASS.REQUIRED,
        value: { signal: "operability-baseline-v2" },
        freshness: FRESHNESS.CURRENT,
        truthPosture: TRUTH_POSTURE.ASSERTED,
        provenance: { sourceKind: PROVENANCE_SOURCE_KIND.READ_ONLY_OBSERVATION },
      },
    ],
    provenance: {
      sourceKind: PROVENANCE_SOURCE_KIND.READ_ONLY_OBSERVATION,
      observerId: "SP07-P2-INTERNAL-OBSERVER",
      observedAt: "2026-08-15T10:05:00.000Z",
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
  return evaluateOperationUpdate(predecessor, candidate);
}

function healthyReplayResult() {
  const rec = formArchiveRecord(healthyWatchResult());
  const seq = formArchiveSequence([rec.archiveRecord]).archiveSequence;
  return replayArchiveSequence(seq);
}

function runSp07P4T01() {
  const errors = [];
  const posture = evaluateFailureRecoveryPosture({ watchResult: healthyWatchResult() });
  const ids = [
    posture.failureEvaluation?.meta?.schemaId,
    posture.retryDecision?.meta?.schemaId,
    posture.recoveryPlan?.meta?.schemaId,
    posture.resumptionResult?.meta?.schemaId,
    posture.transitionRecommendation?.meta?.schemaId,
  ];
  const expected = [
    FAILURE_EVALUATION_SCHEMA_ID,
    RETRY_DECISION_SCHEMA_ID,
    RECOVERY_PLAN_SCHEMA_ID,
    RESUMPTION_RESULT_SCHEMA_ID,
    TRANSITION_RECOMMENDATION_SCHEMA_ID,
  ];
  for (let i = 0; i < expected.length; i++) {
    if (ids[i] !== expected[i]) errors.push(`schema ${expected[i]} got ${ids[i]}`);
  }
  return pass("SP07-P4-T01", errors);
}

function runSp07P4T02() {
  const errors = [];
  const classes = new Set([
    evaluateFailure({ watchResult: healthyWatchResult() }).failureEvaluation.failureClass,
    evaluateFailure({ watchResult: unknownWatchResult() }).failureEvaluation.failureClass,
    evaluateFailure({ watchResult: unavailableWatchResult() }).failureEvaluation.failureClass,
    evaluateFailure({ watchResult: staleWatchResult() }).failureEvaluation.failureClass,
    evaluateFailure({ watchResult: degradedWatchResult() }).failureEvaluation.failureClass,
    evaluateFailure({ watchResult: null }).failureEvaluation.failureClass,
  ]);
  for (const required of [
    FAILURE_CLASS.NONE_DETECTED,
    FAILURE_CLASS.UNKNOWN,
    FAILURE_CLASS.DEPENDENCY_UNAVAILABLE,
    FAILURE_CLASS.TRANSIENT,
    FAILURE_CLASS.DEPENDENCY_DEGRADED_LIMITED,
    FAILURE_CLASS.INVALID_MALFORMED,
  ]) {
    if (!classes.has(required)) errors.push(`missing taxonomy ${required}`);
  }
  return pass("SP07-P4-T02", errors);
}

function runSp07P4T03() {
  const errors = [];
  const r = evaluateFailure({ watchResult: unknownWatchResult() });
  if (r.failureEvaluation.failureClass !== FAILURE_CLASS.UNKNOWN) {
    errors.push(`expected UNKNOWN got ${r.failureEvaluation.failureClass}`);
  }
  if (r.failureEvaluation.honestyUnderFailure?.unknownIsNotFailure !== true) {
    errors.push("unknownIsNotFailure");
  }
  if (r.failureEvaluation.honestyUnderFailure?.unknownIsNotHealthy !== true) {
    errors.push("unknownIsNotHealthy");
  }
  const inv = r.invariants;
  if (inv.unknownIsNotNone !== true || inv.unknownIsNotZero !== true) {
    errors.push("UNKNOWN ≠ NONE/ZERO");
  }
  return pass("SP07-P4-T03", errors);
}

function runSp07P4T04() {
  const errors = [];
  const r1 = evaluateFailure(null);
  if (r1.evaluationStatus !== EVALUATION_STATUS.REFUSED) errors.push("null must refuse");
  const r2 = evaluateFailure({ watchResult: { notValid: true } });
  if (r2.evaluationStatus !== EVALUATION_STATUS.REFUSED) errors.push("malformed must refuse");
  if (r2.failureEvaluation?.failureClass !== FAILURE_CLASS.INVALID_MALFORMED) {
    errors.push("expected INVALID_MALFORMED");
  }
  if (r2.failureEvaluation?.failClosed !== true) errors.push("malformed must fail-closed");
  return pass("SP07-P4-T04", errors);
}

function runSp07P4T05() {
  const errors = [];
  const r = evaluateFailure({ watchResult: unavailableWatchResult() });
  if (r.failureEvaluation.failureClass !== FAILURE_CLASS.DEPENDENCY_UNAVAILABLE) {
    errors.push(`expected DEPENDENCY_UNAVAILABLE got ${r.failureEvaluation.failureClass}`);
  }
  if (r.failureEvaluation.failClosed !== true) errors.push("unavailable must fail-closed");
  if (r.failureEvaluation.dependencyPosture?.inventedDegradedButOperating !== false) {
    errors.push("must not invent degraded-but-operating");
  }
  return pass("SP07-P4-T05", errors);
}

function runSp07P4T06() {
  const errors = [];
  const degraded = evaluateFailure({ watchResult: degradedWatchResult() });
  const unavailable = evaluateFailure({ watchResult: unavailableWatchResult() });
  if (degraded.failureEvaluation.failureClass === FAILURE_CLASS.DEPENDENCY_UNAVAILABLE) {
    errors.push("DEGRADED must not collapse to UNAVAILABLE");
  }
  if (unavailable.failureEvaluation.failureClass === FAILURE_CLASS.DEPENDENCY_DEGRADED_LIMITED) {
    errors.push("UNAVAILABLE must not collapse to DEGRADED");
  }
  if (unavailable.failureEvaluation.dependencyPosture?.inventedDegradedButOperating !== false) {
    errors.push("invented degraded-but-operating");
  }
  return pass("SP07-P4-T06", errors);
}

function runSp07P4T07() {
  const errors = [];
  if (SP07_P4_WALL_MARKERS.dg03ParkedFailClosedDefault !== true) {
    errors.push("DG-03 park marker");
  }
  const r = evaluateFailure({ watchResult: unavailableWatchResult() });
  if (r.failureEvaluation.dependencyPosture?.dg03ParkedFailClosedDefault !== true) {
    errors.push("dg03ParkedFailClosedDefault");
  }
  if (r.failureEvaluation.failClosed !== true) errors.push("fail-closed default");
  return pass("SP07-P4-T07", errors);
}

function runSp07P4T08() {
  const errors = [];
  const r = decideRetry({ watchResult: staleWatchResult() });
  if (r.retryDecision.retryEligibility !== RETRY_ELIGIBILITY.RETRYABLE) {
    errors.push(`expected RETRYABLE got ${r.retryDecision.retryEligibility}`);
  }
  return pass("SP07-P4-T08", errors);
}

function runSp07P4T09() {
  const errors = [];
  const a = decideRetry({ watchResult: staleWatchResult() });
  const b = decideRetry({ watchResult: staleWatchResult() });
  if (a.retryDecision.retryDecision !== RETRY_DECISION.RETRY_ELIGIBLE_DERIVED) {
    errors.push("expected RETRY_ELIGIBLE_DERIVED");
  }
  if (JSON.stringify(a.retryDecision) !== JSON.stringify(b.retryDecision)) {
    errors.push("retry decision not deterministic");
  }
  return pass("SP07-P4-T09", errors);
}

function runSp07P4T10() {
  const errors = [];
  const r = decideRetry({ watchResult: staleWatchResult() });
  if (r.retryDecision.retryExecution?.authorized !== false) errors.push("retry authorized");
  if (r.retryDecision.retryExecution?.performed !== false) errors.push("retry performed");
  if (SP07_P4_WALL_MARKERS.retryExecution !== false) errors.push("retryExecution wall");
  return pass("SP07-P4-T10", errors);
}

function runSp07P4T11() {
  const errors = [];
  const r = planRecovery({ watchResult: unavailableWatchResult() });
  if (r.recoveryPlan.recoveryEligibility !== RECOVERY_ELIGIBILITY.RECOVERY_ELIGIBLE) {
    errors.push(`expected RECOVERY_ELIGIBLE got ${r.recoveryPlan.recoveryEligibility}`);
  }
  return pass("SP07-P4-T11", errors);
}

function runSp07P4T12() {
  const errors = [];
  const a = planRecovery({ watchResult: unavailableWatchResult() });
  const b = planRecovery({ watchResult: unavailableWatchResult() });
  if (a.recoveryPlan.planStatus !== RECOVERY_PLAN_STATUS.PLAN_DERIVED) {
    errors.push("expected PLAN_DERIVED");
  }
  if (JSON.stringify(a.recoveryPlan) !== JSON.stringify(b.recoveryPlan)) {
    errors.push("recovery plan not deterministic");
  }
  return pass("SP07-P4-T12", errors);
}

function runSp07P4T13() {
  const errors = [];
  const r = planRecovery({ watchResult: unavailableWatchResult() });
  if (r.recoveryPlan.recovered !== false) errors.push("recovered must be false");
  if (r.recoveryPlan.appliedRecovery !== false) errors.push("appliedRecovery must be false");
  if (r.recoveryPlan.recoveryEligibility === "RECOVERED") errors.push("must not claim RECOVERED");
  if (r.invariants.recoveryEligibleIsNotRecovered !== true) {
    errors.push("recoveryEligibleIsNotRecovered invariant");
  }
  return pass("SP07-P4-T13", errors);
}

function runSp07P4T14() {
  const errors = [];
  const r = evaluateResumption({ watchResult: unavailableWatchResult() });
  if (r.resumptionResult.resumptionDisposition !== RESUMPTION_DISPOSITION.RESUMPTION_EVALUATED) {
    errors.push(`expected RESUMPTION_EVALUATED got ${r.resumptionResult.resumptionDisposition}`);
  }
  return pass("SP07-P4-T14", errors);
}

function runSp07P4T15() {
  const errors = [];
  const a = evaluateResumption({ watchResult: unavailableWatchResult() });
  const b = evaluateResumption({ watchResult: unavailableWatchResult() });
  if (JSON.stringify(a.resumptionResult) !== JSON.stringify(b.resumptionResult)) {
    errors.push("resumption not deterministic");
  }
  return pass("SP07-P4-T15", errors);
}

function runSp07P4T16() {
  const errors = [];
  const r = evaluateResumption({ watchResult: unavailableWatchResult() });
  if (r.resumptionResult.resumptionExecuted !== false) errors.push("resumptionExecuted");
  if (r.resumptionResult.checkpointRestored !== false) errors.push("checkpointRestored");
  if (r.resumptionResult.persistentResumeState !== false) errors.push("persistentResumeState");
  if (SP07_P4_WALL_MARKERS.resumptionExecution !== false) errors.push("resumptionExecution wall");
  return pass("SP07-P4-T16", errors);
}

function runSp07P4T17() {
  const errors = [];
  const replay = healthyReplayResult();
  if (replay.replayDisposition !== REPLAY_DISPOSITION.RECONSTRUCTED) {
    errors.push("fixture replay");
  }
  const before = JSON.stringify(replay);
  const r = planRecovery({
    watchResult: unavailableWatchResult(),
    replayResult: replay,
  });
  if (JSON.stringify(replay) !== before) errors.push("replay mutated");
  if (r.recoveryPlan.replayConsumeOnly !== true) errors.push("replayConsumeOnly");
  if (replay.meta?.schemaId !== ARCHIVE_REPLAY_RESULT_SCHEMA_ID) errors.push("replay schema");
  return pass("SP07-P4-T17", errors);
}

function runSp07P4T18() {
  const errors = [];
  const r = planRecovery({
    watchResult: unavailableWatchResult(),
    replayResult: healthyReplayResult(),
  });
  if (r.recoveryPlan.replayIsNotRecovery !== true) errors.push("replayIsNotRecovery");
  if (r.recoveryPlan.recovered !== false) errors.push("must not claim recovered from replay");
  if (SP07_P4_WALL_MARKERS.replayIsNotRecovery !== true) errors.push("wall replay≠recovery");
  if (r.invariants.replaySuccessIsNotOperationalRecovery !== true) {
    errors.push("replaySuccessIsNotOperationalRecovery");
  }
  return pass("SP07-P4-T18", errors);
}

function runSp07P4T19() {
  const errors = [];
  const r = recommendTransition({ watchResult: unavailableWatchResult() });
  if (r.transitionRecommendation.transitionDisposition !== TRANSITION_DISPOSITION.RECOMMENDATION_DERIVED) {
    errors.push("expected RECOMMENDATION_DERIVED");
  }
  if (r.transitionRecommendation.recommendedOperationalState !== OPERATIONAL_STATE.FAIL_CLOSED) {
    errors.push("expected recommend FAIL_CLOSED");
  }
  return pass("SP07-P4-T19", errors);
}

function runSp07P4T20() {
  const errors = [];
  const r = recommendTransition({ watchResult: unavailableWatchResult() });
  if (r.transitionRecommendation.appliedTransition !== false) errors.push("appliedTransition");
  if (r.transitionRecommendation.derivedOnly !== true) errors.push("derivedOnly");
  if (SP07_P4_WALL_MARKERS.appliedTransition !== false) errors.push("appliedTransition wall");
  if (SP07_P4_WALL_MARKERS.derivedTransitionIsNotApplied !== true) {
    errors.push("derived≠applied wall");
  }
  return pass("SP07-P4-T20", errors);
}

function runSp07P4T21() {
  const errors = [];
  const input = { watchResult: staleWatchResult() };
  const a = decideRetry(input);
  const b = decideRetry(input);
  if (JSON.stringify(a.retryDecision) !== JSON.stringify(b.retryDecision)) {
    errors.push("retry idempotency");
  }
  return pass("SP07-P4-T21", errors);
}

function runSp07P4T22() {
  const errors = [];
  const input = { watchResult: unavailableWatchResult() };
  const a = planRecovery(input);
  const b = planRecovery(input);
  if (JSON.stringify(a.recoveryPlan) !== JSON.stringify(b.recoveryPlan)) {
    errors.push("recovery idempotency");
  }
  return pass("SP07-P4-T22", errors);
}

function runSp07P4T23() {
  const errors = [];
  const input = { watchResult: unavailableWatchResult() };
  const a = evaluateResumption(input);
  const b = evaluateResumption(input);
  if (JSON.stringify(a.resumptionResult) !== JSON.stringify(b.resumptionResult)) {
    errors.push("resumption idempotency");
  }
  return pass("SP07-P4-T23", errors);
}

function runSp07P4T24() {
  const errors = [];
  const input = { watchResult: unavailableWatchResult() };
  const a = recommendTransition(input);
  const b = recommendTransition(input);
  if (JSON.stringify(a.transitionRecommendation) !== JSON.stringify(b.transitionRecommendation)) {
    errors.push("transition idempotency");
  }
  return pass("SP07-P4-T24", errors);
}

function runSp07P4T25() {
  const errors = [];
  const r = evaluateFailure({
    watchResult: healthyWatchResult(),
    flags: { stopRulePressure: true },
  });
  if (r.failureEvaluation.failClosed !== true) errors.push("Stop Rule must fail-closed");
  if (r.failureEvaluation.failureClass !== FAILURE_CLASS.FAIL_CLOSED_BLOCKED) {
    errors.push("Stop Rule class");
  }
  if (SP07_P4_WALL_MARKERS.stopRulePreserved !== true) errors.push("stopRulePreserved wall");
  if (r.invariants.stopRulePreserved !== true) errors.push("stopRule invariant");
  return pass("SP07-P4-T25", errors);
}

function runSp07P4T26() {
  const errors = [];
  const unknown = evaluateFailure({ watchResult: unknownWatchResult() });
  if (unknown.failureEvaluation.failureClass === FAILURE_CLASS.NONE_DETECTED) {
    errors.push("UNKNOWN must not escalate to NONE_DETECTED/HEALTHY");
  }
  const unavailable = evaluateFailure({ watchResult: unavailableWatchResult() });
  if (unavailable._context?.watch?.operationalState === OPERATIONAL_STATE.HEALTHY) {
    errors.push("must not escalate watch to HEALTHY");
  }
  if (unavailable.failureEvaluation.failClosed !== true) errors.push("no silent operable upgrade");
  const inv = unavailable.invariants;
  if (inv.noSilentHealthyEscalation !== true) errors.push("noSilentHealthyEscalation");
  if (inv.noSilentCertaintyEscalation !== true) errors.push("noSilentCertaintyEscalation");
  if (inv.noSilentCompletenessUpgrade !== true) errors.push("noSilentCompletenessUpgrade");
  return pass("SP07-P4-T26", errors);
}

function runSp07P4T27() {
  const errors = [];
  const watch = healthyWatchResult();
  const update = healthyUpdateResult();
  const replay = healthyReplayResult();
  const beforeW = JSON.stringify(watch);
  const beforeU = JSON.stringify(update);
  const beforeR = JSON.stringify(replay);
  evaluateFailureRecoveryPosture({
    watchResult: watch,
    updateResult: update,
    replayResult: replay,
  });
  if (JSON.stringify(watch) !== beforeW) errors.push("P1 mutated");
  if (JSON.stringify(update) !== beforeU) errors.push("P2 mutated");
  if (JSON.stringify(replay) !== beforeR) errors.push("P3 mutated");
  if (SP07_P4_WALL_MARKERS.p1Mutation !== false) errors.push("p1Mutation wall");
  if (SP07_P4_WALL_MARKERS.p2Mutation !== false) errors.push("p2Mutation wall");
  if (SP07_P4_WALL_MARKERS.p3Mutation !== false) errors.push("p3Mutation wall");
  return pass("SP07-P4-T27", errors);
}

async function readProductionSource() {
  const fs = await import("node:fs");
  const path = await import("node:path");
  const { fileURLToPath } = await import("node:url");
  const dir = path.dirname(fileURLToPath(import.meta.url));
  return ["operationFailureRecoveryContract.js", "operationFailureRecoveryEvaluator.js"]
    .map((f) => fs.readFileSync(path.join(dir, f), "utf8"))
    .join("\n");
}

async function runSp07P4T28() {
  const errors = [];
  const src = await readProductionSource();
  if (/from\s+["']@supabase/.test(src)) errors.push("supabase import forbidden");
  if (/createClient|writeFileSync|mkdirSync/.test(src)) errors.push("persistence API forbidden");
  if (/insert\(|upsert\(|persistentWrite/.test(src)) errors.push("write API forbidden");
  if (SP07_P4_WALL_MARKERS.persistence !== PERSISTENCE_STATUS.NONE) {
    errors.push("persistence wall");
  }
  if (SP07_P4_WALL_MARKERS.supabaseAuthority !== false) errors.push("supabase wall");
  const r = evaluateFailure({ watchResult: healthyWatchResult() });
  if (r.persistence !== PERSISTENCE_STATUS.NONE) errors.push("result persistence");
  if (r.failureEvaluation?.persistence !== PERSISTENCE_STATUS.NONE) {
    errors.push("evaluation persistence");
  }
  return pass("SP07-P4-T28", errors);
}

async function runSp07P4T29() {
  const errors = [];
  const src = await readProductionSource();
  if (/setInterval|setTimeout|cron|WebSocket/.test(src)) {
    errors.push("scheduling/async automation API");
  }
  if (SP07_P4_WALL_MARKERS.automation !== AUTOMATION_STATUS.NONE) errors.push("automation wall");
  if (SP07_P4_WALL_MARKERS.scheduling !== false) errors.push("scheduling wall");
  if (SP07_P4_WALL_MARKERS.dg02Parked !== true) errors.push("dg02Parked");
  const r = decideRetry({ watchResult: staleWatchResult() });
  if (r.automation !== AUTOMATION_STATUS.NONE) errors.push("retry automation");
  return pass("SP07-P4-T29", errors);
}

async function runSp07P4T30() {
  const errors = [];
  const src = await readProductionSource();
  if (/fetch\(|WebSocket|child_process|exec\(|spawn\(/.test(src)) {
    errors.push("external/side-effect API");
  }
  if (SP07_P4_WALL_MARKERS.externalIo !== false) errors.push("externalIo wall");
  if (SP07_P4_WALL_MARKERS.sideEffects !== SIDE_EFFECTS.NONE) errors.push("sideEffects wall");
  const r = evaluateFailureRecoveryPosture({ watchResult: healthyWatchResult() });
  if (r.sideEffects !== SIDE_EFFECTS.NONE) errors.push("bundle sideEffects");
  const raw = JSON.stringify(r);
  if (/webhook|notification|email|persistentWrite/i.test(raw)) {
    errors.push("external action leakage");
  }
  return pass("SP07-P4-T30", errors);
}

function runSp07P4T31() {
  const errors = [];
  const r = evaluateFailureRecoveryPosture({ watchResult: healthyWatchResult() });
  if (r.delivery !== DELIVERY_STATUS.NOT_AUTHORIZED) errors.push("delivery");
  if (r.failureEvaluation?.delivery !== DELIVERY_STATUS.NOT_AUTHORIZED) {
    errors.push("evaluation delivery");
  }
  if (SP07_P4_WALL_MARKERS.publicationDelivery !== false) {
    errors.push("publicationDelivery wall");
  }
  if (SP07_P4_WALL_MARKERS.delivery !== DELIVERY_STATUS.NOT_AUTHORIZED) {
    errors.push("delivery wall");
  }
  return pass("SP07-P4-T31", errors);
}

function runSp07P4T32() {
  const errors = [];
  if (SP07_P4_WALL_MARKERS.productCoupling !== false) errors.push("productCoupling");
  if (SP07_P4_WALL_MARKERS.marketplaceCoupling !== false) errors.push("marketplaceCoupling");
  if (SP07_P4_WALL_MARKERS.ownerContact !== false) errors.push("ownerContact");
  const r = evaluateFailureRecoveryPosture({ watchResult: healthyWatchResult() });
  const payload = JSON.stringify({
    schemas: r.meta?.schemas,
    subject: r.failureEvaluation?.subject,
    delivery: r.delivery,
    sideEffects: r.sideEffects,
  });
  if (/Premium|Diamond|access_tier|Marketplace deal|Product entitlement/i.test(payload)) {
    errors.push("Product/Marketplace leakage");
  }
  if (/owner disclosure|contact outreach|notifyOwner|mailto:/i.test(payload)) {
    errors.push("owner/contact action leakage");
  }
  return pass("SP07-P4-T32", errors);
}

const PROOFS = [
  runSp07P4T01,
  runSp07P4T02,
  runSp07P4T03,
  runSp07P4T04,
  runSp07P4T05,
  runSp07P4T06,
  runSp07P4T07,
  runSp07P4T08,
  runSp07P4T09,
  runSp07P4T10,
  runSp07P4T11,
  runSp07P4T12,
  runSp07P4T13,
  runSp07P4T14,
  runSp07P4T15,
  runSp07P4T16,
  runSp07P4T17,
  runSp07P4T18,
  runSp07P4T19,
  runSp07P4T20,
  runSp07P4T21,
  runSp07P4T22,
  runSp07P4T23,
  runSp07P4T24,
  runSp07P4T25,
  runSp07P4T26,
  runSp07P4T27,
  runSp07P4T28,
  runSp07P4T29,
  runSp07P4T30,
  runSp07P4T31,
  runSp07P4T32,
];

/**
 * @returns {Promise<{ passed: boolean, results: object[], passCount: number, failCount: number }>}
 */
export async function runOperationFailureRecoveryValidation() {
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
  const { passed, results, passCount, failCount } = await runOperationFailureRecoveryValidation();
  for (const r of results) {
    const mark = r.passed ? "PASS" : "FAIL";
    console.log(`${mark} ${r.id}${r.errors.length ? ` — ${r.errors.join("; ")}` : ""}`);
  }
  console.log(
    passed
      ? `\nSP07-P4 OPERATION FAILURE RECOVERY VALIDATION: PASS (${passCount}/32)`
      : `\nSP07-P4 OPERATION FAILURE RECOVERY VALIDATION: FAIL (${passCount}/32, ${failCount} failed)`
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

  const p3 = await runOperationArchiveContinuityValidation();
  for (const r of p3.results) {
    const mark = r.passed ? "PASS" : "FAIL";
    console.log(`${mark} ${r.id}${r.errors.length ? ` — ${r.errors.join("; ")}` : ""}`);
  }
  console.log(
    p3.passed
      ? `\nSP07-P3 OPERATION ARCHIVE CONTINUITY VALIDATION: PASS (${p3.passCount}/29)`
      : `\nSP07-P3 OPERATION ARCHIVE CONTINUITY VALIDATION: FAIL (${p3.passCount}/29, ${p3.failCount} failed)`
  );

  process.exitCode = passed && p1.passed && p2.passed && p3.passed ? 0 : 1;
}

const isDirect =
  process.argv[1] &&
  (process.argv[1].endsWith("validateOperationFailureRecovery.js") ||
    process.argv[1].includes("validateOperationFailureRecovery"));

if (isDirect) {
  main();
}

/**
 * SP07-P3 — Operation Archive contract (DAG-SP07-P3-G1)
 *
 * Documentary schemas:
 *   rsn.operation.archive.record.v1
 *   rsn.operation.archive.sequence.v1
 *   rsn.operation.archive.replay.result.v1
 *
 * ARCHIVE != persistence · REPLAY != recovery · sideEffects NONE
 * delivery NOT_AUTHORIZED · persistence NONE · DG-01 parked
 */

import {
  DELIVERY_STATUS,
  RESULT_SCHEMA_ID as WATCH_RESULT_SCHEMA_ID,
  SCHEMA_VERSION as P1_SCHEMA_VERSION,
  SIDE_EFFECTS,
  SUBJECT_CLASS,
  SUBJECT_SCHEMA_ID,
} from "../p1/operationWatchContract.js";
import {
  UPDATE_RESULT_SCHEMA_ID,
  SCHEMA_VERSION as P2_SCHEMA_VERSION,
} from "../p2/operationUpdateContract.js";

export {
  DELIVERY_STATUS,
  SIDE_EFFECTS,
  SUBJECT_CLASS,
  SUBJECT_SCHEMA_ID,
  WATCH_RESULT_SCHEMA_ID,
  UPDATE_RESULT_SCHEMA_ID,
};

export const ARCHIVE_RECORD_SCHEMA_ID = "rsn.operation.archive.record.v1";
export const ARCHIVE_SEQUENCE_SCHEMA_ID = "rsn.operation.archive.sequence.v1";
export const ARCHIVE_REPLAY_RESULT_SCHEMA_ID = "rsn.operation.archive.replay.result.v1";
export const SCHEMA_VERSION = "v1";
export const RULE_VERSION = "sp07-p3-archive-replay-audit.v1";
export const PROGRAM_SCOPE = "SP07-P3";

export const WATCH_RESULT_VERSION = P1_SCHEMA_VERSION;
export const UPDATE_RESULT_VERSION = P2_SCHEMA_VERSION;

export const SOURCE_KIND = Object.freeze({
  WATCH_RESULT: "WATCH_RESULT",
  UPDATE_RESULT: "UPDATE_RESULT",
});

export const HISTORICAL_POSTURE = Object.freeze({
  HISTORICAL: "HISTORICAL",
  ACTIVE: "ACTIVE",
});

export const ARCHIVE_EVALUATION_STATUS = Object.freeze({
  ACCEPTED: "ACCEPTED",
  REFUSED: "REFUSED",
});

export const REPLAY_DISPOSITION = Object.freeze({
  RECONSTRUCTED: "RECONSTRUCTED",
  FAIL_CLOSED: "FAIL_CLOSED",
});

export const PERSISTENCE_STATUS = Object.freeze({
  NONE: "NONE",
});

export const REASON_CODES = Object.freeze({
  STRUCTURAL_INVALID: "STRUCTURAL_INVALID",
  SCHEMA_UNSUPPORTED: "SCHEMA_UNSUPPORTED",
  SUBJECT_INVALID: "SUBJECT_INVALID",
  OUT_OF_DOMAIN: "OUT_OF_DOMAIN",
  ARTIFACT_MISSING: "ARTIFACT_MISSING",
  ARTIFACT_INVALID: "ARTIFACT_INVALID",
  SEQUENCE_INVALID: "SEQUENCE_INVALID",
  REPLAY_INVALID: "REPLAY_INVALID",
  PROVENANCE_MISSING: "PROVENANCE_MISSING",
  HONESTY_MISSING: "HONESTY_MISSING",
  FAIL_CLOSED: "FAIL_CLOSED",
});

export function buildArchiveInvariants() {
  return Object.freeze({
    archiveIsNotPersistence: true,
    replayIsNotRecovery: true,
    activeIsNotHistorical: true,
    evaluationIsNotPersistence: true,
    sideEffectsNone: true,
    deliveryNotAuthorized: true,
    persistenceNone: true,
    unknownIsNotNone: true,
    unknownIsNotZero: true,
    freshnessIsNotTruth: true,
    staleIsNotFalse: true,
    absenceOfEvidenceIsNotHealthy: true,
    absenceOfFailureIsNotHealthy: true,
    noSilentHistoricalTruthUpgrade: true,
    noRetroactiveRewrite: true,
    appendOnlySemantic: true,
    noP1Mutation: true,
    noP2Mutation: true,
    noPersistentMutation: true,
    noAutomatedArchivalMutation: true,
    noProductMarketplaceCoupling: true,
    noPublicationDelivery: true,
    noSupabaseAuthority: true,
    dg01ParkedOutsideCore: true,
    p4WallIntact: true,
  });
}

/**
 * @param {object} parts
 */
export function buildArchiveRecord(parts) {
  if (parts.historicalPosture !== HISTORICAL_POSTURE.HISTORICAL) {
    throw new Error("archive record historicalPosture must be HISTORICAL");
  }
  if (!Object.values(SOURCE_KIND).includes(parts.sourceArtifact.kind)) {
    throw new Error(`Unsupported source kind: ${parts.sourceArtifact.kind}`);
  }

  return Object.freeze({
    meta: Object.freeze({
      schemaId: ARCHIVE_RECORD_SCHEMA_ID,
      version: SCHEMA_VERSION,
      ruleVersion: RULE_VERSION,
      recordId: parts.recordId,
    }),
    sourceArtifact: Object.freeze({ ...parts.sourceArtifact }),
    subject: Object.freeze({ ...parts.subject }),
    historicalPosture: HISTORICAL_POSTURE.HISTORICAL,
    honestySnapshot: Object.freeze(parts.honestySnapshot),
    provenanceSnapshot: Object.freeze(parts.provenanceSnapshot),
    lineageRefs: Object.freeze(parts.lineageRefs),
    historicalFacts: Object.freeze(parts.historicalFacts),
    canonicalTime: Object.freeze(parts.canonicalTime),
    supersession: Object.freeze(parts.supersession),
    auditContinuity: Object.freeze(parts.auditContinuity),
    invariants: buildArchiveInvariants(),
    sideEffects: SIDE_EFFECTS.NONE,
    delivery: DELIVERY_STATUS.NOT_AUTHORIZED,
    persistence: PERSISTENCE_STATUS.NONE,
  });
}

/**
 * @param {object} parts
 */
export function buildArchiveSequence(parts) {
  return Object.freeze({
    meta: Object.freeze({
      schemaId: ARCHIVE_SEQUENCE_SCHEMA_ID,
      version: SCHEMA_VERSION,
      ruleVersion: RULE_VERSION,
    }),
    subject: Object.freeze({ ...parts.subject }),
    records: Object.freeze(parts.records.map((r) => Object.freeze(r))),
    ordering: Object.freeze({ ...parts.ordering }),
    auditContinuity: Object.freeze(parts.auditContinuity),
    invariants: buildArchiveInvariants(),
    sideEffects: SIDE_EFFECTS.NONE,
    delivery: DELIVERY_STATUS.NOT_AUTHORIZED,
    persistence: PERSISTENCE_STATUS.NONE,
  });
}

/**
 * @param {object} parts
 */
export function buildReplayResult(parts) {
  const dispositions = Object.values(REPLAY_DISPOSITION);
  if (!dispositions.includes(parts.replayDisposition)) {
    throw new Error(`Unsupported replayDisposition: ${parts.replayDisposition}`);
  }

  return Object.freeze({
    meta: Object.freeze({
      schemaId: ARCHIVE_REPLAY_RESULT_SCHEMA_ID,
      version: SCHEMA_VERSION,
      ruleVersion: RULE_VERSION,
    }),
    replayDisposition: parts.replayDisposition,
    subject: parts.subject ? Object.freeze({ ...parts.subject }) : null,
    reconstructedSequence: parts.reconstructedSequence
      ? Object.freeze(parts.reconstructedSequence)
      : null,
    lineageVerification: Object.freeze(parts.lineageVerification),
    auditContinuity: Object.freeze(parts.auditContinuity),
    reasons: Object.freeze(
      (parts.reasons ?? []).map((r) => Object.freeze({ code: r.code, message: r.message }))
    ),
    invariants: buildArchiveInvariants(),
    sideEffects: SIDE_EFFECTS.NONE,
    delivery: DELIVERY_STATUS.NOT_AUTHORIZED,
    persistence: PERSISTENCE_STATUS.NONE,
  });
}

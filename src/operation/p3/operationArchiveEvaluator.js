/**
 * SP07-P3 — Operation Archive evaluator (DAG-SP07-P3-G1)
 *
 * Deterministic in-memory archive-record formation · historical sequence · read-only replay.
 * sideEffects NONE · persistence NONE · REPLAY != recovery · no P1/P2 mutation · no IO.
 */

import {
  ARCHIVE_EVALUATION_STATUS,
  ARCHIVE_RECORD_SCHEMA_ID,
  ARCHIVE_SEQUENCE_SCHEMA_ID,
  DELIVERY_STATUS,
  HISTORICAL_POSTURE,
  PERSISTENCE_STATUS,
  PROGRAM_SCOPE,
  REASON_CODES,
  REPLAY_DISPOSITION,
  RULE_VERSION,
  SCHEMA_VERSION,
  SIDE_EFFECTS,
  SOURCE_KIND,
  SUBJECT_CLASS,
  SUBJECT_SCHEMA_ID,
  UPDATE_RESULT_SCHEMA_ID,
  UPDATE_RESULT_VERSION,
  WATCH_RESULT_SCHEMA_ID,
  WATCH_RESULT_VERSION,
  buildArchiveRecord,
  buildArchiveSequence,
  buildReplayResult,
} from "./operationArchiveContract.js";

const FORBIDDEN_SUBJECT_MARKERS = Object.freeze([
  "Product",
  "Marketplace",
  "deal",
  "Publication",
  "ELR",
  "owner",
  "contact",
  "SP08",
]);

function deepSnapshot(value) {
  if (value === undefined) return null;
  return structuredClone(value);
}

function stableStringify(value) {
  if (value === null || typeof value !== "object") return JSON.stringify(value);
  if (Array.isArray(value)) {
    return `[${value.map((v) => stableStringify(v)).join(",")}]`;
  }
  const keys = Object.keys(value).sort();
  return `{${keys.map((k) => `${JSON.stringify(k)}:${stableStringify(value[k])}`).join(",")}}`;
}

function refuseEnvelope(errors, code) {
  return Object.freeze({
    evaluationStatus: ARCHIVE_EVALUATION_STATUS.REFUSED,
    archiveRecord: null,
    reasons: Object.freeze(errors.map((message) => Object.freeze({ code, message }))),
    invariants: Object.freeze({
      archiveIsNotPersistence: true,
      persistenceNone: true,
      sideEffectsNone: true,
      deliveryNotAuthorized: true,
      dg01ParkedOutsideCore: true,
    }),
    sideEffects: SIDE_EFFECTS.NONE,
    delivery: DELIVERY_STATUS.NOT_AUTHORIZED,
    persistence: PERSISTENCE_STATUS.NONE,
  });
}

/**
 * @param {unknown} artifact
 */
export function acceptHistoricalArtifact(artifact) {
  if (artifact == null) {
    return {
      ok: false,
      code: REASON_CODES.ARTIFACT_MISSING,
      errors: ["historical artifact missing"],
    };
  }
  if (typeof artifact !== "object" || Array.isArray(artifact)) {
    return {
      ok: false,
      code: REASON_CODES.STRUCTURAL_INVALID,
      errors: ["historical artifact must be a structured object"],
    };
  }

  const schemaId = artifact.meta?.schemaId;
  if (schemaId === WATCH_RESULT_SCHEMA_ID) {
    return acceptWatchResult(artifact);
  }
  if (schemaId === UPDATE_RESULT_SCHEMA_ID) {
    return acceptUpdateResult(artifact);
  }
  if (schemaId == null) {
    return {
      ok: false,
      code: REASON_CODES.ARTIFACT_INVALID,
      errors: ["meta.schemaId required"],
    };
  }
  return {
    ok: false,
    code: REASON_CODES.SCHEMA_UNSUPPORTED,
    errors: [`unsupported historical schemaId: ${schemaId}`],
  };
}

function acceptWatchResult(result) {
  const errors = [];
  if (result.meta?.version !== WATCH_RESULT_VERSION) {
    errors.push(`watch result version must be ${WATCH_RESULT_VERSION}`);
  }
  if (result.operationalState == null) errors.push("operationalState required");
  if (result.healthEvidence == null || typeof result.healthEvidence !== "object") {
    errors.push("healthEvidence required");
  }
  if (result.honesty == null || typeof result.honesty !== "object") {
    errors.push("honesty required");
  }
  if (result.provenance == null || typeof result.provenance !== "object") {
    errors.push("provenance required");
  }
  if (result.sideEffects !== "NONE") errors.push("sideEffects must be NONE");
  if (result.delivery !== "NOT_AUTHORIZED") errors.push("delivery must be NOT_AUTHORIZED");

  const subjectClass = result.inputRef?.subjectClass ?? result.subject?.subjectClass;
  if (subjectClass != null && subjectClass !== SUBJECT_CLASS) {
    errors.push("subjectClass out of domain");
  }
  if (subjectClass && FORBIDDEN_SUBJECT_MARKERS.some((m) => String(subjectClass).includes(m))) {
    errors.push("out-of-domain subject");
  }

  if (errors.length > 0) {
    const code = errors.some((e) => e.includes("version") || e.includes("schemaId"))
      ? REASON_CODES.SCHEMA_UNSUPPORTED
      : errors.some((e) => e.includes("subject") || e.includes("out-of-domain"))
        ? REASON_CODES.OUT_OF_DOMAIN
        : errors.some((e) => e.includes("provenance"))
          ? REASON_CODES.PROVENANCE_MISSING
          : errors.some((e) => e.includes("honesty"))
            ? REASON_CODES.HONESTY_MISSING
            : REASON_CODES.ARTIFACT_INVALID;
    return { ok: false, code, errors };
  }

  return {
    ok: true,
    kind: SOURCE_KIND.WATCH_RESULT,
    artifact: result,
    subjectClass: subjectClass ?? SUBJECT_CLASS,
  };
}

function acceptUpdateResult(result) {
  const errors = [];
  if (result.meta?.version !== UPDATE_RESULT_VERSION) {
    errors.push(`update result version must be ${UPDATE_RESULT_VERSION}`);
  }
  if (result.updateDisposition == null) errors.push("updateDisposition required");
  if (result.honestyContinuity == null || typeof result.honestyContinuity !== "object") {
    errors.push("honestyContinuity required");
  }
  if (result.provenance == null || typeof result.provenance !== "object") {
    errors.push("provenance required");
  }
  if (result.sideEffects !== "NONE") errors.push("sideEffects must be NONE");
  if (result.delivery !== "NOT_AUTHORIZED") errors.push("delivery must be NOT_AUTHORIZED");

  const subjectClass =
    result.predecessorRef?.inputRef?.subjectClass ??
    result.candidateRef?.subjectClass ??
    result.subject?.subjectClass;
  if (subjectClass != null && subjectClass !== SUBJECT_CLASS) {
    errors.push("subjectClass out of domain");
  }
  if (subjectClass && FORBIDDEN_SUBJECT_MARKERS.some((m) => String(subjectClass).includes(m))) {
    errors.push("out-of-domain subject");
  }

  if (errors.length > 0) {
    const code = errors.some((e) => e.includes("version") || e.includes("schemaId"))
      ? REASON_CODES.SCHEMA_UNSUPPORTED
      : errors.some((e) => e.includes("subject") || e.includes("out-of-domain"))
        ? REASON_CODES.OUT_OF_DOMAIN
        : errors.some((e) => e.includes("provenance"))
          ? REASON_CODES.PROVENANCE_MISSING
          : errors.some((e) => e.includes("honesty"))
            ? REASON_CODES.HONESTY_MISSING
            : REASON_CODES.ARTIFACT_INVALID;
    return { ok: false, code, errors };
  }

  return {
    ok: true,
    kind: SOURCE_KIND.UPDATE_RESULT,
    artifact: result,
    subjectClass: subjectClass ?? SUBJECT_CLASS,
  };
}

function computeRecordId(kind, artifact, lineageRefs, canonicalTime) {
  return `ARCHIVE:${kind}:${artifact.meta.schemaId}:${artifact.meta.version}:${
    canonicalTime.evaluatedAt ?? "null"
  }:${canonicalTime.observedAt ?? "null"}:${stableStringify(lineageRefs)}`;
}

function extractCanonicalTime(kind, artifact) {
  if (kind === SOURCE_KIND.WATCH_RESULT) {
    return Object.freeze({
      evaluatedAt: artifact.meta?.evaluatedAt ?? null,
      observedAt: artifact.inputRef?.observedAt ?? null,
    });
  }
  return Object.freeze({
    evaluatedAt: artifact.predecessorRef?.evaluatedAt ?? null,
    observedAt: artifact.candidateRef?.observedAt ?? null,
  });
}

function extractLineageRefs(kind, artifact) {
  if (kind === SOURCE_KIND.WATCH_RESULT) {
    return Object.freeze({
      inputRef: deepSnapshot(artifact.inputRef ?? null),
      predecessorRef: null,
      candidateRef: null,
    });
  }
  return Object.freeze({
    inputRef: null,
    predecessorRef: deepSnapshot(artifact.predecessorRef ?? null),
    candidateRef: deepSnapshot(artifact.candidateRef ?? null),
  });
}

function extractHonestySnapshot(kind, artifact) {
  if (kind === SOURCE_KIND.WATCH_RESULT) {
    return deepSnapshot(artifact.honesty);
  }
  return deepSnapshot(artifact.honestyContinuity);
}

function extractHistoricalFacts(kind, artifact) {
  if (kind === SOURCE_KIND.WATCH_RESULT) {
    return Object.freeze({
      operationalState: artifact.operationalState ?? null,
      evaluationStatus: artifact.evaluationStatus ?? null,
      meaningfulChange: artifact.meaningfulChange ?? null,
      healthEvidence: deepSnapshot(artifact.healthEvidence),
      updateDisposition: null,
      changeSurface: null,
    });
  }
  return Object.freeze({
    operationalState: artifact.operationalState ?? null,
    evaluationStatus: null,
    meaningfulChange: null,
    healthEvidence: null,
    updateDisposition: artifact.updateDisposition ?? null,
    changeSurface: deepSnapshot(artifact.changeSurface ?? []),
  });
}

/**
 * Form a single archive record from a CLOSED P1 or P2 historical artifact.
 * Does not mutate the source.
 * @param {unknown} source
 * @param {{ supersedes?: string | null }} [options]
 */
export function formArchiveRecord(source, options = {}) {
  const accepted = acceptHistoricalArtifact(source);
  if (!accepted.ok) {
    return refuseEnvelope(accepted.errors, accepted.code);
  }

  const { kind, artifact, subjectClass } = accepted;
  const lineageRefs = extractLineageRefs(kind, artifact);
  const canonicalTime = extractCanonicalTime(kind, artifact);
  const recordId = computeRecordId(kind, artifact, lineageRefs, canonicalTime);

  const record = buildArchiveRecord({
    recordId,
    sourceArtifact: {
      kind,
      schemaId: artifact.meta.schemaId,
      version: artifact.meta.version,
      ruleVersion: artifact.meta.ruleVersion ?? null,
    },
    subject: {
      subjectSchemaId: SUBJECT_SCHEMA_ID,
      subjectClass,
      programScope: PROGRAM_SCOPE,
    },
    historicalPosture: HISTORICAL_POSTURE.HISTORICAL,
    honestySnapshot: extractHonestySnapshot(kind, artifact),
    provenanceSnapshot: deepSnapshot(artifact.provenance),
    lineageRefs,
    historicalFacts: extractHistoricalFacts(kind, artifact),
    canonicalTime,
    supersession: {
      supersedes: options.supersedes ?? null,
      supersededBy: null,
    },
    auditContinuity: {
      sourceSchemaPreserved: true,
      provenancePreserved: true,
      honestyPreserved: true,
      noRetroactiveRewrite: true,
      evaluatedBy: PROGRAM_SCOPE,
      ruleVersion: RULE_VERSION,
    },
  });

  return Object.freeze({
    evaluationStatus: ARCHIVE_EVALUATION_STATUS.ACCEPTED,
    archiveRecord: record,
    reasons: Object.freeze([]),
    sideEffects: SIDE_EFFECTS.NONE,
    delivery: DELIVERY_STATUS.NOT_AUTHORIZED,
    persistence: PERSISTENCE_STATUS.NONE,
  });
}

function citesPredecessor(later, earlier) {
  if (later.supersession?.supersedes === earlier.meta?.recordId) return true;
  if (
    earlier.sourceArtifact?.kind === SOURCE_KIND.WATCH_RESULT &&
    later.sourceArtifact?.kind === SOURCE_KIND.UPDATE_RESULT
  ) {
    const pref = later.lineageRefs?.predecessorRef;
    if (pref == null) return false;
    if (pref.schemaId !== earlier.sourceArtifact.schemaId) return false;
    if (
      pref.evaluatedAt != null &&
      earlier.canonicalTime?.evaluatedAt != null &&
      pref.evaluatedAt === earlier.canonicalTime.evaluatedAt
    ) {
      return true;
    }
    if (pref.inputRef != null && earlier.lineageRefs?.inputRef != null) {
      return stableStringify(pref.inputRef) === stableStringify(earlier.lineageRefs.inputRef);
    }
    return pref.schemaId === WATCH_RESULT_SCHEMA_ID;
  }
  return false;
}

function timeKey(record) {
  return record.canonicalTime?.evaluatedAt ?? record.canonicalTime?.observedAt ?? null;
}

/**
 * Deterministic ordering per Freeze §15.
 * @param {object} a
 * @param {object} b
 */
export function compareArchiveRecords(a, b) {
  if (citesPredecessor(b, a) && !citesPredecessor(a, b)) return -1;
  if (citesPredecessor(a, b) && !citesPredecessor(b, a)) return 1;

  const ta = timeKey(a);
  const tb = timeKey(b);
  if (ta != null && tb != null && ta !== tb) {
    return ta < tb ? -1 : 1;
  }
  if (ta != null && tb == null) return -1;
  if (ta == null && tb != null) return 1;

  const kindRank = (k) => (k === SOURCE_KIND.WATCH_RESULT ? 0 : 1);
  const ka = kindRank(a.sourceArtifact?.kind);
  const kb = kindRank(b.sourceArtifact?.kind);
  if (ka !== kb) return ka - kb;

  const sa = a.sourceArtifact?.schemaId ?? "";
  const sb = b.sourceArtifact?.schemaId ?? "";
  if (sa !== sb) return sa < sb ? -1 : 1;

  const la = stableStringify(a.lineageRefs ?? null);
  const lb = stableStringify(b.lineageRefs ?? null);
  if (la !== lb) return la < lb ? -1 : 1;

  const ra = a.sourceArtifact?.ruleVersion ?? "";
  const rb = b.sourceArtifact?.ruleVersion ?? "";
  if (ra !== rb) return ra < rb ? -1 : 1;

  const ida = a.meta?.recordId ?? "";
  const idb = b.meta?.recordId ?? "";
  if (ida === idb) return 0;
  return ida < idb ? -1 : 1;
}

/**
 * Form a non-destructive ordered historical sequence. Does not mutate inputs.
 * @param {unknown} records
 */
export function formArchiveSequence(records) {
  if (!Array.isArray(records)) {
    return Object.freeze({
      evaluationStatus: ARCHIVE_EVALUATION_STATUS.REFUSED,
      archiveSequence: null,
      reasons: Object.freeze([
        {
          code: REASON_CODES.SEQUENCE_INVALID,
          message: "records must be an array of archive records",
        },
      ]),
      sideEffects: SIDE_EFFECTS.NONE,
      delivery: DELIVERY_STATUS.NOT_AUTHORIZED,
      persistence: PERSISTENCE_STATUS.NONE,
    });
  }

  const errors = [];
  for (const [i, r] of records.entries()) {
    if (r?.meta?.schemaId !== ARCHIVE_RECORD_SCHEMA_ID) {
      errors.push(`records[${i}] must be ${ARCHIVE_RECORD_SCHEMA_ID}`);
    }
    if (r?.historicalPosture !== HISTORICAL_POSTURE.HISTORICAL) {
      errors.push(`records[${i}] historicalPosture must be HISTORICAL`);
    }
    if (r?.sideEffects !== SIDE_EFFECTS.NONE) {
      errors.push(`records[${i}] sideEffects must be NONE`);
    }
  }
  if (errors.length > 0) {
    return Object.freeze({
      evaluationStatus: ARCHIVE_EVALUATION_STATUS.REFUSED,
      archiveSequence: null,
      reasons: Object.freeze(
        errors.map((message) =>
          Object.freeze({ code: REASON_CODES.SEQUENCE_INVALID, message })
        )
      ),
      sideEffects: SIDE_EFFECTS.NONE,
      delivery: DELIVERY_STATUS.NOT_AUTHORIZED,
      persistence: PERSISTENCE_STATUS.NONE,
    });
  }

  const cloned = records.map((r) => deepSnapshot(r));
  cloned.sort(compareArchiveRecords);

  const subject = deepSnapshot(cloned[0]?.subject ?? {
    subjectSchemaId: SUBJECT_SCHEMA_ID,
    subjectClass: SUBJECT_CLASS,
    programScope: PROGRAM_SCOPE,
  });

  const sequence = buildArchiveSequence({
    subject,
    records: cloned,
    ordering: {
      deterministic: true,
      rule: "lineage-then-canonicalTime-then-kind-schema-lineageRefs-ruleVersion",
      wallClockForbidden: true,
    },
    auditContinuity: {
      priorRecordsRetained: true,
      appendOnlySemantic: true,
      noSilentRewrite: true,
      recordCount: cloned.length,
      evaluatedBy: PROGRAM_SCOPE,
    },
  });

  return Object.freeze({
    evaluationStatus: ARCHIVE_EVALUATION_STATUS.ACCEPTED,
    archiveSequence: sequence,
    reasons: Object.freeze([]),
    sideEffects: SIDE_EFFECTS.NONE,
    delivery: DELIVERY_STATUS.NOT_AUTHORIZED,
    persistence: PERSISTENCE_STATUS.NONE,
  });
}

/**
 * Correction/supersession: new record + retained predecessor. Does not mutate prior.
 * @param {object} priorRecord
 * @param {unknown} newSource
 */
export function formSupersedingArchiveRecord(priorRecord, newSource) {
  if (priorRecord?.meta?.schemaId !== ARCHIVE_RECORD_SCHEMA_ID) {
    return refuseEnvelope(
      ["priorRecord must be an accepted archive record"],
      REASON_CODES.ARTIFACT_INVALID
    );
  }

  const formed = formArchiveRecord(newSource, {
    supersedes: priorRecord.meta.recordId,
  });
  if (formed.evaluationStatus !== ARCHIVE_EVALUATION_STATUS.ACCEPTED) {
    return formed;
  }

  const priorClone = deepSnapshot(priorRecord);
  const successor = formed.archiveRecord;

  return Object.freeze({
    evaluationStatus: ARCHIVE_EVALUATION_STATUS.ACCEPTED,
    priorRecord: priorClone,
    archiveRecord: successor,
    reasons: Object.freeze([]),
    sideEffects: SIDE_EFFECTS.NONE,
    delivery: DELIVERY_STATUS.NOT_AUTHORIZED,
    persistence: PERSISTENCE_STATUS.NONE,
  });
}

/**
 * Deterministic read-only replay/reconstruction from a canonical sequence.
 * @param {unknown} sequence
 */
export function replayArchiveSequence(sequence) {
  if (sequence == null || typeof sequence !== "object" || Array.isArray(sequence)) {
    return buildReplayResult({
      replayDisposition: REPLAY_DISPOSITION.FAIL_CLOSED,
      subject: null,
      reconstructedSequence: null,
      lineageVerification: { ok: false },
      auditContinuity: { evaluationRefused: true },
      reasons: [
        {
          code: REASON_CODES.REPLAY_INVALID,
          message: "sequence must be a structured archive sequence",
        },
      ],
    });
  }

  if (sequence.meta?.schemaId !== ARCHIVE_SEQUENCE_SCHEMA_ID) {
    return buildReplayResult({
      replayDisposition: REPLAY_DISPOSITION.FAIL_CLOSED,
      subject: null,
      reconstructedSequence: null,
      lineageVerification: { ok: false },
      auditContinuity: { evaluationRefused: true },
      reasons: [
        {
          code: REASON_CODES.SCHEMA_UNSUPPORTED,
          message: `sequence schemaId must be ${ARCHIVE_SEQUENCE_SCHEMA_ID}`,
        },
      ],
    });
  }

  if (sequence.meta?.version !== SCHEMA_VERSION) {
    return buildReplayResult({
      replayDisposition: REPLAY_DISPOSITION.FAIL_CLOSED,
      subject: null,
      reconstructedSequence: null,
      lineageVerification: { ok: false },
      auditContinuity: { evaluationRefused: true },
      reasons: [
        {
          code: REASON_CODES.SCHEMA_UNSUPPORTED,
          message: `sequence version must be ${SCHEMA_VERSION}`,
        },
      ],
    });
  }

  if (!Array.isArray(sequence.records) || sequence.records.length === 0) {
    return buildReplayResult({
      replayDisposition: REPLAY_DISPOSITION.FAIL_CLOSED,
      subject: deepSnapshot(sequence.subject),
      reconstructedSequence: null,
      lineageVerification: { ok: false },
      auditContinuity: { evaluationRefused: true },
      reasons: [
        {
          code: REASON_CODES.SEQUENCE_INVALID,
          message: "sequence.records must be a non-empty array",
        },
      ],
    });
  }

  const reconstructed = deepSnapshot(sequence.records);
  reconstructed.sort(compareArchiveRecords);

  const byId = new Map(reconstructed.map((r) => [r.meta.recordId, r]));
  const lineageOk = reconstructed.every((r) => {
    const supersedes = r.supersession?.supersedes;
    if (supersedes == null) return true;
    return byId.has(supersedes);
  });

  const orderMatches =
    stableStringify(reconstructed.map((r) => r.meta.recordId)) ===
    stableStringify(sequence.records.map((r) => r.meta.recordId));

  const rebuilt = formArchiveSequence(reconstructed);
  if (rebuilt.evaluationStatus !== ARCHIVE_EVALUATION_STATUS.ACCEPTED) {
    return buildReplayResult({
      replayDisposition: REPLAY_DISPOSITION.FAIL_CLOSED,
      subject: deepSnapshot(sequence.subject),
      reconstructedSequence: null,
      lineageVerification: { ok: false },
      auditContinuity: { evaluationRefused: true },
      reasons: rebuilt.reasons,
    });
  }

  return buildReplayResult({
    replayDisposition: REPLAY_DISPOSITION.RECONSTRUCTED,
    subject: deepSnapshot(sequence.subject),
    reconstructedSequence: rebuilt.archiveSequence,
    lineageVerification: Object.freeze({
      ok: lineageOk,
      orderDeterministic: true,
      inputOrderAlreadyCanonical: orderMatches,
      recordCount: reconstructed.length,
    }),
    auditContinuity: Object.freeze({
      reconstructed: true,
      priorRecordsRetained: true,
      noRetroactiveRewrite: true,
      noRecoverySemantics: true,
      evaluatedBy: PROGRAM_SCOPE,
      ruleVersion: RULE_VERSION,
    }),
    reasons: [],
  });
}

/** Static wall markers for proof harness (no runtime coupling). */
export const SP07_P3_WALL_MARKERS = Object.freeze({
  sideEffects: SIDE_EFFECTS.NONE,
  delivery: DELIVERY_STATUS.NOT_AUTHORIZED,
  persistence: PERSISTENCE_STATUS.NONE,
  supabaseAuthority: false,
  automatedArchivalMutation: false,
  p1Mutation: false,
  p2Mutation: false,
  productCoupling: false,
  marketplaceCoupling: false,
  publicationDelivery: false,
  ownerContact: false,
  externalIo: false,
  scheduling: false,
  retryArchitecture: false,
  recoveryGraph: false,
  resumption: false,
  p4Opened: false,
  p5Opened: false,
  sp08Opened: false,
  dg01ParkedOutsideCore: true,
});

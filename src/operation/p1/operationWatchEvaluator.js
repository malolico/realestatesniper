/**
 * SP07-P1 — Operation Watch evaluator (DAG-SP07-P1-G1)
 *
 * Bounded watch snapshot evaluation · operational-state baseline · health evidence.
 * sideEffects NONE · WATCH ≠ UPDATE · no persistent mutation · no IO.
 */

import {
  buildWatchResult,
  DELIVERY_STATUS,
  DEPENDENCY_STATUS,
  EVALUATION_STATUS,
  EVIDENCE_CLASS,
  FRESHNESS,
  MATERIAL_CHANGE_CLASS,
  MEANINGFUL_CHANGE,
  OPERATIONAL_STATE,
  PROGRAM_SCOPE,
  PROVENANCE_SOURCE_KIND,
  REASON_CODES,
  REQUIRED_TOP_LEVEL,
  SCHEMA_VERSION,
  SIDE_EFFECTS,
  SNAPSHOT_SCHEMA_ID,
  SUBJECT_CLASS,
  SUBJECT_SCHEMA_ID,
  TRUTH_POSTURE,
} from "./operationWatchContract.js";

/**
 * @param {string[]} errors
 * @param {string} code
 */
function refusedResult(errors, code, provenance = {}, honesty = {}) {
  return buildWatchResult({
    evaluationStatus: EVALUATION_STATUS.REFUSED,
    operationalState: OPERATIONAL_STATE.FAIL_CLOSED,
    meaningfulChange: MEANINGFUL_CHANGE.UNKNOWN,
    meaningfulChangeReasons: [],
    healthEvidence: Object.freeze({
      factual: Object.freeze([]),
      derived: Object.freeze({ sufficientForHealthy: false }),
      limitations: Object.freeze({ evaluationRefused: true }),
    }),
    inputRef: Object.freeze({ accepted: false }),
    provenance: Object.freeze({ ...provenance }),
    honesty: Object.freeze({
      unknown: honesty.unknown ?? null,
      conflict: honesty.conflict ?? null,
      freshness: honesty.freshness ?? null,
      limitations: Object.freeze(honesty.limitations ?? {}),
    }),
    reasons: errors.map((message) => ({ code, message })),
  });
}

/**
 * Structural accept gate — fail-closed REFUSED.
 * @param {unknown} snapshot
 */
export function acceptWatchSnapshot(snapshot) {
  if (snapshot == null || typeof snapshot !== "object" || Array.isArray(snapshot)) {
    return {
      ok: false,
      code: REASON_CODES.STRUCTURAL_INVALID,
      errors: ["watch snapshot must be a structured object"],
    };
  }

  const errors = [];
  const keys = Object.keys(snapshot);

  for (const k of REQUIRED_TOP_LEVEL) {
    if (!Object.prototype.hasOwnProperty.call(snapshot, k)) {
      errors.push(`missing required top-level section: ${k}`);
    }
  }
  for (const k of keys) {
    if (!REQUIRED_TOP_LEVEL.includes(k)) {
      errors.push(`unexpected top-level section: ${k}`);
    }
  }

  const meta = snapshot.meta;
  if (meta?.schemaId !== SNAPSHOT_SCHEMA_ID) {
    errors.push(`unsupported schemaId (expected ${SNAPSHOT_SCHEMA_ID})`);
  }
  if (meta?.version !== SCHEMA_VERSION) {
    errors.push(`unsupported version (expected ${SCHEMA_VERSION})`);
  }
  if (typeof meta?.observedAt !== "string" || meta.observedAt.length === 0) {
    errors.push("meta.observedAt required (ISO-8601)");
  }

  const subject = snapshot.subject;
  if (subject?.subjectClass !== SUBJECT_CLASS) {
    errors.push(`subject.subjectClass must be ${SUBJECT_CLASS}`);
  }
  if (subject?.programScope === "SP08" || subject?.claimsScaleOut === true) {
    errors.push("subject must not claim SP08 / Scale Out");
  }

  const prov = snapshot.provenance;
  if (prov == null || typeof prov !== "object") {
    errors.push("missing provenance section");
  } else {
    if (prov.sourceKind == null) errors.push("provenance.sourceKind required");
    if (prov.observerId == null || prov.observerId === "") {
      errors.push("provenance.observerId required");
    }
    if (prov.observedAt == null) errors.push("provenance.observedAt required");
  }

  if (!Array.isArray(snapshot.evidence) || snapshot.evidence.length === 0) {
    errors.push("evidence must be a non-empty array");
  } else {
    for (const [i, ev] of snapshot.evidence.entries()) {
      if (ev?.evidenceId == null) errors.push(`evidence[${i}].evidenceId required`);
      if (ev?.evidenceClass == null) errors.push(`evidence[${i}].evidenceClass required`);
      if (ev?.freshness == null) errors.push(`evidence[${i}].freshness required`);
      if (ev?.truthPosture == null) errors.push(`evidence[${i}].truthPosture required`);
    }
  }

  if (!Array.isArray(snapshot.dependencies)) {
    errors.push("dependencies must be an array");
  } else {
    for (const [i, dep] of snapshot.dependencies.entries()) {
      if (dep?.depId == null) errors.push(`dependencies[${i}].depId required`);
      if (dep?.status == null) errors.push(`dependencies[${i}].status required`);
    }
  }

  if (errors.some((e) => e.includes("schemaId") || e.includes("version"))) {
    return { ok: false, code: REASON_CODES.SCHEMA_UNSUPPORTED, errors, snapshot };
  }
  if (errors.some((e) => e.includes("subject"))) {
    return { ok: false, code: REASON_CODES.SUBJECT_INVALID, errors, snapshot };
  }
  if (errors.some((e) => e.includes("provenance"))) {
    return { ok: false, code: REASON_CODES.PROVENANCE_MISSING, errors, snapshot };
  }
  if (errors.length > 0) {
    return { ok: false, code: REASON_CODES.STRUCTURAL_INVALID, errors, snapshot };
  }

  return { ok: true, snapshot };
}

/**
 * Deterministic normalization for repeat / no-change comparison.
 * @param {object} snapshot
 */
export function normalizeWatchSnapshot(snapshot) {
  return JSON.stringify({
    meta: {
      schemaId: snapshot.meta.schemaId,
      version: snapshot.meta.version,
      observedAt: snapshot.meta.observedAt,
      subjectRef: snapshot.meta.subjectRef ?? null,
    },
    subject: snapshot.subject,
    evidence: snapshot.evidence,
    provenance: snapshot.provenance,
    honesty: snapshot.honesty,
    dependencies: snapshot.dependencies,
  });
}

/**
 * @param {object} snapshot
 */
function citeInputRef(snapshot) {
  return Object.freeze({
    schemaId: snapshot.meta.schemaId,
    version: snapshot.meta.version,
    observedAt: snapshot.meta.observedAt,
    subjectClass: snapshot.subject.subjectClass,
    programScope: snapshot.subject.programScope ?? PROGRAM_SCOPE,
  });
}

/**
 * @param {object[]} evidence
 */
function assembleHealthEvidence(evidence, dependencies) {
  const factual = evidence.map((ev) =>
    Object.freeze({
      evidenceId: ev.evidenceId,
      evidenceClass: ev.evidenceClass,
      freshness: ev.freshness,
      truthPosture: ev.truthPosture,
      value: ev.value ?? null,
    })
  );

  const required = evidence.filter((e) => e.evidenceClass === EVIDENCE_CLASS.REQUIRED);
  const requiredPresent = required.length > 0;
  const requiredCurrent = required.every((e) => e.freshness === FRESHNESS.CURRENT);
  const requiredNoConflict = required.every((e) => e.truthPosture !== TRUTH_POSTURE.CONFLICT);
  const requiredDepsReachable = dependencies
    .filter((d) => d.required === true)
    .every((d) => d.status === DEPENDENCY_STATUS.REACHABLE);

  const sufficientForHealthy =
    requiredPresent && requiredCurrent && requiredNoConflict && requiredDepsReachable;

  return Object.freeze({
    factual: Object.freeze(factual),
    derived: Object.freeze({
      requiredCount: required.length,
      requiredCurrent,
      requiredNoConflict,
      requiredDepsReachable,
      sufficientForHealthy,
    }),
    limitations: Object.freeze({
      freshnessIsNotTruth: true,
      unknownIsNotNone: true,
      absenceOfEvidenceIsNotHealthy: true,
      absenceOfFailureIsNotHealthy: true,
    }),
  });
}

/**
 * Map operational state from accepted snapshot (deterministic).
 * @param {object} snapshot
 * @param {ReturnType<assembleHealthEvidence>} healthEvidence
 */
function mapOperationalState(snapshot, healthEvidence) {
  const honesty = snapshot.honesty ?? {};
  const limitations = honesty.limitations ?? {};

  if (limitations.authorityUncertain === true || honesty.authorityUncertain === true) {
    return {
      state: OPERATIONAL_STATE.AUTHORITY_UNCERTAIN,
      reasons: [
        {
          code: REASON_CODES.AUTHORITY_UNCERTAIN,
          message: "authority boundary uncertain — fail-closed",
        },
      ],
    };
  }

  if (limitations.stopRulePressure === true) {
    return {
      state: OPERATIONAL_STATE.FAIL_CLOSED,
      reasons: [
        {
          code: REASON_CODES.STOP_RULE_PRESSURE,
          message: "Stop Rule pressure — fail-closed",
        },
      ],
    };
  }

  const requiredDeps = snapshot.dependencies.filter((d) => d.required === true);
  const unavailableRequired = requiredDeps.some(
    (d) => d.status === DEPENDENCY_STATUS.UNAVAILABLE
  );
  if (unavailableRequired) {
    return {
      state: OPERATIONAL_STATE.UNAVAILABLE,
      reasons: [
        {
          code: REASON_CODES.DEPENDENCY_UNAVAILABLE,
          message: "required dependency unreachable",
        },
      ],
    };
  }

  const requiredEvidence = snapshot.evidence.filter(
    (e) => e.evidenceClass === EVIDENCE_CLASS.REQUIRED
  );
  if (requiredEvidence.length === 0) {
    return {
      state: OPERATIONAL_STATE.INSUFFICIENT_EVIDENCE,
      reasons: [
        {
          code: REASON_CODES.EVIDENCE_INSUFFICIENT,
          message: "no REQUIRED evidence — insufficient for defended state",
        },
      ],
    };
  }

  const conflictRequired = requiredEvidence.some(
    (e) => e.truthPosture === TRUTH_POSTURE.CONFLICT
  );
  if (conflictRequired || honesty.conflict?.blocking === true) {
    return {
      state: OPERATIONAL_STATE.BLOCKED,
      reasons: [
        {
          code: REASON_CODES.CONFLICT_BLOCKED,
          message: "required-dimension conflict — blocked",
        },
      ],
    };
  }

  const allStaleRequired = requiredEvidence.every((e) => e.freshness === FRESHNESS.STALE);
  const anyStaleRequired = requiredEvidence.some((e) => e.freshness === FRESHNESS.STALE);
  const anyUnknownRequired = requiredEvidence.some(
    (e) => e.freshness === FRESHNESS.UNKNOWN || e.truthPosture === TRUTH_POSTURE.UNKNOWN
  );

  if (healthEvidence.derived.sufficientForHealthy) {
    return {
      state: OPERATIONAL_STATE.HEALTHY,
      reasons: [
        {
          code: REASON_CODES.HEALTHY_BASELINE,
          message: "positive minimum health evidence satisfied",
        },
      ],
    };
  }

  if (allStaleRequired) {
    return {
      state: OPERATIONAL_STATE.STALE,
      reasons: [
        {
          code: REASON_CODES.STALE_EVIDENCE,
          message: "required evidence stale — current state not defensible as HEALTHY",
        },
      ],
    };
  }

  if (anyStaleRequired || anyUnknownRequired) {
    return {
      state: OPERATIONAL_STATE.DEGRADED,
      reasons: [
        {
          code: REASON_CODES.DEGRADED_LIMITATION,
          message: "operable with known limitations — not sufficient for HEALTHY",
        },
      ],
    };
  }

  return {
    state: OPERATIONAL_STATE.INSUFFICIENT_EVIDENCE,
    reasons: [
      {
        code: REASON_CODES.EVIDENCE_INSUFFICIENT,
        message: "insufficient positive evidence for HEALTHY",
      },
    ],
  };
}

/**
 * Detect meaningful change vs previous accepted evaluation input.
 * @param {object} current
 * @param {object | null | undefined} previous
 */
export function detectMeaningfulChange(current, previous) {
  if (previous == null) {
    return {
      meaningfulChange: MEANINGFUL_CHANGE.UNKNOWN,
      reasons: [],
    };
  }

  const curNorm = normalizeWatchSnapshot(current);
  const prevNorm = normalizeWatchSnapshot(previous);
  if (curNorm === prevNorm) {
    return { meaningfulChange: MEANINGFUL_CHANGE.FALSE, reasons: [] };
  }

  const reasons = [];

  const curStates = new Set(current.evidence.map((e) => `${e.evidenceId}:${e.evidenceClass}`));
  const prevStates = new Set(previous.evidence.map((e) => `${e.evidenceId}:${e.evidenceClass}`));
  for (const id of curStates) {
    if (!prevStates.has(id)) {
      reasons.push({
        code: MATERIAL_CHANGE_CLASS.EVIDENCE_CLASS_SHIFT,
        message: `evidence appeared: ${id}`,
      });
    }
  }
  for (const id of prevStates) {
    if (!curStates.has(id)) {
      reasons.push({
        code: MATERIAL_CHANGE_CLASS.EVIDENCE_CLASS_SHIFT,
        message: `evidence disappeared: ${id}`,
      });
    }
  }

  for (const ev of current.evidence) {
    const prev = previous.evidence.find((p) => p.evidenceId === ev.evidenceId);
    if (prev && prev.freshness !== ev.freshness) {
      reasons.push({
        code: MATERIAL_CHANGE_CLASS.FRESHNESS_THRESHOLD_CROSS,
        message: `${ev.evidenceId} freshness ${prev.freshness} → ${ev.freshness}`,
      });
    }
    if (prev && prev.truthPosture !== ev.truthPosture) {
      reasons.push({
        code: MATERIAL_CHANGE_CLASS.CONFLICT_EMERGENCE,
        message: `${ev.evidenceId} truthPosture ${prev.truthPosture} → ${ev.truthPosture}`,
      });
    }
  }

  for (const dep of current.dependencies) {
    const prev = previous.dependencies.find((p) => p.depId === dep.depId);
    if (prev && prev.status !== dep.status) {
      reasons.push({
        code: MATERIAL_CHANGE_CLASS.DEPENDENCY_POSTURE_SHIFT,
        message: `${dep.depId} ${prev.status} → ${dep.status}`,
      });
    }
  }

  if (
    current.honesty?.authorityUncertain !== previous.honesty?.authorityUncertain &&
    current.honesty?.authorityUncertain === true
  ) {
    reasons.push({
      code: MATERIAL_CHANGE_CLASS.AUTHORITY_PRESSURE,
      message: "authority uncertainty emerged",
    });
  }

  const curEval = evaluateWatchBaseline(current, null);
  const prevEval = evaluateWatchBaseline(previous, null);
  if (curEval.operationalState !== prevEval.operationalState) {
    reasons.push({
      code: MATERIAL_CHANGE_CLASS.OPERATIONAL_STATE_SHIFT,
      message: `${prevEval.operationalState} → ${curEval.operationalState}`,
    });
  }

  return {
    meaningfulChange: reasons.length > 0 ? MEANINGFUL_CHANGE.TRUE : MEANINGFUL_CHANGE.FALSE,
    reasons,
  };
}

/**
 * Evaluate watch baseline for one snapshot.
 * @param {unknown} snapshot
 * @param {object | null | undefined} previousSnapshot
 */
export function evaluateWatchBaseline(snapshot, previousSnapshot = null) {
  const accept = acceptWatchSnapshot(snapshot);
  if (!accept.ok) {
    return refusedResult(
      accept.errors,
      accept.code,
      snapshot?.provenance ?? {},
      snapshot?.honesty ?? {}
    );
  }

  const s = accept.snapshot;
  const healthEvidence = assembleHealthEvidence(s.evidence, s.dependencies);
  const mapped = mapOperationalState(s, healthEvidence);
  const change = detectMeaningfulChange(s, previousSnapshot);

  const honesty = Object.freeze({
    unknown: s.honesty?.unknown ?? null,
    conflict: s.honesty?.conflict ?? null,
    freshness: s.honesty?.freshness ?? null,
    limitations: Object.freeze({
      ...(s.honesty?.limitations ?? {}),
      freshnessIsNotTruth: true,
      unknownIsNotNone: true,
    }),
  });

  return buildWatchResult({
    evaluatedAt: s.meta.observedAt,
    evaluationStatus: EVALUATION_STATUS.ACCEPTED,
    operationalState: mapped.state,
    meaningfulChange: change.meaningfulChange,
    meaningfulChangeReasons: change.reasons,
    healthEvidence,
    inputRef: citeInputRef(s),
    provenance: Object.freeze({ ...s.provenance }),
    honesty,
    reasons: mapped.reasons,
  });
}

/** Static wall markers for proof harness (no runtime coupling). */
export const SP07_P1_WALL_MARKERS = Object.freeze({
  sideEffects: SIDE_EFFECTS.NONE,
  delivery: DELIVERY_STATUS.NOT_AUTHORIZED,
  observability: "INTERNAL_ONLY",
  supabaseAuthority: false,
  productCoupling: false,
  marketplaceCoupling: false,
  publicationDelivery: false,
  ownerContact: false,
  externalIo: false,
  p2Opened: false,
  sp08Opened: false,
  cb17Authority: false,
  predecessorWriteBack: false,
});

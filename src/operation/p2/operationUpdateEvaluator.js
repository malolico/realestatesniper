/**
 * SP07-P2 — Operation Update evaluator (DAG-SP07-P2-G1)
 *
 * Deterministic predecessor + candidate evaluation → derived update result.
 * sideEffects NONE · WATCH ≠ UPDATE · no P1 mutation · no persistence · no IO.
 */

import {
  DEPENDENCY_STATUS,
  EVIDENCE_CLASS,
  FRESHNESS,
  SIDE_EFFECTS,
  SUBJECT_SCHEMA_ID,
  TRUTH_POSTURE,
} from "../p1/operationWatchContract.js";
import {
  CANDIDATE_REQUIRED_TOP_LEVEL,
  CANDIDATE_SCHEMA_ID,
  CHANGE_SURFACE,
  DELIVERY_STATUS,
  OPERATIONAL_STATE,
  PREDECESSOR_SCHEMA_ID,
  PREDECESSOR_VERSION,
  PROGRAM_SCOPE,
  REASON_CODES,
  SCHEMA_VERSION,
  SUBJECT_CLASS,
  UPDATE_DISPOSITION,
  buildUpdateResult,
} from "./operationUpdateContract.js";

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

/**
 * @param {unknown} predecessor
 */
export function acceptPredecessor(predecessor) {
  if (predecessor == null) {
    return {
      ok: false,
      code: REASON_CODES.PREDECESSOR_MISSING,
      errors: ["predecessor missing"],
    };
  }
  if (typeof predecessor !== "object" || Array.isArray(predecessor)) {
    return {
      ok: false,
      code: REASON_CODES.PREDECESSOR_INVALID,
      errors: ["predecessor must be a structured object"],
    };
  }

  const errors = [];
  const meta = predecessor.meta;
  if (meta?.schemaId !== PREDECESSOR_SCHEMA_ID) {
    errors.push(`predecessor schemaId must be ${PREDECESSOR_SCHEMA_ID}`);
  }
  if (meta?.version !== PREDECESSOR_VERSION) {
    errors.push(`predecessor version must be ${PREDECESSOR_VERSION}`);
  }
  if (predecessor.operationalState == null) {
    errors.push("predecessor.operationalState required");
  }
  if (predecessor.healthEvidence == null || typeof predecessor.healthEvidence !== "object") {
    errors.push("predecessor.healthEvidence required");
  }
  if (predecessor.honesty == null || typeof predecessor.honesty !== "object") {
    errors.push("predecessor.honesty required");
  }
  if (predecessor.sideEffects !== "NONE") {
    errors.push("predecessor.sideEffects must be NONE");
  }
  if (predecessor.delivery !== "NOT_AUTHORIZED") {
    errors.push("predecessor.delivery must be NOT_AUTHORIZED");
  }

  const subjectClass =
    predecessor.inputRef?.subjectClass ?? predecessor.subject?.subjectClass;
  if (subjectClass != null && subjectClass !== SUBJECT_CLASS) {
    errors.push("predecessor subjectClass out of domain");
  }

  if (errors.length > 0) {
    const code = errors.some((e) => e.includes("schemaId") || e.includes("version"))
      ? REASON_CODES.SCHEMA_UNSUPPORTED
      : errors.some((e) => e.includes("subjectClass"))
        ? REASON_CODES.OUT_OF_DOMAIN
        : REASON_CODES.PREDECESSOR_INVALID;
    return { ok: false, code, errors };
  }

  return { ok: true, predecessor };
}

/**
 * @param {unknown} candidate
 */
export function acceptCandidate(candidate) {
  if (candidate == null || typeof candidate !== "object" || Array.isArray(candidate)) {
    return {
      ok: false,
      code: REASON_CODES.CANDIDATE_INVALID,
      errors: ["candidate must be a structured object"],
    };
  }

  const errors = [];
  const keys = Object.keys(candidate);
  for (const k of CANDIDATE_REQUIRED_TOP_LEVEL) {
    if (!Object.prototype.hasOwnProperty.call(candidate, k)) {
      errors.push(`missing required top-level section: ${k}`);
    }
  }
  for (const k of keys) {
    if (!CANDIDATE_REQUIRED_TOP_LEVEL.includes(k)) {
      errors.push(`unexpected top-level section: ${k}`);
    }
  }

  const meta = candidate.meta;
  if (meta?.schemaId !== CANDIDATE_SCHEMA_ID) {
    errors.push(`unsupported schemaId (expected ${CANDIDATE_SCHEMA_ID})`);
  }
  if (meta?.version !== SCHEMA_VERSION) {
    errors.push(`unsupported version (expected ${SCHEMA_VERSION})`);
  }
  if (typeof meta?.observedAt !== "string" || meta.observedAt.length === 0) {
    errors.push("meta.observedAt required (ISO-8601)");
  }

  if (typeof meta?.subjectRef !== "string" || meta.subjectRef.length === 0) {
    errors.push("meta.subjectRef required");
  }

  const subject = candidate.subject;
  if (subject?.subjectSchemaId !== SUBJECT_SCHEMA_ID) {
    errors.push(`subject.subjectSchemaId must be ${SUBJECT_SCHEMA_ID}`);
  }
  if (subject?.subjectClass !== SUBJECT_CLASS) {
    errors.push(`subject.subjectClass must be ${SUBJECT_CLASS}`);
  }
  if (subject?.programScope === "SP08" || subject?.claimsScaleOut === true) {
    errors.push("subject must not claim SP08 / Scale Out");
  }
  if (subject?.subjectClass && FORBIDDEN_SUBJECT_MARKERS.some((m) => String(subject.subjectClass).includes(m))) {
    errors.push("out-of-domain subject");
  }

  const prov = candidate.provenance;
  if (prov == null || typeof prov !== "object") {
    errors.push("missing provenance section");
  } else {
    if (prov.sourceKind == null) errors.push("provenance.sourceKind required");
    if (prov.observerId == null || prov.observerId === "") {
      errors.push("provenance.observerId required");
    }
    if (prov.observedAt == null) errors.push("provenance.observedAt required");
  }

  if (!Array.isArray(candidate.evidence) || candidate.evidence.length === 0) {
    errors.push("evidence must be a non-empty array");
  } else {
    for (const [i, ev] of candidate.evidence.entries()) {
      if (ev?.evidenceId == null) errors.push(`evidence[${i}].evidenceId required`);
      if (ev?.evidenceClass == null) errors.push(`evidence[${i}].evidenceClass required`);
      if (ev?.freshness == null) errors.push(`evidence[${i}].freshness required`);
      if (ev?.truthPosture == null) errors.push(`evidence[${i}].truthPosture required`);
      if (ev?.provenance == null || typeof ev.provenance !== "object") {
        errors.push(`evidence[${i}].provenance required`);
      }
    }
  }

  if (!Array.isArray(candidate.dependencies)) {
    errors.push("dependencies must be an array");
  } else {
    for (const [i, dep] of candidate.dependencies.entries()) {
      if (dep?.depId == null) errors.push(`dependencies[${i}].depId required`);
      if (dep?.status == null) errors.push(`dependencies[${i}].status required`);
    }
  }

  if (errors.some((e) => e.includes("schemaId") || e.includes("version"))) {
    return { ok: false, code: REASON_CODES.SCHEMA_UNSUPPORTED, errors };
  }
  if (
    errors.some(
      (e) =>
        e.includes("subject.subject") ||
        e.includes("subjectClass") ||
        e.includes("out-of-domain") ||
        e.includes("SP08")
    )
  ) {
    return {
      ok: false,
      code: errors.some((e) => e.includes("SP08") || e.includes("out-of-domain") || e.includes("subjectClass"))
        ? REASON_CODES.OUT_OF_DOMAIN
        : REASON_CODES.SUBJECT_INVALID,
      errors,
    };
  }
  if (errors.some((e) => e.includes("provenance"))) {
    return { ok: false, code: REASON_CODES.PROVENANCE_MISSING, errors };
  }
  if (errors.length > 0) {
    return { ok: false, code: REASON_CODES.CANDIDATE_INVALID, errors };
  }

  return { ok: true, candidate };
}

function factualIndex(predecessor) {
  const factual = predecessor.healthEvidence?.factual ?? [];
  const map = new Map();
  for (const ev of factual) {
    if (ev?.evidenceId != null) map.set(ev.evidenceId, ev);
  }
  return map;
}

function candidateIndex(candidate) {
  const map = new Map();
  for (const ev of candidate.evidence ?? []) {
    if (ev?.evidenceId != null) map.set(ev.evidenceId, ev);
  }
  return map;
}

function isNegative(ev) {
  return (
    ev?.truthPosture === TRUTH_POSTURE.CONFLICT ||
    ev?.truthPosture === TRUTH_POSTURE.UNKNOWN ||
    ev?.freshness === FRESHNESS.UNKNOWN
  );
}

/**
 * Honesty-block detection (Freeze §10). Does not infer missing values.
 */
export function detectHonestyBlocks(predecessor, candidate) {
  const blocks = [];
  const predMap = factualIndex(predecessor);
  const candMap = candidateIndex(candidate);

  for (const [id, predEv] of predMap.entries()) {
    const candEv = candMap.get(id);
    if (predEv.truthPosture === TRUTH_POSTURE.UNKNOWN && candEv && candEv.truthPosture !== TRUTH_POSTURE.UNKNOWN) {
      blocks.push({
        code: REASON_CODES.CERTAINTY_ESCALATION,
        message: `${id} truthPosture UNKNOWN → ${candEv.truthPosture} forbidden`,
      });
    }
    if (
      predEv.freshness === FRESHNESS.UNKNOWN &&
      candEv &&
      candEv.freshness !== FRESHNESS.UNKNOWN
    ) {
      blocks.push({
        code: REASON_CODES.CERTAINTY_ESCALATION,
        message: `${id} freshness UNKNOWN → ${candEv.freshness} forbidden`,
      });
    }
    if (predEv.truthPosture === TRUTH_POSTURE.CONFLICT) {
      if (!candEv) {
        blocks.push({
          code: REASON_CODES.CONFLICT_SUPPRESSION,
          message: `${id} CONFLICT disappeared`,
        });
      } else if (candEv.truthPosture === TRUTH_POSTURE.ASSERTED) {
        blocks.push({
          code: REASON_CODES.CONFLICT_SUPPRESSION,
          message: `${id} CONFLICT → ASSERTED forbidden`,
        });
      }
    }
    if (isNegative(predEv) && !candEv) {
      blocks.push({
        code: REASON_CODES.NEGATIVE_EVIDENCE_DISAPPEARED,
        message: `${id} negative evidence disappeared`,
      });
    }
  }

  const predSufficient = predecessor.healthEvidence?.derived?.sufficientForHealthy === true;
  const candRequired = (candidate.evidence ?? []).filter((e) => e.evidenceClass === EVIDENCE_CLASS.REQUIRED);
  const candLooksComplete =
    candRequired.length > 0 &&
    candRequired.every(
      (e) => e.freshness === FRESHNESS.CURRENT && e.truthPosture === TRUTH_POSTURE.ASSERTED
    );
  if (!predSufficient && candLooksComplete) {
    const upgradedFromUnknownOrConflict = [...predMap.values()].some(
      (ev) =>
        ev.evidenceClass === EVIDENCE_CLASS.REQUIRED &&
        (ev.truthPosture === TRUTH_POSTURE.UNKNOWN || ev.truthPosture === TRUTH_POSTURE.CONFLICT) &&
        candMap.get(ev.evidenceId)?.truthPosture === TRUTH_POSTURE.ASSERTED
    );
    if (upgradedFromUnknownOrConflict) {
      blocks.push({
        code: REASON_CODES.COMPLETENESS_UPGRADE,
        message: "silent completeness upgrade from unresolved required evidence",
      });
    }
  }

  if (predecessor.honesty?.conflict?.blocking === true && candidate.honesty?.conflict?.blocking !== true) {
    blocks.push({
      code: REASON_CODES.CONFLICT_SUPPRESSION,
      message: "blocking conflict suppressed by candidate recency",
    });
  }

  return blocks;
}

function candidateRequiredDepsReachable(candidate) {
  const required = (candidate.dependencies ?? []).filter((d) => d.required === true);
  return required.every((d) => d.status === DEPENDENCY_STATUS.REACHABLE);
}

/**
 * Bounded change surface (after honesty gate).
 */
export function detectChangeSurface(predecessor, candidate) {
  const changes = [];
  const predMap = factualIndex(predecessor);
  const candMap = candidateIndex(candidate);

  for (const [id, candEv] of candMap.entries()) {
    const predEv = predMap.get(id);
    if (!predEv) {
      changes.push({
        code: CHANGE_SURFACE.EVIDENCE_CLASS_SHIFT,
        message: `evidence appeared: ${id}`,
      });
      continue;
    }
    if (predEv.evidenceClass !== candEv.evidenceClass) {
      changes.push({
        code: CHANGE_SURFACE.EVIDENCE_CLASS_SHIFT,
        message: `${id} class ${predEv.evidenceClass} → ${candEv.evidenceClass}`,
      });
    }
    if (predEv.freshness !== candEv.freshness) {
      changes.push({
        code: CHANGE_SURFACE.FRESHNESS_THRESHOLD_CROSS,
        message: `${id} freshness ${predEv.freshness} → ${candEv.freshness}`,
      });
    }
    if (predEv.truthPosture !== candEv.truthPosture) {
      changes.push({
        code: CHANGE_SURFACE.TRUTH_POSTURE_SHIFT,
        message: `${id} truthPosture ${predEv.truthPosture} → ${candEv.truthPosture}`,
      });
    }
  }
  for (const [id] of predMap.entries()) {
    if (!candMap.has(id)) {
      changes.push({
        code: CHANGE_SURFACE.EVIDENCE_CLASS_SHIFT,
        message: `evidence disappeared: ${id}`,
      });
    }
  }

  const predConflict = predecessor.honesty?.conflict?.blocking === true;
  const candConflict = candidate.honesty?.conflict?.blocking === true;
  if (predConflict !== candConflict) {
    changes.push({
      code: CHANGE_SURFACE.HONESTY_FIELD_SHIFT,
      message: `honesty.conflict.blocking ${predConflict} → ${candConflict}`,
    });
  }

  const predDepsReachable = predecessor.healthEvidence?.derived?.requiredDepsReachable === true;
  const candDepsReachable = candidateRequiredDepsReachable(candidate);
  if (predDepsReachable !== candDepsReachable) {
    changes.push({
      code: CHANGE_SURFACE.DEPENDENCY_POSTURE_SHIFT,
      message: `requiredDepsReachable ${predDepsReachable} → ${candDepsReachable}`,
    });
  }

  return changes;
}

function failClosed(errors, code, predecessorRef, candidateRef, provenance) {
  return buildUpdateResult({
    updateDisposition: UPDATE_DISPOSITION.FAIL_CLOSED,
    predecessorRef,
    candidateRef,
    operationalState: OPERATIONAL_STATE.FAIL_CLOSED,
    honestyContinuity: Object.freeze({
      preserved: false,
      evaluationRefused: true,
      unknownIsNotNone: true,
      freshnessIsNotTruth: true,
    }),
    changeSurface: [],
    provenance,
    reasons: errors.map((message) => ({ code, message })),
  });
}

function citePredecessor(predecessor) {
  return Object.freeze({
    schemaId: predecessor.meta?.schemaId ?? null,
    version: predecessor.meta?.version ?? null,
    evaluatedAt: predecessor.meta?.evaluatedAt ?? null,
    inputRef: predecessor.inputRef ?? null,
  });
}

function citeCandidate(candidate) {
  return Object.freeze({
    schemaId: candidate.meta?.schemaId ?? null,
    version: candidate.meta?.version ?? null,
    observedAt: candidate.meta?.observedAt ?? null,
    subjectRef: candidate.meta?.subjectRef ?? null,
  });
}

/**
 * Evaluate bounded update. Does not mutate predecessor or candidate.
 * @param {unknown} predecessor
 * @param {unknown} candidate
 */
export function evaluateOperationUpdate(predecessor, candidate) {
  const predAccept = acceptPredecessor(predecessor);
  if (!predAccept.ok) {
    return failClosed(
      predAccept.errors,
      predAccept.code,
      predecessor == null
        ? Object.freeze({ accepted: false, missing: true })
        : Object.freeze({ accepted: false }),
      Object.freeze({ accepted: false }),
      Object.freeze({ sourceKind: "DERIVED_INTERNAL", observerId: PROGRAM_SCOPE })
    );
  }

  const candAccept = acceptCandidate(candidate);
  if (!candAccept.ok) {
    const outOfDomain =
      candAccept.code === REASON_CODES.OUT_OF_DOMAIN ||
      candAccept.code === REASON_CODES.SUBJECT_INVALID;
    return failClosed(
      candAccept.errors,
      outOfDomain ? REASON_CODES.OUT_OF_DOMAIN : candAccept.code,
      citePredecessor(predAccept.predecessor),
      Object.freeze({ accepted: false }),
      Object.freeze({
        ...(typeof candidate === "object" && candidate?.provenance ? candidate.provenance : {}),
        sourceKind: candidate?.provenance?.sourceKind ?? "DERIVED_INTERNAL",
        observerId: PROGRAM_SCOPE,
      })
    );
  }

  const pred = predAccept.predecessor;
  const cand = candAccept.candidate;

  const predSubject = pred.inputRef?.subjectClass ?? SUBJECT_CLASS;
  if (cand.subject.subjectClass !== predSubject) {
    return failClosed(
      ["candidate subjectClass must match predecessor"],
      REASON_CODES.SUBJECT_MISMATCH,
      citePredecessor(pred),
      citeCandidate(cand),
      Object.freeze({ ...cand.provenance })
    );
  }

  const honestyBlocks = detectHonestyBlocks(pred, cand);
  if (honestyBlocks.length > 0) {
    return buildUpdateResult({
      updateDisposition: UPDATE_DISPOSITION.HONESTY_BLOCKS_EVOLUTION,
      predecessorRef: citePredecessor(pred),
      candidateRef: citeCandidate(cand),
      operationalState: pred.operationalState,
      honestyContinuity: Object.freeze({
        preserved: true,
        blocked: true,
        unknownIsNotNone: true,
        unknownIsNotZero: true,
        freshnessIsNotTruth: true,
        staleIsNotFalse: true,
        absenceOfEvidenceIsNotHealthy: true,
        absenceOfFailureIsNotHealthy: true,
        healthEvidenceHonestyPreserved: true,
        noSilentCertaintyEscalation: true,
        noSilentCompletenessUpgrade: true,
        noConflictSuppressionByRecency: true,
      }),
      changeSurface: [],
      provenance: Object.freeze({
        predecessorRef: citePredecessor(pred),
        candidateProvenance: cand.provenance,
        evaluatedBy: PROGRAM_SCOPE,
      }),
      reasons: honestyBlocks,
    });
  }

  const changes = detectChangeSurface(pred, cand);
  if (changes.length === 0) {
    return buildUpdateResult({
      updateDisposition: UPDATE_DISPOSITION.NO_MEANINGFUL_UPDATE,
      predecessorRef: citePredecessor(pred),
      candidateRef: citeCandidate(cand),
      operationalState: pred.operationalState,
      honestyContinuity: Object.freeze({
        preserved: true,
        blocked: false,
        unknownIsNotNone: true,
        unknownIsNotZero: true,
        freshnessIsNotTruth: true,
        staleIsNotFalse: true,
        absenceOfEvidenceIsNotHealthy: true,
        absenceOfFailureIsNotHealthy: true,
        healthEvidenceHonestyPreserved: true,
      }),
      changeSurface: [],
      provenance: Object.freeze({
        predecessorRef: citePredecessor(pred),
        candidateProvenance: cand.provenance,
        evaluatedBy: PROGRAM_SCOPE,
      }),
      reasons: [
        {
          code: REASON_CODES.NO_CHANGE,
          message: "canonical predecessor and candidate equivalent under frozen comparison",
        },
      ],
    });
  }

  return buildUpdateResult({
    updateDisposition: UPDATE_DISPOSITION.BOUNDED_EVOLUTION_RECOGNIZED,
    predecessorRef: citePredecessor(pred),
    candidateRef: citeCandidate(cand),
    operationalState: pred.operationalState,
    honestyContinuity: Object.freeze({
      preserved: true,
      blocked: false,
      unknownIsNotNone: true,
      unknownIsNotZero: true,
      freshnessIsNotTruth: true,
      staleIsNotFalse: true,
      absenceOfEvidenceIsNotHealthy: true,
      absenceOfFailureIsNotHealthy: true,
      healthEvidenceHonestyPreserved: true,
      noAutomatedTransition: true,
    }),
    changeSurface: changes,
    provenance: Object.freeze({
      predecessorRef: citePredecessor(pred),
      candidateProvenance: cand.provenance,
      evaluatedBy: PROGRAM_SCOPE,
    }),
    reasons: [
      {
        code: REASON_CODES.BOUNDED_CHANGE,
        message: "bounded candidate evolution recognized without honesty/authority violation",
      },
    ],
  });
}

/** Static wall markers for proof harness (no runtime coupling). */
export const SP07_P2_WALL_MARKERS = Object.freeze({
  sideEffects: SIDE_EFFECTS.NONE,
  delivery: DELIVERY_STATUS.NOT_AUTHORIZED,
  persistence: false,
  automatedTransition: false,
  p1Mutation: false,
  productCoupling: false,
  marketplaceCoupling: false,
  publicationDelivery: false,
  ownerContact: false,
  externalIo: false,
  supabaseAuthority: false,
  sp08Opened: false,
  p3Opened: false,
  p4Opened: false,
});

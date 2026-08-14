/**
 * SP07-P1 — Operation Watch contract (DAG-SP07-P1-G1)
 *
 * Documentary schema class: rsn.operation.watch.snapshot.v1 / rsn.operation.watch.result.v1
 * INTERNAL-ONLY · sideEffects NONE · WATCH ≠ UPDATE
 * ≠ Product · ≠ delivery · ≠ Supabase
 */

export const SUBJECT_SCHEMA_ID = "rsn.operation.watch.subject.v1";
export const SNAPSHOT_SCHEMA_ID = "rsn.operation.watch.snapshot.v1";
export const RESULT_SCHEMA_ID = "rsn.operation.watch.result.v1";
export const SCHEMA_VERSION = "v1";
export const RULE_VERSION = "sp07-p1-watch-baseline.v1";

export const SUBJECT_CLASS = "INSTITUTIONAL_OPERATIONAL_CONTINUITY";
export const PROGRAM_SCOPE = "SP07-P1";

export const REQUIRED_TOP_LEVEL = Object.freeze([
  "meta",
  "subject",
  "evidence",
  "provenance",
  "honesty",
  "dependencies",
]);

export const OPERATIONAL_STATE = Object.freeze({
  HEALTHY: "HEALTHY",
  DEGRADED: "DEGRADED",
  BLOCKED: "BLOCKED",
  STALE: "STALE",
  UNAVAILABLE: "UNAVAILABLE",
  FAIL_CLOSED: "FAIL_CLOSED",
  INSUFFICIENT_EVIDENCE: "INSUFFICIENT_EVIDENCE",
  AUTHORITY_UNCERTAIN: "AUTHORITY_UNCERTAIN",
});

export const EVALUATION_STATUS = Object.freeze({
  ACCEPTED: "ACCEPTED",
  REFUSED: "REFUSED",
});

export const EVIDENCE_CLASS = Object.freeze({
  REQUIRED: "REQUIRED",
  OPTIONAL: "OPTIONAL",
  ADVISORY: "ADVISORY",
});

export const FRESHNESS = Object.freeze({
  CURRENT: "CURRENT",
  STALE: "STALE",
  UNKNOWN: "UNKNOWN",
});

export const TRUTH_POSTURE = Object.freeze({
  ASSERTED: "ASSERTED",
  UNKNOWN: "UNKNOWN",
  CONFLICT: "CONFLICT",
});

export const DEPENDENCY_STATUS = Object.freeze({
  REACHABLE: "REACHABLE",
  UNAVAILABLE: "UNAVAILABLE",
  UNKNOWN: "UNKNOWN",
});

export const MEANINGFUL_CHANGE = Object.freeze({
  TRUE: true,
  FALSE: false,
  UNKNOWN: "UNKNOWN",
});

export const SIDE_EFFECTS = Object.freeze({
  NONE: "NONE",
});

export const DELIVERY_STATUS = Object.freeze({
  NOT_AUTHORIZED: "NOT_AUTHORIZED",
});

export const PROVENANCE_SOURCE_KIND = Object.freeze({
  READ_ONLY_OBSERVATION: "READ_ONLY_OBSERVATION",
  DERIVED_INTERNAL: "DERIVED_INTERNAL",
  UNKNOWN: "UNKNOWN",
});

export const REASON_CODES = Object.freeze({
  STRUCTURAL_INVALID: "STRUCTURAL_INVALID",
  SCHEMA_UNSUPPORTED: "SCHEMA_UNSUPPORTED",
  SUBJECT_INVALID: "SUBJECT_INVALID",
  PROVENANCE_MISSING: "PROVENANCE_MISSING",
  EVIDENCE_INSUFFICIENT: "EVIDENCE_INSUFFICIENT",
  DEPENDENCY_UNAVAILABLE: "DEPENDENCY_UNAVAILABLE",
  AUTHORITY_UNCERTAIN: "AUTHORITY_UNCERTAIN",
  CONFLICT_BLOCKED: "CONFLICT_BLOCKED",
  STALE_EVIDENCE: "STALE_EVIDENCE",
  STOP_RULE_PRESSURE: "STOP_RULE_PRESSURE",
  FAIL_CLOSED: "FAIL_CLOSED",
  DEGRADED_LIMITATION: "DEGRADED_LIMITATION",
  HEALTHY_BASELINE: "HEALTHY_BASELINE",
});

export const MATERIAL_CHANGE_CLASS = Object.freeze({
  EVIDENCE_CLASS_SHIFT: "EVIDENCE_CLASS_SHIFT",
  OPERATIONAL_STATE_SHIFT: "OPERATIONAL_STATE_SHIFT",
  DEPENDENCY_POSTURE_SHIFT: "DEPENDENCY_POSTURE_SHIFT",
  FRESHNESS_THRESHOLD_CROSS: "FRESHNESS_THRESHOLD_CROSS",
  CONFLICT_EMERGENCE: "CONFLICT_EMERGENCE",
  AUTHORITY_PRESSURE: "AUTHORITY_PRESSURE",
});

/**
 * Frozen honesty / operational locks on accepted P1 watch outputs.
 */
export function buildWatchInvariants() {
  return Object.freeze({
    watchIsNotUpdate: true,
    observationIsNotAction: true,
    sideEffectsNone: true,
    deliveryNotAuthorized: true,
    unknownIsNotNone: true,
    unknownIsNotZero: true,
    freshnessIsNotTruth: true,
    absenceOfEvidenceIsNotHealthy: true,
    absenceOfFailureIsNotHealthy: true,
    internalObservabilityOnly: true,
    noProductMarketplaceCoupling: true,
    noPublicationDelivery: true,
    noSupabaseAuthority: true,
    cb17AntecedentOnly: true,
  });
}

/**
 * @param {{
 *   evaluationStatus: string,
 *   operationalState: string,
 *   meaningfulChange: boolean | "UNKNOWN",
 *   meaningfulChangeReasons: { code: string, message: string }[],
 *   healthEvidence: object,
 *   inputRef: object,
 *   provenance: object,
 *   honesty: object,
 *   reasons: { code: string, message: string }[],
 * }} parts
 */
export function buildWatchResult(parts) {
  const stateValues = Object.values(OPERATIONAL_STATE);
  if (!stateValues.includes(parts.operationalState)) {
    throw new Error(`Unsupported operational state: ${parts.operationalState}`);
  }

  return Object.freeze({
    meta: Object.freeze({
      schemaId: RESULT_SCHEMA_ID,
      version: SCHEMA_VERSION,
      ruleVersion: RULE_VERSION,
      evaluatedAt: parts.evaluatedAt ?? new Date(0).toISOString(),
    }),
    evaluationStatus: parts.evaluationStatus,
    operationalState: parts.operationalState,
    meaningfulChange: parts.meaningfulChange,
    meaningfulChangeReasons: Object.freeze(
      parts.meaningfulChangeReasons.map((r) =>
        Object.freeze({ code: r.code, message: r.message })
      )
    ),
    healthEvidence: Object.freeze(parts.healthEvidence),
    inputRef: Object.freeze({ ...parts.inputRef }),
    provenance: Object.freeze({ ...parts.provenance }),
    honesty: Object.freeze(parts.honesty),
    reasons: Object.freeze(
      parts.reasons.map((r) => Object.freeze({ code: r.code, message: r.message }))
    ),
    invariants: buildWatchInvariants(),
    sideEffects: SIDE_EFFECTS.NONE,
    delivery: DELIVERY_STATUS.NOT_AUTHORIZED,
    observabilityScope: Object.freeze({
      posture: "INTERNAL_ONLY_OPERATOR_DEVELOPER_READ_ONLY",
      dg04ParkedOutsideCore: true,
    }),
  });
}

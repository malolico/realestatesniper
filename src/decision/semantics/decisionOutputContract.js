/**
 * SP05-P2 — Decision Semantics output contract (DAG-SP05-P2-G1)
 *
 * Documentary schema class: rsn.decision.semantics.result.v1
 * ≠ Product · ≠ transaction advice · ≠ Grant EXECUTE expansion
 */

export const SEMANTICS_RESULT_SCHEMA_ID = "rsn.decision.semantics.result.v1";
export const EVIDENCE_VECTOR_SCHEMA_ID = "rsn.decision.evidenceVector.lexicographic.v1";
export const RANKING_SCHEMA_ID = "rsn.decision.ranking.reviewPriority.v1";
export const RULE_VERSION = "sp05-p2-sem.v1.amendment-01";
export const SEMANTICS_STATE = "DEC-SEMANTICS";

/** VALUE vector — single axis only */
export const VALUE_DIMENSION_ID = "DISTRESS_EVIDENCE_STATE";

export const DISTRESS_STATES = Object.freeze({
  EVIDENCED: "EVIDENCED",
  NONE: "NONE",
  UNKNOWN: "UNKNOWN",
  CONFLICT_BLOCKED: "CONFLICT_BLOCKED",
});

export const SEM01 = Object.freeze({
  OPPORTUNITY_CANDIDATE: "OPPORTUNITY_CANDIDATE",
  NOT_OPPORTUNITY_CANDIDATE: "NOT_OPPORTUNITY_CANDIDATE",
  INSUFFICIENT_EVIDENCE: "INSUFFICIENT_EVIDENCE",
  CONFLICT_BLOCKED: "CONFLICT_BLOCKED",
});

export const SEM02 = Object.freeze({
  OPPORTUNITY: "OPPORTUNITY",
  NOT_OPPORTUNITY: "NOT_OPPORTUNITY",
  INSUFFICIENT_EVIDENCE: "INSUFFICIENT_EVIDENCE",
  CONFLICT_BLOCKED: "CONFLICT_BLOCKED",
});

export const SEM03 = Object.freeze({
  REVIEW_PRIORITY: "REVIEW_PRIORITY",
  REVIEW: "REVIEW",
  DO_NOT_PRIORITIZE: "DO_NOT_PRIORITIZE",
  INSUFFICIENT_EVIDENCE: "INSUFFICIENT_EVIDENCE",
  CONFLICT_BLOCKED: "CONFLICT_BLOCKED",
});

export const SEM06 = Object.freeze({
  INSUFFICIENT_EVIDENCE: "INSUFFICIENT_EVIDENCE",
  CONFLICT_BLOCKED: "CONFLICT_BLOCKED",
});

export const RANKING_MEANING = "REVIEW_PRIORITY_AMONG_SUPPLIED_CANDIDATES";

/**
 * Frozen honesty locks — must be true on accepted outputs.
 */
export function buildInvariants() {
  return Object.freeze({
    factIsNotDerived: true,
    readinessIsNotOpportunity: true,
    opportunityIsNotReviewPriority: true,
    reviewPriorityIsNotTransactionAdvice: true,
    rankingIsNotInvestmentGuarantee: true,
    evidenceVectorIsNotMaturityScore: true,
    unknownIsNotZero: true,
    insufficientEvidenceIsNotNotOpportunity: true,
    conflictBlockedIsNotNotOpportunity: true,
    noPremiumDiamondAccessTier: true,
    noStrategySelection: true,
    decIntakeIsNotFactoryStDec: true,
    distressIsNotInvestmentAdvice: true,
    economicPresenceIsNotAttractiveness: true,
    sem02DistressLock: true,
  });
}

/**
 * @param {{
 *   input: object,
 *   classifyDeal: { state: string },
 *   opportunity: { state: string },
 *   reviewPriority: { state: string },
 *   evidenceVector: object,
 *   ranking: object,
 *   halt: string|null,
 *   trace: object,
 * }} parts
 */
export function buildSemanticsResult(parts) {
  return Object.freeze({
    schemaId: SEMANTICS_RESULT_SCHEMA_ID,
    ruleVersion: RULE_VERSION,
    state: SEMANTICS_STATE,
    input: Object.freeze({ ...parts.input }),
    classifyDeal: Object.freeze({ state: parts.classifyDeal.state }),
    opportunity: Object.freeze({ state: parts.opportunity.state }),
    reviewPriority: Object.freeze({ state: parts.reviewPriority.state }),
    evidenceVector: parts.evidenceVector,
    ranking: parts.ranking,
    halt: parts.halt,
    trace: parts.trace,
    invariants: buildInvariants(),
  });
}

/**
 * @param {{ value: string, rationale: string, kind?: "FACT"|"DERIVED" }} dim
 */
export function buildEvidenceVector(dim) {
  return Object.freeze({
    schemaId: EVIDENCE_VECTOR_SCHEMA_ID,
    dimensions: Object.freeze([
      Object.freeze({
        id: VALUE_DIMENSION_ID,
        kind: dim.kind ?? "DERIVED",
        value: dim.value,
        rationale: dim.rationale,
      }),
    ]),
  });
}

/**
 * @param {{
 *   rank: number|null,
 *   candidateSetId: string|null,
 *   comparable: boolean,
 * }} ranking
 */
export function buildRanking(ranking) {
  return Object.freeze({
    schemaId: RANKING_SCHEMA_ID,
    rank: ranking.rank,
    candidateSetId: ranking.candidateSetId,
    meaning: RANKING_MEANING,
    comparable: ranking.comparable === true,
  });
}

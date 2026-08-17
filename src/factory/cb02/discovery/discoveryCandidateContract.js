/**
 * SP10 — Discovery Candidate contract (CB-02)
 * Distinct from SP09 ResearchAction CANDIDATE and integration read-model candidates.
 */

export const DISCOVERY_CANDIDATE_SCHEMA_ID = "rsn.cb02.discovery.candidate.v1";

export const DISCOVERY_MATERIALITY_STATUS = Object.freeze({
  MATERIAL: "MATERIAL",
  INSUFFICIENT: "INSUFFICIENT",
});

export const DISCOVERY_CANDIDATE_AUTHORITY = Object.freeze({
  isEvidence: false,
  isDecision: false,
  isOpportunity: false,
  isProduct: false,
  isResearchAction: false,
  isReadModelCandidate: false,
  researchActionRoleIsNotDiscoveryCandidate: true,
  evidenceAuthority: "CB-06",
});

/**
 * @param {{
 *   dedupKey: string,
 *   signalId: string,
 *   observationId: string,
 *   observedAt: string,
 *   candidateRef: string,
 *   materialityStatus: string,
 *   identityStatus: string,
 *   canonicalKey?: string|null,
 *   definitiveKeyCandidate?: string|null,
 *   propertyAnchor?: string|null,
 *   factoryKey?: string|null,
 * }} input
 */
export function buildDiscoveryCandidate(input) {
  if (!input?.dedupKey) {
    throw new Error("[SP10 Candidate] dedupKey required");
  }
  if (!Object.values(DISCOVERY_MATERIALITY_STATUS).includes(input.materialityStatus)) {
    throw new Error(`[SP10 Candidate] invalid materialityStatus: ${input.materialityStatus}`);
  }

  return Object.freeze({
    schemaId: DISCOVERY_CANDIDATE_SCHEMA_ID,
    candidateId: input.dedupKey,
    signalId: input.signalId ?? input.dedupKey,
    dedupKey: input.dedupKey,
    observationId: input.observationId,
    observedAt: input.observedAt,
    candidateRef: input.candidateRef,
    materialityStatus: input.materialityStatus,
    identityStatus: input.identityStatus,
    canonicalKey: input.canonicalKey ?? null,
    definitiveKeyCandidate: input.definitiveKeyCandidate ?? null,
    propertyAnchor: input.propertyAnchor ?? null,
    factoryKey: input.factoryKey ?? null,
    authority: DISCOVERY_CANDIDATE_AUTHORITY,
  });
}

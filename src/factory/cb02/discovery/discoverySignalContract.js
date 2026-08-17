/**
 * SP10 — Discovery Signal contract (CB-02)
 * Signal ≠ Evidence ≠ Candidate ≠ Decision ≠ Opportunity ≠ Product
 */

export const DISCOVERY_SIGNAL_SCHEMA_ID = "rsn.cb02.discovery.signal.v1";

export const DISCOVERY_SIGNAL_KIND = Object.freeze({
  NEW_OBSERVATION: "NEW_OBSERVATION",
});

export const DISCOVERY_SIGNAL_STATUS = Object.freeze({
  EMITTED: "EMITTED",
  DUPLICATE: "DUPLICATE",
  REFUSED: "REFUSED",
});

export const DISCOVERY_SIGNAL_AUTHORITY = Object.freeze({
  isEvidence: false,
  isCandidate: false,
  isDecision: false,
  isOpportunity: false,
  isProduct: false,
  evidenceAuthority: "CB-06",
  signalIsNotEvidence: true,
  signalIsNotCandidate: true,
});

/**
 * @param {{
 *   dedupKey: string,
 *   observationId: string,
 *   sourceIdentity: object,
 *   jurisdiction: object,
 *   observedAt: string,
 *   recordedAt: string,
 *   payloadFingerprint: string,
 *   status: string,
 * }} input
 */
export function buildDiscoverySignal(input) {
  if (!input?.dedupKey || typeof input.dedupKey !== "string") {
    throw new Error("[SP10 Signal] dedupKey required");
  }
  if (!Object.values(DISCOVERY_SIGNAL_STATUS).includes(input.status)) {
    throw new Error(`[SP10 Signal] invalid status: ${input.status}`);
  }

  return Object.freeze({
    schemaId: DISCOVERY_SIGNAL_SCHEMA_ID,
    signalId: input.dedupKey,
    dedupKey: input.dedupKey,
    observationId: input.observationId,
    signalKind: DISCOVERY_SIGNAL_KIND.NEW_OBSERVATION,
    sourceIdentity: Object.freeze({ ...input.sourceIdentity }),
    jurisdiction: Object.freeze({ ...input.jurisdiction }),
    observedAt: input.observedAt,
    recordedAt: input.recordedAt,
    payloadFingerprint: input.payloadFingerprint,
    status: input.status,
    authority: DISCOVERY_SIGNAL_AUTHORITY,
  });
}

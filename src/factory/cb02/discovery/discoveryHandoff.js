/**
 * SP10 — Bounded ELR Discovery handoff (CB-02 → CB-13 boundary)
 */

export const DISCOVERY_HANDOFF_KIND = "DISCOVERY_HANDOFF_CB13";

/**
 * @param {import("../../cb01/factoryRegistry.js").FactoryRegistry} registry
 * @param {string} factoryKey
 * @param {{
 *   observationId: string,
 *   dedupKey: string,
 *   candidateId: string,
 *   observedAt: string,
 *   identityStatus: string,
 *   canonicalKey?: string|null,
 *   definitiveKeyCandidate?: string|null,
 *   propertyAnchor?: string|null,
 * }} payload
 * @param {{ actor?: string }} [context]
 */
export function recordDiscoveryHandoff(registry, factoryKey, payload, context = {}) {
  const record = registry.getExpediente(factoryKey);
  if (!record) {
    throw new Error(`[SP10 Handoff] Expediente not found: ${factoryKey}`);
  }

  const existing = (record.elr?.decision_handoffs ?? []).some(
    (h) => h.kind === DISCOVERY_HANDOFF_KIND
  );
  if (existing) {
    return null;
  }

  return registry.registerElrAct(
    factoryKey,
    "decision_handoffs",
    {
      kind: DISCOVERY_HANDOFF_KIND,
      target: "CB-13:ResearchContracts",
      observationId: payload.observationId,
      dedupKey: payload.dedupKey,
      candidateId: payload.candidateId,
      observedAt: payload.observedAt,
      identityStatus: payload.identityStatus,
      canonicalKey: payload.canonicalKey ?? null,
      definitiveKeyCandidate: payload.definitiveKeyCandidate ?? null,
      propertyAnchor: payload.propertyAnchor ?? null,
      constitutionalPhase: "CB-02",
      message: "SP10 Recorded Discovery — bounded handoff to CB-13",
    },
    { actor: context.actor ?? "MOT-CMP-01" }
  );
}

/**
 * @param {object} elr
 */
export function hasDiscoveryHandoff(elr) {
  return (elr?.decision_handoffs ?? []).some((h) => h.kind === DISCOVERY_HANDOFF_KIND);
}

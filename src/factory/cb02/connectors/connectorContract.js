/**
 * P-INT-02 Offline — Connector Contract (RECORDED_ONLY).
 * No live fetch. No HTTP. No network.
 */

export const LIVE_NOT_AUTHORIZED = "LIVE_NOT_AUTHORIZED";
export const CONNECTOR_MODE_RECORDED_ONLY = "RECORDED_ONLY";

/**
 * @param {object} input
 */
export function defineConnectorContract(input) {
  if (!input || typeof input !== "object") {
    throw new Error("[P-INT-02] Invalid connector contract");
  }
  if (input.mode !== CONNECTOR_MODE_RECORDED_ONLY) {
    throw new Error("[P-INT-02] Connector mode must be RECORDED_ONLY");
  }
  if (input.liveFetch !== false) {
    throw new Error("[P-INT-02] Connector liveFetch must be false");
  }
  if (typeof input.organismId !== "string" || !input.organismId) {
    throw new Error("[P-INT-02] Connector organismId required");
  }
  if (typeof input.familyId !== "string" || !input.familyId) {
    throw new Error("[P-INT-02] Connector familyId required");
  }
  if (typeof input.payloadSchemaId !== "string" || !input.payloadSchemaId) {
    throw new Error("[P-INT-02] Connector payloadSchemaId required");
  }

  const contract = Object.freeze({
    contractId: String(input.contractId),
    organismId: input.organismId,
    familyId: input.familyId,
    jurisdiction: input.jurisdiction,
    epistemicLevel: input.epistemicLevel,
    accessClass: input.accessClass,
    freshnessProfile: input.freshnessProfile,
    ddiDomains: Object.freeze([...(input.ddiDomains || [])]),
    ddiPart: input.ddiPart ?? null,
    payloadSchemaId: input.payloadSchemaId,
    requiredProvenanceFields: Object.freeze([
      ...(input.requiredProvenanceFields || ["organismId", "familyId", "vintageAt"]),
    ]),
    mode: CONNECTOR_MODE_RECORDED_ONLY,
    liveFetch: false,
  });

  return Object.freeze({
    ...contract,
    /**
     * Live fetch is never authorized under P-INT-02 Offline.
     */
    fetchLive() {
      const err = new Error(
        `[P-INT-02] ${LIVE_NOT_AUTHORIZED}: live fetch prohibited for ${contract.contractId}`
      );
      err.code = LIVE_NOT_AUTHORIZED;
      throw err;
    },
  });
}

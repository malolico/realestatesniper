/**
 * SP11-P1-C — Fail-closed Maricopa Assessor LIVE response adapter (CB-02)
 * Explicit mapping only. LIVE field map is unconfirmed. No heuristics.
 * Transport response is not a LIVE observation.
 */

import {
  SCHEMA_ASR_MC_V1,
  validatePayloadAgainstSchema,
} from "../connectors/payloadSchemas.js";
import {
  LIVE_FAMILY_ID,
  LIVE_ORGANISM_ID,
  LIVE_PAYLOAD_SCHEMA_ID,
} from "./liveObservationContract.js";

export const ASSESSOR_LIVE_FIELD_MAP_UNCONFIRMED = "assessor_live_field_map_unconfirmed";

/**
 * Schema check for a future confirmed explicit map only.
 * Contains no Assessor LIVE field names.
 *
 * @param {object} payload
 */
export function validateMappedAssessorLivePayload(payload) {
  return validatePayloadAgainstSchema(SCHEMA_ASR_MC_V1, payload);
}

/**
 * @param {{
 *   ok?: boolean,
 *   body?: object,
 *   receivedAt?: string,
 * }} [clientResult]
 */
export function adaptMaricopaAssessorLiveResponse(clientResult = {}) {
  if (!clientResult || clientResult.ok !== true) {
    return Object.freeze({
      ok: false,
      reason: clientResult?.reason ?? ASSESSOR_LIVE_FIELD_MAP_UNCONFIRMED,
      organismId: LIVE_ORGANISM_ID,
      familyId: LIVE_FAMILY_ID,
      payloadSchemaId: LIVE_PAYLOAD_SCHEMA_ID,
      targetSchemaId: SCHEMA_ASR_MC_V1,
      payload: null,
      observedAt: null,
      receivedAt: clientResult?.receivedAt ?? null,
      authority: Object.freeze({
        isEvidence: false,
        isFact: false,
        isOpportunity: false,
        isProduct: false,
        isResearchAction: false,
      }),
    });
  }

  const body = clientResult.body;
  if (!body || typeof body !== "object" || Array.isArray(body)) {
    return Object.freeze({
      ok: false,
      reason: ASSESSOR_LIVE_FIELD_MAP_UNCONFIRMED,
      organismId: LIVE_ORGANISM_ID,
      familyId: LIVE_FAMILY_ID,
      payloadSchemaId: LIVE_PAYLOAD_SCHEMA_ID,
      targetSchemaId: SCHEMA_ASR_MC_V1,
      payload: null,
      observedAt: null,
      receivedAt: clientResult.receivedAt ?? null,
      authority: Object.freeze({
        isEvidence: false,
        isFact: false,
        isOpportunity: false,
        isProduct: false,
        isResearchAction: false,
      }),
    });
  }

  return Object.freeze({
    ok: false,
    reason: ASSESSOR_LIVE_FIELD_MAP_UNCONFIRMED,
    organismId: LIVE_ORGANISM_ID,
    familyId: LIVE_FAMILY_ID,
    payloadSchemaId: LIVE_PAYLOAD_SCHEMA_ID,
    targetSchemaId: SCHEMA_ASR_MC_V1,
    payload: null,
    observedAt: null,
    receivedAt: clientResult.receivedAt ?? null,
    authority: Object.freeze({
      isEvidence: false,
      isFact: false,
      isOpportunity: false,
      isProduct: false,
      isResearchAction: false,
    }),
  });
}

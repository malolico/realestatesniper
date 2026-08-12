/**
 * P-INT-02 Offline — minimal payload schemas for Maricopa ASR / GIS / RCR
 * and PS05-04 Pima RECORDED_REAL ASR / GIS.
 * Structural fidelity only. No PII.
 */

export const SCHEMA_ASR_MC_V1 = "maricopa.assessor.payload.v1";
export const SCHEMA_GIS_MC_V1 = "maricopa.gis.payload.v1";
export const SCHEMA_RCR_MC_V1 = "maricopa.recorder.payload.v1";
export const SCHEMA_ASR_PC_V1 = "pima.assessor.payload.v1";
export const SCHEMA_GIS_PC_V1 = "pima.gis.payload.v1";

const SCHEMAS = Object.freeze({
  [SCHEMA_ASR_MC_V1]: Object.freeze({
    schemaId: SCHEMA_ASR_MC_V1,
    organismId: "ORG-ASR-MC",
    required: Object.freeze([
      "schemaId",
      "parcelId",
      "apn",
      "situsAddress",
      "landUseCode",
      "assessedYear",
    ]),
  }),
  [SCHEMA_GIS_MC_V1]: Object.freeze({
    schemaId: SCHEMA_GIS_MC_V1,
    organismId: "ORG-GIS-MC",
    required: Object.freeze([
      "schemaId",
      "parcelId",
      "geometryType",
      "centroid",
      "crs",
    ]),
  }),
  [SCHEMA_RCR_MC_V1]: Object.freeze({
    schemaId: SCHEMA_RCR_MC_V1,
    organismId: "ORG-RCR-MC",
    required: Object.freeze([
      "schemaId",
      "documentId",
      "documentType",
      "recordedDate",
      "parcelRef",
    ]),
  }),
  /** Pima: situs may be null/absent — do not require situsAddress. */
  [SCHEMA_ASR_PC_V1]: Object.freeze({
    schemaId: SCHEMA_ASR_PC_V1,
    organismId: "ORG-ASR-PC",
    required: Object.freeze([
      "schemaId",
      "parcelId",
      "apn",
      "landUseCode",
      "assessedYear",
    ]),
  }),
  [SCHEMA_GIS_PC_V1]: Object.freeze({
    schemaId: SCHEMA_GIS_PC_V1,
    organismId: "ORG-GIS-PC",
    required: Object.freeze([
      "schemaId",
      "parcelId",
      "geometryType",
      "centroid",
      "crs",
    ]),
  }),
});

/**
 * @param {string} schemaId
 */
export function getPayloadSchema(schemaId) {
  return SCHEMAS[schemaId] ?? null;
}

/**
 * @param {string} schemaId
 * @param {unknown} payload
 * @returns {{ ok: true } | { ok: false, reason: string }}
 */
export function validatePayloadAgainstSchema(schemaId, payload) {
  const schema = getPayloadSchema(schemaId);
  if (!schema) {
    return { ok: false, reason: `unknown_payload_schema:${schemaId}` };
  }
  if (!payload || typeof payload !== "object" || Array.isArray(payload)) {
    return { ok: false, reason: "payload_not_object" };
  }
  if (payload.schemaId !== schemaId) {
    return { ok: false, reason: "payload_schemaId_mismatch" };
  }
  for (const field of schema.required) {
    if (payload[field] === undefined || payload[field] === null || payload[field] === "") {
      return { ok: false, reason: `missing_required_field:${field}` };
    }
  }
  if (schemaId === SCHEMA_GIS_MC_V1 || schemaId === SCHEMA_GIS_PC_V1) {
    const c = payload.centroid;
    if (
      !c ||
      typeof c !== "object" ||
      typeof c.lat !== "number" ||
      typeof c.lon !== "number"
    ) {
      return { ok: false, reason: "invalid_centroid" };
    }
  }
  return { ok: true };
}

export function listKnownPayloadSchemaIds() {
  return Object.freeze(Object.keys(SCHEMAS));
}

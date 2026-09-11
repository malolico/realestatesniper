/**
 * SP11-P1 — Secured Master → maricopa.assessor.payload.v1 adapter (CB-02)
 * Explicit mapping only. Fail-closed. No LIVE. No situs.state fabrication.
 */

import {
  SCHEMA_ASR_MC_V1,
  validatePayloadAgainstSchema,
} from "../connectors/payloadSchemas.js";
import {
  SECURED_MASTER_ACCESS_MODE,
  SECURED_MASTER_DATASET,
  SECURED_MASTER_EXPECTED_HEADER_FIELDS,
  SECURED_MASTER_FAMILY_ID,
  SECURED_MASTER_ORGANISM_ID,
  TAX_YEAR_METADATA_INVALID,
  TAX_YEAR_METADATA_REQUIRED,
  validateExplicitTaxYearMetadata,
} from "./securedMasterSnapshotContract.js";

export const ASSESSED_YEAR_METADATA_REQUIRED = TAX_YEAR_METADATA_REQUIRED;

/**
 * @param {Record<string, string>} fieldsByName
 * @param {string} name
 */
function field(fieldsByName, name) {
  const v = fieldsByName[name];
  return typeof v === "string" ? v : "";
}

/**
 * @param {readonly string[]} fields
 */
function zipFields(fields) {
  /** @type {Record<string, string>} */
  const out = {};
  for (let i = 0; i < SECURED_MASTER_EXPECTED_HEADER_FIELDS.length; i += 1) {
    out[SECURED_MASTER_EXPECTED_HEADER_FIELDS[i]] = fields[i] ?? "";
  }
  return out;
}

/**
 * @param {{
 *   record?: object,
 *   taxYearMetadata?: object|null,
 *   jurisdictionLabel?: string|null,
 * }} [input]
 */
export function adaptSecuredMasterRecordToAsrPayload(input = {}) {
  const record = input.record;
  if (!record || typeof record !== "object" || !Array.isArray(record.fields)) {
    return Object.freeze({
      ok: false,
      reason: "source_record_invalid",
      organismId: SECURED_MASTER_ORGANISM_ID,
      familyId: SECURED_MASTER_FAMILY_ID,
      payloadSchemaId: SCHEMA_ASR_MC_V1,
      dataset: SECURED_MASTER_DATASET,
      accessMode: SECURED_MASTER_ACCESS_MODE,
      payload: null,
    });
  }

  const yearGate = validateExplicitTaxYearMetadata(input.taxYearMetadata ?? null);
  if (!yearGate.ok) {
    const reason =
      yearGate.reason === TAX_YEAR_METADATA_INVALID
        ? TAX_YEAR_METADATA_INVALID
        : TAX_YEAR_METADATA_REQUIRED;
    return Object.freeze({
      ok: false,
      reason,
      organismId: SECURED_MASTER_ORGANISM_ID,
      familyId: SECURED_MASTER_FAMILY_ID,
      payloadSchemaId: SCHEMA_ASR_MC_V1,
      dataset: SECURED_MASTER_DATASET,
      accessMode: SECURED_MASTER_ACCESS_MODE,
      payload: null,
    });
  }

  const byName = zipFields(record.fields);
  const folio = String(record.folioKey ?? field(byName, "FolioKey")).trim();
  if (!folio) {
    return Object.freeze({
      ok: false,
      reason: "asr_payload_required_field_missing:parcelId",
      organismId: SECURED_MASTER_ORGANISM_ID,
      familyId: SECURED_MASTER_FAMILY_ID,
      payloadSchemaId: SCHEMA_ASR_MC_V1,
      dataset: SECURED_MASTER_DATASET,
      accessMode: SECURED_MASTER_ACCESS_MODE,
      payload: null,
    });
  }

  const line1 = field(byName, "SitusAddress").trim();
  const city = field(byName, "SitusCity").trim();
  const postalCode = field(byName, "SitusPostalCode").trim();
  if (!line1) {
    return Object.freeze({
      ok: false,
      reason: "asr_payload_required_field_missing:situsAddress.line1",
      organismId: SECURED_MASTER_ORGANISM_ID,
      familyId: SECURED_MASTER_FAMILY_ID,
      payloadSchemaId: SCHEMA_ASR_MC_V1,
      dataset: SECURED_MASTER_DATASET,
      accessMode: SECURED_MASTER_ACCESS_MODE,
      payload: null,
    });
  }
  if (!city) {
    return Object.freeze({
      ok: false,
      reason: "asr_payload_required_field_missing:situsAddress.city",
      organismId: SECURED_MASTER_ORGANISM_ID,
      familyId: SECURED_MASTER_FAMILY_ID,
      payloadSchemaId: SCHEMA_ASR_MC_V1,
      dataset: SECURED_MASTER_DATASET,
      accessMode: SECURED_MASTER_ACCESS_MODE,
      payload: null,
    });
  }
  if (!postalCode) {
    return Object.freeze({
      ok: false,
      reason: "asr_payload_required_field_missing:situsAddress.postalCode",
      organismId: SECURED_MASTER_ORGANISM_ID,
      familyId: SECURED_MASTER_FAMILY_ID,
      payloadSchemaId: SCHEMA_ASR_MC_V1,
      dataset: SECURED_MASTER_DATASET,
      accessMode: SECURED_MASTER_ACCESS_MODE,
      payload: null,
    });
  }

  const landUseCode = field(byName, "PUC").trim();
  if (!landUseCode) {
    return Object.freeze({
      ok: false,
      reason: "asr_payload_required_field_missing:landUseCode",
      organismId: SECURED_MASTER_ORGANISM_ID,
      familyId: SECURED_MASTER_FAMILY_ID,
      payloadSchemaId: SCHEMA_ASR_MC_V1,
      dataset: SECURED_MASTER_DATASET,
      accessMode: SECURED_MASTER_ACCESS_MODE,
      payload: null,
    });
  }

  const payload = Object.freeze({
    schemaId: SCHEMA_ASR_MC_V1,
    parcelId: folio,
    apn: folio,
    situsAddress: Object.freeze({
      line1,
      city,
      postalCode,
    }),
    landUseCode,
    assessedYear: yearGate.assessedYear,
  });

  const schemaCheck = validatePayloadAgainstSchema(SCHEMA_ASR_MC_V1, payload);
  if (!schemaCheck.ok) {
    return Object.freeze({
      ok: false,
      reason: schemaCheck.reason,
      organismId: SECURED_MASTER_ORGANISM_ID,
      familyId: SECURED_MASTER_FAMILY_ID,
      payloadSchemaId: SCHEMA_ASR_MC_V1,
      dataset: SECURED_MASTER_DATASET,
      accessMode: SECURED_MASTER_ACCESS_MODE,
      payload: null,
    });
  }

  return Object.freeze({
    ok: true,
    reason: null,
    organismId: SECURED_MASTER_ORGANISM_ID,
    familyId: SECURED_MASTER_FAMILY_ID,
    payloadSchemaId: SCHEMA_ASR_MC_V1,
    dataset: SECURED_MASTER_DATASET,
    accessMode: SECURED_MASTER_ACCESS_MODE,
    jurisdictionLabel: input.jurisdictionLabel ?? "Maricopa County, AZ",
    payload,
  });
}

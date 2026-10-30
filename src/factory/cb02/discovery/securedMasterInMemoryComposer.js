/**
 * Option C — one Secured Master assessor record, composed in memory.
 * Keeps the parser record beside its ASR envelope.
 * Stops at canonical fact, materiality, and assessor-only identity.
 * No persistence, SourceRef, registry write, expediente, or motor.
 */

import { DECISION_TRUST } from "../../cb05/decisionTrustBoundary.js";
import {
  PROPERTY_IDENTITY_STATUS,
  resolvePropertyIdentity,
} from "../../cb05/propertyIdentityResolver.js";
import { buildCanonicalPropertyFact } from "../connectors/canonicalPropertyFactAdapter.js";
import { KNOWN_JURISDICTIONS } from "../jurisdictionRegistry.js";
import { evaluateDiscoveryMateriality } from "./discoveryMaterialityGate.js";
import { adaptSecuredMasterRecordToAsrPayload } from "./securedMasterToAsrPayloadAdapter.js";
import {
  SECURED_MASTER_ACCESS_MODE,
  SECURED_MASTER_ORGANISM_ID,
} from "./securedMasterSnapshotContract.js";

const ASSESSOR_ONLY_IDENTITY_NOT_UNRESOLVED = "assessor_only_identity_not_unresolved";

/**
 * Existing Maricopa vocabulary label. Passed through; never omitted.
 * @returns {string|null}
 */
function explicitMaricopaJurisdictionLabel() {
  const label = KNOWN_JURISDICTIONS["US-AZ-MARICOPA"]?.sourceLabels?.[0];
  return typeof label === "string" && label.trim() ? label : null;
}

/**
 * Envelope label only. Not an identity key.
 * @param {object|null|undefined} record
 * @returns {string|null}
 */
function deterministicFactoryKey(record) {
  const bookId = record?.provenance?.bookId;
  const logicalIndex = record?.logicalIndex;
  if (typeof bookId !== "string" || !bookId.trim()) return null;
  if (!Number.isInteger(logicalIndex) || logicalIndex < 1) return null;
  return `${bookId}:${logicalIndex}`;
}

/**
 * @param {{
 *   ok: boolean,
 *   reason?: string|null,
 *   record?: object|null,
 *   envelope?: object|null,
 *   canonicalFact?: object|null,
 *   materiality?: object|null,
 *   identity?: object|null,
 *   factoryKey?: string|null,
 * }} fields
 */
function frozenResult(fields) {
  return Object.freeze({
    ok: fields.ok === true,
    reason: fields.reason ?? null,
    record: fields.record ?? null,
    envelope: fields.envelope ?? null,
    canonicalFact: fields.canonicalFact ?? null,
    materiality: fields.materiality ?? null,
    identity: fields.identity ?? null,
    factoryKey: fields.factoryKey ?? null,
  });
}

/**
 * Compose one assessor record. The caller owns retention.
 * taxYearMetadata is required and is never defaulted.
 *
 * @param {{
 *   record?: object|null,
 *   taxYearMetadata?: object|null,
 * }} [input]
 */
export function composeSecuredMasterAssessorRecord(input = {}) {
  const record = input?.record ?? null;
  const taxYearMetadata = input?.taxYearMetadata;
  const factoryKey = deterministicFactoryKey(record);

  const jurisdictionLabel = explicitMaricopaJurisdictionLabel();
  if (!jurisdictionLabel) {
    return frozenResult({
      ok: false,
      reason: "jurisdiction_label_required",
      record,
      factoryKey,
    });
  }

  const envelope = adaptSecuredMasterRecordToAsrPayload({
    record,
    taxYearMetadata,
    jurisdictionLabel,
  });

  if (!envelope?.ok) {
    return frozenResult({
      ok: false,
      reason: envelope?.reason ?? "source_record_invalid",
      record,
      envelope,
      factoryKey,
    });
  }

  if (envelope.organismId !== SECURED_MASTER_ORGANISM_ID || !factoryKey) {
    return frozenResult({
      ok: false,
      reason: factoryKey ? "assessor_organism_required" : "factory_key_custody_missing",
      record,
      envelope,
      factoryKey,
    });
  }

  const canonicalFact = buildCanonicalPropertyFact({
    payloadsByOrganism: {
      [SECURED_MASTER_ORGANISM_ID]: envelope.payload,
    },
    packJurisdictionLabel: envelope.jurisdictionLabel,
    trustMeta: {
      synthetic: false,
      stubBusinessFact: false,
      decisionTrusted: false,
      trustClass: DECISION_TRUST.NOT_PROVED,
      sourceMode: SECURED_MASTER_ACCESS_MODE,
    },
    factoryKey,
  });

  const materiality = evaluateDiscoveryMateriality({ canonicalFact });
  const identity = resolvePropertyIdentity({ canonicalFact });

  if (
    identity?.status !== PROPERTY_IDENTITY_STATUS.UNRESOLVED ||
    identity?.canonicalKey != null
  ) {
    return frozenResult({
      ok: false,
      reason: `${ASSESSOR_ONLY_IDENTITY_NOT_UNRESOLVED}:${identity?.status ?? "ABSENT"}`,
      record,
      envelope,
      factoryKey,
    });
  }

  return frozenResult({
    ok: true,
    reason: null,
    record,
    envelope,
    canonicalFact,
    materiality,
    identity,
    factoryKey,
  });
}

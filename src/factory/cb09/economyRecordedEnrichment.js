/**
 * PS05-04 — Thin CB-09 consume of RECORDED_REAL packs → economy honesty envelope.
 * Does not redesign connectors; uses existing recorded-pack load + organism contracts.
 */

import path from "node:path";
import { fileURLToPath } from "node:url";
import { buildSourceRef } from "../cb02/sourceRef.js";
import { getOrganism } from "../cb02/sourceOrganismsCatalog.js";
import { getRecordedContractByOrganismId } from "../cb02/connectors/recordedPackValidator.js";
import { loadRecordedPackForIngest } from "../cb02/connectors/recordedPackLoader.js";
import { SOURCE_MODE } from "../cb05/decisionTrustBoundary.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export const DEFAULT_PIMA_RECORDED_REAL_PACK_ROOT = path.resolve(
  __dirname,
  "../../../data/factory-dso-packs/pima/real-pilot-001"
);

export const CONTENT_CLASS = Object.freeze({
  RECORDED_REAL: "RECORDED_REAL",
});

/**
 * @param {object} result
 * @param {object} [extra]
 */
export function withRecordedRealEconomyTrust(result, extra = {}) {
  const trust = Object.freeze({
    trustClass: "RECORDED_REAL",
    stubBusinessFact: false,
    decisionTrusted: false,
    synthetic: false,
    sourceMode: SOURCE_MODE.RECORDED_ENRICHMENT,
    contentClass: CONTENT_CLASS.RECORDED_REAL,
    ...extra,
  });
  return {
    ...result,
    outputs: { ...(result.outputs ?? {}), ...trust },
    knowledgeDelta: { ...(result.knowledgeDelta ?? {}), ...trust },
  };
}

/**
 * @param {{
 *   organismId: string,
 *   familyId: string,
 *   factoryKey: string,
 *   vintageAt: string,
 *   payload?: object,
 * }} input
 */
export function buildEconomyRecordedSourceRef(input) {
  const organism = getOrganism(input.organismId);
  const contract = getRecordedContractByOrganismId(input.organismId);
  if (!organism || organism.status === "PROHIBITED") {
    throw new Error(`[PS05-04] Cannot enrich prohibited/missing organism ${input.organismId}`);
  }
  if (!contract || contract.mode !== "RECORDED_ONLY" || contract.liveFetch !== false) {
    throw new Error(`[PS05-04] Organism ${input.organismId} lacks RECORDED_ONLY contract`);
  }
  return buildSourceRef({
    organismId: input.organismId,
    familyId: input.familyId || organism.families[0],
    epistemicLevel: organism.epistemicLevel,
    factoryKey: input.factoryKey,
    vintageAt: input.vintageAt,
    ddiDomains: organism.ddiDomains ?? [],
    ddiPart: organism.ddiPart ?? null,
    freshness: {
      profile: organism.freshnessProfile,
      synthetic: false,
      recordedOnly: true,
      liveFetch: false,
      sourceMode: "RECORDED",
      enrichment: "PS05-04_RECORDED_REAL_ECONOMY",
      packPayloadSchemaId: input.payload?.schemaId ?? null,
      contentClass: CONTENT_CLASS.RECORDED_REAL,
    },
    complianceFlags: ["PS05-04", "RECORDED_REAL", "RECORDED_ONLY"],
    lowConfidenceFlags: [],
  });
}

/**
 * Resolve Assessor + GIS payloads from a RECORDED_REAL pack (any registered jurisdiction).
 *
 * @param {string} [packRoot]
 * @param {{ factoryKey?: string }} [options]
 */
export function loadEconomyRecordedRealEnrichment(packRoot, options = {}) {
  const root = packRoot
    ? path.resolve(packRoot)
    : DEFAULT_PIMA_RECORDED_REAL_PACK_ROOT;
  const loaded = loadRecordedPackForIngest(root);
  if (!loaded.ok) {
    return loaded;
  }

  const contentClass = loaded.manifest?.contentClass ?? null;
  if (contentClass !== CONTENT_CLASS.RECORDED_REAL) {
    return {
      ok: false,
      reason: `contentClass_not_RECORDED_REAL:${contentClass ?? "null"}`,
      contentClass,
    };
  }

  const factoryKey = options.factoryKey ?? loaded.factoryKey;
  /** @type {Record<string, object>} */
  const sourceRefsByOrganism = {};
  for (const request of loaded.requests) {
    sourceRefsByOrganism[request.organismId] = buildEconomyRecordedSourceRef({
      organismId: request.organismId,
      familyId: request.familyId,
      factoryKey,
      vintageAt: request.vintageAt,
      payload: loaded.payloadsByOrganism[request.organismId],
    });
  }

  const assessorId =
    Object.keys(sourceRefsByOrganism).find((id) =>
      getOrganism(id)?.families?.includes("REGISTRAL_ASSESSOR")
    ) ?? null;
  const gisId =
    Object.keys(sourceRefsByOrganism).find((id) =>
      getOrganism(id)?.families?.includes("GIS_OFFICIAL")
    ) ?? null;

  if (!assessorId || !gisId) {
    return {
      ok: false,
      reason: "pack_missing_assessor_or_gis",
    };
  }

  const asr = loaded.payloadsByOrganism[assessorId];
  const gis = loaded.payloadsByOrganism[gisId];
  const identity = resolveRecordedRealIdentity(asr, gis);

  return {
    ok: true,
    packRoot: root,
    factoryKey,
    contentClass: CONTENT_CLASS.RECORDED_REAL,
    mode: "RECORDED_ONLY",
    liveFetch: false,
    synthetic: false,
    assessorOrganismId: assessorId,
    gisOrganismId: gisId,
    assessor: sourceRefsByOrganism[assessorId],
    gis: sourceRefsByOrganism[gisId],
    sourceRefsByOrganism,
    payloadsByOrganism: loaded.payloadsByOrganism,
    identity,
    economics: extractEvidencedEconomics(asr),
    distressEvidence: { present: false, status: "NONE", note: "no_distress_fields_in_pack" },
    manifest: loaded.manifest,
    provenance: loaded.provenance,
    constitutionalPhase: "PS05-04",
  };
}

/**
 * @param {object|null} asr
 * @param {object|null} gis
 */
export function resolveRecordedRealIdentity(asr, gis) {
  const asrApn = normalizeApn(asr?.apn ?? asr?.apnFormatted ?? asr?.parcelId);
  const gisApn = normalizeApn(gis?.apn ?? gis?.apnFormatted ?? gis?.parcelId);
  const asrParcel = String(asr?.parcelId ?? "").replace(/\D/g, "");
  const gisParcel = String(gis?.parcelId ?? "").replace(/\D/g, "");
  const match =
    Boolean(asrApn && gisApn && asrApn === gisApn) ||
    Boolean(asrParcel && gisParcel && asrParcel === gisParcel);
  return Object.freeze({
    match,
    apn: asr?.apn ?? gis?.apn ?? null,
    parcelId: asr?.parcelId ?? gis?.parcelId ?? null,
    ownerInstitutionalName:
      asr?.ownerInstitutionalName ?? gis?.ownerInstitutionalName ?? null,
    jurisdiction: asr?.jurisdiction ?? gis?.jurisdiction ?? null,
  });
}

/**
 * @param {string|null|undefined} value
 */
function normalizeApn(value) {
  if (value == null) return null;
  return String(value).replace(/[^0-9A-Za-z]/g, "").toUpperCase();
}

/**
 * Evidenced economics only — never invent equity/mortgage/ROI.
 * @param {object|null} asr
 */
export function extractEvidencedEconomics(asr) {
  const valuation = asr?.valuation && typeof asr.valuation === "object" ? asr.valuation : null;
  const fullCashValue =
    typeof valuation?.fullCashValue === "number" ? valuation.fullCashValue : null;
  const limitedValue =
    typeof valuation?.limitedValue === "number" ? valuation.limitedValue : null;
  const landFcv = typeof valuation?.landFcv === "number" ? valuation.landFcv : null;
  const improvementFcv =
    typeof valuation?.improvementFcv === "number" ? valuation.improvementFcv : null;

  return Object.freeze({
    fullCashValue,
    limitedValue,
    landFcv,
    improvementFcv,
    currency: valuation?.currency ?? "USD",
    assessedYear: typeof asr?.assessedYear === "number" ? asr.assessedYear : null,
    equity: "UNKNOWN",
    mortgageBalance: "UNKNOWN",
    taxStatus: "UNKNOWN",
    submarket: "UNKNOWN",
    valueRange: "UNKNOWN",
    roi: "UNKNOWN",
    strategies: "UNKNOWN",
    floodZone: "UNKNOWN",
    contamination: "UNKNOWN",
    provenance: Object.freeze({
      organismId: asr ? "assessor" : null,
      fields: Object.freeze(
        [
          fullCashValue != null ? "valuation.fullCashValue" : null,
          limitedValue != null ? "valuation.limitedValue" : null,
          landFcv != null ? "valuation.landFcv" : null,
          improvementFcv != null ? "valuation.improvementFcv" : null,
        ].filter(Boolean)
      ),
      rule: "PS05-04-M04-evidenced-or-UNKNOWN",
    }),
  });
}

/**
 * @param {object} ctx
 * @returns {ReturnType<typeof loadEconomyRecordedRealEnrichment>|null}
 */
export function resolveEconomyRecordedRealContext(ctx) {
  const packRoot =
    ctx?.inputs?.recordedPackRoot ??
    ctx?.inputs?.recordedRealPackRoot ??
    null;
  const force =
    ctx?.inputs?.contentClass === CONTENT_CLASS.RECORDED_REAL ||
    ctx?.inputs?.recordedReal === true ||
    Boolean(packRoot);

  if (!force && ctx?.inputs?.forceSynthetic === true) {
    return null;
  }
  if (!force) {
    return null;
  }

  const loaded = loadEconomyRecordedRealEnrichment(packRoot ?? undefined, {
    factoryKey: ctx.factoryKey,
  });
  if (!loaded.ok) {
    return loaded;
  }
  return loaded;
}

/**
 * SP03-§15-ENG-IMPL Phase 1 — Recorded-pack information-source enrichment adapter.
 *
 * Maps P-INT-02 Offline RECORDED_ONLY packs → SourceRef enrichment inputs for
 * existing motors (consume CB-02 catalog / pack substrate). Does not enable Live,
 * does not redesign connectors, Runtime, CB semantics, Hardening, or P-INT catalogs.
 *
 * Mandate: adapters / enrichment / information-source replacement for §4-DEF-01 / §4-DEF-02.
 */

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { buildSourceRef } from "../sourceRef.js";
import { getOrganism } from "../sourceOrganismsCatalog.js";
import { getMaricopaContractByOrganismId } from "./maricopaConnectorContracts.js";
import { loadRecordedPackForIngest } from "./recordedPackLoader.js";
import { LIVE_NOT_AUTHORIZED } from "./connectorContract.js";
import { buildCanonicalPropertyFact } from "./canonicalPropertyFactAdapter.js";
import { resolvePropertyIdentity } from "../../cb05/propertyIdentityResolver.js";
import { evaluateFactCompleteness } from "../factCompleteness.js";
import { SOURCE_MODE } from "../../cb05/decisionTrustBoundary.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

/** Default published Maricopa Offline pilot pack (RECORDED_ONLY). */
export const DEFAULT_SP03_RECORDED_PACK_ROOT = path.resolve(
  __dirname,
  "../../../../data/factory-dso-packs/maricopa/pilot-001"
);

/**
 * @param {string} [packRoot]
 * @returns {string}
 */
export function resolveDefaultRecordedPackRoot(packRoot) {
  return packRoot ?? DEFAULT_SP03_RECORDED_PACK_ROOT;
}

/**
 * Build a SourceRef from a RECORDED_ONLY pack organism entry + payload.
 * Marks recorded enrichment (not synthetic fixture; not Live).
 *
 * @param {{
 *   organismId: string,
 *   familyId: string,
 *   factoryKey: string,
 *   vintageAt: string,
 *   payload?: object,
 * }} input
 */
export function buildRecordedEnrichmentSourceRef(input) {
  const organism = getOrganism(input.organismId);
  const contract = getMaricopaContractByOrganismId(input.organismId);
  if (!organism || organism.status === "PROHIBITED") {
    throw new Error(
      `[SP03-ENG] Cannot enrich prohibited/missing organism ${input.organismId}`
    );
  }
  if (!contract || contract.mode !== "RECORDED_ONLY" || contract.liveFetch !== false) {
    throw new Error(
      `[SP03-ENG] Organism ${input.organismId} lacks RECORDED_ONLY contract`
    );
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
      enrichment: "SP03_§15_RECORDED_PACK",
      packPayloadSchemaId: input.payload?.schemaId ?? null,
    },
    complianceFlags: ["SP03-§15-ENG-IMPL", "RECORDED_ONLY", "INFORMATION_SOURCE_ENRICHMENT"],
    lowConfidenceFlags: [],
  });
}

/**
 * Load Offline pack and produce enrichment SourceRefs + payloads.
 * Refuses Live. Does not call DSO ingest (pack→ingest remains offlineIngestFromPack).
 *
 * @param {string} [packRoot]
 * @param {{
 *   factoryKey?: string,
 *   attemptLiveFetch?: boolean,
 * }} [options]
 * @returns {{
 *   ok: true,
 *   packRoot: string,
 *   factoryKey: string,
 *   mode: "RECORDED_ONLY",
 *   liveFetch: false,
 *   synthetic: false,
 *   sourceRefsByOrganism: Record<string, object>,
 *   payloadsByOrganism: Record<string, object>,
 *   assessor: object,
 *   gis: object,
 *   recorder: object|null,
 *   constitutionalPhase: string,
 *   mandateClass: string,
 * } | { ok: false, reason: string, code?: string }}
 */
export function loadRecordedPackEnrichment(packRoot, options = {}) {
  if (options.attemptLiveFetch === true) {
    return {
      ok: false,
      reason: LIVE_NOT_AUTHORIZED,
      code: LIVE_NOT_AUTHORIZED,
    };
  }

  const root = resolveDefaultRecordedPackRoot(packRoot);
  if (!fs.existsSync(root)) {
    return { ok: false, reason: `pack_root_missing:${root}` };
  }

  const loaded = loadRecordedPackForIngest(root);
  if (!loaded.ok) {
    return { ok: false, reason: loaded.reason };
  }

  const factoryKey = options.factoryKey ?? loaded.factoryKey;
  /** @type {Record<string, object>} */
  const sourceRefsByOrganism = {};

  for (const request of loaded.requests) {
    const payload = loaded.payloadsByOrganism[request.organismId];
    sourceRefsByOrganism[request.organismId] = buildRecordedEnrichmentSourceRef({
      organismId: request.organismId,
      familyId: request.familyId,
      factoryKey,
      vintageAt: request.vintageAt,
      payload,
    });
  }

  const assessor = sourceRefsByOrganism["ORG-ASR-MC"];
  const gis = sourceRefsByOrganism["ORG-GIS-MC"];
  if (!assessor || !gis) {
    return {
      ok: false,
      reason: "pack_missing_required_organisms:ORG-ASR-MC,ORG-GIS-MC",
    };
  }

  const packJurisdictionLabel = loaded.manifest?.jurisdiction ?? null;
  const canonicalPropertyFact = buildCanonicalPropertyFact({
    payloadsByOrganism: loaded.payloadsByOrganism,
    sourceRefsByOrganism,
    packJurisdictionLabel,
    factoryKey,
    trustMeta: {
      sourceMode: SOURCE_MODE.RECORDED_ENRICHMENT,
      synthetic: false,
      decisionTrusted: true,
      trustClass: "TRUSTED",
    },
  });
  const propertyIdentity = resolvePropertyIdentity({ canonicalFact: canonicalPropertyFact });

  // PS05-03: re-bind fact completeness with resolved identity + SourceRef lineage.
  const factCompleteness = evaluateFactCompleteness({
    canonicalFact: canonicalPropertyFact,
    propertyIdentity,
    factoryKey,
    sourceCompleteness: canonicalPropertyFact.sourceCompleteness,
  });
  const enrichedCanonical = Object.freeze({
    ...canonicalPropertyFact,
    factCompleteness,
    factEnvelopes: Object.freeze(
      Object.fromEntries(factCompleteness.facts.map((f) => [f.factClass, f]))
    ),
  });

  return {
    ok: true,
    packRoot: root,
    factoryKey,
    mode: "RECORDED_ONLY",
    liveFetch: false,
    synthetic: false,
    sourceRefsByOrganism,
    payloadsByOrganism: loaded.payloadsByOrganism,
    assessor,
    gis,
    recorder: sourceRefsByOrganism["ORG-RCR-MC"] ?? null,
    packJurisdictionLabel,
    canonicalPropertyFact: enrichedCanonical,
    propertyIdentity,
    sourceCompleteness: enrichedCanonical.sourceCompleteness,
    factCompleteness,
    constitutionalPhase: "SP03-§15-ENG-IMPL",
    mandateClass: "INFORMATION_SOURCE_ENRICHMENT",
  };
}

/**
 * Foundation-facing enrichment bundle (assessor + GIS) from RECORDED_ONLY pack.
 *
 * @param {string} factoryKey
 * @param {{ packRoot?: string }} [options]
 */
export function buildFoundationRecordedEnrichmentBundle(factoryKey, options = {}) {
  const loaded = loadRecordedPackEnrichment(options.packRoot, { factoryKey });
  if (!loaded.ok) {
    return loaded;
  }
  return Object.freeze({
    ok: true,
    assessor: loaded.assessor,
    gis: loaded.gis,
    recorder: loaded.recorder,
    payloadsByOrganism: loaded.payloadsByOrganism,
    synthetic: false,
    recordedOnly: true,
    liveFetch: false,
    packRoot: loaded.packRoot,
    sourceMode: "RECORDED_ENRICHMENT",
    packJurisdictionLabel: loaded.packJurisdictionLabel ?? null,
    canonicalPropertyFact: loaded.canonicalPropertyFact ?? null,
    propertyIdentity: loaded.propertyIdentity ?? null,
    sourceCompleteness: loaded.sourceCompleteness ?? null,
    factCompleteness: loaded.factCompleteness ?? null,
    constitutionalPhase: "SP03-§15-ENG-IMPL",
    mandateRefs: ["§5.1#1", "§5.1#2", "§5.1#3", "§4-DEF-01", "§4-DEF-02"],
  });
}

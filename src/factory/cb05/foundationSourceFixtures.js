/**
 * CB-05 — Foundation source fixtures + SP03 recorded-pack enrichment resolver.
 * Synthetic fixtures retained for catalog-only / regression paths.
 * Prefer RECORDED_ONLY pack enrichment when available (SP03-§15-ENG-IMPL Phase 1).
 * No live connectors.
 */

import { buildSourceRef } from "../cb02/sourceRef.js";
import { buildFoundationRecordedEnrichmentBundle } from "../cb02/connectors/recordedPackEnrichmentAdapter.js";

/**
 * @param {string} factoryKey
 * @param {{ vintageAt?: string }} [options]
 */
export function buildAssessorFixtureRef(factoryKey, options = {}) {
  return buildSourceRef({
    organismId: "ORG-ASR-MC",
    familyId: "REGISTRAL_ASSESSOR",
    epistemicLevel: 1,
    factoryKey,
    vintageAt: options.vintageAt ?? new Date().toISOString(),
    ddiDomains: ["01", "03"],
    ddiPart: "I",
    freshness: { profile: "ASSESSOR_ROLL", synthetic: true },
    complianceFlags: ["CB-05-FIXTURE"],
  });
}

/**
 * @param {string} factoryKey
 * @param {{ vintageAt?: string }} [options]
 */
export function buildGisFixtureRef(factoryKey, options = {}) {
  return buildSourceRef({
    organismId: "ORG-GIS-MC",
    familyId: "GIS_OFFICIAL",
    epistemicLevel: 1,
    factoryKey,
    vintageAt: options.vintageAt ?? new Date().toISOString(),
    ddiDomains: ["01", "02"],
    ddiPart: "I",
    freshness: { profile: "ASSESSOR_ROLL", synthetic: true },
    complianceFlags: ["CB-05-FIXTURE"],
  });
}

/**
 * @param {string} factoryKey
 * @param {{ stale?: boolean }} [options]
 */
export function buildFoundationFixtureBundle(factoryKey, options = {}) {
  const vintageAt = options.stale
    ? new Date(Date.now() - 400 * 24 * 60 * 60 * 1000).toISOString()
    : new Date().toISOString();
  return Object.freeze({
    assessor: buildAssessorFixtureRef(factoryKey, { vintageAt }),
    gis: buildGisFixtureRef(factoryKey, { vintageAt }),
    synthetic: true,
    recordedOnly: false,
    sourceMode: "SYNTHETIC_FIXTURE",
    constitutionalPhase: "CB-05",
  });
}

/**
 * Resolve foundation source bundle: prefer RECORDED_ONLY pack enrichment
 * (information-source replacement / enrichment) when pack loads; else synthetic fixtures.
 *
 * @param {string} factoryKey
 * @param {{
 *   packRoot?: string,
 *   preferRecordedEnrichment?: boolean,
 *   forceSynthetic?: boolean,
 *   stale?: boolean,
 * }} [options]
 */
export function resolveFoundationSourceBundle(factoryKey, options = {}) {
  if (options.forceSynthetic === true) {
    return buildFoundationFixtureBundle(factoryKey, options);
  }

  const prefer = options.preferRecordedEnrichment !== false;
  if (prefer) {
    const enriched = buildFoundationRecordedEnrichmentBundle(factoryKey, {
      packRoot: options.packRoot,
    });
    if (enriched.ok === true) {
      return enriched;
    }
  }

  return buildFoundationFixtureBundle(factoryKey, options);
}

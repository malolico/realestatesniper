/**
 * CB-05 — Foundation source fixtures + SP03 recorded-pack enrichment resolver.
 * Synthetic fixtures retained for catalog-only / regression paths.
 * Prefer RECORDED_ONLY pack enrichment when pack loads AND within LOOP-FND-FRS-01 SLA
 * (SP03-§15-ENG-IMPL Phase 2 / OBS-01). No live connectors.
 */

import { buildSourceRef } from "../cb02/sourceRef.js";
import { buildFoundationRecordedEnrichmentBundle } from "../cb02/connectors/recordedPackEnrichmentAdapter.js";
import { evaluateFreshness } from "./loopFndFrs01.js";

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
 * Whether recorded enrichment SourceRefs satisfy LOOP-FND-FRS-01 freshness SLA.
 * Preserves honest vintageAt — does not rewrite pack vintages.
 *
 * @param {{ assessor?: object, gis?: object, recorder?: object|null }} bundle
 */
export function isRecordedEnrichmentFreshForFoundation(bundle) {
  const refs = [bundle.assessor, bundle.gis, bundle.recorder].filter(Boolean);
  return evaluateFreshness(refs).fresh === true;
}

/**
 * Resolve foundation source bundle: prefer RECORDED_ONLY pack enrichment
 * when pack loads and is within freshness SLA (OBS-01); else synthetic fixtures.
 * Explicit preferRecordedEnrichment=true keeps recorded even if stale (honest vintages).
 *
 * @param {string} factoryKey
 * @param {{
 *   packRoot?: string,
 *   preferRecordedEnrichment?: boolean,
 *   forceSynthetic?: boolean,
 *   allowStaleRecordedEnrichment?: boolean,
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
      const allowStale =
        options.allowStaleRecordedEnrichment === true ||
        options.preferRecordedEnrichment === true;
      if (allowStale || isRecordedEnrichmentFreshForFoundation(enriched)) {
        return enriched;
      }
      const fallback = buildFoundationFixtureBundle(factoryKey, options);
      return Object.freeze({
        ...fallback,
        recordedSkippedReason: "freshness_sla_breach",
        recordedPackRootAvailable: enriched.packRoot ?? null,
        /** OBS-P2-03 — keep fixture constitutionalPhase; SP03 refs are advisory only. */
        recordedEnrichmentSkippedPhase: "SP03-§15-ENG-IMPL",
        enrichmentMandate: null,
        phase: "Phase 3",
        obsRefs: ["OBS-01", "OBS-P2-03"],
      });
    }
  }

  return buildFoundationFixtureBundle(factoryKey, options);
}

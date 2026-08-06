/**
 * CB-13 — Intelligence source fixtures + SP04 CEP-01 recorded enrichment resolver.
 * Synthetic fixtures retained for catalog-only / regression paths.
 * Prefer RECORDED_ONLY pack enrichment when pack loads (DEF-SP04-02).
 * No live connectors / no LLM.
 */

import { buildIntelligenceRecordedEnrichmentBundle } from "./intelligenceRecordedEnrichmentAdapter.js";

/**
 * @param {string} factoryKey
 */
export function buildIntelligenceFixtureBundle(factoryKey) {
  return Object.freeze({
    synthesisRef: `SYN-FIX-${factoryKey}`,
    corpusRef: `DCN-FIX-${factoryKey}`,
    releaseRef: `COM-FIX-${factoryKey}`,
    execMemoRef: `EXE-FIX-${factoryKey}`,
    synthetic: true,
    recordedOnly: false,
    liveFetch: false,
    sourceMode: "SYNTHETIC_FIXTURE",
    constitutionalPhase: "CB-13",
    mandateRefs: null,
    livingIntelligenceProved: false,
    phase1Complete: false,
  });
}

/**
 * Resolve INT source bundle: prefer RECORDED_ONLY pack enrichment when pack loads;
 * else synthetic fixtures. Explicit forceSynthetic keeps fixture path.
 *
 * @param {string} factoryKey
 * @param {{
 *   packRoot?: string,
 *   preferRecordedEnrichment?: boolean,
 *   forceSynthetic?: boolean,
 * }} [options]
 */
export function resolveIntelligenceSourceBundle(factoryKey, options = {}) {
  if (options.forceSynthetic === true) {
    return buildIntelligenceFixtureBundle(factoryKey);
  }

  const prefer = options.preferRecordedEnrichment !== false;
  if (prefer) {
    const enriched = buildIntelligenceRecordedEnrichmentBundle(factoryKey, {
      packRoot: options.packRoot,
    });
    if (enriched.ok === true) {
      return enriched;
    }
    const fallback = buildIntelligenceFixtureBundle(factoryKey);
    return Object.freeze({
      ...fallback,
      recordedSkippedReason: enriched.reason ?? "pack_unavailable",
      recordedEnrichmentSkippedPhase: "SP04-ENG-IMPL",
      enrichmentMandate: null,
      gateId: "DAG-SP04-CEP01-P1",
    });
  }

  return buildIntelligenceFixtureBundle(factoryKey);
}

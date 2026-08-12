/**
 * CB-13 — Intelligence source fixtures + SP04 CEP-01 recorded enrichment resolver.
 * Synthetic fixtures retained for catalog-only / regression paths.
 * Prefer RECORDED_ONLY pack enrichment when pack loads (DEF-SP04-02).
 * No live connectors / no LLM.
 *
 * PS05-01: Decision-facing path fails closed — pack miss → UNAVAILABLE,
 * not silent synthetic substitute. Explicit forceSynthetic remains test lane.
 */

import { buildIntelligenceRecordedEnrichmentBundle } from "./intelligenceRecordedEnrichmentAdapter.js";
import {
  SOURCE_MODE,
  allowExplicitSynthetic,
  buildUnavailableSourceBundle,
  isDecisionFacingPath,
} from "../cb05/decisionTrustBoundary.js";

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
    sourceMode: SOURCE_MODE.SYNTHETIC_FIXTURE,
    trustClass: "STUB",
    stubBusinessFact: true,
    decisionTrusted: false,
    constitutionalPhase: "CB-13",
    mandateRefs: null,
    livingIntelligenceProved: false,
    phase1Complete: false,
  });
}

/**
 * Resolve INT source bundle: prefer RECORDED_ONLY pack enrichment when pack loads;
 * else synthetic fixtures unless Decision-facing (PS05-01) → UNAVAILABLE.
 * Explicit forceSynthetic keeps fixture path.
 *
 * @param {string} factoryKey
 * @param {{
 *   packRoot?: string,
 *   preferRecordedEnrichment?: boolean,
 *   forceSynthetic?: boolean,
 *   decisionFacing?: boolean,
 *   decisionPath?: boolean,
 * }} [options]
 */
export function resolveIntelligenceSourceBundle(factoryKey, options = {}) {
  if (allowExplicitSynthetic(options)) {
    return buildIntelligenceFixtureBundle(factoryKey);
  }

  const decisionFacing = isDecisionFacingPath(options);
  const prefer = options.preferRecordedEnrichment !== false;
  if (prefer) {
    const enriched = buildIntelligenceRecordedEnrichmentBundle(factoryKey, {
      packRoot: options.packRoot,
    });
    if (enriched.ok === true) {
      return enriched;
    }
    if (decisionFacing) {
      return buildUnavailableSourceBundle(
        factoryKey,
        enriched.reason ?? "pack_unavailable",
        "PS05-01"
      );
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

  if (decisionFacing) {
    return buildUnavailableSourceBundle(factoryKey, "pack_unavailable", "PS05-01");
  }

  return buildIntelligenceFixtureBundle(factoryKey);
}

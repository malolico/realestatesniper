/**
 * SP04-ENG-IMPL CEP-01 / Phase 1 — Intelligence recorded-pack enrichment adapter.
 *
 * Consumes published CB-02 RECORDED_ONLY pack enrichment (SP03 substrate) and maps
 * it to INT-facing SourceRefs for CB-13 motors. Does not enable Live, does not
 * redesign connectors, Runtime, CB semantics, Hardening, or P-INT catalogs.
 *
 * Mandate class: adapters / enrichment / information-source replacement
 * Deficits: DEF-SP04-01 · DEF-SP04-02
 * Gate: DAG-SP04-CEP01-P1
 */

import {
  loadRecordedPackEnrichment,
  resolveDefaultRecordedPackRoot,
} from "../cb02/connectors/recordedPackEnrichmentAdapter.js";
import { LIVE_NOT_AUTHORIZED } from "../cb02/connectors/connectorContract.js";

export { resolveDefaultRecordedPackRoot };

/**
 * Build INT-facing enrichment bundle from RECORDED_ONLY pack.
 * Refuses Live. Falls through to caller on pack load failure.
 *
 * @param {string} factoryKey
 * @param {{
 *   packRoot?: string,
 *   attemptLiveFetch?: boolean,
 * }} [options]
 * @returns {{
 *   ok: true,
 *   synthesisRef: object,
 *   corpusRef: object,
 *   releaseRef: object,
 *   execMemoRef: object,
 *   payloadsByOrganism: Record<string, object>,
 *   synthetic: false,
 *   recordedOnly: true,
 *   liveFetch: false,
 *   packRoot: string,
 *   sourceMode: "RECORDED_ENRICHMENT",
 *   constitutionalPhase: string,
 *   mandateRefs: string[],
 * } | { ok: false, reason: string, code?: string }}
 */
export function buildIntelligenceRecordedEnrichmentBundle(factoryKey, options = {}) {
  if (options.attemptLiveFetch === true) {
    return {
      ok: false,
      reason: LIVE_NOT_AUTHORIZED,
      code: LIVE_NOT_AUTHORIZED,
    };
  }

  const loaded = loadRecordedPackEnrichment(options.packRoot, { factoryKey });
  if (!loaded.ok) {
    return { ok: false, reason: loaded.reason, code: loaded.code };
  }

  /*
   * ASR/GIS → INT role mapping (CEP-01 adapter only):
   * - Consumes published CB-02 SourceRefs from RECORDED_ONLY pack enrichment.
   * - Does not create organisms; does not expand catalog; does not alter motor/organism IDs.
   * - Does not redesign Construction Block semantics — consume-only information-source wiring.
   */
  const synthesisRef = loaded.assessor;
  const corpusRef = loaded.gis;
  const releaseRef = loaded.recorder ?? loaded.assessor;
  const execMemoRef = loaded.assessor;

  return Object.freeze({
    ok: true,
    synthesisRef,
    corpusRef,
    releaseRef,
    execMemoRef,
    payloadsByOrganism: loaded.payloadsByOrganism,
    synthetic: false,
    recordedOnly: true,
    liveFetch: false,
    packRoot: loaded.packRoot,
    sourceMode: "RECORDED_ENRICHMENT",
    constitutionalPhase: "SP04-ENG-IMPL",
    mandateClass: "INFORMATION_SOURCE_ENRICHMENT",
    mandateRefs: ["SP04-ENG-IMPL", "CEP-01", "DEF-SP04-01", "DEF-SP04-02", "DAG-SP04-CEP01-P1"],
    gateId: "DAG-SP04-CEP01-P1",
    livingIntelligenceProved: false,
    phase1Complete: false,
  });
}

/**
 * PS05-04 — Thin CB-08 consume of RECORDED_REAL packs → distress honesty envelope.
 * Pima real-pilot has no evidenced distress; emit NONE/UNKNOWN only.
 */

import path from "node:path";
import { fileURLToPath } from "node:url";
import { SOURCE_MODE } from "../cb05/decisionTrustBoundary.js";
import {
  CONTENT_CLASS,
  loadEconomyRecordedRealEnrichment,
} from "../cb09/economyRecordedEnrichment.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export const DEFAULT_PIMA_RECORDED_REAL_PACK_ROOT = path.resolve(
  __dirname,
  "../../../data/factory-dso-packs/pima/real-pilot-001"
);

/**
 * @param {object} result
 * @param {object} [extra]
 */
export function withRecordedRealDistressTrust(result, extra = {}) {
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
 * @param {string} [packRoot]
 * @param {{ factoryKey?: string }} [options]
 */
export function loadDistressRecordedRealEnrichment(packRoot, options = {}) {
  const loaded = loadEconomyRecordedRealEnrichment(
    packRoot ?? DEFAULT_PIMA_RECORDED_REAL_PACK_ROOT,
    options
  );
  if (!loaded.ok) {
    return loaded;
  }

  // Government exemption notes are NOT distress evidence.
  return {
    ...loaded,
    distress: Object.freeze({
      status: "NONE",
      evidencedSignals: Object.freeze([]),
      pre_foreclosure: "UNKNOWN",
      tax_delinquency: "UNKNOWN",
      probate: "UNKNOWN",
      auction: "UNKNOWN",
      governmentExemptionNoted: Array.isArray(loaded.payloadsByOrganism?.[loaded.assessorOrganismId]?.notesPublic)
        ? loaded.payloadsByOrganism[loaded.assessorOrganismId].notesPublic.some((n) =>
            String(n).toLowerCase().includes("government exempt")
          )
        : false,
      note: "no_evidenced_distress_in_RECORDED_REAL_pack",
      rule: "PS05-04-M05-evidenced-or-UNKNOWN",
    }),
  };
}

/**
 * @param {object} ctx
 */
export function resolveDistressRecordedRealContext(ctx) {
  const packRoot =
    ctx?.inputs?.recordedPackRoot ??
    ctx?.inputs?.recordedRealPackRoot ??
    null;
  const force =
    ctx?.inputs?.contentClass === CONTENT_CLASS.RECORDED_REAL ||
    ctx?.inputs?.recordedReal === true ||
    Boolean(packRoot);

  if (!force || ctx?.inputs?.forceSynthetic === true) {
    return null;
  }

  return loadDistressRecordedRealEnrichment(packRoot ?? undefined, {
    factoryKey: ctx.factoryKey,
  });
}

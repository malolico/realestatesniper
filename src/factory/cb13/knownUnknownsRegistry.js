/**
 * CB-13 — Known unknowns registry (DKN / G5)
 * PS05-03: unknowns computed from missing expected facts/sources — no invented Obl.
 */

import { loadRecordedPackEnrichment } from "../cb02/connectors/recordedPackEnrichmentAdapter.js";
import { evaluateSourceCompleteness } from "../cb02/sourceCompleteness.js";
import {
  evaluateFactCompleteness,
  buildUnknownsFromCompleteness,
} from "../cb02/factCompleteness.js";

/**
 * Compute known unknowns from bounded evidence. Does not invent Obl to satisfy G5.
 *
 * @param {string} factoryKey
 * @param {object[]} [layerBlockers]
 * @param {{
 *   canonicalFact?: object|null,
 *   propertyIdentity?: object|null,
 *   payloadsByOrganism?: Record<string, object>|null,
 *   sourceRefsByOrganism?: Record<string, object>|null,
 *   skipPackLoad?: boolean,
 * }} [evidence]
 */
export function buildComputedKnownUnknowns(factoryKey, layerBlockers = [], evidence = {}) {
  let canonicalFact = evidence.canonicalFact ?? null;
  let propertyIdentity = evidence.propertyIdentity ?? null;
  let payloadsByOrganism = evidence.payloadsByOrganism ?? null;
  let sourceRefsByOrganism = evidence.sourceRefsByOrganism ?? null;

  if (!evidence.skipPackLoad && !canonicalFact && !payloadsByOrganism) {
    const loaded = loadRecordedPackEnrichment(undefined, { factoryKey });
    if (loaded.ok) {
      canonicalFact = loaded.canonicalPropertyFact;
      propertyIdentity = loaded.propertyIdentity;
      payloadsByOrganism = loaded.payloadsByOrganism;
      sourceRefsByOrganism = loaded.sourceRefsByOrganism;
    }
  }

  const sourceCompleteness = evaluateSourceCompleteness({
    payloadsByOrganism,
    sourceRefsByOrganism,
    unavailableOrganisms: evidence.unavailableOrganisms,
    failedOrganisms: evidence.failedOrganisms,
    notCheckedOrganisms: evidence.notCheckedOrganisms,
  });

  const factCompleteness = evaluateFactCompleteness({
    canonicalFact,
    propertyIdentity,
    factoryKey,
    sourceCompleteness,
  });

  return buildUnknownsFromCompleteness(factoryKey, {
    factCompleteness,
    sourceCompleteness,
    layerBlockers,
  });
}

/**
 * Backward-compatible entry used by INT bootstrap.
 * Replaces hardcoded Obl DKN-001/002 with computed unknowns.
 *
 * @param {string} factoryKey
 * @param {object[]} [layerBlockers]
 */
export function buildDefaultKnownUnknowns(factoryKey, layerBlockers = []) {
  const computed = buildComputedKnownUnknowns(factoryKey, layerBlockers);
  return computed.unknowns;
}

/**
 * @param {object[]} unknowns
 */
export function validateKnownUnknowns(unknowns) {
  const list = unknowns ?? [];
  const evaluationComplete = list.some((u) => u.evaluationComplete === true);
  const honestyComplete = list.some((u) => u.honestyComplete === true);
  const obl = list.filter((u) => u.obligation === "Obl");
  const undeclared = obl.filter((u) => u.declared !== true);
  const invented = obl.filter((u) => u.invented === true);

  return {
    valid:
      undeclared.length === 0 &&
      invented.length === 0 &&
      (evaluationComplete || honestyComplete || obl.length > 0),
    declaredCount: obl.filter((u) => u.declared).length,
    obligationCount: obl.length,
    evaluationComplete,
    honestyComplete,
    inventedCount: invented.length,
  };
}

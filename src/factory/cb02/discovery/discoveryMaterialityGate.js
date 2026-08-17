/**
 * SP10 — Structural materiality gate (CB-02 Discovery)
 * No business scoring — CB05 identity input completeness only.
 */

import { JURISDICTION_STATUS } from "../jurisdictionRegistry.js";
import { DISCOVERY_MATERIALITY_STATUS } from "./discoveryCandidateContract.js";

/**
 * @param {string|null|undefined} value
 */
function normStrongId(value) {
  if (typeof value !== "string") return null;
  const t = value.trim();
  return t.length ? t.toUpperCase() : null;
}

/**
 * @param {{ canonicalFact?: object|null }} input
 */
export function evaluateDiscoveryMateriality(input = {}) {
  const fact = input.canonicalFact;
  if (!fact || typeof fact !== "object") {
    return Object.freeze({
      materialityStatus: DISCOVERY_MATERIALITY_STATUS.INSUFFICIENT,
      reasons: Object.freeze(["canonical_fact_missing"]),
    });
  }

  if (fact.jurisdiction?.status !== JURISDICTION_STATUS.KNOWN) {
    return Object.freeze({
      materialityStatus: DISCOVERY_MATERIALITY_STATUS.INSUFFICIENT,
      reasons: Object.freeze(["jurisdiction_unknown"]),
    });
  }

  const raw = fact.rawIdentifiers ?? {};
  const assessor = raw.assessor ?? {};
  const gis = raw.gis ?? {};
  const recorder = raw.recorder ?? {};

  const parcelId = normStrongId(assessor.parcelId ?? gis.parcelId ?? recorder.parcelRef);
  const apn = normStrongId(assessor.apn ?? gis.apn);
  const recorderRef = normStrongId(recorder.parcelRef);

  if (!parcelId && !apn && !recorderRef) {
    return Object.freeze({
      materialityStatus: DISCOVERY_MATERIALITY_STATUS.INSUFFICIENT,
      reasons: Object.freeze(["no_strong_identifier"]),
    });
  }

  return Object.freeze({
    materialityStatus: DISCOVERY_MATERIALITY_STATUS.MATERIAL,
    reasons: Object.freeze(["known_jurisdiction_and_strong_identifier"]),
  });
}

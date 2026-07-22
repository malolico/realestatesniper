/**
 * CB-08 — Synthetic distress source fixtures (catalog-only)
 */

import { buildSourceRef } from "../cb02/sourceRef.js";

/**
 * @param {string} factoryKey
 */
export function buildDistressSignalFixtureRef(factoryKey) {
  return buildSourceRef({
    organismId: "ORG-RCR-MC",
    familyId: "REGISTRAL_RECORDER",
    epistemicLevel: 1,
    factoryKey,
    ddiDomains: ["12"],
    ddiPart: "III",
    freshness: { profile: "DISTRESS_SIGNAL", synthetic: true },
    complianceFlags: ["CB-08-FIXTURE"],
  });
}

/**
 * @param {string} factoryKey
 */
export function buildCourtDistressFixtureRef(factoryKey) {
  return buildSourceRef({
    organismId: "ORG-CRT-MC",
    familyId: "JUDICIAL_INDEX",
    epistemicLevel: 1,
    factoryKey,
    ddiDomains: ["15", "16"],
    ddiPart: "III",
    freshness: { profile: "DISTRESS_JUDICIAL", synthetic: true },
    complianceFlags: ["CB-08-FIXTURE"],
  });
}

/**
 * @param {string} factoryKey
 */
export function buildDistressFixtureBundle(factoryKey) {
  return Object.freeze({
    signal: buildDistressSignalFixtureRef(factoryKey),
    court: buildCourtDistressFixtureRef(factoryKey),
    synthetic: true,
    constitutionalPhase: "CB-08",
  });
}

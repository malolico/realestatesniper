/**
 * CB-09 — Synthetic economy / valuation source fixtures (catalog-only)
 */

import { buildSourceRef } from "../cb02/sourceRef.js";

/**
 * @param {string} factoryKey
 */
export function buildAssessorFixtureRef(factoryKey) {
  return buildSourceRef({
    organismId: "ORG-ASR-MC",
    familyId: "ASSESSOR_ROLL",
    epistemicLevel: 2,
    factoryKey,
    ddiDomains: ["21", "22", "23"],
    ddiPart: "IV",
    freshness: { profile: "FISCAL_ROLL", synthetic: true },
    complianceFlags: ["CB-09-FIXTURE"],
  });
}

/**
 * @param {string} factoryKey
 */
export function buildMarketFixtureRef(factoryKey) {
  return buildSourceRef({
    organismId: "ORG-ASR-MC",
    familyId: "MARKET_MLS",
    epistemicLevel: 2,
    factoryKey,
    ddiDomains: ["27", "28", "29", "32"],
    ddiPart: "IV",
    freshness: { profile: "MLS_COMPS", synthetic: true },
    complianceFlags: ["CB-09-FIXTURE"],
  });
}

/**
 * @param {string} factoryKey
 */
export function buildHazardFixtureRef(factoryKey) {
  return buildSourceRef({
    organismId: "ORG-GIS-MC",
    familyId: "GIS_PARCEL",
    epistemicLevel: 2,
    factoryKey,
    ddiDomains: ["24", "25"],
    ddiPart: "IV",
    freshness: { profile: "HAZARD_LAYER", synthetic: true },
    complianceFlags: ["CB-09-FIXTURE"],
  });
}

/**
 * @param {string} factoryKey
 */
export function buildEconomyFixtureBundle(factoryKey) {
  return Object.freeze({
    assessor: buildAssessorFixtureRef(factoryKey),
    market: buildMarketFixtureRef(factoryKey),
    hazard: buildHazardFixtureRef(factoryKey),
    synthetic: true,
    sourceMode: "SYNTHETIC_FIXTURE",
    trustClass: "STUB",
    stubBusinessFact: true,
    decisionTrusted: false,
    constitutionalPhase: "CB-09",
  });
}

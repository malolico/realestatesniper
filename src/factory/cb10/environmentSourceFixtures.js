/**
 * CB-10 — Synthetic environment source fixtures (catalog-only)
 */

import { buildSourceRef } from "../cb02/sourceRef.js";

/**
 * @param {string} factoryKey
 */
export function buildCensusContextFixtureRef(factoryKey) {
  return buildSourceRef({
    organismId: "ORG-GIS-MC",
    familyId: "GIS_PARCEL",
    epistemicLevel: 2,
    factoryKey,
    ddiDomains: ["33", "35"],
    ddiPart: "V",
    vintageAt: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString(),
    freshness: { profile: "CENSUS_DEMO", synthetic: true },
    complianceFlags: ["CB-10-FIXTURE"],
  });
}

/**
 * @param {string} factoryKey
 */
export function buildLivabilityFixtureRef(factoryKey) {
  return buildSourceRef({
    organismId: "ORG-PRH-SCR",
    familyId: "PUBLIC_RECORDS",
    epistemicLevel: 2,
    factoryKey,
    ddiDomains: ["34", "36"],
    ddiPart: "V",
    vintageAt: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString(),
    freshness: { profile: "CRIME_TREND", synthetic: true },
    complianceFlags: ["CB-10-FIXTURE", "FAIR_HOUSING_GUARD"],
  });
}

/**
 * @param {string} factoryKey
 */
export function buildPlanningFixtureRef(factoryKey) {
  return buildSourceRef({
    organismId: "ORG-GIS-MC",
    familyId: "GIS_PARCEL",
    epistemicLevel: 2,
    factoryKey,
    ddiDomains: ["37"],
    ddiPart: "V",
    vintageAt: new Date().toISOString(),
    freshness: { profile: "PERMITS_CO", synthetic: true },
    complianceFlags: ["CB-10-FIXTURE"],
  });
}

/**
 * @param {string} factoryKey
 */
export function buildEnvironmentFixtureBundle(factoryKey) {
  return Object.freeze({
    census: buildCensusContextFixtureRef(factoryKey),
    livability: buildLivabilityFixtureRef(factoryKey),
    planning: buildPlanningFixtureRef(factoryKey),
    synthetic: true,
    constitutionalPhase: "CB-10",
  });
}

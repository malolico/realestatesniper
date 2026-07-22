/**
 * CB-05 — Synthetic foundation source fixtures (catalog-only, no live connectors)
 */

import { buildSourceRef } from "../cb02/sourceRef.js";

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
    constitutionalPhase: "CB-05",
  });
}

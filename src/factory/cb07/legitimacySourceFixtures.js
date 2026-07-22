/**
 * CB-07 — Synthetic legitimacy source fixtures (catalog-only)
 */

import { buildSourceRef } from "../cb02/sourceRef.js";

/**
 * @param {string} factoryKey
 */
export function buildRecorderFixtureRef(factoryKey) {
  return buildSourceRef({
    organismId: "ORG-RCR-MC",
    familyId: "REGISTRAL_RECORDER",
    epistemicLevel: 1,
    factoryKey,
    ddiDomains: ["08", "09", "10"],
    ddiPart: "II",
    freshness: { profile: "TITLE_LIENS", synthetic: true },
    complianceFlags: ["CB-07-FIXTURE"],
  });
}

/**
 * @param {string} factoryKey
 */
export function buildTitleCommitmentFixtureRef(factoryKey) {
  return buildSourceRef({
    organismId: "ORG-TTL-VND",
    familyId: "TITLE_COMMITMENT",
    epistemicLevel: 2,
    factoryKey,
    ddiDomains: ["07", "08", "09"],
    ddiPart: "II",
    freshness: { profile: "TITLE_LIENS", synthetic: true },
    complianceFlags: ["CB-07-FIXTURE"],
  });
}

/**
 * @param {string} factoryKey
 */
export function buildCourtIndexFixtureRef(factoryKey) {
  return buildSourceRef({
    organismId: "ORG-CRT-MC",
    familyId: "JUDICIAL_INDEX",
    epistemicLevel: 1,
    factoryKey,
    ddiDomains: ["07"],
    ddiPart: "II",
    freshness: { profile: "TITLE_LIENS", synthetic: true },
    complianceFlags: ["CB-07-FIXTURE"],
  });
}

/**
 * @param {string} factoryKey
 */
export function buildLegitimacyFixtureBundle(factoryKey) {
  return Object.freeze({
    recorder: buildRecorderFixtureRef(factoryKey),
    titleCommitment: buildTitleCommitmentFixtureRef(factoryKey),
    courtIndex: buildCourtIndexFixtureRef(factoryKey),
    synthetic: true,
    constitutionalPhase: "CB-07",
  });
}

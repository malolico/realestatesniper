/**
 * CB-00 — Catalog Actor Guard
 * Enforces: no Factory actor outside OMC / OLC / OSC / OAC catalogs.
 */

import { matchActorCode } from "./operationalVocabulary.js";

export const CATALOG_ACTOR_FAMILIES = Object.freeze(["MOT", "LOOP", "SWM", "AIA", "CAP"]);

export const CATALOG_SOURCE_BY_FAMILY = Object.freeze({
  MOT: "OMC",
  LOOP: "OLC",
  SWM: "OSC",
  AIA: "OAC",
  CAP: "FCC",
});

/**
 * @param {string} actorCode
 * @returns {{ valid: boolean, family: string|null, catalog: string|null, reason?: string }}
 */
export function validateCatalogActor(actorCode) {
  const family = matchActorCode(actorCode);
  if (!family) {
    return {
      valid: false,
      family: null,
      catalog: null,
      reason: `Actor code "${actorCode}" does not match any canonical pattern`,
    };
  }
  if (!CATALOG_ACTOR_FAMILIES.includes(family)) {
    return {
      valid: false,
      family,
      catalog: null,
      reason: `Actor family "${family}" is not a cataloged Factory actor`,
    };
  }
  return {
    valid: true,
    family,
    catalog: CATALOG_SOURCE_BY_FAMILY[family],
  };
}

/**
 * @param {string} actorCode
 * @throws {Error}
 */
export function assertCatalogActor(actorCode) {
  const result = validateCatalogActor(actorCode);
  if (!result.valid) {
    throw new Error(`[CB-00 Catalog Guard] ${result.reason}`);
  }
  return result;
}

/**
 * Prohibited in Factory construction scope per PP-08 / IGA-16.
 * @param {string} fieldName
 * @param {unknown} value
 */
export function assertNotAccessTierAssignment(fieldName, value) {
  if (fieldName === "access_tier" && value != null && value !== "standard") {
    throw new Error(
      "[CB-00 Catalog Guard] Factory must not assign access_tier (constitutional boundary)"
    );
  }
}

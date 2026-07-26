/**
 * P-INT-02 Offline — load validated pack → IngestionRequest[] (no buildSourceRef).
 */

import fs from "node:fs";
import path from "node:path";
import {
  resolveEffectiveVintageAt,
  validateRecordedPack,
} from "./recordedPackValidator.js";

/**
 * @param {string} packRoot
 * @param {{
 *   provenanceOverrides?: object,
 * }} [options]
 * @returns {{
 *   ok: true,
 *   factoryKey: string,
 *   requests: object[],
 *   payloadsByOrganism: Record<string, object>,
 *   manifest: object,
 *   provenance: object,
 * } | { ok: false, reason: string }}
 */
export function loadRecordedPackForIngest(packRoot, options = {}) {
  const validated = validateRecordedPack(packRoot);
  if (!validated.ok) return validated;

  const { manifest, provenance, packRoot: root } = validated;
  const overrides = options.provenanceOverrides || {};
  const requests = [];
  const payloadsByOrganism = {};

  for (const entry of manifest.organisms) {
    const vintageAt = resolveEffectiveVintageAt(manifest, entry);
    if (!vintageAt) {
      return {
        ok: false,
        reason: `provenance_insufficient:vintageAt:${entry.organismId}`,
      };
    }

    const rel = String(entry.responsePath).replace(/\\/g, "/");
    const abs = path.join(root, ...rel.split("/"));
    const payload = JSON.parse(fs.readFileSync(abs, "utf8"));
    payloadsByOrganism[entry.organismId] = payload;

    const perOrgProv =
      (provenance.organisms && provenance.organisms[entry.organismId]) || {};

    /** @type {import('../ingestionLegitimacyGate.js').IngestionRequest} */
    const request = {
      organismId: entry.organismId,
      familyId: entry.familyId,
      factoryKey: manifest.factoryKey,
      vintageAt,
      prohibitedFlags:
        overrides.prohibitedFlags ??
        perOrgProv.prohibitedFlags ??
        provenance.prohibitedFlags ??
        [],
      lowConfidenceFlags:
        overrides.lowConfidenceFlags ??
        perOrgProv.lowConfidenceFlags ??
        provenance.lowConfidenceFlags ??
        [],
      piiAuthorized:
        overrides.piiAuthorized ??
        perOrgProv.piiAuthorized ??
        provenance.piiAuthorized,
      conflictDetected:
        overrides.conflictDetected ??
        perOrgProv.conflictDetected ??
        provenance.conflictDetected,
      conflictResolvable:
        overrides.conflictResolvable ??
        perOrgProv.conflictResolvable ??
        provenance.conflictResolvable,
      conflictResolutionStrategy:
        overrides.conflictResolutionStrategy ??
        perOrgProv.conflictResolutionStrategy ??
        provenance.conflictResolutionStrategy,
      targetMpiDomain:
        overrides.targetMpiDomain ??
        perOrgProv.targetMpiDomain ??
        provenance.targetMpiDomain,
    };

    requests.push(Object.freeze({ ...request }));
  }

  return {
    ok: true,
    factoryKey: manifest.factoryKey,
    requests,
    payloadsByOrganism,
    manifest,
    provenance,
  };
}

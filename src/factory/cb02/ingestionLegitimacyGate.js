/**
 * CB-02 — Ingestion Legitimacy Gate
 * Validates provenance before any data enters Factory (no real fetch).
 */

import { assertNoAveraging, resolveConflictPolicy } from "./conflictRules.js";
import { evaluateFreshness } from "./freshnessPolicy.js";
import { labelLowConfidence } from "./lowConfidenceSources.js";
import { detectProhibitedFlags, getProhibitedReason } from "./prohibitedSources.js";
import { buildSourceRef } from "./sourceRef.js";
import { getPilotMappingForDomain } from "./dsoDdiMapping.js";
import { isOrganismProhibited } from "./sourceOrganismsCatalog.js";
import { SourceRegistry } from "./sourceRegistry.js";

/**
 * @typedef {Object} IngestionRequest
 * @property {string} organismId
 * @property {string} [familyId]
 * @property {string} [factoryKey]
 * @property {string} [vintageAt]
 * @property {string[]} [prohibitedFlags]
 * @property {string[]} [lowConfidenceFlags]
 * @property {boolean} [piiAuthorized]
 * @property {boolean} [conflictDetected]
 * @property {boolean} [conflictResolvable]
 * @property {string} [conflictResolutionStrategy]
 * @property {string} [targetMpiDomain]
 */

export class IngestionLegitimacyGate {
  constructor(registry = new SourceRegistry()) {
    this.registry = registry;
  }

  /**
   * @param {IngestionRequest} request
   */
  evaluate(request) {
    if (request.conflictResolutionStrategy) {
      try {
        assertNoAveraging(request.conflictResolutionStrategy);
      } catch (err) {
        return {
          accepted: false,
          rejectionReason: err.message,
          deriveToEvidence: true,
          source_ref: null,
        };
      }
    }

    const organismCheck = this.registry.validateCataloguedOrganism(request.organismId);
    if (!organismCheck.valid) {
      return {
        accepted: false,
        rejectionReason: organismCheck.reason,
        deriveToEvidence: organismCheck.reason === "organism_prohibited",
        source_ref: null,
      };
    }

    const organism = organismCheck.organism;
    if (isOrganismProhibited(organism)) {
      return {
        accepted: false,
        rejectionReason: "organism_prohibited",
        deriveToEvidence: false,
        source_ref: null,
      };
    }

    const prohibited = detectProhibitedFlags(request.prohibitedFlags ?? []);
    if (prohibited.prohibited) {
      return {
        accepted: false,
        rejectionReason: `prohibited_source:${getProhibitedReason(prohibited.codes[0])}`,
        prohibitedCodes: prohibited.codes,
        deriveToEvidence: false,
        source_ref: null,
      };
    }

    if (organism.piiSensitive && organism.contactChannel && request.piiAuthorized !== true) {
      return {
        accepted: false,
        rejectionReason: "pii_contact_not_authorized",
        deriveToEvidence: false,
        source_ref: null,
      };
    }

    let freshness = null;
    if (organism.freshnessProfile) {
      freshness = evaluateFreshness(
        organism.freshnessProfile,
        request.vintageAt ?? new Date().toISOString()
      );
    }

    const lowConf = labelLowConfidence(request.lowConfidenceFlags ?? []);

    const conflict = resolveConflictPolicy({
      conflictDetected: request.conflictDetected === true,
      resolvable: request.conflictResolvable,
    });

    if (conflict.action === "BLOCK") {
      return {
        accepted: false,
        rejectionReason: "unresolved_source_conflict",
        deriveToEvidence: true,
        conflictRule: conflict.rule,
        source_ref: null,
      };
    }

    const targetDomain = request.targetMpiDomain ?? organism.ddiDomains[0];
    const mapping = targetDomain ? getPilotMappingForDomain(targetDomain) : null;

    const source_ref = buildSourceRef({
      organismId: organism.id,
      familyId: request.familyId ?? organism.families[0],
      epistemicLevel: organism.epistemicLevel,
      factoryKey: request.factoryKey ?? null,
      vintageAt: request.vintageAt ?? null,
      ddiDomains: organism.ddiDomains,
      ddiPart: organism.ddiPart,
      freshness,
      complianceFlags: lowConf.lowConfidence ? lowConf.codes : [],
      piiFlags: {
        sensitive: organism.piiSensitive,
        contactChannel: organism.contactChannel,
        authorized: request.piiAuthorized ?? null,
      },
      lowConfidenceFlags: lowConf.codes,
    });

    return {
      accepted: true,
      source_ref,
      freshness,
      lowConfidence: lowConf,
      deriveToEvidence: conflict.deriveToEvidence,
      conflictRule: conflict.rule ?? null,
      pilotMapping: mapping,
    };
  }
}

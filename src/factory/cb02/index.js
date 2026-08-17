export {
  ACCESS_CLASSES,
  EPISTEMIC_LEVELS,
  SOURCE_FAMILIES,
  isAllowedEpistemicLevel,
} from "./sourceTaxonomy.js";

export {
  PROHIBITED_FLAG_CODES,
  PROHIBITED_SOURCE_FLAGS,
  detectProhibitedFlags,
  getProhibitedReason,
} from "./prohibitedSources.js";

export {
  LOW_CONFIDENCE_CODES,
  LOW_CONFIDENCE_FLAGS,
  labelLowConfidence,
} from "./lowConfidenceSources.js";

export {
  CONFLICT_RULES,
  assertNoAveraging,
  resolveConflictPolicy,
} from "./conflictRules.js";

export { FRESHNESS_PROFILES, evaluateFreshness } from "./freshnessPolicy.js";

export {
  PILOT_DDI_PART_I,
  PILOT_DDI_PART_II,
  PILOT_LAYER_12_MAPPING,
  getPilotMappingForDomain,
  verifyOrganismDdiCoverage,
} from "./dsoDdiMapping.js";

export {
  SOURCE_ORGANISMS,
  getOrganism,
  getOrganismsForDomain,
  isOrganismProhibited,
  listOrganisms,
} from "./sourceOrganismsCatalog.js";

export { buildSourceRef, isSourceRef } from "./sourceRef.js";
export { SourceRegistry } from "./sourceRegistry.js";
export { IngestionLegitimacyGate } from "./ingestionLegitimacyGate.js";
export { SourceIngestionLedger, DEFAULT_INGESTION_ROOT } from "./sourceIngestionLedger.js";
export { DsoIngestionService } from "./dsoIngestionService.js";
export { runCb02Validation } from "./validateCb02.js";

/** P-INT-02 Offline — recorded packs + RECORDED_ONLY contracts */
export * from "./connectors/index.js";

/** SP10 — Recorded Discovery */
export {
  processRecordedObservation,
  RECORDED_DISCOVERY_DISPOSITION,
} from "./discovery/recordedDiscoveryPipeline.js";
export { runSp10RecordedDiscoveryValidation } from "./validateSp10RecordedDiscovery.js";

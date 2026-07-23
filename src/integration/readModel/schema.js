/**
 * II.2 Read Model Contract v2 — field allowlists / schema shapes.
 */

import {
  CHECK_STATUSES,
  CONSTITUTIONAL_STATUSES,
  CONTRACT_ID,
  DATA_CLASSIFICATION,
  DIAGNOSTICS_STATUSES,
  DRIFT_SEVERITIES,
  DRIFT_STATUSES,
  ENVIRONMENTS,
  EXPEDIENTE_CLASSIFICATIONS,
  EXPEDIENTE_STATUSES,
  FACTORY_STATUSES,
  HOST_CLASSES,
  INPUT_STATUSES,
  INTEGRITY_ALGORITHM,
  INTEGRITY_CANONICALIZATION,
  MODE,
  OBSERVATION_STATUSES,
  OWNERSHIP_FACTORY,
  OWNERSHIP_GOVERNANCE,
  OWNERSHIP_READ_MODEL,
  OWNERSHIP_REGISTRY,
  REGISTRY_STATUSES,
  SCHEMA_VERSION,
  SOURCE_TYPES,
  WARNING_SCOPES,
  WARNING_SEVERITIES,
} from "./constants.js";

export const ROOT_FIELDS = Object.freeze([
  "contractId",
  "schemaVersion",
  "mode",
  "snapshotId",
  "generatedAt",
  "staleAfter",
  "environment",
  "dataClassification",
  "producer",
  "ownership",
  "sourceProvenance",
  "integrity",
  "observationStatus",
  "factoryObservation",
  "registryObservation",
  "governance",
  "drift",
  "lineage",
  "expedientes",
  "warnings",
  "diagnostics",
]);

export const PRODUCER_FIELDS = Object.freeze([
  "producerId",
  "producerVersion",
  "generatedBy",
  "hostClass",
]);

export const OWNERSHIP_FIELDS = Object.freeze([
  "factory",
  "registry",
  "governance",
  "readModel",
]);

export const SOURCE_PROVENANCE_FIELDS = Object.freeze([
  "sourceType",
  "sourceRevision",
  "observedAt",
  "inputs",
]);

export const SOURCE_INPUT_FIELDS = Object.freeze([
  "sourceId",
  "sourceKind",
  "revision",
  "status",
]);

export const INTEGRITY_FIELDS = Object.freeze([
  "algorithm",
  "canonicalization",
  "checksum",
  "verified",
]);

export const FACTORY_OBSERVATION_FIELDS = Object.freeze([
  "status",
  "phaseRange",
  "implementedPhases",
  "approvedPhases",
  "blockedPhases",
  "runtimeSummary",
]);

export const PHASE_RANGE_FIELDS = Object.freeze(["from", "to"]);

export const RUNTIME_SUMMARY_FIELDS = Object.freeze([
  "motorsObserved",
  "loopsObserved",
  "swarmsObserved",
  "aiAssistantsObserved",
]);

export const REGISTRY_OBSERVATION_FIELDS = Object.freeze([
  "status",
  "registryVersion",
  "entriesObserved",
  "lastObservedAt",
]);

export const GOVERNANCE_FIELDS = Object.freeze([
  "constitutionalStatus",
  "approvedBy",
  "approvedAt",
  "activeBlock",
  "blockedBlocks",
  "parking",
]);

export const DRIFT_FIELDS = Object.freeze(["status", "items"]);

export const DRIFT_ITEM_FIELDS = Object.freeze([
  "code",
  "severity",
  "area",
  "expected",
  "observed",
]);

export const LINEAGE_FIELDS = Object.freeze([
  "previousSnapshotId",
  "parentSnapshotId",
  "generationSequence",
  "sourceRevision",
]);

export const EXPEDIENTE_FIELDS = Object.freeze([
  "expedienteId",
  "classification",
  "status",
  "identityVerified",
  "valueVerified",
  "pricingVerified",
  "offMarket",
  "ownerVerified",
  "commercializationAuthorized",
  "evidenceRefs",
  "warningCodes",
]);

export const WARNING_FIELDS = Object.freeze([
  "code",
  "severity",
  "scope",
  "message",
  "expedienteId",
]);

export const DIAGNOSTICS_FIELDS = Object.freeze([
  "status",
  "summary",
  "checks",
]);

export const DIAGNOSTIC_CHECK_FIELDS = Object.freeze([
  "checkId",
  "status",
  "message",
]);

export const SCHEMA_META = Object.freeze({
  contractId: CONTRACT_ID,
  schemaVersion: SCHEMA_VERSION,
  mode: MODE,
  dataClassification: DATA_CLASSIFICATION,
  environments: ENVIRONMENTS,
  observationStatuses: OBSERVATION_STATUSES,
  hostClasses: HOST_CLASSES,
  sourceTypes: SOURCE_TYPES,
  inputStatuses: INPUT_STATUSES,
  factoryStatuses: FACTORY_STATUSES,
  registryStatuses: REGISTRY_STATUSES,
  constitutionalStatuses: CONSTITUTIONAL_STATUSES,
  driftStatuses: DRIFT_STATUSES,
  driftSeverities: DRIFT_SEVERITIES,
  expedienteClassifications: EXPEDIENTE_CLASSIFICATIONS,
  expedienteStatuses: EXPEDIENTE_STATUSES,
  warningSeverities: WARNING_SEVERITIES,
  warningScopes: WARNING_SCOPES,
  diagnosticsStatuses: DIAGNOSTICS_STATUSES,
  checkStatuses: CHECK_STATUSES,
  ownershipFactory: OWNERSHIP_FACTORY,
  ownershipRegistry: OWNERSHIP_REGISTRY,
  ownershipGovernance: OWNERSHIP_GOVERNANCE,
  ownershipReadModel: OWNERSHIP_READ_MODEL,
  integrityAlgorithm: INTEGRITY_ALGORITHM,
  integrityCanonicalization: INTEGRITY_CANONICALIZATION,
  rootFields: ROOT_FIELDS,
});

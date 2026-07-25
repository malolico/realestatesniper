/**
 * Factory Integration — Block I.1
 * Observability edge contract (READ_ONLY).
 *
 * Not part of Factory constitutional CB-00…CB-19.
 * PROPUESTA/IMPLEMENTACIÓN autorizada: borde externo únicamente.
 */

export const SCHEMA_VERSION = "1.0.0";

export const OBSERVABILITY_MODE = "READ_ONLY";

/** Explicit allowlist of Factory modules this edge may import (read-side only). */
export const FACTORY_IMPORT_ALLOWLIST = Object.freeze([
  "src/factory/cb00/constructionGovernance.js (loadPhaseStatus, CONSTRUCTION_PHASES, getPhaseRecord — read JSON only)",
  "src/factory/cb01/fileElrStore.js (DEFAULT_REGISTRY_ROOT path constant — no ensureDirs)",
  "src/factory/cb01/factoryRegistry.js (FactoryRegistry.getExpediente only — no list/create/write)",
  "src/factory/cb15/elrAggregator.js (aggregateElr — pure section counts)",
  "src/factory/cb18/maturityMetrics.js (buildMaturityMetrics — pure)",
  "src/factory/cb18/compliancePanel.js (buildCompliancePanel — pure)",
  "src/factory/cb18/coveragePanel.js (buildCoveragePanel — pure)",
  "src/factory/cb18/canonDriftDetector.js (detectCanonDrift — pure)",
  "src/factory/cb18/governanceDashboard.js (buildConstitutionalMetrics — pure constants)",
]);

/** Symbols / modules this edge must never import or invoke. */
export const FACTORY_IMPORT_DENYLIST = Object.freeze([
  "OrchestrationBusService",
  "orchestrateExpediente",
  "recordElrAggregation",
  "recordBusEvent",
  "DecisionHandoffService",
  "prepareAndDeliver",
  "RetirementService",
  "enterWatchMode",
  "MotorRuntime",
  "registerElrAct",
  "createExpediente",
  "transitionState",
  "listExpedientes",
  "FileElrStore.ensureDirs",
  "FileElrStore.write",
  "FileElrStore.listFactoryKeys",
  "assertDeploymentGate",
  "runCb19Validation",
]);

export const EMPTY_CONTRACT_SHELL = Object.freeze({
  schemaVersion: SCHEMA_VERSION,
  mode: OBSERVABILITY_MODE,
  factory: {
    available: false,
    constitutionalPhaseSpan: {
      from: "CB-00",
      to: "CB-19",
      approvedCount: 0,
      totalCount: 20,
    },
  },
  elrHealth: {
    available: false,
    empty: true,
    expedienteCount: 0,
    status: "MISSING_OR_EMPTY",
  },
  expedientes: [],
  governance: {
    maturity: {},
    compliance: {},
    coverage: {},
    canonDrift: {},
  },
  lineage: {
    eventKinds: [],
  },
  warnings: [],
});

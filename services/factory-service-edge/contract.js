import { DATA_CLASSIFICATION } from "../../src/integration/readModel/constants.js";

export const FACTORY_SERVICE_EDGE_CONTRACT_ID = "factory.service_edge.read";
export const FACTORY_SERVICE_EDGE_API_VERSION = "1.0.0";
export const FACTORY_SERVICE_EDGE_MODE = "READ_ONLY";
export const FACTORY_SERVICE_EDGE_CLASSIFICATION = DATA_CLASSIFICATION;

export const FACTORY_EDGE_ROLES = Object.freeze(["FACTORY_OPS", "FACTORY_DIRECTOR"]);

export const FACTORY_EDGE_CAPABILITIES = Object.freeze({
  READINESS: "factory.read.readiness",
  REGISTRY: "factory.read.registry",
  ELR_SUMMARY: "factory.read.elr_summary",
  GOVERNANCE: "factory.read.governance",
});

export const FACTORY_EDGE_STATUS = Object.freeze([
  "HEALTHY",
  "DEGRADED",
  "PARTIAL",
  "UNAVAILABLE",
  "INVALID",
]);

export const FACTORY_EDGE_ERROR_CODES = Object.freeze({
  UNAUTHENTICATED: "UNAUTHENTICATED",
  FORBIDDEN: "FORBIDDEN",
  NOT_FOUND: "NOT_FOUND",
  VALIDATION_FAIL: "VALIDATION_FAIL",
  RATE_LIMITED: "RATE_LIMITED",
  NOT_READY: "NOT_READY",
  INTERNAL_ERROR: "INTERNAL_ERROR",
});

function deepFreeze(value) {
  if (!value || typeof value !== "object" || Object.isFrozen(value)) {
    return value;
  }
  Object.freeze(value);
  for (const key of Object.keys(value)) {
    deepFreeze(value[key]);
  }
  return value;
}

export const FACTORY_EDGE_ROUTE_SPECS = deepFreeze({
  health: {
    method: "GET",
    path: "/v1/factory/health",
    authenticated: false,
    capability: null,
    roles: [],
    classification: null,
    maxQueryKeys: [],
  },
  readiness: {
    method: "GET",
    path: "/v1/factory/readiness",
    authenticated: true,
    capability: FACTORY_EDGE_CAPABILITIES.READINESS,
    roles: FACTORY_EDGE_ROLES,
    classification: FACTORY_SERVICE_EDGE_CLASSIFICATION,
    maxQueryKeys: [],
  },
  registrySummary: {
    method: "GET",
    path: "/v1/factory/registry/summary",
    authenticated: true,
    capability: FACTORY_EDGE_CAPABILITIES.REGISTRY,
    roles: FACTORY_EDGE_ROLES,
    classification: FACTORY_SERVICE_EDGE_CLASSIFICATION,
    maxQueryKeys: [],
  },
  elrSummary: {
    method: "GET",
    path: "/v1/factory/elr/summary",
    authenticated: true,
    capability: FACTORY_EDGE_CAPABILITIES.ELR_SUMMARY,
    roles: FACTORY_EDGE_ROLES,
    classification: FACTORY_SERVICE_EDGE_CLASSIFICATION,
    maxQueryKeys: [],
  },
  governanceDashboard: {
    method: "GET",
    path: "/v1/factory/governance/dashboard",
    authenticated: true,
    capability: FACTORY_EDGE_CAPABILITIES.GOVERNANCE,
    roles: FACTORY_EDGE_ROLES,
    classification: FACTORY_SERVICE_EDGE_CLASSIFICATION,
    maxQueryKeys: [],
  },
  governanceDrift: {
    method: "GET",
    path: "/v1/factory/governance/drift",
    authenticated: true,
    capability: FACTORY_EDGE_CAPABILITIES.GOVERNANCE,
    roles: FACTORY_EDGE_ROLES,
    classification: FACTORY_SERVICE_EDGE_CLASSIFICATION,
    maxQueryKeys: [],
  },
  governanceCompliance: {
    method: "GET",
    path: "/v1/factory/governance/compliance",
    authenticated: true,
    capability: FACTORY_EDGE_CAPABILITIES.GOVERNANCE,
    roles: FACTORY_EDGE_ROLES,
    classification: FACTORY_SERVICE_EDGE_CLASSIFICATION,
    maxQueryKeys: [],
  },
  governanceMaturity: {
    method: "GET",
    path: "/v1/factory/governance/maturity",
    authenticated: true,
    capability: FACTORY_EDGE_CAPABILITIES.GOVERNANCE,
    roles: FACTORY_EDGE_ROLES,
    classification: FACTORY_SERVICE_EDGE_CLASSIFICATION,
    maxQueryKeys: [],
  },
});

export const FACTORY_EDGE_GOVERNANCE_ALLOWLISTS = deepFreeze({
  dashboard: {
    maturity: [
      "maturityScore",
      "source",
      "rule",
      "g0g6Reproducible",
      "bands",
      "gates",
    ],
    maturityBands: ["completeness", "sufficiency", "readiness", "cGlobal", "stateBonus"],
    maturityGates: ["available", "allPass", "passCount", "gateCount", "reproducible"],
    compliance: [
      "healthy",
      "p0Status",
      "prhZero",
      "prhViolationCount",
      "cmpBlockCount",
      "alertCount",
      "alertTypes",
    ],
    coverage: ["motors", "loops", "swarms", "aia", "elrSections"],
    coverageSections: [
      "state_transitions",
      "motor_manifests",
      "loop_ledger_refs",
      "swarm_mission_refs",
      "aia_rlg_refs",
      "conflict_resolutions",
      "decision_handoffs",
      "factory_key_history",
    ],
    canonDrift: [
      "driftDetected",
      "blockDeployment",
      "driftCount",
      "actorsScanned",
      "documentedExceptionCount",
    ],
    constitutional: [
      "ppCount",
      "lffCount",
      "pConstCount",
      "ffoLawsCount",
      "omcMotorsConstitutional",
    ],
  },
  compliance: {
    summary: [
      "healthy",
      "p0Status",
      "prhZero",
      "prhViolationCount",
      "cmpBlockCount",
      "alertCount",
      "alertTypes",
    ],
    items: ["code", "status", "count", "operational"],
  },
  drift: ["code", "severity", "message"],
  maturity: {
    bands: ["completeness", "sufficiency", "readiness", "cGlobal", "stateBonus"],
    coverageHints: ["available", "allPass", "passCount", "gateCount", "reproducible"],
  },
});

export function buildSuccessEnvelope({
  correlationId,
  generatedAt,
  observationStatus,
  payload,
  warnings = [],
}) {
  return {
    apiVersion: FACTORY_SERVICE_EDGE_API_VERSION,
    contractId: FACTORY_SERVICE_EDGE_CONTRACT_ID,
    mode: FACTORY_SERVICE_EDGE_MODE,
    dataClassification: FACTORY_SERVICE_EDGE_CLASSIFICATION,
    correlationId,
    generatedAt,
    observationStatus,
    payload,
    warnings,
  };
}

export function buildErrorEnvelope(code, message, correlationId) {
  return {
    apiVersion: FACTORY_SERVICE_EDGE_API_VERSION,
    error: {
      code,
      message,
      correlationId,
    },
  };
}

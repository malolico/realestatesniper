/**
 * P-INT-01 Slice B — Orchestration Control Plane contracts (B1).
 * Staging-only command surface. MUST NOT merge with factory.service_edge.read.
 */

import { DATA_CLASSIFICATION } from "../../src/integration/readModel/constants.js";

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

export const FACTORY_ORCHESTRATION_CONTRACT_ID = "factory.service_edge.command";
export const FACTORY_ORCHESTRATION_API_VERSION = "1.0.0";
export const FACTORY_ORCHESTRATION_MODE = "STAGING";
export const FACTORY_ORCHESTRATION_CLASSIFICATION = DATA_CLASSIFICATION;

/** Slice A read contract — MUST NOT be reused for mutations. */
export const FACTORY_SERVICE_EDGE_READ_CONTRACT_ID = "factory.service_edge.read";

export const FACTORY_ORCHESTRATION_ROLES = Object.freeze([
  "FACTORY_OPS",
  "FACTORY_DIRECTOR",
]);

export const FACTORY_ORCHESTRATION_CAPABILITIES = Object.freeze({
  ORCHESTRATE: "factory.command.orchestrate",
  JOB_READ: "factory.command.job.read",
  JOB_LINEAGE: "factory.command.job.lineage",
});

export const FACTORY_ORCHESTRATION_COMMANDS = Object.freeze({
  ORCHESTRATE_EXPEDIENTE: "orchestrateExpediente",
});

export const FACTORY_ORCHESTRATION_ERROR_CODES = Object.freeze({
  UNAUTHENTICATED: "UNAUTHENTICATED",
  FORBIDDEN: "FORBIDDEN",
  NOT_FOUND: "NOT_FOUND",
  VALIDATION_FAIL: "VALIDATION_FAIL",
  CONFLICT: "CONFLICT",
  RATE_LIMITED: "RATE_LIMITED",
  BOUNDARY_REJECTED: "BOUNDARY_REJECTED",
  PAYLOAD_TOO_LARGE: "PAYLOAD_TOO_LARGE",
  INTERNAL_ERROR: "INTERNAL_ERROR",
});

export const FACTORY_ORCHESTRATION_HTTP_STATUS = Object.freeze({
  OK: 200,
  ACCEPTED: 202,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  /** HQ-06 — Mandate D06-2 oversize body */
  PAYLOAD_TOO_LARGE: 413,
  TOO_MANY_REQUESTS: 429,
  INTERNAL: 500,
});

/** HQ-06 — Mandate D06-1: max request body size (inclusive), bytes. */
export const FACTORY_ORCHESTRATION_MAX_BODY_BYTES = 65536;

/**
 * Official HTTP route specs (Plan §5.3 / parent §18).
 * Paths with `{jobId}` are templates — no runtime binding in B1.
 */
export const FACTORY_ORCHESTRATION_ROUTE_SPECS = deepFreeze({
  submitJob: {
    method: "POST",
    path: "/v1/factory/orchestration/jobs",
    authenticated: true,
    capability: FACTORY_ORCHESTRATION_CAPABILITIES.ORCHESTRATE,
    roles: FACTORY_ORCHESTRATION_ROLES,
    classification: FACTORY_ORCHESTRATION_CLASSIFICATION,
    requiresIdempotencyKey: true,
    successStatus: FACTORY_ORCHESTRATION_HTTP_STATUS.ACCEPTED,
  },
  getJob: {
    method: "GET",
    path: "/v1/factory/orchestration/jobs/{jobId}",
    authenticated: true,
    capability: FACTORY_ORCHESTRATION_CAPABILITIES.JOB_READ,
    roles: FACTORY_ORCHESTRATION_ROLES,
    classification: FACTORY_ORCHESTRATION_CLASSIFICATION,
    requiresIdempotencyKey: false,
    successStatus: FACTORY_ORCHESTRATION_HTTP_STATUS.OK,
  },
  getJobLineage: {
    method: "GET",
    path: "/v1/factory/orchestration/jobs/{jobId}/lineage",
    authenticated: true,
    capability: FACTORY_ORCHESTRATION_CAPABILITIES.JOB_LINEAGE,
    roles: FACTORY_ORCHESTRATION_ROLES,
    classification: FACTORY_ORCHESTRATION_CLASSIFICATION,
    requiresIdempotencyKey: false,
    successStatus: FACTORY_ORCHESTRATION_HTTP_STATUS.OK,
  },
  cancelJob: {
    method: "POST",
    path: "/v1/factory/orchestration/jobs/{jobId}/cancel",
    authenticated: true,
    capability: FACTORY_ORCHESTRATION_CAPABILITIES.ORCHESTRATE,
    roles: FACTORY_ORCHESTRATION_ROLES,
    classification: FACTORY_ORCHESTRATION_CLASSIFICATION,
    requiresIdempotencyKey: false,
    successStatus: FACTORY_ORCHESTRATION_HTTP_STATUS.OK,
  },
});

/** Allowlisted keys for optional submit `hints` — unknown keys fail-closed. */
export const FACTORY_ORCHESTRATION_HINTS_ALLOWLIST = Object.freeze([]);

/**
 * Allowlisted keys for job `resultSummary` — no raw ELR / Decision Package.
 * Field set may grow in B3 within these constraints.
 */
export const FACTORY_ORCHESTRATION_RESULT_SUMMARY_ALLOWLIST = Object.freeze([
  "factoryKey",
  "orchestrationStatus",
  "summaryCode",
]);

/**
 * Allowlisted keys for lineage summary responses (OBS-R1 / B3 detail).
 */
export const FACTORY_ORCHESTRATION_LINEAGE_SUMMARY_ALLOWLIST = Object.freeze([
  "jobId",
  "factoryKey",
  "state",
  "eventCount",
]);

/**
 * @param {object} params
 * @param {string} params.correlationId
 * @param {string} params.generatedAt
 * @param {string} params.capability
 * @param {object} [params.actor]
 * @param {object} [params.result]
 * @param {string[]} [params.warnings]
 */
export function buildCommandSuccessEnvelope({
  correlationId,
  generatedAt,
  capability,
  actor = null,
  result,
  warnings = [],
}) {
  return {
    schemaVersion: FACTORY_ORCHESTRATION_API_VERSION,
    contractId: FACTORY_ORCHESTRATION_CONTRACT_ID,
    mode: FACTORY_ORCHESTRATION_MODE,
    dataClassification: FACTORY_ORCHESTRATION_CLASSIFICATION,
    correlationId,
    generatedAt,
    actor,
    capability,
    result,
    warnings,
  };
}

/**
 * @param {string} code
 * @param {string} message
 * @param {string} correlationId
 * @param {string} [capability]
 */
export function buildCommandErrorEnvelope(code, message, correlationId, capability = null) {
  return {
    schemaVersion: FACTORY_ORCHESTRATION_API_VERSION,
    contractId: FACTORY_ORCHESTRATION_CONTRACT_ID,
    mode: FACTORY_ORCHESTRATION_MODE,
    dataClassification: FACTORY_ORCHESTRATION_CLASSIFICATION,
    correlationId,
    capability,
    error: {
      code,
      message,
      correlationId,
    },
  };
}

export function assertCommandContractNotReadContract() {
  if (FACTORY_ORCHESTRATION_CONTRACT_ID === FACTORY_SERVICE_EDGE_READ_CONTRACT_ID) {
    throw new Error("Command contract MUST NOT equal read contract");
  }
}

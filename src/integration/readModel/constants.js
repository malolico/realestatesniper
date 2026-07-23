/**
 * II.2 Read Model Contract v2 — constants and quotas.
 * Source of truth: FACTORY_INTEGRATION_II_2_READ_MODEL_CONTRACT_V2_SPECIFICATION.md
 */

export const CONTRACT_ID = "factory.observability.read_model";
export const SCHEMA_VERSION = "2.0.0";
export const MODE = "READ_ONLY";
export const DATA_CLASSIFICATION = "INTERNAL_OPS";

export const ENVIRONMENTS = Object.freeze([
  "development",
  "test",
  "staging",
  "production",
  "unknown",
]);

export const OBSERVATION_STATUSES = Object.freeze([
  "HEALTHY",
  "DEGRADED",
  "PARTIAL",
  "UNAVAILABLE",
  "INVALID",
]);

export const HOST_CLASSES = Object.freeze(["local", "server", "ci", "unknown"]);

export const SOURCE_TYPES = Object.freeze([
  "LOCAL_FILES",
  "FACTORY_RUNTIME",
  "REGISTRY",
  "COMPOSITE",
]);

export const INPUT_STATUSES = Object.freeze([
  "AVAILABLE",
  "PARTIAL",
  "ABSENT",
  "INVALID",
]);

export const FACTORY_STATUSES = Object.freeze([
  "AVAILABLE",
  "PARTIAL",
  "UNAVAILABLE",
  "INVALID",
]);

export const REGISTRY_STATUSES = Object.freeze([
  "AVAILABLE",
  "PARTIAL",
  "ABSENT",
  "INVALID",
]);

export const CONSTITUTIONAL_STATUSES = Object.freeze([
  "COMPLIANT",
  "DEGRADED",
  "NON_COMPLIANT",
  "UNKNOWN",
]);

export const DRIFT_STATUSES = Object.freeze(["NONE", "DETECTED", "UNKNOWN"]);

export const DRIFT_SEVERITIES = Object.freeze(["INFO", "WARNING", "ERROR"]);

export const EXPEDIENTE_CLASSIFICATIONS = Object.freeze([
  "DEAL",
  "PREMIUM",
  "DIAMOND",
  "UNCLASSIFIED",
]);

export const EXPEDIENTE_STATUSES = Object.freeze([
  "OBSERVED",
  "PARTIAL",
  "BLOCKED",
  "INVALID",
]);

export const WARNING_SEVERITIES = Object.freeze(["INFO", "WARNING", "ERROR"]);

export const WARNING_SCOPES = Object.freeze([
  "SNAPSHOT",
  "FACTORY",
  "REGISTRY",
  "GOVERNANCE",
  "EXPEDIENTE",
]);

export const BASELINE_WARNING_CODES = Object.freeze([
  "SNAPSHOT_STALE",
  "SOURCE_PARTIAL",
  "REGISTRY_ABSENT",
  "INTEGRITY_UNVERIFIED",
  "EXPEDIENTES_TRUNCATED",
  "DIAGNOSTICS_TRUNCATED",
  "DRIFT_DETECTED",
  "LINEAGE_INCOMPLETE",
]);

export const DIAGNOSTICS_STATUSES = Object.freeze([
  "AVAILABLE",
  "PARTIAL",
  "DISABLED",
]);

export const CHECK_STATUSES = Object.freeze(["PASS", "WARN", "FAIL", "SKIP"]);

export const OWNERSHIP_FACTORY = "FACTORY";
export const OWNERSHIP_REGISTRY = Object.freeze(["REGISTRY", "ABSENT"]);
export const OWNERSHIP_GOVERNANCE = "DOCUMENTATION";
export const OWNERSHIP_READ_MODEL = "INTEGRATION";

export const INTEGRITY_ALGORITHM = "SHA-256";
export const INTEGRITY_CANONICALIZATION = "JCS";

/** II.2-IMPL explicit quotas (semantics unchanged). */
export const QUOTAS = Object.freeze({
  MAX_PAYLOAD_BYTES: 512 * 1024,
  MAX_EXPEDIENTES: 100,
  MAX_WARNINGS: 50,
  MAX_DIAGNOSTICS_CHECKS: 50,
  MAX_STRING_LENGTH: 2048,
  MAX_OBJECT_DEPTH: 8,
  MAX_ARRAY_DEPTH: 8,
});

export const PROHIBITED_ROOT_NAMES = Object.freeze([
  "contractName",
  "records",
]);

export const PROHIBITED_WARNING_CODES = Object.freeze(["RECORDS_TRUNCATED"]);

export const PROHIBITED_FIELD_NAME_PATTERNS = Object.freeze([
  /^password$/i,
  /^secret$/i,
  /^token$/i,
  /^api[_-]?key$/i,
  /^authorization$/i,
  /^access[_-]?token$/i,
  /^refresh[_-]?token$/i,
  /^private[_-]?key$/i,
  /^env$/i,
  /^environmentVariables$/i,
  /^stack$/i,
  /^stackTrace$/i,
  /^stack_trace$/i,
]);

export const ABSOLUTE_PATH_RE =
  /(?:^[A-Za-z]:[\\/]|^[\\/]{1,2}[^\\/]|\/Users\/|\/home\/|C:\\Users\\)/i;
export const STACK_TRACE_RE = /\bat\s+\S+\s+\([^)]+:\d+:\d+\)/;
export const SECRETISH_VALUE_RE =
  /(?:sk_live_|sk_test_|Bearer\s+[A-Za-z0-9\-._~+/]+=*|eyJ[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+)/;

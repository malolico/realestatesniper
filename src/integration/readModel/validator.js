/**
 * II.2 Read Model Contract v2 — fail-closed validator.
 */

import { canonicalize } from "./canonicalize.js";
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
  MODE,
  OBSERVATION_STATUSES,
  QUOTAS,
  REGISTRY_STATUSES,
  SCHEMA_VERSION,
  SOURCE_TYPES,
  WARNING_SCOPES,
  WARNING_SEVERITIES,
} from "./constants.js";
import { collectDepthViolations } from "./depth.js";
import { verifyChecksum } from "./integrity.js";
import {
  collectInvariantViolations,
  evaluateFreshness,
  isRfc3339,
} from "./invariants.js";
import { sanitizeToV2 } from "./sanitizer.js";

/**
 * @typedef {{ ok: true, value: object, freshness: string, canonical: string }} ValidationSuccess
 * @typedef {{ ok: false, errors: string[], code: string }} ValidationFailure
 */

function fail(code, errors) {
  return { ok: false, code, errors: [...errors] };
}

function requireEnum(value, allowed, path, errors) {
  if (!allowed.includes(value)) {
    errors.push(`${path} has invalid enum value: ${String(value)}`);
  }
}

function requireBool(value, path, errors) {
  if (typeof value !== "boolean") {
    errors.push(`${path} must be boolean`);
  }
}

/**
 * Validate a candidate payload against Read Model Contract v2.
 * Fail-closed: any violation returns ok=false.
 *
 * @param {unknown} candidate
 * @param {{ now?: Date|number|string, requireVerifiedChecksum?: boolean }} [options]
 * @returns {ValidationSuccess|ValidationFailure}
 */
export function validateReadModelV2(candidate, options = {}) {
  const errors = [];

  // 1–2 parse / root type
  if (candidate === null || typeof candidate !== "object" || Array.isArray(candidate)) {
    return fail("PARSE", ["Payload must be a JSON object"]);
  }

  // Depth quotas on raw candidate (DoS / structure bounds)
  const depthErrors = collectDepthViolations(candidate);
  if (depthErrors.length > 0) {
    return fail("DEPTH", depthErrors);
  }

  // Sanitization + unknown-field rejection (allowlist)
  const sanitized = sanitizeToV2(candidate);
  if (!sanitized.ok) {
    return fail(sanitized.error.code || "SANITIZE", [
      sanitized.error.message,
      ...(sanitized.error.details || []),
    ]);
  }
  const value = sanitized.value;

  // 3–5 identity / version / required already enforced by sanitizer allowlist
  if (value.contractId !== CONTRACT_ID) {
    errors.push(`contractId must equal ${CONTRACT_ID}`);
  }
  if (value.schemaVersion !== SCHEMA_VERSION) {
    errors.push(`schemaVersion must equal ${SCHEMA_VERSION}`);
  }
  if (value.mode !== MODE) {
    errors.push(`mode must equal ${MODE}`);
  }
  if (value.dataClassification !== DATA_CLASSIFICATION) {
    errors.push(`dataClassification must equal ${DATA_CLASSIFICATION}`);
  }

  // 7 enums
  requireEnum(value.environment, ENVIRONMENTS, "environment", errors);
  requireEnum(
    value.observationStatus,
    OBSERVATION_STATUSES,
    "observationStatus",
    errors
  );
  requireEnum(value.producer.hostClass, HOST_CLASSES, "producer.hostClass", errors);
  requireEnum(
    value.sourceProvenance.sourceType,
    SOURCE_TYPES,
    "sourceProvenance.sourceType",
    errors
  );
  for (const [i, input] of value.sourceProvenance.inputs.entries()) {
    requireEnum(
      input.status,
      INPUT_STATUSES,
      `sourceProvenance.inputs[${i}].status`,
      errors
    );
  }
  requireEnum(
    value.factoryObservation.status,
    FACTORY_STATUSES,
    "factoryObservation.status",
    errors
  );
  requireEnum(
    value.registryObservation.status,
    REGISTRY_STATUSES,
    "registryObservation.status",
    errors
  );
  requireEnum(
    value.governance.constitutionalStatus,
    CONSTITUTIONAL_STATUSES,
    "governance.constitutionalStatus",
    errors
  );
  requireEnum(value.drift.status, DRIFT_STATUSES, "drift.status", errors);
  for (const [i, item] of value.drift.items.entries()) {
    requireEnum(
      item.severity,
      DRIFT_SEVERITIES,
      `drift.items[${i}].severity`,
      errors
    );
  }
  for (const [i, exp] of value.expedientes.entries()) {
    requireEnum(
      exp.classification,
      EXPEDIENTE_CLASSIFICATIONS,
      `expedientes[${i}].classification`,
      errors
    );
    requireEnum(
      exp.status,
      EXPEDIENTE_STATUSES,
      `expedientes[${i}].status`,
      errors
    );
    requireBool(exp.identityVerified, `expedientes[${i}].identityVerified`, errors);
    requireBool(exp.valueVerified, `expedientes[${i}].valueVerified`, errors);
    requireBool(exp.pricingVerified, `expedientes[${i}].pricingVerified`, errors);
    requireBool(exp.offMarket, `expedientes[${i}].offMarket`, errors);
    requireBool(exp.ownerVerified, `expedientes[${i}].ownerVerified`, errors);
    requireBool(
      exp.commercializationAuthorized,
      `expedientes[${i}].commercializationAuthorized`,
      errors
    );
  }
  for (const [i, w] of value.warnings.entries()) {
    requireEnum(w.severity, WARNING_SEVERITIES, `warnings[${i}].severity`, errors);
    requireEnum(w.scope, WARNING_SCOPES, `warnings[${i}].scope`, errors);
  }
  requireEnum(
    value.diagnostics.status,
    DIAGNOSTICS_STATUSES,
    "diagnostics.status",
    errors
  );
  for (const [i, c] of value.diagnostics.checks.entries()) {
    requireEnum(
      c.status,
      CHECK_STATUSES,
      `diagnostics.checks[${i}].status`,
      errors
    );
  }

  // 8 timestamps
  if (!isRfc3339(value.generatedAt)) errors.push("generatedAt must be RFC3339");
  if (!isRfc3339(value.staleAfter)) errors.push("staleAfter must be RFC3339");
  if (!isRfc3339(value.sourceProvenance.observedAt)) {
    errors.push("sourceProvenance.observedAt must be RFC3339");
  }
  if (
    value.registryObservation.lastObservedAt !== null &&
    !isRfc3339(value.registryObservation.lastObservedAt)
  ) {
    errors.push("registryObservation.lastObservedAt must be RFC3339 or null");
  }
  if (
    value.governance.approvedAt !== null &&
    !isRfc3339(value.governance.approvedAt)
  ) {
    errors.push("governance.approvedAt must be RFC3339 or null");
  }

  // 9 invariants (incl. ownership/registry coherence, phases, warning catalog)
  errors.push(...collectInvariantViolations(value));

  // 11 quotas
  if (value.expedientes.length > QUOTAS.MAX_EXPEDIENTES) {
    errors.push("expedientes exceed MAX_EXPEDIENTES");
  }
  if (value.warnings.length > QUOTAS.MAX_WARNINGS) {
    errors.push("warnings exceed MAX_WARNINGS");
  }
  if (value.diagnostics.checks.length > QUOTAS.MAX_DIAGNOSTICS_CHECKS) {
    errors.push("diagnostics.checks exceed MAX_DIAGNOSTICS_CHECKS");
  }

  let canonical;
  try {
    canonical = canonicalize(value);
  } catch (e) {
    return fail("CANONICALIZE", [e.message]);
  }
  if (Buffer.byteLength(canonical, "utf8") > QUOTAS.MAX_PAYLOAD_BYTES) {
    errors.push("payload exceeds MAX_PAYLOAD_BYTES");
  }

  // 13 checksum verification
  const checksum = verifyChecksum(value);
  if (!checksum.ok) {
    errors.push(
      `integrity checksum mismatch (expected ${checksum.expected}, got ${checksum.actual})`
    );
  }
  if (options.requireVerifiedChecksum && value.integrity.verified !== true) {
    errors.push("integrity.verified must be true when required");
  }

  // INVALID observationStatus must not be treated as publishable to normal consumers
  if (value.observationStatus === "INVALID") {
    errors.push("observationStatus INVALID is not publishable");
  }

  // Freshness + SNAPSHOT_STALE requirement (§12)
  const freshness = evaluateFreshness(value, options.now);
  if (freshness === "invalid") {
    errors.push("Freshness evaluation invalid");
  } else if (freshness === "stale") {
    const hasStaleWarning = value.warnings.some((w) => w.code === "SNAPSHOT_STALE");
    if (!hasStaleWarning) {
      errors.push("stale snapshot requires warning code SNAPSHOT_STALE");
    }
  }

  if (errors.length > 0) {
    return fail("VALIDATION", errors);
  }

  return {
    ok: true,
    value,
    freshness,
    canonical,
  };
}

/**
 * Convenience: true only when validation succeeds.
 * @param {unknown} candidate
 * @param {object} [options]
 */
export function isValidReadModelV2(candidate, options) {
  return validateReadModelV2(candidate, options).ok === true;
}

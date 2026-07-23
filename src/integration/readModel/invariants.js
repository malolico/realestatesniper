/**
 * II.2 cross-field invariants and freshness helpers.
 */

import {
  BASELINE_WARNING_CODES,
  CONTRACT_ID,
  DATA_CLASSIFICATION,
  MODE,
  PHASE_ID_RE,
  SCHEMA_VERSION,
} from "./constants.js";

const RFC3339_RE =
  /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d+)?(?:Z|[+-]\d{2}:\d{2})$/;

/**
 * @param {string} value
 * @returns {boolean}
 */
export function isRfc3339(value) {
  if (typeof value !== "string" || !RFC3339_RE.test(value)) return false;
  const ms = Date.parse(value);
  return Number.isFinite(ms);
}

/**
 * @param {string} value
 * @returns {boolean}
 */
export function isApprovedPhaseId(value) {
  return typeof value === "string" && PHASE_ID_RE.test(value);
}

/**
 * @param {string} a
 * @param {string} b
 * @returns {boolean}
 */
export function isTimestampOrderValid(a, b) {
  if (!isRfc3339(a) || !isRfc3339(b)) return false;
  return Date.parse(a) <= Date.parse(b);
}

/**
 * @param {{ generatedAt: string, staleAfter: string }} snapshot
 * @param {Date|number|string} [now]
 * @returns {"fresh"|"stale"|"invalid"}
 */
export function evaluateFreshness(snapshot, now = Date.now()) {
  const generatedAt = snapshot?.generatedAt;
  const staleAfter = snapshot?.staleAfter;
  if (!isTimestampOrderValid(generatedAt, staleAfter)) return "invalid";
  const nowMs =
    typeof now === "number"
      ? now
      : now instanceof Date
        ? now.getTime()
        : Date.parse(now);
  if (!Number.isFinite(nowMs)) return "invalid";
  return nowMs <= Date.parse(staleAfter) ? "fresh" : "stale";
}

/**
 * @param {object} payload
 * @returns {string[]}
 */
export function collectInvariantViolations(payload) {
  const errors = [];

  if (payload?.contractId !== CONTRACT_ID) {
    errors.push(`contractId must be ${CONTRACT_ID}`);
  }
  if (payload?.schemaVersion !== SCHEMA_VERSION) {
    errors.push(`schemaVersion must be ${SCHEMA_VERSION}`);
  }
  if (payload?.mode !== MODE) {
    errors.push(`mode must be ${MODE}`);
  }
  if (payload?.dataClassification !== DATA_CLASSIFICATION) {
    errors.push(`dataClassification must be ${DATA_CLASSIFICATION}`);
  }
  if (typeof payload?.snapshotId !== "string" || payload.snapshotId.length === 0) {
    errors.push("snapshotId must be a non-empty string");
  }
  if (!Array.isArray(payload?.expedientes)) {
    errors.push("expedientes must be an array");
  }
  if (!isTimestampOrderValid(payload?.generatedAt, payload?.staleAfter)) {
    errors.push("generatedAt must be <= staleAfter and both RFC3339");
  }

  if ("contractName" in (payload || {})) {
    errors.push("contractName is prohibited");
  }
  if ("records" in (payload || {})) {
    errors.push("records is prohibited");
  }

  const warnings = Array.isArray(payload?.warnings) ? payload.warnings : [];
  for (const [i, w] of warnings.entries()) {
    if (w?.code === "RECORDS_TRUNCATED") {
      errors.push("RECORDS_TRUNCATED is prohibited");
    }
    if (typeof w?.code === "string" && !BASELINE_WARNING_CODES.includes(w.code)) {
      errors.push(`warnings[${i}].code is not in the approved catalog: ${w.code}`);
    }
  }

  const registry = payload?.registryObservation;
  if (registry?.status === "ABSENT") {
    if (registry.registryVersion !== null) {
      errors.push("ABSENT registry requires registryVersion null");
    }
    if (registry.lastObservedAt !== null) {
      errors.push("ABSENT registry requires lastObservedAt null");
    }
    if (registry.entriesObserved !== 0) {
      errors.push("ABSENT registry requires entriesObserved 0");
    }
  }

  const ownership = payload?.ownership;
  if (!ownership || typeof ownership !== "object") {
    errors.push("ownership is required");
  } else {
    if (ownership.factory !== "FACTORY") {
      errors.push("ownership.factory must be FACTORY");
    }
    if (ownership.governance !== "DOCUMENTATION") {
      errors.push("ownership.governance must be DOCUMENTATION");
    }
    if (ownership.readModel !== "INTEGRATION") {
      errors.push("ownership.readModel must be INTEGRATION");
    }
    if (!["REGISTRY", "ABSENT"].includes(ownership.registry)) {
      errors.push("ownership.registry must be REGISTRY or ABSENT");
    }

    if (ownership.registry === "ABSENT" && registry?.status !== "ABSENT") {
      errors.push(
        "ownership.registry ABSENT requires registryObservation.status ABSENT"
      );
    }
    if (ownership.registry === "REGISTRY" && registry?.status === "ABSENT") {
      errors.push(
        "ownership.registry REGISTRY forbids registryObservation.status ABSENT"
      );
    }
    if (registry?.status === "ABSENT" && ownership.registry !== "ABSENT") {
      errors.push(
        "registryObservation.status ABSENT requires ownership.registry ABSENT"
      );
    }
  }

  const fo = payload?.factoryObservation;
  if (fo) {
    const phaseIds = [
      fo.phaseRange?.from,
      fo.phaseRange?.to,
      ...(Array.isArray(fo.implementedPhases) ? fo.implementedPhases : []),
      ...(Array.isArray(fo.approvedPhases) ? fo.approvedPhases : []),
      ...(Array.isArray(fo.blockedPhases) ? fo.blockedPhases : []),
    ];
    for (const phaseId of phaseIds) {
      if (phaseId === undefined) continue;
      if (!isApprovedPhaseId(phaseId)) {
        errors.push(`factory phase id invalid (expected CB-00..CB-99): ${phaseId}`);
      }
    }
  }

  const runtime = payload?.factoryObservation?.runtimeSummary;
  if (runtime) {
    for (const key of [
      "motorsObserved",
      "loopsObserved",
      "swarmsObserved",
      "aiAssistantsObserved",
    ]) {
      const n = runtime[key];
      if (!Number.isInteger(n) || n < 0) {
        errors.push(`runtimeSummary.${key} must be a non-negative integer`);
      }
    }
  }

  if (registry && (!Number.isInteger(registry.entriesObserved) || registry.entriesObserved < 0)) {
    errors.push("registryObservation.entriesObserved must be a non-negative integer");
  }

  const lineage = payload?.lineage;
  if (lineage) {
    if (
      !Number.isInteger(lineage.generationSequence) ||
      lineage.generationSequence < 0
    ) {
      errors.push("lineage.generationSequence must be a non-negative integer");
    }
  }

  const integrity = payload?.integrity;
  if (integrity) {
    if (integrity.algorithm !== "SHA-256") {
      errors.push("integrity.algorithm must be SHA-256");
    }
    if (integrity.canonicalization !== "JCS") {
      errors.push("integrity.canonicalization must be JCS");
    }
    if (
      typeof integrity.checksum !== "string" ||
      !/^[0-9a-f]{64}$/.test(integrity.checksum)
    ) {
      errors.push("integrity.checksum must be lowercase hex SHA-256");
    }
    if (typeof integrity.verified !== "boolean") {
      errors.push("integrity.verified must be boolean");
    }
  }

  const expedientes = Array.isArray(payload?.expedientes) ? payload.expedientes : [];
  for (const [i, exp] of expedientes.entries()) {
    if (exp?.classification === "DIAMOND") {
      if (exp.offMarket !== true) {
        errors.push(`expedientes[${i}] DIAMOND requires offMarket=true`);
      }
      if (exp.ownerVerified !== true) {
        errors.push(`expedientes[${i}] DIAMOND requires ownerVerified=true`);
      }
      if (exp.commercializationAuthorized !== true) {
        errors.push(
          `expedientes[${i}] DIAMOND requires commercializationAuthorized=true`
        );
      }
    }
  }

  return errors;
}

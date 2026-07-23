/**
 * II.2 allowlist sanitizer — emits Read Model Contract v2 only.
 * Fail-closed: refuses v1 nomenclature and prohibited data.
 */

import {
  ABSOLUTE_PATH_RE,
  PROHIBITED_FIELD_NAME_PATTERNS,
  QUOTAS,
  SECRETISH_VALUE_RE,
  STACK_TRACE_RE,
} from "./constants.js";
import {
  DIAGNOSTIC_CHECK_FIELDS,
  DIAGNOSTICS_FIELDS,
  DRIFT_FIELDS,
  DRIFT_ITEM_FIELDS,
  EXPEDIENTE_FIELDS,
  FACTORY_OBSERVATION_FIELDS,
  GOVERNANCE_FIELDS,
  INTEGRITY_FIELDS,
  LINEAGE_FIELDS,
  OWNERSHIP_FIELDS,
  PHASE_RANGE_FIELDS,
  PRODUCER_FIELDS,
  REGISTRY_OBSERVATION_FIELDS,
  ROOT_FIELDS,
  RUNTIME_SUMMARY_FIELDS,
  SOURCE_INPUT_FIELDS,
  SOURCE_PROVENANCE_FIELDS,
  WARNING_FIELDS,
} from "./schema.js";

function fail(code, message, details = []) {
  const err = new Error(message);
  err.code = code;
  err.details = details;
  err.failClosed = true;
  return err;
}

function assertNoProhibitedName(key, path) {
  if (key === "contractName" || key === "records") {
    throw fail(
      "PROHIBITED_FIELD",
      `Prohibited field ${path}.${key}`,
      [`${path}.${key}`]
    );
  }
  for (const re of PROHIBITED_FIELD_NAME_PATTERNS) {
    if (re.test(key)) {
      throw fail(
        "PROHIBITED_FIELD",
        `Prohibited field name ${path}.${key}`,
        [`${path}.${key}`]
      );
    }
  }
}

function assertSafeString(value, path) {
  if (typeof value !== "string") {
    throw fail("TYPE", `${path} must be string`);
  }
  if (value.length > QUOTAS.MAX_STRING_LENGTH) {
    throw fail("QUOTA", `${path} exceeds MAX_STRING_LENGTH`);
  }
  if (ABSOLUTE_PATH_RE.test(value)) {
    throw fail("PROHIBITED_DATA", `${path} contains absolute path`);
  }
  if (STACK_TRACE_RE.test(value)) {
    throw fail("PROHIBITED_DATA", `${path} contains stack trace`);
  }
  if (SECRETISH_VALUE_RE.test(value)) {
    throw fail("PROHIBITED_DATA", `${path} contains secret-like value`);
  }
  return value;
}

function pickAllowlist(obj, allowed, path) {
  if (obj === null || typeof obj !== "object" || Array.isArray(obj)) {
    throw fail("TYPE", `${path} must be object`);
  }
  for (const key of Object.keys(obj)) {
    assertNoProhibitedName(key, path);
    if (!allowed.includes(key)) {
      throw fail("UNKNOWN_FIELD", `Unknown field ${path}.${key}`, [
        `${path}.${key}`,
      ]);
    }
  }
  const out = {};
  for (const key of allowed) {
    if (!(key in obj)) {
      throw fail("REQUIRED", `Missing required field ${path}.${key}`);
    }
    out[key] = obj[key];
  }
  return out;
}

function sanitizeStringArray(arr, path) {
  if (!Array.isArray(arr)) throw fail("TYPE", `${path} must be array`);
  return arr.map((item, i) => assertSafeString(item, `${path}[${i}]`));
}

function sanitizeProducer(producer) {
  const o = pickAllowlist(producer, [...PRODUCER_FIELDS], "producer");
  return {
    producerId: assertSafeString(o.producerId, "producer.producerId"),
    producerVersion: assertSafeString(
      o.producerVersion,
      "producer.producerVersion"
    ),
    generatedBy: assertSafeString(o.generatedBy, "producer.generatedBy"),
    hostClass: assertSafeString(o.hostClass, "producer.hostClass"),
  };
}

function sanitizeOwnership(ownership) {
  const o = pickAllowlist(ownership, [...OWNERSHIP_FIELDS], "ownership");
  return {
    factory: assertSafeString(o.factory, "ownership.factory"),
    registry: assertSafeString(o.registry, "ownership.registry"),
    governance: assertSafeString(o.governance, "ownership.governance"),
    readModel: assertSafeString(o.readModel, "ownership.readModel"),
  };
}

function sanitizeSourceProvenance(sp) {
  const o = pickAllowlist(sp, [...SOURCE_PROVENANCE_FIELDS], "sourceProvenance");
  if (!Array.isArray(o.inputs)) {
    throw fail("TYPE", "sourceProvenance.inputs must be array");
  }
  return {
    sourceType: assertSafeString(o.sourceType, "sourceProvenance.sourceType"),
    sourceRevision: assertSafeString(
      o.sourceRevision,
      "sourceProvenance.sourceRevision"
    ),
    observedAt: assertSafeString(o.observedAt, "sourceProvenance.observedAt"),
    inputs: o.inputs.map((input, i) => {
      const item = pickAllowlist(
        input,
        [...SOURCE_INPUT_FIELDS],
        `sourceProvenance.inputs[${i}]`
      );
      return {
        sourceId: assertSafeString(
          item.sourceId,
          `sourceProvenance.inputs[${i}].sourceId`
        ),
        sourceKind: assertSafeString(
          item.sourceKind,
          `sourceProvenance.inputs[${i}].sourceKind`
        ),
        revision: assertSafeString(
          item.revision,
          `sourceProvenance.inputs[${i}].revision`
        ),
        status: assertSafeString(
          item.status,
          `sourceProvenance.inputs[${i}].status`
        ),
      };
    }),
  };
}

function sanitizeIntegrity(integrity) {
  const o = pickAllowlist(integrity, [...INTEGRITY_FIELDS], "integrity");
  return {
    algorithm: assertSafeString(o.algorithm, "integrity.algorithm"),
    canonicalization: assertSafeString(
      o.canonicalization,
      "integrity.canonicalization"
    ),
    checksum: assertSafeString(o.checksum, "integrity.checksum"),
    verified: o.verified,
  };
}

function sanitizeFactoryObservation(fo) {
  const o = pickAllowlist(fo, [...FACTORY_OBSERVATION_FIELDS], "factoryObservation");
  const phaseRange = pickAllowlist(
    o.phaseRange,
    [...PHASE_RANGE_FIELDS],
    "factoryObservation.phaseRange"
  );
  const runtimeSummary = pickAllowlist(
    o.runtimeSummary,
    [...RUNTIME_SUMMARY_FIELDS],
    "factoryObservation.runtimeSummary"
  );
  return {
    status: assertSafeString(o.status, "factoryObservation.status"),
    phaseRange: {
      from: assertSafeString(phaseRange.from, "factoryObservation.phaseRange.from"),
      to: assertSafeString(phaseRange.to, "factoryObservation.phaseRange.to"),
    },
    implementedPhases: sanitizeStringArray(
      o.implementedPhases,
      "factoryObservation.implementedPhases"
    ),
    approvedPhases: sanitizeStringArray(
      o.approvedPhases,
      "factoryObservation.approvedPhases"
    ),
    blockedPhases: sanitizeStringArray(
      o.blockedPhases,
      "factoryObservation.blockedPhases"
    ),
    runtimeSummary: {
      motorsObserved: runtimeSummary.motorsObserved,
      loopsObserved: runtimeSummary.loopsObserved,
      swarmsObserved: runtimeSummary.swarmsObserved,
      aiAssistantsObserved: runtimeSummary.aiAssistantsObserved,
    },
  };
}

function sanitizeRegistryObservation(ro) {
  const o = pickAllowlist(
    ro,
    [...REGISTRY_OBSERVATION_FIELDS],
    "registryObservation"
  );
  return {
    status: assertSafeString(o.status, "registryObservation.status"),
    registryVersion:
      o.registryVersion === null
        ? null
        : assertSafeString(
            o.registryVersion,
            "registryObservation.registryVersion"
          ),
    entriesObserved: o.entriesObserved,
    lastObservedAt:
      o.lastObservedAt === null
        ? null
        : assertSafeString(
            o.lastObservedAt,
            "registryObservation.lastObservedAt"
          ),
  };
}

function sanitizeGovernance(g) {
  const o = pickAllowlist(g, [...GOVERNANCE_FIELDS], "governance");
  return {
    constitutionalStatus: assertSafeString(
      o.constitutionalStatus,
      "governance.constitutionalStatus"
    ),
    approvedBy:
      o.approvedBy === null
        ? null
        : assertSafeString(o.approvedBy, "governance.approvedBy"),
    approvedAt:
      o.approvedAt === null
        ? null
        : assertSafeString(o.approvedAt, "governance.approvedAt"),
    activeBlock: assertSafeString(o.activeBlock, "governance.activeBlock"),
    blockedBlocks: sanitizeStringArray(o.blockedBlocks, "governance.blockedBlocks"),
    parking: sanitizeStringArray(o.parking, "governance.parking"),
  };
}

function sanitizeDrift(drift) {
  const o = pickAllowlist(drift, [...DRIFT_FIELDS], "drift");
  if (!Array.isArray(o.items)) throw fail("TYPE", "drift.items must be array");
  return {
    status: assertSafeString(o.status, "drift.status"),
    items: o.items.map((item, i) => {
      const d = pickAllowlist(item, [...DRIFT_ITEM_FIELDS], `drift.items[${i}]`);
      return {
        code: assertSafeString(d.code, `drift.items[${i}].code`),
        severity: assertSafeString(d.severity, `drift.items[${i}].severity`),
        area: assertSafeString(d.area, `drift.items[${i}].area`),
        expected: assertSafeString(d.expected, `drift.items[${i}].expected`),
        observed: assertSafeString(d.observed, `drift.items[${i}].observed`),
      };
    }),
  };
}

function sanitizeLineage(lineage) {
  const o = pickAllowlist(lineage, [...LINEAGE_FIELDS], "lineage");
  return {
    previousSnapshotId:
      o.previousSnapshotId === null
        ? null
        : assertSafeString(o.previousSnapshotId, "lineage.previousSnapshotId"),
    parentSnapshotId:
      o.parentSnapshotId === null
        ? null
        : assertSafeString(o.parentSnapshotId, "lineage.parentSnapshotId"),
    generationSequence: o.generationSequence,
    sourceRevision: assertSafeString(
      o.sourceRevision,
      "lineage.sourceRevision"
    ),
  };
}

function sanitizeExpediente(exp, i) {
  const o = pickAllowlist(exp, [...EXPEDIENTE_FIELDS], `expedientes[${i}]`);
  return {
    expedienteId: assertSafeString(o.expedienteId, `expedientes[${i}].expedienteId`),
    classification: assertSafeString(
      o.classification,
      `expedientes[${i}].classification`
    ),
    status: assertSafeString(o.status, `expedientes[${i}].status`),
    identityVerified: o.identityVerified,
    valueVerified: o.valueVerified,
    pricingVerified: o.pricingVerified,
    offMarket: o.offMarket,
    ownerVerified: o.ownerVerified,
    commercializationAuthorized: o.commercializationAuthorized,
    evidenceRefs: sanitizeStringArray(
      o.evidenceRefs,
      `expedientes[${i}].evidenceRefs`
    ),
    warningCodes: sanitizeStringArray(
      o.warningCodes,
      `expedientes[${i}].warningCodes`
    ),
  };
}

function sanitizeWarning(w, i) {
  const o = pickAllowlist(w, [...WARNING_FIELDS], `warnings[${i}]`);
  if (o.code === "RECORDS_TRUNCATED") {
    throw fail("PROHIBITED_FIELD", "RECORDS_TRUNCATED is prohibited");
  }
  return {
    code: assertSafeString(o.code, `warnings[${i}].code`),
    severity: assertSafeString(o.severity, `warnings[${i}].severity`),
    scope: assertSafeString(o.scope, `warnings[${i}].scope`),
    message: assertSafeString(o.message, `warnings[${i}].message`),
    expedienteId:
      o.expedienteId === null
        ? null
        : assertSafeString(o.expedienteId, `warnings[${i}].expedienteId`),
  };
}

function sanitizeDiagnostics(diagnostics) {
  const o = pickAllowlist(diagnostics, [...DIAGNOSTICS_FIELDS], "diagnostics");
  if (!Array.isArray(o.checks)) throw fail("TYPE", "diagnostics.checks must be array");
  return {
    status: assertSafeString(o.status, "diagnostics.status"),
    summary: assertSafeString(o.summary, "diagnostics.summary"),
    checks: o.checks.map((c, i) => {
      const item = pickAllowlist(
        c,
        [...DIAGNOSTIC_CHECK_FIELDS],
        `diagnostics.checks[${i}]`
      );
      return {
        checkId: assertSafeString(
          item.checkId,
          `diagnostics.checks[${i}].checkId`
        ),
        status: assertSafeString(item.status, `diagnostics.checks[${i}].status`),
        message: assertSafeString(
          item.message,
          `diagnostics.checks[${i}].message`
        ),
      };
    }),
  };
}

/**
 * Sanitize a candidate into a v2 contract envelope (without recomputing checksum).
 * Rejects v1 names and unknown fields (fail-closed).
 *
 * @param {unknown} candidate
 * @returns {{ ok: true, value: object } | { ok: false, error: Error }}
 */
export function sanitizeToV2(candidate) {
  try {
    if (candidate === null || typeof candidate !== "object" || Array.isArray(candidate)) {
      throw fail("TYPE", "Candidate must be an object");
    }
    if ("contractName" in candidate) {
      throw fail("PROHIBITED_FIELD", "contractName is prohibited");
    }
    if ("records" in candidate) {
      throw fail("PROHIBITED_FIELD", "records is prohibited");
    }

    const root = pickAllowlist(candidate, [...ROOT_FIELDS], "$");

    const value = {
      contractId: assertSafeString(root.contractId, "contractId"),
      schemaVersion: assertSafeString(root.schemaVersion, "schemaVersion"),
      mode: assertSafeString(root.mode, "mode"),
      snapshotId: assertSafeString(root.snapshotId, "snapshotId"),
      generatedAt: assertSafeString(root.generatedAt, "generatedAt"),
      staleAfter: assertSafeString(root.staleAfter, "staleAfter"),
      environment: assertSafeString(root.environment, "environment"),
      dataClassification: assertSafeString(
        root.dataClassification,
        "dataClassification"
      ),
      producer: sanitizeProducer(root.producer),
      ownership: sanitizeOwnership(root.ownership),
      sourceProvenance: sanitizeSourceProvenance(root.sourceProvenance),
      integrity: sanitizeIntegrity(root.integrity),
      observationStatus: assertSafeString(
        root.observationStatus,
        "observationStatus"
      ),
      factoryObservation: sanitizeFactoryObservation(root.factoryObservation),
      registryObservation: sanitizeRegistryObservation(root.registryObservation),
      governance: sanitizeGovernance(root.governance),
      drift: sanitizeDrift(root.drift),
      lineage: sanitizeLineage(root.lineage),
      expedientes: (() => {
        if (!Array.isArray(root.expedientes)) {
          throw fail("TYPE", "expedientes must be array");
        }
        return root.expedientes.map((e, i) => sanitizeExpediente(e, i));
      })(),
      warnings: (() => {
        if (!Array.isArray(root.warnings)) {
          throw fail("TYPE", "warnings must be array");
        }
        return root.warnings.map((w, i) => sanitizeWarning(w, i));
      })(),
      diagnostics: sanitizeDiagnostics(root.diagnostics),
    };

    return { ok: true, value };
  } catch (error) {
    return { ok: false, error };
  }
}

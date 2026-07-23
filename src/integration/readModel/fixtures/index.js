/**
 * II.2 required fixtures (valid + invalid).
 */

import { QUOTAS } from "../constants.js";
import { attachIntegrity, computeChecksum } from "../integrity.js";
import { buildBaseSnapshot } from "./buildFixture.js";

export function fixtureHealthy() {
  return buildBaseSnapshot({}, { verified: true });
}

export function fixtureDegraded() {
  return buildBaseSnapshot(
    {
      snapshotId: "snap-degraded-001",
      observationStatus: "DEGRADED",
      warnings: [
        {
          code: "SOURCE_PARTIAL",
          severity: "WARNING",
          scope: "FACTORY",
          message: "factory observation partial",
          expedienteId: null,
        },
      ],
      factoryObservation: { status: "PARTIAL" },
    },
    { verified: true }
  );
}

export function fixturePartial() {
  return buildBaseSnapshot(
    {
      snapshotId: "snap-partial-001",
      observationStatus: "PARTIAL",
      warnings: [
        {
          code: "SOURCE_PARTIAL",
          severity: "WARNING",
          scope: "SNAPSHOT",
          message: "partial sources",
          expedienteId: null,
        },
      ],
      sourceProvenance: {
        inputs: [
          {
            sourceId: "factory-local",
            sourceKind: "FACTORY_TREE",
            revision: "cb15",
            status: "PARTIAL",
          },
          {
            sourceId: "registry-local",
            sourceKind: "REGISTRY",
            revision: "reg-1",
            status: "AVAILABLE",
          },
        ],
      },
    },
    { verified: true }
  );
}

export function fixtureRegistryAbsent() {
  return buildBaseSnapshot(
    {
      snapshotId: "snap-registry-absent-001",
      ownership: { registry: "ABSENT" },
      registryObservation: {
        status: "ABSENT",
        registryVersion: null,
        entriesObserved: 0,
        lastObservedAt: null,
      },
      warnings: [
        {
          code: "REGISTRY_ABSENT",
          severity: "INFO",
          scope: "REGISTRY",
          message: "registry absent",
          expedienteId: null,
        },
      ],
      sourceProvenance: {
        sourceType: "LOCAL_FILES",
        inputs: [
          {
            sourceId: "factory-local",
            sourceKind: "FACTORY_TREE",
            revision: "cb15",
            status: "AVAILABLE",
          },
          {
            sourceId: "registry-local",
            sourceKind: "REGISTRY",
            revision: "none",
            status: "ABSENT",
          },
        ],
      },
    },
    { verified: true }
  );
}

export function fixtureStale() {
  return buildBaseSnapshot(
    {
      snapshotId: "snap-stale-001",
      generatedAt: "2026-07-23T10:00:00.000Z",
      staleAfter: "2026-07-23T10:30:00.000Z",
      warnings: [
        {
          code: "SNAPSHOT_STALE",
          severity: "WARNING",
          scope: "SNAPSHOT",
          message: "snapshot stale",
          expedienteId: null,
        },
      ],
    },
    { verified: true }
  );
}

export function fixtureZeroExpedientes() {
  return buildBaseSnapshot(
    {
      snapshotId: "snap-zero-exp-001",
      expedientes: [],
    },
    { verified: true }
  );
}

export function fixtureDiamond() {
  return buildBaseSnapshot(
    {
      snapshotId: "snap-diamond-001",
      expedientes: [
        {
          expedienteId: "exp-diamond-001",
          classification: "DIAMOND",
          status: "OBSERVED",
          identityVerified: true,
          valueVerified: true,
          pricingVerified: true,
          offMarket: true,
          ownerVerified: true,
          commercializationAuthorized: true,
          evidenceRefs: ["evd-diamond-1"],
          warningCodes: [],
        },
      ],
    },
    { verified: true }
  );
}

export function fixtureUnknownRootField() {
  const base = buildBaseSnapshot({ snapshotId: "snap-bad-root" }, { verified: true });
  return { ...base, extraRoot: true };
}

export function fixtureUnknownNestedField() {
  const base = buildBaseSnapshot({ snapshotId: "snap-bad-nested" }, { verified: true });
  return {
    ...base,
    producer: { ...base.producer, unexpected: "x" },
  };
}

export function fixtureContractName() {
  const base = buildBaseSnapshot({ snapshotId: "snap-bad-contractName" }, {
    attach: false,
  });
  const withName = { ...base, contractName: "legacy" };
  delete withName.contractId;
  return attachIntegrity(withName, { verified: true });
}

export function fixtureRecords() {
  const base = buildBaseSnapshot({ snapshotId: "snap-bad-records" }, {
    attach: false,
  });
  const { expedientes, ...rest } = base;
  return attachIntegrity({ ...rest, records: expedientes }, { verified: true });
}

export function fixtureRecordsTruncated() {
  return buildBaseSnapshot(
    {
      snapshotId: "snap-bad-records-truncated",
      warnings: [
        {
          code: "RECORDS_TRUNCATED",
          severity: "WARNING",
          scope: "SNAPSHOT",
          message: "legacy truncation",
          expedienteId: null,
        },
      ],
    },
    { verified: true }
  );
}

export function fixtureBadTimestampOrder() {
  return buildBaseSnapshot(
    {
      snapshotId: "snap-bad-ts",
      generatedAt: "2026-07-23T14:00:00.000Z",
      staleAfter: "2026-07-23T13:00:00.000Z",
    },
    { verified: true }
  );
}

export function fixtureBadChecksum() {
  const base = buildBaseSnapshot({ snapshotId: "snap-bad-checksum" }, {
    verified: true,
  });
  return {
    ...base,
    integrity: {
      ...base.integrity,
      checksum: "a".repeat(64),
      verified: true,
    },
  };
}

export function fixtureBadDiamond() {
  return buildBaseSnapshot(
    {
      snapshotId: "snap-bad-diamond",
      expedientes: [
        {
          expedienteId: "exp-bad-diamond",
          classification: "DIAMOND",
          status: "OBSERVED",
          identityVerified: true,
          valueVerified: true,
          pricingVerified: true,
          offMarket: false,
          ownerVerified: false,
          commercializationAuthorized: false,
          evidenceRefs: [],
          warningCodes: [],
        },
      ],
    },
    { verified: true }
  );
}

export function fixtureProhibitedData() {
  return buildBaseSnapshot(
    {
      snapshotId: "snap-bad-secret",
      diagnostics: {
        status: "AVAILABLE",
        summary: "token Bearer eyJhbGciOiJIUzI1NiJ9.payload.sig",
        checks: [
          {
            checkId: "chk-leak",
            status: "FAIL",
            message: "path C:\\Users\\cgrmo\\secret.env",
          },
        ],
      },
    },
    { verified: true }
  );
}

export function fixtureQuotaExceeded() {
  const warnings = Array.from({ length: QUOTAS.MAX_WARNINGS + 1 }, (_, i) => ({
    code: "DRIFT_DETECTED",
    severity: "INFO",
    scope: "SNAPSHOT",
    message: `w${i}`,
    expedienteId: null,
  }));
  return buildBaseSnapshot(
    {
      snapshotId: "snap-quota",
      warnings,
    },
    { verified: true }
  );
}

export function fixtureTruncationWarnings() {
  return buildBaseSnapshot(
    {
      snapshotId: "snap-truncation",
      warnings: [
        {
          code: "EXPEDIENTES_TRUNCATED",
          severity: "WARNING",
          scope: "SNAPSHOT",
          message: "expedientes truncated",
          expedienteId: null,
        },
        {
          code: "DIAGNOSTICS_TRUNCATED",
          severity: "WARNING",
          scope: "SNAPSHOT",
          message: "diagnostics truncated",
          expedienteId: null,
        },
      ],
    },
    { verified: true }
  );
}

export function fixtureStaleMissingWarning() {
  return buildBaseSnapshot(
    {
      snapshotId: "snap-stale-no-warning",
      generatedAt: "2026-07-23T10:00:00.000Z",
      staleAfter: "2026-07-23T10:30:00.000Z",
      warnings: [],
    },
    { verified: true }
  );
}

export function fixtureOwnershipRegistryMismatch() {
  return buildBaseSnapshot(
    {
      snapshotId: "snap-own-reg-mismatch",
      ownership: { registry: "ABSENT" },
      registryObservation: {
        status: "AVAILABLE",
        registryVersion: "1.0.0",
        entriesObserved: 1,
        lastObservedAt: "2026-07-23T11:58:00.000Z",
      },
    },
    { verified: true }
  );
}

export function fixtureObjectDepthExceeded() {
  const base = buildBaseSnapshot({ snapshotId: "snap-obj-depth" }, { verified: true });
  let deep = { leaf: true };
  for (let i = 0; i < QUOTAS.MAX_OBJECT_DEPTH + 1; i += 1) {
    deep = { nested: deep };
  }
  return { ...base, deepNest: deep };
}

export function fixtureArrayDepthExceeded() {
  const base = buildBaseSnapshot({ snapshotId: "snap-arr-depth" }, { verified: true });
  let deep = ["leaf"];
  for (let i = 0; i < QUOTAS.MAX_ARRAY_DEPTH + 1; i += 1) {
    deep = [deep];
  }
  return { ...base, deepNest: deep };
}

export function fixtureUnknownWarningCode() {
  return buildBaseSnapshot(
    {
      snapshotId: "snap-bad-warning-code",
      warnings: [
        {
          code: "NOT_IN_CATALOG",
          severity: "WARNING",
          scope: "SNAPSHOT",
          message: "unknown warning",
          expedienteId: null,
        },
      ],
    },
    { verified: true }
  );
}

export function fixtureInvalidPhaseId() {
  return buildBaseSnapshot(
    {
      snapshotId: "snap-bad-phase",
      factoryObservation: {
        phaseRange: { from: "CB-00", to: "CB-100" },
      },
    },
    { verified: true }
  );
}

export function fixtureMissingRequiredField() {
  const base = buildBaseSnapshot({ snapshotId: "snap-missing-required" }, {
    verified: true,
  });
  const { ownership, ...rest } = base;
  return rest;
}

export function fixturePayloadBytesExceeded() {
  const pad = "x".repeat(QUOTAS.MAX_STRING_LENGTH);
  const expedientes = Array.from({ length: QUOTAS.MAX_EXPEDIENTES }, (_, i) => ({
    expedienteId: `exp-pad-${i}`,
    classification: "DEAL",
    status: "OBSERVED",
    identityVerified: false,
    valueVerified: false,
    pricingVerified: false,
    offMarket: false,
    ownerVerified: false,
    commercializationAuthorized: false,
    evidenceRefs: [pad, pad, pad],
    warningCodes: [],
  }));
  return buildBaseSnapshot(
    {
      snapshotId: "snap-payload-bytes",
      expedientes,
    },
    { verified: true }
  );
}

/** Determinism helper: recompute checksum for a fixture clone. */
export function recompute(fixture) {
  const clone = structuredClone(fixture);
  clone.integrity.checksum = computeChecksum(clone);
  return clone;
}

export const FIXTURE_CATALOG = Object.freeze({
  healthy: fixtureHealthy,
  degraded: fixtureDegraded,
  partial: fixturePartial,
  registryAbsent: fixtureRegistryAbsent,
  stale: fixtureStale,
  zeroExpedientes: fixtureZeroExpedientes,
  diamond: fixtureDiamond,
  truncationWarnings: fixtureTruncationWarnings,
  unknownRootField: fixtureUnknownRootField,
  unknownNestedField: fixtureUnknownNestedField,
  contractName: fixtureContractName,
  records: fixtureRecords,
  recordsTruncated: fixtureRecordsTruncated,
  badTimestampOrder: fixtureBadTimestampOrder,
  badChecksum: fixtureBadChecksum,
  badDiamond: fixtureBadDiamond,
  prohibitedData: fixtureProhibitedData,
  quotaExceeded: fixtureQuotaExceeded,
  staleMissingWarning: fixtureStaleMissingWarning,
  ownershipRegistryMismatch: fixtureOwnershipRegistryMismatch,
  objectDepthExceeded: fixtureObjectDepthExceeded,
  arrayDepthExceeded: fixtureArrayDepthExceeded,
  unknownWarningCode: fixtureUnknownWarningCode,
  invalidPhaseId: fixtureInvalidPhaseId,
  missingRequiredField: fixtureMissingRequiredField,
  payloadBytesExceeded: fixturePayloadBytesExceeded,
});

/**
 * P-INT-04 Offline — Decision Package export service (Plan §19 / §22).
 *
 * Explicit service — NOT composed into prepareAndDeliver.
 */

import { assertValidFactoryKey } from "../../cb01/factoryKey.js";
import { buildDecisionPackage } from "../decisionPackageBuilder.js";
import { evaluateDecisionReadiness } from "../decisionReadiness.js";
import {
  DECISION_PACKAGE_VERSION,
  validateDecisionPackageShape,
  validateTrustedDecisionPackage,
} from "../decisionPackageSchema.js";
import {
  findOfflineLocalExportAct,
  recordOfflineLocalExport,
} from "../decisionLedger.js";
import {
  buildPackageId,
  computeCanonicalContentChecksum,
} from "./decisionPackageCanonicalize.js";
import {
  EXPORT_MODE_OFFLINE_LOCAL,
  EXPORT_SCHEMA_VERSION,
  assertPayloadTopLevelAllowlist,
  buildBoundarySummary,
  validateExportEnvelope,
} from "./decisionPackageIntegrity.js";
import { LocalDecisionPackageExportStore } from "./localDecisionPackageExportStore.js";

/**
 * @param {object} registry
 * @param {string} factoryKey
 * @param {string} checksum
 */
function hasElrExportAct(registry, factoryKey, checksum) {
  const record = registry.getExpediente(factoryKey);
  return Boolean(findOfflineLocalExportAct(record?.elr, checksum));
}

/**
 * Build validated envelope from ST-RDY expediente (no persist).
 * @param {object} record
 * @param {object} [hints]
 * @param {object[]|null} [inputSnapshotRefs]
 */
export function buildOfflineExportEnvelope(record, hints = {}, inputSnapshotRefs = null) {
  if (!record?.factory_key) {
    throw new Error("[P-INT-04 Export] factory_key missing");
  }
  if (record.state !== "ST-RDY") {
    throw new Error(
      `[P-INT-04 Export] ST-RDY required for offline export, got ${record.state}`
    );
  }

  const readiness = evaluateDecisionReadiness(record, hints);
  if (!readiness.ready) {
    throw new Error(
      `[P-INT-04 Export] Readiness fail — no export: ${readiness.errors.join("; ")}`
    );
  }

  const built = buildDecisionPackage(record, {
    ...hints,
    // PS05-05: export defaults to trusted path; diagnostic UNTRUSTED requires opt-in.
    allowUntrustedDiagnostic: hints.allowUntrustedDiagnostic === true,
  });
  if (!built.ok || !built.package) {
    throw new Error(
      `[P-INT-04 Export] Package build failed: ${(built.errors ?? []).join("; ")}`
    );
  }

  const payload = built.package;
  assertPayloadTopLevelAllowlist(payload);
  if (hints.allowUntrustedDiagnostic === true) {
    const shape = validateDecisionPackageShape(payload);
    if (!shape.valid) {
      throw new Error(`[P-INT-04 Export] Invalid package: ${shape.errors.join("; ")}`);
    }
  } else {
    const trusted = validateTrustedDecisionPackage(payload);
    if (!trusted.valid) {
      throw new Error(
        `[P-INT-04 Export] PS05-05 trusted export refused (shape-valid ≠ trusted): ${trusted.errors.join("; ")}`
      );
    }
  }
  if (payload.boundary?.decides !== false) {
    throw new Error("[P-INT-04 Export] boundary.decides must be false");
  }
  if (
    payload.boundary?.classifiesDeal !== false ||
    payload.boundary?.classifiesPremium !== false ||
    payload.boundary?.classifiesDiamond !== false
  ) {
    throw new Error("[P-INT-04 Export] commercial classification flags must be false");
  }

  const canonicalContentChecksum = computeCanonicalContentChecksum(payload);
  const packageId = buildPackageId(record.factory_key, canonicalContentChecksum);

  const envelope = {
    exportSchemaVersion: EXPORT_SCHEMA_VERSION,
    decisionPackageVersion: DECISION_PACKAGE_VERSION,
    packageId,
    factory_key: record.factory_key,
    generatedAt: new Date().toISOString(),
    canonicalContentChecksum,
    exportMode: EXPORT_MODE_OFFLINE_LOCAL,
    boundarySummary: buildBoundarySummary(payload.boundary),
    inputSnapshotRefs: inputSnapshotRefs ?? null,
    payload,
  };

  validateExportEnvelope(envelope);
  return { envelope, readiness };
}

/**
 * Full offline export: build → persist VERIFY → ELR DHI_OFFLINE_LOCAL_EXPORT.
 *
 * @param {{
 *   registry: import('../../cb01/factoryRegistry.js').FactoryRegistry,
 *   factoryKey: string,
 *   exportStore?: LocalDecisionPackageExportStore,
 *   hints?: object,
 *   inputSnapshotRefs?: object[]|null,
 * }} args
 */
export function exportOfflineDecisionPackage(args) {
  const {
    registry,
    factoryKey,
    exportStore = new LocalDecisionPackageExportStore(),
    hints = {},
    inputSnapshotRefs = null,
  } = args;

  assertValidFactoryKey(factoryKey);
  const record = registry.getExpediente(factoryKey);
  if (!record) {
    throw new Error(`[P-INT-04 Export] Expediente not found: ${factoryKey}`);
  }

  const { envelope, readiness } = buildOfflineExportEnvelope(
    record,
    hints,
    inputSnapshotRefs
  );

  const packageId = envelope.packageId;
  const checksum = envelope.canonicalContentChecksum;

  let localMeta;
  let localSkipped = false;

  if (exportStore.exists(factoryKey, packageId)) {
    try {
      const existing = exportStore.verifyIntegrity(factoryKey, packageId);
      if (existing.canonicalContentChecksum === checksum) {
        localMeta = {
          packageId,
          factory_key: factoryKey,
          path: exportStore.resolvePath(factoryKey, packageId),
          sidecarPath: exportStore.resolveSidecarPath(factoryKey, packageId),
          relativeRef: exportStore.relativeRef(factoryKey, packageId),
          exportSchemaVersion: EXPORT_SCHEMA_VERSION,
          canonicalContentChecksum: checksum,
        };
        localSkipped = true;
      } else {
        localMeta = exportStore.write(envelope);
      }
    } catch {
      localMeta = exportStore.write(envelope);
    }
  } else {
    localMeta = exportStore.write(envelope);
  }

  // VERIFY already inside write; re-verify before ELR
  exportStore.verifyIntegrity(factoryKey, packageId);

  if (hasElrExportAct(registry, factoryKey, checksum)) {
    return {
      ok: true,
      status: "SUCCESS",
      packageId,
      canonicalContentChecksum: checksum,
      localSkipped,
      elrSkipped: true,
      relativeRef: localMeta.relativeRef,
      envelope: exportStore.read(factoryKey, packageId),
      readiness,
    };
  }

  try {
    recordOfflineLocalExport(registry, factoryKey, {
      packageId,
      canonicalContentChecksum: checksum,
      exportSchemaVersion: EXPORT_SCHEMA_VERSION,
      relativeRef: localMeta.relativeRef,
    });
  } catch (err) {
    return {
      ok: false,
      status: "LOCAL_OK_ELR_PENDING",
      packageId,
      canonicalContentChecksum: checksum,
      relativeRef: localMeta.relativeRef,
      error: err.message,
      readiness,
    };
  }

  return {
    ok: true,
    status: "SUCCESS",
    packageId,
    canonicalContentChecksum: checksum,
    localSkipped,
    elrSkipped: false,
    relativeRef: localMeta.relativeRef,
    envelope: exportStore.read(factoryKey, packageId),
    readiness,
  };
}

/**
 * Reconcile orphan: verified local artifact without ELR act.
 * @param {{
 *   registry: import('../../cb01/factoryRegistry.js').FactoryRegistry,
 *   factoryKey: string,
 *   packageId: string,
 *   exportStore?: LocalDecisionPackageExportStore,
 * }} args
 */
export function reconcilePendingElrRef(args) {
  const {
    registry,
    factoryKey,
    packageId,
    exportStore = new LocalDecisionPackageExportStore(),
  } = args;

  assertValidFactoryKey(factoryKey);
  const envelope = exportStore.verifyIntegrity(factoryKey, packageId);
  const checksum = envelope.canonicalContentChecksum;

  if (hasElrExportAct(registry, factoryKey, checksum)) {
    return { ok: true, status: "ALREADY_LINKED", packageId, checksum };
  }

  recordOfflineLocalExport(registry, factoryKey, {
    packageId,
    canonicalContentChecksum: checksum,
    exportSchemaVersion: envelope.exportSchemaVersion,
    relativeRef: exportStore.relativeRef(factoryKey, packageId),
  });

  return { ok: true, status: "RECONCILED", packageId, checksum };
}

/**
 * Detect orphan ELR act without local artifact (fail-closed report).
 * @param {{
 *   registry: import('../../cb01/factoryRegistry.js').FactoryRegistry,
 *   factoryKey: string,
 *   exportStore?: LocalDecisionPackageExportStore,
 * }} args
 */
export function detectOrphanElrExports(args) {
  const {
    registry,
    factoryKey,
    exportStore = new LocalDecisionPackageExportStore(),
  } = args;

  const record = registry.getExpediente(factoryKey);
  const handoffs = record?.elr?.decision_handoffs ?? [];
  const orphans = [];
  for (const h of handoffs) {
    if (h.kind !== "DHI_OFFLINE_LOCAL_EXPORT") continue;
    const id = h.packageId;
    if (!id || !exportStore.exists(factoryKey, id)) {
      orphans.push({
        packageId: id ?? null,
        canonicalContentChecksum: h.canonicalContentChecksum ?? null,
        reason: "ELR_WITHOUT_ARTIFACT",
      });
    }
  }
  return { orphans, failClosed: orphans.length > 0 };
}

/**
 * P-INT-04 Live — Decision Package live export service (Plan §12).
 *
 * Explicit service — NOT composed into prepareAndDeliver.
 * Offline §6.1 A∧B prerequisite. Remote VERIFY before ELR.
 */

import crypto from "node:crypto";
import { assertValidFactoryKey } from "../../cb01/factoryKey.js";
import { evaluateDecisionReadiness } from "../decisionReadiness.js";
import {
  findLiveVersionedExportAct,
  findOfflineLocalExportAct,
  recordLiveVersionedExport,
} from "../decisionLedger.js";
import { EXPORT_SCHEMA_VERSION, sha256Hex } from "./decisionPackageIntegrity.js";
import { LocalDecisionPackageExportStore } from "./localDecisionPackageExportStore.js";
import {
  EXPORT_MODE_LIVE_VERSIONED,
  buildDecisionPackageConsumerLocator,
  buildRemoteRef,
  buildStableLiveEnvelopeBytes,
  resolveRemoteKey,
} from "./decisionPackageLiveSinkPort.js";
import { InMemoryDecisionPackageLiveSink } from "./inMemoryDecisionPackageLiveSink.js";

/** @type {{ attempts: number, success: number, fail: number, conflict: number, timeout: number, reconcile: number }} */
export const liveExportMetrics = {
  attempts: 0,
  success: 0,
  fail: 0,
  conflict: 0,
  timeout: 0,
  reconcile: 0,
};

/**
 * @param {object} registry
 * @param {string} factoryKey
 * @param {string} checksum
 */
function hasLiveElrAct(registry, factoryKey, checksum) {
  return Boolean(
    findLiveVersionedExportAct(registry.getExpediente(factoryKey)?.elr, checksum)
  );
}

/**
 * Full Live export: Offline prerequisite → stable bytes → putIfAbsent → VERIFY → ELR.
 *
 * @param {{
 *   registry: import('../../cb01/factoryRegistry.js').FactoryRegistry,
 *   factoryKey: string,
 *   packageId: string,
 *   exportStore?: LocalDecisionPackageExportStore,
 *   liveSink?: InMemoryDecisionPackageLiveSink,
 *   hints?: object,
 *   principal?: string|null,
 * }} args
 */
export function exportLiveDecisionPackage(args) {
  liveExportMetrics.attempts += 1;
  const {
    registry,
    factoryKey,
    packageId,
    exportStore = new LocalDecisionPackageExportStore(),
    liveSink = new InMemoryDecisionPackageLiveSink(),
    hints = {},
    principal = "FactoryOps",
  } = args;

  const liveAttemptId = crypto.randomUUID();

  try {
    assertValidFactoryKey(factoryKey);
    const record = registry.getExpediente(factoryKey);
    if (!record) {
      throw Object.assign(new Error(`[P-INT-04 Live] Expediente not found: ${factoryKey}`), {
        code: "NOT_FOUND",
      });
    }
    if (record.state !== "ST-RDY") {
      throw Object.assign(
        new Error(`[P-INT-04 Live] ST-RDY required for live export, got ${record.state}`),
        { code: "STATE_REJECTED" }
      );
    }
    const readiness = evaluateDecisionReadiness(record, hints);
    if (!readiness.ready) {
      throw Object.assign(
        new Error(
          `[P-INT-04 Live] Readiness fail — no export: ${readiness.errors.join("; ")}`
        ),
        { code: "READINESS_FAIL" }
      );
    }

    // §6.1 A — verified offline artifact
    let offlineEnvelope;
    try {
      offlineEnvelope = exportStore.verifyIntegrity(factoryKey, packageId);
    } catch (err) {
      liveExportMetrics.fail += 1;
      return {
        ok: false,
        status: "OFFLINE_PREREQUISITE_MISSING",
        error: err.message,
        liveAttemptId,
        packageId,
      };
    }

    const checksum = offlineEnvelope.canonicalContentChecksum;
    if (offlineEnvelope.packageId !== packageId) {
      liveExportMetrics.fail += 1;
      return {
        ok: false,
        status: "OFFLINE_PREREQUISITE_MISSING",
        error: "Offline packageId mismatch",
        liveAttemptId,
        packageId,
      };
    }

    // §6.1 B — offline ELR act
    const offlineAct = findOfflineLocalExportAct(record.elr, checksum);
    if (!offlineAct || offlineAct.packageId !== packageId) {
      liveExportMetrics.fail += 1;
      return {
        ok: false,
        status: "OFFLINE_PREREQUISITE_MISSING",
        error: "DHI_OFFLINE_LOCAL_EXPORT act missing or mismatched",
        liveAttemptId,
        packageId,
        canonicalContentChecksum: checksum,
      };
    }

    const { bytes, contentSha256, envelope: liveEnvelope } =
      buildStableLiveEnvelopeBytes(offlineEnvelope);
    const remoteKey = resolveRemoteKey(factoryKey, packageId);
    const remoteRef = buildRemoteRef(remoteKey);

    const expected = {
      contentSha256,
      canonicalContentChecksum: checksum,
      packageId,
      factory_key: factoryKey,
      exportMode: EXPORT_MODE_LIVE_VERSIONED,
      exportSchemaVersion: EXPORT_SCHEMA_VERSION,
    };

    const meta = {
      packageId,
      factory_key: factoryKey,
      canonicalContentChecksum: checksum,
      contentSha256,
      exportMode: EXPORT_MODE_LIVE_VERSIONED,
      exportSchemaVersion: EXPORT_SCHEMA_VERSION,
      remoteRef,
      liveAttemptId,
    };

    // Idempotent path: already verified remote + ELR
    if (hasLiveElrAct(registry, factoryKey, checksum) && liveSink.exists?.(remoteKey)) {
      try {
        liveSink.verify(remoteKey, expected, { principal });
        liveExportMetrics.success += 1;
        const locator = buildDecisionPackageConsumerLocator({
          packageId,
          canonicalContentChecksum: checksum,
          remoteKey,
          exportSchemaVersion: EXPORT_SCHEMA_VERSION,
          factory_key: factoryKey,
          remoteRef,
        });
        return {
          ok: true,
          status: "SUCCESS",
          packageId,
          canonicalContentChecksum: checksum,
          remoteKey,
          remoteRef,
          contentSha256,
          liveAttemptId,
          elrSkipped: true,
          locator,
          exportMode: EXPORT_MODE_LIVE_VERSIONED,
          readiness,
        };
      } catch {
        /* fall through to put/verify */
      }
    }

    let putResult;
    try {
      putResult = liveSink.putIfAbsent(remoteKey, bytes, meta, { principal });
    } catch (err) {
      liveExportMetrics.fail += 1;
      if (err.code === "CONFLICT") liveExportMetrics.conflict += 1;
      if (err.code === "TIMEOUT") liveExportMetrics.timeout += 1;
      return {
        ok: false,
        status: err.code || "REMOTE_FAIL",
        error: err.message,
        liveAttemptId,
        packageId,
        canonicalContentChecksum: checksum,
        remoteKey,
      };
    }

    try {
      liveSink.verify(remoteKey, expected, { principal });
    } catch (err) {
      liveExportMetrics.fail += 1;
      return {
        ok: false,
        status: "VERIFY_FAIL",
        error: err.message,
        liveAttemptId,
        packageId,
        canonicalContentChecksum: checksum,
        remoteKey,
        putResult,
      };
    }

    if (hasLiveElrAct(registry, factoryKey, checksum)) {
      liveExportMetrics.success += 1;
      const locator = buildDecisionPackageConsumerLocator({
        packageId,
        canonicalContentChecksum: checksum,
        remoteKey,
        exportSchemaVersion: EXPORT_SCHEMA_VERSION,
        factory_key: factoryKey,
        remoteRef,
      });
      return {
        ok: true,
        status: "SUCCESS",
        packageId,
        canonicalContentChecksum: checksum,
        remoteKey,
        remoteRef,
        contentSha256,
        liveAttemptId,
        elrSkipped: true,
        localWritten: putResult.written,
        locator,
        exportMode: EXPORT_MODE_LIVE_VERSIONED,
        envelope: liveEnvelope,
        readiness,
      };
    }

    try {
      recordLiveVersionedExport(registry, factoryKey, {
        packageId,
        canonicalContentChecksum: checksum,
        exportSchemaVersion: EXPORT_SCHEMA_VERSION,
        remoteKey,
        contentSha256,
        remoteRef,
        liveAttemptId,
      });
    } catch (err) {
      liveExportMetrics.fail += 1;
      return {
        ok: false,
        status: "REMOTE_OK_ELR_PENDING",
        error: err.message,
        liveAttemptId,
        packageId,
        canonicalContentChecksum: checksum,
        remoteKey,
        remoteRef,
        contentSha256,
      };
    }

    liveExportMetrics.success += 1;
    const locator = buildDecisionPackageConsumerLocator({
      packageId,
      canonicalContentChecksum: checksum,
      remoteKey,
      exportSchemaVersion: EXPORT_SCHEMA_VERSION,
      factory_key: factoryKey,
      remoteRef,
    });

    return {
      ok: true,
      status: "SUCCESS",
      packageId,
      canonicalContentChecksum: checksum,
      remoteKey,
      remoteRef,
      contentSha256,
      liveAttemptId,
      elrSkipped: false,
      localWritten: putResult.written,
      locator,
      exportMode: EXPORT_MODE_LIVE_VERSIONED,
      envelope: liveEnvelope,
      readiness,
    };
  } catch (err) {
    liveExportMetrics.fail += 1;
    return {
      ok: false,
      status: err.code || "FAIL",
      error: err.message,
      liveAttemptId,
      packageId,
    };
  }
}

/**
 * Reconcile orphan: verified remote without Live ELR act.
 */
export function reconcilePendingLiveElrRef(args) {
  liveExportMetrics.reconcile += 1;
  const {
    registry,
    factoryKey,
    packageId,
    liveSink = new InMemoryDecisionPackageLiveSink(),
    principal = "FactoryOps",
    liveAttemptId = crypto.randomUUID(),
  } = args;

  assertValidFactoryKey(factoryKey);
  const remoteKey = resolveRemoteKey(factoryKey, packageId);
  const bytes = liveSink.get(remoteKey, { principal });
  const contentSha256 = sha256Hex(bytes);
  const envelope = JSON.parse(bytes);
  const checksum = envelope.canonicalContentChecksum;

  const expected = {
    contentSha256,
    canonicalContentChecksum: checksum,
    packageId,
    factory_key: factoryKey,
    exportMode: EXPORT_MODE_LIVE_VERSIONED,
    exportSchemaVersion: envelope.exportSchemaVersion,
  };
  liveSink.verify(remoteKey, expected, { principal });

  if (hasLiveElrAct(registry, factoryKey, checksum)) {
    return { ok: true, status: "ALREADY_LINKED", packageId, checksum, remoteKey };
  }

  const remoteRef = buildRemoteRef(remoteKey);
  recordLiveVersionedExport(registry, factoryKey, {
    packageId,
    canonicalContentChecksum: checksum,
    exportSchemaVersion: envelope.exportSchemaVersion,
    remoteKey,
    contentSha256,
    remoteRef,
    liveAttemptId,
  });

  return { ok: true, status: "RECONCILED", packageId, checksum, remoteKey, remoteRef };
}

/**
 * Detect orphan Live ELR acts without remote artifact (fail-closed report).
 */
export function detectOrphanLiveElrExports(args) {
  const {
    registry,
    factoryKey,
    liveSink = new InMemoryDecisionPackageLiveSink(),
  } = args;

  const record = registry.getExpediente(factoryKey);
  const handoffs = record?.elr?.decision_handoffs ?? [];
  const orphans = [];
  for (const h of handoffs) {
    if (h.kind !== "DHI_LIVE_VERSIONED_EXPORT") continue;
    const id = h.packageId;
    const key = h.remoteKey || (id ? resolveRemoteKey(factoryKey, id) : null);
    if (!key || !liveSink.exists?.(key)) {
      orphans.push({
        packageId: id ?? null,
        canonicalContentChecksum: h.canonicalContentChecksum ?? null,
        remoteKey: key,
        reason: "ELR_WITHOUT_ARTIFACT",
      });
    }
  }
  return { orphans, failClosed: orphans.length > 0 };
}

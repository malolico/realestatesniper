/**
 * CB-17 — Archive ledger (ST-ARC)
 *
 * Read-only ledgers; FFO-14 retention vida + 7 años.
 * Does not delete ELR history.
 */

import { RETENTION_YEARS, computeRetentionExpiry } from "../cb01/retentionPolicy.js";
import { snapshotElrHistory } from "./reopenProtocol.js";

export const ARCHIVE_ACTOR = "MOT-SYN-02";

export const ARCHIVE_ELR_KINDS = Object.freeze({
  ARCHIVE: "WU_ARCHIVE_ENTER",
  READ_ONLY: "WU_ARCHIVE_READ_ONLY",
  RETENTION: "WU_ARCHIVE_RETENTION_BOUND",
});

/**
 * @param {object} elr
 * @param {string|Date} archivedAt
 */
export function buildArchiveRetentionBound(elr, archivedAt) {
  const archived = archivedAt instanceof Date ? archivedAt : new Date(archivedAt);
  const expiresAt = computeRetentionExpiry(archived);
  return {
    retentionYears: RETENTION_YEARS,
    policyRef: "FFO-14",
    archivedAt: archived.toISOString(),
    expiresAt: expiresAt.toISOString(),
    historySnapshot: snapshotElrHistory(elr),
    readOnly: true,
  };
}

/**
 * Archive expediente → ST-ARC with read-only ledger binding.
 *
 * @param {import('../cb01/factoryRegistry.js').FactoryRegistry} registry
 * @param {string} factoryKey
 * @param {{ reason?: string }} [options]
 */
export function archiveExpediente(registry, factoryKey, options = {}) {
  const record = registry.getExpediente(factoryKey);
  if (!record) {
    throw new Error(`[CB-17 Archive] Expediente not found: ${factoryKey}`);
  }

  const archivable = ["ST-MON", "ST-UPD", "ST-PERF", "ST-DEC", "ST-CONS", "ST-RDY"];
  if (!archivable.includes(record.state) && record.state !== "ST-ARC") {
    throw new Error(
      `[CB-17 Archive] Cannot archive from state ${record.state}`
    );
  }

  const fromState = record.state;
  const before = snapshotElrHistory(record.elr);

  if (fromState !== "ST-ARC") {
    registry.transitionState(factoryKey, "ST-ARC", {
      actor: ARCHIVE_ACTOR,
      reason: options.reason ?? "CB-17 Archive — ledgers read-only (FFO-14)",
    });
  }

  const archived = registry.getExpediente(factoryKey);
  const retention = buildArchiveRetentionBound(archived.elr, archived.archivedAt);

  registry.registerElrAct(
    factoryKey,
    "loop_ledger_refs",
    {
      kind: ARCHIVE_ELR_KINDS.ARCHIVE,
      fromState,
      toState: "ST-ARC",
      reason: options.reason ?? "Archive inactive / Decision freeze / deal closed",
      historyBefore: before,
      constitutionalPhase: "CB-17",
    },
    { actor: ARCHIVE_ACTOR }
  );

  registry.registerElrAct(
    factoryKey,
    "loop_ledger_refs",
    {
      kind: ARCHIVE_ELR_KINDS.READ_ONLY,
      readOnly: true,
      message: "ELR ledgers bound read-only — no history wipe",
      constitutionalPhase: "CB-17",
    },
    { actor: ARCHIVE_ACTOR }
  );

  registry.registerElrAct(
    factoryKey,
    "loop_ledger_refs",
    {
      kind: ARCHIVE_ELR_KINDS.RETENTION,
      ...retention,
      constitutionalPhase: "CB-17",
    },
    { actor: ARCHIVE_ACTOR }
  );

  const after = snapshotElrHistory(registry.getExpediente(factoryKey).elr);
  for (const key of Object.keys(before)) {
    if ((after[key] ?? 0) < (before[key] ?? 0)) {
      throw new Error(`[CB-17 Archive] History wipe on ${key} — FFO-14 violated`);
    }
  }

  return {
    factoryKey,
    fromState,
    state: "ST-ARC",
    archivedAt: archived.archivedAt,
    retention,
    readOnly: true,
    historyPreserved: true,
    retentionYears: RETENTION_YEARS,
  };
}

/**
 * @param {object} elr
 */
export function isArchiveReadOnly(elr) {
  return (elr?.loop_ledger_refs ?? []).some(
    (r) => r.kind === ARCHIVE_ELR_KINDS.READ_ONLY && r.readOnly === true
  );
}

/**
 * @param {object} elr
 */
export function getArchiveRetention(elr) {
  return [...(elr?.loop_ledger_refs ?? [])]
    .reverse()
    .find((r) => r.kind === ARCHIVE_ELR_KINDS.RETENTION) ?? null;
}

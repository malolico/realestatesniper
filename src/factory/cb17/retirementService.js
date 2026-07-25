/**
 * CB-17 — Retirement Service (Watch / Update / Archive / Retirada hub)
 *
 * Coordinates post-Decision Factory lifecycle infrastructure.
 * ST-RET requires governance acta + FFO-14 retention eligibility.
 *
 * Does NOT: Decision Engine, IA, Product Catalog, Projection, Marketplace, Web, Supabase.
 */

import { isPhaseApproved } from "../cb00/constructionGovernance.js";
import { FactoryRegistry } from "../cb01/factoryRegistry.js";
import { isEligibleForRetirement, RETENTION_YEARS } from "../cb01/retentionPolicy.js";
import { enterWatchMode, isWatchModeActive } from "./watchMode.js";
import { runUpdateCycle, validateUpdateCyclePath, UPDATE_CYCLE_PATH } from "./updateCycle.js";
import { reopenExpediente } from "./reopenProtocol.js";
import {
  archiveExpediente,
  getArchiveRetention,
  isArchiveReadOnly,
} from "./archiveLedger.js";

export const RETIREMENT_ACTOR = "MOT-SYN-02";

export const RETIREMENT_ELR_KINDS = Object.freeze({
  ACTA: "WU_RETIREMENT_GOVERNANCE_ACTA",
  RETIRE: "WU_RETIREMENT_COMPLETE",
  REJECTED: "WU_RETIREMENT_REJECTED",
});

/**
 * @param {object} acta
 */
export function validateGovernanceActa(acta) {
  const errors = [];
  if (!acta || typeof acta !== "object") {
    return { valid: false, errors: ["Governance acta required for ST-RET"] };
  }
  if (!acta.actaId || typeof acta.actaId !== "string") {
    errors.push("actaId required");
  }
  if (!acta.approvedBy || typeof acta.approvedBy !== "string") {
    errors.push("approvedBy required (governance authority)");
  }
  if (!acta.reason || typeof acta.reason !== "string") {
    errors.push("reason required");
  }
  if (acta.retentionVerified !== true) {
    errors.push("retentionVerified must be true");
  }
  return { valid: errors.length === 0, errors };
}

export class RetirementService {
  /**
   * @param {{ registry?: FactoryRegistry }} [deps]
   */
  constructor(deps = {}) {
    if (!isPhaseApproved("CB-16")) {
      throw new Error(
        "[CB-17 Watch/Update/Archive] CB-16 must be APPROVED before CB-17"
      );
    }
    this.registry = deps.registry ?? new FactoryRegistry();
  }

  /**
   * @param {string} factoryKey
   * @param {object} [options]
   */
  enterWatch(factoryKey, options = {}) {
    return enterWatchMode(this.registry, factoryKey, options);
  }

  /**
   * @param {string} factoryKey
   * @param {object} [options]
   */
  runUpdate(factoryKey, options = {}) {
    return runUpdateCycle(this.registry, factoryKey, options);
  }

  /**
   * ACT-V material reopen (REO-01) — history preserved.
   * @param {string} factoryKey
   * @param {object} [options]
   */
  reopen(factoryKey, options = {}) {
    return reopenExpediente(this.registry, factoryKey, {
      ...options,
      driveUpdateCycle: options.driveUpdateCycle ?? false,
      runUpdateCycle,
    });
  }

  /**
   * REO-01 + full update cycle from ST-MON.
   * @param {string} factoryKey
   * @param {object} [options]
   */
  reopenAndUpdate(factoryKey, options = {}) {
    return reopenExpediente(this.registry, factoryKey, {
      ...options,
      driveUpdateCycle: true,
      runUpdateCycle,
    });
  }

  /**
   * @param {string} factoryKey
   * @param {object} [options]
   */
  archive(factoryKey, options = {}) {
    return archiveExpediente(this.registry, factoryKey, options);
  }

  /**
   * Evaluate retirement eligibility (FFO-14).
   * @param {string} factoryKey
   * @param {{ now?: Date }} [options]
   */
  evaluateRetirement(factoryKey, options = {}) {
    const record = this.registry.getExpediente(factoryKey);
    if (!record) {
      return { eligible: false, reason: "not_found" };
    }
    const now = options.now ?? new Date();
    const eligible = isEligibleForRetirement(record, now);
    return {
      eligible,
      reason: eligible
        ? "retention_satisfied"
        : record.state !== "ST-ARC"
          ? "not_archived"
          : "retention_not_elapsed",
      state: record.state,
      archivedAt: record.archivedAt ?? null,
      retentionYears: RETENTION_YEARS,
      now: now.toISOString(),
    };
  }

  /**
   * ST-ARC → ST-RET — requires governance acta + retention eligibility.
   *
   * @param {string} factoryKey
   * @param {{
   *   governanceActa: object,
   *   now?: Date,
   * }} options
   */
  retire(factoryKey, options = {}) {
    const actaCheck = validateGovernanceActa(options.governanceActa);
    if (!actaCheck.valid) {
      throw new Error(
        `[CB-17 Retirement] Governance acta invalid: ${actaCheck.errors.join("; ")}`
      );
    }

    const record = this.registry.getExpediente(factoryKey);
    if (!record) {
      throw new Error(`[CB-17 Retirement] Expediente not found: ${factoryKey}`);
    }
    if (record.state !== "ST-ARC") {
      throw new Error(`[CB-17 Retirement] Expected ST-ARC, got ${record.state}`);
    }

    const now = options.now ?? new Date();
    if (!isEligibleForRetirement(record, now)) {
      this.registry.registerElrAct(
        factoryKey,
        "loop_ledger_refs",
        {
          kind: RETIREMENT_ELR_KINDS.REJECTED,
          reason: "retention_not_elapsed",
          retentionYears: RETENTION_YEARS,
          archivedAt: record.archivedAt,
          constitutionalPhase: "CB-17",
        },
        { actor: RETIREMENT_ACTOR }
      );
      throw new Error(
        `[CB-17 Retirement] FFO-14 retention not elapsed (${RETENTION_YEARS} years)`
      );
    }

    this.registry.registerElrAct(
      factoryKey,
      "loop_ledger_refs",
      {
        kind: RETIREMENT_ELR_KINDS.ACTA,
        actaId: options.governanceActa.actaId,
        approvedBy: options.governanceActa.approvedBy,
        reason: options.governanceActa.reason,
        retentionVerified: true,
        constitutionalPhase: "CB-17",
      },
      { actor: RETIREMENT_ACTOR }
    );

    this.registry.transitionState(factoryKey, "ST-RET", {
      actor: RETIREMENT_ACTOR,
      reason: `CB-17 Retirement — acta ${options.governanceActa.actaId}`,
    });

    this.registry.registerElrAct(
      factoryKey,
      "loop_ledger_refs",
      {
        kind: RETIREMENT_ELR_KINDS.RETIRE,
        actaId: options.governanceActa.actaId,
        state: "ST-RET",
        elrClosed: true,
        constitutionalPhase: "CB-17",
      },
      { actor: RETIREMENT_ACTOR }
    );

    const finalRecord = this.registry.getExpediente(factoryKey);
    return {
      factoryKey,
      state: finalRecord.state,
      retiredAt: finalRecord.retiredAt,
      governanceActa: {
        actaId: options.governanceActa.actaId,
        approvedBy: options.governanceActa.approvedBy,
      },
      elrClosed: true,
      retentionYears: RETENTION_YEARS,
    };
  }

  /**
   * Full post-Decision pilot path: Watch → REO-01 Update → Archive → (optional) Retire.
   *
   * @param {string} factoryKey — must be ST-DEC (CB-16 handoff complete)
   * @param {{
   *   retire?: boolean,
   *   governanceActa?: object,
   *   now?: Date,
   *   eventType?: string,
   * }} [options]
   */
  runPostDecisionLifecycle(factoryKey, options = {}) {
    const watch = this.enterWatch(factoryKey);
    const reopen = this.reopenAndUpdate(factoryKey, {
      eventType: options.eventType ?? "material_filing",
    });
    const archive = this.archive(factoryKey, {
      reason: "CB-17 pilot archive after update cycle",
    });

    let retirement = null;
    if (options.retire === true) {
      retirement = this.retire(factoryKey, {
        governanceActa: options.governanceActa,
        now: options.now,
      });
    }

    const record = this.registry.getExpediente(factoryKey);
    return {
      factoryKey,
      state: record.state,
      watch,
      reopen,
      archive,
      retirement,
      updatePath: UPDATE_CYCLE_PATH,
      pathValid: validateUpdateCyclePath().valid,
      watchActive: isWatchModeActive(record.elr),
      archiveReadOnly: isArchiveReadOnly(record.elr),
      retention: getArchiveRetention(record.elr),
    };
  }

  /**
   * @param {string} factoryKey
   */
  getLifecycleLineage(factoryKey) {
    const record = this.registry.getExpediente(factoryKey);
    const events = (record?.elr?.loop_ledger_refs ?? []).filter((r) =>
      String(r.kind ?? "").startsWith("WU_")
    );
    return {
      factory_key: factoryKey,
      state: record?.state,
      events,
      watchActive: isWatchModeActive(record?.elr),
      archiveReadOnly: isArchiveReadOnly(record?.elr),
      retention: getArchiveRetention(record?.elr),
    };
  }
}

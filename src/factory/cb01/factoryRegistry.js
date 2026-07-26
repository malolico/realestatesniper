/**
 * CB-01 — Factory Registry
 * Create, query, and lifecycle management for expedientes with ELR traceability.
 */

import fs from "node:fs";
import { isPhaseApproved } from "../cb00/constructionGovernance.js";
import { assertCatalogActor } from "../cb00/catalogActorGuard.js";
import { isValidExpedienteState } from "../cb00/operationalVocabulary.js";
import { appendElrEntry, createEmptyElr } from "./elrSchema.js";
import {
  assertValidFactoryKey,
  buildFactoryKeyHistoryEntry,
  createProvisionalFactoryKey,
  isProvisionalFactoryKey,
} from "./factoryKey.js";
import { FileElrStore } from "./fileElrStore.js";
import { isEligibleForRetirement } from "./retentionPolicy.js";
import {
  assertTransitionAllowed,
  INITIAL_EXPEDIENTE_STATE,
} from "./stateMachine.js";

export class FactoryRegistry {
  /**
   * @param {{ store?: FileElrStore, requireCb00Approval?: boolean }} [options]
   */
  constructor(options = {}) {
    if (options.requireCb00Approval !== false && !isPhaseApproved("CB-00")) {
      throw new Error("[CB-01 Registry] CB-00 must be APPROVED before using Factory Registry");
    }
    this.store = options.store ?? new FileElrStore();
  }

  /**
   * @param {{ candidateRef?: string, factoryKey?: string, actor?: string }} input
   */
  createExpediente(input = {}) {
    const factoryKey = input.factoryKey ?? createProvisionalFactoryKey(input.candidateRef);
    assertValidFactoryKey(factoryKey);

    if (this.store.exists(factoryKey)) {
      throw new Error(`[CB-01 Registry] Expediente already exists: ${factoryKey}`);
    }

    const actor = input.actor ?? "FactoryRegistry";
    const now = new Date().toISOString();
    const elr = createEmptyElr(factoryKey, {
      candidateRef: input.candidateRef,
      createdBy: actor,
    });

    appendElrEntry(elr, "state_transitions", {
      from: null,
      to: INITIAL_EXPEDIENTE_STATE,
      actor,
      reason: "expediente_birth",
      at: now,
    });

    const record = {
      factory_key: factoryKey,
      state: INITIAL_EXPEDIENTE_STATE,
      keyStatus: isProvisionalFactoryKey(factoryKey) ? "provisional" : "definitive",
      candidateRef: input.candidateRef ?? null,
      createdAt: now,
      archivedAt: null,
      retiredAt: null,
      elr,
    };

    this.store.write(record);
    return record;
  }

  /**
   * @param {string} factoryKey
   */
  getExpediente(factoryKey) {
    assertValidFactoryKey(factoryKey);
    return this.store.read(factoryKey);
  }

  /**
   * @param {string} factoryKey
   */
  getLineage(factoryKey) {
    const record = this.getExpediente(factoryKey);
    if (!record) {
      throw new Error(`[CB-01 Registry] Expediente not found: ${factoryKey}`);
    }
    return {
      factory_key: record.factory_key,
      state: record.state,
      keyStatus: record.keyStatus,
      elr: record.elr,
      createdAt: record.createdAt,
      archivedAt: record.archivedAt,
      retiredAt: record.retiredAt,
    };
  }

  /**
   * @param {string} factoryKey
   * @param {string} toState
   * @param {{ actor: string, reason?: string }} context
   */
  transitionState(factoryKey, toState, context) {
    if (!isValidExpedienteState(toState)) {
      throw new Error(`[CB-01 Registry] Invalid state: ${toState}`);
    }
    assertCatalogActor(context.actor);

    const record = this.getExpediente(factoryKey);
    if (!record) {
      throw new Error(`[CB-01 Registry] Expediente not found: ${factoryKey}`);
    }

    const fromState = record.state;
    assertTransitionAllowed(fromState, toState);

    const at = new Date().toISOString();
    appendElrEntry(record.elr, "state_transitions", {
      from: fromState,
      to: toState,
      actor: context.actor,
      reason: context.reason ?? "state_transition",
      at,
    });

    record.state = toState;
    if (toState === "ST-ARC") {
      record.archivedAt = at;
    }
    if (toState === "ST-RET") {
      record.retiredAt = at;
    }

    this.store.write(record);
    return record;
  }

  /**
   * @param {string} provisionalKey
   * @param {string} definitiveKey
   * @param {{ actor?: string, reason?: string }} [context]
   */
  resolveFactoryKey(provisionalKey, definitiveKey, context = {}) {
    if (!isProvisionalFactoryKey(provisionalKey)) {
      throw new Error(`[CB-01 Registry] Expected provisional key: ${provisionalKey}`);
    }
    assertValidFactoryKey(definitiveKey);

    const record = this.getExpediente(provisionalKey);
    if (!record) {
      throw new Error(`[CB-01 Registry] Expediente not found: ${provisionalKey}`);
    }

    if (this.store.exists(definitiveKey) && definitiveKey !== provisionalKey) {
      throw new Error(`[CB-01 Registry] Definitive key already in use: ${definitiveKey}`);
    }

    const actor = context.actor ?? "MOT-IDN-01";
    assertCatalogActor(actor);

    const historyEntry = buildFactoryKeyHistoryEntry(
      provisionalKey,
      definitiveKey,
      actor,
      context.reason
    );
    appendElrEntry(record.elr, "factory_key_history", historyEntry);

    const oldPath = this.store.resolvePath(provisionalKey);
    record.factory_key = definitiveKey;
    record.keyStatus = "definitive";
    record.elr.factory_key = definitiveKey;
    record.elr.elrId = `ELR-${definitiveKey}`;

    this.store.write(record);

    if (definitiveKey !== provisionalKey) {
      const newPath = this.store.resolvePath(definitiveKey);
      if (oldPath !== newPath && fs.existsSync(oldPath)) {
        fs.unlinkSync(oldPath);
      }
      // Optional store lifecycle (P-INT-03 AtomicFileElrStore): clean sidecar/temps/bak.
      // Absent on FileElrStore — backward-compatible no-op. Does not alter resolveFactoryKey semantics.
      if (typeof this.store.removeArtifacts === "function") {
        this.store.removeArtifacts(provisionalKey);
      }
    }

    return record;
  }

  /**
   * @param {string} factoryKey
   * @param {import('./elrSchema.js').ElrSection} section
   * @param {object} entry
   * @param {{ actor: string }} context
   */
  registerElrAct(factoryKey, section, entry, context) {
    assertCatalogActor(context.actor);
    const record = this.getExpediente(factoryKey);
    if (!record) {
      throw new Error(`[CB-01 Registry] Expediente not found: ${factoryKey}`);
    }
    appendElrEntry(record.elr, section, {
      ...entry,
      actor: context.actor,
    });
    this.store.write(record);
    return record;
  }

  /**
   * @param {string} factoryKey
   */
  evaluateRetirementEligibility(factoryKey) {
    const record = this.getExpediente(factoryKey);
    if (!record) return { eligible: false, reason: "not_found" };
    return {
      eligible: isEligibleForRetirement(record),
      archivedAt: record.archivedAt,
      state: record.state,
    };
  }

  listExpedientes() {
    return this.store.listFactoryKeys();
  }
}

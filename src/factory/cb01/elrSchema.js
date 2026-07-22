/**
 * CB-01 — Expediente Lineage Record (ELR) schema — FFO §III.12 / TRZ-01
 */

import { retentionPolicySummary } from "./retentionPolicy.js";

/**
 * @param {string} factoryKey
 * @param {{ candidateRef?: string, createdBy?: string }} [meta]
 */
export function createEmptyElr(factoryKey, meta = {}) {
  const now = new Date().toISOString();
  return {
    elrId: `ELR-${factoryKey}`,
    factory_key: factoryKey,
    factory_key_history: [],
    state_transitions: [],
    motor_manifests: [],
    loop_ledger_refs: [],
    swarm_mission_refs: [],
    aia_rlg_refs: [],
    evidence_registry_ref: null,
    conflict_resolutions: [],
    decision_handoffs: [],
    retention_policy: retentionPolicySummary(),
    metadata: {
      candidateRef: meta.candidateRef ?? null,
      createdBy: meta.createdBy ?? "FactoryRegistry",
      createdAt: now,
      constitutionalPhase: "CB-01",
    },
  };
}

/** @typedef {'state_transitions'|'motor_manifests'|'loop_ledger_refs'|'swarm_mission_refs'|'aia_rlg_refs'|'conflict_resolutions'|'decision_handoffs'|'factory_key_history'} ElrSection */

export const ELR_SECTIONS = Object.freeze([
  "factory_key_history",
  "state_transitions",
  "motor_manifests",
  "loop_ledger_refs",
  "swarm_mission_refs",
  "aia_rlg_refs",
  "conflict_resolutions",
  "decision_handoffs",
]);

/**
 * @param {string} section
 */
export function isElrArraySection(section) {
  return ELR_SECTIONS.includes(section);
}

/**
 * @param {ReturnType<createEmptyElr>} elr
 * @param {ElrSection} section
 * @param {object} entry
 */
export function appendElrEntry(elr, section, entry) {
  if (!isElrArraySection(section)) {
    throw new Error(`[CB-01 ELR] Unknown section: ${section}`);
  }
  const record = {
    ...entry,
    recordedAt: entry.recordedAt ?? new Date().toISOString(),
    elrSequence: elr[section].length + 1,
  };
  elr[section].push(record);
  return record;
}

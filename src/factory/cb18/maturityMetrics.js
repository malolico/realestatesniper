/**
 * CB-18 — Maturity metrics (LFF-12)
 *
 * Completeness DDI, C global, sufficiency EVD, readiness SYN-02.
 * Sourced from CB-01 ELR + CB-15 maturity / orchestration events.
 */

import { calculateMaturityScore } from "../cb15/maturityScore.js";

/**
 * Extract maturity_score previously recorded by Orchestration Bus (CB-15).
 * @param {object} record — expediente (CB-01)
 */
export function extractOrchestrationMaturity(record) {
  const ledger = record?.elr?.loop_ledger_refs ?? [];
  const complete = [...ledger].reverse().find((e) => e.kind === "FFO_ORCHESTRATION_COMPLETE");
  if (complete?.maturity_score == null && complete?.maturity_score !== 0) {
    return null;
  }
  return {
    maturity_score: complete.maturity_score,
    source: "FFO_ORCHESTRATION_COMPLETE",
    state: complete.state ?? record?.state ?? null,
  };
}

/**
 * Read G0–G6 evaluation from ELR (recorded during Factory pipeline → CB-15 bus).
 * @param {object} record
 */
export function extractReadinessGates(record) {
  const manifests = record?.elr?.motor_manifests ?? [];
  const ledger = record?.elr?.loop_ledger_refs ?? [];
  const evalEntry =
    [...manifests].reverse().find((e) => e.kind === "EVF_READINESS_GATE_EVAL") ??
    [...ledger].reverse().find((e) => e.kind === "EVF_READINESS_GATE_EVAL");

  if (!evalEntry) {
    return {
      available: false,
      allPass: false,
      gates: [],
      passCount: 0,
      gateCount: 0,
      reproducible: false,
    };
  }

  return {
    available: true,
    allPass: evalEntry.allPass === true,
    gates: evalEntry.gates ?? [],
    passCount: evalEntry.passCount ?? 0,
    gateCount: evalEntry.gateCount ?? evalEntry.gates?.length ?? 0,
    reproducible: true,
    source: "EVF_READINESS_GATE_EVAL",
  };
}

/**
 * Build maturity metrics panel for one expediente.
 * @param {object} record
 * @param {{
 *   mpiCoveragePercent?: number,
 *   sufficiencyStatus?: string,
 *   identityConfidence?: string,
 * }} [hints]
 */
export function buildMaturityMetrics(record, hints = {}) {
  const fromBus = extractOrchestrationMaturity(record);
  const gates = extractReadinessGates(record);

  const computed = calculateMaturityScore({
    mpiCoveragePercent: hints.mpiCoveragePercent ?? 0.8,
    sufficiencyStatus: hints.sufficiencyStatus ?? "PASS",
    readinessGatesPass: gates.allPass,
    identityConfidence: hints.identityConfidence ?? "C2",
    state: record?.state,
  });

  return {
    factory_key: record?.factory_key ?? null,
    state: record?.state ?? null,
    maturity_score: fromBus?.maturity_score ?? computed.maturity_score,
    source: fromBus ? fromBus.source : "LFF-12_COMPUTED",
    components: computed.components,
    formula: computed.formula,
    rule: "LFF-12",
    readinessGates: gates,
    g0g6Reproducible: gates.reproducible && gates.gateCount === 7,
  };
}

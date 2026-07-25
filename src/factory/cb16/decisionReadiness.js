/**
 * CB-16 — Decision readiness verification
 *
 * Verifies expediente completeness, evidence presence, required scores,
 * and G0–G6 PASS — without re-executing motors, IA, or layers.
 */

import { isDecisionHandoffEnabled } from "../cb13/decisionHandoffPrep.js";
import { SUFFICIENCY_STATUS } from "../cb06/sufficiencyGate.js";
import {
  REQUIRED_ELR_SECTIONS,
  REQUIRED_HANDOFF_MOTORS,
  REQUIRED_SCORES,
} from "./decisionPackageSchema.js";

/**
 * @param {object} record — expediente record
 */
export function checkExpedienteCompleteness(record) {
  const errors = [];
  if (!record?.factory_key) {
    errors.push("factory_key missing");
  }
  if (record?.state !== "ST-RDY" && record?.state !== "ST-DEC") {
    errors.push(`Expediente must be ST-RDY (or ST-DEC post-handoff), got ${record?.state}`);
  }

  const elr = record?.elr ?? {};
  for (const section of REQUIRED_ELR_SECTIONS) {
    if (!Array.isArray(elr[section])) {
      errors.push(`ELR section missing or invalid: ${section}`);
    }
  }

  if (!isDecisionHandoffEnabled(elr) && record?.state === "ST-RDY") {
    errors.push("DECISION_HANDOFF_PREP_CB16 not present — CB-13 prep required");
  }

  return { ok: errors.length === 0, errors };
}

/**
 * @param {object} record
 * @param {{ evidenceRef?: object|null, sufficiencyStatus?: string|null }} [hints]
 */
export function checkRequiredEvidence(record, hints = {}) {
  const errors = [];
  const elr = record?.elr ?? {};
  const evidenceRef = hints.evidenceRef ?? elr.evidence_registry_ref ?? null;

  if (!evidenceRef) {
    errors.push("evidence_registry_ref missing on ELR");
  }

  const sufficiencyStatus = hints.sufficiencyStatus ?? null;
  if (sufficiencyStatus && sufficiencyStatus !== SUFFICIENCY_STATUS.PASS) {
    errors.push(`Evidence sufficiency must be PASS, got ${sufficiencyStatus}`);
  }

  const manifests = elr.motor_manifests ?? [];
  for (const motorId of REQUIRED_HANDOFF_MOTORS) {
    const found = manifests.some((m) => m.motorId === motorId || m.outputs?.motorId === motorId);
    if (!found) {
      errors.push(`Required motor evidence/manifest missing: ${motorId}`);
    }
  }

  return {
    ok: errors.length === 0,
    errors,
    evidenceRef,
    requiredMotorsPresent: REQUIRED_HANDOFF_MOTORS.every((id) =>
      manifests.some((m) => m.motorId === id || m.outputs?.motorId === id)
    ),
  };
}

/**
 * Extract maturity_score from ELR FFO completion / aggregation events.
 * @param {object} record
 * @param {{ maturity_score?: number }} [hints]
 */
export function extractScores(record, hints = {}) {
  const scores = {};
  if (hints.maturity_score != null) {
    scores.maturity_score = hints.maturity_score;
  }

  const ledger = record?.elr?.loop_ledger_refs ?? [];
  const complete = [...ledger].reverse().find((e) => e.kind === "FFO_ORCHESTRATION_COMPLETE");
  if (complete?.maturity_score != null && scores.maturity_score == null) {
    scores.maturity_score = complete.maturity_score;
  }

  return scores;
}

/**
 * @param {object} record
 * @param {{ maturity_score?: number }} [hints]
 */
export function checkRequiredScores(record, hints = {}) {
  const errors = [];
  const scores = extractScores(record, hints);

  for (const key of REQUIRED_SCORES) {
    if (scores[key] == null && scores[key] !== 0) {
      errors.push(`Required score missing: ${key}`);
    } else if (typeof scores[key] !== "number" || scores[key] < 0 || scores[key] > 1) {
      errors.push(`Score ${key} must be a number in [0,1]`);
    }
  }

  return { ok: errors.length === 0, errors, scores };
}

/**
 * Read G0–G6 evaluation previously recorded by CB-13 (do not re-run gates).
 * CB-13 stores EVF_READINESS_GATE_EVAL under motor_manifests (readinessLedger).
 * @param {object} record
 */
export function checkReadinessGatesFromElr(record) {
  const errors = [];
  const manifests = record?.elr?.motor_manifests ?? [];
  const ledger = record?.elr?.loop_ledger_refs ?? [];
  const evalEntry =
    [...manifests].reverse().find((e) => e.kind === "EVF_READINESS_GATE_EVAL") ??
    [...ledger].reverse().find((e) => e.kind === "EVF_READINESS_GATE_EVAL");

  if (!evalEntry) {
    errors.push("EVF_READINESS_GATE_EVAL missing — G0–G6 not recorded");
    return { ok: false, errors, allPass: false, gates: [], passCount: 0, gateCount: 0 };
  }

  if (evalEntry.allPass !== true) {
    errors.push(`G0–G6 not all PASS (${evalEntry.passCount}/${evalEntry.gateCount})`);
  }

  if ((evalEntry.gateCount ?? evalEntry.gates?.length) !== 7) {
    errors.push(`Expected 7 readiness gates G0–G6, got ${evalEntry.gateCount ?? evalEntry.gates?.length}`);
  }

  return {
    ok: errors.length === 0,
    errors,
    allPass: evalEntry.allPass === true,
    gates: evalEntry.gates ?? [],
    passCount: evalEntry.passCount ?? 0,
    gateCount: evalEntry.gateCount ?? 0,
  };
}

/**
 * Aggregate readiness check for Decision Package construction.
 * @param {object} record
 * @param {{
 *   evidenceRef?: object|null,
 *   sufficiencyStatus?: string|null,
 *   maturity_score?: number,
 * }} [hints]
 */
export function evaluateDecisionReadiness(record, hints = {}) {
  const completeness = checkExpedienteCompleteness(record);
  const evidence = checkRequiredEvidence(record, hints);
  const scores = checkRequiredScores(record, hints);
  const gates = checkReadinessGatesFromElr(record);

  const errors = [
    ...completeness.errors,
    ...evidence.errors,
    ...scores.errors,
    ...gates.errors,
  ];

  return {
    ready: errors.length === 0,
    errors,
    completeness,
    evidence,
    scores: scores.scores,
    gates,
    handoffPrepEnabled: isDecisionHandoffEnabled(record?.elr),
    state: record?.state,
    factory_key: record?.factory_key,
  };
}

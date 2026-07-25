/**
 * CB-16 — Decision Package builder
 *
 * Assembles a single Decision Package from the ST-RDY expediente.
 * Does not execute motors, IA, or commercial classification.
 */

import {
  DECISION_HANDOFF_INTERFACE_ID,
  DECISION_PACKAGE_VERSION,
  REQUIRED_HANDOFF_MOTORS,
  validateDecisionPackageShape,
} from "./decisionPackageSchema.js";
import { evaluateDecisionReadiness } from "./decisionReadiness.js";

/**
 * @param {object[]} manifests
 * @param {string} motorId
 */
function findMotorSlice(manifests, motorId) {
  const manifest = manifests.find((m) => m.motorId === motorId || m.outputs?.motorId === motorId);
  if (!manifest) return null;
  return {
    motorId,
    runId: manifest.runId ?? null,
    status: manifest.status ?? manifest.outputs?.status ?? null,
    outputs: manifest.outputs ?? null,
    constitutionalPhase: manifest.constitutionalPhase ?? null,
    present: true,
  };
}

/**
 * @param {object} elr
 */
function buildElrExport(elr) {
  return {
    factory_key: elr?.factory_key ?? null,
    elrId: elr?.elrId ?? null,
    sections: {
      state_transitions: elr?.state_transitions ?? [],
      motor_manifests: elr?.motor_manifests ?? [],
      loop_ledger_refs: elr?.loop_ledger_refs ?? [],
      swarm_mission_refs: elr?.swarm_mission_refs ?? [],
      aia_rlg_refs: elr?.aia_rlg_refs ?? [],
      conflict_resolutions: elr?.conflict_resolutions ?? [],
      decision_handoffs: elr?.decision_handoffs ?? [],
      factory_key_history: elr?.factory_key_history ?? [],
    },
    evidence_registry_ref: elr?.evidence_registry_ref ?? null,
    sectionCounts: {
      state_transitions: (elr?.state_transitions ?? []).length,
      motor_manifests: (elr?.motor_manifests ?? []).length,
      loop_ledger_refs: (elr?.loop_ledger_refs ?? []).length,
      swarm_mission_refs: (elr?.swarm_mission_refs ?? []).length,
      aia_rlg_refs: (elr?.aia_rlg_refs ?? []).length,
      conflict_resolutions: (elr?.conflict_resolutions ?? []).length,
      decision_handoffs: (elr?.decision_handoffs ?? []).length,
      factory_key_history: (elr?.factory_key_history ?? []).length,
    },
  };
}

/**
 * Build the unique Decision Package for the future Decision Engine.
 *
 * @param {object} record — expediente record (ST-RDY)
 * @param {{
 *   evidenceRef?: object|null,
 *   sufficiencyStatus?: string|null,
 *   maturity_score?: number,
 *   elrSnapshot?: object|null,
 * }} [hints]
 */
export function buildDecisionPackage(record, hints = {}) {
  const readiness = evaluateDecisionReadiness(record, hints);
  if (!readiness.ready) {
    return {
      ok: false,
      errors: readiness.errors,
      package: null,
      readiness,
    };
  }

  const elr = record.elr ?? {};
  const manifests = elr.motor_manifests ?? [];
  /** @type {Record<string, object>} */
  const motors = {};
  for (const motorId of REQUIRED_HANDOFF_MOTORS) {
    motors[motorId] = findMotorSlice(manifests, motorId);
  }

  const pkg = {
    meta: {
      version: DECISION_PACKAGE_VERSION,
      interfaceId: DECISION_HANDOFF_INTERFACE_ID,
      builtAt: new Date().toISOString(),
      constitutionalPhase: "CB-16",
      purpose: "Factory → Decision calibrated corpus handoff",
    },
    identity: {
      factory_key: record.factory_key,
      state: record.state,
      keyStatus: record.keyStatus ?? null,
    },
    readiness: {
      gates: readiness.gates.gates,
      allPass: readiness.gates.allPass,
      passCount: readiness.gates.passCount,
      gateCount: readiness.gates.gateCount,
      handoffPrepEnabled: readiness.handoffPrepEnabled,
    },
    motors,
    evidence: {
      registryRef: readiness.evidence.evidenceRef,
      sufficiencyStatus: hints.sufficiencyStatus ?? null,
      requiredMotorsPresent: readiness.evidence.requiredMotorsPresent,
    },
    scores: {
      ...readiness.scores,
    },
    elrExport: buildElrExport(elr),
    boundary: {
      decides: false,
      classifiesDeal: false,
      classifiesPremium: false,
      classifiesDiamond: false,
      assignsAccessTier: false,
      setsPricing: false,
      executesAi: false,
      executesMotors: false,
      modifiesFoundation: false,
      modifiesEvidence: false,
      modifiesRuntime: false,
      freezeAfterHandoff: true,
      target: "DecisionEngine",
      rules: ["FFO-06", "LFF-07"],
    },
  };

  if (hints.elrSnapshot) {
    pkg.elrExport.orchestrationSnapshot = hints.elrSnapshot;
  }

  const shape = validateDecisionPackageShape(pkg);
  if (!shape.valid) {
    return { ok: false, errors: shape.errors, package: null, readiness };
  }

  return { ok: true, errors: [], package: pkg, readiness };
}

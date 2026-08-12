/**
 * CB-16 — Decision Package builder
 *
 * Assembles a single Decision Package from the ST-RDY expediente.
 * Does not execute motors, IA, or commercial classification.
 *
 * PS05-01: attaches trust boundary classification; refuses when
 * requireTrustedDecisionFacts and corpus is synthetic/stub/unavailable contaminated.
 */

import {
  evaluateDecisionTrustContamination,
  isDecisionPackageTrusted,
} from "../cb05/decisionTrustBoundary.js";
import {
  DECISION_HANDOFF_INTERFACE_ID,
  DECISION_PACKAGE_VERSION,
  REQUIRED_HANDOFF_MOTORS,
  validateDecisionPackageShape,
} from "./decisionPackageSchema.js";
import { evaluateDecisionReadiness } from "./decisionReadiness.js";
import { FRESHNESS_STATE } from "../cb02/decisionFactEnvelope.js";
import { exportConflicts } from "../cb06/conflictExport.js";
import { buildComputedKnownUnknowns } from "../cb13/knownUnknownsRegistry.js";

/**
 * Build PS05-03 truth-accounting slice (completeness ≠ quality).
 * @param {object} record
 * @param {object} hints
 * @param {object} trust
 */
function buildTruthAccounting(record, hints, trust) {
  const canonicalFact = hints.canonicalPropertyFact ?? hints.canonicalFact ?? null;
  const propertyIdentity = hints.propertyIdentity ?? null;
  const sourceCompleteness =
    hints.sourceCompleteness ?? canonicalFact?.sourceCompleteness ?? null;
  const factCompleteness = hints.factCompleteness ?? canonicalFact?.factCompleteness ?? null;
  const conflicts =
    hints.conflicts ??
    exportConflicts(hints.conflictRecords ?? record.elr?.conflict_resolutions ?? []);
  const computedUnknowns =
    hints.unknowns ??
    buildComputedKnownUnknowns(record.factory_key ?? "decision", [], {
      canonicalFact,
      propertyIdentity,
      payloadsByOrganism: hints.payloadsByOrganism ?? null,
      sourceRefsByOrganism: hints.sourceRefsByOrganism ?? null,
      skipPackLoad: hints.skipPackLoad === true || !canonicalFact,
    }).unknowns;

  const freshnessState =
    hints.freshnessState ??
    canonicalFact?.provenanceMeta?.freshnessState ??
    FRESHNESS_STATE.UNKNOWN_FRESHNESS;

  return {
    schemaId: "rsn.decision.truthAccounting.v1",
    facts: factCompleteness?.facts ?? hints.factEnvelopes ?? [],
    sourceCompleteness,
    factCompleteness,
    conflicts,
    unknowns: computedUnknowns,
    freshness: {
      freshnessState,
      unknownFreshnessIsNotCurrent: freshnessState !== FRESHNESS_STATE.CURRENT,
      stalePreserved: freshnessState === FRESHNESS_STATE.STALE,
    },
    provenance: {
      hasSourceRefLineage: Boolean(
        canonicalFact?.provenanceMeta?.primarySourceRefId ||
          canonicalFact?.sourceIdentity?.sourceRefIds
      ),
      primarySourceRefId: canonicalFact?.provenanceMeta?.primarySourceRefId ?? null,
    },
    completenessIsNotQuality: true,
    readinessIsNotQuality: true,
    trustStatus: trust.status,
    decisionTrusted: trust.decisionTrusted === true,
    constitutionalPhase: "PS05-03",
  };
}

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
 *   requireTrustedDecisionFacts?: boolean,
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

  const trust = evaluateDecisionTrustContamination(elr, { motors });

  if (hints.requireTrustedDecisionFacts === true && !isDecisionPackageTrusted(trust)) {
    return {
      ok: false,
      errors: [
        "PS05-01: Decision Package refused — contaminated synthetic/stub/unavailable facts",
        ...trust.reasons,
      ],
      package: null,
      readiness,
      trust,
    };
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
    trust: {
      status: trust.status,
      decisionTrusted: trust.decisionTrusted,
      contaminated: trust.contaminated,
      reasons: [...trust.reasons],
      rule: trust.rule,
    },
    truthAccounting: buildTruthAccounting(record, hints, trust),
  };

  if (hints.elrSnapshot) {
    pkg.elrExport.orchestrationSnapshot = hints.elrSnapshot;
  }

  const shape = validateDecisionPackageShape(pkg);
  if (!shape.valid) {
    return { ok: false, errors: shape.errors, package: null, readiness, trust };
  }

  return { ok: true, errors: [], package: pkg, readiness, trust };
}

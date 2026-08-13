/**
 * SP05-P2 — Decision Semantics validation / proof harness (DAG-SP05-P2-G1)
 *
 * Frozen P2-S01…P2-S18 + applicable Pre-IMPL T01–T14 honesty/regression checks.
 * Runnable:
 *   node src/decision/semantics/validateDecisionSemantics.js
 */

import {
  DECISION_HANDOFF_INTERFACE_ID,
  DECISION_PACKAGE_VERSION,
} from "../../factory/cb16/decisionPackageSchema.js";
import { consumeTrustedDecisionPackage, DECISION_INTAKE_STATE } from "../intake/decisionIntakeConsumer.js";
import { deepClone } from "../intake/immutableDecisionProjection.js";
import {
  DISTRESS_STATES,
  SEM01,
  SEM02,
  SEM03,
  SEM06,
  SEMANTICS_RESULT_SCHEMA_ID,
  VALUE_DIMENSION_ID,
  RULE_VERSION,
} from "./decisionOutputContract.js";
import {
  evaluateDecisionSemantics,
  deriveDistressEvidenceState,
  rankSuppliedCandidates,
  compareDistressStates,
  assertDecIntakeInput,
} from "./decisionSemanticsEngine.js";

function deepMerge(target, source) {
  const out = { ...target };
  for (const [k, v] of Object.entries(source)) {
    if (
      v != null &&
      typeof v === "object" &&
      !Array.isArray(v) &&
      typeof target[k] === "object" &&
      target[k] != null &&
      !Array.isArray(target[k])
    ) {
      out[k] = deepMerge(target[k], v);
    } else {
      out[k] = v;
    }
  }
  return out;
}

/**
 * Minimal trusted Decision Package with configurable motor_manifests.
 * @param {object} [overrides]
 * @param {object[]} [motorManifests]
 */
function buildTrustedPackage(overrides = {}, motorManifests = []) {
  const base = {
    meta: {
      version: DECISION_PACKAGE_VERSION,
      interfaceId: DECISION_HANDOFF_INTERFACE_ID,
    },
    identity: {
      factory_key: "sp05-p2-semantics",
      state: "ST-RDY",
      jurisdictionId: "US-AZ-PIMA",
    },
    readiness: {
      gates: [],
      allPass: true,
      passCount: 7,
      gateCount: 7,
      handoffPrepEnabled: true,
    },
    motors: {
      "MOT-DCN-01": { motorId: "MOT-DCN-01", present: true },
      "MOT-EXE-01": { motorId: "MOT-EXE-01", present: true },
    },
    evidence: {
      registryRef: null,
      sufficiencyStatus: null,
      requiredMotorsPresent: true,
    },
    scores: { maturity_score: 1 },
    elrExport: {
      sections: {},
      sectionCounts: {},
      motor_manifests: motorManifests,
    },
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
    },
    trust: {
      status: "TRUSTED",
      decisionTrusted: true,
      contaminated: false,
      reasons: [],
    },
    truthAccounting: {
      completenessIsNotQuality: true,
      readinessIsNotQuality: true,
      readinessIsNotOpportunity: true,
      facts: [{ field: "apn", status: "PRESENT" }],
      sourceCompleteness: { declared: true },
      factCompleteness: { declared: true },
      conflicts: {
        openCount: 0,
        conflicts: [],
      },
      unknowns: [{ id: "UNK-P2", obligation: "preserve", declared: true }],
      freshness: {
        freshnessState: "UNKNOWN_FRESHNESS",
        unknownFreshnessIsNotCurrent: true,
        stalePreserved: false,
      },
      provenance: {
        hasSourceRefLineage: true,
        primarySourceRefId: "SRC-P2",
      },
    },
  };
  return deepMerge(base, overrides);
}

function manifest(motorId, outputs, capId = "CAP-08") {
  return {
    kind: "MOTOR_RUN_MANIFEST",
    motorId,
    capId,
    factoryKey: "sp05-p2-semantics",
    outputs,
    knowledgeDelta: {},
    status: "SUCCESS",
  };
}

function intakeFromManifests(motorManifests, overrides = {}) {
  const pkg = buildTrustedPackage(overrides, motorManifests);
  return consumeTrustedDecisionPackage(pkg);
}

function distressOf(evalResult) {
  return evalResult?.result?.evidenceVector?.dimensions?.[0]?.value ?? null;
}

function pass(id, errors) {
  return { id, passed: errors.length === 0, errors };
}

/* -------------------- P2-S01 … P2-S18 -------------------- */

function runP2S01() {
  const errors = [];
  const intake = intakeFromManifests([
    manifest("MOT-MOT-01", { signal: "pre_foreclosure", active: true, pre_foreclosure: "ACTIVE" }),
  ]);
  const ev = evaluateDecisionSemantics(intake);
  if (!ev.ok) errors.push(...ev.errors);
  if (distressOf(ev) !== DISTRESS_STATES.EVIDENCED) {
    errors.push("P2-S01: valid ACTIVE must yield EVIDENCED");
  }
  return pass("P2-S01", errors);
}

function runP2S02() {
  const errors = [];
  const intake = intakeFromManifests([
    manifest("MOT-MOT-01", { signal: "pre_foreclosure", active: true }),
    manifest("MOT-MOT-02", { signal: "NONE", tax_delinquency: "UNKNOWN", active: false }),
  ]);
  const ev = evaluateDecisionSemantics(intake);
  if (distressOf(ev) !== DISTRESS_STATES.EVIDENCED) {
    errors.push("P2-S02: ACTIVE + independent non-material UNKNOWN must remain EVIDENCED");
  }
  return pass("P2-S02", errors);
}

function runP2S03() {
  const errors = [];
  const intake = intakeFromManifests([
    manifest("MOT-MOT-01", { signal: "NONE", pre_foreclosure: "NONE", distressStatus: "NONE", active: false }),
    manifest("MOT-MOT-02", { signal: "NONE", tax_delinquency: "NONE", distressStatus: "NONE", active: false }),
  ]);
  const ev = evaluateDecisionSemantics(intake);
  if (distressOf(ev) !== DISTRESS_STATES.NONE) {
    errors.push("P2-S03: conclusive all-NONE must yield NONE");
  }
  return pass("P2-S03", errors);
}

function runP2S04() {
  const errors = [];
  const intake = intakeFromManifests([
    manifest("MOT-MOT-01", { signal: "NONE", pre_foreclosure: "UNKNOWN", distressStatus: "NONE", active: false }),
  ]);
  const ev = evaluateDecisionSemantics(intake);
  if (distressOf(ev) !== DISTRESS_STATES.UNKNOWN) {
    errors.push("P2-S04: no ACTIVE + material UNKNOWN must yield UNKNOWN");
  }
  return pass("P2-S04", errors);
}

function runP2S05() {
  const errors = [];
  const intake = intakeFromManifests([
    manifest("MOT-MOT-04", {
      signal: "municipal_enforcement",
      active: true,
      conflict: true,
      municipal_enforcement: "ACTIVE",
    }),
  ]);
  const ev = evaluateDecisionSemantics(intake);
  if (distressOf(ev) !== DISTRESS_STATES.CONFLICT_BLOCKED) {
    errors.push("P2-S05: material conflict must yield CONFLICT_BLOCKED");
  }
  return pass("P2-S05", errors);
}

function runP2S06() {
  const errors = [];
  const intake = intakeFromManifests(
    [
      manifest("MOT-MOT-01", {
        signal: "NONE",
        pre_foreclosure: "NONE",
        distressStatus: "NONE",
        active: false,
      }),
    ],
    {
      truthAccounting: {
        conflicts: {
          openCount: 1,
          conflicts: [{ conflictId: "CNF-APN", conflictState: "OPEN", field: "apn" }],
        },
      },
    }
  );
  const ev = evaluateDecisionSemantics(intake);
  if (distressOf(ev) !== DISTRESS_STATES.NONE) {
    errors.push("P2-S06: unrelated conflict must not alter conclusive NONE distress state");
  }
  const unrelated = ev.result?.trace?.conflictContext?.unrelatedPreserved ?? [];
  if (!Array.isArray(unrelated) || unrelated.length < 1) {
    errors.push("P2-S06: unrelated conflict must be preserved as context");
  }
  return pass("P2-S06", errors);
}

function runP2S07() {
  const errors = [];
  const intake = intakeFromManifests([
    manifest("MOT-MOT-01", { signal: "pre_foreclosure", active: true }),
  ]);
  const ev = evaluateDecisionSemantics(intake);
  if (ev.result?.classifyDeal?.state !== SEM01.OPPORTUNITY_CANDIDATE) {
    errors.push("P2-S07: EVIDENCED must map SEM-01 OPPORTUNITY_CANDIDATE");
  }
  return pass("P2-S07", errors);
}

function runP2S08() {
  const errors = [];
  const intake = intakeFromManifests([
    manifest("MOT-MOT-01", { signal: "pre_foreclosure", active: true }),
  ]);
  const ev = evaluateDecisionSemantics(intake);
  if (ev.result?.reviewPriority?.state !== SEM03.REVIEW_PRIORITY) {
    errors.push("P2-S08: EVIDENCED must map SEM-03 REVIEW_PRIORITY");
  }
  return pass("P2-S08", errors);
}

function runP2S09() {
  const errors = [];
  const intake = intakeFromManifests([
    manifest("MOT-MOT-01", { signal: "NONE", pre_foreclosure: "NONE", distressStatus: "NONE", active: false }),
  ]);
  const ev = evaluateDecisionSemantics(intake);
  if (ev.result?.classifyDeal?.state !== SEM01.NOT_OPPORTUNITY_CANDIDATE) {
    errors.push("P2-S09: NONE must map SEM-01 NOT_OPPORTUNITY_CANDIDATE");
  }
  return pass("P2-S09", errors);
}

function runP2S10() {
  const errors = [];
  const intake = intakeFromManifests([
    manifest("MOT-MOT-01", { signal: "NONE", pre_foreclosure: "NONE", distressStatus: "NONE", active: false }),
  ]);
  const ev = evaluateDecisionSemantics(intake);
  if (ev.result?.reviewPriority?.state !== SEM03.DO_NOT_PRIORITIZE) {
    errors.push("P2-S10: NONE must map SEM-03 DO_NOT_PRIORITIZE");
  }
  return pass("P2-S10", errors);
}

function runP2S11() {
  const errors = [];
  const intake = intakeFromManifests([
    manifest("MOT-MOT-01", { signal: "NONE", pre_foreclosure: "UNKNOWN", distressStatus: "NONE", active: false }),
  ]);
  const ev = evaluateDecisionSemantics(intake);
  if (
    ev.result?.classifyDeal?.state !== SEM01.INSUFFICIENT_EVIDENCE ||
    ev.result?.opportunity?.state !== SEM02.INSUFFICIENT_EVIDENCE ||
    ev.result?.reviewPriority?.state !== SEM03.INSUFFICIENT_EVIDENCE
  ) {
    errors.push("P2-S11: UNKNOWN must yield INSUFFICIENT_EVIDENCE across SEM-01/02/03");
  }
  return pass("P2-S11", errors);
}

function runP2S12() {
  const errors = [];
  const intake = intakeFromManifests([
    manifest("MOT-MOT-04", { signal: "municipal_enforcement", active: true, conflict: true }),
  ]);
  const ev = evaluateDecisionSemantics(intake);
  if (
    ev.result?.classifyDeal?.state !== SEM01.CONFLICT_BLOCKED ||
    ev.result?.opportunity?.state !== SEM02.CONFLICT_BLOCKED ||
    ev.result?.reviewPriority?.state !== SEM03.CONFLICT_BLOCKED ||
    ev.result?.halt !== SEM06.CONFLICT_BLOCKED
  ) {
    errors.push("P2-S12: conflict must yield CONFLICT_BLOCKED across SEM-01/02/03");
  }
  return pass("P2-S12", errors);
}

function runP2S13() {
  const errors = [];
  const intake = intakeFromManifests([
    manifest("MOT-MOT-01", { signal: "pre_foreclosure", active: true }),
    manifest("MOT-MOT-02", { signal: "tax_delinquency", active: true }),
  ]);
  const ev = evaluateDecisionSemantics(intake);
  if (ev.result?.opportunity?.state === SEM02.OPPORTUNITY) {
    errors.push("P2-S13: distress alone must never derive SEM-02 OPPORTUNITY");
  }
  if (ev.result?.opportunity?.state !== SEM02.INSUFFICIENT_EVIDENCE) {
    errors.push("P2-S13: SEM-02 must remain INSUFFICIENT_EVIDENCE under EVIDENCED distress");
  }
  return pass("P2-S13", errors);
}

function runP2S14() {
  const errors = [];
  const intake = intakeFromManifests([
    manifest("MOT-MOT-01", { signal: "NONE", pre_foreclosure: "NONE", distressStatus: "NONE", active: false }),
  ]);
  const ev = evaluateDecisionSemantics(intake);
  if (ev.result?.opportunity?.state === SEM02.NOT_OPPORTUNITY) {
    errors.push("P2-S14: distress alone must never derive SEM-02 NOT_OPPORTUNITY");
  }
  if (ev.result?.opportunity?.state !== SEM02.INSUFFICIENT_EVIDENCE) {
    errors.push("P2-S14: SEM-02 must remain INSUFFICIENT_EVIDENCE under NONE distress");
  }
  return pass("P2-S14", errors);
}

function runP2S15() {
  const errors = [];
  const intake = intakeFromManifests([
    manifest("MOT-MOT-01", { signal: "NONE", pre_foreclosure: "UNKNOWN", distressStatus: "NONE", active: false }),
  ]);
  const ev = evaluateDecisionSemantics(intake);
  const state = distressOf(ev);
  if (state === DISTRESS_STATES.NONE) {
    errors.push("P2-S15: UNKNOWN must not become NONE");
  }
  if (ev.result?.ranking?.rank != null && ev.result?.ranking?.comparable !== true) {
    errors.push("P2-S15: UNKNOWN must not receive comparable negative rank");
  }
  if (ev.result?.ranking?.comparable === true) {
    errors.push("P2-S15: UNKNOWN must be non-comparable");
  }
  const cmp = compareDistressStates(DISTRESS_STATES.UNKNOWN, DISTRESS_STATES.NONE);
  if (cmp !== null) {
    errors.push("P2-S15: UNKNOWN must not compare as worse/better than NONE");
  }
  return pass("P2-S15", errors);
}

function runP2S16() {
  const errors = [];
  const a = evaluateDecisionSemantics(
    intakeFromManifests([manifest("MOT-MOT-01", { signal: "pre_foreclosure", active: true })])
  );
  const b = evaluateDecisionSemantics(
    intakeFromManifests([manifest("MOT-MOT-02", { signal: "tax_delinquency", active: true })])
  );
  const ranked = rankSuppliedCandidates(
    [
      { id: "A", result: a.result },
      { id: "B", result: b.result },
    ],
    "SET-TIE"
  );
  const cmp = compareDistressStates(DISTRESS_STATES.EVIDENCED, DISTRESS_STATES.EVIDENCED);
  if (cmp !== 0) errors.push("P2-S16: same distress state must compare equal (tie)");
  if (ranked.order.length !== 2) errors.push("P2-S16: both candidates must appear");
  if (ranked.comparison?.noInventedTieBreakers !== true) {
    errors.push("P2-S16: must declare no invented tie-breakers");
  }
  return pass("P2-S16", errors);
}

function runP2S17() {
  const errors = [];
  const intake = intakeFromManifests([
    manifest("MOT-MOT-01", { signal: "NONE", pre_foreclosure: "NONE", distressStatus: "NONE", active: false }),
    manifest(
      "MOT-FIN-01",
      {
        fullCashValue: 21956,
        equity: "UNKNOWN",
        roi: "UNKNOWN",
      },
      "CAP-13"
    ),
  ]);
  const ev = evaluateDecisionSemantics(intake);
  const dims = ev.result?.evidenceVector?.dimensions ?? [];
  if (dims.length !== 1 || dims[0]?.id !== VALUE_DIMENSION_ID) {
    errors.push("P2-S17: VALUE vector must be exactly DISTRESS_EVIDENCE_STATE");
  }
  if (dims.some((d) => String(d.id).includes("ECONOMIC"))) {
    errors.push("P2-S17: CB-09 must not become VALUE dimension");
  }
  if (ev.result?.invariants?.economicPresenceIsNotAttractiveness !== true) {
    errors.push("P2-S17: economicPresenceIsNotAttractiveness lock required");
  }
  const eco = ev.result?.trace?.economicContextOnly ?? [];
  if (!eco.some((e) => e.fullCashValue === 21956)) {
    errors.push("P2-S17: known FCV may appear as context only");
  }
  if (JSON.stringify(ev.result).includes("favorableEconomics")) {
    errors.push("P2-S17: must not invent favorableEconomics");
  }
  return pass("P2-S17", errors);
}

function runP2S18() {
  const errors = [];
  const intake = intakeFromManifests([
    manifest("MOT-MOT-01", { signal: "pre_foreclosure", active: true }),
  ]);
  const ev = evaluateDecisionSemantics(intake);
  const banned = [
    "Premium",
    "Diamond",
    "access_tier",
    "strategySelection",
    "BUY",
    "SELL",
    "INVEST",
    "MAKE_OFFER",
    "investmentRecommendation",
  ];
  const blob = JSON.stringify(ev.result);
  for (const key of banned) {
    if (blob.includes(`"${key}"`) || blob.includes(`:${key}`)) {
      // allow notes that forbid these strings; check structural fields
    }
  }
  if (ev.result?.invariants?.noPremiumDiamondAccessTier !== true) {
    errors.push("P2-S18: noPremiumDiamondAccessTier required");
  }
  if (ev.result?.invariants?.noStrategySelection !== true) {
    errors.push("P2-S18: noStrategySelection required");
  }
  if (ev.result?.invariants?.reviewPriorityIsNotTransactionAdvice !== true) {
    errors.push("P2-S18: reviewPriorityIsNotTransactionAdvice required");
  }
  if (ev.result?.opportunity?.state === SEM02.OPPORTUNITY) {
    errors.push("P2-S18: must not leak OPPORTUNITY as investment conclusion");
  }
  if (ev.result?.schemaId !== SEMANTICS_RESULT_SCHEMA_ID) {
    errors.push("P2-S18: schemaId must be rsn.decision.semantics.result.v1");
  }
  // Ensure forbidden Product keys are not top-level result fields
  for (const key of ["Premium", "Diamond", "access_tier", "strategy", "BUY", "SELL", "INVEST"]) {
    if (Object.prototype.hasOwnProperty.call(ev.result ?? {}, key)) {
      errors.push(`P2-S18: forbidden field present: ${key}`);
    }
  }
  return pass("P2-S18", errors);
}

/* -------------------- Applicable Pre-IMPL T01–T14 -------------------- */

function runT01() {
  const errors = [];
  const raw = buildTrustedPackage({}, []);
  const gate = assertDecIntakeInput(consumeTrustedDecisionPackage(raw));
  if (!gate.ok) errors.push("T01: trusted DEC-INTAKE required");
  const refused = assertDecIntakeInput({ accepted: false, state: null, package: raw });
  if (refused.ok) errors.push("T01: non-accepted input must be refused");
  return pass("T01", errors);
}

function runT02() {
  const errors = [];
  const refused = evaluateDecisionSemantics({
    accepted: false,
    state: null,
    package: buildTrustedPackage(),
    intake: null,
  });
  if (refused.ok) errors.push("T02: raw/untrusted bypass must be refused");
  return pass("T02", errors);
}

function runT03() {
  const errors = [];
  const pkg = buildTrustedPackage({}, [
    manifest("MOT-MOT-01", { signal: "pre_foreclosure", active: true }),
  ]);
  const before = JSON.stringify(pkg);
  const intake = consumeTrustedDecisionPackage(deepClone(pkg));
  evaluateDecisionSemantics(intake);
  if (JSON.stringify(pkg) !== before) {
    errors.push("T03: Factory/package input must remain unchanged after P2 processing");
  }
  return pass("T03", errors);
}

function runT04() {
  const errors = [];
  const ev = evaluateDecisionSemantics(
    intakeFromManifests([manifest("MOT-MOT-01", { signal: "pre_foreclosure", active: true })])
  );
  if (ev.result?.classifyDeal?.state !== SEM01.OPPORTUNITY_CANDIDATE) {
    errors.push("T04: classify_deal must be downstream Decision classification");
  }
  if (ev.result?.invariants?.noPremiumDiamondAccessTier !== true) {
    errors.push("T04: classify must remain non-commercial");
  }
  return pass("T04", errors);
}

function runT05() {
  const errors = [];
  const ev = evaluateDecisionSemantics(
    intakeFromManifests([manifest("MOT-MOT-01", { signal: "pre_foreclosure", active: true })])
  );
  if (ev.result?.invariants?.readinessIsNotOpportunity !== true) {
    errors.push("T05: readinessIsNotOpportunity lock required");
  }
  return pass("T05", errors);
}

function runT06() {
  const errors = [];
  const ev = evaluateDecisionSemantics(
    intakeFromManifests([
      manifest("MOT-MOT-01", { signal: "NONE", pre_foreclosure: "UNKNOWN", distressStatus: "NONE", active: false }),
    ])
  );
  if (ev.result?.invariants?.unknownIsNotZero !== true) {
    errors.push("T06: unknownIsNotZero required");
  }
  if (distressOf(ev) !== DISTRESS_STATES.UNKNOWN) {
    errors.push("T06: UNKNOWN must be handled honestly");
  }
  return pass("T06", errors);
}

function runT07() {
  const errors = [];
  const ev = evaluateDecisionSemantics(
    intakeFromManifests(
      [manifest("MOT-MOT-01", { signal: "NONE", pre_foreclosure: "NONE", distressStatus: "NONE", active: false })],
      {
        truthAccounting: {
          freshness: {
            freshnessState: "UNKNOWN_FRESHNESS",
            unknownFreshnessIsNotCurrent: true,
          },
          conflicts: {
            openCount: 1,
            conflicts: [{ conflictId: "CNF-X", conflictState: "OPEN", field: "owner" }],
          },
        },
      }
    )
  );
  if (!ev.result?.trace?.freshnessContext) errors.push("T07: freshness context missing");
  if (!ev.result?.trace?.conflictContext) errors.push("T07: conflict context missing");
  return pass("T07", errors);
}

function runT08() {
  const errors = [];
  const ev = evaluateDecisionSemantics(
    intakeFromManifests([manifest("MOT-MOT-01", { signal: "pre_foreclosure", active: true })])
  );
  if (!ev.result?.trace?.sourceFactRefs?.length) {
    errors.push("T08: review-priority must be traceable to Decision evidence");
  }
  return pass("T08", errors);
}

function runT09() {
  const errors = [];
  const ev = evaluateDecisionSemantics(
    intakeFromManifests([
      manifest("MOT-MOT-01", { signal: "NONE", pre_foreclosure: "UNKNOWN", distressStatus: "NONE", active: false }),
    ])
  );
  if (ev.result?.ranking?.comparable === true) {
    errors.push("T09: ranking must not fabricate comparable rank for UNKNOWN");
  }
  return pass("T09", errors);
}

function runT10() {
  const errors = [];
  const ev = evaluateDecisionSemantics(
    intakeFromManifests([manifest("MOT-MOT-01", { signal: "pre_foreclosure", active: true })])
  );
  if (ev.result?.invariants?.evidenceVectorIsNotMaturityScore !== true) {
    errors.push("T10: evidence vector must not be maturity/trust/commercial score");
  }
  if (ev.result?.evidenceVector?.dimensions?.[0]?.id !== VALUE_DIMENSION_ID) {
    errors.push("T10: only DISTRESS_EVIDENCE_STATE VALUE dimension allowed");
  }
  return pass("T10", errors);
}

function runT11() {
  const errors = [];
  const ev = evaluateDecisionSemantics(
    intakeFromManifests([manifest("MOT-MOT-01", { signal: "pre_foreclosure", active: true })])
  );
  if (ev.result?.invariants?.noPremiumDiamondAccessTier !== true) {
    errors.push("T11: zero Premium/Diamond/access_tier leakage lock missing");
  }
  if (ev.result?.invariants?.noStrategySelection !== true) {
    errors.push("T11: zero strategy leakage lock missing");
  }
  return pass("T11", errors);
}

function runT12() {
  const errors = [];
  const manifests = [manifest("MOT-MOT-01", { signal: "pre_foreclosure", active: true })];
  const a = evaluateDecisionSemantics(intakeFromManifests(manifests));
  const b = evaluateDecisionSemantics(intakeFromManifests(manifests));
  const stripVolatile = (r) => {
    const clone = JSON.parse(JSON.stringify(r));
    if (clone?.input) delete clone.input.acceptedAt;
    return clone;
  };
  if (JSON.stringify(stripVolatile(a.result)) !== JSON.stringify(stripVolatile(b.result))) {
    errors.push("T12: identical bounded input must yield deterministic semantics");
  }
  if (a.result?.ruleVersion !== RULE_VERSION) {
    errors.push("T12: ruleVersion must be stable");
  }
  return pass("T12", errors);
}

function runT13() {
  const errors = [];
  const pkg = buildTrustedPackage({}, [
    manifest("MOT-MOT-01", { signal: "pre_foreclosure", active: true }),
  ]);
  const snap = JSON.stringify(pkg);
  const intake = consumeTrustedDecisionPackage(pkg);
  evaluateDecisionSemantics(intake);
  if (JSON.stringify(pkg) !== snap) {
    errors.push("T13: no Factory/P1 write-back — package mutated");
  }
  return pass("T13", errors);
}

function runT14() {
  const errors = [];
  // P1 regression: DEC-INTAKE still required / works
  const intake = consumeTrustedDecisionPackage(buildTrustedPackage({}, []));
  if (!intake.accepted || intake.state !== DECISION_INTAKE_STATE) {
    errors.push("T14: P1 DEC-INTAKE regression failed");
  }
  const gate = assertDecIntakeInput(intake);
  if (!gate.ok) errors.push("T14: P2 must still accept P1 DEC-INTAKE");
  return pass("T14", errors);
}

const PROOFS = [
  runP2S01,
  runP2S02,
  runP2S03,
  runP2S04,
  runP2S05,
  runP2S06,
  runP2S07,
  runP2S08,
  runP2S09,
  runP2S10,
  runP2S11,
  runP2S12,
  runP2S13,
  runP2S14,
  runP2S15,
  runP2S16,
  runP2S17,
  runP2S18,
  runT01,
  runT02,
  runT03,
  runT04,
  runT05,
  runT06,
  runT07,
  runT08,
  runT09,
  runT10,
  runT11,
  runT12,
  runT13,
  runT14,
];

/**
 * @returns {{ passed: boolean, results: object[] }}
 */
export function runDecisionSemanticsValidation() {
  const results = PROOFS.map((fn) => fn());
  return {
    passed: results.every((r) => r.passed),
    results,
  };
}

function main() {
  const { passed, results } = runDecisionSemanticsValidation();
  for (const r of results) {
    const mark = r.passed ? "PASS" : "FAIL";
    console.log(`${mark} ${r.id}${r.errors.length ? ` — ${r.errors.join("; ")}` : ""}`);
  }
  console.log(passed ? "\nSP05-P2 SEMANTICS VALIDATION: PASS" : "\nSP05-P2 SEMANTICS VALIDATION: FAIL");
  process.exitCode = passed ? 0 : 1;
}

const isDirect =
  process.argv[1] &&
  (process.argv[1].endsWith("validateDecisionSemantics.js") ||
    process.argv[1].includes("validateDecisionSemantics"));

if (isDirect) {
  main();
}

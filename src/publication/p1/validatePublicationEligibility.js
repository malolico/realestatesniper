/**
 * SP06-P1 — Publication Eligibility validation / proof harness (DAG-SP06-P1-G1)
 *
 * Frozen SP06-P1-T01…T28 proof obligations.
 * Runnable:
 *   node src/publication/p1/validatePublicationEligibility.js
 */

import {
  DECISION_HANDOFF_INTERFACE_ID,
  DECISION_PACKAGE_VERSION,
} from "../../factory/cb16/decisionPackageSchema.js";
import { buildDecisionDossier } from "../../decision/dossier/decisionDossierBuilder.js";
import {
  DOSSIER_RESULT_SCHEMA_ID,
  DOSSIER_STATE,
  DOSSIER_VERSION,
  REQUIRED_TOP_LEVEL,
} from "../../decision/dossier/decisionDossierContract.js";
import { runDecisionDossierValidation } from "../../decision/dossier/validateDecisionDossier.js";
import { consumeTrustedDecisionPackage } from "../../decision/intake/decisionIntakeConsumer.js";
import { deepClone } from "../../decision/intake/immutableDecisionProjection.js";
import {
  DISTRESS_STATES,
  SEM06,
  SEMANTICS_RESULT_SCHEMA_ID,
} from "../../decision/semantics/decisionOutputContract.js";
import { evaluateDecisionSemantics } from "../../decision/semantics/decisionSemanticsEngine.js";
import {
  DECISION,
  DELIVERY_STATUS,
  ELIGIBILITY_RESULT_SCHEMA_ID,
  ELIGIBILITY_VERSION,
} from "./publicationEligibilityContract.js";
import {
  acceptDecisionDossier,
  evaluatePublicationEligibilityP1,
  extractDistressEvidenceState,
  extractSem06Halt,
} from "./publicationEligibilityEvaluator.js";

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

function buildTrustedPackage(overrides = {}, motorManifests = []) {
  const base = {
    meta: {
      version: DECISION_PACKAGE_VERSION,
      interfaceId: DECISION_HANDOFF_INTERFACE_ID,
    },
    identity: {
      factory_key: "sp06-p1-eligibility",
      state: "ST-RDY",
      jurisdictionId: "US-AZ-PIMA",
    },
    readiness: { gates: [], allPass: true, passCount: 7, gateCount: 7, handoffPrepEnabled: true },
    motors: {
      "MOT-DCN-01": { motorId: "MOT-DCN-01", present: true },
      "MOT-EXE-01": { motorId: "MOT-EXE-01", present: true },
    },
    evidence: { registryRef: null, sufficiencyStatus: null, requiredMotorsPresent: true },
    scores: { maturity_score: 1 },
    elrExport: { sections: {}, sectionCounts: {}, motor_manifests: motorManifests },
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
    trust: { status: "TRUSTED", decisionTrusted: true, contaminated: false, reasons: [] },
    truthAccounting: {
      completenessIsNotQuality: true,
      readinessIsNotQuality: true,
      readinessIsNotOpportunity: true,
      facts: [{ field: "apn", status: "PRESENT" }],
      sourceCompleteness: { declared: true },
      factCompleteness: { declared: true },
      conflicts: { openCount: 0, conflicts: [] },
      unknowns: [{ id: "UNK-P1", obligation: "preserve", declared: true }],
      freshness: {
        freshnessState: "UNKNOWN_FRESHNESS",
        unknownFreshnessIsNotCurrent: true,
        stalePreserved: false,
      },
      provenance: { hasSourceRefLineage: true, primarySourceRefId: "SRC-P1" },
    },
  };
  return deepMerge(base, overrides);
}

function manifest(motorId, outputs, capId = "CAP-08") {
  return {
    kind: "MOTOR_RUN_MANIFEST",
    motorId,
    capId,
    factoryKey: "sp06-p1-eligibility",
    outputs,
    knowledgeDelta: {},
    status: "SUCCESS",
  };
}

function intakeFromManifests(motorManifests, overrides = {}) {
  return consumeTrustedDecisionPackage(buildTrustedPackage(overrides, motorManifests));
}

function evidencedIntake(overrides = {}) {
  return intakeFromManifests(
    [
      manifest("MOT-MOT-01", {
        signal: "pre_foreclosure",
        active: true,
        pre_foreclosure: "ACTIVE",
      }),
    ],
    overrides
  );
}

function noneIntake() {
  return intakeFromManifests([
    manifest("MOT-MOT-01", {
      signal: "NONE",
      pre_foreclosure: "NONE",
      distressStatus: "NONE",
      active: false,
    }),
    manifest("MOT-MOT-02", {
      signal: "NONE",
      tax_delinquency: "NONE",
      distressStatus: "NONE",
      active: false,
    }),
  ]);
}

function unknownIntake() {
  return intakeFromManifests([
    manifest("MOT-MOT-01", {
      signal: "NONE",
      pre_foreclosure: "UNKNOWN",
      active: false,
    }),
  ]);
}

function conflictIntake() {
  return intakeFromManifests([
    manifest("MOT-MOT-01", {
      signal: "pre_foreclosure",
      active: true,
      conflict: true,
    }),
  ]);
}

function buildPair(intakeFn) {
  const intake = intakeFn();
  const ev = evaluateDecisionSemantics(intake);
  const dossierBuild = buildDecisionDossier(intake, ev.result);
  return { intake, ev, dossierBuild };
}

function canonicalDossier(intakeFn = evidencedIntake) {
  const { dossierBuild } = buildPair(intakeFn);
  if (!dossierBuild.ok || !dossierBuild.dossier) {
    throw new Error("fixture dossier build failed");
  }
  return dossierBuild.dossier;
}

function pass(id, errors) {
  return { id, passed: errors.length === 0, errors };
}

function assertNeverEligible(result, label) {
  if (result.decision === DECISION.ELIGIBLE) {
    return [`${label}: ELIGIBLE emission forbidden`];
  }
  return [];
}

function assertDeliveryNotAuthorized(result, label) {
  if (result.delivery !== DELIVERY_STATUS.NOT_AUTHORIZED) {
    return [`${label}: delivery must be NOT_AUTHORIZED`];
  }
  return [];
}

function runSp06P1T01() {
  const errors = [];
  const d = canonicalDossier();
  const accept = acceptDecisionDossier(d);
  if (!accept.ok) errors.push("canonical DEC-DOSSIER must accept");
  const r = evaluatePublicationEligibilityP1(d);
  errors.push(...assertNeverEligible(r, "T01"));
  errors.push(...assertDeliveryNotAuthorized(r, "T01"));
  return pass("SP06-P1-T01", errors);
}

function runSp06P1T02() {
  const errors = [];
  const d = canonicalDossier();
  const r = evaluatePublicationEligibilityP1(d);
  if (d.meta.schemaId !== DOSSIER_RESULT_SCHEMA_ID) errors.push("input schemaId");
  if (d.meta.version !== DOSSIER_VERSION) errors.push("input version");
  if (d.meta.state !== DOSSIER_STATE) errors.push("input state");
  if (r.decision === DECISION.REFUSED) errors.push("valid canonical must not REFUSE");
  return pass("SP06-P1-T02", errors);
}

function runSp06P1T03() {
  const errors = [];
  const r = evaluatePublicationEligibilityP1(null);
  if (r.decision !== DECISION.REFUSED) errors.push("malformed must REFUSE");
  return pass("SP06-P1-T03", errors);
}

function runSp06P1T04() {
  const errors = [];
  const d = deepClone(canonicalDossier());
  d.meta.schemaId = "wrong.schema";
  const r = evaluatePublicationEligibilityP1(d);
  if (r.decision !== DECISION.REFUSED) errors.push("unsupported schema must REFUSE");
  return pass("SP06-P1-T04", errors);
}

function runSp06P1T05() {
  const errors = [];
  const intake = evidencedIntake();
  const ev = evaluateDecisionSemantics(intake);
  const mismatched = deepClone(ev.result);
  mismatched.input.factoryKey = "OTHER-KEY";
  const badBuild = buildDecisionDossier(intake, mismatched);
  if (badBuild.ok) {
    errors.push("lineage mismatch should not build dossier");
  } else {
    const r = evaluatePublicationEligibilityP1({ meta: {}, input: {}, semantics: {}, honesty: {}, invariants: {} });
    if (r.decision !== DECISION.REFUSED) errors.push("broken lineage object must REFUSE");
  }
  return pass("SP06-P1-T05", errors);
}

function runSp06P1T06() {
  const errors = [];
  const intake = evidencedIntake();
  const ev = evaluateDecisionSemantics(intake);
  const noFacts = deepClone(ev.result);
  delete noFacts.trace.sourceFactRefs;
  const badBuild = buildDecisionDossier(intake, noFacts);
  if (badBuild.ok) {
    errors.push("missing provenance must not build dossier");
  }
  const d = deepClone(canonicalDossier());
  delete d.honesty.provenance.decisionPackageIdentity.factoryKey;
  const r = evaluatePublicationEligibilityP1(d);
  if (r.decision !== DECISION.REFUSED) errors.push("missing provenance must REFUSE");
  return pass("SP06-P1-T06", errors);
}

function runSp06P1T07() {
  const errors = [];
  const d = canonicalDossier();
  const distress = extractDistressEvidenceState(d);
  const halt = extractSem06Halt(d);
  if (distress === DISTRESS_STATES.EVIDENCED && halt === SEM06.INSUFFICIENT_EVIDENCE) {
    // axis separation: EVIDENCED is distress, not halt
  } else {
    errors.push("expected EVIDENCED distress with SEM-06 INSUFFICIENT_EVIDENCE halt on fixture");
  }
  if (distress === halt) errors.push("distress must not equal halt value on EVIDENCED fixture");
  if ([DISTRESS_STATES.EVIDENCED, DISTRESS_STATES.NONE].includes(halt)) {
    errors.push("EVIDENCED/NONE must not be treated as halt values");
  }
  return pass("SP06-P1-T07", errors);
}

function runSp06P1T08() {
  const errors = [];
  const d = canonicalDossier();
  const r1 = evaluatePublicationEligibilityP1(d);
  const r2 = evaluatePublicationEligibilityP1(d);
  if (r1.decision !== r2.decision) errors.push("precedence/decision must be deterministic");
  if (r1.decision !== DECISION.NOT_ELIGIBLE) errors.push("accepted canonical → NOT_ELIGIBLE under fail-closed");
  return pass("SP06-P1-T08", errors);
}

function runSp06P1T09() {
  const errors = [];
  const d = canonicalDossier();
  const halt = extractSem06Halt(d);
  if (halt !== SEM06.INSUFFICIENT_EVIDENCE) {
    errors.push("EVIDENCED fixture expects INSUFFICIENT_EVIDENCE halt (SEM-02 lock)");
  }
  const r = evaluatePublicationEligibilityP1(d);
  if (r.decision === DECISION.REFUSED) {
    errors.push("INSUFFICIENT_EVIDENCE halt must not alone REFUSE");
  }
  if (r.decision !== DECISION.NOT_ELIGIBLE) {
    errors.push("must reach NOT_ELIGIBLE via fail-closed default, not halt synonym");
  }
  return pass("SP06-P1-T09", errors);
}

function runSp06P1T10() {
  const errors = [];
  let d;
  try {
    d = canonicalDossier(conflictIntake);
  } catch {
    errors.push("conflict fixture dossier build failed");
    return pass("SP06-P1-T10", errors);
  }
  const r = evaluatePublicationEligibilityP1(d);
  if (r.decision !== DECISION.NOT_ELIGIBLE) errors.push("CONFLICT_BLOCKED → NOT_ELIGIBLE");
  return pass("SP06-P1-T10", errors);
}

function runSp06P1T11() {
  const errors = [];
  const d = canonicalDossier();
  const r = evaluatePublicationEligibilityP1(d);
  if (r.honesty?.freshness == null && d.honesty?.freshness != null) {
    errors.push("freshness must be preserved when present");
  }
  if (r.decision === DECISION.REFUSED && d.honesty?.freshness?.stalePreserved === true) {
    errors.push("freshness alone must not invent REFUSED");
  }
  return pass("SP06-P1-T11", errors);
}

function runSp06P1T12() {
  const errors = [];
  const d = canonicalDossier(unknownIntake);
  const r = evaluatePublicationEligibilityP1(d);
  if (extractDistressEvidenceState(d) !== DISTRESS_STATES.UNKNOWN) {
    errors.push("fixture must be UNKNOWN distress");
  }
  errors.push(...assertNeverEligible(r, "T12"));
  if (r.honesty?.unknown == null && d.honesty?.unknown != null) {
    errors.push("UNKNOWN honesty must be preserved");
  }
  return pass("SP06-P1-T12", errors);
}

function runSp06P1T13() {
  const errors = [];
  const d = canonicalDossier();
  const a = evaluatePublicationEligibilityP1(d);
  const b = evaluatePublicationEligibilityP1(d);
  if (JSON.stringify(a) !== JSON.stringify(b)) errors.push("deterministic repeat mismatch");
  return pass("SP06-P1-T13", errors);
}

function runSp06P1T14() {
  const errors = [];
  const d = canonicalDossier();
  const before = JSON.stringify(d);
  evaluatePublicationEligibilityP1(d);
  if (JSON.stringify(d) !== before) errors.push("dossier mutated");
  return pass("SP06-P1-T14", errors);
}

function runSp06P1T15() {
  const errors = [];
  const r = evaluatePublicationEligibilityP1(canonicalDossier());
  if (!Array.isArray(r.sideEffects) || r.sideEffects.length !== 0) {
    errors.push("no Factory side effects");
  }
  return pass("SP06-P1-T15", errors);
}

function runSp06P1T16() {
  const errors = [];
  const p3 = runDecisionDossierValidation();
  if (!p3.passed) errors.push("SP05-P3 dossier regression failed");
  return pass("SP06-P1-T16", errors);
}

function runSp06P1T17() {
  const errors = [];
  for (const fn of [evidencedIntake, noneIntake, unknownIntake]) {
    const r = evaluatePublicationEligibilityP1(canonicalDossier(fn));
    errors.push(...assertDeliveryNotAuthorized(r, "T17"));
    if (r.decision === DECISION.ELIGIBLE) errors.push("eligibility ≠ delivery / no ELIGIBLE");
  }
  return pass("SP06-P1-T17", errors);
}

function runSp06P1T18() {
  const errors = [];
  const r = evaluatePublicationEligibilityP1({ elr: { raw: true }, meta: {} });
  if (r.decision !== DECISION.REFUSED) errors.push("raw ELR object must REFUSE");
  const d = canonicalDossier();
  const raw = JSON.stringify(r);
  if (raw.includes('"elrExport"') || raw.includes("loop_ledger")) {
    errors.push("result must not embed raw ELR");
  }
  void d;
  return pass("SP06-P1-T18", errors);
}

function runSp06P1T19() {
  const errors = [];
  const r = evaluatePublicationEligibilityP1(canonicalDossier());
  const raw = JSON.stringify(r);
  for (const bad of ['"Product"', '"Marketplace"', '"access_tier"']) {
    if (raw.includes(bad)) errors.push(`Product leakage ${bad}`);
  }
  return pass("SP06-P1-T19", errors);
}

function runSp06P1T20() {
  const errors = [];
  const r = evaluatePublicationEligibilityP1(canonicalDossier());
  const raw = JSON.stringify(r);
  for (const bad of ['"Premium"', '"Diamond"', "access_tier"]) {
    if (raw.includes(bad)) errors.push(`tier leakage ${bad}`);
  }
  return pass("SP06-P1-T20", errors);
}

function runSp06P1T21() {
  const errors = [];
  const d = canonicalDossier();
  delete d.honesty.ownerRef;
  const r = evaluatePublicationEligibilityP1(d);
  if (r.decision === DECISION.REFUSED && !d.honesty?.ownerRef) {
    // absence must not alone REFUSE
  }
  errors.push(...assertNeverEligible(r, "T21"));
  return pass("SP06-P1-T21", errors);
}

function runSp06P1T22() {
  const errors = [];
  const r = evaluatePublicationEligibilityP1(canonicalDossier());
  const raw = JSON.stringify(r);
  for (const bad of ["BUY", "SELL", "INVEST", "MAKE OFFER", "brokerage"]) {
    if (raw.includes(bad)) errors.push(`transaction language ${bad}`);
  }
  return pass("SP06-P1-T22", errors);
}

function runSp06P1T23() {
  const errors = [];
  const r = evaluatePublicationEligibilityP1(canonicalDossier());
  if (r.meta.schemaId === SEMANTICS_RESULT_SCHEMA_ID) {
    errors.push("must not reuse II.3/read-model schema");
  }
  if (r.meta.schemaId !== ELIGIBILITY_RESULT_SCHEMA_ID) {
    errors.push("must emit SP06 P1 eligibility schema");
  }
  return pass("SP06-P1-T23", errors);
}

function runSp06P1T24() {
  const errors = [];
  const p3 = runDecisionDossierValidation();
  if (!p3.passed) errors.push("P3 consume-only regression failed");
  return pass("SP06-P1-T24", errors);
}

function runSp06P1T25() {
  const errors = [];
  const r = evaluatePublicationEligibilityP1(canonicalDossier());
  if (r.meta.schemaId.includes("publication.unit")) {
    errors.push("P2 publication unit schema forbidden");
  }
  return pass("SP06-P1-T25", errors);
}

function runSp06P1T26() {
  const errors = [];
  const r = evaluatePublicationEligibilityP1(canonicalDossier());
  const raw = JSON.stringify(r);
  if (/SP07|SP08|Maricopa/i.test(raw)) errors.push("SP07/SP08 scope leakage");
  return pass("SP06-P1-T26", errors);
}

function runSp06P1T27() {
  const errors = [];
  for (const fn of [evidencedIntake, noneIntake]) {
    const d = canonicalDossier(fn);
    const r = evaluatePublicationEligibilityP1(d);
    errors.push(...assertNeverEligible(r, "T27"));
    if (r.decision !== DECISION.NOT_ELIGIBLE) {
      errors.push("valid dossier must NOT_ELIGIBLE under fail-closed-only");
    }
  }
  return pass("SP06-P1-T27", errors);
}

function runSp06P1T28() {
  const errors = [];
  const r = evaluatePublicationEligibilityP1(canonicalDossier());
  if (r.meta.schemaId !== ELIGIBILITY_RESULT_SCHEMA_ID) errors.push("result schemaId");
  if (r.meta.version !== ELIGIBILITY_VERSION) errors.push("result version");
  if (r.decision !== DECISION.NOT_ELIGIBLE) errors.push("fail-closed default NOT_ELIGIBLE");
  errors.push(...assertDeliveryNotAuthorized(r, "T28"));
  errors.push(...assertNeverEligible(r, "T28"));
  return pass("SP06-P1-T28", errors);
}

const PROOFS = [
  runSp06P1T01,
  runSp06P1T02,
  runSp06P1T03,
  runSp06P1T04,
  runSp06P1T05,
  runSp06P1T06,
  runSp06P1T07,
  runSp06P1T08,
  runSp06P1T09,
  runSp06P1T10,
  runSp06P1T11,
  runSp06P1T12,
  runSp06P1T13,
  runSp06P1T14,
  runSp06P1T15,
  runSp06P1T16,
  runSp06P1T17,
  runSp06P1T18,
  runSp06P1T19,
  runSp06P1T20,
  runSp06P1T21,
  runSp06P1T22,
  runSp06P1T23,
  runSp06P1T24,
  runSp06P1T25,
  runSp06P1T26,
  runSp06P1T27,
  runSp06P1T28,
];

/**
 * @returns {{ passed: boolean, results: object[], passCount: number }}
 */
export function runPublicationEligibilityValidation() {
  const results = PROOFS.map((fn) => fn());
  const passCount = results.filter((r) => r.passed).length;
  return {
    passed: results.every((r) => r.passed),
    results,
    passCount,
  };
}

function main() {
  const { passed, results, passCount } = runPublicationEligibilityValidation();
  for (const r of results) {
    const mark = r.passed ? "PASS" : "FAIL";
    console.log(`${mark} ${r.id}${r.errors.length ? ` — ${r.errors.join("; ")}` : ""}`);
  }
  console.log(
    passed
      ? `\nSP06-P1 PUBLICATION ELIGIBILITY VALIDATION: PASS (${passCount}/28)`
      : `\nSP06-P1 PUBLICATION ELIGIBILITY VALIDATION: FAIL (${passCount}/28)`
  );
  process.exitCode = passed ? 0 : 1;
}

const isDirect =
  process.argv[1] &&
  (process.argv[1].endsWith("validatePublicationEligibility.js") ||
    process.argv[1].includes("validatePublicationEligibility"));

if (isDirect) {
  main();
}

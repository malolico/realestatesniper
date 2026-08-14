/**
 * SP06-P2 — Publication Unit / Projection validation / proof harness (DAG-SP06-P2-G1)
 *
 * Frozen SP06-P2-T01…T33 proof obligations.
 * Runnable:
 *   node src/publication/p2/validatePublicationUnit.js
 */

import { spawnSync } from "node:child_process";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import path from "node:path";
import {
  DECISION_HANDOFF_INTERFACE_ID,
  DECISION_PACKAGE_VERSION,
} from "../../factory/cb16/decisionPackageSchema.js";
import { buildDecisionDossier } from "../../decision/dossier/decisionDossierBuilder.js";
import { runDecisionDossierValidation } from "../../decision/dossier/validateDecisionDossier.js";
import { consumeTrustedDecisionPackage } from "../../decision/intake/decisionIntakeConsumer.js";
import { deepClone } from "../../decision/intake/immutableDecisionProjection.js";
import { evaluateDecisionSemantics } from "../../decision/semantics/decisionSemanticsEngine.js";
import { DISTRESS_STATES } from "../../decision/semantics/decisionOutputContract.js";
import {
  DECISION as P1_DECISION,
  ELIGIBILITY_RESULT_SCHEMA_ID,
} from "../p1/publicationEligibilityContract.js";
import {
  evaluatePublicationEligibilityP1,
  extractDistressEvidenceState,
} from "../p1/publicationEligibilityEvaluator.js";
import { runPublicationEligibilityValidation } from "../p1/validatePublicationEligibility.js";
import {
  buildUnitResult,
  DECISION,
  DELIVERY_STATUS,
  FORMATION,
  UNIT_RESULT_SCHEMA_ID,
  UNIT_STATE,
  UNIT_VERSION,
} from "./publicationUnitContract.js";
import {
  acceptPublicationEligibilityResult,
  projectPublicationUnit,
} from "./publicationUnitProjector.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = path.resolve(__dirname, "../../..");

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
      factory_key: "sp06-p2-unit",
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
      unknowns: [{ id: "UNK-P2", obligation: "preserve", declared: true }],
      freshness: {
        freshnessState: "UNKNOWN_FRESHNESS",
        unknownFreshnessIsNotCurrent: true,
        stalePreserved: false,
      },
      provenance: { hasSourceRefLineage: true, primarySourceRefId: "SRC-P2" },
    },
  };
  return deepMerge(base, overrides);
}

function manifest(motorId, outputs, capId = "CAP-08") {
  return {
    kind: "MOTOR_RUN_MANIFEST",
    motorId,
    capId,
    factoryKey: "sp06-p2-unit",
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

function canonicalP1(intakeFn = evidencedIntake) {
  return evaluatePublicationEligibilityP1(canonicalDossier(intakeFn));
}

function syntheticP1(overrides = {}) {
  const base = canonicalP1();
  return deepMerge(deepClone(base), overrides);
}

function pass(id, errors) {
  return { id, passed: errors.length === 0, errors };
}

function assertNotFormed(result, label) {
  const errors = [];
  if (result.formation === FORMATION.FORMED) {
    errors.push(`${label}: FORMED emission forbidden`);
  }
  if (result.formation !== FORMATION.NOT_FORMED) {
    errors.push(`${label}: formation must be NOT_FORMED under current authority`);
  }
  if (result.projection != null) {
    errors.push(`${label}: projection must be absent/null when NOT_FORMED`);
  }
  return errors;
}

function assertNeverEligibleOrFormed(result, label) {
  const errors = [];
  if (result.decision === DECISION.ELIGIBLE) {
    errors.push(`${label}: ELIGIBLE emission forbidden`);
  }
  errors.push(...assertNotFormed(result, label));
  return errors;
}

function assertDeliveryNotAuthorized(result, label) {
  if (result.delivery !== DELIVERY_STATUS.NOT_AUTHORIZED) {
    return [`${label}: delivery must be NOT_AUTHORIZED`];
  }
  return [];
}

function runSp06P2T01() {
  const errors = [];
  const p1 = canonicalP1();
  const accept = acceptPublicationEligibilityResult(p1);
  if (!accept.ok) errors.push("canonical P1 eligibility result must accept");
  const r = projectPublicationUnit(p1);
  if (r.meta.schemaId !== UNIT_RESULT_SCHEMA_ID) errors.push("result schemaId");
  if (r.meta.version !== UNIT_VERSION) errors.push("result version");
  if (r.meta.state !== UNIT_STATE) errors.push("result state");
  errors.push(...assertNeverEligibleOrFormed(r, "T01"));
  errors.push(...assertDeliveryNotAuthorized(r, "T01"));
  return pass("SP06-P2-T01", errors);
}

function runSp06P2T02() {
  const errors = [];
  const r = projectPublicationUnit(null);
  if (r.decision !== DECISION.REFUSED) errors.push("malformed must REFUSE");
  errors.push(...assertNotFormed(r, "T02"));
  return pass("SP06-P2-T02", errors);
}

function runSp06P2T03() {
  const errors = [];
  const p1 = syntheticP1({ meta: { schemaId: "wrong.schema", version: "v9" } });
  const r = projectPublicationUnit(p1);
  if (r.decision !== DECISION.REFUSED) errors.push("unsupported schema/version must REFUSE");
  errors.push(...assertNotFormed(r, "T03"));
  return pass("SP06-P2-T03", errors);
}

function runSp06P2T04() {
  const errors = [];
  const p1 = evaluatePublicationEligibilityP1(null);
  if (p1.decision !== P1_DECISION.REFUSED) errors.push("fixture P1 must REFUSE");
  const r = projectPublicationUnit(p1);
  if (r.decision !== DECISION.REFUSED) errors.push("upstream REFUSED → P2 REFUSED");
  errors.push(...assertNotFormed(r, "T04"));
  return pass("SP06-P2-T04", errors);
}

function runSp06P2T05() {
  const errors = [];
  const p1 = canonicalP1();
  if (p1.decision !== P1_DECISION.NOT_ELIGIBLE) errors.push("fixture P1 must NOT_ELIGIBLE");
  const r = projectPublicationUnit(p1);
  if (r.decision !== DECISION.NOT_ELIGIBLE) errors.push("upstream NOT_ELIGIBLE → P2 NOT_ELIGIBLE");
  errors.push(...assertNotFormed(r, "T05"));
  return pass("SP06-P2-T05", errors);
}

function runSp06P2T06() {
  const errors = [];
  try {
    buildUnitResult({
      decision: DECISION.ELIGIBLE,
      formation: FORMATION.NOT_FORMED,
      reasons: [],
      inputRef: {},
      identity: {},
      lineage: {},
      eligibilityBinding: {},
      projection: null,
      provenance: {},
      honesty: {},
    });
    errors.push("buildUnitResult must throw on ELIGIBLE");
  } catch {
    // expected
  }
  try {
    buildUnitResult({
      decision: DECISION.NOT_ELIGIBLE,
      formation: FORMATION.FORMED,
      reasons: [],
      inputRef: {},
      identity: {},
      lineage: {},
      eligibilityBinding: {},
      projection: null,
      provenance: {},
      honesty: {},
    });
    errors.push("buildUnitResult must throw on FORMED");
  } catch {
    // expected
  }
  const forged = syntheticP1({ decision: P1_DECISION.ELIGIBLE });
  const r = projectPublicationUnit(forged);
  if (r.decision !== DECISION.REFUSED) {
    errors.push("forged ELIGIBLE upstream must fail-closed REFUSE");
  }
  errors.push(...assertNotFormed(r, "T06"));
  return pass("SP06-P2-T06", errors);
}

function runSp06P2T07() {
  const errors = [];
  const p1 = canonicalP1();
  const r = projectPublicationUnit(p1);
  if (r.eligibilityBinding?.upstreamDecision !== p1.decision) {
    errors.push("P1 decision must not be overridden");
  }
  if (r.eligibilityBinding?.overridden === true) {
    errors.push("eligibilityBinding.overridden must be false");
  }
  if (p1.decision === P1_DECISION.NOT_ELIGIBLE && r.decision !== DECISION.NOT_ELIGIBLE) {
    errors.push("must map NOT_ELIGIBLE without re-adjudication");
  }
  return pass("SP06-P2-T07", errors);
}

function runSp06P2T08() {
  const errors = [];
  const p1 = canonicalP1();
  const r = projectPublicationUnit(p1);
  if (r.lineage?.factoryKey !== p1.inputRef?.factoryKey) {
    errors.push("lineage factoryKey must cite P1 inputRef");
  }
  if (r.lineage?.upstreamSchemaId !== p1.meta?.schemaId) {
    errors.push("lineage upstreamSchemaId must cite P1 meta");
  }
  return pass("SP06-P2-T08", errors);
}

function runSp06P2T09() {
  const errors = [];
  const p1 = canonicalP1();
  const r = projectPublicationUnit(p1);
  if (r.provenance?.factoryKey !== p1.inputRef?.factoryKey) {
    errors.push("provenance factoryKey must cite P1 inputRef");
  }
  return pass("SP06-P2-T09", errors);
}

function runSp06P2T10() {
  const errors = [];
  const p1 = canonicalP1();
  const a = projectPublicationUnit(p1);
  const b = projectPublicationUnit(p1);
  if (JSON.stringify(a) !== JSON.stringify(b)) errors.push("deterministic repeat mismatch");
  return pass("SP06-P2-T10", errors);
}

function runSp06P2T11() {
  const errors = [];
  const p1 = canonicalP1();
  const before = JSON.stringify(p1);
  projectPublicationUnit(p1);
  if (JSON.stringify(p1) !== before) errors.push("P1 result mutated");
  const d = canonicalDossier();
  const dbefore = JSON.stringify(d);
  evaluatePublicationEligibilityP1(d);
  projectPublicationUnit(evaluatePublicationEligibilityP1(d));
  if (JSON.stringify(d) !== dbefore) errors.push("dossier mutated via P2 path");
  return pass("SP06-P2-T11", errors);
}

function runSp06P2T12() {
  const errors = [];
  const p1 = canonicalP1();
  const r = projectPublicationUnit(p1);
  if (r.meta.schemaId === ELIGIBILITY_RESULT_SCHEMA_ID) {
    errors.push("P2 result must not reuse P1 schemaId");
  }
  if (r === p1) errors.push("must be new derived object");
  return pass("SP06-P2-T12", errors);
}

function runSp06P2T13() {
  const errors = [];
  const r = projectPublicationUnit({ elr: { raw: true }, meta: {} });
  if (r.decision !== DECISION.REFUSED) errors.push("raw ELR object must REFUSE");
  const p1 = canonicalP1();
  const out = projectPublicationUnit(p1);
  const raw = JSON.stringify(out);
  if (raw.includes('"elrExport"') || raw.includes("loop_ledger")) {
    errors.push("result must not embed raw ELR");
  }
  return pass("SP06-P2-T13", errors);
}

function runSp06P2T14() {
  const errors = [];
  const r = projectPublicationUnit(canonicalP1());
  if (!Array.isArray(r.sideEffects) || r.sideEffects.length !== 0) {
    errors.push("no Factory write-back / side effects");
  }
  return pass("SP06-P2-T14", errors);
}

function runSp06P2T15() {
  const errors = [];
  const d = canonicalDossier();
  const p1before = JSON.stringify(evaluatePublicationEligibilityP1(d));
  projectPublicationUnit(evaluatePublicationEligibilityP1(d));
  const p1after = JSON.stringify(evaluatePublicationEligibilityP1(d));
  if (p1before !== p1after) errors.push("Decision/P1 path mutated");
  return pass("SP06-P2-T15", errors);
}

function runSp06P2T16() {
  const errors = [];
  const p1 = canonicalP1();
  const before = JSON.stringify(p1);
  projectPublicationUnit(p1);
  if (JSON.stringify(p1) !== before) errors.push("P1 eligibility result mutated");
  return pass("SP06-P2-T16", errors);
}

function runSp06P2T17() {
  const errors = [];
  const p1 = canonicalP1(unknownIntake);
  const r = projectPublicationUnit(p1);
  if (p1.honesty?.unknown != null && r.honesty?.unknown == null) {
    errors.push("honesty must survive projection");
  }
  if (r.honesty?.limitations?.projectionNotFormed !== true) {
    errors.push("projection limitation honesty must be set");
  }
  return pass("SP06-P2-T17", errors);
}

function runSp06P2T18() {
  const errors = [];
  const p1 = canonicalP1(unknownIntake);
  const d = canonicalDossier(unknownIntake);
  if (extractDistressEvidenceState(d) !== DISTRESS_STATES.UNKNOWN) {
    errors.push("fixture must be UNKNOWN distress");
  }
  const r = projectPublicationUnit(p1);
  errors.push(...assertNeverEligibleOrFormed(r, "T18"));
  return pass("SP06-P2-T18", errors);
}

function runSp06P2T19() {
  const errors = [];
  const p1 = canonicalP1(conflictIntake);
  const r = projectPublicationUnit(p1);
  if (r.decision !== DECISION.NOT_ELIGIBLE) errors.push("conflict upstream → NOT_ELIGIBLE");
  errors.push(...assertNotFormed(r, "T19"));
  return pass("SP06-P2-T19", errors);
}

function runSp06P2T20() {
  const errors = [];
  const p1 = syntheticP1({
    honesty: {
      freshness: { stalePreserved: true, freshnessIsNotTruth: true },
      limitations: { freshnessIsNotTruth: true },
    },
  });
  const r = projectPublicationUnit(p1);
  if (r.honesty?.freshness?.stalePreserved !== true) {
    errors.push("freshness limitation must be preserved");
  }
  return pass("SP06-P2-T20", errors);
}

function runSp06P2T21() {
  const errors = [];
  const p1 = syntheticP1({ honesty: { ownerRef: undefined } });
  delete p1.honesty.ownerRef;
  const r = projectPublicationUnit(p1);
  errors.push(...assertNeverEligibleOrFormed(r, "T21"));
  return pass("SP06-P2-T21", errors);
}

function runSp06P2T22() {
  const errors = [];
  const r = projectPublicationUnit(canonicalP1());
  const raw = JSON.stringify(r);
  for (const bad of ['"Product"', '"Marketplace"', '"access_tier"']) {
    if (raw.includes(bad)) errors.push(`Product leakage ${bad}`);
  }
  return pass("SP06-P2-T22", errors);
}

function runSp06P2T23() {
  const errors = [];
  const r = projectPublicationUnit(canonicalP1());
  const raw = JSON.stringify(r);
  for (const bad of ['"Premium"', '"Diamond"', "access_tier"]) {
    if (raw.includes(bad)) errors.push(`tier leakage ${bad}`);
  }
  return pass("SP06-P2-T23", errors);
}

function runSp06P2T24() {
  const errors = [];
  const r = projectPublicationUnit(canonicalP1());
  const raw = JSON.stringify(r);
  for (const bad of ["Stripe", "subscription", "monetization", "entitlement"]) {
    if (raw.includes(bad)) errors.push(`payment leakage ${bad}`);
  }
  return pass("SP06-P2-T24", errors);
}

function runSp06P2T25() {
  const errors = [];
  const p1 = syntheticP1({
    honesty: {
      ownerRef: { name: "Jane Doe", email: "jane@example.com", phone: "555-0100" },
    },
  });
  const r = projectPublicationUnit(p1);
  const raw = JSON.stringify(r);
  for (const bad of ["Jane Doe", "jane@example.com", "555-0100", "contact unlock"]) {
    if (raw.includes(bad)) errors.push(`owner/contact leakage ${bad}`);
  }
  if (r.provenance?.ownerRef?.disclosureAuthorized === true) {
    errors.push("ownerRef must not authorize disclosure");
  }
  return pass("SP06-P2-T25", errors);
}

function runSp06P2T26() {
  const errors = [];
  const r = projectPublicationUnit(canonicalP1());
  const raw = JSON.stringify(r);
  for (const bad of ["BUY", "SELL", "INVEST", "MAKE OFFER", "brokerage"]) {
    if (raw.includes(bad)) errors.push(`transaction language ${bad}`);
  }
  return pass("SP06-P2-T26", errors);
}

function runSp06P2T27() {
  const errors = [];
  for (const fn of [evidencedIntake, noneIntake]) {
    const r = projectPublicationUnit(canonicalP1(fn));
    errors.push(...assertDeliveryNotAuthorized(r, "T27"));
    errors.push(...assertNeverEligibleOrFormed(r, "T27"));
  }
  return pass("SP06-P2-T27", errors);
}

function runSp06P2T28() {
  const errors = [];
  const p1 = runPublicationEligibilityValidation();
  if (!p1.passed) errors.push("SP06-P1 regression failed");
  if (p1.passCount !== 28) errors.push(`expected 28/28 P1 proofs, got ${p1.passCount}`);
  return pass("SP06-P2-T28", errors);
}

function runSp06P2T29() {
  const errors = [];
  const p3 = runDecisionDossierValidation();
  if (!p3.passed) errors.push("SP05-P3 regression failed");
  return pass("SP06-P2-T29", errors);
}

function runSp06P2T30() {
  const errors = [];
  const script = path.join(
    REPO_ROOT,
    "src/integration/publicationEligibility/tests/runIi3PublicationEligibilityValidation.js"
  );
  const r = spawnSync(process.execPath, [script], { encoding: "utf8", cwd: REPO_ROOT });
  if (r.status !== 0) errors.push("II.3 16-test regression failed");
  return pass("SP06-P2-T30", errors);
}

function runSp06P2T31() {
  const errors = [];
  const projectorSrc = readFileSync(
    path.join(__dirname, "publicationUnitProjector.js"),
    "utf8"
  );
  if (/integration\/publicationUnit/.test(projectorSrc)) {
    errors.push("P2 projector must not import II.4 integration oracle");
  }
  if (/formPublicationUnit|evaluatePublicationUnit/.test(projectorSrc)) {
    errors.push("P2 must not call II.4 formation oracle");
  }
  const r = projectPublicationUnit(canonicalP1());
  if (r.meta.schemaId.includes("ii4") || r.meta.schemaId.includes("II.4")) {
    errors.push("must not reuse II.4 schema class");
  }
  if (JSON.stringify(r).includes("UNIT_REJECTED")) {
    errors.push("must not emit II.4 UNIT_REJECTED vocabulary");
  }
  return pass("SP06-P2-T31", errors);
}

function runSp06P2T32() {
  const errors = [];
  const r = projectPublicationUnit(canonicalP1());
  const raw = JSON.stringify(r);
  if (raw.includes("SP06-P3") || raw.includes("publication.delivery")) {
    errors.push("P3 scope leakage");
  }
  return pass("SP06-P2-T32", errors);
}

function runSp06P2T33() {
  const errors = [];
  const r = projectPublicationUnit(canonicalP1());
  const raw = JSON.stringify(r);
  if (/SP07|SP08|Maricopa/i.test(raw)) errors.push("SP07/SP08 scope leakage");
  return pass("SP06-P2-T33", errors);
}

const PROOFS = [
  runSp06P2T01,
  runSp06P2T02,
  runSp06P2T03,
  runSp06P2T04,
  runSp06P2T05,
  runSp06P2T06,
  runSp06P2T07,
  runSp06P2T08,
  runSp06P2T09,
  runSp06P2T10,
  runSp06P2T11,
  runSp06P2T12,
  runSp06P2T13,
  runSp06P2T14,
  runSp06P2T15,
  runSp06P2T16,
  runSp06P2T17,
  runSp06P2T18,
  runSp06P2T19,
  runSp06P2T20,
  runSp06P2T21,
  runSp06P2T22,
  runSp06P2T23,
  runSp06P2T24,
  runSp06P2T25,
  runSp06P2T26,
  runSp06P2T27,
  runSp06P2T28,
  runSp06P2T29,
  runSp06P2T30,
  runSp06P2T31,
  runSp06P2T32,
  runSp06P2T33,
];

/**
 * @returns {{ passed: boolean, results: object[], passCount: number }}
 */
export function runPublicationUnitValidation() {
  const results = PROOFS.map((fn) => fn());
  const passCount = results.filter((r) => r.passed).length;
  return {
    passed: results.every((r) => r.passed),
    results,
    passCount,
  };
}

function main() {
  const { passed, results, passCount } = runPublicationUnitValidation();
  for (const r of results) {
    const mark = r.passed ? "PASS" : "FAIL";
    console.log(`${mark} ${r.id}${r.errors.length ? ` — ${r.errors.join("; ")}` : ""}`);
  }
  console.log(
    passed
      ? `\nSP06-P2 PUBLICATION UNIT VALIDATION: PASS (${passCount}/33)`
      : `\nSP06-P2 PUBLICATION UNIT VALIDATION: FAIL (${passCount}/33)`
  );
  process.exitCode = passed ? 0 : 1;
}

const isDirect =
  process.argv[1] &&
  (process.argv[1].endsWith("validatePublicationUnit.js") ||
    process.argv[1].includes("validatePublicationUnit"));

if (isDirect) {
  main();
}

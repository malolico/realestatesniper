/**
 * SP05-P1 — Decision Intake validation / proof harness (DAG-SP05-P1-G1)
 *
 * Frozen T01–T12 contract. Runnable directly:
 *   node src/decision/intake/validateDecisionIntake.js
 *
 * Factory CB-16 is import/read-only. No optional index files required.
 */

import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import {
  DECISION_HANDOFF_INTERFACE_ID,
  DECISION_PACKAGE_VERSION,
  validateDecisionPackageShape,
  validateTrustedDecisionPackage,
} from "../../factory/cb16/decisionPackageSchema.js";
import {
  deliverDecisionPackage,
  createDecisionHandoffPort,
} from "../../factory/cb16/decisionHandoffInterface.js";
import { runCb16Validation } from "../../factory/cb16/validateCb16.js";
import {
  consumeTrustedDecisionPackage,
  DECISION_INTAKE_STATE,
} from "./decisionIntakeConsumer.js";
import { deepClone } from "./immutableDecisionProjection.js";

/**
 * Minimal shape-valid Decision Package fixture (mutable).
 * @param {object} [overrides]
 */
function buildShapeValidPackage(overrides = {}) {
  const base = {
    meta: {
      version: DECISION_PACKAGE_VERSION,
      interfaceId: DECISION_HANDOFF_INTERFACE_ID,
    },
    identity: {
      factory_key: "sp05-p1-intake",
      state: "ST-RDY",
      jurisdictionId: "US-AZ-MARICOPA",
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
    elrExport: { sections: {}, sectionCounts: {} },
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
        openCount: 1,
        conflicts: [{ conflictId: "CNF-P1", conflictState: "OPEN", field: "apn" }],
      },
      unknowns: [{ id: "UNK-P1", obligation: "preserve", declared: true }],
      freshness: {
        freshnessState: "UNKNOWN_FRESHNESS",
        unknownFreshnessIsNotCurrent: true,
        stalePreserved: false,
      },
      provenance: {
        hasSourceRefLineage: true,
        primarySourceRefId: "SRC-P1",
      },
    },
  };
  return deepMerge(base, overrides);
}

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

function snapshot(value) {
  return JSON.stringify(value);
}

function assertNoForbiddenSemantics(obj, errors, label) {
  walkForbidden(obj, "", errors, label);
}

function walkForbidden(node, pathPrefix, errors, label) {
  if (node == null || typeof node !== "object") return;
  const bannedExact = new Set([
    "opportunity",
    "investmentRecommendation",
    "recommendation",
    "ranking",
    "classify_deal",
    "dealClass",
    "premiumClass",
    "diamondClass",
    "Premium",
    "Diamond",
    "access_tier",
    "strategy",
    "strategySelection",
    "dossier",
    "scoring",
  ]);
  for (const key of Object.keys(node)) {
    if (bannedExact.has(key)) {
      errors.push(`${label}: forbidden semantic key emitted: ${pathPrefix}${key}`);
    }
    const child = node[key];
    if (child != null && typeof child === "object") {
      walkForbidden(child, `${pathPrefix}${key}.`, errors, label);
    }
  }
}

function runT01() {
  const errors = [];
  const pkg = buildShapeValidPackage();
  const shape = validateDecisionPackageShape(pkg);
  const trusted = validateTrustedDecisionPackage(pkg);
  if (!shape.valid || !trusted.valid) {
    errors.push("T01 fixture must be shape-valid and trusted");
    return { id: "T01", passed: false, errors };
  }
  const delivery = deliverDecisionPackage(pkg);
  const result = consumeTrustedDecisionPackage(delivery);
  if (!result.accepted || result.state !== DECISION_INTAKE_STATE) {
    errors.push(`T01: trusted package must be accepted as ${DECISION_INTAKE_STATE}`);
  }
  if (result.intake?.isFactoryStDec === true) {
    errors.push("T01: DEC-INTAKE must not claim Factory ST-DEC");
  }
  return { id: "T01", passed: errors.length === 0, errors };
}

function runT02() {
  const errors = [];
  const pkg = buildShapeValidPackage({
    trust: { status: "UNTRUSTED", decisionTrusted: false, contaminated: false, reasons: ["x"] },
  });
  const result = consumeTrustedDecisionPackage(pkg);
  if (result.accepted || result.state === DECISION_INTAKE_STATE) {
    errors.push("T02: UNTRUSTED package must be refused");
  }
  return { id: "T02", passed: errors.length === 0, errors };
}

function runT03() {
  const errors = [];
  const pkg = buildShapeValidPackage({
    trust: { status: "UNTRUSTED", decisionTrusted: false, contaminated: false, reasons: [] },
  });
  const shape = validateDecisionPackageShape(pkg);
  if (!shape.valid) {
    errors.push("T03 fixture must be shape-valid");
  }
  const trusted = validateTrustedDecisionPackage(pkg);
  if (trusted.valid) {
    errors.push("T03: shape-valid UNTRUSTED must fail trusted validator");
  }
  const result = consumeTrustedDecisionPackage(pkg);
  if (result.accepted) {
    errors.push("T03: shape-valid but untrusted must be refused by Decision intake");
  }
  return { id: "T03", passed: errors.length === 0, errors };
}

function runT04() {
  const errors = [];
  const pkg = buildShapeValidPackage({
    trust: {
      status: "UNTRUSTED",
      decisionTrusted: false,
      contaminated: true,
      reasons: ["diagnostic"],
    },
  });
  const port = createDecisionHandoffPort();
  const delivery = port.deliver(pkg, { allowUntrustedDiagnostic: true });
  if (delivery.trustedDelivery !== false || delivery.allowUntrustedDiagnostic !== true) {
    errors.push("T04: diagnostic delivery fixture invalid");
  }
  const result = consumeTrustedDecisionPackage(delivery);
  if (result.accepted || result.state === DECISION_INTAKE_STATE) {
    errors.push("T04: diagnostic lane must not enter normal Decision intake");
  }
  return { id: "T04", passed: errors.length === 0, errors };
}

function runT05() {
  const errors = [];
  const missing = buildShapeValidPackage({
    truthAccounting: {
      completenessIsNotQuality: true,
      readinessIsNotQuality: true,
      // readinessIsNotOpportunity missing/false
      readinessIsNotOpportunity: false,
      facts: [],
      conflicts: { openCount: 0, conflicts: [] },
      unknowns: [],
      freshness: {
        freshnessState: "UNKNOWN_FRESHNESS",
        unknownFreshnessIsNotCurrent: true,
        stalePreserved: false,
      },
      provenance: { hasSourceRefLineage: false, primarySourceRefId: null },
    },
  });
  const r1 = consumeTrustedDecisionPackage(missing);
  if (r1.accepted) {
    errors.push("T05: false honesty lock (readinessIsNotOpportunity) must refuse");
  }

  const contaminated = buildShapeValidPackage({
    trust: {
      status: "TRUSTED",
      decisionTrusted: true,
      contaminated: true,
      reasons: ["contaminated"],
    },
  });
  const r2 = consumeTrustedDecisionPackage(contaminated);
  if (r2.accepted) {
    errors.push("T05: contaminated trusted claim must refuse");
  }

  const malformed = { not: "a package" };
  const r3 = consumeTrustedDecisionPackage(malformed);
  if (r3.accepted) {
    errors.push("T05: malformed package must refuse");
  }

  return { id: "T05", passed: errors.length === 0, errors };
}

function runT06() {
  const errors = [];
  const factoryPkg = buildShapeValidPackage({
    truthAccounting: {
      unknowns: [{ id: "UNK-NEST", nested: { marker: "factory-original" } }],
      conflicts: {
        openCount: 1,
        conflicts: [{ conflictId: "CNF-NEST", nested: { marker: "factory-conflict" } }],
      },
    },
  });
  const before = snapshot(factoryPkg);
  const delivery = deliverDecisionPackage(factoryPkg);
  const result = consumeTrustedDecisionPackage(delivery);
  if (!result.accepted) {
    errors.push("T06: trusted intake required for mutation isolation proof");
    return { id: "T06", passed: false, errors };
  }

  // Attempt nested mutation on Decision projection
  try {
    result.package.truthAccounting.unknowns[0].nested.marker = "decision-mutated";
    result.package.truthAccounting.conflicts.conflicts[0].nested.marker = "decision-mutated";
    result.package.identity.jurisdictionId = "MUTATED";
  } catch {
    // Expected under freeze
  }

  if (snapshot(factoryPkg) !== before) {
    errors.push("T06: Factory source corpus mutated after Decision nested mutation attempt");
  }
  if (factoryPkg.truthAccounting.unknowns[0].nested.marker !== "factory-original") {
    errors.push("T06: nested Factory unknown mutated via Decision reference");
  }
  if (
    factoryPkg.truthAccounting.conflicts.conflicts[0].nested.marker !== "factory-conflict"
  ) {
    errors.push("T06: nested Factory conflict mutated via Decision reference");
  }

  // Mutate Factory after intake — Decision projection must not silently follow
  factoryPkg.truthAccounting.unknowns[0].nested.marker = "factory-later";
  factoryPkg.identity.jurisdictionId = "FACTORY-LATER";
  if (result.package.truthAccounting.unknowns[0].nested.marker !== "factory-original") {
    errors.push("T06: Decision projection must not track post-intake Factory nested mutation");
  }
  if (result.package.identity.jurisdictionId !== "US-AZ-MARICOPA") {
    errors.push("T06: Decision identity must remain independent of Factory post-mutation");
  }

  return { id: "T06", passed: errors.length === 0, errors };
}

function runT07() {
  const errors = [];
  const pkg = buildShapeValidPackage();
  const beforeUnknowns = snapshot(pkg.truthAccounting.unknowns);
  const beforeConflicts = snapshot(pkg.truthAccounting.conflicts);
  const beforeFreshness = snapshot(pkg.truthAccounting.freshness);
  const beforeCompleteness = snapshot({
    completenessIsNotQuality: pkg.truthAccounting.completenessIsNotQuality,
    sourceCompleteness: pkg.truthAccounting.sourceCompleteness,
    factCompleteness: pkg.truthAccounting.factCompleteness,
  });
  const beforeProv = snapshot(pkg.truthAccounting.provenance);
  const beforeIdentity = snapshot(pkg.identity);

  const result = consumeTrustedDecisionPackage(deliverDecisionPackage(pkg));
  if (!result.accepted) {
    errors.push("T07: trusted accept required");
    return { id: "T07", passed: false, errors };
  }

  if (snapshot(result.package.truthAccounting.unknowns) !== beforeUnknowns) {
    errors.push("T07: UNKNOWN not preserved");
  }
  if (snapshot(result.package.truthAccounting.conflicts) !== beforeConflicts) {
    errors.push("T07: conflicts not preserved");
  }
  if (snapshot(result.package.truthAccounting.freshness) !== beforeFreshness) {
    errors.push("T07: freshness not preserved");
  }
  if (
    snapshot({
      completenessIsNotQuality: result.package.truthAccounting.completenessIsNotQuality,
      sourceCompleteness: result.package.truthAccounting.sourceCompleteness,
      factCompleteness: result.package.truthAccounting.factCompleteness,
    }) !== beforeCompleteness
  ) {
    errors.push("T07: completeness not preserved");
  }
  if (snapshot(result.package.truthAccounting.provenance) !== beforeProv) {
    errors.push("T07: provenance not preserved");
  }
  if (snapshot(result.package.identity) !== beforeIdentity) {
    errors.push("T07: identity/jurisdiction not preserved");
  }
  if (result.package.identity.jurisdictionId !== "US-AZ-MARICOPA") {
    errors.push("T07: jurisdiction not preserved");
  }

  return { id: "T07", passed: errors.length === 0, errors };
}

function runT08() {
  const errors = [];
  const untrusted = buildShapeValidPackage({
    trust: { status: "UNTRUSTED", decisionTrusted: false, contaminated: false, reasons: [] },
  });
  const refused = consumeTrustedDecisionPackage(untrusted);
  if (refused.accepted) {
    errors.push("T08: must not accept UNTRUSTED");
  }
  if (untrusted.trust.status !== "UNTRUSTED" || untrusted.trust.decisionTrusted !== false) {
    errors.push("T08: intake must not upgrade Factory trust on refuse path");
  }

  const trusted = buildShapeValidPackage();
  const originalUnknowns = deepClone(trusted.truthAccounting.unknowns);
  const accepted = consumeTrustedDecisionPackage(trusted);
  if (!accepted.accepted) {
    errors.push("T08: trusted path required");
  } else {
    if (accepted.package.trust.status !== "TRUSTED") {
      errors.push("T08: must not alter trust stamp on accept");
    }
    if (snapshot(accepted.package.truthAccounting.unknowns) !== snapshot(originalUnknowns)) {
      errors.push("T08: must not repair UNKNOWN facts");
    }
  }
  return { id: "T08", passed: errors.length === 0, errors };
}

function runT09() {
  const errors = [];
  const result = consumeTrustedDecisionPackage(
    deliverDecisionPackage(buildShapeValidPackage())
  );
  if (!result.accepted) {
    errors.push("T09: trusted accept required");
    return { id: "T09", passed: false, errors };
  }
  assertNoForbiddenSemantics(result, errors, "T09");
  if (result.intake?.isOpportunity || result.intake?.isRecommendation || result.intake?.isRanking) {
    errors.push("T09: intake metadata must not claim opportunity/recommendation/ranking");
  }
  // Factory maturity_score may exist on package; Decision must not emit Decision scoring field
  if (Object.prototype.hasOwnProperty.call(result, "scoring")) {
    errors.push("T09: must not emit Decision scoring");
  }
  if (Object.prototype.hasOwnProperty.call(result.intake || {}, "score")) {
    errors.push("T09: intake must not emit score");
  }
  return { id: "T09", passed: errors.length === 0, errors };
}

function runT10() {
  const errors = [];
  const result = consumeTrustedDecisionPackage(
    deliverDecisionPackage(buildShapeValidPackage())
  );
  if (!result.accepted) {
    errors.push("T10: trusted accept required");
    return { id: "T10", passed: false, errors };
  }
  assertNoForbiddenSemantics(result, errors, "T10");
  if (result.intake?.isCommercialTier || result.intake?.isStrategySelection) {
    errors.push("T10: intake must not claim commercial tier or strategy");
  }
  return { id: "T10", passed: errors.length === 0, errors };
}

function runT11() {
  const errors = [];
  const factoryPkg = buildShapeValidPackage({
    truthAccounting: {
      unknowns: [{ id: "U", nested: { a: 1, arr: [{ b: 2 }] } }],
    },
  });
  const delivery = deliverDecisionPackage(factoryPkg);
  // Prove shared reference exists at Factory delivery boundary
  if (delivery.corpus !== factoryPkg) {
    errors.push("T11 precondition: delivery corpus should be live Factory reference");
  }
  const result = consumeTrustedDecisionPackage(delivery);
  if (!result.accepted) {
    errors.push("T11: trusted accept required");
    return { id: "T11", passed: false, errors };
  }
  if (result.package === factoryPkg || result.package === delivery.corpus) {
    errors.push("T11: Decision package must not be shared reference to Factory corpus");
  }
  if (!Object.isFrozen(result.package) || !Object.isFrozen(result.package.truthAccounting)) {
    errors.push("T11: Decision projection must be deep-frozen (nested)");
  }
  if (!Object.isFrozen(result.package.truthAccounting.unknowns[0].nested)) {
    errors.push("T11: nested object must be frozen");
  }
  if (!Object.isFrozen(result.package.truthAccounting.unknowns[0].nested.arr)) {
    errors.push("T11: nested array must be frozen");
  }

  try {
    result.package.truthAccounting.unknowns[0].nested.arr[0].b = 99;
  } catch {
    // expected
  }
  if (factoryPkg.truthAccounting.unknowns[0].nested.arr[0].b !== 2) {
    errors.push("T11: nested Factory write-back detected");
  }

  return { id: "T11", passed: errors.length === 0, errors };
}

async function runT12() {
  const errors = [];
  // CB-16 + applicable PRE-SP05 proof rows embedded in CB-16 validator (PS05-01/03/04/05)
  const cb16 = await runCb16Validation({});
  if (!cb16.passed) {
    errors.push("T12: CB-16 validation FAILED");
    if (Array.isArray(cb16.errors)) {
      errors.push(...cb16.errors.slice(0, 20).map((e) => `T12 CB-16: ${e}`));
    }
  }
  return { id: "T12", passed: errors.length === 0, errors, cb16Passed: cb16.passed === true };
}

/**
 * @returns {Promise<{ passed: boolean, phase: string, tests: object[], errors: string[] }>}
 */
export async function runDecisionIntakeValidation() {
  const tests = [
    runT01(),
    runT02(),
    runT03(),
    runT04(),
    runT05(),
    runT06(),
    runT07(),
    runT08(),
    runT09(),
    runT10(),
    runT11(),
    await runT12(),
  ];

  const errors = tests.flatMap((t) => t.errors);
  return {
    passed: tests.every((t) => t.passed) && errors.length === 0,
    phase: "SP05-P1",
    grantId: "DAG-SP05-P1-G1",
    decisionIntakeState: DECISION_INTAKE_STATE,
    tests: tests.map((t) => ({
      id: t.id,
      passed: t.passed,
      errorCount: t.errors.length,
    })),
    errors,
  };
}

const isDirectRun =
  process.argv[1] &&
  pathToFileURL(path.resolve(process.argv[1])).href === import.meta.url;

if (isDirectRun) {
  const result = await runDecisionIntakeValidation();
  console.log("=== SP05-P1 Decision Intake Validation (DAG-SP05-P1-G1) ===\n");
  console.log(JSON.stringify(result, null, 2));
  if (!result.passed) {
    console.error("\n❌ SP05-P1 Decision Intake validation FAILED");
    process.exit(1);
  }
  console.log("\n✅ SP05-P1 Decision Intake validation PASSED");
  process.exit(0);
}

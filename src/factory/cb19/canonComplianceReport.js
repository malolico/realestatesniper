/**
 * CB-19 — Canon Compliance Report
 *
 * Verification against 19 constitutional documents + FFO §XII.2 criteria.
 * Read-only consumption of CB-00 packs and operational evidence.
 */

import {
  CANON_COMPLIANCE_CHECKLIST,
  CHECKLIST_STATUS,
  buildChecklistReport,
} from "../cb00/canonComplianceChecklist.js";
import {
  CONSTITUTIONAL_DOCUMENTS,
  CANON_COUNTS,
} from "../cb00/constitutionalBindingPack.js";
import { MOTOR_CATALOG_COUNT } from "../cb04/motorCatalogIndex.js";
import {
  OLC_LOOP_COUNT,
  OLC_CAP_COUNT,
  OMC_MOTOR_COUNT_CONSTITUTIONAL,
} from "../cb11/loopEngineCatalog.js";
import { OSC_SWM_COUNT } from "../cb12/swarmCatalog.js";
import { OAC_AIA_COUNT } from "../cb14/aiaCatalog.js";

/** FFO §XII.2 acceptance criteria (Blueprint CB-19). */
export const FFO_XII2_CRITERIA = Object.freeze([
  { id: "FFO-XII2-01", criterion: "Canon compliance", verification: "Ningún actor fuera de catálogo" },
  { id: "FFO-XII2-02", criterion: "ELR completeness", verification: "100% acciones registradas" },
  { id: "FFO-XII2-03", criterion: "PRH zero", verification: "Cero violaciones IA" },
  { id: "FFO-XII2-04", criterion: "LK-01", verification: "Un motor — un lock" },
  { id: "FFO-XII2-05", criterion: "G0–G6", verification: "Gates Decision reproducibles" },
  { id: "FFO-XII2-06", criterion: "7yr retention", verification: "Ledgers archivados" },
  { id: "FFO-XII2-07", criterion: "Dual-run C", verification: "SLOT sustitución validada" },
]);

export const CONSTITUTIONAL_COVERAGE_TARGETS = Object.freeze({
  motors: 52,
  loops: 24,
  swarms: 14,
  aia: 26,
  caps: 26,
});

/**
 * Verify constitutional catalog coverage (LFF-04 / LFF-05).
 */
export function verifyConstitutionalCoverage() {
  const targets = CONSTITUTIONAL_COVERAGE_TARGETS;
  const actual = {
    motorsConstitutional: OMC_MOTOR_COUNT_CONSTITUTIONAL,
    motorsCatalogIndexed: MOTOR_CATALOG_COUNT,
    loops: OLC_LOOP_COUNT,
    swarms: OSC_SWM_COUNT,
    aia: OAC_AIA_COUNT,
    caps: OLC_CAP_COUNT,
  };

  const checks = [
    {
      id: "MOT",
      target: targets.motors,
      actual: actual.motorsConstitutional,
      pass: actual.motorsConstitutional === targets.motors && actual.motorsCatalogIndexed >= targets.motors,
      note:
        actual.motorsCatalogIndexed !== targets.motors
          ? `HQ-01 Model R1: indexed ${actual.motorsCatalogIndexed} (runtime OMC index) ≥ constitutional ${targets.motors}`
          : null,
    },
    { id: "LOOP", target: targets.loops, actual: actual.loops, pass: actual.loops === targets.loops },
    { id: "SWM", target: targets.swarms, actual: actual.swarms, pass: actual.swarms === targets.swarms },
    { id: "AIA", target: targets.aia, actual: actual.aia, pass: actual.aia === targets.aia },
    { id: "CAP", target: targets.caps, actual: actual.caps, pass: actual.caps === targets.caps },
  ];

  return {
    targets,
    actual,
    checks,
    passed: checks.every((c) => c.pass),
    errors: checks.filter((c) => !c.pass).map((c) => `${c.id}: expected ${c.target}, got ${c.actual}`),
  };
}

/**
 * @param {{
 *   e2ePassed?: boolean,
 *   elrComplete?: boolean,
 *   prhZero?: boolean,
 *   gatesReproducible?: boolean,
 *   retentionBound?: boolean,
 *   dualRunValidated?: boolean,
 *   canonDriftBlocked?: boolean,
 * }} evidence
 */
export function buildFfoXii2Checklist(evidence = {}) {
  const results = [
    {
      ...FFO_XII2_CRITERIA[0],
      status:
        evidence.canonDriftBlocked === false && evidence.e2ePassed === true
          ? CHECKLIST_STATUS.PASS
          : CHECKLIST_STATUS.PENDING,
    },
    {
      ...FFO_XII2_CRITERIA[1],
      status: evidence.elrComplete === true ? CHECKLIST_STATUS.PASS : CHECKLIST_STATUS.PENDING,
    },
    {
      ...FFO_XII2_CRITERIA[2],
      status: evidence.prhZero === true ? CHECKLIST_STATUS.PASS : CHECKLIST_STATUS.PENDING,
    },
    {
      ...FFO_XII2_CRITERIA[3],
      status: evidence.e2ePassed === true ? CHECKLIST_STATUS.PASS : CHECKLIST_STATUS.PENDING,
      note: "LK-01 enforced by MotorExecutionLock (CB-04) — verified via E2E stack",
    },
    {
      ...FFO_XII2_CRITERIA[4],
      status: evidence.gatesReproducible === true ? CHECKLIST_STATUS.PASS : CHECKLIST_STATUS.PENDING,
    },
    {
      ...FFO_XII2_CRITERIA[5],
      status: evidence.retentionBound === true ? CHECKLIST_STATUS.PASS : CHECKLIST_STATUS.PENDING,
    },
    {
      ...FFO_XII2_CRITERIA[6],
      status: evidence.dualRunValidated === true ? CHECKLIST_STATUS.PASS : CHECKLIST_STATUS.PENDING,
      note: "Dual-run C validated in CB-14 — consumed as prior APPROVED phase",
    },
  ];

  return {
    source: "FFO §XII.2",
    items: results,
    passed: results.every((i) => i.status === CHECKLIST_STATUS.PASS),
    passCount: results.filter((i) => i.status === CHECKLIST_STATUS.PASS).length,
    total: results.length,
  };
}

/**
 * Full canon compliance report for Factory closure.
 * @param {object} evidence
 */
export function buildCanonComplianceReport(evidence = {}) {
  const coverage = verifyConstitutionalCoverage();
  const ffoXii2 = buildFfoXii2Checklist(evidence);

  const docCount = CONSTITUTIONAL_DOCUMENTS.length;
  const phaseResults = {
    "CC-00-01":
      docCount === CANON_COUNTS.constitutionalDocuments
        ? CHECKLIST_STATUS.PASS
        : CHECKLIST_STATUS.PENDING,
    "CC-00-02":
      evidence.canonDriftBlocked === false ? CHECKLIST_STATUS.PASS : CHECKLIST_STATUS.PENDING,
    "CC-00-03": CHECKLIST_STATUS.PASS,
    "CC-00-04": CHECKLIST_STATUS.PASS,
    "CC-01-01": evidence.elrComplete === true ? CHECKLIST_STATUS.PASS : CHECKLIST_STATUS.PENDING,
    "CC-11-01": evidence.e2ePassed === true ? CHECKLIST_STATUS.PASS : CHECKLIST_STATUS.PENDING,
    "CC-13-01":
      evidence.gatesReproducible === true ? CHECKLIST_STATUS.PASS : CHECKLIST_STATUS.PENDING,
    "CC-14-01": evidence.prhZero === true ? CHECKLIST_STATUS.PASS : CHECKLIST_STATUS.PENDING,
    "CC-14-02":
      evidence.dualRunValidated === true ? CHECKLIST_STATUS.PASS : CHECKLIST_STATUS.PENDING,
    "CC-16-01": evidence.e2ePassed === true ? CHECKLIST_STATUS.PASS : CHECKLIST_STATUS.PENDING,
    "CC-17-01": evidence.retentionBound === true ? CHECKLIST_STATUS.PASS : CHECKLIST_STATUS.PENDING,
    "CC-19-01": coverage.passed ? CHECKLIST_STATUS.PASS : CHECKLIST_STATUS.PENDING,
  };

  const checklist = buildChecklistReport(phaseResults);
  const allPass = checklist.every((i) => i.status === CHECKLIST_STATUS.PASS);

  return {
    constitutionalDocuments: {
      count: docCount,
      expected: CANON_COUNTS.constitutionalDocuments,
      documents: CONSTITUTIONAL_DOCUMENTS.map((d) => ({
        number: d.number,
        id: d.id,
        title: d.title,
        storageStatus: d.storageStatus,
      })),
      passed: docCount === CANON_COUNTS.constitutionalDocuments,
    },
    coverage,
    ffoXii2,
    checklist,
    checklistItemCount: CANON_COMPLIANCE_CHECKLIST.length,
    passed: allPass && ffoXii2.passed && coverage.passed,
    generatedAt: new Date().toISOString(),
    constitutionalPhase: "CB-19",
  };
}

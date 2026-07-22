/**
 * CB-00 — Canon Compliance Checklist
 * Derived from FFO §XII.2, LFF, and Construction Blueprint acceptance criteria.
 */

export const CHECKLIST_STATUS = Object.freeze({
  NOT_APPLICABLE: "NOT_APPLICABLE",
  PENDING: "PENDING",
  PASS: "PASS",
});

/**
 * @typedef {Object} ChecklistItem
 * @property {string} id
 * @property {string} criterion
 * @property {string} verification
 * @property {string} source
 * @property {string} applicableFromPhase
 * @property {'NOT_APPLICABLE'|'PENDING'|'PASS'} defaultStatus
 */

/** @type {readonly ChecklistItem[]} */
export const CANON_COMPLIANCE_CHECKLIST = Object.freeze([
  {
    id: "CC-00-01",
    criterion: "19 constitutional documents indexed",
    verification: "constitutionalBindingPack lists all 19; versioned files on disk",
    source: "FFO §Canon integrado",
    applicableFromPhase: "CB-00",
    defaultStatus: CHECKLIST_STATUS.PENDING,
  },
  {
    id: "CC-00-02",
    criterion: "No actors outside catalog (OMC, OLC, OSC, OAC, FCC)",
    verification: "catalogActorGuard rejects unknown actor families",
    source: "FFO §XII.2 Canon compliance",
    applicableFromPhase: "CB-00",
    defaultStatus: CHECKLIST_STATUS.PENDING,
  },
  {
    id: "CC-00-03",
    criterion: "Construction phase gate enforced",
    verification: "assertPhaseUnlocked blocks CB-N+1 without CB-N closure",
    source: "Construction Blueprint CB-00",
    applicableFromPhase: "CB-00",
    defaultStatus: CHECKLIST_STATUS.PENDING,
  },
  {
    id: "CC-01-01",
    criterion: "ELR completeness",
    verification: "100% Factory actions registered in Expediente Lineage Record",
    source: "FFO §XII.2 / TRZ-01",
    applicableFromPhase: "CB-01",
    defaultStatus: CHECKLIST_STATUS.NOT_APPLICABLE,
  },
  {
    id: "CC-14-01",
    criterion: "PRH zero",
    verification: "Zero IA governance prohibition violations in production",
    source: "FFO §XII.2 / IGA",
    applicableFromPhase: "CB-14",
    defaultStatus: CHECKLIST_STATUS.NOT_APPLICABLE,
  },
  {
    id: "CC-11-01",
    criterion: "LK-01 motor lock",
    verification: "One motor — one active Loop re-executor per factory_key",
    source: "FFO §XII.2 / OLC LK-01",
    applicableFromPhase: "CB-11",
    defaultStatus: CHECKLIST_STATUS.NOT_APPLICABLE,
  },
  {
    id: "CC-13-01",
    criterion: "G0–G6 Decision gates",
    verification: "Decision readiness gates reproducible per expediente",
    source: "FFO §III.7 / §XII.2",
    applicableFromPhase: "CB-13",
    defaultStatus: CHECKLIST_STATUS.NOT_APPLICABLE,
  },
  {
    id: "CC-17-01",
    criterion: "7-year retention",
    verification: "Archived ledgers retained per FFO-14",
    source: "FFO §XII.2",
    applicableFromPhase: "CB-17",
    defaultStatus: CHECKLIST_STATUS.NOT_APPLICABLE,
  },
  {
    id: "CC-14-02",
    criterion: "Dual-run C (SLOT substitution)",
    verification: "At least one SLOT model substitution validated without C regression",
    source: "FFO §XII.2",
    applicableFromPhase: "CB-14",
    defaultStatus: CHECKLIST_STATUS.NOT_APPLICABLE,
  },
  {
    id: "CC-16-01",
    criterion: "Factory boundary ST-RDY → ST-DEC",
    verification: "Handoff only on G0–G6 PASS; Factory does not decide commercially",
    source: "FFO-06 / LFF-07",
    applicableFromPhase: "CB-16",
    defaultStatus: CHECKLIST_STATUS.NOT_APPLICABLE,
  },
  {
    id: "CC-00-04",
    criterion: "Factory does not assign access_tier",
    verification: "catalogActorGuard.assertNotAccessTierAssignment enforced in Factory scope",
    source: "PP-08 / IGA-16",
    applicableFromPhase: "CB-00",
    defaultStatus: CHECKLIST_STATUS.PENDING,
  },
  {
    id: "CC-19-01",
    criterion: "Full catalog coverage",
    verification: "52 MOT · 24 LOOP · 14 SWM · 26 AIA · 26 CAP operational",
    source: "LFF-04 / LFF-05",
    applicableFromPhase: "CB-19",
    defaultStatus: CHECKLIST_STATUS.NOT_APPLICABLE,
  },
]);

export function getChecklistForPhase(phaseId) {
  return CANON_COMPLIANCE_CHECKLIST.filter((item) => item.applicableFromPhase === phaseId);
}

export function getActiveChecklist() {
  return CANON_COMPLIANCE_CHECKLIST.filter(
    (item) => item.defaultStatus !== CHECKLIST_STATUS.NOT_APPLICABLE
  );
}

export function buildChecklistReport(phaseResults = {}) {
  return CANON_COMPLIANCE_CHECKLIST.map((item) => ({
    ...item,
    status: phaseResults[item.id] ?? item.defaultStatus,
  }));
}

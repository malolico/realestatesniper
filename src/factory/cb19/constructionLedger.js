/**
 * CB-19 — Construction Ledger
 *
 * Registro de fases CB-00..CB-19 (Blueprint closure artifact).
 */

import {
  CONSTRUCTION_PHASES,
  loadPhaseStatus,
  getPhaseRecord,
} from "../cb00/constructionGovernance.js";

export const CONSTRUCTION_LEDGER_ID = "CB-19:ConstructionLedger";

/**
 * Build construction ledger for all Factory 2.0 phases.
 * @param {{
 *   includeCb19?: boolean,
 *   cb19Status?: string,
 *   cb19Meta?: object,
 * }} [options]
 */
export function buildConstructionLedger(options = {}) {
  const status = loadPhaseStatus();
  const includeCb19 = options.includeCb19 !== false;

  const entries = CONSTRUCTION_PHASES.map((phase) => {
    const record = getPhaseRecord(phase.id, status);
    if (phase.id === "CB-19" && includeCb19) {
      return {
        phaseId: phase.id,
        name: phase.name,
        pConst: phase.pConst,
        status: options.cb19Status ?? record.status ?? "PENDING",
        completedAt: options.cb19Meta?.completedAt ?? record.completedAt ?? null,
        validationReport: options.cb19Meta?.validationReport ?? record.validationReport ?? null,
        approvedBy: options.cb19Meta?.approvedBy ?? record.approvedBy ?? null,
      };
    }
    return {
      phaseId: phase.id,
      name: phase.name,
      pConst: phase.pConst,
      status: record.status ?? "PENDING",
      completedAt: record.completedAt ?? null,
      validationReport: record.validationReport ?? null,
      approvedBy: record.approvedBy ?? null,
    };
  });

  const phaseIds = entries.map((e) => e.phaseId);
  const expected = CONSTRUCTION_PHASES.map((p) => p.id);
  const coversAll =
    expected.length === phaseIds.length && expected.every((id, i) => phaseIds[i] === id);

  const closedOrComplete = entries.filter(
    (e) => e.status === "COMPLETE" || e.status === "APPROVED"
  );

  return {
    ledgerId: CONSTRUCTION_LEDGER_ID,
    version: 1,
    generatedAt: new Date().toISOString(),
    phaseCount: entries.length,
    expectedPhaseCount: 20,
    coversCb00ToCb19: coversAll && entries[0]?.phaseId === "CB-00" && entries[19]?.phaseId === "CB-19",
    entries,
    closedCount: closedOrComplete.length,
    allPriorApproved: entries
      .filter((e) => e.phaseId !== "CB-19")
      .every((e) => e.status === "APPROVED"),
    constitutionalPhase: "CB-19",
  };
}

/**
 * @param {ReturnType<buildConstructionLedger>} ledger
 */
export function validateConstructionLedger(ledger) {
  const errors = [];
  if (ledger.phaseCount !== 20) {
    errors.push(`Expected 20 phases CB-00→CB-19, got ${ledger.phaseCount}`);
  }
  if (!ledger.coversCb00ToCb19) {
    errors.push("Construction Ledger must register CB-00→CB-19 in order");
  }
  if (!ledger.allPriorApproved) {
    errors.push("CB-00→CB-18 must be APPROVED before Factory closure");
  }
  const ids = ledger.entries.map((e) => e.phaseId);
  for (let i = 0; i < CONSTRUCTION_PHASES.length; i++) {
    if (ids[i] !== CONSTRUCTION_PHASES[i].id) {
      errors.push(`Phase order mismatch at index ${i}: ${ids[i]}`);
    }
  }
  return { valid: errors.length === 0, errors };
}

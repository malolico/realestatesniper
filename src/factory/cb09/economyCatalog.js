/**
 * CB-09 — Economy / valuation layer catalog (P6 / ECO)
 */

export const ECONOMY_MPI_DOMAINS = Object.freeze([
  "21",
  "22",
  "23",
  "24",
  "25",
  "27",
  "28",
  "29",
  "30",
  "31",
  "32",
]);

export const ECONOMY_MOTORS = Object.freeze([
  { id: "MOT-FIN-01", cap: "CAP-13", mpiDomain: "21", mission: "Equity & Financial Position Motor" },
  { id: "MOT-FIN-02", cap: "CAP-13", mpiDomain: "22", mission: "Mortgage Position & Payoff Motor" },
  { id: "MOT-HAZ-01", cap: "CAP-14", mpiDomain: "24", mission: "Natural Hazard Classification Motor" },
  { id: "MOT-HAZ-02", cap: "CAP-14", mpiDomain: "25", mission: "Environmental Risk & Contamination Motor" },
  { id: "MOT-MKT-01", cap: "CAP-15", mpiDomain: "27", mission: "Submarket Dynamics Motor" },
  { id: "MOT-MKT-02", cap: "CAP-15", mpiDomain: "28", mission: "Comparable Sales Selection Motor" },
  { id: "MOT-MKT-03", cap: "CAP-15", mpiDomain: "29", mission: "Valuation Reconciliation Motor" },
  { id: "MOT-INV-01", cap: "CAP-16", mpiDomain: "30", mission: "Pro Forma Profitability Motor" },
  { id: "MOT-INV-02", cap: "CAP-16", mpiDomain: "31", mission: "Investment Strategy Fit Motor" },
]);

export const ECONOMY_LOOPS = Object.freeze([
  {
    id: "LOOP-ECO-SUP-01",
    type: "SUP",
    mission: "Economy Layer Orchestration Loop",
    handoffTarget: "LOOP-INT-RDY-01",
  },
  { id: "LOOP-ECO-FRS-01", type: "FRS", mission: "Financial & Fiscal Freshness Loop" },
  { id: "LOOP-ECO-QLT-01", type: "QLT", mission: "Market Valuation Quality Loop" },
  { id: "LOOP-ECO-QLT-02", type: "QLT", mission: "Investment Model Sufficiency Loop" },
  { id: "LOOP-ECO-FRS-02", type: "FRS", mission: "Territorial Hazard Refresh Loop" },
]);

export const ECONOMY_PIPELINE_SEQUENCE = Object.freeze([
  "MOT-FIN-01",
  "MOT-FIN-02",
  "MOT-HAZ-01",
  "MOT-HAZ-02",
  "MOT-MKT-01",
  "MOT-MKT-02",
  "MOT-MKT-03",
  "MOT-INV-01",
  "MOT-INV-02",
]);

export const OMC_MOTOR_COUNT_CONSTITUTIONAL = 52;

/** OMC indexes MOT-FIN-03 — blueprint lists FIN-01/02 only */
export const DEFERRED_OMC_MOTOR_FIN_03 = "MOT-FIN-03";

/** Carried forward from CB-07/CB-08 — not resolved in CB-09 */
export const DEFERRED_OMC_MOTOR_LIEN_01 = "MOT-LIEN-01";

export function isEconomyMotor(motorId) {
  return ECONOMY_MOTORS.some((m) => m.id === motorId);
}

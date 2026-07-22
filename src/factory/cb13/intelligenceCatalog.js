/**
 * CB-13 — Intelligence / Readiness layer catalog (P7 / INT)
 */

export const INTELLIGENCE_MPI_DOMAINS = Object.freeze(["38", "39", "40", "41", "42"]);

export const INTELLIGENCE_MOTORS = Object.freeze([
  { id: "MOT-SYN-01", cap: "CAP-22", mpiDomain: "38", mission: "Knowledge Convergence" },
  { id: "MOT-SYN-02", cap: "CAP-22", mpiDomain: "39", mission: "Decision Readiness Validator" },
  { id: "MOT-DCN-01", cap: "CAP-23", mpiDomain: "40", mission: "Decision Corpus Assembler" },
  { id: "MOT-COM-01", cap: "CAP-24", mpiDomain: "41", mission: "Release Matrix Motor" },
  { id: "MOT-EXE-01", cap: "CAP-21", mpiDomain: "42", mission: "Executive IC Memo Motor" },
]);

export const INTELLIGENCE_LOOPS = Object.freeze([
  { id: "LOOP-INT-EVD-01", type: "EVD", mission: "Intelligence Evidence Sufficiency Loop" },
  {
    id: "LOOP-INT-RDY-01",
    type: "RDY",
    mission: "Decision Readiness Loop",
    handoffTarget: "CB-16:DecisionHandoff",
  },
  { id: "LOOP-INT-GAP-01", type: "GAP", mission: "Negotiation Gap Loop" },
  { id: "LOOP-INT-QLT-01", type: "QLT", mission: "Intelligence Quality Loop" },
  { id: "LOOP-INT-FRS-01", type: "FRS", mission: "Executive Freshness Loop" },
]);

export const INTELLIGENCE_PIPELINE_SEQUENCE = Object.freeze([
  "MOT-SYN-01",
  "MOT-SYN-02",
  "MOT-DCN-01",
  "MOT-COM-01",
  "MOT-EXE-01",
]);

/** FFO §III.7 Decision readiness gates */
export const READINESS_GATES = Object.freeze([
  { id: "G0", label: "CMP clearance PASS", evaluator: "complianceClearance" },
  { id: "G1", label: "factory_key C1–C2", evaluator: "factoryKeyConfidence" },
  { id: "G2", label: "Blockers Obl. resueltos o documentados", evaluator: "blockersResolved" },
  { id: "G3", label: "EVD sufficiency PASS", evaluator: "evidenceSufficiency" },
  { id: "G4", label: "SYN-02 readiness PASS", evaluator: "syn02Readiness" },
  { id: "G5", label: "Known unknowns Obl. declarados (DKN)", evaluator: "knownUnknowns" },
  { id: "G6", label: "IC path elements mínimos (si aplica)", evaluator: "icPathElements" },
]);

export const READINESS_GATE_COUNT = READINESS_GATES.length;

export const OMC_MOTOR_COUNT_CONSTITUTIONAL = 52;

/** Blueprint vs OMC index mismatch — documented risk */
export const CAP_BLUEPRINT_MISMATCH = Object.freeze({
  motSyn01: { blueprint: "CAP-22", omcIndex: "CAP-21" },
  motExe01: { blueprint: "CAP-21", omcIndex: "CAP-24" },
});

/**
 * @param {string} motorId
 */
export function isIntelligenceMotor(motorId) {
  return INTELLIGENCE_MOTORS.some((m) => m.id === motorId);
}

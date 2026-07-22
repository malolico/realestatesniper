/**
 * CB-08 — Distress layer catalog (P5 / DST)
 */

export const DISTRESS_MPI_DOMAINS = Object.freeze([
  "08",
  "09",
  "10",
  "11",
  "12",
  "16",
  "17",
  "18",
  "19",
  "26",
]);

export const DISTRESS_MOTORS = Object.freeze([
  { id: "MOT-MOT-01", cap: "CAP-08", mpiDomain: "12", mission: "Pre-Foreclosure Signal Motor" },
  { id: "MOT-MOT-02", cap: "CAP-08", mpiDomain: "12", mission: "Tax Delinquency Distress Signal Motor" },
  { id: "MOT-MOT-03", cap: "CAP-08", mpiDomain: "12", mission: "Listing Repricing Signal Motor" },
  { id: "MOT-MOT-04", cap: "CAP-08", mpiDomain: "12", mission: "Municipal Distress Enforcement Signal Motor" },
  { id: "MOT-MOT-05", cap: "CAP-08", mpiDomain: "12", mission: "Motivation Convergence Scorer" },
  { id: "MOT-CNT-01", cap: "CAP-09", mpiDomain: "13", mission: "Legitimate Contact Gate Motor" },
  { id: "MOT-CNT-02", cap: "CAP-09", mpiDomain: "38", mission: "Owner Authorization Scope Motor" },
  { id: "MOT-CHR-01", cap: "CAP-10", mpiDomain: "14", mission: "Property Event Timeline Motor" },
  { id: "MOT-CHR-02", cap: "CAP-10", mpiDomain: "14", mission: "Transaction & Listing History Motor" },
  { id: "MOT-JUD-01", cap: "CAP-11", mpiDomain: "15", mission: "Civil Litigation Index Motor" },
  { id: "MOT-LFE-01", cap: "CAP-12", mpiDomain: "16", mission: "Probate Proceedings Motor" },
  { id: "MOT-LFE-02", cap: "CAP-12", mpiDomain: "17", mission: "Divorce Title Impediment Motor" },
  { id: "MOT-LFE-03", cap: "CAP-12", mpiDomain: "18", mission: "Inheritance & Heir Structure Motor" },
  { id: "MOT-LFE-04", cap: "CAP-12", mpiDomain: "19", mission: "Trustee Sale & Auction Notice Motor" },
  { id: "MOT-COD-01", cap: "CAP-26", mpiDomain: "26", mission: "Municipal Code Enforcement Motor" },
]);

export const DISTRESS_LOOPS = Object.freeze([
  { id: "LOOP-DST-CNT-01", type: "CMP", mission: "Legitimate Contact & Authorization Loop" },
  { id: "LOOP-DST-CVG-01", type: "CVG", mission: "Motivation Convergence Loop" },
  { id: "LOOP-DST-SUP-01", type: "SUP", mission: "Distress Vital & Judicial Quality Loop" },
  { id: "LOOP-DST-INV-01", type: "INV", mission: "Distress Event Investigation Loop" },
  { id: "LOOP-XVR-CHR-01", type: "XVR", mission: "Cross-proceeding Timeline Loop" },
]);

export const DISTRESS_PIPELINE_SEQUENCE = Object.freeze([
  "MOT-MOT-01",
  "MOT-MOT-02",
  "MOT-MOT-03",
  "MOT-MOT-04",
  "MOT-MOT-05",
  "MOT-CHR-01",
  "MOT-CHR-02",
  "MOT-JUD-01",
  "MOT-LFE-01",
  "MOT-LFE-02",
  "MOT-LFE-03",
  "MOT-LFE-04",
  "MOT-COD-01",
  "MOT-CNT-01",
  "MOT-CNT-02",
]);

export const OMC_MOTOR_COUNT_CONSTITUTIONAL = 52;

/** Carried forward from CB-07 — not resolved in CB-08 */
export const DEFERRED_OMC_MOTOR_LIEN_01 = "MOT-LIEN-01";

export function isDistressMotor(motorId) {
  return DISTRESS_MOTORS.some((m) => m.id === motorId);
}

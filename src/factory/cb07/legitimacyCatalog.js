/**
 * CB-07 — Legitimacy layer catalog (P4 / LEG)
 * Ownership, title, liens, regulatory — DDI Part II.
 */

import { PILOT_DDI_PART_II } from "../cb02/dsoDdiMapping.js";

export const LEGITIMACY_MPI_DOMAINS = Object.freeze(["04", "05", "06", "07", "08", "09", "10", "11"]);

export const LEGITIMACY_DDI_PART_II = PILOT_DDI_PART_II;

export const LEGITIMACY_MOTORS = Object.freeze([
  { id: "MOT-REG-01", cap: "CAP-04", mpiDomain: "04", mission: "Building Permit Ledger Motor" },
  { id: "MOT-REG-02", cap: "CAP-04", mpiDomain: "04", mission: "Zoning Classification Motor" },
  { id: "MOT-REG-03", cap: "CAP-04", mpiDomain: "04", mission: "Urban Envelope & FAR Motor" },
  { id: "MOT-LEG-01", cap: "CAP-05", mpiDomain: "07", mission: "Title Marketability Motor" },
  { id: "MOT-OWN-01", cap: "CAP-06", mpiDomain: "08", mission: "Record Owner Resolver" },
  { id: "MOT-OWN-02", cap: "CAP-06", mpiDomain: "08", mission: "Owner Verification Match Motor" },
  { id: "MOT-LIEN-01", cap: "CAP-07", mpiDomain: "09", mission: "Encumbrance Registry Motor" },
  { id: "MOT-OCR-01", cap: "CAP-25", mpiDomain: "10", mission: "Official Corpus Acquirer" },
  { id: "MOT-OCR-02", cap: "CAP-25", mpiDomain: "10", mission: "Document Authenticity Verifier" },
]);

export const LEGITIMACY_LOOPS = Object.freeze([
  {
    id: "LOOP-LEG-SUP-01",
    type: "SUP",
    mission: "Legitimacy Transfer Quality Loop",
    handoffFrom: "LOOP-FND-SUP-01",
    handoffTarget: "LOOP-DST-SUP-01",
  },
  {
    id: "LOOP-LEG-GAP-01",
    type: "GAP",
    mission: "Legitimacy Gap Closure Loop",
    mpiDomains: ["10", "39"],
  },
  {
    id: "LOOP-LEG-EVD-01",
    type: "EVD",
    mission: "Legitimacy Evidence Challenge Loop",
    swarmTarget: "CB-12:SWM-EVD-01",
  },
  {
    id: "LOOP-XVR-EVD-01",
    type: "XVR",
    mission: "Cross-layer Evidence Loop",
    transversal: true,
  },
]);

export const LEGITIMACY_PIPELINE_SEQUENCE = Object.freeze([
  "MOT-REG-01",
  "MOT-REG-02",
  "MOT-REG-03",
  "MOT-LEG-01",
  "MOT-OWN-01",
  "MOT-OWN-02",
  "MOT-OCR-01",
  "MOT-OCR-02",
]);

/** MOT-LIEN-01 is OMC-catalogued but CB-00 actor pattern requires 3-letter domain codes */
export const LEGITIMACY_MOTOR_RUNTIME_DEFERRED = Object.freeze(["MOT-LIEN-01"]);

export const OMC_MOTOR_COUNT_CONSTITUTIONAL = 52;

export const C1_BLOCKER_CODES = Object.freeze([
  "TITLE_CLOUD",
  "OWNER_MISMATCH",
  "LIEN_JUNIOR_UNRESOLVED",
  "DOC_GAP_OBL",
  "AUTHENTICITY_FAIL",
]);

export function isLegitimacyMotor(motorId) {
  return LEGITIMACY_MOTORS.some((m) => m.id === motorId);
}

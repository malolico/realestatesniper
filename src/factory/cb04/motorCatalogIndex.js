/**
 * CB-04 — Official motor catalog index with CAP binding per OMC.
 * Metadata only — no business logic.
 *
 * HQ-01 / Model R1 (canonical reconciliation — TD-OMC-52-56):
 * - Constitutional coverage (LFF / CANON_COUNTS.motors): 52
 * - Runtime CB-04 OMC index length: 56
 * - Indexed catalog is an intentional superset of constitutional coverage
 *   (indexed >= constitutional). These are two coherent axes, not a drift.
 * - Do not invent motors; do not drop indexed capabilities to force equality.
 */

/** Constitutional OMC coverage target (unchanged; not the runtime index size). */
export const OMC_CONSTITUTIONAL_COVERAGE_COUNT = 52;

/** Intentional CB-04 runtime index size (full OMC-indexed MOT set). */
export const MOTOR_CATALOG_INDEXED_EXPECTED = 56;

/** @typedef {{ id: string, cap: string, layer: number, name: string }} MotorCatalogEntry */

/** @type {readonly MotorCatalogEntry[]} */
export const MOTOR_CATALOG = Object.freeze([
  { id: "MOT-IDN-01", cap: "CAP-01", layer: 1, name: "Parcel Identity Resolver" },
  { id: "MOT-IDN-02", cap: "CAP-01", layer: 1, name: "Identity Cross-Source Reconciler" },
  { id: "MOT-LOC-01", cap: "CAP-02", layer: 1, name: "Jurisdictional Geospatial Resolver" },
  { id: "MOT-LOC-02", cap: "CAP-02", layer: 1, name: "Parcel Boundary Verifier" },
  { id: "MOT-PHY-01", cap: "CAP-03", layer: 1, name: "Assessor Physical Profile Motor" },
  { id: "MOT-PHY-02", cap: "CAP-03", layer: 1, name: "Certified Inspection Integrator" },
  { id: "MOT-REG-01", cap: "CAP-04", layer: 2, name: "Building Permit Ledger Motor" },
  { id: "MOT-REG-02", cap: "CAP-04", layer: 2, name: "Zoning Classification Motor" },
  { id: "MOT-REG-03", cap: "CAP-04", layer: 2, name: "Urban Envelope & FAR Motor" },
  { id: "MOT-LEG-01", cap: "CAP-05", layer: 2, name: "Title Marketability Motor" },
  { id: "MOT-OWN-01", cap: "CAP-06", layer: 2, name: "Record Owner Resolver" },
  { id: "MOT-OWN-02", cap: "CAP-06", layer: 2, name: "Owner Verification Match Motor" },
  { id: "MOT-LIEN-01", cap: "CAP-07", layer: 2, name: "Encumbrance Registry Motor" },
  { id: "MOT-OCR-01", cap: "CAP-25", layer: 2, name: "Official Corpus Acquirer" },
  { id: "MOT-OCR-02", cap: "CAP-25", layer: 2, name: "Document Authenticity Verifier" },
  { id: "MOT-MOT-01", cap: "CAP-08", layer: 3, name: "Pre-Foreclosure Signal Motor" },
  { id: "MOT-MOT-02", cap: "CAP-08", layer: 3, name: "Tax Delinquency Distress Signal Motor" },
  { id: "MOT-MOT-03", cap: "CAP-08", layer: 3, name: "Listing Repricing Signal Motor" },
  { id: "MOT-MOT-04", cap: "CAP-08", layer: 3, name: "Municipal Distress Enforcement Signal Motor" },
  { id: "MOT-MOT-05", cap: "CAP-08", layer: 3, name: "Motivation Convergence Scorer" },
  { id: "MOT-CNT-01", cap: "CAP-09", layer: 3, name: "Legitimate Contact Gate Motor" },
  { id: "MOT-CNT-02", cap: "CAP-09", layer: 3, name: "Owner Authorization Scope Motor" },
  { id: "MOT-CMP-01", cap: "CAP-09", layer: 3, name: "Factory Compliance Gate Motor" },
  { id: "MOT-CHR-01", cap: "CAP-10", layer: 3, name: "Property Event Timeline Motor" },
  { id: "MOT-CHR-02", cap: "CAP-10", layer: 3, name: "Transaction & Listing History Motor" },
  { id: "MOT-JUD-01", cap: "CAP-11", layer: 3, name: "Civil Litigation Index Motor" },
  { id: "MOT-LFE-01", cap: "CAP-12", layer: 3, name: "Probate Proceedings Motor" },
  { id: "MOT-LFE-02", cap: "CAP-12", layer: 3, name: "Divorce Title Impediment Motor" },
  { id: "MOT-LFE-03", cap: "CAP-12", layer: 3, name: "Inheritance & Heir Structure Motor" },
  { id: "MOT-LFE-04", cap: "CAP-12", layer: 3, name: "Trustee Sale & Auction Notice Motor" },
  { id: "MOT-COD-01", cap: "CAP-26", layer: 3, name: "Municipal Code Enforcement Motor" },
  { id: "MOT-FIN-01", cap: "CAP-13", layer: 4, name: "Equity & Financial Position Motor" },
  { id: "MOT-FIN-02", cap: "CAP-13", layer: 4, name: "Mortgage Position & Payoff Motor" },
  { id: "MOT-FIN-03", cap: "CAP-13", layer: 4, name: "Property Tax & Fiscal Status Motor" },
  { id: "MOT-HAZ-01", cap: "CAP-14", layer: 4, name: "Natural Hazard Classification Motor" },
  { id: "MOT-HAZ-02", cap: "CAP-14", layer: 4, name: "Environmental Risk & Contamination Motor" },
  { id: "MOT-MKT-01", cap: "CAP-15", layer: 4, name: "Submarket Dynamics Motor" },
  { id: "MOT-MKT-02", cap: "CAP-15", layer: 4, name: "Comparable Sales Selection Motor" },
  { id: "MOT-MKT-03", cap: "CAP-15", layer: 4, name: "Valuation Reconciliation Motor" },
  { id: "MOT-INV-01", cap: "CAP-16", layer: 4, name: "Pro Forma Profitability Motor" },
  { id: "MOT-INV-02", cap: "CAP-16", layer: 4, name: "Investment Strategy Fit Motor" },
  { id: "MOT-CTX-01", cap: "CAP-17", layer: 5, name: "Demographic Context Motor" },
  { id: "MOT-CTX-02", cap: "CAP-17", layer: 5, name: "Local Economy & Employment Motor" },
  { id: "MOT-LIV-01", cap: "CAP-18", layer: 5, name: "Crime & Safety Trend Motor" },
  { id: "MOT-LIV-02", cap: "CAP-18", layer: 5, name: "Education Assignment Motor" },
  { id: "MOT-LIV-03", cap: "CAP-18", layer: 5, name: "Mobility & Utilities Services Motor" },
  { id: "MOT-FUT-01", cap: "CAP-19", layer: 5, name: "Future Development Pipeline Motor" },
  { id: "MOT-EVD-01", cap: "CAP-20", layer: 6, name: "Master Evidence Registrar" },
  { id: "MOT-EVD-02", cap: "CAP-20", layer: 6, name: "Source Conflict Resolver" },
  { id: "MOT-SYN-01", cap: "CAP-21", layer: 6, name: "Cross-Domain Convergence Motor" },
  { id: "MOT-SYN-02", cap: "CAP-21", layer: 6, name: "Decision Readiness Gate Motor" },
  { id: "MOT-DCN-01", cap: "CAP-22", layer: 6, name: "Documentary Quality Governance Motor" },
  { id: "MOT-DCN-02", cap: "CAP-22", layer: 6, name: "Conversational Intelligence Motor" },
  { id: "MOT-DCN-03", cap: "CAP-22", layer: 6, name: "Negotiation Leverage & Close Probability Motor" },
  { id: "MOT-COM-01", cap: "CAP-23", layer: 6, name: "Knowledge Commercialization Motor" },
  { id: "MOT-EXE-01", cap: "CAP-24", layer: 6, name: "Institutional Executive Summary Motor" },
]);

const MOTOR_BY_ID = new Map(MOTOR_CATALOG.map((m) => [m.id, m]));

export function getMotorCatalogEntry(motorId) {
  return MOTOR_BY_ID.get(motorId) ?? null;
}

export function assertMotorInCatalog(motorId) {
  const entry = getMotorCatalogEntry(motorId);
  if (!entry) {
    throw new Error(`[CB-04 Runtime] Motor not in OMC catalog: ${motorId}`);
  }
  return entry;
}

export function assertCapBinding(motorId, capId) {
  const entry = assertMotorInCatalog(motorId);
  if (entry.cap !== capId) {
    throw new Error(
      `[CB-04 Runtime] CAP binding mismatch: ${motorId} expects ${entry.cap}, got ${capId}`
    );
  }
  return entry;
}

export const MOTOR_CATALOG_COUNT = MOTOR_CATALOG.length;

if (MOTOR_CATALOG_COUNT !== MOTOR_CATALOG_INDEXED_EXPECTED) {
  throw new Error(
    `[CB-04] MOTOR_CATALOG length ${MOTOR_CATALOG_COUNT} !== indexed expected ${MOTOR_CATALOG_INDEXED_EXPECTED}`
  );
}
if (MOTOR_CATALOG_COUNT < OMC_CONSTITUTIONAL_COVERAGE_COUNT) {
  throw new Error(
    `[CB-04] MOTOR_CATALOG length ${MOTOR_CATALOG_COUNT} < constitutional coverage ${OMC_CONSTITUTIONAL_COVERAGE_COUNT}`
  );
}

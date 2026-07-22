/**
 * CB-14 — Official AI Capability Catalog (OAC) — 26 AIA patterns
 */

export const OAC_AIA_COUNT = 26;

/** @typedef {"AUT-0"|"AUT-1"|"AUT-2"} AutLevel */

/**
 * @typedef {object} AiaPattern
 * @property {string} id
 * @property {string} name
 * @property {string} fun
 * @property {AutLevel} aut
 * @property {string} slot
 * @property {string[]} invokers
 * @property {number|null} uncertaintyMax
 * @property {"PRODUCTION"} productionClass
 */

/** @type {readonly AiaPattern[]} */
export const AIA_CATALOG = Object.freeze([
  { id: "AIA-NRM-01", name: "DDI Field Normalization Assistant", fun: "NRM", aut: "AUT-1", slot: "SLOT-01", invokers: ["MOT-IDN-01", "LOOP-FND-SUP-01"], uncertaintyMax: 0.5, productionClass: "PRODUCTION" },
  { id: "AIA-NRM-02", name: "Address Parcel Canonicalization Assistant", fun: "NRM", aut: "AUT-1", slot: "SLOT-01", invokers: ["MOT-IDN-01", "MOT-LOC-01"], uncertaintyMax: 0.4, productionClass: "PRODUCTION" },
  { id: "AIA-NRM-03", name: "Cross-Source Schema Harmonization Assistant", fun: "NRM", aut: "AUT-1", slot: "SLOT-01", invokers: ["MOT-IDN-02", "LOOP-FND-SUP-01"], uncertaintyMax: 0.55, productionClass: "PRODUCTION" },
  { id: "AIA-ENR-01", name: "Contextual Enrichment Suggester", fun: "ENR", aut: "AUT-0", slot: "SLOT-07", invokers: ["MOT-LOC-01", "LOOP-ENV-SUP-01"], uncertaintyMax: 0.6, productionClass: "PRODUCTION" },
  { id: "AIA-ENR-02", name: "Submarket Context Overlay Assistant", fun: "ENR", aut: "AUT-0", slot: "SLOT-07", invokers: ["MOT-MKT-01", "LOOP-ECO-SUP-01"], uncertaintyMax: 0.55, productionClass: "PRODUCTION" },
  { id: "AIA-VER-01", name: "Cross-Field Consistency Checker", fun: "VER", aut: "AUT-0", slot: "SLOT-04", invokers: ["MOT-IDN-01", "LOOP-FND-SUP-01"], uncertaintyMax: 0.45, productionClass: "PRODUCTION" },
  { id: "AIA-VER-02", name: "Source Plausibility Challenge Assistant", fun: "VER", aut: "AUT-0", slot: "SLOT-04", invokers: ["MOT-EVD-01", "LOOP-XVR-EVD-01"], uncertaintyMax: 0.5, productionClass: "PRODUCTION" },
  { id: "AIA-VER-03", name: "Evidence Conflict Signal Assistant", fun: "VER", aut: "AUT-0", slot: "SLOT-04", invokers: ["MOT-EVD-02", "LOOP-INT-EVD-01"], uncertaintyMax: 0.4, productionClass: "PRODUCTION" },
  { id: "AIA-GAP-01", name: "Obligatory Gap Detector", fun: "GAP", aut: "AUT-0", slot: "SLOT-05", invokers: ["LOOP-LEG-GAP-01", "LOOP-INT-GAP-01"], uncertaintyMax: 0.5, productionClass: "PRODUCTION" },
  { id: "AIA-GAP-02", name: "Readiness Gap Analyzer", fun: "GAP", aut: "AUT-0", slot: "SLOT-05", invokers: ["MOT-SYN-02", "LOOP-INT-RDY-01"], uncertaintyMax: 0.45, productionClass: "PRODUCTION" },
  { id: "AIA-SUM-01", name: "Conversation Transcript Summarizer", fun: "SUM", aut: "AUT-1", slot: "SLOT-06", invokers: ["MOT-CNT-01", "LOOP-DST-CNT-01"], uncertaintyMax: 0.55, productionClass: "PRODUCTION" },
  { id: "AIA-SUM-02", name: "IC Memo Draft Structuring Assistant", fun: "SUM", aut: "AUT-1", slot: "SLOT-06", invokers: ["MOT-EXE-01", "LOOP-INT-RDY-01"], uncertaintyMax: 0.5, productionClass: "PRODUCTION" },
  { id: "AIA-RNK-01", name: "Investigation Hypothesis Ranker", fun: "RNK", aut: "AUT-0", slot: "SLOT-05", invokers: ["MOT-INV-01", "LOOP-DST-INV-01"], uncertaintyMax: 0.55, productionClass: "PRODUCTION" },
  { id: "AIA-RNK-02", name: "Perfection Priority Ranker", fun: "RNK", aut: "AUT-0", slot: "SLOT-05", invokers: ["MOT-SYN-02", "LOOP-INT-QLT-01"], uncertaintyMax: 0.5, productionClass: "PRODUCTION" },
  { id: "AIA-MAP-01", name: "Source-to-DDI Element Mapper", fun: "MAP", aut: "AUT-1", slot: "SLOT-01", invokers: ["MOT-EVD-01", "LOOP-FND-SUP-01"], uncertaintyMax: 0.5, productionClass: "PRODUCTION" },
  { id: "AIA-MAP-02", name: "DSO Family Classifier Assistant", fun: "MAP", aut: "AUT-1", slot: "SLOT-01", invokers: ["MOT-LOC-01", "LOOP-ENV-SUP-01"], uncertaintyMax: 0.45, productionClass: "PRODUCTION" },
  { id: "AIA-UNC-01", name: "Universal Uncertainty Quantifier", fun: "UNC", aut: "AUT-0", slot: "SLOT-09", invokers: ["MOT-SYN-01", "MOT-SYN-02"], uncertaintyMax: null, productionClass: "PRODUCTION" },
  { id: "AIA-EXP-01", name: "Loop Decision Explainer", fun: "EXP", aut: "AUT-0", slot: "SLOT-08", invokers: ["LOOP-FND-SUP-01", "LOOP-INT-RDY-01"], uncertaintyMax: 0.6, productionClass: "PRODUCTION" },
  { id: "AIA-EXP-02", name: "Swarm Mission State Narrator", fun: "EXP", aut: "AUT-0", slot: "SLOT-08", invokers: ["SWM-SYN-01", "LOOP-INT-RDY-01"], uncertaintyMax: 0.55, productionClass: "PRODUCTION" },
  { id: "AIA-CRD-01", name: "Swarm Coordination Dashboard Assistant", fun: "CRD", aut: "AUT-0", slot: "SLOT-08", invokers: ["SWM-ECO-01", "SWM-EVD-01"], uncertaintyMax: 0.5, productionClass: "PRODUCTION" },
  { id: "AIA-EXT-01", name: "Recorded Document Field Extractor", fun: "EXT", aut: "AUT-2", slot: "SLOT-02", invokers: ["MOT-DOC-01", "LOOP-LEG-GAP-01"], uncertaintyMax: 0.45, productionClass: "PRODUCTION" },
  { id: "AIA-EXT-02", name: "Court Filing Field Extractor", fun: "EXT", aut: "AUT-2", slot: "SLOT-02", invokers: ["MOT-JUD-01", "LOOP-XVR-CHR-01"], uncertaintyMax: 0.5, productionClass: "PRODUCTION" },
  { id: "AIA-EXT-03", name: "MLS Listing Field Extractor", fun: "EXT", aut: "AUT-2", slot: "SLOT-02", invokers: ["MOT-MKT-02", "LOOP-ECO-QLT-01"], uncertaintyMax: 0.5, productionClass: "PRODUCTION" },
  { id: "AIA-MAT-01", name: "Parcel Identity Match Suggester", fun: "MAT", aut: "AUT-1", slot: "SLOT-03", invokers: ["MOT-IDN-01", "LOOP-FND-SUP-01"], uncertaintyMax: 0.4, productionClass: "PRODUCTION" },
  { id: "AIA-MAT-02", name: "Comparable Property Match Suggester", fun: "MAT", aut: "AUT-1", slot: "SLOT-03", invokers: ["MOT-MKT-02", "LOOP-ECO-QLT-01"], uncertaintyMax: 0.55, productionClass: "PRODUCTION" },
  { id: "AIA-MAT-03", name: "Owner Identity Match Suggester", fun: "MAT", aut: "AUT-1", slot: "SLOT-03", invokers: ["MOT-OWN-01", "LOOP-LEG-SUP-01"], uncertaintyMax: 0.45, productionClass: "PRODUCTION" },
]);

export const AIA_IDS = Object.freeze(AIA_CATALOG.map((a) => a.id));

/** Class X experimental — blocked from production per OAC-04 */
export const CLASS_X_AIA_BLOCKLIST = Object.freeze(["AIA-XPS-01", "AIA-XPS-02"]);

/**
 * @param {string} aiaId
 */
export function getAiaPattern(aiaId) {
  const pattern = AIA_CATALOG.find((a) => a.id === aiaId);
  if (!pattern) {
    throw new Error(`[CB-14 AIA Catalog] Unknown AIA: ${aiaId}`);
  }
  return pattern;
}

/**
 * @param {string} aiaId
 */
export function isProductionAia(aiaId) {
  if (CLASS_X_AIA_BLOCKLIST.includes(aiaId)) return false;
  const pattern = AIA_CATALOG.find((a) => a.id === aiaId);
  return pattern?.productionClass === "PRODUCTION";
}

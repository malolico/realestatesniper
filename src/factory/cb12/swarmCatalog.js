/**
 * CB-12 — Official Swarm Catalog (OSC) — 14 SWM patterns
 * Source: OFFICIAL_SWARM_CATALOG.md §I
 */

export const OSC_SWM_COUNT = 14;

/** @typedef {import('./swarmLifecycle.js').DieCode} DieCode */

/**
 * @typedef {object} SwarmPattern
 * @property {string} id
 * @property {string} name
 * @property {string} pattern
 * @property {string} prb
 * @property {string} mode
 * @property {string} derivingLoop
 * @property {string[]} primaryCaps
 * @property {string[]} motors
 * @property {string} csThreshold
 * @property {string} usMax
 */

/** @type {readonly SwarmPattern[]} */
export const SWM_CATALOG = Object.freeze([
  {
    id: "SWM-CVG-01",
    name: "Distress Motivation Convergence Swarm",
    pattern: "PTN-CVG",
    prb: "PRB-CVG",
    mode: "MOD-I",
    derivingLoop: "LOOP-DST-CVG-01",
    primaryCaps: ["CAP-08", "CAP-10", "CAP-13"],
    motors: ["MOT-MOT-01", "MOT-MOT-02", "MOT-MOT-03", "MOT-MOT-04", "MOT-MOT-05"],
    csThreshold: "CS-4",
    usMax: "US-3",
  },
  {
    id: "SWM-CHR-01",
    name: "Master Timeline Reconstruction Swarm",
    pattern: "PTN-CHR",
    prb: "PRB-CHR",
    mode: "MOD-P",
    derivingLoop: "LOOP-XVR-CHR-01",
    primaryCaps: ["CAP-10", "CAP-11", "CAP-12", "CAP-08"],
    motors: ["MOT-CHR-01", "MOT-CHR-02", "MOT-JUD-01", "MOT-LFE-01", "MOT-LFE-04", "MOT-MOT-01"],
    csThreshold: "CS-4",
    usMax: "US-2",
  },
  {
    id: "SWM-EVD-01",
    name: "Multi-Domain Conflict Resolution Swarm",
    pattern: "PTN-EVD",
    prb: "PRB-EVD",
    mode: "MOD-C",
    derivingLoop: "LOOP-XVR-EVD-01",
    primaryCaps: ["CAP-03", "CAP-04", "CAP-05"],
    motors: ["MOT-EVD-01", "MOT-EVD-02"],
    csThreshold: "CS-4",
    usMax: "US-2",
  },
  {
    id: "SWM-LEG-01",
    name: "Legitimacy Challenge Swarm",
    pattern: "PTN-LEG",
    prb: "PRB-LEG",
    mode: "MOD-C",
    derivingLoop: "LOOP-LEG-EVD-01",
    primaryCaps: ["CAP-04", "CAP-05", "CAP-06"],
    motors: ["MOT-OWN-01", "MOT-OWN-02", "MOT-TTL-01"],
    csThreshold: "CS-4",
    usMax: "US-2",
  },
  {
    id: "SWM-DST-01",
    name: "Vital Distress Convergence Swarm",
    pattern: "PTN-DST",
    prb: "PRB-INV",
    mode: "MOD-P",
    derivingLoop: "LOOP-DST-SUP-01",
    primaryCaps: ["CAP-08", "CAP-09", "CAP-10"],
    motors: ["MOT-MOT-01", "MOT-MOT-05", "MOT-CNT-01", "MOT-CNT-02"],
    csThreshold: "CS-4",
    usMax: "US-2",
  },
  {
    id: "SWM-INV-01",
    name: "Parallel Distress Investigation Swarm",
    pattern: "PTN-INV",
    prb: "PRB-INV",
    mode: "MOD-P",
    derivingLoop: "LOOP-DST-INV-01",
    primaryCaps: ["CAP-08", "CAP-09", "CAP-11"],
    motors: ["MOT-INV-01", "MOT-INV-02", "MOT-JUD-01"],
    csThreshold: "CS-3",
    usMax: "US-3",
  },
  {
    id: "SWM-ECO-01",
    name: "Economy Layer Integration Swarm",
    pattern: "PTN-ECO",
    prb: "PRB-ECO",
    mode: "MOD-X",
    derivingLoop: "LOOP-ECO-SUP-01",
    primaryCaps: ["CAP-14", "CAP-15", "CAP-16"],
    motors: ["MOT-FIN-01", "MOT-MKT-01", "MOT-MKT-02", "MOT-HAZ-01"],
    csThreshold: "CS-4",
    usMax: "US-2",
  },
  {
    id: "SWM-VAL-01",
    name: "Valuation Convergence Swarm",
    pattern: "PTN-VAL",
    prb: "PRB-ECO",
    mode: "MOD-I",
    derivingLoop: "LOOP-ECO-QLT-01",
    primaryCaps: ["CAP-15", "CAP-16"],
    motors: ["MOT-MKT-02", "MOT-FIN-02"],
    csThreshold: "CS-4",
    usMax: "US-2",
  },
  {
    id: "SWM-IVM-01",
    name: "Investment Sensitivity Swarm",
    pattern: "PTN-INV-M",
    prb: "PRB-ECO",
    mode: "MOD-I",
    derivingLoop: "LOOP-ECO-QLT-02",
    primaryCaps: ["CAP-16", "CAP-17"],
    motors: ["MOT-IVM-01", "MOT-FIN-02"],
    csThreshold: "CS-4",
    usMax: "US-2",
  },
  {
    id: "SWM-SUF-01",
    name: "Pre-Synthesis Sufficiency Swarm",
    pattern: "PTN-SUF",
    prb: "PRB-SYN",
    mode: "MOD-F",
    derivingLoop: "LOOP-INT-EVD-01",
    primaryCaps: ["CAP-21", "CAP-22"],
    motors: ["MOT-SYN-01", "MOT-EVD-01"],
    csThreshold: "CS-4",
    usMax: "US-2",
  },
  {
    id: "SWM-SYN-01",
    name: "Factory Synthesis Divergence Swarm",
    pattern: "PTN-SYN",
    prb: "PRB-SYN",
    mode: "MOD-F",
    derivingLoop: "LOOP-INT-RDY-01",
    primaryCaps: ["CAP-22", "CAP-23"],
    motors: ["MOT-SYN-01", "MOT-SYN-02", "MOT-DCN-01"],
    csThreshold: "CS-4",
    usMax: "US-2",
  },
  {
    id: "SWM-NEG-01",
    name: "Negotiation Leverage Swarm",
    pattern: "PTN-NEG",
    prb: "PRB-NEG",
    mode: "MOD-X",
    derivingLoop: "LOOP-INT-GAP-01",
    primaryCaps: ["CAP-24", "CAP-25"],
    motors: ["MOT-COM-01", "MOT-EXE-01"],
    csThreshold: "CS-3",
    usMax: "US-3",
  },
  {
    id: "SWM-IDN-01",
    name: "Identity Reconciliation Swarm",
    pattern: "PTN-IDN",
    prb: "PRB-IDN",
    mode: "MOD-C",
    derivingLoop: "LOOP-FND-SUP-01",
    primaryCaps: ["CAP-01", "CAP-02", "CAP-03"],
    motors: ["MOT-IDN-01", "MOT-IDN-02", "MOT-LOC-01"],
    csThreshold: "CS-4",
    usMax: "US-2",
  },
  {
    id: "SWM-OCR-01",
    name: "Corpus Custody Chain Swarm",
    pattern: "PTN-OCR",
    prb: "PRB-LEG",
    mode: "MOD-X",
    derivingLoop: "LOOP-LEG-GAP-01",
    primaryCaps: ["CAP-05", "CAP-06"],
    motors: ["MOT-DOC-01", "MOT-DOC-02"],
    csThreshold: "CS-4",
    usMax: "US-2",
  },
]);

export const SWM_IDS = Object.freeze(SWM_CATALOG.map((s) => s.id));

export const LOOP_TO_SWM = Object.freeze(
  Object.fromEntries(SWM_CATALOG.map((s) => [s.derivingLoop, s.id]))
);

/**
 * @param {string} swmId
 */
export function getSwarmPattern(swmId) {
  const pattern = SWM_CATALOG.find((s) => s.id === swmId);
  if (!pattern) {
    throw new Error(`[CB-12 Swarm Catalog] Unknown SWM: ${swmId}`);
  }
  return pattern;
}

/**
 * @param {string} loopId
 */
export function getSwarmForDerivingLoop(loopId) {
  const swmId = LOOP_TO_SWM[loopId];
  return swmId ? getSwarmPattern(swmId) : null;
}

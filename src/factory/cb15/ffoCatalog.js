/**
 * CB-15 — FFO Orchestration catalog (P-CONST, layers A→F)
 */

export const FFO_LAYER_PIPELINE = Object.freeze([
  { layer: "A", phases: ["P0"], name: "Compliance", cbPhase: "CB-03" },
  { layer: "B", phases: ["P1", "P2", "P3"], name: "Foundation + Evidence", cbPhases: ["CB-05", "CB-06"] },
  { layer: "C", phases: ["P4"], name: "Legitimacy", cbPhase: "CB-07" },
  { layer: "D", phases: ["P5"], name: "Distress", cbPhase: "CB-08" },
  { layer: "E", phases: ["P6"], name: "Economy", cbPhase: "CB-09" },
  { layer: "F", phases: ["P7", "P8", "P9"], name: "Environment + Intelligence", cbPhases: ["CB-10", "CB-13"] },
]);

export const P_CONST_PIPELINE = Object.freeze([
  { priority: 0, code: "P0", label: "Compliance", actors: ["MOT-CMP-01", "LOOP-XVR-CMP-01"] },
  { priority: 1, code: "P1", label: "Identidad", actors: ["MOT-IDN-01", "LOOP-FND-SUP-01"] },
  { priority: 2, code: "P2", label: "Blockers C1 Obl.", actors: ["LOOP-LEG-GAP-01"] },
  { priority: 3, code: "P3", label: "Evidencia sufficiency", actors: ["MOT-EVD-01", "LOOP-INT-EVD-01"] },
  { priority: 4, code: "P4", label: "Legitimidad transfer", actors: ["LOOP-LEG-SUP-01"] },
  { priority: 5, code: "P5", label: "Distress auténtico", actors: ["LOOP-DST-CVG-01"] },
  { priority: 6, code: "P6", label: "Finanzas y valoración", actors: ["LOOP-ECO-SUP-01"] },
  { priority: 7, code: "P7", label: "Síntesis readiness", actors: ["LOOP-INT-RDY-01", "MOT-SYN-02"] },
  { priority: 8, code: "P8", label: "Entorno contextual", actors: ["LOOP-ENV-SUP-01"] },
  { priority: 9, code: "P9", label: "Ejecutivo IC", actors: ["LOOP-INT-FRS-01", "MOT-EXE-01"] },
]);

export const FFO_CONSTITUTIONAL_LAWS = Object.freeze([
  "FFO-01", "FFO-02", "FFO-03", "FFO-04", "FFO-05", "FFO-06",
  "FFO-07", "FFO-08", "FFO-09", "FFO-10", "FFO-11", "FFO-12",
  "FFO-13", "FFO-14", "FFO-15", "FFO-16",
]);

export const ORCHESTRATION_BUS_ACTOR = "MOT-SYN-02";

export const OMC_MOTOR_COUNT_CONSTITUTIONAL = 52;

export const SOVEREIGN_DOWNSTREAM_BOUNDARIES = Object.freeze([
  "Decision",
  "Projection",
  "Marketplace",
  "Producto",
]);

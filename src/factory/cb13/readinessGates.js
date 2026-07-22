/**
 * CB-13 — Decision readiness gates G0–G6 (FFO §III.7)
 */

import { CLEARANCE_STATUS } from "../cb03/clearanceProtocol.js";
import { SUFFICIENCY_STATUS } from "../cb06/sufficiencyGate.js";
import { READINESS_GATES } from "./intelligenceCatalog.js";

/**
 * @param {object} ctx
 */
export function evaluateGateG0(ctx) {
  const pass = ctx.clearance === CLEARANCE_STATUS.PASS;
  return { gate: "G0", pass, detail: { clearance: ctx.clearance } };
}

/**
 * @param {object} ctx
 */
export function evaluateGateG1(ctx) {
  const confidence = ctx.keyConfidence ?? "C2";
  const pass = ["C1", "C2"].includes(confidence);
  return { gate: "G1", pass, detail: { keyConfidence: confidence, keyStatus: ctx.keyStatus } };
}

/**
 * @param {object} ctx
 */
export function evaluateGateG2(ctx) {
  const blockers = ctx.blockers ?? [];
  const openObl = blockers.filter((b) => b.obligation === "Obl" && b.resolved !== true);
  const pass = openObl.length === 0;
  return {
    gate: "G2",
    pass,
    detail: { openOblBlockers: openObl.length, documented: ctx.blockersDocumented === true },
  };
}

/**
 * @param {object} ctx
 */
export function evaluateGateG3(ctx) {
  const pass = ctx.sufficiencyStatus === SUFFICIENCY_STATUS.PASS;
  return { gate: "G3", pass, detail: { sufficiency: ctx.sufficiencyStatus } };
}

/**
 * @param {object} ctx
 */
export function evaluateGateG4(ctx) {
  const pass = ctx.syn02Readiness === true;
  return { gate: "G4", pass, detail: { syn02Readiness: ctx.syn02Readiness } };
}

/**
 * @param {object} ctx
 */
export function evaluateGateG5(ctx) {
  const unknowns = ctx.knownUnknowns ?? [];
  const openObl = unknowns.filter((u) => u.obligation === "Obl" && u.declared !== true);
  const pass = openObl.length === 0 && unknowns.length > 0;
  return { gate: "G5", pass, detail: { declaredCount: unknowns.filter((u) => u.declared).length } };
}

/**
 * @param {object} ctx
 */
export function evaluateGateG6(ctx) {
  const icRequired = ctx.icPathRequired !== false;
  if (!icRequired) {
    return { gate: "G6", pass: true, detail: { waived: true } };
  }
  const pass = ctx.icPathComplete === true;
  return {
    gate: "G6",
    pass,
    detail: {
      execMemoPresent: ctx.execMemoPresent === true,
      releaseMatrixPresent: ctx.releaseMatrixPresent === true,
    },
  };
}

const GATE_EVALUATORS = Object.freeze({
  G0: evaluateGateG0,
  G1: evaluateGateG1,
  G2: evaluateGateG2,
  G3: evaluateGateG3,
  G4: evaluateGateG4,
  G5: evaluateGateG5,
  G6: evaluateGateG6,
});

/**
 * @param {object} ctx
 */
export function evaluateAllReadinessGates(ctx) {
  const results = READINESS_GATES.map((g) => GATE_EVALUATORS[g.id](ctx));
  const allPass = results.every((r) => r.pass);
  return {
    gates: results,
    allPass,
    passCount: results.filter((r) => r.pass).length,
    gateCount: READINESS_GATES.length,
    evaluatedBy: "MOT-SYN-02",
  };
}

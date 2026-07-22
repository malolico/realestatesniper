/**
 * CB-15 — Maturity score (FFO §III — LFF-12)
 */

import { SUFFICIENCY_STATUS } from "../cb06/sufficiencyGate.js";

/**
 * @param {{
 *   mpiCoveragePercent?: number,
 *   sufficiencyStatus?: string,
 *   readinessGatesPass?: boolean,
 *   identityConfidence?: string,
 *   state?: string,
 * }} input
 */
export function calculateMaturityScore(input) {
  const completeness = Math.max(0, Math.min(1, input.mpiCoveragePercent ?? 0));
  const sufficiency =
    input.sufficiencyStatus === SUFFICIENCY_STATUS.PASS ? 1 : 0;
  const readiness = input.readinessGatesPass === true ? 1 : 0;
  const cGlobal =
    input.identityConfidence === "C1" ? 1 : input.identityConfidence === "C2" ? 0.85 : 0.5;
  const stateBonus = input.state === "ST-RDY" ? 0.05 : 0;

  const raw =
    completeness * 0.25 + sufficiency * 0.25 + readiness * 0.3 + cGlobal * 0.2 + stateBonus;

  return {
    maturity_score: Math.round(Math.min(1, raw) * 1000) / 1000,
    components: {
      completeness,
      sufficiency,
      readiness,
      cGlobal,
      stateBonus,
    },
    formula: "f(completeness DDI, C global, sufficiency EVD, readiness SYN-02)",
    rule: "LFF-12",
  };
}

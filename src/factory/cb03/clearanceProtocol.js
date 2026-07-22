/**
 * CB-03 — Compliance clearance states (NASC-01 / MOT-CMP-01)
 */

export const CLEARANCE_STATUS = Object.freeze({
  PENDING: "PENDING",
  PASS: "PASS",
  FAIL: "FAIL",
  BLOCK: "BLOCK",
});

export const NASC_01_RULE =
  "Sin MOT-CMP-01 clearance — expediente no avanza a producción (ST-IDN/PROD)";

/**
 * @param {string} status
 */
export function isProductiveClearance(status) {
  return status === CLEARANCE_STATUS.PASS;
}

/**
 * @param {string} toState
 */
export function requiresCmpClearance(toState) {
  return toState === "ST-IDN" || toState === "ST-PROD";
}

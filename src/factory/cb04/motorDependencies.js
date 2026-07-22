/**
 * CB-04 — OMC dependency rules DEP-01..DEP-08
 */

/**
 * @typedef {Object} ExecutionContext
 * @property {Set<string>} completedMotors
 * @property {boolean} [idnResolved]
 * @property {boolean} [cmpClearance]
 * @property {boolean} [evdSufficiency]
 * @property {boolean} [cnt02Authorized]
 * @property {boolean} [lienResolved]
 */

/**
 * @param {string} motorId
 * @param {import('./motorCatalogIndex.js').MotorCatalogEntry} entry
 * @param {ExecutionContext} ctx
 */
export function resolveDependencies(motorId, entry, ctx) {
  const failures = [];

  if (entry.layer >= 3 && !ctx.completedMotors.has("MOT-IDN-01") && !ctx.idnResolved) {
    failures.push({ rule: "DEP-01", message: "Capa 3+ blocked without MOT-IDN-01" });
  }

  if (motorId === "MOT-CNT-01" && !ctx.cmpClearance && !ctx.completedMotors.has("MOT-CMP-01")) {
    failures.push({ rule: "DEP-06", message: "MOT-CNT-01 requires MOT-CMP-01 clearance" });
  }

  if (motorId === "MOT-SYN-01" && !ctx.evdSufficiency && !ctx.completedMotors.has("MOT-EVD-01")) {
    failures.push({ rule: "DEP-03", message: "MOT-SYN-01 requires MOT-EVD-01 sufficiency" });
  }

  if (
    motorId === "MOT-EXE-01" &&
    (!ctx.completedMotors.has("MOT-SYN-01") || !ctx.completedMotors.has("MOT-SYN-02"))
  ) {
    failures.push({ rule: "DEP-04", message: "MOT-EXE-01 requires MOT-SYN-01 + MOT-SYN-02" });
  }

  if (motorId === "MOT-COM-01" && !ctx.cnt02Authorized && !ctx.completedMotors.has("MOT-CNT-02")) {
    failures.push({ rule: "DEP-05", message: "MOT-COM-01 requires MOT-CNT-02 authorization" });
  }

  if (
    motorId === "MOT-MKT-03" &&
    (!ctx.completedMotors.has("MOT-IDN-01") || !ctx.completedMotors.has("MOT-MKT-02"))
  ) {
    failures.push({ rule: "DEP-07", message: "MOT-MKT-03 requires identity + comps" });
  }

  if (motorId === "MOT-FIN-01" && !ctx.completedMotors.has("MOT-LIEN-01") && !ctx.lienResolved) {
    failures.push({ rule: "DEP-08", message: "MOT-FIN-01 requires MOT-LIEN-01" });
  }

  return {
    allowed: failures.length === 0,
    failures,
    motorId,
  };
}

export const DEP_EVD_INTERCEPT_RULE = "DEP-02";

/**
 * CB-10 — Environment / context layer catalog (P8 / ENV)
 */

export const ENVIRONMENT_MPI_DOMAINS = Object.freeze(["33", "34", "35", "36", "37"]);

export const ENVIRONMENT_MOTORS = Object.freeze([
  { id: "MOT-CTX-01", cap: "CAP-17", mpiDomain: "33", mission: "Demographic Context Motor" },
  { id: "MOT-CTX-02", cap: "CAP-17", mpiDomain: "36", mission: "Local Economy & Employment Motor" },
  { id: "MOT-LIV-01", cap: "CAP-18", mpiDomain: "33", mission: "Crime & Safety Trend Motor" },
  { id: "MOT-LIV-02", cap: "CAP-18", mpiDomain: "34", mission: "Education Assignment Motor" },
  { id: "MOT-FUT-01", cap: "CAP-19", mpiDomain: "37", mission: "Future Development Pipeline Motor" },
]);

export const ENVIRONMENT_LOOPS = Object.freeze([
  {
    id: "LOOP-ENV-SUP-01",
    type: "SUP",
    mission: "Environment Context Quality Loop",
    handoffTarget: "LOOP-INT-RDY-01",
    olcPipelineStage: "ENV",
  },
  { id: "LOOP-ENV-FRS-01", type: "FRS", mission: "Environment Context Freshness Loop" },
]);

export const OLC_PIPELINE_ORDER = Object.freeze([
  "LOOP-XVR-CMP-01",
  "FND",
  "LEG",
  "DST",
  "ECO",
  "ENV",
  "INT",
]);

export const ENVIRONMENT_PIPELINE_SEQUENCE = Object.freeze([
  "MOT-CTX-01",
  "MOT-CTX-02",
  "MOT-LIV-01",
  "MOT-LIV-02",
  "MOT-FUT-01",
]);

export const OMC_MOTOR_COUNT_CONSTITUTIONAL = 52;

/** Blueprint lists MOT-FUT-01/02 — OMC indexes only FUT-01 */
export const DEFERRED_OMC_MOTOR_FUT_02 = "MOT-FUT-02";

/** OMC indexes MOT-LIV-03 — blueprint lists LIV-01/02 only */
export const DEFERRED_OMC_MOTOR_LIV_03 = "MOT-LIV-03";

/** Carried forward — not resolved in CB-10 */
export const DEFERRED_OMC_MOTOR_LIEN_01 = "MOT-LIEN-01";

export function isEnvironmentMotor(motorId) {
  return ENVIRONMENT_MOTORS.some((m) => m.id === motorId);
}

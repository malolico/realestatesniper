/**
 * CB-05 — Foundation layer catalog (P1 / FND)
 * MPI domains 01–03 · CAP-01..03 · six foundation motors · two FND loops.
 */

export const FOUNDATION_MPI_DOMAINS = Object.freeze(["01", "02", "03"]);

export const FOUNDATION_MOTORS = Object.freeze([
  { id: "MOT-IDN-01", cap: "CAP-01", mpiDomain: "01", mission: "Parcel Identity Resolver" },
  { id: "MOT-IDN-02", cap: "CAP-01", mpiDomain: "01", mission: "Identity Cross-Source Reconciler" },
  { id: "MOT-LOC-01", cap: "CAP-02", mpiDomain: "02", mission: "Jurisdictional Geospatial Resolver" },
  { id: "MOT-LOC-02", cap: "CAP-02", mpiDomain: "02", mission: "Parcel Boundary Verifier" },
  { id: "MOT-PHY-01", cap: "CAP-03", mpiDomain: "03", mission: "Assessor Physical Profile Motor" },
  { id: "MOT-PHY-02", cap: "CAP-03", mpiDomain: "03", mission: "Certified Inspection Integrator" },
]);

export const FOUNDATION_LOOPS = Object.freeze([
  {
    id: "LOOP-FND-SUP-01",
    type: "SUP",
    mission: "Foundation Layer Quality Loop",
    supervisedMotors: FOUNDATION_MOTORS.map((m) => m.id),
    mpiDomains: FOUNDATION_MPI_DOMAINS,
    handoffTarget: "LOOP-LEG-SUP-01",
  },
  {
    id: "LOOP-FND-FRS-01",
    type: "FRS",
    mission: "Foundation Freshness Guardian Loop",
    supervisedMotors: ["MOT-IDN-01", "MOT-IDN-02", "MOT-LOC-01", "MOT-PHY-01"],
    mpiDomains: FOUNDATION_MPI_DOMAINS,
    handoffTarget: null,
  },
]);

export const FOUNDATION_STATE_PATH = Object.freeze([
  { from: "ST-NASC", to: "ST-IDN", actor: "MOT-IDN-01" },
  { from: "ST-IDN", to: "ST-PROD", actor: "LOOP-FND-SUP-01" },
]);

export const FOUNDATION_MIN_CONFIDENCE = "C1";

export const OMC_MOTOR_COUNT_CONSTITUTIONAL = 52;

export function isFoundationMotor(motorId) {
  return FOUNDATION_MOTORS.some((m) => m.id === motorId);
}

export function getFoundationMotor(motorId) {
  return FOUNDATION_MOTORS.find((m) => m.id === motorId) ?? null;
}

/**
 * CB-14 — PRH prohibitions (IGA PRH-01..15)
 */

export const PRH_CODES = Object.freeze([
  "PRH-DEC",
  "PRH-PRD",
  "PRH-TIR",
  "PRH-DDI",
  "PRH-EC",
  "PRH-AVG",
  "PRH-ACT",
  "PRH-SWM",
  "PRH-RUN",
  "PRH-EVD",
  "PRH-CMP",
  "PRH-SRC",
  "PRH-CON",
  "PRH-AUT",
  "PRH-INF",
]);

/**
 * @param {object} request
 */
export function validatePrhCompliance(request) {
  const violations = [];

  if (request.emitDecision === true) violations.push("PRH-DEC");
  if (request.publishProduct === true) violations.push("PRH-PRD");
  if (request.assignAccessTier === true || request.accessTier != null) violations.push("PRH-TIR");
  if (request.modifyDdi === true) violations.push("PRH-DDI");
  if (request.elevateELevel === true || ["E3", "E4"].includes(request.proposedELevel)) {
    violations.push("PRH-EC");
  }
  if (request.averageConflicts === true) violations.push("PRH-AVG");
  if (request.activateActor === true) violations.push("PRH-ACT");
  if (request.deriveSwarm === true) violations.push("PRH-SWM");
  if (request.orderMotorRerun === true) violations.push("PRH-RUN");
  if (request.overrideEvidence === true) violations.push("PRH-EVD");
  if (request.bypassCompliance === true) violations.push("PRH-CMP");
  if (request.ingestNonDso === true) violations.push("PRH-SRC");
  if (request.modifyConstitution === true) violations.push("PRH-CON");
  if (request.autonomous === true || !request.invoker) violations.push("PRH-AUT");
  if (request.presentAsFact === true) violations.push("PRH-INF");

  return {
    pass: violations.length === 0,
    violations,
    prhCount: PRH_CODES.length,
  };
}

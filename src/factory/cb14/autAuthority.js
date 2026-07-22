/**
 * CB-14 — AUT-0/1/2 authority enforcement (OAC)
 */

/** @typedef {"AUT-0"|"AUT-1"|"AUT-2"} AutLevel */

/**
 * @param {AutLevel} autLevel
 * @param {{ invokerAccepted?: boolean, motorValidated?: boolean }} context
 */
export function enforceAutAuthority(autLevel, context = {}) {
  if (autLevel === "AUT-0") {
    return { allowed: true, mode: "suggestion_only", requiresAcceptance: false };
  }
  if (autLevel === "AUT-1") {
    if (context.invokerAccepted !== true) {
      return {
        allowed: false,
        mode: "suggestion_with_score",
        requiresAcceptance: true,
        reason: "AUT-1 requires explicit invoker acceptance",
      };
    }
    return { allowed: true, mode: "suggestion_with_score", requiresAcceptance: true };
  }
  if (autLevel === "AUT-2") {
    if (context.motorValidated !== true) {
      return {
        allowed: false,
        mode: "prefill_candidate",
        requiresMotorValidation: true,
        reason: "AUT-2 requires downstream motor validation",
      };
    }
    return { allowed: true, mode: "prefill_candidate", requiresMotorValidation: true };
  }
  return { allowed: false, reason: `Unknown AUT level: ${autLevel}` };
}

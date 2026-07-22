/**
 * CB-03 — Constitutional compliance rules (DSO FP/CP + FFO P0)
 */

export const COMPLIANCE_VIOLATION_CODES = Object.freeze({
  PROHIBITED_SOURCE: "CP-PROHIBITED-SOURCE",
  PII_UNAUTHORIZED: "CP-PII-UNAUTHORIZED",
  ACCESS_TIER_FORBIDDEN: "CP-ACCESS-TIER-FORBIDDEN",
  TCPA_CONTACT: "CP-TCPA-CONTACT",
  CLEARANCE_MISSING: "CP-CLEARANCE-MISSING",
  BLOCK_ACTIVE: "CP-BLOCK-ACTIVE",
  ACTOR_NOT_CATALOGUED: "CP-ACTOR-NOT-CATALOGUED",
  INFERENCE_AS_FACT: "CP-INFERENCE-AS-FACT",
});

export const CONSTITUTIONAL_PROHIBITED_CASES = Object.freeze([
  "CP-01",
  "CP-02",
  "CP-04",
  "CP-06",
  "CP-07",
  "CP-10",
]);

/**
 * @param {string[]} flags
 */
export function mapProhibitedFlagsToViolations(flags = []) {
  const violations = [];
  if (flags.includes("FP-02") || flags.includes("FP-08")) {
    violations.push(COMPLIANCE_VIOLATION_CODES.PROHIBITED_SOURCE);
  }
  if (flags.includes("FP-06") || flags.includes("FP-05")) {
    violations.push(COMPLIANCE_VIOLATION_CODES.PII_UNAUTHORIZED);
  }
  if (flags.includes("FP-10")) {
    violations.push(COMPLIANCE_VIOLATION_CODES.INFERENCE_AS_FACT);
  }
  return violations;
}

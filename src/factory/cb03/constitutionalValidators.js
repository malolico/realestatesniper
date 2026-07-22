/**
 * CB-03 — Constitutional pre-execution validators
 */

import { assertCatalogActor, assertNotAccessTierAssignment } from "../cb00/catalogActorGuard.js";
import { isPhaseApproved } from "../cb00/constructionGovernance.js";
import { COMPLIANCE_VIOLATION_CODES } from "./complianceRules.js";
import { isProductiveClearance, requiresCmpClearance } from "./clearanceProtocol.js";

export const CONSTITUTIONAL_VALIDATORS = Object.freeze([
  "PHASE_CB02_APPROVED",
  "CATALOG_ACTOR",
  "NO_ACCESS_TIER",
  "CMP_CLEARANCE",
  "NO_ACTIVE_BLOCK",
]);

/**
 * @param {{
 *   actor: string,
 *   operation: string,
 *   toState?: string,
 *   clearance?: string,
 *   blocked?: boolean,
 *   accessTier?: string,
 * }} context
 */
export function runConstitutionalValidators(context) {
  const failures = [];

  if (!isPhaseApproved("CB-02")) {
    failures.push({ code: "PHASE_GATE", message: "CB-02 must be APPROVED" });
  }

  try {
    assertCatalogActor(context.actor);
  } catch (err) {
    failures.push({
      code: COMPLIANCE_VIOLATION_CODES.ACTOR_NOT_CATALOGUED,
      message: err.message,
    });
  }

  try {
    assertNotAccessTierAssignment("access_tier", context.accessTier);
  } catch (err) {
    failures.push({
      code: COMPLIANCE_VIOLATION_CODES.ACCESS_TIER_FORBIDDEN,
      message: err.message,
    });
  }

  if (context.toState && requiresCmpClearance(context.toState)) {
    if (!isProductiveClearance(context.clearance ?? "PENDING")) {
      failures.push({
        code: COMPLIANCE_VIOLATION_CODES.CLEARANCE_MISSING,
        message: `NASC-01: clearance required for ${context.toState}`,
      });
    }
  }

  if (context.blocked === true) {
    failures.push({
      code: COMPLIANCE_VIOLATION_CODES.BLOCK_ACTIVE,
      message: "LK-02: CMP BLOCK active — locks suspended",
    });
  }

  return {
    valid: failures.length === 0,
    failures,
    operation: context.operation,
  };
}

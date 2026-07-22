/**
 * CB-03 — LOOP-XVR-CMP-01 Factory Compliance Perpetual Loop (logical supervisor)
 */

import { CLEARANCE_STATUS } from "./clearanceProtocol.js";
import { COMPLIANCE_VIOLATION_CODES } from "./complianceRules.js";

export class LoopXvrCmp01 {
  static ACTOR = "LOOP-XVR-CMP-01";

  /**
   * @param {ReturnType<import('./motCmp01.js').MotCmp01['evaluate']>} cmpResult
   * @param {{ repeatViolation?: boolean, authorizationRevoked?: boolean }} [context]
   */
  supervise(cmpResult, context = {}) {
    if (cmpResult.clearance === CLEARANCE_STATUS.PASS && !context.authorizationRevoked) {
      return {
        actor: LoopXvrCmp01.ACTOR,
        action: "FIN-S",
        block: false,
        message: "clearance_restored",
      };
    }

    if (
      cmpResult.violations.includes(COMPLIANCE_VIOLATION_CODES.PROHIBITED_SOURCE) ||
      context.repeatViolation === true ||
      context.authorizationRevoked === true
    ) {
      return {
        actor: LoopXvrCmp01.ACTOR,
        action: "FIN-C",
        block: true,
        message: "compliance_veto_active",
        suspendLocks: true,
        policy: "LK-02",
      };
    }

    return {
      actor: LoopXvrCmp01.ACTOR,
      action: "FIN-H",
      block: false,
      message: "compliance_review_required",
      escalate: "ComplianceCouncil",
    };
  }
}

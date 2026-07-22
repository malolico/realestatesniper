/**
 * CB-03 — MOT-CMP-01 Factory Compliance Gate Motor (logical instance)
 * No business motor runtime — P0 enforcer per OMC.
 */

import { detectProhibitedFlags } from "../cb02/prohibitedSources.js";
import {
  COMPLIANCE_VIOLATION_CODES,
  mapProhibitedFlagsToViolations,
} from "./complianceRules.js";
import { CLEARANCE_STATUS } from "./clearanceProtocol.js";

/**
 * @typedef {Object} CmpEvaluationInput
 * @property {string[]} [prohibitedFlags]
 * @property {boolean} [piiAuthorized]
 * @property {boolean} [contactAttemptWithoutTcpa]
 * @property {string} [accessTierAssignment]
 * @property {object} [sourceMetadata]
 */

export class MotCmp01 {
  static ACTOR = "MOT-CMP-01";

  /**
   * @param {CmpEvaluationInput} input
   */
  evaluate(input = {}) {
    const blockReasons = [];
    const violations = [];

    if (input.accessTierAssignment && input.accessTierAssignment !== "standard") {
      violations.push(COMPLIANCE_VIOLATION_CODES.ACCESS_TIER_FORBIDDEN);
      blockReasons.push("factory_must_not_assign_access_tier");
    }

    const prohibited = detectProhibitedFlags(input.prohibitedFlags ?? []);
    if (prohibited.prohibited) {
      violations.push(...mapProhibitedFlagsToViolations(prohibited.codes));
      blockReasons.push(`prohibited_flags:${prohibited.codes.join(",")}`);
    }

    if (input.piiAuthorized === false) {
      violations.push(COMPLIANCE_VIOLATION_CODES.PII_UNAUTHORIZED);
      blockReasons.push("pii_not_authorized");
    }

    if (input.contactAttemptWithoutTcpa === true) {
      violations.push(COMPLIANCE_VIOLATION_CODES.TCPA_CONTACT);
      blockReasons.push("tcpa_contact_violation");
    }

    const clearance =
      blockReasons.length === 0 ? CLEARANCE_STATUS.PASS : CLEARANCE_STATUS.FAIL;

    return {
      actor: MotCmp01.ACTOR,
      clearance,
      blockReasons,
      violations,
      clearanceId:
        clearance === CLEARANCE_STATUS.PASS
          ? `CLR-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`
          : null,
      evaluatedAt: new Date().toISOString(),
      evidenceLevel: "E3",
    };
  }
}

/**
 * SP06-P1 — Publication Eligibility contract (DAG-SP06-P1-G1)
 *
 * Documentary schema class: rsn.publication.eligibility.result.v1
 * FAIL-CLOSED-ONLY · ELIGIBLE RESERVED / UNREACHABLE
 * ≠ Product · ≠ delivery · ≠ transaction advice
 */

import {
  DOSSIER_RESULT_SCHEMA_ID,
  DOSSIER_STATE,
  DOSSIER_VERSION,
  REQUIRED_TOP_LEVEL as DOSSIER_REQUIRED_TOP_LEVEL,
} from "../../decision/dossier/decisionDossierContract.js";
import { SEM06 } from "../../decision/semantics/decisionOutputContract.js";

export {
  DOSSIER_RESULT_SCHEMA_ID,
  DOSSIER_STATE,
  DOSSIER_VERSION,
  DOSSIER_REQUIRED_TOP_LEVEL,
};

export const ELIGIBILITY_RESULT_SCHEMA_ID =
  "rsn.publication.eligibility.result.v1";
export const ELIGIBILITY_VERSION = "v1";
export const ELIGIBILITY_RULE_VERSION = "sp06-p1-eligibility-fail-closed.v1";

export const DECISION = Object.freeze({
  REFUSED: "REFUSED",
  ELIGIBLE: "ELIGIBLE",
  NOT_ELIGIBLE: "NOT_ELIGIBLE",
});

export const DELIVERY_STATUS = Object.freeze({
  NOT_AUTHORIZED: "NOT_AUTHORIZED",
});

/** Closed SEM-06 halt catalog (Axis B). */
export const SEM06_HALT_CATALOG = Object.freeze([
  null,
  SEM06.INSUFFICIENT_EVIDENCE,
  SEM06.CONFLICT_BLOCKED,
]);

export const REASON_CODES = Object.freeze({
  STRUCTURAL_INVALID: "STRUCTURAL_INVALID",
  SCHEMA_UNSUPPORTED: "SCHEMA_UNSUPPORTED",
  LINEAGE_INVALID: "LINEAGE_INVALID",
  PROVENANCE_MISSING: "PROVENANCE_MISSING",
  HALT_UNSUPPORTED: "HALT_UNSUPPORTED",
  CONFLICT_BLOCKED: "CONFLICT_BLOCKED",
  FAIL_CLOSED_DEFAULT: "FAIL_CLOSED_DEFAULT",
});

/**
 * Frozen honesty / legal locks on accepted P1 eligibility outputs.
 */
export function buildEligibilityInvariants() {
  return Object.freeze({
    eligibilityIsNotDelivery: true,
    eligibleIsNotAuthorized: true,
    eligibleIsNotProductEntitlement: true,
    noEligibleEmissionUnderFailClosedOnly: true,
    distressIsNotPublicationDecision: true,
    haltIsNotPublicationDecisionBySynonym: true,
    freshnessIsNotTruth: true,
    unknownIsNotNone: true,
    dossierConsumeOnly: true,
  });
}

/**
 * @param {{
 *   decision: string,
 *   reasons: { code: string, message: string }[],
 *   inputRef: object,
 *   honesty: object,
 * }} parts
 */
export function buildEligibilityResult(parts) {
  if (parts.decision === DECISION.ELIGIBLE) {
    throw new Error(
      "SP06-P1 FAIL-CLOSED-ONLY: ELIGIBLE emission forbidden under current authority"
    );
  }

  return Object.freeze({
    meta: Object.freeze({
      schemaId: ELIGIBILITY_RESULT_SCHEMA_ID,
      version: ELIGIBILITY_VERSION,
      ruleVersion: ELIGIBILITY_RULE_VERSION,
    }),
    decision: parts.decision,
    delivery: DELIVERY_STATUS.NOT_AUTHORIZED,
    reasons: Object.freeze(
      parts.reasons.map((r) =>
        Object.freeze({
          code: r.code,
          message: r.message,
        })
      )
    ),
    inputRef: Object.freeze({ ...parts.inputRef }),
    honesty: Object.freeze(parts.honesty),
    invariants: buildEligibilityInvariants(),
    sideEffects: Object.freeze([]),
  });
}

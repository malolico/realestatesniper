/**
 * SP06-P2 — Publication Unit / Projection contract (DAG-SP06-P2-G1)
 *
 * Documentary schema class: rsn.publication.unit.result.v1
 * FAIL-CLOSED-ONLY · ELIGIBLE / FORMED RESERVED / UNREACHABLE
 * ≠ Product · ≠ delivery · ≠ raw ELR · ≠ II.4 reuse
 */

import {
  ELIGIBILITY_RESULT_SCHEMA_ID,
  ELIGIBILITY_VERSION,
} from "../p1/publicationEligibilityContract.js";

export { ELIGIBILITY_RESULT_SCHEMA_ID, ELIGIBILITY_VERSION };

export const UNIT_RESULT_SCHEMA_ID = "rsn.publication.unit.result.v1";
export const UNIT_VERSION = "v1";
export const UNIT_STATE = "PUB-UNIT-RESULT";
export const UNIT_RULE_VERSION = "sp06-p2-unit-projection-fail-closed.v1";

export const P1_REQUIRED_TOP_LEVEL = Object.freeze([
  "meta",
  "decision",
  "delivery",
  "reasons",
  "inputRef",
  "honesty",
  "invariants",
  "sideEffects",
]);

export const DECISION = Object.freeze({
  REFUSED: "REFUSED",
  ELIGIBLE: "ELIGIBLE",
  NOT_ELIGIBLE: "NOT_ELIGIBLE",
});

export const FORMATION = Object.freeze({
  NOT_FORMED: "NOT_FORMED",
  FORMED: "FORMED",
});

export const DELIVERY_STATUS = Object.freeze({
  NOT_AUTHORIZED: "NOT_AUTHORIZED",
});

export const REASON_CODES = Object.freeze({
  STRUCTURAL_INVALID: "STRUCTURAL_INVALID",
  SCHEMA_UNSUPPORTED: "SCHEMA_UNSUPPORTED",
  ELIGIBILITY_BINDING_INVALID: "ELIGIBILITY_BINDING_INVALID",
  UNSUPPORTED_DECISION: "UNSUPPORTED_DECISION",
  UPSTREAM_REFUSED: "UPSTREAM_REFUSED",
  UPSTREAM_NOT_ELIGIBLE: "UPSTREAM_NOT_ELIGIBLE",
  FAIL_CLOSED_NO_FORMATION: "FAIL_CLOSED_NO_FORMATION",
});

/**
 * Frozen honesty / legal locks on accepted P2 unit/projection outputs.
 */
export function buildUnitInvariants() {
  return Object.freeze({
    unitIsNotDelivery: true,
    formationIsNotDelivery: true,
    formationIsNotPublicRelease: true,
    eligibleFormationUnreachable: true,
    p1DecisionNotOverridden: true,
    factoryElrIsNotPublicationPayload: true,
    dossierIsNotPublicationUnit: true,
    ii4IsNotSp06Implementation: true,
    productIsNotPublicationCore: true,
    ownerContactIsNotAuthorized: true,
    unknownIsNotNone: true,
    absenceIsNotNegativeTruth: true,
    freshnessIsNotTruth: true,
    noTransactionLanguage: true,
    noFactoryWriteBack: true,
    noDecisionWriteBack: true,
  });
}

/**
 * @param {{
 *   decision: string,
 *   formation: string,
 *   reasons: { code: string, message: string }[],
 *   inputRef: object,
 *   identity: object,
 *   lineage: object,
 *   eligibilityBinding: object,
 *   projection: object | null,
 *   provenance: object,
 *   honesty: object,
 * }} parts
 */
export function buildUnitResult(parts) {
  if (parts.decision === DECISION.ELIGIBLE) {
    throw new Error(
      "SP06-P2 FAIL-CLOSED-ONLY: ELIGIBLE emission forbidden under current authority"
    );
  }
  if (parts.formation === FORMATION.FORMED) {
    throw new Error(
      "SP06-P2 FAIL-CLOSED-ONLY: FORMED emission forbidden under current authority"
    );
  }

  return Object.freeze({
    meta: Object.freeze({
      schemaId: UNIT_RESULT_SCHEMA_ID,
      version: UNIT_VERSION,
      state: UNIT_STATE,
      ruleVersion: UNIT_RULE_VERSION,
    }),
    decision: parts.decision,
    formation: parts.formation,
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
    identity: Object.freeze({ ...parts.identity }),
    lineage: Object.freeze({ ...parts.lineage }),
    eligibilityBinding: Object.freeze({ ...parts.eligibilityBinding }),
    projection: parts.projection == null ? null : Object.freeze({ ...parts.projection }),
    provenance: Object.freeze({ ...parts.provenance }),
    honesty: Object.freeze(parts.honesty),
    invariants: buildUnitInvariants(),
    sideEffects: Object.freeze([]),
  });
}

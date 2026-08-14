/**
 * SP05-P3 — Decision Dossier output contract (DAG-SP05-P3-G1)
 *
 * Documentary schema class: rsn.decision.dossier.result.v1
 * ≠ Product · ≠ transaction advice · ≠ Grant EXECUTE expansion
 */

export const DOSSIER_RESULT_SCHEMA_ID = "rsn.decision.dossier.result.v1";
export const DOSSIER_VERSION = "v1";
export const DOSSIER_RULE_VERSION = "sp05-p3-dossier.v1";
export const DOSSIER_STATE = "DEC-DOSSIER";

export const REQUIRED_TOP_LEVEL = Object.freeze([
  "meta",
  "input",
  "semantics",
  "honesty",
  "invariants",
]);

/**
 * Frozen honesty / legal locks — must be true on accepted outputs.
 */
export function buildDossierInvariants() {
  return Object.freeze({
    factIsNotDerived: true,
    unknownIsNotNone: true,
    unknownIsNotZeroNegativeOrRejection: true,
    conflictIsNotRankPenalty: true,
    freshnessIsNotTruth: true,
    reviewPriorityIsNotTransactionAdvice: true,
    knownEconomicEvidenceIsNotFavorableEconomics: true,
    sem02DistressOnlyLockPreserved: true,
    noProductCommercialSemantics: true,
    noContactOutreachSemantics: true,
    dossierIsNotSp06Publication: true,
    decDossierIsNotOpportunity: true,
  });
}

/**
 * @param {{
 *   input: object,
 *   semantics: object,
 *   honesty: object,
 * }} parts
 */
export function buildDossierResult(parts) {
  return Object.freeze({
    meta: Object.freeze({
      schemaId: DOSSIER_RESULT_SCHEMA_ID,
      version: DOSSIER_VERSION,
      ruleVersion: DOSSIER_RULE_VERSION,
      state: DOSSIER_STATE,
    }),
    input: parts.input,
    semantics: parts.semantics,
    honesty: parts.honesty,
    invariants: buildDossierInvariants(),
  });
}

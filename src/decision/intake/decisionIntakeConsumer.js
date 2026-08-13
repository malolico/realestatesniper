/**
 * SP05-P1 — Sovereign Decision-side intake consumer (DAG-SP05-P1-G1)
 *
 * Fail-closed trusted CB-16 consumption → DEC-INTAKE.
 * Does not classify, recommend, rank, score, or touch commercial/strategy semantics.
 * Factory CB-16 is import/read-only.
 */

import { validateTrustedDecisionPackage } from "../../factory/cb16/decisionPackageSchema.js";
import { projectImmutableDecisionCorpus } from "./immutableDecisionProjection.js";

/** Decision-side intake acceptance state only (≠ Factory ST-DEC / opportunity / full DEC). */
export const DECISION_INTAKE_STATE = "DEC-INTAKE";

/**
 * @param {string[]} errors
 * @returns {{ accepted: false, state: null, errors: string[], package: null, intake: null }}
 */
function refuse(errors) {
  return {
    accepted: false,
    state: null,
    errors: [...errors],
    package: null,
    intake: null,
  };
}

/**
 * Detect Factory handoff delivery receipt vs raw package.
 * @param {object} input
 */
function isDeliveryReceipt(input) {
  return (
    input != null &&
    typeof input === "object" &&
    Object.prototype.hasOwnProperty.call(input, "corpus") &&
    Object.prototype.hasOwnProperty.call(input, "trustedDelivery")
  );
}

/**
 * Normal Decision intake: trusted packages only → DEC-INTAKE.
 *
 * Accepts either:
 * - Factory delivery receipt from deliverDecisionPackage / handoff port
 * - Raw Decision Package (still independently re-validated as trusted)
 *
 * @param {object} input
 * @returns {{
 *   accepted: boolean,
 *   state: string|null,
 *   errors: string[],
 *   package: object|null,
 *   intake: object|null,
 * }}
 */
export function consumeTrustedDecisionPackage(input) {
  if (input == null || typeof input !== "object") {
    return refuse(["Decision intake requires a package or delivery receipt object"]);
  }

  let corpus;
  let deliveryMeta = null;

  if (isDeliveryReceipt(input)) {
    // Diagnostic / untrusted lane must never enter normal Decision processing.
    if (input.allowUntrustedDiagnostic === true) {
      return refuse([
        "Diagnostic/untrusted delivery cannot enter normal Decision intake",
      ]);
    }
    if (input.trustedDelivery !== true) {
      return refuse([
        "Delivery receipt is not trustedDelivery — normal Decision intake refused",
      ]);
    }
    corpus = input.corpus;
    deliveryMeta = {
      deliveryId: input.deliveryId ?? null,
      interfaceId: input.interfaceId ?? null,
      trustedDelivery: true,
    };
  } else {
    corpus = input;
  }

  if (corpus == null || typeof corpus !== "object") {
    return refuse(["Delivery corpus must be an object"]);
  }

  // Independent Decision-side trusted validation (Factory validators, import-only).
  const trusted = validateTrustedDecisionPackage(corpus);
  if (!trusted.valid) {
    return refuse(trusted.errors);
  }

  const projection = projectImmutableDecisionCorpus(corpus);

  return {
    accepted: true,
    state: DECISION_INTAKE_STATE,
    errors: [],
    package: projection,
    intake: Object.freeze({
      state: DECISION_INTAKE_STATE,
      factory_key: projection.identity?.factory_key ?? null,
      packageVersion: projection.meta?.version ?? null,
      deliveryId: deliveryMeta?.deliveryId ?? null,
      interfaceId: deliveryMeta?.interfaceId ?? null,
      trustedDelivery: deliveryMeta ? true : null,
      acceptedAt: new Date().toISOString(),
      // Honesty: intake ≠ opportunity / Factory ST-DEC / commercial completion
      readinessIsNotOpportunity: true,
      isFactoryStDec: false,
      isOpportunity: false,
      isRecommendation: false,
      isRanking: false,
      isClassification: false,
      isCommercialTier: false,
      isStrategySelection: false,
      isFullDecisionCompletion: false,
    }),
  };
}

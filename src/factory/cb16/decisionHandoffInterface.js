/**
 * CB-16 — Decision Handoff Interface
 *
 * Clean delivery port to the future Decision Engine.
 * Factory stops at the frontier (FFO-06 / LFF-07).
 */

import { assertNotAccessTierAssignment } from "../cb00/catalogActorGuard.js";
import {
  BLOCKED_HANDOFF_OPERATIONS,
  DECISION_HANDOFF_INTERFACE_ID,
  isBlockedHandoffOperation,
  validateDecisionPackageShape,
} from "./decisionPackageSchema.js";

/**
 * Assert CB-16 never performs Decision/commercial operations.
 * @param {string} operation
 * @param {object} [context]
 */
export function assertHandoffBoundary(operation, context = {}) {
  if (isBlockedHandoffOperation(operation)) {
    throw new Error(
      `[CB-16 Decision Handoff] Operation "${operation}" is outside CB-16 scope — Decision Engine only`
    );
  }

  assertNotAccessTierAssignment("access_tier", context.accessTier);

  if (context.pricing != null || context.access_tier != null) {
    throw new Error("[CB-16 Decision Handoff] Factory must not assign access_tier or pricing");
  }

  if (context.dealClass || context.premiumClass || context.diamondClass) {
    throw new Error(
      "[CB-16 Decision Handoff] Factory must not classify Deal / Premium / Diamond"
    );
  }

  return { valid: true, interfaceId: DECISION_HANDOFF_INTERFACE_ID };
}

/**
 * Deliver Decision Package via a clean, Decision-Engine-facing interface.
 * Does not invoke Decision internals — port only.
 *
 * @param {object} decisionPackage
 * @param {{ recipient?: string }} [options]
 */
export function deliverDecisionPackage(decisionPackage, options = {}) {
  assertHandoffBoundary("deliver_decision_package");

  const shape = validateDecisionPackageShape(decisionPackage);
  if (!shape.valid) {
    throw new Error(
      `[CB-16 Decision Handoff] Invalid Decision Package: ${shape.errors.join("; ")}`
    );
  }

  const deliveryId = `DHI-${decisionPackage.identity.factory_key}-${Date.now()}`;
  const recipient = options.recipient ?? "DecisionEngine";

  return {
    delivered: true,
    deliveryId,
    recipient,
    interfaceId: DECISION_HANDOFF_INTERFACE_ID,
    factory_key: decisionPackage.identity.factory_key,
    packageVersion: decisionPackage.meta.version,
    maturity_score: decisionPackage.scores.maturity_score,
    gatesPass: decisionPackage.readiness.allPass,
    boundary: {
      factoryTerminated: true,
      decisionSeparated: true,
      decides: false,
    },
    /** Opaque handle for future Decision Engine consumption */
    corpus: decisionPackage,
    deliveredAt: new Date().toISOString(),
  };
}

/**
 * Create a stable handoff port object (adapter seam for future Decision Engine).
 */
export function createDecisionHandoffPort() {
  return Object.freeze({
    interfaceId: DECISION_HANDOFF_INTERFACE_ID,
    blockedOperations: BLOCKED_HANDOFF_OPERATIONS,
    deliver: deliverDecisionPackage,
    assertBoundary: assertHandoffBoundary,
    isBlocked: isBlockedHandoffOperation,
  });
}

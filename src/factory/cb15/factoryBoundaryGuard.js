/**
 * CB-15 — Factory boundary guard (FFO-06/07 — no Decision/Projection/Marketplace)
 */

import { assertNotAccessTierAssignment } from "../cb00/catalogActorGuard.js";
import { EXPEDIENTE_STATES } from "../cb00/operationalVocabulary.js";
import { SOVEREIGN_DOWNSTREAM_BOUNDARIES } from "./ffoCatalog.js";

const BLOCKED_OPERATIONS = Object.freeze([
  "publish_deal",
  "assign_access_tier",
  "emit_decision_diamond",
  "marketplace_listing",
  "projection_release",
]);

/**
 * @param {string} operation
 * @param {object} [context]
 */
export function assertFactoryBoundary(operation, context = {}) {
  if (BLOCKED_OPERATIONS.includes(operation)) {
    throw new Error(`[CB-15 FFO Boundary] Operation "${operation}" is outside Factory scope`);
  }

  assertNotAccessTierAssignment("access_tier", context.accessTier);

  if (context.targetBoundary && SOVEREIGN_DOWNSTREAM_BOUNDARIES.includes(context.targetBoundary)) {
    if (context.crossBoundary === true && operation !== "decision_handoff_prep") {
      throw new Error(
        `[CB-15 FFO Boundary] Factory cannot cross into ${context.targetBoundary} — FFO-07`
      );
    }
  }

  if (context.toState) {
    const stateDef = EXPEDIENTE_STATES.find((s) => s.code === context.toState);
    if (stateDef && stateDef.factoryScope === false && context.allowNonFactoryState !== true) {
      throw new Error(
        `[CB-15 FFO Boundary] Bus cannot transition to non-factory state ${context.toState}`
      );
    }
  }

  return { valid: true };
}

/**
 * @param {string} operation
 */
export function isBlockedFactoryOperation(operation) {
  try {
    assertFactoryBoundary(operation);
    return false;
  } catch {
    return true;
  }
}

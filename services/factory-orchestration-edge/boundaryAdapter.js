/**
 * P-INT-01 Slice B2 — CB-15 boundary adapter (public API only).
 * MUST NOT substitute B1 mirror for live guard.
 */

import {
  assertFactoryBoundary,
  isBlockedFactoryOperation,
} from "../../src/factory/cb15/index.js";
import { FACTORY_ORCHESTRATION_ERROR_CODES } from "./contract.js";
import { JOB_STATES } from "./jobModel.js";

/**
 * Fail-closed boundary check before job execution.
 * @param {string} operation
 * @param {object} [context]
 */
export function enforceFactoryBoundary(operation, context = {}) {
  if (isBlockedFactoryOperation(operation)) {
    return {
      ok: false,
      code: FACTORY_ORCHESTRATION_ERROR_CODES.BOUNDARY_REJECTED,
      message: `Operation "${operation}" is outside Factory orchestration scope`,
      jobState: JOB_STATES.REJECTED,
    };
  }
  try {
    assertFactoryBoundary(operation, context);
    return { ok: true };
  } catch (error) {
    return {
      ok: false,
      code: FACTORY_ORCHESTRATION_ERROR_CODES.BOUNDARY_REJECTED,
      message: error instanceof Error ? error.message : "boundary violation",
      jobState: JOB_STATES.REJECTED,
    };
  }
}

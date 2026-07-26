/**
 * II.6-IMPL — Publication Handoff Execution Governance public surface.
 */

export {
  AUTHENTICATION_STATUS,
  DELIVERY_STATUS,
  EXPOSURE_STATUS,
  HANDOFF_EXECUTED,
  HANDOFF_EXECUTION_REASON_CODES,
  HANDOFF_EXECUTION_REJECTED,
  HANDOFF_NOT_EXECUTED,
  PERSISTENCE_STATUS,
  TRANSPORT_STATUS,
} from "./constants.js";
export { assertReadinessOutcomeContinuity } from "./continuity.js";
export { evaluateHandoffExecution } from "./evaluate.js";
export { makeReason, sanitizeReasonMessage } from "./reasons.js";

import { HANDOFF_EXECUTED } from "./constants.js";
import { evaluateHandoffExecution } from "./evaluate.js";

/**
 * Convenience boolean. Does not authorize Delivery, persistence, transport,
 * authentication, or exposure.
 * @param {unknown} candidate
 * @param {object} [options]
 */
export function isHandoffExecuted(candidate, options) {
  return evaluateHandoffExecution(candidate, options).status === HANDOFF_EXECUTED;
}

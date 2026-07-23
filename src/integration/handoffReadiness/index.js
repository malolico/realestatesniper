/**
 * II.5-IMPL — Publication Handoff / Release Readiness public surface.
 */

export {
  DELIVERY_STATUS,
  HANDOFF_EXECUTION_STATUS,
  HANDOFF_READY,
  HANDOFF_REASON_CODES,
  HANDOFF_REJECTED,
  NOT_HANDOFF_READY,
} from "./constants.js";
export { assertPublicationUnitContinuity } from "./continuity.js";
export { evaluateHandoffReadiness } from "./evaluate.js";
export { buildReadinessManifestMetadata } from "./manifestMetadata.js";
export { makeReason, sanitizeReasonMessage } from "./reasons.js";

import { HANDOFF_READY } from "./constants.js";
import { evaluateHandoffReadiness } from "./evaluate.js";

/**
 * Convenience boolean. Does not authorize handoff execution or Delivery.
 * @param {unknown} candidate
 * @param {object} [options]
 */
export function isHandoffReady(candidate, options) {
  return evaluateHandoffReadiness(candidate, options).status === HANDOFF_READY;
}

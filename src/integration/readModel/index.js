/**
 * II.2 Read Model Contract v2 — public exports.
 */

export * from "./constants.js";
export * from "./schema.js";
export { canonicalize } from "./canonicalize.js";
export {
  attachIntegrity,
  computeChecksum,
  payloadForChecksum,
  verifyChecksum,
} from "./integrity.js";
export {
  collectInvariantViolations,
  evaluateFreshness,
  isRfc3339,
  isTimestampOrderValid,
} from "./invariants.js";
export { sanitizeToV2 } from "./sanitizer.js";
export { isValidReadModelV2, validateReadModelV2 } from "./validator.js";

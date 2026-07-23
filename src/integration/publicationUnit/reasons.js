/**
 * II.4-IMPL — sanitized reason helpers for Publication Unit outcomes.
 */

/**
 * @param {string} message
 * @returns {string}
 */
export function sanitizeReasonMessage(message) {
  const text = String(message || "publication unit governance failure");
  return text
    .replace(/(?:sk_live_|sk_test_|Bearer\s+\S+)/gi, "[REDACTED]")
    .replace(/[A-Za-z]:\\[^\s]+/g, "[PATH]")
    .replace(/\/(?:Users|home)\/[^\s]+/g, "[PATH]")
    .slice(0, 512);
}

/**
 * @param {string} code
 * @param {string} message
 * @returns {{ code: string, message: string }}
 */
export function makeReason(code, message) {
  return Object.freeze({
    code,
    message: sanitizeReasonMessage(message),
  });
}

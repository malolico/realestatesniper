/**
 * P-INT-01 Slice B2 — Error sanitization (no paths / secrets / ELR).
 */

const SECRET_KEY_RE = /(password|secret|token|authorization|api[_-]?key|cookie)/i;
const PATH_RE = /(?:[A-Za-z]:\\|\/(?:Users|home|var|tmp|etc)\/)[^\s]*/g;

/**
 * @param {unknown} err
 * @returns {{ code: string, message: string }}
 */
export function sanitizeJobError(err) {
  const code =
    err && typeof err === "object" && typeof err.code === "string"
      ? err.code
      : "INTERNAL_ERROR";
  let message =
    err instanceof Error
      ? err.message
      : err && typeof err === "object" && typeof err.message === "string"
        ? err.message
        : "unexpected error";

  message = String(message).replace(PATH_RE, "[redacted-path]");
  if (SECRET_KEY_RE.test(message)) {
    message = "sanitized error";
  }
  if (message.length > 240) {
    message = `${message.slice(0, 237)}...`;
  }

  return { code, message };
}

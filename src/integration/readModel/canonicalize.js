/**
 * II.2 JCS-subset II.2 deterministic canonicalization.
 * Approved scope: sorted keys, UTF-8, no insignificant whitespace,
 * JSON string escaping, finite numbers only (not full RFC 8785).
 */

function escapeString(value) {
  return JSON.stringify(value);
}

function canonicalizeValue(value) {
  if (value === null) return "null";
  if (typeof value === "boolean") return value ? "true" : "false";
  if (typeof value === "number") {
    if (!Number.isFinite(value)) {
      throw new Error("JCS-subset II.2 does not allow non-finite numbers");
    }
    return JSON.stringify(value);
  }
  if (typeof value === "string") return escapeString(value);
  if (Array.isArray(value)) {
    return `[${value.map((item) => canonicalizeValue(item)).join(",")}]`;
  }
  if (typeof value === "object") {
    const keys = Object.keys(value).sort();
    const body = keys
      .map((key) => `${escapeString(key)}:${canonicalizeValue(value[key])}`)
      .join(",");
    return `{${body}}`;
  }
  throw new Error(`Unsupported JCS-subset II.2 value type: ${typeof value}`);
}

/**
 * @param {unknown} value
 * @returns {string}
 */
export function canonicalize(value) {
  return canonicalizeValue(value);
}

/**
 * II.2 JCS-style deterministic canonicalization (RFC 8785 subset for JSON values).
 */

function escapeString(value) {
  return JSON.stringify(value);
}

function canonicalizeValue(value) {
  if (value === null) return "null";
  if (typeof value === "boolean") return value ? "true" : "false";
  if (typeof value === "number") {
    if (!Number.isFinite(value)) {
      throw new Error("JCS does not allow non-finite numbers");
    }
    // RFC 8785 uses ES6 NumberToJSON semantics via JSON.stringify for numbers.
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
  throw new Error(`Unsupported JCS value type: ${typeof value}`);
}

/**
 * @param {unknown} value
 * @returns {string}
 */
export function canonicalize(value) {
  return canonicalizeValue(value);
}

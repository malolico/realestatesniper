/**
 * P-INT-01 Slice B2 — RFC3339 timestamp helpers.
 */

const RFC3339_RE =
  /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d{1,9})?(?:Z|[+-]\d{2}:\d{2})$/;

/**
 * @param {unknown} value
 */
export function isRfc3339(value) {
  if (typeof value !== "string" || value.length === 0) return false;
  if (!RFC3339_RE.test(value)) return false;
  const ms = Date.parse(value);
  return Number.isFinite(ms);
}

/**
 * @param {Date} [date]
 */
export function toRfc3339(date = new Date()) {
  return date.toISOString();
}

/**
 * @param {unknown} value
 * @param {string} fieldName
 */
export function assertRfc3339(value, fieldName = "timestamp") {
  if (!isRfc3339(value)) {
    throw new Error(`${fieldName} must be a valid RFC3339 timestamp`);
  }
}

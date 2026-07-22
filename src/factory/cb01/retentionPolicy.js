/**
 * CB-01 — Retention policy (FFO-14)
 * Expediente life + 7 years after archive.
 */

export const RETENTION_YEARS = 7;
const MS_PER_YEAR = 365.25 * 24 * 60 * 60 * 1000;

/**
 * @param {string|Date} archivedAt
 * @returns {Date}
 */
export function computeRetentionExpiry(archivedAt) {
  const base = archivedAt instanceof Date ? archivedAt : new Date(archivedAt);
  return new Date(base.getTime() + RETENTION_YEARS * MS_PER_YEAR);
}

/**
 * @param {{ archivedAt?: string|null, state?: string }} expediente
 * @param {Date} [now]
 */
export function isEligibleForRetirement(expediente, now = new Date()) {
  if (expediente.state !== "ST-ARC" || !expediente.archivedAt) {
    return false;
  }
  const expiry = computeRetentionExpiry(expediente.archivedAt);
  return now >= expiry;
}

/**
 * @param {Date} [now]
 */
export function retentionPolicySummary(now = new Date()) {
  return {
    retentionYears: RETENTION_YEARS,
    policyRef: "FFO-14",
    effectiveAt: now.toISOString(),
  };
}

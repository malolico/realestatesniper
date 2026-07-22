/**
 * CB-02 — Freshness SLA profiles (DSO §X / LS-10)
 */

export const FRESHNESS_PROFILES = Object.freeze({
  TITLE_LIENS: { maxAgeDays: 30, knowledgeType: "Title / liens" },
  PAYOFF_MORTGAGE: { maxAgeDays: 30, knowledgeType: "Payoff mortgage" },
  TAX_STATUS: { maxAgeDays: 90, knowledgeType: "Tax status" },
  PERMITS_CO: { maxAgeDays: 180, knowledgeType: "Permits / CO" },
  MLS_COMPS: { maxAgeDays: 90, knowledgeType: "MLS / comps" },
  FEMA_HAZARD: { maxAgeDays: 365, knowledgeType: "FEMA / hazard maps" },
  CENSUS_DEMO: { maxAgeDays: 365, knowledgeType: "Census / demo" },
  ASSESSOR_ROLL: { maxAgeDays: 180, knowledgeType: "Assessor roll" },
  OWNER_CONVERSATION: { maxAgeDays: 60, knowledgeType: "Owner conversation" },
  CRIME_TREND: { maxAgeDays: 365, knowledgeType: "Crime trend" },
});

/**
 * @param {string} profileKey
 * @param {string|Date} vintageAt
 * @param {Date} [now]
 */
export function evaluateFreshness(profileKey, vintageAt, now = new Date()) {
  const profile = FRESHNESS_PROFILES[profileKey];
  if (!profile) {
    return { fresh: false, reason: "unknown_profile", degraded: true };
  }
  const vintage = vintageAt instanceof Date ? vintageAt : new Date(vintageAt);
  if (Number.isNaN(vintage.getTime())) {
    return { fresh: false, reason: "missing_vintage", degraded: true };
  }
  const ageMs = now.getTime() - vintage.getTime();
  const maxMs = profile.maxAgeDays * 24 * 60 * 60 * 1000;
  const fresh = ageMs <= maxMs;
  return {
    fresh,
    degraded: !fresh,
    ageDays: Math.floor(ageMs / (24 * 60 * 60 * 1000)),
    maxAgeDays: profile.maxAgeDays,
    profileKey,
    policyRef: "LS-10",
  };
}

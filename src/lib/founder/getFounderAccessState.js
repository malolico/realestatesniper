/**
 * Founder access is metadata-driven.
 * UI / React state must never be the source of truth for founder privileges.
 * Supabase Auth user_metadata (access_role, founder_trial_*) is authoritative.
 *
 * Future expiration: change metadata only (e.g. access_role away from 'founder',
 * founder_trial_status: 'expired'). Callers re-run this helper after session refresh.
 */

/**
 * @param {string | null | undefined} dateString
 * @returns {number | null}
 */
export function getDaysRemaining(dateString) {
  if (!dateString) return null

  const now = Date.now()
  const ends = new Date(dateString).getTime()
  const diff = ends - now

  if (diff <= 0) return 0

  return Math.ceil(diff / (1000 * 60 * 60 * 24))
}

/**
 * @typedef {object} FounderAccessStateInput
 * @property {object | null} [user] Supabase Auth user (user_metadata is authoritative)
 * @property {boolean} [isAdmin]
 * @property {number} [remainingFounderSpots]
 * @property {boolean} [foundersCohortFull]
 */

/**
 * @typedef {object} FounderAccessState
 * @property {boolean} founderUnlocked
 * @property {boolean} foundersCohortFull
 * @property {number} remainingFounderSpots
 * @property {boolean} founderAccessClosed
 * @property {boolean} canEnterFounderMode
 * @property {boolean} hasFounderRole
 * @property {string} accessRole
 * @property {string | null} founderTrialEndsAt
 * @property {number | null} founderDaysRemaining
 * @property {boolean} founderExpiredNotice
 * @property {string | null} founderTrialStatus
 */

/**
 * Single source for founder access flags derived from auth metadata + cohort inventory.
 *
 * @param {FounderAccessStateInput} params
 * @returns {FounderAccessState}
 */
export function getFounderAccessState({
  user = null,
  isAdmin = false,
  remainingFounderSpots = 0,
  foundersCohortFull = false,
}) {
  const metadata = user?.user_metadata ?? {}
  const accessRole =
    typeof metadata.access_role === 'string' ? metadata.access_role : 'standard'
  const hasFounderRole = accessRole === 'founder'
  const trialEndsAt = metadata.founder_trial_ends_at ?? null
  const founderTrialStatus = metadata.founder_trial_status ?? null

  const daysRemaining = trialEndsAt ? getDaysRemaining(trialEndsAt) : null
  const trialExpiredByStatus = founderTrialStatus === 'expired'
  const trialActiveByDate =
    trialEndsAt != null && daysRemaining != null && daysRemaining > 0

  // Never grant founder UI from local state alone — metadata must say access_role === 'founder'.
  const founderUnlocked =
    Boolean(user) &&
    !isAdmin &&
    hasFounderRole &&
    !trialExpiredByStatus &&
    trialActiveByDate

  const canEnterFounderMode = founderUnlocked && hasFounderRole

  const founderExpiredNotice =
    trialExpiredByStatus ||
    (hasFounderRole && trialEndsAt != null && daysRemaining === 0)

  const founderAccessClosed = foundersCohortFull && !founderUnlocked

  return {
    founderUnlocked,
    foundersCohortFull,
    remainingFounderSpots,
    founderAccessClosed,
    canEnterFounderMode,
    hasFounderRole,
    accessRole,
    founderTrialEndsAt: trialEndsAt,
    founderDaysRemaining: founderUnlocked
      ? daysRemaining
      : hasFounderRole && trialEndsAt
        ? 0
        : null,
    founderExpiredNotice,
    founderTrialStatus,
  }
}

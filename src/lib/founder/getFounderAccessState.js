/**
 * Founder access is metadata-driven.
 * UI / React state must never be the source of truth for founder privileges.
 * Supabase Auth user_metadata is authoritative.
 *
 * Expiration should eventually be enforced server-side (cron, RPC, or auth hook).
 * The frontend only reflects auth metadata — it does not downgrade or mutate roles.
 *
 * Active founder requires ALL of:
 *   access_role === 'founder'
 *   founder_trial_status === 'active'
 *   founder_trial_ends_at in the future
 */

/**
 * @param {string | null | undefined} founderTrialEndsAt ISO date string from user_metadata
 * @returns {number | null} Days left (0 = last day elapsed, null = no end date)
 */
export function getFounderDaysRemaining(founderTrialEndsAt) {
  if (!founderTrialEndsAt) return null

  const now = Date.now()
  const ends = new Date(founderTrialEndsAt).getTime()
  const diff = ends - now

  if (diff <= 0) return 0

  return Math.ceil(diff / (1000 * 60 * 60 * 24))
}

/**
 * @param {{
 *   founderTrialStatus?: string | null
 *   founderTrialEndsAt?: string | null
 * }} params
 * @returns {boolean}
 */
export function isFounderTrialExpired({
  founderTrialStatus = null,
  founderTrialEndsAt = null,
} = {}) {
  if (founderTrialStatus === 'expired') return true

  if (founderTrialStatus != null && founderTrialStatus !== 'active') {
    return true
  }

  if (!founderTrialEndsAt) return true

  const daysRemaining = getFounderDaysRemaining(founderTrialEndsAt)
  return daysRemaining === null || daysRemaining <= 0
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
 * @property {boolean} isFounderTrialActive
 * @property {string} accessRole
 * @property {string | null} founderTrialEndsAt
 * @property {number | null} founderDaysRemaining
 * @property {boolean} founderExpiredNotice
 * @property {string | null} founderTrialStatus
 */

/**
 * Single source for founder access + expiration flags (read-only interpretation of metadata).
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
  const founderTrialEndsAt = metadata.founder_trial_ends_at ?? null
  const founderTrialStatus = metadata.founder_trial_status ?? null

  const trialExpired = isFounderTrialExpired({
    founderTrialStatus,
    founderTrialEndsAt,
  })

  const trialStatusActive = founderTrialStatus === 'active'
  const daysRemaining = founderTrialEndsAt
    ? getFounderDaysRemaining(founderTrialEndsAt)
    : null

  const isFounderTrialActive =
    hasFounderRole &&
    trialStatusActive &&
    Boolean(founderTrialEndsAt) &&
    !trialExpired

  const founderUnlocked = Boolean(user) && !isAdmin && isFounderTrialActive

  const canEnterFounderMode = founderUnlocked

  const founderExpiredNotice = hasFounderRole && trialExpired

  const founderAccessClosed = foundersCohortFull && !founderUnlocked

  return {
    founderUnlocked,
    foundersCohortFull,
    remainingFounderSpots,
    founderAccessClosed,
    canEnterFounderMode,
    hasFounderRole,
    isFounderTrialActive,
    accessRole,
    founderTrialEndsAt,
    founderDaysRemaining: founderUnlocked
      ? daysRemaining
      : hasFounderRole && founderTrialEndsAt
        ? daysRemaining
        : null,
    founderExpiredNotice,
    founderTrialStatus,
  }
}

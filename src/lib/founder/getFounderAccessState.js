/**
 * Founder access flags for UI — composed from defensive metadata reads.
 *
 * Backend is authoritative; this module only reflects user_metadata (+ cohort inventory).
 * See founderMetadataUtils.js for parsing and expiration helpers.
 */

import {
  getFounderDaysRemaining,
  hasFounderAccess,
  isFounderRole,
  isFounderTrialActive,
  isFounderTrialExpired,
  readFounderMetadata,
} from './founderMetadataUtils'

export {
  getFounderDaysRemaining,
  hasFounderAccess,
  isFounderRole,
  isFounderTrialActive,
  isFounderTrialExpired,
  parseFounderTrialEndDate,
  readFounderMetadata,
} from './founderMetadataUtils'

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
  const meta = readFounderMetadata(user)
  const hasFounderRole = isFounderRole(meta.accessRole)

  const trialExpired = isFounderTrialExpired({
    founderTrialStatus: meta.founderTrialStatus,
    founderTrialEndsAt: meta.founderTrialEndsAt,
  })

  const trialActive = isFounderTrialActive(meta)

  const founderUnlocked = Boolean(user) && !isAdmin && hasFounderAccess(user, { isAdmin })

  const canEnterFounderMode = founderUnlocked

  const founderExpiredNotice = hasFounderRole && trialExpired

  const founderAccessClosed = foundersCohortFull && !founderUnlocked

  const daysRemaining = meta.founderTrialEndsAt
    ? getFounderDaysRemaining(meta.founderTrialEndsAt)
    : null

  return {
    founderUnlocked,
    foundersCohortFull,
    remainingFounderSpots,
    founderAccessClosed,
    canEnterFounderMode,
    hasFounderRole,
    isFounderTrialActive: trialActive,
    accessRole: meta.accessRole,
    founderTrialEndsAt: meta.founderTrialEndsAt,
    founderDaysRemaining: founderUnlocked
      ? daysRemaining
      : hasFounderRole && meta.founderTrialEndsAt
        ? daysRemaining
        : null,
    founderExpiredNotice,
    founderTrialStatus: meta.founderTrialStatus,
  }
}

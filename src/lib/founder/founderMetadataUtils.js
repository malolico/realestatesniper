/**
 * Founder metadata utilities — defensive read-only parsing.
 *
 * Backend is authoritative for founder grants, redemption, and expiration.
 * The frontend interprets auth user_metadata defensively only; it must not crash
 * on corrupt values and must deny access when data is invalid.
 * Metadata can be stale until the client calls auth.refreshSession() / getUser().
 */

/** @typedef {'standard' | 'founder' | 'subscriber' | 'owner' | 'admin' | string} AccessRole */

/**
 * @typedef {object} FounderMetadataSnapshot
 * @property {string} accessRole
 * @property {string | null} founderTrialStatus
 * @property {string | null} founderTrialEndsAt Raw ISO string when valid
 * @property {string | null} founderTrialStartedAt
 */

/**
 * @returns {FounderMetadataSnapshot}
 */
function emptyFounderMetadata() {
  return {
    accessRole: 'standard',
    founderTrialStatus: null,
    founderTrialEndsAt: null,
    founderTrialStartedAt: null,
  }
}

/**
 * @param {unknown} value
 * @param {string} fallback
 * @returns {string}
 */
function safeString(value, fallback) {
  if (typeof value !== 'string') return fallback
  const trimmed = value.trim()
  return trimmed.length > 0 ? trimmed : fallback
}

/**
 * @param {unknown} value
 * @returns {string | null}
 */
function safeNullableString(value) {
  if (value == null) return null
  if (typeof value !== 'string') return null
  const trimmed = value.trim()
  return trimmed.length > 0 ? trimmed : null
}

/**
 * Safely read founder-related fields from Supabase Auth user_metadata.
 *
 * @param {object | null | undefined} user
 * @returns {FounderMetadataSnapshot}
 */
export function readFounderMetadata(user) {
  try {
    const raw = user?.user_metadata

    if (raw == null || typeof raw !== 'object' || Array.isArray(raw)) {
      return emptyFounderMetadata()
    }

    return {
      accessRole: safeString(raw.access_role, 'standard'),
      founderTrialStatus: safeNullableString(raw.founder_trial_status),
      founderTrialEndsAt: safeNullableString(raw.founder_trial_ends_at),
      founderTrialStartedAt: safeNullableString(raw.founder_trial_started_at),
    }
  } catch {
    return emptyFounderMetadata()
  }
}

/**
 * @param {unknown} value
 * @returns {Date | null}
 */
export function parseFounderTrialEndDate(value) {
  if (value == null || value === '') return null

  if (typeof value !== 'string' && typeof value !== 'number') {
    return null
  }

  try {
    const date = new Date(value)
    if (Number.isNaN(date.getTime())) return null
    return date
  } catch {
    return null
  }
}

/**
 * @param {string | object | null | undefined} accessRoleOrUser access_role string or Auth user
 * @returns {boolean}
 */
export function isFounderRole(accessRoleOrUser) {
  try {
    if (accessRoleOrUser != null && typeof accessRoleOrUser === 'object') {
      return readFounderMetadata(accessRoleOrUser).accessRole === 'founder'
    }

    return typeof accessRoleOrUser === 'string' && accessRoleOrUser.trim() === 'founder'
  } catch {
    return false
  }
}

/**
 * @param {string | null | undefined} founderTrialEndsAt
 * @returns {number | null}
 */
export function getFounderDaysRemaining(founderTrialEndsAt) {
  const endDate = parseFounderTrialEndDate(founderTrialEndsAt)
  if (!endDate) return null

  const diff = endDate.getTime() - Date.now()
  if (diff <= 0) return 0

  return Math.ceil(diff / (1000 * 60 * 60 * 24))
}

/**
 * @param {{
 *   founderTrialStatus?: string | null
 *   founderTrialEndsAt?: string | null
 * }} [params]
 * @returns {boolean}
 */
export function isFounderTrialExpired({
  founderTrialStatus = null,
  founderTrialEndsAt = null,
} = {}) {
  try {
    if (founderTrialStatus === 'expired') return true

    if (founderTrialStatus != null && founderTrialStatus !== 'active') {
      return true
    }

    if (!founderTrialEndsAt) return true

    const daysRemaining = getFounderDaysRemaining(founderTrialEndsAt)
    return daysRemaining === null || daysRemaining <= 0
  } catch {
    return true
  }
}

/**
 * @param {FounderMetadataSnapshot | object | null | undefined} metadataOrUser
 * @returns {boolean}
 */
export function isFounderTrialActive(metadataOrUser) {
  try {
    const meta =
      metadataOrUser != null &&
      typeof metadataOrUser === 'object' &&
      'accessRole' in metadataOrUser &&
      !('user_metadata' in metadataOrUser)
        ? metadataOrUser
        : readFounderMetadata(metadataOrUser)

    if (!isFounderRole(meta.accessRole)) return false
    if (meta.founderTrialStatus !== 'active') return false
    if (!meta.founderTrialEndsAt) return false

    return !isFounderTrialExpired({
      founderTrialStatus: meta.founderTrialStatus,
      founderTrialEndsAt: meta.founderTrialEndsAt,
    })
  } catch {
    return false
  }
}

/**
 * @param {object | null | undefined} user
 * @param {{ isAdmin?: boolean }} [options]
 * @returns {boolean}
 */
export function hasFounderAccess(user, { isAdmin = false } = {}) {
  try {
    if (!user || isAdmin) return false
    return isFounderTrialActive(user)
  } catch {
    return false
  }
}

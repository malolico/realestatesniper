import { supabase } from '../supabase'
import { getFounderAccessState } from './getFounderAccessState'

/**
 * Shown when refreshSession / getUser fails after founder activation.
 * Caller should keep userMode non-founder and deny founder UI.
 */
export const FOUNDER_SESSION_REFRESH_FAILED_MESSAGE =
  'Your session could not be refreshed. Sign out and sign in again, or try again in a moment.'

export const FOUNDER_SESSION_METADATA_LAG_MESSAGE =
  'Founder access was updated but your session has not caught up yet. Please try again in a moment.'

/**
 * @typedef {object} RefreshFounderSessionStateInput
 * @property {boolean} [isAdmin]
 * @property {number} [remainingFounderSpots]
 * @property {boolean} [foundersCohortFull]
 * @property {boolean} [requireFounderAccess] When true, success requires canEnterFounderMode
 * @property {number} [retryDelayMs] Delay before retry (metadata propagation lag)
 * @property {number} [maxAttempts]
 */

/**
 * @typedef {object} RefreshFounderSessionStateResult
 * @property {boolean} success
 * @property {object | null} user Fresh Auth user from getUser() after refreshSession()
 * @property {import('./getFounderAccessState').FounderAccessState} founderAccess
 * @property {string | null} message Error or lag message when success is false
 */

/**
 * Refresh Supabase session, load the latest user, and recompute founder access flags.
 *
 * Backend is authoritative; auth user_metadata may lag briefly after RPC / server updates.
 * A refreshSession() + getUser() is required after atomic founder activation — do not trust
 * the in-memory user object returned immediately before refresh.
 *
 * @param {RefreshFounderSessionStateInput} [params]
 * @returns {Promise<RefreshFounderSessionStateResult>}
 */
export async function refreshFounderSessionState({
  isAdmin = false,
  remainingFounderSpots = 0,
  foundersCohortFull = false,
  requireFounderAccess = true,
  retryDelayMs = 400,
  maxAttempts = 2,
} = {}) {
  const cohortContext = {
    isAdmin,
    remainingFounderSpots,
    foundersCohortFull,
  }

  let lastError = null
  let lastUser = null
  let lastAccess = getFounderAccessState({
    user: null,
    ...cohortContext,
  })

  for (let attempt = 0; attempt < maxAttempts; attempt += 1) {
    if (attempt > 0 && retryDelayMs > 0) {
      await new Promise((resolve) => setTimeout(resolve, retryDelayMs))
    }

    try {
      const { error: refreshError } = await supabase.auth.refreshSession()
      if (refreshError) {
        lastError = refreshError
      }

      const { data, error: getUserError } = await supabase.auth.getUser()
      if (getUserError) {
        lastError = getUserError
        continue
      }

      const user = data?.user ?? null
      lastUser = user

      if (!user) {
        lastError = new Error('No authenticated user after session refresh.')
        lastAccess = getFounderAccessState({ user: null, ...cohortContext })
        continue
      }

      lastAccess = getFounderAccessState({
        user,
        ...cohortContext,
      })

      const accessGranted = requireFounderAccess
        ? lastAccess.canEnterFounderMode
        : Boolean(user)

      if (accessGranted) {
        return {
          success: true,
          user,
          founderAccess: lastAccess,
          message: null,
        }
      }
    } catch (unexpectedError) {
      lastError = unexpectedError
    }
  }

  if (lastUser && requireFounderAccess && !lastAccess.canEnterFounderMode) {
    return {
      success: false,
      user: lastUser,
      founderAccess: lastAccess,
      message: FOUNDER_SESSION_METADATA_LAG_MESSAGE,
    }
  }

  const failureMessage =
    lastError instanceof Error
      ? lastError.message
      : typeof lastError?.message === 'string'
        ? lastError.message
        : FOUNDER_SESSION_REFRESH_FAILED_MESSAGE

  return {
    success: false,
    user: lastUser,
    founderAccess: getFounderAccessState({
      user: lastUser,
      ...cohortContext,
    }),
    message: lastUser ? FOUNDER_SESSION_METADATA_LAG_MESSAGE : failureMessage,
  }
}

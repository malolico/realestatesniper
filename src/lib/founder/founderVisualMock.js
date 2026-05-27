/**
 * Legacy fallback only. Real founder state now comes from Supabase.
 *
 * Used when validateFounderCode cannot reach the database (network/RLS error).
 * Does not simulate codes, spots, or cohort occupancy.
 */

export const FOUNDER_VISUAL_MOCK = {}

export const FOUNDER_FEEDBACK_COPY = {
  valid: {
    title: 'Code valid',
    body: 'Founder code recognized. Continuing with account setup…',
  },
  invalid: {
    title: 'Invalid code',
    body: 'This founder code was not found or is not available.',
  },
  used: {
    title: 'Code already used',
    body: 'This one-time founder code has already been redeemed.',
  },
  expired: {
    title: 'Code expired',
    body: 'This founder invitation code is no longer active.',
  },
  full: {
    title: 'Founders complete',
    body: 'All founder spots are filled. The private beta is closed to new invites.',
  },
}

/**
 * Minimal UI feedback when Supabase validation is unavailable.
 * Not used for successful validation paths (those use validateFounderCode).
 *
 * @param {string} normalizedCode
 * @param {boolean} [foundersFullOverride]
 * @returns {{ type: string, message: string | null }}
 */
export function resolveFounderVisualFeedbackMock(normalizedCode, foundersFullOverride = false) {
  if (foundersFullOverride) {
    return { type: 'full', message: null }
  }

  if (!normalizedCode) {
    return {
      type: 'invalid',
      message: 'Please enter your founder invitation code.',
    }
  }

  return {
    type: 'invalid',
    message: 'Unable to validate this code right now. Check your connection and try again.',
  }
}

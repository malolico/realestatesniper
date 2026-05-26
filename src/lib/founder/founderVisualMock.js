/**
 * Founder System V1 — visual/mock layer only.
 * Replace this module with Supabase-backed founder inventory + code redemption.
 */

export const FOUNDER_VISUAL_MOCK = {
  /** When true, modal shows cohort-full UI (demo / future API flag) */
  foundersFull: false,

  /** Codes displayed as already redeemed (preview only until DB sync) */
  usedCodes: ['RS-FOUNDER-003'],

  /** Approved invite codes for visual validation preview */
  validCodes: [
    'RS-FOUNDER-001',
    'RS-FOUNDER-002',
    'RS-FOUNDER-003',
    'RS-FOUNDER-004',
    'RS-FOUNDER-005',
    'RS-FOUNDER-006',
    'RS-FOUNDER-007',
    'RS-FOUNDER-008',
    'RS-FOUNDER-009',
    'RS-FOUNDER-010',
  ],
}

export const FOUNDER_FEEDBACK_COPY = {
  valid: {
    title: 'Code valid',
    body: 'Founder code recognized. Continuing with account setup…',
  },
  invalid: {
    title: 'Invalid code',
    body: 'This founder code is not on the approved invite list.',
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
 * Fallback validation when Supabase is unreachable or returns error.
 * Visual/testing only — not authoritative for production redemption.
 */
export function resolveFounderVisualFeedbackMock(normalizedCode, foundersFullOverride = false) {
  if (foundersFullOverride || FOUNDER_VISUAL_MOCK.foundersFull) {
    return { type: 'full', message: null }
  }

  if (!normalizedCode) {
    return {
      type: 'invalid',
      message: 'Please enter your founder invitation code.',
    }
  }

  if (FOUNDER_VISUAL_MOCK.usedCodes.includes(normalizedCode)) {
    return { type: 'used', message: null }
  }

  if (!FOUNDER_VISUAL_MOCK.validCodes.includes(normalizedCode)) {
    return { type: 'invalid', message: null }
  }

  return { type: 'valid', message: null }
}

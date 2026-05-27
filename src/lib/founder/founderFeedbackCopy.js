/** User-facing founder validation / status messages (UI copy only). */

export const FOUNDER_VERIFICATION_UNAVAILABLE =
  'Founder verification is temporarily unavailable.'

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
  unavailable: {
    title: 'Verification unavailable',
    body: FOUNDER_VERIFICATION_UNAVAILABLE,
  },
}

import { supabase } from '../supabase'

/**
 * @typedef {'valid' | 'invalid' | 'used' | 'expired' | 'error'} FounderCodeValidationStatus
 */

const KNOWN_STATUSES = new Set(['valid', 'invalid', 'used', 'expired', 'error'])

/**
 * Read-only founder code validation via public RPC.
 * Does NOT set used, used_at, or used_by_user_id (redemption is a later phase).
 *
 * @param {string} rawCode
 * @returns {Promise<{
 *   status: FounderCodeValidationStatus,
 *   message: string | null,
 *   row: object | null,
 * }>}
 */
export async function validateFounderCode(rawCode) {
  const code = (rawCode || '').trim().toUpperCase()

  if (!code) {
    return {
      status: 'invalid',
      message: 'Please enter your founder invitation code.',
      row: null,
    }
  }

  const { data, error } = await supabase.rpc('validate_founder_code_public', {
    p_code: code,
  })

  if (error) {
    return {
      status: 'error',
      message: error.message || 'Unable to validate founder code.',
      row: null,
    }
  }

  const payload = data && typeof data === 'object' ? data : null
  const status = payload?.status

  if (!KNOWN_STATUSES.has(status)) {
    return {
      status: 'error',
      message: 'Unable to validate founder code.',
      row: null,
    }
  }

  return {
    status,
    message: typeof payload.message === 'string' ? payload.message : null,
    row: null,
  }
}

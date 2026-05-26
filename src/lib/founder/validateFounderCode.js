import { supabase } from '../supabase'

/**
 * @typedef {'valid' | 'invalid' | 'used' | 'expired' | 'error'} FounderCodeValidationStatus
 */

/**
 * Read-only founder code validation against public.founder_codes.
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

  const { data, error } = await supabase
    .from('founder_codes')
    .select('id, code, used, expires_at, assigned_email')
    .eq('code', code)
    .maybeSingle()

  if (error) {
    return {
      status: 'error',
      message: error.message || 'Unable to validate founder code.',
      row: null,
    }
  }

  if (!data) {
    return {
      status: 'invalid',
      message: null,
      row: null,
    }
  }

  if (data.used === true) {
    return {
      status: 'used',
      message: null,
      row: data,
    }
  }

  if (data.expires_at) {
    const expiresAtMs = new Date(data.expires_at).getTime()
    if (!Number.isNaN(expiresAtMs) && expiresAtMs < Date.now()) {
      return {
        status: 'expired',
        message: null,
        row: data,
      }
    }
  }

  return {
    status: 'valid',
    message: null,
    row: data,
  }
}

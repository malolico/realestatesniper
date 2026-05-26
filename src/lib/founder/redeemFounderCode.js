import { supabase } from '../supabase'

/**
 * @typedef {'redeemed' | 'invalid' | 'used' | 'expired' | 'error'} FounderRedeemStatus
 */

/**
 * @typedef {object} FounderRedeemResult
 * @property {boolean} success
 * @property {FounderRedeemStatus} status
 * @property {string} message
 * @property {any} [data]
 */

const REDEEM_RPC_NAME = 'redeem_founder_code'

/**
 * Redeem a founder invite code via Supabase RPC (consumes the code in the database).
 *
 * This helper ONLY calls:
 *   public.redeem_founder_code(p_code text, p_user_id uuid)
 *
 * It does NOT activate founder access, does NOT update auth user_metadata,
 * and does NOT touch browser storage. Founder trial activation is a later phase.
 *
 * Requires an authenticated user: pass `userId` from session.user.id.
 *
 * Expected RPC contract (implement in Supabase SQL — not wired in UI yet):
 *   Returns a JSON object such as:
 *   { "status": "redeemed" | "invalid" | "used" | "expired", "message": "..." }
 *   or legacy { "success": true, "status": "redeemed", ... }
 *
 * @param {{ code: string, userId: string }} params
 * @returns {Promise<FounderRedeemResult>}
 */
export async function redeemFounderCode({ code, userId }) {
  const normalizedCode = (code || '').trim().toUpperCase()

  if (!normalizedCode) {
    return {
      success: false,
      status: 'invalid',
      message: 'Founder code is required.',
    }
  }

  if (!userId) {
    return {
      success: false,
      status: 'error',
      message: 'Authenticated user required to redeem a founder code.',
    }
  }

  try {
    const { data, error } = await supabase.rpc(REDEEM_RPC_NAME, {
      p_code: normalizedCode,
      p_user_id: userId,
    })

    if (error) {
      return {
        success: false,
        status: 'error',
        message: error.message || 'Unable to redeem founder code.',
      }
    }

    return normalizeRpcResult(data)
  } catch (unexpectedError) {
    const message =
      unexpectedError instanceof Error
        ? unexpectedError.message
        : 'Unexpected error while redeeming founder code.'

    return {
      success: false,
      status: 'error',
      message,
    }
  }
}

/**
 * @param {unknown} data
 * @returns {FounderRedeemResult}
 */
function normalizeRpcResult(data) {
  if (data == null) {
    return {
      success: false,
      status: 'error',
      message: 'Empty response from redeem_founder_code.',
    }
  }

  let payload = data

  if (typeof payload === 'string') {
    try {
      payload = JSON.parse(payload)
    } catch {
      return {
        success: false,
        status: 'error',
        message: 'Invalid JSON response from redeem_founder_code.',
        data,
      }
    }
  }

  if (typeof payload !== 'object') {
    return {
      success: false,
      status: 'error',
      message: 'Unexpected response shape from redeem_founder_code.',
      data: payload,
    }
  }

  const rawStatus = String(payload.status || '').toLowerCase()
  const allowedStatuses = ['redeemed', 'invalid', 'used', 'expired', 'error']

  let status = allowedStatuses.includes(rawStatus) ? rawStatus : 'error'

  if (payload.success === true && status === 'error') {
    status = 'redeemed'
  }

  if (payload.success === false && status === 'redeemed') {
    status = 'error'
  }

  const success = status === 'redeemed'

  const message =
    typeof payload.message === 'string' && payload.message.trim()
      ? payload.message.trim()
      : defaultMessageForStatus(status)

  return {
    success,
    status,
    message,
    data: payload,
  }
}

/**
 * @param {FounderRedeemStatus} status
 * @returns {string}
 */
function defaultMessageForStatus(status) {
  switch (status) {
    case 'redeemed':
      return 'Founder code redeemed successfully.'
    case 'invalid':
      return 'This founder code is not valid.'
    case 'used':
      return 'This founder code has already been used.'
    case 'expired':
      return 'This founder code has expired.'
    default:
      return 'Unable to redeem founder code.'
  }
}

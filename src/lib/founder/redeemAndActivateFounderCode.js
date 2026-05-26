import { supabase } from '../supabase'

/**
 * @typedef {'activated' | 'invalid' | 'used' | 'expired' | 'error'} FounderRedeemActivateStatus
 */

/**
 * @typedef {object} FounderRedeemActivateResult
 * @property {boolean} success
 * @property {FounderRedeemActivateStatus} status
 * @property {string} message
 * @property {any} [data]
 */

const REDEEM_AND_ACTIVATE_RPC_NAME = 'redeem_and_activate_founder_code'

/**
 * Atomically redeem a founder invite code and activate founder access via Supabase RPC.
 *
 * This helper ONLY calls:
 *   public.redeem_and_activate_founder_code(p_code text, p_user_id uuid)
 *
 * The RPC must consume the one-time code (used=true) and apply founder activation
 * (e.g. user metadata / trial) in a single database transaction — so the app never
 * ends up with used=true without founder access.
 *
 * Requires an authenticated user: pass `userId` from session.user.id.
 *
 * Does NOT update auth user_metadata from the frontend (the RPC owns that).
 * Does NOT touch localStorage, sessionStorage, or any React UI.
 *
 * Expected RPC contract (Supabase):
 *   { "status": "activated" | "invalid" | "used" | "expired", "message": "..." }
 *   Legacy alias: status "redeemed" is treated as "activated".
 *
 * @param {{ code: string, userId: string }} params
 * @returns {Promise<FounderRedeemActivateResult>}
 */
export async function redeemAndActivateFounderCode({ code, userId }) {
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
      message: 'Authenticated user required to redeem and activate founder access.',
    }
  }

  try {
    const { data, error } = await supabase.rpc(REDEEM_AND_ACTIVATE_RPC_NAME, {
      p_code: normalizedCode,
      p_user_id: userId,
    })

    if (error) {
      return {
        success: false,
        status: 'error',
        message: error.message || 'Unable to redeem and activate founder access.',
      }
    }

    return normalizeRpcResult(data)
  } catch (unexpectedError) {
    const message =
      unexpectedError instanceof Error
        ? unexpectedError.message
        : 'Unexpected error while redeeming and activating founder access.'

    return {
      success: false,
      status: 'error',
      message,
    }
  }
}

/**
 * @param {unknown} data
 * @returns {FounderRedeemActivateResult}
 */
function normalizeRpcResult(data) {
  if (data == null) {
    return {
      success: false,
      status: 'error',
      message: 'Empty response from redeem_and_activate_founder_code.',
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
        message: 'Invalid JSON response from redeem_and_activate_founder_code.',
        data,
      }
    }
  }

  if (typeof payload !== 'object') {
    return {
      success: false,
      status: 'error',
      message: 'Unexpected response shape from redeem_and_activate_founder_code.',
      data: payload,
    }
  }

  const rawStatus = String(payload.status || '').toLowerCase()
  const allowedStatuses = ['activated', 'invalid', 'used', 'expired', 'error']

  let status = allowedStatuses.includes(rawStatus) ? rawStatus : 'error'

  // Backward-compatible alias if RPC returns "redeemed" for a successful atomic flow.
  if (rawStatus === 'redeemed') {
    status = 'activated'
  }

  if (payload.success === true && status === 'error') {
    status = 'activated'
  }

  if (payload.success === false && status === 'activated') {
    status = 'error'
  }

  const success = status === 'activated'

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
 * @param {FounderRedeemActivateStatus} status
 * @returns {string}
 */
function defaultMessageForStatus(status) {
  switch (status) {
    case 'activated':
      return 'Founder access activated successfully.'
    case 'invalid':
      return 'This founder code is not valid.'
    case 'used':
      return 'This founder code has already been used.'
    case 'expired':
      return 'This founder code has expired.'
    default:
      return 'Unable to redeem and activate founder access.'
  }
}

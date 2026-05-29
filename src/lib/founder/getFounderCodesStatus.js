import { supabase } from '../supabase'

const FALLBACK_TOTAL_FOUNDER_SPOTS = 10

/**
 * @typedef {object} FounderCodesStatus
 * @property {number} total
 * @property {number} remaining
 * @property {number} used
 * @property {boolean} foundersFull
 * @property {string} [error]
 */

function toSafeCount(value, fallback = 0) {
  const n = Number(value)
  return Number.isFinite(n) && n >= 0 ? Math.floor(n) : fallback
}

/**
 * Read founder cohort occupancy via public RPC (aggregates only).
 *
 * @returns {Promise<FounderCodesStatus>}
 */
export async function getFounderCodesStatus() {
  const { data, error } = await supabase.rpc('get_founder_codes_status_public')

  if (error) {
    return {
      total: FALLBACK_TOTAL_FOUNDER_SPOTS,
      remaining: FALLBACK_TOTAL_FOUNDER_SPOTS,
      used: 0,
      foundersFull: false,
      error: error.message || 'Unable to load founder codes status.',
    }
  }

  const payload = data && typeof data === 'object' ? data : null

  if (!payload) {
    return {
      total: FALLBACK_TOTAL_FOUNDER_SPOTS,
      remaining: FALLBACK_TOTAL_FOUNDER_SPOTS,
      used: 0,
      foundersFull: false,
      error: 'Unable to load founder codes status.',
    }
  }

  if (typeof payload.error === 'string' && payload.error.length > 0) {
    return {
      total: toSafeCount(payload.total, FALLBACK_TOTAL_FOUNDER_SPOTS),
      remaining: toSafeCount(payload.remaining, FALLBACK_TOTAL_FOUNDER_SPOTS),
      used: toSafeCount(payload.used, 0),
      foundersFull: Boolean(payload.foundersFull),
      error: payload.error,
    }
  }

  const total = toSafeCount(payload.total, FALLBACK_TOTAL_FOUNDER_SPOTS)
  const used = toSafeCount(payload.used, 0)
  const remaining = toSafeCount(payload.remaining, Math.max(0, total - used))

  return {
    total,
    remaining,
    used,
    foundersFull: Boolean(payload.foundersFull),
  }
}

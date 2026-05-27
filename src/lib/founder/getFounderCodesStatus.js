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

/**
 * Read founder cohort occupancy from public.founder_codes (used flags only).
 *
 * @returns {Promise<FounderCodesStatus>}
 */
export async function getFounderCodesStatus() {
  const { data, error } = await supabase.from('founder_codes').select('used')

  if (error) {
    return {
      total: FALLBACK_TOTAL_FOUNDER_SPOTS,
      remaining: FALLBACK_TOTAL_FOUNDER_SPOTS,
      used: 0,
      foundersFull: false,
      error: error.message || 'Unable to load founder codes status.',
    }
  }

  const rows = Array.isArray(data) ? data : []

  if (rows.length === 0) {
    return {
      total: FALLBACK_TOTAL_FOUNDER_SPOTS,
      remaining: FALLBACK_TOTAL_FOUNDER_SPOTS,
      used: 0,
      foundersFull: false,
      error: 'No founder codes configured.',
    }
  }

  const total = rows.length
  const used = rows.filter((row) => row.used === true).length
  const remaining = Math.max(0, total - used)

  return {
    total,
    remaining,
    used,
    foundersFull: remaining <= 0,
  }
}

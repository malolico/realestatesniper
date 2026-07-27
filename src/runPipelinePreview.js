/**
 * P-INT-09 — DealPipeline Reconciliation (Master Plan Fase I ítem 3)
 *
 * BOUNDARY (binding):
 * - dealPipeline is NOT Canon Factory.
 * - dealPipeline does NOT substitute the ELR.
 * - dealPipeline does NOT substitute maturity_score / Factory governance metrics.
 * - Status: non-canon / provisional / pre-Factory.
 * - Full retirement/isolation is deferred to Master Plan Fase IV item 13 (NOT this block).
 * - CLI preview of heuristic scores only — not Factory Registry / ELR / maturity.
 */

import {
  getPipelinePreviewSummary,
  pipelinePreviewDeals,
} from './lib/pipelinePreview.js'

console.log(' ')
console.log('==============================')
console.log(' REAL ESTATE SNIPER PIPELINE ')
console.log('==============================')
console.log(' ')

const summary = getPipelinePreviewSummary()

console.log('Pipeline summary:')
console.log(`- Total deals: ${summary.totalDeals}`)
console.log(`- Diamond deals: ${summary.diamondDeals}`)
console.log(`- Premium deals: ${summary.premiumDeals}`)
console.log(`- Standard deals: ${summary.standardDeals}`)
console.log(`- Average score: ${summary.averageScore}`)
console.log(' ')

console.log('Detailed pipeline output:')
console.table(
  pipelinePreviewDeals.map((deal) => ({
    source_id: deal.source_id,
    title: deal.title,
    city: deal.city,
    property_type: deal.property_type,
    estimated_value: deal.estimated_value,
    purchase_price: deal.purchase_price,
    discount_percentage: deal.discount_percentage,
    score: deal.score,
    score_band: deal.score_band,
    access_tier: deal.access_tier,
    status: deal.status,
  })),
)

console.log(' ')
console.log('Pipeline preview finished successfully.')
console.log(' ')
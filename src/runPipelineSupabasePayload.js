/**
 * P-INT-09 — DealPipeline Reconciliation (Master Plan Fase I ítem 3)
 *
 * BOUNDARY (binding):
 * - dealPipeline is NOT Canon Factory.
 * - dealPipeline does NOT substitute the ELR.
 * - dealPipeline does NOT substitute maturity_score / Factory governance metrics.
 * - Status: non-canon / provisional / pre-Factory.
 * - Payload preview for product `deals` — NOT ELR / Canon Factory.
 * - Full retirement/isolation is deferred to Master Plan Fase IV item 13 (NOT this block).
 */

import { pipelinePreviewDeals } from './lib/pipelinePreview.js'
import { mapPipelineBatchToSupabase } from './lib/mapPipelineDealToSupabase.js'

const supabasePayload = mapPipelineBatchToSupabase(pipelinePreviewDeals)

console.log(' ')
console.log('====================================')
console.log(' SUPABASE DEALS PAYLOAD PREVIEW ')
console.log('====================================')
console.log(' ')

console.log(`Total rows prepared: ${supabasePayload.length}`)
console.log(' ')

console.table(
  supabasePayload.map((deal) => ({
    title: deal.title,
    city: deal.city,
    property_type: deal.property_type,
    estimated_value: deal.estimated_value,
    purchase_price: deal.purchase_price,
    discount_percentage: deal.discount_percentage,
    access_tier: deal.access_tier,
    status: deal.status,
    score: deal.score,
  })),
)

console.log(' ')
console.log('Full payload preview:')
console.log(JSON.stringify(supabasePayload, null, 2))
console.log(' ')
console.log('Supabase payload preview finished successfully.')
console.log(' ')
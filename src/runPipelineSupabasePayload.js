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
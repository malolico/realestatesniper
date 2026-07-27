/**
 * P-INT-09 — DealPipeline Reconciliation (Master Plan Fase I ítem 3)
 *
 * BOUNDARY (binding):
 * - dealPipeline is NOT Canon Factory.
 * - dealPipeline does NOT substitute the ELR.
 * - dealPipeline does NOT substitute maturity_score / Factory governance metrics.
 * - Status: non-canon / provisional / pre-Factory.
 * - Mapped `deals` rows are product/heuristic payloads — NOT Factory expedientes / ELR.
 * - Full retirement/isolation is deferred to Master Plan Fase IV item 13 (NOT this block).
 */

function buildDescription(deal) {
  const parts = []

  if (deal.description) parts.push(deal.description)
  if (deal.signal) parts.push(`Signal: ${deal.signal}`)
  if (deal.source_name) parts.push(`Source: ${deal.source_name}`)
  if (deal.source_type) parts.push(`Source type: ${deal.source_type}`)

  return parts.join(' | ')
}

function normalizeTitle(deal) {
  if (deal.title && deal.title.trim()) return deal.title.trim()
  return 'Untitled Deal'
}

function normalizePropertyType(deal) {
  if (deal.property_type && deal.property_type.trim()) {
    return deal.property_type.trim()
  }
  return 'Unknown'
}

export function mapPipelineDealToSupabase(deal) {
  return {
    title: normalizeTitle(deal),
    city: deal.city || 'Unknown',
    property_type: normalizePropertyType(deal),
    estimated_value: deal.estimated_value ?? null,
    purchase_price: deal.purchase_price ?? null,
    discount_percentage: deal.discount_percentage ?? 0,
    description: buildDescription(deal),
    access_tier: deal.access_tier || 'standard',
    status: deal.status || 'opportunity',
    score: deal.score ?? 0,
    is_premium: false,
    is_diamond: false,
  }
}

export function mapPipelineBatchToSupabase(deals = []) {
  return deals.map((deal) => mapPipelineDealToSupabase(deal))
}
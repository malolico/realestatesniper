/**
 * P-INT-09 — DealPipeline Reconciliation (Master Plan Fase I ítem 3)
 *
 * BOUNDARY (binding):
 * - dealPipeline is NOT Canon Factory.
 * - dealPipeline does NOT substitute the ELR.
 * - dealPipeline does NOT substitute maturity_score / Factory governance metrics.
 * - Status: non-canon / provisional / pre-Factory.
 * - Full retirement/isolation is deferred to Master Plan Fase IV item 13 (NOT this block).
 * - This module previews heuristic pipeline output only — not Factory truth.
 */

import { buildPipelineBatch } from './dealPipeline.js'
import { sampleRawDeals } from './sampleRawDeals.js'

export const pipelinePreviewDeals = buildPipelineBatch(sampleRawDeals)

export function getPipelinePreviewSummary() {
  const totalDeals = pipelinePreviewDeals.length

  const diamondDeals = pipelinePreviewDeals.filter(
    (deal) => deal.access_tier === 'diamond',
  ).length

  const premiumDeals = pipelinePreviewDeals.filter(
    (deal) => deal.access_tier === 'premium',
  ).length

  const standardDeals = pipelinePreviewDeals.filter(
    (deal) => deal.access_tier === 'standard',
  ).length

  const averageScore =
    totalDeals > 0
      ? Math.round(
          pipelinePreviewDeals.reduce((sum, deal) => sum + (deal.score || 0), 0) /
            totalDeals,
        )
      : 0

  return {
    totalDeals,
    diamondDeals,
    premiumDeals,
    standardDeals,
    averageScore,
  }
}

export function printPipelinePreview() {
  const summary = getPipelinePreviewSummary()

  console.log('--- PIPELINE PREVIEW SUMMARY ---')
  console.log(summary)
  console.log('--- PIPELINE PREVIEW DEALS ---')
  console.table(
    pipelinePreviewDeals.map((deal) => ({
      source_id: deal.source_id,
      title: deal.title,
      city: deal.city,
      property_type: deal.property_type,
      discount_percentage: deal.discount_percentage,
      score: deal.score,
      score_band: deal.score_band,
      access_tier: deal.access_tier,
      status: deal.status,
    })),
  )
}
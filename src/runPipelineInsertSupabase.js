import dotenv from 'dotenv'
import { createClient } from '@supabase/supabase-js'
import { pipelinePreviewDeals } from './lib/pipelinePreview.js'
import { mapPipelineBatchToSupabase } from './lib/mapPipelineDealToSupabase.js'

dotenv.config({ path: './.env' })

const supabaseUrl = process.env.VITE_SUPABASE_URL
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Missing environment variables.')
  console.error('Make sure VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY are available.')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseKey)

function normalizeCity(value) {
  return String(value || '')
    .trim()
    .toLowerCase()
}

async function fetchMarketsMap() {
  const { data, error } = await supabase.from('markets').select('id, city')

  if (error) {
    console.error('❌ ERROR loading markets table:')
    console.error(error)
    process.exit(1)
  }

  const marketMap = new Map()

  for (const market of data || []) {
    marketMap.set(normalizeCity(market.city), market.id)
  }

  return marketMap
}

async function runInsert() {
  console.log(' ')
  console.log('==============================')
  console.log(' INSERTING DEALS INTO SUPABASE')
  console.log('==============================')
  console.log(' ')

  const marketMap = await fetchMarketsMap()
  const basePayload = mapPipelineBatchToSupabase(pipelinePreviewDeals)

  const payload = basePayload.map((deal) => {
    const marketId = marketMap.get(normalizeCity(deal.city)) || null

    return {
      ...deal,
      market_id: marketId,
    }
  })

  const missingMarketIds = payload.filter((deal) => !deal.market_id)

  if (missingMarketIds.length > 0) {
    console.error('❌ Some deals could not be matched to a market_id.')
    console.error('These cities do not exist in your markets table:')
    console.table(
      missingMarketIds.map((deal) => ({
        city: deal.city,
        title: deal.title,
      })),
    )
    console.log(' ')
    console.log('Add those cities to the markets table first, then run again.')
    return
  }

  console.log(`Preparing to insert ${payload.length} deals...`)
  console.log(' ')

  const { data, error } = await supabase
    .from('deals')
    .insert(payload)
    .select()

  if (error) {
    console.error('❌ ERROR inserting deals:')
    console.error(error)
    return
  }

  console.log('✅ SUCCESS')
  console.log(`Inserted ${data.length} deals`)
  console.log(' ')

  console.table(
    data.map((deal) => ({
      id: deal.id,
      market_id: deal.market_id,
      title: deal.title,
      city: deal.city,
      score: deal.score,
      access_tier: deal.access_tier,
    })),
  )

  console.log(' ')
  console.log('Supabase insert finished successfully.')
  console.log(' ')
}

runInsert()
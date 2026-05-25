export const SCORE_WEIGHTS = {
  discount: 0.35,
  distress: 0.2,
  location: 0.15,
  dataCompleteness: 0.15,
  propertyType: 0.15,
}

const HIGH_PRIORITY_CITIES = new Set([
  'Phoenix',
  'Scottsdale',
  'Mesa',
  'Tempe',
  'Chandler',
  'Glendale',
  'Tucson',
])

const STRONG_PROPERTY_TYPES = new Set([
  'Single Family',
  'Multi Family',
  'Duplex',
  'Triplex',
  'Quadplex',
])

const DISTRESS_KEYWORDS = [
  'probate',
  'foreclosure',
  'pre-foreclosure',
  'distressed',
  'vacant',
  'inheritance',
  'tax lien',
  'motivated seller',
  'fixer',
  'off-market',
]

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value))
}

function toNumber(value, fallback = null) {
  if (value === null || value === undefined || value === '') return fallback
  const parsed = Number(value)
  return Number.isFinite(parsed) ? parsed : fallback
}

function normalizeText(value, fallback = '') {
  if (typeof value !== 'string') return fallback
  return value.trim()
}

function titleCase(value) {
  return normalizeText(value)
    .toLowerCase()
    .split(' ')
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ')
}

function inferDiscountPercentage(estimatedValue, purchasePrice) {
  if (
    estimatedValue === null ||
    purchasePrice === null ||
    estimatedValue <= 0 ||
    purchasePrice <= 0 ||
    purchasePrice >= estimatedValue
  ) {
    return 0
  }

  return Math.round(((estimatedValue - purchasePrice) / estimatedValue) * 100)
}

function calculateDiscountSignal(discountPercentage) {
  if (discountPercentage >= 30) return 100
  if (discountPercentage >= 25) return 90
  if (discountPercentage >= 20) return 80
  if (discountPercentage >= 15) return 65
  if (discountPercentage >= 10) return 50
  if (discountPercentage >= 5) return 30
  return 10
}

function calculateDistressSignal(rawDeal) {
  const textBlob = [
    rawDeal.title,
    rawDeal.description,
    rawDeal.notes,
    rawDeal.signal,
    rawDeal.source_type,
  ]
    .filter(Boolean)
    .join(' ')
    .toLowerCase()

  let score = 10

  for (const keyword of DISTRESS_KEYWORDS) {
    if (textBlob.includes(keyword)) {
      score += 15
    }
  }

  return clamp(score, 0, 100)
}

function calculateLocationSignal(city) {
  if (!city) return 20
  if (HIGH_PRIORITY_CITIES.has(city)) return 90
  return 50
}

function calculateCompletenessSignal(normalizedDeal) {
  const fields = [
    normalizedDeal.title,
    normalizedDeal.city,
    normalizedDeal.property_type,
    normalizedDeal.estimated_value,
    normalizedDeal.purchase_price,
    normalizedDeal.discount_percentage,
    normalizedDeal.description,
    normalizedDeal.source_name,
  ]

  const filledFields = fields.filter(
    (value) => value !== null && value !== undefined && value !== '',
  ).length

  return Math.round((filledFields / fields.length) * 100)
}

function calculatePropertyTypeSignal(propertyType) {
  if (!propertyType) return 25
  if (STRONG_PROPERTY_TYPES.has(propertyType)) return 85
  return 50
}

export function normalizeIncomingDeal(rawDeal) {
  const estimatedValue = toNumber(rawDeal.estimated_value)
  const purchasePrice = toNumber(rawDeal.purchase_price)
  const explicitDiscount = toNumber(rawDeal.discount_percentage, null)

  const normalizedDeal = {
    source_name: normalizeText(rawDeal.source_name, 'manual'),
    source_type: normalizeText(rawDeal.source_type, 'manual'),
    source_id: normalizeText(rawDeal.source_id, ''),
    title: normalizeText(rawDeal.title, 'Untitled Deal'),
    city: titleCase(rawDeal.city || ''),
    state: normalizeText(rawDeal.state, 'AZ').toUpperCase(),
    address: normalizeText(rawDeal.address, ''),
    zip_code: normalizeText(rawDeal.zip_code, ''),
    property_type: titleCase(rawDeal.property_type || ''),
    estimated_value: estimatedValue,
    purchase_price: purchasePrice,
    discount_percentage:
      explicitDiscount !== null
        ? explicitDiscount
        : inferDiscountPercentage(estimatedValue, purchasePrice),
    description: normalizeText(rawDeal.description, ''),
    notes: normalizeText(rawDeal.notes, ''),
    signal: normalizeText(rawDeal.signal, ''),
    contact_name: normalizeText(rawDeal.contact_name, ''),
    contact_phone: normalizeText(rawDeal.contact_phone, ''),
    contact_email: normalizeText(rawDeal.contact_email, ''),
    status: normalizeText(rawDeal.status, 'opportunity'),
    created_at: rawDeal.created_at || new Date().toISOString(),
    raw_payload: rawDeal,
  }

  return normalizedDeal
}

export function calculateDealScore(normalizedDeal) {
  const discountSignal = calculateDiscountSignal(
    normalizedDeal.discount_percentage || 0,
  )
  const distressSignal = calculateDistressSignal(normalizedDeal)
  const locationSignal = calculateLocationSignal(normalizedDeal.city)
  const completenessSignal = calculateCompletenessSignal(normalizedDeal)
  const propertyTypeSignal = calculatePropertyTypeSignal(
    normalizedDeal.property_type,
  )

  const weightedScore =
    discountSignal * SCORE_WEIGHTS.discount +
    distressSignal * SCORE_WEIGHTS.distress +
    locationSignal * SCORE_WEIGHTS.location +
    completenessSignal * SCORE_WEIGHTS.dataCompleteness +
    propertyTypeSignal * SCORE_WEIGHTS.propertyType

  return {
    score: Math.round(clamp(weightedScore, 0, 100)),
    components: {
      discountSignal,
      distressSignal,
      locationSignal,
      completenessSignal,
      propertyTypeSignal,
    },
  }
}

export function classifyDeal(score, normalizedDeal) {
  const discount = Number(normalizedDeal?.discount_percentage ?? 0)

  if (discount < 10) {
    return {
      status: 'watchlist',
      access_tier: 'standard',
      score_band: 'yellow',
    }
  }

  if (discount >= 10 && discount < 15) {
    return {
      status: 'opportunity',
      access_tier: 'standard',
      score_band: 'green',
    }
  }

  return {
    status: 'sniper_deal',
    access_tier: 'standard',
    score_band: 'red',
  }
}

export function buildPipelineDeal(rawDeal) {
  const normalizedDeal = normalizeIncomingDeal(rawDeal)
  const { score, components } = calculateDealScore(normalizedDeal)
  const classification = classifyDeal(score, normalizedDeal)

  return {
    ...normalizedDeal,
    score,
    score_components: components,
    ...classification,
  }
}

export function buildPipelineBatch(rawDeals = []) {
  return rawDeals.map((rawDeal) => buildPipelineDeal(rawDeal))
}
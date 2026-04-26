import { dedupeDeals } from "./dedupeDeals.js";
import { enrichDeal } from "./enrichDeal.js";
import { applyAccessTierToDeals } from "./assignAccessTier.js";
import { detectPremiumDeal } from "./premiumDetector.js";

// 👉 NORMALIZAR DEAL
function normalizeDeal(deal) {
  return {
    address: deal.address || "",
    city: deal.city || "",
    price: Number(deal.price) || 0,
    source: deal.source || "unknown",
    source_type: deal.source_type || "unknown",
    signal_type: deal.signal_type || "unknown",
    engine_name: deal.engine_name || "unknown_engine",
    discount: Number(deal.discount) || 0,
    urgency: Number(deal.urgency) || 0,
    off_market: Boolean(deal.off_market),
  };
}

// 👉 SCORING SIMPLE (NUEVO)
function scoreDeal(deal) {
  const discount = Number(deal.discount || deal.discount_percentage || 0);

  if (discount > 25) return 95;
  if (discount >= 15) return 80;
  if (discount >= 10) return 60;
  return 40;
}

// 👉 CLASIFICACIÓN SIMPLE (NUEVO)
function classifyDeal(score) {
  if (score >= 90) return "premium";
  if (score >= 70) return "red";
  if (score >= 50) return "green";
  return "yellow";
}

// 👉 PIPELINE PRINCIPAL
function runDealPipeline(rawDeals = []) {
  console.log("🚀 Pipeline started...");

  // 1. NORMALIZE
  const normalizedDeals = rawDeals.map(normalizeDeal);

  // 2. DEDUPE
  const { uniqueDeals, duplicates, totalInput, totalUnique, totalDuplicates } =
    dedupeDeals(normalizedDeals);

  // 3. ENRICH + SCORE + CLASSIFY
const processedDealsBase = uniqueDeals.map((deal) => {
  const enrichedDeal = enrichDeal(deal);
  const score = scoreDeal(enrichedDeal);
  const classification = classifyDeal(score);
  const isPremium = detectPremiumDeal(enrichedDeal);

  return {
  ...enrichedDeal,
  score,
  classification: classifyDeal(score),
  is_premium_candidate: isPremium,
};
});

// 👉 aplicar access tier automáticamente
const processedDeals = applyAccessTierToDeals(processedDealsBase);;

  console.log(`✅ Raw deals: ${rawDeals.length}`);
  console.log(`✅ Unique deals: ${processedDeals.length}`);
  console.log(`⚠️ Duplicates removed: ${totalDuplicates}`);

  return {
    rawDeals,
    normalizedDeals,
    uniqueDeals,
    duplicates,
    processedDeals,
    stats: {
      totalInput,
      totalUnique,
      totalDuplicates,
    },
  };
}

export { runDealPipeline };
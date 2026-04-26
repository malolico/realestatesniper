function detectPremiumDeal(deal) {
  let score = 0;

  if (deal.discount_percentage >= 25) score += 2;
  if (deal.off_market) score += 2;
  if (deal.urgency >= 8) score += 2;
  if (deal.signal_type === "distress") score += 2;
  if (deal.signal_type === "pre_foreclosure") score += 2;

  return score >= 6;
}

export { detectPremiumDeal };
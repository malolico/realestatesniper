function assignAccessTier(score) {
  if (score >= 90) return "premium";
  if (score >= 70) return "premium";
  if (score >= 50) return "standard";
  return "standard";
}

function applyAccessTier(deal) {
  return {
    ...deal,
    access_tier: assignAccessTier(deal.score),
  };
}

function applyAccessTierToDeals(deals = []) {
  return deals.map(applyAccessTier);
}

export { assignAccessTier, applyAccessTier, applyAccessTierToDeals };
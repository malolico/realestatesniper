function validateDeal(deal) {
  if (!deal.title) return false;
  if (!deal.city) return false;

  if (!deal.purchase_price || deal.purchase_price <= 0) return false;
  if (!deal.estimated_value || deal.estimated_value <= 0) return false;

  if (deal.discount_percentage == null || deal.discount_percentage < 0)
    return false;

  if (!deal.score || deal.score <= 0) return false;

  return true;
}

function filterValidDeals(deals = []) {
  const validDeals = deals.filter(validateDeal);
  const invalidDeals = deals.length - validDeals.length;

  console.log(`🧪 Valid deals: ${validDeals.length}`);
  console.log(`⚠️ Invalid deals removed: ${invalidDeals}`);

  return validDeals;
}

export { validateDeal, filterValidDeals };
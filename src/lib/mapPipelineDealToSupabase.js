function mapPipelineDealToSupabase(deal) {
  return {
    title: deal.title || "",
    city: deal.city || "",
    property_type: deal.property_type || "standard",

    estimated_value: Number(deal.estimated_value || deal.value || 0),
    purchase_price: Number(deal.purchase_price || deal.price || 0),
    discount_percentage: Number(deal.discount_percentage || deal.discount || 0),

    score: Number(deal.score || 0),

    status: "watchlist",

    access_tier: ["premium", "red"].includes(deal.classification)
      ? "premium"
      : "standard",

    description: deal.description || deal.opportunity_reason || "",

    classification: deal.classification || null,
    is_premium_candidate: deal.is_premium_candidate || false,
  };
}

export { mapPipelineDealToSupabase };
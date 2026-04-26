function buildTitle(deal) {
  const signal = deal.signal_type || "opportunity";
  const city = deal.city || "unknown city";

  return `${signal} deal in ${city}`;
}

function buildDescription(deal) {
  const parts = [];

  if (deal.signal_type) {
    parts.push(`${deal.signal_type} signal detected`);
  }

  if (deal.off_market) {
    parts.push("off-market opportunity");
  }

  if (deal.urgency >= 7) {
    parts.push("high urgency seller");
  }

  if (deal.discount >= 10) {
    parts.push(`estimated discount ${deal.discount}%`);
  }

  return parts.join(", ") || "potential investment opportunity";
}

function enrichDeal(deal) {
  return {
    ...deal,

    title: buildTitle(deal),

    property_type: "residential",

    estimated_value: Number(deal.price || 0),

    purchase_price: Number(deal.price || 0),

    discount_percentage: Number(deal.discount || 0),

    status: "active",

    access_tier:
      deal.discount >= 25
        ? "premium"
        : deal.discount >= 15
        ? "standard"
        : "basic",

    description: buildDescription(deal),
  };
}

export { enrichDeal };
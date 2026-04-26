function normalizeValue(value) {
  return String(value || "").trim().toLowerCase();
}

function buildDedupeKey(deal) {
  const address = normalizeValue(deal.address);
  const city = normalizeValue(deal.city);
  const purchasePrice = Number(deal.price || 0);

  if (address && city && purchasePrice) {
    return `${address}__${city}__${purchasePrice}`;
  }

  const title = normalizeValue(deal.title);

  if (title && city) {
    return `${title}__${city}`;
  }

  return JSON.stringify(deal);
}

function dedupeDeals(deals) {
  const seen = new Map();
  const duplicates = [];

  deals.forEach((deal) => {
    const key = buildDedupeKey(deal);

    if (seen.has(key)) {
      duplicates.push(deal);
    } else {
      seen.set(key, deal);
    }
  });

  const uniqueDeals = Array.from(seen.values());

  return {
    uniqueDeals,
    duplicates,
    totalInput: deals.length,
    totalUnique: uniqueDeals.length,
    totalDuplicates: duplicates.length,
  };
}

export { dedupeDeals };
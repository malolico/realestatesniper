function generateDistressDeals() {
  return [
    {
      address: "455 Broken Fence Ave",
      city: "Glendale",
      price: 175000,
      source: "vacancy_signal",
      source_type: "public",
      signal_type: "distress",
      engine_name: "distress_engine",
      discount: 28,
      urgency: 7,
      off_market: true,
    },
    {
      address: "900 Empty Lot Street",
      city: "Tempe",
      price: 210000,
      source: "code_violation",
      source_type: "public",
      signal_type: "distress",
      engine_name: "distress_engine",
      discount: 16,
      urgency: 8,
      off_market: true,
    },
  ];
}

export { generateDistressDeals };
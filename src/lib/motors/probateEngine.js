function generateProbateDeals() {
  return [
    {
      address: "789 Desert Lane",
      city: "Phoenix",
      price: 220000,
      source: "county_records",
      source_type: "public",
      signal_type: "probate",
      engine_name: "probate_engine",
      discount: 18,
      urgency: 8,
      off_market: true,
    },
    {
      address: "1010 Sunset Road",
      city: "Tucson",
      price: 180000,
      source: "court_records",
      source_type: "public",
      signal_type: "probate",
      engine_name: "probate_engine",
      discount: 25,
      urgency: 9,
      off_market: true,
    },
    {
      address: "789 DESERT LN",
      city: "phoenix",
      price: "220000",
      source: "county_records",
      source_type: "public",
      signal_type: "probate",
      engine_name: "probate_engine",
      discount: 18,
      urgency: 8,
      off_market: true,
    },
  ];
}

export { generateProbateDeals };
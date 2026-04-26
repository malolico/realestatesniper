function generatePreForeclosureDeals() {
  return [
    {
      address: "2021 Canyon Drive",
      city: "Phoenix",
      price: 260000,
      source: "notice_of_default",
      source_type: "public",
      signal_type: "pre_foreclosure",
      engine_name: "pre_foreclosure_engine",
      discount: 12,
      urgency: 9,
      off_market: true,
    },
    {
      address: "88 West Elm Street",
      city: "Mesa",
      price: 195000,
      source: "auction_prelist",
      source_type: "public",
      signal_type: "pre_foreclosure",
      engine_name: "pre_foreclosure_engine",
      discount: 22,
      urgency: 10,
      off_market: true,
    },
  ];
}

export { generatePreForeclosureDeals };
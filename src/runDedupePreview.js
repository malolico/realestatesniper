import { dedupeDeals } from "./lib/dedupeDeals.js";

const deals = [
  {
    address: "123 Main Street",
    city: "Phoenix",
    price: 250000,
  },
  {
    address: "123 MAIN ST.",
    city: "phoenix",
    price: "250000",
  },
  {
    address: "456 Oak Avenue",
    city: "Mesa",
    price: 310000,
  },
];

const result = dedupeDeals(deals);

console.log(JSON.stringify(result, null, 2));
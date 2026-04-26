import { runDealPipeline } from "./lib/dealPipeline.js";

// 👉 SAMPLE DATA (simula motores)
const sampleRawDeals = [
  {
    address: "123 Test St",
    city: "Phoenix",
    price: 210000,
    source: "code_violation",
    source_type: "public",
    signal_type: "distress",
    engine_name: "distress_engine",
    discount: 16,
    urgency: 8,
    off_market: true,
  },
  {
    address: "123 Test St",
    city: "Phoenix",
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

const result = runDealPipeline(sampleRawDeals);

// 👉 MOSTRAR TODO
console.log("🧠 FINAL PROCESSED DEALS:");
console.log(JSON.stringify(result.processedDeals, null, 2));

// 👉 STATS
console.log("\n📊 STATS:");
console.log(result.stats);

// 🔥 👉 NUEVO: TOP DEALS
const topDeals = result.processedDeals
  .filter(deal => deal.score >= 70)
  .sort((a, b) => b.score - a.score);

console.log("\n🔥 TOP DEALS:");
console.log(JSON.stringify(topDeals, null, 2));
// 👉 SEPARACIÓN POR NIVELES

const normalDeals = result.processedDeals.filter(d => d.classification === "yellow");
const goodDeals = result.processedDeals.filter(d => d.classification === "green");
const greatDeals = result.processedDeals.filter(d => d.classification === "red");
const premiumDeals = result.processedDeals.filter(d => d.is_premium_candidate === true);

console.log("\n🟡 NORMAL DEALS:");
console.log(JSON.stringify(normalDeals, null, 2));

console.log("\n🟢 GOOD DEALS:");
console.log(JSON.stringify(goodDeals, null, 2));

console.log("\n🔴 GREAT DEALS:");
console.log(JSON.stringify(greatDeals, null, 2));

console.log("\n💎 PREMIUM DEALS:");
console.log(JSON.stringify(premiumDeals, null, 2));
// 💣 DIAMOND DEALS

const diamondDeals = result.processedDeals.filter(d =>
  d.score >= 85 &&
  d.is_premium_candidate === true &&
  d.off_market === true &&
  (d.urgency || 0) >= 7
);

console.log("\n💣 DIAMOND DEALS:");
console.log(JSON.stringify(diamondDeals, null, 2));
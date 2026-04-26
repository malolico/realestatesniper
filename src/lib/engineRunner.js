import { generateProbateDeals } from "./motors/probateEngine.js";
import { generatePreForeclosureDeals } from "./motors/preForeclosureEngine.js";
import { generateDistressDeals } from "./motors/distressEngine.js";

function runAllEngines() {
  console.log("🚀 Running all engines...\n");

  const probateDeals = generateProbateDeals();
  console.log(`⚰️ Probate deals: ${probateDeals.length}`);

  const preForeclosureDeals = generatePreForeclosureDeals();
  console.log(`🏚️ Pre-foreclosure deals: ${preForeclosureDeals.length}`);

  const distressDeals = generateDistressDeals();
  console.log(`⚠️ Distress deals: ${distressDeals.length}`);

  const allDeals = [
    ...probateDeals,
    ...preForeclosureDeals,
    ...distressDeals,
  ];

  console.log(`\n📊 TOTAL RAW DEALS: ${allDeals.length}\n`);

  return allDeals;
}

export { runAllEngines };
import "dotenv/config";
import { runDealPipeline } from "./lib/dealPipeline.js";
import { runAllEngines } from "./lib/engineRunner.js";
import { mapPipelineDealToSupabase } from "./lib/mapPipelineDealToSupabase.js";
import { supabaseNode } from "./lib/supabaseNode.js";
import { filterValidDeals } from "./lib/validateDeal.js";
import { checkDealsConsistency } from "./lib/assertDealConsistency.js";
import { analyzeDealsByEngine, printEngineAnalytics } from "./lib/engineAnalytics.js";

const rawDeals = runAllEngines();
const result = runDealPipeline(rawDeals);
const analytics = analyzeDealsByEngine(result.processedDeals);
printEngineAnalytics(analytics);

checkDealsConsistency(result.processedDeals);

const mappedDeals = result.processedDeals.map(mapPipelineDealToSupabase);
const payload = filterValidDeals(mappedDeals);

console.log("========== INSERT PAYLOAD ==========");
console.log(JSON.stringify(payload, null, 2));

const { data, error } = await supabaseNode
  .from("deals")
  .insert(payload)
  .select();

if (error) {
  console.error("❌ Supabase insert error:");
  console.error(error);
} else {
  console.log("✅ Insert successful");
  console.log(`Inserted rows: ${data.length}`);

  console.log("========== SAMPLE ROWS ==========");
  console.log(
    JSON.stringify(
      data.map((row) => ({
        id: row.id,
        title: row.title,
        city: row.city,
        property_type: row.property_type,
        estimated_value: row.estimated_value,
        purchase_price: row.purchase_price,
        discount_percentage: row.discount_percentage,
        score: row.score,
        status: row.status,
        access_tier: row.access_tier,
        description: row.description,
      })),
      null,
      2
    )
  );
}
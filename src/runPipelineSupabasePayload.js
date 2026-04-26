import { runDealPipeline } from "./lib/dealPipeline.js";
import { generateProbateDeals } from "./lib/motors/probateEngine.js";
import { mapPipelineDealToSupabase } from "./lib/mapPipelineDealToSupabase.js";

const rawDeals = generateProbateDeals();
const result = runDealPipeline(rawDeals);

const supabasePayload = result.processedDeals.map(mapPipelineDealToSupabase);

console.log("========== SUPABASE PAYLOAD ==========");
console.log(JSON.stringify(supabasePayload, null, 2));
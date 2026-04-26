function analyzeDealsByEngine(deals = []) {
  const summary = {};

  deals.forEach((deal) => {
    const engine = deal.engine_name || "unknown_engine";

    if (!summary[engine]) {
      summary[engine] = {
        total: 0,
        avgScore: 0,
        totalScore: 0,
        premium: 0,
        red: 0,
        green: 0,
        yellow: 0,
      };
    }

    const bucket = summary[engine];

    bucket.total++;
    bucket.totalScore += deal.score;

    // clasificación
    if (deal.classification === "premium") bucket.premium++;
    else if (deal.classification === "red") bucket.red++;
    else if (deal.classification === "green") bucket.green++;
    else bucket.yellow++;
  });

  // calcular medias
  Object.keys(summary).forEach((engine) => {
    const bucket = summary[engine];
    bucket.avgScore = Math.round(bucket.totalScore / bucket.total);
  });

  return summary;
}

function printEngineAnalytics(summary) {
  console.log("📊 ENGINE ANALYTICS ==========");

  Object.entries(summary).forEach(([engine, data]) => {
    console.log(`\n🔧 ${engine}`);
    console.log(`Total deals: ${data.total}`);
    console.log(`Avg score: ${data.avgScore}`);
    console.log(
      `Premium: ${data.premium} | Red: ${data.red} | Green: ${data.green} | Yellow: ${data.yellow}`
    );
  });
}

export { analyzeDealsByEngine, printEngineAnalytics };
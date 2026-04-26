import fs from "fs";
import path from "path";

function parseCsvLine(line) {
  return line.split(",").map((value) => value.trim());
}

function probateCsvRowToDeal(headers, values) {
  const row = {};

  headers.forEach((header, index) => {
    row[header] = values[index];
  });

  return {
    address: row.property_address || "",
    city: row.city || "",
    price: Number(row.estimated_value) || 0,
    source: row.source || "county_probate",
    source_type: row.source_type || "public",
    signal_type: row.signal_type || "probate",
    engine_name: row.engine_name || "probate_csv_engine",
    discount: Number(row.discount) || 0,
    urgency: Number(row.urgency) || 0,
    off_market: String(row.off_market).toLowerCase() === "true",

    // extra info útil para futuro
    case_number: row.case_number || "",
    filing_date: row.filing_date || "",
    owner_name: row.owner_name || "",
  };
}

function generateProbateCsvDeals() {
  const csvPath = path.resolve("data/real_probate_data.csv");
  const fileContent = fs.readFileSync(csvPath, "utf-8");

  const lines = fileContent
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);

  if (lines.length < 2) {
    return [];
  }

  const headers = parseCsvLine(lines[0]);
  const rows = lines.slice(1);

  return rows.map((line) => {
    const values = parseCsvLine(line);
    return probateCsvRowToDeal(headers, values);
  });
}

export { generateProbateCsvDeals };
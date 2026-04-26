import fs from "fs";
import path from "path";

function parseCsvLine(line) {
  return line.split(",").map((value) => value.trim());
}

function csvValueToDeal(headers, values) {
  const row = {};

  headers.forEach((header, index) => {
    row[header] = values[index];
  });

  return {
    address: row.address || "",
    city: row.city || "",
    price: Number(row.price) || 0,
    source: row.source || "csv_upload",
    source_type: row.source_type || "manual",
    signal_type: row.signal_type || "unknown",
    engine_name: row.engine_name || "csv_import_engine",
    discount: Number(row.discount) || 0,
    urgency: Number(row.urgency) || 0,
    off_market: String(row.off_market).toLowerCase() === "true",
  };
}

function generateCsvImportDeals() {
  const csvPath = path.resolve("data/sample_deals.csv");
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
    return csvValueToDeal(headers, values);
  });
}

export { generateCsvImportDeals };
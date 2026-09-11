/**
 * SP11-P1 — Secured Master BULK_SNAPSHOT offline validation (CB-02)
 *
 *   node src/factory/cb02/validateSecuredMasterBulk.js
 *
 * Synthetic deterministic data only. No Toshiba. No network. No LIVE client.
 */

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import {
  CODE_BK500_RECONSTRUCTION_FAILED,
  CODE_EMPTY_FOLIO_KEY,
  CODE_FIELD_COUNT_INVALID,
  CODE_HEADER_MISMATCH,
  parseOptionalNumeric,
  parseSecuredMasterBook,
} from "./discovery/securedMasterBulkParser.js";
import {
  SECURED_MASTER_EXPECTED_HEADER_FIELDS,
} from "./discovery/securedMasterSnapshotContract.js";
import {
  ASSESSED_YEAR_METADATA_REQUIRED,
  adaptSecuredMasterRecordToAsrPayload,
} from "./discovery/securedMasterToAsrPayloadAdapter.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

function pass(id, details = []) {
  return { id, passed: true, details };
}

function fail(id, errors) {
  return { id, passed: false, errors };
}

function headerLine() {
  return SECURED_MASTER_EXPECTED_HEADER_FIELDS.join("|");
}

/** Build a synthetic 39-field data row (no real PII). */
function synthRow(overrides = {}) {
  const fields = Array(39).fill("");
  fields[0] = overrides.FolioKey ?? "209010680";
  fields[1] = overrides.OwnerName ?? "SYNTH OWNER";
  fields[8] = overrides.SitusAddress ?? "100 SYNTH ST";
  fields[10] = overrides.SitusCity ?? "PHOENIX";
  fields[11] = overrides.SitusPostalCode ?? "85001";
  fields[14] = overrides.DeedDate ?? "01152024";
  fields[16] = overrides.LandValue ?? "";
  fields[22] = overrides.PUC ?? "0001";
  fields[34] = overrides.SaleDate ?? "012024";
  for (const [k, v] of Object.entries(overrides)) {
    const idx = SECURED_MASTER_EXPECTED_HEADER_FIELDS.indexOf(k);
    if (idx >= 0) fields[idx] = v;
  }
  return fields.join("|");
}

function bookBytes(lines) {
  return Buffer.from(lines.join("\r\n") + "\r\n", "utf8");
}

function t01HeaderAccepted() {
  const bytes = bookBytes([headerLine(), synthRow()]);
  const r = parseSecuredMasterBook({ bookId: "BK100", bytes });
  if (!r.ok) return fail("T01", [`expected ok, got ${r.code}`]);
  if (r.records.length !== 1) return fail("T01", [`records=${r.records.length}`]);
  return pass("T01");
}

function t02WrongHeader() {
  const bad = ["WrongHeader|" + SECURED_MASTER_EXPECTED_HEADER_FIELDS.slice(1).join("|"), synthRow()];
  const r = parseSecuredMasterBook({ bookId: "BK100", bytes: bookBytes(bad) });
  if (r.ok) return fail("T02", ["expected file reject"]);
  if (r.code !== CODE_HEADER_MISMATCH) return fail("T02", [`code=${r.code}`]);
  return pass("T02");
}

function t03ValidRecord() {
  const r = parseSecuredMasterBook({
    bookId: "BK200",
    bytes: bookBytes([headerLine(), synthRow({ FolioKey: "300010010" })]),
  });
  if (!r.ok || r.records.length !== 1) return fail("T03", ["parse failed"]);
  if (r.records[0].folioKey !== "300010010") return fail("T03", ["folio mismatch"]);
  if (r.records[0].reconstructedFromEmbeddedLf) return fail("T03", ["unexpected recon"]);
  return pass("T03");
}

function t04BlankNotZero() {
  const r = parseSecuredMasterBook({
    bookId: "BK100",
    bytes: bookBytes([headerLine(), synthRow({ LandValue: "" })]),
  });
  if (!r.ok) return fail("T04", [r.code]);
  const land = r.records[0].optionalNumerics.LandValue;
  if (land !== null) return fail("T04", [`LandValue=${land}`]);
  const parsed = parseOptionalNumeric("");
  if (parsed !== null) return fail("T04", ["parseOptionalNumeric blank != null"]);
  return pass("T04");
}

function t05EmptyFolio() {
  const r = parseSecuredMasterBook({
    bookId: "BK100",
    bytes: bookBytes([headerLine(), synthRow({ FolioKey: "" })]),
  });
  if (!r.ok) return fail("T05", ["file should still ok with record reject"]);
  if (r.records.length !== 0) return fail("T05", ["expected no records"]);
  if (!r.rejects.some((x) => x.code === CODE_EMPTY_FOLIO_KEY)) {
    return fail("T05", ["missing EMPTY_FOLIO_KEY"]);
  }
  return pass("T05");
}

function t06Dates() {
  const good = parseSecuredMasterBook({
    bookId: "BK100",
    bytes: bookBytes([
      headerLine(),
      synthRow({ DeedDate: "12252023", SaleDate: "062023" }),
    ]),
  });
  if (!good.ok || good.records.length !== 1) return fail("T06", ["good dates failed"]);

  const badDeed = parseSecuredMasterBook({
    bookId: "BK100",
    bytes: bookBytes([headerLine(), synthRow({ DeedDate: "2023-12-25" })]),
  });
  if (badDeed.records.length !== 0) return fail("T06", ["bad DeedDate accepted"]);
  if (!badDeed.rejects.some((x) => x.code === "DATE_PARSE_FAILED")) {
    return fail("T06", ["DeedDate reject missing"]);
  }

  const badSale = parseSecuredMasterBook({
    bookId: "BK100",
    bytes: bookBytes([headerLine(), synthRow({ SaleDate: "202306" })]),
  });
  // 202306 is MMYYYY with mm=20 invalid
  if (badSale.records.length !== 0) return fail("T06", ["bad SaleDate accepted"]);
  return pass("T06");
}

function t07Bk500Recon() {
  // Confirmed shape: 2-field fragment + lone LF + complementary 38-field fragment.
  const fields = Array(39).fill("");
  fields[0] = "209010680";
  fields[1] = "SYNTHNAM";
  fields[8] = "100 SYNTH ST";
  fields[10] = "PHOENIX";
  fields[11] = "85001";
  fields[14] = "01152024";
  fields[22] = "0001";
  fields[34] = "012024";
  const first = fields.slice(0, 2).join("|");
  const second = "|" + fields.slice(2).join("|");
  const c1 = first.split("|").length;
  const c2 = second.split("|").length;
  if (c1 !== 2) return fail("T07", [`c1=${c1}`]);
  if (c2 !== 38) return fail("T07", [`c2=${c2}`]);
  if ((first + second).split("|").length !== 39) {
    return fail("T07", [`concat=${(first + second).split("|").length}`]);
  }

  const body = Buffer.concat([
    Buffer.from(headerLine() + "\r\n", "utf8"),
    Buffer.from(first + "\n", "utf8"),
    Buffer.from(second + "\r\n", "utf8"),
  ]);
  const r = parseSecuredMasterBook({ bookId: "BK500", bytes: body });
  if (!r.ok) return fail("T07", [`file reject ${r.code}`]);
  if (r.records.length !== 1) {
    return fail("T07", [`records=${r.records.length} rejects=${JSON.stringify(r.rejects)}`]);
  }
  if (!r.records[0].reconstructedFromEmbeddedLf) {
    return fail("T07", ["reconstructedFromEmbeddedLf false"]);
  }
  if (r.records[0].fields.length !== 39) return fail("T07", ["field len"]);
  return pass("T07");
}

function t08FailedRecon() {
  const first = "209010680|ONLYTWO";
  const second = "|ONLY|THREE"; // concat fields != 39
  const body = Buffer.concat([
    Buffer.from(headerLine() + "\r\n", "utf8"),
    Buffer.from(first + "\n", "utf8"),
    Buffer.from(second + "\r\n", "utf8"),
  ]);
  const r = parseSecuredMasterBook({ bookId: "BK500", bytes: body });
  if (!r.ok) return fail("T08", ["unexpected file reject"]);
  if (r.records.length !== 0) return fail("T08", ["should not accept"]);
  if (!r.rejects.some((x) => x.code === CODE_BK500_RECONSTRUCTION_FAILED)) {
    return fail("T08", [`rejects=${JSON.stringify(r.rejects)}`]);
  }
  return pass("T08");
}

function t09FortyFields() {
  const row = synthRow() + "|EXTRA";
  const r = parseSecuredMasterBook({
    bookId: "BK100",
    bytes: bookBytes([headerLine(), row]),
  });
  if (!r.ok) return fail("T09", ["file reject unexpected"]);
  if (r.records.length !== 0) return fail("T09", ["accepted 40"]);
  if (!r.rejects.some((x) => x.code === CODE_FIELD_COUNT_INVALID)) {
    return fail("T09", ["missing FIELD_COUNT_INVALID"]);
  }
  return pass("T09");
}

function t10PayloadWithTaxYear() {
  const r = parseSecuredMasterBook({
    bookId: "BK100",
    bytes: bookBytes([headerLine(), synthRow()]),
  });
  const adapted = adaptSecuredMasterRecordToAsrPayload({
    record: r.records[0],
    taxYearMetadata: { assessedYear: 2024 },
  });
  if (!adapted.ok) return fail("T10", [adapted.reason]);
  if (adapted.payload.assessedYear !== 2024) return fail("T10", ["year"]);
  if (adapted.payload.parcelId !== adapted.payload.apn) return fail("T10", ["id mismatch"]);
  if (adapted.payload.situsAddress.state !== undefined) {
    return fail("T10", ["state must be omitted"]);
  }
  return pass("T10");
}

function t11PayloadGatedNoTaxYear() {
  const r = parseSecuredMasterBook({
    bookId: "BK100",
    bytes: bookBytes([headerLine(), synthRow()]),
  });
  if (!r.ok || r.records.length !== 1) return fail("T11", ["source invalid"]);
  const adapted = adaptSecuredMasterRecordToAsrPayload({
    record: r.records[0],
    taxYearMetadata: null,
  });
  if (adapted.ok) return fail("T11", ["should gate"]);
  if (adapted.reason !== ASSESSED_YEAR_METADATA_REQUIRED) {
    return fail("T11", [`reason=${adapted.reason}`]);
  }
  if (adapted.payload !== null) return fail("T11", ["payload not null"]);
  return pass("T11");
}

function t12NoLiveImport() {
  const files = [
    "discovery/securedMasterSnapshotContract.js",
    "discovery/securedMasterBulkParser.js",
    "discovery/securedMasterToAsrPayloadAdapter.js",
  ];
  const needle = "maricopaAssessor" + "LiveClient";
  const errors = [];
  for (const rel of files) {
    const src = fs.readFileSync(path.join(__dirname, rel), "utf8");
    if (src.includes(needle)) {
      errors.push(`${rel} imports LIVE client`);
    }
  }
  return errors.length ? fail("T12", errors) : pass("T12");
}

function t13NetworkTrap(realLiveRequestCount) {
  if (realLiveRequestCount !== 0) {
    return fail("T13", [`realLiveRequestCount=${realLiveRequestCount}`]);
  }
  return pass("T13");
}

export function runSecuredMasterBulkValidation() {
  const originalFetch = globalThis.fetch;
  let realLiveRequestCount = 0;
  globalThis.fetch = (..._args) => {
    realLiveRequestCount += 1;
    throw new Error("Secured Master bulk validation forbidden real fetch");
  };

  let results;
  try {
    results = [
      t01HeaderAccepted(),
      t02WrongHeader(),
      t03ValidRecord(),
      t04BlankNotZero(),
      t05EmptyFolio(),
      t06Dates(),
      t07Bk500Recon(),
      t08FailedRecon(),
      t09FortyFields(),
      t10PayloadWithTaxYear(),
      t11PayloadGatedNoTaxYear(),
      t12NoLiveImport(),
    ];
  } finally {
    if (originalFetch === undefined) delete globalThis.fetch;
    else globalThis.fetch = originalFetch;
  }

  results.push(t13NetworkTrap(realLiveRequestCount));

  const passed = results.every((r) => r.passed);
  return {
    program: "SP11-P1",
    slice: "SECURED_MASTER_BULK",
    passed,
    realLiveRequestCount,
    results,
  };
}

const isMain =
  process.argv[1] &&
  (process.argv[1].endsWith("validateSecuredMasterBulk.js") ||
    process.argv[1].includes("validateSecuredMasterBulk"));

if (isMain) {
  const result = runSecuredMasterBulkValidation();
  console.log("=== SP11-P1 Secured Master BULK Validation ===\n");
  console.log(JSON.stringify(result, null, 2));
  if (!result.passed) {
    console.error("\nSecured Master BULK validation FAILED");
    process.exit(1);
  }
  console.log(
    `\nSecured Master BULK validation PASSED — realLiveRequestCount=${result.realLiveRequestCount}`
  );
  process.exit(0);
}

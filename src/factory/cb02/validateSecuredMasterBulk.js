/**
 * SP11-P1 — Secured Master BULK_SNAPSHOT offline validation (CB-02)
 *
 *   node src/factory/cb02/validateSecuredMasterBulk.js
 *
 * Synthetic deterministic data only. No Toshiba. No network. No LIVE client.
 */

import { createHash } from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import {
  CODE_BK500_RECONSTRUCTION_FAILED,
  CODE_EMPTY_FOLIO_KEY,
  CODE_ENCODING_REJECTED,
  CODE_FIELD_COUNT_INVALID,
  CODE_HEADER_MISMATCH,
  CODE_SOURCE_RECORD_ENCODING_REJECTED,
  isValidSaleDate,
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
import {
  SCHEMA_ASR_MC_V1,
  validatePayloadAgainstSchema,
} from "./connectors/payloadSchemas.js";

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

function sha256(bytes) {
  return createHash("sha256").update(bytes).digest("hex");
}

function joinRawFields(parts) {
  const chunks = [];
  for (let i = 0; i < parts.length; i += 1) {
    if (i > 0) chunks.push(Buffer.from("|"));
    chunks.push(parts[i]);
  }
  return Buffer.concat(chunks);
}

function baseFieldParts(overrides = {}) {
  const text = Array(39).fill("");
  text[0] = overrides.FolioKey ?? "209010680";
  text[1] = overrides.OwnerName ?? "SYNTH OWNER";
  text[8] = overrides.SitusAddress ?? "100 SYNTH ST";
  text[10] = overrides.SitusCity ?? "PHOENIX";
  text[11] = overrides.SitusPostalCode ?? "85001";
  text[14] = overrides.DeedDate ?? "01152024";
  text[22] = overrides.PUC ?? "0001";
  text[34] = overrides.SaleDate ?? "012024";
  for (const [name, value] of Object.entries(overrides)) {
    const idx = SECURED_MASTER_EXPECTED_HEADER_FIELDS.indexOf(name);
    if (idx >= 0) text[idx] = value;
  }
  return text.map((value) => Buffer.from(value, "utf8"));
}

function insertByte(parts, fieldName, offset, byte) {
  const idx = SECURED_MASTER_EXPECTED_HEADER_FIELDS.indexOf(fieldName);
  const cur = parts[idx];
  const at = Math.max(0, Math.min(offset, cur.length));
  const next = Buffer.alloc(cur.length + 1);
  next.set(cur.subarray(0, at), 0);
  next[at] = byte;
  next.set(cur.subarray(at), at + 1);
  parts[idx] = next;
}

function bookFromRawRows(rawRows) {
  const chunks = [Buffer.from(headerLine(), "utf8")];
  for (const row of rawRows) {
    chunks.push(Buffer.from("\r\n"));
    chunks.push(row);
  }
  chunks.push(Buffer.from("\r\n"));
  return Buffer.concat(chunks);
}

function containsReplacementChar(value, seen = new Set()) {
  if (typeof value === "string") return value.includes("\uFFFD");
  if (!value || typeof value !== "object") return false;
  if (seen.has(value)) return false;
  seen.add(value);
  return Object.values(value).some((entry) => containsReplacementChar(entry, seen));
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

const ACCEPTED_RECORD_KEYS = Object.freeze([
  "logicalIndex",
  "physicalLineStart",
  "physicalLineEnd",
  "fields",
  "folioKey",
  "reconstructedFromEmbeddedLf",
  "rawLogicalFingerprint",
  "optionalNumerics",
  "provenance",
]);

function containsDateOrIso(value, seen = new Set()) {
  if (value instanceof Date) return true;
  if (typeof value === "string" && /^\d{4}-\d{2}-\d{2}/.test(value)) return true;
  if (!value || typeof value !== "object") return false;
  if (seen.has(value)) return false;
  seen.add(value);
  return Object.values(value).some((entry) => containsDateOrIso(entry, seen));
}

function t14SaleDateDefectCompatibility() {
  const errors = [];
  if (isValidSaleDate("") !== true) errors.push("blank failed isValidSaleDate");
  if (isValidSaleDate("062023") !== true) errors.push("canonical failed isValidSaleDate");
  if (isValidSaleDate("10012020") !== false) {
    errors.push("isValidSaleDate accepted MM01YYYY");
  }
  if (SECURED_MASTER_EXPECTED_HEADER_FIELDS[34] !== "SaleDate") {
    errors.push("SaleDate index drifted");
  }

  const acceptTokens = [
    "",
    "062023",
    "10012020",
    "08012024",
    "11012017",
    "01011900",
    "12012100",
  ];
  const accepted = parseSecuredMasterBook({
    bookId: "BK100",
    bytes: bookBytes([
      headerLine(),
      ...acceptTokens.map((sale, i) =>
        synthRow({
          FolioKey: `20901068${i}`,
          DeedDate: "12252023",
          SaleDate: sale,
        })
      ),
    ]),
  });
  if (!accepted.ok || accepted.records.length !== acceptTokens.length) {
    errors.push(`accept count=${accepted.records.length} rejects=${accepted.rejects.length}`);
  }
  if (accepted.rejects.length !== 0) errors.push("accept book produced rejects");

  for (let i = 0; i < accepted.records.length; i += 1) {
    const rec = accepted.records[i];
    if (Object.keys(rec).join("|") !== ACCEPTED_RECORD_KEYS.join("|")) {
      errors.push(`record keys ${Object.keys(rec).join("|")}`);
    }
    if (rec.fields.length !== 39) errors.push("fields.length");
    if (rec.fields[34] !== acceptTokens[i]) {
      errors.push(`verbatim ${acceptTokens[i]} -> ${rec.fields[34]}`);
    }
    if ("saleDateRead" in rec || "day" in rec) errors.push("date property added");
    if (containsDateOrIso(rec)) errors.push("Date or ISO present");
  }

  const defect = accepted.records.find((rec) => rec.fields[34] === "10012020");
  if (!defect) {
    errors.push("missing 10012020 record");
  } else {
    const adapted = adaptSecuredMasterRecordToAsrPayload({
      record: defect,
      taxYearMetadata: { assessedYear: 2024 },
    });
    if (!adapted.ok) errors.push(`adapter ${adapted.reason}`);
    else {
      const schema = validatePayloadAgainstSchema(SCHEMA_ASR_MC_V1, adapted.payload);
      if (!schema.ok) errors.push(`schema ${schema.reason}`);
      const payloadKeys = Object.keys(adapted.payload).sort().join("|");
      if (payloadKeys !== "apn|assessedYear|landUseCode|parcelId|schemaId|situsAddress") {
        errors.push(`payload keys ${payloadKeys}`);
      }
    }
  }

  const rejectTokens = [
    "00012024",
    "13012024",
    "01011899",
    "01012101",
    "10022020",
    "10152020",
    "10202",
    "1001202",
    "100120200",
    "10AB2020",
  ];
  for (const token of rejectTokens) {
    const rejected = parseSecuredMasterBook({
      bookId: "BK100",
      bytes: bookBytes([headerLine(), synthRow({ SaleDate: token })]),
    });
    if (rejected.records.length !== 0) errors.push(`accepted reject token ${token}`);
    const saleReject = rejected.rejects.some(
      (row) => row.code === "DATE_PARSE_FAILED" && row.field === "SaleDate"
    );
    if (!saleReject) errors.push(`missing SaleDate reject ${token}`);
  }

  const badDeed = parseSecuredMasterBook({
    bookId: "BK100",
    bytes: bookBytes([
      headerLine(),
      synthRow({ DeedDate: "2023-12-25", SaleDate: "10012020" }),
    ]),
  });
  if (badDeed.records.length !== 0) errors.push("bad DeedDate accepted");
  if (!badDeed.rejects.some((row) => row.code === "DATE_PARSE_FAILED" && row.field === "DeedDate")) {
    errors.push("DeedDate reject missing");
  }

  return errors.length ? fail("T14", errors) : pass("T14");
}

function encodingRejects(result) {
  return result.rejects.filter((row) => row.code === CODE_SOURCE_RECORD_ENCODING_REJECTED);
}

function assertEncodingReject(errors, label, rawRow, fieldName, options = {}) {
  const parsed = parseSecuredMasterBook({
    bookId: "BK100",
    bytes: bookFromRawRows([rawRow]),
  });
  if (!parsed.ok) {
    errors.push(`${label} file rejected ${parsed.code}`);
    return;
  }
  if (parsed.records.length !== 0) errors.push(`${label} accepted a record`);
  const rows = encodingRejects(parsed);
  if (rows.length !== 1) {
    errors.push(`${label} encoding rejects=${rows.length}`);
    return;
  }
  const row = rows[0];
  if (row.severity !== "SOURCE_RECORD_REJECTED") errors.push(`${label} severity`);
  if (row.code === CODE_ENCODING_REJECTED) errors.push(`${label} reused file code`);
  if (row.logicalIndex !== 1) errors.push(`${label} logicalIndex=${row.logicalIndex}`);
  if (row.physicalLineStart !== 2 || row.physicalLineEnd !== 2) {
    errors.push(`${label} lines ${row.physicalLineStart}-${row.physicalLineEnd}`);
  }
  if (row.field !== fieldName) errors.push(`${label} field=${row.field}`);
  if (row.rawLogicalFingerprint !== sha256(rawRow)) errors.push(`${label} fingerprint`);
  if (options.expectFolio) {
    if (row.folioKey !== options.expectFolio) errors.push(`${label} folioKey=${row.folioKey}`);
  } else if (Object.prototype.hasOwnProperty.call(row, "folioKey")) {
    errors.push(`${label} folioKey present`);
  }
  if (containsReplacementChar(parsed)) errors.push(`${label} U+FFFD`);
}

function t15RecordEncodingReject() {
  const errors = [];

  const ascii = joinRawFields(baseFieldParts());
  const asciiBook = parseSecuredMasterBook({
    bookId: "BK100",
    bytes: bookFromRawRows([ascii]),
  });
  if (!asciiBook.ok || asciiBook.records.length !== 1 || asciiBook.rejects.length !== 0) {
    errors.push("clean ASCII rejected");
  } else {
    const rec = asciiBook.records[0];
    if (Object.keys(rec).join("|") !== ACCEPTED_RECORD_KEYS.join("|")) errors.push("ASCII keys");
    if (rec.fields.some((value) => typeof value !== "string")) errors.push("ASCII field type");
    if (rec.rawLogicalFingerprint !== sha256(ascii)) errors.push("ASCII fingerprint");
    if (containsReplacementChar(asciiBook)) errors.push("ASCII U+FFFD");
  }

  const multibyteParts = baseFieldParts({ MailingCity: "San Jos" });
  multibyteParts[4] = Buffer.concat([multibyteParts[4], Buffer.from([0xc3, 0xa9])]);
  const multibyte = joinRawFields(multibyteParts);
  const multibyteBook = parseSecuredMasterBook({
    bookId: "BK100",
    bytes: bookFromRawRows([multibyte]),
  });
  if (!multibyteBook.ok || multibyteBook.records.length !== 1) {
    errors.push("valid UTF-8 multibyte rejected");
  } else if (multibyteBook.records[0].fields[4] !== "San José") {
    errors.push("multibyte field value");
  } else if (multibyteBook.records[0].rawLogicalFingerprint !== sha256(multibyte)) {
    errors.push("multibyte fingerprint");
  }

  const saleBook = parseSecuredMasterBook({
    bookId: "BK100",
    bytes: bookBytes([
      headerLine(),
      synthRow({ FolioKey: "209010681", SaleDate: "062023" }),
      synthRow({ FolioKey: "209010682", SaleDate: "10012020" }),
    ]),
  });
  if (!saleBook.ok || saleBook.records.length !== 2 || saleBook.rejects.length !== 0) {
    errors.push("SaleDate compatibility changed");
  } else if (saleBook.records[0].fields[34] !== "062023" || saleBook.records[1].fields[34] !== "10012020") {
    errors.push("SaleDate verbatim changed");
  }

  const city = baseFieldParts({ MailingCity: "PHOENIX", FolioKey: "209010680" });
  insertByte(city, "MailingCity", 5, 0xc9);
  assertEncodingReject(errors, "0xC9 MailingCity", joinRawFields(city), "MailingCity", {
    expectFolio: "209010680",
  });

  const owner = baseFieldParts({ FolioKey: "209010683" });
  insertByte(owner, "OwnerName", 0, 0xa0);
  assertEncodingReject(errors, "0xA0 OwnerName", joinRawFields(owner), "OwnerName", {
    expectFolio: "209010683",
  });

  const mail = baseFieldParts({ MailingAddress1: "123 MAIN", FolioKey: "209010684" });
  insertByte(mail, "MailingAddress1", 8, 0xdf);
  assertEncodingReject(errors, "0xDF MailingAddress1", joinRawFields(mail), "MailingAddress1", {
    expectFolio: "209010684",
  });

  const cityD4 = baseFieldParts({ MailingCity: "PHOENIX", FolioKey: "209010685" });
  insertByte(cityD4, "MailingCity", 1, 0xd4);
  assertEncodingReject(errors, "0xD4 MailingCity", joinRawFields(cityD4), "MailingCity", {
    expectFolio: "209010685",
  });

  const folio = baseFieldParts({ FolioKey: "209010686" });
  insertByte(folio, "FolioKey", 3, 0xc9);
  assertEncodingReject(errors, "FolioKey", joinRawFields(folio), "FolioKey");

  for (const fieldName of ["SitusAddress", "SitusCity", "SitusPostalCode", "PUC"]) {
    const parts = baseFieldParts({ FolioKey: "209010687" });
    insertByte(parts, fieldName, 0, 0x81);
    assertEncodingReject(errors, fieldName, joinRawFields(parts), fieldName, {
      expectFolio: "209010687",
    });
  }

  const unknown = baseFieldParts({ MailingCity: "PHOENIX", FolioKey: "209010688" });
  insertByte(unknown, "MailingCity", 2, 0x81);
  assertEncodingReject(errors, "0x81", joinRawFields(unknown), "MailingCity", {
    expectFolio: "209010688",
  });

  const multi = baseFieldParts({ MailingCity: "PHOENIX", FolioKey: "209010689" });
  insertByte(multi, "OwnerName", 0, 0xa0);
  insertByte(multi, "MailingCity", 5, 0xc9);
  const multiRaw = joinRawFields(multi);
  const multiBook = parseSecuredMasterBook({
    bookId: "BK100",
    bytes: bookFromRawRows([multiRaw]),
  });
  const multiRejects = encodingRejects(multiBook);
  if (multiBook.records.length !== 0) errors.push("multiple-byte record accepted");
  if (multiRejects.length !== 2) errors.push(`multiple-byte rejects=${multiRejects.length}`);
  if (multiRejects.map((row) => row.field).join("|") !== "OwnerName|MailingCity") {
    errors.push(`multiple-byte fields=${multiRejects.map((row) => row.field).join("|")}`);
  }
  if (multiRejects.some((row) => row.logicalIndex !== 1 || row.rawLogicalFingerprint !== sha256(multiRaw))) {
    errors.push("multiple-byte trace");
  }
  if (multiRejects.some((row) => row.folioKey !== "209010689")) errors.push("multiple-byte folio");
  if (containsReplacementChar(multiBook)) errors.push("multiple-byte U+FFFD");

  const header = Buffer.from(headerLine(), "utf8");
  header[3] = 0xc9;
  const headerBook = parseSecuredMasterBook({
    bookId: "BK100",
    bytes: Buffer.concat([header, Buffer.from("\r\n"), joinRawFields(baseFieldParts()), Buffer.from("\r\n")]),
  });
  if (headerBook.ok || headerBook.code !== CODE_ENCODING_REJECTED || headerBook.severity !== "FILE_REJECTED") {
    errors.push(`header code=${headerBook.code} severity=${headerBook.severity}`);
  }
  if (headerBook.records.length !== 0 || headerBook.rejects.length !== 0) {
    errors.push("header produced records or record rejects");
  }

  const wide = baseFieldParts();
  insertByte(wide, "MailingCity", 0, 0xc9);
  const wideRaw = Buffer.concat([joinRawFields(wide), Buffer.from("|EXTRA")]);
  const wideBook = parseSecuredMasterBook({
    bookId: "BK100",
    bytes: bookFromRawRows([wideRaw]),
  });
  if (!wideBook.ok) errors.push("malformed field count file-rejected");
  if (wideBook.records.length !== 0) errors.push("malformed field count accepted");
  if (!wideBook.rejects.some((row) => row.code === CODE_FIELD_COUNT_INVALID)) {
    errors.push("malformed field count lost FIELD_COUNT_INVALID");
  }
  if (wideBook.rejects.some((row) => row.code === CODE_SOURCE_RECORD_ENCODING_REJECTED)) {
    errors.push("malformed field count became encoding reject");
  }

  const goodRaw = joinRawFields(baseFieldParts({ FolioKey: "209010690" }));
  const badParts = baseFieldParts({ FolioKey: "209010691", MailingCity: "PHOENIX" });
  insertByte(badParts, "MailingCity", 5, 0xc9);
  const mixed = parseSecuredMasterBook({
    bookId: "BK100",
    bytes: bookFromRawRows([goodRaw, joinRawFields(badParts)]),
  });
  if (!mixed.ok || mixed.records.length !== 1 || mixed.records[0].folioKey !== "209010690") {
    errors.push("mixed book did not keep the clean record");
  } else if (Object.keys(mixed.records[0]).join("|") !== ACCEPTED_RECORD_KEYS.join("|")) {
    errors.push("mixed accepted keys");
  } else {
    const adapted = adaptSecuredMasterRecordToAsrPayload({
      record: mixed.records[0],
      taxYearMetadata: { assessedYear: 2027 },
    });
    if (!adapted.ok || adapted.accessMode !== "BULK_SNAPSHOT") errors.push(`adapter ${adapted.reason}`);
    else {
      const schema = validatePayloadAgainstSchema(SCHEMA_ASR_MC_V1, adapted.payload);
      if (!schema.ok) errors.push(`schema ${schema.reason}`);
      if (adapted.payload.assessedYear !== 2027) errors.push("assessed year");
    }
  }
  if (encodingRejects(mixed).length !== 1 || encodingRejects(mixed)[0].folioKey !== "209010691") {
    errors.push("mixed encoding reject missing");
  }
  if (containsReplacementChar(mixed)) errors.push("mixed U+FFFD");

  return errors.length ? fail("T15", errors) : pass("T15");
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
      t14SaleDateDefectCompatibility(),
      t15RecordEncodingReject(),
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

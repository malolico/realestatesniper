/**
 * SP11-P1 — Maricopa Secured Master offline bulk parser (CB-02)
 * Deterministic · fail-closed · no LIVE · no network · no vault required.
 */

import { createHash } from "node:crypto";
import {
  SECURED_MASTER_ACCESS_MODE,
  SECURED_MASTER_BOOK_FILES,
  SECURED_MASTER_DATASET,
  SECURED_MASTER_EXPECTED_HEADER_FIELDS,
  SECURED_MASTER_FIELD_COUNT,
  SECURED_MASTER_ORGANISM_ID,
  isKnownSecuredMasterBookId,
} from "./securedMasterSnapshotContract.js";

export const SEVERITY_SOURCE_RECORD_REJECTED = "SOURCE_RECORD_REJECTED";
export const SEVERITY_FILE_REJECTED = "FILE_REJECTED";
export const SEVERITY_SNAPSHOT_REJECTED = "SNAPSHOT_REJECTED";

export const CODE_HEADER_MISMATCH = "HEADER_MISMATCH";
export const CODE_BOOK_FILE_UNEXPECTED = "BOOK_FILE_UNEXPECTED";
export const CODE_ENCODING_REJECTED = "ENCODING_REJECTED";
export const CODE_SOURCE_RECORD_ENCODING_REJECTED = "SOURCE_RECORD_ENCODING_REJECTED";
export const CODE_FIELD_COUNT_INVALID = "FIELD_COUNT_INVALID";
export const CODE_BK500_RECONSTRUCTION_FAILED = "BK500_RECONSTRUCTION_FAILED";
export const CODE_EMPTY_FOLIO_KEY = "EMPTY_FOLIO_KEY";
export const CODE_UNEXPECTED_HEADER_ROW = "UNEXPECTED_HEADER_ROW";
export const CODE_DATE_PARSE_FAILED = "DATE_PARSE_FAILED";
export const CODE_NUMERIC_PARSE_FAILED = "NUMERIC_PARSE_FAILED";
export const CODE_BYTES_REQUIRED = "BYTES_REQUIRED";

/**
 * @param {Buffer|Uint8Array|string} bytes
 * @returns {{ ok: true, buffer: Buffer } | { ok: false, reason: string }}
 */
function toBuffer(bytes) {
  if (Buffer.isBuffer(bytes)) return { ok: true, buffer: bytes };
  if (bytes instanceof Uint8Array) return { ok: true, buffer: Buffer.from(bytes) };
  if (typeof bytes === "string") return { ok: true, buffer: Buffer.from(bytes, "utf8") };
  return { ok: false, reason: CODE_BYTES_REQUIRED };
}

const strictUtf8Decoder = new TextDecoder("utf-8", { fatal: true });

/**
 * Strict UTF-8 decode. Invalid sequences throw and never become U+FFFD.
 * @param {Buffer} buffer
 * @returns {{ ok: true, text: string } | { ok: false }}
 */
function decodeUtf8Strict(buffer) {
  try {
    return { ok: true, text: strictUtf8Decoder.decode(buffer) };
  } catch {
    return { ok: false };
  }
}

/**
 * Split into physical lines with EOL classification.
 * @param {Buffer} buffer
 * @returns {{ lineNo: number, content: Buffer, eol: "CRLF"|"LF"|"CR"|"NONE" }[]}
 */
function splitPhysicalLines(buffer) {
  /** @type {{ lineNo: number, content: Buffer, eol: "CRLF"|"LF"|"CR"|"NONE" }[]} */
  const lines = [];
  let i = 0;
  let lineNo = 1;
  const n = buffer.length;
  while (i < n) {
    const start = i;
    while (i < n && buffer[i] !== 10 && buffer[i] !== 13) i += 1;
    const content = buffer.subarray(start, i);
    let eol = "NONE";
    if (i < n) {
      if (buffer[i] === 13) {
        if (i + 1 < n && buffer[i + 1] === 10) {
          eol = "CRLF";
          i += 2;
        } else {
          eol = "CR";
          i += 1;
        }
      } else if (buffer[i] === 10) {
        eol = "LF";
        i += 1;
      }
    }
    lines.push({ lineNo, content, eol });
    lineNo += 1;
  }
  return lines;
}

/**
 * @param {Buffer} content
 */
function fieldCount(content) {
  if (content.length === 0) return 0;
  let pipes = 0;
  for (let i = 0; i < content.length; i += 1) {
    if (content[i] === 0x7c) pipes += 1;
  }
  return pipes + 1;
}

/**
 * Split a logical row on the raw pipe byte. The delimiter is not decoded.
 * @param {Buffer} content
 * @returns {Buffer[]}
 */
function splitRawFields(content) {
  /** @type {Buffer[]} */
  const fields = [];
  let start = 0;
  for (let i = 0; i < content.length; i += 1) {
    if (content[i] === 0x7c) {
      fields.push(content.subarray(start, i));
      start = i + 1;
    }
  }
  fields.push(content.subarray(start));
  return fields;
}

/**
 * Strict field text for one logical row.
 * A successful result is 39 authoritative UTF-8 strings.
 * A failure names every invalid field in index order and keeps folioKey
 * only when field 0 itself decodes. One invalid field produces one reject
 * later, so additional failures stay visible without a second collection.
 * @param {Buffer} rawLogical
 * @returns {{ ok: true, fields: string[] } | { ok: false, failedFields: string[], folioKey?: string }}
 */
function decodeLogicalFields(rawLogical) {
  const whole = decodeUtf8Strict(rawLogical);
  if (whole.ok) {
    return { ok: true, fields: whole.text.split("|") };
  }

  const slices = splitRawFields(rawLogical);
  /** @type {string[]} */
  const failedFields = [];
  let folioDecoded = false;
  let folioKey = "";
  for (let index = 0; index < slices.length; index += 1) {
    const decoded = decodeUtf8Strict(slices[index]);
    if (!decoded.ok) {
      failedFields.push(SECURED_MASTER_EXPECTED_HEADER_FIELDS[index] ?? `field_${index}`);
      continue;
    }
    if (index === 0) {
      folioDecoded = true;
      folioKey = decoded.text.trim();
    }
  }

  if (folioDecoded) return { ok: false, failedFields, folioKey };
  return { ok: false, failedFields };
}

/**
 * @param {Buffer} raw
 */
function fingerprintRaw(raw) {
  return createHash("sha256").update(raw).digest("hex");
}

/**
 * @param {string} s
 */
export function isValidDeedDate(s) {
  if (s === "") return true;
  if (!/^\d{8}$/.test(s)) return false;
  const mm = Number(s.slice(0, 2));
  const dd = Number(s.slice(2, 4));
  const yyyy = Number(s.slice(4, 8));
  if (mm < 1 || mm > 12 || dd < 1 || dd > 31 || yyyy < 1900 || yyyy > 2100) return false;
  return true;
}

/**
 * SaleDate format MMYYYY (6 digits) per official File Spec.
 * @param {string} s
 */
export function isValidSaleDate(s) {
  if (s === "") return true;
  if (!/^\d{6}$/.test(s)) return false;
  const mm = Number(s.slice(0, 2));
  const yyyy = Number(s.slice(2, 6));
  if (mm < 1 || mm > 12 || yyyy < 1900 || yyyy > 2100) return false;
  return true;
}

/**
 * Secured Master interim source defect only: MM01YYYY.
 * Characters 3–4 are the artificial default and are not a sale day.
 * @param {string} s
 */
function isSecuredMasterDefectMm01Yyyy(s) {
  if (!/^\d{2}01\d{4}$/.test(s)) return false;
  const mm = Number(s.slice(0, 2));
  const yyyy = Number(s.slice(4, 8));
  if (mm < 1 || mm > 12 || yyyy < 1900 || yyyy > 2100) return false;
  return true;
}

/**
 * Blank optional numeric must remain null — never 0.
 * @param {string} s
 * @returns {null|number|{ error: string }}
 */
export function parseOptionalNumeric(s) {
  if (s === "" || s == null) return null;
  if (!/^-?\d+(\.\d+)?$/.test(s)) return { error: CODE_NUMERIC_PARSE_FAILED };
  return Number(s);
}

/**
 * @param {{
 *   bookId: string,
 *   bytes: Buffer|Uint8Array|string,
 *   sourcePath?: string|null,
 * }} input
 */
export function parseSecuredMasterBook(input = {}) {
  const bookId = input.bookId;
  if (!isKnownSecuredMasterBookId(bookId)) {
    return Object.freeze({
      ok: false,
      severity: SEVERITY_FILE_REJECTED,
      code: CODE_BOOK_FILE_UNEXPECTED,
      bookId: bookId ?? null,
      records: Object.freeze([]),
      rejects: Object.freeze([]),
    });
  }

  const bufRes = toBuffer(input.bytes);
  if (!bufRes.ok) {
    return Object.freeze({
      ok: false,
      severity: SEVERITY_FILE_REJECTED,
      code: CODE_BYTES_REQUIRED,
      bookId,
      records: Object.freeze([]),
      rejects: Object.freeze([]),
    });
  }

  // Line splits, field counts, and fingerprints stay on the original bytes.
  // Strict UTF-8 is applied to the header and to each logical field.
  const physical = splitPhysicalLines(bufRes.buffer);
  if (physical.length === 0) {
    return Object.freeze({
      ok: false,
      severity: SEVERITY_FILE_REJECTED,
      code: CODE_HEADER_MISMATCH,
      bookId,
      records: Object.freeze([]),
      rejects: Object.freeze([]),
    });
  }

  const headerLine = physical[0];
  const headerDecoded = decodeUtf8Strict(headerLine.content);
  if (!headerDecoded.ok) {
    return Object.freeze({
      ok: false,
      severity: SEVERITY_FILE_REJECTED,
      code: CODE_ENCODING_REJECTED,
      bookId,
      records: Object.freeze([]),
      rejects: Object.freeze([]),
    });
  }
  const headerFields = headerDecoded.text.split("|");
  const headerOk =
    headerFields.length === SECURED_MASTER_FIELD_COUNT &&
    headerFields.every((name, i) => name === SECURED_MASTER_EXPECTED_HEADER_FIELDS[i]);

  if (!headerOk) {
    return Object.freeze({
      ok: false,
      severity: SEVERITY_FILE_REJECTED,
      code: CODE_HEADER_MISMATCH,
      bookId,
      expectedFileName: SECURED_MASTER_BOOK_FILES[bookId],
      records: Object.freeze([]),
      rejects: Object.freeze([]),
    });
  }

  /** @type {object[]} */
  const records = [];
  /** @type {object[]} */
  const rejects = [];
  let logicalIndex = 0;
  let i = 1;

  while (i < physical.length) {
    const cur = physical[i];

    // Skip completely empty trailing NONE line only if truly empty with no EOL content — keep empty content as reject later
    const curCount = fieldCount(cur.content);

    // Duplicate header detection. Invalid UTF-8 is not a header match.
    /** @type {ReturnType<typeof decodeLogicalFields> | null} */
    let prepared = null;
    if (curCount === SECURED_MASTER_FIELD_COUNT) {
      prepared = decodeLogicalFields(cur.content);
      if (
        prepared.ok &&
        prepared.fields.length === SECURED_MASTER_FIELD_COUNT &&
        prepared.fields.every((name, idx) => name === SECURED_MASTER_EXPECTED_HEADER_FIELDS[idx])
      ) {
        return Object.freeze({
          ok: false,
          severity: SEVERITY_FILE_REJECTED,
          code: CODE_UNEXPECTED_HEADER_ROW,
          bookId,
          records: Object.freeze(records),
          rejects: Object.freeze(rejects),
        });
      }
    }

    let rawLogical = cur.content;
    let physicalLineStart = cur.lineNo;
    let physicalLineEnd = cur.lineNo;
    let reconstructedFromEmbeddedLf = false;
    let consume = 1;

    if (curCount > 0 && curCount < SECURED_MASTER_FIELD_COUNT) {
      // Bounded BK500 reconstruction
      if (cur.eol === "LF" && i + 1 < physical.length) {
        const next = physical[i + 1];
        const concat = Buffer.concat([cur.content, next.content]);
        const concatCount = fieldCount(concat);
        if (concatCount === SECURED_MASTER_FIELD_COUNT) {
          rawLogical = concat;
          physicalLineEnd = next.lineNo;
          reconstructedFromEmbeddedLf = true;
          consume = 2;
        } else {
          logicalIndex += 1;
          rejects.push(
            Object.freeze({
              severity: SEVERITY_SOURCE_RECORD_REJECTED,
              code: CODE_BK500_RECONSTRUCTION_FAILED,
              logicalIndex,
              physicalLineStart: cur.lineNo,
              physicalLineEnd: next.lineNo,
              fieldCount: concatCount,
            })
          );
          i += 2;
          continue;
        }
      } else {
        logicalIndex += 1;
        rejects.push(
          Object.freeze({
            severity: SEVERITY_SOURCE_RECORD_REJECTED,
            code: CODE_FIELD_COUNT_INVALID,
            logicalIndex,
            physicalLineStart: cur.lineNo,
            physicalLineEnd: cur.lineNo,
            fieldCount: curCount,
          })
        );
        i += 1;
        continue;
      }
    } else if (curCount === 0) {
      // empty physical line — reject as field count invalid
      logicalIndex += 1;
      rejects.push(
        Object.freeze({
          severity: SEVERITY_SOURCE_RECORD_REJECTED,
          code: CODE_FIELD_COUNT_INVALID,
          logicalIndex,
          physicalLineStart: cur.lineNo,
          physicalLineEnd: cur.lineNo,
          fieldCount: 0,
        })
      );
      i += 1;
      continue;
    } else if (curCount !== SECURED_MASTER_FIELD_COUNT) {
      logicalIndex += 1;
      rejects.push(
        Object.freeze({
          severity: SEVERITY_SOURCE_RECORD_REJECTED,
          code: CODE_FIELD_COUNT_INVALID,
          logicalIndex,
          physicalLineStart: cur.lineNo,
          physicalLineEnd: cur.lineNo,
          fieldCount: curCount,
        })
      );
      i += 1;
      continue;
    }

    const decoded = prepared !== null && rawLogical === cur.content
      ? prepared
      : decodeLogicalFields(rawLogical);
    logicalIndex += 1;

    if (!decoded.ok) {
      const rawLogicalFingerprint = fingerprintRaw(rawLogical);
      for (const fieldName of decoded.failedFields) {
        /** @type {Record<string, unknown>} */
        const reject = {
          severity: SEVERITY_SOURCE_RECORD_REJECTED,
          code: CODE_SOURCE_RECORD_ENCODING_REJECTED,
          logicalIndex,
          physicalLineStart,
          physicalLineEnd,
          field: fieldName,
          rawLogicalFingerprint,
        };
        if (Object.prototype.hasOwnProperty.call(decoded, "folioKey")) {
          reject.folioKey = decoded.folioKey;
        }
        rejects.push(Object.freeze(reject));
      }
      i += consume;
      continue;
    }

    const fields = decoded.fields;

    if (fields.length !== SECURED_MASTER_FIELD_COUNT) {
      rejects.push(
        Object.freeze({
          severity: SEVERITY_SOURCE_RECORD_REJECTED,
          code: CODE_FIELD_COUNT_INVALID,
          logicalIndex,
          physicalLineStart,
          physicalLineEnd,
          fieldCount: fields.length,
        })
      );
      i += consume;
      continue;
    }

    const folioKey = fields[0] ?? "";
    if (!folioKey.trim()) {
      rejects.push(
        Object.freeze({
          severity: SEVERITY_SOURCE_RECORD_REJECTED,
          code: CODE_EMPTY_FOLIO_KEY,
          logicalIndex,
          physicalLineStart,
          physicalLineEnd,
        })
      );
      i += consume;
      continue;
    }

    const deedDate = fields[14] ?? "";
    const saleDate = fields[34] ?? "";
    if (!isValidDeedDate(deedDate)) {
      rejects.push(
        Object.freeze({
          severity: SEVERITY_SOURCE_RECORD_REJECTED,
          code: CODE_DATE_PARSE_FAILED,
          field: "DeedDate",
          logicalIndex,
          physicalLineStart,
          physicalLineEnd,
        })
      );
      i += consume;
      continue;
    }
    if (!isValidSaleDate(saleDate) && !isSecuredMasterDefectMm01Yyyy(saleDate)) {
      rejects.push(
        Object.freeze({
          severity: SEVERITY_SOURCE_RECORD_REJECTED,
          code: CODE_DATE_PARSE_FAILED,
          field: "SaleDate",
          logicalIndex,
          physicalLineStart,
          physicalLineEnd,
        })
      );
      i += consume;
      continue;
    }

    // Optional numeric blanks stay null (never 0). Non-blank invalid → reject.
    const numericIndexes = [16, 17, 18, 19, 20, 21, 29, 30, 33, 37];
    let numericFail = null;
    /** @type {Record<string, number|null>} */
    const optionalNumerics = {};
    for (const idx of numericIndexes) {
      const name = SECURED_MASTER_EXPECTED_HEADER_FIELDS[idx];
      const parsed = parseOptionalNumeric(fields[idx] ?? "");
      if (parsed && typeof parsed === "object" && parsed.error) {
        numericFail = name;
        break;
      }
      optionalNumerics[name] = parsed;
    }
    if (numericFail) {
      rejects.push(
        Object.freeze({
          severity: SEVERITY_SOURCE_RECORD_REJECTED,
          code: CODE_NUMERIC_PARSE_FAILED,
          field: numericFail,
          logicalIndex,
          physicalLineStart,
          physicalLineEnd,
        })
      );
      i += consume;
      continue;
    }

    records.push(
      Object.freeze({
        logicalIndex,
        physicalLineStart,
        physicalLineEnd,
        fields: Object.freeze([...fields]),
        folioKey: folioKey.trim(),
        reconstructedFromEmbeddedLf,
        rawLogicalFingerprint: fingerprintRaw(rawLogical),
        optionalNumerics: Object.freeze(optionalNumerics),
        provenance: Object.freeze({
          organismId: SECURED_MASTER_ORGANISM_ID,
          dataset: SECURED_MASTER_DATASET,
          accessMode: SECURED_MASTER_ACCESS_MODE,
          bookId,
          sourcePath: input.sourcePath ?? null,
          expectedFileName: SECURED_MASTER_BOOK_FILES[bookId],
        }),
      })
    );

    i += consume;
  }

  return Object.freeze({
    ok: true,
    severity: null,
    code: null,
    bookId,
    expectedFileName: SECURED_MASTER_BOOK_FILES[bookId],
    header: SECURED_MASTER_EXPECTED_HEADER_FIELDS,
    records: Object.freeze(records),
    rejects: Object.freeze(rejects),
    provenance: Object.freeze({
      organismId: SECURED_MASTER_ORGANISM_ID,
      dataset: SECURED_MASTER_DATASET,
      accessMode: SECURED_MASTER_ACCESS_MODE,
      bookId,
      sourcePath: input.sourcePath ?? null,
      recordCount: records.length,
      rejectCount: rejects.length,
    }),
  });
}

/**
 * @param {{ books: { bookId: string, bytes: Buffer|Uint8Array|string, sourcePath?: string|null }[] }} input
 */
export function parseSecuredMasterSnapshot(input = {}) {
  const books = Array.isArray(input.books) ? input.books : [];
  if (books.length === 0) {
    return Object.freeze({
      ok: false,
      severity: SEVERITY_SNAPSHOT_REJECTED,
      code: CODE_BOOK_FILE_UNEXPECTED,
      books: Object.freeze([]),
    });
  }

  const results = books.map((b) => parseSecuredMasterBook(b));
  const anyFileReject = results.some((r) => r.ok === false);
  return Object.freeze({
    ok: !anyFileReject,
    severity: anyFileReject ? SEVERITY_SNAPSHOT_REJECTED : null,
    books: Object.freeze(results),
  });
}

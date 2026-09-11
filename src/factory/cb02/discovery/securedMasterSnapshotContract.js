/**
 * SP11-P1 — Maricopa Secured Master BULK_SNAPSHOT contract (CB-02)
 * Offline identity + physical header/book constants + tax-year metadata gate.
 * No LIVE. No network. No schema mutation.
 */

export const SECURED_MASTER_ORGANISM_ID = "ORG-ASR-MC";
export const SECURED_MASTER_FAMILY_ID = "REGISTRAL_ASSESSOR";
export const SECURED_MASTER_DATASET = "Secured_Master";
export const SECURED_MASTER_ACCESS_MODE = "BULK_SNAPSHOT";
export const SECURED_MASTER_FIELD_COUNT = 39;

export const SECURED_MASTER_EXPECTED_HEADER_FIELDS = Object.freeze([
  "FolioKey",
  "OwnerName",
  "MailingAddress1",
  "MailingAddress2",
  "MailingCity",
  "MailingState",
  "MailingPostalCode",
  "MailingCountry",
  "SitusAddress",
  "SitusUnitNumber",
  "SitusCity",
  "SitusPostalCode",
  "PropertyType",
  "DeedNumber",
  "DeedDate",
  "DeedType",
  "LandValue",
  "ImprovementValue",
  "FCV",
  "AssessedFCV",
  "LPV",
  "AssessedLPV",
  "PUC",
  "Lot",
  "Parcel_Block",
  "Parcel_Tract",
  "LandClass",
  "ImprvClass",
  "RentalInd",
  "LivingArea",
  "TotalSqFt",
  "ConstrYear",
  "PoolSize",
  "SalePrice",
  "SaleDate",
  "MCR_Key",
  "MCR_Name",
  "NumUnits",
  "TaxAreaCode",
]);

/** @type {Readonly<Record<string, string>>} */
export const SECURED_MASTER_BOOK_FILES = Object.freeze({
  BK100: "Secured_Master_BK100.txt",
  BK200: "Secured_Master_BK200.txt",
  BK300: "Secured_Master_BK300.txt",
  BK400: "Secured_Master_BK400.txt",
  BK500: "Secured_Master_BK500.txt",
});

export const TAX_YEAR_METADATA_REQUIRED = "assessed_year_metadata_required";
export const TAX_YEAR_METADATA_INVALID = "assessed_year_metadata_invalid";

/**
 * Explicit tax/assessment year only. Never derive from snapshot/acquisition dates.
 *
 * @param {unknown} meta
 * @returns {{ ok: true, assessedYear: number } | { ok: false, reason: string }}
 */
export function validateExplicitTaxYearMetadata(meta) {
  if (meta == null || typeof meta !== "object" || Array.isArray(meta)) {
    return { ok: false, reason: TAX_YEAR_METADATA_REQUIRED };
  }

  const raw =
    meta.assessedYear ?? meta.taxYear ?? meta.assessmentYear ?? meta.year ?? null;

  if (raw === undefined || raw === null || raw === "") {
    return { ok: false, reason: TAX_YEAR_METADATA_REQUIRED };
  }

  let year;
  if (typeof raw === "number" && Number.isInteger(raw)) {
    year = raw;
  } else if (typeof raw === "string" && /^\d{4}$/.test(raw.trim())) {
    year = Number(raw.trim());
  } else {
    return { ok: false, reason: TAX_YEAR_METADATA_INVALID };
  }

  // Bounded sanity only — not a derivation from calendar/snapshot date.
  if (year < 1900 || year > 2100) {
    return { ok: false, reason: TAX_YEAR_METADATA_INVALID };
  }

  return { ok: true, assessedYear: year };
}

/**
 * @param {string} bookId
 */
export function isKnownSecuredMasterBookId(bookId) {
  return Object.prototype.hasOwnProperty.call(SECURED_MASTER_BOOK_FILES, bookId);
}

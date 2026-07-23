/**
 * II.3-IMPL — map II.2 validation failures to eligibility reason codes.
 */

import { ELIGIBILITY_REASON_CODES } from "./constants.js";

/**
 * @param {string} errorText
 * @returns {string} reason code from ELIGIBILITY_REASON_CODES
 */
export function mapIi2ErrorToReasonCode(errorText) {
  const e = String(errorText || "");
  if (/SNAPSHOT_STALE/i.test(e)) return "STALE_WITHOUT_SNAPSHOT_STALE";
  if (/ownership\.registry|registryObservation/i.test(e)) {
    return "OWNERSHIP_REGISTRY_INCOHERENT";
  }
  if (/Unknown field|Prohibited field|contractName|records|RECORDS_TRUNCATED/i.test(e)) {
    return "UNKNOWN_OR_PROHIBITED_FIELD";
  }
  if (/contractId|schemaVersion|mode must|dataClassification/i.test(e)) {
    return "CONTRACT_IDENTITY_INVALID";
  }
  if (/checksum|integrity/i.test(e)) return "INTEGRITY_OR_CHECKSUM_FAILED";
  if (/MAX_|depth|quota|PAYLOAD/i.test(e)) return "QUOTA_OR_DEPTH_EXCEEDED";
  // Narrowed from /warning/i (II.3-IMPL.1): match II.2 catalog/phase wording only.
  if (
    /phase id|approved catalog|warnings\[|warnings exceed|NOT_IN_CATALOG/i.test(
      e
    )
  ) {
    return "PHASE_OR_WARNING_CATALOG_FAILED";
  }
  return "UNSPECIFIED_II2_FAILURE";
}

/**
 * @param {string[]} errors
 * @returns {{ code: string, message: string }[]}
 */
export function buildReasonsFromIi2Errors(errors) {
  const list = Array.isArray(errors) ? errors : [];
  if (list.length === 0) {
    return [
      {
        code: "II2_GATE_REJECTED",
        message: "II.2 gate rejected candidate without detailed errors",
      },
    ];
  }
  return list.map((message) => {
    const code = mapIi2ErrorToReasonCode(message);
    return {
      code: ELIGIBILITY_REASON_CODES.includes(code)
        ? code
        : "UNSPECIFIED_II2_FAILURE",
      message: sanitizeReasonMessage(message),
    };
  });
}

/**
 * @param {string} message
 * @returns {string}
 */
export function sanitizeReasonMessage(message) {
  const text = String(message || "validation failed");
  // Bound and strip obvious secret-like / path-like fragments for eligibility reporting.
  return text
    .replace(/(?:sk_live_|sk_test_|Bearer\s+\S+)/gi, "[REDACTED]")
    .replace(/[A-Za-z]:\\[^\s]+/g, "[PATH]")
    .replace(/\/(?:Users|home)\/[^\s]+/g, "[PATH]")
    .slice(0, 512);
}

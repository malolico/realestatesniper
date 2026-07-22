/**
 * CB-02 — Prohibited sources FP-01..FP-10 (DSO §VI)
 */

export const PROHIBITED_SOURCE_FLAGS = Object.freeze({
  "FP-01": "purchased_contact_list_no_consent",
  "FP-02": "scraping_tos_violation",
  "FP-03": "impersonation_fraud",
  "FP-04": "no_chain_of_custody",
  "FP-05": "recording_without_consent",
  "FP-06": "pii_out_of_scope",
  "FP-07": "known_falsified_source",
  "FP-08": "dark_web_breach_data",
  "FP-09": "aggressive_skip_trace_illegal",
  "FP-10": "inference_as_fact",
});

export const PROHIBITED_FLAG_CODES = Object.freeze(Object.keys(PROHIBITED_SOURCE_FLAGS));

/**
 * @param {string[]} flags
 * @returns {{ prohibited: boolean, codes: string[] }}
 */
export function detectProhibitedFlags(flags = []) {
  const codes = flags.filter((f) => PROHIBITED_FLAG_CODES.includes(f));
  return { prohibited: codes.length > 0, codes };
}

/**
 * @param {string} flagCode
 */
export function getProhibitedReason(flagCode) {
  return PROHIBITED_SOURCE_FLAGS[flagCode] ?? "unknown_prohibition";
}

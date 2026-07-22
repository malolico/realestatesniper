/**
 * CB-02 — Low-confidence source labels FL-01..FL-08 (DSO §VII)
 */

export const LOW_CONFIDENCE_FLAGS = Object.freeze({
  "FL-01": "unverified_social_signal",
  "FL-02": "avm_undisclosed_methodology",
  "FL-03": "crowdsourced_crime_map",
  "FL-04": "owner_verbal_unrecorded",
  "FL-05": "blog_forum_sentiment",
  "FL-06": "zestimate_type_unreconciled",
  "FL-07": "stale_mls_photo",
  "FL-08": "aggregator_no_sla_lineage",
});

export const LOW_CONFIDENCE_CODES = Object.freeze(Object.keys(LOW_CONFIDENCE_FLAGS));

/**
 * @param {string[]} flags
 */
export function labelLowConfidence(flags = []) {
  const codes = flags.filter((f) => LOW_CONFIDENCE_CODES.includes(f));
  return {
    lowConfidence: codes.length > 0,
    codes,
    maxConfidence: codes.length > 0 ? "C3" : null,
  };
}

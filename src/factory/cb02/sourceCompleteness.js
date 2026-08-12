/**
 * PS05-03 — Minimum Decision-relevant source completeness (bounded ASR/GIS/RCR).
 * Presence alone ≠ CHECKED unless execution evidence supports it.
 */

export const SOURCE_COMPLETENESS_STATUS = Object.freeze({
  EXPECTED: "EXPECTED",
  CHECKED: "CHECKED",
  NOT_CHECKED: "NOT_CHECKED",
  FAILED: "FAILED",
  UNAVAILABLE: "UNAVAILABLE",
  PROHIBITED: "PROHIBITED",
  STALE: "STALE",
});

/** Bounded source classes for current Factory handoff. */
export const BOUNDED_SOURCE_CLASSES = Object.freeze([
  Object.freeze({
    sourceClass: "REGISTRAL_ASSESSOR",
    organismId: "ORG-ASR-MC",
  }),
  Object.freeze({
    sourceClass: "GIS_OFFICIAL",
    organismId: "ORG-GIS-MC",
  }),
  Object.freeze({
    sourceClass: "REGISTRAL_RECORDER",
    organismId: "ORG-RCR-MC",
  }),
]);

/**
 * @param {{
 *   payloadsByOrganism?: Record<string, object>|null,
 *   sourceRefsByOrganism?: Record<string, object>|null,
 *   unavailableOrganisms?: string[],
 *   failedOrganisms?: string[],
 *   prohibitedOrganisms?: string[],
 *   staleOrganisms?: string[],
 *   notCheckedOrganisms?: string[],
 *   checkedOrganisms?: string[],
 * }} [input]
 */
export function evaluateSourceCompleteness(input = {}) {
  const payloads = input.payloadsByOrganism ?? {};
  const sourceRefs = input.sourceRefsByOrganism ?? {};
  const unavailable = new Set(input.unavailableOrganisms ?? []);
  const failed = new Set(input.failedOrganisms ?? []);
  const prohibited = new Set(input.prohibitedOrganisms ?? []);
  const stale = new Set(input.staleOrganisms ?? []);
  const notChecked = new Set(input.notCheckedOrganisms ?? []);
  const checkedExplicit = new Set(input.checkedOrganisms ?? []);

  const sources = BOUNDED_SOURCE_CLASSES.map(({ sourceClass, organismId }) => {
    let status = SOURCE_COMPLETENESS_STATUS.EXPECTED;
    let reason = "expected_for_bounded_handoff";

    if (prohibited.has(organismId)) {
      status = SOURCE_COMPLETENESS_STATUS.PROHIBITED;
      reason = "source_prohibited";
    } else if (failed.has(organismId)) {
      status = SOURCE_COMPLETENESS_STATUS.FAILED;
      reason = "source_failed";
    } else if (unavailable.has(organismId)) {
      status = SOURCE_COMPLETENESS_STATUS.UNAVAILABLE;
      reason = "source_unavailable";
    } else if (stale.has(organismId) || sourceRefs[organismId]?.freshness?.degraded === true) {
      status = SOURCE_COMPLETENESS_STATUS.STALE;
      reason = "source_stale";
    } else if (notChecked.has(organismId)) {
      status = SOURCE_COMPLETENESS_STATUS.NOT_CHECKED;
      reason = "source_not_checked";
    } else if (
      checkedExplicit.has(organismId) ||
      (sourceRefs[organismId] && payloads[organismId] != null)
    ) {
      // Checked only when SourceRef exists AND payload was loaded (execution evidence).
      status = SOURCE_COMPLETENESS_STATUS.CHECKED;
      reason = "source_ref_and_payload_present";
    } else if (payloads[organismId] != null && !sourceRefs[organismId]) {
      // Payload bag present without SourceRef — not sufficient for CHECKED.
      status = SOURCE_COMPLETENESS_STATUS.NOT_CHECKED;
      reason = "payload_without_source_ref";
    } else if (!(organismId in payloads) && !sourceRefs[organismId]) {
      status = SOURCE_COMPLETENESS_STATUS.NOT_CHECKED;
      reason = "source_absent_from_execution";
    }

    return Object.freeze({
      sourceClass,
      organismId,
      status,
      reason,
      sourceRefId: sourceRefs[organismId]?.id ?? null,
      expected: true,
    });
  });

  const byStatus = Object.fromEntries(
    Object.values(SOURCE_COMPLETENESS_STATUS).map((s) => [
      s,
      sources.filter((x) => x.status === s).length,
    ])
  );

  return Object.freeze({
    schemaId: "rsn.source.completeness.v1",
    sources: Object.freeze(sources),
    byStatus: Object.freeze(byStatus),
    allChecked: sources.every((s) => s.status === SOURCE_COMPLETENESS_STATUS.CHECKED),
    hasGaps: sources.some(
      (s) =>
        s.status !== SOURCE_COMPLETENESS_STATUS.CHECKED &&
        s.status !== SOURCE_COMPLETENESS_STATUS.STALE
    ),
    constitutionalPhase: "PS05-03",
    note: "Bounded Decision-relevant source classes only — not jurisdiction/national exhaustion",
  });
}

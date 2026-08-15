/**
 * PS05-03 — Minimum Decision-relevant source completeness (bounded ASR/GIS/RCR).
 * Presence alone ≠ CHECKED unless execution evidence supports it.
 *
 * SP08-P3: expected organism/source universe is explicit — not a silent Maricopa-only set.
 * CHECKED / availability ≠ EVIDENCE_COMPLETE / COVERAGE_COMPLETE / READY / ACTIVE.
 */

import { getOrganism } from "./sourceOrganismsCatalog.js";

export const SOURCE_COMPLETENESS_STATUS = Object.freeze({
  EXPECTED: "EXPECTED",
  CHECKED: "CHECKED",
  NOT_CHECKED: "NOT_CHECKED",
  FAILED: "FAILED",
  UNAVAILABLE: "UNAVAILABLE",
  PROHIBITED: "PROHIBITED",
  STALE: "STALE",
});

/** Legacy Maricopa-bounded handoff classes (explicit opt-in / documentation only). */
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

const DECISION_SOURCE_FAMILIES = Object.freeze([
  "REGISTRAL_ASSESSOR",
  "GIS_OFFICIAL",
  "REGISTRAL_RECORDER",
]);

/**
 * @param {string} organismId
 * @returns {string}
 */
function sourceClassForOrganism(organismId) {
  const org = getOrganism(organismId);
  const families = Array.isArray(org?.families) ? org.families : [];
  for (const familyId of DECISION_SOURCE_FAMILIES) {
    if (families.includes(familyId)) return familyId;
  }
  if (families.length > 0) return families[0];
  return "UNSPECIFIED";
}

/**
 * Resolve explicit expected source rows (no silent universal MC universe).
 * @param {object} input
 * @returns {readonly { sourceClass: string, organismId: string }[]}
 */
function resolveExpectedSources(input) {
  if (Array.isArray(input.expectedSources) && input.expectedSources.length > 0) {
    return Object.freeze(
      input.expectedSources.map((row) =>
        Object.freeze({
          sourceClass:
            typeof row.sourceClass === "string" && row.sourceClass
              ? row.sourceClass
              : sourceClassForOrganism(row.organismId),
          organismId: row.organismId,
        })
      )
    );
  }
  if (Array.isArray(input.boundedSourceClasses) && input.boundedSourceClasses.length > 0) {
    return Object.freeze(
      input.boundedSourceClasses.map((row) =>
        Object.freeze({
          sourceClass: row.sourceClass,
          organismId: row.organismId,
        })
      )
    );
  }

  const payloads = input.payloadsByOrganism ?? {};
  const sourceRefs = input.sourceRefsByOrganism ?? {};
  const ids = new Set([
    ...Object.keys(payloads),
    ...Object.keys(sourceRefs),
    ...(input.unavailableOrganisms ?? []),
    ...(input.failedOrganisms ?? []),
    ...(input.prohibitedOrganisms ?? []),
    ...(input.staleOrganisms ?? []),
    ...(input.notCheckedOrganisms ?? []),
    ...(input.checkedOrganisms ?? []),
  ]);

  const rows = [...ids]
    .filter((id) => typeof id === "string" && id.trim())
    .sort()
    .map((organismId) =>
      Object.freeze({
        sourceClass: sourceClassForOrganism(organismId),
        organismId,
      })
    );

  return Object.freeze(rows);
}

/**
 * @param {{
 *   payloadsByOrganism?: Record<string, object>|null,
 *   sourceRefsByOrganism?: Record<string, object>|null,
 *   expectedSources?: { sourceClass?: string, organismId: string }[],
 *   boundedSourceClasses?: { sourceClass: string, organismId: string }[],
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

  const expected = resolveExpectedSources(input);

  const sources = expected.map(({ sourceClass, organismId }) => {
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
    allChecked:
      sources.length > 0 &&
      sources.every((s) => s.status === SOURCE_COMPLETENESS_STATUS.CHECKED),
    hasGaps: sources.some(
      (s) =>
        s.status !== SOURCE_COMPLETENESS_STATUS.CHECKED &&
        s.status !== SOURCE_COMPLETENESS_STATUS.STALE
    ),
    constitutionalPhase: "PS05-03",
    note: "Explicit organism/source bindings only — CHECKED ≠ coverage/readiness; not jurisdiction/national exhaustion",
    completenessIsNotCoverage: true,
    checkedIsNotEvidenceComplete: true,
  });
}

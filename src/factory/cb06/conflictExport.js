/**
 * PS05-03 — Thin conflict export for Decision-facing handoff.
 * Does not rewrite MotEvd02; surfaces OPEN / resolved-with-authority conflicts.
 */

import { CONFLICT_STATE } from "../cb02/decisionFactEnvelope.js";
import { assertNoAveraging } from "../cb02/conflictRules.js";

/**
 * Normalize MotEvd02 / registry conflict records into a Decision-facing slice.
 *
 * @param {object[]} [conflicts]
 */
export function exportConflicts(conflicts = []) {
  assertNoAveraging("HIERARCHY");

  const items = (conflicts ?? []).map((c) => {
    const status =
      c.status === "OPEN"
        ? CONFLICT_STATE.OPEN
        : c.status === "RESOLVED" || c.resolution?.status === "RESOLVED"
          ? CONFLICT_STATE.RESOLVED_WITH_AUTHORITY
          : c.conflictState ?? CONFLICT_STATE.OPEN;

    const prevailing = c.prevailingSourceRefId
      ? { sourceRefId: c.prevailingSourceRefId }
      : c.prevailing ?? c.resolution?.prevailing ?? null;
    const rejected = c.rejected ?? c.resolution?.rejected ?? [];

    return Object.freeze({
      conflictId: c.conflictId ?? c.id ?? `CNF-${c.field ?? "unknown"}`,
      field: c.field ?? null,
      conflictState: status,
      strategy: c.strategy ?? c.resolution?.strategy ?? "HIERARCHY",
      averagingProhibited: true,
      prevailing: prevailing
        ? Object.freeze({
            sourceRefId: prevailing.sourceRefId ?? null,
            organismId: prevailing.organismId ?? null,
            eLevel: prevailing.eLevel ?? null,
            value: prevailing.value ?? null,
          })
        : null,
      rejected: Object.freeze(
        (rejected ?? []).map((r) =>
          Object.freeze({
            sourceRefId: r.sourceRefId ?? null,
            organismId: r.organismId ?? null,
            eLevel: r.eLevel ?? null,
            value: r.value ?? null,
          })
        )
      ),
      policy: c.policy ?? c.resolution?.policy ?? null,
      resolutionReason: c.resolutionReason ?? c.resolution?.policy ?? null,
      retainedLosingLineage: (rejected ?? []).length > 0,
    });
  });

  const open = items.filter((i) => i.conflictState === CONFLICT_STATE.OPEN);

  return Object.freeze({
    schemaId: "rsn.decision.conflicts.v1",
    conflicts: Object.freeze(items),
    openCount: open.length,
    resolvedCount: items.filter(
      (i) => i.conflictState === CONFLICT_STATE.RESOLVED_WITH_AUTHORITY
    ).length,
    silentOverwriteProhibited: true,
    averagingProhibited: true,
    constitutionalPhase: "PS05-03",
  });
}

/**
 * Export OPEN conflicts from an Evidence registry snapshot.
 * @param {object|null|undefined} registry
 */
export function exportOpenConflictsFromRegistry(registry) {
  const conflicts = registry?.conflicts ?? [];
  return exportConflicts(conflicts);
}

/**
 * Build conflict export from a MotEvd02 arbitrate result.
 * @param {object} arbitrateResult
 */
export function exportFromMotEvd02Result(arbitrateResult) {
  const resolution = arbitrateResult?.resolution;
  if (!resolution) {
    return exportConflicts([]);
  }
  return exportConflicts([
    {
      conflictId: `CNF-${resolution.field}`,
      field: resolution.field,
      status: resolution.status,
      strategy: resolution.strategy,
      prevailing: resolution.prevailing,
      rejected: resolution.rejected,
      policy: resolution.policy,
      resolutionReason: resolution.policy,
    },
  ]);
}

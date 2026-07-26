/**
 * II.6-IMPL — continuity checks for II.5 readiness outcome bindings.
 * Verifies existing bindings only; does not recalculate checksums,
 * reconstruct units, or open parallel II.2–II.4 gates.
 */

/**
 * Assert continuity of a usable HANDOFF_READY II.5 outcome.
 *
 * @param {object} readinessOutcome
 * @param {unknown} [candidate]
 * @returns {{ ok: true } | { ok: false, code: string, message: string }}
 */
export function assertReadinessOutcomeContinuity(readinessOutcome, candidate) {
  if (!readinessOutcome || typeof readinessOutcome !== "object") {
    return {
      ok: false,
      code: "INCOMPLETE_EVALUATION",
      message: "II.5 readiness outcome is missing or unusable",
    };
  }

  if (typeof readinessOutcome.status !== "string" || !readinessOutcome.status) {
    return {
      ok: false,
      code: "INCOMPLETE_EVALUATION",
      message: "II.5 readiness outcome lacks a usable status",
    };
  }

  const publicationUnit = readinessOutcome.publicationUnit;
  if (!publicationUnit || typeof publicationUnit !== "object") {
    return {
      ok: false,
      code: "PUBLICATION_UNIT_BINDING_FAILED",
      message: "HANDOFF_READY outcome lacks a usable publicationUnit binding",
    };
  }

  const snapshotId =
    typeof publicationUnit.snapshotId === "string"
      ? publicationUnit.snapshotId.trim()
      : "";
  if (!snapshotId) {
    return {
      ok: false,
      code: "SNAPSHOT_ID_CONTINUITY_FAILED",
      message: "Publication Unit snapshotId binding is missing or empty",
    };
  }

  const snapshot = publicationUnit.snapshot;
  if (!snapshot || typeof snapshot !== "object" || Array.isArray(snapshot)) {
    return {
      ok: false,
      code: "IDENTITY_CONTINUITY_FAILED",
      message: "Publication Unit lacks complete snapshot binding",
    };
  }

  if (
    typeof snapshot.snapshotId === "string" &&
    snapshot.snapshotId.trim() !== snapshotId
  ) {
    return {
      ok: false,
      code: "IDENTITY_CONTINUITY_FAILED",
      message: "Publication Unit snapshotId does not match bound snapshot identity",
    };
  }

  if (
    candidate !== undefined &&
    candidate !== null &&
    publicationUnit.snapshot !== candidate
  ) {
    return {
      ok: false,
      code: "IDENTITY_CONTINUITY_FAILED",
      message: "Publication Unit snapshot binding does not match candidate reference",
    };
  }

  const integrity = publicationUnit.integrity;
  if (!integrity || typeof integrity !== "object" || Array.isArray(integrity)) {
    return {
      ok: false,
      code: "INTEGRITY_CONTINUITY_FAILED",
      message: "Publication Unit integrity binding is missing",
    };
  }
  const checksum =
    typeof integrity.checksum === "string" ? integrity.checksum.trim() : "";
  if (!checksum) {
    return {
      ok: false,
      code: "INTEGRITY_CONTINUITY_FAILED",
      message: "Publication Unit integrity.checksum binding is missing or empty",
    };
  }

  if (
    Object.prototype.hasOwnProperty.call(snapshot, "sourceProvenance") &&
    (snapshot.sourceProvenance === null ||
      typeof snapshot.sourceProvenance !== "object" ||
      Array.isArray(snapshot.sourceProvenance))
  ) {
    return {
      ok: false,
      code: "PROVENANCE_CONTINUITY_FAILED",
      message: "Publication Unit snapshot provenance binding is incoherent",
    };
  }

  // II.5 outcome binding continuity: status must remain the readiness token we entered on.
  if (readinessOutcome.status !== "HANDOFF_READY") {
    return {
      ok: false,
      code: "READINESS_OUTCOME_BINDING_FAILED",
      message: "Readiness outcome status binding is not HANDOFF_READY",
    };
  }

  return { ok: true };
}

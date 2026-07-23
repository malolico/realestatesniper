/**
 * II.5-IMPL — continuity checks for II.4 Publication Unit bindings.
 * Verifies existing bindings only; does not recalculate checksums or invent identity.
 */

/**
 * @param {object} publicationUnit
 * @param {unknown} candidate
 * @returns {{ ok: true } | { ok: false, code: string, message: string }}
 */
export function assertPublicationUnitContinuity(publicationUnit, candidate) {
  if (!publicationUnit || typeof publicationUnit !== "object") {
    return {
      ok: false,
      code: "INCOMPLETE_EVALUATION",
      message: "UNIT_FORMED outcome lacks a usable publicationUnit binding",
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

  // Identity continuity: unit snapshotId must match bound snapshot identity.
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

  // When candidate is the same formation input, binding must remain the same reference.
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

  // Provenance continuity: if present on the bound snapshot, it must remain a usable object.
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

  return { ok: true };
}

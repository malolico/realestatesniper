/**
 * II.5-IMPL — optional subordinate readiness manifest metadata.
 * Descriptive only; never a transport/storage/API/Delivery surface.
 */

/**
 * @param {object} publicationUnit
 * @returns {Readonly<object>}
 */
export function buildReadinessManifestMetadata(publicationUnit) {
  return Object.freeze({
    kind: "readiness-manifest-metadata",
    subordinate: true,
    snapshotId: publicationUnit.snapshotId,
    integrityChecksum: publicationUnit.integrity.checksum,
    eligibilityDecision: publicationUnit.eligibilityDecision,
  });
}

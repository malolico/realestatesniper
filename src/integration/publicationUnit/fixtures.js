/**
 * II.4-IMPL fixtures — reuse II.2/II.3 fixtures; add binding-reject cases.
 */

export {
  fixtureHealthy,
  fixtureStale,
  fixtureStaleMissingWarning,
  fixtureOwnershipRegistryMismatch,
  fixtureUnknownRootField,
  fixtureBadChecksum,
  fixtureAtomicFragment,
  fixtureAtomicArray,
  fixtureAtomicNull,
} from "../publicationEligibility/fixtures.js";

/**
 * Synthetic candidate for UNIT_REJECTED tests: II.3 inject returns ELIGIBLE,
 * but identity/integrity binding cannot be formed from this object.
 */
export function fixtureEligibleMissingSnapshotId() {
  return {
    contractId: "factory.observability.read_model",
    schemaVersion: "2.0.0",
    integrity: {
      algorithm: "SHA-256",
      canonicalization: "JCS",
      checksum: "a".repeat(64),
      verified: true,
    },
  };
}

/**
 * Synthetic candidate: has snapshotId but no usable integrity binding.
 */
export function fixtureEligibleMissingIntegrity() {
  return {
    contractId: "factory.observability.read_model",
    schemaVersion: "2.0.0",
    snapshotId: "snap-missing-integrity-001",
  };
}

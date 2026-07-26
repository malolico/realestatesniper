/**
 * II.6-IMPL fixtures — reuse II.5 fixtures; add synthetic READY reject helpers.
 */

export {
  fixtureHealthy,
  fixtureStale,
  fixtureBadChecksum,
  fixtureAtomicFragment,
  fixtureStaleMissingWarning,
  fixtureOwnershipRegistryMismatch,
} from "../handoffReadiness/fixtures.js";

/**
 * Build a synthetic II.5 HANDOFF_READY-shaped outcome for continuity-reject tests.
 * Not a real II.5 path — used only with evaluateHandoffReadiness / readinessOutcome injection.
 *
 * @param {object} publicationUnit
 * @param {object} [overrides]
 */
export function syntheticHandoffReadyOutcome(publicationUnit, overrides = {}) {
  const base = {
    status: "HANDOFF_READY",
    reasons: Object.freeze([
      Object.freeze({
        code: "HANDOFF_READY",
        message: "synthetic HANDOFF_READY for II.6 tests",
      }),
    ]),
    publicationUnit,
    upstream: Object.freeze({
      status: "UNIT_FORMED",
      delivery: "NOT_AUTHORIZED",
    }),
    manifest: Object.freeze({
      snapshotId:
        publicationUnit && typeof publicationUnit.snapshotId === "string"
          ? publicationUnit.snapshotId
          : null,
    }),
    delivery: "NOT_AUTHORIZED",
    handoffExecution: "NOT_AUTHORIZED",
    sideEffects: Object.freeze([]),
  };
  return Object.freeze({ ...base, ...overrides });
}

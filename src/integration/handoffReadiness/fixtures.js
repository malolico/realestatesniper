/**
 * II.5-IMPL fixtures — reuse II.4 fixtures; add synthetic reject helpers for tests.
 */

export {
  fixtureHealthy,
  fixtureStale,
  fixtureBadChecksum,
  fixtureAtomicFragment,
  fixtureStaleMissingWarning,
  fixtureOwnershipRegistryMismatch,
} from "../publicationUnit/fixtures.js";

/**
 * Build a synthetic II.4 UNIT_FORMED-shaped outcome for continuity-reject tests.
 * Not a real II.4 path — used only with formPublicationUnit injection.
 *
 * @param {object} publicationUnit
 */
export function syntheticUnitFormedOutcome(publicationUnit) {
  return Object.freeze({
    status: "UNIT_FORMED",
    reasons: Object.freeze([]),
    publicationUnit,
    eligibility: Object.freeze({ decision: "ELIGIBLE" }),
    delivery: "NOT_AUTHORIZED",
    sideEffects: Object.freeze([]),
  });
}

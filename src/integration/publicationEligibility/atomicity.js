/**
 * II.3-IMPL — atomic snapshot unit checks (eligibility only).
 */

/**
 * A publication candidate must be a single complete plain object unit.
 * Arrays, primitives, null, and non-objects are never eligible.
 *
 * @param {unknown} candidate
 * @returns {{ ok: true } | { ok: false, code: string, message: string }}
 */
export function assertAtomicSnapshotUnit(candidate) {
  if (candidate === null || candidate === undefined) {
    return {
      ok: false,
      code: "ATOMIC_UNIT_INVALID",
      message: "Candidate is null or undefined",
    };
  }
  if (typeof candidate !== "object") {
    return {
      ok: false,
      code: "CANDIDATE_NOT_OBJECT",
      message: "Candidate must be a plain object snapshot unit",
    };
  }
  if (Array.isArray(candidate)) {
    return {
      ok: false,
      code: "ATOMIC_UNIT_INVALID",
      message: "Candidate array is not an atomic snapshot unit",
    };
  }
  // Reject obvious fragment markers (partial evaluation paths).
  if (candidate.__fragment === true || candidate.partialFragment === true) {
    return {
      ok: false,
      code: "ATOMIC_UNIT_INVALID",
      message: "Candidate marked as fragment cannot be publication-eligible",
    };
  }
  return { ok: true };
}

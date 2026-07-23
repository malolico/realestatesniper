/**
 * II.4-IMPL — atomic completeness checks for Publication Unit binding.
 * Does not reimplement II.2/II.3 validation; only guards unit binding shape.
 */

/**
 * After II.3 ELIGIBLE, the candidate must still be a single plain object unit.
 *
 * @param {unknown} candidate
 * @returns {{ ok: true } | { ok: false, code: string, message: string }}
 */
export function assertAtomicBindingCandidate(candidate) {
  if (candidate === null || candidate === undefined) {
    return {
      ok: false,
      code: "NON_ATOMIC_CANDIDATE",
      message: "Candidate is null or undefined",
    };
  }
  if (typeof candidate !== "object" || Array.isArray(candidate)) {
    return {
      ok: false,
      code: "NON_ATOMIC_CANDIDATE",
      message: "Candidate must be a single plain object snapshot unit",
    };
  }
  if (candidate.__fragment === true || candidate.partialFragment === true) {
    return {
      ok: false,
      code: "NON_ATOMIC_CANDIDATE",
      message: "Fragment-marked candidate cannot form a Publication Unit",
    };
  }
  return { ok: true };
}

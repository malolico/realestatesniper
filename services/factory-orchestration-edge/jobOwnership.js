/**
 * P-INT-01 Slice B / HQ-05 — Actor-scoped job ownership helpers.
 * Fail-closed owner-match for FACTORY_OPS and FACTORY_DIRECTOR (no admin bypass).
 * Canonical actor ids only: no whitespace equivalence, no silent normalization.
 */

/**
 * True iff value is a non-empty string with no leading/trailing whitespace.
 * Does not trim, lowercase, or coerce.
 * @param {unknown} value
 * @returns {boolean}
 */
export function isCanonicalActorId(value) {
  if (typeof value !== "string") return false;
  if (value.length === 0) return false;
  // Reject peripheral whitespace without normalizing the identity.
  if (value !== value.trim()) return false;
  return true;
}

/**
 * Extract verified canonical actor id from AuthN principal. Invalid → null (deny).
 * @param {object|null|undefined} principal
 * @returns {string|null}
 */
export function resolveVerifiedActorId(principal) {
  if (!principal || typeof principal !== "object") return null;
  if (!isCanonicalActorId(principal.principalId)) return null;
  return principal.principalId;
}

/**
 * Owner-match: canonical principalId must equal canonical job.actorId (exact ===).
 * Roles are ignored (no Director/ops bypass).
 * @param {object|null|undefined} job
 * @param {object|null|undefined} principal
 * @returns {{ ok: true } | { ok: false, reason: string }}
 */
export function jobOwnerMatchesPrincipal(job, principal) {
  const actorId = resolveVerifiedActorId(principal);
  if (!actorId) {
    return { ok: false, reason: "unverified_actor" };
  }
  if (!job || typeof job !== "object") {
    return { ok: false, reason: "missing_job" };
  }
  if (!isCanonicalActorId(job.actorId)) {
    return { ok: false, reason: "invalid_owner" };
  }
  if (job.actorId !== actorId) {
    return { ok: false, reason: "owner_mismatch" };
  }
  return { ok: true };
}

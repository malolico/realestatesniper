/**
 * SP06-P2 — Publication Unit / Projection projector (DAG-SP06-P2-G1)
 *
 * Consume-only P1 eligibility result · fail-closed-only unit/projection.
 * ELIGIBLE / FORMED RESERVED / UNREACHABLE · delivery always NOT_AUTHORIZED.
 * No Factory / SP05 / P1 mutation · no re-adjudication · no IO.
 */

import { DECISION as P1_DECISION } from "../p1/publicationEligibilityContract.js";
import {
  buildUnitResult,
  DECISION,
  DELIVERY_STATUS,
  ELIGIBILITY_RESULT_SCHEMA_ID,
  ELIGIBILITY_VERSION,
  FORMATION,
  P1_REQUIRED_TOP_LEVEL,
  REASON_CODES,
} from "./publicationUnitContract.js";

/**
 * @param {string[]} errors
 * @param {string} code
 */
function refused(errors, code) {
  return buildUnitResult({
    decision: DECISION.REFUSED,
    formation: FORMATION.NOT_FORMED,
    reasons: errors.map((message) => ({ code, message })),
    inputRef: Object.freeze({ accepted: false, root: "p1-eligibility-result" }),
    identity: Object.freeze({ formed: false, stableKey: null }),
    lineage: Object.freeze({ accepted: false }),
    eligibilityBinding: Object.freeze({ bound: false, upstreamDecision: null }),
    projection: null,
    provenance: Object.freeze({ citeOnly: true }),
    honesty: Object.freeze({
      limitations: Object.freeze({
        evaluationRefused: true,
        projectionNotFormed: true,
      }),
    }),
  });
}

/**
 * Structural accept gate for P1 eligibility root input — fail-closed REFUSED.
 * @param {unknown} eligibilityResult
 * @returns {{ ok: true, result: object } | { ok: false, code: string, errors: string[] }}
 */
export function acceptPublicationEligibilityResult(eligibilityResult) {
  if (
    eligibilityResult == null ||
    typeof eligibilityResult !== "object" ||
    Array.isArray(eligibilityResult)
  ) {
    return {
      ok: false,
      code: REASON_CODES.STRUCTURAL_INVALID,
      errors: ["P1 eligibility result must be a structured object"],
    };
  }

  const errors = [];
  const keys = Object.keys(eligibilityResult);

  if (keys.length !== P1_REQUIRED_TOP_LEVEL.length) {
    errors.push("top-level section catalog mismatch");
  }
  for (const k of P1_REQUIRED_TOP_LEVEL) {
    if (!Object.prototype.hasOwnProperty.call(eligibilityResult, k)) {
      errors.push(`missing required top-level section: ${k}`);
    }
  }

  const meta = eligibilityResult.meta;
  if (meta?.schemaId !== ELIGIBILITY_RESULT_SCHEMA_ID) {
    errors.push(`unsupported schemaId (expected ${ELIGIBILITY_RESULT_SCHEMA_ID})`);
  }
  if (meta?.version !== ELIGIBILITY_VERSION) {
    errors.push(`unsupported version (expected ${ELIGIBILITY_VERSION})`);
  }

  if (errors.some((e) => e.includes("schemaId") || e.includes("version"))) {
    return { ok: false, code: REASON_CODES.SCHEMA_UNSUPPORTED, errors };
  }

  if (eligibilityResult.delivery !== DELIVERY_STATUS.NOT_AUTHORIZED) {
    errors.push("P1 delivery must be NOT_AUTHORIZED");
  }

  const upstream = eligibilityResult.decision;
  if (upstream === P1_DECISION.ELIGIBLE) {
    errors.push("ELIGIBLE upstream decision unreachable under current P1 policy");
    return { ok: false, code: REASON_CODES.UNSUPPORTED_DECISION, errors };
  }
  if (upstream !== P1_DECISION.REFUSED && upstream !== P1_DECISION.NOT_ELIGIBLE) {
    errors.push(`unsupported P1 decision: ${String(upstream)}`);
    return { ok: false, code: REASON_CODES.UNSUPPORTED_DECISION, errors };
  }

  if (errors.length > 0) {
    return { ok: false, code: REASON_CODES.STRUCTURAL_INVALID, errors };
  }

  return { ok: true, result: eligibilityResult };
}

/**
 * Deterministic stable identity cite for NOT_FORMED results (no wall-clock truth).
 * @param {object} p1
 */
function deriveIdentity(p1) {
  const factoryKey = p1.inputRef?.factoryKey ?? p1.honesty?.provenanceCite?.factoryKey ?? null;
  const schemaId = p1.inputRef?.schemaId ?? p1.meta?.schemaId ?? null;
  const stableKey =
    factoryKey != null && schemaId != null
      ? `sp06-p2-not-formed:${schemaId}:${factoryKey}:${p1.decision}`
      : null;
  return Object.freeze({
    formed: false,
    stableKey,
  });
}

/**
 * @param {object} p1
 */
function citeLineage(p1) {
  return Object.freeze({
    upstreamSchemaId: p1.meta?.schemaId ?? null,
    upstreamVersion: p1.meta?.version ?? null,
    factoryKey: p1.inputRef?.factoryKey ?? null,
    dossierState: p1.inputRef?.state ?? null,
  });
}

/**
 * @param {object} p1
 */
function citeHonesty(p1) {
  const h = p1.honesty ?? {};
  return Object.freeze({
    unknown: h.unknown ?? null,
    conflict: h.conflict ?? null,
    freshness: h.freshness ?? null,
    limitations: Object.freeze({
      ...(h.limitations ?? {}),
      freshnessIsNotTruth: h.limitations?.freshnessIsNotTruth ?? true,
      optionalAbsenceIsNotUnknown: h.limitations?.optionalAbsenceIsNotUnknown ?? true,
      projectionNotFormed: true,
    }),
    provenanceCite: Object.freeze({
      factoryKey:
        h.provenanceCite?.factoryKey ??
        p1.inputRef?.factoryKey ??
        null,
    }),
  });
}

/**
 * Opaque ownerRef cite only — never disclosure authority.
 * @param {object} p1
 */
function citeProvenance(p1) {
  const ownerRef = p1.honesty?.ownerRef ?? null;
  return Object.freeze({
    factoryKey: p1.inputRef?.factoryKey ?? null,
    ownerRef:
      ownerRef == null
        ? null
        : Object.freeze({
            opaqueCiteOnly: true,
            disclosureAuthorized: false,
          }),
  });
}

/**
 * Project bounded Publication Unit / projection result from accepted P1 eligibility root.
 *
 * @param {unknown} eligibilityResult
 * @returns {object} frozen unit result
 */
export function projectPublicationUnit(eligibilityResult) {
  const accept = acceptPublicationEligibilityResult(eligibilityResult);
  if (!accept.ok) {
    return refused(accept.errors, accept.code);
  }

  const p1 = accept.result;
  const upstream = p1.decision;

  const eligibilityBinding = Object.freeze({
    bound: true,
    upstreamDecision: upstream,
    overridden: false,
  });

  const base = {
    formation: FORMATION.NOT_FORMED,
    inputRef: Object.freeze({
      accepted: true,
      rootSchemaId: p1.meta.schemaId,
      rootVersion: p1.meta.version,
      upstreamDecision: upstream,
    }),
    identity: deriveIdentity(p1),
    lineage: citeLineage(p1),
    eligibilityBinding,
    projection: null,
    provenance: citeProvenance(p1),
    honesty: citeHonesty(p1),
  };

  if (upstream === P1_DECISION.REFUSED) {
    return buildUnitResult({
      ...base,
      decision: DECISION.REFUSED,
      reasons: [
        {
          code: REASON_CODES.UPSTREAM_REFUSED,
          message: "Upstream P1 eligibility REFUSED — unit/projection not formed",
        },
      ],
    });
  }

  return buildUnitResult({
    ...base,
    decision: DECISION.NOT_ELIGIBLE,
    reasons: [
      {
        code: REASON_CODES.UPSTREAM_NOT_ELIGIBLE,
        message:
          "Upstream P1 NOT_ELIGIBLE — fail-closed no formation under current authority",
      },
      {
        code: REASON_CODES.FAIL_CLOSED_NO_FORMATION,
        message: "Positive ELIGIBLE / FORMED path reserved and unreachable",
      },
    ],
  });
}

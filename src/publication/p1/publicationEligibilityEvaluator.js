/**
 * SP06-P1 — Publication Eligibility evaluator (DAG-SP06-P1-G1)
 *
 * Consume-only DEC-DOSSIER handoff · fail-closed-only eligibility.
 * ELIGIBLE RESERVED / UNREACHABLE · delivery always NOT_AUTHORIZED.
 * No Factory / SP05 mutation · no re-adjudication · no IO.
 */

import { DISTRESS_STATES } from "../../decision/semantics/decisionOutputContract.js";
import {
  buildEligibilityResult,
  DECISION,
  DOSSIER_REQUIRED_TOP_LEVEL,
  DOSSIER_RESULT_SCHEMA_ID,
  DOSSIER_STATE,
  DOSSIER_VERSION,
  REASON_CODES,
  SEM06_HALT_CATALOG,
} from "./publicationEligibilityContract.js";

/**
 * @param {string[]} errors
 * @param {string} code
 */
function refused(errors, code) {
  return buildEligibilityResult({
    decision: DECISION.REFUSED,
    reasons: errors.map((message) => ({
      code,
      message,
    })),
    inputRef: Object.freeze({ accepted: false }),
    honesty: Object.freeze({
      limitations: Object.freeze({
        evaluationRefused: true,
      }),
    }),
  });
}

/**
 * Structural / lineage / provenance accept gate — fail-closed REFUSED.
 * @param {unknown} dossier
 * @returns {{ ok: true, dossier: object } | { ok: false, code: string, errors: string[] }}
 */
export function acceptDecisionDossier(dossier) {
  if (dossier == null || typeof dossier !== "object" || Array.isArray(dossier)) {
    return {
      ok: false,
      code: REASON_CODES.STRUCTURAL_INVALID,
      errors: ["DEC-DOSSIER must be a structured object"],
    };
  }

  const errors = [];
  const keys = Object.keys(dossier);

  if (keys.length !== DOSSIER_REQUIRED_TOP_LEVEL.length) {
    errors.push("top-level section catalog mismatch");
  }
  for (const k of DOSSIER_REQUIRED_TOP_LEVEL) {
    if (!Object.prototype.hasOwnProperty.call(dossier, k)) {
      errors.push(`missing required top-level section: ${k}`);
    }
  }
  for (const k of keys) {
    if (!DOSSIER_REQUIRED_TOP_LEVEL.includes(k)) {
      errors.push(`unexpected top-level section: ${k}`);
    }
  }

  const meta = dossier.meta;
  if (meta?.schemaId !== DOSSIER_RESULT_SCHEMA_ID) {
    errors.push(`unsupported schemaId (expected ${DOSSIER_RESULT_SCHEMA_ID})`);
  }
  if (meta?.version !== DOSSIER_VERSION) {
    errors.push(`unsupported version (expected ${DOSSIER_VERSION})`);
  }
  if (meta?.state !== DOSSIER_STATE) {
    errors.push(`unsupported state (expected ${DOSSIER_STATE})`);
  }
  if (errors.some((e) => e.includes("schemaId") || e.includes("version") || e.includes("state"))) {
    return { ok: false, code: REASON_CODES.SCHEMA_UNSUPPORTED, errors };
  }

  const factoryKey =
    dossier.honesty?.provenance?.decisionPackageIdentity?.factoryKey ?? null;
  if (factoryKey == null || factoryKey === "") {
    errors.push("missing required provenance.decisionPackageIdentity.factoryKey");
  }
  const p2Schema = dossier.honesty?.provenance?.p2Result?.schemaId ?? null;
  if (p2Schema == null) {
    errors.push("missing required provenance.p2Result.schemaId lineage cite");
  }

  const inv = dossier.invariants;
  if (inv == null || typeof inv !== "object") {
    errors.push("missing required invariants section");
  } else {
    if (inv.dossierIsNotSp06Publication !== true) {
      errors.push("invariants.dossierIsNotSp06Publication must be true");
    }
    if (inv.noProductCommercialSemantics !== true) {
      errors.push("invariants.noProductCommercialSemantics must be true");
    }
  }

  const semantics = dossier.semantics;
  if (semantics == null || typeof semantics !== "object") {
    errors.push("missing required semantics section");
  } else if (!Object.prototype.hasOwnProperty.call(semantics, "halt")) {
    errors.push("semantics.halt absent/unreadable");
  } else {
    const halt = semantics.halt;
    const haltValid = SEM06_HALT_CATALOG.some((v) => v === halt);
    if (!haltValid) {
      errors.push(`unsupported SEM-06 halt value: ${String(halt)}`);
    }
  }

  if (errors.length > 0) {
    const code = errors.some((e) => e.includes("provenance") || e.includes("lineage"))
      ? errors.some((e) => e.includes("provenance"))
        ? REASON_CODES.PROVENANCE_MISSING
        : REASON_CODES.LINEAGE_INVALID
      : errors.some((e) => e.includes("halt"))
        ? REASON_CODES.HALT_UNSUPPORTED
        : REASON_CODES.STRUCTURAL_INVALID;
    return { ok: false, code, errors };
  }

  return { ok: true, dossier };
}

/**
 * @param {object} dossier
 */
function citeInputRef(dossier) {
  return Object.freeze({
    schemaId: dossier.meta.schemaId,
    version: dossier.meta.version,
    state: dossier.meta.state,
    factoryKey:
      dossier.honesty?.provenance?.decisionPackageIdentity?.factoryKey ?? null,
  });
}

/**
 * Preserve bounded honesty from accepted dossier — no fabrication.
 * @param {object} dossier
 */
function citeHonesty(dossier) {
  const h = dossier.honesty ?? {};
  return Object.freeze({
    unknown: h.unknown ?? null,
    conflict: h.conflict ?? null,
    freshness: h.freshness ?? null,
    limitations: Object.freeze({
      ...(h.limitations ?? {}),
      freshnessIsNotTruth: h.limitations?.freshnessIsNotTruth ?? true,
      optionalAbsenceIsNotUnknown: h.limitations?.optionalAbsenceIsNotUnknown ?? true,
    }),
    provenanceCite: Object.freeze({
      factoryKey: h.provenance?.decisionPackageIdentity?.factoryKey ?? null,
    }),
  });
}

/**
 * Extract Axis A distress state (consume-only).
 * @param {object} dossier
 */
export function extractDistressEvidenceState(dossier) {
  return (
    dossier.semantics?.evidenceVector?.distressEvidenceState ??
    dossier.semantics?.evidenceVector?.dimensions?.find(
      (d) => d?.id === "DISTRESS_EVIDENCE_STATE"
    )?.value ??
    null
  );
}

/**
 * Extract Axis B SEM-06 halt (consume-only).
 * @param {object} dossier
 */
export function extractSem06Halt(dossier) {
  return dossier.semantics?.halt ?? null;
}

/**
 * Evaluate Publication eligibility for one accepted DEC-DOSSIER.
 * FAIL-CLOSED-ONLY: never emits ELIGIBLE.
 *
 * @param {unknown} dossier
 * @returns {object} frozen eligibility result
 */
export function evaluatePublicationEligibilityP1(dossier) {
  const accept = acceptDecisionDossier(dossier);
  if (!accept.ok) {
    return refused(accept.errors, accept.code);
  }

  const d = accept.dossier;
  const halt = extractSem06Halt(d);
  const distress = extractDistressEvidenceState(d);

  const reasons = [];
  let decision = DECISION.NOT_ELIGIBLE;

  if (
    halt === DISTRESS_STATES.CONFLICT_BLOCKED ||
    distress === DISTRESS_STATES.CONFLICT_BLOCKED
  ) {
    decision = DECISION.NOT_ELIGIBLE;
    reasons.push({
      code: REASON_CODES.CONFLICT_BLOCKED,
      message: "Decision conflict block preserved — fail-closed Publication refusal",
    });
  } else {
    decision = DECISION.NOT_ELIGIBLE;
    reasons.push({
      code: REASON_CODES.FAIL_CLOSED_DEFAULT,
      message:
        "No Continuity-authorized positive ELIGIBLE criterion — fail-closed default",
    });
  }

  return buildEligibilityResult({
    decision,
    reasons,
    inputRef: citeInputRef(d),
    honesty: citeHonesty(d),
  });
}

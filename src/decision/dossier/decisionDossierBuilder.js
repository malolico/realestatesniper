/**
 * SP05-P3 — Decision Dossier Builder (DAG-SP05-P3-G1)
 *
 * Assembles bounded Decision-side Deal Dossier from accepted DEC-INTAKE +
 * accepted rsn.decision.semantics.result.v1.
 * Assembly / preservation only — no re-adjudication of P1/P2.
 *
 * Factory / P1 / P2 = READ ONLY. No write-back. No Product / transaction advice.
 */

import { DECISION_INTAKE_STATE } from "../intake/decisionIntakeConsumer.js";
import { deepClone, deepFreeze } from "../intake/immutableDecisionProjection.js";
import {
  SEMANTICS_RESULT_SCHEMA_ID,
  VALUE_DIMENSION_ID,
} from "../semantics/decisionOutputContract.js";
import {
  DOSSIER_RESULT_SCHEMA_ID,
  DOSSIER_VERSION,
  DOSSIER_RULE_VERSION,
  buildDossierResult,
} from "./decisionDossierContract.js";

const CONTACT_FORBIDDEN_KEYS = Object.freeze([
  "email",
  "phone",
  "phoneNumber",
  "mobile",
  "contact",
  "contacts",
  "outreach",
  "authorization",
  "authorized",
  "eligibility",
  "targeting",
]);

const ECONOMIC_ATTRACTIVENESS_FORBIDDEN_KEYS = Object.freeze([
  "attractiveness",
  "investmentConclusion",
  "roiScore",
  "capRateDerived",
  "cashFlowDerived",
  "discountScore",
  "arvDerived",
]);

/**
 * @param {string[]} errors
 */
function reject(errors) {
  return { ok: false, errors: [...errors], dossier: null };
}

/**
 * Defensive structural copy of plain JSON-compatible values.
 * @param {unknown} value
 */
function citeCopy(value) {
  if (value === null || typeof value !== "object") return value;
  return deepClone(value);
}

/**
 * @param {object|null|undefined} intake
 */
function validateIntake(intake) {
  if (intake == null || typeof intake !== "object") {
    return { ok: false, errors: ["P3 dossier requires DEC-INTAKE intake object"] };
  }
  if (intake.accepted !== true || intake.state !== DECISION_INTAKE_STATE) {
    return {
      ok: false,
      errors: [
        `P3 dossier requires accepted ${DECISION_INTAKE_STATE} (refused missing/malformed/unaccepted)`,
      ],
    };
  }
  if (intake.package == null || typeof intake.package !== "object") {
    return {
      ok: false,
      errors: ["P3 dossier requires immutable Decision package projection"],
    };
  }
  if (intake.intake?.state != null && intake.intake.state !== DECISION_INTAKE_STATE) {
    return { ok: false, errors: ["intake.state must be DEC-INTAKE"] };
  }
  return { ok: true, errors: [] };
}

/**
 * @param {object|null|undefined} p2
 */
function validateP2(p2) {
  if (p2 == null || typeof p2 !== "object") {
    return { ok: false, errors: ["P3 dossier requires P2 semantics result object"] };
  }
  if (p2.schemaId !== SEMANTICS_RESULT_SCHEMA_ID) {
    return {
      ok: false,
      errors: [
        `P3 dossier requires P2 schemaId ${SEMANTICS_RESULT_SCHEMA_ID} (unsupported/malformed)`,
      ],
    };
  }
  if (typeof p2.ruleVersion !== "string" || p2.ruleVersion.length === 0) {
    return { ok: false, errors: ["P3 dossier requires P2 ruleVersion"] };
  }
  if (
    p2.classifyDeal?.state == null ||
    p2.opportunity?.state == null ||
    p2.reviewPriority?.state == null ||
    p2.evidenceVector == null ||
    typeof p2.evidenceVector !== "object"
  ) {
    return { ok: false, errors: ["P3 dossier requires malformed-safe P2 semantic cites"] };
  }
  return { ok: true, errors: [] };
}

/**
 * @param {object} intake
 * @param {object} p2
 */
function validateLineage(intake, p2) {
  const errors = [];
  const pkg = intake.package;
  const intakeMeta = intake.intake ?? {};
  const factoryKey = pkg.identity?.factory_key ?? intakeMeta.factory_key ?? null;
  const p2FactoryKey = p2.input?.factoryKey ?? null;
  const p2DecState = p2.input?.decIntakeState ?? null;

  if (p2DecState !== DECISION_INTAKE_STATE) {
    errors.push("P1/P2 lineage mismatch: P2 input.decIntakeState must be DEC-INTAKE");
  }
  if (factoryKey == null || p2FactoryKey == null || factoryKey !== p2FactoryKey) {
    errors.push("P1/P2 lineage mismatch: factoryKey does not correspond");
  }

  const pkgVersion = pkg.meta?.version ?? intakeMeta.packageVersion ?? null;
  const p2PkgVersion = p2.input?.packageVersion ?? null;
  if (
    pkgVersion != null &&
    p2PkgVersion != null &&
    pkgVersion !== p2PkgVersion
  ) {
    errors.push("P1/P2 lineage mismatch: packageVersion does not correspond");
  }

  return errors;
}

/**
 * Required provenance must be present on accepted inputs (no synthesis).
 * @param {object} intake
 * @param {object} p2
 */
function validateRequiredProvenance(intake, p2) {
  const errors = [];
  const pkg = intake.package;
  const factoryKey = pkg.identity?.factory_key ?? intake.intake?.factory_key ?? null;
  if (factoryKey == null || factoryKey === "") {
    errors.push("required provenance missing: Decision Package identity (factoryKey)");
  }
  if (intake.accepted !== true || intake.state !== DECISION_INTAKE_STATE) {
    errors.push("required provenance missing: DEC-INTAKE acceptance");
  }
  if (p2.schemaId !== SEMANTICS_RESULT_SCHEMA_ID || !p2.ruleVersion) {
    errors.push("required provenance missing/inconsistent: P2 identity/schema/ruleVersion");
  }
  const factRefs = p2.trace?.sourceFactRefs;
  if (!Array.isArray(factRefs)) {
    errors.push("required provenance missing: FACT/source references for cited conclusions");
  }
  return errors;
}

/**
 * @param {object} obj
 * @param {readonly string[]} keys
 */
function containsForbiddenKey(obj, keys) {
  if (obj == null || typeof obj !== "object") return false;
  const raw = JSON.stringify(obj);
  return keys.some((k) => {
    const re = new RegExp(`"${k}"\\s*:`, "i");
    return re.test(raw);
  });
}

/**
 * Preserve-only ranking cite when comparable rank is present.
 * @param {object} p2
 * @param {object[]} omissions
 */
function buildRankingCite(p2, omissions) {
  const ranking = p2.ranking;
  if (ranking == null) {
    return { ranking: undefined };
  }
  if (typeof ranking !== "object" || Array.isArray(ranking)) {
    omissions.push({
      field: "semantics.ranking",
      reason: "malformed_optional",
      action: "ABSENT_NOT_INCLUDED",
    });
    return { ranking: undefined };
  }
  if (ranking.rank == null) {
    // non-comparable / null rank → ABSENT / NOT INCLUDED
    return { ranking: undefined };
  }
  if (typeof ranking.rank !== "number" || !Number.isFinite(ranking.rank)) {
    omissions.push({
      field: "semantics.ranking",
      reason: "malformed_optional",
      action: "ABSENT_NOT_INCLUDED",
    });
    return { ranking: undefined };
  }

  const cite = {
    schemaId: ranking.schemaId ?? null,
    rank: ranking.rank,
    candidateSetId: ranking.candidateSetId ?? null,
    meaning: ranking.meaning ?? null,
  };
  if (Object.prototype.hasOwnProperty.call(ranking, "comparable")) {
    cite.comparable = ranking.comparable === true;
  }
  return { ranking: Object.freeze(cite) };
}

/**
 * CB-09 economic context from P2 trace only (preserve; no attractiveness invention).
 * @param {object} p2
 * @param {object[]} omissions
 */
function buildEconomicContextCite(p2, omissions) {
  const raw = p2.trace?.economicContextOnly;
  if (raw == null) {
    return { economicContext: undefined };
  }
  if (!Array.isArray(raw)) {
    omissions.push({
      field: "honesty.economicContext",
      reason: "malformed_optional",
      action: "ABSENT_NOT_INCLUDED",
    });
    return { economicContext: undefined };
  }
  if (raw.length === 0) {
    return { economicContext: undefined };
  }
  if (containsForbiddenKey(raw, ECONOMIC_ATTRACTIVENESS_FORBIDDEN_KEYS)) {
    omissions.push({
      field: "honesty.economicContext",
      reason: "malformed_optional_attractiveness",
      action: "ABSENT_NOT_INCLUDED",
    });
    return { economicContext: undefined };
  }

  const items = raw.map((item) => {
    if (item == null || typeof item !== "object") return citeCopy(item);
    return Object.freeze({
      motorId: item.motorId ?? null,
      fullCashValue: item.fullCashValue ?? null,
      equity: item.equity ?? null,
      mortgageBalance: item.mortgageBalance ?? null,
      // Raw FACT cite only when already present upstream — not derived attractiveness
      roi: Object.prototype.hasOwnProperty.call(item, "roi") ? item.roi : null,
      note:
        item.note ??
        "CB-09 evidence/context only — not VALUE attractiveness",
    });
  });
  return {
    economicContext: Object.freeze({
      kind: "CB09_EVIDENCE_CONTEXT_ONLY",
      items: Object.freeze(items),
    }),
  };
}

/**
 * Bounded owner identity/honesty refs from accepted package — no contact data.
 * @param {object} pkg
 * @param {object[]} omissions
 */
function buildOwnerCites(pkg, omissions) {
  let ownerRef;
  let ownerIdentity;

  const candidateRef =
    pkg?.ownerRef ??
    pkg?.identity?.ownerRef ??
    pkg?.truthAccounting?.ownerRef ??
    null;
  const candidateIdentity =
    pkg?.ownerIdentity ??
    pkg?.identity?.ownerIdentity ??
    pkg?.truthAccounting?.ownerIdentity ??
    null;

  if (candidateRef != null) {
    if (typeof candidateRef !== "object" || Array.isArray(candidateRef)) {
      omissions.push({
        field: "honesty.ownerRef",
        reason: "malformed_optional",
        action: "ABSENT_NOT_INCLUDED",
      });
    } else if (containsForbiddenKey(candidateRef, CONTACT_FORBIDDEN_KEYS)) {
      omissions.push({
        field: "honesty.ownerRef",
        reason: "contact_data_forbidden",
        action: "ABSENT_NOT_INCLUDED",
      });
    } else {
      ownerRef = Object.freeze({
        status: candidateRef.status ?? null,
        name:
          typeof candidateRef.name === "string" ? candidateRef.name : null,
        reason: candidateRef.reason ?? null,
      });
    }
  }

  if (candidateIdentity != null) {
    if (
      typeof candidateIdentity !== "object" ||
      Array.isArray(candidateIdentity)
    ) {
      omissions.push({
        field: "honesty.ownerIdentity",
        reason: "malformed_optional",
        action: "ABSENT_NOT_INCLUDED",
      });
    } else if (containsForbiddenKey(candidateIdentity, CONTACT_FORBIDDEN_KEYS)) {
      omissions.push({
        field: "honesty.ownerIdentity",
        reason: "contact_data_forbidden",
        action: "ABSENT_NOT_INCLUDED",
      });
    } else {
      ownerIdentity = Object.freeze({
        status: candidateIdentity.status ?? null,
        displayName:
          typeof candidateIdentity.displayName === "string"
            ? candidateIdentity.displayName
            : typeof candidateIdentity.name === "string"
              ? candidateIdentity.name
              : null,
        reason: candidateIdentity.reason ?? null,
      });
    }
  }

  return { ownerRef, ownerIdentity };
}

/**
 * Build bounded Decision-side Deal Dossier.
 *
 * @param {object} intakeResult — consumeTrustedDecisionPackage result
 * @param {object} p2Result — evaluateDecisionSemantics(...).result (accepted P2 object)
 * @returns {{ ok: boolean, errors: string[], dossier: object|null }}
 */
export function buildDecisionDossier(intakeResult, p2Result) {
  const intakeGate = validateIntake(intakeResult);
  if (!intakeGate.ok) return reject(intakeGate.errors);

  const p2Gate = validateP2(p2Result);
  if (!p2Gate.ok) return reject(p2Gate.errors);

  const lineageErrors = validateLineage(intakeResult, p2Result);
  if (lineageErrors.length) return reject(lineageErrors);

  const provenanceErrors = validateRequiredProvenance(intakeResult, p2Result);
  if (provenanceErrors.length) return reject(provenanceErrors);

  const pkg = intakeResult.package;
  const intakeMeta = intakeResult.intake ?? {};
  const omissions = [];

  const { ranking } = buildRankingCite(p2Result, omissions);
  const { economicContext } = buildEconomicContextCite(p2Result, omissions);
  const { ownerRef, ownerIdentity } = buildOwnerCites(pkg, omissions);

  const distressDim = Array.isArray(p2Result.evidenceVector?.dimensions)
    ? p2Result.evidenceVector.dimensions.find((d) => d?.id === VALUE_DIMENSION_ID) ??
      p2Result.evidenceVector.dimensions[0]
    : null;

  const evidenceVectorCite = Object.freeze({
    schemaId: p2Result.evidenceVector.schemaId ?? null,
    dimensions: Object.freeze(
      (Array.isArray(p2Result.evidenceVector.dimensions)
        ? p2Result.evidenceVector.dimensions
        : []
      ).map((d) =>
        Object.freeze({
          id: d?.id ?? null,
          kind: d?.kind ?? null,
          value: d?.value ?? null,
          rationale: d?.rationale ?? null,
        })
      )
    ),
    distressEvidenceState: distressDim?.value ?? null,
  });

  const semantics = {
    classifyDeal: Object.freeze({ state: p2Result.classifyDeal.state }),
    opportunity: Object.freeze({ state: p2Result.opportunity.state }),
    reviewPriority: Object.freeze({ state: p2Result.reviewPriority.state }),
    halt: p2Result.halt ?? null,
    evidenceVector: evidenceVectorCite,
  };
  if (ranking !== undefined) {
    semantics.ranking = ranking;
  }

  const factRefs = citeCopy(p2Result.trace?.sourceFactRefs ?? []);
  const unknownCtx = citeCopy(
    p2Result.trace?.uncertaintyContext ??
      pkg.truthAccounting?.unknowns ??
      []
  );
  const conflictCtx = citeCopy(
    p2Result.trace?.conflictContext ??
      pkg.truthAccounting?.conflicts ??
      null
  );
  const freshnessCtx = citeCopy(
    p2Result.trace?.freshnessContext ??
      pkg.truthAccounting?.freshness ??
      null
  );

  const honesty = {
    unknown: unknownCtx,
    conflict: conflictCtx,
    freshness: freshnessCtx,
    provenance: Object.freeze({
      decisionPackageIdentity: Object.freeze({
        factoryKey: pkg.identity?.factory_key ?? intakeMeta.factory_key ?? null,
        packageVersion: pkg.meta?.version ?? intakeMeta.packageVersion ?? null,
      }),
      decIntake: Object.freeze({
        accepted: true,
        state: DECISION_INTAKE_STATE,
        deliveryId: intakeMeta.deliveryId ?? null,
      }),
      p2Result: Object.freeze({
        schemaId: p2Result.schemaId,
        ruleVersion: p2Result.ruleVersion,
        state: p2Result.state ?? null,
      }),
      factRefs,
      dossier: Object.freeze({
        schemaId: DOSSIER_RESULT_SCHEMA_ID,
        version: DOSSIER_VERSION,
        ruleVersion: DOSSIER_RULE_VERSION,
      }),
    }),
    factRefs,
    boundedDataLimitations: Object.freeze({
      recordedRealLimitation: true,
      jurisdictionBounded: true,
      nationwideNotClaimed: true,
    }),
    limitations: Object.freeze({
      trustIsNotReadiness: true,
      readinessIsNotOpportunity: true,
      reviewPriorityIsNotTransactionAdvice: true,
      knownEconomicEvidenceIsNotFavorableEconomics: true,
      distressNoneIsNotBadProperty: true,
      optionalAbsenceIsNotUnknown: true,
      staleIsNotFalse: true,
      freshnessIsNotTruth: true,
      unknownFreshnessIsNotCurrent: true,
    }),
  };

  if (economicContext !== undefined) {
    honesty.economicContext = economicContext;
  }
  if (ownerRef !== undefined) {
    honesty.ownerRef = ownerRef;
  }
  if (ownerIdentity !== undefined) {
    honesty.ownerIdentity = ownerIdentity;
  }
  if (omissions.length > 0) {
    honesty.optionalOmissions = Object.freeze(
      omissions.map((o) => Object.freeze({ ...o }))
    );
  }

  const input = Object.freeze({
    decIntakeState: DECISION_INTAKE_STATE,
    factoryKey: pkg.identity?.factory_key ?? intakeMeta.factory_key ?? null,
    packageVersion: pkg.meta?.version ?? intakeMeta.packageVersion ?? null,
    deliveryId: intakeMeta.deliveryId ?? null,
    acceptedAt: intakeMeta.acceptedAt ?? null,
    p2SchemaId: SEMANTICS_RESULT_SCHEMA_ID,
    p2RuleVersion: p2Result.ruleVersion,
    propertyRef: Object.freeze({
      factoryKey: pkg.identity?.factory_key ?? null,
    }),
    jurisdictionRef: Object.freeze({
      jurisdictionId: pkg.identity?.jurisdictionId ?? null,
    }),
  });

  const dossier = deepFreeze(
    buildDossierResult({
      input,
      semantics: Object.freeze(semantics),
      honesty: Object.freeze(honesty),
    })
  );

  return { ok: true, errors: [], dossier };
}

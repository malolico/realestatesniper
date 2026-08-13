/**
 * SP05-P2 — Decision Semantics Engine (DAG-SP05-P2-G1)
 *
 * Bounded deterministic Decision-side semantics from DEC-INTAKE + CB-08/CB-09 FACT.
 * Corrected Freeze binding: VALUE = [DISTRESS_EVIDENCE_STATE] only.
 * SEM-02 lock: distress alone never yields OPPORTUNITY / NOT_OPPORTUNITY.
 *
 * Factory / P1 = READ ONLY. No write-back. No Product / transaction advice.
 */

import { DECISION_INTAKE_STATE } from "../intake/decisionIntakeConsumer.js";
import {
  DISTRESS_STATES,
  SEM01,
  SEM02,
  SEM03,
  SEM06,
  RULE_VERSION,
  VALUE_DIMENSION_ID,
  buildSemanticsResult,
  buildEvidenceVector,
  buildRanking,
} from "./decisionOutputContract.js";

/**
 * Canonical CB-08 distress VALUE signal motors (not CNT contact, not MOT-MOT-05 scorer).
 * Signal types only — no hierarchy / no weights.
 */
const DISTRESS_MOTOR_SPECS = Object.freeze({
  "MOT-MOT-01": Object.freeze({ typedKey: "pre_foreclosure", activeSignal: "pre_foreclosure" }),
  "MOT-MOT-02": Object.freeze({ typedKey: "tax_delinquency", activeSignal: "tax_delinquency" }),
  "MOT-MOT-03": Object.freeze({ typedKey: "repricing", activeSignal: "repricing" }),
  "MOT-MOT-04": Object.freeze({ typedKey: "municipal_enforcement", activeSignal: "municipal_enforcement" }),
  "MOT-LFE-01": Object.freeze({ typedKey: "probate", positiveBool: "probateActive" }),
  "MOT-LFE-04": Object.freeze({ typedKey: "auction", positiveBool: "auctionNotice" }),
  "MOT-COD-01": Object.freeze({ typedKey: "violationCount", positiveNumber: "violationCount" }),
  "MOT-JUD-01": Object.freeze({ typedKey: "caseCount", positiveNumber: "caseCount" }),
});

const CB09_MOTOR_PREFIXES = Object.freeze(["MOT-FIN-", "MOT-HAZ-", "MOT-MKT-", "MOT-INV-"]);

/**
 * @param {object|null|undefined} intake
 * @returns {{ ok: true, intake: object, package: object } | { ok: false, errors: string[] }}
 */
export function assertDecIntakeInput(intake) {
  if (intake == null || typeof intake !== "object") {
    return { ok: false, errors: ["P2 semantics requires DEC-INTAKE intake object"] };
  }
  if (intake.accepted !== true || intake.state !== DECISION_INTAKE_STATE) {
    return {
      ok: false,
      errors: [`P2 semantics requires accepted ${DECISION_INTAKE_STATE} (refused raw/untrusted/diagnostic)`],
    };
  }
  if (intake.package == null || typeof intake.package !== "object") {
    return { ok: false, errors: ["P2 semantics requires immutable Decision package projection"] };
  }
  if (intake.intake?.state != null && intake.intake.state !== DECISION_INTAKE_STATE) {
    return { ok: false, errors: ["intake.state must be DEC-INTAKE"] };
  }
  return { ok: true, intake, package: intake.package };
}

/**
 * @param {object} pkg
 * @returns {object[]}
 */
function readMotorManifests(pkg) {
  const manifests = pkg?.elrExport?.motor_manifests;
  return Array.isArray(manifests) ? manifests : [];
}

/**
 * Classify one distress motor manifest outputs into ACTIVE | NONE | UNKNOWN | CONFLICT.
 * @param {string} motorId
 * @param {object} outputs
 */
function classifyDistressMotorOutputs(motorId, outputs) {
  const spec = DISTRESS_MOTOR_SPECS[motorId];
  if (!spec || outputs == null || typeof outputs !== "object") {
    return null;
  }

  const materialConflict = outputs.conflict === true;
  const typed = spec.typedKey != null ? outputs[spec.typedKey] : undefined;

  let active = false;
  if (outputs.active === true) active = true;
  if (spec.activeSignal && outputs.signal === spec.activeSignal) active = true;
  if (spec.positiveBool && outputs[spec.positiveBool] === true) active = true;
  if (
    spec.positiveNumber &&
    typeof outputs[spec.positiveNumber] === "number" &&
    Number.isFinite(outputs[spec.positiveNumber]) &&
    outputs[spec.positiveNumber] > 0
  ) {
    active = true;
  }

  let unknown = false;
  if (typed === "UNKNOWN") unknown = true;
  if (spec.positiveBool && outputs[spec.positiveBool] === "UNKNOWN") unknown = true;
  if (spec.positiveNumber && outputs[spec.positiveNumber] === "UNKNOWN") unknown = true;

  let none = false;
  if (outputs.signal === "NONE") none = true;
  if (outputs.distressStatus === "NONE" && !active) none = true;
  if (outputs.signal == null && !active && !unknown) none = true;

  return {
    motorId,
    active,
    unknown,
    none,
    materialConflict,
    outputs,
  };
}

/**
 * Aggregate FACT → DISTRESS_EVIDENCE_STATE per corrected Freeze.
 * @param {object[]} manifests
 */
export function deriveDistressEvidenceState(manifests) {
  const observations = [];
  const sourceRefs = [];
  let anyActive = false;
  let anyUnknown = false;
  let anyNone = false;
  let materialConflict = false;
  const conflictContext = [];
  const uncertaintyContext = [];

  for (const m of manifests) {
    const motorId = m?.motorId ?? m?.actor ?? null;
    if (!motorId || !DISTRESS_MOTOR_SPECS[motorId]) continue;

    const classified = classifyDistressMotorOutputs(motorId, m.outputs ?? {});
    if (!classified) continue;

    observations.push(classified);
    sourceRefs.push({
      motorId,
      path: `elrExport.motor_manifests[${motorId}]`,
      signal: m.outputs?.signal ?? null,
      conflict: m.outputs?.conflict === true,
    });

    if (classified.materialConflict) {
      materialConflict = true;
      conflictContext.push({
        motorId,
        kind: "DISTRESS_SIGNAL_CONFLICT",
        material: true,
      });
    }
    if (classified.active) anyActive = true;
    if (classified.unknown) {
      anyUnknown = true;
      uncertaintyContext.push({ motorId, field: "typed_or_positive", status: "UNKNOWN" });
    }
    if (classified.none) anyNone = true;
  }

  // Material conflict affecting distress conclusion → halt state
  if (materialConflict) {
    return {
      state: DISTRESS_STATES.CONFLICT_BLOCKED,
      rationale: "Material unresolved conflict on distress-supporting FACT",
      observations,
      sourceRefs,
      conflictContext,
      uncertaintyContext,
      comparable: false,
    };
  }

  // ACTIVE/PRESENT (+ independent sibling UNKNOWN allowed) → EVIDENCED
  if (anyActive) {
    return {
      state: DISTRESS_STATES.EVIDENCED,
      rationale:
        "Valid canonical ACTIVE/PRESENT distress evidence (sibling UNKNOWN non-material to presence)",
      observations,
      sourceRefs,
      conflictContext,
      uncertaintyContext,
      comparable: true,
    };
  }

  // No distress motor FACT at all → cannot claim conclusive NONE
  if (observations.length === 0) {
    return {
      state: DISTRESS_STATES.UNKNOWN,
      rationale: "No materially applicable CB-08 distress motor FACT present in motor_manifests",
      observations,
      sourceRefs,
      conflictContext,
      uncertaintyContext,
      comparable: false,
    };
  }

  // No ACTIVE + material UNKNOWN → UNKNOWN
  if (anyUnknown) {
    return {
      state: DISTRESS_STATES.UNKNOWN,
      rationale: "No ACTIVE/PRESENT distress; one or more materially applicable UNKNOWN",
      observations,
      sourceRefs,
      conflictContext,
      uncertaintyContext,
      comparable: false,
    };
  }

  // No ACTIVE + all applicable conclusive NONE → NONE
  if (anyNone && observations.every((o) => o.none && !o.active && !o.unknown)) {
    return {
      state: DISTRESS_STATES.NONE,
      rationale: "No ACTIVE/PRESENT; all materially applicable distress signals conclusively NONE",
      observations,
      sourceRefs,
      conflictContext,
      uncertaintyContext,
      comparable: true,
    };
  }

  return {
    state: DISTRESS_STATES.UNKNOWN,
    rationale: "Distress FACT insufficient for conclusive NONE or EVIDENCED",
    observations,
    sourceRefs,
    conflictContext,
    uncertaintyContext,
    comparable: false,
  };
}

/**
 * Map DISTRESS_EVIDENCE_STATE → SEM-01/02/03 (SEM-02 lock preserved).
 * @param {string} distressState
 */
export function mapDistressToSemantics(distressState) {
  if (distressState === DISTRESS_STATES.CONFLICT_BLOCKED) {
    return {
      classifyDeal: SEM01.CONFLICT_BLOCKED,
      opportunity: SEM02.CONFLICT_BLOCKED,
      reviewPriority: SEM03.CONFLICT_BLOCKED,
      halt: SEM06.CONFLICT_BLOCKED,
    };
  }
  if (distressState === DISTRESS_STATES.UNKNOWN) {
    return {
      classifyDeal: SEM01.INSUFFICIENT_EVIDENCE,
      opportunity: SEM02.INSUFFICIENT_EVIDENCE,
      reviewPriority: SEM03.INSUFFICIENT_EVIDENCE,
      halt: SEM06.INSUFFICIENT_EVIDENCE,
    };
  }
  if (distressState === DISTRESS_STATES.EVIDENCED) {
    return {
      classifyDeal: SEM01.OPPORTUNITY_CANDIDATE,
      // SEM-02 special lock: distress alone never OPPORTUNITY / NOT_OPPORTUNITY
      opportunity: SEM02.INSUFFICIENT_EVIDENCE,
      reviewPriority: SEM03.REVIEW_PRIORITY,
      halt: SEM06.INSUFFICIENT_EVIDENCE,
    };
  }
  if (distressState === DISTRESS_STATES.NONE) {
    return {
      classifyDeal: SEM01.NOT_OPPORTUNITY_CANDIDATE,
      opportunity: SEM02.INSUFFICIENT_EVIDENCE,
      reviewPriority: SEM03.DO_NOT_PRIORITIZE,
      halt: SEM06.INSUFFICIENT_EVIDENCE,
    };
  }
  return {
    classifyDeal: SEM01.INSUFFICIENT_EVIDENCE,
    opportunity: SEM02.INSUFFICIENT_EVIDENCE,
    reviewPriority: SEM03.INSUFFICIENT_EVIDENCE,
    halt: SEM06.INSUFFICIENT_EVIDENCE,
  };
}

/**
 * CB-09 context snapshot — evidence/context only (not VALUE).
 * @param {object[]} manifests
 */
export function extractEconomicContext(manifests) {
  const economic = [];
  for (const m of manifests) {
    const motorId = m?.motorId ?? m?.actor ?? null;
    if (!motorId || !CB09_MOTOR_PREFIXES.some((p) => motorId.startsWith(p))) continue;
    const outputs = m.outputs ?? {};
    economic.push({
      motorId,
      fullCashValue:
        typeof outputs.fullCashValue === "number" ? outputs.fullCashValue : outputs.fullCashValue ?? null,
      equity: outputs.equity ?? null,
      mortgageBalance: outputs.mortgageBalance ?? null,
      roi: outputs.roi ?? null,
      note: "CB-09 evidence/context only — not VALUE attractiveness",
    });
  }
  return economic;
}

/**
 * Evaluate one DEC-INTAKE candidate.
 *
 * @param {object} intakeResult — consumeTrustedDecisionPackage result
 * @param {{
 *   candidateSetId?: string|null,
 *   rank?: number|null,
 *   unrelatedConflictContext?: object[],
 * }} [options]
 */
export function evaluateDecisionSemantics(intakeResult, options = {}) {
  const gate = assertDecIntakeInput(intakeResult);
  if (!gate.ok) {
    return {
      ok: false,
      errors: gate.errors,
      result: null,
    };
  }

  const pkg = gate.package;
  const intakeMeta = intakeResult.intake ?? {};
  const manifests = readMotorManifests(pkg);

  // Preserve unrelated conflicts as context only (does not alter distress state)
  const unrelatedConflictContext = Array.isArray(options.unrelatedConflictContext)
    ? options.unrelatedConflictContext
    : extractUnrelatedConflicts(pkg);

  const distress = deriveDistressEvidenceState(manifests);
  const mapped = mapDistressToSemantics(distress.state);
  const economicContext = extractEconomicContext(manifests);

  const evidenceVector = buildEvidenceVector({
    value: distress.state,
    rationale: distress.rationale,
    kind: "DERIVED",
  });

  const comparable = distress.comparable === true;
  const ranking = buildRanking({
    rank: comparable ? (options.rank ?? 1) : null,
    candidateSetId: options.candidateSetId ?? null,
    comparable,
  });

  const freshnessContext = pkg?.truthAccounting?.freshness ?? null;

  const result = buildSemanticsResult({
    input: {
      decIntakeState: DECISION_INTAKE_STATE,
      factoryKey: pkg.identity?.factory_key ?? intakeMeta.factory_key ?? null,
      packageVersion: pkg.meta?.version ?? intakeMeta.packageVersion ?? null,
      deliveryId: intakeMeta.deliveryId ?? null,
      interfaceId: intakeMeta.interfaceId ?? null,
      acceptedAt: intakeMeta.acceptedAt ?? null,
    },
    classifyDeal: { state: mapped.classifyDeal },
    opportunity: { state: mapped.opportunity },
    reviewPriority: { state: mapped.reviewPriority },
    evidenceVector,
    ranking,
    halt: mapped.halt,
    trace: Object.freeze({
      ruleVersion: RULE_VERSION,
      valueVector: Object.freeze([VALUE_DIMENSION_ID]),
      distressDerivation: Object.freeze({
        state: distress.state,
        rationale: distress.rationale,
        observations: distress.observations,
      }),
      sourceFactRefs: Object.freeze(distress.sourceRefs),
      uncertaintyContext: Object.freeze(distress.uncertaintyContext),
      conflictContext: Object.freeze({
        materialDistress: distress.conflictContext,
        unrelatedPreserved: unrelatedConflictContext,
      }),
      freshnessContext,
      economicContextOnly: Object.freeze(economicContext),
      derivedOutputs: Object.freeze({
        classifyDeal: mapped.classifyDeal,
        opportunity: mapped.opportunity,
        reviewPriority: mapped.reviewPriority,
        distressState: distress.state,
      }),
      notes: Object.freeze([
        "SEM-02 lock: distress alone never derives OPPORTUNITY or NOT_OPPORTUNITY",
        "CB-09 FACT is evidence/context only — not VALUE attractiveness",
        "NOT_OPPORTUNITY_CANDIDATE / DO_NOT_PRIORITIZE bounded to distress VALUE axis",
        "reviewPriority ≠ transaction advice",
      ]),
    }),
  });

  return { ok: true, errors: [], result, distress };
}

/**
 * @param {object} pkg
 */
function extractUnrelatedConflicts(pkg) {
  const conflicts = pkg?.truthAccounting?.conflicts?.conflicts;
  if (!Array.isArray(conflicts)) return [];
  return conflicts.map((c) => ({
    conflictId: c.conflictId ?? null,
    field: c.field ?? null,
    conflictState: c.conflictState ?? null,
    materialToDistress: false,
  }));
}

/**
 * Lexicographic ranking among supplied candidates (EVIDENCED > NONE).
 * UNKNOWN / CONFLICT_BLOCKED remain outside normal ranking (ties not invented).
 *
 * @param {Array<{ id: string, result: object }>} candidates
 * @param {string} candidateSetId
 */
export function rankSuppliedCandidates(candidates, candidateSetId) {
  const list = Array.isArray(candidates) ? candidates : [];
  const evidenced = [];
  const none = [];
  const nonComparable = [];

  for (const c of list) {
    const value = c?.result?.evidenceVector?.dimensions?.[0]?.value ?? null;
    if (value === DISTRESS_STATES.EVIDENCED) evidenced.push(c);
    else if (value === DISTRESS_STATES.NONE) none.push(c);
    else nonComparable.push(c);
  }

  // Stable order within same state → legitimate ties (same rank band via sequential
  // ranks without inventing secondary keys: equal states get consecutive ranks only
  // by supply order; identical vector values remain same-state ties for comparison).
  const ranked = [];
  let rank = 1;
  for (const c of evidenced) {
    ranked.push({
      id: c.id,
      rank,
      distressState: DISTRESS_STATES.EVIDENCED,
      comparable: true,
      result: c.result,
    });
    rank += 1;
  }
  for (const c of none) {
    ranked.push({
      id: c.id,
      rank,
      distressState: DISTRESS_STATES.NONE,
      comparable: true,
      result: c.result,
    });
    rank += 1;
  }
  for (const c of nonComparable) {
    ranked.push({
      id: c.id,
      rank: null,
      distressState: c?.result?.evidenceVector?.dimensions?.[0]?.value ?? null,
      comparable: false,
      result: c.result,
    });
  }

  return Object.freeze({
    candidateSetId,
    meaning: "REVIEW_PRIORITY_AMONG_SUPPLIED_CANDIDATES",
    order: Object.freeze(ranked),
    comparison: Object.freeze({
      rule: "EVIDENCED > NONE",
      unknownNonComparable: true,
      conflictHalts: true,
      noInventedTieBreakers: true,
    }),
  });
}

/**
 * Compare two comparable distress states for lexicographic priority.
 * @param {string} a
 * @param {string} b
 * @returns {-1|0|1|null} null if either non-comparable
 */
export function compareDistressStates(a, b) {
  const comparable = new Set([DISTRESS_STATES.EVIDENCED, DISTRESS_STATES.NONE]);
  if (!comparable.has(a) || !comparable.has(b)) return null;
  if (a === b) return 0;
  if (a === DISTRESS_STATES.EVIDENCED && b === DISTRESS_STATES.NONE) return -1;
  if (a === DISTRESS_STATES.NONE && b === DISTRESS_STATES.EVIDENCED) return 1;
  return 0;
}

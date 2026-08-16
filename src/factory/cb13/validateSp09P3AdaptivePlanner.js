/**
 * SP09-P3 — Adaptive Planner V1 validation (T01–T16)
 *
 * Runnable:
 *   node src/factory/cb13/validateSp09P3AdaptivePlanner.js
 */

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import {
  planAdaptiveResearch,
} from "./adaptivePlanner.js";
import {
  CAPABILITY_NEED,
} from "./capabilitySemantics.js";
import {
  PLANNING_DECISION_STATUS,
  RESEARCH_ACTION_ROLE,
  RESEARCH_QUESTION_STATUS,
  buildResearchAction,
  buildResearchQuestion,
  validatePlanningDecision,
} from "./researchContracts.js";
import { runSp09P1ResearchContractsValidation } from "./validateSp09P1ResearchContracts.js";
import { runSp09P2CapabilitySemanticsValidation } from "./validateSp09P2CapabilitySemantics.js";
import { runCb13Validation } from "./validateCb13.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const FACTORY_KEY = "expediente.sp09-p3.demo-001";
const QUESTION_ID = "rq-sp09-p3-001";

function pass(id, errors = []) {
  return { id, passed: errors.length === 0, errors };
}

function buildQuestion() {
  return buildResearchQuestion({
    researchQuestionId: QUESTION_ID,
    factoryKey: FACTORY_KEY,
    question: "What research action should proceed next under current state?",
    status: RESEARCH_QUESTION_STATUS.OPEN,
  });
}

function buildCandidate(actionId, capabilityNeed) {
  return {
    action: buildResearchAction({
      researchActionId: actionId,
      researchQuestionId: QUESTION_ID,
      role: RESEARCH_ACTION_ROLE.CANDIDATE,
      description: `candidate for ${capabilityNeed}`,
    }),
    capabilityNeed,
  };
}

/** Shared candidate set: evidence-gap + multi-domain (ids ordered for tie tests). */
function sharedCandidates() {
  return [
    buildCandidate("ra-evidence-01", CAPABILITY_NEED.EVIDENCE_SUFFICIENCY_GAP),
    buildCandidate("ra-multidomain-01", CAPABILITY_NEED.MULTI_DOMAIN_SUFFICIENCY),
  ];
}

function baseInput(overrides = {}) {
  return {
    planningDecisionId: "pd-sp09-p3-001",
    question: buildQuestion(),
    candidates: sharedCandidates(),
    state: {
      evidenceSufficient: false,
      multiDomainGap: false,
      openConflicts: 0,
    },
    ...overrides,
  };
}

function t01() {
  const errors = [];
  const r = planAdaptiveResearch(
    baseInput({
      state: {
        evidenceSufficient: false,
        multiDomainGap: false,
        openConflicts: 0,
      },
    })
  );
  if (!r.ok) errors.push(...r.errors);
  if (r.decision?.status !== PLANNING_DECISION_STATUS.ACCEPTED) {
    errors.push("expected ACCEPTED");
  }
  if (r.decision?.researchActionId !== "ra-evidence-01") {
    errors.push("expected evidence-gap ResearchAction ra-evidence-01");
  }
  return pass("T01", errors);
}

function t02() {
  const errors = [];
  const r = planAdaptiveResearch(
    baseInput({
      planningDecisionId: "pd-sp09-p3-002",
      state: {
        evidenceSufficient: false,
        multiDomainGap: true,
        openConflicts: 0,
      },
    })
  );
  if (!r.ok) errors.push(...r.errors);
  if (r.decision?.status !== PLANNING_DECISION_STATUS.ACCEPTED) {
    errors.push("expected ACCEPTED");
  }
  if (r.decision?.researchActionId !== "ra-multidomain-01") {
    errors.push("expected multi-domain ResearchAction ra-multidomain-01");
  }
  if (r.decision?.researchActionId === "ra-evidence-01") {
    errors.push("T02 selection must differ from T01 evidence selection");
  }
  return pass("T02", errors);
}

function t03() {
  const errors = [];
  const input = baseInput({
    planningDecisionId: "pd-sp09-p3-det",
    state: {
      evidenceSufficient: false,
      multiDomainGap: false,
      openConflicts: 0,
    },
  });
  const a = planAdaptiveResearch(input);
  const b = planAdaptiveResearch(input);
  if (!a.ok || !b.ok) errors.push(...(a.errors ?? []), ...(b.errors ?? []));
  if (JSON.stringify(a.decision) !== JSON.stringify(b.decision)) {
    errors.push("identical inputs must produce identical PlanningDecision");
  }
  return pass("T03", errors);
}

function t04() {
  const errors = [];
  const r = planAdaptiveResearch(
    baseInput({
      planningDecisionId: "pd-sp09-p3-tie",
      candidates: [
        buildCandidate("ra-zzz", CAPABILITY_NEED.EVIDENCE_SUFFICIENCY_GAP),
        buildCandidate("ra-aaa", CAPABILITY_NEED.EVIDENCE_SUFFICIENCY_GAP),
        buildCandidate("ra-mmm", CAPABILITY_NEED.EVIDENCE_SUFFICIENCY_GAP),
      ],
      state: {
        evidenceSufficient: false,
        multiDomainGap: false,
        openConflicts: 0,
      },
    })
  );
  if (!r.ok) errors.push(...r.errors);
  if (r.decision?.researchActionId !== "ra-aaa") {
    errors.push(`expected lexical tie-break ra-aaa (got ${r.decision?.researchActionId})`);
  }
  if (r.decision?.status !== PLANNING_DECISION_STATUS.ACCEPTED) {
    errors.push("expected ACCEPTED on tie-break path");
  }
  return pass("T04", errors);
}

function t05() {
  const errors = [];
  const r = planAdaptiveResearch(
    baseInput({
      planningDecisionId: "pd-sp09-p3-conflict",
      state: {
        evidenceSufficient: false,
        multiDomainGap: true,
        openConflicts: 2,
      },
    })
  );
  if (!r.ok) errors.push(...r.errors);
  if (r.decision?.status !== PLANNING_DECISION_STATUS.CONFLICT) {
    errors.push("expected CONFLICT");
  }
  if (r.decision?.status === PLANNING_DECISION_STATUS.ACCEPTED) {
    errors.push("CONFLICT must not ACCEPTED");
  }
  if (!String(r.decision?.rationale ?? "").includes("non-selection contractual reference")) {
    errors.push("rationale must state non-selection contractual reference");
  }
  if (!String(r.decision?.rationale ?? "").includes("conflict blocked")) {
    errors.push("rationale must state conflict blocked acceptance");
  }
  return pass("T05", errors);
}

function t06() {
  const errors = [];
  const r = planAdaptiveResearch(
    baseInput({
      planningDecisionId: "pd-sp09-p3-unresolved",
      candidates: [
        buildCandidate("ra-u1", "unsupported-need-alpha"),
        buildCandidate("ra-u2", "unsupported-need-beta"),
      ],
      state: {
        evidenceSufficient: false,
        multiDomainGap: false,
        openConflicts: 0,
      },
    })
  );
  if (!r.ok) errors.push(...r.errors);
  if (r.decision?.status !== PLANNING_DECISION_STATUS.REFUSED) {
    errors.push("expected REFUSED when all UNRESOLVED");
  }
  if (r.decision?.status === PLANNING_DECISION_STATUS.ACCEPTED) {
    errors.push("must never ACCEPTED when all UNRESOLVED");
  }
  return pass("T06", errors);
}

function t07() {
  const errors = [];
  const r = planAdaptiveResearch(
    baseInput({
      planningDecisionId: "pd-sp09-p3-nosub",
      candidates: [
        buildCandidate("ra-md-only", CAPABILITY_NEED.MULTI_DOMAIN_SUFFICIENCY),
        buildCandidate("ra-own-only", CAPABILITY_NEED.OWNERSHIP_RECORD),
      ],
      state: {
        evidenceSufficient: false,
        multiDomainGap: false,
        openConflicts: 0,
      },
    })
  );
  if (!r.ok) errors.push(...r.errors);
  if (r.decision?.status !== PLANNING_DECISION_STATUS.REFUSED) {
    errors.push("expected REFUSED when evidence trigger lacks MATCHED evidence candidate");
  }
  if (r.decision?.researchActionId === "ra-md-only" && r.decision?.status === PLANNING_DECISION_STATUS.ACCEPTED) {
    errors.push("must not substitute multi-domain for evidence trigger");
  }
  if (r.decision?.status === PLANNING_DECISION_STATUS.ACCEPTED) {
    errors.push("no unrelated capability substitution");
  }
  return pass("T07", errors);
}

function t08() {
  const errors = [];
  const r = planAdaptiveResearch(
    baseInput({
      planningDecisionId: "pd-sp09-p3-notrigger",
      state: {
        evidenceSufficient: true,
        multiDomainGap: false,
        openConflicts: 0,
      },
    })
  );
  if (!r.ok) errors.push(...r.errors);
  if (r.decision?.status !== PLANNING_DECISION_STATUS.REFUSED) {
    errors.push("expected REFUSED when no V1 research trigger");
  }
  if (!String(r.decision?.rationale ?? "").includes("no current research trigger")) {
    errors.push("rationale must explain no V1 research trigger");
  }
  return pass("T08", errors);
}

function t09() {
  const errors = [];
  const cases = [
    { label: "bad question", input: baseInput({ question: null }) },
    {
      label: "bad envelope",
      input: baseInput({ candidates: [{ action: null, capabilityNeed: "x" }] }),
    },
    {
      label: "bad state",
      input: baseInput({ state: { evidenceSufficient: "no" } }),
    },
    {
      label: "mismatched question id",
      input: baseInput({
        candidates: [
          {
            action: buildResearchAction({
              researchActionId: "ra-mismatch",
              researchQuestionId: "rq-other",
              role: RESEARCH_ACTION_ROLE.CANDIDATE,
            }),
            capabilityNeed: CAPABILITY_NEED.EVIDENCE_SUFFICIENCY_GAP,
          },
        ],
      }),
    },
    {
      label: "non-CANDIDATE",
      input: baseInput({
        candidates: [
          {
            action: buildResearchAction({
              researchActionId: "ra-selected",
              researchQuestionId: QUESTION_ID,
              role: RESEARCH_ACTION_ROLE.SELECTED,
            }),
            capabilityNeed: CAPABILITY_NEED.EVIDENCE_SUFFICIENCY_GAP,
          },
        ],
      }),
    },
  ];
  for (const c of cases) {
    const r = planAdaptiveResearch(c.input);
    if (r.ok || r.decision != null) {
      errors.push(`${c.label}: expected fail closed`);
    }
  }
  return pass("T09", errors);
}

function t10() {
  const errors = [];
  const accepted = planAdaptiveResearch(baseInput());
  const refused = planAdaptiveResearch(
    baseInput({
      planningDecisionId: "pd-rationale-refused",
      state: { evidenceSufficient: true, multiDomainGap: false, openConflicts: 0 },
    })
  );
  for (const r of [accepted, refused]) {
    if (!r.ok) errors.push(...r.errors);
    if (!NON_EMPTY(r.decision?.rationale)) {
      errors.push("rationale must be present");
    }
    const v = validatePlanningDecision(r.decision);
    if (!v.ok) errors.push(...v.errors);
  }
  if (!String(refused.decision?.rationale ?? "").includes("non-selection contractual reference")) {
    errors.push("REFUSED rationale must explain non-selection semantics");
  }
  if (!String(accepted.decision?.rationale ?? "").includes("WHAT to research next")) {
    errors.push("ACCEPTED rationale must explain WHAT");
  }
  return pass("T10", errors);
}

function NON_EMPTY(v) {
  return typeof v === "string" && v.trim().length > 0;
}

function t11() {
  const errors = [];
  const src = fs.readFileSync(path.join(__dirname, "adaptivePlanner.js"), "utf8");
  for (const token of [
    "MotorRuntime",
    "motorRuntime",
    "LoopEngineService",
    "loopEngineService",
    "SwarmCoordinatorService",
    "swarmCoordinatorService",
    "ffoOrchestrat",
    ".execute(",
  ]) {
    if (src.includes(token)) {
      errors.push(`adaptivePlanner must not reference execution surface: ${token}`);
    }
  }
  const r = planAdaptiveResearch(baseInput());
  if (r.decision?.executionAuthorized !== false) {
    errors.push("executionAuthorized must be false");
  }
  if (r.decision?.acceptedIsNotExecutionAuthorization !== true) {
    errors.push("must declare ACCEPTED is not execution authorization");
  }
  return pass("T11", errors);
}

function t12() {
  const errors = [];
  const src = fs.readFileSync(path.join(__dirname, "adaptivePlanner.js"), "utf8");
  for (const token of [
    "EvidenceService",
    "evidenceService",
    "acceptEvidence",
    "ingestIntelligenceEvidence",
    "evaluateFactCompleteness",
  ]) {
    if (src.includes(token)) {
      errors.push(`adaptivePlanner must not mutate Evidence/Fact: ${token}`);
    }
  }
  const r = planAdaptiveResearch(baseInput());
  if (r.decision?.isEvidence !== false || r.decision?.isFact !== false) {
    errors.push("decision must deny Evidence/Fact authority");
  }
  if (r.decision?.evidenceAuthority !== "CB-06") {
    errors.push("evidenceAuthority must remain CB-06");
  }
  return pass("T12", errors);
}

function t13() {
  const errors = [];
  const r = planAdaptiveResearch(baseInput({ planningDecisionId: "pd-once" }));
  if (!r.ok || !r.decision) {
    errors.push("expected one PlanningDecision");
    return pass("T13", errors);
  }
  const src = fs.readFileSync(path.join(__dirname, "adaptivePlanner.js"), "utf8");
  if (/while\s*\(\s*true\s*\)/.test(src) || /for\s*\(\s*;\s*;\s*\)/.test(src)) {
    errors.push("planner must not implement unbounded planning loop");
  }
  if (/function\s+replan|planUntil|boundedReplan/i.test(src)) {
    errors.push("planner must not implement P6 replan helpers");
  }
  if (typeof r.decision !== "object" || Array.isArray(r.decision)) {
    errors.push("decision must be a single object");
  }
  // One call yields one decision object — no nested decisions array
  if (r.decisions != null || r.history != null) {
    errors.push("must not emit multi-step planning history");
  }
  return pass("T13", errors);
}

function t14() {
  const errors = [];
  const p1 = runSp09P1ResearchContractsValidation();
  if (!p1.passed) {
    errors.push(
      `P1 failed: ${p1.results.filter((x) => !x.passed).map((x) => x.id).join(",")}`
    );
  }
  return pass("T14", errors);
}

async function t15() {
  const errors = [];
  const p2 = await runSp09P2CapabilitySemanticsValidation();
  if (!p2.passed) {
    errors.push(
      `P2 failed: ${p2.results.filter((x) => !x.passed).map((x) => x.id).join(",")}`
    );
  }
  return pass("T15", errors);
}

async function t16() {
  const errors = [];
  try {
    const result = await runCb13Validation({});
    if (!result.passed) {
      errors.push(`CB13 regression failed: ${(result.errors ?? []).join("; ")}`);
    }
  } catch (e) {
    errors.push(String(e.message ?? e));
  }
  return pass("T16", errors);
}

/**
 * @returns {Promise<{ passed: boolean, results: object[] }>}
 */
export async function runSp09P3AdaptivePlannerValidation() {
  const results = [
    t01(),
    t02(),
    t03(),
    t04(),
    t05(),
    t06(),
    t07(),
    t08(),
    t09(),
    t10(),
    t11(),
    t12(),
    t13(),
    t14(),
    await t15(),
    await t16(),
  ];
  return {
    passed: results.every((r) => r.passed),
    results,
  };
}

const isMain =
  process.argv[1] &&
  (process.argv[1].endsWith("validateSp09P3AdaptivePlanner.js") ||
    process.argv[1].includes("validateSp09P3AdaptivePlanner"));

if (isMain) {
  const result = await runSp09P3AdaptivePlannerValidation();
  console.log("=== SP09-P3 Adaptive Planner V1 Validation ===\n");
  console.log(JSON.stringify(result, null, 2));
  if (!result.passed) {
    console.error("\n❌ SP09-P3 validation FAILED");
    process.exit(1);
  }
  console.log("\n✅ SP09-P3 validation PASSED");
  process.exit(0);
}

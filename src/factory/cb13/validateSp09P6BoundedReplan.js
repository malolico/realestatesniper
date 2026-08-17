/**
 * SP09-P6 — Bounded Re-plan validation (T01–T31)
 *
 * Runnable:
 *   node src/factory/cb13/validateSp09P6BoundedReplan.js
 */

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import {
  PLANNING_DECISION_STATUS,
  RESEARCH_ACTION_ROLE,
  RESEARCH_QUESTION_STATUS,
  buildResearchAction,
  buildResearchQuestion,
  validatePlanningDecision,
} from "./researchContracts.js";
import { CAPABILITY_NEED } from "./capabilitySemantics.js";
import { validateResearchPlannerStateV1 } from "./adaptivePlanner.js";
import { EVIDENCE_FEEDBACK_KIND } from "./evidenceFeedback.js";
import {
  BOUNDED_REPLAN_DISPOSITION,
  BOUNDED_REPLAN_PROGRAM,
  applyBoundedReplan,
} from "./boundedReplan.js";
import { runSp09P1ResearchContractsValidation } from "./validateSp09P1ResearchContracts.js";
import { runSp09P2CapabilitySemanticsValidation } from "./validateSp09P2CapabilitySemantics.js";
import { runSp09P3AdaptivePlannerValidation } from "./validateSp09P3AdaptivePlanner.js";
import { runSp09P4ResearchExecutionBridgeValidation } from "./validateSp09P4ResearchExecutionBridge.js";
import { runSp09P5EvidenceFeedbackValidation } from "./validateSp09P5EvidenceFeedback.js";
import { runCb13Validation } from "./validateCb13.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const FACTORY_KEY = "expediente.sp09-p6.demo-001";
const QUESTION_ID = "rq-sp09-p6-001";

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

function sharedCandidates() {
  return [
    buildCandidate("ra-evidence-01", CAPABILITY_NEED.EVIDENCE_SUFFICIENCY_GAP),
    buildCandidate("ra-multidomain-01", CAPABILITY_NEED.MULTI_DOMAIN_SUFFICIENCY),
  ];
}

function v1(overrides = {}) {
  return {
    evidenceSufficient: false,
    multiDomainGap: false,
    openConflicts: 0,
    ...overrides,
  };
}

function p5Observation(evidenceSufficient, multiDomainGap, extra = {}) {
  return {
    ok: true,
    errors: [],
    evidenceMinted: false,
    feedbackKind: EVIDENCE_FEEDBACK_KIND.STATE_OBSERVATION,
    stateObservation: { evidenceSufficient, multiDomainGap, ...extra },
    ...extra.envelope,
  };
}

function p5Registered() {
  return {
    ok: true,
    errors: [],
    evidenceMinted: true,
    feedbackKind: EVIDENCE_FEEDBACK_KIND.EVIDENCE_REGISTERED,
    sufficiency: { status: "PASS", reasons: [], rule: "EVF-05" },
    evidenceRefs: [{ kind: "EVIDENCE_REF", id: "EVD-fixture" }],
  };
}

function p5NonMaterial() {
  return {
    ok: true,
    errors: [],
    evidenceMinted: false,
    feedbackKind: EVIDENCE_FEEDBACK_KIND.NON_MATERIAL,
    stateObservation: null,
  };
}

function p5Rejected() {
  return {
    ok: false,
    errors: ["rejected"],
    evidenceMinted: false,
    feedbackKind: EVIDENCE_FEEDBACK_KIND.REJECTED,
    stateObservation: null,
  };
}

function baseInput(overrides = {}) {
  return {
    planningDecisionId: "pd-sp09-p6-001",
    question: buildQuestion(),
    candidates: sharedCandidates(),
    previousState: v1(),
    previousAction: null,
    feedback: p5Observation(false, false),
    openConflicts: 0,
    ...overrides,
  };
}

function t01() {
  const errors = [];
  const r = applyBoundedReplan(
    baseInput({
      previousState: v1({ evidenceSufficient: true, multiDomainGap: false, openConflicts: 0 }),
      feedback: p5Observation(false, true),
      openConflicts: 3,
    })
  );
  const s = r.stateUsed;
  const check = validateResearchPlannerStateV1(s);
  if (!check.ok) errors.push(...check.errors);
  if (s?.evidenceSufficient !== false) errors.push("must map observation.evidenceSufficient");
  if (s?.multiDomainGap !== true) errors.push("must map observation.multiDomainGap");
  if (s?.openConflicts !== 3) errors.push("must use caller openConflicts=3");
  return pass("T01", errors);
}

function t02() {
  const errors = [];
  const obs = p5Observation(true, false, { openConflicts: 99, notAPlannerField: true });
  const r = applyBoundedReplan(
    baseInput({
      previousState: v1({ openConflicts: 1 }),
      feedback: obs,
      openConflicts: 0,
    })
  );
  if (r.stateUsed?.openConflicts !== 0) {
    errors.push("must not take openConflicts from stateObservation");
  }
  if (r.stateUsed && Object.keys(r.stateUsed).length !== 3) {
    errors.push("stateUsed must be exact V1 triple");
  }
  const asV1 = validateResearchPlannerStateV1(obs.stateObservation);
  if (asV1.ok) errors.push("stateObservation with extra keys must not be a valid V1");
  const missing = validateResearchPlannerStateV1({
    evidenceSufficient: true,
    multiDomainGap: false,
  });
  if (missing.ok) errors.push("observation without openConflicts must not be accepted as V1");
  return pass("T02", errors);
}

function t03() {
  const errors = [];
  const r = applyBoundedReplan(
    baseInput({
      previousState: v1({ evidenceSufficient: false }),
      feedback: p5Registered(),
      openConflicts: 0,
    })
  );
  if (r.stateUsed?.evidenceSufficient !== false) {
    errors.push("EVIDENCE_REGISTERED must not set evidenceSufficient:true");
  }
  return pass("T03", errors);
}

function t04() {
  const errors = [];
  const r = applyBoundedReplan(
    baseInput({
      previousState: v1({ evidenceSufficient: true, multiDomainGap: true }),
      feedback: p5NonMaterial(),
      openConflicts: 0,
    })
  );
  if (r.stateUsed?.evidenceSufficient !== true) errors.push("NON_MATERIAL must preserve evidenceSufficient");
  if (r.stateUsed?.multiDomainGap !== true) errors.push("NON_MATERIAL must preserve multiDomainGap");
  return pass("T04", errors);
}

function t05() {
  const errors = [];
  const r = applyBoundedReplan(
    baseInput({
      previousState: v1({ evidenceSufficient: false, multiDomainGap: false }),
      previousAction: {
        researchActionId: "ra-evidence-01",
        capabilityNeed: CAPABILITY_NEED.EVIDENCE_SUFFICIENCY_GAP,
      },
      feedback: p5Rejected(),
      openConflicts: 0,
    })
  );
  if (r.stateUsed?.evidenceSufficient !== false) errors.push("REJECTED must preserve evidenceSufficient");
  if (r.stateUsed?.multiDomainGap !== false) errors.push("REJECTED must preserve multiDomainGap");
  if (r.disposition === BOUNDED_REPLAN_DISPOSITION.CONTINUE) {
    errors.push("REJECTED feedback must not fabricate CONTINUE progress");
  }
  return pass("T05", errors);
}

function t06() {
  const errors = [];
  const r = applyBoundedReplan(
    baseInput({
      previousState: v1({ openConflicts: 0 }),
      feedback: p5NonMaterial(),
      openConflicts: 2,
    })
  );
  if (r.stateUsed?.openConflicts !== 2) errors.push("caller openConflicts must change nextState");
  if (r.stateChanged !== true) errors.push("openConflicts change is material");
  return pass("T06", errors);
}

function t07() {
  const errors = [];
  for (const bad of [undefined, null, -1, 1.5, "0", true]) {
    const r = applyBoundedReplan(baseInput({ openConflicts: bad }));
    if (r.disposition !== BOUNDED_REPLAN_DISPOSITION.REJECTED) {
      errors.push(`openConflicts=${JSON.stringify(bad)} must REJECTED`);
    }
    if (r.plannerInvocations !== 0) {
      errors.push(`openConflicts=${JSON.stringify(bad)} must not invoke planner`);
    }
  }
  return pass("T07", errors);
}

function t08() {
  const errors = [];
  const input = baseInput({
    planningDecisionId: "pd-sp09-p6-det",
    feedback: p5Observation(false, false),
    openConflicts: 0,
  });
  const a = applyBoundedReplan(input);
  const b = applyBoundedReplan(input);
  if (JSON.stringify(a.decision) !== JSON.stringify(b.decision)) {
    errors.push("identical inputs must yield identical PlanningDecision");
  }
  if (a.disposition !== b.disposition) errors.push("disposition must be deterministic");
  return pass("T08", errors);
}

function t09() {
  const errors = [];
  const evidence = applyBoundedReplan(
    baseInput({
      planningDecisionId: "pd-sp09-p6-a",
      previousState: v1({ evidenceSufficient: true }),
      feedback: p5Observation(false, false),
      openConflicts: 0,
    })
  );
  const multi = applyBoundedReplan(
    baseInput({
      planningDecisionId: "pd-sp09-p6-b",
      previousState: v1({ evidenceSufficient: true }),
      feedback: p5Observation(false, true),
      openConflicts: 0,
    })
  );
  if (evidence.decision?.researchActionId === multi.decision?.researchActionId) {
    errors.push("material V1 change must be able to change selected action");
  }
  return pass("T09", errors);
}

function t10() {
  const errors = [];
  const r = applyBoundedReplan(
    baseInput({
      previousState: v1({ evidenceSufficient: true, multiDomainGap: false }),
      previousAction: {
        researchActionId: "ra-multidomain-01",
        capabilityNeed: CAPABILITY_NEED.MULTI_DOMAIN_SUFFICIENCY,
      },
      feedback: p5Observation(false, false),
      openConflicts: 0,
    })
  );
  if (r.decision?.status !== PLANNING_DECISION_STATUS.ACCEPTED) {
    errors.push("expected ACCEPTED");
  }
  if (r.decision?.researchActionId !== "ra-evidence-01") {
    errors.push("expected new action ra-evidence-01");
  }
  if (r.disposition !== BOUNDED_REPLAN_DISPOSITION.CONTINUE) {
    errors.push(`expected CONTINUE, got ${r.disposition}`);
  }
  return pass("T10", errors);
}

function t11() {
  const errors = [];
  const r = applyBoundedReplan(
    baseInput({
      previousAction: {
        researchActionId: "ra-evidence-01",
        capabilityNeed: CAPABILITY_NEED.EVIDENCE_SUFFICIENCY_GAP,
      },
      feedback: p5Observation(false, false),
      openConflicts: 0,
    })
  );
  if (r.decision?.status !== PLANNING_DECISION_STATUS.ACCEPTED) {
    errors.push("expected ACCEPTED");
  }
  if (r.decision?.researchActionId !== "ra-evidence-01") {
    errors.push("expected same action ra-evidence-01");
  }
  if (r.disposition !== BOUNDED_REPLAN_DISPOSITION.NO_PROGRESS) {
    errors.push(`expected NO_PROGRESS, got ${r.disposition}`);
  }
  return pass("T11", errors);
}

function t12() {
  const errors = [];
  const r = applyBoundedReplan(
    baseInput({
      previousState: v1({ evidenceSufficient: false, multiDomainGap: false, openConflicts: 0 }),
      previousAction: { researchActionId: "ra-evidence-01" },
      feedback: p5Observation(false, false),
      openConflicts: 0,
    })
  );
  if (r.stateChanged !== false) errors.push("V1 triple must be unchanged");
  if (r.disposition !== BOUNDED_REPLAN_DISPOSITION.NO_PROGRESS) {
    errors.push("same action + same V1 must be NO_PROGRESS");
  }
  if (r.plannerInvocations !== 1) {
    errors.push("exactly one planner call for this path (no second call)");
  }
  return pass("T12", errors);
}

function t13() {
  const errors = [];
  const r = applyBoundedReplan(
    baseInput({
      previousState: v1({ evidenceSufficient: false }),
      feedback: p5Observation(true, false),
      openConflicts: 0,
    })
  );
  if (r.decision?.status !== PLANNING_DECISION_STATUS.REFUSED) {
    errors.push("expected P3 REFUSED (no V1 trigger)");
  }
  if (r.disposition !== BOUNDED_REPLAN_DISPOSITION.STOP) {
    errors.push(`expected STOP, got ${r.disposition}`);
  }
  return pass("T13", errors);
}

function t14() {
  const errors = [];
  const r = applyBoundedReplan(
    baseInput({
      feedback: p5NonMaterial(),
      openConflicts: 2,
    })
  );
  if (r.decision?.status !== PLANNING_DECISION_STATUS.CONFLICT) {
    errors.push("expected P3 CONFLICT");
  }
  if (r.disposition !== BOUNDED_REPLAN_DISPOSITION.REJECTED) {
    errors.push(`CONFLICT must map to REJECTED (got ${r.disposition})`);
  }
  if (r.disposition === "WAIT" || r.disposition === "HUMAN_REVIEW_REQUIRED") {
    errors.push("must not invent WAIT/HUMAN_REVIEW");
  }
  return pass("T14", errors);
}

function t15() {
  const errors = [];
  const plannerSrc = fs.readFileSync(path.join(__dirname, "adaptivePlanner.js"), "utf8");
  if (/status:\s*PLANNING_DECISION_STATUS\.UNKNOWN/.test(plannerSrc)) {
    errors.push("P3 emit of UNKNOWN would be unexpected; P6 must still fail-closed");
  }
  const p6Src = fs.readFileSync(path.join(__dirname, "boundedReplan.js"), "utf8");
  if (!p6Src.includes("PLANNING_DECISION_STATUS.UNKNOWN")) {
    errors.push("P6 must fail-closed map UNKNOWN if ever present");
  }
  return pass("T15", errors);
}

function t16() {
  const errors = [];
  const results = [
    applyBoundedReplan(baseInput()),
    applyBoundedReplan(baseInput({ feedback: p5Registered() })),
    applyBoundedReplan(baseInput({ feedback: p5NonMaterial(), openConflicts: 2 })),
    applyBoundedReplan(baseInput({ openConflicts: -1 })),
  ];
  for (const r of results) {
    if (r.plannerInvocations > 1) {
      errors.push(`plannerInvocations=${r.plannerInvocations} exceeds 1`);
    }
  }
  return pass("T16", errors);
}

function t17() {
  const errors = [];
  const r = applyBoundedReplan({ planningDecisionId: "" });
  if (r.disposition !== BOUNDED_REPLAN_DISPOSITION.REJECTED) errors.push("expected REJECTED");
  if (r.plannerInvocations !== 0) errors.push("invalid input must not invoke planner");
  if (r.ok !== false) errors.push("ok must be false");
  return pass("T17", errors);
}

function t18() {
  const errors = [];
  const src = fs.readFileSync(path.join(__dirname, "boundedReplan.js"), "utf8");
  if (src.includes("executeResearchBridge")) errors.push("must not import/invoke executeResearchBridge");
  return pass("T18", errors);
}

function t19() {
  const errors = [];
  const src = fs.readFileSync(path.join(__dirname, "boundedReplan.js"), "utf8");
  if (src.includes("applyEvidenceFeedback")) errors.push("must not import/invoke applyEvidenceFeedback");
  return pass("T19", errors);
}

function t20() {
  const errors = [];
  const src = fs.readFileSync(path.join(__dirname, "boundedReplan.js"), "utf8");
  for (const token of ["MotEvd01", "registerMaterialManifests", "buildEvidenceRef"]) {
    if (src.includes(token)) errors.push(`must not use ${token}`);
  }
  return pass("T20", errors);
}

function t21() {
  const errors = [];
  const src = fs.readFileSync(path.join(__dirname, "boundedReplan.js"), "utf8");
  if (src.includes("buildSourceRef")) errors.push("must not use buildSourceRef");
  return pass("T21", errors);
}

function t22() {
  const errors = [];
  const src = fs.readFileSync(path.join(__dirname, "boundedReplan.js"), "utf8");
  for (const token of ["promoteFact", "publishOpportunity", "startDiscovery", "attemptLiveFetch"]) {
    if (src.includes(token)) errors.push(`forbidden authority token: ${token}`);
  }
  const r = applyBoundedReplan(baseInput());
  if (r.isFact !== false || r.isEvidence !== false) errors.push("must deny Evidence/Fact");
  if (r.replanDoesNotAuthorizeOpportunity !== true) errors.push("must deny Opportunity");
  if (r.replanDoesNotPublish !== true) errors.push("must deny publication");
  if (r.replanIsNotSp10 !== true) errors.push("must deny Discovery/SP10");
  return pass("T22", errors);
}

function t23() {
  const errors = [];
  const values = Object.values(BOUNDED_REPLAN_DISPOSITION);
  if (values.includes("WAIT") || values.includes("HUMAN_REVIEW_REQUIRED")) {
    errors.push("WAIT/HUMAN_REVIEW_REQUIRED must not exist");
  }
  const expected = ["CONTINUE", "STOP", "NO_PROGRESS", "REJECTED"];
  if (JSON.stringify([...values].sort()) !== JSON.stringify([...expected].sort())) {
    errors.push(`disposition set must be exactly ${expected.join(",")}`);
  }
  return pass("T23", errors);
}

function t24() {
  const errors = [];
  const src = fs.readFileSync(path.join(__dirname, "boundedReplan.js"), "utf8");
  if (/PLANNING_DECISION_STATUS\.\w+\s*=/.test(src)) {
    errors.push("must not mutate PLANNING_DECISION_STATUS");
  }
  const statuses = Object.values(PLANNING_DECISION_STATUS).sort();
  if (JSON.stringify(statuses) !== JSON.stringify(["ACCEPTED", "CONFLICT", "REFUSED", "UNKNOWN"].sort())) {
    errors.push("P1 PLANNING_DECISION_STATUS must remain unchanged");
  }
  const r = applyBoundedReplan(baseInput());
  const v = validatePlanningDecision(r.decision);
  if (!v.ok) errors.push(...v.errors);
  return pass("T24", errors);
}

async function t25() {
  const p1 = runSp09P1ResearchContractsValidation();
  return pass(
    "T25",
    p1.passed ? [] : [`P1 failed: ${p1.results.filter((x) => !x.passed).map((x) => x.id).join(",")}`]
  );
}

async function t26() {
  const p2 = await runSp09P2CapabilitySemanticsValidation();
  return pass(
    "T26",
    p2.passed ? [] : [`P2 failed: ${p2.results.filter((x) => !x.passed).map((x) => x.id).join(",")}`]
  );
}

async function t27() {
  const p3 = await runSp09P3AdaptivePlannerValidation();
  return pass(
    "T27",
    p3.passed ? [] : [`P3 failed: ${p3.results.filter((x) => !x.passed).map((x) => x.id).join(",")}`]
  );
}

async function t28() {
  const p4 = await runSp09P4ResearchExecutionBridgeValidation();
  return pass(
    "T28",
    p4.passed ? [] : [`P4 failed: ${p4.results.filter((x) => !x.passed).map((x) => x.id).join(",")}`]
  );
}

async function t29() {
  const p5 = await runSp09P5EvidenceFeedbackValidation();
  return pass(
    "T29",
    p5.passed ? [] : [`P5 failed: ${p5.results.filter((x) => !x.passed).map((x) => x.id).join(",")}`]
  );
}

async function t30() {
  const errors = [];
  try {
    const result = await runCb13Validation({});
    if (!result.passed) errors.push(`CB13 failed: ${(result.errors ?? []).join("; ")}`);
  } catch (e) {
    errors.push(String(e.message ?? e));
  }
  return pass("T30", errors);
}

function t31() {
  const errors = [];
  const indexSrc = fs.readFileSync(path.join(__dirname, "index.js"), "utf8");
  for (const token of [
    "applyBoundedReplan",
    "BOUNDED_REPLAN_PROGRAM",
    "BOUNDED_REPLAN_DISPOSITION",
    "runSp09P6BoundedReplanValidation",
  ]) {
    if (!indexSrc.includes(token)) errors.push(`index.js must export/expose ${token}`);
  }
  if (!indexSrc.includes('from "./boundedReplan.js"')) {
    errors.push("index.js must re-export boundedReplan.js");
  }
  if (BOUNDED_REPLAN_PROGRAM !== "SP09-P6") errors.push("program must be SP09-P6");
  return pass("T31", errors);
}

export async function runSp09P6BoundedReplanValidation() {
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
    t15(),
    t16(),
    t17(),
    t18(),
    t19(),
    t20(),
    t21(),
    t22(),
    t23(),
    t24(),
    await t25(),
    await t26(),
    await t27(),
    await t28(),
    await t29(),
    await t30(),
    t31(),
  ];
  return {
    passed: results.every((r) => r.passed),
    results,
  };
}

const isMain =
  process.argv[1] &&
  (process.argv[1].endsWith("validateSp09P6BoundedReplan.js") ||
    process.argv[1].includes("validateSp09P6BoundedReplan"));

if (isMain) {
  const result = await runSp09P6BoundedReplanValidation();
  console.log("=== SP09-P6 Bounded Re-plan Validation ===\n");
  console.log(JSON.stringify(result, null, 2));
  if (!result.passed) {
    console.error("\n❌ SP09-P6 validation FAILED");
    process.exit(1);
  }
  console.log("\n✅ SP09-P6 validation PASSED");
}

/**
 * SP09-P1 — Research Contracts validation (T01–T13)
 *
 * Contract-level only. Runnable:
 *   node src/factory/cb13/validateSp09P1ResearchContracts.js
 */

import {
  PLANNING_DECISION_STATUS,
  RESEARCH_ACTION_ROLE,
  RESEARCH_OUTCOME_STATUS,
  RESEARCH_QUESTION_STATUS,
  RESEARCH_TASK_STATUS,
  assertResearchContractChain,
  buildPlanningDecision,
  buildResearchAction,
  buildResearchOutcome,
  buildResearchQuestion,
  buildResearchTask,
  validatePlanningDecision,
  validateResearchAction,
  validateResearchContractChain,
  validateResearchOutcome,
  validateResearchQuestion,
  validateResearchTask,
} from "./researchContracts.js";

const FACTORY_KEY = "expediente.sp09-p1.demo-001";

function pass(id, errors = []) {
  return { id, passed: errors.length === 0, errors };
}

function buildMinimalChain(overrides = {}) {
  const question = buildResearchQuestion({
    researchQuestionId: "rq-001",
    factoryKey: FACTORY_KEY,
    question: "What ownership signals remain UNKNOWN for this parcel?",
    status: RESEARCH_QUESTION_STATUS.OPEN,
    ...(overrides.question ?? {}),
  });
  const action = buildResearchAction({
    researchActionId: "ra-001",
    researchQuestionId: question.researchQuestionId,
    role: RESEARCH_ACTION_ROLE.SELECTED,
    description: "Gather ownership-related research signals",
    ...(overrides.action ?? {}),
  });
  const decision = buildPlanningDecision({
    planningDecisionId: "pd-001",
    researchQuestionId: question.researchQuestionId,
    researchActionId: action.researchActionId,
    factoryKey: FACTORY_KEY,
    status: PLANNING_DECISION_STATUS.ACCEPTED,
    rationale: "Ownership gap is material to readiness",
    ...(overrides.decision ?? {}),
  });
  const task = buildResearchTask({
    researchTaskId: "rt-001",
    planningDecisionId: decision.planningDecisionId,
    researchActionId: action.researchActionId,
    factoryKey: FACTORY_KEY,
    status: RESEARCH_TASK_STATUS.PENDING,
    capabilityNeed: "ownership-signal-enrichment",
    ...(overrides.task ?? {}),
  });
  const outcome = buildResearchOutcome({
    researchOutcomeId: "ro-001",
    researchTaskId: task.researchTaskId,
    factoryKey: FACTORY_KEY,
    status: RESEARCH_OUTCOME_STATUS.PENDING,
    ...(overrides.outcome ?? {}),
  });
  return { factoryKey: FACTORY_KEY, question, action, decision, task, outcome };
}

function t01() {
  const errors = [];
  try {
    const q = buildResearchQuestion({
      researchQuestionId: "rq-t01",
      factoryKey: FACTORY_KEY,
      question: "Minimal research question",
      status: RESEARCH_QUESTION_STATUS.OPEN,
    });
    const v = validateResearchQuestion(q);
    if (!v.ok) errors.push(...v.errors);
  } catch (e) {
    errors.push(String(e.message ?? e));
  }
  return pass("T01", errors);
}

function t02() {
  const errors = [];
  try {
    const a = buildResearchAction({
      researchActionId: "ra-t02",
      researchQuestionId: "rq-t02",
      role: RESEARCH_ACTION_ROLE.CANDIDATE,
      description: "Candidate research action",
    });
    const v = validateResearchAction(a);
    if (!v.ok) errors.push(...v.errors);
  } catch (e) {
    errors.push(String(e.message ?? e));
  }
  return pass("T02", errors);
}

function t03() {
  const errors = [];
  try {
    const d = buildPlanningDecision({
      planningDecisionId: "pd-t03",
      researchQuestionId: "rq-t03",
      researchActionId: "ra-t03",
      factoryKey: FACTORY_KEY,
      status: PLANNING_DECISION_STATUS.ACCEPTED,
      rationale: "Select action for question",
    });
    const v = validatePlanningDecision(d);
    if (!v.ok) errors.push(...v.errors);
    if (d.researchQuestionId !== "rq-t03") {
      errors.push("PlanningDecision must reference researchQuestionId");
    }
    if (d.researchActionId !== "ra-t03") {
      errors.push("PlanningDecision must reference researchActionId");
    }
  } catch (e) {
    errors.push(String(e.message ?? e));
  }
  return pass("T03", errors);
}

function t04() {
  const errors = [];
  try {
    const t = buildResearchTask({
      researchTaskId: "rt-t04",
      planningDecisionId: "pd-t04",
      researchActionId: "ra-t04",
      factoryKey: FACTORY_KEY,
      status: RESEARCH_TASK_STATUS.READY,
    });
    const v = validateResearchTask(t);
    if (!v.ok) errors.push(...v.errors);
    if (t.planningDecisionId !== "pd-t04") {
      errors.push("ResearchTask must preserve planningDecisionId");
    }
    if (t.researchActionId !== "ra-t04") {
      errors.push("ResearchTask must preserve researchActionId");
    }
  } catch (e) {
    errors.push(String(e.message ?? e));
  }
  return pass("T04", errors);
}

function t05() {
  const errors = [];
  try {
    const o = buildResearchOutcome({
      researchOutcomeId: "ro-t05",
      researchTaskId: "rt-t05",
      factoryKey: FACTORY_KEY,
      status: RESEARCH_OUTCOME_STATUS.COMPLETE,
    });
    const v = validateResearchOutcome(o);
    if (!v.ok) errors.push(...v.errors);
    if (o.researchTaskId !== "rt-t05") {
      errors.push("ResearchOutcome must trace to researchTaskId");
    }
  } catch (e) {
    errors.push(String(e.message ?? e));
  }
  return pass("T05", errors);
}

function t06() {
  const errors = [];
  try {
    const chain = buildMinimalChain();
    assertResearchContractChain(chain);
    const v = validateResearchContractChain(chain);
    if (!v.ok) errors.push(...v.errors);
    if (chain.question.factoryKey !== FACTORY_KEY) {
      errors.push("chain must start from existing Expediente factoryKey");
    }
  } catch (e) {
    errors.push(String(e.message ?? e));
  }
  return pass("T06", errors);
}

function t07() {
  const errors = [];
  const missingQ = validateResearchQuestion({
    researchQuestionId: "",
    factoryKey: FACTORY_KEY,
    question: "x",
    status: RESEARCH_QUESTION_STATUS.OPEN,
  });
  if (missingQ.ok) errors.push("missing researchQuestionId must fail closed");

  const missingRef = validatePlanningDecision({
    planningDecisionId: "pd-x",
    researchQuestionId: "rq-x",
    researchActionId: "",
    factoryKey: FACTORY_KEY,
    status: PLANNING_DECISION_STATUS.ACCEPTED,
  });
  if (missingRef.ok) errors.push("missing researchActionId must fail closed");

  const missingTaskRef = validateResearchOutcome({
    researchOutcomeId: "ro-x",
    researchTaskId: "",
    factoryKey: FACTORY_KEY,
    status: RESEARCH_OUTCOME_STATUS.PENDING,
  });
  if (missingTaskRef.ok) errors.push("missing researchTaskId must fail closed");

  return pass("T07", errors);
}

function t08() {
  const errors = [];
  const badStatus = validateResearchQuestion({
    researchQuestionId: "rq-bad",
    factoryKey: FACTORY_KEY,
    question: "q",
    status: "NOT_A_STATUS",
  });
  if (badStatus.ok) errors.push("invalid ResearchQuestion status must fail closed");

  const badRole = validateResearchAction({
    researchActionId: "ra-bad",
    researchQuestionId: "rq-bad",
    role: "EXECUTE",
  });
  if (badRole.ok) errors.push("invalid ResearchAction role must fail closed");

  const badOutcome = validateResearchOutcome({
    researchOutcomeId: "ro-bad",
    researchTaskId: "rt-bad",
    factoryKey: FACTORY_KEY,
    status: "TRUSTED_EVIDENCE",
  });
  if (badOutcome.ok) errors.push("unsupported ResearchOutcome status must fail closed");

  return pass("T08", errors);
}

function t09() {
  const errors = [];
  try {
    const task = buildResearchTask({
      researchTaskId: "rt-t09",
      planningDecisionId: "pd-t09",
      researchActionId: "ra-t09",
      factoryKey: FACTORY_KEY,
      status: RESEARCH_TASK_STATUS.PENDING,
      capabilityNeed: "semantic-need:owner-contactability",
    });
    if (task.capabilityNeed !== "semantic-need:owner-contactability") {
      errors.push("capabilityNeed must be preservable without resolution");
    }
    if (task.motorId != null || task.loopId != null || task.swarmId != null) {
      errors.push("task must not resolve capability to Motor/Loop/Swarm");
    }

    const withMotor = validateResearchTask({
      researchTaskId: "rt-t09b",
      planningDecisionId: "pd-t09",
      researchActionId: "ra-t09",
      factoryKey: FACTORY_KEY,
      status: RESEARCH_TASK_STATUS.PENDING,
      capabilityNeed: "semantic-need:x",
      motorId: "MOT-X-01",
    });
    if (withMotor.ok) {
      errors.push("capability resolution via motorId must fail closed in P1");
    }

    const withLoop = validateResearchTask({
      researchTaskId: "rt-t09c",
      planningDecisionId: "pd-t09",
      researchActionId: "ra-t09",
      factoryKey: FACTORY_KEY,
      status: RESEARCH_TASK_STATUS.PENDING,
      loopId: "LOOP-X-01",
    });
    if (withLoop.ok) {
      errors.push("capability resolution via loopId must fail closed in P1");
    }

    const withSwarm = validateResearchTask({
      researchTaskId: "rt-t09d",
      planningDecisionId: "pd-t09",
      researchActionId: "ra-t09",
      factoryKey: FACTORY_KEY,
      status: RESEARCH_TASK_STATUS.PENDING,
      swarmId: "SWM-X-01",
    });
    if (withSwarm.ok) {
      errors.push("capability resolution via swarmId must fail closed in P1");
    }
  } catch (e) {
    errors.push(String(e.message ?? e));
  }
  return pass("T09", errors);
}

function t10() {
  const errors = [];
  try {
    const o = buildResearchOutcome({
      researchOutcomeId: "ro-t10",
      researchTaskId: "rt-t10",
      factoryKey: FACTORY_KEY,
      status: RESEARCH_OUTCOME_STATUS.COMPLETE,
    });
    if (o.isEvidence !== false || o.isFact !== false || o.isTrustedEvidence !== false) {
      errors.push("ResearchOutcome must explicitly deny Evidence/Fact authority");
    }
    if (o.evidenceAuthority !== "CB-06") {
      errors.push("ResearchOutcome must retain CB-06 as Evidence authority marker");
    }
    if (o.resultIsNotEvidence !== true || o.resultIsNotFact !== true) {
      errors.push("ResearchOutcome must declare RESULT ≠ Evidence ≠ Fact");
    }

    const claimEvidence = validateResearchOutcome({
      researchOutcomeId: "ro-t10b",
      researchTaskId: "rt-t10",
      factoryKey: FACTORY_KEY,
      status: RESEARCH_OUTCOME_STATUS.COMPLETE,
      isEvidence: true,
    });
    if (claimEvidence.ok) {
      errors.push("claiming isEvidence=true must fail closed");
    }

    const claimFact = validateResearchOutcome({
      researchOutcomeId: "ro-t10c",
      researchTaskId: "rt-t10",
      factoryKey: FACTORY_KEY,
      status: RESEARCH_OUTCOME_STATUS.COMPLETE,
      isFact: true,
    });
    if (claimFact.ok) {
      errors.push("claiming isFact=true must fail closed");
    }
  } catch (e) {
    errors.push(String(e.message ?? e));
  }
  return pass("T10", errors);
}

function t11() {
  const errors = [];
  try {
    const q = buildResearchQuestion({
      researchQuestionId: "rq-unk",
      factoryKey: FACTORY_KEY,
      question: "unknown posture",
      status: RESEARCH_QUESTION_STATUS.UNKNOWN,
    });
    if (q.status !== RESEARCH_QUESTION_STATUS.UNKNOWN) {
      errors.push("UNKNOWN must remain explicitly UNKNOWN on ResearchQuestion");
    }

    const o = buildResearchOutcome({
      researchOutcomeId: "ro-unk",
      researchTaskId: "rt-unk",
      factoryKey: FACTORY_KEY,
      status: RESEARCH_OUTCOME_STATUS.UNKNOWN,
    });
    if (o.status !== RESEARCH_OUTCOME_STATUS.UNKNOWN) {
      errors.push("UNKNOWN must remain explicitly UNKNOWN on ResearchOutcome");
    }
  } catch (e) {
    errors.push(String(e.message ?? e));
  }
  return pass("T11", errors);
}

function t12() {
  const errors = [];
  try {
    const d = buildPlanningDecision({
      planningDecisionId: "pd-cf",
      researchQuestionId: "rq-cf",
      researchActionId: "ra-cf",
      factoryKey: FACTORY_KEY,
      status: PLANNING_DECISION_STATUS.CONFLICT,
    });
    if (d.status !== PLANNING_DECISION_STATUS.CONFLICT) {
      errors.push("CONFLICT must remain explicitly CONFLICT on PlanningDecision");
    }

    const o = buildResearchOutcome({
      researchOutcomeId: "ro-cf",
      researchTaskId: "rt-cf",
      factoryKey: FACTORY_KEY,
      status: RESEARCH_OUTCOME_STATUS.CONFLICT,
    });
    if (o.status !== RESEARCH_OUTCOME_STATUS.CONFLICT) {
      errors.push("CONFLICT must remain explicitly CONFLICT on ResearchOutcome");
    }

    // CONFLICT is accepted as a status value, but does not auto-resolve.
    const v = validateResearchOutcome(o);
    if (!v.ok) errors.push(...v.errors);
  } catch (e) {
    errors.push(String(e.message ?? e));
  }
  return pass("T12", errors);
}

function t13() {
  const errors = [];
  try {
    const chain = buildMinimalChain();
    const surfaces = [chain.question, chain.action, chain.decision, chain.task, chain.outcome];
    for (const s of surfaces) {
      if (s.secondExpediente != null || s.elrStore != null || s.evidenceRegistry != null) {
        errors.push("P1 contracts must not instantiate second lineage surfaces");
      }
      if (s.motorRuntime != null || s.orchestrationLayer != null) {
        errors.push("P1 contracts must not instantiate MotorRuntime or orchestration layer");
      }
    }

    const parallel = validateResearchQuestion({
      researchQuestionId: "rq-par",
      factoryKey: FACTORY_KEY,
      question: "q",
      status: RESEARCH_QUESTION_STATUS.OPEN,
      secondExpediente: { id: "other" },
    });
    if (parallel.ok) {
      errors.push("second Expediente surface must fail closed");
    }

    const withRuntime = validateResearchTask({
      researchTaskId: "rt-par",
      planningDecisionId: "pd-par",
      researchActionId: "ra-par",
      factoryKey: FACTORY_KEY,
      status: RESEARCH_TASK_STATUS.PENDING,
      motorRuntime: {},
    });
    if (withRuntime.ok) {
      errors.push("MotorRuntime instantiation on contract must fail closed");
    }
  } catch (e) {
    errors.push(String(e.message ?? e));
  }
  return pass("T13", errors);
}

/**
 * @returns {{ passed: boolean, results: { id: string, passed: boolean, errors: string[] }[] }}
 */
export function runSp09P1ResearchContractsValidation() {
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
  ];
  return {
    passed: results.every((r) => r.passed),
    results,
  };
}

const isMain =
  process.argv[1] &&
  (process.argv[1].endsWith("validateSp09P1ResearchContracts.js") ||
    process.argv[1].includes("validateSp09P1ResearchContracts"));

if (isMain) {
  const result = runSp09P1ResearchContractsValidation();
  console.log("=== SP09-P1 Research Contracts Validation ===\n");
  console.log(JSON.stringify(result, null, 2));
  if (!result.passed) {
    console.error("\n❌ SP09-P1 validation FAILED");
    process.exit(1);
  }
  console.log("\n✅ SP09-P1 validation PASSED");
  process.exit(0);
}

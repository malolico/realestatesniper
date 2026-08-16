/**
 * SP09-P2 — Minimum Capability Semantics validation (T01–T12)
 *
 * Runnable:
 *   node src/factory/cb13/validateSp09P2CapabilitySemantics.js
 */

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import {
  CAPABILITY_FAMILY,
  CAPABILITY_NEED,
  CAPABILITY_RESOLUTION_STATUS,
  CAPABILITY_SEMANTICS_MAP,
  buildMatchedCapabilityResolution,
  resolveCapabilityNeed,
  resolveCapabilityNeedFromTask,
  validateCapabilitySemanticsResult,
  verifyCatalogIdentity,
} from "./capabilitySemantics.js";
import {
  FORBIDDEN_CAPABILITY_RESOLUTION_KEYS,
  RESEARCH_TASK_STATUS,
  buildResearchTask,
  validateResearchTask,
} from "./researchContracts.js";
import { runSp09P1ResearchContractsValidation } from "./validateSp09P1ResearchContracts.js";
import { runCb13Validation } from "./validateCb13.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

function pass(id, errors = []) {
  return { id, passed: errors.length === 0, errors };
}

function t01() {
  const errors = [];
  const r = resolveCapabilityNeed(CAPABILITY_NEED.OWNERSHIP_RECORD);
  if (!r.ok) errors.push(...r.errors);
  const res = r.resolution;
  if (!res || res.status !== CAPABILITY_RESOLUTION_STATUS.MATCHED) {
    errors.push("expected MATCHED");
  }
  if (res?.family !== CAPABILITY_FAMILY.MOTOR) errors.push("expected MOTOR");
  if (res?.capabilityRef !== "MOT-OWN-01") errors.push("expected MOT-OWN-01");
  if (!verifyCatalogIdentity(CAPABILITY_FAMILY.MOTOR, "MOT-OWN-01")) {
    errors.push("MOT-OWN-01 failed catalog identity");
  }
  const v = validateCapabilitySemanticsResult(res);
  if (!v.ok) errors.push(...v.errors);
  return pass("T01", errors);
}

function t02() {
  const errors = [];
  const r = resolveCapabilityNeed(CAPABILITY_NEED.EVIDENCE_SUFFICIENCY_GAP);
  if (!r.ok) errors.push(...r.errors);
  const res = r.resolution;
  if (!res || res.status !== CAPABILITY_RESOLUTION_STATUS.MATCHED) {
    errors.push("expected MATCHED");
  }
  if (res?.family !== CAPABILITY_FAMILY.LOOP) errors.push("expected LOOP");
  if (res?.capabilityRef !== "LOOP-XVR-EVD-01") {
    errors.push("expected LOOP-XVR-EVD-01");
  }
  if (!verifyCatalogIdentity(CAPABILITY_FAMILY.LOOP, "LOOP-XVR-EVD-01")) {
    errors.push("LOOP-XVR-EVD-01 failed catalog identity");
  }
  const v = validateCapabilitySemanticsResult(res);
  if (!v.ok) errors.push(...v.errors);
  return pass("T02", errors);
}

function t03() {
  const errors = [];
  const r = resolveCapabilityNeed(CAPABILITY_NEED.MULTI_DOMAIN_SUFFICIENCY);
  if (!r.ok) errors.push(...r.errors);
  const res = r.resolution;
  if (!res || res.status !== CAPABILITY_RESOLUTION_STATUS.MATCHED) {
    errors.push("expected MATCHED");
  }
  if (res?.family !== CAPABILITY_FAMILY.SWARM) errors.push("expected SWARM");
  if (res?.capabilityRef !== "SWM-SUF-01") errors.push("expected SWM-SUF-01");
  if (!verifyCatalogIdentity(CAPABILITY_FAMILY.SWARM, "SWM-SUF-01")) {
    errors.push("SWM-SUF-01 failed catalog identity");
  }
  const v = validateCapabilitySemanticsResult(res);
  if (!v.ok) errors.push(...v.errors);
  return pass("T03", errors);
}

function t04() {
  const errors = [];
  const r = resolveCapabilityNeed("unsupported-research-need");
  if (!r.ok) errors.push(...r.errors);
  const res = r.resolution;
  if (!res || res.status !== CAPABILITY_RESOLUTION_STATUS.UNRESOLVED) {
    errors.push("expected UNRESOLVED");
  }
  if (res?.family != null) errors.push("UNRESOLVED must not set family");
  if (res?.capabilityRef != null) {
    errors.push("UNRESOLVED must not set capabilityRef");
  }
  if (res?.executionAuthorized !== false) {
    errors.push("UNRESOLVED must keep executionAuthorized=false");
  }
  return pass("T04", errors);
}

function t05() {
  const errors = [];
  for (const bad of [null, undefined, "", "   ", 42, {}, []]) {
    const r = resolveCapabilityNeed(bad);
    if (r.ok || r.resolution != null) {
      errors.push(`expected fail-closed for ${JSON.stringify(bad)}`);
    }
  }
  return pass("T05", errors);
}

function t06() {
  const errors = [];
  for (const need of Object.values(CAPABILITY_NEED)) {
    const r = resolveCapabilityNeed(need);
    if (!r.ok) errors.push(...r.errors);
    if (r.resolution?.status !== CAPABILITY_RESOLUTION_STATUS.MATCHED) {
      errors.push(`${need} expected MATCHED`);
    }
    if (r.resolution?.executionAuthorized !== false) {
      errors.push(`${need} must have executionAuthorized===false`);
    }
  }
  return pass("T06", errors);
}

function t07() {
  const errors = [];
  try {
    const task = buildResearchTask({
      researchTaskId: "rt-p2-t07",
      planningDecisionId: "pd-p2-t07",
      researchActionId: "ra-p2-t07",
      factoryKey: "expediente.sp09-p2.demo-001",
      status: RESEARCH_TASK_STATUS.PENDING,
      capabilityNeed: CAPABILITY_NEED.OWNERSHIP_RECORD,
    });
    const snapshot = { ...task };
    const r = resolveCapabilityNeedFromTask(task);
    if (!r.ok) errors.push(...r.errors);
    if (!r.taskUnchanged) errors.push("ResearchTask was mutated");
    if (r.resolution?.status !== CAPABILITY_RESOLUTION_STATUS.MATCHED) {
      errors.push("expected MATCHED from task.capabilityNeed");
    }
    for (const key of FORBIDDEN_CAPABILITY_RESOLUTION_KEYS) {
      if (task[key] != null) {
        errors.push(`ResearchTask gained forbidden field ${key}`);
      }
      if (snapshot[key] != null) {
        errors.push(`snapshot unexpectedly had ${key}`);
      }
    }
    if (task.capabilityNeed !== CAPABILITY_NEED.OWNERSHIP_RECORD) {
      errors.push("capabilityNeed must remain on Task unchanged");
    }
    if (r.resolution === task) {
      errors.push("resolution artifact must be separate from ResearchTask");
    }
    const tv = validateResearchTask(task);
    if (!tv.ok) errors.push(...tv.errors);
  } catch (e) {
    errors.push(String(e.message ?? e));
  }
  return pass("T07", errors);
}

function t08() {
  const errors = [];
  const invented = buildMatchedCapabilityResolution({
    capabilityNeed: CAPABILITY_NEED.OWNERSHIP_RECORD,
    family: CAPABILITY_FAMILY.MOTOR,
    capabilityRef: "MOT-DOES-NOT-EXIST-99",
  });
  if (invented.ok || invented.resolution != null) {
    errors.push("invented capabilityRef must not produce MATCHED");
  }

  const fakeArtifact = {
    status: CAPABILITY_RESOLUTION_STATUS.MATCHED,
    capabilityNeed: CAPABILITY_NEED.OWNERSHIP_RECORD,
    family: CAPABILITY_FAMILY.MOTOR,
    capabilityRef: "MOT-FAKE-00",
    executionAuthorized: false,
    isEvidence: false,
    isFact: false,
  };
  const v = validateCapabilitySemanticsResult(fakeArtifact);
  if (v.ok) {
    errors.push("validate must reject nonexistent capabilityRef MATCHED");
  }
  return pass("T08", errors);
}

function t09() {
  const errors = [];
  const src = fs.readFileSync(path.join(__dirname, "capabilitySemantics.js"), "utf8");
  const forbiddenImports = [
    "motorRuntime",
    "MotorRuntime",
    "loopEngineService",
    "LoopEngineService",
    "swarmCoordinatorService",
    "SwarmCoordinatorService",
    ".execute(",
  ];
  for (const token of forbiddenImports) {
    if (src.includes(token)) {
      errors.push(`capabilitySemantics.js must not reference execution surface: ${token}`);
    }
  }
  // Pure resolution — no async execution side channel
  const r = resolveCapabilityNeed(CAPABILITY_NEED.OWNERSHIP_RECORD);
  if (typeof r.then === "function") {
    errors.push("resolveCapabilityNeed must not return a Promise/execution handle");
  }
  if (r.resolution?.executionAuthorized !== false) {
    errors.push("resolution must not authorize execution");
  }
  return pass("T09", errors);
}

function t10() {
  const errors = [];
  for (const need of [
    CAPABILITY_NEED.OWNERSHIP_RECORD,
    "unsupported-need-x",
  ]) {
    const r = resolveCapabilityNeed(need);
    if (!r.ok && need === CAPABILITY_NEED.OWNERSHIP_RECORD) {
      errors.push(...r.errors);
      continue;
    }
    const res = r.resolution;
    if (!res) {
      errors.push(`missing resolution for ${need}`);
      continue;
    }
    if (res.isEvidence !== false || res.isFact !== false) {
      errors.push("must deny Evidence/Fact authority");
    }
    if (res.isTrustedEvidence !== false) {
      errors.push("must deny trusted Evidence");
    }
    if (res.evidenceAuthority !== "CB-06") {
      errors.push("evidenceAuthority must remain CB-06");
    }
    if (res.resultIsNotEvidence !== true || res.resultIsNotFact !== true) {
      errors.push("must declare RESULT ≠ Evidence ≠ Fact");
    }
  }
  return pass("T10", errors);
}

function t11() {
  const errors = [];
  const mapKeys = Object.keys(CAPABILITY_SEMANTICS_MAP);
  if (mapKeys.length !== 3) {
    errors.push(`frozen map must have exactly 3 entries (got ${mapKeys.length})`);
  }
  const expected = {
    [CAPABILITY_NEED.OWNERSHIP_RECORD]: ["MOTOR", "MOT-OWN-01"],
    [CAPABILITY_NEED.EVIDENCE_SUFFICIENCY_GAP]: ["LOOP", "LOOP-XVR-EVD-01"],
    [CAPABILITY_NEED.MULTI_DOMAIN_SUFFICIENCY]: ["SWARM", "SWM-SUF-01"],
  };
  for (const [need, [family, ref]] of Object.entries(expected)) {
    const entry = CAPABILITY_SEMANTICS_MAP[need];
    if (!entry || entry.family !== family || entry.capabilityRef !== ref) {
      errors.push(`map mismatch for ${need}`);
    }
  }

  const p1 = runSp09P1ResearchContractsValidation();
  if (!p1.passed) {
    errors.push(
      `P1 validation failed: ${p1.results
        .filter((x) => !x.passed)
        .map((x) => x.id)
        .join(",")}`
    );
  }
  return pass("T11", errors);
}

async function t12() {
  const errors = [];
  try {
    const result = await runCb13Validation({});
    if (!result.passed) {
      errors.push(`CB13 regression failed: ${(result.errors ?? []).join("; ")}`);
    }
  } catch (e) {
    errors.push(String(e.message ?? e));
  }
  return pass("T12", errors);
}

/**
 * @returns {Promise<{ passed: boolean, results: object[] }>}
 */
export async function runSp09P2CapabilitySemanticsValidation() {
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
    await t12(),
  ];
  return {
    passed: results.every((r) => r.passed),
    results,
  };
}

const isMain =
  process.argv[1] &&
  (process.argv[1].endsWith("validateSp09P2CapabilitySemantics.js") ||
    process.argv[1].includes("validateSp09P2CapabilitySemantics"));

if (isMain) {
  const result = await runSp09P2CapabilitySemanticsValidation();
  console.log("=== SP09-P2 Capability Semantics Validation ===\n");
  console.log(JSON.stringify(result, null, 2));
  if (!result.passed) {
    console.error("\n❌ SP09-P2 validation FAILED");
    process.exit(1);
  }
  console.log("\n✅ SP09-P2 validation PASSED");
  process.exit(0);
}

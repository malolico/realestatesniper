/**
 * P-INT-01 Slice B1 — Orchestration contracts validation runner.
 *
 * Usage:
 *   node src/runPInt01SliceB1Validation.js
 *
 * Scope: B1 contracts only — no worker / HTTP / CB execution.
 */

import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import {
  FACTORY_ORCHESTRATION_CAPABILITIES,
  FACTORY_ORCHESTRATION_CONTRACT_ID,
  FACTORY_ORCHESTRATION_ERROR_CODES,
  FACTORY_ORCHESTRATION_MODE,
  FACTORY_ORCHESTRATION_ROUTE_SPECS,
  FACTORY_SERVICE_EDGE_READ_CONTRACT_ID,
  assertCommandContractNotReadContract,
  buildCommandErrorEnvelope,
  buildCommandSuccessEnvelope,
  evaluateBoundaryRejection,
  evaluateCancelTransition,
  isContractBlockedOperation,
  JOB_STATES,
  JOB_TYPE,
  canTransitionJobState,
  validateIdempotencyKey,
  validateJobRecordShape,
  validateOrchestrateSubmitBody,
  sanitizeResultSummary,
  sanitizeLineageSummary,
  FACTORY_ORCHESTRATION_BLOCKED_OPERATIONS,
  IDEMPOTENCY_HEADER_NAME,
} from "../services/factory-orchestration-edge/index.js";

const results = [];
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = path.resolve(__dirname, "..");
const EDGE_DIR = path.join(REPO_ROOT, "services", "factory-orchestration-edge");
const SLICE_A_DIR = path.join(REPO_ROOT, "services", "factory-service-edge");

function test(name, fn) {
  try {
    fn();
    results.push({ name, ok: true });
    console.log(`PASS  ${name}`);
  } catch (error) {
    results.push({ name, ok: false, error: error.message });
    console.error(`FAIL  ${name}`);
    console.error(`      ${error.message}`);
  }
}

test("01 command contract id is distinct from Slice A read", () => {
  assert.equal(FACTORY_ORCHESTRATION_CONTRACT_ID, "factory.service_edge.command");
  assert.notEqual(FACTORY_ORCHESTRATION_CONTRACT_ID, FACTORY_SERVICE_EDGE_READ_CONTRACT_ID);
  assertCommandContractNotReadContract();
});

test("02 mode is STAGING and capabilities match Plan §5.4", () => {
  assert.equal(FACTORY_ORCHESTRATION_MODE, "STAGING");
  assert.equal(FACTORY_ORCHESTRATION_CAPABILITIES.ORCHESTRATE, "factory.command.orchestrate");
  assert.equal(FACTORY_ORCHESTRATION_CAPABILITIES.JOB_READ, "factory.command.job.read");
  assert.equal(FACTORY_ORCHESTRATION_CAPABILITIES.JOB_LINEAGE, "factory.command.job.lineage");
});

test("03 HTTP routes match Plan §5.3 / parent §18", () => {
  assert.equal(FACTORY_ORCHESTRATION_ROUTE_SPECS.submitJob.method, "POST");
  assert.equal(FACTORY_ORCHESTRATION_ROUTE_SPECS.submitJob.path, "/v1/factory/orchestration/jobs");
  assert.equal(FACTORY_ORCHESTRATION_ROUTE_SPECS.submitJob.requiresIdempotencyKey, true);
  assert.equal(FACTORY_ORCHESTRATION_ROUTE_SPECS.submitJob.successStatus, 202);
  assert.equal(
    FACTORY_ORCHESTRATION_ROUTE_SPECS.getJob.path,
    "/v1/factory/orchestration/jobs/{jobId}"
  );
  assert.equal(
    FACTORY_ORCHESTRATION_ROUTE_SPECS.getJobLineage.path,
    "/v1/factory/orchestration/jobs/{jobId}/lineage"
  );
  assert.equal(
    FACTORY_ORCHESTRATION_ROUTE_SPECS.cancelJob.path,
    "/v1/factory/orchestration/jobs/{jobId}/cancel"
  );
  assert.equal(
    FACTORY_ORCHESTRATION_ROUTE_SPECS.cancelJob.capability,
    FACTORY_ORCHESTRATION_CAPABILITIES.ORCHESTRATE
  );
});

test("04 job states and transitions are frozen correctly", () => {
  assert.equal(JOB_TYPE.ORCHESTRATE_EXPEDIENTE, "ORCHESTRATE_EXPEDIENTE");
  assert.ok(canTransitionJobState(JOB_STATES.QUEUED, JOB_STATES.RUNNING));
  assert.ok(canTransitionJobState(JOB_STATES.QUEUED, JOB_STATES.CANCELLED));
  assert.ok(canTransitionJobState(JOB_STATES.RUNNING, JOB_STATES.SUCCEEDED));
  assert.equal(canTransitionJobState(JOB_STATES.SUCCEEDED, JOB_STATES.RUNNING), false);
});

test("05 idempotency key REQUIRED and charset enforced", () => {
  assert.equal(IDEMPOTENCY_HEADER_NAME, "Idempotency-Key");
  assert.equal(validateIdempotencyKey(undefined).ok, false);
  assert.equal(validateIdempotencyKey("").ok, false);
  assert.equal(validateIdempotencyKey("bad key").ok, false);
  assert.equal(validateIdempotencyKey("ok-key_1:2.").ok, true);
});

test("06 submit body validation fail-closed", () => {
  const badCmd = validateOrchestrateSubmitBody(
    { factoryKey: "fk-1", command: "other" },
    "key-1"
  );
  assert.equal(badCmd.ok, false);
  assert.equal(badCmd.code, FACTORY_ORCHESTRATION_ERROR_CODES.VALIDATION_FAIL);

  const badHint = validateOrchestrateSubmitBody(
    { factoryKey: "fk-1", command: "orchestrateExpediente", hints: { evil: true } },
    "key-1"
  );
  assert.equal(badHint.ok, false);

  const mirrorFail = validateOrchestrateSubmitBody(
    {
      factoryKey: "fk-1",
      command: "orchestrateExpediente",
      idempotencyKey: "other",
    },
    "key-1"
  );
  assert.equal(mirrorFail.ok, false);

  const ok = validateOrchestrateSubmitBody(
    { factoryKey: "fk-1", command: "orchestrateExpediente", hints: {} },
    "key-1"
  );
  assert.equal(ok.ok, true);
  assert.equal(ok.value.idempotencyKey, "key-1");
});

test("07 cancel contract states", () => {
  const queued = evaluateCancelTransition(JOB_STATES.QUEUED);
  assert.equal(queued.ok, true);
  assert.equal(queued.nextState, JOB_STATES.CANCELLED);

  const running = evaluateCancelTransition(JOB_STATES.RUNNING);
  assert.equal(running.ok, true);
  assert.equal(running.setCancelRequested, true);
  assert.equal(running.nextState, JOB_STATES.CANCELLED);

  const already = evaluateCancelTransition(JOB_STATES.CANCELLED);
  assert.equal(already.ok, true);
  assert.equal(already.idempotent, true);
  assert.equal(already.httpStatus, 200);

  const conflict = evaluateCancelTransition(JOB_STATES.SUCCEEDED);
  assert.equal(conflict.ok, false);
  assert.equal(conflict.httpStatus, 409);
  assert.equal(conflict.code, FACTORY_ORCHESTRATION_ERROR_CODES.CONFLICT);
});

test("08 boundary contract blocks Marketplace/Product ops", () => {
  assert.ok(FACTORY_ORCHESTRATION_BLOCKED_OPERATIONS.includes("marketplace_listing"));
  assert.ok(FACTORY_ORCHESTRATION_BLOCKED_OPERATIONS.includes("assign_access_tier"));
  assert.equal(isContractBlockedOperation("marketplace_listing"), true);
  const rej = evaluateBoundaryRejection("marketplace_listing");
  assert.equal(rej.ok, false);
  assert.equal(rej.jobState, "REJECTED");
  assert.equal(evaluateBoundaryRejection("orchestrateExpediente").ok, true);
});

test("09 job record shape and allowlist sanitizers", () => {
  const shape = validateJobRecordShape({
    jobId: "11111111-1111-1111-1111-111111111111",
    type: JOB_TYPE.ORCHESTRATE_EXPEDIENTE,
    factoryKey: "fk-1",
    state: JOB_STATES.QUEUED,
    cancelRequested: false,
    createdAt: "2026-07-27T00:00:00.000Z",
    updatedAt: "2026-07-27T00:00:00.000Z",
    idempotencyKey: "key-1",
  });
  assert.equal(shape.ok, true);

  const summary = sanitizeResultSummary({
    factoryKey: "fk-1",
    orchestrationStatus: "ok",
    elr: { secret: true },
    decisionPackage: {},
  });
  assert.equal(summary.factoryKey, "fk-1");
  assert.equal(summary.elr, undefined);
  assert.equal(summary.decisionPackage, undefined);

  const lineage = sanitizeLineageSummary({
    jobId: "j1",
    factoryKey: "fk-1",
    state: "SUCCEEDED",
    eventCount: 2,
    rawElr: {},
  });
  assert.equal(lineage.eventCount, 2);
  assert.equal(lineage.rawElr, undefined);
});

test("10 command envelopes and error catalog", () => {
  const okEnv = buildCommandSuccessEnvelope({
    correlationId: "c1",
    generatedAt: "2026-07-27T00:00:00.000Z",
    capability: FACTORY_ORCHESTRATION_CAPABILITIES.ORCHESTRATE,
    result: { jobId: "j1", state: "QUEUED" },
  });
  assert.equal(okEnv.contractId, FACTORY_ORCHESTRATION_CONTRACT_ID);
  assert.equal(okEnv.mode, "STAGING");
  assert.ok(okEnv.result);

  const errEnv = buildCommandErrorEnvelope(
    FACTORY_ORCHESTRATION_ERROR_CODES.VALIDATION_FAIL,
    "bad",
    "c1"
  );
  assert.equal(errEnv.error.code, "VALIDATION_FAIL");
  assert.ok(FACTORY_ORCHESTRATION_ERROR_CODES.BOUNDARY_REJECTED);
  assert.ok(FACTORY_ORCHESTRATION_ERROR_CODES.CONFLICT);
});

test("11 B1 contract modules present; HTTP runtime absent", () => {
  const files = fs.readdirSync(EDGE_DIR);
  const required = [
    "contract.js",
    "jobModel.js",
    "idempotency.js",
    "cancel.js",
    "boundary.js",
    "validation.js",
  ];
  for (const name of required) {
    assert.ok(files.includes(name), `missing contract file: ${name}`);
  }
  const bannedHttp = ["httpAdapter.js", "httpServer.js", "authRuntime.js"];
  for (const name of bannedHttp) {
    assert.equal(files.includes(name), false, `unexpected HTTP runtime file: ${name}`);
  }
});

test("12 B1 contract sources MUST NOT import factory-service-edge; CB-15 only via boundaryAdapter", () => {
  const contractOnly = [
    "contract.js",
    "jobModel.js",
    "idempotency.js",
    "cancel.js",
    "boundary.js",
    "validation.js",
  ];
  for (const name of contractOnly) {
    const src = fs.readFileSync(path.join(EDGE_DIR, name), "utf8");
    assert.equal(
      /from\s+["'][^"']*factory-service-edge/.test(src),
      false,
      `${name} imports factory-service-edge`
    );
    assert.equal(
      /from\s+["'][^"']*src\/factory\//.test(src),
      false,
      `${name} imports src/factory`
    );
  }
  const allJs = fs.readdirSync(EDGE_DIR).filter((f) => f.endsWith(".js"));
  for (const name of allJs) {
    const src = fs.readFileSync(path.join(EDGE_DIR, name), "utf8");
    assert.equal(
      /from\s+["'][^"']*factory-service-edge/.test(src),
      false,
      `${name} imports factory-service-edge`
    );
  }
  if (fs.existsSync(path.join(EDGE_DIR, "boundaryAdapter.js"))) {
    const src = fs.readFileSync(path.join(EDGE_DIR, "boundaryAdapter.js"), "utf8");
    assert.match(src, /from\s+["'][^"']*factory\/cb15/);
  }
  assert.ok(fs.existsSync(SLICE_A_DIR), "Slice A directory must remain present untouched");
});

const failed = results.filter((r) => !r.ok);
console.log("");
console.log("========== P-INT-01 SLICE B1 SUMMARY ==========");
console.log(`Total: ${results.length}  PASS: ${results.length - failed.length}  FAIL: ${failed.length}`);
if (failed.length === 0) {
  console.log("ALL SUITES PASS");
  console.log("AUTHORIZED SURFACE: B1 CONTRACTS ONLY");
  console.log("NOT AUTHORIZED: B2 worker / B3 HTTP / B4 full suite");
  process.exit(0);
}
console.log("FAILURES:");
for (const f of failed) {
  console.log(` - ${f.name}: ${f.error}`);
}
process.exit(1);

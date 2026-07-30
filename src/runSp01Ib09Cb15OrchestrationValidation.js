/**
 * SP01-IB-09 — Mandated CB-15 staging orchestration evidence (CAP-SP01-02).
 *
 * Mandate: SP01-IB-09-IMPL
 * Proves staging JobRunnerCore default executor associates with CB-15
 * orchestrateExpediente (OBS-SB-STUB / GAP-IB03-01 gap-fill).
 *
 * Usage:
 *   node src/runSp01Ib09Cb15OrchestrationValidation.js
 */

import assert from "node:assert/strict";
import {
  InMemoryJobStore,
  JobRunnerCore,
  JOB_STATES,
  CB15_ORCHESTRATION_STATUS,
  CB15_ORCHESTRATION_SUMMARY_CODE,
  runStubOrchestration,
} from "../services/factory-orchestration-edge/index.js";
import { runCb15Validation } from "./factory/cb15/validateCb15.js";

const results = [];

function test(name, fn) {
  try {
    const ret = fn();
    if (ret && typeof ret.then === "function") {
      return ret
        .then(() => {
          results.push({ name, ok: true });
          console.log(`PASS  ${name}`);
        })
        .catch((error) => {
          results.push({ name, ok: false, error: error.message });
          console.error(`FAIL  ${name}`);
          console.error(`      ${error.message}`);
        });
    }
    results.push({ name, ok: true });
    console.log(`PASS  ${name}`);
    return Promise.resolve();
  } catch (error) {
    results.push({ name, ok: false, error: error.message });
    console.error(`FAIL  ${name}`);
    console.error(`      ${error.message}`);
    return Promise.resolve();
  }
}

async function run() {
  console.log("SP01-IB-09 CB-15 Mandated orchestration validation");
  console.log("Mandate: SP01-IB-09-IMPL");
  console.log("");

  await test("01 CB-15 construction validation still PASS (no CB rewrite)", async () => {
    const report = await runCb15Validation();
    assert.equal(report.passed, true, (report.errors || []).join("; ") || "CB-15 validation failed");
  });

  await test("02 JobRunnerCore default executor → CB-15 orchestrateExpediente", async () => {
    const runner = new JobRunnerCore(new InMemoryJobStore(), { executionTimeoutMs: 120_000 });
    const { job } = runner.enqueue(
      { factoryKey: "sp01-ib09-cap02", command: "orchestrateExpediente" },
      "sp01-ib09-idem-1",
      "factory-ops"
    );
    const done = await runner.processJob(job.jobId);
    assert.equal(done.state, JOB_STATES.SUCCEEDED);
    assert.equal(done.resultSummary.orchestrationStatus, CB15_ORCHESTRATION_STATUS);
    assert.equal(done.resultSummary.summaryCode, CB15_ORCHESTRATION_SUMMARY_CODE);
    assert.equal(done.resultSummary.elr, undefined);
    assert.equal(done.resultSummary.decisionPackage, undefined);
    assert.ok(typeof done.resultSummary.factoryKey === "string");
    assert.ok(done.resultSummary.factoryKey.length > 0);
  });

  await test("03 stub remains injectable but is not default CAP-02 proof path", async () => {
    const runner = new JobRunnerCore(new InMemoryJobStore(), {
      executionTimeoutMs: 2000,
      executor: runStubOrchestration,
    });
    const { job } = runner.enqueue(
      { factoryKey: "sp01-ib09-stub", command: "orchestrateExpediente" },
      "sp01-ib09-idem-stub",
      "factory-ops"
    );
    const done = await runner.processJob(job.jobId);
    assert.equal(done.state, JOB_STATES.SUCCEEDED);
    assert.equal(done.resultSummary.summaryCode, "B2_STUB");
  });

  const failed = results.filter((r) => !r.ok);
  console.log("");
  if (failed.length) {
    console.log(`FAIL  ${failed.length}/${results.length}`);
    process.exitCode = 1;
    return;
  }
  console.log("ALL SUITES PASS");
  console.log("CAP-SP01-02 Mandated evidence: staging job + CB-15 association OK");
  console.log("OBS-SB-STUB default path resolved (stub harness-only)");
}

run();

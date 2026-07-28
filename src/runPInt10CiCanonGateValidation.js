/**
 * P-INT-10 — CI Canon Gate validation suite (Plan §9.1).
 *
 * Usage:
 *   node src/runPInt10CiCanonGateValidation.js
 *
 * Does not modify Factory / Edge / Web / Supabase / Product / Marketplace.
 * Does not run GitHub Actions. Does not authorize push.
 */

import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import {
  CB_RUNNERS,
  CI_CANON_GATE_TEST_SKIP_TOKEN,
  FORBIDDEN_CLI_FLAGS,
  PHASE_STATUS_REL_PATH,
  REPO_ROOT,
  assertSafeGateArgs,
  evaluateCanonDriftGate,
  resolveCbSweepSkipPolicy,
  runCiCanonGate,
  sanitizeDriftReport,
  spawnCbRunnerDryRun,
} from "./integration/ciCanonGate/ciCanonGateAdapter.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

let passed = 0;
let failed = 0;

function check(name, fn) {
  try {
    const ret = fn();
    if (ret && typeof ret.then === "function") {
      throw new Error("Use checkAsync for async checks");
    }
    console.log(`PASS  ${name}`);
    passed += 1;
  } catch (err) {
    console.error(`FAIL  ${name}`);
    console.error(`      ${err.message}`);
    failed += 1;
  }
}

async function checkAsync(name, fn) {
  try {
    await fn();
    console.log(`PASS  ${name}`);
    passed += 1;
  } catch (err) {
    console.error(`FAIL  ${name}`);
    console.error(`      ${err.message}`);
    failed += 1;
  }
}

function readText(rel) {
  return fs.readFileSync(path.join(REPO_ROOT, rel), "utf8");
}

function mockAllPassRunner(calls) {
  return (runner) => {
    calls.push({ ...runner, argv: [runner.relPath] });
    return {
      id: runner.id,
      relPath: runner.relPath,
      passed: true,
      exitCode: 0,
      dryRun: true,
      argv: [runner.relPath],
      error: null,
    };
  };
}

// ---------------------------------------------------------------------------
// 01–04 Configuration / catalog
// ---------------------------------------------------------------------------

check("01 catalog lists exactly CB-00→CB-19 (20 runners)", () => {
  assert.equal(CB_RUNNERS.length, 20);
  assert.equal(CB_RUNNERS[0].id, "CB-00");
  assert.equal(CB_RUNNERS[19].id, "CB-19");
  for (const r of CB_RUNNERS) {
    assert.ok(fs.existsSync(path.join(REPO_ROOT, r.relPath)), `missing ${r.relPath}`);
  }
});

check("02 forbidden flags include --mark-complete and --approved-by", () => {
  assert.ok(FORBIDDEN_CLI_FLAGS.includes("--mark-complete"));
  assert.ok(FORBIDDEN_CLI_FLAGS.includes("--approved-by"));
});

check("03 assertSafeGateArgs rejects --mark-complete", () => {
  const r = assertSafeGateArgs(["--mark-complete"]);
  assert.equal(r.ok, false);
  assert.equal(r.flag, "--mark-complete");
});

check("04 assertSafeGateArgs rejects --approved-by", () => {
  const r = assertSafeGateArgs(["--approved-by", "Director"]);
  assert.equal(r.ok, false);
  assert.equal(r.flag, "--approved-by");
});

check("05 assertSafeGateArgs accepts empty argv (dry-run)", () => {
  assert.equal(assertSafeGateArgs([]).ok, true);
});

// ---------------------------------------------------------------------------
// 06–09 Gate orchestration (injectable runners)
// ---------------------------------------------------------------------------

await checkAsync("06 gate PASS when all 20 dry-run runners PASS + clean drift", async () => {
  const calls = [];
  const result = await runCiCanonGate({
    argv: [],
    runRunner: mockAllPassRunner(calls),
    driftRecords: [{ factory_key: "PILOT-CLEAN", elr: {} }],
  });
  assert.equal(calls.length, 20, "must invoke all 20 runners");
  assert.deepEqual(
    calls.map((c) => c.id),
    CB_RUNNERS.map((r) => r.id)
  );
  assert.equal(result.passed, true);
  assert.equal(result.phase, "complete");
  assert.equal(result.runners.every((r) => r.dryRun === true), true);
});

await checkAsync("07 fail-closed stops at first CB FAIL (no further runners)", async () => {
  const calls = [];
  const result = await runCiCanonGate({
    argv: [],
    runRunner: (runner) => {
      calls.push(runner.id);
      if (runner.id === "CB-02") {
        return {
          id: runner.id,
          relPath: runner.relPath,
          passed: false,
          exitCode: 1,
          dryRun: true,
          argv: [runner.relPath],
          error: "simulated CB-02 failure",
        };
      }
      return {
        id: runner.id,
        relPath: runner.relPath,
        passed: true,
        exitCode: 0,
        dryRun: true,
        argv: [runner.relPath],
        error: null,
      };
    },
  });
  assert.equal(result.passed, false);
  assert.equal(result.phase, "cb_sweep");
  assert.equal(result.failedRunner, "CB-02");
  assert.deepEqual(calls, ["CB-00", "CB-01", "CB-02"]);
});

await checkAsync("08 precheck fail-closed when argv has --mark-complete", async () => {
  const calls = [];
  const result = await runCiCanonGate({
    argv: ["--mark-complete"],
    runRunner: mockAllPassRunner(calls),
  });
  assert.equal(result.passed, false);
  assert.equal(result.phase, "precheck");
  assert.equal(calls.length, 0);
});

await checkAsync("09 rejects injectable non-dry-run result", async () => {
  const result = await runCiCanonGate({
    argv: [],
    runRunner: (runner) => ({
      id: runner.id,
      relPath: runner.relPath,
      passed: true,
      exitCode: 0,
      dryRun: false,
      argv: [runner.relPath],
      error: null,
    }),
  });
  assert.equal(result.passed, false);
  assert.match(result.reason, /Non-dry-run/);
});

// ---------------------------------------------------------------------------
// 10–12 Canon drift fail-closed
// ---------------------------------------------------------------------------

check("10 clean ELR does not blockDeployment", () => {
  const evaluated = evaluateCanonDriftGate({
    factory_key: "PILOT-CLEAN",
    elr: {
      loop_ledger_refs: [{ kind: "OK", actor: "MOT-CMP-01" }],
    },
  });
  assert.equal(evaluated.passed, true);
  assert.equal(evaluated.report.blockDeployment, false);
});

check("11 poisoned out-of-catalog actor → blockDeployment FAIL", () => {
  const evaluated = evaluateCanonDriftGate({
    factory_key: "PILOT-POISON",
    elr: {
      loop_ledger_refs: [{ kind: "DRIFT_INJECT", actor: "SHADOW-ACTOR-01" }],
    },
  });
  assert.equal(evaluated.passed, false);
  assert.equal(evaluated.report.blockDeployment, true);
  assert.ok(evaluated.report.drifted.some((d) => d.actor === "SHADOW-ACTOR-01"));
});

await checkAsync("12 gate FAIL when drift blocks after CB sweep PASS", async () => {
  const result = await runCiCanonGate({
    argv: [],
    runRunner: mockAllPassRunner([]),
    driftRecords: [
      {
        factory_key: "PILOT-POISON",
        elr: {
          loop_ledger_refs: [{ kind: "DRIFT_INJECT", actor: "SHADOW-ACTOR-01" }],
        },
      },
    ],
  });
  assert.equal(result.passed, false);
  assert.equal(result.phase, "canon_drift");
  assert.match(result.reason, /SHADOW-ACTOR-01/);
});

check("13 sanitizeDriftReport omits stacks and keeps actors", () => {
  const report = sanitizeDriftReport(
    evaluateCanonDriftGate({
      factory_key: "X",
      elr: { loop_ledger_refs: [{ actor: "SHADOW-ACTOR-01" }] },
    }).report
  );
  assert.equal(report.blockDeployment, true);
  assert.equal(typeof report.rule, "string");
  assert.ok(!("stack" in report));
});

// ---------------------------------------------------------------------------
// 14–17 Static protection / scope
// ---------------------------------------------------------------------------

check("14 adapter source does not write construction-phase-status.json", () => {
  const adapterSrc = readText("src/integration/ciCanonGate/ciCanonGateAdapter.js");
  assert.ok(!adapterSrc.includes("writeFileSync"));
  assert.ok(!adapterSrc.includes("markPhaseComplete"));
  assert.ok(!adapterSrc.includes("savePhaseStatus"));
  // Flag appears only as forbidden allowlist entry — never passed to spawn argv.
  assert.ok(adapterSrc.includes("FORBIDDEN_CLI_FLAGS"));
  assert.ok(adapterSrc.includes("const argv = [absScript]"));
  assert.ok(!adapterSrc.includes("argv.push"));
  // HQ-03: casual skipCbSweep must be rejected; tokenized test skip is explicit.
  assert.ok(adapterSrc.includes("resolveCbSweepSkipPolicy"));
  assert.ok(adapterSrc.includes("CI_CANON_GATE_TEST_SKIP_TOKEN"));
  assert.ok(adapterSrc.includes("skipCbSweep is prohibited"));
});

check("15 no GitHub Actions workflows introduced; CLI is local-only", () => {
  const cli = readText("src/runCiCanonGate.js");
  assert.ok(cli.includes("CI Canon Gate"));
  assert.ok(!cli.includes("github.com"));
  assert.ok(!fs.existsSync(path.join(REPO_ROOT, ".github", "workflows")));
});

check("16 no out-of-scope surfaces modified by this IMPL (static allowlist)", () => {
  // This check verifies protected paths still exist and adapter lives only under allowed trees.
  const allowedNew = [
    "src/integration/ciCanonGate/ciCanonGateAdapter.js",
    "src/runCiCanonGate.js",
    "src/runPInt10CiCanonGateValidation.js",
  ];
  for (const rel of allowedNew) {
    assert.ok(fs.existsSync(path.join(REPO_ROOT, rel)), rel);
  }
  // Protected anchors must remain present (not deleted by this block).
  assert.ok(fs.existsSync(path.join(REPO_ROOT, "services/factory-service-edge")));
  assert.ok(
    fs.existsSync(
      path.join(REPO_ROOT, "src/components/admin/factory/FactoryControlCenter.jsx")
    )
  );
  assert.ok(
    fs.existsSync(path.join(REPO_ROOT, "public/factory-observability-snapshot.json"))
  );
});

check("17 documented actor exception MOT-LIEN-01 does not blockDeployment", () => {
  const evaluated = evaluateCanonDriftGate({
    factory_key: "LIEN-EX",
    elr: {
      motor_manifests: [{ actor: "MOT-LIEN-01", motorId: "MOT-LIEN-01" }],
    },
  });
  assert.equal(evaluated.passed, true);
  assert.equal(evaluated.report.blockDeployment, false);
});

// ---------------------------------------------------------------------------
// 18–19 Real dry-run smoke (CB-18) + ledger immutability
// ---------------------------------------------------------------------------

check("18 real CB-18 dry-run spawn (no forbidden flags) + ledger unchanged", () => {
  const ledgerPath = path.join(REPO_ROOT, PHASE_STATUS_REL_PATH);
  const before = fs.readFileSync(ledgerPath, "utf8");
  const beforeMtime = fs.statSync(ledgerPath).mtimeMs;

  const runner = CB_RUNNERS.find((r) => r.id === "CB-18");
  const result = spawnCbRunnerDryRun(runner, { timeoutMs: 180_000 });

  assert.equal(result.dryRun, true);
  assert.deepEqual(result.argv, [runner.relPath]);
  assert.ok(!result.argv.some((a) => FORBIDDEN_CLI_FLAGS.includes(a)));
  assert.equal(result.exitCode, 0, `CB-18 dry-run should PASS: ${result.error}`);
  assert.equal(result.passed, true);

  const after = fs.readFileSync(ledgerPath, "utf8");
  const afterMtime = fs.statSync(ledgerPath).mtimeMs;
  assert.equal(after, before, "construction-phase-status.json must not change");
  assert.equal(afterMtime, beforeMtime, "ledger mtime must not change");
});

await checkAsync("19 CLI rejects --mark-complete without running sweep", async () => {
  const cli = path.join(REPO_ROOT, "src/runCiCanonGate.js");
  const result = spawnSync(process.execPath, [cli, "--mark-complete"], {
    cwd: REPO_ROOT,
    encoding: "utf8",
    timeout: 30_000,
  });
  assert.notEqual(result.status, 0);
  assert.match(`${result.stdout}\n${result.stderr}`, /mark-complete|Forbidden|FAIL/i);
});

// ---------------------------------------------------------------------------
// 20–23 HQ-03 — anti-bypass CB sweep skip hygiene (MINOR-01)
// ---------------------------------------------------------------------------

check("20 resolveCbSweepSkipPolicy rejects legacy skipCbSweep", () => {
  const r = resolveCbSweepSkipPolicy({ skipCbSweep: true });
  assert.equal(r.rejected, true);
  assert.equal(r.skip, false);
  assert.match(r.reason, /skipCbSweep is prohibited/i);
});

check("21 resolveCbSweepSkipPolicy rejects allowTestSkip without opaque token", () => {
  const r = resolveCbSweepSkipPolicy({
    allowTestSkipCbSweep: true,
    testSkipToken: { __ciCanonGateTestSkipCbSweep: true },
  });
  assert.equal(r.rejected, true);
  assert.match(r.reason, /CI_CANON_GATE_TEST_SKIP_TOKEN/i);
});

await checkAsync("22 runCiCanonGate fail-closed on legacy skipCbSweep", async () => {
  const calls = [];
  const result = await runCiCanonGate({
    argv: [],
    skipCbSweep: true,
    runRunner: mockAllPassRunner(calls),
  });
  assert.equal(result.passed, false);
  assert.equal(result.phase, "precheck");
  assert.equal(calls.length, 0);
  assert.equal(result.cbSweepSkipped, false);
  assert.match(result.reason, /skipCbSweep is prohibited/i);
});

await checkAsync("23 controlled test skip requires opaque token; CLI path never skips", async () => {
  const calls = [];
  const skipped = await runCiCanonGate({
    argv: [],
    allowTestSkipCbSweep: true,
    testSkipToken: CI_CANON_GATE_TEST_SKIP_TOKEN,
    runRunner: mockAllPassRunner(calls),
    driftRecords: [{ factory_key: "PILOT-CLEAN", elr: {} }],
  });
  assert.equal(skipped.passed, true);
  assert.equal(skipped.cbSweepSkipped, true);
  assert.equal(calls.length, 0);

  const releasePath = await runCiCanonGate({
    argv: [],
    runRunner: mockAllPassRunner(calls),
    driftRecords: [{ factory_key: "PILOT-CLEAN", elr: {} }],
  });
  assert.equal(releasePath.passed, true);
  assert.equal(releasePath.cbSweepSkipped, false);
  assert.equal(calls.length, 20);

  const cliSrc = readText("src/runCiCanonGate.js");
  assert.ok(!cliSrc.includes("skipCbSweep"));
  assert.ok(!cliSrc.includes("allowTestSkipCbSweep"));
});

// ---------------------------------------------------------------------------
// Summary
// ---------------------------------------------------------------------------

console.log("\n=== P-INT-10 CI Canon Gate Validation Summary ===");
console.log(`Passed: ${passed}`);
console.log(`Failed: ${failed}`);

if (failed > 0) {
  console.error("\n❌ P-INT-10 validation FAILED");
  process.exit(1);
}

console.log("\n✅ P-INT-10 validation PASSED");
process.exit(0);

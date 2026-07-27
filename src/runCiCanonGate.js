/**
 * P-INT-10 — CI Canon Gate CLI (local release process adapter).
 *
 * Usage:
 *   node src/runCiCanonGate.js
 *
 * Dry-run only. Forbidden: --mark-complete, --approved-by.
 * Exit 0 = PASS (release may continue). Exit 1 = FAIL (release blocked).
 */

import {
  assertSafeGateArgs,
  runCiCanonGate,
} from "./integration/ciCanonGate/ciCanonGateAdapter.js";

const argv = process.argv.slice(2);
const safety = assertSafeGateArgs(argv);

console.log("=== P-INT-10 CI Canon Gate ===\n");

if (!safety.ok) {
  console.error(`FAIL  precheck: ${safety.reason}`);
  process.exit(1);
}

const result = await runCiCanonGate({ argv });

console.log(
  JSON.stringify(
    {
      passed: result.passed,
      phase: result.phase,
      reason: result.reason,
      failedRunner: result.failedRunner,
      runnerCount: result.runners.length,
      runners: result.runners.map((r) => ({
        id: r.id,
        passed: r.passed,
        exitCode: r.exitCode,
        dryRun: r.dryRun,
        error: r.error,
      })),
      drift: result.drift,
    },
    null,
    2
  )
);

if (!result.passed) {
  console.error("\n❌ CI Canon Gate FAILED — release blocked (fail-closed)");
  process.exit(1);
}

console.log("\n✅ CI Canon Gate PASSED — release may continue");
process.exit(0);

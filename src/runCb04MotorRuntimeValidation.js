/**
 * CB-04 — Motor Runtime Foundation validation runner.
 *
 * Usage:
 *   node src/runCb04MotorRuntimeValidation.js
 *   node src/runCb04MotorRuntimeValidation.js --mark-complete
 */

import { runCb04Validation } from "./factory/cb04/validateCb04.js";

const args = process.argv.slice(2);
const markComplete = args.includes("--mark-complete");
const approvedByIndex = args.indexOf("--approved-by");
const approvedBy =
  approvedByIndex >= 0 && args[approvedByIndex + 1] ? args[approvedByIndex + 1] : null;

const result = await runCb04Validation({ markComplete, approvedBy });

console.log("=== CB-04 Motor Runtime Foundation Validation ===\n");
console.log(JSON.stringify(result, null, 2));

if (!result.passed) {
  console.error("\n❌ CB-04 validation FAILED");
  process.exit(1);
}

if (markComplete) {
  console.log("\n✅ CB-04 marked in construction-phase-status.json");
  if (!approvedBy) {
    console.log("⏳ Pending official Director approval before CB-05 execution");
  }
} else {
  console.log("\n✅ CB-04 validation PASSED (dry-run — use --mark-complete to persist)");
}

process.exit(0);

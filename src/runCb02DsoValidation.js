/**
 * CB-02 — DSO / Sources validation runner.
 *
 * Usage:
 *   node src/runCb02DsoValidation.js
 *   node src/runCb02DsoValidation.js --mark-complete
 */

import { runCb02Validation } from "./factory/cb02/validateCb02.js";

const args = process.argv.slice(2);
const markComplete = args.includes("--mark-complete");
const approvedByIndex = args.indexOf("--approved-by");
const approvedBy =
  approvedByIndex >= 0 && args[approvedByIndex + 1] ? args[approvedByIndex + 1] : null;

const result = runCb02Validation({ markComplete, approvedBy });

console.log("=== CB-02 DSO / Sources Validation ===\n");
console.log(JSON.stringify(result, null, 2));

if (!result.passed) {
  console.error("\n❌ CB-02 validation FAILED");
  process.exit(1);
}

if (markComplete) {
  console.log("\n✅ CB-02 marked in construction-phase-status.json");
  if (!approvedBy) {
    console.log("⏳ Pending official Director approval before CB-03 execution");
  }
} else {
  console.log("\n✅ CB-02 validation PASSED (dry-run — use --mark-complete to persist)");
}

process.exit(0);

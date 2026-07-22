/**
 * CB-00 — Constitutional anchoring validation runner.
 *
 * Usage:
 *   node src/runCb00CanonValidation.js
 *   node src/runCb00CanonValidation.js --mark-complete
 *   node src/runCb00CanonValidation.js --mark-complete --approved-by "Director"
 */

import { runCb00Validation } from "./factory/cb00/validateCb00.js";

const args = process.argv.slice(2);
const markComplete = args.includes("--mark-complete");
const approvedByIndex = args.indexOf("--approved-by");
const approvedBy =
  approvedByIndex >= 0 && args[approvedByIndex + 1] ? args[approvedByIndex + 1] : null;

const result = runCb00Validation({ markComplete, approvedBy });

console.log("=== CB-00 Constitutional Anchoring Validation ===\n");
console.log(JSON.stringify(result, null, 2));

if (!result.passed) {
  console.error("\n❌ CB-00 validation FAILED");
  process.exit(1);
}

if (markComplete) {
  console.log("\n✅ CB-00 marked COMPLETE in construction-phase-status.json");
  if (!approvedBy) {
    console.log("⏳ Pending official Director approval before CB-01 execution");
  }
} else {
  console.log("\n✅ CB-00 validation PASSED (dry-run — use --mark-complete to persist)");
}

process.exit(0);

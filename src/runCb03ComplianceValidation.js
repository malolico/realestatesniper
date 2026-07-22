/**
 * CB-03 — Compliance P0 validation runner.
 *
 * Usage:
 *   node src/runCb03ComplianceValidation.js
 *   node src/runCb03ComplianceValidation.js --mark-complete
 */

import { runCb03Validation } from "./factory/cb03/validateCb03.js";

const args = process.argv.slice(2);
const markComplete = args.includes("--mark-complete");
const approvedByIndex = args.indexOf("--approved-by");
const approvedBy =
  approvedByIndex >= 0 && args[approvedByIndex + 1] ? args[approvedByIndex + 1] : null;

const result = runCb03Validation({ markComplete, approvedBy });

console.log("=== CB-03 Compliance P0 Validation ===\n");
console.log(JSON.stringify(result, null, 2));

if (!result.passed) {
  console.error("\n❌ CB-03 validation FAILED");
  process.exit(1);
}

if (markComplete) {
  console.log("\n✅ CB-03 marked in construction-phase-status.json");
  if (!approvedBy) {
    console.log("⏳ Pending official Director approval before CB-04 execution");
  }
} else {
  console.log("\n✅ CB-03 validation PASSED (dry-run — use --mark-complete to persist)");
}

process.exit(0);

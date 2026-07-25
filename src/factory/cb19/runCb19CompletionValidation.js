/**
 * CB-19 — Factory Completion & End-to-End validation runner.
 */

import { runCb19Validation } from "./validateCb19.js";

const args = process.argv.slice(2);
const markComplete = args.includes("--mark-complete");
const approvedByIndex = args.indexOf("--approved-by");
const approvedBy =
  approvedByIndex >= 0 && args[approvedByIndex + 1] ? args[approvedByIndex + 1] : null;

const result = await runCb19Validation({ markComplete, approvedBy });

console.log("=== CB-19 Factory Completion & End-to-End Validation ===\n");
console.log(JSON.stringify(result, null, 2));

if (!result.passed) {
  console.error("\n❌ CB-19 validation FAILED");
  process.exit(1);
}

if (markComplete) {
  console.log("\n✅ CB-19 marked in construction-phase-status.json");
  console.log("🏭 Factory 2.0 Construction — COMPLETE");
  if (!approvedBy) {
    console.log("⏳ Pending official Director approval");
  }
} else {
  console.log("\n✅ CB-19 validation PASSED (dry-run — use --mark-complete to persist)");
  console.log("🏭 Factory 2.0 Construction — COMPLETE (certificate generated in report)");
}

process.exit(0);

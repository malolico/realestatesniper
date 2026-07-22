/**
 * CB-08 — Distress Layer validation runner.
 */

import { runCb08Validation } from "./factory/cb08/validateCb08.js";

const args = process.argv.slice(2);
const markComplete = args.includes("--mark-complete");
const approvedByIndex = args.indexOf("--approved-by");
const approvedBy =
  approvedByIndex >= 0 && args[approvedByIndex + 1] ? args[approvedByIndex + 1] : null;

const result = await runCb08Validation({ markComplete, approvedBy });

console.log("=== CB-08 Distress Layer Validation ===\n");
console.log(JSON.stringify(result, null, 2));

if (!result.passed) {
  console.error("\n❌ CB-08 validation FAILED");
  process.exit(1);
}

if (markComplete) {
  console.log("\n✅ CB-08 marked in construction-phase-status.json");
  if (!approvedBy) {
    console.log("⏳ Pending official Director approval before CB-09 execution");
  }
} else {
  console.log("\n✅ CB-08 validation PASSED (dry-run — use --mark-complete to persist)");
}

process.exit(0);

/**
 * CB-18 — Governance Dashboard validation runner.
 */

import { runCb18Validation } from "./validateCb18.js";

const args = process.argv.slice(2);
const markComplete = args.includes("--mark-complete");
const approvedByIndex = args.indexOf("--approved-by");
const approvedBy =
  approvedByIndex >= 0 && args[approvedByIndex + 1] ? args[approvedByIndex + 1] : null;

const result = await runCb18Validation({ markComplete, approvedBy });

console.log("=== CB-18 Governance Dashboard Validation ===\n");
console.log(JSON.stringify(result, null, 2));

if (!result.passed) {
  console.error("\n❌ CB-18 validation FAILED");
  process.exit(1);
}

if (markComplete) {
  console.log("\n✅ CB-18 marked in construction-phase-status.json");
  if (!approvedBy) {
    console.log("⏳ Pending official Director approval before CB-19 execution");
  }
} else {
  console.log("\n✅ CB-18 validation PASSED (dry-run — use --mark-complete to persist)");
}

process.exit(0);

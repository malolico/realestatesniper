/**
 * CB-12 — Swarm Coordinator validation runner.
 */

import { runCb12Validation } from "./factory/cb12/validateCb12.js";

const args = process.argv.slice(2);
const markComplete = args.includes("--mark-complete");
const approvedByIndex = args.indexOf("--approved-by");
const approvedBy =
  approvedByIndex >= 0 && args[approvedByIndex + 1] ? args[approvedByIndex + 1] : null;

const result = await runCb12Validation({ markComplete, approvedBy });

console.log("=== CB-12 Swarm Coordinator Validation ===\n");
console.log(JSON.stringify(result, null, 2));

if (!result.passed) {
  console.error("\n❌ CB-12 validation FAILED");
  process.exit(1);
}

if (markComplete) {
  console.log("\n✅ CB-12 marked in construction-phase-status.json");
  if (!approvedBy) {
    console.log("⏳ Pending official Director approval before CB-13 execution");
  }
} else {
  console.log("\n✅ CB-12 validation PASSED (dry-run — use --mark-complete to persist)");
}

process.exit(0);

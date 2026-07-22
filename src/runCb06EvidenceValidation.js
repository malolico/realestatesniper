/**
 * CB-06 — Evidence Service validation runner.
 *
 * Usage:
 *   node src/runCb06EvidenceValidation.js
 *   node src/runCb06EvidenceValidation.js --mark-complete
 */

import { runCb06Validation } from "./factory/cb06/validateCb06.js";

const args = process.argv.slice(2);
const markComplete = args.includes("--mark-complete");
const approvedByIndex = args.indexOf("--approved-by");
const approvedBy =
  approvedByIndex >= 0 && args[approvedByIndex + 1] ? args[approvedByIndex + 1] : null;

const result = await runCb06Validation({ markComplete, approvedBy });

console.log("=== CB-06 Evidence Service Validation ===\n");
console.log(JSON.stringify(result, null, 2));

if (!result.passed) {
  console.error("\n❌ CB-06 validation FAILED");
  process.exit(1);
}

if (markComplete) {
  console.log("\n✅ CB-06 marked in construction-phase-status.json");
  if (!approvedBy) {
    console.log("⏳ Pending official Director approval before CB-07 execution");
  }
} else {
  console.log("\n✅ CB-06 validation PASSED (dry-run — use --mark-complete to persist)");
}

process.exit(0);

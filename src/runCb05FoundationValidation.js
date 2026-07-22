/**
 * CB-05 — Foundation Layer validation runner.
 *
 * Usage:
 *   node src/runCb05FoundationValidation.js
 *   node src/runCb05FoundationValidation.js --mark-complete
 */

import { runCb05Validation } from "./factory/cb05/validateCb05.js";

const args = process.argv.slice(2);
const markComplete = args.includes("--mark-complete");
const approvedByIndex = args.indexOf("--approved-by");
const approvedBy =
  approvedByIndex >= 0 && args[approvedByIndex + 1] ? args[approvedByIndex + 1] : null;

const result = await runCb05Validation({ markComplete, approvedBy });

console.log("=== CB-05 Foundation Layer Validation ===\n");
console.log(JSON.stringify(result, null, 2));

if (!result.passed) {
  console.error("\n❌ CB-05 validation FAILED");
  process.exit(1);
}

if (markComplete) {
  console.log("\n✅ CB-05 marked in construction-phase-status.json");
  if (!approvedBy) {
    console.log("⏳ Pending official Director approval before CB-06 execution");
  }
} else {
  console.log("\n✅ CB-05 validation PASSED (dry-run — use --mark-complete to persist)");
}

process.exit(0);

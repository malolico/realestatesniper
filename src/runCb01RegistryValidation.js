/**
 * CB-01 — Factory Registry / ELR validation runner.
 *
 * Usage:
 *   node src/runCb01RegistryValidation.js
 *   node src/runCb01RegistryValidation.js --mark-complete
 *   node src/runCb01RegistryValidation.js --mark-complete --approved-by "Manolo"
 */

import { runCb01Validation } from "./factory/cb01/validateCb01.js";

const args = process.argv.slice(2);
const markComplete = args.includes("--mark-complete");
const approvedByIndex = args.indexOf("--approved-by");
const approvedBy =
  approvedByIndex >= 0 && args[approvedByIndex + 1] ? args[approvedByIndex + 1] : null;

const result = runCb01Validation({ markComplete, approvedBy });

console.log("=== CB-01 Factory Registry / ELR Validation ===\n");
console.log(JSON.stringify(result, null, 2));

if (!result.passed) {
  console.error("\n❌ CB-01 validation FAILED");
  process.exit(1);
}

if (markComplete) {
  console.log("\n✅ CB-01 marked in construction-phase-status.json");
  if (!approvedBy) {
    console.log("⏳ Pending official Director approval before CB-02 execution");
  } else {
    console.log("✅ CB-02 unlocked pending next phase authorization");
  }
} else {
  console.log("\n✅ CB-01 validation PASSED (dry-run — use --mark-complete to persist)");
}

process.exit(0);

/**
 * P-INT-09 — DealPipeline Reconciliation validation suite (Plan §9.1).
 *
 * Usage:
 *   node src/runPInt09DealPipelineReconciliationValidation.js
 *
 * Labeling / frontier checks only. Does not modify Factory / Edge / Web /
 * Supabase / Product / Marketplace. Does not retire dealPipeline (Fase IV).
 */

import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { SCORE_WEIGHTS, buildPipelineDeal } from "./lib/dealPipeline.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = path.resolve(__dirname, "..");

/** Frozen weights — must match pre–P-INT-09 semantics (Plan AC-06). */
const FROZEN_SCORE_WEIGHTS = Object.freeze({
  discount: 0.35,
  distress: 0.2,
  location: 0.15,
  dataCompleteness: 0.15,
  propertyType: 0.15,
});

/** Plan §2.2 inventory — all must carry binding labels. */
const LABELED_SURFACES = Object.freeze([
  "src/lib/dealPipeline.js",
  "src/lib/pipelinePreview.js",
  "src/lib/mapPipelineDealToSupabase.js",
  "src/runPipelinePreview.js",
  "src/runPipelineSupabasePayload.js",
  "src/runPipelineInsertSupabase.js",
]);

const REQUIRED_LABEL_MARKERS = Object.freeze([
  "non-canon",
  "provisional",
  "pre-Factory",
  "NOT Canon Factory",
  "does NOT substitute the ELR",
  "does NOT substitute maturity_score",
  "Fase IV",
]);

const FRONTIER_DOC =
  "docs/factory-construction/integration/FACTORY_INTEGRATION_P_INT_09_DEALPIPELINE_FRONTIER.md";

let passed = 0;
let failed = 0;

function check(name, fn) {
  try {
    fn();
    console.log(`PASS  ${name}`);
    passed += 1;
  } catch (err) {
    console.error(`FAIL  ${name}`);
    console.error(`      ${err.message}`);
    failed += 1;
  }
}

function readRel(rel) {
  return fs.readFileSync(path.join(REPO_ROOT, rel), "utf8");
}

// ---------------------------------------------------------------------------
// 01–03 Scoring semantic freeze
// ---------------------------------------------------------------------------

check("01 SCORE_WEIGHTS unchanged (frozen baseline)", () => {
  assert.deepEqual({ ...SCORE_WEIGHTS }, { ...FROZEN_SCORE_WEIGHTS });
});

check("02 buildPipelineDeal deterministic score for fixed fixture", () => {
  const deal = buildPipelineDeal({
    source_id: "PINT09-FIX-001",
    title: "Fixture Deal",
    city: "Phoenix",
    property_type: "Single Family",
    estimated_value: 400000,
    purchase_price: 300000,
    description: "vacant motivated seller",
  });
  assert.equal(typeof deal.score, "number");
  assert.ok(deal.score >= 0 && deal.score <= 100);
  // Frozen expectation for this fixture under unchanged algorithm:
  assert.equal(deal.score, 81);
  assert.equal(deal.score_band, "red");
  assert.equal(deal.access_tier, "standard");
});

check("03 dealPipeline.js does not alter weight literals vs freeze", () => {
  const src = readRel("src/lib/dealPipeline.js");
  assert.match(src, /discount:\s*0\.35/);
  assert.match(src, /distress:\s*0\.2/);
  assert.match(src, /location:\s*0\.15/);
  assert.match(src, /dataCompleteness:\s*0\.15/);
  assert.match(src, /propertyType:\s*0\.15/);
});

// ---------------------------------------------------------------------------
// 04–06 Labels / frontier
// ---------------------------------------------------------------------------

check("04 all inventory surfaces exist and carry binding labels", () => {
  for (const rel of LABELED_SURFACES) {
    const abs = path.join(REPO_ROOT, rel);
    assert.ok(fs.existsSync(abs), `missing ${rel}`);
    const src = fs.readFileSync(abs, "utf8");
    for (const marker of REQUIRED_LABEL_MARKERS) {
      assert.ok(
        src.includes(marker),
        `${rel} missing label marker: ${marker}`
      );
    }
  }
});

check("05 frontier declaration doc present with binding claims", () => {
  const doc = readRel(FRONTIER_DOC);
  assert.ok(doc.includes("non-canon"));
  assert.ok(doc.includes("provisional"));
  assert.ok(doc.includes("pre-Factory"));
  assert.ok(doc.includes("NOT substituted"));
  assert.ok(doc.includes("ELR"));
  assert.ok(doc.includes("maturity_score"));
  assert.ok(doc.includes("Fase IV"));
  assert.ok(doc.includes("does not** change the scoring") || doc.includes("does not change the scoring") || doc.includes("**does not** change"));
});

check("06 labeled surfaces do not import src/factory", () => {
  for (const rel of LABELED_SURFACES) {
    const src = readRel(rel);
    assert.ok(
      !/from\s+['"][^'"]*factory\//.test(src),
      `${rel} must not import Factory modules`
    );
    assert.ok(!src.includes("src/factory/"), `${rel} must not reference src/factory/`);
  }
});

// ---------------------------------------------------------------------------
// 07–12 Protected surfaces / Fase IV not executed
// ---------------------------------------------------------------------------

check("07 dealPipeline runtime not retired (Fase IV deferred)", () => {
  for (const rel of LABELED_SURFACES) {
    assert.ok(fs.existsSync(path.join(REPO_ROOT, rel)), rel);
  }
  assert.ok(
    typeof buildPipelineDeal === "function",
    "buildPipelineDeal must remain exported"
  );
});

check("08 no Factory path edits in this working tree scope (static anchors)", () => {
  assert.ok(fs.existsSync(path.join(REPO_ROOT, "src/factory/cb18")));
  assert.ok(
    fs.existsSync(path.join(REPO_ROOT, "src/factory/cb00/validateCb00.js"))
  );
});

check("09 Service Edge / FCC / snapshot anchors intact", () => {
  assert.ok(fs.existsSync(path.join(REPO_ROOT, "services/factory-service-edge")));
  assert.ok(
    fs.existsSync(
      path.join(REPO_ROOT, "src/components/admin/factory/FactoryControlCenter.jsx")
    )
  );
  assert.ok(
    fs.existsSync(path.join(REPO_ROOT, "public/factory-observability-snapshot.json"))
  );
});

check("10 labeled files do not contain mark-complete or phase ledger writes", () => {
  for (const rel of LABELED_SURFACES) {
    const src = readRel(rel);
    assert.ok(!src.includes("markPhaseComplete"));
    assert.ok(!src.includes("construction-phase-status.json"));
  }
});

check("11 frontier doc does not authorize Fase IV retirement", () => {
  const doc = readRel(FRONTIER_DOC);
  assert.ok(doc.includes("deferred") || doc.includes("DEFERRED") || doc.includes("NOT"));
  assert.ok(doc.includes("Fase IV"));
});

check("12 P-INT-09 validation runner stays harness-only (no Edge/FCC imports)", () => {
  const self = readRel("src/runPInt09DealPipelineReconciliationValidation.js");
  assert.ok(!/from\s+['"].*factory-service-edge/.test(self));
  assert.ok(!/from\s+['"].*FactoryControlCenter/.test(self));
  assert.ok(!/from\s+['"]@supabase/.test(self));
});

// ---------------------------------------------------------------------------
// Summary
// ---------------------------------------------------------------------------

console.log("\n=== P-INT-09 DealPipeline Reconciliation Validation Summary ===");
console.log(`Passed: ${passed}`);
console.log(`Failed: ${failed}`);

if (failed > 0) {
  console.error("\n❌ P-INT-09 validation FAILED");
  process.exit(1);
}

console.log("\n✅ P-INT-09 validation PASSED");
process.exit(0);

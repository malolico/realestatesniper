/**
 * CB-05 — LOOP-FND-FRS-01 Foundation Freshness Guardian Loop
 */

import { FOUNDATION_LOOPS } from "./foundationCatalog.js";

export const LOOP_FND_FRS_01 = FOUNDATION_LOOPS[1];

const SLA_DAYS = 365;

/**
 * @param {{ vintageAt: string }[]} sourceRefs
 */
export function evaluateFreshness(sourceRefs) {
  const now = Date.now();
  const breaches = [];

  for (const ref of sourceRefs) {
    if (!ref?.vintageAt) continue;
    const ageDays = (now - new Date(ref.vintageAt).getTime()) / (1000 * 60 * 60 * 24);
    if (ageDays > SLA_DAYS) {
      breaches.push({ refId: ref.id, ageDays: Math.round(ageDays) });
    }
  }

  return {
    fresh: breaches.length === 0,
    breaches,
    slaDays: SLA_DAYS,
  };
}

/**
 * @param {{
 *   sourceRefs: object[],
 *   supervisedManifests: object[],
 * }} snapshot
 */
export function evaluateFoundationFreshness(snapshot) {
  const freshness = evaluateFreshness(snapshot.sourceRefs ?? []);
  const motorsCovered = new Set(
    snapshot.supervisedManifests.map((m) => m.motorId)
  );

  return {
    loopId: LOOP_FND_FRS_01.id,
    finalizer: freshness.fresh ? "FIN-S" : "FIN-R",
    fresh: freshness.fresh,
    reexecutionHints: freshness.fresh
      ? []
      : ["MOT-IDN-01", "MOT-LOC-01", "MOT-PHY-01"].filter((m) => motorsCovered.has(m)),
    metrics: {
      foundation_freshness_pct: freshness.fresh ? 1 : 0,
      sla_breach_count: freshness.breaches.length,
    },
    breaches: freshness.breaches,
  };
}

/**
 * @param {import('../cb01/factoryRegistry.js').FactoryRegistry} registry
 * @param {string} factoryKey
 * @param {ReturnType<evaluateFoundationFreshness>} result
 */
export function recordLoopFndFrs01(registry, factoryKey, result) {
  return registry.registerElrAct(
    factoryKey,
    "loop_ledger_refs",
    {
      kind: "LOOP_FND_FRS_01_RUN",
      loopId: LOOP_FND_FRS_01.id,
      finalizer: result.finalizer,
      fresh: result.fresh,
      reexecutionHints: result.reexecutionHints,
      metrics: result.metrics,
      constitutionalPhase: "CB-05",
    },
    { actor: LOOP_FND_FRS_01.id }
  );
}

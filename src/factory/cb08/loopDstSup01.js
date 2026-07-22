/**
 * CB-08 — LOOP-DST-SUP-01 Distress Vital & Judicial Quality Loop
 */

import { DISTRESS_LOOPS } from "./distressCatalog.js";

export const LOOP_DST_SUP_01 = DISTRESS_LOOPS.find((l) => l.id === "LOOP-DST-SUP-01");

/**
 * @param {{
 *   manifests: object[],
 *   mpiCoverage: { domain: string, reachable: boolean }[],
 *   legHandoff?: boolean,
 *   motivationSufficient?: boolean,
 * }} snapshot
 */
export function evaluateDistressQuality(snapshot) {
  const requiredDomains = ["08", "09", "10", "11", "12", "16", "17", "18", "19", "26"];
  const ddiReachable = requiredDomains.every((d) =>
    snapshot.mpiCoverage.some((c) => c.domain === d && c.reachable)
  );

  if (!snapshot.legHandoff) {
    return {
      loopId: LOOP_DST_SUP_01.id,
      finalizer: "FIN-R",
      sufficient: false,
      reason: "missing_leg_handoff",
    };
  }

  const cntManifest = snapshot.manifests.find((m) => m.motorId === "MOT-CNT-01");
  const contactGated = cntManifest?.outputs?.contactGated === true;
  const sufficient =
    ddiReachable && contactGated && snapshot.motivationSufficient === true;

  return {
    loopId: LOOP_DST_SUP_01.id,
    finalizer: sufficient ? "FIN-S" : "FIN-R",
    sufficient,
    metrics: {
      distress_quality_score: sufficient ? 1 : 0,
      ddi_part_iii_coverage: ddiReachable ? 1 : 0,
      contact_gated: contactGated ? 1 : 0,
    },
  };
}

/**
 * @param {import('../cb01/factoryRegistry.js').FactoryRegistry} registry
 * @param {string} factoryKey
 * @param {ReturnType<evaluateDistressQuality>} result
 */
export function recordLoopDstSup01(registry, factoryKey, result) {
  return registry.registerElrAct(
    factoryKey,
    "loop_ledger_refs",
    {
      kind: "LOOP_DST_SUP_01_RUN",
      loopId: LOOP_DST_SUP_01.id,
      finalizer: result.finalizer,
      sufficient: result.sufficient,
      metrics: result.metrics,
      constitutionalPhase: "CB-08",
    },
    { actor: LOOP_DST_SUP_01.id }
  );
}

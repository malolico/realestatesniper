/**
 * CB-08 — LOOP-XVR-CHR-01 Cross-proceeding Timeline Loop
 */

import { DISTRESS_LOOPS } from "./distressCatalog.js";

export const LOOP_XVR_CHR_01 = DISTRESS_LOOPS.find((l) => l.id === "LOOP-XVR-CHR-01");

/**
 * @param {{ manifests: object[] }} snapshot
 */
export function evaluateCrossProceedingTimeline(snapshot) {
  const chr01 = snapshot.manifests.find((m) => m.motorId === "MOT-CHR-01");
  const chr02 = snapshot.manifests.find((m) => m.motorId === "MOT-CHR-02");
  const jud = snapshot.manifests.find((m) => m.motorId === "MOT-JUD-01");
  const lfe = snapshot.manifests.filter((m) => m.motorId?.startsWith("MOT-LFE-"));

  const concurrentProceedings =
    (chr01 ? 1 : 0) + (chr02 ? 1 : 0) + (jud ? 1 : 0) + lfe.length;
  const crossOverlap = concurrentProceedings >= 3;

  return {
    loopId: LOOP_XVR_CHR_01.id,
    finalizer: crossOverlap ? "FIN-S" : "FIN-R",
    sufficient: crossOverlap,
    concurrentProceedings,
    crossOverlap,
  };
}

/**
 * @param {import('../cb01/factoryRegistry.js').FactoryRegistry} registry
 * @param {string} factoryKey
 * @param {ReturnType<evaluateCrossProceedingTimeline>} result
 */
export function recordLoopXvrChr01(registry, factoryKey, result) {
  return registry.registerElrAct(
    factoryKey,
    "loop_ledger_refs",
    {
      kind: "LOOP_XVR_CHR_01_RUN",
      loopId: LOOP_XVR_CHR_01.id,
      finalizer: result.finalizer,
      sufficient: result.sufficient,
      concurrentProceedings: result.concurrentProceedings,
      crossOverlap: result.crossOverlap,
      constitutionalPhase: "CB-08",
    },
    { actor: LOOP_XVR_CHR_01.id }
  );
}

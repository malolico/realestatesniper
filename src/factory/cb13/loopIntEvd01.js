/**
 * CB-13 — LOOP-INT-EVD-01 Intelligence Evidence Sufficiency Loop
 */

import { INTELLIGENCE_LOOPS } from "./intelligenceCatalog.js";
import { routeSufficiencyGap, recordSufficiencyGapDerivation } from "./sufficiencyGapRouter.js";

export const LOOP_INT_EVD_01 = INTELLIGENCE_LOOPS.find((l) => l.id === "LOOP-INT-EVD-01");

/**
 * @param {{
 *   evidenceSufficient?: boolean,
 *   multiDomainGap?: boolean,
 *   openConflicts?: number,
 * }} snapshot
 */
export function evaluateIntelligenceEvidenceSufficiency(snapshot) {
  const sufficient = snapshot.evidenceSufficient === true;
  const gapRoute = routeSufficiencyGap({
    evidenceSufficient: sufficient,
    multiDomainGap: snapshot.multiDomainGap,
    openConflicts: snapshot.openConflicts,
  });

  return {
    loopId: LOOP_INT_EVD_01.id,
    finalizer: sufficient ? "FIN-S" : "FIN-H",
    sufficient,
    gapRoute,
    handoff: sufficient
      ? { target: "LOOP-INT-RDY-01", layer: "INT" }
      : gapRoute.action === "DERIVE_SWARM"
        ? { target: gapRoute.target }
        : { target: "LOOP-XVR-EVD-01" },
  };
}

/**
 * @param {import('../cb01/factoryRegistry.js').FactoryRegistry} registry
 * @param {string} factoryKey
 * @param {ReturnType<evaluateIntelligenceEvidenceSufficiency>} result
 */
export function recordLoopIntEvd01(registry, factoryKey, result) {
  registry.registerElrAct(
    factoryKey,
    "loop_ledger_refs",
    {
      kind: "LOOP_INT_EVD_01_RUN",
      loopId: LOOP_INT_EVD_01.id,
      finalizer: result.finalizer,
      sufficient: result.sufficient,
      constitutionalPhase: "CB-13",
    },
    { actor: LOOP_INT_EVD_01.id }
  );

  if (!result.sufficient && result.gapRoute?.action !== "CONTINUE") {
    recordSufficiencyGapDerivation(registry, factoryKey, result.gapRoute);
  }

  return result;
}

/**
 * CB-07 — LOOP-LEG-SUP-01 Legitimacy Transfer Quality Loop
 */

import { LEGITIMACY_LOOPS } from "./legitimacyCatalog.js";
import { routeLegitimacyConflict, recordLegitimacyConflictDerivation } from "./legitimacyConflictRouter.js";

export const LOOP_LEG_SUP_01 = LEGITIMACY_LOOPS[0];

/**
 * @param {{
 *   manifests: object[],
 *   mpiCoverage: { domain: string, reachable: boolean }[],
 *   blockers: object[],
 *   foundationHandoff?: boolean,
 *   ownerMismatch?: boolean,
 *   titleCloud?: boolean,
 * }} snapshot
 */
export function evaluateLegitimacyQuality(snapshot) {
  const ddiDomains = ["07", "08", "09", "10"];
  const ddiReachable = ddiDomains.every((d) =>
    snapshot.mpiCoverage.some((c) => c.domain === d && c.reachable)
  );

  const c1Blockers = (snapshot.blockers ?? []).filter((b) => b.severity === "C1");
  const conflictRoute = routeLegitimacyConflict({
    ownerMismatch: snapshot.ownerMismatch,
    titleCloud: snapshot.titleCloud,
    multiDomain: c1Blockers.length >= 2,
    domainCount: c1Blockers.length,
  });

  if (!snapshot.foundationHandoff) {
    return {
      loopId: LOOP_LEG_SUP_01.id,
      finalizer: "FIN-R",
      sufficient: false,
      reason: "missing_fnd_handoff",
      conflictRoute,
    };
  }

  const sufficient = ddiReachable && c1Blockers.length === 0 && conflictRoute.action === "CONTINUE";

  return {
    loopId: LOOP_LEG_SUP_01.id,
    finalizer: sufficient ? "FIN-S" : c1Blockers.length > 0 ? "FIN-K" : "FIN-R",
    sufficient,
    handoff: sufficient ? { target: LOOP_LEG_SUP_01.handoffTarget, layer: "DST" } : null,
    blockersDocumented: c1Blockers,
    conflictRoute,
    metrics: {
      transfer_readiness_score: sufficient ? 1 : 0,
      blocker_count: c1Blockers.length,
      ddi_part_ii_coverage: ddiReachable ? 1 : 0,
    },
  };
}

/**
 * @param {import('../cb01/factoryRegistry.js').FactoryRegistry} registry
 * @param {string} factoryKey
 * @param {ReturnType<evaluateLegitimacyQuality>} result
 */
export function recordLoopLegSup01(registry, factoryKey, result) {
  registry.registerElrAct(
    factoryKey,
    "loop_ledger_refs",
    {
      kind: "LOOP_LEG_SUP_01_RUN",
      loopId: LOOP_LEG_SUP_01.id,
      finalizer: result.finalizer,
      sufficient: result.sufficient,
      handoff: result.handoff,
      blockersDocumented: result.blockersDocumented,
      metrics: result.metrics,
      constitutionalPhase: "CB-07",
    },
    { actor: LOOP_LEG_SUP_01.id }
  );

  if (result.conflictRoute?.action !== "CONTINUE") {
    recordLegitimacyConflictDerivation(registry, factoryKey, result.conflictRoute);
  }

  if (result.sufficient && result.handoff) {
    registry.registerElrAct(
      factoryKey,
      "decision_handoffs",
      {
        kind: "LEG_FIN_S_HANDOFF",
        fromLoop: LOOP_LEG_SUP_01.id,
        toLoop: result.handoff.target,
        layer: result.handoff.layer,
        message: "Transfer assessment complete — handoff to Distress layer",
      },
      { actor: LOOP_LEG_SUP_01.id }
    );
  }

  return result;
}

/**
 * CB-07 — LOOP-LEG-EVD-01 + LOOP-XVR-EVD-01
 */

import { LEGITIMACY_LOOPS } from "./legitimacyCatalog.js";
import { routeLegitimacyConflict, recordLegitimacyConflictDerivation } from "./legitimacyConflictRouter.js";

export const LOOP_LEG_EVD_01 = LEGITIMACY_LOOPS[2];
export const LOOP_XVR_EVD_01 = LEGITIMACY_LOOPS[3];

/**
 * @param {{
 *   ownerMismatch?: boolean,
 *   titleCloud?: boolean,
 *   multiDomain?: boolean,
 *   domainCount?: number,
 * }} snapshot
 */
export function evaluateLegitimacyEvidenceChallenge(snapshot) {
  const route = routeLegitimacyConflict({
    ownerMismatch: snapshot.ownerMismatch,
    titleCloud: snapshot.titleCloud,
    multiDomain: snapshot.multiDomain,
    domainCount: snapshot.domainCount,
  });

  return {
    loopId: LOOP_LEG_EVD_01.id,
    finalizer: route.action === "CONTINUE" ? "FIN-S" : "FIN-H",
    route,
    escalatesToSwarm: route.action === "DERIVE_SWARM",
    xvrLoop: LOOP_XVR_EVD_01.id,
  };
}

/**
 * @param {import('../cb01/factoryRegistry.js').FactoryRegistry} registry
 * @param {string} factoryKey
 * @param {ReturnType<evaluateLegitimacyEvidenceChallenge>} result
 */
export function recordLoopLegEvd01(registry, factoryKey, result) {
  registry.registerElrAct(
    factoryKey,
    "loop_ledger_refs",
    {
      kind: "LOOP_LEG_EVD_01_RUN",
      loopId: LOOP_LEG_EVD_01.id,
      finalizer: result.finalizer,
      escalatesToSwarm: result.escalatesToSwarm,
      xvrLoop: result.xvrLoop,
      constitutionalPhase: "CB-07",
    },
    { actor: LOOP_LEG_EVD_01.id }
  );

  if (result.route.action !== "CONTINUE") {
    recordLegitimacyConflictDerivation(registry, factoryKey, result.route);
  }

  if (result.escalatesToSwarm) {
    registry.registerElrAct(
      factoryKey,
      "loop_ledger_refs",
      {
        kind: "LOOP_XVR_EVD_01_ESCALATION",
        loopId: LOOP_XVR_EVD_01.id,
        fromLoop: LOOP_LEG_EVD_01.id,
        swarmTarget: result.route.target,
        constitutionalPhase: "CB-07",
      },
      { actor: LOOP_XVR_EVD_01.id }
    );
  }

  return result;
}

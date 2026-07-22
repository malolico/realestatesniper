/**
 * CB-11 — Integrated loop runners (CB-05..CB-10 + stubs)
 */

import { LoopXvrCmp01 } from "../cb03/loopXvrCmp01.js";
import { CLEARANCE_STATUS } from "../cb03/clearanceProtocol.js";
import { evaluateFoundationQuality } from "../cb05/loopFndSup01.js";
import { evaluateFoundationFreshness as evaluateFndFrs } from "../cb05/loopFndFrs01.js";
import { evaluateLegitimacyQuality } from "../cb07/loopLegSup01.js";
import { evaluateLegitimacyGaps } from "../cb07/loopLegGap01.js";
import { evaluateLegitimacyEvidenceChallenge } from "../cb07/loopLegEvd01.js";
import { evaluateDistressQuality } from "../cb08/loopDstSup01.js";
import { evaluateMotivationConvergence } from "../cb08/loopDstCvg01.js";
import { evaluateContactLoop } from "../cb08/loopDstCnt01.js";
import { evaluateDistressInvestigation } from "../cb08/loopDstInv01.js";
import { evaluateCrossProceedingTimeline } from "../cb08/loopXvrChr01.js";
import { evaluateEcoSupervisor } from "../cb09/loopEcoSup01.js";
import { evaluateFinancialFreshness } from "../cb09/loopEcoFrs01.js";
import { evaluateValuationQuality } from "../cb09/loopEcoQlt01.js";
import { evaluateInvestmentSufficiency } from "../cb09/loopEcoQlt02.js";
import { evaluateHazardFreshness } from "../cb09/loopEcoFrs02.js";
import { evaluateEnvironmentQuality } from "../cb10/loopEnvSup01.js";
import { evaluateEnvironmentFreshness } from "../cb10/loopEnvFrs01.js";
import { resolveLoopActivators } from "./loopActivators.js";
import {
  evaluateIntRdy01,
  evaluateIntGap01,
  evaluateIntQlt01,
  evaluateIntFrs01,
  evaluateIntEvd01,
  evaluateXvrEvd01,
} from "./integrationLoopStubs.js";
import { OLC_LOOP_CATALOG } from "./loopEngineCatalog.js";

const xvrCmp = new LoopXvrCmp01();

/**
 * @param {object} ctx
 */
function wrapResult(ctx, result) {
  const activators = resolveLoopActivators(ctx.signals ?? {});
  return {
    ...result,
    activators,
    integratedPhase: getLoopEntry(result.loopId)?.integratedPhase ?? "CB-11",
    executable: true,
  };
}

function getLoopEntry(loopId) {
  return OLC_LOOP_CATALOG.find((l) => l.id === loopId);
}

/**
 * @param {object} ctx — execution context built by LoopEngineService
 */
export function runIntegratedLoop(loopId, ctx) {
  const runners = {
    "LOOP-XVR-CMP-01": () => {
      const cmpResult = { clearance: CLEARANCE_STATUS.PASS, violations: [] };
      const sup = xvrCmp.supervise(cmpResult);
      return {
        loopId,
        finalizer: sup.action,
        sufficient: sup.action === "FIN-S",
        blocked: sup.block === true,
      };
    },
    "LOOP-XVR-EVD-01": () => evaluateXvrEvd01(ctx.snapshot),
    "LOOP-XVR-CHR-01": () =>
      evaluateCrossProceedingTimeline({ manifests: ctx.snapshot.distress.manifests }),
    "LOOP-FND-SUP-01": () => evaluateFoundationQuality(ctx.snapshot.foundation),
    "LOOP-FND-FRS-01": () => evaluateFndFrs(ctx.snapshot.foundationFrs),
    "LOOP-LEG-SUP-01": () => evaluateLegitimacyQuality(ctx.snapshot.legitimacy),
    "LOOP-LEG-GAP-01": () => evaluateLegitimacyGaps(ctx.snapshot.legitimacyGaps),
    "LOOP-LEG-EVD-01": () => evaluateLegitimacyEvidenceChallenge(ctx.snapshot.legitimacyEvd),
    "LOOP-DST-CVG-01": () => evaluateMotivationConvergence(ctx.snapshot.distressCvg),
    "LOOP-DST-SUP-01": () => evaluateDistressQuality(ctx.snapshot.distress),
    "LOOP-DST-CNT-01": () => evaluateContactLoop(ctx.snapshot.distressCnt),
    "LOOP-DST-INV-01": () => evaluateDistressInvestigation(ctx.snapshot.distressInv),
    "LOOP-ECO-SUP-01": () => evaluateEcoSupervisor(ctx.snapshot.ecoSup),
    "LOOP-ECO-FRS-01": () => evaluateFinancialFreshness(ctx.snapshot.ecoFrs01),
    "LOOP-ECO-QLT-01": () => evaluateValuationQuality(ctx.snapshot.ecoQlt01),
    "LOOP-ECO-QLT-02": () => evaluateInvestmentSufficiency(ctx.snapshot.ecoQlt02),
    "LOOP-ECO-FRS-02": () => evaluateHazardFreshness(ctx.snapshot.ecoFrs02),
    "LOOP-ENV-SUP-01": () => evaluateEnvironmentQuality(ctx.snapshot.envSup),
    "LOOP-ENV-FRS-01": () => evaluateEnvironmentFreshness(ctx.snapshot.envFrs),
    "LOOP-INT-RDY-01": () => evaluateIntRdy01(ctx.snapshot.int),
    "LOOP-INT-GAP-01": () => evaluateIntGap01(ctx.snapshot.int),
    "LOOP-INT-QLT-01": () => evaluateIntQlt01(ctx.snapshot.int),
    "LOOP-INT-FRS-01": () => evaluateIntFrs01(ctx.snapshot.int),
    "LOOP-INT-EVD-01": () => evaluateIntEvd01(ctx.snapshot.int),
  };

  const runner = runners[loopId];
  if (!runner) {
    throw new Error(`[CB-11 Loop Engine] No runner for ${loopId}`);
  }
  return wrapResult(ctx, runner());
}

/**
 * @param {object} ctx
 */
export function runAllIntegratedLoops(ctx) {
  return OLC_LOOP_CATALOG.map((entry) => runIntegratedLoop(entry.id, ctx));
}

/**
 * SP01-IB-09 Mandated Gap-Fill — CB-15 orchestration consumer (adapter).
 *
 * Mandate: SP01-IB-09-IMPL §6
 * Resolves OBS-SB-STUB / GAP-IB03-01 by associating staging job execution
 * with CB-15 public `orchestrateExpediente` — without modifying CB-15 semantics.
 *
 * Does NOT invent HTTP APIs. Does NOT touch Product / Marketplace / Arizona / Supabase.
 */

import { OrchestrationBusService } from "../../src/factory/cb15/index.js";

export const CB15_ORCHESTRATION_STATUS = "CB15_OK";
export const CB15_ORCHESTRATION_SUMMARY_CODE = "SP01_IB09_CB15";

/**
 * @param {{
 *   bus?: import("../../src/factory/cb15/orchestrationBusService.js").OrchestrationBusService,
 *   busDeps?: object,
 * }} [options]
 * @returns {(job: object, hooks: object) => Promise<object>}
 */
export function createCb15OrchestrationExecutor(options = {}) {
  let bus = options.bus ?? null;
  const busDeps = options.busDeps ?? {};

  return async function runCb15Orchestration(job, hooks) {
    let cp = await hooks.checkpoint("start");
    if (cp.cancelled || hooks.isCancelRequested()) {
      return { cancelled: true };
    }

    if (!bus) {
      bus = new OrchestrationBusService(busDeps);
    }

    cp = await hooks.checkpoint("before-cb15");
    if (cp.cancelled || hooks.isCancelRequested()) {
      return { cancelled: true };
    }

    const result = await bus.orchestrateExpediente(job.factoryKey, {
      candidateRef: `sp01-ib09-${job.jobId}`,
      parcelId: `ffo-${String(job.jobId).replace(/[^a-zA-Z0-9_-]/g, "").slice(0, 24) || "bus"}`,
      runLoopEngine: true,
      runSwarm: false,
    });

    if (hooks.isCancelRequested()) {
      await hooks.checkpoint("cancel-after-cb15");
      return { cancelled: true };
    }

    cp = await hooks.checkpoint("end");
    if (cp.cancelled || hooks.isCancelRequested()) {
      return { cancelled: true };
    }

    return {
      cancelled: false,
      resultSummary: {
        factoryKey: result.factoryKey,
        orchestrationStatus: CB15_ORCHESTRATION_STATUS,
        summaryCode: CB15_ORCHESTRATION_SUMMARY_CODE,
      },
    };
  };
}

/** Default Mandated staging executor (live CB-15 association). */
export const runCb15Orchestration = createCb15OrchestrationExecutor();

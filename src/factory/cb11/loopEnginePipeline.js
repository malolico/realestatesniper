/**
 * CB-11 — OLC §IV.1 pipeline orchestration
 */

import { OLC_LOOP_CATALOG, OLC_PIPELINE_ORDER } from "./loopEngineCatalog.js";
import { buildFinHandoff } from "./finalizerCoordinator.js";

/**
 * @param {{ loopResults: { loopId: string, finalizer: string, sufficient?: boolean }[] }} input
 */
export function buildOlcPipelineHandoffs(input) {
  const handoffs = [];
  const stageFinalizers = {
    FND: input.loopResults.filter((r) => r.loopId.startsWith("LOOP-FND")),
    LEG: input.loopResults.filter((r) => r.loopId.startsWith("LOOP-LEG")),
    DST: input.loopResults.filter((r) => r.loopId.startsWith("LOOP-DST")),
    ECO: input.loopResults.filter((r) => r.loopId.startsWith("LOOP-ECO")),
    ENV: input.loopResults.filter((r) => r.loopId.startsWith("LOOP-ENV")),
    INT: input.loopResults.filter((r) => r.loopId.startsWith("LOOP-INT")),
  };

  const stageTargets = {
    FND: "LOOP-LEG-SUP-01",
    LEG: "LOOP-DST-SUP-01",
    DST: "LOOP-ECO-SUP-01",
    ECO: "LOOP-ENV-SUP-01",
    ENV: "LOOP-INT-RDY-01",
    INT: "LOOP-INT-RDY-01",
  };

  for (const stage of OLC_PIPELINE_ORDER.filter((s) => !s.startsWith("LOOP-"))) {
    const results = stageFinalizers[stage] ?? [];
    const finS = results.find((r) => r.finalizer === "FIN-S" || r.finalizer === "FIN-H");
    if (finS) {
      const handoff = buildFinHandoff(finS.finalizer, stageTargets[stage]);
      if (handoff) {
        handoffs.push({
          fromStage: stage,
          fromLoop: finS.loopId,
          ...handoff,
        });
      }
    }
  }

  return {
    pipelineOrder: OLC_PIPELINE_ORDER,
    pipelineSection: "OLC-IV.1",
    handoffs,
    loopCount: OLC_LOOP_CATALOG.length,
  };
}

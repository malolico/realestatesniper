/**
 * CB-13 — Intelligence motor execution pipeline
 */

import { INTELLIGENCE_PIPELINE_SEQUENCE } from "./intelligenceCatalog.js";

/**
 * @param {import('../cb04/motorRuntime.js').MotorRuntime} runtime
 * @param {string} factoryKey
 * @param {{ inputs?: object, gateEvaluation?: object }} [options]
 */
export async function runIntelligencePipeline(runtime, factoryKey, options = {}) {
  const manifests = [];
  const inputs = options.inputs ?? {};

  for (const motorId of INTELLIGENCE_PIPELINE_SEQUENCE) {
    const motorOptions = { inputs, useStub: false, invoker: "IntelligencePipeline" };
    if (motorId === "MOT-SYN-02") {
      motorOptions.gateEvaluation = options.gateEvaluation;
    }
    manifests.push(await runtime.execute(factoryKey, motorId, motorOptions));
  }

  return manifests;
}

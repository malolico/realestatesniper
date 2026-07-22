/**
 * CB-09 — Economy motor execution pipeline
 */

import { ECONOMY_PIPELINE_SEQUENCE } from "./economyCatalog.js";

/**
 * @param {import('../cb04/motorRuntime.js').MotorRuntime} runtime
 * @param {string} factoryKey
 * @param {{ inputs?: object }} [options]
 */
export async function runEconomyPipeline(runtime, factoryKey, options = {}) {
  const manifests = [];
  const inputs = options.inputs ?? {};

  for (const motorId of ECONOMY_PIPELINE_SEQUENCE) {
    manifests.push(
      await runtime.execute(factoryKey, motorId, {
        inputs,
        useStub: false,
        invoker: "EconomyPipeline",
      })
    );
  }

  return manifests;
}

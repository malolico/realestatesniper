/**
 * CB-10 — Environment motor execution pipeline
 */

import { ENVIRONMENT_PIPELINE_SEQUENCE } from "./environmentCatalog.js";

/**
 * @param {import('../cb04/motorRuntime.js').MotorRuntime} runtime
 * @param {string} factoryKey
 * @param {{ inputs?: object }} [options]
 */
export async function runEnvironmentPipeline(runtime, factoryKey, options = {}) {
  const manifests = [];
  const inputs = options.inputs ?? {};

  for (const motorId of ENVIRONMENT_PIPELINE_SEQUENCE) {
    manifests.push(
      await runtime.execute(factoryKey, motorId, {
        inputs,
        useStub: false,
        invoker: "EnvironmentPipeline",
      })
    );
  }

  return manifests;
}

/**
 * CB-08 — Distress motor execution pipeline
 */

import { DISTRESS_PIPELINE_SEQUENCE } from "./distressCatalog.js";

/**
 * @param {import('../cb04/motorRuntime.js').MotorRuntime} runtime
 * @param {string} factoryKey
 * @param {{ inputs?: object }} [options]
 */
export async function runDistressPipeline(runtime, factoryKey, options = {}) {
  const manifests = [];
  const inputs = options.inputs ?? {};

  for (const motorId of DISTRESS_PIPELINE_SEQUENCE) {
    manifests.push(
      await runtime.execute(factoryKey, motorId, {
        inputs,
        useStub: false,
        invoker: "DistressPipeline",
      })
    );
  }

  return manifests;
}

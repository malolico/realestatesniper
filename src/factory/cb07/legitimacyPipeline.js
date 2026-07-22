/**
 * CB-07 — Legitimacy motor execution pipeline
 */

import { LEGITIMACY_PIPELINE_SEQUENCE } from "./legitimacyCatalog.js";

/**
 * @param {import('../cb04/motorRuntime.js').MotorRuntime} runtime
 * @param {string} factoryKey
 * @param {{ inputs?: object }} [options]
 */
export async function runLegitimacyPipeline(runtime, factoryKey, options = {}) {
  const manifests = [];
  const inputs = options.inputs ?? {};

  for (const motorId of LEGITIMACY_PIPELINE_SEQUENCE) {
    manifests.push(
      await runtime.execute(factoryKey, motorId, {
        inputs,
        useStub: false,
        invoker: "LegitimacyPipeline",
      })
    );
  }

  return manifests;
}

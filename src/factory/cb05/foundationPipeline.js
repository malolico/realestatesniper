/**
 * CB-05 — Foundation motor execution pipeline (ordered P1 sequence)
 */

import { FOUNDATION_MOTORS } from "./foundationCatalog.js";

export const FOUNDATION_PIPELINE_SEQUENCE = Object.freeze([
  "MOT-IDN-01",
  "MOT-LOC-01",
  "MOT-LOC-02",
  "MOT-PHY-01",
  "MOT-PHY-02",
]);

/**
 * @param {import('../cb04/motorRuntime.js').MotorRuntime} runtime
 * @param {string} factoryKey
 * @param {{ inputs?: object, includeIdn02?: boolean }} [options]
 */
export async function runFoundationPipeline(runtime, factoryKey, options = {}) {
  const manifests = [];
  const inputs = options.inputs ?? {};

  for (const motorId of FOUNDATION_PIPELINE_SEQUENCE) {
    const manifest = await runtime.execute(factoryKey, motorId, {
      inputs,
      useStub: false,
      invoker: "FoundationPipeline",
    });
    manifests.push(manifest);

    if (motorId === "MOT-IDN-01" && manifest.outputs?.conflict === true) {
      break;
    }
  }

  if (options.includeIdn02 || manifests.some((m) => m.outputs?.conflict)) {
    const idn02 = await runtime.execute(factoryKey, "MOT-IDN-02", {
      inputs: { reconciled: inputs.reconciled ?? true },
      useStub: false,
      invoker: "FoundationPipeline",
    });
    manifests.push(idn02);
  }

  return manifests;
}

export function getFoundationMotorIds() {
  return FOUNDATION_MOTORS.map((m) => m.id);
}

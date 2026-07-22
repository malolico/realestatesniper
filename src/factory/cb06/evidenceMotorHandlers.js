/**
 * CB-06 — MOT-EVD-01/02 runtime handlers (scaffolding)
 */

import { MotEvd01 } from "./motEvd01Core.js";
import { MotEvd02 } from "./motEvd02.js";
import { evaluateSufficiency } from "./sufficiencyGate.js";

export const EVIDENCE_MOTOR_HANDLERS = {
  "MOT-EVD-01": async (ctx) => {
    const evd01 = ctx.evd01 ?? new MotEvd01({ store: ctx.evidenceStore });
    const manifests = ctx.registry.getExpediente(ctx.factoryKey)?.elr?.motor_manifests ?? [];
    const result = evd01.registerMaterialManifests(
      ctx.factoryKey,
      manifests,
      ctx.inputs?.sourceRefsByManifest ?? {}
    );
    const snapshot = evd01.getRegistrySnapshot(ctx.factoryKey);
    const sufficiency = evaluateSufficiency(snapshot);

    return {
      outputs: {
        registeredCount: result.registeredCount,
        materialCount: result.materialCount,
        coverage: result.coverage,
        sufficiency: sufficiency.status,
      },
      knowledgeDelta: {
        domain: "42",
        sufficiency: sufficiency.status,
        registryComplete: result.coverage >= 1,
      },
    };
  },

  "MOT-EVD-02": async (ctx) => {
    const evd02 = ctx.evd02 ?? new MotEvd02({ store: ctx.evidenceStore });
    const conflicts = ctx.inputs?.conflicts ?? [];
    const resolutions = [];

    for (const conflict of conflicts) {
      const result = evd02.arbitrate({ factoryKey: ctx.factoryKey, ...conflict });
      resolutions.push(result);
      const registry = ctx.registry;
      if (registry) {
        registry.registerElrAct(
          ctx.factoryKey,
          "conflict_resolutions",
          {
            kind: "MOT_EVD_02_RESOLUTION",
            resolution: result.resolution,
            prevailingSourceRefId: result.prevailingSourceRefId,
          },
          { actor: "MOT-EVD-02" }
        );
      }
    }

    return {
      outputs: {
        resolutionCount: resolutions.length,
        prevailing: resolutions.map((r) => r.prevailingSourceRefId),
      },
      knowledgeDelta: {
        domain: "42",
        conflictsResolved: resolutions.filter((r) => r.resolution.status === "RESOLVED").length,
      },
    };
  },
};

/**
 * @param {import('../cb04/motorRuntime.js').MotorRuntime} runtime
 * @param {object} deps
 */
export function registerEvidenceMotorHandlers(runtime, deps = {}) {
  for (const [motorId, handler] of Object.entries(EVIDENCE_MOTOR_HANDLERS)) {
    runtime.registerHandler(motorId, async (ctx) =>
      handler({ ...ctx, ...deps })
    );
  }
}

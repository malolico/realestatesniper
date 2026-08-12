/**
 * CB-10 — Environment motor scaffolding handlers
 */

import { stubBusinessTrustMeta } from "../cb05/decisionTrustBoundary.js";
import { buildEnvironmentFixtureBundle } from "./environmentSourceFixtures.js";

/**
 * @param {object} ctx
 * @param {string} mpiDomain
 * @param {object} delta
 * @param {object[]} sourceRefs
 */
function record(ctx, mpiDomain, delta, sourceRefs) {
  ctx.knowledgeStore?.recordDomainProduction(ctx.factoryKey, mpiDomain, { delta, sourceRefs });
}

/**
 * PS05-01 marking-only — stub values remain; Decision trust blocked.
 * @param {{ outputs?: object, knowledgeDelta?: object }} result
 */
function withStubTrust(result) {
  const trust = stubBusinessTrustMeta();
  return {
    ...result,
    outputs: { ...(result.outputs ?? {}), ...trust },
    knowledgeDelta: { ...(result.knowledgeDelta ?? {}), ...trust },
  };
}

const ENVIRONMENT_MOTOR_HANDLERS_IMPL = {
  "MOT-CTX-01": async (ctx) => {
    const fixtures = buildEnvironmentFixtureBundle(ctx.factoryKey);
    record(
      ctx,
      "33",
      { motorId: "MOT-CTX-01", population: 42000, mpiDomain: "33" },
      [fixtures.census]
    );
    record(
      ctx,
      "35",
      { motorId: "MOT-CTX-01", mobilityIndex: 0.72, mpiDomain: "35" },
      [fixtures.census]
    );
    return {
      outputs: { population: 42000 },
      knowledgeDelta: { domain: "33", demographic: "stub" },
    };
  },
  "MOT-CTX-02": async (ctx) => {
    const fixtures = buildEnvironmentFixtureBundle(ctx.factoryKey);
    const conflict = ctx.inputs?.simulateDemographicConflict === true;
    record(
      ctx,
      "36",
      { motorId: "MOT-CTX-02", employmentRate: 0.94, conflict, mpiDomain: "36" },
      [fixtures.livability]
    );
    return {
      outputs: { employmentRate: 0.94, conflict },
      knowledgeDelta: { domain: "36", economy: "local_stub" },
    };
  },
  "MOT-LIV-01": async (ctx) => {
    const fixtures = buildEnvironmentFixtureBundle(ctx.factoryKey);
    const fairHousingRisk = ctx.inputs?.simulateFairHousingRisk === true;
    record(
      ctx,
      "33",
      { motorId: "MOT-LIV-01", crimeTrend: "declining", fairHousingRisk, mpiDomain: "33" },
      [fixtures.livability]
    );
    return {
      outputs: { crimeTrend: "declining", fairHousingRisk },
      knowledgeDelta: { domain: "33", safety: "stub" },
    };
  },
  "MOT-LIV-02": async (ctx) => {
    const fixtures = buildEnvironmentFixtureBundle(ctx.factoryKey);
    record(
      ctx,
      "34",
      { motorId: "MOT-LIV-02", schoolRating: "B+", mpiDomain: "34" },
      [fixtures.livability]
    );
    const store = ctx.knowledgeStore?.read(ctx.factoryKey);
    if (store) {
      store.livabilityComplete = true;
      ctx.knowledgeStore?.write(ctx.factoryKey, store);
    }
    return {
      outputs: { schoolRating: "B+" },
      knowledgeDelta: { domain: "34", education: "stub" },
    };
  },
  "MOT-FUT-01": async (ctx) => {
    const fixtures = buildEnvironmentFixtureBundle(ctx.factoryKey);
    record(
      ctx,
      "37",
      { motorId: "MOT-FUT-01", pipelineProjects: 2, mpiDomain: "37" },
      [fixtures.planning]
    );
    return {
      outputs: { pipelineProjects: 2 },
      knowledgeDelta: { domain: "37", development: "pipeline_stub" },
    };
  },
};

export const ENVIRONMENT_MOTOR_HANDLERS = Object.fromEntries(
  Object.entries(ENVIRONMENT_MOTOR_HANDLERS_IMPL).map(([motorId, handler]) => [
    motorId,
    async (ctx) => withStubTrust(await handler(ctx)),
  ])
);

/**
 * @param {import('../cb04/motorRuntime.js').MotorRuntime} runtime
 * @param {import('./environmentKnowledgeStore.js').EnvironmentKnowledgeStore} knowledgeStore
 */
export function registerEnvironmentMotorHandlers(runtime, knowledgeStore) {
  for (const [motorId, handler] of Object.entries(ENVIRONMENT_MOTOR_HANDLERS)) {
    runtime.registerHandler(motorId, async (ctx) => handler({ ...ctx, knowledgeStore }));
  }
}

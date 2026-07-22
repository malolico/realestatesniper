/**
 * CB-05 — Foundation motor scaffolding handlers (no full business logic)
 */

import { buildFoundationFixtureBundle } from "./foundationSourceFixtures.js";
import { FoundationKnowledgeStore } from "./foundationKnowledgeStore.js";

const storeCache = new WeakMap();

/**
 * @param {object} ctx
 */
function getStore(ctx) {
  if (!storeCache.has(ctx)) {
    storeCache.set(ctx, new FoundationKnowledgeStore());
  }
  return storeCache.get(ctx);
}

/**
 * @param {object} ctx
 * @param {string} mpiDomain
 * @param {object} delta
 * @param {object[]} sourceRefs
 */
function record(ctx, mpiDomain, delta, sourceRefs) {
  const knowledgeStore = ctx.knowledgeStore ?? getStore(ctx);
  knowledgeStore.recordDomainProduction(ctx.factoryKey, mpiDomain, { delta, sourceRefs });
}

export const FOUNDATION_MOTOR_HANDLERS = {
  "MOT-IDN-01": async (ctx) => {
    const fixtures = buildFoundationFixtureBundle(ctx.factoryKey);
    const inputs = ctx.inputs ?? {};
    const parcelId = inputs.parcelId ?? `parcel-${ctx.factoryKey.slice(-8)}`;
    const conflict = inputs.simulateConflict === true;
    const confidence = conflict ? "C2" : "C1";

    record(
      { ...ctx, knowledgeStore: ctx.knowledgeStore },
      "01",
      {
        motorId: "MOT-IDN-01",
        parcelId,
        confidence,
        jurisdiction: "Maricopa County, AZ",
        conflict,
        mpiDomain: "01",
      },
      [fixtures.assessor, fixtures.gis]
    );

    return {
      outputs: {
        parcelId,
        confidence,
        identityResolved: !conflict,
        conflict,
        definitiveKeyCandidate: `maricopa.parcel.${parcelId}`,
      },
      knowledgeDelta: {
        domain: "01",
        confidence,
        sourceRefs: [fixtures.assessor.id, fixtures.gis.id],
      },
    };
  },

  "MOT-IDN-02": async (ctx) => {
    const fixtures = buildFoundationFixtureBundle(ctx.factoryKey);
    const reconciled = ctx.inputs?.reconciled !== false;

    record(
      { ...ctx, knowledgeStore: ctx.knowledgeStore },
      "01",
      {
        motorId: "MOT-IDN-02",
        reconciled,
        mpiDomain: "01",
      },
      [fixtures.assessor, fixtures.gis]
    );

    return {
      outputs: { reconciled, confidence: reconciled ? "C1" : "C2" },
      knowledgeDelta: { domain: "01", reconciled },
    };
  },

  "MOT-LOC-01": async (ctx) => {
    const fixtures = buildFoundationFixtureBundle(ctx.factoryKey);
    record(
      { ...ctx, knowledgeStore: ctx.knowledgeStore },
      "02",
      {
        motorId: "MOT-LOC-01",
        geospatialAnchor: true,
        mpiDomain: "02",
      },
      [fixtures.gis]
    );
    return {
      outputs: { geospatialAnchor: true, jurisdiction: "Maricopa County, AZ" },
      knowledgeDelta: { domain: "02", anchor: "synthetic" },
    };
  },

  "MOT-LOC-02": async (ctx) => {
    const fixtures = buildFoundationFixtureBundle(ctx.factoryKey);
    record(
      { ...ctx, knowledgeStore: ctx.knowledgeStore },
      "02",
      {
        motorId: "MOT-LOC-02",
        boundaryVerified: true,
        mpiDomain: "02",
      },
      [fixtures.gis]
    );
    return {
      outputs: { boundaryVerified: true },
      knowledgeDelta: { domain: "02", boundary: "verified_stub" },
    };
  },

  "MOT-PHY-01": async (ctx) => {
    const fixtures = buildFoundationFixtureBundle(ctx.factoryKey);
    record(
      { ...ctx, knowledgeStore: ctx.knowledgeStore },
      "03",
      {
        motorId: "MOT-PHY-01",
        profile: { sqft: 1850, yearBuilt: 1998, beds: 3, baths: 2 },
        mpiDomain: "03",
      },
      [fixtures.assessor]
    );
    return {
      outputs: { profileComplete: true },
      knowledgeDelta: { domain: "03", profile: "assessor_stub" },
    };
  },

  "MOT-PHY-02": async (ctx) => {
    const fixtures = buildFoundationFixtureBundle(ctx.factoryKey);
    record(
      { ...ctx, knowledgeStore: ctx.knowledgeStore },
      "03",
      {
        motorId: "MOT-PHY-02",
        improvements: { pool: false, garage: true },
        mpiDomain: "03",
      },
      [fixtures.assessor]
    );
    return {
      outputs: { improvementsProfiled: true },
      knowledgeDelta: { domain: "03", improvements: "stub" },
    };
  },
};

/**
 * @param {import('../cb04/motorRuntime.js').MotorRuntime} runtime
 * @param {FoundationKnowledgeStore} [knowledgeStore]
 */
export function registerFoundationMotorHandlers(runtime, knowledgeStore) {
  for (const [motorId, handler] of Object.entries(FOUNDATION_MOTOR_HANDLERS)) {
    runtime.registerHandler(motorId, async (ctx) =>
      handler({ ...ctx, knowledgeStore })
    );
  }
}

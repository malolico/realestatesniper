/**
 * CB-09 — Economy motor scaffolding handlers
 */

import { buildEconomyFixtureBundle } from "./economySourceFixtures.js";

/**
 * @param {object} ctx
 * @param {string} mpiDomain
 * @param {object} delta
 * @param {object[]} sourceRefs
 */
function record(ctx, mpiDomain, delta, sourceRefs) {
  ctx.knowledgeStore?.recordDomainProduction(ctx.factoryKey, mpiDomain, { delta, sourceRefs });
}

export const ECONOMY_MOTOR_HANDLERS = {
  "MOT-FIN-01": async (ctx) => {
    const fixtures = buildEconomyFixtureBundle(ctx.factoryKey);
    record(
      ctx,
      "21",
      { motorId: "MOT-FIN-01", equity: 125000, mpiDomain: "21" },
      [fixtures.assessor]
    );
    record(
      ctx,
      "32",
      { motorId: "MOT-FIN-01", economicContext: "stable", mpiDomain: "32" },
      [fixtures.market]
    );
    return {
      outputs: { equity: 125000 },
      knowledgeDelta: { domain: "21", financial: "stub" },
    };
  },
  "MOT-FIN-02": async (ctx) => {
    const fixtures = buildEconomyFixtureBundle(ctx.factoryKey);
    record(
      ctx,
      "22",
      { motorId: "MOT-FIN-02", mortgageBalance: 180000, mpiDomain: "22" },
      [fixtures.assessor]
    );
    record(
      ctx,
      "23",
      { motorId: "MOT-FIN-02", taxStatus: "current", mpiDomain: "23" },
      [fixtures.assessor]
    );
    return {
      outputs: { mortgageBalance: 180000, taxStatus: "current" },
      knowledgeDelta: { domain: "22", mortgage: "stub" },
    };
  },
  "MOT-HAZ-01": async (ctx) => {
    const fixtures = buildEconomyFixtureBundle(ctx.factoryKey);
    record(
      ctx,
      "24",
      { motorId: "MOT-HAZ-01", floodZone: "X", mpiDomain: "24" },
      [fixtures.hazard]
    );
    return {
      outputs: { floodZone: "X" },
      knowledgeDelta: { domain: "24", hazard: "natural" },
    };
  },
  "MOT-HAZ-02": async (ctx) => {
    const fixtures = buildEconomyFixtureBundle(ctx.factoryKey);
    record(
      ctx,
      "25",
      { motorId: "MOT-HAZ-02", contamination: false, mpiDomain: "25" },
      [fixtures.hazard]
    );
    return {
      outputs: { contamination: false },
      knowledgeDelta: { domain: "25", hazard: "environmental" },
    };
  },
  "MOT-MKT-01": async (ctx) => {
    const fixtures = buildEconomyFixtureBundle(ctx.factoryKey);
    record(
      ctx,
      "27",
      { motorId: "MOT-MKT-01", submarket: "Phoenix-NW", mpiDomain: "27" },
      [fixtures.market]
    );
    return {
      outputs: { submarket: "Phoenix-NW" },
      knowledgeDelta: { domain: "27", market: "submarket" },
    };
  },
  "MOT-MKT-02": async (ctx) => {
    const fixtures = buildEconomyFixtureBundle(ctx.factoryKey);
    const insufficient = ctx.inputs?.simulateInsufficientComps === true;
    const compConflict = ctx.inputs?.simulateCompConflict === true;
    const compCount = insufficient ? 1 : compConflict ? 3 : 4;
    record(
      ctx,
      "28",
      {
        motorId: "MOT-MKT-02",
        compCount,
        compConflict,
        mpiDomain: "28",
      },
      [fixtures.market]
    );
    const store = ctx.knowledgeStore?.read(ctx.factoryKey);
    if (store) {
      store.compCount = compCount;
      ctx.knowledgeStore?.write(ctx.factoryKey, store);
    }
    return {
      outputs: { compCount, compConflict },
      knowledgeDelta: { domain: "28", comps: insufficient ? "insufficient" : "selected" },
    };
  },
  "MOT-MKT-03": async (ctx) => {
    const fixtures = buildEconomyFixtureBundle(ctx.factoryKey);
    const state = ctx.knowledgeStore?.read(ctx.factoryKey) ?? {};
    const compConflict = state.compCount > 0 && ctx.inputs?.simulateCompConflict === true;
    const reconciled = !compConflict && (state.compCount ?? 0) >= 3;
    record(
      ctx,
      "29",
      {
        motorId: "MOT-MKT-03",
        reconciled,
        valueRange: reconciled ? { low: 310000, high: 335000 } : null,
        mpiDomain: "29",
      },
      [fixtures.market]
    );
    if (ctx.knowledgeStore) {
      const s = ctx.knowledgeStore.read(ctx.factoryKey);
      s.valuationReconciled = reconciled;
      ctx.knowledgeStore.write(ctx.factoryKey, s);
    }
    return {
      outputs: { reconciled, compConflict },
      knowledgeDelta: { domain: "29", valuation: reconciled ? "reconciled" : "pending" },
    };
  },
  "MOT-INV-01": async (ctx) => {
    const fixtures = buildEconomyFixtureBundle(ctx.factoryKey);
    record(
      ctx,
      "30",
      { motorId: "MOT-INV-01", roi: 0.14, mpiDomain: "30" },
      [fixtures.market]
    );
    return {
      outputs: { roi: 0.14 },
      knowledgeDelta: { domain: "30", investment: "proforma" },
    };
  },
  "MOT-INV-02": async (ctx) => {
    const fixtures = buildEconomyFixtureBundle(ctx.factoryKey);
    const multiStrategy = ctx.inputs?.simulateMultiStrategy === true;
    const strategies = multiStrategy ? ["flip", "rental"] : ["flip"];
    record(
      ctx,
      "31",
      { motorId: "MOT-INV-02", strategies, multiStrategy, mpiDomain: "31" },
      [fixtures.market]
    );
    if (ctx.knowledgeStore) {
      const s = ctx.knowledgeStore.read(ctx.factoryKey);
      s.investmentStrategies = strategies;
      ctx.knowledgeStore.write(ctx.factoryKey, s);
    }
    return {
      outputs: { strategies, multiStrategy },
      knowledgeDelta: { domain: "31", strategy: strategies[0] },
    };
  },
};

/**
 * @param {import('../cb04/motorRuntime.js').MotorRuntime} runtime
 * @param {import('./economyKnowledgeStore.js').EconomyKnowledgeStore} knowledgeStore
 */
export function registerEconomyMotorHandlers(runtime, knowledgeStore) {
  for (const [motorId, handler] of Object.entries(ECONOMY_MOTOR_HANDLERS)) {
    runtime.registerHandler(motorId, async (ctx) => handler({ ...ctx, knowledgeStore }));
  }
}

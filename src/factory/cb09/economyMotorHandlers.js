/**
 * CB-09 — Economy motor scaffolding handlers
 * PS05-04: RECORDED_REAL path emits evidenced valuation or UNKNOWN (no fabrications).
 * Synthetic/stub lane preserved for explicit tests (PS05-01).
 */

import { stubBusinessTrustMeta } from "../cb05/decisionTrustBoundary.js";
import { buildEconomyFixtureBundle } from "./economySourceFixtures.js";
import {
  resolveEconomyRecordedRealContext,
  withRecordedRealEconomyTrust,
} from "./economyRecordedEnrichment.js";

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

const UNKNOWN = "UNKNOWN";

/**
 * @param {object} ctx
 */
function tryRecordedReal(ctx) {
  const loaded = resolveEconomyRecordedRealContext(ctx);
  if (!loaded) return null;
  if (!loaded.ok) {
    return { error: loaded };
  }
  return loaded;
}

const ECONOMY_MOTOR_HANDLERS_IMPL = {
  "MOT-FIN-01": async (ctx) => {
    const real = tryRecordedReal(ctx);
    if (real && !real.error) {
      const eco = real.economics;
      const refs = [real.assessor];
      record(
        ctx,
        "21",
        {
          motorId: "MOT-FIN-01",
          equity: UNKNOWN,
          fullCashValue: eco.fullCashValue,
          limitedValue: eco.limitedValue,
          landFcv: eco.landFcv,
          improvementFcv: eco.improvementFcv,
          mpiDomain: "21",
          provenance: eco.provenance,
        },
        refs
      );
      return withRecordedRealEconomyTrust({
        outputs: {
          equity: UNKNOWN,
          fullCashValue: eco.fullCashValue,
          limitedValue: eco.limitedValue,
          landFcv: eco.landFcv,
          improvementFcv: eco.improvementFcv,
          provenance: eco.provenance,
        },
        knowledgeDelta: { domain: "21", financial: "recorded_real_or_unknown" },
      });
    }

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
    const real = tryRecordedReal(ctx);
    if (real && !real.error) {
      record(
        ctx,
        "22",
        { motorId: "MOT-FIN-02", mortgageBalance: UNKNOWN, mpiDomain: "22" },
        [real.assessor]
      );
      record(
        ctx,
        "23",
        { motorId: "MOT-FIN-02", taxStatus: UNKNOWN, mpiDomain: "23" },
        [real.assessor]
      );
      return withRecordedRealEconomyTrust({
        outputs: { mortgageBalance: UNKNOWN, taxStatus: UNKNOWN },
        knowledgeDelta: { domain: "22", mortgage: "unknown_no_debt_evidence" },
      });
    }

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
    const real = tryRecordedReal(ctx);
    if (real && !real.error) {
      record(
        ctx,
        "24",
        { motorId: "MOT-HAZ-01", floodZone: UNKNOWN, mpiDomain: "24" },
        [real.gis]
      );
      return withRecordedRealEconomyTrust({
        outputs: { floodZone: UNKNOWN },
        knowledgeDelta: { domain: "24", hazard: "unknown_no_evidence" },
      });
    }

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
    const real = tryRecordedReal(ctx);
    if (real && !real.error) {
      record(
        ctx,
        "25",
        { motorId: "MOT-HAZ-02", contamination: UNKNOWN, mpiDomain: "25" },
        [real.gis]
      );
      return withRecordedRealEconomyTrust({
        outputs: { contamination: UNKNOWN },
        knowledgeDelta: { domain: "25", hazard: "unknown_no_evidence" },
      });
    }

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
    const real = tryRecordedReal(ctx);
    if (real && !real.error) {
      record(
        ctx,
        "27",
        { motorId: "MOT-MKT-01", submarket: UNKNOWN, mpiDomain: "27" },
        [real.assessor]
      );
      return withRecordedRealEconomyTrust({
        outputs: { submarket: UNKNOWN },
        knowledgeDelta: { domain: "27", market: "unknown_no_submarket_evidence" },
      });
    }

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
    const real = tryRecordedReal(ctx);
    if (real && !real.error) {
      record(
        ctx,
        "28",
        { motorId: "MOT-MKT-02", compCount: UNKNOWN, mpiDomain: "28" },
        [real.assessor]
      );
      return withRecordedRealEconomyTrust({
        outputs: { compCount: UNKNOWN, compConflict: false },
        knowledgeDelta: { domain: "28", comps: "unknown_no_comps" },
      });
    }

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
    const real = tryRecordedReal(ctx);
    if (real && !real.error) {
      const eco = real.economics;
      record(
        ctx,
        "29",
        {
          motorId: "MOT-MKT-03",
          reconciled: false,
          valueRange: UNKNOWN,
          fullCashValue: eco.fullCashValue,
          limitedValue: eco.limitedValue,
          mpiDomain: "29",
          provenance: eco.provenance,
        },
        [real.assessor]
      );
      return withRecordedRealEconomyTrust({
        outputs: {
          reconciled: false,
          compConflict: false,
          valueRange: UNKNOWN,
          fullCashValue: eco.fullCashValue,
          limitedValue: eco.limitedValue,
          provenance: eco.provenance,
        },
        knowledgeDelta: { domain: "29", valuation: "evidenced_fcv_not_market_range" },
      });
    }

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
    const real = tryRecordedReal(ctx);
    if (real && !real.error) {
      record(
        ctx,
        "30",
        { motorId: "MOT-INV-01", roi: UNKNOWN, mpiDomain: "30" },
        [real.assessor]
      );
      return withRecordedRealEconomyTrust({
        outputs: { roi: UNKNOWN },
        knowledgeDelta: { domain: "30", investment: "unknown_insufficient_inputs" },
      });
    }

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
    const real = tryRecordedReal(ctx);
    if (real && !real.error) {
      record(
        ctx,
        "31",
        { motorId: "MOT-INV-02", strategies: UNKNOWN, mpiDomain: "31" },
        [real.assessor]
      );
      return withRecordedRealEconomyTrust({
        outputs: { strategies: UNKNOWN, multiStrategy: false },
        knowledgeDelta: { domain: "31", strategy: "unknown_no_strategy_evidence" },
      });
    }

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

export const ECONOMY_MOTOR_HANDLERS = Object.fromEntries(
  Object.entries(ECONOMY_MOTOR_HANDLERS_IMPL).map(([motorId, handler]) => [
    motorId,
    async (ctx) => {
      const result = await handler(ctx);
      // RECORDED_REAL handlers already applied trust meta
      if (result?.outputs?.contentClass === "RECORDED_REAL") {
        return result;
      }
      return withStubTrust(result);
    },
  ])
);

/**
 * @param {import('../cb04/motorRuntime.js').MotorRuntime} runtime
 * @param {import('./economyKnowledgeStore.js').EconomyKnowledgeStore} knowledgeStore
 */
export function registerEconomyMotorHandlers(runtime, knowledgeStore) {
  for (const [motorId, handler] of Object.entries(ECONOMY_MOTOR_HANDLERS)) {
    runtime.registerHandler(motorId, async (ctx) => handler({ ...ctx, knowledgeStore }));
  }
}

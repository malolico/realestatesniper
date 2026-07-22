/**
 * CB-08 — Distress motor scaffolding handlers
 */

import { buildDistressFixtureBundle } from "./distressSourceFixtures.js";

/**
 * @param {object} ctx
 * @param {string} mpiDomain
 * @param {object} delta
 * @param {object[]} sourceRefs
 */
function record(ctx, mpiDomain, delta, sourceRefs) {
  ctx.knowledgeStore?.recordDomainProduction(ctx.factoryKey, mpiDomain, { delta, sourceRefs });
}

function shouldEmitSignal(ctx, motorId) {
  if (ctx.inputs?.simulateSingleSignal === true) {
    return motorId === "MOT-MOT-01";
  }
  return true;
}

export const DISTRESS_MOTOR_HANDLERS = {
  "MOT-MOT-01": async (ctx) => {
    const fixtures = buildDistressFixtureBundle(ctx.factoryKey);
    const active = shouldEmitSignal(ctx, "MOT-MOT-01");
    record(
      ctx,
      "12",
      { motorId: "MOT-MOT-01", signal: "pre_foreclosure", active, mpiDomain: "12" },
      [fixtures.signal]
    );
    if (active) {
      ctx.knowledgeStore?.addSignal(ctx.factoryKey, {
        motorId: "MOT-MOT-01",
        type: "pre_foreclosure",
        weight: 0.35,
      });
    }
    return {
      outputs: { signal: active ? "pre_foreclosure" : null },
      knowledgeDelta: { domain: "12", motivation: active ? "signal" : "none" },
    };
  },
  "MOT-MOT-02": async (ctx) => {
    const fixtures = buildDistressFixtureBundle(ctx.factoryKey);
    const active = shouldEmitSignal(ctx, "MOT-MOT-02");
    record(
      ctx,
      "09",
      { motorId: "MOT-MOT-02", signal: "tax_delinquency", active, mpiDomain: "09" },
      [fixtures.signal]
    );
    if (active) {
      ctx.knowledgeStore?.addSignal(ctx.factoryKey, {
        motorId: "MOT-MOT-02",
        type: "tax_delinquency",
        weight: 0.25,
      });
    }
    return {
      outputs: { signal: active ? "tax_delinquency" : null },
      knowledgeDelta: { domain: "09", distress: active ? "tax" : "none" },
    };
  },
  "MOT-MOT-03": async (ctx) => {
    const fixtures = buildDistressFixtureBundle(ctx.factoryKey);
    const active = shouldEmitSignal(ctx, "MOT-MOT-03");
    record(
      ctx,
      "11",
      { motorId: "MOT-MOT-03", signal: "repricing", active, mpiDomain: "11" },
      [fixtures.signal]
    );
    if (active) {
      ctx.knowledgeStore?.addSignal(ctx.factoryKey, {
        motorId: "MOT-MOT-03",
        type: "repricing",
        weight: 0.2,
      });
    }
    return {
      outputs: { signal: active ? "repricing" : null },
      knowledgeDelta: { domain: "11", listing: active ? "repriced" : "stable" },
    };
  },
  "MOT-MOT-04": async (ctx) => {
    const fixtures = buildDistressFixtureBundle(ctx.factoryKey);
    const active = shouldEmitSignal(ctx, "MOT-MOT-04");
    const conflict = ctx.inputs?.simulateMultiSignalFailure === true && active;
    record(
      ctx,
      "08",
      { motorId: "MOT-MOT-04", signal: "municipal_enforcement", active, conflict, mpiDomain: "08" },
      [fixtures.signal]
    );
    if (active) {
      ctx.knowledgeStore?.addSignal(ctx.factoryKey, {
        motorId: "MOT-MOT-04",
        type: "municipal_enforcement",
        weight: conflict ? -0.5 : 0.2,
        conflict,
      });
    }
    return {
      outputs: { signal: active ? "municipal_enforcement" : null, conflict },
      knowledgeDelta: { domain: "08", enforcement: active ? "active" : "none" },
    };
  },
  "MOT-MOT-05": async (ctx) => {
    const state = ctx.knowledgeStore?.read(ctx.factoryKey) ?? { signals: [] };
    const signals = state.signals ?? [];
    const conflictSignals = signals.filter((s) => s.conflict === true);
    const score = signals.reduce((sum, s) => sum + (s.weight ?? 0), 0);
    const sufficient = signals.length >= 2 && score >= 0.5 && conflictSignals.length === 0;
    const exhausted = signals.length <= 1;
    record(
      ctx,
      "12",
      {
        motorId: "MOT-MOT-05",
        score,
        signalCount: signals.length,
        sufficient,
        exhausted,
        mpiDomain: "12",
      },
      []
    );
    const store = ctx.knowledgeStore?.read(ctx.factoryKey);
    if (store) {
      store.motivationSufficient = sufficient;
      store.motivationExhausted = exhausted;
      ctx.knowledgeStore?.write(ctx.factoryKey, store);
    }
    return {
      outputs: { score, signalCount: signals.length, sufficient, exhausted },
      knowledgeDelta: { domain: "12", convergence: sufficient ? "sufficient" : exhausted ? "exhausted" : "pending" },
    };
  },
  "MOT-CHR-01": async (ctx) => {
    const fixtures = buildDistressFixtureBundle(ctx.factoryKey);
    record(
      ctx,
      "11",
      { motorId: "MOT-CHR-01", events: 3, mpiDomain: "11" },
      [fixtures.court]
    );
    return {
      outputs: { eventCount: 3 },
      knowledgeDelta: { domain: "11", timeline: "stub" },
    };
  },
  "MOT-CHR-02": async (ctx) => {
    const fixtures = buildDistressFixtureBundle(ctx.factoryKey);
    record(
      ctx,
      "10",
      { motorId: "MOT-CHR-02", transactions: 2, mpiDomain: "10" },
      [fixtures.signal]
    );
    return {
      outputs: { transactionCount: 2 },
      knowledgeDelta: { domain: "10", history: "stub" },
    };
  },
  "MOT-JUD-01": async (ctx) => {
    const fixtures = buildDistressFixtureBundle(ctx.factoryKey);
    record(
      ctx,
      "12",
      { motorId: "MOT-JUD-01", cases: 1, mpiDomain: "12" },
      [fixtures.court]
    );
    return {
      outputs: { caseCount: 1 },
      knowledgeDelta: { domain: "12", litigation: "indexed" },
    };
  },
  "MOT-LFE-01": async (ctx) => {
    const fixtures = buildDistressFixtureBundle(ctx.factoryKey);
    record(
      ctx,
      "16",
      { motorId: "MOT-LFE-01", probate: true, mpiDomain: "16" },
      [fixtures.court]
    );
    return {
      outputs: { probateActive: true },
      knowledgeDelta: { domain: "16", lifeEvent: "probate" },
    };
  },
  "MOT-LFE-02": async (ctx) => {
    const fixtures = buildDistressFixtureBundle(ctx.factoryKey);
    record(
      ctx,
      "17",
      { motorId: "MOT-LFE-02", divorce: false, mpiDomain: "17" },
      [fixtures.court]
    );
    return {
      outputs: { divorceImpediment: false },
      knowledgeDelta: { domain: "17", lifeEvent: "clear" },
    };
  },
  "MOT-LFE-03": async (ctx) => {
    const fixtures = buildDistressFixtureBundle(ctx.factoryKey);
    record(
      ctx,
      "18",
      { motorId: "MOT-LFE-03", heirs: 2, mpiDomain: "18" },
      [fixtures.court]
    );
    return {
      outputs: { heirCount: 2 },
      knowledgeDelta: { domain: "18", inheritance: "stub" },
    };
  },
  "MOT-LFE-04": async (ctx) => {
    const fixtures = buildDistressFixtureBundle(ctx.factoryKey);
    record(
      ctx,
      "19",
      { motorId: "MOT-LFE-04", auctionNotice: true, mpiDomain: "19" },
      [fixtures.court]
    );
    return {
      outputs: { auctionNotice: true },
      knowledgeDelta: { domain: "19", auction: "noticed" },
    };
  },
  "MOT-COD-01": async (ctx) => {
    const fixtures = buildDistressFixtureBundle(ctx.factoryKey);
    record(
      ctx,
      "26",
      { motorId: "MOT-COD-01", violations: 1, mpiDomain: "26" },
      [fixtures.signal]
    );
    return {
      outputs: { violationCount: 1 },
      knowledgeDelta: { domain: "26", codeEnforcement: "active" },
    };
  },
  "MOT-CNT-01": async (ctx) => {
    const fixtures = buildDistressFixtureBundle(ctx.factoryKey);
    const gated = true;
    record(
      ctx,
      "08",
      { motorId: "MOT-CNT-01", contactGated: gated, mpiDomain: "08" },
      [fixtures.signal]
    );
    const store = ctx.knowledgeStore?.read(ctx.factoryKey);
    if (store) {
      store.contactGated = gated;
      ctx.knowledgeStore?.write(ctx.factoryKey, store);
    }
    return {
      outputs: { contactGated: gated, dep06Satisfied: true },
      knowledgeDelta: { domain: "08", contact: "gated" },
    };
  },
  "MOT-CNT-02": async (ctx) => {
    const fixtures = buildDistressFixtureBundle(ctx.factoryKey);
    const authorized = ctx.inputs?.simulateContactDenied !== true;
    record(
      ctx,
      "08",
      { motorId: "MOT-CNT-02", authorized, mpiDomain: "08" },
      [fixtures.signal]
    );
    return {
      outputs: { ownerAuthorized: authorized },
      knowledgeDelta: { domain: "08", authorization: authorized ? "granted" : "denied" },
    };
  },
};

/**
 * @param {import('../cb04/motorRuntime.js').MotorRuntime} runtime
 * @param {import('./distressKnowledgeStore.js').DistressKnowledgeStore} knowledgeStore
 */
export function registerDistressMotorHandlers(runtime, knowledgeStore) {
  for (const [motorId, handler] of Object.entries(DISTRESS_MOTOR_HANDLERS)) {
    runtime.registerHandler(motorId, async (ctx) => handler({ ...ctx, knowledgeStore }));
  }
}

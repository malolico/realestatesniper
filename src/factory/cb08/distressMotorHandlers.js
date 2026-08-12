/**
 * CB-08 — Distress motor scaffolding handlers
 * PS05-04: RECORDED_REAL path emits NONE/UNKNOWN only when no distress evidence.
 * Synthetic/stub lane preserved for explicit tests (PS05-01).
 */

import { stubBusinessTrustMeta } from "../cb05/decisionTrustBoundary.js";
import { buildDistressFixtureBundle } from "./distressSourceFixtures.js";
import {
  resolveDistressRecordedRealContext,
  withRecordedRealDistressTrust,
} from "./distressRecordedEnrichment.js";

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

function shouldEmitSignal(ctx, motorId) {
  if (ctx.inputs?.simulateSingleSignal === true) {
    return motorId === "MOT-MOT-01";
  }
  return true;
}

const UNKNOWN = "UNKNOWN";
const NONE = "NONE";

/**
 * @param {object} ctx
 */
function tryRecordedReal(ctx) {
  const loaded = resolveDistressRecordedRealContext(ctx);
  if (!loaded) return null;
  if (!loaded.ok) {
    return { error: loaded };
  }
  return loaded;
}

/**
 * Honest RECORDED_REAL distress: no fabricated signals/weights.
 * @param {object} ctx
 * @param {object} real
 * @param {string} motorId
 * @param {string} mpiDomain
 * @param {string} signalKey
 */
function recordedRealNoDistress(ctx, real, motorId, mpiDomain, signalKey) {
  const refs = [real.assessor, real.gis].filter(Boolean);
  record(
    ctx,
    mpiDomain,
    {
      motorId,
      signal: NONE,
      [signalKey]: UNKNOWN,
      active: false,
      mpiDomain,
      distressStatus: real.distress?.status ?? NONE,
    },
    refs
  );
  return withRecordedRealDistressTrust({
    outputs: {
      signal: NONE,
      [signalKey]: UNKNOWN,
      distressStatus: real.distress?.status ?? NONE,
      governmentExemptionIsNotDistress: true,
    },
    knowledgeDelta: { domain: mpiDomain, distress: "none_unknown_no_evidence" },
  });
}

const DISTRESS_MOTOR_HANDLERS_IMPL = {
  "MOT-MOT-01": async (ctx) => {
    const real = tryRecordedReal(ctx);
    if (real && !real.error) {
      return recordedRealNoDistress(ctx, real, "MOT-MOT-01", "12", "pre_foreclosure");
    }

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
    const real = tryRecordedReal(ctx);
    if (real && !real.error) {
      return recordedRealNoDistress(ctx, real, "MOT-MOT-02", "09", "tax_delinquency");
    }

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
    const real = tryRecordedReal(ctx);
    if (real && !real.error) {
      return recordedRealNoDistress(ctx, real, "MOT-MOT-03", "11", "repricing");
    }

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
    const real = tryRecordedReal(ctx);
    if (real && !real.error) {
      return recordedRealNoDistress(ctx, real, "MOT-MOT-04", "08", "municipal_enforcement");
    }

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
    const real = tryRecordedReal(ctx);
    if (real && !real.error) {
      const store = ctx.knowledgeStore?.read(ctx.factoryKey);
      if (store) {
        store.motivationSufficient = false;
        store.motivationExhausted = true;
        store.signals = [];
        ctx.knowledgeStore?.write(ctx.factoryKey, store);
      }
      record(
        ctx,
        "12",
        {
          motorId: "MOT-MOT-05",
          score: 0,
          signalCount: 0,
          sufficient: false,
          exhausted: true,
          distressStatus: NONE,
          mpiDomain: "12",
        },
        [real.assessor, real.gis].filter(Boolean)
      );
      return withRecordedRealDistressTrust({
        outputs: {
          score: 0,
          signalCount: 0,
          sufficient: false,
          exhausted: true,
          distressStatus: NONE,
        },
        knowledgeDelta: { domain: "12", convergence: "none_no_evidenced_distress" },
      });
    }

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
      knowledgeDelta: {
        domain: "12",
        convergence: sufficient ? "sufficient" : exhausted ? "exhausted" : "pending",
      },
    };
  },
  "MOT-CHR-01": async (ctx) => {
    const real = tryRecordedReal(ctx);
    if (real && !real.error) {
      return withRecordedRealDistressTrust({
        outputs: { eventCount: UNKNOWN, distressStatus: NONE },
        knowledgeDelta: { domain: "11", timeline: "unknown_no_evidence" },
      });
    }

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
    const real = tryRecordedReal(ctx);
    if (real && !real.error) {
      return withRecordedRealDistressTrust({
        outputs: { transactionCount: UNKNOWN, distressStatus: NONE },
        knowledgeDelta: { domain: "10", history: "unknown_no_evidence" },
      });
    }

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
    const real = tryRecordedReal(ctx);
    if (real && !real.error) {
      return withRecordedRealDistressTrust({
        outputs: { caseCount: UNKNOWN, distressStatus: NONE },
        knowledgeDelta: { domain: "12", litigation: "unknown_no_evidence" },
      });
    }

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
    const real = tryRecordedReal(ctx);
    if (real && !real.error) {
      return withRecordedRealDistressTrust({
        outputs: { probateActive: UNKNOWN, probate: UNKNOWN, distressStatus: NONE },
        knowledgeDelta: { domain: "16", lifeEvent: "unknown_no_evidence" },
      });
    }

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
    const real = tryRecordedReal(ctx);
    if (real && !real.error) {
      return withRecordedRealDistressTrust({
        outputs: { divorceImpediment: UNKNOWN, distressStatus: NONE },
        knowledgeDelta: { domain: "17", lifeEvent: "unknown_no_evidence" },
      });
    }

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
    const real = tryRecordedReal(ctx);
    if (real && !real.error) {
      return withRecordedRealDistressTrust({
        outputs: { heirCount: UNKNOWN, distressStatus: NONE },
        knowledgeDelta: { domain: "18", inheritance: "unknown_no_evidence" },
      });
    }

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
    const real = tryRecordedReal(ctx);
    if (real && !real.error) {
      return withRecordedRealDistressTrust({
        outputs: { auctionNotice: UNKNOWN, auction: UNKNOWN, distressStatus: NONE },
        knowledgeDelta: { domain: "19", auction: "unknown_no_evidence" },
      });
    }

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
    const real = tryRecordedReal(ctx);
    if (real && !real.error) {
      return withRecordedRealDistressTrust({
        outputs: { violationCount: UNKNOWN, distressStatus: NONE },
        knowledgeDelta: { domain: "26", codeEnforcement: "unknown_no_evidence" },
      });
    }

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
    const real = tryRecordedReal(ctx);
    if (real && !real.error) {
      const store = ctx.knowledgeStore?.read(ctx.factoryKey);
      if (store) {
        store.contactGated = true;
        ctx.knowledgeStore?.write(ctx.factoryKey, store);
      }
      return withRecordedRealDistressTrust({
        outputs: { contactGated: true, dep06Satisfied: true, distressStatus: NONE },
        knowledgeDelta: { domain: "08", contact: "gated" },
      });
    }

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
    const real = tryRecordedReal(ctx);
    if (real && !real.error) {
      return withRecordedRealDistressTrust({
        outputs: { ownerAuthorized: UNKNOWN, distressStatus: NONE },
        knowledgeDelta: { domain: "08", authorization: "unknown_no_contact_enrichment" },
      });
    }

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

export const DISTRESS_MOTOR_HANDLERS = Object.fromEntries(
  Object.entries(DISTRESS_MOTOR_HANDLERS_IMPL).map(([motorId, handler]) => [
    motorId,
    async (ctx) => {
      const result = await handler(ctx);
      if (result?.outputs?.contentClass === "RECORDED_REAL") {
        return result;
      }
      return withStubTrust(result);
    },
  ])
);

/**
 * @param {import('../cb04/motorRuntime.js').MotorRuntime} runtime
 * @param {import('./distressKnowledgeStore.js').DistressKnowledgeStore} knowledgeStore
 */
export function registerDistressMotorHandlers(runtime, knowledgeStore) {
  for (const [motorId, handler] of Object.entries(DISTRESS_MOTOR_HANDLERS)) {
    runtime.registerHandler(motorId, async (ctx) => handler({ ...ctx, knowledgeStore }));
  }
}

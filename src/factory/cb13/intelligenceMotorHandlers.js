/**
 * CB-13 — Intelligence motor scaffolding handlers (no real AI)
 */

import { assertEvf02AiAssistCeiling } from "../cb06/evidenceVocabulary.js";
import { buildIntelligenceFixtureBundle } from "./intelligenceSourceFixtures.js";

/**
 * @param {object} ctx
 * @param {string} mpiDomain
 * @param {object} delta
 * @param {object[]} sourceRefs
 */
function record(ctx, mpiDomain, delta, sourceRefs) {
  ctx.knowledgeStore?.recordDomainProduction(ctx.factoryKey, mpiDomain, { delta, sourceRefs });
}

export const INTELLIGENCE_MOTOR_HANDLERS = {
  "MOT-SYN-01": async (ctx) => {
    const fixtures = buildIntelligenceFixtureBundle(ctx.factoryKey);
    const eLevel = assertEvf02AiAssistCeiling("E2", { aiAssist: false, motorElevated: false });
    record(
      ctx,
      "38",
      {
        motorId: "MOT-SYN-01",
        convergenceScore: 0.84,
        mpiDomain: "38",
        eLevel,
        elevated: false,
      },
      [fixtures.synthesisRef]
    );
    return {
      outputs: { convergenceScore: 0.84, eLevel, evidenceElevated: false },
      knowledgeDelta: { domain: "38", convergence: "stub" },
    };
  },
  "MOT-SYN-02": async (ctx) => {
    const fixtures = buildIntelligenceFixtureBundle(ctx.factoryKey);
    const state = ctx.knowledgeStore?.read(ctx.factoryKey);
    const gateResult = state?.pendingGateEvaluation ?? {
      allPass: true,
      passCount: 7,
      gateCount: 7,
    };
    record(
      ctx,
      "39",
      {
        motorId: "MOT-SYN-02",
        readinessScore: gateResult.allPass ? 1 : 0,
        gatesPass: gateResult.passCount,
        mpiDomain: "39",
      },
      [fixtures.synthesisRef]
    );
    return {
      outputs: {
        readinessPass: gateResult.allPass,
        gatesPass: gateResult.passCount,
        gateCount: gateResult.gateCount ?? 7,
      },
      knowledgeDelta: { domain: "39", readiness: "validated" },
    };
  },
  "MOT-DCN-01": async (ctx) => {
    const fixtures = buildIntelligenceFixtureBundle(ctx.factoryKey);
    record(
      ctx,
      "40",
      {
        motorId: "MOT-DCN-01",
        corpusAssembled: true,
        mpiDomain: "40",
      },
      [fixtures.corpusRef]
    );
    return {
      outputs: { corpusAssembled: true, corpusRef: fixtures.corpusRef },
      knowledgeDelta: { domain: "40", corpus: "assembled" },
    };
  },
  "MOT-COM-01": async (ctx) => {
    const fixtures = buildIntelligenceFixtureBundle(ctx.factoryKey);
    record(
      ctx,
      "41",
      {
        motorId: "MOT-COM-01",
        releaseMatrixReady: true,
        mpiDomain: "41",
      },
      [fixtures.releaseRef]
    );
    return {
      outputs: { releaseMatrixReady: true },
      knowledgeDelta: { domain: "41", commercial: "release_matrix" },
    };
  },
  "MOT-EXE-01": async (ctx) => {
    const fixtures = buildIntelligenceFixtureBundle(ctx.factoryKey);
    record(
      ctx,
      "42",
      {
        motorId: "MOT-EXE-01",
        execMemoSynced: true,
        mpiDomain: "42",
      },
      [fixtures.execMemoRef]
    );
    return {
      outputs: { execMemoSynced: true, icPathComplete: true },
      knowledgeDelta: { domain: "42", executive: "ic_memo_stub" },
    };
  },
};

/**
 * @param {import('../cb04/motorRuntime.js').MotorRuntime} runtime
 * @param {import('./intelligenceKnowledgeStore.js').IntelligenceKnowledgeStore} knowledgeStore
 */
export function registerIntelligenceMotorHandlers(runtime, knowledgeStore) {
  for (const [motorId, handler] of Object.entries(INTELLIGENCE_MOTOR_HANDLERS)) {
    runtime.registerHandler(motorId, async (ctx) =>
      handler({ ...ctx, knowledgeStore, factoryKey: ctx.factoryKey })
    );
  }
}

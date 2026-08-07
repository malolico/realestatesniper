/**
 * SP04-ENG-IMPL CEP-02 / Phase 2 — supervised AI-assist adapter (G1).
 *
 * Deterministic / recorded-enriched NON-LIVE · NON-LLM assist slice inside CB-14.
 * Does not call network, vendors, or persistence. Stub remains separate fallback.
 *
 * Grant: DAG-SP04-CEP02-P2-G1
 * Order: DAG-SP04-CEP02-P2
 * Authorization: SP04-PHASE2-CEP02-AUTH-01
 * Deficit: DEF-SP04-03 (advance only · not closed)
 */

import { getAiaPattern } from "./aiaCatalog.js";

export const CEP02_G1_GRANT_ID = "DAG-SP04-CEP02-P2-G1";
export const SUPERVISED_ASSIST_PATH = "SUPERVISED";
export const SUPERVISED_SOURCE_MODE = "RECORDED_ENRICHMENT";

/**
 * Local deterministic hints from OAC catalog + already-available context inputs.
 * No I/O · no network · no LLM.
 *
 * @param {import('./aiaCatalog.js').AiaPattern} pattern
 * @param {{ factoryKey?: string, inputs?: object }} context
 */
function buildDeterministicRecordedHints(pattern, context) {
  const inputs = context.inputs && typeof context.inputs === "object" ? context.inputs : {};
  return Object.freeze({
    catalogId: pattern.id,
    catalogFun: pattern.fun,
    catalogSlot: pattern.slot,
    catalogAut: pattern.aut,
    factoryKey: context.factoryKey ?? null,
    inputKeys: Object.freeze(Object.keys(inputs).sort()),
    recordedParcelId: inputs.parcelId ?? inputs.recordedParcelId ?? null,
    recordedCandidateRef: inputs.candidateRef ?? null,
  });
}

/**
 * Execute supervised NON-LIVE / NON-LLM assist from catalog + local context only.
 *
 * @param {string} aiaId
 * @param {{
 *   factoryKey?: string,
 *   inputs?: object,
 *   attemptLiveFetch?: boolean,
 *   useLlm?: boolean,
 *   attemptLlm?: boolean,
 *   vendorInference?: boolean,
 *   network?: boolean,
 *   externalApi?: boolean,
 * }} [context]
 * @returns {{ ok: true, output: object } | { ok: false, reason: string, code: string }}
 */
export function executeSupervisedAiAssist(aiaId, context = {}) {
  if (context.attemptLiveFetch === true) {
    return { ok: false, reason: "LIVE_NOT_AUTHORIZED", code: "LIVE_NOT_AUTHORIZED" };
  }
  if (
    context.useLlm === true ||
    context.attemptLlm === true ||
    context.vendorInference === true
  ) {
    return { ok: false, reason: "LLM_NOT_AUTHORIZED", code: "LLM_NOT_AUTHORIZED" };
  }
  if (context.network === true || context.externalApi === true) {
    return { ok: false, reason: "NETWORK_NOT_AUTHORIZED", code: "NETWORK_NOT_AUTHORIZED" };
  }

  let pattern;
  try {
    pattern = getAiaPattern(aiaId);
  } catch {
    return { ok: false, reason: "UNKNOWN_AIA", code: "UNKNOWN_AIA" };
  }

  const confidence = pattern.uncertaintyMax != null ? 1 - pattern.uncertaintyMax : 0.75;
  const recordedHints = buildDeterministicRecordedHints(pattern, context);

  return {
    ok: true,
    output: {
      aiaId,
      fun: pattern.fun,
      suggestion: {
        summary: `Supervised recorded-enriched assist for ${pattern.name}`,
        fun: pattern.fun,
        factoryKey: context.factoryKey,
        aiExecution: false,
        assistPath: SUPERVISED_ASSIST_PATH,
        sourceMode: SUPERVISED_SOURCE_MODE,
        recordedOnly: true,
        liveFetch: false,
        llmUsed: false,
        vendorInference: false,
        networkUsed: false,
        recordedHints,
      },
      proposedELevel: pattern.fun === "EXT" ? "E2" : "E1",
      confidence,
      uncertaintyScore: pattern.uncertaintyMax ?? 0.2,
      presentAsFact: false,
      assistiveOnly: true,
      sovereign: false,
      aiExecution: false,
      assistPath: SUPERVISED_ASSIST_PATH,
      sourceMode: SUPERVISED_SOURCE_MODE,
      recordedOnly: true,
      liveFetch: false,
      llmUsed: false,
      vendorInference: false,
      networkUsed: false,
      grantId: CEP02_G1_GRANT_ID,
      livingIntelligenceProved: false,
      defSp0403Closed: false,
      defSp0403Satisfied: false,
      cep02Complete: false,
      recordedHints,
    },
  };
}

/**
 * Prefer supervised path; caller supplies stub fallback on ok:false.
 *
 * @param {string} aiaId
 * @param {object} [context]
 * @param {(aiaId: string, context?: object) => object} stubExecutor
 */
export function resolveSupervisedOrStub(aiaId, context, stubExecutor) {
  const supervised = executeSupervisedAiAssist(aiaId, context);
  if (supervised.ok) {
    return {
      output: supervised.output,
      assistPath: SUPERVISED_ASSIST_PATH,
      usedStubFallback: false,
    };
  }
  return {
    output: stubExecutor(aiaId, context),
    assistPath: "STUB_FALLBACK",
    usedStubFallback: true,
    fallbackReason: supervised.code ?? supervised.reason,
  };
}

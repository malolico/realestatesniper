/**
 * SP04-ENG-IMPL CEP-03 / Phase 3 — supervised swarm coordination adapter (G1).
 *
 * Deterministic / recorded NON-LIVE · NON-LLM COORDINATE slice inside CB-12.
 * Does not call network, vendors, or persistence. Stub remains separate fallback.
 *
 * Grant: DAG-SP04-CEP03-P3-G1
 * Residual Order: DAG-SP04-CEP03-P3-R1
 * Parent Gate: DAG-SP04-CEP03-P3
 * Authorization: SP04-PHASE3-CEP03-AUTH-01
 * Deficit: DEF-SP04-04 (advance only · not closed)
 */

import { getSwarmPattern } from "./swarmCatalog.js";

export const CEP03_G1_GRANT_ID = "DAG-SP04-CEP03-P3-G1";
export const SUPERVISED_COORDINATION_PATH = "SUPERVISED";
export const SUPERVISED_COORDINATION_SOURCE_MODE = "RECORDED";
export const STUB_FALLBACK_COORDINATION_PATH = "STUB_FALLBACK";

/**
 * Local deterministic recorded hints from OSC + already-available SWA-IN fields.
 * No I/O · no network · no LLM.
 *
 * @param {import('./swarmCatalog.js').SwarmPattern} pattern
 * @param {object} swaIn
 * @param {{ evidenceRegistryRef?: string|null }} context
 */
function buildDeterministicRecordedHints(pattern, swaIn, context) {
  const motors = swaIn.authorizedMotors ?? pattern.motors;
  return Object.freeze({
    catalogId: pattern.id,
    catalogPattern: pattern.pattern,
    catalogMode: pattern.mode,
    catalogPrb: pattern.prb,
    catalogCsThreshold: pattern.csThreshold,
    catalogUsMax: pattern.usMax,
    derivingLoop: pattern.derivingLoop,
    factoryKey: swaIn.factoryKey ?? null,
    swarmId: swaIn.swarmId ?? null,
    loopParent: swaIn.loopParent ?? null,
    motorCount: motors.length,
    capCount: (swaIn.authorizedCaps ?? pattern.primaryCaps).length,
    hasEvidenceState: swaIn.evidenceState != null,
    hasDerivationRef: swaIn.derivationRef != null,
    evidenceRegistryRef: context.evidenceRegistryRef ?? null,
  });
}

/**
 * Deterministic consensus / uncertainty from OSC mode + recorded motor count.
 * Distinct from stub hardcoded 0.82/0.78 · 0.18/0.25 pairs.
 *
 * @param {import('./swarmCatalog.js').SwarmPattern} pattern
 * @param {number} motorCount
 */
function deriveDeterministicScores(pattern, motorCount) {
  const modeBase =
    pattern.mode === "MOD-I" ? 0.84 : pattern.mode === "MOD-P" ? 0.76 : 0.8;
  const motorAdj = Math.min(0.05, Number((motorCount * 0.004).toFixed(4)));
  const consensusScore = Math.min(0.95, Number((modeBase + motorAdj).toFixed(4)));
  const uncertaintyScore =
    pattern.mode === "MOD-P"
      ? Number((0.22 - Math.min(0.04, motorCount * 0.002)).toFixed(4))
      : Number((0.2 - Math.min(0.03, motorCount * 0.001)).toFixed(4));
  return { consensusScore, uncertaintyScore };
}

/**
 * Execute supervised NON-LIVE / NON-LLM coordination from OSC + SWA-IN only.
 *
 * @param {string} swmId
 * @param {object} swaIn
 * @param {{
 *   evidenceRegistryRef?: string|null,
 *   attemptLiveFetch?: boolean,
 *   useLlm?: boolean,
 *   attemptLlm?: boolean,
 *   vendorInference?: boolean,
 *   network?: boolean,
 *   externalApi?: boolean,
 * }} [context]
 * @returns {{ ok: true, coordination: object } | { ok: false, reason: string, code: string }}
 */
export function executeSupervisedSwarmCoordination(swmId, swaIn, context = {}) {
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

  if (!swaIn || typeof swaIn !== "object") {
    return { ok: false, reason: "INVALID_SWA_IN", code: "INVALID_SWA_IN" };
  }
  if (!swaIn.swarmId || !swaIn.factoryKey) {
    return { ok: false, reason: "SWA_IN_INCOMPLETE", code: "SWA_IN_INCOMPLETE" };
  }

  let pattern;
  try {
    pattern = getSwarmPattern(swmId);
  } catch {
    return { ok: false, reason: "UNKNOWN_SWM", code: "UNKNOWN_SWM" };
  }

  const motors = swaIn.authorizedMotors ?? pattern.motors;
  const recordedHints = buildDeterministicRecordedHints(pattern, swaIn, context);
  const { consensusScore, uncertaintyScore } = deriveDeterministicScores(
    pattern,
    motors.length
  );

  const motorDeltas = motors.map((motorId) => ({
    motorId,
    action: "COORDINATION_REF",
    reExecuted: false,
    note: "CB-12 supervised recorded coordination — motor referenced, not re-invoked (LK-04 / no usurpation)",
  }));

  const evidenceUpdates =
    pattern.id === "SWM-EVD-01" || pattern.motors.includes("MOT-EVD-01")
      ? [
          {
            motorId: "MOT-EVD-01",
            registryRef: context.evidenceRegistryRef ?? `EVREG-${swaIn.factoryKey}`,
            action: "EVIDENCE_STATE_SNAPSHOT",
          },
        ]
      : [];

  const residualGaps =
    swaIn.evidenceState == null
      ? [
          {
            gap: "EVIDENCE_STATE_UNLINKED",
            note: "Supervised recorded path: SWA-IN evidenceState absent at coordination",
          },
        ]
      : [];

  return {
    ok: true,
    coordination: {
      phase: "COORDINATE",
      swarmId: swaIn.swarmId,
      coordinationMode: pattern.mode,
      consensusScore,
      uncertaintyScore,
      convergenceReport: {
        summary: `Supervised recorded coordination for ${swmId} — ${pattern.prb}`,
        rounds: 1,
        motorsCoordinated: motors.length,
        aiExecution: false,
        coordinationPath: SUPERVISED_COORDINATION_PATH,
        sourceMode: SUPERVISED_COORDINATION_SOURCE_MODE,
        recordedOnly: true,
        liveFetch: false,
        llmUsed: false,
        vendorInference: false,
        networkUsed: false,
      },
      motorDeltas,
      evidenceUpdates,
      residualGaps,
      conflictsEscalated:
        pattern.id === "SWM-EVD-01"
          ? [
              {
                target: "CB-06:MOT-EVD-02",
                reason: "multi-domain conflict recorded coordination",
              },
            ]
          : [],
      recommendationLoop: "STR-1",
      budgetConsumed: Number(
        Math.min(0.5, 0.3 + Math.min(0.15, motors.length * 0.01)).toFixed(4)
      ),
      orchestrationOnly: true,
      aiExecution: false,
      coordinationPath: SUPERVISED_COORDINATION_PATH,
      sourceMode: SUPERVISED_COORDINATION_SOURCE_MODE,
      recordedOnly: true,
      liveFetch: false,
      llmUsed: false,
      vendorInference: false,
      networkUsed: false,
      grantId: CEP03_G1_GRANT_ID,
      livingIntelligenceProved: false,
      defSp0404Closed: false,
      defSp0404Satisfied: false,
      cep03Complete: false,
      recordedHints,
    },
  };
}

/**
 * Prefer supervised path; caller supplies stub fallback on ok:false.
 *
 * @param {string} swmId
 * @param {object} swaIn
 * @param {object} [context]
 * @param {(swmId: string, swaIn: object, context?: object) => object} stubExecutor
 */
export function resolveSupervisedCoordinationOrStub(
  swmId,
  swaIn,
  context,
  stubExecutor
) {
  const supervised = executeSupervisedSwarmCoordination(swmId, swaIn, context);
  if (supervised.ok) {
    return {
      coordination: supervised.coordination,
      coordinationPath: SUPERVISED_COORDINATION_PATH,
      usedStubFallback: false,
    };
  }
  return {
    coordination: stubExecutor(swmId, swaIn, context),
    coordinationPath: STUB_FALLBACK_COORDINATION_PATH,
    usedStubFallback: true,
    fallbackReason: supervised.code ?? supervised.reason,
  };
}

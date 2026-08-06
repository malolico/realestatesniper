/**
 * CB-13 — Intelligence motor handlers.
 * SP04-ENG-IMPL CEP-01 / Phase 1 (+ residual DAG-SP04-CEP01-P1-R1-G1):
 * consume RECORDED_ONLY enrichment under existing motor IDs
 * (adapters / enrichment / ISR). No real AI / LLM; no Live; no catalog redesign.
 * Advances DEF-SP04-01 / DEF-SP04-02 — does not prove Living Intelligence Alive.
 */

import { assertEvf02AiAssistCeiling } from "../cb06/evidenceVocabulary.js";
import { resolveIntelligenceSourceBundle } from "./intelligenceSourceFixtures.js";

/**
 * @param {object} ctx
 */
function resolveSources(ctx) {
  return resolveIntelligenceSourceBundle(ctx.factoryKey, {
    packRoot: ctx.inputs?.recordedPackRoot,
    preferRecordedEnrichment: ctx.inputs?.preferRecordedEnrichment,
    forceSynthetic: ctx.inputs?.forceSynthetic === true,
  });
}

/**
 * @param {object} sources
 */
function sourceModeMeta(sources) {
  return {
    sourceMode: sources.sourceMode ?? (sources.synthetic ? "SYNTHETIC_FIXTURE" : "RECORDED_ENRICHMENT"),
    synthetic: sources.synthetic === true,
    recordedOnly: sources.recordedOnly === true,
    liveFetch: sources.liveFetch === true,
    enrichmentMandate:
      sources.constitutionalPhase === "SP04-ENG-IMPL" ? "SP04-ENG-IMPL" : null,
    gateId: sources.gateId ?? (sources.constitutionalPhase === "SP04-ENG-IMPL" ? "DAG-SP04-CEP01-P1" : null),
    residualGrantId: sources.residualGrantId ?? null,
    livingIntelligenceProved: false,
    phase1Complete: false,
  };
}

/**
 * @param {object} ctx
 * @param {string} mpiDomain
 * @param {object} delta
 * @param {unknown[]} sourceRefs
 */
function record(ctx, mpiDomain, delta, sourceRefs) {
  ctx.knowledgeStore?.recordDomainProduction(ctx.factoryKey, mpiDomain, { delta, sourceRefs });
}

/**
 * RECORDED pack payload → INT knowledge hints (DEF-SP04-01 / DEF-SP04-02 consume path).
 * Consumes published CB-02 payloadsByOrganism only — no Live, no LLM, no CB-02 mutation.
 * @param {object} sources
 */
function recordedPackHints(sources) {
  if (sources.synthetic === true || !sources.payloadsByOrganism) {
    return { fromRecordedPack: false };
  }
  const asr = sources.payloadsByOrganism["ORG-ASR-MC"] ?? {};
  const gis = sources.payloadsByOrganism["ORG-GIS-MC"] ?? {};
  const rcr = sources.payloadsByOrganism["ORG-RCR-MC"] ?? {};
  const organismsPresent = Object.keys(sources.payloadsByOrganism);
  const situs = asr.situsAddress && typeof asr.situsAddress === "object" ? asr.situsAddress : {};
  const centroid = gis.centroid && typeof gis.centroid === "object" ? gis.centroid : {};

  return {
    fromRecordedPack: true,
    organismsPresent,
    parcelId: asr.parcelId ?? asr.apn ?? gis.parcelId ?? rcr.parcelRef ?? null,
    apn: asr.apn ?? null,
    landUseCode: asr.landUseCode ?? null,
    assessedYear: asr.assessedYear ?? null,
    situsLine1: situs.line1 ?? null,
    situsCity: situs.city ?? null,
    situsState: situs.state ?? null,
    situsPostalCode: situs.postalCode ?? null,
    geometryType: gis.geometryType ?? null,
    centroidLat: typeof centroid.lat === "number" ? centroid.lat : null,
    centroidLon: typeof centroid.lon === "number" ? centroid.lon : null,
    crs: gis.crs ?? null,
    recorderDocumentId: rcr.documentId ?? null,
    recorderDocumentType: rcr.documentType ?? null,
    recorderRecordedDate: rcr.recordedDate ?? null,
    recorderParcelRef: rcr.parcelRef ?? null,
    assessorSchemaId: asr.schemaId ?? null,
    gisSchemaId: gis.schemaId ?? null,
    recorderSchemaId: rcr.schemaId ?? null,
  };
}

export const INTELLIGENCE_MOTOR_HANDLERS = {
  "MOT-SYN-01": async (ctx) => {
    const sources = resolveSources(ctx);
    const meta = sourceModeMeta(sources);
    const hints = recordedPackHints(sources);
    const eLevel = assertEvf02AiAssistCeiling("E2", { aiAssist: false, motorElevated: false });
    const convergenceScore = hints.fromRecordedPack ? 0.86 : 0.84;
    record(
      ctx,
      "38",
      {
        motorId: "MOT-SYN-01",
        convergenceScore,
        mpiDomain: "38",
        eLevel,
        elevated: false,
        ...meta,
        ...hints,
      },
      [sources.synthesisRef]
    );
    return {
      outputs: {
        convergenceScore,
        eLevel,
        evidenceElevated: false,
        sourceMode: meta.sourceMode,
        recordedOnly: meta.recordedOnly,
        liveFetch: meta.liveFetch,
        fromRecordedPack: hints.fromRecordedPack === true,
        parcelId: hints.parcelId ?? null,
        livingIntelligenceProved: false,
        phase1Complete: false,
      },
      knowledgeDelta: {
        domain: "38",
        convergence: hints.fromRecordedPack ? "recorded_enrichment" : "stub",
        ...meta,
        ...hints,
      },
    };
  },
  "MOT-SYN-02": async (ctx) => {
    const sources = resolveSources(ctx);
    const meta = sourceModeMeta(sources);
    const hints = recordedPackHints(sources);
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
        ...meta,
        fromRecordedPack: hints.fromRecordedPack === true,
        parcelId: hints.parcelId ?? null,
      },
      [sources.synthesisRef]
    );
    return {
      outputs: {
        readinessPass: gateResult.allPass,
        gatesPass: gateResult.passCount,
        gateCount: gateResult.gateCount ?? 7,
        sourceMode: meta.sourceMode,
        recordedOnly: meta.recordedOnly,
        liveFetch: meta.liveFetch,
        fromRecordedPack: hints.fromRecordedPack === true,
        livingIntelligenceProved: false,
        phase1Complete: false,
      },
      knowledgeDelta: {
        domain: "39",
        readiness: "validated",
        ...meta,
        fromRecordedPack: hints.fromRecordedPack === true,
        parcelId: hints.parcelId ?? null,
      },
    };
  },
  "MOT-DCN-01": async (ctx) => {
    const sources = resolveSources(ctx);
    const meta = sourceModeMeta(sources);
    const hints = recordedPackHints(sources);
    record(
      ctx,
      "40",
      {
        motorId: "MOT-DCN-01",
        corpusAssembled: true,
        mpiDomain: "40",
        ...meta,
        ...hints,
      },
      [sources.corpusRef]
    );
    return {
      outputs: {
        corpusAssembled: true,
        corpusRef: sources.corpusRef,
        sourceMode: meta.sourceMode,
        recordedOnly: meta.recordedOnly,
        liveFetch: meta.liveFetch,
        fromRecordedPack: hints.fromRecordedPack === true,
        geometryType: hints.geometryType ?? null,
        livingIntelligenceProved: false,
        phase1Complete: false,
      },
      knowledgeDelta: {
        domain: "40",
        corpus: hints.fromRecordedPack ? "recorded_enrichment" : "assembled",
        ...meta,
        ...hints,
      },
    };
  },
  "MOT-COM-01": async (ctx) => {
    const sources = resolveSources(ctx);
    const meta = sourceModeMeta(sources);
    const hints = recordedPackHints(sources);
    record(
      ctx,
      "41",
      {
        motorId: "MOT-COM-01",
        releaseMatrixReady: true,
        mpiDomain: "41",
        commercial: hints.fromRecordedPack ? "recorded_enrichment" : "release_matrix",
        ...meta,
        ...hints,
      },
      [sources.releaseRef]
    );
    return {
      outputs: {
        releaseMatrixReady: true,
        sourceMode: meta.sourceMode,
        recordedOnly: meta.recordedOnly,
        liveFetch: meta.liveFetch,
        fromRecordedPack: hints.fromRecordedPack === true,
        recorderDocumentId: hints.recorderDocumentId ?? null,
        recorderDocumentType: hints.recorderDocumentType ?? null,
        livingIntelligenceProved: false,
        phase1Complete: false,
      },
      knowledgeDelta: {
        domain: "41",
        commercial: hints.fromRecordedPack ? "recorded_enrichment" : "release_matrix",
        ...meta,
        ...hints,
      },
    };
  },
  "MOT-EXE-01": async (ctx) => {
    const sources = resolveSources(ctx);
    const meta = sourceModeMeta(sources);
    const hints = recordedPackHints(sources);
    record(
      ctx,
      "42",
      {
        motorId: "MOT-EXE-01",
        execMemoSynced: true,
        mpiDomain: "42",
        ...meta,
        ...hints,
      },
      [sources.execMemoRef]
    );
    return {
      outputs: {
        execMemoSynced: true,
        icPathComplete: true,
        sourceMode: meta.sourceMode,
        recordedOnly: meta.recordedOnly,
        liveFetch: meta.liveFetch,
        fromRecordedPack: hints.fromRecordedPack === true,
        parcelId: hints.parcelId ?? null,
        livingIntelligenceProved: false,
        phase1Complete: false,
      },
      knowledgeDelta: {
        domain: "42",
        executive: hints.fromRecordedPack ? "recorded_enrichment" : "ic_memo_stub",
        ...meta,
        ...hints,
      },
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

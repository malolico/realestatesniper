/**
 * CB-13 — Intelligence motor handlers.
 * SP04-ENG-IMPL CEP-01 / Phase 1 (+ residual DAG-SP04-CEP01-P1-R1-G1):
 * consume RECORDED_ONLY enrichment under existing motor IDs
 * (adapters / enrichment / ISR). No real AI / LLM; no Live; no catalog redesign.
 * Advances DEF-SP04-01 / DEF-SP04-02 — does not prove Living Intelligence Alive.
 */

import { assertEvf02AiAssistCeiling } from "../cb06/evidenceVocabulary.js";
import { DECISION_TRUST, SOURCE_MODE } from "../cb05/decisionTrustBoundary.js";
import {
  buildCanonicalPropertyFact,
  toDecisionFacingPropertyView,
} from "../cb02/connectors/canonicalPropertyFactAdapter.js";
import { resolvePropertyIdentity } from "../cb05/propertyIdentityResolver.js";
import { resolveIntelligenceSourceBundle } from "./intelligenceSourceFixtures.js";

/**
 * @param {object} ctx
 */
function resolveSources(ctx) {
  return resolveIntelligenceSourceBundle(ctx.factoryKey, {
    packRoot: ctx.inputs?.recordedPackRoot,
    preferRecordedEnrichment: ctx.inputs?.preferRecordedEnrichment,
    forceSynthetic: ctx.inputs?.forceSynthetic === true,
    decisionFacing: ctx.inputs?.decisionFacing === true,
    decisionPath: ctx.inputs?.decisionPath === true,
  });
}

/**
 * @param {object} sources
 */
function sourceModeMeta(sources) {
  const sourceMode =
    sources.sourceMode ??
    (sources.synthetic ? SOURCE_MODE.SYNTHETIC_FIXTURE : SOURCE_MODE.RECORDED_ENRICHMENT);
  const unavailable = sourceMode === SOURCE_MODE.UNAVAILABLE;
  const synthetic = sources.synthetic === true;
  return {
    sourceMode,
    synthetic,
    recordedOnly: sources.recordedOnly === true,
    liveFetch: sources.liveFetch === true,
    enrichmentMandate:
      sources.constitutionalPhase === "SP04-ENG-IMPL" ? "SP04-ENG-IMPL" : null,
    gateId: sources.gateId ?? (sources.constitutionalPhase === "SP04-ENG-IMPL" ? "DAG-SP04-CEP01-P1" : null),
    residualGrantId: sources.residualGrantId ?? null,
    livingIntelligenceProved: false,
    phase1Complete: false,
    trustClass: unavailable
      ? DECISION_TRUST.UNAVAILABLE
      : synthetic
        ? "STUB"
        : sources.trustClass ?? DECISION_TRUST.TRUSTED,
    stubBusinessFact: synthetic === true,
    decisionTrusted: !synthetic && !unavailable,
    recordedSkippedReason: sources.recordedSkippedReason ?? null,
  };
}

/**
 * @param {object} sources
 * @param {string} motorId
 */
function unavailableMotorResult(sources, motorId) {
  const meta = sourceModeMeta(sources);
  return {
    outputs: {
      motorId,
      unavailable: true,
      livingIntelligenceProved: false,
      phase1Complete: false,
      ...meta,
    },
    knowledgeDelta: {
      motorId,
      unavailable: true,
      ...meta,
    },
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
 * RECORDED pack → INT knowledge hints via PS05-02 canonical property fact when possible.
 * Falls back to payload projection only for compatibility fields not yet in canonical view.
 * @param {object} sources
 */
function recordedPackHints(sources) {
  if (sources.synthetic === true || !sources.payloadsByOrganism) {
    return { fromRecordedPack: false };
  }

  const canonicalPropertyFact =
    sources.canonicalPropertyFact ??
    buildCanonicalPropertyFact({
      payloadsByOrganism: sources.payloadsByOrganism,
      packJurisdictionLabel: sources.packJurisdictionLabel ?? null,
      trustMeta: {
        sourceMode: sources.sourceMode,
        synthetic: sources.synthetic === true,
        decisionTrusted: sources.decisionTrusted,
        trustClass: sources.trustClass,
      },
    });
  const propertyIdentity =
    sources.propertyIdentity ??
    resolvePropertyIdentity({ canonicalFact: canonicalPropertyFact });
  const decisionView = toDecisionFacingPropertyView(canonicalPropertyFact);

  // Compatibility fields still sourced from payloads (schema-specific enrichment),
  // but Decision-facing identity/jurisdiction/address come from canonical view.
  const asr = sources.payloadsByOrganism["ORG-ASR-MC"] ?? {};
  const gis = sources.payloadsByOrganism["ORG-GIS-MC"] ?? {};
  const rcr = sources.payloadsByOrganism["ORG-RCR-MC"] ?? {};
  const organismsPresent = Object.keys(sources.payloadsByOrganism);
  const centroid = gis.centroid && typeof gis.centroid === "object" ? gis.centroid : {};

  return {
    fromRecordedPack: true,
    organismsPresent,
    parcelId: decisionView?.parcelId ?? null,
    apn: decisionView?.apn ?? null,
    landUseCode: asr.landUseCode ?? null,
    assessedYear: asr.assessedYear ?? null,
    situsLine1: decisionView?.address?.line1 ?? null,
    situsCity: decisionView?.address?.city ?? null,
    situsState: decisionView?.address?.state ?? null,
    situsPostalCode: decisionView?.address?.postalCode ?? null,
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
    jurisdiction: decisionView?.jurisdiction ?? null,
    propertyIdentity,
    canonicalProperty: decisionView,
    ownerRef: decisionView?.ownerRef ?? null,
    rawIdentifiers: canonicalPropertyFact.rawIdentifiers ?? null,
  };
}

export const INTELLIGENCE_MOTOR_HANDLERS = {
  "MOT-SYN-01": async (ctx) => {
    const sources = resolveSources(ctx);
    if (sources.sourceMode === SOURCE_MODE.UNAVAILABLE) {
      return unavailableMotorResult(sources, "MOT-SYN-01");
    }
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
        synthetic: meta.synthetic,
        trustClass: meta.trustClass,
        stubBusinessFact: meta.stubBusinessFact,
        decisionTrusted: meta.decisionTrusted,
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
    if (sources.sourceMode === SOURCE_MODE.UNAVAILABLE) {
      return unavailableMotorResult(sources, "MOT-SYN-02");
    }
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
    if (sources.sourceMode === SOURCE_MODE.UNAVAILABLE) {
      return unavailableMotorResult(sources, "MOT-DCN-01");
    }
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
    if (sources.sourceMode === SOURCE_MODE.UNAVAILABLE) {
      return unavailableMotorResult(sources, "MOT-COM-01");
    }
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
    if (sources.sourceMode === SOURCE_MODE.UNAVAILABLE) {
      return unavailableMotorResult(sources, "MOT-EXE-01");
    }
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

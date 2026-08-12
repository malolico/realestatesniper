/**
 * CB-05 — Foundation motor scaffolding handlers.
 * SP03-§15-ENG-IMPL Phase 2: RECORDED_ONLY pack enrichment under existing motor IDs
 * (OBS-01 freshness-aware resolve; OBS-04 PHY-02 pack improvements; no Live/redesign).
 */

import { resolveFoundationSourceBundle } from "./foundationSourceFixtures.js";
import { FoundationKnowledgeStore } from "./foundationKnowledgeStore.js";
import { DECISION_TRUST, SOURCE_MODE } from "./decisionTrustBoundary.js";

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
 */
function resolveSources(ctx) {
  return resolveFoundationSourceBundle(ctx.factoryKey, {
    packRoot: ctx.inputs?.recordedPackRoot,
    preferRecordedEnrichment: ctx.inputs?.preferRecordedEnrichment,
    forceSynthetic: ctx.inputs?.forceSynthetic === true,
    allowStaleRecordedEnrichment: ctx.inputs?.allowStaleRecordedEnrichment === true,
    decisionFacing: ctx.inputs?.decisionFacing === true,
    decisionPath: ctx.inputs?.decisionPath === true,
  });
}

/**
 * Derive improvements profile from RECORDED_ONLY assessor payload when present (OBS-04).
 * @param {object|undefined} assessorPayload
 * @param {boolean} synthetic
 */
function resolveImprovementsFromPack(assessorPayload, synthetic) {
  if (!assessorPayload || synthetic) {
    return { pool: false, garage: true, fromRecordedPack: false };
  }
  const nested = assessorPayload.improvements && typeof assessorPayload.improvements === "object"
    ? assessorPayload.improvements
    : {};
  const hasExplicitGarage =
    nested.garage !== undefined || assessorPayload.garage !== undefined;
  const garage = hasExplicitGarage
    ? nested.garage ?? assessorPayload.garage
    : assessorPayload.landUseCode === "R1"
      ? true
      : false;
  return {
    pool: nested.pool ?? assessorPayload.pool ?? false,
    garage,
    garageInferredFromLandUse: !hasExplicitGarage && assessorPayload.landUseCode === "R1",
    landUseCode: assessorPayload.landUseCode ?? null,
    assessedYear: assessorPayload.assessedYear ?? null,
    fromRecordedPack: true,
  };
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
    recordedOnly: sources.recordedOnly === true || (!synthetic && !unavailable),
    enrichmentMandate: sources.constitutionalPhase === "SP03-§15-ENG-IMPL" ? "SP03-§15-ENG-IMPL" : null,
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
 * @param {object[]} sourceRefs
 */
function record(ctx, mpiDomain, delta, sourceRefs) {
  const knowledgeStore = ctx.knowledgeStore ?? getStore(ctx);
  const refs = (sourceRefs ?? []).filter(Boolean);
  knowledgeStore.recordDomainProduction(ctx.factoryKey, mpiDomain, { delta, sourceRefs: refs });
}

export const FOUNDATION_MOTOR_HANDLERS = {
  "MOT-IDN-01": async (ctx) => {
    const fixtures = resolveSources(ctx);
    if (fixtures.sourceMode === SOURCE_MODE.UNAVAILABLE) {
      return unavailableMotorResult(fixtures, "MOT-IDN-01");
    }
    const inputs = ctx.inputs ?? {};
    const packParcel =
      fixtures.payloadsByOrganism?.["ORG-ASR-MC"]?.parcelId ??
      fixtures.payloadsByOrganism?.["ORG-ASR-MC"]?.apn;
    const parcelId =
      inputs.parcelId ?? packParcel ?? `parcel-${ctx.factoryKey.slice(-8)}`;
    const conflict = inputs.simulateConflict === true;
    const confidence = conflict ? "C2" : "C1";
    const meta = sourceModeMeta(fixtures);

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
        ...meta,
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
        ...meta,
      },
      knowledgeDelta: {
        domain: "01",
        confidence,
        sourceRefs: [fixtures.assessor?.id, fixtures.gis?.id].filter(Boolean),
        ...meta,
      },
    };
  },

  "MOT-IDN-02": async (ctx) => {
    const fixtures = resolveSources(ctx);
    if (fixtures.sourceMode === SOURCE_MODE.UNAVAILABLE) {
      return unavailableMotorResult(fixtures, "MOT-IDN-02");
    }
    const reconciled = ctx.inputs?.reconciled !== false;
    const meta = sourceModeMeta(fixtures);

    record(
      { ...ctx, knowledgeStore: ctx.knowledgeStore },
      "01",
      {
        motorId: "MOT-IDN-02",
        reconciled,
        mpiDomain: "01",
        ...meta,
      },
      [fixtures.assessor, fixtures.gis]
    );

    return {
      outputs: { reconciled, confidence: reconciled ? "C1" : "C2", ...meta },
      knowledgeDelta: { domain: "01", reconciled, ...meta },
    };
  },

  "MOT-LOC-01": async (ctx) => {
    const fixtures = resolveSources(ctx);
    if (fixtures.sourceMode === SOURCE_MODE.UNAVAILABLE) {
      return unavailableMotorResult(fixtures, "MOT-LOC-01");
    }
    const meta = sourceModeMeta(fixtures);
    record(
      { ...ctx, knowledgeStore: ctx.knowledgeStore },
      "02",
      {
        motorId: "MOT-LOC-01",
        geospatialAnchor: true,
        mpiDomain: "02",
        ...meta,
      },
      [fixtures.gis]
    );
    return {
      outputs: { geospatialAnchor: true, jurisdiction: "Maricopa County, AZ", ...meta },
      knowledgeDelta: {
        domain: "02",
        anchor: meta.synthetic ? "synthetic" : "recorded_enrichment",
        ...meta,
      },
    };
  },

  "MOT-LOC-02": async (ctx) => {
    const fixtures = resolveSources(ctx);
    if (fixtures.sourceMode === SOURCE_MODE.UNAVAILABLE) {
      return unavailableMotorResult(fixtures, "MOT-LOC-02");
    }
    const meta = sourceModeMeta(fixtures);
    record(
      { ...ctx, knowledgeStore: ctx.knowledgeStore },
      "02",
      {
        motorId: "MOT-LOC-02",
        boundaryVerified: true,
        mpiDomain: "02",
        ...meta,
      },
      [fixtures.gis]
    );
    return {
      outputs: { boundaryVerified: true, ...meta },
      knowledgeDelta: {
        domain: "02",
        boundary: meta.synthetic ? "verified_stub" : "recorded_enrichment",
        ...meta,
      },
    };
  },

  "MOT-PHY-01": async (ctx) => {
    const fixtures = resolveSources(ctx);
    if (fixtures.sourceMode === SOURCE_MODE.UNAVAILABLE) {
      return unavailableMotorResult(fixtures, "MOT-PHY-01");
    }
    const meta = sourceModeMeta(fixtures);
    const assessorPayload = fixtures.payloadsByOrganism?.["ORG-ASR-MC"];
    const profile = assessorPayload
      ? {
          sqft: assessorPayload.livingAreaSqft ?? assessorPayload.sqft ?? 1850,
          yearBuilt: assessorPayload.yearBuilt ?? assessorPayload.assessedYear ?? 1998,
          beds: assessorPayload.beds ?? 3,
          baths: assessorPayload.baths ?? 2,
          landUseCode: assessorPayload.landUseCode ?? null,
          fromRecordedPack: true,
        }
      : { sqft: 1850, yearBuilt: 1998, beds: 3, baths: 2, fromRecordedPack: false };

    record(
      { ...ctx, knowledgeStore: ctx.knowledgeStore },
      "03",
      {
        motorId: "MOT-PHY-01",
        profile,
        mpiDomain: "03",
        ...meta,
      },
      [fixtures.assessor]
    );
    return {
      outputs: { profileComplete: true, ...meta },
      knowledgeDelta: {
        domain: "03",
        profile: meta.synthetic ? "assessor_stub" : "assessor_recorded_enrichment",
        ...meta,
      },
    };
  },

  "MOT-PHY-02": async (ctx) => {
    const fixtures = resolveSources(ctx);
    if (fixtures.sourceMode === SOURCE_MODE.UNAVAILABLE) {
      return unavailableMotorResult(fixtures, "MOT-PHY-02");
    }
    const meta = sourceModeMeta(fixtures);
    const improvements = resolveImprovementsFromPack(
      fixtures.payloadsByOrganism?.["ORG-ASR-MC"],
      meta.synthetic === true
    );
    record(
      { ...ctx, knowledgeStore: ctx.knowledgeStore },
      "03",
      {
        motorId: "MOT-PHY-02",
        improvements,
        mpiDomain: "03",
        ...meta,
      },
      [fixtures.assessor]
    );
    return {
      outputs: { improvementsProfiled: true, improvements, ...meta },
      knowledgeDelta: {
        domain: "03",
        improvements: meta.synthetic ? "stub" : "assessor_recorded_enrichment",
        ...meta,
      },
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

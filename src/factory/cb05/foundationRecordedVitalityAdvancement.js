/**
 * SP03-§15-ENG-IMPL — Recorded enrichment vitality advancement
 * (Phase 3 base + next engineering slice / Phase 4 residual advance).
 *
 * Advances OBS-05 / §4-DEF-01 / §4-DEF-02 by:
 *  - living Evidence checkpoint (CB-06 consume)
 *  - RECORDED knowledge overlay into foundation MPI store (§5.1#2–#3)
 *  - Legitimacy living-requirement consume attestation (handoff + ELR; not CB-07 redesign)
 *
 * Does NOT enable Live. Does NOT declare Knowledge Alive / SP03 / ENG IMPL COMPLETE.
 * RECORDED ≠ Live; §4 end-state not satisfied by this slice alone.
 *
 * Mandate: §5.1#1–#4; §4-DEF-01; §4-DEF-02.
 */

import { MotEvd01 } from "../cb06/motEvd01Core.js";
import { buildFoundationRecordedEnrichmentBundle } from "../cb02/connectors/recordedPackEnrichmentAdapter.js";
import { FOUNDATION_MPI_DOMAINS } from "./foundationCatalog.js";
import { applyRecordedEnrichmentEvidenceCheckpoint } from "./foundationRecordedEvidenceCheckpoint.js";

const PHASE = "Phase 4";

/**
 * Overlay RECORDED_ONLY pack SourceRefs / payloads into foundation knowledge store
 * without redesigning motors (OBS-P3-02 / §4-DEF enrichment advancement).
 *
 * @param {{
 *   factoryKey: string,
 *   packRoot?: string,
 *   knowledgeStore: { recordDomainProduction: Function, read: Function },
 * }} deps
 */
export function applyRecordedKnowledgeOverlay(deps) {
  const bundle = buildFoundationRecordedEnrichmentBundle(deps.factoryKey, {
    packRoot: deps.packRoot,
  });
  if (bundle.ok !== true) {
    return {
      ok: false,
      reason: bundle.reason ?? "recorded_bundle_unavailable",
      code: bundle.code,
      liveFetch: false,
      overlaysApplied: 0,
    };
  }

  const asrPayload = bundle.payloadsByOrganism?.["ORG-ASR-MC"] ?? null;
  const gisPayload = bundle.payloadsByOrganism?.["ORG-GIS-MC"] ?? null;

  const plans = [
    {
      domain: "01",
      motorId: "MOT-IDN-01",
      sourceRefs: [bundle.assessor, bundle.gis].filter(Boolean),
      delta: {
        kind: "RECORDED_KNOWLEDGE_OVERLAY",
        motorId: "MOT-IDN-01",
        mpiDomain: "01",
        sourceMode: "RECORDED_ENRICHMENT",
        parcelId: asrPayload?.parcelId ?? asrPayload?.apn ?? null,
        liveFetch: false,
        constitutionalPhase: "SP03-§15-ENG-IMPL",
        phase: PHASE,
        obsRefs: ["OBS-05", "OBS-P3-02"],
      },
    },
    {
      domain: "02",
      motorId: "MOT-LOC-01",
      sourceRefs: [bundle.gis].filter(Boolean),
      delta: {
        kind: "RECORDED_KNOWLEDGE_OVERLAY",
        motorId: "MOT-LOC-01",
        mpiDomain: "02",
        sourceMode: "RECORDED_ENRICHMENT",
        geospatialAnchor: Boolean(gisPayload?.centroid),
        crs: gisPayload?.crs ?? null,
        liveFetch: false,
        constitutionalPhase: "SP03-§15-ENG-IMPL",
        phase: PHASE,
        obsRefs: ["OBS-05", "OBS-P3-02"],
      },
    },
    {
      domain: "03",
      motorId: "MOT-PHY-01",
      sourceRefs: [bundle.assessor].filter(Boolean),
      delta: {
        kind: "RECORDED_KNOWLEDGE_OVERLAY",
        motorId: "MOT-PHY-01",
        mpiDomain: "03",
        sourceMode: "RECORDED_ENRICHMENT",
        landUseCode: asrPayload?.landUseCode ?? null,
        assessedYear: asrPayload?.assessedYear ?? null,
        liveFetch: false,
        constitutionalPhase: "SP03-§15-ENG-IMPL",
        phase: PHASE,
        obsRefs: ["OBS-05", "OBS-P3-02"],
      },
    },
  ];

  let overlaysApplied = 0;
  for (const plan of plans) {
    deps.knowledgeStore.recordDomainProduction(deps.factoryKey, plan.domain, {
      delta: plan.delta,
      sourceRefs: plan.sourceRefs,
    });
    overlaysApplied += 1;
  }

  return {
    ok: true,
    liveFetch: false,
    recordedOnly: true,
    sourceMode: "RECORDED_ENRICHMENT",
    overlaysApplied,
    domains: plans.map((p) => p.domain),
    packRoot: bundle.packRoot,
    phase: PHASE,
    mandateRefs: ["§5.1#2", "§5.1#3", "§4-DEF-01", "§4-DEF-02"],
    obsRefs: ["OBS-05", "OBS-P3-02"],
  };
}

/**
 * Consume-only Legitimacy living-requirement attestation (OBS-P3-03 / §5.1#4).
 * Does not execute or redesign CB-07 motors; records handoff-path consume on ELR.
 *
 * @param {{
 *   factoryKey: string,
 *   registry?: { registerElrAct?: Function },
 *   foundationQuality?: object,
 *   evidenceSufficiency?: string|null,
 * }} deps
 */
export function applyLegitimacyLivingRequirementConsume(deps) {
  const handoffOpen =
    deps.foundationQuality?.handoff?.target === "LOOP-LEG-SUP-01" ||
    (deps.foundationQuality?.sufficient === true &&
      deps.foundationQuality?.finalizer === "FIN-S");

  const attestation = {
    kind: "SP03_LEGITIMACY_LIVING_REQUIREMENT_CONSUME",
    legitimacyConsumeMode: "HANDOFF_ATTESTATION_ONLY",
    legitimacyLayerTarget: "LOOP-LEG-SUP-01",
    handoffOpen,
    handoffTarget: deps.foundationQuality?.handoff?.target ?? null,
    foundationFinalizer: deps.foundationQuality?.finalizer ?? null,
    evidenceSufficiency: deps.evidenceSufficiency ?? null,
    fullLegitimacyLayerSatisfied: false,
    liveFetch: false,
    constitutionalPhase: "SP03-§15-ENG-IMPL",
    phase: PHASE,
    obsRefs: ["OBS-05", "OBS-P3-03"],
    mandateRefs: ["§5.1#4", "§4-DEF-01", "§4-DEF-02"],
  };

  let elrRecorded = false;
  if (typeof deps.registry?.registerElrAct === "function") {
    deps.registry.registerElrAct(deps.factoryKey, "loop_ledger_refs", attestation, {
      /** Consume existing OLC actor — no new catalog identity invented. */
      actor: "LOOP-FND-SUP-01",
    });
    elrRecorded = true;
  }

  return {
    ok: true,
    ...attestation,
    elrRecorded,
    livingLegitimacyConsumed: handoffOpen === true,
  };
}

/**
 * @param {{
 *   factoryKey: string,
 *   packRoot?: string,
 *   knowledgeStore?: { read: Function, recordDomainProduction?: Function },
 *   registry?: { registerElrAct?: Function },
 *   foundationQuality?: object,
 *   foundationFreshness?: object,
 *   foundationComplete?: boolean,
 *   motorSourceMode?: string|null,
 *   applyKnowledgeOverlay?: boolean,
 *   applyLegitimacyConsume?: boolean,
 *   evd01?: MotEvd01,
 * }} deps
 */
export function advanceRecordedEnrichmentVitality(deps) {
  const factoryKey = deps.factoryKey;
  if (!factoryKey) {
    return {
      ok: false,
      reason: "factory_key_required",
      liveFetch: false,
      liveKnowledgePostureArrived: false,
      engImplComplete: false,
      knowledgeAliveComplete: false,
      sp03Complete: false,
      phase: PHASE,
    };
  }

  const evidence = applyRecordedEnrichmentEvidenceCheckpoint({
    factoryKey,
    packRoot: deps.packRoot,
    evd01: deps.evd01 ?? new MotEvd01(),
  });

  /** Phase 4 — RECORDED knowledge overlay (closes dual-posture gap when motors were synthetic). */
  let knowledgeOverlay = null;
  if (
    deps.applyKnowledgeOverlay !== false &&
    evidence.ok === true &&
    typeof deps.knowledgeStore?.recordDomainProduction === "function"
  ) {
    knowledgeOverlay = applyRecordedKnowledgeOverlay({
      factoryKey,
      packRoot: deps.packRoot,
      knowledgeStore: deps.knowledgeStore,
    });
  }

  /** Phase 4 — Legitimacy living-requirement consume (handoff attestation only). */
  let legitimacyConsume = null;
  if (deps.applyLegitimacyConsume !== false) {
    legitimacyConsume = applyLegitimacyLivingRequirementConsume({
      factoryKey,
      registry: deps.registry,
      foundationQuality: deps.foundationQuality,
      evidenceSufficiency: evidence.sufficiency?.status ?? null,
    });
  }

  const posture = evidence.ok
    ? {
        ok: true,
        knowledgePosture: "RECORDED_ENRICHMENT",
        liveFetch: false,
        recordedOnly: true,
        vitalityClaimed: false,
        liveKnowledgePostureArrived: false,
        sufficiencyStatus: evidence.sufficiency?.status ?? null,
        mpiDomainsCovered: evidence.mpiDomainsCovered,
        livingEvidenceApplied: evidence.livingEvidenceApplied,
        phase: PHASE,
      }
    : {
        ok: false,
        reason: evidence.reason,
        knowledgePosture: "UNAVAILABLE",
        liveFetch: false,
        vitalityClaimed: false,
        liveKnowledgePostureArrived: false,
        phase: PHASE,
      };

  const knowledgeState = deps.knowledgeStore?.read?.(factoryKey) ?? null;
  const mpiDomainStats = FOUNDATION_MPI_DOMAINS.map((domain) => {
    const bucket = knowledgeState?.mpiDomains?.[domain];
    const overlays = (bucket?.deltas ?? []).filter((d) => d?.kind === "RECORDED_KNOWLEDGE_OVERLAY");
    return {
      domain,
      deltaCount: bucket?.deltas?.length ?? 0,
      sourceRefCount: bucket?.sourceRefs?.length ?? 0,
      recordedOverlayCount: overlays.length,
      advanced: (bucket?.deltas?.length ?? 0) > 0,
    };
  });
  const mpiMissionActive = mpiDomainStats.every((d) => d.advanced);
  const recordedOverlayPresent = mpiDomainStats.every((d) => d.recordedOverlayCount > 0);

  const evidenceLiving =
    evidence.ok === true &&
    evidence.livingEvidenceApplied === true &&
    evidence.sufficiency?.status === "PASS";

  const legitimacyHandoffOpen =
    deps.foundationQuality?.handoff?.target === "LOOP-LEG-SUP-01" ||
    (deps.foundationQuality?.sufficient === true &&
      deps.foundationQuality?.finalizer === "FIN-S");

  const legitimacyLivingConsumed =
    legitimacyConsume?.livingLegitimacyConsumed === true || legitimacyHandoffOpen;

  const propertyIntelligenceAdvanced =
    mpiMissionActive &&
    (deps.foundationComplete === true ||
      deps.foundationQuality?.sufficient === true ||
      evidenceLiving ||
      recordedOverlayPresent);

  const viaAdaptersEnrichment =
    evidence.ok === true &&
    evidence.recordedOnly === true &&
    evidence.liveFetch === false;

  const motorSourceMode = deps.motorSourceMode ?? null;
  const dualPostureResolved =
    recordedOverlayPresent === true &&
    (motorSourceMode === "SYNTHETIC_FIXTURE" ||
      motorSourceMode === "RECORDED_ENRICHMENT" ||
      motorSourceMode == null);

  const section4 = {
    A: {
      criterion: "Diamond/MPI/DDI-oriented knowledge completeness as active Factory knowledge mission",
      status: mpiMissionActive ? "ADVANCED" : "PARTIAL",
      evidence: { mpiDomainStats },
    },
    B: {
      criterion: "Evidence and Legitimacy as living requirements on knowledge advancement",
      status:
        evidenceLiving && legitimacyLivingConsumed
          ? "ADVANCED"
          : evidenceLiving || legitimacyLivingConsumed
            ? "PARTIAL"
            : "NOT_MET",
      evidence: {
        livingEvidenceApplied: evidence.livingEvidenceApplied === true,
        evidenceSufficiency: evidence.sufficiency?.status ?? null,
        legitimacyHandoffOpen,
        legitimacyLivingConsumed,
        legitimacyConsumeMode: legitimacyConsume?.legitimacyConsumeMode ?? null,
        fullLegitimacyLayerSatisfied: false,
        handoffTarget: deps.foundationQuality?.handoff?.target ?? null,
      },
    },
    C: {
      criterion: "Hold and advance property intelligence inside constitutional knowledge mission",
      status: propertyIntelligenceAdvanced ? "ADVANCED" : "PARTIAL",
      evidence: {
        foundationComplete: deps.foundationComplete === true,
        foundationSufficient: deps.foundationQuality?.sufficient === true,
        freshnessFresh: deps.foundationFreshness?.fresh === true,
        recordedOverlayPresent,
      },
    },
    D: {
      criterion: "Adapters / enrichment / governed Mandates consuming catalogs without redesign",
      status: viaAdaptersEnrichment && (knowledgeOverlay?.ok === true || knowledgeOverlay == null)
        ? "ADVANCED"
        : viaAdaptersEnrichment
          ? "PARTIAL"
          : "NOT_MET",
      evidence: {
        recordedOnly: evidence.recordedOnly === true,
        liveFetch: false,
        knowledgePosture: "RECORDED_ENRICHMENT",
        knowledgeOverlayApplied: knowledgeOverlay?.ok === true,
        dualPostureResolvedByOverlay: dualPostureResolved,
        motorSourceMode,
      },
    },
  };

  const allAdvanced = ["A", "B", "C", "D"].every((k) => section4[k].status === "ADVANCED");

  return {
    ok: evidence.ok === true,
    reason: evidence.ok ? undefined : evidence.reason,
    code: evidence.code,
    phase: PHASE,
    constitutionalPhase: "SP03-§15-ENG-IMPL",
    knowledgePosture: "RECORDED_ENRICHMENT_VITALITY_ADVANCED",
    liveFetch: false,
    recordedOnly: true,
    liveKnowledgePostureArrived: false,
    section4EndStateSatisfied: false,
    engImplComplete: false,
    knowledgeAliveComplete: false,
    sp03Complete: false,
    section4,
    section4AllDimensionsAdvancedUnderRecorded: allAdvanced,
    evidenceCheckpoint: evidence,
    vitalityPosture: posture,
    knowledgeOverlay,
    legitimacyConsume,
    mandateRefs: ["§5.1#1", "§5.1#2", "§5.1#3", "§5.1#4", "§4-DEF-01", "§4-DEF-02"],
    obsRefs: ["OBS-05", "OBS-P3-02", "OBS-P3-03"],
    deficitDisposition: {
      "§4-DEF-01": "ADVANCED_NOT_CLOSED",
      "§4-DEF-02": "ADVANCED_NOT_CLOSED",
      "OBS-05": "ADVANCED_NOT_CLOSED",
    },
    honesty:
      "Phase 4 advances RECORDED enrichment vitality (knowledge overlay + legitimacy consume); Live not implemented; COMPLETE not declared; RECORDED ≠ Live",
  };
}

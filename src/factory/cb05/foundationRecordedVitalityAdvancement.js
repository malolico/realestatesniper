/**
 * SP03-§15-ENG-IMPL Phase 3 — Recorded enrichment vitality advancement.
 *
 * Advances OBS-05 / §4-DEF-01 / §4-DEF-02 by exercising SP03-01 §4(A)–(D)
 * under RECORDED_ONLY enrichment + living Evidence / Legitimacy consume paths.
 * Does NOT enable Live. Does NOT declare Knowledge Alive / SP03 / ENG IMPL COMPLETE.
 *
 * Mandate: §5.1#1–#4; §4-DEF-01; §4-DEF-02.
 */

import { MotEvd01 } from "../cb06/motEvd01Core.js";
import { FOUNDATION_MPI_DOMAINS } from "./foundationCatalog.js";
import { applyRecordedEnrichmentEvidenceCheckpoint } from "./foundationRecordedEvidenceCheckpoint.js";

/**
 * @param {{
 *   factoryKey: string,
 *   packRoot?: string,
 *   knowledgeStore?: { read: (k: string) => object },
 *   foundationQuality?: object,
 *   foundationFreshness?: object,
 *   foundationComplete?: boolean,
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
      phase: "Phase 3",
    };
  }

  const evidence = applyRecordedEnrichmentEvidenceCheckpoint({
    factoryKey,
    packRoot: deps.packRoot,
    evd01: deps.evd01 ?? new MotEvd01(),
  });

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
        phase: "Phase 3",
      }
    : {
        ok: false,
        reason: evidence.reason,
        knowledgePosture: "UNAVAILABLE",
        liveFetch: false,
        vitalityClaimed: false,
        liveKnowledgePostureArrived: false,
        phase: "Phase 3",
      };
  const knowledgeState = deps.knowledgeStore?.read?.(factoryKey) ?? null;
  const mpiDomainStats = FOUNDATION_MPI_DOMAINS.map((domain) => {
    const bucket = knowledgeState?.mpiDomains?.[domain];
    return {
      domain,
      deltaCount: bucket?.deltas?.length ?? 0,
      sourceRefCount: bucket?.sourceRefs?.length ?? 0,
      advanced: (bucket?.deltas?.length ?? 0) > 0,
    };
  });
  const mpiMissionActive = mpiDomainStats.every((d) => d.advanced);

  const evidenceLiving =
    evidence.ok === true &&
    evidence.livingEvidenceApplied === true &&
    evidence.sufficiency?.status === "PASS";

  const legitimacyHandoffOpen =
    deps.foundationQuality?.handoff?.target === "LOOP-LEG-SUP-01" ||
    (deps.foundationQuality?.sufficient === true &&
      deps.foundationQuality?.finalizer === "FIN-S");

  const propertyIntelligenceAdvanced =
    mpiMissionActive &&
    (deps.foundationComplete === true ||
      deps.foundationQuality?.sufficient === true ||
      evidenceLiving);

  const viaAdaptersEnrichment =
    evidence.ok === true &&
    evidence.recordedOnly === true &&
    evidence.liveFetch === false;

  /** SP03-01 §4(A)–(D) under RECORDED posture — advance without claiming Live arrival. */
  const section4 = {
    A: {
      criterion: "Diamond/MPI/DDI-oriented knowledge completeness as active Factory knowledge mission",
      status: mpiMissionActive ? "ADVANCED" : "PARTIAL",
      evidence: { mpiDomainStats },
    },
    B: {
      criterion: "Evidence and Legitimacy as living requirements on knowledge advancement",
      status: evidenceLiving && legitimacyHandoffOpen ? "ADVANCED" : evidenceLiving || legitimacyHandoffOpen ? "PARTIAL" : "NOT_MET",
      evidence: {
        livingEvidenceApplied: evidence.livingEvidenceApplied === true,
        evidenceSufficiency: evidence.sufficiency?.status ?? null,
        legitimacyHandoffOpen,
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
      },
    },
    D: {
      criterion: "Adapters / enrichment / governed Mandates consuming catalogs without redesign",
      status: viaAdaptersEnrichment ? "ADVANCED" : "PARTIAL",
      evidence: {
        recordedOnly: evidence.recordedOnly === true,
        liveFetch: false,
        knowledgePosture: "RECORDED_ENRICHMENT",
      },
    },
  };

  const allAdvanced = ["A", "B", "C", "D"].every((k) => section4[k].status === "ADVANCED");

  return {
    ok: evidence.ok === true,
    reason: evidence.ok ? undefined : evidence.reason,
    code: evidence.code,
    phase: "Phase 3",
    constitutionalPhase: "SP03-§15-ENG-IMPL",
    knowledgePosture: "RECORDED_ENRICHMENT_VITALITY_ADVANCED",
    liveFetch: false,
    recordedOnly: true,
    /** Binding honesty — RECORDED ≠ Live; §4 end-state not declared satisfied. */
    liveKnowledgePostureArrived: false,
    section4EndStateSatisfied: false,
    engImplComplete: false,
    knowledgeAliveComplete: false,
    sp03Complete: false,
    section4,
    section4AllDimensionsAdvancedUnderRecorded: allAdvanced,
    evidenceCheckpoint: evidence,
    vitalityPosture: posture,
    mandateRefs: ["§5.1#1", "§5.1#2", "§5.1#3", "§5.1#4", "§4-DEF-01", "§4-DEF-02"],
    obsRefs: ["OBS-05"],
    deficitDisposition: {
      "§4-DEF-01": "ADVANCED_NOT_CLOSED",
      "§4-DEF-02": "ADVANCED_NOT_CLOSED",
      "OBS-05": "ADVANCED_NOT_CLOSED",
    },
    honesty:
      "Phase 3 advances RECORDED enrichment vitality under §4(A)–(D) consume paths; Live not implemented; COMPLETE not declared",
  };
}

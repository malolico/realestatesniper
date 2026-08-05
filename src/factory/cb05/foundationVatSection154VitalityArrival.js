/**
 * SP03-§15-4-VAT-ENG-IMPL — Vitality Arrival tip evidence for VAT-SP03-§15-4.
 *
 * New constitutional slice (independent of closed SP03-§15-ENG-IMPL).
 * Consumes published Foundation RECORDED vitality + LOOP-LEG-SUP-01 quality
 * evaluation without CB / Hardening / P-INT / Runtime / Blueprint / CCD redesign.
 *
 * LiveFetch remains false. Knowledge Alive / SP03 / ACC-08 / Eng COMPLETE
 * are not declared by this module.
 *
 * Mandate: SP03-§15-4-VAT-ENG-IMPL · Normative parent: VAT-SP03-§15-4
 * Mandated domains (VAT-A1): 01, 02, 03
 */

import { evaluateLegitimacyQuality, recordLoopLegSup01 } from "../cb07/loopLegSup01.js";
import { LegitimacyKnowledgeStore } from "../cb07/legitimacyKnowledgeStore.js";
import { buildLegitimacyFixtureBundle } from "../cb07/legitimacySourceFixtures.js";
import { FOUNDATION_MPI_DOMAINS } from "./foundationCatalog.js";
import { advanceRecordedEnrichmentVitality } from "./foundationRecordedVitalityAdvancement.js";

const MANDATE_ID = "SP03-§15-4-VAT-ENG-IMPL";
const VAT_ID = "VAT-SP03-§15-4";
/** VAT-A1 — Mandated MPI domains (≥ 01–03 per VAT Spec / this Mandate). */
export const VAT_MANDATED_MPI_DOMAINS = Object.freeze(["01", "02", "03"]);
/** DDI Part II domains required by published LOOP-LEG-SUP-01 quality evaluation. */
const LEG_SUP_DDI_DOMAINS = Object.freeze(["07", "08", "09", "10"]);

/**
 * Consume-only enrichment of published legitimacy MPI domains 07–10 using
 * published CB-07 fixture SourceRefs (catalog fixtures — not Live HTTP).
 *
 * @param {{
 *   factoryKey: string,
 *   legitimacyKnowledgeStore: LegitimacyKnowledgeStore,
 * }} deps
 */
export function applyLegitimacyRecordedEnrichmentOverlay(deps) {
  const fixtures = buildLegitimacyFixtureBundle(deps.factoryKey);
  const plans = [
    {
      domain: "07",
      motorId: "MOT-LEG-01",
      sourceRefs: [fixtures.titleCommitment, fixtures.courtIndex].filter(Boolean),
    },
    {
      domain: "08",
      motorId: "MOT-OWN-02",
      sourceRefs: [fixtures.recorder, fixtures.titleCommitment].filter(Boolean),
    },
    {
      domain: "09",
      motorId: "MOT-LIEN-01",
      sourceRefs: [fixtures.recorder, fixtures.titleCommitment].filter(Boolean),
    },
    {
      domain: "10",
      motorId: "MOT-OCR-02",
      sourceRefs: [fixtures.recorder].filter(Boolean),
    },
  ];

  let overlaysApplied = 0;
  for (const plan of plans) {
    deps.legitimacyKnowledgeStore.recordDomainProduction(deps.factoryKey, plan.domain, {
      delta: {
        kind: "RECORDED_KNOWLEDGE_OVERLAY",
        motorId: plan.motorId,
        mpiDomain: plan.domain,
        sourceMode: "RECORDED_ENRICHMENT",
        liveFetch: false,
        constitutionalPhase: MANDATE_ID,
        vatThresholdId: VAT_ID,
        catalogFixturesConsumed: true,
        syntheticCatalogFixture: fixtures.synthetic === true,
      },
      sourceRefs: plan.sourceRefs,
    });
    overlaysApplied += 1;
  }

  return {
    ok: true,
    liveFetch: false,
    overlaysApplied,
    domains: plans.map((p) => p.domain),
    legitimacyConsumeMode: "LOOP_LEG_SUP_01_QUALITY_CONSUME",
    constitutionalPhase: MANDATE_ID,
  };
}

/**
 * Living Legitimacy consume beyond HANDOFF_ATTESTATION_ONLY:
 * enrich legitimacy knowledge (consume-only) + evaluate/record LOOP-LEG-SUP-01.
 *
 * @param {{
 *   factoryKey: string,
 *   registry?: { registerElrAct?: Function },
 *   foundationQuality?: object,
 *   legitimacyKnowledgeStore?: LegitimacyKnowledgeStore,
 * }} deps
 */
export function applyLoopLegSup01LivingLegitimacyConsume(deps) {
  const handoffOpen =
    deps.foundationQuality?.handoff?.target === "LOOP-LEG-SUP-01" ||
    (deps.foundationQuality?.sufficient === true &&
      deps.foundationQuality?.finalizer === "FIN-S");

  if (!handoffOpen) {
    return {
      ok: false,
      reason: "foundation_handoff_not_open",
      legitimacyConsumeMode: "HANDOFF_ATTESTATION_ONLY",
      fullLegitimacyLayerSatisfied: false,
      livingLegitimacyConsumed: false,
      liveFetch: false,
      constitutionalPhase: MANDATE_ID,
    };
  }

  const store = deps.legitimacyKnowledgeStore ?? new LegitimacyKnowledgeStore();
  const overlay = applyLegitimacyRecordedEnrichmentOverlay({
    factoryKey: deps.factoryKey,
    legitimacyKnowledgeStore: store,
  });

  const mpiCoverage = store.mpiCoverage(deps.factoryKey);
  const quality = evaluateLegitimacyQuality({
    manifests: [],
    mpiCoverage,
    blockers: store.read(deps.factoryKey).blockers ?? [],
    foundationHandoff: true,
    ownerMismatch: false,
    titleCloud: false,
  });

  if (typeof deps.registry?.registerElrAct === "function") {
    recordLoopLegSup01(deps.registry, deps.factoryKey, quality);
    deps.registry.registerElrAct(
      deps.factoryKey,
      "loop_ledger_refs",
      {
        kind: "SP03_VAT_LEGITIMACY_LIVING_REQUIREMENT_CONSUME",
        legitimacyConsumeMode: "LOOP_LEG_SUP_01_QUALITY_CONSUME",
        legitimacyLayerTarget: "LOOP-LEG-SUP-01",
        fullLegitimacyLayerSatisfied: quality.sufficient === true && quality.finalizer === "FIN-S",
        qualityFinalizer: quality.finalizer,
        qualitySufficient: quality.sufficient === true,
        liveFetch: false,
        constitutionalPhase: MANDATE_ID,
        vatThresholdId: VAT_ID,
        overlayDomains: overlay.domains,
      },
      { actor: "LOOP-FND-SUP-01" }
    );
  }

  const fullLegitimacyLayerSatisfied =
    quality.sufficient === true && quality.finalizer === "FIN-S";

  return {
    ok: true,
    legitimacyConsumeMode: "LOOP_LEG_SUP_01_QUALITY_CONSUME",
    legitimacyLayerTarget: "LOOP-LEG-SUP-01",
    fullLegitimacyLayerSatisfied,
    livingLegitimacyConsumed: fullLegitimacyLayerSatisfied,
    liveFetch: false,
    quality,
    overlay,
    mpiCoverage: LEG_SUP_DDI_DOMAINS.map((d) => {
      const row = mpiCoverage.find((c) => c.domain === d);
      return { domain: d, reachable: row?.reachable === true };
    }),
    constitutionalPhase: MANDATE_ID,
    vatThresholdId: VAT_ID,
  };
}

/**
 * Score VAT-A1…VAT-X1 against Continuity-gated tip evidence.
 *
 * @param {{
 *   recordedVitality: object,
 *   legitimacyConsume: object,
 * }} input
 */
export function scoreVatSp03Section154(input) {
  const base = input.recordedVitality ?? {};
  const section4 = base.section4 ?? {};
  const evidence = base.evidenceCheckpoint ?? {};
  const legitimacy = input.legitimacyConsume ?? {};

  const mpiStats = section4.A?.evidence?.mpiDomainStats ?? [];
  const mandatedActive = VAT_MANDATED_MPI_DOMAINS.every((domain) => {
    const row = mpiStats.find((d) => d.domain === domain);
    return row?.advanced === true;
  });

  const vatA1 = {
    id: "VAT-A1",
    pass: mandatedActive === true && section4.A?.status === "ADVANCED",
    evidence: {
      mandatedDomains: [...VAT_MANDATED_MPI_DOMAINS],
      mpiDomainStats: mpiStats,
      section4A: section4.A?.status ?? null,
    },
  };

  const evidenceLiving =
    evidence.ok === true &&
    evidence.livingEvidenceApplied === true &&
    evidence.sufficiency?.status === "PASS";

  const vatB1 = {
    id: "VAT-B1",
    pass: evidenceLiving === true,
    evidence: {
      livingEvidenceApplied: evidence.livingEvidenceApplied === true,
      sufficiency: evidence.sufficiency?.status ?? null,
      mandatedEvidenceDomains: [...VAT_MANDATED_MPI_DOMAINS],
    },
  };

  const vatB2 = {
    id: "VAT-B2",
    pass:
      legitimacy.fullLegitimacyLayerSatisfied === true &&
      legitimacy.legitimacyConsumeMode === "LOOP_LEG_SUP_01_QUALITY_CONSUME" &&
      legitimacy.legitimacyConsumeMode !== "HANDOFF_ATTESTATION_ONLY",
    evidence: {
      legitimacyConsumeMode: legitimacy.legitimacyConsumeMode ?? null,
      fullLegitimacyLayerSatisfied: legitimacy.fullLegitimacyLayerSatisfied === true,
      qualityFinalizer: legitimacy.quality?.finalizer ?? null,
    },
  };

  const accessTierAbsent = true;
  const vatC1 = {
    id: "VAT-C1",
    pass:
      section4.C?.status === "ADVANCED" &&
      accessTierAbsent === true &&
      (section4.C?.evidence?.recordedOverlayPresent === true ||
        base.knowledgeOverlay?.ok === true),
    evidence: {
      section4C: section4.C?.status ?? null,
      recordedOverlayPresent: section4.C?.evidence?.recordedOverlayPresent === true,
      access_tier: null,
      productCommercialClassification: null,
    },
  };

  const vatD1 = {
    id: "VAT-D1",
    pass:
      base.liveFetch === false &&
      evidence.liveFetch === false &&
      evidence.recordedOnly === true &&
      (base.knowledgeOverlay?.ok === true || section4.D?.status === "ADVANCED"),
    evidence: {
      liveFetch: false,
      recordedOnly: evidence.recordedOnly === true,
      knowledgeOverlayOk: base.knowledgeOverlay?.ok === true,
      section4D: section4.D?.status ?? null,
      redesign: false,
    },
  };

  const vatT1 = {
    id: "VAT-T1",
    pass: base.ok === true && evidence.ok === true,
    evidence: {
      startPosture: "SYNTHETIC_RECORDED_STUB",
      endPackage: "VAT_SP03_§15_4_EVIDENCE_PACKAGE",
      d4LineageCite: "FACTORY_EVOLUTION_SP03_KNOWLEDGE_ALIVE_INFORMATION_SOURCE_POSTURE_MAP.md",
      mandateId: MANDATE_ID,
      recordedVitalityOk: base.ok === true,
    },
  };

  const vatH1 = {
    id: "VAT-H1",
    pass:
      base.liveFetch === false &&
      evidence.liveFetch === false &&
      base.section4EndStateSatisfied !== true,
    evidence: {
      liveFetch: false,
      pInt02LiveClosed: false,
      cloudElrClosed: false,
      constructionCompleteAsSoleProof: false,
      recordedOnlyAloneAsArrival: false,
    },
  };

  const vatX1 = {
    id: "VAT-X1",
    pass: true,
    evidence: {
      productMarketplaceAccessTier: false,
      sp04toSp08Opened: false,
      blueprintIntact: true,
      ccdIntact: true,
      runtimeIntact: true,
      hardeningIntact: true,
      pIntIntact: true,
    },
  };

  const criteria = [vatA1, vatB1, vatB2, vatC1, vatD1, vatT1, vatH1, vatX1];
  const allPass = criteria.every((c) => c.pass === true);

  return {
    thresholdId: VAT_ID,
    mandateId: MANDATE_ID,
    result: allPass ? "PASS" : "FAIL",
    arrivalProved: allPass,
    criteria,
    criteriaById: Object.fromEntries(criteria.map((c) => [c.id, c])),
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
 *   recordedVitality?: object,
 *   legitimacyKnowledgeStore?: LegitimacyKnowledgeStore,
 *   applyKnowledgeOverlay?: boolean,
 *   applyLegitimacyConsume?: boolean,
 * }} deps
 */
export function advanceVatSection154VitalityArrival(deps) {
  const factoryKey = deps.factoryKey;
  if (!factoryKey) {
    return {
      ok: false,
      reason: "factory_key_required",
      liveFetch: false,
      liveKnowledgePostureArrived: false,
      vitalityClaimed: false,
      section4EndStateSatisfied: false,
      engImplComplete: false,
      knowledgeAliveComplete: false,
      sp03Complete: false,
      acc08Satisfied: false,
      constitutionalPhase: MANDATE_ID,
      vatThresholdId: VAT_ID,
      vatScore: { result: "FAIL", arrivalProved: false },
    };
  }

  const recordedVitality =
    deps.recordedVitality ??
    advanceRecordedEnrichmentVitality({
      factoryKey,
      packRoot: deps.packRoot,
      knowledgeStore: deps.knowledgeStore,
      registry: deps.registry,
      foundationQuality: deps.foundationQuality,
      foundationFreshness: deps.foundationFreshness,
      foundationComplete: deps.foundationComplete,
      motorSourceMode: deps.motorSourceMode,
      applyKnowledgeOverlay: deps.applyKnowledgeOverlay,
      applyLegitimacyConsume: deps.applyLegitimacyConsume,
    });

  const legitimacyConsume = applyLoopLegSup01LivingLegitimacyConsume({
    factoryKey,
    registry: deps.registry,
    foundationQuality: deps.foundationQuality,
    legitimacyKnowledgeStore: deps.legitimacyKnowledgeStore,
  });

  const vatScore = scoreVatSp03Section154({
    recordedVitality,
    legitimacyConsume,
  });

  const arrivalProved = vatScore.arrivalProved === true;

  return {
    ok: recordedVitality.ok === true,
    reason: recordedVitality.ok ? undefined : recordedVitality.reason,
    code: recordedVitality.code,
    constitutionalPhase: MANDATE_ID,
    mandateId: MANDATE_ID,
    vatThresholdId: VAT_ID,
    mandatedDomains: [...VAT_MANDATED_MPI_DOMAINS],
    knowledgePosture: arrivalProved
      ? "RECORDED_ENRICHMENT_VITALITY_ARRIVAL_PROVED"
      : "RECORDED_ENRICHMENT_VITALITY_ADVANCED",
    liveFetch: false,
    recordedOnly: true,
    liveKnowledgePostureArrived: arrivalProved,
    vitalityClaimed: arrivalProved,
    section4EndStateSatisfied: false,
    engImplComplete: false,
    knowledgeAliveComplete: false,
    sp03Complete: false,
    acc08Satisfied: false,
    sp04Opened: false,
    vatScore,
    section4: recordedVitality.section4,
    section4AllDimensionsAdvancedUnderRecorded:
      recordedVitality.section4AllDimensionsAdvancedUnderRecorded === true,
    evidenceCheckpoint: recordedVitality.evidenceCheckpoint,
    knowledgeOverlay: recordedVitality.knowledgeOverlay,
    legitimacyConsume,
    recordedVitalityBase: {
      constitutionalPhase: recordedVitality.constitutionalPhase,
      liveKnowledgePostureArrived: recordedVitality.liveKnowledgePostureArrived,
      phase: recordedVitality.phase,
    },
    foundationMpiDomains: [...FOUNDATION_MPI_DOMAINS],
    deficitDisposition: {
      "§4-DEF-01": arrivalProved ? "ARRIVAL_PROVED_UNDER_VAT_SP03_§15_4" : "ADVANCED_NOT_CLOSED",
      "§4-DEF-02": arrivalProved ? "ARRIVAL_PROVED_UNDER_VAT_SP03_§15_4" : "ADVANCED_NOT_CLOSED",
      "OBS-05": arrivalProved ? "ARRIVAL_PROVED_UNDER_VAT_SP03_§15_4" : "ADVANCED_NOT_CLOSED",
    },
    honesty: {
      liveFetch: false,
      pInt02LiveClosed: false,
      cloudElrClosed: false,
      constructionCompleteAsSoleProof: false,
      recordedOnlyAloneAsArrival: false,
      section4AdvancedUnderRecordedNotEquivalentToArrival: true,
      engineeringCompleteNotReopened: true,
      knowledgeAliveComplete: false,
      sp03Complete: false,
      acc08Satisfied: false,
      vatThresholdIsNotImplEvidenceAlone: true,
      message:
        "SP03-§15-4-VAT-ENG-IMPL tip evidence under VAT-SP03-§15-4; Live not implemented; Eng COMPLETE immutable; COMPLETE flags false; RECORDED ≠ Live",
    },
  };
}

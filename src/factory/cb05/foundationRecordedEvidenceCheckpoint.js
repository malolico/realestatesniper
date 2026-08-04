/**
 * SP03-§15-ENG-IMPL Phase 2 — Living Evidence checkpoint on recorded enrichment.
 *
 * Feeds RECORDED_ONLY enrichment SourceRefs into existing MOT-EVD-01 / sufficiency
 * surfaces across foundation MPI domains 01–03 (CB-06 consume-only).
 * Advances OBS-03 / OBS-05 without Live, without Evidence redesign.
 *
 * Mandate: §5.1#4 (Evidence as living requirement) + §4-DEF-01/02 advancement path.
 */

import { MotEvd01 } from "../cb06/motEvd01Core.js";
import { evaluateSufficiency } from "../cb06/sufficiencyGate.js";
import { loadRecordedPackEnrichment } from "../cb02/connectors/recordedPackEnrichmentAdapter.js";

/**
 * @param {{
 *   factoryKey: string,
 *   packRoot?: string,
 *   evd01?: MotEvd01,
 *   runId?: string,
 * }} deps
 */
export function applyRecordedEnrichmentEvidenceCheckpoint(deps) {
  const enrichment = loadRecordedPackEnrichment(deps.packRoot, {
    factoryKey: deps.factoryKey,
  });
  if (!enrichment.ok) {
    return {
      ok: false,
      reason: enrichment.reason,
      code: enrichment.code,
      livingEvidenceApplied: false,
      liveFetch: false,
      vitalityClaimed: false,
    };
  }

  const evd01 = deps.evd01 ?? new MotEvd01();
  const baseRunId = deps.runId ?? `sp03-eng-enrichment-${Date.now()}`;

  /** Phase 2 / OBS-03 — material manifests for MPI domains 01, 02, 03 under existing motor IDs. */
  const materialPlans = [
    {
      motorId: "MOT-IDN-01",
      domain: "01",
      runId: `${baseRunId}-d01`,
      sourceRefs: [enrichment.assessor, enrichment.gis].filter(Boolean),
    },
    {
      motorId: "MOT-LOC-01",
      domain: "02",
      runId: `${baseRunId}-d02`,
      sourceRefs: [enrichment.gis].filter(Boolean),
    },
    {
      motorId: "MOT-PHY-01",
      domain: "03",
      runId: `${baseRunId}-d03`,
      sourceRefs: [enrichment.assessor].filter(Boolean),
    },
  ];

  const manifests = materialPlans.map((plan) => ({
    kind: "MOTOR_RUN_MANIFEST",
    runId: plan.runId,
    motorId: plan.motorId,
    factoryKey: deps.factoryKey,
    material: true,
    knowledgeDelta: {
      domain: plan.domain,
      sourceMode: "RECORDED_ENRICHMENT",
      enrichmentMandate: "SP03-§15-ENG-IMPL",
      phase: "Phase 2",
      obsRefs: ["OBS-03", "OBS-05"],
    },
    constitutionalPhase: "SP03-§15-ENG-IMPL",
    sourceMode: "RECORDED_ONLY",
  }));

  /** @type {Record<string, object[]>} */
  const sourceRefsByManifest = {};
  for (const plan of materialPlans) {
    sourceRefsByManifest[plan.runId] = plan.sourceRefs;
  }

  const registration = evd01.registerMaterialManifests(
    deps.factoryKey,
    manifests,
    sourceRefsByManifest
  );
  const snapshot = evd01.getRegistrySnapshot(deps.factoryKey);
  const sufficiency = evaluateSufficiency(snapshot);

  const sourceRefIds = materialPlans.flatMap((p) => p.sourceRefs.map((r) => r.id));

  return {
    ok: true,
    livingEvidenceApplied: true,
    synthetic: false,
    recordedOnly: true,
    liveFetch: false,
    /** OBS-05 — RECORDED enrichment advances vitality path; Live arrival not claimed. */
    vitalityClaimed: false,
    knowledgePosture: "RECORDED_ENRICHMENT",
    mpiDomainsCovered: materialPlans.map((p) => p.domain),
    registration,
    sufficiency,
    sourceRefIds,
    mandateRefs: ["§5.1#3", "§5.1#4", "§4-DEF-01", "§4-DEF-02"],
    obsRefs: ["OBS-03", "OBS-05"],
    constitutionalPhase: "SP03-§15-ENG-IMPL",
    phase: "Phase 2",
  };
}

/**
 * OBS-05 — Recorded enrichment vitality posture report (not Live; not COMPLETE).
 *
 * @param {{
 *   factoryKey: string,
 *   packRoot?: string,
 *   evd01?: MotEvd01,
 * }} deps
 */
export function reportRecordedEnrichmentVitalityPosture(deps) {
  const checkpoint = applyRecordedEnrichmentEvidenceCheckpoint(deps);
  if (!checkpoint.ok) {
    return {
      ok: false,
      reason: checkpoint.reason,
      code: checkpoint.code,
      knowledgePosture: "UNAVAILABLE",
      liveFetch: false,
      vitalityClaimed: false,
      liveKnowledgePostureArrived: false,
      mandateRefs: ["§4-DEF-01", "§4-DEF-02"],
      obsRefs: ["OBS-05"],
      constitutionalPhase: "SP03-§15-ENG-IMPL",
      phase: "Phase 2",
    };
  }

  return {
    ok: true,
    knowledgePosture: "RECORDED_ENRICHMENT",
    liveFetch: false,
    recordedOnly: true,
    vitalityClaimed: false,
    liveKnowledgePostureArrived: false,
    sufficiencyStatus: checkpoint.sufficiency?.status ?? null,
    mpiDomainsCovered: checkpoint.mpiDomainsCovered,
    livingEvidenceApplied: checkpoint.livingEvidenceApplied,
    mandateRefs: ["§5.1#3", "§5.1#4", "§4-DEF-01", "§4-DEF-02"],
    obsRefs: ["OBS-05"],
    constitutionalPhase: "SP03-§15-ENG-IMPL",
    phase: "Phase 2",
    honesty: "RECORDED_ONLY ≠ Live; Phase 2 advances recorded enrichment vitality path only",
  };
}

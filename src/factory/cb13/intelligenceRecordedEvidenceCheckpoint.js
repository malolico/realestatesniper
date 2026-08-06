/**
 * SP04-ENG-IMPL CEP-01 / Phase 1 — Living Evidence checkpoint on INT recorded enrichment.
 *
 * Feeds RECORDED_ONLY enrichment SourceRefs into existing MOT-EVD-01 / sufficiency
 * surfaces for INT MPI domains 38–42 (CB-06 consume-only). No Live; no Evidence redesign.
 *
 * Mandate: Evidence as living requirement · DEF-SP04-01 / DEF-SP04-02 advancement path.
 * Gate: DAG-SP04-CEP01-P1
 */

import { MotEvd01 } from "../cb06/motEvd01Core.js";
import { evaluateSufficiency } from "../cb06/sufficiencyGate.js";
import { buildIntelligenceRecordedEnrichmentBundle } from "./intelligenceRecordedEnrichmentAdapter.js";

/**
 * @param {{
 *   factoryKey: string,
 *   packRoot?: string,
 *   evd01?: MotEvd01,
 *   runId?: string,
 *   forceSynthetic?: boolean,
 * }} deps
 */
export function applyIntelligenceRecordedEvidenceCheckpoint(deps) {
  if (deps.forceSynthetic === true) {
    return {
      ok: false,
      reason: "force_synthetic",
      livingEvidenceApplied: false,
      liveFetch: false,
      vitalityClaimed: false,
      livingIntelligenceProved: false,
    };
  }

  const enrichment = buildIntelligenceRecordedEnrichmentBundle(deps.factoryKey, {
    packRoot: deps.packRoot,
  });
  if (!enrichment.ok) {
    return {
      ok: false,
      reason: enrichment.reason,
      code: enrichment.code,
      livingEvidenceApplied: false,
      liveFetch: false,
      vitalityClaimed: false,
      livingIntelligenceProved: false,
    };
  }

  const evd01 = deps.evd01 ?? new MotEvd01();
  /** Deterministic runId from stable inputs only (factoryKey + packRoot + gate) — no clock/random. */
  const packKey = deps.packRoot ?? enrichment.packRoot ?? "default-pack";
  const baseRunId =
    deps.runId ??
    `sp04-cep01-int-enrichment-${deps.factoryKey}-${String(packKey).replace(/[^a-zA-Z0-9._-]+/g, "_")}`;

  const materialPlans = [
    {
      motorId: "MOT-SYN-01",
      domain: "38",
      runId: `${baseRunId}-d38`,
      sourceRefs: [enrichment.synthesisRef].filter(Boolean),
    },
    {
      motorId: "MOT-SYN-02",
      domain: "39",
      runId: `${baseRunId}-d39`,
      sourceRefs: [enrichment.synthesisRef].filter(Boolean),
      readiness: true,
    },
    {
      motorId: "MOT-DCN-01",
      domain: "40",
      runId: `${baseRunId}-d40`,
      sourceRefs: [enrichment.corpusRef].filter(Boolean),
    },
    {
      motorId: "MOT-COM-01",
      domain: "41",
      runId: `${baseRunId}-d41`,
      sourceRefs: [enrichment.releaseRef].filter(Boolean),
    },
    {
      motorId: "MOT-EXE-01",
      domain: "42",
      runId: `${baseRunId}-d42`,
      sourceRefs: [enrichment.execMemoRef].filter(Boolean),
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
      enrichmentMandate: "SP04-ENG-IMPL",
      gateId: "DAG-SP04-CEP01-P1",
      phase: "CEP-01",
      readiness: plan.readiness === true,
      livingIntelligenceProved: false,
      phase1Complete: false,
    },
    constitutionalPhase: "SP04-ENG-IMPL",
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

  const sourceRefIds = materialPlans.flatMap((p) =>
    p.sourceRefs.map((r) => (typeof r === "string" ? r : r.id)).filter(Boolean)
  );

  return {
    ok: true,
    livingEvidenceApplied: true,
    synthetic: false,
    recordedOnly: true,
    liveFetch: false,
    vitalityClaimed: false,
    livingIntelligenceProved: false,
    phase1Complete: false,
    knowledgePosture: "RECORDED_ENRICHMENT",
    mpiDomainsCovered: materialPlans.map((p) => p.domain),
    registration,
    sufficiency,
    sourceRefIds,
    mandateRefs: ["SP04-ENG-IMPL", "CEP-01", "DEF-SP04-01", "DEF-SP04-02"],
    constitutionalPhase: "SP04-ENG-IMPL",
    gateId: "DAG-SP04-CEP01-P1",
    honesty: "RECORDED_ONLY ≠ Live; CEP-01 advances INT recorded enrichment path only",
  };
}

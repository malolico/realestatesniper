/**
 * SP03-§15-ENG-IMPL Phase 1 — Living Evidence checkpoint on recorded enrichment.
 *
 * Feeds RECORDED_ONLY enrichment SourceRefs into existing MOT-EVD-01 / sufficiency
 * surfaces (CB-06 consume-only). Does not redesign Evidence arbitration semantics.
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
 *   motorId?: string,
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
    };
  }

  const evd01 = deps.evd01 ?? new MotEvd01();
  const runId = deps.runId ?? `sp03-eng-enrichment-${Date.now()}`;
  const motorId = deps.motorId ?? "MOT-IDN-01";

  /** Material foundation-style manifest for intercept (existing CB-06 path). */
  const manifest = {
    kind: "MOTOR_RUN_MANIFEST",
    runId,
    motorId,
    factoryKey: deps.factoryKey,
    material: true,
    knowledgeDelta: {
      domain: "01",
      sourceMode: "RECORDED_ENRICHMENT",
      enrichmentMandate: "SP03-§15-ENG-IMPL",
    },
    constitutionalPhase: "SP03-§15-ENG-IMPL",
    sourceMode: "RECORDED_ONLY",
  };

  const sourceRefs = [enrichment.assessor, enrichment.gis].filter(Boolean);
  const registration = evd01.registerMaterialManifests(
    deps.factoryKey,
    [manifest],
    { [runId]: sourceRefs }
  );
  const snapshot = evd01.getRegistrySnapshot(deps.factoryKey);
  const sufficiency = evaluateSufficiency(snapshot);

  return {
    ok: true,
    livingEvidenceApplied: true,
    synthetic: false,
    recordedOnly: true,
    liveFetch: false,
    registration,
    sufficiency,
    sourceRefIds: sourceRefs.map((r) => r.id),
    mandateRefs: ["§5.1#3", "§5.1#4", "§4-DEF-01", "§4-DEF-02"],
    constitutionalPhase: "SP03-§15-ENG-IMPL",
  };
}

/**
 * CB-13 — Intelligence evidence ingest (CB-06 integration)
 */

import { SUFFICIENCY_STATUS } from "../cb06/sufficiencyGate.js";
import { evaluateSufficiency } from "../cb06/sufficiencyGate.js";

/**
 * @param {{
 *   factoryKey: string,
 *   registry: import('../cb01/factoryRegistry.js').FactoryRegistry,
 *   evd01: import('../cb06/motEvd01Core.js').MotEvd01,
 *   knowledgeStore: import('./intelligenceKnowledgeStore.js').IntelligenceKnowledgeStore,
 * }} ctx
 */
export function ingestIntelligenceEvidence(ctx) {
  const snapshot = ctx.evd01.getRegistrySnapshot(ctx.factoryKey);
  const sufficiency = evaluateSufficiency(snapshot);

  const registration = {
    registeredCount: (snapshot.entries ?? []).length,
    layer: "INT",
    mpiDomains: ctx.knowledgeStore.mpiCoverage(ctx.factoryKey),
  };

  return {
    sufficiency,
    registration,
    snapshot,
    status: sufficiency.status === SUFFICIENCY_STATUS.PASS ? "SUFFICIENT" : "GAP",
  };
}

/**
 * @param {ReturnType<ingestIntelligenceEvidence>} result
 */
export function evaluateIntelligenceSufficiency(result) {
  return {
    status: result.sufficiency.status,
    reasons: result.sufficiency.reasons,
    reproducible: result.sufficiency.reproducible,
    rule: "EVF-05",
  };
}

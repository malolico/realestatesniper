/**
 * CB-09 — Economy evidence ingest via CB-06 EVF-01
 */

import { isSourceRef } from "../cb02/sourceRef.js";
import { isMaterialMotorManifest } from "../cb06/evidenceIntercept.js";
import { SUFFICIENCY_STATUS } from "../cb06/sufficiencyGate.js";
import { ECONOMY_MPI_DOMAINS, isEconomyMotor } from "./economyCatalog.js";

/**
 * @param {import('../cb01/factoryRegistry.js').FactoryRegistry} registry
 * @param {string} factoryKey
 * @param {import('./economyKnowledgeStore.js').EconomyKnowledgeStore} knowledgeStore
 */
export function collectEconomySourceRefsByManifest(registry, factoryKey, knowledgeStore) {
  /** @type {Record<string, object[]>} */
  const map = {};
  const state = knowledgeStore.read(factoryKey);
  const allRefs = ECONOMY_MPI_DOMAINS.flatMap(
    (d) => state.mpiDomains[d]?.sourceRefs ?? []
  ).filter(isSourceRef);

  const manifests = registry.getExpediente(factoryKey)?.elr?.motor_manifests ?? [];
  for (const manifest of manifests) {
    if (!isMaterialMotorManifest(manifest) || !isEconomyMotor(manifest.motorId)) continue;
    map[manifest.runId] = allRefs.length > 0 ? allRefs : [];
  }
  return map;
}

/**
 * @param {{
 *   factoryKey: string,
 *   registry: import('../cb01/factoryRegistry.js').FactoryRegistry,
 *   evd01: import('../cb06/motEvd01Core.js').MotEvd01,
 *   knowledgeStore: import('./economyKnowledgeStore.js').EconomyKnowledgeStore,
 * }} deps
 */
export function ingestEconomyEvidence(deps) {
  const { factoryKey, registry, evd01, knowledgeStore } = deps;
  const manifests = registry.getExpediente(factoryKey)?.elr?.motor_manifests ?? [];
  const ecoManifests = manifests.filter(
    (m) => isMaterialMotorManifest(m) && isEconomyMotor(m.motorId)
  );
  const sourceRefsByManifest = collectEconomySourceRefsByManifest(
    registry,
    factoryKey,
    knowledgeStore
  );

  const registration = evd01.registerMaterialManifests(
    factoryKey,
    ecoManifests,
    sourceRefsByManifest
  );

  const snapshot = evd01.getRegistrySnapshot(factoryKey);
  const sufficiency = evaluateEconomySufficiency(snapshot, factoryKey, knowledgeStore);

  return { registration, sufficiency, ecoManifestCount: ecoManifests.length, snapshot };
}

/**
 * @param {object} evidenceSnapshot
 * @param {string} factoryKey
 * @param {import('./economyKnowledgeStore.js').EconomyKnowledgeStore} knowledgeStore
 */
export function evaluateEconomySufficiency(evidenceSnapshot, factoryKey, knowledgeStore) {
  const state = knowledgeStore.read(factoryKey);
  const reasons = [];

  for (const domain of ECONOMY_MPI_DOMAINS) {
    if ((state.mpiDomains[domain]?.deltas?.length ?? 0) === 0) {
      reasons.push(`ddi_iv_domain_${domain}_missing`);
    }
  }

  const ecoEntries = (evidenceSnapshot.entries ?? []).filter((e) =>
    ECONOMY_MPI_DOMAINS.includes(e.mpiDomain)
  );
  if (ecoEntries.length === 0) {
    reasons.push("no_eco_evidence_refs");
  }

  return {
    status: reasons.length === 0 ? SUFFICIENCY_STATUS.PASS : SUFFICIENCY_STATUS.FAIL,
    reasons,
    rule: "EVF-05+DDI-IV",
    reproducible: true,
  };
}

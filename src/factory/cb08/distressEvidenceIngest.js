/**
 * CB-08 — Distress evidence ingest via CB-06 EVF-01
 */

import { isSourceRef } from "../cb02/sourceRef.js";
import { isMaterialMotorManifest } from "../cb06/evidenceIntercept.js";
import { SUFFICIENCY_STATUS } from "../cb06/sufficiencyGate.js";
import { DISTRESS_MPI_DOMAINS, isDistressMotor } from "./distressCatalog.js";

/**
 * @param {import('../cb01/factoryRegistry.js').FactoryRegistry} registry
 * @param {string} factoryKey
 * @param {import('./distressKnowledgeStore.js').DistressKnowledgeStore} knowledgeStore
 */
export function collectDistressSourceRefsByManifest(registry, factoryKey, knowledgeStore) {
  /** @type {Record<string, object[]>} */
  const map = {};
  const state = knowledgeStore.read(factoryKey);
  const allRefs = DISTRESS_MPI_DOMAINS.flatMap(
    (d) => state.mpiDomains[d]?.sourceRefs ?? []
  ).filter(isSourceRef);

  const manifests = registry.getExpediente(factoryKey)?.elr?.motor_manifests ?? [];
  for (const manifest of manifests) {
    if (!isMaterialMotorManifest(manifest) || !isDistressMotor(manifest.motorId)) continue;
    map[manifest.runId] = allRefs.length > 0 ? allRefs : [];
  }
  return map;
}

/**
 * @param {{
 *   factoryKey: string,
 *   registry: import('../cb01/factoryRegistry.js').FactoryRegistry,
 *   evd01: import('../cb06/motEvd01Core.js').MotEvd01,
 *   knowledgeStore: import('./distressKnowledgeStore.js').DistressKnowledgeStore,
 * }} deps
 */
export function ingestDistressEvidence(deps) {
  const { factoryKey, registry, evd01, knowledgeStore } = deps;
  const manifests = registry.getExpediente(factoryKey)?.elr?.motor_manifests ?? [];
  const dstManifests = manifests.filter(
    (m) => isMaterialMotorManifest(m) && isDistressMotor(m.motorId)
  );
  const sourceRefsByManifest = collectDistressSourceRefsByManifest(
    registry,
    factoryKey,
    knowledgeStore
  );

  const registration = evd01.registerMaterialManifests(
    factoryKey,
    dstManifests,
    sourceRefsByManifest
  );

  const snapshot = evd01.getRegistrySnapshot(factoryKey);
  const sufficiency = evaluateDistressSufficiency(snapshot, factoryKey, knowledgeStore);

  return { registration, sufficiency, dstManifestCount: dstManifests.length, snapshot };
}

/**
 * @param {object} evidenceSnapshot
 * @param {string} factoryKey
 * @param {import('./distressKnowledgeStore.js').DistressKnowledgeStore} knowledgeStore
 */
export function evaluateDistressSufficiency(evidenceSnapshot, factoryKey, knowledgeStore) {
  const state = knowledgeStore.read(factoryKey);
  const reasons = [];

  for (const domain of DISTRESS_MPI_DOMAINS) {
    if ((state.mpiDomains[domain]?.deltas?.length ?? 0) === 0) {
      reasons.push(`ddi_iii_domain_${domain}_missing`);
    }
  }

  const dstEntries = (evidenceSnapshot.entries ?? []).filter((e) =>
    DISTRESS_MPI_DOMAINS.includes(e.mpiDomain)
  );
  if (dstEntries.length === 0) {
    reasons.push("no_dst_evidence_refs");
  }

  return {
    status: reasons.length === 0 ? SUFFICIENCY_STATUS.PASS : SUFFICIENCY_STATUS.FAIL,
    reasons,
    rule: "EVF-05+DDI-III",
    reproducible: true,
  };
}

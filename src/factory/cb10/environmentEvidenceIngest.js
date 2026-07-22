/**
 * CB-10 — Environment evidence ingest via CB-06 EVF-01
 */

import { isSourceRef } from "../cb02/sourceRef.js";
import { isMaterialMotorManifest } from "../cb06/evidenceIntercept.js";
import { SUFFICIENCY_STATUS } from "../cb06/sufficiencyGate.js";
import { ENVIRONMENT_MPI_DOMAINS, isEnvironmentMotor } from "./environmentCatalog.js";

/**
 * @param {import('../cb01/factoryRegistry.js').FactoryRegistry} registry
 * @param {string} factoryKey
 * @param {import('./environmentKnowledgeStore.js').EnvironmentKnowledgeStore} knowledgeStore
 */
export function collectEnvironmentSourceRefsByManifest(registry, factoryKey, knowledgeStore) {
  /** @type {Record<string, object[]>} */
  const map = {};
  const state = knowledgeStore.read(factoryKey);
  const allRefs = ENVIRONMENT_MPI_DOMAINS.flatMap(
    (d) => state.mpiDomains[d]?.sourceRefs ?? []
  ).filter(isSourceRef);

  const manifests = registry.getExpediente(factoryKey)?.elr?.motor_manifests ?? [];
  for (const manifest of manifests) {
    if (!isMaterialMotorManifest(manifest) || !isEnvironmentMotor(manifest.motorId)) continue;
    map[manifest.runId] = allRefs.length > 0 ? allRefs : [];
  }
  return map;
}

/**
 * @param {{
 *   factoryKey: string,
 *   registry: import('../cb01/factoryRegistry.js').FactoryRegistry,
 *   evd01: import('../cb06/motEvd01Core.js').MotEvd01,
 *   knowledgeStore: import('./environmentKnowledgeStore.js').EnvironmentKnowledgeStore,
 * }} deps
 */
export function ingestEnvironmentEvidence(deps) {
  const { factoryKey, registry, evd01, knowledgeStore } = deps;
  const manifests = registry.getExpediente(factoryKey)?.elr?.motor_manifests ?? [];
  const envManifests = manifests.filter(
    (m) => isMaterialMotorManifest(m) && isEnvironmentMotor(m.motorId)
  );
  const sourceRefsByManifest = collectEnvironmentSourceRefsByManifest(
    registry,
    factoryKey,
    knowledgeStore
  );

  const registration = evd01.registerMaterialManifests(
    factoryKey,
    envManifests,
    sourceRefsByManifest
  );

  const snapshot = evd01.getRegistrySnapshot(factoryKey);
  const sufficiency = evaluateEnvironmentSufficiency(snapshot, factoryKey, knowledgeStore);

  return { registration, sufficiency, envManifestCount: envManifests.length, snapshot };
}

/**
 * @param {object} evidenceSnapshot
 * @param {string} factoryKey
 * @param {import('./environmentKnowledgeStore.js').EnvironmentKnowledgeStore} knowledgeStore
 */
export function evaluateEnvironmentSufficiency(evidenceSnapshot, factoryKey, knowledgeStore) {
  const state = knowledgeStore.read(factoryKey);
  const reasons = [];

  for (const domain of ENVIRONMENT_MPI_DOMAINS) {
    if ((state.mpiDomains[domain]?.deltas?.length ?? 0) === 0) {
      reasons.push(`ddi_v_domain_${domain}_missing`);
    }
  }

  const envEntries = (evidenceSnapshot.entries ?? []).filter((e) =>
    ENVIRONMENT_MPI_DOMAINS.includes(e.mpiDomain)
  );
  if (envEntries.length === 0) {
    reasons.push("no_env_evidence_refs");
  }

  return {
    status: reasons.length === 0 ? SUFFICIENCY_STATUS.PASS : SUFFICIENCY_STATUS.FAIL,
    reasons,
    rule: "EVF-05+DDI-V",
    reproducible: true,
  };
}

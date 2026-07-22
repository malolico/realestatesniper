/**
 * CB-07 — Legitimacy evidence ingest via CB-06 EVF-01
 */

import { isSourceRef } from "../cb02/sourceRef.js";
import { isMaterialMotorManifest } from "../cb06/evidenceIntercept.js";
import { SUFFICIENCY_STATUS } from "../cb06/sufficiencyGate.js";
import {
  LEGITIMACY_DDI_PART_II,
  LEGITIMACY_MPI_DOMAINS,
  isLegitimacyMotor,
} from "./legitimacyCatalog.js";

/**
 * @param {import('../cb01/factoryRegistry.js').FactoryRegistry} registry
 * @param {string} factoryKey
 * @param {import('./legitimacyKnowledgeStore.js').LegitimacyKnowledgeStore} knowledgeStore
 */
export function collectLegitimacySourceRefsByManifest(registry, factoryKey, knowledgeStore) {
  /** @type {Record<string, object[]>} */
  const map = {};
  const state = knowledgeStore.read(factoryKey);
  const allRefs = LEGITIMACY_MPI_DOMAINS.flatMap(
    (d) => state.mpiDomains[d]?.sourceRefs ?? []
  ).filter(isSourceRef);

  const manifests = registry.getExpediente(factoryKey)?.elr?.motor_manifests ?? [];
  for (const manifest of manifests) {
    if (!isMaterialMotorManifest(manifest) || !isLegitimacyMotor(manifest.motorId)) continue;
    map[manifest.runId] = allRefs.length > 0 ? allRefs : [];
  }
  return map;
}

/**
 * @param {{
 *   factoryKey: string,
 *   registry: import('../cb01/factoryRegistry.js').FactoryRegistry,
 *   evd01: import('../cb06/motEvd01Core.js').MotEvd01,
 *   knowledgeStore: import('./legitimacyKnowledgeStore.js').LegitimacyKnowledgeStore,
 * }} deps
 */
export function ingestLegitimacyEvidence(deps) {
  const { factoryKey, registry, evd01, knowledgeStore } = deps;
  const manifests = registry.getExpediente(factoryKey)?.elr?.motor_manifests ?? [];
  const legManifests = manifests.filter(
    (m) => isMaterialMotorManifest(m) && isLegitimacyMotor(m.motorId)
  );
  const sourceRefsByManifest = collectLegitimacySourceRefsByManifest(
    registry,
    factoryKey,
    knowledgeStore
  );

  const registration = evd01.registerMaterialManifests(
    factoryKey,
    legManifests,
    sourceRefsByManifest
  );

  const snapshot = evd01.getRegistrySnapshot(factoryKey);
  const sufficiency = evaluateLegitimacySufficiency(snapshot, factoryKey, knowledgeStore);

  return { registration, sufficiency, legManifestCount: legManifests.length, snapshot };
}

/**
 * @param {object} evidenceSnapshot
 * @param {string} factoryKey
 * @param {import('./legitimacyKnowledgeStore.js').LegitimacyKnowledgeStore} knowledgeStore
 */
export function evaluateLegitimacySufficiency(evidenceSnapshot, factoryKey, knowledgeStore) {
  const state = knowledgeStore.read(factoryKey);
  const ddiDomains = LEGITIMACY_DDI_PART_II.mpiDomains;
  const reasons = [];

  for (const domain of ddiDomains) {
    if ((state.mpiDomains[domain]?.deltas?.length ?? 0) === 0) {
      reasons.push(`ddi_ii_domain_${domain}_missing`);
    }
  }

  const legEntries = (evidenceSnapshot.entries ?? []).filter((e) =>
    ddiDomains.includes(e.mpiDomain)
  );
  if (legEntries.length === 0) {
    reasons.push("no_leg_evidence_refs");
  }

  return {
    status: reasons.length === 0 ? SUFFICIENCY_STATUS.PASS : SUFFICIENCY_STATUS.FAIL,
    reasons,
    rule: "EVF-05+DDI-II",
    reproducible: true,
  };
}

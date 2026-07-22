/**
 * CB-06 — MOT-EVD-01 core registrar
 */

import { EvidenceRegistryStore } from "./evidenceRegistryStore.js";
import { interceptManifest, isMaterialMotorManifest } from "./evidenceIntercept.js";

export class MotEvd01 {
  static ACTOR = "MOT-EVD-01";

  /**
   * @param {{ store?: EvidenceRegistryStore }} [deps]
   */
  constructor(deps = {}) {
    this.store = deps.store ?? new EvidenceRegistryStore();
  }

  /**
   * @param {string} factoryKey
   * @param {object[]} manifests
   * @param {Record<string, object[]>} [sourceRefsByManifest]
   */
  registerMaterialManifests(factoryKey, manifests, sourceRefsByManifest = {}) {
    const material = manifests.filter(isMaterialMotorManifest);
    const registered = [];
    const manifestsWithEvidence = new Set();

    for (const manifest of material) {
      const sourceRefs = sourceRefsByManifest[manifest.runId] ?? [];
      const evidenceRefs = interceptManifest(manifest, sourceRefs);
      if (evidenceRefs.length > 0) {
        manifestsWithEvidence.add(manifest.runId);
      }
      for (const ref of evidenceRefs) {
        this.store.appendEntry(factoryKey, ref);
        registered.push(ref);
      }
    }

    const registry = this.store.read(factoryKey);
    registry.materialManifestCount = material.length;
    registry.manifestsCovered = manifestsWithEvidence.size;
    registry.registeredCount = registry.entries.length;
    this.store.write(factoryKey, registry);

    return {
      actor: MotEvd01.ACTOR,
      materialCount: material.length,
      manifestsCovered: manifestsWithEvidence.size,
      registeredCount: registered.length,
      coverage: material.length > 0 ? manifestsWithEvidence.size / material.length : 1,
      entries: registered,
    };
  }

  /**
   * @param {string} factoryKey
   */
  getRegistrySnapshot(factoryKey) {
    return this.store.read(factoryKey);
  }
}

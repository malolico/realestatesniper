/**
 * CB-06 — EVF-01 evidence intercept for motor manifests
 */

import { isSourceRef } from "../cb02/sourceRef.js";
import { buildEvidenceRef } from "./evidenceRef.js";
import { classifySourceRefEvidence } from "./evidenceVocabulary.js";

const MATERIAL_MANIFEST_KIND = "MOTOR_RUN_MANIFEST";
const EVIDENCE_MOTORS = new Set(["MOT-EVD-01", "MOT-EVD-02"]);

/**
 * @param {object} manifest
 */
export function isMaterialMotorManifest(manifest) {
  if (!manifest || manifest.kind !== MATERIAL_MANIFEST_KIND) return false;
  if (EVIDENCE_MOTORS.has(manifest.motorId)) return false;
  const delta = manifest.knowledgeDelta ?? {};
  return Object.keys(delta).length > 0;
}

/**
 * @param {object} manifest
 * @param {object[]} [sourceRefs]
 */
export function interceptManifest(manifest, sourceRefs = []) {
  if (!isMaterialMotorManifest(manifest)) {
    return [];
  }

  const refs = [];
  const delta = manifest.knowledgeDelta ?? {};
  const mpiDomain = delta.domain ?? null;

  if (sourceRefs.length === 0) {
    refs.push(
      buildEvidenceRef({
        factoryKey: manifest.factoryKey,
        motorId: manifest.motorId,
        manifestRunId: manifest.runId,
        eLevel: "E3",
        cLevel: "C2",
        mpiDomain,
        knowledgeDelta: delta,
      })
    );
    return refs;
  }

  for (const sourceRef of sourceRefs) {
    const { eLevel, cLevel } = isSourceRef(sourceRef)
      ? classifySourceRefEvidence(sourceRef)
      : { eLevel: "E3", cLevel: "C2" };

    refs.push(
      buildEvidenceRef({
        factoryKey: manifest.factoryKey,
        motorId: manifest.motorId,
        manifestRunId: manifest.runId,
        sourceRef,
        eLevel,
        cLevel,
        mpiDomain,
        knowledgeDelta: delta,
      })
    );
  }

  return refs;
}

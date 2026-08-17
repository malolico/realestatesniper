/**
 * SP10 — Recorded Observation V1 (CB-02 Discovery)
 * Deterministic recorded input — no LIVE, no factoryKey, no Evidence.
 */

import fs from "node:fs";
import path from "node:path";
import { getOrganism, isOrganismProhibited } from "../sourceOrganismsCatalog.js";
import { normalizeJurisdiction } from "../jurisdictionRegistry.js";
import { validatePayloadAgainstSchema } from "../connectors/payloadSchemas.js";
import {
  CHECKSUMS_FILENAME,
  sha256File,
  sha256Hex,
  verifyChecksumsAuthority,
} from "../connectors/recordedPackChecksums.js";

export const RECORDED_OBSERVATION_SCHEMA_ID = "rsn.cb02.discovery.recordedObservation.v1";
export const RECORDED_OBSERVATION_SCHEMA_VERSION = 1;
export const OBSERVATION_MANIFEST_FILENAME = "observation.manifest.json";

export const RECORDED_OBSERVATION_AUTHORITY = Object.freeze({
  isEvidence: false,
  isFact: false,
  isSignal: false,
  isCandidate: false,
  isDecision: false,
  isOpportunity: false,
  isProduct: false,
  evidenceAuthority: "CB-06",
  recordedObservationIsNotEvidence: true,
  liveFetch: false,
  sourceMode: "RECORDED",
});

const SECRET_PATTERNS = [
  new RegExp(`sk${"_"}live${"_"}`, "i"),
  new RegExp(`sk${"_"}test${"_"}`, "i"),
  /Bearer\s+\S+/i,
  /api[_-]?key\s*[:=]/i,
  /AWS[_]?SECRET/i,
  /password\s*[:=]/i,
];

/**
 * Immutable dedup identity — processing time MUST NOT appear here.
 *
 * @param {{
 *   observationId: string,
 *   sourceIdentity: { organismId: string },
 *   payloadFingerprint: string,
 *   observedAt: string,
 * }} manifest
 */
export function computeDiscoveryDedupKey(manifest) {
  const organismId = manifest.sourceIdentity.organismId;
  const input = `${manifest.observationId}|${organismId}|${manifest.payloadFingerprint}|${manifest.observedAt}`;
  return sha256Hex(input);
}

/**
 * @param {string} observationId
 */
export function buildDiscoveryCandidateRef(observationId) {
  return `disc-${observationId}`;
}

/**
 * @param {string} observationRoot
 * @returns {{
 *   ok: true,
 *   manifest: object,
 *   payload: object,
 *   jurisdiction: object,
 *   payloadAbsPath: string,
 *   dedupKey: string,
 *   observationRoot: string,
 * } | { ok: false, reason: string }}
 */
export function validateRecordedObservation(observationRoot) {
  if (!observationRoot || typeof observationRoot !== "string") {
    return { ok: false, reason: "observation_root_invalid" };
  }
  const root = path.resolve(observationRoot);
  if (!fs.existsSync(root) || !fs.statSync(root).isDirectory()) {
    return { ok: false, reason: "observation_root_missing" };
  }

  const manifestPath = path.join(root, OBSERVATION_MANIFEST_FILENAME);
  if (!fs.existsSync(manifestPath)) {
    return { ok: false, reason: "manifest_missing" };
  }

  let manifest;
  try {
    manifest = JSON.parse(fs.readFileSync(manifestPath, "utf8"));
  } catch {
    return { ok: false, reason: "manifest_unparseable" };
  }

  if (!manifest || typeof manifest !== "object" || Array.isArray(manifest)) {
    return { ok: false, reason: "manifest_not_object" };
  }

  if (manifest.schemaId !== RECORDED_OBSERVATION_SCHEMA_ID) {
    return { ok: false, reason: "schemaId_mismatch" };
  }
  if (manifest.schemaVersion !== RECORDED_OBSERVATION_SCHEMA_VERSION) {
    return { ok: false, reason: "schemaVersion_mismatch" };
  }
  if (manifest.sourceMode !== "RECORDED") {
    return { ok: false, reason: "sourceMode_not_RECORDED" };
  }
  if (manifest.liveFetch !== false) {
    return { ok: false, reason: "liveFetch_not_false" };
  }

  for (const field of [
    "observationId",
    "corpusId",
    "jurisdiction",
    "observedAt",
    "recordedAt",
    "payloadPath",
    "payloadFingerprint",
  ]) {
    if (typeof manifest[field] !== "string" || !manifest[field].trim()) {
      return { ok: false, reason: `manifest_missing_field:${field}` };
    }
  }

  const sourceIdentity = manifest.sourceIdentity;
  if (!sourceIdentity || typeof sourceIdentity !== "object") {
    return { ok: false, reason: "sourceIdentity_missing" };
  }
  for (const field of ["organismId", "familyId", "payloadSchemaId"]) {
    if (typeof sourceIdentity[field] !== "string" || !sourceIdentity[field].trim()) {
      return { ok: false, reason: `sourceIdentity_missing_field:${field}` };
    }
  }

  const organism = getOrganism(sourceIdentity.organismId);
  if (!organism) {
    return { ok: false, reason: `organism_unknown:${sourceIdentity.organismId}` };
  }
  if (isOrganismProhibited(organism)) {
    return { ok: false, reason: `organism_prohibited:${sourceIdentity.organismId}` };
  }
  if (!organism.families?.includes(sourceIdentity.familyId)) {
    return { ok: false, reason: `family_mismatch:${sourceIdentity.organismId}` };
  }

  const checksums = verifyChecksumsAuthority(root);
  if (!checksums.ok) {
    return { ok: false, reason: checksums.reason };
  }
  if (!checksums.entries.has(OBSERVATION_MANIFEST_FILENAME)) {
    return { ok: false, reason: "checksums_missing_manifest_entry" };
  }

  const payloadRel = String(manifest.payloadPath).replace(/\\/g, "/");
  const payloadAbsPath = path.join(root, ...payloadRel.split("/"));
  if (!fs.existsSync(payloadAbsPath)) {
    return { ok: false, reason: "payload_missing" };
  }
  if (!checksums.entries.has(payloadRel)) {
    return { ok: false, reason: "checksums_missing_payload_entry" };
  }

  const payloadHash = sha256File(payloadAbsPath);
  if (payloadHash !== manifest.payloadFingerprint) {
    return { ok: false, reason: "payload_fingerprint_mismatch" };
  }
  const authorityHash = checksums.entries.get(payloadRel);
  if (authorityHash !== payloadHash) {
    return { ok: false, reason: "checksum_authority_mismatch" };
  }

  let payload;
  try {
    payload = JSON.parse(fs.readFileSync(payloadAbsPath, "utf8"));
  } catch {
    return { ok: false, reason: "payload_unparseable" };
  }

  const schemaCheck = validatePayloadAgainstSchema(sourceIdentity.payloadSchemaId, payload);
  if (!schemaCheck.ok) {
    return { ok: false, reason: `schema_invalid:${schemaCheck.reason}` };
  }

  for (const blob of [JSON.stringify(manifest), JSON.stringify(payload)]) {
    for (const re of SECRET_PATTERNS) {
      if (re.test(blob)) {
        return { ok: false, reason: "secrets_detected_in_observation" };
      }
    }
  }

  const jurisdiction = normalizeJurisdiction({ sourceLabel: manifest.jurisdiction });
  const dedupKey = computeDiscoveryDedupKey(manifest);

  return Object.freeze({
    ok: true,
    manifest: Object.freeze(JSON.parse(JSON.stringify(manifest))),
    payload: Object.freeze(JSON.parse(JSON.stringify(payload))),
    jurisdiction: Object.freeze({ ...jurisdiction }),
    payloadAbsPath,
    dedupKey,
    observationRoot: root,
    authority: RECORDED_OBSERVATION_AUTHORITY,
  });
}

export { CHECKSUMS_FILENAME };

/**
 * P-INT-02 Offline — recorded pack validator (fail-closed, no network).
 */

import fs from "node:fs";
import path from "node:path";
import { getOrganism, isOrganismProhibited } from "../sourceOrganismsCatalog.js";
import { getMaricopaContractByOrganismId } from "./maricopaConnectorContracts.js";
import { getPimaContractByOrganismId } from "./pimaConnectorContracts.js";
import {
  sha256File,
  verifyChecksumsAuthority,
} from "./recordedPackChecksums.js";
import { validatePayloadAgainstSchema } from "./payloadSchemas.js";

/**
 * Resolve RECORDED_ONLY contract for a registered organism (jurisdiction-agnostic).
 * @param {string} organismId
 */
export function getRecordedContractByOrganismId(organismId) {
  return (
    getMaricopaContractByOrganismId(organismId) ??
    getPimaContractByOrganismId(organismId) ??
    null
  );
}

const SECRET_PATTERNS = [
  new RegExp(`sk${"_"}live${"_"}`, "i"),
  new RegExp(`sk${"_"}test${"_"}`, "i"),
  /Bearer\s+\S+/i,
  /api[_-]?key\s*[:=]/i,
  /AWS[_]?SECRET/i,
  /password\s*[:=]/i,
];

/**
 * @param {string} packRoot
 * @returns {{ ok: true, manifest: object, provenance: object } | { ok: false, reason: string }}
 */
export function validateRecordedPack(packRoot) {
  if (!packRoot || typeof packRoot !== "string") {
    return { ok: false, reason: "pack_root_invalid" };
  }
  const root = path.resolve(packRoot);
  if (!fs.existsSync(root) || !fs.statSync(root).isDirectory()) {
    return { ok: false, reason: "pack_root_missing" };
  }

  const manifestPath = path.join(root, "pack.manifest.json");
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

  if (Object.prototype.hasOwnProperty.call(manifest, "manifestChecksum")) {
    return { ok: false, reason: "manifest_self_checksum_forbidden" };
  }

  if (manifest.sourceMode !== "RECORDED") {
    return { ok: false, reason: "sourceMode_not_RECORDED" };
  }
  if (manifest.liveFetch !== false) {
    return { ok: false, reason: "liveFetch_not_false" };
  }

  for (const field of ["packId", "schemaVersion", "jurisdiction", "pilotId", "factoryKey"]) {
    if (typeof manifest[field] !== "string" || !manifest[field].trim()) {
      return { ok: false, reason: `manifest_missing_field:${field}` };
    }
  }

  if (!Array.isArray(manifest.organisms) || manifest.organisms.length === 0) {
    return { ok: false, reason: "manifest_organisms_empty" };
  }

  if (!Array.isArray(manifest.contractIds) || manifest.contractIds.length === 0) {
    return { ok: false, reason: "manifest_contractIds_empty" };
  }

  const checksums = verifyChecksumsAuthority(root);
  if (!checksums.ok) {
    return { ok: false, reason: checksums.reason };
  }

  const manifestRel = "pack.manifest.json";
  if (!checksums.entries.has(manifestRel)) {
    return { ok: false, reason: "checksums_missing_manifest_entry" };
  }

  const provenancePath = path.join(root, "provenance.json");
  let provenance = {};
  if (fs.existsSync(provenancePath)) {
    try {
      provenance = JSON.parse(fs.readFileSync(provenancePath, "utf8"));
    } catch {
      return { ok: false, reason: "provenance_unparseable" };
    }
    if (!checksums.entries.has("provenance.json")) {
      return { ok: false, reason: "checksums_missing_provenance_entry" };
    }
  }

  const secretScanTargets = [JSON.stringify(manifest), JSON.stringify(provenance)];

  for (const entry of manifest.organisms) {
    if (!entry || typeof entry !== "object") {
      return { ok: false, reason: "organism_entry_invalid" };
    }
    const { organismId, familyId, responsePath, contentChecksum, payloadSchemaId } =
      entry;
    if (!organismId || !familyId || !responsePath || !contentChecksum || !payloadSchemaId) {
      return { ok: false, reason: "organism_entry_incomplete" };
    }

    const organism = getOrganism(organismId);
    if (!organism) {
      return { ok: false, reason: `organism_unknown:${organismId}` };
    }
    if (isOrganismProhibited(organism) || organism.status === "PROHIBITED") {
      return { ok: false, reason: `organism_prohibited:${organismId}` };
    }

    const contract = getRecordedContractByOrganismId(organismId);
    if (!contract) {
      return { ok: false, reason: `contract_missing_for_organism:${organismId}` };
    }
    if (!manifest.contractIds.includes(contract.contractId)) {
      return { ok: false, reason: `contractId_not_listed:${contract.contractId}` };
    }
    if (familyId !== contract.familyId) {
      return { ok: false, reason: `family_mismatch:${organismId}` };
    }
    if (!organism.families.includes(familyId)) {
      return { ok: false, reason: `family_not_in_catalog:${organismId}` };
    }
    if (payloadSchemaId !== contract.payloadSchemaId) {
      return { ok: false, reason: `payloadSchemaId_mismatch:${organismId}` };
    }

    const rel = String(responsePath).replace(/\\/g, "/");
    if (rel.includes("..") || path.isAbsolute(rel)) {
      return { ok: false, reason: `response_path_unsafe:${rel}` };
    }
    const abs = path.resolve(root, ...rel.split("/"));
    const relToRoot = path.relative(root, abs);
    if (
      relToRoot.startsWith("..") ||
      path.isAbsolute(relToRoot) ||
      !fs.existsSync(abs)
    ) {
      return { ok: false, reason: `response_missing:${rel}` };
    }

    const fileHash = sha256File(abs);
    if (fileHash !== String(contentChecksum).toLowerCase()) {
      return { ok: false, reason: `contentChecksum_mismatch:${organismId}` };
    }
    const authorityHash = checksums.entries.get(rel);
    if (!authorityHash || authorityHash !== fileHash) {
      return { ok: false, reason: `checksum_authority_mismatch:${rel}` };
    }

    let payload;
    try {
      payload = JSON.parse(fs.readFileSync(abs, "utf8"));
    } catch {
      return { ok: false, reason: `payload_unparseable:${organismId}` };
    }
    secretScanTargets.push(JSON.stringify(payload));

    const schemaCheck = validatePayloadAgainstSchema(payloadSchemaId, payload);
    if (!schemaCheck.ok) {
      return { ok: false, reason: `schema_invalid:${organismId}:${schemaCheck.reason}` };
    }

    const effectiveVintage =
      (typeof entry.vintageAt === "string" && entry.vintageAt.trim()) ||
      (typeof manifest.vintageAt === "string" && manifest.vintageAt.trim()) ||
      null;
    if (!effectiveVintage) {
      return { ok: false, reason: `provenance_insufficient:vintageAt:${organismId}` };
    }
  }

  for (const blob of secretScanTargets) {
    for (const re of SECRET_PATTERNS) {
      if (re.test(blob)) {
        return { ok: false, reason: "secrets_detected_in_pack" };
      }
    }
  }

  return {
    ok: true,
    manifest: Object.freeze(JSON.parse(JSON.stringify(manifest))),
    provenance: Object.freeze(JSON.parse(JSON.stringify(provenance))),
    packRoot: root,
  };
}

/**
 * Effective vintageAt: organism entry wins over pack default.
 * @param {object} manifest
 * @param {object} organismEntry
 */
export function resolveEffectiveVintageAt(manifest, organismEntry) {
  if (typeof organismEntry?.vintageAt === "string" && organismEntry.vintageAt.trim()) {
    return organismEntry.vintageAt.trim();
  }
  if (typeof manifest?.vintageAt === "string" && manifest.vintageAt.trim()) {
    return manifest.vintageAt.trim();
  }
  return null;
}

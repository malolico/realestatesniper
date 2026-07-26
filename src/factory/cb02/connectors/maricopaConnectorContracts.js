/**
 * P-INT-02 Offline — Maricopa RECORDED_ONLY connector contracts (ASR/GIS/RCR).
 */

import { getOrganism } from "../sourceOrganismsCatalog.js";
import { defineConnectorContract } from "./connectorContract.js";
import {
  SCHEMA_ASR_MC_V1,
  SCHEMA_GIS_MC_V1,
  SCHEMA_RCR_MC_V1,
} from "./payloadSchemas.js";

function contractFromOrganism(organismId, contractId, payloadSchemaId) {
  const organism = getOrganism(organismId);
  if (!organism || organism.status === "PROHIBITED") {
    throw new Error(`[P-INT-02] Cannot build contract for ${organismId}`);
  }
  return defineConnectorContract({
    contractId,
    organismId: organism.id,
    familyId: organism.families[0],
    jurisdiction: organism.jurisdiction,
    epistemicLevel: organism.epistemicLevel,
    accessClass: organism.accessClass,
    freshnessProfile: organism.freshnessProfile,
    ddiDomains: organism.ddiDomains,
    ddiPart: organism.ddiPart,
    payloadSchemaId,
    requiredProvenanceFields: ["organismId", "familyId", "vintageAt", "factoryKey"],
    mode: "RECORDED_ONLY",
    liveFetch: false,
  });
}

export const CONTRACT_ASR_MC = contractFromOrganism(
  "ORG-ASR-MC",
  "maricopa.assessor.recorded.v1",
  SCHEMA_ASR_MC_V1
);

export const CONTRACT_GIS_MC = contractFromOrganism(
  "ORG-GIS-MC",
  "maricopa.gis.recorded.v1",
  SCHEMA_GIS_MC_V1
);

export const CONTRACT_RCR_MC = contractFromOrganism(
  "ORG-RCR-MC",
  "maricopa.recorder.recorded.v1",
  SCHEMA_RCR_MC_V1
);

export const MARICOPA_RECORDED_CONTRACTS = Object.freeze([
  CONTRACT_ASR_MC,
  CONTRACT_GIS_MC,
  CONTRACT_RCR_MC,
]);

/**
 * @param {string} organismId
 */
export function getMaricopaContractByOrganismId(organismId) {
  return (
    MARICOPA_RECORDED_CONTRACTS.find((c) => c.organismId === organismId) ?? null
  );
}

/**
 * @param {string} contractId
 */
export function getMaricopaContractById(contractId) {
  return MARICOPA_RECORDED_CONTRACTS.find((c) => c.contractId === contractId) ?? null;
}

/**
 * PS05-04 — Pima RECORDED_ONLY connector contracts (ASR/GIS).
 * Parallel instance of existing recorded-pack contract architecture (not a fork).
 */

import { getOrganism } from "../sourceOrganismsCatalog.js";
import { defineConnectorContract } from "./connectorContract.js";
import { SCHEMA_ASR_PC_V1, SCHEMA_GIS_PC_V1 } from "./payloadSchemas.js";

function contractFromOrganism(organismId, contractId, payloadSchemaId) {
  const organism = getOrganism(organismId);
  if (!organism || organism.status === "PROHIBITED") {
    throw new Error(`[PS05-04] Cannot build contract for ${organismId}`);
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

export const CONTRACT_ASR_PC = contractFromOrganism(
  "ORG-ASR-PC",
  "pima.assessor.recorded.v1",
  SCHEMA_ASR_PC_V1
);

export const CONTRACT_GIS_PC = contractFromOrganism(
  "ORG-GIS-PC",
  "pima.gis.recorded.v1",
  SCHEMA_GIS_PC_V1
);

export const PIMA_RECORDED_CONTRACTS = Object.freeze([
  CONTRACT_ASR_PC,
  CONTRACT_GIS_PC,
]);

/**
 * @param {string} organismId
 */
export function getPimaContractByOrganismId(organismId) {
  return PIMA_RECORDED_CONTRACTS.find((c) => c.organismId === organismId) ?? null;
}

/**
 * @param {string} contractId
 */
export function getPimaContractById(contractId) {
  return PIMA_RECORDED_CONTRACTS.find((c) => c.contractId === contractId) ?? null;
}

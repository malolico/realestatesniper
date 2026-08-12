/**
 * P-INT-02 Offline — connectors public surface.
 */

export {
  CONNECTOR_MODE_RECORDED_ONLY,
  LIVE_NOT_AUTHORIZED,
  defineConnectorContract,
} from "./connectorContract.js";
export {
  CONTRACT_ASR_MC,
  CONTRACT_GIS_MC,
  CONTRACT_RCR_MC,
  MARICOPA_RECORDED_CONTRACTS,
  getMaricopaContractById,
  getMaricopaContractByOrganismId,
} from "./maricopaConnectorContracts.js";
export {
  CONTRACT_ASR_PC,
  CONTRACT_GIS_PC,
  PIMA_RECORDED_CONTRACTS,
  getPimaContractById,
  getPimaContractByOrganismId,
} from "./pimaConnectorContracts.js";
export {
  SCHEMA_ASR_MC_V1,
  SCHEMA_GIS_MC_V1,
  SCHEMA_RCR_MC_V1,
  SCHEMA_ASR_PC_V1,
  SCHEMA_GIS_PC_V1,
  getPayloadSchema,
  listKnownPayloadSchemaIds,
  validatePayloadAgainstSchema,
} from "./payloadSchemas.js";
export {
  CHECKSUMS_FILENAME,
  readChecksumsAuthority,
  sha256File,
  sha256Hex,
  verifyChecksumsAuthority,
  writeChecksumsAuthority,
} from "./recordedPackChecksums.js";
export {
  getRecordedContractByOrganismId,
  resolveEffectiveVintageAt,
  validateRecordedPack,
} from "./recordedPackValidator.js";
export { loadRecordedPackForIngest } from "./recordedPackLoader.js";
export { offlineIngestFromPack } from "./offlineIngestFromPack.js";
export {
  DEFAULT_SP03_RECORDED_PACK_ROOT,
  resolveDefaultRecordedPackRoot,
  buildRecordedEnrichmentSourceRef,
  loadRecordedPackEnrichment,
  buildFoundationRecordedEnrichmentBundle,
} from "./recordedPackEnrichmentAdapter.js";

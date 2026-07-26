/**
 * P-INT-04 Offline — export module surface
 */

export {
  buildCanonicalPayloadView,
  buildPackageId,
  canonicalizeDecisionPackage,
  computeCanonicalContentChecksum,
} from "./decisionPackageCanonicalize.js";

export {
  ENVELOPE_ALLOWLIST,
  EXPORT_MODE_OFFLINE_LOCAL,
  EXPORT_SCHEMA_VERSION,
  assertEnvelopeAllowlist,
  assertPayloadTopLevelAllowlist,
  buildBoundarySummary,
  formatExportSidecar,
  parseExportSidecar,
  sha256Hex,
  validateExportEnvelope,
  verifyExportArtifactPair,
} from "./decisionPackageIntegrity.js";

export {
  DEFAULT_DECISION_PACKAGE_EXPORT_ROOT,
  LocalDecisionPackageExportStore,
} from "./localDecisionPackageExportStore.js";

/** Plan §20 contract name — same class as LocalDecisionPackageExportStore. */
export { LocalDecisionPackageExportStore as LocalExportPort } from "./localDecisionPackageExportStore.js";

export {
  buildOfflineExportEnvelope,
  detectOrphanElrExports,
  exportOfflineDecisionPackage,
  reconcilePendingElrRef,
} from "./decisionPackageExportService.js";

export {
  DEFAULT_LIVE_MAX_BYTES,
  DecisionPackageLiveSinkPort,
  EXPORT_MODE_LIVE_VERSIONED,
  LIVE_EXPECTED_ALLOWLIST,
  LIVE_PUT_META_ALLOWLIST,
  assertLiveExpectedAllowlist,
  assertLivePutMetaAllowlist,
  buildDecisionPackageConsumerLocator,
  buildRemoteRef,
  buildStableLiveEnvelopeBytes,
  resolveRemoteKey,
  verifyLiveEnvelopeBytes,
} from "./decisionPackageLiveSinkPort.js";

export { InMemoryDecisionPackageLiveSink } from "./inMemoryDecisionPackageLiveSink.js";

export {
  detectOrphanLiveElrExports,
  exportLiveDecisionPackage,
  liveExportMetrics,
  reconcilePendingLiveElrRef,
} from "./decisionPackageLiveExportService.js";
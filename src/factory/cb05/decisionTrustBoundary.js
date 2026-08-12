/**
 * PS05-01 Truth Boundary — Decision trust vocabulary (minimal).
 * Synthetic fixtures remain for explicit test lanes; Decision-trusted consumption is separate.
 */

export const DECISION_TRUST = Object.freeze({
  TRUSTED: "TRUSTED",
  UNTRUSTED: "UNTRUSTED",
  UNAVAILABLE: "UNAVAILABLE",
  UNKNOWN: "UNKNOWN",
  NOT_PROVED: "NOT_PROVED",
});

export const SOURCE_MODE = Object.freeze({
  SYNTHETIC_FIXTURE: "SYNTHETIC_FIXTURE",
  RECORDED_ENRICHMENT: "RECORDED_ENRICHMENT",
  UNAVAILABLE: "UNAVAILABLE",
});

/**
 * @param {object} [options]
 */
export function isDecisionFacingPath(options = {}) {
  return options.decisionFacing === true || options.decisionPath === true;
}

/**
 * @param {object} [options]
 */
export function allowExplicitSynthetic(options = {}) {
  return options.forceSynthetic === true;
}

/**
 * Stub / synthetic business fact markers for motor outputs (PS05-01 marking-only).
 */
export function stubBusinessTrustMeta() {
  return Object.freeze({
    trustClass: "STUB",
    stubBusinessFact: true,
    decisionTrusted: false,
    synthetic: true,
    sourceMode: SOURCE_MODE.SYNTHETIC_FIXTURE,
  });
}

/**
 * @param {string} factoryKey
 * @param {string} reason
 * @param {string} [constitutionalPhase]
 */
export function buildUnavailableSourceBundle(factoryKey, reason, constitutionalPhase = "PS05-01") {
  return Object.freeze({
    factoryKey,
    assessor: null,
    gis: null,
    recorder: null,
    payloadsByOrganism: null,
    synthetic: false,
    recordedOnly: false,
    sourceMode: SOURCE_MODE.UNAVAILABLE,
    trustClass: DECISION_TRUST.UNAVAILABLE,
    decisionTrusted: false,
    recordedSkippedReason: reason,
    constitutionalPhase,
    livingIntelligenceProved: false,
  });
}

/**
 * Inspect ELR / motor manifests for Decision-trust contamination.
 * @param {object} elr
 * @param {{ motors?: Record<string, object|null> }} [slices]
 */
export function evaluateDecisionTrustContamination(elr, slices = {}) {
  const reasons = [];
  const manifests = elr?.motor_manifests ?? [];

  for (const m of manifests) {
    const outputs = m?.outputs ?? m ?? {};
    const delta = m?.knowledgeDelta ?? outputs.knowledgeDelta ?? null;
    if (outputs.synthetic === true || outputs.sourceMode === SOURCE_MODE.SYNTHETIC_FIXTURE) {
      reasons.push(`manifest_synthetic:${m.motorId ?? m.kind ?? "unknown"}`);
    }
    if (outputs.trustClass === "STUB" || outputs.stubBusinessFact === true) {
      reasons.push(`manifest_stub:${m.motorId ?? "unknown"}`);
    }
    if (outputs.sourceMode === SOURCE_MODE.UNAVAILABLE || outputs.trustClass === DECISION_TRUST.UNAVAILABLE) {
      reasons.push(`manifest_unavailable:${m.motorId ?? "unknown"}`);
    }
    if (
      delta?.synthetic === true ||
      delta?.stubBusinessFact === true ||
      delta?.trustClass === "STUB" ||
      delta?.sourceMode === SOURCE_MODE.SYNTHETIC_FIXTURE
    ) {
      reasons.push(`knowledge_synthetic_or_stub:${m.motorId ?? delta?.motorId ?? "unknown"}`);
    }
    if (delta?.financial === "stub" || delta?.mortgage === "stub" || delta?.permits === "stub") {
      reasons.push(`knowledge_stub:${m.motorId ?? delta?.motorId ?? "unknown"}`);
    }
    if (typeof outputs.sourceMode === "string" && outputs.sourceMode.includes("stub")) {
      reasons.push(`sourceMode_stub:${m.motorId ?? "unknown"}`);
    }
  }

  for (const [motorId, slice] of Object.entries(slices.motors ?? {})) {
    const outputs = slice?.outputs ?? {};
    if (outputs.synthetic === true || outputs.trustClass === "STUB" || outputs.stubBusinessFact === true) {
      reasons.push(`slice_stub_or_synthetic:${motorId}`);
    }
    if (outputs.sourceMode === SOURCE_MODE.SYNTHETIC_FIXTURE) {
      reasons.push(`slice_synthetic:${motorId}`);
    }
    if (outputs.sourceMode === SOURCE_MODE.UNAVAILABLE) {
      reasons.push(`slice_unavailable:${motorId}`);
    }
  }

  const unique = [...new Set(reasons)];
  const contaminated = unique.length > 0;
  return Object.freeze({
    status: contaminated ? DECISION_TRUST.UNTRUSTED : DECISION_TRUST.TRUSTED,
    contaminated,
    reasons: Object.freeze(unique),
    decisionTrusted: !contaminated,
    rule: "PS05-01-TruthBoundary",
  });
}

/**
 * @param {object} trust
 */
export function isDecisionPackageTrusted(trust) {
  return trust?.status === DECISION_TRUST.TRUSTED && trust?.decisionTrusted === true;
}

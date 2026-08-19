/**
 * SP11-P1-A — LIVE Observation V1 (CB-02 Discovery)
 * Sibling LIVE observation contract — identity / time / fingerprint / local signal wrapper.
 * Zero-network. No HTTP. No token. No SP10 recorded identity helpers.
 */

import { sha256Hex } from "../connectors/recordedPackChecksums.js";
import { computeDiscoveryDedupKey } from "./recordedObservationContract.js";

export const LIVE_OBSERVATION_SCHEMA_ID = "rsn.cb02.discovery.liveObservation.v1";
export const LIVE_OBSERVATION_SCHEMA_VERSION = 1;
export const LIVE_SOURCE_MODE = "LIVE";
export const LIVE_FETCH = true;
export const LIVE_ORGANISM_ID = "ORG-ASR-MC";
export const LIVE_FAMILY_ID = "REGISTRAL_ASSESSOR";
export const LIVE_PAYLOAD_SCHEMA_ID = "maricopa.assessor.payload.v1";
export const LIVE_UNKNOWN_OBSERVED_AT = "UNKNOWN";

export const LIVE_OBSERVATION_AUTHORITY = Object.freeze({
  isEvidence: false,
  isFact: false,
  isSignal: false,
  isCandidate: false,
  isDecision: false,
  isOpportunity: false,
  isProduct: false,
  isResearchAction: false,
  evidenceAuthority: "CB-06",
  liveObservationIsNotEvidence: true,
  liveFetch: true,
  sourceMode: "LIVE",
});

export const LIVE_SIGNAL_AUTHORITY = Object.freeze({
  isEvidence: false,
  isFact: false,
  isCandidate: false,
  isDecision: false,
  isOpportunity: false,
  isProduct: false,
  isResearchAction: false,
  evidenceAuthority: "CB-06",
  signalIsNotEvidence: true,
  liveFetch: true,
  sourceMode: "LIVE",
});

const ISO_8601_DATE_TIME =
  /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(\.\d+)?(Z|[+-]\d{2}:\d{2})$/;

/**
 * @param {unknown} value
 */
export function isIso8601DateTime(value) {
  if (typeof value !== "string" || !value.trim()) return false;
  if (!ISO_8601_DATE_TIME.test(value)) return false;
  return Number.isFinite(Date.parse(value));
}

/**
 * Deterministic APN token: uppercase, non-alphanumeric characters removed.
 * @param {unknown} rawApn
 */
export function buildLiveApnToken(rawApn) {
  return String(rawApn ?? "")
    .toUpperCase()
    .replace(/[^A-Z0-9]/g, "");
}

/**
 * @param {string} apnToken
 * @param {string} [organismId]
 */
export function buildLiveObservationId(apnToken, organismId = LIVE_ORGANISM_ID) {
  return `live-${organismId}-${apnToken}`;
}

/**
 * @param {string} apnToken
 * @param {string} [organismId]
 */
export function buildLiveCandidateRef(apnToken, organismId = LIVE_ORGANISM_ID) {
  return buildLiveObservationId(apnToken, organismId);
}

/**
 * Source timestamp when explicitly available; otherwise literal UNKNOWN.
 * Factory receipt time must never masquerade as observedAt.
 *
 * @param {unknown} sourceObservedAt
 * @param {unknown} receivedAt
 * @returns {{ ok: true, value: string } | { ok: false, reason: string }}
 */
export function resolveLiveObservedAt(sourceObservedAt, receivedAt) {
  if (sourceObservedAt == null || sourceObservedAt === "") {
    return { ok: true, value: LIVE_UNKNOWN_OBSERVED_AT };
  }
  if (sourceObservedAt === LIVE_UNKNOWN_OBSERVED_AT) {
    return { ok: true, value: LIVE_UNKNOWN_OBSERVED_AT };
  }
  if (typeof sourceObservedAt !== "string") {
    return { ok: false, reason: "observedAt_invalid" };
  }
  if (receivedAt != null && sourceObservedAt === receivedAt) {
    return { ok: false, reason: "receivedAt_used_as_observedAt" };
  }
  if (!isIso8601DateTime(sourceObservedAt)) {
    return { ok: false, reason: "observedAt_invalid" };
  }
  return { ok: true, value: sourceObservedAt };
}

/**
 * @param {unknown} value
 */
function stableSerialize(value) {
  if (value === null || typeof value !== "object") {
    return value;
  }
  if (Array.isArray(value)) {
    return value.map(stableSerialize);
  }
  const out = {};
  for (const key of Object.keys(value).sort()) {
    out[key] = stableSerialize(value[key]);
  }
  return out;
}

/**
 * Deterministic SHA-256 of stable payload serialization.
 * @param {unknown} payload
 */
export function computeLivePayloadFingerprint(payload) {
  return sha256Hex(JSON.stringify(stableSerialize(payload ?? {})));
}

/**
 * LIVE signal wrapper — local to this module.
 * Carries receivedAt. Does not populate recordedAt.
 *
 * @param {{
 *   observationId: string,
 *   candidateRef: string,
 *   dedupKey: string,
 *   signalId: string,
 *   candidateId: string,
 *   sourceIdentity: object,
 *   receivedAt: string,
 *   observedAt: string,
 *   payloadFingerprint: string,
 * }} observation
 */
export function wrapLiveDiscoverySignal(observation) {
  return Object.freeze({
    observationId: observation.observationId,
    candidateRef: observation.candidateRef,
    signalId: observation.signalId,
    candidateId: observation.candidateId,
    dedupKey: observation.dedupKey,
    sourceMode: LIVE_SOURCE_MODE,
    liveFetch: LIVE_FETCH,
    sourceIdentity: Object.freeze({ ...observation.sourceIdentity }),
    receivedAt: observation.receivedAt,
    observedAt: observation.observedAt,
    payloadFingerprint: observation.payloadFingerprint,
    authority: LIVE_SIGNAL_AUTHORITY,
  });
}

/**
 * @param {{
 *   apn?: unknown,
 *   rawApn?: unknown,
 *   receivedAt?: unknown,
 *   observedAt?: unknown,
 *   payload?: unknown,
 * }} [input]
 * @returns {{
 *   ok: true,
 *   observation: object,
 *   signal: object,
 * } | { ok: false, reason: string }}
 */
export function buildLiveObservation(input = {}) {
  if (input.receivedAt == null || input.receivedAt === "") {
    return { ok: false, reason: "receivedAt_required" };
  }
  if (!isIso8601DateTime(input.receivedAt)) {
    return { ok: false, reason: "receivedAt_invalid" };
  }

  const apnToken = buildLiveApnToken(input.apn ?? input.rawApn);
  if (!apnToken) {
    return { ok: false, reason: "apnToken_empty" };
  }

  const observationId = buildLiveObservationId(apnToken);
  const candidateRef = buildLiveCandidateRef(apnToken);
  if (observationId.startsWith("disc-") || candidateRef.startsWith("disc-")) {
    return { ok: false, reason: "namespace_forbidden" };
  }
  if (candidateRef !== observationId) {
    return { ok: false, reason: "candidateRef_mismatch" };
  }

  const observed = resolveLiveObservedAt(input.observedAt, input.receivedAt);
  if (!observed.ok) {
    return observed;
  }

  const payload =
    input.payload && typeof input.payload === "object" && !Array.isArray(input.payload)
      ? input.payload
      : {};
  const payloadFingerprint = computeLivePayloadFingerprint(payload);
  const sourceIdentity = Object.freeze({
    organismId: LIVE_ORGANISM_ID,
    familyId: LIVE_FAMILY_ID,
    payloadSchemaId: LIVE_PAYLOAD_SCHEMA_ID,
  });

  const dedupKey = computeDiscoveryDedupKey({
    observationId,
    sourceIdentity,
    payloadFingerprint,
    observedAt: observed.value,
  });

  const observation = Object.freeze({
    schemaId: LIVE_OBSERVATION_SCHEMA_ID,
    schemaVersion: LIVE_OBSERVATION_SCHEMA_VERSION,
    sourceMode: LIVE_SOURCE_MODE,
    liveFetch: LIVE_FETCH,
    observationId,
    candidateRef,
    apnToken,
    receivedAt: input.receivedAt,
    observedAt: observed.value,
    payloadFingerprint,
    sourceIdentity,
    payload: Object.freeze(JSON.parse(JSON.stringify(payload))),
    dedupKey,
    signalId: dedupKey,
    candidateId: dedupKey,
    authority: LIVE_OBSERVATION_AUTHORITY,
  });

  return Object.freeze({
    ok: true,
    observation,
    signal: wrapLiveDiscoverySignal(observation),
  });
}

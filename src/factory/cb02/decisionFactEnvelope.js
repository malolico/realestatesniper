/**
 * PS05-03 — Decision fact envelope (provenance + type + conflict + freshness + status).
 * Reuses SourceRef linkage; does not invent timestamps or provenance.
 */

import { evaluateFreshness } from "./freshnessPolicy.js";
import { SOURCE_MODE } from "../cb05/decisionTrustBoundary.js";

export const FACT_TYPE = Object.freeze({
  OBSERVED: "OBSERVED",
  DERIVED: "DERIVED",
  ESTIMATED: "ESTIMATED",
  UNKNOWN: "UNKNOWN",
  CONFLICTING: "CONFLICTING",
  STALE: "STALE",
  SYNTHETIC: "SYNTHETIC",
  STUB: "STUB",
});

export const CONFLICT_STATE = Object.freeze({
  NONE: "NONE",
  OPEN: "OPEN",
  RESOLVED_WITH_AUTHORITY: "RESOLVED_WITH_AUTHORITY",
});

export const FRESHNESS_STATE = Object.freeze({
  CURRENT: "CURRENT",
  STALE: "STALE",
  UNKNOWN_FRESHNESS: "UNKNOWN_FRESHNESS",
});

export const FACT_STATUS = Object.freeze({
  FOUND: "FOUND",
  UNKNOWN: "UNKNOWN",
  UNAVAILABLE: "UNAVAILABLE",
  CONFLICTING: "CONFLICTING",
  STALE: "STALE",
  DERIVED: "DERIVED",
  ESTIMATED: "ESTIMATED",
});

/**
 * Map freshnessPolicy evaluateFreshness → Decision-facing freshness state.
 * Missing / unknown vintage must NOT become CURRENT.
 *
 * @param {object|null|undefined} freshnessResult
 * @param {string|null|undefined} vintageAt
 */
export function mapFreshnessState(freshnessResult, vintageAt = null) {
  if (
    vintageAt == null ||
    vintageAt === "" ||
    (typeof vintageAt === "string" && Number.isNaN(new Date(vintageAt).getTime()))
  ) {
    return FRESHNESS_STATE.UNKNOWN_FRESHNESS;
  }
  if (!freshnessResult || typeof freshnessResult !== "object") {
    return FRESHNESS_STATE.UNKNOWN_FRESHNESS;
  }
  if (
    freshnessResult.reason === "missing_vintage" ||
    freshnessResult.reason === "unknown_profile"
  ) {
    return FRESHNESS_STATE.UNKNOWN_FRESHNESS;
  }
  if (freshnessResult.fresh === true && freshnessResult.degraded !== true) {
    return FRESHNESS_STATE.CURRENT;
  }
  if (freshnessResult.degraded === true || freshnessResult.fresh === false) {
    return FRESHNESS_STATE.STALE;
  }
  return FRESHNESS_STATE.UNKNOWN_FRESHNESS;
}

/**
 * Evaluate freshness state from profile + vintage (null-honest).
 * @param {string|null|undefined} profileKey
 * @param {string|null|undefined} vintageAt
 */
export function resolveFreshnessState(profileKey, vintageAt) {
  if (!profileKey || !vintageAt) {
    return Object.freeze({
      freshnessState: FRESHNESS_STATE.UNKNOWN_FRESHNESS,
      freshnessResult: null,
    });
  }
  const freshnessResult = evaluateFreshness(profileKey, vintageAt);
  return Object.freeze({
    freshnessState: mapFreshnessState(freshnessResult, vintageAt),
    freshnessResult: Object.freeze({ ...freshnessResult }),
  });
}

/**
 * Build a Decision-facing fact envelope. Does not invent provenance or timestamps.
 *
 * @param {{
 *   factId?: string|null,
 *   factClass: string,
 *   value?: unknown,
 *   factType?: string,
 *   sourceRefId?: string|null,
 *   organismId?: string|null,
 *   jurisdiction?: object|null,
 *   rawRecordRef?: object|null,
 *   acquiredAt?: string|null,
 *   vintageAt?: string|null,
 *   effectiveAt?: string|null,
 *   recordedAt?: string|null,
 *   derivationRef?: object|null,
 *   trustMeta?: object|null,
 *   conflictState?: string,
 *   conflictRef?: object|null,
 *   freshnessState?: string|null,
 *   freshnessProfileKey?: string|null,
 *   status?: string|null,
 * }} input
 */
export function buildDecisionFactEnvelope(input) {
  if (!input || typeof input.factClass !== "string" || !input.factClass.trim()) {
    throw new Error("decisionFactEnvelope: factClass required");
  }

  const trustMeta = normalizeTrustMeta(input.trustMeta);
  let factType = input.factType ?? FACT_TYPE.OBSERVED;
  if (trustMeta.synthetic === true) factType = FACT_TYPE.SYNTHETIC;
  else if (trustMeta.stubBusinessFact === true) factType = FACT_TYPE.STUB;

  const conflictState = input.conflictState ?? CONFLICT_STATE.NONE;

  let freshnessState = input.freshnessState ?? null;
  let freshnessResult = null;
  if (!freshnessState) {
    const resolved = resolveFreshnessState(input.freshnessProfileKey, input.vintageAt);
    freshnessState = resolved.freshnessState;
    freshnessResult = resolved.freshnessResult;
  }

  let status = input.status ?? null;
  if (!status) {
    status = deriveStatusFromType(factType, conflictState, freshnessState, input.value);
  }

  if (freshnessState === FRESHNESS_STATE.STALE && status === FACT_STATUS.FOUND) {
    status = FACT_STATUS.STALE;
  }
  if (conflictState === CONFLICT_STATE.OPEN) {
    status = FACT_STATUS.CONFLICTING;
    if (factType === FACT_TYPE.OBSERVED) factType = FACT_TYPE.CONFLICTING;
  }

  const decisionTrusted =
    trustMeta.decisionTrusted === true &&
    factType !== FACT_TYPE.SYNTHETIC &&
    factType !== FACT_TYPE.STUB &&
    trustMeta.synthetic !== true;

  return Object.freeze({
    schemaId: "rsn.decision.fact.envelope.v1",
    factId: input.factId ?? null,
    factClass: input.factClass.trim(),
    value: input.value !== undefined ? input.value : null,
    factType,
    sourceRefId: input.sourceRefId ?? null,
    organismId: input.organismId ?? null,
    jurisdiction: input.jurisdiction ?? null,
    rawRecordRef: input.rawRecordRef ?? null,
    acquiredAt: input.acquiredAt ?? null,
    vintageAt: input.vintageAt ?? null,
    effectiveAt: input.effectiveAt ?? null,
    recordedAt: input.recordedAt ?? null,
    derivationRef: input.derivationRef ?? null,
    trustMeta: Object.freeze({ ...trustMeta, decisionTrusted }),
    conflictState,
    conflictRef: input.conflictRef ?? null,
    freshnessState,
    freshnessResult,
    status,
    constitutionalPhase: "PS05-03",
  });
}

/**
 * @param {object|null|undefined} trustMeta
 */
function normalizeTrustMeta(trustMeta = {}) {
  const synthetic = trustMeta?.synthetic === true;
  const unavailable = trustMeta?.sourceMode === SOURCE_MODE.UNAVAILABLE;
  return Object.freeze({
    sourceMode:
      trustMeta?.sourceMode ??
      (synthetic ? SOURCE_MODE.SYNTHETIC_FIXTURE : SOURCE_MODE.RECORDED_ENRICHMENT),
    synthetic,
    stubBusinessFact: trustMeta?.stubBusinessFact === true || synthetic,
    decisionTrusted:
      trustMeta?.decisionTrusted === true && !synthetic && !unavailable ? true : false,
    trustClass:
      trustMeta?.trustClass ??
      (unavailable ? "UNAVAILABLE" : synthetic ? "STUB" : "TRUSTED"),
  });
}

/**
 * @param {string} factType
 * @param {string} conflictState
 * @param {string} freshnessState
 * @param {unknown} value
 */
function deriveStatusFromType(factType, conflictState, freshnessState, value) {
  if (conflictState === CONFLICT_STATE.OPEN) return FACT_STATUS.CONFLICTING;
  if (factType === FACT_TYPE.UNKNOWN) return FACT_STATUS.UNKNOWN;
  if (factType === FACT_TYPE.CONFLICTING) return FACT_STATUS.CONFLICTING;
  if (factType === FACT_TYPE.STALE || freshnessState === FRESHNESS_STATE.STALE) {
    return FACT_STATUS.STALE;
  }
  if (factType === FACT_TYPE.DERIVED) return FACT_STATUS.DERIVED;
  if (factType === FACT_TYPE.ESTIMATED) return FACT_STATUS.ESTIMATED;
  if (value == null && factType !== FACT_TYPE.SYNTHETIC && factType !== FACT_TYPE.STUB) {
    return FACT_STATUS.UNKNOWN;
  }
  return FACT_STATUS.FOUND;
}

/**
 * Build UNKNOWN envelope for a missing expected fact (no invented value).
 * @param {string} factClass
 * @param {{ reason?: string, factoryKey?: string }} [opts]
 */
export function buildUnknownFactEnvelope(factClass, opts = {}) {
  return buildDecisionFactEnvelope({
    factId: opts.factoryKey ? `${opts.factoryKey}:${factClass}:unknown` : null,
    factClass,
    value: null,
    factType: FACT_TYPE.UNKNOWN,
    status: FACT_STATUS.UNKNOWN,
    freshnessState: FRESHNESS_STATE.UNKNOWN_FRESHNESS,
    trustMeta: {
      decisionTrusted: false,
      synthetic: false,
      stubBusinessFact: false,
      sourceMode: SOURCE_MODE.UNAVAILABLE,
      trustClass: "UNAVAILABLE",
    },
    conflictState: CONFLICT_STATE.NONE,
    rawRecordRef: opts.reason ? { reason: opts.reason } : null,
  });
}

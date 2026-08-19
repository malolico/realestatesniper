/**
 * SP11-P1-C — Bounded Maricopa Assessor LIVE client (CB-02)
 * Guard-gated · injectable transport · zero-network by default.
 * Never calls global fetch. No token persistence/logging. No observedAt fabrication.
 */

import {
  DEFAULT_LIVE_AUTHORIZATION_ENVELOPE,
  LIVE_EXECUTION_NOT_AUTHORIZED,
  LIVE_HTTP_FORBIDDEN,
  gateLiveTransport,
} from "./liveExecutionGuard.js";
import { isIso8601DateTime } from "./liveObservationContract.js";

export const MARICOPA_ASSESSOR_ORGANISM_ID = "ORG-ASR-MC";
export const MARICOPA_ASSESSOR_FAMILY_ID = "REGISTRAL_ASSESSOR";
export const MARICOPA_ASSESSOR_HOST = "mcassessor.maricopa.gov";
export const MARICOPA_ASSESSOR_METHOD = "GET";

/** Implementation bounds only — not freeze-specified numeric contracts. */
const IMPLEMENTATION_TIMEOUT_MS = 5000;
const IMPLEMENTATION_MAX_RESPONSE_BYTES = 65536;

export const P1C_IMPLEMENTATION_BOUNDS = Object.freeze({
  timeoutMs: IMPLEMENTATION_TIMEOUT_MS,
  maxResponseBytes: IMPLEMENTATION_MAX_RESPONSE_BYTES,
  freezeSpecified: false,
});

/**
 * @param {unknown} rawApn
 */
function boundedApnSegment(rawApn) {
  const apn = String(rawApn ?? "").trim();
  if (!apn) return null;
  if (apn.length > 64) return null;
  if (/[/?#]/.test(apn)) return null;
  return apn;
}

/**
 * @param {unknown} value
 */
function byteLength(value) {
  if (typeof value !== "string") return 0;
  return new TextEncoder().encode(value).length;
}

/**
 * @param {string} reason
 * @param {object} [extra]
 */
function failClosed(reason, extra = {}) {
  return Object.freeze({
    ok: false,
    reason,
    code: extra.code ?? null,
    retryCount: 0,
    request: extra.request ?? null,
    receivedAt: null,
    organismId: MARICOPA_ASSESSOR_ORGANISM_ID,
    familyId: MARICOPA_ASSESSOR_FAMILY_ID,
  });
}

/**
 * Interpret an injected stub result. Never follows redirects. Never retries.
 *
 * @param {unknown} raw
 * @param {object} request
 */
function interpretInjectedResponse(raw, request) {
  if (raw && typeof raw === "object" && (raw.timeout === true || raw.aborted === true)) {
    return failClosed("timeout", { request });
  }
  if (raw && typeof raw === "object" && raw.error) {
    return failClosed("transport_exception", { request });
  }
  if (!raw || typeof raw !== "object") {
    return failClosed("transport_exception", { request });
  }

  if (raw.redirected === true) {
    return failClosed("redirect", { request });
  }
  const status = Number(raw.status);
  if (Number.isFinite(status) && status >= 300 && status < 400) {
    return failClosed("redirect", { request });
  }
  if (status === 401) return failClosed("status_401", { request });
  if (status === 403) return failClosed("status_403", { request });
  if (status === 429) return failClosed("status_429", { request });
  if (!Number.isFinite(status) || status < 200 || status >= 300) {
    return failClosed("non_2xx", { request });
  }

  const contentType = String(raw.contentType ?? "");
  if (!/application\/json/i.test(contentType)) {
    return failClosed("content_type", { request });
  }

  const bodyText = typeof raw.body === "string" ? raw.body : "";
  if (byteLength(bodyText) > IMPLEMENTATION_MAX_RESPONSE_BYTES) {
    return failClosed("oversized", { request });
  }

  let parsed;
  try {
    parsed = JSON.parse(bodyText);
  } catch {
    return failClosed("malformed_json", { request });
  }
  if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) {
    return failClosed("malformed_json", { request });
  }

  const receivedAt = new Date().toISOString();
  if (!isIso8601DateTime(receivedAt)) {
    return failClosed("receivedAt_invalid", { request });
  }

  return Object.freeze({
    ok: true,
    retryCount: 0,
    request,
    status,
    contentType,
    body: parsed,
    receivedAt,
    organismId: MARICOPA_ASSESSOR_ORGANISM_ID,
    familyId: MARICOPA_ASSESSOR_FAMILY_ID,
  });
}

/**
 * Bounded Assessor LIVE client. Guard first. Injected transport only.
 * Mechanically unable to perform a real Assessor GET (never uses global fetch).
 *
 * @param {{
 *   envelope?: object,
 *   apn?: unknown,
 * }} [input]
 * @param {{
 *   transport?: (request: object) => object,
 * }} [deps]
 */
export function fetchMaricopaAssessorParcel(input = {}, deps = {}) {
  const envelope = input.envelope ?? DEFAULT_LIVE_AUTHORIZATION_ENVELOPE;
  const injected = deps.transport;

  const gated = gateLiveTransport(envelope, (request) => {
    const apn = boundedApnSegment(request?.apn ?? input.apn);
    if (!apn) {
      return failClosed("apn_invalid");
    }
    const path = `/parcel/${apn}`;
    const constructed = Object.freeze({
      method: MARICOPA_ASSESSOR_METHOD,
      host: MARICOPA_ASSESSOR_HOST,
      path,
      url: `https://${MARICOPA_ASSESSOR_HOST}${path}`,
      redirect: "manual",
      retryCount: 0,
    });
    if (typeof injected !== "function") {
      return failClosed(LIVE_HTTP_FORBIDDEN, {
        code: LIVE_HTTP_FORBIDDEN,
        request: constructed,
      });
    }
    try {
      const raw = injected(constructed);
      return interpretInjectedResponse(raw, constructed);
    } catch {
      return failClosed("transport_exception", { request: constructed });
    }
  }, { apn: input.apn });

  if (!gated.ok) {
    return failClosed(gated.reason ?? LIVE_EXECUTION_NOT_AUTHORIZED, {
      code: gated.code ?? LIVE_HTTP_FORBIDDEN,
    });
  }
  return gated.result;
}

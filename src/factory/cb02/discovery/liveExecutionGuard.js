/**
 * SP11-P1-A — LIVE execution guard (CB-02 Discovery)
 * Fail-closed authorization envelope. Pre-transport gate. Zero-network.
 * No HTTP. No token values. Transport callback is invoked only after the wall passes.
 */

export const LIVE_EXECUTION_NOT_AUTHORIZED = "LIVE_EXECUTION_NOT_AUTHORIZED";
export const LIVE_HTTP_FORBIDDEN = "LIVE_HTTP_FORBIDDEN";

export const DEFAULT_LIVE_AUTHORIZATION_ENVELOPE = Object.freeze({
  tokenAvailable: false,
  tokenExternalToRepo: false,
  directorLiveExecutionApproval: false,
});

/**
 * @param {{
 *   tokenAvailable?: boolean,
 *   tokenExternalToRepo?: boolean,
 *   directorLiveExecutionApproval?: boolean,
 * } | null | undefined} envelope
 */
export function isLiveExecutionAuthorized(envelope) {
  return (
    envelope?.tokenAvailable === true &&
    envelope?.tokenExternalToRepo === true &&
    envelope?.directorLiveExecutionApproval === true
  );
}

/**
 * Fail-closed pre-transport gate.
 * Incomplete wall → refuse and NEVER invoke transport.
 * Complete wall → may invoke the injected stub only. This module never performs HTTP.
 *
 * @param {{
 *   tokenAvailable?: boolean,
 *   tokenExternalToRepo?: boolean,
 *   directorLiveExecutionApproval?: boolean,
 * }} [envelope]
 * @param {((request?: unknown) => unknown) | null | undefined} [transport]
 * @param {unknown} [request]
 * @returns {{
 *   ok: boolean,
 *   authorized: boolean,
 *   reason?: string,
 *   code?: string,
 *   liveHttp: string,
 *   result?: unknown,
 * }}
 */
export function gateLiveTransport(
  envelope = DEFAULT_LIVE_AUTHORIZATION_ENVELOPE,
  transport,
  request
) {
  if (!isLiveExecutionAuthorized(envelope)) {
    return Object.freeze({
      ok: false,
      authorized: false,
      reason: LIVE_EXECUTION_NOT_AUTHORIZED,
      code: LIVE_HTTP_FORBIDDEN,
      liveHttp: LIVE_HTTP_FORBIDDEN,
    });
  }

  if (typeof transport !== "function") {
    return Object.freeze({
      ok: false,
      authorized: true,
      reason: LIVE_HTTP_FORBIDDEN,
      code: LIVE_HTTP_FORBIDDEN,
      liveHttp: LIVE_HTTP_FORBIDDEN,
    });
  }

  const result = transport(request);
  return Object.freeze({
    ok: true,
    authorized: true,
    liveHttp: LIVE_HTTP_FORBIDDEN,
    result,
  });
}

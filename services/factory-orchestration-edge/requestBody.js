/**
 * P-INT-01 Slice B / HQ-06 — Request body transport helpers (staging).
 * Fail-closed Content-Type, size, and entity presence checks before business logic.
 */

import {
  FACTORY_ORCHESTRATION_ERROR_CODES,
  FACTORY_ORCHESTRATION_MAX_BODY_BYTES,
} from "./contract.js";

/**
 * True when Content-Type is application/json with no charset or UTF-8 charset only.
 * @param {unknown} headerValue
 * @returns {boolean}
 */
export function isCompatibleJsonContentType(headerValue) {
  if (typeof headerValue !== "string") return false;
  const raw = headerValue.trim();
  if (!raw) return false;
  const parts = raw.split(";").map((p) => p.trim()).filter(Boolean);
  if (parts.length === 0) return false;
  if (parts[0].toLowerCase() !== "application/json") return false;
  for (let i = 1; i < parts.length; i += 1) {
    const param = parts[i];
    const eq = param.indexOf("=");
    if (eq <= 0) return false;
    const key = param.slice(0, eq).trim().toLowerCase();
    let value = param.slice(eq + 1).trim();
    if (value.startsWith('"') && value.endsWith('"') && value.length >= 2) {
      value = value.slice(1, -1);
    }
    if (key !== "charset") return false;
    const charset = value.toLowerCase();
    if (charset !== "utf-8" && charset !== "utf8") return false;
  }
  return true;
}

/**
 * @param {unknown} bodyText
 * @returns {{ ok: true, byteLength: number } | { ok: false, code: string, message: string }}
 */
export function assertRequestBodyWithinLimit(bodyText) {
  const text = typeof bodyText === "string" ? bodyText : "";
  const byteLength = Buffer.byteLength(text, "utf8");
  if (byteLength > FACTORY_ORCHESTRATION_MAX_BODY_BYTES) {
    return {
      ok: false,
      code: FACTORY_ORCHESTRATION_ERROR_CODES.PAYLOAD_TOO_LARGE,
      message: "payload too large",
    };
  }
  return { ok: true, byteLength };
}

/**
 * Entity present for Content-Type / cancel non-empty rules (trim-aware).
 * @param {unknown} bodyText
 * @returns {boolean}
 */
export function hasNonEmptyRequestBody(bodyText) {
  return typeof bodyText === "string" && bodyText.trim().length > 0;
}

/**
 * Collect request entity with hard byte cap (inclusive max). Oversized → reject.
 * @param {import('node:http').IncomingMessage} req
 * @param {number} [maxBytes]
 * @returns {Promise<string>}
 */
export function collectBodyBounded(req, maxBytes = FACTORY_ORCHESTRATION_MAX_BODY_BYTES) {
  return new Promise((resolve, reject) => {
    const chunks = [];
    let size = 0;
    let settled = false;
    let oversized = false;

    const fail = (err) => {
      if (settled) return;
      settled = true;
      reject(err);
    };
    const ok = (value) => {
      if (settled) return;
      settled = true;
      resolve(value);
    };

    req.on("data", (chunk) => {
      if (settled) return;
      const buf = Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk);
      if (oversized) {
        return;
      }
      size += buf.length;
      if (size > maxBytes) {
        oversized = true;
        chunks.length = 0;
        return;
      }
      chunks.push(buf);
    });
    req.on("end", () => {
      if (settled) return;
      if (oversized) {
        const err = new Error("payload too large");
        err.code = FACTORY_ORCHESTRATION_ERROR_CODES.PAYLOAD_TOO_LARGE;
        fail(err);
        return;
      }
      ok(Buffer.concat(chunks).toString("utf8"));
    });
    req.on("error", (err) => {
      if (settled) return;
      fail(err);
    });
  });
}

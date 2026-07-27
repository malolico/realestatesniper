/**
 * P-INT-01 Slice B1 — Idempotency contract (REQUIRED Idempotency-Key on submit).
 */

import { FACTORY_ORCHESTRATION_ERROR_CODES } from "./contract.js";

export const IDEMPOTENCY_HEADER_NAME = "Idempotency-Key";

/** Max length per Plan §5.6. */
export const IDEMPOTENCY_KEY_MAX_LENGTH = 128;

/** Charset allowlist: [A-Za-z0-9._:-] */
export const IDEMPOTENCY_KEY_PATTERN = /^[A-Za-z0-9._:-]+$/;

/**
 * Validate header Idempotency-Key value.
 * @param {unknown} value
 * @returns {{ ok: true, key: string } | { ok: false, code: string, message: string }}
 */
export function validateIdempotencyKey(value) {
  if (value == null || value === "") {
    return {
      ok: false,
      code: FACTORY_ORCHESTRATION_ERROR_CODES.VALIDATION_FAIL,
      message: "Idempotency-Key header is REQUIRED",
    };
  }
  if (typeof value !== "string") {
    return {
      ok: false,
      code: FACTORY_ORCHESTRATION_ERROR_CODES.VALIDATION_FAIL,
      message: "Idempotency-Key must be a string",
    };
  }
  if (value.length > IDEMPOTENCY_KEY_MAX_LENGTH) {
    return {
      ok: false,
      code: FACTORY_ORCHESTRATION_ERROR_CODES.VALIDATION_FAIL,
      message: `Idempotency-Key exceeds ${IDEMPOTENCY_KEY_MAX_LENGTH} characters`,
    };
  }
  if (!IDEMPOTENCY_KEY_PATTERN.test(value)) {
    return {
      ok: false,
      code: FACTORY_ORCHESTRATION_ERROR_CODES.VALIDATION_FAIL,
      message: "Idempotency-Key charset must match [A-Za-z0-9._:-]",
    };
  }
  return { ok: true, key: value };
}

/**
 * Body `idempotencyKey` is optional; if present MUST equal header.
 * @param {string} headerKey
 * @param {unknown} bodyKey
 */
export function validateIdempotencyBodyMirror(headerKey, bodyKey) {
  if (bodyKey === undefined || bodyKey === null) {
    return { ok: true, key: headerKey };
  }
  if (typeof bodyKey !== "string") {
    return {
      ok: false,
      code: FACTORY_ORCHESTRATION_ERROR_CODES.VALIDATION_FAIL,
      message: "body idempotencyKey must be a string when present",
    };
  }
  if (bodyKey !== headerKey) {
    return {
      ok: false,
      code: FACTORY_ORCHESTRATION_ERROR_CODES.VALIDATION_FAIL,
      message: "body idempotencyKey MUST equal Idempotency-Key header",
    };
  }
  return { ok: true, key: headerKey };
}

/**
 * Idempotency identity tuple for at-most-once enqueue (contract semantics).
 * @param {{ actorId: string, factoryKey: string, command: string, idempotencyKey: string }} parts
 */
export function buildIdempotencyIdentity(parts) {
  return Object.freeze({
    actorId: parts.actorId,
    factoryKey: parts.factoryKey,
    command: parts.command,
    idempotencyKey: parts.idempotencyKey,
  });
}

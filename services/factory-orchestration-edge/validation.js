/**
 * P-INT-01 Slice B1 — Validation contracts for submit body and allowlists.
 */

import {
  FACTORY_ORCHESTRATION_COMMANDS,
  FACTORY_ORCHESTRATION_ERROR_CODES,
  FACTORY_ORCHESTRATION_HINTS_ALLOWLIST,
  FACTORY_ORCHESTRATION_LINEAGE_SUMMARY_ALLOWLIST,
  FACTORY_ORCHESTRATION_RESULT_SUMMARY_ALLOWLIST,
} from "./contract.js";
import { validateIdempotencyBodyMirror, validateIdempotencyKey } from "./idempotency.js";

/**
 * @param {unknown} body
 * @param {unknown} idempotencyHeaderValue
 * @returns {{ ok: true, value: object } | { ok: false, code: string, message: string }}
 */
export function validateOrchestrateSubmitBody(body, idempotencyHeaderValue) {
  const idemp = validateIdempotencyKey(idempotencyHeaderValue);
  if (!idemp.ok) return idemp;

  if (!body || typeof body !== "object" || Array.isArray(body)) {
    return {
      ok: false,
      code: FACTORY_ORCHESTRATION_ERROR_CODES.VALIDATION_FAIL,
      message: "submit body must be an object",
    };
  }

  const { factoryKey, command, hints, idempotencyKey } = body;

  if (typeof factoryKey !== "string" || factoryKey.length === 0) {
    return {
      ok: false,
      code: FACTORY_ORCHESTRATION_ERROR_CODES.VALIDATION_FAIL,
      message: "factoryKey must be a non-empty string",
    };
  }

  if (command !== FACTORY_ORCHESTRATION_COMMANDS.ORCHESTRATE_EXPEDIENTE) {
    return {
      ok: false,
      code: FACTORY_ORCHESTRATION_ERROR_CODES.VALIDATION_FAIL,
      message: 'command MUST be exactly "orchestrateExpediente"',
    };
  }

  const mirror = validateIdempotencyBodyMirror(idemp.key, idempotencyKey);
  if (!mirror.ok) return mirror;

  if (hints !== undefined && hints !== null) {
    if (typeof hints !== "object" || Array.isArray(hints)) {
      return {
        ok: false,
        code: FACTORY_ORCHESTRATION_ERROR_CODES.VALIDATION_FAIL,
        message: "hints must be an object when present",
      };
    }
    for (const key of Object.keys(hints)) {
      if (!FACTORY_ORCHESTRATION_HINTS_ALLOWLIST.includes(key)) {
        return {
          ok: false,
          code: FACTORY_ORCHESTRATION_ERROR_CODES.VALIDATION_FAIL,
          message: `hints key not allowlisted: ${key}`,
        };
      }
    }
  }

  return {
    ok: true,
    value: {
      factoryKey,
      command,
      hints: hints && typeof hints === "object" ? { ...hints } : {},
      idempotencyKey: idemp.key,
    },
  };
}

/**
 * Fail-closed allowlist filter for objects (contract helper).
 * @param {object} obj
 * @param {readonly string[]} allowlist
 */
export function filterToAllowlist(obj, allowlist) {
  if (!obj || typeof obj !== "object" || Array.isArray(obj)) {
    return {};
  }
  const out = {};
  for (const key of allowlist) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      out[key] = obj[key];
    }
  }
  return out;
}

/**
 * @param {object} summary
 */
export function sanitizeResultSummary(summary) {
  return filterToAllowlist(summary, FACTORY_ORCHESTRATION_RESULT_SUMMARY_ALLOWLIST);
}

/**
 * @param {object} lineage
 */
export function sanitizeLineageSummary(lineage) {
  return filterToAllowlist(lineage, FACTORY_ORCHESTRATION_LINEAGE_SUMMARY_ALLOWLIST);
}

/**
 * Reject objects that appear to smuggle raw ELR / Decision Package keys.
 * @param {object} obj
 */
export function assertNoForbiddenPayloadKeys(obj) {
  const forbidden = [
    "elr",
    "rawElr",
    "decisionPackage",
    "DecisionPackage",
    "access_tier",
    "marketplace",
  ];
  if (!obj || typeof obj !== "object") {
    return { ok: true };
  }
  for (const key of Object.keys(obj)) {
    if (forbidden.includes(key)) {
      return {
        ok: false,
        code: FACTORY_ORCHESTRATION_ERROR_CODES.VALIDATION_FAIL,
        message: `forbidden payload key: ${key}`,
      };
    }
  }
  return { ok: true };
}

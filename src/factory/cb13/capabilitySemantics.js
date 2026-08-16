/**
 * SP09-P2 — Minimum Capability Semantics (CB-13)
 *
 * Answers only: WHAT EXISTING CAPABILITY CAN SATISFY THIS SEMANTIC RESEARCH NEED?
 *
 * Input: ResearchTask.capabilityNeed (P1) — consumed read-only.
 * Output: SEPARATE semantic resolution artifact (never mutates ResearchTask).
 *
 * Does NOT: execute Motor/Loop/Swarm, authorize execution, accept Evidence/Fact,
 * plan, score, or bridge to CB15.
 */

import { getMotorCatalogEntry } from "../cb04/motorCatalogIndex.js";
import { getLoopEntry } from "../cb11/loopEngineCatalog.js";
import { getSwarmPattern } from "../cb12/swarmCatalog.js";
import { FORBIDDEN_CAPABILITY_RESOLUTION_KEYS } from "./researchContracts.js";

export const CAPABILITY_SEMANTICS_PROGRAM = "SP09-P2";
export const CAPABILITY_SEMANTICS_VERSION = "v1";
export const CAPABILITY_SEMANTICS_SCHEMA_ID =
  "rsn.cb13.research.capabilitySemantics.result.v1";

export const CAPABILITY_FAMILY = Object.freeze({
  MOTOR: "MOTOR",
  LOOP: "LOOP",
  SWARM: "SWARM",
});

export const CAPABILITY_RESOLUTION_STATUS = Object.freeze({
  MATCHED: "MATCHED",
  UNRESOLVED: "UNRESOLVED",
});

/** Closed P2 vocabulary — only these tokens may MATCH. */
export const CAPABILITY_NEED = Object.freeze({
  OWNERSHIP_RECORD: "ownership-record",
  EVIDENCE_SUFFICIENCY_GAP: "evidence-sufficiency-gap",
  MULTI_DOMAIN_SUFFICIENCY: "multi-domain-sufficiency",
});

/**
 * Exact frozen map (3 entries only).
 * @type {Readonly<Record<string, { family: string, capabilityRef: string }>>}
 */
export const CAPABILITY_SEMANTICS_MAP = Object.freeze({
  [CAPABILITY_NEED.OWNERSHIP_RECORD]: Object.freeze({
    family: CAPABILITY_FAMILY.MOTOR,
    capabilityRef: "MOT-OWN-01",
  }),
  [CAPABILITY_NEED.EVIDENCE_SUFFICIENCY_GAP]: Object.freeze({
    family: CAPABILITY_FAMILY.LOOP,
    capabilityRef: "LOOP-XVR-EVD-01",
  }),
  [CAPABILITY_NEED.MULTI_DOMAIN_SUFFICIENCY]: Object.freeze({
    family: CAPABILITY_FAMILY.SWARM,
    capabilityRef: "SWM-SUF-01",
  }),
});

/** Immutable non-authority locks on every resolution artifact. */
export const CAPABILITY_SEMANTICS_AUTHORITY = Object.freeze({
  executionAuthorized: false,
  evidenceAuthority: "CB-06",
  isEvidence: false,
  isFact: false,
  isTrustedEvidence: false,
  matchIsNotExecution: true,
  matchIsNotAuthorization: true,
  resultIsNotEvidence: true,
  resultIsNotFact: true,
});

const NON_EMPTY_STRING = (v) => typeof v === "string" && v.trim().length > 0;

/**
 * Verify capabilityRef exists in the corresponding existing catalog.
 * @param {string} family
 * @param {string} capabilityRef
 * @returns {boolean}
 */
export function verifyCatalogIdentity(family, capabilityRef) {
  if (!NON_EMPTY_STRING(capabilityRef)) return false;
  if (family === CAPABILITY_FAMILY.MOTOR) {
    return getMotorCatalogEntry(capabilityRef) != null;
  }
  if (family === CAPABILITY_FAMILY.LOOP) {
    return getLoopEntry(capabilityRef) != null;
  }
  if (family === CAPABILITY_FAMILY.SWARM) {
    return getSwarmPattern(capabilityRef) != null;
  }
  return false;
}

function pushError(errors, message) {
  errors.push(message);
}

/**
 * @param {unknown} capabilityNeed
 * @returns {{ ok: boolean, errors: string[] }}
 */
export function validateCapabilityNeedInput(capabilityNeed) {
  const errors = [];
  if (capabilityNeed == null) {
    pushError(errors, "capabilityNeed is required");
    return { ok: false, errors };
  }
  if (typeof capabilityNeed !== "string") {
    pushError(errors, "capabilityNeed must be a string");
    return { ok: false, errors };
  }
  if (!NON_EMPTY_STRING(capabilityNeed)) {
    pushError(errors, "capabilityNeed must be a non-empty string");
    return { ok: false, errors };
  }
  if (capabilityNeed !== capabilityNeed.trim()) {
    pushError(errors, "capabilityNeed must not have leading/trailing whitespace");
    return { ok: false, errors };
  }
  return { ok: true, errors };
}

/**
 * Build frozen MATCHED artifact. Catalog identity is mandatory.
 * @param {{ capabilityNeed: string, family: string, capabilityRef: string }} parts
 */
export function buildMatchedCapabilityResolution(parts) {
  const errors = [];
  const needCheck = validateCapabilityNeedInput(parts?.capabilityNeed);
  if (!needCheck.ok) errors.push(...needCheck.errors);
  if (!Object.values(CAPABILITY_FAMILY).includes(parts?.family)) {
    errors.push(`family must be MOTOR|LOOP|SWARM (got ${JSON.stringify(parts?.family)})`);
  }
  if (!NON_EMPTY_STRING(parts?.capabilityRef)) {
    errors.push("capabilityRef must be a non-empty string");
  }
  if (
    errors.length === 0 &&
    !verifyCatalogIdentity(parts.family, parts.capabilityRef)
  ) {
    errors.push(
      `capabilityRef ${JSON.stringify(parts.capabilityRef)} not found in catalog for family ${parts.family}`
    );
  }
  if (errors.length) {
    return { ok: false, errors, resolution: null };
  }

  const resolution = Object.freeze({
    schemaId: CAPABILITY_SEMANTICS_SCHEMA_ID,
    version: CAPABILITY_SEMANTICS_VERSION,
    program: CAPABILITY_SEMANTICS_PROGRAM,
    status: CAPABILITY_RESOLUTION_STATUS.MATCHED,
    capabilityNeed: parts.capabilityNeed,
    family: parts.family,
    capabilityRef: parts.capabilityRef,
    ...CAPABILITY_SEMANTICS_AUTHORITY,
  });
  return { ok: true, errors: [], resolution };
}

/**
 * Build frozen UNRESOLVED artifact.
 * @param {{ capabilityNeed?: string|null }} [parts]
 */
export function buildUnresolvedCapabilityResolution(parts = {}) {
  const need =
    parts.capabilityNeed != null && NON_EMPTY_STRING(parts.capabilityNeed)
      ? parts.capabilityNeed.trim()
      : null;

  const resolution = Object.freeze({
    schemaId: CAPABILITY_SEMANTICS_SCHEMA_ID,
    version: CAPABILITY_SEMANTICS_VERSION,
    program: CAPABILITY_SEMANTICS_PROGRAM,
    status: CAPABILITY_RESOLUTION_STATUS.UNRESOLVED,
    ...(need != null ? { capabilityNeed: need } : {}),
    family: null,
    capabilityRef: null,
    ...CAPABILITY_SEMANTICS_AUTHORITY,
  });
  return { ok: true, errors: [], resolution };
}

/**
 * Validate a resolution artifact (shape + catalog identity for MATCHED).
 * @param {object} resolution
 * @returns {{ ok: boolean, errors: string[] }}
 */
export function validateCapabilitySemanticsResult(resolution) {
  const errors = [];
  if (resolution == null || typeof resolution !== "object" || Array.isArray(resolution)) {
    return { ok: false, errors: ["CapabilitySemanticsResult must be a plain object"] };
  }

  if (
    resolution.status !== CAPABILITY_RESOLUTION_STATUS.MATCHED &&
    resolution.status !== CAPABILITY_RESOLUTION_STATUS.UNRESOLVED
  ) {
    pushError(errors, `status must be MATCHED|UNRESOLVED (got ${JSON.stringify(resolution.status)})`);
  }

  if (resolution.executionAuthorized !== false) {
    pushError(errors, "executionAuthorized must be false");
  }
  if (resolution.isEvidence === true) {
    pushError(errors, "resolution must not claim isEvidence=true");
  }
  if (resolution.isFact === true) {
    pushError(errors, "resolution must not claim isFact=true");
  }
  if (resolution.isTrustedEvidence === true) {
    pushError(errors, "resolution must not claim isTrustedEvidence=true");
  }
  if (
    resolution.evidenceAuthority != null &&
    resolution.evidenceAuthority !== CAPABILITY_SEMANTICS_AUTHORITY.evidenceAuthority
  ) {
    pushError(errors, 'evidenceAuthority must remain "CB-06" or be omitted');
  }

  if (resolution.status === CAPABILITY_RESOLUTION_STATUS.MATCHED) {
    const needCheck = validateCapabilityNeedInput(resolution.capabilityNeed);
    if (!needCheck.ok) errors.push(...needCheck.errors);
    if (!Object.values(CAPABILITY_FAMILY).includes(resolution.family)) {
      pushError(errors, "MATCHED requires family MOTOR|LOOP|SWARM");
    }
    if (!NON_EMPTY_STRING(resolution.capabilityRef)) {
      pushError(errors, "MATCHED requires capabilityRef");
    }
    if (
      errors.length === 0 &&
      !verifyCatalogIdentity(resolution.family, resolution.capabilityRef)
    ) {
      pushError(
        errors,
        `MATCHED capabilityRef ${JSON.stringify(resolution.capabilityRef)} failed catalog identity`
      );
    }
  }

  if (resolution.status === CAPABILITY_RESOLUTION_STATUS.UNRESOLVED) {
    if (resolution.family != null) {
      pushError(errors, "UNRESOLVED must not resolve family");
    }
    if (resolution.capabilityRef != null) {
      pushError(errors, "UNRESOLVED must not resolve capabilityRef");
    }
  }

  return { ok: errors.length === 0, errors };
}

/**
 * Resolve semantic capabilityNeed → separate MATCHED | UNRESOLVED artifact.
 * Does not mutate ResearchTask. Does not execute anything.
 *
 * @param {unknown} capabilityNeed
 * @returns {{ ok: boolean, errors: string[], resolution: object|null }}
 */
export function resolveCapabilityNeed(capabilityNeed) {
  const input = validateCapabilityNeedInput(capabilityNeed);
  if (!input.ok) {
    return { ok: false, errors: input.errors, resolution: null };
  }

  const mapped = CAPABILITY_SEMANTICS_MAP[capabilityNeed];
  if (!mapped) {
    return buildUnresolvedCapabilityResolution({ capabilityNeed });
  }

  if (!verifyCatalogIdentity(mapped.family, mapped.capabilityRef)) {
    // Mapped but catalog missing — do not MATCH; fail closed as UNRESOLVED.
    return buildUnresolvedCapabilityResolution({ capabilityNeed });
  }

  return buildMatchedCapabilityResolution({
    capabilityNeed,
    family: mapped.family,
    capabilityRef: mapped.capabilityRef,
  });
}

/**
 * Resolve from a ResearchTask without mutating it.
 * @param {{ capabilityNeed?: unknown }} task
 * @returns {{ ok: boolean, errors: string[], resolution: object|null, taskUnchanged: boolean }}
 */
export function resolveCapabilityNeedFromTask(task) {
  if (task == null || typeof task !== "object" || Array.isArray(task)) {
    return {
      ok: false,
      errors: ["ResearchTask must be a plain object"],
      resolution: null,
      taskUnchanged: true,
    };
  }

  const before = JSON.stringify(task);
  const result = resolveCapabilityNeed(task.capabilityNeed);
  const after = JSON.stringify(task);
  const taskUnchanged = before === after;

  if (!taskUnchanged) {
    return {
      ok: false,
      errors: ["ResearchTask was mutated during semantic resolution"],
      resolution: result.resolution,
      taskUnchanged: false,
    };
  }

  for (const key of FORBIDDEN_CAPABILITY_RESOLUTION_KEYS) {
    if (Object.prototype.hasOwnProperty.call(task, key) && task[key] != null) {
      return {
        ok: false,
        errors: [`ResearchTask must not carry forbidden resolution field "${key}"`],
        resolution: result.resolution,
        taskUnchanged: true,
      };
    }
  }

  return { ...result, taskUnchanged: true };
}

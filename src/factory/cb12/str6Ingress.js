/**
 * CB-12 — STR-6 ingress from Loop/Motor derivations (ELR swarm_mission_refs)
 */

import { getSwarmForDerivingLoop, getSwarmPattern, LOOP_TO_SWM } from "./swarmCatalog.js";

/** Legacy / phase-specific target aliases → canonical OSC SWM id */
export const SWARM_TARGET_ALIASES = Object.freeze({
  "CB-12:SwarmCoordinator": null,
  "CB-12:SWM-MOT-01": "SWM-CVG-01",
  "CB-12:SWM-CVG-01": "SWM-CVG-01",
  "CB-12:SWM-CHR-01": "SWM-CHR-01",
  "CB-12:SWM-EVD-01": "SWM-EVD-01",
  "CB-12:SWM-LEG-01": "SWM-LEG-01",
  "CB-12:SWM-DST-01": "SWM-DST-01",
  "CB-12:SWM-INV-01": "SWM-INV-01",
  "CB-12:SWM-ECO-01": "SWM-ECO-01",
  "CB-12:SWM-VAL-01": "SWM-VAL-01",
  "CB-12:SWM-IVM-01": "SWM-IVM-01",
  "CB-12:SWM-SUF-01": "SWM-SUF-01",
  "CB-12:SWM-SYN-01": "SWM-SYN-01",
  "CB-12:SWM-NEG-01": "SWM-NEG-01",
  "CB-12:SWM-IDN-01": "SWM-IDN-01",
  "CB-12:SWM-OCR-01": "SWM-OCR-01",
});

const STR6_STRATEGIES = new Set(["STR-6", "STR-7"]);

/**
 * @param {string} target
 * @param {{ actor?: string, loopParent?: string, defaultSwm?: string }} [context]
 */
export function normalizeSwarmTarget(target, context = {}) {
  if (!target) return null;

  if (SWARM_TARGET_ALIASES[target] != null) {
    return SWARM_TARGET_ALIASES[target];
  }

  const stripped = target.replace(/^CB-12:/, "");
  if (SWARM_TARGET_ALIASES[`CB-12:${stripped}`]) {
    return SWARM_TARGET_ALIASES[`CB-12:${stripped}`];
  }

  if (/^SWM-[A-Z]{3}-\d{2}$/.test(stripped)) {
    return stripped;
  }

  if (target === "CB-12:SwarmCoordinator" || stripped === "SwarmCoordinator") {
    if (context.defaultSwm) return context.defaultSwm;
    if (context.loopParent) {
      return LOOP_TO_SWM[context.loopParent] ?? null;
    }
    if (context.actor && LOOP_TO_SWM[context.actor]) {
      return LOOP_TO_SWM[context.actor];
    }
  }

  return null;
}

/**
 * @param {object} entry — ELR swarm_mission_refs entry
 */
export function isStr6Derivation(entry) {
  if (!entry?.route && entry?.kind?.includes("DERIVATION")) {
    return true;
  }
  const strategy = entry?.route?.strategy;
  const action = entry?.route?.action;
  if (action === "DERIVE_SWARM") return true;
  if (strategy && STR6_STRATEGIES.has(strategy)) return true;
  return entry?.route?.target?.includes("CB-12:");
}

/**
 * @param {object} elr
 */
export function collectStr6Derivations(elr) {
  const refs = elr?.swarm_mission_refs ?? [];
  return refs.filter((entry) => {
    if (entry.kind === "EVF-04_SWARM_MISSION_OPEN" || entry.kind === "EVF-04_SWARM_MISSION_CLOSE") {
      return false;
    }
    if (entry.kind === "SWARM_COORDINATOR_REGISTRY_COMPLETE") return false;
    return isStr6Derivation(entry);
  });
}

/**
 * @param {object} derivation
 * @param {string} factoryKey
 */
export function buildMandateFromDerivation(derivation, factoryKey) {
  const route = derivation.route ?? {};
  const actor = derivation.actor;
  const loopParent = actor && LOOP_TO_SWM[actor] ? actor : null;

  const swmId =
    normalizeSwarmTarget(route.swarmMission ?? route.target, {
      actor,
      loopParent,
      defaultSwm: loopParent ? LOOP_TO_SWM[loopParent] : null,
    }) ?? (loopParent ? LOOP_TO_SWM[loopParent] : null);

  if (!swmId) {
    return { valid: false, reason: "Cannot resolve SWM from STR-6 derivation", derivation };
  }

  const pattern = getSwarmPattern(swmId);

  return {
    valid: true,
    swmId,
    mandate: {
      loopParent: loopParent ?? pattern.derivingLoop,
      objectiveEpistemic: pattern.prb,
      authorizedMotors: pattern.motors,
      authorizedCaps: pattern.primaryCaps,
      strategiesExhausted: route.strategy ? [route.strategy] : ["STR-6"],
      derivationRef: {
        kind: derivation.kind,
        elrSequence: derivation.elrSequence,
        route,
        sourcePhase: derivation.constitutionalPhase,
      },
      evidenceState: derivation.evidenceState ?? null,
    },
    factoryKey,
    strategy: route.strategy ?? "STR-6",
  };
}

/**
 * @param {object} elr
 * @param {string} factoryKey
 */
export function resolveStr6Mandates(elr, factoryKey) {
  const derivations = collectStr6Derivations(elr);
  const mandates = [];
  const unresolved = [];

  for (const derivation of derivations) {
    const resolved = buildMandateFromDerivation(derivation, factoryKey);
    if (resolved.valid) {
      mandates.push(resolved);
    } else {
      unresolved.push(resolved);
    }
  }

  return { mandates, unresolved, derivationCount: derivations.length };
}

/**
 * @param {string} loopId
 */
export function buildSyntheticStr6Mandate(loopId, factoryKey) {
  const pattern = getSwarmForDerivingLoop(loopId);
  if (!pattern) return null;

  return {
    valid: true,
    swmId: pattern.id,
    strategy: "STR-6",
    factoryKey,
    mandate: {
      loopParent: loopId,
      objectiveEpistemic: pattern.prb,
      authorizedMotors: pattern.motors,
      authorizedCaps: pattern.primaryCaps,
      strategiesExhausted: ["STR-6"],
      derivationRef: { synthetic: true, loopId },
    },
  };
}

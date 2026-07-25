/**
 * CB-16 — Decision handoff ELR ledger
 *
 * Records handoff lifecycle acts in decision_handoffs / loop_ledger_refs.
 * Does not modify Foundation, Evidence content, or Runtime handlers.
 */

import {
  DECISION_HANDOFF_ACTOR,
  DECISION_HANDOFF_INTERFACE_ID,
  HANDOFF_ELR_KINDS,
} from "./decisionPackageSchema.js";

/**
 * @param {import('../cb01/factoryRegistry.js').FactoryRegistry} registry
 * @param {string} factoryKey
 * @param {{ packageVersion: string, maturity_score?: number, gatePassCount?: number }} meta
 */
export function recordDecisionPackageBuilt(registry, factoryKey, meta) {
  return registry.registerElrAct(
    factoryKey,
    "decision_handoffs",
    {
      kind: HANDOFF_ELR_KINDS.PACKAGE_BUILT,
      interfaceId: DECISION_HANDOFF_INTERFACE_ID,
      packageVersion: meta.packageVersion,
      maturity_score: meta.maturity_score,
      gatePassCount: meta.gatePassCount,
      message: "Decision Package assembled — no commercial decision taken",
      constitutionalPhase: "CB-16",
    },
    { actor: DECISION_HANDOFF_ACTOR }
  );
}

/**
 * @param {import('../cb01/factoryRegistry.js').FactoryRegistry} registry
 * @param {string} factoryKey
 * @param {{ fromState: string, toState: string, packageId?: string }} handoff
 */
export function recordDecisionHandoff(registry, factoryKey, handoff) {
  return registry.registerElrAct(
    factoryKey,
    "decision_handoffs",
    {
      kind: HANDOFF_ELR_KINDS.HANDOFF_RECORDED,
      interfaceId: DECISION_HANDOFF_INTERFACE_ID,
      fromState: handoff.fromState,
      toState: handoff.toState,
      packageId: handoff.packageId ?? null,
      target: "DecisionEngine",
      message: "ST-RDY → ST-DEC Decision handoff recorded (Factory frontier)",
      constitutionalPhase: "CB-16",
      rules: ["FFO-06", "LFF-07"],
    },
    { actor: DECISION_HANDOFF_ACTOR }
  );
}

/**
 * Freeze protocol: post-handoff Factory must not modify Decision thesis.
 *
 * @param {import('../cb01/factoryRegistry.js').FactoryRegistry} registry
 * @param {string} factoryKey
 * @param {{ reason?: string }} [options]
 */
export function recordFactoryFreeze(registry, factoryKey, options = {}) {
  return registry.registerElrAct(
    factoryKey,
    "decision_handoffs",
    {
      kind: HANDOFF_ELR_KINDS.FREEZE,
      interfaceId: DECISION_HANDOFF_INTERFACE_ID,
      frozen: true,
      scope: "decision_thesis",
      reason: options.reason ?? "Post-handoff freeze — Factory pauses commercial decision",
      constitutionalPhase: "CB-16",
    },
    { actor: DECISION_HANDOFF_ACTOR }
  );
}

/**
 * @param {import('../cb01/factoryRegistry.js').FactoryRegistry} registry
 * @param {string} factoryKey
 * @param {{ deliveryId: string, recipient: string }} delivery
 */
export function recordPackageDelivered(registry, factoryKey, delivery) {
  return registry.registerElrAct(
    factoryKey,
    "decision_handoffs",
    {
      kind: HANDOFF_ELR_KINDS.DELIVERED,
      interfaceId: DECISION_HANDOFF_INTERFACE_ID,
      deliveryId: delivery.deliveryId,
      recipient: delivery.recipient,
      constitutionalPhase: "CB-16",
    },
    { actor: DECISION_HANDOFF_ACTOR }
  );
}

/**
 * @param {import('../cb01/factoryRegistry.js').FactoryRegistry} registry
 * @param {string} factoryKey
 * @param {object} summary
 */
export function recordHandoffComplete(registry, factoryKey, summary) {
  return registry.registerElrAct(
    factoryKey,
    "loop_ledger_refs",
    {
      kind: HANDOFF_ELR_KINDS.COMPLETE,
      interfaceId: DECISION_HANDOFF_INTERFACE_ID,
      ...summary,
      constitutionalPhase: "CB-16",
    },
    { actor: DECISION_HANDOFF_ACTOR }
  );
}

/**
 * @param {object} elr
 */
export function collectDecisionHandoffLedger(elr) {
  const handoffs = elr?.decision_handoffs ?? [];
  const dhi = handoffs.filter((h) => String(h.kind ?? "").startsWith("DHI_"));
  return {
    all: handoffs,
    dhi,
    packageBuilt: dhi.some((h) => h.kind === HANDOFF_ELR_KINDS.PACKAGE_BUILT),
    handoffRecorded: dhi.some((h) => h.kind === HANDOFF_ELR_KINDS.HANDOFF_RECORDED),
    frozen: dhi.some((h) => h.kind === HANDOFF_ELR_KINDS.FREEZE && h.frozen === true),
    delivered: dhi.some((h) => h.kind === HANDOFF_ELR_KINDS.DELIVERED),
  };
}

/**
 * @param {object} elr
 */
export function isFactoryDecisionThesisFrozen(elr) {
  return collectDecisionHandoffLedger(elr).frozen;
}

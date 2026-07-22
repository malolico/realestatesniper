/**
 * CB-15 — Orchestration Bus event ledger
 */

import { ORCHESTRATION_BUS_ACTOR } from "./ffoCatalog.js";

/**
 * @param {import('../cb01/factoryRegistry.js').FactoryRegistry} registry
 * @param {string} factoryKey
 * @param {object} event
 */
export function recordBusEvent(registry, factoryKey, event) {
  return registry.registerElrAct(
    factoryKey,
    "loop_ledger_refs",
    {
      kind: "FFO_ORCHESTRATION_EVENT",
      busPhase: event.busPhase,
      layer: event.layer,
      pConst: event.pConst,
      subsystem: event.subsystem,
      status: event.status,
      detail: event.detail,
      constitutionalPhase: "CB-15",
    },
    { actor: event.actor ?? ORCHESTRATION_BUS_ACTOR }
  );
}

/**
 * @param {import('../cb01/factoryRegistry.js').FactoryRegistry} registry
 * @param {string} factoryKey
 * @param {object} summary
 */
export function recordOrchestrationComplete(registry, factoryKey, summary) {
  return registry.registerElrAct(
    factoryKey,
    "loop_ledger_refs",
    {
      kind: "FFO_ORCHESTRATION_COMPLETE",
      ...summary,
      constitutionalPhase: "CB-15",
    },
    { actor: ORCHESTRATION_BUS_ACTOR }
  );
}

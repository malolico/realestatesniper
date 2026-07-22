/**
 * CB-13 — Expediente state progression toward ST-CONS / ST-RDY
 */

import { canTransition } from "../cb01/stateMachine.js";
import { requiresCmpClearance } from "../cb03/clearanceProtocol.js";

const PATH_TO_CONS = Object.freeze([
  "ST-IDN",
  "ST-PROD",
  "ST-EVD",
  "ST-PERF",
  "ST-CONS",
]);

/**
 * @param {import('../cb01/factoryRegistry.js').FactoryRegistry} registry
 * @param {import('../cb03/complianceGateService.js').ComplianceGateService} compliance
 * @param {string} factoryKey
 */
export function advanceToConsolidation(registry, compliance, factoryKey) {
  compliance.evaluateAndRecordClearance(factoryKey, { piiAuthorized: true });
  let record = registry.getExpediente(factoryKey);

  for (const toState of PATH_TO_CONS) {
    if (record.state === toState) continue;
    if (!canTransition(record.state, toState)) continue;

    if (requiresCmpClearance(toState)) {
      compliance.guardedTransition(factoryKey, toState, {
        actor: "MOT-SYN-02",
        reason: "cb13-readiness-path",
      });
    } else {
      registry.transitionState(factoryKey, toState, {
        actor: "MOT-SYN-02",
        reason: "cb13-readiness-path",
      });
    }
    record = registry.getExpediente(factoryKey);
  }

  return record;
}

/**
 * @param {import('../cb01/factoryRegistry.js').FactoryRegistry} registry
 * @param {import('../cb06/evidenceService.js').EvidenceService} evidenceService
 * @param {string} factoryKey
 * @param {{ actor?: string, reason?: string }} [context]
 */
export function transitionToReady(registry, evidenceService, factoryKey, context = {}) {
  const actor = context.actor ?? "MOT-SYN-02";
  evidenceService.assertTransitionAllowed(factoryKey, "ST-RDY");
  return registry.transitionState(factoryKey, "ST-RDY", {
    actor,
    reason: context.reason ?? "readiness_gates_g0_g6_pass",
  });
}

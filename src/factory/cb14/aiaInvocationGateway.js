/**
 * CB-14 — AIA Invocation Gateway (OAC catalog only)
 */

import { CLEARANCE_STATUS } from "../cb03/clearanceProtocol.js";
import { getAiaPattern, isProductionAia, AIA_CATALOG } from "./aiaCatalog.js";
import { validatePrhCompliance } from "./prhProhibitions.js";
import { enforceAutAuthority } from "./autAuthority.js";
import { assertAuthorizedInvoker, applyAiAssistOutputLimits } from "./constitutionalLimits.js";
import { executeAiaAssistStub } from "./aiaAssistStub.js";
import { recordRlgInvocation } from "./reasoningLedger.js";

export class AiaInvocationGateway {
  /**
   * @param {{
   *   registry: import('../cb01/factoryRegistry.js').FactoryRegistry,
   *   compliance: import('../cb03/complianceGateService.js').ComplianceGateService,
   * }} deps
   */
  constructor(deps) {
    this.registry = deps.registry;
    this.compliance = deps.compliance;
    /** @type {object[]} */
    this.invocationLog = [];
  }

  /**
   * @param {string} factoryKey
   * @param {string} aiaId
   * @param {{
   *   invoker: string,
   *   inputs?: object,
   *   invokerAccepted?: boolean,
   *   motorValidated?: boolean,
   *   readinessGatesPass?: boolean,
   * }} request
   */
  invoke(factoryKey, aiaId, request) {
    if (!isProductionAia(aiaId)) {
      return { accepted: false, reason: "OAC-04: class X or unknown AIA blocked from production" };
    }

    const pattern = getAiaPattern(aiaId);

    try {
      assertAuthorizedInvoker(request.invoker);
    } catch (err) {
      return { accepted: false, reason: err.message };
    }

    if (!pattern.invokers.includes(request.invoker)) {
      return {
        accepted: false,
        reason: `Invoker ${request.invoker} not authorized for ${aiaId}`,
      };
    }

    const pre = this.compliance.assertPreExecution(factoryKey, {
      actor: request.invoker,
      operation: `aia_invoke:${aiaId}`,
    });
    if (!pre.valid) {
      return { accepted: false, reason: "Compliance BLOCK — AIA invocation rejected", validation: pre };
    }

    const clearance = this.compliance.evaluateAndRecordClearance(factoryKey, {
      piiAuthorized: true,
    });
    if (clearance.state.clearance === CLEARANCE_STATUS.BLOCK) {
      return { accepted: false, reason: "PRH-CMP: compliance BLOCK" };
    }

    if (aiaId === "AIA-SUM-02" && request.readinessGatesPass !== true) {
      return { accepted: false, reason: "CMP-04: SUM-02 requires readiness gates PASS" };
    }

    const prh = validatePrhCompliance({
      invoker: request.invoker,
      proposedELevel: "E1",
      autonomous: false,
      ...request.prhFlags,
    });
    if (!prh.pass) {
      return { accepted: false, reason: `PRH violation: ${prh.violations.join(", ")}`, prh };
    }

    const aut = enforceAutAuthority(pattern.aut, {
      invokerAccepted: request.invokerAccepted ?? pattern.aut === "AUT-0",
      motorValidated: request.motorValidated ?? pattern.aut !== "AUT-2",
    });
    if (!aut.allowed) {
      return { accepted: false, reason: aut.reason, aut };
    }

    const stub = executeAiaAssistStub(aiaId, {
      factoryKey,
      inputs: request.inputs,
    });

    let output;
    try {
      output = applyAiAssistOutputLimits(stub);
    } catch (err) {
      return { accepted: false, reason: err.message };
    }

    const rlg = {
      aiaId,
      invoker: request.invoker,
      modelSlot: pattern.slot,
      autLevel: pattern.aut,
      fun: pattern.fun,
      outputELevel: output.proposedELevel,
      confidence: output.confidence,
      uncertaintyScore: output.uncertaintyScore,
      prhPass: true,
      prhViolations: [],
      reasoningSummary: output.suggestion?.summary,
    };

    recordRlgInvocation(this.registry, factoryKey, rlg);
    this.invocationLog.push({ factoryKey, ...rlg });

    return {
      accepted: true,
      aiaId,
      invoker: request.invoker,
      output,
      rlg,
      aut,
      assistiveOnly: true,
    };
  }

  /**
   * Invoke all 26 cataloged AIA with default authorized invokers.
   *
   * @param {string} factoryKey
   * @param {{ readinessGatesPass?: boolean }} [options]
   */
  invokeAllCataloged(factoryKey, options = {}) {
    const results = [];
    for (const pattern of AIA_CATALOG) {
      const invoker = pattern.invokers[0];
      const result = this.invoke(factoryKey, pattern.id, {
        invoker,
        invokerAccepted: pattern.aut !== "AUT-0" ? true : undefined,
        motorValidated: pattern.aut === "AUT-2" ? true : undefined,
        readinessGatesPass: options.readinessGatesPass,
      });
      results.push(result);
    }
    return results;
  }
}

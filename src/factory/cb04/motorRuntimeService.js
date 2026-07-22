/**
 * CB-04 — Motor Runtime Service (Registry + Compliance + Runtime facade)
 */

import { FactoryRegistry } from "../cb01/factoryRegistry.js";
import { ComplianceGateService } from "../cb03/complianceGateService.js";
import { MotorExecutionLock } from "./motorExecutionLock.js";
import { MotorRuntime } from "./motorRuntime.js";

export class MotorRuntimeService {
  /**
   * @param {{
   *   registry?: FactoryRegistry,
   *   compliance?: ComplianceGateService,
   *   executionLock?: MotorExecutionLock,
   *   runtime?: MotorRuntime,
   * }} [deps]
   */
  constructor(deps = {}) {
    this.registry = deps.registry ?? new FactoryRegistry();
    this.compliance =
      deps.compliance ??
      new ComplianceGateService({
        registry: this.registry,
      });
    this.executionLock = deps.executionLock ?? new MotorExecutionLock();
    this.runtime =
      deps.runtime ??
      new MotorRuntime({
        registry: this.registry,
        compliance: this.compliance,
        executionLock: this.executionLock,
      });
  }

  /**
   * @param {{ candidateRef?: string, actor?: string }} [input]
   */
  bootstrapExpediente(input = {}) {
    return this.registry.createExpediente({
      candidateRef: input.candidateRef ?? "cb04-runtime-bootstrap",
      actor: input.actor ?? "MotorRuntimeService",
    });
  }

  /**
   * @param {string} factoryKey
   * @param {string} motorId
   * @param {{ inputs?: object, invoker?: string, useStub?: boolean }} [options]
   */
  async runMotor(factoryKey, motorId, options = {}) {
    return this.runtime.execute(factoryKey, motorId, options);
  }

  /**
   * @param {string} factoryKey
   */
  getMotorManifests(factoryKey) {
    const record = this.registry.getExpediente(factoryKey);
    return record?.elr?.motor_manifests ?? [];
  }
}

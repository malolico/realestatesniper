/**
 * CB-04 — Motor Runtime Foundation
 */

import { isPhaseApproved } from "../cb00/constructionGovernance.js";
import { assertCatalogActor } from "../cb00/catalogActorGuard.js";
import { FactoryRegistry } from "../cb01/factoryRegistry.js";
import { ComplianceGateService } from "../cb03/complianceGateService.js";
import { assertMotorInCatalog, getMotorCatalogEntry } from "./motorCatalogIndex.js";
import { resolveDependencies } from "./motorDependencies.js";
import { MotorExecutionLock } from "./motorExecutionLock.js";
import { buildMotorManifest } from "./motorManifest.js";
import { getStubHandler } from "./stubMotorHandlers.js";

export class MotorRuntime {
  /**
   * @param {{
   *   registry: FactoryRegistry,
   *   compliance?: ComplianceGateService,
   *   executionLock?: MotorExecutionLock,
   *   handlers?: Record<string, Function>,
   * }} deps
   */
  constructor(deps) {
    if (!isPhaseApproved("CB-03")) {
      throw new Error("[CB-04 Runtime] CB-03 must be APPROVED before Motor Runtime");
    }
    this.registry = deps.registry;
    this.compliance = deps.compliance ?? null;
    this.executionLock = deps.executionLock ?? new MotorExecutionLock();
    this.handlers = deps.handlers ?? {};
    /** @type {Map<string, Set<string>>} */
    this._completedByFactory = new Map();
  }

  /**
   * @param {string} factoryKey
   */
  getExecutionContext(factoryKey) {
    const completed = this._completedByFactory.get(factoryKey) ?? new Set();
    const compliance = this.compliance?.getComplianceState(factoryKey);
    return {
      completedMotors: new Set(completed),
      idnResolved: completed.has("MOT-IDN-01"),
      cmpClearance: compliance?.clearance === "PASS",
      evdSufficiency: completed.has("MOT-EVD-01"),
      cnt02Authorized: completed.has("MOT-CNT-02"),
      lienResolved: completed.has("MOT-LIEN-01"),
    };
  }

  /**
   * @param {string} factoryKey
   * @param {string} motorId
   * @param {{ inputs?: object, invoker?: string, useStub?: boolean }} [options]
   */
  async execute(factoryKey, motorId, options = {}) {
    assertCatalogActor(motorId);
    const entry = assertMotorInCatalog(motorId);

    if (!entry.cap) {
      throw new Error(`[CB-04 Runtime] Motor without CAP parent rejected: ${motorId}`);
    }

    const expediente = this.registry.getExpediente(factoryKey);
    if (!expediente) {
      throw new Error(`[CB-04 Runtime] Expediente not found: ${factoryKey}`);
    }

    if (this.compliance) {
      const pre = this.compliance.assertPreExecution(factoryKey, {
        actor: motorId,
        operation: `motor_execute:${motorId}`,
      });
      if (!pre.valid) {
        throw new Error(
          `[CB-04 Runtime] Compliance blocked: ${pre.failures.map((f) => f.code).join(", ")}`
        );
      }
    }

    const ctx = this.getExecutionContext(factoryKey);
    const dep = resolveDependencies(motorId, entry, ctx);
    if (!dep.allowed) {
      throw new Error(
        `[CB-04 Runtime] Dependency failure: ${dep.failures.map((f) => f.rule).join(", ")}`
      );
    }

    this.executionLock.acquire(factoryKey, motorId, options.invoker ?? motorId);

    const startedAt = new Date().toISOString();
    try {
      const handler =
        options.useStub !== false
          ? this.handlers[motorId] ?? getStubHandler(motorId)
          : this.handlers[motorId];

      if (!handler) {
        throw new Error(`[CB-04 Runtime] No handler registered for ${motorId}`);
      }

      const result = await handler({
        factoryKey,
        motorId,
        capId: entry.cap,
        inputs: options.inputs ?? {},
        registry: this.registry,
      });

      const manifest = buildMotorManifest({
        motorId,
        capId: entry.cap,
        factoryKey,
        inputs: options.inputs,
        outputs: result.outputs,
        knowledgeDelta: result.knowledgeDelta,
        startedAt,
        finishedAt: new Date().toISOString(),
        evidenceIntercept: true,
      });

      this.registry.registerElrAct(
        factoryKey,
        "motor_manifests",
        manifest,
        { actor: motorId }
      );

      const completed = this._completedByFactory.get(factoryKey) ?? new Set();
      completed.add(motorId);
      this._completedByFactory.set(factoryKey, completed);

      return manifest;
    } finally {
      this.executionLock.release(factoryKey, motorId);
    }
  }

  /**
   * @param {string} motorId
   * @param {Function} handler
   */
  registerHandler(motorId, handler) {
    assertMotorInCatalog(motorId);
    this.handlers[motorId] = handler;
  }
}

/**
 * @param {string} motorId
 * @param {string} [capId]
 */
export function validateMotorRegistration(motorId, capId) {
  const entry = getMotorCatalogEntry(motorId);
  if (!entry) {
    return { valid: false, reason: "not_in_omc" };
  }
  if (!entry.cap) {
    return { valid: false, reason: "missing_cap_parent" };
  }
  if (capId && entry.cap !== capId) {
    return { valid: false, reason: "cap_mismatch" };
  }
  return { valid: true, entry };
}

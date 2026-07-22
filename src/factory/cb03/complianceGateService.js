/**
 * CB-03 — Compliance Gate Service (P0)
 * MOT-CMP-01 + LOOP-XVR-CMP-01 + Registry/ELR integration.
 */

import { isPhaseApproved } from "../cb00/constructionGovernance.js";
import { FactoryRegistry } from "../cb01/factoryRegistry.js";
import { requiresCmpClearance, CLEARANCE_STATUS, isProductiveClearance } from "./clearanceProtocol.js";
import { ComplianceStateStore } from "./complianceStateStore.js";
import { runConstitutionalValidators } from "./constitutionalValidators.js";
import { LoopXvrCmp01 } from "./loopXvrCmp01.js";
import { MotCmp01 } from "./motCmp01.js";
import { MotorLockRegistry } from "./motorLockRegistry.js";

export class ComplianceGateService {
  /**
   * @param {{
   *   registry?: FactoryRegistry,
   *   stateStore?: ComplianceStateStore,
   *   lockRegistry?: MotorLockRegistry,
   *   motCmp?: MotCmp01,
   *   loopCmp?: LoopXvrCmp01,
   * }} [deps]
   */
  constructor(deps = {}) {
    if (!isPhaseApproved("CB-02")) {
      throw new Error("[CB-03 Compliance] CB-02 must be APPROVED before Compliance P0");
    }
    this.registry = deps.registry ?? new FactoryRegistry();
    this.stateStore = deps.stateStore ?? new ComplianceStateStore();
    this.lockRegistry = deps.lockRegistry ?? new MotorLockRegistry();
    this.motCmp = deps.motCmp ?? new MotCmp01();
    this.loopCmp = deps.loopCmp ?? new LoopXvrCmp01();
  }

  /**
   * @param {string} factoryKey
   */
  getComplianceState(factoryKey) {
    return this.stateStore.read(factoryKey);
  }

  /**
   * @param {string} factoryKey
   * @param {import('./motCmp01.js').CmpEvaluationInput} input
   */
  evaluateAndRecordClearance(factoryKey, input = {}) {
    const cmpResult = this.motCmp.evaluate(input);
    const loopResult = this.loopCmp.supervise(cmpResult, {
      repeatViolation: input.repeatViolation,
      authorizationRevoked: input.authorizationRevoked,
    });

    const state = this.stateStore.read(factoryKey);
    const entry = {
      cmpResult,
      loopResult,
      recordedAt: new Date().toISOString(),
    };
    state.history.push(entry);
    state.clearance = cmpResult.clearance;
    state.clearanceId = cmpResult.clearanceId;
    state.violations = cmpResult.violations;
    state.loopAction = loopResult.action;

    if (loopResult.block && loopResult.suspendLocks) {
      this.lockRegistry.suspendAllLocks(factoryKey, {
        reason: loopResult.message,
        actor: LoopXvrCmp01.ACTOR,
      });
      state.clearance = CLEARANCE_STATUS.BLOCK;
    } else if (cmpResult.clearance === CLEARANCE_STATUS.PASS) {
      this.lockRegistry.releaseLocks(factoryKey);
    }

    this.stateStore.write(factoryKey, state);

    this.registry.registerElrAct(
      factoryKey,
      "motor_manifests",
      {
        kind: "MOT_CMP_CLEARANCE",
        clearance: state.clearance,
        clearanceId: cmpResult.clearanceId,
        violations: cmpResult.violations,
        loopAction: loopResult.action,
      },
      { actor: MotCmp01.ACTOR }
    );

    if (cmpResult.violations.length > 0) {
      this.registry.registerElrAct(
        factoryKey,
        "conflict_resolutions",
        {
          kind: "COMPLIANCE_VIOLATION",
          violations: cmpResult.violations,
          blockReasons: cmpResult.blockReasons,
        },
        { actor: LoopXvrCmp01.ACTOR }
      );
    }

    return { cmpResult, loopResult, state };
  }

  /**
   * @param {string} factoryKey
   * @param {string} toState
   * @param {{ actor: string, reason?: string }} context
   */
  guardedTransition(factoryKey, toState, context) {
    const compliance = this.stateStore.read(factoryKey);
    const blocked = this.lockRegistry.isBlocked(factoryKey);

    const validation = runConstitutionalValidators({
      actor: context.actor,
      operation: `transition:${toState}`,
      toState,
      clearance: compliance.clearance,
      blocked,
    });

    if (!validation.valid) {
      throw new Error(
        `[CB-03 Compliance] Transition blocked: ${validation.failures.map((f) => f.code).join(", ")}`
      );
    }

    if (requiresCmpClearance(toState) && !isProductiveClearance(compliance.clearance)) {
      throw new Error(`[CB-03 Compliance] NASC-01: clearance required for ${toState}`);
    }

    return this.registry.transitionState(factoryKey, toState, context);
  }

  /**
   * @param {string} factoryKey
   * @param {{ actor: string, operation: string, accessTier?: string }} context
   */
  assertPreExecution(factoryKey, context) {
    const compliance = this.stateStore.read(factoryKey);
    return runConstitutionalValidators({
      actor: context.actor,
      operation: context.operation,
      clearance: compliance.clearance,
      blocked: this.lockRegistry.isBlocked(factoryKey),
      accessTier: context.accessTier,
    });
  }

  /**
   * @param {string} factoryKey
   * @param {string} reason
   */
  emitComplianceBlock(factoryKey, reason) {
    const loopResult = {
      actor: LoopXvrCmp01.ACTOR,
      action: "FIN-C",
      block: true,
      message: reason,
      suspendLocks: true,
    };
    this.lockRegistry.suspendAllLocks(factoryKey, {
      reason,
      actor: LoopXvrCmp01.ACTOR,
    });

    const state = this.stateStore.read(factoryKey);
    state.clearance = CLEARANCE_STATUS.BLOCK;
    state.loopAction = "FIN-C";
    state.history.push({ loopResult, recordedAt: new Date().toISOString() });
    this.stateStore.write(factoryKey, state);

    this.registry.registerElrAct(
      factoryKey,
      "conflict_resolutions",
      { kind: "LOOP_XVR_CMP_BLOCK", reason, policy: "LK-02" },
      { actor: LoopXvrCmp01.ACTOR }
    );

    return loopResult;
  }
}

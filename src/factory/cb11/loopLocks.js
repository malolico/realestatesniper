/**
 * CB-11 — Loop locks LK-01..04 integration
 */

import { MotorExecutionLock } from "../cb04/motorExecutionLock.js";
import { MotorLockRegistry } from "../cb03/motorLockRegistry.js";

/**
 * LK-03 — one active loop re-executor per factory_key
 */
export class LoopExecutionLock {
  constructor() {
    /** @type {Map<string, { loopId: string, holder: string, at: string }>} */
    this._active = new Map();
  }

  /**
   * @param {string} factoryKey
   * @param {string} loopId
   * @param {string} holder
   */
  acquire(factoryKey, loopId, holder) {
    const current = this._active.get(factoryKey);
    if (current) {
      throw new Error(
        `[CB-11 LK-03] Loop lock held by ${current.loopId} — cannot run ${loopId}`
      );
    }
    const record = { loopId, holder: holder ?? loopId, at: new Date().toISOString(), policy: "LK-03" };
    this._active.set(factoryKey, record);
    return record;
  }

  /**
   * @param {string} factoryKey
   * @param {string} loopId
   */
  release(factoryKey, loopId) {
    const current = this._active.get(factoryKey);
    if (current && current.loopId !== loopId) {
      throw new Error(`[CB-11 LK-03] Cannot release ${loopId} — lock held by ${current.loopId}`);
    }
    this._active.delete(factoryKey);
    return { released: true, factoryKey, loopId };
  }
}

/**
 * @param {MotorExecutionLock} motorLock
 * @param {string} factoryKey
 * @param {string} motorId
 * @param {string} holder
 */
export function verifyLk01MotorLock(motorLock, factoryKey, motorId, holder) {
  motorLock.acquire(factoryKey, motorId, holder);
  motorLock.release(factoryKey, motorId);
  return { policy: "LK-01", verified: true };
}

/**
 * @param {MotorLockRegistry} lockRegistry
 * @param {string} factoryKey
 */
export function verifyLk02ComplianceBlock(lockRegistry, factoryKey) {
  const blocked = lockRegistry.isBlocked(factoryKey);
  return { policy: "LK-02", blocked, verified: true };
}

/**
 * @param {LoopExecutionLock} loopLock
 * @param {string} factoryKey
 * @param {string} loopId
 */
export function verifyLk03LoopLock(loopLock, factoryKey, loopId) {
  loopLock.acquire(factoryKey, loopId, "stress-test");
  try {
    loopLock.acquire(factoryKey, "LOOP-OTHER-01", "stress-test");
    return { policy: "LK-03", verified: false };
  } catch {
    return { policy: "LK-03", verified: true };
  } finally {
    loopLock.release(factoryKey, loopId);
  }
}

/**
 * LK-04 — supervisor orchestrates sub-loops without motor re-execution.
 *
 * @param {{ orchestrationOnly?: boolean, motorsReExecuted?: boolean }} supervisorResult
 */
export function verifyLk04Orchestration(supervisorResult) {
  const compliant =
    supervisorResult.orchestrationOnly === true && supervisorResult.motorsReExecuted !== true;
  return { policy: "LK-04", compliant, verified: compliant };
}

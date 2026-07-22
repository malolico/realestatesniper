/**
 * CB-03 — Motor lock registry — LK-02 CMP BLOCK suspends all locks
 */

export class MotorLockRegistry {
  constructor() {
    /** @type {Map<string, { blocked: boolean, reason: string, actor: string, at: string }>} */
    this._locks = new Map();
  }

  /**
   * @param {string} factoryKey
   */
  isBlocked(factoryKey) {
    return this._locks.get(factoryKey)?.blocked === true;
  }

  /**
   * @param {string} factoryKey
   */
  getBlock(factoryKey) {
    return this._locks.get(factoryKey) ?? null;
  }

  /**
   * @param {string} factoryKey
   * @param {{ reason: string, actor?: string }} context
   */
  suspendAllLocks(factoryKey, context) {
    const record = {
      blocked: true,
      reason: context.reason,
      actor: context.actor ?? "LOOP-XVR-CMP-01",
      at: new Date().toISOString(),
      policy: "LK-02",
    };
    this._locks.set(factoryKey, record);
    return record;
  }

  /**
   * @param {string} factoryKey
   */
  releaseLocks(factoryKey) {
    this._locks.delete(factoryKey);
    return { released: true, factoryKey };
  }
}

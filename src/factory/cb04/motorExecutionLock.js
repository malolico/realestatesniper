/**
 * CB-04 — LK-01 Motor execution lock (one motor — one active re-executor per factory_key)
 */

export class MotorExecutionLock {
  constructor() {
    /** @type {Map<string, { motorId: string, holder: string, at: string }>} */
    this._active = new Map();
  }

  /**
   * @param {string} factoryKey
   */
  getActive(factoryKey) {
    return this._active.get(factoryKey) ?? null;
  }

  /**
   * @param {string} factoryKey
   * @param {string} motorId
   * @param {string} holder
   */
  acquire(factoryKey, motorId, holder) {
    const current = this._active.get(factoryKey);
    if (current) {
      throw new Error(
        `[CB-04 LK-01] Lock held by ${current.motorId} (${current.holder}) — cannot run ${motorId}`
      );
    }
    const record = {
      motorId,
      holder: holder ?? motorId,
      at: new Date().toISOString(),
      policy: "LK-01",
    };
    this._active.set(factoryKey, record);
    return record;
  }

  /**
   * @param {string} factoryKey
   * @param {string} motorId
   */
  release(factoryKey, motorId) {
    const current = this._active.get(factoryKey);
    if (current && current.motorId !== motorId) {
      throw new Error(`[CB-04 LK-01] Cannot release ${motorId} — lock held by ${current.motorId}`);
    }
    this._active.delete(factoryKey);
    return { released: true, factoryKey, motorId };
  }
}

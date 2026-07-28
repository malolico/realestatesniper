/**
 * P-INT-03 Durable — In-process Object Store backend (Phase 1).
 *
 * Key → bytes map simulating an object store medium without vendor SDKs,
 * network, Supabase, SQLite, or package.json changes.
 *
 * Mandate: P-INT-03-DURABLE-OBJECT-STORE-IMPL
 * Injectable only — never the FactoryRegistry default.
 */

import { assertObjectStoreBackend } from "./objectStoreBackend.js";

export class MemoryObjectStoreBackend {
  constructor() {
    /** @type {Map<string, string>} */
    this.#objects = new Map();
    assertObjectStoreBackend(this);
  }

  /** @type {Map<string, string>} */
  #objects;

  /**
   * @param {string} key
   * @returns {boolean}
   */
  exists(key) {
    return this.#objects.has(key);
  }

  /**
   * @param {string} key
   * @returns {string|null} UTF-8 object body
   */
  get(key) {
    if (!this.#objects.has(key)) return null;
    return this.#objects.get(key);
  }

  /**
   * @param {string} key
   * @param {string} body UTF-8
   */
  put(key, body) {
    if (typeof key !== "string" || key.length === 0) {
      throw new Error("[MemoryObjectStoreBackend] key must be a non-empty string");
    }
    if (typeof body !== "string") {
      throw new Error("[MemoryObjectStoreBackend] body must be a UTF-8 string");
    }
    this.#objects.set(key, body);
  }

  /**
   * @param {string} key
   */
  delete(key) {
    this.#objects.delete(key);
  }

  /**
   * @param {string} [prefix]
   * @returns {string[]}
   */
  listKeys(prefix = "") {
    const keys = [];
    for (const key of this.#objects.keys()) {
      if (prefix === "" || key.startsWith(prefix)) keys.push(key);
    }
    return keys.sort();
  }
}

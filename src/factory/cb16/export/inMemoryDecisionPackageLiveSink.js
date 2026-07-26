/**
 * P-INT-04 Live — InMemory / Fake DecisionPackageLiveSinkPort (Plan §5.2 / §20).
 * No cloud SDK. Object-storage-shaped immutable putIfAbsent.
 */

import { assertValidFactoryKey } from "../../cb01/factoryKey.js";
import { sha256Hex } from "./decisionPackageIntegrity.js";
import {
  DEFAULT_LIVE_MAX_BYTES,
  assertLivePutMetaAllowlist,
  buildRemoteRef,
  resolveRemoteKey,
  verifyLiveEnvelopeBytes,
} from "./decisionPackageLiveSinkPort.js";

/**
 * @typedef {{
 *   principal?: string|null,
 *   requireAuth?: boolean,
 *   allowPrefix?: string,
 *   maxBytes?: number,
 * }} InMemoryLiveSinkOptions
 */

export class InMemoryDecisionPackageLiveSink {
  /**
   * @param {InMemoryLiveSinkOptions} [options]
   */
  constructor(options = {}) {
    /** @type {Map<string, string>} */
    this.#objects = new Map();
    this.requireAuth = options.requireAuth !== false;
    this.principal = options.principal ?? "FactoryOps";
    this.allowPrefix = options.allowPrefix ?? "live/v1/";
    this.maxBytes = options.maxBytes ?? DEFAULT_LIVE_MAX_BYTES;
    /** @type {{ attempts: number, success: number, fail: number, conflict: number }} */
    this.metrics = { attempts: 0, success: 0, fail: 0, conflict: 0 };
  }

  #objects;

  /**
   * Health probe — fake always OK (Plan §19).
   */
  health() {
    return { ok: true, adapter: "InMemoryDecisionPackageLiveSink" };
  }

  /**
   * @param {string} factoryKey
   * @param {string} packageId
   */
  resolveRemoteKey(factoryKey, packageId) {
    return resolveRemoteKey(factoryKey, packageId);
  }

  /**
   * @param {string} [principal]
   */
  #assertAuthz(principal) {
    const p = principal === undefined ? this.principal : principal;
    if (this.requireAuth && (p == null || p === "" || p === "anonymous")) {
      const err = new Error("[P-INT-04 Live] AUTHZ_FAIL — anonymous denied");
      err.code = "AUTHZ_FAIL";
      throw err;
    }
    if (this.requireAuth && p !== "FactoryOps" && p !== "export-principal") {
      const err = new Error(`[P-INT-04 Live] AUTHZ_FAIL — principal denied: ${p}`);
      err.code = "AUTHZ_FAIL";
      throw err;
    }
  }

  /**
   * @param {string} remoteKey
   * @param {string} [factoryKey]
   */
  #assertAllowlist(remoteKey, factoryKey) {
    if (typeof remoteKey !== "string" || remoteKey.includes("..")) {
      const err = new Error("[P-INT-04 Live] Destination denied (fail-closed)");
      err.code = "DESTINATION_DENIED";
      throw err;
    }
    if (!remoteKey.startsWith(this.allowPrefix)) {
      const err = new Error("[P-INT-04 Live] Destination allowlist deny");
      err.code = "DESTINATION_DENIED";
      throw err;
    }
    if (factoryKey) {
      assertValidFactoryKey(factoryKey);
      const expectedPrefix = `${this.allowPrefix}${factoryKey}/`;
      if (!remoteKey.startsWith(expectedPrefix)) {
        const err = new Error("[P-INT-04 Live] Destination allowlist deny (factory_key)");
        err.code = "DESTINATION_DENIED";
        throw err;
      }
    }
    // SSRF: no arbitrary URL schemes
    if (/^[a-zA-Z][a-zA-Z0-9+.-]*:\/\//.test(remoteKey)) {
      const err = new Error("[P-INT-04 Live] Arbitrary URL destination prohibited");
      err.code = "DESTINATION_DENIED";
      throw err;
    }
  }

  /**
   * @param {string} remoteKey
   * @param {{ principal?: string|null }} [opts]
   */
  head(remoteKey, opts = {}) {
    this.#assertAuthz(opts.principal);
    this.#assertAllowlist(remoteKey);
    const bytes = this.#objects.get(remoteKey);
    if (bytes == null) {
      return { exists: false, remoteKey };
    }
    return {
      exists: true,
      remoteKey,
      contentSha256: sha256Hex(bytes),
      size: Buffer.byteLength(bytes, "utf8"),
    };
  }

  /**
   * @param {string} remoteKey
   * @param {string} bytes
   * @param {object} meta
   * @param {{ principal?: string|null }} [opts]
   */
  putIfAbsent(remoteKey, bytes, meta, opts = {}) {
    this.metrics.attempts += 1;
    try {
      this.#assertAuthz(opts.principal);
      assertLivePutMetaAllowlist(meta);
      this.#assertAllowlist(remoteKey, meta.factory_key);

      if (typeof bytes !== "string") {
        throw Object.assign(new Error("[P-INT-04 Live] bytes must be string"), {
          code: "INVALID_BYTES",
        });
      }
      if (Buffer.byteLength(bytes, "utf8") > this.maxBytes) {
        throw Object.assign(new Error("[P-INT-04 Live] max bytes exceeded"), {
          code: "SIZE_LIMIT",
        });
      }

      const hash = sha256Hex(bytes);
      if (hash !== meta.contentSha256) {
        throw Object.assign(
          new Error("[P-INT-04 Live] meta.contentSha256 mismatch with bytes"),
          { code: "META_HASH_MISMATCH" }
        );
      }
      if (meta.remoteRef !== buildRemoteRef(remoteKey)) {
        throw Object.assign(new Error("[P-INT-04 Live] meta.remoteRef mismatch"), {
          code: "META_REF_MISMATCH",
        });
      }

      const existing = this.#objects.get(remoteKey);
      if (existing != null) {
        if (existing === bytes) {
          this.metrics.success += 1;
          return {
            written: false,
            remoteKey,
            etagOrVersion: sha256Hex(existing),
            contentSha256: sha256Hex(existing),
            remoteRef: buildRemoteRef(remoteKey),
          };
        }
        this.metrics.conflict += 1;
        this.metrics.fail += 1;
        throw Object.assign(
          new Error("[P-INT-04 Live] CONFLICT — same key different bytes"),
          { code: "CONFLICT" }
        );
      }

      this.#objects.set(remoteKey, bytes);
      this.metrics.success += 1;
      return {
        written: true,
        remoteKey,
        etagOrVersion: hash,
        contentSha256: hash,
        remoteRef: buildRemoteRef(remoteKey),
      };
    } catch (err) {
      if (err.code !== "CONFLICT") this.metrics.fail += 1;
      throw err;
    }
  }

  /**
   * @param {string} remoteKey
   * @param {{ principal?: string|null }} [opts]
   */
  get(remoteKey, opts = {}) {
    this.#assertAuthz(opts.principal);
    this.#assertAllowlist(remoteKey);
    const bytes = this.#objects.get(remoteKey);
    if (bytes == null) {
      throw Object.assign(new Error("[P-INT-04 Live] Envelope missing (fail-closed)"), {
        code: "MISSING",
      });
    }
    return bytes;
  }

  /**
   * @param {string} remoteKey
   * @param {object} expected
   * @param {{ principal?: string|null }} [opts]
   */
  verify(remoteKey, expected, opts = {}) {
    this.#assertAuthz(opts.principal);
    this.#assertAllowlist(remoteKey, expected?.factory_key);
    const bytes = this.get(remoteKey, opts);
    return verifyLiveEnvelopeBytes(bytes, expected);
  }

  /**
   * Test/cleanup helper — not a product delete API.
   * @param {string} remoteKey
   */
  removeForTests(remoteKey) {
    this.#objects.delete(remoteKey);
  }

  /**
   * @param {string} remoteKey
   */
  exists(remoteKey) {
    return this.#objects.has(remoteKey);
  }
}

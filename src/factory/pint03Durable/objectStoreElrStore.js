/**
 * P-INT-03 Durable — Object Store ELR adapter (Phase 1).
 *
 * Implements ElrStorePort over an injectable Object Store backend.
 * Activated only by explicit FactoryRegistry({ store }) injection.
 * FileElrStore remains Registry default — this module never flips it.
 *
 * Mandate: P-INT-03-DURABLE-OBJECT-STORE-IMPL
 * Path: OBJECT STORE only.
 *
 * Does not modify CB-01 / FactoryRegistry / ElrStorePort / ELR semantics.
 * No Supabase / SQLite / Dedicated DB / Product / Deals / Marketplace / Web.
 */

import { assertValidFactoryKey } from "../cb01/factoryKey.js";
import { factoryKeyToFilename } from "../cb01/fileElrStore.js";
import {
  STORE_FORMAT_VERSION,
  formatSidecarContent,
  parseSidecarContent,
  serializeExpedienteBytes,
  sha256Hex,
} from "../cb01/elrIntegrity.js";
import { assertElrStorePort } from "../cb01/elrStorePort.js";
import { assertObjectStoreBackend } from "./objectStoreBackend.js";

const OBJECT_PREFIX = "elr/expedientes/";
const RESOLVE_SCHEME = "object-store://pint03-durable/";

/**
 * @param {string} factoryKey
 */
function objectKeyFor(factoryKey) {
  return `${OBJECT_PREFIX}${factoryKeyToFilename(factoryKey)}`;
}

/**
 * Verify in-memory JSON + sidecar pair. Fail-closed.
 * @param {string} bytes
 * @param {string} sidecarRaw
 * @param {{ supportedVersions?: number[] }} [options]
 */
function verifyObjectPair(bytes, sidecarRaw, options = {}) {
  const supported = options.supportedVersions ?? [STORE_FORMAT_VERSION];
  if (bytes == null || typeof bytes !== "string") {
    throw new Error("[ObjectStoreElrStore] Canonical JSON missing");
  }
  if (sidecarRaw == null || typeof sidecarRaw !== "string") {
    throw new Error("[ObjectStoreElrStore] Sidecar missing (fail-closed)");
  }
  const meta = parseSidecarContent(sidecarRaw);
  if (!supported.includes(meta.storeFormatVersion)) {
    throw new Error(
      `[ObjectStoreElrStore] Unknown storeFormatVersion: ${meta.storeFormatVersion}`
    );
  }
  const hash = sha256Hex(bytes);
  if (hash !== meta.sha256) {
    throw new Error("[ObjectStoreElrStore] Checksum mismatch (fail-closed)");
  }
  let record;
  try {
    record = JSON.parse(bytes);
  } catch {
    throw new Error("[ObjectStoreElrStore] Canonical JSON corrupt (fail-closed)");
  }
  if (record == null || typeof record !== "object") {
    throw new Error("[ObjectStoreElrStore] Canonical JSON not an object (fail-closed)");
  }
  return { bytes, hash, storeFormatVersion: meta.storeFormatVersion, record };
}

/**
 * @param {string} filename
 */
function isCanonicalExpedienteObjectKey(key) {
  if (!key.startsWith(OBJECT_PREFIX)) return false;
  if (!key.endsWith(".json")) return false;
  if (key.includes(".sha256")) return false;
  if (key.includes(".tmp")) return false;
  if (key.includes(".bak")) return false;
  return true;
}

export class ObjectStoreElrStore {
  /**
   * @param {object} backend Object Store backend (Phase 1: MemoryObjectStoreBackend)
   * @param {{ storeFormatVersion?: number }} [options]
   */
  constructor(backend, options = {}) {
    assertObjectStoreBackend(backend);
    this.backend = backend;
    this.storeFormatVersion = options.storeFormatVersion ?? STORE_FORMAT_VERSION;
    assertElrStorePort(this);
  }

  /**
   * Logical object URI — not a local filesystem path.
   * Registry may call fs.existsSync/unlinkSync on this value; non-FS URIs are no-ops.
   * Provisional cleanup is performed via removeArtifacts.
   * @param {string} factoryKey
   */
  resolvePath(factoryKey) {
    return `${RESOLVE_SCHEME}${objectKeyFor(factoryKey)}`;
  }

  /**
   * @param {string} factoryKey
   */
  #keys(factoryKey) {
    const dataKey = objectKeyFor(factoryKey);
    return {
      dataKey,
      sidecarKey: `${dataKey}.sha256`,
      dataTmp: `${dataKey}.tmp`,
      sidecarTmp: `${dataKey}.sha256.tmp`,
      dataBak: `${dataKey}.bak`,
      sidecarBak: `${dataKey}.bak.sha256`,
    };
  }

  /**
   * Physical existence of canonical object — does not imply integrity.
   * @param {string} factoryKey
   */
  exists(factoryKey) {
    return this.backend.exists(objectKeyFor(factoryKey));
  }

  /**
   * @param {string} factoryKey
   * @returns {object|null}
   */
  read(factoryKey) {
    assertValidFactoryKey(factoryKey);
    const { dataKey, sidecarKey } = this.#keys(factoryKey);
    if (!this.backend.exists(dataKey)) {
      return null;
    }
    const bytes = this.backend.get(dataKey);
    const sidecarRaw = this.backend.get(sidecarKey);
    const { record } = verifyObjectPair(bytes, sidecarRaw, {
      supportedVersions: [this.storeFormatVersion],
    });
    return record;
  }

  /**
   * PREPARE → COMMIT (with ABORT on failure). Fail-closed; no silent repair.
   * @param {object} record
   */
  write(record) {
    assertValidFactoryKey(record.factory_key);
    const factoryKey = record.factory_key;
    const keys = this.#keys(factoryKey);

    const payload = {
      ...record,
      updatedAt: new Date().toISOString(),
    };
    const bytes = serializeExpedienteBytes(payload);
    const hash = sha256Hex(bytes);
    const sidecarBody = formatSidecarContent(this.storeFormatVersion, hash);

    this.#cleanTemps(keys);
    this.backend.put(keys.dataTmp, bytes);
    this.backend.put(keys.sidecarTmp, sidecarBody);

    const hadPrior = this.backend.exists(keys.dataKey);
    let priorBackedUp = false;

    try {
      if (hadPrior) {
        priorBackedUp = this.#backupPriorPair(keys);
      }

      this.backend.delete(keys.sidecarKey);
      this.backend.put(keys.dataKey, this.backend.get(keys.dataTmp));
      this.backend.put(keys.sidecarKey, this.backend.get(keys.sidecarTmp));

      verifyObjectPair(this.backend.get(keys.dataKey), this.backend.get(keys.sidecarKey), {
        supportedVersions: [this.storeFormatVersion],
      });

      this.#cleanTemps(keys);
      if (priorBackedUp) {
        this.backend.delete(keys.dataBak);
        this.backend.delete(keys.sidecarBak);
      }

      return payload;
    } catch (err) {
      this.#abortAfterFailedPromote(keys, { hadPrior, priorBackedUp });
      throw err;
    }
  }

  listFactoryKeys() {
    return this.backend
      .listKeys(OBJECT_PREFIX)
      .filter((k) => isCanonicalExpedienteObjectKey(k))
      .map((k) => k.slice(OBJECT_PREFIX.length).replace(/\.json$/, ""));
  }

  /**
   * Optional lifecycle: remove canonical + sidecar + temps + bak for a key.
   * @param {string} factoryKey
   */
  removeArtifacts(factoryKey) {
    assertValidFactoryKey(factoryKey);
    const keys = this.#keys(factoryKey);
    for (const key of Object.values(keys)) {
      this.backend.delete(key);
    }
  }

  /**
   * @param {ReturnType<ObjectStoreElrStore['#keys']>} keys
   */
  #cleanTemps(keys) {
    this.backend.delete(keys.dataTmp);
    this.backend.delete(keys.sidecarTmp);
  }

  /**
   * @param {ReturnType<ObjectStoreElrStore['#keys']>} keys
   * @returns {boolean}
   */
  #backupPriorPair(keys) {
    try {
      verifyObjectPair(this.backend.get(keys.dataKey), this.backend.get(keys.sidecarKey), {
        supportedVersions: [this.storeFormatVersion],
      });
    } catch {
      return false;
    }
    this.backend.put(keys.dataBak, this.backend.get(keys.dataKey));
    this.backend.put(keys.sidecarBak, this.backend.get(keys.sidecarKey));
    return true;
  }

  /**
   * @param {ReturnType<ObjectStoreElrStore['#keys']>} keys
   * @param {{ hadPrior: boolean, priorBackedUp: boolean }} ctx
   */
  #abortAfterFailedPromote(keys, ctx) {
    this.#cleanTemps(keys);

    if (
      ctx.priorBackedUp &&
      this.backend.exists(keys.dataBak) &&
      this.backend.exists(keys.sidecarBak)
    ) {
      try {
        verifyObjectPair(this.backend.get(keys.dataBak), this.backend.get(keys.sidecarBak), {
          supportedVersions: [this.storeFormatVersion],
        });
        this.backend.put(keys.dataKey, this.backend.get(keys.dataBak));
        this.backend.put(keys.sidecarKey, this.backend.get(keys.sidecarBak));
        verifyObjectPair(this.backend.get(keys.dataKey), this.backend.get(keys.sidecarKey), {
          supportedVersions: [this.storeFormatVersion],
        });
        this.backend.delete(keys.dataBak);
        this.backend.delete(keys.sidecarBak);
        return;
      } catch {
        // fall through — fail-closed
      }
    }

    if (this.backend.exists(keys.dataKey)) {
      try {
        verifyObjectPair(this.backend.get(keys.dataKey), this.backend.get(keys.sidecarKey), {
          supportedVersions: [this.storeFormatVersion],
        });
      } catch {
        this.backend.delete(keys.dataKey);
        this.backend.delete(keys.sidecarKey);
      }
    } else {
      this.backend.delete(keys.sidecarKey);
    }
  }
}

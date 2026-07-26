/**
 * CB-01 / P-INT-03 — Atomic / Hardened File ELR Store (offline local durable).
 *
 * Activated only by explicit injection into FactoryRegistry({ store }).
 * Does not change constitutional ELR semantics.
 *
 * Guarantee (honest): logical expediente atomicity + pair integrity +
 * deterministic recovery + fail-closed — NOT absolute multi-file FS atomicity.
 */

import fs from "node:fs";
import path from "node:path";
import { assertValidFactoryKey } from "./factoryKey.js";
import {
  DEFAULT_REGISTRY_ROOT,
  factoryKeyToFilename,
} from "./fileElrStore.js";
import {
  STORE_FORMAT_VERSION,
  formatSidecarContent,
  fsyncFile,
  serializeExpedienteBytes,
  sha256Hex,
  verifyExpedientePair,
} from "./elrIntegrity.js";
import { assertElrStorePort } from "./elrStorePort.js";

/**
 * @param {string} filename
 */
function isCanonicalExpedienteFilename(filename) {
  if (!filename.endsWith(".json")) return false;
  if (filename.includes(".sha256")) return false;
  if (filename.includes(".tmp")) return false;
  if (filename.includes(".bak")) return false;
  if (filename.includes(".recovery")) return false;
  return true;
}

/**
 * @param {string} target
 */
function safeUnlink(target) {
  try {
    if (fs.existsSync(target)) fs.unlinkSync(target);
  } catch {
    /* ignore */
  }
}

export class AtomicFileElrStore {
  /**
   * @param {string} [rootDir]
   * @param {{ storeFormatVersion?: number }} [options]
   */
  constructor(rootDir = DEFAULT_REGISTRY_ROOT, options = {}) {
    this.rootDir = rootDir;
    this.expedientesDir = path.join(rootDir, "expedientes");
    this.storeFormatVersion = options.storeFormatVersion ?? STORE_FORMAT_VERSION;
    assertElrStorePort(this);
  }

  ensureDirs() {
    fs.mkdirSync(this.expedientesDir, { recursive: true });
  }

  /**
   * @param {string} factoryKey
   */
  resolvePath(factoryKey) {
    return path.join(this.expedientesDir, factoryKeyToFilename(factoryKey));
  }

  /**
   * @param {string} factoryKey
   */
  resolveSidecarPath(factoryKey) {
    return `${this.resolvePath(factoryKey)}.sha256`;
  }

  /**
   * @param {string} factoryKey
   */
  #paths(factoryKey) {
    const dataPath = this.resolvePath(factoryKey);
    return {
      dataPath,
      sidecarPath: `${dataPath}.sha256`,
      dataTmp: `${dataPath}.tmp`,
      sidecarTmp: `${dataPath}.sha256.tmp`,
      dataBak: `${dataPath}.bak`,
      sidecarBak: `${dataPath}.bak.sha256`,
    };
  }

  /**
   * Physical existence of canonical JSON — does not imply integrity.
   * @param {string} factoryKey
   */
  exists(factoryKey) {
    return fs.existsSync(this.resolvePath(factoryKey));
  }

  /**
   * @param {string} factoryKey
   * @returns {object|null}
   */
  read(factoryKey) {
    assertValidFactoryKey(factoryKey);
    const { dataPath, sidecarPath } = this.#paths(factoryKey);
    if (!fs.existsSync(dataPath)) {
      return null;
    }
    const { record } = verifyExpedientePair(dataPath, sidecarPath, {
      supportedVersions: [STORE_FORMAT_VERSION],
    });
    return record;
  }

  /**
   * PREPARE → COMMIT (with ABORT/RECOVERY on failure).
   * @param {object} record
   */
  write(record) {
    this.ensureDirs();
    assertValidFactoryKey(record.factory_key);
    const factoryKey = record.factory_key;
    const paths = this.#paths(factoryKey);

    const payload = {
      ...record,
      updatedAt: new Date().toISOString(),
    };
    const bytes = serializeExpedienteBytes(payload);

    // --- PREPARE ---
    this.#cleanTemps(paths);
    fs.writeFileSync(paths.dataTmp, bytes, "utf8");
    fsyncFile(paths.dataTmp);

    const hash = sha256Hex(fs.readFileSync(paths.dataTmp));
    const sidecarBody = formatSidecarContent(this.storeFormatVersion, hash);
    fs.writeFileSync(paths.sidecarTmp, sidecarBody, "utf8");
    fsyncFile(paths.sidecarTmp);

    const hadPrior = fs.existsSync(paths.dataPath);
    let priorBackedUp = false;

    try {
      if (hadPrior) {
        // Prefer backing up an intact pair; if prior is corrupt, still move
        // whatever exists into bak only when sidecar+data both present and match.
        priorBackedUp = this.#backupPriorPair(paths);
      }

      // --- COMMIT promotion ---
      // Order: drop old sidecar first so read never accepts new JSON + old checksum.
      safeUnlink(paths.sidecarPath);
      fs.renameSync(paths.dataTmp, paths.dataPath);
      fs.renameSync(paths.sidecarTmp, paths.sidecarPath);

      verifyExpedientePair(paths.dataPath, paths.sidecarPath, {
        supportedVersions: [this.storeFormatVersion],
      });

      // Cleanup temps + bak only after verified commit
      this.#cleanTemps(paths);
      if (priorBackedUp) {
        safeUnlink(paths.dataBak);
        safeUnlink(paths.sidecarBak);
      }

      return payload;
    } catch (err) {
      this.#abortAfterFailedPromote(paths, { hadPrior, priorBackedUp });
      throw err;
    }
  }

  /**
   * Explicit RECOVERY: restore last intact bak pair when possible.
   * Not invoked by read() (no silent repair).
   * @param {string} factoryKey
   * @returns {{ recovered: boolean, record?: object, reason: string }}
   */
  recoverFromBackup(factoryKey) {
    assertValidFactoryKey(factoryKey);
    const paths = this.#paths(factoryKey);

    if (!fs.existsSync(paths.dataBak) || !fs.existsSync(paths.sidecarBak)) {
      return { recovered: false, reason: "no_intact_backup" };
    }

    try {
      verifyExpedientePair(paths.dataBak, paths.sidecarBak, {
        supportedVersions: [STORE_FORMAT_VERSION],
      });
    } catch {
      return { recovered: false, reason: "backup_not_intact" };
    }

    fs.copyFileSync(paths.dataBak, paths.dataPath);
    fsyncFile(paths.dataPath);
    fs.copyFileSync(paths.sidecarBak, paths.sidecarPath);
    fsyncFile(paths.sidecarPath);

    const { record } = verifyExpedientePair(paths.dataPath, paths.sidecarPath, {
      supportedVersions: [STORE_FORMAT_VERSION],
    });

    safeUnlink(paths.dataBak);
    safeUnlink(paths.sidecarBak);
    this.#cleanTemps(paths);

    return { recovered: true, record, reason: "restored_from_bak" };
  }

  listFactoryKeys() {
    this.ensureDirs();
    if (!fs.existsSync(this.expedientesDir)) return [];
    return fs
      .readdirSync(this.expedientesDir)
      .filter((f) => isCanonicalExpedienteFilename(f))
      .map((f) => f.replace(/\.json$/, ""));
  }

  /**
   * Optional lifecycle: remove JSON + sidecar + temps + bak for a key.
   * @param {string} factoryKey
   */
  removeArtifacts(factoryKey) {
    assertValidFactoryKey(factoryKey);
    const paths = this.#paths(factoryKey);
    for (const p of Object.values(paths)) {
      safeUnlink(p);
    }
  }

  /**
   * @param {ReturnType<AtomicFileElrStore['#paths']>} paths
   */
  #cleanTemps(paths) {
    safeUnlink(paths.dataTmp);
    safeUnlink(paths.sidecarTmp);
  }

  /**
   * @param {ReturnType<AtomicFileElrStore['#paths']>} paths
   * @returns {boolean} true if bak pair written
   */
  #backupPriorPair(paths) {
    try {
      verifyExpedientePair(paths.dataPath, paths.sidecarPath, {
        supportedVersions: [STORE_FORMAT_VERSION],
      });
    } catch {
      // Prior not intact — do not invent a bak from mismatched files.
      return false;
    }
    fs.copyFileSync(paths.dataPath, paths.dataBak);
    fsyncFile(paths.dataBak);
    fs.copyFileSync(paths.sidecarPath, paths.sidecarBak);
    fsyncFile(paths.sidecarBak);
    return true;
  }

  /**
   * ABORT: restore last intact pair when possible; else leave fail-closed.
   * @param {ReturnType<AtomicFileElrStore['#paths']>} paths
   * @param {{ hadPrior: boolean, priorBackedUp: boolean }} ctx
   */
  #abortAfterFailedPromote(paths, ctx) {
    this.#cleanTemps(paths);

    if (ctx.priorBackedUp && fs.existsSync(paths.dataBak) && fs.existsSync(paths.sidecarBak)) {
      try {
        verifyExpedientePair(paths.dataBak, paths.sidecarBak, {
          supportedVersions: [STORE_FORMAT_VERSION],
        });
        fs.copyFileSync(paths.dataBak, paths.dataPath);
        fsyncFile(paths.dataPath);
        fs.copyFileSync(paths.sidecarBak, paths.sidecarPath);
        fsyncFile(paths.sidecarPath);
        verifyExpedientePair(paths.dataPath, paths.sidecarPath, {
          supportedVersions: [STORE_FORMAT_VERSION],
        });
        safeUnlink(paths.dataBak);
        safeUnlink(paths.sidecarBak);
        return;
      } catch {
        // fall through — fail-closed
      }
    }

    // Create incomplete or unrestorable: remove partial canonical if pair invalid
    if (fs.existsSync(paths.dataPath)) {
      try {
        verifyExpedientePair(paths.dataPath, paths.sidecarPath, {
          supportedVersions: [STORE_FORMAT_VERSION],
        });
      } catch {
        safeUnlink(paths.dataPath);
        safeUnlink(paths.sidecarPath);
      }
    } else {
      safeUnlink(paths.sidecarPath);
    }
  }
}

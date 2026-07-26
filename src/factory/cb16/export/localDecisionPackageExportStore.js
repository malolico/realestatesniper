/**
 * P-INT-04 Offline — thin LocalExportPort / store (Plan §18–§21).
 */

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { assertValidFactoryKey } from "../../cb01/factoryKey.js";
import {
  EXPORT_SCHEMA_VERSION,
  formatExportSidecar,
  fsyncFile,
  sha256Hex,
  validateExportEnvelope,
  verifyExportArtifactPair,
} from "./decisionPackageIntegrity.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
export const DEFAULT_DECISION_PACKAGE_EXPORT_ROOT = path.resolve(
  __dirname,
  "../../../../data/factory-decision-packages"
);

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

/**
 * Thin LocalExportPort implementation (Plan §20).
 * Alias: LocalExportPort.
 */
export class LocalDecisionPackageExportStore {
  /**
   * @param {string} [rootDir]
   */
  constructor(rootDir = DEFAULT_DECISION_PACKAGE_EXPORT_ROOT) {
    this.rootDir = rootDir;
  }

  ensureDirs(factoryKey) {
    assertValidFactoryKey(factoryKey);
    fs.mkdirSync(this.#keyDir(factoryKey), { recursive: true });
  }

  /**
   * @param {string} factoryKey
   */
  #keyDir(factoryKey) {
    assertValidFactoryKey(factoryKey);
    return path.join(this.rootDir, factoryKey);
  }

  /**
   * @param {string} factoryKey
   * @param {string} packageId
   */
  resolvePath(factoryKey, packageId) {
    assertValidFactoryKey(factoryKey);
    if (typeof packageId !== "string" || !packageId.startsWith("dpkg-")) {
      throw new Error("[P-INT-04 ExportStore] Invalid packageId");
    }
    if (packageId.includes("..") || packageId.includes("/") || packageId.includes("\\")) {
      throw new Error("[P-INT-04 ExportStore] packageId path traversal rejected");
    }
    return path.join(this.#keyDir(factoryKey), `${packageId}.json`);
  }

  /**
   * @param {string} factoryKey
   * @param {string} packageId
   */
  resolveSidecarPath(factoryKey, packageId) {
    return `${this.resolvePath(factoryKey, packageId)}.sha256`;
  }

  /**
   * @param {string} factoryKey
   * @param {string} [packageId]
   */
  exists(factoryKey, packageId) {
    if (packageId) {
      return fs.existsSync(this.resolvePath(factoryKey, packageId));
    }
    return this.listByFactoryKey(factoryKey).length > 0;
  }

  /**
   * Relative ref for ELR (posix-style under store root).
   * @param {string} factoryKey
   * @param {string} packageId
   */
  relativeRef(factoryKey, packageId) {
    return `${factoryKey}/${packageId}.json`;
  }

  /**
   * PREPARE → COMMIT → VERIFY. Does not touch ELR.
   * @param {object} envelope
   */
  write(envelope) {
    validateExportEnvelope(envelope);
    const factoryKey = envelope.factory_key;
    const packageId = envelope.packageId;
    this.ensureDirs(factoryKey);

    const dataPath = this.resolvePath(factoryKey, packageId);
    const sidecarPath = this.resolveSidecarPath(factoryKey, packageId);
    const dataTmp = `${dataPath}.tmp`;
    const sidecarTmp = `${sidecarPath}.tmp`;
    const dataBak = `${dataPath}.bak`;
    const sidecarBak = `${sidecarPath}.bak`;

    const envelopeBytes = `${JSON.stringify(envelope)}\n`;

    safeUnlink(dataTmp);
    safeUnlink(sidecarTmp);

    fs.writeFileSync(dataTmp, envelopeBytes, "utf8");
    fsyncFile(dataTmp);
    const fileHash = sha256Hex(fs.readFileSync(dataTmp));
    fs.writeFileSync(sidecarTmp, formatExportSidecar(fileHash), "utf8");
    fsyncFile(sidecarTmp);

    let priorBackedUp = false;
    try {
      if (fs.existsSync(dataPath) && fs.existsSync(sidecarPath)) {
        try {
          verifyExportArtifactPair(dataPath, sidecarPath);
          fs.copyFileSync(dataPath, dataBak);
          fsyncFile(dataBak);
          fs.copyFileSync(sidecarPath, sidecarBak);
          fsyncFile(sidecarBak);
          priorBackedUp = true;
        } catch {
          priorBackedUp = false;
        }
      }

      safeUnlink(sidecarPath);
      fs.renameSync(dataTmp, dataPath);
      fs.renameSync(sidecarTmp, sidecarPath);

      const verified = verifyExportArtifactPair(dataPath, sidecarPath);
      safeUnlink(dataTmp);
      safeUnlink(sidecarTmp);
      if (priorBackedUp) {
        safeUnlink(dataBak);
        safeUnlink(sidecarBak);
      }

      return {
        packageId: verified.packageId,
        factory_key: verified.factory_key,
        path: dataPath,
        sidecarPath,
        relativeRef: this.relativeRef(factoryKey, packageId),
        exportSchemaVersion: EXPORT_SCHEMA_VERSION,
        canonicalContentChecksum: verified.canonicalContentChecksum,
      };
    } catch (err) {
      safeUnlink(dataTmp);
      safeUnlink(sidecarTmp);
      if (priorBackedUp && fs.existsSync(dataBak) && fs.existsSync(sidecarBak)) {
        try {
          fs.copyFileSync(dataBak, dataPath);
          fs.copyFileSync(sidecarBak, sidecarPath);
          verifyExportArtifactPair(dataPath, sidecarPath);
          safeUnlink(dataBak);
          safeUnlink(sidecarBak);
        } catch {
          /* leave fail-closed */
        }
      } else if (fs.existsSync(dataPath)) {
        try {
          verifyExportArtifactPair(dataPath, sidecarPath);
        } catch {
          safeUnlink(dataPath);
          safeUnlink(sidecarPath);
        }
      }
      throw err;
    }
  }

  /**
   * @param {string} factoryKey
   * @param {string} packageId
   */
  read(factoryKey, packageId) {
    const dataPath = this.resolvePath(factoryKey, packageId);
    const sidecarPath = this.resolveSidecarPath(factoryKey, packageId);
    if (!fs.existsSync(dataPath)) {
      return null;
    }
    return verifyExportArtifactPair(dataPath, sidecarPath);
  }

  /**
   * @param {string} factoryKey
   * @param {string} packageId
   */
  verifyIntegrity(factoryKey, packageId) {
    const dataPath = this.resolvePath(factoryKey, packageId);
    const sidecarPath = this.resolveSidecarPath(factoryKey, packageId);
    return verifyExportArtifactPair(dataPath, sidecarPath);
  }

  /**
   * @param {string} factoryKey
   */
  listByFactoryKey(factoryKey) {
    this.ensureDirs(factoryKey);
    const dir = this.#keyDir(factoryKey);
    if (!fs.existsSync(dir)) return [];
    return fs
      .readdirSync(dir)
      .filter((f) => f.endsWith(".json") && !f.includes(".tmp") && !f.includes(".bak") && !f.includes(".sha256"))
      .map((f) => f.replace(/\.json$/, ""))
      .filter((id) => id.startsWith("dpkg-"))
      .sort();
  }
}

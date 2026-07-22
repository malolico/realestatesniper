/**
 * CB-06 — Evidence registry persistence per factory_key
 */

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
export const DEFAULT_EVIDENCE_ROOT = path.resolve(
  __dirname,
  "../../../data/factory-evidence"
);

function defaultRegistry() {
  return {
    entries: [],
    conflicts: [],
    sufficiency: { status: "PENDING", evaluatedAt: null, version: 0 },
    materialManifestCount: 0,
    registeredCount: 0,
  };
}

export class EvidenceRegistryStore {
  /**
   * @param {string} [rootDir]
   */
  constructor(rootDir = DEFAULT_EVIDENCE_ROOT) {
    this.rootDir = rootDir;
    fs.mkdirSync(this.rootDir, { recursive: true });
  }

  /**
   * @param {string} factoryKey
   */
  filePath(factoryKey) {
    const safe = factoryKey.replace(/[^a-zA-Z0-9._-]/g, "_");
    return path.join(this.rootDir, `${safe}.json`);
  }

  /**
   * @param {string} factoryKey
   */
  read(factoryKey) {
    const file = this.filePath(factoryKey);
    if (!fs.existsSync(file)) {
      return defaultRegistry();
    }
    return { ...defaultRegistry(), ...JSON.parse(fs.readFileSync(file, "utf8")) };
  }

  /**
   * @param {string} factoryKey
   * @param {object} registry
   */
  write(factoryKey, registry) {
    const file = this.filePath(factoryKey);
    fs.writeFileSync(file, `${JSON.stringify(registry, null, 2)}\n`, "utf8");
    return registry;
  }

  /**
   * @param {string} factoryKey
   * @param {object} entry
   */
  appendEntry(factoryKey, entry) {
    const registry = this.read(factoryKey);
    registry.entries.push(entry);
    registry.registeredCount = registry.entries.length;
    return this.write(factoryKey, registry);
  }

  /**
   * @param {string} factoryKey
   * @param {object} conflict
   */
  appendConflict(factoryKey, conflict) {
    const registry = this.read(factoryKey);
    registry.conflicts.push(conflict);
    return this.write(factoryKey, registry);
  }

  /**
   * @param {string} factoryKey
   * @param {{ status: string, reasons?: string[] }} verdict
   */
  setSufficiency(factoryKey, verdict) {
    const registry = this.read(factoryKey);
    const version = (registry.sufficiency.version ?? 0) + 1;
    registry.sufficiency = {
      status: verdict.status,
      reasons: verdict.reasons ?? [],
      evaluatedAt: new Date().toISOString(),
      version,
    };
    return this.write(factoryKey, registry);
  }
}

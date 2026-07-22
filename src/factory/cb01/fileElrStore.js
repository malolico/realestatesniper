/**
 * CB-01 — File-backed ELR persistence (no Supabase)
 */

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { assertValidFactoryKey } from "./factoryKey.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
export const DEFAULT_REGISTRY_ROOT = path.resolve(__dirname, "../../../data/factory-registry");

/**
 * @param {string} factoryKey
 */
export function factoryKeyToFilename(factoryKey) {
  assertValidFactoryKey(factoryKey);
  return `${factoryKey.replace(/[^a-zA-Z0-9._-]/g, "_")}.json`;
}

export class FileElrStore {
  /**
   * @param {string} [rootDir]
   */
  constructor(rootDir = DEFAULT_REGISTRY_ROOT) {
    this.rootDir = rootDir;
    this.expedientesDir = path.join(rootDir, "expedientes");
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
  exists(factoryKey) {
    return fs.existsSync(this.resolvePath(factoryKey));
  }

  /**
   * @param {object} record — full expediente + elr bundle
   */
  write(record) {
    this.ensureDirs();
    assertValidFactoryKey(record.factory_key);
    const filePath = this.resolvePath(record.factory_key);
    const payload = {
      ...record,
      updatedAt: new Date().toISOString(),
    };
    fs.writeFileSync(filePath, `${JSON.stringify(payload, null, 2)}\n`, "utf8");
    return payload;
  }

  /**
   * @param {string} factoryKey
   */
  read(factoryKey) {
    const filePath = this.resolvePath(factoryKey);
    if (!fs.existsSync(filePath)) {
      return null;
    }
    const raw = fs.readFileSync(filePath, "utf8");
    return JSON.parse(raw);
  }

  listFactoryKeys() {
    this.ensureDirs();
    if (!fs.existsSync(this.expedientesDir)) return [];
    return fs
      .readdirSync(this.expedientesDir)
      .filter((f) => f.endsWith(".json"))
      .map((f) => f.replace(/\.json$/, ""));
  }
}

/**
 * CB-02 — Source ingestion ledger (factory_key scoped, complements ELR)
 */

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { assertValidFactoryKey } from "../cb01/factoryKey.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
export const DEFAULT_INGESTION_ROOT = path.resolve(
  __dirname,
  "../../../data/factory-sources/ingestions"
);

export class SourceIngestionLedger {
  /**
   * @param {string} [rootDir]
   */
  constructor(rootDir = DEFAULT_INGESTION_ROOT) {
    this.rootDir = rootDir;
  }

  /**
   * @param {string} factoryKey
   */
  resolvePath(factoryKey) {
    assertValidFactoryKey(factoryKey);
    const safe = factoryKey.replace(/[^a-zA-Z0-9._-]/g, "_");
    return path.join(this.rootDir, `${safe}.jsonl`);
  }

  /**
   * @param {string} factoryKey
   * @param {object} entry
   */
  append(factoryKey, entry) {
    fs.mkdirSync(this.rootDir, { recursive: true });
    const line = JSON.stringify({
      ...entry,
      factoryKey,
      recordedAt: new Date().toISOString(),
    });
    fs.appendFileSync(this.resolvePath(factoryKey), `${line}\n`, "utf8");
  }

  /**
   * @param {string} factoryKey
   */
  readAll(factoryKey) {
    const filePath = this.resolvePath(factoryKey);
    if (!fs.existsSync(filePath)) return [];
    return fs
      .readFileSync(filePath, "utf8")
      .split("\n")
      .filter(Boolean)
      .map((line) => JSON.parse(line));
  }
}

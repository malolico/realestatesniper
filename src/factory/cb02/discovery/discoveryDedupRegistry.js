/**
 * SP10 — Discovery dedup / replay registry (CB-02)
 * Discovery bookkeeping only — not CB-01 Expediente registry.
 */

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export const DEFAULT_DISCOVERY_DEDUP_ROOT = path.resolve(
  __dirname,
  "../../../../data/factory-discovery/dedup"
);

export class DiscoveryDedupRegistry {
  /**
   * @param {string} [rootDir]
   */
  constructor(rootDir = DEFAULT_DISCOVERY_DEDUP_ROOT) {
    this.rootDir = rootDir;
    fs.mkdirSync(this.rootDir, { recursive: true });
  }

  /**
   * @param {string} dedupKey
   */
  resolvePath(dedupKey) {
    return path.join(this.rootDir, `${dedupKey}.json`);
  }

  /**
   * @param {string} dedupKey
   */
  lookup(dedupKey) {
    const filePath = this.resolvePath(dedupKey);
    if (!fs.existsSync(filePath)) return null;
    return Object.freeze(JSON.parse(fs.readFileSync(filePath, "utf8")));
  }

  /**
   * @param {object} record
   */
  save(record) {
    if (!record?.dedupKey) {
      throw new Error("[SP10 DedupRegistry] dedupKey required");
    }
    const filePath = this.resolvePath(record.dedupKey);
    fs.writeFileSync(filePath, `${JSON.stringify(record, null, 2)}\n`, "utf8");
    return Object.freeze({ ...record });
  }

  /**
   * @param {string} dedupKey
   * @param {string} ingestedAt
   */
  recordReplay(dedupKey, ingestedAt) {
    const existing = this.lookup(dedupKey);
    if (!existing) return null;
    const updated = Object.freeze({
      ...existing,
      lastReplayedAt: ingestedAt,
      replayCount: (existing.replayCount ?? 1) + 1,
    });
    this.save(updated);
    return updated;
  }

  /**
   * @returns {object[]}
   */
  listAll() {
    if (!fs.existsSync(this.rootDir)) return [];
    return fs
      .readdirSync(this.rootDir)
      .filter((f) => f.endsWith(".json"))
      .map((f) => Object.freeze(JSON.parse(fs.readFileSync(path.join(this.rootDir, f), "utf8"))));
  }

  /**
   * @param {string} propertyAnchor
   */
  findByPropertyAnchor(propertyAnchor) {
    if (!propertyAnchor) return null;
    for (const record of this.listAll()) {
      if (record.propertyAnchor === propertyAnchor && record.factoryKey) {
        return record;
      }
    }
    return null;
  }

  /**
   * @param {string} definitiveKeyCandidate
   */
  findByDefinitiveKey(definitiveKeyCandidate) {
    if (!definitiveKeyCandidate) return null;
    for (const record of this.listAll()) {
      if (
        record.definitiveKeyCandidate === definitiveKeyCandidate &&
        record.factoryKey
      ) {
        return record;
      }
    }
    return null;
  }
}

/**
 * CB-03 — Compliance state persistence (per factory_key)
 */

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { assertValidFactoryKey } from "../cb01/factoryKey.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
export const DEFAULT_COMPLIANCE_ROOT = path.resolve(
  __dirname,
  "../../../data/factory-compliance"
);

export class ComplianceStateStore {
  /**
   * @param {string} [rootDir]
   */
  constructor(rootDir = DEFAULT_COMPLIANCE_ROOT) {
    this.rootDir = rootDir;
  }

  /**
   * @param {string} factoryKey
   */
  resolvePath(factoryKey) {
    assertValidFactoryKey(factoryKey);
    const safe = factoryKey.replace(/[^a-zA-Z0-9._-]/g, "_");
    return path.join(this.rootDir, `${safe}.json`);
  }

  /**
   * @param {string} factoryKey
   */
  read(factoryKey) {
    const filePath = this.resolvePath(factoryKey);
    if (!fs.existsSync(filePath)) {
      return {
        factory_key: factoryKey,
        clearance: "PENDING",
        violations: [],
        history: [],
      };
    }
    return JSON.parse(fs.readFileSync(filePath, "utf8"));
  }

  /**
   * @param {string} factoryKey
   * @param {object} state
   */
  write(factoryKey, state) {
    fs.mkdirSync(this.rootDir, { recursive: true });
    const payload = {
      ...state,
      factory_key: factoryKey,
      updatedAt: new Date().toISOString(),
    };
    fs.writeFileSync(this.resolvePath(factoryKey), `${JSON.stringify(payload, null, 2)}\n`, "utf8");
    return payload;
  }
}

/**
 * CB-07 — Legitimacy knowledge state per factory_key
 */

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { LEGITIMACY_MPI_DOMAINS } from "./legitimacyCatalog.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
export const DEFAULT_LEGITIMACY_ROOT = path.resolve(
  __dirname,
  "../../../data/factory-legitimacy"
);

function defaultState() {
  return {
    mpiDomains: Object.fromEntries(LEGITIMACY_MPI_DOMAINS.map((d) => [d, { deltas: [], sourceRefs: [] }])),
    blockers: [],
    transferReady: false,
    ownershipVerified: false,
    titleMarketable: false,
    updatedAt: null,
  };
}

export class LegitimacyKnowledgeStore {
  /**
   * @param {string} [rootDir]
   */
  constructor(rootDir = DEFAULT_LEGITIMACY_ROOT) {
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
      return defaultState();
    }
    return { ...defaultState(), ...JSON.parse(fs.readFileSync(file, "utf8")) };
  }

  /**
   * @param {string} factoryKey
   * @param {object} state
   */
  write(factoryKey, state) {
    const file = this.filePath(factoryKey);
    const payload = { ...state, updatedAt: new Date().toISOString() };
    fs.writeFileSync(file, `${JSON.stringify(payload, null, 2)}\n`, "utf8");
    return payload;
  }

  /**
   * @param {string} factoryKey
   * @param {string} mpiDomain
   * @param {{ delta: object, sourceRefs?: object[] }} entry
   */
  recordDomainProduction(factoryKey, mpiDomain, entry) {
    const state = this.read(factoryKey);
    const domain = state.mpiDomains[mpiDomain] ?? { deltas: [], sourceRefs: [] };
    domain.deltas.push(entry.delta);
    if (entry.sourceRefs?.length) {
      domain.sourceRefs.push(...entry.sourceRefs);
    }
    state.mpiDomains[mpiDomain] = domain;
    return this.write(factoryKey, state);
  }

  /**
   * @param {string} factoryKey
   * @param {object} blocker
   */
  addBlocker(factoryKey, blocker) {
    const state = this.read(factoryKey);
    state.blockers.push(blocker);
    return this.write(factoryKey, state);
  }

  /**
   * @param {string} factoryKey
   */
  mpiCoverage(factoryKey) {
    const state = this.read(factoryKey);
    return LEGITIMACY_MPI_DOMAINS.map((d) => ({
      domain: d,
      deltaCount: state.mpiDomains[d]?.deltas?.length ?? 0,
      sourceRefCount: state.mpiDomains[d]?.sourceRefs?.length ?? 0,
      reachable: (state.mpiDomains[d]?.deltas?.length ?? 0) > 0,
    }));
  }
}

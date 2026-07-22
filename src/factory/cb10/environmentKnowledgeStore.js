/**
 * CB-10 — Environment knowledge state per factory_key
 */

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { ENVIRONMENT_MPI_DOMAINS } from "./environmentCatalog.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
export const DEFAULT_ENVIRONMENT_ROOT = path.resolve(
  __dirname,
  "../../../data/factory-environment"
);

function defaultState() {
  return {
    mpiDomains: Object.fromEntries(ENVIRONMENT_MPI_DOMAINS.map((d) => [d, { deltas: [], sourceRefs: [] }])),
    contextualFreshnessPct: 0,
    censusVintageOk: false,
    livabilityComplete: false,
    updatedAt: null,
  };
}

export class EnvironmentKnowledgeStore {
  /**
   * @param {string} [rootDir]
   */
  constructor(rootDir = DEFAULT_ENVIRONMENT_ROOT) {
    this.rootDir = rootDir;
    fs.mkdirSync(this.rootDir, { recursive: true });
  }

  filePath(factoryKey) {
    const safe = factoryKey.replace(/[^a-zA-Z0-9._-]/g, "_");
    return path.join(this.rootDir, `${safe}.json`);
  }

  read(factoryKey) {
    const file = this.filePath(factoryKey);
    if (!fs.existsSync(file)) return defaultState();
    return { ...defaultState(), ...JSON.parse(fs.readFileSync(file, "utf8")) };
  }

  write(factoryKey, state) {
    const payload = { ...state, updatedAt: new Date().toISOString() };
    fs.writeFileSync(this.filePath(factoryKey), `${JSON.stringify(payload, null, 2)}\n`, "utf8");
    return payload;
  }

  recordDomainProduction(factoryKey, mpiDomain, entry) {
    const state = this.read(factoryKey);
    const domain = state.mpiDomains[mpiDomain] ?? { deltas: [], sourceRefs: [] };
    domain.deltas.push(entry.delta);
    if (entry.sourceRefs?.length) domain.sourceRefs.push(...entry.sourceRefs);
    state.mpiDomains[mpiDomain] = domain;
    return this.write(factoryKey, state);
  }

  mpiCoverage(factoryKey) {
    const state = this.read(factoryKey);
    return ENVIRONMENT_MPI_DOMAINS.map((d) => ({
      domain: d,
      deltaCount: state.mpiDomains[d]?.deltas?.length ?? 0,
      sourceRefCount: state.mpiDomains[d]?.sourceRefs?.length ?? 0,
      reachable: (state.mpiDomains[d]?.deltas?.length ?? 0) > 0,
    }));
  }
}

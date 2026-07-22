/**
 * CB-08 — Distress knowledge state per factory_key
 */

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { DISTRESS_MPI_DOMAINS } from "./distressCatalog.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
export const DEFAULT_DISTRESS_ROOT = path.resolve(
  __dirname,
  "../../../data/factory-distress"
);

function defaultState() {
  return {
    mpiDomains: Object.fromEntries(DISTRESS_MPI_DOMAINS.map((d) => [d, { deltas: [], sourceRefs: [] }])),
    signals: [],
    motivationSufficient: false,
    motivationExhausted: false,
    contactGated: false,
    updatedAt: null,
  };
}

export class DistressKnowledgeStore {
  /**
   * @param {string} [rootDir]
   */
  constructor(rootDir = DEFAULT_DISTRESS_ROOT) {
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

  addSignal(factoryKey, signal) {
    const state = this.read(factoryKey);
    state.signals.push(signal);
    return this.write(factoryKey, state);
  }

  mpiCoverage(factoryKey) {
    const state = this.read(factoryKey);
    return DISTRESS_MPI_DOMAINS.map((d) => ({
      domain: d,
      deltaCount: state.mpiDomains[d]?.deltas?.length ?? 0,
      sourceRefCount: state.mpiDomains[d]?.sourceRefs?.length ?? 0,
      reachable: (state.mpiDomains[d]?.deltas?.length ?? 0) > 0,
    }));
  }
}

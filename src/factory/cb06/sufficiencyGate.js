/**
 * CB-06 — Sufficiency gate (EVF-05)
 */

import { FOUNDATION_MPI_DOMAINS } from "../cb05/foundationCatalog.js";

export const SUFFICIENCY_STATUS = Object.freeze({
  PASS: "PASS",
  FAIL: "FAIL",
  PENDING: "PENDING",
});

/**
 * @param {{
 *   entries: object[],
 *   conflicts: object[],
 *   requiredDomains?: string[],
 * }} registry
 */
export function evaluateSufficiency(registry) {
  const reasons = [];
  const requiredDomains = registry.requiredDomains ?? FOUNDATION_MPI_DOMAINS;

  if ((registry.entries?.length ?? 0) === 0) {
    reasons.push("no_evidence_entries");
  }

  for (const domain of requiredDomains) {
    const domainEntries = (registry.entries ?? []).filter((e) => e.mpiDomain === domain);
    if (domainEntries.length === 0) {
      reasons.push(`missing_domain_${domain}`);
    }
    const hasMaterialE = domainEntries.some((e) => ["E3", "E4"].includes(e.eLevel));
    if (domainEntries.length > 0 && !hasMaterialE) {
      reasons.push(`insufficient_e_level_domain_${domain}`);
    }
  }

  const openConflicts = (registry.conflicts ?? []).filter((c) => c.status === "OPEN");
  if (openConflicts.length > 0) {
    reasons.push("open_conflicts");
  }

  const coverage =
    registry.materialManifestCount > 0
      ? (registry.manifestsCovered ?? 0) / registry.materialManifestCount
      : 0;
  if (registry.materialManifestCount > 0 && coverage < 1) {
    reasons.push("incomplete_material_delta_registration");
  }

  return {
    status: reasons.length === 0 ? SUFFICIENCY_STATUS.PASS : SUFFICIENCY_STATUS.FAIL,
    reasons,
    coverage,
    rule: "EVF-05",
    reproducible: true,
  };
}

/**
 * @param {string} toState
 */
export function requiresSufficiencyForState(toState) {
  return toState === "ST-RDY";
}

/**
 * @param {string} sufficiencyStatus
 */
export function assertEvf05SufficiencyGate(toState, sufficiencyStatus) {
  if (requiresSufficiencyForState(toState) && sufficiencyStatus !== SUFFICIENCY_STATUS.PASS) {
    throw new Error(`[CB-06 EVF-05] Sufficiency FAIL blocks transition to ${toState}`);
  }
}

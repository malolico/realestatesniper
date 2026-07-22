/**
 * CB-02 — source_ref traceable identifier (DSO procedencia soberana)
 */

import { randomUUID } from "node:crypto";

let sequence = 0;

/**
 * @param {{
 *   organismId: string,
 *   familyId: string,
 *   epistemicLevel: number,
 *   factoryKey?: string,
 *   vintageAt?: string,
 *   acquiredAt?: string,
 *   ddiDomains?: string[],
 *   ddiPart?: string|null,
 *   freshness?: object,
 *   complianceFlags?: string[],
 *   piiFlags?: object,
 *   lowConfidenceFlags?: string[],
 * }} input
 */
export function buildSourceRef(input) {
  sequence += 1;
  const acquiredAt = input.acquiredAt ?? new Date().toISOString();
  return Object.freeze({
    id: `SRC-${input.organismId}-${Date.now()}-${sequence}`,
    refUuid: randomUUID(),
    organismId: input.organismId,
    familyId: input.familyId,
    epistemicLevel: input.epistemicLevel,
    factoryKey: input.factoryKey ?? null,
    acquiredAt,
    vintageAt: input.vintageAt ?? null,
    ddiDomains: input.ddiDomains ?? [],
    ddiPart: input.ddiPart ?? null,
    freshness: input.freshness ?? null,
    complianceFlags: input.complianceFlags ?? [],
    piiFlags: input.piiFlags ?? { sensitive: false, contactChannel: false, authorized: null },
    lowConfidenceFlags: input.lowConfidenceFlags ?? [],
    constitutionalPhase: "CB-02",
  });
}

export function isSourceRef(value) {
  return (
    value &&
    typeof value === "object" &&
    typeof value.id === "string" &&
    value.id.startsWith("SRC-") &&
    typeof value.organismId === "string"
  );
}

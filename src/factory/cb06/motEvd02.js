/**
 * CB-06 — MOT-EVD-02 Source Conflict Resolver (logical instance)
 */

import { assertNoAveraging } from "../cb02/conflictRules.js";
import { resolveConflictPolicy } from "../cb02/conflictRules.js";
import { nextConflictLadderStep } from "./conflictLadder.js";
import { EvidenceRegistryStore } from "./evidenceRegistryStore.js";

export class MotEvd02 {
  static ACTOR = "MOT-EVD-02";

  /**
   * @param {{ store?: EvidenceRegistryStore }} [deps]
   */
  constructor(deps = {}) {
    this.store = deps.store ?? new EvidenceRegistryStore();
  }

  /**
   * @param {{
   *   factoryKey: string,
   *   field: string,
   *   sources: { sourceRefId: string, value: unknown, eLevel: string, organismId?: string }[],
   *   resolvable?: boolean,
   * }} input
   */
  arbitrate(input) {
    assertNoAveraging("HIERARCHY");

    const policy = resolveConflictPolicy({
      conflictDetected: input.sources.length > 1,
      resolvable: input.resolvable !== false,
    });

    const ranked = [...input.sources].sort((a, b) => {
      const eDiff = b.eLevel.localeCompare(a.eLevel);
      if (eDiff !== 0) return eDiff;
      return (a.organismId ?? "").localeCompare(b.organismId ?? "");
    });

    const prevailing = ranked[0] ?? null;
    const ladder = nextConflictLadderStep({
      resolvable: input.resolvable !== false,
      arbitrationAttempted: true,
    });

    const resolution = {
      kind: "EVIDENCE_CONFLICT_RESOLUTION",
      field: input.field,
      policy: policy.rule ?? "R3",
      strategy: "HIERARCHY",
      averagingProhibited: true,
      prevailing,
      rejected: ranked.slice(1),
      ladder,
      status: prevailing ? "RESOLVED" : "OPEN",
      resolvedAt: new Date().toISOString(),
      constitutionalPhase: "CB-06",
    };

    if (resolution.status === "OPEN") {
      this.store.appendConflict(input.factoryKey, {
        ...resolution,
        conflictId: `CNF-${input.field}`,
      });
    }

    return {
      actor: MotEvd02.ACTOR,
      resolution,
      prevailingSourceRefId: prevailing?.sourceRefId ?? null,
    };
  }
}

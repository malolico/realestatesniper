/**
 * CB-11 — Loop activators ACT-T/E/V/D/M/C/R (MLA)
 */

export const LOOP_ACTIVATORS = Object.freeze({
  "ACT-T": { code: "ACT-T", label: "Temporal / vintage SLA", triggers: ["freshness_breach", "census_stale"] },
  "ACT-E": { code: "ACT-E", label: "Epistemic completeness", triggers: ["domain_gap", "sufficiency_fail"] },
  "ACT-V": { code: "ACT-V", label: "Value / field change", triggers: ["source_ref_new", "manifest_delta"] },
  "ACT-D": { code: "ACT-D", label: "Dependency satisfied", triggers: ["layer_handoff", "motor_complete"] },
  "ACT-M": { code: "ACT-M", label: "Manual / director", triggers: ["director_override"] },
  "ACT-C": { code: "ACT-C", label: "Conflict detected", triggers: ["evidence_conflict", "compliance_veto"] },
  "ACT-R": { code: "ACT-R", label: "Re-execution budget", triggers: ["loop_rerun", "strategy_escalation"] },
});

/**
 * @param {{
 *   freshnessBreach?: boolean,
 *   domainGap?: boolean,
 *   sourceChange?: boolean,
 *   layerHandoff?: boolean,
 *   conflict?: boolean,
 *   rerun?: boolean,
 * }} signals
 */
export function resolveLoopActivators(signals) {
  const active = [];
  if (signals.freshnessBreach) active.push("ACT-T");
  if (signals.domainGap) active.push("ACT-E");
  if (signals.sourceChange) active.push("ACT-V");
  if (signals.layerHandoff) active.push("ACT-D");
  if (signals.conflict) active.push("ACT-C");
  if (signals.rerun) active.push("ACT-R");
  return active.length > 0 ? active : ["ACT-D"];
}

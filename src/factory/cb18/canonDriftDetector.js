/**
 * CB-18 — Canon drift detector
 *
 * Alerts if ELR / operational data introduces actors outside catalog.
 * Canon drift = deployment block (termination criterion).
 */

import { validateCatalogActor } from "../cb00/catalogActorGuard.js";

/** Actor-shaped codes (MOT-*, LOOP-*, or any FAMILY-SEGMENT pattern). */
const ACTOR_SHAPE = /^[A-Z]{2,}(-[A-Z0-9]+)+$/;

/**
 * Documented pattern↔catalog mismatches (deferred risk from prior phases).
 * MOT-LIEN-01 is in OMC index but LIEN is 4 letters — fails MOT-[A-Z]{3}-\d{2}.
 */
export const DOCUMENTED_ACTOR_EXCEPTIONS = Object.freeze(["MOT-LIEN-01"]);

/**
 * Collect actor-like codes from a CB-01 expediente ELR.
 * @param {object} record
 */
export function collectElrActors(record) {
  const elr = record?.elr ?? {};
  /** @type {Set<string>} */
  const actors = new Set();

  const push = (value) => {
    if (typeof value === "string" && value.length > 0) actors.add(value);
  };

  for (const t of elr.state_transitions ?? []) push(t.actor);
  for (const m of elr.motor_manifests ?? []) {
    push(m.actor);
    push(m.motorId);
  }
  for (const r of elr.loop_ledger_refs ?? []) push(r.actor);
  for (const s of elr.swarm_mission_refs ?? []) {
    push(s.actor);
    push(s.swarmId);
  }
  for (const a of elr.aia_rlg_refs ?? []) {
    push(a.actor);
    push(a.aiaId);
  }
  for (const c of elr.conflict_resolutions ?? []) push(c.actor);
  for (const h of elr.decision_handoffs ?? []) {
    push(h.actor);
    push(h.fromLoop);
  }
  for (const k of elr.factory_key_history ?? []) push(k.actor);

  return [...actors];
}

/**
 * Detect canon drift for one expediente.
 * @param {object} record
 * @param {{ extraActors?: string[] }} [options]
 */
export function detectCanonDrift(record, options = {}) {
  const actors = [...collectElrActors(record), ...(options.extraActors ?? [])];
  const drifted = [];
  const cataloged = [];
  const documentedExceptions = [];

  for (const actor of actors) {
    if (!ACTOR_SHAPE.test(actor)) {
      continue;
    }
    if (DOCUMENTED_ACTOR_EXCEPTIONS.includes(actor)) {
      documentedExceptions.push(actor);
      cataloged.push(actor);
      continue;
    }
    const result = validateCatalogActor(actor);
    if (result.valid) {
      cataloged.push(actor);
    } else {
      drifted.push({ actor, reason: result.reason ?? "out_of_catalog" });
    }
  }

  const hasDrift = drifted.length > 0;
  return {
    factory_key: record?.factory_key ?? null,
    actorsScanned: actors.filter((a) => ACTOR_SHAPE.test(a)).length,
    catalogedCount: cataloged.length,
    driftCount: drifted.length,
    drifted,
    documentedExceptions,
    hasDrift,
    /** Termination criterion: canon drift = deployment block */
    blockDeployment: hasDrift,
    rule: "PP-15 / LFF-02 — implementación obedece canon",
  };
}

/**
 * Assert deployment allowed — throws on canon drift.
 * @param {object} record
 * @param {{ extraActors?: string[] }} [options]
 */
export function assertNoCanonDrift(record, options = {}) {
  const report = detectCanonDrift(record, options);
  if (report.blockDeployment) {
    throw new Error(
      `[CB-18 Canon Drift] Deployment blocked — out-of-catalog actors: ${report.drifted
        .map((d) => d.actor)
        .join(", ")}`
    );
  }
  return report;
}

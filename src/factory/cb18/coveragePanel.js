/**
 * CB-18 — Coverage panel
 *
 * Motores, loops, swarms, AIA por expediente — from CB-01 ELR sections
 * (populated via CB-15 operational pipeline).
 */

import { aggregateElr } from "../cb15/elrAggregator.js";
import { OMC_MOTOR_COUNT_CONSTITUTIONAL } from "../cb15/ffoCatalog.js";

const LOOP_TARGET = 24;
const SWARM_TARGET = 14;
const AIA_TARGET = 26;

/**
 * @param {Iterable<object>} entries
 * @param {(e: object) => string|null} pickId
 */
function uniqueIds(entries, pickId) {
  const set = new Set();
  for (const e of entries) {
    const id = pickId(e);
    if (id) set.add(id);
  }
  return [...set].sort();
}

/**
 * @param {object} record — expediente (CB-01)
 */
export function buildCoveragePanel(record) {
  const elr = record?.elr ?? {};
  const aggregation = aggregateElr(record);

  const motors = uniqueIds(elr.motor_manifests ?? [], (m) => m.motorId ?? null);
  const loops = uniqueIds(elr.loop_ledger_refs ?? [], (r) => {
    const kind = String(r.kind ?? "");
    if (kind.startsWith("LOOP_") && kind.endsWith("_RUN")) {
      return kind.replace(/_RUN$/, "").replace(/_/g, "-");
    }
    if (r.loopId) return r.loopId;
    if (r.actor && String(r.actor).startsWith("LOOP-")) return r.actor;
    return null;
  });
  const swarms = uniqueIds(elr.swarm_mission_refs ?? [], (s) => s.swarmId ?? s.missionId ?? s.actor ?? null);
  const aia = uniqueIds(elr.aia_rlg_refs ?? [], (a) => a.aiaId ?? a.patternId ?? a.actor ?? null);

  return {
    factory_key: record?.factory_key ?? null,
    state: record?.state ?? null,
    motors: {
      count: motors.length,
      ids: motors,
      constitutionalTarget: OMC_MOTOR_COUNT_CONSTITUTIONAL,
    },
    loops: {
      count: loops.length,
      ids: loops,
      constitutionalTarget: LOOP_TARGET,
    },
    swarms: {
      count: swarms.length,
      ids: swarms,
      constitutionalTarget: SWARM_TARGET,
    },
    aia: {
      count: aia.length,
      ids: aia,
      constitutionalTarget: AIA_TARGET,
    },
    elrSections: aggregation.sections,
    rule: "LFF-04 coverage view",
  };
}

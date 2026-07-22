/**
 * CB-00 — Construction Governance
 * Phase advance rules: no CB-N+1 without CB-N closure.
 */

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
export const REPO_ROOT = path.resolve(__dirname, "../../..");

export const CONSTRUCTION_PHASES = Object.freeze([
  { id: "CB-00", name: "Anclaje constitucional y entorno de construcción", pConst: null },
  { id: "CB-01", name: "Factory Registry y Expediente Ledger (ELR)", pConst: "P1" },
  { id: "CB-02", name: "Capa de fuentes y organismos (DSO)", pConst: "P0" },
  { id: "CB-03", name: "Compliance Gate (MOT-CMP + LOOP-XVR-CMP)", pConst: "P0" },
  { id: "CB-04", name: "Motor Runtime — núcleo de ejecución", pConst: "P1" },
  { id: "CB-05", name: "Capa Fundación — motores y loops", pConst: "P1" },
  { id: "CB-06", name: "Evidence Service (MOT-EVD-01/02)", pConst: "P3" },
  { id: "CB-07", name: "Capa Legitimidad — motores y loops", pConst: "P4" },
  { id: "CB-08", name: "Capa Distress — motores y loops", pConst: "P5" },
  { id: "CB-09", name: "Capa Economía — motores y loops", pConst: "P6" },
  { id: "CB-10", name: "Capa Entorno — motores y loops", pConst: "P8" },
  { id: "CB-11", name: "Loop Engine completo (24 LOOP)", pConst: "P1-P9" },
  { id: "CB-12", name: "Swarm Coordinator (14 SWM)", pConst: "derived" },
  { id: "CB-13", name: "Capa Inteligencia — motores y loops", pConst: "P7" },
  { id: "CB-14", name: "AI Assist Layer (26 AIA)", pConst: "subordinate" },
  { id: "CB-15", name: "Orchestration Bus (FFO)", pConst: "integration" },
  { id: "CB-16", name: "Decision Handoff Interface", pConst: "boundary" },
  { id: "CB-17", name: "Watch, Update, Archive y Retirada", pConst: "post-product" },
  { id: "CB-18", name: "Governance Dashboard", pConst: "transversal" },
  { id: "CB-19", name: "Validación end-to-end y cierre Factory", pConst: "closure" },
]);

export const PHASE_STATUS_PATH = path.join(
  REPO_ROOT,
  "docs/factory-construction/phases/construction-phase-status.json"
);

const PHASE_IDS = CONSTRUCTION_PHASES.map((p) => p.id);

export function getPhaseIndex(phaseId) {
  return PHASE_IDS.indexOf(phaseId);
}

export function getPreviousPhaseId(phaseId) {
  const index = getPhaseIndex(phaseId);
  if (index <= 0) return null;
  return PHASE_IDS[index - 1];
}

export function loadPhaseStatus() {
  if (!fs.existsSync(PHASE_STATUS_PATH)) {
    return { version: 1, phases: {}, metadata: { directorApprovalRequired: true } };
  }
  const raw = fs.readFileSync(PHASE_STATUS_PATH, "utf8");
  return JSON.parse(raw);
}

export function savePhaseStatus(status) {
  const dir = path.dirname(PHASE_STATUS_PATH);
  fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(PHASE_STATUS_PATH, `${JSON.stringify(status, null, 2)}\n`, "utf8");
}

export function getPhaseRecord(phaseId, status = loadPhaseStatus()) {
  return status.phases?.[phaseId] ?? { status: "PENDING" };
}

export function isPhaseComplete(phaseId, status = loadPhaseStatus()) {
  const record = getPhaseRecord(phaseId, status);
  return record.status === "COMPLETE" || record.status === "APPROVED";
}

export function isPhaseApproved(phaseId, status = loadPhaseStatus()) {
  const record = getPhaseRecord(phaseId, status);
  return record.status === "APPROVED";
}

/**
 * @param {string} phaseId
 * @throws {Error}
 */
export function assertPhaseUnlocked(phaseId) {
  const previousId = getPreviousPhaseId(phaseId);
  if (!previousId) return;
  if (!isPhaseApproved(previousId)) {
    const record = getPhaseRecord(previousId);
    throw new Error(
      `[CB-00 Governance] Phase ${phaseId} locked: ${previousId} requires APPROVED status (current: ${record.status})`
    );
  }
}

/**
 * @param {string} phaseId
 * @param {{ approvedBy?: string, validationReport?: string }} [meta]
 */
export function markPhaseComplete(phaseId, meta = {}) {
  if (!PHASE_IDS.includes(phaseId)) {
    throw new Error(`[CB-00 Governance] Unknown phase: ${phaseId}`);
  }
  const previousId = getPreviousPhaseId(phaseId);
  if (previousId && !isPhaseApproved(previousId)) {
    throw new Error(
      `[CB-00 Governance] Cannot complete ${phaseId}: ${previousId} is not approved`
    );
  }
  const status = loadPhaseStatus();
  status.phases[phaseId] = {
    status: meta.approvedBy ? "APPROVED" : "COMPLETE",
    completedAt: new Date().toISOString(),
    ...meta,
  };
  savePhaseStatus(status);
  return status.phases[phaseId];
}

/**
 * CB-00 — Constitutional Binding Pack
 * Indexed reference to the 19 official Master Audit documents (read-only).
 * Does not interpret or amend the constitution.
 */

import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
export const REPO_ROOT = path.resolve(__dirname, "../../..");
export const AUDIT_DOCS_DIR = path.join(REPO_ROOT, "docs/auditoria-maestra");

/** @typedef {'PHASE_I'|'PHASE_II'|'PHASE_III'} ConstitutionalPhase */

/**
 * @typedef {Object} ConstitutionalDocument
 * @property {number} number
 * @property {string} id
 * @property {string} title
 * @property {ConstitutionalPhase} phase
 * @property {string|null} relativePath - null when reference-only (not versioned in repo)
 * @property {'VERSIONED'|'REFERENCE_ONLY'} storageStatus
 * @property {string} orchestrationRole
 */

/** @type {readonly ConstitutionalDocument[]} */
export const CONSTITUTIONAL_DOCUMENTS = Object.freeze([
  {
    number: 1,
    id: "MPI",
    title: "Master Property Intelligence Index",
    phase: "PHASE_I",
    relativePath: null,
    storageStatus: "REFERENCE_ONLY",
    orchestrationRole: "44 dominios MPI — mapa epistémico",
  },
  {
    number: 2,
    id: "DKN",
    title: "Diamond Knowledge Constitution",
    phase: "PHASE_I",
    relativePath: null,
    storageStatus: "REFERENCE_ONLY",
    orchestrationRole: "Reglas E/C, Diamond ≠ Premium, Decision gate",
  },
  {
    number: 3,
    id: "DDI-I",
    title: "Diamond Data Inventory — Parte I",
    phase: "PHASE_I",
    relativePath: "docs/auditoria-maestra/DIAMOND_DATA_INVENTORY_PARTE_I.md",
    storageStatus: "VERSIONED",
    orchestrationRole: "Identidad, localización, físico",
  },
  {
    number: 4,
    id: "DDI-II",
    title: "Diamond Data Inventory — Parte II",
    phase: "PHASE_I",
    relativePath: "docs/auditoria-maestra/DIAMOND_DATA_INVENTORY_PARTE_II.md",
    storageStatus: "VERSIONED",
    orchestrationRole: "Legal, titularidad, gravámenes",
  },
  {
    number: 5,
    id: "DDI-III",
    title: "Diamond Data Inventory — Parte III",
    phase: "PHASE_I",
    relativePath: "docs/auditoria-maestra/DIAMOND_DATA_INVENTORY_PARTE_III.md",
    storageStatus: "VERSIONED",
    orchestrationRole: "Propietario, motivación, distress",
  },
  {
    number: 6,
    id: "DDI-IV",
    title: "Diamond Data Inventory — Parte IV",
    phase: "PHASE_I",
    relativePath: "docs/auditoria-maestra/DIAMOND_DATA_INVENTORY_PARTE_IV.md",
    storageStatus: "VERSIONED",
    orchestrationRole: "Finanzas, mercado, valoración",
  },
  {
    number: 7,
    id: "DDI-V",
    title: "Diamond Data Inventory — Parte V",
    phase: "PHASE_I",
    relativePath: "docs/auditoria-maestra/DIAMOND_DATA_INVENTORY_PARTE_V.md",
    storageStatus: "VERSIONED",
    orchestrationRole: "Permisos, urbanismo, entorno",
  },
  {
    number: 8,
    id: "DDI-VI",
    title: "Diamond Data Inventory — Parte VI",
    phase: "PHASE_I",
    relativePath: "docs/auditoria-maestra/DIAMOND_DATA_INVENTORY_PARTE_VI.md",
    storageStatus: "VERSIONED",
    orchestrationRole: "Inteligencia operativa, evidencias, Factory",
  },
  {
    number: 9,
    id: "DSO",
    title: "Diamond Sources & Organisms Architecture",
    phase: "PHASE_I",
    relativePath: "docs/auditoria-maestra/DIAMOND_SOURCES_AND_ORGANISMS_ARCHITECTURE.md",
    storageStatus: "VERSIONED",
    orchestrationRole: "Procedencia y frescura",
  },
  {
    number: 10,
    id: "MMA",
    title: "Master Motors Architecture",
    phase: "PHASE_II",
    relativePath: "docs/auditoria-maestra/MASTER_MOTORS_ARCHITECTURE.md",
    storageStatus: "VERSIONED",
    orchestrationRole: "Constitución motores",
  },
  {
    number: 11,
    id: "FCC",
    title: "Factory Capability Catalog",
    phase: "PHASE_II",
    relativePath: "docs/auditoria-maestra/FACTORY_CAPABILITY_CATALOG.md",
    storageStatus: "VERSIONED",
    orchestrationRole: "26 capacidades CAP permanentes",
  },
  {
    number: 12,
    id: "OMC",
    title: "Official Motor Catalog",
    phase: "PHASE_II",
    relativePath: "docs/auditoria-maestra/OFFICIAL_MOTOR_CATALOG.md",
    storageStatus: "VERSIONED",
    orchestrationRole: "52 motores MOT",
  },
  {
    number: 13,
    id: "MLA",
    title: "Master Loops Architecture",
    phase: "PHASE_II",
    relativePath: "docs/auditoria-maestra/MASTER_LOOPS_ARCHITECTURE.md",
    storageStatus: "VERSIONED",
    orchestrationRole: "Constitución loops",
  },
  {
    number: 14,
    id: "OLC",
    title: "Official Loop Catalog",
    phase: "PHASE_II",
    relativePath: "docs/auditoria-maestra/OFFICIAL_LOOP_CATALOG.md",
    storageStatus: "VERSIONED",
    orchestrationRole: "24 loops LOOP",
  },
  {
    number: 15,
    id: "MSA",
    title: "Master Swarms Architecture",
    phase: "PHASE_II",
    relativePath: "docs/auditoria-maestra/MASTER_SWARMS_ARCHITECTURE.md",
    storageStatus: "VERSIONED",
    orchestrationRole: "Constitución enjambres",
  },
  {
    number: 16,
    id: "OSC",
    title: "Official Swarm Catalog",
    phase: "PHASE_II",
    relativePath: "docs/auditoria-maestra/OFFICIAL_SWARM_CATALOG.md",
    storageStatus: "VERSIONED",
    orchestrationRole: "14 patrones SWM",
  },
  {
    number: 17,
    id: "IGA",
    title: "IA Governance Architecture",
    phase: "PHASE_II",
    relativePath: "docs/auditoria-maestra/IA_GOVERNANCE_ARCHITECTURE.md",
    storageStatus: "VERSIONED",
    orchestrationRole: "Constitución IA asistiva",
  },
  {
    number: 18,
    id: "OAC",
    title: "Official AI Capability Catalog",
    phase: "PHASE_II",
    relativePath: "docs/auditoria-maestra/OFFICIAL_AI_CAPABILITY_CATALOG.md",
    storageStatus: "VERSIONED",
    orchestrationRole: "26 capacidades AIA",
  },
  {
    number: 19,
    id: "FFO",
    title: "Full Factory Orchestration Architecture",
    phase: "PHASE_III",
    relativePath: "docs/auditoria-maestra/FULL_FACTORY_ORCHESTRATION_ARCHITECTURE.md",
    storageStatus: "VERSIONED",
    orchestrationRole: "Constitución Operativa definitiva",
  },
]);

export const CONSTRUCTION_BLUEPRINT_PATH =
  "docs/factory-construction/FACTORY_2.0_CONSTRUCTION_BLUEPRINT.md";

export const OPERATIONAL_CONSTITUTION_ID = "FFO";

export const CANON_COUNTS = Object.freeze({
  constitutionalDocuments: 19,
  mpiDomains: 44,
  ddiElements: 2265,
  capabilities: 26,
  motors: 52,
  loops: 24,
  swarms: 14,
  aiCapabilities: 26,
  aiSlots: 10,
  expedienteStates: 16,
  decisionGates: 7,
  permanentPrinciples: 15,
});

export function getConstitutionalDocument(number) {
  return CONSTITUTIONAL_DOCUMENTS.find((doc) => doc.number === number) ?? null;
}

export function getVersionedDocuments() {
  return CONSTITUTIONAL_DOCUMENTS.filter((doc) => doc.storageStatus === "VERSIONED");
}

export function getReferenceOnlyDocuments() {
  return CONSTITUTIONAL_DOCUMENTS.filter((doc) => doc.storageStatus === "REFERENCE_ONLY");
}

export function resolveDocumentPath(relativePath) {
  return path.join(REPO_ROOT, relativePath);
}

/**
 * CB-00 — Operational Vocabulary
 * Canonical code registry for Factory 2.0 construction (read-only definitions).
 */

export const EXPEDIENTE_STATES = Object.freeze([
  { code: "ST-NASC", label: "Nacimiento", factoryScope: true },
  { code: "ST-IDN", label: "Identificación", factoryScope: true },
  { code: "ST-PROD", label: "Producción", factoryScope: true },
  { code: "ST-EVD", label: "Evidenciación", factoryScope: true },
  { code: "ST-PERF", label: "Perfeccionamiento", factoryScope: true },
  { code: "ST-CONV", label: "Convergencia", factoryScope: true },
  { code: "ST-CONS", label: "Consolidación", factoryScope: true },
  { code: "ST-RDY", label: "Preparación Decision", factoryScope: true },
  { code: "ST-DEC", label: "Handoff Decision", factoryScope: true },
  { code: "ST-PRJ", label: "Proyección", factoryScope: false },
  { code: "ST-CAT", label: "Catálogo", factoryScope: false },
  { code: "ST-MKT", label: "Mercado", factoryScope: false },
  { code: "ST-MON", label: "Seguimiento", factoryScope: true },
  { code: "ST-UPD", label: "Actualización", factoryScope: true },
  { code: "ST-ARC", label: "Archivo", factoryScope: true },
  { code: "ST-RET", label: "Retirada", factoryScope: true },
]);

export const P_CONST_PRIORITIES = Object.freeze([
  { code: "P0", label: "Compliance", actors: ["MOT-CMP-01", "LOOP-XVR-CMP-01"] },
  { code: "P1", label: "Identidad", actors: ["MOT-IDN-01", "LOOP-FND"] },
  { code: "P2", label: "Blockers C1 Obl.", actors: [] },
  { code: "P3", label: "Evidencia sufficiency", actors: ["MOT-EVD-01"] },
  { code: "P4", label: "Legitimidad transfer", actors: ["LOOP-LEG"] },
  { code: "P5", label: "Distress auténtico", actors: ["LOOP-DST-CVG"] },
  { code: "P6", label: "Finanzas y valoración", actors: ["LOOP-ECO"] },
  { code: "P7", label: "Síntesis readiness", actors: ["LOOP-INT-RDY"] },
  { code: "P8", label: "Entorno contextual", actors: ["LOOP-ENV"] },
  { code: "P9", label: "Ejecutivo IC", actors: ["LOOP-INT-FRS"] },
]);

export const EVIDENCE_LEVELS = Object.freeze(["E0", "E1", "E2", "E3", "E4"]);

export const CONFIDENCE_LEVELS = Object.freeze(["C1", "C2", "C3", "C4", "C5"]);

export const LOOP_ACTIVATORS = Object.freeze([
  "ACT-T",
  "ACT-E",
  "ACT-V",
  "ACT-D",
  "ACT-M",
  "ACT-C",
  "ACT-R",
]);

export const DECISION_GATES = Object.freeze([
  { code: "G0", label: "CMP clearance PASS" },
  { code: "G1", label: "factory_key C1–C2" },
  { code: "G2", label: "Blockers Obl. resueltos o documentados" },
  { code: "G3", label: "EVD sufficiency PASS" },
  { code: "G4", label: "SYN-02 readiness PASS" },
  { code: "G5", label: "Known unknowns Obl. declarados (DKN)" },
  { code: "G6", label: "IC path elements mínimos (si aplica)" },
]);

export const ACTOR_CODE_PATTERNS = Object.freeze({
  MOT: /^MOT-[A-Z]{3}-\d{2}$/,
  LOOP: /^LOOP-[A-Z]{3}-[A-Z]{3}-\d{2}$/,
  SWM: /^SWM-[A-Z]{3}-\d{2}$/,
  AIA: /^AIA-[A-Z]{3}-\d{2}$/,
  CAP: /^CAP-\d{2}$/,
  SLOT: /^SLOT-\d{2}$/,
});

export const FACTORY_KEY_PATTERN = /^[a-z0-9][a-z0-9._-]{2,127}$/i;

const STATE_CODE_SET = new Set(EXPEDIENTE_STATES.map((s) => s.code));

export function isValidExpedienteState(code) {
  return STATE_CODE_SET.has(code);
}

export function isValidEvidenceLevel(level) {
  return EVIDENCE_LEVELS.includes(level);
}

export function isValidConfidenceLevel(level) {
  return CONFIDENCE_LEVELS.includes(level);
}

export function matchActorCode(code) {
  if (typeof code !== "string") return null;
  for (const [family, pattern] of Object.entries(ACTOR_CODE_PATTERNS)) {
    if (pattern.test(code)) return family;
  }
  return null;
}

export function isFactoryScopedState(code) {
  const state = EXPEDIENTE_STATES.find((s) => s.code === code);
  return state?.factoryScope === true;
}

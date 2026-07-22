/**
 * CB-02 — DSO epistemic levels and source families (DSO §II)
 */

export const EPISTEMIC_LEVELS = Object.freeze({
  1: { code: "L1", label: "Primaria soberana", evidence: "E4", confidence: "C1-C2" },
  2: { code: "L2", label: "Primaria especializada", evidence: "E3-E4", confidence: "C2-C3" },
  3: { code: "L3", label: "Secundaria verificada", evidence: "E2-E3", confidence: "C3-C4" },
  4: { code: "L4", label: "Secundaria contextual", evidence: "E2", confidence: "C3-C4" },
  5: { code: "L5", label: "Enriquecimiento", evidence: "E1-E2", confidence: "C4-C5" },
  6: { code: "L6", label: "Prohibida / inválida", evidence: "N/A", confidence: "DESCARTE" },
});

export const ACCESS_CLASSES = Object.freeze(["PUBLIC", "COMMERCIAL", "MIXED", "RESTRICTED"]);

export const SOURCE_FAMILIES = Object.freeze([
  "REGISTRAL_ASSESSOR",
  "REGISTRAL_RECORDER",
  "GIS_OFFICIAL",
  "TITLE_COMMITMENT",
  "JUDICIAL_INDEX",
  "MUNICIPAL_CODE",
  "MARKET_MLS",
  "CONTACT_AUTHORIZED",
  "ENRICHMENT_SIGNAL",
  "PROHIBITED",
]);

/**
 * @param {number} level
 */
export function isAllowedEpistemicLevel(level) {
  return level >= 1 && level <= 5;
}

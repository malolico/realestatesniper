/**
 * CB-06 — Evidence vocabulary (E0–E4, C1–C5) and EVF rules
 */

export const E_LEVELS = Object.freeze(["E0", "E1", "E2", "E3", "E4"]);
export const C_LEVELS = Object.freeze(["C1", "C2", "C3", "C4", "C5"]);

/** EVF-02 — AI assist cannot exceed E2 without motor elevation */
export const AI_ASSIST_MAX_E_LEVEL = "E2";

export const EVF_RULES = Object.freeze({
  EVF_01: "EVF-01",
  EVF_02: "EVF-02",
  EVF_05: "EVF-05",
});

export const OMC_MOTOR_COUNT_CONSTITUTIONAL = 52;

/**
 * @param {number} epistemicLevel
 */
export function mapEpistemicToELevel(epistemicLevel) {
  if (epistemicLevel >= 4) return "E4";
  if (epistemicLevel === 3) return "E3";
  if (epistemicLevel === 2) return "E2";
  if (epistemicLevel === 1) return "E1";
  return "E0";
}

/**
 * @param {string} confidence
 */
export function mapConfidenceToCLevel(confidence) {
  if (confidence === "C1") return "C1";
  if (confidence === "C2") return "C2";
  if (confidence === "C3") return "C3";
  if (confidence === "C4") return "C4";
  return "C5";
}

/**
 * @param {string} proposedELevel
 * @param {{ aiAssist?: boolean, motorElevated?: boolean }} context
 */
export function assertEvf02AiAssistCeiling(proposedELevel, context = {}) {
  if (!context.aiAssist) return proposedELevel;
  const idx = E_LEVELS.indexOf(proposedELevel);
  const maxIdx = E_LEVELS.indexOf(AI_ASSIST_MAX_E_LEVEL);
  if (idx > maxIdx && !context.motorElevated) {
    throw new Error(
      `[CB-06 EVF-02] AI assist cannot elevate above ${AI_ASSIST_MAX_E_LEVEL} without motor`
    );
  }
  return proposedELevel;
}

/**
 * @param {import('../cb02/sourceRef.js').ReturnType<buildSourceRef>} sourceRef
 */
export function classifySourceRefEvidence(sourceRef) {
  const tier = sourceRef.epistemicLevel ?? 1;
  // DSO tier 1 = primary official catalog source → material evidence E3+
  const eLevel =
    tier <= 1 && (sourceRef.familyId?.includes("REGISTRAL") || sourceRef.familyId === "GIS_OFFICIAL")
      ? "E3"
      : mapEpistemicToELevel(tier);
  const cLevel = tier <= 1 ? "C2" : tier >= 3 ? "C2" : "C3";
  return { eLevel, cLevel };
}

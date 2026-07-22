/**
 * CB-14 — Constitutional limits for AI Assist (subordinate, never sovereign)
 */

import { assertEvf02AiAssistCeiling, AI_ASSIST_MAX_E_LEVEL } from "../cb06/evidenceVocabulary.js";
import { assertNotAccessTierAssignment } from "../cb00/catalogActorGuard.js";
import { validateCatalogActor } from "../cb00/catalogActorGuard.js";

const SOVEREIGN_INVOKER_FAMILIES = new Set(["MOT", "LOOP", "SWM"]);

/**
 * @param {string} invoker
 */
export function assertAuthorizedInvoker(invoker) {
  const result = validateCatalogActor(invoker);
  if (!result.valid || !SOVEREIGN_INVOKER_FAMILIES.has(result.family)) {
    throw new Error(
      `[CB-14 Constitutional] AIA invocable only by MOT/LOOP/SWM — got: ${invoker}`
    );
  }
  return result;
}

/**
 * @param {object} output
 */
export function applyAiAssistOutputLimits(output) {
  assertNotAccessTierAssignment("access_tier", output.accessTier);

  if (output.approveDiamond === true || output.emitDecision === true) {
    throw new Error("[CB-14 Constitutional] AI cannot approve Diamond or emit Decision");
  }

  const eLevel = assertEvf02AiAssistCeiling(output.proposedELevel ?? "E1", {
    aiAssist: true,
    motorElevated: false,
  });

  return {
    ...output,
    proposedELevel: eLevel,
    aiAssist: true,
    sovereign: false,
    eLevelCapped: eLevel === AI_ASSIST_MAX_E_LEVEL || eLevel < AI_ASSIST_MAX_E_LEVEL,
  };
}

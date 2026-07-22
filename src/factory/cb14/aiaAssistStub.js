/**
 * CB-14 — AIA assist stub (no real model inference)
 */

import { getAiaPattern } from "./aiaCatalog.js";

/**
 * @param {string} aiaId
 * @param {{ factoryKey?: string, inputs?: object }} [context]
 */
export function executeAiaAssistStub(aiaId, context = {}) {
  const pattern = getAiaPattern(aiaId);
  const confidence = pattern.uncertaintyMax != null ? 1 - pattern.uncertaintyMax : 0.75;

  return {
    aiaId,
    fun: pattern.fun,
    suggestion: {
      summary: `Stub assist for ${pattern.name}`,
      fun: pattern.fun,
      factoryKey: context.factoryKey,
      aiExecution: false,
    },
    proposedELevel: pattern.fun === "EXT" ? "E2" : "E1",
    confidence,
    uncertaintyScore: pattern.uncertaintyMax ?? 0.2,
    presentAsFact: false,
    assistiveOnly: true,
  };
}

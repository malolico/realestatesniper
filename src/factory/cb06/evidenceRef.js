/**
 * CB-06 — evidence_ref schema (EVF-01 intercept)
 */

import { randomUUID } from "node:crypto";
import { assertEvf02AiAssistCeiling } from "./evidenceVocabulary.js";

/**
 * @param {{
 *   factoryKey: string,
 *   motorId: string,
 *   manifestRunId: string,
 *   sourceRef?: object,
 *   eLevel: string,
 *   cLevel: string,
 *   mpiDomain?: string,
 *   knowledgeDelta?: object,
 *   aiAssist?: boolean,
 *   motorElevated?: boolean,
 * }} input
 */
export function buildEvidenceRef(input) {
  const eLevel = assertEvf02AiAssistCeiling(input.eLevel, {
    aiAssist: input.aiAssist,
    motorElevated: input.motorElevated,
  });

  return Object.freeze({
    id: `EVD-${input.factoryKey.replace(/[^a-zA-Z0-9]/g, "").slice(0, 12)}-${randomUUID().slice(0, 8)}`,
    kind: "EVIDENCE_REF",
    rule: "EVF-01",
    factoryKey: input.factoryKey,
    motorId: input.motorId,
    manifestRunId: input.manifestRunId,
    sourceRefId: input.sourceRef?.id ?? null,
    eLevel,
    cLevel: input.cLevel,
    mpiDomain: input.mpiDomain ?? null,
    knowledgeDelta: input.knowledgeDelta ?? {},
    interceptedAt: new Date().toISOString(),
    constitutionalPhase: "CB-06",
  });
}

export function isEvidenceRef(value) {
  return value?.kind === "EVIDENCE_REF" && typeof value.id === "string";
}

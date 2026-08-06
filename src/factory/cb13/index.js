/**
 * CB-13 — Intelligence / Readiness layer (P7)
 */

export {
  INTELLIGENCE_MPI_DOMAINS,
  INTELLIGENCE_MOTORS,
  INTELLIGENCE_LOOPS,
  INTELLIGENCE_PIPELINE_SEQUENCE,
  READINESS_GATES,
  READINESS_GATE_COUNT,
  OMC_MOTOR_COUNT_CONSTITUTIONAL,
  CAP_BLUEPRINT_MISMATCH,
  isIntelligenceMotor,
} from "./intelligenceCatalog.js";

export {
  evaluateGateG0,
  evaluateGateG1,
  evaluateGateG2,
  evaluateGateG3,
  evaluateGateG4,
  evaluateGateG5,
  evaluateGateG6,
  evaluateAllReadinessGates,
} from "./readinessGates.js";

export { IntelligenceKnowledgeStore, DEFAULT_INTELLIGENCE_ROOT } from "./intelligenceKnowledgeStore.js";
export {
  buildIntelligenceFixtureBundle,
  resolveIntelligenceSourceBundle,
} from "./intelligenceSourceFixtures.js";
export {
  buildIntelligenceRecordedEnrichmentBundle,
  resolveDefaultRecordedPackRoot,
} from "./intelligenceRecordedEnrichmentAdapter.js";
export { applyIntelligenceRecordedEvidenceCheckpoint } from "./intelligenceRecordedEvidenceCheckpoint.js";
export { INTELLIGENCE_MOTOR_HANDLERS, registerIntelligenceMotorHandlers } from "./intelligenceMotorHandlers.js";
export { runIntelligencePipeline } from "./intelligencePipeline.js";
export { ingestIntelligenceEvidence, evaluateIntelligenceSufficiency } from "./intelligenceEvidenceIngest.js";
export { SUFFICIENCY_GAP_TARGETS, routeSufficiencyGap, recordSufficiencyGapDerivation } from "./sufficiencyGapRouter.js";
export { buildDefaultKnownUnknowns, validateKnownUnknowns } from "./knownUnknownsRegistry.js";
export {
  recordReadinessGateEvaluation,
  recordReadinessStateTransition,
  recordKnownUnknownsDeclaration,
  recordIntelligenceLayerComplete,
} from "./readinessLedger.js";
export { recordDecisionHandoffPrep, isDecisionHandoffEnabled } from "./decisionHandoffPrep.js";
export { advanceToConsolidation, transitionToReady } from "./stateProgression.js";
export {
  evaluateIntelligenceEvidenceSufficiency,
  recordLoopIntEvd01,
  LOOP_INT_EVD_01,
} from "./loopIntEvd01.js";
export {
  evaluateIntelligenceReadiness,
  recordLoopIntRdy01,
  LOOP_INT_RDY_01,
} from "./loopIntRdy01.js";
export { evaluateIntelligenceGap, recordLoopIntGap01, LOOP_INT_GAP_01 } from "./loopIntGap01.js";
export { evaluateIntelligenceQuality, recordLoopIntQlt01, LOOP_INT_QLT_01 } from "./loopIntQlt01.js";
export { evaluateIntelligenceFreshness, recordLoopIntFrs01, LOOP_INT_FRS_01 } from "./loopIntFrs01.js";
export { IntelligenceLayerService } from "./intelligenceLayerService.js";
export { runCb13Validation } from "./validateCb13.js";

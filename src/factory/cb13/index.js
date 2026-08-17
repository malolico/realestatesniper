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

/** SP09-P1 — Research Contracts (contract language only; no Adaptive Research behavior) */
export {
  RESEARCH_CONTRACT_PROGRAM,
  RESEARCH_CONTRACT_VERSION,
  RESEARCH_QUESTION_SCHEMA_ID,
  RESEARCH_ACTION_SCHEMA_ID,
  PLANNING_DECISION_SCHEMA_ID,
  RESEARCH_TASK_SCHEMA_ID,
  RESEARCH_OUTCOME_SCHEMA_ID,
  RESEARCH_QUESTION_STATUS,
  RESEARCH_ACTION_ROLE,
  PLANNING_DECISION_STATUS,
  RESEARCH_TASK_STATUS,
  RESEARCH_OUTCOME_STATUS,
  RESEARCH_OUTCOME_AUTHORITY,
  FORBIDDEN_CAPABILITY_RESOLUTION_KEYS,
  validateResearchQuestion,
  validateResearchAction,
  validatePlanningDecision,
  validateResearchTask,
  validateResearchOutcome,
  validateResearchContractChain,
  assertResearchQuestion,
  assertResearchAction,
  assertPlanningDecision,
  assertResearchTask,
  assertResearchOutcome,
  assertResearchContractChain,
  buildResearchQuestion,
  buildResearchAction,
  buildPlanningDecision,
  buildResearchTask,
  buildResearchOutcome,
} from "./researchContracts.js";
export { runSp09P1ResearchContractsValidation } from "./validateSp09P1ResearchContracts.js";

/** SP09-P2 — Minimum Capability Semantics (match only; no execution) */
export {
  CAPABILITY_SEMANTICS_PROGRAM,
  CAPABILITY_SEMANTICS_VERSION,
  CAPABILITY_SEMANTICS_SCHEMA_ID,
  CAPABILITY_FAMILY,
  CAPABILITY_RESOLUTION_STATUS,
  CAPABILITY_NEED,
  CAPABILITY_SEMANTICS_MAP,
  CAPABILITY_SEMANTICS_AUTHORITY,
  verifyCatalogIdentity,
  validateCapabilityNeedInput,
  buildMatchedCapabilityResolution,
  buildUnresolvedCapabilityResolution,
  validateCapabilitySemanticsResult,
  resolveCapabilityNeed,
  resolveCapabilityNeedFromTask,
} from "./capabilitySemantics.js";
export { runSp09P2CapabilitySemanticsValidation } from "./validateSp09P2CapabilitySemantics.js";

/** SP09-P3 — Adaptive Planner V1 (WHAT/WHY only; no execution) */
export {
  ADAPTIVE_PLANNER_PROGRAM,
  ADAPTIVE_PLANNER_VERSION,
  ADAPTIVE_PLANNER_AUTHORITY,
  validateResearchPlannerStateV1,
  nonSelectionReferenceActionId,
  validateAdaptivePlannerInput,
  planAdaptiveResearch,
} from "./adaptivePlanner.js";
export { runSp09P3AdaptivePlannerValidation } from "./validateSp09P3AdaptivePlanner.js";

/** SP09-P4 — Research Execution Bridge (interface adaptation only; no auth grant) */
export {
  RESEARCH_EXECUTION_BRIDGE_PROGRAM,
  RESEARCH_EXECUTION_BRIDGE_VERSION,
  RESEARCH_EXECUTION_BRIDGE_AUTHORITY,
  buildDispatchArtifact,
  validateDispatchArtifact,
  normalizeMotorRuntimeResult,
  normalizeLoopRuntimeResult,
  normalizeSwarmRuntimeResult,
  normalizeSwarmMandate,
  validateLoopCtx,
  validateResearchExecutionBridgeInput,
  executeResearchBridge,
} from "./researchExecutionBridge.js";
export { runSp09P4ResearchExecutionBridgeValidation } from "./validateSp09P4ResearchExecutionBridge.js";

/** SP09-P5 — Evidence Feedback (RESULT → CB06 MotEvd01 / LOOP observation; no re-plan) */
export {
  EVIDENCE_FEEDBACK_PROGRAM,
  EVIDENCE_FEEDBACK_VERSION,
  EVIDENCE_FEEDBACK_KIND,
  EVIDENCE_FEEDBACK_AUTHORITY,
  validateEvidenceFeedbackInput,
  applyEvidenceFeedback,
} from "./evidenceFeedback.js";
export { runSp09P5EvidenceFeedbackValidation } from "./validateSp09P5EvidenceFeedback.js";

/** SP09-P6 — Bounded Re-plan (one P3 evaluation; P6-local disposition; no execution) */
export {
  BOUNDED_REPLAN_PROGRAM,
  BOUNDED_REPLAN_VERSION,
  BOUNDED_REPLAN_DISPOSITION,
  BOUNDED_REPLAN_AUTHORITY,
  validateBoundedReplanInput,
  applyBoundedReplan,
} from "./boundedReplan.js";
export { runSp09P6BoundedReplanValidation } from "./validateSp09P6BoundedReplan.js";

/** SP09-P7 — Golden Path / Acceptance Proof (compose P1–P6; no new production behavior) */
export {
  SP09_P7_PROGRAM,
  SP09_P7_VERSION,
  runSp09P7GoldenPathValidation,
} from "./validateSp09P7GoldenPath.js";

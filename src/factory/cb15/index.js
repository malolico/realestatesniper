/**
 * CB-15 — Orchestration Bus FFO
 */

export {
  FFO_LAYER_PIPELINE,
  P_CONST_PIPELINE,
  FFO_CONSTITUTIONAL_LAWS,
  ORCHESTRATION_BUS_ACTOR,
  OMC_MOTOR_COUNT_CONSTITUTIONAL,
  SOVEREIGN_DOWNSTREAM_BOUNDARIES,
} from "./ffoCatalog.js";

export { resolvePConstConflict, getPConstPriority } from "./pConstArbiter.js";
export { assertFactoryBoundary, isBlockedFactoryOperation } from "./factoryBoundaryGuard.js";
export {
  orchestrateStateTransition,
  validateSixteenStateMachine,
  FACTORY_LIFECYCLE_PATH,
  validateTransitionPath,
  ST_STATE_COUNT,
} from "./stateOrchestrator.js";
export { collectHandoffs, recordFfoHandoff, buildHandoffSummary } from "./handoffManager.js";
export { aggregateElr, recordElrAggregation } from "./elrAggregator.js";
export { calculateMaturityScore } from "./maturityScore.js";
export {
  scheduleAntiDegradationWatch,
  recordAntiDegradationSchedule,
} from "./antiDegradationScheduler.js";
export { recordBusEvent, recordOrchestrationComplete } from "./orchestrationBus.js";
export { OrchestrationBusService } from "./orchestrationBusService.js";
export { runOlcLoopsOnExisting } from "./loopBusBridge.js";
export { runCb15Validation } from "./validateCb15.js";

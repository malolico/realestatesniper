/**
 * CB-12 — Swarm Coordinator (14 SWM)
 */

export {
  OSC_SWM_COUNT,
  SWM_CATALOG,
  SWM_IDS,
  LOOP_TO_SWM,
  getSwarmPattern,
  getSwarmForDerivingLoop,
} from "./swarmCatalog.js";

export {
  CS_LEVELS,
  US_LEVELS,
  resolveCsLevel,
  resolveUsLevel,
  evaluateConvergenceState,
} from "./convergenceState.js";

export {
  DIE_CODES,
  SWARM_PHASES,
  buildSwaIn,
  buildSwaOut,
  resolveDieOutcome,
  buildLoopReturn,
  validateSwaInMandate,
} from "./swarmLifecycle.js";

export {
  recordSwarmMissionOpen,
  recordSwarmMissionClose,
  recordSwarmLoopReturn,
  recordSwarmCoordinatorRegistryComplete,
} from "./missionLedger.js";

export {
  SWARM_TARGET_ALIASES,
  normalizeSwarmTarget,
  isStr6Derivation,
  collectStr6Derivations,
  buildMandateFromDerivation,
  resolveStr6Mandates,
  buildSyntheticStr6Mandate,
} from "./str6Ingress.js";

export { coordinateSwarmMotors, assertNoUsurpation } from "./swarmCoordinationStub.js";
export { SwarmCoordinatorService } from "./swarmCoordinatorService.js";
export { runCb12Validation } from "./validateCb12.js";

/**
 * CB-14 — AI Assist Layer (26 AIA)
 */

export {
  OAC_AIA_COUNT,
  AIA_CATALOG,
  AIA_IDS,
  CLASS_X_AIA_BLOCKLIST,
  getAiaPattern,
  isProductionAia,
} from "./aiaCatalog.js";

export { PRH_CODES, validatePrhCompliance } from "./prhProhibitions.js";
export { enforceAutAuthority } from "./autAuthority.js";
export { SLOT_CATALOG, SLOT_COUNT, getSlot, validateDualRunClassC } from "./slotRegistry.js";
export { assertAuthorizedInvoker, applyAiAssistOutputLimits } from "./constitutionalLimits.js";
export {
  recordRlgInvocation,
  recordAiAssistRegistryComplete,
  recordDualRunValidation,
} from "./reasoningLedger.js";
export { executeAiaAssistStub } from "./aiaAssistStub.js";
export { AiaInvocationGateway } from "./aiaInvocationGateway.js";
export { AiAssistLayerService } from "./aiAssistLayerService.js";
export { runCb14Validation } from "./validateCb14.js";

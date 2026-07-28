export {
  MOTOR_CATALOG,
  MOTOR_CATALOG_COUNT,
  MOTOR_CATALOG_INDEXED_EXPECTED,
  OMC_CONSTITUTIONAL_COVERAGE_COUNT,
  assertCapBinding,
  assertMotorInCatalog,
  getMotorCatalogEntry,
} from "./motorCatalogIndex.js";

export {
  DEP_EVD_INTERCEPT_RULE,
  resolveDependencies,
} from "./motorDependencies.js";

export { checkMotorDependencies } from "./dependencyResolver.js";
export { buildMotorManifest } from "./motorManifest.js";
export { MotorExecutionLock } from "./motorExecutionLock.js";
export { STUB_MOTOR_HANDLERS, getStubHandler } from "./stubMotorHandlers.js";
export { MotorRuntime, validateMotorRegistration } from "./motorRuntime.js";
export { MotorRuntimeService } from "./motorRuntimeService.js";
export { runCb04Validation } from "./validateCb04.js";

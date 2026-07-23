/**
 * II.3-IMPL fixtures — reuse II.2 fixtures; add atomicity fragment cases.
 */

export {
  fixtureHealthy,
  fixtureStale,
  fixtureStaleMissingWarning,
  fixtureOwnershipRegistryMismatch,
  fixtureUnknownRootField,
  fixtureContractName,
  fixtureRecords,
  fixtureBadChecksum,
  FIXTURE_CATALOG,
} from "../readModel/fixtures/index.js";

export function fixtureAtomicFragment() {
  return {
    __fragment: true,
    contractId: "factory.observability.read_model",
    schemaVersion: "2.0.0",
  };
}

export function fixtureAtomicArray() {
  return [{ contractId: "factory.observability.read_model" }];
}

export function fixtureAtomicNull() {
  return null;
}

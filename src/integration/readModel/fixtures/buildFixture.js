/**
 * Shared fixture builder for II.2 Read Model v2.
 */

import { attachIntegrity } from "../integrity.js";
import {
  CONTRACT_ID,
  DATA_CLASSIFICATION,
  MODE,
  SCHEMA_VERSION,
} from "../constants.js";

/**
 * @param {object} [overrides]
 * @param {{ attach?: boolean, verified?: boolean }} [options]
 */
export function buildBaseSnapshot(overrides = {}, options = {}) {
  const base = {
    contractId: CONTRACT_ID,
    schemaVersion: SCHEMA_VERSION,
    mode: MODE,
    snapshotId: "snap-healthy-001",
    generatedAt: "2026-07-23T12:00:00.000Z",
    staleAfter: "2026-07-23T13:00:00.000Z",
    environment: "test",
    dataClassification: DATA_CLASSIFICATION,
    producer: {
      producerId: "ii2-fixture-producer",
      producerVersion: "2.0.0",
      generatedBy: "read-model-fixture-builder",
      hostClass: "ci",
    },
    ownership: {
      factory: "FACTORY",
      registry: "REGISTRY",
      governance: "DOCUMENTATION",
      readModel: "INTEGRATION",
    },
    sourceProvenance: {
      sourceType: "COMPOSITE",
      sourceRevision: "rev-fixture-001",
      observedAt: "2026-07-23T11:59:00.000Z",
      inputs: [
        {
          sourceId: "factory-local",
          sourceKind: "FACTORY_TREE",
          revision: "cb15",
          status: "AVAILABLE",
        },
        {
          sourceId: "registry-local",
          sourceKind: "REGISTRY",
          revision: "reg-1",
          status: "AVAILABLE",
        },
      ],
    },
    integrity: {
      algorithm: "SHA-256",
      canonicalization: "JCS",
      checksum: "0".repeat(64),
      verified: false,
    },
    observationStatus: "HEALTHY",
    factoryObservation: {
      status: "AVAILABLE",
      phaseRange: { from: "CB-00", to: "CB-15" },
      implementedPhases: ["CB-00", "CB-15"],
      approvedPhases: ["CB-00", "CB-15"],
      blockedPhases: [],
      runtimeSummary: {
        motorsObserved: 1,
        loopsObserved: 1,
        swarmsObserved: 0,
        aiAssistantsObserved: 0,
      },
    },
    registryObservation: {
      status: "AVAILABLE",
      registryVersion: "1.0.0",
      entriesObserved: 1,
      lastObservedAt: "2026-07-23T11:58:00.000Z",
    },
    governance: {
      constitutionalStatus: "COMPLIANT",
      approvedBy: "Director",
      approvedAt: "2026-07-23T10:00:00.000Z",
      activeBlock: "II.2",
      blockedBlocks: ["II.2-IMPL", "II.3"],
      parking: [],
    },
    drift: {
      status: "NONE",
      items: [],
    },
    lineage: {
      previousSnapshotId: null,
      parentSnapshotId: null,
      generationSequence: 0,
      sourceRevision: "rev-fixture-001",
    },
    expedientes: [
      {
        expedienteId: "exp-deal-001",
        classification: "DEAL",
        status: "OBSERVED",
        identityVerified: true,
        valueVerified: false,
        pricingVerified: false,
        offMarket: false,
        ownerVerified: false,
        commercializationAuthorized: false,
        evidenceRefs: ["evd-ref-1"],
        warningCodes: [],
      },
    ],
    warnings: [],
    diagnostics: {
      status: "AVAILABLE",
      summary: "fixture healthy",
      checks: [
        {
          checkId: "chk-schema",
          status: "PASS",
          message: "schema ok",
        },
      ],
    },
  };

  const merged = deepMerge(base, overrides);
  if (options.attach === false) return merged;
  return attachIntegrity(merged, { verified: options.verified === true });
}

function deepMerge(target, source) {
  if (source === null || source === undefined) return target;
  if (Array.isArray(source)) return source.slice();
  if (typeof source !== "object") return source;
  const out = { ...target };
  for (const [key, value] of Object.entries(source)) {
    if (
      value &&
      typeof value === "object" &&
      !Array.isArray(value) &&
      target[key] &&
      typeof target[key] === "object" &&
      !Array.isArray(target[key])
    ) {
      out[key] = deepMerge(target[key], value);
    } else {
      out[key] = Array.isArray(value) ? value.slice() : value;
    }
  }
  return out;
}

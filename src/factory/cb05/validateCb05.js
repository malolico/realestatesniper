/**
 * CB-05 validation — Foundation Layer acceptance tests.
 */

import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import {
  assertPhaseUnlocked,
  isPhaseApproved,
  markPhaseComplete,
} from "../cb00/constructionGovernance.js";
import { CHECKLIST_STATUS } from "../cb00/canonComplianceChecklist.js";
import { FileElrStore } from "../cb01/fileElrStore.js";
import { FactoryRegistry } from "../cb01/factoryRegistry.js";
import { isProvisionalFactoryKey } from "../cb01/factoryKey.js";
import { ComplianceGateService } from "../cb03/complianceGateService.js";
import { ComplianceStateStore } from "../cb03/complianceStateStore.js";
import { MotorLockRegistry } from "../cb03/motorLockRegistry.js";
import { MotorExecutionLock } from "../cb04/motorExecutionLock.js";
import { MotorRuntime } from "../cb04/motorRuntime.js";
import { checkMotorDependencies } from "../cb04/dependencyResolver.js";
import { MOTOR_CATALOG_COUNT } from "../cb04/motorCatalogIndex.js";
import { FOUNDATION_MPI_DOMAINS, OMC_MOTOR_COUNT_CONSTITUTIONAL } from "./foundationCatalog.js";
import { FoundationKnowledgeStore } from "./foundationKnowledgeStore.js";
import { FoundationLayerService } from "./foundationLayerService.js";
import { DERIVATION_TARGETS } from "./foundationConflictRouter.js";
import {
  resolveFoundationSourceBundle,
  buildFoundationFixtureBundle,
} from "./foundationSourceFixtures.js";
import { SOURCE_MODE } from "./decisionTrustBoundary.js";
import { FOUNDATION_MOTOR_HANDLERS } from "./foundationMotorHandlers.js";

function createTempEnv() {
  const base = fs.mkdtempSync(path.join(os.tmpdir(), "cb05-validation-"));
  return {
    base,
    registryDir: path.join(base, "registry"),
    complianceDir: path.join(base, "compliance"),
    foundationDir: path.join(base, "foundation"),
  };
}

function createFoundationStack(env) {
  const store = new FileElrStore(env.registryDir);
  const registry = new FactoryRegistry({ store });
  const compliance = new ComplianceGateService({
    registry,
    stateStore: new ComplianceStateStore(env.complianceDir),
    lockRegistry: new MotorLockRegistry(),
  });
  const knowledgeStore = new FoundationKnowledgeStore(env.foundationDir);
  const runtime = new MotorRuntime({
    registry,
    compliance,
    executionLock: new MotorExecutionLock(),
  });
  const service = new FoundationLayerService({
    registry,
    compliance,
    knowledgeStore,
    runtime,
  });
  return { registry, compliance, knowledgeStore, runtime, service };
}

export function validateCb05Governance() {
  const errors = [];
  try {
    assertPhaseUnlocked("CB-05");
  } catch (err) {
    errors.push(err.message);
  }
  if (!isPhaseApproved("CB-04")) {
    errors.push("CB-04 is not APPROVED");
  }
  return { errors };
}

export async function validateIdn01AndDep01() {
  const errors = [];
  const env = createTempEnv();

  try {
    const { service } = createFoundationStack(env);

    const blockedBefore = checkMotorDependencies("MOT-MOT-01", {
      completedMotors: new Set(),
    });
    if (blockedBefore.allowed) {
      errors.push("DEP-01 should block MOT-MOT-01 before MOT-IDN-01");
    }

    const result = await service.bootstrapFoundation({
      candidateRef: "dep01-test",
      parcelId: "123-45-678",
    });

    if (!result.dep01Satisfied) {
      errors.push("DEP-01 not satisfied after foundation bootstrap");
    }

    const allowedAfter = service.assertDep01ForUpperLayer(result.factoryKey, "MOT-MOT-01");
    if (!allowedAfter.allowed) {
      errors.push("DEP-01 should allow MOT-MOT-01 after MOT-IDN-01");
    }

    if (result.manifests.every((m) => m.motorId !== "MOT-IDN-01")) {
      errors.push("MOT-IDN-01 manifest missing");
    }
  } catch (err) {
    errors.push(err.message);
  } finally {
    fs.rmSync(env.base, { recursive: true, force: true });
  }

  return { errors };
}

export async function validateFoundationLoopsAndHandoff() {
  const errors = [];
  const env = createTempEnv();

  try {
    const { service } = createFoundationStack(env);
    const result = await service.bootstrapFoundation({
      candidateRef: "loops-test",
      parcelId: "999-88-777",
    });

    if (result.quality.finalizer !== "FIN-S" || !result.quality.sufficient) {
      errors.push("LOOP-FND-SUP-01 should reach FIN-S on clean foundation run");
    }

    if (!result.quality.handoff || result.quality.handoff.target !== "LOOP-LEG-SUP-01") {
      errors.push("FIN-S handoff to LEG missing");
    }

    if (result.freshness.finalizer !== "FIN-S" || !result.freshness.fresh) {
      errors.push("LOOP-FND-FRS-01 should report fresh fixtures");
    }

    const lineage = service.getFoundationLineage(result.factoryKey);
    const loopRuns = lineage.loop_ledger_refs.filter((r) =>
      ["LOOP_FND_SUP_01_RUN", "LOOP_FND_FRS_01_RUN"].includes(r.kind)
    );
    if (loopRuns.length < 2) {
      errors.push("Both FND loops should register in loop_ledger_refs");
    }

    const handoffs = lineage.decision_handoffs.filter((h) => h.kind === "FND_FIN_S_HANDOFF");
    if (handoffs.length < 1) {
      errors.push("FIN-S decision handoff not recorded");
    }
  } catch (err) {
    errors.push(err.message);
  } finally {
    fs.rmSync(env.base, { recursive: true, force: true });
  }

  return { errors };
}

export async function validateMpiDomainsWithSourceRefs() {
  const errors = [];
  const env = createTempEnv();

  try {
    const { service } = createFoundationStack(env);
    const result = await service.bootstrapFoundation({
      candidateRef: "mpi-test",
      parcelId: "111-22-333",
    });

    for (const domain of FOUNDATION_MPI_DOMAINS) {
      const coverage = result.mpiCoverage.find((c) => c.domain === domain);
      if (!coverage?.reachable) {
        errors.push(`MPI domain ${domain} not reachable`);
      }
      if ((coverage?.sourceRefCount ?? 0) < 1) {
        errors.push(`MPI domain ${domain} missing source_refs`);
      }
    }

    const lineage = service.getFoundationLineage(result.factoryKey);
    if ((lineage.motor_manifests?.length ?? 0) < 5) {
      errors.push("Foundation should produce multiple motor manifests");
    }
  } catch (err) {
    errors.push(err.message);
  } finally {
    fs.rmSync(env.base, { recursive: true, force: true });
  }

  return { errors };
}

export async function validateConflictDerivation() {
  const errors = [];
  const env = createTempEnv();

  try {
    const { service } = createFoundationStack(env);
    const result = await service.bootstrapFoundation({
      candidateRef: "conflict-test",
      parcelId: "conflict-001",
      simulateConflict: true,
      reconciled: false,
    });

    if (result.quality.finalizer !== "FIN-X") {
      errors.push("Unresolved conflict should finalize FIN-X");
    }

    const lineage = service.getFoundationLineage(result.factoryKey);
    const derivations = [
      ...(lineage.motor_manifests ?? []),
    ];
    const record = service.registry.getExpediente(result.factoryKey);
    const conflicts = record.elr.conflict_resolutions ?? [];
    const swarms = record.elr.swarm_mission_refs ?? [];

    const hasEvidence =
      conflicts.some((c) => c.pendingPhase === DERIVATION_TARGETS.EVIDENCE) ||
      swarms.some((s) => s.pendingPhase === DERIVATION_TARGETS.SWARM);

    if (!hasEvidence) {
      errors.push("Conflict should derive to CB-06 Evidence or CB-12 SWM");
    }

    if (derivations.length < 1) {
      errors.push("Conflict path should still emit motor manifests");
    }
  } catch (err) {
    errors.push(err.message);
  } finally {
    fs.rmSync(env.base, { recursive: true, force: true });
  }

  return { errors };
}

export async function validateStateTransitionsAndFactoryKey() {
  const errors = [];
  const env = createTempEnv();

  try {
    const { registry, service } = createFoundationStack(env);
    const result = await service.bootstrapFoundation({
      candidateRef: "state-key-test",
      parcelId: "555-66-777",
    });

    if (result.state !== "ST-PROD") {
      errors.push(`Expected ST-PROD, got ${result.state}`);
    }

    if (isProvisionalFactoryKey(result.factoryKey)) {
      errors.push("factory_key should resolve from provisional to definitive");
    }

    const record = registry.getExpediente(result.factoryKey);
    const states = record.elr.state_transitions.map((t) => t.to);
    if (!states.includes("ST-IDN") || !states.includes("ST-PROD")) {
      errors.push("ST-NASC → ST-IDN → ST-PROD path not recorded");
    }

    if ((record.elr.factory_key_history?.length ?? 0) < 1) {
      errors.push("factory_key_history not recorded after identity resolution");
    }
  } catch (err) {
    errors.push(err.message);
  } finally {
    fs.rmSync(env.base, { recursive: true, force: true });
  }

  return { errors };
}

export function validateOmcCountRiskDocumented() {
  const errors = [];
  // HQ-01 Model R1: constitutional coverage stays 52; indexed catalog stays 56.
  if (OMC_MOTOR_COUNT_CONSTITUTIONAL !== 52) {
    errors.push("Constitutional OMC count constant should remain 52");
  }
  if (MOTOR_CATALOG_COUNT !== 56) {
    errors.push(`CB-04 catalog index should remain 56, got ${MOTOR_CATALOG_COUNT}`);
  }
  if (MOTOR_CATALOG_COUNT < OMC_MOTOR_COUNT_CONSTITUTIONAL) {
    errors.push("Indexed catalog must not fall below constitutional coverage");
  }
  return { errors, deferredReconciliation: false };
}

/**
 * PS05-01 Truth Boundary — CB-05 targeted proofs (T01–T04, T08–T09).
 */
export async function validatePs0501TruthBoundaryCb05() {
  const errors = [];
  try {
    const missing = resolveFoundationSourceBundle("ps05-t01", {
      decisionFacing: true,
      packRoot: path.join(os.tmpdir(), "ps05-no-pack-" + Date.now()),
    });
    if (missing.sourceMode !== SOURCE_MODE.UNAVAILABLE || missing.synthetic === true) {
      errors.push("T01: Decision-facing missing pack must be UNAVAILABLE, not synthetic");
    }
    if (missing.decisionTrusted === true) {
      errors.push("T01: UNAVAILABLE bundle must not be decisionTrusted");
    }

    const stale = resolveFoundationSourceBundle("ps05-t02", { decisionFacing: true });
    if (stale.sourceMode !== SOURCE_MODE.UNAVAILABLE) {
      errors.push("T02: Decision-facing stale/freshness breach must be UNAVAILABLE");
    }
    if (stale.recordedSkippedReason !== "freshness_sla_breach" && stale.synthetic === true) {
      errors.push("T02: must not silently substitute synthetic on Decision path");
    }

    const forced = resolveFoundationSourceBundle("ps05-t03", {
      forceSynthetic: true,
      decisionFacing: true,
    });
    if (forced.synthetic !== true || forced.sourceMode !== SOURCE_MODE.SYNTHETIC_FIXTURE) {
      errors.push("T03: forceSynthetic must remain identifiable SYNTHETIC_FIXTURE");
    }
    if (forced.decisionTrusted === true) {
      errors.push("T03: synthetic fixture must not be decisionTrusted");
    }

    const fixture = buildFoundationFixtureBundle("ps05-t03b");
    if (fixture.stubBusinessFact !== true || fixture.decisionTrusted !== false) {
      errors.push("T03: foundation fixture bundle must mark stub/non-trusted");
    }

    const motor = await FOUNDATION_MOTOR_HANDLERS["MOT-IDN-01"]({
      factoryKey: "ps05-t04",
      inputs: { forceSynthetic: true },
    });
    if (motor.outputs?.synthetic !== true || motor.outputs?.sourceMode !== SOURCE_MODE.SYNTHETIC_FIXTURE) {
      errors.push("T04: synthetic marker must survive into MOT-IDN-01 outputs");
    }
    if (motor.outputs?.decisionTrusted === true) {
      errors.push("T04: synthetic motor outputs must not be decisionTrusted");
    }

    const happy = resolveFoundationSourceBundle("ps05-t08", {
      decisionFacing: true,
      preferRecordedEnrichment: true,
    });
    if (happy.sourceMode !== SOURCE_MODE.RECORDED_ENRICHMENT || happy.synthetic === true) {
      errors.push("T08: recorded enrichment happy path must remain operational");
    }

    const synthLane = resolveFoundationSourceBundle("ps05-t09", { forceSynthetic: true });
    if (synthLane.synthetic !== true) {
      errors.push("T09: explicit synthetic test lane must remain operational");
    }

    const unavailMotor = await FOUNDATION_MOTOR_HANDLERS["MOT-LOC-01"]({
      factoryKey: "ps05-t01m",
      inputs: { decisionFacing: true },
    });
    if (unavailMotor.outputs?.sourceMode !== SOURCE_MODE.UNAVAILABLE) {
      errors.push("T01/M03: Decision-facing motor must surface UNAVAILABLE, not synthetic facts");
    }
  } catch (err) {
    errors.push(err.message);
  }
  return { errors };
}

/**
 * @param {{ markComplete?: boolean, approvedBy?: string }} [options]
 */
export async function runCb05Validation(options = {}) {
  const gov = validateCb05Governance();
  const dep01 = await validateIdn01AndDep01();
  const loops = await validateFoundationLoopsAndHandoff();
  const mpi = await validateMpiDomainsWithSourceRefs();
  const conflict = await validateConflictDerivation();
  const stateKey = await validateStateTransitionsAndFactoryKey();
  const omcRisk = validateOmcCountRiskDocumented();
  const ps0501 = await validatePs0501TruthBoundaryCb05();

  const allErrors = [
    ...gov.errors,
    ...dep01.errors,
    ...loops.errors,
    ...mpi.errors,
    ...conflict.errors,
    ...stateKey.errors,
    ...omcRisk.errors,
    ...ps0501.errors,
  ];

  const checklist = [
    {
      id: "CB05-01",
      criterion: "MOT-IDN-01 resuelve identidad — DEP-01 satisfecho",
      status: dep01.errors.length === 0 ? CHECKLIST_STATUS.PASS : CHECKLIST_STATUS.PENDING,
    },
    {
      id: "CB05-02",
      criterion: "LOOP-FND-SUP-01 y LOOP-FND-FRS-01 operativos con FIN-S → LEG",
      status: loops.errors.length === 0 ? CHECKLIST_STATUS.PASS : CHECKLIST_STATUS.PENDING,
    },
    {
      id: "CB05-03",
      criterion: "Dominios MPI 01–03 alcanzables con manifests y source_refs",
      status: mpi.errors.length === 0 ? CHECKLIST_STATUS.PASS : CHECKLIST_STATUS.PENDING,
    },
    {
      id: "CB05-04",
      criterion: "Identidad conflictiva deriva a Evidence o SWM según STR",
      status: conflict.errors.length === 0 ? CHECKLIST_STATUS.PENDING : CHECKLIST_STATUS.PENDING,
    },
    {
      id: "CB05-05",
      criterion: "Transiciones ST-NASC → ST-IDN → ST-PROD y factory_key C1–C2",
      status: stateKey.errors.length === 0 ? CHECKLIST_STATUS.PASS : CHECKLIST_STATUS.PENDING,
    },
    {
      id: "CB05-PS05-01",
      criterion: "PS05-01 Truth Boundary — Decision-facing fail-closed + synthetic lane",
      status: ps0501.errors.length === 0 ? CHECKLIST_STATUS.PASS : CHECKLIST_STATUS.PENDING,
    },
  ];

  checklist[3].status =
    conflict.errors.length === 0 ? CHECKLIST_STATUS.PASS : CHECKLIST_STATUS.PENDING;

  const passed = allErrors.length === 0 && checklist.every((i) => i.status === CHECKLIST_STATUS.PASS);

  let phaseRecord = null;
  if (passed && options.markComplete) {
    phaseRecord = markPhaseComplete("CB-05", {
      validationReport: "runCb05FoundationValidation",
      approvedBy: options.approvedBy ?? null,
      pendingDirectorApproval: !options.approvedBy,
    });
  }

  return {
    phase: "CB-05",
    passed,
    errors: allErrors,
    checklist,
    omcMotorCountRisk: {
      constitutional: OMC_MOTOR_COUNT_CONSTITUTIONAL,
      cb04CatalogIndexed: MOTOR_CATALOG_COUNT,
      reconciliationDeferred: omcRisk.deferredReconciliation,
    },
    phaseRecord,
    cb06Unlocked: passed ? isPhaseApproved("CB-05") : false,
  };
}

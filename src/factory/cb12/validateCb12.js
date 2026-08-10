/**
 * CB-12 validation — Swarm Coordinator acceptance tests.
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
import { ComplianceGateService } from "../cb03/complianceGateService.js";
import { ComplianceStateStore } from "../cb03/complianceStateStore.js";
import { MotorLockRegistry } from "../cb03/motorLockRegistry.js";
import { CLEARANCE_STATUS } from "../cb03/clearanceProtocol.js";
import { MotorExecutionLock } from "../cb04/motorExecutionLock.js";
import { MotorRuntime } from "../cb04/motorRuntime.js";
import { FoundationKnowledgeStore } from "../cb05/foundationKnowledgeStore.js";
import { EvidenceService } from "../cb06/evidenceService.js";
import { EvidenceRegistryStore } from "../cb06/evidenceRegistryStore.js";
import { LoopEngineService } from "../cb11/loopEngineService.js";
import { OMC_MOTOR_COUNT_CONSTITUTIONAL } from "../cb11/loopEngineCatalog.js";
import { OSC_SWM_COUNT, SWM_CATALOG, SWM_IDS } from "./swarmCatalog.js";
import { normalizeSwarmTarget, resolveStr6Mandates } from "./str6Ingress.js";
import { assertNoUsurpation, coordinateSwarmMotors } from "./swarmCoordinationStub.js";
import {
  CEP03_G1_GRANT_ID,
  SUPERVISED_COORDINATION_PATH,
  SUPERVISED_COORDINATION_SOURCE_MODE,
  STUB_FALLBACK_COORDINATION_PATH,
  executeSupervisedSwarmCoordination,
  resolveSupervisedCoordinationOrStub,
} from "./supervisedSwarmCoordinationAdapter.js";
import { SwarmCoordinatorService } from "./swarmCoordinatorService.js";
import { buildSwaIn } from "./swarmLifecycle.js";

function createTempEnv() {
  const base = fs.mkdtempSync(path.join(os.tmpdir(), "cb12-validation-"));
  return {
    base,
    registryDir: path.join(base, "registry"),
    complianceDir: path.join(base, "compliance"),
    foundationDir: path.join(base, "foundation"),
    evidenceDir: path.join(base, "evidence"),
    legitimacyDir: path.join(base, "legitimacy"),
    distressDir: path.join(base, "distress"),
    economyDir: path.join(base, "economy"),
    environmentDir: path.join(base, "environment"),
  };
}

function createSwarmStack(env) {
  const store = new FileElrStore(env.registryDir);
  const registry = new FactoryRegistry({ store });
  const compliance = new ComplianceGateService({
    registry,
    stateStore: new ComplianceStateStore(env.complianceDir),
    lockRegistry: new MotorLockRegistry(),
  });
  const foundationKnowledgeStore = new FoundationKnowledgeStore(env.foundationDir);
  const runtime = new MotorRuntime({
    registry,
    compliance,
    executionLock: new MotorExecutionLock(),
  });
  const evidence = new EvidenceService({
    registry,
    compliance,
    foundationKnowledgeStore,
    runtime,
    evidenceStore: new EvidenceRegistryStore(env.evidenceDir),
  });
  const loopEngine = new LoopEngineService({
    registry,
    compliance,
    evidenceService: evidence,
    runtime,
  });
  const coordinator = new SwarmCoordinatorService({
    registry,
    compliance,
    evidenceService: evidence,
    loopEngine,
  });
  return { registry, compliance, evidence, loopEngine, coordinator };
}

export function validateCb12Governance() {
  const errors = [];
  try {
    assertPhaseUnlocked("CB-12");
  } catch (err) {
    errors.push(err.message);
  }
  if (!isPhaseApproved("CB-11")) {
    errors.push("CB-11 is not APPROVED");
  }
  return { errors };
}

export function validateSwarmCatalog() {
  const errors = [];
  if (SWM_CATALOG.length !== OSC_SWM_COUNT) {
    errors.push(`Expected ${OSC_SWM_COUNT} SWM patterns, got ${SWM_CATALOG.length}`);
  }
  const loops = new Set(SWM_CATALOG.map((s) => s.derivingLoop));
  if (loops.size !== OSC_SWM_COUNT) {
    errors.push("Deriving loop mapping is not 1:1 for SWM catalog");
  }
  for (const id of SWM_IDS) {
    if (!/^SWM-[A-Z]{3}-\d{2}$/.test(id)) {
      errors.push(`Invalid SWM id format: ${id}`);
    }
  }
  return { errors };
}

export async function validateFourteenSwarmRegistration() {
  const errors = [];
  const env = createTempEnv();
  try {
    const { coordinator } = createSwarmStack(env);
    const result = await coordinator.bootstrapSwarmCoordinator("cb12-register-test", {
      exerciseAllPatterns: true,
      injectStr6Fixtures: true,
    });

    if (result.catalog.registered !== OSC_SWM_COUNT) {
      errors.push(`Registry complete count ${result.catalog.registered} !== ${OSC_SWM_COUNT}`);
    }

    const record = coordinator.registry.getExpediente(result.factoryKey);
    const registryComplete = (record.elr.swarm_mission_refs ?? []).find(
      (r) => r.kind === "SWARM_COORDINATOR_REGISTRY_COMPLETE"
    );
    if (!registryComplete || registryComplete.swmCount !== OSC_SWM_COUNT) {
      errors.push("SWARM_COORDINATOR_REGISTRY_COMPLETE missing or incomplete");
    }

    if (result.summary.uniqueSwmExecuted < OSC_SWM_COUNT) {
      errors.push(
        `Only ${result.summary.uniqueSwmExecuted}/${OSC_SWM_COUNT} SWM patterns exercised`
      );
    }
  } catch (err) {
    errors.push(err.message);
  } finally {
    fs.rmSync(env.base, { recursive: true, force: true });
  }
  return { errors };
}

export async function validateSwarmLifecycleCycle() {
  const errors = [];
  const env = createTempEnv();
  try {
    const { coordinator } = createSwarmStack(env);
    const result = await coordinator.bootstrapSwarmCoordinator("cb12-lifecycle-test", {
      exerciseAllPatterns: false,
      injectStr6Fixtures: true,
    });

    const accepted = result.missionResults.filter((m) => m.accepted);
    if (!accepted.length) {
      errors.push("No swarm missions accepted");
    }

    for (const mission of accepted) {
      if (!mission.phases?.includes("SWA-IN") || !mission.phases?.includes("RETURN_LOOP")) {
        errors.push(`Mission ${mission.swarmId} missing lifecycle phases`);
      }
      if (!mission.dissolved) {
        errors.push(`Mission ${mission.swarmId} not dissolved`);
      }
      if (mission.die?.outcomeCode == null) {
        errors.push(`Mission ${mission.swarmId} missing DIE outcome`);
      }
    }

    if (coordinator.activeMissions.size !== 0) {
      errors.push("Active missions remain after close — swarm persisted as actor");
    }
  } catch (err) {
    errors.push(err.message);
  } finally {
    fs.rmSync(env.base, { recursive: true, force: true });
  }
  return { errors };
}

export async function validateStr6Ingress() {
  const errors = [];
  const env = createTempEnv();
  try {
    const { coordinator } = createSwarmStack(env);
    const result = await coordinator.bootstrapSwarmCoordinator("cb12-str6-test", {
      exerciseAllPatterns: false,
      injectStr6Fixtures: true,
    });

    if (result.ingress.derivationCount < 1) {
      errors.push("STR-6 derivations not collected from ELR");
    }

    const record = coordinator.registry.getExpediente(result.factoryKey);
    const mandates = resolveStr6Mandates(record.elr, result.factoryKey);
    if (!mandates.mandates.length) {
      errors.push("resolveStr6Mandates produced no mandates");
    }

    const cvgAlias = normalizeSwarmTarget("CB-12:SWM-MOT-01", {
      loopParent: "LOOP-DST-CVG-01",
    });
    if (cvgAlias !== "SWM-CVG-01") {
      errors.push("CB-08 SWM-MOT-01 alias should normalize to SWM-CVG-01");
    }

    const str6Accepted = result.missionResults.filter(
      (m) => m.accepted && m.swaIn?.derivationRef
    );
    if (!str6Accepted.length) {
      errors.push("No STR-6 derived missions executed");
    }
  } catch (err) {
    errors.push(err.message);
  } finally {
    fs.rmSync(env.base, { recursive: true, force: true });
  }
  return { errors };
}

export async function validateMissionLedgerEvf04() {
  const errors = [];
  const env = createTempEnv();
  try {
    const { coordinator } = createSwarmStack(env);
    const result = await coordinator.bootstrapSwarmCoordinator("cb12-evf04-test", {
      exerciseAllPatterns: true,
      injectStr6Fixtures: true,
    });

    const record = coordinator.registry.getExpediente(result.factoryKey);
    const opens = (record.elr.swarm_mission_refs ?? []).filter(
      (r) => r.kind === "EVF-04_SWARM_MISSION_OPEN"
    );
    const closes = (record.elr.swarm_mission_refs ?? []).filter(
      (r) => r.kind === "EVF-04_SWARM_MISSION_CLOSE"
    );
    const returns = (record.elr.loop_ledger_refs ?? []).filter(
      (r) => r.kind === "SWARM_LOOP_RETURN"
    );

    if (opens.length < OSC_SWM_COUNT) {
      errors.push(`EVF-04 opens ${opens.length} < ${OSC_SWM_COUNT}`);
    }
    if (closes.length < OSC_SWM_COUNT) {
      errors.push(`EVF-04 closes ${closes.length} < ${OSC_SWM_COUNT}`);
    }
    if (returns.length < OSC_SWM_COUNT) {
      errors.push(`Loop returns ${returns.length} < ${OSC_SWM_COUNT}`);
    }

    for (const entry of opens) {
      if (!entry.swarmId || entry.evf !== "EVF-04") {
        errors.push("EVF-04 open entry missing swarmId or evf tag");
        break;
      }
    }
    for (const entry of closes) {
      if (entry.swarmDissolved !== true) {
        errors.push("EVF-04 close entry must mark swarmDissolved");
        break;
      }
    }
  } catch (err) {
    errors.push(err.message);
  } finally {
    fs.rmSync(env.base, { recursive: true, force: true });
  }
  return { errors };
}

export function validateNoUsurpationGuard() {
  const errors = [];
  const good = assertNoUsurpation({
    motorDeltas: [{ motorId: "MOT-IDN-01", reExecuted: false }],
    orchestrationOnly: true,
  });
  if (!good.valid) errors.push("Valid coordination flagged as usurpation");

  const bad = assertNoUsurpation({
    motorDeltas: [{ motorId: "MOT-IDN-01", reExecuted: true }],
    emitsDecision: true,
    persistsAsActor: true,
  });
  if (bad.valid) errors.push("Usurpation guard should reject motor re-execution");
  return { errors };
}

export async function validateComplianceBlocksSwarmBirth() {
  const errors = [];
  const env = createTempEnv();
  try {
    const { registry, compliance, coordinator } = createSwarmStack(env);
    const created = registry.createExpediente({ candidateRef: "cb12-block-test" });
    const key = created.factory_key;

    compliance.evaluateAndRecordClearance(key, {
      prohibitedFlags: ["FP-08"],
      repeatViolation: true,
      authorizationRevoked: true,
    });

    const blocked = coordinator.executeSwarmMission(key, "SWM-IDN-01", {
      loopParent: "LOOP-FND-SUP-01",
    });
    if (blocked.accepted !== false) {
      errors.push("Swarm birth should be rejected under compliance BLOCK");
    }
    if (!blocked.reason?.includes("SWA-IN")) {
      errors.push("Blocked swarm should cite SWA-IN rejection");
    }
  } catch (err) {
    errors.push(err.message);
  } finally {
    fs.rmSync(env.base, { recursive: true, force: true });
  }
  return { errors };
}

export async function validateEvidenceLinkage() {
  const errors = [];
  const env = createTempEnv();
  try {
    const { coordinator } = createSwarmStack(env);
    const loop = await coordinator.loopEngine.bootstrapLoopEngine("cb12-evd-test", {
      parcelId: "swarm-evd-001",
    });
    const key = loop.factoryKey;

    const mission = coordinator.executeSwarmMission(key, "SWM-EVD-01", {
      loopParent: "LOOP-XVR-EVD-01",
    });
    if (!mission.accepted) {
      errors.push(`SWM-EVD-01 mission rejected: ${mission.reason}`);
    }
    if (!mission.coordination?.evidenceUpdates?.length) {
      errors.push("SWM-EVD-01 should link evidence updates (CB-06)");
    }
  } catch (err) {
    errors.push(err.message);
  } finally {
    fs.rmSync(env.base, { recursive: true, force: true });
  }
  return { errors };
}

export function validateOmcRisksDocumented() {
  const errors = [];
  if (OMC_MOTOR_COUNT_CONSTITUTIONAL !== 52) {
    errors.push("Constitutional OMC count should remain 52");
  }
  return { errors, reconciliationDeferred: false };
}

/**
 * SP04 CEP-03 G1 — supervised NON-LIVE / NON-LLM swarm coordination honesty
 * (DAG-SP04-CEP03-P3-G1).
 */
export async function validateSp04Cep03G1SupervisedCoordination() {
  const errors = [];

  const stubSwaIn = buildSwaIn("cep03-stub-honesty", "SWM-IDN-01", {
    loopParent: "LOOP-FND-SUP-01",
  });
  const stub = coordinateSwarmMotors("SWM-IDN-01", stubSwaIn, {});
  if (!String(stub.convergenceReport?.summary ?? "").startsWith("Stub coordination for")) {
    errors.push("Historical stub summary must remain stub-only");
  }
  if (stub.convergenceReport?.aiExecution !== false) {
    errors.push("Historical stub must keep aiExecution false");
  }
  if (stub.coordinationPath === SUPERVISED_COORDINATION_PATH) {
    errors.push("Historical stub must not claim SUPERVISED coordinationPath");
  }

  const supervisedSwaIn = buildSwaIn("cep03-supervised", "SWM-IDN-01", {
    loopParent: "LOOP-FND-SUP-01",
    evidenceState: { registryId: "EVREG-cep03-supervised" },
  });
  const supervised = executeSupervisedSwarmCoordination("SWM-IDN-01", supervisedSwaIn, {
    evidenceRegistryRef: "EVREG-cep03-supervised",
  });
  if (!supervised.ok) {
    errors.push(`Supervised adapter should succeed with local SWA-IN: ${supervised.reason}`);
  } else {
    const out = supervised.coordination;
    if (out.coordinationPath !== SUPERVISED_COORDINATION_PATH) {
      errors.push("Supervised coordinationPath must be SUPERVISED");
    }
    if (out.sourceMode !== SUPERVISED_COORDINATION_SOURCE_MODE) {
      errors.push("Supervised sourceMode must be RECORDED");
    }
    if (out.recordedOnly !== true || out.liveFetch !== false) {
      errors.push("Supervised path must be recordedOnly with liveFetch false");
    }
    if (out.llmUsed !== false || out.vendorInference !== false || out.networkUsed !== false) {
      errors.push("Supervised path must not use LLM / vendor / network");
    }
    if (out.aiExecution !== false || out.orchestrationOnly !== true) {
      errors.push("Supervised path must remain orchestrationOnly with aiExecution false");
    }
    if (out.grantId !== CEP03_G1_GRANT_ID) {
      errors.push("Supervised path must cite DAG-SP04-CEP03-P3-G1");
    }
    if (
      out.livingIntelligenceProved === true ||
      out.defSp0404Closed === true ||
      out.defSp0404Satisfied === true ||
      out.cep03Complete === true
    ) {
      errors.push("Supervised path must not claim PROVED / DEF-04 CLOSED / CEP-03 COMPLETE");
    }
    if (String(out.convergenceReport?.summary ?? "").startsWith("Stub coordination for")) {
      errors.push("Supervised summary must be distinct from historical stub-only");
    }
    const usurpation = assertNoUsurpation(out);
    if (!usurpation.valid) {
      errors.push(`Supervised coordination failed usurpation guard: ${usurpation.violations.join("; ")}`);
    }
    if (out.motorDeltas?.some((d) => d.reExecuted === true)) {
      errors.push("Supervised path must not re-execute motors");
    }
  }

  const liveRefuse = executeSupervisedSwarmCoordination("SWM-IDN-01", supervisedSwaIn, {
    attemptLiveFetch: true,
  });
  if (liveRefuse.ok || liveRefuse.code !== "LIVE_NOT_AUTHORIZED") {
    errors.push("Supervised adapter must fail-closed on Live");
  }
  const llmRefuse = executeSupervisedSwarmCoordination("SWM-IDN-01", supervisedSwaIn, {
    useLlm: true,
  });
  if (llmRefuse.ok || llmRefuse.code !== "LLM_NOT_AUTHORIZED") {
    errors.push("Supervised adapter must fail-closed on LLM");
  }
  const netRefuse = executeSupervisedSwarmCoordination("SWM-IDN-01", supervisedSwaIn, {
    network: true,
  });
  if (netRefuse.ok || netRefuse.code !== "NETWORK_NOT_AUTHORIZED") {
    errors.push("Supervised adapter must fail-closed on network");
  }

  const fallback = resolveSupervisedCoordinationOrStub(
    "SWM-IDN-01",
    supervisedSwaIn,
    { attemptLiveFetch: true },
    coordinateSwarmMotors
  );
  if (fallback.usedStubFallback !== true || fallback.coordinationPath !== STUB_FALLBACK_COORDINATION_PATH) {
    errors.push("Resolver must fail-closed to stub fallback when Live is requested");
  }
  if (!String(fallback.coordination?.convergenceReport?.summary ?? "").startsWith("Stub coordination for")) {
    errors.push("Stub fallback must preserve historical stub summary");
  }

  const env = createTempEnv();
  try {
    const { coordinator } = createSwarmStack(env);
    const loop = await coordinator.loopEngine.bootstrapLoopEngine("cep03-g1-mission", {
      parcelId: "cep03-g1-001",
      candidateRef: "cep03-g1",
    });
    const key = loop.factoryKey;

    const mission = coordinator.executeSwarmMission(key, "SWM-IDN-01", {
      loopParent: "LOOP-FND-SUP-01",
    });
    if (!mission.accepted) {
      errors.push(`Real-path supervised mission rejected: ${mission.reason}`);
    } else {
      if (mission.coordinationPath !== SUPERVISED_COORDINATION_PATH) {
        errors.push("Real mission path must select SUPERVISED coordination under G1");
      }
      if (mission.usedStubFallback === true) {
        errors.push("Real mission must not use stub fallback for legitimate supervised inputs");
      }
      if (mission.coordination?.coordinationPath !== SUPERVISED_COORDINATION_PATH) {
        errors.push("Mission coordination object must carry SUPERVISED coordinationPath");
      }
      if (String(mission.coordination?.convergenceReport?.summary ?? "").startsWith("Stub coordination for")) {
        errors.push("Real mission must not emit stub-only COORDINATE summary under G1");
      }
      if (!mission.phases?.includes("COORDINATE") || !mission.dissolved) {
        errors.push("Supervised mission must preserve lifecycle phases and dissolve");
      }
    }

    const liveMission = coordinator.executeSwarmMission(key, "SWM-IDN-01", {
      loopParent: "LOOP-FND-SUP-01",
      attemptLiveFetch: true,
    });
    if (!liveMission.accepted) {
      errors.push(`Live-request mission should still complete via stub fallback: ${liveMission.reason}`);
    } else if (
      liveMission.usedStubFallback !== true ||
      liveMission.coordinationPath !== STUB_FALLBACK_COORDINATION_PATH
    ) {
      errors.push("Live-request mission must fail-closed to stub fallback");
    } else if (
      !String(liveMission.coordination?.convergenceReport?.summary ?? "").startsWith(
        "Stub coordination for"
      )
    ) {
      errors.push("Live-request stub fallback must preserve stub-only summary");
    }
  } catch (err) {
    errors.push(err.message);
  } finally {
    fs.rmSync(env.base, { recursive: true, force: true });
  }

  return { errors };
}

/**
 * @param {{ markComplete?: boolean, approvedBy?: string }} [options]
 */
export async function runCb12Validation(options = {}) {
  const gov = validateCb12Governance();
  const catalog = validateSwarmCatalog();
  const registration = await validateFourteenSwarmRegistration();
  const lifecycle = await validateSwarmLifecycleCycle();
  const str6 = await validateStr6Ingress();
  const evf04 = await validateMissionLedgerEvf04();
  const usurpation = validateNoUsurpationGuard();
  const compliance = await validateComplianceBlocksSwarmBirth();
  const evidence = await validateEvidenceLinkage();
  const risks = validateOmcRisksDocumented();
  const cep03g1 = await validateSp04Cep03G1SupervisedCoordination();

  const allErrors = [
    ...gov.errors,
    ...catalog.errors,
    ...registration.errors,
    ...lifecycle.errors,
    ...str6.errors,
    ...evf04.errors,
    ...usurpation.errors,
    ...compliance.errors,
    ...evidence.errors,
    ...risks.errors,
    ...cep03g1.errors,
  ];

  const checklist = [
    {
      id: "CB12-01",
      criterion: "14/14 SWM registrados (OSC)",
      status: registration.errors.length === 0 ? CHECKLIST_STATUS.PASS : CHECKLIST_STATUS.PENDING,
    },
    {
      id: "CB12-02",
      criterion: "Ciclo SWA-IN → coordinación → SWA-OUT → DIE → retorno Loop",
      status: lifecycle.errors.length === 0 ? CHECKLIST_STATUS.PASS : CHECKLIST_STATUS.PENDING,
    },
    {
      id: "CB12-03",
      criterion: "STR-6 ingress desde loops/motores vía ELR",
      status: str6.errors.length === 0 ? CHECKLIST_STATUS.PASS : CHECKLIST_STATUS.PENDING,
    },
    {
      id: "CB12-04",
      criterion: "Mission Ledger EVF-04 vinculado a ELR",
      status: evf04.errors.length === 0 ? CHECKLIST_STATUS.PASS : CHECKLIST_STATUS.PENDING,
    },
    {
      id: "CB12-05",
      criterion: "Enjambre disuelto al cerrar — sin usurpación MOT/LOOP/Decision",
      status:
        usurpation.errors.length === 0 && lifecycle.errors.length === 0
          ? CHECKLIST_STATUS.PASS
          : CHECKLIST_STATUS.PENDING,
    },
    {
      id: "CB12-06",
      criterion: "Compliance P0 bloquea SWA-IN",
      status: compliance.errors.length === 0 ? CHECKLIST_STATUS.PASS : CHECKLIST_STATUS.PENDING,
    },
    {
      id: "CB12-07",
      criterion: "SP04 CEP-03 G1 supervised recorded coordination honesty",
      status: cep03g1.errors.length === 0 ? CHECKLIST_STATUS.PASS : CHECKLIST_STATUS.PENDING,
    },
  ];

  const passed = allErrors.length === 0 && checklist.every((i) => i.status === CHECKLIST_STATUS.PASS);

  let phaseRecord = null;
  if (passed && options.markComplete) {
    phaseRecord = markPhaseComplete("CB-12", {
      validationReport: "runCb12SwarmValidation",
      approvedBy: options.approvedBy ?? null,
      pendingDirectorApproval: !options.approvedBy,
    });
  }

  return {
    phase: "CB-12",
    passed,
    errors: allErrors,
    checklist,
    omcMotorCountRisk: {
      constitutional: OMC_MOTOR_COUNT_CONSTITUTIONAL,
      reconciliationDeferred: risks.reconciliationDeferred,
    },
    phaseRecord,
    cb13Unlocked: passed ? isPhaseApproved("CB-12") : false,
  };
}

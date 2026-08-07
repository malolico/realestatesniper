/**
 * CB-14 validation — AI Assist Layer acceptance tests.
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
import { MotorExecutionLock } from "../cb04/motorExecutionLock.js";
import { MotorRuntime } from "../cb04/motorRuntime.js";
import { FoundationKnowledgeStore } from "../cb05/foundationKnowledgeStore.js";
import { FoundationLayerService } from "../cb05/foundationLayerService.js";
import { EvidenceService } from "../cb06/evidenceService.js";
import { EvidenceRegistryStore } from "../cb06/evidenceRegistryStore.js";
import { AI_ASSIST_MAX_E_LEVEL } from "../cb06/evidenceVocabulary.js";
import { LegitimacyKnowledgeStore } from "../cb07/legitimacyKnowledgeStore.js";
import { LegitimacyLayerService } from "../cb07/legitimacyLayerService.js";
import { DistressKnowledgeStore } from "../cb08/distressKnowledgeStore.js";
import { DistressLayerService } from "../cb08/distressLayerService.js";
import { EconomyKnowledgeStore } from "../cb09/economyKnowledgeStore.js";
import { EconomyLayerService } from "../cb09/economyLayerService.js";
import { EnvironmentKnowledgeStore } from "../cb10/environmentKnowledgeStore.js";
import { EnvironmentLayerService } from "../cb10/environmentLayerService.js";
import { IntelligenceKnowledgeStore } from "../cb13/intelligenceKnowledgeStore.js";
import { IntelligenceLayerService } from "../cb13/intelligenceLayerService.js";
import { LoopEngineService } from "../cb11/loopEngineService.js";
import { SwarmCoordinatorService } from "../cb12/swarmCoordinatorService.js";
import { OMC_MOTOR_COUNT_CONSTITUTIONAL } from "../cb13/intelligenceCatalog.js";
import {
  AIA_CATALOG,
  AIA_IDS,
  OAC_AIA_COUNT,
  CLASS_X_AIA_BLOCKLIST,
} from "./aiaCatalog.js";
import { validatePrhCompliance } from "./prhProhibitions.js";
import { applyAiAssistOutputLimits } from "./constitutionalLimits.js";
import { AiaInvocationGateway } from "./aiaInvocationGateway.js";
import { AiAssistLayerService } from "./aiAssistLayerService.js";
import { SLOT_COUNT } from "./slotRegistry.js";
import { executeAiaAssistStub } from "./aiaAssistStub.js";
import {
  CEP02_G1_GRANT_ID,
  SUPERVISED_ASSIST_PATH,
  SUPERVISED_SOURCE_MODE,
  executeSupervisedAiAssist,
} from "./supervisedAiAssistAdapter.js";

function createTempEnv() {
  const base = fs.mkdtempSync(path.join(os.tmpdir(), "cb14-validation-"));
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
    intelligenceDir: path.join(base, "intelligence"),
  };
}

function createAiAssistStack(env) {
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
  const foundation = new FoundationLayerService({
    registry,
    compliance,
    knowledgeStore: foundationKnowledgeStore,
    runtime,
  });
  const legitimacy = new LegitimacyLayerService({
    registry,
    compliance,
    knowledgeStore: new LegitimacyKnowledgeStore(env.legitimacyDir),
    evidenceService: evidence,
    runtime,
  });
  const distress = new DistressLayerService({
    registry,
    compliance,
    knowledgeStore: new DistressKnowledgeStore(env.distressDir),
    evidenceService: evidence,
    runtime,
  });
  const economy = new EconomyLayerService({
    registry,
    compliance,
    knowledgeStore: new EconomyKnowledgeStore(env.economyDir),
    evidenceService: evidence,
    runtime,
  });
  const environment = new EnvironmentLayerService({
    registry,
    compliance,
    knowledgeStore: new EnvironmentKnowledgeStore(env.environmentDir),
    evidenceService: evidence,
    runtime,
  });
  const loopEngine = new LoopEngineService({
    registry,
    compliance,
    evidenceService: evidence,
    runtime,
    foundation,
    legitimacy,
    distress,
    economy,
    environment,
  });
  const swarmCoordinator = new SwarmCoordinatorService({
    registry,
    compliance,
    evidenceService: evidence,
    loopEngine,
  });
  const intelligence = new IntelligenceLayerService({
    registry,
    compliance,
    knowledgeStore: new IntelligenceKnowledgeStore(env.intelligenceDir),
    evidenceService: evidence,
    runtime,
    foundation,
    legitimacy,
    distress,
    economy,
    environment,
    loopEngine,
    swarmCoordinator,
  });
  const gateway = new AiaInvocationGateway({ registry, compliance });
  const aiAssist = new AiAssistLayerService({
    registry,
    compliance,
    evidenceService: evidence,
    runtime,
    intelligence,
    gateway,
  });
  return { registry, compliance, evidence, intelligence, gateway, aiAssist };
}

export function validateCb14Governance() {
  const errors = [];
  try {
    assertPhaseUnlocked("CB-14");
  } catch (err) {
    errors.push(err.message);
  }
  if (!isPhaseApproved("CB-13")) {
    errors.push("CB-13 is not APPROVED");
  }
  return { errors };
}

export function validateAiaCatalog() {
  const errors = [];
  if (AIA_CATALOG.length !== OAC_AIA_COUNT) {
    errors.push(`Expected ${OAC_AIA_COUNT} AIA, got ${AIA_CATALOG.length}`);
  }
  if (SLOT_COUNT !== 10) {
    errors.push(`Expected 10 SLOT, got ${SLOT_COUNT}`);
  }
  for (const id of AIA_IDS) {
    if (!/^AIA-[A-Z]{3}-\d{2}$/.test(id)) {
      errors.push(`Invalid AIA id: ${id}`);
    }
  }
  return { errors };
}

export async function validateTwentySixAiaInvocable() {
  const errors = [];
  const env = createTempEnv();
  try {
    const { aiAssist } = createAiAssistStack(env);
    const result = await aiAssist.bootstrapAiAssistLayer("cb14-invoke-test", {
      candidateRef: "cb14-invoke-test",
      parcelId: "ai-invoke-001",
    });

    if (result.summary.accepted !== OAC_AIA_COUNT) {
      errors.push(`Only ${result.summary.accepted}/${OAC_AIA_COUNT} AIA accepted`);
    }

    const registryComplete = aiAssist.registry
      .getExpediente(result.factoryKey)
      .elr.aia_rlg_refs.find((r) => r.kind === "AI_ASSIST_REGISTRY_COMPLETE");
    if (!registryComplete || registryComplete.aiaCount !== OAC_AIA_COUNT) {
      errors.push("AI_ASSIST_REGISTRY_COMPLETE missing or incomplete");
    }
  } catch (err) {
    errors.push(err.message);
  } finally {
    fs.rmSync(env.base, { recursive: true, force: true });
  }
  return { errors };
}

export async function validateRlg100Percent() {
  const errors = [];
  const env = createTempEnv();
  try {
    const { aiAssist } = createAiAssistStack(env);
    const result = await aiAssist.bootstrapAiAssistLayer("cb14-rlg-test", {
      parcelId: "ai-rlg-001",
    });

    if (result.summary.rlgCoverage < 1) {
      errors.push(`RLG coverage ${result.summary.rlgRecorded}/${OAC_AIA_COUNT} < 100%`);
    }
  } catch (err) {
    errors.push(err.message);
  } finally {
    fs.rmSync(env.base, { recursive: true, force: true });
  }
  return { errors };
}

export function validatePrhZeroViolations() {
  const errors = [];
  const good = validatePrhCompliance({ invoker: "MOT-IDN-01", proposedELevel: "E1" });
  if (!good.pass) errors.push("Valid request flagged as PRH violation");

  const bad = validatePrhCompliance({
    invoker: "MOT-IDN-01",
    emitDecision: true,
    assignAccessTier: true,
    proposedELevel: "E4",
    autonomous: true,
  });
  if (bad.pass) errors.push("PRH violations should be detected");
  if (bad.violations.length < 4) errors.push("Expected multiple PRH violations");
  return { errors };
}

export async function validateClassXAbsent() {
  const errors = [];
  const env = createTempEnv();
  try {
    const { aiAssist } = createAiAssistStack(env);
    const result = await aiAssist.bootstrapAiAssistLayer("cb14-classx-test", {
      parcelId: "ai-classx-001",
    });
    if (!result.summary.classXBlocked) {
      errors.push("Class X AIA should be blocked from production (OAC-04)");
    }
    for (const id of CLASS_X_AIA_BLOCKLIST) {
      const blocked = result.classXBlocked.find((r) => r.aiaId === id || r.reason?.includes("OAC-04"));
      if (!blocked) errors.push(`Class X ${id} not tested`);
    }
  } catch (err) {
    errors.push(err.message);
  } finally {
    fs.rmSync(env.base, { recursive: true, force: true });
  }
  return { errors };
}

export async function validateDualRunC() {
  const errors = [];
  const env = createTempEnv();
  try {
    const { aiAssist } = createAiAssistStack(env);
    const result = await aiAssist.bootstrapAiAssistLayer("cb14-dualrun-test", {
      parcelId: "ai-dualrun-001",
    });
    if (!result.dualRun.pass) {
      errors.push("Dual-run clase C should pass for SLOT substitution");
    }
    const record = aiAssist.registry.getExpediente(result.factoryKey);
    const dualEntry = (record.elr.aia_rlg_refs ?? []).find(
      (r) => r.kind === "SLOT_DUAL_RUN_CLASS_C"
    );
    if (!dualEntry || dualEntry.pass !== true) {
      errors.push("SLOT_DUAL_RUN_CLASS_C not recorded in RLG");
    }
  } catch (err) {
    errors.push(err.message);
  } finally {
    fs.rmSync(env.base, { recursive: true, force: true });
  }
  return { errors };
}

export function validateEvf02Ceiling() {
  const errors = [];
  try {
    const output = applyAiAssistOutputLimits({ proposedELevel: "E4", approveDiamond: false });
    errors.push("EVF-02 should block E4 elevation by AI assist");
  } catch {
    // expected
  }
  const ok = applyAiAssistOutputLimits({ proposedELevel: "E2" });
  if (ok.proposedELevel !== AI_ASSIST_MAX_E_LEVEL) {
    errors.push(`AI assist max E-level should be ${AI_ASSIST_MAX_E_LEVEL}`);
  }
  return { errors };
}

export function validateConstitutionalLimits() {
  const errors = [];
  try {
    applyAiAssistOutputLimits({ approveDiamond: true });
    errors.push("AI should not approve Diamond");
  } catch {
    // expected
  }
  try {
    applyAiAssistOutputLimits({ accessTier: "premium" });
    errors.push("AI should not assign access_tier");
  } catch {
    // expected
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
 * SP04 CEP-02 G1 — supervised NON-LIVE / NON-LLM assist honesty (DAG-SP04-CEP02-P2-G1).
 */
export async function validateSp04Cep02G1SupervisedAssist() {
  const errors = [];

  const stub = executeAiaAssistStub("AIA-NRM-01", { factoryKey: "cep02-stub-honesty" });
  if (!String(stub.suggestion?.summary ?? "").startsWith("Stub assist for")) {
    errors.push("Historical stub summary must remain stub-only");
  }
  if (stub.suggestion?.aiExecution !== false || stub.aiExecution === true) {
    errors.push("Historical stub must keep aiExecution false");
  }
  if (stub.assistPath === SUPERVISED_ASSIST_PATH) {
    errors.push("Historical stub must not claim SUPERVISED assistPath");
  }

  const supervised = executeSupervisedAiAssist("AIA-NRM-01", {
    factoryKey: "cep02-supervised",
    inputs: { parcelId: "ai-assist-001", candidateRef: "cep02-g1" },
  });
  if (!supervised.ok) {
    errors.push(`Supervised adapter should succeed with local context: ${supervised.reason}`);
  } else {
    const out = supervised.output;
    if (out.assistPath !== SUPERVISED_ASSIST_PATH) {
      errors.push("Supervised output assistPath must be SUPERVISED");
    }
    if (out.sourceMode !== SUPERVISED_SOURCE_MODE) {
      errors.push("Supervised sourceMode must be RECORDED_ENRICHMENT");
    }
    if (out.recordedOnly !== true || out.liveFetch !== false) {
      errors.push("Supervised path must be recordedOnly with liveFetch false");
    }
    if (out.llmUsed !== false || out.vendorInference !== false || out.networkUsed !== false) {
      errors.push("Supervised path must not use LLM / vendor / network");
    }
    if (out.aiExecution !== false || out.assistiveOnly !== true) {
      errors.push("Supervised path must remain assistive with aiExecution false");
    }
    if (out.grantId !== CEP02_G1_GRANT_ID) {
      errors.push("Supervised path must cite DAG-SP04-CEP02-P2-G1");
    }
    if (out.livingIntelligenceProved === true || out.defSp0403Closed === true || out.cep02Complete === true) {
      errors.push("Supervised path must not claim PROVED / DEF-03 CLOSED / CEP-02 COMPLETE");
    }
    if (String(out.suggestion?.summary ?? "").startsWith("Stub assist for")) {
      errors.push("Supervised summary must be distinct from historical stub-only");
    }
  }

  const liveRefuse = executeSupervisedAiAssist("AIA-NRM-01", { attemptLiveFetch: true });
  if (liveRefuse.ok || liveRefuse.code !== "LIVE_NOT_AUTHORIZED") {
    errors.push("Supervised adapter must fail-closed on Live");
  }
  const llmRefuse = executeSupervisedAiAssist("AIA-NRM-01", { useLlm: true });
  if (llmRefuse.ok || llmRefuse.code !== "LLM_NOT_AUTHORIZED") {
    errors.push("Supervised adapter must fail-closed on LLM");
  }
  const netRefuse = executeSupervisedAiAssist("AIA-NRM-01", { network: true });
  if (netRefuse.ok || netRefuse.code !== "NETWORK_NOT_AUTHORIZED") {
    errors.push("Supervised adapter must fail-closed on network");
  }

  const env = createTempEnv();
  try {
    const { gateway, aiAssist } = createAiAssistStack(env);

    const boot = await aiAssist.bootstrapAiAssistLayer("cep02-g1-boot", {
      candidateRef: "cep02-g1-boot",
      parcelId: "cep02-g1-001",
    });
    if (boot.summary.dualRunAssistPathA !== SUPERVISED_ASSIST_PATH) {
      errors.push("Dual-run must exercise SUPERVISED path under G1");
    }
    if (boot.summary.dualRunUsedStubFallback === true) {
      errors.push("Dual-run must not use stub fallback for legitimate supervised inputs");
    }
    if (!boot.summary.dualRunPass) {
      errors.push("Dual-run must still pass under supervised G1 path");
    }

    const supervisedAccepted = (boot.invocationResults ?? []).filter(
      (r) => r.accepted && r.assistPath === SUPERVISED_ASSIST_PATH
    );
    if (supervisedAccepted.length < 1) {
      errors.push("Bootstrap must record at least one SUPERVISED accepted invocation");
    }

    const key = boot.factoryKey;
    const invoked = gateway.invoke(key, "AIA-NRM-01", {
      invoker: "MOT-IDN-01",
      invokerAccepted: true,
      inputs: { parcelId: "g1-parcel" },
    });
    if (!invoked.accepted) {
      errors.push(`Gateway supervised invoke failed: ${invoked.reason}`);
    } else {
      if (invoked.assistPath !== SUPERVISED_ASSIST_PATH) {
        errors.push("Gateway must select SUPERVISED path under G1");
      }
      if (invoked.usedStubFallback === true) {
        errors.push("Gateway must not fall back to stub for legitimate supervised inputs");
      }
      if (invoked.output?.assistPath !== SUPERVISED_ASSIST_PATH) {
        errors.push("Gateway output must carry SUPERVISED assistPath");
      }
    }

    const liveFallback = gateway.invoke(key, "AIA-NRM-01", {
      invoker: "MOT-IDN-01",
      invokerAccepted: true,
      attemptLiveFetch: true,
    });
    if (!liveFallback.accepted || liveFallback.assistPath !== "STUB_FALLBACK") {
      errors.push("Gateway must fail-closed to stub fallback when Live is requested");
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
export async function runCb14Validation(options = {}) {
  const gov = validateCb14Governance();
  const catalog = validateAiaCatalog();
  const invocable = await validateTwentySixAiaInvocable();
  const rlg = await validateRlg100Percent();
  const prh = validatePrhZeroViolations();
  const classX = await validateClassXAbsent();
  const dualRun = await validateDualRunC();
  const evf02 = validateEvf02Ceiling();
  const limits = validateConstitutionalLimits();
  const risks = validateOmcRisksDocumented();
  const cep02g1 = await validateSp04Cep02G1SupervisedAssist();

  const allErrors = [
    ...gov.errors,
    ...catalog.errors,
    ...invocable.errors,
    ...rlg.errors,
    ...prh.errors,
    ...classX.errors,
    ...dualRun.errors,
    ...evf02.errors,
    ...limits.errors,
    ...risks.errors,
    ...cep02g1.errors,
  ];

  const checklist = [
    {
      id: "CB14-01",
      criterion: "26/26 AIA invocables por actor autorizado",
      status: invocable.errors.length === 0 ? CHECKLIST_STATUS.PASS : CHECKLIST_STATUS.PENDING,
    },
    {
      id: "CB14-02",
      criterion: "PRH zero — ninguna violación en auditoría piloto",
      status: prh.errors.length === 0 ? CHECKLIST_STATUS.PASS : CHECKLIST_STATUS.PENDING,
    },
    {
      id: "CB14-03",
      criterion: "RLG 100% invocaciones registradas",
      status: rlg.errors.length === 0 ? CHECKLIST_STATUS.PASS : CHECKLIST_STATUS.PENDING,
    },
    {
      id: "CB14-04",
      criterion: "AIA clase X ausente de producción (OAC-04)",
      status: classX.errors.length === 0 ? CHECKLIST_STATUS.PASS : CHECKLIST_STATUS.PENDING,
    },
    {
      id: "CB14-05",
      criterion: "Dual-run C validado para ≥1 SLOT sustitución",
      status: dualRun.errors.length === 0 ? CHECKLIST_STATUS.PASS : CHECKLIST_STATUS.PENDING,
    },
    {
      id: "CB14-06",
      criterion: "Límites constitucionales EVF-02 / no Diamond / no access_tier",
      status:
        evf02.errors.length === 0 && limits.errors.length === 0
          ? CHECKLIST_STATUS.PASS
          : CHECKLIST_STATUS.PENDING,
    },
    {
      id: "CB14-07",
      criterion: "SP04 CEP-02 G1 supervised NON-LIVE / NON-LLM assist honesty",
      status: cep02g1.errors.length === 0 ? CHECKLIST_STATUS.PASS : CHECKLIST_STATUS.PENDING,
    },
  ];

  const passed = allErrors.length === 0 && checklist.every((i) => i.status === CHECKLIST_STATUS.PASS);

  let phaseRecord = null;
  if (passed && options.markComplete) {
    phaseRecord = markPhaseComplete("CB-14", {
      validationReport: "runCb14AiAssistValidation",
      approvedBy: options.approvedBy ?? null,
      pendingDirectorApproval: !options.approvedBy,
    });
  }

  return {
    phase: "CB-14",
    passed,
    errors: allErrors,
    checklist,
    omcMotorCountRisk: {
      constitutional: OMC_MOTOR_COUNT_CONSTITUTIONAL,
      reconciliationDeferred: risks.reconciliationDeferred,
    },
    phaseRecord,
    cb15Unlocked: passed ? isPhaseApproved("CB-14") : false,
  };
}

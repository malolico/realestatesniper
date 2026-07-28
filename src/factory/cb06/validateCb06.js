/**
 * CB-06 validation — Evidence Service acceptance tests.
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
import { assertNoAveraging } from "../cb02/conflictRules.js";
import { FileElrStore } from "../cb01/fileElrStore.js";
import { FactoryRegistry } from "../cb01/factoryRegistry.js";
import { ComplianceGateService } from "../cb03/complianceGateService.js";
import { ComplianceStateStore } from "../cb03/complianceStateStore.js";
import { MotorLockRegistry } from "../cb03/motorLockRegistry.js";
import { MotorExecutionLock } from "../cb04/motorExecutionLock.js";
import { MotorRuntime } from "../cb04/motorRuntime.js";
import { MOTOR_CATALOG_COUNT } from "../cb04/motorCatalogIndex.js";
import { FoundationKnowledgeStore } from "../cb05/foundationKnowledgeStore.js";
import { FoundationLayerService } from "../cb05/foundationLayerService.js";
import { EvidenceService } from "./evidenceService.js";
import { EvidenceRegistryStore } from "./evidenceRegistryStore.js";
import { MotEvd02 } from "./motEvd02.js";
import { assertEvf02AiAssistCeiling, OMC_MOTOR_COUNT_CONSTITUTIONAL } from "./evidenceVocabulary.js";
import { evaluateSufficiency, SUFFICIENCY_STATUS } from "./sufficiencyGate.js";
import { isMaterialMotorManifest } from "./evidenceIntercept.js";

function createTempEnv() {
  const base = fs.mkdtempSync(path.join(os.tmpdir(), "cb06-validation-"));
  return {
    base,
    registryDir: path.join(base, "registry"),
    complianceDir: path.join(base, "compliance"),
    foundationDir: path.join(base, "foundation"),
    evidenceDir: path.join(base, "evidence"),
  };
}

function createEvidenceStack(env) {
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
  const foundation = new FoundationLayerService({
    registry,
    compliance,
    knowledgeStore: foundationKnowledgeStore,
    runtime,
  });
  const evidence = new EvidenceService({
    registry,
    compliance,
    foundationKnowledgeStore,
    runtime,
    evidenceStore: new EvidenceRegistryStore(env.evidenceDir),
  });
  return { registry, foundation, evidence, runtime };
}

async function bootstrapFoundationAndEvidence(env) {
  const stack = createEvidenceStack(env);
  const foundationResult = await stack.foundation.bootstrapFoundation({
    candidateRef: "cb06-evidence-test",
    parcelId: "evd-001-002",
  });
  const evidenceResult = await stack.evidence.processFoundationEvidence(
    foundationResult.factoryKey
  );
  return { ...stack, foundationResult, evidenceResult };
}

export function validateCb06Governance() {
  const errors = [];
  try {
    assertPhaseUnlocked("CB-06");
  } catch (err) {
    errors.push(err.message);
  }
  if (!isPhaseApproved("CB-05")) {
    errors.push("CB-05 is not APPROVED");
  }
  return { errors };
}

export async function validateFoundationDeltaRegistration() {
  const errors = [];
  const env = createTempEnv();

  try {
    const { registry, foundationResult, evidenceResult } =
      await bootstrapFoundationAndEvidence(env);

    if (evidenceResult.registration.coverage < 1) {
      errors.push("CB-05 material deltas not 100% registered in MOT-EVD-01");
    }

    const record = registry.getExpediente(foundationResult.factoryKey);
    const materialManifests = (record.elr.motor_manifests ?? []).filter(isMaterialMotorManifest);
    if (materialManifests.length < 5) {
      errors.push("Expected foundation material manifests for evidence ingest");
    }

    if (!record.elr.evidence_registry_ref) {
      errors.push("evidence_registry_ref not set on ELR");
    }
  } catch (err) {
    errors.push(err.message);
  } finally {
    fs.rmSync(env.base, { recursive: true, force: true });
  }

  return { errors };
}

export async function validateConflictHierarchyNoAveraging() {
  const errors = [];
  const env = createTempEnv();

  try {
    const { evidence, foundationResult } = await bootstrapFoundationAndEvidence(env);
    const evd02 = new MotEvd02({ store: evidence.evidenceStore });

    try {
      assertNoAveraging("AVERAGE");
      errors.push("Averaging should be prohibited (LS-09)");
    } catch {
      // expected
    }

    const result = evd02.arbitrate({
      factoryKey: foundationResult.factoryKey,
      field: "parcelId",
      sources: [
        { sourceRefId: "SRC-A", value: "111", eLevel: "E2", organismId: "ORG-AGG" },
        { sourceRefId: "SRC-B", value: "222", eLevel: "E4", organismId: "ORG-RCR-MC" },
      ],
    });

    if (result.resolution.strategy !== "HIERARCHY") {
      errors.push("Conflict must resolve by hierarchy");
    }
    if (result.prevailingSourceRefId !== "SRC-B") {
      errors.push("E4 registral source should prevail (LS-09)");
    }
    if (result.resolution.averagingProhibited !== true) {
      errors.push("Resolution must flag averaging prohibited");
    }

    await evidence.resolveConflicts(foundationResult.factoryKey, [
      {
        field: "parcelId",
        sources: [
          { sourceRefId: "SRC-A", value: "111", eLevel: "E2" },
          { sourceRefId: "SRC-B", value: "222", eLevel: "E4" },
        ],
      },
    ]);

    const record = evidence.registry.getExpediente(foundationResult.factoryKey);
    const resolutions = record.elr.conflict_resolutions.filter(
      (r) => r.kind === "MOT_EVD_02_RESOLUTION"
    );
    if (resolutions.length < 1) {
      errors.push("MOT-EVD-02 resolution not recorded in ELR");
    }
  } catch (err) {
    errors.push(err.message);
  } finally {
    fs.rmSync(env.base, { recursive: true, force: true });
  }

  return { errors };
}

export async function validateSufficiencyReproducible() {
  const errors = [];
  const env = createTempEnv();

  try {
    const { evidence, foundationResult } = await bootstrapFoundationAndEvidence(env);
    const key = foundationResult.factoryKey;

    const first = evaluateSufficiency(evidence.evd01.getRegistrySnapshot(key));
    const second = evaluateSufficiency(evidence.evd01.getRegistrySnapshot(key));

    if (first.status !== second.status) {
      errors.push("Sufficiency verdict not reproducible");
    }
    if (first.status !== SUFFICIENCY_STATUS.PASS) {
      errors.push(`Expected sufficiency PASS after foundation ingest, got ${first.status}`);
    }

    try {
      evidence.assertTransitionAllowed(key, "ST-RDY");
    } catch {
      errors.push("EVF-05 should allow ST-RDY when sufficiency PASS");
    }

    evidence.evidenceStore.setSufficiency(key, { status: SUFFICIENCY_STATUS.FAIL, reasons: ["test"] });
    try {
      evidence.assertTransitionAllowed(key, "ST-RDY");
      errors.push("EVF-05 should block ST-RDY when sufficiency FAIL");
    } catch {
      // expected
    }
  } catch (err) {
    errors.push(err.message);
  } finally {
    fs.rmSync(env.base, { recursive: true, force: true });
  }

  return { errors };
}

export function validateEvf02AiAssistCeiling() {
  const errors = [];

  try {
    assertEvf02AiAssistCeiling("E2", { aiAssist: true });
    assertEvf02AiAssistCeiling("E4", { aiAssist: true, motorElevated: true });
    try {
      assertEvf02AiAssistCeiling("E4", { aiAssist: true, motorElevated: false });
      errors.push("EVF-02 should block AI assist elevation above E2");
    } catch {
      // expected
    }
  } catch (err) {
    errors.push(err.message);
  }

  return { errors };
}

export function validateOmcCountRiskDocumented() {
  const errors = [];
  if (OMC_MOTOR_COUNT_CONSTITUTIONAL !== 52) {
    errors.push("Constitutional OMC count should remain 52");
  }
  return { errors, reconciliationDeferred: false };
}

/**
 * @param {{ markComplete?: boolean, approvedBy?: string }} [options]
 */
export async function runCb06Validation(options = {}) {
  const gov = validateCb06Governance();
  const registration = await validateFoundationDeltaRegistration();
  const conflict = await validateConflictHierarchyNoAveraging();
  const sufficiency = await validateSufficiencyReproducible();
  const evf02 = validateEvf02AiAssistCeiling();
  const omcRisk = validateOmcCountRiskDocumented();

  const allErrors = [
    ...gov.errors,
    ...registration.errors,
    ...conflict.errors,
    ...sufficiency.errors,
    ...evf02.errors,
    ...omcRisk.errors,
  ];

  const checklist = [
    {
      id: "CB06-01",
      criterion: "100% deltas materiales CB-05 registrados en MOT-EVD-01",
      status: registration.errors.length === 0 ? CHECKLIST_STATUS.PASS : CHECKLIST_STATUS.PENDING,
    },
    {
      id: "CB06-02",
      criterion: "Conflicto multi-fuente por jerarquía — sin promedio (LS-09)",
      status: conflict.errors.length === 0 ? CHECKLIST_STATUS.PASS : CHECKLIST_STATUS.PENDING,
    },
    {
      id: "CB06-03",
      criterion: "Sufficiency PASS/FAIL reproducible por factory_key (EVF-05)",
      status: sufficiency.errors.length === 0 ? CHECKLIST_STATUS.PASS : CHECKLIST_STATUS.PENDING,
    },
    {
      id: "CB06-04",
      criterion: "IA assist E1/E2 máximo — EVF-02",
      status: evf02.errors.length === 0 ? CHECKLIST_STATUS.PASS : CHECKLIST_STATUS.PENDING,
    },
  ];

  const passed = allErrors.length === 0 && checklist.every((i) => i.status === CHECKLIST_STATUS.PASS);

  let phaseRecord = null;
  if (passed && options.markComplete) {
    phaseRecord = markPhaseComplete("CB-06", {
      validationReport: "runCb06EvidenceValidation",
      approvedBy: options.approvedBy ?? null,
      pendingDirectorApproval: !options.approvedBy,
    });
  }

  return {
    phase: "CB-06",
    passed,
    errors: allErrors,
    checklist,
    omcMotorCountRisk: {
      constitutional: OMC_MOTOR_COUNT_CONSTITUTIONAL,
      cb04CatalogIndexed: MOTOR_CATALOG_COUNT,
      reconciliationDeferred: omcRisk.reconciliationDeferred,
    },
    phaseRecord,
    cb07Unlocked: passed ? isPhaseApproved("CB-06") : false,
  };
}

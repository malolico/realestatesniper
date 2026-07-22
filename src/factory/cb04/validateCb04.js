/**
 * CB-04 validation — Motor Runtime Foundation acceptance tests.
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
import { MOTOR_CATALOG_COUNT, getMotorCatalogEntry } from "./motorCatalogIndex.js";
import { MotorExecutionLock } from "./motorExecutionLock.js";
import { MotorRuntime } from "./motorRuntime.js";
import { MotorRuntimeService } from "./motorRuntimeService.js";
import { validateMotorRegistration } from "./motorRuntime.js";
import { checkMotorDependencies } from "./dependencyResolver.js";

function createTempEnv() {
  const base = fs.mkdtempSync(path.join(os.tmpdir(), "cb04-validation-"));
  return {
    base,
    registryDir: path.join(base, "registry"),
    complianceDir: path.join(base, "compliance"),
  };
}

function createRuntimeStack(env) {
  const store = new FileElrStore(env.registryDir);
  const registry = new FactoryRegistry({ store });
  const complianceStore = new ComplianceStateStore(env.complianceDir);
  const compliance = new ComplianceGateService({
    registry,
    stateStore: complianceStore,
    lockRegistry: new MotorLockRegistry(),
  });
  const executionLock = new MotorExecutionLock();
  const runtime = new MotorRuntime({ registry, compliance, executionLock });
  return { registry, compliance, executionLock, runtime };
}

export function validateCb04Governance() {
  const errors = [];
  try {
    assertPhaseUnlocked("CB-04");
  } catch (err) {
    errors.push(err.message);
  }
  if (!isPhaseApproved("CB-03")) {
    errors.push("CB-03 is not APPROVED");
  }
  return { errors };
}

export function validateMotorCatalog() {
  const errors = [];
  if (MOTOR_CATALOG_COUNT < 52) {
    errors.push(`OMC catalog too small: ${MOTOR_CATALOG_COUNT}`);
  }
  const idn = getMotorCatalogEntry("MOT-IDN-01");
  const exe = getMotorCatalogEntry("MOT-EXE-01");
  const cmp = getMotorCatalogEntry("MOT-CMP-01");
  if (!idn || idn.cap !== "CAP-01") {
    errors.push("MOT-IDN-01 CAP binding missing");
  }
  if (!exe || exe.cap !== "CAP-24") {
    errors.push("MOT-EXE-01 CAP binding missing");
  }
  if (!cmp || cmp.cap !== "CAP-09") {
    errors.push("MOT-CMP-01 CAP binding missing");
  }
  return { errors };
}

export async function validateMotorManifestElr() {
  const errors = [];
  const env = createTempEnv();

  try {
    const { registry, compliance, runtime } = createRuntimeStack(env);
    const expediente = registry.createExpediente({ candidateRef: "manifest-test" });
    const key = expediente.factory_key;

    compliance.evaluateAndRecordClearance(key, { piiAuthorized: true });

    const manifest = await runtime.execute(key, "MOT-IDN-01", { useStub: true });
    if (manifest.kind !== "MOTOR_RUN_MANIFEST") {
      errors.push("Manifest kind invalid");
    }

    const record = registry.getExpediente(key);
    const manifests = record.elr.motor_manifests ?? [];
    if (manifests.length < 1) {
      errors.push("motor_manifests not recorded in ELR");
    }
    if (!manifests.some((m) => m.motorId === "MOT-IDN-01")) {
      errors.push("MOT-IDN-01 manifest not found in ELR");
    }
  } catch (err) {
    errors.push(err.message);
  } finally {
    fs.rmSync(env.base, { recursive: true, force: true });
  }

  return { errors };
}

export async function validateDep01Enforcement() {
  const errors = [];
  const env = createTempEnv();

  try {
    const { registry, compliance, runtime } = createRuntimeStack(env);
    const expediente = registry.createExpediente({ candidateRef: "dep01-test" });
    const key = expediente.factory_key;
    compliance.evaluateAndRecordClearance(key, { piiAuthorized: true });

    try {
      await runtime.execute(key, "MOT-MOT-01", { useStub: true });
      errors.push("MOT-MOT-01 should fail without MOT-IDN-01 (DEP-01)");
    } catch (err) {
      if (!String(err.message).includes("DEP-01")) {
        errors.push(`Expected DEP-01 failure, got: ${err.message}`);
      }
    }

    const depCheck = checkMotorDependencies("MOT-MOT-01", { completedMotors: new Set() });
    if (depCheck.allowed) {
      errors.push("Dependency resolver should block layer 3 without IDN");
    }
  } catch (err) {
    errors.push(err.message);
  } finally {
    fs.rmSync(env.base, { recursive: true, force: true });
  }

  return { errors };
}

export async function validateLk01Lock() {
  const errors = [];
  const env = createTempEnv();

  try {
    const { registry, compliance, executionLock, runtime } = createRuntimeStack(env);
    const expediente = registry.createExpediente({ candidateRef: "lk01-test" });
    const key = expediente.factory_key;
    compliance.evaluateAndRecordClearance(key, { piiAuthorized: true });

    executionLock.acquire(key, "MOT-IDN-01", "test-holder");
    try {
      await runtime.execute(key, "MOT-IDN-01", { useStub: true });
      errors.push("Second executor should fail under LK-01");
    } catch (err) {
      if (!String(err.message).includes("LK-01")) {
        errors.push(`Expected LK-01 failure, got: ${err.message}`);
      }
    }
    executionLock.release(key, "MOT-IDN-01");
  } catch (err) {
    errors.push(err.message);
  } finally {
    fs.rmSync(env.base, { recursive: true, force: true });
  }

  return { errors };
}

export function validateCapBindingRejection() {
  const errors = [];

  const unknown = validateMotorRegistration("MOT-UNKNOWN-99");
  if (unknown.valid) {
    errors.push("Unknown motor should be rejected");
  }

  const mismatch = validateMotorRegistration("MOT-IDN-01", "CAP-99");
  if (mismatch.valid) {
    errors.push("CAP mismatch should be rejected");
  }

  return { errors };
}

export async function validateComplianceIntegration() {
  const errors = [];
  const env = createTempEnv();

  try {
    const store = new FileElrStore(env.registryDir);
    const registry = new FactoryRegistry({ store });
    const service = new MotorRuntimeService({
      registry,
      compliance: new ComplianceGateService({
        registry,
        stateStore: new ComplianceStateStore(env.complianceDir),
        lockRegistry: new MotorLockRegistry(),
      }),
    });

    const expediente = service.bootstrapExpediente({ candidateRef: "compliance-block" });
    const key = expediente.factory_key;
    service.compliance.emitComplianceBlock(key, "validation block");

    try {
      await service.runMotor(key, "MOT-IDN-01", { useStub: true });
      errors.push("Blocked expediente should not execute motor");
    } catch (err) {
      if (!String(err.message).includes("Compliance blocked")) {
        errors.push(`Expected compliance block, got: ${err.message}`);
      }
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
export async function runCb04Validation(options = {}) {
  const gov = validateCb04Governance();
  const catalog = validateMotorCatalog();
  const manifest = await validateMotorManifestElr();
  const dep01 = await validateDep01Enforcement();
  const lk01 = await validateLk01Lock();
  const cap = validateCapBindingRejection();
  const compliance = await validateComplianceIntegration();

  const allErrors = [
    ...gov.errors,
    ...catalog.errors,
    ...manifest.errors,
    ...dep01.errors,
    ...lk01.errors,
    ...cap.errors,
    ...compliance.errors,
  ];

  const checklist = [
    {
      id: "CB04-01",
      criterion: "Ejecución MOT produce manifest en ELR",
      status: manifest.errors.length === 0 ? CHECKLIST_STATUS.PASS : CHECKLIST_STATUS.PENDING,
    },
    {
      id: "CB04-02",
      criterion: "DEP-01 enforced: Capa 3+ bloqueada sin MOT-IDN-01",
      status: dep01.errors.length === 0 ? CHECKLIST_STATUS.PASS : CHECKLIST_STATUS.PENDING,
    },
    {
      id: "CB04-03",
      criterion: "LK-01 operativo — un motor, un re-ejecutor activo",
      status: lk01.errors.length === 0 ? CHECKLIST_STATUS.PASS : CHECKLIST_STATUS.PENDING,
    },
    {
      id: "CB04-04",
      criterion: "Motor sin CAP padre rechazado en runtime",
      status: cap.errors.length === 0 ? CHECKLIST_STATUS.PASS : CHECKLIST_STATUS.PENDING,
    },
    {
      id: "CB04-05",
      criterion: "Integración Compliance P0 pre-ejecución",
      status: compliance.errors.length === 0 ? CHECKLIST_STATUS.PASS : CHECKLIST_STATUS.PENDING,
    },
    {
      id: "CB04-06",
      criterion: "Catálogo OMC indexado con CAP binding",
      status: catalog.errors.length === 0 ? CHECKLIST_STATUS.PASS : CHECKLIST_STATUS.PENDING,
    },
  ];

  const passed = allErrors.length === 0 && checklist.every((i) => i.status === CHECKLIST_STATUS.PASS);

  let phaseRecord = null;
  if (passed && options.markComplete) {
    phaseRecord = markPhaseComplete("CB-04", {
      validationReport: "runCb04MotorRuntimeValidation",
      approvedBy: options.approvedBy ?? null,
      pendingDirectorApproval: !options.approvedBy,
    });
  }

  return {
    phase: "CB-04",
    passed,
    errors: allErrors,
    checklist,
    motorCatalogCount: MOTOR_CATALOG_COUNT,
    phaseRecord,
    cb05Unlocked: passed ? isPhaseApproved("CB-04") : false,
  };
}

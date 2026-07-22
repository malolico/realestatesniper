/**
 * CB-03 validation — Compliance P0 acceptance tests.
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
import { CLEARANCE_STATUS } from "./clearanceProtocol.js";
import { ComplianceGateService } from "./complianceGateService.js";
import { ComplianceStateStore } from "./complianceStateStore.js";
import { MotCmp01 } from "./motCmp01.js";
import { runConstitutionalValidators } from "./constitutionalValidators.js";
import { MotorLockRegistry } from "./motorLockRegistry.js";

function createTempEnv() {
  const base = fs.mkdtempSync(path.join(os.tmpdir(), "cb03-validation-"));
  return {
    base,
    registryDir: path.join(base, "registry"),
    complianceDir: path.join(base, "compliance"),
  };
}

export function validateCb03Governance() {
  const errors = [];
  try {
    assertPhaseUnlocked("CB-03");
  } catch (err) {
    errors.push(err.message);
  }
  if (!isPhaseApproved("CB-02")) {
    errors.push("CB-02 is not APPROVED");
  }
  return { errors };
}

export function validateNasc01Enforcement() {
  const errors = [];
  const env = createTempEnv();

  try {
    const store = new FileElrStore(env.registryDir);
    const registry = new FactoryRegistry({ store });
    const complianceStore = new ComplianceStateStore(env.complianceDir);
    const service = new ComplianceGateService({
      registry,
      stateStore: complianceStore,
      lockRegistry: new MotorLockRegistry(),
    });

    const expediente = registry.createExpediente({ candidateRef: "cmp-test" });
    const key = expediente.factory_key;

    try {
      service.guardedTransition(key, "ST-IDN", { actor: "MOT-IDN-01" });
      errors.push("ST-NASC → ST-IDN should fail without clearance");
    } catch {
      // expected NASC-01
    }

    const afterFail = registry.getExpediente(key);
    if (afterFail.state !== "ST-NASC") {
      errors.push("Failed transition should not mutate state");
    }

    service.evaluateAndRecordClearance(key, { piiAuthorized: true });
    service.guardedTransition(key, "ST-IDN", {
      actor: "MOT-IDN-01",
      reason: "clearance_granted",
    });

    const afterPass = registry.getExpediente(key);
    if (afterPass.state !== "ST-IDN") {
      errors.push("Should advance to ST-IDN after clearance PASS");
    }
  } catch (err) {
    errors.push(err.message);
  } finally {
    fs.rmSync(env.base, { recursive: true, force: true });
  }

  return { errors };
}

export function validateBlockAndLocks() {
  const errors = [];
  const env = createTempEnv();

  try {
    const store = new FileElrStore(env.registryDir);
    const registry = new FactoryRegistry({ store });
    const complianceStore = new ComplianceStateStore(env.complianceDir);
    const locks = new MotorLockRegistry();
    const service = new ComplianceGateService({
      registry,
      stateStore: complianceStore,
      lockRegistry: locks,
    });

    const { factory_key: key } = registry.createExpediente({ candidateRef: "block-test" });

    service.evaluateAndRecordClearance(key, {
      prohibitedFlags: ["FP-08"],
      repeatViolation: true,
    });

    if (!locks.isBlocked(key)) {
      errors.push("LOOP-XVR-CMP-01 BLOCK should suspend locks (LK-02)");
    }

    const pre = service.assertPreExecution(key, {
      actor: "MOT-IDN-01",
      operation: "motor_run",
    });
    if (pre.valid) {
      errors.push("Pre-execution should fail under active BLOCK");
    }
  } catch (err) {
    errors.push(err.message);
  } finally {
    fs.rmSync(env.base, { recursive: true, force: true });
  }

  return { errors };
}

export function validateElrComplianceRecords() {
  const errors = [];
  const env = createTempEnv();

  try {
    const store = new FileElrStore(env.registryDir);
    const registry = new FactoryRegistry({ store });
    const complianceStore = new ComplianceStateStore(env.complianceDir);
    const service = new ComplianceGateService({
      registry,
      stateStore: complianceStore,
      lockRegistry: new MotorLockRegistry(),
    });

    const { factory_key: key } = registry.createExpediente({ candidateRef: "elr-cmp" });

    service.evaluateAndRecordClearance(key, {
      prohibitedFlags: ["FP-02"],
    });

    const record = registry.getExpediente(key);
    const clearanceActs = record.elr.motor_manifests.filter(
      (m) => m.kind === "MOT_CMP_CLEARANCE"
    );
    const violations = record.elr.conflict_resolutions.filter(
      (m) => m.kind === "COMPLIANCE_VIOLATION"
    );

    if (clearanceActs.length < 1) {
      errors.push("ELR missing MOT_CMP_CLEARANCE entry");
    }
    if (violations.length < 1) {
      errors.push("ELR missing COMPLIANCE_VIOLATION entry");
    }
  } catch (err) {
    errors.push(err.message);
  } finally {
    fs.rmSync(env.base, { recursive: true, force: true });
  }

  return { errors };
}

export function validateConstitutionalValidators() {
  const errors = [];

  const mot = new MotCmp01();
  const pass = mot.evaluate({ piiAuthorized: true });
  if (pass.clearance !== CLEARANCE_STATUS.PASS) {
    errors.push("Clean input should PASS MOT-CMP-01");
  }

  const fail = mot.evaluate({ accessTierAssignment: "premium" });
  if (fail.clearance !== CLEARANCE_STATUS.FAIL) {
    errors.push("access_tier assignment should FAIL MOT-CMP-01");
  }

  const validators = runConstitutionalValidators({
    actor: "MOT-CMP-01",
    operation: "test",
    toState: "ST-PROD",
    clearance: "PENDING",
    blocked: false,
  });
  if (validators.valid) {
    errors.push("ST-PROD without clearance should fail validators");
  }

  return { errors };
}

/**
 * @param {{ markComplete?: boolean, approvedBy?: string }} [options]
 */
export function runCb03Validation(options = {}) {
  const gov = validateCb03Governance();
  const nasc = validateNasc01Enforcement();
  const block = validateBlockAndLocks();
  const elr = validateElrComplianceRecords();
  const validators = validateConstitutionalValidators();

  const allErrors = [
    ...gov.errors,
    ...nasc.errors,
    ...block.errors,
    ...elr.errors,
    ...validators.errors,
  ];

  const checklist = [
    {
      id: "CB03-01",
      criterion: "Sin clearance no avanza ST-NASC → ST-IDN/PROD (NASC-01)",
      status: nasc.errors.length === 0 ? CHECKLIST_STATUS.PASS : CHECKLIST_STATUS.PENDING,
    },
    {
      id: "CB03-02",
      criterion: "LOOP-XVR-CMP-01 emite BLOCK y suspende locks (LK-02)",
      status: block.errors.length === 0 ? CHECKLIST_STATUS.PASS : CHECKLIST_STATUS.PENDING,
    },
    {
      id: "CB03-03",
      criterion: "Violación compliance registrada en ELR",
      status: elr.errors.length === 0 ? CHECKLIST_STATUS.PASS : CHECKLIST_STATUS.PENDING,
    },
    {
      id: "CB03-04",
      criterion: "P0 verificado — validadores constitucionales",
      status: validators.errors.length === 0 ? CHECKLIST_STATUS.PASS : CHECKLIST_STATUS.PENDING,
    },
  ];

  const passed = allErrors.length === 0 && checklist.every((i) => i.status === CHECKLIST_STATUS.PASS);

  let phaseRecord = null;
  if (passed && options.markComplete) {
    phaseRecord = markPhaseComplete("CB-03", {
      validationReport: "runCb03ComplianceValidation",
      approvedBy: options.approvedBy ?? null,
      pendingDirectorApproval: !options.approvedBy,
    });
  }

  return {
    phase: "CB-03",
    passed,
    errors: allErrors,
    checklist,
    phaseRecord,
    cb04Unlocked: passed ? isPhaseApproved("CB-03") : false,
  };
}

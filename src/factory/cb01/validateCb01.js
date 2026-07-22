/**
 * CB-01 validation — Factory Registry / ELR acceptance tests.
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
import { RETENTION_YEARS, computeRetentionExpiry } from "./retentionPolicy.js";
import { FileElrStore } from "./fileElrStore.js";
import { FactoryRegistry } from "./factoryRegistry.js";
import { INITIAL_EXPEDIENTE_STATE } from "./stateMachine.js";

/**
 * @param {string} prefix
 */
function createTempStore(prefix = "cb01-validation-") {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), prefix));
  return new FileElrStore(dir);
}

export function validateCb01Governance() {
  const errors = [];
  try {
    assertPhaseUnlocked("CB-01");
  } catch (err) {
    errors.push(err.message);
  }
  if (!isPhaseApproved("CB-00")) {
    errors.push("CB-00 is not APPROVED");
  }
  return { errors };
}

export function validateRegistryLifecycle() {
  const errors = [];
  const store = createTempStore();

  try {
    const registry = new FactoryRegistry({ store });

    const created = registry.createExpediente({
      candidateRef: "parcel:123-test",
      actor: "FactoryRegistry",
    });

    if (created.state !== INITIAL_EXPEDIENTE_STATE) {
      errors.push(`Expected ST-NASC, got ${created.state}`);
    }

    const transitions = created.elr.state_transitions;
    if (transitions.length !== 1 || transitions[0].to !== "ST-NASC") {
      errors.push("Birth transition not recorded in ELR");
    }

    registry.transitionState(created.factory_key, "ST-IDN", {
      actor: "MOT-IDN-01",
      reason: "identity_started",
    });

    const lineage = registry.getLineage(created.factory_key);
    if (lineage.elr.state_transitions.length < 2) {
      errors.push("State transition did not append ELR entry (TRZ-01 violation)");
    }

    const resolved = registry.resolveFactoryKey(
      created.factory_key,
      "maricopa.parcel.123-test",
      { actor: "MOT-IDN-01" }
    );
    if (resolved.keyStatus !== "definitive") {
      errors.push("factory_key resolution did not set definitive status");
    }
    if (resolved.elr.factory_key_history.length !== 1) {
      errors.push("factory_key_history not recorded");
    }

    registry.registerElrAct(
      resolved.factory_key,
      "motor_manifests",
      { motor: "MOT-IDN-01", runId: "run-001" },
      { actor: "MOT-IDN-01" }
    );

    const afterMotor = registry.getExpediente(resolved.factory_key);
    if (afterMotor.elr.motor_manifests.length !== 1) {
      errors.push("motor_manifest ELR act not persisted");
    }
  } catch (err) {
    errors.push(err.message);
  } finally {
    fs.rmSync(store.rootDir, { recursive: true, force: true });
  }

  return { errors };
}

export function validateRetentionPolicy() {
  const errors = [];
  if (RETENTION_YEARS !== 7) {
    errors.push(`Expected 7-year retention, got ${RETENTION_YEARS}`);
  }
  const archived = new Date("2020-01-01T00:00:00.000Z");
  const expiry = computeRetentionExpiry(archived);
  const sevenYearsMs = RETENTION_YEARS * 365.25 * 24 * 60 * 60 * 1000;
  if (expiry.getTime() !== archived.getTime() + sevenYearsMs) {
    errors.push("Retention expiry calculation incorrect");
  }
  return { errors };
}

export function validateTrz01Enforcement() {
  const errors = [];
  const store = createTempStore("cb01-trz-");

  try {
    const registry = new FactoryRegistry({ store });
    const record = registry.createExpediente({ candidateRef: "trz-test" });

    try {
      registry.transitionState(record.factory_key, "ST-PROD", {
        actor: "MOT-IDN-01",
      });
      errors.push("Should reject ST-NASC → ST-PROD without ST-IDN");
    } catch {
      // expected
    }

    const reloaded = registry.getExpediente(record.factory_key);
    if (reloaded.state !== "ST-NASC") {
      errors.push("Invalid transition mutated state without ELR path");
    }
    if (reloaded.elr.state_transitions.length !== 1) {
      errors.push("Invalid transition should not append ELR entry");
    }
  } catch (err) {
    errors.push(err.message);
  } finally {
    fs.rmSync(store.rootDir, { recursive: true, force: true });
  }

  return { errors };
}

/**
 * @param {{ markComplete?: boolean, approvedBy?: string }} [options]
 */
export function runCb01Validation(options = {}) {
  const gov = validateCb01Governance();
  const lifecycle = validateRegistryLifecycle();
  const retention = validateRetentionPolicy();
  const trz = validateTrz01Enforcement();

  const allErrors = [...gov.errors, ...lifecycle.errors, ...retention.errors, ...trz.errors];

  const checklist = [
    {
      id: "CB01-01",
      criterion: "Crear expediente → ST-NASC registrado en ELR",
      status: lifecycle.errors.length === 0 ? CHECKLIST_STATUS.PASS : CHECKLIST_STATUS.PENDING,
    },
    {
      id: "CB01-02",
      criterion: "Transición requiere entrada ELR (TRZ-01)",
      status: trz.errors.length === 0 && lifecycle.errors.length === 0
        ? CHECKLIST_STATUS.PASS
        : CHECKLIST_STATUS.PENDING,
    },
    {
      id: "CB01-03",
      criterion: "Consulta lineage completa por factory_key",
      status: lifecycle.errors.length === 0 ? CHECKLIST_STATUS.PASS : CHECKLIST_STATUS.PENDING,
    },
    {
      id: "CB01-04",
      criterion: "Política retención 7 años definida y aplicable",
      status: retention.errors.length === 0 ? CHECKLIST_STATUS.PASS : CHECKLIST_STATUS.PENDING,
    },
    {
      id: "CC-01-01",
      criterion: "ELR structure operational (FFO TRZ-01)",
      status: lifecycle.errors.length === 0 ? CHECKLIST_STATUS.PASS : CHECKLIST_STATUS.PENDING,
    },
  ];

  const passed = allErrors.length === 0 && checklist.every((i) => i.status === CHECKLIST_STATUS.PASS);

  let phaseRecord = null;
  if (passed && options.markComplete) {
    phaseRecord = markPhaseComplete("CB-01", {
      validationReport: "runCb01RegistryValidation",
      approvedBy: options.approvedBy ?? null,
      pendingDirectorApproval: !options.approvedBy,
    });
  }

  return {
    phase: "CB-01",
    passed,
    errors: allErrors,
    checklist,
    phaseRecord,
    cb02Unlocked: passed ? isPhaseApproved("CB-01") : false,
    cb01TechnicallyComplete: passed && options.markComplete && !options.approvedBy
      ? isPhaseApproved("CB-01") || phaseRecord?.status === "COMPLETE"
      : false,
  };
}

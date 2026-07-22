/**
 * CB-02 validation — DSO / Sources layer acceptance tests.
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
import { assertNoAveraging } from "./conflictRules.js";
import { DsoIngestionService } from "./dsoIngestionService.js";
import { IngestionLegitimacyGate } from "./ingestionLegitimacyGate.js";
import { SourceIngestionLedger } from "./sourceIngestionLedger.js";
import { SourceRegistry } from "./sourceRegistry.js";
import { isSourceRef } from "./sourceRef.js";

function createTempDirs() {
  const base = fs.mkdtempSync(path.join(os.tmpdir(), "cb02-validation-"));
  return {
    base,
    registryDir: path.join(base, "registry"),
    ingestionDir: path.join(base, "ingestions"),
  };
}

export function validateCb02Governance() {
  const errors = [];
  try {
    assertPhaseUnlocked("CB-02");
  } catch (err) {
    errors.push(err.message);
  }
  if (!isPhaseApproved("CB-01")) {
    errors.push("CB-01 is not APPROVED");
  }
  return { errors };
}

export function validateSourceRefAndRejection() {
  const errors = [];
  const gate = new IngestionLegitimacyGate();

  const accepted = gate.evaluate({
    organismId: "ORG-ASR-MC",
    factoryKey: "prov-test",
    vintageAt: new Date().toISOString(),
    targetMpiDomain: "01",
  });

  if (!accepted.accepted || !isSourceRef(accepted.source_ref)) {
    errors.push("Legitimate public source should produce source_ref");
  }

  const rejected = gate.evaluate({
    organismId: "ORG-PRH-SCR",
    prohibitedFlags: ["FP-02"],
  });

  if (rejected.accepted) {
    errors.push("Prohibited organism/flags should be rejected");
  }

  const scraping = gate.evaluate({
    organismId: "ORG-ASR-MC",
    prohibitedFlags: ["FP-02"],
  });

  if (scraping.accepted) {
    errors.push("FP-02 scraping flag should reject ingestion");
  }

  return { errors };
}

export function validateConflictDerivation() {
  const errors = [];
  const gate = new IngestionLegitimacyGate();

  try {
    assertNoAveraging("AVERAGE");
    errors.push("assertNoAveraging should throw on AVERAGE");
  } catch {
    // expected
  }

  const conflict = gate.evaluate({
    organismId: "ORG-RCR-MC",
    conflictDetected: true,
    conflictResolvable: false,
  });

  if (conflict.accepted || !conflict.deriveToEvidence) {
    errors.push("Irresolvable conflict should derive to Evidence");
  }

  return { errors };
}

export function validateDdiPilotMapping() {
  const errors = [];
  const registry = new SourceRegistry();
  const report = registry.getPilotLayer12CoverageReport();

  if (!report.complete) {
    errors.push(`Pilot layer 1-2 missing domains: ${report.missingDomains.join(", ")}`);
  }

  for (const orgReport of report.reports) {
    if (!orgReport.valid) {
      errors.push(`Organism DDI coverage invalid: ${orgReport.organismId}`);
    }
  }

  return { errors, report };
}

export function validateRegistryElrIntegration() {
  const errors = [];
  const dirs = createTempDirs();

  try {
    const store = new FileElrStore(dirs.registryDir);
    const registry = new FactoryRegistry({ store });
    const ledger = new SourceIngestionLedger(dirs.ingestionDir);
    const service = new DsoIngestionService({ registry, ledger });

    const expediente = registry.createExpediente({ candidateRef: "dso-pilot" });
    const verdict = service.ingest(expediente.factory_key, {
      organismId: "ORG-ASR-MC",
      vintageAt: new Date().toISOString(),
    });

    if (!verdict.accepted) {
      errors.push("Pilot ingest should be accepted");
    }

    const history = service.getIngestionHistory(expediente.factory_key);
    if (history.length !== 1 || !history[0].sourceRefId) {
      errors.push("Ingestion ledger missing source_ref trace");
    }

    const reloaded = registry.getExpediente(expediente.factory_key);
    const dsoActs = reloaded.elr.motor_manifests.filter((m) => m.kind === "DSO_SOURCE_INGEST");
    if (dsoActs.length !== 1) {
      errors.push("ELR should record DSO_SOURCE_INGEST act");
    }

    const reject = service.ingest(expediente.factory_key, {
      organismId: "ORG-ASR-MC",
      prohibitedFlags: ["FP-08"],
    });

    if (reject.accepted) {
      errors.push("Prohibited ingest should fail in service");
    }

    const afterReject = registry.getExpediente(expediente.factory_key);
    const rejectActs = afterReject.elr.conflict_resolutions.filter(
      (c) => c.kind === "DSO_INGEST_REJECTED"
    );
    if (rejectActs.length < 1) {
      errors.push("Rejected ingest should append ELR conflict_resolutions entry");
    }
  } catch (err) {
    errors.push(err.message);
  } finally {
    fs.rmSync(dirs.base, { recursive: true, force: true });
  }

  return { errors };
}

/**
 * @param {{ markComplete?: boolean, approvedBy?: string }} [options]
 */
export function runCb02Validation(options = {}) {
  const gov = validateCb02Governance();
  const sourceRef = validateSourceRefAndRejection();
  const conflict = validateConflictDerivation();
  const mapping = validateDdiPilotMapping();
  const elr = validateRegistryElrIntegration();

  const allErrors = [
    ...gov.errors,
    ...sourceRef.errors,
    ...conflict.errors,
    ...mapping.errors,
    ...elr.errors,
  ];

  const checklist = [
    {
      id: "CB02-01",
      criterion: "Toda ingestión produce source_ref trazable",
      status:
        sourceRef.errors.length === 0 && elr.errors.length === 0
          ? CHECKLIST_STATUS.PASS
          : CHECKLIST_STATUS.PENDING,
    },
    {
      id: "CB02-02",
      criterion: "Fuente prohibida o irregular rechazada",
      status: sourceRef.errors.length === 0 ? CHECKLIST_STATUS.PASS : CHECKLIST_STATUS.PENDING,
    },
    {
      id: "CB02-03",
      criterion: "Conflicto no promedia — deriva a Evidence",
      status: conflict.errors.length === 0 ? CHECKLIST_STATUS.PASS : CHECKLIST_STATUS.PENDING,
    },
    {
      id: "CB02-04",
      criterion: "Mapeo DSO → DDI capas 1–2 verificable",
      status: mapping.errors.length === 0 ? CHECKLIST_STATUS.PASS : CHECKLIST_STATUS.PENDING,
    },
  ];

  const passed = allErrors.length === 0 && checklist.every((i) => i.status === CHECKLIST_STATUS.PASS);

  let phaseRecord = null;
  if (passed && options.markComplete) {
    phaseRecord = markPhaseComplete("CB-02", {
      validationReport: "runCb02DsoValidation",
      approvedBy: options.approvedBy ?? null,
      pendingDirectorApproval: !options.approvedBy,
    });
  }

  return {
    phase: "CB-02",
    passed,
    errors: allErrors,
    checklist,
    pilotMapping: mapping.report ?? null,
    phaseRecord,
    cb03Unlocked: passed ? isPhaseApproved("CB-02") : false,
  };
}

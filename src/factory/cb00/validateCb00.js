/**
 * CB-00 validation — verifies constitutional binding and governance artifacts.
 */

import fs from "node:fs";
import path from "node:path";
import {
  CANON_COUNTS,
  CONSTITUTIONAL_DOCUMENTS,
  CONSTRUCTION_BLUEPRINT_PATH,
  getReferenceOnlyDocuments,
  getVersionedDocuments,
  REPO_ROOT,
  resolveDocumentPath,
} from "./constitutionalBindingPack.js";
import { assertCatalogActor, validateCatalogActor } from "./catalogActorGuard.js";
import {
  assertPhaseUnlocked,
  CONSTRUCTION_PHASES,
  getPreviousPhaseId,
  isPhaseApproved,
  isPhaseComplete,
  markPhaseComplete,
} from "./constructionGovernance.js";
import { getChecklistForPhase, CHECKLIST_STATUS } from "./canonComplianceChecklist.js";
import {
  EXPEDIENTE_STATES,
  isValidExpedienteState,
  matchActorCode,
} from "./operationalVocabulary.js";

/**
 * @returns {import('./canonComplianceChecklist.js').ChecklistItem[] & { errors: string[] }}
 */
export function validateConstitutionalDocumentsOnDisk() {
  const errors = [];
  const versioned = getVersionedDocuments();

  for (const doc of versioned) {
    const abs = resolveDocumentPath(doc.relativePath);
    if (!fs.existsSync(abs)) {
      errors.push(`Missing versioned document #${doc.number} (${doc.id}): ${doc.relativePath}`);
    }
  }

  const blueprintPath = path.join(REPO_ROOT, CONSTRUCTION_BLUEPRINT_PATH);
  if (!fs.existsSync(blueprintPath)) {
    errors.push(`Missing construction blueprint: ${CONSTRUCTION_BLUEPRINT_PATH}`);
  }

  if (CONSTITUTIONAL_DOCUMENTS.length !== CANON_COUNTS.constitutionalDocuments) {
    errors.push(
      `Document index count mismatch: expected ${CANON_COUNTS.constitutionalDocuments}, got ${CONSTITUTIONAL_DOCUMENTS.length}`
    );
  }

  const referenceOnly = getReferenceOnlyDocuments();
  if (referenceOnly.length !== 2) {
    errors.push(`Expected 2 REFERENCE_ONLY documents (MPI, DKN), got ${referenceOnly.length}`);
  }

  return { errors, versionedCount: versioned.length, referenceOnlyCount: referenceOnly.length };
}

export function validateOperationalVocabulary() {
  const errors = [];

  if (EXPEDIENTE_STATES.length !== CANON_COUNTS.expedienteStates) {
    errors.push(
      `Expediente state count mismatch: expected ${CANON_COUNTS.expedienteStates}, got ${EXPEDIENTE_STATES.length}`
    );
  }

  for (const state of EXPEDIENTE_STATES) {
    if (!state.code.startsWith("ST-")) {
      errors.push(`Invalid state code format: ${state.code}`);
    }
  }

  if (!isValidExpedienteState("ST-RDY")) {
    errors.push("ST-RDY not registered in operational vocabulary");
  }

  const sampleActors = ["MOT-IDN-01", "LOOP-FND-SUP-01", "SWM-EVD-01", "AIA-NRM-02", "CAP-01"];
  for (const actor of sampleActors) {
    if (!matchActorCode(actor)) {
      errors.push(`Sample actor failed pattern match: ${actor}`);
    }
  }

  return { errors };
}

export function validateCatalogActorGuard() {
  const errors = [];

  const validCases = ["MOT-CMP-01", "LOOP-XVR-CMP-01", "SWM-EVD-01", "AIA-EXP-01"];
  for (const code of validCases) {
    const result = validateCatalogActor(code);
    if (!result.valid) errors.push(`Expected valid actor rejected: ${code}`);
  }

  const invalidCases = ["ENGINE-legacy", "DEAL-PIPELINE", "CUSTOM-MOTOR-99"];
  for (const code of invalidCases) {
    const result = validateCatalogActor(code);
    if (result.valid) errors.push(`Expected invalid actor accepted: ${code}`);
  }

  try {
    assertCatalogActor("MOT-IDN-01");
  } catch (err) {
    errors.push(`assertCatalogActor failed on valid code: ${err.message}`);
  }

  return { errors };
}

export function validateConstructionGovernance() {
  const errors = [];

  if (CONSTRUCTION_PHASES.length !== 20) {
    errors.push(`Expected 20 construction phases, got ${CONSTRUCTION_PHASES.length}`);
  }

  if (getPreviousPhaseId("CB-01") !== "CB-00") {
    errors.push("CB-01 previous phase should be CB-00");
  }

  // Self-test only: assertPhaseUnlocked semantics are unchanged in constructionGovernance.
  // Behavior must match the live ledger state (APPROVED vs not APPROVED).
  if (isPhaseApproved("CB-00")) {
    try {
      assertPhaseUnlocked("CB-01");
    } catch (err) {
      errors.push(
        `assertPhaseUnlocked should allow CB-01 when CB-00 is APPROVED: ${err.message}`
      );
    }
  } else {
    try {
      assertPhaseUnlocked("CB-01");
      errors.push("assertPhaseUnlocked should block CB-01 when CB-00 incomplete");
    } catch {
      // expected when CB-00 is not APPROVED
    }
  }

  return { errors };
}

/**
 * @param {{ markComplete?: boolean, approvedBy?: string }} [options]
 */
export function runCb00Validation(options = {}) {
  const docCheck = validateConstitutionalDocumentsOnDisk();
  const vocabCheck = validateOperationalVocabulary();
  const guardCheck = validateCatalogActorGuard();
  const govCheck = validateConstructionGovernance();

  const allErrors = [
    ...docCheck.errors,
    ...vocabCheck.errors,
    ...guardCheck.errors,
    ...govCheck.errors,
  ];

  const checklistResults = {
    "CC-00-01": allErrors.some((e) => e.includes("document") || e.includes("blueprint"))
      ? CHECKLIST_STATUS.PENDING
      : CHECKLIST_STATUS.PASS,
    "CC-00-02": guardCheck.errors.length === 0 ? CHECKLIST_STATUS.PASS : CHECKLIST_STATUS.PENDING,
    "CC-00-03": govCheck.errors.length === 0 ? CHECKLIST_STATUS.PASS : CHECKLIST_STATUS.PENDING,
    "CC-00-04": CHECKLIST_STATUS.PASS,
  };

  const cb00Checklist = getChecklistForPhase("CB-00").map((item) => ({
    id: item.id,
    criterion: item.criterion,
    status: checklistResults[item.id] ?? CHECKLIST_STATUS.PENDING,
  }));

  const passed = allErrors.length === 0 && cb00Checklist.every((i) => i.status === CHECKLIST_STATUS.PASS);

  let phaseRecord = null;
  if (passed && options.markComplete) {
    phaseRecord = markPhaseComplete("CB-00", {
      validationReport: "runCb00CanonValidation",
      approvedBy: options.approvedBy ?? null,
      pendingDirectorApproval: !options.approvedBy,
    });
  }

  return {
    phase: "CB-00",
    passed,
    errors: allErrors,
    summary: {
      constitutionalDocumentsIndexed: CONSTITUTIONAL_DOCUMENTS.length,
      versionedDocumentsOnDisk: docCheck.versionedCount,
      referenceOnlyDocuments: docCheck.referenceOnlyCount,
      constructionPhases: CONSTRUCTION_PHASES.length,
      cb00Checklist,
    },
    phaseRecord,
    cb01Unlocked: passed ? isPhaseApproved("CB-00") : false,
    cb00TechnicallyComplete: passed ? isPhaseComplete("CB-00") : false,
  };
}

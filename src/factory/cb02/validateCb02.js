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
import { loadRecordedPackEnrichment } from "./connectors/recordedPackEnrichmentAdapter.js";
import { buildCanonicalPropertyFact } from "./connectors/canonicalPropertyFactAdapter.js";
import {
  JURISDICTION_STATUS,
  normalizeJurisdiction,
} from "./jurisdictionRegistry.js";
import {
  PROPERTY_IDENTITY_STATUS,
  resolvePropertyIdentity,
} from "../cb05/propertyIdentityResolver.js";
import { SOURCE_MODE } from "../cb05/decisionTrustBoundary.js";
import {
  FACT_TYPE,
  FRESHNESS_STATE,
  buildDecisionFactEnvelope,
  buildUnknownFactEnvelope,
  mapFreshnessState,
} from "./decisionFactEnvelope.js";
import {
  SOURCE_COMPLETENESS_STATUS,
  evaluateSourceCompleteness,
} from "./sourceCompleteness.js";
import { evaluateFactCompleteness } from "./factCompleteness.js";
import { MotEvd02 } from "../cb06/motEvd02.js";
import { exportFromMotEvd02Result } from "../cb06/conflictExport.js";

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
 * PS05-02 — Canonical fact / jurisdiction / identity proofs (T01–T09 subset at CB-02).
 */
export function validatePs0502CanonicalIdentityCb02() {
  const errors = [];
  try {
    const loaded = loadRecordedPackEnrichment(undefined, { factoryKey: "ps05-02-t01" });
    if (!loaded.ok) {
      errors.push(`T01: recorded pack enrichment failed: ${loaded.reason}`);
    } else {
      if (loaded.propertyIdentity?.status !== PROPERTY_IDENTITY_STATUS.MATCH) {
        errors.push("T01: Assessor+GIS(+RCR) must MATCH one canonical property identity");
      }
      if (!loaded.canonicalPropertyFact?.rawIdentifiers?.assessor?.parcelId) {
        errors.push("T06: canonical fact must preserve raw assessor identifiers");
      }
      const j = loaded.canonicalPropertyFact?.jurisdiction;
      if (!j || j.state !== "AZ" || j.county !== "Maricopa" || j.status !== JURISDICTION_STATUS.KNOWN) {
        errors.push("T07: jurisdiction must be explicit machine-readable state+county");
      }
      if (loaded.canonicalPropertyFact?.ownerRef?.status !== "UNRESOLVED") {
        errors.push("T08: pack without owner fields must yield UNRESOLVED ownerRef");
      }
      const viewParcel = loaded.canonicalPropertyFact?.parcelId;
      if (!viewParcel || loaded.canonicalPropertyFact?.schemaId !== "rsn.canonical.property.fact.v1") {
        errors.push("T05: Decision-facing canonical schema must be rsn.canonical.property.fact.v1");
      }
      if (loaded.canonicalPropertyFact?.trustMeta?.synthetic === true) {
        errors.push("T09: recorded enrichment trustMeta must not mark synthetic");
      }
    }

    const maricopa = normalizeJurisdiction({ sourceLabel: "Maricopa County, AZ" });
    const other = normalizeJurisdiction({ state: "CA", county: "Los Angeles" });
    const t04 = resolvePropertyIdentity({
      sources: [
        { organismId: "A", jurisdiction: maricopa, apn: "123-45-678", parcelId: "P-SAME" },
        { organismId: "B", jurisdiction: other, apn: "123-45-678", parcelId: "P-SAME" },
      ],
    });
    if (t04.status !== PROPERTY_IDENTITY_STATUS.NO_MATCH) {
      errors.push("T04: same APN across jurisdictions must NOT MATCH");
    }

    const t02 = resolvePropertyIdentity({
      sources: [
        { organismId: "A", jurisdiction: maricopa, apn: "111", parcelId: "P1" },
        { organismId: "B", jurisdiction: maricopa, apn: "222", parcelId: "P2" },
      ],
    });
    if (t02.status !== PROPERTY_IDENTITY_STATUS.NO_MATCH) {
      errors.push("T02: conflicting strong identifiers must NOT silently merge");
    }

    const t03 = resolvePropertyIdentity({ sources: [] });
    if (t03.status !== PROPERTY_IDENTITY_STATUS.UNRESOLVED) {
      errors.push("T03: missing identity evidence must be UNRESOLVED");
    }

    const synth = buildCanonicalPropertyFact({
      payloadsByOrganism: null,
      trustMeta: { synthetic: true, sourceMode: SOURCE_MODE.SYNTHETIC_FIXTURE },
    });
    if (synth.trustMeta?.decisionTrusted === true || synth.trustMeta?.synthetic !== true) {
      errors.push("T09: synthetic trust markers must survive canonicalization");
    }
  } catch (err) {
    errors.push(err.message);
  }
  return { errors };
}

/**
 * PS05-03 — Provenance / typing / unknown / exhaustion / conflict / freshness proofs.
 */
export function validatePs0503TruthAccountingCb02() {
  const errors = [];
  try {
    const loaded = loadRecordedPackEnrichment(undefined, { factoryKey: "ps05-03-t01" });
    if (!loaded.ok) {
      errors.push(`T01: pack load failed: ${loaded.reason}`);
    } else {
      if (!loaded.canonicalPropertyFact?.provenanceMeta?.primarySourceRefId) {
        errors.push("T01/P04: observed parcel fact must retain SourceRef lineage");
      }
      if (loaded.propertyIdentity?.status !== PROPERTY_IDENTITY_STATUS.MATCH) {
        errors.push("T09: PS05-02 property identity MATCH must remain intact");
      }
      if (loaded.canonicalPropertyFact?.jurisdiction?.state !== "AZ") {
        errors.push("T09: PS05-02 jurisdiction must remain intact");
      }
      if (!loaded.canonicalPropertyFact?.rawIdentifiers?.assessor) {
        errors.push("T09: rawIdentifiers must remain intact");
      }
      const owner = loaded.factCompleteness?.facts?.find((f) => f.factClass === "ownerRef");
      if (owner?.status !== "UNKNOWN") {
        errors.push("T03: unresolved owner must surface as UNKNOWN fact status");
      }
    }

    const derived = buildDecisionFactEnvelope({
      factClass: "trustMeta",
      value: { trustClass: "STUB" },
      factType: FACT_TYPE.DERIVED,
      derivationRef: { kind: "test_derivation", inputs: ["SRC-A", "SRC-B"] },
      trustMeta: { decisionTrusted: false, stubBusinessFact: true, synthetic: true },
    });
    if (!derived.derivationRef?.inputs || derived.trustMeta.decisionTrusted === true) {
      errors.push("T02/T08: derived/stub fact must keep derivation lineage and remain non-trusted");
    }

    const missing = buildUnknownFactEnvelope("ownerRef", { reason: "absent" });
    if (missing.factType !== FACT_TYPE.UNKNOWN || missing.value != null) {
      errors.push("T03/P05: missing expected fact must be UNKNOWN with null value");
    }

    const src = evaluateSourceCompleteness({
      payloadsByOrganism: { "ORG-ASR-MC": {} },
      sourceRefsByOrganism: {},
      unavailableOrganisms: ["ORG-GIS-MC"],
      notCheckedOrganisms: ["ORG-RCR-MC"],
    });
    const asr = src.sources.find((s) => s.organismId === "ORG-ASR-MC");
    const gis = src.sources.find((s) => s.organismId === "ORG-GIS-MC");
    if (asr?.status === SOURCE_COMPLETENESS_STATUS.CHECKED) {
      errors.push("T04: payload without SourceRef must not be CHECKED");
    }
    if (gis?.status !== SOURCE_COMPLETENESS_STATUS.UNAVAILABLE) {
      errors.push("T04: unavailable source must be explicit UNAVAILABLE");
    }

    const evd = new MotEvd02();
    const arb = evd.arbitrate({
      factoryKey: "ps05-03-conflict",
      field: "apn",
      sources: [
        { sourceRefId: "SRC-A", value: "111", eLevel: "E3", organismId: "ORG-ASR-MC" },
        { sourceRefId: "SRC-B", value: "222", eLevel: "E3", organismId: "ORG-GIS-MC" },
      ],
      resolvable: true,
    });
    const exported = exportFromMotEvd02Result(arb);
    if (exported.conflicts[0]?.retainedLosingLineage !== true) {
      errors.push("T05/P08: conflict export must retain losing-source lineage");
    }
    if (exported.averagingProhibited !== true) {
      errors.push("T05: averaging must remain prohibited");
    }

    const stale = buildDecisionFactEnvelope({
      factClass: "parcelId",
      value: "P1",
      factType: FACT_TYPE.OBSERVED,
      vintageAt: "2010-01-01T00:00:00.000Z",
      freshnessProfileKey: "ASSESSOR_ROLL",
      sourceRefId: "SRC-STALE",
      trustMeta: { decisionTrusted: true },
    });
    if (stale.freshnessState !== FRESHNESS_STATE.STALE || stale.status !== "STALE") {
      errors.push("T06/P09: stale fact must remain STALE downstream");
    }

    if (mapFreshnessState(null, null) !== FRESHNESS_STATE.UNKNOWN_FRESHNESS) {
      errors.push("T07: missing freshness must be UNKNOWN_FRESHNESS not CURRENT");
    }
    const unknownFresh = buildDecisionFactEnvelope({
      factClass: "parcelId",
      value: "P2",
      sourceRefId: "SRC-X",
      trustMeta: { decisionTrusted: true },
    });
    if (unknownFresh.freshnessState !== FRESHNESS_STATE.UNKNOWN_FRESHNESS) {
      errors.push("T07: absent vintage must not become CURRENT");
    }

    const synth = buildDecisionFactEnvelope({
      factClass: "parcelId",
      value: "SYN",
      trustMeta: {
        synthetic: true,
        stubBusinessFact: true,
        decisionTrusted: true,
        sourceMode: SOURCE_MODE.SYNTHETIC_FIXTURE,
      },
    });
    if (synth.factType !== FACT_TYPE.SYNTHETIC || synth.trustMeta.decisionTrusted !== false) {
      errors.push("T08: synthetic facts must be typed SYNTHETIC and non-trusted");
    }

    const fc = evaluateFactCompleteness({
      canonicalFact: loaded.ok ? loaded.canonicalPropertyFact : null,
      propertyIdentity: loaded.ok ? loaded.propertyIdentity : null,
      factoryKey: "ps05-03-fc",
    });
    if (fc.completenessIsNotQuality !== true) {
      errors.push("T10: fact completeness must declare completenessIsNotQuality");
    }
  } catch (err) {
    errors.push(err.message);
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
  const ps0502 = validatePs0502CanonicalIdentityCb02();
  const ps0503 = validatePs0503TruthAccountingCb02();

  const allErrors = [
    ...gov.errors,
    ...sourceRef.errors,
    ...conflict.errors,
    ...mapping.errors,
    ...elr.errors,
    ...ps0502.errors,
    ...ps0503.errors,
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
    {
      id: "CB02-PS05-02",
      criterion: "PS05-02 Canonical fact / jurisdiction / identity (P03 bounded)",
      status: ps0502.errors.length === 0 ? CHECKLIST_STATUS.PASS : CHECKLIST_STATUS.PENDING,
    },
    {
      id: "CB02-PS05-03",
      criterion: "PS05-03 Provenance / typing / unknown / exhaustion / conflict / freshness",
      status: ps0503.errors.length === 0 ? CHECKLIST_STATUS.PASS : CHECKLIST_STATUS.PENDING,
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

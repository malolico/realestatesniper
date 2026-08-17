/**
 * SP10 — Recorded Discovery acceptance harness (T01–T21)
 *
 * Runnable:
 *   node src/factory/cb02/validateSp10RecordedDiscovery.js
 */

import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { FileElrStore } from "../cb01/fileElrStore.js";
import { FactoryRegistry } from "../cb01/factoryRegistry.js";
import { isProvisionalFactoryKey } from "../cb01/factoryKey.js";
import {
  resolvePropertyIdentity,
  PROPERTY_IDENTITY_STATUS,
} from "../cb05/propertyIdentityResolver.js";
import { SCHEMA_ASR_MC_V1 } from "./connectors/payloadSchemas.js";
import {
  writeChecksumsAuthority,
  sha256File,
} from "./connectors/recordedPackChecksums.js";
import {
  RECORDED_OBSERVATION_SCHEMA_ID,
  RECORDED_OBSERVATION_SCHEMA_VERSION,
  OBSERVATION_MANIFEST_FILENAME,
  computeDiscoveryDedupKey,
  validateRecordedObservation,
  buildDiscoveryCandidateRef,
} from "./discovery/recordedObservationContract.js";
import {
  DISCOVERY_SIGNAL_STATUS,
  DISCOVERY_SIGNAL_AUTHORITY,
} from "./discovery/discoverySignalContract.js";
import {
  DISCOVERY_CANDIDATE_AUTHORITY,
  DISCOVERY_MATERIALITY_STATUS,
} from "./discovery/discoveryCandidateContract.js";
import { evaluateDiscoveryMateriality } from "./discovery/discoveryMaterialityGate.js";
import { DiscoveryDedupRegistry } from "./discovery/discoveryDedupRegistry.js";
import {
  DISCOVERY_HANDOFF_KIND,
  hasDiscoveryHandoff,
} from "./discovery/discoveryHandoff.js";
import {
  processRecordedObservation,
  RECORDED_DISCOVERY_DISPOSITION,
  sanitizeDiscoveryFactoryKey,
} from "./discovery/recordedDiscoveryPipeline.js";
import { buildCanonicalPropertyFact } from "./connectors/canonicalPropertyFactAdapter.js";
import { normalizeJurisdiction } from "./jurisdictionRegistry.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = path.resolve(__dirname, "../../..");
const REF_PAYLOAD_PATH = path.join(
  REPO_ROOT,
  "data/factory-dso-packs/maricopa/pilot-001/response/ORG-ASR-MC.json"
);

export const SP10_ACCEPTANCE_TOKEN = "SP10_RECORDED_DISCOVERY_ACCEPTANCE_PASS";

function pass(id, errors = []) {
  return { id, passed: errors.length === 0, errors };
}

function createHarness() {
  const base = fs.mkdtempSync(path.join(os.tmpdir(), "sp10-disc-"));
  const registryDir = path.join(base, "registry");
  const dedupDir = path.join(base, "dedup");
  const store = new FileElrStore(registryDir);
  const registry = new FactoryRegistry({ store });
  const dedupRegistry = new DiscoveryDedupRegistry(dedupDir);
  return { base, registryDir, dedupDir, store, registry, dedupRegistry };
}

/**
 * @param {string} root
 * @param {object} [overrides]
 */
function writeObservationRoot(root, overrides = {}) {
  fs.mkdirSync(root, { recursive: true });
  const payload = overrides.payload ?? JSON.parse(fs.readFileSync(REF_PAYLOAD_PATH, "utf8"));
  const payloadPath = "payload.json";
  fs.writeFileSync(path.join(root, payloadPath), `${JSON.stringify(payload, null, 2)}\n`, "utf8");
  const payloadFingerprint = sha256File(path.join(root, payloadPath));

  const manifest = {
    schemaId: RECORDED_OBSERVATION_SCHEMA_ID,
    schemaVersion: RECORDED_OBSERVATION_SCHEMA_VERSION,
    observationId: overrides.observationId ?? "obs-asr-001",
    corpusId: overrides.corpusId ?? "corpus-sp10-001",
    sourceMode: "RECORDED",
    liveFetch: false,
    jurisdiction: overrides.jurisdiction ?? "Maricopa County, AZ",
    sourceIdentity: {
      organismId: "ORG-ASR-MC",
      familyId: "REGISTRAL_ASSESSOR",
      payloadSchemaId: SCHEMA_ASR_MC_V1,
      ...(overrides.sourceIdentity ?? {}),
    },
    observedAt: overrides.observedAt ?? "2024-06-01T00:00:00.000Z",
    recordedAt: overrides.recordedAt ?? "2026-07-26T00:00:00.000Z",
    payloadPath,
    payloadFingerprint,
    ...(overrides.manifestExtras ?? {}),
  };

  if (overrides.liveFetch === true) {
    manifest.liveFetch = true;
  }

  fs.writeFileSync(
    path.join(root, OBSERVATION_MANIFEST_FILENAME),
    `${JSON.stringify(manifest, null, 2)}\n`,
    "utf8"
  );

  writeChecksumsAuthority(root, [OBSERVATION_MANIFEST_FILENAME, payloadPath]);
  return { manifest, payload, root };
}

function processWithHarness(obsRoot, harness, ingestedAt) {
  return processRecordedObservation(obsRoot, {
    registry: harness.registry,
    dedupRegistry: harness.dedupRegistry,
    ingestedAt,
  });
}

function t01() {
  const errors = [];
  const h = createHarness();
  const obsRoot = path.join(h.base, "obs-01");
  writeObservationRoot(obsRoot);
  const result = processWithHarness(obsRoot, h, "2026-08-17T10:00:00.000Z");
  if (result.disposition !== RECORDED_DISCOVERY_DISPOSITION.CREATED) {
    errors.push(`expected CREATED got ${result.disposition}`);
  }
  return pass("T01", errors);
}

function t02() {
  const errors = [];
  const h = createHarness();
  const obsRoot = path.join(h.base, "obs-02");
  const { manifest } = writeObservationRoot(obsRoot, { observationId: "obs-t02" });
  const result = processWithHarness(obsRoot, h, "2026-08-17T10:00:00.000Z");
  const expectedKey = computeDiscoveryDedupKey(manifest);
  if (result.signal?.signalId !== expectedKey) {
    errors.push("signalId must equal dedupKey");
  }
  if (result.signal?.status !== DISCOVERY_SIGNAL_STATUS.EMITTED) {
    errors.push("first run signal must be EMITTED");
  }
  return pass("T02", errors);
}

function t03() {
  const errors = [];
  const h = createHarness();
  const obsRoot = path.join(h.base, "obs-03");
  writeObservationRoot(obsRoot, { observationId: "obs-t03" });
  const result = processWithHarness(obsRoot, h, "2026-08-17T10:00:00.000Z");
  if (result.candidate?.materialityStatus !== DISCOVERY_MATERIALITY_STATUS.MATERIAL) {
    errors.push("materiality must be MATERIAL");
  }
  return pass("T03", errors);
}

function t04() {
  const errors = [];
  const h = createHarness();
  const obsRoot = path.join(h.base, "obs-04");
  writeObservationRoot(obsRoot, { observationId: "obs-t04" });
  const result = processWithHarness(obsRoot, h, "2026-08-17T10:00:00.000Z");
  if (result.identity?.status !== PROPERTY_IDENTITY_STATUS.UNRESOLVED) {
    errors.push(`expected UNRESOLVED got ${result.identity?.status}`);
  }
  return pass("T04", errors);
}

function t05() {
  const errors = [];
  const h = createHarness();
  const obsRoot = path.join(h.base, "obs-05");
  writeObservationRoot(obsRoot, { observationId: "obs-t05" });
  const result = processWithHarness(obsRoot, h, "2026-08-17T10:00:00.000Z");
  const expectedRef = buildDiscoveryCandidateRef("obs-t05");
  if (result.candidate?.candidateRef !== expectedRef) {
    errors.push(`candidateRef expected ${expectedRef}`);
  }
  if (!isProvisionalFactoryKey(result.factoryKey)) {
    errors.push("factoryKey must be provisional");
  }
  if (result.factoryKey !== `prov-${expectedRef.replace(/[^a-z0-9._-]/gi, "").slice(0, 64)}`) {
    errors.push(`factoryKey mismatch: ${result.factoryKey}`);
  }
  return pass("T05", errors);
}

function t06() {
  const errors = [];
  const h = createHarness();
  const obsRoot = path.join(h.base, "obs-06");
  writeObservationRoot(obsRoot, { observationId: "obs-t06" });
  const result = processWithHarness(obsRoot, h, "2026-08-17T10:00:00.000Z");
  const lineage = h.registry.getLineage(result.factoryKey);
  const handoffs = lineage.elr?.decision_handoffs ?? [];
  const discovery = handoffs.filter((x) => x.kind === DISCOVERY_HANDOFF_KIND);
  if (discovery.length !== 1) {
    errors.push(`expected 1 discovery handoff got ${discovery.length}`);
  }
  return pass("T06", errors);
}

function t07() {
  const errors = [];
  const h = createHarness();
  const obsRoot = path.join(h.base, "obs-07");
  writeObservationRoot(obsRoot, { observationId: "obs-t07" });
  const first = processWithHarness(obsRoot, h, "2026-08-17T10:00:00.000Z");
  const second = processWithHarness(obsRoot, h, "2026-08-17T11:00:00.000Z");
  if (second.disposition !== RECORDED_DISCOVERY_DISPOSITION.DUPLICATE) {
    errors.push("second run must be DUPLICATE");
  }
  if (second.factoryKey !== first.factoryKey) {
    errors.push("duplicate must reuse factoryKey");
  }
  if (second.signal?.status !== DISCOVERY_SIGNAL_STATUS.DUPLICATE) {
    errors.push("duplicate signal status");
  }
  const lineage = h.registry.getLineage(first.factoryKey);
  const discovery = (lineage.elr?.decision_handoffs ?? []).filter(
    (x) => x.kind === DISCOVERY_HANDOFF_KIND
  );
  if (discovery.length !== 1) {
    errors.push("duplicate must not append second handoff");
  }
  return pass("T07", errors);
}

function t08() {
  const errors = [];
  const h = createHarness();
  const obsRoot = path.join(h.base, "obs-08");
  const { manifest } = writeObservationRoot(obsRoot, { observationId: "obs-t08" });
  processWithHarness(obsRoot, h, "2026-08-17T10:00:00.000Z");
  processWithHarness(obsRoot, h, "2026-08-17T11:00:00.000Z");
  const record = h.dedupRegistry.lookup(computeDiscoveryDedupKey(manifest));
  if ((record?.replayCount ?? 0) < 2) {
    errors.push("replayCount must increment");
  }
  if (record?.lastReplayedAt !== "2026-08-17T11:00:00.000Z") {
    errors.push("lastReplayedAt must update on replay");
  }
  return pass("T08", errors);
}

function t09() {
  const errors = [];
  const h = createHarness();
  const obsRoot = path.join(h.base, "obs-09");
  const observedAt = "2024-01-15T08:30:00.000Z";
  writeObservationRoot(obsRoot, { observationId: "obs-t09", observedAt });
  processWithHarness(obsRoot, h, "2026-08-17T10:00:00.000Z");
  const replay = processWithHarness(obsRoot, h, "2026-12-01T00:00:00.000Z");
  if (replay.signal?.observedAt !== observedAt) {
    errors.push("observedAt must not change on replay");
  }
  return pass("T09", errors);
}

function t10() {
  const errors = [];
  const h = createHarness();
  const obsRoot = path.join(h.base, "obs-10");
  writeObservationRoot(obsRoot, { observationId: "obs-t10" });
  fs.writeFileSync(path.join(obsRoot, OBSERVATION_MANIFEST_FILENAME), "{ invalid");
  const result = processWithHarness(obsRoot, h, "2026-08-17T10:00:00.000Z");
  if (result.disposition !== RECORDED_DISCOVERY_DISPOSITION.REFUSED) {
    errors.push("malformed manifest must REFUSED");
  }
  return pass("T10", errors);
}

function t11() {
  const errors = [];
  const h = createHarness();
  const obsRoot = path.join(h.base, "obs-11");
  writeObservationRoot(obsRoot, { observationId: "obs-t11", liveFetch: true });
  const result = processWithHarness(obsRoot, h, "2026-08-17T10:00:00.000Z");
  if (result.disposition !== RECORDED_DISCOVERY_DISPOSITION.REFUSED) {
    errors.push("liveFetch true must REFUSED");
  }
  return pass("T11", errors);
}

function t12() {
  const errors = [];
  const h = createHarness();
  const obsRoot = path.join(h.base, "obs-12");
  writeObservationRoot(obsRoot, { observationId: "obs-t12" });
  const manifest = JSON.parse(
    fs.readFileSync(path.join(obsRoot, OBSERVATION_MANIFEST_FILENAME), "utf8")
  );
  manifest.payloadFingerprint = "0".repeat(64);
  fs.writeFileSync(
    path.join(obsRoot, OBSERVATION_MANIFEST_FILENAME),
    `${JSON.stringify(manifest, null, 2)}\n`,
    "utf8"
  );
  writeChecksumsAuthority(obsRoot, [OBSERVATION_MANIFEST_FILENAME, "payload.json"]);
  const result = processWithHarness(obsRoot, h, "2026-08-17T10:00:00.000Z");
  if (result.disposition !== RECORDED_DISCOVERY_DISPOSITION.REFUSED) {
    errors.push("fingerprint mismatch must REFUSED");
  }
  return pass("T12", errors);
}

function t13() {
  const errors = [];
  const h = createHarness();
  const obsRoot = path.join(h.base, "obs-13");
  writeObservationRoot(obsRoot, {
    observationId: "obs-t13",
    jurisdiction: "Unknown County, XX",
  });
  const result = processWithHarness(obsRoot, h, "2026-08-17T10:00:00.000Z");
  if (result.disposition !== RECORDED_DISCOVERY_DISPOSITION.INSUFFICIENT) {
    errors.push(`expected INSUFFICIENT got ${result.disposition}`);
  }
  return pass("T13", errors);
}

function t14() {
  const errors = [];
  const fact = buildCanonicalPropertyFact({
    payloadsByOrganism: {
      "ORG-ASR-MC": {
        schemaId: SCHEMA_ASR_MC_V1,
        parcelId: null,
        apn: null,
        situsAddress: { line1: "100 Main", city: "Phoenix", state: "AZ", postalCode: "85001" },
        landUseCode: "R1",
        assessedYear: 2024,
      },
    },
    packJurisdictionLabel: "Maricopa County, AZ",
  });
  const materiality = evaluateDiscoveryMateriality({ canonicalFact: fact });
  if (materiality.materialityStatus !== DISCOVERY_MATERIALITY_STATUS.INSUFFICIENT) {
    errors.push("address-only must be INSUFFICIENT");
  }
  return pass("T14", errors);
}

function t15() {
  const errors = [];
  const maricopa = normalizeJurisdiction({ sourceLabel: "Maricopa County, AZ" });
  const identity = resolvePropertyIdentity({
    sources: [
      {
        organismId: "ORG-ASR-MC",
        jurisdiction: maricopa,
        parcelId: "PARCEL-A",
        apn: "111",
      },
      {
        organismId: "ORG-GIS-MC",
        jurisdiction: maricopa,
        parcelId: "PARCEL-B",
        apn: "222",
      },
    ],
  });
  if (identity.status !== PROPERTY_IDENTITY_STATUS.NO_MATCH) {
    errors.push(`expected NO_MATCH got ${identity.status}`);
  }
  return pass("T15", errors);
}

function t16() {
  const errors = [];
  const h = createHarness();
  const obs1 = path.join(h.base, "obs-16a");
  const obs2 = path.join(h.base, "obs-16b");
  writeObservationRoot(obs1, { observationId: "obs-t16a" });
  writeObservationRoot(obs2, {
    observationId: "obs-t16b",
    observedAt: "2024-06-02T00:00:00.000Z",
  });
  const first = processWithHarness(obs1, h, "2026-08-17T10:00:00.000Z");
  const second = processWithHarness(obs2, h, "2026-08-17T10:01:00.000Z");
  if (second.factoryKey !== first.factoryKey) {
    errors.push("same property UNRESOLVED must reuse factoryKey");
  }
  if (h.registry.listExpedientes().length !== 1) {
    errors.push("must not create second expediente");
  }
  return pass("T16", errors);
}

function t17() {
  const errors = [];
  const maricopa = normalizeJurisdiction({ sourceLabel: "Maricopa County, AZ" });
  const identity = resolvePropertyIdentity({
    sources: [
      {
        organismId: "ORG-ASR-MC",
        jurisdiction: maricopa,
        parcelId: "MC-MATCH-001",
        apn: "999",
      },
      {
        organismId: "ORG-GIS-MC",
        jurisdiction: maricopa,
        parcelId: "MC-MATCH-001",
        apn: "999",
      },
    ],
  });
  if (identity.status !== PROPERTY_IDENTITY_STATUS.MATCH) {
    errors.push(`expected MATCH got ${identity.status}`);
  }
  if (!identity.definitiveKeyCandidate) {
    errors.push("definitiveKeyCandidate required on MATCH");
  }
  return pass("T17", errors);
}

function t18() {
  const errors = [];
  const h = createHarness();
  const definitive = sanitizeDiscoveryFactoryKey("US-AZ-MARICOPA:MC-DEDUP-DEF");
  h.registry.createExpediente({ candidateRef: "disc-t18-first", actor: "MOT-CMP-01" });
  h.registry.resolveFactoryKey("prov-disc-t18-first", definitive, {
    actor: "MOT-IDN-01",
    reason: "t18_setup",
  });
  h.dedupRegistry.save({
    dedupKey: "a".repeat(64),
    observationId: "obs-t18-seed",
    signalId: "a".repeat(64),
    candidateId: "a".repeat(64),
    factoryKey: definitive,
    propertyAnchor: null,
    definitiveKeyCandidate: definitive,
    identityStatus: PROPERTY_IDENTITY_STATUS.MATCH,
    materialityStatus: DISCOVERY_MATERIALITY_STATUS.MATERIAL,
    canonicalKey: "US-AZ-MARICOPA:MC-DEDUP-DEF",
    observedAt: "2024-06-01T00:00:00.000Z",
    recordedAt: "2026-07-26T00:00:00.000Z",
    firstIngestedAt: "2026-08-17T10:00:00.000Z",
    lastReplayedAt: "2026-08-17T10:00:00.000Z",
    replayCount: 1,
    handoffRecorded: true,
  });

  const found = h.dedupRegistry.findByDefinitiveKey(definitive);
  if (!found || found.factoryKey !== definitive) {
    errors.push("findByDefinitiveKey must resolve existing factoryKey");
  }

  const payloadMatch = {
    schemaId: SCHEMA_ASR_MC_V1,
    parcelId: "MC-DEDUP-DEF",
    apn: "777-77-777",
    situsAddress: { line1: "300 Dedup Way", city: "Phoenix", state: "AZ", postalCode: "85001" },
    landUseCode: "R1",
    assessedYear: 2024,
  };
  const obsRoot = path.join(h.base, "obs-18");
  writeObservationRoot(obsRoot, {
    observationId: "obs-t18-second",
    observedAt: "2024-08-01T00:00:00.000Z",
    payload: payloadMatch,
  });

  const identityDual = resolvePropertyIdentity({
    canonicalFact: buildCanonicalPropertyFact({
      payloadsByOrganism: {
        "ORG-ASR-MC": payloadMatch,
        "ORG-GIS-MC": {
          schemaId: "maricopa.gis.payload.v1",
          parcelId: "MC-DEDUP-DEF",
          apn: "777-77-777",
          geometryType: "Point",
          centroid: { lat: 33.4, lon: -112.0 },
          crs: "EPSG:4326",
        },
      },
      packJurisdictionLabel: "Maricopa County, AZ",
    }),
  });
  if (identityDual.status !== PROPERTY_IDENTITY_STATUS.MATCH) {
    errors.push("dual-source control must MATCH");
  }
  const sanitizedFromCanonical = sanitizeDiscoveryFactoryKey(
    identityDual.canonicalKey ?? ""
  );
  if (sanitizedFromCanonical !== definitive) {
    errors.push("sanitized canonicalKey must match definitive expediente key");
  }

  const before = h.registry.listExpedientes().length;
  if (before !== 1) {
    errors.push(`expected 1 expediente before second create got ${before}`);
  }

  return pass("T18", errors);
}

function t19() {
  const errors = [];
  const discoveryDir = path.join(__dirname, "discovery");
  const files = fs.readdirSync(discoveryDir).map((f) => path.join(discoveryDir, f));
  const forbidden = [
    /(?<![A-Za-z_.])fetch\s*\(/,
    /\bsupabase\b/i,
    /process\.env/,
    /bootstrapIntelligence/,
    /EvidenceService/,
    /offlineIngestFromPack/,
  ];
  const joined = files.map((f) => fs.readFileSync(f, "utf8")).join("\n");
  for (const re of forbidden) {
    if (re.test(joined)) {
      errors.push(`forbidden pattern in SP10 files: ${re}`);
    }
  }
  if (DISCOVERY_SIGNAL_AUTHORITY.isEvidence !== false) {
    errors.push("signal authority");
  }
  if (DISCOVERY_CANDIDATE_AUTHORITY.isOpportunity !== false) {
    errors.push("candidate authority");
  }
  return pass("T19", errors);
}

function t20() {
  const errors = [];
  const h1 = createHarness();
  const h2 = createHarness();
  const obs1 = path.join(h1.base, "obs-20");
  const obs2 = path.join(h2.base, "obs-20-copy");
  const built = writeObservationRoot(obs1, { observationId: "obs-t20" });
  writeObservationRoot(obs2, { observationId: "obs-t20" });
  const r1 = processWithHarness(obs1, h1, "2026-08-17T10:00:00.000Z");
  const r2 = processWithHarness(obs2, h2, "2026-08-17T12:00:00.000Z");
  const k1 = computeDiscoveryDedupKey(built.manifest);
  const k2 = computeDiscoveryDedupKey(built.manifest);
  if (k1 !== k2) errors.push("dedupKey must be deterministic");
  if (r1.dedupKey !== r2.dedupKey) errors.push("pipeline dedupKey mismatch");
  if (r1.factoryKey !== r2.factoryKey) errors.push("factoryKey must match for same observation bytes");
  return pass("T20", errors);
}

function t21() {
  const errors = [];
  const indexSrc = fs.readFileSync(path.join(__dirname, "index.js"), "utf8");
  if (!indexSrc.includes("runSp10RecordedDiscoveryValidation")) {
    errors.push("index.js must export runSp10RecordedDiscoveryValidation");
  }
  if (!indexSrc.includes("processRecordedObservation")) {
    errors.push("index.js must export processRecordedObservation");
  }
  const validated = validateRecordedObservation(
    path.join(REPO_ROOT, "data/factory-dso-packs/maricopa/pilot-001")
  );
  if (validated.ok !== false) {
    errors.push("pilot pack must not validate as SP10 observation (missing observation manifest)");
  }
  return pass("T21", errors);
}

export function runSp10RecordedDiscoveryValidation() {
  const results = [
    t01(),
    t02(),
    t03(),
    t04(),
    t05(),
    t06(),
    t07(),
    t08(),
    t09(),
    t10(),
    t11(),
    t12(),
    t13(),
    t14(),
    t15(),
    t16(),
    t17(),
    t18(),
    t19(),
    t20(),
    t21(),
  ];
  const passed = results.every((r) => r.passed);
  return {
    program: "SP10",
    acceptanceToken: passed ? SP10_ACCEPTANCE_TOKEN : null,
    passed,
    results,
  };
}

const isMain =
  process.argv[1] &&
  (process.argv[1].endsWith("validateSp10RecordedDiscovery.js") ||
    process.argv[1].includes("validateSp10RecordedDiscovery"));

if (isMain) {
  const result = runSp10RecordedDiscoveryValidation();
  console.log("=== SP10 Recorded Discovery Validation ===\n");
  console.log(JSON.stringify(result, null, 2));
  if (!result.passed) {
    console.error("\n❌ SP10 validation FAILED");
    process.exit(1);
  }
  console.log(`\n✅ SP10 validation PASSED — ${SP10_ACCEPTANCE_TOKEN}`);
  process.exit(0);
}

/**
 * Factory Integration — Block I.1
 * Read-only Factory observability reader.
 *
 * CRITICAL: Never call FileElrStore.listFactoryKeys / ensureDirs / write —
 * listFactoryKeys creates directories (mutation). Listing uses existsSync+readdir only.
 */

import fs from "node:fs";
import path from "node:path";
import {
  CONSTRUCTION_PHASES,
  getPhaseRecord,
  loadPhaseStatus,
} from "../../src/factory/cb00/constructionGovernance.js";
// ALLOWED: phase-status JSON read only (no savePhaseStatus).
import { DEFAULT_REGISTRY_ROOT, FileElrStore } from "../../src/factory/cb01/fileElrStore.js";
// ALLOWED: DEFAULT_REGISTRY_ROOT + FileElrStore for path/read only —
// never ensureDirs / write / listFactoryKeys (listFactoryKeys mutates via mkdir).
import { FactoryRegistry } from "../../src/factory/cb01/factoryRegistry.js";
// ALLOWED: getExpediente (store.read) only — never createExpediente/transition/registerElrAct/listExpedientes.
import { aggregateElr } from "../../src/factory/cb15/elrAggregator.js";
// ALLOWED: pure FFO-05 section counts — never recordElrAggregation.
import { buildMaturityMetrics } from "../../src/factory/cb18/maturityMetrics.js";
// ALLOWED: pure maturity panel from existing ELR record.
import { buildCompliancePanel } from "../../src/factory/cb18/compliancePanel.js";
// ALLOWED: pure compliance panel.
import { buildCoveragePanel } from "../../src/factory/cb18/coveragePanel.js";
// ALLOWED: pure coverage counts.
import { detectCanonDrift } from "../../src/factory/cb18/canonDriftDetector.js";
// ALLOWED: pure drift detection — never assertNoCanonDrift throw-path as control plane.
import { buildConstitutionalMetrics } from "../../src/factory/cb18/governanceDashboard.js";
// ALLOWED: static PP/LFF/P-CONST metrics — do not use GovernanceDashboard.buildDashboard
// (it calls registry.listExpedientes → ensureDirs write).

/**
 * List expediente filename stems without creating directories.
 * @param {string} [registryRoot]
 * @returns {{ rootExists: boolean, expedientesDirExists: boolean, keys: string[] }}
 */
export function listExpedienteKeysReadOnly(registryRoot = DEFAULT_REGISTRY_ROOT) {
  const rootExists = fs.existsSync(registryRoot);
  const expedientesDir = path.join(registryRoot, "expedientes");
  const expedientesDirExists = fs.existsSync(expedientesDir);
  if (!expedientesDirExists) {
    return { rootExists, expedientesDirExists: false, keys: [] };
  }
  const keys = fs
    .readdirSync(expedientesDir)
    .filter((f) => f.endsWith(".json"))
    .map((f) => f.replace(/\.json$/, ""));
  return { rootExists, expedientesDirExists: true, keys };
}

/**
 * Constitutional phase span from phase-status JSON (read-only).
 */
export function readConstitutionalPhaseSpan() {
  const status = loadPhaseStatus();
  let approvedCount = 0;
  for (const phase of CONSTRUCTION_PHASES) {
    const record = getPhaseRecord(phase.id, status);
    if (record.status === "APPROVED") approvedCount += 1;
  }
  return {
    from: "CB-00",
    to: "CB-19",
    approvedCount,
    totalCount: CONSTRUCTION_PHASES.length,
    metadata: {
      directorApprovalRequired: status.metadata?.directorApprovalRequired ?? null,
      // Do not echo stale constitutionalCommit / safetyBranch as authoritative HEAD.
    },
  };
}

/**
 * Extract unique FFO_* event kinds from ELR (lineage summary — no payloads).
 * @param {object} record
 */
export function extractFfoEventKinds(record) {
  const refs = record?.elr?.loop_ledger_refs ?? [];
  const kinds = new Set();
  for (const entry of refs) {
    const kind = entry?.kind;
    if (typeof kind === "string" && kind.startsWith("FFO_")) {
      kinds.add(kind);
    }
  }
  return [...kinds].sort();
}

/**
 * Read one expediente via Registry getExpediente (file read only).
 * @param {FactoryRegistry} registry
 * @param {string} keyFromFilename — stem listed from disk
 */
/**
 * @param {FactoryRegistry} registry
 * @param {string} keyFromFilename
 * @param {string} registryRoot
 */
export function readExpedienteSafe(registry, keyFromFilename, registryRoot = DEFAULT_REGISTRY_ROOT) {
  try {
    // Filenames are sanitized stems; getExpediente re-applies factoryKeyToFilename.
    const record = registry.getExpediente(keyFromFilename);
    if (record) return { key: keyFromFilename, record, error: null };
  } catch {
    // Fall through — try reading raw file if key pattern rejected.
  }
  const filePath = path.join(registryRoot, "expedientes", `${keyFromFilename}.json`);
  if (!fs.existsSync(filePath)) {
    return { key: keyFromFilename, record: null, error: "not_found" };
  }
  try {
    const record = JSON.parse(fs.readFileSync(filePath, "utf8"));
    return { key: record.factory_key ?? keyFromFilename, record, error: null };
  } catch {
    return { key: keyFromFilename, record: null, error: "read_failed" };
  }
}

/**
 * Full read-only observability snapshot (raw internal — sanitize before output).
 * @param {{ registryRoot?: string }} [options]
 */
export function readFactoryObservability(options = {}) {
  const registryRoot = options.registryRoot ?? DEFAULT_REGISTRY_ROOT;
  const warnings = [];
  const phaseSpan = readConstitutionalPhaseSpan();
  const listing = listExpedienteKeysReadOnly(registryRoot);

  if (!listing.rootExists) {
    warnings.push("ELR registry root directory is absent (empty-state).");
  } else if (!listing.expedientesDirExists) {
    warnings.push("ELR expedientes directory is absent (empty-state).");
  } else if (listing.keys.length === 0) {
    warnings.push("ELR expedientes directory exists but contains zero expedientes.");
  }

  /** @type {FactoryRegistry|null} */
  let registry = null;
  try {
    // Custom store root for tests; never call listFactoryKeys/ensureDirs/write.
    registry = new FactoryRegistry({
      store: new FileElrStore(registryRoot),
    });
  } catch (err) {
    warnings.push(`FactoryRegistry unavailable: ${sanitizeErrorMessage(err)}`);
  }

  const constitutional = buildConstitutionalMetrics();
  const expedientesRaw = [];
  const eventKinds = new Set();

  for (const stem of listing.keys) {
    if (!registry) break;
    const { key, record, error } = readExpedienteSafe(registry, stem, registryRoot);
    if (!record) {
      warnings.push(`Expediente stem unreadable: ${stem} (${error ?? "unknown"})`);
      continue;
    }

    const maturity = buildMaturityMetrics(record);
    const compliance = buildCompliancePanel(record);
    const coverage = buildCoveragePanel(record);
    const canonDrift = detectCanonDrift(record);
    const elrAgg = aggregateElr(record);
    const kinds = extractFfoEventKinds(record);
    for (const k of kinds) eventKinds.add(k);

    expedientesRaw.push({
      factory_key: record.factory_key ?? key,
      state: record.state ?? null,
      keyStatus: record.keyStatus ?? null,
      maturity,
      compliance,
      coverage,
      canonDrift,
      elrSectionCounts: elrAgg.sections,
      ffoEventKinds: kinds,
    });
  }

  // Factory "available" = constitutional metadata + registry reader constructible (ELR may still be empty).
  const factoryAvailable = registry != null && phaseSpan.totalCount === 20;

  return {
    generatedAt: new Date().toISOString(),
    registryRoot,
    phaseSpan,
    constitutional,
    listing,
    factoryAvailable: Boolean(factoryAvailable),
    expedientesRaw,
    eventKinds: [...eventKinds].sort(),
    warnings,
  };
}

/**
 * @param {unknown} err
 */
function sanitizeErrorMessage(err) {
  const msg = err instanceof Error ? err.message : String(err);
  return msg.replace(/[A-Za-z]:\\[^\s:]+/g, "[path]").replace(/\/Users\/[^\s:]+/g, "[path]");
}

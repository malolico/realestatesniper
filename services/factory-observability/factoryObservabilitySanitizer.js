/**
 * Factory Integration — Block I.1
 * Sanitizer: internal read snapshot → safe JSON contract.
 */

import {
  EMPTY_CONTRACT_SHELL,
  OBSERVABILITY_MODE,
  SCHEMA_VERSION,
} from "./factoryObservabilityContract.js";

/**
 * @param {unknown} value
 * @param {number} [max]
 */
function clipString(value, max = 200) {
  if (typeof value !== "string") return value ?? null;
  return value.length > max ? `${value.slice(0, max)}…` : value;
}

/**
 * @param {string[]} warnings
 */
function sanitizeWarnings(warnings) {
  return (warnings ?? []).map((w) =>
    clipString(String(w).replace(/[A-Za-z]:\\[^\s]+/g, "[path]").replace(/\/Users\/[^\s]+/g, "[path]"), 240)
  );
}

/**
 * @param {object} maturity
 */
function sanitizeMaturity(maturity) {
  if (!maturity || typeof maturity !== "object") return {};
  const gates = maturity.readinessGates ?? {};
  return {
    maturity_score: typeof maturity.maturity_score === "number" ? maturity.maturity_score : null,
    source: maturity.source ?? null,
    rule: maturity.rule ?? null,
    components: maturity.components
      ? {
          completeness: maturity.components.completeness ?? null,
          sufficiency: maturity.components.sufficiency ?? null,
          readiness: maturity.components.readiness ?? null,
          cGlobal: maturity.components.cGlobal ?? null,
          stateBonus: maturity.components.stateBonus ?? null,
        }
      : {},
    gates: {
      available: gates.available === true,
      allPass: gates.allPass === true,
      passCount: gates.passCount ?? 0,
      gateCount: gates.gateCount ?? 0,
      reproducible: gates.reproducible === true,
    },
    // Intentionally omit readinessGates.gates detail payloads.
  };
}

/**
 * @param {object} compliance
 */
function sanitizeCompliance(compliance) {
  if (!compliance || typeof compliance !== "object") return {};
  return {
    healthy: compliance.healthy === true,
    p0Status: compliance.p0?.status ?? null,
    prhZero: compliance.prh?.zero === true,
    prhViolationCount: compliance.prh?.violationCount ?? 0,
    cmpBlockCount: compliance.cmp?.blockCount ?? 0,
    alertCount: Array.isArray(compliance.alerts) ? compliance.alerts.length : 0,
    alertTypes: Array.isArray(compliance.alerts)
      ? [...new Set(compliance.alerts.map((a) => a.type).filter(Boolean))]
      : [],
    // Omit alert messages / block objects / violation payloads.
  };
}

/**
 * @param {object} coverage
 */
function sanitizeCoverage(coverage) {
  if (!coverage || typeof coverage !== "object") return {};
  return {
    motors: coverage.motors?.count ?? 0,
    loops: coverage.loops?.count ?? 0,
    swarms: coverage.swarms?.count ?? 0,
    aia: coverage.aia?.count ?? 0,
    // Omit full id lists and elrSections payloads.
  };
}

/**
 * @param {object} drift
 */
function sanitizeCanonDrift(drift) {
  if (!drift || typeof drift !== "object") return {};
  return {
    hasDrift: drift.hasDrift === true,
    blockDeployment: drift.blockDeployment === true,
    driftCount: drift.driftCount ?? 0,
    actorsScanned: drift.actorsScanned ?? 0,
    // Omit drifted actor lists / reasons (Ops detail — PARKING for richer Admin later).
  };
}

/**
 * Aggregate governance across expedientes for top-level contract.
 * @param {object[]} expedientesRaw
 */
function aggregateGovernance(expedientesRaw) {
  if (!expedientesRaw.length) {
    return {
      maturity: {},
      compliance: {},
      coverage: {},
      canonDrift: {},
    };
  }

  const scores = expedientesRaw
    .map((e) => e.maturity?.maturity_score)
    .filter((n) => typeof n === "number");
  const anyDrift = expedientesRaw.some((e) => e.canonDrift?.hasDrift);
  const anyBlock = expedientesRaw.some((e) => e.canonDrift?.blockDeployment);
  const driftExpedientes = expedientesRaw.filter((e) => e.canonDrift?.hasDrift).length;

  const prhZeroAll = expedientesRaw.every((e) => e.compliance?.prh?.zero !== false);
  const alertCount = expedientesRaw.reduce(
    (n, e) => n + (Array.isArray(e.compliance?.alerts) ? e.compliance.alerts.length : 0),
    0
  );

  return {
    maturity: {
      expedienteCount: expedientesRaw.length,
      scoresPresent: scores.length,
      maturity_score_avg:
        scores.length > 0
          ? Math.round((scores.reduce((a, b) => a + b, 0) / scores.length) * 1000) / 1000
          : null,
    },
    compliance: {
      prhZeroAll,
      alertCount,
      healthyAll: expedientesRaw.every((e) => e.compliance?.healthy === true),
    },
    coverage: {
      // Max counts observed (not constitutional targets).
      motorsMax: Math.max(0, ...expedientesRaw.map((e) => e.coverage?.motors?.count ?? 0)),
      loopsMax: Math.max(0, ...expedientesRaw.map((e) => e.coverage?.loops?.count ?? 0)),
      swarmsMax: Math.max(0, ...expedientesRaw.map((e) => e.coverage?.swarms?.count ?? 0)),
      aiaMax: Math.max(0, ...expedientesRaw.map((e) => e.coverage?.aia?.count ?? 0)),
    },
    canonDrift: {
      hasDrift: anyDrift,
      blockDeployment: anyBlock,
      driftCount: expedientesRaw.reduce((n, e) => n + (e.canonDrift?.driftCount ?? 0), 0),
      expedientesWithDrift: driftExpedientes,
    },
  };
}

/**
 * @param {ReturnType<import('./factoryObservabilityReader.js').readFactoryObservability>} raw
 */
export function sanitizeObservabilitySnapshot(raw) {
  const empty = raw.listing.keys.length === 0;
  const elrAvailable = raw.listing.rootExists || raw.listing.expedientesDirExists;

  const expedientes = (raw.expedientesRaw ?? []).map((e) => ({
    factory_key: e.factory_key ?? null,
    state: e.state ?? null,
    keyStatus: e.keyStatus ?? null,
    maturity: sanitizeMaturity(e.maturity),
    compliance: sanitizeCompliance(e.compliance),
    coverage: sanitizeCoverage(e.coverage),
    canonDrift: sanitizeCanonDrift(e.canonDrift),
    elrSectionCounts: e.elrSectionCounts ?? {},
    // Omit ffoEventKinds per-expediente detail beyond counts at top-level lineage.
  }));

  return {
    schemaVersion: SCHEMA_VERSION,
    mode: OBSERVABILITY_MODE,
    generatedAt: raw.generatedAt ?? new Date().toISOString(),
    factory: {
      available: raw.factoryAvailable === true,
      constitutionalPhaseSpan: {
        from: raw.phaseSpan?.from ?? "CB-00",
        to: raw.phaseSpan?.to ?? "CB-19",
        approvedCount: raw.phaseSpan?.approvedCount ?? 0,
        totalCount: raw.phaseSpan?.totalCount ?? 20,
      },
      constitutionalMetrics: {
        ppCount: raw.constitutional?.pp?.count ?? null,
        lffCount: raw.constitutional?.lff?.count ?? null,
        pConstCount: raw.constitutional?.pConst?.count ?? null,
        ffoLawsCount: raw.constitutional?.ffoLaws?.count ?? null,
        omcMotorsConstitutional: raw.constitutional?.omcMotorsConstitutional ?? null,
      },
    },
    elrHealth: {
      available: elrAvailable,
      empty,
      expedienteCount: expedientes.length,
      status: !raw.listing.rootExists
        ? "REGISTRY_ROOT_MISSING"
        : !raw.listing.expedientesDirExists
          ? "EXPEDIENTES_DIR_MISSING"
          : empty
            ? "EMPTY"
            : "POPULATED",
    },
    expedientes,
    governance: aggregateGovernance(raw.expedientesRaw ?? []),
    lineage: {
      eventKinds: Array.isArray(raw.eventKinds) ? raw.eventKinds : [],
    },
    warnings: sanitizeWarnings(raw.warnings ?? []),
  };
}

/**
 * Controlled error payload (no stack / no local paths).
 * @param {unknown} err
 */
export function sanitizeFatalError(err) {
  const message =
    err instanceof Error
      ? clipString(
          err.message.replace(/[A-Za-z]:\\[^\s]+/g, "[path]").replace(/\/Users\/[^\s]+/g, "[path]"),
          300
        )
      : "unknown_error";
  return {
    ...EMPTY_CONTRACT_SHELL,
    generatedAt: new Date().toISOString(),
    factory: {
      ...EMPTY_CONTRACT_SHELL.factory,
      available: false,
    },
    warnings: [`observability_read_failed: ${message}`],
    error: {
      code: "OBSERVABILITY_READ_FAILED",
      message,
    },
  };
}

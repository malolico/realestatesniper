import { FileElrStore, DEFAULT_REGISTRY_ROOT } from "../../src/factory/cb01/fileElrStore.js";
import { FactoryRegistry } from "../../src/factory/cb01/factoryRegistry.js";
import { aggregateElr } from "../../src/factory/cb15/elrAggregator.js";
import { buildConstitutionalMetrics } from "../../src/factory/cb18/governanceDashboard.js";
import { buildMaturityMetrics } from "../../src/factory/cb18/maturityMetrics.js";
import { buildCompliancePanel } from "../../src/factory/cb18/compliancePanel.js";
import { buildCoveragePanel } from "../../src/factory/cb18/coveragePanel.js";
import { detectCanonDrift } from "../../src/factory/cb18/canonDriftDetector.js";
import {
  listExpedienteKeysReadOnly,
  readConstitutionalPhaseSpan,
  readExpedienteSafe,
  extractFfoEventKinds,
} from "../factory-observability/factoryObservabilityReader.js";
import { FACTORY_EDGE_GOVERNANCE_ALLOWLISTS } from "./contract.js";

function clipString(value, max = 200) {
  if (typeof value !== "string") return value ?? null;
  return value.length > max ? `${value.slice(0, max)}…` : value;
}

function sanitizeMessage(value, max = 200) {
  return clipString(
    String(value)
      .replace(/[A-Za-z]:\\[^\s:]+/g, "[path]")
      .replace(/\/Users\/[^\s:]+/g, "[path]")
      .replace(/\bat\s+\S+\s+\([^)]+:\d+:\d+\)/g, "[stack]"),
    max
  );
}

function toWarningList(values) {
  return (values ?? []).map((item) => sanitizeMessage(item, 240));
}

function countBy(items) {
  const out = {};
  for (const item of items) {
    const key = String(item);
    out[key] = (out[key] ?? 0) + 1;
  }
  return out;
}

function normalizeCoverageSections(sections) {
  const out = {};
  for (const key of FACTORY_EDGE_GOVERNANCE_ALLOWLISTS.dashboard.coverageSections) {
    out[key] = Number(sections?.[key] ?? 0);
  }
  return out;
}

function sanitizeDashboardMaturity(maturity) {
  const gates = maturity?.readinessGates ?? {};
  return {
    maturityScore:
      typeof maturity?.maturity_score === "number" ? maturity.maturity_score : null,
    source: maturity?.source ?? null,
    rule: maturity?.rule ?? null,
    g0g6Reproducible: maturity?.g0g6Reproducible === true,
    bands: {
      completeness: maturity?.components?.completeness ?? null,
      sufficiency: maturity?.components?.sufficiency ?? null,
      readiness: maturity?.components?.readiness ?? null,
      cGlobal: maturity?.components?.cGlobal ?? null,
      stateBonus: maturity?.components?.stateBonus ?? null,
    },
    gates: {
      available: gates.available === true,
      allPass: gates.allPass === true,
      passCount: Number(gates.passCount ?? 0),
      gateCount: Number(gates.gateCount ?? 0),
      reproducible: gates.reproducible === true,
    },
  };
}

function sanitizeDashboardCompliance(compliance) {
  const alerts = Array.isArray(compliance?.alerts) ? compliance.alerts : [];
  return {
    healthy: compliance?.healthy === true,
    p0Status: compliance?.p0?.status ?? null,
    prhZero: compliance?.prh?.zero === true,
    prhViolationCount: Number(compliance?.prh?.violationCount ?? 0),
    cmpBlockCount: Number(compliance?.cmp?.blockCount ?? 0),
    alertCount: alerts.length,
    alertTypes: [...new Set(alerts.map((item) => item?.type).filter(Boolean))].sort(),
  };
}

function sanitizeDashboardCoverage(coverage) {
  return {
    motors: Number(coverage?.motors?.count ?? 0),
    loops: Number(coverage?.loops?.count ?? 0),
    swarms: Number(coverage?.swarms?.count ?? 0),
    aia: Number(coverage?.aia?.count ?? 0),
    elrSections: normalizeCoverageSections(coverage?.elrSections),
  };
}

function sanitizeDashboardCanonDrift(drift) {
  return {
    driftDetected: drift?.hasDrift === true,
    blockDeployment: drift?.blockDeployment === true,
    driftCount: Number(drift?.driftCount ?? 0),
    actorsScanned: Number(drift?.actorsScanned ?? 0),
    documentedExceptionCount: Array.isArray(drift?.documentedExceptions)
      ? drift.documentedExceptions.length
      : 0,
  };
}

function sanitizeConstitutionalMetrics(metrics) {
  return {
    ppCount: Number(metrics?.pp?.count ?? 0),
    lffCount: Number(metrics?.lff?.count ?? 0),
    pConstCount: Number(metrics?.pConst?.count ?? 0),
    ffoLawsCount: Number(metrics?.ffoLaws?.count ?? 0),
    omcMotorsConstitutional: Number(metrics?.omcMotorsConstitutional ?? 0),
  };
}

function averageNumber(values) {
  const list = values.filter((value) => typeof value === "number");
  if (list.length === 0) return null;
  return Math.round((list.reduce((sum, value) => sum + value, 0) / list.length) * 1000) / 1000;
}

function sumNumbers(values) {
  return values.reduce((sum, value) => sum + Number(value ?? 0), 0);
}

function buildGovernanceRecordSet(records) {
  return records.map((record) => {
    const maturity = buildMaturityMetrics(record);
    const compliance = buildCompliancePanel(record);
    const coverage = buildCoveragePanel(record);
    const canonDrift = detectCanonDrift(record);
    return {
      record,
      maturity: sanitizeDashboardMaturity(maturity),
      compliance: sanitizeDashboardCompliance(compliance),
      coverage: sanitizeDashboardCoverage(coverage),
      canonDrift: sanitizeDashboardCanonDrift(canonDrift),
    };
  });
}

function buildRegistry(registryRoot) {
  return new FactoryRegistry({
    store: new FileElrStore(registryRoot),
  });
}

function readAllRecords(registryRoot) {
  const listing = listExpedienteKeysReadOnly(registryRoot);
  const warnings = [];
  let registry;
  try {
    registry = buildRegistry(registryRoot);
  } catch (error) {
    return {
      ok: false,
      listing,
      warnings: [`FactoryRegistry unavailable: ${sanitizeMessage(error?.message ?? error)}`],
      errorCode: "registry_unavailable",
    };
  }

  const records = [];
  for (const key of listing.keys) {
    const { record, error } = readExpedienteSafe(registry, key, registryRoot);
    if (!record) {
      return {
        ok: false,
        listing,
        warnings: [`Unreadable expediente: ${sanitizeMessage(`${key}:${error ?? "unknown"}`)}`],
        errorCode: "record_unreadable",
      };
    }
    records.push(record);
  }

  return { ok: true, listing, registry, records, warnings };
}

export class ReadOnlyFactoryReadPort {
  constructor(options = {}) {
    this.registryRoot = options.registryRoot ?? DEFAULT_REGISTRY_ROOT;
  }

  probeReadiness() {
    const scan = readAllRecords(this.registryRoot);
    const empty = scan.listing.keys.length === 0;
    if (!scan.ok) {
      return {
        ok: false,
        httpStatus: 503,
        observationStatus: "UNAVAILABLE",
        payload: {
          ready: false,
          empty,
          observationStatus: "UNAVAILABLE",
          warnings: toWarningList(scan.warnings),
        },
        warnings: toWarningList(scan.warnings),
      };
    }
    const warnings = [];
    if (!scan.listing.rootExists) warnings.push("ELR registry root absent; empty-state accepted.");
    if (scan.listing.rootExists && !scan.listing.expedientesDirExists) {
      warnings.push("ELR expedientes directory absent; empty-state accepted.");
    }
    if (empty) warnings.push("Registry currently empty.");
    return {
      ok: true,
      httpStatus: 200,
      observationStatus: "HEALTHY",
      payload: {
        ready: true,
        empty,
        observationStatus: "HEALTHY",
        warnings: toWarningList(warnings),
      },
      warnings: toWarningList(warnings),
    };
  }

  readRegistrySummary() {
    const listing = listExpedienteKeysReadOnly(this.registryRoot);
    const keySample = listing.keys.slice(0, 10);
    const warnings = [];
    if (!listing.rootExists) warnings.push("Registry root absent; reporting valid empty-state.");
    if (listing.rootExists && !listing.expedientesDirExists) {
      warnings.push("Expedientes directory absent; reporting valid empty-state.");
    }
    return {
      observationStatus: "HEALTHY",
      payload: {
        available: listing.rootExists || listing.expedientesDirExists,
        empty: listing.keys.length === 0,
        expedienteCount: listing.keys.length,
        keysTruncated: listing.keys.length > keySample.length,
        keySample,
        warnings: toWarningList(warnings),
      },
      warnings: toWarningList(warnings),
    };
  }

  readElrSummary() {
    const scan = readAllRecords(this.registryRoot);
    if (!scan.ok) {
      return {
        ok: false,
        httpStatus: 503,
        observationStatus: "UNAVAILABLE",
        payload: {
          available: false,
          empty: scan.listing.keys.length === 0,
          expedienteCount: 0,
          status: "DEGRADED",
          sectionCounts: {},
          eventKindCounts: {},
          warnings: toWarningList(scan.warnings),
        },
        warnings: toWarningList(scan.warnings),
      };
    }

    const sectionCounts = {};
    const eventKinds = [];
    for (const record of scan.records) {
      const summary = aggregateElr(record);
      for (const [key, value] of Object.entries(summary.sections ?? {})) {
        sectionCounts[key] = (sectionCounts[key] ?? 0) + Number(value ?? 0);
      }
      eventKinds.push(...extractFfoEventKinds(record));
    }

    const warnings = [];
    if (scan.records.length === 0) warnings.push("No expedientes available.");
    return {
      ok: true,
      httpStatus: 200,
      observationStatus: scan.records.length === 0 ? "PARTIAL" : "HEALTHY",
      payload: {
        available: scan.listing.rootExists || scan.listing.expedientesDirExists,
        empty: scan.records.length === 0,
        expedienteCount: scan.records.length,
        status: scan.records.length === 0 ? "MISSING_OR_EMPTY" : "OK",
        sectionCounts,
        eventKindCounts: countBy(eventKinds),
        warnings: toWarningList(warnings),
      },
      warnings: toWarningList(warnings),
    };
  }

  readGovernanceDashboard() {
    const scan = readAllRecords(this.registryRoot);
    if (!scan.ok) {
      return {
        ok: false,
        httpStatus: 503,
        observationStatus: "UNAVAILABLE",
        payload: {
          maturity: {},
          compliance: {},
          coverage: {},
          canonDrift: {},
          constitutional: sanitizeConstitutionalMetrics(buildConstitutionalMetrics()),
          warnings: toWarningList(scan.warnings),
        },
        warnings: toWarningList(scan.warnings),
      };
    }

    const record = scan.records[0] ?? null;
    const warnings = [];
    if (!record) {
      warnings.push("No expedientes available for governance panels.");
      return {
        ok: true,
        httpStatus: 200,
        observationStatus: "PARTIAL",
        payload: {
          maturity: {},
          compliance: {},
          coverage: {},
          canonDrift: {},
          constitutional: sanitizeConstitutionalMetrics(buildConstitutionalMetrics()),
          warnings: toWarningList(warnings),
        },
        warnings: toWarningList(warnings),
      };
    }

    const set = buildGovernanceRecordSet(scan.records);
    const totalCoverageSections = {};
    for (const key of FACTORY_EDGE_GOVERNANCE_ALLOWLISTS.dashboard.coverageSections) {
      totalCoverageSections[key] = sumNumbers(set.map((item) => item.coverage.elrSections[key]));
    }
    const alertTypes = [...new Set(set.flatMap((item) => item.compliance.alertTypes))].sort();
    const gates = set.map((item) => item.maturity.gates);
    const maturityScores = set.map((item) => item.maturity.maturityScore);
    return {
      ok: true,
      httpStatus: 200,
      observationStatus: set.some((item) => item.canonDrift.blockDeployment) ? "DEGRADED" : "HEALTHY",
      payload: {
        maturity: {
          maturityScore: averageNumber(maturityScores),
          source: "CB18_MULTI_EXPEDIENTE_SUMMARY",
          rule: "LFF-12",
          g0g6Reproducible: gates.every((gate) => gate.reproducible === true),
          bands: {
            completeness: averageNumber(set.map((item) => item.maturity.bands.completeness)),
            sufficiency: averageNumber(set.map((item) => item.maturity.bands.sufficiency)),
            readiness: averageNumber(set.map((item) => item.maturity.bands.readiness)),
            cGlobal: averageNumber(set.map((item) => item.maturity.bands.cGlobal)),
            stateBonus: averageNumber(set.map((item) => item.maturity.bands.stateBonus)),
          },
          gates: {
            available: gates.every((gate) => gate.available === true),
            allPass: gates.every((gate) => gate.allPass === true),
            passCount: sumNumbers(gates.map((gate) => gate.passCount)),
            gateCount: sumNumbers(gates.map((gate) => gate.gateCount)),
            reproducible: gates.every((gate) => gate.reproducible === true),
          },
        },
        compliance: {
          healthy: set.every((item) => item.compliance.healthy === true),
          p0Status: set.every((item) => item.compliance.p0Status === "PASS") ? "PASS" : "MIXED",
          prhZero: set.every((item) => item.compliance.prhZero === true),
          prhViolationCount: sumNumbers(set.map((item) => item.compliance.prhViolationCount)),
          cmpBlockCount: sumNumbers(set.map((item) => item.compliance.cmpBlockCount)),
          alertCount: sumNumbers(set.map((item) => item.compliance.alertCount)),
          alertTypes,
        },
        coverage: {
          motors: Math.max(...set.map((item) => item.coverage.motors), 0),
          loops: Math.max(...set.map((item) => item.coverage.loops), 0),
          swarms: Math.max(...set.map((item) => item.coverage.swarms), 0),
          aia: Math.max(...set.map((item) => item.coverage.aia), 0),
          elrSections: totalCoverageSections,
        },
        canonDrift: {
          driftDetected: set.some((item) => item.canonDrift.driftDetected),
          blockDeployment: set.some((item) => item.canonDrift.blockDeployment),
          driftCount: sumNumbers(set.map((item) => item.canonDrift.driftCount)),
          actorsScanned: sumNumbers(set.map((item) => item.canonDrift.actorsScanned)),
          documentedExceptionCount: sumNumbers(
            set.map((item) => item.canonDrift.documentedExceptionCount)
          ),
        },
        constitutional: sanitizeConstitutionalMetrics(buildConstitutionalMetrics()),
        warnings: toWarningList(warnings),
      },
      warnings: toWarningList(warnings),
    };
  }

  readGovernanceDrift() {
    const scan = readAllRecords(this.registryRoot);
    if (!scan.ok) {
      return {
        ok: false,
        httpStatus: 503,
        observationStatus: "UNAVAILABLE",
        payload: {
          driftDetected: false,
          findings: [],
          warnings: toWarningList(scan.warnings),
        },
        warnings: toWarningList(scan.warnings),
      };
    }
    if (scan.records.length === 0) {
      return {
        ok: true,
        httpStatus: 200,
        observationStatus: "PARTIAL",
        payload: {
          driftDetected: false,
          findings: [],
          warnings: ["No expedientes available for drift scan."],
        },
        warnings: ["No expedientes available for drift scan."],
      };
    }
    const reports = scan.records.map((record) => detectCanonDrift(record));
    return {
      ok: true,
      httpStatus: 200,
      observationStatus: reports.some((report) => report.blockDeployment) ? "DEGRADED" : "HEALTHY",
      payload: {
        driftDetected: reports.some((report) => report.hasDrift === true),
        findings: reports.flatMap((report) =>
          (report.drifted ?? []).map((item) => ({
            code: item.actor,
            severity: "ERROR",
            message: sanitizeMessage(item.reason ?? "out_of_catalog"),
          }))
        ),
        warnings: [],
      },
      warnings: [],
    };
  }

  readGovernanceCompliance() {
    const scan = readAllRecords(this.registryRoot);
    if (!scan.ok) {
      return {
        ok: false,
        httpStatus: 503,
        observationStatus: "UNAVAILABLE",
        payload: {
          summary: {},
          items: [],
          warnings: toWarningList(scan.warnings),
        },
        warnings: toWarningList(scan.warnings),
      };
    }
    if (scan.records.length === 0) {
      const msg = "No expedientes available for compliance panel.";
      return {
        ok: true,
        httpStatus: 200,
        observationStatus: "PARTIAL",
        payload: {
          summary: {},
          items: [],
          warnings: [msg],
        },
        warnings: [msg],
      };
    }
    const summaries = buildGovernanceRecordSet(scan.records).map((item) => item.compliance);
    const alertTypes = [...new Set(summaries.flatMap((item) => item.alertTypes))].sort();
    const summary = {
      healthy: summaries.every((item) => item.healthy === true),
      p0Status: summaries.every((item) => item.p0Status === "PASS") ? "PASS" : "MIXED",
      prhZero: summaries.every((item) => item.prhZero === true),
      prhViolationCount: sumNumbers(summaries.map((item) => item.prhViolationCount)),
      cmpBlockCount: sumNumbers(summaries.map((item) => item.cmpBlockCount)),
      alertCount: sumNumbers(summaries.map((item) => item.alertCount)),
      alertTypes,
    };
    return {
      ok: true,
      httpStatus: 200,
      observationStatus: summary.healthy ? "HEALTHY" : "DEGRADED",
      payload: {
        summary,
        items: [
          {
            code: "P0",
            status: summary.p0Status,
            count: summary.p0Status === "PASS" ? 0 : 1,
            operational: true,
          },
          {
            code: "PRH",
            status: summary.prhZero ? "PASS" : "BLOCK",
            count: summary.prhViolationCount,
            operational: true,
          },
          {
            code: "CMP",
            status: summary.cmpBlockCount === 0 ? "PASS" : "BLOCK",
            count: summary.cmpBlockCount,
            operational: true,
          },
        ],
        warnings: [],
      },
      warnings: [],
    };
  }

  readGovernanceMaturity() {
    const scan = readAllRecords(this.registryRoot);
    if (!scan.ok) {
      return {
        ok: false,
        httpStatus: 503,
        observationStatus: "UNAVAILABLE",
        payload: {
          maturityScore: null,
          bands: {},
          coverageHints: {},
          warnings: toWarningList(scan.warnings),
        },
        warnings: toWarningList(scan.warnings),
      };
    }
    if (scan.records.length === 0) {
      const msg = "No expedientes available for maturity panel.";
      return {
        ok: true,
        httpStatus: 200,
        observationStatus: "PARTIAL",
        payload: {
          maturityScore: null,
          bands: {},
          coverageHints: {},
          warnings: [msg],
        },
        warnings: [msg],
      };
    }
    const normalized = buildGovernanceRecordSet(scan.records).map((item) => item.maturity);
    return {
      ok: true,
      httpStatus: 200,
      observationStatus:
        normalized.some((item) => typeof item.maturityScore === "number") ? "HEALTHY" : "PARTIAL",
      payload: {
        maturityScore: averageNumber(normalized.map((item) => item.maturityScore)),
        bands: {
          completeness: averageNumber(normalized.map((item) => item.bands.completeness)),
          sufficiency: averageNumber(normalized.map((item) => item.bands.sufficiency)),
          readiness: averageNumber(normalized.map((item) => item.bands.readiness)),
          cGlobal: averageNumber(normalized.map((item) => item.bands.cGlobal)),
          stateBonus: averageNumber(normalized.map((item) => item.bands.stateBonus)),
        },
        coverageHints: {
          available: normalized.every((item) => item.gates.available === true),
          allPass: normalized.every((item) => item.gates.allPass === true),
          passCount: sumNumbers(normalized.map((item) => item.gates.passCount)),
          gateCount: sumNumbers(normalized.map((item) => item.gates.gateCount)),
          reproducible: normalized.every((item) => item.gates.reproducible === true),
        },
        warnings: [],
      },
      warnings: [],
    };
  }

  readConstitutionalSpan() {
    return readConstitutionalPhaseSpan();
  }
}

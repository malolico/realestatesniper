/**
 * CB-18 — Governance Dashboard
 *
 * Internal Factory governance view: PP, LFF, P-CONST, maturity,
 * compliance, coverage, canon drift.
 *
 * Data sources (Blueprint): CB-15 operational + CB-01 ELR only.
 * No Web UI, Marketplace, Projection, Decision Engine, or Product Catalog.
 */

import { isPhaseApproved } from "../cb00/constructionGovernance.js";
import { FactoryRegistry } from "../cb01/factoryRegistry.js";
import {
  FFO_CONSTITUTIONAL_LAWS,
  P_CONST_PIPELINE,
  OMC_MOTOR_COUNT_CONSTITUTIONAL,
} from "../cb15/ffoCatalog.js";
import { aggregateElr } from "../cb15/elrAggregator.js";
import { buildMaturityMetrics } from "./maturityMetrics.js";
import { buildCompliancePanel } from "./compliancePanel.js";
import { buildCoveragePanel } from "./coveragePanel.js";
import { assertNoCanonDrift, detectCanonDrift } from "./canonDriftDetector.js";

export const GOVERNANCE_DASHBOARD_ID = "CB-18:GovernanceDashboard";

export const PP_METRICS = Object.freeze([
  "PP-01", "PP-02", "PP-03", "PP-04", "PP-05",
  "PP-06", "PP-07", "PP-08", "PP-09", "PP-10",
  "PP-11", "PP-12", "PP-13", "PP-14", "PP-15",
]);

export const LFF_METRICS = Object.freeze([
  "LFF-01", "LFF-02", "LFF-03", "LFF-04", "LFF-05",
  "LFF-06", "LFF-07", "LFF-08", "LFF-09", "LFF-10",
  "LFF-11", "LFF-12", "LFF-13", "LFF-14", "LFF-15",
  "LFF-16", "LFF-17", "LFF-18", "LFF-19", "LFF-20",
]);

/**
 * Constitutional metric strips for Director / governance audit.
 */
export function buildConstitutionalMetrics() {
  return {
    pp: {
      count: PP_METRICS.length,
      codes: PP_METRICS,
    },
    lff: {
      count: LFF_METRICS.length,
      codes: LFF_METRICS,
      maturityRule: "LFF-12",
    },
    pConst: {
      count: P_CONST_PIPELINE.length,
      pipeline: P_CONST_PIPELINE.map((p) => ({ code: p.code, label: p.label, priority: p.priority })),
    },
    ffoLaws: {
      count: FFO_CONSTITUTIONAL_LAWS.length,
      codes: FFO_CONSTITUTIONAL_LAWS,
    },
    omcMotorsConstitutional: OMC_MOTOR_COUNT_CONSTITUTIONAL,
  };
}

export class GovernanceDashboard {
  /**
   * @param {{ registry?: FactoryRegistry }} [deps]
   */
  constructor(deps = {}) {
    if (!isPhaseApproved("CB-17")) {
      throw new Error(
        "[CB-18 Governance Dashboard] CB-17 must be APPROVED before Governance Dashboard"
      );
    }
    this.registry = deps.registry ?? new FactoryRegistry();
    this.dashboardId = GOVERNANCE_DASHBOARD_ID;
  }

  /**
   * Build full governance report for one expediente (CB-01 ELR).
   * @param {string} factoryKey
   * @param {object} [maturityHints]
   */
  buildExpedienteReport(factoryKey, maturityHints = {}) {
    const record = this.registry.getExpediente(factoryKey);
    if (!record) {
      throw new Error(`[CB-18 Governance Dashboard] Expediente not found: ${factoryKey}`);
    }

    const maturity = buildMaturityMetrics(record, maturityHints);
    const compliance = buildCompliancePanel(record);
    const coverage = buildCoveragePanel(record);
    const canonDrift = detectCanonDrift(record);
    const elrSnapshot = aggregateElr(record);

    return {
      dashboardId: this.dashboardId,
      factory_key: factoryKey,
      state: record.state,
      generatedAt: new Date().toISOString(),
      constitutional: buildConstitutionalMetrics(),
      maturity,
      compliance,
      coverage,
      canonDrift,
      elrSnapshot,
      scope: {
        internalFactoryOnly: true,
        web: false,
        marketplace: false,
        projection: false,
        productCatalog: false,
        decisionEngine: false,
        newAi: false,
      },
      deploymentAllowed: !canonDrift.blockDeployment,
    };
  }

  /**
   * Multi-expediente dashboard from CB-01 registry keys.
   * @param {string[]} [factoryKeys]
   */
  buildDashboard(factoryKeys) {
    const keys = factoryKeys ?? this.registry.listExpedientes();
    const expedientes = keys.map((key) => {
      try {
        return this.buildExpedienteReport(key);
      } catch (err) {
        return { factory_key: key, error: err.message };
      }
    });

    const driftBlocked = expedientes.some((e) => e.canonDrift?.blockDeployment);
    const alerts = expedientes.flatMap((e) => e.compliance?.alerts ?? []);

    return {
      dashboardId: this.dashboardId,
      generatedAt: new Date().toISOString(),
      constitutional: buildConstitutionalMetrics(),
      expedienteCount: expedientes.length,
      expedientes,
      alerts,
      alertsOperational: true,
      canonDriftBlocksDeployment: driftBlocked,
      deploymentAllowed: !driftBlocked,
      scope: {
        internalFactoryOnly: true,
        dataSources: ["CB-01:ELR", "CB-15:operational"],
      },
    };
  }

  /**
   * Gate: refuse deployment when any scanned expediente has canon drift.
   * @param {string[]} factoryKeys
   */
  assertDeploymentGate(factoryKeys) {
    for (const key of factoryKeys) {
      const record = this.registry.getExpediente(key);
      if (!record) continue;
      assertNoCanonDrift(record);
    }
    return { allowed: true, scanned: factoryKeys.length };
  }
}

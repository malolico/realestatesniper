/**
 * P-INT-10 — CI Canon Gate process adapter
 *
 * Orchestrates existing CB dry-run validators + explicit canon drift gate.
 * Does NOT modify Factory / Service Edge / Web / Supabase / Product / Marketplace.
 *
 * Binding (Implementation Plan):
 * - dry-run only
 * - --mark-complete / --approved-by absolutely prohibited
 * - fail-closed on first CB FAIL or blockDeployment
 */

import { spawnSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { detectCanonDrift } from "../../factory/cb18/canonDriftDetector.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
export const REPO_ROOT = path.resolve(__dirname, "../../..");

/** Forbidden CLI flags that mutate construction ledger / approval metadata. */
export const FORBIDDEN_CLI_FLAGS = Object.freeze([
  "--mark-complete",
  "--approved-by",
]);

/**
 * Mandatory CB-00→CB-19 runner catalog (Plan §2.2).
 * Paths are repo-relative; adapter invokes only — does not redefine validators.
 */
export const CB_RUNNERS = Object.freeze([
  { id: "CB-00", relPath: "src/runCb00CanonValidation.js" },
  { id: "CB-01", relPath: "src/runCb01RegistryValidation.js" },
  { id: "CB-02", relPath: "src/runCb02DsoValidation.js" },
  { id: "CB-03", relPath: "src/runCb03ComplianceValidation.js" },
  { id: "CB-04", relPath: "src/runCb04MotorRuntimeValidation.js" },
  { id: "CB-05", relPath: "src/runCb05FoundationValidation.js" },
  { id: "CB-06", relPath: "src/runCb06EvidenceValidation.js" },
  { id: "CB-07", relPath: "src/runCb07LegitimacyValidation.js" },
  { id: "CB-08", relPath: "src/runCb08DistressValidation.js" },
  { id: "CB-09", relPath: "src/runCb09EconomyValidation.js" },
  { id: "CB-10", relPath: "src/runCb10EnvironmentValidation.js" },
  { id: "CB-11", relPath: "src/runCb11LoopEngineValidation.js" },
  { id: "CB-12", relPath: "src/runCb12SwarmValidation.js" },
  { id: "CB-13", relPath: "src/runCb13IntelligenceValidation.js" },
  { id: "CB-14", relPath: "src/runCb14AiAssistValidation.js" },
  { id: "CB-15", relPath: "src/runCb15OrchestrationValidation.js" },
  { id: "CB-16", relPath: "src/factory/cb16/runCb16DecisionValidation.js" },
  { id: "CB-17", relPath: "src/factory/cb17/runCb17WatchValidation.js" },
  { id: "CB-18", relPath: "src/factory/cb18/runCb18GovernanceValidation.js" },
  { id: "CB-19", relPath: "src/factory/cb19/runCb19CompletionValidation.js" },
]);

export const PHASE_STATUS_REL_PATH =
  "docs/factory-construction/phases/construction-phase-status.json";

/**
 * Reject any argv that would mutate the construction ledger.
 * @param {string[]} argv
 * @returns {{ ok: true } | { ok: false, reason: string, flag: string }}
 */
export function assertSafeGateArgs(argv = []) {
  const args = Array.isArray(argv) ? argv : [];
  for (const flag of FORBIDDEN_CLI_FLAGS) {
    if (args.includes(flag)) {
      return {
        ok: false,
        reason: `Forbidden ledger-mutating flag in gate execution: ${flag}`,
        flag,
      };
    }
  }
  return { ok: true };
}

/**
 * Sanitize drift report for operational channels (no stacks / secrets).
 * @param {ReturnType<typeof detectCanonDrift>} report
 */
export function sanitizeDriftReport(report) {
  return {
    factory_key: report.factory_key ?? null,
    actorsScanned: report.actorsScanned,
    catalogedCount: report.catalogedCount,
    driftCount: report.driftCount,
    drifted: (report.drifted ?? []).map((d) => ({
      actor: d.actor,
      reason: d.reason,
    })),
    documentedExceptions: report.documentedExceptions ?? [],
    hasDrift: Boolean(report.hasDrift),
    blockDeployment: Boolean(report.blockDeployment),
    rule: report.rule,
  };
}

/**
 * Explicit canon drift gate (Plan §2.3).
 * @param {object} record CB-01-shaped expediente record
 * @param {{ extraActors?: string[] }} [options]
 */
export function evaluateCanonDriftGate(record, options = {}) {
  const report = detectCanonDrift(record, options);
  const sanitized = sanitizeDriftReport(report);
  return {
    passed: !sanitized.blockDeployment,
    report: sanitized,
  };
}

/**
 * Default child-process runner — always dry-run (no extra CLI flags).
 * @param {{ id: string, relPath: string }} runner
 * @param {{ cwd?: string, nodeBin?: string, timeoutMs?: number }} [opts]
 */
export function spawnCbRunnerDryRun(runner, opts = {}) {
  const cwd = opts.cwd ?? REPO_ROOT;
  const nodeBin = opts.nodeBin ?? process.execPath;
  const absScript = path.join(cwd, runner.relPath);

  if (!fs.existsSync(absScript)) {
    return {
      id: runner.id,
      relPath: runner.relPath,
      passed: false,
      exitCode: 127,
      dryRun: true,
      argv: [],
      error: `Runner script missing: ${runner.relPath}`,
    };
  }

  // Absolute prohibition: never pass forbidden flags.
  const argv = [absScript];
  const safety = assertSafeGateArgs(argv);
  if (!safety.ok) {
    return {
      id: runner.id,
      relPath: runner.relPath,
      passed: false,
      exitCode: 2,
      dryRun: true,
      argv,
      error: safety.reason,
    };
  }

  const result = spawnSync(nodeBin, argv, {
    cwd,
    encoding: "utf8",
    timeout: opts.timeoutMs ?? 600_000,
    env: { ...process.env },
  });

  const exitCode = result.status === null ? 1 : result.status;
  return {
    id: runner.id,
    relPath: runner.relPath,
    passed: exitCode === 0,
    exitCode,
    dryRun: true,
    argv: [runner.relPath],
    signal: result.signal ?? null,
    error:
      result.error?.message ??
      (exitCode === 0 ? null : `Runner ${runner.id} exited with code ${exitCode}`),
  };
}

/**
 * Run the CI Canon Gate.
 *
 * @param {{
 *   argv?: string[],
 *   runRunner?: (runner: { id: string, relPath: string }) =>
 *     | { id: string, relPath: string, passed: boolean, exitCode?: number, dryRun?: boolean, argv?: string[], error?: string|null }
 *     | Promise<...>,
 *   driftRecords?: object[],
 *   skipCbSweep?: boolean,
 *   cwd?: string,
 * }} [options]
 */
export async function runCiCanonGate(options = {}) {
  const argv = options.argv ?? [];
  const precheck = assertSafeGateArgs(argv);
  if (!precheck.ok) {
    return {
      passed: false,
      phase: "precheck",
      reason: precheck.reason,
      forbiddenFlag: precheck.flag,
      runners: [],
      drift: null,
    };
  }

  /** @type {Array<object>} */
  const runnerResults = [];

  if (!options.skipCbSweep) {
    const runRunner =
      options.runRunner ??
      ((runner) => spawnCbRunnerDryRun(runner, { cwd: options.cwd ?? REPO_ROOT }));

    for (const runner of CB_RUNNERS) {
      const result = await runRunner(runner);

      // Defense in depth: reject any injectable that smuggled forbidden flags.
      const argvUsed = result.argv ?? [];
      const argSafety = assertSafeGateArgs(argvUsed);
      if (!argSafety.ok) {
        runnerResults.push({
          ...result,
          passed: false,
          error: argSafety.reason,
        });
        return {
          passed: false,
          phase: "cb_sweep",
          reason: argSafety.reason,
          failedRunner: runner.id,
          runners: runnerResults,
          drift: null,
        };
      }

      if (result.dryRun === false) {
        runnerResults.push({
          ...result,
          passed: false,
          error: "Non-dry-run invocation is prohibited",
        });
        return {
          passed: false,
          phase: "cb_sweep",
          reason: "Non-dry-run invocation is prohibited",
          failedRunner: runner.id,
          runners: runnerResults,
          drift: null,
        };
      }

      runnerResults.push({
        id: result.id ?? runner.id,
        relPath: result.relPath ?? runner.relPath,
        passed: Boolean(result.passed),
        exitCode: result.exitCode ?? (result.passed ? 0 : 1),
        dryRun: result.dryRun !== false,
        error: result.error ?? null,
      });

      if (!result.passed) {
        return {
          passed: false,
          phase: "cb_sweep",
          reason: result.error ?? `Validator ${runner.id} FAILED (fail-closed)`,
          failedRunner: runner.id,
          runners: runnerResults,
          drift: null,
        };
      }
    }
  }

  // Fase B — explicit canon drift gate (Plan §2.3).
  // Default: empty clean ELR (no invented expediente corpus). Callers may supply
  // pilot records already used by CB-18/CB-19 (or poisoned records for negative tests).
  const driftRecords =
    options.driftRecords ??
    [
      {
        factory_key: null,
        elr: {},
      },
    ];

  const driftResults = [];
  for (const record of driftRecords) {
    const evaluated = evaluateCanonDriftGate(record);
    driftResults.push(evaluated);
    if (!evaluated.passed) {
      const actors = evaluated.report.drifted.map((d) => d.actor).join(", ");
      return {
        passed: false,
        phase: "canon_drift",
        reason: `Canon drift blockDeployment — actors: ${actors || "(unknown)"}`,
        failedRunner: null,
        runners: runnerResults,
        drift: {
          passed: false,
          results: driftResults.map((d) => d.report),
        },
      };
    }
  }

  return {
    passed: true,
    phase: "complete",
    reason: null,
    failedRunner: null,
    runners: runnerResults,
    drift: {
      passed: true,
      results: driftResults.map((d) => d.report),
    },
  };
}

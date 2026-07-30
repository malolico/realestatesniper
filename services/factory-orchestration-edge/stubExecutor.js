/**
 * P-INT-01 Slice B2 — Staging stub executor (no CB-15 orchestrateExpediente).
 * Retained for harness / cancel / timeout injection only.
 * SP01-IB-09-IMPL: default JobRunnerCore executor is cb15OrchestrationExecutor
 * (live CB-15 association). Do not treat this stub as CAP-SP01-02 proof.
 * Performs checkpoints so cancelRequested can complete OBS-B1-01.
 * Boundary is enforced by JobRunnerCore via CB-15 public guard before execute.
 */

/**
 * @param {object} job
 * @param {{
 *   checkpoint: (label: string) => Promise<{ cancelled: boolean }>,
 *   isCancelRequested: () => boolean,
 *   sleep?: (ms: number) => Promise<void>
 * }} hooks
 */
export async function runStubOrchestration(job, hooks) {
  const sleep = hooks.sleep || ((ms) => new Promise((r) => setTimeout(r, ms)));

  let cp = await hooks.checkpoint("start");
  if (cp.cancelled || hooks.isCancelRequested()) {
    return { cancelled: true };
  }

  await sleep(5);

  cp = await hooks.checkpoint("mid");
  if (cp.cancelled || hooks.isCancelRequested()) {
    return { cancelled: true };
  }

  await sleep(5);

  cp = await hooks.checkpoint("end");
  if (cp.cancelled || hooks.isCancelRequested()) {
    return { cancelled: true };
  }

  return {
    cancelled: false,
    resultSummary: {
      factoryKey: job.factoryKey,
      orchestrationStatus: "STUB_OK",
      summaryCode: "B2_STUB",
      elr: { mustNotLeak: true },
      decisionPackage: { mustNotLeak: true },
    },
  };
}

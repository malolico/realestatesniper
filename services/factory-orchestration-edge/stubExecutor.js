/**
 * P-INT-01 Slice B2 — Staging stub executor (no CB-15 orchestrateExpediente).
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

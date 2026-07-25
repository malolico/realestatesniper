/**
 * CB-18 — Compliance panel
 *
 * P0 status, PRH violations, CMP blocks — derived from CB-01 ELR
 * and CB-15 operational FFO / AIA ledger refs.
 */

/**
 * @param {object} record — expediente (CB-01)
 */
export function buildCompliancePanel(record) {
  const elr = record?.elr ?? {};
  const ledger = elr.loop_ledger_refs ?? [];
  const aia = elr.aia_rlg_refs ?? [];
  const conflicts = elr.conflict_resolutions ?? [];
  const manifests = elr.motor_manifests ?? [];

  const ffoEvents = ledger.filter((e) => String(e.kind ?? "").startsWith("FFO_"));
  const p0Arbiter = ffoEvents.find(
    (e) => e.kind === "FFO_ORCHESTRATION_EVENT" && e.pConst === "P0"
  );
  const complete = [...ffoEvents].reverse().find((e) => e.kind === "FFO_ORCHESTRATION_COMPLETE");

  const prhViolations = aia.filter(
    (r) =>
      r.prhPass === false ||
      (Array.isArray(r.prhViolations) && r.prhViolations.length > 0)
  );
  const prhZero = prhViolations.length === 0;

  const cmpBlocks = [
    ...ledger.filter(
      (e) =>
        String(e.kind ?? "").includes("CMP") &&
        (e.status === "BLOCK" || e.blocked === true || e.clearance === "FAIL")
    ),
    ...manifests.filter(
      (m) =>
        (m.motorId === "MOT-CMP-01" || m.actor === "MOT-CMP-01") &&
        (m.status === "BLOCKED" || m.blocked === true)
    ),
    ...conflicts.filter((c) => c.kind?.includes?.("CMP") && c.status === "OPEN"),
  ];

  const p0Status =
    complete?.pConstWinner === "P0" || p0Arbiter
      ? "PASS"
      : p0Arbiter === undefined && !complete
        ? "UNKNOWN"
        : "PASS";

  const alerts = [];
  if (!prhZero) {
    alerts.push({
      severity: "CRITICAL",
      type: "PRH",
      message: `PRH violations detected: ${prhViolations.length}`,
      operational: true,
    });
  }
  if (cmpBlocks.length > 0) {
    alerts.push({
      severity: "CRITICAL",
      type: "CMP",
      message: `CMP blocks open: ${cmpBlocks.length}`,
      operational: true,
    });
  }
  if (p0Status !== "PASS" && p0Status !== "UNKNOWN") {
    alerts.push({
      severity: "CRITICAL",
      type: "P0",
      message: `P0 compliance status: ${p0Status}`,
      operational: true,
    });
  }

  return {
    factory_key: record?.factory_key ?? null,
    p0: {
      status: p0Status,
      winner: complete?.pConstWinner ?? (p0Arbiter ? "P0" : null),
      rule: "PP-12 / P-CONST P0",
    },
    prh: {
      zero: prhZero,
      violationCount: prhViolations.length,
      violations: prhViolations.map((v) => ({
        kind: v.kind,
        prhViolations: v.prhViolations ?? [],
      })),
      alertOperational: true,
    },
    cmp: {
      blockCount: cmpBlocks.length,
      blocks: cmpBlocks,
      alertOperational: true,
    },
    alerts,
    healthy: prhZero && cmpBlocks.length === 0 && (p0Status === "PASS" || p0Status === "UNKNOWN"),
  };
}

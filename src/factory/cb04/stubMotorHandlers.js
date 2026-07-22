/**
 * CB-04 — Stub motor handlers for runtime foundation (no business logic)
 */

/** @type {Record<string, (ctx: object) => Promise<object>>} */
export const STUB_MOTOR_HANDLERS = {
  "MOT-IDN-01": async () => ({
    outputs: { identityResolved: true },
    knowledgeDelta: { domain: "01", status: "stub" },
  }),
  "MOT-CMP-01": async () => ({
    outputs: { clearance: "PASS" },
    knowledgeDelta: { compliance: "stub" },
  }),
  "MOT-MOT-01": async () => ({
    outputs: { signalCount: 0 },
    knowledgeDelta: { domain: "08", status: "stub" },
  }),
  "MOT-LIEN-01": async () => ({
    outputs: { lienCount: 0 },
    knowledgeDelta: { domain: "09", status: "stub" },
  }),
  "MOT-EVD-01": async () => ({
    outputs: { sufficiency: true },
    knowledgeDelta: { domain: "42", status: "stub" },
  }),
};

/**
 * @param {string} motorId
 */
export function getStubHandler(motorId) {
  return (
    STUB_MOTOR_HANDLERS[motorId] ??
    (async () => ({
      outputs: { stub: true },
      knowledgeDelta: { motorId, status: "stub_unregistered" },
    }))
  );
}

/**
 * CB-04 — Motor execution manifest schema
 */

import { randomUUID } from "node:crypto";

/**
 * @param {{
 *   motorId: string,
 *   capId: string,
 *   factoryKey: string,
 *   runId?: string,
 *   inputs?: object,
 *   outputs?: object,
 *   knowledgeDelta?: object,
 *   startedAt?: string,
 *   finishedAt?: string,
 *   status?: string,
 *   evidenceIntercept?: boolean,
 * }} params
 */
export function buildMotorManifest(params) {
  const startedAt = params.startedAt ?? new Date().toISOString();
  const finishedAt = params.finishedAt ?? new Date().toISOString();
  return Object.freeze({
    kind: "MOTOR_RUN_MANIFEST",
    runId: params.runId ?? `RUN-${randomUUID()}`,
    motorId: params.motorId,
    capId: params.capId,
    factoryKey: params.factoryKey,
    inputs: params.inputs ?? {},
    outputs: params.outputs ?? {},
    knowledgeDelta: params.knowledgeDelta ?? {},
    status: params.status ?? "SUCCESS",
    startedAt,
    finishedAt,
    durationMs: new Date(finishedAt).getTime() - new Date(startedAt).getTime(),
    evidenceIntercept: params.evidenceIntercept ?? true,
    evidenceRule: "DEP-02",
    constitutionalPhase: "CB-04",
  });
}

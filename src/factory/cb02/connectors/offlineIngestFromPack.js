/**
 * P-INT-02 Offline — pack → DsoIngestionService.ingest (sole acceptance path).
 * MUST NOT call buildSourceRef.
 */

import { DsoIngestionService } from "../dsoIngestionService.js";
import { LIVE_NOT_AUTHORIZED } from "./connectorContract.js";
import { getMaricopaContractByOrganismId } from "./maricopaConnectorContracts.js";
import { loadRecordedPackForIngest } from "./recordedPackLoader.js";
import { validateRecordedPack } from "./recordedPackValidator.js";

/**
 * @param {string} packRoot
 * @param {{
 *   dsoIngestionService?: DsoIngestionService,
 *   provenanceOverrides?: object,
 *   attemptLiveFetch?: boolean,
 * }} [options]
 */
export function offlineIngestFromPack(packRoot, options = {}) {
  if (options.attemptLiveFetch === true) {
    return {
      ok: false,
      reason: LIVE_NOT_AUTHORIZED,
      code: LIVE_NOT_AUTHORIZED,
      results: [],
    };
  }

  const pre = validateRecordedPack(packRoot);
  if (!pre.ok) {
    return { ok: false, reason: pre.reason, results: [] };
  }

  // Guard: any listed contract must refuse live fetch.
  for (const entry of pre.manifest.organisms) {
    const contract = getMaricopaContractByOrganismId(entry.organismId);
    if (!contract) {
      return {
        ok: false,
        reason: `contract_missing_for_organism:${entry.organismId}`,
        results: [],
      };
    }
    try {
      contract.fetchLive();
      return {
        ok: false,
        reason: "live_fetch_did_not_throw",
        code: LIVE_NOT_AUTHORIZED,
        results: [],
      };
    } catch (err) {
      if (!err || err.code !== LIVE_NOT_AUTHORIZED) {
        return {
          ok: false,
          reason: `live_guard_unexpected:${err && err.message}`,
          results: [],
        };
      }
    }
  }

  const loaded = loadRecordedPackForIngest(packRoot, {
    provenanceOverrides: options.provenanceOverrides,
  });
  if (!loaded.ok) {
    return { ok: false, reason: loaded.reason, results: [] };
  }

  const service =
    options.dsoIngestionService ?? new DsoIngestionService();

  const results = [];
  try {
    for (const request of loaded.requests) {
      const verdict = service.ingest(loaded.factoryKey, request);
      results.push({
        organismId: request.organismId,
        accepted: verdict.accepted === true,
        rejectionReason: verdict.rejectionReason ?? null,
        deriveToEvidence: verdict.deriveToEvidence === true,
        sourceRefId: verdict.source_ref?.id ?? null,
        source_ref: verdict.source_ref ?? null,
        verdict,
      });
    }
  } catch (err) {
    return {
      ok: false,
      reason: "ingest_threw",
      errorMessage: err && typeof err.message === "string" ? err.message : String(err),
      results,
    };
  }

  const allAccepted = results.every((r) => r.accepted);
  return {
    ok: allAccepted,
    reason: allAccepted ? null : "one_or_more_rejects",
    factoryKey: loaded.factoryKey,
    results,
    manifest: loaded.manifest,
    // payloads retained only for optional smoke / tests — NOT bound to CB-05
    payloadsByOrganism: loaded.payloadsByOrganism,
  };
}

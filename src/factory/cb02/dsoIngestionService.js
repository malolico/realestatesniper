/**
 * CB-02 — DSO Ingestion Service
 * Orchestrates gate + ledger + ELR audit hook (CB-01).
 */

import { FactoryRegistry } from "../cb01/factoryRegistry.js";
import { FileElrStore } from "../cb01/fileElrStore.js";
import { IngestionLegitimacyGate } from "./ingestionLegitimacyGate.js";
import { SourceIngestionLedger } from "./sourceIngestionLedger.js";
import { SourceRegistry } from "./sourceRegistry.js";
import { isSourceRef } from "./sourceRef.js";

export class DsoIngestionService {
  /**
   * @param {{
   *   registry?: FactoryRegistry,
   *   sourceRegistry?: SourceRegistry,
   *   gate?: IngestionLegitimacyGate,
   *   ledger?: SourceIngestionLedger,
   * }} [deps]
   */
  constructor(deps = {}) {
    this.registry = deps.registry ?? new FactoryRegistry();
    this.sourceRegistry = deps.sourceRegistry ?? new SourceRegistry();
    this.gate = deps.gate ?? new IngestionLegitimacyGate(this.sourceRegistry);
    this.ledger = deps.ledger ?? new SourceIngestionLedger();
  }

  /**
   * @param {string} factoryKey
   * @param {import('./ingestionLegitimacyGate.js').IngestionRequest} request
   */
  ingest(factoryKey, request) {
    const expediente = this.registry.getExpediente(factoryKey);
    if (!expediente) {
      throw new Error(`[CB-02 DSO] Expediente not found: ${factoryKey}`);
    }

    const verdict = this.gate.evaluate({ ...request, factoryKey });

    const ledgerEntry = {
      accepted: verdict.accepted,
      rejectionReason: verdict.rejectionReason ?? null,
      sourceRefId: verdict.source_ref?.id ?? null,
      deriveToEvidence: verdict.deriveToEvidence ?? false,
      organismId: request.organismId,
    };

    this.ledger.append(factoryKey, ledgerEntry);

    if (verdict.accepted && isSourceRef(verdict.source_ref)) {
      this.registry.registerElrAct(
        factoryKey,
        "motor_manifests",
        {
          kind: "DSO_SOURCE_INGEST",
          sourceRef: verdict.source_ref,
          gate: "PASS",
          note: "Interim ELR hook until CB-06 Evidence Service",
        },
        { actor: "MOT-CMP-01" }
      );
    } else if (verdict.rejectionReason) {
      this.registry.registerElrAct(
        factoryKey,
        "conflict_resolutions",
        {
          kind: "DSO_INGEST_REJECTED",
          rejectionReason: verdict.rejectionReason,
          deriveToEvidence: verdict.deriveToEvidence ?? false,
          organismId: request.organismId,
        },
        { actor: "MOT-CMP-01" }
      );
    }

    return verdict;
  }

  getIngestionHistory(factoryKey) {
    return this.ledger.readAll(factoryKey);
  }

  getLineageWithSources(factoryKey) {
    return {
      expediente: this.registry.getLineage(factoryKey),
      ingestions: this.getIngestionHistory(factoryKey),
    };
  }
}

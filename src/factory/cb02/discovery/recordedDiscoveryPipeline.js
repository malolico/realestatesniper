/**
 * SP10 — Recorded Discovery pipeline (CB-02)
 * Recorded Observation → Signal → Candidate → CB05 → CB01 → ELR handoff → STOP
 */

import { FactoryRegistry } from "../../cb01/factoryRegistry.js";
import { FileElrStore } from "../../cb01/fileElrStore.js";
import { buildCanonicalPropertyFact } from "../connectors/canonicalPropertyFactAdapter.js";
import {
  resolvePropertyIdentity,
  PROPERTY_IDENTITY_STATUS,
} from "../../cb05/propertyIdentityResolver.js";
import {
  validateRecordedObservation,
  buildDiscoveryCandidateRef,
} from "./recordedObservationContract.js";
import {
  buildDiscoverySignal,
  DISCOVERY_SIGNAL_STATUS,
} from "./discoverySignalContract.js";
import {
  buildDiscoveryCandidate,
  DISCOVERY_MATERIALITY_STATUS,
} from "./discoveryCandidateContract.js";
import { evaluateDiscoveryMateriality } from "./discoveryMaterialityGate.js";
import { DiscoveryDedupRegistry } from "./discoveryDedupRegistry.js";
import { recordDiscoveryHandoff, hasDiscoveryHandoff } from "./discoveryHandoff.js";

export const RECORDED_DISCOVERY_DISPOSITION = Object.freeze({
  CREATED: "CREATED",
  DUPLICATE: "DUPLICATE",
  REFUSED: "REFUSED",
  INSUFFICIENT: "INSUFFICIENT",
  IDENTITY_BLOCKED: "IDENTITY_BLOCKED",
});

/**
 * Mirror CB-05 MOT-IDN-01 factory key sanitization (consume-only truth).
 * @param {string} raw
 */
export function sanitizeDiscoveryFactoryKey(raw) {
  return String(raw)
    .toLowerCase()
    .replace(/:/g, ".")
    .replace(/[^a-z0-9._-]/g, "-")
    .replace(/-+/g, "-")
    .replace(/\.+/g, ".")
    .replace(/^[^a-z0-9]+/, "k")
    .slice(0, 128);
}

/**
 * @param {object} identity
 */
function resolveDefinitiveFactoryKey(identity) {
  if (identity.status !== PROPERTY_IDENTITY_STATUS.MATCH || !identity.canonicalKey) {
    return null;
  }
  return sanitizeDiscoveryFactoryKey(identity.canonicalKey);
}

/**
 * @param {object} identity
 */
function buildPropertyAnchor(identity) {
  if (!identity?.jurisdiction?.id) return null;
  const strong =
    identity.provisionalParcelId ??
    identity.provisionalApn ??
    identity.conflicts?.parcelIds?.[0] ??
    null;
  if (!strong) return null;
  const norm =
    typeof strong === "string" ? strong.trim().toUpperCase() : null;
  return norm ? `${identity.jurisdiction.id}:${norm}` : null;
}

/**
 * @param {object} recordFields
 * @param {DiscoveryDedupRegistry} dedupRegistry
 */
function persistRegistryRecord(recordFields, dedupRegistry) {
  return dedupRegistry.save(Object.freeze({ ...recordFields }));
}

/**
 * @param {string} observationRoot
 * @param {{
 *   registry?: FactoryRegistry,
 *   dedupRegistry?: DiscoveryDedupRegistry,
 *   ingestedAt?: string,
 *   actor?: string,
 * }} [deps]
 */
export function processRecordedObservation(observationRoot, deps = {}) {
  const ingestedAt = deps.ingestedAt ?? new Date().toISOString();
  const actor = deps.actor ?? "MOT-CMP-01";
  const dedupRegistry = deps.dedupRegistry ?? new DiscoveryDedupRegistry();
  const registry =
    deps.registry ??
    new FactoryRegistry({ store: deps.registryStore ?? new FileElrStore() });

  const validated = validateRecordedObservation(observationRoot);
  if (!validated.ok) {
    return Object.freeze({
      disposition: RECORDED_DISCOVERY_DISPOSITION.REFUSED,
      dedupKey: null,
      signal: null,
      candidate: null,
      identity: null,
      factoryKey: null,
      handoffRecorded: false,
      reason: validated.reason,
    });
  }

  const { manifest, payload, jurisdiction, dedupKey } = validated;
  const candidateRef = buildDiscoveryCandidateRef(manifest.observationId);

  const existing = dedupRegistry.lookup(dedupKey);
  if (existing) {
    dedupRegistry.recordReplay(dedupKey, ingestedAt);
    const signal = buildDiscoverySignal({
      dedupKey,
      observationId: manifest.observationId,
      sourceIdentity: manifest.sourceIdentity,
      jurisdiction,
      observedAt: manifest.observedAt,
      recordedAt: manifest.recordedAt,
      payloadFingerprint: manifest.payloadFingerprint,
      status: DISCOVERY_SIGNAL_STATUS.DUPLICATE,
    });
    const candidate =
      existing.identityStatus && existing.materialityStatus
        ? buildDiscoveryCandidate({
            dedupKey,
            signalId: dedupKey,
            observationId: manifest.observationId,
            observedAt: manifest.observedAt,
            candidateRef,
            materialityStatus: existing.materialityStatus,
            identityStatus: existing.identityStatus,
            canonicalKey: existing.canonicalKey ?? null,
            definitiveKeyCandidate: existing.definitiveKeyCandidate ?? null,
            propertyAnchor: existing.propertyAnchor ?? null,
            factoryKey: existing.factoryKey ?? null,
          })
        : null;

    return Object.freeze({
      disposition: RECORDED_DISCOVERY_DISPOSITION.DUPLICATE,
      dedupKey,
      signal,
      candidate,
      identity: null,
      factoryKey: existing.factoryKey ?? null,
      handoffRecorded: existing.handoffRecorded === true,
      reason: null,
    });
  }

  const signal = buildDiscoverySignal({
    dedupKey,
    observationId: manifest.observationId,
    sourceIdentity: manifest.sourceIdentity,
    jurisdiction,
    observedAt: manifest.observedAt,
    recordedAt: manifest.recordedAt,
    payloadFingerprint: manifest.payloadFingerprint,
    status: DISCOVERY_SIGNAL_STATUS.EMITTED,
  });

  const organismId = manifest.sourceIdentity.organismId;
  const canonicalFact = buildCanonicalPropertyFact({
    payloadsByOrganism: { [organismId]: payload },
    packJurisdictionLabel: manifest.jurisdiction,
  });

  const materiality = evaluateDiscoveryMateriality({ canonicalFact });
  if (materiality.materialityStatus !== DISCOVERY_MATERIALITY_STATUS.MATERIAL) {
    persistRegistryRecord(
      {
        dedupKey,
        observationId: manifest.observationId,
        signalId: dedupKey,
        candidateId: dedupKey,
        factoryKey: null,
        propertyAnchor: null,
        definitiveKeyCandidate: null,
        identityStatus: PROPERTY_IDENTITY_STATUS.UNRESOLVED,
        materialityStatus: DISCOVERY_MATERIALITY_STATUS.INSUFFICIENT,
        canonicalKey: null,
        observedAt: manifest.observedAt,
        recordedAt: manifest.recordedAt,
        firstIngestedAt: ingestedAt,
        lastReplayedAt: ingestedAt,
        replayCount: 1,
        handoffRecorded: false,
      },
      dedupRegistry
    );

    return Object.freeze({
      disposition: RECORDED_DISCOVERY_DISPOSITION.INSUFFICIENT,
      dedupKey,
      signal,
      candidate: null,
      identity: null,
      factoryKey: null,
      handoffRecorded: false,
      reason: materiality.reasons?.join("; ") ?? "insufficient_materiality",
    });
  }

  const identity = resolvePropertyIdentity({ canonicalFact });
  const propertyAnchor = buildPropertyAnchor(identity);
  const definitiveFactoryKey = resolveDefinitiveFactoryKey(identity);

  const candidateBase = {
    dedupKey,
    signalId: dedupKey,
    observationId: manifest.observationId,
    observedAt: manifest.observedAt,
    candidateRef,
    materialityStatus: DISCOVERY_MATERIALITY_STATUS.MATERIAL,
    identityStatus: identity.status,
    canonicalKey: identity.canonicalKey ?? null,
    definitiveKeyCandidate: definitiveFactoryKey,
    propertyAnchor,
    factoryKey: null,
  };

  if (
    identity.status === PROPERTY_IDENTITY_STATUS.NO_MATCH ||
    identity.status === PROPERTY_IDENTITY_STATUS.AMBIGUOUS
  ) {
    const candidate = buildDiscoveryCandidate(candidateBase);
    persistRegistryRecord(
      {
        dedupKey,
        observationId: manifest.observationId,
        signalId: dedupKey,
        candidateId: dedupKey,
        factoryKey: null,
        propertyAnchor,
        definitiveKeyCandidate: definitiveFactoryKey,
        identityStatus: identity.status,
        materialityStatus: DISCOVERY_MATERIALITY_STATUS.MATERIAL,
        canonicalKey: identity.canonicalKey ?? null,
        observedAt: manifest.observedAt,
        recordedAt: manifest.recordedAt,
        firstIngestedAt: ingestedAt,
        lastReplayedAt: ingestedAt,
        replayCount: 1,
        handoffRecorded: false,
      },
      dedupRegistry
    );

    return Object.freeze({
      disposition: RECORDED_DISCOVERY_DISPOSITION.IDENTITY_BLOCKED,
      dedupKey,
      signal,
      candidate,
      identity,
      factoryKey: null,
      handoffRecorded: false,
      reason: (identity.reasons ?? []).join("; ") || "identity_blocked",
    });
  }

  let factoryKey = null;
  let handoffRecorded = false;

  if (identity.status === PROPERTY_IDENTITY_STATUS.MATCH) {
    const definitive = definitiveFactoryKey;
    const byDefinitive = dedupRegistry.findByDefinitiveKey(definitive);
    if (byDefinitive?.factoryKey) {
      factoryKey = byDefinitive.factoryKey;
      handoffRecorded = byDefinitive.handoffRecorded === true;
    } else {
      const created = registry.createExpediente({ candidateRef, actor });
      registry.resolveFactoryKey(created.factory_key, definitive, {
        actor,
        reason: "sp10_discovery_identity_match",
      });
      factoryKey = definitive;
      recordDiscoveryHandoff(registry, factoryKey, {
        observationId: manifest.observationId,
        dedupKey,
        candidateId: dedupKey,
        observedAt: manifest.observedAt,
        identityStatus: identity.status,
        canonicalKey: identity.canonicalKey ?? null,
        definitiveKeyCandidate: definitive,
        propertyAnchor: null,
      }, { actor });
      handoffRecorded = true;
    }
  } else if (identity.status === PROPERTY_IDENTITY_STATUS.UNRESOLVED) {
    const byAnchor = propertyAnchor
      ? dedupRegistry.findByPropertyAnchor(propertyAnchor)
      : null;
    if (byAnchor?.factoryKey) {
      factoryKey = byAnchor.factoryKey;
      handoffRecorded = byAnchor.handoffRecorded === true;
    } else {
      const created = registry.createExpediente({ candidateRef, actor });
      factoryKey = created.factory_key;
      recordDiscoveryHandoff(registry, factoryKey, {
        observationId: manifest.observationId,
        dedupKey,
        candidateId: dedupKey,
        observedAt: manifest.observedAt,
        identityStatus: identity.status,
        canonicalKey: identity.canonicalKey ?? null,
        definitiveKeyCandidate: null,
        propertyAnchor,
      }, { actor });
      handoffRecorded = true;
    }
  }

  const candidate = buildDiscoveryCandidate({
    ...candidateBase,
    factoryKey,
  });

  const lineage = factoryKey ? registry.getLineage(factoryKey) : null;
  if (factoryKey && !handoffRecorded && hasDiscoveryHandoff(lineage?.elr)) {
    handoffRecorded = true;
  }

  persistRegistryRecord(
    {
      dedupKey,
      observationId: manifest.observationId,
      signalId: dedupKey,
      candidateId: dedupKey,
      factoryKey,
      propertyAnchor,
      definitiveKeyCandidate: definitiveFactoryKey,
      identityStatus: identity.status,
      materialityStatus: DISCOVERY_MATERIALITY_STATUS.MATERIAL,
      canonicalKey: identity.canonicalKey ?? null,
      observedAt: manifest.observedAt,
      recordedAt: manifest.recordedAt,
      firstIngestedAt: ingestedAt,
      lastReplayedAt: ingestedAt,
      replayCount: 1,
      handoffRecorded,
    },
    dedupRegistry
  );

  return Object.freeze({
    disposition: RECORDED_DISCOVERY_DISPOSITION.CREATED,
    dedupKey,
    signal,
    candidate,
    identity,
    factoryKey,
    handoffRecorded,
    reason: null,
  });
}

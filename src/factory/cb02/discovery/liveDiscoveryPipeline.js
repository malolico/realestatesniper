/**
 * SP11-P1-B — LIVE sibling Discovery pipeline (CB-02)
 * Guard → injected transport → LIVE observation/signal → shared Discovery → STOP at handoff.
 * Zero-network. No HTTP. No token. No SP10 recorded helpers.
 */

import { FactoryRegistry } from "../../cb01/factoryRegistry.js";
import { FileElrStore } from "../../cb01/fileElrStore.js";
import {
  PROPERTY_IDENTITY_STATUS,
  resolvePropertyIdentity,
} from "../../cb05/propertyIdentityResolver.js";
import { buildCanonicalPropertyFact } from "../connectors/canonicalPropertyFactAdapter.js";
import {
  DISCOVERY_MATERIALITY_STATUS,
  buildDiscoveryCandidate,
} from "./discoveryCandidateContract.js";
import { DiscoveryDedupRegistry } from "./discoveryDedupRegistry.js";
import { hasDiscoveryHandoff, recordDiscoveryHandoff } from "./discoveryHandoff.js";
import { evaluateDiscoveryMateriality } from "./discoveryMaterialityGate.js";
import {
  DEFAULT_LIVE_AUTHORIZATION_ENVELOPE,
  LIVE_EXECUTION_NOT_AUTHORIZED,
  LIVE_HTTP_FORBIDDEN,
  gateLiveTransport,
} from "./liveExecutionGuard.js";
import {
  LIVE_ORGANISM_ID,
  LIVE_SOURCE_MODE,
  buildLiveObservation,
  wrapLiveDiscoverySignal,
} from "./liveObservationContract.js";
import { sanitizeDiscoveryFactoryKey } from "./recordedDiscoveryPipeline.js";

export const LIVE_DISCOVERY_DISPOSITION = Object.freeze({
  CREATED: "CREATED",
  DUPLICATE: "DUPLICATE",
  REFUSED: "REFUSED",
  INSUFFICIENT: "INSUFFICIENT",
  IDENTITY_BLOCKED: "IDENTITY_BLOCKED",
});

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
  const norm = typeof strong === "string" ? strong.trim().toUpperCase() : null;
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
 * @param {string} reason
 * @param {string} [code]
 */
function refused(reason, code = LIVE_HTTP_FORBIDDEN) {
  return Object.freeze({
    disposition: LIVE_DISCOVERY_DISPOSITION.REFUSED,
    dedupKey: null,
    signal: null,
    candidate: null,
    identity: null,
    factoryKey: null,
    handoffRecorded: false,
    reason,
    code,
  });
}

/**
 * Sibling LIVE Discovery pipeline.
 *
 * @param {{
 *   envelope?: object,
 *   request?: unknown,
 *   transport?: (request?: unknown) => object,
 * }} [input]
 * @param {{
 *   transport?: (request?: unknown) => object,
 *   registry?: FactoryRegistry,
 *   registryStore?: FileElrStore,
 *   dedupRegistry?: DiscoveryDedupRegistry,
 *   ingestedAt?: string,
 *   actor?: string,
 * }} [deps]
 */
export function processLiveObservation(input = {}, deps = {}) {
  const ingestedAt = deps.ingestedAt ?? new Date().toISOString();
  const actor = deps.actor ?? "MOT-CMP-01";
  const envelope = input.envelope ?? DEFAULT_LIVE_AUTHORIZATION_ENVELOPE;
  const transport = deps.transport ?? input.transport;
  const dedupRegistry = deps.dedupRegistry ?? new DiscoveryDedupRegistry();
  const registry =
    deps.registry ??
    new FactoryRegistry({ store: deps.registryStore ?? new FileElrStore() });

  const gated = gateLiveTransport(envelope, transport, input.request);
  if (!gated.ok) {
    return refused(
      gated.reason ?? LIVE_EXECUTION_NOT_AUTHORIZED,
      gated.code ?? LIVE_HTTP_FORBIDDEN
    );
  }

  const mock = gated.result && typeof gated.result === "object" ? gated.result : {};
  const built = buildLiveObservation({
    apn: mock.apn,
    rawApn: mock.rawApn,
    receivedAt: mock.receivedAt,
    observedAt: mock.observedAt,
    payload: mock.payload,
  });
  if (!built.ok) {
    return refused(built.reason, LIVE_EXECUTION_NOT_AUTHORIZED);
  }

  const { observation } = built;
  const signal = wrapLiveDiscoverySignal(observation);
  const { dedupKey, payload } = observation;
  const candidateRef = observation.candidateRef;

  const existing = dedupRegistry.lookup(dedupKey);
  if (existing) {
    dedupRegistry.recordReplay(dedupKey, ingestedAt);
    const candidate =
      existing.identityStatus && existing.materialityStatus
        ? buildDiscoveryCandidate({
            dedupKey,
            signalId: dedupKey,
            observationId: observation.observationId,
            observedAt: observation.observedAt,
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
      disposition: LIVE_DISCOVERY_DISPOSITION.DUPLICATE,
      observation,
      dedupKey,
      signal,
      candidate,
      identity: null,
      factoryKey: existing.factoryKey ?? null,
      handoffRecorded: existing.handoffRecorded === true,
      reason: null,
      code: null,
    });
  }

  const canonicalFact = buildCanonicalPropertyFact({
    payloadsByOrganism: { [LIVE_ORGANISM_ID]: payload },
  });
  const materiality = evaluateDiscoveryMateriality({ canonicalFact });
  if (materiality.materialityStatus !== DISCOVERY_MATERIALITY_STATUS.MATERIAL) {
    persistRegistryRecord(
      {
        dedupKey,
        observationId: observation.observationId,
        signalId: dedupKey,
        candidateId: dedupKey,
        factoryKey: null,
        propertyAnchor: null,
        definitiveKeyCandidate: null,
        identityStatus: PROPERTY_IDENTITY_STATUS.UNRESOLVED,
        materialityStatus: DISCOVERY_MATERIALITY_STATUS.INSUFFICIENT,
        canonicalKey: null,
        observedAt: observation.observedAt,
        receivedAt: observation.receivedAt,
        sourceMode: LIVE_SOURCE_MODE,
        firstIngestedAt: ingestedAt,
        lastReplayedAt: ingestedAt,
        replayCount: 1,
        handoffRecorded: false,
      },
      dedupRegistry
    );

    return Object.freeze({
      disposition: LIVE_DISCOVERY_DISPOSITION.INSUFFICIENT,
      observation,
      dedupKey,
      signal,
      candidate: null,
      identity: null,
      factoryKey: null,
      handoffRecorded: false,
      reason: materiality.reasons?.join("; ") ?? "insufficient_materiality",
      code: null,
    });
  }

  const identity = resolvePropertyIdentity({ canonicalFact });
  const propertyAnchor = buildPropertyAnchor(identity);
  const definitiveFactoryKey = resolveDefinitiveFactoryKey(identity);

  const candidateBase = {
    dedupKey,
    signalId: dedupKey,
    observationId: observation.observationId,
    observedAt: observation.observedAt,
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
        observationId: observation.observationId,
        signalId: dedupKey,
        candidateId: dedupKey,
        factoryKey: null,
        propertyAnchor,
        definitiveKeyCandidate: definitiveFactoryKey,
        identityStatus: identity.status,
        materialityStatus: DISCOVERY_MATERIALITY_STATUS.MATERIAL,
        canonicalKey: identity.canonicalKey ?? null,
        observedAt: observation.observedAt,
        receivedAt: observation.receivedAt,
        sourceMode: LIVE_SOURCE_MODE,
        firstIngestedAt: ingestedAt,
        lastReplayedAt: ingestedAt,
        replayCount: 1,
        handoffRecorded: false,
      },
      dedupRegistry
    );

    return Object.freeze({
      disposition: LIVE_DISCOVERY_DISPOSITION.IDENTITY_BLOCKED,
      observation,
      dedupKey,
      signal,
      candidate,
      identity,
      factoryKey: null,
      handoffRecorded: false,
      reason: (identity.reasons ?? []).join("; ") || "identity_blocked",
      code: null,
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
        reason: "sp11_p1b_discovery_identity_match",
      });
      factoryKey = definitive;
      recordDiscoveryHandoff(
        registry,
        factoryKey,
        {
          observationId: observation.observationId,
          dedupKey,
          candidateId: dedupKey,
          observedAt: observation.observedAt,
          identityStatus: identity.status,
          canonicalKey: identity.canonicalKey ?? null,
          definitiveKeyCandidate: definitive,
          propertyAnchor: null,
        },
        { actor }
      );
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
      recordDiscoveryHandoff(
        registry,
        factoryKey,
        {
          observationId: observation.observationId,
          dedupKey,
          candidateId: dedupKey,
          observedAt: observation.observedAt,
          identityStatus: identity.status,
          canonicalKey: identity.canonicalKey ?? null,
          definitiveKeyCandidate: null,
          propertyAnchor,
        },
        { actor }
      );
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
      observationId: observation.observationId,
      signalId: dedupKey,
      candidateId: dedupKey,
      factoryKey,
      propertyAnchor,
      definitiveKeyCandidate: definitiveFactoryKey,
      identityStatus: identity.status,
      materialityStatus: DISCOVERY_MATERIALITY_STATUS.MATERIAL,
      canonicalKey: identity.canonicalKey ?? null,
      observedAt: observation.observedAt,
      receivedAt: observation.receivedAt,
      sourceMode: LIVE_SOURCE_MODE,
      firstIngestedAt: ingestedAt,
      lastReplayedAt: ingestedAt,
      replayCount: 1,
      handoffRecorded,
    },
    dedupRegistry
  );

  return Object.freeze({
    disposition: LIVE_DISCOVERY_DISPOSITION.CREATED,
    observation,
    dedupKey,
    signal,
    candidate,
    identity,
    factoryKey,
    handoffRecorded,
    reason: null,
    code: null,
  });
}

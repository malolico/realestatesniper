/**
 * PS05-03 — Minimum Decision-relevant fact completeness aggregation.
 * Describes evidence state — not quality/readiness score.
 */

import {
  FACT_STATUS,
  FACT_TYPE,
  FRESHNESS_STATE,
  CONFLICT_STATE,
  buildDecisionFactEnvelope,
  buildUnknownFactEnvelope,
} from "./decisionFactEnvelope.js";
import { SOURCE_COMPLETENESS_STATUS } from "./sourceCompleteness.js";

/** Bounded expected Decision-relevant fact classes for current handoff. */
export const EXPECTED_DECISION_FACT_CLASSES = Object.freeze([
  "propertyIdentity",
  "jurisdiction",
  "ownerRef",
  "parcelId",
  "trustMeta",
]);

/**
 * @param {{
 *   envelopes?: object[],
 *   canonicalFact?: object|null,
 *   propertyIdentity?: object|null,
 *   sourceCompleteness?: object|null,
 *   factoryKey?: string,
 * }} [input]
 */
export function evaluateFactCompleteness(input = {}) {
  const envelopes = [...(input.envelopes ?? [])];
  const canonical = input.canonicalFact ?? null;
  const identity = input.propertyIdentity ?? null;
  const factoryKey = input.factoryKey ?? "pending";

  if (canonical && envelopes.length === 0) {
    envelopes.push(...buildEnvelopesFromCanonical(canonical, identity, factoryKey));
  }

  const byClass = Object.fromEntries(envelopes.map((e) => [e.factClass, e]));
  const facts = EXPECTED_DECISION_FACT_CLASSES.map((factClass) => {
    const existing = byClass[factClass];
    if (existing) {
      return existing;
    }
    // Missing expected → UNKNOWN, not invented value
    return buildUnknownFactEnvelope(factClass, {
      factoryKey,
      reason: "expected_fact_absent",
    });
  });

  const byStatus = Object.fromEntries(
    Object.values(FACT_STATUS).map((s) => [s, facts.filter((f) => f.status === s).length])
  );

  const missing = facts.filter(
    (f) =>
      f.status === FACT_STATUS.UNKNOWN ||
      f.status === FACT_STATUS.UNAVAILABLE ||
      f.status === FACT_STATUS.CONFLICTING
  );

  return Object.freeze({
    schemaId: "rsn.fact.completeness.v1",
    facts: Object.freeze(facts),
    byStatus: Object.freeze(byStatus),
    missingFactClasses: Object.freeze(missing.map((f) => f.factClass)),
    hasGaps: missing.length > 0,
    completenessIsNotQuality: true,
    constitutionalPhase: "PS05-03",
  });
}

/**
 * @param {object} canonical
 * @param {object|null} identity
 * @param {string} factoryKey
 */
function buildEnvelopesFromCanonical(canonical, identity, factoryKey) {
  const trustMeta = canonical.trustMeta ?? {};
  const sourceRefs = canonical.sourceIdentity?.sourceRefIds ?? {};
  const firstSourceRefId =
    sourceRefs["ORG-ASR-MC"] ??
    sourceRefs["ORG-GIS-MC"] ??
    Object.values(sourceRefs).find(Boolean) ??
    null;

  const envelopes = [];

  const identityStatus = identity?.status;
  const identityFound = identityStatus === "MATCH";
  envelopes.push(
    buildDecisionFactEnvelope({
      factId: `${factoryKey}:propertyIdentity`,
      factClass: "propertyIdentity",
      value: identityFound
        ? { status: identity.status, canonicalKey: identity.canonicalKey }
        : identity ?? null,
      factType: identityFound
        ? FACT_TYPE.OBSERVED
        : identityStatus
          ? FACT_TYPE.UNKNOWN
          : FACT_TYPE.UNKNOWN,
      status: identityFound
        ? FACT_STATUS.FOUND
        : identityStatus === "NO_MATCH"
          ? FACT_STATUS.CONFLICTING
          : FACT_STATUS.UNKNOWN,
      sourceRefId: firstSourceRefId,
      jurisdiction: canonical.jurisdiction ?? identity?.jurisdiction ?? null,
      rawRecordRef: canonical.rawIdentifiers ?? null,
      trustMeta,
      freshnessState:
        canonical.factEnvelopes?.propertyIdentity?.freshnessState ??
        FRESHNESS_STATE.UNKNOWN_FRESHNESS,
      vintageAt: canonical.provenanceMeta?.vintageAt ?? null,
      acquiredAt: canonical.provenanceMeta?.acquiredAt ?? null,
    })
  );

  const j = canonical.jurisdiction;
  const jKnown = j?.status === "KNOWN" && j?.state && j?.county;
  envelopes.push(
    buildDecisionFactEnvelope({
      factId: `${factoryKey}:jurisdiction`,
      factClass: "jurisdiction",
      value: jKnown ? { state: j.state, county: j.county, id: j.id } : j,
      factType: jKnown ? FACT_TYPE.OBSERVED : FACT_TYPE.UNKNOWN,
      status: jKnown ? FACT_STATUS.FOUND : FACT_STATUS.UNKNOWN,
      sourceRefId: firstSourceRefId,
      jurisdiction: j,
      trustMeta,
      freshnessState:
        canonical.factEnvelopes?.jurisdiction?.freshnessState ??
        FRESHNESS_STATE.UNKNOWN_FRESHNESS,
      vintageAt: canonical.provenanceMeta?.vintageAt ?? null,
      acquiredAt: canonical.provenanceMeta?.acquiredAt ?? null,
    })
  );

  const owner = canonical.ownerRef;
  const ownerFound = owner?.status === "RESOLVED" && owner?.name;
  envelopes.push(
    buildDecisionFactEnvelope({
      factId: `${factoryKey}:ownerRef`,
      factClass: "ownerRef",
      value: owner,
      factType: ownerFound
        ? trustMeta.stubBusinessFact
          ? FACT_TYPE.STUB
          : FACT_TYPE.OBSERVED
        : FACT_TYPE.UNKNOWN,
      status: ownerFound ? FACT_STATUS.FOUND : FACT_STATUS.UNKNOWN,
      sourceRefId: sourceRefs["ORG-RCR-MC"] ?? firstSourceRefId,
      trustMeta: {
        ...trustMeta,
        decisionTrusted: false,
      },
      freshnessState: FRESHNESS_STATE.UNKNOWN_FRESHNESS,
    })
  );

  const parcelId = canonical.parcelId ?? canonical.apn ?? null;
  envelopes.push(
    buildDecisionFactEnvelope({
      factId: `${factoryKey}:parcelId`,
      factClass: "parcelId",
      value: parcelId,
      factType: parcelId ? FACT_TYPE.OBSERVED : FACT_TYPE.UNKNOWN,
      status: parcelId ? FACT_STATUS.FOUND : FACT_STATUS.UNKNOWN,
      sourceRefId: firstSourceRefId,
      rawRecordRef: canonical.rawIdentifiers?.assessor ?? null,
      trustMeta,
      freshnessState:
        canonical.factEnvelopes?.parcelId?.freshnessState ??
        FRESHNESS_STATE.UNKNOWN_FRESHNESS,
      vintageAt: canonical.provenanceMeta?.vintageAt ?? null,
      acquiredAt: canonical.provenanceMeta?.acquiredAt ?? null,
    })
  );

  envelopes.push(
    buildDecisionFactEnvelope({
      factId: `${factoryKey}:trustMeta`,
      factClass: "trustMeta",
      value: trustMeta,
      factType: trustMeta.synthetic
        ? FACT_TYPE.SYNTHETIC
        : trustMeta.stubBusinessFact
          ? FACT_TYPE.STUB
          : FACT_TYPE.DERIVED,
      status: trustMeta.synthetic
        ? FACT_STATUS.DERIVED
        : FACT_STATUS.DERIVED,
      derivationRef: { kind: "ps05-01_trust_boundary" },
      trustMeta,
      freshnessState: FRESHNESS_STATE.UNKNOWN_FRESHNESS,
    })
  );

  return envelopes;
}

/**
 * Build computed known-unknowns from fact/source completeness (no invented Obl).
 *
 * @param {string} factoryKey
 * @param {{
 *   factCompleteness?: object|null,
 *   sourceCompleteness?: object|null,
 *   layerBlockers?: object[],
 * }} [evidence]
 */
export function buildUnknownsFromCompleteness(factoryKey, evidence = {}) {
  const unknowns = [];
  const factCompleteness = evidence.factCompleteness ?? null;
  const sourceCompleteness = evidence.sourceCompleteness ?? null;
  const layerBlockers = evidence.layerBlockers ?? [];

  unknowns.push({
    id: `DKN-${factoryKey}-EVAL`,
    domain: "ps05-03",
    description: "PS05-03 computed unknown evaluation completed",
    obligation: "Meta",
    declared: true,
    evaluationComplete: true,
    synthetic: false,
  });

  if (factCompleteness?.missingFactClasses?.length) {
    for (const factClass of factCompleteness.missingFactClasses) {
      unknowns.push({
        id: `DKN-${factoryKey}-FACT-${factClass}`,
        domain: "fact",
        factClass,
        description: `Missing expected Decision-relevant fact: ${factClass}`,
        obligation: "Obl",
        declared: true,
        status: FACT_STATUS.UNKNOWN,
        synthetic: false,
        invented: false,
      });
    }
  }

  if (sourceCompleteness?.sources) {
    for (const src of sourceCompleteness.sources) {
      if (
        src.status === SOURCE_COMPLETENESS_STATUS.CHECKED ||
        src.status === SOURCE_COMPLETENESS_STATUS.EXPECTED
      ) {
        continue;
      }
      if (src.status === SOURCE_COMPLETENESS_STATUS.STALE) {
        unknowns.push({
          id: `DKN-${factoryKey}-SRC-${src.sourceClass}`,
          domain: "source",
          sourceClass: src.sourceClass,
          organismId: src.organismId,
          description: `Source ${src.sourceClass} is STALE`,
          obligation: "Obl",
          declared: true,
          status: src.status,
          synthetic: false,
          invented: false,
        });
        continue;
      }
      unknowns.push({
        id: `DKN-${factoryKey}-SRC-${src.sourceClass}`,
        domain: "source",
        sourceClass: src.sourceClass,
        organismId: src.organismId,
        description: `Source ${src.sourceClass} completeness=${src.status}`,
        obligation: "Obl",
        declared: true,
        status: src.status,
        synthetic: false,
        invented: false,
      });
    }
  }

  for (const blocker of layerBlockers) {
    if (blocker.documented === true) {
      unknowns.push({
        id: `DKN-${factoryKey}-BLK-${blocker.id ?? unknowns.length}`,
        domain: blocker.domain ?? "layer",
        description: blocker.message ?? "Documented blocker",
        obligation: "Obl",
        declared: true,
        synthetic: false,
        invented: false,
      });
    }
  }

  const gapUnknowns = unknowns.filter((u) => u.obligation === "Obl");
  const honestyComplete = gapUnknowns.length === 0;

  if (honestyComplete) {
    unknowns.push({
      id: `DKN-${factoryKey}-HONESTY`,
      domain: "completeness",
      description: "No missing Decision-relevant expected facts/sources for bounded handoff",
      obligation: "Meta",
      declared: true,
      honestyComplete: true,
      synthetic: false,
      invented: false,
    });
  }

  return Object.freeze({
    unknowns: Object.freeze(unknowns),
    honestyComplete,
    evaluationComplete: true,
    inventedObl: false,
  });
}

export { FACT_STATUS, FACT_TYPE, FRESHNESS_STATE, CONFLICT_STATE };

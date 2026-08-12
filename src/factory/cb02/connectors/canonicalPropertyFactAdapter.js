/**
 * PS05-02 — Canonical property fact adapter.
 * Maps source-specific recorded payloads → RSN canonical property representation.
 * Preserves raw/source identifiers. Does not invent missing values.
 * Maricopa schemas remain source adapters — not the canonical contract.
 */

import {
  JURISDICTION_STATUS,
  normalizeJurisdiction,
} from "../jurisdictionRegistry.js";
import { getOrganism } from "../sourceOrganismsCatalog.js";
import { SOURCE_MODE } from "../../cb05/decisionTrustBoundary.js";
import {
  FRESHNESS_STATE,
  resolveFreshnessState,
} from "../decisionFactEnvelope.js";
import { evaluateSourceCompleteness } from "../sourceCompleteness.js";
import { evaluateFactCompleteness } from "../factCompleteness.js";

export const OWNER_RESOLUTION = Object.freeze({
  RESOLVED: "RESOLVED",
  UNRESOLVED: "UNRESOLVED",
  UNKNOWN: "UNKNOWN",
});

/**
 * @param {object|null|undefined} situs
 */
function normalizeAddress(situs) {
  if (!situs || typeof situs !== "object") {
    return null;
  }
  const line1 = typeof situs.line1 === "string" ? situs.line1 : null;
  const city = typeof situs.city === "string" ? situs.city : null;
  const state = typeof situs.state === "string" ? situs.state : null;
  const postalCode = typeof situs.postalCode === "string" ? situs.postalCode : null;
  if (!line1 && !city && !state && !postalCode) {
    return null;
  }
  return Object.freeze({
    line1,
    city,
    state,
    postalCode,
  });
}

/**
 * Build trustMeta for canonical facts without inventing Decision trust.
 * @param {object} [trustMeta]
 */
function resolveTrustMeta(trustMeta = {}) {
  const synthetic = trustMeta.synthetic === true;
  const unavailable = trustMeta.sourceMode === SOURCE_MODE.UNAVAILABLE;
  return Object.freeze({
    sourceMode:
      trustMeta.sourceMode ??
      (synthetic ? SOURCE_MODE.SYNTHETIC_FIXTURE : SOURCE_MODE.RECORDED_ENRICHMENT),
    synthetic,
    stubBusinessFact: trustMeta.stubBusinessFact === true || synthetic,
    decisionTrusted:
      trustMeta.decisionTrusted === true && !synthetic && !unavailable
        ? true
        : false,
    trustClass: trustMeta.trustClass ?? (unavailable ? "UNAVAILABLE" : synthetic ? "STUB" : "TRUSTED"),
  });
}

/**
 * Convert source-specific payloads into minimum canonical property fact.
 *
 * @param {{
 *   payloadsByOrganism?: Record<string, object>|null,
 *   sourceRefsByOrganism?: Record<string, object>|null,
 *   packJurisdictionLabel?: string|null,
 *   trustMeta?: object,
 *   ownerEvidence?: { name?: string|null, resolved?: boolean }|null,
 * }} [input]
 */
export function buildCanonicalPropertyFact(input = {}) {
  const payloads = input.payloadsByOrganism ?? {};
  const sourceRefs = input.sourceRefsByOrganism ?? {};

  const asr = payloads["ORG-ASR-MC"] ?? payloads.assessor ?? null;
  const gis = payloads["ORG-GIS-MC"] ?? payloads.gis ?? null;
  const rcr = payloads["ORG-RCR-MC"] ?? payloads.recorder ?? null;

  const situsState =
    asr?.situsAddress && typeof asr.situsAddress === "object"
      ? asr.situsAddress.state
      : null;

  // Prefer pack label; else organism catalog jurisdiction when that organism is present.
  let packLabel = input.packJurisdictionLabel ?? null;
  if (!packLabel) {
    const present = Object.keys(payloads);
    const orgId = present.find((id) => getOrganism(id)?.jurisdiction) ?? null;
    if (orgId) {
      const org = getOrganism(orgId);
      if (typeof org?.jurisdiction === "string" && org.jurisdiction.includes("County")) {
        packLabel = org.jurisdiction;
      }
    }
  }

  const jurisdiction = normalizeJurisdiction({
    sourceLabel: packLabel,
    state: situsState ?? null,
  });

  const parcelId =
    asr?.parcelId ?? gis?.parcelId ?? rcr?.parcelRef ?? null;
  const apn = asr?.apn ?? null;
  const address = normalizeAddress(asr?.situsAddress ?? null);

  const organismsPresent = Object.keys(payloads);
  const sourceIdentity = Object.freeze({
    organismsPresent,
    sourceRefIds: Object.freeze(
      Object.fromEntries(
        Object.entries(sourceRefs).map(([org, ref]) => [org, ref?.id ?? null])
      )
    ),
  });

  const rawIdentifiers = Object.freeze({
    assessor: asr
      ? Object.freeze({
          schemaId: asr.schemaId ?? null,
          parcelId: asr.parcelId ?? null,
          apn: asr.apn ?? null,
        })
      : null,
    gis: gis
      ? Object.freeze({
          schemaId: gis.schemaId ?? null,
          parcelId: gis.parcelId ?? null,
        })
      : null,
    recorder: rcr
      ? Object.freeze({
          schemaId: rcr.schemaId ?? null,
          documentId: rcr.documentId ?? null,
          parcelRef: rcr.parcelRef ?? null,
        })
      : null,
  });

  // Owner: do not invent. RCR pack has no grantor/grantee.
  let ownerRef;
  if (input.ownerEvidence?.resolved === true && input.ownerEvidence?.name) {
    ownerRef = Object.freeze({
      status: OWNER_RESOLUTION.RESOLVED,
      name: input.ownerEvidence.name,
      decisionTrusted: false,
    });
  } else if (rcr && (rcr.grantor || rcr.grantee || rcr.ownerName)) {
    ownerRef = Object.freeze({
      status: OWNER_RESOLUTION.RESOLVED,
      name: rcr.ownerName ?? rcr.grantee ?? rcr.grantor,
      decisionTrusted: false,
      note: "source_owner_field_present",
    });
  } else {
    ownerRef = Object.freeze({
      status: OWNER_RESOLUTION.UNRESOLVED,
      name: null,
      decisionTrusted: false,
      reason: rcr
        ? "recorder_owner_fields_absent"
        : "owner_evidence_absent",
    });
  }

  const trustMeta = resolveTrustMeta(input.trustMeta);

  const propertyIdentitySeed = Object.freeze({
    parcelId: parcelId ?? null,
    apn: apn ?? null,
    recorderParcelRef: rcr?.parcelRef ?? null,
    jurisdictionId: jurisdiction.id,
    jurisdictionStatus: jurisdiction.status,
  });

  // PS05-03: provenance timing from SourceRefs only — never invent timestamps.
  const primaryRef =
    sourceRefs["ORG-ASR-MC"] ?? sourceRefs["ORG-GIS-MC"] ?? sourceRefs["ORG-RCR-MC"] ?? null;
  const vintageAt = primaryRef?.vintageAt ?? null;
  const acquiredAt = primaryRef?.acquiredAt ?? null;
  const freshnessResolved = resolveFreshnessState(
    primaryRef?.freshness?.profileKey ??
      primaryRef?.freshness?.profile ??
      (vintageAt ? "ASSESSOR_ROLL" : null),
    vintageAt
  );

  const provenanceMeta = Object.freeze({
    acquiredAt,
    vintageAt,
    freshnessState: freshnessResolved.freshnessState,
    freshnessResult: freshnessResolved.freshnessResult,
    primarySourceRefId: primaryRef?.id ?? null,
  });

  const baseFact = {
    schemaId: "rsn.canonical.property.fact.v1",
    propertyIdentity: propertyIdentitySeed,
    jurisdiction: Object.freeze({
      state: jurisdiction.state,
      county: jurisdiction.county,
      id: jurisdiction.id,
      status: jurisdiction.status,
      sourceLabel: jurisdiction.sourceLabel,
      decisionFacingSafe: jurisdiction.decisionFacingSafe === true,
    }),
    parcelId: parcelId ?? null,
    apn: apn ?? null,
    address,
    sourceIdentity,
    rawIdentifiers,
    ownerRef,
    trustMeta,
    provenanceMeta,
    constitutionalPhase: "PS05-02",
  };

  const sourceCompleteness = evaluateSourceCompleteness({
    payloadsByOrganism: payloads,
    sourceRefsByOrganism: sourceRefs,
  });

  // Identity resolver runs outside; provisional completeness uses seed only.
  const factCompleteness = evaluateFactCompleteness({
    canonicalFact: {
      ...baseFact,
      factEnvelopes: {
        parcelId: { freshnessState: freshnessResolved.freshnessState },
        jurisdiction: { freshnessState: freshnessResolved.freshnessState },
        propertyIdentity: { freshnessState: freshnessResolved.freshnessState },
      },
    },
    propertyIdentity: input.propertyIdentity ?? null,
    factoryKey: input.factoryKey ?? "canonical",
    sourceCompleteness,
  });

  return Object.freeze({
    ...baseFact,
    sourceCompleteness,
    factCompleteness,
    factEnvelopes: Object.freeze(
      Object.fromEntries(factCompleteness.facts.map((f) => [f.factClass, f]))
    ),
    ps0503: Object.freeze({
      freshnessState: freshnessResolved.freshnessState,
      unknownFreshnessIsNotCurrent:
        freshnessResolved.freshnessState !== FRESHNESS_STATE.CURRENT,
    }),
  });
}

/**
 * Decision-facing projection: canonical fields only (no Maricopa schema required).
 * @param {object} fact
 */
export function toDecisionFacingPropertyView(fact) {
  if (!fact || fact.schemaId !== "rsn.canonical.property.fact.v1") {
    return null;
  }
  return Object.freeze({
    parcelId: fact.parcelId,
    apn: fact.apn,
    address: fact.address,
    jurisdiction: fact.jurisdiction,
    propertyIdentity: fact.propertyIdentity,
    ownerRef: fact.ownerRef,
    trustMeta: fact.trustMeta,
    sourceOrganismCount: fact.sourceIdentity?.organismsPresent?.length ?? 0,
    provenanceMeta: fact.provenanceMeta ?? null,
    factEnvelopes: fact.factEnvelopes ?? null,
    sourceCompleteness: fact.sourceCompleteness ?? null,
    factCompleteness: fact.factCompleteness ?? null,
    freshnessState: fact.ps0503?.freshnessState ?? fact.provenanceMeta?.freshnessState ?? null,
  });
}

export { JURISDICTION_STATUS };

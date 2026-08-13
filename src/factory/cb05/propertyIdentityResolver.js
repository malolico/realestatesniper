/**
 * PS05-02 — Deterministic property identity resolver.
 * Outcomes: MATCH | NO_MATCH | AMBIGUOUS | UNRESOLVED
 * No probabilistic AI matching. Jurisdiction is part of identity.
 *
 * PS05-06: expand from canonicalFact using family/organism honesty — not Maricopa-only IDs.
 */

import {
  JURISDICTION_STATUS,
  jurisdictionsEqual,
  normalizeJurisdiction,
} from "../cb02/jurisdictionRegistry.js";

export const PROPERTY_IDENTITY_STATUS = Object.freeze({
  MATCH: "MATCH",
  NO_MATCH: "NO_MATCH",
  AMBIGUOUS: "AMBIGUOUS",
  UNRESOLVED: "UNRESOLVED",
});

/**
 * @param {string|null|undefined} value
 */
function normId(value) {
  if (typeof value !== "string") return null;
  const t = value.trim();
  return t.length ? t.toUpperCase() : null;
}

/**
 * @param {object} source
 */
function normalizeSourceSignals(source) {
  const jurisdiction = source.jurisdiction?.state
    ? source.jurisdiction
    : normalizeJurisdiction({
        state: source.state ?? source.jurisdiction?.state,
        county: source.county ?? source.jurisdiction?.county,
        sourceLabel: source.jurisdictionLabel ?? source.jurisdiction?.sourceLabel,
        jurisdictionId: source.jurisdictionId ?? source.jurisdiction?.id,
      });

  return {
    organismId: source.organismId ?? null,
    jurisdiction,
    parcelId: normId(source.parcelId),
    apn: normId(source.apn),
    recorderParcelRef: normId(source.recorderParcelRef ?? source.parcelRef),
    addressKey: buildAddressKey(source.address),
  };
}

/**
 * @param {object|null|undefined} address
 */
function buildAddressKey(address) {
  if (!address || typeof address !== "object") return null;
  const parts = [address.line1, address.city, address.state, address.postalCode]
    .filter((p) => typeof p === "string" && p.trim())
    .map((p) => p.trim().toUpperCase());
  return parts.length >= 2 ? parts.join("|") : null;
}

/**
 * Strong identifier keys used for deterministic matching.
 * @param {ReturnType<typeof normalizeSourceSignals>} s
 */
function strongIds(s) {
  return {
    parcelId: s.parcelId,
    apn: s.apn,
    recorderParcelRef: s.recorderParcelRef,
  };
}

/**
 * Resolve property identity across source signal bags.
 *
 * @param {{
 *   sources?: object[],
 *   canonicalFact?: object|null,
 * }} [input]
 */
export function resolvePropertyIdentity(input = {}) {
  /** @type {object[]} */
  let sources = Array.isArray(input.sources) ? [...input.sources] : [];

  if (input.canonicalFact && sources.length === 0) {
    const fact = input.canonicalFact;
    const raw = fact.rawIdentifiers ?? {};
    const j = fact.jurisdiction;
    const srcId = fact.sourceIdentity ?? {};
    if (raw.assessor) {
      sources.push({
        organismId: raw.assessor.organismId ?? srcId.assessorOrganismId ?? "ORG-ASR-MC",
        jurisdiction: j,
        parcelId: raw.assessor.parcelId,
        apn: raw.assessor.apn,
        address: fact.address,
      });
    }
    if (raw.gis) {
      sources.push({
        organismId: raw.gis.organismId ?? srcId.gisOrganismId ?? "ORG-GIS-MC",
        jurisdiction: j,
        parcelId: raw.gis.parcelId,
        apn: raw.gis.apn ?? null,
      });
    }
    if (raw.recorder) {
      sources.push({
        organismId: raw.recorder.organismId ?? srcId.recorderOrganismId ?? "ORG-RCR-MC",
        jurisdiction: j,
        recorderParcelRef: raw.recorder.parcelRef,
        parcelId: raw.recorder.parcelRef,
      });
    }
  }

  const normalized = sources.map(normalizeSourceSignals);
  const withEvidence = normalized.filter(
    (s) => s.parcelId || s.apn || s.recorderParcelRef || s.addressKey
  );

  if (withEvidence.length === 0) {
    return Object.freeze({
      status: PROPERTY_IDENTITY_STATUS.UNRESOLVED,
      canonicalKey: null,
      jurisdiction: null,
      reasons: Object.freeze(["insufficient_identity_evidence"]),
      matchedSignals: Object.freeze([]),
      sourceCount: normalized.length,
    });
  }

  // Jurisdiction isolation: known jurisdictions must agree when present
  const knownJurisdictions = withEvidence
    .map((s) => s.jurisdiction)
    .filter((j) => j?.status === JURISDICTION_STATUS.KNOWN);

  if (knownJurisdictions.length >= 2) {
    const anchor = knownJurisdictions[0];
    for (let i = 1; i < knownJurisdictions.length; i += 1) {
      if (!jurisdictionsEqual(anchor, knownJurisdictions[i])) {
        // Same APN across different jurisdictions must not MATCH
        const apns = withEvidence.map((s) => s.apn).filter(Boolean);
        const uniqueApns = [...new Set(apns)];
        return Object.freeze({
          status: PROPERTY_IDENTITY_STATUS.NO_MATCH,
          canonicalKey: null,
          jurisdiction: null,
          reasons: Object.freeze([
            "cross_jurisdiction_conflict",
            uniqueApns.length === 1 && apns.length >= 2
              ? "same_apn_different_jurisdiction"
              : "jurisdiction_mismatch",
          ]),
          matchedSignals: Object.freeze([]),
          sourceCount: withEvidence.length,
        });
      }
    }
  }

  const unknownJurisdictionCount = withEvidence.filter(
    (s) => s.jurisdiction?.status !== JURISDICTION_STATUS.KNOWN
  ).length;
  if (unknownJurisdictionCount === withEvidence.length) {
    return Object.freeze({
      status: PROPERTY_IDENTITY_STATUS.UNRESOLVED,
      canonicalKey: null,
      jurisdiction: null,
      reasons: Object.freeze(["jurisdiction_unknown"]),
      matchedSignals: Object.freeze([]),
      sourceCount: withEvidence.length,
    });
  }

  const jurisdiction = knownJurisdictions[0] ?? withEvidence[0].jurisdiction;

  // Collect strong ID agreement / conflict under shared jurisdiction
  const parcelIds = [...new Set(withEvidence.map((s) => s.parcelId).filter(Boolean))];
  const apns = [...new Set(withEvidence.map((s) => s.apn).filter(Boolean))];
  const recorderRefs = [
    ...new Set(withEvidence.map((s) => s.recorderParcelRef).filter(Boolean)),
  ];

  if (parcelIds.length > 1 || apns.length > 1) {
    return Object.freeze({
      status: PROPERTY_IDENTITY_STATUS.NO_MATCH,
      canonicalKey: null,
      jurisdiction,
      reasons: Object.freeze(["conflicting_strong_identifiers"]),
      matchedSignals: Object.freeze([]),
      conflicts: Object.freeze({ parcelIds, apns, recorderRefs }),
      sourceCount: withEvidence.length,
    });
  }

  // Cross-source MATCH requires ≥2 sources agreeing on a strong id under same jurisdiction
  const sourcesWithStrong = withEvidence.filter(
    (s) => s.parcelId || s.apn || s.recorderParcelRef
  );

  if (sourcesWithStrong.length >= 2) {
    const primaryParcel = parcelIds[0] ?? recorderRefs[0] ?? null;
    const primaryApn = apns[0] ?? null;

    // Check agreement: every strong source must share at least one linking id
    let allLinked = true;
    for (const s of sourcesWithStrong) {
      const ids = strongIds(s);
      const linksPrimary =
        (primaryParcel &&
          (ids.parcelId === primaryParcel || ids.recorderParcelRef === primaryParcel)) ||
        (primaryApn && ids.apn === primaryApn);
      if (!linksPrimary) {
        // recorder-only ref vs parcel: treat equal if recorderRef === parcelId set
        if (
          primaryParcel &&
          ids.recorderParcelRef &&
          ids.recorderParcelRef === primaryParcel
        ) {
          continue;
        }
        allLinked = false;
        break;
      }
    }

    if (allLinked && (primaryParcel || primaryApn)) {
      const keyBody = primaryParcel ?? primaryApn;
      const jId = jurisdiction?.id ?? "UNKNOWN";
      return Object.freeze({
        status: PROPERTY_IDENTITY_STATUS.MATCH,
        canonicalKey: `${jId}:${keyBody}`,
        jurisdiction,
        reasons: Object.freeze(["cross_source_strong_id_agreement"]),
        matchedSignals: Object.freeze(
          [
            primaryParcel ? "parcelId|recorderParcelRef" : null,
            primaryApn ? "apn" : null,
          ].filter(Boolean)
        ),
        sourceCount: sourcesWithStrong.length,
        definitiveKeyCandidate: `${jId.toLowerCase().replace(/^us-/, "").replace(/_/g, ".")}:${keyBody}`,
      });
    }

    return Object.freeze({
      status: PROPERTY_IDENTITY_STATUS.AMBIGUOUS,
      canonicalKey: null,
      jurisdiction,
      reasons: Object.freeze(["strong_ids_present_but_unlinked"]),
      matchedSignals: Object.freeze([]),
      sourceCount: sourcesWithStrong.length,
    });
  }

  // Address-only or single-source strong id → do not overclaim MATCH
  if (sourcesWithStrong.length === 1) {
    return Object.freeze({
      status: PROPERTY_IDENTITY_STATUS.UNRESOLVED,
      canonicalKey: null,
      jurisdiction,
      reasons: Object.freeze(["single_source_insufficient_for_cross_source_match"]),
      matchedSignals: Object.freeze([]),
      sourceCount: withEvidence.length,
      provisionalParcelId: sourcesWithStrong[0].parcelId,
      provisionalApn: sourcesWithStrong[0].apn,
    });
  }

  // Address-only evidence
  const addressKeys = [...new Set(withEvidence.map((s) => s.addressKey).filter(Boolean))];
  if (addressKeys.length === 1 && withEvidence.length >= 2) {
    return Object.freeze({
      status: PROPERTY_IDENTITY_STATUS.AMBIGUOUS,
      canonicalKey: null,
      jurisdiction,
      reasons: Object.freeze(["address_only_insufficient_for_match"]),
      matchedSignals: Object.freeze(["address"]),
      sourceCount: withEvidence.length,
    });
  }

  return Object.freeze({
    status: PROPERTY_IDENTITY_STATUS.UNRESOLVED,
    canonicalKey: null,
    jurisdiction,
    reasons: Object.freeze(["insufficient_identity_evidence"]),
    matchedSignals: Object.freeze([]),
    sourceCount: withEvidence.length,
  });
}

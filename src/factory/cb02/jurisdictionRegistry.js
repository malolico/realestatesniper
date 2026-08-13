/**
 * PS05-02 — Minimum explicit jurisdiction vocabulary (state + county).
 * Maricopa, AZ is one instance — not the universal canonical architecture.
 * Unknown jurisdiction fails honestly (no silent Maricopa/AZ/Phoenix-NW fallback).
 */

export const JURISDICTION_STATUS = Object.freeze({
  KNOWN: "KNOWN",
  UNKNOWN: "UNKNOWN",
});

/** Bounded known instances for current Factory sources (not a 50-state catalog). */
export const KNOWN_JURISDICTIONS = Object.freeze({
  "US-AZ-MARICOPA": Object.freeze({
    id: "US-AZ-MARICOPA",
    state: "AZ",
    county: "Maricopa",
    country: "US",
    sourceLabels: Object.freeze(["Maricopa County, AZ", "maricopa", "AZ-Maricopa"]),
  }),
  /** PS05-06 — Pima instance for generic-contract / multi-key isolation proof (not Scale Out). */
  "US-AZ-PIMA": Object.freeze({
    id: "US-AZ-PIMA",
    state: "AZ",
    county: "Pima",
    country: "US",
    sourceLabels: Object.freeze(["Pima County, AZ", "pima", "AZ-Pima"]),
  }),
});

/**
 * @param {string} [sourceLabel]
 * @returns {object|null}
 */
export function lookupJurisdictionByLabel(sourceLabel) {
  if (typeof sourceLabel !== "string" || !sourceLabel.trim()) {
    return null;
  }
  const normalized = sourceLabel.trim().toLowerCase();
  for (const entry of Object.values(KNOWN_JURISDICTIONS)) {
    if (entry.sourceLabels.some((l) => l.toLowerCase() === normalized)) {
      return entry;
    }
    if (
      normalized.includes(entry.county.toLowerCase()) &&
      (normalized.includes(entry.state.toLowerCase()) ||
        normalized.includes("arizona"))
    ) {
      return entry;
    }
  }
  return null;
}

/**
 * Normalize jurisdiction to machine-readable { state, county }.
 * Does not invent Maricopa/AZ when evidence is missing/unknown.
 *
 * @param {{
 *   state?: string|null,
 *   county?: string|null,
 *   sourceLabel?: string|null,
 *   jurisdictionId?: string|null,
 * }} [input]
 */
export function normalizeJurisdiction(input = {}) {
  if (input.jurisdictionId && KNOWN_JURISDICTIONS[input.jurisdictionId]) {
    const known = KNOWN_JURISDICTIONS[input.jurisdictionId];
    return Object.freeze({
      status: JURISDICTION_STATUS.KNOWN,
      id: known.id,
      state: known.state,
      county: known.county,
      country: known.country,
      sourceLabel: input.sourceLabel ?? known.sourceLabels[0],
      decisionFacingSafe: true,
    });
  }

  const fromLabel = lookupJurisdictionByLabel(input.sourceLabel ?? "");
  if (fromLabel) {
    return Object.freeze({
      status: JURISDICTION_STATUS.KNOWN,
      id: fromLabel.id,
      state: fromLabel.state,
      county: fromLabel.county,
      country: fromLabel.country,
      sourceLabel: input.sourceLabel ?? fromLabel.sourceLabels[0],
      decisionFacingSafe: true,
    });
  }

  const state =
    typeof input.state === "string" && input.state.trim()
      ? input.state.trim().toUpperCase()
      : null;
  const county =
    typeof input.county === "string" && input.county.trim()
      ? input.county.trim()
      : null;

  if (state && county) {
    const composedId = `US-${state}-${county.toUpperCase().replace(/\s+/g, "_")}`;
    const known = KNOWN_JURISDICTIONS[composedId] ?? null;
    if (known) {
      return Object.freeze({
        status: JURISDICTION_STATUS.KNOWN,
        id: known.id,
        state: known.state,
        county: known.county,
        country: known.country,
        sourceLabel: input.sourceLabel ?? `${county} County, ${state}`,
        decisionFacingSafe: true,
      });
    }
    // Explicit state+county provided but not in bounded registry — still honest explicit form
    return Object.freeze({
      status: JURISDICTION_STATUS.KNOWN,
      id: composedId,
      state,
      county,
      country: "US",
      sourceLabel: input.sourceLabel ?? `${county} County, ${state}`,
      decisionFacingSafe: true,
      registryBound: false,
    });
  }

  return Object.freeze({
    status: JURISDICTION_STATUS.UNKNOWN,
    id: null,
    state: state,
    county: county,
    country: null,
    sourceLabel: input.sourceLabel ?? null,
    decisionFacingSafe: false,
    reason: "jurisdiction_unknown_or_incomplete",
  });
}

/**
 * Compare two normalized jurisdictions for identity isolation.
 * @param {object|null|undefined} a
 * @param {object|null|undefined} b
 */
export function jurisdictionsEqual(a, b) {
  if (!a || !b) return false;
  if (a.status !== JURISDICTION_STATUS.KNOWN || b.status !== JURISDICTION_STATUS.KNOWN) {
    return false;
  }
  if (a.id && b.id) return a.id === b.id;
  return a.state === b.state && a.county?.toLowerCase() === b.county?.toLowerCase();
}

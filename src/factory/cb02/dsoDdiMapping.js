/**
 * CB-02 — Pilot DSO → DDI mapping for Factory layers 1–2 (DDI Part I + II)
 * Domains MPI 01–03 (foundation) and 07–10 (legitimacy).
 */

export const PILOT_DDI_PART_I = Object.freeze({
  part: "I",
  ddiPartLabel: "Diamond Data Inventory — Parte I",
  mpiDomains: ["01", "02", "03"],
  layer: "FND",
  minEvidence: { "01": "E3", "02": "E3", "03": "E2" },
  prohibitedInBlock: ["geocoder_only_identity", "FP-02"],
});

export const PILOT_DDI_PART_II = Object.freeze({
  part: "II",
  ddiPartLabel: "Diamond Data Inventory — Parte II",
  mpiDomains: ["07", "08", "09", "10"],
  layer: "LEG",
  minEvidence: { "07": "E3", "08": "E4", "09": "E4", "10": "E3" },
  prohibitedInBlock: ["title_without_commitment", "FP-04"],
});

export const PILOT_LAYER_12_MAPPING = Object.freeze([PILOT_DDI_PART_I, PILOT_DDI_PART_II]);

/**
 * @param {string} mpiDomain
 */
export function getPilotMappingForDomain(mpiDomain) {
  for (const block of PILOT_LAYER_12_MAPPING) {
    if (block.mpiDomains.includes(mpiDomain)) {
      return block;
    }
  }
  return null;
}

/**
 * @param {string} organismId
 * @param {{ ddiDomains: string[] }} organism
 */
export function verifyOrganismDdiCoverage(organismId, organism) {
  const uncovered = organism.ddiDomains.filter((d) => !getPilotMappingForDomain(d));
  return {
    organismId,
    valid: uncovered.length === 0,
    uncoveredDomains: uncovered,
    pilotOnly: true,
  };
}

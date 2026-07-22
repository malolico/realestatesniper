/**
 * CB-02 — Official organisms catalog (pilot: Maricopa AZ + constitutional templates)
 * No live connectors — catalog only per DSO architecture.
 */

/** @type {readonly object[]} */
export const SOURCE_ORGANISMS = Object.freeze([
  {
    id: "ORG-ASR-MC",
    name: "Maricopa County Assessor",
    jurisdiction: "Maricopa County, AZ",
    families: ["REGISTRAL_ASSESSOR"],
    epistemicLevel: 1,
    accessClass: "PUBLIC",
    ddiDomains: ["01", "03"],
    ddiPart: "I",
    freshnessProfile: "ASSESSOR_ROLL",
    piiSensitive: false,
    contactChannel: false,
    status: "CATALOGUED",
  },
  {
    id: "ORG-GIS-MC",
    name: "Maricopa County GIS / Parcel Maps",
    jurisdiction: "Maricopa County, AZ",
    families: ["GIS_OFFICIAL"],
    epistemicLevel: 1,
    accessClass: "PUBLIC",
    ddiDomains: ["01", "02"],
    ddiPart: "I",
    freshnessProfile: "ASSESSOR_ROLL",
    piiSensitive: false,
    contactChannel: false,
    status: "CATALOGUED",
  },
  {
    id: "ORG-RCR-MC",
    name: "Maricopa County Recorder",
    jurisdiction: "Maricopa County, AZ",
    families: ["REGISTRAL_RECORDER"],
    epistemicLevel: 1,
    accessClass: "PUBLIC",
    ddiDomains: ["08", "09", "10"],
    ddiPart: "II",
    freshnessProfile: "TITLE_LIENS",
    piiSensitive: false,
    contactChannel: false,
    status: "CATALOGUED",
  },
  {
    id: "ORG-CRT-MC",
    name: "Maricopa County Superior Court Index",
    jurisdiction: "Maricopa County, AZ",
    families: ["JUDICIAL_INDEX"],
    epistemicLevel: 1,
    accessClass: "PUBLIC",
    ddiDomains: ["07"],
    ddiPart: "II",
    freshnessProfile: "TITLE_LIENS",
    piiSensitive: false,
    contactChannel: false,
    status: "CATALOGUED",
  },
  {
    id: "ORG-TTL-VND",
    name: "Licensed Title Commitment Provider",
    jurisdiction: "AZ — transaction scoped",
    families: ["TITLE_COMMITMENT"],
    epistemicLevel: 2,
    accessClass: "COMMERCIAL",
    ddiDomains: ["07", "08", "09"],
    ddiPart: "II",
    freshnessProfile: "TITLE_LIENS",
    piiSensitive: false,
    contactChannel: false,
    status: "CATALOGUED",
  },
  {
    id: "ORG-CNT-OPT",
    name: "Owner Opt-In Contact Channel",
    jurisdiction: "Transaction scoped",
    families: ["CONTACT_AUTHORIZED"],
    epistemicLevel: 3,
    accessClass: "RESTRICTED",
    ddiDomains: ["13"],
    ddiPart: "III",
    freshnessProfile: "OWNER_CONVERSATION",
    piiSensitive: true,
    contactChannel: true,
    status: "CATALOGUED",
  },
  {
    id: "ORG-PRH-SCR",
    name: "Prohibited Scraper Source",
    jurisdiction: "N/A",
    families: ["PROHIBITED"],
    epistemicLevel: 6,
    accessClass: "RESTRICTED",
    ddiDomains: [],
    ddiPart: null,
    freshnessProfile: null,
    piiSensitive: true,
    contactChannel: false,
    status: "PROHIBITED",
  },
]);

const ORG_BY_ID = new Map(SOURCE_ORGANISMS.map((o) => [o.id, o]));

export function getOrganism(organismId) {
  return ORG_BY_ID.get(organismId) ?? null;
}

export function listOrganisms({ pilotLayer12Only = false } = {}) {
  if (!pilotLayer12Only) return [...SOURCE_ORGANISMS];
  const pilotDomains = new Set(["01", "02", "03", "07", "08", "09", "10"]);
  return SOURCE_ORGANISMS.filter((o) =>
    o.ddiDomains.some((d) => pilotDomains.has(d))
  );
}

/**
 * @param {string} mpiDomain
 */
export function getOrganismsForDomain(mpiDomain) {
  return SOURCE_ORGANISMS.filter((o) => o.ddiDomains.includes(mpiDomain));
}

export function isOrganismProhibited(organism) {
  return organism?.status === "PROHIBITED" || organism?.epistemicLevel === 6;
}

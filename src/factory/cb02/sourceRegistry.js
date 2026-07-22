/**
 * CB-02 — Source Registry (organisms + typologies)
 */

import { isPhaseApproved } from "../cb00/constructionGovernance.js";
import { verifyOrganismDdiCoverage } from "./dsoDdiMapping.js";
import {
  getOrganism,
  getOrganismsForDomain,
  isOrganismProhibited,
  listOrganisms,
  SOURCE_ORGANISMS,
} from "./sourceOrganismsCatalog.js";
import { isAllowedEpistemicLevel } from "./sourceTaxonomy.js";

export class SourceRegistry {
  constructor() {
    if (!isPhaseApproved("CB-01")) {
      throw new Error("[CB-02 SourceRegistry] CB-01 must be APPROVED before DSO layer");
    }
  }

  getOrganism(organismId) {
    return getOrganism(organismId);
  }

  listOrganisms(options) {
    return listOrganisms(options);
  }

  getOrganismsForDomain(mpiDomain) {
    return getOrganismsForDomain(mpiDomain);
  }

  /**
   * @param {string} organismId
   */
  validateCataloguedOrganism(organismId) {
    const organism = getOrganism(organismId);
    if (!organism) {
      return { valid: false, reason: "organism_not_catalogued", organism: null };
    }
    if (isOrganismProhibited(organism)) {
      return { valid: false, reason: "organism_prohibited", organism };
    }
    if (!isAllowedEpistemicLevel(organism.epistemicLevel)) {
      return { valid: false, reason: "epistemic_level_invalid", organism };
    }
    return { valid: true, organism };
  }

  getPilotLayer12CoverageReport() {
    const pilotOrgs = listOrganisms({ pilotLayer12Only: true }).filter(
      (o) => !isOrganismProhibited(o)
    );
    const reports = pilotOrgs.map((o) => verifyOrganismDdiCoverage(o.id, o));
    const allDomains = ["01", "02", "03", "07", "08", "09", "10"];
    const covered = new Set(pilotOrgs.flatMap((o) => o.ddiDomains));
    const missingDomains = allDomains.filter((d) => !covered.has(d));
    return {
      organisms: pilotOrgs.length,
      reports,
      missingDomains,
      complete: missingDomains.length === 0,
    };
  }

  getCatalogStats() {
    return {
      total: SOURCE_ORGANISMS.length,
      catalogued: SOURCE_ORGANISMS.filter((o) => o.status === "CATALOGUED").length,
      prohibited: SOURCE_ORGANISMS.filter((o) => o.status === "PROHIBITED").length,
    };
  }
}

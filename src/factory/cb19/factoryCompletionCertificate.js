/**
 * CB-19 — Factory Completion Certificate
 *
 * Acta Director de Producción — Factory 2.0 Construction COMPLETE.
 * Does not create Web / Marketplace / Product / Projection / Decision Engine.
 */

export const FACTORY_COMPLETION_CERTIFICATE_ID = "CB-19:FactoryCompletionCertificate";

/**
 * @param {{
 *   e2ePassed: boolean,
 *   ffoChecklistPassed: boolean,
 *   coveragePassed: boolean,
 *   elrComplete: boolean,
 *   constructionLedgerValid: boolean,
 *   factoryKey?: string|null,
 *   approvedBy?: string|null,
 *   pendingDirectorApproval?: boolean,
 * }} input
 */
export function generateFactoryCompletionCertificate(input) {
  const prerequisites = {
    e2ePilot: input.e2ePassed === true,
    ffoXii2Checklist: input.ffoChecklistPassed === true,
    constitutionalCoverage: input.coveragePassed === true,
    elrCompleteness: input.elrComplete === true,
    constructionLedger: input.constructionLedgerValid === true,
  };

  const allPrerequisites = Object.values(prerequisites).every(Boolean);
  const status = allPrerequisites ? "COMPLETE" : "INCOMPLETE";

  return {
    certificateId: FACTORY_COMPLETION_CERTIFICATE_ID,
    title: "Factory 2.0 Construction — COMPLETE",
    declaration:
      status === "COMPLETE"
        ? "RealEstateSniper Factory 2.0 is constitutionally constructed and ready for productive operation under canon."
        : "Factory 2.0 construction prerequisites incomplete — certificate not granted.",
    status,
    factory_key_pilot: input.factoryKey ?? null,
    prerequisites,
    scope: {
      factoryConstruction: true,
      web: false,
      marketplace: false,
      productCatalog: false,
      projection: false,
      decisionEngine: false,
      newAi: false,
    },
    issuedAt: new Date().toISOString(),
    issuedBy: "CB-19 Factory Completion",
    approvedBy: input.approvedBy ?? null,
    pendingDirectorApproval: input.pendingDirectorApproval ?? !input.approvedBy,
    constitutionalPhase: "CB-19",
    rules: ["LFF-01", "LFF-15", "LFF-17", "FFO §XII"],
  };
}

/**
 * @param {ReturnType<generateFactoryCompletionCertificate>} certificate
 */
export function validateFactoryCompletionCertificate(certificate) {
  const errors = [];
  if (!certificate || certificate.certificateId !== FACTORY_COMPLETION_CERTIFICATE_ID) {
    errors.push("Invalid Factory Completion Certificate id");
  }
  if (certificate.status !== "COMPLETE") {
    errors.push("Certificate status must be COMPLETE");
  }
  if (!certificate.title?.includes("COMPLETE")) {
    errors.push("Certificate title must declare Factory 2.0 Construction COMPLETE");
  }
  if (certificate.scope?.web || certificate.scope?.marketplace || certificate.scope?.decisionEngine) {
    errors.push("Certificate must not claim Web/Marketplace/Decision Engine construction");
  }
  return { valid: errors.length === 0, errors };
}

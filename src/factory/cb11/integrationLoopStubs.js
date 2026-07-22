/**
 * CB-11 — Integration loop stubs (INT layer + XVR-EVD standalone)
 */

/**
 * @param {{ layerHandoffs?: object[], evidenceSufficient?: boolean }} snapshot
 */
export function evaluateIntRdy01(snapshot) {
  const handoffs = snapshot.layerHandoffs ?? [];
  const hasEco = handoffs.some((h) => h.kind === "ECO_FIN_S_HANDOFF" || h.kind === "ENV_ACCEPT_ECO_HANDOFF");
  const hasEnv = handoffs.some((h) => h.kind === "ENV_FIN_S_HANDOFF");
  const sufficient = hasEco && hasEnv;

  return {
    loopId: "LOOP-INT-RDY-01",
    finalizer: sufficient ? "FIN-S" : "FIN-R",
    sufficient,
    handoff: sufficient ? { target: "LOOP-INT-EVD-01", layer: "INT" } : null,
  };
}

/**
 * @param {{ docGap?: boolean }} snapshot
 */
export function evaluateIntGap01(snapshot) {
  const sufficient = snapshot.docGap !== true;
  return {
    loopId: "LOOP-INT-GAP-01",
    finalizer: sufficient ? "FIN-S" : "FIN-H",
    sufficient,
    handoff: sufficient ? null : { target: "LOOP-LEG-GAP-01" },
  };
}

/**
 * @param {{ commercialReady?: boolean }} snapshot
 */
export function evaluateIntQlt01(snapshot) {
  const sufficient = snapshot.commercialReady !== false;
  return {
    loopId: "LOOP-INT-QLT-01",
    finalizer: sufficient ? "FIN-S" : "FIN-R",
    sufficient,
  };
}

/**
 * @param {{ execSummarySynced?: boolean }} snapshot
 */
export function evaluateIntFrs01(snapshot) {
  const sufficient = snapshot.execSummarySynced !== false;
  return {
    loopId: "LOOP-INT-FRS-01",
    finalizer: sufficient ? "FIN-S" : "FIN-R",
    sufficient,
  };
}

/**
 * @param {{ evidenceSufficient?: boolean }} snapshot
 */
export function evaluateIntEvd01(snapshot) {
  const sufficient = snapshot.evidenceSufficient === true;
  return {
    loopId: "LOOP-INT-EVD-01",
    finalizer: sufficient ? "FIN-S" : "FIN-H",
    sufficient,
    handoff: sufficient ? { target: "LOOP-INT-RDY-01" } : { target: "LOOP-XVR-EVD-01" },
  };
}

/**
 * @param {{ multiDomainConflict?: boolean, evidenceSufficient?: boolean }} snapshot
 */
export function evaluateXvrEvd01(snapshot) {
  if (snapshot.multiDomainConflict) {
    return {
      loopId: "LOOP-XVR-EVD-01",
      finalizer: "FIN-H",
      sufficient: false,
      escalatesToSwarm: true,
      strategy: "STR-6",
    };
  }
  return {
    loopId: "LOOP-XVR-EVD-01",
    finalizer: snapshot.evidenceSufficient ? "FIN-S" : "FIN-R",
    sufficient: snapshot.evidenceSufficient === true,
  };
}

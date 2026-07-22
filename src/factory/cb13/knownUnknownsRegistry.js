/**
 * CB-13 — Known unknowns registry (DKN / G5)
 */

/**
 * @param {string} factoryKey
 * @param {object[]} layerBlockers
 */
export function buildDefaultKnownUnknowns(factoryKey, layerBlockers = []) {
  const base = [
    {
      id: `DKN-${factoryKey}-001`,
      domain: "valuation",
      description: "Comp set vintage — minor uncertainty",
      obligation: "Obl",
      declared: true,
    },
    {
      id: `DKN-${factoryKey}-002`,
      domain: "distress",
      description: "Contact authorization window pending",
      obligation: "Obl",
      declared: true,
    },
  ];

  for (const blocker of layerBlockers) {
    if (blocker.documented === true) {
      base.push({
        id: `DKN-${factoryKey}-BLK-${blocker.id ?? base.length}`,
        domain: blocker.domain ?? "layer",
        description: blocker.message ?? "Documented blocker",
        obligation: "Obl",
        declared: true,
      });
    }
  }

  return base;
}

/**
 * @param {object[]} unknowns
 */
export function validateKnownUnknowns(unknowns) {
  const obl = unknowns.filter((u) => u.obligation === "Obl");
  const undeclared = obl.filter((u) => u.declared !== true);
  return {
    valid: undeclared.length === 0 && obl.length > 0,
    declaredCount: obl.filter((u) => u.declared).length,
    obligationCount: obl.length,
  };
}

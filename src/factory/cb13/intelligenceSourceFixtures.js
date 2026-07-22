/**
 * CB-13 — Synthetic intelligence fixtures (no live sources)
 */

/**
 * @param {string} factoryKey
 */
export function buildIntelligenceFixtureBundle(factoryKey) {
  return {
    synthesisRef: `SYN-FIX-${factoryKey}`,
    corpusRef: `DCN-FIX-${factoryKey}`,
    releaseRef: `COM-FIX-${factoryKey}`,
    execMemoRef: `EXE-FIX-${factoryKey}`,
  };
}

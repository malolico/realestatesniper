/**
 * CB-15 — P-CONST arbiter (FFO-P resource conflict resolution)
 */

import { P_CONST_PIPELINE } from "./ffoCatalog.js";

/**
 * @param {{ code: string, resource?: string }[]} requests
 */
export function resolvePConstConflict(requests) {
  const ranked = requests
    .map((req) => {
      const entry = P_CONST_PIPELINE.find((p) => p.code === req.code);
      return { ...req, priority: entry?.priority ?? 99, label: entry?.label };
    })
    .sort((a, b) => a.priority - b.priority);

  return {
    winner: ranked[0] ?? null,
    losers: ranked.slice(1),
    rule: "FFO-P",
    message: "P-CONST P0→P9 precedence in resource conflict",
  };
}

/**
 * @param {string} code
 */
export function getPConstPriority(code) {
  const entry = P_CONST_PIPELINE.find((p) => p.code === code);
  return entry?.priority ?? null;
}

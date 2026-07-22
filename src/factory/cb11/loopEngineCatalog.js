/**
 * CB-11 — Loop Engine catalog (24 OLC loops)
 */

export const OLC_LOOP_COUNT = 24;
export const OMC_MOTOR_COUNT_CONSTITUTIONAL = 52;
export const OLC_CAP_COUNT = 26;

export const LOOP_ACTIVATOR_TYPES = Object.freeze([
  "ACT-T",
  "ACT-E",
  "ACT-V",
  "ACT-D",
  "ACT-M",
  "ACT-C",
  "ACT-R",
]);

export const STRATEGY_ESCALATION_LEVELS = Object.freeze([
  "STR-1",
  "STR-2",
  "STR-3",
  "STR-4",
  "STR-5",
  "STR-6",
]);

export const FINALIZER_TYPES = Object.freeze(["FIN-S", "FIN-C", "FIN-H", "FIN-K", "FIN-X", "FIN-R"]);

export const LOCK_POLICIES = Object.freeze(["LK-01", "LK-02", "LK-03", "LK-04"]);

/** @type {readonly { id: string, layer: string, type: string, cap: string, phase: string, integratedPhase?: string }[]} */
export const OLC_LOOP_CATALOG = Object.freeze([
  { id: "LOOP-XVR-CMP-01", layer: "XVR", type: "CMP", cap: "CAP-09", phase: "CB-03", integratedPhase: "CB-03" },
  { id: "LOOP-XVR-EVD-01", layer: "XVR", type: "EVD", cap: "CAP-20", phase: "CB-11", integratedPhase: "CB-07" },
  { id: "LOOP-XVR-CHR-01", layer: "XVR", type: "SUP", cap: "CAP-10", phase: "CB-08", integratedPhase: "CB-08" },
  { id: "LOOP-FND-SUP-01", layer: "FND", type: "SUP", cap: "CAP-01", phase: "CB-05", integratedPhase: "CB-05" },
  { id: "LOOP-FND-FRS-01", layer: "FND", type: "FRS", cap: "CAP-01", phase: "CB-05", integratedPhase: "CB-05" },
  { id: "LOOP-LEG-SUP-01", layer: "LEG", type: "SUP", cap: "CAP-05", phase: "CB-07", integratedPhase: "CB-07" },
  { id: "LOOP-LEG-GAP-01", layer: "LEG", type: "GAP", cap: "CAP-25", phase: "CB-07", integratedPhase: "CB-07" },
  { id: "LOOP-LEG-EVD-01", layer: "LEG", type: "EVD", cap: "CAP-05", phase: "CB-07", integratedPhase: "CB-07" },
  { id: "LOOP-DST-CVG-01", layer: "DST", type: "CVG", cap: "CAP-08", phase: "CB-08", integratedPhase: "CB-08" },
  { id: "LOOP-DST-SUP-01", layer: "DST", type: "SUP", cap: "CAP-11", phase: "CB-08", integratedPhase: "CB-08" },
  { id: "LOOP-DST-CNT-01", layer: "DST", type: "CMP", cap: "CAP-09", phase: "CB-08", integratedPhase: "CB-08" },
  { id: "LOOP-DST-INV-01", layer: "DST", type: "INV", cap: "CAP-08", phase: "CB-08", integratedPhase: "CB-08" },
  { id: "LOOP-ECO-SUP-01", layer: "ECO", type: "SUP", cap: "CAP-13", phase: "CB-09", integratedPhase: "CB-09" },
  { id: "LOOP-ECO-FRS-01", layer: "ECO", type: "FRS", cap: "CAP-13", phase: "CB-09", integratedPhase: "CB-09" },
  { id: "LOOP-ECO-QLT-01", layer: "ECO", type: "QLT", cap: "CAP-15", phase: "CB-09", integratedPhase: "CB-09" },
  { id: "LOOP-ECO-QLT-02", layer: "ECO", type: "QLT", cap: "CAP-16", phase: "CB-09", integratedPhase: "CB-09" },
  { id: "LOOP-ECO-FRS-02", layer: "ECO", type: "FRS", cap: "CAP-14", phase: "CB-09", integratedPhase: "CB-09" },
  { id: "LOOP-ENV-SUP-01", layer: "ENV", type: "SUP", cap: "CAP-17", phase: "CB-10", integratedPhase: "CB-10" },
  { id: "LOOP-ENV-FRS-01", layer: "ENV", type: "FRS", cap: "CAP-17", phase: "CB-10", integratedPhase: "CB-10" },
  { id: "LOOP-INT-RDY-01", layer: "INT", type: "RDY", cap: "CAP-21", phase: "CB-11" },
  { id: "LOOP-INT-GAP-01", layer: "INT", type: "GAP", cap: "CAP-22", phase: "CB-11" },
  { id: "LOOP-INT-QLT-01", layer: "INT", type: "QLT", cap: "CAP-23", phase: "CB-11" },
  { id: "LOOP-INT-FRS-01", layer: "INT", type: "FRS", cap: "CAP-24", phase: "CB-11" },
  { id: "LOOP-INT-EVD-01", layer: "INT", type: "EVD", cap: "CAP-20", phase: "CB-11" },
]);

export const OLC_PIPELINE_ORDER = Object.freeze([
  "LOOP-XVR-CMP-01",
  "FND",
  "LEG",
  "DST",
  "ECO",
  "ENV",
  "INT",
]);

/** LLK-06 — each constitutional motor supervised by ≥1 loop */
export const MOTOR_LOOP_SUPERVISION = Object.freeze({
  "MOT-IDN-01": ["LOOP-FND-SUP-01", "LOOP-FND-FRS-01"],
  "MOT-IDN-02": ["LOOP-FND-SUP-01"],
  "MOT-LOC-01": ["LOOP-FND-SUP-01", "LOOP-FND-FRS-01"],
  "MOT-LOC-02": ["LOOP-FND-SUP-01"],
  "MOT-PHY-01": ["LOOP-FND-SUP-01", "LOOP-FND-FRS-01"],
  "MOT-PHY-02": ["LOOP-FND-SUP-01"],
  "MOT-REG-01": ["LOOP-LEG-SUP-01"],
  "MOT-REG-02": ["LOOP-LEG-SUP-01"],
  "MOT-REG-03": ["LOOP-LEG-SUP-01"],
  "MOT-LEG-01": ["LOOP-LEG-SUP-01", "LOOP-LEG-EVD-01"],
  "MOT-OWN-01": ["LOOP-LEG-SUP-01"],
  "MOT-OWN-02": ["LOOP-LEG-SUP-01", "LOOP-LEG-EVD-01"],
  "MOT-LIEN-01": ["LOOP-LEG-SUP-01", "LOOP-LEG-EVD-01"],
  "MOT-OCR-01": ["LOOP-LEG-GAP-01"],
  "MOT-OCR-02": ["LOOP-LEG-GAP-01"],
  "MOT-MOT-01": ["LOOP-DST-CVG-01", "LOOP-DST-INV-01"],
  "MOT-MOT-02": ["LOOP-DST-CVG-01"],
  "MOT-MOT-03": ["LOOP-DST-CVG-01"],
  "MOT-MOT-04": ["LOOP-DST-CVG-01"],
  "MOT-MOT-05": ["LOOP-DST-CVG-01"],
  "MOT-CNT-01": ["LOOP-DST-CNT-01", "LOOP-XVR-CMP-01"],
  "MOT-CNT-02": ["LOOP-DST-CNT-01"],
  "MOT-CMP-01": ["LOOP-XVR-CMP-01"],
  "MOT-CHR-01": ["LOOP-XVR-CHR-01", "LOOP-DST-INV-01"],
  "MOT-CHR-02": ["LOOP-XVR-CHR-01"],
  "MOT-JUD-01": ["LOOP-DST-SUP-01", "LOOP-DST-INV-01"],
  "MOT-LFE-01": ["LOOP-DST-SUP-01", "LOOP-DST-INV-01"],
  "MOT-LFE-02": ["LOOP-DST-SUP-01"],
  "MOT-LFE-03": ["LOOP-DST-SUP-01"],
  "MOT-LFE-04": ["LOOP-DST-SUP-01"],
  "MOT-COD-01": ["LOOP-DST-SUP-01"],
  "MOT-FIN-01": ["LOOP-ECO-FRS-01", "LOOP-ECO-SUP-01"],
  "MOT-FIN-02": ["LOOP-ECO-FRS-01"],
  "MOT-FIN-03": ["LOOP-ECO-FRS-01"],
  "MOT-HAZ-01": ["LOOP-ECO-FRS-02"],
  "MOT-HAZ-02": ["LOOP-ECO-FRS-02"],
  "MOT-MKT-01": ["LOOP-ECO-QLT-01"],
  "MOT-MKT-02": ["LOOP-ECO-QLT-01"],
  "MOT-MKT-03": ["LOOP-ECO-QLT-01"],
  "MOT-INV-01": ["LOOP-ECO-QLT-02"],
  "MOT-INV-02": ["LOOP-ECO-QLT-02"],
  "MOT-CTX-01": ["LOOP-ENV-SUP-01", "LOOP-ENV-FRS-01"],
  "MOT-CTX-02": ["LOOP-ENV-SUP-01"],
  "MOT-LIV-01": ["LOOP-ENV-SUP-01", "LOOP-ENV-FRS-01"],
  "MOT-LIV-02": ["LOOP-ENV-SUP-01"],
  "MOT-LIV-03": ["LOOP-ENV-SUP-01"],
  "MOT-FUT-01": ["LOOP-ENV-SUP-01", "LOOP-ENV-FRS-01"],
  "MOT-EVD-01": ["LOOP-XVR-EVD-01", "LOOP-INT-EVD-01"],
  "MOT-EVD-02": ["LOOP-XVR-EVD-01", "LOOP-INT-EVD-01"],
  "MOT-SYN-01": ["LOOP-INT-RDY-01"],
  "MOT-SYN-02": ["LOOP-INT-RDY-01"],
  "MOT-DCN-01": ["LOOP-INT-GAP-01", "LOOP-INT-QLT-01"],
  "MOT-DCN-02": ["LOOP-INT-GAP-01"],
  "MOT-DCN-03": ["LOOP-INT-QLT-01"],
  "MOT-COM-01": ["LOOP-INT-QLT-01"],
  "MOT-EXE-01": ["LOOP-INT-FRS-01"],
});

/** CAP → supervising loops */
export const CAP_LOOP_COVERAGE = Object.freeze(
  Object.fromEntries(
    Array.from({ length: OLC_CAP_COUNT }, (_, i) => {
      const cap = `CAP-${String(i + 1).padStart(2, "0")}`;
      const loops = OLC_LOOP_CATALOG.filter((l) => l.cap === cap).map((l) => l.id);
      const fromMotors = [
        ...new Set(
          Object.entries(MOTOR_LOOP_SUPERVISION)
            .filter(([motorId]) => {
              const capNum = cap.replace("CAP-", "");
              return motorId; // filled below via motor catalog caps in validation
            })
            .flatMap(([, ls]) => ls)
        ),
      ];
      return [cap, loops.length > 0 ? loops : fromMotors];
    })
  )
);

// Enrich CAP coverage from motor supervision via known cap bindings
const CAP_BINDINGS = {
  "CAP-01": ["LOOP-FND-SUP-01", "LOOP-FND-FRS-01"],
  "CAP-02": ["LOOP-FND-SUP-01", "LOOP-FND-FRS-01"],
  "CAP-03": ["LOOP-FND-SUP-01", "LOOP-FND-FRS-01"],
  "CAP-04": ["LOOP-LEG-SUP-01"],
  "CAP-05": ["LOOP-LEG-SUP-01", "LOOP-LEG-EVD-01"],
  "CAP-06": ["LOOP-LEG-SUP-01", "LOOP-LEG-EVD-01"],
  "CAP-07": ["LOOP-LEG-SUP-01", "LOOP-LEG-EVD-01"],
  "CAP-08": ["LOOP-DST-CVG-01", "LOOP-DST-INV-01", "LOOP-DST-SUP-01"],
  "CAP-09": ["LOOP-DST-CNT-01", "LOOP-XVR-CMP-01"],
  "CAP-10": ["LOOP-XVR-CHR-01"],
  "CAP-11": ["LOOP-DST-SUP-01"],
  "CAP-12": ["LOOP-DST-SUP-01", "LOOP-DST-INV-01"],
  "CAP-13": ["LOOP-ECO-SUP-01", "LOOP-ECO-FRS-01"],
  "CAP-14": ["LOOP-ECO-FRS-02"],
  "CAP-15": ["LOOP-ECO-QLT-01"],
  "CAP-16": ["LOOP-ECO-QLT-02"],
  "CAP-17": ["LOOP-ENV-SUP-01", "LOOP-ENV-FRS-01"],
  "CAP-18": ["LOOP-ENV-SUP-01"],
  "CAP-19": ["LOOP-ENV-SUP-01", "LOOP-ENV-FRS-01"],
  "CAP-20": ["LOOP-XVR-EVD-01", "LOOP-INT-EVD-01"],
  "CAP-21": ["LOOP-INT-RDY-01"],
  "CAP-22": ["LOOP-INT-GAP-01", "LOOP-INT-QLT-01"],
  "CAP-23": ["LOOP-INT-QLT-01"],
  "CAP-24": ["LOOP-INT-FRS-01"],
  "CAP-25": ["LOOP-LEG-GAP-01", "LOOP-INT-GAP-01"],
  "CAP-26": ["LOOP-DST-SUP-01"],
};

export function getCapLoopCoverage(capId) {
  return CAP_BINDINGS[capId] ?? [];
}

export function getLoopEntry(loopId) {
  return OLC_LOOP_CATALOG.find((l) => l.id === loopId) ?? null;
}

export function isRegisteredLoop(loopId) {
  return OLC_LOOP_CATALOG.some((l) => l.id === loopId);
}

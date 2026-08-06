# STRATEGIC PROGRAM 04 — INTELLIGENCE ALIVE  
## SP04-WP04 / D4 — INTELLIGENCE SOURCE POSTURE MAP  
### Documentary deliverable · source posture for SP04 (cite-only)

| Campo | Valor |
|-------|--------|
| **Document ID** | `FACTORY_EVOLUTION_SP04_D4_INTELLIGENCE_SOURCE_POSTURE_MAP.md` |
| **Path** | `docs/factory-evolution/FACTORY_EVOLUTION_SP04_D4_INTELLIGENCE_SOURCE_POSTURE_MAP.md` |
| **Nature** | Continuity documentary deliverable **D4** — maps Intelligence Alive–relevant information sources and their operational posture · **DOCUMENTATION ONLY** · cite-only · **≠ IMPL · ≠ redesign · ≠ Live authorization · ≠ Engineering start · ≠ SP04 COMPLETE** |
| **Deliverable ID** | **D4** |
| **Work package** | **WP-04** — Intelligence source posture mapping (Director-ordered D4 instrument; Continuity documentary path under SP04-02 / SP04-03) |
| **Parent constitution** | SP04-01 — Continuity Commit **`08567bd328711628546c73bd6468e60b38a6f2f3`** |
| **Parent Plan / Mandate / Status** | SP04-02 **`6a39725…`** · SP04-03 **`eaade2c…`** · SP04-04 **`81843d8…`** |
| **Antecedent D1** | Continuity Commit **`62e6f273c960b795e0b2d3c82fe11934dd7bce14`** |
| **Antecedent D2** | Continuity Commit **`be55fd2a92b092a653e9d6bed86e71e6bd171f80`** |
| **Antecedent D3** | Continuity Commit **`a88cd81430108eeccf9679621d2edfcbab8572f3`** |
| **Date** | **2026-08-06** |
| **Branch (context only)** | `integration/factory-complete-20260725` |
| **HEAD (context only)** | `a88cd81430108eeccf9679621d2edfcbab8572f3` |
| **Publication** | **NOT CLAIMED BY THIS DOCUMENT** |

```text
D4 = DOCUMENTARY INTELLIGENCE SOURCE POSTURE MAP ONLY

Implementation = NOT STARTED
Engineering    = NOT STARTED
SP05–SP08      = NOT OPENED

Source posture vocabulary:
  REAL | RECORDED | SYNTHETIC | FIXTURE | STUB | HYBRID | UNKNOWN

Evidence determination vocabulary:
  PROVED | PARTIALLY PROVED | NOT PROVED | OUT OF SCOPE
```

---

## 0. Absolute Non-Implementation Banner

This map **records** the operational posture of information sources relevant to Intelligence Alive.

It does **not** implement, redesign, authorize Live, start Engineering, close SP03 residuals, or open SP05…SP08.

**Preserved posture:**

```text
SP01 COMPLETE · SP02 COMPLETE · SP03 COMPLETE = PRESERVED
SP04-01…04 · D1 · D2 · D3                     = PRESERVED
Engineering COMPLETE (SP03)                   = IMMUTABLE
Blueprint / CCD / Runtime / Hardening / P-INT = INTACT
SP03 residuals (OBS-05 / §4-DEF / OBS-VAT)    = UNCHANGED
SP05–SP08                                     = NOT OPENED
```

**Honesty rule (SP04-01 / D2):** RECORDED ≠ REAL Live · FIXTURE/SYNTHETIC/STUB ≠ living real-knowledge Intelligence Alive · construction presence ≠ posture arrival.

**Exclusive evidence baseline:** SP04-01 §§9–10 · D1 dependency inventory · D2 RK map · D3 dispositions · cited source paths.

---

## 1. Posture vocabulary (binding)

| Posture | Meaning for D4 |
|---------|----------------|
| **REAL** | Live / non-substitute Factory-admitted knowledge under authorized Live regime |
| **RECORDED** | Offline RECORDED_ONLY / recorded-pack admitted knowledge (not Live) |
| **SYNTHETIC** | Generated or synthetic intelligence/source payloads used as primary input |
| **FIXTURE** | Test/construction fixture bundles substituted for live sources |
| **STUB** | Non-executing or non-inference stub path (handlers/assist/coordination) |
| **HYBRID** | Mixed postures in one surface (e.g. synthetic↔RECORDED preference) |
| **UNKNOWN** | Posture not decidable from published evidence alone |

| Determination | Meaning for D4 |
|---------------|----------------|
| **PROVED** | Posture of the source is proved by repository evidence |
| **PARTIALLY PROVED** | Posture partially evidenced or honesty-bound |
| **NOT PROVED** | Claimed/desired posture (e.g. REAL living) not proved |
| **OUT OF SCOPE** | Source/surface outside SP04 Intelligence Alive |

---

## 2. Source posture matrix (primary)

| ID | Information source / surface | Repository locus | Operational posture | Posture determination | Notes / crosswalk |
|----|------------------------------|------------------|---------------------|----------------------|-------------------|
| **SRC-01** | CB-13 synthetic intelligence fixtures | `src/factory/cb13/intelligenceSourceFixtures.js` | **FIXTURE** / **SYNTHETIC** | **PROVED** | “no live sources”; D1 INV-16; D2 RK-06; D3 DEF-02 |
| **SRC-02** | CB-13 INT motor handlers (default execution) | `intelligenceMotorHandlers.js` | **STUB** (+ fixture inputs) | **PROVED** | D1 INV-02; D3 DEF-01 |
| **SRC-03** | CB-13 INT loops LOOP-INT-* inputs | `loopInt*.js` + fixture bundle | **FIXTURE** / **SYNTHETIC** | **PROVED** | D1 INV-03; D2 RK-03 |
| **SRC-04** | CB-14 AIA assist execution | `aiaAssistStub.js` (`aiExecution: false`) | **STUB** | **PROVED** | D1 INV-09; D3 DEF-03 |
| **SRC-05** | CB-14 AIA layer (governance path) | `aiaCatalog.js`; PRH/AUT/RLG | **STUB**-backed assist · governance **not** a knowledge source | **PROVED** (stub assist) | D1 INV-07/08; D2 RK-08/10 |
| **SRC-06** | CB-12 swarm coordination | `swarmCoordinationStub.js` | **STUB** | **PROVED** | D1 INV-10; D3 DEF-04 |
| **SRC-07** | CB-11 INT loop stubs | `integrationLoopStubs.js` | **STUB** | **PROVED** | D1 dep inventory |
| **SRC-08** | CB-04 stub motor handlers | `stubMotorHandlers.js` | **STUB** | **PROVED** | D1 dep inventory |
| **SRC-09** | Foundation source fixtures / RECORDED preference | `foundationSourceFixtures.js` | **HYBRID** (**SYNTHETIC** ↔ **RECORDED**) | **PROVED** | D1/D2; SP03 honesty |
| **SRC-10** | RECORDED_ONLY pack enrichment admission | `recordedPackEnrichmentAdapter.js`; Maricopa RECORDED_ONLY | **RECORDED** | **PROVED** | Live **NOT PROVED**; D1 INV-17; D2 RK-17; D3 DEF-06 DEFER |
| **SRC-11** | CB-06 → CB-13 evidence ingest upstream | `intelligenceEvidenceIngest.js` | **UNKNOWN**→upstream (**HYBRID** possible) | **PARTIALLY PROVED** | Depends on admitted objects; D2 RK-07 |
| **SRC-12** | SP03 VAT / recorded vitality tip evidentiary objects | VAT Implementation Status; Eng COMPLETE | **RECORDED** (evidentiary) | **PARTIALLY PROVED** | ≠ Intelligence Alive; D1 INV-18; D3 DEF-07/08 ACCEPT |
| **SRC-13** | Orchestration edge stub executor path | `services/factory-orchestration-edge/` | **STUB** (residual) | **PARTIALLY PROVED** | D1 INV-11; D2 RK-12 |
| **SRC-14** | Official catalogs OMC/OLC/OSC/OAC / FFO | `docs/auditoria-maestra/` | **OUT OF SCOPE** as live knowledge source (canon only) | **OUT OF SCOPE** | Consume-only; D1 INV-13 |
| **SRC-15** | CB-16 Decision Package producer inputs | `src/factory/cb16/` | **OUT OF SCOPE** as Decision Engine source | **OUT OF SCOPE** | Factory producer ≠ SP05; D3 GAP-DE |
| **SRC-16** | Live HTTP / live DSO / live LLM knowledge | Absent authorized living end-state | Desired **REAL** | **NOT PROVED** | D1 INV-19; D2 RK-21; D3 GAP-LIVE-LLM / DEF-02/03 |
| **SRC-17** | Living real-knowledge Intelligence Alive primary source posture | No Continuity Status proving REAL living INT/AIA analysis | Desired **REAL** | **NOT PROVED** | D2 §3; D3 GAP-RK-IA |
| **SRC-18** | Product / Marketplace / Publication commercial sources | Mandate exclusions; ACC-05/06 | **OUT OF SCOPE** | **OUT OF SCOPE** | D3 GAP-PROD-MKT / PUB |
| **SRC-19** | P-INT-02 Live connector regime | SP02 Gap Disposition; contracts Live not closed | Desired **REAL** (Live) | **NOT PROVED** | D3 DEF-06 **DEFER** |
| **SRC-20** | TD-HANDLERS live enrichment residual | Continuity | **UNKNOWN** / deferred live enrichment | **PARTIALLY PROVED** (residual documented) · arrival **NOT PROVED** | D3 DEF-05 **DEFER** |

---

## 3. Source posture summary

### 3.1 Dominant operational posture for SP04 Intelligence paths

```text
DEFAULT INT/AIA EXECUTION POSTURE = FIXTURE + SYNTHETIC + STUB
RECORDED ADMISSION POSTURE        = PROVED (Offline/RECORDED_ONLY)
REAL (Live) POSTURE               = NOT PROVED
HYBRID FOUNDATION PREFERENCE      = PROVED (synthetic↔RECORDED)
```

| Posture | Source IDs (primary) | Count (primary labels) |
|---------|----------------------|------------------------|
| **FIXTURE** | SRC-01, SRC-03 | **2** |
| **SYNTHETIC** | SRC-01 (dual), SRC-03 (dual) | counted with FIXTURE |
| **STUB** | SRC-02, SRC-04, SRC-05, SRC-06, SRC-07, SRC-08, SRC-13 | **7** |
| **RECORDED** | SRC-10, SRC-12 | **2** |
| **HYBRID** | SRC-09 | **1** |
| **REAL** | *(none proved)* · SRC-16/17/19 desired only | **0 PROVED** |
| **UNKNOWN** | SRC-11 (upstream), SRC-20 | **2** |
| **OUT OF SCOPE** | SRC-14, SRC-15, SRC-18 | **3** |

### 3.2 Evidence determination summary

| Determination | Source IDs | Count |
|---------------|------------|-------|
| **PROVED** | SRC-01…10 (posture as labeled) | **10** |
| **PARTIALLY PROVED** | SRC-11, SRC-12, SRC-13, SRC-20 | **4** |
| **NOT PROVED** | SRC-16, SRC-17, SRC-19 (REAL/Live) | **3** |
| **OUT OF SCOPE** | SRC-14, SRC-15, SRC-18 | **3** |

---

## 4. Implications for Intelligence Alive (documentary)

| Implication | Determination |
|-------------|---------------|
| SP04 currently operates INT/AIA primarily on **FIXTURE / SYNTHETIC / STUB** postures | **PROVED** |
| Factory can **admit RECORDED** knowledge via Offline adapters | **PROVED** |
| Living Intelligence Alive on **REAL** knowledge | **NOT PROVED** |
| RECORDED admission alone = Intelligence Alive | **NOT PROVED** (honesty) |
| Live Integration closure as SP04 synonym | **NOT PROVED** · **DEFER** (D3 DEF-06) |
| Source posture redesign / new connectors by this file | **OUT OF SCOPE** / **FORBIDDEN** |

---

## 5. Crosswalk to D1 / D2 / D3

| Antecedent | D4 confirmation |
|------------|-----------------|
| D1 fixture/stub dependency **PROVED** | Confirmed — SRC-01…08 |
| D2 living RK IA contribution **NOT PROVED** | Confirmed — SRC-16/17 **NOT PROVED** |
| D3 DEF-01…04 **REQUIRE MANDATE** | Confirmed — stub/fixture/synthetic postures **PROVED** |
| D3 DEF-06/05 **DEFER** | Confirmed — SRC-19/20 |
| D3 DEF-07/08 **ACCEPT** | Confirmed — SRC-12 RECORDED evidentiary; residuals unchanged |

---

## 6. D4 determination

| # | Determination |
|---|---------------|
| D4-1 | Intelligence Alive–relevant sources SRC-01…SRC-20 are posture-mapped |
| D4-2 | Dominant INT/AIA operational posture is **FIXTURE / SYNTHETIC / STUB** — **PROVED** |
| D4-3 | **RECORDED** admission posture is **PROVED**; **REAL** Live posture is **NOT PROVED** |
| D4-4 | Catalogs / Decision Engine / Product-Marketplace-Publication sources remain **OUT OF SCOPE** |
| D4-5 | This deliverable does **not** start Implementation or Engineering |
| D4-6 | Next documentary WP under Plan = **WP-05 / D5** Non-Redesign Confirmation Record (when Continuity-ordered) |

```text
D4 COMPLETE AS DOCUMENTARY SOURCE POSTURE MAP
≠ IMPLEMENTATION STARTED
≠ ENGINEERING STARTED
≠ LIVE AUTHORIZED
≠ REAL POSTURE ARRIVED
≠ SP04 COMPLETE
```

---

## Binding footer

```text
SP04-WP04 / D4 = INTELLIGENCE SOURCE POSTURE MAP
DOCUMENTATION ONLY · REPOSITORY EVIDENCE ONLY

FIXTURE/SYNTHETIC/STUB = PROVED (dominant INT/AIA)
RECORDED ADMISSION     = PROVED
REAL (LIVE)            = NOT PROVED

PRESERVES: SP01–SP03 COMPLETE · SP04-01…04 · D1–D3 ·
           Engineering COMPLETE IMMUTABLE ·
           Blueprint/CCD/Runtime/Hardening/P-INT ·
           SP05–SP08 NOT OPENED · SP03 residuals UNCHANGED
```

---

**END OF SP04-WP04 / D4 — INTELLIGENCE SOURCE POSTURE MAP**

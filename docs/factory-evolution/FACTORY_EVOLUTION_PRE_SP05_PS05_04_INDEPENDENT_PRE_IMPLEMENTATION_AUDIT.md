# PRE-SP05 CONTINUITY WORKSTREAM
## PS05-04 — INDEPENDENT PRE-IMPLEMENTATION AUDIT
### Real Domain Path + Economics + Distress + Multi-Source E2E
#### Document ID: PRE-SP05-PS05-04-PRE-IMPL

| Campo | Valor |
|-------|--------|
| **Document ID** | **`PRE-SP05-PS05-04-PRE-IMPL`** |
| **Audit ID** | **`PRE-SP05-PS05-04-PRE-IMPL`** |
| **Document type** | Independent Pre-Implementation Audit (Engineering class) |
| **File ID** | `FACTORY_EVOLUTION_PRE_SP05_PS05_04_INDEPENDENT_PRE_IMPLEMENTATION_AUDIT.md` |
| **Path** | `docs/factory-evolution/FACTORY_EVOLUTION_PRE_SP05_PS05_04_INDEPENDENT_PRE_IMPLEMENTATION_AUDIT.md` |
| **Parent Mandate** | `PRE-SP05-PS05-04-ENG-IMPL` · `docs/factory-evolution/FACTORY_EVOLUTION_PRE_SP05_PS05_04_ENGINEERING_IMPLEMENTATION_MANDATE.md` |
| **Nature** | STRICT READ ONLY technical + documentary freeze · **no code** · **no data acquisition** · **≠ EXECUTE** · **≠ IMPL** · **≠ SP05 OPEN** |
| **Audit tip at drafting** | Parent tip **`3b3b54d86005fc5f0b613b1358125e4a676467c8`** (PS05-03 COMPLETE) · Mandate published in prior selective commit on same branch |
| **Date** | **2026-08-12** |
| **Branch** | `integration/factory-complete-20260725` |
| **Verdict** | **PASS WITH OBSERVATIONS** |

```text
THIS AUDIT ≠ CODE AUTHORIZATION
THIS AUDIT ≠ REAL-DATA ACQUISITION AUTHORIZATION
PASS WITH OBSERVATIONS ≠ IMPLEMENTATION STARTED
EXTERNAL AUTHORIZATION REQUIRED = YES (for RECORDED REAL packs)
```

---

## 0. Entry / scope honesty

| Check | Result |
|-------|--------|
| PS05-00…03 COMPLETE | YES |
| SP05 | NOT OPENED |
| PS05-05 | NOT OPENED |
| Application code modified this audit | NO |
| External data acquired this audit | NO |
| Mandate bound to M04/M05/P01/P02/P06/P07 | YES |

---

## 1. Controlling precedent

Minimum documentary mechanism (confirmed):

1. Engineering Implementation Mandate
2. Independent Pre-Implementation Audit

No CEP matrix. No new Strategic Program. No Grant/Disposition required for Mandate/Pre-IMPL publication.

Lifecycle mirrors PS05-01/02/03; closest technical precedents: SP03 `RECORDED` pack enrichment, PS05-01 stub isolation (`withStubTrust` / `SYNTHETIC_FIXTURE`), PS05-02/03 envelope + truth-accounting.

---

## 2. Technical trace (read-only)

### 2.1 CB-09 Economy — Decision-facing stubs (M04)

**Surface:** `src/factory/cb09/economyMotorHandlers.js` (+ `economySourceFixtures.js`)

| Output | Example value | Classification |
|--------|---------------|----------------|
| equity | `125000` | **HARDCODED / STUB** (wrapped `withStubTrust` / `SYNTHETIC_FIXTURE` / `decisionTrusted: false`) |
| mortgageBalance | `180000` | **HARDCODED / STUB** |
| taxStatus | `"current"` | **HARDCODED / STUB** |
| submarket | `"Phoenix-NW"` | **HARDCODED / STUB** |
| valueRange | `{310000, 335000}` | **HARDCODED / STUB** |
| roi | `0.14` | **HARDCODED / STUB** |
| strategies | `["flip"]` (and related) | **HARDCODED / STUB** |

**No** recorded-pack → economy enrichment path analogous to CB-05/06 recorded enrichment was found. Fixtures only.

**Deficit M04:** Decision-relevant economics are synthetic placeholders. Even with `decisionTrusted: false`, CB-16 validation still locks `equity === 125000` in PS05-01-era assertions — regression surface for honesty remediation.

### 2.2 CB-08 Distress — Decision-facing stubs (M05)

**Surface:** `src/factory/cb08/distressMotorHandlers.js` (+ `distressSourceFixtures.js`)

| Output class | Examples | Classification |
|--------------|----------|----------------|
| Fixed weights | pre_foreclosure `0.35`, tax_delinquency `0.25`, … | **HARDCODED / STUB** |
| Event/transaction/case counts | CHR/JUD/LFE/COD/CNT style counts | **HARDCODED / STUB** |
| Flags | probateActive, auctionNotice, … | **HARDCODED / STUB** |

Same stub-trust wrap pattern. **No** source-backed distress consume from RECORDED packs in current CB-08 path.

**Deficit M05:** Fake distress/motivation signals can appear in motor outputs; must become evidenced/derived or UNKNOWN/UNAVAILABLE before Decision-facing trust.

### 2.3 Adjacent CBs (preserve)

| CB | Role for PS05-04 | Mutation |
|----|------------------|----------|
| CB-05 foundation / identity | Preserve P03 / I05/I06 | Thin consume only if needed |
| CB-06 evidence | Preserve P04/P05 | Read-only reference; optional thin consume |
| CB-13 intelligence | Preserve honesty (DKN/G5) | Thin only if economics/distress markers flow |
| CB-16 handoff | Must receive evidenced or honest-unknown econ/distress (T14) | Thin validate unlock + optional `truthAccounting`-style additive section only if Pre-IMPL EXECUTE confirms necessity |
| CB-02 envelopes/completeness | Preserve PS05-03 | Do not regress |

### 2.4 Recorded packs / sources

| Item | Finding |
|------|---------|
| Pack path | `data/factory-dso-packs/maricopa/pilot-001` |
| Mode | `sourceMode: RECORDED`, `liveFetch: false` |
| Content class | **RECORDED SYNTHETIC** (`MC-SYN-PARCEL-001` / synthetic Maricopa notes) |
| RECORDED REAL in repo | **NO** |
| LIVE sources authorized/active | **0** (`LIVE_NOT_AUTHORIZED`) |
| Organisms present in synthetic pack | Assessor / GIS / related RECORDED synthetic organisms — **not real** |

### 2.5 Architecture redesign required?

**NO.** Extend handler honesty + optional recorded-real mapping + validators. Preserve stub-trust vocabulary; promote UNKNOWN when no evidence.

---

## 3. Determinations required by Mandate §13

### 3.1 Exact M04 / M05 deficits

- **M04:** All Decision-relevant economic numeric/categorical outputs listed in §2.1 are HARDCODED/STUB, not REAL SOURCE-DERIVED.
- **M05:** Distress weights/signals/flags listed in §2.2 are HARDCODED/STUB, not source-backed.

### 3.2 Minimum mutation required

1. CB-09 handlers: stop emitting fabricated equity/ROI/valueRange/mortgageBalance/submarket-as-fact as Decision-facing numbers; emit **UNKNOWN / UNAVAILABLE / NOT_PROVED** (or evidenced derivation with lineage) when no RECORDED REAL / evidenced inputs.
2. CB-08 handlers: same for distress weights/signals.
3. Validators: T01–T15; unlock CB-16 `equity === 125000` regression lock.
4. Optional thin recorded-real consume helpers **after** RECORDED REAL packs exist under separate acquisition authorization.
5. Do **not** build full valuation or nationwide distress engines.

### 3.3 Real-data proof substrate

| Proof | Substrate |
|-------|-----------|
| P01 | ≥1 RECORDED REAL property pack traversing trusted path without synthetic substitution |
| P02 | Same property identity from ≥2 independent RECORDED REAL sources (prefer Assessor + GIS; Recorder if available) |
| P06 | Evidenced economic derivation **or** UNKNOWN for minimum metric set |
| P07 | Evidenced distress **or** honest UNKNOWN/absent through CB-16 |

**Honesty-only (UNKNOWN) without real packs** can advance M04/M05 / I11/I12 / P06/P07-as-unknown, but **cannot** close P01/P02/I14.

### 3.4 Real data currently in repo?

**NO** (RECORDED REAL). **YES** RECORDED SYNTHETIC only.

### 3.5 Lawful bounded acquisition method (proposed — not activated)

**Class A preferred:** lawfully obtained offline / manually supplied public-record extracts for one Maricopa (or other authorized) real parcel:

- Assessor extract (parcel ID, situs, assessed/tax fields as public);
- GIS extract (parcel geometry / APN linkage);
- optional Recorder extract if lawfully obtainable offline;

Stored as Factory `RECORDED` packs with explicit **`contentClass: RECORDED_REAL`** (or equivalent Mandate-frozen marker) distinct from synthetic pilot.

**Forbidden in acquisition:** credentials, scraping, Live fetch, contact enrichment, skip tracing, unnecessary PII (phone/email).

**Class C (public API without credentials):** only if later separately authorized and architecture already supports it — **not** activated by this audit; not required if offline extracts suffice.

### 3.6 Exact writable paths (frozen)

| Path | Role |
|------|------|
| `src/factory/cb09/economyMotorHandlers.js` | EXTEND honesty / UNKNOWN / evidenced |
| `src/factory/cb09/economySourceFixtures.js` | EXTEND fixtures |
| `src/factory/cb09/validateCb09.js` | EXTEND T01–T04/T07/T14-related |
| `src/factory/cb08/distressMotorHandlers.js` | EXTEND honesty / UNKNOWN / evidenced |
| `src/factory/cb08/distressSourceFixtures.js` | EXTEND fixtures |
| `src/factory/cb08/validateCb08.js` | EXTEND T05–T06/T08/T14-related |
| `src/factory/cb16/validateCb16.js` | EXTEND unlock stub equity lock; T14/T15 |
| Optional NEW: `src/factory/cb09/*recorded*Enrichment*.js` (or thin helper under cb09) | Only if needed to map RECORDED REAL → economy envelope |
| Optional NEW: `src/factory/cb08/*recorded*Enrichment*.js` (or thin helper under cb08) | Only if needed for distress |
| Optional thin FND/INT/CB-16 consume hooks | Only if Pre-IMPL EXECUTE confirms propagation gap |
| `data/factory-dso-packs/<jurisdiction>/<real-pilot>/` | **NEW RECORDED REAL packs — only after separate Director acquisition authorization** |
| Documentary Complete Status (later) | After post-IMPL PASS |

### 3.7 Exact read-only references

- `src/factory/cb05/**`, `src/factory/cb06/**`, `src/factory/cb13/**` (preserve)
- `src/factory/cb02/decisionFactEnvelope.js`, completeness, conflictExport (preserve)
- `data/factory-dso-packs/maricopa/pilot-001/**` as **negative** substrate (T09 — must not satisfy real-data proof)
- PS05-01/02/03 Complete Status + Mandates (invariants)

### 3.8 Exact validation paths

- `validateCb08.js`, `validateCb09.js`, `validateCb16.js` (primary)
- Existing CB-05/06/13/02 validators must remain PASS (T15)

### 3.9 Exact negative tests (T01–T15) — binding for IMPL

| ID | Requirement |
|----|-------------|
| T01 | Hardcoded equity cannot appear as evidenced/trusted economics |
| T02 | Hardcoded ROI cannot appear as evidenced/trusted economics |
| T03 | Missing valuation inputs → UNKNOWN, not fabricated value |
| T04 | Missing debt/mortgage evidence → UNKNOWN, not fabricated balance |
| T05 | Stub distress signal cannot appear as evidenced distress |
| T06 | No distress evidence → UNKNOWN/absent, not fake ± signal |
| T07 | Economic derived fact retains input lineage |
| T08 | Distress derived fact retains source lineage |
| T09 | Synthetic / RECORDED-SYNTHETIC cannot satisfy real-data proof |
| T10 | ≥2 real sources resolve to one real property (P02) |
| T11 | Source failure preserves PS05-01 fail-closed |
| T12 | PS05-02 identity/jurisdiction preserved |
| T13 | PS05-03 provenance/type/completeness/freshness/conflict preserved |
| T14 | CB-16 receives only evidenced or honest-unknown economics/distress |
| T15 | Existing affected CB validations remain PASS |

### 3.10 Can P01/P02 complete in one block?

**YES in one PS05-04 block**, **if and only if** RECORDED REAL substrate is authorized and introduced in the same IMPL window.
**NO** if only synthetic packs remain — then P01/P02/I14 remain open even if M04/M05 honesty (UNKNOWN) lands.

### 3.11 External acquisition requires separate Director authorization?

**YES.**

Before any RECORDED REAL file is added to the repo, Director must authorize:

1. Lawful offline (or manually supplied) public-record extract method;
2. Exact jurisdiction + parcel selection;
3. Minimum organisms (Assessor + GIS preferred; Recorder optional);
4. Explicit bans: no credentials, scraping, Live, contact enrichment, skip tracing, unnecessary PII;
5. Pack path + `RECORDED_REAL` content-class marker.

**Honesty remediation code** (stub → UNKNOWN) may be Director-EXECUTE’d without real packs, but **must not** claim P01/P02/I14 closed. Full PS05-04 Complete Status requires acquisition + multi-source proof **or** an amended Director disposition narrowing PS05-04 (not recommended; Mandate binds P01/P02).

---

## 4. Proof designs (frozen)

### P01 — Real-data E2E

One RECORDED REAL property identity must traverse foundation → evidence/enrichment path → economy/distress honesty layer → CB-16 handoff **without** substituting synthetic pilot values. Marker: pack `contentClass` (or equivalent) ≠ SYNTHETIC; T09 fails if synthetic used.

### P02 — Multi-source

Same resolved property identity from ≥2 independent RECORDED REAL sources (Assessor + GIS preferred). Architecture already has multi-organism recorded packs; extend to real content class.

### P06 — Economic input

For minimum metric set (equity or proxy, debt/mortgage, ROI/return, value band, Decision-facing submarket/geography): each metric is evidenced/derived with lineage **or** UNKNOWN. Fabrication forbidden. UNKNOWN is acceptable when public-record extract lacks debt/ROI fields.

### P07 — Distress input

If extract contains distress-relevant public facts (e.g. tax delinquency, recorded notice fields lawfully present): prove source-backed emission + lineage.
If not: prove UNKNOWN/absent survives to CB-16 (positive distress not required).

---

## 5. Observations (non-blocking)

| ID | Observation |
|----|-------------|
| OBS-NO-REAL-DATA | Repo has zero RECORDED REAL packs at audit tip; P01/P02 gated on separate acquisition auth |
| OBS-CB16-EQUITY-LOCK | `validateCb16` currently asserts stub equity `125000` — must evolve carefully under T01/T14/T15 |
| OBS-STUB-TRUST-WRAP | Existing `decisionTrusted: false` / SYNTHETIC_FIXTURE is necessary but insufficient; numbers must not remain as fake Decision-facing payloads |
| OBS-P03-SUBSTRATE | Prior OBS-P03-SUBSTRATE (PS05-03) preserved; do not remediate unless Mandated |
| OBS-SCOPE-NARROW | Full valuation / nationwide distress engines remain out of scope |

---

## 6. Regression risks

- Unlocking CB-16 equity lock without T01/T14 coverage → silent regression of honesty.
- Mapping synthetic pack fields into “real” economics → false P01/P02.
- Over-mutating CB-05/06/13 → PS05-02/03 regression.
- Introducing Live/credentials under “temporary” proof → Mandate violation.
- Claiming Complete Status before RECORDED REAL + T10.

---

## 7. Verdict

**PASS WITH OBSERVATIONS**

Blockers: **NONE** for Mandate/Pre-IMPL publication and for planning honesty remediation.

**Gate for full PS05-04 closure:** separate Director authorization for RECORDED REAL acquisition **before** packs are introduced and before P01/P02/I14 may be claimed.

```text
CODE IMPL        = WAITING Director EXECUTE (after this Pre-IMPL)
REAL DATA PACKS  = WAITING separate Director acquisition authorization
SP05             = NOT OPENED
PS05-05          = NOT OPENED
```

---

## 8. Exact next step

1. **Separate Director authorization** for bounded lawful offline RECORDED-REAL public-record extracts (Assessor + GIS minimum; optional Recorder; no credentials/scraping/Live/PII enrichment) for one real property.
2. Only after that authorization (and pack introduction under its terms): **Director EXECUTE** for PS05-04 code IMPL on frozen writable surfaces + T01–T15.

Honesty-only UNKNOWN remediation **without** real packs is insufficient to complete PS05-04 under the Mandate’s P01/P02 obligations; do not open Complete Status on UNKNOWN-only.

**DO NOT IMPLEMENT** until EXECUTE. **DO NOT ACQUIRE** until acquisition authorization.

**END OF PRE-SP05-PS05-04-PRE-IMPL**

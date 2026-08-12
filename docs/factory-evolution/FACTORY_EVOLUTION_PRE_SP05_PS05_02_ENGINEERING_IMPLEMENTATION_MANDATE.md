# PRE-SP05 CONTINUITY WORKSTREAM
## PS05-02 — ENGINEERING IMPLEMENTATION MANDATE
### Canonical Fact Shape + Jurisdiction + Identity
#### Document ID: PRE-SP05-PS05-02-ENG-IMPL

| Campo | Valor |
|-------|--------|
| **Document ID** | **`PRE-SP05-PS05-02-ENG-IMPL`** |
| **Mandate ID** | **`PRE-SP05-PS05-02-ENG-IMPL`** |
| **Document type** | **PRE-SP05 Engineering Implementation Mandate** |
| **File ID** | `FACTORY_EVOLUTION_PRE_SP05_PS05_02_ENGINEERING_IMPLEMENTATION_MANDATE.md` |
| **Path** | `docs/factory-evolution/FACTORY_EVOLUTION_PRE_SP05_PS05_02_ENGINEERING_IMPLEMENTATION_MANDATE.md` |
| **Nature** | Director **Engineering class Mandate** for PRE-SP05 block **PS05-02 Canonical Fact Shape + Jurisdiction + Identity** · authorizes enumerated adapters/resolvers only · **no code in this file** · **does not implement by existence** · **≠ SP05 OPEN** · **≠ SP09** · **≠ Living IA PROVED** · **≠ PS05-03+** · **≠ Maricopa-as-canonical-RSN** |
| **Block ID** | **PS05-02** |
| **Workstream** | **PRE-SP05 Continuity workstream** |
| **Parent PS05-00** | Continuity Commit **`7dba31cf7b8ea3e202fb359c6a65afa34dee0e88`** · `PRE-SP05-PS05-00-OWN-SCOPE-01` · **COMPLETE** |
| **Parent PS05-01** | Continuity Commit **`5d5ebde388b9187174060aefe7776f340e038b23`** · `PRE-SP05-PS05-01-COMPLETE-STATUS-01` · **COMPLETE** |
| **Parent tip at Mandate drafting** | **`5d5ebde388b9187174060aefe7776f340e038b23`** |
| **PS05-00 dispositions (binding)** | **O02** jurisdiction min · **O03** catalog extensibility (bounded) · **O04** canonical fact shape · **O05** min entity resolution |
| **Authorizing Director act** | Continuity workstream PRE-SP05 · this Mandate opens the **PS05-02 engineering class lifecycle** only · code still requires Pre-IMPL PASS/PWO + Director EXECUTE / Execution Order |
| **Authorized technical class** | **Adapters / canonical fact mapping / deterministic identity / min jurisdiction / bounded owner honesty** for M06 · M07 · M08 · M16 |
| **Date** | **2026-08-12** |
| **Branch** | `integration/factory-complete-20260725` |
| **Mode** | **DOCUMENTARY ONLY** (this file) |

**Controlling precedent (minimum):** PRE-SP05 PS05-01 Mandate → Independent Pre-IMPL → Director EXECUTE → IMPL → post-IMPL → Status (Complexity reduced: **one block**, no CEP matrix). Closest engineering class: SP03/SP04 recorded-pack enrichment adapters (extend, do not redesign).

```text
PRE-SP05-PS05-02-ENG-IMPL
  = Engineering class for PS05-02 ONLY
  ≠ CODE BY THIS FILE
  ≠ PS05-02 IMPLEMENTATION STARTED
  ≠ SP05 OPEN
  ≠ SP09 / new Strategic Program
  ≠ Living Intelligence Alive PROVED
  ≠ GAP-RK-IA / GAP-LIVE-LLM PROVED
  ≠ PS05-03…PS05-07 IMPL
  ≠ 50-state ontology / national Scale Out
  ≠ Maricopa-specific solution promoted as canonical RSN architecture
  ≠ beneficial ownership / skip tracing / PII acquisition
```

---

## 0. Honesty banner

```text
SP01–SP04 COMPLETE = PRESERVED
SP05               = NOT OPENED
PS05-00            = COMPLETE
PS05-01            = COMPLETE
PS05-02 code       = NOT STARTED
Living IA          = NOT PROVED
GAP-RK-IA          = NOT PROVED
GAP-LIVE-LLM       = NOT PROVED
P11 / P13 (PS05-01)= MUST REMAIN SATISFIED
```

---

## 1. Purpose

Introduce a **bounded** RSN canonical property fact shape, explicit jurisdiction, and deterministic property (and Decision-relevant owner) identity so Decision-facing layers do not depend on Maricopa-specific payload schemas.

PS05-02 does **not** prove second-jurisdiction national readiness (PS05-06). It establishes foundation invariants I05 / I06 / I15 (foundation only).

**Invariants (target):** I05 · I06 · I15 (foundation)
**Proof obligations (target):** P03
**MUST RESOLVE:** M06 · M07 · M08 · M16

---

## 2. Authorized problem set

| ID | Problem | Mandate scope |
|----|---------|---------------|
| **M06** | Canonical normalization | Source-specific → bounded adapter → RSN canonical property fact; Decision-facing must not require Maricopa schema literacy |
| **M07** | Property entity resolution | Deterministic MATCH / NO_MATCH / AMBIGUOUS|UNRESOLVED across ≥2 sources; no silent merge |
| **M08** | Owner/entity (Decision-relevant) | Prevent false owner attribution; UNKNOWN/UNRESOLVED valid; no corporate graph / PII enrichment |
| **M16** | Jurisdiction explicitness | Explicit machine-readable state+county (min); no implicit “everything is Maricopa, AZ” |

---

## 3. Required semantics

### 3.1 Normalization boundary

```text
SOURCE-SPECIFIC RECORD (e.g. maricopa.*.payload.v1)
  → BOUNDED ADAPTER / NORMALIZER
  → RSN CANONICAL PROPERTY FACT SHAPE
  → KNOWLEDGE / INTELLIGENCE / CB-16 (Decision-facing)
```

Maricopa packs/contracts/schemas **may remain** as **source adapters**. They must **not** be redefined as the canonical RSN architecture.

### 3.2 Minimum canonical fields (assessed; exact freeze = Pre-IMPL)

At minimum assess / include where Decision-facing needs them:

- property identity (canonical id / resolution status)
- jurisdiction (explicit)
- parcel / APN identifiers
- normalized address (when present)
- source identity (organism / SourceRef linkage)
- raw / source-specific identifiers (preserved for traceability)
- owner / entity reference **or** UNRESOLVED when applicable

### 3.3 Property identity

Deterministic evidence-backed outcomes only:

- **MATCH**
- **NO_MATCH**
- **AMBIGUOUS** / **UNRESOLVED**

No silent merge of conflicting identifiers. No probabilistic AI matching.

Candidate signals (non-exclusive): normalized jurisdiction, APN, parcel ID, GIS parcel ID, situs address, recorder parcel reference.

### 3.4 Owner / entity (bounded)

If owner cannot be reliably resolved from available Decision-relevant evidence → **UNKNOWN** / **UNRESOLVED**.

Forbidden in this block: beneficial ownership, corporate graph, skip tracing, contact enrichment, PII acquisition, external entity providers.

### 3.5 Jurisdiction (minimum)

Must distinguish at least:

- **state**
- **county**

and preserve source jurisdiction. Municipality / FIPS may remain future unless Pre-IMPL proves necessity now.

### 3.6 PS05-01 preservation (binding)

Must preserve synthetic isolation, stub isolation, fail-closed behavior, CB-16 UNTRUSTED semantics, P11, P13. No regression.

---

## 4. Authorized writable surfaces (class)

Writable surfaces are **bounded** to those confirmed by the PS05-02 Pre-IMPL Audit. Anticipated class:

| Surface class | Intent |
|---------------|--------|
| NEW CB-02 min jurisdiction registry helper | Explicit state+county vocabulary |
| NEW CB-02/CB-05 canonical property fact adapter | Map source payloads → canonical shape; preserve raw ids |
| NEW CB-05 property identity resolver | Deterministic MATCH / NO_MATCH / AMBIGUOUS|UNRESOLVED |
| EXTEND recorded pack enrichment adapter | Emit canonical facts alongside payloads (no Live) |
| Thin CB-05 / CB-13 motor consume hooks | Stop Decision-facing hardcoding of Maricopa strings / raw schema dependence |
| Thin CB-07 OWN honesty (marking only) | Owner UNRESOLVED / no false attribution |
| Optional thin CB-16 identity jurisdiction field | Only if Pre-IMPL proves Decision-facing necessity |
| Targeted validateCb05 / validateCb13 / validateCb02 | Negative + regression proofs |

**Forbidden writable expansion:** CB constitutional redesign; Hardening; P-INT Live; Product `dealPipeline`; Supabase; Live connectors; LLM; pack-content “truth” redesign; 50-state UX.

---

## 5. Forbidden scope (binding)

- SP05 Decision Engine / ranking / Premium / Diamond / Deal Dossier
- PS05-03 provenance / fact typing / dynamic unknown / exhaustion / conflict-freshness redesign
- PS05-04 real-data / real economics / real distress
- PS05-05 full CB-16 trust redesign
- PS05-06 second-jurisdiction / idempotency proof beyond what PS05-02 needs
- Live LLM / Product / Marketplace / Supabase / DB / migrations / Edge / RLS / Auth / Storage
- Provider activation / credentials / scraping / dependency changes
- Fundamental architecture redesign / new Strategic Program
- Promoting Maricopa-specific contracts as the canonical RSN fact model

---

## 6. Acceptance (PS05-02 cannot close unless)

Objective tests prove T01–T10 as frozen by Pre-IMPL Audit, including:

1. Assessor + GIS/Recorder resolve to one canonical property identity when evidence matches.
2. Conflicting identifiers do **not** silently merge.
3. Missing identity evidence → UNRESOLVED / UNKNOWN.
4. Same APN in different jurisdiction does **not** merge incorrectly.
5. Maricopa-specific fields normalized before Decision-facing consumption.
6. Canonical representation preserves raw/source-specific identifiers.
7. Jurisdiction explicit and machine-readable.
8. Unresolved owner not falsely attributed.
9. PS05-01 trust markers survive normalization/identity processing.
10. Existing CB validations remain PASS.

---

## 7. Gate chain before code

```text
1. This Mandate Continuity-published
2. Independent Pre-IMPL Audit PASS or PASS WITH NON-BLOCKING OBSERVATIONS Continuity-published
3. Director EXECUTE / Execution Order (or equivalent Grant) for PS05-02 IMPL
4. LOCAL = REMOTE · ahead = 0 · behind = 0 · WT CLEAN
→ THEN PS05-02 code mutation may begin on authorized writable surfaces only
```

```text
MANDATE PUBLISHED ≠ CODE AUTHORIZED
PRE-IMPL PASS     ≠ CODE AUTHORIZED BY AUDIT FILE ALONE
```

---

## 8. Exact next step after Mandate Continuity publication

Independent **PS05-02 Pre-Implementation Audit** (STRICT READ ONLY / documentary), then — if PASS/PWO — Director EXECUTE for bounded IMPL.

```text
NEXT ≠ SP05 OPEN
NEXT ≠ PS05-03
NEXT ≠ CODE
NEXT = PRE-SP05-PS05-02-PRE-IMPL (Independent Pre-IMPL Audit)
```

**END OF PRE-SP05-PS05-02-ENG-IMPL**

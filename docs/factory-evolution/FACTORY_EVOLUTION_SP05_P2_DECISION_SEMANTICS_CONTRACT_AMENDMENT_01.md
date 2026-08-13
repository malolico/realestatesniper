# STRATEGIC PROGRAM 05 — DECISION ENGINE
## SP05-P2 — DECISION SEMANTICS CONTRACT / DOCUMENTARY FREEZE AMENDMENT
### Closes Independent Freeze Audit blockers (dimension set · order · SEM-01/02/03 derivation)
#### Document ID: SP05-P2-SEM-FREEZE-AMENDMENT-01

| Campo | Valor |
|-------|--------|
| **Document ID** | **`SP05-P2-SEM-FREEZE-AMENDMENT-01`** |
| **Document type** | **SP05-P2 Decision Semantics Contract / Documentary Freeze Amendment** |
| **File ID** | `FACTORY_EVOLUTION_SP05_P2_DECISION_SEMANTICS_CONTRACT_AMENDMENT_01.md` |
| **Path** | `docs/factory-evolution/FACTORY_EVOLUTION_SP05_P2_DECISION_SEMANTICS_CONTRACT_AMENDMENT_01.md` |
| **Nature** | Continuity **documentary amendment** that freezes **only** previously unfrozen areas of `SP05-P2-SEM-FREEZE-01` identified by the Independent Freeze Audit · **≠ rewrite of historical freeze** · **≠ code** · **≠ Grant** · **≠ P2 IMPL** · **≠ DG-01 resolved** · **≠ Product licensing safe harbor** · **≠ P3 Deal Dossier** · **≠ transaction advice** |
| **Program** | **Strategic Program 05 — Decision Engine** |
| **Phase** | **SP05-P2 — Decision Semantics** (independent core only) |
| **Amends** | `SP05-P2-SEM-FREEZE-01` · `FACTORY_EVOLUTION_SP05_P2_DECISION_SEMANTICS_CONTRACT.md` · Continuity Commit **`d968ed4ce28c70bc4b81ba1c1720aec1e4d0f24d`** |
| **Parent Pre-IMPL** | `SP05-P2-PRE-IMPL` · Continuity Commit **`8d786a9d51914d2afd3c8d7337f54ac9c76222f2`** |
| **Parent Mandate / Plan** | `SP05-ENG-IMPL` · audited `SP05-02` · Plan IDA |
| **Parent P1 Complete** | `SP05-P1-COMPLETE-STATUS-01` · Continuity Commit **`18327d521ac55dd40448e5d8a02c3c9cd492adb7`** |
| **Authorizing Director act** | Director **APPROVED — EXECUTE** documentary freeze amendment closing Independent Freeze Audit blockers · create and publish **only** this amendment |
| **Entry tip (pre-publication)** | **`d968ed4ce28c70bc4b81ba1c1720aec1e4d0f24d`** |
| **Date** | **2026-08-13** |
| **Branch** | `integration/factory-complete-20260725` |
| **Mode** | **DOCUMENTARY FREEZE AMENDMENT ONLY** |

```text
SP05-P2-SEM-FREEZE-AMENDMENT-01
  = Documentary amendment of previously UNFROZEN areas of SP05-P2-SEM-FREEZE-01
  = Closes Independent Freeze Audit blockers:
      (1) evidence-vector dimension set + lexicographic order
      (2) FACT/evidence → SEM-01 / SEM-02 / SEM-03 derivation

≠ REWRITE / OVERWRITE OF HISTORICAL SP05-P2-SEM-FREEZE-01
≠ CODE · ≠ GRANT · ≠ P2 IMPLEMENTATION AUTHORIZED
≠ DG-01 RESOLUTION
≠ Premium / Diamond / access_tier / strategy
≠ BUY / SELL / INVEST / DO_NOT_INVEST transaction advice
≠ numeric 0–100 score / invented weights / ROI / commercial bands
≠ P3 dossier · ≠ P4 closure · ≠ Factory / P1 mutation
```

---

## 0. Absolute non-authorization banner

```text
THIS DOCUMENT DOES NOT AUTHORIZE IMPLEMENTATION.

SEMANTIC FREEZE AMENDMENT PUBLISHED ≠ CODE AUTHORIZED
SEMANTIC FREEZE AMENDMENT PUBLISHED ≠ GRANT ISSUED
SEMANTIC FREEZE AMENDMENT PUBLISHED ≠ P2 OPENED FOR IMPLEMENTATION

IMPLEMENTATION AUTHORITY = NONE
CODE AUTHORITY           = NONE

NEXT GATE AFTER PUBLICATION:
  Independent Documentary Audit of the published corrected Semantic Freeze
  (SP05-P2-SEM-FREEZE-01 + this Amendment as one corrected freeze set)
  THEN bounded P2 Core Grant (only if Freeze Audit PASS/PWO · blockers NONE)
```

**DG-01 remains UNRESOLVED — PARTIAL.**
Question A (Premium / Diamond / `access_tier`) and Question B (strategy selection) remain **PARKED OUT OF P2 CORE**. This amendment does **not** resolve DG-01.

---

## 1. Scope, subordination, and preservation

### 1.1 Subordination

This instrument **amends only** the previously **unfrozen** areas of `SP05-P2-SEM-FREEZE-01` that the Independent Freeze Audit found still open:

1. Evidence-vector **dimension set** and **lexicographic order**
2. FACT/evidence → conclusive **SEM-01 / SEM-02 / SEM-03 derivation rules**

It is **subordinated to** (unchanged): `SP05-ENG-IMPL` · audited `SP05-02` · `SP05-P2-PRE-IMPL` · `SP05-P1-COMPLETE-STATUS-01` · PRE-SP05 guarantees · **`SP05-P2-SEM-FREEZE-01`**.

**Input predecessor (READ ONLY):** P1 `DEC-INTAKE` under `src/decision/intake/**`.

**Forbidden legacy:** `src/lib/dealPipeline.js` — **NON-CANONICAL** · **MUST NOT** be reused, imported, wrapped, or copied.

### 1.2 Explicit preservation of SP05-P2-SEM-FREEZE-01

**All other frozen portions of `SP05-P2-SEM-FREEZE-01` remain UNCHANGED**, including without limitation:

- SEM-01…SEM-06 **vocabularies and roles** (no renames)
- Semantic separation invariants (`FACT ≠ DERIVED`, readiness ≠ opportunity, opportunity ≠ recommendation, review priority ≠ transaction advice, etc.)
- UNKNOWN honesty (`UNKNOWN ≠ zero` · `UNKNOWN ≠ negative` · missing ≠ rejection)
- conflict honesty (conflict ≠ silently resolved)
- lexicographic evidence-vector **architecture** (SEM-04)
- ranking-from-vector **architecture** (SEM-05) and supplied-candidate scope
- SEM-06 halt states as public output vocabulary
- output schema class `rsn.decision.semantics.result.v1` and honesty locks
- DG-01 parked out of P2 core
- legal / compliance boundary · **PRE-LAUNCH LEGAL REVIEW REQUIRED**
- Factory read-only · P1 closed/read-only · P3/P4 exclusions
- hard exclusions (no numeric fake precision · no BUY/SELL/INVEST · no dealPipeline canonization)
- **no implementation authority** from documentary freeze publication

This amendment **does not redesign** the original Semantic Freeze. It **fills** only the open semantic gaps the Freeze Audit required before Grant.

Where this amendment freezes content that `SP05-P2-SEM-FREEZE-01` previously deferred (exact dimension list / lexicographic order / derivation), **this amendment controls** for those items only.

---

## 2. Independent Freeze Audit blockers addressed

| Blocker | Status after this amendment |
|---------|------------------------------|
| **(1)** Evidence-vector dimension set + lexicographic order not frozen | **ADDRESSED** — §§3–4 |
| **(2)** FACT/evidence → conclusive SEM-01/02/03 derivation not frozen | **ADDRESSED** — §§5–6 |

---

## 3. D1 — Bounded FACT input (Director disposition)

P2 may consume **bounded and read-only** canonical **CB-08 / CB-09** signals present in:

```text
elrExport.motor_manifests
```

as Decision **FACT** input.

**MUST preserve:**

- UNKNOWN
- NONE
- provenance
- freshness
- conflict

**This authority does NOT permit:**

- Factory mutation
- fact invention
- Product semantics
- strategy semantics
- arbitrary scoring
- economic attractiveness invention

---

## 4. D2 / D3 — VALUE vector and lexicographic order

### 4.1 VALUE Evidence Vector (frozen)

Freeze the P2 **VALUE** Evidence Vector as **exactly**:

```text
[
  DISTRESS_EVIDENCE_STATE
]
```

### 4.2 Economic dimension exclusion from VALUE vector

`ECONOMIC_VALUE_EVIDENCE_STATE` is **NOT** a VALUE-vector dimension under current bounded capability.

**Reason:** CB-09 currently establishes economic/valuation **evidence presence**, not honestly comparable economic **attractiveness**.

CB-09 FACTS **remain** available bounded/read-only as Decision **evidence/context**.

**MUST NOT introduce:**

- ROI
- ARV
- rehab
- rent yield
- cap rate
- cash flow
- discount thresholds
- arbitrary favorable/unfavorable economic thresholds

### 4.3 Outside the VALUE vector

`PROPERTY_IDENTITY_RESOLVED` and `OWNER_REF_EVIDENCE` remain **outside** the VALUE vector.

Tax and foreclosure are **not** separate VALUE dimensions; they are distress **signal types** contributing to `DISTRESS_EVIDENCE_STATE`.

### 4.4 Lexicographic order (frozen)

Because the VALUE vector contains exactly one dimension, freeze lexicographic order as:

```text
[
  DISTRESS_EVIDENCE_STATE
]
```

No secondary VALUE axis exists.

**No invented tie-breaker is permitted.**

---

## 5. D4 / D5 — DISTRESS FACT → STATE and comparison / ranking

### 5.1 FACT → `DISTRESS_EVIDENCE_STATE` (frozen)

| Rule | Aggregate state |
|------|-----------------|
| Valid canonical ACTIVE/PRESENT distress evidence | **`EVIDENCED`** |
| ACTIVE/PRESENT + independent sibling UNKNOWN, **only when** that UNKNOWN does not contradict or materially affect the positive distress evidence | **`EVIDENCED`** |
| No ACTIVE/PRESENT + all materially applicable distress signals conclusively NONE | **`NONE`** |
| No ACTIVE/PRESENT + one or more materially applicable UNKNOWN | **`UNKNOWN`** |
| Material unresolved conflict affecting the evidence supporting the distress conclusion | **`CONFLICT_BLOCKED`** |

Conflict **unrelated** to the distress conclusion: preserve as **context**; does **not** by itself alter `DISTRESS_EVIDENCE_STATE`.

**Explicit invariants:**

```text
UNKNOWN ≠ NONE
UNKNOWN ≠ zero
UNKNOWN ≠ negative ranking value
UNKNOWN ≠ rejection
```

**`EVIDENCED` means** actual positive ACTIVE/PRESENT distress evidence — **not** merely that a motor ran.

**MUST NOT use as Decision VALUE strength:**

- source count
- motor count
- signal count
- MOT-MOT-05 Factory score/weights

**MUST NOT** establish tax > foreclosure or foreclosure > tax.

### 5.2 Comparison / ranking (frozen)

For **comparable** distress states:

```text
EVIDENCED > NONE
```

**UNKNOWN:** non-comparable; when material to the required conclusion, use existing **`INSUFFICIENT_EVIDENCE`** halt semantics.

**Material conflict:** outside normal ranking; **`CONFLICT_BLOCKED`**.

Same-state candidates may legitimately **tie**.

No additional tie-breaker may be invented.

SEM-05 ranking remains **review prioritization among supplied candidates only**.

It is **NOT**: BUY · SELL · INVEST · transaction advice · brokerage · representation · intermediation.

---

## 6. D6 — SEM-01 / SEM-02 / SEM-03 derivation (frozen)

Freeze the **minimum honest mapping** from `DISTRESS_EVIDENCE_STATE` into SEM-01 / SEM-02 / SEM-03.

Vocabularies remain exactly those frozen in `SP05-P2-SEM-FREEZE-01` — **no renames**.

### 6.1 Mapping table

| `DISTRESS_EVIDENCE_STATE` | SEM-01 | SEM-02 | SEM-03 |
|---------------------------|--------|--------|--------|
| **EVIDENCED** | `OPPORTUNITY_CANDIDATE` | `INSUFFICIENT_EVIDENCE` | `REVIEW_PRIORITY` |
| **NONE** | `NOT_OPPORTUNITY_CANDIDATE` | `INSUFFICIENT_EVIDENCE` | `DO_NOT_PRIORITIZE` |
| **UNKNOWN** | `INSUFFICIENT_EVIDENCE` | `INSUFFICIENT_EVIDENCE` | `INSUFFICIENT_EVIDENCE` |
| **CONFLICT_BLOCKED** | `CONFLICT_BLOCKED` | `CONFLICT_BLOCKED` | `CONFLICT_BLOCKED` |

### 6.2 Scope lock on SEM-01 / SEM-03 NONE / NOT labels

SEM-01 `NOT_OPPORTUNITY_CANDIDATE` and SEM-03 `DO_NOT_PRIORITIZE` under `NONE` are bounded **strictly** to the current **distress VALUE axis**.

They **MUST NOT** be expanded into a claim that the property has **no opportunity of any kind**.

### 6.3 SEM-02 special lock

Under current P2 VALUE capability, distress alone **SHALL NOT** derive:

- `OPPORTUNITY`
- `NOT_OPPORTUNITY`

SEM-02 remains limited to:

- `INSUFFICIENT_EVIDENCE`
- `CONFLICT_BLOCKED`

until separately authorized canonical VALUE capability exists.

**Do NOT** invent economic semantics to force a SEM-02 conclusion.

### 6.4 Explicit preservation

```text
distress evidence     ≠ investment recommendation
distress absence      ≠ bad property
known FCV             ≠ favorable economics
review priority       ≠ transaction advice
```

SEM-01, SEM-02, and SEM-03 remain **independent** derived fields from shared FACT/vector inputs (honest lock `opportunityIsNotReviewPriority` preserved from `SP05-P2-SEM-FREEZE-01`).

---

## 7. Hard exclusions (reaffirmed)

No amendment authority for:

- numeric 0–100 Decision score · invented weights · percentages · ROI · commercial bands
- BUY/SELL/INVEST/DO_NOT_INVEST semantics
- dealPipeline canonization
- Factory CB mutation · P1 intake mutation
- P3 Deal Dossier · P4 closure
- Product / Marketplace / SP06–08 / Live / LLM / nationwide
- DB / Supabase / migrations / payments / Stripe / CRM
- new npm dependencies
- P2 Grant issuance by this file
- `src/decision/semantics/**` implementation by this file

---

## 8. Authority effect after publication

```text
WHEN Continuity-published + sync CLEAN:

  SP05-P2-SEM-FREEZE-01           = REMAINS PUBLISHED (historical; unchanged file)
  SP05-P2-SEM-FREEZE-AMENDMENT-01 = PUBLISHED (amends unfrozen areas only)

  CORRECTED SEMANTIC FREEZE SET
    = SP05-P2-SEM-FREEZE-01 + SP05-P2-SEM-FREEZE-AMENDMENT-01

  SP05-P2 IMPLEMENTATION = STILL NOT AUTHORIZED
  IMPLEMENTATION AUTHORITY = NONE
  CODE AUTHORITY           = NONE

NEXT GATE:
  Independent Documentary Audit of the published corrected Semantic Freeze

THEN (only if Audit PASS/PWO · blockers NONE):
  bounded P2 Core Grant → Director EXECUTE → IMPL → Post-IMPL → closure
```

---

## Binding footer

```text
SP05-P2-SEM-FREEZE-AMENDMENT-01
  = closes Freeze Audit blockers (dimension set · order · SEM derivation)
  = VALUE vector = [ DISTRESS_EVIDENCE_STATE ]
  = SEM-02 conclusive OPPORTUNITY / NOT_OPPORTUNITY LOCKED OUT under current VALUE capability
  = SP05-P2-SEM-FREEZE-01 otherwise UNCHANGED

≠ CODE · ≠ GRANT · ≠ P2 IMPL
≠ DG-01 RESOLUTION
≠ PREMIUM/DIAMOND · ≠ ACCESS_TIER · ≠ STRATEGY
≠ BUY/SELL/INVEST · ≠ NUMERIC FAKE PRECISION
≠ ECONOMIC ATTRACTIVENESS INVENTION
≠ P3 DOSSIER · ≠ LEGAL SAFE HARBOR

PRE-LAUNCH LEGAL REVIEW REQUIRED
DECISION OUTSIDE FACTORY INTERNALS
FACTORY TRUTH IMMUTABLE FROM DECISION
```

**END OF SP05-P2-SEM-FREEZE-AMENDMENT-01**

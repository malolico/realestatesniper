# STRATEGIC PROGRAM 05 — DECISION ENGINE
## SP05-P3 — DECISION DOSSIER CONTRACT / DOCUMENTARY FREEZE
### Bounded Decision-side Deal Dossier Contract (≠ code · ≠ Grant)
#### Document ID: SP05-P3-DOSSIER-FREEZE-01

| Campo | Valor |
|-------|--------|
| **Document ID** | **`SP05-P3-DOSSIER-FREEZE-01`** |
| **Document type** | **SP05-P3 Decision Dossier Contract / Documentary Freeze** |
| **File ID** | `FACTORY_EVOLUTION_SP05_P3_DECISION_DOSSIER_CONTRACT.md` |
| **Path** | `docs/factory-evolution/FACTORY_EVOLUTION_SP05_P3_DECISION_DOSSIER_CONTRACT.md` |
| **Nature** | Continuity **documentary freeze** of Director-resolved P3 Pre-IMPL Blockers 1–4 · **≠ code** · **≠ Grant** · **≠ P3 IMPL** · **≠ DG-01 resolved** · **≠ Product licensing safe harbor** · **≠ SP06 publication** · **≠ transaction advice** |
| **Program** | **Strategic Program 05 — Decision Engine** |
| **Phase** | **SP05-P3 — Deal Dossier** (bounded Decision-side assembly only) |
| **Parent Pre-IMPL** | `SP05-P3-PRE-IMPL` · Continuity Commit **`3bd5f2de48baa25267c569112b5f013d5425f891`** · **DOCUMENTARY FREEZE REQUIRED BEFORE GRANT** |
| **Parent Mandate / Plan** | `SP05-ENG-IMPL` · `SP05-02` · Plan IDA |
| **Parent P1 Complete** | `SP05-P1-COMPLETE-STATUS-01` · Continuity Commit **`18327d521ac55dd40448e5d8a02c3c9cd492adb7`** |
| **Parent P2 Freeze / Complete** | `SP05-P2-SEM-FREEZE-01` (+ Amendment-01) · `SP05-P2-COMPLETE-STATUS-01` · Continuity Commit **`96f84b7` lineage tip under P2 Complete** |
| **Authorizing Director act** | Director dispositions **Blockers 1–4 RESOLVED** · create and publish **only** this documentary freeze |
| **Entry tip (pre-publication)** | **`3bd5f2de48baa25267c569112b5f013d5425f891`** |
| **Date** | **2026-08-13** |
| **Branch** | `integration/factory-complete-20260725` |
| **Mode** | **DOCUMENTARY FREEZE ONLY** |

```text
SP05-P3-DOSSIER-FREEZE-01
  = Documentary freeze of P3 Deal Dossier contract (Blockers 1–4)
  = Unlocks path to Independent Documentary Freeze Audit → bounded Grant

≠ CODE · ≠ GRANT · ≠ P3 IMPLEMENTATION AUTHORIZED
≠ DG-01 RESOLUTION
≠ Premium / Diamond / access_tier / strategy
≠ BUY / SELL / INVEST / DO_NOT_INVEST transaction advice
≠ contact / outreach / owner targeting productization
≠ Product / Marketplace / SP06 publication
≠ P4 closure · ≠ Factory / P1 / P2 mutation
≠ rewrite of frozen P1/P2 semantics
```

---

## 0. Absolute non-authorization banner

```text
THIS DOCUMENT DOES NOT AUTHORIZE IMPLEMENTATION.

DOSSIER CONTRACT FREEZE PUBLISHED ≠ CODE AUTHORIZED
DOSSIER CONTRACT FREEZE PUBLISHED ≠ GRANT ISSUED
DOSSIER CONTRACT FREEZE PUBLISHED ≠ P3 OPENED FOR IMPLEMENTATION

IMPLEMENTATION AUTHORITY = NONE
CODE AUTHORITY           = NONE

NEXT GATE AFTER PUBLICATION:
  Independent Documentary Audit of SP05-P3-DOSSIER-FREEZE-01
  THEN bounded P3 Core Grant (only if Freeze Audit PASS/PWO)
```

**DG-01 remains UNRESOLVED — PARTIAL.**
Question A (Premium / Diamond / `access_tier`) and Question B (strategy selection) remain **PARKED OUT OF P3 CORE**. This freeze does **not** resolve DG-01.

---

## 1. Scope and subordination

This instrument freezes **only** the SP05-P3 **bounded Decision-side Deal Dossier contract** required by `SP05-P3-PRE-IMPL` Blockers 1–4.

**Subordinated to (unchanged):** `SP05-ENG-IMPL` · audited `SP05-02` · `SP05-P3-PRE-IMPL` · `SP05-P1-COMPLETE-STATUS-01` · `SP05-P2-SEM-FREEZE-01` (+ Amendment-01) · `SP05-P2-COMPLETE-STATUS-01` · PRE-SP05 guarantees.

**Input predecessors (READ ONLY):**
- accepted P1 `DEC-INTAKE` under `src/decision/intake/**`
- accepted P2 `rsn.decision.semantics.result.v1` under `src/decision/semantics/**`

**Forbidden legacy / non-authority:** `src/lib/dealPipeline.js` · Product · Marketplace · SP06 — **MUST NOT** be used as P3 dossier contract authority.

**Owned capability class:** Decision-side assemble consumed truth + Decision conclusions (DEF-07 / C-CAP-06 class) — **≠** SP06 publish · **≠** Product card/UI.

---

## 2. Freeze effect (Blockers 1–4)

| Blocker | Topic | Status |
|---------|-------|--------|
| **1** | Schema identity / version | **CLOSED** |
| **2** | Minimum top-level catalog | **CLOSED** |
| **3** | Inclusion / exclusion rules | **CLOSED** |
| **4** | Honesty construction behavior | **CLOSED** |

```text
This freeze closes ONLY the four SP05-P3 Pre-Implementation documentary blockers.

It does NOT:
  · constitute P3 Grant
  · constitute EXECUTE
  · authorize implementation
  · close P3
  · open P4
  · open SP06+
  · resolve DG-01
```

---

## 3. Blocker 1 — Schema identity (FROZEN)

| Campo | Valor |
|-------|--------|
| **schemaId** | **`rsn.decision.dossier.result.v1`** |
| **Initial version** | **`v1`** |
| **Artifact class** | Bounded Decision-side **derived** Deal Dossier |

**Distinct from:**
- CB-16 Decision Package
- `DEC-INTAKE`
- `rsn.decision.semantics.result.v1`
- Product / Marketplace / SP06 artifacts

**Consumes by reference:**
- accepted `DEC-INTAKE` / Decision Package lineage
- accepted `rsn.decision.semantics.result.v1`

**MUST NOT** mutate or redefine P1/P2 identities or contracts.

---

## 4. Blocker 2 — Minimum top-level catalog (FROZEN)

Required top-level sections (exact minimum P3 core):

1. **`meta`**
2. **`input`**
3. **`semantics`**
4. **`honesty`**
5. **`invariants`**

No additional section is required by the minimum P3 core contract.

### 4.1 `meta`

| Field | Requirement |
|-------|-------------|
| `schemaId` | Fixed: `rsn.decision.dossier.result.v1` |
| `ruleVersion` / version identity | Deterministic rule/version identifier consistent with Decision-side precedent |
| `state` | Fixed: **`DEC-DOSSIER`** |

### 4.2 `input`

| Content | Requirement |
|---------|-------------|
| Accepted DEC-INTAKE / Decision Package lineage | Required |
| Bounded property identity reference | Required |
| Bounded jurisdiction reference | Required |
| Full P1 package duplication | **FORBIDDEN** |

### 4.3 `semantics`

| Content | Requirement |
|---------|-------------|
| Faithful P2 conclusions/cites | Required — **no reinterpretation** |
| SEM-01 | Required |
| SEM-02 | Required (distress-only lock preserved) |
| SEM-03 | Required |
| SEM-06 / halt | Required |
| Evidence Vector cite including `DISTRESS_EVIDENCE_STATE` | Required |

**SEM-05 ranking object** is **NOT** a mandatory independent top-level section.

### 4.4 `honesty`

| Content | Requirement |
|---------|-------------|
| UNKNOWN | Preserve |
| conflict | Preserve |
| freshness | Preserve |
| provenance / source references | Required |
| bounded-data limitations | Required |
| applicable honesty limitations | Required |
| New opportunity semantics | **FORBIDDEN** |

### 4.5 `invariants` (minimum preserve)

```text
FACT                         ≠ DERIVED
UNKNOWN                      ≠ NONE
UNKNOWN                      ≠ zero / negative / rejection
conflict                     ≠ rank penalty
freshness                    ≠ truth
review priority              ≠ transaction advice
known economic evidence      ≠ favorable economics
SEM-02 distress-only lock    = PRESERVED
no Product / commercial semantics
no contact / outreach semantics
```

---

## 5. Blocker 3 — Inclusion / exclusion (FROZEN)

### 5.1 OPTIONAL_BOUNDED

| Content | Class | Rule |
|---------|-------|------|
| P2 ranking object | **OPTIONAL_BOUNDED** | Cite nested under `semantics` **only when already lawfully emitted by P2** · no re-ranking · no reorder · no tie repair · no new weighting · OBS-01 sequential same-state ranks preserved |
| CB-09 economic context | **OPTIONAL_BOUNDED** | Only when lawfully present Decision-side · **evidence/context only** · preserve UNKNOWN · provenance · freshness · conflict |
| `ownerRef` / owner identity | **OPTIONAL_BOUNDED** | Only bounded identity/honesty references already present in accepted input |

**FORBIDDEN economic derivations (even when CB-09 present):** attractiveness · ROI · ARV · cap rate · cash flow · discount · thresholds · investment conclusion · synthetic economic scoring.

**`ownerRef` / owner identity MUST NOT authorize:** contact data · contact eligibility · contact authorization · outreach · owner targeting · productization.

### 5.2 Optional-content absence

```text
ABSENT / NOT INCLUDED

MUST NOT become:
  UNKNOWN · NONE · negative evidence · rejection · low rank ·
  bad-property semantics · ranking criterion
```

### 5.3 Required nested content

| Placement | Required |
|-----------|----------|
| Under `input` | Bounded property identity reference · bounded jurisdiction reference |
| Under `semantics` | SEM-01 · SEM-02 · SEM-03 · SEM-06/halt · `DISTRESS_EVIDENCE_STATE` |
| Under `honesty` | Truth/FACT references · provenance · freshness · UNKNOWN · conflict |

### 5.4 FORBIDDEN P3 core content

```text
owner contact
contact authorization / eligibility
outreach
strategy
Premium
Diamond
access_tier
Product
Marketplace
SP06 publication behavior
BUY / SELL / INVEST
transaction recommendation
brokerage / representation / intermediation semantics
```

---

## 6. Blocker 4 — Honesty construction (FROZEN)

### 6.1 Entry gates — REJECT_INPUT / NO DOSSIER

Emit **no** `rsn.decision.dossier.result.v1` when:

- DEC-INTAKE missing
- DEC-INTAKE malformed
- DEC-INTAKE unaccepted
- P2 semantic result missing
- P2 semantic result malformed
- P1/P2 lineage mismatch
- unsupported required schema/version
- required provenance missing
- required provenance inconsistent

```text
No repair.
No fallback synthesis.
No winner selection.
No synthetic provenance.
```

### 6.2 Valid accepted P1 + P2 — BUILD faithfully

| P2 upstream state | Construction |
|-------------------|--------------|
| EVIDENCED | **BUILD** dossier faithfully |
| NONE | **BUILD** dossier faithfully |
| INSUFFICIENT_EVIDENCE | **BUILD** dossier faithfully |
| CONFLICT_BLOCKED | **BUILD** dossier faithfully |

```text
P2 honesty halt states DO NOT by themselves prevent P3 dossier construction.

P3 assembles and preserves.
P3 does NOT re-adjudicate P2.
```

---

## 7. UNKNOWN / NONE / CONFLICT (FROZEN)

### 7.1 UNKNOWN

- Preserve upstream UNKNOWN
- Required field may surface UNKNOWN only where its canonical source is genuinely UNKNOWN
- Never coerce
- Do not collapse distinct UNKNOWN states without authority
- Optional absence = **ABSENT / NOT INCLUDED**, not UNKNOWN

### 7.2 NONE

- Preserve canonical NONE
- NONE ≠ UNKNOWN
- NONE ≠ ABSENT / NOT INCLUDED
- Distress NONE remains scoped to current distress VALUE axis
- Does **not** mean bad property · no investment value · transaction advice

### 7.3 CONFLICT

| Case | Behavior |
|------|----------|
| P2 `CONFLICT_BLOCKED` | BUILD dossier and preserve faithfully |
| P1 material conflict | BUILD dossier and preserve in honesty when lineage remains valid |
| Unrelated conflict | Preserve as context · do not convert into dossier judgment |
| Optional context conflict | Preserve if validly included · omit optional when malformed/unusable · record bounded omission/error honesty where supported |
| P1/P2 lineage contradiction | **REJECT_INPUT** · **NO DOSSIER** |

**Never:** average · suppress · choose winner · silently repair · convert conflict into rank penalty.

---

## 8. Freshness (FROZEN)

```text
stale              ≠ false
freshness          ≠ truth
UNKNOWN_FRESHNESS  ≠ current
```

- Stale evidence may be represented honestly
- UNKNOWN freshness may be represented honestly
- Mixed freshness: preserve per cited FACT/source
- **No expiry threshold may be invented**
- Stale or UNKNOWN freshness alone does **NOT** halt dossier construction when the underlying required input contract remains valid

---

## 9. Provenance / traceability (FROZEN)

Required deterministic lineage must include sufficient identity for:

- source Decision Package identity
- accepted DEC-INTAKE identity/acceptance
- P2 result identity
- P2 `schemaId` / `ruleVersion`
- FACT/source references required to interpret cited conclusions
- dossier schema/version

| Condition | Behavior |
|-----------|----------|
| Missing required provenance | **REJECT_INPUT** · **NO DOSSIER** |
| Inconsistent required provenance | **REJECT_INPUT** · **NO DOSSIER** |
| Provenance synthesis | **FORBIDDEN** |

---

## 10. Optional context failure (FROZEN)

| Condition | Behavior |
|-----------|----------|
| Present + valid | Include per frozen OPTIONAL_BOUNDED rules |
| Absent | Omit as **ABSENT / NOT INCLUDED** |
| Malformed / unusable | Omit optional · do not contaminate required sections · preserve bounded omission/error honesty where supportable · **do not** halt whole dossier solely for optional malformation |
| UNKNOWN (when included) | Preserve |
| Stale (when included) | Preserve freshness honesty |
| Conflicted | Preserve when usable · otherwise omit optional without repair |

---

## 11. Determinism (FROZEN)

Same accepted P1 input + same accepted P2 semantic input **MUST** produce a **semantically identical** dossier.

**Require:**
- stable required section presence
- stable inclusion/exclusion rules
- deterministic lineage
- no random semantic ordering
- no wall-clock-derived semantic meaning
- no source-count weighting
- no motor-count weighting
- no re-ranking
- no inferred economic calculations
- no repair heuristics

A traceability timestamp, if later authorized, **MUST NOT** become semantic input.

---

## 12. Immutability (FROZEN)

| Rule | Status |
|------|--------|
| P1 input read-only | **REQUIRED** |
| P2 input read-only | **REQUIRED** |
| Factory read-only | **REQUIRED** |
| Construct a **NEW** Decision-side derived artifact | **REQUIRED** |
| No write-back to Factory / P1 / P2 | **REQUIRED** |
| Source identities unchanged | **REQUIRED** |
| No shared writable-reference mutation leakage | **REQUIRED** |

**Exact implementation mechanism:** **TO BE FIXED BY GRANT**.

---

## 13. `meta.state` (FROZEN)

```text
meta.state = DEC-DOSSIER
```

**Meaning:** accepted construction state of the emitted `rsn.decision.dossier.result.v1` artifact **ONLY**.

**MUST NOT mean:** opportunity · priority · recommendation · investment quality · commercial status · workflow stage · transaction state.

**Rejected inputs:** **NO DOSSIER** — therefore no rejected dossier state token is required.

Do **not** invent additional P3 workflow states.

---

## 14. Legal / product boundary (FROZEN)

P3 is an **evidence/conclusion assembly artifact for user review**.

It does **not**:
- recommend buying or selling
- recommend investing
- make offers
- represent a buyer or seller
- broker / intermediate a transaction
- perform licensed real-estate activity
- authorize owner outreach
- expose commercial contact functionality

**PRE-LAUNCH LEGAL REVIEW REQUIRED** remains preserved.

---

## 15. P2 semantic preservation (binding — unchanged)

P3 **MUST** consume P2 conclusions **without changing their meaning**.

```text
distress evidence ≠ investment recommendation
distress NONE     ≠ bad property
review priority   ≠ transaction advice
```

P3 **MUST NOT**:
- derive SEM-02 `OPPORTUNITY` / `NOT_OPPORTUNITY` where P2 did not
- create a second scoring / ranking / weighting system
- invent economic attractiveness from CB-09 presence
- reinterpret P2 halt states as conclusive opportunity outcomes
- remediate P2 OBS-01…OBS-04 by convenience

---

## 16. Authority chain (preserved)

| Instrument | Role |
|------------|------|
| SP05 Discovery | Naming / ownership distinction |
| Audited SP05 Plan (`SP05-02`) | Capability ownership · DoD class |
| `SP05-ENG-IMPL` | P3 purpose · proof class · exclusions |
| `SP05-P3-PRE-IMPL` | Grant blockers closed by this freeze |
| P1 intake / Complete Status | Accepted `DEC-INTAKE` predecessor |
| `SP05-P2-SEM-FREEZE-01` + Amendment-01 | Frozen semantics · CB-09 context-only |
| P2 Grant / IMPL / Complete Status | Accepted semantics result predecessor |
| PRE-SP05 Decision Package / truthAccounting | Honesty / provenance / conflict / freshness authority |

---

## 17. Closure statement

```text
SP05-P3-DOSSIER-FREEZE-01
  Blocker 1 CLOSED — schemaId rsn.decision.dossier.result.v1 · v1
  Blocker 2 CLOSED — meta · input · semantics · honesty · invariants
  Blocker 3 CLOSED — inclusion / exclusion matrix frozen
  Blocker 4 CLOSED — REJECT_INPUT vs BUILD_WITH_HONESTY_STATE frozen
  meta.state        = DEC-DOSSIER

IMPLEMENTATION AUTHORITY = NONE
NEXT GATE                = Independent Documentary Audit of this freeze
```

**END OF DOCUMENT — SP05-P3-DOSSIER-FREEZE-01**

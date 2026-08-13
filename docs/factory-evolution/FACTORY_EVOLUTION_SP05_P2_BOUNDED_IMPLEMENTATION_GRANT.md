# STRATEGIC PROGRAM 05 — DECISION ENGINE
## SP05-P2 — BOUNDED IMPLEMENTATION GRANT
### Decision Semantics Core — Exact writable surfaces + execution contract (≠ code)

| Campo | Valor |
|-------|--------|
| **Document ID** | **`SP05-P2-GRANT`** |
| **Grant ID** | **`DAG-SP05-P2-G1`** |
| **File ID** | `FACTORY_EVOLUTION_SP05_P2_BOUNDED_IMPLEMENTATION_GRANT.md` |
| **Path** | `docs/factory-evolution/FACTORY_EVOLUTION_SP05_P2_BOUNDED_IMPLEMENTATION_GRANT.md` |
| **Nature** | Bounded **Director Grant** — Continuity-records exact mutable Decision-side surfaces and authorized technical purpose for **future** SP05-P2 semantic core implementation · **≠ code in this file** · **≠ implementation by publication** · **≠ Director EXECUTE** · **≠ DG-01 resolved** · **≠ P3/P4** · **≠ Product / Marketplace / SP06–08 / Live** |
| **Program** | **Strategic Program 05 — Decision Engine** |
| **Phase** | **SP05-P2 — Decision Semantics** (independent core only) |
| **Parent Mandate** | `SP05-ENG-IMPL` · Continuity Commit **`9294b7b38cf1e78b353331e20a0d547897bb42d1`** · **UNCHANGED** |
| **Parent Pre-IMPL** | `SP05-P2-PRE-IMPL` · Continuity Commit **`8d786a9d51914d2afd3c8d7337f54ac9c76222f2`** · **UNCHANGED** |
| **Parent Semantic Freeze** | `SP05-P2-SEM-FREEZE-01` · Continuity Commit **`d968ed4ce28c70bc4b81ba1c1720aec1e4d0f24d`** · **UNCHANGED** |
| **Parent Semantic Freeze Amendment** | `SP05-P2-SEM-FREEZE-AMENDMENT-01` · Continuity Commit **`5ec19b4550ca29bc4d3cca27397683dc9eac8453`** · **UNCHANGED** |
| **Corrected Freeze Audit** | Independent Documentary Audit of corrected Semantic Freeze · **PASS WITH OBSERVATIONS** · blockers **NONE** · **READY FOR BOUNDED P2 CORE GRANT = YES** |
| **Parent Plan / Plan IDA** | `SP05-02` · `SP05-02-PLAN-IDA` · **UNCHANGED** |
| **Parent Discovery / IDA** | `SP05-01` · `SP05-01-DISCOVERY-IDA` · **UNCHANGED** |
| **Parent P1 Complete** | `SP05-P1-COMPLETE-STATUS-01` · Continuity Commit **`18327d521ac55dd40448e5d8a02c3c9cd492adb7`** · **PRESERVED** |
| **Parent P1 Grant** | `DAG-SP05-P1-G1` · **CLOSED PREDECESSOR** · P1 surfaces **READ ONLY** |
| **PRE-SP05 antecedent** | PRE-SP05 COMPLETE · PS05-04 CB-08/09 honesty · PS05-05 trusted CB-16 · PS05-06 isolation · **PRESERVED** |
| **Entry tip (pre-publication)** | **`5ec19b4550ca29bc4d3cca27397683dc9eac8453`** |
| **Date** | **2026-08-13** |
| **Branch** | `integration/factory-complete-20260725` |
| **Mode** | **DOCUMENTARY AUTHORITY ONLY** |

```text
DAG-SP05-P2-G1
  = Bounded Grant for SP05-P2 Decision Semantics CORE ONLY
  = Exact writable file freeze + proof/execution contract
  = Controls = corrected Semantic Freeze set
      (SP05-P2-SEM-FREEZE-01 + SP05-P2-SEM-FREEZE-AMENDMENT-01)

GRANT PUBLISHED ≠ CODE AUTHORIZED
GRANT PUBLISHED ≠ IMPLEMENTATION STARTED
GRANT PUBLISHED ≠ DIRECTOR EXECUTE

IMPLEMENTATION AUTHORITY = AWAITING DIRECTOR EXECUTE
CODE AUTHORITY           = NONE UNTIL EXPLICIT DIRECTOR EXECUTE

Required Director authorization phrase before any code mutation:
  Aprobado. Ejecuta.
```

---

## 0. Absolute non-authorization banner

| Surface | Under this Grant publication alone |
|---------|-------------------------------------|
| Decision / Factory code | **NOT AUTHORIZED** |
| `src/decision/semantics/**` creation | **NOT AUTHORIZED** until Director EXECUTE |
| Test / fixture mutation | **NOT AUTHORIZED** until Director EXECUTE |
| DG-01 Question A / B | **ZERO AUTHORITY** |
| SP05-P3 / P4 | **NOT OPENED** |
| Factory CB-08 / CB-09 / CB-16 source | **FORBIDDEN MUTATION** |
| P1 `src/decision/intake/**` | **FORBIDDEN MUTATION** |

```text
THIS GRANT NARROWS AUTHORITY.
IT MUST NOT BROADEN THE MANDATE, PRE-IMPL, OR CORRECTED SEMANTIC FREEZE.
THIS GRANT ≠ EXECUTE.
```

---

## 1. Subordination (binding)

This Grant is expressly subordinated to:

| Instrument | Posture |
|------------|---------|
| **SP05-ENG-IMPL** | **UNCHANGED** · controlling engineering class |
| **SP05-P2-PRE-IMPL** | **UNCHANGED** |
| **SP05-P2-SEM-FREEZE-01** | **UNCHANGED** · historical freeze |
| **SP05-P2-SEM-FREEZE-AMENDMENT-01** | **UNCHANGED** · controls previously unfrozen areas |
| **Corrected Freeze set** | **BINDING** · Freeze + Amendment |
| **SP05-02 / SP05-02-PLAN-IDA** | **UNCHANGED** |
| **SP05-01 / SP05-01-DISCOVERY-IDA** | **UNCHANGED** |
| **SP05-P1-COMPLETE / DAG-SP05-P1-G1** | **PRESERVED** · P1 **READ ONLY** |
| **PRE-SP05 COMPLETE / PS05-04 / PS05-05 / PS05-06** | **PRESERVED** |
| **DG-01** | **UNRESOLVED — PARTIAL** · **PARKED OUT OF P2 CORE** |

```text
GRANT ≠ AMEND PARENTS
GRANT ≠ EXPAND PRE-IMPL SCOPE
GRANT ≠ RESOLVE DG-01
GRANT ≠ OPEN P3/P4
GRANT ≠ INVENT SEMANTICS BEYOND CORRECTED FREEZE
```

Where Freeze and Amendment differ on previously deferred items (dimension set, order, SEM-01/02/03 derivation), **Amendment controls**.

---

## 2. Grant purpose (frozen)

Authorize, **subject to later explicit Director EXECUTE**, the **minimum** Decision-side code surfaces necessary to establish:

1. bounded deterministic Decision Semantics from trusted `DEC-INTAKE`;
2. single-axis VALUE Evidence Vector `[DISTRESS_EVIDENCE_STATE]`;
3. FACT → distress state → SEM-01 / SEM-02 / SEM-03 / SEM-04 / SEM-05 / SEM-06 per corrected Freeze;
4. no Factory / P1 write-back;
5. P2 proof harness obligations (§10).

```text
P2 PURPOSE
  = Decision-side classify / opportunity-halt / review-priority / ranking / evidence vector
  = distress VALUE axis ONLY under current capability
  ≠ SEM-02 OPPORTUNITY / NOT_OPPORTUNITY from distress alone
  ≠ Premium / Diamond / access_tier / strategy
  ≠ Deal Dossier / Product / Marketplace / SP06–08 / Live
  ≠ economic attractiveness scoring
```

---

## 3. Corrected Semantic Freeze incorporation (binding)

Future implementation **MUST** obey the corrected Semantic Freeze set without invention:

| Binding | Source |
|---------|--------|
| SEM-01…SEM-06 vocabularies / roles / invariants | `SP05-P2-SEM-FREEZE-01` |
| Output schema class `rsn.decision.semantics.result.v1` | `SP05-P2-SEM-FREEZE-01` |
| Bounded CB-08/CB-09 FACT input via `elrExport.motor_manifests` | Amendment D1 |
| VALUE vector = `[DISTRESS_EVIDENCE_STATE]` | Amendment D2 |
| Lexicographic order = `[DISTRESS_EVIDENCE_STATE]` | Amendment D3 |
| FACT → `DISTRESS_EVIDENCE_STATE` rules | Amendment D4 |
| Comparison / ranking (`EVIDENCED > NONE`; UNKNOWN non-comparable; conflict halt) | Amendment D5 |
| SEM-01 / SEM-02 / SEM-03 minimum honest mapping + SEM-02 special lock | Amendment D6 |

Independent Freeze Audit observations (motor/signal ID enumeration residual; historical Freeze superseded deferral sentence; unused SEM-03 `REVIEW`) **MUST NOT** become unauthorized semantic expansion.

---

## 4. Exact writable files (frozen)

**No broad directory write authorization.** Creating parent directories is incidental to creating the enumerated files only.

### 4.1 REQUIRED writable surfaces

| PATH | NEW / EXISTING | PURPOSE | WHY REQUIRED | AUTHORIZED MUTATION TYPE |
|------|----------------|---------|--------------|--------------------------|
| `src/decision/semantics/decisionSemanticsEngine.js` | **NEW** | Derive SEM-01…SEM-06 outputs from `DEC-INTAKE` + bounded CB-08/CB-09 FACT per corrected Freeze | P2 owned capability class (Pre-IMPL §15) | **CREATE** (post-EXECUTE) |
| `src/decision/semantics/decisionOutputContract.js` | **NEW** | Decision-owned output representation + FACT vs DERIVED honesty locks (`rsn.decision.semantics.result.v1`) | Downstream isolation / honesty | **CREATE** (post-EXECUTE) |
| `src/decision/semantics/validateDecisionSemantics.js` | **NEW** | P2 proof harness implementing §10 obligations (+ Pre-IMPL T01–T14 as applicable) | Mandatory P2 validator | **CREATE** (post-EXECUTE) |

**Minimum coherent file count:** **3** — maps to Pre-IMPL candidate surfaces. No additional files are required for the frozen P2 core contract.

### 4.2 OPTIONAL writable surfaces

| PATH | NEW / EXISTING | PURPOSE | WHY OPTIONAL | AUTHORIZED MUTATION TYPE |
|------|----------------|---------|--------------|--------------------------|
| `src/decision/semantics/index.js` | **NEW** | Thin barrel re-export of semantics engine / output contract / validator | Convenience only | **CREATE** only if EXECUTE needs a single import seam |

Optional file must not add semantics beyond re-export of §4.1 surfaces.

### 4.3 Explicitly NOT writable

| Surface | Binding |
|---------|---------|
| Any path outside §4.1 / §4.2 | **STOP** |
| `src/factory/**` | **FORBIDDEN** |
| `src/decision/intake/**` | **FORBIDDEN** (P1 closed predecessor — **READ ONLY**) |
| `src/lib/dealPipeline.js` | **FORBIDDEN** · **NON-CANONICAL** · **NON-AUTHORITY** |
| Product / access / Live / dossier modules | **FORBIDDEN** |

---

## 5. Read-only consume surfaces

### 5.1 P1 predecessor (READ ONLY)

| Path | Role |
|------|------|
| `src/decision/intake/**` | Trusted `DEC-INTAKE` input predecessor — **READ ONLY** |

Normal P2 processing **requires** valid `DEC-INTAKE`. Raw / UNTRUSTED / diagnostic / shape-only packages **must be refused**.

### 5.2 Factory (READ ONLY)

P2 may **import/consume** Factory package projections / schemas needed to read trusted package FACT including:

```text
elrExport.motor_manifests
```

canonical CB-08 / CB-09 signals as Decision FACT input.

**No Factory source file is writable.**

```text
src/factory/** = READ ONLY / FORBIDDEN MUTATION
CB-08 / CB-09  = READ ONLY consume · NO mutation · NO truth repair
CB-16          = READ ONLY (trusted package frontier)

NO SUPPLEMENTAL FACTORY AUTHORITY EXISTS.
```

### 5.3 FACT preservation

Future implementation **MUST preserve** on consumed FACT:

- UNKNOWN
- NONE
- provenance
- freshness
- conflict

**MUST NOT:**

- Factory mutation
- P1 mutation
- CB-08 / CB-09 mutation
- upstream truth repair
- fact invention

---

## 6. Frozen VALUE semantics (binding)

### 6.1 VALUE Evidence Vector

```text
[
  DISTRESS_EVIDENCE_STATE
]
```

- No secondary VALUE dimension
- No hidden tie-breaker
- No numeric scoring
- No weighting
- No ranking by source count, signal count, or motor count

### 6.2 CB-09

CB-09 economic/valuation FACTS remain **evidence/context only**.

They **MUST NOT** become comparable economic attractiveness.

**MUST NOT introduce:**

- ROI · ARV · rehab economics · rent yield · cap rate · cash flow
- discount thresholds · economic scoring
- favorable/unfavorable invented thresholds

### 6.3 Outside VALUE vector

`PROPERTY_IDENTITY_RESOLVED` and `OWNER_REF_EVIDENCE` remain outside the VALUE vector.

Tax and foreclosure are distress **signal types**, not separate VALUE axes.

---

## 7. DISTRESS FACT → STATE (binding)

| Rule | Aggregate state |
|------|-----------------|
| Valid canonical ACTIVE/PRESENT distress | **`EVIDENCED`** |
| ACTIVE/PRESENT + independent sibling UNKNOWN, only when UNKNOWN does not contradict or materially affect the positive distress evidence | **`EVIDENCED`** |
| No ACTIVE/PRESENT + all materially applicable distress signals conclusively NONE | **`NONE`** |
| No ACTIVE/PRESENT + one or more materially applicable UNKNOWN | **`UNKNOWN`** |
| Material unresolved conflict affecting the conclusion | **`CONFLICT_BLOCKED`** |

Unrelated/non-material conflict: preserve as **context**; does not itself alter `DISTRESS_EVIDENCE_STATE`.

**Comparison:**

```text
EVIDENCED > NONE
```

- UNKNOWN: non-comparable / insufficient when material
- Material conflict: halt
- Same-state ties: legitimate
- No invented tie-breakers

**`EVIDENCED` means** actual positive ACTIVE/PRESENT distress evidence — not merely that a motor ran.

**MUST NOT use** MOT-MOT-05 Factory score/weights or signal/source/motor counts as Decision VALUE strength.

**MUST NOT** establish tax > foreclosure or foreclosure > tax.

---

## 8. SEM-01 / SEM-02 / SEM-03 derivation (binding)

Vocabularies remain exactly those frozen in `SP05-P2-SEM-FREEZE-01` — **no renames**.

| `DISTRESS_EVIDENCE_STATE` | SEM-01 | SEM-02 | SEM-03 |
|---------------------------|--------|--------|--------|
| **EVIDENCED** | `OPPORTUNITY_CANDIDATE` | `INSUFFICIENT_EVIDENCE` | `REVIEW_PRIORITY` |
| **NONE** | `NOT_OPPORTUNITY_CANDIDATE` | `INSUFFICIENT_EVIDENCE` | `DO_NOT_PRIORITIZE` |
| **UNKNOWN** | `INSUFFICIENT_EVIDENCE` | `INSUFFICIENT_EVIDENCE` | `INSUFFICIENT_EVIDENCE` |
| **CONFLICT_BLOCKED** | `CONFLICT_BLOCKED` | `CONFLICT_BLOCKED` | `CONFLICT_BLOCKED` |

SEM-01 `NOT_OPPORTUNITY_CANDIDATE` and SEM-03 `DO_NOT_PRIORITIZE` under `NONE` are bounded **strictly** to the current distress VALUE axis. They **MUST NOT** be expanded into a claim that the property has no opportunity of any kind.

### SEM-02 special lock

Distress alone **SHALL NOT** derive:

- `OPPORTUNITY`
- `NOT_OPPORTUNITY`

Under current bounded VALUE capability, SEM-02 remains limited to:

- `INSUFFICIENT_EVIDENCE`
- `CONFLICT_BLOCKED`

**No engineering invention may fill that semantic gap.**

```text
distress evidence ≠ investment recommendation
distress absence  ≠ bad property
known FCV         ≠ favorable economics
review priority   ≠ transaction advice
```

---

## 9. SEM-04 / SEM-05 / SEM-06 (binding)

### SEM-04

Single-axis lexicographic Evidence Vector:

```text
[
  DISTRESS_EVIDENCE_STATE
]
```

### SEM-05

Deterministic ranking derived from that vector among **supplied** candidates only.

- Only comparable states participate in normal ranking
- `EVIDENCED > NONE`
- Same-state ties remain ties
- UNKNOWN does not become a low rank
- Conflict does not become a rank penalty
- Candidate search / population **FORBIDDEN**

### SEM-06

`INSUFFICIENT_EVIDENCE` · `CONFLICT_BLOCKED` remain halt/honesty outcomes per corrected Freeze.

Ranking / review priority **MUST NOT** mean BUY · SELL · INVEST · transaction advice · brokerage · representation · intermediation.

---

## 10. Proof obligations (frozen for future IMPL)

### 10.1 Corrected-Freeze acceptance matrix (mandatory)

| ID | Obligation |
|----|------------|
| **P2-S01** | Valid ACTIVE → `EVIDENCED` |
| **P2-S02** | ACTIVE + independent non-material UNKNOWN → `EVIDENCED` |
| **P2-S03** | Conclusive all-NONE → `NONE` |
| **P2-S04** | No ACTIVE + material UNKNOWN → `UNKNOWN` |
| **P2-S05** | Material conflict → `CONFLICT_BLOCKED` |
| **P2-S06** | Unrelated conflict does not alter distress state |
| **P2-S07** | `EVIDENCED` → SEM-01 `OPPORTUNITY_CANDIDATE` |
| **P2-S08** | `EVIDENCED` → SEM-03 `REVIEW_PRIORITY` |
| **P2-S09** | `NONE` → SEM-01 `NOT_OPPORTUNITY_CANDIDATE` |
| **P2-S10** | `NONE` → SEM-03 `DO_NOT_PRIORITIZE` |
| **P2-S11** | `UNKNOWN` → `INSUFFICIENT_EVIDENCE` across SEM-01/02/03 |
| **P2-S12** | Conflict → `CONFLICT_BLOCKED` across SEM-01/02/03 |
| **P2-S13** | Distress alone never derives SEM-02 `OPPORTUNITY` |
| **P2-S14** | Distress alone never derives SEM-02 `NOT_OPPORTUNITY` |
| **P2-S15** | UNKNOWN never becomes NONE / zero / negative rank |
| **P2-S16** | Same-state ties remain ties |
| **P2-S17** | CB-09 known valuation does not become favorable economic VALUE |
| **P2-S18** | No Product / strategy / transaction semantics leak |

**Proof obligation count:** **18**

### 10.2 Pre-IMPL T01–T14 (preserved as applicable)

Pre-IMPL T01–T14 remain binding honesty/regression obligations for P2 IMPL (input gate, no Factory/P1 write-back, UNKNOWN/conflict preservation, no Premium/Diamond/`access_tier`/strategy, deterministic behavior, regressions PASS).

```text
NO P2 CLOSURE IF ANY REQUIRED PROOF OBLIGATION FAILS.
```

---

## 11. Hard exclusions (binding)

This Grant **MUST NOT** authorize introduction of:

- BUY · SELL · INVEST · MAKE OFFER
- transaction advice · brokerage · representation · intermediation
- owner outreach
- Premium · Diamond · `access_tier`
- Product · Marketplace
- strategy selection · DG-01 A/B implementation
- P3 · P4 · SP06 · SP07 · SP08
- numeric 0–100 Decision score · invented weights · ROI · commercial bands
- economic attractiveness invention
- Live · LLM · nationwide rollout
- Factory source mutation
- `src/lib/dealPipeline.js` (NON-CANONICAL / NON-AUTHORITY)
- DB · Supabase · migrations · RLS · Auth · Storage · Edge Functions
- new npm dependencies / upgrades
- payments · Stripe · CRM

**PRE-LAUNCH LEGAL REVIEW REQUIRED** remains preserved from `SP05-P2-SEM-FREEZE-01`.

---

## 12. Factory / P1 boundary (binding)

| Boundary | Binding |
|----------|---------|
| Factory | **READ-ONLY** |
| P1 | **CLOSED PREDECESSOR / READ-ONLY** |
| Factory changes | **FORBIDDEN** |
| P1 changes | **FORBIDDEN** |
| Database / Supabase / RLS / Auth / Storage / migrations / Edge | **FORBIDDEN** unless separately authorized by future Director instrument |
| Dependency expansion | **FORBIDDEN** unless separately authorized |

```text
FACTORY TRUTH IMMUTABLE FROM DECISION
DECISION OUTSIDE FACTORY INTERNALS
```

---

## 13. DG-01 (binding)

| Item | State |
|------|-------|
| DG-01 | **UNRESOLVED — PARTIAL** |
| Question A (Premium/Diamond/`access_tier`) | **OUT OF P2 CORE** · **ZERO AUTHORITY** |
| Question B (strategy selection) | **OUT OF P2 CORE** · **ZERO AUTHORITY** |

Any P2 implementation that emits Premium / Diamond / `access_tier` / strategy = **OUT OF SCOPE / STOP**.

---

## 14. Future EXECUTE requirement (binding)

```text
THIS GRANT ≠ EXECUTE

Publication of this Grant does NOT authorize code mutation by itself.

Before implementation, a separate explicit Director authorization:
  Aprobado. Ejecuta.
is required for the bounded implementation block.

The future implementation must remain entirely inside this Grant envelope.
```

---

## 15. Independent Post-Implementation Audit (binding)

After future implementation:

1. **Independent Post-Implementation Audit** is **REQUIRED**
2. before any **P2 Complete Status**
3. Implementation itself **MUST NOT** self-declare P2 COMPLETE

```text
IMPL ≠ COMPLETE
POST-IMPL AUDIT REQUIRED BEFORE COMPLETE STATUS
```

---

## 16. Stop conditions (future implementation)

Future implementation **must STOP** if:

1. any Factory file requires mutation;
2. any P1 intake file requires mutation;
3. any file outside the exact Grant set (§4.1 / authorized §4.2) is required;
4. a new dependency is required;
5. P2 requires DG-01 / Premium / Diamond / `access_tier` / strategy semantics;
6. P3 / P4 / Product / Marketplace / SP06–08 become necessary;
7. SEM-02 `OPPORTUNITY` / `NOT_OPPORTUNITY` would require invention beyond corrected Freeze;
8. economic attractiveness thresholds would be required;
9. numeric weights / scores / invented tie-breakers would be required;
10. corrected Freeze proof obligations cannot be proven;
11. PRE-SP05 / CB / P1 truth regression occurs.

---

## 17. Authority effect after publication

```text
WHEN Continuity-published + sync CLEAN:

  SP05-P2-GRANT / DAG-SP05-P2-G1 = PUBLISHED
  IMPLEMENTATION AUTHORITY       = AWAITING DIRECTOR EXECUTE
  CODE AUTHORITY                 = NONE

NEXT GATE:
  Director explicit "Aprobado. Ejecuta." for bounded P2 implementation
  THEN IMPL strictly inside this Grant envelope
  THEN Independent Post-Implementation Audit
  THEN (only if Audit PASS/PWO · blockers NONE) P2 Complete Status path
```

---

## Binding footer

```text
DAG-SP05-P2-G1
  = Bounded Grant for SP05-P2 Decision Semantics CORE
  = VALUE vector = [ DISTRESS_EVIDENCE_STATE ]
  = SEM-02 conclusive OPPORTUNITY / NOT_OPPORTUNITY LOCKED OUT
  = corrected Freeze binding · P1 READ ONLY · Factory READ ONLY

≠ CODE · ≠ EXECUTE · ≠ P2 IMPL BY PUBLICATION
≠ DG-01 RESOLUTION
≠ PREMIUM/DIAMOND · ≠ ACCESS_TIER · ≠ STRATEGY
≠ BUY/SELL/INVEST · ≠ ECONOMIC ATTRACTIVENESS INVENTION
≠ P3 DOSSIER · ≠ LEGAL SAFE HARBOR

PRE-LAUNCH LEGAL REVIEW REQUIRED
GRANT ≠ EXECUTE
Aprobado. Ejecuta. REQUIRED BEFORE CODE
```

**END OF SP05-P2-GRANT / DAG-SP05-P2-G1**

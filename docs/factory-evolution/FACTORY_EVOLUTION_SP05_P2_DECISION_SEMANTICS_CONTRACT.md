# STRATEGIC PROGRAM 05 — DECISION ENGINE
## SP05-P2 — DECISION SEMANTICS CONTRACT / DOCUMENTARY FREEZE
### Independent Core Semantic Vocabulary + Output Contract (≠ code · ≠ Grant)
#### Document ID: SP05-P2-SEM-FREEZE-01

| Campo | Valor |
|-------|--------|
| **Document ID** | **`SP05-P2-SEM-FREEZE-01`** |
| **Document type** | **SP05-P2 Decision Semantics Contract / Documentary Freeze** |
| **File ID** | `FACTORY_EVOLUTION_SP05_P2_DECISION_SEMANTICS_CONTRACT.md` |
| **Path** | `docs/factory-evolution/FACTORY_EVOLUTION_SP05_P2_DECISION_SEMANTICS_CONTRACT.md` |
| **Nature** | Continuity **documentary freeze** of Director-approved SEM-01…SEM-06 for SP05-P2 independent core · **≠ code** · **≠ Grant** · **≠ P2 IMPL** · **≠ DG-01 resolved** · **≠ Product licensing safe harbor** · **≠ P3 Deal Dossier** · **≠ transaction advice** |
| **Program** | **Strategic Program 05 — Decision Engine** |
| **Phase** | **SP05-P2 — Decision Semantics** (independent core only) |
| **Parent Pre-IMPL** | `SP05-P2-PRE-IMPL` · Continuity Commit **`8d786a9d51914d2afd3c8d7337f54ac9c76222f2`** · **DOCUMENTARY FREEZE REQUIRED BEFORE GRANT** |
| **Parent Mandate / Plan** | `SP05-ENG-IMPL` · `SP05-02` · Plan IDA |
| **Parent P1 Complete** | `SP05-P1-COMPLETE-STATUS-01` · Continuity Commit **`18327d521ac55dd40448e5d8a02c3c9cd492adb7`** |
| **Authorizing Director act** | Director dispositions **SEM-01…SEM-06 APPROVED** · create and publish **only** this documentary freeze |
| **Entry tip (pre-publication)** | **`8d786a9d51914d2afd3c8d7337f54ac9c76222f2`** |
| **Date** | **2026-08-13** |
| **Branch** | `integration/factory-complete-20260725` |
| **Mode** | **DOCUMENTARY FREEZE ONLY** |

```text
SP05-P2-SEM-FREEZE-01
  = Documentary freeze of P2 Decision semantics (SEM-01…SEM-06)
  = Unlocks path to Independent Freeze Audit → bounded Grant

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

SEMANTIC FREEZE PUBLISHED ≠ CODE AUTHORIZED
SEMANTIC FREEZE PUBLISHED ≠ GRANT ISSUED
SEMANTIC FREEZE PUBLISHED ≠ P2 OPENED FOR IMPLEMENTATION

IMPLEMENTATION AUTHORITY = NONE
CODE AUTHORITY           = NONE

NEXT GATE AFTER PUBLICATION:
  Independent Documentary Audit of SP05-P2-SEM-FREEZE-01
  THEN bounded P2 Core Grant (only if Freeze Audit PASS/PWO)
```

**DG-01 remains UNRESOLVED — PARTIAL.**
Question A (Premium / Diamond / `access_tier`) and Question B (strategy selection) remain **PARKED OUT OF P2 CORE**. This freeze does **not** resolve DG-01.

---

## 1. Scope and subordination

This instrument freezes **only** the SP05-P2 **independent core** Decision semantics required by `SP05-P2-PRE-IMPL`.

**Subordinated to (unchanged):** `SP05-ENG-IMPL` · audited `SP05-02` · `SP05-P2-PRE-IMPL` · `SP05-P1-COMPLETE-STATUS-01` · PRE-SP05 guarantees.

**Input predecessor (READ ONLY):** P1 `DEC-INTAKE` under `src/decision/intake/**`.

**Forbidden legacy:** `src/lib/dealPipeline.js` — **NON-CANONICAL** · **MUST NOT** be reused, imported, wrapped, or copied (including `access_tier` / `score_band` heuristics).

---

## 2. Semantic separation invariants (frozen)

```text
FACT                         ≠ DERIVED
readiness                    ≠ opportunity
opportunity                  ≠ recommendation
recommendation/review priority ≠ transaction advice
ranking                      ≠ investment quality guarantee
ranking                      ≠ expected ROI
Decision evidence vector     ≠ Factory maturity_score
Decision semantics           ≠ trust
Decision semantics           ≠ completeness
UNKNOWN                      ≠ zero
UNKNOWN                      ≠ negative
missing evidence             ≠ rejection
conflict                     ≠ silently resolved
INSUFFICIENT_EVIDENCE        ≠ NOT_OPPORTUNITY
CONFLICT_BLOCKED             ≠ NOT_OPPORTUNITY
Decision classification      ≠ Premium / Diamond
Decision classification      ≠ access_tier
review priority              ≠ BUY / SELL recommendation
DEC-INTAKE                   ≠ Factory ST-DEC semantics
```

---

## 3. Director dispositions SEM-01…SEM-06 (canonical — exact)

### SEM-01 — `classify_deal` canonical states — **APPROVED**

| State | Role |
|-------|------|
| **`OPPORTUNITY_CANDIDATE`** | Decision classification: candidate for opportunity analysis |
| **`NOT_OPPORTUNITY_CANDIDATE`** | Decision classification: not a candidate for opportunity analysis |
| **`INSUFFICIENT_EVIDENCE`** | Honesty halt — evidence insufficient for honest classification |
| **`CONFLICT_BLOCKED`** | Honesty halt — material conflict blocks honest classification |

**`classify_deal` MUST NOT mean:** Premium · Diamond · `access_tier` · Product entitlement · guaranteed investment outcome · BUY/SELL/INVEST advice.

### SEM-02 — opportunity canonical states — **APPROVED**

| State | Role |
|-------|------|
| **`OPPORTUNITY`** | Decision-derived opportunity conclusion |
| **`NOT_OPPORTUNITY`** | Decision-derived non-opportunity conclusion |
| **`INSUFFICIENT_EVIDENCE`** | Honesty halt — insufficient evidence for opportunity determination |
| **`CONFLICT_BLOCKED`** | Honesty halt — material conflict blocks opportunity determination |

**Binding rules:**

```text
missing / UNKNOWN evidence  ≠  NOT_OPPORTUNITY
conflict                    ≠  NOT_OPPORTUNITY
readiness                   ≠  opportunity
```

### SEM-03 — recommendation / review-priority canonical states — **APPROVED**

| State | Role |
|-------|------|
| **`REVIEW_PRIORITY`** | Analytical review-priority elevation among supplied candidates |
| **`REVIEW`** | Analytical review indicated |
| **`DO_NOT_PRIORITIZE`** | Analytical de-prioritization among supplied candidates |
| **`INSUFFICIENT_EVIDENCE`** | Honesty halt — insufficient evidence for review-priority conclusion |
| **`CONFLICT_BLOCKED`** | Honesty halt — material conflict blocks review-priority conclusion |

**CRITICAL PRODUCT / COMPLIANCE BOUNDARY (binding):**

These states are **analytical review-priority outputs only**.

They **MUST NOT** mean or be documented as:

- BUY · SELL · INVEST · DO_NOT_INVEST
- purchase recommendation · sale recommendation
- brokerage recommendation · representation · transaction advice
- guaranteed investment outcome

RealEstateSniper must remain an **analytical / evidence / filtering / prioritization** system.

It must **not** present itself as:

- real estate agent · real estate brokerage
- licensed representative · transaction intermediary

**Honesty:** This freeze does **not** make a legal conclusion that these labels alone eliminate licensing/regulatory obligations.

```text
PRE-LAUNCH LEGAL REVIEW REQUIRED
  = final terminology · licensing implications · disclaimers
    · marketing claims · user-facing Decision outputs
  = documentary / product safety only
  ≠ legal implementation work inside P2
  ≠ legal safe harbor claim
```

### SEM-04 — Decision scoring architecture — **APPROVED**

**Architecture:** **LEXICOGRAPHIC EVIDENCE VECTOR**

| Requirement | Binding |
|-------------|---------|
| Deterministic | **YES** |
| Explainable | **YES** |
| Evidence-derived | **YES** |
| Uncertainty-aware | **YES** |
| Preserve UNKNOWN / conflict / freshness / completeness / provenance / trust / identity | **YES** |
| No fabricated missing facts | **YES** |

**P2 MUST NOT introduce:**

- numeric 0–100 score
- invented weights
- percentages
- ROI assumptions
- arbitrary thresholds
- commercial bands
- fake precision

```text
Decision evidence vector ≠ Factory maturity_score
Decision evidence vector ≠ trust score
Decision evidence vector ≠ completeness score
Decision evidence vector ≠ Premium / Diamond / access_tier band
```

**Component class (documentary minimum for later IMPL):** ordered evidence dimensions derived from FACT inputs (e.g. trust honesty, conflict openness, freshness honesty, completeness honesty, UNKNOWN density, identity/jurisdiction presence). Exact dimension list and lexicographic order MUST be frozen in the future Grant/EXECUTE proof harness consistently with this architecture — **without** inventing numeric weights or ROI. Dimensions must remain explainable and FACT-traceable.

### SEM-05 — Ranking — **APPROVED**

| Rule | Binding |
|------|---------|
| Derivation | **Deterministically from the SEM-04 evidence vector** |
| Independent ranking black box | **FORBIDDEN** |
| Independent invented weights | **FORBIDDEN** |
| Meaning | **REVIEW PRIORITY among supplied Decision candidates only** |
| Candidate search / population | **FORBIDDEN** (O08 preserved) |
| Single-item behavior | **SUPPORTED** (trivial identity order) |

**Ranking MUST NOT mean:**

- best investment · recommended purchase · expected return
- commercial tier · Premium · Diamond · `access_tier`

### SEM-06 — Canonical honesty / halt states — **APPROVED**

| State | Meaning |
|-------|---------|
| **`INSUFFICIENT_EVIDENCE`** | Evidence is insufficient to reach the required conclusion honestly |
| **`CONFLICT_BLOCKED`** | Materially conflicting evidence prevents an honest conclusion |

**Do not create** `ABSTAIN` or `UNDETERMINED` as duplicate canonical P2 **output** halt states unless a later authority strictly requires an **internal non-output** implementation distinction (not authorized by this freeze as public output vocabulary).

```text
INSUFFICIENT_EVIDENCE  ≠  NOT_OPPORTUNITY
CONFLICT_BLOCKED       ≠  NOT_OPPORTUNITY
UNKNOWN                ≠  zero / negative / rejection
conflict               ≠  silently resolved
```

---

## 4. P2 Decision output contract (documentary schema freeze)

Outputs are **DERIVED Decision facts** attached to a Decision-owned result object. They **must not** mutate Factory packages or P1 `DEC-INTAKE` projections.

### 4.1 Top-level result object

| Field | Kind | Requirement |
|-------|------|-------------|
| `schemaId` | meta | Fixed: `rsn.decision.semantics.result.v1` |
| `ruleVersion` | meta | Deterministic rule/version identifier for the semantics engine revision |
| `state` | meta | Decision-side processing marker for accepted semantics evaluation (≠ Factory ST-DEC; ≠ opportunity) |
| `input` | lineage | §4.2 |
| `classifyDeal` | DERIVED | SEM-01 state |
| `opportunity` | DERIVED | SEM-02 state |
| `reviewPriority` | DERIVED | SEM-03 state (**not** named `recommendation` as BUY/SELL) |
| `evidenceVector` | DERIVED | SEM-04 lexicographic vector |
| `ranking` | DERIVED | SEM-05 review-priority rank among supplied set |
| `halt` | honesty | `null` **or** SEM-06 state when a conclusion is blocked |
| `trace` | lineage | §5 |
| `invariants` | honesty | Frozen boolean honesty locks (§4.4) |

**Naming note:** Field `reviewPriority` carries SEM-03 states. Public/user copy MUST use analytical “review priority” language — **not** investment recommendation language.

### 4.2 Input identity / DEC-INTAKE lineage

| Field | Requirement |
|-------|-------------|
| `input.decIntakeState` | Must equal `DEC-INTAKE` |
| `input.factoryKey` | From intake |
| `input.packageVersion` | From intake package meta |
| `input.deliveryId` | From intake when available; else `null` |
| `input.interfaceId` | When available from delivery |
| `input.acceptedAt` | From intake when available |

Normal P2 processing **requires** valid `DEC-INTAKE`. Raw / UNTRUSTED / diagnostic / shape-only packages **must be refused**.

### 4.3 Derived semantic fields

| Field | Allowed values |
|-------|----------------|
| `classifyDeal.state` | `OPPORTUNITY_CANDIDATE` \| `NOT_OPPORTUNITY_CANDIDATE` \| `INSUFFICIENT_EVIDENCE` \| `CONFLICT_BLOCKED` |
| `opportunity.state` | `OPPORTUNITY` \| `NOT_OPPORTUNITY` \| `INSUFFICIENT_EVIDENCE` \| `CONFLICT_BLOCKED` |
| `reviewPriority.state` | `REVIEW_PRIORITY` \| `REVIEW` \| `DO_NOT_PRIORITIZE` \| `INSUFFICIENT_EVIDENCE` \| `CONFLICT_BLOCKED` |
| `evidenceVector.schemaId` | `rsn.decision.evidenceVector.lexicographic.v1` |
| `evidenceVector.dimensions` | Ordered array of `{ id, kind: "FACT"|"DERIVED", value, rationale }` — lexicographic compare left-to-right |
| `ranking.schemaId` | `rsn.decision.ranking.reviewPriority.v1` |
| `ranking.rank` | Non-negative integer among **supplied** candidate set (1 = highest review priority); deterministic from vector |
| `ranking.candidateSetId` | Identifier of the supplied candidate set for this ranking pass |
| `ranking.meaning` | Fixed string: `REVIEW_PRIORITY_AMONG_SUPPLIED_CANDIDATES` |
| `halt` | `null` \| `INSUFFICIENT_EVIDENCE` \| `CONFLICT_BLOCKED` |

When `classifyDeal.state`, `opportunity.state`, or `reviewPriority.state` is a SEM-06 halt state, `halt` MUST mirror that halt (or be set consistently) and MUST NOT coerce to `NOT_OPPORTUNITY` / `NOT_OPPORTUNITY_CANDIDATE` / `DO_NOT_PRIORITIZE` solely because of missing/UNKNOWN/conflict.

### 4.4 Honesty locks (must be true on accepted outputs)

| Lock | Value |
|------|-------|
| `invariants.factIsNotDerived` | `true` |
| `invariants.readinessIsNotOpportunity` | `true` |
| `invariants.opportunityIsNotReviewPriority` | `true` |
| `invariants.reviewPriorityIsNotTransactionAdvice` | `true` |
| `invariants.rankingIsNotInvestmentGuarantee` | `true` |
| `invariants.evidenceVectorIsNotMaturityScore` | `true` |
| `invariants.unknownIsNotZero` | `true` |
| `invariants.insufficientEvidenceIsNotNotOpportunity` | `true` |
| `invariants.conflictBlockedIsNotNotOpportunity` | `true` |
| `invariants.noPremiumDiamondAccessTier` | `true` |
| `invariants.noStrategySelection` | `true` |
| `invariants.decIntakeIsNotFactoryStDec` | `true` |

---

## 5. Traceability contract (P2-bounded — ≠ Deal Dossier)

Minimum required on every P2 output (`trace`):

| Element | Requirement |
|---------|-------------|
| Originating `DEC-INTAKE` identity | §4.2 |
| Factory package / version identity | Required |
| Delivery identity | When available |
| Source FACT references used | Array of refs / field paths from Factory projection (read-only cites) |
| Derived Decision output(s) | classify / opportunity / reviewPriority / ranking / vector summary |
| Evidence-vector components | Full ordered dimensions with rationales |
| Uncertainty context | Snapshot of UNKNOWN-related FACT inputs used |
| Conflict context | Snapshot of open conflicts relevant to the conclusion |
| Freshness context | Snapshot of freshness honesty used |
| Deterministic `ruleVersion` | Required |

**Explicitly out of this freeze:** investor dossier assembly · Marketplace card · SP06 publication · Product UI copy systems (PRE-LAUNCH LEGAL REVIEW owns final user-facing language).

---

## 6. Legal / product boundary (documentary)

```text
PRODUCT ARCHITECTURE CONSTRAINT

RealEstateSniper outputs analytical evidence and review prioritization.

P2 must not generate transaction instructions or represent that
RealEstateSniper acts for a buyer, seller, investor, owner, broker,
or other transaction participant.

PRE-LAUNCH LEGAL REVIEW REQUIRED
  for final terminology, licensing implications, disclaimers,
  marketing claims, and user-facing Decision outputs.

≠ legal safe harbor
≠ P2 legal implementation work
≠ expansion into brokerage/representation features
```

---

## 7. DG-01 hard wall (preserved)

| Item | State |
|------|-------|
| DG-01 | **UNRESOLVED — PARTIAL** |
| Question A | **OUT OF P2 CORE** — Premium / Diamond / `access_tier` |
| Question B | **OUT OF P2 CORE** — strategy selection |
| This freeze | **ZERO AUTHORITY** to resolve A/B |

Any P2 implementation that emits Premium / Diamond / `access_tier` / strategy = **OUT OF SCOPE / STOP**.

---

## 8. Hard exclusions

No freeze authority for:

- numeric 0–100 Decision score · invented weights · percentages · ROI · commercial bands
- BUY/SELL/INVEST/DO_NOT_INVEST semantics
- dealPipeline canonization
- Factory CB mutation · P1 intake mutation
- P3 Deal Dossier · P4 closure
- Product / Marketplace / SP06–08 / Live / LLM / nationwide
- DB / Supabase / migrations / payments / Stripe / CRM
- new npm dependencies

---

## 9. Authority effect after publication

```text
WHEN Continuity-published + sync CLEAN:

  SP05-P2-SEM-FREEZE-01 = PUBLISHED
  SP05-P2 IMPLEMENTATION = STILL NOT AUTHORIZED
  IMPLEMENTATION AUTHORITY = NONE
  CODE AUTHORITY           = NONE

NEXT GATE:
  Independent Documentary Audit of SP05-P2-SEM-FREEZE-01

THEN (only if Audit PASS/PWO · blockers NONE):
  bounded P2 Core Grant → Director EXECUTE → IMPL → Post-IMPL → closure
```

---

## Binding footer

```text
SP05-P2-SEM-FREEZE-01
  = SEM-01…SEM-06 Director-approved freeze
  = LEXICOGRAPHIC EVIDENCE VECTOR
  = review priority ≠ transaction advice
  = DG-01 A/B PARKED OUT OF CORE

≠ CODE · ≠ GRANT · ≠ P2 IMPL
≠ DG-01 RESOLUTION
≠ PREMIUM/DIAMOND · ≠ ACCESS_TIER · ≠ STRATEGY
≠ BUY/SELL/INVEST · ≠ NUMERIC FAKE PRECISION
≠ P3 DOSSIER · ≠ LEGAL SAFE HARBOR

PRE-LAUNCH LEGAL REVIEW REQUIRED
DECISION OUTSIDE FACTORY INTERNALS
FACTORY TRUTH IMMUTABLE FROM DECISION
```

**END OF SP05-P2-SEM-FREEZE-01**

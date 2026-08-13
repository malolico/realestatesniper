# STRATEGIC PROGRAM 05 — DECISION ENGINE
## SP05-P2 — INDEPENDENT PRE-IMPLEMENTATION AUDIT
### Decision Semantics — Independent Core ONLY (DG-01 A/B parked out of scope)
#### Document ID: SP05-P2-PRE-IMPL

| Campo | Valor |
|-------|--------|
| **Document ID** | **`SP05-P2-PRE-IMPL`** |
| **Audit ID** | **`SP05-P2-PRE-IMPL`** |
| **Document type** | **SP05 Independent Pre-Implementation Audit** |
| **File ID** | `FACTORY_EVOLUTION_SP05_P2_INDEPENDENT_PRE_IMPLEMENTATION_AUDIT.md` |
| **Path** | `docs/factory-evolution/FACTORY_EVOLUTION_SP05_P2_INDEPENDENT_PRE_IMPLEMENTATION_AUDIT.md` |
| **Nature** | Independent **Pre-IMPL Audit** of **SP05-P2 Decision Semantics — Independent Core ONLY** · **STRICT READ ONLY / DOCUMENTATION ONLY** · evidence-based scope freeze · **≠ code** · **≠ Grant** · **≠ P2 IMPL** · **≠ DG-01 resolved** · **≠ commercial Premium/Diamond/`access_tier`/strategy** · **≠ P3/P4** · **≠ Product / SP06–08** |
| **Audit object** | Bounded **P2 independent core** under `SP05-ENG-IMPL` / audited `SP05-02` · DG-01 A/B **explicitly parked outside this Pre-IMPL** |
| **Phase ID** | **SP05-P2** (independent core subscope) |
| **Program** | **Strategic Program 05 — Decision Engine** |
| **Parent Mandate** | `SP05-ENG-IMPL` · Continuity Commit **`9294b7b38cf1e78b353331e20a0d547897bb42d1`** |
| **Parent Plan / Plan IDA** | `SP05-02` · `5df541e…` · **SP05-02-PLAN-IDA** · `ac288fd…` |
| **Parent Discovery / IDA** | `SP05-01` · `960b914…` · **SP05-01-DISCOVERY-IDA** · `1c4dc0e…` |
| **Parent P1 Complete** | `SP05-P1-COMPLETE-STATUS-01` · Continuity Commit **`18327d521ac55dd40448e5d8a02c3c9cd492adb7`** |
| **Parent P1 Grant / Pre-IMPL** | `DAG-SP05-P1-G1` · `SP05-P1-PRE-IMPL` |
| **Audit tip (pre-publication)** | **`18327d521ac55dd40448e5d8a02c3c9cd492adb7`** |
| **Verdict** | **DOCUMENTARY FREEZE REQUIRED BEFORE P2 IMPLEMENTATION AUTHORIZATION** |
| **Blocking findings (baseline/scope)** | **NONE** |
| **Blocking findings (implementation Grant)** | **YES** — exact Decision semantic labels/thresholds/formulas **not established** by published authority (must not invent) |
| **Date** | **2026-08-13** |
| **Branch** | `integration/factory-complete-20260725` |
| **Mode** | **DOCUMENTARY ONLY** |

```text
SP05-P2-PRE-IMPL
  = Independent Pre-IMPL of SP05-P2 INDEPENDENT CORE ONLY
  = DG-01 A/B EXPLICITLY PARKED OUTSIDE THIS CORE

≠ CODE · ≠ GRANT · ≠ P2 IMPL AUTHORIZED BY THIS FILE
≠ DG-01 RESOLUTION
≠ Premium / Diamond / access_tier / strategy selection
≠ dealPipeline canonization
≠ P3 dossier · ≠ P4 closure
≠ Product / Marketplace / SP06–SP08 / Live / LLM
≠ Factory mutation · ≠ P1 intake mutation
```

---

## 0. Absolute non-authorization banner

```text
THIS DOCUMENT DOES NOT AUTHORIZE IMPLEMENTATION.

PRE-IMPL PUBLISHED ≠ CODE AUTHORIZED
PRE-IMPL PUBLISHED ≠ GRANT ISSUED
PRE-IMPL PUBLISHED ≠ P2 OPENED FOR IMPLEMENTATION
PRE-IMPL PUBLISHED ≠ DG-01 RESOLVED

IMPLEMENTATION AUTHORITY = NONE
CODE AUTHORITY           = NONE
```

**DG-01 remains UNRESOLVED — PARTIAL.**
This Pre-IMPL **parks** Question A (Premium/Diamond/`access_tier`) and Question B (strategy selection) **outside** the P2 independent core. Parking ≠ resolution.

---

## 1. Entry baseline (verified)

| Check | Result |
|-------|--------|
| Branch | `integration/factory-complete-20260725` |
| LOCAL = REMOTE HEAD | `18327d521ac55dd40448e5d8a02c3c9cd492adb7` |
| ahead / behind | **0 / 0** |
| Working tree at audit | **CLEAN** |
| SP05-P1 | **COMPLETE AND PUBLISHED** |
| SP05-P2 | **NOT IMPLEMENTED** |

**Authority order:** Mandate → audited Plan → Discovery/Audits → P1 closure → PRE-SP05 → repository evidence.

**Prior documentary scope determination (binding):** P2 independent core **exists**; DG-01 is **not** a global P2 blocker; residual commercial/strategy work remains DG-01-dependent.

---

## 2. P2 core purpose (frozen)

Consume **`DEC-INTAKE`** and derive sovereign **Decision-owned downstream semantics** without altering Factory truth.

**Owned capability class (core):**

1. `classify_deal` (Decision verb)
2. opportunity determination
3. recommendation
4. ranking
5. Decision scoring

**Must remain separate from:**

- Premium · Diamond · `access_tier` · strategy selection
- Product entitlement · Deal Dossier · publication (SP06+)

```text
Decision semantics ≠ commercial tiering
Decision semantics ≠ Product entitlement
Decision score ≠ Factory maturity_score
opportunity ≠ readiness
```

---

## 3. Deficit ownership (frozen)

| Deficit | Disposition under this Pre-IMPL |
|---------|----------------------------------|
| **DEF-SP05-03** | **P2 OWNED** |
| **DEF-SP05-04** | **P2 OWNED** |
| **DEF-SP05-05** | **P2 PARTIAL** — Decision semantic separation portion (full binding with proofs) |
| **DEF-SP05-06** | **DG-01 BLOCKED — OUT OF CORE** |
| **DEF-SP05-12** | **DG-01 BLOCKED — OUT OF CORE** |

No other DEF-SP05 gaps absorbed by convenience (DEF-07=P3 · DEF-08/10=P4 · DEF-01/02/09=P1 closed).

---

## 4. DG-01 hard park (binding)

| Question | Content | Status under P2 core |
|----------|---------|----------------------|
| **A** | Premium · Diamond · `access_tier` | **OUT OF P2 CORE** · parked |
| **B** | strategy selection | **OUT OF P2 CORE** · parked |

```text
DG-01 = UNRESOLVED — PARTIAL

No P2-core implementation may emit, assign, or infer:
  Premium · Diamond · access_tier · strategy

No commercial bands may be hidden inside:
  ranking · scoring · classify_deal · recommendation
```

**ACCESS_TIER:** remains **Product territory** (Mandate/Plan preserved default).

---

## 5. Legacy hard wall — `dealPipeline.js`

| Path | Classification |
|------|----------------|
| `src/lib/dealPipeline.js` | **NON-CANONICAL** · **FORBIDDEN FOR P2 IMPLEMENTATION** |

**Evidence:** self-declares NOT Canon Factory; `classifyDeal` emits `access_tier` / `score_band` / status heuristics from discount — commercial-adjacent Product/pipeline legacy.

**Forbidden:** reuse · wrap · import · copy commercial heuristics · copy `access_tier`/`score_band` · canonize.

**Allowed:** negative architectural evidence only.

---

## 6. Current Decision architecture after P1

| Surface | State |
|---------|-------|
| `src/decision/intake/**` | **COMPLETE** predecessor — **READ ONLY** for P2 |
| `DEC-INTAKE` | Established Decision intake state |
| Decision semantics namespace | **ABSENT** |
| CB-16 | Import/consume-only for regression/context — **no Factory mutation** |

**P2 must consume `DEC-INTAKE`.** Raw/untrusted/diagnostic Factory packages must not bypass P1.

---

## 7. Decision output contract (minimum — capability freeze)

Future P2 Decision outputs **must** be:

| Property | Binding |
|----------|---------|
| Downstream from | **`DEC-INTAKE` only** |
| Ownership | Decision-owned · separate from Factory package |
| Isolation | Immutable or equivalently protected (no shared writable Factory/P1 reference) |
| Provenance | Derived / traceable to Decision inputs |
| Determinism | Identical bounded inputs → identical outputs |
| Honesty | Uncertainty-aware · cannot rewrite Factory truth |

**Preserve explicitly (as FACT inputs, not rewritten):** UNKNOWN · conflict · freshness · completeness · provenance · trust · readiness · identity · jurisdiction.

**Distinction (frozen):**

| Kind | Meaning |
|------|---------|
| **FACT** | Input truth from Factory (via P1 projection) |
| **DERIVED DECISION FACT** | P2-derived conclusion |

Derived conclusions **must not** be represented as upstream observed Factory truth.

**Exact schema/field names:** **TO BE FROZEN BY SUBSEQUENT DOCUMENTARY SEMANTIC FREEZE** (before Grant) — capability class frozen here; payload schema not invented.

---

## 8. `classify_deal` contract (capability freeze)

| Requirement | Binding |
|-------------|---------|
| Ownership | Decision-owned · downstream · derived |
| Character | Non-commercial · traceable · uncertainty-aware |
| MUST NOT mean | Premium · Diamond · `access_tier` · Product entitlement · guaranteed investment outcome |

**CLASSIFY_DEAL LABEL SET:** **NOT YET ESTABLISHED**

Published SP05 Discovery/Plan/Mandate establish **ownership** of the Decision verb and forbid commercial conflation, but **do not** publish an authoritative Decision label vocabulary.
Legacy `dealPipeline` labels (`watchlist` / `opportunity` / `sniper_deal`) are **non-canon** and **must not** be imported.

**Minimum additional authority required before IMPL Grant:** Continuity documentary freeze of bounded Decision `classify_deal` label set (and UNKNOWN/insufficient-evidence behaviors) by Director/Mandate-class instrument — **without inventing in code**.

---

## 9. Opportunity contract (capability freeze)

```text
readiness ≠ opportunity
```

Opportunity = **Decision-derived conclusion only**.

| Topic | Freeze status |
|-------|---------------|
| Minimum inputs | Trusted `DEC-INTAKE` projection + preserved truthAccounting/trust/identity — **ESTABLISHED as class** |
| UNKNOWN behavior | Must not convert UNKNOWN → known opportunity — **ESTABLISHED as rule** |
| Conflict behavior | Must preserve conflicts; must not suppress to force opportunity — **ESTABLISHED as rule** |
| Insufficient evidence | Must fail closed / emit honest insufficient state — **ESTABLISHED as rule**; **exact state labels NOT ESTABLISHED** |
| Thresholds / formulas | **NOT ESTABLISHED** — do not invent |

---

## 10. Recommendation contract (capability freeze)

| Requirement | Binding |
|-------------|---------|
| Character | Decision-side · derived · traceable · honest under incomplete/unknown/conflicting evidence |
| MUST NOT imply | Guaranteed return · commercial tier · Product entitlement · strategy selection |

**Recommendation categories:** **NOT YET ESTABLISHED** — do not invent.

---

## 11. Ranking contract (capability freeze)

Ranking **must**:

- rank only comparable Decision candidates **supplied to P2** (no search/population)
- not invent missing facts
- handle UNKNOWN honestly · preserve conflicts
- not convert rank into Premium/Diamond/`access_tier`
- remain separate from Product ordering/publication

**Single-item behavior:** **MUST be supported** (rank of one is identity / trivial; no invented peers).

**Exact ranking formula / comparator:** **NOT ESTABLISHED** — do not invent.

---

## 12. Decision scoring contract (capability freeze)

Decision score **MUST NOT be**:

- Factory `maturity_score`
- trust score
- completeness score
- commercial tier / Premium / Diamond score

| Topic | Status |
|-------|--------|
| Exact numerical formula | **NOT ESTABLISHED** |
| Scoring weights | **NOT ESTABLISHED** (Discovery explicitly excludes algorithms/weights) |
| Non-numeric bounded evidence model | **NOT AUTHORIZED as substitute IMPL path by this Pre-IMPL** — would still invent Decision semantics without documentary freeze |

**Conclusion:** exact formula unresolved; **further documentary freeze required** before Grant — do not invent a numeric or non-numeric scoring scheme in IMPL to fill the gap.

---

## 13. Implementability test (critical)

| Question | Result |
|----------|--------|
| Can P2 core be implemented **without inventing** classify labels, opportunity thresholds, recommendation categories, ranking formula, scoring formula? | **NO** |
| Are ownership / separation / input / exclusion contracts sufficient for a Pre-IMPL instrument? | **YES** |
| Is an Implementation Grant safe now? | **NO** |

```text
BLOCKER TO IMPLEMENTATION GRANT:
  Exact Decision semantic vocabulary and algorithms are NOT established
  by published SP05 authority. Invention is forbidden.

THIS DOES NOT BLOCK PUBLICATION OF THIS PRE-IMPL.
```

**Documentary freeze still required before Grant** must establish at minimum:

1. Bounded `classify_deal` label set (+ UNKNOWN/insufficient behaviors)
2. Opportunity determination contract (states/thresholds or explicit non-threshold rule set)
3. Recommendation category/contract
4. Ranking comparator contract
5. Decision scoring contract (or explicit Director park of numeric scoring out of first P2 Grant with remaining owned methods still freezable)

Without that freeze: **no Grant · no code**.

---

## 14. Input contract (frozen)

| Rule | Binding |
|------|---------|
| Normal P2 processing requires | Valid **`DEC-INTAKE`** from P1 consumer |
| Bypass of P1 | **FORBIDDEN** (raw / UNTRUSTED / diagnostic / shape-only packages) |
| Trust upgrade | **FORBIDDEN** |
| Factory / P1 projection mutation | **FORBIDDEN** |
| Proof mechanism | P2 validator must reject non-`DEC-INTAKE` inputs and assert P1/Factory corpus unchanged |

---

## 15. Candidate writable surfaces (for **future** Grant only)

**No files created by this Pre-IMPL.** Exact Grant freeze deferred until documentary semantic freeze completes; candidate class:

| PATH | NEW/EXISTING | PURPOSE | WHY REQUIRED | MUTATION TYPE |
|------|--------------|---------|--------------|---------------|
| `src/decision/semantics/decisionSemanticsEngine.js` | **NEW** | Derive classify/opportunity/recommendation/ranking/scoring from `DEC-INTAKE` | P2 owned capability class | CREATE (post-Grant+EXECUTE only) |
| `src/decision/semantics/decisionOutputContract.js` | **NEW** | Decision-owned output representation + FACT vs DERIVED distinction | Downstream isolation / honesty | CREATE (post-Grant+EXECUTE only) |
| `src/decision/semantics/validateDecisionSemantics.js` | **NEW** | T01–T14 proof harness | Mandatory P2 validator | CREATE (post-Grant+EXECUTE only) |

Optional indexes: **NOT REQUIRED**.

### Forbidden mutations (absolute)

| Surface | Binding |
|---------|---------|
| `src/factory/**` | **FORBIDDEN** |
| `src/lib/dealPipeline.js` | **FORBIDDEN** |
| `src/decision/intake/**` | **FORBIDDEN** (P1 closed predecessor — READ ONLY) |
| Product / access / Live / dossier modules | **FORBIDDEN** |

---

## 16. Proof matrix T01–T14 (frozen for future IMPL)

| ID | Obligation |
|----|------------|
| **T01** | `DEC-INTAKE` required as normal P2 input |
| **T02** | Raw / untrusted / diagnostic / shape-only bypass refused |
| **T03** | Factory / P1 input unchanged after P2 processing |
| **T04** | `classify_deal` is downstream + non-commercial |
| **T05** | readiness ≠ opportunity |
| **T06** | UNKNOWN handled honestly |
| **T07** | conflicts / freshness / completeness preserved |
| **T08** | recommendation traceable to Decision evidence |
| **T09** | ranking does not fabricate missing facts |
| **T10** | scoring ≠ trust / maturity / commercial tier |
| **T11** | zero Premium / Diamond / `access_tier` / strategy leakage |
| **T12** | deterministic behavior for identical bounded input |
| **T13** | no Factory / P1 write-back |
| **T14** | P1 + PRE-SP05 / CB regressions PASS |

---

## 17. CAP / ACC contribution (bounded — no overclaim)

| CAP | P2 core contribution |
|-----|----------------------|
| **C-CAP-SP05-01** | **PRESERVE** |
| **C-CAP-SP05-02** | **PRESERVE** |
| **C-CAP-SP05-03** | **ADVANCE / ESTABLISH** (Decision outputs ≠ Factory readiness synonym) |
| **C-CAP-SP05-04** | **PRESERVE** |
| **C-CAP-SP05-05** | **ADVANCE / ESTABLISH** Decision semantics **WITHOUT** commercial Premium/`access_tier` leakage — **only after** semantic freeze + IMPL |
| **C-CAP-SP05-06** | **DOES NOT OWN** / not claimed |

| ACC | P2 core contribution |
|-----|----------------------|
| **C-ACC-SP05-01/02** | **PRESERVE** |
| **C-ACC-SP05-03** | **ADVANCE** (no readiness→opportunity · no trust upgrade · no upstream repair) |
| **C-ACC-SP05-04** | **ADVANCE** (ranking/recommendation/classify without Factory rewrite) — post-IMPL |
| **C-ACC-SP05-05** | **PRESERVE** exclusions |
| **C-ACC-SP05-06/07** | **DOES NOT COMPLETE** |

**Final SP05 CAP/ACC completion: NOT CLAIMED.**

---

## 18. Dependencies / exclusions

| Class | Required? |
|-------|-----------|
| New npm dependencies | **NONE** |
| DB / Supabase / migrations / RLS / Auth / Storage | **NONE** |
| Live / LLM / network APIs | **NONE** |

**Hard exclusions:** DG-01 A/B · Premium/Diamond · `access_tier` · strategy · P3 dossier · P4 closure · Product · Marketplace · SP06–08 · Live · LLM · nationwide · payments · Stripe · CRM.

---

## 19. Findings

| Class | Finding |
|-------|---------|
| **BLOCKER (baseline/scope)** | **NONE** |
| **BLOCKER (Implementation Grant)** | Exact classify labels · opportunity thresholds · recommendation categories · ranking formula · scoring formula **not established** — invention forbidden |
| **OBSERVATION** | P2 independent core authority is clear; only semantic vocabulary/algorithms missing |
| **OBSERVATION** | Plan/Mandate entry gate satisfied for **core Pre-IMPL** by explicit A/B park in this instrument |
| **PARKING/FUTURE** | DEF-06/12 · Premium/Diamond commercial · strategy · Product access · P3/P4 |

---

## 20. Pre-implementation verdict

```text
PRE-IMPLEMENTATION VERDICT:
DOCUMENTARY FREEZE REQUIRED BEFORE P2 IMPLEMENTATION AUTHORIZATION

BASELINE / SCOPE BLOCKERS: NONE
IMPLEMENTATION GRANT BLOCKERS: YES (semantic vocabulary / formulas)

NEXT GATE:
  Continuity documentary Decision Semantics Freeze instrument
  (labels / opportunity / recommendation / ranking / scoring contracts)
  THEN bounded P2 Core Grant — only after freeze Continuity-published

≠ Grant by this file
≠ Code by this file
≠ DG-01 resolution by this file
```

---

## 21. Authority effect after publication

```text
SP05-P2 PRE-IMPL     = PUBLISHED — DOCUMENTARY FREEZE REQUIRED BEFORE GRANT
SP05-P2 IMPLEMENTATION = NOT STARTED · NOT AUTHORIZED
DG-01                = UNRESOLVED — PARTIAL · A/B PARKED OUT OF P2 CORE
IMPLEMENTATION AUTHORITY = NONE
CODE AUTHORITY           = NONE
```

---

## Binding footer

```text
SP05-P2-PRE-IMPL
  = Independent Core Pre-IMPL — Decision Semantics
  = DG-01 A/B PARKED OUT OF CORE
  = Capability contracts FROZEN
  = Exact labels/formulas/thresholds NOT ESTABLISHED
  = DOCUMENTARY FREEZE REQUIRED BEFORE GRANT

≠ CODE · ≠ GRANT · ≠ P2 IMPL
≠ DG-01 RESOLUTION
≠ PREMIUM/DIAMOND · ≠ ACCESS_TIER · ≠ STRATEGY
≠ DEALPIPELINE · ≠ P3/P4 · ≠ PRODUCT · ≠ SP06–08

DECISION OUTSIDE FACTORY INTERNALS
FACTORY TRUTH IMMUTABLE FROM DECISION
```

**END OF SP05-P2-PRE-IMPL**

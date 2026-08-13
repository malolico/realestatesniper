# STRATEGIC PROGRAM 05 — DECISION ENGINE
## SP05-P1 — BOUNDED IMPLEMENTATION GRANT
### Intake / Truth — Exact writable surfaces + execution contract (≠ code)

| Campo | Valor |
|-------|--------|
| **Document ID** | **`SP05-P1-GRANT`** |
| **Grant ID** | **`DAG-SP05-P1-G1`** |
| **File ID** | `FACTORY_EVOLUTION_SP05_P1_BOUNDED_IMPLEMENTATION_GRANT.md` |
| **Path** | `docs/factory-evolution/FACTORY_EVOLUTION_SP05_P1_BOUNDED_IMPLEMENTATION_GRANT.md` |
| **Nature** | Bounded **Director Grant** — Continuity-records exact mutable Decision-side surfaces and authorized technical purpose for **future** SP05-P1 implementation · **≠ code in this file** · **≠ implementation by publication** · **≠ Director EXECUTE** · **≠ DG-01 resolved** · **≠ P2/P3/P4** · **≠ Product / Marketplace / SP06–08 / Live** |
| **Program** | **Strategic Program 05 — Decision Engine** |
| **Phase** | **SP05-P1 — Intake / Truth** only |
| **Parent Mandate** | `SP05-ENG-IMPL` · Continuity Commit **`9294b7b38cf1e78b353331e20a0d547897bb42d1`** · **UNCHANGED** |
| **Parent Pre-IMPL** | `SP05-P1-PRE-IMPL` · Continuity Commit **`ce751482747141d20ed8c83fe2455447d825a123`** · **READY WITH OBSERVATIONS** · blockers **NONE** · **UNCHANGED** |
| **Parent Plan** | `SP05-02` · Continuity Commit **`5df541ebb47ccc379e73573c2a7fe4d91f6d58d8`** · **UNCHANGED** |
| **Parent Plan Audit** | `SP05-02-PLAN-IDA` · Continuity Commit **`ac288fdbda14632b1e8db98a3ae4e9005b9e385d`** · **UNCHANGED** |
| **PRE-SP05 antecedent** | PRE-SP05 COMPLETE · PS05-05 trusted CB-16 frontier · PS05-06 isolation · **PRESERVED** |
| **Entry tip (pre-publication)** | **`ce751482747141d20ed8c83fe2455447d825a123`** |
| **Date** | **2026-08-13** |
| **Branch** | `integration/factory-complete-20260725` |
| **Mode** | **DOCUMENTARY AUTHORITY ONLY** |

```text
DAG-SP05-P1-G1
  = Bounded Grant for SP05-P1 Intake / Truth ONLY
  = Exact writable file freeze + proof/execution contract

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
| Test / fixture mutation | **NOT AUTHORIZED** until Director EXECUTE |
| DG-01 Question A / B | **ZERO AUTHORITY** |
| SP05-P2…P4 | **NOT OPENED** |
| Factory CB-02 / CB-05 / CB-13 / CB-16 source | **FORBIDDEN MUTATION** |

```text
THIS GRANT NARROWS AUTHORITY.
IT MUST NOT BROADEN THE MANDATE OR PRE-IMPL.
```

---

## 1. Subordination (binding)

This Grant is expressly subordinated to:

| Instrument | Posture |
|------------|---------|
| **SP05-ENG-IMPL** | **UNCHANGED** · controlling engineering class |
| **SP05-P1-PRE-IMPL** | **UNCHANGED** · READY WITH OBSERVATIONS · blockers NONE |
| **SP05-02 / SP05-02-PLAN-IDA** | **UNCHANGED** |
| **SP05-01 / SP05-01-DISCOVERY-IDA** | **UNCHANGED** |
| **PRE-SP05 COMPLETE / PS05-05 / PS05-06** | **PRESERVED** |
| **DG-01** | **UNRESOLVED — PARTIAL** · P1 dependency **NONE** |

```text
GRANT ≠ AMEND PARENTS
GRANT ≠ EXPAND PRE-IMPL SCOPE
GRANT ≠ RESOLVE DG-01
GRANT ≠ OPEN P2/P3/P4
```

---

## 2. Grant purpose (frozen)

Authorize, **subject to later explicit Director EXECUTE**, the **minimum** Decision-side code surfaces necessary to establish:

1. sovereign Decision intake;
2. trusted fail-closed CB-16 consumption;
3. immutable Decision-side projection;
4. no Factory write-back;
5. T01–T12 proof contract.

**Owned deficits under this Grant (after EXECUTE):** DEF-SP05-01 · DEF-SP05-02 · DEF-SP05-09 · DEF-SP05-05 (honesty/intake portion only).

```text
P1 PURPOSE
  = Decision-side ST-RDY → DEC-INTAKE foundation
  ≠ classify_deal / opportunity / recommendation / ranking / scoring
  ≠ Premium / Diamond / access_tier / strategy
  ≠ Deal Dossier / Product / Marketplace / SP06–08 / Live
```

---

## 3. Decision intake state identifier (frozen)

| Campo | Binding |
|-------|---------|
| **Identifier** | **`DEC-INTAKE`** |
| **Ownership** | Decision-side only |
| **Meaning** | Trusted package **accepted** into Decision-side intake |
| **NOT meaning** | opportunity · recommendation · ranking · classification · Premium/Diamond · `access_tier` · full Decision completion · Factory `ST-DEC` |

**Convention basis:**

- Factory frontier states remain `ST-RDY` / Factory `ST-DEC` (Factory-owned; unchanged).
- Plan distinguishes **Factory ST-DEC** from **Decision-side DEC** after authorized consumption.
- Pre-IMPL deferred the exact P1 identifier and forbade inventing broad business meaning; full Decision ST-DEC semantics remain later-phase.
- **`DEC-INTAKE`** is the smallest Decision-namespaced token that records intake acceptance without colliding with Factory `ST-*` or claiming P2 semantics.

```text
Factory ST-RDY / Factory ST-DEC  = Factory-owned (preserve)
DEC-INTAKE                       = P1 Decision-side accepted/intake ONLY
Decision-side full DEC semantics = LATER (not authorized by this Grant)
```

Resolves Pre-IMPL **OBS-P1-STATE-NAME** for P1 Grant scope only.

---

## 4. Exact writable files (frozen)

**No broad directory write authorization.** Creating parent directories is incidental to creating the enumerated files only.

### 4.1 REQUIRED writable surfaces

| PATH | NEW / EXISTING | PURPOSE | WHY REQUIRED | AUTHORIZED MUTATION TYPE |
|------|----------------|---------|--------------|--------------------------|
| `src/decision/intake/decisionIntakeConsumer.js` | **NEW** | Decision-side intake consumer: accept trusted packages → `DEC-INTAKE`; refuse non-trusted / honesty failures | Sovereign fail-closed consume (DEF-SP05-01/02) | **CREATE** (post-EXECUTE) |
| `src/decision/intake/immutableDecisionProjection.js` | **NEW** | Defensive deep clone + deep freeze (or equivalent) of accepted corpus; nested isolation | No write-back / shared-reference isolation (DEF-SP05-09 · OBS-P1-LIVE-REFERENCE) | **CREATE** (post-EXECUTE) |
| `src/decision/intake/validateDecisionIntake.js` | **NEW** | P1 proof harness implementing T01–T12 | Mandatory SP05-P1 validator | **CREATE** (post-EXECUTE) |

**Minimum coherent file count:** **3** — maps 1:1 to Pre-IMPL required responsibilities (consumer · immutable projection · proof harness). No additional files are required for the frozen P1 contract.

### 4.2 OPTIONAL writable surfaces

| PATH | NEW / EXISTING | PURPOSE | WHY OPTIONAL | AUTHORIZED MUTATION TYPE |
|------|----------------|---------|--------------|--------------------------|
| `src/decision/intake/index.js` | **NEW** | Thin barrel re-export of intake consumer / projection / validator | Convenience only; not required for T01–T12 | **CREATE** only if EXECUTE needs a single import seam |
| `src/decision/index.js` | **NEW** | Thin Decision namespace root re-export | Namespace hygiene only | **CREATE** only if EXECUTE needs namespace entry |

Optional files must not add semantics beyond re-export of §4.1 surfaces.

### 4.3 Explicitly NOT writable

Any path outside §4.1 / §4.2 = **STOP**.

---

## 5. Factory import surfaces — READ ONLY

P1 may **import/consume** the following CB-16 interfaces. **No Factory source file is writable.**

| Path | Import role (read-only) |
|------|-------------------------|
| `src/factory/cb16/decisionPackageSchema.js` | `DECISION_PACKAGE_VERSION` · `validateDecisionPackageShape` · `validateTrustedDecisionPackage` · blocked-ops helpers as needed |
| `src/factory/cb16/decisionHandoffInterface.js` | `deliverDecisionPackage` · `createDecisionHandoffPort` · delivery receipt consumption for proofs |

```text
src/factory/cb02/** = READ ONLY / FORBIDDEN MUTATION
src/factory/cb05/** = READ ONLY / FORBIDDEN MUTATION
src/factory/cb13/** = READ ONLY / FORBIDDEN MUTATION
src/factory/cb16/** = READ ONLY / FORBIDDEN MUTATION

NO SUPPLEMENTAL FACTORY AUTHORITY EXISTS.
```

Factory `prepareAndDeliver` / Factory `ST-DEC` remain Factory-owned. P1 must not confuse Factory `ST-DEC` with `DEC-INTAKE` or opportunity (OBS-P1-FACTORY-STDEC).

---

## 6. Immutability contract (frozen)

| Requirement | Binding |
|-------------|---------|
| Accepted Factory corpus | Must become a **Decision-owned independent representation** |
| Nested mutation | Mutation of Decision representation **must not** affect original Factory-delivered corpus |
| Shared writable reference | Decision processing **must not** hold a writable shared reference to Factory truth |
| Authorized mechanism | **defensive deep clone + deep freeze** OR equivalent implementation **proven by T06/T11** |
| CB-16 mutation | **FORBIDDEN** |
| New dependencies | **NONE expected** · any required dependency = **STOP** |

T06/T11 **must** demonstrate nested-object mutation isolation, not merely top-level protection.

---

## 7. Fail-closed contract (frozen)

### Normal Decision intake

**Trusted packages only** → may yield **`DEC-INTAKE`**.

### Must refuse

- UNTRUSTED
- shape-only but untrusted
- diagnostic delivery (`allowUntrustedDiagnostic` / untrusted lane)
- missing/false honesty locks
- contaminated trusted claims
- malformed trusted package

### Must preserve

- UNKNOWN
- conflicts
- freshness
- completeness
- provenance
- identity
- jurisdiction
- truthAccounting

### Must not

- upgrade trust
- repair Factory facts
- emit opportunity
- emit recommendation
- emit ranking
- emit scoring
- emit Premium / Diamond / `access_tier`
- emit strategy selection

---

## 8. Proof matrix T01–T12 (frozen)

| ID | Obligation |
|----|------------|
| **T01** | Trusted package accepted |
| **T02** | UNTRUSTED refused |
| **T03** | Shape-valid but untrusted refused |
| **T04** | Diagnostic lane refused from normal intake |
| **T05** | Missing/false honesty locks refused |
| **T06** | Factory source corpus unchanged after intake/downstream mutation attempt (**nested objects**) |
| **T07** | UNKNOWN / conflict / freshness / completeness / provenance / identity / jurisdiction preserved |
| **T08** | No trust upgrade or Factory repair |
| **T09** | No opportunity / recommendation / ranking / scoring output |
| **T10** | No Premium / Diamond / `access_tier` / strategy output |
| **T11** | No Factory write-back / nested isolation |
| **T12** | CB-16 + PRE-SP05 / CB regressions PASS |

---

## 9. Regression contract (frozen)

| Class | Surfaces |
|-------|----------|
| **MANDATORY** | New SP05-P1 validator (`validateDecisionIntake.js`) · **CB-16** |
| **NON-REGRESSION** | CB-02 · CB-05 · CB-13 |
| **Applicable PRE-SP05 proof rows** | PS05-01 · PS05-02 · PS05-03 · PS05-04 · PS05-05 · PS05-06 |

```text
NO P1 CLOSURE IF ANY REQUIRED TRUTH REGRESSION FAILS.
```

---

## 10. Hard exclusions (binding)

This Grant **MUST NOT** authorize:

- `classify_deal` · opportunity · recommendation · ranking · scoring
- strategy selection · Premium · Diamond · `access_tier`
- Deal Dossier · P2 / P3 / P4
- Product · Marketplace · SP06 / SP07 / SP08
- Live · LLM · nationwide rollout
- Factory source mutation · `src/lib/dealPipeline.js`
- DB · Supabase · migrations · RLS · Auth · Storage
- new npm dependencies / upgrades
- payments · Stripe · CRM

---

## 11. DG-01 (binding)

| Item | State |
|------|-------|
| DG-01 | **UNRESOLVED — PARTIAL** |
| P1 dependency | **NONE** |
| Question A (Premium/Diamond/`access_tier`) | **ZERO AUTHORITY** under this Grant |
| Question B (strategy selection) | **ZERO AUTHORITY** under this Grant |

---

## 12. CAP / ACC contribution (no overclaim)

| Class | Contribution after successful P1 EXECUTE+proof (later) |
|-------|--------------------------------------------------------|
| Establishes / advances | C-CAP-SP05-01 · C-CAP-SP05-02 |
| Preserves | C-CAP-SP05-03 · C-CAP-SP05-04 |
| Does not own | C-CAP-SP05-05 · C-CAP-SP05-06 |
| Advances | C-ACC-SP05-01 · C-ACC-SP05-02 · C-ACC-SP05-03 |

This Grant does **not** complete the final SP05 ACC matrix.

---

## 13. Stop conditions (future implementation)

Future implementation **must STOP** if:

1. any Factory file requires mutation;
2. any file outside the exact Grant set (§4.1 / authorized §4.2) is required;
3. a new dependency is required;
4. P1 requires DG-01 semantics;
5. P2 / P3 / P4 semantics become necessary;
6. trusted fail-closed intake cannot be proven;
7. nested isolation cannot be proven;
8. PRE-SP05 / CB truth regression occurs.

**Required report on any attempted scope expansion (no silent expansion):**

```text
REQUIRED_UNAUTHORIZED_SURFACE:
WHY_REQUIRED:
BLOCKED_OBLIGATION:
MINIMUM_SCOPE_EXPANSION:
```

---

## 14. Observations carried forward (non-blocking)

| ID | Disposition under this Grant |
|----|------------------------------|
| **OBS-P1-LIVE-REFERENCE** | **CONSUMED** by §4.1 immutable projection + T06/T11 |
| **OBS-P1-NEW-NAMESPACE** | **CONSUMED** by authorizing NEW `src/decision/intake/*` |
| **OBS-P1-STATE-NAME** | **RESOLVED** as **`DEC-INTAKE`** (§3) |
| **OBS-P1-FACTORY-STDEC** | **PRESERVE** — Factory ST-DEC ≠ DEC-INTAKE ≠ opportunity |

**BLOCKERS:** **NONE**

---

## 15. Nature of authorization / EXECUTE sequence

| Act | Effect |
|-----|--------|
| Drafting / publishing this Grant | **≠** implementation |
| HEAD sync CLEAN after publication | Prerequisite · **≠** execute |
| Explicit Director phrase **`Aprobado. Ejecuta.`** | **REQUIRED** before any §4 code mutation |
| Implementation | **ONLY** on §4 enumerated surfaces · only after EXECUTE |

```text
AFTER GRANT PUBLICATION:

  SP05-P1                  = GRANT PUBLISHED — NOT IMPLEMENTED
  IMPLEMENTATION AUTHORITY = AWAITING DIRECTOR EXECUTE
  CODE AUTHORITY           = NONE UNTIL EXPLICIT DIRECTOR EXECUTE
```

---

## 16. Mutation boundary for this Continuity act

Authorized mutation **now**:

- **ONE** Grant document only (`FACTORY_EVOLUTION_SP05_P1_BOUNDED_IMPLEMENTATION_GRANT.md`)

**NOT authorized now:**

- implementation files
- test files
- Factory files
- package.json / dependencies
- DG-01 instruments
- P2/P3/P4 instruments

---

## Binding footer

```text
DAG-SP05-P1-G1 / SP05-P1-GRANT
  = Bounded Implementation Grant — Intake / Truth
  = Exact files: decisionIntakeConsumer · immutableDecisionProjection · validateDecisionIntake
  = State: DEC-INTAKE
  = T01–T12 frozen
  = Factory CB-02/05/13/16 FORBIDDEN MUTATION

≠ CODE · ≠ EXECUTE · ≠ DG-01 RESOLUTION
≠ P2/P3/P4 · ≠ PRODUCT · ≠ ACCESS_TIER · ≠ PREMIUM/DIAMOND · ≠ STRATEGY
≠ SP06–SP08 · ≠ LIVE · ≠ LLM · ≠ NATIONWIDE · ≠ DEPENDENCIES

DECISION OUTSIDE FACTORY INTERNALS
FACTORY TRUTH IMMUTABLE FROM DECISION

Required before mutation: Aprobado. Ejecuta.
```

**END OF SP05-P1-GRANT / DAG-SP05-P1-G1**

# STRATEGIC PROGRAM 06 — PUBLICATION
## SP06-P2 — BOUNDED IMPLEMENTATION GRANT
### Bounded Publication Unit / Projection — Exact writable surfaces + execution contract (≠ code)

| Campo | Valor |
|-------|--------|
| **Document ID** | **`SP06-P2-GRANT`** |
| **Grant ID** | **`DAG-SP06-P2-G1`** |
| **File ID** | `FACTORY_EVOLUTION_SP06_P2_BOUNDED_IMPLEMENTATION_GRANT.md` |
| **Path** | `docs/factory-evolution/FACTORY_EVOLUTION_SP06_P2_BOUNDED_IMPLEMENTATION_GRANT.md` |
| **Nature** | Bounded **Director Grant** — Continuity-records exact mutable Publication-side surfaces and authorized technical purpose for **future** SP06-P2 fail-closed-only unit/projection implementation · **≠ code in this file** · **≠ implementation by publication** · **≠ Director EXECUTE** · **≠ positive ELIGIBLE / FORMED emission** · **≠ P3** · **≠ Product / Marketplace / SP07–08** |
| **Program** | **Strategic Program 06 — Publication** |
| **Phase** | **SP06-P2 — Bounded Publication Unit / Projection** (fail-closed-only) |
| **Parent Mandate** | `SP06-ENG-IMPL` · Continuity Commit **`6935c698ea347751083d468bbf187be49e5c8c19`** · **UNCHANGED** |
| **Parent Plan** | `SP06-02` · Continuity Commit **`439609d95e3d377bb6d08620be30d8d849c7e808`** · **UNCHANGED** |
| **Parent Discovery** | `SP06-01` · Continuity Commit **`15a76bc28da72d00396d70c39d741ab8b516e3bf`** · **UNCHANGED** |
| **Parent P1 Complete** | `SP06-P1-COMPLETE-STATUS-01` · Continuity Commit **`f782db86b3820a204bc19b2b3bd2cbc5d4e6664d`** · **CLOSED / READ-ONLY** |
| **Parent P2 Pre-IMPL** | `SP06-P2-PRE-IMPL` · Continuity Commit **`e46c0f78f8d300a05df453f5ea9becdcfdc0f958`** · **PASS WITH OBSERVATIONS** |
| **Parent P2 Freeze** | `SP06-P2-UNIT-PROJECTION-FREEZE-01` · Continuity Commit **`a5a3652b12af5e3acb7417336879348052ac1074`** · **BINDING** |
| **Parent Freeze Audit** | Session STRICT READ ONLY · **PASS WITH OBSERVATIONS** · blockers **NONE** · **P2 GRANT READINESS = READY** |
| **Parent SP05 P3** | CLOSED / READ-ONLY · **no reopen** |
| **Authorizing Director act** | Director authorization to create and Continuity-publish **only** this bounded Grant · phrase **`Aprobado. Ejecuta.`** (Grant publication) · **≠ EXECUTE** for source |
| **Entry tip (pre-publication)** | **`a5a3652b12af5e3acb7417336879348052ac1074`** |
| **Date** | **2026-08-14** |
| **Branch** | `integration/factory-complete-20260725` |
| **Mode** | **DOCUMENTARY AUTHORITY ONLY** |

```text
DAG-SP06-P2-G1
  = Bounded Grant for SP06-P2 Publication Unit / Projection CORE ONLY
  = FAIL-CLOSED-ONLY · ELIGIBLE / FORMED RESERVED / UNREACHABLE
  = Exact writable file freeze + proof/execution contract
  = Controls = SP06-P2-UNIT-PROJECTION-FREEZE-01

GRANT PUBLISHED ≠ CODE AUTHORIZED
GRANT PUBLISHED ≠ IMPLEMENTATION STARTED
GRANT PUBLISHED ≠ DIRECTOR EXECUTE

IMPLEMENTATION AUTHORITY = NO
CODE AUTHORITY           = NONE UNTIL EXPLICIT DIRECTOR EXECUTE

Required Director authorization phrase before any code mutation:
  Aprobado. Ejecuta.
```

---

## 0. Absolute non-authorization banner

| Surface | Under this Grant publication alone |
|---------|-------------------------------------|
| Publication / Decision / Factory code | **NOT AUTHORIZED** |
| `src/publication/p2/**` creation | **NOT AUTHORIZED** until Director EXECUTE |
| Test / fixture mutation outside Grant | **NOT AUTHORIZED** until Director EXECUTE |
| Positive `ELIGIBLE` / `FORMED` emission | **FORBIDDEN** under current P2 authority |
| SP06-P3 | **NOT OPENED** |
| SP06-DG-01…04 final disposition | **NOT PERFORMED** |
| SP07 / SP08 | **NOT OPENED** |
| Product / Marketplace / payment / entitlement | **ZERO AUTHORITY** |

```text
THIS GRANT NARROWS AUTHORITY.
IT MUST NOT BROADEN THE MANDATE OR P2 FREEZE.
THIS GRANT ≠ EXECUTE.
THIS GRANT ≠ INVENT POSITIVE ELIGIBLE / FORMED PATH.
THIS GRANT ≠ OPEN P3.
THIS GRANT ≠ RESOLVE DG-01 / DG-04.
```

---

## 1. Subordination (binding)

| Instrument | Posture |
|------------|---------|
| **SP06-ENG-IMPL** | **UNCHANGED** · controlling engineering class |
| **SP06-02 / SP06-01** | **UNCHANGED** |
| **SP06-P1-COMPLETE-STATUS-01** + closed P1 surfaces | **CLOSED PREDECESSOR / READ ONLY** |
| **SP06-P2-UNIT-PROJECTION-FREEZE-01** @ `a5a3652…` | **BINDING** contract |
| **SP06-P2-PRE-IMPL** @ `e46c0f7…` | **CONSUMED** |
| **SP05-P3** + dossier freeze | **CLOSED / READ-ONLY** |
| **II.3 / II.4** | **INTEGRATION ANTECEDENTS** · not mutated |
| **SP06-DG-01** | **UNRESOLVED** · **NON-BLOCKING BY EXCLUSION** |
| **SP06-DG-02 / DG-03** | **PARKING / FUTURE** · **OUTSIDE P2 CORE** |
| **SP06-DG-04** | **UNRESOLVED** · **NON-BLOCKING BY BOUNDED OMISSION** |

```text
GRANT ≠ AMEND PARENTS
GRANT ≠ REOPEN / REWRITE FREEZE
GRANT ≠ RESOLVE DG-01 / DG-04
GRANT ≠ OPEN P3 / SP07 / SP08
GRANT ≠ INVENT SEMANTICS BEYOND FREEZE
```

---

## 2. Grant purpose (frozen)

Authorize, **subject to later explicit Director EXECUTE**, the **minimum** Publication-side code surfaces necessary to establish:

1. bounded consume-only evaluation of **`rsn.publication.eligibility.result.v1`** P1 root input;
2. fail-closed-only Publication Unit / projection evaluation emitting **`rsn.publication.unit.result.v1`**;
3. **`decision = ELIGIBLE`** and **`formation = FORMED`** **MUST NOT be emitted** under current P2 authority;
4. deterministic evaluation · new derived output · no predecessor mutation;
5. SP06-P2-T01…T33 proof harness obligations (§11).

**Owned deficits (after EXECUTE):** DEF-SP06-03 · DEF-SP06-04 · DEF-SP06-05.

```text
P2 PURPOSE
  = Publication-side P1-result consume + fail-closed unit/projection evaluation
  = FAIL-CLOSED-ONLY under closed P1 policy
  ≠ positive ELIGIBLE / FORMED criterion
  ≠ delivery / public release
  ≠ Product / Marketplace / Premium / Diamond / access_tier
  ≠ owner disclosure / contact / outreach / targeting
  ≠ BUY / SELL / INVEST / transaction advice
  ≠ SP06-P3 / SP07 / SP08
```

---

## 3. Input contract (binding)

| Campo | Frozen value |
|-------|--------------|
| **schemaId** | **`rsn.publication.eligibility.result.v1`** |
| **version** | **`v1`** |
| **Classification** | **REQUIRED** · sole accepted bounded SP06-P2 root input |
| **Posture** | **CONSUME_ONLY** · no alternate root input |

**Required P1 result accept gate (from Freeze):**

| Requirement | Binding |
|-------------|---------|
| Structured object | object · not null/array/primitive |
| `meta.schemaId` | `rsn.publication.eligibility.result.v1` |
| `meta.version` | `v1` |
| `decision` | **`REFUSED`** or **`NOT_ELIGIBLE`** only under current authority |
| `delivery` | **`NOT_AUTHORIZED`** |
| Required top-level | **`meta` · `decision` · `delivery` · `reasons` · `inputRef` · `honesty` · `invariants` · `sideEffects`** |

**DEC-DOSSIER supporting context:**

| Role | Binding |
|------|---------|
| **DEC-DOSSIER** | **CONTEXTUAL / CONSUME_ONLY** only via canonical P1 `inputRef` / lineage / provenance cites when required for honest projection |
| **Bypass / root substitution** | **FORBIDDEN** |

**Forbidden alternate roots:**

```text
raw Factory ELR · CB-16 · II.2 Read Model · II.3 · II.4
Product · Marketplace · payment · tier · entitlement
```

Structural / accept-gate failure → P2 **`REFUSED`** · **`NOT_FORMED`** · no unit · no projection.

---

## 4. Result contract (binding)

| Campo | Frozen value |
|-------|--------------|
| **schemaId** | **`rsn.publication.unit.result.v1`** |
| **version** | **`v1`** |
| **`meta.state`** | **`PUB-UNIT-RESULT`** |
| **`ruleVersion`** | **`sp06-p2-unit-projection-fail-closed.v1`** |
| **`decision`** | **`REFUSED`** \| **`NOT_ELIGIBLE`** \| **`ELIGIBLE`** (reserved vocabulary) |
| **`formation`** | **`NOT_FORMED`** \| **`FORMED`** (reserved vocabulary) |
| **`delivery`** | Always **`NOT_AUTHORIZED`** |

Under current P2 authority:

| Upstream P1 `decision` | P2 `decision` | P2 `formation` | Unit / projection |
|------------------------|-----------------|----------------|-------------------|
| **`REFUSED`** | **`REFUSED`** | **`NOT_FORMED`** | **null / absent** |
| **`NOT_ELIGIBLE`** | **`NOT_ELIGIBLE`** | **`NOT_FORMED`** | **null / absent** |
| **`ELIGIBLE`** | **RESERVED / UNREACHABLE** | **FORMED reserved / unreachable** | **MUST NOT emit** |

| Emission rule | Binding |
|---------------|---------|
| **`REFUSED`** | **ALLOWED** · accept-gate / structural failure |
| **`NOT_ELIGIBLE`** | **ALLOWED** · accepted upstream NOT_ELIGIBLE path |
| **`ELIGIBLE`** | **FORBIDDEN** · RESERVED / UNREACHABLE |
| **`NOT_FORMED`** | **ALLOWED** · only reachable formation under current authority |
| **`FORMED`** | **FORBIDDEN** · RESERVED / UNREACHABLE |

**Required top-level sections (minimum):**

```text
meta · decision · formation · delivery · reasons · inputRef · identity
lineage · eligibilityBinding · projection · provenance · honesty
invariants · sideEffects
```

---

## 5. P1 policy binding (unchanged — binding)

From closed **`SP06-P1-DIR-DISP-01`** + **`SP06-P1-COMPLETE-STATUS-01`**:

```text
REFUSED       = REACHABLE
NOT_ELIGIBLE  = REACHABLE
ELIGIBLE      = RESERVED / UNREACHABLE
positive criterion = NONE AUTHORIZED
delivery      = NOT_AUTHORIZED
```

P2 implementation **MUST NOT**:

- invent positive eligibility
- emit synthetic ELIGIBLE
- override P1
- reinterpret P1 policy
- create a current positive publication / formation path

---

## 6. New derived object (binding)

P2 result **MUST** be a **NEW DERIVED OBJECT**.

It is **NOT**:

```text
Factory ELR · raw expediente · DEC-DOSSIER · CB-16 synonym
II.2 Read Model · II.4 Publication Unit reuse
Product card · Marketplace card · owner-contact package · delivery payload
```

No predecessor mutation.

---

## 7. Honesty / projection rules (binding)

Future implementation **MUST** preserve Freeze requirements for:

- provenance · lineage · UNKNOWN · conflict · freshness
- optional absence · omission · redaction
- no truth upgrade · no synthetic enrichment

**Explicit invariants (minimum semantic locks):**

```text
UNKNOWN ≠ NONE
UNKNOWN ≠ ABSENT
ABSENT ≠ NONE
CONFLICT ≠ negative truth invention
stale ≠ false
freshness ≠ truth
```

No hidden selection of one side of a conflict.

No unsupported inference expansion.

When **`formation = NOT_FORMED`**, **`projection`** **MUST NOT** invent outward publishable content.

---

## 8. Owner / DG-04 wall (binding)

**Excluded from outward projection:**

owner name · owner identity disclosure · email · phone · contact details · contact unlock · outreach · targeting

If **`ownerRef`** appears in upstream context:

- **opaque consume-only reference/provenance material only**
- **MUST NOT** become disclosure authority

**SP06-DG-04:** **UNRESOLVED** · **NON-BLOCKING BY BOUNDED OMISSION** · **NOT RESOLVED** by this Grant.

---

## 9. Product / DG walls (binding)

**No dependency on:**

Product · Marketplace · Premium · Diamond · `access_tier` · entitlement · subscription · monetization · payment · Stripe · strategy

| Gate | Status |
|------|--------|
| **SP06-DG-01** | **UNRESOLVED / NON-BLOCKING BY EXCLUSION** |
| **SP06-DG-02** | **PARKING / FUTURE** |
| **SP06-DG-03** | **PARKING / FUTURE / OUTSIDE CORE** |

No Director disposition performed by this Grant.

---

## 10. Raw ELR wall (binding)

```text
Factory ELR ≠ Publication payload
```

P2 **MUST NOT**:

- consume raw ELR as root
- expose raw ELR outward
- mirror the expediente
- publish CB-16 as renamed unit
- write back to Factory or Decision / SP05
- use II.2 as truth oracle

---

## 11. II.4 relationship (binding)

**Classification: PARTIALLY REUSABLE GOVERNANCE / CONTRACT ANTECEDENT ONLY**

Reusable patterns only: atomicity · immutability · identity binding · fail-closed refusal · `delivery = NOT_AUTHORIZED`

**NOT authorized:**

- II.4 schema reuse as P2 schema
- II.4 input-chain reuse
- II.4 oracle role
- mutation to `src/integration/publicationUnit/**`

---

## 12. Determinism / immutability (binding)

Future implementation **MUST**:

```text
same canonical semantic accepted P1 root input
  (+ same bounded supporting context)
→ same semantic P2 result
```

**Forbidden:** randomness · wall-clock semantic truth · LLM/AI judgment · network IO · external IO · economic attractiveness logic

**MUST NOT mutate:** P1 result · DEC-DOSSIER · SP05 · Factory · Decision · II.3 · II.4

---

## 13. Exact writable files (frozen)

**No broad directory write authorization.** Creating parent directories is incidental to creating the enumerated files only.

### 13.1 REQUIRED writable surfaces

| PATH | NEW / EXISTING | PURPOSE | AUTHORIZED MUTATION TYPE |
|------|----------------|---------|--------------------------|
| `src/publication/p2/publicationUnitContract.js` | **NEW** | Input/result constants · accept-gate schema class · honesty locks for `rsn.publication.unit.result.v1` | **CREATE** (post-EXECUTE) |
| `src/publication/p2/publicationUnitProjector.js` | **NEW** | Consume-only P1 eligibility result · fail-closed-only unit/projection evaluation · emit derived result · **no ELIGIBLE / FORMED emission** | **CREATE** (post-EXECUTE) |
| `src/publication/p2/validatePublicationUnit.js` | **NEW** | P2 proof harness implementing §14 obligations `SP06-P2-T01…T33` | **CREATE** (post-EXECUTE) |

**Minimum coherent file count:** **3**.

### 13.2 OPTIONAL writable surfaces

| PATH | NEW / EXISTING | PURPOSE | AUTHORIZED MUTATION TYPE |
|------|----------------|---------|--------------------------|
| `src/publication/p2/index.js` | **NEW** | Thin barrel re-export of §13.1 surfaces | **CREATE** only if EXECUTE needs a single import seam |

Optional file must not add semantics beyond re-export of §13.1 surfaces.

### 13.3 Explicitly NOT writable

| Surface | Binding |
|---------|---------|
| Any path outside §13.1 / §13.2 | **STOP** |
| `src/publication/p1/**` | **FORBIDDEN** (P1 closed — **READ ONLY**) |
| `src/factory/**` | **FORBIDDEN** |
| `src/decision/**` | **FORBIDDEN** (SP05 closed — **READ ONLY**) |
| `src/integration/publicationEligibility/**` | **FORBIDDEN** (II.3 — **READ ONLY**) |
| `src/integration/publicationUnit/**` | **FORBIDDEN** (II.4 — **READ ONLY**) |
| `src/integration/readModel/**` | **FORBIDDEN** |
| Product / Marketplace / payment / entitlement / owner-contact surfaces | **FORBIDDEN** |
| `src/publication/p3/**` or other Publication phases | **NOT OPENED** |

If implementation later requires any ungranted file: **STOP** and obtain new Continuity authority.

---

## 14. Proof contract (binding · NOT EXECUTED)

Stable series: **`SP06-P2-T01`…`SP06-P2-T33`** — **DEFINED / NOT EXECUTED** at Grant publication.

| ID | Obligation |
|----|------------|
| **SP06-P2-T01** | Accepted canonical P1 eligibility result root input |
| **SP06-P2-T02** | Malformed P1 result → REFUSED / NOT_FORMED |
| **SP06-P2-T03** | Unsupported schema/version/state → REFUSED / NOT_FORMED |
| **SP06-P2-T04** | Upstream P1 `REFUSED` → P2 REFUSED / NOT_FORMED · no unit · no projection |
| **SP06-P2-T05** | Upstream P1 `NOT_ELIGIBLE` → P2 NOT_ELIGIBLE / NOT_FORMED · no unit · no projection |
| **SP06-P2-T06** | ELIGIBLE / FORMED unreachable honesty · no positive formation under current authority |
| **SP06-P2-T07** | No P1 eligibility override / re-adjudication |
| **SP06-P2-T08** | Lineage integrity preserved · no synthetic lineage |
| **SP06-P2-T09** | Provenance integrity preserved · no synthetic provenance |
| **SP06-P2-T10** | Deterministic repeat |
| **SP06-P2-T11** | Immutability · no predecessor mutation |
| **SP06-P2-T12** | New derived Publication Unit result object only |
| **SP06-P2-T13** | Raw ELR wall · no raw ELR root/payload |
| **SP06-P2-T14** | No Factory write-back |
| **SP06-P2-T15** | No Decision / SP05 write-back |
| **SP06-P2-T16** | P1 surfaces immutability / non-regression |
| **SP06-P2-T17** | Honesty survival under projection |
| **SP06-P2-T18** | UNKNOWN preservation |
| **SP06-P2-T19** | Conflict preservation / fail-closed behavior |
| **SP06-P2-T20** | Freshness limitation preservation |
| **SP06-P2-T21** | Optional-field absence · ABSENT ≠ UNKNOWN ≠ NONE |
| **SP06-P2-T22** | Product isolation |
| **SP06-P2-T23** | Premium / Diamond / `access_tier` isolation |
| **SP06-P2-T24** | Payment / monetization isolation |
| **SP06-P2-T25** | Owner identity / contact exclusion |
| **SP06-P2-T26** | Transaction-language wall |
| **SP06-P2-T27** | Delivery always NOT_AUTHORIZED |
| **SP06-P2-T28** | SP06-P1 regression SP06-P1-T01…T28 PASS |
| **SP06-P2-T29** | SP05-P3 regression P3-G01…P3-G30 PASS |
| **SP06-P2-T30** | II.3 Publication Eligibility 16-test regression PASS |
| **SP06-P2-T31** | II.4 non-oracle boundary · Integration antecedent not mutated · not used as SP06 root |
| **SP06-P2-T32** | SP06-P3 remains unopened (documentary/proof honesty) |
| **SP06-P2-T33** | SP07 / SP08 remain unopened (documentary/proof honesty) |

```text
Proof status at Grant publication = DEFINED / NOT EXECUTED
Execution requires Director EXECUTE + bounded implementation block
```

**Regression bindings (mandatory at implementation validation):**

- `SP06-P1-T01…T28` via `node src/publication/p1/validatePublicationEligibility.js`
- `P3-G01…P3-G30` via `node src/decision/dossier/validateDecisionDossier.js`
- II.3 16-test via `node src/integration/publicationEligibility/tests/runIi3PublicationEligibilityValidation.js`
- II.4 bounded non-oracle / integrity check per T31 (not full II.4 oracle replay)

No predecessor mutation to satisfy regressions.

---

## 15. CAP / ACC trace (targets — not satisfied)

| ID | P2 target contribution |
|----|------------------------|
| **C-CAP-SP06-01** | **ADVANCE** |
| **C-CAP-SP06-02** | **CONTRIBUTE** |
| **C-CAP-SP06-03** | **PRESERVE** |
| **C-CAP-SP06-04** | **PRIMARY P2 TARGET** |
| **C-CAP-SP06-05** | **PRIMARY P2 TARGET** |
| **C-CAP-SP06-06** | **ADVANCE** |
| **C-ACC-SP06-01…06** | **Bounded P2 contribution targets** |
| **C-ACC-SP06-07** | **Future P2 ITA exit requirement** |
| **C-ACC-SP06-08** | **NOT APPLICABLE TO P2 closure** |

Program-wide completion **NOT CLAIMED**.

---

## 16. Explicit out-of-scope (binding)

**NOT authorized by this Grant:**

```text
SP06-P3 · delivery · public release · Auth/Edge/UI
Product · Marketplace · Premium · Diamond · access_tier
entitlement · monetization · Stripe · payments · strategy
owner disclosure · owner contact · email · phone · outreach · targeting
SP07 · SP08
positive ELIGIBLE / FORMED criterion
BUY · SELL · INVEST · MAKE OFFER · brokerage · representation · intermediation
legal / fiscal / payment implementation
claiming II.4 = SP06 complete
```

---

## 17. Observation discipline (non-remediation)

The following remain **NON-BLOCKING** at Grant publication:

1. P1 `meta.state` absence / unfrozen state observation (OBS-P1-POST-03 carry-forward)
2. Optional future FORMED projection subsections not fully enumerated in Freeze
3. Exact identity / projection field shapes deferred within frozen semantic locks
4. `publicationUnit` vs `projection` naming difference in Freeze mapping vs result sections
5. II.4 non-oracle boundary (T31) used instead of full II.4 harness replay

This Grant **does not** remediate them.

---

## 18. Grant authority limit

```text
GRANT PUBLICATION ≠ SOURCE EXECUTION

After Grant publication:
  IMPLEMENTATION AUTHORITY = NO
  CODE AUTHORITY           = NONE

Until Director proceeds to explicit EXECUTE under established roadmap:
  Aprobado. Ejecuta.
```

---

## 19. Exact next gate

```text
NEXT GATE:
  DIRECTOR EXECUTE — SP06-P2 BOUNDED SOURCE IMPLEMENTATION
  (under DAG-SP06-P2-G1 exact surfaces only)

≠ P3
≠ positive ELIGIBLE / FORMED emission
≠ Grant reinterpretation
≠ DG-01 / DG-04 resolution
```

---

## Binding footer

```text
SP06-P2-GRANT / DAG-SP06-P2-G1
  = FAIL-CLOSED-ONLY P2 bounded implementation Grant
  = P1 root rsn.publication.eligibility.result.v1 REQUIRED consume-only
  = P2 result rsn.publication.unit.result.v1 · PUB-UNIT-RESULT
  = ELIGIBLE / FORMED RESERVED / UNREACHABLE
  = delivery NOT_AUTHORIZED
  = src/publication/p2/ exact 3-file core (+ optional index)
  = SP06-P2-T01…T33 DEFINED / NOT EXECUTED

≠ CODE · ≠ EXECUTE · ≠ P3 · ≠ PRODUCT
≠ POSITIVE ELIGIBLE / FORMED CRITERION
≠ DG RESOLUTION · ≠ OWNER DISCLOSURE

PRE-LAUNCH LEGAL REVIEW REQUIRED (pre-production)
P1 / SP05 / Factory / II.3 / II.4 = READ-ONLY
SP07/SP08 = NOT OPENED
```

**END OF SP06-P2-GRANT / DAG-SP06-P2-G1**

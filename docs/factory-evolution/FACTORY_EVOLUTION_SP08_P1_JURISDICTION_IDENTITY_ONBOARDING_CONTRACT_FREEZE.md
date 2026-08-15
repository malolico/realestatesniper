# STRATEGIC PROGRAM 08 — SCALE OUT
## SP08-P1 — JURISDICTION IDENTITY & ONBOARDING CONTRACT FREEZE
### Jurisdiction Identity + Registration + Binding Handoff (documentary · ≠ Grant · ≠ IMPL)
#### Document ID: SP08-P1-JURISDICTION-ONBOARDING-FREEZE-01

| Campo | Valor |
|-------|--------|
| **Document ID** | **`SP08-P1-JURISDICTION-ONBOARDING-FREEZE-01`** |
| **Document type** | **SP08-P1 Jurisdiction Identity & Onboarding Contract / Semantic Freeze** |
| **File ID** | `FACTORY_EVOLUTION_SP08_P1_JURISDICTION_IDENTITY_ONBOARDING_CONTRACT_FREEZE.md` |
| **Path** | `docs/factory-evolution/FACTORY_EVOLUTION_SP08_P1_JURISDICTION_IDENTITY_ONBOARDING_CONTRACT_FREEZE.md` |
| **Nature** | Continuity **DOCUMENTARY CONTRACT FREEZE** for SP08-P1 · freezes jurisdiction identity · registration semantics · KNOWN≠REGISTERED · jurisdiction≠source · binding metadata · identity validation handoff · P1→P2 / P1→P3 handoffs · property-identity invariants · ONE FACTORY · walls · **≠ Grant** · **≠ EXECUTE** · **≠ source IMPL** · **≠ onboarding execution** · **≠ state selection** · **≠ coverage claim** · **≠ P2/P3/P4** · **≠ Product** · **≠ delivery** · **≠ SP08 COMPLETE** |
| **Program** | **Strategic Program 08 — Scale Out** |
| **Phase** | **SP08-P1 — Jurisdiction Identity & Onboarding Contract** |
| **Freeze class** | **COMBINED** (Identity + Registration + Binding Handoff + Property-Identity Invariants) |
| **Owned deficits** | **DEF-SP08-01** · **DEF-SP08-09** |
| **Parent Mandate** | `SP08-ENG-IMPL` · Continuity Commit **`3b125ae899b4c0d55ee5a83044191609933aad7a`** · **UNCHANGED** |
| **Parent Plan** | `SP08-02` · Continuity Commit tip **`28fd83edc327462401d4d86f35643a3534a29f5d`** · **UNCHANGED** |
| **Parent Discovery** | `SP08-01` · Continuity Commit **`5b34e71291385a0e8409fbb7cd5132eaff2710d0`** · **UNCHANGED** |
| **Parent P1 Pre-IMPL** | Session STRICT READ ONLY · Verdict **PASS WITH OBSERVATIONS** · blockers **NONE** · Director decision **NONE** · Source determination **B — DOCUMENTARY / PROOF-ONLY P1 CORE SUFFICIENT** · Next gate **SP08-P1 CONTRACT / SEMANTIC FREEZE** |
| **Parent SP07 Complete** | `SP07-COMPLETE-STATUS-01` · Continuity Commit **`bba4c851439be14a638ab57fdfb02ec8bf832823`** · **CLOSED / READ-ONLY** |
| **Authorizing Director act** | Director authorization to create and Continuity-publish **only** this documentary Freeze · phrase **`Aprobado. Ejecuta.`** · **NO** Grant · **NO** code · **NO** P2 · **NO** state selection |
| **Entry tip (pre-publication)** | **`3b125ae899b4c0d55ee5a83044191609933aad7a`** |
| **Date** | **2026-08-15** |
| **Branch** | `integration/factory-complete-20260725` |
| **Mode** | **DOCUMENTARY FREEZE ONLY** |

```text
SP08-P1-JURISDICTION-ONBOARDING-FREEZE-01
  = DOCUMENTARY CONTRACT ONLY
  = JURISDICTION IDENTITY + ONBOARDING BOUNDARY FROZEN

P1 GRANT                    = NOT ISSUED
P1 IMPLEMENTATION AUTHORITY = NONE
P1 IMPLEMENTATION           = NOT STARTED
P1 COMPLETE                 = NO
DEF-SP08-01 / 09            = OPEN / P1 TARGET (≠ SATISFIED by Freeze)
SP08-P2                     = NOT OPENED
SP08-P3 / P4 / P5           = NOT OPENED
STATE SELECTION             = NOT PERFORMED
COVERAGE CLAIM              = NOT AUTHORIZED
```

---

## 0. Absolute non-authorization banner

```text
THIS FREEZE DOES NOT AUTHORIZE CODE.

FREEZE PUBLISHED ≠ GRANT
FREEZE PUBLISHED ≠ EXECUTE
FREEZE PUBLISHED ≠ SOURCE MUTATION
FREEZE PUBLISHED ≠ JURISDICTION ONBOARDED
FREEZE PUBLISHED ≠ STATE SELECTED
FREEZE PUBLISHED ≠ COVERAGE CLAIM
FREEZE PUBLISHED ≠ P2 / P3 / P4 OPEN
FREEZE PUBLISHED ≠ DELIVERY AUTHORIZED
FREEZE PUBLISHED ≠ PRODUCT / MARKETPLACE
FREEZE PUBLISHED ≠ DG FINAL DISPOSITION
FREEZE PUBLISHED ≠ SUPABASE AUTHORITY
FREEZE PUBLISHED ≠ DEFICIT SATISFIED

IMPLEMENTATION AUTHORITY = NONE
CODE AUTHORITY           = NONE
ONBOARDING AUTHORITY     = NONE
```

---

## 1. Authority chain (consumed · unchanged)

| Instrument | Posture |
|------------|---------|
| `SP08-ENG-IMPL` | **UNCHANGED** · documentary freeze before any source IMPL |
| `SP08-02` | **UNCHANGED** · DEF-01/09 → P1 CORE |
| `SP08-01` | **UNCHANGED** |
| SP08-P1 Pre-IMPL (session) | **CONSUMED** · PASS WITH OBSERVATIONS · Freeze required · Source **B** |
| `SP07-COMPLETE-STATUS-01` | **CLOSED / READ-ONLY** predecessor |
| `jurisdictionRegistry.js` / identity / connectors | **ANTECEDENT ONLY** · not mutated |

---

## 2. P1 purpose (frozen)

| Campo | Binding |
|-------|---------|
| **Phase ID** | **SP08-P1** |
| **Official name** | **Jurisdiction Identity & Onboarding Contract** |
| **Purpose** | Freeze canonical documentary contract for jurisdiction identity · registration semantics · jurisdiction/source separation · binding requirements · identity validation handoff · P1→P2 / P1→P3 handoffs |
| **Owned deficits** | **DEF-SP08-01** · **DEF-SP08-09** · **OPEN** (not satisfied by this Freeze) |

**P1 DOES NOT OWN:**

```text
coverage completeness · coverage percentages · coverage claims
activation · state readiness · national readiness
connector implementation · adapter implementation · fallback
canonical fact promotion
Product · Marketplace · Delivery
state selection · persistence
```

---

## 3. Jurisdiction identity (frozen)

### 3.1 Onboarding unit

```text
REPOSITORY-SUPPORTED ONBOARDING GRAIN
  = county-level jurisdiction
    under country → state → county hierarchy
```

| Field | Continuity role |
|-------|-----------------|
| **country** | Required identity axis (US in current evidence) |
| **state** | Required identity axis · ≠ county coverage |
| **county / jurisdiction** | Onboarding grain |
| **jurisdictionId** | Canonical machine id |
| **labels / aliases** | Optional lookup aids · ≠ identity substitute |

**Preserve:**

```text
county ≠ state
jurisdiction ≠ source
one county registration ≠ state coverage
```

### 3.2 Jurisdiction identifier form

Canonical Continuity form (evidence-bound):

```text
US-{STATE}-{COUNTY}
```

| Instance | Continuity id | Posture |
|----------|---------------|---------|
| Maricopa | **`US-AZ-MARICOPA`** | Valid predecessor · **NOT discarded** |
| Pima | **`US-AZ-PIMA`** | Non-Maricopa proof instance · **≠ Scale Out** |

Do not generalize identifier form beyond repository evidence unnecessarily.

---

## 4. KNOWN vs REGISTERED (frozen Continuity semantics)

Runtime `JURISDICTION_STATUS.KNOWN` may represent more than one condition in production code. This Freeze defines **documentary Continuity semantics** without claiming runtime tokens already exist and **without mutating** the runtime enum.

| Continuity term | Meaning |
|-----------------|---------|
| **KNOWN** | Identity can be parsed/recognized at documentary/normalization level |
| **REGISTERED** | Jurisdiction is explicitly bound into the canonical registry/onboarding contract |

Preserve existing runtime evidence of **`registryBound`** (including `registryBound: false` for unbound explicit state+county forms).

```text
KNOWN ≠ REGISTERED
Runtime enum mutation = NOT AUTHORIZED by this Freeze
```

---

## 5. Registration locks (frozen)

```text
REGISTERED ≠ VALIDATED
REGISTERED ≠ READY
REGISTERED ≠ COVERAGE_COMPLETE
REGISTERED ≠ ACTIVE
REGISTERED ≠ STATE_COVERED
REGISTERED ≠ NATIONWIDE
```

Registration proves only bounded onboarding registration/binding status. **No coverage authority follows automatically.**

---

## 6. Validation semantics (frozen)

| Class | Owner | Meaning |
|-------|-------|---------|
| **Identity / registration / binding validation** | **P1** | Structural Continuity validation that identity/registration/required binding declarations are coherent and explicit |
| **Coverage / readiness / activation validation** | **P2** | Coverage honesty · readiness · activation semantics |

```text
P1 VALIDATED (identity/binding)
  ≠ coverage completeness
  ≠ readiness
  ≠ activation
```

---

## 7. P1→P2 handoff (frozen)

P1 may hand P2 a bounded jurisdiction onboarding Continuity record containing sufficient evidence that:

- jurisdiction identity is canonical;
- registration status is known (KNOWN vs REGISTERED Continuity disposition);
- `registryBound` status is explicit;
- required binding declarations are present;
- identity/binding validation result is explicit;
- missing/unknown requirements remain explicit.

**P1 handoff MUST NOT contain or imply:**

```text
coverage percentage
state completeness
national completeness
activation
commercial availability
publication readiness
```

**P2 owns** coverage / readiness / activation semantics.

---

## 8. Source identity separation (frozen)

```text
jurisdiction registration
  ≠ source registration
  ≠ connector registration
  ≠ adapter registration
```

| Rule | Binding |
|------|---------|
| Source/organism identity | Distinct from jurisdiction identity |
| A source may serve a jurisdiction | Without becoming the jurisdiction |
| A jurisdiction may have multiple sources | Without identity collapse |

---

## 9. P1→P3 binding metadata (frozen)

Minimum documentary binding metadata P3 may later consume:

| Metadata | Continuity role |
|----------|-----------------|
| **jurisdictionId** | Canonical jurisdiction identity |
| **declared required source-family set** | Jurisdiction-specific · evidence-bound |
| **declared organism/source slots** | Declarations only |
| **connector binding declaration** | Slot / requirement · ≠ IMPL |
| **adapter binding declaration** | Slot / requirement · ≠ IMPL |
| **provenance requirement** | Required provenance fields/posture |
| **pack / jurisdiction association** | Where applicable |
| **binding completeness state** | Explicit complete/incomplete/unknown |

```text
Do NOT implement connectors or adapters.
Do NOT require all possible source families universally.
Bindings remain jurisdiction-specific and evidence-bound.
```

---

## 10. Property identity (frozen)

```text
property identity is jurisdiction-aware
```

| Rule | Binding |
|------|---------|
| Same APN / strong identifier across different jurisdictions | **≠ automatic MATCH** |
| Canonical identity | Must preserve jurisdiction isolation |
| Unknown / unresolved jurisdiction | Must remain capable of unresolved / fail-closed identity posture |

---

## 11. Silent Maricopa invention (frozen)

```text
P1 MUST NOT authorize silent invention/defaulting of Maricopa identity
where jurisdiction/source identity is unstamped or unknown.
```

Observed `propertyIdentityResolver` unstamped organismId Maricopa defaults = **predecessor observation** (**OBS-SP08-P1-PRE-02**).

```text
Runtime remediation, if required,
belongs to later explicitly authorized source work
and/or P3 residual disposition according to evidence.

THIS FREEZE DOES NOT REMEDIATE.
```

---

## 12. Organism catalog label binding (frozen)

Free-text jurisdiction labels in organism/source catalog surfaces must be relatable to canonical **`jurisdictionId`** without conflating:

```text
source = jurisdiction
```

Documentary relationship only. **No runtime catalog mutation** by this Freeze.

---

## 13. Unknown / fail-closed (frozen)

```text
unknown jurisdiction
  ≠ Maricopa
  ≠ registered
  ≠ validated
  ≠ ready
```

Unsupported/incomplete identity must remain explicit. No silent inference. No state default. No source default.

---

## 14. Maricopa / Pima coexistence (frozen)

| Instance | Continuity posture |
|----------|--------------------|
| **Maricopa** | Valid predecessor · **NOT discarded** |
| **Pima** | Non-Maricopa proof instance · **≠ Scale Out** |

**They prove:**

- distinct jurisdiction IDs;
- source-family coexistence;
- cross-jurisdiction identity isolation;
- family-based canonical adapter route viability;
- Pima did not require a parallel Factory.

**They do NOT prove:**

- Arizona-wide coverage;
- national Scale Out;
- future jurisdiction readiness.

---

## 15. ONE FACTORY (frozen)

```text
ONE FACTORY
  + bounded jurisdiction registration
  + source / connector / adapter binding metadata
  + canonical identity contracts
```

**P1 MUST NOT permit:**

- Factory per state
- Factory per county
- duplicated identity engines
- state-specific constitutional forks

---

## 16. Director gates (recorded · not resolved)

| Gate | Posture |
|------|---------|
| **SP08-DG-01** | **UNRESOLVED / PARKED** · not required for P1 core · **no state selection** |
| **SP08-DG-02** | **UNRESOLVED / PARKED** · not required · **no canonical fact promotion** |
| **SP08-DG-03** | **UNRESOLVED / PARKED OUTSIDE CORE** · **no fallback implementation** |
| **SP08-DG-04** | **UNRESOLVED / PARKING / FUTURE** · not required — architecture can express generic identity/onboarding semantics |
| **SP08-DG-05** | **UNRESOLVED / PARKED** · Persistence/Supabase **NONE** |

**Decision required now:** **NONE**

---

## 17. Coverage wall (frozen)

```text
P1 registration / validation ≠ coverage claim
```

**Forbidden under P1:**

- county coverage claim
- state coverage claim
- national coverage claim
- readiness claim
- activation claim

**P2 owns** coverage / readiness / activation semantics.

---

## 18. P3 wall (frozen)

P1 does **NOT** implement: connectors · adapters · fallback · Maricopa residual generalization · source-variable logic.

P1 only freezes required **binding metadata**.

---

## 19. P4 wall (frozen)

P1 does **NOT**: promote canonical facts · expand fact semantics · perform anti-duplication closure · redefine SP05/SP06/SP07 semantics.

---

## 20. State selection wall (frozen)

```text
technical onboarding contract ≠ commercial jurisdiction priority
```

P1 must **not** name or select the next state. **SP08-DG-01** remains parked.

---

## 21. Persistence / Supabase (frozen)

| Surface | Posture |
|---------|---------|
| **Persistence** | **NONE / NOT REQUIRED** |
| **Supabase** | **NONE / NOT REQUIRED** |
| DB / SQL / migration / RLS / Edge / Auth / Storage | **NO AUTHORITY** |

---

## 22. Runtime authority (frozen)

| Surface | Posture |
|---------|---------|
| **Automation** | **NONE** |
| **Side effects** | **NONE** |
| **Delivery** | **NOT_AUTHORIZED** |
| **Product** | **OUTSIDE SP08** |
| **Marketplace** | **OUTSIDE SP08** |
| **Owner/contact** | **NOT_AUTHORIZED** |
| **Transaction/brokerage** | **NOT_AUTHORIZED** |
| **Scheduling** | **NONE** |

---

## 23. SP05 / SP06 / SP07 walls (frozen)

| Wall | Binding |
|------|---------|
| **SP05 Decision** | **READ-ONLY** · registration ≠ Decision authority · no BUY/SELL/INVEST |
| **SP06 Publication** | **READ-ONLY** · registration ≠ ELIGIBLE/FORMED/Publication/Delivery · Delivery **NOT_AUTHORIZED** |
| **SP07 Operation** | **COMPLETE / CLOSED / READ-ONLY** · Continuous Operation ≠ Scale Out · no SP07 mutation |

---

## 24. Proof obligations (frozen · future)

P1 closure must later evidence at minimum:

- jurisdiction ≠ source
- county ≠ state
- KNOWN ≠ REGISTERED
- REGISTERED ≠ VALIDATED
- REGISTERED ≠ READY
- REGISTERED ≠ COVERAGE_COMPLETE
- unknown jurisdiction fails closed
- cross-jurisdiction APN/strong-id isolation holds
- Maricopa/Pima coexist without identity collision
- source/connector/adapter binding metadata remains separate
- P1 cannot claim coverage
- P1 cannot select state
- no silent Maricopa identity invention authorized
- ONE FACTORY preserved
- no predecessor source mutated
- no persistence/Supabase
- SP05 / SP06 / SP07 walls intact

**No artificial test count invented by this Freeze.**

---

## 25. Regression obligations (frozen)

| Suite | Binding |
|-------|---------|
| **PS05-02** | **MANDATORY** |
| **PS05-06** | **MANDATORY** when coexistence/generic identity evidence is bound |
| **PS05-04** | **CONDITIONAL / LIKELY** if Pima coexistence proof requires its specific surface |
| **SP02** | **CONDITIONAL** if Arizona theater source is touched |
| **SP03** | **CONDITIONAL** if CB/Knowledge-facing source is touched |
| **SP05** | **MANDATORY** honesty wall |
| **SP06** | **MANDATORY** Publication/Delivery wall |
| **SP07** | **MANDATORY** Continuous Operation ≠ Scale Out + predecessor immutability |

Because P1 core is documentary/proof-only: do not run unrelated source regressions unless required to validate documentary evidence.

---

## 26. CAP / ACC / DoD contribution (recorded · not satisfied)

| Class | Items |
|-------|-------|
| **PRIMARY P1 TARGETS** | **DoD #1** · **C-CAP-SP08-02** (onboarding entry model) · **C-CAP-SP08-03** (identity/source separation) |
| **P1 CONTRIBUTION** | **C-CAP-SP08-01** (ONE FACTORY) · **C-ACC-SP08-01** (predecessor READ-ONLY) · **C-ACC-SP08-05** (no state selection) |
| **Downstream** | Remain **NOT SATISFIED** |

```text
Freeze publication ≠ CAP/ACC/DoD satisfaction
```

---

## 27. Deficit status (frozen honesty)

| ID | Status |
|----|--------|
| **DEF-SP08-01** | **OPEN / P1 TARGET** |
| **DEF-SP08-09** | **OPEN / P1 TARGET** |

Publishing this Freeze does **NOT** close either deficit.

---

## 28. Pre-IMPL observations (preserved · non-blocking)

| ID | Content | Class |
|----|---------|-------|
| **OBS-SP08-P1-PRE-01** | `JURISDICTION_STATUS.KNOWN` overloads registry-bound and unbound forms | **NON-BLOCKING** |
| **OBS-SP08-P1-PRE-02** | `propertyIdentityResolver` contains unstamped organismId Maricopa defaults | **NON-BLOCKING** |
| **OBS-SP08-P1-PRE-03** | Organism catalog uses free-text jurisdiction labels | **NON-BLOCKING** |
| **OBS-SP08-P1-PRE-04** | Runtime code has no REGISTERED/VALIDATED/READY lifecycle tokens | **NON-BLOCKING** |
| **OBS-SP08-P1-PRE-05** | County-level jurisdiction is the repository-supported onboarding unit under country/state hierarchy | **NON-BLOCKING** |

**No remediation by this Freeze.**

---

## 29. Source determination (frozen)

| Campo | Binding |
|-------|---------|
| **P1 source mutation** | **NOT REQUIRED FOR CORE** |
| **P1 core closure path** | May remain documentary/proof-only if subsequent audit confirms Freeze + evidence are sufficient |
| **If later source encoding necessary** | Separate bounded Grant + Director EXECUTE required |

```text
THIS FREEZE GRANTS: NO SOURCE AUTHORITY
```

---

## 30. Constitutional walls (binding)

```text
Data ≠ Truth
Evidence ≠ Decision
Decision ≠ Publication
Publication ≠ Delivery
Publication ≠ Product
Product ≠ Marketplace
Payment ≠ Truth
Owner data ≠ disclosure authority
Factory ≠ Brokerage
Continuous Operation ≠ Scale Out
```

---

## 31. Freeze determination / next gate

| Campo | Valor |
|-------|--------|
| **Freeze verdict** | **COMPLETE / PASS** (upon Continuity publication + Git sync CLEAN) — documentary Freeze only |
| **Blocking findings** | **NONE** |
| **Grant issued** | **NO** |
| **Source authority** | **NONE** |
| **P1 Complete** | **NO** |

```text
NEXT CANONICAL GATE
  = SP08-P1 POST-FREEZE STRICT READ-ONLY CLOSURE / SOURCE-NECESSITY AUDIT

That audit must determine whether:
  A. P1 can close documentary/proof-only
  OR
  B. source encoding is required before P1 Complete Status

Do NOT create Grant automatically.
```

```text
WHEN Continuity-published (selective commit of this Freeze only)
AND LOCAL HEAD = REMOTE HEAD
AND ahead = 0 AND behind = 0
AND WT CLEAN:

  SP08-P1-JURISDICTION-ONBOARDING-FREEZE-01 = PUBLISHED
  IMPLEMENTATION AUTHORITY = NONE
  DEF-SP08-01 / 09         = OPEN
  CAP/ACC/DoD              = NOT SATISFIED by Freeze
  SP08-DG-01…05            = UNRESOLVED / PARKED
```

---

## Binding footer

```text
SP08-P1-JURISDICTION-ONBOARDING-FREEZE-01
  = DOCUMENTARY CONTRACT FREEZE FOR
    SP08-P1 JURISDICTION IDENTITY & ONBOARDING

= onboarding unit: county-level under country/state
= US-{STATE}-{COUNTY} · US-AZ-MARICOPA · US-AZ-PIMA
= KNOWN ≠ REGISTERED · REGISTERED ≠ VALIDATED/READY/COVERAGE
= jurisdiction ≠ source · county ≠ state
= P1→P2 handoff without coverage/activation claims
= P1→P3 binding metadata without connector IMPL
= property identity jurisdiction-aware · no silent Maricopa invent authorized
= ONE FACTORY preserved
= DEF-01/09 OPEN · CAP/ACC/DoD NOT SATISFIED
= source authority NONE · Grant NOT ISSUED
= OBS-SP08-P1-PRE-01…05 preserved · no remediation

≠ Grant · ≠ EXECUTE · ≠ source IMPL
≠ state selected · ≠ coverage claimed
≠ P2/P3/P4 opened · ≠ SP08 COMPLETE

STOP BEFORE SP08-P1 POST-FREEZE SOURCE-NECESSITY AUDIT
```

**END OF SP08-P1-JURISDICTION-ONBOARDING-FREEZE-01**

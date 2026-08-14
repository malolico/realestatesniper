# STRATEGIC PROGRAM 06 — PUBLICATION
## SP06-P1 — COMBINED HANDOFF + ELIGIBILITY CONTRACT FREEZE
### Upstream Handoff + Eligibility Core (documentary · ≠ Grant · ≠ IMPL)
#### Document ID: SP06-P1-HANDOFF-ELIGIBILITY-FREEZE-01

| Campo | Valor |
|-------|--------|
| **Document ID** | **`SP06-P1-HANDOFF-ELIGIBILITY-FREEZE-01`** |
| **Document type** | **SP06-P1 Combined Handoff + Eligibility Contract Freeze** |
| **File ID** | `FACTORY_EVOLUTION_SP06_P1_HANDOFF_ELIGIBILITY_CONTRACT_FREEZE.md` |
| **Path** | `docs/factory-evolution/FACTORY_EVOLUTION_SP06_P1_HANDOFF_ELIGIBILITY_CONTRACT_FREEZE.md` |
| **Nature** | Continuity **COMBINED DOCUMENTARY CONTRACT FREEZE** for SP06-P1 · freezes bounded upstream handoff + Publication-side eligibility contract · **≠ Grant** · **≠ EXECUTE** · **≠ source IMPL** · **≠ P2** · **≠ Product** · **≠ delivery** · **≠ SP06 COMPLETE** |
| **Program** | **Strategic Program 06 — Publication** |
| **Phase** | **SP06-P1 — Upstream Handoff + Eligibility Core** |
| **Freeze class** | **COMBINED** (Handoff + Eligibility) |
| **Owned deficits** | **DEF-SP06-01** · **DEF-SP06-02** · **DEF-SP06-10** |
| **Parent Mandate** | `SP06-ENG-IMPL` · Continuity Commit **`6935c698ea347751083d468bbf187be49e5c8c19`** |
| **Parent Plan** | `SP06-02` · Continuity Commit **`439609d95e3d377bb6d08620be30d8d849c7e808`** |
| **Parent Discovery** | `SP06-01` · Continuity Commit **`15a76bc28da72d00396d70c39d741ab8b516e3bf`** |
| **Parent P1 Pre-IMPL** | Session STRICT READ ONLY · Verdict **PASS WITH OBSERVATIONS** · Handoff Freeze **YES** · Eligibility Freeze **YES** · Freeze model **COMBINED** · Grant readiness **NOT READY — FREEZE REQUIRED** |
| **Parent SP05 Complete** | `SP05-COMPLETE-STATUS-01` · **CLOSED / READ-ONLY** |
| **Parent P3 Freeze** | `SP05-P3-DOSSIER-FREEZE-01` · Continuity Commit **`02e36312024396bea7cf1d4c2b28cdb3c56360cb`** · **CLOSED** |
| **Parent P3 IMPL / Complete** | IMPL **`fa7fbd8fb01af30246e96e8999dd28319656287e`** · Complete **`9628480e5eea7081019bbe01f1c192b0c9c4237f`** |
| **Authorizing Director act** | Director authorization to create and Continuity-publish **only** this combined Freeze · phrase **`Aprobado. Ejecuta.`** |
| **Entry tip (pre-publication)** | **`6935c698ea347751083d468bbf187be49e5c8c19`** |
| **Date** | **2026-08-14** |
| **Branch** | `integration/factory-complete-20260725` |
| **Mode** | **DOCUMENTARY FREEZE ONLY** |

```text
SP06-P1-HANDOFF-ELIGIBILITY-FREEZE-01
  = PUBLISHED CONTRACT ONLY

P1 GRANT                    = NOT ISSUED
P1 IMPLEMENTATION AUTHORITY = NONE
P1 IMPLEMENTATION           = NOT STARTED
P1 COMPLETE                 = NO
SP06-P2                     = NOT OPENED
SP06-P3                     = NOT OPENED
SP06 COMPLETE               = NO
SP07 / SP08                 = NOT OPENED
```

---

## 0. Absolute non-authorization banner

```text
THIS FREEZE DOES NOT AUTHORIZE CODE.

FREEZE PUBLISHED ≠ GRANT
FREEZE PUBLISHED ≠ EXECUTE
FREEZE PUBLISHED ≠ SOURCE MUTATION
FREEZE PUBLISHED ≠ P2 OPEN
FREEZE PUBLISHED ≠ DELIVERY AUTHORIZED
FREEZE PUBLISHED ≠ PRODUCT / MARKETPLACE
FREEZE PUBLISHED ≠ DG FINAL DISPOSITION

IMPLEMENTATION AUTHORITY = NONE
CODE AUTHORITY           = NONE
```

---

## 1. Authority chain (consumed · unchanged)

| Instrument | Posture |
|------------|---------|
| `SP06-ENG-IMPL` | **UNCHANGED** · requires documentary freeze before source IMPL |
| `SP06-02` / Plan Audit | **UNCHANGED** · DEF-01/02/10 → P1 CORE |
| `SP06-01` / Discovery Audit | **UNCHANGED** |
| SP06-P1 Pre-IMPL (session) | **CONSUMED** · PASS WITH OBSERVATIONS · COMBINED freeze required |
| `SP05-P3-DOSSIER-FREEZE-01` + P3 Complete | **CLOSED / READ-ONLY** |
| II.3 / II.4 | **INTEGRATION ANTECEDENTS** · not mutated |

Where this Freeze restates closed P3 contract facts, P3 Freeze prevails on Decision-side meaning. This Freeze defines **Publication-side P1 consumption and eligibility** only.

---

## 2. P1 handoff contract — DEC-DOSSIER (FROZEN)

### 2.1 Canonical accepted identity

| Campo | Frozen value |
|-------|--------------|
| **schemaId** | **`rsn.decision.dossier.result.v1`** |
| **version** | **`v1`** |
| **meta.state** | **`DEC-DOSSIER`** |
| **Artifact class** | Closed SP05 Decision-side Deal Dossier · consume-only for SP06-P1 |

**No competing Decision schema may be invented by SP06-P1.**

### 2.2 Classification for SP06-P1 bounded core

| Classification | Binding |
|----------------|---------|
| **DEC-DOSSIER for SP06-P1 eligibility evaluation** | **REQUIRED** |

**Honesty of classification:**

```text
REQUIRED = sole Continuity-accepted upstream input class for SP06-P1
           eligibility evaluation under this Freeze.

This does NOT claim:
  · DEC-DOSSIER is required for all future SP06 paths beyond P1
  · Product/Marketplace alternate inputs are authorized
  · raw Factory ELR is an accepted P1 input
  · P2 projection schema is defined
```

**Evidence basis:** Mandate P1 freeze list · Plan DEF-01 ownership · Pre-IMPL (DEC-DOSSIER = strong handoff; no alternate P1 input Continuity-authorized) · P3 Freeze (`dossierIsNotSp06Publication` · consume-by-reference). This Freeze is the Continuity determination deferred by Plan OBS-SP06-PLAN-AUD-04 for **P1 core only**.

### 2.3 Required structural accept gate (from closed P3)

P1 MUST refuse input that fails closed P3 identity/structure for an accepted dossier:

| Requirement | Binding |
|-------------|---------|
| Top-level sections | Exactly the closed minimum class: **`meta` · `input` · `semantics` · `honesty` · `invariants`** present |
| `meta.schemaId` | `rsn.decision.dossier.result.v1` |
| `meta.version` | `v1` |
| `meta.state` | `DEC-DOSSIER` |
| `semantics` | Faithful SEM-01 · SEM-02 · SEM-03 · SEM-06/halt · distress evidence state (no reinterpretation) |
| `honesty` | Preserve UNKNOWN · conflict · freshness · provenance · limitations |
| `invariants` | Preserve closed P3 honesty/legal locks (including no Product/contact · dossier ≠ SP06 publication · review priority ≠ transaction advice) |

### 2.4 Consume-only / no write-back (binding)

SP06-P1 **MUST NOT** mutate, repair, enrich, re-adjudicate, reinterpret, or write back to:

```text
DEC-DOSSIER
DEC-INTAKE
P2 semantics
Factory
CB-16 / ELR
SP05 surfaces (P1/P2/P3/P4)
```

P1 emits a **new derived** Publication-side eligibility result only.

---

## 3. Upstream data classification (FROZEN)

| Artifact / class | P1 classification |
|------------------|-------------------|
| **DEC-DOSSIER** (`rsn.decision.dossier.result.v1`) | **REQUIRED** (sole accepted P1 input class) |
| **DEC-INTAKE** | **CONTEXTUAL / CONSUME_ONLY** — via dossier `input` lineage cites · not accepted as direct P1 root input |
| **P2 semantics** | **CONTEXTUAL / CONSUME_ONLY** — via dossier `semantics` · no rewrite |
| **REVIEW_PRIORITY** | **OPTIONAL_BOUNDED / CONSUME_ONLY** — only if already lawfully nested in dossier semantics · no re-rank |
| **OPPORTUNITY_CANDIDATE** | **CONTEXTUAL / CONSUME_ONLY** — Decision semantics only · ≠ transaction advice |
| **provenance** | **REQUIRED** on accepted dossier · fail-closed if missing/inconsistent |
| **honesty** | **REQUIRED** section · preserve UNKNOWN / conflict / freshness / limitations |
| **freshness** | **CONTEXTUAL / CONSUME_ONLY** — `freshness ≠ truth` · no invented eligibility from freshness alone |
| **conflict state** | **CONTEXTUAL / CONSUME_ONLY** — preserve; drives eligibility semantics §5 |
| **ownerRef** | **OPTIONAL_BOUNDED / CONSUME_ONLY** — predecessor identity/honesty only · ≠ disclosure/contact authority |
| **CB-16 / Factory ELR** | **NOT_ACCEPTED_DIRECTLY** — preserve upstream · **≠** Publication payload · **≠** P1 root input |

```text
Factory ELR ≠ Publication payload
No independent upstream truth invented by P1
```

---

## 4. Lineage / provenance contract (FROZEN)

### 4.1 Fail-closed acceptance

P1 MUST **REFUSE** (no eligibility decision) when any of the following hold:

| Failure | Result |
|---------|--------|
| Not an object / not structured as accepted dossier class | **REFUSED** |
| Wrong/missing `schemaId` / `version` / `state` | **REFUSED** |
| Missing required top-level sections | **REFUSED** |
| Missing/inconsistent required provenance (closed P3 sense) | **REFUSED** |
| Missing/broken predecessor lineage required by closed dossier contract | **REFUSED** |
| Materially incomplete required honesty/invariants for accept class | **REFUSED** |

```text
No synthetic provenance
No lineage repair
No trust upgrade
No repair of malformed / unsupported / untrusted required input
```

### 4.2 Accepted evaluation path

Only a lawfully **accepted** DEC-DOSSIER (structural + lineage + provenance gates pass) may proceed to eligibility evaluation (§5).

---

## 5. SP06-P1 eligibility identity (FROZEN)

### 5.1 Distinct from II.3

| Campo | Frozen |
|-------|--------|
| **Contract class** | Publication-side SP06-P1 eligibility |
| **schemaId** | **`rsn.publication.eligibility.result.v1`** |
| **version** | **`v1`** |
| **≠** | II.3 Read Model eligibility · II.2 oracle · DEC-DOSSIER itself |

### 5.2 Result model (minimum)

Every P1 evaluation emits a **new derived** result with at least:

| Field / lock | Binding |
|--------------|---------|
| `meta.schemaId` | `rsn.publication.eligibility.result.v1` |
| `meta.version` | `v1` |
| `decision` | **`REFUSED`** \| **`ELIGIBLE`** \| **`NOT_ELIGIBLE`** |
| `delivery` | Always **`NOT_AUTHORIZED`** |
| `reasons` | Bounded, sanitized reason codes/messages |
| `inputRef` | Cite accepted dossier identity/lineage (no full ELR) |
| `honesty` | Preserve applicable UNKNOWN / conflict / freshness / limitations cites from dossier where evaluation proceeded |
| `invariants` | Must include locks in §5.3 |

### 5.3 Critical invariants

```text
ELIGIBILITY ≠ DELIVERY
delivery = NOT_AUTHORIZED  (always under this Freeze)
No P1 result authorizes outward publication/delivery
No commercial / Product entitlement eligibility
No invented numeric thresholds
```

---

## 6. Eligibility semantics (FROZEN — no Decision rewrite)

P1 **consumes** closed Decision `semantics.halt` / honesty states and **MUST NOT** redefine their Decision meaning.

### 6.1 REFUSED (no evaluation)

As §4.1 — malformed · unsupported schema/version · missing required lineage/provenance · incomplete required accept class.

### 6.2 Evaluation on accepted DEC-DOSSIER

| Consumed Decision halt / class (from dossier semantics) | P1 `decision` | Rationale (narrowest supported) |
|----------------------------------------------------------|---------------|----------------------------------|
| **`CONFLICT_BLOCKED`** | **`NOT_ELIGIBLE`** | Decision records conflict block — fail-closed; no silent publishable eligibility |
| **`INSUFFICIENT_EVIDENCE`** | **`NOT_ELIGIBLE`** | Decision records insufficient evidence — fail-closed; no silent eligibility upgrade |
| **`EVIDENCED`** | **`ELIGIBLE`** | Lawfully accepted dossier with evidenced Decision halt — technical eligibility for later P2 consideration only · ≠ delivery · ≠ investment advice |
| **`NONE`** | **`ELIGIBLE`** | Lawfully accepted dossier preserving distress NONE honesty — technical eligibility of Decision disclosure candidacy · NONE ≠ bad property · ≠ delivery · ≠ investment advice |
| Unknown/unsupported halt value not in closed P2/P3 catalog | **`REFUSED`** or **`NOT_ELIGIBLE`** | Fail-closed — Prefer **`REFUSED`** if halt absent/unreadable; **`NOT_ELIGIBLE`** only if halt present but unsupported |

### 6.3 Freshness / UNKNOWN / honesty

| Class | Treatment |
|-------|-----------|
| Freshness limitations | **PRESERVE** in result honesty · **MUST NOT** alone invent `NOT_ELIGIBLE` (`freshness ≠ truth`) |
| UNKNOWN honesty | **PRESERVE** · MUST NOT become NONE / rejection / fabricated eligibility |
| Optional absences (ranking / ownerRef / economic context) | **PRESERVE** ABSENT/NOT INCLUDED · MUST NOT invent negative eligibility criteria from absence alone |

### 6.4 What eligibility is not

```text
ELIGIBLE ≠ delivery authorization
ELIGIBLE ≠ Product entitlement
ELIGIBLE ≠ BUY/SELL/INVEST advice
ELIGIBLE ≠ Publication Unit formed (P2)
ELIGIBLE ≠ owner disclosure authorized
ELIGIBLE ≠ raw ELR exposure
```

---

## 7. Determinism / immutability (FROZEN)

```text
Same accepted semantic DEC-DOSSIER input → same semantic P1 eligibility decision
No random eligibility
No wall-clock-derived eligibility truth
New derived result object only
No predecessor mutation
No Factory / SP05 write-back
```

Any future metadata timestamps (if Mandated later) **MUST NOT** alter semantic eligibility.

---

## 8. II.3 relationship (FROZEN)

| Posture | Binding |
|---------|---------|
| **II.3** | **INTEGRATION ANTECEDENT** |
| **≠** | SP06-P1 implementation |
| **≠** | Drop-in DEC-DOSSIER consumer |

**Reusable constitutional principles (cite-only):**

- fail-closed
- deterministic eligibility
- `ELIGIBLE` / `NOT_ELIGIBLE` precedent vocabulary
- eligibility ≠ delivery
- `delivery = NOT_AUTHORIZED` precedent
- no Factory mutation

**Incompatible assumptions (must not be imported as P1 oracle):**

- Read Model Contract v2 input
- II.2 sole validation oracle
- snapshotId / read-model integrity lineage
- schema/integrity assumptions distinct from DEC-DOSSIER

**No modification of II.3 / II.4 / II.2 source or contracts by this Freeze.**

---

## 9. Product / entitlement park (P1 core)

**Explicitly OUTSIDE bounded SP06-P1 core:**

```text
Product · Marketplace · Premium · Diamond · access_tier
subscription entitlement · monetization
Product strategy · Product card behavior
```

| Gate | Status under this Freeze |
|------|--------------------------|
| **SP06-DG-01** | Remains **UNDECIDED** at program frontier · Product/entitlement dependencies **PARKED OUTSIDE P1 CORE** by this Freeze · **≠** final Director disposition |
| **SP06-DG-02** | Remains **PARKING / FUTURE** · **PARKED OUTSIDE P1 CORE** |
| **SP06-DG-03** | Remains **PARKING / FUTURE** · **OUTSIDE P1 CORE** · **NOT FORCED** |

```text
P1 eligibility truth MUST NOT depend on commercial tier / payment / entitlement.
This Freeze ≠ final disposition of SP06-DG-01/02/03.
```

---

## 10. Owner / contact park (P1 core)

**Explicitly OUTSIDE P1:**

```text
outward owner identity disclosure
contact data · contact unlock · outreach · targeting
```

| Item | Binding |
|------|---------|
| **ownerRef** (if lawfully present) | **OPTIONAL_BOUNDED / CONSUME_ONLY** predecessor context · identity/honesty only |
| **ownerRef ≠** | publication authority · contact authority · disclosure authority |
| **SP06-DG-04** | Remains **UNRESOLVED** · **OUTSIDE P1 CORE** |

---

## 11. Legal / real-estate wall

```text
PRE-LAUNCH LEGAL REVIEW REQUIRED
  = production / user-facing gate (unchanged)
  ≠ required to freeze P1 technical eligibility contract
```

**Forbidden in P1 semantics / proofs / future P1 IMPL:**

BUY · SELL · INVEST · MAKE OFFER · transaction recommendation · brokerage · representation · intermediation

P1 = technical Publication eligibility · **≠** real-estate advice · **≠** transaction authority.

---

## 12. P2 / delivery wall

**P1 DOES NOT:**

- form the final Publication Unit
- define outward projection / redaction catalog
- disclose data publicly
- authorize delivery / Auth / Edge / UI / storage
- authorize owner identity disclosure
- implement or open P2

| Item | Status |
|------|--------|
| **Publication Unit / projection** | **SP06-P2** · **NOT OPENED** |
| **delivery** | Always **`NOT_AUTHORIZED`** under P1 results |

---

## 13. Source implementation boundary (candidates · NOT CREATED)

### 13.1 Namespace principle

Minimum dedicated **Publication-side** namespace under `src/publication/**` (new tree; does not exist at Freeze tip).

Exact filenames authorized only by later **bounded Grant**.

### 13.2 Candidate implementation classes (CREATE later · Grant-enumerated)

| Class | Purpose |
|-------|---------|
| P1 handoff/input contract module | Accept/refuse DEC-DOSSIER per this Freeze |
| P1 eligibility evaluator | Emit `rsn.publication.eligibility.result.v1` |
| P1 validator / proof harness | SP06-P1-T01… proofs |
| Optional index | Only if repository convention requires · Grant-optional |

### 13.3 Forbidden mutation surfaces

```text
src/factory/**
src/decision/**
src/integration/publicationEligibility/**
src/integration/publicationUnit/**
src/integration/readModel/**
Product / Marketplace source surfaces
```

**No source files are created by this Freeze.**

---

## 14. Proof contract (IDs frozen · not executed)

Stable series: **`SP06-P1-T01`…`SP06-P1-T28`**

| ID | Obligation |
|----|------------|
| **SP06-P1-T01** | Accepted canonical DEC-DOSSIER input |
| **SP06-P1-T02** | schemaId / version / state accept |
| **SP06-P1-T03** | Malformed rejection → REFUSED |
| **SP06-P1-T04** | Unsupported schema/version → REFUSED |
| **SP06-P1-T05** | Lineage failure → REFUSED |
| **SP06-P1-T06** | Provenance failure → REFUSED |
| **SP06-P1-T07** | EVIDENCED → ELIGIBLE (delivery NOT_AUTHORIZED) |
| **SP06-P1-T08** | NONE → ELIGIBLE (honesty preserved; delivery NOT_AUTHORIZED) |
| **SP06-P1-T09** | INSUFFICIENT_EVIDENCE → NOT_ELIGIBLE |
| **SP06-P1-T10** | CONFLICT_BLOCKED → NOT_ELIGIBLE |
| **SP06-P1-T11** | Freshness limitation preserved; not sole invent of NOT_ELIGIBLE |
| **SP06-P1-T12** | UNKNOWN/honesty preservation |
| **SP06-P1-T13** | Deterministic repeat |
| **SP06-P1-T14** | No predecessor (dossier) mutation |
| **SP06-P1-T15** | No Factory mutation |
| **SP06-P1-T16** | No SP05 Decision surface mutation |
| **SP06-P1-T17** | eligibility ≠ delivery · delivery always NOT_AUTHORIZED |
| **SP06-P1-T18** | No raw ELR as P1 input/payload |
| **SP06-P1-T19** | No Product/tier coupling |
| **SP06-P1-T20** | No Premium/Diamond/`access_tier` coupling |
| **SP06-P1-T21** | No owner/contact dependency for eligibility |
| **SP06-P1-T22** | No transaction-language semantics |
| **SP06-P1-T23** | II.3 remains antecedent / not mutated |
| **SP06-P1-T24** | P3 dossier regression / non-regression (consume-only) |
| **SP06-P1-T25** | P2 remains unopened (documentary/proof honesty) |
| **SP06-P1-T26** | SP07/SP08 remain unopened (documentary/proof honesty) |
| **SP06-P1-T27** | Optional ownerRef absence does not invent rejection criteria |
| **SP06-P1-T28** | Result schemaId `rsn.publication.eligibility.result.v1` on evaluated outcomes |

**Proofs are NOT executed by this Freeze.**

---

## 15. CAP / ACC trace

| ID | Status under this Freeze |
|----|--------------------------|
| **C-CAP-SP06-01** | **SUPPORTED / NOT YET SATISFIED** |
| **C-CAP-SP06-02** | **SUPPORTED / NOT YET SATISFIED** |
| **C-CAP-SP06-03** | **SUPPORTED / NOT YET SATISFIED** |
| **C-ACC-SP06-01** | **SUPPORTED / NOT YET SATISFIED** |
| **C-ACC-SP06-02** | **SUPPORTED / NOT YET SATISFIED** |
| **C-ACC-SP06-03** | **SUPPORTED / NOT YET SATISFIED** |
| **C-ACC-SP06-04** | **SUPPORTED / NOT YET SATISFIED** |
| **C-ACC-SP06-05** | **SUPPORTED / NOT YET SATISFIED** |

```text
Freeze SUPPORTS future proof · does NOT satisfy CAP/ACC.
```

---

## 16. Observation honesty (no remediation)

| ID | Treatment |
|----|-----------|
| **OBS-SP06-DISC-AUD-01** | Clarification · DG §21 mapping preserved |
| **OBS-SP06-DISC-AUD-02** | Parking · DG-03 not forced |
| **OBS-SP06-DISC-AUD-03** | Proof obligation · Integration≠SP06 honesty |
| **OBS-SP06-DISC-AUD-04** | Design constraint · Product frontier open at program level · parked out of P1 |
| **OBS-SP06-PLAN-AUD-01** | Proof · ELR CAP complementarity |
| **OBS-SP06-PLAN-AUD-02** | Satisfied for P1 by explicit park-out-of-core |
| **OBS-SP06-PLAN-AUD-03** | Record only · session audits |
| **OBS-SP06-PLAN-AUD-04** | Closed for P1 by this Freeze determination · remains honesty that broader SP06 paths not claimed |
| **OBS-P3-POST-01…03** | RECORD ONLY · consume-only · no SP05 reopen |

---

## 17. Exact next gate

```text
NEXT GATE:
  INDEPENDENT DOCUMENTARY AUDIT OF
  SP06-P1 COMBINED HANDOFF + ELIGIBILITY CONTRACT FREEZE

≠ Grant
≠ EXECUTE
≠ source mutation
≠ P2
```

---

## Binding footer

```text
SP06-P1-HANDOFF-ELIGIBILITY-FREEZE-01
  = Combined P1 contract freeze
  = DEC-DOSSIER REQUIRED for P1 eligibility evaluation
  = rsn.publication.eligibility.result.v1
  = ELIGIBILITY ≠ DELIVERY
  = II.3 antecedent only
  = Product / DG-01..04 parked outside P1 core (≠ final disposition)

≠ GRANT · ≠ CODE · ≠ P2 · ≠ DELIVERY
≠ PRODUCT · ≠ MARKETPLACE · ≠ SP06 COMPLETE

PRE-LAUNCH LEGAL REVIEW REQUIRED (future)
SP05 = COMPLETE · CLOSED
SP07/SP08 = NOT OPENED
```

**END OF SP06-P1-HANDOFF-ELIGIBILITY-FREEZE-01**

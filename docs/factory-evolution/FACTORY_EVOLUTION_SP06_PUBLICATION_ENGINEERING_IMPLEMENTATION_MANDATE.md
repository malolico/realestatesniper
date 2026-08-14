# STRATEGIC PROGRAM 06 — PUBLICATION
## SP06-ENG-IMPL — ENGINEERING IMPLEMENTATION MANDATE
### Official Engineering Implementation Mandate (Director-issued · PLANNING AUTHORITY ONLY)

| Campo | Valor |
|-------|--------|
| **Document ID** | `FACTORY_EVOLUTION_SP06_PUBLICATION_ENGINEERING_IMPLEMENTATION_MANDATE.md` |
| **Path** | `docs/factory-evolution/FACTORY_EVOLUTION_SP06_PUBLICATION_ENGINEERING_IMPLEMENTATION_MANDATE.md` |
| **Nature** | Director **Engineering Implementation Mandate** — **engineering class authorization only** · **no code in this file** · **does not implement by its existence** · **≠ Pre-IMPL** · **≠ Grant** · **≠ P1 opened** · **≠ Director-gate disposition** · **≠ Publication delivery authorized** · **≠ SP06 COMPLETE** |
| **Mandate ID** | **`SP06-ENG-IMPL`** |
| **Mandate class** | **ENGINEERING IMPLEMENTATION MANDATE** |
| **Program** | **Strategic Program 06 — Publication** |
| **Parent Discovery** | `FACTORY_EVOLUTION_SP06_PUBLICATION_OFFICIAL_DISCOVERY_SPECIFICATION.md` (**SP06-01**) · Continuity Commit **`15a76bc28da72d00396d70c39d741ab8b516e3bf`** |
| **Parent Discovery Audit** | Session STRICT READ ONLY · Verdict **PASS WITH OBSERVATIONS** · blockers **NONE** · Plan readiness **YES** · **UNCHANGED** |
| **Parent Plan** | `FACTORY_EVOLUTION_SP06_PUBLICATION_OFFICIAL_IMPLEMENTATION_PLAN.md` (**SP06-02**) · Continuity Commit **`439609d95e3d377bb6d08620be30d8d849c7e808`** |
| **Parent Plan Audit** | Session STRICT READ ONLY · Verdict **PASS WITH OBSERVATIONS** · blockers **NONE** · Engineering Mandate readiness **YES** · Director decisions required before Mandate **NONE** · **UNCHANGED** |
| **Parent strategic authority** | `docs/factory-construction/FACTORY_EVOLUTION_PROGRAMS_DIRECTOR_STRATEGIC_MANDATE.md` — Strategic Program 06 |
| **Prerequisite closures** | **SP01–SP05 COMPLETE** · **PRE-SP05 COMPLETE** · Engineering COMPLETE IMMUTABLE |
| **Authorizing Director act** | Director authorization to create and Continuity-publish **only** this controlling Engineering Mandate · phrase **`Aprobado. Ejecuta.`** · **NO** Director-gate disposition · **NO** Pre-IMPL · **NO** code · **NO** Grants · **NO** P1 IMPL |
| **Authorized technical class** | Publication-side engineering **outside Factory internals** and **without rewriting closed SP05 Decision surfaces**, implementing audited SP06 Plan phases **SP06-P1…P3** under per-phase Pre-IMPL + Grant (when source mutation required) · eligibility / unit-projection / proof harnesses only |
| **Date** | **2026-08-14** |
| **Branch** | `integration/factory-complete-20260725` |
| **Entry tip (pre-publication)** | **`439609d95e3d377bb6d08620be30d8d849c7e808`** |
| **Mode** | **DOCUMENTARY AUTHORITY ONLY** |

```text
SP06-ENG-IMPL = ENGINEERING CLASS MANDATE ONLY

MANDATE PUBLISHED ≠ CODE AUTHORIZED
MANDATE PUBLISHED ≠ P1 OPENED
MANDATE PUBLISHED ≠ GRANT ISSUED
MANDATE PUBLISHED ≠ DIRECTOR GATES RESOLVED
MANDATE PUBLISHED ≠ DELIVERY / AUTH / EDGE / UI AUTHORIZED

IMPLEMENTATION AUTHORITY = NONE (until phase Pre-IMPL + Grant + EXECUTE as required)
CODE AUTHORITY           = NONE
```

---

## 0. Absolute Non-Authorization Banner

| Surface | Under this Mandate |
|---------|-------------------|
| Code / tests / fixtures | **NOT AUTHORIZED** by this file |
| Pre-IMPL / Grants | **NOT CREATED** by this file |
| SP06-P1…P3 IMPL | **NOT OPENED** by this file |
| SP06-DG-01…04 disposition | **NOT PERFORMED** by this file |
| Factory CB / ELR truth mutation | **PROHIBITED** |
| SP05 Decision surface mutation | **PROHIBITED** |
| Product / Marketplace / `access_tier` IMPL | **PROHIBITED** |
| Premium / Diamond / strategy IMPL | **PROHIBITED** |
| Owner contact / outreach / targeting | **PROHIBITED** |
| SP07 / SP08 / Live / LLM / nationwide | **PROHIBITED** |
| Claiming II.3 / II.4 = SP06 IMPL complete | **PROHIBITED** |

```text
THIS MANDATE IMPLEMENTS THE AUDITED SP06-02 PLAN.
IT MUST NOT BROADEN THE PLAN.
Mandate ≠ Grant ≠ EXECUTE ≠ source mutation authority.
```

---

## 1. Document identity and issuance

| Campo | Valor |
|-------|--------|
| **Official name** | SP06-ENG-IMPL — Engineering Implementation Mandate — Publication |
| **Issuance authority** | Director |
| **Instrument class** | Continuity §27 **Engineering Mandate** · **≠ Plan rewrite · ≠ Pre-IMPL · ≠ IMPL** |
| **Primary capability** | Governed downstream Publication |
| **Prevalence** | SP06-01 / SP06-02 / Plan Audit prevail on conflict of problem-space and audit conditions; this Mandate organizes engineering class gates only |

**Identity locks:**

```text
Publication ≠ Factory
Publication ≠ Decision
Publication ≠ Product
Publication ≠ Marketplace
Publication ≠ Continuous Operation
Publication ≠ Scale Out
```

**Issuance prerequisites (record):**

| # | Criterion | State |
|---|-----------|-------|
| 1 | SP06-01 Discovery Continuity-published | **YES** @ `15a76bc…` |
| 2 | Discovery Audit PASS/PWO · blockers NONE | **YES** (session) |
| 3 | SP06-02 Plan Continuity-published | **YES** @ `439609d…` |
| 4 | Plan Audit PASS/PWO · blockers NONE · Mandate readiness YES | **YES** (session) |
| 5 | Director decisions required before Mandate = NONE | **YES** — gates parkable |
| 6 | SP01–SP05 COMPLETE preserved | **YES** |
| 7 | Mandate does not broaden audited Plan DoD / CAP / ACC | **YES** — §3–§24 |

---

## 2. Binding Plan-Audit observations

| ID | Content | Mandate treatment |
|----|---------|-------------------|
| **OBS-SP06-PLAN-AUD-01** | CAP-04 and DoD/CAP-05 ELR-wall overlap complementary | **Clarification / proof obligation** · not duplicate engineering |
| **OBS-SP06-PLAN-AUD-02** | P1/P2 must dispose frontier **or** park outside phase core | **Design constraint** · binding below |
| **OBS-SP06-PLAN-AUD-03** | Discovery/Plan audits are session Continuity authority | **Record only** · no rewrite of SP06-01/SP06-02 |
| **OBS-SP06-PLAN-AUD-04** | Exact handoff REQUIRED/OPTIONAL not decided by Plan | **Design constraint** · future freeze/Pre-IMPL · **not** frozen here |

Also preserve Discovery Audit observations **OBS-SP06-DISC-AUD-01…04** (authoritative §21 DG mapping · DG-03 not forced · DEF-13 no duplicate eng. · Product↔Publication frontier open).

---

## 3. Binding engineering principles

| # | Principle | Binding |
|---|-----------|---------|
| **A** | **Upstream immutability** | Factory + SP05 Decision surfaces = **consume-only** predecessors |
| **B** | **Derivation** | Publication outputs = **bounded derived** artifacts |
| **C** | **Fail-closed** | Malformed / untrusted / unsupported mandatory inputs **cannot** produce a valid publication result |
| **D** | **Eligibility ≠ delivery** | Eligibility **never** automatically means outward delivery / public release |
| **E** | **Honesty preservation** | Provenance · freshness · conflicts · insufficient evidence · limitations **survive** downstream transformation |
| **F** | **No raw ELR publication** | Factory ELR **≠** public Publication payload |
| **G** | **Product sovereignty** | Publication does **not** silently implement Product / Marketplace / monetization / entitlement |
| **H** | **Legal wall** | No transaction recommendation / brokerage / representation / intermediation |

---

## 4. Bounded Definition of Done (frozen from audited Plan)

SP06 may be declared **COMPLETE** only when Continuity-published evidence shows:

1. Canonically defined **bounded upstream consumption**
2. **Fail-closed** deterministic Publication eligibility
3. Eligibility **≠** delivery / public release
4. Bounded **derived** Publication representation / unit
5. Factory + SP05 Decision truth **immutable** upstream
6. **No** raw Factory ELR as public payload
7. Provenance / honesty / freshness / conflict limitations **survive** Publication
8. Product / Marketplace sovereignty **preserved**
9. Commercial entitlement **cannot** silently redefine truth / eligibility
10. Owner identity / contact / outreach boundaries **preserved**
11. Legal / real-estate language boundaries **preserved**
12. Director gates **disposed** or **formally parked outside SP06 DoD**
13. CAP / ACC Continuity-ready
14. Dedicated Continuity Status **SP06 COMPLETE** published **before SP07 may open**

**SP06 COMPLETE does NOT mean:** Product/Marketplace completion · Auth/Edge/UI delivery automatic · SP07/SP08 · Premium/Diamond/`access_tier` disposed if parked · brokerage/transaction recommendation.

---

## 5. CAP / ACC (carried forward exactly from SP06-02)

### C-CAP-SP06

| ID | Requirement | Mandate posture |
|----|-------------|-----------------|
| **C-CAP-SP06-01** | Publication consumes a Continuity-defined bounded upstream contract without modifying Factory or SP05 Decision truth | **SUPPORTED** |
| **C-CAP-SP06-02** | Publication eligibility refuse-closed on insufficient / untrusted / malformed / ineligible input | **SUPPORTED** |
| **C-CAP-SP06-03** | Eligibility ≠ delivery / Auth / Edge / UI / storage / public release | **SUPPORTED** |
| **C-CAP-SP06-04** | Bounded Publication Unit / projection exists as derived representation — ≠ raw ELR · ≠ CB-16 synonym · ≠ Marketplace card by synonym | **SUPPORTED** |
| **C-CAP-SP06-05** | Provenance / honesty / freshness / conflict limitations survive Publication projection under Mandated proofs | **SUPPORTED** (ELR wall complementary with CAP-04 / DoD — OBS-SP06-PLAN-AUD-01) |
| **C-CAP-SP06-06** | Product / Marketplace / commercial entitlement / owner-contact / BUY-SELL-INVEST / brokerage walls preserved; SP07/SP08 not claimed as SP06 facts | **SUPPORTED** |

### C-ACC-SP06

| ID | Requirement | Mandate posture |
|----|-------------|-----------------|
| **C-ACC-SP06-01** | Upstream producer / Publication consumer boundary explicit and testable | **SUPPORTED** |
| **C-ACC-SP06-02** | Malformed / untrusted / ineligible inputs refuse-closed | **SUPPORTED** |
| **C-ACC-SP06-03** | Deterministic / repeatable eligibility and unit construction where Mandated | **SUPPORTED** |
| **C-ACC-SP06-04** | Factory + SP05 predecessor immutability preserved under consumption | **SUPPORTED** |
| **C-ACC-SP06-05** | Product / Marketplace / SP07 / SP08 exclusions intact | **SUPPORTED** |
| **C-ACC-SP06-06** | Director gates disposed or formally parked outside SP06 DoD with Continuity honesty | **SUPPORTED** |
| **C-ACC-SP06-07** | Independent Plan Audit PASS/PWO before Mandate; Pre-IMPL / phase ITAs as Mandated | **SUPPORTED** (Plan Audit session consumed) |
| **C-ACC-SP06-08** | Dedicated Continuity Status SP06 COMPLETE exists (future) | **SUPPORTED** (future act) |

```text
CAP/ACC SUPPORTED ≠ CAP/ACC SATISFIED.
Satisfaction requires later Continuity evidence.
```

---

## 6. Director Decision Gates (PARTIAL / parkable — NOT RESOLVED)

Authoritative mapping (Discovery §21 / Plan):

| Gate ID | Question | Default posture under this Mandate |
|---------|----------|--------------------------------------|
| **SP06-DG-01** | Product ↔ Publication ordering / entitlement frontier | **UNRESOLVED** · dispose **or** park out of affected phase core |
| **SP06-DG-02** | DG-01 A — Premium / Diamond / `access_tier` | **PARKING / FUTURE** · dispose **or** park |
| **SP06-DG-03** | DG-01 B — strategy selection | **PARKING / FUTURE** · **OUTSIDE SP06 CORE** · **NOT FORCED** |
| **SP06-DG-04** | Owner identity outward-disclosure boundary | **UNRESOLVED** · dispose/Legal **or** omit/park from P2 core |

**MANDATE RULE (OBS-SP06-PLAN-AUD-02):**

```text
An unresolved gate does NOT automatically block bounded SP06 core.

For each affected phase:
  DISPOSE
  OR
  FORMALLY PARK OUTSIDE THAT PHASE CORE
before authority is granted to code any dependency on that frontier.

Mandate MUST NOT create a global wait on all gates before P1.
SP06-DG-03 MUST NOT be forced into SP06 core absent Continuity evidence.
```

This Mandate does **NOT** resolve SP06-DG-01…04.

---

## 7. Internal execution phases

```text
SP06-DG-01…04   (documentary · conditional / parking)
SP06-P1         Upstream Handoff + Eligibility Core
SP06-P2         Bounded Publication Unit / Projection
SP06-P3         Acceptance Proof / Closure Preparation
PRE-LAUNCH LEGAL REVIEW  (production / user-facing)
```

Exact writable source files are **NOT** frozen here — they belong to phase Pre-IMPL / Grant. Likely future Publication namespace must be identified then — **not invented or created by this Mandate**.

### 7.1 SP06-P1 — Upstream Handoff + Eligibility Core

| Campo | Valor |
|-------|--------|
| **Purpose** | Establish bounded upstream handoff contract + fail-closed Publication eligibility · preserve eligibility ≠ delivery |
| **Owned deficits** | **DEF-SP06-01** · **DEF-SP06-02** · **DEF-SP06-10** |
| **Predecessor** | This Mandate Continuity-published |
| **Authorized capability class** | Publication-side handoff consume + eligibility enforcement outside Factory internals · without rewriting `src/decision/**` |
| **Required documentary freeze before source IMPL** | Accepted upstream input contract · DEC-DOSSIER relationship · REQUIRED vs OPTIONAL_BOUNDED vs other justified classification · lineage · provenance · malformed/untrusted refusal · insufficient evidence · conflict · freshness · deterministic eligibility · eligibility result contract · eligibility ≠ delivery · relationship to II.3 |
| **Handoff classification** | **NOT predetermined** by this Mandate (OBS-SP06-PLAN-AUD-04) |
| **II.3** | **ANTECEDENT ONLY** · ≠ SP06 IMPL |
| **Entry gate** | Independent Pre-IMPL PASS/PWO · surfaces/proof contract frozen · Grant · Director EXECUTE · **SP06-DG-01 disposed or Product-entitlement dependencies parked out of P1 core** · SP06-DG-02/03 parked out of P1 unless Continuity assigns |
| **Exit gate** | Phase ITA PASS/PWO · blockers NONE · C-CAP-01…03 subset · C-ACC-01…04 subset |
| **Mutation class** | Publication-side only · exact files at Pre-IMPL/Grant |
| **Complete Status** | Required after ITA readiness |
| **Exclusions** | Final delivery · Product/`access_tier` · Marketplace card · strategy · owner contact · P2 unit schema · Factory CB edits · claiming II.3 = SP06 complete |

**P1 frontier condition:** P1 may proceed without resolving Product/commercial frontiers **only if** those dependencies are explicitly excluded/parked outside P1 bounded core. Silent dependency = **FORBIDDEN**.

### 7.2 SP06-P2 — Bounded Publication Unit / Projection

| Campo | Valor |
|-------|--------|
| **Purpose** | Establish bounded Publication Unit / projection downstream of accepted P1 output |
| **Owned deficits** | **DEF-SP06-03** · **DEF-SP06-04** · **DEF-SP06-05** |
| **Predecessor** | SP06-P1 COMPLETE |
| **Authorized capability class** | Publication-side unit/projection construction |
| **Required documentary freeze before source IMPL** | P1 output input contract · publication-unit/projection contract · derived-object requirement · inclusion/exclusion/omission/redaction · provenance/honesty/freshness/conflict representation · stable identity · schema/version · determinism · immutability · malformed-input behavior · relationship to II.4 |
| **Final schema** | **NOT frozen** by this Mandate unless already canonical |
| **II.4** | **ANTECEDENT ONLY** · ≠ SP06 IMPL |
| **Entry gate** | P1 COMPLETE · Pre-IMPL/Grant for P2 · Director EXECUTE · **SP06-DG-04 disposed/Legal-cleared or owner-identity projection omitted/parked out of P2 core** |
| **Exit gate** | Phase ITA PASS/PWO · C-CAP-04/05 · unit ≠ raw ELR |
| **Mutation class** | Publication-side only |
| **Complete Status** | Required after ITA readiness |
| **Exclusions** | Product Marketplace card · Auth/Edge/UI delivery complete by synonym · Premium/Diamond/`access_tier` · strategy · contact unlock · claiming II.4 = SP06 complete |

**P2 owner-identity condition:**

```text
owner identity ≠ contact ≠ outreach ≠ targeting ≠ contact unlock
If P2 includes owner identity in outward projection:
  Director/Legal disposition required before affected IMPL authority.
Else:
  owner identity explicitly omitted/parked outside bounded P2 core.
Contact/outreach/targeting remain UNAUTHORIZED.
```

### 7.3 SP06-P3 — Acceptance Proof / Closure Preparation

| Campo | Valor |
|-------|--------|
| **Purpose** | Acceptance Proof / Closure Preparation — CAP/ACC assembly · parking honesty · Final ITA path · prepare SP06 COMPLETE Status path |
| **Owned deficits** | **DEF-SP06-11** · **DEF-SP06-13** (proof-only) · DoD wall verification |
| **Predecessor** | SP06-P1…P2 COMPLETE · relevant DG gates disposed or parked outside SP06 DoD |
| **Authorized capability class** | Documentary + proof harnesses as Pre-IMPL/Grant allow |
| **Entry gate** | P1…P2 COMPLETE · Pre-IMPL/Grant for P3 **only if** source mutation required |
| **Exit gate** | Final Independent ITA PASS/PWO · CAP/ACC Continuity-ready · Status instrument prepared (**≠** auto-COMPLETE) |
| **Mutation class** | **DOCUMENTARY / PROOF** preferred · **no** Factory remediation · **no** Product IMPL · **no** hidden feature IMPL |
| **Grant** | **NOT manufactured** if no source mutation required |
| **Exclusions** | Claiming SP06 COMPLETE · opening SP07/SP08 · delivery productization without separate Mandate · remediating parked OBS as SP06 DoD |

P3 **MUST NOT** itself claim SP06 COMPLETE. Dedicated Continuity Status SP06 COMPLETE remains a **later separate Continuity act**.

---

## 8. DEF-SP06-01…13 authority map

| Gap ID | Authority owner | Closure evidence | IMPL relevance | Director relevance | Phase closure effect | SP06 DoD effect |
|--------|-----------------|------------------|----------------|--------------------|----------------------|-----------------|
| **01** | **SP06-P1** | Handoff freeze + proofs | **CORE** | NO unless Product input invented | Required for P1 Complete | DoD #1 |
| **02** | **SP06-P1** | Eligibility proofs | **CORE** | NO | Required for P1 Complete | DoD #2–3 |
| **03** | **SP06-P2** | Unit/projection proofs | **CORE** | NO | Required for P2 Complete | DoD #4 |
| **04** | **SP06-P2** | Honesty/projection proofs | **CORE** | NO | Required for P2 Complete | DoD #7 |
| **05** | **SP06-P2** (+ P3 verify) | ELR-wall proofs | **CORE** | NO | Required for P2; verified P3 | DoD #6 |
| **06** | **SP06-DG-01** | Continuity disposition/park | **FRONTIER** | **YES** (or park) | Affects phase core scope | DoD #8–9/#12 |
| **07** | **SP06-DG-02** | Continuity disposition/park | **FRONTIER/PARKING** | YES if in-scope else park | Scope honesty | DoD #9/#12 |
| **08** | **SP06-DG-04** + Legal | Disposition + legal gate | **FRONTIER/LEGAL** | YES / Legal | P2 identity projection scope | DoD #10/#12 |
| **09** | **Legal / PRE-LAUNCH** | Legal Continuity record | **LEGAL** | Legal authority | Production gate | DoD #11 |
| **10** | **SP06-P1** | Eligibility≠delivery proofs | **CORE** | NO | Required for P1 Complete | DoD #3 |
| **11** | **SP06-P3** + Status | CAP/ACC Continuity-ready | **DOCUMENTARY** | NO | Required for P3 readiness | DoD #13–14 |
| **12** | **SP06-DG-03** / parking | Park or dispose if dependency | **PARKING** | **NOT FORCED** | Outside core by default | DoD #12 if ever in-scope |
| **13** | **SP06-P3** | Integration≠SP06 honesty | **PROOF-ONLY** | NO | Required for honest closure | Honesty under DoD |

```text
Mandate accounting ≠ deficit CLOSED.
```

---

## 9. Product / Publication wall

SP06 core **MUST NOT** implement:

- Premium · Diamond · `access_tier`
- subscription entitlement · monetization
- Product Marketplace card · Marketplace behavior
- Product strategy · contact unlock

No commercial state may rewrite Factory truth · rewrite Decision truth · change evidence · change provenance · change eligibility truth merely because of payment/tier.

---

## 10. Owner identity / contact wall

```text
ownerRef / owner identity
  ≠ owner contact
  ≠ outreach
  ≠ targeting
  ≠ contact unlock
```

Contact / outreach / targeting remain **UNAUTHORIZED** under this Mandate.

---

## 11. Legal / real-estate wall

```text
PRE-LAUNCH LEGAL REVIEW REQUIRED
  = production / user-facing gate
  ≠ automatic block of bounded non-production P1/P2 technical work
```

**Forbidden publication semantics:** BUY · SELL · INVEST · MAKE OFFER · transaction recommendation · brokerage · representation · intermediation.

No legal approval is claimed by this Mandate.

---

## 12. Raw ELR / predecessor wall

```text
Factory ELR ≠ Publication payload
Factory = READ-ONLY predecessor
SP05   = READ-ONLY predecessor
```

**Forbidden:** Factory write-back · Decision write-back · CB mutation · Hardening mutation · P-INT mutation · SP05-P1/P2/P3/P4 mutation · semantic re-adjudication of Decision outputs · public exposure of complete raw ELR.

---

## 13. II.3 / II.4 antecedent treatment

| Antecedent | Mandate posture |
|------------|-----------------|
| **II.3** Publication Eligibility | Constitutional/integration **antecedent** · fail-closed eligibility≠delivery principles · **≠ SP06 IMPL** · **≠** auto DEC-DOSSIER eligibility |
| **II.4** Publication Unit | Constitutional/integration **antecedent** · atomic unit principles · **≠ SP06 IMPL** · **≠** auto SP06 unit |

Future regression obligations = proportionate honesty (do not claim Integration completes SP06).

---

## 14. Proof obligations (future — no tests now)

As applicable for P1/P2 Mandated proofs:

- valid eligible · valid not-eligible
- malformed/rejected mandatory · unsupported input
- insufficient evidence · conflict · freshness limitation · missing provenance
- deterministic repeat · immutability
- no Factory write-back · no Decision rewrite · no raw ELR exposure
- bounded projection · optional absence
- Product/entitlement isolation · owner-contact exclusion
- prohibited transaction-language leakage
- II.3 / II.4 regression where relevant
- SP05 regression where relevant

Proof IDs assigned later by bounded phase instruments. **No implementation tests in this run.**

---

## 15. Implementation authority chain

### Source-mutating phases (typically P1 / P2)

```text
1. Required documentary contract/freeze
2. Independent Pre-Implementation Audit
3. Bounded Grant
4. Explicit Director: "Aprobado. Ejecuta."
5. Source implementation
6. Independent Post-Implementation Audit
7. Phase Complete Status
```

```text
No Grant = NO CODE AUTHORITY
No Director EXECUTE = NO CODE MUTATION
No step implies the next
```

### Documentary / proof-only phases (typically P3)

Use only instruments actually required. **Do not manufacture a source Grant** if no source mutation is required.

---

## 16. Phase entry / exit discipline

```text
P1 before P2
P2 before P3 closure preparation
Director/frontier gates apply conditionally to affected surfaces
Each completed phase Continuity-published + independently audited per mutation class before dependent IMPL begins
```

---

## 17. Parking / Future

**PARKING / FUTURE** preserved for:

- DG-01 A / **SP06-DG-02**
- DG-01 B / **SP06-DG-03** (default outside SP06 core)
- DEF-SP05-11
- DEF-SP05-13
- Product Marketplace card
- Product entitlement/monetization not required by bounded Publication core
- SP07 Continuous Operation
- SP08 Scale Out

Parking ≠ engineering debt backlog for SP06 core.

---

## 18. Hard exclusions

This Mandate does **NOT** authorize:

- Factory truth architecture modification
- Product · Marketplace · subscription / access entitlement IMPL
- Premium/Diamond commercial IMPL · strategy IMPL
- owner contact / outreach / targeting
- SP07 Continuous Operation · SP08 Scale Out
- nationwide · Live · Live LLM
- CRM · payment · Stripe
- database redesign · migrations · Supabase / RLS / Auth / Storage by synonym
- CB / Hardening / P-INT redesign
- inventing exact source trees in this file

---

## 19. Observations register (carried)

| ID | Classification |
|----|----------------|
| **OBS-SP06-DISC-AUD-01** | Clarification (DG §21 mapping) |
| **OBS-SP06-DISC-AUD-02** | Parking (DG-03 not forced) |
| **OBS-SP06-DISC-AUD-03** | Proof obligation / no duplicate eng. |
| **OBS-SP06-DISC-AUD-04** | Design constraint (Product frontier open) |
| **OBS-SP06-PLAN-AUD-01** | Clarification / proof (ELR CAP complementarity) |
| **OBS-SP06-PLAN-AUD-02** | Design constraint (dispose-or-park) |
| **OBS-SP06-PLAN-AUD-03** | Record only (session audits) |
| **OBS-SP06-PLAN-AUD-04** | Design constraint (handoff classification deferred) |

No remediation unless independently authorized.

---

## 20. Mandate exit state / next gate

| Campo | Binding upon Continuity publication + Git CLEAN |
|-------|--------------------------------------------------|
| **SP06 Discovery** | **COMPLETE / AUDITED** |
| **SP06 Plan** | **PUBLISHED / AUDITED** |
| **SP06 Engineering Mandate** | **PUBLISHED** |
| **SP06 Implementation** | **NOT STARTED / NOT AUTHORIZED** |
| **SP06-P1** | **NOT OPENED FOR IMPLEMENTATION** |
| **SP06-P2** | **NOT OPENED** |
| **SP06-P3** | **NOT OPENED** |
| **SP07 / SP08** | **NOT OPENED** |

```text
NEXT CONSTITUTIONAL / TECHNICAL GATE
  = INDEPENDENT SP06-P1 PRE-IMPLEMENTATION AUDIT

≠ Grant
≠ Director EXECUTE for code
≠ source mutation
≠ SP06-P2/P3 opened
≠ Product / Marketplace
≠ SP07 / SP08
≠ Director-gate disposition by synonym
```

---

## Binding footer

```text
SP06-ENG-IMPL
  = Controlling Engineering class Mandate for
    Strategic Program 06 — Publication

DEFINES: bounded DoD · CAP/ACC · phase gates ·
         dispose-or-park frontiers · proof classes ·
         II.3/II.4 antecedent honesty

≠ CODE · ≠ GRANT · ≠ EXECUTE · ≠ PRE-IMPL
≠ DELIVERY · ≠ PRODUCT · ≠ MARKETPLACE
≠ SP06 COMPLETE

Publication ≠ Product
Factory ELR ≠ Publication payload
SP06-DG-01…04 = UNDECIDED / PARKABLE
SP06-DG-03 = NOT FORCED
PRE-LAUNCH LEGAL REVIEW REQUIRED (future)
SP05 = COMPLETE · CLOSED
SP07/SP08 = NOT OPENED
```

**END OF SP06-ENG-IMPL — ENGINEERING IMPLEMENTATION MANDATE**

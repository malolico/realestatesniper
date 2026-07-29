# STRATEGIC PROGRAM 01 — FACTORY ALIVE  
## SP01-IB-03 — OFFICIAL DISCOVERY SPECIFICATION  
### Recuperación del alcance oficial de Orchestrate Staging Proof

| Campo | Valor |
|-------|--------|
| **Document ID** | `FACTORY_EVOLUTION_SP01_IB03_OFFICIAL_DISCOVERY_SPECIFICATION.md` |
| **Path** | `docs/factory-construction/FACTORY_EVOLUTION_SP01_IB03_OFFICIAL_DISCOVERY_SPECIFICATION.md` |
| **Nature** | Official Discovery Specification — **recovers** IB-03 scope from published corpus · **does not implement** · **does not authorize IMPL** · **does not open IB-04+** |
| **Program** | **Strategic Program 01 — Factory Alive** |
| **Block under discovery** | **SP01-IB-03** |
| **Date** | **2026-07-29** |
| **HEAD (official published)** | `b8ac1afd773bb005567776effd2b0ef0e9df60fa` |
| **Branch** | `integration/factory-complete-20260725-local` |
| **IB-03 implementation authorization** | **NOT AUTHORIZED** |
| **Final discovery state** | See §22 |

---

## 1. Document identity

This document is the **Official Discovery Specification** for **SP01-IB-03**.  
It **recovers** the block’s meaning from the approved and published Factory Evolution / SP01 corpus.  
It does **not** invent purpose, CAP targets, deliverables, activities, or completion criteria.

```text
DISCOVERY ≠ IMPLEMENTATION MANDATE
DISCOVERY ≠ AUTHORIZATION TO IMPLEMENT
DISCOVERY ≠ IB-04+
```

---

## 2. Discovery authority

| Authority | Role |
|-----------|------|
| Director order — SP01-IB-03 Official Discovery Specification | Issuance of this Discovery |
| Published HEAD `b8ac1afd773bb005567776effd2b0ef0e9df60fa` | Repository baseline |
| SP01 Official Implementation Plan (SP01-02) | **Primary block definition** of SP01-IB-03 |
| SP01 Official Discovery Specification (SP01-01) | CAP-SP01-02 · Alive (B) · §8 ORCHESTRATE (STAGING) |
| SP01 Documentary Commit Status · IB-01 / IB-02 packages | Prior closed state · CAP-02 gap inventory |
| Blueprint · CB-00…CB-19 · CCD · Continuity · Master Plan · P-INT / Hardening Statuses | Constitutional and CLOSED-surface evidence |

**Anti-invention:** No IB-03 meaning is inferred solely from sequence numbering or prior IB patterns beyond what the Plan/Discovery texts state.

---

## 3. Exact IB-03 official title

Per `FACTORY_EVOLUTION_SP01_FACTORY_ALIVE_OFFICIAL_IMPLEMENTATION_PLAN.md` §7:

```text
SP01-IB-03 — Orchestrate Staging Proof
```

Plan sequence line (same file):

```text
SP01-IB-03  Orchestrate Staging Proof (CAP-02)
```

---

## 4. Source hierarchy

| Rank | Source | Use for IB-03 |
|------|--------|----------------|
| **1** | `FACTORY_EVOLUTION_SP01_FACTORY_ALIVE_OFFICIAL_IMPLEMENTATION_PLAN.md` — §7 **SP01-IB-03** | Exact title, objective, scope, dependencies, expected evidence, closure criteria |
| **2** | `FACTORY_EVOLUTION_SP01_FACTORY_ALIVE_OFFICIAL_DISCOVERY_SPECIFICATION.md` | CAP-SP01-02 definition; Alive clause (B); §8 step 2 ORCHESTRATE (STAGING); exclusions §6; R-SP01-03 / R-SP01-06 |
| **3** | `FACTORY_EVOLUTION_SP01_IB01_CAP_EVIDENCE_MATRIX.md` + IB-01 Status / Commit Status | CAP-02 **PARTIALLY SATISFIED**; **GAP-IB01-01** / OBS-SB-STUB |
| **4** | `FACTORY_EVOLUTION_SP01_FACTORY_ALIVE_DOCUMENTARY_COMMIT_STATUS.md` | **MIN-02** — stub vs live CB-15 disposition obligation for IB-03 / IB-08 |
| **5** | `FACTORY_INTEGRATION_P_INT_01_SLICE_B_IMPL_STATUS.md` | Slice B **FULLY CLOSED** (staging); OBS-SB-STUB; no live CB-15 `orchestrateExpediente` |
| **6** | Factory Evolution Director Strategic Mandate | SP01 identity; Alive ≠ Arizona |
| **7** | Blueprint · CB-15 · Master Plan §10 MVI-2 · Continuity | Anchors — consume / cite |
| **8** | SP01-IB-02 package | Prior proof block closed; **does not** define IB-03; states IB-03 **NOT AUTHORIZED** |

**Prevalence for block organization:** Plan §7 SP01-IB-03.  
**Prevalence for capability meaning:** SP01-01 CAP-SP01-02 + §8 step 2.  
**Prevalence for known residual:** IB-01 matrix + Documentary MIN-02 + Slice B Status.

---

## 5. Repository baseline

| Check | Result |
|-------|--------|
| Branch | `integration/factory-complete-20260725-local` |
| Local HEAD | `b8ac1afd773bb005567776effd2b0ef0e9df60fa` |
| `origin/integration/factory-complete-20260725` | Same SHA |
| Ahead / behind | **0 / 0** |
| Tracked modifications | **NONE** |
| Staged files | **NONE** |
| Tolerated untracked only | `docs/factory-construction/FACTORY_ALIVE_P1_01_OFFICIAL_DISCOVERY.md` (not incorporated) |
| SP01-IB-01 | **OFFICIALLY PUBLISHED AND CLOSED** (corpus) |
| SP01-IB-02 | **OFFICIALLY PUBLISHED AND CLOSED** at this HEAD |
| IB-03+ IMPL | **NOT AUTHORIZED** |

---

## 6. Exact scope

Recovered verbatim from Plan §7 SP01-IB-03:

| Campo | Contenido oficial |
|-------|-------------------|
| **Identificador** | **SP01-IB-03** |
| **Objetivo** | Demostrar CAP-SP01-02 (orquestación staging vía job + CB-15; no orquestación en request Web) |
| **Alcance** | Ejercicio del régimen staging ya registrado (Slice B); verificación de no-web-orchestration |
| **Dependencias** | IB-01; Slice B Status |
| **Evidencias esperadas** | Prueba staging documentada; nota explícita staging ≠ Arizona production / Auth productiva |
| **Criterios de cierre** | CAP-02 PROVED o GAP → IB-08; sin reopen Slice B como pending IMPL salvo Mandate gap |

**Binding scope statement:**

```text
IN SCOPE (Discovery recovery):
  Exercise / verify the already-registered Slice B staging regime
  Verify no orchestration on product Web request path
  Document staging proof with staging ≠ Arizona / Auth productiva
  Disposition CAP-SP01-02 as PROVED or GAP → IB-08

NOT IN SCOPE (this Discovery / without separate Mandate):
  Implementation of IB-03
  Reopening Slice B as pending IMPL (except future Mandate gap path)
  IB-04…IB-10
  SP02 Arizona Alive
```

---

## 7. Architectural purpose

From Plan objective + SP01-01 Alive definition clause **(B)** and §8 step **2. ORCHESTRATE (STAGING)**:

```text
Prove that an authorized operator can launch Factory orchestration
in the authorized staging regime via job runner / Command Edge
associated with CB-15,
without synchronous orchestration on the product Web request path.
```

SP01-01 §8 (contract of result — not file/API prescription):

```text
2. ORCHESTRATE (STAGING)
   Operador autorizado solicita orquestación vía job (Command Edge / Job Runner)
   → ejecución asociada a CB-15
   → no orquestación síncrona en request Web de producto
```

Master Plan adjacency: **§10 MVI-2** (via CAP-SP01-02 anchor in SP01-01).

---

## 8. CAP targets

| ID | Definition (SP01-01 §7) | IB-03 role (Plan) |
|----|-------------------------|-------------------|
| **CAP-SP01-02** | Lanzamiento de orquestación **staging** vía job runner + CB-15 | **Sole CAP target** of SP01-IB-03 |

**Not IB-03 CAP targets:** CAP-SP01-01, 03, 04, 05, 06, 07 (addressed by other IBs per Plan sequence).

---

## 9. Dependencies

| Dependency | Authority | State at Discovery HEAD |
|------------|-----------|-------------------------|
| **SP01-IB-01** | Plan §7 IB-03 | **CLOSED** — matrix records CAP-02 **PARTIALLY SATISFIED** + **GAP-IB01-01** |
| **Slice B Status** | Plan §7 IB-03 | **FULLY CLOSED** (staging) — `FACTORY_INTEGRATION_P_INT_01_SLICE_B_IMPL_STATUS.md` |
| Plan sequence position after IB-02 | Plan §7 chain | IB-02 **CLOSED** at HEAD; Plan IB-03 dependency table lists IB-01 + Slice B (**not** IB-02 as named dependency) |
| CB-15 construction | SP01-01 / Blueprint | Construction CLOSED — consume / cite |
| SP01-IB-03 Implementation Mandate | Protocol | **NOT ISSUED** — IMPL **NOT AUTHORIZED** |

---

## 10. Existing evidence and implementation inventory

| Kind | Path / artifact | Relevance |
|------|-----------------|-----------|
| Slice B Impl Status | `docs/factory-construction/integration/FACTORY_INTEGRATION_P_INT_01_SLICE_B_IMPL_STATUS.md` | Staging job path B1–B4 **FULLY CLOSED**; **OBS-SB-STUB** (`stubExecutor`; no live CB-15 `orchestrateExpediente`) |
| IB-01 CAP matrix | `FACTORY_EVOLUTION_SP01_IB01_CAP_EVIDENCE_MATRIX.md` | CAP-02 **PARTIALLY SATISFIED**; runners listed; **GAP-IB01-01** |
| Documentary Status | `FACTORY_EVOLUTION_SP01_FACTORY_ALIVE_DOCUMENTARY_COMMIT_STATUS.md` | **MIN-02** binds IB-03/IB-08 to explicit stub vs live CB-15 disposition |
| Slice B runners (existing) | `src/runPInt01SliceB1Validation.js` … `B4`; `src/runPInt01SliceBSmoke.js` | Candidate exercise vehicles (Discovery lists; does **not** execute) |
| CB-15 runner (existing) | `src/runCb15OrchestrationValidation.js` | Candidate CB-15 boundary evidence (Discovery lists; does **not** execute) |
| Continuity / Master Plan | Continuity corpus; Master Plan §10 MVI-2 | Staging delivery / adjacency |
| Hardening PROGRAM 01 | Core Hardening Status COMPLETE | Prerequisite quality — **not** IB-03 identity |

---

## 11. Proven state

| Item | Proven / closed state | Source |
|------|----------------------|--------|
| Slice B staging delivery surface | **FULLY CLOSED** / IMPLEMENTATION ACCEPTED (staging) | Slice B Status |
| Job runner / Command Edge staging path | Delivered under Slice B closeout | Slice B Status |
| No-web / Product / Marketplace / Supabase as Slice B exclusions | Recorded in Slice B Nature / exclusions | Slice B Status |
| CAP-02 baseline inventory | **PARTIALLY SATISFIED** (not PROVED) | IB-01 matrix |
| CAP-01 / 06 / 07 | **PROVED** under IB-02 | IB-02 package at HEAD |
| CAP-SP01-02 **PROVED** | **NOT YET** | Plan assigns proof to IB-03 (or GAP→IB-08) |

---

## 12. Remaining gap

| Gap ID | Description | Authority | Disposition path (corpus) |
|--------|-------------|-----------|---------------------------|
| **GAP-IB01-01** / **OBS-SB-STUB** | Slice B uses `stubExecutor`; Status records **no live CB-15 `orchestrateExpediente`** | IB-01 matrix; Slice B Status; Documentary **MIN-02** | IB-03 must record **explicit** disposition: CAP-02 **PROVED** under staging regime **or** **GAP → IB-08** — **without** silently equating stub with full live CB-15 |
| Live CB-15 orchestrate as production-like capability | Explicitly **not** claimed by Slice B closeout | Slice B Status (“does not authorize … CB-15 orchestrateExpediente”) | Not authorized by this Discovery; gap-fill only under future Mandate (Plan: reopen Slice B as pending IMPL **salvo Mandate gap**) |
| Arizona / Auth productiva | Must remain **≠** staging proof | Plan evidence note; SP01-01 R-SP01-06 | Out of SP01 IB-03 DoD |

**Discovery does not choose** PROVED vs GAP. That choice belongs to a future Implementation Mandate execution and evidence record.

---

## 13. Authorized future work boundary

```text
AFTER this Discovery (and only after a future Implementation Plan + Implementation Mandate):

  MAY (when separately authorized):
    Evidence / exercise / verification of existing Slice B staging regime
    Documentary proof record for CAP-SP01-02
    Disposition PROVED or GAP→IB-08
    Prefer existing runners / Statuses (Plan + SP01 prove-before-change principle)

  MAY NOT (without separate Director Mandate / out of SP01):
    Treat this Discovery as IMPL authorization
    Open IB-04…IB-10
    Open SP02
    Reopen Slice B as pending IMPL absent Mandate gap path
    Equate staging stub with Arizona production
```

---

## 14. Required deliverables

Recovered from Plan §7 “Evidencias esperadas” + closure pattern shared with IB-02 proof family (Plan R-PLAN-03: prueba ejercitable + evidencia referenciable):

| # | Deliverable (minimum, corpus-grounded) |
|---|----------------------------------------|
| 1 | Documented **staging orchestration proof** for CAP-SP01-02 (PASS/FAIL or GAP) |
| 2 | Explicit note: **staging ≠ Arizona production / Auth productiva** |
| 3 | Verification record of **no-web-orchestration** (product Web request path) |
| 4 | CAP-SP01-02 disposition: **PROVED** **or** **GAP → IB-08** |
| 5 | Explicit disposition of **OBS-SB-STUB** / Documentary **MIN-02** (no silent equivalence) |
| 6 | IB-03 Implementation Status / annex when Mandate execution completes (future) |

**This Discovery creates none of the IMPL deliverables** except this Discovery Specification itself.

---

## 15. Validation criteria

Grounded in Plan IB-03 + SP01-01 + Plan R-PLAN-03 / R-PLAN-06:

| ID | Criterion |
|----|-----------|
| V1 | CAP-SP01-02 addressed with objective, referenciable evidence **or** GAP→IB-08 documented |
| V2 | Proof uses **existing** Slice B staging regime (cite CLOSED; no silent reopen) |
| V3 | No-web-orchestration verified / evidenced |
| V4 | Staging ≠ Arizona / Auth productiva explicitly stated |
| V5 | OBS-SB-STUB / MIN-02 explicitly dispositioned (PROVED rationale **or** GAP) |
| V6 | No Product / Marketplace / Arizona / Supabase / CB semantic / Hardening / unauthorized P-INT modification |
| V7 | No new APIs designed as Plan content (R-PLAN-05); no Cloud ELR as SP01 DoD (R-PLAN-09) |
| V8 | IB-04+ not opened under IB-03 color |

---

## 16. Completion criteria

From Plan §7 Criterios de cierre:

| # | Criterion |
|---|-----------|
| 1 | CAP-SP01-02 marked **PROVED** **or** **GAP → IB-08** |
| 2 | Slice B **not** reopened as pending IMPL **unless** Mandate gap path applies |
| 3 | Expected evidence present (documented staging proof + staging ≠ Arizona / Auth productiva) |
| 4 | SP01 program **COMPLETE** **not** declared by IB-03 alone |

```text
IB-03 COMPLETE ≠ SP01 COMPLETE
IB-03 PROVED(CAP-02) ≠ IB-04 authorization
GAP → IB-08 ≠ gap-fill (IB-09) authorization
```

---

## 17. Out of scope

| Item | Authority |
|------|-----------|
| IB-03 implementation under this Discovery | Discovery Nature |
| IB-04 Package Export Proof and later IBs | Plan sequence; IB-02 Commit Status |
| SP02 Arizona Alive | SP01-01 §6; Plan R-PLAN-06/07 |
| Product / `access_tier` / pricing | SP01-01 §6 |
| Marketplace modification | SP01-01 §6; Plan IB-05 owns non-coupling proof |
| Supabase / Web product orchestration | SP01-01 exclusions; Plan “no orquestación en request Web” |
| CB-00…CB-19 semantic rewrite | SP01-01 CAP-05 / exclusions |
| Hardening PROGRAM reopen as SP01 identity | Plan R-PLAN-08 |
| Treating stubExecutor as production Arizona | SP01-01 R-SP01-06; Documentary MIN-02 |
| Declaring Alive with only UI narrative | SP01-01 R-SP01-03; Plan R-PLAN-03 |

---

## 18. Protected surfaces classification

| Surface | Classification | Basis |
|---------|----------------|-------|
| **Supabase** | **OUT OF SCOPE** · **STOP / DIRECTOR AUTHORIZATION REQUIRED** if touched | SP01-01 §6; Continuity Stop Rules |
| **Web** (product request orchestration) | **OUT OF SCOPE** to modify · **IN SCOPE** to **verify absence** of sync orchestration on product Web path | Plan IB-03 objective/alcance |
| **Product** | **OUT OF SCOPE** · **STOP** if modified | SP01-01 §6 |
| **Marketplace** | **OUT OF SCOPE** · **STOP** if modified | SP01-01 §6 |
| **Arizona** | **OUT OF SCOPE** · **STOP** if opened as SP02 | Plan evidence note; R-PLAN-06 |
| **CB** (bodies / semantics) | **OUT OF SCOPE** to modify · **IN SCOPE** to **cite/consume** CB-15 · **STOP** if semantic change required | SP01-01 CAP-05; Blueprint |
| **Hardening** | **OUT OF SCOPE** · **STOP** if modified under IB-03 color | Plan R-PLAN-08 |
| **P-INT** | **IN SCOPE** to **cite** Slice B CLOSED · **OUT OF SCOPE** to reopen as pending IMPL · **STOP / DIRECTOR AUTHORIZATION REQUIRED** for Mandate gap reopen | Plan closure criterion |
| **Runtime** | **IN SCOPE** to **exercise existing** staging regime / runners when Mandate authorizes · **OUT OF SCOPE** / **STOP** for runtime redesign | Plan “Ejercicio”; prove-before-change |
| **Control Plane** (Job Runner / Command Edge staging) | **IN SCOPE** to exercise **existing** Slice B surfaces · **OUT OF SCOPE** / **STOP** for Control Plane redesign | Plan alcance |
| **APIs** | **IN SCOPE** to exercise **existing** staging APIs · **OUT OF SCOPE** / **STOP** for API extensions (R-PLAN-05) | Plan; R-PLAN-05 |
| **Persistence** | **IN SCOPE** to cite existing Slice B staging persistence observations · **OUT OF SCOPE** / **STOP** for new persistence / Cloud ELR as DoD | Slice B OBS-SB-FS; R-PLAN-09 |

---

## 19. STOP conditions

Halt future IB-03 Mandate execution (when issued) if any of:

| STOP |
|------|
| Modification of CB semantics / bodies |
| Modification of Hardening under SP01 color |
| Unauthorized P-INT reopen |
| Product / Marketplace / Arizona / Supabase invasion |
| Web product path used for synchronous Factory orchestration as “proof” |
| Silent equivalence of `stubExecutor` with full live CB-15 without MIN-02 disposition |
| New APIs / architecture / Control Plane redesign to “make CAP-02 pass” |
| Opening IB-04+ or SP02 under IB-03 color |
| Treating Cloud ELR residual as SP01 DoD |

```text
ON STOP: HALT · REPORT TO DIRECTOR · NO SILENT SCOPE EXPANSION
```

---

## 20. Risks and observations

| ID | Class | Observation |
|----|-------|-------------|
| **OBS-D-01** | Binding | Documentary **MIN-02** / **OBS-SB-STUB**: IB-03 must **explicitly** disposition stub vs CAP-02 “job + CB-15” language — Plan allows **PROVED** or **GAP→IB-08**, not silent pass |
| **OBS-D-02** | Informational | Plan IB-03 dependencies name **IB-01** + Slice B; sequence places IB-03 after IB-02 — IB-02 is closed at HEAD but is **not** listed as a named IB-03 dependency in Plan §7 |
| **OBS-D-03** | Informational | Slice B Status already forbids authorizing CB-15 `orchestrateExpediente` by that closeout — live orchestrate is **not** a free residual of Slice B FULLY CLOSED |
| **OBS-D-04** | Informational | This Discovery does **not** issue `SP01-IB-03-IMPL`; Implementation Plan for IB-03 remains a **separate** future artifact under Director order |
| **OBS-D-05** | Informational | Tolerated untracked `FACTORY_ALIVE_P1_01_OFFICIAL_DISCOVERY.md` is **not** an IB-03 authority |

**Conflicts found:** **NONE** that prevent recovering IB-03’s official title, CAP target, scope, and closure fork (PROVED \| GAP→IB-08). The stub vs live CB-15 tension is an **explicit corpus residual**, not an undefined block.

---

## 21. Discovery conclusion

| Question | Answer |
|----------|--------|
| Is IB-03 defined in the official corpus? | **YES** — Plan §7 SP01-IB-03 + SP01-01 CAP-SP01-02 / §8 |
| Exact title | **SP01-IB-03 — Orchestrate Staging Proof** |
| CAP target | **CAP-SP01-02** only |
| Block type (corpus) | **Proof** block — staging exercise / verification of **existing** Slice B regime; **not** a feature-build mandate; outcome **PROVED** or **GAP→IB-08** |
| Sufficient to proceed to Implementation Plan? | **YES** — without inventing scope |
| Implementation authorized now? | **NO** |

---

## 22. Readiness for Implementation Plan

```text
DISCOVERY COMPLETE — READY FOR IMPLEMENTATION PLAN
```

**Meaning:** Official IB-03 scope is recovered and internally consistent enough for a **future** Official Implementation Plan document under Director order.

**Does not mean:** Implementation Mandate issued · IMPL authorized · runners executed · CAP-02 PROVED · IB-04 opened.

---

## Binding footer

```text
SP01-IB-03 OFFICIAL DISCOVERY SPECIFICATION
TITLE: Orchestrate Staging Proof
CAP: CAP-SP01-02
HEAD: b8ac1afd773bb005567776effd2b0ef0e9df60fa
IMPL: NOT AUTHORIZED
NO IB-04+
NO INVENTION BEYOND PLAN / SP01-01 / CLOSED STATUSES
```

---

```text
DISCOVERY COMPLETE — READY FOR IMPLEMENTATION PLAN
```

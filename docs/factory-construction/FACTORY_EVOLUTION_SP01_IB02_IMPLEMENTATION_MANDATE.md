# STRATEGIC PROGRAM 01 — FACTORY ALIVE  
## SP01-IB-02 — OFFICIAL IMPLEMENTATION MANDATE  
### Autorización exclusiva de SP01-IB-02 — Observe Capability Proof

| Campo | Valor |
|-------|--------|
| **Document ID** | `FACTORY_EVOLUTION_SP01_IB02_IMPLEMENTATION_MANDATE.md` |
| **Path** | `docs/factory-construction/FACTORY_EVOLUTION_SP01_IB02_IMPLEMENTATION_MANDATE.md` |
| **Nature** | Director Implementation Mandate — **documentary authorization only** · **no code in this file** · **does not implement** |
| **Mandate ID** | `SP01-IB-02-IMPL` |
| **Program** | **Strategic Program 01 — Factory Alive** |
| **Authorized block** | **SP01-IB-02 ONLY** |
| **Date** | **2026-07-29** |
| **HEAD (context)** | `00672887000841de94ee7c682b3cc975392dedb1` |
| **Branch (context)** | `integration/factory-complete-20260725-local` |
| **Final state** | **IMPLEMENTATION AUTHORIZED** |

---

## 0. Absolute scope banner

```text
MANDATE ID: SP01-IB-02-IMPL
AUTHORIZED: SP01-IB-02 — Observe Capability Proof ONLY
NOT AUTHORIZED: SP01-IB-01 reopen · SP01-IB-03 … SP01-IB-10
NOT AUTHORIZED: SP02 Arizona Alive
NOT AUTHORIZED: code / APIs / runtime / CB / Hardening / P-INT / Product / Marketplace / Arizona / Supabase
PRINCIPLE: PROVE WHAT ALREADY EXISTS — EVIDENCE ONLY
```

This Mandate **authorizes the start of engineering work for SP01-IB-02 only**.

It does **not** contain code, pseudocode, APIs, task lists, or roadmaps.  
It does **not** open IB-03 or SP02.  
It does **not** reopen IB-01 as pending IMPL.  
It does **not** create, extend, or modify Factory functionality or architecture.

---

## 1. Mandate ID

```text
SP01-IB-02-IMPL
```

| Campo | Valor |
|-------|--------|
| **Mandate ID** | **SP01-IB-02-IMPL** |
| **Authorized block** | **SP01-IB-02** |
| **Plan reference** | SP01-02 §7 — SP01-IB-02 Observe Capability Proof |
| **CAP targets** | **CAP-SP01-01**, **CAP-SP01-06**, **CAP-SP01-07** |

---

## 2. Scope

### 2.1 In scope (IB-02 only)

| Actividad | Autorizada |
|-----------|------------|
| Ejercicio / verificación de lecturas Admin / governance **ya existentes** (CB-18 surfaces) | **YES** |
| Demostración objetiva de que Registry + ELR operan como verdad Factory (≠ deals) mediante evidencia existente | **YES** |
| Confirmación objetiva de que el control plane Factory es separable de Product/Marketplace | **YES** |
| Uso de runners / Statuses / Closeouts / demos **ya existentes** como vehículos de evidencia | **YES** |
| Emisión de registro documental de prueba observe (PASS/FAIL / GAP) y Status/anexo de cierre IB-02 | **YES** |
| Lectura de código/documentación existente **solo** para citar evidencia | **YES** |
| Clasificación CAP-01 / 06 / 07 como **PROVED** o **GAP documentado** hacia IB-08 | **YES** |

### 2.2 Nature of work

```text
EVIDENCE-ORIENTED BLOCK
→ Prove observation of operational state through existing Control Plane surfaces
→ Do NOT create new functionality
→ Do NOT extend existing functionality
→ Do NOT modify architecture
→ Prove ONLY what already exists
```

---

## 3. Explicit objective

Demonstrate, with **objective evidence only**, that Factory can **OBSERVE** its operational state through the **existing Control Plane** surfaces defined in SP01:

```text
OPERATE / OBSERVE
  Authorized operator consults Factory control plane
  → governance / maturity / compliance / drift reads (CB-18)
  → Registry + ELR as Factory truth (≠ deals)
  → control plane separable from Product / Marketplace
  → without mutating Product / Marketplace
  → without creating or extending surfaces
```

Per Plan SP01-02 §7 SP01-IB-02:

> Demostrar CAP-SP01-01, CAP-SP01-06, CAP-SP01-07 (observe gobernanza; Registry/ELR verdad; control plane separable).

IB-01 baseline classifications (SATISFIED candidates) are **consumed as starting inventory**, not as CAP **PROVED**. IB-02 must produce **objective proof evidence** or a **documented GAP** toward IB-08.

---

## 4. Deliverables

Under this Mandate, IB-02 **must** produce:

| # | Deliverable |
|---|-------------|
| 1 | **Observe Capability Proof Record** — versionable documentary record covering CAP-SP01-01, CAP-SP01-06, CAP-SP01-07 |
| 2 | Per-CAP disposition: **PROVED** \| **GAP documented (→ IB-08)** with evidence citations |
| 3 | Explicit frontier confirmation: Product / Marketplace / Arizona / Supabase **not invaded** |
| 4 | Explicit statement: **zero new functionality** · **zero extensions** · **zero architecture change** · **zero APIs** |
| 5 | **SP01-IB-02 Implementation Status** (or equivalent Status annex) declaring block COMPLETE only when §7 holds |
| 6 | Traceability to IB-01 matrix rows for CAP-01 / 06 / 07 (cite, do not rewrite IB-01 as reopen) |

**No code deliverables. No test harness invention required by this Mandate** if existing runners/Statuses suffice; new suites are **out of scope** unless a future separate Mandate authorizes them.

---

## 5. Mandatory evidence

| # | Evidence required |
|---|-------------------|
| 1 | Objective citation that Admin maturity / compliance / drift reads (CB-18) are exercisable or already evidenced CLOSED (CAP-01) |
| 2 | Objective citation that Registry + ELR function as Factory truth and are not deals tables (CAP-06) |
| 3 | Objective citation that Factory control plane remains separable from Product/Marketplace (CAP-07) |
| 4 | PASS/FAIL (or GAP) result for each of CAP-01 / 06 / 07 with path/Status/runner/audit refs |
| 5 | Confirmation that CLOSED P-INT / Slice / Admin / Hardening / CB blocks are **cited**, not reopened as pending IMPL |
| 6 | Confirmation of exclusiones SP01-01 §6 applicable to observe path |
| 7 | Mapping row: CAP → evidence → disposition (PROVED \| GAP→IB-08) |

Evidence must be **objective and referenciable**. Narrative assertion without citation is **insufficient**.

---

## 6. Validation criteria

| ID | Validation | Required result |
|----|------------|-----------------|
| **V1** | CAP-SP01-01 addressed with objective evidence or GAP | **PASS** |
| **V2** | CAP-SP01-06 addressed with objective evidence or GAP | **PASS** |
| **V3** | CAP-SP01-07 addressed with objective evidence or GAP | **PASS** |
| **V4** | No new functionality / APIs / schemas introduced | **PASS** |
| **V5** | No architecture modification; Blueprint / CB semantics intact | **PASS** |
| **V6** | No Product / Marketplace / Arizona / Supabase / CB / Hardening / P-INT modification | **PASS** |
| **V7** | No runtime behavior change attributable to IB-02 | **PASS** |
| **V8** | IB-03…IB-10 not started; IB-01 not reopened as IMPL | **PASS** |
| **V9** | PROVE WHAT ALREADY EXISTS respected (evidence-only) | **PASS** |

**Overall IB-02 validation:** all V1…V9 **PASS**.

---

## 7. Completion criteria

**SP01-IB-02** is declared **COMPLETE** only if **all** are true:

| # | Criterion |
|---|-----------|
| 1 | Observe Capability Proof Record exists and is versionable |
| 2 | CAP-01, CAP-06, CAP-07 each have disposition **PROVED** or **GAP documented → IB-08** |
| 3 | Mandatory evidence §5 present |
| 4 | Validations V1…V9 **PASS** |
| 5 | No STOP trigger activated without Director resolution |
| 6 | IB-02 Implementation Status / annex emitted |
| 7 | Zero code / API / runtime / architecture change under this Mandate |
| 8 | IB-03…IB-10 remain **NOT AUTHORIZED** by this Mandate |
| 9 | SP01 program **COMPLETE** **not** declared |

```text
IB-02 COMPLETE ≠ SP01 COMPLETE
IB-02 PROVED(CAP) ≠ authorization of IB-03
GAP documented ≠ gap-fill (IB-09) authorization
```

---

## 8. Out of scope

| Actividad | Autorizada |
|-----------|------------|
| SP01-IB-01 reopen / matrix rewrite as new IMPL | **NO** |
| SP01-IB-03 Orchestrate Staging Proof | **NO** |
| SP01-IB-04 … SP01-IB-10 | **NO** |
| Gap-fill adapters (IB-09) | **NO** |
| New code / config / tests / runners invented for IB-02 | **NO** |
| New APIs / endpoints / schemas | **NO** |
| Functional extension of Control Plane / Admin / Registry / ELR | **NO** |
| Architecture redesign or parallel observe plane | **NO** |
| Product / `access_tier` / pricing | **NO** |
| Marketplace | **NO** |
| Arizona / SP02 | **NO** |
| Supabase | **NO** |
| CB-00…CB-19 body or semantic modification | **NO** |
| Hardening PROGRAM 01/02 modification | **NO** |
| P-INT modification / reopen as pending IMPL | **NO** |
| Runtime behavior changes | **NO** |
| Continuity next-block selection / push / deploy | **NO** |
| Documentation updates outside IB-02 authorized deliverables under a future execution order | **NO** *(this Mandate file itself is the sole document created by this issuance)* |

---

## 9. STOP conditions

Execution under this Mandate **must halt immediately** if any of:

| STOP trigger |
|--------------|
| Modification of **CB** |
| Modification of **Hardening** |
| Modification of **P-INT** |
| Modification of **Marketplace** |
| Modification of **Product** |
| Modification of **Arizona** |
| Modification of **Supabase** |
| Introduction of **new code / APIs / runtime behavior** |
| Attempt to **extend** Control Plane functionality beyond existing surfaces |
| Attempt to **modify architecture** to “make observe work” |
| Constitutional contradiction (CCD / Continuity frontiers / SP01-01 exclusions) |
| Undocumented dependency required for IB-02 and absent from SP01-01/02 / Continuity / Master Plan / IB-01 matrix |
| Attempt to open **IB-03…IB-10** or **SP02** |
| Attempt to declare **SP01 COMPLETE** |

```text
ON STOP:
  HALT IB-02 work
  REPORT to Director
  NO silent continuation
  NO scope expansion
  NO gap-fill under color of observe proof
```

---

## 10. Constitutional restrictions

| Restriction | Binding |
|-------------|---------|
| Construction Blueprint intact | **MUST** |
| CB-00…CB-19 semantics intact — consume / cite only | **MUST** |
| CCD frontiers intact | **MUST** |
| Continuity Stop Rules / staging regime respected | **MUST** |
| Master Plan MVI adjacency (observe = MVI-1 + truth + separation) — not Master Plan rewrite | **MUST** |
| SP01-01 exclusions (§6) binding | **MUST** |
| Hardening / P-INT CLOSED surfaces cited, not reopened | **MUST** |
| Product sovereignty outside Factory | **MUST** |
| Marketplace non-coupling for decision | **MUST** |
| Arizona / SP02 not opened | **MUST** |
| Supabase not in SP01 DoD / not modified | **MUST** |
| No code in this Mandate document | **MUST** |

---

## 11. Dependencies

| Dependency | Status / role |
|------------|----------------|
| Factory Evolution Director Strategic Mandate | Founding — SP01 identity |
| SP01 Official Discovery Specification (SP01-01) | CAP-01 / 06 / 07 definitions · Alive observe contract |
| SP01 Official Implementation Plan (SP01-02) | Block IB-02 organization |
| SP01 Documentary Commit Status | Documentary foundation closed |
| SP01-IB-01 Implementation Mandate / Matrix / Status / Commit Status | Baseline inventory — prerequisite **COMPLETE** |
| Blueprint · CB-00…CB-19 | CLOSED construction — observe targets CB-18 / CB-01 |
| CCD · Continuity · Master Plan | Frontiers, §27 protocol, MVI-1 adjacency, Stop Rules |
| Slice A / Admin Live Wiring / Registry-ELR / control-plane CLOSED Statuses | Evidence candidates (cite only) |

**Prerequisite gate:** SP01-IB-01 implementation expediente must be **COMPLETE** (matrix + Status). This Mandate does **not** authorize IB-02 execution against an incomplete IB-01 baseline.

**Does not depend on:** IB-03…IB-10, SP02, Product, Marketplace, Supabase, new APIs.

---

## 12. Exit condition

IB-02 under `SP01-IB-02-IMPL` **exits** when:

```text
1. Observe Capability Proof Record issued
2. CAP-01 / CAP-06 / CAP-07 each PROVED or GAP→IB-08 documented
3. Validations V1…V9 PASS
4. IB-02 Implementation Status declares COMPLETE
5. Independent Technical Audit of IB-02 (when ordered) PASS or PASS WITH OBSERVATIONS non-blocking
6. Implementation Commit Status READY (when ordered) — Git commit only under separate Director order
```

**Exit does not authorize:**

- SP01-IB-03 or any later IB  
- Gap-fill (IB-09)  
- SP01 COMPLETE  
- SP02  
- Push / Continuity next-block selection  

Opening IB-03 requires a **separate** Director Implementation Mandate.

---

## Constitutional parents (binding)

| Parent | Use |
|--------|-----|
| Factory Evolution Director Strategic Mandate | Program identity / exclusions |
| SP01 Official Discovery Specification | Observe / CAP constitution |
| SP01 Official Implementation Plan | IB-02 block definition |
| SP01 Documentary Commit Status | Documentary closed state |
| SP01-IB-01 Implementation Commit Status | IB-01 closed; baseline consumed |
| Blueprint | Construction CLOSED |
| CB-00…CB-19 | Semantic consume / cite |
| CCD | Constitutional drafting / frontiers |
| Continuity | Statuses, Stop Rules, staging regime |
| Master Plan | MVI adjacency — not superseded |

---

## Estado documental del expediente (pre-IB-02)

| Artefacto | Estado registrado |
|-----------|-------------------|
| Evolution Founding Mandate | Present |
| SP01 Discovery / Plan / Documentary Commit Status | Present |
| SP01-IB-01 Mandate + Matrix + Status + Commit Status | IB-01 expediente **COMPLETE** (implementation) |
| This Mandate | **ISSUED** — `SP01-IB-02-IMPL` |

---

## Binding footer

```text
MANDATE: SP01-IB-02-IMPL
STATE: IMPLEMENTATION AUTHORIZED
BLOCK: SP01-IB-02 ONLY
MODE: EVIDENCE ONLY — PROVE WHAT ALREADY EXISTS

NO NEW FUNCTIONALITY
NO EXTENSIONS
NO ARCHITECTURE CHANGE
NO CODE / APIs / RUNTIME
NO CB / HARDENING / P-INT / PRODUCT / MARKETPLACE / ARIZONA / SUPABASE
NO IB-03
NO SP02
NO CODE IN THIS DOCUMENT
```

---

```text
IMPLEMENTATION AUTHORIZED

FOR

SP01-IB-02 ONLY
```

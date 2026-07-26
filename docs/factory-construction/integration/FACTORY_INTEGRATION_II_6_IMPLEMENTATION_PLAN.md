# FACTORY INTEGRATION II.6-IMPL
## IMPLEMENTATION PLAN

**Document ID:** `FACTORY_INTEGRATION_II_6_IMPLEMENTATION_PLAN.md`  
**Phase:** Factory Integration  
**Block:** II.6 — Implementation Plan  
**Document Type:** Technical Implementation Plan  
**Status:** PLAN ONLY — NO IMPLEMENTATION AUTHORIZED BY THIS DOCUMENT  

**Repository:** RealEstateSniper  
**Branch / HEAD baseline (shared operational base):** `integration/factory-complete-20260725` @ `9c315ea34562d7c1d0143d0c8f8b69b01c15c287`  

**Director authorization (planning):** Implementation Plan preparation and this document — **approved**.  
**Director authorization (II.6-IMPL code):** **NOT AUTHORIZED** by this document.

**Normative sources:**

1. `FACTORY_INTEGRATION_II_6_HANDOFF_EXECUTION_GOVERNANCE_SPECIFICATION.md`  
2. `FACTORY_INTEGRATION_II_5_HANDOFF_READINESS_GOVERNANCE_SPECIFICATION.md`  
3. `FACTORY_INTEGRATION_II_5_IMPLEMENTATION_PLAN.md`  
4. `FACTORY_INTEGRATION_II_5_IMPL_STATUS.md`  
5. `src/integration/handoffReadiness/**` (consume-only dependency — sole oracle)  
6. Supporting chain: II.1 / II.2 / II.3 / II.4 Specifications and IMPLs (unchanged; reached only indirectly via II.5)

**Architectural decision:** Alternative A — Publication Handoff Execution Governance (II.6 Discovery / Specification).

---

## 1. Operational Objective

Implement **Publication Handoff Execution Governance** for Factory Integration.

Operational meaning of success:

> Given an II.5 readiness outcome with status **`HANDOFF_READY`**, Integration can deterministically decide **`HANDOFF_EXECUTED`**, **`HANDOFF_NOT_EXECUTED`**, or **`HANDOFF_EXECUTION_REJECTED`** — without mutating the readiness outcome, Publication Unit, or Factory, and without introducing Delivery, persistence, transport, Auth, Edge, API, Supabase, React, or operational Producer.

II.6-IMPL ends at **logical handoff-execution governance**.  
It does **not** perform Delivery, persistence, transport, authentication, exposure, or any later-channel capability.

Single constitutional question:

> Once II.5 yields **`HANDOFF_READY`**, under what Integration rules may the **logical, governed handoff act** be considered complete as **`HANDOFF_EXECUTED`** — without external side effects?

---

## 2. Exact Scope

### 2.1 In scope

| Area | Scope |
|------|--------|
| Execution decision | Apply II.6 Spec §§7–18 using II.5 `HANDOFF_READY` as sole entry oracle |
| States | Realize `HANDOFF_EXECUTED` / `HANDOFF_NOT_EXECUTED` / `HANDOFF_EXECUTION_REJECTED` |
| Fail-closed | Upstream not usable `HANDOFF_READY` / exceptions / incomplete ⇒ `HANDOFF_NOT_EXECUTED` |
| Non-mutation | Never mutate II.5 outcome, Publication Unit, candidate snapshot, or Factory |
| Continuity | Verify (do not recalculate) identity / integrity / provenance / unit / II.5 binding |
| Separation | `HANDOFF_EXECUTED` ≠ delivered ≠ persisted ≠ transported ≠ authenticated ≠ exposed ≠ consumed |
| Optional subordinate execution metadata | Decision metadata only; never payload/API/storage/event/queue (v1 recommendation: omit or minimal) |
| Tests / fixtures / status note | Prove Spec §25 matrix; keep II.2 / II.3 / II.4 / II.5 suites green |

### 2.2 Out of scope (hard)

Delivery; AuthN/AuthZ; Edge; BFF; APIs; Supabase; React / FCC / Marketplace / Projection; RLS; migrations; tables; persistence products; transport; queues; events; operational Producer; operational logging/telemetry/retention; Contract v2 redesign; semantic changes to `readModel/**` / `publicationEligibility/**` / `publicationUnit/**` / `handoffReadiness/**`; Factory mutation; II.7+.

### 2.3 Code placement principle (non-API)

When a future **II.6-IMPL execution** authorization is issued:

- Prefer a **new Integration sibling area** dedicated to handoff execution (parallel to `handoffReadiness/**`, not inside it).  
- **Consume** II.5 `evaluateHandoffReadiness` (or its official frozen outcome surface) as the **sole upstream readiness oracle**.  
- **Do not** import or call `validateReadModelV2`, `evaluatePublicationEligibility`, or `formPublicationUnit` as parallel execution gates.  
- **Do not** reimplement or alter II.2 / II.3 / II.4 / II.5 semantics.  
- **Do not** modify `src/factory/**`.  
- **Do not** introduce network, filesystem writes, timers, queues, or databases.

This plan names **module areas and responsibilities**, not classes, function signatures, JSON schemas, endpoints, or storage layouts.

---

## 3. Exact Consumption Point for `HANDOFF_READY`

### 3.1 Canonical consumption (mandatory)

II.6-IMPL SHALL consume **only** the official public II.5 seam:

```text
candidate snapshot (optional)
  → evaluateHandoffReadiness(candidate, …)     # II.5 official entry — SOLE ORACLE
  → if status === HANDOFF_READY
        → evaluate handoff execution (II.6)
    else
        → HANDOFF_NOT_EXECUTED
```

**Hard principle:** `evaluateHandoffReadiness()` remains the **only authorized oracle** for II.6.  
**No second decision gate** of II.2, II.3, II.4, or parallel II.5 logic may appear.

### 3.2 Rules

1. **`HANDOFF_READY` is the only positive entry** that can yield `HANDOFF_EXECUTED` or `HANDOFF_EXECUTION_REJECTED`.  
2. II.6 MUST NOT invent a readiness outcome.  
3. II.6 MUST NOT bypass II.5 by reconstructing readiness from raw snapshots, Publication Units, eligibility, or Contract v2 as a competing path.  
4. II.2 / II.3 / II.4 remain reachable **only indirectly** through II.5.  
5. II.6 MUST NOT recalculate, correct, or expand the meaning of `HANDOFF_READY`.

### 3.3 Inputs

| Input | Source | Notes |
|-------|--------|-------|
| Candidate snapshot (optional direct) | Caller | May be passed so II.6 can invoke II.5; must not be mutated |
| II.5 readiness outcome | `evaluateHandoffReadiness` | Preferred explicit input when already available |
| Options (`now`, test seams) | Caller | Test-only injection for II.5 oracle if needed; production uses official export |

### 3.4 Forbidden direct oracles

II.6 MUST NOT consume as an execution oracle:

- `formPublicationUnit(...)`  
- `evaluatePublicationEligibility(...)`  
- `validateReadModelV2(...)`  
- internal validators of II.2 / II.3 / II.4  
- private logic of II.5  

---

## 4. Output Contract (governance result — conceptual)

Aligned with II.6 Spec §18; mapped to II.5 field reality:

| Field (conceptual) | Meaning | Binding to current II.5 shape |
|--------------------|---------|-------------------------------|
| `status` | `HANDOFF_EXECUTED` \| `HANDOFF_NOT_EXECUTED` \| `HANDOFF_EXECUTION_REJECTED` | New II.6 field |
| `reasons` | Bounded, sanitized reason set | New II.6 catalog |
| `publicationUnit` | Bound unit when available; null when not usable | From II.5 `publicationUnit` (reference / immutable view) |
| `readinessOutcome` | View/binding of consumed II.5 outcome (not a rewrite) | Frozen view of full II.5 outcome (`status`, `reasons`, `publicationUnit`, `upstream`, `manifest`, fences) |
| Optional `executionMetadata` | Subordinate only; never an execution surface | **v1 recommendation: omit**, or minimal derived `{ snapshotId, status, reasons }` |
| `delivery` | Always `NOT_AUTHORIZED` | Fence |
| `persistence` | Always `NOT_AUTHORIZED` | Fence |
| `transport` | Always `NOT_AUTHORIZED` | Fence |
| `authentication` | Always `NOT_AUTHORIZED` | Fence |
| `exposure` | Always `NOT_AUTHORIZED` | Fence |
| `sideEffects` | Always empty | Fence |

Outcome object MUST be frozen (MUST), matching II.3 / II.4 / II.5 discipline.

---

## 5. States (canonical tokens)

Use **only** these state tokens (II.6 Spec §8):

| State | Meaning |
|-------|---------|
| **`HANDOFF_EXECUTED`** | Usable `HANDOFF_READY` + all II.6 §11 conditions; **no external action** |
| **`HANDOFF_NOT_EXECUTED`** | Upstream not usable `HANDOFF_READY`, evaluation incomplete/exception, ambiguity, or missing precondition |
| **`HANDOFF_EXECUTION_REJECTED`** | Valid `HANDOFF_READY`, but a **specific II.6** execution rule fails |

Do not introduce operational tokens (queued, shipped, delivered, exposed, authenticated-session, etc.).

---

## 6. Deterministic State Rules (Spec §§9–13 are authoritative)

| Condition | Outcome |
|-----------|---------|
| II.5 status ≠ `HANDOFF_READY` (including `NOT_HANDOFF_READY`, `HANDOFF_REJECTED`, missing/unusable outcome) | **`HANDOFF_NOT_EXECUTED`** |
| II.5/II.6 evaluation throws or returns unusable/incomplete result | **`HANDOFF_NOT_EXECUTED`** |
| Ambiguity / missing precondition / input not safely classifiable | **`HANDOFF_NOT_EXECUTED`** |
| `HANDOFF_READY` but identity / `snapshotId` continuity fails specifically | **`HANDOFF_EXECUTION_REJECTED`** |
| `HANDOFF_READY` but integrity continuity fails specifically | **`HANDOFF_EXECUTION_REJECTED`** |
| `HANDOFF_READY` but provenance / unit / II.5 binding continuity fails | **`HANDOFF_EXECUTION_REJECTED`** |
| `HANDOFF_READY` but mutation attempt / illicit Delivery·persistence·transport·Auth·exposure implication / metadata elevation | **`HANDOFF_EXECUTION_REJECTED`** |
| `HANDOFF_READY` + all Spec §11 conditions hold | **`HANDOFF_EXECUTED`** |

**Hard rule:** Upstream not `HANDOFF_READY` ⇒ never `HANDOFF_EXECUTED` and never `HANDOFF_EXECUTION_REJECTED`.

---

## 7. Fail-Closed Strategy

1. Unknown / incomplete / contradictory inputs ⇒ `HANDOFF_NOT_EXECUTED`.  
2. Upstream not `HANDOFF_READY` ⇒ `HANDOFF_NOT_EXECUTED`.  
3. Exceptions from consumed II.5 (or execution internals) ⇒ catch; sanitize; `HANDOFF_NOT_EXECUTED`; never escalate into Delivery.  
4. Ambiguity about identity / integrity / provenance / readiness binding ⇒ not `HANDOFF_EXECUTED`.  
5. No permissive defaults toward execution.  
6. Only **specific** II.6 violations against usable `HANDOFF_READY` ⇒ `HANDOFF_EXECUTION_REJECTED`.  
7. Any interpretation of `HANDOFF_EXECUTED` as Delivery / Auth / persistence / transport / exposure ⇒ forbidden and plan failure if introduced.

---

## 8. Continuity via II.5 Bindings (no parallel gates)

Spec §11.2 requires an intact II.2 → II.3 → II.4 → II.5 chain. Spec §6 forbids parallel II.2–II.4 gates.

**Resolution (binding for IMPL):**

- II.6 SHALL treat the **II.5 outcome bindings** as the authoritative evidence that the upstream chain completed.  
- II.6 SHALL **verify continuity** of those bindings (identity, integrity, provenance, Publication Unit, readiness outcome).  
- II.6 MUST **NOT** re-run `validateReadModelV2`, `evaluatePublicationEligibility`, or `formPublicationUnit` as competing oracles.  
- II.6 MUST **NOT** recalculate checksums, reconstruct snapshots/units, or reinterpret `HANDOFF_READY`.

---

## 9. Non-Mutation Principle

1. II.6 MUST NOT mutate the candidate snapshot.  
2. II.6 MUST NOT mutate the Publication Unit.  
3. II.6 MUST NOT mutate the II.5 readiness outcome.  
4. II.6 MUST NOT mutate II.5 manifest metadata.  
5. II.6 MUST NOT mutate identity, integrity, or provenance metadata.  
6. II.6 MUST NOT mutate Factory.  
7. Corrections require a **new** candidate through II.2 → II.3 → II.4 → II.5 → II.6.  
8. The II.6 outcome MUST be immutable (frozen) when realized.

---

## 10. Execution Metadata (subordinate only)

### 10.1 Allowed conceptual role (Spec §§16–17)

Optional metadata may at most note references to existing bindings (`snapshotId`), logical status, reason codes, contractual version markers, and internal non-operational notes.

### 10.2 Non-role

Must never become storage schema, event, queue message, Delivery payload, public API response, DB record, or substitute for Contract v2 / Publication Unit / II.5 outcome.

### 10.3 v1 recommendation

**Omit `executionMetadata` in the first II.6-IMPL**, or implement a minimal subordinate builder only if tests require it. Prefer proving governance status without elevating metadata surfaces.

---

## 11. Permanent Fences (Spec §19)

| Fence | Value |
|-------|--------|
| `delivery` | `NOT_AUTHORIZED` |
| `persistence` | `NOT_AUTHORIZED` |
| `transport` | `NOT_AUTHORIZED` |
| `authentication` | `NOT_AUTHORIZED` |
| `exposure` | `NOT_AUTHORIZED` |
| `sideEffects` | `[]` |
| Operational Producer | `NOT_AUTHORIZED` |
| II.7+ | `NOT_AUTHORIZED` |

---

## 12. Planned Modules (areas)

Sibling Integration area (name illustrative until IMPL auth):

```text
src/integration/handoffExecution/     # NEW under future II.6-IMPL authorization only
  constants.js        # HANDOFF_EXECUTED | HANDOFF_NOT_EXECUTED | HANDOFF_EXECUTION_REJECTED
                      # + delivery/persistence/transport/authentication/exposure NOT_AUTHORIZED
  reasons.js          # closed reason catalog + sanitize
  continuity.js       # verify II.5 bindings (no checksum recalc; no unit rebuild)
  evaluate.js         # execution orchestration; consume evaluateHandoffReadiness ONLY
  fixtures.js         # execution cases (reuse II.5 fixtures + synthetic reject cases)
  tests/
    runIi6HandoffExecutionValidation.js
```

Optional (deferrable):

```text
  executionMetadata.js   # OPTIONAL — subordinate notes only; no I/O; omit in v1 preferred
```

Documentary (after IMPL, not by this plan alone):

```text
docs/.../FACTORY_INTEGRATION_II_6_IMPL_STATUS.md
```

**Forbidden placements:** inside `src/factory/**`; rewriting `readModel/**`, `publicationEligibility/**`, `publicationUnit/**`, or `handoffReadiness/**` semantics.

---

## 13. Module Responsibilities

| Module area | Responsibility | Must not |
|-------------|----------------|----------|
| **constants** | Closed execution tokens; permanent fences | Invent Delivery / transported / exposed statuses |
| **reasons** | Bounded sanitized reasons | Leak secrets / paths / stacks |
| **continuity** | Verify existing II.5 / unit / identity / integrity / provenance bindings | Rebuild Contract v2; call II.2–II.4 gates; mutate inputs |
| **evaluate** | Consume II.5; apply Spec §§7–18; emit frozen outcome | Call `validateReadModelV2` / `evaluatePublicationEligibility` / `formPublicationUnit` as oracles; I/O |
| **executionMetadata** (optional) | Subordinate metadata only | Payload / API / storage / event / queue |
| **fixtures** | Synthetic execution cases | Real secrets / production data |
| **tests/runner** | Prove Spec §25 + immutability + fences | Require Auth / Edge / Supabase / React |
| **status note** | Record execution-governance-only closure | Open Delivery / II.7 |

---

## 14. Dependencies Allowed

| Dependency | Role |
|------------|------|
| **II.5 `handoffReadiness`** | **Sole readiness oracle** (`evaluateHandoffReadiness`, `HANDOFF_*`) |
| **II.5 fixtures (via handoffReadiness)** | Seed material |
| **II.6 Specification** | Normative execution rules |
| **II.1 trust law** | Documentary constraints preserved in tests/docs |

II.2 / II.3 / II.4 remain intact and are reached **only through II.5**.

---

## 15. Dependencies Forbidden

II.6-IMPL MUST NOT depend on or introduce:

- `validateReadModelV2` as a parallel gate  
- `evaluatePublicationEligibility` as a parallel gate  
- `formPublicationUnit` as a parallel execution gate  
- AuthN/AuthZ, Edge, BFF, HTTP servers, APIs/endpoints  
- Supabase / RLS / migrations / tables  
- React / FCC / Marketplace / Projection  
- Persistence products, filesystems as publication store, buckets  
- Transport, queues, events, brokers  
- Operational Producer / Factory crawlers  
- Operational logging/telemetry platforms  
- Any modification of `src/factory/**`  
- Semantic forks of II.2 / II.3 / II.4 / II.5  

---

## 16. Explicit Surface Confirmations

This Implementation Plan **does not** authorize or require:

| Surface | Status under this Plan |
|---------|------------------------|
| Web | **Not touched** |
| Supabase | **Not touched** |
| RLS | **Not touched** |
| Migrations | **Not created** |
| Tables | **Not modified** |
| APIs | **Not connected** |
| Deployments | **Not performed** |
| Persistence / transport | **Not introduced** |

---

## 17. Validation Runners Required

1. **Retain (regression):**  
   - `node src/integration/readModel/tests/runIi2ReadModelValidation.js`  
   - `node src/integration/publicationEligibility/tests/runIi3PublicationEligibilityValidation.js`  
   - `node src/integration/publicationUnit/tests/runIi4PublicationUnitValidation.js`  
   - `node src/integration/handoffReadiness/tests/runIi5HandoffReadinessValidation.js`

2. **Add (II.6):**  
   - `node src/integration/handoffExecution/tests/runIi6HandoffExecutionValidation.js` (name illustrative until IMPL)

---

## 18. Validation Strategy (Spec §25 minimum)

| Layer | Validation |
|-------|------------|
| Contract | II.2 suite remains PASS (unchanged) |
| Eligibility | II.3 suite remains PASS (unchanged) |
| Unit formation | II.4 suite remains PASS (unchanged) |
| Readiness | II.5 suite remains PASS (unchanged) |
| Execution | New II.6 suite PASS (Spec §25 items 1–22) |
| Trust / separation | Always fences `NOT_AUTHORIZED`; empty `sideEffects` |
| Immutability | Candidate / unit / II.5 outcome unchanged after execution evaluation |
| Continuity | `snapshotId` + integrity + provenance + unit + II.5 binding preserved on EXECUTED/REJECTED paths |
| Scope audit | Diff limited to `handoffExecution/**` + allowed status/plan docs |
| Oracle audit | Static import allowlist: II.5 public surface only as decision oracle |

Any `HANDOFF_EXECUTED` without upstream `HANDOFF_READY` is an automatic II.6-IMPL failure.  
Any second decision gate is an automatic II.6-IMPL failure.

---

## 19. Planned Flow

```text
Candidate Snapshot (optional)
        │
        ▼
II.5 evaluateHandoffReadiness     ◄── SOLE ORACLE
        │
        ├── status ≠ HANDOFF_READY ──► HANDOFF_NOT_EXECUTED
        │
        └── status = HANDOFF_READY
                 │
                 ▼
           II.6 continuity + Spec §11 checks
                 │
                 ├── specific rule fail ──► HANDOFF_EXECUTION_REJECTED
                 │
                 └── all hold ──► HANDOFF_EXECUTED
                       (delivery / persistence / transport /
                        authentication / exposure = NOT_AUTHORIZED;
                        sideEffects [])
```

---

## 20. Sequential Implementation Steps (after future II.6-IMPL auth)

| Step | Content | Gate |
|------|---------|------|
| **P0** | This Plan audited and committed | No code |
| **P1** | Explicit Director authorization titled **II.6-IMPL** | No code until then |
| **P2** | Scaffold `handoffExecution/**` + constants / reasons / fences | Compile-only |
| **P3** | Fail-closed `NOT_EXECUTED` paths (≠ READY / throw / incomplete) | Tests |
| **P4** | Continuity on `HANDOFF_READY` → `REJECTED` vs `EXECUTED` | Spec §25 |
| **P5** | Metadata: omit (preferred) or minimal subordinate builder | Spec §§16–17 |
| **P6** | Runner II.6 + regression II.2–II.5 ALL PASS | Technical DoD |
| **P7** | `FACTORY_INTEGRATION_II_6_IMPL_STATUS.md` + independent audit + commit | Block closure |

---

## 21. Backward Compatibility with II.2–II.5

| Block | Compatibility rule |
|-------|--------------------|
| II.1 | Trust / READ_ONLY / INTERNAL_OPS preserved; no UI-only security |
| II.2 | Unchanged; no parallel contract gate |
| II.3 | Unchanged; no parallel eligibility gate |
| II.4 | Unchanged; no parallel unit-formation gate |
| II.5 | Unchanged semantics; sole readiness oracle; `handoffExecution` remains NOT_AUTHORIZED inside II.5 |

---

## 22. Acceptance Criteria for This Plan Document

This Implementation Plan is complete when all are true:

1. It states a single clear objective: Publication Handoff Execution Governance.  
2. It binds evaluation to II.5 `evaluateHandoffReadiness` as the **sole oracle**.  
3. It forbids any second decision gate.  
4. It defines `HANDOFF_EXECUTED` / `HANDOFF_NOT_EXECUTED` / `HANDOFF_EXECUTION_REJECTED` deterministically.  
5. It separates logical execution from Delivery / persistence / transport / Auth / exposure.  
6. It resolves Spec §11.2 vs §6 via **continuity-through-II.5-bindings**.  
7. It maps Spec §18 fields to the current II.5 outcome shape.  
8. It recommends omitting or minimizing `executionMetadata` in v1.  
9. It lists allowed/forbidden modules and dependencies.  
10. It requires Spec §25 validation + II.2–II.5 regression.  
11. It confirms no Web / Supabase / RLS / migrations / tables / APIs / deployments.  
12. It does **not** authorize II.6-IMPL code, tests, or II.7.  
13. No implementation code is created by the act of writing this document.

---

## 23. Conditions Required Before II.6-IMPL Code

No II.6-IMPL may begin until **all** of the following are satisfied:

1. Explicit Director authorization titled **II.6-IMPL** (this Plan alone is insufficient).  
2. This Implementation Plan completed: **Plan → Independent Audit → Commit**.  
3. II.1–II.5 remain in force without contradictory amendment.  
4. II.2 / II.3 / II.4 / II.5 validation suites remain green (or formally approved successors).  
5. Implementation scope limited to logical handoff-execution governance.  
6. No Factory Runtime changes.  
7. Delivery / persistence / transport / authentication / exposure remain blocked unless a later block **outside II.6** expressly authorizes them.

### 23.1 Mandatory process reminder (Director)

```text
Specification (II.6)     — DONE
  → Independent Audit
  → Commit
Implementation Plan      — THIS DOCUMENT (pending audit + commit)
  → Independent Audit
  → Commit
  → Implementation authorization (II.6-IMPL)   ← separate Director act
  → Code / tests
  → Independent Audit
  → Commit
```

---

## 24. Architectural Risks

| Risk | Severity | Mitigation |
|------|----------|------------|
| Misreading `HANDOFF_EXECUTED` as Delivery / published / persisted / transported | Critical | Fences §11 + tests §18 |
| Second gate (II.2–II.4) | Critical | Sole-oracle rule; import allowlist audit |
| Elevating execution metadata to API/storage/event | High | Omit in v1; Spec §§16–17 |
| Mutating II.5 outcome / unit / snapshot | High | Non-mutation tests |
| Treating this Plan as II.6-IMPL approval | High | Explicit §23 gate |
| Premature II.7 / Delivery | Medium | Explicitly not opened |

---

## 25. Documentary Notes / Known Gaps Absorbed

| Item | Resolution under this Plan |
|------|----------------------------|
| Spec §21 historically marked Plan NOT AUTHORIZED | Superseded by Director authorization to create this Plan |
| Spec baseline HEAD `e4f9cc0` vs shared base `9c315ea` | Operational baseline is `9c315ea`; genealogy includes II.5–II.6 lineage |
| II.5/II.4 IMPL_STATUS lag (“PENDING COMMIT”) | Does not block this Plan; status docs may be refreshed later without semantic change |
| II.6 Discovery Report file may be absent locally | Spec cites Alternative A approved; Plan does not require rediscovery |
| Spec §18 vs II.5 field names | Binding table in §4 of this Plan is normative for IMPL |

---

## 26. Final Clause

This document authorizes **only** the existence of an audited Implementation Plan for II.6.  

It does **not** authorize:

- creation of `src/integration/handoffExecution/**`;  
- modification of II.2 / II.3 / II.4 / II.5 implementations;  
- Web, Supabase, RLS, migrations, tables, APIs, or deployments;  
- Delivery, persistence, transport, Auth, exposure, or II.7.

Until Director authorization titled **II.6-IMPL** is issued after this Plan is audited and committed, II.6 remains **plan-only**.

---

**END OF DOCUMENT**

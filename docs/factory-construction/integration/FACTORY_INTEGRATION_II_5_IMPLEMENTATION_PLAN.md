# FACTORY INTEGRATION II.5-IMPL
## IMPLEMENTATION PLAN

**Document ID:** `FACTORY_INTEGRATION_II_5_IMPLEMENTATION_PLAN.md`  
**Phase:** Factory Integration  
**Block:** II.5 — Implementation Plan  
**Document Type:** Technical Implementation Plan  
**Status:** PLAN ONLY — NO IMPLEMENTATION AUTHORIZED BY THIS DOCUMENT  

**Repository:** `C:\Users\cgrmo\Desktop\Reconciliation-Integration`  
**Branch baseline:** `reconciliation/factory-2.0` @ `c1edea4`  

**Normative sources:**

1. `FACTORY_INTEGRATION_II_5_DISCOVERY_REPORT.md`  
2. `FACTORY_INTEGRATION_II_5_HANDOFF_READINESS_GOVERNANCE_SPECIFICATION.md`  
3. `FACTORY_INTEGRATION_II_4_IMPL_STATUS.md`  
4. `src/integration/publicationUnit/**` (consume-only dependency)  
5. Supporting chain: II.1 / II.2 / II.3 / II.4 Specifications (unchanged)  

**Independent Audit of II.5 Specification:** APPROVED WITH OBSERVATIONS — absorbed below (canonical state rules = Spec §§12–13; state token = `HANDOFF_READY` only).

---

## 1. Operational Objective

Implement **Publication Handoff / Release Readiness Governance** for Factory Integration.

Operational meaning of success:

> Given a Publication Unit outcome from II.4, Integration can deterministically decide **`HANDOFF_READY`**, **`NOT_HANDOFF_READY`**, or **`HANDOFF_REJECTED`** — without mutating the Publication Unit, without executing handoff, and without introducing Delivery, persistence, transport, Auth, Edge, API, Supabase, React or operational Producer.

II.5-IMPL ends at **readiness governance**.  
It does **not** perform handoff execution or any later-channel capability.

---

## 2. Exact Scope

### 2.1 In scope

| Area | Scope |
|------|--------|
| Readiness decision | Apply II.5 Spec §§6–13 using II.4 `UNIT_FORMED` as sole entry oracle |
| States | Realize `HANDOFF_READY` / `NOT_HANDOFF_READY` / `HANDOFF_REJECTED` |
| Fail-closed | Unusable upstream / exceptions ⇒ `NOT_HANDOFF_READY` |
| Non-mutation | Never mutate Publication Unit, candidate snapshot, or Factory |
| Identity continuity | Preserve / verify existing `snapshotId` binding from II.4 |
| Integrity continuity | Preserve / verify existing integrity binding from II.4 |
| Separation | `HANDOFF_READY` ≠ handoff executed ≠ published ≠ persisted ≠ transported ≠ delivered ≠ authenticated ≠ exposed |
| Optional subordinate manifest metadata | Conceptual/decision metadata only (never payload/API/storage/event/queue) |
| Tests / fixtures / status note | Prove readiness paths; keep II.2 / II.3 / II.4 suites green |

### 2.2 Out of scope (hard)

Handoff execution, Delivery, AuthN/AuthZ, Edge, BFF, APIs, Supabase, React, persistence products, transport, queues, events, operational Producer, operational logging/telemetry/retention, Contract v2 redesign, semantic changes to `readModel/**` / `publicationEligibility/**` / `publicationUnit/**`, Factory mutation, II.6+.

### 2.3 Code placement principle (non-API)

When a future **II.5-IMPL execution** authorization is issued:

- Prefer a **new Integration sibling area** dedicated to handoff readiness (parallel to `publicationUnit/**`, not inside it).  
- **Consume** II.4 `formPublicationUnit` (or its official frozen outcome surface) as the sole upstream unit oracle.  
- **Do not** import or call `validateReadModelV2` as a parallel II.2 gate.  
- **Do not** reimplement or alter II.3 eligibility or II.4 unit-formation semantics.  
- **Do not** modify `src/factory/**`.  
- **Do not** introduce network, filesystem writes, timers, queues or databases.

This plan names **module areas and responsibilities**, not classes, function signatures, JSON schemas, endpoints or storage layouts.

---

## 3. Exact Consumption Point for `UNIT_FORMED`

### 3.1 Canonical consumption

II.5-IMPL SHALL consume the **II.4 formation outcome**:

```text
candidate snapshot
  → formPublicationUnit(candidate, …)     # II.4 official entry
  → if status === UNIT_FORMED
        → evaluate handoff readiness (II.5)
    else
        → NOT_HANDOFF_READY
```

### 3.2 Rules

1. **`UNIT_FORMED` is the only positive entry** to readiness evaluation that can yield `HANDOFF_READY` or `HANDOFF_REJECTED`.  
2. II.5 MUST NOT invent a Publication Unit.  
3. II.5 MUST NOT bypass II.4 by reconstructing unit formation from raw snapshots as a competing path.  
4. II.2 is consumed **only indirectly** (via II.3 inside II.4).  
5. II.3 is consumed **only indirectly** (via II.4).

### 3.3 Inputs

| Input | Source | Notes |
|-------|--------|-------|
| Candidate snapshot (optional direct) | Caller | May be passed so II.5 can invoke II.4; must not be mutated |
| II.4 formation outcome | `formPublicationUnit` | Preferred explicit input when already available |
| Options (`now`, test seams) | Caller | Test-only injection for II.4/II.5 oracles if needed; production uses official entries |

### 3.4 Outputs (governance result — conceptual shape)

| Field (conceptual) | Meaning |
|--------------------|---------|
| `status` | `HANDOFF_READY` \| `NOT_HANDOFF_READY` \| `HANDOFF_REJECTED` |
| `reasons` | Bounded, sanitized reason set |
| `unitRef` / identity continuity | Confirms `snapshotId` continuity when applicable |
| `integrity continuity` | Confirms existing integrity binding when applicable |
| `upstream` | View of II.4 status consumed (not a rewrite) |
| `delivery` | Always `NOT_AUTHORIZED` |
| `handoffExecution` | Always `NOT_AUTHORIZED` / not executed |
| `sideEffects` | Always empty |
| Optional `manifest` metadata | Subordinate only; never an execution surface |

Outcome object MUST be frozen (MUST), matching II.3/II.4 discipline.

---

## 4. States (canonical tokens)

Use **only** these state tokens (Spec audit observation absorbed):

| State | Meaning |
|-------|---------|
| **`HANDOFF_READY`** | `UNIT_FORMED` + all II.5 §10 conditions; **no external action** |
| **`NOT_HANDOFF_READY`** | Upstream not usable `UNIT_FORMED`, evaluation incomplete/exception, or missing prior chain |
| **`HANDOFF_REJECTED`** | Valid `UNIT_FORMED`, but a **specific II.5** readiness rule fails |

Do not introduce alternate tokens such as `RELEASE_READY` in code/docs of II.5-IMPL (title may say “Release Readiness”; runtime token remains `HANDOFF_READY`).

---

## 5. Deterministic State Rules (Spec §§12–13 are authoritative)

| Condition | Outcome |
|-----------|---------|
| II.4 status ≠ `UNIT_FORMED` (including `UNIT_NOT_FORMED`, `UNIT_REJECTED`, missing outcome) | **`NOT_HANDOFF_READY`** |
| II.4/II.5 evaluation throws or returns unusable result | **`NOT_HANDOFF_READY`** |
| `UNIT_FORMED` but `snapshotId` binding missing/incoherent | **`HANDOFF_REJECTED`** |
| `UNIT_FORMED` but integrity binding missing/stripped/replaced/forged | **`HANDOFF_REJECTED`** |
| `UNIT_FORMED` but mutation / illicit manifest elevation / Delivery-implication attempt detected in governance checks | **`HANDOFF_REJECTED`** |
| `UNIT_FORMED` + identity + integrity continuity + §10 all hold | **`HANDOFF_READY`** |

**Hard rule:** Upstream not `UNIT_FORMED` ⇒ never `HANDOFF_READY` and never `HANDOFF_REJECTED`.

---

## 6. Fail-Closed Strategy

1. Unknown / incomplete / contradictory inputs ⇒ `NOT_HANDOFF_READY`.  
2. Upstream not `UNIT_FORMED` ⇒ `NOT_HANDOFF_READY`.  
3. Exceptions from consumed II.4 (or readiness internals) ⇒ catch; sanitize; `NOT_HANDOFF_READY`; never rethrow into Delivery.  
4. Ambiguous identity/integrity on a formed unit ⇒ `HANDOFF_REJECTED` (per §§12–13), not success.  
5. Any path implying handoff execution / Delivery / Auth / persistence / transport ⇒ forbidden and plan failure if introduced.

---

## 7. Immutability of Publication Unit

1. II.5 MUST NOT mutate the II.4 `publicationUnit` object or its bound snapshot.  
2. II.5 MUST NOT mutate Factory.  
3. Readiness outcome MUST be a new frozen governance object (MUST freeze).  
4. Corrections require a **new** candidate through II.2 → II.3 → II.4 → II.5.  
5. Tests MUST prove JSON equality (or equivalent) of unit/snapshot before vs after readiness evaluation.

---

## 8. Conservation of `snapshotId`

1. On `HANDOFF_READY` / `HANDOFF_REJECTED`, readiness MUST verify continuity of the existing II.4 `snapshotId` binding.  
2. II.5 MUST NOT invent a parallel identity scheme.  
3. Missing/blank/`trim`-empty identity on a formed unit ⇒ `HANDOFF_REJECTED`.  
4. `snapshotId` values are consumed, not redefined as Contract v2 fields.

---

## 9. Conservation of Integrity Metadata

1. On `HANDOFF_READY` / `HANDOFF_REJECTED`, readiness MUST verify continuity of the existing II.4 integrity binding (checksum present/coherent).  
2. II.5 MUST NOT strip, replace, forge or “repair” integrity to force readiness.  
3. Missing/invalid integrity on a formed unit ⇒ `HANDOFF_REJECTED`.  
4. No reinterpretation of Contract v2 integrity algorithm.

---

## 10. Planned Modules (areas)

Sibling Integration area (name illustrative only):

```text
src/integration/handoffReadiness/     # NEW under future II.5-IMPL authorization only
  constants          # HANDOFF_* tokens; delivery/handoffExecution NOT_AUTHORIZED
  reasons            # closed reason catalog + sanitize
  continuity         # snapshotId + integrity continuity checks (consume II.4 bindings)
  evaluate           # readiness orchestration; consume formPublicationUnit
  fixtures           # readiness cases (reuse II.4 fixtures + synthetic reject cases)
  tests/runner       # II.5 acceptance suite
```

Optional thin subordinate metadata helper (still not a transport/storage module):

```text
  manifestMetadata   # OPTIONAL — decision-subordinate notes only; no I/O
```

Documentary:

```text
docs/.../FACTORY_INTEGRATION_II_5_IMPL_STATUS.md
```

**Forbidden placements:** inside `src/factory/**`; rewriting `readModel/**`, `publicationEligibility/**`, or `publicationUnit/**` semantics.

---

## 11. Module Responsibilities

| Module area | Responsibility | Must not |
|-------------|----------------|----------|
| **constants** | Closed `HANDOFF_*` tokens; `delivery` / `handoffExecution` = `NOT_AUTHORIZED` | Invent Delivery/handoff-executed statuses |
| **reasons** | Bounded sanitized reasons | Leak secrets/paths/stacks |
| **continuity** | Verify existing `snapshotId` + integrity bindings | Rebuild Contract v2; mutate unit |
| **evaluate** | Consume II.4; apply §§10–13; emit frozen outcome | Call `validateReadModelV2`; execute handoff; I/O |
| **manifestMetadata** (optional) | Subordinate metadata only | Payload/API/storage/event/queue |
| **fixtures** | Synthetic readiness cases | Real secrets / production data |
| **tests/runner** | Prove states, immutability, no Delivery | Require Auth/Edge/Supabase/React |
| **status note** | Record readiness-only closure | Open II.6 |

---

## 12. Dependencies Allowed

| Dependency | Role |
|------------|------|
| **II.4 `publicationUnit`** | Sole Publication Unit oracle (`formPublicationUnit`, `UNIT_*`) |
| **II.4 fixtures (via publicationUnit/eligibility)** | Seed material |
| **II.5 Specification** | Normative readiness rules |
| **II.1 trust law** | Documentary constraints preserved in tests/docs |

II.2 / II.3 remain intact and are reached **only through II.4**.

---

## 13. Dependencies Forbidden

II.5-IMPL MUST NOT depend on or introduce:

- `validateReadModelV2` as a parallel gate  
- AuthN/AuthZ, Edge, BFF, HTTP servers, APIs/endpoints  
- Supabase / React / FCC / Marketplace  
- Persistence products, filesystems as publication store, buckets, tables  
- Transport, queues, events, brokers  
- Operational Producer / Factory crawlers  
- Operational logging/telemetry platforms  
- Any modification of `src/factory/**`

---

## 14. Validation Runners Required

1. **Retain (regression):**  
   - `node src/integration/readModel/tests/runIi2ReadModelValidation.js`  
   - `node src/integration/publicationEligibility/tests/runIi3PublicationEligibilityValidation.js`  
   - `node src/integration/publicationUnit/tests/runIi4PublicationUnitValidation.js`

2. **Add (II.5):**  
   - `node src/integration/handoffReadiness/tests/<ii5-runner>.js` (name illustrative)

---

## 15. Validation Strategy

| Layer | Validation |
|-------|------------|
| Contract | II.2 suite remains PASS (unchanged) |
| Eligibility | II.3 suite remains PASS (unchanged) |
| Unit formation | II.4 suite remains PASS (unchanged) |
| Readiness | New II.5 suite PASS |
| Trust / separation | Always `delivery: NOT_AUTHORIZED`; handoff execution not authorized; empty `sideEffects` |
| Immutability | Unit/snapshot unchanged after readiness |
| Continuity | `snapshotId` + integrity preserved on ready/rejected-formed paths |
| Scope audit | Diff limited to `handoffReadiness/**` + allowed status doc |

Any `HANDOFF_READY` without upstream `UNIT_FORMED` is an automatic II.5-IMPL failure.

---

## 16. Planned Flow

```text
Candidate Snapshot
        │
        ▼
II.4 formPublicationUnit
        │
        ├── status ≠ UNIT_FORMED ──► NOT_HANDOFF_READY
        │
        └── status = UNIT_FORMED
                 │
                 ▼
           II.5 continuity + §10 checks
                 │
                 ├── continuity/rule fail ──► HANDOFF_REJECTED
                 │
                 └── all hold ──► HANDOFF_READY
                       (still delivery NOT_AUTHORIZED;
                        handoffExecution NOT_AUTHORIZED;
                        sideEffects [])
```

---

## 17. Backward Compatibility with II.2–II.4

| Block | Compatibility rule |
|-------|--------------------|
| **II.2** | Untouched; no parallel validator; suite remains 31/31 (or approved successor) |
| **II.3** | Untouched; eligibility semantics unchanged; suite remains 16/16 |
| **II.4** | Untouched semantically; consumed only; suite remains 19/19 |
| **Publication Unit** | Not mutated; not reinterpreted; not replaced by a manifest |
| **Delivery** | Remains blocked |
| **Producer** | Remains blocked |

---

## 18. Technical Risks

| Risk | Severity | Mitigation |
|------|----------|------------|
| Equating `HANDOFF_READY` with handoff executed / delivered | Critical | Hard fields + tests |
| Bypassing II.4 / forking unit formation | High | Consume `formPublicationUnit` only |
| Smuggling persistence/transport via “manifest” | Critical | Manifest optional + non-I/O; prohibitions tested by absence |
| Mutating Publication Unit | High | Immutability tests |
| Weakening II.2/II.3 indirectly | High | Regression suites mandatory |
| Scope creep into Delivery/Auth/Producer | Critical | Hard exclusions; diff audit |
| Premature II.6 | Medium | Plan stops at readiness |

---

## 19. Express Confirmations (Plan Validation)

This plan expressly confirms:

- **II.2 remains intact.**  
- **II.3 remains intact.**  
- **II.4 remains intact.**  
- **Publication Unit is not mutated** by II.5.  
- **Delivery remains blocked.**  
- **Producer remains blocked.**  
- **The plan is implementable** as a sibling consume-only readiness layer.  
- **II.5-IMPL remains NOT AUTHORIZED** by this document alone.

---

## 20. Acceptance Criteria for Future II.5-IMPL

II.5-IMPL may be declared complete only when all are true:

1. Readiness decision artifact exists and is deterministic.  
2. `HANDOFF_READY` is impossible without II.4 `UNIT_FORMED`.  
3. Spec §§12–13 state rules are enforced and tested.  
4. Publication Unit / snapshot immutability proven.  
5. `snapshotId` and integrity continuity proven on formed paths.  
6. Always `delivery: NOT_AUTHORIZED`; handoff execution not authorized; `sideEffects` empty.  
7. No handoff execution, Delivery, Auth, Edge, API, Supabase, React, persistence, transport, or operational Producer introduced.  
8. II.2, II.3, and II.4 suites remain PASS.  
9. New II.5 suite PASS.  
10. Diff scope audit clean.  
11. Status note records readiness-only closure.  
12. Director closure acknowledgment for readiness-only completion.

---

## 21. Recommended Implementation Order (future execution only)

1. Freeze inputs (II.5 Spec + green II.2/II.3/II.4).  
2. Introduce sibling `handoffReadiness` area (constants + evaluate consuming II.4).  
3. Enforce continuity checks (`snapshotId`, integrity).  
4. Map §§12–13 into deterministic outcomes.  
5. Add fixtures + II.5 runner.  
6. Prove always Delivery/handoff-execution NOT_AUTHORIZED and empty side effects.  
7. Re-run II.2 + II.3 + II.4 + II.5 suites.  
8. Write II.5-IMPL status note.  
9. **Stop** — no handoff execution, Delivery, Producer, Auth, Edge, persistence, transport, II.6.

---

## 22. Prerequisites to Authorize II.5-IMPL Execution

1. This Implementation Plan independently audited and **committed**.  
2. Explicit Director authorization titled **II.5-IMPL** (execution warrant).  
3. HEAD on `reconciliation/factory-2.0` with II.5 Specification present (`c1edea4` lineage or successor).  
4. II.2 / II.3 / II.4 suites green.  
5. No contradictory amendments to II.1–II.5 Spec.  
6. Working-tree policy: no Factory / React / Supabase / Edge / Auth mixed into the change set.  
7. Process:

```text
Specification → Independent Audit → Commit
  → Implementation Plan → Independent Audit → Commit
  → Implementation authorization
```

---

## 23. Plan Status

- **II.5 Implementation Plan:** CREATED — PLAN ONLY  
- **II.5-IMPL code execution:** **NOT AUTHORIZED** by this document  
- **Handoff execution / Delivery / Producer:** **NOT AUTHORIZED**  
- **Next required act:** Independent Audit of this plan → Commit (when Director authorizes) → separate II.5-IMPL execution authorization  

---

## 24. Final Clause

This document plans how to implement handoff / release **readiness** governance.  
It does not implement it.  
It does not authorize handoff execution, Delivery, Auth, persistence, transport, operational Producer or II.6.

No work claiming II.5-IMPL compliance may proceed from this plan without a separate Director **implementation authorization**.

---

**END OF DOCUMENT**

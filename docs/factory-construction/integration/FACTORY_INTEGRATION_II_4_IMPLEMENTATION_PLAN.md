# FACTORY INTEGRATION II.4-IMPL
## IMPLEMENTATION PLAN

**Document ID:** `FACTORY_INTEGRATION_II_4_IMPLEMENTATION_PLAN.md`  
**Phase:** Factory Integration  
**Block:** II.4 — Implementation Plan  
**Document Type:** Technical Implementation Plan  
**Status:** PLAN ONLY — NO IMPLEMENTATION AUTHORIZED BY THIS DOCUMENT  

**Repository:** `C:\Users\cgrmo\Desktop\Reconciliation-Integration`  
**Branch baseline:** `reconciliation/factory-2.0` @ `f7ae3fe`  

**Normative sources:**

1. `FACTORY_INTEGRATION_II_1_SECURITY_BOUNDARY_SPECIFICATION.md`  
2. `FACTORY_INTEGRATION_II_2_READ_MODEL_CONTRACT_V2_SPECIFICATION.md`  
3. `FACTORY_INTEGRATION_II_3_SPECIFICATION.md`  
4. `FACTORY_INTEGRATION_II_3_IMPL_STATUS.md`  
5. `FACTORY_INTEGRATION_II_4_DISCOVERY_REPORT.md`  
6. `FACTORY_INTEGRATION_II_4_PUBLICATION_UNIT_GOVERNANCE_SPECIFICATION.md`  

**Independent Audit of II.4 Specification:** APPROVED WITH OBSERVATIONS — observations absorbed below where they affect planning.

---

## 1. Operational Objective

Implement **Publication Unit Governance** for Factory Integration.

Operational meaning of success:

> Given a candidate Read Model snapshot, Integration can deterministically form or refuse a **Publication Unit** only when II.2 validation PASS and II.3 decision `ELIGIBLE` hold for that same complete atomic candidate — without persisting, transporting, delivering, authenticating or exposing the unit, without mutating Factory, and without deploying an operational Producer.

II.4-IMPL ends at **unit formation governance** (`UNIT_FORMED` / `UNIT_NOT_FORMED` / `UNIT_REJECTED` as conceptual outcomes realized in code under a future execution authorization).  
It does **not** perform Delivery, Auth, Edge, storage productization, transport, operational observability or Producer assembly.

---

## 2. Exact Scope

### 2.1 In scope

| Area | Scope |
|------|--------|
| Publication Unit formation | Apply II.4 §9 conditions using II.2 + II.3 oracles only |
| Conceptual states | Realize `UNIT_FORMED`, `UNIT_NOT_FORMED`, `UNIT_REJECTED` with clear distinction rules (see §2.4) |
| Atomicity | Whole eligible snapshot → one unit, or no unit |
| Immutability | No mutation of candidate / Factory to force formation; frozen outcome object |
| Identity | Bind unit identity to existing II.2 `snapshotId` (no new contract fields) |
| Integrity binding | Preserve association to II.2 integrity metadata already on the eligible snapshot |
| Separation | `UNIT_FORMED` ≠ published ≠ persisted ≠ delivered ≠ authenticated ≠ exposed |
| Tests / fixtures | Positive, negative and boundary cases; keep II.2 and II.3 suites green |
| Status note | Documentary handoff that II.4-IMPL closed unit governance only |

### 2.2 Out of scope (hard)

See §15 and §19. Includes Delivery, Auth, Edge, API, Supabase, React, persistence products, transport, operational Producer, operational logging/telemetry/retention, Contract v2 redesign, Factory mutation, II.5.

### 2.3 Code placement principle (non-API)

When a future **II.4-IMPL execution** authorization is issued:

- Prefer a **new Integration sibling area** dedicated to Publication Unit governance (parallel to `publicationEligibility/**`, not inside it).  
- **Consume** II.3 `evaluatePublicationEligibility` (or its official surface) and II.2 validation outcomes **without modifying** `readModel/**` or eligibility semantics.  
- **Do not** change Contract v2 schema/vocabulary.  
- **Do not** modify `src/factory/**`.  
- **Do not** introduce network, filesystem writes, timers, queues or databases.

This plan names **module areas and responsibilities**, not classes, function signatures, JSON schemas, endpoints or storage layouts.

### 2.4 Clarification from Specification audit (states)

| Outcome | When to use |
|---------|-------------|
| **`UNIT_NOT_FORMED`** | Default / no formation attempt path, or eligibility never reached `ELIGIBLE` and formation was not separately rejected as an invalid attempt |
| **`UNIT_REJECTED`** | Formation was evaluated and refused under II.4 rejection / fail-closed rules (including `NOT_ELIGIBLE`, non-atomic candidate, integrity stripped, mutation attempt, multi-snapshot mix, etc.) |
| **`UNIT_FORMED`** | All II.4 §9 conditions hold |

`NOT_ELIGIBLE` MUST never yield `UNIT_FORMED`. Prefer `UNIT_REJECTED` when the formation entrypoint was invoked and refused; `UNIT_NOT_FORMED` remains valid as the conceptual default before invocation. The future runner MUST assert both never authorize Delivery.

---

## 3. Dependencies

| Dependency | Role in II.4-IMPL |
|------------|-------------------|
| **II.1** | Trust law: Factory truth, `READ_ONLY`, `INTERNAL_OPS`, no UI-only security |
| **II.2 Contract + II.2-IMPL** | Sole contract/integrity gate; `snapshotId`, ownership, checksum semantics |
| **II.3 Spec + II.3-IMPL** | Sole eligibility oracle (`ELIGIBLE` / `NOT_ELIGIBLE`); `delivery: NOT_AUTHORIZED` |
| **II.4 Specification** | Unit governance rules, atomicity, immutability, identity, fail-closed |
| **Existing fixtures** | Reuse II.2 / II.3 fixtures as seeds; add only unit-governance boundary fixtures if needed |
| **Non-dependencies** | Auth, Edge, Supabase, React, FCC, Marketplace, Factory Runtime execution, persistence, transport |

II.4-IMPL MUST NOT weaken, fork or reimplement II.2 validation or II.3 eligibility.

---

## 4. Planned Modules (areas)

Sibling Integration area (name illustrative only at plan level):

```text
src/integration/publicationUnit/   # NEW area under future II.4-IMPL authorization only
  constants          # UNIT_* outcomes; delivery remains NOT_AUTHORIZED
  identity           # bind to existing snapshotId; no new contract fields
  formation          # consume II.3 (+ II.2 indirectly); apply §9 conditions
  immutability       # guard against candidate mutation / freeze outcome
  atomicity          # refuse non-complete units (may reuse II.3 atomic checks by consumption)
  fixtures           # unit formation cases
  tests/runner       # II.4 acceptance suite
```

Plus documentary:

```text
docs/.../FACTORY_INTEGRATION_II_4_IMPL_STATUS.md   # handoff only, under IMPL execution
```

**Forbidden placements:** inside `src/factory/**`; rewriting `readModel/**`; rewriting eligibility decision meanings inside `publicationEligibility/**` (consumption only; no semantic fork).

---

## 5. Planned Flow

```text
Candidate Snapshot
        │
        ▼
II.2 validation PASS          ← sole contract oracle (consumed, not forked)
        │
        ▼
II.3 decision = ELIGIBLE      ← sole eligibility oracle (consumed, not altered)
        │
        ▼
II.4 Publication Unit formation
        │
        ├── conditions fail → UNIT_REJECTED or UNIT_NOT_FORMED
        │
        └── all §9 conditions hold → UNIT_FORMED
              (still delivery = NOT_AUTHORIZED; sideEffects empty)
```

Lawful progression only. No shortcut that skips II.2 or II.3.

---

## 6. Module Responsibilities

| Module area | Responsibility | Must not |
|-------------|----------------|----------|
| **constants** | Closed set of unit outcomes; `delivery: NOT_AUTHORIZED` constant | Invent Delivery statuses |
| **identity** | Derive unit identity from II.2 `snapshotId` of the eligible snapshot | Invent parallel contract identity fields |
| **formation** | Orchestrate consumption of II.3 eligibility; apply II.4 §9; emit unit outcome | Re-validate Contract v2 as a competing gate; call network/DB |
| **atomicity** | Ensure one complete snapshot unit only | Authorize partial fragments |
| **immutability** | Ensure candidate unchanged by formation; freeze returned governance object | Mutate Factory or candidate to “fix” formation |
| **fixtures** | Deterministic synthetic cases | Real secrets / production data |
| **tests/runner** | Prove positive/negative/boundary + no Delivery/side effects | Require Auth/Edge/Supabase/React |
| **status note** | Record eligibility→unit closure; Delivery still blocked | Open II.5 |

---

## 7. Required Validations

1. II.2 suite remains PASS (regression).  
2. II.3 suite remains PASS (regression).  
3. Unit forms only if II.3 reports `ELIGIBLE` for the same candidate.  
4. Unit refuses if II.3 reports `NOT_ELIGIBLE`.  
5. Unit refuses non-atomic candidates.  
6. Unit identity equals / derives from `snapshotId` without new contract fields.  
7. Integrity metadata association is not stripped or replaced by formation.  
8. Candidate JSON equality before/after formation (immutability).  
9. `UNIT_FORMED` always pairs with `delivery: NOT_AUTHORIZED` and empty side effects.  
10. Unexpected exceptions from consumed gates ⇒ fail-closed refusal (no throw escape to Delivery).  
11. Diff scope audit: no Factory / Auth / Edge / Supabase / React / readModel semantic changes.

---

## 8. Fail-Closed Strategy

1. Unknown / incomplete / contradictory inputs ⇒ refuse unit.  
2. II.2 failure (surfaced via II.3 `NOT_ELIGIBLE` or equivalent consumption) ⇒ refuse unit.  
3. II.3 `NOT_ELIGIBLE` ⇒ never `UNIT_FORMED`.  
4. Thrown exceptions from consumed oracles ⇒ catch and refuse unit; sanitize messages; no stacks/secrets/paths.  
5. Ambiguous atomicity ⇒ refuse unit.  
6. Any path that would imply Delivery/Auth/persistence ⇒ forbidden and treated as plan failure if introduced.

---

## 9. Atomicity Strategy

1. Evaluate and form against **one** complete candidate snapshot only.  
2. Arrays, nulls, fragment markers, multi-snapshot mixes ⇒ refuse.  
3. No partial unit content assembly.  
4. Atomicity is **governance**, not queues/locks/transactions/object stores.

---

## 10. Immutability Strategy

1. Formation MUST NOT mutate the input candidate.  
2. Formation MUST NOT mutate Factory.  
3. Returned governance result SHOULD be frozen / defensively copied so callers cannot mutate the decision object into a Delivery claim.  
4. Corrections require a **new** candidate through II.2 → II.3 → II.4 again.

---

## 11. Positive Cases

1. Healthy II.2-valid snapshot → II.3 `ELIGIBLE` → `UNIT_FORMED`.  
2. Stale-with-`SNAPSHOT_STALE` (II.3 eligible) → `UNIT_FORMED`.  
3. `UNIT_FORMED` carries identity derived from `snapshotId`.  
4. `UNIT_FORMED` retains integrity association from the eligible snapshot.  
5. `UNIT_FORMED` still has Delivery `NOT_AUTHORIZED` and empty side effects.  
6. Candidate unchanged after formation.

---

## 12. Negative Cases

1. Bad checksum / II.2 invalid → II.3 `NOT_ELIGIBLE` → no `UNIT_FORMED` (`UNIT_REJECTED`).  
2. Stale without `SNAPSHOT_STALE` → refuse.  
3. Ownership/registry incoherence → refuse.  
4. Unknown / prohibited fields → refuse.  
5. Atomic fragment / array / null → refuse.  
6. II.3 gate throw (injected) → refuse (fail-closed).  
7. Attempted post-eligibility candidate mutation before/during formation → refuse.  
8. Attempt to form without consuming II.3 / by bypassing eligibility → refuse (and treat as implementation defect if such API exists).

---

## 13. Boundary / Limit Cases

1. `ELIGIBLE` but integrity association stripped before formation → `UNIT_REJECTED`.  
2. Two different eligible snapshots → two distinct unit identities (no collision).  
3. Re-running formation on the same unchanged eligible candidate → deterministic same outcome (idempotent governance result; still not persistence).  
4. `UNIT_NOT_FORMED` default vs `UNIT_REJECTED` after explicit refused attempt — both never Delivery.  
5. Reasons/messages sanitized (no secrets/paths/stacks).

---

## 14. Risks

| Risk | Severity | Mitigation |
|------|----------|------------|
| Scope creep into Delivery/Auth/Edge/Supabase | Critical | Hard exclusions; diff audit; always `NOT_AUTHORIZED` |
| Equating `UNIT_FORMED` with published/persisted | Critical | Tests + status wording |
| Forking II.2 or weakening II.3 | High | Consume only; suites must stay green |
| Smuggling persistence under “unit object” | High | In-memory governance result only; no I/O |
| Smuggling operational Producer | High | Forbidden; no Factory crawlers |
| Ambiguous `UNIT_NOT_FORMED` / `UNIT_REJECTED` | Medium | §2.4 rules + runner assertions |
| Identity inventing new contract fields | Medium | Bind to `snapshotId` only |
| Premature II.5 | Medium | Plan stops at unit governance |

---

## 15. Exclusions

Forbidden under this plan and under any II.4-IMPL executed from it unless a **separate** Director authorization says otherwise:

- Operational Producer / live observation runners  
- Delivery / authenticated GET  
- AuthN / AuthZ  
- Edge Functions / BFF  
- APIs, endpoints, RPC servers  
- Supabase reads/writes  
- React / FCC / Marketplace  
- Persistence products (DB, buckets, filesystem publication stores)  
- Transport / queues / events / brokers  
- Operational logging, telemetry, retention platforms  
- Contract v2 redesign; semantic edits to `readModel/**`  
- Semantic fork of `publicationEligibility/**`  
- Factory Runtime / `src/factory/**` changes  
- JSON schemas / OpenAPI as II.4 deliverables  
- II.5 and later  
- Any code authored under **this planning document alone**

---

## 16. Acceptance Criteria

II.4-IMPL may be declared complete only when all are true:

1. Publication Unit formation artifact exists and is deterministic.  
2. `UNIT_FORMED` is impossible without II.3 `ELIGIBLE` (and thus II.2 PASS).  
3. Atomicity, immutability and identity (`snapshotId`) rules are enforced.  
4. `UNIT_FORMED` ≠ published/persisted/delivered/authenticated/exposed.  
5. Always `delivery: NOT_AUTHORIZED` and empty side effects on unit outcomes.  
6. No operational Producer, Delivery, Auth, Edge, API, Supabase, React, persistence or transport introduced.  
7. Contract v2 unchanged; `readModel/**` not semantically forked.  
8. II.2 suite PASS; II.3 suite PASS; new II.4 suite PASS.  
9. Diff scope audit clean.  
10. Status note records unit-governance-only closure.  
11. Director closure acknowledgment for II.4-IMPL eligibility-to-unit only.

---

## 17. Runner Validations (future II.4 suite)

The future runner (name illustrative) MUST cover at least:

| # | Assertion |
|---|-----------|
| 1 | Healthy → `UNIT_FORMED` |
| 2 | Stale+`SNAPSHOT_STALE` → `UNIT_FORMED` |
| 3 | II.2/II.3 invalid paths → not `UNIT_FORMED` |
| 4 | Fragment/array/null → refuse |
| 5 | Identity bound to `snapshotId` |
| 6 | Integrity association preserved (not stripped by formation) |
| 7 | Candidate immutability |
| 8 | Gate/oracle exception → refuse (fail-closed) |
| 9 | `delivery === NOT_AUTHORIZED` |
| 10 | `sideEffects` empty |
| 11 | No filesystem/network/DB side effects in unit scope |
| 12 | II.2 regression invoked or required green in handoff |
| 13 | II.3 regression invoked or required green in handoff |

Also retain mandatory external commands in handoff:

```text
node src/integration/readModel/tests/runIi2ReadModelValidation.js
node src/integration/publicationEligibility/tests/runIi3PublicationEligibilityValidation.js
node src/integration/publicationUnit/tests/<ii4-runner>.js   # when authorized and created
```

---

## 18. Constitutional Restrictions

1. Factory remains sole operational source of truth.  
2. Integration remains `READ_ONLY`.  
3. Classification remains `INTERNAL_OPS`.  
4. II.2 is the sole contract-validation gate.  
5. II.3 is the sole eligibility vocabulary/oracle.  
6. II.4 MUST NOT create a parallel validator.  
7. II.4 MUST NOT alter `ELIGIBLE` / `NOT_ELIGIBLE` meanings.  
8. II.4 MUST NOT redefine Contract v2.  
9. Publication Unit MUST NOT be treated as a storage object.  
10. No UI-only security.  
11. No public static snapshot as final architecture.  
12. Delivery remains blocked for the entire II.4 block.

---

## 19. Remains Expressly NOT_AUTHORIZED

- Delivery / authenticated boundary  
- AuthN / AuthZ  
- Edge / BFF  
- APIs / endpoints  
- Supabase  
- React / FCC / Marketplace  
- Operational Producer  
- Persistence products  
- Transport / queues / events  
- Operational logging / telemetry / retention  
- II.4-IMPL **execution** (until Director implementation authorization)  
- II.5 and later  

---

## 20. Prerequisites to Authorize II.4-IMPL Execution

All must be true before any code is written:

1. This Implementation Plan is independently audited and **committed** under Director authorization.  
2. Explicit Director authorization titled **II.4-IMPL** (execution warrant) — this plan alone is insufficient.  
3. HEAD on `reconciliation/factory-2.0` with II.4 Specification commit present (`f7ae3fe` lineage or successor).  
4. II.2 suite green (31/31 or approved successor).  
5. II.3 suite green (16/16 or approved successor).  
6. II.1 / II.2 / II.3 / II.4 Specification remain without contradictory amendment.  
7. Working-tree policy: no Factory / React / Supabase / Edge / Auth mixed into the II.4-IMPL change set.  
8. Agreement: Contract v2 frozen; eligibility semantics frozen; Delivery remains blocked.  
9. Mandatory process step satisfied:

```text
Specification → Independent Audit → Commit
  → Implementation Plan → Independent Audit → Commit
  → Implementation authorization   ← required next after this plan’s audit+commit
```

---

## 21. Recommended Implementation Order (future execution only)

1. Freeze inputs (specs + green II.2/II.3).  
2. Introduce sibling `publicationUnit` area skeleton (constants + formation consumption of II.3).  
3. Enforce identity (`snapshotId`), atomicity, immutability, integrity association.  
4. Map §2.4 state rules into deterministic outcomes.  
5. Add fixtures and II.4 runner.  
6. Prove always `NOT_AUTHORIZED` Delivery / empty side effects.  
7. Re-run II.2 + II.3 + II.4 suites.  
8. Write II.4-IMPL status note.  
9. **Stop** — no Delivery, Producer, Auth, Edge, persistence, transport, II.5.

---

## 22. Plan Status

- **II.4 Implementation Plan:** CREATED — PLAN ONLY  
- **II.4-IMPL code execution:** NOT AUTHORIZED by this document  
- **Next required act:** Independent Audit of this plan → Commit (when Director authorizes) → separate II.4-IMPL execution authorization  

---

## 23. Final Clause

This document plans how to implement Publication Unit **governance**.  
It does not implement it.  
It does not authorize Delivery, Auth, persistence, transport, operational Producer or II.5.

No work claiming II.4-IMPL compliance may proceed from this plan without a separate Director **implementation authorization**.

---

**END OF DOCUMENT**

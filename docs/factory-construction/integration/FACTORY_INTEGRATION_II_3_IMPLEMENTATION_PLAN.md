# FACTORY INTEGRATION II.3-IMPL
## IMPLEMENTATION PLAN

**Document ID:** `FACTORY_INTEGRATION_II_3_IMPLEMENTATION_PLAN.md`  
**Phase:** Factory Integration  
**Block:** II.3-IMPL  
**Document Type:** Technical Implementation Plan  
**Status:** PLAN ONLY — NO IMPLEMENTATION AUTHORIZED BY THIS DOCUMENT  

**Repository:** `C:\Users\cgrmo\Desktop\Reconciliation-Integration`  
**Branch baseline:** `reconciliation/factory-2.0` @ `b963b34`  

**Normative sources:**

1. `FACTORY_INTEGRATION_II_1_SECURITY_BOUNDARY_SPECIFICATION.md`  
2. `FACTORY_INTEGRATION_II_2_READ_MODEL_CONTRACT_V2_SPECIFICATION.md`  
3. `FACTORY_INTEGRATION_II_3_SPECIFICATION.md`  

---

## 1. Operational Objective

Implement **publication eligibility governance** for Factory Integration Read Model snapshots.

Operational meaning of success:

> Given a candidate Read Model snapshot, Integration can deterministically decide **ELIGIBLE** or **NOT ELIGIBLE** for publication, using the II.2 fail-closed gate under II.1 trust law, without delivering the snapshot to any consumer channel and without mutating Factory.

II.3-IMPL ends at **eligibility**.  
It does **not** perform authenticated delivery, storage publishing, Edge exposure or UI surfacing.

---

## 2. Exact Scope of II.3-IMPL

### 2.1 In scope

| Area | Scope |
|------|--------|
| Eligibility decision | Apply II.2 validation outcome as sole eligibility oracle |
| II.1 trust constraints | Preserve Factory truth, READ_ONLY, INTERNAL_OPS, no UI-only security |
| Atomicity principle | One candidate snapshot is wholly eligible or wholly not eligible |
| Eligibility reporting | Structured, sanitized reasons for NOT ELIGIBLE (no secrets/paths/stacks) |
| Separation | Eligibility ≠ Delivery (delivery remains out of scope) |
| Tests / fixtures | Prove eligibility PASS/FAIL cases derived from II.2 fixtures + II.3 rules |
| Documentation status | Update Integration status notes only as required for II.3-IMPL closure |

### 2.2 Explicit interpretation of “Producer”

Per II.3, **Producer** is a logical responsibility.  

For II.3-IMPL under this plan:

- **Allowed:** eligibility governance that *could later* be invoked by a Producer responsibility.
- **Forbidden:** an **operational Producer** (continuous observation runner, Factory tree crawler, deployed publisher, scheduled emitter, or any runtime that assembles live Factory state for production use).

II.3-IMPL therefore implements the **gate and decision layer**, not an operational Producer service.

### 2.3 Code placement principle (non-detailed)

When a future execution authorization is issued:

- Prefer a **new Integration sibling area** dedicated to publication eligibility.
- **Consume** II.2 Read Model validation as a dependency.
- **Do not** change Contract v2 schema semantics, field vocabulary, or weaken fail-closed rules.
- **Do not** modify `src/factory/**`.

This plan does not name classes, functions, APIs or file layouts beyond that principle.

---

## 3. Prerequisites

All must be true before coding starts under a separate execution authorization:

1. Director authorization for **execution** of II.3-IMPL (this plan alone is insufficient to write code).
2. HEAD/base agreed on `reconciliation/factory-2.0` with II.1, II.2 and II.3 specs present.
3. II.2 validation suite green (`runIi2ReadModelValidation.js` 31/31 or formally approved successor).
4. II.1 and II.2 remain without contradictory amendments.
5. Working tree policy confirmed: no Factory Runtime, React, Supabase, Edge or Auth work mixed into the same change set.
6. Agreement that Contract v2 is frozen for this block (any schema change requires separate II.2 authorization).

---

## 4. Dependencies

| Dependency | Role in II.3-IMPL |
|------------|-------------------|
| **II.1** | Trust law: Factory truth, READ_ONLY, INTERNAL_OPS, Runtime/Integration separation |
| **II.2 Contract** | Snapshot identity and semantics (`contractId`, `schemaVersion`, ownership, freshness, etc.) |
| **II.2-IMPL stack** | Sanitizer, validator, integrity, depth/quotas — normative eligibility oracle |
| **II.3 Specification** | Eligibility vs delivery, atomicity principle, non-authorizations |
| **Existing II.2 fixtures** | Seed material for eligibility tests (must not alter contract meaning) |

No dependency on Auth, Edge, Supabase, React, FCC, Marketplace or Factory Runtime execution is permitted.

---

## 5. Artifacts to Be Implemented (future execution)

Artifact categories only — not designs of classes/APIs:

1. **Publication Eligibility Decision Artifact**  
   Deterministic ELIGIBLE / NOT ELIGIBLE outcome for one candidate snapshot.

2. **Eligibility Reason Set**  
   Bounded, sanitized reasons aligned with II.2 validation failures and II.3 rules (including stale-without-`SNAPSHOT_STALE`, ownership/registry incoherence, etc.).

3. **Atomic Snapshot Unit Rule**  
   Enforcement that eligibility is evaluated on a complete candidate unit (no partial fragment eligibility).

4. **II.2 Gate Adapter (consumption only)**  
   Thin Integration adapter that invokes the existing II.2 validation path without modifying contract semantics.

5. **Eligibility Fixtures**  
   At minimum: eligible healthy; not eligible (invalid contract); not eligible (stale missing warning); not eligible (ownership/registry mismatch); not eligible (unknown fields / prohibited nomenclature).

6. **Eligibility Test Runner**  
   Automated suite dedicated to II.3-IMPL acceptance, complementary to II.2 suite (II.2 suite remains authoritative for contract validity).

7. **Status / Handoff Note**  
   Short documentary record that II.3-IMPL closed eligibility only; delivery still deferred.

---

## 6. Recommended Implementation Order

1. **Freeze inputs** — confirm II.1/II.2/II.3 texts and II.2 suite green.  
2. **Define eligibility matrix** — map II.3 §5.1 rules to expected ELIGIBLE/NOT ELIGIBLE outcomes (document in tests, not new contract fields).  
3. **Introduce eligibility decision artifact** — consume II.2 gate only.  
4. **Add reason reporting** — fail-closed, sanitized, bounded.  
5. **Enforce atomic unit rule** — reject partial/fragment evaluation paths if any appear.  
6. **Add fixtures** — eligible and not-eligible sets.  
7. **Add II.3-IMPL test runner** — must keep II.2 suite passing unchanged in meaning.  
8. **Documentary closure** — status note; no II.4 opened.  
9. **Stop** — no delivery, Auth, Edge, Producer operativo, or consumer channel work.

---

## 7. Validation Strategy

Validation during II.3-IMPL execution SHALL be fail-closed and layered:

| Layer | Validation |
|-------|------------|
| Contract | Unchanged II.2 validation remains mandatory |
| Eligibility | ELIGIBLE only if II.2 PASS **and** II.3 §5.1 constraints hold |
| Trust | No Factory mutation; READ_ONLY preserved; INTERNAL_OPS preserved |
| Separation | No code path that performs delivery/Auth/Edge/Supabase write |
| Regression | II.2 suite remains green after II.3-IMPL changes |
| Scope audit | Diff limited to Integration eligibility artifacts + allowed docs |

Any attempt to mark a snapshot ELIGIBLE while bypassing II.2 is an automatic II.3-IMPL failure.

---

## 8. Test Strategy

### 8.1 Retain

- Full II.2 suite (`runIi2ReadModelValidation.js`) as contract oracle.

### 8.2 Add (II.3-IMPL)

Tests must cover at least:

1. Eligible snapshot → ELIGIBLE.  
2. II.2 invalid snapshot → NOT ELIGIBLE.  
3. Stale without `SNAPSHOT_STALE` → NOT ELIGIBLE.  
4. Ownership/registry incoherence → NOT ELIGIBLE.  
5. Unknown field / prohibited nomenclature → NOT ELIGIBLE.  
6. Eligibility success does **not** imply delivery side effects (no network/storage/UI calls in unit scope).  
7. Atomicity: incomplete/partial candidate handling never yields ELIGIBLE.  
8. Reason set present and sanitized on NOT ELIGIBLE.

### 8.3 Explicit non-tests

Do not add tests that require Edge, Auth, Supabase, React, Factory Runtime execution, or public API servers.

---

## 9. Acceptance Criteria

II.3-IMPL may be declared complete only when all are true:

1. Eligibility decision artifact exists and is deterministic.  
2. ELIGIBLE is impossible without II.2 validation PASS.  
3. II.3 §5.1 constraints are enforced.  
4. Eligibility ≠ Delivery is preserved in behavior and docs.  
5. No operational Producer, Edge, Auth, public API, Supabase write, React or Factory Runtime change is introduced.  
6. Contract v2 schema/vocabulary is unchanged.  
7. II.2 suite remains PASS.  
8. New II.3-IMPL tests covering §8.2 are PASS.  
9. Diff scope audit confirms no out-of-scope paths.  
10. Director closure acknowledgment recorded for eligibility-only completion.

---

## 10. Risks

| Risk | Severity | Mitigation |
|------|----------|------------|
| Scope creep into operational Producer | High | Forbidden explicitly; eligibility-only artifacts |
| Scope creep into delivery/Auth/Edge | High | Hard non-goals; diff audit |
| Duplicating or forking II.2 validation logic | High | Consume II.2 gate; do not reimplement contract rules |
| Weakening II.2 to “make eligibility pass” | Critical | Forbidden; II.2 suite must remain green without semantic dilution |
| Confusing ELIGIBLE with published | High | Naming + tests for no side effects |
| Modifying readModel contract modules incompatibly | High | Prefer sibling eligibility area; freeze contract semantics |
| Premature II.4 assumptions in the same change set | Medium | Plan stops at eligibility |

---

## 11. Expressly Out of Scope

The following are **forbidden** in II.3-IMPL under this plan:

- Operational Producer (live observation/publishing service)
- Edge Functions
- AuthN / AuthZ
- Public APIs / routes / RPC servers
- Supabase writes (and Supabase read-model wiring)
- React / Factory Control Center / Marketplace
- Factory Runtime / `src/factory/**` changes
- Motors, loops, swarms, orchestration execution
- Contract v2 redesign or incompatible schema changes
- Authenticated GET delivery boundary
- Historical retention, BFF, cross-region publication
- II.4 and any later block
- Any code authored under *this planning document alone* (plan ≠ execution warrant)

---

## 12. Relationship Guardrails

| Source | Guardrail |
|--------|-----------|
| Derives from II.3 | Eligibility governance only |
| Must not contradict II.1 | Factory truth, READ_ONLY, INTERNAL_OPS, no UI-only security |
| Must not contradict II.2 | II.2 remains sole contract/validation oracle |
| Must not invade later phases | No delivery/Auth/Edge/storage productization |

---

## 13. Plan Status

- **II.3-IMPL Implementation Plan:** CREATED — PLAN ONLY  
- **II.3-IMPL code execution:** NOT AUTHORIZED by this document  
- **Next required act:** explicit Director authorization to **execute** II.3-IMPL according to this plan  

---

## 14. Final Clause

This document plans how to implement publication **eligibility** governance.  
It does not implement it.  
It does not authorize Producer operations, delivery channels or II.4.

No work claiming II.3-IMPL compliance may proceed from this plan without a separate Director execution authorization.

---

**END OF DOCUMENT**

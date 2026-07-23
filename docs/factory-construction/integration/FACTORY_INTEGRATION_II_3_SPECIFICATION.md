# FACTORY INTEGRATION II.3
## READ MODEL PUBLICATION GOVERNANCE SPECIFICATION

**Document ID:** `FACTORY_INTEGRATION_II_3_SPECIFICATION.md`  
**Phase:** Factory Integration  
**Block:** II.3  
**Document Type:** Constitutional Specification  
**Status:** APPROVED — SPECIFICATION ONLY (NO IMPLEMENTATION AUTHORIZED)  

**Prerequisites:**

- II.1 Security Boundary — reconstructed and continuity-approved with II.2  
- II.2 Read Model Contract v2 — approved and implemented (validator/sanitizer/integrity)  
- Continuity audit II.1 ↔ II.2 — APPROVED WITH OBSERVATIONS — II.3 MAY BE DEFINED  

---

## 1. Objective

II.3 defines the **constitutional governance of Read Model publication**.

It answers a single question left open by II.1 and II.2:

> Once a Read Model snapshot can be validated against Contract v2, under what Integration rules may it be considered **eligible for publication**, and under what rules must publication **fail closed** — without mutating Factory and without deploying Auth, Edge, UI or storage systems?

II.3 does **not** invent a new product surface.  
It governs the missing middle step between:

1. **II.1** — trust boundary and exposure restrictions;  
2. **II.2** — contract shape, sanitization and validation;  
3. **Later phases** — authenticated delivery, transport, storage and consumer exposure.

---

## 2. Problem Solved

### 2.1 Gap after II.2

II.2 makes a snapshot **validatable**.  
II.2 does **not** authorize:

- who may assemble observation into a candidate snapshot;
- when a validated snapshot becomes publication-eligible;
- atomicity of publication as a governance rule;
- separation between “validated locally” and “delivered to consumers”.

Without II.3, future implementers could conflate:

- validation utilities with production publication;
- Factory Runtime execution with Integration projection;
- UI access with security boundary crossing;
- ad-hoc file dumps with governed publication.

### 2.2 Problem statement

Factory Integration requires a constitutional publication discipline so that:

- Factory remains the only operational source of truth;
- Integration remains read-only;
- only II.2-valid snapshots may become publication-eligible;
- invalid, unsanitized, stale-misrepresented or ownership-incoherent candidates never become publication-eligible;
- delivery mechanisms (Auth, Edge, BFF, Supabase, UI) remain explicitly deferred.

---

## 3. Responsibilities

### 3.1 Logical role: Producer (governance concept)

Within II.3, **Producer** denotes a **logical Integration responsibility**, not a deployed service and not authorized code.

The Producer responsibility, when later implemented under a separate II.3-IMPL authorization, SHALL:

1. Observe Factory / Registry / Documentation sources without mutating them.
2. Assemble a candidate Read Model projection using only II.2-allowed semantics.
3. Submit the candidate to the II.2 sanitizer/validator/integrity gate.
4. Treat II.2 validation failure as publication failure (fail-closed).
5. Treat II.2 validation success as **publication eligibility**, not as consumer delivery.
6. Never claim Factory ownership of truth.
7. Never execute motors, loops, swarms or orchestration.
8. Never expose secrets, paths, stack traces or mutable controls.

### 3.2 Integration

- Owns projection and publication governance.
- Owns enforcement that only II.2-valid snapshots are publication-eligible.
- MUST preserve `ownership.readModel = "INTEGRATION"`.

### 3.3 Factory

- Remains sole operational source of truth.
- MUST NOT be mutated by publication governance.
- Runtime execution remains outside publication duties.

### 3.4 Consumers

- Remain untrusted relative to Factory internals.
- MUST NOT receive publication through II.3 alone.
- Future consumption requires a later authorized delivery boundary (not II.3).

### 3.5 Documentation / Governance

- Continues to own governance declarations used in Read Model governance metadata.
- Publication MUST NOT invent approval identity.

---

## 4. Scope Limits

### 4.1 What II.3 includes

II.3 specifies:

- objective and problem of publication governance;
- logical Producer responsibility;
- publication eligibility rules;
- conceptual publication architecture (non-implementational);
- dependencies on II.1 and II.2;
- explicit non-goals and deferred phases;
- acceptance criteria for this specification;
- risks;
- conditions required before any future II.3-IMPL.

### 4.2 What II.3 excludes

II.3 excludes:

- code, classes, functions, modules, packages;
- concrete APIs, routes, RPC signatures;
- JSON schemas or contract field redesign;
- Edge Functions;
- AuthN / AuthZ implementation;
- Supabase reads/writes;
- React / Factory Control Center / Marketplace;
- Factory Runtime changes;
- BFF;
- historical retention systems;
- cross-region publication systems;
- schema registries;
- consumer product UX.

---

## 5. Conceptual Architecture

II.3 introduces no new trust domain beyond II.1. It names the publication control point already implied by the II.1 flow.

```text
FACTORY / REGISTRY / DOCUMENTATION
            │
            │ observe only (no mutation)
            ▼
   PRODUCER RESPONSIBILITY (logical)
            │ assemble candidate projection
            ▼
   II.2 GATE (sanitize → validate → integrity → freshness rules)
            │
            ├── FAIL  → not publication-eligible (fail-closed)
            │
            └── PASS  → publication-eligible snapshot
                        │
                        ▼
              DELIVERY BOUNDARY (NOT AUTHORIZED IN II.3)
              (authenticated GET / AuthZ / Edge / BFF / storage)
                        │
                        ▼
                     CONSUMERS
```

### 5.1 Publication eligibility

A snapshot is **publication-eligible** only when all are true:

1. It conforms to Read Model Contract v2 (`contractId`, `schemaVersion = 2.0.0`, `mode = READ_ONLY`, `dataClassification = INTERNAL_OPS`).
2. It passes II.2 fail-closed validation (including allowlist, unknown-field rejection, invariants, quotas/depth, checksum, ownership↔registry coherence, approved warning catalog, phase ids).
3. If stale, it carries `SNAPSHOT_STALE`.
4. It does not claim Factory ownership for Integration concerns.
5. It does not fabricate Registry state.
6. It contains no prohibited nomenclature (`contractName`, `records`, `RECORDS_TRUNCATED`).

### 5.2 Publication vs delivery

| Term | Meaning in II.3 |
|------|------------------|
| **Validation success** | II.2 gate PASS |
| **Publication-eligible** | Allowed to be considered for later delivery |
| **Published / delivered** | Actually exposed to a consumer channel | **Not authorized by II.3** |

II.3 ends at eligibility governance.  
Delivery remains a later phase.

### 5.3 Atomicity (constitutional principle)

Future publication implementation, when authorized, MUST treat a snapshot as an atomic unit:

- either the complete validated snapshot is publication-eligible;
- or nothing is publication-eligible.

Partial emission of unsanitized fragments, bypassing II.2, or mixing v1/v2 nomenclature in one publication unit is prohibited.

II.3 states the principle only. It does not define storage, locking, queues or transport mechanisms.

---

## 6. Dependencies

| Dependency | Requirement |
|------------|-------------|
| **II.1** | Trust boundaries, read-only law, `INTERNAL_OPS`, Runtime/Integration separation, rejection of UI-only security |
| **II.2** | Contract v2 identity, sanitizer/validator/integrity semantics, freshness, ownership, fail-closed gate |
| **II.2-IMPL** | Existing validation stack is the normative gate for eligibility |
| **Factory** | Source of truth only; no mutation path through II.3 |

II.3 MUST NOT weaken II.1 or II.2.  
Where conflict appears, II.1 prevails for trust/exposure framing and II.2 prevails for contract validity.

---

## 7. Explicitly Out of Scope / Deferred

The following remain **outside II.3** and belong to later authorized phases unless the Director issues a new authorization:

| Item | Status under II.3 |
|------|-------------------|
| Producer deployment / runtime code | NOT AUTHORIZED |
| II.3-IMPL | NOT AUTHORIZED |
| Authenticated GET boundary | DEFERRED |
| AuthN / AuthZ policy implementation | DEFERRED |
| Edge Functions | DEFERRED / REJECTED as Factory executors |
| Atomic publication mechanisms (queues, stores, locks) | DEFERRED (principle only in II.3) |
| Historical snapshot retention | DEFERRED |
| Supabase read model | DEFERRED |
| BFF | DEFERRED |
| Advanced observability platforms | DEFERRED |
| Schema registry | DEFERRED |
| Automated compatibility negotiation | DEFERRED |
| Cross-region publication | DEFERRED |
| React / FCC / Marketplace exposure | DEFERRED |
| II.4 and later | NOT OPENED by this document |

---

## 8. Relationship to II.1 and II.2

| Block | Role | II.3 relationship |
|-------|------|-------------------|
| **II.1** | Security boundary constitution | II.3 operates strictly inside II.1 trust law |
| **II.2** | Contract + validation gate | II.3 uses II.2 PASS/FAIL as sole eligibility oracle |
| **II.3** | Publication governance | Defines eligibility and Producer responsibility; does not deliver |
| **Later** | Authenticated delivery / transport / storage | Consumes publication-eligible snapshots only |

### Sequence (constitutional)

```text
II.1  Trust & exposure boundary
  → II.2  Contract & fail-closed validation
    → II.3  Publication eligibility governance
      → Later  Authenticated delivery & consumer channels
```

### Non-contradiction commitments

II.3 SHALL preserve:

- Factory as sole operational source of truth;
- `READ_ONLY` projection;
- Integration ownership of projection only;
- `INTERNAL_OPS` classification;
- allowlist sanitization and unknown-field rejection;
- fail-closed behavior;
- no UI-only security;
- no public static snapshot as final architecture;
- no Factory Runtime execution through Integration publication.

---

## 9. What II.3 Authorizes

II.3 authorizes **only**:

1. Documentary definition of publication governance.
2. Naming of the logical Producer responsibility.
3. Definition of publication eligibility as “II.2 validation PASS + II.1 trust constraints”.
4. Separation of eligibility from delivery.
5. Atomicity as a constitutional publication principle.
6. Explicit deferral of Auth, Edge, storage, UI and II.3-IMPL.

II.3 authorizes **no runtime behavior** by itself.

---

## 10. What II.3 Does NOT Authorize

II.3 does **not** authorize:

1. Writing or merging Producer code.
2. Creating Edge Functions.
3. Implementing AuthN/AuthZ.
4. Creating APIs, routes, handlers, classes or functions.
5. Defining new JSON schemas or changing Contract v2.
6. Modifying `src/factory/**` or Factory Runtime.
7. Modifying `src/integration/readModel/**` under this block.
8. Supabase reads/writes.
9. React / Factory Control Center / Marketplace changes.
10. Treating this specification as II.3-IMPL approval.
11. Opening II.4 or any later block.
12. Public or static final exposure architecture.

---

## 11. Acceptance Criteria (for this specification)

This II.3 specification is complete when all are true:

1. It states a single clear objective: publication governance / eligibility.
2. It identifies the gap left by II.1/II.2 without inventing delivery systems.
3. It defines Producer as a logical responsibility, not a deployed component.
4. It binds eligibility exclusively to II.2 fail-closed validation success under II.1 constraints.
5. It separates publication eligibility from authenticated delivery.
6. It lists explicit non-authorizations (Auth, Edge, code, schema changes, Factory mutation, II.3-IMPL).
7. It does not introduce APIs, classes, functions or JSON schemas.
8. It does not contradict II.1 or II.2 vocabulary or trust law.
9. It states conditions required before any future II.3-IMPL.
10. No code or tests were created by the act of writing this document.

---

## 12. Risks

| Risk | Severity | Note |
|------|----------|------|
| Misreading II.3 as authorization to implement Producer/Edge/Auth | High | Status is SPECIFICATION ONLY |
| Conflating eligibility with delivery | High | Explicitly separated in §5.2 |
| Inventing transport/storage under “atomicity” | Medium | Atomicity is principle-only |
| Weakening II.2 by bypassing validator in a future impl | High | Forbidden; II.2 remains sole gate |
| Treating reconstructed II.1 as optional | Medium | II.3 depends on II.1 trust law |
| Premature II.4 assumptions | Medium | Delivery boundary not opened here |

---

## 13. Conditions Required Before Future II.3-IMPL

No II.3-IMPL may begin until **all** of the following are satisfied:

1. Explicit Director authorization titled **II.3-IMPL** (this document is insufficient).
2. II.1 remains in force without contradictory amendment.
3. II.2 contract and validation stack remain the normative gate (31/31 suite green or successor formally approved).
4. Implementation scope is limited to Integration publication eligibility mechanics and does **not** silently include Auth/Edge/UI/Supabase unless separately authorized.
5. No changes to Factory Runtime are included in the II.3-IMPL authorization.
6. No incompatible changes to Contract v2 are included; any contract change requires its own II.2 amendment/version authorization.
7. Acceptance tests for II.3-IMPL are defined in that future authorization, not in this specification.
8. Documentary status of II.3 is updated from SPECIFICATION ONLY to an implementation-authorized state by Director act.

---

## 14. Documentary Status

- **II.1 Specification:** RECONSTRUCTED / DOCUMENTARY APPROVED  
- **II.2 Specification:** APPROVED  
- **II.2-IMPL:** IMPLEMENTED  
- **II.3 Specification:** APPROVED — SPECIFICATION ONLY  
- **II.3-IMPL:** NOT AUTHORIZED  
- **Producer deployment:** NOT AUTHORIZED  
- **Authenticated Boundary:** NOT AUTHORIZED  
- **Edge / AuthN / AuthZ / Supabase / React / FCC:** NOT AUTHORIZED  
- **II.4 and later:** NOT OPENED  

---

## 15. Final Constitutional Clause

II.3 exists to govern **whether** a validated Read Model snapshot may be considered publication-eligible.  
It does not govern **how** consumers authenticate, **where** snapshots are stored, or **which** transport delivers them.

No implementation may claim compliance with Factory Integration II.3 while:

- mutating Factory;
- bypassing II.2 validation;
- deploying Auth/Edge/UI under color of II.3 alone;
- or treating this specification as an implementation warrant.

Until II.3-IMPL is expressly authorized, this document remains specification-only.

---

**END OF DOCUMENT**

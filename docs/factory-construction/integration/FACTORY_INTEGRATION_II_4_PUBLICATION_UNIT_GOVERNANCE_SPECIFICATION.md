# FACTORY INTEGRATION II.4
## PUBLICATION UNIT GOVERNANCE SPECIFICATION

**Document ID:** `FACTORY_INTEGRATION_II_4_PUBLICATION_UNIT_GOVERNANCE_SPECIFICATION.md`  
**Phase:** Factory Integration  
**Block:** II.4  
**Document Type:** Constitutional Specification  
**Status:** SPECIFICATION ONLY (NO IMPLEMENTATION AUTHORIZED)  

**Repository:** `C:\Users\cgrmo\Desktop\Reconciliation-Integration`  
**Branch / HEAD at specification baseline:** `reconciliation/factory-2.0` @ `5a0c692`  

**Director architectural decision:** Alternative A — **Publication Unit Governance**  
**Discovery basis:** `FACTORY_INTEGRATION_II_4_DISCOVERY_REPORT.md`  

**Prerequisites:**

- II.1 Security Boundary — CLOSED (documentary)  
- II.2 Read Model Contract v2 — CLOSED  
- II.2-IMPL (+ II.2-IMPL.1) — CLOSED  
- II.3 Publication Eligibility Governance — CLOSED  
- II.3-IMPL (+ II.3-IMPL.1) — CLOSED  
- II.4 Discovery — COMPLETE; Alternative A approved by Director  

---

## 1. Purpose of II.4

II.4 defines the **constitutional governance of the Publication Unit**.

It answers the single question left open after II.3:

> Once a Read Model candidate has been decided **ELIGIBLE** under II.3, what Integration rules govern the formation, identity, atomicity and immutability of a **Publication Unit** — without persisting, transporting, delivering, authenticating or exposing that unit, and without deploying an operational Producer?

II.4 does **not** invent a delivery channel, storage product or API surface.  
It governs the missing middle step between:

1. **II.3** — publication eligibility (`ELIGIBLE` / `NOT_ELIGIBLE`);  
2. **Later phases** — persistence products, transport, authenticated delivery and consumer exposure (all remain NOT AUTHORIZED under II.4).

---

## 2. Architectural Problem Solved

### 2.1 Gap after II.3

II.3 makes a candidate **publication-eligible** or not.  
II.3 does **not** define:

- what constitutional object exists after `ELIGIBLE`;
- how eligibility binds to a complete unit without partial fragments;
- how unit identity relates to snapshot identity and integrity metadata;
- that eligibility must not be silently equated with published, persisted, delivered, authenticated or exposed.

Without II.4, future implementers could conflate:

- an ephemeral eligibility decision with a publication artifact;
- Contract v2 validation with storage objects;
- `ELIGIBLE` with consumer delivery;
- atomicity principles with queues, locks or databases;
- Integration governance with Auth, Edge, Supabase or React.

### 2.2 Problem statement

Factory Integration requires a constitutional Publication Unit discipline so that:

- Factory remains the only operational source of truth;
- Integration remains `READ_ONLY`;
- only II.3-`ELIGIBLE` candidates may form a Publication Unit;
- II.2 remains the sole contract-validation gate (no parallel validator);
- atomicity and immutability of the unit are binding as governance;
- Delivery, AuthN/AuthZ, Edge, APIs, persistence products, transport, operational Producer, logging/telemetry/retention and React remain expressly deferred or NOT AUTHORIZED.

---

## 3. Conceptual Definition: Publication Unit

### 3.1 Definition

A **Publication Unit** is the Integration governance construct that represents **one complete, II.3-eligible Read Model snapshot as an indivisible publication candidate unit**.

It is:

- **constitutional** — defined by Integration law, not by a storage schema;
- **atomic** — wholly formed or not formed; never partial;
- **immutable** once formed under II.4 rules;
- **identity-bearing** — bound to snapshot identity and integrity metadata already established under II.2;
- **non-delivered** — its existence does not authorize exposure to consumers;
- **non-persisted by implication** — II.4 does not assume or require durable storage.

### 3.2 What a Publication Unit is not

A Publication Unit is **not**:

- a database row, table, bucket object or queue message;
- an HTTP resource, endpoint or RPC payload;
- a delivered, authenticated or exposed consumer artifact;
- a Factory mutation or Runtime command;
- a second Read Model Contract;
- a replacement for II.2 validation or II.3 eligibility;
- an operational Producer output stream.

---

## 4. Mandatory Relationship Chain

The only lawful progression is:

```text
Read Model candidate snapshot
        │
        ▼
II.2 validation PASS
        │
        ▼
II.3 decision = ELIGIBLE
        │
        ▼
II.4 Publication Unit governance
        │  (may form Publication Unit under §9)
        │
        ▼
Later phases (NOT AUTHORIZED BY II.4)
  persistence / transport / authenticated delivery / consumers
```

### 4.1 Binding rules

1. **No II.2 PASS ⇒ no II.3 ELIGIBLE ⇒ no Publication Unit.**  
2. **II.3 `NOT_ELIGIBLE` ⇒ Publication Unit MUST NOT form.**  
3. **II.4 MUST NOT re-validate Contract v2 as a competing gate.**  
   II.2 remains the sole contract oracle; II.3 remains the sole eligibility oracle; II.4 consumes their outcomes.  
4. **II.4 MUST NOT alter** the meanings of `ELIGIBLE` or `NOT_ELIGIBLE`.  
5. **II.4 MUST NOT redefine** Contract v2 fields, vocabulary or integrity algorithm.

### 4.2 Conceptual architecture (non-implementational)

```text
FACTORY / REGISTRY / DOCUMENTATION
            │ observe only (no mutation)
            ▼
   PRODUCER RESPONSIBILITY (logical; operational form NOT AUTHORIZED)
            │ assemble candidate projection
            ▼
   II.2 GATE (sanitize → validate → integrity → freshness)
            │
            ├── FAIL  → II.3 NOT_ELIGIBLE → no Publication Unit
            │
            └── PASS
                 ▼
            II.3 ELIGIBILITY
                 │
                 ├── NOT_ELIGIBLE → no Publication Unit
                 │
                 └── ELIGIBLE
                      ▼
                 II.4 PUBLICATION UNIT GOVERNANCE
                      │ may form Publication Unit (atomic, immutable, identified)
                      │
                      ▼
                 DELIVERY / AUTH / PERSISTENCE / TRANSPORT
                 (NOT AUTHORIZED UNDER II.4)
```

---

## 5. Atomicity Principle

1. A Publication Unit is an **atomic whole**: either the complete eligible snapshot forms one unit, or no unit forms.  
2. Partial fragments, truncated unsanitized subsets, mixed v1/v2 nomenclature, or eligibility evaluated on non-atomic candidates MUST NOT form a Publication Unit.  
3. II.4 adopts and hardens II.3 §5.3 atomicity as **unit governance**, not as a storage or locking mechanism.  
4. II.4 does **not** authorize queues, locks, transactions, object stores or transport protocols to “implement” atomicity.

---

## 6. Immutability Principle

1. Once a Publication Unit is formed under II.4, its governed binding to the eligible snapshot content and integrity metadata is **immutable**.  
2. Integration MUST NOT mutate Factory to “correct” a unit.  
3. Integration MUST NOT mutate the candidate snapshot after II.3 evaluation for the purpose of forcing unit formation.  
4. If correction is required, a **new** candidate MUST proceed again through II.2 → II.3 → II.4.  
5. Immutability here is a **governance principle**, not a claim about durable media.

---

## 7. Unit Identity Principle

1. A Publication Unit MUST carry a stable conceptual identity derived from the underlying Read Model snapshot identity already present under Contract v2 (for example, the snapshot’s existing identity field as defined by II.2 — without inventing a new contract schema in this document).  
2. Unit identity MUST remain distinguishable from:
   - Factory truth identity;
   - eligibility decision identity (II.3 outcome);
   - any future delivery receipt or persistence key (not authorized here).  
3. II.4 MUST NOT invent parallel contract identity fields that contradict `contractId` / `schemaVersion` / snapshot identity under II.2.  
4. Two Publication Units formed from distinct eligible snapshots MUST NOT be treated as the same unit.

---

## 8. Relationship of Constituent Concepts

| Concept | Role | Owner / oracle |
|---------|------|----------------|
| **Candidate snapshot** | Assembled Read Model projection under Contract v2 shape | Integration projection; Factory remains truth |
| **II.2 validation** | Fail-closed contract/integrity gate | II.2 / `validateReadModelV2` |
| **Eligibility decision** | `ELIGIBLE` / `NOT_ELIGIBLE` | II.3 / publication eligibility |
| **Integrity metadata** | Checksum / integrity semantics of the snapshot | II.2 (unchanged) |
| **Publication Unit** | Governance binding of one complete ELIGIBLE snapshot as atomic unit | II.4 (this specification) |

### 8.1 Binding statement

A Publication Unit, when formed, **binds together**:

1. the complete candidate snapshot that II.2 accepted;  
2. the II.3 `ELIGIBLE` decision for that candidate;  
3. the integrity metadata associated with that snapshot under II.2;

as **one atomic, immutable governance unit**.

The eligibility decision alone is not a Publication Unit.  
The raw snapshot alone is not a Publication Unit.  
Integrity metadata alone is not a Publication Unit.

---

## 9. Minimum Constitutional Conditions to Form a Publication Unit

A Publication Unit MAY form only when **all** of the following are true:

1. **II.1 trust law holds:** Factory is sole operational source of truth; Integration is `READ_ONLY`; classification remains `INTERNAL_OPS`; no UI-only security claim.  
2. **II.2 validation PASS** for the complete candidate snapshot (sole contract gate).  
3. **II.3 decision = `ELIGIBLE`** for that same candidate (sole eligibility oracle).  
4. **Atomic completeness:** the candidate is a whole snapshot unit (no fragment / partial publication unit).  
5. **Integrity coherence:** integrity metadata required by II.2 for that snapshot remains associated and is not stripped, replaced or forged by II.4.  
6. **Ownership honesty:** `ownership` semantics remain those of Contract v2 / II.1 (`ownership.factory = FACTORY`, `ownership.readModel = INTEGRATION`); no claim that Integration owns Factory truth.  
7. **No delivery side meaning:** formation does not assert published, persisted, delivered, authenticated or exposed.  
8. **No parallel gate:** II.4 does not invent an alternate validator that could pass what II.2 failed or fail what II.3 already decided without consuming those oracles.

If any condition fails, **no Publication Unit forms** (fail-closed).

---

## 10. Allowed Conceptual States

II.4 permits only the following **conceptual** states.  
This section does **not** define schemas, enums-as-code, APIs or storage columns.

| Conceptual state | Meaning |
|------------------|---------|
| **UNIT_NOT_FORMED** | Default. No Publication Unit exists for the candidate. |
| **UNIT_FORMED** | A Publication Unit exists as a governance binding under §9. |
| **UNIT_REJECTED** | Formation was attempted or considered and refused under fail-closed / rejection rules. |

### 10.1 State rules

1. `NOT_ELIGIBLE` ⇒ only `UNIT_NOT_FORMED` or `UNIT_REJECTED`; never `UNIT_FORMED`.  
2. `ELIGIBLE` is necessary but not sufficient narrative for delivery; it is necessary for `UNIT_FORMED`.  
3. `UNIT_FORMED` does **not** transition, under II.4, into published / persisted / delivered / authenticated / exposed.  
4. No additional operational states (queued, stored, shipped, acked, revoked-in-transit, etc.) are authorized by II.4.

---

## 11. Fail-Closed Rules

1. Unknown, incomplete or contradictory inputs ⇒ **no** Publication Unit.  
2. II.2 failure ⇒ **no** Publication Unit.  
3. II.3 `NOT_ELIGIBLE` ⇒ **no** Publication Unit.  
4. Unexpected errors or exceptions in any consumed gate ⇒ treat as failure to form a unit (fail-closed); do not escalate into Delivery.  
5. Absence of required integrity association under II.2 rules ⇒ **no** Publication Unit.  
6. Ambiguity about whether the candidate is a complete atomic unit ⇒ **no** Publication Unit.  
7. Any attempt to interpret `UNIT_FORMED` as authorization to deliver, persist, authenticate or expose ⇒ **forbidden**; Delivery remains NOT AUTHORIZED.

---

## 12. Rejection Rules

Formation MUST be rejected when any of the following hold:

1. Candidate is null, non-object, array, fragment-marked or otherwise non-atomic.  
2. II.2 does not PASS.  
3. II.3 decision is not `ELIGIBLE`.  
4. Attempt to form a unit from a mutated candidate after eligibility evaluation.  
5. Attempt to strip, rewrite or replace integrity metadata to force formation.  
6. Attempt to mix multiple snapshots into one unit.  
7. Attempt to treat eligibility reasons, delivery flags or side-effect lists as unit content that bypasses II.2.  
8. Attempt to claim Factory ownership for Integration projection concerns.  
9. Attempt to open Delivery, Auth, Edge, API, Supabase, React or operational Producer under color of II.4.

Rejection yields `UNIT_REJECTED` or leaves `UNIT_NOT_FORMED`. It never yields Delivery.

---

## 13. Absolute Separation of Meanings

| Term | Meaning under II.4 | Authorized by II.4? |
|------|--------------------|---------------------|
| **Publication Unit** | Governance binding of one ELIGIBLE snapshot as atomic unit | Yes (governance definition only) |
| **ELIGIBLE** | II.3 publication eligibility decision | Consumed; not redefined |
| **published** | Actually published to a publication channel | **No** |
| **persisted** | Written to durable storage | **No** |
| **delivered** | Exposed through a consumer delivery channel | **No** |
| **authenticated** | Access gated by AuthN | **No** |
| **exposed** | Available to any consumer or UI surface | **No** |

**Hard clause:**  
`UNIT_FORMED` ≠ published ≠ persisted ≠ delivered ≠ authenticated ≠ exposed.

II.4 ends at Publication Unit **governance**.  
Delivery remains expressly **blocked** for the entire II.4 block (Specification and any future plan/impl phases until a later Director authorization outside II.4).

---

## 14. Ownership and Trust Boundary

II.4 introduces **no new trust domain** beyond II.1.

| Domain | II.4 rule |
|--------|-----------|
| **Factory** | Sole operational source of truth; MUST NOT be mutated by Publication Unit governance |
| **Integration** | Owns Read Model projection and Publication Unit governance; remains `READ_ONLY` relative to Factory |
| **Registry** | Observed; never fabricated |
| **Documentation / Governance** | Owns governance declarations; II.4 MUST NOT invent approval identity |
| **Consumers** | Untrusted relative to Factory internals; MUST NOT receive units through II.4 alone |
| **Future authenticated boundary** | Remains PARKING / NOT AUTHORIZED under II.4 |

Classification remains **`INTERNAL_OPS`**.  
UI gating alone remains insufficient as a security boundary.

---

## 15. Dependencies on II.1, II.2 and II.3

| Dependency | Requirement |
|------------|-------------|
| **II.1** | Trust boundaries, `READ_ONLY`, `INTERNAL_OPS`, Runtime/Integration separation, rejection of UI-only security |
| **II.2** | Contract v2 identity, sanitization, validation, integrity, freshness, ownership; sole contract gate |
| **II.2-IMPL** | Existing validation stack remains normative; II.4 MUST NOT fork it |
| **II.3** | Eligibility vocabulary and separation of eligibility from delivery |
| **II.3-IMPL** | `ELIGIBLE` / `NOT_ELIGIBLE` decision surface is the eligibility oracle II.4 consumes |
| **Factory** | Source of truth only; no mutation path through II.4 |

### 15.1 Non-contradiction commitments

II.4 SHALL preserve:

- Factory as sole operational source of truth;  
- Integration `READ_ONLY` projection;  
- `INTERNAL_OPS` classification;  
- II.2 as sole contract-validation gate;  
- II.3 as sole eligibility decision vocabulary;  
- fail-closed behavior;  
- no UI-only security;  
- no public static snapshot as final architecture;  
- no Factory Runtime execution through Integration publication unit governance.

Where conflict appears: II.1 prevails for trust/exposure framing; II.2 for contract validity; II.3 for eligibility meaning; II.4 for Publication Unit governance only.

---

## 16. Expressly Out of Scope

The following are **outside II.4** and remain NOT AUTHORIZED or deferred unless the Director issues a **separate** authorization beyond this Specification:

| Item | Status under II.4 |
|------|-------------------|
| II.4-IMPL | **NOT AUTHORIZED** |
| Operational Producer / Producer assembly implementation | **NOT AUTHORIZED** (later phase) |
| Delivery / authenticated GET boundary | **NOT AUTHORIZED** (blocked for all of II.4) |
| AuthN / AuthZ | **NOT AUTHORIZED** |
| Edge Functions | **NOT AUTHORIZED** |
| Public or internal APIs / endpoints / RPC | **NOT AUTHORIZED** |
| Supabase reads/writes | **NOT AUTHORIZED** |
| React / Factory Control Center / Marketplace | **NOT AUTHORIZED** |
| Persistence products (DB, buckets, filesystems as publication store) | **NOT AUTHORIZED** |
| Transport / queues / events / brokers | **NOT AUTHORIZED** |
| Operational logging, telemetry, retention, observability platforms | **DEFERRED** |
| Historical retention systems | **DEFERRED** |
| BFF | **DEFERRED** |
| Schema registry / cross-region publication | **DEFERRED** |
| JSON schemas, classes, functions, tables for II.4 | **NOT AUTHORIZED** by this document |
| Contract v2 redesign | **NOT AUTHORIZED** |
| Changes to `src/integration/readModel/**` under this block | **NOT AUTHORIZED** |
| Changes to eligibility semantics under this block | **NOT AUTHORIZED** |
| Factory Runtime / `src/factory/**` mutation | **PROHIBITED** |
| II.5 and later | **NOT AUTHORIZED / NOT OPENED** |

---

## 17. Risks

| Risk | Severity | Note |
|------|----------|------|
| Misreading II.4 as authorization to implement storage/Delivery/Auth | Critical | Status is SPECIFICATION ONLY; Delivery blocked |
| Equating `UNIT_FORMED` with published/delivered | Critical | Absolute separation in §13 |
| Inventing a second validation gate parallel to II.2 | High | Forbidden; consume II.2/II.3 only |
| Weakening II.3 eligibility meanings | High | Forbidden |
| Smuggling queues/DB under “atomicity” | High | Atomicity is governance, not mechanism |
| Smuggling operational Producer under unit formation | High | Producer remains later phase |
| Treating this Specification as II.4-IMPL approval | High | Separate Director process required |
| Premature II.5 / Delivery assumptions | Medium | Explicitly not opened |
| Observability/retention creep via “unit metadata” | Medium | Logging/telemetry/retention deferred |

---

## 18. Acceptance Criteria (for this Specification)

This II.4 Specification is complete when all are true:

1. It states a single clear objective: Publication Unit Governance.  
2. It derives from the II.4 Discovery Report and Director Alternative A.  
3. It defines Publication Unit conceptually without schemas, APIs, classes or functions.  
4. It binds unit formation to II.2 PASS + II.3 `ELIGIBLE` only.  
5. It states atomicity, immutability and identity principles.  
6. It relates candidate, eligibility decision, unit and integrity metadata without redefining Contract v2.  
7. It lists fail-closed and rejection rules.  
8. It absolutely separates Publication Unit from published / persisted / delivered / authenticated / exposed.  
9. It preserves Factory truth and Integration `READ_ONLY`.  
10. It keeps Delivery and operational Producer NOT AUTHORIZED.  
11. It does not authorize II.4-IMPL, II.5, code or tests.  
12. It does not contradict II.1, II.2 or II.3.  
13. No code or tests were created by the act of writing this document.

---

## 19. Conditions Required Before Future II.4-IMPL

No II.4-IMPL may begin until **all** of the following are satisfied:

1. Explicit Director authorization titled **II.4-IMPL** (this Specification is insufficient).  
2. Mandatory process completed for this Specification phase:  
   **Specification → Independent Audit → Commit** (commit of this document when Director authorizes).  
3. An **Implementation Plan** for II.4-IMPL is written, independently audited and committed under separate Director authorization.  
4. Explicit Director **implementation authorization** after that plan’s audit.  
5. II.1, II.2 and II.3 remain in force without contradictory amendment.  
6. II.2 and II.3 validation suites remain green (or formally approved successors).  
7. Implementation scope is limited to Publication Unit governance mechanics and does **not** include Delivery, Auth, Edge, API, Supabase, React, persistence products, transport, operational Producer, or operational observability.  
8. No incompatible Contract v2 changes are included; any contract change requires separate II.2 authorization.  
9. No Factory Runtime changes are included.  
10. Delivery remains blocked unless a later block outside II.4 expressly authorizes it.

### 19.1 Mandatory process reminder (Director)

```text
Specification
  → Independent Audit
  → Commit
  → Implementation Plan
  → Independent Audit
  → Commit
  → Implementation authorization
```

This document satisfies only the **Specification** step of that chain for II.4.

---

## 20. Documentary Status

- **II.1 Specification:** CLOSED (documentary)  
- **II.2 Specification / II.2-IMPL:** CLOSED  
- **II.3 Specification / II.3-IMPL:** CLOSED  
- **II.4 Discovery:** COMPLETE (Alternative A approved)  
- **II.4 Specification:** **SPECIFICATION ONLY**  
- **II.4-IMPL:** **NOT AUTHORIZED**  
- **Delivery:** **NOT AUTHORIZED** (blocked for entire II.4)  
- **Operational Producer:** **NOT AUTHORIZED** (later phase)  
- **AuthN / AuthZ / Edge / API / Supabase / React / persistence / transport:** **NOT AUTHORIZED**  
- **Operational logging / telemetry / retention / observability:** **DEFERRED**  
- **II.5 and later:** **NOT AUTHORIZED**  

---

## 21. Final Constitutional Clause

II.4 exists to govern **whether and how** an II.3-`ELIGIBLE` Read Model snapshot may be recognized as a **Publication Unit**.  
It does not govern **where** units are stored, **how** they move, **who** authenticates, or **which** consumer channel delivers them.

No implementation may claim compliance with Factory Integration II.4 while:

- mutating Factory;  
- bypassing II.2 or redefining II.3 eligibility;  
- treating `UNIT_FORMED` as published, persisted, delivered, authenticated or exposed;  
- deploying Auth, Edge, API, Supabase, React, persistence or transport under color of II.4 alone;  
- or treating this Specification as an implementation warrant.

Until II.4-IMPL is expressly authorized through the mandatory Director process, this document remains **specification-only**.

---

**END OF DOCUMENT**

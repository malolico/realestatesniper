# FACTORY INTEGRATION II.1
## SECURITY BOUNDARY SPECIFICATION

**Document ID:** `FACTORY_INTEGRATION_II_1_SECURITY_BOUNDARY_SPECIFICATION.md`  
**Phase:** Factory Integration  
**Block:** II.1  
**Document Type:** Constitutional Technical Specification  
**Status:** RECONSTRUCTED — DOCUMENTATION ONLY  
**Reconstruction basis:** Factory Integration II.2 (approved contract, implemented validator/sanitizer/integrity) and decisions already enforced by II.2-IMPL / II.2-IMPL.1  

---

## 1. Purpose

This document defines the **constitutional security boundary** of Factory Integration.

It establishes how Factory observation may be projected outward as a Read Model without:

- mutating Factory;
- exposing secrets or runtime internals;
- conflating Factory truth with Integration projection;
- treating UI gating as security;
- authorizing transport, AuthN/AuthZ, Edge, Producer deployment or II.3 by implication.

II.1 is the boundary constitution.  
II.2 is the contract that travels inside that boundary.

This document does **not** authorize new runtime systems. It records the boundary architecture already implied and enforced by the approved II.2 contract and its implemented validation stack.

---

## 2. Scope

This specification governs:

- purpose of the Integration security boundary;
- trust boundaries between Factory, Registry, Documentation, Integration and consumers;
- responsibilities of each side of the boundary;
- separation of Factory truth from Read Model projection;
- separation of Factory Runtime from Integration observation;
- data classification consequences for exposure;
- conceptual observation-to-projection flow;
- Integration components that enforce the boundary (as realized by II.2);
- restrictions and rejected architectures;
- relationship to II.2;
- acceptance criteria for the II.1 documentary reconstruction;
- documentary status.

This specification excludes (consistent with II.2):

- Factory Runtime execution (motors, loops, swarms, orchestration);
- Factory mutation;
- Producer deployment;
- authenticated GET boundary implementation;
- AuthN / AuthZ policy implementation;
- Edge Functions;
- Supabase writes;
- React / Factory Control Center / Marketplace changes;
- II.3 and later phases;
- any redesign of the Read Model Contract v2 schema.

---

## 3. Constitutional Principles

The following principles are binding for the Integration security boundary. They are the same principles already approved in II.2 and restated here as boundary law.

### SBP-01 — Factory remains source of truth

Factory is the sole authoritative source of operational truth. The Read Model is a projection and never replaces Factory.

### SBP-02 — Read-only across the boundary

Crossing the Integration boundary MUST NOT mutate Factory, Registry, Supabase, UI state, files, queues or external systems.

### SBP-03 — Observation is not execution

The boundary exposes observation semantics only. It MUST NOT execute business logic, motors, loops, swarms or orchestration.

### SBP-04 — Allowlist sanitization

Only explicitly allowed fields may leave the boundary. Secrets, credentials, tokens, environment variables, absolute local paths, stack traces, source code and mutable controls are prohibited.

### SBP-05 — Fail-closed

When validity, provenance, integrity, sanitization or ownership coherence cannot be established, publication MUST fail closed.

### SBP-06 — Explicit ownership

Each observation domain has an authoritative owner. Integration owns projection and sanitization only and MUST NOT claim ownership of Factory truth.

### SBP-07 — Explicit classification

Read Model payloads are classified `INTERNAL_OPS`. They are not public content.

### SBP-08 — UI gating is not security

UI-only authorization is insufficient. Public static hosting of snapshots is not an approved final architecture.

### SBP-09 — Bounded exposure

Payload size, nesting depth, expediente count, warning count and diagnostic detail MUST remain bounded.

### SBP-10 — Consumer independence

The boundary and contract MUST NOT be shaped around a specific UI, transport, framework or consumer.

### SBP-11 — Traceability without leakage

Snapshots MUST carry enough provenance, integrity, freshness and lineage metadata to establish origin and trust state without exposing secrets or host identity.

### SBP-12 — Separation of concerns

Factory observation, Registry observation, governance, drift, lineage, warnings and diagnostics remain semantically distinct across the boundary.

---

## 4. Trust Boundaries

The Integration security model recognizes the following trust domains.

| Domain | Trust role | Authority |
|--------|------------|-----------|
| **Factory** | Authoritative operational truth | Owns Factory state |
| **Registry** | Authoritative registry state when present; explicit `ABSENT` when not | Owns Registry state or absence |
| **Documentation** | Authoritative governance declarations | Owns governance declarations |
| **Integration** | Projection, sanitization, validation, integrity attachment | Owns Read Model projection only |
| **Consumer** | Untrusted relative to Factory internals | May consume validated Read Model only |
| **Future authenticated boundary** | Not authorized by this document | PARKING / FUTURE per II.2 |

### Boundary rules

1. Trust does **not** flow automatically from Factory to any consumer.
2. Absence of Registry MUST be represented as `ABSENT`; it MUST NOT be fabricated.
3. Provenance uncertainty MUST be visible (`PARTIAL` / `DEGRADED` / warnings) and MUST NOT be silently upgraded to healthy certainty.
4. Consumers MUST treat the Read Model as projection, never as mutable control plane.
5. Crossing outward requires allowlist sanitization and fail-closed validation as defined by II.2.

---

## 5. Responsibilities

### 5.1 Factory

- Remain source of operational truth.
- Must not be mutated by Integration Read Model flows.
- Runtime execution remains outside Integration observation duties.

### 5.2 Registry

- Provide registry observation when available.
- When unavailable, be reported as `ABSENT` with null metadata and zero entries.

### 5.3 Documentation / Governance

- Own constitutional approval declarations for governance metadata.
- Must not invent approval identity when missing.

### 5.4 Integration (security boundary owner)

- Project observable state into the Read Model Contract v2.
- Sanitize by allowlist.
- Validate fail-closed.
- Attach and verify integrity (SHA-256 over approved JCS-subset II.2 canonical bytes).
- Enforce ownership coherence (including `ownership.registry` ↔ `registryObservation.status`).
- Enforce freshness semantics (including mandatory `SNAPSHOT_STALE` when stale).
- Refuse prohibited nomenclature (`contractName`, `records`, `RECORDS_TRUNCATED`).
- Refuse unknown fields and unknown warning codes outside the approved catalog.

### 5.5 Consumers

- Verify `contractId` and supported major version.
- Verify integrity when available.
- Evaluate freshness.
- Respect `observationStatus`.
- Not infer absent data.
- Not treat warnings as executable instructions.
- Not mutate Factory through the contract.
- Not reinterpret `PARTIAL` as `HEALTHY`.

---

## 6. Separation: Factory / Read Model

```text
FACTORY (truth)
    │
    │  observation only (no mutation)
    ▼
INTEGRATION SECURITY BOUNDARY
    │  sanitize + validate + integrity
    ▼
READ MODEL CONTRACT v2  (projection, mode=READ_ONLY, classification=INTERNAL_OPS)
    │
    ▼
CONSUMERS (must not treat projection as Factory truth)
```

Mandatory consequences:

- `ownership.factory = "FACTORY"`.
- `ownership.readModel = "INTEGRATION"`.
- `mode = "READ_ONLY"`.
- The Read Model MUST NOT claim ownership over Factory truth.
- Classification upgrades beyond Factory-authoritative state are prohibited.

---

## 7. Separation: Runtime / Integration

| Concern | Factory Runtime | Integration |
|---------|-----------------|-------------|
| Motors / loops / swarms | Executes | Observes counts/status only |
| Orchestration | Executes | Must not execute |
| Secrets / env / paths | Internal | Must not cross boundary |
| Mutation | Runtime concern | Forbidden |
| Contract emission | Not a runtime duty | Integration duty via II.2 |
| Code location (current realization) | `src/factory/**` (out of Integration mutation scope) | `src/integration/readModel/**` |

Integration MAY observe runtime summary metrics already permitted by II.2 (`motorsObserved`, `loopsObserved`, `swarmsObserved`, `aiAssistantsObserved`) and MUST NOT include executable configuration, handlers, stack traces or secrets.

---

## 8. Data Classification

The Read Model that crosses the Integration boundary is classified:

**`INTERNAL_OPS`**

Consequences already approved by II.2:

- not public content;
- requires a future authenticated and authorized boundary for final exposure architecture;
- UI gating alone is insufficient;
- public static hosting is not an approved final architecture;
- logs and diagnostics MUST respect the same classification;
- logging MUST avoid payload bodies by default and MUST NOT become a secondary leak.

---

## 9. Conceptual Flow

```text
1. Observe sources (Factory / Registry / Documentation / COMPOSITE)
2. Record provenance (status per input; ABSENT explicit; no fabrication)
3. Build candidate projection (contractId, schemaVersion 2.0.0, ownership, observations, expedientes, warnings, diagnostics)
4. Enforce depth / size bounds
5. Allowlist sanitize (fail-closed on secrets, paths, stack traces, unknown fields, prohibited names)
6. Validate enums, timestamps, invariants, warning catalog, phase ids CB-00..CB-99, ownership↔registry coherence
7. Canonicalize (JCS-subset II.2) and verify SHA-256 checksum (excluding integrity.checksum)
8. Evaluate freshness; if stale, require SNAPSHOT_STALE
9. Emit validated Read Model snapshot OR fail closed
10. Future authenticated delivery boundary remains UNAUTHORIZED (II.2 parking)
```

Steps 4–9 are realized by the approved II.2 implementation stack. Step 10 remains outside current authorization.

---

## 10. Components (boundary enforcement realized by II.2)

The following Integration components enforce the security boundary already approved and implemented under II.2. II.1 does not redefine them; it situates them as boundary controls.

| Component | Boundary role |
|-----------|---------------|
| **Schema / allowlists** | Defines what may cross the boundary |
| **Sanitizer** | Allowlist emission; rejects prohibited data and unknown fields |
| **Invariants** | Cross-field trust rules (ownership, registry absence, Diamond, nomenclature) |
| **Depth / quota controls** | Bounded exposure (object/array depth, payload bytes, collection sizes) |
| **Validator** | Fail-closed gate before any notion of publication |
| **Canonicalization (JCS-subset II.2)** | Deterministic bytes for integrity |
| **Integrity (SHA-256)** | Tamper-evident checksum excluding `integrity.checksum` |
| **Fixtures / tests** | Demonstrate boundary refusal and acceptance behavior |

No Producer, Edge Function, AuthN/AuthZ gateway or Supabase writer is a component of II.1 as currently authorized.

---

## 11. Restrictions

The Integration security boundary MUST enforce:

1. Read-only projection only.
2. Fail-closed validation.
3. Unknown-field rejection at every object level.
4. Allowlist sanitization.
5. Explicit Registry absence (no fabrication).
6. Explicit ownership separation.
7. `INTERNAL_OPS` classification.
8. Integrity verification when checksum is present.
9. Freshness honesty (`SNAPSHOT_STALE` when stale).
10. Rejection of `contractName`, `records`, `RECORDS_TRUNCATED`.
11. No Factory Runtime mutation from Integration paths.
12. No treatment of UI-only gates as the security boundary.

---

## 12. Architectural Decisions (frozen from II.2)

1. Factory is source of truth; Integration owns projection only.
2. Contract identity uses `contractId` (not `contractName`).
3. Collection name is `expedientes` (not `records`).
4. Truncation warning is `EXPEDIENTES_TRUNCATED` (not `RECORDS_TRUNCATED`).
5. Schema version for the current contract is `2.0.0`.
6. Mode is `READ_ONLY`.
7. Data classification is `INTERNAL_OPS`.
8. Integrity uses SHA-256 over JCS-subset II.2 canonical UTF-8 bytes.
9. Public static snapshot exposure is not the final architecture.
10. Authenticated boundary, AuthZ policy, Producer deployment, Edge and II.3 remain unauthorized until separately approved.
11. Edge Function executing Factory is rejected.
12. Read Model mutating Factory is rejected.

---

## 13. Explicitly Out of Scope

The following are **outside** II.1 authorization (aligned with II.2 §39 PARKING / FUTURE and §40 status):

- authenticated GET boundary;
- authorization policy implementation;
- AuthN / AuthZ runtime;
- Producer deployment;
- atomic publication;
- historical snapshot retention;
- Supabase read model;
- BFF;
- Edge Functions;
- advanced observability platforms;
- schema registry;
- automated compatibility negotiation;
- cross-region publication;
- II.3 and later phases;
- React / Factory Control Center / Marketplace changes;
- any modification of `src/factory/**` under this block.

No PARKING / FUTURE item is authorized by this document.

---

## 14. Relationship to II.2

| Document | Role |
|----------|------|
| **II.1 (this document)** | Security boundary constitution: trust domains, separations, classification, restrictions |
| **II.2** | Read Model Contract v2: envelope, fields, invariants, sanitization rules, threat model detail, acceptance for contract implementation |

Dependency:

- II.2 assumes the boundary principles of II.1 (Factory truth, read-only, fail-closed, sanitization, `INTERNAL_OPS`, no UI-only security).
- II.1 does not alter II.2 schema or implementation.
- When describing contract fields, II.2 prevails.
- When describing trust and exposure boundaries, II.1 prevails as the boundary framing and MUST remain coherent with II.2.

II.2 threat model mitigations that belong to a later phase (authenticated boundary) remain future work and are **not** activated by reconstructing II.1.

---

## 15. Acceptance Criteria (documentary reconstruction)

II.1 reconstruction is complete when all of the following are true:

1. This document exists at the approved path.
2. It states Factory as sole operational source of truth.
3. It states read-only Integration projection.
4. It defines trust boundaries Factory / Registry / Documentation / Integration / Consumer.
5. It separates Factory truth from Read Model projection.
6. It separates Factory Runtime execution from Integration observation.
7. It records `INTERNAL_OPS` classification and non-public consequences.
8. It describes the conceptual observation → sanitize → validate → integrity flow already realized by II.2.
9. It lists Integration enforcement components without inventing Producer/Auth/Edge.
10. It explicitly excludes AuthN/AuthZ/Edge/Producer/II.3 unless later authorized.
11. It introduces no contradiction with II.2 vocabulary, ownership, mode, classification or fail-closed rules.
12. No code, schema, tests or Factory files are modified by the II.1 documentation action.

---

## 16. Documentary Status

- **II.1 Specification:** RECONSTRUCTED / APPROVED FOR DOCUMENTARY USE (Director-authorized reconstruction)
- **II.1 Implementation (Auth/Edge/Producer boundary runtime):** NOT AUTHORIZED
- **II.2 Specification:** APPROVED
- **II.2-IMPL:** IMPLEMENTED (closed by II.2-IMPL.1)
- **II.3:** NOT AUTHORIZED
- **Producer:** NOT AUTHORIZED
- **Authenticated Boundary:** NOT AUTHORIZED
- **Supabase Integration:** NOT AUTHORIZED
- **React / Factory Control Center changes:** NOT AUTHORIZED
- **Factory Runtime changes under this block:** PROHIBITED

---

## 17. Final Constitutional Clause

Any Integration exposure claiming compliance with Factory Integration MUST respect this security boundary.

II.1 does not weaken II.2. II.2 does not authorize bypass of II.1 trust separations.

No implementation may weaken read-only guarantees, sanitization, validation, provenance, integrity, freshness, ownership separation, fail-closed behavior or `INTERNAL_OPS` classification without explicit constitutional approval.

Reconstruction of this document restores the missing II.1 persistence; it does **not** authorize II.3 or any parked future boundary runtime.

---

**END OF DOCUMENT**

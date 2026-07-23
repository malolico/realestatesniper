# FACTORY INTEGRATION II.2
## READ MODEL CONTRACT v2 SPECIFICATION

**Document ID:** `FACTORY_INTEGRATION_II_2_READ_MODEL_CONTRACT_V2_SPECIFICATION.md`  
**Contract ID:** `factory.observability.read_model`  
**Schema Version:** `2.0.0`  
**Status:** APPROVED — SPECIFICATION ONLY  
**Phase:** Factory Integration  
**Block:** II.2  
**Document Type:** Constitutional Technical Specification  

---

## 1. Purpose

This document defines the constitutional contract for the Factory Integration Read Model v2.

The Read Model is a deterministic, read-only, sanitized and verifiable projection of Factory state. It exists to expose observable information without exposing Factory internals, execution mechanisms, secrets, mutable controls or operational capabilities.

This document specifies the contract only. It does not authorize implementation, runtime coupling, producer deployment, authentication, authorization, Edge Functions, Supabase integration, React changes, Factory Control Center changes, orchestration or any subsequent phase.

---

## 2. Scope

This specification governs:

- contract identity;
- semantic versioning;
- root envelope;
- ownership boundaries;
- source provenance;
- integrity metadata;
- freshness semantics;
- governance metadata;
- drift reporting;
- lineage reporting;
- `expedientes`;
- warnings;
- diagnostics;
- validation rules;
- fail-closed behavior;
- unknown-field rejection;
- migration rules;
- compatibility requirements;
- threat model;
- acceptance criteria.

This specification excludes:

- Factory Runtime execution;
- motors, loops, swarms or orchestration;
- Factory mutation;
- Producer implementation;
- authenticated boundary implementation;
- AuthN or AuthZ;
- Supabase writes;
- Edge Functions;
- UI changes;
- Factory Control Center changes;
- Marketplace changes;
- II.3 and later phases.

---

## 3. Constitutional Principles

### CP-01 — Factory remains source of truth

Factory is the sole authoritative source of operational truth. The Read Model is a projection and never replaces Factory.

### CP-02 — Read-only

The Read Model must not mutate Factory, Registry, Supabase, UI state, files, queues or external systems.

### CP-03 — Determinism

Equivalent validated inputs must produce equivalent canonical outputs.

### CP-04 — Consumer independence

The contract must not be shaped around a specific UI, transport, framework or consumer.

### CP-05 — No business execution

The contract contains data and observation semantics only. It must not execute business logic, motors, loops, swarms or orchestration.

### CP-06 — Sanitization

Only explicitly allowed fields may be emitted. Secrets, credentials, tokens, internal paths, stack traces, environment variables and private runtime internals are prohibited.

### CP-07 — Fail-closed

When contract validity, provenance, integrity, authorization context or sanitization cannot be established, publication must fail closed.

### CP-08 — Explicit versioning

Breaking changes require a new major schema version.

### CP-09 — Traceability

Every snapshot must provide enough metadata to establish origin, generation time, integrity state and lineage.

### CP-10 — Bounded exposure

Payload size, expediente count, warning count and diagnostic detail must remain bounded.

### CP-11 — Constitutional vocabulary

The approved terms are `contractId`, `expedientes` and `EXPEDIENTES_TRUNCATED`.

### CP-12 — Separation of concerns

Factory observation, Registry observation, governance, drift, lineage, warnings and diagnostics must remain semantically distinct.

---

## 4. Normative Language

The terms MUST, MUST NOT, SHALL, SHALL NOT, SHOULD and MAY are normative.

- **MUST / SHALL:** mandatory.
- **MUST NOT / SHALL NOT:** prohibited.
- **SHOULD:** recommended unless documented justification exists.
- **MAY:** optional and compatible.

---

## 5. Contract Identity and Versioning

The root contract MUST contain:

```json
{
  "contractId": "factory.observability.read_model",
  "schemaVersion": "2.0.0"
}
```

`contractName` is prohibited.

The contract uses semantic versioning:

- major: breaking structural or semantic changes;
- minor: backward-compatible additions;
- patch: backward-compatible corrections.

A consumer MUST reject unsupported major versions.

---

## 6. Root Envelope

The canonical root envelope is:

```json
{
  "contractId": "factory.observability.read_model",
  "schemaVersion": "2.0.0",
  "mode": "READ_ONLY",
  "snapshotId": "string",
  "generatedAt": "RFC3339 timestamp",
  "staleAfter": "RFC3339 timestamp",
  "environment": "development | test | staging | production | unknown",
  "dataClassification": "INTERNAL_OPS",
  "producer": {},
  "sourceProvenance": {},
  "integrity": {},
  "observationStatus": "HEALTHY | DEGRADED | PARTIAL | UNAVAILABLE | INVALID",
  "factoryObservation": {},
  "registryObservation": {},
  "governance": {},
  "drift": {},
  "lineage": {},
  "expedientes": [],
  "warnings": [],
  "diagnostics": {}
}
```

All root fields are required unless explicitly stated otherwise in this specification.

Unknown root fields MUST be rejected.

---

## 7. Root Field Definitions

### 7.1 `contractId`

- type: string;
- required;
- exact value: `factory.observability.read_model`.

### 7.2 `schemaVersion`

- type: string;
- required;
- exact supported value for this contract: `2.0.0`.

### 7.3 `mode`

- type: string;
- required;
- exact value: `READ_ONLY`.

### 7.4 `snapshotId`

- type: string;
- required;
- non-empty;
- unique per generated snapshot;
- MUST NOT contain secrets or local paths.

### 7.5 `generatedAt`

- type: RFC3339 timestamp;
- required;
- UTC recommended.

### 7.6 `staleAfter`

- type: RFC3339 timestamp;
- required;
- MUST be later than or equal to `generatedAt`.

### 7.7 `environment`

Allowed values:

- `development`
- `test`
- `staging`
- `production`
- `unknown`

### 7.8 `dataClassification`

- required;
- exact value in v2: `INTERNAL_OPS`.

### 7.9 `observationStatus`

Allowed values:

- `HEALTHY`
- `DEGRADED`
- `PARTIAL`
- `UNAVAILABLE`
- `INVALID`

`INVALID` MUST NOT be published to normal consumers; it is reserved for validation failure reporting in controlled internal tooling.

---

## 8. Producer Metadata

`producer` identifies the component that generated the snapshot.

Canonical shape:

```json
{
  "producerId": "string",
  "producerVersion": "string",
  "generatedBy": "string",
  "hostClass": "local | server | ci | unknown"
}
```

Rules:

- all fields required;
- no hostname, username, absolute path, token or secret may be exposed;
- `generatedBy` identifies a logical component, not a person;
- unknown fields are rejected.

---

## 9. Ownership

Ownership defines which source is authoritative for each observation domain.

Canonical shape:

```json
{
  "factory": "FACTORY",
  "registry": "REGISTRY | ABSENT",
  "governance": "DOCUMENTATION",
  "readModel": "INTEGRATION"
}
```

Rules:

- Factory owns Factory operational state.
- Registry owns Registry state when present.
- Documentation owns governance declarations.
- Integration owns projection and sanitization only.
- The Read Model MUST NOT claim ownership over Factory truth.

---

## 10. Source Provenance

Canonical shape:

```json
{
  "sourceType": "LOCAL_FILES | FACTORY_RUNTIME | REGISTRY | COMPOSITE",
  "sourceRevision": "string",
  "observedAt": "RFC3339 timestamp",
  "inputs": [
    {
      "sourceId": "string",
      "sourceKind": "string",
      "revision": "string",
      "status": "AVAILABLE | PARTIAL | ABSENT | INVALID"
    }
  ]
}
```

Rules:

- `sourceRevision` MUST identify the observed revision without exposing secrets.
- Each input MUST be independently classified.
- Missing Registry MUST be represented as `ABSENT`, not fabricated.
- Provenance uncertainty MUST downgrade `observationStatus`.

---

## 11. Integrity

Canonical shape:

```json
{
  "algorithm": "SHA-256",
  "canonicalization": "JCS",
  "checksum": "lowercase hexadecimal string",
  "verified": true
}
```

Rules:

- checksum is computed over the canonical payload according to the approved implementation procedure;
- the checksum field itself MUST be excluded from its own checksum calculation;
- `verified` MUST be false when verification was not completed;
- invalid integrity MUST fail closed.

---

## 12. Freshness

Freshness is derived from `generatedAt`, `staleAfter` and current consumer time.

Canonical semantics:

- fresh: current time is before or equal to `staleAfter`;
- stale: current time is later than `staleAfter`;
- invalid: timestamp order or format is invalid.

The producer MUST NOT label stale data as fresh.

A stale snapshot MAY be delivered only when explicitly permitted by the future boundary, and MUST carry warning code `SNAPSHOT_STALE`.

---

## 13. Factory Observation

Canonical shape:

```json
{
  "status": "AVAILABLE | PARTIAL | UNAVAILABLE | INVALID",
  "phaseRange": {
    "from": "CB-00",
    "to": "CB-15"
  },
  "implementedPhases": [],
  "approvedPhases": [],
  "blockedPhases": [],
  "runtimeSummary": {
    "motorsObserved": 0,
    "loopsObserved": 0,
    "swarmsObserved": 0,
    "aiAssistantsObserved": 0
  }
}
```

Rules:

- counts MUST be non-negative integers;
- phase identifiers MUST follow approved Factory vocabulary;
- no executable configuration may be included;
- no runtime handler code, secrets or internal stack traces may be included;
- partial observation MUST be explicit.

---

## 14. Registry Observation

Canonical shape:

```json
{
  "status": "AVAILABLE | PARTIAL | ABSENT | INVALID",
  "registryVersion": "string | null",
  "entriesObserved": 0,
  "lastObservedAt": "RFC3339 timestamp | null"
}
```

Rules:

- Registry absence is valid and MUST be represented by `ABSENT`;
- when status is `ABSENT`, `registryVersion` and `lastObservedAt` MUST be null and `entriesObserved` MUST be zero;
- fabricated Registry data is prohibited.

---

## 15. Governance

Canonical shape:

```json
{
  "constitutionalStatus": "COMPLIANT | DEGRADED | NON_COMPLIANT | UNKNOWN",
  "approvedBy": "string | null",
  "approvedAt": "RFC3339 timestamp | null",
  "activeBlock": "string",
  "blockedBlocks": [],
  "parking": []
}
```

Rules:

- approval identity MUST come from approved documentation;
- missing approval data MUST be null, not inferred;
- future or parked work MUST not be reported as active;
- II.2-IMPL and II.3 remain blocked until explicitly authorized.

---

## 16. Drift

Canonical shape:

```json
{
  "status": "NONE | DETECTED | UNKNOWN",
  "items": [
    {
      "code": "string",
      "severity": "INFO | WARNING | ERROR",
      "area": "string",
      "expected": "string",
      "observed": "string"
    }
  ]
}
```

Rules:

- drift is observational;
- it MUST NOT auto-correct any source;
- unknown fields are rejected;
- severity does not authorize mutation.

---

## 17. Lineage

Canonical shape:

```json
{
  "previousSnapshotId": "string | null",
  "parentSnapshotId": "string | null",
  "generationSequence": 0,
  "sourceRevision": "string"
}
```

Rules:

- `generationSequence` MUST be a non-negative integer;
- lineage MUST not fabricate predecessors;
- first snapshot MAY use null predecessor fields;
- lineage mismatch MUST produce a warning or validation failure according to severity.

---

## 18. Expedientes

`expedientes` is the official collection name.

The term `records` is prohibited in the contract.

Canonical item shape:

```json
{
  "expedienteId": "string",
  "classification": "DEAL | PREMIUM | DIAMOND | UNCLASSIFIED",
  "status": "OBSERVED | PARTIAL | BLOCKED | INVALID",
  "identityVerified": false,
  "valueVerified": false,
  "pricingVerified": false,
  "offMarket": false,
  "ownerVerified": false,
  "commercializationAuthorized": false,
  "evidenceRefs": [],
  "warningCodes": []
}
```

Rules:

- `expedienteId` MUST be stable and non-secret;
- evidence references MUST not expose raw confidential evidence;
- `DIAMOND` requires, at minimum:
  - `offMarket = true`;
  - `ownerVerified = true`;
  - `commercializationAuthorized = true`;
- a contract implementation MUST NOT upgrade classification beyond Factory-authoritative state;
- invalid expedientes MUST be omitted from normal publication or represented as blocked according to implementation policy;
- expediente count MUST be bounded.

When the collection is truncated, warning code MUST be:

`EXPEDIENTES_TRUNCATED`

---

## 19. Warnings

Canonical shape:

```json
{
  "code": "string",
  "severity": "INFO | WARNING | ERROR",
  "scope": "SNAPSHOT | FACTORY | REGISTRY | GOVERNANCE | EXPEDIENTE",
  "message": "sanitized string",
  "expedienteId": "string | null"
}
```

Approved baseline warning codes include:

- `SNAPSHOT_STALE`
- `SOURCE_PARTIAL`
- `REGISTRY_ABSENT`
- `INTEGRITY_UNVERIFIED`
- `EXPEDIENTES_TRUNCATED`
- `DIAGNOSTICS_TRUNCATED`
- `DRIFT_DETECTED`
- `LINEAGE_INCOMPLETE`

Rules:

- messages MUST be sanitized;
- stack traces, tokens, paths and credentials are prohibited;
- warning count MUST be bounded;
- unknown warning fields are rejected.

---

## 20. Diagnostics

Canonical shape:

```json
{
  "status": "AVAILABLE | PARTIAL | DISABLED",
  "summary": "sanitized string",
  "checks": [
    {
      "checkId": "string",
      "status": "PASS | WARN | FAIL | SKIP",
      "message": "sanitized string"
    }
  ]
}
```

Rules:

- diagnostics are descriptive only;
- diagnostics MUST NOT include stack traces, source code, secrets, environment variables or absolute filesystem paths;
- diagnostic checks MUST be bounded;
- production diagnostics SHOULD be less detailed than development diagnostics;
- unknown fields are rejected.

---

## 21. Partial Failure Semantics

A snapshot MAY represent partial failure only when:

- the valid portions remain trustworthy;
- failed sources are explicitly identified;
- `observationStatus` is `PARTIAL` or `DEGRADED`;
- warnings explain the affected scope;
- integrity of the published payload remains valid.

A snapshot MUST be rejected when:

- root contract validation fails;
- required provenance is missing;
- integrity verification fails;
- unknown fields are present;
- prohibited data is detected;
- timestamps are invalid;
- the payload cannot be sanitized safely.

---

## 22. Validation Rules

Validation MUST occur before publication.

Minimum validation stages:

1. parse;
2. root type validation;
3. exact `contractId` validation;
4. supported `schemaVersion` validation;
5. required field validation;
6. unknown-field rejection;
7. enum validation;
8. timestamp validation;
9. cross-field invariant validation;
10. sanitization validation;
11. size and quota validation;
12. canonicalization;
13. checksum verification.

Validation MUST be deterministic and fail closed.

---

## 23. Unknown Fields Policy

Unknown fields are prohibited at every object level.

The validator MUST reject any object containing fields not explicitly defined by this specification or its approved implementation schema.

This policy prevents silent contract drift and accidental data exposure.

Backward-compatible extensions require a schema version update and explicit approval.

---

## 24. Core Invariants

The following invariants are mandatory:

- `contractId === "factory.observability.read_model"`;
- `schemaVersion === "2.0.0"`;
- `mode === "READ_ONLY"`;
- `dataClassification === "INTERNAL_OPS"`;
- `generatedAt <= staleAfter`;
- `snapshotId` is non-empty;
- `expedientes` is an array;
- counts are non-negative integers;
- Registry `ABSENT` implies zero entries and null metadata;
- `DIAMOND` implies `offMarket`, `ownerVerified` and `commercializationAuthorized`;
- checksum format matches SHA-256 hexadecimal output;
- no prohibited field names or values are present;
- no unknown fields are present;
- warning and diagnostic quotas are respected;
- `records` MUST NOT appear;
- `contractName` MUST NOT appear;
- `RECORDS_TRUNCATED` MUST NOT appear.

---

## 25. Sanitization Requirements

The sanitizer MUST:

- operate from an allowlist;
- remove or reject secrets;
- remove or reject credentials;
- remove or reject tokens;
- remove or reject environment variables;
- remove or reject absolute local paths;
- remove or reject stack traces;
- remove or reject source code;
- remove or reject mutable controls;
- preserve approved semantic values;
- produce deterministic output;
- avoid silently inventing defaults for unknown authoritative data.

When safe sanitization cannot be guaranteed, publication MUST fail closed.

---

## 26. Quotas and Bounds

The implementation MUST define explicit limits for:

- maximum payload bytes;
- maximum number of expedientes;
- maximum warnings;
- maximum diagnostics checks;
- maximum string length;
- maximum array depth;
- maximum object depth.

When `expedientes` is truncated, `EXPEDIENTES_TRUNCATED` MUST be emitted.

When diagnostics are truncated, `DIAGNOSTICS_TRUNCATED` MUST be emitted.

Exact numeric limits belong to II.2-IMPL and MUST not alter the semantics defined here.

---

## 27. Canonicalization and Checksum

The approved canonicalization identifier is `JCS`.

The checksum algorithm is `SHA-256`.

The implementation MUST document the exact checksum scope and MUST exclude the checksum value itself from the checksum input.

Equivalent semantic payloads MUST produce identical canonical bytes and identical checksums.

---

## 28. Migration from v1

Migration to v2 is a breaking migration.

Mandatory nomenclature changes:

- `contractName` → `contractId`;
- `records` → `expedientes`;
- `RECORDS_TRUNCATED` → `EXPEDIENTES_TRUNCATED`;
- `schemaVersion` → `2.0.0`.

Migration rules:

- v1 and v2 MUST not be mixed in one payload;
- v2 consumers MUST reject v1 payloads unless a separately approved compatibility adapter exists;
- a future adapter MUST remain read-only and isolated;
- no adapter is authorized by this document;
- migration MUST preserve source truth and must not fabricate missing fields.

---

## 29. Compatibility

A change is backward compatible only when existing v2 consumers can continue validating and interpreting the contract without semantic ambiguity.

The following require a major version:

- removing required fields;
- renaming fields;
- changing field types;
- changing enum semantics;
- weakening security or sanitization guarantees;
- changing ownership semantics;
- changing integrity semantics.

The following may use a minor version after approval:

- adding optional fields;
- adding optional warning codes;
- adding compatible enum values where consumers are designed to reject or tolerate them explicitly.

---

## 30. Threat Model

The contract MUST defend against:

- accidental public exposure;
- secret leakage;
- path leakage;
- stack-trace leakage;
- schema drift;
- unknown-field smuggling;
- stale-data misrepresentation;
- forged provenance;
- checksum tampering;
- lineage fabrication;
- unauthorized classification upgrades;
- oversized payload denial of service;
- malicious strings;
- consumer confusion between Factory truth and projection;
- Registry fabrication;
- UI-only authorization being treated as security.

Mitigations include:

- authenticated boundary in a later authorized phase;
- allowlist sanitization;
- strict schema validation;
- fail-closed publication;
- checksum verification;
- bounded payloads;
- explicit freshness;
- explicit ownership;
- explicit provenance;
- no public static snapshot as final architecture.

---

## 31. Data Classification

The v2 Read Model is classified as:

`INTERNAL_OPS`

Consequences:

- it is not public content;
- it requires a future authenticated and authorized boundary;
- UI gating alone is insufficient;
- public static hosting is not an approved final architecture;
- logs and diagnostics must respect the same classification.

---

## 32. Logging Requirements

Future implementation logging MUST:

- avoid payload bodies by default;
- avoid secrets and PII;
- record validation outcome;
- record contract version;
- record snapshot identifier;
- record publication success or failure;
- record checksum verification state;
- remain bounded and sanitized.

Logging MUST NOT become a secondary data leak.

---

## 33. Consumer Requirements

A compliant consumer MUST:

- verify supported `contractId`;
- verify supported major version;
- verify integrity when available;
- evaluate freshness;
- respect `observationStatus`;
- not infer absent data;
- not treat warnings as executable instructions;
- not mutate Factory through the contract;
- not reinterpret `PARTIAL` as `HEALTHY`;
- reject unknown fields when performing strict validation.

---

## 34. Acceptance Criteria

II.2-IMPL may be considered complete only when all of the following are demonstrated:

1. schema v2 exists;
2. validator exists;
3. unknown fields are rejected;
4. required fields are enforced;
5. all core invariants are tested;
6. `contractId` is used and `contractName` is rejected;
7. `expedientes` is used and `records` is rejected;
8. `EXPEDIENTES_TRUNCATED` is used and `RECORDS_TRUNCATED` is rejected;
9. sanitization is allowlist-based;
10. prohibited data causes failure;
11. canonicalization is deterministic;
12. checksum behavior is tested;
13. freshness behavior is tested;
14. Registry absence behavior is tested;
15. partial failure behavior is tested;
16. Diamond invariants are tested;
17. fixture coverage includes healthy, stale, partial, absent Registry and invalid payloads;
18. no Factory runtime mutation exists;
19. no React, Supabase, Edge or II.3 implementation is introduced;
20. all tests pass.

---

## 35. Required Fixtures for II.2-IMPL

The implementation SHOULD include at least:

- valid healthy snapshot;
- valid degraded snapshot;
- valid partial snapshot;
- valid Registry-absent snapshot;
- valid stale snapshot;
- valid zero-expediente snapshot;
- valid Diamond expediente snapshot;
- invalid unknown-root-field snapshot;
- invalid unknown-nested-field snapshot;
- invalid `contractName` snapshot;
- invalid `records` snapshot;
- invalid `RECORDS_TRUNCATED` snapshot;
- invalid timestamp ordering snapshot;
- invalid checksum snapshot;
- invalid Diamond invariant snapshot;
- invalid prohibited-data snapshot;
- oversized or quota-exceeded snapshot.

---

## 36. Required Tests for II.2-IMPL

Tests MUST cover:

- schema acceptance;
- schema rejection;
- exact enums;
- required fields;
- additional properties rejection;
- cross-field invariants;
- deterministic serialization;
- checksum generation and verification;
- stale detection;
- truncation warnings;
- sanitizer allowlist behavior;
- prohibited-field detection;
- partial-failure semantics;
- Registry absence;
- Diamond requirements;
- migration nomenclature rejection.

---

## 37. Constitutional Decisions

The following decisions are final for II.2:

- the contract identifier is `contractId`;
- the contract collection is `expedientes`;
- truncation warning is `EXPEDIENTES_TRUNCATED`;
- schema version is `2.0.0`;
- mode is `READ_ONLY`;
- data classification is `INTERNAL_OPS`;
- validation is fail-closed;
- unknown fields are rejected;
- Factory remains source of truth;
- Registry absence is explicit;
- integrity uses SHA-256;
- canonicalization identifier is JCS;
- public static snapshot exposure is not the final architecture;
- implementation does not authorize II.3.

---

## 38. Rejected Alternatives

The following are rejected for II.2:

- `contractName`;
- `records`;
- `RECORDS_TRUNCATED`;
- permissive unknown fields;
- silent schema drift;
- UI-only security;
- direct public static exposure as final architecture;
- Edge Function executing Factory;
- Read Model mutating Factory;
- fabricated Registry state;
- consumer-specific contract design;
- business logic inside the contract.

---

## 39. PARKING / FUTURE

The following remain outside the current authorization:

- authenticated GET boundary;
- authorization policy implementation;
- Producer deployment;
- atomic publication;
- historical snapshot retention;
- Supabase read model;
- BFF;
- advanced observability;
- schema registry;
- automated compatibility negotiation;
- cross-region publication;
- II.3 and later phases.

No PARKING / FUTURE item is authorized by this document.

---

## 40. Implementation Status

- **II.2 Specification:** APPROVED
- **II.2-IMPL:** NOT AUTHORIZED until explicit instruction
- **II.3:** NOT AUTHORIZED
- **Producer:** NOT AUTHORIZED
- **Authenticated Boundary:** NOT AUTHORIZED
- **Supabase Integration:** NOT AUTHORIZED
- **React / Factory Control Center changes:** NOT AUTHORIZED
- **Factory Runtime changes:** PROHIBITED under this block

---

## 41. Final Constitutional Clause

Any implementation claiming compliance with Factory Integration II.2 MUST conform to this document in full.

When implementation behavior conflicts with this specification, this specification prevails until a formally approved amendment or higher contract version is issued.

No implementation may weaken read-only guarantees, sanitization, validation, provenance, integrity, freshness, ownership separation or fail-closed behavior without explicit constitutional approval.

---

**END OF DOCUMENT**

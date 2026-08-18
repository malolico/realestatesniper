# STRATEGIC PROGRAM 11 — LIVE DISCOVERY
## SP11-P1 — IMPLEMENTATION SCOPE FREEZE
### Bounded runtime surfaces · phasing · zero-network acceptance (documentary · ≠ Grant · ≠ EXECUTE · ≠ LIVE HTTP)
#### Document ID: SP11-P1-IMPLEMENTATION-SCOPE-FREEZE-01

| Campo | Valor |
|-------|--------|
| **Document ID** | **`SP11-P1-IMPLEMENTATION-SCOPE-FREEZE-01`** |
| **Document type** | **SP11-P1 Implementation Scope Freeze** |
| **File ID** | `FACTORY_EVOLUTION_SP11_P1_IMPLEMENTATION_SCOPE_FREEZE.md` |
| **Path** | `docs/factory-evolution/FACTORY_EVOLUTION_SP11_P1_IMPLEMENTATION_SCOPE_FREEZE.md` |
| **Nature** | Continuity **DOCUMENTARY IMPLEMENTATION SCOPE FREEZE** for SP11-P1 · freezes exact authorized runtime file surfaces · internal implementation phasing · consume-only / no-touch boundaries · zero-network acceptance obligations · subordinate to Contract Freeze · **≠ Grant** · **≠ EXECUTE** · **≠ LIVE execution** · **≠ LIVE HTTP** · **≠ credentials** · **≠ P2+** · **≠ SP11 COMPLETE** |
| **Program** | **Strategic Program 11 — LIVE Discovery** |
| **Phase** | **SP11-P1 — Bounded LIVE acquisition boundary** |
| **Freeze class** | **IMPLEMENTATION SCOPE** (physical surfaces + phasing + acceptance matrix) |
| **Parent Contract Freeze** | `SP11-P1-LIVE-DISCOVERY-FREEZE-01` · Continuity Commit **`0146cf9815cfc2408b973f4d2634f28e1e8115e9`** · **BINDING / READ-ONLY** |
| **Parent Pre-Implementation Design Audit** | Session STRICT READ-ONLY · Verdict **A — SP11-P1 PHYSICAL DESIGN PROVED** · **BINDING physical design authority** |
| **Parent SP10 Complete** | `SP10-COMPLETE-STATUS-01` · Continuity Commit **`bbce142deab6422270b755b559499954203ebfd5`** · **CLOSED / READ-ONLY** |
| **Parent SP09 Complete** | `SP09-COMPLETE-STATUS-01` · Continuity Commit **`8cc091fc9949082c080d12fe9952a0eaf64a1cf4`** · **CLOSED / READ-ONLY** |
| **Authorizing Director act** | Implementation Scope Freeze publication · **NO** runtime IMPL · **NO** LIVE execution · **NO** token · **NO** HTTP |
| **Entry tip (pre-publication)** | **`0146cf9815cfc2408b973f4d2634f28e1e8115e9`** |
| **Date** | **2026-08-18** |
| **Branch** | `integration/factory-complete-20260725` |
| **Mode** | **DOCUMENTARY FREEZE ONLY** |

```text
SP11-P1-IMPLEMENTATION-SCOPE-FREEZE-01
  = DOCUMENTARY IMPLEMENTATION SCOPE ONLY
  = PHYSICAL RUNTIME SURFACES FROZEN
  = D1–D5 NOT REOPENED

P1 IMPLEMENTATION AUTHORITY = NONE
P1 EXECUTE                  = NOT AUTHORIZED
P1 GRANT                    = NOT ISSUED
LIVE EXECUTION              = NOT AUTHORIZED
LIVE_HTTP                   = FORBIDDEN
SP11-P2+                    = NOT OPENED
SP11 COMPLETE               = NO
```

---

## 0. Absolute non-authorization banner

```text
THIS SCOPE FREEZE DOES NOT AUTHORIZE CODE.
THIS SCOPE FREEZE DOES NOT AUTHORIZE LIVE HTTP.
THIS SCOPE FREEZE DOES NOT AUTHORIZE CREDENTIALS.

SCOPE FREEZE PUBLISHED ≠ GRANT
SCOPE FREEZE PUBLISHED ≠ EXECUTE
SCOPE FREEZE PUBLISHED ≠ LIVE EXECUTION
SCOPE FREEZE PUBLISHED ≠ LIVE HTTP
SCOPE FREEZE PUBLISHED ≠ TOKEN
SCOPE FREEZE PUBLISHED ≠ PRODUCTION READY

IMPLEMENTATION APPROVAL ≠ LIVE EXECUTION APPROVAL
SOURCE SELECTED             ≠ EXECUTION AUTHORIZED
```

Subordinate to **`SP11-P1-LIVE-DISCOVERY-FREEZE-01`** without amendment. D1–D5, execution wall, authority wall, and PARKING wall remain immutable.

---

## 1. Authority chain (consumed · unchanged)

| Instrument | Posture |
|------------|---------|
| `SP11-P1-LIVE-DISCOVERY-FREEZE-01` @ `0146cf9…` | **BINDING** contract / scope parent |
| Pre-Implementation Physical Design Audit (session) | **BINDING** physical design |
| `SP10-COMPLETE-STATUS-01` | **CLOSED / READ-ONLY** · RECORDED_ONLY |
| `SP09-COMPLETE-STATUS-01` | **CLOSED / READ-ONLY** |
| P-INT-02 RECORDED_ONLY connectors | **ANTECEDENT / NO-TOUCH** |

```text
THIS SCOPE FREEZE ≠ AMEND CONTRACT FREEZE
THIS SCOPE FREEZE ≠ REOPEN D1–D5
THIS SCOPE FREEZE ≠ AUTHORIZE FIRST ASSESSOR GET
```

---

## 2. Implementation phasing (internal slices · binding)

These are **implementation slices inside SP11-P1 only**. They do **not** create new programs or phases.

| Slice | Authorized scope | Real HTTP |
|-------|------------------|-----------|
| **P1-A** | LIVE observation contract · LIVE execution guard · identity/temporal helpers · zero-network unit proof | **FORBIDDEN** |
| **P1-B** | LIVE sibling Discovery pipeline · mock/injected transport · shared downstream consumption (dedup / signal / candidate / materiality / identity / handoff) | **FORBIDDEN** |
| **P1-C** | Bounded Maricopa Assessor client · fail-closed response adapter · client remains behind execution guard | **FORBIDDEN at implementation time** |
| **P1-D** | Full zero-network SP11 validator · export-only integration · regression acceptance | **FORBIDDEN** |

```text
P1-C transport code MAY exist but MUST remain mechanically unable to perform
an authorized real Assessor GET until separate LIVE execution approval exists.

Default authorization envelope keeps LIVE_HTTP = FORBIDDEN even after P1-D.
```

---

## 3. NEW runtime file surface (binding)

Exactly **6** new runtime files are authorized for future SP11-P1 implementation:

| Path | Role |
|------|------|
| `src/factory/cb02/discovery/liveObservationContract.js` | LIVE manifest schema · identity/temporal helpers · LIVE signal wrapper · validation · authority |
| `src/factory/cb02/discovery/liveExecutionGuard.js` | 3-flag authorization envelope · fail-closed pre-transport gate |
| `src/factory/cb02/discovery/maricopaAssessorLiveClient.js` | bounded transport (guard-gated · injectable) |
| `src/factory/cb02/discovery/maricopaAssessorLiveResponseAdapter.js` | fail-closed explicit JSON mapping |
| `src/factory/cb02/discovery/liveDiscoveryPipeline.js` | sibling pipeline → shared Discovery semantics → STOP at handoff |
| `src/factory/cb02/validateSp11LiveDiscovery.js` | zero-network acceptance harness |

```text
AUTHORIZED NEW RUNTIME FILE COUNT = 6
Any additional runtime file = STOP · report before creation
```

### Optional helper rule

A separate `liveDiscoverySignalContract.js` is **NOT authorized by default**.

LIVE signal wrapping **must remain inside** `liveObservationContract.js` unless implementation proves separation is technically necessary. If such necessity appears: **STOP** and report before creating an extra file.

---

## 4. MODIFIED runtime file surface (binding)

Exactly **1** existing runtime file may be modified:

| Path | Allowed delta |
|------|----------------|
| `src/factory/cb02/index.js` | **EXPORT-ONLY** · add SP11-P1 public exports |

```text
FORBIDDEN: behavioral modification of existing exports
FORBIDDEN: modification of any other existing runtime file
If another runtime file appears necessary: STOP
```

Proposed export-only additions (future IMPL):

- `processLiveObservation` (or equivalent frozen pipeline entry)
- `runSp11LiveDiscoveryValidation`

---

## 5. CONSUME-ONLY surfaces (binding)

Future implementation **MAY import/use** but **MUST NOT modify**:

### Discovery shared downstream

| Path |
|------|
| `src/factory/cb02/discovery/discoveryCandidateContract.js` |
| `src/factory/cb02/discovery/discoveryMaterialityGate.js` |
| `src/factory/cb02/discovery/discoveryDedupRegistry.js` |
| `src/factory/cb02/discovery/discoveryHandoff.js` |

### Connectors / checksums / schemas

| Path |
|------|
| `src/factory/cb02/connectors/payloadSchemas.js` |
| `src/factory/cb02/connectors/recordedPackChecksums.js` |
| `src/factory/cb02/connectors/canonicalPropertyFactAdapter.js` |

### Import-only from SP10 observation contract

| Path | Allowed import | Forbidden import |
|------|----------------|------------------|
| `src/factory/cb02/discovery/recordedObservationContract.js` | `computeDiscoveryDedupKey` | `validateRecordedObservation` · `buildDiscoveryCandidateRef` |

### Import-only from checksums

| Path | Allowed import |
|------|----------------|
| `src/factory/cb02/connectors/recordedPackChecksums.js` | `sha256Hex` |

### External consume-only (repo-truth paths)

| Symbol | Path |
|--------|------|
| `buildCanonicalPropertyFact` | `src/factory/cb02/connectors/canonicalPropertyFactAdapter.js` |
| `resolvePropertyIdentity` | `src/factory/cb05/propertyIdentityResolver.js` |
| `getOrganism` | `src/factory/cb02/sourceOrganismsCatalog.js` |
| `normalizeJurisdiction` | `src/factory/cb02/jurisdictionRegistry.js` |
| `FactoryRegistry` | `src/factory/cb01/factoryRegistry.js` |
| `FileElrStore` | `src/factory/cb01/fileElrStore.js` |
| `SCHEMA_ASR_MC_V1` | `src/factory/cb02/connectors/payloadSchemas.js` |

### Pipeline consume-only helper

| Symbol | Path | Rule |
|--------|------|------|
| `sanitizeDiscoveryFactoryKey` | `src/factory/cb02/discovery/recordedDiscoveryPipeline.js` | import-only · do not modify pipeline |

---

## 6. NO-TOUCH surfaces (binding)

Future implementation **MUST NOT modify**:

| Surface |
|---------|
| `src/factory/cb02/discovery/recordedObservationContract.js` |
| `src/factory/cb02/discovery/recordedDiscoveryPipeline.js` |
| `src/factory/cb02/discovery/discoverySignalContract.js` |
| `src/factory/cb02/validateSp10RecordedDiscovery.js` |
| `src/factory/cb02/connectors/connectorContract.js` |
| `src/factory/cb02/connectors/maricopaConnectorContracts.js` |
| `data/**` |
| all recorded packs |
| `.gitattributes` |
| SP09 runtime/docs |
| SP10 runtime/docs |
| `docs/factory-evolution/FACTORY_EVOLUTION_SP11_P1_LIVE_DISCOVERY_CONTRACT_FREEZE.md` |
| database |
| dependencies / package manifests |
| authentication · RLS · Storage · Edge Functions |

```text
SP10 = CLOSED / RECORDED_ONLY
LIVE must not enter processRecordedObservation
LIVE must not call buildDiscoveryCandidateRef
```

---

## 7. LIVE contract freeze (binding)

| Campo | Frozen value |
|-------|----------------|
| **schemaId** | `rsn.cb02.discovery.liveObservation.v1` |
| **schemaVersion** | `1` |
| **sourceMode** | `LIVE` |
| **liveFetch** | `true` |
| **organismId** | `ORG-ASR-MC` |
| **familyId** | `REGISTRAL_ASSESSOR` |
| **payloadSchemaId** | `maricopa.assessor.payload.v1` |

### Identity (binding)

```text
apnToken =
  uppercase raw APN with non-alphanumeric characters removed

observationId =
  live-{organismId}-{apnToken}

candidateRef =
  live-{organismId}-{apnToken}

UUID / random identity = FORBIDDEN
buildDiscoveryCandidateRef = FORBIDDEN for LIVE
```

### Fingerprint / dedup (binding)

```text
payloadFingerprint =
  deterministic SHA-256 of stable payload serialization

dedupKey =
  existing four-part Discovery formula using:
    observationId
    organismId (via sourceIdentity)
    payloadFingerprint
    observedAt

signalId    = dedupKey
candidateId = dedupKey
```

Implementation **MAY** compute `dedupKey` via imported `computeDiscoveryDedupKey` without modifying SP10 file.

---

## 8. Temporal freeze (binding)

| Field | Rule |
|-------|------|
| **receivedAt** | **REQUIRED** · Factory receipt time after complete response body receipt · ISO-8601 |
| **observedAt** | **REQUIRED** · documented source timestamp **OR** literal `UNKNOWN` |

**FORBIDDEN:**

```text
receivedAt as observedAt
Factory clock as source observation time
SP10 recordedAt on LIVE observations
DSO vintageAt / acquiredAt as Discovery receivedAt
receivedAt in dedup identity
```

LIVE signal wrapper **must** carry `receivedAt` and **must not** populate SP10 `recordedAt` semantics on LIVE observations.

Shared `buildDiscoverySignal` in `discoverySignalContract.js` remains **NO-TOUCH**; LIVE uses wrapper inside `liveObservationContract.js`.

---

## 9. Execution guard freeze (binding)

### Authorization envelope

| Field | Default |
|-------|---------|
| `tokenAvailable` | `false` |
| `tokenExternalToRepo` | `false` |
| `directorLiveExecutionApproval` | `false` |

```text
LIVE HTTP requires ALL THREE = true
Otherwise fail closed
Guard MUST execute before transport invocation
```

### Token prohibition

No token value may enter:

```text
observation · provenance · logs · errors · git · fixtures · validator output
```

Zero-network validators **must** prove `transport.callCount = 0` whenever the wall is incomplete.

Refusal codes (minimum): `LIVE_EXECUTION_NOT_AUTHORIZED` · `LIVE_HTTP_FORBIDDEN`.

---

## 10. Network boundary freeze (binding)

| Campo | Frozen value |
|-------|----------------|
| **organism** | `ORG-ASR-MC` |
| **source** | official Maricopa County Assessor tabular API |
| **host** | `mcassessor.maricopa.gov` (allowlist) |
| **operation** | `GET /parcel/{apn}` |
| **cardinality** | one parcel · one request |
| **representation** | JSON |

**Network facility:** Node built-in only (`fetch` / `AbortController` / `node:crypto`). **NO new dependency.**

| Control | Binding |
|---------|---------|
| Single request | REQUIRED |
| Bounded timeout | REQUIRED |
| Bounded response bytes | REQUIRED |
| JSON content-type validation | REQUIRED |
| 2xx only | REQUIRED |
| 401 / 403 / 429 fail closed | REQUIRED |
| Other non-2xx fail closed | REQUIRED |
| Redirect | fail closed |
| `retryCount` | must remain `0` |
| Polling / bulk / browser automation / scraping | FORBIDDEN |

Transport **must** be dependency-injectable for zero-network tests.

---

## 11. Response adapter freeze (binding)

**Policy:** FAIL-CLOSED EXPLICIT MAPPING ONLY.

```text
No heuristic API field guessing
No invented Assessor JSON field names
Recorded pack payload shape ≠ proof of LIVE API response field names
```

Until an authorized real response establishes the exact Assessor field map:

```text
assessor_live_field_map_unconfirmed
```

remains a valid refusal outcome.

Adapter **must**:

1. parse JSON object;
2. map only explicitly documented/approved fields into `maricopa.assessor.payload.v1`;
3. run `validatePayloadAgainstSchema(SCHEMA_ASR_MC_V1, payload)`;
4. refuse when required identity fields cannot be populated honestly.

**No first LIVE GET is authorized by this Scope Freeze.**

---

## 12. Authority wall (binding)

P1 may eventually produce:

```text
authorized LIVE acquisition (only after separate execution approval)
  → validated LIVE observation
  → shared Discovery semantics
  → normal Discovery handoff
  → STOP
```

P1 **MUST NOT**:

```text
create Evidence
create Fact authority
create Opportunity
invoke SP09 automatically
create Product
perform external delivery
change Identity authority
change Evidence authority
change database authority
mutate SP10 semantics
store credentials
claim production readiness
```

---

## 13. Zero-network acceptance freeze (binding)

Future `validateSp11LiveDiscovery.js` **must** prove at minimum:

| Area | Requirement |
|------|-------------|
| Default execution refusal | incomplete wall → refuse |
| Each incomplete flag | 3 negative combinations |
| Transport isolation | `callCount = 0` when unauthorized |
| APN normalization | deterministic `apnToken` |
| Identity | deterministic `observationId` · `candidateRef` |
| Namespace | LIVE `live-…` never `disc-…` |
| Temporal | `receivedAt` required · `observedAt = UNKNOWN` when unmapped · receipt ≠ source time |
| Fingerprint / dedup | deterministic · replay → DUPLICATE |
| Downstream bounds | one Signal max · one Candidate max · one handoff max |
| Authority | no SP09 · no Evidence · no Fact authority |
| Transport failures (mock) | malformed JSON · oversized · 401 · 403 · 429 · other non-2xx · redirect |
| Retry | `retryCount = 0` |

```text
REAL LIVE REQUEST COUNT = 0 for all validator runs
All network behavior = injected/mock transport only
```

SP10 regression **must** remain passing after any future IMPL (`SP10_RECORDED_DISCOVERY_ACCEPTANCE_PASS`).

---

## 14. PARKING / FUTURE (not P1)

Do not absorb into P1:

| Item |
|------|
| P-INT-02 T15 `buildSourceRef` |
| dedup transactional / concurrency durability |
| ORG-GIS-MC ArcGIS fallback |
| SP10 `disc-{observationId}` collision hardening |
| second LIVE organism |
| polling |
| multi-request operation |
| retry strategy |
| production hardening |
| LIVE Assessor field map after authorized first GET |

---

## 15. External execution block (binding)

Current state at this Scope Freeze:

| Condition | Status |
|-----------|--------|
| `TOKEN_AVAILABLE` | **NO** |
| `TOKEN_EXTERNAL_TO_REPO` | **N/A** (no token) |
| `DIRECTOR_LIVE_EXECUTION_APPROVAL` | **NO** |
| `LIVE EXECUTION AUTHORIZED` | **NO** |
| `LIVE_HTTP` | **FORBIDDEN** |

Future execution requires **separately** (all true):

```text
TOKEN_AVAILABLE                  = YES
TOKEN_EXTERNAL_TO_REPO           = YES
DIRECTOR_LIVE_EXECUTION_APPROVAL = YES
```

```text
Implementation Scope Freeze approval ≠ LIVE execution approval
Implementation Scope Freeze approval ≠ Director EXECUTE for code
```

---

## 16. Physical documentary surface

| Path | Role | Class |
|------|------|-------|
| `docs/factory-evolution/FACTORY_EVOLUTION_SP11_P1_IMPLEMENTATION_SCOPE_FREEZE.md` | This Implementation Scope Freeze | **NEW** |

```text
AUTHORIZED DOCUMENTARY DELTA = exactly this 1 file
Runtime / src              = UNCHANGED by this publication
```

---

## 17. Next gates (not opened)

1. Independent Acceptance of this Implementation Scope Freeze.
2. Continuity publication (commit) of this Scope Freeze.
3. Separate Director **IMPL / EXECUTE** grant for authorized runtime surfaces.
4. External token arrangement.
5. Separate Director **LIVE execution** approval before any real Assessor GET.

---

## Binding footer

```text
SP11-P1-IMPLEMENTATION-SCOPE-FREEZE-01
  = IMPLEMENTATION SCOPE FREEZE ONLY
  = 6 NEW RUNTIME FILES + 1 EXPORT-ONLY INDEX DELTA (future IMPL)
  = P1-A / P1-B / P1-C / P1-D INTERNAL SLICES
  = ZERO-NETWORK ACCEPTANCE REQUIRED
  = D1–D5 UNCHANGED

SOURCE      = ORG-ASR-MC / GET /parcel/{apn}
EXECUTION   = NOT_AUTHORIZED
LIVE_HTTP   = FORBIDDEN
SP10        = CLOSED / RECORDED_ONLY

≠ Grant · ≠ EXECUTE · ≠ LIVE HTTP · ≠ credentials
≠ P2 · ≠ SP11 COMPLETE · ≠ production ready

STOP BEFORE RUNTIME IMPL AND BEFORE ANY LIVE REQUEST
```

**END OF SP11-P1-IMPLEMENTATION-SCOPE-FREEZE-01**

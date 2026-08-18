# STRATEGIC PROGRAM 11 — LIVE DISCOVERY
## SP11-P1 — LIVE ACQUISITION BOUNDARY CONTRACT / SCOPE FREEZE
### Sibling LIVE acquisition · source/identity/time/proof walls (documentary · ≠ Grant · ≠ LIVE HTTP · ≠ IMPL)
#### Document ID: SP11-P1-LIVE-DISCOVERY-FREEZE-01

| Campo | Valor |
|-------|--------|
| **Document ID** | **`SP11-P1-LIVE-DISCOVERY-FREEZE-01`** |
| **Document type** | **SP11-P1 Live Discovery Contract / Scope Freeze** |
| **File ID** | `FACTORY_EVOLUTION_SP11_P1_LIVE_DISCOVERY_CONTRACT_FREEZE.md` |
| **Path** | `docs/factory-evolution/FACTORY_EVOLUTION_SP11_P1_LIVE_DISCOVERY_CONTRACT_FREEZE.md` |
| **Nature** | Continuity **DOCUMENTARY CONTRACT / SCOPE FREEZE** for SP11-P1 · records Director-approved D1–D5 · freezes sibling LIVE architecture · first source · LIVE identity · temporal honesty · bounded proof · network-safety requirements · authority and execution walls · **≠ Grant** · **≠ LIVE execution** · **≠ LIVE HTTP** · **≠ source IMPL** · **≠ credentials** · **≠ P2+** · **≠ Product** · **≠ SP11 COMPLETE** |
| **Program** | **Strategic Program 11 — LIVE Discovery** |
| **Phase** | **SP11-P1 — Bounded LIVE acquisition boundary** |
| **Freeze class** | **COMBINED** (Architecture + Source + Identity + Temporal + Bounded Proof + Execution Wall) |
| **Parent SP10 Complete** | `SP10-COMPLETE-STATUS-01` · Continuity Commit **`bbce142deab6422270b755b559499954203ebfd5`** · **CLOSED / READ-ONLY** |
| **Parent SP09 Complete** | `SP09-COMPLETE-STATUS-01` · Continuity Commit **`8cc091fc9949082c080d12fe9952a0eaf64a1cf4`** · **CLOSED / READ-ONLY** |
| **Authorizing Director act** | Director **APPROVED** D1=C · D2=A · D3 as proposed · D4 as proposed · D5=A · this documentary freeze only · **NO** LIVE execution · **NO** token · **NO** HTTP · **NO** runtime IMPL |
| **Entry tip (pre-publication)** | **`3a397cc7126c715eeffd36f1150952593ed64df0`** |
| **Date** | **2026-08-18** |
| **Branch** | `integration/factory-complete-20260725` |
| **Mode** | **DOCUMENTARY FREEZE ONLY** |

```text
SP11-P1-LIVE-DISCOVERY-FREEZE-01
  = DOCUMENTARY CONTRACT / SCOPE FREEZE ONLY
  = D1–D5 AUTHORITATIVE IN REPOSITORY
  = SOURCE SELECTED ≠ EXECUTION AUTHORIZED

P1 GRANT (LIVE EXECUTION)   = NOT ISSUED
P1 IMPLEMENTATION AUTHORITY = NONE
P1 IMPLEMENTATION           = NOT STARTED
P1 COMPLETE                 = NO
LIVE_HTTP                   = FORBIDDEN
SP11-P2+                    = NOT OPENED
SP11 COMPLETE               = NO
```

---

## 0. Absolute non-authorization banner

```text
THIS FREEZE DOES NOT AUTHORIZE LIVE HTTP.
THIS FREEZE DOES NOT AUTHORIZE CODE.
THIS FREEZE DOES NOT AUTHORIZE CREDENTIALS.

P1 CONTRACT/SCOPE FREEZE DOES NOT AUTHORIZE LIVE EXECUTION.

FREEZE PUBLISHED ≠ GRANT
FREEZE PUBLISHED ≠ LIVE EXECUTION
FREEZE PUBLISHED ≠ LIVE HTTP
FREEZE PUBLISHED ≠ TOKEN
FREEZE PUBLISHED ≠ SOURCE MUTATION
FREEZE PUBLISHED ≠ SP10 REOPENED
FREEZE PUBLISHED ≠ SP09 REOPENED
FREEZE PUBLISHED ≠ P2 OPEN
FREEZE PUBLISHED ≠ PRODUCTION READY
FREEZE PUBLISHED ≠ PRODUCT / MARKETPLACE

SOURCE SELECTED             ≠ EXECUTION AUTHORIZED
IMPLEMENTATION AUTHORITY    = NONE
CODE AUTHORITY              = NONE
LIVE EXECUTION              = NOT_AUTHORIZED
LIVE_HTTP                   = FORBIDDEN
```

---

## 1. Authority chain (consumed · unchanged)

| Instrument | Posture |
|------------|---------|
| `SP10-COMPLETE-STATUS-01` | **CLOSED / READ-ONLY** · Recorded Discovery proved · LIVE **NOT** claimed · SP11 wall at SP10 closure remains historically **NOT STARTED** · this Freeze is the first SP11 Continuity instrument and does **not** amend SP10 |
| `SP09-COMPLETE-STATUS-01` | **CLOSED / READ-ONLY** · Adaptive Research predecessor · **not** invoked by SP11-P1 |
| P-INT-02 RECORDED_ONLY connectors | **ANTECEDENT / UNCHANGED** · `liveFetch=false` · `fetchLive()` → `LIVE_NOT_AUTHORIZED` |
| SP10 Discovery contracts | **ANTECEDENT / UNCHANGED** · `sourceMode=RECORDED` · `buildDiscoveryCandidateRef` = `disc-{observationId}` |
| SP11 Entry Gate + D2 External Source Discovery | **CONSUMED** · session STRICT READ-ONLY · D1–D5 Director-approved · no additional LIVE requests by this Freeze |
| Runtime / `src/**` | **NOT MUTATED** by this Freeze |

SP10 recorded contracts remain closed. SP11 must not route LIVE bytes through SP10 by falsely stamping them `RECORDED`.

---

## 2. Program / phase purpose (frozen)

| Campo | Binding |
|-------|---------|
| **PROGRAM** | **SP11 LIVE DISCOVERY** |
| **PHASE** | **P1** |
| **PURPOSE** | Establish the minimum honest **sibling LIVE acquisition boundary** capable of producing a bounded LIVE Discovery observation for **shared downstream Discovery semantics** |
| **ARCHITECTURE** | **D1 = C** |

```text
SP10 remains closed and RECORDED_ONLY.

SP11-P1 does not wrap LIVE bytes as recorded packs.
SP11-P1 does not call processRecordedObservation with LIVE payloads.
SP11-P1 does not set sourceMode=RECORDED or liveFetch=false on LIVE observations.
```

---

## 3. D1–D5 freeze (binding)

| ID | Decision | Binding |
|----|----------|---------|
| **D1** | **C** | Sibling LIVE acquisition boundary feeding shared downstream Discovery semantics. Capture-then-record into SP10 (**B**) is **forbidden**. |
| **D2** | **A** | First LIVE source = **ORG-ASR-MC** / **REGISTRAL_ASSESSOR**. Source may be frozen. LIVE execution remains **NOT_AUTHORIZED** until token + external storage + separate Director LIVE execution approval. |
| **D3** | **APPROVED AS PROPOSED** | Deterministic LIVE-specific identity namespace. Do not alter SP10 recorded identity or `buildDiscoveryCandidateRef`. |
| **D4** | **APPROVED AS PROPOSED** | `receivedAt` required from Factory receipt time. `observedAt` = source-provided observation timestamp when truthful; otherwise literal `UNKNOWN`. Factory receipt clock must never masquerade as `observedAt`. |
| **D5** | **A** | Bounded single-shot serial one-process proof permitted under strict constraints. Dedup concurrency/durability hardening remains **PARKING / FUTURE**. |

---

## 4. Source freeze

| Campo | Frozen value |
|-------|----------------|
| **organismId** | **`ORG-ASR-MC`** |
| **family** | **`REGISTRAL_ASSESSOR`** |
| **source** | Official Maricopa County Assessor **tabular API** |
| **official host (future IMPL)** | `mcassessor.maricopa.gov` |
| **bounded operation** | **`GET /parcel/{apn}`** |
| **expected representation** | **JSON** |
| **P1 cardinality** | **one parcel / one bounded request** |

```text
SOURCE SELECTED ≠ EXECUTION AUTHORIZED

LIVE EXECUTION = NOT_AUTHORIZED
Reason         = official API token/access must first be arranged.

No token may be committed to the repository.
No LIVE HTTP request is authorized by this P1 freeze.
```

### ArcGIS (not this phase)

| Campo | Binding |
|-------|---------|
| **Official Assessor ArcGIS Parcels/MapServer/0** | **ORG-GIS-MC** |
| **Role in SP11-P1** | **fallback only** · **PARKING / FUTURE** |
| **Relabel as ORG-ASR-MC** | **FORBIDDEN** |

---

## 5. LIVE identity freeze (D3)

LIVE (new contract only — not implemented by this Freeze):

| Campo | Frozen rule |
|-------|-------------|
| **observationId** | `live-{organismId}-{apnToken}` |
| **candidateRef** | `live-{organismId}-{apnToken}` |
| **apnToken** | deterministic bounded APN token · **uppercase** · **non-alphanumeric characters removed** |
| **UUID / random id** | **FORBIDDEN** |

SP10 (untouched):

| Campo | Frozen rule |
|-------|-------------|
| **candidateRef** | `disc-{observationId}` via existing `buildDiscoveryCandidateRef` |
| **LIVE use of that function** | **FORBIDDEN** |
| **Alteration of that function** | **FORBIDDEN** |

LIVE conceptual dedup identity retains the four-part basis:

```text
observationId | organismId | payloadFingerprint | observedAt
```

`signalId` / `candidateId` remain derived from `dedupKey` when shared Discovery semantics are eventually invoked.

Recorded identifiers are untouched.

---

## 6. Temporal freeze (D4)

| Field | Requirement |
|-------|-------------|
| **receivedAt** | **REQUIRED** · Factory clock at successful HTTP response completion · ISO-8601 |
| **observedAt** | **REQUIRED field** · value = source-provided observation timestamp **only** when the source truthfully provides / documented-ly defines one · otherwise literal **`UNKNOWN`** |

**PROHIBITED:**

```text
receivedAt used as observedAt
Factory current time fabricated as source observation time
SP10 recordedAt used for LIVE acquisition
DSO acquiredAt / vintageAt silently substituted for Discovery receivedAt
```

Dedup `observedAt` component uses **source timestamp OR `UNKNOWN`**. It must not use `receivedAt` merely to create a new identity on every GET.

---

## 7. Bounded proof freeze (D5)

P1 proof constraints (when LIVE execution is later separately authorized):

```text
ONE source
ONE APN
ONE request
SERIAL
ONE process
NO polling
NO concurrency
NO parallel workers
NO automatic retry
NO autonomous loop
NO bulk extraction
NO browser automation
NO scraping
NO production-readiness claim
```

Existing unlocked / non-transactional `DiscoveryDedupRegistry` may remain for this strictly bounded proof.

Concurrency / durability hardening = **PARKING / FUTURE**.

---

## 8. Network safety freeze (requirements only · not implemented)

MUST HAVE before any authorized LIVE request:

| Requirement | Binding |
|-------------|---------|
| Bounded timeout | REQUIRED |
| Single request | REQUIRED |
| Explicit non-2xx failure | REQUIRED |
| 401 / 403 fail closed | REQUIRED |
| 429 fail closed | REQUIRED |
| No automatic retry | REQUIRED |
| Bounded response size | REQUIRED |
| Expected JSON / content-type validation | REQUIRED |
| Redirect policy explicit / fail-safe | REQUIRED |
| Provenance identifying official source / organism | REQUIRED |
| Credentials external to repository | REQUIRED |
| No token logging | REQUIRED |

This section is **documentary**. It does **not** implement HTTP, clients, secrets, or retries.

---

## 9. Authority wall

SP11-P1 **may eventually** (only after LIVE execution is separately authorized and IMPL is separately granted):

```text
acquire authorized LIVE bytes
validate the bounded response
construct truthful LIVE observation identity / time / provenance
feed approved shared Discovery semantics
reach normal Discovery handoff
```

SP11-P1 **must NOT**:

```text
create Evidence
create Fact
resolve Opportunity
automatically execute SP09 Research
form Product
deliver externally
change Identity authority
change Evidence authority
change database
change SP10 recorded contracts
change recorded packs
change sourceMode semantics of SP10
store credentials
claim production readiness
```

**STOP boundary:** normal Discovery handoff.

---

## 10. External execution wall (mechanical)

```text
P1 CONTRACT/SCOPE FREEZE DOES NOT AUTHORIZE LIVE EXECUTION.

LIVE EXECUTION = NOT_AUTHORIZED
LIVE_HTTP      = FORBIDDEN

Before first actual Assessor GET, ALL must be true:

  TOKEN_AVAILABLE                  = YES
  TOKEN_EXTERNAL_TO_REPO           = YES
  DIRECTOR_LIVE_EXECUTION_APPROVAL = YES

Until then:

  LIVE_HTTP = FORBIDDEN
```

| Condition | Status at this Freeze |
|-----------|------------------------|
| **TOKEN_AVAILABLE** | **NO** |
| **TOKEN_EXTERNAL_TO_REPO** | **N/A** (no token) |
| **DIRECTOR_LIVE_EXECUTION_APPROVAL** | **NO** |
| **LIVE_HTTP** | **FORBIDDEN** |

A later Director LIVE execution approval is a **separate act**. This Freeze is not that act.

---

## 11. Parking / future (not P1)

Do not pull any of the following into P1:

| Item | Disposition |
|------|-------------|
| P-INT-02 T15 `buildSourceRef` static-audit observation | **PARKING / FUTURE** |
| Discovery dedup concurrency / durability | **PARKING / FUTURE** |
| ORG-GIS-MC ArcGIS fallback | **PARKING / FUTURE** |
| SP10 `disc-{observationId}` collision hardening | **PARKING / FUTURE** |
| Second LIVE organism / source | **PARKING / FUTURE** |
| Polling | **PARKING / FUTURE** |
| Multi-request operation | **PARKING / FUTURE** |
| Retry policy beyond fail-closed P1 | **PARKING / FUTURE** |
| Production hardening | **PARKING / FUTURE** |

---

## 12. Physical freeze surface

| Path | Role | Class |
|------|------|-------|
| `docs/factory-evolution/FACTORY_EVOLUTION_SP11_P1_LIVE_DISCOVERY_CONTRACT_FREEZE.md` | This Contract / Scope Freeze | **NEW** |

```text
AUTHORIZED PHYSICAL SCOPE = exactly this 1 file
Unauthorized mutation      = NONE
Runtime / src              = UNCHANGED
Recorded packs             = UNCHANGED
SP10 / SP09 documents      = UNCHANGED
Credentials                = NONE
```

---

## 13. Honesty / next gates

```text
SP01–SP10 = COMPLETE (CLOSED / READ-ONLY predecessors relative to SP11-P1)
SP11      = OPEN — NOT COMPLETE
SP11-P1   = CONTRACT / SCOPE FROZEN — NOT IMPLEMENTED — LIVE EXECUTION NOT AUTHORIZED

SP11-P1 COMPLETE              = NO
SP11 LIVE HTTP                = FORBIDDEN
SP11 production readiness     = NOT CLAIMED
Product / Marketplace         = NOT CLAIMED
```

**Next gates (not opened by this Freeze):**

1. Independent Acceptance of this documentary Freeze.
2. Continuity publication (commit) of this Freeze — **not performed by the Freeze-writing session**.
3. External token arrangement (human / Assessor IT).
4. Separate Director **LIVE execution** approval.
5. Separate Director **IMPL** grant for sibling LIVE acquisition code.

---

## Binding footer

```text
SP11-P1-LIVE-DISCOVERY-FREEZE-01
  = DOCUMENTARY CONTRACT / SCOPE FREEZE
  = D1=C / D2=A / D3 APPROVED / D4 APPROVED / D5=A

SOURCE      = ORG-ASR-MC / REGISTRAL_ASSESSOR / GET /parcel/{apn}
EXECUTION   = NOT_AUTHORIZED
LIVE_HTTP   = FORBIDDEN
TOKEN       = NOT IN REPOSITORY
SP10        = CLOSED / RECORDED_ONLY
SP09        = CLOSED / UNTOUCHED
ARCGIS      = ORG-GIS-MC FALLBACK ONLY / PARKING

≠ Grant · ≠ LIVE HTTP · ≠ source IMPL
≠ credentials · ≠ P2 · ≠ SP11 COMPLETE
≠ production ready

STOP BEFORE SP11-P1 IMPLEMENTATION AND BEFORE ANY LIVE REQUEST
```

**END OF SP11-P1-LIVE-DISCOVERY-FREEZE-01**

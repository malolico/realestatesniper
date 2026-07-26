# FACTORY INTEGRATION P-INT-04
## DECISION PACKAGE EXPORT — LIVE / VERSIONED SINK
## IMPLEMENTATION PLAN

**Document ID:** `FACTORY_INTEGRATION_P_INT_04_LIVE_IMPLEMENTATION_PLAN.md`  
**Phase:** Factory Integration — Operational Completeness (Arizona) / Master Plan Fase III  
**Block:** P-INT-04 — Decision Package Export (**LIVE / VERSIONED SINK slice**)  
**Document Type:** Technical Implementation Plan  
**Status:** PLAN ONLY — **NO IMPLEMENTATION AUTHORIZED BY THIS DOCUMENT**

**Repository:** RealEstateSniper  

**Normative sources:**

1. `docs/factory-construction/FACTORY_INTEGRATION_MASTER_PLAN.md` (§3.2 P-INT-04; §4.1 Handoff API; §4.2 Decision Engine Adapter; §5 Fase III items 7–9; §7.1 export to storage/cola)  
2. Director Discovery — P-INT-04 Live (STRICT READ_ONLY, session)  
3. `docs/factory-construction/integration/FACTORY_INTEGRATION_P_INT_04_OFFLINE_IMPLEMENTATION_PLAN.md`  
4. `docs/factory-construction/integration/FACTORY_INTEGRATION_P_INT_04_OFFLINE_IMPL_STATUS.md`  
5. Implementation Offline: `src/factory/cb16/export/**` (commits `f68478d…`, Status `d5b3a75…`)  
6. CB-16 Blueprint / COMPLETION / `decisionPackageSchema` / `decisionLedger` / Decision Package / handoff boundary  
7. `docs/factory-construction/integration/FACTORY_INTEGRATION_P_INT_03_OFFLINE_IMPLEMENTATION_PLAN.md` (+ Status) — integrity / fail-closed patterns only  
8. Integration II.1–II.6 — **frontier preservation only** (Live Export ≠ Delivery / ≠ `HANDOFF_EXECUTED`)  
9. Factory Constitution / Master Continuity Dossier applicable  

**Director authorization (this Plan document):** **approved** to exist as planning artifact.  
**Director authorization (P-INT-04-LIVE-IMPL code):** **NOT AUTHORIZED** by this document.  
**Director authorization (cloud vendor SDK / real object-store / real queue / Supabase / Decision Engine):** **NOT AUTHORIZED**.

**Technological / architectural decision (binding):**

1. **Same CB-16 Decision Package corpus** — no second schema.  
2. **Reuse Offline** canonicalization, `canonicalContentChecksum`, `packageId`, envelope allowlist, dual-integrity semantics.  
3. Live sink = **vendor-neutral object-storage-shaped immutable object** as primary artifact store, with **optional notify hook** (not queue-as-primary corpus store).  
4. Initial IMPL validates via **InMemory / Fake live sink adapter** only — **no** cloud SDK, **no** `package.json` dependency adds.  
5. Offline prerequisite for Live SUCCESS in v1 is **hard**: verified offline artifact **and** `DHI_OFFLINE_LOCAL_EXPORT` (§6.1); remote bytes per §6.2.  
6. Unique Live ELR kind: **`DHI_LIVE_VERSIONED_EXPORT`**.  
7. Unique Live export mode: **`LIVE_VERSIONED`**.  
8. Live service **separate** from `prepareAndDeliver` and from Offline export service composition.  
9. **Do not** implement Decision Engine, Product, Marketplace, Delivery, II.7, or P-INT-05.

---

## 0. Absolute Non-Authorization Banner

This Plan **does not** authorize, and any future Live IMPL under a separate Director mandate **must not** introduce:

| Surface | Status under this Plan |
|---------|------------------------|
| Decision Engine internals / commercial decision logic | **PROHIBITED** |
| Deal / Premium / Diamond classifier | **PROHIBITED** |
| Product Catalog / Marketplace / pricing / billing / subscriptions / purchases | **NOT AUTHORIZED** |
| Access tier / commercial access control | **PROHIBITED** |
| P-INT-05 Product Publish Gate | **NOT OPENED** |
| Delivery / II.7 / publication-channel transport as II.\* Delivery | **NOT AUTHORIZED / NOT OPENED** |
| Web / React / FCC product mutation surfaces | **NOT AUTHORIZED** |
| Supabase / RLS / cloud migrations / product tables / `deals` as Package sink | **NOT AUTHORIZED** |
| CRM / Owner Portal | **NOT AUTHORIZED** |
| P-INT-02 Live DSO connectors | **NOT REQUIRED / NOT OPENED here** |
| P-INT-03 cloud / Supabase ELR | **NOT REQUIRED / NOT OPENED here** |
| Runtime (CB-04) semantic changes | **PROHIBITED** |
| Read Model II.2 semantic changes | **PROHIBITED** |
| Fusion with II.3–II.6 Publication Unit / handoff-execution governance | **PROHIBITED** |
| AWS / Azure / GCP / Supabase Storage SDK as default IMPL | **NOT AUTHORIZED** |
| New npm dependencies / `package.json` changes in v1 IMPL | **NOT AUTHORIZED** |
| Altering `boundary.decides` or CB-16 blocked operations | **PROHIBITED** |
| Public unauthenticated Package URL | **PROHIBITED** |

**Hard separations:**

```text
P-INT-04 Live versioned sink     ≠  Delivery / II.7 / HANDOFF_EXECUTED
P-INT-04 Live                    ≠  Decision Engine
P-INT-04 Live                    ≠  P-INT-05 / Marketplace publish
CB-16 Decision Package (corpus)  ≠  commercial Decision
exportMode LIVE_VERSIONED        ≠  OFFLINE_LOCAL
DHI_LIVE_VERSIONED_EXPORT        ≠  DHI_OFFLINE_LOCAL_EXPORT
DHI_LIVE_VERSIONED_EXPORT        ≠  DHI_PACKAGE_DELIVERED
II.2 Read Model                  ≠  Decision Package
Offline local artifact           ≠  remote sink (but same logical corpus)
```

---

## 1. Identidad del bloque

| Campo | Valor |
|-------|-------|
| Master Plan name | **P-INT-04 Decision Package Export** |
| Slice de este Plan | **LIVE / VERSIONED SINK** — remote versioned artifact + consumer port |
| Constitutional owner of package shape | **CB-16** |
| Offline slice | **COMPLETE** (prerequisite for Live v1) |
| Consumer futuro (fuera de alcance IMPL) | **Decision Engine Adapter** (Master Plan §4.2) — external |

Este Plan **define documentalmente** el remanente Live de la fila Master Plan P-INT-04 (object storage–shaped sink / Decision Engine **port**), **sin** implementar Decision Engine ni autorizar cloud vendor real. Real cloud IMPL permanece **OPEN / NOT AUTHORIZED** hasta mandato aparte (§32).

---

## 2. P-INT-04 LIVE IS

P-INT-04 Live **is**:

1. The **non-local extension** of CB-16 Decision Package Export.  
2. A **vendor-neutral live sink** that stores an **immutable, versioned** export artifact addressable by logical identity.  
3. A **contractual port** through which a future **external Decision Engine Adapter** may **locate / fetch** a verified Package.  
4. A reuse of Offline **corpus identity** (`canonicalContentChecksum`, `packageId`) and envelope semantics.  
5. An ELR **reference act** recorded **only after remote VERIFY PASS**.  
6. Fail-closed, idempotent, reconcilable remote export under Factory Ops / machine identity.

---

## 3. P-INT-04 LIVE IS NOT

P-INT-04 Live **is not**:

- Decision Engine  
- Deal / Premium / Diamond classification  
- Product Engine / P-INT-05  
- Marketplace / pricing / subscriptions / access tiers  
- Delivery / II.7 / II.6 `HANDOFF_EXECUTED` channel  
- Web / CRM / Owner Portal  
- Supabase `deals` sink  
- P-INT-02 Live ingest  
- P-INT-03 cloud ELR  
- Runtime redesign  
- Read Model II.2 mutation plane  
- A second Decision Package schema  
- A replacement for Offline local durability  

---

## 4. Objetivo

1. Export the **same** CB-16 Decision Package corpus already hardened by Offline to a **remote versioned sink**.  
2. Preserve **one logical corpus** per `canonicalContentChecksum`.  
3. Provide a **Decision Engine consumer locator contract** without implementing Decision Engine.  
4. Register ELR success **only** after remote verification.  
5. Keep Offline artifact authoritative and intact if Live fails.  
6. Validate the architecture with a **fake/in-memory adapter** before any future cloud adapter mandate.

**Master Plan alignment:** §5 Fase III item 7 (versioned sink) + item 9 (**port only**, no Decision Engine inside Factory).

---

## 5. Decisión arquitectónica del sink Live (CLOSED)

### 5.1 Binding choice

**Primary sink shape:** **Object-storage-shaped immutable object store** (put/get/head by opaque key; no partial overwrite of committed content).  

**Secondary (optional) hook:** **Notify** after successful remote verify (no-op allowed) — e.g. future queue/event emission of **locator metadata only**, never the commercial decision.

**Queue-as-primary corpus store:** **REJECTED** for v1.  
Justification: Master Plan allows “object storage / cola”, but a Decision Package is an **immutable versioned artifact**. A queue is a transport/fan-out mechanism, not an identity-preserving content-addressable store. Using a queue as the sole sink risks duplicate bodies, non-immutable payloads, and weak VERIFY semantics.  

**Composition object-storage + optional notify:** **ACCEPTED** as the closed architecture.  
Initial IMPL implements **object put/get/head + verify** on `DecisionPackageLiveSinkPort`; notify may be a no-op stub.

### 5.2 Vendor policy (CLOSED)

| Rule | Value |
|------|-------|
| Concrete cloud vendor in this Plan | **NONE** |
| AWS / Azure / GCP / Supabase as default | **FORBIDDEN** |
| v1 IMPL adapter | **`InMemoryDecisionPackageLiveSink`** (or equivalent fake) **only** |
| Real cloud adapter | **DEFERRED** — requires separate Director mandate + dependency authorization |
| Ports/adapters | **REQUIRED** |

---

## 6. Relación Offline → Live (CLOSED)

### 6.1 Offline prerequisite — single binding rule (H2 CLOSED)

Live SUCCESS in v1 requires **both** of the following for the same `canonicalContentChecksum` / `packageId`. **No alternate interpretation.**

| # | Requirement | Binding |
|---|-------------|---------|
| **A** | **Verified Offline artifact** | `LocalExportPort.verifyIntegrity(factoryKey, packageId)` **PASS** |
| **B** | **Offline ELR act** | Coherent `DHI_OFFLINE_LOCAL_EXPORT` act for that `canonicalContentChecksum` |

If **A** fails, **B** fails, or A/B disagree on checksum/`packageId` → **`OFFLINE_PREREQUISITE_MISSING`** (fail-closed).  
**Neither** artifact-alone **nor** act-alone is sufficient.

| Rule | Binding value |
|------|----------------|
| Logical authority of corpus | **`canonicalContentChecksum`** of CB-16 payload canonical view (Offline §15) |
| Physical/local authority for Live v1 | Verified Offline envelope **and** Offline ELR act (§6.1) |
| Does Live consume Offline envelope? | **YES — REQUIRED** (source object for remote bytes — §6.2) |
| May Live rebuild package from CB-16 builder? | **Only as a non-authoritative consistency check**; **MUST NOT** substitute for §6.1; **MUST NOT** SUCCESS without §6.1 |
| Offline prerequisite? | **YES — hard** (§6.1 A∧B) |
| Offline as fallback if Live fails? | Offline **remains**; Live failure **does not** roll back or mutate offline |
| Divergencia local vs remoto | Remote logical identity **MUST** match Offline; physical remote bytes follow §6.2; content conflict → **fail-closed**, no overwrite |
| Unique corpus | **One** `canonicalContentChecksum` → one `packageId` → one remote object key |

```text
PRECONDITION (binding): Offline VERIFY PASS
                      AND DHI_OFFLINE_LOCAL_EXPORT for same checksum
        │
        ▼
Live loads verified Offline envelope
        │
        ▼
Build stable LIVE_VERSIONED bytes (§6.2)
        │
        ▼
Remote PREPARE → putIfAbsent → VERIFY
        │
        ▼
ELR DHI_LIVE_VERSIONED_EXPORT → LIVE SUCCESS
```

### 6.2 Stable remote physical bytes (H1 CLOSED)

**Physical identity of the remote artifact** = the **exact byte sequence** written by `putIfAbsent` (UTF-8), hashed as `contentSha256`.

**Construction algorithm (binding — no alternatives):**

1. Load Offline envelope object `E0` from `LocalExportPort.verifyIntegrity` (already integrity-checked).  
2. Build Live envelope object `E1` as follows:  
   - Top-level keys = Offline envelope allowlist only (same set as offline `ENVELOPE_ALLOWLIST`).  
   - For every allowlisted field **except** `exportMode`: value **MUST** be **identical** to `E0` (including **`generatedAt`**).  
   - `exportMode` **MUST** be **`LIVE_VERSIONED`** (the **only** field permitted to differ from `E0`).  
3. Serialize `E1` to remote bytes: emit keys in **fixed offline allowlist order**, compact JSON (no pretty-print), then trailing **`\n`**.  
4. `packageId`, `canonicalContentChecksum`, `factory_key`, `payload`, `boundarySummary`, `inputSnapshotRefs`, `exportSchemaVersion`, `decisionPackageVersion`, and **`generatedAt`** are **immutable** across Live attempts for that corpus.  
5. `remoteKey` = `resolveRemoteKey(factory_key, packageId)` — deterministic from identity; **never** from `liveAttemptId` or `generatedAt`.

| Category | Fields / rule |
|----------|----------------|
| **MAY change Offline → Live** | **`exportMode` only** (`OFFLINE_LOCAL` → `LIVE_VERSIONED`) |
| **MUST NEVER change** for a given corpus Live export | `packageId`, `canonicalContentChecksum`, `factory_key`, `payload`, `generatedAt`, `exportSchemaVersion`, `decisionPackageVersion`, `boundarySummary`, `inputSnapshotRefs`, and all payload contents |
| **Not part of remote bytes** | `liveAttemptId` (attempt metadata / ELR / logs only) |

**Retry / crash recovery / idempotency compatibility:**

- Re-running Live for the same checksum **MUST** reload the same Offline artifact and apply §6.2 → **identical remote bytes**.  
- `putIfAbsent` same key + same bytes → success no-op (idempotent).  
- Same key + different bytes → **conflict fail-closed** (true conflict only; **no** false conflict from regenerated `generatedAt`).  
- Remote VERIFY hashes these exact bytes; logical checksum still from payload canonical view (Offline §15).

**Forbidden:** regenerating `generatedAt` on Live copy; rebuilding remote body from a fresh CB-16 `buildDecisionPackage` for SUCCESS; including `liveAttemptId` inside remote envelope bytes.

---

## 7. Puertos (CLOSED)

### 7.1 `DecisionPackageLiveSinkPort` (Live Port — binding name)

**Name:** `DecisionPackageLiveSinkPort`  

**Role:** Vendor-neutral remote sink for immutable Live export artifacts. **Does not decide. Does not classify.**

| Method | Semantics |
|--------|-----------|
| `head(remoteKey)` | Existence + integrity metadata if present; no business use |
| `putIfAbsent(remoteKey, bytes, meta)` | Write **only if** absent; return `{ written: boolean, remoteKey, etagOrVersion }` |
| `get(remoteKey)` | Return exact bytes; missing → fail-closed |
| `verify(remoteKey, expected)` | Re-read bytes; compare against `expected` (§7.1.1); mismatch → throw |
| `resolveRemoteKey(factoryKey, packageId)` | Deterministic key derivation (see §8) |

**Inputs:** remote key; envelope bytes (exact §6.2 serialization); `meta` (§7.1.2 allowlist only).  
**Outputs:** remote locator meta (`remoteKey`, `contentSha256`, `canonicalContentChecksum`, `exportMode`, `remoteRef`, optional `notifyToken`).  
**Errors:** destination denied, authz fail, conflict, timeout, uncertain outcome, corruption, unknown field in meta.  
**Idempotency:** `putIfAbsent` — second put same key+same bytes → success no-op; same key+different bytes → **conflict fail-closed** (compatible with §6.2 stable bytes).  
**Limits:** max bytes (IMPL numeric quota); timeout; deny arbitrary URLs.  
**Prohibited operations:** overwrite committed different content; public ACL; decide/classify; Delivery; mutate Factory ELR from inside the port.

#### 7.1.1 `expected` for `verify(remoteKey, expected)` (M1 CLOSED)

`expected` is a **plain object** with **exactly** these required fields (no extras):

| Field | Type / rule |
|-------|-------------|
| `contentSha256` | lowercase hex SHA-256 of the exact remote bytes that **MUST** be present |
| `canonicalContentChecksum` | lowercase hex; **MUST** match Offline / envelope payload identity |
| `packageId` | `dpkg-{factory_key}-{canonicalContentChecksum}` |
| `factory_key` | must match envelope / key prefix |
| `exportMode` | **MUST** be `"LIVE_VERSIONED"` |
| `exportSchemaVersion` | integer; **MUST** match envelope |

**Verify algorithm (binding):**

1. `bytes = get(remoteKey)` (missing → fail-closed).  
2. Compute `sha = SHA-256(bytes)` lowercase hex; **MUST** equal `expected.contentSha256`.  
3. Parse envelope JSON from `bytes` (corrupt → fail-closed); reject unknown top-level fields.  
4. Assert envelope fields equal `expected` for `canonicalContentChecksum`, `packageId`, `factory_key`, `exportMode`, `exportSchemaVersion`.  
5. Recompute logical checksum from `payload` (Offline §15); **MUST** equal `expected.canonicalContentChecksum`.  
6. Assert `packageId === dpkg-{factory_key}-{canonicalContentChecksum}`.

#### 7.1.2 `meta` allowlist for `putIfAbsent` (M2 CLOSED)

`meta` **MUST** contain **only** the following keys (unknown key → **REJECT**). All listed keys are **REQUIRED** except where marked optional:

| Key | Required | Semantics |
|-----|----------|-----------|
| `packageId` | YES | Logical package id |
| `factory_key` | YES | Isolation |
| `canonicalContentChecksum` | YES | Logical corpus id |
| `contentSha256` | YES | SHA-256 of `bytes` argument |
| `exportMode` | YES | Must be `"LIVE_VERSIONED"` |
| `exportSchemaVersion` | YES | Envelope schema version |
| `remoteRef` | YES | Opaque locator string for this object (see §7.2) |
| `liveAttemptId` | OPTIONAL | Attempt correlation only; **not** written into envelope bytes |

No other metadata keys are permitted in v1.

### 7.2 Decision Engine consumer locator (contract only)

**Name:** `DecisionPackageConsumerLocator` (contractual surface; **not** an Engine)

Emitted **after** remote VERIFY as **locator metadata** (may be returned by Live export service and/or stored in ELR act fields):

| Field | Role |
|-------|------|
| `packageId` | Logical identity |
| `canonicalContentChecksum` | Corpus identity |
| `remoteKey` | Sink object key |
| `exportMode` | `LIVE_VERSIONED` |
| `exportSchemaVersion` | Envelope schema |
| `factory_key` | Isolation |
| `remoteRef` | **Sole** contractual locator string for external adapter (M3 CLOSED — **not** `relativeRef`) |

**MUST NOT** include: Deal/Premium/Diamond, pricing, access_tier, publication eligibility, Delivery status, II.6 execution tokens.

Future Decision Engine Adapter (external) **MAY** use locator to `get` bytes; **MUST NOT** rewrite Factory corpus, Evidence, Legitimacy, or convert AI advisory into sovereign decision inside the original package.

---

## 8. Identidad (CLOSED)

| Identity | Form / rule |
|----------|-------------|
| **Logical corpus / `packageId`** | **`dpkg-{factory_key}-{canonicalContentChecksum}`** (unchanged from Offline) |
| **`canonicalContentChecksum`** | SHA-256 hex lowercase of Offline §15 canonical bytes |
| **Remote artifact key** | `live/v1/{factory_key}/{packageId}.envelope.json` |
| **Physical content hash** | SHA-256 of **exact remote bytes** written (envelope serialization) |
| **Version identifier** | `exportSchemaVersion` + `packageId` (content-addressed; no mutable “latest” pointer in v1) |
| **Export attempt identity** | `liveAttemptId` = opaque ULID/UUID generated per Live attempt — **not** corpus identity; logged/ELR only |
| **`deliveryId` CB-16** | Ephemeral handoff delivery id — **MUST NOT** identify corpus or remote key |
| **CB-16 handoff `packageId` (`{key}@{version}`)** | Frontier act id — **MUST NOT** replace Live/Offline `packageId` |

---

## 9. Export mode (CLOSED)

**Binding value:** `LIVE_VERSIONED`

| Property | Value |
|----------|-------|
| Token | **`LIVE_VERSIONED`** |
| Justification | Matches Master Plan “sink **versionado**” + Live slice; distinguishes from Offline local durability |
| Offline mode | **`OFFLINE_LOCAL`** — **MUST NOT** be reused for Live |
| Envelope field | `exportMode` **MUST** equal `LIVE_VERSIONED` for Live success path |
| Unknown mode | **REJECT** |

Frozen: **no alternate Live mode strings in v1.**

---

## 10. ELR kind Live (CLOSED)

**Binding kind:** `DHI_LIVE_VERSIONED_EXPORT`

| Property | Value |
|----------|-------|
| Kind string | **`DHI_LIVE_VERSIONED_EXPORT`** |
| Semantics | Offline-prereq satisfied; remote sink VERIFY PASS; locator recorded; **not** Delivery; **not** Decision Engine ingest confirmation |
| Section | `decision_handoffs` |
| When | **Only after remote VERIFY PASS** |

**Minimum act fields:**

- `kind: "DHI_LIVE_VERSIONED_EXPORT"`  
- `interfaceId` (CB-16 handoff interface id)  
- `packageId`  
- `canonicalContentChecksum`  
- `exportSchemaVersion`  
- `exportMode: "LIVE_VERSIONED"`  
- `remoteKey`  
- `contentSha256` (physical remote bytes)  
- `remoteRef` (sole locator field — **not** `relativeRef`)  
- `offlineExportPresent: true`  
- `offlinePrerequisite: "ARTIFACT_AND_ACT"`  
- `liveAttemptId`  
- actor / timestamps via Registry  

**MUST NOT reuse / synonymize:**

- `DHI_OFFLINE_LOCAL_EXPORT`  
- `DHI_PACKAGE_DELIVERED`  
- `DHI_HANDOFF_COMPLETE`  
- `DHI_DECISION_HANDOFF`  
- `HANDOFF_EXECUTED` (II.6)  
- any II.6 status token  

**Idempotency:** **one** `DHI_LIVE_VERSIONED_EXPORT` act per `canonicalContentChecksum` (v1).

---

## 11. Envelope Live (CLOSED)

Live **reuses** the Offline envelope allowlist and CB-16 `payload`. Remote body construction is **exclusively** §6.2.

| Field | Live rule |
|-------|-----------|
| `exportMode` | **`LIVE_VERSIONED`** — **only** field allowed to differ from Offline envelope |
| `canonicalContentChecksum` / `packageId` | **Identical** to Offline verified envelope |
| `generatedAt` | **MUST** equal Offline `generatedAt` — **MUST NOT** regenerate; still **never** in logical checksum |
| Unknown fields | **REJECT** |

**Authority rule:** Logical checksum is computed from **payload canonical view** (Offline §15), not from `exportMode`. Therefore the **same payload** yields the **same** `canonicalContentChecksum` whether Offline or Live wrapper mode differs.

**Serialization for remote bytes:** **§6.2 only** (allowlist key order + compact JSON + trailing newline). Physical `contentSha256` hashes **those exact bytes**. Retries **MUST** reproduce identical bytes.

## 12. Orden transaccional (CLOSED)

```text
evaluate readiness (ST-RDY + CB-16 readiness)
  → PRECONDITION §6.1: Offline VERIFY PASS AND DHI_OFFLINE_LOCAL_EXPORT (same checksum)
  → load Offline verified envelope
  → confirm canonicalContentChecksum + packageId
  → build stable LIVE_VERSIONED bytes (§6.2)
  → PREPARE remote (resolve key, authz, meta allowlist §7.1.2, size/timeout checks)
  → remote putIfAbsent(bytes, meta)
  → remote VERIFY(remoteKey, expected) per §7.1.1
  → register DHI_LIVE_VERSIONED_EXPORT
  → SUCCESS
```

| Result | When |
|--------|------|
| **SUCCESS** | §6.1 satisfied **and** remote VERIFY PASS **and** Live ELR act present (or idempotent already-linked) |
| **OFFLINE_PREREQUISITE_MISSING** | §6.1 A∧B not satisfied (artifact **and** act both required) |
| **REMOTE_OK_ELR_PENDING** | Remote VERIFY PASS but ELR write fails — **not** SUCCESS |
| **CONFLICT / VERIFY_FAIL / AUTHZ_FAIL / TIMEOUT / UNCERTAIN** | Fail-closed; **no** success ELR |

**ELR MUST NOT register Live success before remote VERIFY PASS.**

Live service **MUST NOT** be composed into `prepareAndDeliver` in v1.

---

## 13. Integridad remota (CLOSED)

| Concern | Rule |
|---------|------|
| Hashed physically | Exact remote envelope bytes |
| Logical identity | Recompute `canonicalContentChecksum` from `payload`; match field + Offline |
| `packageId` | Must equal `dpkg-{factory_key}-{checksum}` |
| Metadata minimum | `remoteKey`, `contentSha256`, `canonicalContentChecksum`, `exportMode`, `exportSchemaVersion`, `packageId`, `factory_key` |
| Overwrite protection | `putIfAbsent` only; different bytes → conflict |
| Versionado | Content-addressed via `packageId`; no mutable latest |
| Immutability | Committed object treated immutable in v1 |
| Corruption | VERIFY fail → fail-closed; **no silent repair** |
| Fail-closed | All integrity failures throw/return non-SUCCESS |

---

## 14. Idempotencia (CLOSED)

| Situation | Action |
|-----------|--------|
| Same `factory_key` + same checksum | Same `packageId` + same `remoteKey` + **same §6.2 bytes** |
| Remote object already present + VERIFY matches | No rewrite; complete ELR if missing Live act; else SUCCESS idempotent |
| Retry after timeout with uncertain remote | Rebuild §6.2 bytes (identical); `head`/`get`+VERIFY before re-put; if present+match → continue; if absent → putIfAbsent; if conflict → fail |
| Duplicate queue notify (if notify used) | Notify is optional/idempotent; corpus identity unchanged |
| Same key, different content | **Fail-closed conflict** — no overwrite |
| Concurrent export same checksum | One winner putIfAbsent; loser must VERIFY existing; ELR one act per checksum |

---

## 15. Recovery y reconciliación (CLOSED)

| Situation | Action |
|-----------|--------|
| Remote artifact without ELR | `reconcilePendingLiveElrRef` after VERIFY — write act or remain PENDING fail-closed for consumers |
| ELR without remote artifact | **Orphan ELR** — fail-closed report; **no** silent fabricate remote; ops intervention |
| Upload complete + timeout before verify | On resume: get+VERIFY; then ELR if needed |
| Object present, verification pending | MUST VERIFY before SUCCESS/ELR |
| Duplicate notify | Ignore if locator already linked |
| Fail after VERIFY before ELR | `REMOTE_OK_ELR_PENDING` + reconcile |
| Fail ELR after remote success | Same — remote remains; reconcile |
| Crash mid-flight | Resume via head/get/VERIFY + reconcile; **no silent repair** |
| Offline OK + Live fail | Offline untouched; Live non-SUCCESS |

---

## 16. Estados CB-16 (CLOSED)

| Rule | Binding |
|------|---------|
| Minimum state for Live v1 | **`ST-RDY`** AND `evaluateDecisionReadiness.ready === true` |
| Relation to Offline | Same readiness gate; **§6.1 A∧B** required (artifact VERIFY + `DHI_OFFLINE_LOCAL_EXPORT`) |
| Live vs CB-16 `prepareAndDeliver` | Live is **independent** service; **MAY** run **before** ST-DEC handoff |
| ST-DEC re-export | **DEFERRED** (same as Offline M2) — not authorized in v1 Live IMPL |
| Forbidden | Export from non-ready states; inventing commercial state; treating Live as ST-DEC transition |

Rationale: preserves Offline constitutional gate; Master Plan Decision Engine consumption remains future; Live does not force handoff state machine changes.

---

## 17. Seguridad (CLOSED — vendor-neutral)

| Control | Rule |
|---------|------|
| AuthN | Machine-to-machine identity required for real adapters (future); fake adapter uses test double only |
| AuthZ | Role: Factory Ops / export principal only; deny anonymous |
| Secrets | Outside repository; env/secret manager; **never** committed |
| Least privilege | Put/get only on allowlisted prefix `live/v1/{factory_key}/…` |
| Encryption in transit | Required for real remote adapters (TLS) |
| Encryption at rest | Required for real remote adapters (provider or app-level) |
| Audit trail | ELR act + sanitized logs with `liveAttemptId` / `packageId` |
| Redaction | No raw secrets; minimize PII in logs |
| Destination allowlist | Explicit allowlist; **no arbitrary URL** |
| SSRF prevention | No user-controlled fetch URL; adapter endpoints configured, not free-form |
| Timeout / size limits | Mandatory |
| Credentials in logs | **PROHIBITED** |
| Fail-closed | AuthZ/allowlist/timeout failures → non-SUCCESS |

---

## 18. Data classification (CLOSED)

| Property | Value |
|----------|-------|
| Classification | **`INTERNAL_OPS` / Factory Decision corpus — CONFIDENTIAL operational** |
| Default exposure | **Private** |
| Public URL | **PROHIBITED** |
| Investor / Marketplace exposure | **PROHIBITED** |
| Admin/Ops access | Controlled; least privilege |
| Decision Engine Adapter | Authenticated private fetch by locator only (future) |

---

## 19. Observability (CLOSED)

Observability for Live export **MUST NOT** mutate Read Model II.2 semantics or turn Observability into a write plane.

| Signal | Allowed |
|--------|---------|
| Metrics | attempts, success, fail, conflict, timeout, reconcile counts (names IMPL) |
| Events/logs | Sanitized structured logs with `liveAttemptId`, `factory_key`, `packageId`, result code |
| Correlation | `liveAttemptId` + `factory_key` + `packageId` |
| Health | Sink adapter health probe (fake always OK; real adapter future) |
| Retries | Count + outcome |
| Dead-letter | Only if notify/queue hook enabled later — **locator metadata only**, never full Package dump as DLQ default |
| ELR traceability | `DHI_LIVE_VERSIONED_EXPORT` act |

II.2 remains **READ_ONLY** consumer contract — Live must not redefine it.

---

## 20. Proveedor y dependencias (CLOSED)

```text
DecisionPackageLiveExportService
        │
        ├── LocalExportPort (Offline — REQUIRED read/verify)
        ├── DecisionPackageLiveSinkPort
        │       ├── InMemoryDecisionPackageLiveSink     ← v1 IMPL ONLY
        │       └── (Future) CloudObjectLiveSinkAdapter ← NOT AUTHORIZED now
        └── FactoryRegistry / decisionLedger (ELR act)
```

| Layer | v1 |
|-------|----|
| Contract | Required |
| In-memory / fake adapter | Required for suites |
| Cloud SDK / new deps | **Forbidden** without later mandate |
| `package.json` | **Unchanged** in v1 |

---

## 21. Compatibilidad futura Decision Engine Adapter (CLOSED)

Prepared:

- Stable `packageId` / checksum / `remoteKey` / locator fields  
- Immutable remote bytes  
- Boundary flags remain `decides=false`  

Forbidden for consumer adapter:

- Mutating Factory corpus in place  
- Rewriting Evidence / Legitimacy inside original package  
- Elevating AI advisory to sovereign decision inside package  
- Writing commercial outcomes back into the original envelope  
- Treating Live SUCCESS as Marketplace publish or P-INT-05  

---

## 22. Compatibilidad constitucional

| Surface | Compatibility rule |
|---------|-------------------|
| CB-16 | Reuse package/readiness/boundary; additive ELR kind only |
| P-INT-04 Offline | Hard prerequisite; no semantic fork |
| P-INT-03 | Patterns only; ELR store unchanged by this Plan |
| II.1–II.6 | Preserve fences; Live ≠ Delivery / ≠ `HANDOFF_EXECUTED` |
| Runtime | No unauthorized changes |
| ELR | Reference acts only; no full package dump |
| Factory Constitution | Factory produces corpus; does not commercially decide |

---

## 23. Archivos previstos (for future IMPL — not created by this act)

### 23.1 New (illustrative binding paths)

```text
src/factory/cb16/export/decisionPackageLiveSinkPort.js
src/factory/cb16/export/inMemoryDecisionPackageLiveSink.js
src/factory/cb16/export/decisionPackageLiveExportService.js
src/runPInt04LiveDecisionPackageValidation.js
```

### 23.2 Minimal allowed modifications (future IMPL only)

```text
src/factory/cb16/decisionPackageSchema.js   # add HANDOFF_ELR_KINDS.LIVE_VERSIONED_EXPORT
src/factory/cb16/decisionLedger.js          # recordLiveVersionedExport / find helper
src/factory/cb16/export/index.js            # re-exports
```

### 23.3 Expressly prohibited to modify under Live IMPL

Runtime; Read Model II.2; II.3–II.6 semantics; Web; Marketplace; Supabase; Product; Offline Plan/Status docs as “rewrite”; P-INT-03 store flip to cloud; `package.json` (v1).

---

## 24. Orden de implementación (future — after P-INT-04-LIVE-IMPL)

| Step | Content | Auth |
|------|---------|------|
| **S0** | This Plan audited | Plan only |
| **S1** | Mandate **P-INT-04-LIVE-IMPL** | Director |
| **S2** | Port + InMemory adapter | IMPL |
| **S3** | Live export service + Offline prerequisite gate | IMPL |
| **S4** | ELR kind + ledger helpers | IMPL |
| **S5** | Runner + suites §26 | IMPL |
| **S6** | Regress Offline / CB-16 / P-INT-03 / II.2 | IMPL |
| **S7** | Independent audit | Director |
| **S8** | Status | Director |
| **S9** | Final commit | Director |
| **S10** | Real cloud adapter / SDKs | **NOT AUTHORIZED** by this Plan |

---

## 25. Criterios de aceptación (future IMPL)

1. Suites §26 PASS.  
2. Offline still PASS; Live does not break Offline artifacts.  
3. Remote VERIFY before ELR proven.  
4. Kind `DHI_LIVE_VERSIONED_EXPORT` only for Live success.  
5. Mode `LIVE_VERSIONED` only.  
6. No Decision Engine / Delivery / II.7 / P-INT-05 / Web / Supabase in diff.  
7. No new npm dependencies in v1.  
8. Status declares cloud vendor still NOT AUTHORIZED.

---

## 26. Suites obligatorias (mínimas)

1. Live port contract (putIfAbsent / get / verify / head).  
2. Happy path Offline→live→ELR SUCCESS.  
3. Remote verification mismatch fail-closed.  
4. Idempotency same checksum.  
5. Content conflict same key.  
6. Timeout / uncertain outcome resume.  
7. Retry safe.  
8. Orphan remote → reconcile.  
9. Orphan ELR → failClosed report.  
10. Corruption fail-closed.  
11. Concurrent export same checksum.  
12. AuthZ failure (fake policy).  
13. Destination allowlist deny.  
14. Unknown envelope fields reject.  
15. No Delivery / no `HANDOFF_EXECUTED` / no `DHI_PACKAGE_DELIVERED` as Live success.  
16. No Decision Engine hooks/classify.  
17. Offline prerequisite missing fails.  
18. `REMOTE_OK_ELR_PENDING` then reconcile.  
19. Regress CB-16.  
20. Regress P-INT-04 Offline.  
21. Regress P-INT-03 Offline.  
22. Regress II.2 Read Model.  
23. Static audit: no cloud SDK / supabase / http arbitrary / package.json deps.

---

## 27. Definition of Done (future IMPL)

- Port + InMemory adapter + Live service + ELR kind + runner green  
- Independent audit PASS (or PASS WITH OBSERVATIONS non-blocking)  
- Status document recorded  
- Master Plan Live sink **locally validated**; **real cloud still OPEN/NOT AUTHORIZED** until later mandate  

---

## 28. Matriz de riesgos

| Riesgo | Severidad | Mitigación |
|--------|-----------|------------|
| Live confused with Delivery / II.7 | Crítica | §§0,2–3,10; suites |
| Decision Engine smuggled into Factory | Crítica | §7.2 / §21; banner |
| Corpus divergence Offline vs remote | Alta | Offline prerequisite + putIfAbsent + VERIFY |
| Overwrite immutable object | Alta | putIfAbsent + conflict |
| Public Package URL | Alta | §18 private default |
| Cloud vendor lock-in in v1 | Alta | InMemory only; no SDK |
| ELR success before remote verify | Alta | §12 order |
| P-INT-05 premature | Alta | NOT OPENED |
| SSRF / arbitrary destination | Alta | Allowlist §17 |
| Silent repair | Alta | Forbidden |

---

## 29. Matriz de restricciones

| Acción | Este Plan | LIVE-IMPL (future) | Cloud vendor later |
|--------|-----------|--------------------|--------------------|
| Create this Plan | YES | — | — |
| Write Live code | NO | Solo con mandato | — |
| InMemory adapter | NO | YES if mandated | — |
| Cloud SDK / deps | NO | NO (v1) | Solo mandato aparte |
| Decision Engine | NO | NO | NO (outside Factory) |
| Delivery / II.7 | NO | NO | NO under this row |
| P-INT-05 | NO | NO | NO |
| Web / Supabase deals | NO | NO | NO |

---

## 30. Rollback lógico / recovery (Plan level)

| Event | Action |
|-------|--------|
| Live IMPL defective | Disable Live service; Offline remains source of local truth |
| Bad remote object | Do not overwrite; quarantine via ops; fail-closed reads |
| Bad ELR act | No silent delete; ops reconcile procedures |
| Need withdraw Live | Stop Live exports; Offline + CB-16 unchanged |

Recovery procedures follow §15; absolute multi-system atomicity **not** claimed.

---

## 31. Dependencias previas obligatorias

| Dependency | Status for Live IMPL |
|------------|----------------------|
| **P-INT-04 Offline COMPLETE** | **REQUIRED** |
| **CB-16 Decision Package** | **REQUIRED** |
| **II.7** | **NOT required / NOT OPENED** |
| **P-INT-01** | **NOT required for v1 InMemory Live** (HTTP Handoff API is separate Control Plane work) |
| **P-INT-02 Live** | **NOT required** |
| **P-INT-03 cloud ELR** | **NOT required** |
| **Product / Marketplace** | **NOT required** (forbidden as scope) |

---

## 32. Cláusula Master Plan

| Fila | Estado tras este Plan (documentary) |
|------|-------------------------------------|
| P-INT-04 Offline | COMPLETE (unchanged) |
| P-INT-04 Live Plan | **EXISTS — PLAN ONLY** |
| P-INT-04 Live IMPL / real cloud sink | **OPEN / NOT AUTHORIZED** |
| Decision Engine | **NOT AUTHORIZED** (adapter future, external) |
| P-INT-05 | **NOT OPENED** |
| II.7 | **NOT OPENED** |

---

## 33. Authorization clause

```text
This document does NOT authorize implementation.

Implementation requires a separate explicit Director mandate:

P-INT-04-LIVE-IMPL

Until that mandate:
- no Live code;
- no runners;
- no cloud adapters;
- no dependency adds;
- no II.7;
- no P-INT-05;
- no Decision Engine;
- no Delivery.
```

---

## 34. Documentary Status

| Ítem | Estado |
|------|--------|
| This Live Implementation Plan | **CREATED — PLAN ONLY** |
| P-INT-04-LIVE-IMPL | **NOT AUTHORIZED** |
| Sink architecture | **CLOSED** — object-storage-shaped + optional notify; InMemory v1 |
| Live Port name | **CLOSED** — `DecisionPackageLiveSinkPort` |
| Export mode | **CLOSED** — `LIVE_VERSIONED` |
| ELR kind | **CLOSED** — `DHI_LIVE_VERSIONED_EXPORT` |
| Offline prerequisite | **CLOSED** — §6.1 **A∧B** (artifact VERIFY **and** `DHI_OFFLINE_LOCAL_EXPORT`) |
| Remote bytes stability | **CLOSED** — §6.2 (`exportMode` only delta; `generatedAt` frozen) |
| `verify` expected | **CLOSED** — §7.1.1 |
| `putIfAbsent` meta allowlist | **CLOSED** — §7.1.2 |
| Locator field | **CLOSED** — `remoteRef` only |
| Cloud vendor / SDKs | **NOT AUTHORIZED** |

---

## 35. Final Clause

This Plan authorizes **only** the existence of an audited planning document for **P-INT-04 Live / Versioned Sink** as the non-local extension of CB-16 Decision Package Export, reusing Offline corpus identity, without Decision Engine, Delivery, II.7, P-INT-05, Web, or Supabase.

It does **not** authorize implementation until **P-INT-04-LIVE-IMPL** is expressly mandated.

---

**END OF DOCUMENT**

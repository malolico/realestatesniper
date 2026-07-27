# FACTORY INTEGRATION P-INT-01
## FACTORY SERVICE EDGE
## IMPLEMENTATION PLAN

**Document ID:** `FACTORY_INTEGRATION_P_INT_01_IMPLEMENTATION_PLAN.md`  
**Phase:** Factory Integration — Operational Completeness / Master Plan Fase I–II Control Plane  
**Block:** P-INT-01 — Factory Service Edge  
**Document Type:** Technical Implementation Plan  
**Status:** **DRAFT / PENDING DOCUMENTARY AUDIT** — **NO IMPLEMENTATION AUTHORIZED BY THIS DOCUMENT**

**Repository:** RealEstateSniper  

**Normative sources:**

1. `docs/factory-construction/FACTORY_INTEGRATION_MASTER_PLAN.md` (§0; §3.2 P-INT-01; §4.1 Control Plane; §4.2 AuthZ Admin Gateway / Job Runner; §5 Fase I–II; §7; §10 MVI)  
2. `docs/factory-construction/integration/FACTORY_INTEGRATION_II_1_SECURITY_BOUNDARY_SPECIFICATION.md`  
3. `docs/factory-construction/integration/FACTORY_INTEGRATION_II_2_READ_MODEL_CONTRACT_V2_SPECIFICATION.md`  
4. II.3–II.6 specifications / plans / status — **frontier preservation only** (eligibility / unit / handoff ≠ Service Edge transport)  
5. P-INT-02 / P-INT-03 / P-INT-04 Offline + Live Plans and Status — completed Arizona slices; **not** substitutes for P-INT-01  
6. CB-01 Registry / ELR; CB-15 Orchestration Bus + `factoryBoundaryGuard`; CB-18 Governance Dashboard  
7. `services/factory-observability/**` — Block I.1 Observability Reader (read-only; **no HTTP server**)  
8. Director Discovery READ_ONLY — P-INT-01 (session): PLANIFICACIÓN YES / IMPLEMENTACIÓN NO  

**Director authorization (this Plan document):** **approved** to exist as planning artifact pending Documentary Audit.  
**Director authorization (P-INT-01-SLICE-A-IMPL code):** **NOT AUTHORIZED** by this document.  
**Director authorization (P-INT-01-SLICE-B-IMPL code):** **NOT AUTHORIZED** by this document.  
**Director authorization (Handoff/Lifecycle/Canon Gate HTTP, Admin live wiring, cloud deploy):** **NOT AUTHORIZED**.

**Technological / architectural decision (binding):**

1. **Transport v1 = HTTP** (JSON over HTTPS in deployment; plain HTTP allowed only for local test harness). **RPC deferred.**  
2. **Core service is transport-agnostic**; HTTP is an adapter.  
3. **Slice A (read-only) is the only first implementable cut.**  
4. **Slice B (command/orchestration) is planned but NOT AUTHORIZED** until Gate C.  
5. Reuse **I.1 reader allowlists** and **II.2** validation/sanitization/`INTERNAL_OPS` — **without rewriting** I.1 or II.2.  
6. **No** CB-00…CB-19 semantic rewrite; **no** Web / Supabase / Marketplace / Product mutation; **no** cloud SDK as default.

---

## 0. Absolute Non-Authorization Banner

This Plan **does not** authorize, and any future IMPL under a separate Director mandate **must not** introduce under color of this document alone:

| Surface | Status under this Plan |
|---------|------------------------|
| Slice A implementation code | **NOT AUTHORIZED** until Gate B + Director mandate |
| Slice B orchestration / job runner IMPL | **NOT AUTHORIZED** until Gate C + separate mandate |
| Handoff API HTTP / Lifecycle API / Canon Gate API | **FUTURE / NOT AUTHORIZED** |
| Admin live wiring (React / FCC → live Service Edge) | **FUTURE / NOT AUTHORIZED** (first IMPL commits: no Web touch) |
| Cloud vendor deploy / horizontal scaling / real queue vendor | **FUTURE / NOT AUTHORIZED** |
| Decision Engine / Product / Marketplace / Projection / Delivery / II.7 / P-INT-05 | **PROHIBITED / NOT OPENED** |
| Investor JWT trust / public Investor API | **PROHIBITED** |
| Supabase writes / ELR in `deals` tables | **PROHIBITED** |
| Synchronous CB-15 inside Web request | **PROHIBITED** |
| Modification / rewrite of CB-00…CB-19, I.1, or II.2 | **PROHIBITED** |
| New cloud SDKs / `package.json` cloud deps as default v1 | **NOT AUTHORIZED** |

**Hard separations:**

```text
P-INT-01 Factory Service Edge     ≠  Block I.1 CLI observability (related precursor)
P-INT-01 Service Edge             ≠  II.2 Read Model contract (reused projection rules)
P-INT-01 Slice A (read)           ≠  Slice B (command)
P-INT-01 HTTP Control Plane       ≠  II.7 Delivery / authenticated consumer channels
P-INT-01 Registry/ELR summary     ≠  full ELR dump / Decision Package
P-INT-01 Admin AuthZ              ≠  Investor Auth / Marketplace JWT
Factory Service Edge              ≠  Decision Engine / Product / Marketplace
CB-15 orchestrate (Slice B only)  ≠  Slice A read path
Static snapshot JSON              ≠  live Service Edge API (dual path risk — mitigated)
```

---

## 1. Block identity

| Campo | Valor |
|-------|-------|
| Master Plan name | **P-INT-01 Factory Service Edge** |
| Official definition | Entrada **HTTP/RPC segura** a **CB-15/18** — **read + orchestrate controlado** |
| Audience | **Admin / Factory Ops / Director only** |
| Investor exposure | **FORBIDDEN** |
| Constitutional owner of Factory truth | **Factory CB-00…CB-19** (unchanged) |
| Integration role | **Adapter / Control Plane edge** — does not rewrite Factory |
| Dependencies (binding) | **CB-01, CB-15, CB-18, AuthN/AuthZ Admin** |
| Discovery | **COMPLETE** (READ_ONLY) |
| This Plan | **DRAFT / PENDING DOCUMENTARY AUDIT** |
| Implementation | **NOT AUTHORIZED** |

---

## 2. Architectural problem statement

Factory 2.0 is constitutionally complete and runtime-isolated. The product (Web / Admin / Marketplace / Supabase) does **not** consume Factory through a secure boundary.

**Problem P-INT-01 solves:**

1. Provide a **single Admin-only Control Plane entry** so Ops can observe Factory without importing `src/factory` into the browser or trusting UI gates.  
2. Expose **sanitized read** of Registry / ELR summaries / CB-18 governance without leaking full ELR or Decision Packages.  
3. Later (Slice B only), allow **controlled asynchronous orchestration** via CB-15 without synchronous Web execution.  
4. Preserve FFO / LFF / PP boundaries: Factory does not decide commercial tier, Marketplace, or Product.

**Problem P-INT-01 does not solve:** Decision Engine, Product publish, Marketplace sync, Delivery transport, DSO live ingest, or cloud ELR.

---

## 3. Slice architecture (binding)

### 3.1 Slice A — READ-ONLY SERVICE EDGE (first implementable cut)

**Status:** **PLANNED** (implementation NOT AUTHORIZED until Gate B).

Slice A **MUST** define and (when authorized) implement:

| Requirement | Binding |
|-------------|---------|
| Internal Admin-only service boundary | YES |
| Registry API (summary) | YES |
| ELR summary **sanitized** | YES — **never** full ELR |
| Governance Dashboard API | YES |
| Canon drift / compliance / maturity read paths | YES |
| Reuse I.1 Observability Reader patterns / allowlists | YES |
| Reuse II.2 Read Model v2 validation / sanitization / classification | YES |
| `dataClassification: INTERNAL_OPS` | YES |
| Versioned contracts | YES |
| AuthN server-side | YES — mandatory |
| AuthZ server-side | YES — deny-by-default |
| Role allowlist | `FACTORY_OPS`, `FACTORY_DIRECTOR` |
| Fail-closed | YES |
| Request audit | YES |
| Rate limiting | YES |
| Request correlation | YES |
| Health / readiness | YES |
| Sanitized responses | YES |
| Prohibit direct consumer access to internal stores | YES |
| Factory writes | **FORBIDDEN** |
| CB-15 orchestration | **FORBIDDEN** in Slice A |
| Decision Package delivery | **FORBIDDEN** |
| Web / Admin live wiring in first IMPL commits | **FORBIDDEN** |

### 3.2 Slice B — COMMAND / ORCHESTRATION EDGE

**Status:** **FUTURE / NOT AUTHORIZED**.

Slice B **MUST** be specified here for architectural completeness and **MUST NOT** be implemented under Slice A authorization.

| Element | Plan requirement |
|---------|------------------|
| Orchestration API | Defined; NOT AUTHORIZED |
| CB-15 integration | Via job worker only |
| Execution mode | **Async only** |
| Job runner | Required prerequisite |
| Job registry | Required |
| Idempotency key | Required |
| Command validation | Required |
| Capability-based AuthZ | Required |
| Audit trail | Required |
| Lineage | Via CB-15 / ELR acts (existing) + edge audit |
| Status polling | Required |
| Cancellation policy | Defined (§18) |
| Retry policy | Defined (§18) |
| Timeout policy | Defined (§18) |
| Sync CB-15 inside Web request | **PROHIBITED** |

**Slice B may proceed only when all of the following are true:**

1. Slice A **COMPLETE** (Status + Implementation Commit + Independent Audit PASS)  
2. AuthN/AuthZ **operational** on the edge  
3. Job runner **implemented** and validated  
4. Independent technical audit of Slice B Plan/design  
5. **Separate** Director mandate: `P-INT-01-SLICE-B-IMPL`

### 3.3 Later slices — FUTURE / NOT AUTHORIZED

| Slice / surface | Status |
|-----------------|--------|
| Handoff API HTTP (CB-16) | **FUTURE / NOT AUTHORIZED** |
| Lifecycle API (CB-17) | **FUTURE / NOT AUTHORIZED** |
| Canon Gate API (deploy allow/deny) | **FUTURE / NOT AUTHORIZED** |
| Advanced Governance API beyond v1 panels | **FUTURE / NOT AUTHORIZED** |
| Admin live wiring (FCC → Service Edge) | **FUTURE / NOT AUTHORIZED** |
| Cloud deployment | **FUTURE / NOT AUTHORIZED** |
| Horizontal scaling | **FUTURE / NOT AUTHORIZED** |
| Real queue vendor | **FUTURE / NOT AUTHORIZED** |

---

## 4. Closed architectural decisions (1–25)

### D1 — HTTP vs RPC for v1

| Decision | **HTTP (JSON)** |
|----------|-----------------|
| Binding | **CLOSED** |
| Justification | Master Plan says “HTTP/RPC”; HTTP is universal for Admin tooling, curl/CI, and local harnesses. RPC adds framing complexity without benefit for read-only v1. |
| RPC | **DEFERRED** — may be added later as alternate adapter over the same core service |

### D2 — Most conservative runtime candidate

| Decision | **Node.js in-process application service** (same runtime family as Factory) |
|----------|----------------------------------------------------------------------------|
| Binding | **CLOSED** |
| Justification | Factory, I.1, and II.2 validators are Node ESM. Avoids cross-runtime serialization risk in v1. |
| Forbidden as default | Browser runtime; Edge Function executing Factory motors; bundling Factory into Vite investor app |

### D3 — Hosting-neutral architecture

| Decision | **Hosting-neutral ports + adapters** |
|----------|--------------------------------------|
| Binding | **CLOSED** |
| Core | `FactoryServiceEdgeCore` (pure application service) |
| Ports | `AuthnPort`, `AuthzPort`, `RateLimitPort`, `AuditPort`, `ClockPort`, `FactoryReadPort`, `HttpTransportPort` |
| Adapters v1 | In-memory AuthN/AuthZ/RateLimit/Audit for local validation; HTTP adapter (Node `http` or minimal framework-agnostic handler) |
| Cloud host | **NOT SELECTED** — no AWS/GCP/Azure/Supabase Edge as default |

### D4 — API versioning

| Decision | URL prefix **`/v1/factory/...`** + response envelope `apiVersion: "1.0.0"` |
|----------|----------------------------------------------------------------------------|
| Binding | **CLOSED** |
| Rules | Breaking change → `/v2`; additive fields → minor/`apiVersion` bump; unknown response fields rejected by strict clients SHOULD |
| Relationship to II.2 | HTTP `apiVersion` ≠ II.2 `schemaVersion`; when embedding Read Model fragments, II.2 `schemaVersion` remains `"2.0.0"` |

### D5 — Endpoint catalog v1 (read-only)

**Proposed catalog (justified names):** Master Plan §4.1 names Registry / Governance Dashboard / Canon drift. Paths use a shared `/v1/factory` namespace for Admin Control Plane clarity and to avoid colliding with product `/api` routes.

| Method | Path | Purpose | Source |
|--------|------|---------|--------|
| `GET` | `/v1/factory/health` | Liveness (process up) | Edge self |
| `GET` | `/v1/factory/readiness` | Ready to serve reads (deps OK) | Edge + FactoryReadPort probe |
| `GET` | `/v1/factory/registry/summary` | Registry / expediente summary counts | CB-01 via I.1-style read |
| `GET` | `/v1/factory/elr/summary` | Sanitized ELR health + kind counts | CB-01/15 aggregate **summary only** |
| `GET` | `/v1/factory/governance/dashboard` | Aggregated governance view | CB-18 panels via I.1 |
| `GET` | `/v1/factory/governance/drift` | Canon drift | CB-18 `detectCanonDrift` |
| `GET` | `/v1/factory/governance/compliance` | Compliance panel | CB-18 |
| `GET` | `/v1/factory/governance/maturity` | Maturity metrics | CB-18 |

**Names are binding for Plan v1** unless Documentary Audit renames them before Gate A commit.  
**No endpoints are implemented by this document.**

**Explicitly out of Slice A catalog:** POST/PUT/PATCH/DELETE; orchestrate; handoff; lifecycle; any path returning full ELR or Decision Package.

### D6 — Request / response schemas

**Common response envelope (binding):**

```json
{
  "apiVersion": "1.0.0",
  "contractId": "factory.service_edge.read",
  "mode": "READ_ONLY",
  "dataClassification": "INTERNAL_OPS",
  "correlationId": "uuid",
  "generatedAt": "RFC3339",
  "observationStatus": "HEALTHY | DEGRADED | PARTIAL | UNAVAILABLE | INVALID",
  "payload": {},
  "warnings": []
}
```

| Field | Rule |
|-------|------|
| `contractId` | Exact `factory.service_edge.read` for Slice A |
| `mode` | Exact `READ_ONLY` |
| `dataClassification` | Exact `INTERNAL_OPS` |
| `payload` | Endpoint-specific; allowlisted fields only |
| Unknown root fields | **REJECT** on produce (do not emit) |

**Request (Slice A):** query params allowlisted per endpoint (e.g. optional `factory_key` for scoped summary). Bodies **MUST NOT** be accepted on Slice A GETs (ignore or **400**).

When an endpoint returns governance/observation fragments aligned with II.2, those fragments **MUST** remain valid under II.2 sanitization rules (no secrets, paths, stack traces).

### D7 — Error model

| HTTP | `code` | When |
|------|--------|------|
| 401 | `UNAUTHENTICATED` | Missing/invalid AuthN |
| 403 | `FORBIDDEN` | Authenticated but role/capability denied |
| 404 | `NOT_FOUND` | Unknown path (no route leak of internals) |
| 400 | `VALIDATION_FAIL` | Invalid query / unsupported field |
| 429 | `RATE_LIMITED` | Rate limit exceeded |
| 503 | `NOT_READY` | Readiness fail / dependency unavailable |
| 500 | `INTERNAL_ERROR` | Unexpected; **no** stack/secret in body |

Error body:

```json
{
  "apiVersion": "1.0.0",
  "error": {
    "code": "FORBIDDEN",
    "message": "non-sensitive human summary",
    "correlationId": "uuid"
  }
}
```

Fail-closed: prefer **deny / unavailable** over partial sensitive leakage.

### D8 — AuthN contract

| Rule | Binding |
|------|---------|
| AuthN | **Server-side mandatory** on all endpoints except `GET /v1/factory/health` |
| `health` | Unauthenticated liveness **only** — no Factory data |
| `readiness` | **Authenticated** (prevents unauthenticated dependency probing of Factory) |
| Credential types v1 | Opaque **Admin session token** or **mTLS service identity** via `AuthnPort` — **not** Investor JWT |
| Investor JWT | **MUST be rejected** even if cryptographically valid for product |
| UI cookies alone | **Insufficient** (II.1 SBP-08) |
| Adapter v1 | `InMemoryAuthnAdapter` for tests; production adapter **selected later** under Gate B (no cloud vendor locked here) |

### D9 — AuthZ roles and capabilities

| Role | Capabilities (Slice A) |
|------|------------------------|
| `FACTORY_OPS` | All Slice A read endpoints |
| `FACTORY_DIRECTOR` | All Slice A read endpoints + future elevated audit export (not in v1) |
| *(any other)* | **DENIED** |

| Rule | Binding |
|------|---------|
| Default | **Deny-by-default** |
| Allowlist | Explicit roles above only |
| Capability checks | Per-route capability IDs: `factory.read.registry`, `factory.read.elr_summary`, `factory.read.governance`, `factory.read.health_auth` |
| UI gating | **Never** authoritative |
| Slice B (future) | Separate capabilities e.g. `factory.command.orchestrate` — **not granted** by Slice A roles alone without Gate C policy update |

### D10 — Rate limiting baseline

| Scope | Limit (v1 baseline) |
|-------|---------------------|
| Per principal | **60 req/min** sliding window |
| Per IP (unauthenticated health only) | **30 req/min** |
| Burst | **10** additional tokens |
| On exceed | **429** + `Retry-After` |
| Adapter | `RateLimitPort` — InMemory for tests |

Limits are **baselines**; production may tighten without API break.

### D11 — Audit event schema

Every authenticated request **MUST** append an edge audit record (append-only; not Factory ELR mutation):

```json
{
  "auditId": "uuid",
  "ts": "RFC3339",
  "correlationId": "uuid",
  "principalId": "string",
  "roles": ["FACTORY_OPS"],
  "method": "GET",
  "path": "/v1/factory/governance/drift",
  "statusCode": 200,
  "outcome": "SUCCESS | DENY | ERROR | RATE_LIMITED",
  "capability": "factory.read.governance",
  "clientIpHash": "optional sha256 truncated",
  "userAgentClass": "optional coarse class"
}
```

| Rule | Binding |
|------|---------|
| Secrets / tokens / raw Authorization | **MUST NOT** be logged |
| Full ELR / Decision Package | **MUST NOT** be logged |
| Storage v1 | In-memory / local file audit sink under edge ownership — **not** Supabase `deals` |

### D12 — Correlation / trace identifiers

| Header | Rule |
|--------|------|
| `X-Correlation-Id` | Client MAY supply UUID; server MUST validate format or mint new UUID |
| Response | Echo `X-Correlation-Id` + body `correlationId` |
| Propagation | Same ID in audit events |

Distributed tracing vendors **NOT REQUIRED** in v1.

### D13 — Sanitization rules

Before any successful response payload is returned:

1. Apply I.1 deny-list spirit (no orchestration/handoff writers).  
2. Apply II.2 sanitization principles: strip secrets, credentials, absolute paths, stack traces, env vars, source code, mutable controls.  
3. Allowlist fields per endpoint schema — unknown fields **dropped or reject** (produce path: **do not emit**).  
4. Expediente summaries only — no raw ELR section dumps.  
5. No Decision Package bytes or commercial classification fields.

### D14 — Data classification

| Classification | Value |
|----------------|-------|
| All Slice A payloads | **`INTERNAL_OPS`** |
| Public / Investor | **FORBIDDEN** |
| Logs / metrics labels | Same classification discipline |

### D15 — Read model source of truth

| Layer | Authority |
|-------|-----------|
| Factory operational truth | **Factory Registry / ELR / CB-18 pure panels** |
| Observation projection rules | **II.2** (validation/sanitization/ownership/classification) |
| I.1 reader | **Reuse** as `FactoryReadPort` implementation reference — **not** rewritten |
| Service Edge | **Projection + transport** only — never claims ownership of Factory truth (`ownership.factory = FACTORY`) |

Static file `/factory-observability-snapshot.json` (if present) is **not** the live source of truth for Service Edge. Dual-path risk mitigated by documenting snapshot as **offline/dev artifact**, API as **live Control Plane**.

### D16 — Registry / ELR access boundary

| Allowed | Forbidden |
|---------|-----------|
| Read-only `getExpediente` / filesystem list without mkdir | `ensureDirs`, `write`, `listFactoryKeys` (mutating), `createExpediente`, `transitionState`, `registerElrAct` |
| `aggregateElr` pure counts | Full ELR JSON to client |
| Summary health statuses | Raw evidence payloads / secrets |

Consumers **MUST NOT** receive filesystem paths to Registry roots.

### D17 — Health and readiness

| Endpoint | Semantics |
|----------|-----------|
| `health` | Process alive; returns `{ status: "ok" }` minimal; **no** Factory reads; unauthenticated |
| `readiness` | AuthN+AuthZ required; probes FactoryReadPort (registry root readable or explicit empty-state OK); returns ready/not-ready |

Empty Registry is **valid ready** (`empty: true`) — matches I.1 empty-state philosophy.  
Corrupt unreadable store → **NOT_READY** / fail-closed.

### D18 — Idempotency / timeout / retry

| Concern | Slice A | Slice B (planned only) |
|---------|---------|------------------------|
| Idempotency | GETs are naturally idempotent; no body idempotency key required | **Required** `Idempotency-Key` on POST orchestrate |
| Timeout (server) | **2s** default read budget per dependency call | Job acceptance **≤1s**; job runtime separate budget (e.g. **15m** staging) |
| Retry (client) | Safe to retry GET on 503/429 with backoff | POST orchestrate: retry only with same Idempotency-Key |
| Cancellation (B) | N/A | Cooperative cancel flag; best-effort; no silent partial SUCCESS without ELR lineage |
| Sync Web orchestrate | N/A | **PROHIBITED** |

### D19 — Timeout and retry rules (summary binding)

- Edge **MUST** enforce server-side timeouts on Factory read adapters.  
- On timeout → `observationStatus: DEGRADED|UNAVAILABLE` or `503` — **no** partial sensitive fill.  
- Clients SHOULD exponential backoff on 429/503; MUST NOT hammer health for Factory data.

### D20 — Dependency injection / adapter boundaries

```text
HttpAdapter
  → AuthnPort → AuthzPort → RateLimitPort
  → FactoryServiceEdgeCore
       → FactoryReadPort (I.1-style)
       → (optional) Ii2ValidatorPort
       → AuditPort
       → ClockPort
```

| Rule | Binding |
|------|---------|
| Core MUST NOT import Express/Fastify/Koa types | Prefer |
| Core MUST NOT import React / Supabase / Marketplace | **MUST NOT** |
| CB mutation modules | **MUST NOT** be imported in Slice A |
| Tests inject InMemory adapters | YES |

### D21 — Test strategy

| Layer | Content |
|-------|---------|
| Unit | AuthZ deny/allow; sanitizer; schema allowlists; rate limiter |
| Contract | Response envelope; II.2 fragment compatibility; I.1 empty-state |
| Integration (local) | InMemory Auth + fake FactoryReadPort + HTTP handler |
| Negative | See §20 validation matrix |
| Regress | CB-01/15/18 validators unchanged; I.1 CLI still runnable; II.2 suite green |
| Forbidden | Hitting real Supabase; requiring cloud |

Runner sketch (future IMPL): `src/runPInt01ServiceEdgeValidation.js` — **not created by this Plan**.

### D22 — Threat model (v1)

| Threat | Mitigation |
|--------|------------|
| Unauthenticated Factory data scrape | AuthN on all data endpoints; health has no data |
| Investor JWT accepted | Explicit reject of product audience tokens |
| UI-only “security” | Server AuthZ mandatory (II.1 SBP-08) |
| Full ELR / Decision Package exfiltration | Summary-only schemas; deny fields; tests |
| Path traversal to Registry files | No path params to FS; keys validated |
| SSRF via query URLs | No outbound URL fetch in Slice A |
| DoS | Rate limits; body size **0** on GET; timeouts |
| Log injection / secret leakage | Audit schema; redaction |
| Replay of stolen Admin token | Short-lived tokens (adapter policy); TLS in deploy; rotation runbook (ops) |
| Confused deputy (Marketplace calling edge) | Network allowlist + Admin audience claim |

### D23 — Rollback / disable strategy

| Control | Behavior |
|---------|----------|
| Feature flag / env `FACTORY_SERVICE_EDGE_ENABLED=false` | Adapter returns 503 |
| Revoke AuthN adapter secrets | Immediate deny |
| Slice A defect | Disable edge; Factory + I.1 CLI remain; no CB rewrite needed |
| Audit sink failure | Fail-closed **or** degrade to deny new requests (prefer deny if audit required) — **binding preference: deny authenticated data plane if audit append fails** |

### D24 — Observability and metrics

| Metric (v1) | Type |
|-------------|------|
| `factory_edge_requests_total{path,status,role}` | Counter |
| `factory_edge_auth_denies_total` | Counter |
| `factory_edge_rate_limited_total` | Counter |
| `factory_edge_read_latency_ms` | Histogram |
| `factory_edge_ready` | Gauge |

No PII in metric labels. Advanced APM platforms = **FUTURE**.

### D25 — Definition of Done

See §21 (DoD Slice A / Slice B). Binding separation: Slice B DoD **not** part of first cut.

---

## 5. Endpoint catalog justification

| Proposed path | Why |
|---------------|-----|
| `/v1/factory/...` | Control Plane namespace; versioned; avoids product routes |
| `health` / `readiness` | Standard ops split (liveness ≠ readiness) |
| `registry/summary` | Master Plan Registry API — summary not full dump |
| `elr/summary` | ELR observability without corpus leak |
| `governance/dashboard` | Maps to CB-18 dashboard aggregate |
| `governance/drift|compliance|maturity` | Maps to CB-18 panels used by I.1 |

Alternative names (e.g. `/api/admin/factory/v1/...`) are acceptable **only** if Documentary Audit renames before Gate A; semantics must remain identical.

---

## 6. Security law (binding)

Slice A **MUST** impose:

1. AuthN server-side (except health)  
2. AuthZ server-side deny-by-default  
3. Explicit role allowlist: `FACTORY_OPS`, `FACTORY_DIRECTOR`  
4. No UI-only authorization  
5. No Investor JWT trust  
6. No public exposure  
7. No full ELR read to clients  
8. No Decision Package delivery  
9. No Factory writes from Slice A  
10. No CB-15 execution from Slice A  
11. Sanitize before respond  
12. Logging without secrets  
13. Replay protection where credentials apply (short TTL / rotation)  
14. Rate limiting  
15. Body size limits (GET: reject bodies > 0 bytes or > tiny cap)  
16. Input validation  
17. Fail-closed  

---

## 7. Mandatory exclusions

P-INT-01 (this Plan / Slice A / Slice B when later authorized) **does NOT implement**:

| Surface | Status |
|---------|--------|
| Decision Engine | **NOT IMPLEMENTED** |
| Deal / Premium / Diamond classification | **PROHIBITED** |
| Product | **NOT AUTHORIZED** |
| Marketplace | **NOT AUTHORIZED** |
| Projection | **PROHIBITED** |
| Delivery | **NOT AUTHORIZED** |
| II.7 | **NOT OPENED** |
| P-INT-05 | **NOT OPENED** |
| Supabase writes | **PROHIBITED** |
| ELR in `deals` tables | **PROHIBITED** |
| Investor API | **PROHIBITED** |
| Specific cloud vendor | **NOT SELECTED** |
| Cloud SDK default | **NOT AUTHORIZED** |
| Motors in browser | **PROHIBITED** |
| Synchronous CB-15 from Web | **PROHIBITED** |
| Modification of CB-00…CB-19 | **PROHIBITED** |
| Rewrite of I.1 or II.2 | **PROHIBITED** |

---

## 8. Relations to other blocks

| Block | Relation |
|-------|----------|
| Master Plan Fase I | P-INT-01 Slice A is the Control Plane realization of “Factory Registry read API + CB-18” |
| Master Plan Fase II | Slice B aligns with “Job runner + Orchestration API” |
| I.1 Observability | **Reusable read adapter**; CLI remains; Service Edge adds HTTP+Auth+audit |
| II.1–II.6 | Trust law + Read Model + publication governance preserved; Service Edge ≠ Delivery |
| P-INT-02/03/04 | Independent COMPLETE slices; may be observed via summaries; not replaced |
| CB-16 / P-INT-04 export | Remains in-process / Live sink; **Handoff HTTP** is later Control Plane slice |
| Web / Admin | Future consumer only; **not** wired in first IMPL commits |
| Product / Marketplace / Supabase | Parallel product plane — **no** coupling |

---

## 9. Dependencies and gates

### GATE A — DOCUMENTARY

| Criterion | Required |
|-----------|----------|
| This Plan complete | YES |
| Documentary Audit PASS (or PASS WITH OBSERVATIONS closed) | YES |
| Documentary Commit of this Plan | YES |
| Implementation | Still **NOT AUTHORIZED** |

### GATE B — SLICE A IMPLEMENTATION

| Criterion | Required |
|-----------|----------|
| Gate A complete | YES |
| AuthN/AuthZ adapter **defined** (port + at least InMemory) | YES |
| Contracts closed (this Plan + audit) | YES |
| Threat model closed | YES |
| Test plan approved | YES |
| **Explicit Director mandate** `P-INT-01-SLICE-A-IMPL` | YES |

### GATE C — SLICE B IMPLEMENTATION

| Criterion | Required |
|-----------|----------|
| Slice A COMPLETE (impl + audit + status) | YES |
| Job runner available | YES |
| Idempotency + command audit closed | YES |
| AuthN/AuthZ operational with command capabilities | YES |
| **Separate Director mandate** `P-INT-01-SLICE-B-IMPL` | YES |

---

## 10. Conservative implementation strategy (future IMPL)

When Gate B is granted:

1. Create edge module **outside** `src/factory/cb**` (e.g. `services/factory-service-edge/` or `src/integration/serviceEdge/`) — exact path chosen at IMPL without rewriting CB.  
2. Implement **core + ports** first; **InMemory adapters**; HTTP adapter last.  
3. **No** `package.json` cloud SDKs; prefer Node built-ins.  
4. **No** Web / Supabase / Marketplace file changes in Slice A commits.  
5. **No** Admin live wiring in first commits.  
6. Local executable validation runner + deterministic fixtures.  
7. Fail-closed defaults.  
8. Separate commits: (1) core+ports+tests, (2) HTTP adapter, (3) Status doc — or as Director orders.

Vendor-neutral: no AWS API Gateway / Supabase Edge / Cloudflare Workers as required runtime.

---

## 11. Validation matrix (Slice A)

Suites **MUST** cover at least:

| # | Case |
|---|------|
| 1 | AuthN absent → 401 |
| 2 | Role not allowed → 403 |
| 3 | Role allowed → 200 + envelope |
| 4 | Unknown endpoint → 404 |
| 5 | Invalid schema / unknown query → 400 |
| 6 | Store absent / empty → valid empty readiness/summary |
| 7 | Read model / payload invalid → fail-closed |
| 8 | Sanitization strips forbidden fields |
| 9 | `dataClassification === INTERNAL_OPS` |
| 10 | No full ELR leakage |
| 11 | No Decision Package leakage |
| 12 | Rate limit → 429 |
| 13 | Correlation ID echo |
| 14 | Health unauthenticated OK (no data) |
| 15 | Readiness auth + dependency probe |
| 16 | Degraded dependency → DEGRADED/503 without secrets |
| 17 | Fail-closed on audit sink failure (data plane) |
| 18 | Deterministic fixtures |
| 19 | Compatibility with I.1 allow/deny import spirit |
| 20 | Compatibility with II.2 sanitization / ownership / classification |

Regress: II.2 validator suite; sample CB-18 pure panels; I.1 CLI smoke.

---

## 12. Risks and mitigations

### HIGH

| Risk | Mitigation |
|------|------------|
| Full ELR exposure | Summary schemas; tests; deny raw sections |
| AuthZ only visual | Server AuthZ mandatory; II.1 SBP-08 |
| Sync command from Web | Slice B async-only; banned in Slice A |
| Mix with Product/Marketplace/Supabase | Exclusions §7; no writes; no investor JWT |
| Scope creep (II.7 / P-INT-05 / Handoff HTTP) | Later slices FUTURE; Gate C separation |

### MEDIUM

| Risk | Mitigation |
|------|------------|
| Dual path snapshot vs API | Snapshot = offline artifact; API = live truth; document dual-path |
| Missing job runner (for B) | Gate C blocks Slice B |
| Premature Handoff HTTP | FUTURE / NOT AUTHORIZED |
| DoS / rate limit gaps | Baseline limits + timeouts + body caps |
| Version inconsistency (api vs II.2) | Explicit dual versioning D4 |

### LOW

| Risk | Mitigation |
|------|------------|
| Endpoint naming bikeshed | Binding catalog + audit rename window before Gate A |
| Cosmetic Admin wiring | Explicitly out of first IMPL |
| Advanced metrics | FUTURE |

---

## 13. Definition of Done

### 13.1 DoD — Slice A

- Contracts defined (this Plan + any audit closures)  
- AuthN/AuthZ fail-closed  
- Read-only only  
- Endpoints v1 implemented per catalog  
- Responses sanitized + `INTERNAL_OPS`  
- Edge audit present  
- Rate limit present  
- Health / readiness present  
- Validation suites PASS  
- Independent technical audit PASS (or PASS WITH OBSERVATIONS non-blocking)  
- Status document recorded  
- Commits separated from Slice B / Web / cloud  

### 13.2 DoD — Slice B

- **Not part of first cut**  
- Remains **NOT AUTHORIZED** until Gate C  
- DoD (future): async Orchestration API + job runner + idempotency + capability AuthZ + audit + polling + no sync Web path + independent audit + Status  

---

## 14. Implementation sequence (documentary)

| Step | Action | Auth |
|------|--------|------|
| S0 | Discovery | COMPLETE |
| S1 | This Plan | THIS DOCUMENT |
| S2 | Documentary Audit | REQUIRED before commit |
| S3 | Documentary Commit | Gate A |
| S4 | Slice A IMPL | Gate B + mandate |
| S5 | Slice A Independent Audit + Status | REQUIRED |
| S6 | Slice B design freeze / IMPL | Gate C + separate mandate |
| S7+ | Handoff/Lifecycle/Admin wiring/cloud | FUTURE mandates |

---

## 15. Master Plan status clause

| Item | State |
|------|-------|
| **P-INT-01 Discovery** | **COMPLETE** |
| **P-INT-01 Plan** | **DRAFT / PENDING DOCUMENTARY AUDIT** |
| **P-INT-01 Implementation** | **NOT AUTHORIZED** |
| **Slice A** | **PLANNED** |
| **Slice B** | **FUTURE / NOT AUTHORIZED** |
| Handoff / Lifecycle / Canon Gate HTTP | **FUTURE / NOT AUTHORIZED** |
| Admin live wiring / cloud deploy | **FUTURE / NOT AUTHORIZED** |
| P-INT-05 / II.7 | **NOT OPENED** |

---

## 16. Authorization clause

```text
This document does NOT authorize implementation.

Slice A requires:
  GATE A (documentary) COMPLETE
  + GATE B criteria
  + explicit Director mandate: P-INT-01-SLICE-A-IMPL

Slice B requires:
  Slice A COMPLETE
  + GATE C criteria
  + explicit Director mandate: P-INT-01-SLICE-B-IMPL

Until those mandates:
  - no Service Edge code;
  - no HTTP listeners in repo under P-INT-01;
  - no Auth production wiring;
  - no Web / Supabase / Marketplace changes;
  - no CB-00…CB-19 rewrites;
  - no I.1 / II.2 rewrites;
  - no Slice B jobs;
  - no Handoff HTTP.
```

---

## 17. Documentary status

| Ítem | Estado |
|------|--------|
| This Implementation Plan | **CREATED — DRAFT / PENDING DOCUMENTARY AUDIT** |
| Transport v1 | **CLOSED** — HTTP JSON |
| Runtime v1 | **CLOSED** — Node application service |
| Hosting | **CLOSED** — hosting-neutral ports/adapters |
| First cut | **CLOSED** — Slice A read-only only |
| Slice B | **SPECIFIED / NOT AUTHORIZED** |
| Endpoint catalog v1 | **PROPOSED BINDING** pending Documentary Audit |
| Auth roles | **CLOSED** — FACTORY_OPS / FACTORY_DIRECTOR |
| Classification | **CLOSED** — INTERNAL_OPS |
| Implementation | **NOT AUTHORIZED** |

---

## 18. Slice B policy appendix (planned only)

| Topic | Binding preview (NOT AUTHORIZED to implement) |
|-------|-----------------------------------------------|
| API | `POST /v1/factory/orchestration/jobs` + `GET /v1/factory/orchestration/jobs/{jobId}` |
| Body | `{ factoryKey, command: "orchestrateExpediente", hints?, idempotencyKey }` |
| Acceptance | Enqueue only; return `202` + `jobId` |
| Worker | Calls CB-15 `orchestrateExpediente` off-request |
| Cancel | `POST .../cancel` sets flag; worker checkpoints; no silent SUCCESS |
| Retry | At-most-once side effects via idempotency + job registry |
| Timeout | Acceptance 1s; execution budget configurable; on exceed → job FAILED fail-closed |
| AuthZ | Capability `factory.command.orchestrate` |

---

## 19. Final clause

This Plan defines **P-INT-01 Factory Service Edge** as the Admin-only Control Plane entry to Factory, with **Slice A read-only HTTP** as the sole first implementable cut, reusing I.1 and II.2 without rewriting them, and holding **Slice B orchestration** and all later HTTP surfaces as **FUTURE / NOT AUTHORIZED**.

It does **not** authorize implementation until Documentary Audit and an explicit Director IMPL mandate.

---

**END OF DOCUMENT**

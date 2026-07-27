# P-INT-01 — Factory Service Edge — Slice B — Implementation Plan

## RealEstateSniper Factory 2.0

**Status:** DOCUMENTARY COMMITTED  
**Audit:** PASS WITH OBSERVATIONS  
**Documentary Commit:** APPROVED  
**Implementation:** NOT AUTHORIZED  

| Campo | Valor |
|-------|--------|
| **Document ID** | `FACTORY_INTEGRATION_P_INT_01_SLICE_B_IMPLEMENTATION_PLAN.md` |
| **Path** | `docs/factory-construction/integration/FACTORY_INTEGRATION_P_INT_01_SLICE_B_IMPLEMENTATION_PLAN.md` |
| **Block** | `P-INT-01-SLICE-B` |
| **Prerequisite gate** | **Gate C** (design freeze + PASS criteria) |
| **IMPL mandate required** | `P-INT-01-SLICE-B-IMPL` (Director; **not** issued by this document) |
| **Master Plan** | Fase II ítem 4 — Job Runner + Orchestration API (staging) |
| **Parent plan** | `FACTORY_INTEGRATION_P_INT_01_IMPLEMENTATION_PLAN.md` (§3.2, §13.2, §18) |
| **Continuity** | §19 Slice B; protocol Discovery → Plan → Audit → Commit → IMPL |
| **Environment** | **STAGING ONLY** |
| **Nature** | Normative Implementation Plan — **does not authorize code, push, Web, Supabase, Product, Marketplace, or II.7** |
| **Independent Documentary Audit (Final)** | **PASS WITH OBSERVATIONS** — **DOCUMENTARY COMMIT AUTHORIZED** |
| **Residual observations (non-blocking)** | OBS-R1 (lineage field allowlist detail in B3); OBS-R2 (Gate C circular criterion supersession — see §2.1) |

---

## 0. Binding confirmations

| Guarantee | Commitment |
|-----------|------------|
| Slice A intact | No semantic change to Slice A `GET /v1/factory/*` READ_ONLY; envelope `factory.service_edge.read` unchanged |
| Slice A isolation | **MUST NOT modify** `services/factory-service-edge/**` (zero edits, including “non-semantic”) |
| CB-00…CB-19 | **MUST NOT modify** `src/factory/cb**` — **consume only** public CB-15 / CB-01 APIs |
| Marketplace | **MUST NOT touch** |
| Supabase | **MUST NOT touch** |
| II.7 Delivery | **MUST NOT open** |
| Product / access_tier / Decision Engine | **MUST NOT touch** |
| Web / FCC | **MUST NOT touch** (separate Continuity §20 mandate required) |
| Persistence | Staging ELR via existing CB-01 / AtomicFile offline only — **no** cloud ELR |
| Push / merge / deploy | **NOT authorized** by this Plan |

---

## 1. Objective

In **staging**, with fixtures:

1. Enqueue expediente orchestration as an **async job**.
2. Execute via **Job Runner** (Node worker) calling `OrchestrationBusService.orchestrateExpediente` (CB-15).
3. Expose **Orchestration Control Plane** HTTP JSON (Admin/Ops) for submit / status / lineage / cancel.
4. Preserve fail-closed, audit, correlation, `INTERNAL_OPS`, and `factoryBoundaryGuard`.

This is **not** Delivery, Marketplace, Product, or production Auth.

---

## 2. Gate C — design freeze (prerequisite to IMPL)

Gate C **PASS** requires, **before** `P-INT-01-SLICE-B-IMPL`:

| ID | Criterion |
|----|-----------|
| C-01 | Continuity Dossier re-audit **PASS** / **PASS WITH OBSERVATIONS** |
| C-02 | Slice A Status **FULLY CLOSED**; Slice A regression suite green at baseline |
| C-03 | Slice B contract **frozen** (this document §§5–8) — no Product/Marketplace endpoints |
| C-04 | In/Out matrix signed (§3) |
| C-05 | Staging Auth explicit (Bearer DEV; roles `FACTORY_OPS` \| `FACTORY_DIRECTOR`) — **not** production Auth |
| C-06 | Job model immutable after freeze (states, IDs, idempotency) |
| C-07 | Blocked operations via `factoryBoundaryGuard` reaffirmed |
| C-08 | This Plan Documentary Audit **PASS** or **PASS WITH OBSERVATIONS** (non-blocking) — **DONE** |
| C-09 | Director mandate `P-INT-01-SLICE-B-IMPL` issued |

**Gate C ≠ implementation.** Gate C only authorizes proceeding to IMPL when C-01…C-09 + mandate are satisfied.

### 2.1 Supersession — parent §3.2 circular criterion (OBS-R2)

Parent Plan §3.2 listed “Job runner **implemented** and validated” as a precondition to Slice B. That criterion is **circular** (the runner **is** Slice B).

**Binding supersession for Gate C:**

- Gate C = **design freeze** of this Plan (C-01…C-08) + mandate (C-09).
- Job Runner implementation and validation = **sub-slice B2** under IMPL — **not** a Gate C prerequisite.

---

## 3. Scope In / Out

### 3.1 In

- Job store **in-memory or file-local staging** (not Supabase).
- Worker CLI/process: poll/dequeue → boundary assert → CB-15 `orchestrateExpediente`.
- HTTP **command** surface **separate** from Slice A read envelope.
- Validation: Slice B suite + Slice A / I.1 / II.2 / CB-15 / P-INT-10 dry-run regressions.
- Status document after IMPL (separate mandate/commit).

### 3.2 Out

- Mutating CB-00…CB-19  
- Marketplace  
- Supabase  
- II.7  
- Product / Decision Engine  
- FCC / Web  
- Cloud ELR  
- Remote GitHub Actions (unless Continuity §28 mandate)  
- `--mark-complete` on CB ledger  
- Any modification of `services/factory-service-edge/**`

---

## 4. Architecture (staging)

```text
[Ops/Admin client — FCC OUT OF SCOPE]
        │  HTTPS JSON (staging)
        ▼
┌───────────────────────────────────────────┐
│ Orchestration Control Plane (Slice B)     │
│  services/factory-orchestration-edge/     │
│  POST/GET/cancel jobs · AuthZ · audit · RL│
└───────────────────┬───────────────────────┘
                    │ enqueue / cancel flag
                    ▼
┌───────────────────────────────────────────┐
│ Job Store (staging: memory | file)        │
└───────────────────┬───────────────────────┘
                    │ claim
                    ▼
┌───────────────────────────────────────────┐
│ Job Runner Worker (Node, async)           │
│  → factoryBoundaryGuard                   │
│  → OrchestrationBusService (CB-15)        │
│  → CB-01 / AtomicFile ELR (via CB only)   │
└───────────────────────────────────────────┘

Slice A READ ports (factory-service-edge) ──► MUST NOT modify; parallel; no command path
```

**Principles:**

- **Read path (Slice A)** and **Command path (Slice B)** are separate products/adapters under Admin Control Plane.
- Orchestration **never** runs in a long synchronous Web request.
- Worker is the **only** executor of `orchestrateExpediente`.

---

## 5. Official contracts (single definition of truth)

### 5.1 Parent §18 adoption + Gate C extensions

**Base binding** = parent Plan §18 paths and submit capability.  
**Draft chat paths** (`POST /v1/factory/jobs/orchestrate`, capability `factory.command.orchestrate.submit`) are **WITHDRAWN** and **MUST NOT** be implemented.

### 5.2 Command envelope

| Field | Binding |
|-------|---------|
| Conceptual contract id | `factory.service_edge.command` (v1) |
| Classification | `INTERNAL_OPS` |
| Minimum fields | `schemaVersion`, `mode` (`STAGING`), `correlationId`, `actor`, `capability`, `result` \| `error` |
| Separation | **MUST NOT** reuse `factory.service_edge.read` semantics for mutations |

### 5.3 Official HTTP routes

| Method | Path | Purpose |
|--------|------|---------|
| `POST` | `/v1/factory/orchestration/jobs` | Submit orchestrate job (enqueue only) |
| `GET` | `/v1/factory/orchestration/jobs/{jobId}` | Job status |
| `GET` | `/v1/factory/orchestration/jobs/{jobId}/lineage` | Lineage **summary** (allowlist only) |
| `POST` | `/v1/factory/orchestration/jobs/{jobId}/cancel` | Cancel job |

Slice A health/readiness routes: **unchanged**.

### 5.4 Official capabilities

| Capability | HTTP | Roles |
|------------|------|-------|
| `factory.command.orchestrate` | `POST …/jobs`, `POST …/jobs/{jobId}/cancel` | `FACTORY_OPS`, `FACTORY_DIRECTOR` |
| `factory.command.job.read` | `GET …/jobs/{jobId}` | `FACTORY_OPS`, `FACTORY_DIRECTOR` |
| `factory.command.job.lineage` | `GET …/jobs/{jobId}/lineage` | `FACTORY_OPS`, `FACTORY_DIRECTOR` |

### 5.5 Submit body

```json
{
  "factoryKey": "<string>",
  "command": "orchestrateExpediente",
  "hints": {},
  "idempotencyKey": "<optional mirror of header>"
}
```

| Rule | Binding |
|------|---------|
| `command` | **MUST** be exactly `orchestrateExpediente`; any other value → `400 VALIDATION_FAIL` |
| `hints` | Optional; allowlisted; fail-closed on unknown keys |
| Acceptance | Enqueue only; response **`202`** + `jobId` |

### 5.6 Idempotency — REQUIRED (OBS-02 closed)

| Rule | Binding |
|------|---------|
| Mechanism | HTTP header **`Idempotency-Key` REQUIRED** on every `POST /v1/factory/orchestration/jobs` |
| Value | Non-empty string; max 128 chars; charset allowlist `[A-Za-z0-9._:-]` |
| Body mirror | If body includes `idempotencyKey`, it **MUST** equal the header; mismatch → `400 VALIDATION_FAIL` |
| Semantics | Same key + same actor + same `factoryKey` + same `command` → **same `jobId`** (at-most-once enqueue); **no** second execution |
| Missing header | **Fail-closed** `400` — **no enqueue** |

### 5.7 Job model

| Field | Semantics |
|-------|-----------|
| `jobId` | Opaque UUID |
| `type` | `ORCHESTRATE_EXPEDIENTE` |
| `factoryKey` | CB-01 key |
| `state` | `QUEUED` → `RUNNING` → `SUCCEEDED` \| `FAILED` \| `REJECTED` \| `CANCELLED` |
| `cancelRequested` | Boolean flag (set by cancel while `RUNNING`) |
| `createdAt` / `updatedAt` | RFC3339 |
| `idempotencyKey` | Stored from required header |
| `error` | Sanitized; no paths/secrets |
| `resultSummary` | Allowlist only; **no** full ELR; **no** Decision Package |

### 5.8 Cancel policy — complete (OBS-03 closed; not DEFERRED)

| Topic | Binding |
|-------|---------|
| Endpoint | `POST /v1/factory/orchestration/jobs/{jobId}/cancel` |
| Capability | `factory.command.orchestrate` |
| `QUEUED` | → `CANCELLED` immediately; worker **MUST NOT** claim |
| `RUNNING` | Set `cancelRequested=true`; worker checkpoints; transition to `CANCELLED`; **MUST NOT** silently `SUCCEEDED` |
| `SUCCEEDED` \| `FAILED` \| `REJECTED` | → `409 CONFLICT` |
| Already `CANCELLED` | → `200` + current state (idempotent) |
| Side effects | No additional Factory side effects after cancel acceptance beyond job-record update + audit |
| Timeout | Execution budget configurable; on exceed → `FAILED` fail-closed (distinct from cancel) |

### 5.9 Lineage (extension; OBS-R1)

- Response **MUST** be summary allowlist only.
- **MUST NOT** return raw ELR or Decision Package.
- Exact field enumeration may be finalized in IMPL sub-slice **B3** within these constraints.

### 5.10 Boundary

Before execution: `assertFactoryBoundary` / blocked operations (e.g. `marketplace_listing`, `assign_access_tier`, …) → job `REJECTED` fail-closed.

---

## 6. Execution flow

1. Authenticated client `POST /v1/factory/orchestration/jobs` with required `Idempotency-Key`.
2. Control Plane: AuthZ, rate limit, schema, idempotency → create/reuse job `QUEUED` → `202` + `jobId`.
3. Worker claims → `RUNNING`.
4. Worker invokes CB-15 orchestration (fixtures / staging ELR).
5. Success → `SUCCEEDED` + summary; failure → `FAILED` + sanitized error; boundary violation → `REJECTED`.
6. Cancel path per §5.8.
7. `GET job` / `GET lineage` read job store + permitted summaries only.

Fail-closed: invalid input, AuthZ deny, boundary violation, unclassifiable exception → no Factory side effects beyond job record.

---

## 7. Directory structure (proposed)

```text
services/factory-orchestration-edge/     # NEW — sibling of factory-service-edge
  contract.js
  jobModel.js
  jobStore.js
  orchestrationCommandPort.js
  workerRunner.js
  httpAdapter.js
  adapters.js
  index.js
  README.md                              # staging-only + prohibitions

src/runPInt01SliceBValidation.js        # NEW — PASS suite
src/runFactoryOrchestrationWorker.js     # NEW — worker CLI entrypoint

docs/factory-construction/integration/
  FACTORY_INTEGRATION_P_INT_01_SLICE_B_IMPLEMENTATION_PLAN.md   # THIS DOCUMENT
  FACTORY_INTEGRATION_P_INT_01_SLICE_B_IMPL_STATUS.md           # post-IMPL only
```

**MUST NOT** place worker logic under `src/factory/**`.  
**MUST NOT** modify `services/factory-service-edge/**`.

---

## 8. Files — new vs existing

### 8.1 New (authorized only under `P-INT-01-SLICE-B-IMPL`)

- All of `services/factory-orchestration-edge/**`
- `src/runPInt01SliceBValidation.js`
- `src/runFactoryOrchestrationWorker.js`
- Post-IMPL Status doc (separate commit)

### 8.2 Existing — modification scope

| Path | Modify? | Scope |
|------|---------|-------|
| `services/factory-service-edge/**` | **MUST NOT** | Absolute isolation (OBS-04) |
| `src/factory/cb00`…`cb19/**` | **MUST NOT** | Import public exports only |
| `src/components/admin/**` | **MUST NOT** | FCC out of scope |
| `vite.config.js` | **MUST NOT** | No new proxy in this Plan |
| Marketplace / `supabase/**` / Product | **MUST NOT** | — |
| `construction-phase-status.json` | **MUST NOT** | No `--mark-complete` |
| `public/factory-observability-snapshot.json` | **MUST NOT** | — |

---

## 9. Dependencies

| Depends on | Use |
|------------|-----|
| CB-15 `OrchestrationBusService`, `factoryBoundaryGuard` | Execution |
| CB-01 / P-INT-03 AtomicFile (staging) | ELR |
| Slice A discipline (Bearer DEV, correlation, sanitize, rate limit) | **Copy patterns**; do **not** merge read/command services |
| P-INT-10 | Optional dry-run regression in suite |

**Does not depend on:** Marketplace, Supabase cloud, II.7, Product, Decision Engine.

---

## 10. Guardrails

- Deny-by-default AuthZ  
- Fail-closed validation / boundary / errors  
- Response allowlists  
- Jobs **MUST NOT** expose full Decision Package or raw ELR  
- Worker timeout → `FAILED` (not corrupt Factory state)  
- Cancel → never silent `SUCCEEDED`  
- **Forbidden:** invoke orchestration from Slice A GET handlers  
- **Forbidden:** `access_tier`, pricing, listing, Product, Marketplace  
- **Forbidden:** modify `factory-service-edge`  
- Protocol: Discovery → Plan → Audit → Commit → IMPL → Technical Audit → Status  

---

## 11. Validations and PASS criteria

### 11.1 Suite `runPInt01SliceBValidation.js` (minimum)

1. Submit → `QUEUED` / `202` with required `Idempotency-Key`.  
2. Worker → `SUCCEEDED` with valid fixture.  
3. Boundary violation → `REJECTED`, no orchestration side effects.  
4. Unauthenticated → deny.  
5. Idempotency: no double execution for same key.  
6. Missing `Idempotency-Key` → `400`, no enqueue.  
7. Job status read coherent.  
8. Cancel: `QUEUED`→`CANCELLED`; `RUNNING` checkpoint→`CANCELLED`; terminal→`409` (or `200` if already `CANCELLED`).  
9. Error sanitized (no secrets/paths).  
10. **Slice A regression** suite green (official current count).  
11. CB-15 dry-run (no mark-complete).  
12. II.2 regression (optional I.1 observability read).  
13. Static/grep: no Marketplace / Supabase write imports; no edits under `factory-service-edge`.  
14. `mode=STAGING` / staging flag confirmed.

### 11.2 IMPL block PASS

- Slice B suite **ALL PASS**  
- Slice A **no regressions**  
- Independent technical audit **PASS** or **PASS WITH OBSERVATIONS** (non-blocking)  
- Status Commit only after mandate  
- **No push** unless Director orders  

### 11.3 Master Plan success criterion (Fase II ítem 4)

A pilot expediente is **orchestrable from Ops** in staging (async job + Orchestration Control Plane) **without** Marketplace, II.7, Supabase cloud, with Slice A intact and CB-00…19 unmodified.

---

## 12. Implementation sub-slices (after mandate only)

| Sub-slice | Delivery | Independence |
|-----------|----------|--------------|
| **B0 — Gate C freeze** | This Plan audited + committed + mandate | Documentary (this commit closes Plan doc only; Gate C + mandate still required) |
| **B1 — Job model + store** | States, memory/file store, unit checks | Yes |
| **B2 — Worker** | CLI worker + CB-15 invoke + boundary | Yes |
| **B3 — HTTP command plane** | POST/GET/cancel/lineage | After B1–B2 |
| **B4 — Validation suite + Status** | Runner PASS + Status doc | After B3 |

Each sub-slice: atomic commit; no automatic push.

---

## 13. Residual risks (accepted for staging)

| Risk | Mitigation |
|------|------------|
| TD-AUTH-PROD | Staging Bearer explicit; do not claim prod-ready |
| Slice A contamination | Sibling service + **MUST NOT modify** + regression |
| FCC scope creep | Absolute out of scope |
| Job store mistaken for cloud | Staging-only; local path only |
| Lineage over-exposure | Allowlist; finalize fields in B3 (OBS-R1) |

---

## 14. Authorization clause

```text
This document does NOT authorize implementation.

Slice B IMPL requires:
  GATE C criteria (C-01…C-09) satisfied
  + explicit Director mandate: P-INT-01-SLICE-B-IMPL

Until that mandate:
  - no factory-orchestration-edge code;
  - no Slice B HTTP listeners;
  - no worker under this Plan;
  - no Auth production wiring;
  - no Web / Supabase / Marketplace / Product / II.7 changes;
  - no CB-00…CB-19 rewrites;
  - no modification of services/factory-service-edge/**.
```

---

## 15. Documentary status

| Item | State |
|------|-------|
| This Implementation Plan | **DOCUMENTARY COMMITTED** |
| Independent Documentary Audit (Final) | **PASS WITH OBSERVATIONS** |
| Documentary Commit | **APPROVED** |
| Gate C | **PENDING** (criteria C-01…C-09; this Plan freeze is necessary but not sufficient alone) |
| Director mandate `P-INT-01-SLICE-B-IMPL` | **NOT ISSUED** |
| Implementation | **NOT AUTHORIZED** |
| Implementation Commit | **NOT AUTHORIZED** |

---

## NEXT REQUIRED STEPS

- Gate C  
- Director Mandate: `P-INT-01-SLICE-B-IMPL`  
- Implementation  
- Independent Technical Audit  
- Implementation Commit  

---

**END OF DOCUMENT**

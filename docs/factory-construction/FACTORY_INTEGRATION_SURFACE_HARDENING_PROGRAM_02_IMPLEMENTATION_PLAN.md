# OFFICIAL IMPLEMENTATION PLAN  
## PROGRAM 02 — Integration Surface Hardening  
### HQ-04 · HQ-05 · HQ-06

## RealEstateSniper Factory 2.0

---

## 1. Document Identity

| Campo | Valor |
|-------|--------|
| **Document ID** | `FACTORY_INTEGRATION_SURFACE_HARDENING_PROGRAM_02_IMPLEMENTATION_PLAN.md` |
| **Path** | `docs/factory-construction/FACTORY_INTEGRATION_SURFACE_HARDENING_PROGRAM_02_IMPLEMENTATION_PLAN.md` |
| **Title** | PROGRAM 02 — Integration Surface Hardening — Official Implementation Plan |
| **Program** | **PROGRAM 02 — INTEGRATION SURFACE HARDENING** |
| **Elements in scope** | **HQ-04 · HQ-05 · HQ-06** exclusively |
| **Status** | **IMPLEMENTATION PLAN COMPLETE — DOCUMENTARY RE-AUDIT: PASS — PENDING DOCUMENTARY COMMIT** |
| **Nature** | Normative Implementation Plan — **documentary only** · **does not authorize** code, Mandate IMPL execution, push, Web, Product, Marketplace, CRM, Owner Portal, PWA, Supabase, commercial Auth, Factory Core modification, Slice B reopen as a new construction block, or external infrastructure |
| **Branch (verified at drafting)** | `integration/factory-complete-20260725` |
| **HEAD base (verified at drafting)** | `6b61910f0a5fc77cda375a5fe9615f9ca3d7e870` |
| **Environment target (future IMPL)** | **STAGING ONLY** — package `services/factory-orchestration-edge/**` |
| **Implementation** | **NOT AUTHORIZED** by this document |
| **Push** | **NOT AUTHORIZED** by this document |
| **Placement rationale** | Same directory as PROGRAM 02 Official Discovery / Forensic Addendum / Documentary Commit Status (not under `integration/`, which holds P-INT Slice plans). Filename follows PROGRAM 02 corpus prefix `FACTORY_INTEGRATION_SURFACE_HARDENING_PROGRAM_02_*`. |

### Authoritative documentary antecedents (published)

| Artifact | Role for this Plan |
|----------|--------------------|
| `FACTORY_INTEGRATION_SURFACE_HARDENING_PROGRAM_02_FORENSIC_RESOLUTION_ADDENDUM.md` | **Authoritative HQ genealogy** — HQ-04←OBS-SB-RACE, HQ-05←OBS-SB-ACL, HQ-06←OBS-SB-BODY |
| `FACTORY_INTEGRATION_SURFACE_HARDENING_PROGRAM_02_OFFICIAL_DISCOVERY.md` | Discovery package; historically blocked pending catalog; **content definitions remain governed by Forensic Addendum** |
| `FACTORY_INTEGRATION_SURFACE_HARDENING_PROGRAM_02_DOCUMENTARY_COMMIT_STATUS.md` | Discovery documentary commit package status |
| `integration/FACTORY_INTEGRATION_P_INT_01_SLICE_B_IMPL_STATUS.md` | Source residuals OBS-SB-RACE / OBS-SB-ACL / OBS-SB-BODY; Slice B **FULLY CLOSED** / **IMPLEMENTATION ACCEPTED** |
| `FACTORY_CORE_HARDENING_PROGRAM_01_IMPL_STATUS.md` | Sister program COMPLETE; HQ-04+ historically OUT OF SCOPE of PROGRAM 01 |
| `FACTORY_2_0_COMPLETE_CONTINUITY_DOSSIER.md` | Protocol §27; stop rules §20–§21; PROGRAM 02 historically **NOT OPENED / NOT AUTHORIZED** until separate Mandate |

**Binding note:** This Plan **materializes an implementation path**. It does **not** by itself open Continuity **NEXT BLOCK**, issue Mandate IMPL, or authorize engineering work.

---

## 2. Purpose

This Plan:

1. Converts the published HQ-04 / HQ-05 / HQ-06 genealogy into a **verifiable, conservative, bounded** implementation sequence.  
2. Limits work to closing the three Slice B **non-blocking residuals** OBS-SB-RACE / OBS-SB-ACL / OBS-SB-BODY.  
3. Does **not** authorize code changes.  
4. Does **not** reopen Slice B architecture, Job Runner redesign, or Factory Core.  
5. Does **not** expand HTTP contracts, add capabilities, or invent AuthN/AuthZ systems.  
6. Does **not** modify Web, Product, Marketplace, CRM, Owner Portal, PWA, Supabase, commercial Auth, or external infrastructure.  
7. Proposes strategies and candidate files; solutions remain **proposals** until Mandate IMPL + technical audit accept them.

---

## 3. Authoritative Scope

```text
P-INT-01 Slice B
        │
        ├── OBS-SB-RACE ──► HQ-04  Timeout / Cancel Race Hardening
        ├── OBS-SB-ACL  ──► HQ-05  Actor-Scoped ACL Hardening
        └── OBS-SB-BODY ──► HQ-06  Strict Body and Content-Type Validation
                              │
                              ▼
                     PROGRAM 02
          INTEGRATION SURFACE HARDENING
```

| HQ-ID | Name (this Plan) | Derives from (literal Slice B Status) |
|-------|------------------|----------------------------------------|
| **HQ-04** | Timeout / Cancel Race Hardening | Timeout/cancel race residual (mitigated, not eliminated) |
| **HQ-05** | Actor-Scoped ACL Hardening | ACL cross-actor staging (any authorized principal may GET/cancel by jobId) |
| **HQ-06** | Strict Body and Content-Type Validation | Body size / Content-Type not strictly enforced |

**In PROGRAM 02:** HQ-04 · HQ-05 · HQ-06 only.  
**Out of PROGRAM 02:** HQ-01 · HQ-02 · HQ-03 (PROGRAM 01); HQ-07 · HQ-08; OBS-SB-FS / OBS-SB-AUTH / OBS-SB-STUB / OBS-SB-BANNER (Slice B residuals **not** mapped to HQ-04…06); TD-AUTH-PROD / TD-DUAL-SNAPSHOT / TD-DSO-LIVE / TD-ELR-CLOUD; Slice A; Factory Core CB-00…CB-19.

---

## 4. Current-State Technical Inventory

### 4.1 Package and routes (CONFIRMED)

| Item | Path / value | Confidence |
|------|--------------|------------|
| Staging orchestration package | `services/factory-orchestration-edge/**` | **CONFIRMED** |
| HTTP adapter | `services/factory-orchestration-edge/httpAdapter.js` | **CONFIRMED** |
| Command core (routing + AuthZ gate + handlers) | `services/factory-orchestration-edge/commandCore.js` | **CONFIRMED** |
| Staging AuthN/AuthZ | `services/factory-orchestration-edge/stagingAuth.js` | **CONFIRMED** |
| Contracts / error codes / route specs | `services/factory-orchestration-edge/contract.js` | **CONFIRMED** |
| Submit body schema validation | `services/factory-orchestration-edge/validation.js` | **CONFIRMED** |
| Job model / transitions | `services/factory-orchestration-edge/jobModel.js` | **CONFIRMED** |
| Job store (InMemory / File) | `services/factory-orchestration-edge/jobStore.js` | **CONFIRMED** |
| Job Runner Core | `services/factory-orchestration-edge/workerRunner.js` | **CONFIRMED** |
| Cancel transition helper | `services/factory-orchestration-edge/cancel.js` | **CONFIRMED** |
| Stub executor | `services/factory-orchestration-edge/stubExecutor.js` | **CONFIRMED** |
| Idempotency (includes `actorId` in identity) | `services/factory-orchestration-edge/idempotency.js` | **CONFIRMED** |
| CB-15 boundary adapter (consume-only) | `services/factory-orchestration-edge/boundaryAdapter.js` | **CONFIRMED** |
| Package entry | `services/factory-orchestration-edge/index.js` | **CONFIRMED** |

**HTTP surface (CONFIRMED — Slice B Status §3):**

| Method | Path | Capability |
|--------|------|------------|
| `POST` | `/v1/factory/orchestration/jobs` | `factory.command.orchestrate` |
| `GET` | `/v1/factory/orchestration/jobs/{jobId}` | `factory.command.job.read` |
| `POST` | `/v1/factory/orchestration/jobs/{jobId}/cancel` | `factory.command.orchestrate` |
| `GET` | `/v1/factory/orchestration/jobs/{jobId}/lineage` | `factory.command.job.lineage` |

### 4.2 Auth / actor model (CONFIRMED)

| Fact | Evidence |
|------|----------|
| AuthN | Bearer DEV staging sessions (`StagingBearerAuthnAdapter`) |
| Roles | `FACTORY_OPS` \| `FACTORY_DIRECTOR` |
| AuthZ | Deny-by-default: matching **role AND capability** (`StagingAuthzAdapter`) |
| Job owner field | `actorId` stored at enqueue from `principal.principalId` (`commandCore._submit` → `runner.enqueue`) |
| Public job view | `publicJobView` **omits** `actorId` |
| GET / cancel / lineage ownership check | **Absent** — jobId + authorized principal is sufficient today |

Default staging principals (CONFIRMED): `staging-ops`, `staging-director`, `staging-ops-nocap` via `createDefaultStagingSessions()`.

**No production Auth. No commercial Auth. No new credential store.**

### 4.3 Timeout / cancel / terminal behavior (CONFIRMED)

| Mechanism | Location | Behavior |
|-----------|----------|----------|
| Default timeout | `JobRunnerCore.executionTimeoutMs` default `5000` | `Promise.race` vs executor |
| Timeout flag | `abort.timedOut` in `_executeClaimed` | Checkpoints / sleep throw `TIMEOUT` when set |
| Cancel QUEUED | `jobStore.requestCancel` | Immediate `CANCELLED` |
| Cancel RUNNING | `jobStore.requestCancel` | Sets `cancelRequested`; state stays `RUNNING` until checkpoint |
| Cancel already CANCELLED | `requestCancel` | Idempotent OK |
| Cancel other terminals | `requestCancel` | 409 CONFLICT |
| Success guard | `markSucceeded` | Refuses if `cancelRequested` |
| Fail guard | `markFailed` | Refuses if already terminal |
| Catch path | `workerRunner` catch | Prefer existing `CANCELLED` / terminal; else `markFailed` |

**Technical note (current timeout control flow — NB-04):** In the present implementation, the timeout arm inside `Promise.race` normally **rejects** the raced promise (throws `TIMEOUT`). Control therefore transfers to the **`catch`** path. Any check that appears after a successful `await` of the race is **secondary / defensive / marginal**. HQ-04 hardening **MUST** cover the real `catch` path and **MUST NOT** depend exclusively on a post-`await` branch.

**Residual (OBS-SB-RACE):** timeout path can still produce `FAILED`/`TIMEOUT` when cancel has been requested but not yet checkpointed to `CANCELLED`; cooperative cancel depends on executor checkpoints; no exclusive cancel-vs-timeout arbitration beyond current mitigations.

### 4.4 Body / Content-Type (CONFIRMED)

| Mechanism | Location | Behavior |
|-----------|----------|----------|
| Body collect | `httpAdapter.collectBody` | Concatenates all chunks — **no max bytes** |
| JSON parse | `commandCore._submit` | Non-empty text → `JSON.parse`; empty → `{}`; invalid JSON → 400 `VALIDATION_FAIL` |
| Request Content-Type | — | **Not checked** |
| Semantic schema | `validateOrchestrateSubmitBody` | Object body; non-empty `factoryKey`; command exactly `orchestrateExpediente`; hints allowlist; idempotency mirror |
| Response Content-Type | `jsonResponse` | Always `application/json; charset=utf-8` |

**No contracted numeric body-size limit found** in Slice B Status / Plan / `contract.js`. Any numeric limit remains a **proposal pending Mandate confirmation**.

### 4.5 Validation runners and tests (CONFIRMED)

| Runner | Path | Role |
|--------|------|------|
| B1 | `src/runPInt01SliceB1Validation.js` | Contracts, cancel matrix, submit schema |
| B2 | `src/runPInt01SliceB2Validation.js` | Store/runner: cancel, timeout, terminal, idempotency |
| B3 | `src/runPInt01SliceB3Validation.js` | HTTP: auth, GET, cancel, lineage, invalid command |
| B4 | `src/runPInt01SliceB4Validation.js` | E2E + spawns B1–B3 regressions |
| Smoke | `src/runPInt01SliceBSmoke.js` | Submit+process+GET; cancel queued |

**Exact existing commands (no `package.json` scripts for Slice B):**

```text
node src/runPInt01SliceB1Validation.js
node src/runPInt01SliceB2Validation.js
node src/runPInt01SliceB3Validation.js
node src/runPInt01SliceB4Validation.js
node src/runPInt01SliceBSmoke.js
```

| Concern | Covered today? | Gap vs PROGRAM 02 |
|---------|----------------|-------------------|
| Timeout → FAILED | YES (B2/B4) | Race vs concurrent cancel **not** dedicated |
| Cancel QUEUED / RUNNING | YES | — |
| Terminal cancel conflict (pure) | YES (B1) | HTTP terminal cancel coverage thin |
| Cross-actor GET/cancel deny | **NO** | **HQ-05 required** |
| Content-Type enforcement | **NO** | **HQ-06 required** |
| Payload size limit | **NO** | **HQ-06 required** |
| Invalid JSON | Code path exists | Dedicated runner assertion **thin / CANDIDATE strengthen** |

### 4.6 Explicitly untouched surfaces (CONFIRMED)

| Surface | Path / rule |
|---------|-------------|
| Slice A | `services/factory-service-edge/**` — **MUST NOT modify** |
| Factory Core | `src/factory/**` — **MUST NOT modify** |
| Web / FCC / Admin UI | Continuity §20 — **MUST NOT touch** |
| Supabase | Continuity §21 — **MUST NOT touch** |
| Product / Marketplace / CRM / Owner Portal / PWA | **MUST NOT touch** |

---

## 5. HQ-04 Implementation Plan — Timeout / Cancel Race Hardening

### 5.1 Situation and residual

Slice B already mitigates races via `cancelRequested`, checkpoint→CANCELLED, success refusal under cancel, and catch preference for existing terminals. Residual **OBS-SB-RACE**: concurrent timeout and cancel can still yield an outcome that is not the intended exclusive terminal arbitration (e.g. `FAILED`/`TIMEOUT` after cancel requested but before CANCELLED materializes).

### 5.2 States and interleavings in scope

**States:** `QUEUED`, `RUNNING`, `SUCCEEDED`, `FAILED`, `REJECTED`, `CANCELLED`.

**Interleavings to harden (minimum):**

| # | Interleaving | Expected after HQ-04 |
|---|--------------|----------------------|
| I1 | Cancel on RUNNING then timeout fires before checkpoint | Persist **one** terminal; prefer **CANCELLED** if cancel was accepted; never SUCCEEDED |
| I2 | Timeout fires then cancel arrives | If already terminal FAILED(TIMEOUT), cancel returns CONFLICT (existing); no second incompatible terminal |
| I3 | Cancel QUEUED then any timeout attempt | Remains CANCELLED; timeout path must not revive |
| I4 | Double cancel | Idempotent CANCELLED |
| I5 | Double timeout / late executor success after timeout | No SUCCEEDED after terminal; no dual terminal rewrite |

### 5.3 Expected behavior and invariants

1. A job **MUST NOT** produce two incompatible terminal results.  
2. Cancel and timeout handling **MUST** be idempotent with respect to an already-established terminal.  
3. A later terminal transition **MUST NOT** overwrite an earlier terminal.  
4. Exposed GET status **MUST** match the persisted terminal.  
5. Job Runner architecture **MUST NOT** be redesigned (no queue vendor, no new process model, no CB-15 live orchestrate).

### 5.4 Proposed minimal strategy (proposal — not decided IMPL)

**Proposed approach (conservative — CANDIDATE strategy, not a closed IMPL decision):** strengthen terminal arbitration inside existing `JobRunnerCore` + `jobStore` without redesign:

1. **Timeout + `cancelRequested` + still `RUNNING` (NB-01):** If timeout occurs while the job remains `RUNNING` and `cancelRequested` is true, the implementation **SHALL** perform an **idempotent terminal transition to `CANCELLED`** before constructing or returning any public job view. It **MUST NOT** speak of, assume, or return a terminal state that does not yet exist.  
2. **Already-terminal (NB-01):** If a terminal state is **already persisted**, preserve and return it **without overwrite**.  
3. Cover the **real timeout entry** via the `catch` path after `Promise.race` rejection (see §4.3 NB-04); do not rely exclusively on a post-`await` branch.  
4. Ensure `markFailed` / `markSucceeded` remain fail-closed on terminal overwrite (already largely true).  
5. Optionally record a single stable error/result code path when cancel wins over timeout (**without** inventing new public contract fields unless already present).  
6. Add deterministic interleaving tests in B2 (and regression via B4) using controllable executor hooks / short `executionTimeoutMs`.

**Mechanism note:** This Plan does **not** freeze the concrete helper, function, or call site (e.g. checkpoint vs dedicated cancel-finalize). Choice remains **CANDIDATE** until Mandate IMPL / technical design under audit.

**Not proposed:** rewriting to a new Job Runner, introducing distributed locks, or changing Slice A.

### 5.5 Candidate files

| File | Change class | Confidence |
|------|--------------|------------|
| `services/factory-orchestration-edge/workerRunner.js` | Arbitration in timeout / catch / pre-success paths | **CANDIDATE** |
| `services/factory-orchestration-edge/jobStore.js` | Harden terminal overwrite guards if gaps found under tests | **CANDIDATE** |
| `services/factory-orchestration-edge/cancel.js` | Only if pure-contract tests need alignment | **CANDIDATE** |
| `services/factory-orchestration-edge/jobModel.js` | **NOT REQUIRED** unless transition matrix bug proven | **NOT REQUIRED** (default) |
| `src/runPInt01SliceB2Validation.js` | Add race/interleaving cases | **CANDIDATE** |
| `src/runPInt01SliceB4Validation.js` | Ensure regressions still spawn B2 | **CANDIDATE** (minimal) |

### 5.6 Tests

| Class | Cases |
|-------|-------|
| Positive | Existing cancel QUEUED/RUNNING; timeout→FAILED when no cancel |
| Negative | Cancel after SUCCEEDED → CONFLICT; markSucceeded under cancelRequested fails |
| Idempotence | Double cancel; timeout after already CANCELLED returns CANCELLED |
| Concurrency / deterministic interleaving | Controllable executor delaying checkpoints; cancel then force timeout; assert single terminal CANCELLED |

### 5.7 Acceptance criteria

| ID | Criterion |
|----|-----------|
| A04-1 | Under documented I1–I5 harnesses, exactly one terminal state persists |
| A04-2 | No SUCCEEDED after accepted cancel |
| A04-3 | GET reflects store terminal |
| A04-4 | B1–B4 + Smoke still pass |
| A04-5 | No redesign of Job Runner; no `src/factory/**` edits |

### 5.8 Rollback / reversibility

Revert the HQ-04 implementation commit(s). Store/runner remain prior Slice B behavior. No schema migration. No external persistence.

---

## 6. HQ-05 Implementation Plan — Actor-Scoped ACL Hardening

### 6.1 Current model

| Fact | Detail |
|------|--------|
| Owner at create | `actorId = principal.principalId` |
| GET / cancel / lineage | Capability-authorized principal may access **any** jobId |
| Residual | OBS-SB-ACL — cross-actor staging access by jobId knowledge |

### 6.2 Affected routes

| Route | Handler | Ownership check today |
|-------|---------|------------------------|
| `GET .../jobs/{jobId}` | `_getJob` | **None** |
| `POST .../jobs/{jobId}/cancel` | `_cancel` | **None** |
| `GET .../jobs/{jobId}/lineage` | `_getLineage` | **None** — see lineage extension note below |

### 6.3 Proposed fail-closed strategy (proposal)

1. After AuthN/AuthZ capability pass, load job (or cancel path equivalent).  
2. If job missing → retain existing **404 NOT_FOUND** behavior.  
3. If job exists and `principal.principalId !== job.actorId` → **deny** with existing contract code **`FORBIDDEN` / HTTP 403** (already in `contract.js`).  
4. Missing / unverifiable principal already denied by AuthN (401) — preserve.  
5. **Do not** invent production Auth, JWT, Supabase RLS, or new capability names.  
6. **Administrative bypass:** `FACTORY_DIRECTOR` today has the **same** capability set as OPS and **no** documented cross-actor job privilege. **Default proposal:** apply owner match to **both** roles. Any Director-only bypass requires **explicit Director decision** before IMPL (Stop Condition).

**Lineage extension (NB-02 — not part of the OBS literal):** Historical residual **OBS-SB-ACL** literally named **GET** and **cancel** by `jobId`. Protecting **lineage** is a **deliberate fail-closed extension** because lineage also exposes job information by `jobId`. This extension **MUST** be **ratified or excluded** by the Director in the Mandate. Until otherwise authorized, this Plan **recommends** applying the same ownership rule to **all** jobId-based reads (GET status + lineage) and cancel. Lineage **MUST NOT** be presented as literal content of the original OBS text.

### 6.4 Candidate files

| File | Change class | Confidence |
|------|--------------|------------|
| `services/factory-orchestration-edge/commandCore.js` | Owner check on GET / cancel / lineage | **CANDIDATE** |
| `services/factory-orchestration-edge/stagingAuth.js` | **NOT REQUIRED** for ownership (AuthN already supplies principalId) | **NOT REQUIRED** (default) |
| `services/factory-orchestration-edge/contract.js` | Only if error envelope wording needs shared helper — codes already exist | **NOT REQUIRED** (default) |
| `services/factory-orchestration-edge/jobStore.js` | **NOT REQUIRED** unless read-by-owner helper added | **CANDIDATE** (optional helper only) |
| `src/runPInt01SliceB3Validation.js` | Same-actor allow; cross-actor deny; malformed actor paths | **CANDIDATE** |
| `src/runPInt01SliceB4Validation.js` / Smoke | Extend fixtures with second principal token | **CANDIDATE** |

### 6.5 Tests

| Class | Cases |
|-------|-------|
| Same actor | Create as `staging-ops`; GET/cancel/lineage with same token → success (existing behaviors) |
| Cross-actor | Create as ops; access with `dev-director-token` (different `principalId`) → **403 FORBIDDEN** under default proposal |
| Actor absent | No Bearer → 401 (existing) |
| Capability absent | Role without capability → 403 (existing) |
| Unknown jobId | 404 (existing) — do not leak ownership |

### 6.6 Acceptance criteria

| ID | Criterion |
|----|-----------|
| A05-1 | Knowing jobId alone does not grant GET/cancel/lineage |
| A05-2 | Same-actor access preserved for authorized principals |
| A05-3 | Cross-actor denied fail-closed |
| A05-4 | No new AuthN/AuthZ product; staging Bearer retained |
| A05-5 | No constitutional boundary / CB-15 / Slice A changes |

### 6.7 Rollback / reversibility

Revert HQ-05 commit(s). Prior capability-only access restored. No data migration (`actorId` already persisted).

---

## 7. HQ-06 Implementation Plan — Strict Body and Content-Type Validation

### 7.1 Current model

| Fact | Detail |
|------|--------|
| Endpoints with body | Primary: `POST /v1/factory/orchestration/jobs` (cancel POST currently body-agnostic) |
| Content-Type accepted | **Any / unchecked** |
| Parse | Unbounded `collectBody` → optional `JSON.parse` |
| Schema | `validateOrchestrateSubmitBody` after parse |
| Size limit | **None** |

### 7.2 Proposed fail-closed strategy (proposal)

**Content-Type (submit):**

- Require request `Content-Type` compatible with **`application/json`** (exact match or `application/json; charset=…` — charset optional).  
- Missing or incorrect Content-Type → **400 VALIDATION_FAIL** (or existing BAD_REQUEST path) **before** business enqueue.

**Empty body (NB-03 — not a valid happy-path):**

- `collectBody` may yield an empty string that `_submit` treats as `{}` when trimmed text is empty.  
- On submit, `{}` **already fails** the current schema (`validateOrchestrateSubmitBody`) for missing required fields (`factoryKey`, `command`, etc.).  
- Therefore the pending Mandate decision **does not** consist of preserving `{}` as a **valid** request or happy-path.  
- The Mandate **SHALL** fix policy for: Content-Type when no entity is present; empty body handling; cancel-endpoint body behavior; and rejection **before** business enqueue — without treating `{}` as a successful submit.

**Body size:**

- Enforce max bytes in `collectBody` (or pre-parse gate).  
- **Numeric limit:** **NOT FOUND** in committed Slice B contract. **Mandate PARAMETER (open):** Mandate must fix an explicit integer before HQ-06 IMPL. This Plan **does not freeze** the number (example magnitudes sometimes cited in staging edges remain non-binding illustrations only). IMPL **MUST NOT** invent a silent unbounded “large enough” value without Mandate text.  
- Oversize → 400 VALIDATION_FAIL (or 413 only if Mandate adds it — **CONFIRMED contract today uses BAD_REQUEST family**; prefer **400 VALIDATION_FAIL** unless Mandate adds 413). **Open Mandate parameter:** 400 vs 413.

**Malformed / unexpected:**

- Invalid JSON → keep 400 VALIDATION_FAIL.  
- Schema failures → keep existing validation.  
- Unexpected keys: current validator does not reject unknown top-level keys beyond required checks; **do not expand** into a new allowlist product unless Mandate says so (Non-Goal: no contract expansion).  
- Cancel POST body policy (**open Mandate parameter**): ignore non-empty body as today **or** reject non-empty body with VALIDATION_FAIL — **CANDIDATE**; confirm at Mandate.

**Errors:** use existing envelopes; no sensitive payload echo.

### 7.3 Candidate files

| File | Change class | Confidence |
|------|--------------|------------|
| `services/factory-orchestration-edge/httpAdapter.js` | Bounded `collectBody`; optional early Content-Type read | **CANDIDATE** |
| `services/factory-orchestration-edge/commandCore.js` | Content-Type gate on `_submit` (and cancel body policy if chosen) | **CANDIDATE** |
| `services/factory-orchestration-edge/validation.js` | Shared helpers for CT / size messaging | **CANDIDATE** |
| `services/factory-orchestration-edge/contract.js` | Only if Mandate adds explicit limit constant | **CANDIDATE** |
| `src/runPInt01SliceB1Validation.js` / B3 / B4 | CT missing/wrong; oversize; malformed JSON; valid JSON happy path | **CANDIDATE** |

### 7.4 Tests

| Class | Cases |
|-------|-------|
| Positive | Valid `application/json` + valid schema → 202 |
| Negative CT | Missing CT; `text/plain`; wrong type → reject |
| Negative body | Malformed JSON; oversize buffer; invalid command (existing) |
| Empty body | CT / no-entity policy per Mandate (NB-03: `{}` is **not** a valid submit happy-path) |
| No leak | Error messages do not echo full giant body |

### 7.5 Acceptance criteria

| ID | Criterion |
|----|-----------|
| A06-1 | Only contracted JSON submit format reaches enqueue |
| A06-2 | Invalid payload never reaches business enqueue |
| A06-3 | Rejections deterministic and envelope-stable |
| A06-4 | No new formats (no form-encoding, no multipart) |
| A06-5 | No Slice A / Core / external API contract changes |

### 7.6 Rollback / reversibility

Revert HQ-06 commit(s). Prior unbounded collect + no CT check restored.

---

## 8. Implementation Order

**Proposed order:**

1. **HQ-04** — Timeout / Cancel Race Hardening  
2. **HQ-05** — Actor-Scoped ACL Hardening  
3. **HQ-06** — Strict Body and Content-Type Validation  

**Justification (repo-backed):**

| Factor | Finding |
|--------|---------|
| Coupling | Low — runner/store (04) vs commandCore ACL (05) vs transport/parse (06) |
| Regression risk | HQ-04 first stabilizes terminals that ACL/body tests assert via GET |
| Dependency | No code evidence that ACL or body hardening requires race fix first; order is **risk/auditability**, not hard dependency |
| Alternate order | HQ-06→HQ-05→HQ-04 also feasible if Mandate prefers transport hardening first |

**Execution shape:**

| Question | Proposal |
|----------|----------|
| Single IMPL block vs slices | **Three sequential micro-slices** under one PROGRAM 02 Mandate (or three Mandate sub-IDs if Director prefers) |
| Commits | **Independent commits per HQ** (preferred for bisect/audit) |
| Single combined commit | Allowed only if Mandate explicitly collapses them |
| Coupling risk | Low file overlap; conflict risk mainly in shared validation runners |

---

## 9. File-Level Change Plan

| HQ-ID | File | Change previsto | Motivo | Risk | Tests | New/Modify | Confidence |
|-------|------|-----------------|--------|------|-------|------------|------------|
| HQ-04 | `workerRunner.js` | Terminal arbitration on timeout/cancel | Close OBS-SB-RACE | Medium (timing) | B2/B4 | Modify | **CANDIDATE** |
| HQ-04 | `jobStore.js` | Guard gaps if proven | Terminal integrity | Low–Med | B2 | Modify | **CANDIDATE** |
| HQ-04 | `cancel.js` | Align pure contract if needed | Consistency | Low | B1 | Modify | **CANDIDATE** |
| HQ-04 | `runPInt01SliceB2Validation.js` | Interleaving cases | Prove residual closed | Low | self | Modify | **CANDIDATE** |
| HQ-05 | `commandCore.js` | Owner match GET/cancel/lineage | Close OBS-SB-ACL | Med (over-deny) | B3/B4 | Modify | **CANDIDATE** |
| HQ-05 | `runPInt01SliceB3Validation.js` | Cross-actor cases | Prove ACL | Low | self | Modify | **CANDIDATE** |
| HQ-05 | `runPInt01SliceB4Validation.js` / Smoke | Dual-principal fixtures | E2E | Low | self | Modify | **CANDIDATE** |
| HQ-06 | `httpAdapter.js` | Bounded body collect | Close size residual | Med (limit choice) | B3 | Modify | **CANDIDATE** |
| HQ-06 | `commandCore.js` | Content-Type gate | Close CT residual | Med (client compat staging) | B1/B3 | Modify | **CANDIDATE** |
| HQ-06 | `validation.js` / `contract.js` | Helpers / limit constant | Shared fail-closed | Low | B1 | Modify | **CANDIDATE** |
| HQ-06 | Slice B runners | CT/size/malformed cases | Prove residual closed | Low | self | Modify | **CANDIDATE** |
| — | `services/factory-service-edge/**` | — | Regression boundary | — | Slice A suites if any | — | **NOT REQUIRED** |
| — | `src/factory/**` | — | Core out of scope | — | PROGRAM 01 runners | — | **NOT REQUIRED** |

No hypothetical new production services are introduced as definitive paths. Any **new** helper file under `services/factory-orchestration-edge/` is **NOT REQUIRED** by default; prefer modifying CONFIRMED modules.

---

## 10. Test and Validation Plan

### 10.1 Layers

| Layer | Vehicle |
|-------|---------|
| Unit / contract | B1 (+ HQ-06 CT helpers if placed there) |
| Runner / store | B2 (+ HQ-04 interleavings) |
| HTTP integration | B3 (+ HQ-05 cross-actor; HQ-06 CT/size) |
| Regression pack | B4 (must keep spawning B1–B3) |
| Smoke | `runPInt01SliceBSmoke.js` |

### 10.2 Required additions (future IMPL — not this Plan)

- Negative: cross-actor GET/cancel/lineage  
- Negative: missing/wrong Content-Type; oversize body; malformed JSON (asserted)  
- Idempotence: double cancel; timeout after cancel  
- Deterministic race harness for HQ-04  

### 10.3 Commands (existing — do not modify runners in this documentary block)

```text
node src/runPInt01SliceB1Validation.js
node src/runPInt01SliceB2Validation.js
node src/runPInt01SliceB3Validation.js
node src/runPInt01SliceB4Validation.js
node src/runPInt01SliceBSmoke.js
```

**New runners:** **NOT REQUIRED** unless Mandate finds B1–B4 insufficient; prefer extending existing runners.

**This Plan does not modify any runner.**

---

## 11. Acceptance Matrix

| HQ | Requirement | Evidence | Test | Needed result | Fail if |
|----|-------------|----------|------|---------------|---------|
| HQ-04 | Single terminal under cancel+timeout | Store state + GET | B2 interleaving | One terminal; cancel preferred when accepted | Dual terminal / SUCCEEDED after cancel |
| HQ-04 | Idempotent cancel/timeout | Repeated ops | B2 | Stable terminal | State oscillation |
| HQ-05 | Owner-scoped GET | HTTP 403 cross-actor | B3 | Deny | Cross-actor 200 |
| HQ-05 | Owner-scoped cancel | HTTP 403 cross-actor | B3 | Deny | Cross-actor cancel OK |
| HQ-05 | Same-actor preserved | HTTP 200/202 paths | B3/B4 | Allow | Same-actor regressions |
| HQ-06 | CT enforced | HTTP 400 on bad/missing CT | B3 | Reject | Bad CT accepted |
| HQ-06 | Size enforced | HTTP 400 on oversize | B3 | Reject | Unbounded accept |
| HQ-06 | Schema still works | Valid submit | B1/B3/B4 | 202 | Valid rejected |
| All | Slice B regressions | B1–B4+Smoke | All green | Pass | Any suite red |
| All | No Core/Slice A edits | `git diff` scope | Review | Only orchestration-edge + runners | Out-of-scope paths touched |

---

## 12. Regression Boundary

**MUST protect / MUST NOT break:**

| Boundary | Rule |
|----------|------|
| Slice A | Zero edits to `services/factory-service-edge/**`; READ_ONLY contracts intact |
| P-INT-01 Slice B accepted behavior | Preserve submit/get/cancel/lineage success paths for **authorized same-actor** staging clients |
| Factory Core | Zero edits to `src/factory/**` |
| PROGRAM 01 | No reopen of HQ-01/02/03 |
| Read model / Service Edge read | Untouched |
| Observability / ELR cloud | Untouched; no new ELR paths |
| Other integrations | P-INT-02…10, Admin Live Wiring, Object Store — untouched |
| Public product contracts | No Marketplace/Product/Web API changes |

---

## 13. Security and Compliance Boundary

| Rule | Binding |
|------|---------|
| Fail-closed | Deny on missing actor match, bad CT, oversize, unverified principal |
| Deny-by-default | Preserve staging AuthZ role+capability gate; **add** ownership — do not weaken capability checks |
| No new credentials | No new secrets, tokens stores, or commercial Auth |
| No sensitive logs | Do not log raw bodies / tokens |
| No Supabase | Absolute |
| No new external persistence | File/memory store only as today |
| No RLS changes | Absolute |
| No commercial Auth | Absolute; OBS-SB-AUTH remains out of HQ scope |

---

## 14. Risks

| ID | Risk | Mitigation |
|----|------|------------|
| R-04-1 | Race residual hard to reproduce | Deterministic harness with controllable executor + short timeout |
| R-04-2 | Flaky concurrency tests | Prefer deterministic hooks over wall-clock races; stabilize in B2 before B4 |
| R-05-1 | Over-blocking ACL (Director/ops workflows) | Default owner-match both roles; escalate Director bypass as Stop Condition |
| R-05-2 | Actor ownership ambiguity (`anonymous`) | Enqueue already sets principalId; reject empty principal at AuthN (existing) |
| R-06-1 | Rejecting previously accepted staging clients missing CT | Update harness clients in same HQ-06 commit; document CT requirement |
| R-06-2 | Wrong numeric size limit | Mandate must set integer; Plan does not freeze |
| R-06-3 | Parser vs contract discrepancy | Keep `validateOrchestrateSubmitBody` as semantic source of truth |
| R-X-1 | Scope creep into OBS-SB-AUTH/STUB | Explicit Non-Goals; stop if attempted |
| R-X-2 | Continuity still says NEXT BLOCK NONE | IMPL requires separate Mandate + Continuity discipline; Plan alone insufficient |

---

## 15. Stop Conditions

**Stop IMPL immediately and escalate to Director if:**

1. Work requires Supabase or any cloud persistence.  
2. Work requires modifying Factory Core (`src/factory/**`).  
3. Undocumented Slice A dependency appears.  
4. Public contracts outside Slice B orchestration staging must change.  
5. `actorId` is missing/unreliable for existing jobs and no fail-closed policy can be applied without invention.  
6. Solution requires redesigning the Job Runner (new queue, new process architecture, live CB-15 orchestrate).  
7. Architectural change beyond residual hardening is proposed.  
8. Body size limit or Director cross-actor bypass remains undecided and blocks coding.  
9. Continuity / Mandate gates are not satisfied for IMPL start.

### Open Mandate parameters (must remain unresolved in this Plan)

| Parameter | Status in this Plan |
|-----------|---------------------|
| Maximum body size (bytes) | **OPEN** — Mandate must set integer before HQ-06 IMPL |
| Owner-match for both roles vs explicit Director bypass | **OPEN** — default proposal = owner-match both; bypass only if Director decides |
| Content-Type + empty-body / no-entity policy | **OPEN** (NB-03) |
| Cancel POST body policy | **OPEN** |
| Include lineage under ownership hardening | **OPEN** — Plan recommends include; Mandate ratifies or excludes (NB-02) |
| Oversize HTTP status 400 vs 413 | **OPEN** — Plan prefers 400 unless Mandate adds 413 |

---

## 16. Commit Strategy (proposal only — not executed)

| Step | Commit type | When |
|------|-------------|------|
| D0 | Documentary commit of this Plan (+ audit status if required by protocol) | After Documentary Audit PASS / PASS WITH OBSERVATIONS + Director order |
| I1 | `fix(factory): harden Slice B timeout/cancel race (HQ-04)` | After Mandate IMPL |
| I2 | `fix(factory): harden Slice B actor-scoped ACL (HQ-05)` | After I1 green (or Mandate-parallel if explicitly allowed) |
| I3 | `fix(factory): harden Slice B body/content-type validation (HQ-06)` | After I2 green |
| S1 | Status / closeout documentary commits | After Independent Technical Audit |

**Rules:** no amend of published history; no push of incomplete IMPL without Mandate; no force push; do not mix HQ scopes in one commit unless Mandate collapses them.

---

## 17. Non-Goals

- **Not** implementing code in this documentary block  
- **Not** creating new product capabilities  
- **Not** changing architecture or reopening Slice B construction as a new program of work beyond residual hardening  
- **Not** reopening PROGRAM 01  
- **Not** touching HQ-07 / HQ-08  
- **Not** touching OBS-SB-AUTH / OBS-SB-STUB / OBS-SB-FS / OBS-SB-BANNER as HQ deliverables  
- **Not** touching Supabase / Web / Product / Marketplace / CRM / Owner Portal / PWA  
- **Not** adding npm dependencies without separate justification + authorization  
- **Not** git add / commit / push of this Plan in this drafting act  
- **Not** authorizing Mandate IMPL by existence of this file  

---

## 18. Final Status

```text
IMPLEMENTATION PLAN COMPLETE — DOCUMENTARY RE-AUDIT: PASS — PENDING DOCUMENTARY COMMIT
IMPLEMENTATION: NOT AUTHORIZED
```

### Binding footer

```text
PROGRAM 02 — INTEGRATION SURFACE HARDENING
OFFICIAL IMPLEMENTATION PLAN
HQ-04 ← OBS-SB-RACE
HQ-05 ← OBS-SB-ACL
HQ-06 ← OBS-SB-BODY

BASE BRANCH: integration/factory-complete-20260725
BASE HEAD:   6b61910f0a5fc77cda375a5fe9615f9ca3d7e870

STATUS: IMPLEMENTATION PLAN COMPLETE — DOCUMENTARY RE-AUDIT: PASS — PENDING DOCUMENTARY COMMIT
IMPLEMENTATION: NOT AUTHORIZED
PUSH: NOT AUTHORIZED
```

---

**END OF IMPLEMENTATION PLAN**

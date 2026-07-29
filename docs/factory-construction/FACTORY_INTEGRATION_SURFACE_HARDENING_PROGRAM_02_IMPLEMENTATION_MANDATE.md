# FACTORY QUALITY HARDENING — PROGRAM 02 IMPLEMENTATION MANDATE  
## Integration Surface Hardening — HQ-04 · HQ-05 · HQ-06

## RealEstateSniper Factory 2.0

---

## 1. Mandate Identity

| Campo | Valor |
|-------|--------|
| **Document ID** | `FACTORY_INTEGRATION_SURFACE_HARDENING_PROGRAM_02_IMPLEMENTATION_MANDATE.md` |
| **Path** | `docs/factory-construction/FACTORY_INTEGRATION_SURFACE_HARDENING_PROGRAM_02_IMPLEMENTATION_MANDATE.md` |
| **Title** | FACTORY QUALITY HARDENING — PROGRAM 02 IMPLEMENTATION MANDATE |
| **Mandate ID** | `PROGRAM-02-INTEGRATION-SURFACE-HARDENING-IMPL` |
| **Program** | **PROGRAM 02 — INTEGRATION SURFACE HARDENING** |
| **HQ authorized (exclusive)** | **HQ-04 · HQ-05 · HQ-06** |
| **Branch (verified at drafting)** | `integration/factory-complete-20260725` |
| **HEAD base (verified at drafting)** | `72e78fe3238f743975bc845d5539a2c10a3e561b` |
| **Environment (future IMPL)** | **STAGING ONLY** |
| **Nature** | Director Implementation Mandate — **APPROVED** · closes Plan open parameters · authorizes IMPLEMENTATION of HQ-04/HQ-05/HQ-06 under this Mandate and the published Implementation Plan · **does not** by itself execute code in this publication block · does **not** authorize Web, Product, Marketplace, CRM, Owner Portal, PWA, Supabase, commercial Auth, Factory Core, or Slice A changes |
| **Status** | **DIRECTOR MANDATE: APPROVED** |
| **Implementation** | **IMPLEMENTATION AUTHORIZATION: GRANTED UNDER THIS MANDATE** |

### Authorizing documentary antecedents (published)

| Artifact | Role |
|----------|------|
| `FACTORY_INTEGRATION_SURFACE_HARDENING_PROGRAM_02_OFFICIAL_DISCOVERY.md` | Official Discovery package |
| `FACTORY_INTEGRATION_SURFACE_HARDENING_PROGRAM_02_FORENSIC_RESOLUTION_ADDENDUM.md` | Authoritative HQ genealogy (HQ-04←OBS-SB-RACE, HQ-05←OBS-SB-ACL, HQ-06←OBS-SB-BODY) |
| `FACTORY_INTEGRATION_SURFACE_HARDENING_PROGRAM_02_DOCUMENTARY_COMMIT_STATUS.md` | Discovery documentary commit status |
| `FACTORY_INTEGRATION_SURFACE_HARDENING_PROGRAM_02_IMPLEMENTATION_PLAN.md` | Official Implementation Plan — **DOCUMENTARY RE-AUDIT: PASS** — commit `72e78fe3238f743975bc845d5539a2c10a3e561b` |
| `integration/FACTORY_INTEGRATION_P_INT_01_SLICE_B_IMPL_STATUS.md` | Slice B residuals source; Slice B **FULLY CLOSED** / **IMPLEMENTATION ACCEPTED** |

**Binding note:** This Mandate is **APPROVED** by the Director. Engineering IMPL is **AUTHORIZED UNDER THIS MANDATE** for HQ-04 / HQ-05 / HQ-06 only, and **may begin only in a separate controlled implementation block** following the published Implementation Plan and the decisions herein. This documentary publication block does **not** start implementation execution.

---

## 1b. Director Approval

| Campo | Valor |
|-------|--------|
| **Director Decision** | **APPROVED** |
| **Mandate ID** | `PROGRAM-02-INTEGRATION-SURFACE-HARDENING-IMPL` |
| **Effective Scope** | **HQ-04 / HQ-05 / HQ-06 only** |
| **Authorization Boundary** | Implementation may begin only in a **separate controlled block** following the approved Implementation Plan and this Mandate |
| **Implementation execution in this publication block** | **NOT STARTED** |

---

## 2. Authorization Scope

Upon **Director Approval** of this Mandate, implementation is authorized **exclusively** for:

| HQ-ID | Name | Residual closed |
|-------|------|-----------------|
| **HQ-04** | Timeout / Cancel Race Hardening | OBS-SB-RACE |
| **HQ-05** | Actor-Scoped ACL Hardening | OBS-SB-ACL |
| **HQ-06** | Strict Body and Content-Type Validation | OBS-SB-BODY |

**Not authorized by this Mandate:**

- HQ-01 · HQ-02 · HQ-03 (PROGRAM 01)
- HQ-07 · HQ-08
- OBS-SB-FS · OBS-SB-AUTH · OBS-SB-STUB · OBS-SB-BANNER
- TD-AUTH-PROD · TD-DUAL-SNAPSHOT · TD-DSO-LIVE · TD-ELR-CLOUD
- Any other Factory / Integration / Product surface

---

## 3. HQ-04 Decisions — Timeout / Cancel Race Hardening

| # | Decision (binding upon Mandate approval) |
|---|------------------------------------------|
| D04-1 | If timeout occurs while the job remains **`RUNNING`** and **`cancelRequested`** is true, IMPL **SHALL** perform an **idempotent terminal transition to `CANCELLED`** before constructing or returning any public job view. |
| D04-2 | If a terminal state is **already persisted**, IMPL **SHALL** preserve and return it **without overwrite**. |
| D04-3 | Cancel and timeout handling **SHALL** be **idempotent** with respect to an already-established terminal. |
| D04-4 | A job **MUST NOT** produce two incompatible terminal results; later terminals **MUST NOT** overwrite earlier terminals. |
| D04-5 | The **real timeout entry path** via **`catch`** after `Promise.race` rejection **SHALL** be covered; IMPL **MUST NOT** rely exclusively on a post-`await` branch. |
| D04-6 | Job Runner architecture **MUST NOT** be redesigned (no new queue vendor, process model, or live CB-15 `orchestrateExpediente`). |
| D04-7 | Exact helper / call site (e.g. checkpoint vs dedicated cancel-finalize) **MAY** be chosen during IMPL **within** the Implementation Plan and these decisions — **CANDIDATE mechanism, closed outcome**. |

---

## 4. HQ-05 Decisions — Actor-Scoped ACL Hardening

| # | Decision (binding upon Mandate approval) |
|---|------------------------------------------|
| D05-1 | **Default ACL rule:** **owner-match obligatory** for both **`FACTORY_OPS`** and **`FACTORY_DIRECTOR`**. Access to a job requires `principal.principalId === job.actorId` after AuthN/AuthZ capability checks. |
| D05-2 | Knowing a **`jobId` alone does not grant access**. |
| D05-3 | **Absent or unverifiable actor/principal:** **deny** (preserve existing AuthN failure → 401; do not invent soft-allow). |
| D05-4 | **No administrative cross-actor bypass** is authorized by this Mandate. |
| D05-5 | Any future Director/admin cross-actor bypass requires a **separate Mandate**. |
| D05-6 | **`GET` status, `cancel`, and `lineage`** are covered by the **same ownership rule**. |
| D05-7 | **Lineage is ratified** as a **deliberate fail-closed extension** of OBS-SB-ACL (OBS literal named GET/cancel; lineage included because it exposes information by `jobId`). |
| D05-8 | Deny cross-actor with existing staging contract **`FORBIDDEN` / HTTP 403** (already present in `contract.js`). Do not invent new AuthN/AuthZ products, capabilities, JWT, or commercial Auth. |

---

## 5. HQ-06 Decisions — Strict Body and Content-Type Validation

| # | Decision (binding upon Mandate approval) |
|---|------------------------------------------|
| D06-1 | **Maximum request body size:** **exactly 64 KiB = 65,536 bytes** (inclusive). |
| D06-2 | Body length **≥ 65,537 bytes:** reject with **HTTP 413 Payload Too Large**. |
| D06-3 | Body length **≤ 65,536 bytes** that otherwise satisfies Content-Type + schema: **may be accepted** (subject to existing semantic validation). |
| D06-4 | **Content-Type** for requests **with a body:** must be **`application/json`**. |
| D06-5 | **Charset:** accept **`application/json`** with **no charset**, or with a **valid UTF-8 charset** parameter only (e.g. `application/json; charset=utf-8`). Reject other charsets / media types. |
| D06-6 | **Absent or incompatible Content-Type when a body is present:** **fail-closed reject** before business enqueue. |
| D06-7 | **Empty body on submit:** **reject before business logic** (do not treat empty entity as a valid successful submit path). |
| D06-8 | Submit with JSON **`{}`:** remains subject to the **current schema** and **MUST** be rejected for missing required fields (`factoryKey`, `command`, etc.). `{}` is **not** a valid happy-path. |
| D06-9 | **Cancel `POST`:** **MUST NOT** accept a business body. **Empty body allowed.** **Non-empty body rejected** fail-closed before cancel business logic. |
| D06-10 | **Malformed JSON:** deterministic reject before business logic. |
| D06-11 | **Unexpected fields:** apply **existing** contract/schema only — **no** new formats, no expanded top-level allowlist product. |
| D06-12 | **Errors:** use existing envelopes; **MUST NOT** reveal sensitive data (tokens, full oversized payloads, secrets). |

### HQ-06 contract note (413)

`services/factory-orchestration-edge/contract.js` today exposes BAD_REQUEST family statuses and **does not yet define HTTP 413**. Upon Mandate approval, HQ-06 IMPL **is authorized** to add staging orchestration-edge constants for **413 Payload Too Large** (and matching error code) **only** inside `services/factory-orchestration-edge/**`. This is Mandate-authorized completion of Slice B staging hardening — **not** authorization to change Slice A, Web, Product, Marketplace, or other public product contracts.

If adding 413 proves to require changes **outside** the authorized boundary, **Stop Condition** applies.

---

## 6. Implementation Order

| Order | HQ | Rule |
|-------|-----|------|
| 1 | **HQ-04** | Complete + validate before publishing HQ-04 commit |
| 2 | **HQ-05** | Independent commit after HQ-04 green |
| 3 | **HQ-06** | Independent commit after HQ-05 green |

**Binding:**

- Implementation commits **SHALL** be **independent per HQ**.  
- **Do not publish** a partially finished HQ.  
- Do not mix HQ scopes in one commit unless a later Director order explicitly collapses them.

---

## 7. Validation Requirements

Upon IMPL, the following **SHALL** be demonstrated (extend existing Slice B runners; new runners only if existing prove insufficient):

| Area | Requirement |
|------|-------------|
| Positive paths | Same-actor submit/GET/cancel/lineage; valid timeout→FAILED when no cancel; valid JSON + CT + size ≤ 65,536 |
| Negative paths | Auth/capability failures preserved; invalid schema; wrong CT; oversize; malformed JSON |
| HQ-04 | Deterministic interleaving harnesses (cancel+timeout); idempotent cancel/timeout; single terminal |
| HQ-05 | Cross-actor GET/cancel/lineage → **403**; absent/malformed actor → deny; same-actor preserved |
| HQ-06 | Content-Type missing/incompatible; empty submit body rejected; `{}` schema reject; **65,536** accepted if otherwise valid; **65,537** → **413**; cancel empty body OK; cancel non-empty body rejected |
| Regression | Full Slice B: B1, B2, B3, B4, Smoke |
| Boundaries | **Zero** edits to Slice A (`services/factory-service-edge/**`) and Factory Core (`src/factory/**`) |

**Exact existing commands (baseline):**

```text
node src/runPInt01SliceB1Validation.js
node src/runPInt01SliceB2Validation.js
node src/runPInt01SliceB3Validation.js
node src/runPInt01SliceB4Validation.js
node src/runPInt01SliceBSmoke.js
```

---

## 8. Authorized Change Boundary

**Allowed (minimal, upon Mandate approval):**

| Surface | Scope |
|---------|--------|
| `services/factory-orchestration-edge/**` | HQ-04/05/06 hardening only (paths as in Implementation Plan: e.g. `workerRunner.js`, `jobStore.js`, `commandCore.js`, `httpAdapter.js`, `validation.js`, `contract.js`, `cancel.js` as needed) |
| `src/runPInt01SliceB*.js` | Extend tests/fixtures for HQ-04/05/06 |
| Documentation / Status | Strictly necessary post-IMPL Status / closeout under PROGRAM 02 / factory-construction conventions |

Concrete file edits **SHALL** derive from the published Implementation Plan inventory and live code — treat Plan **CANDIDATE** paths as starting points, not invented new services.

**Not allowed:** any path outside the above without a new Director Mandate.

---

## 9. Prohibitions

This Mandate **prohibits**:

- Supabase / external DB / RLS changes  
- Commercial Auth / production Auth  
- Web / FCC / Admin UI  
- Product / Marketplace / CRM / Owner Portal / PWA  
- Factory Core (`src/factory/**`) modification  
- Slice A (`services/factory-service-edge/**`) modification  
- Public contract changes **outside** Slice B orchestration-edge staging  
- New npm/runtime dependencies without separate authorization  
- Job Runner redesign  
- HQ-07 / HQ-08  
- Residuals OBS-SB-FS / OBS-SB-AUTH / OBS-SB-STUB / OBS-SB-BANNER as deliverables  
- Force push / force-with-lease  
- Publication of incomplete HQ work  
- Silent invention of capabilities, formats, or Auth products  

---

## 10. Stop Conditions

**Stop IMPL immediately and escalate to Director if:**

1. Owner identity (`actorId` / `principalId`) cannot be applied with the current staging model without invention.  
2. An administrative cross-actor bypass becomes necessary (forbidden here; requires separate Mandate).  
3. The **65,536-byte** limit breaks a **published** contract outside the authorized staging edge (or cannot be applied without unauthorized surfaces).  
4. **HTTP 413** cannot be introduced within `services/factory-orchestration-edge/**` alone and would require unauthorized public-contract expansion.  
5. Slice A must be modified.  
6. Factory Core must be modified.  
7. Supabase / cloud persistence appears as a dependency.  
8. New architecture / Job Runner redesign is required.  
9. Conflict with the published Implementation Plan cannot be resolved within these Mandate decisions.  
10. An additional Director decision is required beyond this Mandate.

---

## 11. Implementation Protocol

Upon Mandate approval, each HQ follows:

```text
Implementation
→ Independent Technical Audit
→ Corrections if required
→ Implementation Commit
→ Push (only when authorized)
→ HEAD verification
→ Status / Closeout (documentary)
```

**Each HQ MUST be fully closed before its publication.** Incomplete HQ work MUST NOT be pushed.

---

## 12. Parameters Closed by This Mandate

| Former Plan open parameter | Mandate decision |
|----------------------------|------------------|
| Max body size | **65,536 bytes (64 KiB) inclusive** |
| Oversize status | **HTTP 413** |
| Owner-match vs Director bypass | **Owner-match for OPS and DIRECTOR; no bypass** |
| Lineage under ownership | **Included / ratified** |
| Content-Type + empty body | **§5 decisions D06-4…D06-8** |
| Cancel POST body | **Empty OK; non-empty reject** |
| 400 vs 413 | **413 for oversize** |

---

## 13. Final Status

```text
DIRECTOR MANDATE APPROVED
IMPLEMENTATION: AUTHORIZED UNDER MANDATE PROGRAM-02-INTEGRATION-SURFACE-HARDENING-IMPL
IMPLEMENTATION EXECUTION: NOT STARTED
```

### Binding footer

```text
PROGRAM 02 — INTEGRATION SURFACE HARDENING
DIRECTOR IMPLEMENTATION MANDATE — APPROVED
Mandate ID: PROGRAM-02-INTEGRATION-SURFACE-HARDENING-IMPL

HQ-04 ← OBS-SB-RACE
HQ-05 ← OBS-SB-ACL
HQ-06 ← OBS-SB-BODY

BASE BRANCH: integration/factory-complete-20260725
BASE HEAD:   72e78fe3238f743975bc845d5539a2c10a3e561b

STATUS: DIRECTOR MANDATE APPROVED
IMPLEMENTATION: AUTHORIZED UNDER MANDATE PROGRAM-02-INTEGRATION-SURFACE-HARDENING-IMPL
IMPLEMENTATION EXECUTION: NOT STARTED
```

---

**END OF APPROVED MANDATE**

# FACTORY INTEGRATION II.4
## DISCOVERY AND SPECIFICATION BOUNDARY REPORT

**Document ID:** `FACTORY_INTEGRATION_II_4_DISCOVERY_REPORT.md`  
**Phase:** Factory Integration  
**Block:** II.4 — Discovery only  
**Document Type:** Discovery / Boundary Report  
**Status:** DISCOVERY — NOT A SPECIFICATION · NOT IMPLEMENTATION · NOT II.4-IMPL  

**Repository:** `C:\Users\cgrmo\Desktop\Reconciliation-Integration`  
**Branch / HEAD at discovery:** `reconciliation/factory-2.0` @ `5a0c692`  

**Normative sources read for this report:**

1. `FACTORY_INTEGRATION_II_1_SECURITY_BOUNDARY_SPECIFICATION.md`  
2. `FACTORY_INTEGRATION_II_2_READ_MODEL_CONTRACT_V2_SPECIFICATION.md`  
3. `FACTORY_INTEGRATION_II_3_SPECIFICATION.md`  
4. `FACTORY_INTEGRATION_II_3_IMPLEMENTATION_PLAN.md`  
5. `FACTORY_INTEGRATION_II_3_IMPL_STATUS.md`  
6. `src/integration/readModel/**` (dependency review)  
7. `src/integration/publicationEligibility/**` (dependency review)  

---

## 1. Current Integration Chain State

| Block | Role | Status |
|-------|------|--------|
| **II.1** | Security / trust boundary (`READ_ONLY`, `INTERNAL_OPS`, Factory truth) | CLOSED (documentary) |
| **II.2** | Read Model Contract v2 | CLOSED |
| **II.2-IMPL (+.1)** | Sanitizer / validator / integrity / freshness gate | CLOSED · suite **31/31 PASS** |
| **II.3** | Publication eligibility governance (spec) | CLOSED |
| **II.3-IMPL Plan** | Eligibility-only implementation plan | CLOSED |
| **II.3-IMPL (+.1)** | `ELIGIBLE` / `NOT_ELIGIBLE` decision gate | CLOSED · suite **16/16 PASS** |
| **Delivery** | Consumer exposure / transport / Auth channels | **NOT_AUTHORIZED** |
| **II.4** | Not previously defined | **THIS DISCOVERY ONLY** |

Constitutional sequence already written in II.3:

```text
II.1  Trust & exposure boundary
  → II.2  Contract & fail-closed validation
    → II.3  Publication eligibility governance
      → Later  Authenticated delivery & consumer channels
```

Critical observation: documents name a coarse “Later” bucket. They do **not** define what II.4 is. II.2 §39 PARKING lists several distinct deferred responsibilities that must not be collapsed into one block without Director choice.

---

## 2. Capabilities That Already Exist

### 2.1 II.1 — Security Boundary

- Factory = sole operational source of truth.
- Integration = read-only projection owner.
- `INTERNAL_OPS`; UI-only security rejected.
- Conceptual observe → sanitize → validate → integrity flow.
- Authenticated delivery boundary explicitly unauthorized.

### 2.2 II.2 / II.2-IMPL — Contract & Gate

- Contract identity, allowlists, invariants, quotas/depth, checksum, freshness, ownership↔registry coherence.
- Fail-closed validation oracle: `validateReadModelV2`.
- Fixtures and regression suite (31/31).

### 2.3 II.3 / II.3-IMPL — Publication Eligibility

- Deterministic decisions: `ELIGIBLE` | `NOT_ELIGIBLE`.
- Consumes II.2 without duplicating or modifying Contract v2.
- Atomic *eligibility* unit checks (no fragment eligibility).
- Closed reason catalog; fail-closed on gate throw (II.3-IMPL.1).
- Always `delivery: NOT_AUTHORIZED`, `sideEffects: []`.
- **Does not** assemble live Factory observation into candidates.
- **Does not** seal, store, transport, or expose snapshots.
- **Does not** deploy an operational Producer.

### 2.4 Explicit non-capabilities (still absent)

From II.1 / II.2 parking and II.3 non-goals (non-exhaustive):

- operational Producer;
- atomic publication *mechanisms*;
- authenticated GET / AuthN / AuthZ;
- Edge, BFF, Supabase read-model wiring, historical retention;
- React / FCC / Marketplace;
- schema registry / cross-region publication;
- consumer delivery channels.

---

## 3. Immediate Architectural Gap After `ELIGIBLE` / `NOT_ELIGIBLE`

### 3.1 What eligibility answers

> May this *already-assembled* candidate snapshot be considered publication-eligible?

### 3.2 What eligibility does **not** answer

After a snapshot is `ELIGIBLE`, Integration still has **no constitutional answer** for:

1. **What object** is the publication unit once eligibility has been granted?  
   (Eligibility decision ≠ sealed publication artifact.)
2. **What act**, if any, constitutes “publication” short of consumer delivery?  
   (II.3 atomicity is principle-only; mechanisms deferred.)
3. **Who assembles** observation into the candidate that eligibility evaluates?  
   (Logical Producer named; operational Producer forbidden and unimplemented.)
4. **How** an eligible unit may later be exposed under `INTERNAL_OPS`?  
   (Authenticated delivery parked; not activated.)

### 3.3 Immediate gap statement

The **immediate** post-II.3 hole is not “ship Delivery.”  
It is the missing middle between:

```text
ELIGIBLE decision  →  ???  →  authenticated consumer delivery
```

Existing texts already separate at least two parked concerns in that middle/downstream:

| Parked item (II.1 / II.2) | Category |
|---------------------------|----------|
| **atomic publication** | governance / artifact / (later) persistence mechanisms |
| **authenticated GET boundary** (+ AuthZ policy) | access control / delivery |

Separately, **upstream** of eligibility remains incomplete:

| Named but unimplemented | Category |
|-------------------------|----------|
| **Producer** (observe + assemble candidate) | governance concept; operational form still NOT_AUTHORIZED |

Therefore the next block must be chosen among **distinct** responsibilities — not assumed to be Delivery.

---

## 4. Category Separation (Mandatory Decomposition)

| Category | Exists today? | Candidate for early II.4? | Notes |
|----------|---------------|---------------------------|-------|
| **Governance** | Partial (II.1–II.3) | Yes | Rules for what “publication” means after eligibility |
| **Artifact** | No sealed publication-unit artifact | Yes (strong) | Bind eligible snapshot + eligibility outcome without delivery |
| **Persistence** | No | Later / optional under Director | Stores, queues, locks — parked as mechanisms |
| **Transport** | No | No for II.4 default | Network channels |
| **Delivery** | No | Not by default | Authenticated consumer exposure — parked as its own boundary |
| **Access control** | No | Not by default | AuthN/AuthZ — requires `INTERNAL_OPS` exposure decision |
| **Consumer projection** | Contract exists; no consumer path | Later | II.2 §33 consumer rules assume a future channel |
| **Observability** | Logging requirements named in II.2 §32 | Later thin slice possible | Must not become payload leak |
| **Producer assembly** | Logical only | Competing alternative | Upstream of eligibility; not “after ELIGIBLE” |

---

## 5. Plausible Alternatives for II.4

### Alternative A — Publication Unit / Atomic Publication Governance

**Thesis:** Define constitutionally what an **eligible publication unit** is (artifact + rules), enacting II.3 atomicity as governance without implementing storage products, transport, Auth, or Delivery.

**Pros**

- Directly fills the gap between `ELIGIBLE` and delivery.
- Matches parked item **“atomic publication”** already distinguished from **“authenticated GET boundary”**.
- Continues the pattern: II.1 trust → II.2 shape → II.3 may-publish → II.4 what-is-published-unit.
- Lowest scope-creep into Edge/Auth/Supabase/React if hard-bounded.

**Cons**

- Must carefully forbid inventing queues/DB/APIs under “atomicity.”
- Does not close Producer assembly gap.

### Alternative B — Producer Assembly Governance (still non-operational)

**Thesis:** Define how Integration may observe and assemble candidates that feed II.2/II.3 — without deploying a live Producer service.

**Pros**

- Closes the largest *upstream* hole (fixtures ≠ Factory observation).
- Aligns with II.3 logical Producer steps 1–2.

**Cons**

- Not the gap *after* `ELIGIBLE`; it precedes eligibility.
- High creep risk into operational Producer / Factory crawling.
- II.3-IMPL already deferred this deliberately.

### Alternative C — Authenticated Delivery Boundary

**Thesis:** II.4 = the “Later” box in II.3 §8 (authenticated delivery / transport / storage / consumer channels).

**Pros**

- Matches the coarse sequence sentence in II.3.
- Addresses `INTERNAL_OPS` exposure requirement named in II.1/II.2.

**Cons**

- Collapses many parked items (AuthN, AuthZ, GET boundary, possibly BFF/Edge/storage).
- Skips the unnamed middle (publication unit / atomic publication).
- Highest scope-creep; Director explicitly warned **not** to assume this.

### Alternative D — Composite “Publication Continuum” (eligibility → delivery in one block)

**Thesis:** One II.4 covering unit + persistence + delivery + access.

**Pros:** Speed narrative.  
**Cons:** Violates Integration block discipline; rejects constitutional incrementalism; **rejected** as discovery recommendation.

### Alternative E — Hold II.4; Director picks from parking list only

**Thesis:** Insufficient to name a block; wait for Director priority among parking items.

**Pros:** Safest if political priority unclear.  
**Cons:** Discovery already shows a coherent next governance gap (Alternative A); holding is optional, not mandatory.

---

## 6. Recommended Alternative for II.4

### Recommendation

**II.4 SHOULD be defined (when the Director authorizes a Specification) as:**

> **Publication Unit Governance** — constitutional rules for the Integration **publication unit** that may exist only after II.3 `ELIGIBLE`, preserving II.3 atomicity, without authorizing Delivery, AuthN/AuthZ, Edge, Supabase, React, operational Producer, or Contract v2 changes.

**Category primary:** governance + artifact  
**Category explicit non-goals for the II.4 Specification (unless Director expands):** persistence productization, transport, delivery, access control, consumer UX, operational Producer.

### Justification

1. **Documentary basis exists** without inventing a new product: II.1/II.2 park **atomic publication** separately from **authenticated GET**; II.3 ends at eligibility and forbids treating eligibility as delivery.
2. **Immediate post-eligibility hole** is real: `evaluatePublicationEligibility` returns a decision; it does not define a governed publication unit.
3. **Ordering discipline:** defining the unit before delivery prevents “ELIGIBLE ⇒ HTTP/Edge/Supabase” conflation — the exact failure mode II.3 warns about.
4. **Producer assembly** remains important but is a *parallel upstream* gap; it should be a **Director-ordered** sibling block (possibly II.4-alt or II.5), not silently merged into Delivery.
5. This recommendation does **not** open II.4-IMPL, APIs, schemas, classes, or persistence.

---

## 7. Proposed Scope Envelope for a Future II.4 Specification

*(Envelope only — not a Specification. No APIs, endpoints, JSON schemas, classes, or functions.)*

### 7.1 In scope (proposed)

- Objective: govern the **publication unit** after eligibility.
- Vocabulary: distinguish `ELIGIBLE` vs **publication unit** vs **delivered**.
- Rules: a publication unit MAY exist only if II.3 decision is `ELIGIBLE` and II.2 identity/integrity constraints remain binding.
- Atomicity: restate and bound II.3 §5.3 as unit governance (whole unit or nothing) without naming storage/queue products.
- Fail-closed: invalid, revoked, or non-eligible inputs never become publication units.
- Relationship map to II.1 / II.2 / II.3 and to later Delivery/Auth blocks.
- Explicit NOT_AUTHORIZED list (see §8).
- Acceptance criteria for the *specification document only*.
- Conditions required before any future II.4-IMPL.

### 7.2 Out of scope (proposed hard fence)

- Operational Producer / live Factory observation runners.
- Authenticated delivery, AuthN/AuthZ, Edge Functions, BFF.
- Supabase (or any DB) writes/reads as product integration.
- React / FCC / Marketplace.
- Contract v2 field redesign; changes to `readModel/**` or eligibility semantics.
- Queues, locks, object stores, timers, network clients as implementation.
- II.4-IMPL and II.5+.

---

## 8. Elements That Remain NOT_AUTHORIZED

Until separately authorized by the Director, the following continue **NOT_AUTHORIZED** / deferred:

- Delivery / authenticated GET boundary  
- AuthN / AuthZ policy runtime  
- Edge Functions  
- BFF  
- Supabase read-model / writes  
- Operational Producer  
- Historical retention systems  
- Cross-region publication  
- Schema registry / automated compatibility negotiation  
- React / Factory Control Center / Marketplace  
- Factory Runtime mutation (`src/factory/**`)  
- II.4-IMPL  
- II.5 and later  
- Any assumption that `ELIGIBLE` means published, delivered, persisted, authenticated, or exposed  

---

## 9. Dependencies for a Future II.4 Specification

| Dependency | Requirement |
|------------|-------------|
| **II.1** | Trust law; `INTERNAL_OPS`; no UI-only security |
| **II.2 / II.2-IMPL** | Contract identity + fail-closed gate remain normative |
| **II.3 / II.3-IMPL** | Eligibility oracle; `ELIGIBLE` prerequisite for any publication unit |
| **Director decision** | Confirm Alternative A (or choose B/C/E) before writing II.4 Specification |
| **Non-dependencies** | Auth, Edge, Supabase, React, Factory Runtime execution |

II.4 MUST NOT weaken II.1, II.2, or II.3.

---

## 10. Scope-Creep Risks

| Risk | Severity | Mitigation |
|------|----------|------------|
| Treating II.4 as Delivery/Auth/Edge by default | Critical | Discovery recommendation fences Delivery out |
| Smuggling persistence/queues under “atomic publication” | High | Principle/governance only in Specification; mechanisms deferred |
| Smuggling operational Producer under “publication unit” | High | Producer assembly is separate Director decision |
| Redefining Contract v2 inside II.4 | High | Freeze contract; consume II.2/II.3 only |
| Equating ELIGIBLE with published | High | Preserve II.3 vocabulary in II.4 |
| Opening II.4-IMPL from this discovery | High | Status: discovery only |
| Writing APIs/schemas/classes in the Specification phase | High | Forbidden until a later IMPL plan + authorization |

---

## 11. Mentions / Hints of II.4 in Current Documentation

| Source | What it says about “next” | Sufficiency for naming II.4 |
|--------|---------------------------|-----------------------------|
| II.3 §8 sequence | “Later = Authenticated delivery & consumer channels” | Coarse; **not** a definition of II.4 |
| II.3 / II.3-IMPL | “II.4 not opened” | Explicit non-definition |
| II.1 / II.2 PARKING | Distinct items: atomic publication vs authenticated GET vs Producer vs retention… | Strong basis to **decompose**, not to auto-pick Delivery |
| II.3-IMPL Status | Delivery / II.4 NOT AUTHORIZED | No II.4 content |

**Conclusion on hints:** There is enough basis to **discover and propose** II.4’s boundary. There is **not** enough basis to treat Delivery as mandatory II.4 without Director confirmation.

---

## 12. Questions Requiring Director Decision

1. **Confirm Alternative A** (Publication Unit / Atomic Publication Governance) as the title of II.4 Specification?  
   Or select **B** (Producer assembly governance), **C** (Authenticated Delivery Boundary), or **E** (hold)?

2. If A is confirmed: may the II.4 Specification mention persistence/transport **only as deferred non-goals**, or must those words be omitted entirely?

3. Ordering: should **Producer assembly governance** be scheduled as II.4 instead of A, or as II.5 after A?

4. Is any **observability** slice (II.2 §32 logging of publication success/failure) allowed inside II.4 Spec as requirements-only, or deferred with Delivery?

5. After II.4 Specification approval, is **II.4-IMPL** expected to remain code-free until a separate Implementation Plan (same pattern as II.3)?

6. Confirm that **Delivery / Auth / Edge / Supabase / React** remain NOT_AUTHORIZED through the entire II.4 Specification phase.

---

## 13. Can II.4 Be Defined Now?

| Question | Answer |
|----------|--------|
| Enough basis for a Discovery Report? | **Yes** |
| Enough basis for a full II.4 Specification without Director choice? | **No** — Alternative A is recommended but not mandated by prior texts |
| Enough basis to implement anything? | **No** |
| Enough basis to open II.4-IMPL? | **No** |

---

## 14. Discovery Verdict

**READY TO DEFINE II.4 WITH DIRECTOR DECISIONS**

Recommended subject for the future Specification (pending Director confirmation):

> **II.4 — Publication Unit Governance** (artifact + atomicity governance after eligibility; Delivery / Auth / Producer operativo / persistence products remain out of scope).

This document does **not** authorize writing the II.4 Specification, any implementation, or any commit.

---

## 15. Documentary Status of This Report

- **II.4 Discovery Report:** CREATED  
- **II.4 Specification:** NOT CREATED / NOT AUTHORIZED by this report  
- **II.4-IMPL:** NOT OPENED  
- **II.5:** NOT OPENED  
- **Code / tests:** UNCHANGED  
- **Commit / push:** NOT PERFORMED  

---

**END OF DISCOVERY REPORT**

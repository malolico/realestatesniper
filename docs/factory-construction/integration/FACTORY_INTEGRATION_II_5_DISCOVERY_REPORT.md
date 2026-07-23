# FACTORY INTEGRATION II.5
## DISCOVERY AND SPECIFICATION BOUNDARY REPORT

**Document ID:** `FACTORY_INTEGRATION_II_5_DISCOVERY_REPORT.md`  
**Phase:** Factory Integration  
**Block:** II.5 — Discovery only  
**Document Type:** Discovery / Boundary Report  
**Status:** DISCOVERY — NOT A SPECIFICATION · NOT IMPLEMENTATION · NOT II.5-IMPL  

**Repository:** `C:\Users\cgrmo\Desktop\Reconciliation-Integration`  
**Branch / HEAD at discovery:** `reconciliation/factory-2.0` @ `2d89773`  

**Normative sources read for this report:**

1. `FACTORY_INTEGRATION_II_1_SECURITY_BOUNDARY_SPECIFICATION.md`  
2. `FACTORY_INTEGRATION_II_2_READ_MODEL_CONTRACT_V2_SPECIFICATION.md`  
3. `FACTORY_INTEGRATION_II_3_SPECIFICATION.md`  
4. `FACTORY_INTEGRATION_II_3_IMPLEMENTATION_PLAN.md`  
5. `FACTORY_INTEGRATION_II_3_IMPL_STATUS.md`  
6. `FACTORY_INTEGRATION_II_4_DISCOVERY_REPORT.md`  
7. `FACTORY_INTEGRATION_II_4_PUBLICATION_UNIT_GOVERNANCE_SPECIFICATION.md`  
8. `FACTORY_INTEGRATION_II_4_IMPLEMENTATION_PLAN.md`  
9. `FACTORY_INTEGRATION_II_4_IMPL_STATUS.md`  
10. `src/integration/readModel/**`  
11. `src/integration/publicationEligibility/**`  
12. `src/integration/publicationUnit/**`  

---

## 1. Current Integration Chain State

| Block | Role | Status |
|-------|------|--------|
| **II.1** | Security / trust boundary (`READ_ONLY`, `INTERNAL_OPS`, Factory truth) | CLOSED |
| **II.2 / II.2-IMPL** | Read Model Contract v2 + fail-closed gate | CLOSED · **31/31 PASS** |
| **II.3 / II.3-IMPL** | Publication eligibility (`ELIGIBLE` / `NOT_ELIGIBLE`) | CLOSED · **16/16 PASS** |
| **II.4 / II.4-IMPL** | Publication Unit governance (`UNIT_FORMED` / …) | CLOSED · **19/19 PASS** @ `2d89773` |
| **Delivery** | Consumer exposure / transport / Auth channels | **NOT_AUTHORIZED** |
| **Operational Producer** | Live observation / assembly / publishing service | **NOT_AUTHORIZED** |
| **Persistence / transport / Supabase / React** | Product channels | **NOT_AUTHORIZED** |
| **II.5** | Not previously defined | **THIS DISCOVERY ONLY** |

Constitutional progression realized so far:

```text
II.1  Trust & exposure boundary
  → II.2  Contract & fail-closed validation
    → II.3  Publication eligibility (ELIGIBLE / NOT_ELIGIBLE)
      → II.4  Publication Unit governance (UNIT_FORMED / …)
        → ???   ← II.5 discovery target
          → Later  persistence / transport / authenticated delivery / consumers
```

II.3’s coarse “Later = authenticated delivery” bucket remains **not** a definition of II.5.  
II.4 filled the post-`ELIGIBLE` middle named as atomic publication / Publication Unit.  
II.5 must be proven — not assumed to be Producer or Delivery.

---

## 2. Exact Semantics of `UNIT_FORMED`

### 2.1 What `UNIT_FORMED` is

Per II.4 Specification + II.4-IMPL:

`UNIT_FORMED` means Integration has recognized a **Publication Unit**: a constitutional, atomic, immutable **governance binding** of:

1. one complete II.2-accepted Read Model snapshot (bound by reference as a whole);  
2. II.3 decision `ELIGIBLE` for that same candidate;  
3. existing II.2 identity (`snapshotId`) and integrity metadata;

with always:

- `delivery: NOT_AUTHORIZED`  
- `sideEffects: []`

### 2.2 What `UNIT_FORMED` is **not**

| Claim | Authorized by `UNIT_FORMED`? |
|-------|------------------------------|
| published | **No** |
| persisted | **No** |
| delivered | **No** |
| authenticated | **No** |
| exposed | **No** |
| release-ready / handoff-ready for a later channel | **Not defined** |
| inventory/manifest entry | **Not defined** |
| operational Producer output | **No** |
| permission to open Auth/Edge/API/Supabase/React | **No** |

### 2.3 Residual confusion (already documented)

II.4-IMPL status explicitly warns callers may confuse `UNIT_FORMED` with delivered/persisted.  
That warning is evidence of a **semantic gap after formation**, not evidence that Delivery should be II.5 by default.

---

## 3. Capabilities That Already Exist

| Capability | Where |
|------------|--------|
| Trust law / `INTERNAL_OPS` / Factory truth | II.1 |
| Contract shape, sanitize, validate, integrity, freshness | II.2 |
| Eligibility decision | II.3 |
| Publication Unit formation / refusal | II.4 |
| Fail-closed, frozen outcomes, no Delivery side effects | II.3 + II.4 IMPL |

### Still absent (relevant to “after `UNIT_FORMED`”)

- Any constitutional answer to **handoff / release readiness** of a formed unit  
- Any governed **manifest / declaration** of formed units (non-storage)  
- Persistence products, transport, Delivery, AuthN/AuthZ, Edge, APIs, Supabase, React  
- Operational Producer (also absent, but **upstream** of eligibility — see §5)

---

## 4. Immediate Architectural Gap After `UNIT_FORMED`

### 4.1 Central question (Director)

> What responsibility is missing **immediately after** `UNIT_FORMED` and **before** any delivery, persistence, transport, authentication or exposure capability?

### 4.2 Gap statement

```text
UNIT_FORMED  →  ???  →  persistence / transport / authenticated delivery / exposure
```

After II.4, Integration can form a Publication Unit, but still cannot answer:

1. **When** may a formed unit be considered **ready for handoff** into a *later* authorized phase?  
2. How is that readiness distinguished from `UNIT_FORMED`, published, persisted, delivered, authenticated and exposed?  
3. What fail-closed rules refuse handoff readiness without opening Delivery or storage?

This is the same class of “missing middle” that justified II.4 after `ELIGIBLE` — now one step further downstream.

### 4.3 What is **not** the immediate post-`UNIT_FORMED` gap

| Topic | Why not “immediate after UNIT_FORMED” |
|-------|----------------------------------------|
| **Operational Producer / Producer assembly** | Upstream: observe → assemble candidate → II.2/II.3. Important, but does not answer the Director’s central question. |
| **Delivery / Auth / Edge / API** | Parked exposure boundary; collapses many concerns; Director forbids assuming II.5 is Delivery. |
| **Persistence / transport / queues / events** | Mechanisms, not the next governance question after unit formation. |
| **Observability / telemetry** | Named in II.2 parking/logging notes; not required to define the next constitutional control point. |

---

## 5. Category Decomposition

| Category | Exists after II.4? | Candidate for II.5? | Notes |
|----------|--------------------|---------------------|-------|
| **Release / handoff readiness governance** | No | **Strong** | Distinguishes formed unit from later-channel readiness |
| **Publication manifest** | No | Plausible sibling/alt | Declaration/inventory of formed units; must not become storage |
| **Producer governance** | Logical only | Parallel upstream track | Not post-`UNIT_FORMED` |
| **Persistence governance** | No | Later | High creep into DB/buckets |
| **Transport governance** | No | Later | Queues/events/network |
| **Delivery governance** | No | Later (not default II.5) | Authenticated consumer exposure |
| **Access-control boundary** | No | Later with Delivery | AuthN/AuthZ |
| **Consumer projection** | Contract exists | Later | Needs a channel |
| **Observability** | Requirements named | Deferred | Must not leak payloads |
| **Artifact assembly** | Partially done by II.4 unit | Weak as II.5 title | II.4 already binds the unit artifact |

---

## 6. Plausible Alternatives for II.5

### Alternative A — Publication Handoff / Release Readiness Governance

**Thesis:** Define constitutional rules for when a `UNIT_FORMED` Publication Unit may be considered **handoff-ready** (release-ready) for *later* authorized phases — without persisting, transporting, delivering, authenticating or exposing it.

**Pros**

- Answers the Director’s central question directly.  
- Continues incremental pattern: eligible → unit formed → **ready for later handoff**.  
- Explicitly attacks the documented confusion `UNIT_FORMED` ≅ delivered/persisted.  
- Keeps Delivery/Auth/persistence/transport NOT_AUTHORIZED.  
- Lowest scope-creep if hard-fenced like II.4.

**Cons**

- Vocabulary must be fixed carefully (`handoff-ready` / `release-ready` ≠ published/delivered).  
- Must not smuggle persistence or transport under “readiness.”

### Alternative B — Publication Manifest Governance

**Thesis:** Define a non-persistent constitutional **manifest** (declaration/inventory) of formed Publication Units.

**Pros**

- Useful for multi-unit epochs; clarifies “what Integration claims exists as formed.”  
- Still governance, not Delivery.

**Cons**

- Does not by itself answer readiness-for-later-channel.  
- Easy to misread as a storage schema / table design.  
- May be a **sub-concern** of readiness or a later thin block.

### Alternative C — Producer Assembly Governance (non-operational)

**Thesis:** Close the upstream observe→assemble gap.

**Pros**

- Large real hole; fixtures ≠ Factory observation.

**Cons**

- **Fails the central question** (not after `UNIT_FORMED`).  
- High creep into operational Producer.  
- Should remain a **Director-ordered parallel/sibling** track, not default II.5.

### Alternative D — Authenticated Delivery Boundary

**Thesis:** II.5 = II.3’s coarse “Later” delivery box.

**Pros**

- Matches oldest coarse sequence sentence.

**Cons**

- Director forbids assuming this.  
- Skips readiness/manifest middle.  
- Highest scope-creep (Auth, Edge, API, possibly Supabase/React).

### Alternative E — Persistence or Transport Governance

**Thesis:** Govern stores/queues next.

**Pros:** Named in “Later phases” diagrams.  
**Cons:** Mechanism-first; conflates with productization; not the smallest post-`UNIT_FORMED` governance gap.

### Alternative F — Hold / parking-list only

**Thesis:** Wait for Director priority among remaining parking items.

**Pros:** Safest if political priority unclear.  
**Cons:** Discovery already identifies a coherent post-`UNIT_FORMED` governance gap (A).

### Alternative G — Composite “UNIT_FORMED → Delivery” continuum

**Rejected:** violates Integration incremental discipline.

---

## 7. Comparative Analysis (post-`UNIT_FORMED` fit)

| Alternative | Answers central question? | Creep risk | Fit with closed chain |
|-------------|---------------------------|------------|------------------------|
| **A Handoff/Readiness** | **Yes** | Low–Medium | Strong |
| **B Manifest** | Partial | Medium (storage confusion) | Medium |
| **C Producer** | No (upstream) | High | Parallel track |
| **D Delivery** | Wrong layer | Critical | Weak as II.5 default |
| **E Persistence/Transport** | Weak | High | Later |
| **F Hold** | N/A | Low | Optional |

---

## 8. Recommended Alternative for II.5

### Recommendation

**II.5 SHOULD be defined (when the Director authorizes a Specification) as:**

> **Publication Handoff / Release Readiness Governance** — constitutional rules for whether a `UNIT_FORMED` Publication Unit may be considered **handoff-ready** for later authorized phases, without authorizing Delivery, AuthN/AuthZ, Edge, API, Supabase, React, persistence products, transport, queues, events, operational Producer, or Contract v2 changes.

**Primary category:** release/readiness governance  
**Optional related concern (not default title):** publication manifest as a later sub-clause or sibling decision  

### Justification

1. Documentary basis: II.4 hard-separates `UNIT_FORMED` from published/persisted/delivered/authenticated/exposed but leaves **no positive vocabulary** for the next lawful step before those later phases.  
2. Immediate post-`UNIT_FORMED` hole is real and smaller than Delivery.  
3. Pattern continuity with II.3/II.4 (insert governance control points before exposure).  
4. Producer remains important but is **upstream**; selecting it as II.5 would ignore the Director’s central question.  
5. Delivery remains expressly blocked until a later dedicated authorization.

---

## 9. Proposed Scope Envelope for a Future II.5 Specification

*(Envelope only — not a Specification. No APIs, endpoints, JSON schemas, classes, functions, tables, buckets, queues or events.)*

### 9.1 In scope (proposed)

- Objective: handoff / release **readiness** governance after `UNIT_FORMED`.  
- Vocabulary: distinguish `UNIT_FORMED` vs **handoff-ready** vs published / persisted / delivered / authenticated / exposed.  
- Prerequisite: consume II.4 `UNIT_FORMED` (and thus II.3 `ELIGIBLE` / II.2 PASS) without forking those oracles.  
- Fail-closed refusal of readiness when unit is not formed or binding is incoherent.  
- Explicit NOT_AUTHORIZED list (Delivery, Auth, persistence, transport, Producer operativo, etc.).  
- Acceptance criteria for the Specification document only.  
- Conditions before any future II.5-IMPL.

### 9.2 Out of scope (proposed hard fence)

- Operational Producer / live Factory observation runners  
- Delivery / authenticated GET / AuthN / AuthZ / Edge / BFF / APIs  
- Supabase / React / FCC / Marketplace  
- Persistence products, transport, queues, events, brokers  
- Operational logging / telemetry / retention platforms  
- Contract v2 redesign; changes to `readModel/**`, eligibility, or unit semantics  
- Factory Runtime mutation  
- II.5-IMPL and II.6+

---

## 10. Remains Expressly NOT_AUTHORIZED

Until separately authorized beyond this Discovery:

- Delivery / authenticated boundary  
- AuthN / AuthZ  
- Edge / BFF / APIs / endpoints  
- Supabase / React / FCC / Marketplace  
- Operational Producer  
- Persistence products / transport / queues / events  
- Operational observability / retention  
- II.5 Specification (until Director authorizes writing it)  
- II.5-IMPL / II.6+  

---

## 11. Dependencies for a Future II.5 Specification

| Dependency | Requirement |
|------------|-------------|
| **II.1** | Trust law; `INTERNAL_OPS`; no UI-only security |
| **II.2 / II.2-IMPL** | Contract + integrity remain normative |
| **II.3 / II.3-IMPL** | Eligibility oracle unchanged |
| **II.4 / II.4-IMPL** | `UNIT_FORMED` prerequisite; unit binding semantics unchanged |
| **Director decision** | Confirm Alternative A (or choose B/C/D/F) before Specification |
| **Non-dependencies** | Auth, Edge, Supabase, React, Factory Runtime execution, persistence, transport |

II.5 MUST NOT weaken II.1–II.4.

---

## 12. Scope-Creep Risks

| Risk | Severity | Mitigation |
|------|----------|------------|
| Treating II.5 as Delivery/Auth/Edge | Critical | Discovery recommendation fences Delivery out |
| Smuggling persistence/queues under “readiness” or “manifest” | High | Governance-only; mechanisms deferred |
| Smuggling operational Producer under II.5 | High | Producer is separate Director track |
| Equating handoff-ready with published/delivered | Critical | Absolute vocabulary separation required in Spec |
| Reopening Contract v2 / eligibility / unit semantics | High | Consume-only |
| Opening II.5-IMPL from Discovery | High | Status: discovery only |

---

## 13. Terms That Must Be Fixed (Director / future Spec)

| Term | Risk if left loose | Proposed discipline |
|------|--------------------|---------------------|
| **Publication Unit** | Already defined (II.4) | Freeze; do not redefine |
| **UNIT_FORMED** | Confused with delivered | Keep as formation-only |
| **Handoff-ready / release-ready** | New; must not mean delivered | Define only if Alt A chosen |
| **Publishable** | Ambiguous vs eligible/formed/ready | Prefer avoid or define strictly |
| **Published** | Channel act | Remain later / NOT by II.5 |
| **Producer** | Logical vs operational | Keep operational NOT_AUTHORIZED |
| **Artifact** | May imply storage object | Prefer “governance binding” language |
| **Manifest** | May imply DB table | Only if Alt B; non-persistent declaration |
| **Persisted / delivered / exposed / authenticated** | Exposure/storage | Remain NOT_AUTHORIZED under II.5 |

---

## 14. Mentions / Basis in Current Documentation

| Source | Hint about “next” | Sufficiency |
|--------|-------------------|-------------|
| II.3 §8 | Later = authenticated delivery | Coarse; not II.5 definition |
| II.4 Spec / Discovery | Post-unit → persistence/transport/delivery NOT AUTHORIZED | Strong basis for a further middle control point |
| II.4-IMPL status | Warns `UNIT_FORMED` ≠ delivered/persisted | Strong evidence of readiness vocabulary gap |
| II.1 / II.2 PARKING | authenticated GET, Producer, retention, atomic publication (II.4 largely closed) | Decompose; do not auto-pick Delivery |
| Code `publicationUnit` | Stops at formation + `NOT_AUTHORIZED` | Confirms no handoff layer exists |

**Conclusion:** Enough basis to **discover and recommend** II.5’s boundary.  
**Not** enough to write a Specification without Director confirmation of the alternative.

---

## 15. Questions Requiring Director Decision

1. **Confirm Alternative A** (Publication Handoff / Release Readiness Governance) as II.5 Specification title?  
   Or select **B** (Manifest), **C** (Producer assembly track), **D** (Delivery), or **F** (hold)?

2. Preferred vocabulary: **handoff-ready**, **release-ready**, or another Director-approved term — excluding published/delivered?

3. Should **Publication Manifest** be: (a) out of II.5, (b) optional subsection of A, or (c) a separate later block?

4. Ordering: schedule **Producer assembly governance** as II.5 instead of A, or as II.6 / parallel track after A?

5. Confirm Delivery / Auth / Edge / Supabase / React / persistence / transport remain NOT_AUTHORIZED for the entire II.5 Specification phase.

6. After Spec approval, keep the mandatory process: Specification → Audit → Commit → Implementation Plan → Audit → Commit → Implementation authorization?

---

## 16. Can II.5 Be Defined Now?

| Question | Answer |
|----------|--------|
| Enough basis for a Discovery Report? | **Yes** |
| Enough basis for a full II.5 Specification without Director choice? | **No** |
| Enough basis to implement anything? | **No** |
| Enough basis to open II.5-IMPL / II.6? | **No** |

---

## 17. Discovery Verdict

**READY TO DEFINE II.5 WITH DIRECTOR DECISIONS**

Recommended subject for the future Specification (pending Director confirmation):

> **II.5 — Publication Handoff / Release Readiness Governance**  
> (`UNIT_FORMED` → handoff-ready decision; Delivery / Auth / Producer operativo / persistence / transport remain out of scope).

This document does **not** authorize writing the II.5 Specification, any implementation, or any commit.

---

## 18. Documentary Status of This Report

- **II.5 Discovery Report:** CREATED  
- **II.5 Specification:** NOT CREATED / NOT AUTHORIZED by this report  
- **II.5-IMPL:** NOT OPENED  
- **II.6:** NOT OPENED  
- **Code / tests:** UNCHANGED  
- **Commit / push:** NOT PERFORMED  

---

**END OF DISCOVERY REPORT**

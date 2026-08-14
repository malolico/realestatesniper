# STRATEGIC PROGRAM 07 — CONTINUOUS OPERATION
## SP07-P1 — COMBINED WATCH + OPERATIONAL STATE BASELINE CONTRACT FREEZE
### Institutional Watch + Operational State Baseline (documentary · ≠ Grant · ≠ IMPL)
#### Document ID: SP07-P1-WATCH-OPS-STATE-FREEZE-01

| Campo | Valor |
|-------|--------|
| **Document ID** | **`SP07-P1-WATCH-OPS-STATE-FREEZE-01`** |
| **Document type** | **SP07-P1 Combined Watch + Operational State Baseline Contract Freeze** |
| **File ID** | `FACTORY_EVOLUTION_SP07_P1_WATCH_OPERATIONAL_STATE_BASELINE_CONTRACT_FREEZE.md` |
| **Path** | `docs/factory-evolution/FACTORY_EVOLUTION_SP07_P1_WATCH_OPERATIONAL_STATE_BASELINE_CONTRACT_FREEZE.md` |
| **Nature** | Continuity **COMBINED DOCUMENTARY CONTRACT FREEZE** for SP07-P1 · freezes bounded **watch** + **operational-state baseline** + **health evidence** + **observability boundary** · **≠ Grant** · **≠ EXECUTE** · **≠ source IMPL** · **≠ P2** · **≠ Product** · **≠ delivery** · **≠ SP07 COMPLETE** |
| **Program** | **Strategic Program 07 — Continuous Operation** |
| **Phase** | **SP07-P1 — Watch + Operational State Baseline** |
| **Freeze class** | **COMBINED** (Watch + Operational State + Health Evidence + Observability Boundary) |
| **Owned deficits** | **DEF-SP07-01** · **DEF-SP07-02** · **DEF-SP07-05** · **DEF-SP07-10** |
| **Parent Mandate** | `SP07-ENG-IMPL` · Continuity Commit **`79aac1ff7dc44e399cb4b9a18494a4fa7c48f362`** |
| **Parent Plan** | `SP07-02` · Continuity Commit **`fcf96cb64efc9e217a357895725e50445fa94d21`** |
| **Parent Discovery** | `SP07-01` · Continuity Commit **`d1f7e971727b240329b3067a71f04acbef14c55a`** |
| **Parent P1 Pre-IMPL** | Session STRICT READ ONLY · Verdict **PASS WITH OBSERVATIONS** · blockers **NONE** · Freeze **YES** · Grant readiness **NOT READY — FREEZE REQUIRED** |
| **Parent SP06 Complete** | `SP06-COMPLETE-STATUS-01` · Continuity Commit **`257ad8a73d2f74062802e88a586a5952a4e4dbe3`** · **CLOSED / READ-ONLY** |
| **Authorizing Director act** | Director authorization to create and Continuity-publish **only** this documentary Freeze · phrase **`Aprobado. Ejecuta.`** · **NO** Grant · **NO** code · **NO** P2 |
| **Entry tip (pre-publication)** | **`79aac1ff7dc44e399cb4b9a18494a4fa7c48f362`** |
| **Date** | **2026-08-14** |
| **Branch** | `integration/factory-complete-20260725` |
| **Mode** | **DOCUMENTARY FREEZE ONLY** |

```text
SP07-P1-WATCH-OPS-STATE-FREEZE-01
  = DOCUMENTARY CONTRACT ONLY
  = WATCH + OPERATIONAL STATE BASELINE FROZEN

P1 GRANT                    = NOT ISSUED
P1 GRANT READINESS          = READY (fail-closed-only · internal observability park-out)
P1 IMPLEMENTATION AUTHORITY = NONE
P1 IMPLEMENTATION           = NOT STARTED
P1 COMPLETE                 = NO
SP07-P2                     = NOT OPENED
SP07-P3 / P4 / P5           = NOT OPENED
SP08                        = NOT OPENED
SP07-DG-04                  = UNRESOLVED / PARKED OUTSIDE BOUNDED P1 CORE
```

---

## 0. Absolute non-authorization banner

```text
THIS FREEZE DOES NOT AUTHORIZE CODE.

FREEZE PUBLISHED ≠ GRANT
FREEZE PUBLISHED ≠ EXECUTE
FREEZE PUBLISHED ≠ SOURCE MUTATION
FREEZE PUBLISHED ≠ P2 OPEN
FREEZE PUBLISHED ≠ DELIVERY AUTHORIZED
FREEZE PUBLISHED ≠ PRODUCT / MARKETPLACE
FREEZE PUBLISHED ≠ DG FINAL DISPOSITION
FREEZE PUBLISHED ≠ SUPABASE AUTHORITY

IMPLEMENTATION AUTHORITY = NONE
CODE AUTHORITY           = NONE
```

---

## 1. Authority chain (consumed · unchanged)

| Instrument | Posture |
|------------|---------|
| `SP07-ENG-IMPL` | **UNCHANGED** · requires documentary freeze before source IMPL |
| `SP07-02` / Plan Audit | **UNCHANGED** · DEF-01/02/05/10 → P1 CORE |
| `SP07-01` / Discovery Audit | **UNCHANGED** |
| SP07-P1 Pre-IMPL (session) | **CONSUMED** · PASS WITH OBSERVATIONS · COMBINED freeze required |
| `SP06-COMPLETE-STATUS-01` | **CLOSED / READ-ONLY** predecessor |
| `services/factory-observability/` | **ANTECEDENT ONLY** · not mutated · not SP07 authority |
| CB-17 ST-MON watch | **ANTECEDENT ONLY** · not SP07 authority |

---

## 2. P1 purpose (frozen)

| Campo | Binding |
|-------|---------|
| **Phase ID** | **SP07-P1** |
| **Official name** | **Watch + Operational State Baseline** |
| **Purpose** | Establish bounded **watch** contract · **operational-state baseline vocabulary** · **health evidence** contract · **internal-only observability boundary** |
| **Owned deficits** | **DEF-SP07-01** · **DEF-SP07-02** · **DEF-SP07-05** · **DEF-SP07-10** |

**Cross-phase preservation:**

| Deficit / topic | P1 role | Later owner |
|-----------------|---------|-------------|
| **DEF-SP07-05** | Baseline vocabulary + P1 evaluation mapping | **P4** refines failure/recovery transitions |
| **DEF-SP07-06/07/08** | Supporting honesty locks only · no closure | **P2** primary |
| **DEF-SP07-20** | **PARKING / FUTURE** unless dependency proved | — |

**P1 MUST NOT absorb:**

```text
UPDATE · ARCHIVE · RECOVERY · SCALE OUT
Product · Marketplace · Publication delivery · owner/contact action
Factory CB rewrite · CB-17 ST-MON as SP07 authority
```

```text
WATCH ≠ UPDATE
Observation ≠ action
Continuous Operation ≠ Publication delivery
```

---

## 3. Watched subject / object identity (FROZEN)

### 3.1 Institutional watch subject

| Campo | Frozen value |
|-------|--------------|
| **subjectClass** | **`INSTITUTIONAL_OPERATIONAL_CONTINUITY`** |
| **subjectId schema** | **`rsn.operation.watch.subject.v1`** |
| **Canonical subject** | Bounded **Factory-side institutional operability** under constitutional rules — **not** a single expediente · **not** Product deal · **not** Publication unit |

**Minimum subject identity fields:**

| Field | Binding |
|-------|---------|
| `subjectClass` | Always `INSTITUTIONAL_OPERATIONAL_CONTINUITY` |
| `programScope` | **`SP07-P1`** at minimum · must not claim SP08 |
| `constitutionalSpan` | Optional cite of CB phase span (read-only antecedent) · **≠** Factory mutation |
| `predecessorPosture` | **`CONSUME_ONLY`** for SP05/SP06/Factory · **≠** rewrite |

### 3.2 Watched object classes (bounded)

P1 watch evaluates **observation bundles** against the frozen subject. Permitted watched **object classes**:

| Object class | Role |
|--------------|------|
| **`OPERATIONAL_EVIDENCE`** | Bounded factual signals used for health derivation |
| **`DEPENDENCY_SIGNAL`** | Required/read-only dependency reachability (filesystem/registry class only in P1 core) |
| **`GOVERNANCE_SIGNAL`** | Constitutional phase / governance read-only indicators (antecedent pattern only) |
| **`PREDECESSOR_INTEGRITY_SIGNAL`** | Optional integrity cite · **CONDITIONAL** · not canonical P1 root |

**Forbidden watched object classes in P1 core:**

```text
Product entitlement · Marketplace deal · Publication delivery unit
owner/contact payload · Supabase row · user session · payment state
CB-17 ST-MON lifecycle state as SP07 operational state
```

---

## 4. Canonical accepted root / input (FROZEN)

### 4.1 Watch snapshot input identity

| Campo | Frozen value |
|-------|--------------|
| **schemaId** | **`rsn.operation.watch.snapshot.v1`** |
| **version** | **`v1`** |
| **Artifact class** | SP07-P1 canonical watch evaluation input |

**No competing watch input schema may be invented by SP07-P1.**

### 4.2 Required top-level sections

| Section | Binding |
|---------|---------|
| **`meta`** | schemaId · version · observedAt (ISO-8601) · subjectRef |
| **`subject`** | Frozen subject identity per §3 |
| **`evidence`** | Non-empty array of bounded evidence records (§8) |
| **`provenance`** | Observation provenance (§4.4) |
| **`honesty`** | UNKNOWN / conflict / freshness / limitations locks |
| **`dependencies`** | Required dependency signals for P1 core evaluation |

### 4.3 Fail-closed input acceptance

P1 MUST **REFUSE** evaluation when:

| Failure | Result |
|---------|--------|
| Not an object / missing required sections | **REFUSED** → operational state **`FAIL_CLOSED`** |
| Wrong/missing `schemaId` / `version` | **REFUSED** |
| Missing `subject` or invalid `subjectClass` | **REFUSED** |
| Empty `evidence` when evaluation requires evidence | **REFUSED** → **`INSUFFICIENT_EVIDENCE`** or **`FAIL_CLOSED`** per §6 |
| Missing/broken required `provenance` | **REFUSED** |
| Malformed `dependencies` for declared required deps | **REFUSED** |

```text
No synthetic evidence
No provenance repair
No trust upgrade
No silent default to HEALTHY on accept failure
```

### 4.4 Observation provenance (FROZEN)

Every accepted snapshot MUST carry:

| Field | Binding |
|-------|---------|
| `provenance.sourceKind` | **`READ_ONLY_OBSERVATION`** \| **`DERIVED_INTERNAL`** \| **`UNKNOWN`** |
| `provenance.observerId` | Bounded identifier · **≠** user identity · **≠** owner contact |
| `provenance.observedAt` | Same or earlier than `meta.observedAt` |
| `provenance.lineage[]` | Optional bounded cites · no ELR payload |

**Rule:** observation provenance MUST survive unchanged in watch **result** (§7).

### 4.5 Canonical roots explicitly NOT accepted

| Root / input | Classification |
|--------------|----------------|
| **DEC-DOSSIER / SP05 Decision outputs** | **NOT CANONICAL P1 ROOT** |
| **Publication eligibility/unit results** | **NOT CANONICAL P1 ROOT** |
| **Raw Factory ELR as operational payload** | **NOT ACCEPTED** |
| **Product / Marketplace artifacts** | **FORBIDDEN** |
| **Supabase / cloud persisted ops state** | **FORBIDDEN** in P1 core |

Factory / registry **read-only** signals MAY appear inside **`evidence`** or **`dependencies`** when explicitly bounded — **≠** canonical root substitution.

---

## 5. Bounded watch scope (FROZEN)

### 5.1 In-scope (P1 core)

```text
Institutional operability observability under internal-only posture
Meaningful-change detection on bounded evidence dimensions
Operational-state derivation from health evidence rules
Fail-closed refusal on insufficient/uncertain/unavailable conditions
Deterministic repeat evaluation
Material-change visibility (no silent ignore)
```

### 5.2 Out-of-scope (explicit exclusion)

```text
State mutation / update / archive / recovery
External notification / webhook / email
User-facing status / UI / Auth / Edge exposure
Publication delivery / positive ELIGIBLE / FORMED paths
Product / Marketplace / owner contact / transaction action
Supabase / cloud persistence
Scheduling / recurrence automation (DEF-SP07-20 PARKING)
Scale Out / multi-jurisdiction expansion
```

### 5.3 CB-17 / factory-observability antecedent rule

| Antecedent | Binding |
|------------|---------|
| **`src/factory/cb17/watchMode.js`** | **ANTECEDENT ONLY** · Factory ST-MON lifecycle · **MUST NOT** be imported, extended, or cited as SP07 authority |
| **`services/factory-observability/`** | **ANTECEDENT ONLY** · read-only pattern reference · **MUST NOT** be mutated or required as implementation dependency |

P1 MAY implement **similar read-only discipline** in `src/operation/p1/**` without coupling to Integration Block I.1.

---

## 6. Operational state contract (FROZEN)

### 6.1 Canonical vocabulary (exact tokens)

```text
HEALTHY
DEGRADED
BLOCKED
STALE
UNAVAILABLE
FAIL_CLOSED
INSUFFICIENT_EVIDENCE
AUTHORITY_UNCERTAIN
```

**Alias prohibition:** These tokens are **semantically distinct**. Implementations **MUST NOT** collapse:
- `STALE` into `DEGRADED` without explicit dual reporting
- `FAIL_CLOSED` into `BLOCKED` without explicit mapping rule
- `INSUFFICIENT_EVIDENCE` into `AUTHORITY_UNCERTAIN`
- `UNKNOWN` honesty values into any operational state token

Honesty-layer **`UNKNOWN`** remains in `honesty` sections · **≠** operational state token substitution.

### 6.2 Semantic distinctions

| State | Frozen meaning |
|-------|----------------|
| **`HEALTHY`** | Positive **minimum health evidence** satisfied (§8) · required dependencies reachable · no blocking conflict · current evidence defensible · **≠** absence of failure |
| **`DEGRADED`** | Institution remains **observably operable** under bounded rules but **known limitations** exist (non-critical stale slices · partial dependency degradation not blocking core watch) |
| **`BLOCKED`** | Watch evaluation cannot complete on a **required dimension** due to explicit block (conflict-blocked signal · governance block · unsupported required evidence class) |
| **`STALE`** | Evidence **freshness exceeded** configured threshold · may still inform derivation · **freshness ≠ truth** · stale evidence **≠** HEALTHY by itself |
| **`UNAVAILABLE`** | Required **dependency signal** unreachable / missing when required for defended state |
| **`FAIL_CLOSED`** | Terminal refuse-closed posture · unsafe or unsupported continuation · **≠** silent downgrade to DEGRADED |
| **`INSUFFICIENT_EVIDENCE`** | Cannot defend current operational claim · missing required evidence · **≠** HEALTHY default |
| **`AUTHORITY_UNCERTAIN`** | Authority boundary for observation/evaluation is uncertain · **MUST NOT** self-resolve into implementation or HEALTHY |

### 6.3 Reachable under P1

P1 evaluation **MAY emit** any vocabulary token when rules apply.

**P1 primary happy-path targets:** `HEALTHY` · `DEGRADED` · `STALE` · `INSUFFICIENT_EVIDENCE` · `UNAVAILABLE` · `FAIL_CLOSED` · `AUTHORITY_UNCERTAIN` · `BLOCKED`

### 6.4 Deferred to P4 (not defined here)

```text
Recovery transitions · resumption semantics · repeated-failure escalation
Degraded-but-operating policy under SP07-DG-03
Full failure transition graph completion for DEF-SP07-05
Idempotency on repeated watch under failure (DEF-SP07-13 partial)
```

P1 **MAY** emit states that **inform** P4 but **MUST NOT** implement recovery/resumption semantics.

### 6.5 Transition limitations (P1)

| Rule | Binding |
|------|---------|
| **Watch emits derived state only** | **NO persistent mutation** · **NO UPDATE** |
| **No automatic state transition authority** | Observation → derived operational state in **result artifact only** |
| **No self-healing** | P1 MUST NOT upgrade `STALE` → `HEALTHY` without new evidence |
| **Fail-closed precedence** | `FAIL_CLOSED` · `AUTHORITY_UNCERTAIN` · `INSUFFICIENT_EVIDENCE` override optimistic readings when rules trigger |
| **Deterministic mapping** | Same canonical input → same operational state + same meaningful-change flag |

### 6.6 Fail-closed mapping (minimum)

| Condition | Minimum operational state |
|-----------|---------------------------|
| Malformed / unsupported input | **`FAIL_CLOSED`** |
| Missing required evidence | **`INSUFFICIENT_EVIDENCE`** |
| Authority scope uncertain | **`AUTHORITY_UNCERTAIN`** |
| Required dependency unreachable | **`UNAVAILABLE`** |
| Conflict blocks required dimension | **`BLOCKED`** |
| Stale evidence where current state cannot be defended | **`STALE`** or **`INSUFFICIENT_EVIDENCE`** (never **`HEALTHY`**) |
| Stop Rule pressure / unsafe dependency | **`FAIL_CLOSED`** |

---

## 7. Watch result contract (FROZEN)

### 7.1 Result identity

| Campo | Frozen value |
|-------|--------------|
| **schemaId** | **`rsn.operation.watch.result.v1`** |
| **version** | **`v1`** |

### 7.2 Minimum result fields

| Field | Binding |
|-------|---------|
| `meta.schemaId` / `meta.version` | Frozen identity |
| `meta.evaluatedAt` | Deterministic evaluation timestamp from input + rules |
| `inputRef` | Cite accepted snapshot identity · no full upstream payload duplication |
| `operationalState` | One canonical token from §6.1 |
| `healthEvidence` | Health evidence assembly per §8 |
| `meaningfulChange` | **`true`** \| **`false`** \| **`UNKNOWN`** |
| `meaningfulChangeReasons[]` | Bounded codes when true |
| `provenance` | Preserved / propagated from input |
| `honesty` | Preserve UNKNOWN · conflict · freshness · limitations |
| `invariants` | §7.3 |
| `sideEffects` | Always **`NONE`** under P1 |

### 7.3 Critical invariants

```text
WATCH ≠ UPDATE
sideEffects = NONE (always)
delivery = NOT_AUTHORIZED (always)
operationalState = derived only · ≠ persisted mutation
meaningfulChange = true MUST NOT be silent when material rule fires
absence of evidence ≠ HEALTHY
absence of failure ≠ HEALTHY
UNKNOWN ≠ NONE · UNKNOWN ≠ ZERO
freshness ≠ truth
```

---

## 8. Meaningful change (FROZEN)

### 8.1 Definition

**Meaningful change** = a material difference in bounded operational evidence or dependency posture that **MUST NOT be silently ignored** under SP07 continuity rules.

### 8.2 Material change classes (minimum)

| Class | Triggers meaningfulChange = true when |
|-------|----------------------------------------|
| **EVIDENCE_CLASS_SHIFT** | Required evidence class appears/disappears |
| **OPERATIONAL_STATE_SHIFT** | Derived operational state token changes |
| **DEPENDENCY_POSTURE_SHIFT** | Required dependency reachable ↔ unavailable |
| **FRESHNESS_THRESHOLD_CROSS** | Evidence crosses stale threshold |
| **CONFLICT_EMERGENCE** | New blocking conflict on required dimension |
| **AUTHORITY_PRESSURE** | New authority-uncertainty signal |

### 8.3 No meaningful change

When canonical inputs are equivalent under deterministic normalization **and** no material class fires:

| Field | Value |
|-------|-------|
| `meaningfulChange` | **`false`** |
| `operationalState` | **MAY** remain stable |

### 8.4 Repeated / duplicate observation

| Rule | Binding |
|------|---------|
| Duplicate canonical snapshot | **Deterministic identical result** |
| Repeated watch without new evidence | **MAY** emit `meaningfulChange: false` |
| Repeated watch **MUST NOT** create persistent history in P1 core | Archive = **P3** |
| Repeated watch **MUST NOT** trigger side effects | §10 |

---

## 9. Stale / current distinction (FROZEN)

| Concept | Binding |
|---------|---------|
| **Current evidence** | Evidence whose freshness is within configured threshold for its class |
| **Stale evidence** | Evidence exceeding freshness threshold · still reported honestly |
| **STALE operational state** | Emitted when stale condition prevents defended **`HEALTHY`** claim |
| **Rule** | Stale evidence **MAY** support **`DEGRADED`** only when explicit bounded rule permits · **NEVER** sole basis for **`HEALTHY`** |
| **freshness ≠ truth** | Fresh evidence does not automatically upgrade uncertainty |

---

## 10. Side-effect wall (FROZEN)

**WATCH MUST NOT itself cause:**

```text
persistent mutation · notification · email · webhook · external write
Product update · Marketplace update · Publication delivery
owner/contact action · Supabase mutation · cloud mutation
Factory CB mutation · predecessor mutation
```

| Field | Frozen value |
|-------|--------------|
| `sideEffects` on result | **`NONE`** always |
| Persistent store write | **FORBIDDEN** in P1 core |
| External I/O beyond bounded read-only observation | **FORBIDDEN** |

```text
Observation ≠ action
```

---

## 11. Health evidence contract (FROZEN)

### 11.1 Health evidence composition

Health evidence is **both**:

1. **Factual evidence records** in `evidence[]` (raw bounded facts)
2. **Derived health assembly** in result `healthEvidence` (deterministic function of facts + honesty)

### 11.2 Minimum evidence record shape

| Field | Binding |
|-------|---------|
| `evidenceId` | Stable bounded identifier |
| `evidenceClass` | **`REQUIRED`** \| **`OPTIONAL`** \| **`ADVISORY`** |
| `value` | Bounded scalar/object · **≠** owner contact |
| `freshness` | **`CURRENT`** \| **`STALE`** \| **`UNKNOWN`** |
| `truthPosture` | **`ASSERTED`** \| **`UNKNOWN`** \| **`CONFLICT`** |
| `provenance` | Required per evidence record |

### 11.3 Derivation rules

| Rule | Binding |
|------|---------|
| **`HEALTHY` minimum** | All **`REQUIRED`** evidence classes present · **`CURRENT`** or explicitly allowed stale rule · **`truthPosture`** not **`CONFLICT`** on required dims · required dependencies **`REACHABLE`** |
| **Stale evidence** | Downgrades **`HEALTHY`** · **MAY** permit **`DEGRADED`** per explicit rule · **MUST** cite in `healthEvidence.limitations[]` |
| **Conflict on required dim** | **`BLOCKED`** or **`FAIL_CLOSED`** · never **`HEALTHY`** |
| **Unavailable required dependency** | **`UNAVAILABLE`** minimum |
| **UNKNOWN values** | Preserved · **MUST NOT** coerce to zero/none/healthy |

### 11.4 Mandatory honesty locks

```text
UNKNOWN ≠ NONE
UNKNOWN ≠ ZERO
freshness ≠ truth
absence of evidence ≠ HEALTHY
absence of failure ≠ HEALTHY
```

**No silent truth upgrade.**

---

## 12. Observability boundary (FROZEN · DG-04 park-out)

### 12.1 Bounded P1 posture

```text
INTERNAL-ONLY / OPERATOR-DEVELOPER READ-ONLY OBSERVABILITY
```

P1 outputs are for **bounded internal evaluation** and proof harnesses only.

### 12.2 Explicitly excluded (parked outside P1 core)

```text
Product-facing observability
Marketplace-facing observability
customer/user-facing status
Auth entitlement surfaces
Edge/API exposure
UI exposure
delivery exposure
persisted cross-session operational dashboard
```

### 12.3 SP07-DG-04 status

| Gate | Status |
|------|--------|
| **SP07-DG-04** | **UNRESOLVED / PARKED OUTSIDE BOUNDED P1 CORE** |

```text
DG-04 IS NOT RESOLVED BY THIS FREEZE.

P1 proceeds without DG-04 disposition ONLY because all broader surfaces are excluded above.
Any future inclusion of excluded surfaces requires DG-04 disposition BEFORE scope expansion.
```

---

## 13. Stop Rule / fail-closed (FROZEN)

P1 MUST fail-closed under:

| Condition | Minimum posture |
|-----------|-----------------|
| Malformed input | **`FAIL_CLOSED`** · refuse evaluation |
| Insufficient evidence | **`INSUFFICIENT_EVIDENCE`** |
| Authority uncertainty | **`AUTHORITY_UNCERTAIN`** |
| Unavailable required dependency | **`UNAVAILABLE`** |
| Unsupported state / evidence class | **`FAIL_CLOSED`** |
| Stale evidence when current state cannot be defended | **`STALE`** / **`INSUFFICIENT_EVIDENCE`** · never **`HEALTHY`** |
| Stop Rule pressure (Web §20 · Supabase §21 context) | **`FAIL_CLOSED`** · **MUST NOT** weaken Stop Rules |

**Continuous Operation ≠ continue regardless.**

---

## 14. Predecessor boundary (FROZEN)

| Surface | Classification |
|---------|----------------|
| **Factory / CB / ELR** | **OPTIONAL** bounded read-only consumption inside evidence · **FORBIDDEN** mutation |
| **CB-17 ST-MON** | **ANTECEDENT ONLY** |
| **`services/factory-observability/`** | **ANTECEDENT ONLY** |
| **SP05 Decision outputs** | **NOT CANONICAL P1 ROOT** · **FORBIDDEN** mutation |
| **SP06 Publication outputs** | **NOT CANONICAL P1 ROOT** · **FORBIDDEN** mutation |
| **II.3 / II.4** | **ANTECEDENT ONLY** unless explicitly regression-bound |
| **Cloud / Supabase** | **FORBIDDEN** in bounded P1 core |

**No predecessor mutation.**

---

## 15. Source implementation boundary (semantic · NOT CREATED)

### 15.1 Candidate namespace

```text
src/operation/p1/**
```

Exact filenames authorized **only** by later **bounded Grant**.

### 15.2 Candidate implementation classes (CREATE later · Grant-enumerated)

| Class | Purpose |
|-------|---------|
| Watch snapshot contract module | Accept/refuse `rsn.operation.watch.snapshot.v1` |
| Watch evaluator | Emit `rsn.operation.watch.result.v1` |
| Operational-state mapper | Deterministic §6 mapping |
| Health evidence assembler | §8 derivation |
| P1 validator / proof harness | SP07-P1-T01…T25 |

### 15.3 Forbidden mutation surfaces

```text
src/factory/**
services/factory-observability/**
src/publication/**
src/decision/**
Product / Marketplace source surfaces
Supabase / Edge / Auth / Storage surfaces
SP05/SP06 predecessor source (mutation)
```

**No source files are created by this Freeze.**

---

## 16. Supabase boundary (FROZEN)

| Item | Binding |
|------|---------|
| **SUPABASE REQUIRED FOR P1 CORE** | **NO** |
| **SUPABASE AUTHORITY** | **NO** |
| **Future persistence pressure** | Routes to **SP07-DG-01** + separate Director authorization |

**Prohibited in P1 core:** schema · migration · RLS · Edge Function · Storage · Auth change · production DB mutation.

---

## 17. Director gates (record · not resolved)

| Gate | P1 posture |
|------|------------|
| **SP07-DG-04** | **UNRESOLVED / PARKED OUTSIDE BOUNDED P1 CORE** (§12) |
| **SP07-DG-01** | **UNRESOLVED / NOT REQUIRED FOR P1 CORE** |
| **SP07-DG-02** | **UNRESOLVED / NOT REQUIRED FOR P1 WATCH-ONLY CORE** |
| **SP07-DG-03** | **UNRESOLVED / P4 DECISION POINT** |

**SP06-DG-01…04:** preserved independently · **NOT absorbed** · **NOT resolved**.

---

## 18. Proof contract (IDs frozen · not executed)

Stable series: **`SP07-P1-T01`…`SP07-P1-T25`**

| ID | Obligation |
|----|------------|
| **SP07-P1-T01** | Accepted canonical watch snapshot input (`rsn.operation.watch.snapshot.v1`) |
| **SP07-P1-T02** | Malformed / unsupported input → REFUSED · `FAIL_CLOSED` |
| **SP07-P1-T03** | Deterministic repeat — identical input → identical result |
| **SP07-P1-T04** | Meaningful-change detection — material class fires → `meaningfulChange: true` |
| **SP07-P1-T05** | No-change handling — equivalent input → `meaningfulChange: false` |
| **SP07-P1-T06** | Stale-state handling — stale prevents `HEALTHY` · honest `STALE`/`DEGRADED` |
| **SP07-P1-T07** | UNKNOWN preservation — no UNKNOWN→known coercion |
| **SP07-P1-T08** | Conflict handling — required-dimension conflict → `BLOCKED`/`FAIL_CLOSED` · never `HEALTHY` |
| **SP07-P1-T09** | Dependency unavailable — required dep unreachable → `UNAVAILABLE` minimum |
| **SP07-P1-T10** | Authority uncertain — uncertain scope → `AUTHORITY_UNCERTAIN` |
| **SP07-P1-T11** | Fail-closed state — unsafe/unsupported → `FAIL_CLOSED` |
| **SP07-P1-T12** | Health evidence honesty — factual + derived assembly preserved |
| **SP07-P1-T13** | No false HEALTHY inference — absence of evidence/failure ≠ `HEALTHY` |
| **SP07-P1-T14** | Predecessor immutability — no Factory/SP05/SP06 mutation |
| **SP07-P1-T15** | No persistent side effect — `sideEffects: NONE` · no store write |
| **SP07-P1-T16** | Product/Marketplace isolation — no tier/deal/presentation leakage |
| **SP07-P1-T17** | Publication/delivery isolation — delivery NOT_AUTHORIZED · no ELIGIBLE/FORMED path |
| **SP07-P1-T18** | Owner/contact isolation — no disclosure/unlock/outreach dependency |
| **SP07-P1-T19** | No Supabase mutation / cloud persistence in P1 core |
| **SP07-P1-T20** | Stop Rule preservation — fail-closed under Stop Rule pressure |
| **SP07-P1-T21** | SP07-P2 unopened — documentary/proof honesty |
| **SP07-P1-T22** | SP08 unopened — documentary/proof honesty |
| **SP07-P1-T23** | Continuity — institutional watch baseline supports operability claim discipline |
| **SP07-P1-T24** | Authority non-escalation — watch does not grant UPDATE/automation/external action |
| **SP07-P1-T25** | Result schema identity `rsn.operation.watch.result.v1` · invariants §7.3 · internal-only observability |

**Status: DEFINED / NOT EXECUTED**

**Proofs are NOT executed by this Freeze.**

---

## 19. Regression binding (frozen · conditional)

| Suite | P1 binding |
|-------|------------|
| **SP05-P3 P3-G01…G30** | **CONDITIONAL** — only if Decision/dossier surfaces consumed · **NOT REQUIRED** for default P1 core |
| **SP06-P1 T01…T28** | **CONDITIONAL** — only if Publication eligibility surfaces touched · **NOT REQUIRED** for default P1 core |
| **SP06-P2 T01…T33** | **CONDITIONAL** — only if Publication unit surfaces touched · **NOT REQUIRED** for default P1 core |
| **II.3 16-test** | **CONDITIONAL** — if Integration antecedent referenced in implementation |
| **II.4 bounded check** | **CONDITIONAL** — if Integration antecedent referenced |

**Full cross-program matrix reserved for P5** unless P1 implementation explicitly touches predecessor surfaces.

At P1 ITA: bind **light regression matrix** consistent with actual touched surfaces.

---

## 20. CAP / ACC trace (no satisfaction)

| ID | Status under this Freeze |
|----|--------------------------|
| **C-CAP-SP07-01** | **PRIMARY TARGET / NOT SATISFIED** |
| **C-CAP-SP07-02** | **PRIMARY TARGET / NOT SATISFIED** |
| **C-CAP-SP07-03** | **PRESERVE / NOT SATISFIED** |
| **C-CAP-SP07-04** | **ADVANCE (partial) / NOT SATISFIED** |
| **C-CAP-SP07-05** | **NOT APPLICABLE AT P1** |
| **C-CAP-SP07-06** | **PRESERVE / NOT SATISFIED** |
| **C-CAP-SP07-07** | **NOT APPLICABLE AT P1** |
| **C-ACC-SP07-01** | **PRESERVE / NOT SATISFIED** |
| **C-ACC-SP07-02** | **PRIMARY TARGET / NOT SATISFIED** |
| **C-ACC-SP07-03…09** | **PRESERVE / NOT SATISFIED** |

```text
Freeze SUPPORTS future proof · does NOT satisfy CAP/ACC.
```

---

## 21. Blockers

| Class | Finding |
|-------|---------|
| **BLOCKER** | **NONE** |

Semantic contract is bounded and internally consistent under park-out posture.

---

## 22. Readiness (upon Continuity publication)

| Gate | Status |
|------|--------|
| **FREEZE STATUS** | **FROZEN / COMPLETE** |
| **GRANT READINESS** | **READY** |
| **IMPLEMENTATION AUTHORITY** | **NO** |

Grant readiness **READY** because: contract unambiguous · proof series sufficient · DG-04 park-out explicit · Supabase excluded · source boundary bounded · blockers NONE.

```text
GRANT READINESS = READY ≠ GRANT ISSUED
IMPLEMENTATION AUTHORITY requires Grant + Director EXECUTE
```

---

## 23. Observation honesty (no remediation)

| ID | Classification |
|----|----------------|
| OBS-SP07-DISC-AUD-01…07 | **RECORD / DESIGN CONSTRAINT** |
| OBS-SP07-PLAN-AUD-01…07 | **RECORD / DESIGN CONSTRAINT** |
| OBS-P1-AUD-01…07 (session) | **RECORD / DESIGN CONSTRAINT** |
| DEF-SP07-20 | **PARKING / FUTURE** |

---

## Binding footer

```text
SP07-P1-WATCH-OPS-STATE-FREEZE-01
  = Combined Watch + Operational State Baseline Contract Freeze

FROZEN: watch snapshot/result · operational state vocabulary · health evidence
        meaningful change · observability internal-only park-out · proof IDs
        side-effect wall · predecessor boundary · source namespace candidate

≠ GRANT · ≠ EXECUTE · ≠ CODE · ≠ SUPABASE
≠ DG-04 RESOLUTION · ≠ P2 OPEN · ≠ SP08 OPEN
delivery = NOT_AUTHORIZED
WATCH ≠ UPDATE
```

**END OF SP07-P1-WATCH-OPS-STATE-FREEZE-01**

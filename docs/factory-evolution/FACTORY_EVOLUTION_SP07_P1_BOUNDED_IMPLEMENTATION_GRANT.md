# STRATEGIC PROGRAM 07 — CONTINUOUS OPERATION
## SP07-P1 — BOUNDED IMPLEMENTATION GRANT
### Watch + Operational State Baseline — Exact writable surfaces + execution contract (≠ code)

| Campo | Valor |
|-------|--------|
| **Document ID** | **`SP07-P1-GRANT`** |
| **Grant ID** | **`DAG-SP07-P1-G1`** |
| **File ID** | `FACTORY_EVOLUTION_SP07_P1_BOUNDED_IMPLEMENTATION_GRANT.md` |
| **Path** | `docs/factory-evolution/FACTORY_EVOLUTION_SP07_P1_BOUNDED_IMPLEMENTATION_GRANT.md` |
| **Nature** | Bounded **Director Grant** — Continuity-records exact mutable operation-side surfaces and authorized technical purpose for **future** SP07-P1 watch + operational-state baseline implementation · **≠ code in this file** · **≠ implementation by publication** · **≠ Director EXECUTE** · **≠ UPDATE/ARCHIVE/RECOVERY** · **≠ P2/P3/P4/P5** · **≠ Product / Marketplace / SP08** |
| **Program** | **Strategic Program 07 — Continuous Operation** |
| **Phase** | **SP07-P1 — Watch + Operational State Baseline** (internal-only · side-effect-free) |
| **Parent Mandate** | `SP07-ENG-IMPL` · Continuity Commit **`79aac1ff7dc44e399cb4b9a18494a4fa7c48f362`** · **UNCHANGED** |
| **Parent Plan** | `SP07-02` · Continuity Commit **`fcf96cb64efc9e217a357895725e50445fa94d21`** · **UNCHANGED** |
| **Parent Discovery** | `SP07-01` · Continuity Commit **`d1f7e971727b240329b3067a71f04acbef14c55a`** · **UNCHANGED** |
| **Parent P1 Pre-IMPL** | Session STRICT READ ONLY · **PASS WITH OBSERVATIONS** · **UNCHANGED** |
| **Parent P1 Freeze** | `SP07-P1-WATCH-OPS-STATE-FREEZE-01` · Continuity Commit **`d3bcdc5e8b3453b69177d576fbad62eac06a8f9f`** · **BINDING** |
| **Parent SP06 Complete** | `SP06-COMPLETE-STATUS-01` · **CLOSED / READ-ONLY** |
| **Grant-readiness** | Freeze **FROZEN / COMPLETE** · blockers **NONE** · **P1 GRANT READINESS = READY** |
| **Authorizing Director act** | Director authorization to create and Continuity-publish **only** this bounded Grant · phrase **`Aprobado. Ejecuta.`** (Grant publication) · **≠ EXECUTE** for source |
| **Entry tip (pre-publication)** | **`d3bcdc5e8b3453b69177d576fbad62eac06a8f9f`** |
| **Date** | **2026-08-14** |
| **Branch** | `integration/factory-complete-20260725` |
| **Mode** | **DOCUMENTARY AUTHORITY ONLY** |

```text
DAG-SP07-P1-G1
  = Bounded Grant for SP07-P1 Watch + Operational State Baseline ONLY
  = INTERNAL-ONLY · sideEffects = NONE · WATCH ≠ UPDATE
  = Exact writable file freeze + proof/execution contract
  = Controls = SP07-P1-WATCH-OPS-STATE-FREEZE-01

GRANT PUBLISHED ≠ CODE AUTHORIZED
GRANT PUBLISHED ≠ IMPLEMENTATION STARTED
GRANT PUBLISHED ≠ DIRECTOR EXECUTE

IMPLEMENTATION AUTHORITY = NO — PENDING EXPLICIT DIRECTOR EXECUTE
CODE AUTHORITY           = NONE UNTIL EXPLICIT DIRECTOR EXECUTE

Required Director authorization phrase before any code mutation:
  Aprobado. Ejecuta.
```

---

## 0. Absolute non-authorization banner

| Surface | Under this Grant publication alone |
|---------|-------------------------------------|
| Operation / Factory / Publication / Decision code | **NOT AUTHORIZED** |
| `src/operation/p1/**` creation | **NOT AUTHORIZED** until Director EXECUTE |
| Test / fixture mutation outside Grant | **NOT AUTHORIZED** until Director EXECUTE |
| Persistent mutation / external side effects | **FORBIDDEN** |
| SP07-P2 / P3 / P4 / P5 | **NOT OPENED** |
| SP07-DG-01…04 final disposition | **NOT PERFORMED** |
| SP08 | **NOT OPENED** |
| Product / Marketplace / Supabase | **ZERO AUTHORITY** |

```text
THIS GRANT NARROWS AUTHORITY.
IT MUST NOT BROADEN THE MANDATE OR FREEZE.
THIS GRANT ≠ EXECUTE.
THIS GRANT ≠ OPEN P2.
THIS GRANT ≠ RESOLVE DG-04.
```

---

## 1. Subordination (binding)

| Instrument | Posture |
|------------|---------|
| **SP07-ENG-IMPL** | **UNCHANGED** · controlling engineering class |
| **SP07-02 / SP07-01** | **UNCHANGED** |
| **SP07-P1-WATCH-OPS-STATE-FREEZE-01** @ `d3bcdc5…` | **BINDING** contract |
| **SP06-COMPLETE-STATUS-01** | **CLOSED / READ-ONLY** |
| **`services/factory-observability/`** | **ANTECEDENT ONLY** · not mutated |
| **CB-17 ST-MON** | **ANTECEDENT ONLY** |
| **SP07-DG-04** | **UNRESOLVED / PARKED OUTSIDE P1 CORE** |
| **SP07-DG-01** | **UNRESOLVED / NOT REQUIRED FOR P1 CORE** |
| **SP07-DG-02** | **UNRESOLVED / NOT REQUIRED FOR WATCH-ONLY CORE** |
| **SP07-DG-03** | **UNRESOLVED / P4 DECISION POINT** |
| **SP06-DG-01…04** | **PRESERVED** · not absorbed |

```text
GRANT ≠ AMEND PARENTS
GRANT ≠ REOPEN / REWRITE FREEZE
GRANT ≠ RESOLVE DG-01..04
GRANT ≠ OPEN P2 / P3 / P4 / P5 / SP08
GRANT ≠ INVENT SEMANTICS BEYOND FREEZE
```

---

## 2. Grant purpose (frozen)

Authorize, **subject to later explicit Director EXECUTE**, the **minimum** operation-side code surfaces necessary to establish:

1. bounded watch snapshot accept / structural refuse for `rsn.operation.watch.snapshot.v1`;
2. deterministic watch evaluation emitting `rsn.operation.watch.result.v1`;
3. operational-state mapping per frozen vocabulary §6;
4. health evidence assembly with mandatory honesty locks §7;
5. meaningful-change detection · **`sideEffects: NONE`** always;
6. SP07-P1-T01…T25 proof harness obligations (§11).

**Owned deficits (after EXECUTE):** DEF-SP07-01 · DEF-SP07-02 · DEF-SP07-05 · DEF-SP07-10.

```text
P1 PURPOSE
  = bounded watch + operational-state baseline evaluation
  = INTERNAL-ONLY observability · side-effect-free
  ≠ UPDATE · ≠ ARCHIVE · ≠ RECOVERY
  ≠ Publication delivery · ≠ Product / Marketplace
  ≠ owner disclosure / contact / outreach
  ≠ Supabase / cloud persistence
  ≠ SP07-P2 / P3 / P4 / P5 / SP08
```

---

## 3. Contract binding (binding)

Subordinate to **`SP07-P1-WATCH-OPS-STATE-FREEZE-01`** without amendment.

### 3.1 Subject identity

| Campo | Frozen value |
|-------|--------------|
| **subjectClass** | **`INSTITUTIONAL_OPERATIONAL_CONTINUITY`** |
| **subject schema** | **`rsn.operation.watch.subject.v1`** |

### 3.2 Canonical input

| Campo | Frozen value |
|-------|--------------|
| **schemaId** | **`rsn.operation.watch.snapshot.v1`** |
| **version** | **`v1`** |
| **Required top-level** | **`meta` · `subject` · `evidence` · `provenance` · `honesty` · `dependencies`** |
| **Posture** | Sole accepted bounded SP07-P1 watch evaluation root |

Structural / provenance / dependency failure → **REFUSED** → operational state **`FAIL_CLOSED`** or mapped refuse state per Freeze §4.3 / §6.6.

**NOT canonical roots:** DEC-DOSSIER · Publication results · raw ELR · Product/Marketplace · Supabase.

### 3.3 Canonical result

| Campo | Frozen value |
|-------|--------------|
| **schemaId** | **`rsn.operation.watch.result.v1`** |
| **version** | **`v1`** |
| **`operationalState`** | One token from §6 vocabulary |
| **`meaningfulChange`** | **`true`** \| **`false`** \| **`UNKNOWN`** |
| **`sideEffects`** | Always **`NONE`** |
| **`delivery`** | **NOT_AUTHORIZED** (invariant) |

```text
WATCH ≠ UPDATE
observation ≠ action
sideEffects = NONE (always)
```

---

## 4. Operational state binding (binding)

Implementation **MAY** emit **only** these frozen tokens:

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

| Rule | Binding |
|------|---------|
| **Alias collapse** | **FORBIDDEN** |
| **P4 recovery graph** | **NOT AUTHORIZED** |
| **DG-03 degradation policy** | **NOT INVENTED** |
| **Persistent state transition** | **FORBIDDEN** — derived result only |
| **Deterministic mapping** | Same canonical input → same operational state + meaningfulChange |

Fail-closed minimum mapping per Freeze §6.6 applies.

---

## 5. Health honesty (binding)

Mandatory locks — implementation **MUST** preserve:

```text
UNKNOWN ≠ NONE
UNKNOWN ≠ ZERO
freshness ≠ truth
absence of evidence ≠ HEALTHY
absence of failure ≠ HEALTHY
```

| Rule | Binding |
|------|---------|
| **`HEALTHY`** | Requires **positive minimum health evidence** per Freeze §8 / §11 |
| **Silent truth upgrade** | **FORBIDDEN** |
| **Stale evidence** | **MUST NOT** sole-basis **`HEALTHY`** |
| **Conflict on required dim** | **`BLOCKED`** or **`FAIL_CLOSED`** · never **`HEALTHY`** |

---

## 6. Observability / side-effect walls (binding)

### 6.1 Authorized observability posture

```text
INTERNAL-ONLY / OPERATOR-DEVELOPER READ-ONLY
```

### 6.2 Explicitly forbidden

```text
Product · Marketplace · user-facing health/status
Auth · Edge/API exposure · UI
Publication delivery · persisted cross-session dashboard
owner/contact · external notifications/actions
```

**SP07-DG-04:** **UNRESOLVED / PARKED OUTSIDE P1 CORE** — not resolved by this Grant.

### 6.3 Side-effect prohibition

Implementation **MUST NOT** cause:

```text
persistent writes · notifications · email · webhook · external IO side effects
Product mutation · Marketplace mutation · Publication delivery
owner/contact action · Supabase mutation · cloud mutation
Factory / predecessor mutation
```

Observation remains **side-effect free**.

---

## 7. Predecessor wall (binding)

**No mutation** to:

```text
src/factory/**
services/factory-observability/**
src/publication/**
src/decision/**
SP05/SP06 source
Integration antecedents (II.3 / II.4)
```

| Antecedent | Binding |
|------------|---------|
| **CB-17 ST-MON** | **ANTECEDENT ONLY** · must not import as SP07 authority |
| **`factory-observability`** | **ANTECEDENT ONLY** · read-only pattern reference only |

P1 **MAY** consume bounded read-only evidence inside snapshot input · **MUST NOT** mutate predecessors.

---

## 8. Supabase boundary (binding)

| Item | Binding |
|------|---------|
| **SUPABASE AUTHORITY** | **NONE** |
| **Schema / migration / RLS / Edge / Storage / Auth / DB write** | **FORBIDDEN** |
| **Cloud persistence** | **FORBIDDEN** in P1 core |
| **Future need** | Routes to **SP07-DG-01** |

---

## 9. Exact writable files (frozen)

**No broad directory write authorization.** Creating parent directories is incidental to creating the enumerated files only.

### 9.1 REQUIRED writable surfaces

| PATH | NEW / EXISTING | PURPOSE | AUTHORIZED MUTATION TYPE |
|------|----------------|---------|--------------------------|
| `src/operation/p1/operationWatchContract.js` | **NEW** | Frozen constants: subject/snapshot/result schema IDs · operational-state tokens · honesty locks · accept-gate shape classes for `rsn.operation.watch.snapshot.v1` / `rsn.operation.watch.result.v1` | **CREATE** (post-EXECUTE) |
| `src/operation/p1/operationWatchEvaluator.js` | **NEW** | Accept/refuse watch snapshot · deterministic operational-state mapping · health evidence assembly · meaningful-change detection · emit derived result with **`sideEffects: NONE`** · **no persistent mutation** | **CREATE** (post-EXECUTE) |
| `src/operation/p1/validateOperationWatchBaseline.js` | **NEW** | P1 proof harness implementing §11 obligations **`SP07-P1-T01…T25`** | **CREATE** (post-EXECUTE) |

**Minimum coherent file count:** **3**.

**Responsibility split (binding):**

| File | Owns |
|------|------|
| **`operationWatchContract.js`** | Schema identity · state vocabulary · invariant constants · input/output structural gates (no evaluation logic) |
| **`operationWatchEvaluator.js`** | All deterministic evaluation: accept/refuse · state map · health derivation · meaningful change · result emission |
| **`validateOperationWatchBaseline.js`** | Executable proofs T01–T25 · fixtures · regression hooks per §12 |

Operational-state mapping and health evidence assembly **MUST NOT** be split into additional Grant files without a new Grant amendment.

### 9.2 OPTIONAL writable surfaces

| PATH | NEW / EXISTING | PURPOSE | AUTHORIZED MUTATION TYPE |
|------|----------------|---------|--------------------------|
| `src/operation/p1/index.js` | **NEW** | Thin barrel re-export of §9.1 surfaces | **CREATE** only if EXECUTE needs a single import seam |

Optional file must not add semantics beyond re-export of §9.1 surfaces.

### 9.3 Explicitly NOT writable

| Surface | Binding |
|---------|---------|
| Any path outside §9.1 / §9.2 | **STOP** |
| `src/factory/**` | **FORBIDDEN** |
| `services/factory-observability/**` | **FORBIDDEN** |
| `src/publication/**` | **FORBIDDEN** |
| `src/decision/**` | **FORBIDDEN** |
| `src/integration/**` | **FORBIDDEN** (antecedent — **READ ONLY**) |
| Product / Marketplace / Supabase surfaces | **FORBIDDEN** |
| `src/operation/p2/**` or other operation phases | **NOT OPENED** |

---

## 10. Required behavior (binding)

Future implementation **MUST**:

- evaluate deterministically (same semantic input → same semantic result);
- fail-closed on contract-invalid input per Freeze §4.3 / §6.6;
- emit **`sideEffects: NONE`** on every result;
- emit **new derived** watch result only · **no UPDATE**;
- map operational state using frozen vocabulary only;
- detect meaningful change per Freeze §8;
- preserve observation provenance in results;
- preserve UNKNOWN · conflict · freshness · limitations;
- **never** infer **`HEALTHY`** from absence of evidence or absence of failure;
- **not** mutate Factory / SP05 / SP06 / Integration / factory-observability surfaces;
- **not** perform persistent writes or external IO side effects;
- **not** expose user-facing / Product / Marketplace / delivery surfaces.

Technical success requires **all** §11 proofs **PASS**.

---

## 11. Proof contract (binding · NOT EXECUTED)

Stable series: **`SP07-P1-T01`…`SP07-P1-T25`** — **DEFINED / NOT EXECUTED** at Grant publication.

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
| **SP07-P1-T25** | Result schema identity `rsn.operation.watch.result.v1` · invariants · internal-only observability |

```text
Proof status at Grant publication = DEFINED / NOT EXECUTED
All 25 proofs MUST PASS before implementation is technically successful
Proof series MUST NOT be weakened or renumbered
Execution requires Director EXECUTE + bounded implementation block
```

---

## 12. Regression binding (conditional · preserved from Freeze)

| Suite | P1 binding |
|-------|------------|
| **SP05-P3 P3-G01…G30** | **CONDITIONAL** — only if Decision/dossier surfaces consumed |
| **SP06-P1 T01…T28** | **CONDITIONAL** — only if Publication eligibility surfaces touched |
| **SP06-P2 T01…T33** | **CONDITIONAL** — only if Publication unit surfaces touched |
| **II.3 16-test** | **CONDITIONAL** — if Integration antecedent referenced |
| **II.4 bounded check** | **CONDITIONAL** — if Integration antecedent referenced |

```text
Do not execute or require unrelated predecessor suites
unless authorized implementation actually touches/consumes those surfaces
Full cross-program matrix = P5 responsibility
```

---

## 13. CAP / ACC trace (no satisfaction)

| ID | Grant posture |
|----|---------------|
| **C-CAP-SP07-01** | **PRIMARY TARGET / NOT SATISFIED** |
| **C-CAP-SP07-02** | **PRIMARY TARGET / NOT SATISFIED** |
| **C-CAP-SP07-03** | **PRESERVE / NOT SATISFIED** |
| **C-CAP-SP07-04** | **ADVANCE (partial) / NOT SATISFIED** |
| **C-CAP-SP07-06** | **PRESERVE / NOT SATISFIED** |
| **C-ACC-SP07-01** | **PRESERVE / NOT SATISFIED** |
| **C-ACC-SP07-02** | **PRIMARY TARGET / NOT SATISFIED** |

```text
Grant publication satisfies NONE of CAP/ACC.
```

---

## 14. Blockers

| Class | Finding |
|-------|---------|
| **BLOCKER** | **NONE** |

Exact bounded source authority issued without contradiction.

---

## 15. Grant authority limit

```text
GRANT PUBLICATION ≠ SOURCE EXECUTION

After Grant publication:
  IMPLEMENTATION AUTHORITY = NO — PENDING EXPLICIT DIRECTOR EXECUTE
  CODE AUTHORITY           = NONE

Until Director proceeds to explicit EXECUTE:
  Aprobado. Ejecuta.
```

---

## 16. Exact next gate

```text
NEXT GATE:
  DIRECTOR EXECUTE — SP07-P1 BOUNDED SOURCE IMPLEMENTATION
  (under DAG-SP07-P1-G1 exact surfaces only)

≠ P2 / P3 / P4 / P5
≠ Grant reinterpretation
≠ Supabase
≠ DG resolution
```

---

## Binding footer

```text
SP07-P1-GRANT / DAG-SP07-P1-G1
  = Watch + Operational State Baseline bounded implementation Grant
  = rsn.operation.watch.snapshot.v1 → rsn.operation.watch.result.v1
  = sideEffects NONE · WATCH ≠ UPDATE · internal-only observability
  = src/operation/p1/ exact 3-file core (+ optional index)
  = SP07-P1-T01…T25 DEFINED / NOT EXECUTED

≠ CODE · ≠ EXECUTE · ≠ P2 · ≠ PRODUCT · ≠ SUPABASE
≠ DG-04 RESOLUTION

PRE-LAUNCH LEGAL REVIEW REQUIRED (future production)
SP06 = COMPLETE · CLOSED
SP08 = NOT OPENED
```

**END OF SP07-P1-GRANT / DAG-SP07-P1-G1**

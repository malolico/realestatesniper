# STRATEGIC PROGRAM 07 — CONTINUOUS OPERATION
## SP07-P2 — MINIMUM SOURCE GRANT
### Bounded Update + Honesty Continuity — Exact writable surfaces + execution contract (≠ code)

| Campo | Valor |
|-------|--------|
| **Document ID** | **`SP07-P2-GRANT`** |
| **Grant ID** | **`DAG-SP07-P2-G1`** |
| **File ID** | `FACTORY_EVOLUTION_SP07_P2_BOUNDED_IMPLEMENTATION_GRANT.md` |
| **Path** | `docs/factory-evolution/FACTORY_EVOLUTION_SP07_P2_BOUNDED_IMPLEMENTATION_GRANT.md` |
| **Nature** | Bounded **Director Grant** — Continuity-records exact mutable operation-side surfaces and authorized technical purpose for **future** SP07-P2 update evaluation + derived-result implementation · **≠ code in this file** · **≠ implementation by publication** · **≠ Director EXECUTE** · **≠ persistence/automation** · **≠ P3/P4/P5** · **≠ Product / Marketplace / SP08** |
| **Program** | **Strategic Program 07 — Continuous Operation** |
| **Phase** | **SP07-P2 — Bounded Update + Honesty Continuity** (deterministic-internal-only · side-effect-free) |
| **Parent Mandate** | `SP07-ENG-IMPL` · Continuity Commit **`79aac1ff7dc44e399cb4b9a18494a4fa7c48f362`** · **UNCHANGED** |
| **Parent Plan** | `SP07-02` · Continuity Commit **`fcf96cb64efc9e217a357895725e50445fa94d21`** · **UNCHANGED** |
| **Parent Discovery** | `SP07-01` · Continuity Commit **`d1f7e971727b240329b3067a71f04acbef14c55a`** · **UNCHANGED** |
| **Parent P1 Complete** | `SP07-P1-COMPLETE-STATUS-01` · Continuity Commit **`255d2bfdfdd1b88042de227f75caa5d428ab75ac`** · **CLOSED / READ-ONLY** |
| **Parent P2 Freeze** | `SP07-P2-UPDATE-HONESTY-FREEZE-01` · Continuity Commit **`c326082f120d2f92365c0f5525a235eca81f801d`** · **BINDING** |
| **Parent P2 Pre-IMPL** | Session STRICT READ ONLY · **PASS WITH OBSERVATIONS** · **UNCHANGED** |
| **Grant-readiness** | Freeze **FROZEN / COMPLETE** · blockers **NONE** · **P2 GRANT READINESS = READY** |
| **Authorizing Director act** | Director authorization to create and Continuity-publish **only** this bounded Grant · phrase **`Aprobado. Ejecuta.`** (Grant publication) · **≠ EXECUTE** for source |
| **Entry tip (pre-publication)** | **`c326082f120d2f92365c0f5525a235eca81f801d`** |
| **Date** | **2026-08-14** |
| **Branch** | `integration/factory-complete-20260725` |
| **Mode** | **DOCUMENTARY AUTHORITY ONLY** |

```text
DAG-SP07-P2-G1
  = Minimum Source Grant for SP07-P2 Bounded Update + Honesty Continuity ONLY
  = WATCH ≠ UPDATE · sideEffects = NONE · delivery = NOT_AUTHORIZED
  = Exact writable file freeze + proof/execution contract
  = Controls = SP07-P2-UPDATE-HONESTY-FREEZE-01

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
| `src/operation/p2/**` creation | **NOT AUTHORIZED** until Director EXECUTE |
| `src/operation/p1/**` | **FORBIDDEN** |
| Persistent mutation / automated transition | **FORBIDDEN** |
| SP07-P3 / P4 / P5 | **NOT OPENED** |
| SP07-DG-01…04 final disposition | **NOT PERFORMED** |
| SP08 | **NOT OPENED** |
| Product / Marketplace / Supabase | **ZERO AUTHORITY** |

```text
THIS GRANT NARROWS AUTHORITY.
IT MUST NOT BROADEN THE MANDATE OR FREEZE.
THIS GRANT ≠ EXECUTE.
THIS GRANT ≠ OPEN P3.
THIS GRANT ≠ RESOLVE DG-02.
```

---

## 1. Subordination (binding)

| Instrument | Posture |
|------------|---------|
| **SP07-ENG-IMPL** | **UNCHANGED** |
| **SP07-02 / SP07-01** | **UNCHANGED** |
| **SP07-P2-UPDATE-HONESTY-FREEZE-01** @ `c326082…` | **BINDING** contract |
| **SP07-P1 Complete / Freeze / Grant / IMPL** | **CLOSED / READ-ONLY PREDECESSOR** |
| **SP06-COMPLETE-STATUS-01** | **CLOSED / READ-ONLY** |
| **SP07-DG-01** | **UNRESOLVED / NOT REQUIRED FOR P2 CORE** |
| **SP07-DG-02** | **UNRESOLVED / PARKED OUTSIDE P2 CORE** |
| **SP07-DG-03** | **UNRESOLVED / P4** |
| **SP07-DG-04** | **UNRESOLVED / PARKED OUTSIDE P2 CORE** |

```text
GRANT ≠ AMEND PARENTS
GRANT ≠ REOPEN / REWRITE FREEZE
GRANT ≠ RESOLVE DG-01..04
GRANT ≠ OPEN P3 / P4 / P5 / SP08
GRANT ≠ INVENT SEMANTICS BEYOND FREEZE
GRANT ≠ MUTATE P1
```

---

## 2. Grant purpose (frozen)

Authorize, **subject to later explicit Director EXECUTE**, the **minimum** operation-side code surfaces necessary to establish:

1. P2 contract/result definitions for **`rsn.operation.update.result.v1`** (and frozen candidate **`rsn.operation.update.candidate.v1`**);
2. deterministic evaluation of canonical predecessor + canonical candidate;
3. bounded derived update-result formation (`updateDisposition` per Freeze §7);
4. honesty-continuity enforcement (Freeze §10);
5. proof harness **SP07-P2-T01…T23**.

**Owned deficits (after EXECUTE):** DEF-SP07-03 · DEF-SP07-06 · DEF-SP07-07 · DEF-SP07-08 · DEF-SP07-13 (partial). **DEF-SP07-16** = DG-02 park only.

```text
P2 PURPOSE
  = bounded deterministic UPDATE evaluation + derived result
  = honesty continuity over closed P1 watch/state baseline
  ≠ WATCH rewrite · ≠ ARCHIVE · ≠ RECOVERY
  ≠ automated transition · ≠ persistent mutation
  ≠ Publication delivery · ≠ Product / Marketplace
  ≠ owner disclosure / contact / outreach
  ≠ Supabase / cloud persistence
  ≠ SP07-P3 / P4 / P5 / SP08
```

---

## 3. Contract binding (binding)

Subordinate to **`SP07-P2-UPDATE-HONESTY-FREEZE-01`** without amendment.

| Artifact | Frozen schema |
|----------|---------------|
| **Subject** | **`rsn.operation.watch.subject.v1`** · `INSTITUTIONAL_OPERATIONAL_CONTINUITY` |
| **Predecessor** | **`rsn.operation.watch.result.v1`** · **CONSUME_ONLY** |
| **Candidate** | **`rsn.operation.update.candidate.v1`** |
| **Result** | **`rsn.operation.update.result.v1`** |

```text
WATCH ≠ UPDATE
sideEffects = NONE (always)
delivery = NOT_AUTHORIZED (always · negative marker)
P1 mutation = FORBIDDEN
```

**`updateDisposition` tokens:** `NO_MEANINGFUL_UPDATE` · `BOUNDED_EVOLUTION_RECOGNIZED` · `HONESTY_BLOCKS_EVOLUTION` · `FAIL_CLOSED`

Operational state, if emitted, **P1 vocabulary only**.

---

## 4. Exact writable files (frozen)

**No broad directory write authorization.** Creating parent directories is incidental to creating the enumerated files only.

### 4.1 REQUIRED writable surfaces

| PATH | NEW / EXISTING | PURPOSE | AUTHORIZED MUTATION TYPE |
|------|----------------|---------|--------------------------|
| `src/operation/p2/operationUpdateContract.js` | **NEW** | Frozen constants: subject/predecessor/candidate/result schema IDs · `updateDisposition` tokens · honesty locks · P1 operational-state token reuse (import or restated constants; **no P1 file mutation**) | **CREATE** (post-EXECUTE) |
| `src/operation/p2/operationUpdateEvaluator.js` | **NEW** | Accept/refuse predecessor+candidate · deterministic evaluation · honesty continuity · emit `rsn.operation.update.result.v1` with **`sideEffects: NONE`** · **no persistent mutation** · **no automated transition** | **CREATE** (post-EXECUTE) |
| `src/operation/p2/validateOperationUpdateHonesty.js` | **NEW** | P2 proof harness implementing §8 obligations **`SP07-P2-T01…T23`** plus mandatory P1 regression invocation | **CREATE** (post-EXECUTE) |

**Minimum coherent file count:** **3**.

P2 **MAY** import P1 contract **read-only** (`src/operation/p1/operationWatchContract.js` and/or evaluator **as consume-only modules**). Import ≠ mutation.

### 4.2 Explicitly NOT writable

| Surface | Binding |
|---------|---------|
| Any path outside §4.1 | **STOP** |
| `src/operation/p1/**` | **FORBIDDEN** (CLOSED / READ-ONLY) |
| `src/factory/**` | **FORBIDDEN** |
| `src/decision/**` | **FORBIDDEN** |
| `src/publication/**` | **FORBIDDEN** |
| `services/factory-observability/**` | **FORBIDDEN** |
| `src/integration/**` | **FORBIDDEN** |
| Product / Marketplace / frontend / delivery | **FORBIDDEN** |
| Supabase / DB / migration / SQL / RLS / Edge / Auth / Storage | **FORBIDDEN** |
| owner/contact / transaction/brokerage / SP08 surfaces | **FORBIDDEN** |
| `src/operation/p3/**` or later phases | **NOT OPENED** |

No optional `index.js` is authorized by this Grant.

---

## 5. Honesty locks (binding)

```text
UNKNOWN ≠ NONE ≠ ZERO
freshness ≠ truth
stale ≠ false
absence of evidence ≠ HEALTHY
absence of failure ≠ HEALTHY
```

Implementation **MUST** prevent: silent UNKNOWN→known · silent certainty escalation · silent completeness upgrade · conflict suppression due only to candidate recency · provenance disappearance · subject/identity substitution · disappearance of negative evidence solely because newer evidence exists.

---

## 6. Idempotency (binding · DEF-SP07-13 partial)

```text
same canonical predecessor
+ same canonical candidate
+ same applicable contract/version
= same derived P2 result
```

**Not authorized:** persistent-write / retry / recovery idempotency.

---

## 7. Runtime non-authority (binding)

This Grant **DOES NOT** authorize:

```text
persistent runtime mutation · database writes · cloud writes
automated state transition · scheduling · cron · polling
workers · daemons · websocket execution · notifications
delivery · external API side effects · outreach
owner/contact disclosure · Product/Marketplace propagation
archive / replay / audit store · recovery / resumption
```

```text
sideEffects = NONE
delivery = NOT_AUTHORIZED
```

---

## 8. Proof contract (binding · NOT EXECUTED)

Stable series: **`SP07-P2-T01`…`SP07-P2-T23`** — **DEFINED / NOT EXECUTED** at Grant publication.

| ID | Obligation |
|----|------------|
| **SP07-P2-T01** | Result schema identity `rsn.operation.update.result.v1` |
| **SP07-P2-T02** | Canonical subject `INSTITUTIONAL_OPERATIONAL_CONTINUITY` / `rsn.operation.watch.subject.v1` |
| **SP07-P2-T03** | Valid predecessor `rsn.operation.watch.result.v1` accept |
| **SP07-P2-T04** | Valid candidate `rsn.operation.update.candidate.v1` accept |
| **SP07-P2-T05** | Deterministic result (same semantic inputs → same result) |
| **SP07-P2-T06** | Result idempotency (Freeze §12) |
| **SP07-P2-T07** | Meaningful bounded change → `BOUNDED_EVOLUTION_RECOGNIZED` |
| **SP07-P2-T08** | No-change → `NO_MEANINGFUL_UPDATE` |
| **SP07-P2-T09** | Malformed input → `FAIL_CLOSED` |
| **SP07-P2-T10** | Missing predecessor → `FAIL_CLOSED` |
| **SP07-P2-T11** | Out-of-domain subject → `FAIL_CLOSED` |
| **SP07-P2-T12** | UNKNOWN preservation |
| **SP07-P2-T13** | Conflict preservation |
| **SP07-P2-T14** | Provenance continuity |
| **SP07-P2-T15** | healthEvidence honesty |
| **SP07-P2-T16** | No silent certainty upgrade |
| **SP07-P2-T17** | No silent completeness upgrade |
| **SP07-P2-T18** | No P1 mutation |
| **SP07-P2-T19** | No persistence |
| **SP07-P2-T20** | No external side effects · `sideEffects: NONE` |
| **SP07-P2-T21** | `delivery: NOT_AUTHORIZED` |
| **SP07-P2-T22** | No owner/contact action |
| **SP07-P2-T23** | No Product/Marketplace action |

```text
Proof status at Grant publication = DEFINED / NOT EXECUTED
All 23 proofs MUST PASS before implementation is technically successful
Execution requires Director EXECUTE + bounded implementation block
```

---

## 9. Regression (binding)

| Suite | Binding |
|-------|---------|
| **SP07-P1-T01…T25** | **MANDATORY** — P2 consumes P1 contracts |
| **SP05-P3 P3-G01…G30** | **CONDITIONAL** — only if Decision/dossier consumed |
| **SP06-P1 T01…T28** | **CONDITIONAL** — only if Publication eligibility consumed |
| **SP06-P2 T01…T33** | **CONDITIONAL** — only if Publication unit consumed |
| **II.3 / II.4** | **CONDITIONAL** — only if Integration antecedents consumed |

Do not authorize unrelated historical remediation. Expected default: P1 suite mandatory; SP05/SP06/II **NOT TRIGGERED** unless imports prove otherwise.

---

## 10. P1 observations (no remediation)

OBS-ITA-01…04 remain **NON-BLOCKING** carry-forward. This Grant **MUST NOT** authorize P1 sanitization or proof-harness repair.

---

## 11. P3 / P4 walls (binding)

**P3 excluded:** archive · historical event store · replay · audit persistence · persistence-class decisions · Supabase / DG-01 resolution.

**P4 excluded:** retry architecture · recovery · resumption · dependency degradation · complete failure-transition graph.

**DEF-SP07-20:** PARKING / FUTURE · no scheduler/cron/worker/daemon.

---

## 12. CAP / deficit (no satisfaction)

| ID | Grant posture |
|----|---------------|
| **DEF-SP07-03 / 06 / 07 / 08** | **OWNED / NOT CLOSED** until EXECUTE + proofs + ITA |
| **DEF-SP07-13** | **PARTIAL / NOT CLOSED** |
| **DEF-SP07-16** | **DG-02 PARKED** |
| **C-CAP-SP07-05** | **PRIMARY TARGET / NOT SATISFIED** |
| **C-CAP-SP07-01 / 02 / 03 / 06** | **PRESERVE / NOT SATISFIED** |
| **C-CAP-SP07-07** | **P4-OWNED** |

Program-wide CAP/ACC **NOT SATISFIED**.

---

## 13. STOP boundary

```text
GRANT PUBLICATION ≠ SOURCE EXECUTION

After Grant publication:
  IMPLEMENTATION AUTHORITY = NO — PENDING EXPLICIT DIRECTOR EXECUTE
  CODE AUTHORITY           = NONE

Until Director proceeds to explicit EXECUTE:
  Aprobado. Ejecuta.

This prompt / this Grant ≠ EXECUTE.
```

---

## 14. Exact next gate

```text
NEXT GATE:
  DIRECTOR EXECUTE AUTHORIZATION FOR SP07-P2 SOURCE IMPLEMENTATION
  (under DAG-SP07-P2-G1 exact surfaces only)

≠ source implementation by this Grant
≠ P3 / P4 / P5 / SP08 opened
≠ DG resolution
≠ Supabase
```

---

## Binding footer

```text
SP07-P2-GRANT / DAG-SP07-P2-G1
  = Minimum Source Grant for Bounded Update + Honesty Continuity
  = predecessor rsn.operation.watch.result.v1 CONSUME_ONLY
  = candidate rsn.operation.update.candidate.v1
  = result rsn.operation.update.result.v1
  = src/operation/p2/ exact 3-file core
  = SP07-P2-T01…T23 DEFINED / NOT EXECUTED
  = SP07-P1-T01…T25 MANDATORY REGRESSION

≠ CODE · ≠ EXECUTE · ≠ P1 MUTATION · ≠ SUPABASE
≠ AUTOMATED TRANSITION · ≠ PERSISTENCE
≠ DG-02 RESOLUTION · ≠ P3 ARCHIVE · ≠ P4 RECOVERY
≠ PRODUCT · ≠ MARKETPLACE · ≠ SP08
```

**END OF SP07-P2-GRANT / DAG-SP07-P2-G1**

# STRATEGIC PROGRAM 07 — CONTINUOUS OPERATION
## SP07-P3 — MINIMUM SOURCE GRANT
### Archive + Replay / Audit Continuity — Exact writable surfaces + execution contract (≠ code)

| Campo | Valor |
|-------|--------|
| **Document ID** | **`SP07-P3-GRANT`** |
| **Grant ID** | **`DAG-SP07-P3-G1`** |
| **File ID** | `FACTORY_EVOLUTION_SP07_P3_BOUNDED_IMPLEMENTATION_GRANT.md` |
| **Path** | `docs/factory-evolution/FACTORY_EVOLUTION_SP07_P3_BOUNDED_IMPLEMENTATION_GRANT.md` |
| **Nature** | Bounded **Director Grant** — Continuity-records exact mutable operation-side surfaces and authorized technical purpose for **future** SP07-P3 archive-record formation + historical sequence + read-only replay + audit continuity implementation · **≠ code in this file** · **≠ implementation by publication** · **≠ Director EXECUTE** · **≠ persistence** · **≠ Supabase** · **≠ P4/P5** · **≠ Product / Marketplace / SP08** |
| **Program** | **Strategic Program 07 — Continuous Operation** |
| **Phase** | **SP07-P3 — Archive + Replay / Audit Continuity** (deterministic-internal-only · side-effect-free · non-persistent) |
| **Parent Mandate** | `SP07-ENG-IMPL` · Continuity Commit **`79aac1ff7dc44e399cb4b9a18494a4fa7c48f362`** · **UNCHANGED** |
| **Parent Plan** | `SP07-02` · Continuity Commit **`fcf96cb64efc9e217a357895725e50445fa94d21`** · **UNCHANGED** |
| **Parent Discovery** | `SP07-01` · Continuity Commit **`d1f7e971727b240329b3067a71f04acbef14c55a`** · **UNCHANGED** |
| **Parent P1 Complete** | `SP07-P1-COMPLETE-STATUS-01` · Continuity Commit **`255d2bfdfdd1b88042de227f75caa5d428ab75ac`** · **CLOSED / READ-ONLY** |
| **Parent P2 Complete** | `SP07-P2-COMPLETE-STATUS-01` · Continuity Commit **`3d6bf495b5f12e3d01406a76844bb4fddfb8316e`** · **CLOSED / READ-ONLY** |
| **Parent P3 Freeze** | `SP07-P3-ARCHIVE-REPLAY-AUDIT-FREEZE-01` · Continuity Commit **`9d3211afc6845f5ea0c80e84106631c4333f9dc6`** · **BINDING** |
| **Parent P3 Pre-IMPL** | Session STRICT READ ONLY · **PASS WITH OBSERVATIONS** · **UNCHANGED** |
| **Grant-readiness** | Freeze **FROZEN / COMPLETE** · blockers **NONE** · DG-01 **PARKED OUTSIDE P3 CORE** · **P3 GRANT READINESS = READY** |
| **Authorizing Director act** | Director authorization to create and Continuity-publish **only** this bounded Grant · phrase **`Aprobado. Ejecuta.`** (Grant publication) · **≠ EXECUTE** for source |
| **Entry tip (pre-publication)** | **`9d3211afc6845f5ea0c80e84106631c4333f9dc6`** |
| **Date** | **2026-08-15** |
| **Branch** | `integration/factory-complete-20260725` |
| **Mode** | **DOCUMENTARY AUTHORITY ONLY** |

```text
DAG-SP07-P3-G1
  = Minimum Source Grant for SP07-P3 Archive + Replay / Audit Continuity ONLY
  = ARCHIVE SEMANTICS != PERSISTENCE IMPLEMENTATION
  = REPLAY != RECOVERY
  = sideEffects = NONE · delivery = NOT_AUTHORIZED · persistence = NONE
  = Exact writable file freeze + proof/execution contract
  = Controls = SP07-P3-ARCHIVE-REPLAY-AUDIT-FREEZE-01 @ 9d3211afc6845f5ea0c80e84106631c4333f9dc6

GRANT PUBLISHED != CODE AUTHORIZED
GRANT PUBLISHED != IMPLEMENTATION STARTED
GRANT PUBLISHED != DIRECTOR EXECUTE

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
| `src/operation/p3/**` creation | **NOT AUTHORIZED** until Director EXECUTE |
| `src/operation/p1/**` · `src/operation/p2/**` | **FORBIDDEN** |
| Durable persistence / Supabase / SQL / migrations | **FORBIDDEN** |
| Automated archival mutation | **FORBIDDEN** |
| SP07-P4 / P5 | **NOT OPENED** |
| SP07-DG-01…04 final disposition | **NOT PERFORMED** |
| SP08 | **NOT OPENED** |
| Product / Marketplace / Delivery | **ZERO AUTHORITY** |

```text
THIS GRANT NARROWS AUTHORITY.
IT MUST NOT BROADEN THE MANDATE OR FREEZE.
THIS GRANT != EXECUTE.
THIS GRANT != OPEN P4 / P5 / SP08.
THIS GRANT != RESOLVE DG-01.
THIS GRANT != AUTHORIZE PERSISTENCE.
```

---

## 1. Subordination (binding)

| Instrument | Posture |
|------------|---------|
| **SP07-ENG-IMPL** | **UNCHANGED** |
| **SP07-02 / SP07-01** | **UNCHANGED** |
| **SP07-P3-ARCHIVE-REPLAY-AUDIT-FREEZE-01** @ `9d3211afc6845f5ea0c80e84106631c4333f9dc6` | **BINDING** contract |
| **SP07-P1 Complete / Freeze / Grant / IMPL** | **CLOSED / READ-ONLY PREDECESSOR** |
| **SP07-P2 Complete / Freeze / Grant / IMPL** | **CLOSED / READ-ONLY PREDECESSOR** |
| **SP06-COMPLETE-STATUS-01** | **CLOSED / READ-ONLY** |
| **SP07-DG-01** | **UNRESOLVED / PARKED OUTSIDE P3 CORE** |
| **SP07-DG-02** | **UNRESOLVED / PARKED OUTSIDE P2 CORE** |
| **SP07-DG-03** | **UNRESOLVED / P4** |
| **SP07-DG-04** | **UNRESOLVED / PARKED OUTSIDE P1 CORE** |

```text
GRANT != AMEND PARENTS
GRANT != REOPEN / REWRITE FREEZE
GRANT != RESOLVE DG-01..04
GRANT != OPEN P4 / P5 / SP08
GRANT != INVENT SEMANTICS BEYOND FREEZE
GRANT != MUTATE P1 / P2
GRANT != AUTHORIZE STORE / SUPABASE
```

---

## 2. Grant purpose (frozen)

Authorize, **subject to later explicit Director EXECUTE**, the **minimum** operation-side code surfaces necessary to establish:

1. frozen P3 schemas/contracts for **`rsn.operation.archive.record.v1`**, **`rsn.operation.archive.sequence.v1`**, **`rsn.operation.archive.replay.result.v1`**;
2. deterministic archive-record formation from canonical CLOSED P1/P2 historical artifacts;
3. deterministic non-destructive historical sequence formation;
4. correction/supersession lineage preserving prior historical records;
5. deterministic read-only replay/reconstruction;
6. audit continuity;
7. honesty-over-history enforcement;
8. proof harness **SP07-P3-T01…T29**.

**Owned deficits (after EXECUTE + proofs + ITA):** DEF-SP07-04 · DEF-SP07-09 (P3 portion) · DEF-SP07-14 (partial) · DEF-SP07-08 (long-horizon remainder). **DEF-SP07-18** = DG-01 park only.

```text
P3 PURPOSE
  = deterministic in-memory ARCHIVE RECORD formation
  = non-destructive HISTORICAL SEQUENCE
  = deterministic READ-ONLY REPLAY / reconstruction
  = AUDIT CONTINUITY + HONESTY OVER HISTORY
  != durable persistence · != Supabase · != storage engine
  != retry · != recovery · != resumption
  != Publication delivery · != Product / Marketplace
  != owner disclosure / contact / outreach
  != SP07-P4 / P5 / SP08
```

---

## 3. Contract binding (binding)

Subordinate to **`SP07-P3-ARCHIVE-REPLAY-AUDIT-FREEZE-01`** without amendment.

| Artifact | Frozen schema |
|----------|---------------|
| **Subject** | **`rsn.operation.watch.subject.v1`** · `INSTITUTIONAL_OPERATIONAL_CONTINUITY` |
| **P1 predecessor** | **`rsn.operation.watch.result.v1`** · **CONSUME_ONLY** |
| **P2 predecessor** | **`rsn.operation.update.result.v1`** · **CONSUME_ONLY** |
| **Archive record** | **`rsn.operation.archive.record.v1`** |
| **Historical sequence** | **`rsn.operation.archive.sequence.v1`** |
| **Replay result** | **`rsn.operation.archive.replay.result.v1`** |

```text
ACTIVE operational posture != HISTORICAL archived record
ARCHIVE SEMANTICS != PERSISTENCE IMPLEMENTATION
REPLAY != RECOVERY
sideEffects = NONE (always)
delivery = NOT_AUTHORIZED (always · negative marker)
persistence = NONE
P1 mutation = FORBIDDEN
P2 mutation = FORBIDDEN
```

Source artifact kinds on archive records: **`WATCH_RESULT`** · **`UPDATE_RESULT`** only.

---

## 4. Exact writable files (frozen)

**No broad directory write authorization.** Creating parent directories is incidental to creating the enumerated files only.

Namespace **`src/operation/p3/**`** is **not** a wildcard write grant. Only the exact files below are authorized after Director EXECUTE.

### 4.1 REQUIRED writable surfaces

| PATH | NEW / EXISTING | PURPOSE | AUTHORIZED MUTATION TYPE |
|------|----------------|---------|--------------------------|
| `src/operation/p3/operationArchiveContract.js` | **NEW** | Frozen constants: subject · P1/P2 predecessor schema IDs · `rsn.operation.archive.record.v1` · `rsn.operation.archive.sequence.v1` · `rsn.operation.archive.replay.result.v1` · honesty / wall locks · source kinds · ordering/idempotency tokens (**no P1/P2 file mutation**) | **CREATE** (post-EXECUTE) |
| `src/operation/p3/operationArchiveEvaluator.js` | **NEW** | Accept/refuse canonical historical inputs · deterministic archive-record formation · non-destructive sequence · correction/supersession lineage · deterministic read-only replay · honesty-over-history · emit archive/sequence/replay artifacts with **`sideEffects: NONE`** · **`persistence: NONE`** · **no automated archival mutation** | **CREATE** (post-EXECUTE) |
| `src/operation/p3/validateOperationArchiveContinuity.js` | **NEW** | P3 proof harness implementing §10 obligations **`SP07-P3-T01…T29`** plus mandatory P1 + P2 regression invocation | **CREATE** (post-EXECUTE) |

**Minimum coherent file count:** **3**.

P3 **MAY** import P1 and/or P2 contract/evaluator modules **read-only** as consume-only. Import ≠ mutation.

P3 **MUST NOT** re-evaluate snapshots/candidates as a required core path unless a future separate authority adds that verification class. This Grant's replay core remains reconstruction from archived records per Freeze.

### 4.2 Explicitly NOT writable

| Surface | Binding |
|---------|---------|
| Any path outside §4.1 | **STOP** |
| `src/operation/p1/**` | **FORBIDDEN** (CLOSED / READ-ONLY) |
| `src/operation/p2/**` | **FORBIDDEN** (CLOSED / READ-ONLY) |
| `src/factory/**` | **FORBIDDEN** |
| `src/decision/**` | **FORBIDDEN** |
| `src/publication/**` | **FORBIDDEN** |
| `services/factory-observability/**` | **FORBIDDEN** |
| `src/integration/**` | **FORBIDDEN** |
| Product / Marketplace / frontend / delivery | **FORBIDDEN** |
| Supabase / DB / migration / SQL / RLS / Edge / Auth / Storage | **FORBIDDEN** |
| owner/contact / transaction/brokerage / SP08 surfaces | **FORBIDDEN** |
| `src/operation/p4/**` or later phases | **NOT OPENED** |

No optional `index.js` is authorized by this Grant.

If implementation requires durable local storage · database · cloud persistence · Supabase · schema · SQL · migrations:

```text
STOP.
Do not broaden this Grant.
Separate Director decision + separate authority required first.
```

---

## 5. Archive / sequence / replay authority (binding)

### 5.1 Archive-record formation

Authorize only **deterministic derived** archive records from CLOSED P1/P2 historical artifacts.

```text
in-memory · deterministic · non-persistent · side-effect-free
```

No durable archive/store is authorized.

### 5.2 Historical sequence

Authorize deterministic **in-memory** sequence formation under semantic append-only rules:

- later records do not overwrite earlier records;
- prior historical facts remain represented;
- correction/supersession produces a new record;
- prior record remains intact and explainable.

This does **not** authorize a storage engine.

### 5.3 Replay

Authorize deterministic **read-only reconstruction** from canonical archive records.

Replay **MUST NOT** become:

```text
retry · recovery · resumption
external action repetition · delivery repetition · transaction repetition
database restoration · operational re-execution
```

P4 wall remains intact.

---

## 6. Historical honesty locks (binding)

```text
UNKNOWN != NONE != ZERO
freshness != truth
stale != false
absence of evidence != HEALTHY
absence of failure != HEALTHY
```

Historical records **MUST** preserve:

- original UNKNOWN;
- original conflicts;
- original negative evidence;
- original provenance;
- original incompleteness;
- original freshness state.

Later records **MUST NOT** retroactively upgrade earlier historical truth.

OBS-ITA-01…04 and OBS-P2-ITA-01…04 remain **NON-BLOCKING** carry-forward. This Grant **MUST NOT** authorize P1/P2 sanitization or observation remediation.

---

## 7. Ordering / time (binding)

Authorize deterministic ordering based **only** on frozen canonical lineage/time semantics (Freeze §15–§16).

**Do not authorize:**

```text
Date.now()
random ordering
environment-dependent ordering
mutable global counters
implicit runtime archive timestamps
```

Missing timestamps **MUST NOT** be invented.

---

## 8. Idempotency (binding)

```text
same canonical historical input
+ same P3 archive contract/version
= same archive record
```

```text
same canonical ordered archive sequence
+ same replay contract/version
= same replay result
```

**Not authorized:** durable-write idempotency · retry idempotency · recovery/resumption idempotency.

Identical canonical historical input under the same archive contract/version **MUST NOT** create a semantically different historical fact. No database uniqueness architecture is authorized.

---

## 9. Runtime non-authority (binding)

This Grant **DOES NOT** authorize:

```text
durable local persistence · database writes · cloud writes · Supabase
SQL · migrations · RLS · Edge Functions · Auth · Storage
automated archival mutation · automated state transition
scheduling · cron · polling · workers · daemons · websocket
notifications · delivery · external API side effects · outreach
owner/contact disclosure · Product/Marketplace propagation
retry · recovery · resumption · dependency degradation
```

```text
sideEffects = NONE
delivery    = NOT_AUTHORIZED
persistence = NONE
```

---

## 10. Proof contract (binding · NOT EXECUTED)

Stable series: **`SP07-P3-T01`…`SP07-P3-T29`** — **DEFINED / NOT EXECUTED** at Grant publication.

| ID | Obligation |
|----|------------|
| **SP07-P3-T01** | Archive schema identity `rsn.operation.archive.record.v1` |
| **SP07-P3-T02** | Sequence schema identity `rsn.operation.archive.sequence.v1` |
| **SP07-P3-T03** | Replay schema identity `rsn.operation.archive.replay.result.v1` |
| **SP07-P3-T04** | P1 archive-record formation from `rsn.operation.watch.result.v1` |
| **SP07-P3-T05** | P2 archive-record formation from `rsn.operation.update.result.v1` |
| **SP07-P3-T06** | Subject/identity continuity |
| **SP07-P3-T07** | Original schema/version preservation |
| **SP07-P3-T08** | Provenance preservation |
| **SP07-P3-T09** | UNKNOWN preservation |
| **SP07-P3-T10** | Conflict preservation |
| **SP07-P3-T11** | Negative evidence preservation |
| **SP07-P3-T12** | Completeness preservation |
| **SP07-P3-T13** | Freshness preservation |
| **SP07-P3-T14** | Non-destructive historical sequence |
| **SP07-P3-T15** | Correction/supersession retains predecessor |
| **SP07-P3-T16** | Deterministic ordering |
| **SP07-P3-T17** | Archive-record idempotency |
| **SP07-P3-T18** | Deterministic replay/reconstruction |
| **SP07-P3-T19** | Replay idempotency |
| **SP07-P3-T20** | Malformed input → fail-closed |
| **SP07-P3-T21** | Out-of-domain input → fail-closed |
| **SP07-P3-T22** | No P1 mutation |
| **SP07-P3-T23** | No P2 mutation |
| **SP07-P3-T24** | No persistence |
| **SP07-P3-T25** | No external side effects · `sideEffects: NONE` |
| **SP07-P3-T26** | `delivery: NOT_AUTHORIZED` |
| **SP07-P3-T27** | No Product/Marketplace action |
| **SP07-P3-T28** | No owner/contact action |
| **SP07-P3-T29** | P4 wall intact (no retry/recovery/resumption) |

```text
Proof status at Grant publication = DEFINED / NOT EXECUTED
All 29 proofs MUST PASS before implementation is technically successful
Execution requires Director EXECUTE + bounded implementation block
Do not define a storage proof.
```

---

## 11. Regression (binding)

| Suite | Binding |
|-------|---------|
| **SP07-P1-T01…T25** | **MANDATORY** — P3 consumes P1 contracts |
| **SP07-P2-T01…T23** | **MANDATORY** — P3 consumes P2 contracts |
| **SP05-P3 P3-G01…G30** | **CONDITIONAL** — only if Decision/dossier consumed |
| **SP06-P1 T01…T28** | **CONDITIONAL** — only if Publication eligibility consumed |
| **SP06-P2 T01…T33** | **CONDITIONAL** — only if Publication unit consumed |
| **II.3 / II.4** | **CONDITIONAL** — only if Integration antecedents consumed |

Do not authorize unrelated historical remediation. Expected default: P1 + P2 suites mandatory; SP05/SP06/II **NOT TRIGGERED** unless imports prove otherwise.

---

## 12. P4 / scheduling / delivery walls (binding)

**P4 excluded:**

```text
retry architecture · recovery graph · resumption
operational recovery · dependency degradation
complete failure-transition model · recovery-time replay
```

**DEF-SP07-20:** **PARKING / FUTURE** · no scheduler · cron · polling · worker · daemon · websocket · automatic archival loop · automatic replay loop.

```text
delivery = NOT_AUTHORIZED
```

No: Publication delivery · Product · Marketplace · customer-visible history · owner/contact disclosure · outreach · targeting · unlock · transaction action · brokerage/intermediation.

---

## 13. Director gates (binding · not resolved)

| Gate | Grant posture |
|------|---------------|
| **SP07-DG-01** | **UNRESOLVED / PARKED OUTSIDE P3 CORE** · persistence NONE · Supabase NONE |
| **SP07-DG-02** | **UNRESOLVED / PARKED** · no autonomous archival mutation |
| **SP07-DG-03** | **UNRESOLVED / P4** |
| **SP07-DG-04** | **UNRESOLVED / PARKED** · no Product/customer observability authority |

This Grant **MUST NOT** resolve any Director gate.

---

## 14. Deficit / CAP boundary (no satisfaction)

| ID | Grant posture |
|----|---------------|
| **DEF-SP07-04** | **P3 TARGET / NOT CLOSED** until EXECUTE + proofs + ITA |
| **DEF-SP07-09** | **P3 TARGET** for deterministic replay/reproducibility · recovery-time remainder **P4** · **NOT CLOSED** |
| **DEF-SP07-14** | **P3 PARTIAL TARGET / NOT CLOSED** |
| **DEF-SP07-08** | **P3 PARTIAL TARGET / NOT CLOSED** |
| **DEF-SP07-18** | **PARKED / DG-01** |
| **DEF-SP07-15** | **DOWNSTREAM P5** |
| **DEF-SP07-20** | **PARKING / FUTURE** |
| **DEF-SP07-16** | **DG-02 remains parked** |

| CAP / ACC | Grant posture |
|-----------|---------------|
| **C-CAP-SP07-02** | **P3 PARTIAL TARGET / NOT SATISFIED** |
| **C-CAP-SP07-04** | **P3 TARGET SUBSET / NOT SATISFIED** · ≠ Supabase synonym |
| **C-CAP-SP07-05** | **PRESERVE** |
| **C-CAP-SP07-07** | **DOWNSTREAM P4** |
| **C-ACC-SP07-06** | **P3 PARTIAL TARGET / NOT SATISFIED** |

Program-wide CAP/ACC **NOT SATISFIED**.

---

## 15. Observations (no remediation)

| ID | Classification |
|----|----------------|
| **OBS-P3-PRE-01…05** | **NON-BLOCKING** · preserved · no remediation authority |
| **OBS-ITA-01…04** | **NON-BLOCKING** · P1 carry-forward · no P1 repair |
| **OBS-P2-ITA-01…04** | **NON-BLOCKING** · P2 carry-forward · no P2 repair |

---

## 16. STOP boundary

```text
GRANT PUBLICATION != SOURCE EXECUTION

After Grant publication:
  IMPLEMENTATION AUTHORITY = NO — PENDING EXPLICIT DIRECTOR EXECUTE
  CODE AUTHORITY           = NONE

Until Director proceeds to explicit EXECUTE:
  Aprobado. Ejecuta.

This prompt / this Grant != EXECUTE.
```

---

## 17. Exact next gate

```text
NEXT GATE:
  DIRECTOR EXECUTE AUTHORIZATION FOR SP07-P3 SOURCE IMPLEMENTATION
  (under DAG-SP07-P3-G1 exact surfaces only)

!= source implementation by this Grant
!= P4 / P5 / SP08 opened
!= DG resolution
!= persistence / Supabase
```

---

## Binding footer

```text
SP07-P3-GRANT / DAG-SP07-P3-G1
  = Minimum Source Grant for Archive + Replay / Audit Continuity
  = Controls SP07-P3-ARCHIVE-REPLAY-AUDIT-FREEZE-01 @ 9d3211af…
  = P1 rsn.operation.watch.result.v1 CONSUME_ONLY
  = P2 rsn.operation.update.result.v1 CONSUME_ONLY
  = archive  rsn.operation.archive.record.v1
  = sequence rsn.operation.archive.sequence.v1
  = replay   rsn.operation.archive.replay.result.v1
  = src/operation/p3/ exact 3-file core
  = SP07-P3-T01…T29 DEFINED / NOT EXECUTED
  = SP07-P1-T01…T25 + SP07-P2-T01…T23 MANDATORY REGRESSION

!= CODE · != EXECUTE · != P1 MUTATION · != P2 MUTATION
!= PERSISTENCE · != SUPABASE · != AUTOMATED ARCHIVAL MUTATION
!= DG-01 RESOLUTION · != P4 RECOVERY
!= PRODUCT · != MARKETPLACE · != SP08
```

**END OF SP07-P3-GRANT / DAG-SP07-P3-G1**

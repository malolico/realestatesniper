# STRATEGIC PROGRAM 05 — DECISION ENGINE
## SP05-P3 — BOUNDED IMPLEMENTATION GRANT
### Decision Dossier Core — Exact writable surfaces + execution contract (≠ code)

| Campo | Valor |
|-------|--------|
| **Document ID** | **`SP05-P3-GRANT`** |
| **Grant ID** | **`DAG-SP05-P3-G1`** |
| **File ID** | `FACTORY_EVOLUTION_SP05_P3_BOUNDED_IMPLEMENTATION_GRANT.md` |
| **Path** | `docs/factory-evolution/FACTORY_EVOLUTION_SP05_P3_BOUNDED_IMPLEMENTATION_GRANT.md` |
| **Nature** | Bounded **Director Grant** — Continuity-records exact mutable Decision-side surfaces and authorized technical purpose for **future** SP05-P3 dossier core implementation · **≠ code in this file** · **≠ implementation by publication** · **≠ Director EXECUTE** · **≠ DG-01 resolved** · **≠ P4** · **≠ Product / Marketplace / SP06–08 / Live** |
| **Program** | **Strategic Program 05 — Decision Engine** |
| **Phase** | **SP05-P3 — Deal Dossier** (bounded Decision-side assembly only) |
| **Parent Mandate** | `SP05-ENG-IMPL` · Continuity Commit **`9294b7b38cf1e78b353331e20a0d547897bb42d1`** · **UNCHANGED** |
| **Parent Pre-IMPL** | `SP05-P3-PRE-IMPL` · Continuity Commit **`3bd5f2de48baa25267c569112b5f013d5425f891`** · **UNCHANGED** |
| **Parent Dossier Freeze** | `SP05-P3-DOSSIER-FREEZE-01` · Continuity Commit **`02e36312024396bea7cf1d4c2b28cdb3c56360cb`** · **UNCHANGED** |
| **Freeze Independent Documentary Audit** | Session STRICT READ ONLY · **PASS WITH OBSERVATIONS** · blocking findings **NONE** · unresolved material Director decisions **NONE** · **P3 GRANT READINESS = READY** |
| **Parent Plan / Plan IDA** | `SP05-02` · `SP05-02-PLAN-IDA` · **UNCHANGED** |
| **Parent Discovery / IDA** | `SP05-01` · `SP05-01-DISCOVERY-IDA` · **UNCHANGED** |
| **Parent P1 Complete / Grant** | `SP05-P1-COMPLETE-STATUS-01` · `DAG-SP05-P1-G1` · Continuity Commit **`18327d521ac55dd40448e5d8a02c3c9cd492adb7`** · **CLOSED PREDECESSOR / READ ONLY** |
| **Parent P2 Freeze / Amendment / Grant / Complete** | `SP05-P2-SEM-FREEZE-01` · `SP05-P2-SEM-FREEZE-AMENDMENT-01` · `DAG-SP05-P2-G1` · `SP05-P2-COMPLETE-STATUS-01` · Continuity Commit **`96f84b7073d6bd31cdb246229ca9f90cd956d27d`** · **CLOSED PREDECESSOR / READ ONLY** |
| **PRE-SP05 antecedent** | PRE-SP05 COMPLETE · PS05-04 honesty · PS05-05 trusted CB-16 · PS05-06 isolation · **PRESERVED** |
| **Entry tip (pre-publication)** | **`02e36312024396bea7cf1d4c2b28cdb3c56360cb`** |
| **Date** | **2026-08-14** |
| **Branch** | `integration/factory-complete-20260725` |
| **Mode** | **DOCUMENTARY AUTHORITY ONLY** |

```text
DAG-SP05-P3-G1
  = Bounded Grant for SP05-P3 Decision Dossier CORE ONLY
  = Exact writable file freeze + proof/execution contract
  = Controls = SP05-P3-DOSSIER-FREEZE-01 (Blockers 1–4 CLOSED)

GRANT PUBLISHED ≠ CODE AUTHORIZED
GRANT PUBLISHED ≠ IMPLEMENTATION STARTED
GRANT PUBLISHED ≠ DIRECTOR EXECUTE

IMPLEMENTATION AUTHORITY = AWAITING DIRECTOR EXECUTE
CODE AUTHORITY           = NONE UNTIL EXPLICIT DIRECTOR EXECUTE

Required Director authorization phrase before any code mutation:
  Aprobado. Ejecuta.
```

---

## 0. Absolute non-authorization banner

| Surface | Under this Grant publication alone |
|---------|-------------------------------------|
| Decision / Factory code | **NOT AUTHORIZED** |
| `src/decision/dossier/**` creation | **NOT AUTHORIZED** until Director EXECUTE |
| Test / fixture mutation | **NOT AUTHORIZED** until Director EXECUTE |
| DG-01 Question A / B | **ZERO AUTHORITY** |
| SP05-P4 | **NOT OPENED** |
| SP06 / SP07 / SP08 | **NOT OPENED** |
| Factory CB-08 / CB-09 / CB-16 source | **FORBIDDEN MUTATION** |
| P1 `src/decision/intake/**` | **FORBIDDEN MUTATION** |
| P2 `src/decision/semantics/**` | **FORBIDDEN MUTATION** |

```text
THIS GRANT NARROWS AUTHORITY.
IT MUST NOT BROADEN THE MANDATE, PRE-IMPL, OR DOSSIER FREEZE.
THIS GRANT ≠ EXECUTE.
THIS GRANT ≠ REDESIGN P3.
THIS GRANT ≠ NEW SEMANTICS.
```

---

## 1. Subordination (binding)

This Grant is expressly subordinated to:

| Instrument | Posture |
|------------|---------|
| **SP05-ENG-IMPL** | **UNCHANGED** · controlling engineering class |
| **SP05-01 / SP05-01-DISCOVERY-IDA** | **UNCHANGED** |
| **SP05-02 / SP05-02-PLAN-IDA** | **UNCHANGED** |
| **SP05-P3-PRE-IMPL** | **UNCHANGED** |
| **SP05-P3-DOSSIER-FREEZE-01** | **UNCHANGED** · **BINDING** contract |
| **Freeze Independent Documentary Audit** | **PASS WITH OBSERVATIONS** · blockers **NONE** · Grant-ready |
| **SP05-P1-COMPLETE / DAG-SP05-P1-G1** | **PRESERVED** · P1 **READ ONLY** |
| **SP05-P2-SEM-FREEZE-01 + Amendment-01 / DAG-SP05-P2-G1 / SP05-P2-COMPLETE** | **PRESERVED** · P2 **READ ONLY** |
| **PRE-SP05 COMPLETE / PS05-04 / PS05-05 / PS05-06** | **PRESERVED** |
| **DG-01** | **UNRESOLVED — PARTIAL** · **PARKED OUT OF P3 CORE** |

```text
GRANT ≠ AMEND PARENTS
GRANT ≠ EXPAND PRE-IMPL SCOPE
GRANT ≠ REOPEN / REWRITE FREEZE
GRANT ≠ RESOLVE DG-01
GRANT ≠ OPEN P4 / SP06+
GRANT ≠ INVENT SEMANTICS BEYOND FREEZE
```

Where this Grant fixes nested field paths, immutability mechanism, `ruleVersion`, or proof IDs, those are **Grant-time engineering concreteness only** — they **MUST NOT** alter frozen P3 semantics.

---

## 2. Grant purpose (frozen)

Authorize, **subject to later explicit Director EXECUTE**, the **minimum** Decision-side code surfaces necessary to establish:

1. bounded Decision-side Deal Dossier assembly from accepted `DEC-INTAKE` + accepted `rsn.decision.semantics.result.v1`;
2. schema class `rsn.decision.dossier.result.v1` · `v1` · `meta.state = DEC-DOSSIER`;
3. required top-level catalog exactly: `meta` · `input` · `semantics` · `honesty` · `invariants`;
4. REJECT_INPUT / NO DOSSIER fail-closed gates;
5. faithful preservation of P2 honesty states and semantics (no re-adjudication);
6. OPTIONAL_BOUNDED ranking / CB-09 context / ownerRef·owner identity per Freeze;
7. no Factory / P1 / P2 write-back;
8. P3 proof harness obligations (§12).

**Owned deficit / CAP class (after EXECUTE):** DEF-SP05-07 · C-CAP-SP05-06 (advancement only; ≠ SP05 COMPLETE).

```text
P3 PURPOSE
  = Decision-side assemble consumed truth + Decision conclusions for user review
  = assembly / preservation
  ≠ re-adjudication of P1/P2
  ≠ Premium / Diamond / access_tier / strategy
  ≠ Product / Marketplace / SP06 publication
  ≠ owner contact / outreach / targeting
  ≠ BUY / SELL / INVEST / transaction advice
  ≠ economic attractiveness scoring
  ≠ P4 closure
```

---

## 3. Frozen P3 contract incorporation (binding)

Future implementation **MUST** obey `SP05-P3-DOSSIER-FREEZE-01` without invention:

| Binding | Source |
|---------|--------|
| `schemaId = rsn.decision.dossier.result.v1` · version `v1` | Freeze Blocker 1 |
| `meta.state = DEC-DOSSIER` | Freeze Blocker 2 / §13 |
| Required top-level: `meta` · `input` · `semantics` · `honesty` · `invariants` | Freeze Blocker 2 |
| No sixth required top-level section | Freeze Blocker 2 |
| Consume accepted DEC-INTAKE + accepted P2 result by reference | Freeze Blocker 1 |
| OPTIONAL_BOUNDED ranking / CB-09 / ownerRef·owner identity | Freeze Blocker 3 |
| Optional absence = ABSENT / NOT INCLUDED | Freeze Blocker 3 |
| REJECT_INPUT / NO DOSSIER vs BUILD faithfully for P2 honesty states | Freeze Blocker 4 |
| Legal / Product / DG-01 walls | Freeze §14 / §0 |

Independent Freeze Audit observations **OBS-P3-F01…OBS-P3-F04** remain **NON-BLOCKING**. This Grant may only concretize nested paths / provenance representation / immutability / validators — **not** reopen the Freeze.

---

## 4. Exact writable files (frozen)

**No broad directory write authorization.** Creating parent directories is incidental to creating the enumerated files only.

### 4.1 REQUIRED writable surfaces

| PATH | NEW / EXISTING | PURPOSE | WHY REQUIRED | AUTHORIZED MUTATION TYPE |
|------|----------------|---------|--------------|--------------------------|
| `src/decision/dossier/decisionDossierContract.js` | **NEW** | Schema/constants · output representation · honesty locks for `rsn.decision.dossier.result.v1` | Freeze schema + invariants | **CREATE** (post-EXECUTE) |
| `src/decision/dossier/decisionDossierBuilder.js` | **NEW** | Assemble bounded dossier from accepted DEC-INTAKE + accepted P2 result; entry gates; OPTIONAL_BOUNDED inclusion | Freeze assembly / REJECT_INPUT / BUILD | **CREATE** (post-EXECUTE) |
| `src/decision/dossier/validateDecisionDossier.js` | **NEW** | P3 proof harness implementing §12 obligations (+ Pre-IMPL P3-T01…T18 as applicable) | Mandatory P3 validator | **CREATE** (post-EXECUTE) |

**Minimum coherent file count:** **3** — maps 1:1 to Pre-IMPL candidate surfaces (contract · builder · proof harness). No additional files are required for the frozen P3 core contract.

### 4.2 OPTIONAL writable surfaces

| PATH | NEW / EXISTING | PURPOSE | WHY OPTIONAL | AUTHORIZED MUTATION TYPE |
|------|----------------|---------|--------------|--------------------------|
| `src/decision/dossier/index.js` | **NEW** | Thin barrel re-export of contract / builder / validator | Convenience only | **CREATE** only if EXECUTE needs a single import seam |

Optional file must not add semantics beyond re-export of §4.1 surfaces.

### 4.3 Explicitly NOT writable

| Surface | Binding |
|---------|---------|
| Any path outside §4.1 / §4.2 | **STOP** |
| `src/factory/**` | **FORBIDDEN** |
| `src/decision/intake/**` | **FORBIDDEN** (P1 closed predecessor — **READ ONLY**) |
| `src/decision/semantics/**` | **FORBIDDEN** (P2 closed predecessor — **READ ONLY**) |
| Jurisdiction / CB-08 / CB-09 / CB-16 Factory source | **FORBIDDEN** |
| `src/lib/dealPipeline.js` | **FORBIDDEN** · **NON-CANONICAL** · **NON-AUTHORITY** |
| Product / Marketplace / Publication / P4 modules | **FORBIDDEN** |
| DB / Supabase / migrations / RLS / Auth / Storage / Edge | **FORBIDDEN** |

```text
IF IMPLEMENTATION WOULD REQUIRE MUTATION OUTSIDE §4.1 / §4.2:
  DO NOT AUTHORIZE IT.
  STOP.
```

---

## 5. Read-only consume surfaces

### 5.1 P1 predecessor (READ ONLY)

| Path | Role |
|------|------|
| `src/decision/intake/**` | Accepted `DEC-INTAKE` input predecessor — **READ ONLY** |

Normal P3 processing **requires** valid accepted `DEC-INTAKE` (`accepted === true`, `state === DEC-INTAKE`).

### 5.2 P2 predecessor (READ ONLY)

| Path | Role |
|------|------|
| `src/decision/semantics/**` | Accepted `rsn.decision.semantics.result.v1` input predecessor — **READ ONLY** |

Normal P3 processing **requires** valid accepted P2 semantics result corresponding to the same DEC-INTAKE lineage.

### 5.3 Factory (READ ONLY)

P3 may **import/consume** Factory package projections / schemas only as needed to **read** lineage/identity already present on accepted P1 projection.

**No Factory source file is writable.**

```text
src/factory/** = READ ONLY / FORBIDDEN MUTATION
CB-08 / CB-09  = READ ONLY consume · NO mutation · NO truth repair
CB-16          = READ ONLY (trusted package frontier)

NO SUPPLEMENTAL FACTORY AUTHORITY EXISTS.
```

---

## 6. Entry / rejection contract (binding)

### 6.1 REJECT_INPUT / NO DOSSIER

Emit **no** `rsn.decision.dossier.result.v1` when **any** of:

- DEC-INTAKE missing
- DEC-INTAKE malformed
- DEC-INTAKE unaccepted
- P2 semantic result missing
- P2 semantic result malformed
- P2 schema/version unsupported (`schemaId` must be `rsn.decision.semantics.result.v1`)
- P1/P2 lineage mismatch
- unsupported required dossier schema/version class
- required provenance missing
- required provenance inconsistent

```text
No repair.
No fallback synthesis.
No winner selection.
No synthetic provenance.
No coercion into a valid dossier.
```

Rejected input produces **NO** dossier object — therefore **no** rejected dossier `meta.state` token.

### 6.2 Valid construction — BUILD faithfully

With valid accepted P1 + valid accepted P2, P3 **MUST BUILD** a dossier while faithfully preserving upstream P2 honesty/distress-axis states:

| Upstream | Construction |
|----------|--------------|
| **EVIDENCED** | **BUILD** · preserve |
| **NONE** | **BUILD** · preserve |
| **INSUFFICIENT_EVIDENCE** | **BUILD** · preserve |
| **CONFLICT_BLOCKED** | **BUILD** · preserve |

```text
P2 honesty halt states DO NOT by themselves prevent P3 dossier construction.
P3 assembles and preserves.
P3 does NOT re-adjudicate P1/P2.
```

---

## 7. Output contract — Grant-time engineering freeze

### 7.1 Meta (required)

| Field | Binding |
|-------|---------|
| `meta.schemaId` | Fixed: **`rsn.decision.dossier.result.v1`** |
| `meta.version` | Fixed: **`v1`** |
| `meta.ruleVersion` | Fixed: **`sp05-p3-dossier.v1`** |
| `meta.state` | Fixed: **`DEC-DOSSIER`** |

`DEC-DOSSIER` means **only** accepted construction of the emitted dossier artifact. It **MUST NOT** mean opportunity · priority · recommendation · investment quality · commercial status · workflow stage · transaction state.

### 7.2 Required top-level catalog (exact)

1. `meta`
2. `input`
3. `semantics`
4. `honesty`
5. `invariants`

**No sixth required top-level section.**

### 7.3 `input` (required nested)

| Field | Binding |
|-------|---------|
| `input.decIntakeState` | Must equal `DEC-INTAKE` |
| `input.factoryKey` | From accepted intake / package lineage |
| `input.packageVersion` | From accepted package meta when present |
| `input.deliveryId` | From intake when available; else `null` |
| `input.acceptedAt` | From intake when available; else `null` |
| `input.p2SchemaId` | Must equal `rsn.decision.semantics.result.v1` |
| `input.p2RuleVersion` | From accepted P2 result |
| `input.propertyRef` | Bounded property identity reference from accepted package (e.g. `factory_key` / package identity) — **not** full P1 dump |
| `input.jurisdictionRef` | Bounded jurisdiction reference from accepted package — **not** full P1 dump |

Full P1 package duplication is **FORBIDDEN**.

### 7.4 `semantics` (required nested — preserve-only cites)

| Field | Binding |
|-------|---------|
| `semantics.classifyDeal` | Faithful SEM-01 cite from P2 (`state` only) |
| `semantics.opportunity` | Faithful SEM-02 cite from P2 (`state` only) · distress-only lock preserved |
| `semantics.reviewPriority` | Faithful SEM-03 cite from P2 (`state` only) |
| `semantics.halt` | Faithful SEM-06 / halt cite from P2 (`null` or halt state) |
| `semantics.evidenceVector` | Faithful Evidence Vector cite including `DISTRESS_EVIDENCE_STATE` |
| `semantics.ranking` | **OPTIONAL_BOUNDED** — see §8.1 |

P3 **MUST NOT** recalculate SEM-01…SEM-06, Evidence Vector, or distress state.
P3 **MUST NOT** introduce a second VALUE axis.
P3 **MUST NOT** introduce economic attractiveness semantics.

### 7.5 `honesty` (required nested)

| Field | Binding |
|-------|---------|
| `honesty.unknown` | Preserve applicable UNKNOWN context from P1/P2 lineage |
| `honesty.conflict` | Preserve applicable conflict context |
| `honesty.freshness` | Preserve freshness honesty (`stale ≠ false` · `freshness ≠ truth` · `UNKNOWN_FRESHNESS ≠ current`) |
| `honesty.provenance` | Required deterministic lineage object (§9) |
| `honesty.factRefs` | Bounded FACT/source path references needed to interpret cited conclusions |
| `honesty.boundedDataLimitations` | Bounded-data / jurisdiction / RECORDED_REAL limitation honesty |
| `honesty.limitations` | Applicable honesty limitations (trust≠readiness; readiness≠opportunity; etc.) |
| `honesty.economicContext` | **OPTIONAL_BOUNDED** — see §8.2 |
| `honesty.ownerRef` | **OPTIONAL_BOUNDED** — see §8.3 |
| `honesty.ownerIdentity` | **OPTIONAL_BOUNDED** — see §8.3 |
| `honesty.optionalOmissions` | Optional array of bounded omission/error records for malformed/unusable OPTIONAL_BOUNDED content · **may be empty/absent** when unused |

Absence of an OPTIONAL_BOUNDED field = **ABSENT / NOT INCLUDED** — **not** UNKNOWN · NONE · negative evidence · rejection · rank effect.

### 7.6 `invariants` (required — boolean locks must be `true` on accepted output)

| Lock | Value |
|------|-------|
| `invariants.factIsNotDerived` | `true` |
| `invariants.unknownIsNotNone` | `true` |
| `invariants.unknownIsNotZeroNegativeOrRejection` | `true` |
| `invariants.conflictIsNotRankPenalty` | `true` |
| `invariants.freshnessIsNotTruth` | `true` |
| `invariants.reviewPriorityIsNotTransactionAdvice` | `true` |
| `invariants.knownEconomicEvidenceIsNotFavorableEconomics` | `true` |
| `invariants.sem02DistressOnlyLockPreserved` | `true` |
| `invariants.noProductCommercialSemantics` | `true` |
| `invariants.noContactOutreachSemantics` | `true` |
| `invariants.dossierIsNotSp06Publication` | `true` |
| `invariants.decDossierIsNotOpportunity` | `true` |

---

## 8. OPTIONAL_BOUNDED content (Grant-time nested placement)

### 8.1 P2 ranking → `semantics.ranking`

| Rule | Binding |
|------|---------|
| Class | **OPTIONAL_BOUNDED** |
| Placement | Nested under **`semantics.ranking`** |
| Include when | P2 already lawfully emits a ranking object on the accepted result |
| Behavior | Preserve-only cite of P2 ranking fields (`schemaId`, `rank`, `candidateSetId`, `meaning`, and any audited additive fields such as `comparable` if present) |
| Forbidden | re-ranking · reorder · tie repair · new weighting · new rank generation |
| OBS-01 | Sequential same-state ranks preserved as emitted by P2 — **no remediation** |
| Absent / non-comparable (`rank: null` / missing) | Field **ABSENT / NOT INCLUDED** |

### 8.2 CB-09 economic context → `honesty.economicContext`

| Rule | Binding |
|------|---------|
| Class | **OPTIONAL_BOUNDED** |
| Placement | Nested under **`honesty.economicContext`** |
| Include when | CB-09 valuation/evidence FACT already lawfully present Decision-side on accepted input |
| Behavior | Evidence/context snapshot only · preserve UNKNOWN · provenance · freshness · conflict |
| Forbidden | ROI · ARV · cap rate · cash flow · discount logic · attractiveness · thresholds · investment conclusion · synthetic economic scoring |
| Absent | Field **ABSENT / NOT INCLUDED** |
| Malformed / unusable | Omit field · optionally record in `honesty.optionalOmissions` · do **not** halt required dossier |

### 8.3 ownerRef / owner identity → `honesty.ownerRef` / `honesty.ownerIdentity`

| Rule | Binding |
|------|---------|
| Class | **OPTIONAL_BOUNDED** |
| Placement | **`honesty.ownerRef`** · **`honesty.ownerIdentity`** |
| Include when | Bounded identity/honesty references already present in accepted input |
| Behavior | Identity/honesty references only |
| Forbidden | email · phone · contact data · contact eligibility · contact authorization · outreach · targeting · productization |
| Absent | Fields **ABSENT / NOT INCLUDED** |
| Malformed / unusable | Omit · optional omission record · do **not** halt required dossier |

### 8.4 Optional absence / malformation (binding)

```text
ABSENT / NOT INCLUDED
  ≠ UNKNOWN
  ≠ NONE
  ≠ negative evidence
  ≠ input rejection
  ≠ rank effect
  ≠ bad-property semantics

Malformed optional data:
  ≠ semantic repair
  ≠ inference
  ≠ contamination of required sections
  ≠ whole-dossier halt solely for optional malformation
```

---

## 9. Provenance / honesty (binding)

### 9.1 Required `honesty.provenance` elements

| Element | Binding |
|---------|---------|
| Decision Package identity | Required (`factoryKey` / package identity as available) |
| DEC-INTAKE identity/acceptance | Required |
| P2 result identity | Required |
| P2 `schemaId` / `ruleVersion` | Required |
| FACT/source references for cited conclusions | Required (may mirror `honesty.factRefs`) |
| Dossier `schemaId` / `version` / `ruleVersion` | Required |

Missing or inconsistent **required** provenance → **REJECT_INPUT / NO DOSSIER**.
Provenance synthesis is **FORBIDDEN**.

### 9.2 Freshness

```text
stale              ≠ false
freshness          ≠ truth
UNKNOWN_FRESHNESS  ≠ current
```

No expiry threshold may be invented.
Stale or UNKNOWN freshness alone does **NOT** halt construction when the required input contract remains valid.

### 9.3 UNKNOWN / NONE / CONFLICT

- Preserve upstream UNKNOWN; never coerce; do not collapse distinct UNKNOWN states without authority.
- Optional absence ≠ UNKNOWN.
- NONE ≠ UNKNOWN ≠ ABSENT; distress NONE remains axis-scoped.
- P2 `CONFLICT_BLOCKED` / P1 material conflict: BUILD and preserve when lineage valid.
- Unrelated conflict: context only.
- P1/P2 lineage contradiction: **REJECT_INPUT / NO DOSSIER**.
- Never average · suppress · choose winner · silently repair · convert conflict to rank penalty.

---

## 10. Determinism (binding)

Same accepted P1 input + same accepted P2 semantic input **MUST** produce a **semantically identical** dossier.

**Forbidden:**

- randomness
- wall-clock-derived semantic meaning
- hidden entropy
- repair heuristics
- re-ranking
- economic inference
- source-count / motor-count weighting

A traceability timestamp, if present for audit metadata only, **MUST NOT** become semantic input.

---

## 11. Immutability (binding — Grant-time mechanism)

| Rule | Binding |
|------|---------|
| P1 input | **READ ONLY** |
| P2 input | **READ ONLY** |
| Factory | **READ ONLY** |
| Output | **NEW** Decision-side derived artifact |
| Write-back to Factory / P1 / P2 | **FORBIDDEN** |
| Source identities | Unchanged |
| Shared writable-reference mutation leakage | **FORBIDDEN** |

**Exact mechanism (frozen by this Grant):**

1. Builder **MUST NOT** mutate accepted P1/P2 objects (no in-place assignment into predecessor graphs).
2. Builder **MUST** construct a **new** plain object tree for the dossier.
3. Builder **MUST** deep-freeze the emitted dossier (recursive `Object.freeze`, same class of mechanism as P1 `immutableDecisionProjection`) before return.
4. Any nested cite values copied from P1/P2 **MUST** be defensively copied when necessary to prevent shared writable-reference leakage; prefer primitive/string cites and shallow structural copies of already-frozen P2 subtrees over live shared mutables.

```text
FACTORY TRUTH IMMUTABLE FROM DECISION
P1 / P2 = CLOSED PREDECESSORS / READ ONLY
DECISION DOSSIER = NEW DERIVED ARTIFACT ONLY
```

---

## 12. Proof obligations (frozen for future IMPL)

### 12.1 P3 Grant acceptance matrix (mandatory)

| ID | Obligation |
|----|------------|
| **P3-G01** | Accepted P1 `DEC-INTAKE` required as normal P3 input |
| **P3-G02** | Accepted P2 `rsn.decision.semantics.result.v1` required as normal P3 input |
| **P3-G03** | Required dossier schemaId/version/`ruleVersion`/`state` validation on accepted output |
| **P3-G04** | P1/P2 lineage match required; mismatch → REJECT_INPUT / NO DOSSIER |
| **P3-G05** | Required provenance present and consistent; missing/inconsistent → REJECT_INPUT / NO DOSSIER |
| **P3-G06** | Output `schemaId`/`version`/`state` exact: `rsn.decision.dossier.result.v1` · `v1` · `DEC-DOSSIER` |
| **P3-G07** | Exact required top-level catalog only: `meta` · `input` · `semantics` · `honesty` · `invariants` |
| **P3-G08** | Deterministic construction for identical accepted P1+P2 |
| **P3-G09** | P1 input unchanged after dossier construction |
| **P3-G10** | P2 input unchanged after dossier construction |
| **P3-G11** | Factory / no-write-back boundary preserved |
| **P3-G12** | EVIDENCED preserved on valid inputs |
| **P3-G13** | NONE preserved on valid inputs (axis-scoped) |
| **P3-G14** | INSUFFICIENT_EVIDENCE preserved on valid inputs |
| **P3-G15** | CONFLICT_BLOCKED preserved on valid inputs |
| **P3-G16** | SEM-01 preserved (no reinterpretation) |
| **P3-G17** | SEM-02 preserved (distress-only lock; no invention of OPPORTUNITY/NOT_OPPORTUNITY) |
| **P3-G18** | SEM-03 preserved (no reinterpretation) |
| **P3-G19** | SEM-06/halt preserved |
| **P3-G20** | Evidence Vector / `DISTRESS_EVIDENCE_STATE` preserved |
| **P3-G21** | Ranking preserve-only when present · no re-ranking / reorder / tie repair / weighting |
| **P3-G22** | Optional absence = ABSENT / NOT INCLUDED (≠ UNKNOWN/NONE/rejection/rank effect) |
| **P3-G23** | Malformed optional content isolated · does not contaminate required sections · does not halt solely therefor |
| **P3-G24** | CB-09 context cannot become economic attractiveness / ROI / ARV / cap rate / cash flow / discount / investment conclusion |
| **P3-G25** | ownerRef/identity cannot become contact data / outreach / targeting / authorization |
| **P3-G26** | UNKNOWN / conflict / freshness honesty preserved |
| **P3-G27** | No synthesized provenance |
| **P3-G28** | No Product / Premium / Diamond / `access_tier` / strategy leakage |
| **P3-G29** | No BUY/SELL/INVEST / transaction-advice / brokerage / representation / intermediation leakage |
| **P3-G30** | Invalid required input → REJECT_INPUT / NO DOSSIER |

**Proof obligation count:** **30**

### 12.2 Pre-IMPL P3-T01…T18 (preserved as applicable)

Pre-IMPL proof class P3-T01…T18 remains binding honesty/regression coverage where not already subsumed by P3-G01…G30. Obligations **MUST NOT** shrink below the Freeze/Pre-IMPL class.

```text
NO P3 CLOSURE IF ANY REQUIRED PROOF OBLIGATION FAILS.
```

---

## 13. Hard exclusions (binding)

This Grant **MUST NOT** authorize introduction of:

- BUY · SELL · INVEST · MAKE OFFER
- transaction advice · brokerage · representation · intermediation
- owner contact · owner outreach · targeting · contact authorization/eligibility
- Premium · Diamond · `access_tier`
- Product · Marketplace
- strategy selection · DG-01 A/B implementation
- SP06 Publication · SP07 · SP08
- P4 closure / CAP finalization as P3 DoD
- numeric Decision score · invented weights · ROI · commercial bands
- economic attractiveness invention
- Live · LLM · nationwide rollout
- Factory / P1 / P2 source mutation
- `src/lib/dealPipeline.js` (NON-CANONICAL / NON-AUTHORITY)
- DB · Supabase · migrations · RLS · Auth · Storage · Edge Functions
- new npm dependencies / upgrades
- payments · Stripe · CRM

```text
REVIEW_PRIORITY        = review prioritization only
OPPORTUNITY_CANDIDATE  = bounded P2 semantics only
Neither is a purchase / investment recommendation.
```

**PRE-LAUNCH LEGAL REVIEW REQUIRED** remains preserved.

---

## 14. DG-01 (binding)

| Item | State |
|------|-------|
| DG-01 | **UNRESOLVED — PARTIAL** |
| Question A (Premium / Diamond / `access_tier`) | **PARKED OUT OF P3 CORE** |
| Question B (strategy selection) | **PARKED OUT OF P3 CORE** |
| Authority under this Grant | **ZERO** |

```text
GRANT ≠ RESOLVE DG-01
```

---

## 15. OBS-P3-F01…F04 (non-blocking — carried)

| ID | Observation | Grant posture |
|----|-------------|---------------|
| **OBS-P3-F01** | Optional nested paths for CB-09 / ownerRef were class-frozen only | **CONCRETIZED** by §8 — not a Freeze reopen |
| **OBS-P3-F02** | Provenance elements frozen without full P2-style field map | **CONCRETIZED** by §7.3 / §9 — not a Freeze reopen |
| **OBS-P3-F03** | Trust/readiness carried via honesty limitations + P2 preservation | **PRESERVED** via `honesty.limitations` + invariants — non-blocking |
| **OBS-P3-F04** | Abbreviated P2 Complete hash in Freeze metadata | Documentary precision only — **NO SEMANTIC EFFECT** |

```text
OBSERVATIONS ≠ NEW REQUIREMENTS
NO FREEZE REOPEN
NO OBSERVATION REMEDIATION AUTHORITY BEYOND GRANT-TIME ENGINEERING DETAIL ABOVE
```

---

## 16. Stop conditions

**STOP** (do not implement / do not expand) if EXECUTE would require:

- mutation outside §4.1 / §4.2
- new required top-level section
- new semantic vocabulary beyond Freeze
- DG-01 A/B fields
- Product / Marketplace / SP06+ / contact / transaction semantics
- economic attractiveness invention
- P1/P2/Factory write-back
- observation “fixes” that change P2 OBS-01…OBS-04 or Freeze Blockers 1–4

---

## 17. Completion semantics (future — not claimed by this Grant)

After later Director EXECUTE + IMPL + Independent Post-IMPL Audit PASS/PWO + Complete Status:

| Claim | Allowed later |
|-------|---------------|
| SP05-P3 dossier core COMPLETE | Only via future Complete Status |
| C-CAP-SP05-06 advanced | Yes (bounded) |
| SP05 COMPLETE | **NO** |
| P4 opened | **NO** by P3 Complete alone |
| DG-01 resolved | **NO** |

This Grant publication alone claims **NONE** of the above.

---

## 18. Authority effect after Continuity publication

```text
WHEN Continuity-published + sync CLEAN:

  SP05-P3-GRANT / DAG-SP05-P3-G1 = PUBLISHED
  IMPLEMENTATION AUTHORITY       = AWAITING DIRECTOR EXECUTE
  CODE AUTHORITY                 = NONE UNTIL EXPLICIT:
                                    "Aprobado. Ejecuta."
  P3 IMPL                        = NOT STARTED
  P3 COMPLETE                    = NO
  P4 / SP06 / SP07 / SP08        = NOT OPENED
  DG-01                          = UNRESOLVED — PARTIAL

NEXT GATE:
  STOP.
  WAIT FOR DIRECTOR EXPLICIT:
    Aprobado. Ejecuta.
  before any P3 source implementation under §4.1 / §4.2.
```

---

## Binding footer

```text
DAG-SP05-P3-G1
  = Bounded Grant for SP05-P3 Decision Dossier CORE ONLY
  = Writable: decisionDossierContract · decisionDossierBuilder · validateDecisionDossier
  = Controls: SP05-P3-DOSSIER-FREEZE-01
  = Proofs: P3-G01…P3-G30

GRANT PUBLISHED ≠ CODE AUTHORIZED
GRANT PUBLISHED ≠ IMPLEMENTATION STARTED
GRANT PUBLISHED ≠ DIRECTOR EXECUTE

≠ DG-01 RESOLUTION
≠ Premium / Diamond / access_tier / strategy
≠ Product / Marketplace / SP06–08
≠ BUY / SELL / INVEST / owner outreach
≠ P4
≠ P1 / P2 / Factory mutation

PRE-LAUNCH LEGAL REVIEW REQUIRED
FACTORY / P1 / P2 = READ-ONLY
DECISION OUTSIDE FACTORY INTERNALS
```

**END OF SP05-P3-GRANT / DAG-SP05-P3-G1**

# PRE-SP05 CONTINUITY WORKSTREAM
## PS05-03 — INDEPENDENT PRE-IMPLEMENTATION AUDIT
### Provenance + Fact Typing + Unknown + Exhaustion + Conflict + Freshness
#### Document ID: PRE-SP05-PS05-03-PRE-IMPL

| Campo | Valor |
|-------|--------|
| **Document ID** | **`PRE-SP05-PS05-03-PRE-IMPL`** |
| **Audit ID** | **`PRE-SP05-PS05-03-PRE-IMPL`** |
| **Document type** | **PRE-SP05 Independent Pre-Implementation Audit** |
| **File ID** | `FACTORY_EVOLUTION_PRE_SP05_PS05_03_INDEPENDENT_PRE_IMPLEMENTATION_AUDIT.md` |
| **Path** | `docs/factory-evolution/FACTORY_EVOLUTION_PRE_SP05_PS05_03_INDEPENDENT_PRE_IMPLEMENTATION_AUDIT.md` |
| **Nature** | Independent **Pre-IMPL Audit** of Mandate `PRE-SP05-PS05-03-ENG-IMPL` · **STRICT READ ONLY / DOCUMENTATION ONLY** · evidence-based writable-surface determination · **≠ code** · **≠ IMPL started** · **≠ SP05 OPEN** · **≠ Living IA PROVED** |
| **Audit object** | `PRE-SP05-PS05-03-ENG-IMPL` (PS05-03 Provenance / Fact Typing / Unknown / Min Exhaustion / Conflict / Freshness Mandate) |
| **Block ID** | **PS05-03** |
| **Workstream** | **PRE-SP05 Continuity workstream** |
| **Parent Mandate** | Continuity-published `PRE-SP05-PS05-03-ENG-IMPL` (same Continuity session; Mandate first) |
| **Parent PS05-02** | Continuity Commit **`1f0abc736ca5c27d422ac8de7797df6659a20898`** · **COMPLETE** · P03 must remain SATISFIED WITH OBSERVATION |
| **Parent tip at audit drafting** | **`1f0abc736ca5c27d422ac8de7797df6659a20898`** |
| **Verdict** | **PASS WITH OBSERVATIONS** |
| **Date** | **2026-08-12** |
| **Branch** | `integration/factory-complete-20260725` |
| **Mode** | **DOCUMENTARY ONLY** (this file) |

```text
PRE-SP05-PS05-03-PRE-IMPL
  = Independent Pre-IMPL of PS05-03 ONLY
  ≠ CODE
  ≠ Director EXECUTE by this file alone
  ≠ SP05 OPEN
  ≠ PS05-04 OPEN
  ≠ Invented Obl honesty
  ≠ Full DDI runtime / temporal ledger
  ≠ Full CB-16 trusted redesign (PS05-05)
```

---

## 0. Honesty banner

```text
PS05-00 = COMPLETE
PS05-01 = COMPLETE
PS05-02 = COMPLETE
PS05-03 code = NOT STARTED
SP05 = NOT OPENED
Living IA / GAP-RK-IA / GAP-LIVE-LLM = NOT PROVED
This audit ≠ implementation authorization by existence
Architecture redesign required? NO
```

---

## 1. Audit objectives

1. Confirm Mandate scopes exclusively M09–M15 / I03·I07·I08·I09·I10·I17 / P04·P05·P08·P09.
2. Trace SourceRef, Evidence, freshness, conflict, DKN, canonical fact, CB-16 surfaces.
3. Determine reuse vs new thin helpers; freeze exact writable surfaces and T01–T11.
4. Confirm PS05-01/PS05-02 preservation feasible.
5. Emit Verdict without authorizing code.

---

## 2. Verified M09–M15 technical findings

### 2.1 M09 — Fact-level provenance — **CONFIRMED DEFICIT (bounded)**

| Existing | Proves |
|----------|--------|
| `src/factory/cb02/sourceRef.js` `buildSourceRef` | Organism/family/epistemic, `acquiredAt`, `vintageAt`, freshness blob, lowConfidenceFlags |
| `src/factory/cb06/evidenceRef.js` | EvidenceRef ↔ `sourceRefId` |
| `canonicalPropertyFactAdapter.js` | `sourceIdentity.sourceRefIds`, `rawIdentifiers` |
| Domain knowledge stores | Bundle-level `sourceRefs[]` on deltas |

**Gap:** Decision-relevant facts are not uniformly bound to a fact-level provenance envelope. Bundle SourceRefs + rawIdentifiers are necessary but insufficient for I07 “every Decision fact has provenance or explicit unknown.”

**Reuse:** Extend SourceRef linkage; do **not** duplicate SourceRef architecture.

### 2.2 M10 — Fact typing — **CONFIRMED DEFICIT**

| Existing | Partial signal |
|----------|----------------|
| `decisionTrustBoundary.js` | `SOURCE_MODE`, trustClass STUB/TRUSTED/UNAVAILABLE |
| Evidence E-levels | Epistemic strength, not fact type |
| `trustMeta` on canonical fact | Synthetic/stub/decisionTrusted |

**Gap:** No explicit OBSERVED/DERIVED/ESTIMATED/UNKNOWN/CONFLICTING/STALE/SYNTHETIC/STUB fact-type field on a reusable envelope.

**Placement (audit freeze):** Prefer **one reusable CB-02 helper** producing a min envelope attachable to canonical facts and Decision-facing package slices — not a separate type system per CB.

### 2.3 M11 — Dynamic unknown / missing — **CONFIRMED DEFICIT (blocking honesty if left)**

| Path | Behavior |
|------|----------|
| `knownUnknownsRegistry.js` `buildDefaultKnownUnknowns` | Hardcodes DKN-001/002 with `obligation: "Obl"`, `declared: true` |
| `validateKnownUnknowns` | Requires `obl.length > 0` — **rewards invented Obl** |
| `readinessGates.js` G5 | Passes when Obl unknowns declared |

**Finding:** Unknowns are currently inventable to satisfy readiness. This is exactly O07 / Mandate M11 deficit.

**Target:** Compute unknowns from missing expected Decision-relevant fact classes and/or source-class outcomes. G5 must consume computed honesty, not hardcoded Obl.

### 2.4 M12 — Minimum source exhaustion — **CONFIRMED DEFICIT**

Organism catalog + pack `organismsPresent` show presence, not completeness states. DST “exhausted” / FIN-X ≠ source exhaustion (PS05-00 O06).

**Target states:** EXPECTED | CHECKED | NOT_CHECKED | FAILED | UNAVAILABLE | PROHIBITED | STALE for **bounded Decision-relevant source classes** (e.g. assessor/GIS/recorder for current handoff) — not nationwide source universe.

### 2.5 M13 — Minimum fact exhaustion — **CONFIRMED DEFICIT**

EVF-05 sufficiency (`sufficiencyGate.js`) and CB-16 `checkExpedienteCompleteness` prove domain/expediente coverage — **not** min Decision fact-set FOUND/UNKNOWN/UNAVAILABLE/… matrix.

**Target:** Minimum Decision-relevant fact-set status enum without Deal Dossier / DDI runtime.

### 2.6 M14 — Conflict preservation — **PARTIAL; Decision-facing gap**

| Existing | Behavior |
|----------|----------|
| `conflictRules.js` R1–R8 | ACCEPT / BLOCK / DERIVE_EVIDENCE; `assertNoAveraging` |
| MotEvd02 + `conflictLadder.js` | Hierarchy; OPEN conflicts stored |
| ELR `conflict_resolutions` | Raw dump into CB-16 `elrExport` |

**Gap:** No first-class Decision-facing conflict slice guaranteeing survival/visibility for Decision consumers. Silent overwrite risk remains on paths that project single values without conflict state.

**Required:** Package hook and/or fact envelope `conflictState` so conflicts survive or explicit authority resolution retains lineage.

### 2.7 M15 — Freshness preservation — **PARTIAL; Decision-facing gap**

| Existing | Behavior |
|----------|----------|
| `freshnessPolicy.js` `evaluateFreshness` | fresh/degraded + ageDays |
| SourceRef.freshness / vintageAt | Attached at ingest/enrichment |
| FND FRS + PS05-01 | Stale Decision path → UNAVAILABLE |

**Gap:** Decision package lacks first-class CURRENT/STALE/UNKNOWN_FRESHNESS on Decision-relevant facts. Unknown freshness can be silently treated as current if only presence is checked.

---

## 3. Existing architecture to preserve (do not redesign)

1. SourceRef / EvidenceRef spine (CB-02 / CB-06)
2. Freshness profiles + evaluateFreshness (CB-02)
3. Conflict rules R1–R8 + MotEvd02 no averaging (CB-02 / CB-06)
4. Canonical property fact `rsn.canonical.property.fact.v1` (PS05-02)
5. Decision trust boundary vocabulary (PS05-01)
6. CB-16 sectioned package + trust refuse/hard-mark (PS05-01) — **extend with thin hooks only**
7. Readiness G0–G6 structure — repair G5 honesty, do not invent new gate constitution

**Architecture redesign required? NO.**

---

## 4. Minimum fact / provenance envelope (audit freeze)

Introduce **one** reusable helper module (new file under CB-02), e.g. class name freeze:

- `src/factory/cb02/decisionFactEnvelope.js` (name may be finalized in IMPL if equivalent)

Minimum envelope fields (null-honest):

```text
factId | factClass | factType
sourceRefId | organismId | jurisdiction
rawRecordRef
acquiredAt | vintageAt
derivationRef
trustMeta | conflictState | freshnessState
status (fact exhaustion status)
```

Attach to:

- canonical property fact (extend, do not replace schemaId);
- Decision package thin section (e.g. `facts` or nested under `evidence` / dedicated `provenance` hook — IMPL chooses one coherent placement without new CB).

---

## 5. Dynamic unknown semantics (audit freeze)

Minimum Decision-relevant expected fact classes for current Factory handoff (bounded):

| Fact class | Expected when |
|------------|---------------|
| propertyIdentity | Decision-facing IDN path |
| jurisdiction | Decision-facing identity/jurisdiction |
| ownerRef | OWN path Decision-relevant |
| sourceCompleteness | ASR/GIS/(RCR) class status |
| conflictState | when multi-source disagreement exists |
| freshnessState | when vintage evaluated |
| trustMeta | always on Decision facts |

Derivation rule:

```text
missing expected FOUND value
  AND source not providing it
  → UNKNOWN (or UNAVAILABLE if source FAILED/UNAVAILABLE/PROHIBITED)
```

Hardcoded Obl DKN-001/002 **must not** remain the sole G5 satisfaction path.

---

## 6. Source exhaustion semantics (audit freeze)

States:

```text
EXPECTED | CHECKED | NOT_CHECKED | FAILED | UNAVAILABLE | PROHIBITED | STALE
```

Bounded source classes for current handoff: at minimum REGISTRAL_ASSESSOR, GIS_OFFICIAL, REGISTRAL_RECORDER (organism-present pack path). Additional classes only if already Decision-facing.

Helper freeze candidate: `src/factory/cb02/sourceCompleteness.js` (or combined envelope module exports).

---

## 7. Fact exhaustion semantics (audit freeze)

Statuses:

```text
FOUND | UNKNOWN | UNAVAILABLE | CONFLICTING | STALE | DERIVED | ESTIMATED
```

Emitted on envelope `status` and summarized into Decision package completeness hook. Completeness ≠ quality/readiness score inflation.

---

## 8. Conflict semantics (audit freeze)

1. Preserve MotEvd02 OPEN conflicts.
2. Envelope `conflictState`: `NONE | OPEN | RESOLVED_WITH_AUTHORITY`.
3. CB-16 thin `conflicts` (or equivalent) slice listing OPEN conflicts with SourceRef lineage.
4. No averaging; no silent single-value overwrite without conflictState.

---

## 9. Freshness semantics (audit freeze)

Map `evaluateFreshness` → Decision-facing:

| Policy result | Decision freshnessState |
|---------------|-------------------------|
| fresh === true | CURRENT |
| degraded / !fresh | STALE |
| missing_vintage / unknown_profile / absent | UNKNOWN_FRESHNESS |

UNKNOWN_FRESHNESS must not be treated as CURRENT in package consumers/tests.

---

## 10. Authorized writable surfaces (EXACT)

### NEW (authorized)

| Path | Role |
|------|------|
| `src/factory/cb02/decisionFactEnvelope.js` | Fact type + provenance + conflict/freshness/status envelope builder |
| `src/factory/cb02/sourceCompleteness.js` | Min source-class exhaustion states |
| `src/factory/cb02/factCompleteness.js` | Min Decision fact-set status aggregation (may be merged into envelope module if IMPL keeps single file — then only one NEW path; Pre-IMPL prefers clear separation but allows merge if documented in IMPL report) |

If IMPL merges completeness helpers into `decisionFactEnvelope.js`, **only that one NEW helper file** is required; do not create unnecessary parallel modules.

### MODIFIED (authorized)

| Path | Role |
|------|------|
| `src/factory/cb02/connectors/canonicalPropertyFactAdapter.js` | Attach envelope fields; no invented values |
| `src/factory/cb02/connectors/recordedPackEnrichmentAdapter.js` | Propagate SourceRef lineage / freshness into envelope |
| `src/factory/cb13/knownUnknownsRegistry.js` | Computed unknowns from missing/unavailable outcomes |
| `src/factory/cb13/readinessGates.js` | G5 honesty consume computed unknowns (thin) |
| `src/factory/cb16/decisionPackageSchema.js` | Thin hooks: provenance/facts/unknowns/exhaustion/conflict/freshness slices |
| `src/factory/cb16/decisionPackageBuilder.js` | Populate hooks; preserve PS05-01 trust refuse |
| `src/factory/cb05/foundationMotorHandlers.js` | Thin propagate envelope markers on IDN/LOC Decision outputs |
| `src/factory/cb13/intelligenceMotorHandlers.js` | Thin propagate envelope / unknowns honesty |
| `src/factory/cb06/motEvd02.js` **OR** thin new export helper under `src/factory/cb06/` | Only if needed to expose OPEN conflicts without redesign — prefer thin helper `src/factory/cb06/conflictExport.js` (**NEW optional**) over MotEvd02 rewrite |
| `src/factory/cb02/validateCb02.js` | T01–T11 subset |
| `src/factory/cb05/validateCb05.js` | Regression + envelope consume |
| `src/factory/cb06/validateCb06.js` | Conflict preservation proofs |
| `src/factory/cb13/validateCb13.js` | Dynamic unknown / G5 honesty |
| `src/factory/cb16/validateCb16.js` | Package hook proofs + PS05-01 regression |

### READ-ONLY references (do not mutate unless Pre-IMPL above authorizes)

- `src/factory/cb02/sourceRef.js` — prefer call-site attach; mutate only if envelope cannot link without thin field export helper (default: **READ-ONLY**)
- `src/factory/cb02/freshnessPolicy.js` — **READ-ONLY** (call `evaluateFreshness`)
- `src/factory/cb02/conflictRules.js` — **READ-ONLY**
- `src/factory/cb05/decisionTrustBoundary.js` — **READ-ONLY**
- `src/factory/cb05/propertyIdentityResolver.js` — **READ-ONLY** (PS05-02 intact)
- `src/factory/cb06/evidenceRef.js`, `sufficiencyGate.js`, `conflictLadder.js` — **READ-ONLY** unless optional conflictExport NEW file chosen
- Pack fixtures under `data/factory-dso-packs/` — **READ-ONLY**

### Explicitly NOT writable

- CB constitutional redesign files
- PS05-04 economics/distress motors formulas
- Product / Marketplace / Supabase / Edge / Auth
- Dependencies / lockfiles

---

## 11. Required negative / proof tests (T01–T11)

| ID | Proof |
|----|-------|
| **T01** | Observed fact retains SourceRef lineage |
| **T02** | Derived fact identifies derivation/input lineage |
| **T03** | Missing expected fact → UNKNOWN, not invented value |
| **T04** | Missing/unavailable source → explicit source completeness state |
| **T05** | Conflicting facts survive as conflict or explicit authority resolution with lineage |
| **T06** | Stale fact remains marked stale downstream |
| **T07** | Unknown freshness is not treated as current |
| **T08** | Synthetic/stub fact types remain non-trusted |
| **T09** | PS05-02 canonical identity/jurisdiction remain intact |
| **T10** | Decision-facing package distinguishes completeness gaps without treating readiness as quality |
| **T11** | Existing CB-02/05/06/07/13/16 validations remain PASS |

---

## 12. Regression risks

| Risk | Mitigation |
|------|------------|
| G5 breaks if Obl removed without computed unknowns | Implement computed unknowns before removing hardcoded defaults; dual-path only temporarily if needed, never invent Obl |
| CB-16 schema expansion breaks shape validators | Thin additive sections; keep PS05-01 trust section semantics |
| Canonical fact shape drift breaks PS05-02 | Additive envelope fields only; preserve schemaId + identity/jurisdiction |
| MotEvd02 rewrite instability | Prefer conflictExport helper; avoid MotEvd02 logic rewrite |
| TrustClass vocabulary inconsistency (OBS from PS05-02) | Do not remediate here; keep decisionTrusted authoritative |

---

## 13. Non-blocking observations

| ID | Observation |
|----|-------------|
| **OBS-DKN-HARDCODE** | Current DKN Obl defaults are the primary M11 honesty defect; remediation is in-scope for PS05-03. |
| **OBS-CB16-HOOKS-ONLY** | Package hooks are thin; full trusted-corpus / readiness completion remains **PS05-05**. |
| **OBS-SUFFICIENCY-≠-EXHAUSTION** | EVF-05 sufficiency remains; min fact/source exhaustion is additive honesty, not sufficiency redesign. |
| **OBS-P03-SUBSTRATE** | PS05-02 P03 remains SATISFIED WITH OBSERVATION (RECORDED_ONLY synthetic-named pack); PS05-03 must not claim live identity. |
| **OBS-ENVELOPE-FILE-MERGE** | IMPL may merge `sourceCompleteness` / `factCompleteness` into `decisionFactEnvelope.js` if documented; do not proliferate modules. |
| **OBS-SOURCEREF-READONLY** | Prefer linking existing SourceRef ids over mutating `sourceRef.js`. |

---

## 14. Verdict

```text
VERDICT: PASS WITH OBSERVATIONS

Blocking findings: NONE
Architecture redesign required: NO
Mandate scope coherent with PS05-00 O06/O07/O13 + PS05-03 lineage: YES
Writable surfaces enumerable: YES
PS05-01 / PS05-02 preservation feasible: YES
PS05-03 code authorized by this audit file alone? NO
```

Mandate scope is implementable as **bounded helpers + thin package/motor hooks** on existing SourceRef / Evidence / freshness / conflict / canonical fact / DKN / CB-16 spine — without constitutional redesign, without Live, without invented Obl honesty, without absorbing PS05-04/05/06.

---

## 15. Exact next step after this Audit

```text
NEXT = Director EXECUTE / Execution Order for PS05-03 IMPL
     on authorized writable surfaces listed in §10
     implementing bounded design in §§4–9
     with T01–T11 proofs
     followed by validation + independent post-IMPL audit + Status + Git sync CLEAN

≠ auto-start code by this file
≠ PS05-04 OPEN
≠ SP05 OPEN
```

**END OF PRE-SP05-PS05-03-PRE-IMPL**

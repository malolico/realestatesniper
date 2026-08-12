# PRE-SP05 CONTINUITY WORKSTREAM
## PS05-01 — ENGINEERING IMPLEMENTATION MANDATE
### Truth Boundary — Synthetic / Stub / Fail-Closed Isolation
#### Document ID: PRE-SP05-PS05-01-ENG-IMPL

| Campo | Valor |
|-------|--------|
| **Document ID** | **`PRE-SP05-PS05-01-ENG-IMPL`** |
| **Mandate ID** | **`PRE-SP05-PS05-01-ENG-IMPL`** |
| **Document type** | **PRE-SP05 Engineering Implementation Mandate** |
| **File ID** | `FACTORY_EVOLUTION_PRE_SP05_PS05_01_ENGINEERING_IMPLEMENTATION_MANDATE.md` |
| **Path** | `docs/factory-evolution/FACTORY_EVOLUTION_PRE_SP05_PS05_01_ENGINEERING_IMPLEMENTATION_MANDATE.md` |
| **Nature** | Director **Engineering class Mandate** for PRE-SP05 block **PS05-01 Truth Boundary** · authorizes enumerated adapters/guards only · **no code in this file** · **does not implement by existence** · **≠ SP05 OPEN** · **≠ SP09** · **≠ Living IA PROVED** · **≠ PS05-02+** |
| **Block ID** | **PS05-01** |
| **Workstream** | **PRE-SP05 Continuity workstream** |
| **Parent PS05-00** | Continuity Commit **`7dba31cf7b8ea3e202fb359c6a65afa34dee0e88`** · `PRE-SP05-PS05-00-OWN-SCOPE-01` · **COMPLETE** |
| **Parent tip at Mandate drafting** | **`7dba31cf7b8ea3e202fb359c6a65afa34dee0e88`** |
| **Authorizing Director act** | Continuity workstream PRE-SP05 established under PS05-00 · this Mandate opens the **PS05-01 engineering class lifecycle** only · code still requires Pre-IMPL PASS/PWO + Director EXECUTE / Execution Order |
| **Authorized technical class** | **Adapters / honesty guards / trust-boundary refuse-or-mark only** for M01–M03 |
| **Date** | **2026-08-12** |
| **Branch** | `integration/factory-complete-20260725` |
| **Mode** | **DOCUMENTARY ONLY** (this file) |

**Controlling precedent (minimum):** SP04 `SP04-ENG-IMPL` + `SP04-ENG-IMPL-PRE-IMPL` gate pattern (Mandate Continuity-published → Independent Pre-IMPL Audit PASS/PWO → subsequent Execution instrument before code). Complexity reduced: **one block (PS05-01)**, no CEP matrix.

```text
PRE-SP05-PS05-01-ENG-IMPL
  = Engineering class for PS05-01 Truth Boundary ONLY
  ≠ CODE BY THIS FILE
  ≠ PS05-01 IMPLEMENTATION STARTED
  ≠ SP05 OPEN
  ≠ SP09 / new Strategic Program
  ≠ Living Intelligence Alive PROVED
  ≠ GAP-RK-IA / GAP-LIVE-LLM PROVED
  ≠ PS05-02…PS05-07 IMPL
  ≠ economics/distress full remediation (PS05-04)
  ≠ normalization / entity resolution (PS05-02)
  ≠ provenance / unknown / exhaustion redesign (PS05-03)
  ≠ full CB-16 redesign (PS05-05)
```

---

## 0. Honesty banner

```text
SP01–SP04 COMPLETE = PRESERVED
SP05               = NOT OPENED
PS05-00            = COMPLETE
PS05-01 code       = NOT STARTED
Living IA          = NOT PROVED
GAP-RK-IA          = NOT PROVED
GAP-LIVE-LLM       = NOT PROVED
```

---

## 1. Purpose

Prevent **synthetic**, **stub**, or **source-failure-generated fake** business facts from crossing into a **Decision-trusted** path.

PS05-01 does **not** make economics/distress real. It only ensures contaminated facts cannot be treated as trusted Decision input.

**Invariants (target):** I01 · I02 · I04
**Proof obligations (target):** P11 · P13
**MUST RESOLVE:** M01 · M02 · M03

---

## 2. Authorized problem set

| ID | Problem | Mandate scope |
|----|---------|---------------|
| **M01** | Synthetic fallback/isolation | Silent synthetic→trusted forbidden; explicit synthetic test paths preserved |
| **M02** | Stub business fact isolation | Stub values must not become Decision-trusted unmarked |
| **M03** | Fail-closed source failure | Pack miss / stale / failure must not silently substitute synthetic truth on Decision path |

---

## 3. Required semantics

1. Synthetic data **may** remain for explicitly synthetic test/fixture paths (`forceSynthetic`, catalog regression).
2. Synthetic data **MUST NOT** silently become Decision-trusted fact.
3. Stub-generated business values **MUST NOT** become Decision-trusted facts merely because they satisfy a schema.
4. Source absence / failure / freshness breach **MUST NOT** silently substitute synthetic business truth on Decision-trusted resolution.
5. Failure / untrusted outcomes must use honest existing or minimal vocabulary, preferably:
   - `sourceMode: "SYNTHETIC_FIXTURE"` (identifiable, not trusted)
   - `synthetic: true`
   - `recordedSkippedReason` (already present)
   - and/or Decision-path outcomes equivalent to **UNAVAILABLE** / **UNKNOWN** / **UNTRUSTED** / **NOT_PROVED**
   without inventing broad new state machines unless Pre-IMPL Audit proves necessity.
6. Economics/distress **formula honesty** remains **PS05-04**. PS05-01 only blocks contaminated trust.

---

## 4. Authorized writable surfaces (class)

Writable surfaces are **bounded** to those confirmed by the PS05-01 Pre-IMPL Audit. Anticipated class (exact list = Pre-IMPL Audit §Authorized Writable Surfaces):

| Surface class | Intent |
|---------------|--------|
| CB-05 foundation source resolver | Fail-closed Decision path; preserve explicit synthetic |
| CB-13 intelligence source resolver | Same |
| CB-05 / CB-13 motor handlers | Propagate trust/unavailable markers only (no domain redesign) |
| CB-07…CB-10 motor handlers | **Marking-only** stub/trust metadata — **not** formula remediation |
| CB-16 builder / readiness / schema / validate | Minimal trust refuse/mark for Decision Package — **not** full redesign |
| Targeted validation tests | Prove P11 / P13; preserve explicit synthetic tests |

**Forbidden writable expansion:** CB constitutional redesign; Hardening; P-INT catalogs; Supabase; Live connectors; LLM; Product/Marketplace.

---

## 5. Forbidden scope (binding)

- SP05 Decision Engine / Decision Alive claims
- Ranking / Premium / Diamond / Deal Dossier / access_tier
- Live providers / credentials / scraping
- Full economics or distress remediation (PS05-04)
- Normalization / jurisdiction registry / entity resolution (PS05-02)
- Provenance / fact-typing / unknown / exhaustion redesign (PS05-03)
- Full CB-16 redesign beyond trust refuse/mark (PS05-05)
- Generalization / second-jurisdiction (PS05-06)
- LLM / Product / Marketplace / Supabase / DB / migrations / Edge / RLS / Auth / Storage
- Architecture redesign / new Strategic Program

---

## 6. Acceptance (PS05-01 cannot close unless)

Objective tests prove:

1. Missing recorded pack **cannot** silently become trusted synthetic truth on Decision path.
2. Stale / failed source **cannot** silently become trusted synthetic truth on Decision path.
3. Explicit synthetic fixture remains identifiable as synthetic.
4. Stub-generated facts **cannot** cross Decision-trusted boundary unmarked.
5. Negative tests **fail** when contaminated facts are presented as trusted.
6. Legitimate synthetic test paths remain usable when explicitly allowed (`forceSynthetic` / test-only).
7. No unrelated behavior changed outside authorized surfaces.

---

## 7. Gate chain before code

```text
1. This Mandate Continuity-published
2. Independent Pre-IMPL Audit PASS or PASS WITH NON-BLOCKING OBSERVATIONS Continuity-published
3. Director EXECUTE / Execution Order (or equivalent Grant) for PS05-01 IMPL
4. LOCAL = REMOTE · ahead = 0 · behind = 0 · WT CLEAN
→ THEN PS05-01 code mutation may begin on authorized writable surfaces only
```

```text
MANDATE PUBLISHED ≠ CODE AUTHORIZED
PRE-IMPL PASS     ≠ CODE AUTHORIZED BY AUDIT FILE ALONE
CODE STARTS ONLY AFTER DIRECTOR EXECUTE / EXECUTION ORDER
```

---

## 8. Post-implementation obligations

After code:

1. Validation / targeted tests PASS
2. Independent post-IMPL Technical Audit
3. PS05-01 Block Status / closure
4. commit → push → LOCAL=REMOTE · ahead=0 · behind=0 · WT CLEAN
5. Only then PS05-02 may open

---

## 9. Stop conditions

**STOP** if Mandate interpretation would require: opening SP05; creating SP09; Live/LLM; Product/Marketplace; solving PS05-02+; rewriting Living IA as PROVED; authorizing code without Pre-IMPL + Director EXECUTE.

---

**END OF PRE-SP05-PS05-01-ENG-IMPL**

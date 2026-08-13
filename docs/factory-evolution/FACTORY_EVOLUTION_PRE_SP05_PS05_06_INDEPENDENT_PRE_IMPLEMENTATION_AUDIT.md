# PRE-SP05 CONTINUITY WORKSTREAM
## PS05-06 — INDEPENDENT PRE-IMPLEMENTATION AUDIT
### Generalization + Isolation Proof
#### Document ID: PRE-SP05-PS05-06-PRE-IMPL

| Campo | Valor |
|-------|--------|
| **Document ID** | **`PRE-SP05-PS05-06-PRE-IMPL`** |
| **Audit ID** | **`PRE-SP05-PS05-06-PRE-IMPL`** |
| **Document type** | **PRE-SP05 Independent Pre-Implementation Audit** |
| **File ID** | `FACTORY_EVOLUTION_PRE_SP05_PS05_06_INDEPENDENT_PRE_IMPLEMENTATION_AUDIT.md` |
| **Path** | `docs/factory-evolution/FACTORY_EVOLUTION_PRE_SP05_PS05_06_INDEPENDENT_PRE_IMPLEMENTATION_AUDIT.md` |
| **Nature** | Independent **Pre-IMPL Audit** of Mandate `PRE-SP05-PS05-06-ENG-IMPL` · **STRICT READ ONLY / DOCUMENTATION ONLY** · evidence-based writable-surface freeze · **≠ code** · **≠ IMPL started** · **≠ SP05 OPEN** · **≠ Living IA PROVED** · **≠ Decision Engine** · **≠ nationwide Scale Out** · **≠ Maricopa RECORDED_REAL activation** |
| **Audit object** | `PRE-SP05-PS05-06-ENG-IMPL` (PS05-06 Generalization + Isolation Proof Mandate) |
| **Block ID** | **PS05-06** |
| **Workstream** | **PRE-SP05 Continuity workstream** |
| **Parent Mandate** | Same Continuity session · `PRE-SP05-PS05-06-ENG-IMPL` (Mandate first) |
| **Parent PS05-05** | Continuity Commit **`fa1b180fe233cc9bcba1cdf546cd648fdf20ec39`** · **COMPLETE** |
| **Parent tip at audit drafting** | **`fa1b180fe233cc9bcba1cdf546cd648fdf20ec39`** |
| **Verdict** | **PASS WITH OBSERVATIONS** |
| **Blocking findings** | **NONE** |
| **Date** | **2026-08-13** |
| **Branch** | `integration/factory-complete-20260725` |
| **Mode** | **DOCUMENTARY ONLY** (this file) |

```text
PRE-SP05-PS05-06-PRE-IMPL
  = Independent Pre-IMPL of PS05-06 ONLY
  ≠ CODE
  ≠ Director EXECUTE by this file alone
  ≠ SP05 OPEN
  ≠ PS05-07 OPEN
  ≠ PRE-SP05 COMPLETE
  ≠ nationwide / Scale Out
  ≠ Maricopa RECORDED_REAL requirement
  ≠ classify_deal / Premium / Diamond / ranking
  ≠ CB-15 orchestration redesign
  ≠ CB-16 trust-gate redesign
```

---

## 0. Honesty banner

```text
SP01–SP04 COMPLETE = PRESERVED
SP05               = NOT OPENED
PS05-00…PS05-05    = COMPLETE
PS05-06 IMPL       = NOT STARTED
PS05-07            = NOT OPENED
Living IA / GAP-*  = NOT PROVED
```

Audit tip verified: branch `integration/factory-complete-20260725` · HEAD = `origin` = `fa1b180…` · ahead=0 · behind=0 · WT expected to contain only this Mandate + this Audit at drafting (documentary dirty for Director review).

---

## 1. Mandate binding confirmation

| Check | Result |
|-------|--------|
| Purpose matches PS05-00 row PS05-06 | **YES** — Generalization + isolation proof |
| Authorized class = second-jurisdiction **or** generic contract + multi-key isolation | **YES** |
| Selected route = generic-contract with existing Pima as non-Maricopa instance | **YES** — respects OR (does not mandate both as separate acquisitions) |
| Forbidden New Factory / full Scale Out | **YES** |
| SP05 NOT OPENED · PS05-07 NOT OPENED | **YES** |
| M19 / M20 / I15 FINAL / P15–P17 named and scoped | **YES** |
| Observation ≠ authorization respected | **YES** — OBS consumed only as evidence of deficits / exclusions |

---

## 2. Evidenced current behavior (not assumed)

### 2.1 I15 foundation vs final gap

**Files:** `canonicalPropertyFactAdapter.js` · `propertyIdentityResolver.js` · `validateCb05.js`

- Decision-facing view uses `rsn.canonical.property.fact.v1` (not Maricopa payload schema literacy) — **I15 foundation HOLD**.
- Canonical adapter / identity expand still **hardcode Maricopa organism IDs** (`ORG-ASR-MC` / `ORG-GIS-MC` / `ORG-RCR-MC`) when building from packs.
- CB-05 already rejects `maricopa.parcel.*` as `definitiveKeyCandidate` — foundation guard only; **not** final second-instance proof.
- PS05-02 Complete Status: **final generalization proof remains PS05-06** — **CONFIRMED still open**.

### 2.2 Generic contract half-built (M19)

**File:** `src/factory/cb02/connectors/recordedPackValidator.js`

- `getRecordedContractByOrganismId` already resolves Maricopa **or** Pima contracts.

**File:** `src/factory/cb02/connectors/recordedPackEnrichmentAdapter.js`

- `buildRecordedEnrichmentSourceRef` still calls **`getMaricopaContractByOrganismId`** only.
- Pack organism gate still hard-requires **`ORG-ASR-MC` + `ORG-GIS-MC`**.
- Default pack root remains Maricopa pilot.

**Finding:** Deficit **M19 exists**. Matches parked **OBS-FND-MC-HARDREQUIRE**. Pima CB-08/09→CB-16 path works; **Pima-through-FND fails**.

### 2.3 Jurisdiction registry (O03 residual)

**File:** `src/factory/cb02/jurisdictionRegistry.js`

- `KNOWN_JURISDICTIONS` contains **only** `US-AZ-MARICOPA`.
- Pima is registered in organism catalog / packs (`US-AZ-PIMA`, `"Pima County, AZ"`) but **not** in bounded known registry.
- Unknown jurisdiction fails closed (no silent Maricopa invent) — preserve.

**Finding:** Minimum registry add for Pima is **in-scope** for honest key prefixes under selected route; full 50-state registry is **out**.

### 2.4 Multi-key isolation (M20 / P16)

**File:** `src/factory/cb05/propertyIdentityResolver.js`

- Cross-jurisdiction same APN → **NO_MATCH** (already coded).
- MATCH `canonicalKey` = `` `${jurisdictionId}:${keyBody}` `` — designed for isolation.
- Unresolved paths may emit `pending.parcel.*` (**OBS-PENDING-KEY** — preserve honesty; do not invent Maricopa).

**Finding:** Mechanism exists; **PS05-06 closure proof of Maricopa+Pima coexistence is not yet established** → M20/P16 justified.

### 2.5 Existing substrates (no new acquisition required)

| Substrate | Status |
|-----------|--------|
| Maricopa `pilot-001` | Synthetic-named recorded pilot — **negative** for RECORDED_REAL; must remain |
| Pima `real-pilot-001` | **RECORDED_REAL** published under PS05-04 — **sufficient non-Maricopa instance** |
| Maricopa RECORDED_REAL | **NOT present / NOT required** |

### 2.6 Deficit existence vs Mandate

| Mandate ID | Deficit exists in tip? | Evidence |
|------------|------------------------|----------|
| **M19** | **YES** | FND enrichment Maricopa-only contract + organism hard-require |
| **M20** | **YES** | Multi-jurisdiction key coexistence not closure-proved |
| **I15 FINAL** | **YES (open)** | Foundation only; final reserved to PS05-06 by Complete Status |

---

## 3. Selected proof route — sufficiency determination

| Route | Pre-IMPL determination |
|-------|------------------------|
| Generic-contract proof | **SUFFICIENT and SELECTED** |
| Second-jurisdiction as separate new acquisition | **NOT REQUIRED** |
| Existing Pima as non-Maricopa instance under generic path | **REQUIRED AS PROOF INSTANCE** (not new acquisition) |
| Synthetic second-jurisdiction fixture | **NOT REQUIRED** |
| Maricopa RECORDED_REAL | **NOT REQUIRED** — if IMPL discovers unexpected dependence → **STOP / Director decision** (do not auto-activate) |

**Why sufficient:** PS05-00 authorizes “second-jurisdiction **or** generic contract proof.” Unblocking FND to `getRecordedContractByOrganismId` + family-based organism requirements **is** the generic-contract proof. Successful Pima instance on that path **is** the second-jurisdiction instance. Multi-key isolation (P16) is the additional AND from the same register row.

Architecture supports this **without redesign** on CB-02/CB-05 adapter surfaces.

---

## 4. Exact writable surfaces (FROZEN)

| Path | Role | Required? |
|------|------|-----------|
| `src/factory/cb02/connectors/recordedPackEnrichmentAdapter.js` | Switch to generic recorded-contract lookup; remove MC-only organism hard-require | **REQUIRED** |
| `src/factory/cb02/connectors/canonicalPropertyFactAdapter.js` | Non-MC organism/family bag for canonical emit | **REQUIRED** |
| `src/factory/cb05/propertyIdentityResolver.js` | Non-MC expand; jurisdiction-honest keys for Pima instance | **REQUIRED** |
| `src/factory/cb02/jurisdictionRegistry.js` | Add `US-AZ-PIMA` (+ labels) for registry-bound honesty | **REQUIRED** |
| `src/factory/cb02/validateCb02.js` | T-proofs P15/P16 themes at CB-02 | **REQUIRED** |
| `src/factory/cb05/validateCb05.js` | Final I15 + FND non-MC load + multi-key isolation | **REQUIRED** |
| `src/factory/cb02/connectors/offlineIngestFromPack.js` | Align contract lookup if ingest is exercised by validators | **OPTIONAL — only if IMPL/validators require** |
| Thin CB-08 / CB-09 / CB-13 / CB-16 validators | Regression hooks only | **OPTIONAL thin — regression only** |

### Explicitly NOT writable under this Pre-IMPL freeze

| Path / class | Reason |
|--------------|--------|
| `src/factory/cb15/**` | OBS-POST-ORCH-PARK — orchestration redesign |
| `src/factory/cb16/decisionPackage*.js` trust-gate redesign | PS05-05 complete; preserve fail-closed |
| `src/factory/cb05/decisionTrustBoundary.js` | No contamination redesign required |
| New jurisdiction packs / Maricopa RECORDED_REAL pack | Not required; Live forbidden |
| Product / Marketplace / Deal Dossier | Forbidden |
| Dependencies / Live / LLM / DB / Supabase / RLS / Auth / Storage | Forbidden |

**If IMPL discovers a true blocker outside this freeze:** STOP · Director decision · do not silently enlarge.

---

## 5. Observation disposition (consume vs park)

| ID | Classification | Disposition for PS05-06 |
|----|----------------|-------------------------|
| **OBS-FND-MC-HARDREQUIRE** | Evidences **M19** | **CONSUME** via generic-contract FND path |
| **OBS-PENDING-KEY** | Honest unresolved keys | **PRESERVE** — do not invent Maricopa; isolation tests must not “fix” by forcing false MATCH |
| **OBS-POST-ORCH-PARK** | CB-15 decisionFacing unwired | **PARKING / FUTURE** |
| **OBS-POST-LIVE-EXPORT** | Live export untouched | **PARKING / FUTURE** — do not activate Live |
| **OBS-POST-NOSCAN** | Trusted validator NOSCAN | **PRESERVE** |
| **OBS-INT-JURISDICTION** | INT may recover Maricopa label | **PARKING / FUTURE** unless thin CB-13 regression requires honesty assert — default out |
| **OBS-P03-SUBSTRATE** | Maricopa pilot synthetic-named | **PRESERVE** as negative |
| **OBS-RECORDED-FAIL-FALLTHROUGH** | CB-08/09 | **PARKING / FUTURE** |
| **OBS-PS05-01-CONTAMINATION-ON-CLEAN-REAL** | Clean real may be non-contaminating | **AWARENESS** — TRUSTED ≠ opportunity still holds |

---

## 6. Exact negative / positive tests (T01–T12) — binding for IMPL

| ID | Requirement |
|----|-------------|
| **T01** | FND recorded enrichment uses generic recorded-contract lookup (not Maricopa-only) for registered organisms |
| **T02** | Pima organisms (`ORG-ASR-PC` / `ORG-GIS-PC`) are accepted by enrichment path (no `ORG-*-MC` hard-require) |
| **T03** | Existing Pima `real-pilot-001` enriches/consumes to canonical Decision-facing view without Maricopa schema literacy (P15 / I15 final) |
| **T04** | Maricopa recorded enrichment path still PASS (no regression) |
| **T05** | `KNOWN_JURISDICTIONS` includes `US-AZ-PIMA` (or equivalent honest bound entry) |
| **T06** | Cross-jurisdiction same APN → NO_MATCH (P16) |
| **T07** | Maricopa MATCH key prefix ≠ Pima MATCH key prefix; both coexist without collision |
| **T08** | Unknown / unbound jurisdiction does not silently become Maricopa |
| **T09** | `definitiveKeyCandidate` for Pima instance is not `maricopa.parcel.*` and is jurisdiction-honest |
| **T10** | PS05-01 stub/synthetic isolation + PS05-05 trusted CB-16 fail-closed remain PASS |
| **T11** | PS05-04 Pima RECORDED_REAL honesty + Maricopa synthetic negative remain PASS |
| **T12** | CB-02 / CB-05 / CB-13 / CB-16 validators PASS; `git diff --check` clean; no ranking/Premium/Diamond/Live semantics |

---

## 7. Predecessor guarantee protection

| Predecessor | Pre-IMPL protection |
|-------------|---------------------|
| PS05-01 | Preserve synthetic/stub isolation; fail-closed |
| PS05-02 | Preserve I05/I06/I15 foundation; finalize I15 without breaking Maricopa adapters |
| PS05-03 | Preserve truthAccounting honesty |
| PS05-04 | Do not alter Pima substrate content; do not invent Maricopa RECORDED_REAL; I14 remains bounded |
| PS05-05 | Do not weaken trusted handoff/export defaults; readiness ≠ opportunity preserved |

No Decision/Product/SP05/Live/nationwide leakage found in proposed surfaces.

---

## 8. Independent audit checklist (Mandate §G)

| # | Question | Result |
|---|----------|--------|
| 1 | Generalization/isolation deficit exists? | **YES** (M19/M20 evidenced) |
| 2 | I15 still requires final PS05-06 proof? | **YES** |
| 3 | Architecture supports minimum proof without redesign? | **YES** (CB-02/05 adapters) |
| 4 | Second-jurisdiction **or** generic-contract sufficient? | **YES** — generic-contract selected; Pima = instance |
| 5 | Multi-key isolation demonstrable? | **YES** (mechanism exists; T06/T07 to prove) |
| 6 | Writable surfaces minimal? | **YES** (frozen table) |
| 7 | Exact tests can prove contract? | **YES** (T01–T12) |
| 8 | PS05-01→05 protected? | **YES** |
| 9 | National rollout required? | **NO** |
| 10 | Live acquisition required? | **NO** |
| 11 | SP05/Decision/Product leakage required? | **NO** |
| — | Maricopa RECORDED_REAL required? | **NO** — STOP if unexpectedly required |

---

## 9. Findings

### BLOCKING FINDINGS

**NONE**

Architecture supports bounded CB-02/CB-05 remediation under the selected OR-sufficient route. No mandatory redesign / Live / nationwide / Maricopa RECORDED_REAL discovered.

### NON-BLOCKING OBSERVATIONS

| ID | Observation |
|----|-------------|
| **OBS-PRE-06-INGEST-OPTIONAL** | `offlineIngestFromPack.js` still Maricopa-contract-only; frozen as OPTIONAL — include only if validators exercise that path |
| **OBS-PRE-06-INT-PARK** | INT Maricopa label recovery remains parked; do not expand PS05-06 into CB-13 rewrite |
| **OBS-PRE-06-PENDING-KEY** | `pending.parcel.*` collision risk across unresolved jurisdictions remains honesty-bound; isolation proof must use registry-bound Pima/Maricopa instances, not force false MATCH |
| **OBS-PRE-06-ORCH-PARK** | CB-15 decisionFacing remains unwired; out of default freeze |

---

## 10. Verdict

**PASS WITH OBSERVATIONS**

```text
CODE IMPL        = WAITING Director EXECUTE (after this Pre-IMPL)
SP05             = NOT OPENED
PS05-07          = NOT OPENED
PRE-SP05         = IN PROGRESS
WRITABLE SURFACE = FROZEN (CB-02 enrichment/canonical/registry + CB-05 identity + validateCb02/05; optional ingest/regressions)
SELECTED ROUTE   = GENERIC-CONTRACT + existing Pima instance + multi-key isolation
```

**DO NOT IMPLEMENT** until Director EXECUTE.
**DO NOT COMMIT / PUSH** documentary pair until Director review authorization for Continuity publication (separate act).

---

## 11. Exact next step

```text
NEXT = Director review of Mandate + this Pre-IMPL
     → if APPROVED: Continuity publish Mandate+Pre-IMPL (selective commit/push)
     → then Director EXECUTE for PS05-06 IMPL on frozen surfaces
     ≠ auto-EXECUTE by this file
     ≠ SP05 OPEN
     ≠ PS05-07 OPEN
```

**END OF PRE-SP05-PS05-06-PRE-IMPL**

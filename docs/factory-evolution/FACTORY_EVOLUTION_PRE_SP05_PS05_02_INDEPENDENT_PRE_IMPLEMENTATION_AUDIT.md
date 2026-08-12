# PRE-SP05 CONTINUITY WORKSTREAM
## PS05-02 — INDEPENDENT PRE-IMPLEMENTATION AUDIT
### Canonical Fact Shape + Jurisdiction + Identity
#### Document ID: PRE-SP05-PS05-02-PRE-IMPL

| Campo | Valor |
|-------|--------|
| **Document ID** | **`PRE-SP05-PS05-02-PRE-IMPL`** |
| **Audit ID** | **`PRE-SP05-PS05-02-PRE-IMPL`** |
| **Document type** | **PRE-SP05 Independent Pre-Implementation Audit** |
| **File ID** | `FACTORY_EVOLUTION_PRE_SP05_PS05_02_INDEPENDENT_PRE_IMPLEMENTATION_AUDIT.md` |
| **Path** | `docs/factory-evolution/FACTORY_EVOLUTION_PRE_SP05_PS05_02_INDEPENDENT_PRE_IMPLEMENTATION_AUDIT.md` |
| **Nature** | Independent **Pre-IMPL Audit** of Mandate `PRE-SP05-PS05-02-ENG-IMPL` · **STRICT READ ONLY / DOCUMENTATION ONLY** · evidence-based writable-surface determination · **≠ code** · **≠ IMPL started** · **≠ SP05 OPEN** · **≠ Living IA PROVED** |
| **Audit object** | `PRE-SP05-PS05-02-ENG-IMPL` (PS05-02 Canonical Fact Shape + Jurisdiction + Identity Mandate) |
| **Block ID** | **PS05-02** |
| **Workstream** | **PRE-SP05 Continuity workstream** |
| **Parent Mandate** | Continuity-published `PRE-SP05-PS05-02-ENG-IMPL` (same Continuity session; Mandate first) |
| **Parent PS05-01** | Continuity Commit **`5d5ebde388b9187174060aefe7776f340e038b23`** · **COMPLETE** · P11/P13 must remain SATISFIED |
| **Parent tip at audit drafting** | **`5d5ebde388b9187174060aefe7776f340e038b23`** |
| **Verdict** | **PASS WITH OBSERVATIONS** |
| **Date** | **2026-08-12** |
| **Branch** | `integration/factory-complete-20260725` |
| **Mode** | **DOCUMENTARY ONLY** (this file) |

```text
PRE-SP05-PS05-02-PRE-IMPL
  = Independent Pre-IMPL of PS05-02 ONLY
  ≠ CODE
  ≠ Director EXECUTE by this file alone
  ≠ SP05 OPEN
  ≠ PS05-03 OPEN
  ≠ 50-state registry
  ≠ Maricopa-as-canonical-RSN architecture
```

---

## 0. Honesty banner

```text
PS05-00 = COMPLETE
PS05-01 = COMPLETE
PS05-02 code = NOT STARTED
SP05 = NOT OPENED
Living IA / GAP-RK-IA / GAP-LIVE-LLM = NOT PROVED
This audit ≠ implementation authorization by existence
```

---

## 1. Audit objectives

1. Confirm Mandate scopes exclusively M06–M08 / M16 / I05·I06·I15(foundation) / P03.
2. Trace Maricopa entry + leakage + identity + jurisdiction + owner paths in repository code.
3. Determine reuse vs new helpers.
4. Freeze exact writable surfaces and required tests.
5. Emit Verdict without authorizing code.

---

## 2. Verified M06 / M07 / M08 / M16 technical findings

### 2.1 M06 — Canonical normalization — **CONFIRMED DEFICIT**

**Entry of Maricopa-specific shapes:**

| Layer | Path | Role |
|-------|------|------|
| Pack substrate | `data/factory-dso-packs/maricopa/pilot-001/` | Schemas `maricopa.*.payload.v1`; jurisdiction free-text |
| Payload schemas | `src/factory/cb02/connectors/payloadSchemas.js` | ASR requires `parcelId`, `apn`, `situsAddress`, `landUseCode`, `assessedYear` |
| Contracts | `src/factory/cb02/connectors/maricopaConnectorContracts.js` | `getMaricopaContractByOrganismId` |
| Enrichment | `src/factory/cb02/connectors/recordedPackEnrichmentAdapter.js` | Default root → Maricopa pilot pack; emits `payloadsByOrganism` |
| Ingest/validate | `offlineIngestFromPack.js`, `recordedPackValidator.js` | Guard via Maricopa contracts |
| Organism catalog | `src/factory/cb02/sourceOrganismsCatalog.js` | ORG-ASR/GIS/RCR-MC + `"Maricopa County, AZ"` |

**Leakage into Decision-facing upstream:**

| Layer | Leak |
|-------|------|
| CB-05 Foundation | Direct `payloadsByOrganism["ORG-ASR-MC"]` reads; hardcoded `"Maricopa County, AZ"`; `maricopa.parcel.${parcelId}` key minting; landUseCode-driven PHY inference |
| CB-13 Intelligence | `recordedPackHints()` projects raw Maricopa fields (`parcelId`, `apn`, situs*, centroid*, recorder*) into motor outputs/knowledge |
| CB-07…10 | Organism-MC fixtures; economy `"Phoenix-NW"` hardcoded (stub geography — not pack situs) |
| CB-16 | Package `identity` = `{ factory_key, state, keyStatus }` only; motor slices may carry leaked FND/INT outputs |

**Finding:** No RSN canonical property fact envelope exists between pack payloads and motors. Maricopa payload literacy is currently required in Foundation/INT Decision-facing consume paths.

### 2.2 M07 — Property entity resolution — **CONFIRMED DEFICIT**

| Signal | Current use |
|--------|-------------|
| `factoryKey` | Primary expediente id; provisional → definitive via `FactoryRegistry.resolveFactoryKey` |
| `candidateRef` | Intake seed for provisional key |
| `parcelId` / `apn` | Bootstrap input or ASR pack fields or synthetic fallback |
| `definitiveKeyCandidate` | **`maricopa.parcel.${parcelId}`** (jurisdiction baked into key string) |
| situs / parcelRef | Present in pack/INT hints; **not** used for cross-source merge |
| Cross-source resolver | **ABSENT** — MOT-IDN-01/02 are scaffolding, not multi-source identity |

**Finding:** No deterministic MATCH / NO_MATCH / AMBIGUOUS|UNRESOLVED resolver across Assessor + GIS (+ Recorder). Silent single-source key minting with Maricopa prefix is the current path.

### 2.3 M08 — Owner / entity (Decision-relevant) — **CONFIRMED DEFICIT (bounded)**

| Surface | Status |
|---------|--------|
| RCR pack | No grantor/grantee (explicitly redacted / no PII) |
| MOT-OWN-01 | Default `"Smith Family Trust"` stub |
| MOT-OWN-02 | Simulation-driven verify/mismatch |
| INT / CB-16 identity | No owner section |

**Finding:** Owner values are stub. Risk is **false attribution** of stub owner as Decision-trusted fact. PS05-01 already marks stubs UNTRUSTED for Decision trust; PS05-02 must additionally keep owner as **UNRESOLVED/UNKNOWN** when no reliable Decision-relevant evidence exists — **without** implementing real ownership enrichment (PS05-04 / out of scope).

### 2.4 M16 — Jurisdiction explicitness — **CONFIRMED DEFICIT**

Jurisdiction today is free-text (`"Maricopa County, AZ"`) on organisms/contracts/pack/motors, plus key-prefix `maricopa.parcel.*`. No machine-readable `{ state, county }` registry. CB-16 identity has **no** jurisdiction field. Second-jurisdiction proof remains **PS05-06**.

---

## 3. Existing architecture to preserve (extend, do not fork)

| Structure | Path | Preserve as |
|-----------|------|-------------|
| SourceRef | `src/factory/cb02/sourceRef.js` | Provenance primitive |
| SourceRegistry / organisms | `sourceRegistry.js`, `sourceOrganismsCatalog.js` | Catalog substrate |
| Connector contract shell | `connectorContract.js` | Mode/jurisdiction carriers |
| Maricopa contracts + schemas | `maricopaConnectorContracts.js`, `payloadSchemas.js` | **Source adapters** (keep; do not promote to canonical) |
| Pack enrichment | `recordedPackEnrichmentAdapter.js` | Primary emit point for canonical alongside payloads |
| factoryKey / resolveFactoryKey | `cb01/factoryKey.js`, `factoryRegistry.js` | Key promotion; do not reinvent |
| decisionTrustBoundary | `cb05/decisionTrustBoundary.js` | PS05-01 trust vocab — must survive |
| CB-16 package sections | `decisionPackageSchema.js` | Preserve; thin jurisdiction only if required |

**Do not treat as Factory identity:** `src/lib/dealPipeline.js` `normalizeIncomingDeal` (Product path / O14).

---

## 4. Canonical fact shape — minimum required (frozen for IMPL)

Minimum RSN canonical property fact (Decision-facing):

| Field | Required now | Notes |
|-------|--------------|-------|
| `propertyIdentity` | YES | Canonical id + resolution status |
| `jurisdiction` | YES | Machine-readable `{ state, county }` (+ optional display label) |
| `parcelId` | YES when present | Normalized |
| `apn` | YES when present | Normalized |
| `address` | YES when present | Normalized situs lines/city/state/postal |
| `sourceIdentity` | YES | Organism / SourceRef linkage |
| `rawIdentifiers` | YES | Preserve source-specific ids/schemaIds for traceability |
| `ownerRef` | CONDITIONAL | Present only if Decision-relevant evidence; else `UNRESOLVED`/`UNKNOWN` |
| `trustMeta` | YES | Carry/propagate PS05-01 synthetic/stub/unavailable markers |

Municipality / FIPS: **NOT required now** (future / PS05-06 unless separately mandated).

---

## 5. Property identity semantics (frozen)

Deterministic outcomes:

| Outcome | Meaning |
|---------|---------|
| **MATCH** | ≥2 independent source signals agree under same explicit jurisdiction |
| **NO_MATCH** | Explicit conflict or disjoint identifiers under comparison |
| **AMBIGUOUS** / **UNRESOLVED** | Insufficient evidence — **must not** silently merge |

Same APN under **different** jurisdiction → **MUST NOT** MATCH.

No probabilistic AI matching in this block.

---

## 6. Owner / entity bounded semantics (frozen)

- Default stub owner string must not be presented as resolved Decision owner truth.
- When recorder/source lacks owner evidence → **UNRESOLVED** / **UNKNOWN**.
- No corporate graph, beneficial ownership, skip tracing, PII acquisition, or external entity providers.

---

## 7. Jurisdiction semantics (frozen)

Minimum explicit contract:

```text
jurisdiction: {
  state: <string code or normalized state>,
  county: <string normalized county>,
  sourceLabel?: <original free-text if present>
}
```

No implicit assumption that every property is Maricopa, Arizona. Maricopa remains a **valid source jurisdiction instance**, not the architecture.

---

## 8. Authorized writable surfaces (exact paths)

Implementation (after Director EXECUTE) may modify **only**:

| # | Path | Allowed change class |
|---|------|----------------------|
| 1 | **NEW** `src/factory/cb02/jurisdictionRegistry.js` | Minimal explicit state+county vocabulary / normalize helper |
| 2 | **NEW** `src/factory/cb02/connectors/canonicalPropertyFactAdapter.js` | Map ASR/GIS/RCR (and generic payload bags) → RSN canonical property fact; preserve raw ids |
| 3 | **NEW** `src/factory/cb05/propertyIdentityResolver.js` | Deterministic MATCH / NO_MATCH / AMBIGUOUS|UNRESOLVED |
| 4 | `src/factory/cb02/connectors/recordedPackEnrichmentAdapter.js` | Emit canonical fact(s) alongside existing enrichment; no Live; keep Maricopa as source adapter |
| 5 | `src/factory/cb05/foundationMotorHandlers.js` | Thin consume of canonical identity/jurisdiction; stop hardcoded `"Maricopa County, AZ"` / unconditional `maricopa.parcel.*` minting on Decision-facing path |
| 6 | `src/factory/cb13/intelligenceMotorHandlers.js` | Thin consume: `recordedPackHints` prefer canonical envelope over raw Maricopa field projection |
| 7 | `src/factory/cb07/legitimacyMotorHandlers.js` | **Owner honesty only** — UNRESOLVED/UNKNOWN when no reliable evidence; no real-owner remediation |
| 8 | `src/factory/cb05/validateCb05.js` | Targeted T01–T10 / regression |
| 9 | `src/factory/cb13/validateCb13.js` | Targeted T01–T10 / regression |
| 10 | `src/factory/cb02/validateCb02.js` | Enrichment/canonical emit proofs if needed |
| 11 | **OPTIONAL thin** `src/factory/cb16/decisionPackageSchema.js` | Add explicit jurisdiction on `identity` **only if** required for Decision-facing contract without redesign |
| 12 | **OPTIONAL thin** `src/factory/cb16/decisionPackageBuilder.js` | Populate jurisdiction from canonical facts when #11 used |
| 13 | **OPTIONAL thin** `src/factory/cb16/validateCb16.js` | Assertions for #11/#12 only |

**Optional one additional helper** under `src/factory/cb02/` or `src/factory/cb05/` only if duplication would otherwise expand scope (document in IMPL report).

**Not authorized:** rewriting `maricopaConnectorContracts.js` / Maricopa `payloadSchemas` as “canonical”; pack JSON content redesign as truth; CB-01 core rewrite; CB-06/08/09/10 formula work; Product `dealPipeline`; Hardening; P-INT Live; Supabase; Live connectors; dependency changes.

---

## 9. Required negative / proof tests (T01–T10)

| ID | Intent | Expected |
|----|--------|----------|
| **T01** | Assessor + GIS/Recorder same property | One canonical property identity **MATCH** |
| **T02** | Conflicting property identifiers | **NO_MATCH** or **AMBIGUOUS**; no silent merge |
| **T03** | Missing identity evidence | **UNRESOLVED** / **UNKNOWN** |
| **T04** | Same APN, different jurisdiction | Must **not** merge incorrectly |
| **T05** | Maricopa-specific fields | Normalized before Decision-facing consumption |
| **T06** | Traceability | Canonical preserves raw/source-specific identifiers |
| **T07** | Jurisdiction | Explicit machine-readable state+county |
| **T08** | Owner without reliable evidence | Not falsely attributed (UNRESOLVED/UNKNOWN) |
| **T09** | PS05-01 markers | Survive normalization/identity processing |
| **T10** | Regression | Existing CB validations remain PASS |

---

## 10. Bounded implementation design (no code this step)

1. Add min jurisdiction helper + canonical property fact adapter + property identity resolver.
2. Extend pack enrichment to emit canonical facts without removing Maricopa source adapters.
3. Thin-wire Foundation IDN/LOC and INT hints to consume canonical facts.
4. Owner path: honesty markers / UNRESOLVED only.
5. Preserve PS05-01 trust vocabulary on all new outputs.
6. Prefer adapters over CB redesign; do not invent probabilistic matching.
7. Optional CB-16 identity.jurisdiction only if Decision-facing contract otherwise incomplete.

### Non-goals

50-state ontology; second-jurisdiction national proof; real owner/econ/distress; provenance redesign; SP05.

---

## 11. Regression risks

| Risk | Mitigation |
|------|------------|
| CB-05/13 validations asserting raw Maricopa field presence | Keep source payloads available; add canonical alongside |
| `maricopa.parcel.*` definitive keys in existing pilots | Transition via resolver outputs; preserve key history honesty |
| Pack enrichment default Maricopa root | Keep as source default; do not claim national readiness |
| PS05-01 trust regressions | Explicit T09 + CB-05/13/16 dry-runs |
| Catalog/fixture organism-MC coupling | Leave fixtures; normalize at adapter boundary |

---

## 12. Architecture redesign required?

**NO.**

PS05-02 is implementable as **bounded adapters + thin consume hooks** on existing CB-02 enrichment / CB-05 IDN / CB-13 hints / optional CB-16 identity field — without constitutional CB redesign, without Live, without promoting Maricopa contracts to canonical RSN architecture.

---

## 13. Observations (non-blocking)

| ID | Observation |
|----|-------------|
| **OBS-PS05-02-01** | Default recorded pack root remains Maricopa pilot; PS05-06 owns second-jurisdiction proof. |
| **OBS-PS05-02-02** | `getMaricopaContractByOrganismId` remains valid **source** adapter API; must not be renamed into “the” canonical contract. |
| **OBS-PS05-02-03** | Owner remains stub-capable under PS05-01 marking; PS05-02 only prevents false Decision attribution. |
| **OBS-PS05-02-04** | FIPS/municipality deferred unless later Mandate expands. |
| **OBS-PS05-02-05** | Pre-IMPL PASS does **not** start code; Director EXECUTE / Execution Order still required. |
| **OBS-PS05-02-06** | Optional CB-16 identity.jurisdiction may be deferred if motors+canonical facts already satisfy Decision-facing I06 for this block — IMPL must document choice. |

---

## 14. Blocking findings

**NONE.**

Mandate scope is coherent with PS05-00 O02–O05; writable surfaces are enumerable; architecture supports adapters without redesign; PS05-01 preservation is feasible.

---

## 15. Verdict

```text
VERDICT: PASS WITH OBSERVATIONS

Blocking findings: NONE
Living Intelligence Alive PROVED by this audit? NO
SP05 opened by this audit? NO
PS05-02 code authorized by this audit file alone? NO
Engineering class ready for Director EXECUTE / Execution Order? YES
Maricopa promoted as canonical RSN architecture? NO
```

---

## 16. Exact next step after Continuity publication of this package

Director **EXECUTE / Execution Order** authorizing **PS05-02 code mutation** on the writable surfaces listed in §8, implementing the bounded design in §10, followed by validation + independent post-IMPL audit + Status + Git sync CLEAN.

```text
NEXT ≠ SP05 OPEN
NEXT ≠ PS05-03
NEXT = Director EXECUTE / Execution Order for PS05-02 IMPL
     (then bounded code on authorized surfaces only)
```

**END OF PRE-SP05-PS05-02-PRE-IMPL**

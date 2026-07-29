# STRATEGIC PROGRAM 01 — FACTORY ALIVE
## SP01-IB-06 — OFFICIAL DISCOVERY SPECIFICATION
### Recuperación del alcance oficial de CB Semantics Integrity Proof

| Campo | Valor |
|-------|--------|
| **Document ID** | `FACTORY_EVOLUTION_SP01_IB06_OFFICIAL_DISCOVERY_SPECIFICATION.md` |
| **Path** | `docs/factory-construction/FACTORY_EVOLUTION_SP01_IB06_OFFICIAL_DISCOVERY_SPECIFICATION.md` |
| **Nature** | Official Discovery Specification — **recovers** IB-06 scope from published corpus · **does not implement** · **does not authorize IMPL** · **does not open IB-07+** |
| **Program** | **Strategic Program 01 — Factory Alive** |
| **Block under discovery** | **SP01-IB-06** |
| **Date** | **2026-07-29** |
| **HEAD (official published)** | `06c637c088b943b05dd5cb8454d24ea42f9e8b03` |
| **Branch** | `integration/factory-complete-20260725-local` |
| **IB-06 implementation authorization** | **NOT AUTHORIZED** |
| **Final discovery state** | See §28 |

---

## 1. Document identity

This document is the **Official Discovery Specification** for **SP01-IB-06**.
It **recovers** the block’s meaning from the approved and published Factory Evolution / SP01 corpus.
It does **not** invent purpose, CAP targets, deliverables, activities, or completion criteria.

```text
DISCOVERY ≠ IMPLEMENTATION MANDATE
DISCOVERY ≠ AUTHORIZATION TO IMPLEMENT
DISCOVERY ≠ IB-07+
DISCOVERY ≠ CB SEMANTIC REWRITE
```

---

## 2. Discovery authority

| Authority | Role |
|-----------|------|
| Director order — SP01-IB-06 Official Discovery Specification | Issuance of this Discovery |
| Published HEAD `06c637c088b943b05dd5cb8454d24ea42f9e8b03` | Repository baseline (IB-05 published and closed) |
| SP01 Official Implementation Plan (SP01-02) | **Primary block definition** of SP01-IB-06 |
| SP01 Official Discovery Specification (SP01-01) | CAP-SP01-05 · Alive clause (E) · ACC-04 · MVI-5 adjacency |
| SP01 Documentary Commit Status · IB-01…IB-05 packages | Prior closed state · CAP-05 inventory · Reconfirm→IB-06 |
| Blueprint · CB-00…CB-19 · CCD · Continuity · Master Plan · P-INT / Hardening Statuses | Constitutional and CLOSED-surface evidence |

**Anti-invention:** No IB-06 meaning is inferred solely from sequence numbering, prior IB patterns, or architectural assumptions beyond what Plan/Discovery texts state.

---

## 3. Exact official title

Per `FACTORY_EVOLUTION_SP01_FACTORY_ALIVE_OFFICIAL_IMPLEMENTATION_PLAN.md` §7:

```text
SP01-IB-06 — CB Semantics Integrity Proof
```

Plan sequence line (same file §6):

```text
SP01-IB-06  CB Semantics Integrity Proof (CAP-05)
```

---

## 4. Authoritative source hierarchy

| Rank | Source | Use for IB-06 |
|------|--------|----------------|
| **1** | `FACTORY_EVOLUTION_SP01_FACTORY_ALIVE_OFFICIAL_IMPLEMENTATION_PLAN.md` — §7 **SP01-IB-06** | Exact title, objective, scope, dependencies, expected evidence, closure criteria |
| **2** | `FACTORY_EVOLUTION_SP01_FACTORY_ALIVE_OFFICIAL_DISCOVERY_SPECIFICATION.md` | CAP-SP01-05; Alive (E); ACC-04; MVI-5; CB rewrite prohibition |
| **3** | `FACTORY_EVOLUTION_SP01_IB01_CAP_EVIDENCE_MATRIX.md` | CAP-05 **SATISFIED**; Reconfirm→IB-06; any CB diff = STOP |
| **4** | Master Plan §10 item 5 (MVI-5) | “Ningún archivo CB-00…CB-19 necesita cambio para el MVI” |
| **5** | Factory 2.0 Construction Blueprint · construction ledger / `construction-phase-status.json` | CB construction COMPLETE / APPROVED basis |
| **6** | Factory Evolution Director Strategic Mandate | Program identity |
| **7** | PROGRAM 01 Core Hardening Status (cite) | Closed without CB constitutional rewrite of Alive |
| **8** | SP01-IB-02…IB-05 packages | Prior Alive proofs; IB-05 states IB-06 **NOT AUTHORIZED** |

**Prevalence for block organization:** Plan §7 SP01-IB-06.
**Prevalence for capability meaning:** SP01-01 CAP-SP01-05 + Alive (E) + ACC-04 + Master Plan MVI-5.
**Prevalence for known residual:** IB-01 matrix — Reconfirm integrity at IB-06 for **PROVED**.

---

## 5. Repository baseline

| Check | Result |
|-------|--------|
| Branch | `integration/factory-complete-20260725-local` |
| Local HEAD | `06c637c088b943b05dd5cb8454d24ea42f9e8b03` |
| Upstream | `origin/integration/factory-complete-20260725` |
| Remote HEAD | Same SHA |
| Ahead / behind | **0 / 0** |
| Tracked modifications | **NONE** |
| Staged files | **NONE** |
| Tolerated untracked only | `docs/factory-construction/FACTORY_ALIVE_P1_01_OFFICIAL_DISCOVERY.md` (not incorporated) |
| SP01-IB-01…IB-05 | **OFFICIALLY PUBLISHED AND CLOSED** |
| IB-06+ IMPL | **NOT AUTHORIZED** |

---

## 6. Predecessor-block status

| Block | Official state | Relevance to IB-06 |
|-------|----------------|--------------------|
| SP01-IB-01 | PUBLISHED AND CLOSED | CAP-05 **SATISFIED**; Reconfirm→IB-06 |
| SP01-IB-02 | PUBLISHED AND CLOSED | CAP-01/06/07 PROVED — adjacent; not CAP-05 |
| SP01-IB-03 | PUBLISHED AND CLOSED | CAP-02 GAP→IB-08 — must not be silently “fixed” under IB-06 |
| SP01-IB-04 | PUBLISHED AND CLOSED | CAP-03 PROVED — not CAP-05 |
| SP01-IB-05 | PUBLISHED AND CLOSED | CAP-04 PROVED; IB-06 **NOT AUTHORIZED** at IB-05 close |

Plan §7 IB-06 dependencies: **IB-01…IB-05 resultados; Blueprint; construction ledger**.

---

## 7. Scope

Recovered verbatim from Plan §7 SP01-IB-06:

| Campo | Contenido oficial |
|-------|-------------------|
| **Identificador** | **SP01-IB-06** |
| **Objetivo** | Demostrar CAP-SP01-05 / ACC-04 (Alive no exige ni produce redesign semántico CB-00…19) |
| **Alcance** | Verificación de que el cierre SP01 no depende de mutar elrSchema/state machine/CB bodies constitucionales |
| **Dependencias** | IB-01…IB-05 resultados; Blueprint; construction ledger |
| **Evidencias esperadas** | Declaración de integridad CB; diff policy: semántica CB intacta |
| **Criterios de cierre** | CAP-05 PROVED; cualquier necesidad de cambio CB = **STOP** + Director (fuera de SP01) |

**Binding scope statement:**

```text
IN SCOPE (Discovery recovery):
  Verify SP01 closure does not depend on mutating constitutional CB semantics
  Verify elrSchema / state machine / CB bodies remain intact for Alive
  Emit CB integrity declaration + diff policy evidence
  Disposition CAP-SP01-05 as PROVED (Plan closure criterion)
  Prefer existing Blueprint / construction ledger / IB-01 CAP-05 evidence

OUT OF SCOPE:
  CB semantic rewrite / redesign
  New adapters invented solely to “pass” CAP-05 (adapters may exist elsewhere under separate Mandate — not IB-06 work)
  IB-07…IB-10
  SP02 Arizona Alive
  Product / Marketplace / Web / Supabase mutation
  Silently resolving CAP-02 GAP under IB-06 color
```

**Block type (corpus-grounded):** documentary / verification **proof** block — Plan §6: IB-01…IB-07 “preferentemente documental/verificación”; Plan §7: “Verificación… Declaración de integridad CB; diff policy”.

---

## 8. Architectural purpose

From SP01-01 Alive clause **(E)**, CAP-SP01-05, ACC-04, and Master Plan §10 item 5 (MVI-5):

```text
PURPOSE = PROVE ALIVE DOES NOT REQUIRE OR PRODUCE CB-00…CB-19 SEMANTIC REDESIGN
≠ REWRITE CB BODIES
≠ MUTATE elrSchema / STATE MACHINE FOR ALIVE
≠ REOPEN CONSTRUCTION AS PENDING IMPL
≠ USE IB-06 TO DELIVER NEW FACTORY FEATURES
```

SP01-01 CAP-SP01-05: Semántica CB-00…CB-19 **no** reescrita para lograr Alive; adapters/consumidores sí pueden existir (MVI-5).

Master Plan §10 item 5: “Ningún archivo CB-00…CB-19 necesita cambio para el MVI (solo adapters/consumidores nuevos).”

---

## 9. CAP target

| ID | Role |
|----|------|
| **CAP-SP01-05** | **ONLY** — Semántica CB-00…CB-19 **no** reescrita para lograr Alive |

**Excluded from IB-06 CAP targets:** CAP-SP01-01, 02, 03, 04, 06, 07.

---

## 10. Acceptance criteria

| ID | Criterion | Source |
|----|-----------|--------|
| **ACC-04** | Ningún cambio de semántica constitucional CB demostrado como necesario para el cierre (MVI-5) | SP01-01 |
| **Alive (E)** | Operar Alive **sin** mutar la semántica constitucional CB-00…CB-19 | SP01-01 Alive definition |
| **Plan closure** | CAP-05 **PROVED**; any need for CB change = **STOP** + Director (fuera de SP01) | SP01-02 §7 IB-06 |
| **MVI-5** | No CB-00…CB-19 file change required for MVI | Master Plan §10 item 5 |

---

## 11. Dependencies

| Dependency | Required state (corpus) | Role |
|------------|-------------------------|------|
| SP01-IB-01…IB-05 | OFFICIALLY CLOSED | Plan §7 dependencies |
| IB-01 CAP-05 row | SATISFIED; Reconfirm→IB-06 | Baseline inventory |
| Blueprint | Construction CLOSED | Constitutional CB corpus parent |
| Construction ledger / phase status | CB-00…19 APPROVED/COMPLETE | Cite |
| Master Plan §10 MVI-5 | Published | Architectural integrity rule |
| SP01-01 CAP-SP01-05 / ACC-04 / Alive (E) | Published | Capability + acceptance meaning |
| CB surfaces | Intact — not modified for Alive | Binding STOP if change claimed necessary |

---

## 12. Existing implementation inventory

| Component / surface | Role for IB-06 | State |
|---------------------|----------------|-------|
| CB-00…CB-19 construction corpus | Subject of integrity proof (cite; do not rewrite) | APPROVED / COMPLETE |
| Blueprint | Construction sequence CLOSED | Cite |
| `construction-phase-status.json` / construction ledger | Phase APPROVED evidence | Cite |
| elrSchema / CB state machines | Must remain unmutated for Alive | Cite / diff policy |
| PROGRAM 01 Core Hardening | Closed without CB constitutional rewrite of Alive | Cite |
| Adapters / consumers (existing) | May exist without CB semantic rewrite (MVI-5) | Cite only — not new IB-06 builds |

No new components are introduced by this Discovery.

---

## 13. Existing runner inventory

Prefer existing evidence vehicles (Discovery does **not** authorize runner execution):

| Runner / vehicle | Path / note | Role |
|------------------|-------------|------|
| Construction / CB phase evidence | Construction ledger + Continuity CB APPROVED/COMPLETE citations | Primary documentary vehicle |
| Diff policy / working-tree CB integrity check | Git / path inventory under Mandate (future) | Plan: “diff policy: semántica CB intacta” |
| Existing per-CB validation runners (e.g. `src/runCb01RegistryValidation.js` and peers) | Optional corroboration of construction COMPLETE — **not** a license to rewrite CB | Cite / optional exercise under future Mandate |

Rule: do not invent new validation suites in Discovery; do not treat runner PASS as authorization to modify CB.

---

## 14. Existing documentary evidence

| Evidence | Path / citation | Use |
|----------|-----------------|-----|
| CAP-05 baseline | `FACTORY_EVOLUTION_SP01_IB01_CAP_EVIDENCE_MATRIX.md` | SATISFIED; Reconfirm→IB-06 |
| SP01-01 | CAP-05 · Alive (E) · ACC-04 · §10 components not modifiable | Capability + prohibition |
| SP01-02 §7 IB-06 | Official block definition | Title / scope / closure |
| Master Plan §10 item 5 | `FACTORY_INTEGRATION_MASTER_PLAN.md` | MVI-5 |
| IB-05 Commit Status | IB-06 **NOT AUTHORIZED** at prior close | Sequence lock |
| Blueprint / Continuity CB COMPLETE | Construction CLOSED corpus | Cite |

---

## 15. Existing technical evidence

| Evidence | Nature |
|----------|--------|
| CB-00…CB-19 construction APPROVED/COMPLETE | Technical/constitutional closeout |
| No SP01 IB-01…IB-05 CB semantic rewrite attributed to Alive | Diff / Status policy evidence (IB-01 matrix; prior IB Statuses) |
| PROGRAM 01 Core Hardening COMPLETE without Alive CB rewrite | Hardening Status cite |
| Master Plan prohibition on refactoring CB-00…CB-19 “para que encaje con React” | Architectural STOP adjacency |

---

## 16. Already-proved state

| Item | State |
|------|-------|
| CAP-SP01-05 baseline (IB-01) | **SATISFIED** |
| Formal CAP-SP01-05 **PROVED** | **NOT YET** — IB-01: Reconfirm→IB-06 |
| CB construction | APPROVED / COMPLETE — not reopened |
| CAP-SP01-01/06/07 (IB-02) | PROVED — adjacent |
| CAP-SP01-02 (IB-03) | GAP → IB-08 — not IB-06 target |
| CAP-SP01-03 (IB-04) | PROVED — not IB-06 target |
| CAP-SP01-04 (IB-05) | PROVED — not IB-06 target |

---

## 17. Remaining capability boundary

| Gap / boundary | Source | IB-06 disposition expectation |
|----------------|--------|-------------------------------|
| Formal CAP-05 **PROVED** integrity reconfirmation missing | IB-01 CAP-05 row | IB-06 must emit CB integrity declaration + diff policy |
| Any claimed necessity of CB semantic change for Alive | Plan §7 closure | **STOP** + Director (fuera de SP01) — not authorized under IB-06 |
| CAP-02 residual | IB-03 | Must not be silently resolved under IB-06 color |

**Authorized future work boundary (when Mandate issued):** verification / documentary integrity proof only — prefer existing Blueprint / ledger / Statuses; **PROVE BEFORE CHANGE**; **zero** CB semantic mutation.

---

## 18. Required deliverables

Recovered from Plan §7 “Evidencias esperadas” + closure criteria:

| # | Deliverable (minimum, corpus-grounded) |
|---|----------------------------------------|
| 1 | **CB Integrity Declaration** (Semantics Integrity Proof Record) for CAP-SP01-05 / ACC-04 |
| 2 | **Diff policy** evidence: semántica CB intacta (no Alive-driven CB rewrite) |
| 3 | Citations to Blueprint / construction COMPLETE / IB-01 CAP-05 / MVI-5 |
| 4 | CAP-SP01-05 disposition: **PROVED** (Plan closure criterion) |
| 5 | Explicit STOP pathway if CB change claimed necessary |
| 6 | IB-06 Implementation Status / annex when Mandate execution completes (future) |

**This Discovery creates none of the IMPL deliverables** except this Discovery Specification itself.

---

## 19. Validation strategy

| ID | Criterion |
|----|-----------|
| V1 | CAP-SP01-05 / ACC-04 addressed with objective integrity evidence |
| V2 | Existing Blueprint / construction ledger / IB-01 CAP-05 surfaces used (cite CLOSED; no silent reopen) |
| V3 | Diff policy demonstrates no Alive-driven CB semantic mutation |
| V4 | Any demonstrated necessity of CB change triggers **STOP** + Director (fuera de SP01) |
| V5 | No Product / Marketplace / Arizona / Supabase / Hardening / unauthorized P-INT modification |
| V6 | No new CB APIs / semantic redesign; IB-07+ not opened under IB-06 color |
| V7 | CAP-02 residual not silently “fixed” under IB-06 |
| V8 | Prefer existing evidence / optional existing CB runners (PROVE BEFORE CHANGE) |

---

## 20. Success criteria

| # | Success |
|---|---------|
| 1 | CAP-SP01-05 objectively **PROVED** |
| 2 | CB integrity declaration present |
| 3 | Diff policy: CB semantics intact for Alive |
| 4 | No CB semantic rewrite performed or required under SP01 color |
| 5 | PROVE BEFORE CHANGE respected |

---

## 21. Completion criteria

From Plan §7 Criterios de cierre:

| # | Criterion |
|---|-----------|
| 1 | CAP-SP01-05 marked **PROVED** |
| 2 | Expected evidence present (integridad CB + diff policy) |
| 3 | Any need for CB change = **STOP** + Director (fuera de SP01) — not silently implemented |
| 4 | Construction / Blueprint **not** reopened as pending IMPL |
| 5 | SP01 program **COMPLETE** **not** declared by IB-06 alone |

```text
IB-06 COMPLETE ≠ SP01 COMPLETE
IB-06 PROVED(CAP-05) ≠ IB-07 authorization
CB CHANGE NEEDED = STOP + DIRECTOR (OUTSIDE SP01)
```

---

## 22. Protected-surface classification

| Surface | Classification | Basis |
|---------|----------------|-------|
| **CB-00 through CB-19** | **READ-ONLY EVIDENCE** · **OUT OF SCOPE** to modify · **DIRECTOR AUTHORIZATION REQUIRED** / **STOP** if semantic change claimed necessary for Alive | Plan §7 closure; CAP-05; Blueprint |
| **Factory Runtime** | **OUT OF SCOPE** for redesign · **READ-ONLY EVIDENCE** / optional exercise of existing validators under future Mandate · **STOP** for runtime redesign | Prove-before-change |
| **Factory Quality Hardening** | **OUT OF SCOPE** · **READ-ONLY EVIDENCE** · **DIRECTOR AUTHORIZATION REQUIRED** if touched | Plan R-PLAN-08 pattern |
| **P-INT** | **OUT OF SCOPE** to reopen · **READ-ONLY EVIDENCE** · **DIRECTOR AUTHORIZATION REQUIRED** for Mandate gap reopen | Prior CLOSED Statuses |
| **Admin Control Plane** | **OUT OF SCOPE** for redesign · **READ-ONLY EVIDENCE** | Not CAP-05 vehicle |
| **Orchestration** | **OUT OF SCOPE** · **READ-ONLY EVIDENCE** | CAP-02 owned elsewhere |
| **Web** | **OUT OF SCOPE** · **STOP / DIRECTOR AUTHORIZATION REQUIRED** | Continuity Stop Rules |
| **Product** | **OUT OF SCOPE** · **STOP** | SP01-01 §6 |
| **Marketplace** | **OUT OF SCOPE** · **STOP** | SP01-01 §6; IB-05 closed |
| **Arizona** | **OUT OF SCOPE** · **STOP** if SP02 opened | SP01-01 |
| **Supabase** | **OUT OF SCOPE** · **STOP / DIRECTOR AUTHORIZATION REQUIRED** | SP01-01 §6 |
| **Persistence** | **OUT OF SCOPE** for redesign · **READ-ONLY EVIDENCE** · **DIRECTOR AUTHORIZATION REQUIRED** for new persistence | SP01 exclusions |
| **APIs** | **OUT OF SCOPE** for extensions · **READ-ONLY EVIDENCE** to exercise existing validators · **STOP** for new APIs | R-PLAN-05 pattern |
| **Authentication / Authorization** | **OUT OF SCOPE** · **READ-ONLY EVIDENCE** · TD-AUTH-PROD out of SP01 DoD | SP01-01 |
| **External integrations** | **OUT OF SCOPE** · **STOP / DIRECTOR AUTHORIZATION REQUIRED** | SP01 exclusions |

---

## 23. Out of scope

| Item | Authority |
|------|-----------|
| IB-06 implementation under this Discovery | Discovery Nature |
| IB-07 Official Operational Flow and later IBs | Plan sequence |
| CB semantic rewrite / elrSchema mutation | CAP-05; Plan STOP |
| Product / Marketplace / Arizona / Web / Supabase | SP01-01 §6 |
| Hardening / P-INT reopen as pending IMPL | Plan / Continuity |
| Resolving CAP-02 GAP-IB03-01 under IB-06 color | IB-03 → IB-08 |
| Declaring SP01 COMPLETE | Plan IB-10 only |

---

## 24. STOP conditions

Halt future IB-06 Mandate execution (when issued) if any of:

| STOP |
|------|
| Any CB semantic / body / elrSchema / state-machine modification |
| Claim that Alive requires CB redesign (Director — fuera de SP01) |
| Hardening modification under SP01 color |
| Unauthorized P-INT reopen |
| Product / Marketplace / Arizona / Web / Supabase invasion |
| Runtime / Control Plane / API / persistence redesign to force CAP-05 |
| Opening IB-07+ or SP02 under IB-06 color |
| Using IB-06 to silently “fix” CAP-02 GAP-IB03-01 |
| Reopening Construction Blueprint as pending IMPL |

```text
ON STOP: HALT · REPORT TO DIRECTOR · NO SILENT CONTINUATION
ANY NEED FOR CB CHANGE = STOP + DIRECTOR (OUTSIDE SP01)
```

---

## 25. Risks

| ID | Risk | Observation |
|----|------|-------------|
| OBS-R06-01 | Temptation to “fix” Alive by rewriting CB | Forbidden — STOP + Director |
| OBS-R06-02 | Equating construction COMPLETE with CAP-05 PROVED without reconfirmation | IB-01 residual: Reconfirm→IB-06 required |
| OBS-R06-03 | Using optional CB runners as license to modify CB | Runner exercise ≠ CB mutation authority |
| OBS-R06-04 | Conflating CAP-02 GAP with CB integrity | Separate CAP targets; IB-08 owns CAP-02 disposition |
| OBS-R06-05 | Plan requires CAP-05 PROVED; no explicit GAP→IB-08 in IB-06 row | If integrity cannot be shown without CB change → STOP / Director (Plan) — do not invent CB rewrite |

---

## 26. GAP disposition (officially grounded only)

Plan §7 IB-06 closure does **not** define a CAP-05 **GAP → IB-08** alternate disposition.

Official grounded disposition path:

```text
CAP-SP01-05 → PROVED
OR
Any need for CB change → STOP + Director (fuera de SP01)
```

No other GAP disposition for CAP-05 is invented by this Discovery.

---

## 27. Discovery conclusion

| Question | Answer |
|----------|--------|
| Is IB-06 sufficiently defined? | **YES** |
| Exact title | **SP01-IB-06 — CB Semantics Integrity Proof** |
| CAP target | **CAP-SP01-05 only** |
| Acceptance | **ACC-04** / Alive (E) / MVI-5 / Plan STOP-on-CB-change |
| Primary authority | SP01 Official Implementation Plan §7 SP01-IB-06 |
| Type | Documentary / verification **proof** |
| CB modifications | **Forbidden** (STOP if required) |
| Implementation authorized? | **NO** |

---

## 28. Readiness for Official Implementation Plan

```text
DISCOVERY COMPLETE — READY FOR IMPLEMENTATION PLAN
```

**Does not mean:** Implementation Mandate issued · IMPL authorized · CB touched · CAP-05 PROVED · IB-07 opened.

---

## Binding footer

```text
BLOCK: SP01-IB-06
TITLE: CB Semantics Integrity Proof
CAP: CAP-SP01-05 ONLY
ACC: ACC-04 / MVI-5 / Alive (E)
TYPE: DOCUMENTARY / VERIFICATION PROOF
CB SEMANTIC REWRITE: FORBIDDEN
IMPLEMENTATION: NOT AUTHORIZED
NO IB-07+
```

---

```text
DISCOVERY COMPLETE — READY FOR IMPLEMENTATION PLAN
```

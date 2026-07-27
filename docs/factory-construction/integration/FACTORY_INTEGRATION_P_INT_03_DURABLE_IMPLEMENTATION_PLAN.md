# FACTORY INTEGRATION P-INT-03
## ELR PERSISTENCE BRIDGE — DURABLE PERSISTENCE (RESIDUAL)
## IMPLEMENTATION PLAN

**Document ID:** `FACTORY_INTEGRATION_P_INT_03_DURABLE_IMPLEMENTATION_PLAN.md`  
**Phase:** Factory Integration — Master Plan Fase II (orquestación controlada)  
**Block:** P-INT-03 — ELR Persistence Bridge (**Durable Persistence residual** — Master Plan Fase II ítem 5)  
**Document Type:** Technical Implementation Plan  
**Status:** **PLAN ONLY — NO IMPLEMENTATION AUTHORIZED BY THIS DOCUMENT**  
**Ready for:** Documentary Audit  

**Repository:** RealEstateSniper  
**Branch baseline:** `integration/factory-complete-20260725`  

**Normative sources:**

1. `docs/factory-construction/FACTORY_INTEGRATION_MASTER_PLAN.md` (§3.2 P-INT-03; §4.2 ELR Store Adapter; §5 Fase II ítems 4–6; §6.2–6.3; §7.1; §9; §10)  
2. `docs/factory-construction/FACTORY_2_0_COMPLETE_CONTINUITY_DOSSIER.md` (§11 P-INT-03; §13 Offline COMPLETE; §21–§22; §27 protocol; §30 residual; **TD-ELR-CLOUD**; **TD-SQLITE**)  
3. `docs/factory-construction/integration/FACTORY_INTEGRATION_P_INT_03_OFFLINE_IMPLEMENTATION_PLAN.md`  
4. `docs/factory-construction/integration/FACTORY_INTEGRATION_P_INT_03_OFFLINE_IMPL_STATUS.md`  
5. `docs/factory-construction/FACTORY_2.0_CONSTRUCTION_BLUEPRINT.md` (CB-01 Registry / ELR)  
6. Official Discovery — Master Plan Fase II ítem 5 / P-INT-03 Durable Persistence (session artifact, approved) — **COMPLETE**  
7. Construction ledger `docs/factory-construction/phases/construction-phase-status.json` (CB-00→CB-19 APPROVED — construction closed)

**Director authorization (this Plan document / existence as planning artifact):** **approved to exist as Plan ONLY**.  
**Director authorization (P-INT-03 Durable IMPL code):** **NOT AUTHORIZED** by this document.  
**Director authorization (SQLite / Web / Product / Marketplace / II.7 / push / deploy):** **NOT AUTHORIZED** by this document.

**Technological path decision (binding for this Plan):**

```text
NOT SELECTED BY THIS PLAN.
```

Master Plan names the residual as **object store / DB dedicada** (and Continuity / Offline name **cloud / Supabase ELR** as open).  
This Plan **does not** choose among Object Store, Cloud, or Dedicated Database.  
Any future IMPL mandate **MUST** select exactly one authorized path **after** Documentary Audit and an **explicit Director mandate**, or via a **Plan Update** that records that choice. Until then, path selection remains **OPEN / UNDECIDED**.

---

## 0. Absolute Non-Authorization Banner

This Plan **does not** authorize implementation, adapters, runners, migrations, package changes, Web changes, Supabase product surfaces, or default-store flips.

| Surface | Status under this Plan |
|---------|------------------------|
| P-INT-03 Durable IMPL code / new adapters | **NOT AUTHORIZED** until separate Director IMPL mandate |
| Choice of Object Store vs Cloud vs Dedicated DB | **NOT SELECTED** by this Plan |
| SQLite / any SQL engine | **DEFERRED / NOT AUTHORIZED** (**TD-SQLITE**) |
| Modification of ELR constitutional semantics | **PROHIBITED** |
| Global flip of `FactoryRegistry` default store | **NOT AUTHORIZED** (Offline O6; separate mandate required if ever contemplated) |
| Reopening P-INT-03 Offline as pending IMPL | **PROHIBITED** |
| Reopening P-INT-01 Slice A/B / Admin Live Wiring / P-INT-09 / P-INT-10 | **PROHIBITED** |
| Web / React / FCC / Admin UI / `vite.config.js` | **PROHIBITED** |
| Supabase product tables / `deals` / RLS product / Marketplace storage as ELR | **PROHIBITED** |
| Product / Marketplace / Decision Engine / Investor API | **PROHIBITED** |
| II.7 Delivery | **NOT OPENED** |
| Auth productiva (**TD-AUTH-PROD**) | **NOT AUTHORIZED** by this Plan |
| Push / merge / deploy / remote CI wiring | **NOT AUTHORIZED** by this Plan |
| Fase II ítem 6 as part of this block | **NOT OPENED** |

**Hard separations:**

```text
P-INT-03 Offline (COMPLETE)          ≠  P-INT-03 Durable residual (this Plan)
ELR constitutional schema            ≠  store adapter implementation
FileElrStore (default baseline)      ≠  AtomicFileElrStore (Offline inject-only)
AtomicFileElrStore                   ≠  SQLite
P-INT-03 Offline durable FS          ≠  object store / cloud / dedicated DB
Expediente ELR document              ≠  deals / markets / product tables
FactoryRegistry contract             ≠  persistence medium
This Implementation Plan             ≠  IMPL authorization
Path Object Store / Cloud / DB       ≠  selected (UNDECIDED)
```

---

## 1. Identification

| Campo | Valor |
|-------|--------|
| **Nombre oficial** | **P-INT-03 — ELR Persistence Bridge (Durable Persistence residual)** |
| **Master Plan reference** | §5 **Fase II — ítem 5**: *Persistencia ELR durable (adapter) manteniendo schema CB-01* |
| **Master Plan catalog** | §3.2 **P-INT-03**: *ELR durable (object store / DB dedicada) sin mezclar con `deals`* — depende de **CB-01 schema** |
| **Related service catalog** | §4.2 **ELR Store Adapter** — persistencia durable del ELR; no mezclar con `deals` |
| **Safe-integration rule** | §7.1 — Adapter de persistencia ELR **compatible** con schema CB-01 — *sustituye store, no contrato* |
| **Prior slice** | P-INT-03 **Offline / Local Durable** — **COMPLETE** (Status: PASS WITH OBSERVATIONS) |
| **Estado actual** | Offline **CLOSED**; Master Plan P-INT-03 cloud/object-store/DB row **OPEN / NOT IMPLEMENTED / NOT AUTHORIZED**; SQLite **DEFERRED**; path medium **UNDECIDED** by this Plan |
| **Debt tags** | **TD-ELR-CLOUD** OPEN / NOT AUTHORIZED; **TD-SQLITE** DEFERRED / NOT AUTHORIZED |
| **Fase II prior item** | Ítem 4 (Job runner + Orchestration API staging) **DELIVERED** via P-INT-01 Slice B — **FULLY CLOSED** — do not reopen |
| **Fase II next item (not this Plan)** | Ítem 6 (CI subset CB-15/16/18/19) — **posterior**; does not reduce P-INT-10 |

### 1.1 Dependencias

| Dependencia | Rol | Estado |
|-------------|-----|--------|
| **CB-01** Registry / ELR | Owner constitucional; `FactoryRegistry({ store })` | Construction **COMPLETE** |
| **ELR Schema** | Vocabulario / secciones / integridad constitucional | **Immutable** under this Plan |
| **ElrStorePort** | Duck-type / port contract (Offline) | **Exists** — must remain compatible |
| **FileElrStore** | Default baseline store | **Retain** as default unless separate mandate |
| **AtomicFileElrStore** | Offline local durable adapter | **COMPLETE** — inject-only; do not reopen as pending |
| **CB-15** | Persists acts via Registry/ELR; staging jobs already delivered | Construction **COMPLETE**; Slice B **FULLY CLOSED** — regress, do not redesign |
| **CB-02 / CB-16** | Consumers via Registry | Regress in future IMPL DoD; no redesign |
| **Blueprint CB-01** | Construction authority for Registry/ELR | Binding — no CB reopen |
| Path medium (object store / cloud / DB) | Residual Master Plan surface | **OPEN / UNDECIDED** |

---

## 2. Objetivo funcional

Preparar y, **solo tras mandato IMPL futuro**, cerrar el **residual oficial** de **P-INT-03 — ELR Persistence Bridge** correspondiente al Master Plan Fase II ítem 5:

1. Proveer **persistencia ELR durable** mediante un **adapter** compatible con el puerto de store ya establecido.  
2. **Mantener** el schema constitucional CB-01 / ELR **sin cambio semántico**.  
3. **No mezclar** ELR con tablas producto / `deals` / Marketplace.  
4. Distinguir de forma permanente el slice **Offline COMPLETE** del residual **Durable** (object store / cloud / DB dedicada — vía **aún no seleccionada**).  
5. Dejar el bloque auditable y listo para Mandate → IMPL **solo** cuando el Director autorice y, en ese momento, fije la vía de medio.

**No es objetivo de este Plan:**

- implementar código;  
- elegir Object Store vs Cloud vs Dedicated DB;  
- introducir SQLite;  
- rediseñar Factory / CB-01…CB-19;  
- tocar Web o superficies producto Supabase;  
- cerrar Fase II ítem 6;  
- autorizar push/deploy.

---

## 3. Scope IN

Únicamente lo siguiente forma parte de este bloque (documentalmente ahora; IMPL solo tras mandato):

1. **Residual Master Plan P-INT-03** — persistencia ELR durable vía adapter, schema CB-01 preservado.  
2. **Plane separation** — Offline COMPLETE vs Durable residual OPEN vs SQLite DEFERRED vs product storage prohibido.  
3. **Port compatibility requirement** — cualquier futuro adapter Durable **MUST** respetar `ElrStorePort` / `FactoryRegistry({ store })` (sustituir store, no contrato).  
4. **Integrity / fail-closed principles** — sin datos parciales; sin silent repair del corpus ELR; auditabilidad (alineado a principios Offline; **sin** especificar medio).  
5. **Default-store policy continuity** — `FileElrStore` permanece default; Atomic permanece inject-only salvo mandato separado.  
6. **Regression obligation** — CB-01, CB-02, CB-15 (+ P-INT-02 Offline / P-INT-03 Offline runners as applicable) en DoD futuro.  
7. **Debt accounting** — relación explícita con **TD-ELR-CLOUD** (y **TD-SQLITE** si el deferral se reabriera por mandato distinto — **no** por este Plan).  
8. **Documentary artifacts** — este Plan → Documentary Audit → (optional Plan Update if path chosen) → Mandate → IMPL → Independent Technical Audit → Status → Status Commit.  
9. **Stop Rules / exclusions / audit plan** definidos en este documento.

---

## 4. Scope OUT

Queda expresamente fuera de este bloque:

1. P-INT-03 Offline re-implementation or redesign.  
2. Selection of Object Store vs Cloud vs Dedicated DB (**deferred to Mandate / Plan Update**).  
3. SQLite / any SQL engine (**DEFERRED**).  
4. Semantic changes to `elrSchema`, `appendElrEntry`, `elrSequence`, state machine, Registry public APIs (beyond optional lifecycle already defined Offline).  
5. Global default store flip.  
6. Web / FCC / Admin UI / Vite.  
7. Product tables / `deals` / markets as ELR store.  
8. Marketplace / Product Catalog / Decision Engine / Projection.  
9. Auth productiva / Edge Functions / BFF / investor APIs.  
10. II.7 Delivery.  
11. P-INT-02 Live; P-INT-04 cloud sink; P-INT-05…08.  
12. Reopening Slice A/B, Admin Live Wiring, P-INT-09, P-INT-10.  
13. Fase II ítem 6 CI subset work.  
14. Other `data/factory-*` stores (Evidence, Foundation, Legitimacy, Distress, Economy, Environment, Intelligence, Compliance).  
15. SourceIngestionLedger redesign; full event-sourcing / replay engine.  
16. Push / merge / deploy / GitHub Actions as part of this Plan.  
17. Package dependency additions without a future Mandate that explicitly authorizes them.

---

## 5. Arquitectura (aprobada — sin rediseño)

Este Plan **reafirma** la arquitectura ya aprobada. **No** inventa componentes nuevos ni elige medio de persistencia.

### 5.1 Arquitectura Offline ya entregada (baseline inmutable para este residual)

```text
ElrStorePort
  ├── FileElrStore          ← FactoryRegistry DEFAULT
  └── AtomicFileElrStore    ← explicit injection only (Offline COMPLETE)
        │
        └── FactoryRegistry({ store })
              ├── CB-01 lifecycle / ELR acts
              ├── CB-02 ingest acts
              └── CB-15 / CB-16 acts via Registry
```

**Unit of persistence (constitutional):** one expediente per `factory_key` (Registry record + nested ELR), as expected by `FactoryRegistry` / `store.write(record)`.

**Offline unit of integrity (local):** pair `(canonical JSON, sidecar .sha256)` — retained as Offline fact; **not** redefined here for an undecided medium.

### 5.2 Residual Durable (conceptual — medium UNDECIDED)

```text
ElrStorePort
  ├── FileElrStore                 (DEFAULT — retain)
  ├── AtomicFileElrStore           (Offline COMPLETE — inject-only)
  └── [UNDECIDED PATH] Durable adapter
        (object store  OR  cloud/Supabase-ELR  OR  dedicated DB)
        — NOT SELECTED BY THIS PLAN —
              │
              └── FactoryRegistry({ store })   ← same contract
```

**Principle (Master Plan §7.1):** substitute **store by injection**, not constitutional contract, not Registry semantic APIs, not ELR schema.

**Prohibited architecture:** writing ELR into Marketplace/`deals` tables; using product DB as ELR substitute (Master Plan §6.3 / §7.3).

### 5.3 Construction / Blueprint

CB-01 Registry/ELR construction remains **COMPLETE** per Blueprint and `construction-phase-status.json`. This block is **integration adapter** work, not CB reopening.

---

## 6. Contratos constitucionales (inmutables)

| Contrato | Confirmación bajo este Plan |
|----------|------------------------------|
| **CB-01** | Owner of Registry/ELR lifecycle — **no semantic redesign**; construction **COMPLETE** |
| **ELR Schema** (`elrSchema` / sections / allowlist) | **Immutable** — adapter MUST NOT reinterpret sections or call `appendElrEntry` |
| **FactoryRegistry** | Remains the sole orchestration of expediente lifecycle over an injected `store`; APIs semantic surface **unchanged** except optional lifecycle hooks already defined Offline |
| **ElrStorePort** | Duck-type contract (`exists` / `read` / `write` / `resolvePath` / `listFactoryKeys` + optional `removeArtifacts`) remains the integration boundary — **compatible, not replaced by a new constitutional contract** |

**Binding rule:** Durable work **MAY** add an adapter behind the port; it **MUST NOT** create a parallel ELR truth, mutate constitutional vocabulary, or bypass Registry.

---

## 7. Restricciones

### 7.1 Absolutas

1. **NO IMPL** until separate Director mandate after Documentary Audit (and path selection recorded).  
2. **NO** choice of Object Store / Cloud / Dedicated DB in this Plan.  
3. **NO** SQLite while **TD-SQLITE** remains DEFERRED.  
4. **NO** Web / FCC / Admin UI changes.  
5. **NO** product Supabase / `deals` / Marketplace as ELR.  
6. **NO** ELR schema / state machine semantic changes.  
7. **NO** default store global flip without separate mandate + full regression.  
8. **NO** reopen of closed slices (Offline P-INT-03, Slice A/B, Admin Live Wiring, P-INT-09/10, Fase I).  
9. **NO** II.7, Product, Marketplace, Decision Engine under color of this Plan.  
10. **NO** push / merge / deploy authorized by this Plan.  
11. Continuity **Supabase Stop Rule (§21)** and **Web Stop Rule (§20)** apply if any future Mandate proposes touching those surfaces — **STOP + report** required.  
12. Master Plan DoD: Marketplace **must not** call Factory; CB files need not change for MVI adapters.

### 7.2 De protocolo (Continuity §27)

```text
1. Discovery          → COMPLETE (approved)
2. Implementation Plan → THIS DOCUMENT (PLAN ONLY)
3. Documentary Audit
4. Documentary Commit
5. Implementation        ← requires Mandate (NOT this Plan)
6. Independent Technical Audit
7. Implementation Commit
8. Status
9. Status Commit
```

Do not skip steps. Do not invent phases. Audits READ_ONLY.

---

## 8. Riesgos

| ID | Riesgo | Severidad documental | Mitigación documental (no IMPL) |
|----|--------|----------------------|----------------------------------|
| R1 | Mezclar ELR con `deals` / Marketplace | HIGH | Exclusión absoluta; Master Plan §6.3 / §9 |
| R2 | Confundir Offline COMPLETE con cierre Master Plan P-INT-03 | HIGH | §0 / §1 / hard separations |
| R3 | Elegir medio prematuramente sin Mandate | HIGH | Path **UNDECIDED** until Mandate / Plan Update |
| R4 | Cambiar semántica ELR bajo color de “durable” | HIGH | §6 immutability |
| R5 | Introducir SQLite pese a DEFERRED | MEDIUM | **TD-SQLITE** exclusion |
| R6 | Flip silencioso del default store | MEDIUM | Offline O6 continuity |
| R7 | Romper consumidores CB-01/02/15/16 | HIGH | Mandatory regressions in DoD |
| R8 | Scope creep a otros `data/factory-*` | MEDIUM | Scope OUT |
| R9 | Abrir Web/Supabase sin STOP report | HIGH | Continuity §20 / §21 |
| R10 | Reabrir Slice B / Service Edge under color of ELR durable | MEDIUM | Closed-slice exclusion |
| R11 | Package / dependency creep without mandate | MEDIUM | Exclusion until Mandate authorizes |
| R12 | Tratar este Plan como autorización de IMPL | HIGH | Absolute Non-Authorization Banner |

---

## 9. Stop Rules

**STOP immediately** (no further IMPL progress; escalate to Director) if any of the following occurs:

| ID | Condición de parada |
|----|---------------------|
| S1 | Attempt to implement code under this Plan alone (no IMPL mandate) |
| S2 | Attempt to select Object Store / Cloud / Dedicated DB **without** recorded Director Mandate or Plan Update |
| S3 | Proposal or change that writes ELR into `deals` / Marketplace / product tables |
| S4 | Semantic change to `elrSchema` / `appendElrEntry` / `elrSequence` / state machine |
| S5 | Introduction of SQLite / SQL engine while DEFERRED |
| S6 | Web / FCC / Admin UI modification without Continuity §20 STOP report + approval |
| S7 | Supabase product / RLS / migrations touch without Continuity §21 STOP report + approval |
| S8 | Reopening closed blocks (Offline P-INT-03, Slice A/B, Admin Live Wiring, P-INT-09/10) as pending IMPL |
| S9 | Default `FactoryRegistry` store flip without separate mandate |
| S10 | Contradiction between this Plan and Master Plan / Continuity / Offline Status that cannot be resolved READ_ONLY |
| S11 | Push / deploy / remote CI presented as part of this block without express authorization |
| S12 | Scope expansion into II.7 / Product / Marketplace / Decision Engine |

---

## 10. Validaciones requeridas

*(Obligatorias para un futuro IMPL — **no** ejecutadas ni autorizadas por este Plan.)*

### 10.1 Precondiciones documentales (antes de Mandate IMPL)

1. Documentary Audit of **this Plan** = PASS or PASS WITH OBSERVATIONS (observations closed or accepted).  
2. Path medium **explicitly selected** by Director Mandate and/or Plan Update.  
3. Mandate ID issued (illustrative form: `P-INT-03-DURABLE-*-IMPL` — exact ID reserved for Director).  
4. Confirmation Offline Status remains CLOSED and not contradicted.

### 10.2 Validaciones técnicas futuras (post-Mandate, at IMPL)

1. **Port compatibility** — Durable adapter satisfies `ElrStorePort` duck-type used by `FactoryRegistry`.  
2. **Constitutional non-mutation** — static/semantic proof: no ELR schema / append / sequence / state-machine drift.  
3. **Isolation from product storage** — no writes to `deals` / Marketplace tables as ELR.  
4. **Fail-closed integrity** — no partial expediente returned; no silent repair.  
5. **Default store policy** — default remains `FileElrStore` unless Mandate explicitly flips it.  
6. **Regression suite (minimum):**  
   - `runCb01RegistryValidation`  
   - `runCb02DsoValidation` (or equivalent CB-02 runner in force)  
   - CB-15 smoke / orchestration validation path in force  
   - `runPInt03ElrPersistenceValidation` (Offline) must continue to PASS  
   - P-INT-02 Offline runner regression as applicable  
7. **Static audit** — no unauthorized Web/product surfaces; no SQLite if still deferred; secrets/credentials policy fail-closed.  
8. **Debt update** — Status must state whether **TD-ELR-CLOUD** is closed, reduced, or remains open; **TD-SQLITE** remains DEFERRED unless separately authorized.

---

## 11. Definition of Done

### 11.1 DoD de este documento (Plan ONLY)

- [x] Identifica Master Plan Fase II ítem 5 / P-INT-03 residual  
- [x] Diferencia Offline COMPLETE vs Durable OPEN vs SQLite DEFERRED  
- [x] **No** selecciona Object Store / Cloud / Dedicated DB  
- [x] Reafirma contratos CB-01 / ELR Schema / FactoryRegistry / ElrStorePort  
- [x] Declara restricciones, riesgos, Stop Rules, exclusiones  
- [x] Define validaciones y DoD futuros  
- [x] Define plan de auditoría  
- [x] **No** autoriza IMPL  

**Plan DoD:** listo para **Documentary Audit**.

### 11.2 DoD de un futuro IMPL (informativo — no autorizado aquí)

Un futuro Status podrá declarar P-INT-03 Durable **COMPLETE** solo si:

1. Mandate executed for a **single selected path**.  
2. Adapter behind `ElrStorePort` delivers durable ELR persistence **without** schema mutation.  
3. ELR remains **≠** `deals` / product tables.  
4. Required validations (§10.2) PASS (or PASS WITH OBSERVATIONS accepted).  
5. Independent Technical Audit PASS or PASS WITH OBSERVATIONS.  
6. Implementation Commit + Status Commit completed per protocol.  
7. Master Plan residual for the **selected** path closed honestly; any unselected path remains explicitly OPEN/DEFERRED/OUT as applicable.  
8. Marketplace still does not call Factory (Master Plan §10).

---

## 12. Exclusiones (no modificable por este bloque)

Este bloque **no podrá** modificar:

| Superficie | Motivo |
|------------|--------|
| `elrSchema.js` semantics / `appendElrEntry` / `elrSequence` / state machine | Constitucional |
| Default `FactoryRegistry` store binding (without separate mandate) | Offline O6 |
| Offline `AtomicFileElrStore` protocol as “reopen pending IMPL” | Offline CLOSED |
| `services/factory-service-edge/**` | Slice A CLOSED |
| `services/factory-orchestration-edge/**` | Slice B CLOSED |
| Web / FCC / Admin / Vite | Continuity §20 |
| Product Supabase `deals` / markets / RLS product | Continuity §21 / Master Plan §6.3 |
| Marketplace / Product / Decision Engine / Projection | Sovereign downstream |
| II.7 | NOT OPENED |
| P-INT-02 Live / P-INT-04 cloud / P-INT-05…08 | Outside block |
| P-INT-09 / P-INT-10 / Fase I items | CLOSED |
| Other `data/factory-*` stores | Offline exclusion continuity |
| `construction-phase-status.json` via `--mark-complete` | Construction closed; not this block’s job |
| SQLite introduction | DEFERRED |
| Path selection among Object Store / Cloud / Dedicated DB **inside this Plan text as a decision** | UNDECIDED by design |

---

## 13. Plan de auditoría

### 13.1 Documentary Audit (siguiente paso — READ ONLY)

Auditor documental debe verificar:

1. Conformidad con Master Plan §3.2 / §5 ítem 5 / §7.1.  
2. Conformidad con Continuity (P-INT-03 Offline CLOSED; **TD-ELR-CLOUD** OPEN; **TD-SQLITE** DEFERRED; protocol §27).  
3. Conformidad con Official Discovery aprobado.  
4. **No** path selection disguised as architecture.  
5. **No** IMPL authorization disguised as Plan.  
6. Hard separations Offline ≠ Durable residual.  
7. Constitutional immutability §6 present and binding.  
8. Stop Rules / exclusions / DoD complete.  
9. No contradiction that reopens Fase I, Slice B, or Offline P-INT-03.  
10. Blueprint / CB construction not reopened.

**Outcome classes:** PASS | PASS WITH OBSERVATIONS | FAIL.

Observations, if any, require Plan Update **before** Mandate IMPL.

### 13.2 Independent Technical Audit (solo post-IMPL futuro)

Auditor técnico (READ ONLY) debe verificar contra Mandate + this Plan (+ Plan Update if any):

1. Scope IN delivered; Scope OUT untouched.  
2. Port compatibility and constitutional non-mutation.  
3. Isolation from `deals` / product storage.  
4. Validations §10.2 executed and honest.  
5. Default-store policy respected.  
6. No unauthorized Web / SQLite / closed-slice reopen.  
7. Status honesty regarding **TD-ELR-CLOUD** / residual Master Plan row.

---

## 14. Authorization clause

```text
This Implementation Plan does NOT authorize:
  - any engineering implementation;
  - creation of Durable adapters;
  - selection of Object Store / Cloud / Dedicated DB;
  - SQLite;
  - Web / FCC changes;
  - Supabase product / deals as ELR;
  - reopening Offline P-INT-03 or Slice B;
  - push / merge / deploy.

P-INT-03 Offline remains COMPLETE / CLOSED.
Master Plan Fase II ítem 4 remains DELIVERED (Slice B FULLY CLOSED).
Master Plan Fase II ítem 5 residual remains OPEN pending Mandate.

Next official documentary step:
  DOCUMENTARY AUDIT of this Plan

Until Documentary Audit PASS (or PASS WITH OBSERVATIONS closed)
and an explicit Director IMPL mandate (with path selection),
no implementation block is authorized.
```

---

## 15. Documentary Status

| Ítem | Estado |
|------|--------|
| Official Discovery (Fase II ítem 5 / P-INT-03 Durable) | **COMPLETE / APPROVED** |
| This Implementation Plan | **PLAN ONLY — READY FOR DOCUMENTARY AUDIT** |
| Path Object Store / Cloud / Dedicated DB | **UNDECIDED** |
| P-INT-03 Durable IMPL | **NOT AUTHORIZED** |
| SQLite | **DEFERRED / NOT AUTHORIZED** |
| P-INT-03 Offline | **COMPLETE / CLOSED** |
| II.7 / Web / Product / Marketplace | **NOT OPENED / NOT AUTHORIZED** |

---

## 16. Final Clause

This Plan authorizes **only** the existence of an audited planning document for **P-INT-03 — ELR Persistence Bridge (Durable Persistence residual)** under Master Plan Fase II ítem 5.

It does **not** authorize writing adapters, selecting a persistence medium, adding SQLite, connecting product Supabase, modifying Factory constitutional ELR semantics, touching Web, or closing **TD-ELR-CLOUD** by assertion alone.

Until a separate Director implementation mandate is issued **after** Documentary Audit (and path selection is recorded), the Durable residual remains **OPEN / NOT IMPLEMENTED / NOT AUTHORIZED**.

---

**END OF DOCUMENT**

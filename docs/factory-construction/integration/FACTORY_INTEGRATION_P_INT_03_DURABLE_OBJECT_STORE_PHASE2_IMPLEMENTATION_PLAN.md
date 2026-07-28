# FACTORY INTEGRATION P-INT-03
## ELR PERSISTENCE BRIDGE — DURABLE OBJECT STORE — PHASE 2
## IMPLEMENTATION PLAN

**Document ID:** `FACTORY_INTEGRATION_P_INT_03_DURABLE_OBJECT_STORE_PHASE2_IMPLEMENTATION_PLAN.md`  
**Phase:** Factory Integration — Master Plan Fase II ítem 5 / P-INT-03 Durable residual  
**Block:** P-INT-03 — Object Store Phase 2  
**Document Type:** Technical Implementation Plan  
**Status:** **PLAN ONLY — NO IMPLEMENTATION AUTHORIZED BY THIS DOCUMENT**  
**Ready for:** Documentary Audit  

**Mandate ID (binding, unchanged):** `P-INT-03-DURABLE-OBJECT-STORE-IMPL`  
**Implementation Path (binding):** **OBJECT STORE**  

```text
PATH SELECTED: OBJECT STORE
NO NEW PATH
NO PATH CHANGE
Mandate NOT expanded / NOT modified by this Plan
```

**Normative sources (authorized for this Plan):**

1. `docs/factory-construction/integration/FACTORY_INTEGRATION_P_INT_03_DURABLE_OBJECT_STORE_PHASE2_DISCOVERY_REPORT.md`  
2. `docs/factory-construction/integration/P_INT_03_DURABLE_IMPLEMENTATION_MANDATE.md`  
3. `docs/factory-construction/FACTORY_INTEGRATION_MASTER_PLAN.md`  
4. `docs/factory-construction/FACTORY_2_0_COMPLETE_CONTINUITY_DOSSIER.md`  

**Director authorization (this Plan as planning artifact):** **approved to exist as Plan ONLY**.  
**Director authorization (Phase 2 IMPL code):** **NOT AUTHORIZED** by this document.

---

## 0. Absolute Non-Authorization Banner

This Plan **does not** authorize implementation, package changes, Web, Supabase, SQLite, Dedicated DB, Product, Deals, Marketplace, CRM, default-store flips, Mandate expansion, or path change.

| Surface | Status under this Plan |
|---------|------------------------|
| Phase 2 IMPL code | **NOT AUTHORIZED** until protocol gates + Director order to execute IMPL under existing Mandate |
| Path | **OBJECT STORE only** — **no new path** |
| Cloud / Supabase-ELR / PostgREST | **OUT** (Mandate) |
| Dedicated DB / SQLite | **OUT / DEFERRED** |
| CB-00…CB-19 / FactoryRegistry / ElrStorePort / ELR semantics | **NO MODIFICATION** |
| Default `FileElrStore` | **UNCHANGED** |
| Vendor object-store SDK / `package.json` | **NOT AUTHORIZED** by this Plan (requires separate Director deps authorization per Mandate §6.17) |
| Push / deploy / II.7 | **NOT AUTHORIZED** |

---

## 1. Objetivo de Phase 2

Entregar, **solo tras autorización de ejecución IMPL bajo el Mandate vigente**, un **medio Object Store durable** que:

1. Implemente el contrato **`ObjectStoreBackend`** ya existente (Phase 1).  
2. Sea consumido por **`ObjectStoreElrStore`** mediante **inyección** (`FactoryRegistry({ store })`) — **sin** rediseñar `ElrStorePort`.  
3. Garantice que los objetos ELR **sobreviven reinicio de proceso** (capacidad ausente en `MemoryObjectStoreBackend`).  
4. Preserve integridad SHA-256 + fail-closed + `removeArtifacts`.  
5. Mantenga **`FileElrStore` como default** y Object Store **no** default.  
6. Permanezca estrictamente en path **OBJECT STORE** bajo Mandate `P-INT-03-DURABLE-OBJECT-STORE-IMPL`.

**No es objetivo:** cambiar path; ampliar Mandate; Cloud/Supabase; SQLite; Dedicated DB; flip default; modificar CB/Registry/puerto/semántica ELR; Product/Deals/Marketplace/Web/CRM.

---

## 2. Alcance

### 2.1 Scope IN

1. Un backend **durable** `ObjectStoreBackend` (process-surviving) bajo path **OBJECT STORE**.  
2. **Vía acotada por este Plan (sin nuevo path):** **local durable object-store backend** detrás del contrato Phase 1 — **sin** nuevas dependencias npm / SDK vendor en el alcance base de Phase 2.  
3. Integración por inyección con `ObjectStoreElrStore` existente (conservar adapter; no rediseñar contrato constitucional).  
4. Conservar `MemoryObjectStoreBackend` como baseline Phase 1 / utilidad de prueba.  
5. Runner / validaciones Phase 2 + regresiones Phase 1 Durable, P-INT-03 Offline, CB-01 (y CB-02/CB-15 según DoD parent Durable).  
6. Opcional (MAY): cerrar observaciones no bloqueantes del Independent Technical Audit Phase 1 (inexistencia; checksum mismatch; aislamiento multi-key; inventario `removeArtifacts`).  
7. Status post-IMPL con honesty de residual Mandate / deuda.

### 2.2 Scope OUT

1. Cualquier path distinto de **OBJECT STORE**.  
2. Cloud / Supabase-ELR / PostgREST / Dedicated DB / SQLite.  
3. Vendor/remoto object-store SDK **salvo** orden Director explícita de deps (fuera del alcance base de este Plan).  
4. Reapertura Offline / `AtomicFileElrStore` redesign.  
5. Flip default `FileElrStore`.  
6. Modificación CB-00…CB-19, `FactoryRegistry`, `ElrStorePort`, semántica ELR.  
7. Product / Deals / Marketplace / Web / CRM / II.7.  
8. Ampliar o modificar el texto del Mandate.  
9. Push / merge / deploy como parte de este Plan.

---

## 3. Componentes afectados

| Componente | Acción prevista (post-IMPL authorization) |
|------------|-------------------------------------------|
| `src/factory/pint03Durable/` | **MAY** add durable `ObjectStoreBackend` implementation (local durable) |
| `ObjectStoreElrStore` | **Reuse** by injection; modify **only** if strictly required for durable backend wiring **without** changing `ElrStorePort` contract |
| Phase 2 validation runner | **MAY** create under `src/` (Durable Phase 2 only) |
| `MemoryObjectStoreBackend` | **Retain** |

---

## 4. Componentes excluidos

| Componente | Motivo |
|------------|--------|
| `src/factory/cb00…cb19/**` | Mandate — no CB modification |
| `FactoryRegistry` | Mandate — no modification |
| `ElrStorePort` | Mandate — no modification |
| `elrSchema` / append / sequence / state machine | Constitutional ELR |
| `AtomicFileElrStore` / Offline reopen | Offline CLOSED |
| `package.json` / lockfile (base Phase 2) | No deps without Director deps order |
| Web / FCC / Vite / CRM | Continuity §20 / Mandate |
| Supabase / Product / Deals / Marketplace | Continuity §21 / Mandate / Master Plan §6.3 |
| Cloud / Dedicated DB / SQLite paths | Mandate OUT |

---

## 5. Riesgos

| ID | Riesgo | Severidad |
|----|--------|-----------|
| R1 | Confundir local durable Object Store con path Cloud/Supabase-ELR | HIGH |
| R2 | Introducir SDK / deps sin orden Director | HIGH |
| R3 | Duplicar Offline Atomic bajo color de object store | HIGH |
| R4 | Flip default `FileElrStore` | HIGH |
| R5 | Modificar CB / Registry / ElrStorePort / semántica ELR | HIGH |
| R6 | Mezclar ELR con Product / Deals / Marketplace | HIGH |
| R7 | Declarar residual Mandate / TD-ELR-CLOUD cerrado sin honesty | MEDIUM |
| R8 | Tratar este Plan como autorización de IMPL | HIGH |
| R9 | Ampliar Mandate o seleccionar nuevo path | HIGH |

---

## 6. Stop Rules

| ID | Condición |
|----|-----------|
| S1 | Intento de IMPL bajo este Plan solo (sin orden Director de ejecución / gates) |
| S2 | Cambio de path fuera de OBJECT STORE |
| S3 | Supabase touch (Continuity §21 — STOP + report) |
| S4 | Web/FCC touch (Continuity §20 — STOP + report) |
| S5 | SQLite / Dedicated DB / SQL engine |
| S6 | Flip default `FileElrStore` |
| S7 | Modificación CB / FactoryRegistry / ElrStorePort / semántica ELR |
| S8 | Product / Deals / Marketplace / CRM |
| S9 | `package.json` / SDK sin orden Director deps |
| S10 | Reapertura Offline como pending IMPL |
| S11 | Ampliar o reescribir Mandate |
| S12 | Contradicción irresoluble con Discovery Phase 2 / Mandate / Master Plan / Continuity |

---

## 7. Criterios de aceptación

1. Backend durable implementa `ObjectStoreBackend` y es usable por `ObjectStoreElrStore` vía inyección.  
2. Persistencia **sobrevive reinicio de proceso** (demostrado por runner).  
3. Path permanece **OBJECT STORE**.  
4. `FileElrStore` default **unchanged**; Object Store **not** default.  
5. Sin modificación CB-00…19 / FactoryRegistry / ElrStorePort / semántica ELR.  
6. Sin Supabase / SQLite / Dedicated DB / Product / Deals / Marketplace / Web / CRM.  
7. Sin deps nuevas salvo orden Director registrada.  
8. Validaciones §8 PASS (o PASS WITH OBSERVATIONS aceptadas).  
9. Independent Technical Audit Phase 2 PASS o PASS WITH OBSERVATIONS.  
10. Status Phase 2 honest sobre residual Mandate / deuda.  
11. Mandate **no** ampliado; path **no** cambiado.

---

## 8. Validaciones requeridas

*(Obligatorias en IMPL futuro — **no** ejecutadas ni autorizadas por este Plan.)*

1. Contract: durable backend passes `assertObjectStoreBackend`.  
2. Port: `ObjectStoreElrStore` + durable backend passes `assertElrStorePort`.  
3. Durability: write → process restart simulation → read success.  
4. Integrity: SHA-256 / fail-closed (sidecar missing / mismatch as applicable).  
5. `removeArtifacts` cleans associated objects.  
6. Default Registry still `FileElrStore` (runtime + static as applicable).  
7. Regression: Phase 1 Durable runner PASS.  
8. Regression: `runPInt03ElrPersistenceValidation` PASS.  
9. Regression: `runCb01RegistryValidation` PASS.  
10. Optional MAY: Phase 1 audit OBS coverage items.  
11. Static: no Supabase/SQLite/Web/Product surfaces in Phase 2 diff.

---

## 9. Entregables

| Entregable | Momento |
|------------|---------|
| This Implementation Plan | **NOW** (documentary) |
| Documentary Audit of this Plan | Next |
| Documentary Commit (Plan) | After Audit PASS |
| Durable `ObjectStoreBackend` implementation | Post IMPL authorization |
| Phase 2 validation runner | Post IMPL authorization |
| Independent Technical Audit Phase 2 | Post IMPL |
| Implementation Commit Status Phase 2 | Post Audit |
| Git Implementation Commit | Only when Director orders |

---

## 10. Límites del Mandate

This Plan operates **strictly under** Mandate `P-INT-03-DURABLE-OBJECT-STORE-IMPL`.

| Límite | Confirmación |
|--------|--------------|
| Mandate ID | **Unchanged** — not re-issued / not expanded |
| Path | **OBJECT STORE only** |
| Adapter | `ElrStorePort` inject-only |
| Default | `FileElrStore` unchanged |
| Forbidden surfaces | Supabase, SQLite, Dedicated DB, Product, Deals, Marketplace, Web, CRM |
| CB / Registry / ELR semantics | No modification |
| Deps | Not authorized by this Plan |
| This Plan ≠ IMPL authorization | **Binding** |

---

## 11. Confirmación expresa de path

```text
Phase 2 path = OBJECT STORE
PATH SELECTED: OBJECT STORE
NO NEW PATH SELECTED
NO PATH CHANGE FROM MANDATE
Cloud / Supabase-ELR / Dedicated DB / SQLite = OUT
```

---

## 12. Protocolo (Continuity §27)

```text
1. Discovery Phase 2     → COMPLETE (approved as planning input)
2. Implementation Plan   → THIS DOCUMENT (PLAN ONLY)
3. Documentary Audit
4. Documentary Commit
5. Implementation        ← requires Director execution order under existing Mandate
6. Independent Technical Audit
7. Implementation Commit / Status
```

---

## 13. Documentary Status

| Ítem | Estado |
|------|--------|
| Path OBJECT STORE | **CONFIRMED** |
| Mandate | **UNCHANGED** — `P-INT-03-DURABLE-OBJECT-STORE-IMPL` |
| This Implementation Plan | **PLAN ONLY — READY FOR DOCUMENTARY AUDIT** |
| Phase 2 IMPL | **NOT AUTHORIZED** by this document |
| Phase 1 baseline | **COMPLETE / AUDITED** (do not reopen) |

---

## 14. Final Clause

This Plan authorizes **only** the existence of an audited planning document for **P-INT-03 Durable Object Store Phase 2**.

It does **not** authorize code, deps, path change, Mandate expansion, Supabase, SQLite, Dedicated DB, Product, Deals, Marketplace, Web, CRM, or default-store flip.

Until Documentary Audit PASS (or PASS WITH OBSERVATIONS closed) and an explicit Director order to execute IMPL under the existing Mandate, Phase 2 code remains **NOT AUTHORIZED**.

---

**END OF DOCUMENT**

# OFFICIAL DISCOVERY
## P-INT-03 Durable — Object Store — Phase 2

| Campo | Valor |
|-------|--------|
| **Document ID** | `FACTORY_INTEGRATION_P_INT_03_DURABLE_OBJECT_STORE_PHASE2_DISCOVERY_REPORT.md` |
| **Path** | `docs/factory-construction/integration/FACTORY_INTEGRATION_P_INT_03_DURABLE_OBJECT_STORE_PHASE2_DISCOVERY_REPORT.md` |
| **Modo** | DISCOVERY — sin IMPL, sin commits Git, sin cambios de código, sin modificar documentación existente distinta de este Discovery |
| **Block** | P-INT-03 — ELR Persistence Bridge (Durable Persistence residual — Master Plan Fase II ítem 5) |
| **Mandate ID (vigente)** | `P-INT-03-DURABLE-OBJECT-STORE-IMPL` |
| **Implementation Path (binding)** | **OBJECT STORE** — Phase 2 **mantiene** este path; **no** cambia a Cloud / Supabase-ELR / Dedicated DB / SQLite |
| **Estado de autorización IMPL** | **NONE** — este Discovery **no** autoriza Implementation Plan execution ni código |
| **Phase 1** | COMPLETE / AUDITED / READY FOR GIT COMMIT — Status: `FACTORY_INTEGRATION_P_INT_03_DURABLE_OBJECT_STORE_PHASE1_IMPL_COMMIT_STATUS.md` |
| **Fuentes** | Mandate Durable; Discovery Durable residual; Implementation Plan Durable; Phase 1 Impl Commit Status; Independent Technical Audit Phase 1 (PASS WITH OBSERVATIONS); Offline Plan/Status; Master Plan; Continuity |

---

## 0. Posición respecto a Phase 1

```text
Phase 1 (delivered):
  ObjectStoreBackend contract
  MemoryObjectStoreBackend          ← volatile / process-local
  ObjectStoreElrStore (ElrStorePort) ← inject-only
  Phase 1 validation runner
  FileElrStore default UNCHANGED

Phase 2 (this Discovery — residual under same Mandate / same path):
  Capacidades OBJECT STORE aún no entregadas tras Phase 1
  (sin reabrir Offline; sin cambiar path)
```

**Binding path confirmation:**

```text
PATH SELECTED: OBJECT STORE
Phase 2 MUST remain on OBJECT STORE.
Cloud / Supabase-ELR / PostgREST / Dedicated DB / SQLite = OUT
```

---

## 1. Alcance exacto de Phase 2

### 1.1 Dentro del alcance (Discovery — qué debe cerrar el futuro Plan)

1. **Medio Object Store durable** detrás del contrato `ObjectStoreBackend` ya existente, de modo que la persistencia de objetos ELR **sobreviva reinicio de proceso** (Phase 1 Memory **no** lo garantiza).  
2. **Conservar** `ObjectStoreElrStore` como adapter `ElrStorePort` (inyección only) — Phase 2 **no** rediseña el puerto ni el adapter constitucional.  
3. **Conservar** `MemoryObjectStoreBackend` como backend de prueba / baseline Phase 1 (no eliminar semántica Phase 1 sin mandato).  
4. **Integridad** SHA-256 + fail-closed + `removeArtifacts` continúan aplicables al medio durable.  
5. **Default** `FileElrStore` **sin cambios**; Object Store **no** se activa por defecto.  
6. **Regresiones** CB-01 / P-INT-03 Offline (+ CB-02/CB-15 según Plan Durable DoD) en DoD del futuro Plan Phase 2.  
7. **Cobertura de pruebas** — el futuro Plan **MAY** incorporar las observaciones no bloqueantes del Independent Technical Audit Phase 1 (inexistencia; checksum mismatch; aislamiento multi-key; inventario post-`removeArtifacts`) **sin** ampliar path.  
8. **Honestidad de deuda** — Status post-IMPL Phase 2 debe declarar qué cierra del residual OBJECT STORE bajo el Mandate y qué permanece abierto (p.ej. vendor remoto, **TD-ELR-CLOUD** si aplica).  
9. **Dependencias** — si Phase 2 requiere `package.json` / SDK de object store, el Plan **MUST** exigir autorización Director **explícita** adicional (Mandate §6.17); este Discovery **no** autoriza deps.

### 1.2 Fuera del alcance de Phase 2

| Parte | Estado | Acción Discovery |
|-------|--------|------------------|
| Phase 1 Object Store infrastructure | COMPLETE (audited) | No reabrir como pending |
| P-INT-03 Offline / AtomicFileElrStore | COMPLETE / CLOSED | No reabrir |
| Path Cloud / Supabase-ELR / PostgREST | OUT del Mandate | No abrir |
| Dedicated DB | OUT del Mandate | No abrir |
| SQLite / TD-SQLITE | DEFERRED / NOT AUTHORIZED | No abrir |
| Flip default `FileElrStore` | NOT AUTHORIZED | No abrir |
| CB-00…CB-19 / FactoryRegistry / ElrStorePort / semántica ELR | Inmutable bajo Mandate | No modificar |
| Product / Deals / Marketplace / Web / CRM | PROHIBIDO | No tocar |
| II.7 / Fase II ítem 6 / push-deploy automático | NOT OPENED | No abrir |

### 1.3 Nota Discovery (sin elegir solución)

Este Discovery **no** selecciona vendor de object store, diseño de bucket, ni si el backend durable Phase 2 es:

- object-store local durable detrás del mismo contrato, o  
- object-store vendor/remoto con deps autorizadas por Director.

El **Implementation Plan** de Phase 2 deberá acotar **una** vía OBJECT STORE durable autorizada, sin reinterpretar el Mandate ni cambiar de path.

---

## 2. Capacidades faltantes tras Phase 1

| Capacidad | Phase 1 | Phase 2 residual |
|-----------|---------|------------------|
| Contrato `ObjectStoreBackend` | PRESENT | Conservar |
| Adapter `ObjectStoreElrStore` / `ElrStorePort` | PRESENT (inject-only) | Conservar; no rediseñar |
| Persistencia de objetos **durable** (sobrevive proceso) | **ABSENT** (Memory only) | **REQUIRED** |
| Vendor / SDK object store remoto | ABSENT | Opcional solo con autorización deps Director; no es Cloud/Supabase-ELR path |
| Default Registry = Object Store | ABSENT (correcto) | Debe permanecer ABSENT |
| Cobertura audit OBS Phase 1 | Parcial | MAY cerrar en Plan Phase 2 |
| Cierre honesto residual Mandate OBJECT STORE | Parcial (infra only) | Status Phase 2 debe declarar |

---

## 3. Entradas y salidas

### 3.1 Entradas (inputs)

| Input | Rol |
|-------|-----|
| Mandate `P-INT-03-DURABLE-OBJECT-STORE-IMPL` | Autoridad de path OBJECT STORE |
| Phase 1 Impl Commit Status | Baseline entregado / no reabrir |
| Independent Technical Audit Phase 1 | PASS WITH OBSERVATIONS (no bloqueantes) |
| `ObjectStoreBackend` / `ObjectStoreElrStore` / `MemoryObjectStoreBackend` | Contratos y artefactos existentes |
| Implementation Plan Durable (parent) | Principios port / integridad / exclusiones |
| Offline Status / runners | Regresión obligatoria |
| Continuity §20 / §21 | Stop Rules Web / Supabase |

### 3.2 Salidas (outputs esperados del bloque Phase 2 — documentales ahora)

| Output | Descripción |
|--------|-------------|
| Implementation Plan Phase 2 | Documentary only tras aceptación de este Discovery |
| Backend OBJECT STORE durable (post-Mandate/Plan gates) | Implementa `ObjectStoreBackend`; usable por `ObjectStoreElrStore` |
| Runner / validaciones Phase 2 | Incluye regresiones Phase 1 + Offline + CB-01 |
| Independent Technical Audit Phase 2 | READ ONLY post-IMPL |
| Implementation Commit Status Phase 2 | Honest residual / debt |
| **No** output: cambio de path; flip default; CB edits; Supabase; SQLite; Product/Deals |

---

## 4. Riesgos

| ID | Riesgo | Severidad |
|----|--------|-----------|
| R1 | Confundir Phase 2 OBJECT STORE durable con path Cloud / Supabase-ELR | HIGH |
| R2 | Introducir SDK / `package.json` sin autorización Director explícita | HIGH |
| R3 | Reabrir o duplicar `AtomicFileElrStore` / Offline bajo color de “object store” | HIGH |
| R4 | Flip silencioso de default `FileElrStore` | HIGH |
| R5 | Modificar CB-01 / FactoryRegistry / ElrStorePort / semántica ELR | HIGH |
| R6 | Mezclar ELR con Product / Deals / Marketplace | HIGH |
| R7 | Declarar Master Plan / TD-ELR-CLOUD cerrados solo con Memory o sin honesty Status | MEDIUM |
| R8 | Vendor lock-in sin backend contract isolation | MEDIUM |
| R9 | Cobertura Phase 1 OBS no cerrada y tratada como bloqueo falso / o ignorada sin registro | LOW |
| R10 | Ampliar alcance a Dedicated DB / SQLite | HIGH |

---

## 5. Restricciones

1. Path = **OBJECT STORE** only (Mandate binding).  
2. Adapter vía **`ElrStorePort`** injection only; **no** default.  
3. **`FileElrStore` default sin cambios.**  
4. **No** modificar CB-00…CB-19, `FactoryRegistry`, `ElrStorePort`, semántica ELR.  
5. **No** Supabase / SQLite / Dedicated DB / Product / Deals / Marketplace / Web / CRM.  
6. **No** reabrir P-INT-03 Offline.  
7. Phase 1 artefactos = baseline; no borrar capacidad Memory sin mandato.  
8. Integridad fail-closed / SHA-256 pair principles se mantienen.  
9. Protocolo Continuity §27: Discovery → Plan → Documentary Audit → … → IMPL → Technical Audit → Status.  
10. Este Discovery **no** autoriza IMPL ni deps.

---

## 6. Stop Rules

| ID | Condición de parada |
|----|---------------------|
| S1 | Intento de cambiar path fuera de OBJECT STORE |
| S2 | Intento de tocar Supabase (Continuity §21 — STOP + report) |
| S3 | Intento de tocar Web/FCC (Continuity §20 — STOP + report) |
| S4 | Introducción de SQLite / Dedicated DB / SQL engine |
| S5 | Flip de default `FileElrStore` |
| S6 | Modificación de CB / FactoryRegistry / ElrStorePort / semántica ELR |
| S7 | Mezcla ELR ↔ Product / Deals / Marketplace |
| S8 | Adición de dependencias / SDK sin orden Director explícita |
| S9 | Reapertura Offline Atomic como pending IMPL |
| S10 | Contradicción irresoluble con Mandate / Phase 1 Status / Master Plan |

---

## 7. Criterios de finalización (Phase 2 — para futuro Plan / DoD)

Phase 2 podrá declararse **COMPLETE** solo si:

1. Existe un backend **OBJECT STORE durable** que implementa `ObjectStoreBackend` y es consumido por `ObjectStoreElrStore` por inyección.  
2. Persistencia de expedientes **sobrevive reinicio de proceso** (demostrado por runner).  
3. `FileElrStore` sigue siendo default; Object Store no es default.  
4. CB-00…19 / FactoryRegistry / ElrStorePort / semántica ELR **no** modificados.  
5. Sin Supabase / SQLite / Dedicated DB / Product / Deals / Marketplace / Web / CRM.  
6. Validaciones Phase 2 + regresiones Phase 1 Offline + CB-01 **PASS** (o PASS WITH OBSERVATIONS aceptadas).  
7. Independent Technical Audit Phase 2 **PASS** o **PASS WITH OBSERVATIONS**.  
8. Status declara honestamente residual Mandate / deuda (incl. qué no se cerró).  
9. Path permanece **OBJECT STORE**.

---

## 8. Compatibilidad con el Mandate vigente

| Requisito Mandate | Phase 2 Discovery |
|-------------------|-------------------|
| Path OBJECT STORE | **CONFIRMADO** — Phase 2 mantiene OBJECT STORE |
| Adapter `ElrStorePort` inject-only | **CONFIRMADO** |
| Default `FileElrStore` unchanged | **CONFIRMADO** |
| No CB / Registry / ELR semantic edits | **CONFIRMADO** |
| No Supabase / SQLite / Dedicated DB / Product / Deals / Marketplace | **CONFIRMADO** |
| Integrity / fail-closed | **CONFIRMADO** |
| Deps solo con autorización explícita | **CONFIRMADO** (Discovery no autoriza) |
| Cierre residual vía OBJECT STORE | Phase 2 avanza el residual; Status debe ser honesto |

**Mandate ID permanece:** `P-INT-03-DURABLE-OBJECT-STORE-IMPL`  
Phase 2 **no** emite Mandate nuevo; opera bajo el Mandate aprobado de path OBJECT STORE.  
Si el Director exige Mandate ID de sub-fase, queda **reservado** (p.ej. sufijo Phase-2) — **no** emitido por este Discovery.

---

## 9. Confirmación de path

```text
Phase 2 Implementation Path = OBJECT STORE
PATH SELECTED: OBJECT STORE (unchanged from Mandate)
NO PATH CHANGE
```

---

## 10. Entregables del futuro Implementation Plan Phase 2

*(Contenido documental obligatorio — **sin** diseñar la solución aquí.)*

1. Identification — Phase 2 bajo Mandate OBJECT STORE; relación Phase 1 COMPLETE.  
2. Absolute Non-Authorization Banner — exclusiones Mandate.  
3. Scope IN / OUT — durable Object Store backend; OUT Cloud/Supabase/SQLite/DB/Product.  
4. Backend contract continuity — `ObjectStoreBackend` + `ObjectStoreElrStore`.  
5. Durability expectations — process restart; fail-closed; SHA-256.  
6. Default-store policy — FileElrStore unchanged.  
7. Dependency policy — none unless Director-authorized.  
8. Validations / DoD / Stop Rules / Risks.  
9. Relation to Phase 1 audit OBS (optional closure).  
10. Cláusula — Plan no autoriza IMPL hasta gates de protocolo.

---

## 11. Readiness para Implementation Plan

| Criterio | Resultado |
|----------|-----------|
| Phase 1 baseline identificado | **Sí** |
| Path OBJECT STORE confirmado | **Sí** |
| Capacidades faltantes listadas | **Sí** |
| Entradas / salidas definidas | **Sí** |
| Riesgos / restricciones / Stop Rules / DoD | **Sí** |
| Compatibilidad Mandate | **Sí** |
| Solución técnica / vendor elegido | **No** (prohibido en Discovery) |
| IMPL autorizada | **No** |
| Siguiente acto documental oficial | **Implementation Plan Phase 2** (tras aceptación Director de este Discovery) |

```text
DISCOVERY STATUS: COMPLETE (READ ONLY)
READY FOR: IMPLEMENTATION PLAN (documentary only)
NOT READY FOR: IMPL / Mandate re-issue / code
NO PATH CHANGE — OBJECT STORE
NO POSTERIOR BLOCK AUTHORIZED BY THIS DISCOVERY
```

---

**END OF OFFICIAL DISCOVERY — P-INT-03 DURABLE OBJECT STORE PHASE 2**

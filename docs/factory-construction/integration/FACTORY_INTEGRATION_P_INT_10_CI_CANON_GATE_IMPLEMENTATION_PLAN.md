# FACTORY INTEGRATION P-INT-10
## CI CANON GATE
## IMPLEMENTATION PLAN

**Document ID:** `FACTORY_INTEGRATION_P_INT_10_CI_CANON_GATE_IMPLEMENTATION_PLAN.md`  
**Phase:** Factory Integration — Master Plan Fase I (observability / release governance)  
**Block:** P-INT-10 — CI Canon Gate  
**Document Type:** Technical Implementation Plan  
**Status:** **PLAN COMMITTED — DOCUMENTARY AUDIT PASSED** — **NO IMPLEMENTATION AUTHORIZED BY THIS DOCUMENT**

**Repository:** RealEstateSniper  
**Branch baseline:** `integration/factory-complete-20260725`  
**Baseline HEAD (at Plan authoring):** `726f955` — Continuity Dossier reconciled post–Admin Live Wiring  

**Normative sources:**

1. `docs/factory-construction/FACTORY_2_0_COMPLETE_CONTINUITY_DOSSIER.md` (§9 Fase I; §11 P-INT matrix; §27 protocol; §31 next block; §34 Director decisions)  
2. `docs/factory-construction/FACTORY_INTEGRATION_MASTER_PLAN.md` (§3.2 P-INT-10; §5 Fase I ítem 2; §7.1 safe adapters; §9 risks)  
3. `docs/factory-construction/phases/construction-phase-status.json` (CB-00→CB-19 APPROVED ledger)  
4. `docs/factory-construction/integration/FACTORY_INTEGRATION_ADMIN_LIVE_WIRING_IMPL_STATUS.md` (Fase I ítem 1 CLOSED; protected surfaces)  
5. `docs/factory-construction/integration/FACTORY_INTEGRATION_P_INT_01_IMPLEMENTATION_PLAN.md` (Canon Gate **HTTP API** = FUTURE / NOT AUTHORIZED — frontera explícita)  
6. Discovery — P-INT-10 CI Canon Gate (session, READ_ONLY, approved) — **COMPLETE**

**Director authorization (this Plan document / materialization):** **approved**.  
**Director authorization (P-INT-10-CI-CANON-GATE-IMPL code):** **NOT AUTHORIZED** by this document.  
**Director authorization (GitHub Actions / remote CI / push / deploy):** **NOT AUTHORIZED** by this document (Continuity Dossier §28).

**Technological / architectural decision (binding):**

1. **P-INT-10 is a process adapter** — release/CI gate only; **not** a new Factory motor, CB phase, HTTP API, or constitutional rule.  
2. **All CB validator invocations MUST be dry-run** — **never** `--mark-complete` or any ledger-mutating flag.  
3. **Canon drift = deployment block** — fail-closed when `detectCanonDrift` semantics report `blockDeployment`.  
4. **Factory core is read-only** — `src/factory/**` MUST NOT be modified for this block.  
5. **Canon Gate HTTP API** (deploy allow/deny over HTTP) remains **FUTURE / NOT AUTHORIZED** per P-INT-01 Plan — distinct from this block.  
6. **Remote CI wiring** (e.g. GitHub Actions) is **out of scope** of this Plan’s first materialization unless a **separate** explicit Director authorization is issued under §28.

---

## 0. Absolute Non-Authorization Banner

This Plan **does not** authorize implementation. IMPL requires a **separate** Director mandate (e.g. `P-INT-10-CI-CANON-GATE-IMPL`) after Gates G1–G2.

| Surface | Status under this Plan |
|---------|------------------------|
| P-INT-10 CI Canon Gate IMPL code | **NOT AUTHORIZED** until Director IMPL mandate |
| Modification of `src/factory/**` / CB-00…CB-19 semantics | **PROHIBITED** |
| Modification of `services/factory-service-edge/**` | **PROHIBITED** |
| Web / Admin / `FactoryControlCenter` / `vite.config.js` | **PROHIBITED** |
| Supabase / RLS / migrations / `deals` tables | **PROHIBITED** |
| Product / Marketplace / CRM / Owner Portal / Projection / Investor API | **PROHIBITED** |
| II.7 Delivery | **NOT OPENED** |
| P-INT-01 Slice B / Job Runner / orchestration commands | **NOT AUTHORIZED** |
| Canon Gate **HTTP API** / new Service Edge endpoints | **FUTURE / NOT AUTHORIZED** |
| Auth productiva (Supabase Auth Admin, cloud IdP, investor JWT) | **NOT AUTHORIZED** |
| `dealPipeline` reconciliation (P-INT-09) | **NOT OPENED** — Fase I ítem 3; posterior a P-INT-10 |
| GitHub Actions / remote CI / push / merge / deploy | **NOT AUTHORIZED** by this Plan |
| New constitutional rules / new CB phases / new motors | **PROHIBITED** |
| `--mark-complete` on any `runCb*` in gate execution | **ABSOLUTELY PROHIBITED** |

**Hard separations:**

```text
P-INT-10 CI Canon Gate (process)     ≠  Canon Gate HTTP API (P-INT-01 FUTURE)
P-INT-10 CI Canon Gate               ≠  P-INT-01 Slice A Service Edge (FULLY CLOSED)
P-INT-10 CI Canon Gate               ≠  Admin Live Wiring / FCC (FULLY CLOSED)
P-INT-10 dry-run validators          ≠  construction-phase-status ledger mutation
CI release gate                      ≠  Factory semantic change
Canon drift block                    ≠  dealPipeline / Product scoring
Local validation runner              ≠  Web bundle / browser runtime
```

---

## 1. Objetivo

Integrar un **Canon Gate de proceso** para **release/CI** que:

1. Ejecute los **validadores constitucionales CB existentes** (`runCb00`…`runCb19`) en modo **exclusivamente dry-run**.  
2. Aplique una **verificación explícita de canon drift** alineada con CB-18 `detectCanonDrift` / CB-19 E2E constitutional checks.  
3. **Bloquee** cualquier release cuando un validador falle o cuando canon drift imponga `blockDeployment` (**fail-closed**).  
4. Lo haga **sin modificar** el núcleo Factory, Service Edge, Web, Supabase, Product ni Marketplace.

**Criterio Master Plan Fase I (ítem 2):** *“Canon drift gate en proceso de release (CB-18), sin cambiar Factory.”*

**Criterio Master Plan §3.2 P-INT-10:** *“Correr validadores CB + canon drift en CI”* — depende de **CB-18/19** ya construidos.

**No es objetivo:** crear motores, CB, protocolos, APIs, endpoints ni reglas constitucionales nuevas.

---

## 2. Alcance

### 2.1 Incluido (futuro IMPL, solo tras mandato explícito)

| Ítem | Descripción |
|------|-------------|
| **Adaptador de proceso Canon Gate** | Orquestador de release/CI local que invoca validadores existentes y consolida veredicto PASS/FAIL |
| **Suite dry-run CB-00→CB-19** | Invocación de los 20 runners CLI ya aprobados en construcción, **sin** flags de persistencia |
| **Gate de canon drift** | Evaluación fail-closed usando semántica CB-18 `detectCanonDrift` sobre expedientes/fixtures piloto canónicos; coherente con CB-19 E2E |
| **Runner de validación P-INT-10** | Suite dedicada de integración (patrón `runPInt01SliceAValidation.js`, `runAdminLiveWiringValidation.js`) que verifica el adaptador, prohibiciones y regresiones |
| **Documentación de release gate** | Criterios PASS/FAIL, superficies protegidas, deuda técnica preservada |
| **Status del bloque** | Tras IMPL + auditoría, bajo protocolo §27 |

### 2.2 Catálogo autorizado de validadores (dry-run only)

Los siguientes runners **ya existen** y constituyen el **subset obligatorio** de Fase I para P-INT-10. El adaptador **solo los invoca**; no los redefine.

| Fase | Runner (existente) | Rol en gate |
|------|-------------------|-------------|
| CB-00 | `src/runCb00CanonValidation.js` | Anclaje constitucional |
| CB-01 | `src/runCb01RegistryValidation.js` | Registry / ELR |
| CB-02 | `src/runCb02DsoValidation.js` | DSO governance |
| CB-03 | `src/runCb03ComplianceValidation.js` | Compliance gate |
| CB-04 | `src/runCb04MotorRuntimeValidation.js` | Motor runtime |
| CB-05 | `src/runCb05FoundationValidation.js` | Foundation |
| CB-06 | `src/runCb06EvidenceValidation.js` | Evidence |
| CB-07 | `src/runCb07LegitimacyValidation.js` | Legitimacy |
| CB-08 | `src/runCb08DistressValidation.js` | Distress |
| CB-09 | `src/runCb09EconomyValidation.js` | Economy |
| CB-10 | `src/runCb10EnvironmentValidation.js` | Environment |
| CB-11 | `src/runCb11LoopEngineValidation.js` | Loop engine |
| CB-12 | `src/runCb12SwarmValidation.js` | Swarm |
| CB-13 | `src/runCb13IntelligenceValidation.js` | Intelligence |
| CB-14 | `src/runCb14AiAssistValidation.js` | AI assist |
| CB-15 | `src/runCb15OrchestrationValidation.js` | Orchestration |
| CB-16 | `src/factory/cb16/runCb16DecisionValidation.js` | Decision handoff |
| CB-17 | `src/factory/cb17/runCb17WatchValidation.js` | Watch / archive |
| CB-18 | `src/factory/cb18/runCb18GovernanceValidation.js` | Governance + drift panels |
| CB-19 | `src/factory/cb19/runCb19CompletionValidation.js` | Factory completion + canon compliance |

**Regla binding:** ningún runner del gate puede recibir `--mark-complete`, `--approved-by`, ni cualquier argumento que escriba en `construction-phase-status.json` o muten ledger de construcción.

### 2.3 Canon drift gate (explícito)

Además del sweep CB-00→CB-19, el adaptador MUST aplicar un **canon drift gate** explícito:

| Regla | Binding |
|-------|---------|
| Fuente semántica | CB-18 `detectCanonDrift` (pure); excepciones documentadas `DOCUMENTED_ACTOR_EXCEPTIONS` |
| Criterio de bloqueo | `blockDeployment === true` → gate **FAIL** |
| Expedientes | Fixtures piloto canónicos ya usados por validadores CB-18/CB-19 — **no inventar nuevos expedientes** salvo mandato |
| Envenenamiento negativo | Debe existir verificación que un expediente con actor fuera de catálogo produce FAIL (cubierto por regresiones CB-18 existentes; el runner P-INT-10 MUST confirmar que el adaptador no omite este resultado) |
| Relación con HTTP | El endpoint Slice A `GET /v1/factory/governance/drift` es **observabilidad** — **no sustituye** este gate de proceso |

### 2.4 Relación con Master Plan Fase II ítem 6

Master Plan Fase II menciona un *“subset de validadores CB-15/16/18/19 en pipeline”*. **P-INT-10 (Fase I ítem 2) es anterior** y **más amplio** (CB-00→CB-19 + drift explícito). Fase II ítem 6 **no autoriza** reducir el subset de P-INT-10 ni reordenar el roadmap.

---

## 3. Exclusiones (absolutas)

| Exclusión | Motivo |
|-----------|--------|
| Nuevos motores / CB / protocolos / APIs / endpoints | Mandato Director — solo adaptador de proceso |
| Nuevas reglas constitucionales | CB-00 es la fuente; gate **consume**, no redefine |
| Canon Gate HTTP API | P-INT-01 Plan: **FUTURE / NOT AUTHORIZED** |
| Modificación `src/factory/**` | Master Plan §5 Fase I (2): *“sin cambiar Factory”* |
| Modificación `services/factory-service-edge/**` | Slice A FULLY CLOSED; fuera de alcance |
| Web / Admin / FCC / `vite.config.js` | Dossier §20 stop rule; Fase I ítem 1 ya cerrado |
| Supabase / RLS / migrations / `deals` | Dossier §21 |
| Product / Marketplace / Investor API / II.7 | No autorizado |
| P-INT-01 Slice B / Job Runner | Gate C + mandato separado |
| P-INT-09 `dealPipeline` reconciliation | Fase I ítem 3 — **posterior** |
| `--mark-complete` / mutación de `construction-phase-status.json` | Riesgo constitucional RT-01 |
| GitHub Actions / workflows remotos / deploy hooks cloud | §28 — mandato expreso separado |
| Retiro/modificación `public/factory-observability-snapshot.json` | No autorizado |
| Auth productiva | TD-AUTH-PROD permanece OPEN |
| Network I/O / live DSO / cloud SDKs | Fuera de alcance P-INT-10 |

---

## 4. Dependencias

### 4.1 Satisfechas

| Dependencia | Estado |
|-------------|--------|
| Construcción CB-00→CB-19 | **APPROVED** — `construction-phase-status.json` |
| CB-18 Governance + `detectCanonDrift` | **COMPLETE** — `canonDriftDetector.js`; criterio *“Canon drift = bloqueo de despliegue”* |
| CB-19 E2E + canon compliance report | **COMPLETE** — `e2eFactoryValidation.js` usa `detectCanonDrift` |
| Runners CLI CB-00→CB-19 | 20 scripts existentes |
| P-INT-01 Slice A | **FULLY CLOSED** — `4f9221f` / Status `2622c29` |
| Admin Live Wiring | **FULLY CLOSED** — `b97b2b0` / Status `ab5a4ec` |
| Continuity Dossier | **RECONCILED / DOCUMENTARY RE-AUDIT PASS** — `726f955` |
| Discovery P-INT-10 | **COMPLETE** |
| Master Plan §7.1 | *“Añadir CI que ejecuta `runCb*` — no altera código CB”* — patrón seguro |

### 4.2 Pendientes (bloquean IMPL, no Discovery/Plan)

| Dependencia | Impacto |
|-------------|---------|
| **Documentary Audit** de este Plan | Gate G1 — protocolo §27 |
| **Documentary Commit** del Plan | Gate G2 |
| **Mandato IMPL** explícito del Director | Gate G3 |
| **Definición operativa del “release”** local | Plan asume gate ejecutable en entorno local determinista; CI remoto requiere mandato §28 |
| **TD-PHASE-STATUS-META** | Metadata JSON puede estar stale vs HEAD — verificar Git en auditoría |
| Independent Technical Audit + Status | Gates G4–G5 |

---

## 5. Componentes afectados

*(Solo en fase IMPL futura — este Plan no autoriza cambios.)*

| Componente | Naturaleza del cambio |
|------------|----------------------|
| **Adaptador Canon Gate** | **Nuevo** — orquestador de proceso bajo `src/` (nombre final en IMPL; patrón `runPInt10CiCanonGateValidation.js` o equivalente) |
| **Entrada de release local** | Documentación / script de invocación del adaptador (sin workflows GitHub en este Plan) |
| **Docs integración** | Este Plan; futuro `FACTORY_INTEGRATION_P_INT_10_CI_CANON_GATE_IMPL_STATUS.md` |
| **`package.json` scripts** | Opcional — entrada local espejo del gate (solo si IMPL mandate lo incluye) |

### 5.1 Entradas del gate

| Entrada | Descripción |
|---------|-------------|
| Repositorio en commit evaluado | Working tree limpio o commit SHA fijado |
| Runners CB-00→CB-19 | Invocación dry-run |
| Fixtures / expedientes piloto | Los ya usados por CB-18/CB-19 validators |
| `construction-phase-status.json` | **Solo lectura** de referencia — **nunca** re-escritura por el gate |
| Ledger CB completion reports | Evidencia de construcción APPROVED |

### 5.2 Salidas del gate

| Salida | Descripción |
|--------|-------------|
| **PASS** | Todos los validadores dry-run PASS; canon drift sin `blockDeployment` |
| **FAIL** | Cualquier validador FAIL **o** canon drift bloqueante |
| Reporte estructurado | Identificación del runner fallido y/o actores drifted (sin secretos, sin rutas absolutas de servidor, sin stack traces en canal operativo) |
| Evidencia para Status | Resultado consolidado para auditoría técnica posterior |

---

## 6. Componentes protegidos

| Superficie | Protección |
|------------|------------|
| `src/factory/**` | **Cero diff semántico** — adaptador solo invoca runners existentes |
| `services/factory-service-edge/**` | **Intocable** |
| `src/components/admin/factory/**` | **Intocable** — FCC cerrado (§20) |
| `vite.config.js` | **Intocable** |
| `src/components/dashboards/AdminDashboard.jsx` | **Intocable** |
| Supabase / Edge Functions / `deals` | **Intocable** |
| Product / Marketplace / Stripe / Investor surfaces | **Intocable** |
| `public/factory-observability-snapshot.json` | **No retirar / no modificar** |
| P-INT-01 Slice A contract / AuthZ catalog | **Sin cambios** |
| II.2–II.6 integration modules | **Sin cambios** salvo regresión inadvertida — MUST permanecer verde si en scope de smoke |
| `construction-phase-status.json` | **Protegido contra escritura** por el gate |
| Catálogos constitucionales (`docs/auditoria-maestra/*`) | **Sin modificación** |

---

## 7. Flujo de ejecución

### 7.1 Flujo lógico del Canon Gate

```text
[Inicio release/CI local]
        │
        ▼
[Pre-check: prohibición --mark-complete / flags ledger]
        │ FAIL → STOP (gate configuration error)
        ▼
[Fase A: sweep constitucional CB-00 → CB-19]
        │ cada runner: dry-run ONLY
        │ cualquier FAIL → STOP (fail-closed)
        ▼
[Fase B: canon drift gate explícito]
        │ detectCanonDrift semantics / CB-18+CB-19 evidence
        │ blockDeployment → STOP (fail-closed)
        ▼
[Fase C: consolidación]
        │ reporte PASS/FAIL estructurado
        ▼
[PASS → release puede continuar]
[FAIL → release BLOQUEADO]
```

### 7.2 Reglas de ejecución binding

| Regla | Binding |
|-------|---------|
| Modo | **Exclusivamente dry-run** |
| `--mark-complete` | **ABSOLUTAMENTE PROHIBIDO** en cualquier invocación |
| Orden CB | Secuencial CB-00→CB-19 (orden constitucional de construcción); paralelización solo si IMPL demuestra equivalencia sin race en fixtures |
| Fail-closed | Primer FAIL detiene el gate; no “continuar con warnings” para release |
| Side-effects | Cualquier side-effect detectado en runner invocado → FAIL del adaptador + hallazgo de auditoría |
| Network | Sin red; sin live DSO; sin Supabase |
| Factory imports | El adaptador MAY importar **solo** para orquestar invocación de procesos existentes — MUST NOT alterar módulos CB |

### 7.3 Flujo de protocolo del bloque (§27)

```text
Discovery (COMPLETE)
    → Implementation Plan (this document)
    → Documentary Audit
    → Documentary Commit
    → Director IMPL mandate
    → Implementation
    → Independent Technical Audit
    → Implementation Commit
    → Status
    → Status Commit
    → (opcional, mandato separado) Continuity Dossier reconcile
```

---

## 8. Secuencia de implementación

| Paso | Actividad | Autorización |
|------|-----------|--------------|
| S0 | Discovery P-INT-10 | **COMPLETE** |
| S1 | Redacción Implementation Plan (este documento) | **COMPLETE** |
| S2 | Independent Documentary Audit del Plan | **REQUIRED** |
| S3 | Documentary Commit del Plan | **REQUIRED** |
| S4 | Mandato Director `P-INT-10-CI-CANON-GATE-IMPL` | **REQUIRED** |
| S5 | Diseño del adaptador: inventario runners, prohibición flags, fail-closed | IMPL |
| S6 | Implementación adaptador + runner P-INT-10 validation | IMPL |
| S7 | Smoke local: PASS en estado canónico; FAIL sintético en drift | IMPL |
| S8 | Verificación diff acotado (sin Factory/Edge/Web/Supabase) | IMPL |
| S9 | Independent Technical Audit READ_ONLY | **REQUIRED** |
| S10 | Implementation Commit acotado | IMPL |
| S11 | Status document + Status Commit | IMPL |
| S12 | Continuity Dossier reconcile | **Mandato documental separado** |

**Secuencia técnica interna (S5–S7):**

1. Inventario y contrato de invocación dry-run de los 20 runners.  
2. Pre-check que rechaza `--mark-complete` y flags de ledger.  
3. Orquestación secuencial CB-00→CB-19 con fail-closed.  
4. Canon drift gate explícito alineado con CB-18/CB-19.  
5. Runner de validación P-INT-10 (checks estáticos + regresión).  
6. Documentación operativa del gate local.

**Explícitamente fuera de S5–S7:** workflows GitHub, Actions, deploy cloud, cambios Factory/Edge/Web.

---

## 9. Estrategia de validación

### 9.1 Validación del adaptador (futuro runner P-INT-10)

| Área | Contenido |
|------|-----------|
| **Configuración** | Rechazo de `--mark-complete` y argumentos de persistencia |
| **Sweep CB** | Confirmación de invocación de los 20 runners en dry-run |
| **Fail-closed** | Simulación de FAIL en validador → gate FAIL global |
| **Canon drift** | Confirmación de que `blockDeployment` produce FAIL |
| **Protección Factory** | Diff estático: sin cambios bajo `src/factory/**` |
| **Protección Edge** | Sin cambios bajo `services/factory-service-edge/**` |
| **Protección Web** | Sin cambios bajo `src/components/admin/**`, `vite.config.js` |
| **Protección Supabase** | Sin cambios en funciones/migrations/supabase |
| **Protección Product/Marketplace** | Sin cambios en superficies producto |
| **Regresión** | Runners CB-18/CB-19 y Slice A validation permanecen PASS si ejecutados en smoke de no-regresión |

### 9.2 Validación documental (este Plan)

| Check | Criterio |
|-------|----------|
| Frontera HTTP | Plan no autoriza Canon Gate API |
| Frontera Factory | Plan prohíbe modificación CB |
| Frontera roadmap | Fase I ítem 2; P-INT-09 posterior |
| Dry-run only | Explícito y repetido |
| `--mark-complete` | Prohibición absoluta documentada |

### 9.3 Validación post-IMPL (Independent Technical Audit)

1. Auditoría READ_ONLY de scope creep.  
2. Confirmación 0 CRITICAL / 0 MAJOR sin cierre en adaptador y runner.  
3. Evidencia PASS/FAIL reproducible en entorno local.  
4. Confirmación de superficies protegidas intactas.  
5. Status oficial del bloque.

---

## 10. Riesgos

### 10.1 Riesgos técnicos

| ID | Riesgo | Severidad | Mitigación en Plan |
|----|--------|-----------|-------------------|
| RT-01 | `--mark-complete` en CI corrompe `construction-phase-status.json` | **CRITICAL** | Prohibición absoluta; pre-check en adaptador; check estático en runner P-INT-10 |
| RT-02 | Tiempo de ejecución de 20 validadores | MEDIUM | Secuencial aceptado en v1; optimización solo con evidencia de no-regresión |
| RT-03 | Falsos positivos drift (`DOCUMENTED_ACTOR_EXCEPTIONS`) | MEDIUM | Usar semántica CB-18 existente; no redefinir excepciones |
| RT-04 | Fixtures piloto desactualizados | MEDIUM | Regresión CB-00 + CB-18/CB-19 como oracle |
| RT-05 | Side-effects ocultos en runners | LOW | Auditoría; fail si mutación detectada |
| RT-06 | Confusión gate local vs CI remoto | MEDIUM | CI remoto requiere mandato §28 separado |

### 10.2 Riesgos constitucionales

| ID | Riesgo | Severidad | Mitigación |
|----|--------|-----------|------------|
| RC-01 | “Arreglar” CB para que CI pase | **CRITICAL** | Prohibición explícita modificación `src/factory/**` |
| RC-02 | Gate como nueva autoridad constitucional | HIGH | Gate **consume** CB-18/19; no crea reglas |
| RC-03 | Mezclar `dealPipeline` con drift/maturity | HIGH | P-INT-09 excluido; no mezclar scores |
| RC-04 | Confundir P-INT-10 con Canon Gate HTTP | HIGH | Frontera explícita §0 y §3 |
| RC-05 | GitHub Actions sin mandato §28 | HIGH | Excluido de este Plan |

### 10.3 Riesgos documentales

| ID | Riesgo | Severidad | Mitigación |
|----|--------|-----------|------------|
| RD-01 | Solapamiento con Fase II ítem 6 | LOW | §2.4 clarifica precedencia Fase I |
| RD-02 | `construction-phase-status.json` stale (TD-PHASE-STATUS-META) | LOW | Verificar Git en auditoría |
| RD-03 | Discovery/Plan tratados como mandato IMPL | MEDIUM | Banners §0; Gates G3+ |
| RD-04 | Scope creep hacia Web/Edge | MEDIUM | Lista protegidos §6; diff audit |

---

## 11. Criterios de aceptación

| # | Criterio | Evidencia |
|---|----------|-----------|
| AC-01 | Adaptador ejecuta CB-00→CB-19 en **dry-run only** | Runner P-INT-10 + logs |
| AC-02 | **`--mark-complete` imposible** en ejecución del gate | Pre-check + auditoría estática |
| AC-03 | Canon drift con `blockDeployment` → gate **FAIL** | Regresión negativa CB-18/CB-19 |
| AC-04 | Estado canónico → gate **PASS** | Smoke local |
| AC-05 | **`src/factory/**` sin cambios** en commit IMPL | Git diff |
| AC-06 | **Service Edge sin cambios** | Git diff |
| AC-07 | **Web/Admin sin cambios** | Git diff |
| AC-08 | **Supabase sin cambios** | Git diff |
| AC-09 | **Product/Marketplace sin cambios** | Git diff |
| AC-10 | Reporte FAIL identifica runner y/o actor drifted | Salida estructurada |
| AC-11 | No se crean motores, CB, APIs, endpoints ni reglas nuevas | Auditoría de alcance |
| AC-12 | Canon Gate HTTP API **no** implementada | Auditoría de alcance |

---

## 12. Criterios de cierre

### 12.1 Gates de aprobación

| Gate | Requisito |
|------|-----------|
| G0 | Discovery P-INT-10 aprobado — **COMPLETE** |
| G1 | **Independent Documentary Audit PASS** de este Implementation Plan — **DONE** |
| G2 | **Documentary Commit** del Plan — **this commit** |
| G3 | **Director IMPL mandate** explícito (`P-INT-10-CI-CANON-GATE-IMPL`) |
| G4 | **Independent Technical Audit PASS** post-IMPL |
| G5 | **Implementation Commit** + **Status** + **Status Commit** |

**Este documento no autoriza G3–G5.**

### 12.2 Definition of Done del bloque

| Dimensión | Criterio |
|-----------|----------|
| Funcional | Release/CI local **fail-closed** ante validador roto o canon drift |
| Constitucional | Factory core intacto; gate consume CB-18/19 |
| Integración | No regresión documentada en Slice A / Admin Live Wiring surfaces |
| Documental | Status COMMITTED; Plan audit PASS |
| Roadmap | Fase I ítem 2 entregado; Fase I ítem 3 (P-INT-09) **no** incluido |
| Operaciones | TD-AUTH-PROD, TD-DUAL-SNAPSHOT, TD-AHEAD-* preservados como OPEN |

### 12.3 Qué NO cierra este bloque

| Ítem | Estado tras P-INT-10 |
|------|---------------------|
| P-INT-09 dealPipeline reconciliation | **OPEN** — siguiente ítem Fase I |
| Canon Gate HTTP API | **FUTURE / NOT AUTHORIZED** |
| CI remoto / GitHub Actions | **NOT AUTHORIZED** salvo mandato §28 |
| Auth productiva | **OPEN** (TD-AUTH-PROD) |
| Slice B / Job Runner | **NOT AUTHORIZED** |
| Continuity Dossier reconcile | **Mandato separado** |

---

## 13. Valor para Arizona

| Dimensión | Aporte |
|-----------|--------|
| **Integridad constitucional** | Impide avanzar un release con Factory no canónico en la rama Arizona (`integration/factory-complete-20260725`) |
| **Operaciones** | Automatiza la barrera que hoy depende de ejecución manual de 20 validadores CB |
| **Complemento observabilidad** | Refuerza la visibilidad live de drift en FCC (Admin Live Wiring) con **bloqueo de proceso** en release |
| **Pre-lanzamiento Arizona** | Refuerza fail-closed y auditabilidad exigidos antes del lanzamiento (ciberseguridad/legal §25 Dossier) |
| **Frontera soberana** | No mezcla Product/Marketplace/`dealPipeline`; protege ELR ≠ `deals` |
| **Continuidad de equipo** | Gate reproducible sin depender de una sola persona ejecutando runners manualmente |
| **Riesgo mitigado** | Doble verdad silenciosa y drift no detectado en release — alineado con Master Plan §9 |

---

## 14. Archivos previstos (IMPL futuro — NOT AUTHORIZED)

| Archivo | Acción | Scope |
|---------|--------|-------|
| Adaptador Canon Gate bajo `src/` (nombre TBD en IMPL) | Crear | **IN SCOPE** |
| `src/runPInt10CiCanonGateValidation.js` (o nombre equivalente) | Crear | **IN SCOPE** |
| `docs/factory-construction/integration/FACTORY_INTEGRATION_P_INT_10_CI_CANON_GATE_IMPL_STATUS.md` | Crear (post-IMPL) | **IN SCOPE** (Status) |
| `package.json` (script entry opcional) | Modificar condicional | **IN SCOPE** (opcional) |

**No:** `src/factory/**`, `services/factory-service-edge/**`, Web/Admin, Supabase, Product, Marketplace, workflows GitHub, Canon Gate HTTP API.

---

## 15. Gate de aprobación — resumen

| Gate | Estado |
|------|--------|
| G0 Discovery | **COMPLETE** |
| G1 Documentary Audit | **PASS** — READY FOR DOCUMENTARY COMMIT |
| G2 Documentary Commit | **THIS COMMIT** |
| G3–G5 IMPL | **NOT AUTHORIZED** |

---

## 16. Verdict banner

| Campo | Valor |
|-------|-------|
| Block | **P-INT-10 — CI Canon Gate** |
| Master Plan alignment | Fase I ítem 2 |
| Discovery | **COMPLETE** |
| Implementation Plan | **THIS DOCUMENT** |
| IMPL code | **NOT AUTHORIZED** |
| Factory / Edge / Web / Supabase / Product / Marketplace | **PROTECTED** |
| Dry-run only | **BINDING** |
| `--mark-complete` | **ABSOLUTELY PROHIBITED** |
| Canon Gate HTTP API | **NOT IN SCOPE** |
| Documentary Audit | **PASS** (0 CRITICAL / 0 MAJOR; MINOR-01/02 non-blocking) |
| Next protocol step | **Director IMPL mandate** (`P-INT-10-CI-CANON-GATE-IMPL`) — NOT AUTHORIZED by this document |

---

**END OF IMPLEMENTATION PLAN**

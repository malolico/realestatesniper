# FACTORY INTEGRATION
## ADMIN LIVE WIRING — FCC → P-INT-01 SLICE A SERVICE EDGE
## IMPLEMENTATION PLAN

**Document ID:** `FACTORY_INTEGRATION_ADMIN_LIVE_WIRING_IMPLEMENTATION_PLAN.md`  
**Phase:** Factory Integration — Master Plan Fase I (observability / Admin connect)  
**Block:** Admin Live Wiring (FCC → P-INT-01 Slice A Service Edge)  
**Document Type:** Technical Implementation Plan  
**Status:** **PLAN COMMITTED — DOCUMENTARY AUDIT PASSED** — **NO IMPLEMENTATION AUTHORIZED BY THIS DOCUMENT**

**Repository:** RealEstateSniper  
**Branch baseline:** `integration/factory-complete-20260725`  
**Prerequisite commits:** P-INT-01 Slice A IMPL `4f9221f`; Slice A Status `2622c29`; Continuity Dossier reconcile `690bffb`

**Normative sources:**

1. `docs/factory-construction/FACTORY_2_0_COMPLETE_CONTINUITY_DOSSIER.md` (Slice A FULLY CLOSED; FCC live wiring = separate mandate; Web stop rule §20)  
2. `docs/factory-construction/FACTORY_INTEGRATION_MASTER_PLAN.md` (§5 Fase I — Registry read API + cablear Admin `FactoryControlCenter`)  
3. `docs/factory-construction/integration/FACTORY_INTEGRATION_P_INT_01_IMPLEMENTATION_PLAN.md` (§1.2 Admin sequencing: Slice A first → FCC later)  
4. `docs/factory-construction/integration/FACTORY_INTEGRATION_P_INT_01_SLICE_A_IMPL_STATUS.md` (STATUS COMMITTED; HTTP catalog; AuthZ)  
5. Discovery — Admin Live Wiring (session, READ_ONLY, approved) — FCC snapshot I.1 vs Slice A envelopes; Vite sin proxy; gap `keySample`  
6. Independent Documentary Audit — **PASS — READY FOR DOCUMENTARY COMMIT** (0 CRITICAL / 0 MAJOR; MINOR-DOC-01/02 closed in this materialization)

**Director authorization (this Plan document / Documentary Commit):** **approved**.  
**Director authorization (Admin Live Wiring IMPL code):** **NOT AUTHORIZED** by this document.  
**Director authorization (Slice B / Job Runner / Auth productiva / Supabase / Product / Marketplace / II.7):** **NOT AUTHORIZED**.

**Documentary corrections (post-audit, closed here):**

| ID | Correction |
|----|------------|
| **MINOR-DOC-01** | Plan materializado como archivo único en `docs/factory-construction/integration/` |
| **MINOR-DOC-02** | `AdminDashboard.jsx` declarado **OUT OF SCOPE** estricto (no opcional) |

---

## 0. Absolute Non-Authorization Banner

This Plan **does not** authorize implementation. IMPL requires a **separate** Director mandate (e.g. `ADMIN-FCC-LIVE-WIRING-IMPL`) after Gates G1–G2.

| Surface | Status under this Plan |
|---------|------------------------|
| Admin Live Wiring IMPL code | **NOT AUTHORIZED** until Director IMPL mandate |
| P-INT-01 Slice B / Job Runner / orchestration commands | **NOT AUTHORIZED** |
| Auth productiva (Supabase Auth Admin, cloud IdP, investor JWT) | **NOT AUTHORIZED** |
| Supabase / RLS / migrations / ELR in `deals` | **PROHIBITED** |
| Product / Marketplace / CRM / Owner Portal / Projection / Investor API | **PROHIBITED** |
| II.7 Delivery | **NOT OPENED** |
| New Service Edge endpoints | **PROHIBITED** |
| Modification of `src/factory/**`, CB semantics, I.1 CLI, II.2 | **PROHIBITED** |
| Retiro canónico de `public/factory-observability-snapshot.json` | **PROHIBITED** in this block |
| Modification of `services/factory-service-edge/**` | **OUT OF SCOPE** (prefer Vite proxy; Edge remains Slice A as committed) |

**Hard separations:**

```text
Admin Live Wiring (this Plan)  ≠  P-INT-01 Slice A Service Edge (already FULLY CLOSED)
Admin Live Wiring              ≠  Slice B / Job Runner
Live Control Plane HTTP        ≠  Static I.1 snapshot (dual-path preserved)
DEV Bearer (Vite env)          ≠  Auth productiva
FCC Admin UI                   ≠  Product / Marketplace / Investor API
```

---

## 1. Objetivo

Cablear el **Factory Control Center** (Admin) al **P-INT-01 Slice A Service Edge** como fuente **live READ_ONLY** de observación Factory (registry / ELR summary / governance), vía HTTP same-origin (proxy Vite), **sin** importar `src/factory` en el browser, **sin** mutar Factory, **sin** Slice B, y **sin** eliminar el snapshot estático I.1.

**Criterio Master Plan Fase I:** Admin deja de depender del snapshot estático como única fuente live para status / madurez / compliance / drift / readiness.

---

## 2. Alcance

| Incluido | Detalle |
|----------|---------|
| React Admin FCC | Adaptar `FactoryControlCenter.jsx` a consumir envelopes Slice A |
| Cliente HTTP Admin | Helper de fetch READ_ONLY (Bearer temporal, correlation ID) |
| Proxy Vite | `/v1/factory/*` → proceso Node Service Edge local |
| Dual-path | Live preferente; snapshot fallback/offline |
| Mapeo UI | Endpoints Slice A existentes → paneles FCC autorizados |
| Etiquetado UI | Distinguir “live Control Plane” vs “static snapshot” |
| Validación / tests | Contrato, fallos HTTP, no import Factory, paneles Slice B intactos |

---

## 3. Exclusiones (absolutas)

- Slice B / comandos / orquestación / Job Runner  
- Auth **productiva** (Supabase Auth Admin, JWT investor, cloud IdP)  
- Supabase / RLS / migrations  
- Product / Marketplace / CRM / Owner Portal / Projection / Investor API  
- II.7 Delivery  
- Nuevos endpoints Service Edge  
- Modificar/borrar `public/factory-observability-snapshot.json` como retiro canónico  
- Modificar `services/factory-service-edge/**` (proxy Vite absorbe CORS/transporte)  
- Modificar `src/factory/**`, CB-15/18 fuentes, II.2 Read Model  
- Abrir paneles Jobs / Engines / Queue (permanecen `Not connected yet`)  
- Modificar `src/components/dashboards/AdminDashboard.jsx` (**OUT OF SCOPE** — MINOR-DOC-02)

---

## 4. Arquitectura final

```text
Browser Admin (Vite)
  └─ FactoryControlCenter
        │  GET /v1/factory/*   (same-origin)
        │  Authorization: Bearer <DEV_ADMIN_SESSION_TOKEN>
        │  X-Correlation-Id: <uuid>
        ▼
Vite proxy  /v1/factory  →  http://127.0.0.1:<EDGE_PORT>
        ▼
Factory Service Edge Slice A (Node http)
  health (no auth) | readiness|registry|elr|governance/* (authz)
        ▼
CB-01 / CB-15 aggregateElr / CB-18 panels   (read-only)

Dual path (conservado):
  GET /factory-observability-snapshot.json  → public/ (offline / fallback)
  I.1 CLI services/factory-observability/** → intacto
```

**Principios:** hosting-neutral Edge intacto; UI ≠ security; INTERNAL_OPS solo en Admin; fail-closed en errores Edge.

**Discovery (binding facts preserved):**

- FCC hoy carga `/factory-observability-snapshot.json` (contrato I.1).  
- Slice A usa envelopes `factory.service_edge.read` distintos del snapshot.  
- Vite no tiene proxy hoy; no hay Bearer React hacia Edge.  
- Expedientes enriquecidos en snapshot vs `keySample` only en Edge — UI degradada, no inventada.

---

## 5. Flujo React

1. Mount `FactoryControlCenter` → fase `loading`.  
2. (Opcional) `GET /v1/factory/health` — liveness.  
3. En paralelo (auth): readiness, registry/summary, elr/summary, governance/dashboard|drift|compliance|maturity.  
4. Validar envelopes (`contractId`, `mode`, `apiVersion`, `dataClassification` donde aplique).  
5. Mapear `payload` → estado de paneles Status / Governance / Warnings / Sync / Expedientes degradados.  
6. Si live falla de forma recuperable → **fallback snapshot** (si habilitado) + etiqueta “static snapshot”.  
7. Si live y snapshot fallan → `read_error` (no inventar datos).  
8. Paneles Jobs/Engines/Queue/Duplicates/Next Run → **sin cambio**: `Not connected yet`.

**Prohibido en React:** `import` desde `src/factory/**` o `services/factory-service-edge/**` (excepto tipos/constantes **copiadas** o contrato mínimo en cliente Admin si hace falta — preferir strings literales de paths Slice A).

---

## 6. Flujo HTTP

| Regla | Binding |
|-------|---------|
| Método | Solo `GET` |
| Body | Prohibido |
| Query | Ninguna (Slice A `maxQueryKeys: []`) |
| Auth | `Authorization: Bearer <token>` en todas las rutas autenticadas |
| Correlation | Generar UUID; enviar `X-Correlation-Id`; mostrar/log seguro en Admin |
| Transport | Preferir **proxy Vite** (evita CORS) |
| Content-Type respuesta | `application/json` |

---

## 7. Endpoints utilizados

| Método | Path | Auth |
|--------|------|------|
| GET | `/v1/factory/health` | No |
| GET | `/v1/factory/readiness` | Sí |
| GET | `/v1/factory/registry/summary` | Sí |
| GET | `/v1/factory/elr/summary` | Sí |
| GET | `/v1/factory/governance/dashboard` | Sí |
| GET | `/v1/factory/governance/drift` | Sí |
| GET | `/v1/factory/governance/compliance` | Sí |
| GET | `/v1/factory/governance/maturity` | Sí |

**Ningún otro path.** Catálogo = Status Slice A COMMITTED. No crear endpoints.

---

## 8. Mapeo endpoint → panel FCC

| Panel FCC | Fuente live | Notas |
|-----------|-------------|-------|
| Factory Status — available / empty | `readiness` + `registry/summary` + `elr/summary` | Sustituye `factory.available` / `elrHealth` del snapshot |
| Constitutional metrics (si se muestran) | `governance/dashboard.payload.constitutional` | Slice A expone counts; **no** span CB-00→19 en catálogo HTTP — UI no inventará span desde Edge |
| Expedientes (summary) | `registry/summary.keySample` + `expedienteCount` | **Degradación honesta:** sin `state`/`maturity_score` por key (gap Discovery) |
| ELR counts / event kinds | `elr/summary` (`sectionCounts`, `eventKindCounts`) | Sustituye lineage parcial |
| Governance aggregates | `governance/dashboard` | maturity / compliance / coverage / canonDrift |
| Drift warning | `governance/drift` (+ flags dashboard) | |
| Compliance detail | `governance/compliance` | |
| Maturity detail | `governance/maturity` | |
| Warnings | `warnings` de envelopes + `payload.warnings` | Sanitizados; truncar en UI |
| Last Synchronization | `generatedAt` del envelope (p. ej. readiness o dashboard) | |
| Engines / Jobs / Queue / Duplicates / Next Run | — | Permanecen `Not connected yet` |

---

## 9. Estrategia dual-path

| Modo | Condición | Comportamiento |
|------|-----------|----------------|
| **LIVE** | Edge reachable + AuthZ OK + envelopes válidos | Fuente primaria; etiqueta “live Control Plane” |
| **SNAPSHOT_FALLBACK** | Live timeout / 5xx / network; flag fallback ON | Leer `/factory-observability-snapshot.json`; etiqueta “static snapshot (fallback)” |
| **OFFLINE_ONLY** | Config explícita o Edge no provisionado | Solo snapshot (dev) |
| **ERROR** | Live fail y snapshot fail/invalid | `read_error`; sin datos inventados |

**Reglas:** no borrar snapshot; no modificar artefacto público en este bloque; TD-DUAL-SNAPSHOT permanece OPEN.

---

## 10. Manejo de errores

| HTTP / caso | UI |
|-------------|-----|
| 401 / 403 | Error auth; **no** fallback silencioso a snapshot con datos privilegiados sin etiqueta; mensaje fail-closed |
| 404 | Path/proxy mal configurado |
| 429 | Rate limited; Retry-After si presente; no martillar |
| 503 / NOT_READY | Dependency unavailable; permitir fallback snapshot etiquetado |
| Timeout | Igual que 503 de transporte |
| Envelope inválido | Rechazar payload; no renderizar parciales inseguros |
| Snapshot schema inválido (fallback) | Mantener contrato I.1 actual de FCC |

Nunca mostrar tokens, rutas absolutas de servidor, ni stack traces.

---

## 11. Proxy Vite

En `vite.config.js` (único cambio Vite autorizado en IMPL futuro):

- Proxy path prefix: `/v1/factory`  
- Target: `http://127.0.0.1:<EDGE_PORT>` (env `VITE_FACTORY_EDGE_PROXY_TARGET` o default documentado)  
- Sin reescritura que rompa paths Slice A  
- Dev-only; no implica Auth productiva ni cloud  

**Arranque:** Edge Node **aparte** de `vite` (proceso local Service Edge). Orden documentado en Status futuro: Edge listen → `npm run dev`.

---

## 12. Auth temporal de desarrollo

| Regla | Binding |
|-------|---------|
| Alcance | **Solo desarrollo local / harness Admin** |
| Mecanismo | Bearer token que el Edge InMemory Authn ya acepta (sesión de test Ops/Director con capabilities Slice A) |
| Entrega al browser | Variable Vite `VITE_FACTORY_EDGE_DEV_BEARER` leída por FCC / `factoryEdgeClient` — **nunca** commit de secretos reales |
| Prohibido | Auth productiva; Supabase session bridging; investor JWT; persistir tokens en repo; inyectar Bearer vía `AdminDashboard.jsx` |
| Documentación | Status del bloque: “DEV ONLY — TD-AUTH-PROD remains OPEN” |

Sin este token, rutas autenticadas fallan 401 — comportamiento correcto fail-closed.

---

## 13. Riesgos

| ID | Riesgo | Mitigación |
|----|--------|------------|
| R1 | Mismatch I.1 ↔ Slice A | Mapper dedicado; no URL-swap |
| R2 | Gap expedientes enriquecidos | UI degradada a `keySample` |
| R3 | Auth solo InMemory | Auth temporal DEV; TD-AUTH-PROD OPEN |
| R4 | CORS | Proxy Vite obligatorio |
| R5 | Edge no levantado | Fallback snapshot + error claro |
| R6 | Scope creep Web | Diff limitado a FCC + vite + helper (sin AdminDashboard) |
| R7 | Abrir Jobs UI | Prohibido; paneles intactos |
| R8 | Bundle importa Factory | Test estático de imports |

---

## 14. Validaciones

1. FCC live muestra readiness/registry/elr/governance sin snapshot.  
2. Health reachable vía proxy.  
3. 401 sin Bearer.  
4. Edge down → fallback snapshot etiquetado (si ON) o read_error.  
5. Snapshot file **sigue existiendo** sin modificación de retiro.  
6. Jobs/Engines siguen `Not connected yet`.  
7. Bundle Admin **sin** imports `src/factory/**`.  
8. No llamadas a Product/Marketplace/Supabase desde FCC.  
9. Correlation ID presente en requests live.  
10. Empty-state Edge → UI empty honesta.

---

## 15. Tests

| Tipo | Contenido |
|------|-----------|
| Unit | Mapper envelope→panel; validación contractId/mode; degradación keySample |
| Component | FCC phases: loading / live / fallback / error (mock fetch) |
| Static | Grep/ban imports Factory desde `FactoryControlCenter` / helper |
| Manual harness | Edge local + Vite proxy + Bearer DEV |
| Regresión | No exigir cambios Slice A runner; smoke Admin no rompe OperationsCenter |

No tests de Job Runner / Slice B / Auth prod.

---

## 16. Gate de aprobación

| Gate | Requisito |
|------|-----------|
| G0 | Discovery aprobado |
| G1 | **Documentary Audit PASS** de este Implementation Plan — **DONE** |
| G2 | Documentary Commit del Plan — **this commit** |
| G3 | **Director IMPL mandate** explícito (p. ej. `ADMIN-FCC-LIVE-WIRING-IMPL`) |
| G4 | Independent Technical Audit post-IMPL |
| G5 | Implementation Commit + Status + Status Commit |

**Este documento no autoriza G3–G5.**

---

## 17. Criterios de éxito

- FCC en Admin consume **live** Slice A para Status / ELR summary / Governance / Warnings / Sync.  
- Expedientes panel coherente con capacidades Slice A (`keySample` + counts).  
- Dual-path documentado; snapshot no eliminado.  
- Proxy Vite operativo en dev.  
- Auth temporal DEV only; TD-AUTH-PROD abierto.  
- Cero Slice B / Supabase / Product / Marketplace / nuevos endpoints.  
- Master Plan Fase I criterio “Admin connected” para observación Factory **cumplido** en entorno local harness.

---

## 18. Auditoría posterior

Tras IMPL (cuando exista mandato):

1. Auditoría técnica independiente READ_ONLY (AuthZ, sanitización UI, imports, scope creep).  
2. Confirmar no regresión Slice A (`runPInt01SliceAValidation.js` opcional smoke).  
3. Status oficial del bloque Admin Live Wiring.  
4. Actualización Continuity Dossier (Fase I / FCC) solo con mandato documental.  
5. Sin push salvo orden Director.

---

## 19. Archivos previstos (IMPL futuro — NOT AUTHORIZED)

| Archivo | Acción | Scope |
|---------|--------|-------|
| `src/components/admin/factory/FactoryControlCenter.jsx` | Modificar | **IN SCOPE** |
| `src/components/admin/factory/factoryEdgeClient.js` (o nombre equivalente) | Crear (cliente HTTP) | **IN SCOPE** |
| `vite.config.js` | Modificar (proxy) | **IN SCOPE** |
| `src/components/admin/index.js` | Solo si export nuevo del helper | **IN SCOPE** (condicional) |
| `src/components/dashboards/AdminDashboard.jsx` | — | **OUT OF SCOPE** (MINOR-DOC-02) |

**No:** `public/factory-observability-snapshot.json` (retiro), Edge contract/código, CB-*, Product, Marketplace, Supabase.

Bearer DEV / proxy target se configuran vía variables Vite / entorno local documentadas en Status futuro — **no** vía cambios a `AdminDashboard.jsx`.

---

## 20. Verdict banner

| Campo | Valor |
|-------|-------|
| Documentary Audit | **PASS** |
| MINOR-DOC-01 | **CLOSED** (file materialized) |
| MINOR-DOC-02 | **CLOSED** (`AdminDashboard.jsx` OUT OF SCOPE) |
| IMPL | **NOT AUTHORIZED** |
| Slice B / Auth prod / Supabase / Product / Marketplace | **NOT OPENED** |

**PLAN ONLY — READY FOR DIRECTOR IMPL MANDATE (separate order).**

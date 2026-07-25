# FACTORY INTEGRATION MASTER PLAN

**Documento:** Auditoría de integración — Factory 2.0 → RealEstateSniper  
**Estado Factory:** CB-00 → CB-19 construidos y validados (APPROVED)  
**Naturaleza:** Plan de integración únicamente — **sin implementación**  
**Fecha de auditoría:** 2026-07-23  
**Autoridad:** Arquitectura de Integración · sometido a FFO / Blueprint / fronteras soberanas

---

## 0. Veredicto ejecutivo

Factory 2.0 es un **subsistema constitucionalmente completo y runtime-aislado**.

| Plano | Estado |
|-------|--------|
| Construcción CB-00…CB-19 | COMPLETE / APPROVED |
| Consumo desde Web / Supabase / Marketplace | **Cero** |
| Consumo desde `dealPipeline` / Edge Functions | **Cero** |
| Única “conexión” producto | Stub UI Admin: *Not connected yet* |
| Único consumidor real hoy | CLI de validación (`runCb*`) |

**Conclusión:** la integración no empieza por reescribir Factory. Empieza por un **borde de servicio** que exponga lecturas y orquestaciones ya validadas, respetando FFO-06 / LFF-07 / PP-08 (Factory no decide, no asigna `access_tier`, no construye Marketplace / Projection / Product Catalog / Decision Engine).

---

## 1. Componentes de Factory aún no conectados al proyecto

### 1.1 Aislamiento total (sin import desde app producto)

Todo el árbol `src/factory/cb00` … `src/factory/cb19` opera solo hacia dentro o vía runners CLI.

| Bloque | Capacidad lista (no conectada) | Consumidor producto actual |
|--------|--------------------------------|----------------------------|
| **CB-00** | Gobernanza de fases, vocabulario, checklist canon | Ninguno |
| **CB-01** | `FactoryRegistry`, ELR file-backed (`data/factory-registry`) | Ninguno |
| **CB-02** | DSO / ingestión de fuentes | Ninguno (fixtures sintéticas) |
| **CB-03** | Compliance Gate P0 | Ninguno |
| **CB-04** | Motor Runtime + catálogo OMC | Ninguno |
| **CB-05…CB-10** | Capas FND / LEG / DST / ECO / ENV | Ninguno |
| **CB-06** | Evidence Service + sufficiency | Ninguno |
| **CB-11** | Loop Engine (24 LOOP) | Ninguno |
| **CB-12** | Swarm Coordinator (14 SWM) | Ninguno |
| **CB-13** | Intelligence + G0–G6 + prep handoff | Ninguno |
| **CB-14** | AI Assist (stubs + RLG + PRH) | Ninguno |
| **CB-15** | `OrchestrationBusService` (hub operativo) | Ninguno |
| **CB-16** | `DecisionHandoffService` + Decision Package | Ninguno (puerto hacia Decision Engine futuro) |
| **CB-17** | Watch / Update / Archive / Retiro | Ninguno |
| **CB-18** | Governance Dashboard (report API in-process) | Ninguno (Admin UI no lo llama) |
| **CB-19** | Certificate + Construction Ledger + E2E | Ninguno (artefacto de cierre) |

### 1.2 Pseudo-conexiones (no son integración)

| Elemento | Qué es | Qué no es |
|----------|--------|-----------|
| `FactoryControlCenter.jsx` | Shell Admin con “Not connected yet” | No importa `src/factory` |
| `factoryControl` en `App.jsx` | Objeto de flags `available: false` | No es API Factory |
| Vocabulario compartido en docs (factory_key, Black Box Factory catalog) | Contrato conceptual | No hay emitter runtime |
| `dealPipeline.js` | Scoring heurístico → Supabase `deals` | **Paralelo** a Factory; no es CB-02/CB-15 |

### 1.3 Persistencia desacoplada

- Factory ELR: filesystem local (`FileElrStore`) — explícitamente fuera de Supabase.
- Producto: PostgREST / Auth / Edge Functions (Stripe, admin-access).
- **No existe** puente ELR ↔ tablas `deals` / `markets` / owner properties.

---

## 2. Qué partes de la Web deberían consumir Factory

Principio: la Web **consume conocimiento Factory**, no ejecuta motores en el browser y no viola fronteras soberanas.

### 2.1 Superficies Admin (prioridad alta — gobierno interno)

| Superficie actual | Debería consumir | CB fuente | Modo |
|-------------------|------------------|-----------|------|
| Factory Control Center | Estado expediente, jobs FFO, warnings CMP/PRH, sync | CB-15 lineage + CB-18 dashboard | Read API |
| System Health / Ops | Canon drift, maturity_score, P0 | CB-18 | Read API |
| Audit / compliance views | ELR summary, G0–G6, handoffs | CB-01 + CB-13/16 | Read API |
| Owners queue (correlación) | `factory_key` linkage si existe expediente | CB-01 | Read + correlate |

### 2.2 Superficies Founder / Operator (prioridad media)

| Superficie | Consumo legítimo | Prohibido |
|------------|------------------|-----------|
| Founder ops | Madurez, cobertura MOT/LOOP, alertas | Asignar `access_tier` desde Factory |
| Internal reports | Construction Ledger / certificate status (CB-19) | Redefinir catálogos |

### 2.3 Superficies Subscriber / Marketplace (prioridad baja y **indirecta**)

| Superficie | Relación correcta | Relación incorrecta |
|------------|-------------------|---------------------|
| Investor Marketplace UI | Consumir **producto ya decidido/publicado** aguas abajo de Decision/Product | Llamar CB-15/16 desde el cliente o mostrar Decision Package crudo |
| Deal cards Premium/Diamond | Clasificación **Producto** (fuera Factory) | Usar CB-16 para clasificar Deal/Premium/Diamond |

### 2.4 Owner Dashboard

| Consumo legítimo | Notas |
|------------------|-------|
| Correlación owner submission → expediente (`factory_key`) | Owner aporta hechos; Factory evidencia/orquesta |
| Estado de “knowledge readiness” resumido (no ELR completo) | Evitar filtrar corpus Decision a roles no autorizados |

### 2.5 Lo que la Web **no** debe consumir directamente

- `MotorRuntime.execute` / handlers de motores  
- AIA gateway (salvo vía servicio servidor con AUT/PRH)  
- Mutaciones de tesis Decision post-freeze (CB-16)  
- Operaciones bloqueadas por `factoryBoundaryGuard` (`marketplace_listing`, `assign_access_tier`, etc.)

---

## 3. Pipelines existentes vs faltantes

### 3.1 Existentes

| Pipeline | Ubicación | Tipo | Conectado a producto |
|----------|-----------|------|----------------------|
| Capas Factory FND→INT | `src/factory/cb05…cb13/*Pipeline.js` | Interno Node | No |
| Orchestration Bus FFO | `OrchestrationBusService.orchestrateExpediente` | Interno Node | No |
| Decision Handoff | CB-16 `prepareAndDeliver` | Interno Node | No (puerto in-process) |
| Watch→Archive | CB-17 | Interno Node | No |
| Validación CB-00…19 | `runCb*` | CLI | N/A |
| Deal scoring preview | `src/lib/dealPipeline.js` + `runPipeline*.js` | Heurístico → Supabase opcional | Sí (producto), **no Factory** |
| Stripe checkout / webhook | `supabase/functions/*` | Edge | Sí (pagos) |
| Black Box | `docs/BLACK_BOX_*` | Solo documentación | No runtime |

### 3.2 Faltantes (integración)

| Pipeline faltante | Propósito | Depende de |
|-------------------|-----------|------------|
| **P-INT-01 Factory Service Edge** | Entrada HTTP/RPC segura a CB-15/18 (read + orchestrate controlado) | CB-01, CB-15, auth admin |
| **P-INT-02 DSO Live Ingest** | Sustituir fixtures por fuentes DSO reales → CB-02 | Jurisdicción, legal, rate limits |
| **P-INT-03 ELR Persistence Bridge** | ELR durable (object store / DB dedicada) sin mezclar con `deals` | CB-01 schema |
| **P-INT-04 Decision Package Export** | Entregar corpus CB-16 a Decision Engine (futuro) | CB-16 port |
| **P-INT-05 Product Publish Gate** | Producto consume handoff **después** de Decision (no Factory) | Decision + Product soberanos |
| **P-INT-06 Marketplace Sync** | Publicar deals solo tras publish gate | Marketplace + Product |
| **P-INT-07 Black Box Emitters** | Emitir eventos Factory catalog al Black Box | BB intake (aún no implementado) |
| **P-INT-08 Anti-degradation / ACT-V live** | De stub CB-15/17 a watch real | DSO events |
| **P-INT-09 DealPipeline Reconciliation** | Decidir: retirar heurística o marcarla “pre-Factory / non-canon” | Producto + governance |
| **P-INT-10 CI Canon Gate** | Correr validadores CB + canon drift en CI | CB-18/19 |

### 3.3 Diagrama de pipelines (estado)

```text
HOY
  [CLI runCb*] ──► [src/factory CB-00…19] ──► [file ELR]
  [Web+Supabase] ──► [deals/markets/Stripe]     (paralelo)
  [dealPipeline] ──► [Supabase deals]           (paralelo, no-canon Factory)

FALTANTE (integración)
  [Admin/API] ──► [Factory Service] ──► [CB-15/18/01]
       │                                    │
       │                                    ├── ELR durable
       │                                    └── CB-16 Package ──► [Decision Engine*]
       └── read-only UI
  [*] Decision / Projection / Product / Marketplace = fuera de Factory
```

---

## 4. APIs o servicios necesarios

> Ninguno existe hoy como superficie HTTP sobre Factory. Lo siguiente es el **catálogo mínimo** para integrar sin romper arquitectura validada.

### 4.1 Factory Control Plane (interno, Admin-only)

| API / Servicio | Operaciones | Fuente | Riesgo |
|----------------|-------------|--------|--------|
| **Factory Registry API** | GET expediente, GET ELR summary, list keys | CB-01 | Bajo (read) |
| **Orchestration API** | POST orchestrate (async job), GET lineage | CB-15 | Medio (write controlado) |
| **Governance Dashboard API** | GET maturity, compliance, coverage, drift | CB-18 | Bajo (read) |
| **Handoff API** | POST prepareAndDeliver; GET package metadata | CB-16 | Medio; **no** Decision internals |
| **Lifecycle API** | POST watch / archive / reopen (ops) | CB-17 | Medio |
| **Canon Gate API** | GET drift; deploy allow/deny | CB-18 | Bajo; bloquea deploy |

### 4.2 Servicios de borde (no son Factory, pero necesarios para integración)

| Servicio | Rol | Nota constitucional |
|----------|-----|---------------------|
| **AuthZ Admin Gateway** | Solo roles Factory Ops / Director | Separar de investor JWT |
| **Job Runner / Queue** | Orquestaciones largas fuera del request Web | Evita ejecutar CB-15 en browser |
| **ELR Store Adapter** | Persistencia durable del ELR | No mezclar con tabla `deals` |
| **Decision Engine Adapter** (futuro) | Consume Decision Package | Fuera de Factory |
| **Product Catalog Service** (futuro) | Pricing / access_tier | **Prohibido** dentro de Factory |
| **Black Box Intake** (futuro) | Eventos Factory domain | Docs ya existen; runtime no |

### 4.3 Qué **no** crear como “API Factory”

- API de `access_tier` / pricing  
- API de clasificación Deal / Premium / Diamond  
- API de listing Marketplace  
- API de Projection release  
- Endpoint público investor que exponga ELR completo o Decision Package

---

## 5. Orden de integración que minimiza el riesgo

Orden **read-first, write-later, sovereign-last**.

### Fase I — Observabilidad (riesgo mínimo)

1. **Factory Registry read API** + cablear Admin `FactoryControlCenter` a CB-18/CB-15 lineage (solo lectura).  
2. **Canon drift gate** en proceso de release (CB-18), sin cambiar Factory.  
3. Documentar y etiquetar `dealPipeline` como **non-canon / provisional** (evitar doble verdad silenciosa).

*Criterio de éxito:* Admin deja de mostrar “Not connected yet” para status/madurez/alertas, sin mutar expedientes de producción.

### Fase II — Orquestación controlada (riesgo medio-bajo)

4. **Job runner** + Orchestration API (CB-15) en entorno staging con fixtures.  
5. Persistencia ELR durable (adapter) manteniendo schema CB-01.  
6. CI: subset de validadores CB-15/16/18/19 en pipeline.

*Criterio de éxito:* un expediente piloto orquestable desde Ops sin tocar Marketplace.

### Fase III — Frontera Decision (riesgo medio)

7. Activar **Handoff API** (CB-16) exportando Decision Package a un sink versionado (object storage / cola).  
8. Congelar tesis (freeze) y Watch mode (CB-17) en staging.  
9. **No** implementar Decision Engine dentro de este paso — solo el puerto.

*Criterio de éxito:* ST-RDY→ST-DEC reproducible; Package inmutable entregado; Web no clasifica.

### Fase IV — Producto aguas abajo (riesgo alto si se mezcla)

10. Decision Engine (soberano) consume Package.  
11. Product Catalog / pricing / `access_tier` (soberano).  
12. Marketplace publica solo outputs de Producto.  
13. Reconciliation: retirar o aislar `dealPipeline` heurístico.

*Criterio de éxito:* Marketplace nunca llama Factory para decidir precio/tier.

### Fase V — Live world + memoria (riesgo operacional)

14. DSO live ingest (CB-02) por jurisdicción.  
15. ACT-V / FRS live (CB-17).  
16. Black Box emitters (catálogo Factory ya documentado).

---

## 6. Dependencias entre módulos

### 6.1 Dependencias internas Factory (ya construidas — no reordenar)

```text
CB-00 ─► CB-01 ─► CB-02
              └─► CB-03 / CB-04
CB-04 + CB-05…10 + CB-06 ─► CB-11 ─► CB-12
CB-06…11 ─► CB-13 ─► CB-14 ─► CB-15 ─► CB-16 ─► CB-17
CB-01 + CB-15 ─► CB-18
CB-00…18 ─► CB-19
```

### 6.2 Dependencias de integración (nuevas)

| Módulo integración | Depende de | No debe depender de |
|--------------------|------------|---------------------|
| Admin Factory UI | Factory read APIs (I) | Decision Engine, Stripe |
| Orchestration jobs | CB-15, CB-01 store | Marketplace tables |
| Handoff export | CB-16 | Product pricing |
| Decision Engine | CB-16 Package | CB-05…14 internals |
| Product Catalog | Decision outcomes | Factory motors |
| Marketplace UI | Product publish | Factory ELR |
| Black Box Factory events | CB-15/16/17 lifecycle hooks | Investor UX |
| dealPipeline (legacy) | — | Canon Factory (hasta reconciliar) |

### 6.3 Dependencias prohibidas (violación constitucional si se crean)

- Web Marketplace → `DecisionHandoffService` para tiering  
- Factory → Stripe / `access_tier`  
- Factory → Projection / Product Catalog modules  
- Supabase `deals` como sustituto del ELR  

---

## 7. Qué puede integrarse **sin** modificar la arquitectura validada

### 7.1 Seguro (adaptadores / consumidores)

| Acción | Por qué es segura |
|--------|-------------------|
| Leer `FactoryRegistry` / ELR vía nuevo servicio wrapper | No cambia CB-01 |
| Exponer CB-18 `GovernanceDashboard.buildDashboard` por API | Report-only |
| Conectar Admin UI a esa API | UI stub → consumidor |
| Invocar `OrchestrationBusService` / `DecisionHandoffService` desde worker Node | Misma semántica validada |
| Exportar Decision Package a storage/cola | Usa puerto CB-16 existente |
| Añadir CI que ejecuta `runCb*` | No altera código CB |
| Emitir eventos Black Box **desde adapters** al completar FFO/handoff | Factory permanece productor de hechos |
| Adapter de persistencia ELR **compatible** con schema CB-01 | Sustituye store, no contrato |

### 7.2 Requiere diseño nuevo (fuera de Factory — no “parche CB”)

| Acción | Ámbito correcto |
|--------|-----------------|
| Decision Engine | Soberano aguas abajo |
| Projection | Soberano aguas abajo |
| Product Catalog / pricing / access_tier | Producto |
| Marketplace publish rules | Producto + Marketplace |
| DSO connectors live | CB-02 **extensión operacional** vía fixtures→adapters, sin redefinir OMC |
| Sustituir AIA stubs por vendors | SLOT / CB-14 política — sin romper PRH |

### 7.3 Explicitamente **no** hacer en integración temprana

- Refactorizar CB-00…CB-19 “para que encaje con React”  
- Meter Factory en el bundle Vite del investor app  
- Unificar `dealPipeline` scores con `maturity_score` sin acta governance  
- Escribir ELR en tablas de Marketplace  
- Implementar Decision/Projection “rápido” dentro de `src/factory`

---

## 8. Mapa de fronteras (recordatorio operativo)

```text
┌─────────────────────────────────────────────────────────────┐
│ FACTORY 2.0 (validado)                                      │
│  Knowledge · Evidence · Loops · Bus · Handoff · Watch       │
│  Termina en: Decision Package (ST-DEC) + freeze             │
└───────────────────────────┬─────────────────────────────────┘
                            │ Decision Package (CB-16 port)
                            ▼
┌─────────────────────────────────────────────────────────────┐
│ DECISION (no construido)                                    │
└───────────────────────────┬─────────────────────────────────┘
                            ▼
┌─────────────────────────────────────────────────────────────┐
│ PROJECTION / PRODUCT CATALOG / access_tier (no construidos) │
└───────────────────────────┬─────────────────────────────────┘
                            ▼
┌─────────────────────────────────────────────────────────────┐
│ MARKETPLACE + WEB + SUPABASE (existen, paralelos hoy)       │
└─────────────────────────────────────────────────────────────┘
```

---

## 9. Riesgos de integración (priorizados)

| Riesgo | Impacto | Mitigación |
|--------|---------|------------|
| Doble verdad (`dealPipeline` vs Factory) | Confusión Ops / deals no canónicos | Fase I: etiquetar + no mezclar scores |
| Ejecutar orquestación en request Web | Timeouts / fugas de frontera | Job runner (Fase II) |
| Exponer ELR a investors | Filtración corpus | AuthZ estricta; summaries only |
| “Integrar” clasificando en Factory | Violación PP-08 / LFF-07 | Rechazar PRs que toquen boundaries |
| Mezclar ELR con `deals` | Corrompe TRZ-01 / FFO-14 | Store dedicado |
| Implementar Decision dentro de Factory | Rompe Blueprint §Fuera de alcance | Mantener puerto CB-16 |

---

## 10. Definition of Done (integración — no construcción)

Factory ya cumplió DoD de **construcción** (CB-19).

Integración mínima viable (MVI):

1. Admin lee madurez / compliance / drift desde CB-18.  
2. Ops puede lanzar orquestación staging vía job + CB-15.  
3. Un Decision Package se exporta (CB-16) sin Decision Engine.  
4. Marketplace **sigue** sin llamar Factory.  
5. Ningún archivo CB-00…CB-19 necesita cambio para el MVI (solo adapters/consumidores nuevos).

---

## 11. Declaración de alcance de este documento

Este Master Plan:

- **No** implementa código  
- **No** modifica Web, Supabase, Marketplace ni Factory  
- **No** autoriza commits ni push  
- **Sí** fija el orden, las fronteras y los contratos de integración para el siguiente trabajo de ingeniería

> Factory 2.0 está construida.  
> El producto aún no la consume.  
> La integración correcta es **adaptador + frontera**, no fusión.

---

*FACTORY INTEGRATION MASTER PLAN — Auditoría de Integración RealEstateSniper · post CB-19 · documento de Arquitectura de Integración.*

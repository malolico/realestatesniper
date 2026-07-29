# STRATEGIC PROGRAM 01 — FACTORY ALIVE  
## SP01-01 — OFFICIAL DISCOVERY SPECIFICATION  
### Constitución del Programa

| Campo | Valor |
|-------|-------|
| **Document ID** | `FACTORY_EVOLUTION_SP01_FACTORY_ALIVE_OFFICIAL_DISCOVERY_SPECIFICATION.md` |
| **Path** | `docs/factory-construction/FACTORY_EVOLUTION_SP01_FACTORY_ALIVE_OFFICIAL_DISCOVERY_SPECIFICATION.md` |
| **Nature** | Official Discovery Specification — **Constitución de SP01** · define el **resultado operativo** · **no** define implementación · **no** autoriza IMPL, Plan, commits, push, Web, Supabase, Product ni Marketplace |
| **Program** | **Strategic Program 01 — Factory Alive** |
| **Specification ID** | **SP01-01** |
| **Parent authority** | `FACTORY_EVOLUTION_PROGRAMS_DIRECTOR_STRATEGIC_MANDATE.md` |
| **Does not redefine** | Blueprint · CB-00…CB-19 · P-INT · Hardening PROGRAM 01/02 · Factory Evolution Programs Mandate · CCD · Continuity · Master Plan |
| **Does not contain** | Implementation Plan · tasks · roadmap · phases · code proposals |
| **Branch (context)** | `integration/factory-complete-20260725-local` |
| **HEAD (context)** | `8cb5c2511dcdfe0c16f7a50d8c6eb5c1a3d5420f` |
| **Date** | **2026-07-29** |

---

## Normative sources (read-only)

This Specification derives exclusively from:

1. `FACTORY_EVOLUTION_PROGRAMS_DIRECTOR_STRATEGIC_MANDATE.md` — Strategic Program 01 identity and exclusions  
2. Construction Blueprint · CB-00…CB-19 (construction closed; consumed, not rewritten)  
3. Factory Integration Master Plan — especially §10 Integración mínima viable (MVI)  
4. Complete Continuity Dossier — closed Integration/Hardening record; frontiers §20–§22; protocol §27  
5. CCD — continuity law; no parallel architecture; programs do not authorize IMPL by listing  
6. P-INT / Integration Statuses — existing surfaces and closures (cited as dependencies, not redefined)  
7. Architectural audits already recorded in Continuity / Status chain  

**Rule:** where this Specification restates Mandate or Master Plan language, those sources prevail on conflict. This document **narrows SP01 operational end-state**; it does **not** invent new architecture.

---

## 1. Objetivo del Strategic Program 01

Establecer Factory como un **sistema Factory operable por sí mismo**: Registry, ELR, orquestación, lecturas de gobernanza y superficies operativas de control autorizadas funcionan como un **control plane Factory vivo**, sin exigir que Product o Marketplace existan dentro de Factory.

Al cerrar SP01, Factory debe poder **ejecutarse, observarse y gobernarse como Factory** bajo fronteras constitucionales ya vigentes.

SP01 **no** es el lanzamiento productivo Arizona, **no** es Scale Out nacional, y **no** es publicación comercial.

---

## 2. Definición oficial de Factory Alive

**Factory Alive** significa, de forma oficial y exclusiva bajo SP01:

> Factory 2.0 está **operativamente viva** cuando un operador autorizado puede, de extremo a extremo y de forma repetible bajo reglas fail-closed, **(A)** observar el estado de madurez / compliance / drift Factory desde la superficie de control Admin ya constitucionalmente separada de Product/Marketplace, **(B)** lanzar orquestación Factory en entorno **staging** mediante job runner + CB-15 sin ejecutar orquestación en el request Web, **(C)** exportar un Decision Package CB-16 **sin** Decision Engine, **(D)** conservar Marketplace **sin** llamar a Factory para decidir, y **(E)** hacerlo **sin** mutar la semántica constitucional CB-00…CB-19 ni incorporar soberanía Product (`access_tier` / pricing) ni Marketplace dentro de Factory.

Esta definición **instancia** el propósito del Mandate Strategic Program 01 y **alinea** el resultado operativo con Master Plan §10 MVI, sin renombrar MVI ni sustituir el Master Plan.

**Factory Alive no significa:**

- Arizona production launch  
- Knowledge / Intelligence / Decision Engine / Publication / Continuous Operation / Scale Out completos (SP02…SP08)  
- Auth productiva cloud como requisito de cierre SP01 (sigue siendo deuda/frontera aparte salvo Mandate explícito posterior)  
- Reapertura de construcción CB  
- Identidad con Hardening PROGRAM 01 (Core Hardening)  

---

## 3. Misión del Programa

La misión de SP01 es **demostrar y dejar oficialmente cerrado** que Factory, ya construida (CB-19) e integrada en las superficies de control ya registradas en Continuity, es un **organismo operativo** — no un conjunto de fases de construcción pendientes ni un módulo embebido en Product/Marketplace.

La misión se cumple cuando el **resultado operativo** de la §2 es verificable con evidencias de la §15, no cuando se ha escrito un Plan o se ha inventado arquitectura nueva.

---

## 4. Filosofía del Programa

1. **Operabilidad antes que expansión** — primero Factory viva; después Arizona, knowledge, intelligence, decision, publication, continuity institucional y scale (Mandate order).  
2. **Adaptador + frontera, no fusión** — Master Plan: Factory construida; el producto aún no la consume como dueño; integración correcta no fusiona soberanías.  
3. **Calidad antes que volumen** — Continuity §22.  
4. **No reabrir construcción** — CB COMPLETE se consume; no se reinterpreta como pendiente.  
5. **No absorber Hardening ni P-INT** — SP01 usa superficies; no reescribe Hardening ni catálogo P-INT.  
6. **Fail-closed y gobernado** — sin silent repair; UI ≠ security; ELR ≠ deals.  
7. **Especificación de resultado, no de método** — este documento fija el *qué*; el *cómo* pertenece a un Implementation Plan futuro bajo Continuity §27, no a SP01-01.

---

## 5. Alcance

**Dentro del alcance de SP01 (resultado operativo):**

| # | Resultado en alcance |
|---|----------------------|
| A | Control plane Factory operable: lecturas de gobernanza / madurez / compliance / drift (CB-18 lineage) desde Admin autorizado |
| B | Orquestación staging lanzable vía job + CB-15 (no orquestación en request Web) |
| C | Exportación de Decision Package (CB-16) sin Decision Engine |
| D | Separación Marketplace: Marketplace no llama Factory para decidir |
| E | Registry + ELR funcionan como verdad operativa Factory (schema/semántica CB-01 intacta) |
| F | Factory observable y gobernable como Factory sin Product/Marketplace embebidos |

**Modo de alcance:** SP01 puede **satisfacerse** total o parcialmente por superficies **ya FULLY CLOSED** en Continuity (p.ej. P-INT-01 Slice A/B, Admin Live Wiring, P-INT-03 OBJECT STORE path, P-INT-09/10) **si y solo si** las evidencias de §15 demuestran el resultado de §2. SP01 **no** exige reabrir esos bloques como IMPL pendiente.

**Fuera del alcance de ingeniería de este documento:** cualquier Implementation Plan, Mandate de IMPL, o selección de next block Continuity — **no autorizados** por SP01-01.

---

## 6. Exclusiones

SP01 **excluye expresamente** (Mandate SP01 + Continuity / Master Plan):

| Exclusión | Motivo |
|-----------|--------|
| Product pricing / `access_tier` / clasificación comercial por Factory sola | Soberanía Product; Continuity §22 |
| Marketplace | Downstream de Product; no acoplar a Factory para tiering |
| Decision Engine como soberanía comercial / Product | Pertenece a Strategic Program 05; no a SP01 |
| Arizona Alive (theater / jurisdicción live-world) | Strategic Program 02 |
| Knowledge Alive / Intelligence Alive | SP03 / SP04 |
| Publication / Continuous Operation / Scale Out | SP06 / SP07 / SP08 |
| Supabase sin Stop Rule + Mandate | Continuity §21 |
| Rediseño CB / rewrite Hardening / rewrite P-INT | Mandate Evolution Programs |
| Web / FCC cambios sin Mandate §20 | Continuity §20 |
| Push / deploy / GitHub Actions por este documento | Continuity §28 |
| II.7 Delivery investor channels | Continuity / Master Plan |
| Cloud ELR / Dedicated DB / SQLite como cierre SP01 | Continuity: OBJECT STORE closed; Cloud residual OPEN — **fuera** del resultado Alive mínimo salvo Mandate distinto |

---

## 7. Capacidades operativas mínimas obligatorias

Al finalizar SP01, **deben existir y ser demostrables** las siguientes capacidades mínimas (resultado, no diseño):

| ID | Capacidad mínima obligatoria | Anclaje |
|----|------------------------------|---------|
| **CAP-SP01-01** | Lectura Admin de madurez / compliance / drift Factory (CB-18) | Master Plan §10 MVI-1 |
| **CAP-SP01-02** | Lanzamiento de orquestación **staging** vía job runner + CB-15 | Master Plan §10 MVI-2; Continuity Slice B closed as staging delivery |
| **CAP-SP01-03** | Exportación de Decision Package CB-16 **sin** Decision Engine | Master Plan §10 MVI-3 |
| **CAP-SP01-04** | Marketplace **no** llama Factory para decidir | Master Plan §10 MVI-4 |
| **CAP-SP01-05** | Semántica CB-00…CB-19 **no** reescrita para lograr Alive; adapters/consumidores sí pueden existir | Master Plan §10 MVI-5 |
| **CAP-SP01-06** | Registry + ELR operan como fuente de verdad Factory (no deals tables) | Blueprint CB-01; Continuity ELR ≠ deals |
| **CAP-SP01-07** | Superficie de control Factory separable de Product/Marketplace | Mandate SP01; Master Plan fronteras |

---

## 8. Flujo operativo oficial que deberá ejecutar Factory al finalizar SP01

Al declarar SP01 COMPLETE, Factory deberá ser capaz de ejecutar, de forma repetible en el régimen autorizado (staging donde Continuity lo registre así), el siguiente **flujo operativo oficial de resultado**:

```text
1. OPERATE / OBSERVE
   Operador autorizado consulta el control plane Factory
   → lecturas de gobernanza / madurez / compliance / drift (CB-18)
   → sin mutar Product/Marketplace y sin exponer ELR como deals

2. ORCHESTRATE (STAGING)
   Operador autorizado solicita orquestación vía job (Command Edge / Job Runner)
   → ejecución asociada a CB-15
   → no orquestación síncrona en request Web de producto

3. HANDOFF PACKAGE (NO DECISION ENGINE)
   Factory produce / exporta Decision Package (CB-16)
   → frontera ST-RDY→ST-DEC respetada como handoff
   → Decision Engine NO es requisito ni parte de SP01

4. NON-CONSUMPTION BY MARKETPLACE
   Marketplace permanece desacoplado de Factory para decisión de precio/tier
   → MVI-4 satisfecho
```

Este flujo es el **contrato de resultado** de SP01. No prescribe archivos, endpoints, ni tareas de ingeniería.

---

## 9. Componentes constitucionales implicados

Componentes **implicados como consumidos / observados** (no redefinidos):

| Componente | Rol en SP01 |
|------------|-------------|
| **CB-01** Registry / ELR | Verdad operativa Factory |
| **CB-15** Orchestration Bus | Orquestación staging vía jobs |
| **CB-16** Decision Handoff | Export Package sin Decision Engine |
| **CB-18** Governance Dashboard | Lecturas madurez / compliance / drift |
| **CB-19** | Construcción cerrada — prerrequisito, no objeto de reconstrucción |
| **Factory Service Edge / Admin control plane** (Integration) | Superficie de operación/observación |
| **Job runner / Command Edge staging** (P-INT-01 Slice B record) | Vehículo de orquestación staging |
| **II.1–II.6 trust / eligibility chain** | Fronteras de proyección — no fusionar con Product |

---

## 10. Componentes que no podrán modificarse

Para lograr o declarar SP01 COMPLETE **está prohibido** modificar:

| Componente / corpus | Prohibición |
|---------------------|-------------|
| Semántica constitucional CB-00…CB-19 / elrSchema / state machine | No redesign bajo color Alive |
| Construction Blueprint como secuencia abierta | Construction CLOSED |
| Hardening PROGRAM 01 / PROGRAM 02 Statuses y catálogos HQ | No rewrite |
| P-INT Statuses / Closeouts / Mandates históricos | No redefinición; no reopen como pendiente sin Mandate nuevo |
| Factory Evolution Programs Mandate (ocho programas / orden) | No redefinición por SP01-01 |
| CCD constitutional continuity law | No anulación |
| Continuity stop rules §20–§21 | No bypass |
| Product / Marketplace sovereignty modules | Fuera de Factory |

**Permitido en principio (solo bajo Mandate + Continuity §27 futuros, no por este Discovery):** adapters/consumidores **nuevos** o hardening operativo **sin** cambiar semántica CB — coherente con Master Plan MVI-5. Este documento **no** autoriza ese Mandate.

---

## 11. Fronteras arquitectónicas

| Frontera | Regla binding |
|----------|---------------|
| Factory ↔ Product | Factory no asigna sola `access_tier` / pricing |
| Factory ↔ Marketplace | Marketplace no llama Factory para decidir |
| Factory ↔ Decision Engine | Package export sí (CB-16); Decision Engine soberano **fuera** de SP01 |
| ELR ↔ deals | ELR ≠ tablas deals / Supabase producto |
| UI ↔ security | UI ≠ security |
| Construction ↔ Evolution | Construction CLOSED; Evolution no reabre CB como construcción |
| Hardening ↔ Strategic Programs | Numeración distinta; no identidad SP01 ↔ PROGRAM 01 Hardening |
| Web / Supabase | Stop Rules Continuity §20 / §21 |
| Staging ↔ Production Auth | Staging operable ≠ Auth productiva cerrada |

---

## 12. Dependencias

| Dependencia | Estado oficial (Continuity / corpus) | Relación con SP01 |
|-------------|--------------------------------------|-------------------|
| CB-00…CB-19 construction | **COMPLETE** | Prerrequisito consumido |
| Master Plan Fase I | **COMPLETED** | Superficies de observabilidad/canon gate cerradas |
| P-INT-01 Slice A + Admin Live Wiring | **FULLY CLOSED** | Candidatas a satisfacer CAP-SP01-01 |
| P-INT-01 Slice B | **FULLY CLOSED** (staging) | Candidata a satisfacer CAP-SP01-02 |
| P-INT-03 OBJECT STORE | **FULLY CLOSED** (Cloud residual OPEN) | Soporta ELR durable path; Cloud **no** es DoD SP01 |
| P-INT-09 / P-INT-10 | **FULLY CLOSED** | Canon/dealPipeline labeling — no reopen |
| PROGRAM 01 Core Hardening | **COMPLETE** | Calidad núcleo; distinta de SP01 |
| PROGRAM 02 Integration Surface Hardening | Discovery published; **BLOCKED** on HQ-04…06 | No bloquea por sí la definición SP01; no redefinir |
| Evolution Mandate | Founding (untracked until Director commit) | Autoridad padre de SP01 |
| Continuity NEXT BLOCK | **NONE AUTHORIZED** | SP01-01 **no** autoriza IMPL ni next block |

---

## 13. Restricciones

1. Continuity §27 obligatorio antes de cualquier IMPL de gaps SP01.  
2. Este documento **no** es Mandate de IMPL ni Implementation Plan.  
3. No push / no commits autorizados por SP01-01.  
4. No Web/Supabase sin Stop Rule + Mandate.  
5. No inventar arquitectura paralela (CCD).  
6. No reclamar SP02…SP08 como parte de SP01.  
7. No tratar Auth productiva / dual-snapshot / Cloud ELR como criterios ocultos de Alive salvo Mandate Director explícito que enmiende esta Spec.  
8. No reabrir bloques FULLY CLOSED como “pendiente SP01” sin demostrar gap real contra §2/§7.

---

## 14. Criterios objetivos de aceptación

SP01 se acepta **solo si** todos los criterios siguientes son **verdaderos** y demostrables:

| ID | Criterio objetivo |
|----|-------------------|
| **ACC-01** | CAP-SP01-01…07 satisfechos (§7) |
| **ACC-02** | Flujo operativo §8 ejecutable de forma repetible en el régimen autorizado (staging donde aplique) |
| **ACC-03** | Marketplace no consume Factory para decisión (MVI-4) |
| **ACC-04** | Ningún cambio de semántica constitucional CB demostrado como necesario para el cierre (MVI-5) |
| **ACC-05** | Product/`access_tier`/Marketplace **no** incorporados en Factory como resultado SP01 |
| **ACC-06** | Arizona Alive / Scale Out / Publication comercial **no** reclamados como hechos por SP01 |
| **ACC-07** | Evidencias §15 archivadas y referenciables (Status/Audit/commits según protocolo) |
| **ACC-08** | Independent Technical Audit del cierre SP01 con veredicto PASS o PASS WITH OBSERVATIONS no bloqueantes |

---

## 15. Evidencias obligatorias para declarar SP01 COMPLETE

| # | Evidencia obligatoria |
|---|------------------------|
| 1 | Status documental SP01 COMPLETE (documento Status dedicado, futuro — no este Discovery) |
| 2 | Mapa de aceptación CAP-SP01-01…07 → evidencia verificable (runners / Statuses P-INT ya cerrados / demos staging / audits) |
| 3 | Demostración del flujo §8 (observe → orchestrate staging → package export → marketplace non-coupling) |
| 4 | Confirmación explícita de exclusiones §6 (no Product/Marketplace/Decision Engine/SP02…08 reclamados) |
| 5 | Independent Technical Audit de cierre SP01 |
| 6 | Si hubo IMPL de gaps: Implementation Commit SHA(s) bajo Mandate; si no hubo IMPL porque superficies cerradas bastan: **documentary proof of satisfaction** sin reopen |
| 7 | Continuity reconcile **solo** si el Director lo manda tras cierre — no automático por SP01-01 |

---

## 16. Riesgos arquitectónicos

| ID | Riesgo |
|----|--------|
| **R-SP01-01** | Confundir SP01 con Hardening PROGRAM 01 |
| **R-SP01-02** | Reabrir CB construction bajo color Alive |
| **R-SP01-03** | Declarar Alive sin CAP-SP01-02/03 reales (solo UI) |
| **R-SP01-04** | Empujar Auth productiva / Supabase / Web como “necesarios” sin Mandate |
| **R-SP01-05** | Fusionar Decision Engine o Product en Factory para “completar” Alive |
| **R-SP01-06** | Tratar Slice B stub/staging residuals como producción Arizona |
| **R-SP01-07** | Usar SP01 para saltar a SP02…SP08 sin cierre |
| **R-SP01-08** | Inventar Implementation Plan dentro de esta Spec |

---

## 17. Riesgos expresamente prohibidos

Está **prohibido** asumir o ejecutar, bajo color SP01:

- Rediseño CB / OMC / FFO  
- Rewrite Hardening o P-INT  
- Mezcla ELR ↔ deals  
- Marketplace→Factory decision coupling  
- Factory→`access_tier`/pricing  
- Bypass Continuity §20/§21/§27/§28  
- Parallel Factory architecture  
- Claim de production launch Arizona o Scale Out  
- Autonomía de IA como autoridad de negocio  

---

## 18. Condiciones necesarias para iniciar SP02

Strategic Program 02 — **Arizona Alive** **no puede iniciarse** hasta que:

| # | Condición |
|---|-----------|
| 1 | SP01 declarado **COMPLETE** bajo §14–§15 |
| 2 | Evidencias §15 aceptadas (Audit PASS / PASS WITH OBSERVATIONS no bloqueantes) |
| 3 | Mandate Evolution Programs: orden secuencial respetado **o** excepción expresa del Director / dependencia técnica demostrable documentada |
| 4 | Continuity protocol para SP02 Discovery (o Spec) abierto **solo** tras cierre SP01 — SP01-01 **no** abre SP02 |
| 5 | Ningún residual bloqueante de SP01 reclamado como “se arreglará en Arizona” sin Disposition Director |

**SP02 no hereda** autorización de Supabase, Product, Marketplace, ni Hardening rewrite.

---

## Binding footer

```text
SP01-01 = CONSTITUCIÓN DE RESULTADO OPERATIVO DE STRATEGIC PROGRAM 01 — FACTORY ALIVE

DEFINES: what Factory Alive means as operable end-state
DOES NOT DEFINE: how to implement
DOES NOT AUTHORIZE: IMPL / Plan / commits / push / Web / Supabase / Product / Marketplace
DOES NOT REDEFINE: CB / P-INT / Hardening / Evolution Mandate

FACTORY ALIVE ≠ ARIZONA LAUNCH ≠ PRODUCT ≠ MARKETPLACE ≠ HARDENING PROGRAM 01
```

---

**END OF SP01-01 — OFFICIAL DISCOVERY SPECIFICATION**

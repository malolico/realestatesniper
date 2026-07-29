# STRATEGIC PROGRAM 01 — FACTORY ALIVE  
## SP01-02 — OFFICIAL IMPLEMENTATION PLAN  
### Organización de la implementación (PLAN ONLY)

| Campo | Valor |
|-------|-------|
| **Document ID** | `FACTORY_EVOLUTION_SP01_FACTORY_ALIVE_OFFICIAL_IMPLEMENTATION_PLAN.md` |
| **Path** | `docs/factory-construction/FACTORY_EVOLUTION_SP01_FACTORY_ALIVE_OFFICIAL_IMPLEMENTATION_PLAN.md` |
| **Nature** | Official Implementation Plan — **PLAN ONLY** · organiza bloques de implementación · **no** autoriza IMPL code · **no** contiene código ni APIs nuevas · **no** altera arquitectura |
| **Program** | **Strategic Program 01 — Factory Alive** |
| **Plan ID** | **SP01-02** |
| **Parent constitution** | `FACTORY_EVOLUTION_SP01_FACTORY_ALIVE_OFFICIAL_DISCOVERY_SPECIFICATION.md` (**SP01-01**) |
| **Parent strategic authority** | `FACTORY_EVOLUTION_PROGRAMS_DIRECTOR_STRATEGIC_MANDATE.md` |
| **Does not redefine** | Blueprint · CB · P-INT · Hardening · Evolution Mandate · CCD · Continuity · Master Plan · SP01-01 |
| **Does not open** | SP02 Arizona Alive · Product · Marketplace · Supabase · Web Stop Rule surfaces |
| **Date** | **2026-07-29** |
| **HEAD (context)** | `8cb5c2511dcdfe0c16f7a50d8c6eb5c1a3d5420f` |

---

## 0. Absolute Non-Authorization Banner

This Plan **organizes** how SP01 implementation work shall be sequenced and evidenced.

It does **not** authorize engineering IMPL, commits, push, new adapters, runners, Web, Supabase, Product, Marketplace, Arizona, Hardening rewrite, P-INT rewrite, or CB redesign.

| Surface | Under this Plan |
|---------|-----------------|
| Engineering IMPL / code changes | **NOT AUTHORIZED** until separate Director **IMPL Mandate** after Documentary Audit of this Plan |
| New APIs / endpoints / schemas | **PROHIBITED** in this Plan (none proposed) |
| Modification of CB-00…CB-19 semantics | **PROHIBITED** |
| Modification of Hardening PROGRAM 01/02 | **PROHIBITED** |
| Modification / reopen of P-INT as pending IMPL | **PROHIBITED** without new Mandate proving SP01 gap |
| Marketplace / Product / Arizona / Supabase | **PROHIBITED** |
| Opening SP02 | **PROHIBITED** |
| Continuity next-block selection | **NOT AUTHORIZED** by this Plan |
| Push / deploy / GitHub Actions | **NOT AUTHORIZED** |

```text
SP01-02 = ORGANIZATION OF IMPLEMENTATION
SP01-02 ≠ IMPL AUTHORIZATION
SP01-02 ≠ CODE
SP01-02 ≠ NEW APIs
SP01-02 ≠ SP02
```

**Normative sources (read-only):** Evolution Mandate; SP01-01; Blueprint; CB-00…CB-19; P-INT Statuses/Closeouts; CCD; Continuity; Master Plan §10 MVI; official architectural audits.

---

## 1. Objetivo general de implementación

Organizar la ejecución de Strategic Program 01 de modo que el **resultado operativo** definido en SP01-01 (§2, §7, §8, §14–§15) quede **demostrado, evidenciado y cerrado**, preferentemente mediante **prueba de satisfacción** sobre superficies ya FULLY CLOSED, y solo mediante IMPL de gaps **si** un Mandate posterior lo autoriza tras demostrar un hueco real contra CAP-SP01-01…07.

La implementación de SP01 es la **organización de verificación + cierre documental (+ gap-fill Mandated si aplica)** — no la reconstrucción de Factory ni la apertura de Arizona/Product/Marketplace.

---

## 2. Principios obligatorios

1. **SP01-01 prevalece** sobre este Plan en definición de resultado; este Plan solo organiza el *cómo se ordena el trabajo*.  
2. **Prove before change** — mapear evidencia existente antes de cualquier gap-fill.  
3. **No reopen CLOSED** — P-INT/Slice/Hardening/CB construction FULLY CLOSED no se reabren como pendientes SP01 sin gap demostrado + Mandate.  
4. **Adapters only if Mandated** — cualquier cambio futuro debe preservar semántica CB (Master Plan MVI-5); este Plan no diseña adapters.  
5. **Fail-closed / frontiers** — ELR ≠ deals; UI ≠ security; Factory ≠ Product/`access_tier`; Marketplace no decide vía Factory.  
6. **Continuity §27** — Discovery (SP01-01) → Plan (SP01-02) → Documentary Audit → Documentary Commit → **IMPL Mandate** (si hay gaps) → IMPL → Technical Audit → Status → Status Commit.  
7. **Staging ≠ production Auth / Arizona launch**.  
8. **No SP02** hasta SP01 COMPLETE.  
9. **No código / no pseudocódigo / no APIs nuevas** en este documento.  
10. **Hardening ≠ SP01** — numeración y planos distintos.

---

## 3. Dependencias

| Dependencia | Estado | Uso en SP01-02 |
|-------------|--------|----------------|
| SP01-01 Official Discovery Specification | Present (working tree) | Constitución de resultado |
| Evolution Programs Director Strategic Mandate | Present (working tree) | Autoridad estratégica SP01 |
| CB-00…CB-19 | Construction **COMPLETE** | Consumir; no reconstruir |
| Master Plan §10 MVI | Normative adjacency | Alineación CAP |
| P-INT-01 Slice A + Admin Live Wiring | **FULLY CLOSED** | Evidencia candidata CAP-SP01-01/06/07 |
| P-INT-01 Slice B | **FULLY CLOSED** (staging) | Evidencia candidata CAP-SP01-02 |
| CB-16 handoff capability (construction + Integration record) | Construction COMPLETE; Integration matrices Continuity | Evidencia candidata CAP-SP01-03 |
| P-INT-09 | **FULLY CLOSED** | Soporte no-mezcla dealPipeline / Marketplace coupling proofs |
| P-INT-10 | **FULLY CLOSED** | Canon gate — no reopen |
| P-INT-03 OBJECT STORE | **FULLY CLOSED** | ELR path; Cloud **out** of SP01 DoD |
| PROGRAM 01 Core Hardening | **COMPLETE** | Prerrequisito calidad; no identidad SP01 |
| Continuity protocol §27 / stop rules §20–§21 | Binding | Gates y exclusiones |
| Separate SP01 IMPL Mandate | **NOT ISSUED** | Requerido solo si hay gap-fill code |

---

## 4. Componentes que podrán intervenir

**Podrán intervenir** (como superficies **leídas / ejercidas / evidenciadas**, no redefinidas):

| Componente | Intervención permitida bajo organización SP01 |
|------------|-----------------------------------------------|
| CB-01 Registry / ELR | Verificación de verdad operativa |
| CB-15 Orchestration Bus | Verificación orquestación staging vía jobs |
| CB-16 Decision Handoff | Verificación export Package sin Decision Engine |
| CB-18 Governance reads | Verificación observe/madurez/compliance/drift |
| Factory Service Edge / Admin control plane (cerrados) | Ejercicio de observación autorizada |
| Job runner / Command Edge staging (Slice B cerrado) | Ejercicio de orquestación staging |
| Runners / Statuses / Closeouts existentes | Evidencia y regresión |
| Documentación SP01 Status / Audit (futura) | Cierre documental |

**Intervención de código (solo si Mandate IMPL posterior):** únicamente adapters/consumidores **sin** cambio de semántica CB — **no** especificados aquí; **no** autorizados por SP01-02.

---

## 5. Componentes expresamente prohibidos

| Prohibido | Motivo |
|-----------|--------|
| Modificar / reabrir CB construction | Construction COMPLETE; SP01-01 §10 |
| Modificar Hardening PROGRAM 01/02 | Mandate Evolution; SP01-01 |
| Modificar / redefinir P-INT | Mandate Evolution |
| Marketplace / Product / Decision Engine Product sovereignty | Exclusiones SP01 |
| Arizona Alive (SP02) surfaces as SP01 work | Order Mandate |
| Supabase / Web Stop Rule breach | Continuity §20–§21 |
| Cloud ELR / Dedicated DB / SQLite as SP01 DoD | Continuity residuals ≠ Alive mínimo |
| Auth productiva como requisito oculto de cierre | SP01-01 §2 / §13 |
| Nuevas APIs propuestas en este Plan | Restricción Director |
| Parallel architecture | CCD |

---

## 6. Orden oficial de implementación

```text
SP01-IB-01  Baseline & CAP Evidence Matrix
     ↓
SP01-IB-02  Observe Capability Proof (CAP-01, 06, 07)
     ↓
SP01-IB-03  Orchestrate Staging Proof (CAP-02)
     ↓
SP01-IB-04  Package Export Proof (CAP-03)
     ↓
SP01-IB-05  Marketplace Non-Coupling Proof (CAP-04)
     ↓
SP01-IB-06  CB Semantics Integrity Proof (CAP-05)
     ↓
SP01-IB-07  Official Operational Flow Demonstration (§8)
     ↓
SP01-IB-08  Gap Disposition (SATISFIED | MANDATE-REQUIRED)
     ↓
SP01-IB-09  [CONDITIONAL] Mandated Gap-Fill Execution
            (ONLY if IB-08 = MANDATE-REQUIRED AND IMPL Mandate issued)
     ↓
SP01-IB-10  Independent Technical Audit + SP01 Status COMPLETE
```

**Rules:**

- IB-01…IB-07 son **obligatorios** y preferentemente **documental/verificación**.  
- IB-08 es **obligatorio** y produce disposición formal.  
- IB-09 es **condicional** y **prohibido** sin IMPL Mandate explícito.  
- IB-10 es **obligatorio** para declarar SP01 COMPLETE.  
- No se salta IB-01…IB-07 hacia código.  
- No se abre SP02 desde ningún bloque.

---

## 7. Descomposición en Implementation Blocks

### SP01-IB-01 — Baseline & CAP Evidence Matrix

| Campo | Contenido |
|-------|-----------|
| **Identificador** | **SP01-IB-01** |
| **Objetivo** | Establecer matriz oficial CAP-SP01-01…07 → fuentes de evidencia candidatas (Statuses FULLY CLOSED, runners, audits) sin modificar código |
| **Alcance** | Inventario documental Continuity/P-INT/Hardening/CB; clasificación SATISFIED_CANDIDATE / UNKNOWN / GAP_SUSPECTED por CAP |
| **Dependencias** | SP01-01; Continuity; P-INT Statuses |
| **Evidencias esperadas** | Matriz CAP↔evidencia versionable; lista de bloques CLOSED citados; cero propuestas de API |
| **Criterios de cierre** | Matriz completa para CAP-01…07; firmada en Status de bloque o anexo SP01; ningún CLOSED reabierto |

---

### SP01-IB-02 — Observe Capability Proof

| Campo | Contenido |
|-------|-----------|
| **Identificador** | **SP01-IB-02** |
| **Objetivo** | Demostrar CAP-SP01-01, CAP-SP01-06, CAP-SP01-07 (observe gobernanza; Registry/ELR verdad; control plane separable) |
| **Alcance** | Ejecución/verificación de lecturas Admin/governance ya autorizadas; confirmación de no fusión Product/Marketplace |
| **Dependencias** | IB-01; Slice A / Admin Live Wiring Statuses (candidatos) |
| **Evidencias esperadas** | Registro de prueba observe (PASS/FAIL); citas a Status CLOSED si aplican; confirmación fronteras |
| **Criterios de cierre** | CAP-01/06/07 marcados PROVED o GAP documentado hacia IB-08 |

---

### SP01-IB-03 — Orchestrate Staging Proof

| Campo | Contenido |
|-------|-----------|
| **Identificador** | **SP01-IB-03** |
| **Objetivo** | Demostrar CAP-SP01-02 (orquestación staging vía job + CB-15; no orquestación en request Web) |
| **Alcance** | Ejercicio del régimen staging ya registrado (Slice B); verificación de no-web-orchestration |
| **Dependencias** | IB-01; Slice B Status |
| **Evidencias esperadas** | Prueba staging documentada; nota explícita staging ≠ Arizona production / Auth productiva |
| **Criterios de cierre** | CAP-02 PROVED o GAP → IB-08; sin reopen Slice B como pending IMPL salvo Mandate gap |

---

### SP01-IB-04 — Package Export Proof

| Campo | Contenido |
|-------|-----------|
| **Identificador** | **SP01-IB-04** |
| **Objetivo** | Demostrar CAP-SP01-03 (Decision Package CB-16 **sin** Decision Engine) |
| **Alcance** | Verificación de handoff/export Package; exclusión explícita de Decision Engine / Product tiering |
| **Dependencias** | IB-01; CB-16 construction COMPLETE; Integration/Continuity citations |
| **Evidencias esperadas** | Prueba de export/package path; declaración “Decision Engine NOT IN SP01” |
| **Criterios de cierre** | CAP-03 PROVED o GAP → IB-08 |

---

### SP01-IB-05 — Marketplace Non-Coupling Proof

| Campo | Contenido |
|-------|-----------|
| **Identificador** | **SP01-IB-05** |
| **Objetivo** | Demostrar CAP-SP01-04 / ACC-03 (Marketplace no llama Factory para decidir) |
| **Alcance** | Prueba documental/arquitectónica de no-acoplamiento; uso de fronteras Master Plan / P-INT-09 labeling donde aplique |
| **Dependencias** | IB-01; Master Plan §10 MVI-4; P-INT-09 Status |
| **Evidencias esperadas** | Informe de no-coupling; sin cambios Marketplace |
| **Criterios de cierre** | CAP-04 PROVED; **cero** modificaciones Marketplace |

---

### SP01-IB-06 — CB Semantics Integrity Proof

| Campo | Contenido |
|-------|-----------|
| **Identificador** | **SP01-IB-06** |
| **Objetivo** | Demostrar CAP-SP01-05 / ACC-04 (Alive no exige ni produce redesign semántico CB-00…19) |
| **Alcance** | Verificación de que el cierre SP01 no depende de mutar elrSchema/state machine/CB bodies constitucionales |
| **Dependencias** | IB-01…IB-05 resultados; Blueprint; construction ledger |
| **Evidencias esperadas** | Declaración de integridad CB; diff policy: semántica CB intacta |
| **Criterios de cierre** | CAP-05 PROVED; cualquier necesidad de cambio CB = **STOP** + Director (fuera de SP01) |

---

### SP01-IB-07 — Official Operational Flow Demonstration

| Campo | Contenido |
|-------|-----------|
| **Identificador** | **SP01-IB-07** |
| **Objetivo** | Demostrar el flujo SP01-01 §8 de extremo a extremo: Observe → Orchestrate staging → Package export → Marketplace non-coupling |
| **Alcance** | Demostración integrada de resultados IB-02…IB-05; régimen staging donde Continuity lo registre |
| **Dependencias** | IB-02…IB-06 |
| **Evidencias esperadas** | Acta de demostración del flujo §8; trazas/refs a evidencias por paso |
| **Criterios de cierre** | ACC-02 satisfecho o gaps consolidados para IB-08 |

---

### SP01-IB-08 — Gap Disposition

| Campo | Contenido |
|-------|-----------|
| **Identificador** | **SP01-IB-08** |
| **Objetivo** | Disponer formalmente: **ALL CAP SATISFIED** (cerrar hacia IB-10) **o** **MANDATE-REQUIRED** (lista de gaps contra SP01-01 sin diseñar solución) |
| **Alcance** | Solo disposición documental; **prohibido** inventar diseño técnico, APIs o path cloud |
| **Dependencias** | IB-01…IB-07 |
| **Evidencias esperadas** | Gap Disposition Record: por CAP → PROVED / GAP; si GAP: enunciado del déficit vs SP01-01 únicamente |
| **Criterios de cierre** | Disposición binaria emitida; si MANDATE-REQUIRED → **STOP IMPL** hasta Mandate; si SATISFIED → IB-09 **SKIPPED** |

---

### SP01-IB-09 — Mandated Gap-Fill Execution (CONDITIONAL)

| Campo | Contenido |
|-------|-----------|
| **Identificador** | **SP01-IB-09** |
| **Objetivo** | Ejecutar **únicamente** el gap-fill autorizado por un **IMPL Mandate** posterior, limitado a adapters/consumidores sin cambio semántico CB |
| **Alcance** | El que el Mandate enumere explícitamente; **no** ampliable por este Plan; **no** APIs inventadas aquí |
| **Dependencias** | IB-08 = MANDATE-REQUIRED; Documentary Audit PASS de este Plan; **IMPL Mandate emitido**; Continuity §27 gates |
| **Evidencias esperadas** | Mandate ID; Implementation Commit SHA(s); runners; fronteras intactas |
| **Criterios de cierre** | Gaps Mandated cerrados; CAP afectados → PROVED; semántica CB intacta; exclusiones SP01 intactas |

**If IB-08 = ALL CAP SATISFIED:** mark IB-09 **NOT APPLICABLE / SKIPPED**.

---

### SP01-IB-10 — Independent Technical Audit + SP01 Status COMPLETE

| Campo | Contenido |
|-------|-----------|
| **Identificador** | **SP01-IB-10** |
| **Objetivo** | Cerrar SP01 documentalmente: Audit + Status COMPLETE + evidencias SP01-01 §15 |
| **Alcance** | Independent Technical Audit; SP01 Impl/Program Status; checklist ACC-01…08; confirmación exclusiones; **no** Continuity reconcile salvo Mandate Director |
| **Dependencias** | IB-08 SATISFIED **o** IB-09 CLOSED |
| **Evidencias esperadas** | Audit verdict; Status SP01 COMPLETE; mapa CAP→evidencia final; binding “SP02 NOT OPENED” |
| **Criterios de cierre** | ACC-01…08 verdaderos; Audit PASS o PASS WITH OBSERVATIONS no bloqueantes; SP01 COMPLETE declarado |

---

## 8. Estrategia de validación

| Principio | Aplicación |
|-----------|------------|
| Validar contra SP01-01 CAP/ACC | Única verdad de aceptación |
| Preferir evidencia CLOSED existente | Evitar IMPL innecesario |
| Staging explícito | No reclamar production Auth / Arizona |
| Fail-closed | Fallo de CAP = GAP, no silent pass |
| No validar Product/Marketplace/SP02 | Fuera de alcance |
| Runners existentes primero | No inventar suites en este Plan; Mandate podrá exigir runners si gap-fill |

**Validation sequence:** IB-01 matrix → per-CAP proofs (IB-02…06) → integrated flow (IB-07) → disposition (IB-08) → conditional fill (IB-09) → audit (IB-10).

---

## 9. Estrategia de auditoría

| Gate | Momento | Modo |
|------|---------|------|
| Documentary Audit of **SP01-02** | Antes de Documentary Commit del Plan | READ ONLY |
| Pre-IMPL Audit (si IB-09) | Tras IMPL Mandate, antes de código | Scope Mandate only |
| Independent Technical Audit SP01 | IB-10 | Programa completo vs SP01-01 |
| Status Audit | Tras Status SP01 | Documental |

Auditorías **no** reabren CB/Hardening/P-INT. Observaciones no bloqueantes se registran; bloqueantes detienen COMPLETE.

---

## 10. Estrategia de regresión

| Superficie | Regresión obligatoria al cierre SP01 / tras IB-09 |
|------------|--------------------------------------------------|
| CB construction validators relevantes (dry-run / existing runners) | Confirmar no rotura semántica |
| P-INT-01 Slice A / Admin / Slice B validation runners existentes | Si se tocó cualquier adapter bajo Mandate |
| P-INT-10 CI Canon Gate runner | Si Mandate tocó superficies de gate (por defecto: **no tocar**) |
| P-INT-09 labeling / frontier docs | Confirmar no-mezcla intacta |
| Diff policy | `src/factory/**` semantics: **no redesign**; cualquier diff CB requiere STOP |

Si IB-09 SKIPPED: regresión = **prueba de no-cambio** + re-ejecución selectiva de runners de evidencia citados en la matriz.

---

## 11. Riesgos

| ID | Riesgo |
|----|--------|
| **R-PLAN-01** | Tratar este Plan como autorización de IMPL |
| **R-PLAN-02** | Reabrir P-INT/Slice CLOSED sin gap real |
| **R-PLAN-03** | Declarar CAP PROVED solo con UI / narrativa |
| **R-PLAN-04** | Introducir Auth productiva / Supabase / Web “para Alive” |
| **R-PLAN-05** | Diseñar APIs nuevas dentro del Plan |
| **R-PLAN-06** | Confundir staging Slice B con Arizona Alive |
| **R-PLAN-07** | Abrir SP02 antes de IB-10 COMPLETE |
| **R-PLAN-08** | Confundir SP01 con Hardening PROGRAM 01 |
| **R-PLAN-09** | Usar Cloud ELR residual como DoD SP01 |

---

## 12. Mitigaciones

| Riesgo | Mitigación |
|--------|------------|
| R-PLAN-01 | Banner §0; IMPL solo con Mandate |
| R-PLAN-02 | IB-01/IB-08 exigen gap vs SP01-01 antes de Mandate |
| R-PLAN-03 | IB-02…07 exigen prueba ejercitable + evidencia referenciable |
| R-PLAN-04 | §5 prohibiciones; SP01-01 exclusiones |
| R-PLAN-05 | Restricción Director; §0 PROHIBITED |
| R-PLAN-06 | Notas staging en IB-03/IB-07; SP02 prohibido |
| R-PLAN-07 | IB-10 binding; Mandate order |
| R-PLAN-08 | Principio §2.10; naming Strategic vs Hardening |
| R-PLAN-09 | Dependencias §3; Cloud out of DoD |

---

## 13. Criterios para declarar SP01 COMPLETE

SP01 se declara **COMPLETE** solo cuando **todos** son verdaderos:

| # | Criterio |
|---|----------|
| 1 | SP01-01 ACC-01…08 satisfechos |
| 2 | CAP-SP01-01…07 PROVED (vía IB-02…IB-07 y, si aplica, IB-09) |
| 3 | Flujo SP01-01 §8 demostrado (IB-07) |
| 4 | IB-08 = ALL CAP SATISFIED **o** IB-09 CLOSED bajo Mandate |
| 5 | IB-09 SKIPPED o ejecutado **sin** semántica CB alterada |
| 6 | Exclusiones SP01-01 §6 confirmadas (no Product/Marketplace/Arizona/SP02…08/Supabase breach) |
| 7 | Independent Technical Audit PASS o PASS WITH OBSERVATIONS no bloqueantes (IB-10) |
| 8 | Status documental SP01 COMPLETE emitido |
| 9 | Evidencias SP01-01 §15 archivadas |
| 10 | SP02 **NOT OPENED** por este cierre |

```text
SP01 COMPLETE
  ⇒ Factory Alive operational end-state demonstrated
  ≠ Arizona Alive started
  ≠ IMPL authorized by SP01-02 alone
  ≠ CB / Hardening / P-INT redefined
```

---

## Protocol position (Continuity §27)

```text
1. Discovery Specification SP01-01     → EXISTS (constitution)
2. Implementation Plan SP01-02         → THIS DOCUMENT (PLAN ONLY)
3. Documentary Audit of Plan           → NEXT (not done by this file)
4. Documentary Commit                  → NOT DONE / NOT AUTHORIZED here
5. IMPL Mandate (only if IB-08 gaps)   → NOT ISSUED
6. Implementation                      → NOT AUTHORIZED by this Plan
7. Technical Audit + Status COMPLETE   → IB-10 (future)
8. SP02                                → NOT OPENED
```

---

## Binding footer

```text
SP01-02 — OFFICIAL IMPLEMENTATION PLAN
STATUS: PLAN ONLY — DOCUMENTATION ONLY
NO CODE · NO PSEUDOCODE · NO NEW APIs
NO CB / HARDENING / P-INT / PRODUCT / MARKETPLACE / ARIZONA / SUPABASE MODIFICATION
NO SP02
ORGANIZES BLOCKS SP01-IB-01 … SP01-IB-10
IMPL REQUIRES SEPARATE DIRECTOR MANDATE AFTER AUDIT (IF GAPS)
```

---

**END OF SP01-02 — OFFICIAL IMPLEMENTATION PLAN**

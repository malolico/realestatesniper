# FACTORY 2.0 CONSTRUCTION BLUEPRINT

**Plan Maestro de Construcción — Fase IV RealEstateSniper Factory 2.0**

**Autoridad:** Primer documento oficial de la **Fase IV — Construcción**. Deriva obligatoriamente de los **19 documentos constitucionales** aprobados de la Auditoría Maestra, con supremacía de **FULL FACTORY ORCHESTRATION ARCHITECTURE** como Constitución Operativa.  
**Alcance:** Definir el **orden exacto de construcción** de Factory 2.0 — desde cimientos hasta Factory operativa completa.  
**Exclusión expresa:** Arquitectura nueva, rediseño constitucional, código, APIs, proveedores, Decision-Diamond internals, Marketplace UX, pricing y `access_tier`.

**Pregunta rectora:**

> *¿En qué orden exacto se construye Factory 2.0 para obedecer la Constitución aprobada sin improvisar, sin saltar dependencias y sin confundir construcción con diseño?*

---

## Declaración de Director de Producción

| Principio | Enunciado |
|-----------|-----------|
| **Constitución cerrada** | MPI · DKN · DDI · DSO · FCC · OMC · OLC · OSC · IGA · OAC · FFO — **no se debaten** |
| **Este documento** | Solo define **secuencia de construcción** |
| **Cada fase** | Produce un **artefacto verificable** antes de avanzar |
| **P-CONST** | Precedencia operativa P0→P9 en todo conflicto de recursos |
| **Frontera Factory** | Construcción termina en handoff **ST-RDY → ST-DEC** |

---

## Índice maestro de fases

| Fase | Nombre | Prioridad P-CONST |
|------|--------|-------------------|
| **CB-00** | Anclaje constitucional y entorno de construcción | — |
| **CB-01** | Factory Registry y Expediente Ledger (ELR) | P1 |
| **CB-02** | Capa de fuentes y organismos (DSO) | P0 |
| **CB-03** | Compliance Gate (MOT-CMP + LOOP-XVR-CMP) | **P0** |
| **CB-04** | Motor Runtime — núcleo de ejecución | P1 |
| **CB-05** | Capa Fundación — motores y loops | P1 |
| **CB-06** | Evidence Service (MOT-EVD-01/02) | **P3** |
| **CB-07** | Capa Legitimidad — motores y loops | P4 |
| **CB-08** | Capa Distress — motores y loops | P5 |
| **CB-09** | Capa Economía — motores y loops | P6 |
| **CB-10** | Capa Entorno — motores y loops | P8 |
| **CB-11** | Loop Engine completo (24 LOOP) | P1–P9 |
| **CB-12** | Swarm Coordinator (14 SWM) | Derivado |
| **CB-13** | Capa Inteligencia — motores y loops | P7 |
| **CB-14** | AI Assist Layer (26 AIA) | Subordinada |
| **CB-15** | Orchestration Bus (FFO) | Integración |
| **CB-16** | Decision Handoff Interface | Frontera |
| **CB-17** | Watch, Update, Archive y Retirada | Post-producto |
| **CB-18** | Governance Dashboard | Transversal |
| **CB-19** | Validación end-to-end y cierre Factory | Cierre |

```text
CB-00 → CB-01 → CB-02 → CB-03 → CB-04
                              ↓
                    CB-05 → CB-06
                              ↓
              CB-07 → CB-08 → CB-09 → CB-10
                              ↓
         CB-11 (paralelizable por ámbito tras CB-05..10 motores base)
                              ↓
                    CB-12 → CB-13
                              ↓
              CB-14 → CB-15 → CB-16 → CB-17 → CB-18 → CB-19
```

---

# CB-00 — Anclaje constitucional y entorno de construcción

## Objetivo

Establecer el marco de construcción sometido a la Constitución aprobada — sin reinterpretarla.

## Qué se construye

- **Constitutional Binding Pack** — referencia indexada a los 19 documentos oficiales (solo lectura).
- **Vocabulario operativo** — registro de códigos canónicos: `factory_key`, `ST-*`, `MOT-*`, `LOOP-*`, `SWM-*`, `AIA-*`, `CAP-*`, `E0–E4`, `C1–C5`.
- **Construction Governance** — reglas de avance: ninguna fase CB-N+1 sin cierre CB-N.
- **Canon Compliance Checklist** — lista de verificación derivada de FFO §XII.2 y LFF.

## Dependencias

- Auditoría Maestra aprobada (19 documentos).
- FFO como Constitución Operativa definitiva.

## Resultado esperado

Entorno de construcción donde **todo equipo** puede verificar que un artefacto obedece el canon antes de integrarlo.

## Criterio de terminación

- [ ] Los 19 documentos constitucionales están referenciados e indexados.
- [ ] Existe checklist de compliance canon vigente.
- [ ] Regla explícita: **prohibido** introducir actores fuera de catálogo (OMC, OLC, OSC, OAC).
- [ ] Director de Producción firma anclaje — construcción autorizada.

---

# CB-01 — Factory Registry y Expediente Ledger (ELR)

## Objetivo

Construir la unidad de orquestación: el expediente anclado a `factory_key` con trazabilidad ELR.

## Qué se construye

- **Factory Registry** — alta, consulta y ciclo de vida de expedientes.
- **Estados ST-*** — máquina de estados constitucional (ST-NASC → ST-RET).
- **Expediente Lineage Record (ELR)** — estructura TRZ-01: transiciones, manifests, ledgers, handoffs.
- **factory_key** — resolución provisional y definitiva (pre-MOT-IDN-01).
- **Retention policy** — vida expediente + 7 años (FFO-14).

## Dependencias

- CB-00.

## Resultado esperado

Todo acto Factory futuro puede registrarse contra un `factory_key` con historial inmutable.

## Criterio de terminación

- [ ] Crear expediente → `ST-NASC` registrado en ELR.
- [ ] Transición de estado requiere entrada ELR — sin entrada = acción inexistente (TRZ-01).
- [ ] Consulta lineage completa por `factory_key`.
- [ ] Política retención 7 años definida y aplicable.

---

# CB-02 — Capa de fuentes y organismos (DSO)

## Objetivo

Construir la infraestructura de procedencia — toda ingestión obedece Sources Architecture.

## Qué se construye

- **Source Registry** — catálogo de organismos y tipologías DSO.
- **Ingestion Legitimacy Gate** — validación procedencia antes de motor.
- **Freshness metadata** — SLA y vintage por familia de fuente (LS-10).
- **PII / compliance flags** — canal de autorización contacto.
- **Source-to-DDI mapping** — qué fuentes alimentan qué elementos (sin expandir DDI).

## Dependencias

- CB-00, CB-01.

## Resultado esperado

Ningún dato entra a Factory sin procedencia declarada, frescura y clasificación DSO.

## Criterio de terminación

- [ ] Toda ingestión produce `source_ref` trazable.
- [ ] Fuente prohibida o irregular **rechazada** — no entra (compliance antes que velocidad).
- [ ] Conflicto de fuentes **no promedia** — deriva a Evidence (CB-06).
- [ ] Mapeo DSO → DDI verificable para capas 1–2 como piloto.

---

# CB-03 — Compliance Gate (MOT-CMP + LOOP-XVR-CMP)

## Objetivo

Implementar **P0** — veto compliance antes de cualquier producción.

## Qué se construye

- **MOT-CMP-01** — Factory Compliance Gate Motor (primera instancia motor).
- **LOOP-XVR-CMP-01** — supervisión compliance transversal.
- **Clearance protocol** — NASC-01: sin clearance, no expediente productivo.
- **BLOCK suspend** — LK-02: CMP BLOCK suspende todos los locks.

## Dependencias

- CB-01, CB-02, CB-04 (runtime mínimo para ejecutar MOT-CMP-01).

## Resultado esperado

Ningún motor, loop ni ingestión opera sin clearance P0.

## Criterio de terminación

- [ ] Expediente sin MOT-CMP-01 clearance permanece en `ST-NASC` — no avanza a `ST-PROD`.
- [ ] LOOP-XVR-CMP-01 puede emitir BLOCK y suspender locks.
- [ ] Violación compliance registrada en ELR.
- [ ] P0 verificado en checklist canon.

---

# CB-04 — Motor Runtime — núcleo de ejecución

## Objetivo

Construir el runtime que ejecuta motores según OMC — manifests, dependencias DEP-01..08, locks.

## Qué se construye

- **Motor Runtime** — invocación, scheduling y lifecycle MOT-*.
- **Motor Manifest** — registro por ejecución: inputs, outputs, deltas, timestamps.
- **Dependency resolver** — hard/soft deps OMC (DEP-01..08).
- **Motor lock protocol** — LK-01: un motor, un re-ejecutor activo.
- **CAP binding** — todo motor enlazado a CAP padre FCC.

## Dependencias

- CB-00, CB-01, CB-02.

## Resultado esperado

Cualquier motor catalogado puede ejecutarse con manifest y dependencias respetadas.

## Criterio de terminación

- [ ] Ejecución MOT produce manifest en ELR.
- [ ] DEP-01 enforced: Capa 3+ bloqueada sin MOT-IDN-01.
- [ ] LK-01 operativo.
- [ ] Motor sin CAP padre **rechazado** en runtime.

---

# CB-05 — Capa Fundación — motores y loops

## Objetivo

Construir **P1** — identidad, localización y características físicas.

## Qué se construye

**Motores (Capa A — FND):**

| Motor | Misión |
|-------|--------|
| MOT-IDN-01 | Parcel Identity Resolver |
| MOT-IDN-02 | Identity Cross-Source Reconciler |
| MOT-LOC-01 | Geospatial Anchor Motor |
| MOT-LOC-02 | Jurisdiction Boundary Resolver |
| MOT-PHY-01 | Physical Characteristics Motor |
| MOT-PHY-02 | Structure & Improvement Profiler |

**Loops:**

| Loop | Misión |
|------|--------|
| LOOP-FND-SUP-01 | Foundation Layer Quality Loop |
| LOOP-FND-FRS-01 | Foundation Freshness Guardian Loop |

- Transiciones: `ST-NASC` → `ST-IDN` → `ST-PROD` (fundación).

## Dependencias

- CB-03 (P0), CB-04, CB-02.

## Resultado esperado

`factory_key` resuelto C1–C2; dominios MPI 01–03 con producción verificable.

## Criterio de terminación

- [ ] MOT-IDN-01 resuelve identidad — DEP-01 satisfecho para capas superiores.
- [ ] LOOP-FND-SUP-01 y LOOP-FND-FRS-01 operativos con handoff FIN-S hacia LEG.
- [ ] Dominios MPI 01–03 alcanzables con manifests y source_refs.
- [ ] Identidad conflictiva deriva a Evidence (CB-06) o SWM (CB-12) según STR.

---

# CB-06 — Evidence Service (MOT-EVD-01/02)

## Objetivo

Construir **P3** — árbitro probatorio de toda producción Factory.

## Qué se construye

- **MOT-EVD-01** — Evidence Registry Motor (E0–E4, C1–C5, sufficiency).
- **MOT-EVD-02** — Conflict Arbitration Motor.
- **Evidence intercept** — toda salida material motor → evidence_ref (EVF-01).
- **Sufficiency gates** — bloqueo ST-RDY si fail (EVF-05).
- **Conflict ladder** — L1 MOT-VER → L4 MOT-EVD-02 → L5 Council.

## Dependencias

- CB-04, CB-05 (producción mínima para registrar evidencia).

## Resultado esperado

Todo conocimiento Factory tiene nivel E/C asignado y sufficiency evaluable.

## Criterio de terminación

- [ ] 100% deltas materiales de CB-05 registrados en MOT-EVD-01.
- [ ] Conflicto multi-fuente resuelto por jerarquía — sin promedio (LS-09).
- [ ] Sufficiency PASS/FAIL reproducible por `factory_key`.
- [ ] IA assist marcada E1/E2 máximo — nunca eleva sin motor (EVF-02).

---

# CB-07 — Capa Legitimidad — motores y loops

## Objetivo

Construir **P4** — marco legal, titularidad, gravámenes y documentación.

## Qué se construye

**Motores (Capa B — LEG):**

| Motor | CAP |
|-------|-----|
| MOT-REG-01/02 | CAP-04 |
| MOT-LEG-01/02 | CAP-04 |
| MOT-OWN-01/02 | CAP-05 |
| MOT-LIEN-01/02 | CAP-06 |
| MOT-OCR-01/02 | CAP-07 |

**Loops:**

| Loop | Misión |
|------|--------|
| LOOP-LEG-SUP-01 | Legitimacy Layer Quality Loop |
| LOOP-LEG-GAP-01 | Legitimacy Gap Closure Loop |
| LOOP-LEG-EVD-01 | Legitimacy Evidence Challenge Loop |
| LOOP-XVR-EVD-01 | Cross-layer Evidence Loop (transversal) |

## Dependencias

- CB-05 (FND FIN-S), CB-06, CB-04.

## Resultado esperado

Cadena registral, ownership y liens producidos con blockers C1 identificados.

## Criterio de terminación

- [ ] Handoff FND-SUP → LEG-SUP completado.
- [ ] Blockers Obl. DDI Parte II identificados o resueltos.
- [ ] LOOP-LEG-EVD-01 puede escalar a SWM-EVD si conflicto multi-dominio.
- [ ] Transfer assessment complete — habilita DST (CB-08).

---

# CB-08 — Capa Distress — motores y loops

## Objetivo

Construir **P5** — motivación, contactabilidad, distress auténtico y procedimientos.

## Qué se construye

**Motores (Capa C — DST):**

| Motor | CAP |
|-------|-----|
| MOT-MOT-01/02 | CAP-08 |
| MOT-CNT-01/02 | CAP-09 |
| MOT-CHR-01/02 | CAP-10 |
| MOT-JUD-01/02 | CAP-11 |
| MOT-LFE-01..04 | CAP-12 |
| MOT-COD-01 | CAP-26 |

**Loops:**

| Loop | Misión |
|------|--------|
| LOOP-DST-CNT-01 | Contactability Loop |
| LOOP-DST-CVG-01 | Motivation Convergence Loop |
| LOOP-DST-SUP-01 | Distress Layer Quality Loop |
| LOOP-DST-INV-01 | Distress Investigation Loop |
| LOOP-XVR-CHR-01 | Cross-proceeding Timeline Loop |

## Dependencias

- CB-07 (legitimidad), CB-03 (MOT-CNT requiere MOT-CMP-01), CB-06.

## Resultado esperado

Señales distress auténticas con contactabilidad compliance-gated.

## Criterio de terminación

- [ ] MOT-CNT-01 solo opera con MOT-CMP-01 clearance (DEP-06).
- [ ] LOOP-DST-CVG-01 puede declarar motivation sufficient o agotada.
- [ ] STR-6 deriva a Swarm Coordinator (CB-12).
- [ ] Dominios MPI distress (08–12, 16–19, 26) alcanzables.

---

# CB-09 — Capa Economía — motores y loops

## Objetivo

Construir **P6** — finanzas, riesgos, mercado, valoración e inversión.

## Qué se construye

**Motores (Capa D — ECO):**

| Motor | CAP |
|-------|-----|
| MOT-FIN-01/02 | CAP-13 |
| MOT-HAZ-01/02 | CAP-14 |
| MOT-MKT-01..03 | CAP-15 |
| MOT-INV-01/02 | CAP-16 |

**Loops:**

| Loop | Misión |
|------|--------|
| LOOP-ECO-SUP-01 | Economy Layer Supervisor Loop |
| LOOP-ECO-FRS-01 | Economy Freshness Loop |
| LOOP-ECO-QLT-01 | Valuation Quality Loop |
| LOOP-ECO-QLT-02 | Investment Strategy Loop |
| LOOP-ECO-FRS-02 | Market Signal Freshness Loop |

## Dependencias

- CB-05 (IDN, PHY), CB-06, CB-07 (soft), CB-04.

## Resultado esperado

Valoración, comparables y estrategias de inversión con frescura mercado gobernada.

## Criterio de terminación

- [ ] LOOP-ECO-SUP-01 coordina sub-loops sin violar LK-04.
- [ ] Handoff ECO → INT-RDY habilitado.
- [ ] Dominios MPI 21–25, 27–32 cubiertos.
- [ ] Derivación SWM valuation/investment operativa (CB-12).

---

# CB-10 — Capa Entorno — motores y loops

## Objetivo

Construir **P8** — contexto, habitabilidad y entorno estratégico.

## Qué se construye

**Motores (Capa E — ENV):**

| Motor | CAP |
|-------|-----|
| MOT-CTX-01/02 | CAP-17 |
| MOT-LIV-01/02 | CAP-18 |
| MOT-FUT-01/02 | CAP-19 |

**Loops:**

| Loop | Misión |
|------|--------|
| LOOP-ENV-SUP-01 | Environment Layer Quality Loop |
| LOOP-ENV-FRS-01 | Environment Freshness Loop |

## Dependencias

- CB-05 (LOC), CB-04, CB-06.

## Resultado esperado

Contexto territorial y entorno estratégico con vintage census gobernado.

## Criterio de terminación

- [ ] Dominios MPI 33–37 cubiertos.
- [ ] LOOP-ENV-FRS-01 renueva contexto según SLA DSO.
- [ ] Handoff ENV integrado en pipeline OLC §IV.1.

---

# CB-11 — Loop Engine completo (24 LOOP)

## Objetivo

Construir el motor de perfeccionamiento permanente — los 24 loops OLC.

## Qué se construye

- **Loop Engine** — activadores ACT-T/E/V/D/M/C/R (MLA).
- **STR escalation** — STR-1..6 con derivación SWM en STR-6.
- **Loop Ledger** — decisiones, re-ejecuciones, agotamiento FIN-X.
- **Locks LK-01..04** — integrados con Motor Runtime.
- **Pipeline OLC §IV.1** — orden canónico completo:

```text
LOOP-XVR-CMP-01 → FND → LEG → DST → ECO → ENV → INT
```

- **24 instancias LOOP** — todas las entradas OLC catalogadas.

## Dependencias

- CB-05..10 (motores base por ámbito).
- CB-04, CB-06, CB-03.

## Resultado esperado

Perfeccionamiento continuo sin confundir loop con reintento técnico.

## Criterio de terminación

- [ ] 24/24 loops registrados y ejecutables.
- [ ] 52/52 motores con ≥1 loop supervisor (LLK-06).
- [ ] 26/26 CAPs con ≥1 loop (OLC cobertura).
- [ ] Handoffs OLC §IV.3 reproducibles end-to-end.
- [ ] LK-01..04 verificados bajo stress de concurrencia.

---

# CB-12 — Swarm Coordinator (14 SWM)

## Objetivo

Construir resolución temporal multi-actor — 14 patrones OSC.

## Qué se construye

- **Swarm Coordinator** — SWA-IN / SWA-OUT / DIE-* lifecycle.
- **Mission Ledger** — swarm_id vinculado a ELR (EVF-04).
- **CS / US** — convergence state / unresolved state (MSA).
- **14 patrones SWM** — instancias OSC catalogadas.
- **Derivación desde Loop** — 13 patrones OLC §V — Loop solo deriva, no ejecuta.

## Dependencias

- CB-11 (loops derivan), CB-04, CB-06.

## Resultado esperado

Complejidad PRB-00 resuelta temporalmente sin permanentizar enjambres.

## Criterio de terminación

- [ ] 14/14 SWM registrados.
- [ ] Ciclo SWA-IN → coordinación MOT → SWA-OUT → DIE-* → retorno Loop verificado.
- [ ] Enjambre muere al cerrar misión — no persiste como actor.
- [ ] Ningún SWM usurpa MOT, LOOP ni Decision.

---

# CB-13 — Capa Inteligencia — motores y loops

## Objetivo

Construir **P7** — síntesis, readiness, comunicación ejecutiva y preparación Decision.

## Qué se construye

**Motores (Capa F — INT):**

| Motor | CAP | Misión |
|-------|-----|--------|
| MOT-SYN-01 | CAP-22 | Knowledge Convergence |
| MOT-SYN-02 | CAP-22 | Decision Readiness Validator |
| MOT-DCN-01 | CAP-23 | Decision Corpus Assembler |
| MOT-COM-01 | CAP-24 | Release Matrix Motor |
| MOT-EXE-01 | CAP-21 | Executive IC Memo Motor |

**Loops:**

| Loop | Misión |
|------|--------|
| LOOP-INT-EVD-01 | Intelligence Evidence Sufficiency Loop |
| LOOP-INT-RDY-01 | Decision Readiness Loop |
| LOOP-INT-GAP-01 | Negotiation Gap Loop |
| LOOP-INT-QLT-01 | Intelligence Quality Loop |
| LOOP-INT-FRS-01 | Executive Freshness Loop |

- **Gates G0–G6** — implementación verificable de readiness FFO §III.7.

## Dependencias

- CB-06 (EVD sufficiency), CB-07..10 (capas producidas), CB-11.

## Resultado esperado

Expediente alcanza `ST-RDY` con corpus Decision-ready.

## Criterio de terminación

- [ ] MOT-SYN-02 PASS reproduce gates G0–G6.
- [ ] MOT-SYN-01 integra sin elevar E (EVF pipeline).
- [ ] LOOP-INT-RDY-01 FIN-S habilita handoff CB-16.
- [ ] Known unknowns Obl. declarados según DKN.
- [ ] `ST-CONS` → `ST-RDY` transición verificada en ELR.

---

# CB-14 — AI Assist Layer (26 AIA)

## Objetivo

Construir asistencia IA subordinada — invocable, auditable, sustituible.

## Qué se construye

- **AIA Invocation Gateway** — solo AIA catalogadas OAC.
- **RLG (Reasoning Ledger)** — toda invocación registrada (IGA).
- **AUT-0/1/2 enforcement** — niveles autoridad según OAC.
- **SLOT neutrality** — 10 ranuras modelo sin vendor lock.
- **PRH compliance** — 15 prohibiciones IGA — cero violaciones.
- **26 instancias AIA** — todas las entradas OAC.

## Dependencias

- CB-04, CB-11 (invocadores MOT/LOOP/SWM operativos).
- CB-06 (EVD marca assist E1/E2).

## Resultado esperado

IA asiste producción y perfeccionamiento — nunca decide ni eleva C1.

## Criterio de terminación

- [ ] 26/26 AIA invocables por actor autorizado.
- [ ] PRH zero — ninguna violación en auditoría piloto.
- [ ] RLG 100% invocaciones registradas.
- [ ] AIA clase X ausente de producción (OAC-04).
- [ ] Dual-run C validado para ≥1 SLOT sustitución.

---

# CB-15 — Orchestration Bus (FFO)

## Objetivo

Integrar todas las capas bajo la Constitución Operativa FFO.

## Qué se construye

- **Orchestration Bus** — pipeline capas A→F con P-CONST P0→P9.
- **State orchestrator** — transiciones ST-* automáticas y gobernadas.
- **Handoff manager** — OLC §IV.3 + FFO §IV.
- **ELR aggregator** — unificación manifests, loops, swarms, AIA, EVD.
- **Anti-degradation scheduler** — FRS, compliance watch, ACT-V.

## Dependencias

- CB-01..14 completos.

## Resultado esperado

Factory opera como sistema unificado desde nacimiento hasta `ST-RDY`.

## Criterio de terminación

- [ ] Pipeline completo CB-03 → CB-13 ejecutable sobre expediente piloto.
- [ ] P-CONST respetado bajo conflicto de recursos.
- [ ] 16 estados ST-* transitables según reglas FFO §II.3.
- [ ] Ningún actor fuera de catálogo en bus.
- [ ] `maturity_score` calculable por expediente.

---

# CB-16 — Decision Handoff Interface

## Objetivo

Construir la frontera soberana Factory → Decision.

## Qué se construye

- **Decision Handoff Interface** — corpus ST-RDY → Decision.
- **Handoff package** — MOT-DCN-01 + MOT-EXE-01 + EVD registry slice + ELR export.
- **ST-RDY → ST-DEC** — transición registrada; Factory pausa decisión comercial.
- **Freeze protocol** — post-handoff Factory no modifica thesis Decision.

## Dependencias

- CB-13 (readiness PASS), CB-15, CB-06.

## Resultado esperado

Decision recibe corpus calibrado; Factory no cruza frontera (FFO-06, LFF-07).

## Criterio de terminación

- [ ] Handoff solo si G0–G6 PASS.
- [ ] `decision_handoffs[]` en ELR completo.
- [ ] Factory no asigna `access_tier` ni pricing.
- [ ] Projection y Product Catalog **no** construidos aquí — consumen aguas abajo.

---

# CB-17 — Watch, Update, Archive y Retirada

## Objetivo

Construir ciclo post-Decision y post-Marketplace.

## Qué se construye

- **Watch mode** — `ST-MON` con LOOP-FRS mínimo y MOT-CHR event watch.
- **Update cycle** — `ST-UPD` → re-perfeccionamiento loops relevantes.
- **Reopen protocol** — REO-01: historial preservado.
- **Archive** — `ST-ARC` read-only ledgers.
- **Retirement** — `ST-RET` cierre ELR definitivo.

## Dependencias

- CB-15, CB-16 (handoff completado en expedientes piloto).

## Resultado esperado

Factory no abandona activo tras Marketplace — mantiene watch y actualización.

## Criterio de terminación

- [ ] ACT-V material reabre expediente sin borrar historial.
- [ ] ST-MON → ST-UPD → ST-PERF ciclo verificado.
- [ ] ST-ARC preserva ledgers 7 años.
- [ ] ST-RET requiere acta governance.

---

# CB-18 — Governance Dashboard

## Objetivo

Visibilidad operativa de madurez, compliance y salud Factory.

## Qué se construye

- **Governance Dashboard** — métricas PP, LFF, P-CONST.
- **Maturity metrics** — completeness DDI, C global, sufficiency, readiness.
- **Compliance panel** — P0 status, PRH violations, CMP blocks.
- **Coverage panel** — motores, loops, swarms, AIA por expediente.
- **Canon drift detector** — alerta si implementación introduce actor no catalogado.

## Dependencias

- CB-15 (datos operativos), CB-01 (ELR).

## Resultado esperado

Director de Producción y governance pueden auditar Factory sin inspección manual de logs.

## Criterio de terminación

- [ ] Dashboard refleja estado real de expedientes piloto.
- [ ] Alertas compliance y PRH operativas.
- [ ] Métricas G0–G6 reproducibles desde UI/report.
- [ ] Canon drift = bloqueo de despliegue.

---

# CB-19 — Validación end-to-end y cierre Factory

## Objetivo

Demostrar Factory 2.0 completa — constitucionalmente obediente de punta a punta.

## Qué se construye

- **E2E Test Suite (conceptual)** — expediente piloto: NASC → RDY → DEC handoff → MON → ARC.
- **Canon Compliance Report** — verificación contra 19 documentos.
- **Factory Completion Certificate** — acta Director de Producción.
- **Construction Ledger** — registro de fases CB-00..19 cerradas.

## Dependencias

- CB-00..18 todas terminadas.

## Resultado esperado

Factory 2.0 declarada **construida** — lista para operación productiva bajo canon.

## Criterio de terminación

- [ ] E2E piloto completo sin violación constitucional.
- [ ] Checklist FFO §XII.2 — todos los criterios PASS.
- [ ] 52 MOT · 24 LOOP · 14 SWM · 26 AIA · 26 CAP — cobertura verificada.
- [ ] ELR completeness 100% en piloto.
- [ ] **Factory 2.0 Construction — COMPLETE.**

---

## Matriz de dependencias resumida

| Fase | Requiere |
|------|----------|
| CB-00 | Constitución aprobada |
| CB-01 | CB-00 |
| CB-02 | CB-00, CB-01 |
| CB-03 | CB-01, CB-02, CB-04 |
| CB-04 | CB-00, CB-01, CB-02 |
| CB-05 | CB-02, CB-03, CB-04 |
| CB-06 | CB-04, CB-05 |
| CB-07 | CB-05, CB-06 |
| CB-08 | CB-07, CB-03, CB-06 |
| CB-09 | CB-05, CB-06, CB-07 |
| CB-10 | CB-05, CB-04, CB-06 |
| CB-11 | CB-05..10, CB-04, CB-06, CB-03 |
| CB-12 | CB-11, CB-04, CB-06 |
| CB-13 | CB-06, CB-07..11 |
| CB-14 | CB-04, CB-11, CB-06 |
| CB-15 | CB-01..14 |
| CB-16 | CB-13, CB-15, CB-06 |
| CB-17 | CB-15, CB-16 |
| CB-18 | CB-01, CB-15 |
| CB-19 | CB-00..18 |

---

## Fuera de alcance de construcción Factory

| Ámbito | Razón |
|--------|-------|
| Decision-Diamond internals | Soberano aguas abajo |
| Projection-Diamond | Consume Factory — no lo construye |
| Product Catalog / pricing | Producto soberano |
| Marketplace UX | Producto soberano |
| `access_tier` | Prohibido en Factory (PP-08) |
| Expansión DDI / MPI | Requiere enmienda constitucional |
| Selección vendor IA | SLOT neutral — decisión operativa posterior |

---

## Resumen ejecutivo

| Métrica | Valor |
|---------|-------|
| Fases de construcción | **20** (CB-00..CB-19) |
| Motores a instanciar | **52** |
| Loops a instanciar | **24** |
| Swarms a instanciar | **14** |
| AIA a instanciar | **26** |
| Capabilities ancla | **26** |
| Estados expediente | **16** |
| Gates Decision | **G0–G6** |
| Frontera Factory | **ST-RDY → ST-DEC** |
| Constitución | **19 documentos — no modificables** |

---

## Declaración de obediencia constitucional

> Este Blueprint **no redefine** Factory 2.0.  
> **Obedece** la Constitución aprobada.  
> Cualquier desviación durante construcción requiere **enmienda constitucional** — no improvisación en código.

---

*FACTORY 2.0 CONSTRUCTION BLUEPRINT — Plan Maestro de Construcción. Fase IV RealEstateSniper Factory 2.0. Documento de Director de Producción. Sometido a FFO y Auditoría Maestra.*

# OFFICIAL AI CAPABILITY CATALOG

**Catálogo Oficial de Capacidades Asistivas de IA — Auditoría Maestra RealEstateSniper Factory 2.0**

**Autoridad:** Decimoctavo documento oficial de la Auditoría Maestra. Décimo y **cierre** de la **Fase II — Producción del Conocimiento**. Deriva obligatoriamente de la **IA GOVERNANCE ARCHITECTURE**, del **OFFICIAL SWARM CATALOG**, del **OFFICIAL LOOP CATALOG**, del **OFFICIAL MOTOR CATALOG** y de toda la Auditoría Maestra precedente.  
**Alcance:** Catálogo **oficial y cerrado** de capacidades asistivas `AIA-{FUN}-{NN}` autorizadas en Factory 2.0. Cada capacidad es **función especializada subordinada** — nunca autoridad constitucional.  
**Exclusión expresa:** Modelos comerciales, proveedores, APIs, implementación, programación y código.

**Pregunta rectora:**

> *¿Qué capacidades IA oficiales puede invocar Factory, bajo qué FUN, por qué actores y con qué límites epistémicos, de auditoría y de sustituibilidad tecnológica?*

---

## Reglas del catálogo

| Regla | Enunciado |
|-------|-----------|
| **OAC-01** | Ninguna capacidad AIA existe fuera de este catálogo |
| **OAC-02** | Toda AIA cumple **IGA** y **PRH-01..15** |
| **OAC-03** | Código AIA es inmutable en esencia — versión semántica aparte |
| **OAC-04** | AIA experimental (clase X) **no** figura en producción |
| **OAC-05** | Nueva AIA = enmienda OAC + IGA compliance |

## Leyenda

| Código | Significado |
|--------|-------------|
| **AUT-0** | Solo sugerencia — invocador decide sin pre-fill |
| **AUT-1** | Sugerencia con score — aceptación explícita invocador |
| **AUT-2** | Pre-fill candidato — validación motor Obl. (máximo EXT) |
| **EXP-L1** | reasoning_chain operacional |
| **EXP-L2** | RLG completo auditoría |
| **EXP-L3** | Prohibido en salida C1 IC — solo motor |
| **uncertainty_aux max** | Umbral abstención UNC-05 |

---

# Índice maestro de capacidades AIA (26)

| Código | Nombre oficial | FUN | AUT | unc. max |
|--------|----------------|-----|-----|----------|
| AIA-NRM-01 | DDI Field Normalization Assistant | NRM | AUT-1 | 0.50 |
| AIA-NRM-02 | Address Parcel Canonicalization Assistant | NRM | AUT-1 | 0.40 |
| AIA-NRM-03 | Cross-Source Schema Harmonization Assistant | NRM | AUT-1 | 0.55 |
| AIA-ENR-01 | Contextual Enrichment Suggester | ENR | AUT-0 | 0.60 |
| AIA-ENR-02 | Submarket Context Overlay Assistant | ENR | AUT-0 | 0.55 |
| AIA-VER-01 | Cross-Field Consistency Checker | VER | AUT-0 | 0.45 |
| AIA-VER-02 | Source Plausibility Challenge Assistant | VER | AUT-0 | 0.50 |
| AIA-GAP-01 | Obligatory Gap Detector | GAP | AUT-0 | 0.50 |
| AIA-GAP-02 | Readiness Gap Analyzer | GAP | AUT-0 | 0.45 |
| AIA-SUM-01 | Conversation Transcript Summarizer | SUM | AUT-1 | 0.55 |
| AIA-SUM-02 | IC Memo Draft Structuring Assistant | SUM | AUT-1 | 0.50 |
| AIA-RNK-01 | Investigation Hypothesis Ranker | RNK | AUT-0 | 0.55 |
| AIA-RNK-02 | Perfection Priority Ranker | RNK | AUT-0 | 0.50 |
| AIA-MAP-01 | Source-to-DDI Element Mapper | MAP | AUT-1 | 0.50 |
| AIA-MAP-02 | DSO Family Classifier Assistant | MAP | AUT-1 | 0.45 |
| AIA-UNC-01 | Universal Uncertainty Quantifier | UNC | AUT-0 | N/A |
| AIA-EXP-01 | Loop Decision Explainer | EXP | AUT-0 | 0.60 |
| AIA-EXP-02 | Swarm Mission State Narrator | EXP | AUT-0 | 0.55 |
| AIA-CRD-01 | Swarm Coordination Dashboard Assistant | CRD | AUT-0 | 0.50 |
| AIA-EXT-01 | Recorded Document Field Extractor | EXT | AUT-2 | 0.45 |
| AIA-EXT-02 | Court Filing Field Extractor | EXT | AUT-2 | 0.50 |
| AIA-EXT-03 | MLS Listing Field Extractor | EXT | AUT-2 | 0.50 |
| AIA-MAT-01 | Parcel Identity Match Suggester | MAT | AUT-1 | 0.40 |
| AIA-MAT-02 | Comparable Property Match Suggester | MAT | AUT-1 | 0.55 |
| AIA-MAT-03 | Owner Identity Match Suggester | MAT | AUT-1 | 0.45 |
| AIA-VER-03 | Evidence Conflict Signal Assistant | VER | AUT-0 | 0.40 |

**Cobertura:** 26 AIA · 12 FUN · 10 SLOT · 52 motores invocables (subconjuntos) · 24 loops · 14 SWM.

---

# II. Fichas oficiales por FUN

---

## FUN-NRM — Normalización

### AIA-NRM-01 — DDI Field Normalization Assistant

| Campo | Definición |
|-------|------------|
| **Función constitucional** | FUN-NRM |
| **Misión** | Sugerir mapeo de valores fuente al vocabulario canónico DDI |
| **Problemas que resuelve** | Heterogeneidad formato; ambigüedad campo; normalización manual lenta |
| **Actores invocadores** | Motor (ACQ, NRM); Loop FND-SUP |
| **Entradas esperadas** | Raw field values; source family DSO; target DDI element ref |
| **Salidas produce** | `mapping_suggestions[]`; confidence_aux; reasoning_chain |
| **Nunca produce** | Knowledge delta; E3+; C1–C2; elementos DDI nuevos |
| **Evidencia utiliza** | Lee E3–E4 upstream; genera `AIA-assist` ref |
| **Restricciones** | PRH-DDI; PRH-EC; solo elementos DDI cerrados |
| **Autonomía máxima** | AUT-1 |
| **Explicabilidad** | EXP-L1 mínimo; EXP-L2 en auditoría |
| **Incertidumbre aceptable** | uncertainty_aux ≤ **0.50**; abstención >0.50 |
| **Auditoría** | RLG Obl.; aceptación motor tracked |
| **Nunca utilizar** | Bloque C1 sin VER; fuente prohibida; sin invocador catalogado |

### AIA-NRM-02 — Address Parcel Canonicalization Assistant

| Campo | Definición |
|-------|------------|
| **Función constitucional** | FUN-NRM |
| **Misión** | Sugerir forma canónica dirección y parcel ID para Dominio 01–02 |
| **Problemas que resuelve** | Variantes address; USPS vs assessor; parcel format mismatch |
| **Actores invocadores** | MOT-IDN-01, MOT-LOC-01; LOOP-FND-SUP-01; SWM-IDN-01 |
| **Entradas esperadas** | Address variants; assessor parcel; geocoder output |
| **Salidas produce** | `canonical_address`; `parcel_candidate`; uncertainty_aux |
| **Nunca produce** | factory_key final; E4; resolución identidad sin motor |
| **Evidencia utiliza** | E3 assessor/GIS; E1 propuesto |
| **Restricciones** | Fair Housing neutral; no discard por demographics |
| **Autonomía máxima** | AUT-1 |
| **Explicabilidad** | EXP-L2 Obl. — identidad crítica |
| **Incertidumbre aceptable** | ≤ **0.40** — identidad P1 |
| **Auditoría** | RLG + match audit trail |
| **Nunca utilizar** | Post-identidad CS-5; sin MOT-IDN context |

### AIA-NRM-03 — Cross-Source Schema Harmonization Assistant

| Campo | Definición |
|-------|------------|
| **Función constitucional** | FUN-NRM |
| **Misión** | Armonizar esquemas heterogéneos entre fuentes para mismo elemento DDI |
| **Problemas que resuelve** | Multi-fuente mismo campo; MOT-IDN-02 prep |
| **Actores invocadores** | MOT-IDN-02; MOT-EVD-02 prep; SWM-EVD-01 |
| **Entradas esperadas** | ≥2 source schemas; DDI element target |
| **Salidas produce** | `harmonization_map`; conflict flags advisory |
| **Nunca produce** | Conflict resolution; E4 assignment |
| **Evidencia utiliza** | Source metadata DSO |
| **Restricciones** | Señala — MOT-EVD-02 decide |
| **Autonomía máxima** | AUT-1 |
| **Explicabilidad** | EXP-L2 |
| **Incertidumbre aceptable** | ≤ **0.55** |
| **Auditoría** | RLG; escalation count to EVD-02 |
| **Nunca utilizar** | Promediar valores incompatibles |

---

## FUN-ENR — Enriquecimiento

### AIA-ENR-01 — Contextual Enrichment Suggester

| Campo | Definición |
|-------|------------|
| **Función constitucional** | FUN-ENR |
| **Misión** | Proponer enriquecimiento contextual Dominios 31–37 etiquetado E1 |
| **Problemas que resuelve** | Gaps contextuales clase S; cobertura ENV incompleta |
| **Actores invocadores** | MOT-CTX-01/02, MOT-LIV-01/02/03, MOT-FUT-01 |
| **Entradas esperadas** | factory_key; tract; existing context state |
| **Salidas produce** | `enrichment_candidates[]` E1; uncertainty_aux |
| **Nunca produce** | Valoración; micro-market pricing; C1–C3 |
| **Evidencia utiliza** | E3 census/official; E1 propuesto |
| **Restricciones** | LS-17 Fair Housing; contextual only |
| **Autonomía máxima** | AUT-0 |
| **Explicabilidad** | EXP-L1 |
| **Incertidumbre aceptable** | ≤ **0.60** |
| **Auditoría** | RLG; rejection rate |
| **Nunca utilizar** | Sustituir MOT-MKT; pre-P6 |

### AIA-ENR-02 — Submarket Context Overlay Assistant

| Campo | Definición |
|-------|------------|
| **Función constitucional** | FUN-ENR |
| **Misión** | Sugerir overlay tendencia submarket para MOT-MKT-01 |
| **Problemas que resuelve** | Interpretación aggregates MLS; trend inference prep |
| **Actores invocadores** | MOT-MKT-01; LOOP-ECO-QLT-01 |
| **Entradas esperadas** | MLS aggregates; submarket boundary |
| **Salidas produce** | `trend_overlay` E1/E2; reasoning_chain |
| **Nunca produce** | Comps; valuation; C2 |
| **Evidencia utiliza** | E3 MLS aggregate |
| **Restricciones** | Inferencia E2 máximo |
| **Autonomía máxima** | AUT-0 |
| **Explicabilidad** | EXP-L1 |
| **Incertidumbre aceptable** | ≤ **0.55** |
| **Auditoría** | RLG |
| **Nunca utilizar** | Como única base valoración |

---

## FUN-VER — Verificación sugerida

### AIA-VER-01 — Cross-Field Consistency Checker

| Campo | Definición |
|-------|------------|
| **Función constitucional** | FUN-VER |
| **Misión** | Señalar inconsistencias lógicas entre campos DDI relacionados |
| **Problemas que resuelve** | Sqft vs beds; LTV vs equity; date conflicts |
| **Actores invocadores** | Motores VER; MOT-LEG-01; MOT-FIN-01; Loops QLT |
| **Entradas esperadas** | Knowledge state multi-campo; DDI refs |
| **Salidas produce** | `inconsistency_flags[]`; severity; reasoning_chain |
| **Nunca produce** | Corrección automática; C upgrade |
| **Evidencia utiliza** | Lee registry MOT-EVD-01 |
| **Restricciones** | Señala — motor VER resuelve |
| **Autonomía máxima** | AUT-0 |
| **Explicabilidad** | EXP-L2 |
| **Incertidumbre aceptable** | ≤ **0.45** |
| **Auditoría** | RLG; true positive rate post-motor |
| **Nunca utilizar** | Auto-fix sin motor |

### AIA-VER-02 — Source Plausibility Challenge Assistant

| Campo | Definición |
|-------|------------|
| **Función constitucional** | FUN-VER |
| **Misión** | Desafiar plausibilidad fuente vs dominio para pipeline challenge |
| **Problemas que resuelve** | STR-5 challenge prep; outlier detection |
| **Actores invocadores** | MOT-IDN-02, MOT-OWN-02, MOT-OCR-02; LOOP-LEG-EVD-01 |
| **Entradas esperadas** | Source extract; DDI element; peer values |
| **Salidas produce** | `plausibility_score`; challenge_recommendation |
| **Nunca produce** | Source rejection final; E downgrade |
| **Evidencia utiliza** | DSO hierarchy |
| **Restricciones** | PRH-AVG prohibido |
| **Autonomía máxima** | AUT-0 |
| **Explicabilidad** | EXP-L2 |
| **Incertidumbre aceptable** | ≤ **0.50** |
| **Auditoría** | RLG |
| **Nunca utilizar** | Declarar fuente prohibida válida |

### AIA-VER-03 — Evidence Conflict Signal Assistant

| Campo | Definición |
|-------|------------|
| **Función constitucional** | FUN-VER |
| **Misión** | Señalar candidatos conflicto E para MOT-EVD-02 |
| **Problemas que resuelve** | Pre-screen conflictos multi-fuente |
| **Actores invocadores** | MOT-EVD-02; LOOP-XVR-EVD-01; SWM-EVD-01 |
| **Entradas esperadas** | Evidence registry slice; producer outputs |
| **Salidas produce** | `conflict_candidates[]`; domain map |
| **Nunca produce** | Resolution verdict; prevailing E |
| **Evidencia utiliza** | MOT-EVD-01 read-only |
| **Restricciones** | CFL-01 MSA |
| **Autonomía máxima** | AUT-0 |
| **Explicabilidad** | EXP-L2 Obl. |
| **Incertidumbre aceptable** | ≤ **0.40** |
| **Auditoría** | RLG; escalation accuracy |
| **Nunca utilizar** | Resolver conflicto; promediar |

---

## FUN-GAP — Detección lagunas

### AIA-GAP-01 — Obligatory Gap Detector

| Campo | Definición |
|-------|------------|
| **Función constitucional** | FUN-GAP |
| **Misión** | Identificar elementos DDI Obl. sin valor o C5 |
| **Problemas que resuelve** | Cobertura nominal vacía; gaps no declarados |
| **Actores invocadores** | Todos los Loops SUP/GAP; LOOP-INT-RDY-01 |
| **Entradas esperadas** | factory_key; DDI completeness state |
| **Salidas produce** | `gap_candidates[]`; Obl/Rec; benefit_estimate advisory |
| **Nunca produce** | Gap closure; invented values |
| **Evidencia utiliza** | DDI checklist |
| **Restricciones** | Gap declarado > inventado |
| **Autonomía máxima** | AUT-0 |
| **Explicabilidad** | EXP-L1 |
| **Incertidumbre aceptable** | ≤ **0.50** |
| **Auditoría** | RLG; gap detection precision |
| **Nunca utilizar** | Cerrar gap; activar motor |

### AIA-GAP-02 — Readiness Gap Analyzer

| Campo | Definición |
|-------|------------|
| **Función constitucional** | FUN-GAP |
| **Misión** | Analizar gaps bloqueantes pre-síntesis Decision path |
| **Problemas que resuelve** | MOT-SYN-02 blocker identification |
| **Actores invocadores** | LOOP-INT-RDY-01; LOOP-INT-EVD-01; SWM-SUF-01 |
| **Entradas esperadas** | Readiness state; blocker list; capa 1–6 status |
| **Salidas produce** | `readiness_gaps[]`; priority advisory |
| **Nunca produce** | readiness verdict; go/no-go |
| **Evidencia utiliza** | MOT-EVD-01 sufficiency state |
| **Restricciones** | Loop decide readiness |
| **Autonomía máxima** | AUT-0 |
| **Explicabilidad** | EXP-L2 |
| **Incertidumbre aceptable** | ≤ **0.45** |
| **Auditoría** | RLG |
| **Nunca utilizar** | Override MOT-SYN-02 |

---

## FUN-SUM — Resumen asistivo

### AIA-SUM-01 — Conversation Transcript Summarizer

| Campo | Definición |
|-------|------------|
| **Función constitucional** | FUN-SUM |
| **Misión** | Borrador resumen transcript conversación owner |
| **Problemas que resuelve** | MOT-DCN-02 corpus largo; corroboration prep |
| **Actores invocadores** | MOT-DCN-02; LOOP-INT-GAP-01 |
| **Entradas esperadas** | Transcript E3; MOT-CNT-01 clearance ref |
| **Salidas produce** | `draft_summary` E2; `corroboration_hints[]` E1 |
| **Nunca produce** | Motivation C1; contact decision; PII release |
| **Evidencia utiliza** | E3 transcript; clearance Obl. |
| **Restricciones** | Sin MOT-CNT-01 — prohibido |
| **Autonomía máxima** | AUT-1 |
| **Explicabilidad** | EXP-L1 |
| **Incertidumbre aceptable** | ≤ **0.55** |
| **Auditoría** | RLG; PII redaction check |
| **Nunca utilizar** | Sin TCPA clearance; pricing talk |

### AIA-SUM-02 — IC Memo Draft Structuring Assistant

| Campo | Definición |
|-------|------------|
| **Función constitucional** | FUN-SUM |
| **Misión** | Estructurar borrador secciones memo IC desde corpus |
| **Problemas que resuelve** | MOT-EXE-01 formatting; known unknowns placement |
| **Actores invocadores** | MOT-EXE-01; LOOP-INT-FRS-01 |
| **Entradas esperadas** | Corpus capas 1–6; SYN bundle |
| **Salidas produce** | `draft_sections` E2; structure only |
| **Nunca produce** | C1 facts; thesis final; Decision content |
| **Evidencia utiliza** | Upstream E3–E4 refs only |
| **Restricciones** | EXP-L3 prohibited in C1 sections |
| **Autonomía máxima** | AUT-1 |
| **Explicabilidad** | EXP-L1 draft; EXP-L2 audit |
| **Incertidumbre aceptable** | ≤ **0.50** |
| **Auditoría** | RLG; sync lag tracking |
| **Nunca utilizar** | Pre-readiness; inventar thesis |

---

## FUN-RNK — Ranking auxiliar

### AIA-RNK-01 — Investigation Hypothesis Ranker

| Campo | Definición |
|-------|------------|
| **Función constitucional** | FUN-RNK |
| **Misión** | Ordenar hipótesis distress por beneficio marginal esperado |
| **Problemas que resuelve** | LOOP-DST-INV-01 priorización; SWM-INV-01 |
| **Actores invocadores** | LOOP-DST-INV-01; SWM-INV-01 |
| **Entradas esperadas** | hypothesis_list; marginal_benefit inputs |
| **Salidas produce** | `ranked_hypotheses[]` advisory; uncertainty_aux |
| **Nunca produce** | Investigation closure; motor invocation |
| **Evidencia utiliza** | Prior investigation ledger |
| **Restricciones** | Loop/SWM decide order execution |
| **Autonomía máxima** | AUT-0 |
| **Explicabilidad** | EXP-L1 |
| **Incertidumbre aceptable** | ≤ **0.55** |
| **Auditoría** | RLG |
| **Nunca utilizar** | <3 hipótesis; autónomo |

### AIA-RNK-02 — Perfection Priority Ranker

| Campo | Definición |
|-------|------------|
| **Función constitucional** | FUN-RNK |
| **Misión** | Ordenar candidatos re-ejecución motor por P-CONST y Δ esperado |
| **Problemas que resuelve** | Loop presupuesto competido; multi-gap |
| **Actores invocadores** | Loops SUP, QLT, FRS (capas 1–6) |
| **Entradas esperadas** | gap list; C degradation; P-CONST context |
| **Salidas produce** | `perfection_priority[]` advisory |
| **Nunca produce** | Re-ejecución order; STR selection |
| **Evidencia utiliza** | Loop ledger |
| **Restricciones** | P-CONST inviolable |
| **Autonomía máxima** | AUT-0 |
| **Explicabilidad** | EXP-L1 |
| **Incertidumbre aceptable** | ≤ **0.50** |
| **Auditoría** | RLG; alignment with actual Loop choice |
| **Nunca utilizar** | Override P0 compliance |

---

## FUN-MAP — Mapeo fuentes

### AIA-MAP-01 — Source-to-DDI Element Mapper

| Campo | Definición |
|-------|------------|
| **Función constitucional** | FUN-MAP |
| **Misión** | Sugerir correspondencia campo fuente → elemento DDI |
| **Problemas que resuelve** | Onboarding nueva fuente; ACQ mapping |
| **Actores invocadores** | Motores ACQ; MOT-OCR-01; MOT-CMP-01 prep |
| **Entradas esperadas** | Source schema; sample records; DDI target domain |
| **Salidas produce** | `element_map[]`; confidence_aux |
| **Nunca produce** | DDI expansion; prohibited source approval |
| **Evidencia utiliza** | DSO catalog |
| **Restricciones** | PRH-SRC |
| **Autonomía máxima** | AUT-1 |
| **Explicabilidad** | EXP-L1 |
| **Incertidumbre aceptable** | ≤ **0.50** |
| **Auditoría** | RLG |
| **Nunca utilizar** | Fuente no catalogada DSO |

### AIA-MAP-02 — DSO Family Classifier Assistant

| Campo | Definición |
|-------|------------|
| **Función constitucional** | FUN-MAP |
| **Misión** | Clasificar extract en familia fuente DSO |
| **Problemas que resuelve** | Ambiguous source lineage; compliance prep |
| **Actores invocadores** | MOT-CMP-01; MOT-EVD-01; ACQ motors |
| **Entradas esperadas** | Document/metadata extract |
| **Salidas produce** | `family_classification` E1; lineage_hint |
| **Nunca produce** | Compliance verdict; prohibited override |
| **Evidencia utiliza** | DSO taxonomy |
| **Restricciones** | MOT-CMP-01 decides |
| **Autonomía máxima** | AUT-1 |
| **Explicabilidad** | EXP-L2 |
| **Incertidumbre aceptable** | ≤ **0.45** |
| **Auditoría** | RLG |
| **Nunca utilizar** | Aprobar fuente prohibida |

---

## FUN-UNC — Incertidumbre

### AIA-UNC-01 — Universal Uncertainty Quantifier

| Campo | Definición |
|-------|------------|
| **Función constitucional** | FUN-UNC |
| **Misión** | Calcular uncertainty_aux transversal para cualquier salida AIA o advisory |
| **Problemas que resuelve** | Calibración UNC-01..05; abstention decisions |
| **Actores invocadores** | Cualquier Motor, Loop, Enjambre; otras AIA (meta) |
| **Entradas esperadas** | Output candidato; input quality signals; calibration context |
| **Salidas produce** | `uncertainty_aux` 0–1; `abstention_recommendation` |
| **Nunca produce** | US Enjambre; C motor; sufficiency |
| **Evidencia utiliza** | Calibration Office benchmarks |
| **Restricciones** | UNC-02 no sustituye |
| **Autonomía máxima** | AUT-0 |
| **Explicabilidad** | EXP-L2 |
| **Incertidumbre aceptable** | N/A — es el medidor |
| **Auditoría** | Calibration trimestral Obl.; drift alert |
| **Nunca utilizar** | Como única base decisión Loop |

---

## FUN-EXP — Explicabilidad

### AIA-EXP-01 — Loop Decision Explainer

| Campo | Definición |
|-------|------------|
| **Función constitucional** | FUN-EXP |
| **Misión** | Narrar en lenguaje funcional decisión Loop (STR, agotamiento) |
| **Problemas que resuelve** | Audit trail legibilidad; Board review |
| **Actores invocadores** | Todos los Loops |
| **Entradas esperadas** | loop_ledger entry; STR history; metrics |
| **Salidas produce** | `explanation_narrative` E2; JST chain |
| **Nunca produce** | Nueva decisión Loop; motor trigger |
| **Evidencia utiliza** | Loop ledger read-only |
| **Restricciones** | Describir — no prescribir |
| **Autonomía máxima** | AUT-0 |
| **Explicabilidad** | EXP-L2 Obl. |
| **Incertidumbre aceptable** | ≤ **0.60** |
| **Auditoría** | RLG |
| **Nunca utilizar** | Post-hoc justificar violación PRH |

### AIA-EXP-02 — Swarm Mission State Narrator

| Campo | Definición |
|-------|------------|
| **Función constitucional** | FUN-EXP |
| **Misión** | Narrar estado misión Enjambre para SWA-OUT draft assist |
| **Problemas que resuelve** | convergence_report legibilidad |
| **Actores invocadores** | Todos los SWM patrones |
| **Entradas esperadas** | swarm_mission_ledger; round state; CS/US |
| **Salidas produce** | `mission_narrative` E2; draft SWA-OUT sections |
| **Nunca produce** | SWA-OUT oficial; CS/US official; DIE-* |
| **Evidencia utiliza** | Swarm ledger |
| **Restricciones** | Enjambre firma SWA-OUT |
| **Autonomía máxima** | AUT-0 |
| **Explicabilidad** | EXP-L2 |
| **Incertidumbre aceptable** | ≤ **0.55** |
| **Auditoría** | RLG |
| **Nunca utilizar** | Sustituir Enjambre coordinator |

---

## FUN-CRD — Coordinación auxiliar

### AIA-CRD-01 — Swarm Coordination Dashboard Assistant

| Campo | Definición |
|-------|------------|
| **Función constitucional** | FUN-CRD |
| **Misión** | Generar vista estado coordinación motores en misión SWM |
| **Problemas que resuelve** | Visibilidad MOD-P/I/X/F; stall detection |
| **Actores invocadores** | SWM-CVG, SWM-EVD, SWM-SYN, SWM-ECO (+ todos SWM) |
| **Entradas esperadas** | swarm_id; motor lock state; round metrics |
| **Salidas produce** | `mission_dashboard` E2; stall_warning advisory |
| **Nunca produce** | Orchestration commands; motor run |
| **Evidencia utiliza** | Swarm + motor manifests |
| **Restricciones** | MSA-15; COO-01 |
| **Autonomía máxima** | AUT-0 |
| **Explicabilidad** | EXP-L1 |
| **Incertidumbre aceptable** | ≤ **0.50** |
| **Auditoría** | RLG |
| **Nunca utilizar** | Orquestar; enviar SWA-OUT |

---

## FUN-EXT — Extracción estructurada

### AIA-EXT-01 — Recorded Document Field Extractor

| Campo | Definición |
|-------|------------|
| **Función constitucional** | FUN-EXT |
| **Misión** | Proponer campos estructurados desde deed, mortgage, title docs |
| **Problemas que resuelve** | MOT-OCR-01 manual extraction; Dominio 10 |
| **Actores invocadores** | MOT-OCR-01, MOT-OCR-02, MOT-LIEN-01 |
| **Entradas esperadas** | Document image/text E3–E4; doc type |
| **Salidas produce** | `field_extractions[]` E1; bounding refs |
| **Nunca produce** | E4 authenticity; recorded status |
| **Evidencia utiliza** | Document corpus |
| **Restricciones** | MOT-OCR-02 validates; AUT-2 max |
| **Autonomía máxima** | AUT-2 |
| **Explicabilidad** | EXP-L2 |
| **Incertidumbre aceptable** | ≤ **0.45** |
| **Auditoría** | RLG; extraction accuracy vs motor |
| **Nunca utilizar** | Certify authentic; sin custody chain |

### AIA-EXT-02 — Court Filing Field Extractor

| Campo | Definición |
|-------|------------|
| **Función constitucional** | FUN-EXT |
| **Misión** | Extraer campos de filings judiciales, probate, auction |
| **Problemas que resuelve** | MOT-JUD-01, MOT-LFE-* docket parsing |
| **Actores invocadores** | MOT-JUD-01, MOT-LFE-01/04, MOT-COD-01 |
| **Entradas esperadas** | Court filing E3–E4 |
| **Salidas produce** | `filing_fields` E1; deadline_candidates |
| **Nunca produce** | blocks sale verdict; E4 court |
| **Evidencia utiliza** | E4 filing when present |
| **Restricciones** | Deadlines motor validates |
| **Autonomía máxima** | AUT-2 |
| **Explicabilidad** | EXP-L2 |
| **Incertidumbre aceptable** | ≤ **0.50** |
| **Auditoría** | RLG |
| **Nunca utilizar** | Inventar case number |

### AIA-EXT-03 — MLS Listing Field Extractor

| Campo | Definición |
|-------|------------|
| **Función constitucional** | FUN-EXT |
| **Misión** | Extraer campos listing MLS para MOT-MKT y MOT-CHR |
| **Problemas que resuelve** | Listing history; comp data prep |
| **Actores invocadores** | MOT-MKT-01/02, MOT-CHR-02, MOT-MOT-03 |
| **Entradas esperadas** | MLS record E3 |
| **Salidas produce** | `listing_fields` E1; price_history candidates |
| **Nunca produce** | Arm's-length verdict; comp qualification |
| **Evidencia utiliza** | E3 MLS |
| **Restricciones** | MLS ≠ exclusividad LS-07 |
| **Autonomía máxima** | AUT-2 |
| **Explicabilidad** | EXP-L1 |
| **Incertidumbre aceptable** | ≤ **0.50** |
| **Auditoría** | RLG |
| **Nunca utilizar** | Como único comp source |

---

## FUN-MAT — Matching similitud

### AIA-MAT-01 — Parcel Identity Match Suggester

| Campo | Definición |
|-------|------------|
| **Función constitucional** | FUN-MAT |
| **Misión** | Sugerir matches parcel cross-fuente assessor/recorder/MLS |
| **Problemas que resuelve** | MOT-IDN-02 reconciliation; SWM-IDN-01 |
| **Actores invocadores** | MOT-IDN-02, MOT-LOC-02; SWM-IDN-01 |
| **Entradas esperadas** | Parcel records ≥2 fuentes |
| **Salidas produce** | `match_candidates[]` E1; similarity_score |
| **Nunca produce** | factory_key; E4 match |
| **Evidencia utiliza** | E3–E4 per source |
| **Restricciones** | E4 recorder default |
| **Autonomía máxima** | AUT-1 |
| **Explicabilidad** | EXP-L2 |
| **Incertidumbre aceptable** | ≤ **0.40** |
| **Auditoría** | RLG |
| **Nunca utilizar** | Auto-merge sin MOT-IDN-02 |

### AIA-MAT-02 — Comparable Property Match Suggester

| Campo | Definición |
|-------|------------|
| **Función constitucional** | FUN-MAT |
| **Misión** | Sugerir candidatos comp por similitud física/ubicación |
| **Problemas que resuelve** | MOT-MKT-02 selection; SWM-VAL-01 |
| **Actores invocadores** | MOT-MKT-02, MOT-MKT-03; SWM-VAL-01 |
| **Entradas esperadas** | Subject PHY; sold pool; radius params |
| **Salidas produce** | `comp_candidates[]` E1; adjustment_hints advisory |
| **Nunca produce** | Qualified comp set; arm's-length flag |
| **Evidencia utiliza** | E3–E4 sold |
| **Restricciones** | MOT-MKT-02 qualifies |
| **Autonomía máxima** | AUT-1 |
| **Explicabilidad** | EXP-L1 |
| **Incertidumbre aceptable** | ≤ **0.55** |
| **Auditoría** | RLG |
| **Nunca utilizar** | <3 comps bypass |

### AIA-MAT-03 — Owner Identity Match Suggester

| Campo | Definición |
|-------|------------|
| **Función constitucional** | FUN-MAT |
| **Misión** | Sugerir match owner record vs contact vs title |
| **Problemas que resuelve** | MOT-OWN-02 verification |
| **Actores invocadores** | MOT-OWN-02, MOT-CNT-02; SWM-LEG-01 |
| **Entradas esperadas** | Owner records; contact data (scoped) |
| **Salidas produce** | `owner_match_candidates` E1 |
| **Nunca produce** | PII release; owner verified C1 |
| **Evidencia utiliza** | E4 title; E3 contact with scope |
| **Restricciones** | MOT-CNT-02 scope; PII rules |
| **Autonomía máxima** | AUT-1 |
| **Explicabilidad** | EXP-L2 |
| **Incertidumbre aceptable** | ≤ **0.45** |
| **Auditoría** | RLG; PII audit |
| **Nunca utilizar** | Sin authorization scope |

---

# III. Matriz AIA × FUN

| FUN | AIA | Count |
|-----|-----|-------|
| NRM | NRM-01, NRM-02, NRM-03 | 3 |
| ENR | ENR-01, ENR-02 | 2 |
| VER | VER-01, VER-02, VER-03 | 3 |
| GAP | GAP-01, GAP-02 | 2 |
| SUM | SUM-01, SUM-02 | 2 |
| RNK | RNK-01, RNK-02 | 2 |
| MAP | MAP-01, MAP-02 | 2 |
| UNC | UNC-01 | 1 |
| EXP | EXP-01, EXP-02 | 2 |
| CRD | CRD-01 | 1 |
| EXT | EXT-01, EXT-02, EXT-03 | 3 |
| MAT | MAT-01, MAT-02, MAT-03 | 3 |
| **Total** | | **26** |

---

# IV. Matriz AIA × Motor (resumen por familia)

| Familia motor | AIA autorizadas | Motores representativos |
|---------------|-----------------|-------------------------|
| **IDN / LOC** | NRM-02, MAT-01, VER-02, MAP-01 | MOT-IDN-01/02, MOT-LOC-01/02 |
| **OCR / LEG / LIEN** | EXT-01, VER-01/02, MAP-01 | MOT-OCR-01/02, MOT-LEG-01, MOT-LIEN-01 |
| **OWN / CNT** | MAT-03, VER-02 | MOT-OWN-01/02, MOT-CNT-01/02 |
| **JUD / LFE / COD** | EXT-02, VER-01 | MOT-JUD-01, MOT-LFE-*, MOT-COD-01 |
| **MOT distress** | EXT-03, VER-01 | MOT-MOT-01..05 |
| **FIN** | VER-01, GAP-01 | MOT-FIN-01/02/03 |
| **HAZ** | VER-01 | MOT-HAZ-01/02 |
| **MKT** | EXT-03, MAT-02, ENR-02, VER-01 | MOT-MKT-01/02/03 |
| **INV** | VER-01, GAP-01 | MOT-INV-01/02 |
| **CTX / LIV / FUT** | ENR-01 | MOT-CTX-*, MOT-LIV-*, MOT-FUT-01 |
| **EVD** | VER-03, MAP-02, UNC-01 | MOT-EVD-01/02 |
| **SYN / DCN / EXE** | GAP-02, SUM-01/02, VER-01 | MOT-SYN-*, MOT-DCN-*, MOT-EXE-01 |
| **CMP** | MAP-02 | MOT-CMP-01 |
| **PHY / REG** | NRM-01, MAP-01, VER-01 | MOT-PHY-*, MOT-REG-* |
| **CHR** | EXT-03 | MOT-CHR-01/02 |
| **COM** | GAP-01 | MOT-COM-01 |

**Regla:** Motor invoca solo AIA declarada en intersección. Invocación no listada = violación OAC.

### Matriz motor detallada (52)

| Motor | AIA |
|-------|-----|
| MOT-IDN-01 | NRM-02, MAP-01 |
| MOT-IDN-02 | NRM-02, NRM-03, MAT-01, VER-02 |
| MOT-LOC-01 | NRM-02, NRM-01 |
| MOT-LOC-02 | NRM-02, MAT-01 |
| MOT-PHY-01/02 | NRM-01, VER-01 |
| MOT-REG-01/02/03 | NRM-01, MAP-01, VER-01 |
| MOT-LEG-01 | VER-01, VER-02, EXT-01 |
| MOT-OWN-01 | MAP-01 |
| MOT-OWN-02 | MAT-03, VER-02 |
| MOT-LIEN-01 | EXT-01, VER-01 |
| MOT-OCR-01/02 | EXT-01, MAP-01, VER-02 |
| MOT-MOT-01..04 | EXT-02, VER-01 |
| MOT-MOT-03 | EXT-03, VER-01 |
| MOT-MOT-05 | VER-01, GAP-01 |
| MOT-CNT-01/02 | MAT-03, MAP-02 |
| MOT-CHR-01/02 | EXT-03 |
| MOT-JUD-01 | EXT-02, VER-01 |
| MOT-LFE-01/02/03 | EXT-02, VER-01 |
| MOT-LFE-04 | EXT-02 |
| MOT-COD-01 | EXT-02 |
| MOT-FIN-01/02/03 | VER-01, GAP-01 |
| MOT-HAZ-01/02 | VER-01 |
| MOT-MKT-01 | ENR-02, EXT-03 |
| MOT-MKT-02/03 | MAT-02, EXT-03, VER-01 |
| MOT-INV-01/02 | VER-01, GAP-01 |
| MOT-CTX-01/02 | ENR-01 |
| MOT-LIV-01/02/03 | ENR-01 |
| MOT-FUT-01 | ENR-01 |
| MOT-EVD-01/02 | VER-03, MAP-02, UNC-01 |
| MOT-SYN-01/02 | GAP-02, VER-01 |
| MOT-DCN-01 | EXT-01, VER-01 |
| MOT-DCN-02 | SUM-01 |
| MOT-DCN-03 | VER-01, GAP-01 |
| MOT-COM-01 | GAP-01 |
| MOT-EXE-01 | SUM-02 |
| MOT-CMP-01 | MAP-02 |

---

# V. Matriz AIA × Loop

| Loop | AIA |
|------|-----|
| LOOP-XVR-CMP-01 | MAP-02, GAP-01 |
| LOOP-XVR-EVD-01 | VER-03, NRM-03, EXP-01 |
| LOOP-XVR-CHR-01 | RNK-02, EXP-01, GAP-01 |
| LOOP-FND-SUP-01 | NRM-02, GAP-01, RNK-02, EXP-01 |
| LOOP-FND-FRS-01 | GAP-01, RNK-02 |
| LOOP-LEG-SUP-01 | GAP-01, VER-01, RNK-02, EXP-01 |
| LOOP-LEG-GAP-01 | GAP-01, EXT-01, RNK-02 |
| LOOP-LEG-EVD-01 | VER-02, VER-03, NRM-03, EXP-01 |
| LOOP-DST-CVG-01 | GAP-01, RNK-02, EXP-01 |
| LOOP-DST-SUP-01 | GAP-01, RNK-02, EXP-01 |
| LOOP-DST-CNT-01 | GAP-01, MAP-02 |
| LOOP-DST-INV-01 | RNK-01, GAP-01, EXP-01 |
| LOOP-ECO-SUP-01 | GAP-01, RNK-02, EXP-01 |
| LOOP-ECO-FRS-01 | GAP-01, RNK-02 |
| LOOP-ECO-QLT-01 | GAP-01, MAT-02, RNK-02, ENR-02 |
| LOOP-ECO-QLT-02 | GAP-01, RNK-02, VER-01 |
| LOOP-ECO-FRS-02 | GAP-01 |
| LOOP-ENV-SUP-01 | GAP-01, ENR-01, RNK-02 |
| LOOP-ENV-FRS-01 | GAP-01 |
| LOOP-INT-EVD-01 | GAP-02, VER-03, EXP-01 |
| LOOP-INT-RDY-01 | GAP-02, RNK-02, EXP-01 |
| LOOP-INT-GAP-01 | GAP-01, SUM-01, RNK-02 |
| LOOP-INT-QLT-01 | GAP-01, MAP-02 |
| LOOP-INT-FRS-01 | GAP-01, SUM-02, EXP-01 |

**Regla:** Loop invoca AIA solo advisory — decisión Loop soberana.

---

# VI. Matriz AIA × Enjambre (SWM)

| SWM | AIA |
|-----|-----|
| SWM-CVG-01 | CRD-01, EXP-02, UNC-01, RNK-01 |
| SWM-CHR-01 | CRD-01, EXP-02, UNC-01 |
| SWM-EVD-01 | CRD-01, VER-03, NRM-03, EXP-02, UNC-01 |
| SWM-LEG-01 | CRD-01, MAT-03, VER-02, EXP-02, UNC-01 |
| SWM-DST-01 | CRD-01, EXP-02, UNC-01 |
| SWM-INV-01 | CRD-01, RNK-01, EXP-02, UNC-01 |
| SWM-ECO-01 | CRD-01, VER-01, EXP-02, UNC-01 |
| SWM-VAL-01 | CRD-01, MAT-02, EXP-02, UNC-01 |
| SWM-IVM-01 | CRD-01, VER-01, EXP-02, UNC-01 |
| SWM-SUF-01 | CRD-01, GAP-02, VER-03, EXP-02, UNC-01 |
| SWM-SYN-01 | CRD-01, EXP-02, UNC-01 |
| SWM-NEG-01 | CRD-01, EXP-02, UNC-01 |
| SWM-IDN-01 | CRD-01, NRM-02, MAT-01, EXP-02, UNC-01 |
| SWM-OCR-01 | CRD-01, EXT-01, EXP-02, UNC-01 |

**Regla:** SWM invoca CRD-01 + EXP-02 + UNC-01 como baseline; patrones añaden AIA específicas.

---

# VII. Registro SLOT (neutralidad tecnológica)

| SLOT | FUN binding | AIA servidas | Dual-run clase C | Estado |
|------|-------------|--------------|------------------|--------|
| **SLOT-01** | NRM, MAP | NRM-01..03, MAP-01/02 | Obl. | ACTIVO |
| **SLOT-02** | EXT | EXT-01..03 | Obl. | ACTIVO |
| **SLOT-03** | MAT | MAT-01..03 | Obl. | ACTIVO |
| **SLOT-04** | VER | VER-01..03 | Obl. | ACTIVO |
| **SLOT-05** | GAP, RNK | GAP-01/02, RNK-01/02 | Recom. | ACTIVO |
| **SLOT-06** | SUM | SUM-01/02 | Obl. | ACTIVO |
| **SLOT-07** | ENR | ENR-01/02 | No | ACTIVO |
| **SLOT-08** | EXP, CRD | EXP-01/02, CRD-01 | No | ACTIVO |
| **SLOT-09** | UNC | UNC-01 | Obl. | ACTIVO |
| **SLOT-10** | Challenger MLT-PC | VER, MAT, EXT | Obl. | STANDBY |

```text
SLOT-{NN} — interfaz abstracta
├── version           : semver (catálogo, no vendor)
├── func_binding      : FUN-XX
├── aia_list          : [AIA-XX-NN]
├── prh_checklist     : PRH-01..15 pass required
├── calibration_ref   : Calibration Office
├── challenger_slot   : SLOT-10 optional
└── retention_rlg     : 7 años
```

**Regla SUB-01 IGA:** Sustitución implementación SLOT no altera AIA semantics.

---

# VIII. Reglas de compatibilidad

| Regla | Enunciado |
|-------|-----------|
| **CMP-01** | AIA solo invocable por actor en matriz § IV–VI |
| **CMP-02** | AUT-2 solo EXT-* con motor VER downstream |
| **CMP-03** | SUM-01 requiere MOT-CNT-01 clearance |
| **CMP-04** | SUM-02 requiere LOOP-INT-RDY-01 PASS |
| **CMP-05** | MAT-03 requiere MOT-CNT-02 scope |
| **CMP-06** | VER-03 siempre con MOT-EVD-02 en pipeline |
| **CMP-07** | UNC-01 invocable con cualquier AIA — meta layer |
| **CMP-08** | CRD-01 solo durante misión SWM activa |
| **CMP-09** | EXP-02 solo con swarm_id válido |
| **CMP-10** | MLT-ENS max 3 SLOT — disagreement log Obl. |
| **CMP-11** | Promedio outputs AIA → prohibido LIA-09 |
| **CMP-12** | PII inputs → redaction antes RLG |
| **CMP-13** | Clase C1 Obl. → solo VER/GAP/UNC assist — no ENR/SUM |
| **CMP-14** | Producto/Decision → **ninguna** AIA |

---

# IX. Gobernanza del catálogo

| Órgano | Función |
|--------|---------|
| **AI Registry Authority** | Alta/baja AIA; SLOT registry |
| **AI Governance Board** | OAC enmiendas; PRH |
| **Calibration Office** | SLOT-09; UNC-01 |
| **Evidence Council** | VER-03 disputes |
| **Compliance Council** | CMP violations |
| **Architecture Board** | Matrices coherencia OMC/OLC/OSC |

**Reglas:**
1. Catálogo cerrado **26 AIA** salvo enmienda OAC.  
2. Matriz invocación cerrada — extensión requiere OAC minor+.  
3. SLOT sin prh_checklist = ilegítimo.  
4. AIA clase X prohibida en Decision path.  
5. Calibration drift → suspensión SLOT.

---

# X. Constitución del Catálogo IA — OAC

| # | Ley |
|---|-----|
| **OAC-06** | 26 AIA es lista cerrada producción |
| **OAC-07** | Ficha completa Obl. por AIA |
| **OAC-08** | Toda AIA declara FUN IGA |
| **OAC-09** | Invocación solo por matriz § IV–VI |
| **OAC-10** | RLG Obl. — sin excepción |
| **OAC-11** | SLOT neutral — sin vendor en catálogo |
| **OAC-12** | AUT-2 máximo — solo EXT |
| **OAC-13** | E1/E2 máximo salida IA |
| **OAC-14** | Producto/Decision intocables |
| **OAC-15** | Evolución = enmienda OAC + IGA |
| **OAC-16** | Catálogo somete a IGA y toda Auditoría Maestra |

*OAC-01..05 en § Reglas.*

---

# XI. Leyes constitucionales — Catálogo IA

| # | Ley |
|---|-----|
| **LAC-01** | Sin AIA catalogada no hay asistencia legítima |
| **LAC-02** | AIA huérfana de FUN es ilegítima |
| **LAC-03** | Invocación fuera de matriz es violación |
| **LAC-04** | Ficha incompleta invalida AIA |
| **LAC-05** | SLOT con vendor lock-in viola NT-01 |
| **LAC-06** | AUT >2 es ilegítimo |
| **LAC-07** | E3+ desde AIA es violación PRH-EC |
| **LAC-08** | C1/C2 desde AIA es violación |
| **LAC-09** | RLG ausente invalida invocación |
| **LAC-10** | IA como autoridad es usurpación |
| **LAC-11** | 12 FUN cubiertas sin hueco |
| **LAC-12** | UNC-01 calibración Obl. |
| **LAC-13** | CRD no orquesta — MSA-15 |
| **LAC-14** | EXP no decide — describe |
| **LAC-15** | EXT sin motor validate es negligencia |
| **LAC-16** | Compatibility CMP-01..14 Obl. |
| **LAC-17** | Dual-run clase C Obl. SLOT-01..04 |
| **LAC-18** | Observabilidad aceptación/rechazo Obl. |
| **LAC-19** | Full Orchestration deriva de este catálogo |
| **LAC-20** | Arquitectura antes que catálogo — catálogo antes que modelo |

---

# XII. Preparación: Full Factory Orchestration Architecture

El **decimonoveno documento** cerrará la **orquestación constitucional completa** de Factory 2.0:

## XII.1 Alcance previsto FFO

| Componente | Orquestación |
|------------|--------------|
| **Sources DSO** | Ingestión legítima — capa 0 |
| **Motores OMC** | Producción secuencial/paralela capas 1–6 |
| **Evidencia MOT-EVD** | Intercept transversal |
| **Loops OLC** | Perfeccionamiento pipeline § IV OLC |
| **Enjambres OSC** | Derivación temporal STR-6/ESC-S |
| **AIA OAC** | Asistencia puntual subordinada |
| **Handoffs** | SWA-IN/OUT, Loop locks LK, DIE-* |
| **Decision** | Frontera soberana post-Factory |

## XII.2 Diagrama orquestación (preview)

```text
                    ┌─────────────┐
                    │  DSO Sources │
                    └──────┬──────┘
                           ▼
              ┌────────────────────────┐
              │ LOOP-XVR-CMP (P0)      │
              └────────────┬───────────┘
                           ▼
    CAPA 1→6: MOTORS ──assist── AIA (subordinada)
              │    ↑                │
              │    └── LOOPS (24)   │
              │         │ derivación
              │         ▼
              │    ENJAMBRES (14 SWM) ──assist── AIA
              │         │
              └────┬────┘
                   ▼
            MOT-EVD-01/02
                   ▼
            MOT-SYN → MOT-EXE
                   ▼
              DECISION (fuera FFO)
```

## XII.3 Orden documental Auditoría Maestra — Fase II cerrada

| # | Documento | Estado |
|---|-----------|--------|
| 1–9 | DDI, DSO, MPI, DKN… | ✅ |
| 10 | Master Motors Architecture | ✅ |
| 11 | Factory Capability Catalog | ✅ |
| 12 | Official Motor Catalog | ✅ |
| 13 | Master Loops Architecture | ✅ |
| 14 | Official Loop Catalog | ✅ |
| 15 | Master Swarms Architecture | ✅ |
| 16 | Official Swarm Catalog | ✅ |
| 17 | IA Governance Architecture | ✅ |
| **18** | **Official AI Capability Catalog** | **Este documento** |
| **19** | **Full Factory Orchestration Architecture** | ⏭ Siguiente |

**Dependencia FFO:** Orquestación **no redefine** actores — **ensambla** catálogos OMC, OLC, OSC, OAC bajo P-CONST y compliance P0.

---

# Resumen ejecutivo

| Métrica | Valor |
|---------|-------|
| Capacidades AIA catalogadas | **26** |
| Funciones FUN cubiertas | **12 / 12** |
| SLOT registros neutrales | **10** |
| Motores con AIA autorizada | **52 / 52** |
| Loops con AIA autorizada | **24 / 24** |
| Enjambres con AIA baseline | **14 / 14** |
| Reglas compatibilidad CMP | **14** |
| Leyes OAC (OAC-01..16) | **16** |
| Leyes LAC | **20** |
| Autonomía máxima catálogo | **AUT-2** (solo EXT) |
| PRH absolutas heredadas | **15** |

---

*OFFICIAL AI CAPABILITY CATALOG — Catálogo Oficial de Capacidades Asistivas de IA. Decimoctavo documento oficial de la Auditoría Maestra RealEstateSniper Factory 2.0. Cierre de la capa de producción asistiva bajo IGA. Base del Full Factory Orchestration Architecture.*

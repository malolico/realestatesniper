# OFFICIAL MOTOR CATALOG

**Catálogo Oficial de Motores — Auditoría Maestra RealEstateSniper Factory 2.0**

**Autoridad:** Duodécimo documento oficial de la Auditoría Maestra. Cuarto documento de la **Fase II — Producción del Conocimiento**. Deriva obligatoriamente del **MASTER MOTORS ARCHITECTURE**, del **FACTORY CAPABILITY CATALOG**, de la **DIAMOND SOURCES & ORGANISMS ARCHITECTURE** y del **Diamond Data Inventory** completo.  
**Alcance:** Catálogo **oficial y cerrado** de motores autorizados en Factory 2.0. Cada motor pertenece **obligatoriamente** a una capacidad CAP-XX. Este documento es la base para futuros documentos específicos por motor.  
**Exclusión expresa:** Implementación, código, APIs, IA, loops, enjambres, orquestación técnica y persistencia.

**Pregunta rectora:**

> *¿Qué motores oficiales produce Factory, bajo qué capacidad, con qué misión y con qué límites constitucionales?*

---

## Reglas del catálogo

| Regla | Enunciado |
|-------|-----------|
| **OMC-01** | Ningún motor existe fuera de este catálogo |
| **OMC-02** | Todo motor declara **exactamente un** CAP padre primario |
| **OMC-03** | Código motor es inmutable en esencia — versión semántica aparte |
| **OMC-04** | Motor experimental (clase X) **no** figura en catálogo producción |
| **OMC-05** | Nuevo motor = enmienda OMC + MMA compliance |

## Convención de nomenclatura

```text
MOT-{DOMINIO}-{NN}
Ejemplo: MOT-IDN-01 — Parcel Identity Resolver
```

| Código dominio | Ámbito |
|----------------|--------|
| IDN, LOC, PHY | Fundación |
| REG, LEG, OWN, LIEN, OCR | Legitimidad |
| MOT, CNT, CHR, JUD, LFE, COD | Distress |
| FIN, HAZ, MKT, INV | Economía |
| CTX, LIV, FUT | Entorno |
| EVD, SYN, DCN, COM, EXE, CMP | Inteligencia |

## Leyenda tipos (MMA)

| Tipo | Sigla |
|------|-------|
| Adquisición | ACQ |
| Normalización | NRM |
| Verificación | VER |
| Enriquecimiento | ENR |
| Señal distress | SIG |
| Dominio | DOM |
| Evidencia | EVD |
| Síntesis | SYN |
| Compliance | CMP |

## Leyenda criticidad

| Clase | Significado |
|-------|-------------|
| **C** | Crítica — bloques Obl. Decision-Diamond |
| **A** | Alta — material IC |
| **S** | Estándar — contextual |
| **X** | Experimental — excluido de este catálogo |

---

# Índice maestro de motores (52)

| Código | Nombre | CAP | Clase | Tipo |
|--------|--------|-----|-------|------|
| MOT-IDN-01 | Parcel Identity Resolver | 01 | C | ACQ+NRM |
| MOT-IDN-02 | Identity Cross-Source Reconciler | 01 | C | VER |
| MOT-LOC-01 | Jurisdictional Geospatial Resolver | 02 | C | ACQ+NRM |
| MOT-LOC-02 | Parcel Boundary Verifier | 02 | A | VER |
| MOT-PHY-01 | Assessor Physical Profile Motor | 03 | A | ACQ+DOM |
| MOT-PHY-02 | Certified Inspection Integrator | 03 | A | ACQ+VER |
| MOT-REG-01 | Building Permit Ledger Motor | 04 | C | ACQ+DOM |
| MOT-REG-02 | Zoning Classification Motor | 04 | C | ACQ+DOM |
| MOT-REG-03 | Urban Envelope & FAR Motor | 04 | A | ACQ+ENR |
| MOT-LEG-01 | Title Marketability Motor | 05 | C | DOM+VER |
| MOT-OWN-01 | Record Owner Resolver | 06 | C | ACQ+DOM |
| MOT-OWN-02 | Owner Verification Match Motor | 06 | C | VER |
| MOT-LIEN-01 | Encumbrance Registry Motor | 07 | C | ACQ+DOM |
| MOT-OCR-01 | Official Corpus Acquirer | 25 | C | ACQ |
| MOT-OCR-02 | Document Authenticity Verifier | 25 | C | VER |
| MOT-MOT-01 | Pre-Foreclosure Signal Motor | 08 | C | SIG |
| MOT-MOT-02 | Tax Delinquency Distress Signal Motor | 08 | C | SIG |
| MOT-MOT-03 | Listing Repricing Signal Motor | 08 | A | SIG |
| MOT-MOT-04 | Municipal Distress Enforcement Signal Motor | 08 | C | SIG |
| MOT-MOT-05 | Motivation Convergence Scorer | 08 | C | SYN |
| MOT-CNT-01 | Legitimate Contact Gate Motor | 09 | C | CMP+DOM |
| MOT-CNT-02 | Owner Authorization Scope Motor | 09 | C | DOM |
| MOT-CHR-01 | Property Event Timeline Motor | 10 | C | DOM+SYN |
| MOT-CHR-02 | Transaction & Listing History Motor | 10 | A | ACQ+DOM |
| MOT-JUD-01 | Civil Litigation Index Motor | 11 | C | ACQ+DOM |
| MOT-LFE-01 | Probate Proceedings Motor | 12 | C | ACQ+DOM |
| MOT-LFE-02 | Divorce Title Impediment Motor | 12 | A | ACQ+DOM |
| MOT-LFE-03 | Inheritance & Heir Structure Motor | 12 | A | ACQ+DOM |
| MOT-LFE-04 | Trustee Sale & Auction Notice Motor | 12 | C | ACQ+SIG |
| MOT-COD-01 | Municipal Code Enforcement Motor | 26 | C | ACQ+DOM |
| MOT-FIN-01 | Equity & Financial Position Motor | 13 | C | DOM+SYN |
| MOT-FIN-02 | Mortgage Position & Payoff Motor | 13 | C | ACQ+DOM |
| MOT-FIN-03 | Property Tax & Fiscal Status Motor | 13 | C | ACQ+DOM |
| MOT-HAZ-01 | Natural Hazard Classification Motor | 14 | C | ACQ+DOM |
| MOT-HAZ-02 | Environmental Risk & Contamination Motor | 14 | C | ACQ+DOM |
| MOT-MKT-01 | Submarket Dynamics Motor | 15 | A | ACQ+ENR |
| MOT-MKT-02 | Comparable Sales Selection Motor | 15 | C | ACQ+DOM |
| MOT-MKT-03 | Valuation Reconciliation Motor | 15 | C | SYN+DOM |
| MOT-INV-01 | Pro Forma Profitability Motor | 16 | C | DOM+SYN |
| MOT-INV-02 | Investment Strategy Fit Motor | 16 | C | SYN+DOM |
| MOT-CTX-01 | Demographic Context Motor | 17 | S | ENR |
| MOT-CTX-02 | Local Economy & Employment Motor | 17 | S | ENR |
| MOT-LIV-01 | Crime & Safety Trend Motor | 18 | A | ENR |
| MOT-LIV-02 | Education Assignment Motor | 18 | A | ENR |
| MOT-LIV-03 | Mobility & Utilities Services Motor | 18 | S | ENR |
| MOT-FUT-01 | Future Development Pipeline Motor | 19 | A | ACQ+ENR |
| MOT-EVD-01 | Master Evidence Registrar | 20 | C | EVD |
| MOT-EVD-02 | Source Conflict Resolver | 20 | C | EVD+VER |
| MOT-SYN-01 | Cross-Domain Convergence Motor | 21 | C | SYN |
| MOT-SYN-02 | Decision Readiness Gate Motor | 21 | C | SYN |
| MOT-DCN-01 | Documentary Quality Governance Motor | 22 | C | DOM+VER |
| MOT-DCN-02 | Conversational Intelligence Motor | 22 | A | DOM |
| MOT-DCN-03 | Negotiation Leverage & Close Probability Motor | 22 | C | SYN+DOM |
| MOT-COM-01 | Knowledge Commercialization Motor | 23 | A | DOM |
| MOT-EXE-01 | Institutional Executive Summary Motor | 24 | C | EXE+SYN |
| MOT-CMP-01 | Factory Compliance Gate Motor | 09* | C | CMP |

*MOT-CMP-01 es transversal; CAP padre primario: **09** (contacto/compliance).

---

# II. Fichas oficiales por capacidad

---

## CAP-01 — SOBERANÍA DE IDENTIDAD DEL ACTIVO

### MOT-IDN-01 — Parcel Identity Resolver

| Campo | Definición |
|-------|------------|
| **Capacidad padre** | CAP-01 |
| **Misión** | Resolver identidad parcelaria única y factory key soberano del activo |
| **Dominios MPI** | 01 |
| **Partes DDI** | I |
| **Tipo conocimiento** | Identificadores primarios, parcel ID, APN, factory identity |
| **Entradas** | Dirección candidata, jurisdicción, señales cruzadas assessor/recorder |
| **Salidas** | Parcel ID canónico, factory key, identity confidence, gap list |
| **Evidencias** | E3–E4 assessor/GIS; bundle IDN-01 |
| **Dependencias** | Ninguna hard; soft MOT-LOC-01 |
| **Cooperación** | MOT-IDN-02, MOT-LOC-01, MOT-EVD-01 |
| **Criticidad** | C |
| **Cobertura esperada** | 100% elementos Obl. Dominio 01 en activos procesados |
| **Métricas** | Identity resolution rate ≥98%; duplicate rate <1% |
| **Restricciones** | Sin geocoder único como primaria; sin inferir ID sin E2 mínimo |
| **Nunca actúa** | Sin jurisdicción; activo sin ancla dirección/parcel mínima |

### MOT-IDN-02 — Identity Cross-Source Reconciler

| Campo | Definición |
|-------|------------|
| **Capacidad padre** | CAP-01 |
| **Misión** | Reconciliar identidades conflictivas entre fuentes y elevar o degradar confianza |
| **Dominios MPI** | 01 |
| **Partes DDI** | I |
| **Tipo conocimiento** | Equivalencias, conflict flags, reconciled identity |
| **Entradas** | Salidas MOT-IDN-01, assessor roll, recorder index, MLS ID |
| **Salidas** | Reconciled identity, conflict log, C1/C2 assignment |
| **Evidencias** | E4 prevalece registral; conflict → MOT-EVD-02 |
| **Dependencias** | Hard: MOT-IDN-01 |
| **Cooperación** | MOT-EVD-02, MOT-OWN-01 |
| **Criticidad** | C |
| **Cobertura esperada** | 100% conflictos identidad detectados |
| **Métricas** | Unresolved identity conflict rate <2% |
| **Restricciones** | No merge silencioso; no promediar IDs |
| **Nunca actúa** | Sin ≥2 fuentes comparables |

---

## CAP-02 — INTELIGENCIA DE LOCALIZACIÓN Y JURISDICCIÓN

### MOT-LOC-01 — Jurisdictional Geospatial Resolver

| Campo | Definición |
|-------|------------|
| **Capacidad padre** | CAP-02 |
| **Misión** | Fijar posición geográfica, municipio, condado, estado y jurisdicciones competentes |
| **Dominios MPI** | 02 |
| **Partes DDI** | I |
| **Tipo conocimiento** | Coordenadas, census tract, ZIP, jurisdictional stack |
| **Entradas** | MOT-IDN-01 output, GIS oficial, geocoder auditado |
| **Salidas** | Location bundle, jurisdiction list, geocode confidence |
| **Evidencias** | E3 GIS/assessor; E2 geocoder solo como secundaria |
| **Dependencias** | Hard: MOT-IDN-01 |
| **Cooperación** | MOT-LOC-02, MOT-REG-02, MOT-CTX-01 |
| **Criticidad** | C |
| **Cobertura esperada** | ≥95% elementos Obl. Dominio 02 |
| **Métricas** | Jurisdiction resolution rate; geocode C1% |
| **Restricciones** | Geocoder nunca única fuente C1 |
| **Nunca actúa** | Sin identidad parcelaria resuelta |

### MOT-LOC-02 — Parcel Boundary Verifier

| Campo | Definición |
|-------|------------|
| **Capacidad padre** | CAP-02 |
| **Misión** | Verificar límites parcelarios y detectar discrepancias espaciales |
| **Dominios MPI** | 02 |
| **Partes DDI** | I |
| **Tipo conocimiento** | Boundary polygon, acreage, boundary conflict flags |
| **Entradas** | GIS parcel layer, survey si existe, assessor acreage |
| **Salidas** | Verified boundary, variance flags, acreage reconciled |
| **Evidencias** | E4 survey; E3 GIS; E2 assessor |
| **Dependencias** | Hard: MOT-LOC-01 |
| **Cooperación** | MOT-REG-03, MOT-EVD-02 |
| **Criticidad** | A |
| **Cobertura esperada** | 100% activos land/dev; Rec. residencial estándar |
| **Métricas** | Boundary conflict detection rate |
| **Restricciones** | Sin inventar polígonos |
| **Nunca actúa** | Condos sin geometría parcelaria aplicable — declarar no aplica |

---

## CAP-03 — CARACTERIZACIÓN FÍSICA DEL ACTIVO

### MOT-PHY-01 — Assessor Physical Profile Motor

| Campo | Definición |
|-------|------------|
| **Capacidad padre** | CAP-03 |
| **Misión** | Producir perfil físico base desde roll catastral y fuentes registrales |
| **Dominios MPI** | 03 |
| **Partes DDI** | I |
| **Tipo conocimiento** | GLA, beds/baths, year built, lot size, asset class |
| **Entradas** | Assessor roll, MOT-IDN-01, listing history secundaria |
| **Salidas** | Physical profile base, assessor variance flags |
| **Evidencias** | E3 assessor; E2 MLS histórico |
| **Dependencias** | Hard: MOT-IDN-01 |
| **Cooperación** | MOT-PHY-02, MOT-MKT-02, MOT-REG-01 |
| **Criticidad** | A |
| **Cobertura esperada** | ≥90% elementos Rec. Dominio 03 |
| **Métricas** | Physical completeness score contribution |
| **Restricciones** | No sustituir inspección en rehab thesis |
| **Nunca actúa** | Como única fuente condición material post-disaster |

### MOT-PHY-02 — Certified Inspection Integrator

| Campo | Definición |
|-------|------------|
| **Capacidad padre** | CAP-03 |
| **Misión** | Integrar inspecciones certificadas y elevar condición física verificada |
| **Dominios MPI** | 03 |
| **Partes DDI** | I |
| **Tipo conocimiento** | Condition rating, systems status, defect inventory |
| **Entradas** | Inspection reports, photos, MOT-PHY-01 baseline |
| **Salidas** | Verified condition, capex hints, assessor vs observed variance |
| **Evidencias** | E3–E4 inspection certificada |
| **Dependencias** | Soft: MOT-PHY-01 |
| **Cooperación** | MOT-INV-01, MOT-DCN-01, MOT-EVD-01 |
| **Criticidad** | A |
| **Cobertura esperada** | 100% cuando inspección existe; gap si no |
| **Métricas** | Inspection integration rate; condition confidence uplift |
| **Restricciones** | Inspector no identificado = E2 máximo |
| **Nunca actúa** | Sin documento inspección o visita autorizada |

---

## CAP-04 — LEGITIMIDAD REGULATORIA

### MOT-REG-01 — Building Permit Ledger Motor

| Campo | Definición |
|-------|------------|
| **Capacidad padre** | CAP-04 |
| **Misión** | Inventariar permisos, CO, obras abiertas y cumplimiento permisivo |
| **Dominios MPI** | 04 |
| **Partes DDI** | V |
| **Tipo conocimiento** | Permit inventory, CO status, open permits, unpermitted flags |
| **Entradas** | Building dept records, MOT-PHY-01, code cross-ref |
| **Salidas** | Permit ledger, compliance flags, cure estimates |
| **Evidencias** | E4 municipal permit; E3 portal |
| **Dependencias** | Hard: MOT-LOC-01 |
| **Cooperación** | MOT-COD-01, MOT-REG-02, MOT-EVD-01 |
| **Criticidad** | C |
| **Cobertura esperada** | 100% Obl. Dominio 04 bloques críticos |
| **Métricas** | Open permit detection; CO validity rate |
| **Restricciones** | Sin municipal ID — degradar C |
| **Nunca actúa** | Declarar legal sin fuente municipal |

### MOT-REG-02 — Zoning Classification Motor

| Campo | Definición |
|-------|------------|
| **Capacidad padre** | CAP-04 |
| **Misión** | Clasificar zoning vigente, usos permitidos/prohibidos y conformidad |
| **Dominios MPI** | 06 (núcleo), 05 (overlay) |
| **Partes DDI** | V |
| **Tipo conocimiento** | Zoning code, permitted uses, STR legality, conformance |
| **Entradas** | Zoning map oficial, ordinance, MOT-LOC-01 |
| **Salidas** | Zoning bundle, blocks strategy flags |
| **Evidencias** | E4 map/ordinance |
| **Dependencias** | Hard: MOT-LOC-01 |
| **Cooperación** | MOT-REG-03, MOT-INV-02, MOT-FUT-01 |
| **Criticidad** | C |
| **Cobertura esperada** | 100% Obl. Dominio 06 |
| **Métricas** | Zoning conformance resolution rate |
| **Restricciones** | Ordinance no verificada = no C1 |
| **Nunca actúa** | STR thesis sin verificar zoning |

### MOT-REG-03 — Urban Envelope & FAR Motor

| Campo | Definición |
|-------|------------|
| **Capacidad padre** | CAP-04 |
| **Misión** | Calcular envelope edificable, FAR, densidad y potencial subdivisión |
| **Dominios MPI** | 05 |
| **Partes DDI** | V |
| **Tipo conocimiento** | FAR, coverage, height, buildable area, subdivision viability |
| **Entradas** | Planning records, MOT-REG-02, MOT-LOC-02, MOT-PHY-01 |
| **Salidas** | Envelope model, dev upside flags |
| **Evidencias** | E3–E4 planning; E2 estimates etiquetados |
| **Dependencias** | Hard: MOT-REG-02 |
| **Cooperación** | MOT-FUT-01, MOT-INV-02 |
| **Criticidad** | A |
| **Cobertura esperada** | 100% tesis dev/land; no aplica SFR estándar |
| **Métricas** | Envelope completeness |
| **Restricciones** | Upside numérico = E1–E2 |
| **Nunca actúa** | Upzoning asumido sin propuesta pública |

---

## CAP-05 — TRANSFERIBILIDAD Y SITUACIÓN LEGAL

### MOT-LEG-01 — Title Marketability Motor

| Campo | Definición |
|-------|------------|
| **Capacidad padre** | CAP-05 |
| **Misión** | Evaluar transferibilidad, impedimentos legales y riesgo title |
| **Dominios MPI** | 07 |
| **Partes DDI** | II |
| **Tipo conocimiento** | Marketability, impediments, litigation flags, closing blockers |
| **Entradas** | Title commitment, court index, MOT-LIEN-01, MOT-JUD-01 |
| **Salidas** | Legal situation bundle, unacceptable legal risk flags |
| **Evidencias** | E4 title commitment; E4 court |
| **Dependencias** | Hard: MOT-LIEN-01; soft MOT-JUD-01 |
| **Cooperación** | MOT-OWN-02, MOT-SYN-02, MOT-EVD-02 |
| **Criticidad** | C |
| **Cobertura esperada** | 100% Obl. Dominio 07 |
| **Métricas** | Blocker detection rate; marketability C1% |
| **Restricciones** | Sin title plant — no C1 marketability |
| **Nunca actúa** | Emitir opinión legal vinculante |

---

## CAP-06 — TITULARIDAD Y VERIFICACIÓN DEL PROPIETARIO

### MOT-OWN-01 — Record Owner Resolver

| Campo | Definición |
|-------|------------|
| **Capacidad padre** | CAP-06 |
| **Misión** | Identificar titular registral, vesting y estructura entidad |
| **Dominios MPI** | 08, 11 (identidad titular) |
| **Partes DDI** | II, III |
| **Tipo conocimiento** | Record owner, vesting, entity/trust structure |
| **Entradas** | Recorded deed, assessor owner, title plant |
| **Salidas** | Ownership bundle, entity complexity flags |
| **Evidencias** | E4 deed; E3 assessor |
| **Dependencias** | Hard: MOT-IDN-01, MOT-OCR-01 |
| **Cooperación** | MOT-OWN-02, MOT-LFE-01..03 |
| **Criticidad** | C |
| **Cobertura esperada** | 100% Obl. Dominio 08 |
| **Métricas** | Owner resolution rate |
| **Restricciones** | PII Int. hasta authorization |
| **Nunca actúa** | Exponer PII a producto |

### MOT-OWN-02 — Owner Verification Match Motor

| Campo | Definición |
|-------|------------|
| **Capacidad padre** | CAP-06 |
| **Misión** | Verificar match entre titular registral y owner contactado/autorizado |
| **Dominios MPI** | 08, 11 |
| **Partes DDI** | II, III |
| **Tipo conocimiento** | Owner verification match, mismatch flags |
| **Entradas** | MOT-OWN-01, MOT-CNT-02, MOT-DCN-02 |
| **Salidas** | Verification match C1/C2, dispute flags |
| **Evidencias** | E4 authorization; E3 ID verificado |
| **Dependencias** | Hard: MOT-OWN-01 |
| **Cooperación** | MOT-CNT-01, MOT-SYN-02 |
| **Criticidad** | C |
| **Cobertura esperada** | 100% Diamond candidates |
| **Métricas** | Match rate; mismatch escalation time |
| **Restricciones** | Sin authorization — no match affirm |
| **Nunca actúa** | Verificar sin base registral |

---

## CAP-07 — REGISTRO DE GRAVÁMENES

### MOT-LIEN-01 — Encumbrance Registry Motor

| Campo | Definición |
|-------|------------|
| **Capacidad padre** | CAP-07 |
| **Misión** | Inventariar gravámenes, prioridad, saldos y payoff |
| **Dominios MPI** | 09 |
| **Partes DDI** | II |
| **Tipo conocimiento** | Lien inventory, priority, balances, payoff quotes |
| **Entradas** | Recorder instruments, title search, tax liens |
| **Salidas** | Lien registry, senior lien, total balance |
| **Evidencias** | E4 recorded lien; E4 payoff quote |
| **Dependencias** | Hard: MOT-IDN-01, MOT-OCR-01 |
| **Cooperación** | MOT-FIN-02, MOT-LEG-01, MOT-EVD-01 |
| **Criticidad** | C |
| **Cobertura esperada** | 100% Obl. Dominio 09 |
| **Métricas** | Lien completeness; payoff freshness |
| **Restricciones** | Payoff >90 días — degradar C |
| **Nunca actúa** | Omitir junior liens conocidos |

---

## CAP-25 — CORPUS DOCUMENTAL OFICIAL

### MOT-OCR-01 — Official Corpus Acquirer

| Campo | Definición |
|-------|------------|
| **Capacidad padre** | CAP-25 |
| **Misión** | Adquirir y custodiar índice corpus documental oficial |
| **Dominios MPI** | 10 |
| **Partes DDI** | II |
| **Tipo conocimiento** | Document inventory, acquisition status, versions |
| **Entradas** | Recorder, escrow, HOA, lender packages |
| **Salidas** | Master document index, missing critical list |
| **Evidencias** | E4 originals; E3 copies |
| **Dependencias** | Hard: MOT-IDN-01 |
| **Cooperación** | MOT-OCR-02, MOT-DCN-01 |
| **Criticidad** | C |
| **Cobertura esperada** | 100% checklist Dominio 10 |
| **Métricas** | Checklist completion % |
| **Restricciones** | Cadena custodia obligatoria |
| **Nunca actúa** | Aceptar documento sin provenance |

### MOT-OCR-02 — Document Authenticity Verifier

| Campo | Definición |
|-------|------------|
| **Capacidad padre** | CAP-25 |
| **Misión** | Verificar autenticidad e integridad documental |
| **Dominios MPI** | 10, 39 |
| **Partes DDI** | II, VI |
| **Tipo conocimiento** | Authenticity status, forgery flags, integrity hash |
| **Entradas** | MOT-OCR-01 corpus, notarization records |
| **Salidas** | Authenticity per doc, suspicion flags |
| **Evidencias** | E4 notarized; E3 digital integrity |
| **Dependencias** | Hard: MOT-OCR-01 |
| **Cooperación** | MOT-EVD-02, MOT-DCN-01 |
| **Criticidad** | C |
| **Cobertura esperada** | 100% docs críticos |
| **Métricas** | Forgery flag rate; authenticity C1% |
| **Restricciones** | Sospecha = bloqueo hasta resolución |
| **Nunca actúa** | Certificar auténtico sin verificación |

---

## CAP-08 — MOTIVACIÓN DE VENTA Y AUTENTICIDAD DISTRESS

### MOT-MOT-01 — Pre-Foreclosure Signal Motor

| Campo | Definición |
|-------|------------|
| **Capacidad padre** | CAP-08 |
| **Misión** | Detectar señales pre-foreclosure y etapa distress hipotecario |
| **Dominios MPI** | 12, 14, 22 |
| **Partes DDI** | III, IV |
| **Tipo conocimiento** | Pre-foreclosure signal, NOD/NTS stage, urgency |
| **Entradas** | Trustee notices, recorder NOD, MOT-LIEN-01 |
| **Salidas** | Distress signal, timeline events |
| **Evidencias** | E4 notice; E3 aggregator con lineage |
| **Dependencias** | Soft: MOT-IDN-01 |
| **Cooperación** | MOT-MOT-05, MOT-CHR-01, MOT-LFE-04 |
| **Criticidad** | C |
| **Cobertura esperada** | Señal cuando existe filing público |
| **Métricas** | True positive rate; false foreclosure signal rate |
| **Restricciones** | Una señal no basta motivation C1 |
| **Nunca actúa** | Como única prueba motivación |

### MOT-MOT-02 — Tax Delinquency Distress Signal Motor

| Campo | Definición |
|-------|------------|
| **Capacidad padre** | CAP-08 |
| **Misión** | Detectar mora fiscal y distress por impuestos |
| **Dominios MPI** | 12, 23 |
| **Partes DDI** | III, IV |
| **Tipo conocimiento** | Tax delinquent signal, years delinquent, sale risk |
| **Entradas** | Tax collector, certificate lists, MOT-FIN-03 |
| **Salidas** | Tax distress signal, fiscal urgency |
| **Evidencias** | E4 tax roll; E3 lists |
| **Dependencias** | Soft: MOT-IDN-01 |
| **Cooperación** | MOT-MOT-05, MOT-FIN-03 |
| **Criticidad** | C |
| **Cobertura esperada** | 100% delinquent en jurisdicción servida |
| **Métricas** | Delinquency detection rate |
| **Restricciones** | Listas comerciales requieren verificación |
| **Nunca actúa** | Confundir reassessment con delinquency |

### MOT-MOT-03 — Listing Repricing Signal Motor

| Campo | Definición |
|-------|------------|
| **Capacidad padre** | CAP-08 |
| **Misión** | Detectar price drops y repricing como señal distress débil |
| **Dominios MPI** | 12, 14, 26 |
| **Partes DDI** | III, IV |
| **Tipo conocimiento** | Price drop signal, DOM stress, listing behavior |
| **Entradas** | MLS history, MOT-CHR-02 |
| **Salidas** | Repricing signal, weak distress flag |
| **Evidencias** | E3 MLS |
| **Dependencias** | Soft: MOT-CHR-02 |
| **Cooperación** | MOT-MOT-05, MOT-MKT-01 |
| **Criticidad** | A |
| **Cobertura esperada** | Activos con listing history |
| **Métricas** | Signal precision |
| **Restricciones** | E2 máximo como distress primario |
| **Nunca actúa** | Off-market Diamond como señal única |

### MOT-MOT-04 — Municipal Distress Enforcement Signal Motor

| Campo | Definición |
|-------|------------|
| **Capacidad padre** | CAP-08 |
| **Misión** | Convertir code enforcement activo en señal motivación/absentee |
| **Dominios MPI** | 12, 20 |
| **Partes DDI** | III |
| **Tipo conocimiento** | Code distress signal, neglect pattern |
| **Entradas** | MOT-COD-01 output |
| **Salidas** | Municipal distress contribution to convergence |
| **Evidencias** | E3–E4 municipal |
| **Dependencias** | Hard: MOT-COD-01 |
| **Cooperación** | MOT-MOT-05 |
| **Criticidad** | C |
| **Cobertura esperada** | 100% cases con violations material |
| **Métricas** | Convergence contribution rate |
| **Restricciones** | Violation menor sola = E2 |
| **Nunca actúa** | Sustituir MOT-COD-01 dominio completo |

### MOT-MOT-05 — Motivation Convergence Scorer

| Campo | Definición |
|-------|------------|
| **Capacidad padre** | CAP-08 |
| **Misión** | Integrar señales distress en motivación auténtica calibrada |
| **Dominios MPI** | 12 |
| **Partes DDI** | III |
| **Tipo conocimiento** | Motivation primary, authenticity score, distress convergence |
| **Entradas** | MOT-MOT-01..04, MOT-DCN-02, MOT-CHR-01 |
| **Salidas** | Motivation bundle, authenticity C, convergence log |
| **Evidencias** | E2–E3 convergente; E1 si inferido |
| **Dependencias** | Soft: ≥1 SIG motor |
| **Cooperación** | MOT-SYN-01, MOT-EVD-01 |
| **Criticidad** | C |
| **Cobertura esperada** | 100% Diamond distress path |
| **Métricas** | Convergence rate; false motivation rate |
| **Restricciones** | ≥2 señales independientes para C2+ |
| **Nunca actúa** | C1 motivation desde señal única E1 |

---

## CAP-09 — CONTACTABILIDAD Y COMPLIANCE

### MOT-CNT-01 — Legitimate Contact Gate Motor

| Campo | Definición |
|-------|------------|
| **Capacidad padre** | CAP-09 |
| **Misión** | Validar legitimidad contacto, TCPA y ausencia obtención irregular |
| **Dominios MPI** | 13 |
| **Partes DDI** | III, VI |
| **Tipo conocimiento** | Contactability status, TCPA consent, irregular contact flags |
| **Entradas** | Consent records, contact channel metadata, MOT-CMP-01 |
| **Salidas** | Contact gate pass/fail, compliance status |
| **Evidencias** | E4 consent; E3 channel log |
| **Dependencias** | Hard: MOT-CMP-01 |
| **Cooperación** | MOT-CNT-02, MOT-DCN-02 |
| **Criticidad** | C |
| **Cobertura esperada** | 100% contact attempts |
| **Métricas** | TCPA violation rate = 0 |
| **Restricciones** | Fail = descarte contacto |
| **Nunca actúa** | Bypass compliance por urgencia |

### MOT-CNT-02 — Owner Authorization Scope Motor

| Campo | Definición |
|-------|------------|
| **Capacidad padre** | CAP-09 |
| **Misión** | Gestionar authorization scope owner para contacto, PII y release comercial |
| **Dominios MPI** | 13, 38 |
| **Partes DDI** | III, VI |
| **Tipo conocimiento** | Authorization scope, investor contact permission, exclusivity expressed |
| **Entradas** | Signed authorization, MOT-DCN-02, MOT-OWN-02 |
| **Salidas** | Scope matrix, exposure boundaries |
| **Evidencias** | E4 signed authorization |
| **Dependencias** | Soft: MOT-OWN-02 |
| **Cooperación** | MOT-COM-01, MOT-CMP-01 |
| **Criticidad** | C |
| **Cobertura esperada** | 100% Diamond con owner path |
| **Métricas** | Authorization completeness |
| **Restricciones** | Sin firma — scope vacío |
| **Nunca actúa** | Ampliar scope implícitamente |

### MOT-CMP-01 — Factory Compliance Gate Motor

| Campo | Definición |
|-------|------------|
| **Capacidad padre** | CAP-09 (transversal) |
| **Misión** | Enforcer compliance FP/CP rules antes ingestión y exposición |
| **Dominios MPI** | Transversal — soporte 13, 38, 40 |
| **Partes DDI** | III, VI |
| **Tipo conocimiento** | Compliance pass/fail, prohibited source blocks |
| **Entradas** | Source metadata, PII classification, authorization |
| **Salidas** | Compliance clearance, block reasons |
| **Evidencias** | E3 audit log |
| **Dependencias** | Ninguna |
| **Cooperación** | **Todos** los motores ACQ/SIG |
| **Criticidad** | C |
| **Cobertura esperada** | 100% ingestions |
| **Métricas** | Prohibited source block rate; compliance incidents |
| **Restricciones** | Veto soberano — no override |
| **Nunca actúa** | Aprobar fuente prohibida |

---

## CAP-10 — CRONOLOGÍA MAESTRA

### MOT-CHR-01 — Property Event Timeline Motor

| Campo | Definición |
|-------|------------|
| **Capacidad padre** | CAP-10 |
| **Misión** | Construir cronología maestra integrada de eventos |
| **Dominios MPI** | 14 |
| **Partes DDI** | III |
| **Tipo conocimiento** | Event timeline, distress chronology, gap flags |
| **Entradas** | Todos los motores SIG/JUD/LFE/COD, recorder |
| **Salidas** | Master timeline, temporal conflicts |
| **Evidencias** | E3–E4 por evento |
| **Dependencias** | Soft: MOT-IDN-01 |
| **Cooperación** | MOT-CHR-02, MOT-SYN-01 |
| **Criticidad** | C |
| **Cobertura esperada** | 100% Obl. timeline |
| **Métricas** | Timeline completeness; gap density |
| **Restricciones** | Evento sin fecha = flagged |
| **Nunca actúa** | Inventar eventos |

### MOT-CHR-02 — Transaction & Listing History Motor

| Campo | Definición |
|-------|------------|
| **Capacidad padre** | CAP-10 |
| **Misión** | Registrar historial transacciones y listings |
| **Dominios MPI** | 14 |
| **Partes DDI** | III |
| **Tipo conocimiento** | Sale history, listing history, currently listed flag |
| **Entradas** | Recorder deeds, MLS, MOT-MKT-01 |
| **Salidas** | Transaction chain, off-market period |
| **Evidencias** | E4 deed transfer; E3 MLS |
| **Dependencias** | Hard: MOT-IDN-01 |
| **Cooperación** | MOT-MOT-03, MOT-CHR-01 |
| **Criticidad** | A |
| **Cobertura esperada** | ≥90% transfer history |
| **Métricas** | Chain completeness |
| **Restricciones** | Currently listed bloquea off-market Diamond |
| **Nunca actúa** | Ocultar listing activo primario |

---

## CAP-11 — DISTRESS JUDICIAL

### MOT-JUD-01 — Civil Litigation Index Motor

| Campo | Definición |
|-------|------------|
| **Capacidad padre** | CAP-11 |
| **Misión** | Inventariar procedimientos judiciales y lis pendens |
| **Dominios MPI** | 15 |
| **Partes DDI** | III |
| **Tipo conocimiento** | Judicial inventory, active proceedings, blocks sale |
| **Entradas** | Court index, recorder lis pendens, litigation search |
| **Salidas** | Judicial bundle, block flags |
| **Evidencias** | E4 court/lis pendens |
| **Dependencias** | Hard: MOT-OWN-01 |
| **Cooperación** | MOT-LEG-01, MOT-CHR-01 |
| **Criticidad** | C |
| **Cobertura esperada** | 100% active cases |
| **Métricas** | Active proceeding detection rate |
| **Restricciones** | Stale docket — freshness flag |
| **Nunca actúa** | Declarar clear sin search |

---

## CAP-12 — DISTRESS VITAL

### MOT-LFE-01 — Probate Proceedings Motor

| Campo | Definición |
|-------|------------|
| **Capacidad padre** | CAP-12 |
| **Misión** | Dominar estado probate y bloqueos sucesorios |
| **Dominios MPI** | 16 |
| **Partes DDI** | III |
| **Tipo conocimiento** | Probate flags, stage, blocks sale, heir issues |
| **Entradas** | Probate court, notices, MOT-OWN-01 |
| **Salidas** | Probate bundle |
| **Evidencias** | E4 court |
| **Dependencias** | Soft: MOT-OWN-01 |
| **Cooperación** | MOT-LFE-03, MOT-LEG-01 |
| **Criticidad** | C |
| **Cobertura esperada** | 100% si aplica — no aplica declarado |
| **Métricas** | Probate detection rate |
| **Restricciones** | Condicional por activo |
| **Nunca actúa** | Ignorar blocks sale |

### MOT-LFE-02 — Divorce Title Impediment Motor

| Campo | Definición |
|-------|------------|
| **Capacidad padre** | CAP-12 |
| **Misión** | Evaluar divorcio activo e impedimentos firma |
| **Dominios MPI** | 17 |
| **Partes DDI** | III |
| **Tipo conocimiento** | Divorce active, decree status, signature requirements |
| **Entradas** | Family court, title notes |
| **Salidas** | Divorce impediment bundle |
| **Evidencias** | E4 decree |
| **Dependencias** | Soft: MOT-OWN-01 |
| **Cooperación** | MOT-LEG-01 |
| **Criticidad** | A |
| **Cobertura esperada** | Si aplica |
| **Métricas** | Impediment detection |
| **Restricciones** | Rumor sin decree = E1 |
| **Nunca actúa** | Clear sin verificar spouses |

### MOT-LFE-03 — Inheritance & Heir Structure Motor

| Campo | Definición |
|-------|------------|
| **Capacidad padre** | CAP-12 |
| **Misión** | Mapear herederos, conflictos y estructura sucesoria |
| **Dominios MPI** | 18 |
| **Partes DDI** | III |
| **Tipo conocimiento** | Heir list, conflict flags, inheritance blocks |
| **Entradas** | Probate, affidavits, MOT-LFE-01 |
| **Salidas** | Inheritance bundle |
| **Evidencias** | E3–E4 |
| **Dependencias** | Soft: MOT-LFE-01 |
| **Cooperación** | MOT-OWN-02 |
| **Criticidad** | A |
| **Cobertura esperada** | Si aplica |
| **Métricas** | Heir conflict detection |
| **Restricciones** | |
| **Nunca actúa** | Sin base court/affidavit |

### MOT-LFE-04 — Trustee Sale & Auction Notice Motor

| Campo | Definición |
|-------|------------|
| **Capacidad padre** | CAP-12 |
| **Misión** | Rastrear subastas, trustee sales y deadlines |
| **Dominios MPI** | 19 |
| **Partes DDI** | III |
| **Tipo conocimiento** | Auction dates, trustee sale, redemption windows |
| **Entradas** | NTS, auction calendars, sheriff sale |
| **Salidas** | Auction bundle, hard deadlines |
| **Evidencias** | E4 notices |
| **Dependencias** | Soft: MOT-MOT-01 |
| **Cooperación** | MOT-CHR-01, MOT-DCN-03 |
| **Criticidad** | C |
| **Cobertura esperada** | 100% scheduled sales |
| **Métricas** | Deadline tracking accuracy |
| **Restricciones** | Hard deadline Obl. |
| **Nunca actúa** | Omitir redemption rights |

---

## CAP-26 — CODE ENFORCEMENT

### MOT-COD-01 — Municipal Code Enforcement Motor

| Campo | Definición |
|-------|------------|
| **Capacidad padre** | CAP-26 |
| **Misión** | Dominar violaciones, órdenes, multas y liens municipales |
| **Dominios MPI** | 20 |
| **Partes DDI** | III |
| **Tipo conocimiento** | Violations, fines, condemnation, demo orders, municipal liens |
| **Entradas** | Code enforcement dept, MOT-LOC-01 |
| **Salidas** | Code bundle, blocks transfer/habitability |
| **Evidencias** | E3–E4 municipal |
| **Dependencias** | Hard: MOT-LOC-01 |
| **Cooperación** | MOT-MOT-04, MOT-REG-01, MOT-LIEN-01 |
| **Criticidad** | C |
| **Cobertura esperada** | 100% open violations material |
| **Métricas** | Violation detection; cure cost coverage |
| **Restricciones** | |
| **Nunca actúa** | Minimizar red tag/condemnation |

---

## CAP-13 — FINANZAS, HIPOTECA E IMPUESTOS

### MOT-FIN-01 — Equity & Financial Position Motor

| Campo | Definición |
|-------|------------|
| **Capacidad padre** | CAP-13 |
| **Misión** | Calcular posición patrimonial neta, LTV y situación underwater |
| **Dominios MPI** | 21 |
| **Partes DDI** | IV |
| **Tipo conocimiento** | Equity estimate, LTV, underwater flag, carrying cost baseline |
| **Entradas** | MOT-LIEN-01, MOT-MKT-03, MOT-FIN-02, MOT-FIN-03 |
| **Salidas** | Financial position bundle, LTV bands, underwater status |
| **Evidencias** | E3 modelado; E4 payoff/valuation inputs |
| **Dependencias** | Hard: MOT-LIEN-01; Soft: MOT-MKT-03 |
| **Cooperación** | MOT-INV-01, MOT-DCN-03, MOT-SYN-01 |
| **Criticidad** | C |
| **Cobertura esperada** | 100% Obl. Dominio 21 |
| **Métricas** | LTV accuracy post-close; underwater detection rate |
| **Restricciones** | Valuation stale >90 días — degradar C |
| **Nunca actúa** | Equity positivo sin payoff verificado |

### MOT-FIN-02 — Mortgage Position & Payoff Motor

| Campo | Definición |
|-------|------------|
| **Capacidad padre** | CAP-13 |
| **Misión** | Dominar posición hipotecaria, términos servicio deuda y payoff |
| **Dominios MPI** | 22 |
| **Partes DDI** | IV |
| **Tipo conocimiento** | Mortgage position, rate type, maturity, payoff amount, servicer |
| **Entradas** | Recorded mortgage, lender payoff, MOT-LIEN-01, MOT-OCR-01 |
| **Salidas** | Mortgage bundle, payoff quote, senior debt terms |
| **Evidencias** | E4 recorded mortgage; E4 payoff quote |
| **Dependencias** | Hard: MOT-LIEN-01 |
| **Cooperación** | MOT-FIN-01, MOT-MOT-01, MOT-LFE-04 |
| **Criticidad** | C |
| **Cobertura esperada** | 100% liens hipotecarios conocidos |
| **Métricas** | Payoff freshness; mortgage term completeness |
| **Restricciones** | Payoff >90 días — flagged stale |
| **Nunca actúa** | Inferir balance sin instrumento o quote |

### MOT-FIN-03 — Property Tax & Fiscal Status Motor

| Campo | Definición |
|-------|------------|
| **Capacidad padre** | CAP-13 |
| **Misión** | Dominar situación fiscal, exemptions, delinquency y tax sale risk |
| **Dominios MPI** | 23 |
| **Partes DDI** | IV |
| **Tipo conocimiento** | Tax status, assessed value, exemptions, delinquency years, sale certificate |
| **Entradas** | Tax collector roll, certificate lists, MOT-LOC-01 |
| **Salidas** | Fiscal bundle, delinquency status, annual tax burden |
| **Evidencias** | E4 tax roll; E3 certificate lists verificadas |
| **Dependencias** | Hard: MOT-IDN-01, MOT-LOC-01 |
| **Cooperación** | MOT-MOT-02, MOT-FIN-01, MOT-LIEN-01 |
| **Criticidad** | C |
| **Cobertura esperada** | 100% jurisdicción servida |
| **Métricas** | Delinquency detection rate; assessed value freshness |
| **Restricciones** | Listas comerciales — verificación obligatoria |
| **Nunca actúa** | Declarar current sin roll oficial |

---

## CAP-14 — RIESGO TERRITORIAL

### MOT-HAZ-01 — Natural Hazard Classification Motor

| Campo | Definición |
|-------|------------|
| **Capacidad padre** | CAP-14 |
| **Misión** | Clasificar riesgos naturales que afectan valor y asegurabilidad |
| **Dominios MPI** | 24 |
| **Partes DDI** | IV |
| **Tipo conocimiento** | Flood zone, seismic, wildfire, wind, insurability flags |
| **Entradas** | FEMA maps, USGS, CAL FIRE, MOT-LOC-01 |
| **Salidas** | Natural hazard bundle, unacceptable risk flags |
| **Evidencias** | E4 official maps; E3 third-party con lineage |
| **Dependencias** | Hard: MOT-LOC-01 |
| **Cooperación** | MOT-HAZ-02, MOT-INV-01, MOT-REG-02 |
| **Criticidad** | C |
| **Cobertura esperada** | 100% Obl. Dominio 24 |
| **Métricas** | Hazard coverage %; map revision currency |
| **Restricciones** | Map revision pendiente — flag temporal |
| **Nunca actúa** | Certificar no-flood sin mapa vigente |

### MOT-HAZ-02 — Environmental Risk & Contamination Motor

| Campo | Definición |
|-------|------------|
| **Capacidad padre** | CAP-14 |
| **Misión** | Evaluar contaminación, liens ambientales y triggers Phase I |
| **Dominios MPI** | 25 |
| **Partes DDI** | IV |
| **Tipo conocimiento** | Contamination flags, EPA sites, env liens, Phase I trigger |
| **Entradas** | EPA databases, state env registries, MOT-LOC-01, MOT-LIEN-01 |
| **Salidas** | Environmental bundle, remediation flags, insurance blockers |
| **Evidencias** | E4 regulatory filing; E3 database con fecha |
| **Dependencias** | Hard: MOT-LOC-01 |
| **Cooperación** | MOT-HAZ-01, MOT-REG-01, MOT-EVD-02 |
| **Criticidad** | C |
| **Cobertura esperada** | 100% sitios conocidos en radio reglamentario |
| **Métricas** | Env blocker detection rate; Phase I trigger accuracy |
| **Restricciones** | UST/LUST proximity — trigger Obl. |
| **Nunca actúa** | Clear ambiental sin búsqueda registries |

---

## CAP-15 — MERCADO, COMPARABLES Y VALORACIÓN

### MOT-MKT-01 — Submarket Dynamics Motor

| Campo | Definición |
|-------|------------|
| **Capacidad padre** | CAP-15 |
| **Misión** | Dominar dinámica micro-mercado, absorción y tendencias locales |
| **Dominios MPI** | 26 |
| **Partes DDI** | IV |
| **Tipo conocimiento** | Market trends, DOM median, absorption, inventory pressure |
| **Entradas** | MLS aggregates, census tract, MOT-LOC-01 |
| **Salidas** | Submarket bundle, trend direction, supply pressure |
| **Evidencias** | E3 MLS aggregate; E2 trend inference etiquetado |
| **Dependencias** | Hard: MOT-LOC-01 |
| **Cooperación** | MOT-MKT-02, MOT-MKT-03, MOT-CTX-01 |
| **Criticidad** | A |
| **Cobertura esperada** | ≥90% submarket metrics Obl. |
| **Métricas** | Trend freshness; absorption accuracy |
| **Restricciones** | Inferencia trend — E1/C2 máximo |
| **Nunca actúa** | Sustituir comps por macro trend |

### MOT-MKT-02 — Comparable Sales Selection Motor

| Campo | Definición |
|-------|------------|
| **Capacidad padre** | CAP-15 |
| **Misión** | Seleccionar y calificar comparables arm's-length para valoración |
| **Dominios MPI** | 27 |
| **Partes DDI** | IV |
| **Tipo conocimiento** | Comp set, adjustments rationale, arm's-length flags |
| **Entradas** | MLS sold, recorder deeds, MOT-PHY-01, MOT-LOC-01 |
| **Salidas** | Qualified comp set, comp quality score |
| **Evidencias** | E4 deed transfer; E3 MLS sold |
| **Dependencias** | Hard: MOT-IDN-01, MOT-PHY-01 |
| **Cooperación** | MOT-MKT-03, MOT-CHR-02 |
| **Criticidad** | C |
| **Cobertura esperada** | ≥3 comps o flag insuficiente |
| **Métricas** | Comp quality score; arm's-length % |
| **Restricciones** | <3 comps — insufficiency flag Obl. |
| **Nunca actúa** | Incluir non-arm's-length sin etiqueta |

### MOT-MKT-03 — Valuation Reconciliation Motor

| Campo | Definición |
|-------|------------|
| **Capacidad padre** | CAP-15 |
| **Misión** | Reconciliar opiniones de valor AS-IS/ARV en rangos calibrados |
| **Dominios MPI** | 28 |
| **Partes DDI** | IV |
| **Tipo conocimiento** | AS-IS value, ARV, reconciliation range, confidence band |
| **Entradas** | MOT-MKT-02 comps, MOT-PHY-02, MOT-REG-03, BPO/appraisal si existe |
| **Salidas** | Valuation bundle, range width, reconciliation notes |
| **Evidencias** | E3–E4 según fuente valoración |
| **Dependencias** | Hard: MOT-MKT-02 |
| **Cooperación** | MOT-FIN-01, MOT-INV-01, MOT-EVD-02 |
| **Criticidad** | C |
| **Cobertura esperada** | 100% Diamond con path valoración |
| **Métricas** | Valuation range width; reconciliation disclosure rate |
| **Restricciones** | AVM único prohibido como C1 |
| **Nunca actúa** | Punto único sin rango |

---

## CAP-16 — RENTABILIDAD Y ESTRATEGIA

### MOT-INV-01 — Pro Forma Profitability Motor

| Campo | Definición |
|-------|------------|
| **Capacidad padre** | CAP-16 |
| **Misión** | Modelar pro forma, ROI, IRR y sensibilidad por escenario |
| **Dominios MPI** | 29 |
| **Partes DDI** | IV |
| **Tipo conocimiento** | Pro forma, ROI, IRR, sensitivity tables, scenario outcomes |
| **Entradas** | MOT-MKT-03, MOT-FIN-01, MOT-PHY-01, MOT-REG-01, rehab estimates |
| **Salidas** | Profitability bundle, sensitivity flags, assumption log |
| **Evidencias** | E2–E3 modelado; E4 inputs materiales |
| **Dependencias** | Hard: MOT-MKT-03, MOT-FIN-01 |
| **Cooperación** | MOT-INV-02, MOT-SYN-01, MOT-EXE-01 |
| **Criticidad** | C |
| **Cobertura esperada** | 100% escenarios flip/rehab Obl. |
| **Métricas** | Assumption disclosure rate; sensitivity completeness |
| **Restricciones** | Supuestos no declarados — bloqueo IC |
| **Nunca actúa** | ROI garantizado; asignar access_tier |

### MOT-INV-02 — Investment Strategy Fit Motor

| Campo | Definición |
|-------|------------|
| **Capacidad padre** | CAP-16 |
| **Misión** | Evaluar encaje estratégico flip/rehab/rental/wholesale y viabilidad |
| **Dominios MPI** | 30 |
| **Partes DDI** | IV |
| **Tipo conocimiento** | Strategy ranking, viability score, market-strategy fit |
| **Entradas** | MOT-INV-01, MOT-MKT-01, MOT-HAZ-01, MOT-REG-02, MOT-LIV-01 |
| **Salidas** | Strategy bundle, recommended paths, kill criteria flags |
| **Evidencias** | E2 inference; E3–E4 inputs upstream |
| **Dependencias** | Hard: MOT-INV-01 |
| **Cooperación** | MOT-SYN-01, MOT-DCN-03 |
| **Criticidad** | C |
| **Cobertura esperada** | ≥2 estrategias evaluadas por Diamond |
| **Métricas** | Strategy-market fit score; kill criteria trigger rate |
| **Restricciones** | Inferencia siempre etiquetada E1/E2 |
| **Nunca actúa** | Decision-Diamond; publicación producto |

---

## CAP-17 — CONTEXTO DEMOGRÁFICO Y ECONÓMICO

### MOT-CTX-01 — Demographic Context Motor

| Campo | Definición |
|-------|------------|
| **Capacidad padre** | CAP-17 |
| **Misión** | Dominar demografía local: población, ingresos, vivienda |
| **Dominios MPI** | 31 |
| **Partes DDI** | V |
| **Tipo conocimiento** | Population growth, median income, household composition, housing stock |
| **Entradas** | Census ACS, municipal stats, MOT-LOC-01 |
| **Salidas** | Demographic bundle, growth trends |
| **Evidencias** | E3 census vintage declarado |
| **Dependencias** | Hard: MOT-LOC-01 |
| **Cooperación** | MOT-CTX-02, MOT-MKT-01, MOT-LIV-02 |
| **Criticidad** | S |
| **Cobertura esperada** | ≥85% métricas Obl. Dominio 31 |
| **Métricas** | Demographic freshness; tract assignment accuracy |
| **Restricciones** | Contextual — no sustituye comps |
| **Nunca actúa** | Decisión fair housing producto |

### MOT-CTX-02 — Local Economy & Employment Motor

| Campo | Definición |
|-------|------------|
| **Capacidad padre** | CAP-17 |
| **Misión** | Dominar empleo, desempleo y diversificación económica local |
| **Dominios MPI** | 32 |
| **Partes DDI** | V |
| **Tipo conocimiento** | Unemployment rate, job growth, major employers, diversification index |
| **Entradas** | BLS, state labor stats, MOT-LOC-01 |
| **Salidas** | Economic bundle, employment trend |
| **Evidencias** | E3 official labor stats |
| **Dependencias** | Soft: MOT-CTX-01 |
| **Cooperación** | MOT-FUT-01, MOT-MKT-01 |
| **Criticidad** | S |
| **Cobertura esperada** | ≥85% métricas Obl. Dominio 32 |
| **Métricas** | Economic trend coverage; employer concentration flag |
| **Restricciones** | Vintage declarado Obl. |
| **Nunca actúa** | Micro-market pricing |

---

## CAP-18 — ENTORNO DE VIDA

### MOT-LIV-01 — Crime & Safety Trend Motor

| Campo | Definición |
|-------|------------|
| **Capacidad padre** | CAP-18 |
| **Misión** | Dominar criminalidad y tendencias seguridad en entorno inmediato |
| **Dominios MPI** | 33 |
| **Partes DDI** | V |
| **Tipo conocimiento** | Crime index, trend 3yr, violent/property breakdown |
| **Entradas** | Police stats, FBI UCR aggregates, MOT-LOC-01 |
| **Salidas** | Crime bundle, safety trend direction |
| **Evidencias** | E3 official crime stats |
| **Dependencias** | Hard: MOT-LOC-01 |
| **Cooperación** | MOT-INV-02, MOT-LIV-03 |
| **Criticidad** | A |
| **Cobertura esperada** | Trend 3yr mínimo Obl. |
| **Métricas** | Crime trend completeness; geo granularity |
| **Restricciones** | Fair Housing — uso contextual |
| **Nunca actúa** | Valoración directa; discriminación producto |

### MOT-LIV-02 — Education Assignment Motor

| Campo | Definición |
|-------|------------|
| **Capacidad padre** | CAP-18 |
| **Misión** | Dominar asignación escolar, ratings y proximidad educativa |
| **Dominios MPI** | 34 |
| **Partes DDI** | V |
| **Tipo conocimiento** | School assignment, ratings, distance, district boundaries |
| **Entradas** | District GIS, NCES, GreatSchools con lineage, MOT-LOC-01 |
| **Salidas** | Education bundle, assignment certainty |
| **Evidencias** | E3 district official; E2 third-party ratings |
| **Dependencias** | Hard: MOT-LOC-01 |
| **Cooperación** | MOT-CTX-01, MOT-LIV-03 |
| **Criticidad** | A |
| **Cobertura esperada** | 100% assignment para residencial |
| **Métricas** | School assignment accuracy; boundary currency |
| **Restricciones** | Boundary change — flag temporal |
| **Nunca actúa** | Garantizar rating futuro |

### MOT-LIV-03 — Mobility & Utilities Services Motor

| Campo | Definición |
|-------|------------|
| **Capacidad padre** | CAP-18 |
| **Misión** | Dominar transporte, walkability, utilities y servicios esenciales |
| **Dominios MPI** | 35, 36 |
| **Partes DDI** | V |
| **Tipo conocimiento** | Walk/transit scores, utility providers, sewer/water, amenities |
| **Entradas** | Transit agencies, utility maps, walk score APIs con lineage, MOT-LOC-01 |
| **Salidas** | Mobility bundle, utility status, service gaps |
| **Evidencias** | E3 official utility; E2 index scores |
| **Dependencias** | Hard: MOT-LOC-01 |
| **Cooperación** | MOT-REG-01, MOT-HAZ-02 |
| **Criticidad** | S |
| **Cobertura esperada** | ≥80% servicios Obl. |
| **Métricas** | Livability completeness; utility verification rate |
| **Restricciones** | Well/septic — verificación Obl. rural |
| **Nunca actúa** | Certificar utility sin provider confirmado |

---

## CAP-19 — PROSPECTIVA Y DESARROLLO FUTURO

### MOT-FUT-01 — Future Development Pipeline Motor

| Campo | Definición |
|-------|------------|
| **Capacidad padre** | CAP-19 |
| **Misión** | Rastrear pipeline desarrollo, catalizadores y presión oferta futura |
| **Dominios MPI** | 37 |
| **Partes DDI** | V |
| **Tipo conocimiento** | Supply pipeline, megaprojects, infrastructure, net supply/demand score |
| **Entradas** | Planning dept, permits pipeline, MOT-REG-01, MOT-CTX-02 |
| **Salidas** | Prospectiva bundle, catalyst list, scenario horizons 3/5/10 yr |
| **Evidencias** | E3 planning records; E1 escenarios etiquetados |
| **Dependencias** | Soft: MOT-REG-01, MOT-MKT-01 |
| **Cooperación** | MOT-SYN-01, MOT-EXE-01 |
| **Criticidad** | A |
| **Cobertura esperada** | Pipeline Obl.; escenarios declarados |
| **Métricas** | Catalyst tracking completeness; supply pressure score |
| **Restricciones** | E1 escenarios — no promesa apreciación |
| **Nunca actúa** | Certeza de apreciación futura |

---

## CAP-20 — SOBERANÍA PROBATORIA

### MOT-EVD-01 — Master Evidence Registrar

| Campo | Definición |
|-------|------------|
| **Capacidad padre** | CAP-20 |
| **Misión** | Registrar, clasificar y auditar toda evidencia factory (E0–E4, C1–C5) |
| **Dominios MPI** | 42 |
| **Partes DDI** | VI |
| **Tipo conocimiento** | Evidence registry, E/C assignment, lineage, sufficiency status |
| **Entradas** | Salidas de **todos** los motores upstream, source metadata |
| **Salidas** | Master evidence index, sufficiency verdict, audit trail |
| **Evidencias** | Meta-evidencia del registro mismo — E4 audit chain |
| **Dependencias** | Ninguna — árbitro transversal |
| **Cooperación** | **Todos** los motores; especial MOT-EVD-02 |
| **Criticidad** | C |
| **Cobertura esperada** | 100% salidas materiales con evidence ref |
| **Métricas** | Sufficiency rate; E4 coverage; registry completeness |
| **Restricciones** | Conflicto irresoluble bloquea Decision |
| **Nunca actúa** | Crear hechos primarios de dominio |

### MOT-EVD-02 — Source Conflict Resolver

| Campo | Definición |
|-------|------------|
| **Capacidad padre** | CAP-20 |
| **Misión** | Resolver conflictos probatorios entre fuentes y motores |
| **Dominios MPI** | 42 |
| **Partes DDI** | VI |
| **Tipo conocimiento** | Conflict resolution, prevailing source, escalation status |
| **Entradas** | MOT-EVD-01 registry, conflict flags de MOT-IDN-02 y upstream |
| **Salidas** | Resolution verdict, prevailing evidence, open conflicts |
| **Evidencias** | E4 resolution log con rationale |
| **Dependencias** | Hard: MOT-EVD-01 |
| **Cooperación** | MOT-IDN-02, MOT-OCR-02, MOT-MKT-03 |
| **Criticidad** | C |
| **Cobertura esperada** | 100% conflictos materiales resueltos o escalados |
| **Métricas** | Conflict resolution time; unresolved conflict rate |
| **Restricciones** | Promedio de fuentes prohibido — prevalece jerarquía |
| **Nunca actúa** | Promediar evidencias incompatibles |

---

## CAP-21 — SÍNTESIS FACTORY

### MOT-SYN-01 — Cross-Domain Convergence Motor

| Campo | Definición |
|-------|------------|
| **Capacidad padre** | CAP-21 |
| **Misión** | Integrar corpus I–V en convergencia/divergencia y convicción factory |
| **Dominios MPI** | 43 |
| **Partes DDI** | VI |
| **Tipo conocimiento** | Convergence map, divergence flags, conviction score, open questions |
| **Entradas** | Salidas motores Capas A–E, MOT-EVD-01 sufficiency |
| **Salidas** | Synthesis bundle, conviction bands, scenario notes |
| **Evidencias** | E2–E3 synthesis; lineage a E4 upstream |
| **Dependencias** | Hard: MOT-EVD-01; Soft: motores Capa A+B mínimo |
| **Cooperación** | MOT-SYN-02, MOT-MOT-05, MOT-EXE-01 |
| **Criticidad** | C |
| **Cobertura esperada** | 100% Diamond con synthesis path |
| **Métricas** | Conviction calibration; open questions count |
| **Restricciones** | Inferencia vs fact separation Obl. |
| **Nunca actúa** | Inventar hechos; Decision-Diamond |

### MOT-SYN-02 — Decision Readiness Gate Motor

| Campo | Definición |
|-------|------------|
| **Capacidad padre** | CAP-21 |
| **Misión** | Evaluar readiness factory: blockers, gaps y kill criteria antes Decision |
| **Dominios MPI** | 43 |
| **Partes DDI** | VI |
| **Tipo conocimiento** | Readiness score, blocker list, kill criteria status, go/no-go factory |
| **Entradas** | MOT-SYN-01, MOT-EVD-01, checklist Obl. DDI |
| **Salidas** | Readiness verdict, blocker registry, gap density |
| **Evidencias** | E3 readiness audit |
| **Dependencias** | Hard: MOT-SYN-01, MOT-EVD-01 |
| **Cooperación** | MOT-DCN-03, MOT-COM-01, MOT-EXE-01 |
| **Criticidad** | C |
| **Cobertura esperada** | 100% paths Decision |
| **Métricas** | Readiness score; blocker detection rate |
| **Restricciones** | Blocker C1 sin waiver — no-go |
| **Nunca actúa** | Override evidencia insuficiente |

---

## CAP-22 — DOCUMENTACIÓN, CONVERSACIÓN Y NEGOCIACIÓN

### MOT-DCN-01 — Documentary Quality Governance Motor

| Campo | Definición |
|-------|------------|
| **Capacidad padre** | CAP-22 |
| **Misión** | Gobernar calidad, completitud y coherencia corpus documental |
| **Dominios MPI** | 39 |
| **Partes DDI** | VI |
| **Tipo conocimiento** | Document quality score, completeness gaps, redaction status |
| **Entradas** | MOT-OCR-01, MOT-OCR-02, uploads owner, checklist Dominio 39 |
| **Salidas** | Doc quality bundle, missing critical list |
| **Evidencias** | E3–E4 per document |
| **Dependencias** | Hard: MOT-OCR-01 |
| **Cooperación** | MOT-DCN-02, MOT-EVD-01 |
| **Criticidad** | C |
| **Cobertura esperada** | 100% docs en scope |
| **Métricas** | Document completeness rate; quality score distribution |
| **Restricciones** | PII redaction Obl. antes release |
| **Nunca actúa** | Contrato legal vinculante |

### MOT-DCN-02 — Conversational Intelligence Motor

| Campo | Definición |
|-------|------------|
| **Capacidad padre** | CAP-22 |
| **Misión** | Integrar diálogo owner: resúmenes, corroboración y señales conversacionales |
| **Dominios MPI** | 40 |
| **Partes DDI** | VI |
| **Tipo conocimiento** | Conversation summary, corroboration flags, motivation hints |
| **Entradas** | Call/chat transcripts, MOT-CNT-01 clearance, MOT-OWN-02 |
| **Salidas** | Conversation bundle, corroboration matrix |
| **Evidencias** | E3 transcript; E2 inference conversacional |
| **Dependencias** | Hard: MOT-CNT-01 |
| **Cooperación** | MOT-MOT-05, MOT-DCN-03, MOT-CNT-02 |
| **Criticidad** | A |
| **Cobertura esperada** | 100% conversaciones autorizadas |
| **Métricas** | Corroboration rate; TCPA compliance |
| **Restricciones** | Sin clearance MOT-CNT-01 — prohibido |
| **Nunca actúa** | Contacto sin TCPA; PII sin scope |

### MOT-DCN-03 — Negotiation Leverage & Close Probability Motor

| Campo | Definición |
|-------|------------|
| **Capacidad padre** | CAP-22 |
| **Misión** | Calcular leverage negociación, estructura deal y probabilidad cierre |
| **Dominios MPI** | 41 |
| **Partes DDI** | VI |
| **Tipo conocimiento** | Leverage score, deal structure options, close probability, walk-away default |
| **Entradas** | MOT-SYN-01, MOT-FIN-01, MOT-MOT-05, MOT-LFE-04, MOT-DCN-02 |
| **Salidas** | Negotiation bundle, structure recommendations, close prob bands |
| **Evidencias** | E2–E3 modelado; E4 deadlines upstream |
| **Dependencias** | Hard: MOT-SYN-01; Soft: MOT-DCN-02 |
| **Cooperación** | MOT-INV-02, MOT-SYN-02, MOT-COM-01 |
| **Criticidad** | C |
| **Cobertura esperada** | 100% deals activos en negociación |
| **Métricas** | Close prob calibration; walk-away trigger rate |
| **Restricciones** | Walk-away Int. por defecto |
| **Nunca actúa** | Publicación producto; asignar precio SKU |

---

## CAP-23 — EMPAQUETADO COMERCIAL

### MOT-COM-01 — Knowledge Commercialization Motor

| Campo | Definición |
|-------|------------|
| **Capacidad padre** | CAP-23 |
| **Misión** | Clasificar conocimiento comercializable vs restringido para Producto |
| **Dominios MPI** | 38 |
| **Partes DDI** | VI |
| **Tipo conocimiento** | Commercializability map, teaser/full tiers, release readiness, embargo flags |
| **Entradas** | MOT-SYN-02 readiness, MOT-CNT-02 authorization scope, corpus completo |
| **Salidas** | Commercial bundle, release matrix, restriction map |
| **Evidencias** | E3 release audit |
| **Dependencias** | Hard: MOT-CNT-02, MOT-SYN-02 |
| **Cooperación** | MOT-EXE-01; downstream Product (fuera Factory) |
| **Criticidad** | A |
| **Cobertura esperada** | 100% paths publicación candidatos |
| **Métricas** | Release readiness rate; compliance violation count |
| **Restricciones** | Sin authorization — embargo total |
| **Nunca actúa** | Precio; SKU; access_tier assignment |

---

## CAP-24 — RESUMEN EJECUTIVO INSTITUCIONAL

### MOT-EXE-01 — Institutional Executive Summary Motor

| Campo | Definición |
|-------|------------|
| **Capacidad padre** | CAP-24 |
| **Misión** | Producir memo IC integrado: tesis, riesgos, fortalezas, unknowns |
| **Dominios MPI** | 44 |
| **Partes DDI** | VI |
| **Tipo conocimiento** | Executive summary, investment thesis, top risks/strengths, known unknowns |
| **Entradas** | MOT-SYN-01, MOT-SYN-02, MOT-EVD-01, corpus Capas A–F |
| **Salidas** | IC memo bundle, disclaimer, sync timestamp |
| **Evidencias** | E3 memo con lineage completo upstream |
| **Dependencias** | Hard: MOT-SYN-01, MOT-SYN-02, MOT-EVD-01 |
| **Cooperación** | MOT-COM-01; todas upstream read-only |
| **Criticidad** | C |
| **Cobertura esperada** | 100% Diamond IC path |
| **Métricas** | IC completeness; sync lag vs corpus |
| **Restricciones** | Known unknowns Obl.; disclaimer Obl. |
| **Nunca actúa** | Crear conocimiento primario; sustituir corpus |

---

# III. Matriz maestra: Motor × CAP × MPI

| Motor | CAP | MPI | DDI | Clase |
|-------|-----|-----|-----|-------|
| MOT-IDN-01/02 | 01 | 01 | I | C |
| MOT-LOC-01/02 | 02 | 02 | I | C/A |
| MOT-PHY-01/02 | 03 | 03 | I | A |
| MOT-REG-01/02/03 | 04 | 04–06 | V | C/A |
| MOT-LEG-01 | 05 | 07 | II | C |
| MOT-OWN-01/02 | 06 | 08, 11 | II, III | C |
| MOT-LIEN-01 | 07 | 09 | II | C |
| MOT-OCR-01/02 | 25 | 10 | II | C |
| MOT-MOT-01..05 | 08 | 12 | III | C/A |
| MOT-CNT-01/02, MOT-CMP-01 | 09 | 13, 38* | III, VI | C |
| MOT-CHR-01/02 | 10 | 14 | III | C/A |
| MOT-JUD-01 | 11 | 15 | III | C |
| MOT-LFE-01..04 | 12 | 16–19 | III | C/A |
| MOT-COD-01 | 26 | 20 | III | C |
| MOT-FIN-01/02/03 | 13 | 21–23 | IV | C |
| MOT-HAZ-01/02 | 14 | 24–25 | IV | C |
| MOT-MKT-01/02/03 | 15 | 26–28 | IV | C/A |
| MOT-INV-01/02 | 16 | 29–30 | IV | C |
| MOT-CTX-01/02 | 17 | 31–32 | V | S |
| MOT-LIV-01/02/03 | 18 | 33–36 | V | A/S |
| MOT-FUT-01 | 19 | 37 | V | A |
| MOT-EVD-01/02 | 20 | 42 | VI | C |
| MOT-SYN-01/02 | 21 | 43 | VI | C |
| MOT-DCN-01/02/03 | 22 | 39–41 | VI | C/A |
| MOT-COM-01 | 23 | 38 | VI | A |
| MOT-EXE-01 | 24 | 44 | VI | C |

*MOT-CMP-01 y MOT-CNT-02 tocan Dominio 38 en scope authorization — no sustituyen MOT-COM-01.

**Cobertura verificada:** 52 motores · 26 capacidades · 44/44 dominios MPI · 6/6 partes DDI.

---

# IV. Cooperación y dependencias globales

## IV.1 Capas de motores (derivadas de FCC)

```text
CAPA 1 — FUNDACIÓN       : IDN, LOC, PHY
CAPA 2 — LEGITIMIDAD     : REG, LEG, OWN, LIEN, OCR
CAPA 3 — DISTRESS        : MOT, CNT, CHR, JUD, LFE, COD, CMP
CAPA 4 — ECONOMÍA        : FIN, HAZ, MKT, INV
CAPA 5 — ENTORNO         : CTX, LIV, FUT
CAPA 6 — INTELIGENCIA    : EVD, SYN, DCN, COM, EXE
```

## IV.2 Dependencias hard universales

| Regla | Enunciado |
|-------|-----------|
| **DEP-01** | Ningún motor Capa 3+ ejecuta sin MOT-IDN-01 resuelto |
| **DEP-02** | MOT-EVD-01 intercepta toda salida material |
| **DEP-03** | MOT-SYN-01 requiere sufficiency MOT-EVD-01 |
| **DEP-04** | MOT-EXE-01 requiere MOT-SYN-01 + MOT-SYN-02 |
| **DEP-05** | MOT-COM-01 requiere MOT-CNT-02 authorization |
| **DEP-06** | MOT-CNT-01 requiere MOT-CMP-01 clearance |
| **DEP-07** | Valoración (MOT-MKT-03) requiere identidad + comps |
| **DEP-08** | Finanzas (MOT-FIN-01) requiere gravámenes (MOT-LIEN-01) |

## IV.3 Hubs de cooperación

| Hub motor | Rol | Motores orbitales |
|-----------|-----|-------------------|
| **MOT-EVD-01** | Árbitro probatorio | Todos |
| **MOT-CHR-01** | Espina dorsal temporal | SIG, JUD, LFE, COD, MOT |
| **MOT-SYN-01** | Integrador factory | Capas A–E → Capa 6 |
| **MOT-CMP-01** | Compliance gate | ACQ, SIG, CNT |
| **MOT-IDN-01** | Ancla identidad | Todos upstream |

## IV.4 Anti-duplicidad motor

| Riesgo | Motor primario | Motor secundario | Resolución |
|--------|----------------|------------------|------------|
| Gravamen vs hipoteca | MOT-LIEN-01 | MOT-FIN-02 | Inventario vs análisis servicio |
| Corpus vs calidad doc | MOT-OCR-01 | MOT-DCN-01 | Adquisición vs governance |
| Motivación vs conversación | MOT-MOT-05 | MOT-DCN-02 | Señal vs diálogo |
| Valoración vs rentabilidad | MOT-MKT-03 | MOT-INV-01 | Valor vs retorno |
| Síntesis vs ejecutivo | MOT-SYN-01 | MOT-EXE-01 | Convicción vs presentación IC |
| Code enforcement vs signal | MOT-COD-01 | MOT-MOT-04 | Dominio vs señal distress |

---

# V. Evolución del catálogo de motores

| Tipo cambio | Proceso | Ejemplo |
|-------------|---------|---------|
| **Patch** | Clarificación ficha sin cambio misión | Métrica refinada |
| **Minor** | Nuevo MOT-XX-NN bajo CAP existente | MOT-MKT-04 nicho |
| **Major** | Nuevo motor requiere CAP nuevo (enmienda FCC) | Dominio MPI nuevo |
| **Split** | Dividir motor en dos misiones | MOT-FIN split |
| **Merge** | Fusionar motores duplicados | Deprecación MAJOR |
| **Retire** | Retiro con sucesor y histórico probatorio | MMA-14 |

**Ley:** Motor retirado permanece en registro histórico — conocimiento producido conserva lineage.

---

# VI. Gobernanza del catálogo

| Órgano | Función |
|--------|---------|
| **Motor Registry Authority** | Alta/baja MOT-XX-NN |
| **Architecture Board** | Coherencia CAP/MPI/DDI/MMA |
| **Coverage Office** | Métricas cobertura por motor |
| **Evidence Council** | Supremacía MOT-EVD-01/02 |

**Reglas:**
1. Catálogo cerrado en **52 motores** salvo enmienda OMC.  
2. Todo motor declara **un CAP padre** — sin excepción.  
3. Motor clase **X** no figura en producción.  
4. Motor sin métricas por 2 ciclos = revisión obligatoria.  
5. Producto **no crea** motores — solo consume conocimiento downstream.

---

# VII. Constitución del Catálogo de Motores — OMC

| # | Ley |
|---|-----|
| **OMC-06** | Los 52 motores son la **lista cerrada** de producción Factory 2.0 |
| **OMC-07** | Cada motor tiene **ficha completa** en este documento |
| **OMC-08** | CAP padre es **único y primario** — transversalidad declarada |
| **OMC-09** | Dominio MPI sin motor es **hueco constitucional** |
| **OMC-10** | MOT-EVD-01/02 son **árbitros** — no productores primarios |
| **OMC-11** | MOT-SYN-01/02 integran — **no inventan** hechos |
| **OMC-12** | MOT-EXE-01 presenta — **no sustituye** corpus |
| **OMC-13** | MOT-COM-01 empaqueta — **no fija** precio ni tier |
| **OMC-14** | MOT-CMP-01 tiene **veto** compliance |
| **OMC-15** | Evolución motor = enmienda OMC + MMA compliance |
| **OMC-16** | Este catálogo **somete** a FCC, MMA, MPI, DKN, DDI, DSO |

*OMC-01 a OMC-05 definidos en § Reglas del catálogo.*

---

# VIII. Leyes constitucionales — Catálogo de Motores

| # | Ley |
|---|-----|
| **LMC-01** | Sin motor catalogado no hay producción legítima |
| **LMC-02** | Motor huérfano de CAP es ilegítimo |
| **LMC-03** | Motor no catalogado en loop futuro es violación |
| **LMC-04** | Ficha incompleta invalida registro motor |
| **LMC-05** | Duplicidad de misión entre motores es deuda constitucional |
| **LMC-06** | 52 motores cubren 26 capacidades sin CAP vacío |
| **LMC-07** | Clase C bloquea Decision-Diamond si falla |
| **LMC-08** | MOT-EVD precede MOT-SYN precede MOT-EXE |
| **LMC-09** | MOT-CMP precede toda ingestión ACQ/SIG |
| **LMC-10** | MOT-IDN precede toda geolocalización y dominio |
| **LMC-11** | Cronología (MOT-CHR-01) es espin dorsal distress |
| **LMC-12** | Finanzas sin gravámenes (MOT-LIEN-01) es incompleto |
| **LMC-13** | Valoración sin identidad es inválida |
| **LMC-14** | Contacto sin MOT-CNT-01/MOT-CMP-01 es ilegítimo |
| **LMC-15** | Comercial sin authorization (MOT-CNT-02) es embargo |
| **LMC-16** | Entorno no sustituye micro-market (MOT-MKT) |
| **LMC-17** | Prospectiva (MOT-FUT-01) es escenario — no promesa |
| **LMC-18** | Documento específico por motor deriva de esta ficha |
| **LMC-19** | Loop futuro ejecuta motores — no redefine misión |
| **LMC-20** | Código obedece catálogo — catálogo no obedece código |

---

# IX. Preparación para documentos posteriores

| Orden | Documento | Relación con OMC |
|-------|-----------|------------------|
| **1** | **Official Motor Catalog** | **Este documento** — base cerrada |
| **2** | **Loops Architecture** | Cuándo re-ejecutar cada MOT-XX-NN |
| **3** | **Swarms Architecture** | Coordinación multi-motor (MOT-MOT-05, MOT-EVD-02, MOT-SYN-01) |
| **4** | **IA Governance** | Asistencia por motor sin violar MOT-EVD-01 |
| **5** | **Full Orchestration** | Orquestación Capas 1→6 |
| **6+** | **Motor Specific Docs** | Una ficha OMC → un documento por motor |

**Dependencia:** Ningún loop, enjambre ni implementación puede ejecutar motor no listado en el Índice Maestro §52.

---

# Resumen ejecutivo

| Métrica | Valor |
|---------|-------|
| Motores oficiales catalogados | **52** |
| Capacidades padre (CAP) | **26 / 26** |
| Dominios MPI cubiertos | **44 / 44** |
| Partes DDI referenciadas | **6 / 6** |
| Motores clase C (críticos) | **35** |
| Motores clase A (alta) | **12** |
| Motores clase S (estándar) | **5** |
| Motores transversales declarados | **3** (EVD-01, EVD-02, CMP-01) |
| Capas de dependencia motor | **6** |
| Leyes OMC (OMC-01..16) | **16** |
| Leyes LMC | **20** |
| Hubs cooperación | **5** |
| Reglas dependencia DEP | **8** |

---

*OFFICIAL MOTOR CATALOG — Catálogo Oficial de Motores. Duodécimo documento oficial de la Auditoría Maestra RealEstateSniper Factory 2.0. Instancia concreta de los 52 motores autorizados bajo 26 capacidades permanentes. Base para Loops Architecture y documentos específicos por motor.*

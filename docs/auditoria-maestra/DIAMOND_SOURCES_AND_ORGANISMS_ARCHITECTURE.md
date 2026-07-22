# DIAMOND SOURCES & ORGANISMS ARCHITECTURE

**Arquitectura de Fuentes y Organismos Diamond — Auditoría Maestra RealEstateSniper Factory 2.0**

**Autoridad:** Noveno documento oficial de la Auditoría Maestra. Primer documento de la **Fase II — Producción del Conocimiento**. Deriva obligatoriamente del **MASTER PROPERTY INTELLIGENCE INDEX**, de la **DIAMOND KNOWLEDGE CONSTITUTION** y del **Diamond Data Inventory** completo (Partes I–VI, **2.265 elementos**, **44 dominios MPI**).  
**Alcance:** Definir **de dónde** Factory 2.0 puede obtener legalmente y con máxima confianza el conocimiento inventariado; **qué organismos** intervienen; **qué tipología de fuente** corresponde a cada familia de conocimiento; y **cómo** se gobiernan conflicto, evidencia, actualización y compliance.  
**Exclusión expresa:** Implementación, programación, código, APIs concretas, motores, loops, enjambres, IA, persistencia, infraestructura y decisiones de ingeniería.

**Pregunta rectora de este documento:**

> *¿De dónde puede obtener Factory — legalmente, con trazabilidad y con confianza institucional — cada familia de conocimiento necesaria para construir un Diamond?*

---

## Apertura de la Fase II

| Fase | Estado | Naturaleza |
|------|--------|------------|
| **Fase I — Inventario** | Cerrada | **Qué** debe conocerse (DDI, 2.265 elementos) |
| **Fase II — Producción** | Abierta | **De dónde** y **cómo** se obtiene el conocimiento |
| **Este documento** | Primer bloque Fase II | Arquitectura de **fuentes y organismos** |

**Ley de no expansión:** Este documento **mapea** fuentes a elementos existentes. No crea campos nuevos. Toda adición al inventario requiere enmienda al DDI.

---

# I. Filosofía de fuentes

## I.1 Tesis rectora

> **Un Diamond no se construye con datos. Se construye con conocimiento trazable a fuentes legítimas.**

Factory no acumula volumen. Factory **establece procedencia**: cada afirmación material debe poder responder *¿quién lo dice, con qué autoridad, con qué frescura y con qué nivel de evidencia?*

## I.2 Principios filosóficos

| Principio | Enunciado |
|-----------|-----------|
| **Procedencia soberana** | Sin procedencia declarada no hay conocimiento — solo dato |
| **Primacía registral** | El registro público prevalece sobre narrativa comercial |
| **No inferencia como primaria** | La inferencia enriquece — no sustituye fuente primaria |
| **Convergencia sobre singularidad** | Una fuente aislada no basta para Decision-Diamond en bloques críticos |
| **Compliance antes que velocidad** | Fuente prohibida o irregular **no entra** — aunque sea rápida |
| **Frescura declarada** | Dato sin fecha de vigencia es dato sospechoso |
| **Conflicto explícito** | Dos fuentes legítimas en conflicto **no se promedian** — se resuelven |
| **PII restringida** | Fuente de contacto obedece autorización — no conveniencia |
| **Comercial ≠ verdad** | Fuente comercial aporta señal — no certeza registral |
| **Territorialidad** | Cada activo obedece jurisdicción local — no modelo nacional único |

## I.3 Perspectiva institucional

| Pregunta del comité | Exigencia de fuente |
|---------------------|---------------------|
| ¿Quién certifica esto? | Organismo o entidad con autoridad reconocible |
| ¿Es arm's length? | Venta, alquiler y comparable exigen independencia |
| ¿Está inscrito? | Title, liens y gravámenes exigen cadena registral |
| ¿Quién lo dijo el owner? | Conversación exige consentimiento y trazabilidad |
| ¿Qué pasa si dos fuentes discrepan? | Reglas de conflicto — no silencio |
| ¿Cuándo dejó de ser válido? | Reglas de actualización |

---

# II. Jerarquía de fuentes

## II.1 Niveles epistémicos

```text
NIVEL 1 — PRIMARIA SOBERANA
  Registro público · Instrumento inscrito · Sentencia · Acto administrativo
  Evidencia típica: E4 · Confianza objetivo: C1–C2

NIVEL 2 — PRIMARIA ESPECIALIZADA
  Tasación independiente · Title commitment · Payoff lender · Inspección certificada
  Evidencia típica: E3–E4 · Confianza objetivo: C2–C3

NIVEL 3 — SECUNDARIA VERIFICADA
  Agregador con trazabilidad a primaria · Plataforma comercial auditada · MLS vía canal legítimo
  Evidencia típica: E2–E3 · Confianza objetivo: C3–C4

NIVEL 4 — SECUNDARIA CONTEXTUAL
  Census · Índices mercado · Estadísticas agencias · Modelos AVM
  Evidencia típica: E2 · Confianza objetivo: C3–C4

NIVEL 5 — ENRIQUECIMIENTO
  Observación campo · Fotografía · Estimación factory calibrada · Señal distress agregada
  Evidencia típica: E1–E2 · Confianza objetivo: C4–C5

NIVEL 6 — PROHIBIDA / INVÁLIDA
  Scraping irregular · PII sin consentimiento · Fuente falsificada · Lista comprada ilegítima
  Evidencia: N/A · Confianza: DESCARTE
```

## II.2 Definiciones

| Término | Definición |
|---------|------------|
| **Fuente primaria** | Emite el dato en ejercicio de autoridad legal, contractual o registral directa |
| **Fuente secundaria** | Republica, agrega o interpreta datos de primarias con trazabilidad verificable |
| **Fuente terciaria** | Modelo, índice o inferencia sin acceso directo al hecho subyacente |
| **Fuente de verificación** | Existe para confirmar o refutar una afirmación de otra fuente |
| **Fuente de enriquecimiento** | Añade contexto no bloqueante para decisión |
| **Fuente comercial** | Proveedor privado bajo licencia, suscripción o acuerdo |
| **Fuente pública** | Entidad gubernamental, registral o estadística sin coste de acceso base |
| **Fuente restringida** | Acceso condicionado: licencia, NDA, autorización owner o compliance |

## II.3 Matriz oficial vs comercial vs pública

| Dimensión | Pública | Comercial | Mixta |
|-----------|---------|-----------|-------|
| **Autoridad** | Soberana estatal/municipal | Contractual privada | Republicación licenciada de público |
| **Ejemplo tipo** | County recorder, FEMA, Census | MLS, data vendor, AVM | Agregador assessor licenciado |
| **Uso Diamond** | Bloques críticos I–II, 09–10 | Mercado, comps, enriquecimiento | Verificación y normalización |
| **Riesgo** | Baja si vigente | Media — licencia y sesgo | Media — dependencia proveedor |

---

# III. Taxonomía de familias de fuentes

## III.1 Fuentes registrales y de título

| Familia | Organismos tipo | Dominios MPI | Parte DDI |
|---------|-----------------|--------------|-----------|
| **Registro de la propiedad** | County Recorder / Registrar of Deeds; Oficina de gravámenes estatal | 07, 08, 09, 10 | II |
| **Title y escrow** | Title company; settlement agent; title plant | 07, 08, 09, 10 | II |
| **Identificación parcelaria** | County Assessor; GIS parcel office | 01, 02 | I |
| **Instrumentos inscritos** | Deed, mortgage, lien, lis pendens, easement | 09, 10, 22 | II, IV |

**Clasificación:** Primaria soberana (E4). **Obligatoria** para Diamond.

---

## III.2 Fuentes fiscales

| Familia | Organismos tipo | Dominios MPI | Parte DDI |
|---------|-----------------|--------------|-----------|
| **Impuesto predial** | County Treasurer / Tax Collector; Assessor roll | 23 | IV |
| **Tax lien / sale** | Tax collector; tax sale auctioneer; certificate holder | 09, 19, 23 | II, III, IV |
| **Reassessment** | Assessor; board of equalization | 23, 21 | IV |
| **IRS / federal tax lien** | IRS recorded lien (vía registro) | 09, 23 | II, IV |

**Clasificación:** Primaria (roll, certificado) o secundaria verificada (agregador fiscal licenciado).

---

## III.3 Fuentes judiciales y ejecución

| Familia | Organismos tipo | Dominios MPI | Parte DDI |
|---------|-----------------|--------------|-----------|
| **Tribunales civiles** | Superior Court; District Court; case index | 15, 07 | III, II |
| **Foreclosure** | Court; trustee sale notices; sheriff sale | 15, 19, 22 | III, IV |
| **Probate** | Probate court; personal representative | 16, 18 | III |
| **Divorcio** | Family court; divorce decree | 17 | III |
| **Bankruptcy** | Federal bankruptcy court | 07, 15, 21 | II, III, IV |
| **Ejecución hipotecaria** | Trustee; attorney foreclosure; NOD/NTS publicados | 19, 22 | III, IV |

**Clasificación:** Primaria (acto judicial, notice publicado conforme ley).

---

## III.4 Fuentes municipales y code enforcement

| Familia | Organismos tipo | Dominios MPI | Parte DDI |
|---------|-----------------|--------------|-----------|
| **Código y violaciones** | Code enforcement; neighborhood services; blight registry | 20 | III |
| **Condemnation / demo** | Building safety; fire marshal municipal | 20, 04 | III, V |
| **Rental registry** | Housing department; rental license office | 04, 20 | V, III |
| **Vacant property** | Vacant registry municipal | 14, 20 | III |
| **Multas y liens municipales** | Municipal court; city attorney | 09, 20 | II, III |

**Clasificación:** Primaria administrativa municipal.

---

## III.5 Fuentes de zoning, urbanismo y permisos

| Familia | Organismos tipo | Dominios MPI | Parte DDI |
|---------|-----------------|--------------|-----------|
| **Zoning** | Planning department; zoning administrator; zoning map oficial | 06, 05 | V |
| **General / specific plan** | City planning commission; county planning | 05, 37 | V |
| **Permisos de obra** | Building department; permit portal municipal | 04, 03 | V, I |
| **Certificate of Occupancy** | Building official | 04 | V |
| **Variances / CUP** | Zoning board of appeals; planning hearing records | 06, 04 | V |
| **Historic preservation** | Historic commission | 04, 05 | V |
| **STR regulation** | Municipal STR registry; zoning STR rules | 04, 06 | V |

**Clasificación:** Primaria administrativa. **Crítica** para tesis dev, ADU, STR.

---

## III.6 Fuentes de mercado, comparables y valoración

| Familia | Organismos tipo | Dominios MPI | Parte DDI |
|---------|-----------------|--------------|-----------|
| **MLS y listing** | MLS regional; broker feed licenciado | 26, 27, 14 | IV |
| **Ventas públicas** | Recorder deed; assessor transfer; tax stamp | 27, 28 | IV |
| **AVM / estimadores** | Proveedor comercial AVM; agregador valoración | 28, 21 | IV |
| **Tasación independiente** | Appraiser licenciado estatal; appraisal report | 28 | IV |
| **Índices mercado** | FHFA HPI; Case-Shiller; vendor índices locales | 26, 37 | IV, V |
| **DOM / absorción** | MLS analytics; vendor mercado licenciado | 26 | IV |

**Clasificación:** Ventas inscritas = primaria; MLS = secundaria verificada (arm's length); AVM = terciaria.

**Regla arm's length:** Comparables distress excluidos de ARV salvo tesis explícita (DDI-IV).

---

## III.7 Fuentes de alquiler y rent roll

| Familia | Organismos tipo | Dominios MPI | Parte DDI |
|---------|-----------------|--------------|-----------|
| **Rent comps** | MLS rental; vendor rent survey; property manager data | 27, 29 | IV |
| **Rent control registry** | Rent board municipal; housing authority | 23, 06 | IV, V |
| **Section 8 / HUD** | Housing authority; HUD FMR tables | 30, 29 | IV |
| **STR calendars** | Plataforma STR (licenciada); municipal STR data | 30, 04 | IV, V |
| **Rent roll directo** | Owner disclosure autorizado; property manager autorizado | 21, 29 | IV |

**Clasificación:** Secundaria verificada o primaria contractual con autorización.

---

## III.8 Fuentes de riesgo natural

| Familia | Organismos tipo | Dominios MPI | Parte DDI |
|---------|-----------------|--------------|-----------|
| **Inundación** | FEMA NFHL; flood certificate engineer | 24 | IV |
| **Sísmico** | USGS; state geological survey; building seismic retrofit records | 24 | IV |
| **Incendio forestal** | State forestry; CAL FIRE maps; wildfire hazard SOI | 24 | IV |
| **Huracán / viento** | FEMA wind maps; building code wind zone | 24 | IV |
| **Radón / geológico** | EPA radon zone; county hazard disclosure | 24, 25 | IV |

**Clasificación:** Primaria pública (mapas oficiales); certificados = primaria especializada.

---

## III.9 Fuentes de riesgo ambiental

| Familia | Organismos tipo | Dominios MPI | Parte DDI |
|---------|-----------------|--------------|-----------|
| **Contaminación** | EPA Superfund; state env agency; Phase I ESA report | 25 | IV |
| **UST / LUST** | State env tank registry | 25 | IV |
| **Wetlands** | Army Corps / state wetland inventory | 25, 05 | IV, V |
| **Asbestos / lead** | Inspection certificada; building records | 25, 03 | IV, I |
| **Environmental lien** | Recorder; env agency order | 09, 25 | II, IV |

**Clasificación:** Primaria (orden agency, lien inscrito); Phase I/II = primaria especializada.

---

## III.10 Fuentes demográficas, económicas y de entorno

| Familia | Organismos tipo | Dominios MPI | Parte DDI |
|---------|-----------------|--------------|-----------|
| **Demografía** | U.S. Census Bureau; ACS; state demographer | 31 | V |
| **Empleo** | BLS; state labor department; BEA | 32 | V |
| **Criminalidad** | FBI UCR; local PD statistics; county sheriff | 33 | V |
| **Educación** | State DOE; school district; NCES; GreatSchools (secundaria) | 34 | V |
| **Transporte** | DOT estatal/federal; transit authority; Walk Score (secundaria) | 35 | V |
| **Servicios / utilities** | Utility provider; FCC broadband map; hospital CMS data | 36 | V |
| **Desarrollo futuro** | Planning commission agendas; CEQA/NEPA filings; developer filings públicos | 37 | V |

**Clasificación:** Agencias públicas = secundaria contextual (E2–E3); no sustituyen micro-market del activo.

---

## III.11 Fuentes de propietario, contacto y conversación

| Familia | Organismos tipo | Dominios MPI | Parte DDI |
|---------|-----------------|--------------|-----------|
| **Titular registral** | Recorder deed; assessor owner roll; title plant | 08, 11 | II, III |
| **Verificación identidad** | Owner directo; documento identidad autorizado; notario | 08, 11, 13 | II, III |
| **Motivación declarada** | Owner interview autorizado; written statement firmado | 12 | III |
| **Contacto** | Owner proporcionado; agente autorizado; attorney representative | 13 | III |
| **Conversación** | Llamada grabada con consent; email; SMS con opt-in TCPA | 40 | VI |
| **Autorización comercial** | Formulario owner authorization; scope firmado | 38, 40 | VI |

**Clasificación:** Primaria contractual con **consentimiento explícito**. **Máximo cuidado compliance.**

| Riesgo | Regla |
|--------|-------|
| TCPA | Sin opt-in válido — fuente prohibida para contacto |
| PII | Sin authorization scope — Int. permanente |
| Coerción | Indicadores de coerción — bloqueo Diamond |
| Lista comprada | **Fuente prohibida** |

---

## III.12 Fuentes documentales e inteligencia documental

| Familia | Organismos tipo | Dominios MPI | Parte DDI |
|---------|-----------------|--------------|-----------|
| **Corpus registral** | Recorder; title company; escrow package | 10, 39 | II, VI |
| **Inspección física** | Home inspector licenciado; engineer; pest inspector | 03, 10 | I, II |
| **Survey** | Licensed land surveyor | 02, 05 | I, V |
| **HOA documents** | HOA management; resale package | 10, 21 | II, IV |
| **Lease / rent roll** | Owner autorizado; PM autorizado | 10, 29 | II, IV |
| **Data room** | Factory-curated bajo gobernanza documental | 39 | VI |

**Clasificación:** Documento original = E4; copia certificada = E3–E4.

---

# IV. Mapeo fuentes × dominios MPI (44)

| Dom. | Dominio MPI | Fuente primaria tipo | Fuente secundaria tipo | Fuente verificación | Fuente enriquecimiento |
|------|-------------|----------------------|------------------------|---------------------|------------------------|
| **01** | Identificación | Assessor parcel ID; recorder | Agregador parcel licenciado | Cross-match GIS + deed | Normalización dirección |
| **02** | Localización | Survey; GIS oficial; assessor | Geocoder auditado | Parcel boundary match | Street view observación |
| **03** | Características físicas | Assessor roll; inspection certificada | MLS histórico; vendor físico | Visita / fotos campo | Estimación condición |
| **04** | Permisos | Building dept; permit portal | Contractor records (sec.) | CO vs as-built | — |
| **05** | Urbanismo | Planning dept; general plan | Consultant planning report | Zoning map overlay | — |
| **06** | Zonificación | Zoning ordinance; official map | Rezoning application public | Attorney opinion (E3) | — |
| **07** | Situación legal | Court; title commitment | Litigation search vendor | Title attorney | — |
| **08** | Titularidad | Recorded deed; assessor owner | Title plant | Owner verification directa | — |
| **09** | Gravámenes | Recorded instruments | Title search abstract | Payoff statement lender | — |
| **10** | Documentación oficial | Recorder; escrow; HOA | Document vendor | Autenticidad notarial | — |
| **11** | Situación owner | Owner disclosure autorizado | Public records indirectos | Titular match | — |
| **12** | Motivación venta | Owner statement; convergencia señales | Distress records públicos | Cross-domain distress | Inferencia calibrada |
| **13** | Contactabilidad | Owner opt-in; agent autorizado | — | TCPA compliance check | — |
| **14** | Historial inmueble | Recorder chain; MLS history | Vendor transaction history | Tax transfer stamps | — |
| **15** | Procedimientos judiciales | Court index | Litigation search | Lis pendens recording | — |
| **16** | Probate | Probate court | Notice publication | Attorney confirmación | — |
| **17** | Divorcio | Family court decree | — | Title impediment check | — |
| **18** | Herencia | Probate; affidavit heirship recorded | — | Title review | — |
| **19** | Subastas | Trustee notice; sheriff sale | Auction platform pública | Court order | — |
| **20** | Código municipal | Code enforcement dept | 311 data municipal | Re-inspection record | — |
| **21** | Situación financiera | Payoff; tax roll; owner disclosure | AVM; rent estimate | Lender statement | Modelo factory |
| **22** | Hipotecas | Recorded mortgage; NOD/NTS | Mortgage history vendor | Payoff quote | — |
| **23** | Impuestos | Tax collector; assessor | Tax data aggregator | Certificate tax lien | — |
| **24** | Riesgos naturales | FEMA; USGS; state hazard maps | Insurance quote | Engineer cert | — |
| **25** | Riesgos ambientales | EPA; state env; Phase I ESA | Env vendor database | Phase II si trigger | — |
| **26** | Mercado inmobiliario | MLS; recorder transfers | Market analytics vendor | Census context | — |
| **27** | Comparables | Recorded sales; MLS closed | AVM comp set | Appraiser selection | Ajuste factory |
| **28** | Valoraciones | Appraisal; recorded sales | AVM; BPO | Reconciliación multi-método | Modelo interno |
| **29** | Rentabilidad | Rent roll; actuals owner | Rent survey | Pro forma benchmark | Sensibilidad factory |
| **30** | Estrategias | Convergencia dominios I–V | Market strategy benchmarks | Viabilidad score factory | — |
| **31** | Demografía | Census ACS | Demographics vendor | Cross-vintage check | — |
| **32** | Economía entorno | BLS; BEA | Local econ vendor | Employer press release | — |
| **33** | Criminalidad | FBI UCR; PD stats | Crime data vendor | Trend 3yr mínimo | — |
| **34** | Educación | State DOE; district | School rating vendor | Assigned school GIS | — |
| **35** | Transporte | DOT; transit authority | Walk/transit score vendor | Commute time sample | — |
| **36** | Servicios | Utility; FCC; CMS hospital | POI commercial database | Field verification | — |
| **37** | Desarrollo futuro | Planning agenda; EIR público | Developer announcement | Permit futuro filed | Probabilidad factory |
| **38** | Inteligencia comercial | Authorization owner; DDI mapping | Product catalog rules | Compliance review | — |
| **39** | Inteligencia documental | Master index factory; originals | Scan/OCR pipeline (futuro) | Autenticidad checklist | — |
| **40** | Inteligencia conversacional | Record consentido owner | — | Corroboration record | Summary factory |
| **41** | Inteligencia negociación | Owner terms; lender payoff | Broker feedback | Close probability model | — |
| **42** | Evidencias | Registry maestro factory | — | Cross-source resolution | — |
| **43** | Inteligencia Factory | Síntesis I–V + 42 | — | Decision gate rules | Inferencia declarada |
| **44** | Resumen ejecutivo | Agregación 01–43 | — | IC checklist | — |

---

# V. Mapeo fuentes × partes DDI

| Parte DDI | Dominios | Familias fuente dominantes | Nivel mínimo evidencia | Fuentes prohibidas en bloque |
|-----------|----------|----------------------------|------------------------|------------------------------|
| **I** | 01–03 | Registral, assessor, GIS, inspección | E3 en identidad; E2 en físico | Geocoder sin verificar como única fuente |
| **II** | 07–10 | Registral, judicial, title, documental | E4 en deed/lien; E3 en legal | Title sin commitment en Diamond |
| **III** | 11–20 | Owner autorizado, judicial, municipal, cronología | E3 en motivación; E4 en judicial activo | Contacto sin TCPA; PII sin auth |
| **IV** | 21–30 | Fiscal, lender, FEMA, mercado, appraisal | E3 en equity; E2 en pro forma | AVM como única valoración |
| **V** | 04–06, 31–37 | Municipal, planning, census, agencias | E2–E3 contextual | Rating vendor sin fuente pública |
| **VI** | 38–44 | Síntesis, evidencia, conversación, documental | E2 en síntesis; E4 en auth | Síntesis sin corpus I–V |

---

# VI. Fuentes prohibidas

| # | Categoría prohibida | Razón | Consecuencia |
|---|---------------------|-------|--------------|
| **FP-01** | Listas de contacto compradas sin consentimiento | TCPA; privacidad | Descarte contacto |
| **FP-02** | Scraping de portales con violación ToS | Legal; integridad | Descarte fuente |
| **FP-03** | Registros obtenidos mediante suplantación | Fraude | Descarte + bloqueo |
| **FP-04** | Documentos sin cadena de custodia | Autenticidad | No sustenta E4 |
| **FP-05** | Conversación sin consentimiento grabación donde exigido | Legal estatal | Descarte conversacional |
| **FP-06** | Datos de menores o PII fuera de scope | Compliance | Int. permanente |
| **FP-07** | Fuente conocida falsificada o alterada | Integridad | Bloqueo Diamond |
| **FP-08** | Dark web / breach data | Ilegal | Prohibición absoluta |
| **FP-09** | Skip trace agresivo sin base legal | FDCPA/TCPA | Descarte |
| **FP-10** | Inferencia única presentada como hecho | DDI-VI / DKN | Reclasificar E1 |

---

# VII. Fuentes de baja confianza

| Categoría | Descripción | Uso permitido | Uso prohibido |
|-----------|-------------|---------------|---------------|
| **FL-01** | Red social no verificada | Señal débil distress | Motivación primaria |
| **FL-02** | AVM sin disclosed methodology | Triangulación | Valoración única |
| **FL-03** | Crowd-sourced crime map | Contexto | Decision seguridad |
| **FL-04** | Owner verbal sin registro | Hipótesis | Equity confirmado |
| **FL-05** | Blog / foro inmobiliario | Sentiment | Comparables |
| **FL-06** | Zestimate-type sin reconciliación | Rango indicativo | ARV institucional |
| **FL-07** | Foto MLS desactualizada | Señal condición | Inspección sustituta |
| **FL-08** | Agregador sin SLAs ni lineage | Enriquecimiento | Title o lien |

**Regla:** Baja confianza exige **etiqueta explícita** y **no alcanza C1–C2** en bloques críticos.

---

# VIII. Reglas de conflicto entre fuentes

| Prioridad | Regla | Ejemplo |
|-----------|-------|---------|
| **R1** | Registro inscrito > declaración verbal owner | Deed vs owner dice otra cosa |
| **R2** | Acto judicial vigente > agregador comercial | Lis pendens activo |
| **R3** | Fuente más fresca > fuente obsoleta mismo nivel | Payoff quote reciente |
| **R4** | Primaria especializada > terciaria mismo tema | Appraisal vs AVM |
| **R5** | Convergencia ≥2 independientes > fuente única | Motivación distress |
| **R6** | Conflicto irresoluble = flag bloqueante | Unresolved Material Conflict |
| **R7** | No promediar valores incompatibles | Assessor vs appraisal |
| **R8** | Documentar resolución antes de Decision-Diamond | Conflict Resolution Rationale |

**Árbitro constitucional:** Dominio 42 (Evidencias) gobierna conflicto — no Dominio 43.

---

# IX. Reglas de evidencia

| Regla | Enunciado |
|-------|-----------|
| **RE-01** | Toda afirmación material mapea a ≥1 evidencia en registro maestro |
| **RE-02** | E4 reservado a instrumento inscrito, sentencia, acto admin formal |
| **RE-03** | E3 mínimo para titularidad, gravamen prioritario, CO vigente |
| **RE-04** | E2 mínimo para mercado, demografía, pro forma |
| **RE-05** | E1 solo con etiqueta inferencia/hypothesis |
| **RE-06** | C1–C2 exigen E4 o convergencia E3+E3 independientes |
| **RE-07** | Hearsay owner no eleva C1 sin corroboración registral |
| **RE-08** | Evidence Bundle Reference obligatorio por dominio activo |
| **RE-09** | Contradicción no resuelta bloquea elevación de C |
| **RE-10** | Suficiencia probatoria evaluada antes de Decision-Diamond |

---

# X. Reglas de actualización

| Tipo conocimiento | Frescura máxima recomendada | Trigger re-validación |
|-------------------|----------------------------|------------------------|
| Title / liens | 30 días pre-cierre | Nuevo instrumento inscrito |
| Payoff mortgage | 30 días | Cambio tasa o estado default |
| Tax status | 90 días | Delinquency notice |
| Permits / CO | 180 días | Nueva obra o inspección |
| MLS / comps | 90 días mercado activo | Venta comparable nueva |
| FEMA / hazard maps | Anual o post-revision mapa | Map revision FEMA |
| Census / demo | Vintage ACS declarado | Nuevo vintage publicado |
| Owner conversation | 60 días contacto significativo | Nueva interacción |
| Executive summary | Sincronizado con corpus | Cualquier cambio C1–C2 |
| Crime trend | 12 meses rolling mínimo | Spike departamental |

**Regla:** Dato vencido **degrada confianza** — no desaparece silenciosamente.

---

# XI. Casos prohibidos (combinaciones)

| Caso | Descripción | Acción |
|------|-------------|--------|
| **CP-01** | Publicar Diamond con lis pendens no evaluado | Bloqueo |
| **CP-02** | Exponer PII owner sin authorization scope | Bloqueo compliance |
| **CP-03** | Usar comp no arm's length para ARV estándar | Invalidar valoración |
| **CP-04** | Contactar owner fuera TCPA para Diamond | Descarte candidatura |
| **CP-05** | Presentar AVM como tasación independiente | Misrepresentation |
| **CP-06** | Omitir conflicto assessor vs deed | Violación RE-09 |
| **CP-07** | STR thesis sin triple check zoning+permiso+regulación | Bloqueo estrategia |
| **CP-08** | Inferir underwater sin payoff o lien data | Violación LIV-03 |
| **CP-09** | Síntesis ejecutiva sin known unknowns | Invalidar Dominio 44 |
| **CP-10** | Fuente prohibida en bloque crítico | Descarte inmediato |

---

# XII. Cuidado legal y compliance por familia

| Familia | Riesgo legal | Salvaguarda obligatoria |
|---------|--------------|------------------------|
| Contacto owner | TCPA, FDCPA, state privacy | Opt-in; horarios; DNC |
| PII / SSN / financiero owner | GLBA, privacy tort | Authorization scope; redacción |
| Conversación grabada | Consent estatal (one/two party) | Consent documentado |
| Datos criminales | FCRA si employment screening | Uso inmobiliario legítimo only |
| MLS data | License MLS; display rules | Uso conforme licencia |
| Datos menores / escuela | FERPA indirecto | Agregado únicamente |
| Scraping | CFAA; ToS | **Prohibido** salvo licencia |
| Marketing exclusividad | FTC truth in advertising | Verificación antes claim |
| Fair Housing | Uso datos demográficos | Sin discriminación en producto |
| Environmental reliance | Liability disclosure | No sustituir Phase I profesional |

---

# XIII. Organismos por jurisdicción (arquitectura tipo EE.UU.)

Factory opera en **arquitectura federal-estatal-municipal**. No existe organismo único nacional para inmuebles.

| Nivel | Rol | Ejemplos tipo |
|-------|-----|---------------|
| **Federal** | Hazard, env, census, bankruptcy, transport | FEMA, EPA, Census, Courts, DOT |
| **Estatal** | Recording standards, env, labor, education | SOS, state courts, DOE, labor dept |
| **Condado** | Registro, assessor, tax, recorder, GIS | County recorder, assessor, treasurer |
| **Municipal** | Zoning, permits, code, planning | City building dept, planning |
| **Privado licenciado** | Title, appraisal, MLS, inspection | Title co., appraiser, MLS, inspector |
| **Owner autorizado** | Motivación, contacto, disclosure | Consent scope firmado |

**Regla territorial:** Factory debe resolver **jurisdicción competente por activo** antes de seleccionar organismo.

---

# XIV. Constitución de fuentes — DSO

| # | Ley |
|---|-----|
| **DSO-01** | Este documento es la **arquitectura soberana de procedencia** del conocimiento Diamond |
| **DSO-02** | Ningún motor futuro puede usar fuente no catalogada aquí sin enmienda |
| **DSO-03** | Primaria registral es **irreemplazable** en bloques II y 09–10 |
| **DSO-04** | Fuente prohibida **no entra** por excepción operativa |
| **DSO-05** | Conflicto se resuelve — no se oculta |
| **DSO-06** | Compliance es **filtro previo** a ingestión |
| **DSO-07** | Terciaria no alcanza C1–C2 sin reconciliación |
| **DSO-08** | Owner es fuente legítima **solo** con authorization |
| **DSO-09** | Frescura es **atributo obligatorio** de toda fuente activa |
| **DSO-10** | Este documento **somete** a MPI, DKN, DDI y Auditoría Maestra |

---

# XV. Leyes constitucionales — Fuentes

| # | Ley |
|---|-----|
| **LS-01** | Sin procedencia no hay conocimiento Diamond |
| **LS-02** | Sin registro no hay title Diamond |
| **LS-03** | Sin consentimiento no hay contacto Diamond |
| **LS-04** | Sin authorization no hay PII comercial |
| **LS-05** | Agregador no es registro |
| **LS-06** | AVM no es tasación |
| **LS-07** | MLS no es exclusividad |
| **LS-08** | Owner verbal no es payoff |
| **LS-09** | Conflicto irresoluble bloquea — no promedia |
| **LS-10** | Fuente vencida degrada — no certifica |
| **LS-11** | Inferencia etiquetada — nunca silenciosa |
| **LS-12** | Territorialidad primero — no modelo nacional ciego |
| **LS-13** | Evidencia converge — señal única no basta |
| **LS-14** | Prohibida es prohibida — sin atenuante |
| **LS-15** | Síntesis sin corpus es inválida |
| **LS-16** | Documento sin custodia no es E4 |
| **LS-17** | Fair Housing gobierna uso de datos entorno |
| **LS-18** | STR exige triple fuente normativa |
| **LS-19** | Fase II siguiente define motores — no fuentes nuevas |
| **LS-20** | Inventario cerrado — producción se mapea — no expande |

---

# XVI. Preparación para el siguiente documento de Fase II

El siguiente bloque de la Fase II desarrollará:

| Documento esperado | Alcance |
|--------------------|---------|
| **Motors Architecture** (o equivalente) | Qué motores factory consumen qué familias de fuente y producen qué dominios |
| **Loops Architecture** | Ciclos de actualización y verificación por frescura |
| **Swarms Architecture** | Coordinación multi-motor y resolución conflicto |
| **IA Governance** (si aplica) | Rol asistivo sin sustituir evidencia |

**Dependencia:** Motores **solo pueden** consumir fuentes catalogadas en este documento. Loops **solo pueden** aplicar reglas de actualización aquí definidas.

**Ley de transición:** Primero **de dónde** (este documento). Después **quién produce** (motores). Después **cuándo actualiza** (loops).

---

# Resumen ejecutivo del documento

| Métrica | Valor |
|---------|-------|
| Elementos DDI mapeados | 2.265 |
| Dominios MPI cubiertos | 44 |
| Partes DDI referenciadas | 6 |
| Familias fuente definidas | 12+ |
| Fuentes prohibidas catalogadas | 10 |
| Fuentes baja confianza catalogadas | 8 |
| Reglas conflicto | 8 |
| Reglas evidencia | 10 |
| Reglas actualización | 10 |
| Casos prohibidos | 10 |
| Leyes constitucionales fuentes | 20 |

---

*DIAMOND SOURCES & ORGANISMS ARCHITECTURE — Arquitectura de Fuentes y Organismos Diamond. Noveno documento oficial de la Auditoría Maestra RealEstateSniper Factory 2.0. Apertura de la Fase II — Producción del Conocimiento.*

# ADDENDUM OFICIAL AL OFFICIAL DISCOVERY  
## FACTORY 2.0 — CONSTITUTIONAL CONTINUITY DOSSIER (CCD)

| Campo | Valor |
|-------|--------|
| **Documento** | Addendum oficial al Official Discovery del CCD |
| **Relación** | **Complementa** el Discovery ya emitido — **no lo sustituye** — **no modifica su estructura** |
| **Momento** | Ampliación oficial **antes** del Implementation Plan |
| **Modo** | READ ONLY · DISCOVERY ONLY · **NO IMPLEMENTATION** |
| **Efecto** | Forma parte del corpus de Discovery del CCD; debe incorporarse al Implementation Plan |
| **No autoriza** | Redacción del CCD, IMPL, commits, push, ni modificación de documentos existentes |

---

## Declaración de integración

Este Addendum **amplía** el Official Discovery en cinco materias constitucionales-operativas ordenadas por el Director.

Se integra:

- **sin** alterar el índice de estructura propuesto del Discovery (§4 del Discovery);
- **sin** alterar fronteras Blueprint / Auditoría Maestra / Master Plan;
- **sin** elevar a arquitectura las normalizaciones de evolución de sesión salvo como **gobernanza documental** (Adición 2);
- **sin** autorizar implementación ni seleccionar siguiente bloque.

Los puntos siguientes son **contenido obligatorio del futuro CCD** (y del Implementation Plan), no texto constitucional redactado aquí.

---

## ADICIÓN 1 — GitHub como referencia constitucional

### Enunciado a constitucionalizar (contenido Director)

1. **GitHub es la única referencia oficial compartida** entre Carlos y Manolo.  
2. **No** existen dos líneas oficiales de desarrollo.  
3. **No** existen sincronizaciones parciales.  
4. Una sesión **no** se considera oficialmente finalizada cuando el desarrollador deja de trabajar.  
5. Una sesión **solo** queda cerrada cuando concurren, como mínimo:

   - el bloque ha alcanzado su estado previsto;  
   - la documentación correspondiente ha sido actualizada;  
   - la auditoría requerida ha finalizado;  
   - el Status oficial refleja el resultado;  
   - el Commit oficial ha sido realizado;  
   - el **Push oficial** ha sido publicado;  
   - el **HEAD publicado** ha sido verificado;  
   - el árbol de trabajo queda **limpio**;  
   - la documentación de continuidad ha sido actualizada **cuando proceda**.

6. **Hasta ese momento no deberá iniciarse un nuevo bloque independiente.**

### Encaje en el Discovery (sin modificar su estructura)

| Sección Discovery | Amplificación |
|-------------------|---------------|
| Alcance — Git/GitHub | El CCD debe elevar esta política a **regla permanente**, no solo a restricción de Continuity §28. |
| Cap. propuesto 7 (Gobernanza Git/GitHub) | Debe incluir: unicidad de línea oficial; cierre de sesión = checklist completa incl. push + HEAD limpio; prohibición de nuevo bloque independiente antes del cierre. |
| Cap. propuesto 9 (Cierre de bloques y sesiones) | Debe alinear “cierre de sesión” con esta checklist (más estricto que “dejar de trabajar”). |
| Cap. propuesto 5 (Roles Carlos↔Manolo) | GitHub = única referencia compartida; FSR/documentos no sustituyen HEAD publicado. |

### Relación con documentación existente (Discovery finding)

- Continuity §28 hoy **prohíbe** push salvo orden expresa y **no autoriza** push desde el dossier.  
- Continuity §27 define protocolo Discovery→…→Status Commit; el push no siempre aparece como condición de cierre de sesión.  
- Continuity §34 Class 1 incluye “No push from this dossier” / TD-AHEAD.  

**Hallazgo:** la Adición 1 es una **evolución de gobernanza de continuidad** (cierre oficial = publicado en GitHub), no una reinterpretación de arquitectura. El Implementation Plan del CCD deberá:

- incorporar la Adición 1 como regla constitucional del CCD;  
- **reconciliar explícitamente** el lenguaje Continuity §28 (“no push sin orden”) con “push obligatorio para cierre oficial de sesión **cuando el Director/protocolo autorice el cierre remoto de ese bloque**”;  
- **sin** convertir el CCD en autorización genérica de push;  
- **sin** permitir dos HEADs oficiales locales no publicados.

### Implicaciones para el Implementation Plan

- Definir estados: *trabajo local en curso* ≠ *sesión oficialmente cerrada*.  
- Definir que “nuevo bloque independiente” requiere sesión previa cerrada según checklist.  
- Definir verificación READ_ONLY de HEAD remoto + working tree clean como gate de cierre.  
- No inventar sync parciales ni ramas “oficiales” paralelas.

### Riesgos específicos Adición 1

| Riesgo | Nota |
|--------|------|
| Contradicción aparente §28 vs push de cierre | Resolver en Plan/CCD por **orden de cierre autorizado**, no por push libre. |
| Bloqueo operativo si push no ordenado | Sesión permanece **no cerrada**; no abrir bloque nuevo. |
| Stale ahead counts | Mantener: números en docs no son verdad; verificar Git. |

---

## ADICIÓN 2 — Dominios estratégicos de evolución

### Enunciado a constitucionalizar

- La evolución futura **no** se interpreta como colección aislada de bloques.  
- La organización estratégica se realiza mediante **dominios y programas oficiales**.  
- El CCD define esta **gobernanza documental** **sin** alterar el Master Plan ni la arquitectura aprobada.

### Encaje en el Discovery

| Sección Discovery | Amplificación |
|-------------------|---------------|
| Cap. propuesto 11 (Evolución futura y roadmap) | Debe fijar: bloques ⊂ programas ⊂ dominios (gobernanza); Master Plan gates y Mandates siguen prevaleciendo. |
| Relación con Master Plan | CCD **no** reescribe Fases I–V ni P-INT; **organiza** la lectura/evolución sobre ellos. |
| Dependencias — inventario de evolución / normalización | Material de sesión = **insumo de gobernanza** solo si el Director lo eleva vía CCD; no es arquitectura nueva. |

### Contorno Discovery (sin inventar arquitectura)

El CCD deberá:

- declarar el principio de organización por **dominios/programas**;  
- exigir que todo programa cite **bloques oficiales** ya existentes (Master Plan / Continuity / Status);  
- prohibir que un “programa” cree CB nuevos o reabra construcción;  
- afirmar: listado indicativo ≠ autorización (ya en Continuity §30).

**No** corresponde al Discovery fijar aquí el catálogo cerrado de programas (eso es contenido del Plan/CCD bajo Adición 2, a partir de normalización ya Discovery’d y del Master Plan).

### Riesgos específicos Adición 2

| Riesgo | Nota |
|--------|------|
| Shadow Master Plan | Programas que compitan con Fases/P-INT. |
| Elevación de chat | Normalizaciones de sesión tratadas como ley sin Class 1. |

---

## ADICIÓN 3 — Gobernanza de IA

### Enunciado a constitucionalizar

Capítulo específico del CCD para asistentes IA, con **mínimo**:

- orden obligatorio de lectura documental;  
- jerarquía documental;  
- qué documentos tienen autoridad;  
- cuándo la IA debe **detenerse**;  
- cuándo debe **solicitar autorización**;  
- cuándo puede **proponer** mejoras;  
- prohibición de reinterpretar arquitectura consolidada;  
- prohibición de reabrir bloques cerrados;  
- prohibición de convertir ideas/conversaciones en arquitectura oficial.

Objetivo: continuidad documental **independiente del modelo IA**.

### Encaje en el Discovery

| Sección Discovery | Amplificación |
|-------------------|---------------|
| Cap. propuesto 13 (Uso por chats IA) | Debe expandirse al **capítulo constitucional de Gobernanza de IA** con el mínimo de la Adición 3. |
| Cap. propuesto 2 (Jerarquía) | Reutilizar Continuity §1 / Class 1–2–3 sin reinterpretar. |
| Cap. propuesto 12 (Anti-auditoría) | Ligar a “cuándo detenerse” vs “cuándo citar Status existente”. |

### Bases ya existentes (a consolidar, no reinventar)

- Continuity §1 jerarquía y contradicciones.  
- Continuity §34 Class 1 / 2 / 3.  
- Continuity §27 protocolo; §28 Git; §20–§21 Stop Rules.  
- Status COMPLETE prevalece; no reabrir FULLY CLOSED.  
- Discovery previo: orden de lectura propuesto (CCD → Status/Closeout → State → Plan/Mandate → Git verify).

### Implicaciones para el Implementation Plan

- Redactar gates de STOP (contradicción, falta Mandate, Stop Rules, pedido de push/merge sin orden, reapertura de cerrado).  
- Distinguir: **proponer** (permitido como Class 3 hasta autorización) vs **aplicar** (requiere Mandate/Director).  
- Afirmar independencia del vendor/modelo IA.

---

## ADICIÓN 4 — Escalabilidad nacional

### Enunciado a constitucionalizar

- Factory = **única plataforma** para Estados Unidos.  
- Arizona = **primera jurisdicción operativa**, no arquitectura distinta.  
- Nuevos estados **no** autorizan nuevas arquitecturas.  
- Incorporación vía: nuevas fuentes; nuevos adaptadores; nuevas configuraciones jurisdiccionales compatibles.  
- **Prohibido** duplicar: motores, Runtime, Evidence, Legitimacy, Loops, Swarms, Intelligence, Orchestration.

### Encaje en el Discovery

| Sección Discovery | Amplificación |
|-------------------|---------------|
| Cap. propuesto 4 (Fronteras permanentes) | Incluir principio de **escalabilidad nacional** por referencia + regla anti-duplicación. |
| Relación Blueprint / Master Plan | Alineado a extensión operacional DSO/adapters (Master Plan §7.2) sin redefinir OMC. |
| Cap. propuesto 11 | Evolución jurisdiccional ⊂ adaptadores/config, no fork de plataforma. |

### Bases existentes

- Continuity / Master Plan: P-INT-02 Live por jurisdicción; Offline Maricopa packs.  
- Blueprint: DSO / fuentes; frontera Factory única.  
- Continuity §22: fuentes oficiales; Factory no fusiona Product/Marketplace.

### Riesgos específicos Adición 4

| Riesgo | Nota |
|--------|------|
| “Arizona fork” | Segunda Factory o segundo Runtime. |
| Confundir config con CB nuevo | CCD debe prohibirlo explícitamente. |

---

## ADICIÓN 5 — Propósito constitucional de Factory

### Enunciado a constitucionalizar

El objetivo de Factory **no** es añadir más componentes.

Objetivo permanente: incrementar de forma continua:

- calidad de la inteligencia;  
- calidad de la evidencia;  
- calidad de la legitimidad;  
- capacidad de descubrir oportunidades reales;  
- calidad de clasificación Deal / Premium / Diamond;  
- capacidad de expansión nacional sin degradar la arquitectura.

Toda evolución futura debe respetar este principio.

### Encaje en el Discovery

| Sección Discovery | Amplificación |
|-------------------|---------------|
| Cap. propuesto 1 (Identidad y propósito) | Incluir este propósito permanente. |
| Cap. propuesto 11 | Filtro de evolución: ¿incrementa esas calidades sin degradar arquitectura? |
| Relación Continuity §22–§24 | Alinear con “Quality before volume”; Diamond como prioridad de producto; Evidence/Legitimacy mandatory. |

### Frontera que el CCD debe preservar (sin reinterpretar)

Continuity §22: Factory **no** asigna sola la clasificación comercial / `access_tier`.  
Master Plan: Decision / Product / Marketplace soberanos aguas abajo.

**Hallazgo Discovery:** el CCD puede fijar el **propósito** de mejorar la *calidad de clasificación* Deal/Premium/Diamond como objetivo de sistema, **sin** autorizar que Factory implemente pricing/`access_tier` ni Decision Engine. La contribución Factory permanece en inteligencia, evidencia, legitimidad y handoff; la clasificación comercial sigue la frontera soberana ya aprobada.

### Riesgos específicos Adición 5

| Riesgo | Nota |
|--------|------|
| Justificar componentes nuevos “porque calidad” | El principio es anti-acreción; no licencia de scope creep. |
| Meter clasificación dentro de Factory | Violación de frontera ya Class 1 / Master Plan. |

---

## Actualización del mapa Discovery → capítulos (sin cambiar la estructura numerada)

La estructura del Discovery **permanece** (capítulos 1–16). Este Addendum **obliga** a que el Implementation Plan asegure cobertura explícita así:

| Adición | Capítulo(s) Discovery donde debe aterrizar el contenido |
|---------|---------------------------------------------------------|
| **1** GitHub constitucional / cierre de sesión | Caps. **5, 7, 9** (+ DoD del CCD en **16**) |
| **2** Dominios/programas de evolución | Cap. **11** (+ relación Master Plan en mapa de documentos **3**) |
| **3** Gobernanza de IA | Cap. **13** (elevado a capítulo constitucional de IA; jerarquía en **2**) |
| **4** Escalabilidad nacional | Caps. **4, 11** |
| **5** Propósito Factory | Caps. **1, 11** (+ frontera §22 vía **4**) |

---

## Dependencias añadidas (solo de gobernanza)

- Continuity §1, §20–§21, §27–§29, §30, §34 (extracción, no supersesión ciega).  
- Master Plan §5–§8 (gates; no alteración).  
- Status/Closeout (evidencia de cierre de bloque en checklist Adición 1).  
- GitHub HEAD publicado (verdad compartida Carlos↔Manolo).  
- Normalización de programas de evolución (insumo documental para Adición 2; no arquitectura nueva).

---

## Riesgos agregados al Discovery

1. Doble mensaje push (prohibición genérica vs push de cierre oficial).  
2. CCD que reescriba Master Plan vía “dominios”.  
3. Capítulo IA que debilite Class 1 o permita reaperturas.  
4. Escalabilidad nacional usada para fork jurisdiccional.  
5. Propósito de calidad usado para añadir componentes o romper frontera Deal/Premium/Diamond.

---

## Beneficios agregados

- Una sola línea oficial verificable en GitHub.  
- Cierre de sesión objetivo e intersubjetivo (Carlos↔Manolo).  
- Evolución legible por dominios/programas sin atomizar el roadmap.  
- Continuidad IA-modelo-agnóstica.  
- Protección anti-fork nacional.  
- Brújula anti-acreción alineada a inteligencia / evidencia / legitimidad / Diamond / expansión.

---

## Recomendaciones para el Implementation Plan (Addendum)

1. Incorporar Adiciones 1–5 como **requisitos normativos del CCD**, no como anexos opcionales.  
2. Redactar cláusula de **reconciliación Git** (§28 Continuity ↔ cierre con push).  
3. Definir dominio/programa como **capa de gobernanza documental** sobre Master Plan, no como sustituto.  
4. Capítulo IA con STOP/AUTH/PROPOSE explícitos y Class 1–2–3.  
5. Escalabilidad nacional + anti-duplicación de CB cores.  
6. Propósito permanente + cláusula de frontera Product/Decision.  
7. **No** implementar Factory; **no** redactar CCD hasta Mandate/orden Director post-Plan.

---

## Conclusión del Addendum

Este Addendum **forma parte oficial del Official Discovery del CCD**. Amplía gobernanza de: (1) GitHub y cierre de sesión, (2) dominios/programas de evolución, (3) IA, (4) escalabilidad nacional, (5) propósito de calidad — **sin** modificar la estructura del Discovery, **sin** alterar fronteras arquitectónicas aprobadas y **sin** autorizar implementación.

El Implementation Plan del CCD deberá absorber estas cinco adiciones íntegramente antes de cualquier redacción del documento constitucional.

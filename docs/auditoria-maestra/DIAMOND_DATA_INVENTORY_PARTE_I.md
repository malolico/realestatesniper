# DIAMOND DATA INVENTORY

## PARTE I — IDENTIDAD DEL ACTIVO, LOCALIZACIÓN Y CARACTERÍSTICAS FÍSICAS

**Auditoría Maestra — RealEstateSniper Factory 2.0**

**Autoridad:** Tercer documento oficial de la Auditoría Maestra. Deriva obligatoriamente del **MASTER PROPERTY INTELLIGENCE INDEX** y de la **DIAMOND KNOWLEDGE CONSTITUTION**.  
**Alcance:** Inventario absoluto del conocimiento que Factory 2.0 debe poseer sobre una propiedad Diamond en los Dominios 01, 02 y 03.  
**Exclusión expresa:** Filosofía Diamond, implementación, programación, tecnología, bases de datos, APIs, motores, loops, enjambres, IA, organismos oficiales, fuentes y verificaciones técnicas.

**Pregunta rectora de este documento:**

> *¿Qué información debería conocer Factory sobre el activo?*

---

## Leyenda de clasificación

| Símbolo / Código | Significado |
|------------------|-------------|
| **Obl.** | Obligatorio para Diamond — ausencia bloquea candidatura |
| **Rec.** | Recomendable — eleva convicción institucional |
| **Opt.** | Opcional — enriquecimiento contextual |
| **Int.** | Debe permanecer interno en Factory |
| **Inv.** | Podrá mostrarse al inversor (sujeto a Producto, Access y Authorization) |
| **E0–E4** | Nivel de evidencia esperado |
| **C1–C5** | Nivel de confianza requerido |

**Nota:** Un elemento es **Obl.**, **Rec.** u **Opt.** — exclusivamente uno como clasificación principal.

---

# DOMINIO 01 — IDENTIFICACIÓN DEL INMUEBLE

**Objetivo del dominio:** Establecer la identidad única, inequívoca y trazable del activo a lo largo del tiempo y de todas las representaciones comerciales y registrales.

---

## 01.A — Identificadores registrales y parcelarios

| Nombre del dato | Descripción | Valor | Importancia inversor | Obl. | Rec. | Opt. | Int. | Inv. | Evid. | Conf. |
|-----------------|-------------|-------|----------------------|------|------|------|------|------|-------|-------|
| **Número de parcela (APN / Parcel Number)** | Identificador fiscal-parcelario asignado por la jurisdicción al lote o unidad tributaria | Ancla primaria de identidad en EE.UU.; resuelve ambigüedad direccional | Crítica — sin APN no hay due diligence institucional | Sí | — | — | No | Sí | E4 | C1 |
| **Número de folio registral** | Identificador de inscripción en el registro de la propiedad cuando existe separado del APN | Vincula activo con cadena documental de titularidad | Alta — trazabilidad title | Sí | — | — | No | Sí | E4 | C1 |
| **Legal Description completa** | Descripción metes-and-bounds o lot-block-subdivision según deed | Define límites legales del activo de forma jurídica | Crítica — discrepancia dirección vs legal description es riesgo title | Sí | — | — | No | Sí | E4 | C1 |
| **Lot Number** | Número de lote dentro de la subdivisión | Precisión en desarrollos planificados | Alta en subdivisions | — | Sí | — | No | Sí | E3 | C2 |
| **Block Number** | Número de manzana dentro de la subdivisión | Precisión registral en platted lots | Alta en subdivisions | — | Sí | — | No | Sí | E3 | C2 |
| **Subdivision Name (oficial)** | Nombre registral de la subdivisión o development | Contextualiza identidad y documentación | Media-alta | — | Sí | — | No | Sí | E3 | C2 |
| **Plat Map Reference** | Referencia al mapa de subdivisión oficial donde se ploteó el lote | Prueba gráfica de límites y servidumbres | Alta cuando existen servidumbres o lotes irregulares | — | Sí | — | No | Sí | E4 | C2 |
| **Condominium Unit Number** | Número de unidad en régimen de condominio | Identidad inequívoca en multi-unit horizontal | Sí en condos | Sí | — | — | No | Sí | E4 | C1 |
| **Condominium Plan / CC&R Recordation Reference** | Referencia registral del plan condominial y restricciones | Identifica régimen jurídico del edificio/complejo | Alta en condos y PUDs | — | Sí | — | No | Sí | E4 | C2 |
| **PUD / HOA Parcel Identifier** | Identificador de parcela dentro de Planned Unit Development | Diferencia lotes con régimen asociación | Alta en PUD | — | Sí | — | No | Sí | E3 | C2 |
| **Tax Account Number** | Cuenta tributaria asignada por autoridad fiscal | Segunda ancla fiscal independiente del APN en algunas jurisdicciones | Alta — cruce fiscal | — | Sí | — | No | Sí | E3 | C2 |
| **Prior Parcel Number (historical)** | Identificador parcelario anterior si hubo reparcelación | Trazabilidad tras splits, merges o renumbering | Media — historial y liens antiguos | — | — | Sí | Sí | No | E3 | C3 |
| **GIS Object Identifier (jurisdiccional)** | ID interno del sistema cartográfico municipal o del condado | Resolución espacial y cruces administrativos | Media | — | — | Sí | Sí | No | E2 | C3 |
| **FEMA Community Identifier** | Código de comunidad para mapas de inundación | Vincula activo a contexto flood — identidad de riesgo | Media | — | Sí | — | No | Sí | E2 | C3 |

---

## 01.B — Dirección y normalización postal

| Nombre del dato | Descripción | Valor | Importancia inversor | Obl. | Rec. | Opt. | Int. | Inv. | Evid. | Conf. |
|-----------------|-------------|-------|----------------------|------|------|------|------|------|-------|-------|
| **Street Address (número y vía)** | Dirección postal estándar del acceso principal | Identificación humana y comercial del activo | Crítica | Sí | — | — | No | Sí | E3 | C1 |
| **Unit / Suite / Apt Designator** | Designador de unidad cuando aplica | Evita colisión entre unidades del mismo edificio | Crítica en multi-unit | Sí | — | — | No | Sí | E3 | C1 |
| **City** | Municipio o ciudad postal | Jurisdicción y mercado | Crítica | Sí | — | — | No | Sí | E3 | C1 |
| **County** | Condado | Jurisdicción registral y fiscal primaria en EE.UU. | Crítica | Sí | — | — | No | Sí | E3 | C1 |
| **State** | Estado federado | Marco legal y mercado | Crítica | Sí | — | — | No | Sí | E3 | C1 |
| **ZIP Code** | Código postal | Segmentación mercado y servicios | Alta | Sí | — | — | No | Sí | E3 | C1 |
| **ZIP+4 Extension** | Extensión postal de precisión | Precisión entrega y geocodificación | Media | — | Sí | — | No | Sí | E2 | C3 |
| **USPS Delivery Point Validation Status** | Estado de validación postal según estándar USPS | Detecta direcciones ficticias o mal formadas | Media-alta | — | Sí | — | Sí | No | E2 | C3 |
| **Normalized Address Canonical Form** | Forma canónica única acordada por Factory para el activo | Elimina duplicados por variaciones de escritura | Crítica operativa | Sí | — | — | Sí | No | E3 | C1 |
| **Prior Address (historical)** | Direcciones anteriores del activo | Trazabilidad tras renumbering o cambio de nombre de vía | Media | — | — | Sí | Sí | No | E3 | C3 |
| **Vacant Land Address Status** | Indicador de si la dirección corresponde a lote sin estructura habitable | Ajusta expectativas de inspección y valor | Alta en land | — | Sí | — | No | Sí | E2 | C3 |
| **Dual Address Flag** | Indicador de múltiples direcciones legítimas para el mismo activo | Resuelve corner lots, rear access, commercial vs residential frontage | Media | — | — | Sí | Sí | No | E2 | C3 |
| **Unincorporated Area Flag** | Indicador de ubicación fuera de límites municipales incorporados | Cambia jurisdicción de código y servicios | Alta | — | Sí | — | No | Sí | E2 | C3 |

---

## 01.C — Clasificación del activo

| Nombre del dato | Descripción | Valor | Importancia inversor | Obl. | Rec. | Opt. | Int. | Inv. | Evid. | Conf. |
|-----------------|-------------|-------|----------------------|------|------|------|------|------|-------|-------|
| **Asset Class Primary** | Clasificación soberana: residencial, comercial, industrial, land, mixed-use, special | Determina metodología de valor, estrategia y due diligence | Crítica | Sí | — | — | No | Sí | E3 | C1 |
| **Asset Class Secondary** | Subtipo: SFR, condo, townhouse, multifamily, retail, office, warehouse, hospitality, self-storage, mobile home, agricultural, etc. | Afinación de comparables y riesgo | Crítica | Sí | — | — | No | Sí | E3 | C1 |
| **Property Use Code (assessor)** | Código de uso del assessor tributario | Señal independiente de uso declarado vs real | Alta | — | Sí | — | No | Sí | E3 | C2 |
| **Occupancy Type** | Owner-occupied, tenant-occupied, vacant, partially occupied | Impacto negociación, timeline y capex | Alta | Sí | — | — | No | Sí | E2 | C2 |
| **Number of Legal Units on Parcel** | Unidades legales independientes en la parcela | Crítico en duplex, triplex, illegal conversions | Alta en multi-unit | — | Sí | — | No | Sí | E3 | C2 |
| **Number of Buildings on Parcel** | Edificaciones distintas en el mismo lote | Afecta valor, seguro y permisos | Alta | — | Sí | — | No | Sí | E2 | C3 |
| **Primary vs Accessory Structure Flag** | Distinción entre estructura principal y accesoria | Evita confundir guest house, garage habitable con unidad legal | Alta | — | Sí | — | No | Sí | E2 | C3 |
| **Mixed-Use Composition** | Desglose porcentual o por área de usos mixtos | Complejidad de valoración y financiación | Alta en mixed-use | — | Sí | — | No | Sí | E3 | C3 |
| **New Construction Status** | Nueva, existing, under construction, never completed | Riesgo de completion, warranties, permisos | Alta | — | Sí | — | No | Sí | E2 | C3 |
| **Manufactured / Modular Home Flag** | Indicador de vivienda prefabricada | Impacta financiación, seguro, foundation requirements | Alta si aplica | — | Sí | — | No | Sí | E3 | C2 |
| **Mobile Home with Land Flag** | Indicador de mobile home con terreno en fee simple o lease | Régimen jurídico distinto | Alta si aplica | — | Sí | — | No | Sí | E3 | C2 |
| **Timeshare / Fractional Interest Flag** | Indicador de propiedad fraccionada | Descarte o estrategia especial | Crítica si aplica | Sí | — | — | No | Sí | E4 | C1 |
| **Leasehold vs Fee Simple Estate** | Naturaleza del derecho de propiedad | Leasehold altera radicalmente tesis | Crítica | Sí | — | — | No | Sí | E4 | C1 |
| **Ground Lease Remaining Term** | Plazo restante del ground lease si aplica | Valor residual y riesgo de reversión | Crítica en leasehold | Sí | — | — | No | Sí | E4 | C1 |
| **Cooperative (Co-op) Interest Flag** | Indicador de participación en cooperativa vs fee simple | Estructura de ownership distinta | Crítica si aplica | Sí | — | — | No | Sí | E4 | C1 |

---

## 01.D — Resolución de identidad y deduplicación

| Nombre del dato | Descripción | Valor | Importancia inversor | Obl. | Rec. | Opt. | Int. | Inv. | Evid. | Conf. |
|-----------------|-------------|-------|----------------------|------|------|------|------|------|-------|-------|
| **Factory Property Identity Key** | Identificador soberano interno de Factory para el activo | Persistencia a través de todo el ciclo knowledge → producto | Crítica operativa | Sí | — | — | Sí | No | E3 | C1 |
| **Identity Resolution Status** | Estado: única, pendiente, fusionada, dividida, conflictiva | Gate de Decision-Diamond | Crítica | Sí | — | — | Sí | No | E3 | C1 |
| **Duplicate Candidate List** | Lista de registros sospechosos de ser el mismo activo | Previene doble conteo de oportunidades | Alta | — | Sí | — | Sí | No | E2 | C3 |
| **Split Parcel History Flag** | Indicador de parcela originada por subdivisión de otra | Trazabilidad de liens y easements | Media-alta | — | — | Sí | Sí | No | E3 | C3 |
| **Merged Parcel History Flag** | Indicador de parcela originada por consolidación | Trazabilidad title | Media-alta | — | — | Sí | Sí | No | E3 | C3 |
| **Identity Conflict Description** | Descripción de conflicto entre identificadores o direcciones | Transparencia de riesgo de error | Alta si existe conflicto | — | Sí | — | Sí | No | E3 | C2 |
| **Identity Resolution Method** | Método por el cual se resolvió la identidad | Auditabilidad institucional | Media | — | — | Sí | Sí | No | E2 | C3 |
| **Cross-Reference to Related Parcels** | Parcelas adyacentes o del mismo owner relevantes para la tesis | Contexto de assemblage o nuisance | Media | — | — | Sí | Sí | No | E2 | C4 |
| **Master Association / Umbrella Development Link** | Vinculación a desarrollo maestro de mayor escala | Identidad en master-planned communities | Media en MPC | — | — | Sí | No | Sí | E3 | C3 |

---

## 01.E — Metadatos de identidad y vigencia

| Nombre del dato | Descripción | Valor | Importancia inversor | Obl. | Rec. | Opt. | Int. | Inv. | Evid. | Conf. |
|-----------------|-------------|-------|----------------------|------|------|------|------|------|-------|-------|
| **Identity First Observed Date** | Fecha de primera observación del activo en Factory | Trazabilidad temporal | Media | — | — | Sí | Sí | No | E2 | C4 |
| **Identity Last Verified Date** | Fecha de última verificación de identidad | Frescura del dato | Alta | — | Sí | — | Sí | No | E3 | C2 |
| **Identity Verification Confidence Score** | Puntuación de confianza global de identidad | Gate institucional | Crítica | Sí | — | — | Sí | No | E3 | C1 |
| **Active vs Inactive Property Flag** | Indicador de si el activo existe operativamente o fue demolido / consolidado | Evita invertir en activos inexistentes | Alta | — | Sí | — | No | Sí | E3 | C2 |
| **Demolition Status** | Demolido, parcialmente demolido, scheduled demolition | Impacto radical en tesis | Alta si aplica | — | Sí | — | No | Sí | E3 | C2 |
| **Red Tag / Condemned Structure Flag** | Estructura condenada o inhabitable por autoridad | Riesgo y capex | Alta si aplica | — | Sí | — | No | Sí | E3 | C2 |
| **Address vs Parcel Mismatch Flag** | Discrepancia conocida entre dirección y parcela | Alerta title y valor | Alta | — | Sí | — | No | Sí | E3 | C2 |
| **Identity Source Count** | Número de fuentes independientes que confirman identidad | Robustez epistémica | Media | — | Sí | — | Sí | No | E2 | C3 |
| **Identity Evidence Bundle Reference** | Referencia al paquete probatorio de identidad | Trazabilidad sin exponer evidencia cruda | Alta | Sí | — | — | Sí | No | E4 | C1 |

---

# DOMINIO 02 — LOCALIZACIÓN

**Objetivo del dominio:** Dominar la posición geográfica precisa del inmueble, su contexto espacial, sus límites y su inserción en todas las jurisdicciones relevantes.

---

## 02.A — Georreferenciación y posición

| Nombre del dato | Descripción | Valor | Importancia inversor | Obl. | Rec. | Opt. | Int. | Inv. | Evid. | Conf. |
|-----------------|-------------|-------|----------------------|------|------|------|------|------|-------|-------|
| **Latitude (centroid)** | Coordenada latitud del centroide del activo | Posición absoluta en el territorio | Crítica | Sí | — | — | No | Sí | E3 | C1 |
| **Longitude (centroid)** | Coordenada longitud del centroide del activo | Posición absoluta | Crítica | Sí | — | — | No | Sí | E3 | C1 |
| **Geolocation Precision Level** | Nivel de precisión: rooftop, parcel centroid, street interpolated, approximate | Calidad de la posición | Alta | — | Sí | — | Sí | No | E2 | C2 |
| **Structure Entry Point Coordinates** | Coordenadas del punto de acceso principal | Navegación, inspección, flood micro-riesgo | Media-alta | — | Sí | — | No | Sí | E2 | C3 |
| **Parcel Centroid vs Structure Offset** | Distancia entre centroide parcela y estructura | Detección de errores de geocodificación | Media | — | — | Sí | Sí | No | E2 | C4 |
| **Elevation (ground)** | Elevación sobre nivel del mar en el punto del activo | Riesgo inundación, drenaje | Media-alta | — | Sí | — | No | Sí | E2 | C3 |
| **Aspect / Orientation** | Orientación predominante de la fachada o lote | Valor residencial, energía solar | Baja-media | — | — | Sí | No | Sí | E1 | C4 |
| **Slope / Grade** | Pendiente del terreno | Coste construcción, riesgo erosión | Media en land/hillside | — | — | Sí | No | Sí | E2 | C4 |

---

## 02.B — Límites y geometría parcelaria

| Nombre del dato | Descripción | Valor | Importancia inversor | Obl. | Rec. | Opt. | Int. | Inv. | Evid. | Conf. |
|-----------------|-------------|-------|----------------------|------|------|------|------|------|-------|-------|
| **Parcel Boundary Polygon** | Perímetro geométrico de la parcela | Define extensión real del activo | Crítica | Sí | — | — | No | Sí | E4 | C1 |
| **Lot Area (sq ft)** | Superficie de lote en pies cuadrados | Valor, densidad, comparables land | Crítica | Sí | — | — | No | Sí | E3 | C1 |
| **Lot Area (acres)** | Superficie en acres cuando aplica | Estándar en land rural | Alta en land | — | Sí | — | No | Sí | E3 | C2 |
| **Lot Width (frontage)** | Ancho de frente sobre vía pública | Desarrollo, zoning, acceso | Alta | — | Sí | — | No | Sí | E3 | C2 |
| **Lot Depth** | Profundidad del lote | Desarrollo y uso | Media-alta | — | Sí | — | No | Sí | E2 | C3 |
| **Irregular Lot Flag** | Indicador de forma no rectangular | Complejidad construcción y valor | Media | — | — | Sí | No | Sí | E2 | C4 |
| **Corner Lot Flag** | Lote en esquina | Valor, acceso dual, tráfico | Media | — | — | Sí | No | Sí | E2 | C3 |
| **Flag Lot / Panhandle Flag** | Lote con acceso por franja estrecha | Acceso, servicios, valor | Media-alta | — | Sí | — | No | Sí | E2 | C3 |
| **Through Lot Flag** | Lote con frente en dos calles paralelas | Valor y desarrollo | Media | — | — | Sí | No | Sí | E2 | C4 |
| **Waterfront / Water Body Frontage** | Frente directo a lago, río, canal, océano | Premium o riesgo flood | Alta si aplica | — | Sí | — | No | Sí | E3 | C2 |
| **Water Frontage Length** | Longitud del frente acuático | Valor waterfront | Alta si aplica | — | Sí | — | No | Sí | E3 | C3 |
| **Riparian / Littoral Rights Status** | Derechos ribereños o litorales asociados | Valor y uso legal del agua | Alta si aplica | — | Sí | — | No | Sí | E4 | C2 |
| **Easement Overlay on Parcel** | Servidumbres que cruzan la parcela | Restricción uso y construcción | Alta | — | Sí | — | No | Sí | E4 | C2 |
| **Encroachment Suspected Flag** | Sospecha de invasión de límites por estructura propia o vecina | Riesgo title y capex | Alta | — | Sí | — | No | Sí | E3 | C3 |
| **Setback Compliance Summary** | Resumen de cumplimiento de retiros reguladores | Riesgo legal de ampliación | Media-alta | — | Sí | — | No | Sí | E2 | C3 |
| **Adjacent Parcel Identifiers** | APNs de parcelas colindantes | Assemblage, nuisance, comparables | Media | — | — | Sí | Sí | No | E2 | C4 |

---

## 02.C — Jerarquía administrativa y jurisdiccional

| Nombre del dato | Descripción | Valor | Importancia inversor | Obl. | Rec. | Opt. | Int. | Inv. | Evid. | Conf. |
|-----------------|-------------|-------|----------------------|------|------|------|------|------|-------|-------|
| **Municipality / Incorporated City** | Ciudad incorporada de ubicación | Código, impuestos locales, servicios | Crítica | Sí | — | — | No | Sí | E3 | C1 |
| **County Name** | Condado | Registro, assessor, judicial | Crítica | Sí | — | — | No | Sí | E3 | C1 |
| **State Code** | Estado federado | Marco legal | Crítica | Sí | — | — | No | Sí | E3 | C1 |
| **Census Tract** | Tracto censal | Demografía y mercado | Media | — | Sí | — | No | Sí | E2 | C4 |
| **Census Block Group** | Grupo de bloques censales | Mayor granularidad demográfica | Media | — | — | Sí | No | Sí | E2 | C4 |
| **Metropolitan Statistical Area (MSA)** | Área metropolitana estadística | Contexto macro mercado | Media-alta | — | Sí | — | No | Sí | E2 | C4 |
| **Micropolitan Area** | Área micropolitana si aplica | Mercados secundarios | Media | — | — | Sí | No | Sí | E2 | C4 |
| **Designated Market Area (DMA)** | Área de mercado mediático/comercial | Contexto comercial | Baja-media | — | — | Sí | No | Sí | E2 | C4 |
| **Municipal Jurisdiction Type** | City, town, village, township, unincorporated | Determina quién aplica código | Alta | — | Sí | — | No | Sí | E2 | C3 |
| **Special District Overlays (list)** | Lista de distritos especiales aplicables: fire, water, sewer, CFD, etc. | Cargos fiscales y servicios | Alta | — | Sí | — | No | Sí | E3 | C2 |
| **Public Improvement District (PID) Flag** | Indicador de PID o similar | Cargos adicionales al propietario | Alta si aplica | — | Sí | — | No | Sí | E3 | C2 |
| **Community Facilities District (CFD) / Mello-Roos Status** | Impuesto especial de bonos en California y equivalentes | Coste carrying | Alta si aplica | — | Sí | — | No | Sí | E3 | C2 |
| **HOA / POA Jurisdiction Name** | Nombre de asociación de propietarios con autoridad sobre el activo | Regulación uso y cuotas | Alta si aplica | — | Sí | — | No | Sí | E3 | C2 |
| **School District Primary** | Distrito escolar primario de asignación | Valor residencial US | Alta residencial | — | Sí | — | No | Sí | E2 | C3 |
| **School District Secondary** | Distrito secundario si difiere | Valor residencial | Media | — | — | Sí | No | Sí | E2 | C4 |
| **Fire District** | Distrito de bomberos | Seguro y tiempos respuesta | Media | — | — | Sí | No | Sí | E2 | C4 |
| **Police Jurisdiction** | Jurisdicción policial | Contexto seguridad | Media | — | — | Sí | No | Sí | E2 | C4 |
| **Judicial District / Court Jurisdiction** | Distrito judicial | Procedimientos y foreclosure | Media-alta | — | Sí | — | Sí | No | E2 | C3 |
| **Recording Office Jurisdiction** | Oficina de registro aplicable | Title y documentación | Alta | — | Sí | — | Sí | No | E3 | C2 |

---

## 02.D — Contexto de vecindario y micro-localización

| Nombre del dato | Descripción | Valor | Importancia inversor | Obl. | Rec. | Opt. | Int. | Inv. | Evid. | Conf. |
|-----------------|-------------|-------|----------------------|------|------|------|------|------|-------|-------|
| **Neighborhood Name (canonical)** | Nombre canónico del vecindario | Comparables y narrativa inversor | Alta | — | Sí | — | No | Sí | E2 | C3 |
| **Submarket Name** | Submercado inmobiliario profesional | Análisis institucional | Alta | — | Sí | — | No | Sí | E2 | C3 |
| **Master-Planned Community Name** | Nombre del desarrollo planificado maestro | Contexto regulación y amenities | Media-alta | — | Sí | — | No | Sí | E2 | C3 |
| **Gated Community Flag** | Comunidad cerrada | Seguridad, HOA, acceso | Media | — | — | Sí | No | Sí | E2 | C3 |
| **Urban / Suburban / Rural Classification** | Clasificación de contexto built environment | Estrategia y comparables | Media-alta | — | Sí | — | No | Sí | E2 | C3 |
| **Location Quality Tier (internal)** | Clasificación interna de calidad de ubicación | Priorización Diamond | Media | — | — | Sí | Sí | No | E2 | C4 |
| **Proximity to Employment Centers** | Distancia/tiempo a polos de empleo principales | Demanda rental y resale | Media-alta | — | Sí | — | No | Sí | E2 | C4 |
| **Walkability Context Summary** | Resumen cualitativo de entorno caminable | Estrategia rental urbano | Media | — | — | Sí | No | Sí | E1 | C4 |
| **Noise Exposure Context** | Autopista, ferrocarril, aeropuerto, industrial | Habitabilidad y valor | Media-alta | — | Sí | — | No | Sí | E2 | C4 |
| **View Premium Classification** | Vista: agua, montaña, skyline, golf, none, obstructed | Ajuste valor | Media | — | — | Sí | No | Sí | E1 | C4 |
| **Nuisance Proximity Flags** | Proximidad a landfill, power plant, correctional, etc. | Riesgo valor y habitabilidad | Alta | — | Sí | — | No | Sí | E2 | C3 |
| **Opportunity Zone Flag** | Ubicación en zona de oportunidad federal | Beneficios fiscales inversor | Media si aplica | — | Sí | — | No | Sí | E3 | C2 |
| **Historic District Overlay Flag** | Distrito histórico con restricciones | Capex y uso | Alta si aplica | — | Sí | — | No | Sí | E3 | C2 |
| **TIF / Incentive Zone Flag** | Zona con incentivos de reurbanización | Upside desarrollo | Media | — | — | Sí | No | Sí | E2 | C4 |
| **Census Designated Place (CDP)** | Lugar designado por censo | Contexto demográfico | Media | — | — | Sí | No | Sí | E2 | C4 |

---

## 02.E — Acceso, conectividad y servidumbres de paso

| Nombre del dato | Descripción | Valor | Importancia inversor | Obl. | Rec. | Opt. | Int. | Inv. | Evid. | Conf. |
|-----------------|-------------|-------|----------------------|------|------|------|------|------|-------|-------|
| **Primary Access Type** | Calle pública, private road, easement, land-locked | Habitabilidad y valor | Crítica | Sí | — | — | No | Sí | E3 | C1 |
| **Access Road Surface Type** | Paved, gravel, dirt, none | Coste acceso y servicios | Media-alta | — | Sí | — | No | Sí | E2 | C3 |
| **Private Road Maintenance Obligation** | Obligación de mantenimiento de vía privada | Coste carrying | Alta si aplica | — | Sí | — | No | Sí | E3 | C2 |
| **Ingress/Egress Easement Exists Flag** | Existencia de servidumbre de paso | Crítico en land-locked | Crítica si aplica | Sí | — | — | No | Sí | E4 | C1 |
| **Ingress/Egress Easement Record Reference** | Referencia registral de servidumbre | Prueba legal de acceso | Crítica si aplica | Sí | — | — | No | Sí | E4 | C1 |
| **Shared Driveway Flag** | Entrada compartida con otro propietario | Conflictos y mantenimiento | Media-alta | — | Sí | — | No | Sí | E2 | C3 |
| **Alley Access Flag** | Acceso por callejón trasero | Valor y uso comercial | Media | — | — | Sí | No | Sí | E2 | C4 |
| **Pedestrian Access Only Flag** | Sin acceso vehicular | Impacto radical en uso | Alta si aplica | — | Sí | — | No | Sí | E2 | C3 |
| **Gate / Controlled Access Description** | Descripción de acceso controlado | Operaciones visita e inspección | Media | — | — | Sí | No | Sí | E1 | C4 |

---

## 02.F — Metadatos de localización

| Nombre del dato | Descripción | Valor | Importancia inversor | Obl. | Rec. | Opt. | Int. | Inv. | Evid. | Conf. |
|-----------------|-------------|-------|----------------------|------|------|------|------|------|-------|-------|
| **Location Last Verified Date** | Última verificación de datos de localización | Frescura | Alta | — | Sí | — | Sí | No | E3 | C2 |
| **Parcel Geometry Source Quality** | Calidad de la fuente de geometría | Confianza en límites | Media-alta | — | Sí | — | Sí | No | E2 | C3 |
| **Location Confidence Score** | Puntuación global de confianza de localización | Gate interno | Alta | Sí | — | — | Sí | No | E3 | C1 |
| **Location Evidence Bundle Reference** | Referencia probatoria de localización | Auditabilidad | Alta | Sí | — | — | Sí | No | E4 | C1 |
| **Jurisdiction Ambiguity Flag** | Ambigüedad en límites municipales o distritos | Riesgo código y fiscal | Alta si aplica | — | Sí | — | Sí | No | E2 | C3 |

---

# DOMINIO 03 — CARACTERÍSTICAS FÍSICAS

**Objetivo del dominio:** Conocer la composición material, dimensional, estructural y de condición del inmueble y sus mejoras.

---

## 03.A — Dimensiones y masa edificada

| Nombre del dato | Descripción | Valor | Importancia inversor | Obl. | Rec. | Opt. | Int. | Inv. | Evid. | Conf. |
|-----------------|-------------|-------|----------------------|------|------|------|------|------|-------|-------|
| **Gross Living Area (GLA)** | Área habitable bruta en sq ft | Comparable primario residencial | Crítica residencial | Sí | — | — | No | Sí | E3 | C1 |
| **Gross Building Area (GBA)** | Área total construida incluyendo no habitable | Comercial e industrial | Crítica comercial | Sí | — | — | No | Sí | E3 | C1 |
| **Rentable Square Footage** | Área rentable efectiva | Valoración comercial rental | Crítica comercial rental | — | Sí | — | No | Sí | E3 | C2 |
| **Usable Square Footage** | Área usable neta | Office y retail | Alta comercial | — | Sí | — | No | Sí | E3 | C2 |
| **Basement Area (finished)** | Sótano terminado en sq ft | Valor y comparables | Alta si aplica | — | Sí | — | No | Sí | E2 | C3 |
| **Basement Area (unfinished)** | Sótano sin terminar | Potencial y riesgo humedad | Media | — | — | Sí | No | Sí | E2 | C4 |
| **Attic Area (finished)** | Ático habitable | Valor adicional | Media | — | — | Sí | No | Sí | E2 | C4 |
| **Garage Area** | Área de garaje en sq ft | Valor y conteo parking | Media-alta | — | Sí | — | No | Sí | E2 | C3 |
| **Number of Stories** | Plantas sobre nivel de suelo | Construcción y valor | Alta | — | Sí | — | No | Sí | E3 | C2 |
| **Stories Below Grade** | Niveles bajo grado | Riesgo inundación y valor | Media-alta | — | Sí | — | No | Sí | E2 | C3 |
| **Building Height** | Altura del edificio | Zoning y compliance | Media comercial | — | — | Sí | No | Sí | E2 | C4 |
| **Floor Plate Size** | Superficie por planta | Office/industrial | Media comercial | — | — | Sí | No | Sí | E2 | C4 |
| **Lot Coverage Ratio** | Porcentaje de parcela ocupada por edificación | Zoning y ampliación | Media-alta | — | Sí | — | No | Sí | E2 | C3 |
| **Floor Area Ratio (FAR) Current** | FAR construido actual | Desarrollo residual | Alta desarrollo | — | Sí | — | No | Sí | E3 | C3 |
| **Building Footprint Polygon** | Huella del edificio sobre parcela | Setbacks, ampliación | Media-alta | — | Sí | — | No | Sí | E2 | C3 |
| **Open Area on Parcel** | Área no construida en parcela | Desarrollo, parking, agricultura | Media | — | — | Sí | No | Sí | E2 | C4 |

---

## 03.B — Configuración espacial y habitaciones

| Nombre del dato | Descripción | Valor | Importancia inversor | Obl. | Rec. | Opt. | Int. | Inv. | Evid. | Conf. |
|-----------------|-------------|-------|----------------------|------|------|------|------|------|-------|-------|
| **Bedrooms Count** | Número de dormitorios | Comparable y rental demand | Crítica residencial | Sí | — | — | No | Sí | E3 | C2 |
| **Bathrooms Full Count** | Baños completos | Valor y comparables | Crítica residencial | Sí | — | — | No | Sí | E3 | C2 |
| **Bathrooms Partial Count** | Medios baños | Valor | Alta residencial | — | Sí | — | No | Sí | E2 | C3 |
| **Total Rooms Count** | Número total de estancias | Contexto | Media | — | — | Sí | No | Sí | E2 | C4 |
| **Master Bedroom Ensuite Flag** | Suite principal con baño | Valor residencial | Baja-media | — | — | Sí | No | Sí | E1 | C4 |
| **Unit Mix (multifamily)** | Desglose tipologías: studio, 1BR, 2BR, etc. por unidad | Valoración multifamily | Crítica multifamily | Sí | — | — | No | Sí | E3 | C1 |
| **Number of Units (rent-roll physical)** | Unidades físicas rentables | NOI y valor | Crítica multifamily | Sí | — | — | No | Sí | E3 | C1 |
| **Average Unit Size** | Tamaño medio por unidad | Comparables multifamily | Alta multifamily | — | Sí | — | No | Sí | E3 | C2 |
| **Commercial Bay Count** | Naves o bays comerciales | Valor industrial/retail | Alta comercial | — | Sí | — | No | Sí | E2 | C3 |
| **Clear Height** | Altura libre interior | Industrial y warehouse | Alta industrial | — | Sí | — | No | Sí | E2 | C3 |
| **Column Spacing** | Separación entre columnas | Usabilidad industrial | Media industrial | — | — | Sí | No | Sí | E2 | C4 |
| **Office Buildout Percentage** | Porcentaje de área office en industrial | Valor mixto | Media | — | — | Sí | No | Sí | E2 | C4 |
| **Layout Efficiency Score (internal)** | Eficiencia de planta | Valoración institucional | Media | — | — | Sí | Sí | No | E1 | C4 |

---

## 03.C — Tipología constructiva y estructura

| Nombre del dato | Descripción | Valor | Importancia inversor | Obl. | Rec. | Opt. | Int. | Inv. | Evid. | Conf. |
|-----------------|-------------|-------|----------------------|------|------|------|------|------|-------|-------|
| **Construction Type** | Wood frame, masonry, steel, concrete, mixed | Coste rehab, seguro, riesgo | Alta | — | Sí | — | No | Sí | E3 | C2 |
| **Foundation Type** | Slab, crawl space, basement, pier, pilings | Riesgo estructural y coste | Alta | — | Sí | — | No | Sí | E2 | C3 |
| **Exterior Wall Material** | Brick, stucco, siding, stone, curtain wall, etc. | Capex mantenimiento | Media-alta | — | Sí | — | No | Sí | E2 | C3 |
| **Roof Type** | Gable, flat, hip, mansard, etc. | Mantenimiento y riesgo | Media-alta | — | Sí | — | No | Sí | E2 | C3 |
| **Roof Material** | Asphalt shingle, tile, metal, TPO, slate, etc. | Vida útil y capex | Alta | — | Sí | — | No | Sí | E2 | C3 |
| **Roof Age (estimated)** | Edad estimada del tejado | Capex inmediato | Alta | — | Sí | — | No | Sí | E2 | C3 |
| **Remaining Roof Life (estimated)** | Vida útil restante estimada | Presupuesto rehab | Alta | — | Sí | — | No | Sí | E2 | C4 |
| **Year Built** | Año de construcción original | Depreciación, código, comparables | Crítica | Sí | — | — | No | Sí | E3 | C1 |
| **Year Built Confidence** | Confianza en año de construcción | Transparencia de riesgo | Alta | — | Sí | — | Sí | No | E2 | C2 |
| **Effective Year / Remodeled Year** | Año efectivo tras reformas mayores | Valor y condición | Alta | — | Sí | — | No | Sí | E2 | C3 |
| **Historic Structure Flag** | Edificio histórico o pre- código antiguo | Restricciones y costes | Alta si aplica | — | Sí | — | No | Sí | E3 | C2 |
| **Architect / Designer Name** | Arquitecto si es relevante al valor | Premium brand | Baja | — | — | Sí | No | Sí | E2 | C4 |
| **Builder / Developer Name (original)** | Constructor o desarrollador original | Calidad reputacional | Media en new build | — | — | Sí | No | Sí | E2 | C4 |
| **Structural Modification History Summary** | Resumen de modificaciones estructurales conocidas | Riesgo sin permiso | Alta | — | Sí | — | No | Sí | E2 | C3 |
| **Known Unpermitted Work Flag** | Obra sin permiso conocida o sospechada | Riesgo legal y capex | Alta | — | Sí | — | No | Sí | E2 | C3 |
| **Seismic Retrofit Status** | Estado de refuerzo sísmico | Riesgo en zonas sísmicas | Alta si aplica | — | Sí | — | No | Sí | E3 | C2 |
| **Load-Bearing Wall Modification Flag** | Modificación de muros de carga | Riesgo estructural | Alta si aplica | — | Sí | — | No | Sí | E2 | C3 |

---

## 03.D — Sistemas mecánicos, eléctricos y de servicios

| Nombre del dato | Descripción | Valor | Importancia inversor | Obl. | Rec. | Opt. | Int. | Inv. | Evid. | Conf. |
|-----------------|-------------|-------|----------------------|------|------|------|------|------|-------|-------|
| **HVAC Type** | Central, mini-split, window, packaged, boiler, none | Capex y habitabilidad | Alta | — | Sí | — | No | Sí | E2 | C3 |
| **HVAC Age (estimated)** | Edad del sistema HVAC | Reemplazo inminente | Alta | — | Sí | — | No | Sí | E2 | C4 |
| **HVAC Condition** | Excelente a fallido | Rehab budget | Alta | — | Sí | — | No | Sí | E2 | C3 |
| **Heating Fuel Type** | Gas, electric, oil, propane, solar, geothermal | Coste operativo | Media-alta | — | Sí | — | No | Sí | E2 | C3 |
| **Cooling Present Flag** | Existencia de refrigeración | Habitabilidad en climas cálidos | Alta sur US | — | Sí | — | No | Sí | E2 | C3 |
| **Electrical Service Amperage** | Amperaje del servicio eléctrico | Capacidad y seguridad | Alta | — | Sí | — | No | Sí | E2 | C3 |
| **Electrical Panel Type** | Breaker, fuse, known hazardous brands | Riesgo seguridad | Alta | — | Sí | — | No | Sí | E2 | C3 |
| **Electrical Wiring Type** | Copper, aluminum, knob-and-tube, mixed | Seguro y capex | Alta en older stock | — | Sí | — | No | Sí | E2 | C3 |
| **Plumbing Material** | Copper, PEX, PVC, galvanized, polybutylene, mixed | Riesgo fugas y capex | Alta | — | Sí | — | No | Sí | E2 | C3 |
| **Water Heater Type and Age** | Tipo y edad del calentador | Capex menor pero frecuente | Media | — | Sí | — | No | Sí | E2 | C4 |
| **Sewer Connection Type** | Público, septic, unknown | Coste y habitabilidad | Alta | — | Sí | — | No | Sí | E3 | C2 |
| **Septic System Age and Capacity** | Edad y capacidad del sistema séptico | Riesgo en rural | Alta si aplica | — | Sí | — | No | Sí | E2 | C3 |
| **Water Source Type** | Público, well, shared well, cistern | Coste y habitabilidad | Alta | — | Sí | — | No | Sí | E3 | C2 |
| **Well Permit / Capacity** | Capacidad de pozo si aplica | Habitabilidad rural | Alta si aplica | — | Sí | — | No | Sí | E3 | C2 |
| **Natural Gas Available Flag** | Disponibilidad de gas natural | Coste energético | Media | — | — | Sí | No | Sí | E2 | C4 |
| **Solar PV Present Flag** | Paneles solares instalados | NOI y valor | Media | — | — | Sí | No | Sí | E2 | C4 |
| **Solar Ownership Status** | Owned, leased, PPA | Obligaciones y transferencia | Media si aplica | — | Sí | — | No | Sí | E3 | C2 |
| **Generator / Backup Power** | Sistema de respaldo | Resiliencia comercial | Media comercial | — | — | Sí | No | Sí | E2 | C4 |
| **Fire Sprinkler System** | Sistema de rociadores | Compliance comercial | Alta comercial | — | Sí | — | No | Sí | E3 | C2 |
| **Fire Alarm System** | Sistema de alarma incendio | Compliance | Media comercial | — | — | Sí | No | Sí | E2 | C4 |
| **Elevator Count and Status** | Ascensores en multifamily/commercial | Compliance ADA y capex | Alta si aplica | — | Sí | — | No | Sí | E2 | C3 |
| **Elevator Modernization Year** | Año de modernización | Capex futuro | Media | — | — | Sí | No | Sí | E2 | C4 |

---

## 03.E — Condición física y habitabilidad

| Nombre del dato | Descripción | Valor | Importancia inversor | Obl. | Rec. | Opt. | Int. | Inv. | Evid. | Conf. |
|-----------------|-------------|-------|----------------------|------|------|------|------|------|-------|-------|
| **Overall Physical Condition Rating** | Calificación global: excellent, good, fair, poor, uninhabitable | Rehab scope y ARV | Crítica | Sí | — | — | No | Sí | E2 | C2 |
| **Condition Assessment Date** | Fecha de evaluación de condición | Frescura | Alta | — | Sí | — | Sí | No | E2 | C3 |
| **Habitability Status** | Habitable, partially habitable, uninhabitable | Timeline y estrategia | Crítica | Sí | — | — | No | Sí | E2 | C2 |
| **Occupancy-Related Wear Level** | Nivel de desgaste por ocupación | Capex cosmetic vs structural | Media-alta | — | Sí | — | No | Sí | E1 | C4 |
| **Fire Damage History Flag** | Daño por incendio histórico o activo | Riesgo y capex | Alta si aplica | — | Sí | — | No | Sí | E3 | C2 |
| **Flood Damage History Flag** | Daño por inundación histórico | Riesgo y seguro | Alta si aplica | — | Sí | — | No | Sí | E3 | C2 |
| **Mold / Moisture Issue Flag** | Problemas de humedad o moho | Salud y capex | Alta | — | Sí | — | No | Sí | E2 | C3 |
| **Pest Infestation Flag** | Termites, roedores u otras plagas | Capex y estructura | Alta | — | Sí | — | No | Sí | E2 | C3 |
| **Asbestos Suspected Flag** | Sospecha de amianto | Capex y riesgo salud | Alta pre-1980 | — | Sí | — | No | Sí | E2 | C3 |
| **Lead Paint Suspected Flag** | Sospecha de pintura con plomo | Riesgo y capex pre-1978 | Alta older stock | — | Sí | — | No | Sí | E2 | C3 |
| **Foundation Issue Flag** | Problemas de cimentación | Capex mayor | Alta | — | Sí | — | No | Sí | E2 | C3 |
| **Roof Active Leak Flag** | Filtración activa | Capex inmediato | Alta | — | Sí | — | No | Sí | E2 | C3 |
| **Structural Damage Flag** | Daño estructural confirmado o sospechado | Riesgo crítico | Alta | — | Sí | — | No | Sí | E2 | C3 |
| **Deferred Maintenance Estimate Range** | Rango estimado de mantenimiento diferido | Presupuesto rehab | Alta | — | Sí | — | No | Sí | E2 | C4 |
| **Renovation Scope Classification** | Cosmetic, moderate, full gut, rebuild | Estrategia flip/BRRRR | Crítica | Sí | — | — | No | Sí | E2 | C3 |
| **Estimated Rehab Cost Range** | Rango de coste de rehabilitación | Margin y ROI | Crítica | Sí | — | — | No | Sí | E2 | C4 |
| **Time to Rehab Estimate** | Tiempo estimado de rehabilitación | Carry cost y timeline | Alta | — | Sí | — | No | Sí | E1 | C4 |
| **Certificate of Occupancy Status** | CO vigente, expired, never issued, unknown | Habitabilidad legal | Alta | — | Sí | — | No | Sí | E3 | C2 |
| **Last Inspection Date (physical)** | Última inspección física conocida | Frescura | Alta | — | Sí | — | Sí | No | E2 | C3 |
| **Inspection Summary Reference** | Referencia a informe de inspección | Due diligence | Alta | — | Sí | — | Sí | No | E3 | C2 |

---

## 03.F — Exterior, sitio y mejoras en parcela

| Nombre del dato | Descripción | Valor | Importancia inversor | Obl. | Rec. | Opt. | Int. | Inv. | Evid. | Conf. |
|-----------------|-------------|-------|----------------------|------|------|------|------|------|-------|-------|
| **Parking Spaces Count** | Plazas de aparcamiento totales | Valor comercial y multifamily | Alta | — | Sí | — | No | Sí | E2 | C3 |
| **Parking Type** | Garage attached, detached, carport, surface, structured | Valor y uso | Media-alta | — | Sí | — | No | Sí | E2 | C3 |
| **Garage Spaces Count** | Plazas en garaje | Valor residencial | Media-alta | — | Sí | — | No | Sí | E2 | C3 |
| **Driveway Surface** | Concrete, asphalt, gravel, none | Coste y acceso | Baja-media | — | — | Sí | No | Sí | E1 | C4 |
| **Fence / Perimeter Description** | Tipo de cerramiento perimetral | Seguridad y coste | Baja-media | — | — | Sí | No | Sí | E1 | C4 |
| **Pool Present Flag** | Existencia de piscina | Valor y riesgo liability | Media | — | — | Sí | No | Sí | E2 | C3 |
| **Pool Type and Condition** | Tipo y estado de piscina | Capex | Media si aplica | — | Sí | — | No | Sí | E2 | C4 |
| **Spa / Hot Tub Flag** | Existencia de spa | Valor menor | Baja | — | — | Sí | No | Sí | E1 | C4 |
| **Deck / Patio Area** | Área de terraza o deck | Valor residencial | Baja-media | — | — | Sí | No | Sí | E1 | C4 |
| **Landscaping Condition** | Estado del paisajismo | Curb appeal y capex | Media flip | — | — | Sí | No | Sí | E1 | C4 |
| **Irrigation System** | Sistema de riego | Coste mantenimiento | Baja-media | — | — | Sí | No | Sí | E1 | C4 |
| **Outbuildings List** | Lista de construcciones auxiliares: shed, barn, workshop | Valor y permisos | Media | — | Sí | — | No | Sí | E2 | C3 |
| **Accessory Dwelling Unit (ADU) Present Flag** | Existencia de ADU | Ingreso adicional y legalidad | Alta si aplica | — | Sí | — | No | Sí | E3 | C2 |
| **ADU Permitted Status** | ADU legalmente permitido o no | Riesgo y valor | Alta si aplica | — | Sí | — | No | Sí | E3 | C2 |
| **Guest House Present Flag** | Casa de invitados separada | Valor y legalidad | Media | — | — | Sí | No | Sí | E2 | C3 |
| **Retaining Walls / Site Improvements** | Muros de contención y mejoras de sitio | Coste y riesgo | Media hillside | — | — | Sí | No | Sí | E2 | C4 |
| **Drainage / Grading Issue Flag** | Problemas de drenaje o nivelación | Riesgo estructural | Alta si aplica | — | Sí | — | No | Sí | E2 | C3 |
| **Hardscaping Value Features** | Outdoor kitchen, fire pit, etc. | Valor residencial premium | Baja | — | — | Sí | No | Sí | E1 | C4 |
| **Dock / Boat Slip** | Muelle o amarre | Valor waterfront | Alta si aplica | — | Sí | — | No | Sí | E3 | C2 |
| **Agricultural Use Features** | Huerto, invernadero, establos | Valor land/ag | Media ag | — | — | Sí | No | Sí | E2 | C4 |

---

## 03.G — Accesibilidad, cumplimiento físico y seguridad

| Nombre del dato | Descripción | Valor | Importancia inversor | Obl. | Rec. | Opt. | Int. | Inv. | Evid. | Conf. |
|-----------------|-------------|-------|----------------------|------|------|------|------|------|-------|-------|
| **ADA Compliance Status** | Cumplimiento ADA en comercial/multifamily común | Riesgo legal comercial | Alta comercial | — | Sí | — | No | Sí | E3 | C2 |
| **Accessibility Features List** | Rampas, grab bars, wide doors, etc. | Valor y compliance | Media | — | — | Sí | No | Sí | E1 | C4 |
| **Smoke / CO Detectors Compliance** | Cumplimiento detectores | Habitabilidad | Media | — | — | Sí | No | Sí | E1 | C4 |
| **Security Features** | Alarm, cameras, gated entry, intercom | Valor y operación | Media | — | — | Sí | No | Sí | E1 | C4 |
| **Storm Shutters / Hurricane Protection** | Protección contra huracanes | Valor y seguro coastal | Alta coastal | — | Sí | — | No | Sí | E2 | C3 |
| **Safe Room / Shelter** | Refugio ante tornados | Valor en tornado alley | Media | — | — | Sí | No | Sí | E1 | C4 |
| **Balcony / Deck Structural Integrity Status** | Integridad estructural de balcones | Riesgo multifamily | Alta multifamily | — | Sí | — | No | Sí | E2 | C3 |

---

## 03.H — Características específicas por clase de activo

### 03.H.1 — Multifamily y rental

| Nombre del dato | Descripción | Valor | Importancia inversor | Obl. | Rec. | Opt. | Int. | Inv. | Evid. | Conf. |
|-----------------|-------------|-------|----------------------|------|------|------|------|------|-------|-------|
| **Common Area Condition** | Estado de áreas comunes | Valor y capex multifamily | Alta multifamily | — | Sí | — | No | Sí | E2 | C3 |
| **Laundry Facilities** | In-unit, common, none | NOI y demanda | Media multifamily | — | — | Sí | No | Sí | E2 | C4 |
| **Amenities Package** | Pool, gym, clubhouse, package lockers, etc. | Comparables multifamily | Media-alta | — | Sí | — | No | Sí | E2 | C3 |
| **Unit-Level Washer/Dryer Hookups** | Conexiones por unidad | Rent premium | Media | — | — | Sí | No | Sí | E2 | C4 |
| **Balcony/Patio per Unit Ratio** | Porcentaje unidades con exterior privado | Valor | Media | — | — | Sí | No | Sí | E2 | C4 |

### 03.H.2 — Retail y office

| Nombre del dato | Descripción | Valor | Importancia inversor | Obl. | Rec. | Opt. | Int. | Inv. | Evid. | Conf. |
|-----------------|-------------|-------|----------------------|------|------|------|------|------|-------|-------|
| **Storefront Frontage Width** | Ancho de fachada comercial | Valor retail | Alta retail | — | Sí | — | No | Sí | E2 | C3 |
| **Visibility / Signage Rights** | Derechos de visibilidad y señalización | Valor retail | Alta retail | — | Sí | — | No | Sí | E2 | C3 |
| **Traffic Count Exposure (contextual)** | Exposición a tráfico vehicular o peatonal | Valor retail | Alta retail | — | Sí | — | No | Sí | E2 | C4 |
| **Loading Dock Count** | Muelles de carga | Industrial/retail | Alta si aplica | — | Sí | — | No | Sí | E2 | C3 |
| **Ceiling Height (office)** | Altura de techo office | Valor office | Media office | — | — | Sí | No | Sí | E2 | C4 |
| **Window Line / Natural Light** | Luz natural y perímetro ventanas | Valor office | Media | — | — | Sí | No | Sí | E1 | C4 |

### 03.H.3 — Industrial y warehouse

| Nombre del dato | Descripción | Valor | Importancia inversor | Obl. | Rec. | Opt. | Int. | Inv. | Evid. | Conf. |
|-----------------|-------------|-------|----------------------|------|------|------|------|------|-------|-------|
| **Dock-High Doors Count** | Puertas a nivel muelle | Funcionalidad logística | Alta industrial | — | Sí | — | No | Sí | E2 | C3 |
| **Grade-Level Doors Count** | Puertas a nivel suelo | Funcionalidad | Media industrial | — | — | Sí | No | Sí | E2 | C4 |
| **Truck Court Depth** | Profundidad de patio de maniobras | Operaciones | Media industrial | — | — | Sí | No | Sí | E2 | C4 |
| **Power Capacity (three-phase)** | Capacidad eléctrica industrial | Uso industrial | Alta industrial | — | Sí | — | No | Sí | E2 | C3 |
| **Crane / Heavy Load Capacity** | Grúa o capacidad de carga pesada | Valor niche industrial | Media | — | — | Sí | No | Sí | E2 | C4 |
| **Floor Load Capacity** | Capacidad de carga del suelo | Uso industrial | Alta industrial | — | Sí | — | No | Sí | E2 | C3 |
| **Hazmat Suitability / Restrictions** | Idoneidad o restricción materiales peligrosos | Riesgo y uso | Alta si aplica | — | Sí | — | No | Sí | E3 | C2 |

### 03.H.4 — Terreno (land)

| Nombre del dato | Descripción | Valor | Importancia inversor | Obl. | Rec. | Opt. | Int. | Inv. | Evid. | Conf. |
|-----------------|-------------|-------|----------------------|------|------|------|------|------|-------|-------|
| **Raw Land vs Improved Land** | Terreno sin mejoras vs con infraestructura | Estrategia desarrollo | Crítica land | Sí | — | — | No | Sí | E3 | C1 |
| **Entitlements Status Summary** | Resumen de derechos de desarrollo obtenidos | Valor land | Crítica land dev | — | Sí | — | No | Sí | E4 | C2 |
| **Utility Availability at Street** | Agua, sewer, electric, gas en calle | Viabilidad desarrollo | Crítica land | — | Sí | — | No | Sí | E3 | C2 |
| **Soil Type / Bearing Capacity** | Tipo de suelo y capacidad portante | Coste construcción | Alta land dev | — | Sí | — | No | Sí | E2 | C3 |
| **Wetlands / Floodplain On-Site Flag** | Humedales o floodplain en parcela | Restricción desarrollo | Crítica si aplica | — | Sí | — | No | Sí | E3 | C2 |
| **Timber / Agricultural Production Status** | Producción forestal o agrícola activa | Valor y uso | Media ag/land | — | — | Sí | No | Sí | E2 | C4 |
| **Topography Classification** | Llano, rolling, steep | Coste desarrollo | Alta land | — | Sí | — | No | Sí | E2 | C3 |

---

## 03.I — Mejoras, fixtures y personal property

| Nombre del dato | Descripción | Valor | Importancia inversor | Obl. | Rec. | Opt. | Int. | Inv. | Evid. | Conf. |
|-----------------|-------------|-------|----------------------|------|------|------|------|------|-------|-------|
| **Major Recent Improvements List** | Lista de mejoras recientes: roof, HVAC, kitchen, etc. | Ajuste valor y condición | Alta | — | Sí | — | No | Sí | E2 | C3 |
| **Improvement Date per Item** | Fecha por mejora | Depreciación y warranty | Media | — | — | Sí | No | Sí | E2 | C4 |
| **Warranty Status Major Systems** | Garantías vigentes en sistemas mayores | Riesgo capex | Media | — | — | Sí | No | Sí | E2 | C4 |
| **Appliances Included List** | Electrodomésticos incluidos | Valor menor residencial | Baja-media | — | — | Sí | No | Sí | E1 | C4 |
| **Fixtures Trade Value Estimate** | Valor estimado de fixtures | Negociación menor | Baja | — | — | Sí | Sí | No | E1 | C5 |
| **Personal Property Exclusion Flag** | Exclusión explícita de personal property en tesis | Claridad transacción | Media | — | Sí | — | No | Sí | E2 | C3 |

---

## 03.J — Metadatos de características físicas

| Nombre del dato | Descripción | Valor | Importancia inversor | Obl. | Rec. | Opt. | Int. | Inv. | Evid. | Conf. |
|-----------------|-------------|-------|----------------------|------|------|------|------|------|-------|-------|
| **Physical Characteristics Last Updated** | Fecha de última actualización del dominio | Frescura | Alta | — | Sí | — | Sí | No | E2 | C3 |
| **Physical Data Completeness Score** | Porcentaje de completitud del inventario físico | Gap analysis | Alta | Sí | — | — | Sí | No | E2 | C2 |
| **Physical Characteristics Confidence Score** | Confianza global del dominio | Gate Decision-Diamond | Alta | Sí | — | — | Sí | No | E2 | C2 |
| **Assessor vs Observed Variance Flags** | Discrepancias entre assessor y observación | Riesgo de error | Alta | — | Sí | — | Sí | No | E2 | C3 |
| **Physical Evidence Bundle Reference** | Referencia probatoria del dominio físico | Auditabilidad | Alta | Sí | — | — | Sí | No | E3 | C1 |
| **Known Data Gap List (physical)** | Lista explícita de lagunas de conocimiento físico | Transparencia IC | Alta | — | Sí | — | Sí | No | E1 | C3 |

---

# Resumen cuantitativo de la Parte I

| Dominio | Elementos inventariados |
|---------|-------------------------|
| **01 — Identificación del inmueble** | 52 |
| **02 — Localización** | 68 |
| **03 — Características físicas** | 127 |
| **TOTAL PARTE I** | **247** |

---

# Reglas de gobernanza de este inventario

1. Todo elemento nuevo de la Parte I requiere enmienda a este documento.  
2. Ningún campo puede eliminarse sin enmienda — solo reclasificarse.  
3. Los documentos de fuentes, evidencia y verificación posteriores **mapean** a estos elementos — no los sustituyen.  
4. La ausencia de un elemento **Obl.** bloquea candidatura Diamond según DKN-09 y DKN-36.  
5. **Int.** vs **Inv.** obedece además Owner Authorization y Compliance — este inventario declara intención factory.

---

# Constitución de la Parte I — Diez leyes

| # | Ley |
|---|-----|
| **DDI-01** | Este inventario es **exhaustivo por diseño** — la brecha se declara, no se ignora |
| **DDI-02** | Dominio 01 requiere **C1** en identificadores primarios |
| **DDI-03** | Dominio 02 requiere **C1** en posición y límites parcelarios |
| **DDI-04** | Dominio 03 requiere **C2** mínimo en condición y dimensiones primarias |
| **DDI-05** | Metadatos de confianza y completitud son **obligatorios** |
| **DDI-06** | Evidence Bundle Reference es **obligatorio** por dominio |
| **DDI-07** | Known Data Gap List es **recomendado** — ocultar laguna es prohibido |
| **DDI-08** | Clasificación por asset class **activa** subconjuntos H sin eliminar obligatorios base |
| **DDI-09** | Parte I **no incluye** legal, owner, financiero — Partes posteriores |
| **DDI-10** | Toda Parte I **somete** a MPI, DKN y Auditoría Maestra |

---

*DIAMOND DATA INVENTORY — PARTE I: Identidad del Activo, Localización y Características Físicas. Tercer documento oficial de la Auditoría Maestra RealEstateSniper Factory 2.0.*

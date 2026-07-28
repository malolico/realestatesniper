# P-INT-03 — Durable Persistence (Residual) — Implementation Mandate

## RealEstateSniper Factory 2.0

| Campo | Valor |
|-------|--------|
| **Document ID** | `P_INT_03_DURABLE_IMPLEMENTATION_MANDATE.md` |
| **Path** | `docs/factory-construction/integration/P_INT_03_DURABLE_IMPLEMENTATION_MANDATE.md` |
| **Nature** | Director Implementation Mandate — documentary authorization for **OBJECT STORE** path only |
| **Block** | P-INT-03 — ELR Persistence Bridge (**Durable Persistence residual** — Master Plan Fase II ítem 5) |
| **Mandate ID** | `P-INT-03-DURABLE-OBJECT-STORE-IMPL` |
| **Implementation Path** | **PATH SELECTED: OBJECT STORE** |
| **Final state** | **APPROVED** |
| **Effective authorization** | **IMPLEMENTATION AUTHORIZED** — exclusively for path **OBJECT STORE** under this Mandate ID |

---

## 1. Título

Mandato oficial de implementación — P-INT-03 Durable Persistence (residual) — path **OBJECT STORE**.

---

## 2. Mandato

```text
P-INT-03-DURABLE-OBJECT-STORE-IMPL
```

Este documento **emite** el mandato Director `P-INT-03-DURABLE-OBJECT-STORE-IMPL`.

**Director decision (binding):**

```text
Implementation Path = OBJECT STORE
PATH SELECTED: OBJECT STORE
```

---

## 3. Identificación del bloque

| Campo | Valor |
|-------|--------|
| **Nombre oficial** | **P-INT-03 — ELR Persistence Bridge (Durable Persistence residual)** |
| **Master Plan** | §5 Fase II ítem **5**; §3.2 **P-INT-03**; §4.2 ELR Store Adapter; §7.1 sustituye store, no contrato |
| **Prior slice** | P-INT-03 Offline / Local Durable — **COMPLETE / CLOSED** |
| **Path medium** | **PATH SELECTED: OBJECT STORE** (Cloud / Supabase-ELR / Dedicated DB **not** authorized by this Mandate) |
| **Debt tags (as documented)** | **TD-ELR-CLOUD** remains OPEN until honest Status post-IMPL for unselected cloud residual if applicable; **TD-SQLITE** DEFERRED / NOT AUTHORIZED |

---

## 4. Referencias documentales

| Referencia | Documento | Estado registrado |
|------------|-----------|-------------------|
| **Official Discovery** | `docs/factory-construction/integration/FACTORY_INTEGRATION_P_INT_03_DURABLE_DISCOVERY_REPORT.md` | **COMPLETE / APPROVED** |
| **Implementation Plan** | `docs/factory-construction/integration/FACTORY_INTEGRATION_P_INT_03_DURABLE_IMPLEMENTATION_PLAN.md` | **PLAN ONLY** (Documentary Audit passed) |
| **Documentary Audit** | Final validation (session) | **PASS** — gaps **NONE** — conclusion **READY FOR DOCUMENTARY COMMIT** |
| **Documentary Commit** | `docs/factory-construction/integration/FACTORY_INTEGRATION_P_INT_03_DURABLE_DOCUMENTARY_COMMIT_STATUS.md` | **DOCUMENTARY COMMITTED** |
| **Normative companions (binding context)** | Master Plan; Continuity Dossier; P-INT-03 Offline Plan; P-INT-03 Offline Status; Construction Blueprint CB-01 | As cited by Discovery / Plan — not reopened here |

This Mandate **does not** reinterpret Discovery and **does not** modify the Implementation Plan text.

---

## 5. Alcance autorizado (IMPLEMENTATION AUTHORIZED — OBJECT STORE only)

Bajo el Mandate ID `P-INT-03-DURABLE-OBJECT-STORE-IMPL`, la implementación queda **autorizada exclusivamente** para:

1. Cerrar el residual Master Plan Fase II ítem 5 / P-INT-03 Durable Persistence **vía path OBJECT STORE**.  
2. Entregar **un** adapter de persistencia ELR durable sobre **object store**, compatible con **`ElrStorePort`** / `FactoryRegistry({ store })` por **inyección** — **sustituir store, no contrato**.  
3. Preservar schema constitucional CB-01 / ELR **sin cambio semántico**.  
4. Mantener separación Offline COMPLETE ≠ Durable OBJECT STORE residual; ELR ≠ `deals` / product tables.  
5. Cumplir integrity / fail-closed / auditabilidad according to Plan principles for the **OBJECT STORE** medium.  
6. Conservar **`FileElrStore` como default sin cambios**; AtomicFileElrStore permanece inject-only.  
7. **No** modificar CB-01 bodies / constitutional semantics.  
8. **No** modificar `FactoryRegistry` (salvo que el Plan Offline ya contemplara hook opcional preexistente — **no** requerido ni autorizado aquí como cambio Durable).  
9. Ejecutar regresiones documentadas en el Plan DoD (CB-01 / CB-02 / CB-15; runners Offline aplicables).  
10. Actualizar deuda / residual Master Plan de forma honesta en Status post-IMPL (OBJECT STORE path delivered; unselected paths remain OUT / OPEN as applicable).

**Paths not authorized by this Mandate:** Cloud / Supabase-ELR / PostgREST; Dedicated Database; SQLite.

---

## 6. Alcance expresamente prohibido (binding)

Queda **prohibido** bajo este Mandate:

1. Cualquier path distinto de **OBJECT STORE**.  
2. **Supabase** (ELR, product, migrations, RLS, PostgREST como medio Durable).  
3. **SQLite** / cualquier motor SQL mientras **TD-SQLITE** permanece DEFERRED.  
4. **Product** / **Deals** / markets / **Marketplace** storage as ELR.  
5. Reapertura o rediseño de P-INT-03 Offline.  
6. Flip global del default `FactoryRegistry` store (`FileElrStore` **sin cambios**).  
7. Modificación de CB-01 / `elrSchema` / `appendElrEntry` / `elrSequence` / state machine / semántica ELR.  
8. Modificación de `FactoryRegistry` bajo color de este Mandate.  
9. Web / React / FCC / Admin UI / Vite.  
10. Decision Engine / Projection / Investor API.  
11. Auth productiva (**TD-AUTH-PROD**) / Edge Functions / BFF no acotados.  
12. II.7 Delivery.  
13. Reabrir Slice A/B, Admin Live Wiring, P-INT-09, P-INT-10, Fase I.  
14. P-INT-02 Live; P-INT-04 cloud sink; P-INT-05…08; Fase II ítem 6.  
15. Otros stores `data/factory-*`; SourceIngestionLedger redesign; event-sourcing / replay engine completo.  
16. Push / merge / deploy / remote CI como parte automática de este Mandate.  
17. Dependencias / `package.json` sin registro explícito en Status / orden Director adicional si se requieren para OBJECT STORE.  
18. Arquitectura nueva no prevista por Discovery / Plan.

**Stop Rules Continuity:** §20 (Web) y §21 (Supabase) — **STOP + report** if any work proposes those surfaces. This Mandate **does not** authorize Supabase.

---

## 7. Condiciones de implementación (binding)

Con este Mandate **APPROVED** y path **OBJECT STORE** registrado:

1. Mandate ID definitivo: **`P-INT-03-DURABLE-OBJECT-STORE-IMPL`**.  
2. Path medium: **PATH SELECTED: OBJECT STORE**.  
3. Documentary Audit del Plan = **PASS**.  
4. Documentary Commit Status = **DOCUMENTARY COMMITTED**.  
5. P-INT-03 Offline Status permanece **CLOSED**.  
6. Protocolo Continuity §27: IMPL → Independent Technical Audit → Status → Status Commit.  
7. Default **`FileElrStore` sin cambios**; adapter solo vía **`ElrStorePort`** injection.  
8. **Sin** CB-01 redesign; **sin** FactoryRegistry mutation; **sin** semántica ELR; **sin** Product / Deals / Marketplace / Supabase / SQLite.

---

## 8. Criterios de revocación del Mandate

Este Mandate **queda revocado o debe detenerse** si ocurre cualquiera de:

| ID | Condición |
|----|-----------|
| V1 | Director revoca explícitamente `P-INT-03-DURABLE-OBJECT-STORE-IMPL` |
| V2 | Intento de IMPL por path distinto de **OBJECT STORE** |
| V3 | Escritura de ELR en `deals` / Marketplace / product tables |
| V4 | Cambio semántico constitucional ELR / schema / state machine / CB-01 |
| V5 | Introducción de SQLite / SQL engine mientras DEFERRED |
| V6 | Flip del default `FileElrStore` |
| V7 | Modificación de `FactoryRegistry` no autorizada |
| V8 | Uso de Supabase bajo color de este Mandate |
| V9 | Reapertura de bloques cerrados (Offline P-INT-03, Slice A/B, Admin Live Wiring, P-INT-09/10) |
| V10 | Expansión a Web / Product / Marketplace / II.7 / Fase II ítem 6 sin mandato nuevo |
| V11 | Violación Continuity §20 / §21 sin STOP + report + approval |
| V12 | Contradicción irresoluble READ_ONLY entre este Mandate y Master Plan / Continuity / Offline Status / Discovery / Plan |
| V13 | Presentar push / deploy / remote CI como autorizado sin orden Director adicional |

Revocation implies: **STOP** engineering progress; escalate to Director.

---

## 9. Estado de autorización (actual)

```text
MANDATE APPROVED
MANDATE ID: P-INT-03-DURABLE-OBJECT-STORE-IMPL
PATH SELECTED: OBJECT STORE
IMPLEMENTATION AUTHORIZED — OBJECT STORE ONLY

DEFAULT FileElrStore: UNCHANGED
ADAPTER: ElrStorePort injection only
CB-01: NO MODIFICATION
FactoryRegistry: NO MODIFICATION
ELR semantics: NO MODIFICATION

NO PRODUCT
NO DEALS
NO MARKETPLACE
NO SUPABASE
NO SQLITE
```

---

## 10. Estado final

```text
APPROVED
PATH SELECTED: OBJECT STORE
IMPLEMENTATION AUTHORIZED
```

Mandato: **`P-INT-03-DURABLE-OBJECT-STORE-IMPL`**  
Alcance: **OBJECT STORE adapter behind `ElrStorePort` only**  
Código: **autorizado para implementación** bajo las restricciones de §5–§6.

---

## 11. Cláusula de no exceso

Este Mandate **no** autoriza:

- Cloud / Supabase-ELR / PostgREST / Dedicated DB paths;  
- Supabase product / migrations / RLS;  
- SQLite;  
- Product / Deals / Marketplace;  
- modificación de CB-01, `FactoryRegistry`, o semántica ELR;  
- flip de default `FileElrStore`;  
- Web / FCC;  
- push / merge / deploy sin orden Director adicional;  
- cerrar **TD-ELR-CLOUD** por mera aserción si el residual cloud permanece abierto.

---

**END OF MANDATE**

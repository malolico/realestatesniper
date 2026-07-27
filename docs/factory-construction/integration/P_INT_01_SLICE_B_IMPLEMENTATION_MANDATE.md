# P-INT-01 — Slice B — Implementation Mandate

## RealEstateSniper Factory 2.0

| Campo | Valor |
|-------|--------|
| **Document ID** | `P_INT_01_SLICE_B_IMPLEMENTATION_MANDATE.md` |
| **Path** | `docs/factory-construction/integration/P_INT_01_SLICE_B_IMPLEMENTATION_MANDATE.md` |
| **Nature** | Director Implementation Mandate — documentary authorization only |
| **Final state** | **IMPLEMENTATION AUTHORIZED** |

---

## 1. Título

Mandato oficial de implementación — P-INT-01 Slice B (Job Runner + Orchestration Control Plane).

---

## 2. Mandato

```text
P-INT-01-SLICE-B-IMPL
```

Este documento **emite** el mandato Director `P-INT-01-SLICE-B-IMPL`.

---

## 3. Objetivo

Autorizar la **implementación en staging** de:

**P-INT-01-SLICE-B / Gate C** — Job Runner + Orchestration Control Plane,

conforme al Implementation Plan documental committed, **únicamente** en los sub-slices **B1 → B4**.

---

## 4. Alcance

### 4.1 Autorizado

| Sub-slice | Entrega |
|-----------|---------|
| **B1** | Job model + store (memory \| file staging) |
| **B2** | Worker CLI + invoke CB-15 + boundary |
| **B3** | HTTP command plane (POST/GET/cancel/lineage) |
| **B4** | Validation suite + Implementation Status |

Ubicación de código autorizada (cuando se ejecute IMPL): `services/factory-orchestration-edge/**`, `src/runPInt01SliceBValidation.js`, `src/runFactoryOrchestrationWorker.js`, y Status post-IMPL bajo `docs/factory-construction/integration/`.

Entorno: **STAGING ONLY**.

### 4.2 No autorizado por este mandato

Cualquier trabajo fuera de B1→B4; FCC/Web; cloud ELR; Auth productiva; Handoff/Lifecycle HTTP; P-INT-05…08; Fase IV `dealPipeline` retire/isolate.

---

## 5. Referencias

| Referencia | Documento / evidencia |
|------------|------------------------|
| **Continuity Dossier** | `docs/factory-construction/FACTORY_2_0_COMPLETE_CONTINUITY_DOSSIER.md` |
| **Continuity Independent Documentary Re-Audit** | `docs/factory-construction/integration/FACTORY_2_0_CONTINUITY_DOSSIER_INDEPENDENT_DOCUMENTARY_REAUDIT_STATUS.md` — **PASS WITH OBSERVATIONS** — commit `06a2312226a2305415d15260ed7735567a9193a9` |
| **Gate C** | Independent Technical Audit re-evaluación: **GATE C PASS PENDING DIRECTOR MANDATE** (C-01…C-08 **PASS**; C-09 cerrado por **este** mandato) |
| **Slice B Implementation Plan** | `docs/factory-construction/integration/FACTORY_INTEGRATION_P_INT_01_SLICE_B_IMPLEMENTATION_PLAN.md` — **DOCUMENTARY COMMITTED** — commit `aa367bd69d8342f27a9fb5e84221445a935b0ee7` |
| **Parent P-INT-01 Plan** | `docs/factory-construction/integration/FACTORY_INTEGRATION_P_INT_01_IMPLEMENTATION_PLAN.md` (§3.2, §18) |

---

## 6. Confirmaciones de prerrequisitos

| Prerrequisito | Estado |
|---------------|--------|
| Continuity Dossier Independent Documentary Re-Audit | **DOCUMENTARY COMMITTED** — **PASS WITH OBSERVATIONS** |
| Gate C (C-01…C-08) | **PASS** |
| Gate C C-09 | **CLOSED by this mandate** (`P-INT-01-SLICE-B-IMPL` issued) |
| Slice B Implementation Plan | **DOCUMENTARY COMMITTED** |
| Bloqueos técnicos / documentales abiertos que impidan IMPL B1→B4 | **NONE** |

**Tras este mandato:**

- Gate C queda **satisfecho en C-01…C-09** (C-09 cerrado aquí).
- La implementación queda **autorizada únicamente** para los sub-slices **B1 → B4** según el Plan Slice B.

---

## 7. Restricciones (binding)

| Restricción | Regla |
|-------------|--------|
| Marketplace | **NO** |
| Product / access_tier / Decision Engine | **NO** |
| Supabase | **NO** |
| II.7 Delivery | **NO** |
| Slice A (`services/factory-service-edge/**`) | **NO modificación** (MUST NOT modify) |
| CB-00…CB-19 (`src/factory/cb**`) | **NO modificación** — solo consumo de APIs públicas |
| FCC / Web | **NO** (salvo mandato Continuity §20 separado) |
| Cloud ELR | **NO** |
| `--mark-complete` ledger CB | **NO** |

---

## 8. Obligaciones (post-autorización)

Al ejecutar la implementación bajo este mandato, son **obligatorias**:

1. **Independent Technical Audit** tras IMPL (antes o junto al Status, según protocolo).  
2. **Implementation Commit**(s) atómicos por sub-slice o agrupación autorizada (B1→B4).  
3. **Push** — solo cuando el Director lo ordene explícitamente; **no** automático por este mandato.  
4. **Verificación del HEAD oficial** — READ_ONLY con Git antes de cualquier operación remota (push/merge); confirmar tip y rama `integration/factory-complete-20260725` (u orden Director posterior).

Protocolo: Discovery → Plan → Audit → Commit → **IMPL** → Technical Audit → Status (Continuity §27).

---

## 9. Estado final

```text
IMPLEMENTATION AUTHORIZED
```

Mandato: **`P-INT-01-SLICE-B-IMPL`**  
Alcance: **sub-slices B1 → B4 only**  
Entorno: **staging**  
Código: **autorizado para implementación** bajo las restricciones de §7.

---

## 10. Cláusula de no exceso

Este mandato **no** autoriza:

- reabrir Slice A como IMPL pendiente;
- Marketplace, Product, Supabase, II.7;
- modificación de Factory Core CB-00…CB-19;
- push/merge/deploy sin orden Director adicional sobre push;
- ampliar alcance más allá de B1→B4 sin nuevo mandato.

---

**END OF MANDATE**

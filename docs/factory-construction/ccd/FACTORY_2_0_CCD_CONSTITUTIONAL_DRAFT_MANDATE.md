# CCD CONSTITUTIONAL DRAFTING MANDATE
## FACTORY 2.0 — CONSTITUTIONAL CONTINUITY DOSSIER (CCD)

## RealEstateSniper Factory 2.0

| Campo | Valor |
|-------|--------|
| **Document ID** | `FACTORY_2_0_CCD_CONSTITUTIONAL_DRAFT_MANDATE.md` |
| **Path** | `docs/factory-construction/ccd/FACTORY_2_0_CCD_CONSTITUTIONAL_DRAFT_MANDATE.md` |
| **Mandate ID** | `CCD-CONSTITUTIONAL-DRAFT-IMPL` |
| **Status** | **APPROVED** |
| **Nature** | Documentary Mandate only — **does not** draft the CCD by itself; **does not** authorize Factory technical change |
| **Approval** | **APPROVED** by Director (**Manolo**) — Independent Documentary Audit: **APPROVED WITH OBSERVATIONS** (CRITICAL 0 · MAJOR 0 · MINOR 1 · OBSERVATIONS 3) |
| **Approval effect** | CCD documentary drafting under §§6, 10, 11 is authorized; Commit/Push of CCD remain **not** authorized by this Mandate alone |

---

## 1. Document Control

| Campo | Valor |
|-------|--------|
| **Title** | CCD Constitutional Drafting Mandate |
| **Version** | `1.0.0` |
| **Date** | `2026-07-28` |
| **Director** | Manolo |
| **Developer** | Carlos |
| **Branch (baseline)** | `integration/factory-complete-20260725` |
| **HEAD (baseline cited)** | `b86ad4191b2b9f75a32409d231e23e0815b3d83a` |
| **Plan authority** | `FACTORY_2_0_CCD_IMPLEMENTATION_PLAN.md` |
| **Discovery state** | **APPROVED WITH OBSERVATIONS** · **FROZEN** |
| **Director approval** | **YES** — explicit Director approval recorded |
| **Independent Documentary Audit** | **APPROVED WITH OBSERVATIONS** — Status: `FACTORY_2_0_CCD_CONSTITUTIONAL_DRAFT_MANDATE_DOCUMENTARY_AUDIT_STATUS.md` |
| **This Mandate authorizes (APPROVED)** | Documentary construction of the CCD body only, under the limits below |
| **This Mandate does not authorize** | Factory IMPL; Discovery/Plan edits; Commit; Push; Merge; technical systems listed in §7 |

---

## 2. Authority

1. This Mandate derives exclusively from:
   - the frozen CCD Official Discovery corpus;
   - the CCD Official Implementation Plan (**APPROVED WITH OBSERVATIONS**);
   - Continuity protocol Discovery → Plan → Audit → Documentary Commit → **Mandate** → documentary IMPL;
   - explicit Director approval of **this** Mandate document.
2. Status is **APPROVED** by explicit Director decision. CCD documentary drafting under §§6, 10, 11 **may** begin. Commit/Push of CCD deliverables remain prohibited until a **later specific Director instruction**.
3. Approval of this Mandate **does not** authorize technical changes to Factory or any system listed in §7.
4. GitHub and the published HEAD of the official branch constitute the official shared continuity baseline between Carlos and Manolo (Adición 1 / Plan OBS-01).
5. Any action not expressly authorized in §§6 and 10–11 is **prohibited**.

---

## 3. Mandate ID

```text
CCD-CONSTITUTIONAL-DRAFT-IMPL
```

No other Mandate ID is authorized by this document.  
No Factory P-INT Mandate is implied.

---

## 4. Estado

```text
STATUS:
APPROVED

DIRECTOR APPROVAL:
YES (Manolo)

INDEPENDENT DOCUMENTARY AUDIT:
APPROVED WITH OBSERVATIONS
CRITICAL: 0
MAJOR: 0
MINOR: 1
OBSERVATIONS: 3

CCD DRAFTING:
AUTHORIZED under §§6, 10, 11 — NOT STARTED by this Status block alone

COMMIT / PUSH:
NOT AUTHORIZED BY THIS MANDATE

FACTORY TECHNICAL CHANGE:
NOT AUTHORIZED
```

---

## 5. Objetivo

Autorizar **únicamente**, tras aprobación explícita del Director, la **construcción documental** del Constitutional Continuity Dossier definitivo (`FACTORY_2_0_CONSTITUTIONAL_CONTINUITY_DOSSIER.md`), conforme al Official Discovery (FROZEN) y al Official Implementation Plan, incorporando Adiciones 1–7, cláusulas OBS-CCD-DISCOVERY-01…06, y bloques CCD-B0…CCD-B13, hasta dejar el borrador listo para Independent Documentary Audit — **sin** implementar Factory ni alterar documentación congelada de Discovery/Plan.

---

## 6. Alcance autorizado

Tras **APPROVED** por el Director, y solo entonces, queda autorizado:

1. **Crear** el documento oficial definitivo del CCD en:

   `docs/factory-construction/ccd/FACTORY_2_0_CONSTITUTIONAL_CONTINUITY_DOSSIER.md`

2. **Construirlo** exclusivamente conforme a:
   - Official Discovery + Addendum Oficial (1–5) + Addendum Final (6–7);
   - Official Implementation Plan §§1–20 + Appendices A–B;
   - Documentary Audit Status / Closeout del Plan.

3. **Aplicar** las observaciones vinculantes **OBS-CCD-DISCOVERY-01…06** exactamente como cláusulas del Plan §8.2.

4. **Incorporar** las Adiciones Oficiales **1–7**.

5. **Ejecutar** los bloques documentales **CCD-B0…CCD-B13** definidos en el Plan §7, en el orden de restricciones del Plan.

6. **Preparar** el CCD draft para Independent Documentary Audit (Plan Gate G4→G5).

7. **Generar únicamente** documentación de trazabilidad, Status y Closeout del **bloque de redacción documental del CCD** cuando el protocolo del Plan lo requiera para ese bloque (Audit Status / Closeout del CCD draft) — **sin** ampliar a otros dominios.

**Límite:** ninguna otra ruta, sistema o entrega queda autorizada.

---

## 7. Exclusiones expresas

Queda **prohibido** bajo este Mandate:

| Exclusión |
|-----------|
| Modificar el Discovery (cualquier archivo del corpus FROZEN) |
| Modificar el Implementation Plan |
| Modificar Blueprint |
| Modificar Integration Master Plan |
| Modificar Auditoría Maestra / FFO / catálogos |
| Modificar Continuity Dossier como “rename silencioso” a CCD (la sucesión State Record requiere Mandate separado o combinación **explícita** del Director — no implícita aquí) |
| Cambios en Factory / `src/factory/**` |
| P-INT implementation |
| CB-00…CB-19 edits |
| Código de aplicación |
| Runtime |
| Base de datos |
| Supabase |
| Edge Functions |
| RLS |
| Web / FCC |
| Marketplace |
| CRM |
| Owner Portal |
| PWA |
| Git **push** |
| Merge |
| Rebase |
| Reset |
| Creación de arquitectura paralela |
| Implementación técnica derivada del contenido futuro del CCD |
| Commit del CCD (o de Status/Closeout de redacción) **salvo instrucción posterior específica del Director** |
| Seleccionar o abrir el siguiente bloque de ingeniería Factory |

---

## 8. Corpus documental vinculante

| Documento | Path / ID | Rol |
|-----------|-----------|-----|
| Official Discovery | `FACTORY_2_0_CCD_OFFICIAL_DISCOVERY.md` | Requirements — **FROZEN** |
| Addendum Oficial | `FACTORY_2_0_CCD_OFFICIAL_DISCOVERY_ADDENDUM.md` | Adiciones 1–5 — **FROZEN** |
| Addendum Final | `FACTORY_2_0_CCD_OFFICIAL_DISCOVERY_ADDENDUM_FINAL.md` | Adiciones 6–7 — **FROZEN** |
| Discovery Documentary Audit | `FACTORY_2_0_CCD_OFFICIAL_DISCOVERY_DOCUMENTARY_AUDIT.md` | OBS-01…06 source — **FROZEN** |
| Implementation Plan | `FACTORY_2_0_CCD_IMPLEMENTATION_PLAN.md` | Planning authority |
| Plan Documentary Audit Status | `FACTORY_2_0_CCD_IMPLEMENTATION_PLAN_DOCUMENTARY_AUDIT_STATUS.md` | Plan audit — non-blocking observations |
| Plan Documentary Closeout | `FACTORY_2_0_CCD_IMPLEMENTATION_PLAN_DOCUMENTARY_CLOSEOUT.md` | Plan closeout |
| Continuity (extraction only) | `FACTORY_2_0_COMPLETE_CONTINUITY_DOSSIER.md` | Class 1 extract source — not to be replaced by silent rename under this Mandate |

Discovery publication baseline (prior): `60e1f3a95d554762c796e7695acdee98fafbb59b`  
Plan corpus baseline (cited): `b86ad4191b2b9f75a32409d231e23e0815b3d83a`

---

## 9. Rama y HEAD oficiales de partida

| Campo | Valor |
|-------|--------|
| **Official branch** | `integration/factory-complete-20260725` |
| **Official starting HEAD (Mandate baseline)** | `b86ad4191b2b9f75a32409d231e23e0815b3d83a` |
| **Shared official reference** | GitHub published HEAD of the official branch |
| **Verification rule** | Before drafting under an APPROVED Mandate, re-verify READ_ONLY that local official branch HEAD matches the intended published baseline; do not treat prose SHA counts as truth |

If local and remote diverge, **STOP** and obtain Director instruction before drafting.

---

## 10. Deliverables autorizados

Tras Mandate **APPROVED**, solo estos deliverables:

| ID | Deliverable | Path |
|----|-------------|------|
| D-CCD-01 | CCD definitive draft document | `docs/factory-construction/ccd/FACTORY_2_0_CONSTITUTIONAL_CONTINUITY_DOSSIER.md` |
| D-CCD-02 | CCD drafting Independent Documentary Audit Status | `docs/factory-construction/ccd/FACTORY_2_0_CCD_DOCUMENTARY_AUDIT_STATUS.md` (when audit executed) |
| D-CCD-03 | CCD drafting Documentary Closeout | `docs/factory-construction/ccd/FACTORY_2_0_CCD_DOCUMENTARY_CLOSEOUT.md` (when closeout due) |

No other deliverable is authorized.

---

## 11. Bloques CCD-B0…CCD-B13 autorizados

Authorized documentary blocks (Plan §7), under Mandate **APPROVED** only:

| Block | Name |
|-------|------|
| CCD-B0 | Document shell & non-authorizations |
| CCD-B1 | Single Source of Truth & hierarchy |
| CCD-B2 | Permanent frontiers & national scalability |
| CCD-B3 | Roles, Carlos↔Manolo, FSR relation |
| CCD-B4 | Block protocol & canonical states |
| CCD-B5 | GitHub / session close reconciliation |
| CCD-B6 | Stop Rules |
| CCD-B7 | Evolution domains/programs governance |
| CCD-B8 | Anti-redundant audits |
| CCD-B9 | AI Governance chapter |
| CCD-B10 | CCD maintenance vs State Record |
| CCD-B11 | Parking / pre-launch pointers |
| CCD-B12 | Continuity succession instrument (text in CCD; **execution** of Continuity file succession = not authorized here unless Director explicitly expands Mandate) |
| CCD-B13 | CCD Definition of Done & publication readiness (documentary DoD inside CCD; **Commit/Push not authorized** by this Mandate) |

**Order constraints (binding):** CCD-B12 and CCD-B1 before or with first draft freeze; CCD-B5 before claiming Git chapter complete; CCD-B13 last before draft closeout for audit.

---

## 12. Strategy Gates aplicables

| Gate | Applicability under this Mandate |
|------|----------------------------------|
| G0 | Prerequisite — Discovery freeze — **already DONE** |
| G1–G2 | Plan audit/commit — **prerequisite**; drafting must not start if Plan corpus is not the official baseline |
| **G3** | **This Mandate** — CCD drafting authorized **only after** Director sets this document to **APPROVED** |
| G4 | CCD draft complete — chapters 1–16 + Adiciones 1–7 + OBS clauses; no Blueprint/Master Plan/code edits |
| G5 | CCD Independent Documentary Audit — **required** before any later Commit instruction |
| G6–G7 | Publication / Continuity succession — **NOT authorized** by this Mandate |

---

## 13. Stop Conditions

Drafting under an APPROVED Mandate **MUST STOP** if any of the following occurs:

1. Attempt to modify Discovery, Plan, Blueprint, Master Plan, or Auditoría Maestra.  
2. Attempt to change Factory code, P-INT, CB, Runtime, DB, Supabase, Edge Functions, RLS, Web, Marketplace, CRM, Owner Portal, or PWA.  
3. Attempt to Commit or Push without a **later specific Director instruction**.  
4. Attempt to Merge, Rebase, or Reset.  
5. Detection of two competing official continuity authorities without applying Plan OBS-02 map inside the CCD text.  
6. Local official branch HEAD does not match the intended published baseline and Director has not instructed how to proceed.  
7. Contradiction between Discovery (FROZEN) and draft content that cannot be resolved by Plan clauses without inventing architecture.  
8. Request to invent Team Protocol MVP, full FSR series, fictional MCD file, or closed engineering program catalog that creates new components (OBS-04 / OBS-05).  
9. Request to implement Decision Engine / Product pricing / `access_tier` inside Factory.  
10. Director revocation or suspension of this Mandate.

On STOP: no further CCD prose edits until Director instruction.

---

## 14. Prohibiciones

- Open formulations that expand scope (“hacer lo necesario”, “mejorar cuando proceda”, “cambios relacionados”, “adaptar Factory”) are **void** under this Mandate.  
- Parallel architectures are prohibited.  
- Reopening FULLY CLOSED construction/integration blocks is prohibited.  
- Treating chat hypotheses as architecture is prohibited.  
- Generic push/merge/deploy rights are prohibited.  
- Any action not listed in §6 and §§10–11 is prohibited.

---

## 15. Acceptance Criteria

| ID | Criterion |
|----|-----------|
| AC-M01 | Mandate Status is **APPROVED** by Director before any CCD file creation |
| AC-M02 | CCD path equals §6 item 1 / D-CCD-01 only |
| AC-M03 | Chapters 1–16 match Plan §8.3 |
| AC-M04 | Adiciones 1–7 incorporated |
| AC-M05 | OBS-CCD-DISCOVERY-01…06 incorporated per Plan §8.2 |
| AC-M06 | Blocks CCD-B0…B13 completed as documentary content |
| AC-M07 | Discovery files unchanged |
| AC-M08 | Implementation Plan file unchanged |
| AC-M09 | No Factory/code/Supabase/Web/Marketplace/CRM/Owner Portal/PWA/DB/Edge/RLS/Runtime/P-INT/CB changes |
| AC-M10 | No Commit/Push performed under this Mandate alone |
| AC-M11 | Draft prepared for Independent Documentary Audit |
| AC-M12 | Single-source authority map present (Adición 6 / OBS-02) |
| AC-M13 | Git session-close reconciliation present without generic push right (OBS-01) |
| AC-M14 | Purpose + Product/Decision frontier preserved (OBS-03) |

---

## 16. Definition of Done

This Mandate’s drafting work (after APPROVED) is Done only when **all** are true:

- [ ] D-CCD-01 exists with chapters 1–16 complete per Plan  
- [ ] Adiciones 1–7 embodied  
- [ ] OBS-01…06 embodied  
- [ ] CCD-B0…B13 documentary content complete under §11 constraints  
- [ ] AC-M07…AC-M10 satisfied  
- [ ] Independent Documentary Audit of the CCD draft has been **requested/ready** (G5 entry)  
- [ ] No unauthorized paths or systems touched  

**Not** part of Done under this Mandate: Commit, Push, G6 publication, G7 Continuity file succession execution.

---

## 17. Requisitos de trazabilidad

The CCD draft **MUST** trace:

| Source | Required locus in CCD |
|--------|------------------------|
| Discovery §§1–10 | Identity, hierarchy, map, exclusions |
| Adiciones 1–7 | Per Plan Appendix A |
| OBS-01…06 | Per Plan §8.2 |
| Continuity §§20–21, 22, 25–29, 34 | Stop Rules; frontiers; parking pointers; protocol; roles; Class 1/2/3 |
| Plan Gates G3–G5 | Document Control of CCD |

Trazabilidad docs beyond D-CCD-02/D-CCD-03 are **not** authorized.

---

## 18. Requisitos de auditoría independiente

1. After draft completion (G4), an **Independent Documentary Audit** of the CCD is **mandatory** before any later Commit instruction.  
2. Audit mode: READ ONLY · no CCD rewrite by auditor · no Factory IMPL.  
3. Acceptable audit outcomes for later Director Commit decision: **APPROVED** or **APPROVED WITH OBSERVATIONS** (non-blocking).  
4. **REJECTED** → no Commit; Director instruction required.  
5. This Mandate does **not** appoint the auditor and does **not** waive the audit.

---

## 19. Condiciones de cierre

Documentary drafting under this Mandate closes when:

1. Definition of Done §16 is met;  
2. Independent Documentary Audit Status (D-CCD-02) records the verdict;  
3. Documentary Closeout of drafting (D-CCD-03) is issued if Director requires closeout before any Commit instruction;  
4. **STOP** — await **separate** Director instruction for Commit and/or Push;  
5. Continuity succession file update remains **outside** this Mandate unless the Director issues an express combined/expanded Mandate.

---

## 20. Declaración de no autorización técnica

```text
THIS MANDATE (EVEN IF LATER APPROVED):

AUTHORIZES:
  Documentary construction of the CCD body only,
  under §§6, 10, 11, after Director APPROVAL of this Mandate.

DOES NOT AUTHORIZE:
  - Factory technical implementation
  - P-INT / CB / code / Runtime / database
  - Supabase / Edge Functions / RLS
  - Web / Marketplace / CRM / Owner Portal / PWA
  - Discovery or Implementation Plan modification
  - Parallel architecture
  - Commit / Push / Merge / Rebase / Reset
  - Continuity dossier succession execution (unless Director expressly expands)
  - Any action not expressly listed as authorized

DISCOVERY REMAINS:
  APPROVED WITH OBSERVATIONS
  FROZEN

IMPLEMENTATION PLAN REMAINS:
  Planning authority for CCD construction

GITHUB / PUBLISHED HEAD:
  Official shared continuity baseline

CCD DRAFTING START:
  AUTHORIZED — Mandate APPROVED by Director

CURRENT STATUS OF THIS DOCUMENT:
  APPROVED
```

---

**END OF MANDATE — `CCD-CONSTITUTIONAL-DRAFT-IMPL`**

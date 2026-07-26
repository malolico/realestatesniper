# FACTORY INTEGRATION P-INT-04
## DECISION PACKAGE EXPORT — OFFLINE / LOCAL ONLY
## IMPLEMENTATION PLAN

**Document ID:** `FACTORY_INTEGRATION_P_INT_04_OFFLINE_IMPLEMENTATION_PLAN.md`  
**Phase:** Factory Integration — Operational Completeness (Arizona)  
**Block:** P-INT-04 — Decision Package Export (**OFFLINE / LOCAL slice only**)  
**Document Type:** Technical Implementation Plan  
**Status:** PLAN ONLY — **NO IMPLEMENTATION AUTHORIZED BY THIS DOCUMENT**

**Repository:** RealEstateSniper  

**Normative sources:**

1. `docs/factory-construction/FACTORY_INTEGRATION_MASTER_PLAN.md` (§3.2 P-INT-04; Fase III handoff export)  
2. `docs/factory-construction/integration/FACTORY_INTEGRATION_P_INT_02_OFFLINE_IMPLEMENTATION_PLAN.md`  
3. `docs/factory-construction/integration/FACTORY_INTEGRATION_P_INT_02_OFFLINE_IMPL_STATUS.md`  
4. `docs/factory-construction/integration/FACTORY_INTEGRATION_P_INT_03_OFFLINE_IMPLEMENTATION_PLAN.md`  
5. `docs/factory-construction/integration/FACTORY_INTEGRATION_P_INT_03_OFFLINE_IMPL_STATUS.md`  
6. Factory CB-01…CB-16 (especially CB-16 Decision Package)  
7. Integration II.2→II.6 (patterns only — no fusion)  
8. `docs/factory-construction/FACTORY_2.0_CONSTRUCTION_BLUEPRINT.md` (CB-16)  
9. Construction ledger / CB-16 COMPLETION / relevant COMPLETION docs  
10. Director Discovery Report P-INT-04 — session artifact, non-versioned repository file  

**Director authorization (this Plan document):** **approved** to exist as planning artifact.  
**Director authorization (P-INT-04-OFFLINE-IMPL code):** **NOT AUTHORIZED** by this document.  
**Director authorization (Live / Decision Engine / cloud sink / Supabase):** **NOT AUTHORIZED**.

**Technological / architectural decision (binding):**

1. **Reuse** the existing CB-16 Decision Package — **no second package model**.  
2. Harden via **canonicalization + SHA-256 integrity + local auditable export**.  
3. Persist **B + C**: local artifact under `data/factory-decision-packages/` **and** ELR handoff **reference** (not full package dump).  
4. **Do not** classify Deal / Premium / Diamond.  
5. **Do not** alter CB-16 `boundary` semantics.

---

## 0. Absolute Non-Authorization Banner

This Plan **does not** authorize, and any future offline IMPL under a separate Director mandate **must not** introduce:

| Surface | Status under this Plan |
|---------|------------------------|
| Deal / Premium / Diamond classifier | **PROHIBITED** |
| Product Catalog / Marketplace / pricing / billing / purchases | **NOT AUTHORIZED** |
| Publication eligibility as Product decision | **NOT AUTHORIZED** (II.3 plane) |
| Access tier / commercial access control | **PROHIBITED** |
| Delivery / HTTP / APIs / Auth / Edge / Storage cloud | **NOT AUTHORIZED** |
| Web / React / FCC product surfaces | **NOT AUTHORIZED** |
| Supabase / RLS / cloud migrations / product tables | **NOT AUTHORIZED** |
| CRM / Owner Portal | **NOT AUTHORIZED** |
| Decision Engine internals / live cloud sink | **NOT AUTHORIZED** |
| SQLite / new npm dependencies / `package.json` changes | **NOT AUTHORIZED** |
| II.7 and later Integration blocks | **NOT AUTHORIZED / NOT OPENED** |
| P-INT-05 Product Publish Gate | **NOT OPENED** |
| Second Decision Package schema replacing CB-16 | **PROHIBITED** |
| Fusion with Read Model II.2 / Publication Unit / II.5–II.6 execution | **PROHIBITED** |
| Altering `boundary.decides` or CB-16 blocked operations | **PROHIBITED** |
| Fake human approval (`reviewedBy` without workflow) | **PROHIBITED** |

**Hard separations:**

```text
CB-16 Decision Package (corpus)  ≠  commercial Decision
P-INT-04 Offline local export    ≠  Delivery / cloud sink
Factory readiness / G0–G6        ≠  Deal/Premium/Diamond class
II.2 Read Model                  ≠  Decision Package
II.3 Eligibility                 ≠  export local
II.5/II.6 Handoff governance     ≠  CB-16 Decision handoff
Export local durable             ≠  Marketplace publish
ELR decision_handoffs reference  ≠  full package duplication
```

---

## 1. Identidad del bloque

| Campo | Valor |
|-------|-------|
| Master Plan name | **P-INT-04 Decision Package Export** |
| Slice de este Plan | **Offline / Local Only** — hardening, canonicalización, integridad, export local auditable |
| Constitutional owner of package shape | **CB-16** |
| Consumer futuro (fuera de alcance) | Decision Engine (Master Plan) |

Este Plan **no** cierra la fila Master Plan P-INT-04 respecto a object storage / cola / Decision Engine live.  
**P-INT-04 Live / cloud / Decision Engine sink** permanece **OPEN / NOT IMPLEMENTED / NOT AUTHORIZED**.

---

## 2. Objetivo

Preparar operativamente **P-INT-04 Offline** de modo que Factory pueda:

1. Construir el Decision Package **exclusivamente** vía CB-16 (`buildDecisionPackage` / readiness existente).  
2. Canonicalizar el **contenido lógico** del package para checksum estable.  
3. Envolver el package en un **export envelope** versionado (`exportSchemaVersion`, checksum, `packageId`, mode `OFFLINE_LOCAL`).  
4. Persistir el artefacto local de forma durable e íntegra (fail-closed).  
5. Registrar en ELR solo **metadata + referencia** coherente con `decision_handoffs` CB-16.  
6. Demostrar, vía runner futuro, reproducibilidad **sin** Web, Supabase, Delivery, clasificación producto ni Decision Engine.

**Principio constitucional:**

> Factory produce **corpus** de decisión.  
> Factory **no** toma la decisión comercial final.  
> `boundary.decides` permanece **`false`**.

---

## 3. Alcance

### 3.1 Incluido (futuro IMPL, solo tras autorización expresa)

| Ítem | Descripción |
|------|-------------|
| Reuse CB-16 package | Schema, builder, readiness, boundary, blocked ops |
| Canonicalization | Deterministic JSON of **canonical content** |
| Integrity | SHA-256 over exact canonical bytes |
| Export envelope | Versioned wrapper; CB-16 payload **intacto** |
| Thin LocalExportPort / store | `data/factory-decision-packages/` |
| ELR reference acts | Coherent with CB-16 `decision_handoffs` kinds |
| Runner + fixtures | Suites §32 |
| Status note | Tras IMPL, mandato separado |

### 3.2 Unidad atómica de export

Un **export artifact** por corpus lógico: envelope + payload CB-16, aislado por `factory_key` (y `packageId` derivado).

---

## 4. Exclusiones absolutas

1. Clasificador Deal / Premium / Diamond.  
2. Publication eligibility / publish / Marketplace listing.  
3. Access tier / pricing / billing / purchases.  
4. Owner contact execution / legal approval / CRM / Owner Portal.  
5. Web, HTTP clients, APIs, Auth, Edge, Storage cloud, Delivery, deployments.  
6. Supabase, RLS, migraciones, tablas producto, `deals`.  
7. Decision Engine internals / live cloud sink.  
8. Nuevo Decision Package schema paralelo a CB-16.  
9. Duplicación del Read Model II.2 o del ELR completo en el store.  
10. SQLite / nuevas dependencias / cambios `package.json`.  
11. II.7, P-INT-05.  
12. Alteración semántica de `boundary` CB-16.  
13. Fake human review approval fields.

---

## 5. Estado actual de CB-16

| Dimensión | Estado real |
|-----------|-------------|
| Package schema | `src/factory/cb16/decisionPackageSchema.js` — version `1.0.0` |
| Builder | `decisionPackageBuilder.js` — asamblea corpus ST-RDY |
| Readiness | `decisionReadiness.js` — completeness, evidence, scores, G0–G6 |
| Handoff service / interface | In-memory `deliverDecisionPackage` — **no sink durable** |
| ELR ledger | `decisionLedger.js` — `DHI_*` kinds en `decision_handoffs` |
| Boundary | `decides: false`; classify Deal/Premium/Diamond false; no access_tier/pricing |
| Blocked ops | Incluye `classify_*`, `assign_access_tier`, `set_pricing`, `marketplace_listing`, etc. |
| Validation | `validateCb16.js` / `runCb16DecisionValidation.js` — COMPLETE |
| Determinismo | `builtAt` / `deliveryId` usan tiempo — **gap** para identidad lógica estable |

---

## 6. Gap operativo real de P-INT-04

Master Plan exige **export** del Decision Package a sink versionado.  
Hoy CB-16:

- construye y valida el package;
- “entrega” in-memory;
- registra actos ELR;
- **no** persiste artefacto local íntegro con checksum canónico reproducible;
- **no** separa metadata de instancia de contenido hasheable.

**P-INT-04 Offline cierra ese gap en modo local**, sin cloud ni Decision Engine.

---

## 7. Separación de planos

| Plano | Definición | Estado bajo este Plan |
|-------|------------|------------------------|
| Evidence / facts | CB-06 | Inputs vía refs — no redecidir |
| Legitimacy | CB-07 | Señales vía ELR — no producto |
| Distress / Economy / Environment | CB-08/09/10 | Señales vía ELR |
| Intelligence | CB-13 | Readiness gates / prep |
| AI Assist | CB-14 | Advisory only |
| Factory readiness | ST-RDY + G0–G6 | Precondición export |
| **CB-16 Decision Package** | Corpus | **Reutilizar** |
| **Export local P-INT-04** | Envelope + store + integrity | **Objeto de este Plan** |
| Decision Engine futuro | Consume corpus | **NOT AUTHORIZED** |
| Deal / Premium / Diamond | Producto / Decision | **PROHIBITED aquí** |
| Publication eligibility | II.3 | **Fuera** |
| Delivery / Web / Marketplace | Downstream | **Fuera** |
| Supabase / cloud | Persistence cloud | **Fuera** |

---

## 8. Definición vinculante del Decision Package

El **Decision Package** es el artefacto CB-16:

- corpus calibrado Factory → frontera Decision;
- envelope de hechos, readiness, motors, evidence refs, scores, ELR export;
- **no** decisión comercial;
- **no** clasificación Deal/Premium/Diamond;
- **no** autorización de publicación;
- `boundary.decides === false` obligatorio.

P-INT-04 Offline **no redefine** ese significado; solo lo **exporta** de forma auditable.

---

## 9. Reutilización obligatoria de CB-16

**MUST reuse:**

- `DECISION_PACKAGE_VERSION`, sections, `validateDecisionPackageShape`
- `buildDecisionPackage` / `evaluateDecisionReadiness`
- `BLOCKED_HANDOFF_OPERATIONS` / `assertHandoffBoundary`
- `HANDOFF_ELR_KINDS` / ledger patterns
- Required motors `MOT-DCN-01`, `MOT-EXE-01`
- Required score `maturity_score`

**MUST NOT:**

- fork a parallel package schema;
- weaken boundary flags;
- reimplement readiness gates (consume CB-13 recorded eval only, as CB-16 does);
- embed II.2 Read Model snapshots as competing package shape.

---

## 10. Boundary constitucional

Todo export **MUST** preservar (y suites **MUST** assert):

| Flag / regla | Valor obligatorio |
|--------------|-------------------|
| `boundary.decides` | `false` |
| `boundary.classifiesDeal` | `false` |
| `boundary.classifiesPremium` | `false` |
| `boundary.classifiesDiamond` | `false` |
| `boundary.assignsAccessTier` | `false` |
| `boundary.setsPricing` | `false` |
| classify_deal / premium / diamond ops | blocked |
| assign_access_tier / set_pricing | blocked |
| publish / marketplace_listing | blocked / out of scope |

Cualquier IMPL que escriba `true` en estas flags o clasifique producto es **fallo de arquitectura**.

---

## 11. Entradas autorizadas

| Input | Clase | Notas |
|-------|-------|-------|
| `factory_key` | **REQUIRED** | Aislamiento |
| Expediente state `ST-RDY` | **REQUIRED** | Pre-handoff; post-ST-DEC rules follow CB-16 |
| ELR (required sections) | **REQUIRED** | Via CB-16 completeness |
| `DECISION_HANDOFF_PREP_CB16` | **REQUIRED** | CB-13 prep |
| G0–G6 `EVF_READINESS_GATE_EVAL` allPass | **REQUIRED** | Recorded; not re-run |
| MOT-DCN-01 + MOT-EXE-01 manifests | **REQUIRED** | |
| `evidence_registry_ref` | **REQUIRED** | |
| `maturity_score` ∈ [0,1] | **REQUIRED** | ELR or authorized hint |
| `sufficiencyStatus` | **OPTIONAL** | If present → must be PASS |
| source refs / evidence refs | **DERIVED** | From ELR / Evidence |
| conflicts / blockers / freshness / provenance | **DERIVED** | From ELR / Evidence if present |
| AI Assist refs (`aia_rlg_refs`) | **DERIVED** | Advisory only |
| orchestration refs / FFO complete | **DERIVED** | CB-15 via ELR |
| Deal/Premium/Diamond class as decision | **PROHIBITED** | |
| access_tier / commercial price / publish flags as Factory decision | **PROHIBITED** | |
| Live Decision Engine / cloud credentials | **PROHIBITED** | |
| Full Diamond gate satisfaction as product class | **DEFERRED** | Product/Decision plane |
| Human approval workflow fields | **DEFERRED** | No fake fill |

Underlying facts (consent, off-market, owner verified, etc.) **MAY** exist in ELR/Evidence as **facts**.  
They **MUST NOT** be promoted here to commercial classification or publish authorization.

---

## 12. Campos expresamente prohibidos como decisión Factory

**PROHIBITED** as Factory decisions / export outputs of authority:

- `opportunityClass` (Deal / Premium / Diamond)
- `publicationEligibility` (as Product gate)
- `accessTier`
- `marketplaceStatus`
- `commercialPrice` / purchase entitlement
- owner contact execution
- legal approval

Facts may remain inside `elrExport` / evidence refs **without** being interpreted as P-INT-04 commercial decisions.

---

## 13. Salida mínima reutilizada de CB-16

Payload **MUST** include CB-16 sections:

1. `meta`  
2. `identity`  
3. `readiness`  
4. `motors`  
5. `evidence`  
6. `scores`  
7. `elrExport`  
8. `boundary`  

Validado con `validateDecisionPackageShape` antes de envelope/export.

---

## 14. Envelope de export offline

Wrapper **mínimo** versionado **alrededor** del package CB-16 (payload intacto):

| Campo | Rol |
|-------|-----|
| `exportSchemaVersion` | Versión del envelope P-INT-04 Offline (v1 = `1`) |
| `decisionPackageVersion` | Copia de `payload.meta.version` (CB-16) |
| `packageId` | Derivado: `factory_key` + content checksum (§17) |
| `factory_key` | Aislamiento |
| `generatedAt` | Metadata de **instancia** (no entra en hash del corpus) |
| `canonicalContentChecksum` | SHA-256 hex del contenido canónico |
| `exportMode` | `"OFFLINE_LOCAL"` |
| `boundarySummary` | Snapshot de flags boundary (all false / non-deciding) |
| `inputSnapshotRefs` | Refs opcionales a evidencia/ELR acts usados |
| `payload` | **CB-16 Decision Package object intacto** |

**MUST NOT** mutate CB-16 internal schema without separate Director mandate.

---

## 15. Canonicalización

Binding rules for **canonical content** (what is hashed):

1. JSON UTF-8.  
2. Stable key order (sorted object keys recursively) **or** an equivalent documented deterministic serializer — fixed in IMPL Status.  
3. Arrays preserve **logical append order** (ELR sequences) — do not sort entry arrays by hash of contents if that would alter lineage meaning.  
4. `undefined` omitted; `null` preserved only if present in CB-16 payload.  
5. **Exclude from hashed corpus:** `generatedAt` of envelope; any ephemeral export-only timestamps not part of CB-16 logical payload.  
6. **Include in hashed corpus:** CB-16 payload fields that constitute the decision corpus.  
7. **Separate:** instance metadata (envelope) vs canonical content (payload normalized).

**Note on CB-16 `meta.builtAt`:** IMPL **MUST** define whether `builtAt` is stripped/normalized before hash (recommended: hash a **canonical payload view** with ephemeral timestamps removed or replaced by input-derived constants) so that “same logical inputs ⇒ same checksum”. Document the exact rule in Status.

---

## 16. Integridad

1. Algorithm: **SHA-256**.  
2. Hash over **exact canonical bytes** written.  
3. Authority: envelope field `canonicalContentChecksum` and/or sidecar `.sha256` — **not** embedded inside hashed payload (no circularity).  
4. `read` **MUST** verify before return.  
5. Checksum mismatch → fail-closed.  
6. Corrupt JSON → fail-closed.  
7. Unknown `exportSchemaVersion` or unsupported `decisionPackageVersion` → reject.  
8. **No silent repair.**

---

## 17. Idempotencia

| Regla | Valor vinculante |
|-------|------------------|
| Mismo input snapshot lógico | → **mismo** `canonicalContentChecksum` |
| `packageId` | Preferentemente `dpkg-{factory_key}-{checksumPrefix}` (or full hash) — **not** `Date.now()` alone |
| `generatedAt` | MAY differ across export runs **without** changing logical identity / checksum |
| Multiple export acts | MAY exist; MUST reference same corpus checksum when inputs unchanged |
| `deliveryId` style `Date.now()` | **MUST NOT** be sole package identity for P-INT-04 Offline |

---

## 18. Persistencia recomendada (B + C)

### B — Artefacto local versionado

- Root: `data/factory-decision-packages/` (tests: temp dirs).  
- Layout aislado por `factory_key` (e.g. `expedientes/{factory_key}/{packageId}.json` + integrity).  
- Thin store — **not** constitutional ELR replacement.  
- **Not** Supabase / cloud object storage.

### C — ELR reference

- Reuse CB-16 `decision_handoffs` patterns / kinds.  
- Store **metadata + reference** (packageId, checksum, local path or relative ref, exportMode) — **not** full package duplication in ELR.  
- Export success ELR act **only after** local artifact verified (§22).

### Store nature

- Thin local export store.  
- Non-constitutional.  
- Non-ELR-substitute.  
- Non-Supabase.  
- Non-cloud.

---

## 19. Arquitectura propuesta

```text
FactoryRegistry / expediente ST-RDY
        │
        ▼
CB-16 buildDecisionPackage + validateDecisionPackageShape
        │
        ▼
P-INT-04 Offline
  canonicalize → integrity → envelope
        │
        ├─► LocalExportPort.write (verified)
        └─► ELR decision_handoffs reference (after success)
```

**Illustrative modules (names fixed at IMPL):**

```text
src/factory/cb16/export/decisionPackageCanonicalize.js
src/factory/cb16/export/decisionPackageIntegrity.js
src/factory/cb16/export/localDecisionPackageExportStore.js
src/factory/cb16/export/decisionPackageExportService.js
src/factory/cb16/export/index.js
src/runPInt04OfflineDecisionPackageValidation.js
```

Minimal re-exports from `src/factory/cb16/index.js` if present.  
**No classifier module.**

---

## 20. LocalExportPort

Minimum contract:

| Method | Semantics |
|--------|-----------|
| `exists(factoryKey, packageId?)` | Physical presence of canonical artifact |
| `write(envelope)` | Persist verified envelope; return written artifact meta |
| `read(factoryKey, packageId)` | Verify integrity then return envelope |
| `resolvePath(factoryKey, packageId)` | Canonical path |
| `listByFactoryKey(factoryKey)` | List packageIds for key only (ignore aux files) |
| `verifyIntegrity(factoryKey, packageId)` | Explicit verify without business use |

No unnecessary methods. Optional `removeArtifacts` only if required for tests/cleanup — not a product delete API.

---

## 21. Escritura y lectura local

Adopt P-INT-03 lessons honestly:

1. PREPARE: temp write + fsync + checksum.  
2. COMMIT: promote with order that never accepts new body + old checksum.  
3. ABORT/RECOVERY: restore last intact pair if possible; else fail-closed.  
4. Restart/reload must recover last verified artifact.  
5. Isolation by `factory_key`.  
6. **Do not** claim absolute multi-file FS atomicity.

Guarantee: **logical artifact atomicity + pair/envelope integrity + fail-closed**.

---

## 22. ELR integration

| Topic | Rule |
|-------|------|
| When to register success | **Only after** local write + integrity verify PASS |
| What to store | packageId, checksum, exportMode, relative ref, actor, timestamps as ELR entry fields |
| Kind | Prefer extend/reuse CB-16 `DHI_*` metadata or a dedicated export-ref field on an existing DHI act — **without** inventing Delivery semantics. Exact kind string fixed in IMPL Status; must not mean “cloud delivered” |
| On local export failure | **MUST NOT** record successful export/handoff-complete for that attempt |
| Coherence | ELR ref checksum **MUST** match local artifact |
| Confusion ban | Local export ≠ Delivery ≠ II.6 `HANDOFF_EXECUTED` ≠ Marketplace publish |

If CB-16 `prepareAndDeliver` path is composed: IMPL **MUST** sequence **persist-verify → then ELR success marks**, or keep export service as explicit step with clear failure boundaries.

---

## 23. Readiness

1. Only expediente meeting CB-16 readiness (`evaluateDecisionReadiness.ready === true`) may export.  
2. Typically **ST-RDY** + G0–G6 allPass + required motors/evidence/score.  
3. Readiness fail → **no export**.  
4. Missing evidence ref → fail-closed.  
5. Unresolved blocker that CB-16 treats as not-ready → no export.  
6. **Never** convert blocker into Deal/Premium/Diamond label.

---

## 24. AI Assist

1. Advisory only (CB-14 constitutional limits).  
2. Cannot invalidate blockers.  
3. Cannot decide Deal/Premium/Diamond.  
4. Cannot approve publication.  
5. Cannot alter `boundary.decides`.  
6. Preserve existing `aia_rlg_refs` traceability.  
7. Do not invent model telemetry absent from CB-14 contracts.

---

## 25. Human review

1. Do not fake human approval.  
2. `reviewedBy` / `reviewedAt` / `approvalState` **MUST NOT** be populated without real workflow (DEFERRED).  
3. `humanReviewRequired` **MAY** appear as a **signal** if derived from recorded gaps — never as forged approval.  
4. Real human approval workflow = future mandate.

---

## 26. Deal / Premium / Diamond

**P-INT-04 Offline does not classify or declare Deal, Premium, or Diamond.**

Product-plane Diamond conditions (off-market, owner verified, commercialization authorized, etc.) remain constitutionally binding **downstream** — they are **not resolved** here.

If conditions missing or blockers exist:

- represent **readiness failure**, evidence gap, or blocker facts;
- **do not** emit Factory class `"Diamond blocked"` / `"Deal"` / etc.;
- **do not** lower any Diamond rule.

Suites **MUST** assert classification attempts fail / are absent.

---

## 27. Compatibilidad con II.2→II.6

**MAY reuse conceptually:**

- canonicalization / integrity / provenance / fail-closed patterns;
- handoff governance *discipline* (oracle clarity, no silent side effects).

**MUST NOT fuse:**

- Read Model Contract v2 shape;
- Publication Unit;
- II.3 Eligibility Oracle;
- II.5 readiness / II.6 execution states as Decision Package identity;
- Delivery;
- Product classification fields as CB-16 outputs.

---

## 28. Versionado

| Version field | Owner |
|---------------|-------|
| `exportSchemaVersion` | P-INT-04 Offline envelope |
| `decisionPackageVersion` / `meta.version` | CB-16 (`1.0.0` today) |

Rules:

1. Unknown export schema version → reject.  
2. Unsupported CB-16 package version → reject.  
3. Evolution of export envelope allowed under this Plan’s IMPL.  
4. **No CB-16 schema bump** without separate Director mandate.  
5. Document supported version tuples in Status.

---

## 29. Seguridad y minimización

1. No additional PII persistence beyond what CB-16 package already contains.  
2. Prefer refs over copying sensitive payloads when CB-16 already uses refs.  
3. No credentials, tokens, secrets, env dumps.  
4. No Web, network, cloud clients.  
5. Path confinement under export root + validated `factory_key`.

---

## 30. Archivos previstos

**Create (after P-INT-04-OFFLINE-IMPL auth — not now):**

```text
src/factory/cb16/export/decisionPackageCanonicalize.js
src/factory/cb16/export/decisionPackageIntegrity.js
src/factory/cb16/export/localDecisionPackageExportStore.js
src/factory/cb16/export/decisionPackageExportService.js
src/factory/cb16/export/index.js
src/runPInt04OfflineDecisionPackageValidation.js
docs/.../FACTORY_INTEGRATION_P_INT_04_OFFLINE_IMPL_STATUS.md   # post-IMPL
fixtures under test temp / minimal cb16 export fixtures if needed
```

**Modify (minimal):**

```text
src/factory/cb16/index.js    # re-exports only, if module exists
```

**Do not touch:** `dealPipeline`, Product Catalog, Marketplace, Web, Supabase, II.7, P-INT-05 plans as “implementation”, CB-16 boundary semantics, `elrSchema` constitutional sections.

**This Plan file only** is created by the present Director order.

---

## 31. Plan secuencial de implementación

| Paso | Contenido | Autorización |
|------|-----------|--------------|
| **S0** | Este Plan auditado + commit documental | Plan only |
| **S1** | Mandato **P-INT-04-OFFLINE-IMPL** | Director |
| **S2** | Revisión final contrato CB-16 (consume-only) | IMPL |
| **S3** | Canonicalización | IMPL |
| **S4** | Integridad SHA-256 | IMPL |
| **S5** | Thin LocalExportPort / store | IMPL |
| **S6** | Export service (build → envelope → write) | IMPL |
| **S7** | ELR reference coherent (after verify) | IMPL |
| **S8** | Runner + fixtures | IMPL |
| **S9** | Regresiones §32 | IMPL |
| **S10** | Independent audit | Director |
| **S11** | Status | Director |
| **S12** | Final commit | Director |
| **S13** | Live / Decision Engine / cloud sink | **DEFERRED / NOT AUTHORIZED** |

---

## 32. Suites mínimas

Runner ilustrativo: `node src/runPInt04OfflineDecisionPackageValidation.js`

**Assertions efectivas obligatorias:**

1. Package CB-16 válido.  
2. Export envelope válido.  
3. Canonicalización determinista.  
4. Checksum estable.  
5. Mismo input → mismo content checksum.  
6. `packageId` determinista.  
7. `generatedAt` no altera identidad lógica (checksum).  
8. Aislamiento por `factory_key`.  
9. write / read / reload.  
10. Missing required input → fail.  
11. Readiness fail → no export.  
12. G0–G6 incomplete → no export.  
13. Evidence ref missing → fail-closed.  
14. Unresolved blocker / not-ready → no export.  
15. Checksum mismatch → fail-closed.  
16. JSON corrupto → fail-closed.  
17. `exportSchemaVersion` desconocida → reject.  
18. `decisionPackageVersion` desconocida → reject.  
19. Unknown field policy (reject or strip per documented allowlist — fail-closed preferred).  
20. `boundary.decides` permanece `false`.  
21. Classify Deal/Premium/Diamond prohibido / ausente.  
22. AI advisory no puede override blockers.  
23. No publish fields of authority.  
24. No access tier assignment.  
25. No pricing assignment.  
26. ELR export reference coherente con checksum.  
27. Fallo de export **no** registra handoff/export exitoso.  
28. Restart / reload.  
29. list / isolation.  
30. Regress CB-01.  
31. Regress CB-02.  
32. Regress CB-06.  
33. Regress CB-07.  
34. Regress CB-08.  
35. Regress CB-09.  
36. Regress CB-10.  
37. Regress CB-13.  
38. Regress CB-14.  
39. Regress CB-15.  
40. Regress CB-16.  
41. Regress P-INT-02 Offline.  
42. Regress P-INT-03 Offline.  
43. Static audit: no Web/Supabase/HTTP/APIs/cloud/SQLite/new deps/classifier/Delivery.

---

## 33. Criterios de aprobación

### 33.1 Este Plan documental

1. Declara P-INT-04 = Decision Package **Export** offline.  
2. Reutiliza CB-16; prohíbe segundo modelo y clasificación producto.  
3. Fija boundary `decides=false` y blocked commercial ops.  
4. Define envelope, canonicalization, integrity, idempotency, B+C persistence.  
5. Separa planos II.* / Product / Delivery / Supabase.  
6. No autoriza IMPL por sí mismo.  
7. No cierra Master Plan cloud/Decision Engine row.

### 33.2 Futuro P-INT-04-OFFLINE-IMPL

1. Suites §32 PASS.  
2. CB-16 regress PASS; boundary intact.  
3. Local artifacts verify; ELR refs consistent.  
4. Status declares Live/Decision Engine/Supabase still NOT AUTHORIZED.  
5. No `package.json` dependency adds.  
6. No Deal/Premium/Diamond classifier in diff.

---

## 34. Riesgos

| Riesgo | Severidad | Mitigación |
|--------|-----------|------------|
| Scores → decisión automática | Crítica | Boundary + suites 20–25 |
| Export confundido con Delivery | Alta | §22; naming OFFLINE_LOCAL |
| Candidate confundido con publishable | Alta | Prohibir publicationEligibility |
| Rebajar reglas Diamond | Crítica | §26; no class labels |
| Duplicar Read Model | Alta | §27 |
| Duplicar ELR full package | Media | Refs only in ELR |
| PII innecesaria | Media | §29 |
| IDs no deterministas / `Date.now` identity | Alta | §17 |
| IA como autoridad | Alta | §24 |
| Paquete no reproducible | Alta | §15–17 |
| Handoff éxito antes de persistir | Alta | §22 |
| Overfit Arizona | Media | Fixtures generic where possible |
| Acoplar Supabase “por si acaso” | Alta | Banner §0 |

---

## 35. Restrictions Matrix

| Acción | Offline Plan | Offline IMPL (future) | Live/Cloud |
|--------|--------------|----------------------|------------|
| Create this Plan doc | **YES** | — | — |
| Write export code | NO | Solo con mandato IMPL | NO |
| Classify Deal/Premium/Diamond | NO | NO | NO (Factory) |
| Delivery / Web / Supabase | NO | NO | NOT AUTHORIZED |
| Change CB-16 boundary | NO | NO | NO |
| Open II.7 / P-INT-05 | NO | NO | NO |
| SQLite / new deps | NO | NO | NO |

---

## 36. Documentary Status

| Ítem | Estado |
|------|--------|
| Master Plan P-INT-04 | Documented — cloud/Decision Engine **not** implemented |
| P-INT-04 Offline Implementation Plan (this file) | **CREATED — PLAN ONLY** |
| P-INT-04-OFFLINE-IMPL | **NOT AUTHORIZED** |
| CB-16 Decision Package | **EXISTS — reuse** |
| Deal/Premium/Diamond in Factory export | **PROHIBITED** |
| Delivery / Web / Supabase | **NOT AUTHORIZED** |
| P-INT-05 | **NOT OPENED** |
| II.7 | **NOT OPENED** |
| Code / runners from this act | **NOT CREATED** |

**Cláusula Master Plan:**  
P-INT-04 Offline Preparation **no** cierra la fila oficial P-INT-04 respecto a Decision Engine / object storage / cola cloud. Esas vías permanecen **OPEN / NOT IMPLEMENTED / NOT AUTHORIZED**.

---

## 37. Final Clause

This Plan authorizes **only** the existence of an audited planning document for **P-INT-04 Offline / Local Decision Package Export** (hardening, canonicalization, integrity, and local auditable export of the **existing CB-16** Decision Package).

It does **not** authorize implementation, runners, fixtures, dependency changes, Deal/Premium/Diamond classification, Delivery, Web, Supabase, Decision Engine integration, II.7, or P-INT-05 until a separate Director mandate is issued.

Until that mandate, CB-16 remains the sole Decision Package authority; commercial decision and publication remain outside Factory.

---

**END OF DOCUMENT**

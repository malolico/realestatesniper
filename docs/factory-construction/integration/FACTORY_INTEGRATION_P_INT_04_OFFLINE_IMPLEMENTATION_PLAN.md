# FACTORY INTEGRATION P-INT-04
## DECISION PACKAGE EXPORT — OFFLINE / LOCAL ONLY
## IMPLEMENTATION PLAN

**Document ID:** `FACTORY_INTEGRATION_P_INT_04_OFFLINE_IMPLEMENTATION_PLAN.md`  
**Phase:** Factory Integration — Operational Completeness (Arizona)  
**Block:** P-INT-04 — Decision Package Export (**OFFLINE / LOCAL slice only**)  
**Document Type:** Technical Implementation Plan  
**Status:** PLAN ONLY — **NO IMPLEMENTATION AUTHORIZED BY THIS DOCUMENT**  
**Constitutional closures:** H1–H4, M1–M3 **CLOSED** (Plan Update — micro-constitutional)

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
2. Harden via **canonicalización cerrada §15** + **sidecar físico + content checksum lógico §16** + export local auditable.  
3. Persist **B + C**: artefacto local + act **`DHI_OFFLINE_LOCAL_EXPORT`** (no full package dump).  
4. **`packageId`** = `dpkg-{factory_key}-{canonicalContentChecksum}`; export service **separado** de `prepareAndDeliver`.  
5. Export v1 solo **`ST-RDY`** + readiness ready; **ST-DEC DEFERRED**.  
6. Unknown fields → **REJECT**.  
7. **Do not** classify Deal / Premium / Diamond; **do not** alter CB-16 `boundary`.

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
| ELR reference acts | **`DHI_OFFLINE_LOCAL_EXPORT` only** after VERIFY |
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
- Existing `HANDOFF_ELR_KINDS` for CB-16 handoff lifecycle (**except** local export uses **new** `DHI_OFFLINE_LOCAL_EXPORT` only)
- Required motors `MOT-DCN-01`, `MOT-EXE-01`
- Required score `maturity_score`

**MUST NOT:**

- fork a parallel package schema;
- weaken boundary flags;
- reimplement readiness gates (consume CB-13 recorded eval only, as CB-16 does);
- embed II.2 Read Model snapshots as competing package shape;
- reuse `DHI_PACKAGE_DELIVERED` / `DHI_HANDOFF_COMPLETE` / `DHI_DECISION_HANDOFF` / II.6 states for offline export.

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
| Expediente state `ST-RDY` | **REQUIRED** | **v1 only** — `state === "ST-RDY"`; **ST-DEC re-export DEFERRED** |
| `evaluateDecisionReadiness.ready === true` | **REQUIRED** | CB-16 readiness aggregate |
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

Wrapper **mínimo** versionado **alrededor** del package CB-16 (payload intacto en el campo `payload`):

| Campo | Rol |
|-------|-----|
| `exportSchemaVersion` | Versión del envelope P-INT-04 Offline (v1 = `1`) |
| `decisionPackageVersion` | Copia de `payload.meta.version` (CB-16) |
| `packageId` | **Exacto:** `dpkg-{factory_key}-{canonicalContentChecksum}` (§17) |
| `factory_key` | Aislamiento |
| `generatedAt` | Metadata de **instancia** — **nunca** entra en el checksum lógico |
| `canonicalContentChecksum` | SHA-256 hex **lowercase** del payload canónico (§15) — identidad lógica |
| `exportMode` | `"OFFLINE_LOCAL"` |
| `boundarySummary` | Snapshot de flags boundary (must equal `payload.boundary` flags) |
| `inputSnapshotRefs` | Refs opcionales a evidencia/ELR acts usados |
| `payload` | **CB-16 Decision Package object** (como lo emite el builder; el hash usa la **vista canónica** §15) |

**Allowlist envelope (unknown fields → REJECT):**  
exactamente los campos de la tabla anterior. Sin strip silencioso.

**MUST NOT** mutate CB-16 internal schema without separate Director mandate.

---

## 15. Canonicalización

**Especificación cerrada — no hay decisiones abiertas para IMPL.**

Bytes canónicos del **corpus** (entrada a `canonicalContentChecksum`):

1. **UTF-8.**  
2. Partir del payload CB-16; construir **vista canónica** con `meta.builtAt` **eliminado** antes del hash.  
3. Orden de claves: **sort recursivo** de keys en todos los objetos.  
4. **Arrays conservan orden** (lineage / `elrSequence`) — no reordenar entradas.  
5. `undefined` **omitido**; `null` **preservado**.  
6. Números / strings: serialización JSON estándar (sin reformateo especial).  
7. Serialización: **JSON compacto** (`JSON.stringify` sin pretty-print) + **newline final `\n`**.  
8. `canonicalContentChecksum` = SHA-256 hex **lowercase** de esos bytes exactos.  
9. Envelope `generatedAt` **nunca** participa en el checksum lógico.  
10. Separación: metadata de instancia (envelope) ≠ contenido canónico (vista del payload).

El builder CB-16 **MAY** seguir emitiendo `builtAt` en el objeto persistido dentro de `payload`; la identidad lógica **MUST** hashear la vista sin `builtAt`.

---

## 16. Integridad

**Roles cerrados:**

| Rol | Autoridad |
|-----|-----------|
| **Integridad física** del artefacto on-disk | **Sidecar** `{artifact}.sha256` — SHA-256 de los **bytes exactos del archivo envelope** |
| **Identidad lógica** del corpus | Campo envelope `canonicalContentChecksum` (payload canónico §15) |

**Read (orden obligatorio):**

1. Verificar sidecar vs bytes del envelope → mismatch → **FAIL-CLOSED**.  
2. Recomputar hash de la vista canónica del `payload` y comparar con `canonicalContentChecksum` → mismatch → **FAIL-CLOSED**.  

Reglas adicionales:

1. Algoritmo: **SHA-256**.  
2. **No** checksum circular: el hash del corpus **no** se embebe dentro de los bytes hasheados del corpus.  
3. JSON corrupto → fail-closed.  
4. Unknown `exportSchemaVersion` / unsupported `decisionPackageVersion` → reject.  
5. Unknown envelope fields → **reject** (no strip).  
6. **No silent repair.**  
7. No se promete atomicidad multi-file absoluta del filesystem.

---

## 17. Idempotencia e identidades

| Identidad | Forma vinculante |
|-----------|------------------|
| **Corpus / `packageId`** | `dpkg-{factory_key}-{canonicalContentChecksum}` (checksum completo, hex lowercase) |
| **Artefacto local** | Archivo nombrado por el mismo `packageId` (+ sidecar) |
| **Acto ELR export** | kind `DHI_OFFLINE_LOCAL_EXPORT` + `packageId` + checksum (§22) |
| **`deliveryId` CB-16** | Efímero (`Date.now` u otro) — **NO** es identidad del corpus |
| **`packageId` handoff CB-16** (`{key}@{version}`) | ID de acto de frontera ST-RDY→ST-DEC — **NO** es el `packageId` del export offline |

| Regla | Valor |
|-------|-------|
| Mismo input snapshot lógico | → **mismo** `canonicalContentChecksum` y **mismo** `packageId` |
| `generatedAt` | MAY diferir entre runs **sin** cambiar identidad lógica |
| Re-export mismo checksum (v1) | No nuevo corpus; local MAY no-op si artefacto verificado existe; ELR: **un** act `DHI_OFFLINE_LOCAL_EXPORT` por checksum (retry idempotente) |
| P-INT-04 Offline | **Servicio de export explícito y separado** — **no** compuesto dentro de `prepareAndDeliver` en v1 |

---

## 18. Persistencia recomendada (B + C)

### B — Artefacto local versionado

- Root: `data/factory-decision-packages/` (tests: temp dirs).  
- Layout aislado por `factory_key` (e.g. `{factory_key}/{packageId}.json` + `{packageId}.json.sha256`).  
- Thin store — **not** constitutional ELR replacement.  
- **Not** Supabase / cloud object storage.

### C — ELR reference

- Sección: `decision_handoffs`.  
- Kind **único** válido para este slice: **`DHI_OFFLINE_LOCAL_EXPORT`** (§22).  
- Metadata + referencia únicamente (packageId, checksum, relativeRef, exportMode) — **not** full package dump.  
- Registrar **solo después** de VERIFY local PASS (§22).

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
evaluateDecisionReadiness → buildDecisionPackage → validateDecisionPackageShape
        │
        ▼
P-INT-04 Offline Export Service (explicit; NOT inside prepareAndDeliver)
  canonicalize → checksum → packageId → envelope
        │
        ▼
  PREPARE → COMMIT → VERIFY (sidecar + content checksum)
        │
        ▼
  register DHI_OFFLINE_LOCAL_EXPORT  →  SUCCESS
```

**Modules (nombres vinculantes para IMPL):**

```text
src/factory/cb16/export/decisionPackageCanonicalize.js
src/factory/cb16/export/decisionPackageIntegrity.js
src/factory/cb16/export/localDecisionPackageExportStore.js
src/factory/cb16/export/decisionPackageExportService.js
src/factory/cb16/export/index.js
src/runPInt04OfflineDecisionPackageValidation.js
```

Extensión **aditiva** permitida bajo IMPL: añadir `DHI_OFFLINE_LOCAL_EXPORT` a `HANDOFF_ELR_KINDS` + helper ledger — **sin** alterar boundary ni blocked ops.  
Re-exports: crear `src/factory/cb16/index.js` mínimo **o** exportar solo desde `export/index.js`.  
**No classifier module.**  
**No** componer este flujo dentro de `prepareAndDeliver` en v1 (requiere mandato CB-16 aparte).

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

Adopt P-INT-03 lessons honestly (sidecar-backed artifact):

1. PREPARE: temp write envelope + fsync; write sidecar temp + fsync.  
2. COMMIT: promote with order that never accepts new envelope + old sidecar.  
3. VERIFY: sidecar + `canonicalContentChecksum` (§16).  
4. ABORT/RECOVERY: restore last intact pair if possible; else fail-closed.  
5. Restart/reload must recover last verified artifact; apply §22.3 reconcile if needed.  
6. Isolation by `factory_key`.  
7. **Do not** claim absolute multi-file FS atomicity.

Guarantee: **logical artifact atomicity + sidecar file integrity + logical content checksum + fail-closed**.

---

## 22. ELR integration — kind, protocolo y reconciliación

### 22.1 Kind vinculante

**Único kind válido** para el registro de éxito de P-INT-04 Offline:

`DHI_OFFLINE_LOCAL_EXPORT`

Campos mínimos del act: `packageId`, `canonicalContentChecksum`, `exportSchemaVersion`, `exportMode: "OFFLINE_LOCAL"`, `relativeRef`, `interfaceId`, actor, timestamps de registro ELR.

**Expresamente prohibido** reutilizar como sinónimo de export local:

- `DHI_PACKAGE_DELIVERED`
- `DHI_HANDOFF_COMPLETE`
- `DHI_DECISION_HANDOFF`
- `HANDOFF_EXECUTED` (u otros estados II.6)
- cualquier kind que implique Delivery / cloud / Decision Engine ingest

### 22.2 Protocolo de éxito (orden cerrado)

```text
evaluate readiness
  → build package
  → validate shape
  → canonicalize
  → checksum
  → packageId
  → build envelope
  → PREPARE
  → COMMIT
  → VERIFY (sidecar + canonicalContentChecksum)
  → register DHI_OFFLINE_LOCAL_EXPORT
  → SUCCESS
```

### 22.3 Reconciliación / fallos

| Situación | Acción vinculante |
|-----------|-------------------|
| Fallo antes de COMMIT local | No ELR export; limpiar temps; abort |
| VERIFY local fail | No ELR; restore/fail-closed; **no** éxito |
| Local OK + ELR write fail | Artefacto **permanece**; resultado **FAIL** (`LOCAL_OK_ELR_PENDING`); **no** fingir SUCCESS |
| Crash entre VERIFY y ELR | Reopen: artefacto verificado sin act → `reconcilePendingElrRef` (escribe act) o estado PENDING fail-closed para consumidores |
| Retry mismo checksum | Si artefacto verificado existe → no reescribir corpus; completar solo ELR si falta act para ese checksum |
| Un act por checksum (v1) | No duplicar `DHI_OFFLINE_LOCAL_EXPORT` para el mismo `canonicalContentChecksum` |
| Orphan: artefacto sin ELR | PENDING / reconcile — **no** inferir Delivery |
| Orphan: ELR sin artefacto | Fail-closed; **no** Delivery; sin silent repair; intervención ops |
| Confusión semántica | Local export ≠ Delivery ≠ II.6 `HANDOFF_EXECUTED` ≠ Marketplace publish ≠ `DHI_PACKAGE_DELIVERED` |

Coherencia: el checksum en el act ELR **MUST** coincidir con `canonicalContentChecksum` del artefacto local verificado.

---

## 23. Readiness

1. **v1:** `state === "ST-RDY"` **AND** `evaluateDecisionReadiness.ready === true`.  
2. **ST-DEC re-export:** **DEFERRED** (mandato futuro).  
3. Readiness fail → **no export**.  
4. Missing evidence ref → fail-closed.  
5. Unresolved blocker / not-ready CB-16 → no export.  
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
19. Unknown envelope/payload fields → **REJECT only** (no strip).  
20. `boundary.decides` permanece `false`.  
21. Classify Deal/Premium/Diamond prohibido / ausente.  
22. AI advisory no puede override blockers.  
23. No publish fields of authority.  
24. No access tier assignment.  
25. No pricing assignment.  
26. ELR `DHI_OFFLINE_LOCAL_EXPORT` coherente con checksum.  
27. Fallo de export / VERIFY **no** registra éxito; local OK + ELR fail → PENDING/FAIL no SUCCESS.  
28. Restart / reload + reconcile orphan local→ELR.  
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
44. Prohibido registrar `DHI_PACKAGE_DELIVERED` / II.6 `HANDOFF_EXECUTED` como export local.  
45. `packageId` exacto `dpkg-{factory_key}-{canonicalContentChecksum}`.  
46. Sidecar + content checksum dual verify en read.

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
| P-INT-04 Offline Implementation Plan (this file) | **UPDATED — H1–H4 / M1–M3 CLOSED — PLAN ONLY** |
| P-INT-04-OFFLINE-IMPL | **NOT AUTHORIZED** |
| CB-16 Decision Package | **EXISTS — reuse** |
| Kind export offline | **`DHI_OFFLINE_LOCAL_EXPORT`** (aditivo en IMPL) |
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

## Appendix B — Micro-constitutional closures (H1–H4 / M1–M3)

| ID | Decisión | Estado |
|----|----------|--------|
| H1 | Kind `DHI_OFFLINE_LOCAL_EXPORT` only | **CLOSED** |
| H2 | Canonicalización §15 cerrada | **CLOSED** |
| H3 | Protocolo + reconciliación §22 | **CLOSED** |
| H4 | `packageId` + export service separado §17 | **CLOSED** |
| M1 | Sidecar físico + content checksum lógico §16 | **CLOSED** |
| M2 | Solo ST-RDY v1; ST-DEC DEFERRED §23 | **CLOSED** |
| M3 | Unknown fields REJECT §14/§16 | **CLOSED** |

---

**END OF DOCUMENT**

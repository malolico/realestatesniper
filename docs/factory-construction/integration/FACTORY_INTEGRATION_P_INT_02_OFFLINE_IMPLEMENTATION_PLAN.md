# FACTORY INTEGRATION P-INT-02
## DSO LIVE INGEST — OFFLINE PREPARATION
## IMPLEMENTATION PLAN
### Recorded Packs + Connector Contracts

**Document ID:** `FACTORY_INTEGRATION_P_INT_02_OFFLINE_IMPLEMENTATION_PLAN.md`  
**Phase:** Factory Integration — Operational Completeness (Arizona)  
**Block:** P-INT-02 — DSO Live Ingest (**OFFLINE PREPARATION slice only**)  
**Document Type:** Technical Implementation Plan  
**Status:** PLAN ONLY — **NO IMPLEMENTATION AUTHORIZED BY THIS DOCUMENT**

**Repository:** RealEstateSniper  
**Normative sources:**

1. `docs/factory-construction/FACTORY_INTEGRATION_MASTER_PLAN.md` (§3.2 P-INT-02; §7.2 fixtures→adapters)  
2. Factory CB-02 Source Governance / DSO (`src/factory/cb02/**`)  
3. `docs/factory-construction/FACTORY_2.0_CONSTRUCTION_BLUEPRINT.md` (CB-02 / CB-05+)  
4. Factory Operational Completeness Audit (Director-ordered, READ_ONLY)  
5. Director Discovery Report — session artifact, non-versioned repository file (planning base only; **not** a Git document)

**Director authorization (this Plan document):** **approved** to exist as planning artifact.  
**Director authorization (P-INT-02-OFFLINE-IMPL code):** **NOT AUTHORIZED** by this document.  
**Director authorization (live connectors / live APIs):** **NOT AUTHORIZED**.

---

## 0. Absolute Non-Authorization Banner

This Plan **does not** authorize, and future offline implementation under a separate Director mandate **must not** introduce:

| Surface | Status under this Plan |
|---------|------------------------|
| Live APIs / county HTTP endpoints | **NOT AUTHORIZED** |
| HTTP / HTTPS / `fetch` / network I/O for sources | **NOT AUTHORIZED** |
| Web / React / Factory Control Center wiring | **NOT AUTHORIZED** |
| Supabase | **NOT AUTHORIZED** |
| AuthN / AuthZ | **NOT AUTHORIZED** |
| Storage buckets / cloud object stores as product | **NOT AUTHORIZED** |
| Edge Functions | **NOT AUTHORIZED** |
| Delivery / authenticated GET / consumer channels | **NOT AUTHORIZED** |
| II.7 and later Integration blocks | **NOT AUTHORIZED / NOT OPENED** |
| RLS / migrations / product tables / `deals` | **NOT AUTHORIZED** |
| Credentials / API keys / secrets for live sources | **NOT AUTHORIZED** |
| Deployments | **NOT AUTHORIZED** |

**Hard separations (constitutional for this block):**

```text
ConnectorContract     ≠  live HTTP connector
RecordedPack          ≠  API real / live response
OfflineIngestLoader   ≠  Supabase / product persistence
DSO source data       ≠  tablas de producto o deals
P-INT-02 Offline prep ≠  P-INT-02 Live Ingest (full)
```

---

## 1. Objetivo

Preparar operativamente **P-INT-02 — DSO Live Ingest** en su **fase offline**, de modo que Factory pueda:

1. Definir **contratos de conector** en modo **`RECORDED_ONLY`** para organismos Maricopa prioritarios.  
2. Almacenar y validar **recorded response packs** en disco (sin red).  
3. Ingerir provenance a través del camino canónico CB-02 (`IngestionLegitimacyGate` + `DsoIngestionService`) **sin** bypass por `buildSourceRef` directo.  
4. Producir un **piloto Maricopa reproducible** (CLI / runners futuros) que demuestre ingest fail-closed desde packs.  

**No** es objetivo de este Plan: conectar APIs reales, desplegar borde HTTP, ni sustituir fixtures de CB-05…10 en producción de producto.

---

## 2. Alcance

### 2.1 Incluido (futuro IMPL, solo tras autorización expresa)

| Ítem | Descripción |
|------|-------------|
| Contratos `RECORDED_ONLY` | ASR / GIS / RCR (piloto); CRT opcional oleada 2 |
| Recorded packs en disco | Manifest + payload + provenance + checksums |
| Loader offline | Lectura local + verificación + construcción de `IngestionRequest` |
| Validator de packs | Schema, checksum, coherencia catalog/taxonomy |
| Offline ingest flow | Pack → `DsoIngestionService.ingest` → ledger + ELR |
| Runner de validación P-INT-02 | Suite dedicada + regresión CB-02 |
| Smoke opcional CB-05 | Consumo de `source_ref` aceptados por gate (sin live) |
| Status / audit notes | Tras IMPL, bajo mandato separado |

### 2.2 Nombre oficial vs slice

| Nombre Master Plan | Slice de este Plan |
|--------------------|--------------------|
| **P-INT-02 DSO Live Ingest** | **Offline Preparation: Recorded Packs + Connector Contracts** |

El nombre “Live” permanece como pipeline oficial futuro. **Este documento solo planifica la preparación offline** prevista por Master Plan §7.2 (*extensión operacional vía fixtures→adapters, sin redefinir OMC*).

**Cláusula de estado Master Plan (O1):**  
**P-INT-02 Offline Preparation no cierra la fila oficial P-INT-02 del Factory Integration Master Plan. P-INT-02 Live Ingest permanece OPEN / NOT IMPLEMENTED / NOT AUTHORIZED.**

### 2.3 Jurisdicción piloto

**Maricopa County, AZ** — organismos ya `CATALOGUED` en `sourceOrganismsCatalog.js`.

---

## 3. Exclusiones

Explícitamente **fuera de alcance** de este Plan y de cualquier IMPL derivado de él sin nuevo mandato Director:

1. Live connectors / live ingest / rate limits / legal fetch.  
2. HTTP, WebSockets, gRPC, o cualquier I/O de red hacia fuentes.  
3. Web, React, FCC, Marketplace, Projection.  
4. Supabase, PostgREST, RLS, migraciones, tablas producto, `deals`.  
5. AuthN/AuthZ, JWT, Edge Functions, BFF, APIs HTTP Factory (P-INT-01).  
6. Cloud Storage / buckets como canal de Delivery.  
7. Delivery, exposición, autenticación de consumidores.  
8. II.7+ Integration governance blocks.  
9. Decision Engine, Product Catalog, `access_tier`, Deal/Premium/Diamond classification.  
10. Sustitución masiva no controlada de fixtures CB-05…10 en sus runners históricos (migración futura opcional, no v1).  
11. Credenciales, API keys, secrets de county vendors.  
12. Despliegues, CI cloud obligatoria (scripts locales sí pueden planificarse; workflows remotos no requeridos aquí).  
13. Black Box plataforma completa (P-INT-07); emitters locales no son requisito de este Plan.  
14. Redefinición de OMC / catálogos constitucionales / DDI.

---

## 4. Arquitectura

### 4.1 Posición en el mapa Master Plan

```text
HOY (CB-02)
  Catalog (ORG-*-MC) → Gate (no fetch) → Ledger JSONL + ELR
  Downstream: synthetic fixtures → buildSourceRef (bypass gate)

ESTE PLAN (offline)
  Recorded Pack (disk)
       → Pack Validator (checksum/schema)
       → Offline Loader
       → IngestionRequest
       → DsoIngestionService.ingest   ◄── único camino de ingest
       → source_ref + ledger + ELR
       → (opcional) CB-05+ smoke con refs gate-accepted

FUTURO (NOT AUTHORIZED aquí)
  Live Connector (HTTP) implementando el mismo contrato
       → mismos packs/schemas conceptuales
       → mismo gate
```

### 4.2 Componentes lógicos (futuros)

| Componente | Responsabilidad | Debe no |
|------------|-----------------|---------|
| **ConnectorContract** | Declarar organismo, familia, schema, modo `RECORDED_ONLY` | Abrir socket / fetch |
| **RecordedPack** | Payload + provenance en disco | Contener secretos / live URLs productivas |
| **PackManifest** | Identidad, vintage, checksums, `liveFetch: false` | Autorizar red |
| **PackValidator** | Fail-closed pre-ingest | Mutar Factory / producto |
| **OfflineLoader** | Cargar pack verificado → `IngestionRequest` | Bypass gate |
| **OfflineIngest** | Llamar `DsoIngestionService` | Persistencia Supabase |
| **P-INT-02 Runner** | Probar matriz offline | Requerir Web/Auth |

### 4.3 Persistencia permitida (local Factory only)

| Store | Uso |
|-------|-----|
| Packs bajo árbol local (p.ej. `data/factory-dso-packs/…`) | Recorded responses |
| `SourceIngestionLedger` (JSONL existente) | Historial ingest |
| `FileElrStore` / ELR CB-01 | Acts `DSO_SOURCE_INGEST` / `DSO_INGEST_REJECTED` |

Ningún store de producto.

---

## 5. Principios constitucionales

1. **Factory es fuente de verdad operativa** del expediente (`factory_key` / ELR).  
2. **Integration / adapters no mutan** semántica OMC ni CB-02 gate.  
3. **Provenance before payload:** nada entra sin pasar legitimidad CB-02.  
4. **No averaging** (LS-09 / conflict rules R7) — conflictos no se promedian.  
5. **Fail-closed:** duda, checksum inválido, organismo prohibido, o intento live → rechazo / error controlado.  
6. **Catalog-only organisms:** solo IDs presentes en `SOURCE_ORGANISMS`.  
7. **READ_ONLY respecto a producto:** packs ≠ `deals` / Marketplace.  
8. **Pilot Layer 1–2 DDI** respetado (`dsoDdiMapping` / dominios del organismo).  
9. **PII:** contact channels requieren autorización explícita; packs v1 preferirán datos no sensibles o redactados.  
10. **Offline ≠ Live:** cualquier método live debe fallar con `LIVE_NOT_AUTHORIZED` hasta mandato futuro.  
11. **No Delivery:** `source_ref` aceptado no implica publicado, entregado ni expuesto.  
12. **II.1–II.6** permanecen en vigor; este Plan no los reabre ni los redefine.

---

## 6. Contratos RECORDED_ONLY

### 6.1 Definición

Un **Connector Contract** es una declaración estática (código o JSON congelado) que describe cómo un organismo DSO **podría** suministrar datos a Factory. En v1 offline:

- `mode` **MUST** ser `"RECORDED_ONLY"`.  
- Cualquier operación `fetchLive` / `connect` **MUST NOT** existir, o **MUST** throw `LIVE_NOT_AUTHORIZED`.  
- El contrato **MUST** referenciar exactamente un `organismId` catalogado.

### 6.2 Campos mínimos del contrato

| Campo | Obligatorio | Notas |
|-------|-------------|-------|
| `contractId` | Sí | Estable, versionado |
| `organismId` | Sí | p.ej. `ORG-ASR-MC` |
| `familyId` | Sí | Alineado a `SOURCE_FAMILIES` / catalog |
| `jurisdiction` | Sí | `Maricopa County, AZ` |
| `epistemicLevel` | Sí | Del organismo |
| `accessClass` | Sí | Del organismo |
| `freshnessProfile` | Sí | Del catalog (`ASSESSOR_ROLL`, `TITLE_LIENS`, …) |
| `ddiDomains` / `ddiPart` | Sí | Coherentes con catalog + pilot map |
| `payloadSchemaId` | Sí | Identificador de schema del recorded body (**obligatorio**) |
| `requiredProvenanceFields` | Sí | Subconjunto de `IngestionRequest` |
| `mode` | Sí | `"RECORDED_ONLY"` |
| `liveFetch` | Sí | `false` |

**Payload schemas (O4):** `payloadSchemaId` es **obligatorio** en el contrato y en cada response del pack. Los **schemas mínimos** de payload ASR / GIS / RCR (campos canónicos del body) son **entregables de implementación S2–S3** bajo mandato **P-INT-02-OFFLINE-IMPL**. **No** forman parte del cierre documental de este Plan; este Plan solo exige que el id exista y sea reconocible en IMPL.

### 6.3 Contratos del piloto (oleada 1)

| contract | organismId | familyId | Prioridad |
|----------|------------|----------|-----------|
| Maricopa Assessor recorded | `ORG-ASR-MC` | `REGISTRAL_ASSESSOR` | P0 |
| Maricopa GIS recorded | `ORG-GIS-MC` | `GIS_OFFICIAL` | P0 |
| Maricopa Recorder recorded | `ORG-RCR-MC` | `REGISTRAL_RECORDER` | P0 |

### 6.4 Oleada 2 (opcional, mismo Plan, no live)

| contract | organismId | familyId |
|----------|------------|----------|
| Maricopa Court Index recorded | `ORG-CRT-MC` | `JUDICIAL_INDEX` |

`ORG-TTL-VND`, `ORG-CNT-OPT` quedan **fuera de v1** (alcance transaccional / PII).  
`ORG-PRH-SCR` **nunca** tiene contrato de ingest aceptable.

---

## 7. Recorded Response Packs

### 7.1 Definición

Un **Recorded Response Pack** es un artefacto de disco que simula la respuesta de un organismo **sin red**. Contiene:

- payload grabado (JSON/JSONL),  
- metadata de provenance,  
- manifest con checksums,  
- declaración explícita `sourceMode: "RECORDED"`, `liveFetch: false`.

### 7.2 Árbol ilustrativo (nombres finales en IMPL)

```text
data/factory-dso-packs/maricopa/<pilotId>/
  pack.manifest.json
  provenance.json
  CHECKSUMS.sha256
  response/
    ORG-ASR-MC.json
    ORG-GIS-MC.json
    ORG-RCR-MC.json
```

### 7.3 Reglas de contenido

1. Packs **MUST NOT** contener API keys, cookies, tokens, ni URLs de autenticación productivas.  
2. Packs **SHOULD** usar datos públicos / sintéticos realistas Maricopa (APN, geometría simplificada, índices).  
3. Packs **MUST NOT** escribirse en tablas producto.  
4. Un pack **MAY** cubrir uno o varios organismos del mismo `pilotId` / `factoryKey`.  
5. Payload **MUST** declarar `schemaId` coincidente con el contrato.

### 7.4 Relación con fixtures actuales

Los fixtures CB-05…10 (`*SourceFixtures.js`) permanecen válidos para runners históricos.  
Los packs **no** los reemplazan automáticamente en v1; el runner P-INT-02 es la superficie primaria.  
Ver §7.5 / O5 para el acotamiento de cualquier smoke CB-05.

### 7.5 Binding CB-05 — acotamiento v1 (O5)

- **v1** realiza ingest de **provenance** y emisión de **`source_ref`** vía `DsoIngestionService` / gate.  
- **v1 no** conecta payloads de packs directamente con CB-05 ni con motores Foundation.  
- Cualquier binding **payload→motores** requiere **mandato explícito** del Director (fuera de este Plan).  
- Únicamente podrá existir un **smoke opcional** que verifique consumo de `source_ref` gate-accepted mediante una **seam local documentada** en IMPL — sin `buildSourceRef` sintético, sin Supabase, sin producto.

---

## 8. Manifest

### 8.1 Campos mínimos de `pack.manifest.json`

| Campo | Tipo | Regla |
|-------|------|-------|
| `packId` | string | Único estable |
| `schemaVersion` | string | Version del formato pack |
| `jurisdiction` | string | `Maricopa County, AZ` |
| `pilotId` | string | Id de piloto |
| `factoryKey` | string | Expediente CB-01 del piloto |
| `organisms` | array | Lista de entradas por organismo (ver §8.1.1) |
| `acquiredAt` | ISO-8601 | Momento de grabación/empaquetado |
| `vintageAt` | ISO-8601 | **Opcional** — default de pack si la entrada de organismo no declara el suyo (ver §8.1.2) |
| `sourceMode` | enum | **MUST** = `"RECORDED"` |
| `liveFetch` | boolean | **MUST** = `false` |
| `contractIds` | string[] | Contratos aplicados |
| `createdBy` | string | Actor no secreto (p.ej. `factory-ops-pilot`) |
| `notes` | string | Opcional, no operativo |

**Prohibido en el manifest:** campo `manifestChecksum` (u otro hash auto-incluido). La integridad del manifest se declara **fuera** del propio documento (§10).

### 8.1.1 Entrada de `organisms[]`

Cada elemento **MUST** incluir al menos:

| Campo | Regla |
|-------|-------|
| `organismId` | Catalogado, no PROHIBITED |
| `familyId` | Coherente con contrato/catalog |
| `responsePath` | Relativo bajo el pack |
| `contentChecksum` | Hash del payload (p.ej. SHA-256) |
| `payloadSchemaId` | Obligatorio; schemas mínimos = IMPL S2–S3 (O4) |
| `vintageAt` | **Opcional** por organismo |

### 8.1.2 Reglas `vintageAt` (O2)

1. Se **permite** `vintageAt` por entrada individual dentro de `organisms[]`.  
2. Se **permite** `vintageAt` a nivel pack **únicamente** como **default opcional**.  
3. Cuando exista `organisms[i].vintageAt`, **prevalece** sobre el `vintageAt` de pack.  
4. El loader **MUST** usar el valor efectivo (organismo → default pack → fail-closed si ambos ausentes y el contrato exige vintage).

### 8.2 Fail-closed sobre manifest

- `liveFetch !== false` → **REJECT pack**.  
- `sourceMode !== "RECORDED"` → **REJECT pack**.  
- Organism desconocido / `PROHIBITED` → **REJECT pack**.  
- `factoryKey` inválido / expediente ausente en momento de ingest → fallo CB-02 existente (throw / reject path).  
- Presencia de `manifestChecksum` (u hash auto-referente) → **REJECT pack** (diseño circular prohibido; O3).

---

## 9. Provenance

### 9.1 Alineación a CB-02 `IngestionRequest`

El loader **MUST** construir un request compatible con `IngestionLegitimacyGate`:

| Campo | Origen típico |
|-------|----------------|
| `organismId` | Manifest / contrato |
| `familyId` | Manifest / contrato |
| `factoryKey` | Manifest |
| `vintageAt` | Efectivo: `organisms[i].vintageAt` si existe; si no, default de pack (O2) |
| `prohibitedFlags` | `provenance.json` (normalmente vacío) |
| `lowConfidenceFlags` | `provenance.json` |
| `piiAuthorized` | Solo si aplica contact channel (v1: evitar) |
| `conflictDetected` / `conflictResolvable` / `conflictResolutionStrategy` | `provenance.json` (tests de conflicto) |
| `targetMpiDomain` | Opcional; DDI pilot |

### 9.2 Relación con `source_ref`

Tras aceptación, CB-02 emite `source_ref` vía `buildSourceRef` **dentro del gate** (no desde fixtures).  
Campos del ref (id `SRC-…`, `organismId`, `familyId`, `epistemicLevel`, `acquiredAt`, `vintageAt`, `ddiDomains`, `ddiPart`, flags, `constitutionalPhase: "CB-02"`) permanecen la **única moneda de provenance** aguas abajo.

### 9.3 Payload vs provenance

| Capa | Qué guarda en v1 |
|------|------------------|
| CB-02 gate/ledger/ELR | Provenance + `source_ref` / rechazo |
| Pack en disco | Payload grabado (no ingerido como producto) |
| CB-05+ | **Sin binding de payload en v1** (O5); smoke opcional solo de `source_ref` vía seam local documentada bajo mandato IMPL |

CB-02 **no** se modifica para convertirse en almacén de payloads producto.

---

## 10. Checksums

### 10.1 Autoridad de integridad (O3) — sin diseño circular

Se adopta **exclusivamente** el siguiente patrón (no mezclar con hash auto-incluido en el manifest):

1. **Hashes de cada payload** (`organisms[i].contentChecksum` y/o líneas en `CHECKSUMS.sha256`).  
2. **`CHECKSUMS.sha256` externo** como **autoridad** del pack: lista de paths relativos → digest, incluyendo:  
   - cada `response/*.json` (o equivalente);  
   - el archivo `pack.manifest.json` **serializado tal cual en disco**;  
   - opcionalmente `provenance.json`.  
3. El archivo `pack.manifest.json` **MUST NOT** contener `manifestChecksum` ni ningún campo que sea el hash de sí mismo.  
4. El validator **MUST**:  
   - rechazar packs cuyo manifest incluya hash auto-referente;  
   - recomputar digests de payloads y del manifest en disco;  
   - comparar contra `CHECKSUMS.sha256`;  
   - **REJECT** en mismatch o ausencia de `CHECKSUMS.sha256`.

**Patrón prohibido:** calcular un `manifestChecksum` embebido dentro del mismo manifest que luego se hashea (circularidad).

### 10.2 Requisitos adicionales

1. Algoritmo **SHOULD** declararse en cabecera o comentario de `CHECKSUMS.sha256` (p.ej. SHA-256).  
2. Tamper / mismatch → **REJECT** (no ingest).  

### 10.3 Qué no son los checksums

- No son Delivery receipts.  
- No sustituyen integrity del Read Model Contract v2 (II.2).  
- No autorizan exposición externa.

---

## 11. Offline Loader

### 11.1 Responsabilidades

1. Resolver path del pack bajo raíz local permitida.  
2. Invocar Pack Validator (checksum + schema + mode).  
3. Leer `provenance.json` + responses.  
4. Para cada organismo del pack: construir `IngestionRequest`.  
5. Invocar offline ingest (sección 13).  
6. Devolver resultado estructurado: accepts / rejects / `source_ref` ids / ledger notes.  
7. **MUST NOT** abrir red.

### 11.2 Inyección de dependencias

El loader **SHOULD** aceptar inyección de:

- `DsoIngestionService` (o factory),  
- `FactoryRegistry` / stores locales,  
- raíz de packs,

para tests deterministas (temp dirs), igual que CB-02 validation hoy.

---

## 12. Validator

### 12.1 Checks obligatorios (fail-closed)

| Check | Fallo |
|-------|-------|
| Manifest parseable + campos mínimos | REJECT |
| `sourceMode === "RECORDED"` | REJECT |
| `liveFetch === false` | REJECT |
| Organism catalogued y no PROHIBITED | REJECT |
| `familyId` coherente con contrato/catalog | REJECT |
| Response file existe y checksum OK vs `CHECKSUMS.sha256` | REJECT |
| Manifest en disco hasheado sin campo auto-checksum; coincide con `CHECKSUMS.sha256` | REJECT |
| Manifest **no** contiene `manifestChecksum` | REJECT si presente |
| `payloadSchemaId` declarado (schemas mínimos = IMPL S2–S3) | REJECT si ausente |
| Ausencia de campos secretos conocidos (heurística) | REJECT / WARN→REJECT en v1 estricto |
| Contrato `mode === "RECORDED_ONLY"` | REJECT |

### 12.2 Checks no bloqueantes (metadata)

- Freshness `degraded` (CB-02 no bloquea stale en gate; el validator **MAY** etiquetar `FRESHNESS_DEGRADED` sin impedir ingest, salvo política piloto futura documentada).

### 12.3 Separación

Validator de pack **≠** `validateCb02` histórico.  
Ambos **MUST** permanecer verdes tras IMPL: CB-02 sin regresión; P-INT-02 con suite propia.

---

## 13. Offline Ingest Flow

```text
[Recorded Pack on disk]
        │
        ▼
 PackValidator (checksum/schema/mode)
        │
        ├── FAIL → stop (no gate call)
        │
        ▼
 OfflineLoader → IngestionRequest[]
        │
        ▼
 DsoIngestionService.ingest(factoryKey, request)
        │
        ├── Gate REJECT → ledger + ELR DSO_INGEST_REJECTED
        │
        └── Gate ACCEPT → source_ref + ledger + ELR DSO_SOURCE_INGEST
                │
                └── (optional smoke only) verify gate-accepted source_ref
                    via documented local seam — NO payload→CB-05 binding in v1 (O5)
```

### 13.1 Regla de oro

**Prohibido** en el flujo offline de P-INT-02:

- llamar `buildSourceRef` directamente para “aceptar” un pack;  
- escribir a Supabase / `deals`;  
- invocar HTTP.

**Único camino de aceptación:** `DsoIngestionService.ingest` → `IngestionLegitimacyGate.evaluate`.

### 13.2 Prerrequisito de expediente

Debe existir expediente CB-01 para `factoryKey` (comportamiento actual: throw si ausente). El piloto **MUST** crear/abrir expediente local antes del ingest.

---

## 14. Integración con capas Factory

| Bloque | Relación con P-INT-02 Offline | Acción v1 |
|--------|-------------------------------|-----------|
| **CB-02** | **Núcleo:** catalog, gate, service, ledger, freshness, conflicts, FP/FL | Consumir sin fork; exports públicos existentes |
| **CB-05** Foundations | Hoy: fixtures sintéticos ASR/GIS | **Sin binding payload→motores en v1** (O5); smoke opcional solo `source_ref` + seam local documentada; no reemplazo masivo de runners |
| **CB-06** Evidence | Clasifica `source_ref`; `deriveToEvidence` en rechazos de conflicto | Beneficio cuando refs/rejects vengan del gate; suite O7 verifica ruta Evidence; sin cambio semántico obligatorio de CB-06 en v1 |
| **CB-07** Legitimacy | Fixtures RCR/TTL/CRT | Pack RCR alimenta oleada 1 (provenance/`source_ref`); TTL/CRT no requeridos en v1; sin redefinir Legitimacy |
| **CB-08** Distress | Fixtures RCR/CRT | Fuera de piloto mínimo v1 |
| **CB-09** Economy | Fixtures ASR/GIS (families a veces no canónicas) | No migrar en v1; packs usan families canónicas |
| **CB-10** Environment | Incluye riesgo fixture→`ORG-PRH-SCR` | Packs **MUST NOT** imitar ese bypass; PROHIBITED sigue rechazado |
| **CB-15** Orchestration | Orquesta FFO sobre ELR/fixtures | Fuera de alcance v1 salvo que un piloto E2E futuro (otro mandato) encadene packs→bus |

**Principio:** v1 demuestra **ingest DSO offline correcto**. No exige re-certificar CB-15 ni reescribir capas 07–10.

---

## 15. Fail-Closed Rules

1. Pack inválido / checksum mismatch → **no ingest**.  
2. `liveFetch: true` o intento de método live → **`LIVE_NOT_AUTHORIZED`** / reject.  
3. Organism uncatalogued / prohibited / FP-* → reject (gate).  
4. Averaging strategy → reject + deriveToEvidence (gate).  
5. PII contact sin `piiAuthorized` → reject (gate).  
6. Conflicto irresoluble → reject + deriveToEvidence (gate).  
7. Expediente ausente → error CB-02 (no silenciar).  
8. Ambigüedad de contrato/schema → reject pack.  
9. Presencia de secretos detectados → reject pack.  
10. Cualquier path que omita el gate → **prohibido** (fallo de diseño / test).

---

## 16. Seguridad

| Tema | Regla |
|------|-------|
| Secretos | Prohibidos en packs y contratos |
| Red | Prohibida |
| PII | Minimizar; contact opt-in fuera de v1 |
| Product DB | Prohibido |
| Path traversal | Validator/loader MUST acotar raíz de packs |
| Integridad | Checksums obligatorios |
| Observabilidad | Sin telemetría externa; solo CLI/logs locales si se añaden en IMPL |
| Auth | No introducir |

---

## 17. Riesgos

| Riesgo | Severidad | Mitigación |
|--------|-----------|------------|
| Confundir Offline prep con Live P-INT-02 | Crítica | Banner §0; `RECORDED_ONLY`; tests anti-HTTP |
| Bypass del gate (patrón fixtures) | Alta | Único path `DsoIngestionService.ingest` |
| Contaminar producto (`deals`) | Crítica | Exclusiones + audit de imports |
| Packs con PII real | Alta | Datos sintéticos/redactados en v1 |
| Romper runners CB-05…10 | Media | No migrar fixtures en v1 |
| Scope creep a P-INT-01 / II.7 | Alta | Restricciones §21 |
| Freshness stale interpretado como bloqueo CB-02 | Baja | Documentar advisory; no inventar semántica nueva sin mandato |

---

## 18. Criterios de aprobación

Este **Plan** se considera aceptable cuando:

1. Declara objetivo offline-only bajo P-INT-02.  
2. Fija exclusiones absolutas (no live/HTTP/Web/Supabase/Auth/Storage/Edge/Delivery/II.7).  
3. Define contratos `RECORDED_ONLY`, packs, manifest, provenance, checksums, loader, validator, flow.  
4. Integra CB-02 como oráculo de ingest y posiciona CB-05…15 sin redefinir OMC.  
5. Define fail-closed, seguridad, riesgos, secuencia IMPL y suites.  
6. **No** autoriza código por sí mismo.  
7. No contradice Master Plan §3.2 / §7.2 ni CB-02 “no live connectors / no real fetch”.  
8. Declara explícitamente (O1): Offline Preparation **no** cierra la fila Master Plan P-INT-02; Live permanece OPEN / NOT IMPLEMENTED / NOT AUTHORIZED.

Un futuro **P-INT-02-OFFLINE-IMPL** se considerará completo solo cuando (bajo mandato separado):

1. Contratos ASR/GIS/RCR `RECORDED_ONLY` existan.  
2. Al menos un pack piloto Maricopa pase validator + ingest gate.  
3. Runner P-INT-02 PASS (incluyendo O7 conflicto irresoluble).  
4. `runCb02DsoValidation` PASS (regresión).  
5. Audit de imports: sin HTTP client de fuentes, sin Supabase, sin Web.  
6. Status note declare Live **aún NOT AUTHORIZED** y Offline **no** cierre Master Plan P-INT-02.  
7. Schemas mínimos ASR/GIS/RCR existan como entregable IMPL S2–S3 (O4) — no como cierre de este Plan.
---

## 19. Plan secuencial de implementación

| Paso | Contenido | Autorización requerida |
|------|-----------|------------------------|
| **S0** | Este Plan auditado + commit (Director) | Plan only |
| **S1** | Mandato **P-INT-02-OFFLINE-IMPL** | Director |
| **S2** | Scaffold contratos `RECORDED_ONLY` (ASR/GIS/RCR) | IMPL |
| **S3** | Manifest schema + checksum helpers + validator | IMPL |
| **S4** | Offline loader + offline ingest wrapper → CB-02 service | IMPL |
| **S5** | Packs piloto Maricopa en `data/factory-dso-packs/…` | IMPL |
| **S6** | Runner `runPInt02RecordedIngestValidation` + regresión CB-02 | IMPL |
| **S7** | (Opcional) smoke CB-05 **solo** `source_ref` + seam local documentada — **sin** payload→motores (O5) | IMPL |
| **S8** | Independent audit + IMPL status note + commit | Director |
| **S9** | Live connectors | **NOT AUTHORIZED** (futuro mandato distinto) |

---

## 20. Suites de validación

### 20.1 Regresión obligatoria

```text
node src/runCb02DsoValidation.js
```

### 20.2 Suite nueva (nombre ilustrativo hasta IMPL)

```text
node src/.../runPInt02RecordedIngestValidation.js
```

**Casos mínimos:**

1. Pack válido ASR+GIS+RCR → gate ACCEPT + ledger + ELR ingest acts.  
2. Checksum tamper (payload o manifest vs `CHECKSUMS.sha256`) → REJECT pre-gate.  
3. Manifest con `manifestChecksum` auto-incluido → REJECT (O3).  
4. `liveFetch: true` / mode inválido → REJECT.  
5. `ORG-PRH-SCR` o FP-* → gate REJECT.  
6. Averaging strategy → REJECT.  
7. **Conflicto irresoluble (O7):** `conflictDetected: true` + `conflictResolvable: false` → rechazo fail-closed; `deriveToEvidence: true`; verificación de ledger + ELR `DSO_INGEST_REJECTED` (o act equivalente) y ruta Evidence (`deriveToEvidence` observable para CB-06).  
8. Expediente ausente → fail-closed (error esperado).  
9. Static audit: módulos nuevos sin `fetch`/http/https/supabase.  
10. Confirmación `source_ref` solo tras gate (no fixture bypass).  
11. Confirmación v1 **sin** binding payload→CB-05 (O5).
### 20.3 No requeridas para cierre offline v1

- Suites Web/E2E browser.  
- Suites Supabase.  
- Live county API tests.

---

## 21. Restricciones

### 21.1 Restricciones absolutas (repetición deliberada)

- **NO Live APIs.**  
- **NO HTTP.**  
- **NO Web.**  
- **NO Supabase.**  
- **NO Auth.**  
- **NO Storage** (cloud/product).  
- **NO Edge Functions.**  
- **NO Delivery.**  
- **NO II.7.**

### 21.2 Restricciones de proceso

1. Este documento **no** autoriza implementación.  
2. IMPL requiere mandato Director titulado de forma inequívoca (p.ej. **P-INT-02-OFFLINE-IMPL**).  
3. No abrir P-INT-01, P-INT-03…10, ni II.7 bajo color de este Plan.  
4. No modificar semántica de `IngestionLegitimacyGate` salvo bugfix-closed demostrado y mandato explícito.  
5. No redefinir OMC / DDI / FFO.  
6. No introducir credenciales.  
7. No hacer push/deploy como parte del Plan.

### 21.3 Archivos previsibles (solo tras IMPL auth — no crear ahora)

```text
src/factory/cb02/connectors/connectorContract.js
src/factory/cb02/connectors/maricopaConnectorContracts.js
src/factory/cb02/connectors/recordedPackManifest.js
src/factory/cb02/connectors/recordedPackLoader.js
src/factory/cb02/connectors/offlineIngestFromPack.js
src/factory/cb02/connectors/... validation helpers ...
src/.../runPInt02RecordedIngestValidation.js
data/factory-dso-packs/maricopa/<pilotId>/...
docs/.../FACTORY_INTEGRATION_P_INT_02_OFFLINE_IMPL_STATUS.md  (post-IMPL)
```

Modificaciones mínimas posibles: `src/factory/cb02/index.js` (re-exports).  
**Prohibido** tocar `src/factory` fuera del alcance DSO offline acordado, Web, Supabase, Integration II.x.

---

## 22. Documentary Status

| Ítem | Estado |
|------|--------|
| Master Plan P-INT-02 (pipeline name) | Documented; **OPEN** — Live **NOT IMPLEMENTED / NOT AUTHORIZED** |
| P-INT-02 Offline Preparation (this Plan) | **PLAN ONLY** — **does not close** Master Plan P-INT-02 row (O1) |
| P-INT-02-OFFLINE-IMPL | **NOT AUTHORIZED** |
| P-INT-02 Live connectors / Live APIs | **NOT AUTHORIZED** / **OPEN** |
| Code / packs / runners from this act | **NOT CREATED** |
| II.7 | **NOT OPENED** |

---

## 23. Final Clause

This Plan authorizes **only** the existence of an audited planning document for **P-INT-02 Offline Preparation (Recorded Packs + Connector Contracts)**.

It does **not** authorize writing connectors, packs, loaders, validators, runners, or any modification of Factory Runtime until a separate Director implementation mandate is issued.

Until that mandate, Factory remains on synthetic fixtures + catalog-only DSO; Arizona operational maturity advances **only** through offline recorded provenance — never through live network or product databases.

---

**END OF DOCUMENT**

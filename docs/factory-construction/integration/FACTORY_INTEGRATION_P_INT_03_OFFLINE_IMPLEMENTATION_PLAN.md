# FACTORY INTEGRATION P-INT-03
## ELR PERSISTENCE BRIDGE — OFFLINE / LOCAL DURABLE PREPARATION
## IMPLEMENTATION PLAN
### Atomic / Hardened File ELR Store

**Document ID:** `FACTORY_INTEGRATION_P_INT_03_OFFLINE_IMPLEMENTATION_PLAN.md`  
**Phase:** Factory Integration — Operational Completeness (Arizona)  
**Block:** P-INT-03 — ELR Persistence Bridge (**OFFLINE / LOCAL DURABLE slice only**)  
**Document Type:** Technical Implementation Plan  
**Status:** PLAN ONLY — **NO IMPLEMENTATION AUTHORIZED BY THIS DOCUMENT**  
**Documentary corrections:** O1–O6 closed (post independent audit)

**Repository:** RealEstateSniper  

**Normative sources:**

1. `docs/factory-construction/FACTORY_INTEGRATION_MASTER_PLAN.md` (§3.2 P-INT-03; §7.1 ELR Store Adapter)  
2. `docs/factory-construction/integration/FACTORY_INTEGRATION_P_INT_02_OFFLINE_IMPLEMENTATION_PLAN.md`  
3. `docs/factory-construction/integration/FACTORY_INTEGRATION_P_INT_02_OFFLINE_IMPL_STATUS.md`  
4. Factory CB-01 Registry / ELR (`src/factory/cb01/**`)  
5. Factory CB-02 DSO (consumer of Registry/ELR via ingest acts)  
6. Factory CB-15 Orchestration (persists through Registry/ELR)  
7. `docs/factory-construction/FACTORY_2.0_CONSTRUCTION_BLUEPRINT.md` (CB-01)  
8. Construction ledger / relevant COMPLETION docs  
9. Director Discovery Report P-INT-03 — session artifact, non-versioned repository file  

**Director authorization (this Plan document):** **approved** to exist as planning artifact.  
**Director authorization (P-INT-03-OFFLINE-IMPL code):** **NOT AUTHORIZED** by this document.  
**Director authorization (SQLite / Supabase ELR / cloud persistence):** **NOT AUTHORIZED**.

**Technological decision (binding for this Plan):**  
Implement **Atomic / Hardened File ELR Store** on local filesystem.  
**SQLite** is **DEFERRED**, **NOT AUTHORIZED**, and **out of current scope**.

---

## 0. Absolute Non-Authorization Banner

This Plan **does not** authorize, and any future offline IMPL under a separate Director mandate **must not** introduce:

| Surface | Status under this Plan |
|---------|------------------------|
| SQLite / `better-sqlite3` / `sql.js` / any SQL engine | **DEFERRED / NOT AUTHORIZED** |
| Changes to `package.json` / new runtime dependencies | **NOT AUTHORIZED** |
| Supabase / PostgREST / RLS / cloud migrations | **NOT AUTHORIZED** |
| Product tables / `deals` / Marketplace storage | **NOT AUTHORIZED** |
| Web / React / FCC wiring | **NOT AUTHORIZED** |
| AuthN / AuthZ / Edge Functions / BFF / HTTP APIs | **NOT AUTHORIZED** |
| Cloud object Storage / buckets as Delivery | **NOT AUTHORIZED** |
| Delivery / authenticated GET / consumer channels | **NOT AUTHORIZED** |
| Deployments | **NOT AUTHORIZED** |
| II.7 and later Integration blocks | **NOT AUTHORIZED / NOT OPENED** |
| Expansion to Evidence / Foundation / Legitimacy / Distress / Economy / Environment / Intelligence stores | **NOT AUTHORIZED** (ELR Registry only) |
| SourceIngestionLedger redesign | **NOT AUTHORIZED** in v1 |
| Full event-sourcing / replay engine | **NOT AUTHORIZED** in v1 |
| Semantic changes to `elrSchema` / `appendElrEntry` / `elrSequence` / state machine / `FactoryRegistry` | **PROHIBITED** |
| Global flip of `FactoryRegistry` default store to Atomic | **NOT AUTHORIZED** in this phase (see §8 / O6) |

**Hard separations:**

```text
ELR constitutional schema     ≠  store adapter implementation
FileElrStore (baseline)       ≠  AtomicFileElrStore (durable local)
P-INT-03 Offline durable FS   ≠  Supabase / product DB
P-INT-03 Offline              ≠  P-INT-03 full “object store / cloud DB”
AtomicFileElrStore            ≠  SQLite
Expediente ELR document       ≠  deals / markets / product tables
Filesystem multi-file rename  ≠  absolute multi-file atomicity (not promised)
```

---

## 1. Objetivo

Preparar operativamente **P-INT-03 — ELR Persistence Bridge** en su **fase offline/local durable**, de modo que Factory pueda:

1. Formalizar un **ElrStorePort** compatible con el duck-type ya usado por `FactoryRegistry({ store })`.  
2. Conservar **`FileElrStore`** como **default constitucional/baseline** y referencia de paridad.  
3. Introducir **`AtomicFileElrStore`** (nombre ilustrativo) activado **solo por inyección explícita**, con escritura durable del par JSON+sidecar, integridad SHA-256 fail-closed, recuperación determinista y versionado de formato de store.  
4. Mantener **sin cambio** la semántica constitucional del ELR (secciones, `appendElrEntry`, `elrSequence`, transiciones de estado).  
5. Demostrar, vía runner futuro, durabilidad local reproducible **sin** Supabase, Web, APIs, cloud ni SQLite.

**No** es objetivo: migrar ELR a cloud, mezclar con `deals`, endurecer todos los `data/factory-*`, flip global del default store, ni abrir II.7.

---

## 2. Alcance

### 2.1 Incluido (futuro IMPL, solo tras autorización expresa)

| Ítem | Descripción |
|------|-------------|
| `ElrStorePort` | Contrato documentado / asserts del duck-type CB-01 (+ lifecycle opcional §22.1) |
| `FileElrStore` | Baseline **default**; usado en parity tests; semántica inalterada |
| `AtomicFileElrStore` | Adapter durable local (protocolo PREPARE/COMMIT/ABORT/RECOVERY §10–§11) |
| Integridad SHA-256 | Sidecar externo; verificación fail-closed en read |
| `storeFormatVersion` | Versionado de **formato de store**, no del vocabulario constitucional ELR |
| Runner P-INT-03 | Suites §28 (incluye CB-15 smoke) |
| Status note | Tras IMPL, mandato separado |

### 2.2 Nombre oficial vs slice

| Nombre Master Plan | Slice de este Plan |
|--------------------|--------------------|
| **P-INT-03 ELR Persistence Bridge** | **Offline / Local Durable: Atomic Hardened File ELR Store** |

Este Plan **no** cierra la fila Master Plan P-INT-03 respecto a object store / DB dedicada cloud.  
**P-INT-03 Supabase / cloud / SQLite** permanece **OPEN / NOT IMPLEMENTED / NOT AUTHORIZED**.

### 2.3 Unidad atómica de persistencia

**Un expediente completo por `factory_key`** (record Registry + ELR anidado), tal como hoy espera `FactoryRegistry` / `store.write(record)`.

La **unidad de integridad** es el **par** `(expediente JSON canónico, sidecar .sha256)`.

### 2.4 Garantía honestamente declarada (O1)

Este Plan **no** promete atomicidad filesystem multi-file absoluta (imposible con dos `rename` independientes sin journaling del FS).

La garantía vinculante de v1 es:

| Garantía | Significado |
|----------|-------------|
| **Atomicidad lógica del expediente** | Un `write` publica un nuevo par íntegro o no publica nada legible |
| **Integridad del par** | Solo se acepta en `read` un JSON cuyo hash coincide con su sidecar |
| **Recuperación determinista** | Tras fallo, o se restaura el último par íntegro, o el expediente queda no legible fail-closed |
| **Fail-closed ante ventana inconsistente** | Nunca devolver datos parciales; nunca silent repair |

---

## 3. Exclusiones

1. SQLite y cualquier motor SQL.  
2. Nuevas dependencias npm / cambios `package.json`.  
3. Supabase, RLS, migraciones cloud, tablas producto, `deals`.  
4. Web, Auth, Edge, BFF, APIs HTTP Factory (P-INT-01).  
5. Cloud Storage / Delivery / exposición.  
6. II.7+.  
7. Rediseño de `SourceIngestionLedger`.  
8. Stores: Evidence, Foundation, Legitimacy, Distress, Economy, Environment, Intelligence, Compliance.  
9. Event sourcing completo / replay engine (fuera de v1).  
10. Cambios semánticos a `elrSchema`, `appendElrEntry`, `elrSequence`, state machine, `FactoryRegistry` APIs (salvo hook mínimo opcional §22.1).  
11. Marketplace, Product Catalog, Decision Engine.  
12. Despliegues.  
13. Flip global del default store a Atomic (O6).

---

## 4. Estado actual del ELR

| Dimensión | Estado real (baseline) |
|-----------|------------------------|
| Implementación | `FileElrStore` (`src/factory/cb01/fileElrStore.js`) |
| Ubicación | `data/factory-registry/expedientes/{factory_key}.json` |
| Formato | JSON pretty (`null, 2`) + newline final |
| Side effect de `write` | Inyecta `updatedAt` ISO y retorna el payload escrito |
| Puerto | `FactoryRegistry({ store })` — duck-type `exists` / `read` / `write` / `resolvePath` / `listFactoryKeys` (+ `ensureDirs` en FileElrStore) |
| Default Registry | `options.store ?? new FileElrStore()` |
| Atomicidad | **No** — `writeFileSync` directo |
| Integridad | **No** checksum |
| Versionado store | **No** |
| Concurrencia | **No** locking |
| Corrupción | `JSON.parse` throw; sin recovery |
| Key rename cleanup | `FactoryRegistry.resolveFactoryKey` hace `fs.unlinkSync` **solo** del path JSON provisional |
| Schema constitucional | `elrSchema.js` — secciones allowlist; `appendElrEntry` + `elrSequence` |
| Consumidores | CB-01 Registry; CB-02 ingest acts; CB-15 orchestration acts; CB-16 decision acts (vía Registry) |

---

## 5. Separación de planos

| Plano | Definición | Estado bajo este Plan |
|-------|------------|------------------------|
| **A. ELR constitucional** | Vocabulario/secciones/TRZ-01 / FFO; `createEmptyElr` / `appendElrEntry` | **Inmutable en semántica** |
| **B. FileElrStore actual** | Adapter FS baseline no atómico; **default** | **Conservar** default + parity baseline |
| **C. Bridge durable local** | `AtomicFileElrStore` + par JSON/sidecar + recovery | **Objeto de este Plan** (inyección explícita) |
| **D. Futura persistencia Supabase** | ELR en cloud / PostgREST | **NOT AUTHORIZED** |
| **E. Tablas producto / deals** | Storage Marketplace/producto | **Prohibido mezclar** |

---

## 6. Arquitectura propuesta

```text
┌────────────────────────────────────────────────────────────┐
│                    ElrStorePort (contract)                 │
│  exists / read / write / resolvePath / listFactoryKeys     │
│  (+ optional removeArtifacts / lifecycle — §22.1)          │
└────────────────────────────┬───────────────────────────────┘
               ┌─────────────┴─────────────┐
               ▼                           ▼
       FileElrStore                 AtomicFileElrStore
       DEFAULT / baseline           Injected only (O6)
       (no sidecar)                 PREPARE→COMMIT→ABORT/RECOVERY
               └─────────────┬─────────────┘
                             ▼
                    FactoryRegistry({ store })
                             │
                 ┌───────────┼───────────┐
                 ▼           ▼           ▼
              CB-01       CB-02       CB-15/16
            (owner)    (ELR acts)   (ELR acts)
```

**Principio:** sustituir **store por inyección**, no contrato constitucional ni APIs semánticas de Registry.  
**Default:** permanece `FileElrStore` (O6).

---

## 7. ElrStorePort

### 7.1 Métodos mínimos (compatibles con uso actual)

| Método | Semántica |
|--------|-----------|
| `exists(factoryKey)` | boolean — existencia **física** del JSON canónico (§14.1 / O5) |
| `read(factoryKey)` | `object \| null` — **nunca** datos parciales; integridad fail-closed si hay JSON |
| `write(record)` | Persiste expediente completo vía protocolo §11; retorna payload escrito (parity O4) |
| `resolvePath(factoryKey)` | Path del JSON canónico (requerido por `resolveFactoryKey` / unlink baseline) |
| `listFactoryKeys()` | Solo keys de JSON canónicos; ignora artefactos auxiliares (§14.1 / O5) |

### 7.2 Método opcional de lifecycle (O2)

| Método (nombre ilustrativo) | Semántica |
|-----------------------------|-----------|
| `removeArtifacts(factoryKey)` **o** `deleteExpedienteArtifacts(factoryKey)` | Elimina JSON canónico + sidecar + temps/backups asociados a esa key |

Reglas:

1. Port **MUST NOT** reinterpretar secciones ELR.  
2. Port **MUST NOT** llamar `appendElrEntry`.  
3. Port **MAY** rechazar `read`/`write` fail-closed por integridad/versión.  
4. Lifecycle opcional **MUST** ser no-op / ausente-seguro en `FileElrStore` (backward-compatible).  
5. Documentación + asserts de duck-type en tests; no es obligatorio un `class` abstracta runtime.

---

## 8. Adapter de compatibilidad FileElrStore (O4 / O6)

1. **`FileElrStore` permanece** como implementación **default constitucional/baseline**.  
2. Semántica de escritura actual **no** se “mejora” silenciosamente en el mismo archivo — el durable path es **`AtomicFileElrStore`**.  
3. Tests de paridad: mismo `record` round-trip File ↔ Atomic (contenido ELR / estado expediente / side effects observables).  
4. **Decisión vinculante O6 (P-INT-03 Offline v1):**  
   - Default de `FactoryRegistry` = **`FileElrStore`** (sin cambio).  
   - **`AtomicFileElrStore` se activa solo por inyección explícita** en runners, servicios y pruebas autorizadas.  
   - **No** flip global del default en esta fase.  
   - Cualquier cambio futuro del default requiere **mandato separado** + regresión completa.

### 8.1 Paridad observable obligatoria (O4)

`AtomicFileElrStore` **MUST** mantener paridad observable con `FileElrStore` en:

| Aspecto | Baseline actual |
|---------|-----------------|
| `updatedAt` | Inyectado en cada `write` (ISO timestamp) |
| Serialización | `JSON.stringify(payload, null, 2)` |
| Newline final | `\n` tras el JSON |
| Shape leído | Mismo expediente (tras unwrap de envelope de store, si aplica) |
| `exists` / `read` / `write` / `listFactoryKeys` / `resolvePath` | Misma semántica de contrato; Atomic añade fail-closed de integridad en `read` cuando hay JSON |

No cambiar semánticas existentes de Registry durante la implementación.

---

## 9. AtomicFileElrStore

### 9.1 Responsabilidades

- Implementar `ElrStorePort` (+ lifecycle de artefactos).  
- Persistir un JSON de expediente por `factory_key` bajo raíz configurable (tests: temp dir).  
- Protocolo PREPARE / COMMIT / ABORT / RECOVERY (§10–§11).  
- Sidecar de integridad (§12).  
- Envelope / campo `storeFormatVersion` (§13).  
- Lectura fail-closed (§14, §19).  
- Filtrado de artefactos en `listFactoryKeys` (O5).  
- Cleanup de provisional key artefacts (O2).

### 9.2 Qué no hace

- No ejecuta motores.  
- No modifica `elrSequence`.  
- No habla HTTP/Supabase/SQLite.  
- No gestiona Evidence u otros stores.  
- No se auto-inyecta como default de Registry.

---

## 10. Transaction boundary (O1)

### 10.1 Unidad

| Boundary | Definición |
|----------|------------|
| **Unidad lógica** | Una llamada `store.write(record)` para un `factory_key` |
| **Unidad de integridad** | Par `(JSON canónico, sidecar .sha256)` |
| **Contenido** | Expediente completo (estado + ELR anidado) tal como lo entrega Registry (+ `updatedAt` de store) |

`appendElrEntry` sigue ocurriendo **en memoria** dentro de Registry; la durabilidad comienza en `write`.

### 10.2 Fases vinculantes

| Fase | Cuándo | Efecto |
|------|--------|--------|
| **PREPARE** | Temporales escritos y fsynced; checksum calculado sobre bytes exactos del JSON temporal; backups del par anterior tomados si replace | Destino canónico **aún no** es el nuevo par |
| **COMMIT** | Nuevo par canónico publicado y verificado íntegro; backups/temps elegibles para limpieza | `read` debe aceptar el nuevo expediente |
| **ABORT** | Fallo antes de verificación del nuevo par | No aceptar JSON nuevo con checksum anterior; restaurar último par íntegro **si es posible**; si no, estado no legible fail-closed |
| **RECOVERY** | Arranque / reopen / detección de inconsistencia | Determinar último par íntegro o fail-closed; limpiar solo artefactos seguros; **nunca** silent repair |

### 10.3 Prohibiciones de Abort/Recovery

1. Nunca aceptar como válido un JSON nuevo con checksum anterior.  
2. Nunca devolver datos parciales.  
3. Ningún silent repair.  
4. No declarar “commit” hasta verificación del **nuevo par final**.

---

## 11. Escritura durable — protocolo vinculante v1 (O1)

**Diseño mínimo obligatorio** (nombres de sufijo ilustrativos; fijar en IMPL):

### 11.1 PREPARE

1. Serializar payload (parity O4: pretty + newline + `updatedAt`).  
2. Escribir **JSON temporal** en el mismo directorio destino.  
3. **fsync** del JSON temporal.  
4. Calcular **SHA-256 sobre los bytes exactos** del JSON temporal persistido.  
5. Escribir **sidecar temporal** con ese checksum (+ `storeFormatVersion` si vive en sidecar).  
6. **fsync** del sidecar temporal.  
7. **Replace:** si existe par canónico previo íntegro, copiar/renombrar a **backups controlados** (p.ej. `.bak` / `.bak.sha256`) **antes** de promover el nuevo par.  
8. **Create:** no hay par previo; no hay backup.

### 11.2 COMMIT (promoción documentada)

Orden de promoción **MUST** quedar fijado en IMPL Status; requisito:

1. Promover el nuevo par de forma que **en ningún momento** un `read` acepte JSON nuevo + sidecar viejo.  
2. Tras promoción, **verificar** el nuevo par final (recompute hash == sidecar).  
3. Solo entonces limpiar temporales y backups del ciclo.  
4. Si la promoción no concluye o la verificación falla → **ABORT / RECOVERY** (§11.3).

### 11.3 ABORT / RECOVERY

| Situación | Acción requerida |
|-----------|------------------|
| Fallo durante PREPARE | Dejar canónico previo intacto; limpiar temps del intento |
| Fallo durante promoción (replace) | Restaurar último par íntegro desde backups controlados **si es posible**; si no, expediente **no legible** fail-closed |
| Fallo en create sin canónico previo | Ausencia legítima (`read` → `null`) o temps ignorados; no publicar par incompleto |
| JSON canónico presente + sidecar ausente/mismatch | Fail-closed en `read`; no create silencioso que sobrescriba (O5) |
| Par bak íntegro disponible | RECOVERY **MAY** restaurarlo bajo reglas explícitas; **MUST NOT** mezclar JSON de un intento con sidecar de otro |

### 11.4 Honestidad

**Prohibido** afirmar atomicidad multi-file absoluta del filesystem.  
**Obligatorio** cumplir atomicidad lógica + integridad del par + recovery determinista + fail-closed.

**Prohibido** en Atomic: `writeFileSync` directo sobre el path canónico como único paso (baseline FileElrStore).

---

## 12. Integridad

### 12.1 Serialización

- JSON UTF-8.  
- Canonicalización **MUST** ser la misma usada para escribir bytes (parity O4: pretty `null, 2` + `\n`).  
- El hash se calcula sobre **bytes exactos** del archivo de datos (temporal en PREPARE; canónico en verificación COMMIT/read).

### 12.2 SHA-256 + sidecar

- Algoritmo: **SHA-256**.  
- Autoridad: archivo sidecar externo por expediente (p.ej. `{key}.json.sha256`).  
- **Prohibido** embeber el checksum **dentro** del mismo JSON hasheado (circularidad).

### 12.3 Verificación fail-closed

Antes de aceptar un `read` cuando existe JSON canónico:

1. Existencia del JSON y del sidecar.  
2. Recompute hash del JSON.  
3. Comparar con sidecar.  
4. Validar `storeFormatVersion` soportada.  
5. Mismatch / ausente / ilegible / versión desconocida → **fail-closed**; **no** objeto parcial; **no** reparar silenciosamente.

---

## 13. Versionado

| Campo | Significado |
|-------|-------------|
| `storeFormatVersion` | Versión del **envelope / formato de store** (AtomicFileElrStore) |

Reglas:

1. v1 declara una versión conocida (p.ej. `1`).  
2. Versión desconocida en read → **reject** fail-closed.  
3. **MUST NOT** alterar semántica de secciones ELR, `elrSequence`, ni vocabulario de estados.  
4. Compatibilidad: solo versiones explícitamente soportadas; sin migración automática silenciosa en v1.  
5. Ubicación: envelope de store o metadata de sidecar — preferir **fuera** del núcleo constitucional. Si el envelope envuelve el record, el adapter hace unwrap transparente para Registry.

---

## 14. Lectura y reglas de artefactos (O5)

### 14.1 `listFactoryKeys` / `exists` / artefactos

| Regla | Definición vinculante |
|-------|------------------------|
| `listFactoryKeys` | Solo `factory_key` derivados de **archivos JSON canónicos** de expediente |
| Ignorar siempre | `.sha256`, `.tmp`, `.bak`, archivos de recovery, cualquier artefacto auxiliar |
| `exists` | Existencia **física** del JSON canónico (no implica integridad) |
| Integridad / validez | Se comprueban en **`read`** |
| Corrupción vs create | Un expediente corrupto (`exists === true` pero `read` fail-closed) **MUST NOT** permitir `createExpediente` silencioso que lo sobrescriba — Registry ya bloquea por `exists`; Atomic **MUST NOT** debilitar eso |
| Intervención | Corrupción existente → fail-closed hasta RECOVERY controlado o intervención operacional |

### 14.2 Lectura

1. `read(factoryKey)` → expediente completo o `null` si ausencia legítima (sin JSON canónico).  
2. Aislamiento: un key → un documento; sin lecturas cruzadas.  
3. Orden determinista: arrays ELR conservan orden de append.  
4. Corrupción / checksum mismatch / versión desconocida → **error fail-closed**, no `null` ambiguo.

---

## 15. Idempotencia

| Caso | Comportamiento |
|------|----------------|
| `createExpediente` duplicado | Sigue fallando (Registry) — **sin cambio** |
| `appendElrEntry` | Sigue siendo append siempre — **sin cambio de semántica** |
| Idempotency key por act | **DIFERIDO** en v1 (no obligatorio) |
| `write` repetido del mismo record | Permitido (RMW); cada write sigue PREPARE→COMMIT |

Este Plan **no** introduce deduplicación de actos ELR.

---

## 16. Concurrencia y locking

### 16.1 Alcance real de v1

- Proceso único / serialización cooperativa esperada (como hoy).  
- **No** se promete multi-writer multi-proceso seguro.

### 16.2 Limitaciones

- Dos procesos escribiendo el mismo `factory_key` pueden intercalar commits; last-writer-wins a nivel de documento.  
- Locking file-based opcional (**MAY** en IMPL si trivial y testeable); si no se implementa, documentar limitación en Status.

### 16.3 Fail-closed

- No inventar “transacciones distribuidas”.  
- Sidecar/JSON inconsistente → fail-closed en read (+ RECOVERY según §11.3).

---

## 17. Restart / reopen

Tras proceso nuevo:

1. Mismo `rootDir`.  
2. `new FactoryRegistry({ store: new AtomicFileElrStore(root) })` — **inyección explícita**.  
3. `getExpediente(factoryKey)` recupera el último COMMIT íntegro, o fail-closed / `null` según §14.  
4. Temporales / backups huérfanos no deben hacer pasar lecturas corruptas; RECOVERY limpia solo lo seguro.

---

## 18. Partial-write recovery (O1)

1. Crash en PREPARE → canónico previo intacto (o ausencia en create).  
2. Crash en promoción → ABORT: restaurar par íntegro desde `.bak` si posible; si no, fail-closed.  
3. Suites **MUST** simular:  
   - truncado del path final (contraste baseline FileElrStore);  
   - fallo entre pasos de promoción (JSON nuevo / sidecar viejo o ausente);  
   - restore desde backup controlado;  
   - create incompleto sin publicar par.  
4. **No** auto-repair de JSON a medias.  
5. Limpieza de temps/backups **solo** tras verificar nuevo par final (COMMIT) o tras restore exitoso documentado.

---

## 19. Corruption detection

| Señal | Acción |
|-------|--------|
| JSON parse fail | Fail-closed |
| Checksum mismatch | Fail-closed |
| Sidecar missing when data exists | Fail-closed (v1 estricto) |
| JSON nuevo + checksum anterior | Fail-closed (nunca aceptar) |
| `storeFormatVersion` unknown | Reject |
| Silent repair | **Forbidden** |
| `exists` true + `read` fail-closed | Bloquea create; requiere RECOVERY / intervención |

---

## 20. Backup / restore local

1. Backup operacional = copia filesystem del árbol `expedientes/` (+ sidecars + bak si se conservan) a directorio local.  
2. Restore operacional = restaura archivos y verifica checksums antes de servir reads.  
3. Backups **controlados del protocolo write** (`.bak`) son distintos del backup operacional; ambos locales.  
4. **No** cloud backup.  
5. Herramienta/script de backup operacional **MAY** diferirse; suites mínimas pueden usar `fs.cpSync` en temp.

---

## 21. Replay

- **Fuera de v1.**  
- No inventar event sourcing completo.  
- El documento por `factory_key` (par íntegro) es la fuente de verdad materializada.  
- Replay futuro requeriría mandato aparte.

---

## 22. Integración con capas (O2 / O3)

| Componente | Relación |
|------------|----------|
| **FactoryRegistry** | Orquestador de mutaciones; inyecta `store`; default FileElrStore |
| **CB-01** | Dueño ELR constitucional; validators verdes |
| **CB-02** | `registerElrAct` → `store.write`; regresión P-INT-02 / CB-02 |
| **CB-15** | Persiste FFO vía Registry/ELR; smoke §28.18 |
| **P-INT-02 Offline** | **MUST** PASS con Atomic inyectable |

**No** modificar CB-05→CB-14 stores.

### 22.1 resolveFactoryKey y sidecars (O2) — decisión vinculante v1

**Hecho baseline:** `FactoryRegistry.resolveFactoryKey` elimina el provisional con `fs.unlinkSync(oldPath)` **solo** sobre el path JSON de `store.resolvePath`.

**Problema:** con Atomic, quedarían sidecar / temps / bak del `factory_key` provisional.

**Solución vinculante v1 (mínima, sin cambiar semántica constitucional de `resolveFactoryKey`):**

1. **Preferida:** método opcional del store `removeArtifacts(factoryKey)` (o equivalente) que elimina JSON + sidecar + auxiliares de esa key.  
2. **Alternativa aceptable:** cleanup explícito de sidecar/auxiliares **dentro del adapter** si Registry sigue haciendo solo `unlinkSync` del JSON — el adapter **MUST** exponer un hook invocable post-unlink **o** Registry invoca el método opcional tras el unlink.  
3. Exigencias:  
   - no sidecars del provisional;  
   - no backups/temporales huérfanos de esa key;  
   - aislamiento provisional → definitiva conservado;  
   - resultado funcional de `resolveFactoryKey` **sin cambio** (mismo record definitivo, misma ELR semantics).

### 22.2 Modificación mínima opcional de FactoryRegistry

| Archivo | ¿Necesaria? | Alcance permitido |
|---------|-------------|-------------------|
| `src/factory/cb01/factoryRegistry.js` | **MAY** (solo si se elige el método opcional del store) | Tras `unlinkSync` del JSON provisional (o en su lugar coordinado), invocar `if (typeof this.store.removeArtifacts === "function") this.store.removeArtifacts(provisionalKey)` (o API equivalente) |

Restricciones de esa modificación:

- **Expresamente identificada** como lifecycle de persistencia.  
- **Limitada a persistencia** (no ELR schema, no state machine).  
- **Backward-compatible** con `FileElrStore` (método ausente = no-op).  
- **Sin alterar** el resultado funcional de `resolveFactoryKey`.  
- **No** flip de default store.

Si el cleanup puede completarse **solo** en el adapter sin tocar Registry, esa vía es también válida; Status IMPL debe declarar cuál se eligió.

---

## 23. Fail-Closed Rules

1. Checksum mismatch → no data.  
2. JSON corrupto → no data.  
3. Versión de store desconocida → reject.  
4. Sidecar ausente con data presente → reject (v1).  
5. JSON nuevo + checksum viejo → reject.  
6. Promoción incompleta → ABORT/RECOVERY; no silent repair.  
7. Unknown ELR section → comportamiento constitucional existente.  
8. Create duplicado / `exists` sobre corrupto → fail Registry / no overwrite silencioso.  
9. SQLite/Supabase bajo color de este Plan → **forbidden architecture**.  
10. Lectura no debe “saltar” integridad.

---

## 24. Seguridad

| Tema | Regla |
|------|-------|
| Path traversal | Sanitización de `factory_key` existente; no paths absolutos de caller |
| Secretos | ELR no es almacén de credenciales |
| Cloud | Prohibido |
| Multi-tenant cloud | Fuera de alcance |
| Observabilidad externa | No requerida |

---

## 25. Riesgos

| Riesgo | Severidad | Mitigación |
|--------|-----------|------------|
| Ampliar a todos los `data/factory-*` | Alta | Scope ELR only |
| Introducir SQLite “de paso” | Alta | Banner §0; suites estáticas |
| Cambiar `appendElrEntry` | Crítica | Prohibido |
| Tratar dos renames como atomicidad absoluta | Alta | §2.4 / §10–§11 (O1) |
| Sidecars huérfanos en key rename | Media | §22.1–§22.2 (O2) |
| Fsync/rename semantics en Windows | Media | Tests + documentar límites |
| Flip prematuro del default store | Media | O6: inyección only |
| Confundir Offline con cierre Master Plan P-INT-03 cloud | Media | §2.2 / §31 |
| `listFactoryKeys` enumerando auxiliares | Media | O5 + suites |
| Paridad `updatedAt`/pretty rota | Media | O4 + suite parity |

---

## 26. Archivos previstos

**Crear (tras P-INT-03-OFFLINE-IMPL auth — no ahora):**

```text
src/factory/cb01/elrStorePort.js
src/factory/cb01/atomicFileElrStore.js
src/factory/cb01/elrIntegrity.js          # optional helpers
src/runPInt03ElrPersistenceValidation.js
docs/.../FACTORY_INTEGRATION_P_INT_03_OFFLINE_IMPL_STATUS.md  # post-IMPL
```

**Modificar (mínimo):**

```text
src/factory/cb01/index.js                 # re-exports only
src/factory/cb01/factoryRegistry.js       # OPTIONAL — solo hook removeArtifacts (§22.2)
```

**No modificar:** `elrSchema.js` semántica; default store de Registry; Plan P-INT-02; Web; Supabase; `package.json`.

---

## 27. Plan secuencial de implementación

| Paso | Contenido | Autorización |
|------|-----------|--------------|
| **S0** | Este Plan (O1–O6) auditado + commit documental | Plan only |
| **S1** | Mandato **P-INT-03-OFFLINE-IMPL** | Director |
| **S2** | `ElrStorePort` + asserts + lifecycle opcional | IMPL |
| **S3** | `AtomicFileElrStore` PREPARE path (temp/fsync/checksum/bak) | IMPL |
| **S4** | COMMIT / ABORT / RECOVERY + fail-closed read | IMPL |
| **S5** | `storeFormatVersion` + O5 listing/exists rules | IMPL |
| **S6** | Hook Registry opcional §22.2 **o** cleanup adapter-only (O2) | IMPL |
| **S7** | Runner P-INT-03 + parity FileElrStore (O4) | IMPL |
| **S8** | Regresión CB-01 + CB-02 + P-INT-02 + CB-15 smoke (O3) | IMPL |
| **S9** | Audit estático + Status + commit | Director |
| **S10** | SQLite / Supabase ELR / default flip | **NOT AUTHORIZED** |

---

## 28. Suites de validación

Runner ilustrativo: `node src/runPInt03ElrPersistenceValidation.js`

**Casos mínimos obligatorios:**

1. `write` + `read` válido.  
2. Lectura por `factory_key`.  
3. Aislamiento entre expedientes.  
4. Orden determinista (secciones / secuencias).  
5. Duplicate create → fail.  
6. Parity `FileElrStore` ↔ `AtomicFileElrStore` (incluye `updatedAt` shape / pretty / newline — O4).  
7. Restart / reopen.  
8. Partial write / promoción incompleta → restore o fail-closed (O1).  
9. Checksum mismatch → fail-closed.  
10. JSON corrupto → fail-closed.  
11. `storeFormatVersion` desconocida → reject.  
12. Unknown ELR section → throw constitucional existente.  
13. `elrSequence` sin cambio de semántica (append order preserved).  
14. Regresión CB-01 (`validateCb01` / runner canónico).  
15. Regresión CB-02 (`runCb02DsoValidation.js`).  
16. Regresión P-INT-02 Offline (`runPInt02OfflineIngestValidation.js`).  
17. Auditoría estática: sin `supabase`, sin clients `http`/`https`, sin URLs cloud, sin `sqlite`, sin deps nuevas.  
18. **Smoke CB-15 (O3):** camino que registra actos ELR vía `FactoryRegistry` + Atomic inyectado; `registerElrAct` contrato y orden ELR sin cambio.  
19. **O5 — `listFactoryKeys`:** ignora `.sha256` / `.tmp` / `.bak` / recovery.  
20. **O5 — `exists` vs `read`:** corrupto → `exists` true, `read` fail-closed, create no sobrescribe.  
21. **O2 — key rename:** provisional → definitiva sin sidecar/temps/bak huérfanos del provisional.  
22. **O1 — replace recovery:** fallo mid-promote restaura par íntegro o deja fail-closed; nunca JSON nuevo + checksum viejo aceptado.

---

## 29. Criterios de aprobación

### 29.1 Este Plan documental

1. Declara Atomic/Hardened File ELR Store como tecnología v1.  
2. Declara SQLite DEFERRED / NOT AUTHORIZED.  
3. Prohíbe cambios semánticos ELR/Registry (salvo hook opcional §22.2).  
4. Separa planos A–E.  
5. Define port, protocolo PREPARE/COMMIT/ABORT/RECOVERY, integrity, versioning, fail-closed, suites.  
6. Cierra O1–O6 documentalmente.  
7. No autoriza código por sí mismo.  
8. No cierra Master Plan P-INT-03 cloud/Supabase.  
9. Default store permanece FileElrStore (O6).

### 29.2 Futuro P-INT-03-OFFLINE-IMPL

1. Suites §28 PASS (incl. 18–22).  
2. Regresiones CB-01 / CB-02 / P-INT-02 / CB-15 smoke PASS.  
3. `FileElrStore` sigue siendo default + baseline.  
4. Atomic solo por inyección.  
5. Status declara Live/Supabase/SQLite aún NOT AUTHORIZED.  
6. Diff sin `package.json` dependency adds.  
7. Protocolo O1 y cleanup O2 documentados en Status como implementados.

---

## 30. Restricciones

### 30.1 Absolutas

- **NO Web / Supabase / RLS / migraciones cloud / tablas producto.**  
- **NO APIs / Auth / Storage cloud / Edge / Delivery / despliegues.**  
- **NO II.7.**  
- **NO SQLite / nuevas dependencias.**  
- **NO** ampliar a otros `data/factory-*` stores.  
- **NO** cambiar semántica `elrSchema` / `appendElrEntry` / `elrSequence`.  
- **NO** flip global del default store en esta fase.

### 30.2 De proceso

1. Este documento **no** autoriza IMPL.  
2. IMPL requiere mandato **P-INT-03-OFFLINE-IMPL**.  
3. No abrir P-INT-01/04+ ni II.7 bajo color de este Plan.  
4. No push/deploy como parte del Plan.  
5. Tras correcciones O1–O6: commit documental requiere orden Director separado.

---

## 31. Documentary Status

| Ítem | Estado |
|------|--------|
| Master Plan P-INT-03 (pipeline name) | Documented — cloud/DB options **not** implemented |
| P-INT-03 Offline Implementation Plan (this file) | **UPDATED — O1–O6 CLOSED — PLAN ONLY** |
| P-INT-03-OFFLINE-IMPL | **NOT AUTHORIZED** |
| SQLite | **DEFERRED / NOT AUTHORIZED** |
| Supabase ELR | **NOT AUTHORIZED** |
| Default store flip to Atomic | **NOT AUTHORIZED** |
| Code / runners from this act | **NOT CREATED** |
| II.7 | **NOT OPENED** |

**Cláusula Master Plan:**  
P-INT-03 Offline Preparation **no** cierra la fila oficial P-INT-03 del Factory Integration Master Plan respecto a object store / DB dedicada cloud. Esas vías permanecen **OPEN / NOT IMPLEMENTED / NOT AUTHORIZED**.

---

## 32. Final Clause

This Plan authorizes **only** the existence of an audited planning document for **P-INT-03 Offline / Local Durable Preparation (Atomic / Hardened File ELR Store)**, including documentary closure of audit observations **O1–O6**.

It does **not** authorize writing adapters, runners, flipping Registry defaults, adding SQLite, connecting Supabase, or modifying Factory constitutional ELR semantics until a separate Director implementation mandate is issued.

Until that mandate, ELR remains on baseline `FileElrStore` default behavior; durability gaps (non-atomic writes, no checksums) remain known and documented. Atomic durability is specified here for a future injected adapter only.

---

## Appendix A — Autoauditoría O1–O6

| Observación | Estado |
|-------------|--------|
| O1 Dual-rename / commit boundary / Abort | **CLOSED** |
| O2 resolveFactoryKey / sidecars | **CLOSED** |
| O3 Regresión CB-15 | **CLOSED** |
| O4 Paridad side effects | **CLOSED** |
| O5 listFactoryKeys / exists / artefactos | **CLOSED** |
| O6 Default store | **CLOSED** |

---

**END OF DOCUMENT**

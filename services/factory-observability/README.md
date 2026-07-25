# Factory Observability Edge — Block I.1

## Objetivo

Borde Node **read-only** de observabilidad Factory 2.0: lectura sanitizada de Registry/ELR, gobernanza CB-18 y lineage FFO resumido.

## Arquitectura

```text
services/factory-observability/  →  CB-01/15/18 (read APIs only)  →  JSON stdout
Vite / React / Supabase / Marketplace  →  NO conectados
src/factory/cb00…cb19               →  INMUTABLES (no se modifican)
```

Este directorio **no** forma parte del canon Factory CB-00…CB-19.

## Dependencias permitidas

- Node built-ins (`fs`, `path`)
- Lecturas allowlisted:
  - CB-00 `loadPhaseStatus` / `CONSTRUCTION_PHASES` / `getPhaseRecord`
  - CB-01 `FactoryRegistry.getExpediente` + `FileElrStore` (solo `read` / path)
  - CB-15 `aggregateElr`
  - CB-18 paneles puros + `detectCanonDrift` + `buildConstitutionalMetrics`

## Operaciones prohibidas

- `ensureDirs` / `write` / `listFactoryKeys` (mkdir)
- `createExpediente` / `transitionState` / `registerElrAct`
- `orchestrateExpediente` / Decision Handoff / CB-17 lifecycle
- Motores, loops, swarms, AIA
- HTTP server / puertos
- Imports desde React, Supabase, dealPipeline
- Modificar `package.json`, Web, Supabase o `src/factory/**`

## Ejecución manual

```bash
node services/factory-observability/runFactoryObservability.js
```

No requiere cambios en `package.json`.

## Contrato de salida

JSON con `mode: "READ_ONLY"`, `schemaVersion`, `factory`, `elrHealth`, `expedientes[]` (resumen), `governance`, `lineage.eventKinds`, `warnings`.

Empty-state (sin `data/factory-registry` o cero expedientes) es **válido** (`empty: true`, exit 0).

## Rollback

Eliminar únicamente la carpeta `services/factory-observability/`.

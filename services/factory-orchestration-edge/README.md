# Factory Orchestration Edge (P-INT-01 Slice B)

**Environment:** STAGING ONLY  
**Mandate:** `P-INT-01-SLICE-B-IMPL`  
**Current cut:** **B3 — HTTP Command Edge (STAGING)** (includes B1 + B2)

## Purpose

Admin/Ops **command** Control Plane sibling to `factory-service-edge` (Slice A **READ_ONLY**).

Contract id: `factory.service_edge.command`  
**MUST NOT** reuse `factory.service_edge.read` for mutations.

## Delivered

### B1 — Contracts
Envelope, job schema/states, capabilities, HTTP route specs, idempotency, cancel, boundary constants, validation, errors.

### B2 — Job Store + Runner Core
InMemory/File store, JobRunnerCore, stub executor, CB-15 boundary adapter.

### B3 — HTTP Command Edge (staging)
- `POST /v1/factory/orchestration/jobs`
- `GET /v1/factory/orchestration/jobs/{jobId}`
- `POST /v1/factory/orchestration/jobs/{jobId}/cancel`
- `GET /v1/factory/orchestration/jobs/{jobId}/lineage`
- Bearer DEV AuthN/AuthZ (`FACTORY_OPS` / `FACTORY_DIRECTOR`), deny-by-default

## Not in B3

Admin UI / FCC / Web pública / Marketplace / Product / Supabase / II.7 / cloud ELR / CB-15 `orchestrateExpediente` / B4 Status suite completa.

## Absolute prohibitions

- **MUST NOT modify** `services/factory-service-edge/**`
- **MUST NOT modify** `src/factory/cb00`…`cb19/**` (consume public exports only)
- NO imports from Slice A `factory-service-edge`
- NO Marketplace / Product / Supabase / II.7

# Factory Orchestration Edge (P-INT-01 Slice B)

**Environment:** STAGING ONLY  
**Mandate:** `P-INT-01-SLICE-B-IMPL`  
**Current cut:** **B4 COMPLETE — Slice B staging integration** (B1 + B2 + B3 + B4)

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

### B4 — Staging integration + validation
- E2E: `node src/runPInt01SliceB4Validation.js`
- Smoke: `node src/runPInt01SliceBSmoke.js`
- Status: `docs/factory-construction/integration/FACTORY_INTEGRATION_P_INT_01_SLICE_B_IMPL_STATUS.md`

## Not delivered

Admin UI / FCC / Web pública / Marketplace / Product / Supabase / II.7 / cloud ELR / CB-15 `orchestrateExpediente` / production Auth.

## Absolute prohibitions

- **MUST NOT modify** `services/factory-service-edge/**`
- **MUST NOT modify** `src/factory/cb00`…`cb19/**` (consume public exports only)
- NO imports from Slice A `factory-service-edge`
- NO Marketplace / Product / Supabase / II.7

## Import note (OBS-B3-05)

Importing `httpAdapter.js` does **not** start a listener. Call `startOrchestrationCommandHttpServer` or `listen` explicitly.

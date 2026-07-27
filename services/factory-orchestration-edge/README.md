# Factory Orchestration Edge (P-INT-01 Slice B)

**Environment:** STAGING ONLY  
**Mandate:** `P-INT-01-SLICE-B-IMPL`  
**Current cut:** **B2 — Job Store + Job Runner Core** (includes B1 contracts)

## Purpose

Admin/Ops **command** Control Plane sibling to `factory-service-edge` (Slice A **READ_ONLY**).

Contract id: `factory.service_edge.command`  
**MUST NOT** reuse `factory.service_edge.read` for mutations.

## Delivered

### B1 — Contracts
Envelope, job schema/states, capabilities, HTTP route specs (definitions only), idempotency, cancel, boundary constants, validation, errors.

### B2 — Job Store + Runner Core
- `InMemoryJobStore` / `FileJobStore` (staging)
- `JobRunnerCore` (enqueue, claim, async execute, checkpoint, timeout, cancel)
- Stub executor (no `orchestrateExpediente` yet)
- Live CB-15 **boundary** via public API (`assertFactoryBoundary` / `isBlockedFactoryOperation`)

## Not in B2

HTTP server, AuthN/AuthZ runtime, lineage/HTTP endpoints, Admin UI/FCC, CB-15 orchestrate execution, cloud ELR.

## Absolute prohibitions

- **MUST NOT modify** `services/factory-service-edge/**`
- **MUST NOT modify** `src/factory/cb00`…`cb19/**` (consume public exports only)
- NO Marketplace / Product / Supabase / II.7
- NO imports from Slice A `factory-service-edge`

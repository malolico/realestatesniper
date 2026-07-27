# Factory Orchestration Edge (P-INT-01 Slice B)

**Environment:** STAGING ONLY  
**Mandate:** `P-INT-01-SLICE-B-IMPL`  
**Current cut:** **B1 — Orchestration Contracts**

## Purpose

Admin/Ops **command** Control Plane sibling to `factory-service-edge` (Slice A **READ_ONLY**).

Contract id: `factory.service_edge.command`  
**MUST NOT** reuse `factory.service_edge.read` for mutations.

## B1 scope (this commit)

Contracts only:

- Command envelope
- Job schema / states
- Capabilities + HTTP route specs
- Idempotency / cancel / boundary / validation contracts
- Error catalog

## Not in B1

Worker, runtime, queues, handlers, endpoints, adapters, persistence, CB integration, business logic.

## Absolute prohibitions

- **MUST NOT modify** `services/factory-service-edge/**`
- **MUST NOT modify** `src/factory/cb00`…`cb19/**`
- NO Marketplace / Product / Supabase / II.7

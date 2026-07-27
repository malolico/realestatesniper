# P-INT-09 — DealPipeline Frontier Declaration

## RealEstateSniper Factory 2.0

| Campo | Valor |
|-------|-------|
| **Document ID** | `FACTORY_INTEGRATION_P_INT_09_DEALPIPELINE_FRONTIER.md` |
| **Block** | P-INT-09 — DealPipeline Reconciliation |
| **Master Plan** | Fase I ítem 3 |
| **Plan** | `FACTORY_INTEGRATION_P_INT_09_DEALPIPELINE_RECONCILIATION_IMPLEMENTATION_PLAN.md` |
| **Nature** | Documentary frontier declaration — **does not authorize** scoring changes, Factory/Edge/Web/Supabase/Product/Marketplace mutation, or Fase IV retirement |

---

## Binding frontier

`dealPipeline` (`src/lib/dealPipeline.js` and associated preview/mapper/CLI surfaces) is:

- **non-canon**
- **provisional**
- **pre-Factory**

### Explicit non-substitutions

| Claim | Status |
|-------|--------|
| Canon Factory (CB-00→CB-19) | **NOT substituted** by `dealPipeline` |
| ELR / Factory Registry | **NOT substituted** by `dealPipeline` or product `deals` rows |
| `maturity_score` / CB-18 governance metrics | **NOT substituted** by heuristic pipeline scores |

### Scoring

P-INT-09 **does not** change the scoring algorithm, `SCORE_WEIGHTS`, formulas, or signals. Labeling only.

### Deferred work

Full **retirement or isolation** of the heuristic runtime remains **Master Plan Fase IV ítem 13** — **NOT** performed by P-INT-09.

---

## Labeled surfaces (Fase I)

- `src/lib/dealPipeline.js`
- `src/lib/pipelinePreview.js`
- `src/lib/mapPipelineDealToSupabase.js`
- `src/runPipelinePreview.js`
- `src/runPipelineSupabasePayload.js`
- `src/runPipelineInsertSupabase.js`

---

**END OF FRONTIER DECLARATION**

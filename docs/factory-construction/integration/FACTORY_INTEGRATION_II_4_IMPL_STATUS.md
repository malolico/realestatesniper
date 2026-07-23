# II.4-IMPL — Status / Handoff Note

**Block:** II.4-IMPL — Publication Unit Governance  
**Scope closed by this implementation:** Formation / refusal of a **Publication Unit** after II.3 eligibility  
**Delivery / Auth / Edge / Producer operativo / II.5+:** NOT AUTHORIZED  

## Scope implemented

- Deterministic outcomes: `UNIT_FORMED` | `UNIT_NOT_FORMED` | `UNIT_REJECTED`
- Sole oracle path: `evaluatePublicationEligibility` (II.3); no parallel II.2 gate
- Identity binding via existing `snapshotId`
- Integrity metadata binding (existing checksum fields)
- Complete snapshot bound by reference (no partial reconstruction)
- Frozen governance outcome and frozen `publicationUnit` when formed
- Always `delivery: NOT_AUTHORIZED`, `sideEffects: []`

## Files created

```text
src/integration/publicationUnit/constants.js
src/integration/publicationUnit/reasons.js
src/integration/publicationUnit/atomicity.js
src/integration/publicationUnit/index.js
src/integration/publicationUnit/fixtures.js
src/integration/publicationUnit/tests/runIi4PublicationUnitValidation.js
docs/factory-construction/integration/FACTORY_INTEGRATION_II_4_IMPL_STATUS.md
```

## Dependencies consumed

- `src/integration/publicationEligibility` → `evaluatePublicationEligibility`, `ELIGIBLE` / `NOT_ELIGIBLE`
- II.2 only **indirectly** through II.3 (no `validateReadModelV2` import in `publicationUnit/**`)
- Fixtures reused via `publicationEligibility/fixtures` (+ synthetic UNIT_REJECTED fixtures)

## Design decisions

1. Sibling module area `publicationUnit/**` (does not modify `readModel/**` or `publicationEligibility/**`).
2. Test-only seam: `options.evaluatePublicationEligibility` (production uses official II.3 entry).
3. Outcome freeze is **MUST**.
4. Candidate is never mutated; unit binds the same snapshot object reference when formed.

## UNIT_NOT_FORMED vs UNIT_REJECTED

| Status | Rule |
|--------|------|
| **UNIT_NOT_FORMED** | II.3 did not return `ELIGIBLE`, or II.3 evaluation threw / returned unusable result (process incomplete). |
| **UNIT_REJECTED** | II.3 returned `ELIGIBLE`, but II.4 binding failed (missing `snapshotId`, missing/invalid integrity, or non-atomic binding shape). |
| **UNIT_FORMED** | II.3 `ELIGIBLE` and II.4 binding conditions all hold. |

## Validation results

- II.2: **31/31 PASS**
- II.3: **16/16 PASS**
- II.4: **19/19 PASS**

## Restrictions maintained

- Factory untouched
- `readModel/**` untouched
- `publicationEligibility/**` untouched
- No I/O, persistence, transport, Delivery, Auth, Edge, Supabase, React, operational Producer

## Residual risks

- Callers may confuse `UNIT_FORMED` with delivered/persisted (mitigated by `delivery` / `sideEffects` and docs).
- Test injection seam must not be used in production paths.
- Holding a live `snapshot` reference means later external mutation of the candidate would be visible through the unit; II.4 forbids mutating the candidate.

## Status

- **II.4-IMPL:** IMPLEMENTED — PENDING INDEPENDENT AUDIT  
- **Delivery:** NOT_AUTHORIZED  
- **Producer operativo:** NOT_AUTHORIZED  
- **II.5+:** NOT_AUTHORIZED  
- **Commit status:** PENDING  

## Separation

`UNIT_FORMED` ≠ published ≠ persisted ≠ delivered ≠ authenticated ≠ exposed.

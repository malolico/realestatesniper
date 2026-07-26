# FACTORY INTEGRATION P-INT-03 — OFFLINE IMPL STATUS

## Status

**COMPLETE — INDEPENDENT AUDIT PASS WITH OBSERVATIONS**

**Live / Supabase / cloud ELR Persistence Bridge:**  
**NOT AUTHORIZED / NOT IMPLEMENTED / OPEN** (Master Plan P-INT-03 cloud/DB row **not** closed by this offline slice).

**SQLite:** **DEFERRED / NOT AUTHORIZED / NOT PRESENT**

## Authorization

Director authorization: **P-INT-03-OFFLINE-IMPL**  
Normative plan: `docs/factory-construction/integration/FACTORY_INTEGRATION_P_INT_03_OFFLINE_IMPLEMENTATION_PLAN.md`  
Plan documentary commit: `37da1ae04c22db7d1e06bccf3424623bc2a2e279`  
Independent audit: **P-INT-03-OFFLINE-IMPL Independent Audit** (this closure).

## Scope implemented

Offline / local durable preparation only:

- `ElrStorePort` duck-type contract (+ optional `removeArtifacts`)
- `FileElrStore` retained as **default** / parity baseline
- `AtomicFileElrStore` — **injection only**
- PREPARE / COMMIT / ABORT / explicit `recoverFromBackup`
- SHA-256 sidecar + `storeFormatVersion` (outside constitutional ELR)
- Validation runner `src/runPInt03ElrPersistenceValidation.js`
- Minimal Registry hook for optional store lifecycle

**Not implemented:** SQLite, Supabase ELR, Web, Auth, Storage cloud, Edge, Delivery, II.7, P-INT-04, other `data/factory-*` stores, SourceIngestionLedger redesign, global default flip.

## Files

### Created

```text
src/factory/cb01/elrStorePort.js
src/factory/cb01/elrIntegrity.js
src/factory/cb01/atomicFileElrStore.js
src/runPInt03ElrPersistenceValidation.js
```

### Modified

```text
src/factory/cb01/index.js            # re-exports only
src/factory/cb01/factoryRegistry.js  # optional removeArtifacts after provisional unlink
```

### Not modified

Implementation Plan; `elrSchema.js`; state machine; CB-02/CB-15 bodies (smoke only via Registry); P-INT-02; Web; Supabase; `package.json` / lockfile; II.7.

## Architecture (verified)

```text
ElrStorePort
  ├── FileElrStore          ← FactoryRegistry DEFAULT
  └── AtomicFileElrStore    ← explicit injection only
        │
        └── FactoryRegistry({ store })
              ├── CB-01 lifecycle / ELR acts
              ├── CB-02 ingest acts (regression)
              └── CB-15 registerElrAct smoke
```

**Unit of integrity:** pair `(canonical JSON, sidecar .sha256)` per `factory_key`.

**Honest guarantee:** logical expediente atomicity + pair integrity + deterministic recovery + fail-closed — **not** absolute multi-file filesystem atomicity.

## Protocol PREPARE / COMMIT / ABORT / RECOVERY

| Phase | Implementation |
|-------|----------------|
| **PREPARE** | Write `.json.tmp` → fsync → hash **exact tmp bytes** → write `.json.sha256.tmp` → fsync → if prior intact pair, copy to `.bak` / `.bak.sha256` |
| **COMMIT** | Unlink old sidecar first → `rename` tmp→canonical JSON → `rename` sidecar tmp→sidecar → verify pair → then delete temps/bak |
| **ABORT** | On promote/verify failure: restore from bak if intact; else remove invalid partial pair (fail-closed) |
| **RECOVERY** | Explicit `recoverFromBackup(factoryKey)` only — **not** called from `read` |

Promotion order ensures `read` never accepts **new JSON + old checksum**.

## Integrity

- Checksum: SHA-256 over exact persisted JSON bytes
- Sidecar JSON: `{ storeFormatVersion, algorithm, sha256 }` (no circular embed)
- `read`: verify before return; corrupt / mismatch / unknown version → throw
- No silent repair on `read`

## Parity with FileElrStore

Observable parity verified: `updatedAt`, pretty `JSON.stringify(..., null, 2)`, trailing `\n`, shape/ELR order/`elrSequence`, `exists`/`resolvePath`/`listFactoryKeys` contract, duplicate create, unknown section throw.

Legitimate differences: sidecar + fail-closed integrity on Atomic `read`; Atomic activated only by injection.

## Lifecycle `removeArtifacts`

- Implemented on `AtomicFileElrStore`
- Registry calls it **only if** `typeof store.removeArtifacts === "function"` after provisional JSON unlink
- Backward-compatible with `FileElrStore` (absent = no-op)
- Does not change functional result of provisional → definitive
- Suite 16 confirms no provisional sidecar/tmp/bak leftovers

## Suites (re-executed at audit)

| Suite | Result |
|-------|--------|
| `node src/runPInt03ElrPersistenceValidation.js` | **23/23 PASS** |
| `node src/runCb01RegistryValidation.js` | **PASS** |
| `node src/runCb02DsoValidation.js` | **PASS** |
| `node src/runPInt02OfflineIngestValidation.js` | **19/19 PASS** (+ CB-02 embedded PASS) |

Coverage in P-INT-03 runner (asserted): write/read, factory_key, isolation, order, duplicate create, parity, reopen, partial inconsistent pair, checksum mismatch, corrupt JSON, unknown `storeFormatVersion`, unknown ELR section, `elrSequence`, aux filtering, corrupt blocks create, key rename cleanup, explicit recovery, CB-15 smoke, default=FileElrStore, static audit, CB-01/02/P-INT-02 regressions.

## Static audit

Store modules (`atomicFileElrStore`, `elrIntegrity`, `elrStorePort`): no supabase/sqlite/http clients/URLs/credentials.

Runner: `spawnSync` used **only** to invoke P-INT-02 offline regression subprocess (harness), not by the store.

`package.json` / lockfile: **unchanged**; no new dependencies.

## Observations (non-blocking)

| ID | Severity | Note |
|----|----------|------|
| O-PINT03-01 | Medium | Suite 08 simulates inconsistent disk state; does not inject mid-`write()` failures to exercise `#abortAfterFailedPromote` under live exceptions |
| O-PINT03-02 | Low | No directory fsync after rename; power-loss durability is best-effort (Plan disclaims absolute multi-file FS atomicity). Node v24 win32 rename-overwrite empirically OK |
| O-PINT03-03 | Low | `recoverFromBackup` data/sidecar copy window; crash mid-recover → fail-closed until re-run (bak retained until verified) |
| O-PINT03-04 | Low | Runner `child_process.spawnSync` for P-INT-02 only |
| O-PINT03-05 | Low | `listFactoryKeys` order is FS `readdir` order (same as baseline FileElrStore; not explicitly sorted) |

## Exclusions

SQLite; Supabase/cloud ELR; Web; RLS; migrations; product/`deals`; APIs; Auth; Storage cloud; Edge; Delivery; deployments; II.7; P-INT-04; SourceIngestionLedger redesign; other factory stores; default store flip.

## Git state (at audit)

| Item | Value |
|------|-------|
| Branch | `integration/factory-complete-20260725` |
| HEAD | `37da1ae04c22db7d1e06bccf3424623bc2a2e279` (Plan documentary commit) |
| Implementation | **uncommitted** (created/modified files listed above) |
| Plan file | **unchanged** |
| Residuals (excluded) | `ersMalolico…`, `estructura_repo.txt` |

## Confirmations

- **sin commit** (impl still working tree)
- **sin push**
- **sin SQLite**
- **sin dependencias nuevas**
- **sin superficies prohibidas**
- **FileElrStore** sigue siendo default
- **AtomicFileElrStore** solo por inyección explícita
- **Live / Supabase ELR** sigue **NOT AUTHORIZED**

## Verdict

**PASS WITH OBSERVATIONS**

## Recommendation

**READY FOR COMMIT** (implementation + this Status), subject to Director commit order. Do **not** push unless separately authorized.

---

**END OF STATUS**

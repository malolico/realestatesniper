# FACTORY GIT HARDENING — PHASE B
## OFFICIAL IMPLEMENTATION PLAN (DOCUMENTARY ONLY)
### Corrected after Independent Plan Audit FAIL — Correction Pass B.1-B

| Campo | Valor |
|-------|--------|
| **Document ID** | `FACTORY_GIT_HARDENING_PHASE_B_OFFICIAL_IMPLEMENTATION_PLAN.md` |
| **Path** | `docs/factory-construction/FACTORY_GIT_HARDENING_PHASE_B_OFFICIAL_IMPLEMENTATION_PLAN.md` |
| **Nature** | **PLAN ONLY** · organiza implementación futura · **no implementa** · **no activa hooks** · **no modifica Git config** · **no ejecuta `git add .`** · **no commit** · **no push** |
| **Program** | RealEstateSniper Factory 2.0 — Factory Git Hardening |
| **Phase** | **B.1 — Official Implementation Plan (CORRECTED)** |
| **Parent Discovery** | Factory Git Hardening Phase B.0 Official Discovery — **PASS WITH OBSERVATIONS** |
| **Independent Plan Audit** | **FAIL** (0 CRITICAL · 10 MAJOR · 5 MINOR) — Mandate blocked until this Correction Pass closes findings |
| **Previous Plan Hash (audited)** | `442D4B9B6388ABA55F0F3269F444BDCF2494B60B1DBE919EF2FF5D49BA899D1E` |
| **Date** | **2026-07-31** |
| **Repo** | `C:\Users\Malolico\realestatesniper` |
| **Branch (baseline)** | `integration/factory-complete-20260725` |
| **HEAD (baseline)** | `c2c5f7f3b56b750e9bf44b2620baf7be059c658d` |
| **This document creates code / hooks / .gitignore / .gitattributes** | **NO** |

---

## 0. Absolute non-authorization banner

```text
FACTORY GIT HARDENING PHASE B — OFFICIAL IMPLEMENTATION PLAN (CORRECTED)
= DOCUMENTARY ORGANIZATION OF FUTURE HARDENING ONLY
≠ IMPLEMENTATION
≠ .GITIGNORE / .GITATTRIBUTES / GUARD / HOOK / INSTALLER / VERIFIER CREATION BY THIS FILE
≠ core.hooksPath CHANGE
≠ git add . ON OFFICIAL REPO
≠ git restore (ANY VARIANT) — ABSOLUTELY PROHIBITED IN PHASE B
≠ git reset / git clean / rebase / force push
≠ package.json MODIFICATION (EXCLUDED FROM SCOPE)
≠ SP01 COMPLETE / IB-10 / FACTORY FUNCTIONAL CHANGE
≠ SUPABASE / WEB / ARIZONA / MARKETPLACE
≠ COMMIT / PUSH / MANDATE BY THIS DOCUMENT
```

---

## 1. Identity

| Campo | Valor |
|-------|--------|
| **Official title** | Factory Git Hardening — Phase B — Official Implementation Plan (Corrected) |
| **Authority** | Director order — Fase B.1 Plan Correction Pass |
| **Gate** | **B1-B — Plan Correction and Closure** |
| **Next gate (not opened)** | Independent Correction Verification Audit → then GATE B2 Mandate only if closed |

---

## 2. Context

Post–SP01-IB-09 corrective commit `c2c5f7f` untracked 321 contaminating paths without deleting disk files. Discovery B.0 confirmed baseline (branch/HEAD sync; tracked clean; 14/14 legitimates; 6/6 dso-packs; 462 physical runtime files; no technical protection). Independent Plan Audit **FAIL** blocked Mandate until MAJOR/MINOR closure. This Correction Pass **does not** re-run Discovery or Audit and **does not** implement.

---

## 3. Discovery / Audit baseline (frozen)

| Item | Value |
|------|--------|
| Discovery | **PASS WITH OBSERVATIONS** |
| Independent Plan Audit | **FAIL** — Plan corregible; Mandate no autorizado hasta cierre |
| Architecture preserved | Defense-in-depth: `.gitignore` + Node guard + versioned `.githooks` + local `core.hooksPath` + installer/verifier + ops protocol |
| Absolute Phase B bans | `git restore` (any); `git add .` on official; Husky; lint-staged; new deps; global Git config; history rewrite |

---

## 4. Objective

Prepare the exact, minimal, reversible, auditable Implementation Plan so Mandate-authorized work can implement defense-in-depth preventing accidental republication of:

1. nine runtime stores under `data/factory-*` (directory-level; current + future files);
2. `/estructura_repo.txt`;
3. root anomalous artifact `/ersMalolicorealestatesniper*` (incl. U+F03E / UTF-8 `EF 80 BE`).

Must satisfy: prevent normal `git add .`; detect forbidden staged paths; block contaminated commits; protect `factory-dso-packs`; never `/data/` global; never delete physical files; never modify Factory functional code; protect Manolo **and** Carlos; Windows-compatible; no new deps; reversible; no history rewrite; no destructive tests on official repo; document deliberate bypasses; **Manolo hook active before publication commit**.

---

## 5. Scope (in) / Out of scope

**In:** `.gitignore` rules; `.gitattributes` (LF for hooks); guard; `.githooks/pre-commit`; installer; verifier; ops protocol; TEMP isolated tests; Manolo/Carlos local activation; corrective rollback.

**Out:** Factory CB/FOE; Supabase/Web/Arizona/Marketplace/Roadmap; deleting runtime; ignoring dso-packs; `package.json` changes; `git restore`/`reset`/`clean`/rebase/force push; official `git add .`; Husky/lint-staged/new deps; global config; ImpL/Mandate/Commit/Push by this document.

---

## 6. Threats

**Covered:** accidental `git add .` of denylist; forced/mistaken staging (guard+hook); commit without denylist review; single-operator-only shared rules; runtime growth.

**Not covered (deliberate):** `git add -f`; `git commit --no-verify`; machine without local activation; malicious guard edit; unsynced clone.

**False security statement (mandatory in ops):** ignore+hook do **not** provide absolute protection; staged-diff review remains mandatory.

---

## 7. Architecture

```text
LAYER 1  PREVENTIVE SHARED     .gitignore path-specific
LAYER 2  DETECTIVE SHARED      scripts/git/guardStagedForbiddenPaths.js
LAYER 3  BLOCKING SHARED       .githooks/pre-commit → guard
LAYER 3b LINE-ENDING SHARED    .gitattributes → .githooks/* eol=lf
LAYER 4  LOCAL ACTIVATION      git config --local core.hooksPath .githooks
LAYER 5  LOCAL VERIFY          scripts/git/verifyGitHardening.ps1
LAYER 6  (EXCLUDED)            package.json script — EXCLUDE
LAYER 7  OPERATIONAL           FACTORY_GIT_HARDENING_OPS_PROTOCOL.md
```

**Canonical invocation (no npm script):**

```powershell
node scripts/git/guardStagedForbiddenPaths.js
```

---

## 8. Absolute Phase B command bans

```text
PROHIBITED EVERYWHERE IN PHASE B:
  git restore
  git restore --staged
  any restore variant
  git reset
  git clean
  rebase
  force push
  history rewrite
  deleting physical runtime / dso-packs

PROHIBITED ON OFFICIAL REPO:
  git add .
```

---

## 9. Gate order (CLOSED — no contradiction)

```text
B1   — Documentary Plan
B1-A — Independent Plan Audit
B1-B — Plan Correction and Closure
B2   — Implementation Mandate
B2-A — Implementation
B2-B — Independent Implementation Audit
B3   — Local Activation Manolo
B4   — Exact Staging, Commit and Publication
B5   — Carlos Synchronization and Local Activation
B6   — Final Dual-Operator Closeout
```

### Operational sequence (mandatory)

1. Implement approved files in Working Tree (B2-A).  
2. Independent Implementation Audit (B2-B).  
3. Activate `.githooks` locally on **Manolo** (`core.hooksPath`) (B3).  
4. Manolo local verifier **PASS**.  
5. `git add --` exact authorized paths only.  
6. Run guard (`node scripts/git/guardStagedForbiddenPaths.js`).  
7. Review `git status --short` and `git diff --cached --name-status`.  
8. Commit (hook must already be active on Manolo).  
9. Normal push.  
10. Verify HEAD local = remote.  
11. Carlos syncs from official HEAD.  
12. Carlos activates local protection (B5).  
13. Carlos **PASS**.  
14. Closeout (B6).

**Rule:** Manolo’s hook **must be active before** the publication commit (B4). Carlos cannot fully close Phase B without PASS or mandatory STOP.

### Gate authorization texts

| Gate | Required text / meaning |
|------|-------------------------|
| B2 | `Aprobado. Ejecuta la implementación de Factory Git Hardening Fase B.` |
| B3 | `Aprobado. Activa la protección local de Manolo.` |
| B4 | `Aprobado. Publica Factory Git Hardening Fase B.` |
| B5 | Carlos local activation procedure before further Carlos work |

Ambiguous “do everything” orders are **not** authorized.

---

## 10. Capa 1 — `.gitignore` (exact rules)

Append **only** (never `/data/` global):

```gitignore
# Factory runtime stores — local generated artifacts
/data/factory-compliance/
/data/factory-distress/
/data/factory-economy/
/data/factory-environment/
/data/factory-evidence/
/data/factory-foundation/
/data/factory-intelligence/
/data/factory-legitimacy/
/data/factory-registry/

# Local repository inspection artifact
/estructura_repo.txt

# Anomalous local root artifact
/ersMalolicorealestatesniper*
```

Assertions: root-anchored; directory growth covered; `data/factory-dso-packs/` **not** ignored; equal Manolo/Carlos once published; does not untrack existing tracked files.

---

## 11. Capa 2 — Guard contract (CORRECTED)

| Campo | Valor |
|-------|--------|
| **Path** | `scripts/git/guardStagedForbiddenPaths.js` |
| **Action** | CREATE |
| **Runtime** | Node.js; **zero** new dependencies |
| **I/O** | stdout/stderr only; **no** disk writes; **no** staging mutation; **no** remediation commands |

### 11.1 Git data source (exact)

```text
git diff --cached --name-status -z --diff-filter=ACMRT
```

* **Includes:** A, C, M, R, T  
* **Excludes `D` from denylist blocking** — deletes do not introduce new runtime paths into the index; unexpected deletes are caught by staged-diff / scope review, not this denylist  
* **NUL-delimited only** — no line split; no space delimiter; no reliance on Git quoting

### 11.2 NUL parser (exact)

Tokens are successive NUL-terminated fields.

**Simple statuses (`A`, `M`, `T`):**

```text
A\0path\0
M\0path\0
T\0path\0
```

Consume: status token → one path.

**Rename / copy (`R<score>`, `C<score>`):**

```text
R<score>\0oldPath\0newPath\0
C<score>\0oldPath\0newPath\0
```

Consume: status token → oldPath → newPath. Inspect **both** sides.

**Fail-closed (exit `2`):** incomplete sequence; unknown status token; truncated stream; Git spawn failure; unreliable parse. **Do not guess.**

### 11.3 Path normalization (comparison only)

1. Keep **original** path string for operator display.  
2. For comparison only: replace `\` → `/`; strip a single leading `./` if present.  
3. Do not otherwise rewrite Unicode.

### 11.4 Case sensitivity

1. Read `git config --get core.ignorecase`.  
2. If `true` → compare using consistent case folding (ASCII/Unicode fold suitable for path segments).  
3. If `false` → exact comparison.  
4. If unreadable/unreliable on Windows → **fail-closed case-insensitive** comparison and document that policy in verifier output.  
5. Must block evasions such as `Data/factory-compliance/...` and `DATA/FACTORY-COMPLIANCE/...` when ignorecase is active.

### 11.5 Denylist / allowlist

**Block** (after normalize + case policy) if:

* path is under any of the nine runtime store prefixes;  
* path equals root `estructura_repo.txt`;  
* path is a **root** basename starting with `ersMalolicorealestatesniper` (Unicode-safe; prefer decoded basename and/or UTF-8 bytes ending with U+F03E when present).

**Never block** paths under `data/factory-dso-packs/`.

For R/C: block if **origin** or **destination** matches denylist; report **both** paths; no automatic fix.

### 11.6 Exit codes

| Code | Meaning |
|------|---------|
| `0` | No forbidden staged paths |
| `1` | Contamination detected |
| `2` | Technical / parse / Git / outside-repo / unreliable |

Exit `1` or `2` must block commit (via hook).

### 11.7 Contractual message (exact — no remediation commands)

```text
COMMIT BLOCKED — FORBIDDEN STAGED PATHS DETECTED

The staged index contains one or more paths protected by Factory Git Hardening.

Review the staged diff and follow:
docs/factory-construction/FACTORY_GIT_HARDENING_OPS_PROTOCOL.md

Do not delete physical files.
Do not use reset, restore or clean.
No automatic remediation has been performed.
```

Then list each affected path. Guard **must not** print `git rm --cached`, `git restore`, `git reset`, `git clean`, or any unstaging command.

---

## 12. Staged contamination protocol (ops — Cases A–D)

Documented in ops protocol; **never** emitted by the guard.

### CASE A — New untracked file staged by mistake

May evaluate `git rm --cached -- <exact-path>` **only if**:

* file was untracked before;  
* exact path confirmed;  
* no wildcards;  
* must remain on disk;  
* post-check physical presence;  
* specific operational authorization.

### CASE B — Tracked file modified

```text
STOP — SPECIFIC INDEX DIAGNOSIS REQUIRED
```

No generic recipe.

### CASE C — Rename or copy

```text
STOP — RENAME/COPY INDEX DIAGNOSIS REQUIRED
```

Review origin, destination, and Git status. No generic recipe.

### CASE D — Multiple paths or ambiguous index

```text
STOP — MULTI-PATH INDEX AUDIT REQUIRED
```

No bulk commands; no wildcards; no automatic cleanup.

---

## 13. Capa 3 — Hook contract

| Campo | Valor |
|-------|--------|
| **Path** | `.githooks/pre-commit` |
| **Action** | CREATE |

```sh
#!/bin/sh
# Factory Git Hardening — versioned pre-commit
ROOT="$(git rev-parse --show-toplevel)" || exit 2
cd "$ROOT" || exit 2
exec node scripts/git/guardStagedForbiddenPaths.js
```

Rules: fail if guard ≠ 0; no mutations; no heavy tests; no absolute machine paths; works from subdirs via `git rev-parse`.

Activation requires local `core.hooksPath=.githooks` (B3/B5).

---

## 14. Capa 3b — `.gitattributes` (CORRECTED — in scope)

| Campo | Valor |
|-------|--------|
| **Path** | `.gitattributes` |
| **Action** | CREATE |
| **Rule (only)** | |

```gitattributes
.githooks/* text eol=lf
```

Purpose: LF for versioned hooks; prevent CRLF-broken shebang on Git for Windows. **No** mass line-ending normalization elsewhere.

---

## 15. Capa 4 — Installer (CORRECTED)

| Campo | Valor |
|-------|--------|
| **Path** | `scripts/git/installGitHardening.ps1` |
| **Modes** | Default dry-run / `-WhatIf` (no config write); `-Apply` only with GATE B3/B5 |

### Pre-Apply checks

1. Repo identity: `git rev-parse --show-toplevel`; `remote.origin.url` exact expected; official branch; project markers — **must not** require Manolo’s absolute path (Carlos portable).  
2. If worktree / nonstandard git-dir detected → `BLOCKED — WORKTREE OR NONSTANDARD GIT DIR REQUIRES REVIEW`.  
3. Node available; guard + `.githooks/pre-commit` exist.  
4. **Inventory `.git/hooks`:** list entries; exclude only names ending in `.sample`; if **any** non-sample file/dir/unexpected element exists →  

```text
INSTALLATION BLOCKED — EXISTING LOCAL HOOKS DETECTED
```

   Do not activate `.githooks`; do not overwrite/copy/merge/delete existing hooks; require independent diagnosis. Same control for Manolo and Carlos.  
5. Read `core.hooksPath`: empty → may Apply; equals `.githooks` → idempotent PASS; any other → STOP (no overwrite).  
6. Show proposed change; require `-Apply`.  
7. `git config --local core.hooksPath .githooks` (**never** `--global`).  
8. Re-verify; run guard on clean index expect `0`; return PASS/FAIL.  
9. Must not: modify tracked files; commit; push; touch `.gitignore`; `git add`; restore; reset; clean.

`-Apply` must never be presented as READ ONLY.

---

## 16. Capa 5 — Verifier (READ ONLY, CORRECTED)

| Campo | Valor |
|-------|--------|
| **Path** | `scripts/git/verifyGitHardening.ps1` |

Checks (all READ ONLY): repo identity (root, origin URL, branch, markers — portable); worktree/nonstandard git-dir → BLOCKED; upstream; **local HEAD = remote HEAD**; ahead/behind `0/0`; tracked dirty; staged; `core.hooksPath`; hook+guard exist; Node; guard exit 0 on clean index; `.gitignore` rules; no `/data/` global; nine stores ignored; estructura ignored; anomalous ignored (root listing + `\uF03E`/bytes — not visual console form); dso-packs not ignored; 6/6 historical tracked; `.gitattributes` LF rule present after ImpL.

**HEAD policy:** do **not** eternally pin the first hardening SHA. Require branch + sync + hardening artifacts present; optionally accept `--expected-head <sha>` for a specific verification window.

Terminal:

```text
GIT HARDENING LOCAL STATUS:
PASS / FAIL / BLOCKED
```

---

## 17. Capa 6 — `package.json`

```text
PACKAGE.JSON SCRIPT: EXCLUDE
```

**Excluded from commit scope.** Canonical call: `node scripts/git/guardStagedForbiddenPaths.js`.

---

## 18. Capa 7 — Ops protocol

| Path | `docs/factory-construction/FACTORY_GIT_HARDENING_OPS_PROTOCOL.md` |
|------|------|
| Action | CREATE under B2 |

Must include: purpose; covered/uncovered threats; false-security statement; forbidden/allowed paths; Cases A–D; Manolo/Carlos; install; verify; safe commit; hook block handling; rollback order; deliberate bypasses; future escape hatch; evidence; GitHub sync duty.

### Mandatory normal procedure

```powershell
git branch --show-current
git rev-parse HEAD
git status --short
git add -- <paths exactos autorizados>
node scripts/git/guardStagedForbiddenPaths.js
git status --short
git diff --cached --name-status
```

Then compare staged vs authorized scope → commit → authorized validations → normal push → HEAD match → tracked clean.

**Forbidden as normal procedure:** `git add .` (even after ignore). **Forbidden as normal escape:** `git add -f`.

---

## 19. Validations — A. Official repository

Non-contaminating only. **Never** `git add .` on official. Include: branch/HEAD/sync; ignore rules; dso-packs allowed; 6/6 + 14/14 tracked; runtime physically present; guard clean → 0; hook versioned; `.gitattributes` present after ImpL; installer inventory behavior; verifier PASS after B3; no Factory/Supabase/Web/Arizona/Marketplace edits.

---

## 20. Validations — B. Temporary isolated repository (CORRECTED)

### Path

```text
$env:TEMP\realestatesniper-git-hardening-test-<timestamp>
```

### Before create

* Resolve absolute path;  
* Confirm under `$env:TEMP`;  
* Confirm exact prefix `realestatesniper-git-hardening-test-`;  
* Confirm not equal to `$env:TEMP` root;  
* Confirm not equal to / not inside official repo;  
* Display path.

### Contents / steps

1. Fresh `git init` (never copy official `.git`).  
2. Copy only fixtures: approved `.gitignore`, `.gitattributes`, guard, `.githooks/pre-commit`, nine store samples, `estructura_repo.txt`, anomalous name, dso-packs sample, legitimate file.  
3. **Anomalous name creation:**

```powershell
$anomalousName = "ersMalolicorealestatesniper$([char]0xF03E)"
```

or Node `"\uF03E"`.  
4. Local `core.hooksPath=.githooks` **inside TEMP only**.  
5. **Initial base commit** required to exercise modifications, renames, copies, and hook blocking reliably.  
6. Real `git add .` **only in TEMP** — assert forbidden not staged; legitimate staged; dso sample staged.  
7. Forced contamination via `git add -f` (TEMP only) → guard `1` → hook blocks commit.  
8. Do **not** run `git commit --no-verify` by default.  
9. No `git reset` / `git restore` / `git clean`.

### Safe delete (after validations)

Re-validate: absolute path; under TEMP; expected prefix; not TEMP root; not official; does not contain official path; test marker file created by the test harness exists. **Only then** delete the TEMP directory (OS delete of disposable folder).

---

## 21. Manolo / Carlos deployment

**Manolo (B3 before B4):** after B2-B PASS → installer dry-run → GATE B3 `-Apply` → verifier PASS → then B4 staging/commit/push with hook already active.

**Carlos (B5):** stop prior work → sync official HEAD only → local/remote match → activate hooksPath with same inventory guards → verifier PASS → evidence → **forbidden to continue** without PASS.

**Phase B full close (B6):** published hardening commit **and** Manolo PASS **and** (Carlos PASS **or** mandatory STOP for Carlos).

---

## 22. Rollback (CORRECTED ORDER)

### Local machines (before removing versioned hook from GitHub history tip)

1. Verify current `core.hooksPath`.  
2. If exactly `.githooks`, with authorization:

```powershell
git config --local --unset core.hooksPath
```

3. Verify empty.  
4. **Only then** allow corrective commit removing `.githooks/pre-commit`.  
5. Verify Git does not point at a missing hooks directory.

If `core.hooksPath` is any other value:

```text
ROLLBACK BLOCKED — CONFIGURATION MISMATCH
```

Do not auto-modify.

GitHub rollback of `.githooks` must follow deactivation on affected machines (or an equivalent sequence ensuring no machine remains pointing at a missing hook).

### Per-artifact corrective commits

| Artifact | Rollback |
|----------|----------|
| `.gitignore` | Remove only Hardening lines |
| `.gitattributes` | Remove file or only `.githooks/*` rule |
| Guard / installer / verifier / ops | Remove those files only |
| **Not in scope** | `package.json` (never modified by this hardening) |

**Forbidden:** reset; restore; clean; rebase; force push; delete runtime; remove dso-packs; rewrite history.

---

## 23. Future official artifacts under protected stores (ESCAPE HATCH)

Hardening is **not** constitutionally immutable. If a future Program must version official content inside one of the nine protected stores:

1. STOP  
2. Specific Director Mandate  
3. Discovery of new requirement  
4. Coordinated `.gitignore` change  
5. Coordinated guard denylist change  
6. Verifier update  
7. Protocol update  
8. Independent Audit  
9. Separate commit  
10. Publication  
11. Revalidation Manolo and Carlos  

**Forbidden as normal procedure:** `git add -f`.

---

## 24. Risks / deliberate bypasses

Documented: `-f`; `--no-verify`; skipped local activation; conflicting hooksPath (safe STOP); Unicode bugs (mitigated by contract); TEMP mis-aim (path guards); Case A misuse of `rm --cached` (protocol only); Carlos before B5 (STOP policy).

---

## 25. Implementation order (aligned with gates)

1. Pre-impl verification.  
2. READ ONLY snapshot.  
3. Modify `.gitignore`.  
4. Create `.gitattributes`.  
5. Create guard.  
6. Create `.githooks/pre-commit`.  
7. Create installer.  
8. Create verifier.  
9. Create ops protocol.  
10. Review exact diff (7 paths only).  
11. Syntax checks (no runtime generation).  
12. Validate ignore / gitattributes.  
13. Guard on clean index → 0.  
14. TEMP isolated tests.  
15. Official repo intact.  
16. Independent Implementation Audit (B2-B).  
17. **GATE B3** Manolo activation + PASS.  
18. Exact `git add --` paths.  
19. Guard.  
20. Staged diff review.  
21. Commit + push (**GATE B4**).  
22. HEAD verify; tracked clean.  
23. Carlos sync + **GATE B5** PASS.  
24. **B6** Closeout.

---

## 26. Commit scope (CORRECTED — exact 7 files)

| Path | Action | Include |
|------|--------|---------|
| `.gitignore` | MODIFY | YES |
| `.gitattributes` | CREATE | YES |
| `.githooks/pre-commit` | CREATE | YES |
| `scripts/git/guardStagedForbiddenPaths.js` | CREATE | YES |
| `scripts/git/installGitHardening.ps1` | CREATE | YES |
| `scripts/git/verifyGitHardening.ps1` | CREATE | YES |
| `docs/factory-construction/FACTORY_GIT_HARDENING_OPS_PROTOCOL.md` | CREATE | YES |

**EXCLUDE:** `package.json` and all other paths without new Director authorization.

---

## 27. Independent Correction / Plan Audit criteria

Correction Verification Audit must confirm: 10/10 MAJOR closed; 5/5 MINOR closed; gate order B3 before B4; parser ACMRT + R/C; case policy; fixed STOP message; Cases A–D; `.gitattributes` in scope; hook inventory; rollback unset-first; TEMP safe-delete + base commit + U+F03E method; escape hatch; package.json excluded; no ImpL executed by Plan authors in B.1.

---

## 28. Closure criteria for corrected Plan (B.1-B)

| Criterion | Required |
|-----------|----------|
| Plan file corrected at official path | YES |
| No ImpL artifacts created by this pass | YES |
| No `.gitignore` / `.gitattributes` / hooksPath / scripts created | YES |
| HEAD unchanged | YES |
| Ready for Correction Verification Audit | YES |

---

## 29. Decisions closed

* Gate order B1…B6 with **B3 before B4**.  
* Guard: `--diff-filter=ACMRT`; no `D` blocking; exact NUL parser; case policy; fixed message; no remediation commands.  
* Cases A–D.  
* `.gitattributes` CREATE in scope; `package.json` EXCLUDE.  
* Installer hook inventory ABORT.  
* Rollback unset-before-remove.  
* TEMP path guards + base commit + U+F03E + safe delete.  
* Future escape hatch Mandate process.

---

*End of Corrected Official Implementation Plan — documentary only. No Mandate. No ImpL.*

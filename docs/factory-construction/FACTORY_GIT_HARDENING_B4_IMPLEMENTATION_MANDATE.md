# FACTORY GIT HARDENING — PHASE B4
# OFFICIAL IMPLEMENTATION MANDATE

| Campo | Valor |
|-------|--------|
| **Document title** | Factory Git Hardening — Phase B4 Official Implementation Mandate |
| **Phase ID** | `B4` |
| **Mandate ID** | `FACTORY_GIT_HARDENING_B4_IMPLEMENTATION_MANDATE` |
| **Path** | `docs/factory-construction/FACTORY_GIT_HARDENING_B4_IMPLEMENTATION_MANDATE.md` |
| **Nature** | Normative · Executable · Fail-closed · Auditable · Single authority for B4 execution |
| **Parent Plan** | `FACTORY_GIT_HARDENING_PHASE_B4_OFFICIAL_IMPLEMENTATION_PLAN.md` |
| **Parent Phase B Plan** | `FACTORY_GIT_HARDENING_PHASE_B_OFFICIAL_IMPLEMENTATION_PLAN.md` |
| **Parent Phase B Plan SHA256** | `C49030D70EA88549EB473E911F23085A7C6DEE87D092F86F23CF85B3D0D4F82C` |
| **Ops Protocol** | `FACTORY_GIT_HARDENING_OPS_PROTOCOL.md` |
| **B3 Mandate** | `FACTORY_GIT_HARDENING_B3_MANOLO_LOCAL_ACTIVATION_MANDATE.md` |
| **B3 Mandate SHA256** | `5757E5A4548A82A5958B0989C3657F2C44665DFB78CC35776C64EA3DD2416D9F` |
| **Documentary scope** | **OPTION B — DIRECTOR APPROVED** |
| **Authorized operator** | Manolo (machine with `core.hooksPath=.githooks` already active) |
| **Official branch** | `integration/factory-complete-20260725` |
| **Official origin** | `https://github.com/malolico/realestatesniper.git` |
| **Pre-B4 reference HEAD** | `c2c5f7f3b56b750e9bf44b2620baf7be059c658d` |
| **Date** | 2026-07-31 |

---

## 1. Object of B4

B4 is **Exact Staging, Commit and Publication** of Factory Git Hardening to the official remote.

B4 publishes the closed authorized file list (§7) in **one** publication commit, with Manolo’s local hook already active, then pushes to the official upstream and verifies post-push state.

B4 does **not**:

- implement new Hardening code;
- change `core.hooksPath`;
- re-run B3 activation;
- activate Carlos;
- authorize B5;
- modify Factory functional runtime, Supabase, Web, Arizona, or Marketplace.

---

## 2. Authority

This document is the **sole Official Implementation Mandate** governing B4 execution.

- Parent Plans and Ops Protocol are reference.
- **Execution authority for B4 is this Mandate only.**
- Creation of this file does **not** execute B4.
- Director gate text (Parent Phase B Plan):

```text
Aprobado. Publica Factory Git Hardening Fase B.
```

**OPTION B** documentary expansion is **DIRECTOR APPROVED**. No other files are authorized.

---

## 3. Ámbito

### 3.1 In scope

- READ ONLY baseline and hard gates;
- exact `git add --` of authorized paths only;
- guard execution;
- staged `name-status` 1:1 review;
- one publication `git commit` (hook must run);
- normal `git push` to the official branch upstream;
- post-push full verification;
- B4 evidence report.

### 3.2 Out of scope

- B5 Carlos activation;
- B6 closeout;
- any path not listed in §7;
- Git config mutation;
- hook/script/content edits during B4;
- force-push or multi-branch push.

---

## 4. Precondiciones

All must be true before staging:

| # | Precondition |
|---|--------------|
| 1 | B2 COMPLETE |
| 2 | B3 COMPLETE with `B3 ACTIVATION PASS` (or already-active verified) |
| 3 | `core.hooksPath` = `.githooks` on Manolo |
| 4 | Official verifier PASS with active hooks (no inactive bypass) |
| 5 | Branch = `integration/factory-complete-20260725` |
| 6 | Origin = `https://github.com/malolico/realestatesniper.git` |
| 7 | Local HEAD = remote HEAD |
| 8 | Ahead = `0`, Behind = `0` |
| 9 | Pre-B4 HEAD = `c2c5f7f3b56b750e9bf44b2620baf7be059c658d` unless Director amends in writing |
| 10 | Staged files = `0` before B4 staging |
| 11 | OPTION B Director-approved |
| 12 | Director gate for B4 publication granted |
| 13 | All ten §7 paths exist on disk |
| 14 | No unauthorized tracked dirty paths |

If any precondition fails:

```text
B4 BLOCKED
```

**STOP.**

---

## 5. Hard Gates

Any Hard Gate FAIL ⇒

```text
B4 BLOCKED
```

**STOP immediately.** Do not continue. Do not auto-repair.

Hard Gates include:

1. Identity (root / origin / branch).  
2. HEAD sync hard-fail (`0/0`, local = remote).  
3. `core.hooksPath` exactly `.githooks`.  
4. Staged = `0` at start.  
5. Exact staging of §7 only.  
6. Guard exit `0`.  
7. Cached `name-status` matches §7 **1:1** (no extras, no missing authorized paths intended for this commit).  
8. Commit without `--no-verify`.  
9. Push only official branch upstream; no force / mirror / all / other branch.  
10. Post-push HEAD local = remote; ahead/behind `0/0`.  
11. Post-push verifier PASS.  
12. Working tree clean of unauthorized staged state after publish.

---

## 6. Secuencia completa B4

### STEP B4-00 — Director authorization check

Confirm Director gate + OPTION B approval.  
**Mutations:** none.  
FAIL ⇒ `B4 BLOCKED`.

### STEP B4-01 — Baseline (READ ONLY)

Record: root, origin, branch, HEAD local/remote, ahead/behind, staged, status, hooksPath, hooks inventory, presence of all §7 paths, Plan/Mandate hashes as applicable.  
**Mutations:** none.

### STEP B4-02 — Hard Gates pre-stage

Enforce §4 and §5 items applicable before staging.  
FAIL ⇒ `B4 BLOCKED`.

### STEP B4-03 — Exact staging

Execute **only** these commands (or equivalent exact pathspecs, one path each):

```powershell
git add -- .gitignore
git add -- .gitattributes
git add -- .githooks/pre-commit
git add -- scripts/git/guardStagedForbiddenPaths.js
git add -- scripts/git/installGitHardening.ps1
git add -- scripts/git/verifyGitHardening.ps1
git add -- docs/factory-construction/FACTORY_GIT_HARDENING_OPS_PROTOCOL.md
git add -- docs/factory-construction/FACTORY_GIT_HARDENING_PHASE_B_OFFICIAL_IMPLEMENTATION_PLAN.md
git add -- docs/factory-construction/FACTORY_GIT_HARDENING_B3_MANOLO_LOCAL_ACTIVATION_MANDATE.md
git add -- docs/factory-construction/FACTORY_GIT_HARDENING_PHASE_B4_OFFICIAL_IMPLEMENTATION_PLAN.md
```

Any other add ⇒ `B4 BLOCKED`.

### STEP B4-04 — Guard

```powershell
node scripts/git/guardStagedForbiddenPaths.js
```

Expected exit `0`.  
Exit `1` or `2` ⇒ `B4 BLOCKED`.

### STEP B4-05 — Name-status 1:1 review

```powershell
git status --short
git diff --cached --name-status
```

Staged set must equal §7 exactly.  
Mismatch ⇒ `B4 BLOCKED`.

### STEP B4-06 — Commit

One publication commit. Hook must run.

Suggested message:

```text
Publish Factory Git Hardening Phase B (B4).

Publish the Director-approved closed file list: technical Hardening
package plus Phase B governance documents (OPTION B). Manolo local
hooksPath was already active before this commit.
```

**Forbidden:** `git commit --no-verify`.

### STEP B4-07 — Push

```powershell
git push
```

Only normal push of the official branch to its configured upstream.  
**Forbidden:** `--force`, `--mirror`, `--all`, pushing another branch.

### STEP B4-08 — Post-push full verification

Mandatory second complete verification (§10).  
FAIL ⇒ `B4 BLOCKED` (STOP; no automatic rollback).

### STEP B4-09 — Evidence report

Produce §13 evidence package and official terminal.

### STEP B4-10 — STOP

End Mandate. Do **not** start B5.

---

## 7. Lista EXACTA de archivos autorizados

The **only** authorized paths for B4 staging and publication are:

1. `.gitignore`  
2. `.gitattributes`  
3. `.githooks/pre-commit`  
4. `scripts/git/guardStagedForbiddenPaths.js`  
5. `scripts/git/installGitHardening.ps1`  
6. `scripts/git/verifyGitHardening.ps1`  
7. `docs/factory-construction/FACTORY_GIT_HARDENING_OPS_PROTOCOL.md`  
8. `docs/factory-construction/FACTORY_GIT_HARDENING_PHASE_B_OFFICIAL_IMPLEMENTATION_PLAN.md`  
9. `docs/factory-construction/FACTORY_GIT_HARDENING_B3_MANOLO_LOCAL_ACTIVATION_MANDATE.md`  
10. `docs/factory-construction/FACTORY_GIT_HARDENING_PHASE_B4_OFFICIAL_IMPLEMENTATION_PLAN.md`  

**Authorized file count:** `10`.

Any path outside this list:

```text
B4 BLOCKED
```

**STOP.**

This Mandate does not authorize any additional path.

---

## 8. Prohibiciones absolutas

The operator **must not** execute or perform:

- `git add .`  
- `git add -A`  
- `git add -f` as normal procedure  
- `git commit --no-verify`  
- `git push --force`  
- `git push --mirror`  
- `git push --all`  
- `git push` of another branch  
- `git config` (local or global) during B4  
- modifying hooks  
- modifying scripts  
- editing any authorized or unauthorized file content during B4 execution  
- adding any file not listed in §7  
- continuing after any Hard Gate FAIL  
- automatic rollback  
- starting B5  
- activating Carlos  

Violation ⇒ `B4 BLOCKED`.

---

## 9. Validaciones

Mandatory validations:

| Checkpoint | Requirement |
|------------|-------------|
| Baseline | Recorded complete |
| HEAD sync | Local = remote; ahead/behind `0/0` before staging |
| Staged initial | `0` |
| Exact staging | Only §7 |
| Guard | Exit `0` |
| Name-status | 1:1 with §7 |
| Commit | Succeeds; hook runs |
| Push | Succeeds to official upstream |
| Post-push HEAD | Local = remote |
| Ahead/behind | `0/0` |
| Working tree | No unauthorized staged residue; publication scope tracked |
| Hook operativo | `core.hooksPath` still `.githooks` |
| Verifier | PASS after push |

---

## 10. Verificación post-push

After push, run a **second complete verification**:

1. `git rev-parse HEAD` (local)  
2. `git rev-parse @{u}` (remote)  
3. Confirm equal  
4. `git rev-list --left-right --count HEAD...@{u}` = `0 0`  
5. `git diff --cached --name-only` empty  
6. `git config --local --get core.hooksPath` = `.githooks`  
7. Confirm all ten §7 paths are tracked at the new HEAD  
8. `powershell -NoProfile -ExecutionPolicy Bypass -File scripts/git/verifyGitHardening.ps1` → `PASS`  
9. Confirm no unauthorized paths were introduced in the publication commit (`git show --name-status --pretty=format: HEAD` must match §7)  
10. Confirm Carlos was not activated and B5 was not started  

Any failure ⇒ `B4 BLOCKED`. **STOP.** No automatic rollback.

---

## 11. STOP conditions

Immediate STOP on:

- precondition failure;  
- Hard Gate FAIL;  
- guard non-zero;  
- name-status mismatch;  
- commit/push failure;  
- post-push verification failure;  
- discovery of any unauthorized staged or committed path;  
- any prohibited command executed or attempted as part of B4.

Terminal:

```text
B4 BLOCKED
```

---

## 12. Rollback boundary

Rollback is **not authorized** by this Mandate.

- No automatic rollback.  
- No `git reset` / `git restore` / `git clean` as B4 remediation.  
- No force-push history rewrite as B4 remediation.  
- Any corrective action requires a **separate Director Mandate**.

---

## 13. Evidencias obligatorias

The B4 Execution Report must record:

| Evidence |
|----------|
| Director authorization / OPTION B approval |
| Baseline (root, origin, branch, HEADs, ahead/behind, staged, hooksPath) |
| Pre-stage Hard Gate results |
| Exact `git add --` commands used |
| Guard stdout/stderr/exit |
| `git diff --cached --name-status` |
| Commit SHA |
| Commit name-status |
| Push result |
| Post-push local HEAD |
| Post-push remote HEAD |
| Post-push ahead/behind |
| Post-push verifier result |
| hooksPath after |
| Confirmation Carlos not activated |
| Official terminal |

---

## 14. Terminales oficiales

Only these terminals:

```text
B4 PUBLICATION PASS
```

```text
B4 BLOCKED
```

Do not use installer-only strings as the B4 final verdict.

---

## 15. Transición a B5

**B4 never activates Carlos.**

After `B4 PUBLICATION PASS`:

```text
STOP.
```

The next block requires an **independent Mandate for B5** (Carlos synchronization and local activation).

This Mandate does **not** authorize B5.

---

## 16. End of Mandate

End of `FACTORY_GIT_HARDENING_B4_IMPLEMENTATION_MANDATE`.

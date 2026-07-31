# FACTORY GIT HARDENING — PHASE B.3
# OFFICIAL MANOLO LOCAL ACTIVATION MANDATE

| Campo | Valor |
|-------|--------|
| **Document title** | Factory Git Hardening — Phase B.3 Official Manolo Local Activation Mandate |
| **Phase ID** | `B3` |
| **Mandate ID** | `FACTORY_GIT_HARDENING_B3_MANOLO_LOCAL_ACTIVATION_MANDATE` |
| **Path** | `docs/factory-construction/FACTORY_GIT_HARDENING_B3_MANOLO_LOCAL_ACTIVATION_MANDATE.md` |
| **Nature** | Normative · Executable · Local-only · Auditable · Idempotent · Fail-closed |
| **Authorized actor** | Manolo |
| **Authorized machine** | Manolo local workstation only |
| **Official repository root** | `C:\Users\Malolico\realestatesniper` |
| **Official branch** | `integration/factory-complete-20260725` |
| **Reference HEAD** | `c2c5f7f3b56b750e9bf44b2620baf7be059c658d` |
| **Parent Plan** | `FACTORY_GIT_HARDENING_PHASE_B_OFFICIAL_IMPLEMENTATION_PLAN.md` |
| **Plan SHA256** | `C49030D70EA88549EB473E911F23085A7C6DEE87D092F86F23CF85B3D0D4F82C` |
| **Ops Protocol** | `FACTORY_GIT_HARDENING_OPS_PROTOCOL.md` |
| **Relation to B2** | B2 Implementation + Independent Implementation Audit + Targeted Minor Correction Verification Audit must be PASS (or PASS WITH OBSERVATIONS closed) before this Mandate may execute |
| **Relation to B4** | B4 (publish) is **not** authorized by this Mandate; B4 requires a separate Director gate after B3 PASS |
| **Relation to B5** | **EXCLUDED.** This Mandate does not authorize Carlos activation. B5 requires its own formal Mandate |
| **Date** | 2026-07-31 |

---

## 1. Identity

This document is the **sole Official Activation Mandate** governing Phase B.3 on Manolo’s machine.

It supersedes informal activation from Plan/Ops fragments alone. Ops Protocol and Plan remain reference; **execution authority for B3 is this Mandate only**.

**Scope:** local Git configuration on Manolo’s clone of the official repository.

**Out of scope:** GitHub content mutation, Carlos machine, B4 staging/commit/push, Factory functional code, Supabase, Web, Arizona, Marketplace, runtime physical stores, backup mutation.

---

## 2. Objective

B3 has **one** objective:

Activate the already-implemented and audited Factory Git Hardening protection **locally on Manolo** by:

1. Mandatory dry-run of `scripts/git/installGitHardening.ps1` (no `-Apply`);
2. Controlled single mutation via:

```powershell
powershell -NoProfile -ExecutionPolicy Bypass -File scripts/git/installGitHardening.ps1 -Apply
```

which (when authorized) performs exactly:

```text
git config --local core.hooksPath .githooks
```

3. Mandatory post-Apply official verification via:

```powershell
powershell -NoProfile -ExecutionPolicy Bypass -File scripts/git/verifyGitHardening.ps1
```

No other operational action is authorized under this Mandate.

---

## 3. Authority and limits

### 3.1 AUTORIZADO

- READ ONLY baseline and hard-gate checks;
- installer dry-run (no `-Apply`);
- **one** controlled `-Apply` execution (or idempotent re-verify if already `.githooks`);
- official verifier post-Apply;
- reading local `core.hooksPath`;
- inventory of `.git/hooks`;
- execution of the staged-path guard with clean index (as invoked by installer/verifier);
- capture of evidence for the Activation Report.

### 3.2 PROHIBIDO

- `git add` / `git commit` / `git push` / `git pull`;
- `git reset` / `git restore` / `git clean` / `git rm`;
- `git checkout` / `git switch` / `git stash` / `git merge` / `git rebase`;
- any `git config --global` or non-local config mutation;
- editing repository files (code, docs other than future independent Mandates, configs);
- automatic remediation or “fix” scripts;
- automatic rollback;
- activation on Carlos;
- any Supabase / Web / Arizona / Marketplace / Factory functional mutation;
- any GitHub mutation (push, PR, release, remote rewrite);
- improvising alternate activation commands outside this Mandate;
- manual `git config --local core.hooksPath .githooks` outside the installer unless a **separate** Director Mandate later authorizes it.

### 3.3 Explicit non-effects

This Mandate declares that compliant B3 execution:

- activates **only** Manolo’s local environment;
- **does not** modify GitHub;
- **does not** modify Carlos;
- **does not** modify HEAD;
- **does not** modify versioned file contents;
- **does not** create staged files;
- **does not** create a commit;
- **does not** create a push;
- authorizes **only** this mutation:

```text
git config --local core.hooksPath .githooks
```

---

## 4. Baseline hard gate

Before dry-run or `-Apply`, **all** of the following are **HARD FAIL** (not warnings).

| # | Condition |
|---|-----------|
| 1 | Git root exact: `C:\Users\Malolico\realestatesniper` (or equivalent resolved path of the official clone) |
| 2 | Origin exact: `https://github.com/malolico/realestatesniper.git` |
| 3 | Branch exact: `integration/factory-complete-20260725` |
| 4 | Local HEAD exact: `c2c5f7f3b56b750e9bf44b2620baf7be059c658d` (unless Director amends reference HEAD in writing) |
| 5 | Remote upstream HEAD exact: same SHA |
| 6 | Local HEAD = remote HEAD |
| 7 | Ahead = `0` |
| 8 | Behind = `0` |
| 9 | Staged files = `0` |
| 10 | Tracked/untracked scope matches authorized Hardening ImpL state (see §4.1) |
| 11 | `core.hooksPath` empty **or** exactly `.githooks` |
| 12 | `.git/hooks` inventory: only `*.sample` allowed as non-hardening entries |
| 13 | Plan SHA256 = `C49030D70EA88549EB473E911F23085A7C6DEE87D092F86F23CF85B3D0D4F82C` |
| 14 | Hardening artifacts present (`.githooks/pre-commit`, guard, installer, verifier, `.gitattributes`, Ops Protocol, `.gitignore` Hardening block) |
| 15 | PowerShell 5.1+ capable of parsing/running the installer and verifier |
| 16 | Official Pre–Fase B backup present (path known to Director; **do not modify**) |
| 17 | No residual TEMP hardening/parser-C test repositories under `%TEMP%` with active markers |

### 4.1 Expected working-tree scope (documentary)

Expected porcelain (names may appear as directories in short status):

- tracked modify: `.gitignore` (authorized Hardening block);
- untracked: `.gitattributes`, `.githooks/pre-commit`, `scripts/git/*` (guard, installer, verifier), Ops Protocol, Plan, **and this Mandate** once created.

Any **unauthorized tracked** dirty path → **ACTIVATION BLOCKED**.

### 4.2 HEAD synchronization — HARD FAIL

HEAD local/remote mismatch, ahead≠0, or behind≠0 ⇒ **ACTIVATION BLOCKED** immediately.

Installer internal “WARNING” on HEAD desync **must not** be treated as sufficient. This Mandate **overrides** soft warnings: the operator **stops** before `-Apply`.

If any hard-gate condition fails:

```text
ACTIVATION BLOCKED
```

**STOP.** No automatic repair.

---

## 5. Idempotent states

### RUTA A — First activation

`core.hooksPath` is empty → dry-run PASS → controlled `-Apply` sets `.githooks` → post checks → verifier PASS → **B3 ACTIVATION PASS**.

### RUTA B — Already active

`core.hooksPath` is exactly `.githooks` → dry-run PASS → `-Apply` must **not** rewrite unnecessarily; installer idempotent path + full post checks → verifier PASS → **B3 ACTIVATION PASS — ALREADY ACTIVE AND VERIFIED**.

### Any other `core.hooksPath` value

```text
ACTIVATION BLOCKED
```

**STOP.** No overwrite.

---

## 6. Mandatory dry-run

Before `-Apply`, execute exactly:

```powershell
powershell -NoProfile -ExecutionPolicy Bypass -File scripts/git/installGitHardening.ps1
```

Expected: installer reports `DRY RUN PASS`.

If blocked, error, non-contractual exit, or unexpected mutation:

```text
ACTIVATION BLOCKED
```

Do **not** proceed to `-Apply`.

---

## 7. Single authorized mutation

Literal authorized mutation (performed **only** by the installer `-Apply` path):

```text
git config --local core.hooksPath .githooks
```

Clarifications:

- **local** scope only;
- **never** `--global`;
- does not modify repository files;
- does not modify GitHub;
- does not modify Carlos;
- does not modify HEAD;
- does not modify the index;
- does not modify the working tree contents.

---

## 8. Controlled Apply

Authorized Apply command (PowerShell 5.1 compatible):

```powershell
powershell -NoProfile -ExecutionPolicy Bypass -File scripts/git/installGitHardening.ps1 -Apply
```

No alternate improvisation. No manual `git config` under this Mandate.

Expected installer evidence includes `APPLY PASS` (first activation or idempotent).

Internal installer strings such as `INSTALLATION BLOCKED - …` are **evidence only**. The **official Mandate terminal** remains:

```text
ACTIVATION BLOCKED
```

when B3 cannot complete.

---

## 9. Post-Apply verification (two mandatory layers)

### CAPA 1 — Installer internal post-Apply

Must confirm:

- `core.hooksPath` exact `.githooks`;
- `.githooks/pre-commit` exists;
- `scripts/git/guardStagedForbiddenPaths.js` exists;
- guard clean-index exit `0`;
- idempotent path validated when already active.

### CAPA 2 — Official verifier (MANDATORY)

```powershell
powershell -NoProfile -ExecutionPolicy Bypass -File scripts/git/verifyGitHardening.ps1
```

Must end with:

```text
GIT HARDENING LOCAL STATUS:
PASS
```

B3 is **not** complete on installer PASS alone.

If verifier fails:

```text
ACTIVATION BLOCKED
```

**STOP.** No automatic rollback. Preserve evidence. Report to Director.

Note: After successful Apply, `core.hooksPath` is active — do **not** use `-AllowInactiveHooksPath` for the official B3 verifier run.

---

## 10. Final READ ONLY verification

Confirm:

- `core.hooksPath` = `.githooks`;
- local HEAD unchanged from pre-Apply checkpoint;
- remote HEAD unchanged;
- ahead/behind = `0/0`;
- staged = `0`;
- working tree scope matches §4.1;
- hook and guard present;
- verifier PASS recorded;
- no unexpected files;
- no relevant TEMP residual test repos;
- GitHub unchanged;
- Carlos unchanged.

---

## 11. Failure management

Any failed hard gate, dry-run, Apply, post-Apply layer, or verifier yields:

```text
ACTIVATION BLOCKED
```

Operator must:

1. **STOP**;
2. not improvise;
3. not edit files;
4. not retry with ad-hoc variants;
5. not auto-rollback;
6. preserve evidence;
7. inform the Director.

### Failure classes

| Class | Meaning |
|-------|---------|
| Before `-Apply` | Hard gate or dry-run failed; config must remain as before |
| During `-Apply` | Installer failed mid-path; treat as BLOCKED; diagnose before any further action |
| Post-Apply internal | Installer set or confirmed hooksPath but internal guard/hook checks failed — **STOP**; hooksPath may be active; **no auto-rollback** |
| Verifier failure | Installer may have reported APPLY PASS but official B3 incomplete — **ACTIVATION BLOCKED** |
| hooksPath active + verification failed | Intermediate state; manual Director decision required; rollback only via independent Mandate |

In **all** classes: **STOP**.

---

## 12. Manual rollback (not authorized in B3)

Rollback is **not** authorized by this Mandate.

Conceptual reference only (Plan/Ops):

- requires express Director decision;
- requires an **independent** Mandate;
- never automatic;
- only if `core.hooksPath` is exactly `.githooks`;
- must **not** be executed during B3 activation.

Do **not** run rollback under B3.

---

## 13. Mandatory evidence (Activation Report)

The B3 Activation Report must record:

| Evidence field |
|----------------|
| root |
| origin |
| branch |
| HEAD local |
| HEAD remote |
| ahead/behind |
| staged |
| `core.hooksPath` before |
| dry-run result |
| `-Apply` result |
| post-Apply internal guard result |
| verifier result |
| `core.hooksPath` after |
| hooks inventory |
| final HEAD |
| final staged |
| working tree scope |
| GitHub unchanged |
| Carlos unaffected |
| final verdict |

---

## 14. Contractual terminals

Only these official B3 terminals:

```text
B3 ACTIVATION PASS
```

```text
B3 ACTIVATION PASS — ALREADY ACTIVE AND VERIFIED
```

```text
ACTIVATION BLOCKED
```

Do **not** use `INSTALLATION BLOCKED` as the Mandate’s final verdict (installer internals may still emit it as evidence).

---

## 15. Transition to B4

B4 may begin **only if**:

- B3 ends in `B3 ACTIVATION PASS` or `B3 ACTIVATION PASS — ALREADY ACTIVE AND VERIFIED`;
- `core.hooksPath` = `.githooks`;
- verifier = PASS;
- HEAD unchanged by B3;
- staged = `0`;
- no open activation observations;
- Director formally accepts the B3 result.

**This Mandate does not authorize B4.**

---

## 16. Carlos exclusion

- This Mandate is **not** executed on Carlos;
- does **not** activate Carlos;
- does **not** modify Carlos configuration;
- B5 requires its own formal Mandate (or formal documentary adaptation);
- GitHub does **not** propagate `core.hooksPath`.

---

## 17. Numbered execution sequence

### STEP B3-00 — Director authorization check

| Item | Requirement |
|------|-------------|
| **Objective** | Confirm Director gate text authorizing Manolo local activation |
| **Commands** | None (documentary/authorization check) |
| **Expected** | Explicit Director approval equivalent to Plan gate B3: activation of Manolo local protection |
| **Block** | Missing/ambiguous authorization → `ACTIVATION BLOCKED` |
| **Evidence** | Authorization record |
| **Mutations allowed** | None |
| **Mutations forbidden** | All |

### STEP B3-01 — Read-only baseline

| Item | Requirement |
|------|-------------|
| **Objective** | Capture current identity and state |
| **Commands** | `git rev-parse --show-toplevel`; `git remote get-url origin`; `git branch --show-current`; `git rev-parse HEAD`; `git rev-parse @{u}`; `git rev-list --left-right --count HEAD...@{u}`; `git status --short`; `git diff --cached --name-status`; `git config --local --get core.hooksPath`; inventory `.git/hooks`; Plan hash; artifact existence; backup presence; TEMP residual check |
| **Expected** | Values recorded; matches §4 |
| **Block** | Inability to read baseline → `ACTIVATION BLOCKED` |
| **Evidence** | Full baseline dump |
| **Mutations allowed** | None |
| **Mutations forbidden** | All |

### STEP B3-02 — Hard gates

| Item | Requirement |
|------|-------------|
| **Objective** | Enforce §4 hard fails including HEAD sync |
| **Commands** | Same READ ONLY set as B3-01 (evaluation only) |
| **Expected** | All 17 hard-gate conditions PASS |
| **Block** | Any failure → `ACTIVATION BLOCKED` + STOP |
| **Evidence** | Gate checklist with pass/fail per item |
| **Mutations allowed** | None |
| **Mutations forbidden** | All |

### STEP B3-03 — Dry-run

| Item | Requirement |
|------|-------------|
| **Objective** | Prove installer would succeed without mutation |
| **Commands** | `powershell -NoProfile -ExecutionPolicy Bypass -File scripts/git/installGitHardening.ps1` |
| **Expected** | `DRY RUN PASS`; `core.hooksPath` unchanged |
| **Block** | Non-PASS → `ACTIVATION BLOCKED` |
| **Evidence** | Dry-run stdout/stderr + hooksPath after |
| **Mutations allowed** | None |
| **Mutations forbidden** | `-Apply`; any git config write |

### STEP B3-04 — Pre-Apply immutable checkpoint

| Item | Requirement |
|------|-------------|
| **Objective** | Freeze reference state immediately before mutation |
| **Commands** | Re-read HEAD local/remote, ahead/behind, staged, hooksPath, status |
| **Expected** | Identical to hard-gate PASS state |
| **Block** | Drift → `ACTIVATION BLOCKED` |
| **Evidence** | Checkpoint record |
| **Mutations allowed** | None |
| **Mutations forbidden** | All |

### STEP B3-05 — Controlled Apply

| Item | Requirement |
|------|-------------|
| **Objective** | Perform sole authorized mutation (or idempotent confirm) |
| **Commands** | `powershell -NoProfile -ExecutionPolicy Bypass -File scripts/git/installGitHardening.ps1 -Apply` |
| **Expected** | Installer `APPLY PASS` |
| **Block** | Failure → `ACTIVATION BLOCKED` (STOP; no auto-rollback) |
| **Evidence** | Apply stdout/stderr |
| **Mutations allowed** | Only installer-mediated `git config --local core.hooksPath .githooks` |
| **Mutations forbidden** | Manual config; global config; all git content ops |

### STEP B3-06 — Installer post-Apply verification

| Item | Requirement |
|------|-------------|
| **Objective** | Confirm CAPA 1 embedded results |
| **Commands** | Observe Apply output; optionally READ ONLY re-check hooksPath, hook/guard paths, `node scripts/git/guardStagedForbiddenPaths.js` expect `0` |
| **Expected** | hooksPath `.githooks`; hook/guard present; guard `0` |
| **Block** | Any miss → `ACTIVATION BLOCKED` |
| **Evidence** | CAPA 1 checklist |
| **Mutations allowed** | None |
| **Mutations forbidden** | All |

### STEP B3-07 — Official verifier

| Item | Requirement |
|------|-------------|
| **Objective** | CAPA 2 mandatory official local status |
| **Commands** | `powershell -NoProfile -ExecutionPolicy Bypass -File scripts/git/verifyGitHardening.ps1` |
| **Expected** | `GIT HARDENING LOCAL STATUS: PASS` |
| **Block** | FAIL/BLOCKED → `ACTIVATION BLOCKED` |
| **Evidence** | Full verifier output |
| **Mutations allowed** | None (verifier is READ ONLY) |
| **Mutations forbidden** | `-AllowInactiveHooksPath` for official B3 closeout; any config write |

### STEP B3-08 — Final immutable-state verification

| Item | Requirement |
|------|-------------|
| **Objective** | Prove B3 did not alter HEAD/index/GitHub/Carlos; only local hooksPath |
| **Commands** | Same READ ONLY identity/status/hooksPath checks as §10 |
| **Expected** | HEAD match pre-Apply; staged `0`; hooksPath `.githooks`; scope §4.1 |
| **Block** | Unexpected drift → `ACTIVATION BLOCKED` |
| **Evidence** | Before/after comparison |
| **Mutations allowed** | None |
| **Mutations forbidden** | All |

### STEP B3-09 — Activation report

| Item | Requirement |
|------|-------------|
| **Objective** | Produce §13 evidence package and official terminal |
| **Commands** | Documentary report only |
| **Expected** | `B3 ACTIVATION PASS` or `B3 ACTIVATION PASS — ALREADY ACTIVE AND VERIFIED` |
| **Block** | Incomplete evidence → `ACTIVATION BLOCKED` |
| **Evidence** | Activation Report |
| **Mutations allowed** | None |
| **Mutations forbidden** | All |

### STEP B3-10 — STOP

| Item | Requirement |
|------|-------------|
| **Objective** | End Mandate; do not enter B4 |
| **Commands** | None |
| **Expected** | Operator stops; awaits Director decision on B4 |
| **Block** | N/A |
| **Evidence** | STOP acknowledged |
| **Mutations allowed** | None |
| **Mutations forbidden** | All further activation/publication actions under this Mandate |

---

## 18. Findings closure traceability

| Finding | Classification | Closure mechanism | Mandate section |
|---------|----------------|-------------------|-----------------|
| **M1** Official Mandate absent | MAJOR | This document is the unique Official Manolo Local Activation Mandate | §1 Identity; entire document; filename/path |
| **m1** HEAD sync warning only | MINOR | HEAD sync elevated to **HARD FAIL** before dry-run/`-Apply`; installer WARNING insufficient | §4 items 4–8; §4.2; STEP B3-02 |
| **m2** Verifier discretionary | MINOR | `verifyGitHardening.ps1` **mandatory** CAPA 2 after Apply; B3 incomplete without PASS | §2; §9 CAPA 2; STEP B3-07 |
| **m3** Wrong terminal nomenclature | MINOR | Official terminals are `ACTIVATION BLOCKED` / `B3 ACTIVATION PASS` / `B3 ACTIVATION PASS — ALREADY ACTIVE AND VERIFIED`; installer `INSTALLATION BLOCKED` is evidence only | §8; §11; §14; STEPs failure paths |

---

## 19. Documentary provenance

Created under Director order: **FACTORY GIT HARDENING — PHASE B.3 OFFICIAL MANOLO LOCAL ACTIVATION MANDATE — DOCUMENTARY CREATION ONLY**.

Creation of this file does **not** activate `core.hooksPath`, does **not** execute `-Apply`, and does **not** authorize B4/B5.

---

## 20. End of Mandate

End of `FACTORY_GIT_HARDENING_B3_MANOLO_LOCAL_ACTIVATION_MANDATE`.
